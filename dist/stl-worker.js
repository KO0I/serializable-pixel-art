"use strict";

function progress(stage, value, detail = "") {
  self.postMessage({ type: "progress", stage, value, detail });
}

function parseBinaryStl(buffer, triangleCount) {
  const view = new DataView(buffer);
  const vertices = new Float64Array(triangleCount * 9);
  let target = 0;

  for (let triangle = 0; triangle < triangleCount; triangle += 1) {
    const triangleOffset = 84 + triangle * 50 + 12;
    for (let component = 0; component < 9; component += 1) {
      const value = view.getFloat32(triangleOffset + component * 4, true);
      if (!Number.isFinite(value)) throw new Error("The STL contains invalid coordinates.");
      vertices[target] = value;
      target += 1;
    }
  }
  return vertices;
}

function parseAsciiStl(buffer) {
  const text = new TextDecoder().decode(buffer);
  const number = "[-+]?(?:\\d*\\.\\d+|\\d+\\.?)(?:[eE][-+]?\\d+)?";
  const vertexPattern = new RegExp(`\\bvertex\\s+(${number})\\s+(${number})\\s+(${number})`, "gi");
  const values = [];
  let match;

  while ((match = vertexPattern.exec(text)) !== null) {
    values.push(Number(match[1]), Number(match[2]), Number(match[3]));
  }
  if (values.length < 9 || values.length % 9 !== 0) {
    throw new Error("The ASCII STL does not contain complete triangular facets.");
  }
  if (values.some((value) => !Number.isFinite(value))) {
    throw new Error("The STL contains invalid coordinates.");
  }
  return Float64Array.from(values);
}

function parseStl(buffer) {
  if (buffer.byteLength < 15) throw new Error("The STL file is empty or truncated.");
  if (buffer.byteLength >= 84) {
    const view = new DataView(buffer);
    const count = view.getUint32(80, true);
    const expectedSize = 84 + count * 50;
    if (count > 0 && expectedSize <= buffer.byteLength) {
      return parseBinaryStl(buffer, count);
    }
  }
  return parseAsciiStl(buffer);
}

function meshBounds(vertices) {
  const minimum = [Infinity, Infinity, Infinity];
  const maximum = [-Infinity, -Infinity, -Infinity];
  for (let index = 0; index < vertices.length; index += 3) {
    for (let axis = 0; axis < 3; axis += 1) {
      minimum[axis] = Math.min(minimum[axis], vertices[index + axis]);
      maximum[axis] = Math.max(maximum[axis], vertices[index + axis]);
    }
  }
  const span = maximum.map((value, axis) => value - minimum[axis]);
  if (!span.every((value) => Number.isFinite(value) && value > 0)) {
    throw new Error("The STL has no measurable three-dimensional extent.");
  }
  return { minimum, maximum, span };
}

function intersectTriangleAtZ(vertices, offset, planeZ) {
  const points = [
    [vertices[offset], vertices[offset + 1], vertices[offset + 2]],
    [vertices[offset + 3], vertices[offset + 4], vertices[offset + 5]],
    [vertices[offset + 6], vertices[offset + 7], vertices[offset + 8]],
  ];
  const intersections = [];
  const edges = [[0, 1], [1, 2], [2, 0]];

  edges.forEach(([firstIndex, secondIndex]) => {
    const first = points[firstIndex];
    const second = points[secondIndex];
    const crosses =
      (first[2] <= planeZ && second[2] > planeZ) ||
      (second[2] <= planeZ && first[2] > planeZ);
    if (!crosses) return;
    const amount = (planeZ - first[2]) / (second[2] - first[2]);
    intersections.push([
      first[0] + (second[0] - first[0]) * amount,
      first[1] + (second[1] - first[1]) * amount,
    ]);
  });

  return intersections.length === 2 ? intersections : null;
}

function markSegment(mask, width, height, firstX, firstY, secondX, secondY) {
  const deltaX = secondX - firstX;
  const deltaY = secondY - firstY;
  const steps = Math.max(1, Math.ceil(Math.max(Math.abs(deltaX), Math.abs(deltaY)) * 2));
  for (let step = 0; step <= steps; step += 1) {
    const amount = step / steps;
    const x = Math.floor(firstX + deltaX * amount);
    const y = Math.floor(firstY + deltaY * amount);
    if (x >= 0 && x < width && y >= 0 && y < height) {
      mask[y * width + x] = 1;
    }
  }
}

function rasterizeSlice(segments, width, height) {
  const mask = new Uint8Array(width * height);
  let oddScanlines = 0;

  for (let y = 0; y < height; y += 1) {
    const scanY = y + 0.5;
    const crossings = [];
    for (let index = 0; index < segments.length; index += 4) {
      const firstX = segments[index];
      const firstY = segments[index + 1];
      const secondX = segments[index + 2];
      const secondY = segments[index + 3];
      const crosses =
        (firstY <= scanY && secondY > scanY) ||
        (secondY <= scanY && firstY > scanY);
      if (!crosses) continue;
      crossings.push(
        firstX + (scanY - firstY) * (secondX - firstX) / (secondY - firstY),
      );
    }
    crossings.sort((first, second) => first - second);
    if (crossings.length % 2 !== 0) oddScanlines += 1;
    for (let index = 0; index + 1 < crossings.length; index += 2) {
      const first = Math.max(0, Math.ceil(crossings[index] - 0.5));
      const last = Math.min(width - 1, Math.floor(crossings[index + 1] - 0.5));
      for (let x = first; x <= last; x += 1) mask[y * width + x] = 1;
    }
  }

  for (let index = 0; index < segments.length; index += 4) {
    markSegment(
      mask,
      width,
      height,
      segments[index],
      segments[index + 1],
      segments[index + 2],
      segments[index + 3],
    );
  }
  return { mask, oddScanlines };
}

function sliceMesh(vertices, requestedResolution) {
  const bounds = meshBounds(vertices);
  const resolution = Math.max(16, Math.min(96, Math.round(requestedResolution) || 48));
  const scale = (resolution - 2) / Math.max(...bounds.span);
  const dimensions = bounds.span.map((span) => Math.max(3, Math.ceil(span * scale) + 2));
  const [width, height, depth] = dimensions;
  const segmentsBySlice = Array.from({ length: depth }, () => []);
  const triangleCount = vertices.length / 9;

  progress("slice", 0.12, `Intersecting ${triangleCount.toLocaleString()} triangles`);
  for (let triangle = 0; triangle < triangleCount; triangle += 1) {
    const offset = triangle * 9;
    const firstGridZ = (vertices[offset + 2] - bounds.minimum[2]) * scale + 1;
    const secondGridZ = (vertices[offset + 5] - bounds.minimum[2]) * scale + 1;
    const thirdGridZ = (vertices[offset + 8] - bounds.minimum[2]) * scale + 1;
    const start = Math.max(0, Math.ceil(Math.min(firstGridZ, secondGridZ, thirdGridZ) - 0.5));
    const end = Math.min(
      depth - 1,
      Math.ceil(Math.max(firstGridZ, secondGridZ, thirdGridZ) - 0.5) - 1,
    );

    for (let slice = start; slice <= end; slice += 1) {
      const planeZ = bounds.minimum[2] + (slice - 0.5) / scale;
      const intersection = intersectTriangleAtZ(vertices, offset, planeZ);
      if (!intersection) continue;
      const [first, second] = intersection;
      segmentsBySlice[slice].push(
        (first[0] - bounds.minimum[0]) * scale + 1,
        (bounds.maximum[1] - first[1]) * scale + 1,
        (second[0] - bounds.minimum[0]) * scale + 1,
        (bounds.maximum[1] - second[1]) * scale + 1,
      );
    }
    if (triangle > 0 && triangle % 2500 === 0) {
      progress("slice", 0.12 + 0.43 * triangle / triangleCount, "Building cross-sections");
    }
  }

  const slices = [];
  let oddScanlines = 0;
  let occupiedVoxels = 0;
  segmentsBySlice.forEach((segments, sliceIndex) => {
    const raster = rasterizeSlice(segments, width, height);
    slices.push(raster.mask);
    oddScanlines += raster.oddScanlines;
    occupiedVoxels += raster.mask.reduce((total, value) => total + value, 0);
    progress("raster", 0.57 + 0.28 * (sliceIndex + 1) / depth, "Rasterizing XPM slices");
  });

  return {
    bounds,
    dimensions,
    occupiedVoxels,
    oddScanlines,
    resolution,
    scale,
    slices,
    triangleCount,
  };
}

function safeComment(value) {
  return String(value || "model.stl").replace(/[\r\n]+/g, " ").replace(/[^ -~]/g, "?");
}

function makeXpmAtlas(result, name, color) {
  const [sliceWidth, sliceHeight, sliceCount] = result.dimensions;
  const columns = Math.max(
    1,
    Math.ceil(Math.sqrt(sliceCount * sliceHeight / Math.max(1, sliceWidth))),
  );
  const rows = Math.ceil(sliceCount / columns);
  const atlasWidth = columns * sliceWidth;
  const atlasHeight = rows * sliceHeight;
  const atlas = Array.from({ length: atlasHeight }, () => Array(atlasWidth).fill(" "));

  result.slices.forEach((slice, sliceIndex) => {
    const tileX = sliceIndex % columns * sliceWidth;
    const tileY = Math.floor(sliceIndex / columns) * sliceHeight;
    for (let y = 0; y < sliceHeight; y += 1) {
      for (let x = 0; x < sliceWidth; x += 1) {
        if (slice[y * sliceWidth + x]) atlas[tileY + y][tileX + x] = "X";
      }
    }
  });

  const safeColor = /^#[0-9a-f]{6}$/i.test(color || "") ? color : "#47b6b2";
  return [
    "! XPM2",
    "! xpm-workbench primitive slice-stack",
    `! xpm-workbench slice-size ${sliceWidth} ${sliceHeight}`,
    `! xpm-workbench slice-count ${sliceCount}`,
    `! xpm-workbench slice-layout ${columns} ${rows}`,
    `! xpm-workbench source-stl ${safeComment(name)}`,
    `! xpm-workbench source-triangles ${result.triangleCount}`,
    `! xpm-workbench voxel-resolution ${result.resolution}`,
    `${atlasWidth} ${atlasHeight} 2 1`,
    "! colors",
    "  c None",
    `X c ${safeColor}`,
    "! pixels",
    ...atlas.map((row) => row.join("")),
  ].join("\n");
}

self.onmessage = (event) => {
  try {
    const { buffer, name, resolution, color } = event.data;
    progress("parse", 0.02, "Reading STL triangles");
    const vertices = parseStl(buffer);
    const result = sliceMesh(vertices, resolution);
    progress("encode", 0.9, "Packing the XPM slice atlas");
    const xpm = makeXpmAtlas(result, name, color);
    progress("done", 1, "Import complete");
    self.postMessage({
      type: "result",
      xpm,
      stats: {
        bounds: result.bounds,
        dimensions: result.dimensions,
        occupiedVoxels: result.occupiedVoxels,
        oddScanlines: result.oddScanlines,
        resolution: result.resolution,
        triangleCount: result.triangleCount,
      },
    });
  } catch (error) {
    self.postMessage({
      type: "error",
      message: error instanceof Error ? error.message : "Unable to import this STL.",
    });
  }
};

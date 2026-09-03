function makeMonitorBodyXpm() {
  const width = 95;
  const height = 71;
  const cornerProfile = [9, 7, 5, 4, 3, 2, 1, 1, 0];
  const marginAt = (y) => {
    if (y < 0 || y >= height) return width;
    return cornerProfile[Math.min(y, height - 1 - y)] ?? 0;
  };
  const isInside = (x, y) => {
    const margin = marginAt(y);
    return x >= margin && x < width - margin;
  };
  const rows = Array.from({ length: height }, (_, y) =>
    Array.from({ length: width }, (_, x) => {
      if (!isInside(x, y)) return " ";
      if (
        !isInside(x - 1, y) ||
        !isInside(x + 1, y) ||
        !isInside(x, y - 1) ||
        !isInside(x, y + 1)
      ) {
        return "K";
      }
      return "P";
    }).join(""),
  );
  return `! XPM2
${width} ${height} 3 1
  c None
P c #f5b9cf
K c #252128
${rows.join("\n")}`;
}

function makeMonitorFaceXpm() {
  const width = 75;
  const height = 55;
  const cornerProfile = [6, 4, 3, 2, 1, 0];
  const marginAt = (y) => {
    if (y < 0 || y >= height) return width;
    return cornerProfile[Math.min(y, height - 1 - y)] ?? 0;
  };
  const isInside = (x, y) => {
    const margin = marginAt(y);
    return x >= margin && x < width - margin;
  };
  const rows = Array.from({ length: height }, (_, y) =>
    Array.from({ length: width }, (_, x) => {
      if (!isInside(x, y)) return " ";
      if (
        !isInside(x - 1, y) ||
        !isInside(x + 1, y) ||
        !isInside(x, y - 1) ||
        !isInside(x, y + 1)
      ) {
        return "K";
      }
      if (x === marginAt(y) + 1 || y === 2) return "L";
      const leftEye = x >= 21 && x <= 27 && y >= 18 && y <= 24;
      const rightEye = x >= 47 && x <= 53 && y >= 18 && y <= 24;
      const smile =
        (y === 37 && ((x >= 24 && x <= 27) || (x >= 47 && x <= 50))) ||
        (y === 38 && ((x >= 27 && x <= 31) || (x >= 43 && x <= 47))) ||
        (y === 39 && x >= 31 && x <= 43);
      return leftEye || rightEye || smile ? "K" : "T";
    }).join(""),
  );
  return `! XPM2
${width} ${height} 4 1
  c None
T c #55ddd5
L c #b8fff6
K c #252128
${rows.join("\n")}`;
}

function makeKeyboardXpm() {
  const width = 105;
  const height = 18;
  const keyColumns = [17, 27, 37, 47, 53, 63, 73, 83];
  const rows = Array.from({ length: height }, (_, y) => {
    const margin = Math.round(10 - y * 7 / (height - 1));
    const right = width - 1 - margin;
    return Array.from({ length: width }, (_, x) => {
      if (x < margin || x > right) return " ";
      if (
        y === 0 ||
        y === height - 1 ||
        x === margin ||
        x === right
      ) {
        return "K";
      }
      const inKeyRow = [5, 10].some((top) => y >= top && y < top + 2);
      const inKeyColumn = keyColumns.some((left) => x >= left && x < left + 5);
      if (inKeyRow && inKeyColumn) {
        return "D";
      }
      if (y >= 14 && y < 17 && x >= 35 && x <= 69) {
        return x === 35 || x === 69 || y === 14 || y === 16 ? "K" : "L";
      }
      return y < 17 ? "L" : "P";
    }).join("");
  });
  return `! XPM2
${width} ${height} 5 1
  c None
P c #f5b9cf
L c #ffe7ef
D c #d96f99
K c #252128
${rows.join("\n")}`;
}

function makeDesktopFloppyXpm() {
  const width = 85;
  const height = 16;
  const rows = Array.from({ length: height }, (_, y) =>
    Array.from({ length: width }, (_, x) => {
      const corner = (x === 0 || x === width - 1) && (y === 0 || y === height - 1);
      if (corner) return " ";
      if (x === 0 || x === width - 1 || y === 0 || y === height - 1) return "K";
      const driveSlot = y >= 5 && y <= 8 && x >= 10 && x <= 48;
      if (driveSlot) {
        return y === 5 || y === 8 || x === 10 || x === 48 ? "K" : "L";
      }
      if (y >= 6 && y <= 8 && ((x >= 65 && x <= 67) || (x >= 73 && x <= 75))) {
        return "K";
      }
      return "P";
    }).join(""),
  );
  return `! XPM2
${width} ${height} 4 1
  c None
P c #f5b9cf
L c #ffe7ef
K c #252128
${rows.join("\n")}`;
}

const starterDocuments = [
  {
    id: "monitor",
    name: "monitor",
    source: makeMonitorBodyXpm(),
  },
  {
    id: "screen",
    name: "monitor-screen",
    source: makeMonitorFaceXpm(),
  },
  {
    id: "desktop-floppy",
    name: "desktop-floppy",
    source: makeDesktopFloppyXpm(),
  },
  {
    id: "keyboard",
    name: "keyboard",
    source: makeKeyboardXpm(),
  },
  {
    id: "sphere",
    name: "sphere",
    source: XpmPrimitives.makeSphereXpm(17),
  },
  {
    id: "sphere-checker-floor",
    name: "sphere-checker-floor",
    source: XpmPrimitives.makeSphereOverCheckerboardXpm(),
  },
];

const state = {
  documents: structuredClone(starterDocuments),
  instances: [
    { id: "i-monitor", documentId: "monitor", x: 0, y: -35.5, z: 0, depth: 95 },
    { id: "i-screen", documentId: "screen", x: 10, y: -27.5, z: 0.1, depth: 0 },
    { id: "i-desktop", documentId: "desktop-floppy", x: 5, y: 35.5, z: 0, depth: 85 },
    { id: "i-keyboard", documentId: "keyboard", x: -5, y: 51.5, z: 0, depth: 105 },
  ],
  selectedDocumentId: "monitor",
  selectedInstanceId: null,
  yaw: 18,
  pitch: -7,
};

const source = document.querySelector("#asset-source");
const highlight = document.querySelector("#asset-highlight code");
const highlightLayer = document.querySelector("#asset-highlight");
const assetStatus = document.querySelector("#asset-status");
const fileList = document.querySelector("#file-list");
const canvas = document.querySelector("#scene-canvas");
const context = canvas.getContext("2d", { willReadFrequently: true });
const stage = document.querySelector("#scene-stage");
const instanceControls = document.querySelector("#instance-controls");
const instanceDepth = document.querySelector("#instance-depth");
const instanceDepthLabel = document.querySelector("#instance-depth-label");
const instanceZ = document.querySelector("#instance-z");
const status = document.querySelector("#scene-status");
const perspectiveIntroDialog = document.querySelector(
  "#perspective-intro-dialog",
);
const openPerspectiveIntroButton = document.querySelector(
  "#open-perspective-intro",
);
const closePerspectiveIntroButton = document.querySelector(
  "#close-perspective-intro",
);
const startPerspectiveExploringButton = document.querySelector(
  "#start-perspective-exploring",
);
const perspectiveIntroClosedStorageKey =
  "xpm-perspective-intro-closed-v1";
let instanceBounds = [];
const colorProbe = document.createElement("canvas").getContext("2d");
const parsedDocumentCache = new Map();
const textureCache = new WeakMap();
const sphereSliceCache = new WeakMap();
const volumeSliceCache = new WeakMap();
const shadeCache = new Map();
const darknessCache = new Map();
let renderFrame = null;

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function escapeXmlAttribute(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function parseHighlightColor(line, cpp) {
  const symbol = line.slice(0, cpp);
  const match = line.slice(cpp).match(/(?:^|\s)c\s+(.+?)\s*$/);
  if (!match) throw new Error("Invalid color definition.");
  return [symbol, match[1].toLowerCase() === "none" ? null : match[1]];
}

function highlightColorLine(line, cpp) {
  const symbol = escapeHtml(line.slice(0, cpp));
  const definition = escapeHtml(line.slice(cpp))
    .replace(
      /(^|\s)(c|g4|g|m|s)(?=\s)/g,
      '$1<span class="syntax-key">$2</span>',
    )
    .replace(
      /(#[0-9a-fA-F]{3,12}\b|\bNone\b)/g,
      '<span class="syntax-value">$1</span>',
    );

  return `<span class="syntax-symbol">${symbol}</span>${definition}`;
}

function getPixelColors(color) {
  if (color === null) return null;

  colorProbe.fillStyle = "#000000";
  colorProbe.fillStyle = color;
  const fromBlack = colorProbe.fillStyle;
  colorProbe.fillStyle = "#ffffff";
  colorProbe.fillStyle = color;
  if (fromBlack !== colorProbe.fillStyle) return null;

  colorProbe.clearRect(0, 0, 1, 1);
  colorProbe.fillStyle = fromBlack;
  colorProbe.fillRect(0, 0, 1, 1);
  const [red, green, blue] = colorProbe.getImageData(0, 0, 1, 1).data;
  const luminance = 0.2126 * red + 0.7152 * green + 0.0722 * blue;

  return {
    fill: fromBlack,
    ink: luminance > 150 ? "#171714" : "#ffffff",
  };
}

function highlightPixelLine(line, cpp, colorMap) {
  let output = "";
  for (let index = 0; index < line.length; index += cpp) {
    const symbol = line.slice(index, index + cpp);
    const escapedSymbol = escapeHtml(symbol);
    if (!colorMap.has(symbol)) {
      output += escapedSymbol;
      continue;
    }
    const color = colorMap.get(symbol);
    if (color === null) {
      output += `<span class="syntax-pixel syntax-pixel-transparent">${escapedSymbol}</span>`;
      continue;
    }
    const pixelColors = getPixelColors(color);
    if (!pixelColors) {
      output += escapedSymbol;
      continue;
    }
    output += `<span class="syntax-pixel" style="--pixel-color:${escapeXmlAttribute(pixelColors.fill)};--pixel-ink:${pixelColors.ink}">${escapedSymbol}</span>`;
  }
  return output;
}

function highlightXpm(input) {
  if (input.length > 12000) {
    highlight.textContent = input + (input.endsWith("\n") ? " " : "");
    return;
  }
  const lines = input.replace(/\r\n?/g, "\n").split("\n");
  let headerFound = false;
  let colorsRemaining = 0;
  let pixelsRemaining = 0;
  let cpp = 1;
  const colorMap = new Map();

  const highlighted = lines.map((line) => {
    if (line.trim() === "! XPM2") {
      return `<span class="syntax-directive">${escapeHtml(line)}</span>`;
    }
    if (line.startsWith("!")) {
      return `<span class="syntax-comment">${escapeHtml(line)}</span>`;
    }
    if (!headerFound) {
      const values = line.trim().split(/\s+/).map(Number);
      if (values.length >= 4 && values.slice(0, 4).every(Number.isInteger)) {
        headerFound = true;
        colorsRemaining = values[2];
        pixelsRemaining = values[1];
        cpp = values[3];
        return escapeHtml(line).replace(
          /\b\d+\b/g,
          '<span class="syntax-number">$&</span>',
        );
      }
    } else if (colorsRemaining > 0) {
      colorsRemaining -= 1;
      try {
        const [symbol, color] = parseHighlightColor(line, cpp);
        colorMap.set(symbol, color);
      } catch {
        // Keep incomplete definitions visible while validation reports the error.
      }
      return highlightColorLine(line, cpp);
    } else if (pixelsRemaining > 0) {
      pixelsRemaining -= 1;
      return `<span class="syntax-pixels">${highlightPixelLine(line, cpp, colorMap)}</span>`;
    }
    return escapeHtml(line);
  });

  highlight.innerHTML = highlighted.join("\n") + (input.endsWith("\n") ? " " : "");
}

function syncHighlightScroll() {
  highlightLayer.scrollTop = source.scrollTop;
  highlightLayer.scrollLeft = source.scrollLeft;
}

function extractXpm(input) {
  const lines = input.replace(/\r\n?/g, "\n").split("\n");
  const marker = lines.findIndex((line) => line.trim() === "! XPM2");
  const data = lines.slice(marker + 1).filter((line) => line && !line.startsWith("!"));
  const [width, height, count, cpp] = data[0].trim().split(/\s+/).map(Number);
  if (![width, height, count, cpp].every(Number.isInteger)) {
    throw new Error("Invalid XPM header.");
  }
  const colors = new Map();
  data.slice(1, count + 1).forEach((line) => {
    const symbol = line.slice(0, cpp);
    const match = line.slice(cpp).match(/(?:^|\s)c\s+(.+?)\s*$/);
    if (!match) throw new Error(`Invalid color: ${line}`);
    colors.set(symbol, match[1].toLowerCase() === "none" ? null : match[1]);
  });
  const rows = data.slice(count + 1, count + 1 + height);
  if (rows.length !== height || rows.some((row) => row.length < width * cpp)) {
    throw new Error("Pixel rows do not match the header.");
  }
  const directives = XpmPrimitives.parseDirectives(input);
  const { primitive } = directives;
  if (!["extrusion", "sphere", "slice-stack"].includes(primitive)) {
    throw new Error(`Unsupported 2.5D primitive "${primitive}".`);
  }
  if (primitive === "slice-stack") {
    const stackValues = [
      directives.sliceWidth,
      directives.sliceHeight,
      directives.sliceCount,
      directives.sliceColumns,
      directives.sliceRows,
    ];
    if (!stackValues.every((value) => Number.isInteger(value) && value > 0)) {
      throw new Error("The slice stack requires size, count, and layout directives.");
    }
    if (directives.sliceCount > directives.sliceColumns * directives.sliceRows) {
      throw new Error("The slice layout has fewer tiles than its declared slice count.");
    }
    if (
      width < directives.sliceWidth * directives.sliceColumns ||
      height < directives.sliceHeight * directives.sliceRows
    ) {
      throw new Error("The XPM atlas is smaller than its declared slice layout.");
    }
  }
  return { width, height, cpp, colors, rows, primitive, directives };
}

function rotate([x, y, z]) {
  const yaw = state.yaw * Math.PI / 180;
  const pitch = state.pitch * Math.PI / 180;
  const rx = x * Math.cos(yaw) + z * Math.sin(yaw);
  const rz = -x * Math.sin(yaw) + z * Math.cos(yaw);
  return [rx, y * Math.cos(pitch) - rz * Math.sin(pitch), y * Math.sin(pitch) + rz * Math.cos(pitch)];
}

function shade(color, amount) {
  const cacheKey = `${color}:${amount}`;
  if (shadeCache.has(cacheKey)) return shadeCache.get(cacheKey);
  const probe = document.createElement("canvas").getContext("2d");
  probe.fillStyle = color;
  probe.fillRect(0, 0, 1, 1);
  const rgba = probe.getImageData(0, 0, 1, 1).data;
  const channels = [0, 1, 2].map((index) => Math.round(rgba[index] * amount));
  const shaded = rgba[3] < 255
    ? `rgba(${channels.join(", ")}, ${(rgba[3] / 255).toFixed(3)})`
    : `rgb(${channels.join(" ")})`;
  shadeCache.set(cacheKey, shaded);
  return shaded;
}

function isDarkColor(color) {
  if (darknessCache.has(color)) return darknessCache.get(color);
  colorProbe.clearRect(0, 0, 1, 1);
  colorProbe.fillStyle = color;
  colorProbe.fillRect(0, 0, 1, 1);
  const [red, green, blue] = colorProbe.getImageData(0, 0, 1, 1).data;
  const isDark = 0.2126 * red + 0.7152 * green + 0.0722 * blue < 80;
  darknessCache.set(color, isDark);
  return isDark;
}

function sideMaterial(grid, px, py, dx, dy, fallback) {
  if (!isDarkColor(fallback)) return fallback;
  const limit = Math.max(grid.length, grid[0]?.length || 0);
  for (let distance = 1; distance < limit; distance += 1) {
    const candidate = grid[py + dy * distance]?.[px + dx * distance];
    if (candidate && !isDarkColor(candidate)) return candidate;
  }
  return fallback;
}

function backingMaterial(grid, px, py, fallback) {
  if (!isDarkColor(fallback)) return fallback;
  const directions = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  const limit = Math.max(grid.length, grid[0]?.length || 0);
  for (let distance = 1; distance < limit; distance += 1) {
    for (const [dx, dy] of directions) {
      const candidate = grid[py + dy * distance]?.[px + dx * distance];
      if (candidate && !isDarkColor(candidate)) return candidate;
    }
  }
  return fallback;
}

function getSphereSliceTextures(image, grid) {
  if (sphereSliceCache.has(image)) return sphereSliceCache.get(image);

  const sliceCount = Math.min(
    96,
    Math.max(3, Math.ceil(Math.max(image.width, image.height) * 3)),
  );
  const slices = Array.from({ length: sliceCount }, (_, index) => {
    const normalizedZ = -1 + (2 * index + 1) / sliceCount;
    const radiusScale = Math.sqrt(Math.max(0, 1 - normalizedZ * normalizedZ));
    const texture = document.createElement("canvas");
    texture.width = image.width;
    texture.height = image.height;
    const textureContext = texture.getContext("2d");
    const shadeAmount = Math.round((0.62 + 0.38 * (normalizedZ + 1) / 2) * 16) / 16;

    grid.forEach((row, y) => row.forEach((color, x) => {
      if (color === null) return;
      const nx = (x + 0.5 - image.width / 2) / (image.width / 2);
      const ny = (y + 0.5 - image.height / 2) / (image.height / 2);
      if (nx * nx + ny * ny > radiusScale * radiusScale) return;
      textureContext.fillStyle = shade(color, shadeAmount);
      textureContext.fillRect(x, y, 1, 1);
    }));

    return { normalizedZ, radiusScale, texture };
  });
  sphereSliceCache.set(image, slices);
  return slices;
}

function buildSphereInstanceFaces(instance, image, grid) {
  const centerX = instance.x + image.width / 2;
  const centerY = instance.y + image.height / 2;
  const centerZ = instance.z - instance.depth / 2;

  const cachedSlices = getSphereSliceTextures(image, grid);
  const activeSlices = instance.depth > 0
    ? cachedSlices
    : [cachedSlices.reduce((closest, slice) =>
        Math.abs(slice.normalizedZ) < Math.abs(closest.normalizedZ) ? slice : closest
      )];
  return activeSlices.map((slice) => {
    const z = centerZ + slice.normalizedZ * instance.depth / 2;
    const points = [
      [instance.x, instance.y, z],
      [instance.x + image.width, instance.y, z],
      [instance.x + image.width, instance.y + image.height, z],
      [instance.x, instance.y + image.height, z],
    ].map(rotate);
    const extentX = image.width / 2 * slice.radiusScale;
    const extentY = image.height / 2 * slice.radiusScale;
    const boundsPoints = [
      [centerX - extentX, centerY - extentY, z],
      [centerX + extentX, centerY - extentY, z],
      [centerX + extentX, centerY + extentY, z],
      [centerX - extentX, centerY + extentY, z],
    ].map(rotate);
    return {
      instanceId: instance.id,
      textureCanvas: slice.texture,
      textureWidth: image.width,
      textureHeight: image.height,
      points,
      boundsPoints,
      depth: rotate([centerX, centerY, z])[2],
    };
  });
}

function getVolumeSliceTextures(image) {
  if (volumeSliceCache.has(image)) return volumeSliceCache.get(image);
  const {
    sliceWidth,
    sliceHeight,
    sliceCount,
    sliceColumns,
  } = image.directives;
  const slices = [];

  for (let index = 0; index < sliceCount; index += 1) {
    const tileX = index % sliceColumns * sliceWidth;
    const tileY = Math.floor(index / sliceColumns) * sliceHeight;
    const normalizedZ = sliceCount === 1 ? 0 : -1 + (2 * index + 1) / sliceCount;
    const shadeAmount = Math.round((0.64 + 0.36 * (normalizedZ + 1) / 2) * 16) / 16;
    const texture = document.createElement("canvas");
    texture.width = sliceWidth;
    texture.height = sliceHeight;
    const textureContext = texture.getContext("2d");
    let minimumX = sliceWidth;
    let minimumY = sliceHeight;
    let maximumX = -1;
    let maximumY = -1;

    for (let y = 0; y < sliceHeight; y += 1) {
      const row = image.rows[tileY + y];
      for (let x = 0; x < sliceWidth; x += 1) {
        const atlasX = tileX + x;
        const symbol = row.slice(atlasX * image.cpp, (atlasX + 1) * image.cpp);
        const color = image.colors.get(symbol) ?? null;
        if (color === null) continue;
        textureContext.fillStyle = shade(color, shadeAmount);
        textureContext.fillRect(x, y, 1, 1);
        minimumX = Math.min(minimumX, x);
        minimumY = Math.min(minimumY, y);
        maximumX = Math.max(maximumX, x);
        maximumY = Math.max(maximumY, y);
      }
    }
    if (maximumX < minimumX || maximumY < minimumY) continue;
    slices.push({
      normalizedZ,
      texture,
      bounds: {
        left: minimumX - sliceWidth / 2,
        right: maximumX + 1 - sliceWidth / 2,
        top: minimumY - sliceHeight / 2,
        bottom: maximumY + 1 - sliceHeight / 2,
      },
    });
  }
  if (!slices.length) throw new Error("The XPM slice stack contains no opaque voxels.");
  volumeSliceCache.set(image, slices);
  return slices;
}

function buildVolumeInstanceFaces(instance, image) {
  const { sliceWidth, sliceHeight } = image.directives;
  const centerX = instance.x + sliceWidth / 2;
  const centerY = instance.y + sliceHeight / 2;
  const centerZ = instance.z - instance.depth / 2;
  const cachedSlices = getVolumeSliceTextures(image);
  const activeSlices = instance.depth > 0
    ? cachedSlices
    : [cachedSlices.reduce((closest, slice) =>
        Math.abs(slice.normalizedZ) < Math.abs(closest.normalizedZ) ? slice : closest
      )];

  return activeSlices.map((slice) => {
    const z = centerZ + slice.normalizedZ * instance.depth / 2;
    const points = [
      [instance.x, instance.y, z],
      [instance.x + sliceWidth, instance.y, z],
      [instance.x + sliceWidth, instance.y + sliceHeight, z],
      [instance.x, instance.y + sliceHeight, z],
    ].map(rotate);
    const boundsPoints = [
      [centerX + slice.bounds.left, centerY + slice.bounds.top, z],
      [centerX + slice.bounds.right, centerY + slice.bounds.top, z],
      [centerX + slice.bounds.right, centerY + slice.bounds.bottom, z],
      [centerX + slice.bounds.left, centerY + slice.bounds.bottom, z],
    ].map(rotate);
    return {
      instanceId: instance.id,
      textureCanvas: slice.texture,
      textureWidth: sliceWidth,
      textureHeight: sliceHeight,
      points,
      boundsPoints,
      depth: rotate([centerX, centerY, z])[2],
    };
  });
}

function buildInstanceFaces(instance, image) {
  if (image.primitive === "slice-stack") {
    return buildVolumeInstanceFaces(instance, image);
  }
  const grid = image.rows.map((row) =>
    Array.from({ length: image.width }, (_, x) =>
      image.colors.get(row.slice(x * image.cpp, (x + 1) * image.cpp)) ?? null,
    ),
  );
  if (image.primitive === "sphere") {
    return buildSphereInstanceFaces(instance, image, grid);
  }
  const front = instance.z;
  const back = instance.z - instance.depth;
  const faces = [];
  const add = (points, color) => {
    const rotated = points.map(rotate);
    faces.push({
      instanceId: instance.id,
      color,
      points: rotated,
      depth: rotated.reduce((sum, point) => sum + point[2], 0) / rotated.length,
    });
  };
  const frontPoints = [
    [instance.x, instance.y, front],
    [instance.x + image.width, instance.y, front],
    [instance.x + image.width, instance.y + image.height, front],
    [instance.x, instance.y + image.height, front],
  ].map(rotate);
  faces.push({
    instanceId: instance.id,
    texture: image,
    points: frontPoints,
    depth: frontPoints.reduce((sum, point) => sum + point[2], 0) / frontPoints.length,
  });
  grid.forEach((row, py) => {
    let px = 0;
    while (px < row.length) {
      const color = row[px];
      if (color === null) {
        px += 1;
        continue;
      }
      let end = px + 1;
      while (end < row.length && row[end] === color) end += 1;
      const left = instance.x + px;
      const right = instance.x + end;
      const top = instance.y + py;
      const bottom = top + 1;
      if (instance.depth) {
        add(
          [[right,top,back],[left,top,back],[left,bottom,back],[right,bottom,back]],
          shade(backingMaterial(grid, px, py, color), .5),
        );
      }
      px = end;
    }
  });
  grid.forEach((row, py) => row.forEach((color, px) => {
    if (color === null) return;
    const l = instance.x + px, r = l + 1, t = instance.y + py, b = t + 1;
    if (!instance.depth) return;
    if (grid[py]?.[px - 1] == null) {
      add(
        [[l,t,back],[l,t,front],[l,b,front],[l,b,back]],
        shade(sideMaterial(grid, px, py, 1, 0, color), .58),
      );
    }
    if (grid[py]?.[px + 1] == null) {
      add(
        [[r,t,front],[r,t,back],[r,b,back],[r,b,front]],
        shade(sideMaterial(grid, px, py, -1, 0, color), .72),
      );
    }
    if (grid[py - 1]?.[px] == null) {
      add(
        [[l,t,back],[r,t,back],[r,t,front],[l,t,front]],
        shade(sideMaterial(grid, px, py, 0, 1, color), .84),
      );
    }
    if (grid[py + 1]?.[px] == null) {
      add(
        [[l,b,front],[r,b,front],[r,b,back],[l,b,back]],
        shade(sideMaterial(grid, px, py, 0, -1, color), .48),
      );
    }
  }));
  return faces;
}

function getParsedDocument(asset) {
  const cached = parsedDocumentCache.get(asset.id);
  if (cached?.source === asset.source) return cached.image;
  const image = extractXpm(asset.source);
  parsedDocumentCache.set(asset.id, { source: asset.source, image });
  return image;
}

function getTexture(image) {
  if (textureCache.has(image)) return textureCache.get(image);
  const texture = document.createElement("canvas");
  texture.width = image.width;
  texture.height = image.height;
  const textureContext = texture.getContext("2d");
  image.rows.forEach((row, y) => {
    for (let x = 0; x < image.width; x += 1) {
      const color = image.colors.get(
        row.slice(x * image.cpp, (x + 1) * image.cpp),
      );
      if (!color) continue;
      textureContext.fillStyle = color;
      textureContext.fillRect(x, y, 1, 1);
    }
  });
  textureCache.set(image, texture);
  return texture;
}

function scheduleSceneRender() {
  if (renderFrame !== null) return;
  renderFrame = requestAnimationFrame(() => {
    renderFrame = null;
    renderScene();
  });
}

function renderScene() {
  try {
    const parsed = new Map(
      state.documents.map((asset) => [asset.id, getParsedDocument(asset)]),
    );
    const faces = state.instances.flatMap((instance) =>
      buildInstanceFaces(instance, parsed.get(instance.documentId)),
    );
    if (canvas.width !== 192 || canvas.height !== 192) {
      canvas.width = 192;
      canvas.height = 192;
    } else {
      context.clearRect(0, 0, canvas.width, canvas.height);
    }
    if (!faces.length) return;
    const points = faces.flatMap((face) => face.boundsPoints || face.points);
    const minX = Math.min(...points.map((point) => point[0]));
    const maxX = Math.max(...points.map((point) => point[0]));
    const minY = Math.min(...points.map((point) => point[1]));
    const maxY = Math.max(...points.map((point) => point[1]));
    const scale = Math.max(
      1,
      Math.floor(
        Math.min(
          176 / (maxX - minX || 1),
          176 / (maxY - minY || 1),
        ),
      ),
    );
    const ox = (canvas.width - (maxX - minX) * scale) / 2 - minX * scale;
    const oy = (canvas.height - (maxY - minY) * scale) / 2 - minY * scale;
    instanceBounds = [];
    faces.sort((a, b) => a.depth - b.depth).forEach((face) => {
      const screen = face.points.map(([x, y]) => [x * scale + ox, y * scale + oy]);
      if (face.texture || face.textureCanvas) {
        const texture = face.textureCanvas || getTexture(face.texture);
        const textureWidth = face.textureWidth || face.texture.width;
        const textureHeight = face.textureHeight || face.texture.height;
        const [topLeft, topRight, , bottomLeft] = screen;
        context.save();
        context.imageSmoothingEnabled = false;
        context.setTransform(
          (topRight[0] - topLeft[0]) / textureWidth,
          (topRight[1] - topLeft[1]) / textureWidth,
          (bottomLeft[0] - topLeft[0]) / textureHeight,
          (bottomLeft[1] - topLeft[1]) / textureHeight,
          topLeft[0],
          topLeft[1],
        );
        context.drawImage(texture, 0, 0);
        context.restore();
      } else {
        context.beginPath();
        screen.forEach(([x, y], index) => index ? context.lineTo(x, y) : context.moveTo(x, y));
        context.closePath();
        context.fillStyle = face.color;
        context.fill();
      }
      const bounds = instanceBounds.find((entry) => entry.id === face.instanceId) ||
        { id: face.instanceId, left: Infinity, top: Infinity, right: -Infinity, bottom: -Infinity };
      const boundsScreen = (face.boundsPoints || face.points).map(([x, y]) => [
        x * scale + ox,
        y * scale + oy,
      ]);
      boundsScreen.forEach(([x, y]) => {
        bounds.left = Math.min(bounds.left, x); bounds.right = Math.max(bounds.right, x);
        bounds.top = Math.min(bounds.top, y); bounds.bottom = Math.max(bounds.bottom, y);
      });
      if (!instanceBounds.includes(bounds)) instanceBounds.push(bounds);
    });
    stage.dataset.scale = scale;
    stage.dataset.offsetX = ox;
    stage.dataset.offsetY = oy;
    status.textContent = `${state.instances.length} instances · drag empty space to orbit`;
    status.classList.remove("error");
  } catch (error) {
    status.textContent = error instanceof Error ? error.message : "Unable to render scene.";
    status.classList.add("error");
  }
}

function drawThumbnail(canvasElement, asset) {
  try {
    const image = extractXpm(asset.source);
    const isVolume = image.primitive === "slice-stack";
    const width = isVolume ? image.directives.sliceWidth : image.width;
    const height = isVolume ? image.directives.sliceHeight : image.height;
    const sliceIndex = isVolume ? Math.floor(image.directives.sliceCount / 2) : 0;
    const tileX = isVolume
      ? sliceIndex % image.directives.sliceColumns * width
      : 0;
    const tileY = isVolume
      ? Math.floor(sliceIndex / image.directives.sliceColumns) * height
      : 0;
    canvasElement.width = width;
    canvasElement.height = height;
    const thumbnail = canvasElement.getContext("2d");
    thumbnail.clearRect(0, 0, width, height);
    for (let y = 0; y < height; y += 1) {
      const row = image.rows[tileY + y];
      for (let x = 0; x < width; x += 1) {
        const sourceX = tileX + x;
        const color = image.colors.get(
          row.slice(sourceX * image.cpp, (sourceX + 1) * image.cpp),
        );
        if (color) {
          thumbnail.fillStyle = color;
          thumbnail.fillRect(x, y, 1, 1);
        }
      }
    }
  } catch {
    canvasElement.width = 1;
    canvasElement.height = 1;
  }
}

function renderFiles() {
  fileList.replaceChildren();
  state.documents.forEach((asset) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "file-card";
    button.classList.toggle("active", asset.id === state.selectedDocumentId);
    button.draggable = true;
    const thumbnail = document.createElement("canvas");
    const name = document.createElement("span");
    name.textContent = asset.name;
    button.append(thumbnail, name);
    drawThumbnail(thumbnail, asset);
    button.addEventListener("click", () => selectDocument(asset.id));
    button.addEventListener("dragstart", (event) => {
      event.dataTransfer.setData("application/x-xpm-document", asset.id);
    });
    fileList.append(button);
  });
}

function selectDocument(id) {
  state.selectedDocumentId = id;
  const asset = state.documents.find((item) => item.id === id);
  source.value = asset.source;
  highlightXpm(asset.source);
  source.scrollTop = 0;
  source.scrollLeft = 0;
  syncHighlightScroll();
  document.querySelector("#document-title").textContent = asset.name;
  renderFiles();
}

source.addEventListener("input", () => {
  const asset = state.documents.find((item) => item.id === state.selectedDocumentId);
  asset.source = source.value;
  highlightXpm(source.value);
  try {
    extractXpm(asset.source);
    assetStatus.textContent = "Valid XPM";
    assetStatus.classList.remove("error");
    renderFiles();
    renderScene();
  } catch (error) {
    assetStatus.textContent = error.message;
    assetStatus.classList.add("error");
  }
});
source.addEventListener("scroll", syncHighlightScroll);

document.querySelector("#add-document").addEventListener("click", () => {
  const name = window.prompt("Name this XPM file:", `sprite-${state.documents.length + 1}`);
  if (!name?.trim()) return;
  const id = `${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now()}`;
  state.documents.push({
    id,
    name: name.trim(),
    source: `! XPM2
8 8 2 1
  c None
X c #55ddd5
        
  XXXX  
  XXXX  
  XXXX  
  XXXX  
        
        
        `,
  });
  selectDocument(id);
});

stage.addEventListener("dragover", (event) => event.preventDefault());
stage.addEventListener("drop", (event) => {
  event.preventDefault();
  const documentId = event.dataTransfer.getData("application/x-xpm-document");
  if (!documentId) return;
  const canvasBounds = canvas.getBoundingClientRect();
  const canvasX = (event.clientX - canvasBounds.left) / canvasBounds.width * canvas.width;
  const canvasY = (event.clientY - canvasBounds.top) / canvasBounds.height * canvas.height;
  const scale = Number(stage.dataset.scale) || 1;
  const projectedX = (canvasX - Number(stage.dataset.offsetX || 0)) / scale;
  const projectedY = (canvasY - Number(stage.dataset.offsetY || 0)) / scale;
  const yaw = state.yaw * Math.PI / 180;
  const pitch = state.pitch * Math.PI / 180;
  const worldX = projectedX / Math.cos(yaw);
  const worldY =
    (projectedY - worldX * Math.sin(yaw) * Math.sin(pitch)) / Math.cos(pitch);
  const image = extractXpm(
    state.documents.find((item) => item.id === documentId).source,
  );
  const instanceWidth = image.primitive === "slice-stack"
    ? image.directives.sliceWidth
    : image.width;
  const instanceHeight = image.primitive === "slice-stack"
    ? image.directives.sliceHeight
    : image.height;
  const instance = {
    id: `instance-${Date.now()}`,
    documentId,
    x: worldX - instanceWidth / 2,
    y: worldY - instanceHeight / 2,
    z: 0,
    depth: image.primitive === "sphere"
      ? Math.min(image.width, image.height)
      : image.primitive === "slice-stack"
        ? image.directives.sliceCount
        : 4,
  };
  state.instances.push(instance);
  selectInstance(instance.id);
  scheduleSceneRender();
});

function selectInstance(id) {
  state.selectedInstanceId = id;
  const instance = state.instances.find((item) => item.id === id);
  instanceControls.hidden = !instance;
  if (!instance) return;
  const file = state.documents.find((item) => item.id === instance.documentId);
  const image = getParsedDocument(file);
  document.querySelector("#instance-name").textContent = file.name;
  instanceDepthLabel.textContent = image.primitive === "sphere"
    ? "Z diameter"
    : image.primitive === "slice-stack"
      ? "Z depth"
      : "Extrude";
  instanceDepth.value = instance.depth;
  document.querySelector("#instance-depth-value").textContent = `${instance.depth} px`;
  instanceZ.value = instance.z;
  document.querySelector("#instance-z-value").textContent = `${Math.round(instance.z)} px`;
}

let gesture = null;
stage.addEventListener("pointerdown", (event) => {
  const bounds = canvas.getBoundingClientRect();
  const x = (event.clientX - bounds.left) / bounds.width * canvas.width;
  const y = (event.clientY - bounds.top) / bounds.height * canvas.height;
  const hit = [...instanceBounds].reverse().find((item) =>
    x >= item.left && x <= item.right && y >= item.top && y <= item.bottom
  );
  selectInstance(hit?.id || null);
  gesture = {
    pointerId: event.pointerId,
    x: event.clientX,
    y: event.clientY,
    type: hit ? (event.shiftKey ? "z-move" : "move") : "orbit",
    yaw: state.yaw,
    pitch: state.pitch,
    instanceX: hit ? state.instances.find((item) => item.id === hit.id).x : 0,
    instanceY: hit ? state.instances.find((item) => item.id === hit.id).y : 0,
    instanceZ: hit ? state.instances.find((item) => item.id === hit.id).z : 0,
  };
  stage.setPointerCapture(event.pointerId);
});
stage.addEventListener("pointermove", (event) => {
  if (!gesture || gesture.pointerId !== event.pointerId) return;
  if (gesture.type === "orbit") {
    state.yaw = Math.max(-80, Math.min(80, gesture.yaw + (event.clientX - gesture.x) * .35));
    state.pitch = Math.max(-65, Math.min(65, gesture.pitch + (event.clientY - gesture.y) * .35));
  } else if (gesture.type === "move") {
    const instance = state.instances.find((item) => item.id === state.selectedInstanceId);
    const displayScale = canvas.getBoundingClientRect().width / canvas.width;
    const projectionScale = Number(stage.dataset.scale) * displayScale;
    instance.x = gesture.instanceX + (event.clientX - gesture.x) / projectionScale;
    instance.y = gesture.instanceY + (event.clientY - gesture.y) / projectionScale;
  } else {
    const instance = state.instances.find((item) => item.id === state.selectedInstanceId);
    const displayScale = canvas.getBoundingClientRect().width / canvas.width;
    const projectionScale = Number(stage.dataset.scale) * displayScale;
    instance.z = Math.max(
      -100,
      Math.min(100, gesture.instanceZ - (event.clientY - gesture.y) / projectionScale),
    );
    instanceZ.value = instance.z;
    document.querySelector("#instance-z-value").textContent = `${Math.round(instance.z)} px`;
  }
  scheduleSceneRender();
});
stage.addEventListener("pointerup", () => { gesture = null; });
stage.addEventListener("pointercancel", () => { gesture = null; });

instanceDepth.addEventListener("input", () => {
  const instance = state.instances.find((item) => item.id === state.selectedInstanceId);
  if (!instance) return;
  instance.depth = Number(instanceDepth.value);
  document.querySelector("#instance-depth-value").textContent = `${instance.depth} px`;
  renderScene();
});
instanceZ.addEventListener("input", () => {
  const instance = state.instances.find((item) => item.id === state.selectedInstanceId);
  if (!instance) return;
  instance.z = Number(instanceZ.value);
  document.querySelector("#instance-z-value").textContent = `${instance.z} px`;
  renderScene();
});
document.querySelector("#delete-instance").addEventListener("click", () => {
  state.instances = state.instances.filter((item) => item.id !== state.selectedInstanceId);
  selectInstance(null);
  renderScene();
});
openPerspectiveIntroButton.addEventListener("click", () => {
  perspectiveIntroDialog.showModal();
});
closePerspectiveIntroButton.addEventListener("click", () => {
  perspectiveIntroDialog.close();
});
startPerspectiveExploringButton.addEventListener("click", () => {
  perspectiveIntroDialog.close();
});
perspectiveIntroDialog.addEventListener("click", (event) => {
  if (event.target === perspectiveIntroDialog) {
    perspectiveIntroDialog.close();
  }
});
perspectiveIntroDialog.addEventListener("close", () => {
  localStorage.setItem(perspectiveIntroClosedStorageKey, "true");
});
document.querySelector("#reset-scene").addEventListener("click", () => location.reload());
document.querySelector("#export-scene-xpm").addEventListener("click", () => {
  const image = context.getImageData(0, 0, canvas.width, canvas.height);
  const colors = new Set();
  const rows = [];
  for (let y = 0; y < canvas.height; y += 1) {
    const row = [];
    for (let x = 0; x < canvas.width; x += 1) {
      const offset = (y * canvas.width + x) * 4;
      if (image.data[offset + 3] < 128) { row.push(null); continue; }
      const color = `#${[image.data[offset], image.data[offset + 1], image.data[offset + 2]]
        .map((channel) => channel.toString(16).padStart(2, "0")).join("").toUpperCase()}`;
      colors.add(color); row.push(color);
    }
    rows.push(row);
  }
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789#$%&*+-";
  const colorCount = colors.size + 1;
  const cpp = colorCount <= alphabet.length ? 1 : 2;
  const makeSymbol = (index) =>
    cpp === 1
      ? alphabet[index]
      : `${alphabet[Math.floor(index / alphabet.length)]}${alphabet[index % alphabet.length]}`;
  const transparent = makeSymbol(0);
  const symbols = new Map(
    [...colors].map((color, index) => [color, makeSymbol(index + 1)]),
  );
  const xpm = [
    "! XPM2",
    "! Camera raster from the 2.5D scene",
    `${canvas.width} ${canvas.height} ${colorCount} ${cpp}`,
    "! colors",
    `${transparent} c None`,
    ...[...colors].map((color) => `${symbols.get(color)} c ${color}`),
    "! pixels",
    ...rows.map((row) =>
      row.map((color) => (color ? symbols.get(color) : transparent)).join(""),
    ),
  ].join("\n");
  const url = URL.createObjectURL(new Blob([xpm], { type: "text/plain" }));
  const link = document.createElement("a");
  link.href = url; link.download = "scene-camera.xpm"; link.click();
  setTimeout(() => URL.revokeObjectURL(url), 0);
});

selectDocument(state.selectedDocumentId);
renderScene();
if (localStorage.getItem(perspectiveIntroClosedStorageKey) !== "true") {
  perspectiveIntroDialog.showModal();
}

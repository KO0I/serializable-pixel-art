(function registerXpmPrimitives(global) {
  "use strict";

  const primitiveDirective = /^!\s*xpm-workbench\s+primitive\s+([a-z0-9-]+)\s*$/i;
  const sliceSizeDirective = /^!\s*xpm-workbench\s+slice-size\s+(\d+)\s+(\d+)\s*$/i;
  const sliceCountDirective = /^!\s*xpm-workbench\s+slice-count\s+(\d+)\s*$/i;
  const sliceLayoutDirective = /^!\s*xpm-workbench\s+slice-layout\s+(\d+)\s+(\d+)\s*$/i;
  const impostorSizeDirective = /^!\s*xpm-workbench\s+impostor-size\s+(\d+)\s+(\d+)\s*$/i;
  const impostorGapDirective = /^!\s*xpm-workbench\s+impostor-gap\s+(\d+)\s*$/i;
  const materialDirective = /^!\s*xpm-workbench\s+material\s+([a-z0-9-]+)\s*$/i;
  const refractiveIndexDirective = /^!\s*xpm-workbench\s+refractive-index\s+([0-9]*\.?[0-9]+)\s*$/i;
  const glassHueDirective = /^!\s*xpm-workbench\s+glass-hue\s+([0-9]*\.?[0-9]+)\s*$/i;
  const surfaceRoughnessDirective = /^!\s*xpm-workbench\s+surface-roughness\s+([0-9]*\.?[0-9]+)\s*$/i;
  const dispersionDirective = /^!\s*xpm-workbench\s+dispersion\s+([0-9]*\.?[0-9]+)\s*$/i;
  const absorptionDirective = /^!\s*xpm-workbench\s+absorption\s+([0-9]*\.?[0-9]+)\s*$/i;
  const mirrorDirective = /^!\s*xpm-workbench\s+mirror\s+(on|off)\s*$/i;
  const hiFiDirective = /^!\s*xpm-workbench\s+hi-fi\s+(on|off)\s*$/i;
  const moodDirective = /^!\s*xpm-workbench\s+mood\s+(angry|inquisitive|pleased)\s*$/i;
  const surfaceDirective = /^!\s*xpm-workbench\s+surface\s+(checkerboard|grass|sand|mossy-rocks)\s*$/i;
  const droneCoreDirective = /^!\s*xpm-workbench\s+drone-core\s+(mirror)\s*$/i;
  const droneInnerRadiusDirective = /^!\s*xpm-workbench\s+drone-inner-radius\s+([0-9]*\.?[0-9]+)\s*$/i;
  const animationDirective = /^!\s*xpm-workbench\s+animation\s+([a-z0-9-]+)\s*$/i;
  const animationAmplitudeDirective = /^!\s*xpm-workbench\s+animation-amplitude\s+([0-9]*\.?[0-9]+)\s*$/i;
  const animationFrequencyDirective = /^!\s*xpm-workbench\s+animation-frequency\s+([0-9]*\.?[0-9]+)\s*$/i;
  const glassSphereDirective = /^!\s*xpm-workbench\s+glass-sphere\s+(-?[0-9]*\.?[0-9]+)\s+(-?[0-9]*\.?[0-9]+)\s+(-?[0-9]*\.?[0-9]+)\s+([0-9]*\.?[0-9]+)\s*$/i;

  function parseDirectives(input) {
    const directives = { primitive: "extrusion" };

    input.replace(/\r\n?/g, "\n").split("\n").forEach((line) => {
      let match = line.match(primitiveDirective);
      if (match) {
        directives.primitive = match[1].toLowerCase();
        return;
      }
      match = line.match(sliceSizeDirective);
      if (match) {
        directives.sliceWidth = Number(match[1]);
        directives.sliceHeight = Number(match[2]);
        return;
      }
      match = line.match(sliceCountDirective);
      if (match) {
        directives.sliceCount = Number(match[1]);
        return;
      }
      match = line.match(sliceLayoutDirective);
      if (match) {
        directives.sliceColumns = Number(match[1]);
        directives.sliceRows = Number(match[2]);
        return;
      }
      match = line.match(impostorSizeDirective);
      if (match) {
        directives.impostorWidth = Number(match[1]);
        directives.impostorHeight = Number(match[2]);
        return;
      }
      match = line.match(impostorGapDirective);
      if (match) {
        directives.impostorGap = Number(match[1]);
        return;
      }
      match = line.match(materialDirective);
      if (match) {
        directives.material = match[1].toLowerCase();
        return;
      }
      match = line.match(refractiveIndexDirective);
      if (match) {
        directives.refractiveIndex = Number(match[1]);
        return;
      }
      match = line.match(glassHueDirective);
      if (match) {
        directives.glassHue = Number(match[1]);
        return;
      }
      match = line.match(surfaceRoughnessDirective);
      if (match) {
        directives.surfaceRoughness = Number(match[1]);
        return;
      }
      match = line.match(dispersionDirective);
      if (match) {
        directives.dispersion = Number(match[1]);
        return;
      }
      match = line.match(absorptionDirective);
      if (match) {
        directives.absorption = Number(match[1]);
        return;
      }
      match = line.match(mirrorDirective);
      if (match) {
        directives.mirror = match[1].toLowerCase() === "on";
        return;
      }
      match = line.match(hiFiDirective);
      if (match) {
        directives.hiFi = match[1].toLowerCase() === "on";
        return;
      }
      match = line.match(moodDirective);
      if (match) {
        directives.mood = match[1].toLowerCase();
        return;
      }
      match = line.match(surfaceDirective);
      if (match) {
        directives.surface = match[1].toLowerCase();
        return;
      }
      match = line.match(droneCoreDirective);
      if (match) {
        directives.droneCore = match[1].toLowerCase();
        return;
      }
      match = line.match(droneInnerRadiusDirective);
      if (match) {
        directives.droneInnerRadius = Number(match[1]);
        return;
      }
      match = line.match(animationDirective);
      if (match) {
        directives.animation = match[1].toLowerCase();
        return;
      }
      match = line.match(animationAmplitudeDirective);
      if (match) {
        directives.animationAmplitude = Number(match[1]);
        return;
      }
      match = line.match(animationFrequencyDirective);
      if (match) {
        directives.animationFrequency = Number(match[1]);
        return;
      }
      match = line.match(glassSphereDirective);
      if (match) {
        directives.glassCenterX = Number(match[1]);
        directives.glassCenterY = Number(match[2]);
        directives.glassCenterZ = Number(match[3]);
        directives.glassRadius = Number(match[4]);
      }
    });

    return directives;
  }

  function makeSphereXpm(diameter = 17) {
    const size = Math.max(5, Math.round(diameter) | 1);
    const center = (size - 1) / 2;
    const radius = size / 2;
    const palette = ["D", "S", "M", "L", "H"];
    const rows = Array.from({ length: size }, (_, y) =>
      Array.from({ length: size }, (_, x) => {
        const nx = (x - center) / radius;
        const ny = (y - center) / radius;
        const radiusSquared = nx * nx + ny * ny;
        if (radiusSquared > 1) return " ";

        const nz = Math.sqrt(Math.max(0, 1 - radiusSquared));
        const light = Math.max(0, -nx * 0.35 - ny * 0.42 + nz * 0.84);
        const band = Math.min(palette.length - 1, Math.floor(light * palette.length));
        return palette[band];
      }).join(""),
    );

    return [
      "! XPM2",
      "! xpm-workbench primitive sphere",
      "! The opaque XPM mask supplies material; the directive supplies spherical depth.",
      `${size} ${size} 6 1`,
      "! colors",
      "  c None",
      "D c #173f4a",
      "S c #1e6570",
      "M c #278b91",
      "L c #47b6b2",
      "H c #9ce4d8",
      "! pixels",
      ...rows,
    ].join("\n");
  }

  function makeImpostorSphereXpm(diameter = 17) {
    const size = Math.max(5, Math.round(diameter) | 1);
    const center = (size - 1) / 2;
    const radius = size / 2;
    const paletteA = ["D", "S", "M", "L", "H"];
    const paletteB = ["d", "s", "m", "l", "h"];
    const makeView = (palette) => Array.from({ length: size }, (_, y) =>
      Array.from({ length: size }, (_, x) => {
        const nx = (x - center) / radius;
        const ny = (y - center) / radius;
        const radiusSquared = nx * nx + ny * ny;
        if (radiusSquared > 1) return " ";

        const nz = Math.sqrt(Math.max(0, 1 - radiusSquared));
        const sideLight = Math.max(0, -nx * 0.78 - ny * 0.22);
        const light = Math.min(
          0.999,
          0.16 + sideLight + nz * 0.18,
        );
        const band = Math.min(palette.length - 1, Math.floor(light * palette.length));
        return palette[band];
      }).join("")
    );
    const viewA = makeView(paletteA);
    const viewB = makeView(paletteB);
    const gap = 1;

    return [
      "! XPM2",
      "! xpm-workbench primitive impostor-sphere-2xpm",
      `! xpm-workbench impostor-size ${size} ${size}`,
      `! xpm-workbench impostor-gap ${gap}`,
      "! Two sphere views with matching camera-space shading; the second stack is rotated -90 degrees around Y.",
      `${size * 2 + gap} ${size} 11 1`,
      "! colors",
      "  c None",
      "D c #173f4a",
      "S c #1e6570",
      "M c #278b91",
      "L c #47b6b2",
      "H c #9ce4d8",
      "d c #173f4a",
      "s c #1e6570",
      "m c #278b91",
      "l c #47b6b2",
      "h c #9ce4d8",
      "! pixels",
      ...viewA.map((row, index) => `${row}${" ".repeat(gap)}${viewB[index]}`),
    ].join("\n");
  }

  function makeSphereOverCheckerboardXpm({
    width = 35,
    height = 29,
    depth = 25,
    radius = 8,
    tileSize = 4,
    animated = false,
    drone = false,
  } = {}) {
    const sliceWidth = Math.max(21, Math.round(width));
    const sliceHeight = Math.max(21, Math.round(height));
    const sliceCount = Math.max(9, Math.round(depth) | 1);
    const sphereRadius = Math.max(
      4,
      Math.min(Math.round(radius), Math.floor((sliceHeight - 7) / 2)),
    );
    const checkerSize = Math.max(2, Math.round(tileSize));
    const centerX = (sliceWidth - 1) / 2;
    const floorY = sliceHeight - 4;
    const centerY = floorY - sphereRadius - 3;
    const centerZ = (sliceCount - 1) / 2;
    const columns = Math.max(
      1,
      Math.ceil(Math.sqrt(sliceCount * sliceHeight / sliceWidth)),
    );
    const rows = Math.ceil(sliceCount / columns);
    const atlas = Array.from(
      { length: rows * sliceHeight },
      () => Array(columns * sliceWidth).fill(" "),
    );
    const spherePalette = ["D", "S", "M", "L", "H"];
    const metalPalette = ["i", "j", "k"];
    const innerRadius = Math.max(2, Math.round(sphereRadius * 0.46));
    const initialHue = drone ? 120 : 184;

    for (let slice = 0; slice < sliceCount; slice += 1) {
      const tileX = slice % columns * sliceWidth;
      const tileY = Math.floor(slice / columns) * sliceHeight;
      const dz = slice - centerZ;

      for (let x = 0; x < sliceWidth; x += 1) {
        const checkerX = Math.floor(x / checkerSize);
        const checkerZ = Math.floor(slice / checkerSize);
        if (drone) {
          const terrainNoise = (
            (x * 17 + slice * 31 + (x * slice % 13) * 7) % 19
          );
          atlas[tileY + floorY][tileX + x] = terrainNoise < 3
            ? "c"
            : terrainNoise < 11
              ? "a"
              : "b";
        } else {
          atlas[tileY + floorY][tileX + x] = (checkerX + checkerZ) % 2 ? "a" : "b";
        }
      }

      for (let y = 0; y < sliceHeight; y += 1) {
        for (let x = 0; x < sliceWidth; x += 1) {
          const dx = x - centerX;
          const dy = y - centerY;
          const distanceSquared = dx * dx + dy * dy + dz * dz;
          if (distanceSquared > sphereRadius * sphereRadius) continue;

          const nx = dx / sphereRadius;
          const ny = dy / sphereRadius;
          const nz = dz / sphereRadius;
          const light = Math.max(0, -nx * 0.35 - ny * 0.42 + nz * 0.84);
          if (drone && distanceSquared <= innerRadius * innerRadius) {
            const metalBand = Math.min(
              metalPalette.length - 1,
              Math.floor(light * metalPalette.length),
            );
            atlas[tileY + y][tileX + x] = metalPalette[metalBand];
          } else {
            const band = Math.min(
              spherePalette.length - 1,
              Math.floor(light * spherePalette.length),
            );
            atlas[tileY + y][tileX + x] = spherePalette[band];
          }
        }
      }
    }

    return [
      "! XPM2",
      "! xpm-workbench primitive slice-stack",
      `! xpm-workbench slice-size ${sliceWidth} ${sliceHeight}`,
      `! xpm-workbench slice-count ${sliceCount}`,
      `! xpm-workbench slice-layout ${columns} ${rows}`,
      `! xpm-workbench material ${drone ? "drone-b" : "glass"}`,
      "! xpm-workbench refractive-index 1.50",
      `! xpm-workbench glass-hue ${initialHue}`,
      "! xpm-workbench surface-roughness 0.15",
      "! xpm-workbench dispersion 0.12",
      "! xpm-workbench absorption 0.08",
      "! xpm-workbench mirror off",
      "! xpm-workbench hi-fi off",
      ...(drone
        ? [
            "! xpm-workbench mood inquisitive",
            "! xpm-workbench surface grass",
            "! xpm-workbench drone-core mirror",
            `! xpm-workbench drone-inner-radius ${innerRadius}`,
          ]
        : []),
      ...(animated ? ["! xpm-workbench animation bob"] : []),
      ...(animated || drone
        ? [
            "! xpm-workbench animation-amplitude 2.00",
            "! xpm-workbench animation-frequency 0.60",
          ]
        : []),
      `! xpm-workbench glass-sphere ${centerX} ${centerY} ${centerZ} ${sphereRadius}`,
      drone
        ? "! Drone B: an opaque mirror core enclosed by a mood-reactive glass shell."
        : "! A translucent voxel sphere hovering over a one-voxel checkerboard floor.",
      `${columns * sliceWidth} ${rows * sliceHeight} ${drone ? 12 : 8} 1`,
      "! colors",
      "  c None",
      `D c hsla(${initialHue}, 30%, 25%, 0.025)`,
      `S c hsla(${initialHue}, 40%, 35%, 0.030)`,
      `M c hsla(${initialHue}, 48%, 48%, 0.035)`,
      `L c hsla(${initialHue}, 56%, 63%, 0.040)`,
      `H c hsla(${initialHue}, 45%, 82%, 0.055)`,
      ...(drone
        ? [
            "i c #252a30",
            "j c #7f8b94",
            "k c #eef4f7",
          ]
        : []),
      ...(drone
        ? [
            "a c #4f7f39",
            "b c #294f2c",
            "c c #83aa58",
          ]
        : [
            "a c #d8d3c6",
            "b c #343431",
          ]),
      "! pixels",
      ...atlas.map((row) => row.join("")),
    ].join("\n");
  }

  function makeDroneBXpm(options = {}) {
    return makeSphereOverCheckerboardXpm({
      ...options,
      drone: true,
    });
  }

  function applyDroneSurfaceXpm(input, surface) {
    if (!["checkerboard", "grass", "sand", "mossy-rocks"].includes(surface)) {
      return input;
    }

    const directives = parseDirectives(input);
    if (directives.material !== "drone-b") return input;

    const lines = input.replace(/\r\n?/g, "\n").split("\n");
    const colorsMarker = lines.findIndex((line) => line.trim().toLowerCase() === "! colors");
    const pixelsMarker = lines.findIndex((line) => line.trim().toLowerCase() === "! pixels");
    if (colorsMarker < 1 || pixelsMarker < 0) return input;

    let headerIndex = colorsMarker - 1;
    while (headerIndex >= 0 && (!lines[headerIndex].trim() || lines[headerIndex].trim().startsWith("!"))) {
      headerIndex -= 1;
    }
    const header = headerIndex >= 0
      ? lines[headerIndex].trim().split(/\s+/).map(Number)
      : [];
    const [width, height, , cpp] = header;
    const sliceWidth = Math.round(directives.sliceWidth);
    const sliceHeight = Math.round(directives.sliceHeight);
    const sliceCount = Math.round(directives.sliceCount);
    const sliceColumns = Math.round(directives.sliceColumns);
    if (
      !Number.isFinite(width)
      || !Number.isFinite(height)
      || cpp !== 1
      || !Number.isFinite(sliceWidth)
      || !Number.isFinite(sliceHeight)
      || !Number.isFinite(sliceCount)
      || !Number.isFinite(sliceColumns)
      || pixelsMarker + height >= lines.length
    ) {
      return input;
    }

    const pixels = lines
      .slice(pixelsMarker + 1, pixelsMarker + 1 + height)
      .map((line) => line.padEnd(width, " ").slice(0, width).split(""));

    pixels.forEach((row) => {
      row.forEach((symbol, x) => {
        if (["a", "b", "c"].includes(symbol)) row[x] = " ";
      });
    });

    const impliedFloorY = Number.isFinite(directives.glassCenterY)
      && Number.isFinite(directives.glassRadius)
      ? Math.round(directives.glassCenterY + directives.glassRadius + 3)
      : sliceHeight - 4;
    const floorY = Math.max(0, Math.min(sliceHeight - 1, impliedFloorY));

    const setTerrain = (tileX, tileY, x, y, symbol) => {
      const atlasX = tileX + x;
      const atlasY = tileY + y;
      if (atlasX >= 0 && atlasX < width && atlasY >= 0 && atlasY < height) {
        pixels[atlasY][atlasX] = symbol;
      }
    };

    for (let slice = 0; slice < sliceCount; slice += 1) {
      const tileX = slice % sliceColumns * sliceWidth;
      const tileY = Math.floor(slice / sliceColumns) * sliceHeight;
      if (tileY + sliceHeight > height || tileX + sliceWidth > width) break;

      for (let x = 0; x < sliceWidth; x += 1) {
        if (surface === "checkerboard") {
          const checkerX = Math.floor(x / 4);
          const checkerZ = Math.floor(slice / 4);
          setTerrain(tileX, tileY, x, floorY, (checkerX + checkerZ) % 2 ? "a" : "b");
          continue;
        }

        if (surface === "grass") {
          const terrainNoise = (x * 17 + slice * 31 + (x * slice % 13) * 7) % 19;
          setTerrain(
            tileX,
            tileY,
            x,
            floorY,
            terrainNoise < 3 ? "c" : terrainNoise < 11 ? "a" : "b",
          );
          if ((x * 11 + slice * 7) % 29 < 2) {
            setTerrain(tileX, tileY, x, floorY - 1, "c");
          }
          continue;
        }

        if (surface === "sand") {
          const longWave = Math.sin((x + slice * 0.58) * 0.34);
          const crossWave = Math.sin(x * 0.17 - slice * 0.29 + 1.15);
          const duneHeight = Math.max(0, Math.min(2, Math.round(1 + longWave * 0.72 + crossWave * 0.36)));
          const surfaceY = floorY - duneHeight;
          for (let y = surfaceY; y <= floorY; y += 1) {
            const symbol = y === surfaceY ? (duneHeight === 2 ? "c" : "a") : y === floorY ? "b" : "a";
            setTerrain(tileX, tileY, x, y, symbol);
          }
          continue;
        }

        const rockField = Math.sin(x * 0.77 + slice * 1.13)
          + Math.sin(x * 0.31 - slice * 0.66 + 0.8);
        const rockHeight = rockField > 1.25 ? 2 : rockField > 0.46 ? 1 : 0;
        setTerrain(tileX, tileY, x, floorY, rockHeight ? "a" : "b");
        for (let rise = 1; rise <= rockHeight; rise += 1) {
          setTerrain(
            tileX,
            tileY,
            x,
            floorY - rise,
            rise === rockHeight && (x + slice) % 3 !== 0 ? "c" : "a",
          );
        }
      }
    }

    pixels.forEach((row, index) => {
      lines[pixelsMarker + 1 + index] = row.join("");
    });
    return lines.join("\n");
  }

  global.XpmPrimitives = Object.freeze({
    applyDroneSurfaceXpm,
    makeSphereOverCheckerboardXpm,
    makeSphereXpm,
    makeImpostorSphereXpm,
    makeDroneBXpm,
    parseDirectives,
  });
})(window);

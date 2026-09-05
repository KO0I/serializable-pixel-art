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
  const floorSizeDirective = /^!\s*xpm-workbench\s+floor-size\s+(compact|standard|large|extra-wide)\s*$/i;
  const droneCoreDirective = /^!\s*xpm-workbench\s+drone-core\s+(mirror)\s*$/i;
  const droneInnerRadiusDirective = /^!\s*xpm-workbench\s+drone-inner-radius\s+([0-9]*\.?[0-9]+)\s*$/i;
  const animationDirective = /^!\s*xpm-workbench\s+animation\s+([a-z0-9-]+)\s*$/i;
  const animationAmplitudeDirective = /^!\s*xpm-workbench\s+animation-amplitude\s+([0-9]*\.?[0-9]+)\s*$/i;
  const animationFrequencyDirective = /^!\s*xpm-workbench\s+animation-frequency\s+([0-9]*\.?[0-9]+)\s*$/i;
  const glassSphereDirective = /^!\s*xpm-workbench\s+glass-sphere\s+(-?[0-9]*\.?[0-9]+)\s+(-?[0-9]*\.?[0-9]+)\s+(-?[0-9]*\.?[0-9]+)\s+([0-9]*\.?[0-9]+)\s*$/i;
  const glassCubeDirective = /^!\s*xpm-workbench\s+glass-cube\s+(-?[0-9]*\.?[0-9]+)\s+(-?[0-9]*\.?[0-9]+)\s+(-?[0-9]*\.?[0-9]+)\s+([0-9]*\.?[0-9]+)\s*$/i;
  const cubeFaceColorDirective = /^!\s*xpm-workbench\s+cube-face-(front|back|left|right|top|bottom)\s+(#[0-9a-f]{6})\s*$/i;
  const cubeFaceHueDirective = /^!\s*xpm-workbench\s+cube-face-(front|back|left|right|top|bottom)\s+([0-9]*\.?[0-9]+)\s*$/i;
  const gardenLayerDirective = /^!\s*xpm-workbench\s+layer-(bush|tree|grass|flowers)\s+(on|off)\s*$/i;
  const plateSurfaceDirective = /^!\s*xpm-workbench\s+plate-surface\s+(garden|ice|desert|alien-red-dwarf|alien-k-star)\s*$/i;
  const gardenImpostorDirective = /^!\s*xpm-workbench\s+garden-impostor\s+(bush|tree)\s+(-?[0-9]*\.?[0-9]+)\s+(-?[0-9]*\.?[0-9]+)\s+(-?[0-9]*\.?[0-9]+)\s*$/i;
  const gardenPondDirective = /^!\s*xpm-workbench\s+garden-pond\s+(on|off)\s*$/i;
  const overheadLightDirective = /^!\s*xpm-workbench\s+overhead-light\s+(on|off)\s*$/i;
  const lightIntensityDirective = /^!\s*xpm-workbench\s+light-intensity\s+([0-9]*\.?[0-9]+)\s*$/i;
  const lightSpreadDirective = /^!\s*xpm-workbench\s+light-spread\s+([0-9]*\.?[0-9]+)\s*$/i;
  const lightHueDirective = /^!\s*xpm-workbench\s+light-hue\s+([0-9]*\.?[0-9]+)\s*$/i;
  const lightPositionDirective = /^!\s*xpm-workbench\s+light-position\s+(-?[0-9]*\.?[0-9]+)\s+(-?[0-9]*\.?[0-9]+)\s+(-?[0-9]*\.?[0-9]+)\s*$/i;
  const waterSizeDirective = /^!\s*xpm-workbench\s+water-size\s+(\d+)\s+(\d+)\s*$/i;
  const waterDampDirective = /^!\s*xpm-workbench\s+water-damp\s+([0-9]*\.?[0-9]+)\s*$/i;
  const waterGravityDirective = /^!\s*xpm-workbench\s+water-gravity\s+([0-9]*\.?[0-9]+)\s*$/i;
  const waterBottomDirective = /^!\s*xpm-workbench\s+water-bottom\s+(checkerboard|river-rocks|river-boulders|sand-ripples|mossy-stones)\s*$/i;
  const waterVegetationDirective = /^!\s*xpm-workbench\s+water-vegetation\s+(none|clovers|grass|tall-grass)\s*$/i;
  const waterLightAngleDirective = /^!\s*xpm-workbench\s+water-light-angle\s+(-?[0-9]*\.?[0-9]+)\s*$/i;
  const waterLightSourceDirective = /^!\s*xpm-workbench\s+water-light-source\s+(daylight|warm-lamp|cool-led|green-glow|magenta-glow)\s*$/i;
  const waterLightIntensityDirective = /^!\s*xpm-workbench\s+water-light-intensity\s+([0-9]*\.?[0-9]+)\s*$/i;
  const waterCausticDetailDirective = /^!\s*xpm-workbench\s+water-caustic-detail\s+(fast|balanced|fine)\s*$/i;
  const waterLiquidRefractionDirective = /^!\s*xpm-workbench\s+water-liquid-refraction\s+([0-9]*\.?[0-9]+)\s*$/i;
  const waterLiquidColorDirective = /^!\s*xpm-workbench\s+water-liquid-color\s+([0-9]*\.?[0-9]+)\s*$/i;
  const waterLiquidDispersionDirective = /^!\s*xpm-workbench\s+water-liquid-dispersion\s+([0-9]*\.?[0-9]+)\s*$/i;
  const waterLiquidAbsorptionDirective = /^!\s*xpm-workbench\s+water-liquid-absorption\s+([0-9]*\.?[0-9]+)\s*$/i;
  const waterSurfaceOpacityDirective = /^!\s*xpm-workbench\s+water-surface-opacity\s+([0-9]*\.?[0-9]+)\s*$/i;
  const waterReflectiveSurfaceDirective = /^!\s*xpm-workbench\s+water-reflective-surface\s+(on|off)\s*$/i;
  const waterRotationDirective = /^!\s*xpm-workbench\s+water-rotation\s+(-?[0-9]*\.?[0-9]+)\s*$/i;
  const waterRainDirective = /^!\s*xpm-workbench\s+water-rain\s+(on|off)\s*$/i;
  const waterGlassSphereDirective = /^!\s*xpm-workbench\s+water-glass-sphere\s+(on|off)\s*$/i;
  const glassEmissiveDirective = /^!\s*xpm-workbench\s+glass-emissive\s+([0-9]*\.?[0-9]+)\s*$/i;

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
      match = line.match(floorSizeDirective);
      if (match) {
        directives.floorSize = match[1].toLowerCase();
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
        return;
      }
      match = line.match(glassCubeDirective);
      if (match) {
        directives.glassCubeCenterX = Number(match[1]);
        directives.glassCubeCenterY = Number(match[2]);
        directives.glassCubeCenterZ = Number(match[3]);
        directives.glassCubeHalfSize = Number(match[4]);
        return;
      }
      match = line.match(cubeFaceColorDirective);
      if (match) {
        directives.cubeFaceColors ??= {};
        directives.cubeFaceColors[match[1].toLowerCase()] = match[2].toLowerCase();
        return;
      }
      match = line.match(cubeFaceHueDirective);
      if (match) {
        directives.cubeFaceHues ??= {};
        directives.cubeFaceHues[match[1].toLowerCase()] = Number(match[2]);
        return;
      }
      match = line.match(gardenLayerDirective);
      if (match) {
        directives[`layer${match[1][0].toUpperCase()}${match[1].slice(1).toLowerCase()}`] =
          match[2].toLowerCase() === "on";
        return;
      }
      match = line.match(plateSurfaceDirective);
      if (match) {
        directives.plateSurface = match[1].toLowerCase();
        return;
      }
      match = line.match(gardenImpostorDirective);
      if (match) {
        directives.gardenImpostors ??= {};
        directives.gardenImpostors[match[1].toLowerCase()] = {
          x: Number(match[2]),
          y: Number(match[3]),
          z: Number(match[4]),
        };
        return;
      }
      match = line.match(gardenPondDirective);
      if (match) {
        directives.gardenPond = match[1].toLowerCase() === "on";
        return;
      }
      match = line.match(overheadLightDirective);
      if (match) {
        directives.overheadLight = match[1].toLowerCase() === "on";
        return;
      }
      match = line.match(lightIntensityDirective);
      if (match) {
        directives.lightIntensity = Number(match[1]);
        return;
      }
      match = line.match(lightSpreadDirective);
      if (match) {
        directives.lightSpread = Number(match[1]);
        return;
      }
      match = line.match(lightHueDirective);
      if (match) {
        directives.lightHue = Number(match[1]);
        return;
      }
      match = line.match(lightPositionDirective);
      if (match) {
        directives.lightPositions ??= [];
        directives.lightPositions.push([
          Number(match[1]),
          Number(match[2]),
          Number(match[3]),
        ]);
        return;
      }
      match = line.match(waterSizeDirective);
      if (match) {
        directives.waterWidth = Number(match[1]);
        directives.waterHeight = Number(match[2]);
        return;
      }
      match = line.match(waterDampDirective);
      if (match) {
        directives.waterDamp = Number(match[1]);
        return;
      }
      match = line.match(waterGravityDirective);
      if (match) {
        directives.waterGravity = Number(match[1]);
        return;
      }
      match = line.match(waterBottomDirective);
      if (match) {
        directives.waterBottom = match[1].toLowerCase();
        return;
      }
      match = line.match(waterVegetationDirective);
      if (match) {
        directives.waterVegetation = match[1].toLowerCase();
        return;
      }
      match = line.match(waterLightAngleDirective);
      if (match) {
        directives.waterLightAngle = Number(match[1]);
        return;
      }
      match = line.match(waterLightSourceDirective);
      if (match) {
        directives.waterLightSource = match[1].toLowerCase();
        return;
      }
      match = line.match(waterLightIntensityDirective);
      if (match) {
        directives.waterLightIntensity = Number(match[1]);
        return;
      }
      match = line.match(waterCausticDetailDirective);
      if (match) {
        directives.waterCausticDetail = match[1].toLowerCase();
        return;
      }
      match = line.match(waterLiquidRefractionDirective);
      if (match) {
        directives.waterLiquidRefraction = Number(match[1]);
        return;
      }
      match = line.match(waterLiquidColorDirective);
      if (match) {
        directives.waterLiquidColor = Number(match[1]);
        return;
      }
      match = line.match(waterLiquidDispersionDirective);
      if (match) {
        directives.waterLiquidDispersion = Number(match[1]);
        return;
      }
      match = line.match(waterLiquidAbsorptionDirective);
      if (match) {
        directives.waterLiquidAbsorption = Number(match[1]);
        return;
      }
      match = line.match(waterSurfaceOpacityDirective);
      if (match) {
        directives.waterSurfaceOpacity = Number(match[1]);
        return;
      }
      match = line.match(waterReflectiveSurfaceDirective);
      if (match) {
        directives.waterReflectiveSurface = match[1].toLowerCase() === "on";
        return;
      }
      match = line.match(waterRotationDirective);
      if (match) {
        directives.waterRotation = Number(match[1]);
        return;
      }
      match = line.match(waterRainDirective);
      if (match) {
        directives.waterRain = match[1].toLowerCase() === "on";
        return;
      }
      match = line.match(waterGlassSphereDirective);
      if (match) {
        directives.waterGlassSphere = match[1].toLowerCase() === "on";
        return;
      }
      match = line.match(glassEmissiveDirective);
      if (match) {
        directives.glassEmissive = Number(match[1]);
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
    const makeView = (palette, rotatedY = false) => Array.from({ length: size }, (_, y) =>
      Array.from({ length: size }, (_, x) => {
        const nx = (x - center) / radius;
        const ny = (y - center) / radius;
        const radiusSquared = nx * nx + ny * ny;
        if (radiusSquared > 1) return " ";

        const nz = Math.sqrt(Math.max(0, 1 - radiusSquared));
        const directionalLight = rotatedY
          ? Math.max(0, nx * 0.18 - ny * 0.22 + nz * 0.78)
          : Math.max(0, -nx * 0.78 - ny * 0.22) + nz * 0.18;
        const light = Math.min(
          0.999,
          0.16 + directionalLight,
        );
        const band = Math.min(palette.length - 1, Math.floor(light * palette.length));
        return palette[band];
      }).join("")
    );
    const viewA = makeView(paletteA, false);
    const viewB = makeView(paletteB, true);
    const gap = 1;

    return [
      "! XPM2",
      "! xpm-workbench primitive impostor-sphere-2xpm",
      `! xpm-workbench impostor-size ${size} ${size}`,
      `! xpm-workbench impostor-gap ${gap}`,
      "! Two sphere views under one world-space light; XPM 2 is rendered after a -90 degree Y rotation, bringing the lit side toward the viewer.",
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

  function makeImpostorCubeXpm(size = 17) {
    const faceSize = Math.max(5, Math.round(size) | 1);
    const paletteA = { base: "F", top: "T", left: "L", right: "R", bottom: "U" };
    const paletteB = { base: "R", top: "T", left: "F", right: "B", bottom: "U" };
    const makeView = (palette) => Array.from({ length: faceSize }, (_, y) =>
      Array.from({ length: faceSize }, (_, x) => {
        if (y === 0) return palette.top;
        if (x === 0) return palette.left;
        if (x === faceSize - 1) return palette.right;
        if (y === faceSize - 1) return palette.bottom;
        const highlight = x + y < Math.max(3, Math.round(faceSize * 0.34));
        return highlight ? palette.left : palette.base;
      }).join(""),
    );
    const viewA = makeView(paletteA);
    const viewB = makeView(paletteB);
    const gap = 1;

    return [
      "! XPM2",
      "! xpm-workbench primitive impostor-cube-2xpm",
      `! xpm-workbench impostor-size ${faceSize} ${faceSize}`,
      `! xpm-workbench impostor-gap ${gap}`,
      "! xpm-workbench cube-face-front #d63429",
      "! xpm-workbench cube-face-back #d6ab29",
      "! xpm-workbench cube-face-left #29d62f",
      "! xpm-workbench cube-face-right #29b9d6",
      "! xpm-workbench cube-face-top #7a29d6",
      "! xpm-workbench cube-face-bottom #d6298b",
      "! Two solid cube views. XPM 2 is the same cube rotated -90 degrees around Y.",
      `${faceSize * 2 + gap} ${faceSize} 7 1`,
      "! colors",
      "  c None",
      "F c #d63429",
      "B c #d6ab29",
      "L c #29d62f",
      "R c #29b9d6",
      "T c #7a29d6",
      "U c #d6298b",
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
    floorSize = "standard",
  } = {}) {
    const sliceWidth = Math.max(21, Math.round(width));
    const sliceHeight = Math.max(21, Math.round(height));
    const sliceCount = Math.max(9, Math.round(depth));
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
      ...(!drone ? [`! xpm-workbench floor-size ${floorSize}`] : []),
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

  function makeGlassCubeXpm({
    width = 35,
    height = 29,
    depth = 25,
    halfSize = 7,
    floorSize = "standard",
  } = {}) {
    const sliceWidth = Math.max(21, Math.round(width));
    const sliceHeight = Math.max(21, Math.round(height));
    const sliceCount = Math.max(9, Math.round(depth));
    const cubeHalfSize = Math.max(
      3,
      Math.min(
        Math.round(halfSize),
        Math.floor((sliceHeight - 7) / 2),
        Math.floor((sliceCount - 1) / 2),
      ),
    );
    const centerX = (sliceWidth - 1) / 2;
    const floorY = sliceHeight - 4;
    const centerY = floorY - cubeHalfSize - 3;
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
    const palette = ["D", "S", "M", "L", "H"];

    for (let slice = 0; slice < sliceCount; slice += 1) {
      const tileX = slice % columns * sliceWidth;
      const tileY = Math.floor(slice / columns) * sliceHeight;
      const dz = slice - centerZ;

      for (let x = 0; x < sliceWidth; x += 1) {
        const checkerX = Math.floor(x / 4);
        const checkerZ = Math.floor(slice / 4);
        atlas[tileY + floorY][tileX + x] = (checkerX + checkerZ) % 2 ? "a" : "b";
      }

      if (Math.abs(dz) > cubeHalfSize) continue;
      for (let y = 0; y < sliceHeight; y += 1) {
        for (let x = 0; x < sliceWidth; x += 1) {
          const dx = x - centerX;
          const dy = y - centerY;
          if (Math.abs(dx) > cubeHalfSize || Math.abs(dy) > cubeHalfSize) continue;

          const light = Math.max(
            0,
            Math.min(
              0.999,
              0.46 - dx / cubeHalfSize * 0.16 - dy / cubeHalfSize * 0.2 + dz / cubeHalfSize * 0.18,
            ),
          );
          atlas[tileY + y][tileX + x] = palette[Math.floor(light * palette.length)];
        }
      }
    }

    return [
      "! XPM2",
      "! xpm-workbench primitive slice-stack",
      `! xpm-workbench slice-size ${sliceWidth} ${sliceHeight}`,
      `! xpm-workbench slice-count ${sliceCount}`,
      `! xpm-workbench slice-layout ${columns} ${rows}`,
      "! xpm-workbench material glass-cube",
      "! xpm-workbench refractive-index 1.50",
      "! xpm-workbench glass-hue 184",
      "! xpm-workbench surface-roughness 0.10",
      "! xpm-workbench dispersion 0.12",
      "! xpm-workbench absorption 0.06",
      "! xpm-workbench mirror off",
      "! xpm-workbench hi-fi off",
      "! xpm-workbench surface checkerboard",
      `! xpm-workbench floor-size ${floorSize}`,
      `! xpm-workbench glass-cube ${centerX} ${centerY} ${centerZ} ${cubeHalfSize}`,
      "! A refractive glass cube hovering above a selectable XPM surface.",
      `${columns * sliceWidth} ${rows * sliceHeight} 9 1`,
      "! colors",
      "  c None",
      "D c hsla(184, 30%, 25%, 0.020)",
      "S c hsla(184, 40%, 35%, 0.024)",
      "M c hsla(184, 48%, 48%, 0.028)",
      "L c hsla(184, 56%, 63%, 0.034)",
      "H c hsla(184, 45%, 82%, 0.045)",
      "a c #d8d3c6",
      "b c #343431",
      "c c #8d8c85",
      "! pixels",
      ...atlas.map((row) => row.join("")),
    ].join("\n");
  }

  function makeLitGardenXpm({
    width = 39,
    height = 33,
    depth = 31,
    surface = "garden",
    layerBush,
    layerTree,
    layerGrass,
    layerFlowers,
    pond = false,
    pondRadiusX = 10.5,
    pondRadiusZ = 7.5,
    pondOffsetX = 1.5,
    pondOffsetZ = -1,
    pondIrregularity = 1,
    overheadLight = true,
    lightIntensity,
    lightSpread,
    lightHue,
  } = {}) {
    const plateSurfaceChoices = new Set([
      "garden",
      "ice",
      "desert",
      "alien-red-dwarf",
      "alien-k-star",
    ]);
    const plateSurface = pond || !plateSurfaceChoices.has(surface) ? "garden" : surface;
    const surfaceDefaults = {
      garden: { layerBush: true, layerTree: true, layerGrass: true, layerFlowers: false, lightHue: 47 },
      ice: { layerBush: false, layerTree: false, layerGrass: false, layerFlowers: false, lightHue: 202 },
      desert: { layerBush: true, layerTree: true, layerGrass: false, layerFlowers: false, lightHue: 34 },
      "alien-red-dwarf": { layerBush: true, layerTree: true, layerGrass: true, layerFlowers: true, lightHue: 350 },
      "alien-k-star": { layerBush: true, layerTree: true, layerGrass: true, layerFlowers: true, lightHue: 31 },
    }[plateSurface];
    const enabledBush = layerBush ?? surfaceDefaults.layerBush;
    const enabledTree = layerTree ?? surfaceDefaults.layerTree;
    const enabledGrass = layerGrass ?? surfaceDefaults.layerGrass;
    const enabledFlowers = layerFlowers ?? surfaceDefaults.layerFlowers;
    const resolvedLightIntensity = Number.isFinite(Number(lightIntensity))
      ? Math.max(0, Math.min(1, Number(lightIntensity)))
      : plateSurface === "ice" ? 0.9 : plateSurface === "alien-red-dwarf" ? 0.68 : 0.82;
    const resolvedLightSpread = Number.isFinite(Number(lightSpread))
      ? Math.max(0.15, Math.min(1, Number(lightSpread)))
      : plateSurface === "alien-red-dwarf" ? 0.72 : 0.58;
    const resolvedLightHue = Number.isFinite(Number(lightHue))
      ? Math.max(0, Math.min(360, Number(lightHue)))
      : surfaceDefaults.lightHue;
    const sliceWidth = Math.max(31, Math.round(width));
    const sliceHeight = Math.max(29, Math.round(height));
    const sliceCount = Math.max(21, Math.round(depth));
    const centerX = Math.floor(sliceWidth / 2);
    const centerZ = Math.floor(sliceCount / 2);
    const floorY = sliceHeight - 7;
    const columns = Math.max(
      1,
      Math.ceil(Math.sqrt(sliceCount * sliceHeight / sliceWidth)),
    );
    const rows = Math.ceil(sliceCount / columns);
    const atlas = Array.from(
      { length: rows * sliceHeight },
      () => Array(columns * sliceWidth).fill(" "),
    );
    const bush = { x: centerX - 9, y: floorY - 3, z: centerZ - 5 };
    const tree = { x: centerX + 8, y: floorY - 12, z: centerZ + 4 };
    const roofCenterZ = centerZ - 1;
    const lightPositions = [
      [centerX - 9, 6, roofCenterZ],
      [centerX + 9, 6, roofCenterZ],
    ];

    for (let slice = 0; slice < sliceCount; slice += 1) {
      const tileX = slice % columns * sliceWidth;
      const tileY = Math.floor(slice / columns) * sliceHeight;

      for (let x = 1; x < sliceWidth - 1; x += 1) {
        const pondDx = (x - centerX - pondOffsetX) / pondRadiusX;
        const pondDz = (slice - centerZ - pondOffsetZ) / pondRadiusZ;
        const pondEdge =
          (Math.sin(x * 0.71 + slice * 0.43) * 0.13 +
          Math.sin(x * 1.31 - slice * 0.79) * 0.08) * pondIrregularity;
        const pondCell = pond && pondDx * pondDx + pondDz * pondDz < 1 + pondEdge;
        const terrainNoise = (x * 29 + slice * 43 + (x * slice % 17) * 5) % 23;
        let surfaceY = floorY;
        let surfaceSymbol = terrainNoise < 3 ? "c" : terrainNoise < 14 ? "a" : "b";

        if (pondCell) {
          surfaceSymbol = (x * 11 + slice * 7) % 17 < 3 ? "k" : (x + slice) % 3 ? "j" : "i";
        } else if (plateSurface === "ice") {
          const ridge = Math.sin(x * 0.36 + slice * 0.17) + Math.sin(x * 0.13 - slice * 0.41);
          surfaceY = floorY - (ridge > 1.45 ? 1 : 0);
          surfaceSymbol = (x * 13 + slice * 19) % 31 < 3
            ? "b"
            : ridge > 0.55
              ? "c"
              : "a";
        } else if (plateSurface === "desert") {
          const dune = Math.sin((x + slice * 0.58) * 0.31)
            + Math.sin(x * 0.15 - slice * 0.24 + 1.1) * 0.55;
          const duneHeight = Math.max(0, Math.min(2, Math.round(0.75 + dune * 0.62)));
          surfaceY = floorY - duneHeight;
          surfaceSymbol = duneHeight === 2 ? "c" : duneHeight === 1 ? "a" : "b";
        } else if (plateSurface === "alien-red-dwarf") {
          const ripple = Math.sin(x * 0.55 + slice * 0.29);
          surfaceSymbol = ripple > 0.55 ? "c" : terrainNoise < 13 ? "a" : "b";
        } else if (plateSurface === "alien-k-star") {
          const packedEarth = Math.sin(x * 0.38 - slice * 0.27);
          surfaceSymbol = packedEarth > 0.62 ? "c" : terrainNoise < 15 ? "a" : "b";
        }

        for (let y = surfaceY; y <= floorY; y += 1) {
          atlas[tileY + y][tileX + x] = y === surfaceY ? surfaceSymbol : "b";
        }
        for (let y = floorY + 1; y <= floorY + 3; y += 1) {
          atlas[tileY + y][tileX + x] = y === floorY + 1 && (x + slice) % 7 < 2
            ? "E"
            : "e";
        }
        if (!pondCell && plateSurface === "garden") {
          const strandNoise = (x * 37 + slice * 53 + x * slice * 3) % 31;
          if (strandNoise < 12) {
            atlas[tileY + floorY - 1][tileX + x] = strandNoise < 5 ? "s" : "r";
            if (strandNoise < 4) {
              const leanX = strandNoise % 2 === 0 ? x - 1 : x + 1;
              if (leanX > 0 && leanX < sliceWidth - 1) {
                atlas[tileY + floorY - 2][tileX + leanX] = "s";
              }
            }
          }
          const flowerNoise = (x * 47 + slice * 61 + x * slice * 5) % 79;
          if (flowerNoise < 3) {
            atlas[tileY + floorY - 1][tileX + x] = "l";
            atlas[tileY + floorY - 2][tileX + x] = flowerNoise === 0
              ? "m"
              : flowerNoise === 1
                ? "M"
                : "d";
          }
        }
      }

      const roofZ = Math.abs(slice - roofCenterZ);
      if (roofZ <= 4) {
        const inset = roofZ === 4 ? 2 : roofZ === 3 ? 1 : 0;
        for (let x = 3 + inset; x < sliceWidth - 3 - inset; x += 1) {
          atlas[tileY + 3][tileX + x] = "q";
          atlas[tileY + 4][tileX + x] = x < 6 || x >= sliceWidth - 6 ? "p" : "q";
        }
      }
      lightPositions.forEach(([lightX, lightY, lightZ]) => {
        if (Math.abs(slice - lightZ) > 1) return;
        for (let x = lightX - 1; x <= lightX + 1; x += 1) {
          atlas[tileY + lightY - 1][tileX + x] = "p";
          atlas[tileY + lightY][tileX + x] = "o";
        }
      });
    }

    const setVoxel = (slice, x, y, symbol) => {
      if (
        slice < 0 || slice >= sliceCount ||
        x < 1 || x >= sliceWidth - 1 ||
        y < 1 || y >= sliceHeight - 1
      ) return;
      const tileX = slice % columns * sliceWidth;
      const tileY = Math.floor(slice / columns) * sliceHeight;
      atlas[tileY + y][tileX + x] = symbol;
    };
    const chooseBushSymbol = (horizontal, vertical, uppercase = false) => {
      const glint = -horizontal * 0.58 - vertical * 0.7;
      const symbol = glint > 0.62 ? "w" : glint > -0.12 ? "v" : "u";
      return uppercase ? symbol.toUpperCase() : symbol;
    };
    const chooseTreeSymbol = (horizontal, vertical, uppercase = false) => {
      const glint = -horizontal * 0.42 - vertical * 0.7;
      const symbol = glint > 0.48 ? "h" : glint > -0.22 ? "g" : "f";
      return uppercase ? symbol.toUpperCase() : symbol;
    };
    const roughenedInside = (score, x, y, z, salt) => {
      const roughHash = Math.abs(
        x * 71 + y * 149 + z * 197 + x * y * 5 - y * z * 3 + salt,
      );
      const roughEdge = (roughHash % 17 - 8) * 0.013;
      const edgeNotch = roughHash % 41 === 0 && score > 0.58;
      return score <= 1 + roughEdge && !edgeNotch;
    };

    const drawRoundedBush = () => {
      for (let y = bush.y - 4; y <= bush.y + 4; y += 1) {
        for (let x = bush.x - 7; x <= bush.x + 7; x += 1) {
          const horizontal = (x - bush.x) / 6;
          const vertical = (y - bush.y) / 3.3;
          const score = horizontal * horizontal + vertical * vertical;
          if (!roughenedInside(score, x, y, bush.z, 19)) continue;
          setVoxel(bush.z, x, y, chooseBushSymbol(horizontal, vertical));
        }
        for (let z = bush.z - 5; z <= bush.z + 5; z += 1) {
          const horizontal = (z - bush.z) / 4.2;
          const vertical = (y - bush.y) / 3.3;
          const score = horizontal * horizontal + vertical * vertical;
          if (!roughenedInside(score, bush.x, y, z, 47)) continue;
          setVoxel(z, bush.x, y, chooseBushSymbol(horizontal, vertical, true));
        }
      }
    };

    const drawCanopyTree = () => {
      const canopyLobes = [
        [0, 0, 0, 5.2, 5.6, 4.7],
        [-3.1, 1.1, -0.8, 3.6, 3.7, 3.4],
        [3.0, 1.3, 0.9, 3.7, 3.6, 3.5],
        [-0.7, -3.1, 1.1, 3.7, 3.5, 3.2],
      ];
      for (let y = floorY - 10; y <= floorY; y += 1) {
        for (let x = tree.x - 1; x <= tree.x + 1; x += 1) {
          setVoxel(tree.z, x, y, x === tree.x - 1 ? "t" : "n");
        }
        for (let z = tree.z - 1; z <= tree.z + 1; z += 1) {
          setVoxel(z, tree.x, y, z === tree.z + 1 ? "T" : "N");
        }
      }
      for (let y = tree.y - 7; y <= tree.y + 7; y += 1) {
        for (let x = tree.x - 7; x <= tree.x + 7; x += 1) {
          const score = Math.min(...canopyLobes.map(([
            offsetX,
            offsetY,
            ,
            radiusX,
            radiusY,
          ]) => (
            Math.pow((x - tree.x - offsetX) / radiusX, 2) +
            Math.pow((y - tree.y - offsetY) / radiusY, 2)
          )));
          if (!roughenedInside(score, x, y, tree.z, 83)) continue;
          setVoxel(
            tree.z,
            x,
            y,
            chooseTreeSymbol((x - tree.x) / 5.8, (y - tree.y) / 5.8),
          );
        }
        for (let z = tree.z - 7; z <= tree.z + 7; z += 1) {
          const score = Math.min(...canopyLobes.map(([
            ,
            offsetY,
            offsetZ,
            ,
            radiusY,
            radiusZ,
          ]) => (
            Math.pow((z - tree.z - offsetZ) / radiusZ, 2) +
            Math.pow((y - tree.y - offsetY) / radiusY, 2)
          )));
          if (!roughenedInside(score, tree.x, y, z, 131)) continue;
          setVoxel(
            z,
            tree.x,
            y,
            chooseTreeSymbol((z - tree.z) / 4.8, (y - tree.y) / 5.8, true),
          );
        }
      }
    };

    const drawCactus = (center, cactusHeight, bushSymbols) => {
      const views = [
        {
          set: (offset, y, symbol) => setVoxel(center.z, center.x + offset, y, symbol),
          shade: bushSymbols ? ["u", "v", "w"] : ["t", "f", "h"],
        },
        {
          set: (offset, y, symbol) => setVoxel(center.z + offset, center.x, y, symbol),
          shade: bushSymbols ? ["U", "V", "W"] : ["T", "F", "H"],
        },
      ];
      views.forEach(({ set, shade }) => {
        const topY = floorY - cactusHeight;
        for (let y = topY; y <= floorY; y += 1) {
          set(0, y, y < topY + 2 ? shade[2] : y % 3 === 0 ? shade[1] : shade[0]);
          if (cactusHeight > 8 && y > topY + 2) set(1, y, shade[1]);
        }
        const armY = floorY - Math.round(cactusHeight * 0.56);
        const armReach = cactusHeight > 8 ? 4 : 3;
        for (let offset = 1; offset <= armReach; offset += 1) {
          set(offset, armY, shade[offset === armReach ? 2 : 1]);
        }
        for (let y = armY - 3; y <= armY; y += 1) set(armReach, y, shade[1]);
        for (let offset = -1; offset >= -Math.max(2, armReach - 1); offset -= 1) {
          set(offset, armY + 2, shade[0]);
        }
        for (let y = armY; y <= armY + 2; y += 1) set(-Math.max(2, armReach - 1), y, shade[1]);
      });
    };

    const drawTwistyPlant = (center, plantHeight, bushSymbols) => {
      const views = [
        {
          set: (offset, y, symbol) => setVoxel(center.z, center.x + offset, y, symbol),
          wood: bushSymbols ? "u" : "t",
          mid: bushSymbols ? "v" : "g",
          leaf: bushSymbols ? "w" : "h",
        },
        {
          set: (offset, y, symbol) => setVoxel(center.z + offset, center.x, y, symbol),
          wood: bushSymbols ? "U" : "T",
          mid: bushSymbols ? "V" : "G",
          leaf: bushSymbols ? "W" : "H",
        },
      ];
      views.forEach(({ set, wood, mid, leaf }) => {
        for (let rise = 0; rise <= plantHeight; rise += 1) {
          const y = floorY - rise;
          const offset = Math.round(
            Math.sin(rise * 0.72) * (bushSymbols ? 1.2 : 1.8) + rise * 0.08,
          );
          set(offset, y, rise > plantHeight - 3 ? mid : wood);
          if (rise === Math.round(plantHeight * 0.45) || rise === Math.round(plantHeight * 0.7)) {
            const direction = rise % 2 ? -1 : 1;
            for (let reach = 1; reach <= (bushSymbols ? 3 : 5); reach += 1) {
              set(offset + direction * reach, y - Math.floor(reach / 2), reach > 2 ? mid : wood);
            }
          }
        }
        const crownY = floorY - plantHeight;
        [-4, -2, 0, 2, 4].forEach((offset, index) => {
          if (bushSymbols && Math.abs(offset) > 2) return;
          set(offset + 1, crownY + Math.abs(offset) % 2, index % 2 ? mid : leaf);
          set(offset, crownY - 1, leaf);
        });
      });
    };

    const drawBoulderField = (mossy) => {
      const centers = [
        [centerX - 12, centerZ + 7, 5.6, 4.2, 5],
        [centerX + 12, centerZ - 6, 6.4, 4.8, 6],
        [centerX + 2, centerZ + 10, 4.5, 3.8, 4],
      ];
      centers.forEach(([rockX, rockZ, radiusX, radiusZ, peak]) => {
        for (let z = Math.floor(rockZ - radiusZ); z <= Math.ceil(rockZ + radiusZ); z += 1) {
          for (let x = Math.floor(rockX - radiusX); x <= Math.ceil(rockX + radiusX); x += 1) {
            const score = Math.pow((x - rockX) / radiusX, 2) + Math.pow((z - rockZ) / radiusZ, 2);
            if (score > 1) continue;
            const rise = Math.max(1, Math.round((1 - Math.sqrt(score)) * peak));
            const topY = floorY - rise;
            const rockSymbol = (x * 17 + z * 11 + rise) % 5 === 0 ? "k" : rise > peak * 0.58 ? "j" : "i";
            for (let y = topY; y <= floorY; y += 1) setVoxel(z, x, y, rockSymbol);
            if (mossy && (x * 23 + z * 31) % 7 < 3) {
              setVoxel(z, x, topY - 1, (x + z) % 3 === 0 ? "m" : "l");
            }
          }
        }
      });
    };

    const drawRedDwarfGroundCover = () => {
      const grassClusters = [
        [centerX - 13, centerZ - 7, 6],
        [centerX + 2, centerZ + 5, 7],
        [centerX + 13, centerZ - 1, 5],
      ];
      grassClusters.forEach(([grassX, grassZ, radius]) => {
        for (let z = grassZ - radius; z <= grassZ + radius; z += 1) {
          for (let x = grassX - radius; x <= grassX + radius; x += 1) {
            const score = Math.pow((x - grassX) / radius, 2) + Math.pow((z - grassZ) / radius, 2);
            const seed = Math.abs(x * 37 + z * 59 + x * z * 3);
            if (score > 1 || seed % 11 > 3) continue;
            const height = 3 + seed % 4;
            const lean = seed % 2 ? 1 : -1;
            for (let rise = 1; rise <= height; rise += 1) {
              const offset = Math.round(lean * rise / Math.max(3, height));
              setVoxel(z, x + offset, floorY - rise, rise === height ? "s" : "r");
            }
          }
        }
      });
      const lichenClusters = [
        [centerX - 2, centerZ - 8, 3.8],
        [centerX + 11, centerZ + 8, 4.5],
        [centerX - 13, centerZ + 6, 3.2],
      ];
      lichenClusters.forEach(([lichenX, lichenZ, radius]) => {
        for (let z = Math.floor(lichenZ - radius); z <= Math.ceil(lichenZ + radius); z += 1) {
          for (let x = Math.floor(lichenX - radius); x <= Math.ceil(lichenX + radius); x += 1) {
            const score = Math.pow((x - lichenX) / radius, 2) + Math.pow((z - lichenZ) / radius, 2);
            const seed = Math.abs(x * 41 + z * 67);
            if (score > 1 + (seed % 5) * 0.06 || seed % 4 === 0) continue;
            setVoxel(z, x, floorY - 1, seed % 3 === 0 ? "d" : seed % 3 === 1 ? "M" : "m");
          }
        }
      });
    };

    const drawKStarGroundCover = () => {
      for (let z = 2; z < sliceCount - 2; z += 1) {
        for (let x = 2; x < sliceWidth - 2; x += 1) {
          const seed = Math.abs(x * 31 + z * 47 + x * z * 5);
          if (seed % 17 < 5) {
            setVoxel(z, x, floorY - 1, seed % 2 ? "r" : "s");
            if (seed % 17 === 0) setVoxel(z, x + (seed % 3 === 0 ? -1 : 1), floorY - 2, "s");
          }
        }
      }
      const flowers = [
        [centerX - 13, centerZ - 6, 5],
        [centerX - 2, centerZ + 8, 6],
        [centerX + 13, centerZ + 5, 5],
        [centerX + 6, centerZ - 9, 4],
      ];
      flowers.forEach(([flowerX, flowerZ, stemHeight], flowerIndex) => {
        const flowerY = floorY - stemHeight;
        for (let rise = 1; rise < stemHeight; rise += 1) {
          setVoxel(flowerZ, flowerX, floorY - rise, "l");
          setVoxel(flowerZ + (flowerIndex % 2 ? 1 : 0), flowerX, floorY - rise, "l");
        }
        [[0, 0], [-2, 0], [2, 0], [0, -2], [0, 2], [-1, -1], [1, 1]].forEach(([dx, dy], index) => {
          const symbol = index === 0 ? "d" : index % 2 ? "M" : "d";
          setVoxel(flowerZ, flowerX + dx, flowerY + dy, symbol);
          setVoxel(flowerZ + dx, flowerX, flowerY + dy, symbol);
        });
      });
    };

    if (plateSurface === "desert") {
      drawCactus(bush, 7, true);
      drawCactus(tree, 15, false);
    } else if (plateSurface === "alien-red-dwarf") {
      drawBoulderField(false);
      drawRedDwarfGroundCover();
      drawTwistyPlant(bush, 7, true);
      drawTwistyPlant(tree, 15, false);
    } else {
      if (plateSurface === "alien-k-star") {
        drawKStarGroundCover();
        drawBoulderField(true);
      }
      if (plateSurface !== "ice") {
        drawRoundedBush();
        drawCanopyTree();
      }
    }

    const palette = {
      garden: {
        a: "#3f7131", b: "#27502c", c: "#8baa3d", e: "#263a42", E: "#3c5960",
        u: "#193c2b", v: "#367032", w: "#a3bb43",
        t: "#3a2920", n: "#6b4929", f: "#173b2c", g: "#2c6632", h: "#78a83d",
        p: "#142c36", q: "#2b4b53", r: "#245f31", s: "#68a848",
        l: "#377239", m: "#f3d85a", M: "#dd71b7", d: "#d8eff0",
        i: "#0b4051", j: "#126278", k: "#45a7aa",
      },
      ice: {
        a: "#b9e4f2", b: "#669bb5", c: "#edfaff", e: "#203b52", E: "#3d6478",
        u: "#31586d", v: "#7fb4c9", w: "#e7fbff",
        t: "#284b61", n: "#4f7f96", f: "#37657c", g: "#8ac4d8", h: "#f2feff",
        p: "#14344b", q: "#2c5b72", r: "#609eb9", s: "#d7f7ff",
        l: "#76b9d1", m: "#bcecf8", M: "#dff9ff", d: "#ffffff",
        i: "#477a94", j: "#83bdd2", k: "#dcf7ff",
      },
      desert: {
        a: "#c8914d", b: "#8b5c34", c: "#e5bd72", e: "#4a3025", E: "#70472d",
        u: "#214c35", v: "#3e7650", w: "#83a85d",
        t: "#183e2e", n: "#285b3d", f: "#32734a", g: "#52905a", h: "#91b86b",
        p: "#3c2a25", q: "#6a4936", r: "#78602e", s: "#b79545",
        l: "#526334", m: "#e7b05c", M: "#e98456", d: "#f6d59a",
        i: "#6b4431", j: "#916445", k: "#ba8a5b",
      },
      "alien-red-dwarf": {
        a: "#a62582", b: "#681450", c: "#db45b0", e: "#2c122c", E: "#541c49",
        u: "#09070c", v: "#321243", w: "#7d2c91",
        t: "#07070a", n: "#17101d", f: "#271034", g: "#5a1d70", h: "#a74fc3",
        p: "#211020", q: "#4b1b3d", r: "#160d24", s: "#4f245f",
        l: "#6caecc", m: "#8cd5e9", M: "#b8ecf5", d: "#e0fbff",
        i: "#3b0b13", j: "#64131b", k: "#8d2830",
      },
      "alien-k-star": {
        a: "#6c4630", b: "#402a23", c: "#9b6841", e: "#282328", E: "#4c3a34",
        u: "#713116", v: "#be4e1d", w: "#f28a2b",
        t: "#38251d", n: "#684124", f: "#8f3519", g: "#d35d20", h: "#ff9d34",
        p: "#2f2527", q: "#59413b", r: "#75631e", s: "#d6b83d",
        l: "#7f481f", m: "#ef7925", M: "#149da2", d: "#5ee1dc",
        i: "#344854", j: "#526d7a", k: "#8097a0",
      },
    }[plateSurface];
    const plateSurfaceDescription = {
      garden: "temperate garden",
      ice: "icy surface",
      desert: "cactus desert",
      "alien-red-dwarf": "red-dwarf biome with magenta sand, dark-red boulders, blue lichen, twisty black flora, and swaying black-purple grass",
      "alien-k-star": "K-star biome with orange flora, mossy blue-grey boulders, teal flowers, brown ground, and yellow grass",
    }[plateSurface];

    return [
      "! XPM2",
      "! xpm-workbench primitive slice-stack",
      `! xpm-workbench slice-size ${sliceWidth} ${sliceHeight}`,
      `! xpm-workbench slice-count ${sliceCount}`,
      `! xpm-workbench slice-layout ${columns} ${rows}`,
      "! xpm-workbench material garden-scene",
      ...(!pond ? [`! xpm-workbench plate-surface ${plateSurface}`] : []),
      `! xpm-workbench layer-bush ${enabledBush ? "on" : "off"}`,
      `! xpm-workbench layer-tree ${enabledTree ? "on" : "off"}`,
      `! xpm-workbench layer-grass ${enabledGrass ? "on" : "off"}`,
      `! xpm-workbench layer-flowers ${enabledFlowers ? "on" : "off"}`,
      `! xpm-workbench garden-pond ${pond ? "on" : "off"}`,
      `! xpm-workbench garden-impostor bush ${bush.x} ${bush.y} ${bush.z}`,
      `! xpm-workbench garden-impostor tree ${tree.x} ${tree.y} ${tree.z}`,
      `! xpm-workbench overhead-light ${overheadLight ? "on" : "off"}`,
      `! xpm-workbench light-intensity ${resolvedLightIntensity.toFixed(2)}`,
      `! xpm-workbench light-spread ${resolvedLightSpread.toFixed(2)}`,
      `! xpm-workbench light-hue ${Math.round(resolvedLightHue)}`,
      ...lightPositions.map(([x, y, z]) =>
        `! xpm-workbench light-position ${x} ${y} ${z}`
      ),
      pond
        ? "! An irregular XPM pond surrounded by grass strands and optional flowers."
        : `! smol plate class: ${plateSurfaceDescription}.`,
      `${columns * sliceWidth} ${rows * sliceHeight} 34 1`,
      "! colors",
      "  c None",
      `a c ${palette.a}`,
      `b c ${palette.b}`,
      `c c ${palette.c}`,
      `e c ${palette.e}`,
      `E c ${palette.E}`,
      `u c ${palette.u}`,
      `v c ${palette.v}`,
      `w c ${palette.w}`,
      `U c ${palette.u}`,
      `V c ${palette.v}`,
      `W c ${palette.w}`,
      `t c ${palette.t}`,
      `n c ${palette.n}`,
      `f c ${palette.f}`,
      `g c ${palette.g}`,
      `h c ${palette.h}`,
      `T c ${palette.t}`,
      `N c ${palette.n}`,
      `F c ${palette.f}`,
      `G c ${palette.g}`,
      `H c ${palette.h}`,
      `p c ${palette.p}`,
      `q c ${palette.q}`,
      `o c hsl(${Math.round(resolvedLightHue)}, 95%, 78%)`,
      `r c ${palette.r}`,
      `s c ${palette.s}`,
      `l c ${palette.l}`,
      `m c ${palette.m}`,
      `M c ${palette.M}`,
      `d c ${palette.d}`,
      `i c ${palette.i}`,
      `j c ${palette.j}`,
      `k c ${palette.k}`,
      "! pixels",
      ...atlas.map((row) => row.join("")),
    ].join("\n");
  }

  function makeGrassPondXpm() {
    return makeLitGardenXpm({
      width: 45,
      height: 33,
      depth: 37,
      layerBush: false,
      layerTree: false,
      layerGrass: true,
      layerFlowers: true,
      pond: true,
      overheadLight: false,
    });
  }

  function makeCentralGrassPoolXpm() {
    return makeLitGardenXpm({
      width: 49,
      height: 33,
      depth: 41,
      layerBush: false,
      layerTree: false,
      layerGrass: true,
      layerFlowers: false,
      pond: true,
      pondRadiusX: 6.5,
      pondRadiusZ: 6.5,
      pondOffsetX: 0,
      pondOffsetZ: 0,
      pondIrregularity: 0.9,
      overheadLight: false,
    });
  }

  function makeSmolPlateXpm(options = {}) {
    return makeLitGardenXpm({ width: 32, height: 32, depth: 32, ...options });
  }

  function applyPlateSurfaceXpm(input, surface) {
    if (![
      "garden",
      "ice",
      "desert",
      "alien-red-dwarf",
      "alien-k-star",
    ].includes(surface)) {
      return input;
    }
    const directives = parseDirectives(input);
    if (
      directives.material !== "garden-scene" ||
      directives.gardenPond === true ||
      !directives.plateSurface
    ) {
      return input;
    }
    return makeSmolPlateXpm({
      width: directives.sliceWidth,
      height: directives.sliceHeight,
      depth: directives.sliceCount,
      surface,
      overheadLight: directives.overheadLight !== false,
    });
  }

  function applySurfaceXpm(input, surface) {
    if (!["checkerboard", "grass", "sand", "mossy-rocks"].includes(surface)) {
      return input;
    }

    const directives = parseDirectives(input);
    if (!["drone-b", "glass-cube"].includes(directives.material)) return input;

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
      : Number.isFinite(directives.glassCubeCenterY)
        && Number.isFinite(directives.glassCubeHalfSize)
        ? Math.round(directives.glassCubeCenterY + directives.glassCubeHalfSize + 3)
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

  const glassFloorSizes = Object.freeze({
    compact: { width: 32, depth: 32 },
    standard: { width: 35, depth: 25 },
    large: { width: 64, depth: 64 },
    "extra-wide": { width: 128, depth: 128 },
  });

  function resizeGlassFloorXpm(input, floorSize) {
    const size = glassFloorSizes[floorSize];
    if (!size) return input;
    const directives = parseDirectives(input);
    const isCube = directives.material === "glass-cube";
    const isSphere = directives.material === "glass";
    if (!isCube && !isSphere) return input;

    let resized = isCube
      ? makeGlassCubeXpm({
          width: size.width,
          depth: size.depth,
          halfSize: Number.isFinite(directives.glassCubeHalfSize)
            ? directives.glassCubeHalfSize
            : 7,
          floorSize,
        })
      : makeSphereOverCheckerboardXpm({
          width: size.width,
          depth: size.depth,
          radius: Number.isFinite(directives.glassRadius) ? directives.glassRadius : 8,
          animated: directives.animation === "bob",
          floorSize,
        });

    [
      "refractive-index",
      "glass-hue",
      "surface-roughness",
      "dispersion",
      "absorption",
      "mirror",
      "hi-fi",
      "animation-amplitude",
      "animation-frequency",
    ].forEach((name) => {
      const directive = new RegExp(`^!\\s*xpm-workbench\\s+${name}\\s+.+$`, "mi");
      const existing = input.match(directive)?.[0];
      if (existing && directive.test(resized)) resized = resized.replace(directive, existing);
    });
    ["D", "S", "M", "L", "H"].forEach((symbol) => {
      const color = new RegExp(`^${symbol}\\s+c\\s+.+$`, "m");
      const existing = input.match(color)?.[0];
      if (existing) resized = resized.replace(color, existing);
    });
    if (isCube) resized = applySurfaceXpm(resized, directives.surface || "checkerboard");
    return resized;
  }

  global.XpmPrimitives = Object.freeze({
    applyPlateSurfaceXpm,
    applyDroneSurfaceXpm: applySurfaceXpm,
    applySurfaceXpm,
    makeCentralGrassPoolXpm,
    makeGlassCubeXpm,
    makeGrassPondXpm,
    makeLitGardenXpm,
    makeSmolPlateXpm,
    makeSphereOverCheckerboardXpm,
    makeSphereXpm,
    makeImpostorCubeXpm,
    makeImpostorSphereXpm,
    makeDroneBXpm,
    parseDirectives,
    resizeGlassFloorXpm,
  });
})(window);

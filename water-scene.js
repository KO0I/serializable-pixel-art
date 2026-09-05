(function exposeXpmWaterScene(global) {
  "use strict";

  let width = 64;
  let height = 64;
  const cameraSize = 96;
  const waterSizePresets = Object.freeze([
    [64, 64],
    [80, 80],
    [96, 96],
    [128, 128],
  ]);
  const symbols = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
  const defaultPalette = [
    "#061522",
    "#08283a",
    "#0a3d54",
    "#0c536b",
    "#106b82",
    "#16859a",
    "#289faf",
    "#52b9bf",
    "#8ed2cd",
    "#d6eee0",
  ];
  const bottomSurfacePalettes = Object.freeze({
    checkerboard: ["#111716", "#202724", "#343a35", "#4b5047", "#6d6e61", "#92917f", "#bbb8a2", "#e2dfcb"],
    "river-rocks": ["#121817", "#1b2422", "#28312e", "#343e39", "#444c43", "#565e50", "#6d725e", "#89836a"],
    "river-boulders": ["#141918", "#202725", "#303936", "#424b45", "#555d52", "#697060", "#817f69", "#9a9276"],
    "sand-ripples": ["#493a27", "#5d4930", "#725a39", "#896d45", "#a18253", "#ba9965", "#d0af78", "#e4c98f"],
    "mossy-stones": ["#121814", "#1e271f", "#2c382c", "#3b4737", "#4b5940", "#5f704b", "#75885b", "#91a46d"],
  });
  const lightSourceColors = Object.freeze({
    daylight: [255, 248, 224],
    "warm-lamp": [255, 184, 105],
    "cool-led": [174, 224, 255],
    "green-glow": [142, 255, 174],
    "magenta-glow": [255, 142, 230],
  });
  const vegetationPalettes = Object.freeze({
    clovers: [[22, 72, 42], [39, 112, 55], [81, 158, 75]],
    grass: [[18, 61, 38], [31, 96, 49], [61, 139, 65]],
    "tall-grass": [[15, 55, 35], [28, 88, 45], [54, 126, 58]],
  });
  const defaultLiquidRefraction = 1.333;
  const defaultLiquidHue = 190;
  const defaultLiquidDispersion = 0.08;
  const defaultLiquidAbsorption = 0.3;
  const defaultSurfaceOpacity = 0.55;

  function clamp(value, minimum, maximum) {
    return Math.max(minimum, Math.min(maximum, value));
  }

  function hash2d(x, y) {
    const value = Math.sin(x * 127.1 + y * 311.7) * 43758.5453123;
    return value - Math.floor(value);
  }

  function normalize3([x, y, z]) {
    const length = Math.hypot(x, y, z) || 1;
    return [x / length, y / length, z / length];
  }

  function dot3(left, right) {
    return left[0] * right[0] + left[1] * right[1] + left[2] * right[2];
  }

  function lightDirectionForAngle(angle) {
    const azimuth = Number(angle) * Math.PI / 180;
    const elevation = 55 * Math.PI / 180;
    const horizontal = Math.cos(elevation);
    return normalize3([
      Math.cos(azimuth) * horizontal,
      Math.sin(elevation),
      Math.sin(azimuth) * horizontal,
    ]);
  }

  function pointInPolygon(x, y, points) {
    let inside = false;
    for (let index = 0, previous = points.length - 1; index < points.length; previous = index, index += 1) {
      const currentPoint = points[index];
      const previousPoint = points[previous];
      const crosses = (currentPoint.y > y) !== (previousPoint.y > y) &&
        x < (previousPoint.x - currentPoint.x) * (y - currentPoint.y) /
          (previousPoint.y - currentPoint.y || Number.EPSILON) + currentPoint.x;
      if (crosses) inside = !inside;
    }
    return inside;
  }

  function mixRgb(left, right, amount) {
    const blend = clamp(amount, 0, 1);
    return left.map((channel, index) =>
      Math.round(channel + (right[index] - channel) * blend)
    );
  }

  function scaleRgb(color, amount) {
    return color.map((channel) => clamp(Math.round(channel * amount), 0, 255));
  }

  function addEmissiveRgb(surface, light, amount) {
    const luminance = (surface[0] * 0.2126 + surface[1] * 0.7152 + surface[2] * 0.0722) / 255;
    const energy = clamp(amount * (1.28 - luminance * 0.34), 0, 1.65);
    return surface.map((channel, index) => {
      const spectralEnergy = 0.22 + light[index] / 255 * 0.78;
      return clamp(
        Math.round(channel + (255 - channel) * energy * spectralEnergy),
        0,
        255,
      );
    });
  }

  function hslToRgb(hue, saturation, lightness) {
    const normalizedHue = ((Number(hue) % 360) + 360) % 360 / 360;
    const amplitude = saturation * Math.min(lightness, 1 - lightness);
    const channel = (offset) => {
      const phase = (offset + normalizedHue * 12) % 12;
      return lightness - amplitude * Math.max(-1, Math.min(phase - 3, 9 - phase, 1));
    };
    return [channel(0), channel(8), channel(4)].map((value) => Math.round(value * 255));
  }

  function cssColor(rgb, alpha = 1) {
    return `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${clamp(alpha, 0, 1).toFixed(3)})`;
  }

  function createVoronoiSurface({ cellSize, heightScale, lumpy = false, mossy = false }) {
    const indices = new Uint8Array(width * height);
    const heights = new Float32Array(width * height);
    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        const cellX = Math.floor(x / cellSize);
        const cellY = Math.floor(y / cellSize);
        let nearest = Infinity;
        let secondNearest = Infinity;
        let nearestCellX = cellX;
        let nearestCellY = cellY;
        for (let offsetY = -1; offsetY <= 1; offsetY += 1) {
          for (let offsetX = -1; offsetX <= 1; offsetX += 1) {
            const candidateX = cellX + offsetX;
            const candidateY = cellY + offsetY;
            const seedX = (candidateX + 0.2 + hash2d(candidateX, candidateY) * 0.6) * cellSize;
            const seedY = (candidateY + 0.2 + hash2d(candidateX + 19, candidateY - 7) * 0.6) * cellSize;
            const distance = Math.hypot(x - seedX, y - seedY);
            if (distance < nearest) {
              secondNearest = nearest;
              nearest = distance;
              nearestCellX = candidateX;
              nearestCellY = candidateY;
            } else if (distance < secondNearest) {
              secondNearest = distance;
            }
          }
        }
        const crack = secondNearest - nearest < 0.72;
        const stoneTone = Math.floor(
          hash2d(nearestCellX * 3 + 5, nearestCellY * 3 - 2) * 5
        ) + 2;
        const grain = hash2d(x * 5 + 13, y * 5 + 29) > 0.82 ? 1 : 0;
        const roundedProfile = clamp(1 - nearest / (cellSize * 0.72), 0, 1);
        let paletteIndex = crack
          ? Math.floor(hash2d(x, y) * 2)
          : clamp(stoneTone + grain, 2, 7);
        if (mossy && !crack && hash2d(nearestCellX - 11, nearestCellY + 23) > 0.46) {
          paletteIndex = clamp(paletteIndex + 1, 4, 7);
        }
        const index = y * width + x;
        indices[index] = paletteIndex;
        heights[index] = crack
          ? -heightScale * 0.22
          : lumpy
            ? Math.pow(roundedProfile, 1.55) * heightScale + grain * 0.16
            : roundedProfile * heightScale + (stoneTone - 4) * 0.08;
      }
    }
    return { indices, heights };
  }

  function createCheckerboardSurface() {
    const indices = new Uint8Array(width * height);
    const heights = new Float32Array(width * height);
    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        const dark = (Math.floor(x / 6) + Math.floor(y / 6)) % 2 === 0;
        indices[y * width + x] = dark ? 1 : 7;
      }
    }
    return { indices, heights };
  }

  function createSandRippleSurface() {
    const indices = new Uint8Array(width * height);
    const heights = new Float32Array(width * height);
    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        const ripple = Math.sin(x * 0.42 + Math.sin(y * 0.16) * 1.8);
        const crossRipple = Math.sin(y * 0.12 + x * 0.035) * 0.24;
        const combined = clamp((ripple + crossRipple + 1.24) / 2.48, 0, 1);
        const index = y * width + x;
        indices[index] = clamp(Math.round(combined * 6) + (hash2d(x, y) > 0.9 ? 1 : 0), 0, 7);
        heights[index] = ripple * 0.52 + crossRipple * 0.28;
      }
    }
    return { indices, heights };
  }

  function createBottomSurfaces() {
    return Object.freeze({
      checkerboard: createCheckerboardSurface(),
      "river-rocks": createVoronoiSurface({ cellSize: 7, heightScale: 0.72 }),
      "river-boulders": createVoronoiSurface({ cellSize: 15, heightScale: 3.8, lumpy: true }),
      "sand-ripples": createSandRippleSurface(),
      "mossy-stones": createVoronoiSurface({ cellSize: 8, heightScale: 0.95, mossy: true }),
    });
  }

  let bottomSurfaces = createBottomSurfaces();

  function advance(current, previous, damp, gravity = 1) {
    const gravityScale = clamp(gravity, 1 / 6, 6);
    const substeps = Math.max(1, Math.ceil(Math.sqrt(gravityScale)));
    const waveCoefficient = 0.25 * gravityScale / (substeps * substeps);
    const retention = Math.pow(1 - clamp(damp, 10, 50) * 0.001, 1 / substeps);
    let read = current;
    let write = previous;
    for (let substep = 0; substep < substeps; substep += 1) {
      for (let y = 0; y < height; y += 1) {
        const upY = Math.max(0, y - 1);
        const downY = Math.min(height - 1, y + 1);
        for (let x = 0; x < width; x += 1) {
          const leftX = Math.max(0, x - 1);
          const rightX = Math.min(width - 1, x + 1);
          const index = y * width + x;
          const center = read[index];
          const laplacian =
            read[upY * width + x] +
            read[downY * width + x] +
            read[y * width + leftX] +
            read[y * width + rightX] -
            4 * center;
          const next = (2 * center - write[index] + waveCoefficient * laplacian) * retention;
          write[index] = Math.max(0, next);
        }
      }
      [read, write] = [write, read];
    }
    return [read, write];
  }

  function disturb(field, x, y, amplitude, radius) {
    const minimumX = Math.max(0, Math.floor(x - radius));
    const maximumX = Math.min(width - 1, Math.ceil(x + radius));
    const minimumY = Math.max(0, Math.floor(y - radius));
    const maximumY = Math.min(height - 1, Math.ceil(y + radius));
    for (let py = minimumY; py <= maximumY; py += 1) {
      for (let px = minimumX; px <= maximumX; px += 1) {
        const distance = Math.hypot(px - x, py - y);
        if (distance > radius) continue;
        const falloff = Math.pow(1 - distance / Math.max(0.001, radius), 1.5);
        const index = py * width + px;
        field[index] = Math.max(field[index], amplitude * falloff);
      }
    }
  }

  function rotateSample(x, y, degrees) {
    const radians = degrees * Math.PI / 180;
    const cosine = Math.cos(radians);
    const sine = Math.sin(radians);
    const centeredX = x + 0.5 - width / 2;
    const centeredY = y + 0.5 - height / 2;
    return [
      centeredX * cosine + centeredY * sine + width / 2 - 0.5,
      -centeredX * sine + centeredY * cosine + height / 2 - 0.5,
    ];
  }

  function fieldValue(field, x, y) {
    const sampleX = clamp(Math.round(x), 0, width - 1);
    const sampleY = clamp(Math.round(y), 0, height - 1);
    return field[sampleY * width + sampleX];
  }

  function quantize(field, rotation, lightAngle = -135, lightIntensity = 1) {
    const output = new Uint8Array(width * height);
    const radians = rotation * Math.PI / 180;
    const cosine = Math.cos(radians);
    const sine = Math.sin(radians);
    const worldLight = lightDirectionForAngle(lightAngle);
    const light = [worldLight[0], worldLight[2], worldLight[1]];
    const brightness = clamp(lightIntensity, 0, 2);

    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        const [sampleX, sampleY] = rotateSample(x, y, rotation);
        const center = fieldValue(field, sampleX, sampleY);
        const sourceDx = fieldValue(field, sampleX + 1, sampleY) -
          fieldValue(field, sampleX - 1, sampleY);
        const sourceDy = fieldValue(field, sampleX, sampleY + 1) -
          fieldValue(field, sampleX, sampleY - 1);
        const gradientX = sourceDx * cosine - sourceDy * sine;
        const gradientY = sourceDx * sine + sourceDy * cosine;
        const normal = [-gradientX * 1.35, -gradientY * 1.35, 1];
        const normalLength = Math.hypot(...normal) || 1;
        const illumination = clamp(
          (normal[0] * light[0] + normal[1] * light[1] + normal[2] * light[2]) /
            normalLength,
          -1,
          1,
        );
        const crest = clamp(center / 4.5, 0, 1);
        const intensity = clamp(
          0.08 + brightness * (0.18 + illumination * 0.52 + crest * 0.2),
          0,
          1,
        );
        output[y * width + x] = Math.round(intensity * (symbols.length - 1));
      }
    }
    return output;
  }

  function xpmDocument(rows, documentWidth, documentHeight, {
    damp,
    gravity,
    bottomSurface,
    vegetation,
    lightAngle,
    lightSource,
    lightIntensity,
    causticDetail,
    liquidRefraction,
    liquidHue,
    liquidDispersion,
    liquidAbsorption,
    surfaceOpacity,
    reflectiveSurface,
    sphereEnabled,
    sphereRefraction,
    sphereHue,
    sphereRoughness,
    sphereDispersion,
    sphereAbsorption,
    sphereMirror,
    sphereHiFi,
    sphereAmplitude,
    sphereFrequency,
    sphereEmissive,
    rotation,
    rain,
    palette,
    atlas,
  }) {
    return [
      "! XPM2",
      "! Converted from Godot's compute/texture water ripple demo",
      "! https://github.com/godotengine/godot-demo-projects/tree/master/compute/texture",
      `! xpm-workbench primitive ${atlas ? "water-animation-atlas" : "water-heightfield"}`,
      "! xpm-workbench material water-heightfield",
      `! xpm-workbench water-size ${width} ${height}`,
      `! xpm-workbench water-damp ${damp.toFixed(1)}`,
      `! xpm-workbench water-gravity ${gravity.toFixed(3)}`,
      `! xpm-workbench water-bottom ${bottomSurface}`,
      `! xpm-workbench water-vegetation ${vegetation}`,
      `! xpm-workbench water-light-angle ${Math.round(lightAngle)}`,
      `! xpm-workbench water-light-source ${lightSource}`,
      `! xpm-workbench water-light-intensity ${lightIntensity.toFixed(2)}`,
      `! xpm-workbench water-caustic-detail ${causticDetail}`,
      `! xpm-workbench water-liquid-refraction ${liquidRefraction.toFixed(3)}`,
      `! xpm-workbench water-liquid-color ${Math.round(liquidHue)}`,
      `! xpm-workbench water-liquid-dispersion ${liquidDispersion.toFixed(2)}`,
      `! xpm-workbench water-liquid-absorption ${liquidAbsorption.toFixed(2)}`,
      `! xpm-workbench water-surface-opacity ${surfaceOpacity.toFixed(2)}`,
      `! xpm-workbench water-reflective-surface ${reflectiveSurface ? "on" : "off"}`,
      `! xpm-workbench water-rotation ${Math.round(rotation)}`,
      `! xpm-workbench water-rain ${rain ? "on" : "off"}`,
      ...(sphereEnabled ? [
        "! xpm-workbench water-glass-sphere on",
        `! xpm-workbench refractive-index ${sphereRefraction.toFixed(2)}`,
        `! xpm-workbench glass-hue ${Math.round(sphereHue)}`,
        `! xpm-workbench surface-roughness ${sphereRoughness.toFixed(2)}`,
        `! xpm-workbench dispersion ${sphereDispersion.toFixed(2)}`,
        `! xpm-workbench absorption ${sphereAbsorption.toFixed(2)}`,
        `! xpm-workbench mirror ${sphereMirror ? "on" : "off"}`,
        `! xpm-workbench hi-fi ${sphereHiFi ? "on" : "off"}`,
        "! xpm-workbench animation bob",
        `! xpm-workbench animation-amplitude ${sphereAmplitude.toFixed(2)}`,
        `! xpm-workbench animation-frequency ${sphereFrequency.toFixed(2)}`,
        `! xpm-workbench glass-emissive ${sphereEmissive.toFixed(2)}`,
      ] : []),
      ...(atlas ? [`! xpm-workbench animation-atlas ${width} ${height} 16 4 4`] : []),
      `${documentWidth} ${documentHeight} ${symbols.length} 1`,
      "! colors",
      ...symbols.map((symbol, index) => `${symbol} c ${palette[index]}`),
      "! pixels",
      ...rows,
    ].join("\n");
  }

  class WaterScene {
    constructor(canvas) {
      this.canvas = canvas;
      this.context = canvas?.getContext("2d") || null;
      this.current = new Float32Array(width * height);
      this.previous = new Float32Array(width * height);
      this.damp = 10;
      this.gravity = 1;
      this.bottomSurface = "river-rocks";
      this.vegetation = "grass";
      this.lightAngle = -135;
      this.lightSource = "daylight";
      this.lightIntensity = 1;
      this.causticDetail = "fast";
      this.causticMap = null;
      this.previousCausticMap = null;
      this.liquidRefraction = defaultLiquidRefraction;
      this.liquidHue = defaultLiquidHue;
      this.liquidDispersion = defaultLiquidDispersion;
      this.liquidAbsorption = defaultLiquidAbsorption;
      this.surfaceOpacity = defaultSurfaceOpacity;
      this.reflectiveSurface = false;
      this.sphereEnabled = false;
      this.sphereRefraction = 1.5;
      this.sphereHue = 184;
      this.sphereRoughness = 0.15;
      this.sphereDispersion = 0.12;
      this.sphereAbsorption = 0.08;
      this.sphereMirror = false;
      this.sphereHiFi = false;
      this.sphereAmplitude = 2;
      this.sphereFrequency = 0.6;
      this.sphereEmissive = 0;
      this.liquidTint = hslToRgb(defaultLiquidHue, 0.68, 0.32);
      this.rotation = 20;
      this.rain = true;
      this.palette = [...defaultPalette];
      this.paletteRgb = this.palette.map((color) => this.parseColor(color));
      this.bottomPaletteRgb = Object.fromEntries(
        Object.entries(bottomSurfacePalettes).map(([name, palette]) => [
          name,
          palette.map((color) => this.parseColor(color)),
        ]),
      );
      this.view = { mode: "2d", yaw: 38, pitch: -34, depth: 18, autoOrbit: false };
      this.surfaceHits = [];
      this.active = false;
      this.frame = null;
      this.lastTime = 0;
      this.accumulator = 0;
      this.rainAccumulator = 0;
      this.dragPointer = null;
      if (canvas) this.attachPointerEvents();
      this.reset();
    }

    parseColor(color) {
      const probe = document.createElement("canvas");
      probe.width = 1;
      probe.height = 1;
      const probeContext = probe.getContext("2d");
      probeContext.fillStyle = "#000000";
      probeContext.fillStyle = color;
      probeContext.fillRect(0, 0, 1, 1);
      return Array.from(probeContext.getImageData(0, 0, 1, 1).data.slice(0, 3));
    }

    attachPointerEvents() {
      this.canvas.addEventListener("pointerdown", (event) => {
        if (!this.active || event.button !== 0) return;
        if (this.view.mode === "2.5d" && !this.view.autoOrbit) return;
        if (!this.drawAtPointer(event)) return;
        event.preventDefault();
        event.stopPropagation();
        this.dragPointer = event.pointerId;
        this.canvas.setPointerCapture(event.pointerId);
      });
      this.canvas.addEventListener("pointermove", (event) => {
        if (!this.active || this.dragPointer !== event.pointerId) return;
        event.preventDefault();
        event.stopPropagation();
        this.drawAtPointer(event);
      });
      const endPointer = (event) => {
        if (this.dragPointer === event.pointerId) this.dragPointer = null;
      };
      this.canvas.addEventListener("pointerup", endPointer);
      this.canvas.addEventListener("pointercancel", endPointer);
    }

    drawAtPointer(event) {
      const bounds = this.canvas.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return false;
      const canvasX = (event.clientX - bounds.left) / bounds.width * this.canvas.width;
      const canvasY = (event.clientY - bounds.top) / bounds.height * this.canvas.height;
      let displayX;
      let displayY;
      if (this.view.mode === "2d") {
        if (canvasX < 0 || canvasX >= width || canvasY < 0 || canvasY >= height) return false;
        displayX = canvasX;
        displayY = canvasY;
      } else {
        let hit = null;
        for (let index = this.surfaceHits.length - 1; index >= 0; index -= 1) {
          if (pointInPolygon(canvasX, canvasY, this.surfaceHits[index].points)) {
            hit = this.surfaceHits[index];
            break;
          }
        }
        if (!hit) return false;
        displayX = hit.fieldX;
        displayY = hit.fieldY;
      }
      const [x, y] = rotateSample(displayX, displayY, this.rotation);
      disturb(this.current, x, y, 5, 2.8);
      return true;
    }

    reset() {
      this.current.fill(0);
      this.previous.fill(0);
      disturb(this.current, width * 0.30, height * 0.38, 4.6, 2.4);
      disturb(this.current, width * 0.67, height * 0.56, 3.8, 2.1);
      disturb(this.current, width * 0.53, height * 0.23, 3.2, 1.8);
      for (let index = 0; index < 14; index += 1) this.step();
      this.draw();
    }

    step() {
      [this.current, this.previous] = advance(
        this.current,
        this.previous,
        this.damp,
        this.gravity,
      );
    }

    activate(image) {
      const wasActive = this.active;
      this.active = true;
      const sizeChanged = this.setSize(
        Number(image.directives.waterWidth),
        Number(image.directives.waterHeight),
      );
      const palette = symbols.map((symbol, index) =>
        image.colors.get(symbol) || defaultPalette[index]
      );
      if (palette.some((color, index) => color !== this.palette[index])) {
        this.palette = palette;
        this.paletteRgb = palette.map((color) => this.parseColor(color));
      }
      const directiveDamp = Number(image.directives.waterDamp);
      const directiveGravity = Number(image.directives.waterGravity);
      const directiveLightAngle = Number(image.directives.waterLightAngle);
      const directiveLightIntensity = Number(image.directives.waterLightIntensity);
      const directiveLiquidRefraction = Number(image.directives.waterLiquidRefraction);
      const directiveLiquidHue = Number(image.directives.waterLiquidColor);
      const directiveLiquidDispersion = Number(image.directives.waterLiquidDispersion);
      const directiveLiquidAbsorption = Number(image.directives.waterLiquidAbsorption);
      const directiveSurfaceOpacity = Number(image.directives.waterSurfaceOpacity);
      const directiveRotation = Number(image.directives.waterRotation);
      this.sphereEnabled = image.directives.waterGlassSphere === true;
      this.sphereRefraction = clamp(Number(image.directives.refractiveIndex) || 1.5, 1, 2.5);
      this.sphereHue = clamp(Number(image.directives.glassHue) || 0, 0, 360);
      this.sphereRoughness = clamp(Number(image.directives.surfaceRoughness) || 0, 0, 1);
      this.sphereDispersion = clamp(Number(image.directives.dispersion) || 0, 0, 1);
      this.sphereAbsorption = clamp(Number(image.directives.absorption) || 0, 0, 1);
      this.sphereMirror = image.directives.mirror === true;
      this.sphereHiFi = image.directives.hiFi === true;
      this.sphereAmplitude = clamp(Number(image.directives.animationAmplitude) || 0, 0, 8);
      this.sphereFrequency = clamp(Number(image.directives.animationFrequency) || 0, 0, 3);
      this.sphereEmissive = clamp(Number(image.directives.glassEmissive) || 0, 0, 1);
      this.setDamp(Number.isFinite(directiveDamp) ? directiveDamp : 10);
      if (Number.isFinite(directiveGravity)) this.setGravity(directiveGravity);
      if (image.directives.waterBottom) this.setBottomSurface(image.directives.waterBottom);
      this.setVegetation(image.directives.waterVegetation || "grass");
      this.setLightAngle(Number.isFinite(directiveLightAngle) ? directiveLightAngle : -135);
      this.setLightSource(image.directives.waterLightSource || "daylight");
      this.setLightIntensity(Number.isFinite(directiveLightIntensity) ? directiveLightIntensity : 1);
      this.setCausticDetail(image.directives.waterCausticDetail || "fast");
      this.setLiquidRefraction(
        Number.isFinite(directiveLiquidRefraction)
          ? directiveLiquidRefraction
          : defaultLiquidRefraction,
      );
      this.setLiquidHue(
        Number.isFinite(directiveLiquidHue) ? directiveLiquidHue : defaultLiquidHue,
      );
      this.setLiquidDispersion(
        Number.isFinite(directiveLiquidDispersion)
          ? directiveLiquidDispersion
          : defaultLiquidDispersion,
      );
      this.setLiquidAbsorption(
        Number.isFinite(directiveLiquidAbsorption)
          ? directiveLiquidAbsorption
          : defaultLiquidAbsorption,
      );
      this.setSurfaceOpacity(
        Number.isFinite(directiveSurfaceOpacity)
          ? directiveSurfaceOpacity
          : defaultSurfaceOpacity,
      );
      this.setReflectiveSurface(image.directives.waterReflectiveSurface === true);
      if (Number.isFinite(directiveRotation)) this.setRotation(directiveRotation);
      if (typeof image.directives.waterRain === "boolean") {
        this.setRain(image.directives.waterRain);
      }
      if (!wasActive && !sizeChanged) this.reset();
      this.start();
    }

    deactivate() {
      this.active = false;
      this.dragPointer = null;
      if (this.frame !== null) cancelAnimationFrame(this.frame);
      this.frame = null;
    }

    start() {
      if (this.frame !== null) return;
      this.lastTime = performance.now();
      const animate = (time) => {
        if (!this.active) {
          this.frame = null;
          return;
        }
        const elapsed = Math.min(0.08, Math.max(0, (time - this.lastTime) / 1000));
        this.lastTime = time;
        this.accumulator += elapsed;
        this.rainAccumulator = this.rain ? this.rainAccumulator + elapsed : 0;
        while (this.accumulator >= 1 / 30) {
          this.accumulator -= 1 / 30;
          const rainInterval = 0.1 * (64 * 64) / (width * height);
          while (this.rain && this.rainAccumulator >= rainInterval) {
            this.rainAccumulator -= rainInterval;
            disturb(
              this.current,
              2 + Math.random() * (width - 4),
              2 + Math.random() * (height - 4),
              3,
              1.5,
            );
          }
          this.step();
        }
        this.draw();
        this.frame = requestAnimationFrame(animate);
      };
      this.frame = requestAnimationFrame(animate);
    }

    setView({ mode, yaw, pitch, depth, autoOrbit } = {}) {
      if (mode === "2d" || mode === "2.5d") this.view.mode = mode;
      if (Number.isFinite(Number(yaw))) this.view.yaw = Number(yaw);
      if (Number.isFinite(Number(pitch))) this.view.pitch = clamp(Number(pitch), -65, 65);
      if (Number.isFinite(Number(depth))) this.view.depth = clamp(Number(depth), 0, 100);
      if (typeof autoOrbit === "boolean") this.view.autoOrbit = autoOrbit;
    }

    rotatedFieldValue(x, y) {
      const [sampleX, sampleY] = rotateSample(x, y, this.rotation);
      return fieldValue(this.current, sampleX, sampleY);
    }

    surfaceInfo(x, y) {
      const center = this.rotatedFieldValue(x, y);
      const left = this.rotatedFieldValue(x - 1, y);
      const right = this.rotatedFieldValue(x + 1, y);
      const up = this.rotatedFieldValue(x, y - 1);
      const down = this.rotatedFieldValue(x, y + 1);
      const gradientX = (right - left) * 0.5;
      const gradientZ = (down - up) * 0.5;
      const laplacian = left + right + up + down - center * 4;
      const heightValue = center * 0.48;
      const normal = normalize3([-gradientX * 0.66, 1, -gradientZ * 0.66]);
      return { center, gradientX, gradientZ, laplacian, heightValue, normal };
    }

    rockIndexAt(x, y) {
      const sampleX = clamp(Math.round(x), 0, width - 1);
      const sampleY = clamp(Math.round(y), 0, height - 1);
      const surface = bottomSurfaces[this.bottomSurface] || bottomSurfaces["river-rocks"];
      return surface.indices[sampleY * width + sampleX];
    }

    rockHeightAt(x, y) {
      const sampleX = clamp(Math.round(x), 0, width - 1);
      const sampleY = clamp(Math.round(y), 0, height - 1);
      const surface = bottomSurfaces[this.bottomSurface] || bottomSurfaces["river-rocks"];
      return surface.heights[sampleY * width + sampleX];
    }

    lightDirection() {
      return lightDirectionForAngle(this.lightAngle);
    }

    lightColor() {
      return lightSourceColors[this.lightSource] || lightSourceColors.daylight;
    }

    sphereBobY(timeSeconds = performance.now() / 1000) {
      return -8 - Math.sin(timeSeconds * Math.PI * 2 * this.sphereFrequency) *
        this.sphereAmplitude;
    }

    sphereLightColor() {
      return hslToRgb(this.sphereHue, 0.82, 0.64);
    }

    sphereLightAt(x, z, verticalDistance = 0) {
      if (!this.sphereEnabled || this.sphereEmissive <= 0) return 0;
      const worldX = x - width / 2;
      const worldZ = z - height / 2;
      const radius = 18 + this.sphereEmissive * 24;
      const distance = Math.hypot(worldX, worldZ, verticalDistance * 0.55);
      const falloff = clamp(1 - distance / radius, 0, 1);
      return falloff * falloff * this.sphereEmissive * 1.45;
    }

    bottomNormalAt(x, y) {
      const left = this.rockHeightAt(x - 1, y);
      const right = this.rockHeightAt(x + 1, y);
      const up = this.rockHeightAt(x, y - 1);
      const down = this.rockHeightAt(x, y + 1);
      return normalize3([(left - right) * 0.5, 1, (up - down) * 0.5]);
    }

    rawCausticAt(x, y, depth = this.view.depth) {
      const light = this.lightDirection();
      const travel = clamp(depth, 2, 40) * Math.hypot(light[0], light[2]) /
        Math.max(0.25, light[1]) * 0.12;
      const info = this.surfaceInfo(
        x - light[0] * travel,
        y - light[2] * travel,
      );
      const depthFactor = clamp(depth / 18, 0.25, 2.2);
      const curvature = Math.abs(info.laplacian) * (0.72 + depthFactor * 0.34);
      const converging = Math.max(0, -info.laplacian) * 0.62;
      const slope = Math.hypot(info.gradientX, info.gradientZ) * 0.08;
      return clamp(curvature + converging + slope - 0.08, 0, 1);
    }

    causticAt(x, y, depth = this.view.depth) {
      if (this.reflectiveSurface) return 0;
      const fade = clamp((Number(depth) - 20) / 5, 0, 1);
      if (fade >= 1) return 0;
      const step = this.causticDetail === "fine" ? 1 : this.causticDetail === "balanced" ? 2 : 4;
      const map = this.causticMap;
      if (!map || map.depth !== depth) return this.rawCausticAt(x, y, depth);
      const sample = (sampleX, sampleY) => {
        const mapX = clamp(Math.round(sampleX / step), 0, map.width - 1);
        const mapY = clamp(Math.round(sampleY / step), 0, map.height - 1);
        return map.values[mapY * map.width + mapX];
      };
      const center = sample(x, y);
      if (fade <= 0) return center;
      const smoothFade = fade * fade * (3 - 2 * fade);
      const radius = 0.75 + smoothFade * 2.25;
      const blurred = (
        center * 2 +
        sample(x - radius, y) +
        sample(x + radius, y) +
        sample(x, y - radius) +
        sample(x, y + radius)
      ) / 6;
      return (center + (blurred - center) * smoothFade) * (1 - smoothFade);
    }

    buildCausticMap(depth = this.view.depth) {
      if (this.reflectiveSurface || depth >= 25) {
        this.causticMap = null;
        return;
      }
      const step = this.causticDetail === "fine" ? 1 : this.causticDetail === "balanced" ? 2 : 4;
      const mapWidth = Math.ceil(width / step);
      const mapHeight = Math.ceil(height / step);
      const photons = new Float32Array(mapWidth * mapHeight);
      const light = this.lightDirection();
      const travel = clamp(depth, 2, 40) / Math.max(0.25, light[1]);
      const refractionStrength = clamp((this.liquidRefraction - 1) / (defaultLiquidRefraction - 1), 0, 2);
      for (let y = 0; y < height; y += step) {
        for (let x = 0; x < width; x += step) {
          const surface = this.surfaceInfo(x, y);
          const hitX = x + (surface.gradientX * 0.72 * refractionStrength - light[0] * 0.12) * travel;
          const hitY = y + (surface.gradientZ * 0.72 * refractionStrength - light[2] * 0.12) * travel;
          const photonX = clamp(Math.round(hitX / step), 0, mapWidth - 1);
          const photonY = clamp(Math.round(hitY / step), 0, mapHeight - 1);
          photons[photonY * mapWidth + photonX] += 0.16 + this.rawCausticAt(x, y, depth) * 1.35;
        }
      }
      const gathered = new Float32Array(photons.length);
      for (let y = 0; y < mapHeight; y += 1) {
        for (let x = 0; x < mapWidth; x += 1) {
          let total = 0;
          let weight = 0;
          for (let offsetY = -1; offsetY <= 1; offsetY += 1) {
            for (let offsetX = -1; offsetX <= 1; offsetX += 1) {
              const sampleX = clamp(x + offsetX, 0, mapWidth - 1);
              const sampleY = clamp(y + offsetY, 0, mapHeight - 1);
              const sampleWeight = offsetX === 0 && offsetY === 0 ? 4 : offsetX === 0 || offsetY === 0 ? 2 : 1;
              total += photons[sampleY * mapWidth + sampleX] * sampleWeight;
              weight += sampleWeight;
            }
          }
          gathered[y * mapWidth + x] = clamp(total / weight * 2.4 - 0.08, 0, 1);
        }
      }
      const previous = this.previousCausticMap;
      const temporalWeight = this.causticDetail === "fast" ? 0.68 : this.causticDetail === "balanced" ? 0.45 : 0;
      if (previous && previous.width === mapWidth && previous.height === mapHeight && previous.depth === depth && previous.detail === this.causticDetail) {
        for (let index = 0; index < gathered.length; index += 1) {
          gathered[index] = gathered[index] * (1 - temporalWeight) + previous.values[index] * temporalWeight;
        }
      }
      this.causticMap = { values: gathered, width: mapWidth, height: mapHeight, depth, detail: this.causticDetail };
      this.previousCausticMap = this.causticMap;
    }

    bottomColorAt(x, y, depth = this.view.depth) {
      const surface = this.surfaceInfo(x, y);
      const refractionStrength = clamp(
        (this.liquidRefraction - 1) / (defaultLiquidRefraction - 1),
        0,
        2,
      );
      const refractScale = clamp(depth, 0, 100) * 0.19 * refractionStrength;
      const sampleX = x + surface.gradientX * refractScale;
      const sampleY = y + surface.gradientZ * refractScale;
      const dispersionScale = refractScale * this.liquidDispersion * 0.36;
      const redX = x + surface.gradientX * (refractScale - dispersionScale);
      const redY = y + surface.gradientZ * (refractScale - dispersionScale);
      const blueX = x + surface.gradientX * (refractScale + dispersionScale);
      const blueY = y + surface.gradientZ * (refractScale + dispersionScale);
      const palette = this.bottomPaletteRgb[this.bottomSurface] || this.bottomPaletteRgb["river-rocks"];
      const redRock = palette[this.rockIndexAt(redX, redY)];
      const greenRock = palette[this.rockIndexAt(sampleX, sampleY)];
      const blueRock = palette[this.rockIndexAt(blueX, blueY)];
      const rock = [redRock[0], greenRock[1], blueRock[2]];
      const caustic = this.causticAt(x, y, depth);
      const diffuse = clamp(dot3(this.bottomNormalAt(sampleX, sampleY), this.lightDirection()), 0, 1);
      const lighting = clamp(0.22 + this.lightIntensity * (0.32 + diffuse * 0.46), 0.12, 1.45);
      const shadedRock = scaleRgb(rock, lighting);
      const opticalDepth = this.liquidAbsorption * clamp(depth, 0, 100) / 18;
      const absorbed = (1 - Math.exp(-opticalDepth * 0.9)) * 0.78;
      const underwaterRock = mixRgb(shadedRock, this.liquidTint, absorbed);
      const filteredLight = mixRgb(
        this.lightColor(),
        this.liquidTint,
        clamp(absorbed * 0.32, 0, 0.34),
      );
      const causticColor = addEmissiveRgb(
        underwaterRock,
        filteredLight,
        caustic * 0.92 * clamp(this.lightIntensity, 0, 2),
      );
      return addEmissiveRgb(
        causticColor,
        this.sphereLightColor(),
        this.sphereLightAt(x, y, depth - this.sphereBobY()),
      );
    }

    vegetationPixelAt(x, y) {
      if (this.vegetation === "none") return null;
      const pixelX = Math.floor(x);
      const pixelY = Math.floor(y);
      const cellSize = this.vegetation === "grass" ? 4 : 6;
      const cellX = Math.floor(pixelX / cellSize);
      const cellY = Math.floor(pixelY / cellSize);
      const seed = hash2d(cellX * 13 + 17, cellY * 19 - 5);
      const threshold = this.vegetation === "clovers" ? 0.44 : 0.34;
      if (seed < threshold) return null;
      const anchorX = cellX * cellSize + 1 + Math.floor(
        hash2d(cellX + 31, cellY - 11) * Math.max(1, cellSize - 2),
      );
      const anchorY = cellY * cellSize + cellSize - 1;
      const deltaX = pixelX - anchorX;
      const deltaY = pixelY - anchorY;
      if (this.vegetation === "clovers") {
        if (deltaX === 0 && deltaY === 0) return 1;
        return Math.abs(deltaX) + Math.abs(deltaY) === 1 ? 2 : null;
      }
      const strandLength = this.vegetation === "tall-grass" ? 5 : 3;
      const lean = hash2d(cellX - 23, cellY + 47) > 0.5 ? 1 : -1;
      for (let step = 0; step < strandLength; step += 1) {
        const strandX = anchorX + Math.round(lean * step * 0.42);
        const strandY = anchorY - step;
        if (pixelX === strandX && pixelY === strandY) {
          return step >= strandLength - 2 ? 2 : step > 0 ? 1 : 0;
        }
      }
      return null;
    }

    vegetationColorAt(x, y, tone = 1, depth = this.view.depth) {
      const palette = vegetationPalettes[this.vegetation] || vegetationPalettes.grass;
      const base = palette[clamp(Math.round(tone), 0, palette.length - 1)];
      const diffuse = clamp(dot3(this.bottomNormalAt(x, y), this.lightDirection()), 0, 1);
      const lighting = clamp(0.28 + this.lightIntensity * (0.38 + diffuse * 0.42), 0.18, 1.5);
      const shaded = scaleRgb(base, lighting);
      const opticalDepth = this.liquidAbsorption * clamp(depth, 0, 100) / 18;
      const absorbed = (1 - Math.exp(-opticalDepth * 0.9)) * 0.66;
      const underwater = mixRgb(shaded, this.liquidTint, absorbed);
      const filteredLight = mixRgb(
        this.lightColor(),
        this.liquidTint,
        clamp(absorbed * 0.28, 0, 0.3),
      );
      const causticColor = addEmissiveRgb(
        underwater,
        filteredLight,
        this.causticAt(x, y, depth) * 0.88 * clamp(this.lightIntensity, 0, 2),
      );
      return addEmissiveRgb(
        causticColor,
        this.sphereLightColor(),
        this.sphereLightAt(x, y, depth - this.sphereBobY()),
      );
    }

    drawVegetation25d(transform) {
      if (this.vegetation === "none") return;
      const settings = this.vegetation === "clovers"
        ? { spacing: 6, threshold: 0.42, height: 1.9, blades: 1 }
        : this.vegetation === "tall-grass"
          ? { spacing: 7, threshold: 0.34, height: 6.2, blades: 3 }
          : { spacing: 5, threshold: 0.3, height: 3.1, blades: 2 };
      const yaw = this.view.yaw * Math.PI / 180;
      const right = [Math.cos(yaw), 0, Math.sin(yaw)];
      const forward = [-Math.sin(yaw), 0, Math.cos(yaw)];
      const polygons = [];
      const pushPolygon = (worldPoints, color) => {
        const points = worldPoints.map((point) => this.project(point, transform));
        polygons.push({
          points,
          color,
          depth: points.reduce((sum, point) => sum + point.depth, 0) / points.length,
        });
      };

      for (let gridY = 1; gridY < height - 1; gridY += settings.spacing) {
        for (let gridX = 1; gridX < width - 1; gridX += settings.spacing) {
          const cellX = Math.floor(gridX / settings.spacing);
          const cellY = Math.floor(gridY / settings.spacing);
          const seed = hash2d(cellX * 17 + 3, cellY * 23 - 9);
          if (seed < settings.threshold) continue;
          const anchorX = clamp(
            gridX + hash2d(cellX + 41, cellY - 13) * (settings.spacing - 2),
            1,
            width - 2,
          );
          const anchorZ = clamp(
            gridY + hash2d(cellX - 29, cellY + 37) * (settings.spacing - 2),
            1,
            height - 2,
          );
          const worldX = anchorX - width / 2;
          const worldZ = anchorZ - height / 2;
          const bottomY = this.view.depth - this.rockHeightAt(anchorX, anchorZ);

          if (this.vegetation === "clovers") {
            const stemColor = this.vegetationColorAt(anchorX, anchorZ, 0);
            const leafColor = this.vegetationColorAt(anchorX, anchorZ, 2);
            const halfWidth = 0.16;
            pushPolygon([
              [worldX - right[0] * halfWidth, bottomY, worldZ - right[2] * halfWidth],
              [worldX + right[0] * halfWidth, bottomY, worldZ + right[2] * halfWidth],
              [worldX + right[0] * halfWidth, bottomY - settings.height, worldZ + right[2] * halfWidth],
              [worldX - right[0] * halfWidth, bottomY - settings.height, worldZ - right[2] * halfWidth],
            ], stemColor);
            const topY = bottomY - settings.height;
            const leafOffset = 0.42;
            const leafRadius = 0.38;
            [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([side, front]) => {
              const centerX = worldX + right[0] * side * leafOffset + forward[0] * front * leafOffset;
              const centerZ = worldZ + right[2] * side * leafOffset + forward[2] * front * leafOffset;
              pushPolygon([
                [centerX + right[0] * leafRadius, topY, centerZ + right[2] * leafRadius],
                [centerX + forward[0] * leafRadius, topY, centerZ + forward[2] * leafRadius],
                [centerX - right[0] * leafRadius, topY, centerZ - right[2] * leafRadius],
                [centerX - forward[0] * leafRadius, topY, centerZ - forward[2] * leafRadius],
              ], leafColor);
            });
            continue;
          }

          for (let blade = 0; blade < settings.blades; blade += 1) {
            const bladeSeed = hash2d(cellX * 31 + blade * 7, cellY * 29 - blade * 11);
            const rootOffset = (blade - (settings.blades - 1) / 2) * 0.38;
            const rootX = worldX + right[0] * rootOffset;
            const rootZ = worldZ + right[2] * rootOffset;
            const bladeHeight = settings.height * (0.72 + bladeSeed * 0.42);
            const leanAngle = bladeSeed * Math.PI * 2;
            const leanAmount = this.vegetation === "tall-grass" ? 1.45 : 0.72;
            const tipX = rootX + Math.cos(leanAngle) * leanAmount;
            const tipZ = rootZ + Math.sin(leanAngle) * leanAmount;
            const halfWidth = this.vegetation === "tall-grass" ? 0.26 : 0.19;
            const bladeColor = this.vegetationColorAt(
              anchorX,
              anchorZ,
              blade === settings.blades - 1 ? 2 : blade,
            );
            pushPolygon([
              [rootX - right[0] * halfWidth, bottomY, rootZ - right[2] * halfWidth],
              [rootX + right[0] * halfWidth, bottomY, rootZ + right[2] * halfWidth],
              [tipX + right[0] * halfWidth * 0.12, bottomY - bladeHeight, tipZ + right[2] * halfWidth * 0.12],
              [tipX - right[0] * halfWidth * 0.12, bottomY - bladeHeight, tipZ - right[2] * halfWidth * 0.12],
            ], bladeColor);
          }
        }
      }

      polygons.sort((left, rightPolygon) => left.depth - rightPolygon.depth);
      polygons.forEach((polygon) => this.fillPolygon(polygon.points, polygon.color, 1));
    }

    waterAppearance(info, viewNormal = info.normal, fieldX = width / 2, fieldY = height / 2) {
      const lightDirection = this.lightDirection();
      const illumination = clamp(dot3(info.normal, lightDirection), 0, 1);
      const brightness = clamp(this.lightIntensity, 0, 2);
      const normalFacing = clamp(Math.abs(viewNormal[2]), 0, 1);
      const f0 = Math.pow(
        (this.liquidRefraction - 1) / (this.liquidRefraction + 1),
        2,
      );
      const fresnel = f0 + (1 - f0) * Math.pow(1 - normalFacing, 5);
      const specular = Math.pow(clamp(illumination * (0.46 + normalFacing * 0.54), 0, 1), 18) * brightness;
      if (this.reflectiveSurface) {
        const metalTint = hslToRgb(this.liquidHue, 0.28, 0.42);
        const skyReflection = mixRgb([52, 68, 88], this.lightColor(), 0.38);
        const skyAmount = clamp(
          0.52 - viewNormal[1] * 0.38 + illumination * 0.18,
          0,
          1,
        );
        const environment = mixRgb([17, 19, 22], skyReflection, skyAmount);
        const reflectionWeight = clamp(
          0.66 + fresnel * 0.3 + Math.abs(viewNormal[0]) * 0.08,
          0,
          1,
        );
        const reflectedMetal = mixRgb(metalTint, environment, reflectionWeight);
        const metalHighlight = Math.pow(
          clamp(illumination * (0.28 + normalFacing * 0.72), 0, 1),
          34,
        ) * brightness;
        const litMetal = addEmissiveRgb(reflectedMetal, this.lightColor(), metalHighlight * 1.35);
        return {
          color: addEmissiveRgb(
            litMetal,
            this.sphereLightColor(),
            this.sphereLightAt(fieldX, fieldY, Math.abs(this.sphereBobY())),
          ),
          alpha: 1,
        };
      }
      const crest = clamp(info.center / 4.5, 0, 1);
      const paletteIndex = clamp(
        Math.round(1 + brightness * (1.4 + illumination * 2.5 + crest * 1.6 + specular * 1.5)),
        0,
        this.paletteRgb.length - 1,
      );
      const liquidBase = mixRgb(
        this.paletteRgb[paletteIndex],
        this.liquidTint,
        0.08 + this.liquidAbsorption * 0.18,
      );
      const highlightTint = mixRgb(
        this.lightColor(),
        hslToRgb(this.liquidHue + this.liquidDispersion * 72, 0.72, 0.72),
        this.liquidDispersion * 0.3,
      );
      const reflection = mixRgb(liquidBase, highlightTint, specular * 0.72);
      return {
        color: addEmissiveRgb(
          reflection,
          this.sphereLightColor(),
          this.sphereLightAt(fieldX, fieldY, Math.abs(this.sphereBobY())),
        ),
        alpha: this.surfaceOpacity,
      };
    }

    rotatePoint([x, y, z]) {
      const yaw = this.view.yaw * Math.PI / 180;
      const pitch = this.view.pitch * Math.PI / 180;
      const rotatedX = x * Math.cos(yaw) + z * Math.sin(yaw);
      const rotatedZ = -x * Math.sin(yaw) + z * Math.cos(yaw);
      return [
        rotatedX,
        y * Math.cos(pitch) - rotatedZ * Math.sin(pitch),
        y * Math.sin(pitch) + rotatedZ * Math.cos(pitch),
      ];
    }

    createViewTransform() {
      const waterLift = 3;
      const depth = this.view.depth;
      const corners = [
        [-width / 2, -waterLift, -height / 2],
        [width / 2, -waterLift, -height / 2],
        [width / 2, -waterLift, height / 2],
        [-width / 2, -waterLift, height / 2],
        [-width / 2, depth + 2, -height / 2],
        [width / 2, depth + 2, -height / 2],
        [width / 2, depth + 2, height / 2],
        [-width / 2, depth + 2, height / 2],
      ].map((point) => this.rotatePoint(point));
      const minX = Math.min(...corners.map((point) => point[0]));
      const maxX = Math.max(...corners.map((point) => point[0]));
      const minY = Math.min(...corners.map((point) => point[1]));
      const maxY = Math.max(...corners.map((point) => point[1]));
      const padding = 7;
      const scale = Math.min(
        (cameraSize - padding * 2) / (maxX - minX || 1),
        (cameraSize - padding * 2) / (maxY - minY || 1),
      );
      return {
        scale,
        offsetX: (cameraSize - (maxX - minX) * scale) / 2 - minX * scale,
        offsetY: (cameraSize - (maxY - minY) * scale) / 2 - minY * scale,
      };
    }

    project(point, transform) {
      const rotated = this.rotatePoint(point);
      return {
        x: rotated[0] * transform.scale + transform.offsetX,
        y: rotated[1] * transform.scale + transform.offsetY,
        depth: rotated[2],
      };
    }

    fillPolygon(points, color, alpha = 1) {
      this.context.beginPath();
      this.context.moveTo(points[0].x, points[0].y);
      for (let index = 1; index < points.length; index += 1) {
        this.context.lineTo(points[index].x, points[index].y);
      }
      this.context.closePath();
      this.context.fillStyle = cssColor(color, alpha);
      this.context.fill();
    }

    drawGlassSphere25d(transform) {
      if (!this.sphereEnabled) return;
      const center = this.project([0, this.sphereBobY(), 0], transform);
      const radius = Math.max(3, transform.scale * 6);
      const tint = hslToRgb(this.sphereHue, 0.58, 0.67);
      const darkTint = hslToRgb(this.sphereHue, 0.3, 0.25);
      const snapshot = document.createElement("canvas");
      snapshot.width = this.canvas.width;
      snapshot.height = this.canvas.height;
      snapshot.getContext("2d").drawImage(this.canvas, 0, 0);

      this.context.save();
      if (this.sphereEmissive > 0) {
        this.context.globalCompositeOperation = "lighter";
        const glow = this.context.createRadialGradient(
          center.x, center.y, radius * 0.35,
          center.x, center.y, radius * (1.5 + this.sphereEmissive * 1.8),
        );
        glow.addColorStop(0, cssColor(this.sphereLightColor(), 0.34 * this.sphereEmissive));
        glow.addColorStop(1, cssColor(this.sphereLightColor(), 0));
        this.context.fillStyle = glow;
        this.context.beginPath();
        this.context.arc(center.x, center.y, radius * 3.3, 0, Math.PI * 2);
        this.context.fill();
        this.context.globalCompositeOperation = "source-over";
      }

      this.context.beginPath();
      this.context.arc(center.x, center.y, radius, 0, Math.PI * 2);
      this.context.clip();
      if (this.sphereMirror) {
        this.context.fillStyle = cssColor(darkTint, 1);
        this.context.fillRect(center.x - radius, center.y - radius, radius * 2, radius * 2);
        this.context.globalAlpha = 0.82;
        this.context.translate(0, center.y * 2);
        this.context.scale(1, -1);
        this.context.drawImage(snapshot, 0, 0);
        this.context.setTransform(1, 0, 0, 1, 0, 0);
      } else {
        const lensShift = (this.sphereRefraction - 1) * radius *
          (this.sphereHiFi ? 0.19 : 0.11);
        this.context.globalAlpha = 0.76 - this.sphereRoughness * 0.26;
        this.context.drawImage(snapshot, lensShift, lensShift * 0.35);
      }
      this.context.globalAlpha = 1;
      const body = this.context.createRadialGradient(
        center.x - radius * 0.34,
        center.y - radius * 0.38,
        radius * 0.08,
        center.x,
        center.y,
        radius,
      );
      const bodyAlpha = this.sphereMirror
        ? 0.38
        : 0.08 + this.sphereAbsorption * 0.2 + this.sphereRoughness * 0.16;
      body.addColorStop(0, "rgb(255 255 255 / 0.72)");
      body.addColorStop(0.28, cssColor(tint, bodyAlpha));
      body.addColorStop(0.78, cssColor(darkTint, bodyAlpha + 0.12));
      body.addColorStop(1, cssColor(tint, 0.58));
      this.context.fillStyle = body;
      this.context.fillRect(center.x - radius, center.y - radius, radius * 2, radius * 2);
      if (this.sphereDispersion > 0) {
        this.context.strokeStyle = `hsla(${(this.sphereHue + 80) % 360}, 95%, 72%, ${0.42 * this.sphereDispersion})`;
        this.context.lineWidth = Math.max(1, radius * 0.08);
        this.context.beginPath();
        this.context.arc(center.x, center.y, radius * 0.9, -1.2, 0.35);
        this.context.stroke();
      }
      if (this.sphereEmissive > 0) {
        this.context.globalCompositeOperation = "lighter";
        this.context.fillStyle = cssColor(this.sphereLightColor(), 0.6 * this.sphereEmissive);
        this.context.fillRect(center.x - radius, center.y - radius, radius * 2, radius * 2);
      }
      this.context.restore();

      this.context.save();
      this.context.strokeStyle = "rgb(225 250 255 / 0.78)";
      this.context.lineWidth = Math.max(1, transform.scale * 0.35);
      this.context.beginPath();
      this.context.arc(center.x, center.y, radius, 0, Math.PI * 2);
      this.context.stroke();
      this.context.restore();
    }

    draw2d() {
      this.buildCausticMap();
      const panelGap = 1;
      const sceneWidth = width * 2 + panelGap;
      if (this.canvas.width !== sceneWidth || this.canvas.height !== height) {
        this.canvas.width = sceneWidth;
        this.canvas.height = height;
      }
      this.surfaceHits = [];
      const surfaceIndices = quantize(
        this.current,
        this.rotation,
        this.lightAngle,
        this.lightIntensity,
      );
      const frame = this.context.createImageData(sceneWidth, height);
      for (let y = 0; y < height; y += 1) {
        for (let x = 0; x < width; x += 1) {
          const surfaceInfo = this.surfaceInfo(x, y);
          let surface = this.reflectiveSurface
            ? this.waterAppearance(
                surfaceInfo,
                [surfaceInfo.normal[0], surfaceInfo.normal[2], surfaceInfo.normal[1]],
                x,
                y,
              ).color
            : this.paletteRgb[surfaceIndices[y * width + x]];
          if (!this.reflectiveSurface && this.sphereEnabled) {
            surface = addEmissiveRgb(
              surface,
              this.sphereLightColor(),
              this.sphereLightAt(x, y, Math.abs(this.sphereBobY())),
            );
          }
          const vegetationTone = this.vegetationPixelAt(x, y);
          const bottom = vegetationTone === null
            ? this.bottomColorAt(x, y)
            : this.vegetationColorAt(x, y, vegetationTone);
          const surfaceIndex = (y * sceneWidth + x) * 4;
          const bottomIndex = (y * sceneWidth + width + panelGap + x) * 4;
          frame.data[surfaceIndex] = surface[0];
          frame.data[surfaceIndex + 1] = surface[1];
          frame.data[surfaceIndex + 2] = surface[2];
          frame.data[surfaceIndex + 3] = 255;
          frame.data[bottomIndex] = bottom[0];
          frame.data[bottomIndex + 1] = bottom[1];
          frame.data[bottomIndex + 2] = bottom[2];
          frame.data[bottomIndex + 3] = 255;
        }
        const dividerIndex = (y * sceneWidth + width) * 4;
        frame.data[dividerIndex] = 3;
        frame.data[dividerIndex + 1] = 16;
        frame.data[dividerIndex + 2] = 25;
        frame.data[dividerIndex + 3] = 255;
      }
      this.context.putImageData(frame, 0, 0);
    }

    draw25d() {
      this.buildCausticMap();
      if (this.canvas.width !== cameraSize || this.canvas.height !== cameraSize) {
        this.canvas.width = cameraSize;
        this.canvas.height = cameraSize;
      } else {
        this.context.clearRect(0, 0, cameraSize, cameraSize);
      }
      this.context.imageSmoothingEnabled = false;
      const transform = this.createViewTransform();
      const meshDivisions = this.causticDetail === "fine" ? 32 : this.causticDetail === "balanced" ? 24 : 16;
      const cellSize = Math.max(2, Math.ceil(Math.max(width, height) / meshDivisions));
      const bottomPolygons = [];
      const waterPolygons = [];

      for (let y = 0; y < height; y += cellSize) {
        for (let x = 0; x < width; x += cellSize) {
          const x1 = Math.min(width, x + cellSize);
          const y1 = Math.min(height, y + cellSize);
          const worldX0 = x - width / 2;
          const worldX1 = x1 - width / 2;
          const worldZ0 = y - height / 2;
          const worldZ1 = y1 - height / 2;
          const centerX = (x + x1) / 2;
          const centerY = (y + y1) / 2;

          const bottomPoints = [
            [worldX0, this.view.depth - this.rockHeightAt(x, y), worldZ0],
            [worldX1, this.view.depth - this.rockHeightAt(x1, y), worldZ0],
            [worldX1, this.view.depth - this.rockHeightAt(x1, y1), worldZ1],
            [worldX0, this.view.depth - this.rockHeightAt(x, y1), worldZ1],
          ].map((point) => this.project(point, transform));
          bottomPolygons.push({
            points: bottomPoints,
            color: this.bottomColorAt(centerX, centerY),
            depth: bottomPoints.reduce((sum, point) => sum + point.depth, 0) / 4,
          });

          const cornerInfo = [
            this.surfaceInfo(x, y),
            this.surfaceInfo(x1, y),
            this.surfaceInfo(x1, y1),
            this.surfaceInfo(x, y1),
          ];
          const waterPoints = [
            [worldX0, -cornerInfo[0].heightValue, worldZ0],
            [worldX1, -cornerInfo[1].heightValue, worldZ0],
            [worldX1, -cornerInfo[2].heightValue, worldZ1],
            [worldX0, -cornerInfo[3].heightValue, worldZ1],
          ].map((point) => this.project(point, transform));
          const centerInfo = this.surfaceInfo(centerX, centerY);
          const screenNormal = this.rotatePoint([
            centerInfo.normal[0],
            -centerInfo.normal[1],
            centerInfo.normal[2],
          ]);
          const water = this.waterAppearance(centerInfo, screenNormal, centerX, centerY);
          waterPolygons.push({
            points: waterPoints,
            color: water.color,
            alpha: water.alpha,
            depth: waterPoints.reduce((sum, point) => sum + point.depth, 0) / 4,
            fieldX: centerX,
            fieldY: centerY,
          });
        }
      }

      waterPolygons.sort((left, right) => left.depth - right.depth);
      this.surfaceHits = waterPolygons;
      bottomPolygons.sort((left, right) => left.depth - right.depth);
      const drawBottom = () => bottomPolygons.forEach((polygon) =>
        this.fillPolygon(polygon.points, polygon.color, 1)
      );
      const drawWater = () => waterPolygons.forEach((polygon) =>
        this.fillPolygon(polygon.points, polygon.color, polygon.alpha)
      );

      if (this.view.pitch > 0) {
        // Below the terrain, the opaque bottom is closest to the camera. Draw
        // the water and planted layers first, then let the bottom occlude them.
        this.drawGlassSphere25d(transform);
        drawWater();
        this.drawVegetation25d(transform);
        drawBottom();
      } else {
        drawBottom();
        this.drawVegetation25d(transform);
        drawWater();
        this.drawGlassSphere25d(transform);
      }
    }

    draw() {
      if (!this.context) return;
      if (this.view.mode === "2.5d") {
        this.draw25d();
      } else {
        this.draw2d();
      }
    }

    setSize(nextWidth, nextHeight) {
      const requestedWidth = Math.round(Number(nextWidth));
      const requestedHeight = Math.round(Number(nextHeight));
      const preset = waterSizePresets.find(
        ([presetWidth, presetHeight]) =>
          presetWidth === requestedWidth && presetHeight === requestedHeight,
      ) || waterSizePresets[0];
      if (preset[0] === width && preset[1] === height) return false;
      width = preset[0];
      height = preset[1];
      bottomSurfaces = createBottomSurfaces();
      this.current = new Float32Array(width * height);
      this.previous = new Float32Array(width * height);
      this.surfaceHits = [];
      this.causticMap = null;
      this.previousCausticMap = null;
      this.accumulator = 0;
      this.rainAccumulator = 0;
      this.reset();
      return true;
    }

    setDamp(value) {
      this.damp = clamp(Number(value) || 10, 10, 50);
    }

    setGravity(value) {
      this.gravity = clamp(Number(value) || 1, 1 / 6, 6);
    }

    setBottomSurface(value) {
      if (!Object.hasOwn(bottomSurfaces, value)) return;
      if (this.bottomSurface === value) return;
      this.bottomSurface = value;
      this.draw();
    }

    setVegetation(value) {
      const vegetation = value === "none" || Object.hasOwn(vegetationPalettes, value)
        ? value
        : "grass";
      if (this.vegetation === vegetation) return;
      this.vegetation = vegetation;
      this.draw();
    }

    setLightAngle(value) {
      const angle = clamp(Number(value) || 0, -180, 180);
      if (angle === this.lightAngle) return;
      this.lightAngle = angle;
      this.previousCausticMap = null;
      this.draw();
    }

    setLightSource(value) {
      const source = Object.hasOwn(lightSourceColors, value) ? value : "daylight";
      if (source === this.lightSource) return;
      this.lightSource = source;
      this.draw();
    }

    setLightIntensity(value) {
      const intensity = clamp(Number(value) || 0, 0, 2);
      if (intensity === this.lightIntensity) return;
      this.lightIntensity = intensity;
      this.draw();
    }

    setCausticDetail(value) {
      const detail = ["fast", "balanced", "fine"].includes(value) ? value : "fast";
      if (detail === this.causticDetail) return;
      this.causticDetail = detail;
      this.causticMap = null;
      this.previousCausticMap = null;
      this.draw();
    }

    setLiquidRefraction(value) {
      const refraction = clamp(
        Number(value) || defaultLiquidRefraction,
        1,
        1.6,
      );
      if (refraction === this.liquidRefraction) return;
      this.liquidRefraction = refraction;
      this.previousCausticMap = null;
      this.draw();
    }

    setLiquidHue(value) {
      const hue = clamp(Number(value) || 0, 0, 360);
      if (hue === this.liquidHue) return;
      this.liquidHue = hue;
      this.liquidTint = hslToRgb(hue, 0.68, 0.32);
      this.draw();
    }

    setLiquidDispersion(value) {
      const dispersion = clamp(Number(value) || 0, 0, 1);
      if (dispersion === this.liquidDispersion) return;
      this.liquidDispersion = dispersion;
      this.draw();
    }

    setLiquidAbsorption(value) {
      const absorption = clamp(Number(value) || 0, 0, 1);
      if (absorption === this.liquidAbsorption) return;
      this.liquidAbsorption = absorption;
      this.draw();
    }

    setSurfaceOpacity(value) {
      const numeric = Number(value);
      const opacity = clamp(
        Number.isFinite(numeric) ? numeric : defaultSurfaceOpacity,
        0,
        1,
      );
      if (opacity === this.surfaceOpacity) return;
      this.surfaceOpacity = opacity;
      this.draw();
    }

    setReflectiveSurface(enabled) {
      const reflective = Boolean(enabled);
      if (reflective === this.reflectiveSurface) return;
      this.reflectiveSurface = reflective;
      this.draw();
    }

    setRotation(value) {
      const rotation = clamp(Number(value) || 0, -180, 180);
      if (rotation === this.rotation) return;
      this.rotation = rotation;
      this.previousCausticMap = null;
      this.draw();
    }

    setRain(enabled) {
      this.rain = Boolean(enabled);
    }

    currentXpm() {
      const indices = quantize(
        this.current,
        this.rotation,
        this.lightAngle,
        this.lightIntensity,
      );
      const rows = Array.from({ length: height }, (_, y) =>
        Array.from({ length: width }, (_, x) => symbols[indices[y * width + x]]).join("")
      );
      return xpmDocument(rows, width, height, {
        damp: this.damp,
        gravity: this.gravity,
        bottomSurface: this.bottomSurface,
        vegetation: this.vegetation,
        lightAngle: this.lightAngle,
        lightSource: this.lightSource,
        lightIntensity: this.lightIntensity,
        causticDetail: this.causticDetail,
        liquidRefraction: this.liquidRefraction,
        liquidHue: this.liquidHue,
        liquidDispersion: this.liquidDispersion,
        liquidAbsorption: this.liquidAbsorption,
        surfaceOpacity: this.surfaceOpacity,
        reflectiveSurface: this.reflectiveSurface,
        sphereEnabled: this.sphereEnabled,
        sphereRefraction: this.sphereRefraction,
        sphereHue: this.sphereHue,
        sphereRoughness: this.sphereRoughness,
        sphereDispersion: this.sphereDispersion,
        sphereAbsorption: this.sphereAbsorption,
        sphereMirror: this.sphereMirror,
        sphereHiFi: this.sphereHiFi,
        sphereAmplitude: this.sphereAmplitude,
        sphereFrequency: this.sphereFrequency,
        sphereEmissive: this.sphereEmissive,
        rotation: this.rotation,
        rain: this.rain,
        palette: this.palette,
        atlas: false,
      });
    }

    animationAtlasXpm() {
      let current = new Float32Array(this.current);
      let previous = new Float32Array(this.previous);
      const atlasWidth = width * 4;
      const atlasHeight = height * 4;
      const rows = Array.from({ length: atlasHeight }, () =>
        Array(atlasWidth).fill(symbols[0])
      );
      for (let frameIndex = 0; frameIndex < 16; frameIndex += 1) {
        for (let step = 0; step < 3; step += 1) {
          [current, previous] = advance(current, previous, this.damp, this.gravity);
        }
        const indices = quantize(
          current,
          this.rotation,
          this.lightAngle,
          this.lightIntensity,
        );
        const tileX = frameIndex % 4 * width;
        const tileY = Math.floor(frameIndex / 4) * height;
        for (let y = 0; y < height; y += 1) {
          for (let x = 0; x < width; x += 1) {
            rows[tileY + y][tileX + x] = symbols[indices[y * width + x]];
          }
        }
      }
      return xpmDocument(rows.map((row) => row.join("")), atlasWidth, atlasHeight, {
        damp: this.damp,
        gravity: this.gravity,
        bottomSurface: this.bottomSurface,
        vegetation: this.vegetation,
        lightAngle: this.lightAngle,
        lightSource: this.lightSource,
        lightIntensity: this.lightIntensity,
        causticDetail: this.causticDetail,
        liquidRefraction: this.liquidRefraction,
        liquidHue: this.liquidHue,
        liquidDispersion: this.liquidDispersion,
        liquidAbsorption: this.liquidAbsorption,
        surfaceOpacity: this.surfaceOpacity,
        reflectiveSurface: this.reflectiveSurface,
        sphereEnabled: this.sphereEnabled,
        sphereRefraction: this.sphereRefraction,
        sphereHue: this.sphereHue,
        sphereRoughness: this.sphereRoughness,
        sphereDispersion: this.sphereDispersion,
        sphereAbsorption: this.sphereAbsorption,
        sphereMirror: this.sphereMirror,
        sphereHiFi: this.sphereHiFi,
        sphereAmplitude: this.sphereAmplitude,
        sphereFrequency: this.sphereFrequency,
        sphereEmissive: this.sphereEmissive,
        rotation: this.rotation,
        rain: this.rain,
        palette: this.palette,
        atlas: true,
      });
    }
  }

  function makeInitialXpm({ glassSphere = false } = {}) {
    const scene = new WaterScene(null);
    scene.sphereEnabled = glassSphere;
    return scene.currentXpm();
  }

  global.XpmWaterScene = Object.freeze({
    create: (canvas) => new WaterScene(canvas),
    makeInitialXpm,
  });
})(window);

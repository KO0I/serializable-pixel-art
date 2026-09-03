const manualExample = `! XPM2
! Source: XPM Manual, Chapter 2, "plaid pixmap" example
! https://xorg.freedesktop.org/docs/XPM/xpm.pdf
! width height colors chars-per-pixel
22 22 4 2
! colors
   c red     m white s light_color
Y  c green   m black s lines_in_mix
+  c yellow  m white s lines_in_dark
x            m black s dark_color
! pixels
x   x   x x x   x   x x x x x x + x x x x x 
  x   x   x   x   x   x x x x x x x x x x x 
x   x   x x x   x   x x x x x x + x x x x x 
  x   x   x   x   x   x x x x x x x x x x x 
x   x   x x x   x   x x x x x x + x x x x x 
Y Y Y Y Y x Y Y Y Y Y + x + x + x + x + x + 
x   x   x x x   x   x x x x x x + x x x x x 
  x   x   x   x   x   x x x x x x x x x x x 
x   x   x x x   x   x x x x x x + x x x x x 
  x   x   x   x   x   x x x x x x x x x x x 
x   x   x x x   x   x x x x x x + x x x x x 
          x           x   x   x Y x   x   x 
          x             x   x   Y   x   x   
          x           x   x   x Y x   x   x 
          x             x   x   Y   x   x   
          x           x   x   x Y x   x   x 
x x x x x x x x x x x x x x x x x x x x x x 
          x           x   x   x Y x   x   x 
          x             x   x   Y   x   x   
          x           x   x   x Y x   x   x 
          x             x   x   Y   x   x   
          x           x   x   x Y x   x   x `;

const demos = [
  {
    category: "XPM basics",
    name: "Manual plaid",
    feature: "2-character keys",
    source: manualExample,
  },
  {
    category: "XPM basics",
    name: "Checker",
    feature: "1-character keys",
    source: `! XPM2
! one character per pixel
8 8 2 1
! colors
. c #f0efe8
# c #22221e
! pixels
.#.#.#.#
#.#.#.#.
.#.#.#.#
#.#.#.#.
.#.#.#.#
#.#.#.#.
.#.#.#.#
#.#.#.#.`,
  },
  {
    category: "XPM basics",
    name: "Transparent",
    feature: "None color",
    source: `! XPM2
! transparent background
12 12 4 1
! colors
  c None
. c #ffd84d
X c #171714
+ c #f28c28
! pixels
    ....    
  ........  
 ..XXXXXX.. 
 .X......X. 
.X..X..X..X.
.X........X.
.X..+..+..X.
.X...++...X.
 .X......X. 
 ..XXXXXX.. 
  ........  
    ....    `,
  },
  {
    category: "XPM basics",
    name: "Palette",
    feature: "8 hex colors",
    source: `! XPM2
! a larger color table
12 8 8 1
! colors
a c #ff595e
b c #ff924c
c c #ffca3a
d c #8ac926
e c #1982c4
f c #6a4c93
g c #f15bb5
h c #00bbf9
! pixels
aaaabbbbcccc
aaaabbbbcccc
ddddeeeeffff
ddddeeeeffff
gggghhhhaaaa
gggghhhhaaaa
bbbbccccdddd
eeeeffffgggg`,
  },
  {
    category: "XPM basics",
    name: "Monochrome",
    feature: "m color fallback",
    source: `! XPM2
! monochrome values without c values
10 10 2 1
! colors
. m white
X m black
! pixels
XXXXXXXXXX
X........X
X.XXXXXX.X
X.X....X.X
X.X.XX.X.X
X.X.XX.X.X
X.X....X.X
X.XXXXXX.X
X........X
XXXXXXXXXX`,
  },
  {
    category: "XPM basics",
    name: "Flower",
    feature: "named colors",
    source: `! XPM2
! CSS-compatible named X11 colors
9 9 5 1
! colors
  c None
. c gold
o c tomato
+ c seagreen
x c navy
! pixels
    +    
 +  +  + 
  + + +  
   +++   
 oo...oo 
oo..x..oo
 oo...oo 
   ooo   
    o    `,
  },
  {
    category: "2.5D primitives",
    id: "extruded-box",
    name: "Extruded box",
    feature: "2.5D starter",
    depth: 3,
    scale: 8,
    source: `! XPM2
! Filled plane for demonstrating 2.5D extrusion
12 12 2 1
! colors
  c None
X c #55ddd5
! pixels
\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20
\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20
\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20
\x20\x20\x20XXXXXX\x20\x20\x20
\x20\x20\x20XXXXXX\x20\x20\x20
\x20\x20\x20XXXXXX\x20\x20\x20
\x20\x20\x20XXXXXX\x20\x20\x20
\x20\x20\x20XXXXXX\x20\x20\x20
\x20\x20\x20XXXXXX\x20\x20\x20
\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20
\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20
\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20`,
  },
  {
    category: "2.5D primitives",
    id: "sphere",
    name: "Sphere",
    feature: "cached XPM slice stack",
    depth: 17,
    scale: 10,
    mode: "2.5d",
    source: XpmPrimitives.makeSphereXpm(17),
  },
  {
    category: "2.5D primitives",
    id: "sphere-checker-floor",
    name: "Glass sphere + checker floor",
    feature: "refractive slice stack",
    depth: 25,
    scale: 8,
    mode: "2.5d",
    source: XpmPrimitives.makeSphereOverCheckerboardXpm(),
  },
  {
    category: "2.5D primitives",
    id: "animated-glass-sphere",
    name: "Animated glass sphere",
    feature: "bobbing refractive stack",
    depth: 25,
    scale: 8,
    mode: "2.5d",
    source: XpmPrimitives.makeSphereOverCheckerboardXpm({ animated: true }),
  },
  {
    category: "Impostors",
    id: "impostor-sphere-2xpm",
    name: "Impostor (2 XPM) sphere",
    feature: "orthogonal slice stacks",
    depth: 17,
    scale: 10,
    mode: "2.5d",
    source: XpmPrimitives.makeImpostorSphereXpm(17),
  },
  {
    category: "Drone B",
    id: "drone-b-mood-sphere",
    name: "Mood sphere",
    feature: "mirror core · reactive glass shell",
    depth: 25,
    scale: 8,
    mode: "2.5d",
    source: XpmPrimitives.makeDroneBXpm(),
  },
  {
    category: "STL models",
    id: "scoundrel-stl",
    name: "Scoundrel STL",
    feature: "STL → XPM stack",
    stlUrl: "models/rfl_scoundrel_class.stl",
    stlResolution: 64,
    mode: "2.5d",
  },
];

const source = document.querySelector("#xpm-source");
const highlight = document.querySelector("#xpm-highlight code");
const highlightLayer = document.querySelector("#xpm-highlight");
const canvas = document.querySelector("#xpm-canvas");
const status = document.querySelector("#editor-status");
const meta = document.querySelector("#image-meta");
const resetButton = document.querySelector("#reset-button");
const importStlButton = document.querySelector("#import-stl-button");
const stlFileInput = document.querySelector("#stl-file-input");
const stlResolution = document.querySelector("#stl-resolution");
const autoSync = document.querySelector("#auto-sync");
const demoList = document.querySelector("#demo-list");
const scaleSlider = document.querySelector("#scale-slider");
const scaleValue = document.querySelector("#scale-value");
const exportSvgButton = document.querySelector("#export-svg");
const exportXpmButton = document.querySelector("#export-xpm");
const mode2dButton = document.querySelector("#mode-2d");
const mode25dButton = document.querySelector("#mode-25d");
const autoOrbitButton = document.querySelector("#auto-orbit");
const viewerModeGuide = document.querySelector("#viewer-mode-guide");
const viewerDepthControl = document.querySelector("#viewer-depth-control");
const viewerDepth = document.querySelector("#viewer-depth");
const viewerDepthValue = document.querySelector("#viewer-depth-value");
const viewerDepthLabel = document.querySelector("#viewer-depth-label");
const glassModeControls = document.querySelector("#glass-mode-controls");
const mirrorToggle = document.querySelector("#mirror-toggle");
const hiFiToggle = document.querySelector("#hifi-toggle");
const impostorLayerControls = document.querySelector("#impostor-layer-controls");
const impostorZToggle = document.querySelector("#impostor-z-toggle");
const impostorXToggle = document.querySelector("#impostor-x-toggle");
const droneMoodControl = document.querySelector("#drone-mood-control");
const droneMood = document.querySelector("#drone-mood");
const droneSurfaceControl = document.querySelector("#drone-surface-control");
const droneSurface = document.querySelector("#drone-surface");
const refractiveIndexControl = document.querySelector("#refractive-index-control");
const refractiveIndex = document.querySelector("#refractive-index");
const refractiveIndexValue = document.querySelector("#refractive-index-value");
const glassColorControl = document.querySelector("#glass-color-control");
const glassColor = document.querySelector("#glass-color");
const glassColorValue = document.querySelector("#glass-color-value");
const surfaceScatterControl = document.querySelector("#surface-scatter-control");
const surfaceScatter = document.querySelector("#surface-scatter");
const surfaceScatterValue = document.querySelector("#surface-scatter-value");
const dispersionControl = document.querySelector("#dispersion-control");
const dispersion = document.querySelector("#dispersion");
const dispersionValue = document.querySelector("#dispersion-value");
const absorptionControl = document.querySelector("#absorption-control");
const absorption = document.querySelector("#absorption");
const absorptionValue = document.querySelector("#absorption-value");
const animationAmplitudeControl = document.querySelector("#animation-amplitude-control");
const animationAmplitude = document.querySelector("#animation-amplitude");
const animationAmplitudeValue = document.querySelector("#animation-amplitude-value");
const animationFrequencyControl = document.querySelector("#animation-frequency-control");
const animationFrequency = document.querySelector("#animation-frequency");
const animationFrequencyValue = document.querySelector("#animation-frequency-value");
const viewerStage = document.querySelector("#viewer-stage");
const orbitHint = document.querySelector("#orbit-hint");
const introDialog = document.querySelector("#intro-dialog");
const openIntroButton = document.querySelector("#open-intro");
const closeIntroButton = document.querySelector("#close-intro");
const startExploringButton = document.querySelector("#start-exploring");
const tutorialDialog = document.querySelector("#tutorial-dialog");
const openTutorialButton = document.querySelector("#open-tutorial");
const closeTutorialButton = document.querySelector("#close-tutorial");
const context = canvas.getContext("2d");
const colorProbe = document.createElement("canvas").getContext("2d");
const viewerShadeCache = new Map();
let parsedXpmCache = null;
let activeDemo = 0;
let selectedDemo = 0;
let importedArtworkName = "xpm-artwork";
let activeStlJob = null;
let stlOperationVersion = 0;
let viewerMode = "2d";
let viewerYaw = 28;
let viewerPitch = -18;
let autoOrbitFrame = null;
let autoOrbitLastTime = 0;
let materialAnimationFrame = null;
const viewerModeUsedStorageKey = "xpm-editor-25d-mode-used-v1";
const introClosedStorageKey = "xpm-editor-intro-closed-v1";
let hasUsed25dMode =
  localStorage.getItem(viewerModeUsedStorageKey) === "true";

function updateCanvasScale() {
  const scale = Number(scaleSlider.value);
  canvas.style.width = `${canvas.width * scale}px`;
  canvas.style.height = `${canvas.height * scale}px`;
  scaleValue.value = `${scale}×`;
  scaleValue.textContent = `${scale}×`;
}

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
  if (color === null) {
    return null;
  }

  colorProbe.fillStyle = "#000000";
  colorProbe.fillStyle = color;
  const fromBlack = colorProbe.fillStyle;
  colorProbe.fillStyle = "#ffffff";
  colorProbe.fillStyle = color;

  if (fromBlack !== colorProbe.fillStyle) {
    return null;
  }

  colorProbe.clearRect(0, 0, 1, 1);
  colorProbe.fillStyle = fromBlack;
  colorProbe.fillRect(0, 0, 1, 1);
  const [red, green, blue, alpha] = colorProbe.getImageData(0, 0, 1, 1).data;
  const luminance = 0.2126 * red + 0.7152 * green + 0.0722 * blue;

  return {
    fill: fromBlack,
    ink: luminance > 150 ? "#171714" : "#ffffff",
    rgb: [red, green, blue],
    alpha,
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
        const [symbol, color] = parseColor(line, cpp);
        colorMap.set(symbol, color);
      } catch {
        // Keep incomplete color definitions editable while the parser reports details.
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

function extractStrings(input) {
  const lines = input.replace(/\r\n?/g, "\n").split("\n");
  const markerIndex = lines.findIndex((line) => line.trim() === "! XPM2");
  if (markerIndex !== -1) {
    return lines
      .slice(markerIndex + 1)
      .filter((line) => line.length > 0 && !line.startsWith("!"));
  }

  const strings = [];
  const quotedString = /"((?:\\.|[^"\\])*)"/g;
  let match;

  while ((match = quotedString.exec(input)) !== null) {
    strings.push(JSON.parse(`"${match[1]}"`));
  }

  return strings;
}

function parseColor(line, cpp) {
  const symbol = line.slice(0, cpp);
  const definition = line.slice(cpp);
  const fields = {};
  const colorKey = /(?:^|\s)(c|g4|g|m|s)\s+/g;
  const matches = [...definition.matchAll(colorKey)];

  matches.forEach((match, index) => {
    const valueStart = match.index + match[0].length;
    const valueEnd =
      index + 1 < matches.length ? matches[index + 1].index : definition.length;
    fields[match[1]] = definition.slice(valueStart, valueEnd).trim();
  });

  const color = fields.c || fields.g4 || fields.g || fields.m;
  if (!color) {
    throw new Error(`No display color found for symbol "${symbol}".`);
  }

  return [symbol, color.toLowerCase() === "none" ? null : color];
}

const generatedColors = [
  "#ff595e",
  "#ffca3a",
  "#8ac926",
  "#1982c4",
  "#6a4c93",
  "#f15bb5",
  "#00bbf9",
  "#ff924c",
];

function positionToLineColumn(input, position) {
  const beforePosition = input.slice(0, position);
  const lines = beforePosition.split("\n");
  return { line: lines.length - 1, column: lines.at(-1).length };
}

function lineColumnToPosition(lines, line, column) {
  const safeLine = Math.min(line, lines.length - 1);
  const precedingLength = lines
    .slice(0, safeLine)
    .reduce((total, value) => total + value.length + 1, 0);
  return precedingLength + Math.min(column, lines[safeLine].length);
}

function synchronizeXpm2Editor() {
  const input = source.value.replace(/\r\n?/g, "\n");
  if (input.length > 30000) return;
  const lines = input.split("\n");
  const markerIndex = lines.findIndex((line) => line.trim() === "! XPM2");
  const pixelsMarkerIndex = lines.findIndex(
    (line, index) => index > markerIndex && line.trim() === "! pixels",
  );

  if (markerIndex === -1 || pixelsMarkerIndex === -1) {
    return;
  }

  const headerIndex = lines.findIndex((line, index) => {
    if (index <= markerIndex || index >= pixelsMarkerIndex || line.startsWith("!")) {
      return false;
    }
    const values = line.trim().split(/\s+/).slice(0, 4).map(Number);
    return values.length === 4 && values.every(Number.isInteger);
  });

  if (headerIndex === -1) {
    return;
  }

  const header = lines[headerIndex].trim().split(/\s+/).map(Number);
  const cpp = header[3];
  if (!Number.isInteger(cpp) || cpp < 1) {
    return;
  }

  const selectionStart = positionToLineColumn(input, source.selectionStart);
  const selectionEnd = positionToLineColumn(input, source.selectionEnd);
  const colorLineIndices = [];
  const declaredSymbols = new Set();
  const parsedColors = new Map();

  for (let index = headerIndex + 1; index < pixelsMarkerIndex; index += 1) {
    const line = lines[index];
    if (line.length === 0 || line.startsWith("!")) {
      continue;
    }

    colorLineIndices.push(index);
    const symbol = line.slice(0, cpp);
    declaredSymbols.add(symbol);
    try {
      const [, color] = parseColor(line, cpp);
      parsedColors.set(symbol, color);
    } catch {
      // An in-progress definition still counts, but is not used for row padding.
    }
  }

  const pixelLineIndices = [];
  for (let index = pixelsMarkerIndex + 1; index < lines.length; index += 1) {
    if (!lines[index].startsWith("!")) {
      pixelLineIndices.push(index);
    }
  }

  if (pixelLineIndices.length === 0) {
    return;
  }

  const width = Math.max(
    1,
    ...pixelLineIndices.map((index) => Math.ceil(lines[index].length / cpp)),
  );
  const transparentSymbol = [...parsedColors].find(([, color]) => color === null)?.[0];
  const fillSymbol =
    transparentSymbol || parsedColors.keys().next().value || " ".repeat(cpp);

  pixelLineIndices.forEach((index) => {
    lines[index] = lines[index].padEnd(width * cpp, fillSymbol);
  });

  const unknownSymbols = [];
  pixelLineIndices.forEach((lineIndex) => {
    const row = lines[lineIndex];
    for (let offset = 0; offset < row.length; offset += cpp) {
      const symbol = row.slice(offset, offset + cpp);
      if (
        !symbol.startsWith("!") &&
        !declaredSymbols.has(symbol) &&
        !unknownSymbols.includes(symbol)
      ) {
        unknownSymbols.push(symbol);
      }
    }
  });

  const generatedDefinitions = unknownSymbols.map((symbol, index) => {
    const color = generatedColors[(colorLineIndices.length + index) % generatedColors.length];
    return `${symbol} c ${color}`;
  });

  lines[headerIndex] = `${width} ${pixelLineIndices.length} ${
    colorLineIndices.length + generatedDefinitions.length
  } ${cpp}`;
  lines.splice(pixelsMarkerIndex, 0, ...generatedDefinitions);

  const mapSelection = ({ line, column }) => {
    const shiftedLine =
      line >= pixelsMarkerIndex ? line + generatedDefinitions.length : line;
    return lineColumnToPosition(lines, shiftedLine, column);
  };

  const synchronized = lines.join("\n");
  if (synchronized !== source.value) {
    source.value = synchronized;
    source.setSelectionRange(mapSelection(selectionStart), mapSelection(selectionEnd));
  }
}

function parseXpm(input) {
  if (parsedXpmCache?.input === input) return parsedXpmCache.image;
  const strings = extractStrings(input);
  if (strings.length === 0) {
    throw new Error("Expected plain XPM2 data or a quoted XPM3 array.");
  }

  const header = strings[0].trim().split(/\s+/);
  const [width, height, colorCount, cpp] = header.slice(0, 4).map(Number);

  if (
    ![width, height, colorCount, cpp].every(Number.isInteger) ||
    width < 1 ||
    height < 1 ||
    colorCount < 1 ||
    cpp < 1
  ) {
    throw new Error("The header must define width, height, colors, and chars per pixel.");
  }

  if (strings.length < 1 + colorCount + height) {
    throw new Error("The XPM data has fewer color or pixel rows than its header declares.");
  }

  const colors = new Map(
    strings.slice(1, colorCount + 1).map((line) => parseColor(line, cpp)),
  );
  const pixels = strings.slice(colorCount + 1, colorCount + 1 + height);

  pixels.forEach((row, rowIndex) => {
    if (row.length < width * cpp) {
      throw new Error(`Pixel row ${rowIndex + 1} is shorter than ${width * cpp} characters.`);
    }
  });

  const directives = XpmPrimitives.parseDirectives(input);
  const { primitive } = directives;
  if (!["extrusion", "sphere", "slice-stack", "impostor-sphere-2xpm"].includes(primitive)) {
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
  if (primitive === "impostor-sphere-2xpm") {
    const { impostorWidth, impostorHeight, impostorGap = 0 } = directives;
    if (
      !Number.isInteger(impostorWidth) || impostorWidth < 1 ||
      !Number.isInteger(impostorHeight) || impostorHeight < 1 ||
      !Number.isInteger(impostorGap) || impostorGap < 0
    ) {
      throw new Error("The 2 XPM impostor requires valid impostor-size and impostor-gap directives.");
    }
    if (width < impostorWidth * 2 + impostorGap || height < impostorHeight) {
      throw new Error("The XPM atlas is too small for its two declared impostor views.");
    }
  }

  const image = { width, height, colorCount, cpp, colors, pixels, primitive, directives };
  parsedXpmCache = { input, image };
  return image;
}

function shadeViewerColor(color, amount) {
  const cacheKey = `${color}:${amount}`;
  if (viewerShadeCache.has(cacheKey)) {
    return viewerShadeCache.get(cacheKey);
  }
  const parsed = getPixelColors(color);
  if (!parsed) {
    return color;
  }
  const channels = parsed.rgb.map((channel) => Math.round(channel * amount));
  const shaded = parsed.alpha < 255
    ? `rgba(${channels.join(", ")}, ${(parsed.alpha / 255).toFixed(3)})`
    : `rgb(${channels.join(" ")})`;
  viewerShadeCache.set(cacheKey, shaded);
  return shaded;
}

function rotateViewerPoint([x, y, z]) {
  const yaw = (viewerYaw * Math.PI) / 180;
  const pitch = (viewerPitch * Math.PI) / 180;
  const rotatedX = x * Math.cos(yaw) + z * Math.sin(yaw);
  const rotatedZ = -x * Math.sin(yaw) + z * Math.cos(yaw);
  return [
    rotatedX,
    y * Math.cos(pitch) - rotatedZ * Math.sin(pitch),
    y * Math.sin(pitch) + rotatedZ * Math.cos(pitch),
  ];
}

let viewerSphereStackCache = null;

function buildViewerSphereSlices(image, {
  offsetX = 0,
  width = image.width,
  height = image.height,
  depthShading = true,
} = {}) {
  const grid = Array.from({ length: height }, (_, y) =>
    Array.from({ length: width }, (_, x) => {
      const row = image.pixels[y];
      const atlasX = offsetX + x;
      const symbol = row.slice(atlasX * image.cpp, (atlasX + 1) * image.cpp);
      return image.colors.get(symbol) ?? null;
    }),
  );
  const sliceCount = Math.min(
    96,
    Math.max(3, Math.ceil(Math.max(width, height) * 3)),
  );
  const slices = Array.from({ length: sliceCount }, (_, index) => {
    const normalizedZ = -1 + (2 * index + 1) / sliceCount;
    const radiusScale = Math.sqrt(Math.max(0, 1 - normalizedZ * normalizedZ));
    const texture = document.createElement("canvas");
    texture.width = width;
    texture.height = height;
    const textureContext = texture.getContext("2d");
    const shadeAmount = depthShading
      ? Math.round((0.62 + 0.38 * (normalizedZ + 1) / 2) * 16) / 16
      : 1;

    grid.forEach((row, y) => row.forEach((color, x) => {
      if (color === null) return;
      const nx = (x + 0.5 - width / 2) / (width / 2);
      const ny = (y + 0.5 - height / 2) / (height / 2);
      if (nx * nx + ny * ny > radiusScale * radiusScale) return;
      textureContext.fillStyle = shadeViewerColor(color, shadeAmount);
      textureContext.fillRect(x, y, 1, 1);
    }));

    const extentX = width / 2 * radiusScale;
    const extentY = height / 2 * radiusScale;
    return {
      normalizedZ,
      texture,
      bounds: {
        left: -extentX,
        right: extentX,
        top: -extentY,
        bottom: extentY,
      },
    };
  });

  return slices;
}

function getViewerSphereSlices(image) {
  const cacheKey = source.value;
  if (viewerSphereStackCache?.key === cacheKey) {
    return viewerSphereStackCache.slices;
  }
  const slices = buildViewerSphereSlices(image);

  viewerSphereStackCache = { key: cacheKey, slices };
  return slices;
}

let viewerImpostorSphereCache = null;

function getViewerImpostorSphereStacks(image) {
  const cacheKey = source.value;
  if (viewerImpostorSphereCache?.key === cacheKey) {
    return viewerImpostorSphereCache.stacks;
  }
  const width = image.directives.impostorWidth;
  const height = image.directives.impostorHeight;
  const gap = image.directives.impostorGap;
  const stacks = [
    buildViewerSphereSlices(image, {
      offsetX: 0,
      width,
      height,
      depthShading: false,
    }),
    buildViewerSphereSlices(image, {
      offsetX: width + gap,
      width,
      height,
      depthShading: false,
    }),
  ];
  viewerImpostorSphereCache = { key: cacheKey, stacks };
  return stacks;
}

let viewerVolumeStackCache = null;

function getViewerVolumeSlices(image) {
  const cacheKey = source.value;
  if (viewerVolumeStackCache?.key === cacheKey) {
    return viewerVolumeStackCache.slices;
  }
  const {
    sliceWidth,
    sliceHeight,
    sliceCount,
    sliceColumns,
  } = image.directives;
  const slices = [];
  const isAnimatedGlass = image.directives.material === "glass" &&
    image.directives.animation === "bob";
  const isDroneB = image.directives.material === "drone-b";
  const materialSymbols = new Set(["D", "S", "M", "L", "H", "i", "j", "k"]);

  for (let index = 0; index < sliceCount; index += 1) {
    const tileX = index % sliceColumns * sliceWidth;
    const tileY = Math.floor(index / sliceColumns) * sliceHeight;
    const normalizedZ = sliceCount === 1 ? 0 : -1 + (2 * index + 1) / sliceCount;
    const shadeAmount = Math.round((0.64 + 0.36 * (normalizedZ + 1) / 2) * 16) / 16;
    const createLayer = () => {
      const texture = document.createElement("canvas");
      texture.width = sliceWidth;
      texture.height = sliceHeight;
      return {
        texture,
        context: texture.getContext("2d"),
        minimumX: sliceWidth,
        minimumY: sliceHeight,
        maximumX: -1,
        maximumY: -1,
      };
    };
    const baseLayer = createLayer();
    const movingLayer = isAnimatedGlass || isDroneB ? createLayer() : null;
    const addLayer = (layer, animationRole = null) => {
      if (layer.maximumX < layer.minimumX || layer.maximumY < layer.minimumY) return;
      slices.push({
        normalizedZ,
        texture: layer.texture,
        animationRole,
        bounds: {
          left: layer.minimumX - sliceWidth / 2,
          right: layer.maximumX + 1 - sliceWidth / 2,
          top: layer.minimumY - sliceHeight / 2,
          bottom: layer.maximumY + 1 - sliceHeight / 2,
        },
      });
    };

    for (let y = 0; y < sliceHeight; y += 1) {
      const row = image.pixels[tileY + y];
      for (let x = 0; x < sliceWidth; x += 1) {
        const atlasX = tileX + x;
        const symbol = row.slice(atlasX * image.cpp, (atlasX + 1) * image.cpp);
        const color = image.colors.get(symbol) ?? null;
        if (color === null) continue;
        const layer = movingLayer && materialSymbols.has(symbol)
          ? movingLayer
          : baseLayer;
        layer.context.fillStyle = shadeViewerColor(color, shadeAmount);
        layer.context.fillRect(x, y, 1, 1);
        layer.minimumX = Math.min(layer.minimumX, x);
        layer.minimumY = Math.min(layer.minimumY, y);
        layer.maximumX = Math.max(layer.maximumX, x);
        layer.maximumY = Math.max(layer.maximumY, y);
      }
    }
    addLayer(baseLayer);
    if (movingLayer) addLayer(movingLayer, isDroneB ? "drone" : "bob");
  }
  if (!slices.length) throw new Error("The XPM slice stack contains no opaque voxels.");
  viewerVolumeStackCache = { key: cacheKey, slices };
  return slices;
}

function renderCachedSliceStack(
  width,
  height,
  cachedSlices,
  depth,
  {
    animationOffset = 0,
    animationAmplitude = 0,
    materialOffsetX = 0,
    materialOffsetY = 0,
    materialPadding = 0,
  } = {},
) {
  const slices = cachedSlices.map((slice) => {
    const z = slice.normalizedZ * depth / 2;
    const bobbing = slice.animationRole === "bob";
    const droneMoving = slice.animationRole === "drone";
    const xOffset = droneMoving ? materialOffsetX : 0;
    const yOffset = bobbing
      ? animationOffset
      : droneMoving
        ? materialOffsetY
        : 0;
    const boundPadding = bobbing
      ? animationAmplitude
      : droneMoving
        ? materialPadding
        : 0;
    const points = [
      [-width / 2 + xOffset, -height / 2 + yOffset, z],
      [width / 2 + xOffset, -height / 2 + yOffset, z],
      [width / 2 + xOffset, height / 2 + yOffset, z],
      [-width / 2 + xOffset, height / 2 + yOffset, z],
    ].map(rotateViewerPoint);
    const boundsPoints = [
      [slice.bounds.left + xOffset - boundPadding, slice.bounds.top + yOffset - boundPadding, z],
      [slice.bounds.right + xOffset + boundPadding, slice.bounds.top + yOffset - boundPadding, z],
      [slice.bounds.right + xOffset + boundPadding, slice.bounds.bottom + yOffset + boundPadding, z],
      [slice.bounds.left + xOffset - boundPadding, slice.bounds.bottom + yOffset + boundPadding, z],
    ].map(rotateViewerPoint);
    return {
      ...slice,
      points,
      boundsPoints,
      depth: rotateViewerPoint([xOffset, yOffset, z])[2],
    };
  });
  const points = slices.flatMap((slice) => slice.boundsPoints);
  const minX = Math.min(...points.map((point) => point[0]));
  const maxX = Math.max(...points.map((point) => point[0]));
  const minY = Math.min(...points.map((point) => point[1]));
  const maxY = Math.max(...points.map((point) => point[1]));
  const cameraSize = 72;
  const cameraPadding = 6;
  const cameraScale = Math.max(
    1,
    Math.floor(
      Math.min(
        (cameraSize - cameraPadding * 2) / (maxX - minX || 1),
        (cameraSize - cameraPadding * 2) / (maxY - minY || 1),
      ),
    ),
  );
  const offsetX = (cameraSize - (maxX - minX) * cameraScale) / 2 - minX * cameraScale;
  const offsetY = (cameraSize - (maxY - minY) * cameraScale) / 2 - minY * cameraScale;
  if (canvas.width !== cameraSize || canvas.height !== cameraSize) {
    canvas.width = cameraSize;
    canvas.height = cameraSize;
  } else {
    context.clearRect(0, 0, canvas.width, canvas.height);
  }
  context.imageSmoothingEnabled = false;

  slices.sort((a, b) => a.depth - b.depth).forEach((slice) => {
    const screen = slice.points.map(([x, y]) => [
      x * cameraScale + offsetX,
      y * cameraScale + offsetY,
    ]);
    const [topLeft, topRight, , bottomLeft] = screen;
    context.save();
    context.imageSmoothingEnabled = false;
    context.setTransform(
      (topRight[0] - topLeft[0]) / width,
      (topRight[1] - topLeft[1]) / width,
      (bottomLeft[0] - topLeft[0]) / height,
      (bottomLeft[1] - topLeft[1]) / height,
      topLeft[0],
      topLeft[1],
    );
    context.drawImage(slice.texture, 0, 0);
    context.restore();
  });

  return { cameraScale, offsetX, offsetY };
}

function blendPixel(data, index, color, alpha) {
  const backgroundAlpha = data[index + 3] / 255;
  const outputAlpha = alpha + backgroundAlpha * (1 - alpha);
  if (outputAlpha <= 0) return;
  for (let channel = 0; channel < 3; channel += 1) {
    data[index + channel] = Math.round(
      (color[channel] * alpha + data[index + channel] * backgroundAlpha * (1 - alpha)) /
      outputAlpha,
    );
  }
  data[index + 3] = Math.round(outputAlpha * 255);
}

function hslToRgb(hue, saturation, lightness) {
  const normalizedHue = ((hue % 360) + 360) % 360;
  const amplitude = saturation * Math.min(lightness, 1 - lightness);
  const channel = (offset) => {
    const position = (offset + normalizedHue / 30) % 12;
    return lightness - amplitude * Math.max(
      -1,
      Math.min(position - 3, 9 - position, 1),
    );
  };
  return [channel(0), channel(8), channel(4)].map((value) =>
    Math.round(value * 255)
  );
}

function sampleScatteredPixel(source, width, height, x, y, radius) {
  const offsets = radius < 0.35
    ? [[0, 0, 2]]
    : [
        [0, 0, 2],
        [radius, 0, 1],
        [-radius, 0, 1],
        [0, radius, 1],
        [0, -radius, 1],
        [radius * 0.7, radius * 0.7, 1],
        [-radius * 0.7, radius * 0.7, 1],
        [radius * 0.7, -radius * 0.7, 1],
        [-radius * 0.7, -radius * 0.7, 1],
      ];
  let totalWeight = 0;
  let totalAlpha = 0;
  const premultiplied = [0, 0, 0];

  offsets.forEach(([offsetX, offsetY, weight]) => {
    const sampleX = Math.max(0, Math.min(width - 1, Math.round(x + offsetX)));
    const sampleY = Math.max(0, Math.min(height - 1, Math.round(y + offsetY)));
    const index = (sampleY * width + sampleX) * 4;
    const alpha = source[index + 3] / 255;
    totalWeight += weight;
    totalAlpha += alpha * weight;
    for (let channel = 0; channel < 3; channel += 1) {
      premultiplied[channel] += source[index + channel] * alpha * weight;
    }
  });

  const alpha = totalAlpha / totalWeight;
  const color = totalAlpha > 0
    ? premultiplied.map((value) => Math.round(value / totalAlpha))
    : [0, 0, 0];
  return [...color, Math.round(alpha * 255)];
}

function dotVector3(left, right) {
  return left[0] * right[0] + left[1] * right[1] + left[2] * right[2];
}

function normalizeVector3(vector) {
  const length = Math.hypot(vector[0], vector[1], vector[2]);
  if (length < 1e-9) return [0, 0, 0];
  return vector.map((component) => component / length);
}

function reflectVector3(incident, normal) {
  const scale = 2 * dotVector3(incident, normal);
  return normalizeVector3(incident.map((component, index) =>
    component - scale * normal[index]
  ));
}

function refractVector3(incident, normal, eta) {
  const incidentDotNormal = dotVector3(incident, normal);
  const discriminant = 1 - eta * eta *
    (1 - incidentDotNormal * incidentDotNormal);
  if (discriminant < 0) return null;
  const normalScale = eta * incidentDotNormal + Math.sqrt(discriminant);
  return normalizeVector3(incident.map((component, index) =>
    eta * component - normalScale * normal[index]
  ));
}

function dielectricFresnel(cosine, indexFrom, indexTo) {
  const cosIncident = Math.max(0, Math.min(1, cosine));
  const eta = indexFrom / indexTo;
  const sinTransmittedSquared = eta * eta * (1 - cosIncident * cosIncident);
  if (sinTransmittedSquared >= 1) return 1;
  const cosTransmitted = Math.sqrt(Math.max(0, 1 - sinTransmittedSquared));
  const sDenominator = indexFrom * cosIncident + indexTo * cosTransmitted;
  const pDenominator = indexFrom * cosTransmitted + indexTo * cosIncident;
  const reflectS = sDenominator === 0
    ? 1
    : (indexFrom * cosIncident - indexTo * cosTransmitted) / sDenominator;
  const reflectP = pDenominator === 0
    ? 1
    : (indexFrom * cosTransmitted - indexTo * cosIncident) / pDenominator;
  return (reflectS * reflectS + reflectP * reflectP) / 2;
}

function traceDielectricSphere(frontNormal, indexOfRefraction) {
  const incident = [0, 0, -1];
  const entryCosine = Math.max(0, -dotVector3(incident, frontNormal));
  const entryFresnel = dielectricFresnel(entryCosine, 1, indexOfRefraction);
  const internalDirection = refractVector3(
    incident,
    frontNormal,
    1 / indexOfRefraction,
  );
  if (!internalDirection) {
    return { transmission: 0, pathLength: 0, totalInternalReflection: true };
  }

  const distanceToExit = Math.max(
    0,
    -2 * dotVector3(frontNormal, internalDirection),
  );
  const exitPoint = frontNormal.map((component, index) =>
    component + internalDirection[index] * distanceToExit
  );
  const exitNormal = normalizeVector3(exitPoint);
  const exitCosine = Math.max(0, dotVector3(internalDirection, exitNormal));
  const criticalAngle = Math.asin(Math.min(1, 1 / indexOfRefraction));
  const exitAngle = Math.acos(Math.max(-1, Math.min(1, exitCosine)));

  if (exitAngle > criticalAngle + 1e-7) {
    return {
      transmission: 0,
      pathLength: distanceToExit,
      totalInternalReflection: true,
      internalReflection: reflectVector3(internalDirection, exitNormal),
    };
  }

  const exitDirection = refractVector3(
    internalDirection,
    exitNormal.map((component) => -component),
    indexOfRefraction,
  );
  if (!exitDirection) {
    return {
      transmission: 0,
      pathLength: distanceToExit,
      totalInternalReflection: true,
      internalReflection: reflectVector3(internalDirection, exitNormal),
    };
  }

  const exitFresnel = dielectricFresnel(exitCosine, indexOfRefraction, 1);
  const transmission = (1 - entryFresnel) * (1 - exitFresnel);
  const backgroundPlaneZ = -1.55;
  const distanceToBackground = exitDirection[2] < -1e-6
    ? Math.max(0, (backgroundPlaneZ - exitPoint[2]) / exitDirection[2])
    : 0;
  const backgroundPoint = exitPoint.map((component, index) =>
    component + exitDirection[index] * distanceToBackground
  );

  return {
    backgroundX: backgroundPoint[0],
    backgroundY: backgroundPoint[1],
    pathLength: distanceToExit,
    transmission,
    totalInternalReflection: false,
  };
}

function togglePressed(button) {
  return button.getAttribute("aria-pressed") === "true";
}

function setTogglePressed(button, pressed) {
  button.setAttribute("aria-pressed", String(pressed));
  button.classList.toggle("active", pressed);
}

function setTransmissionControlsDisabled(disabled) {
  const inputs = [refractiveIndex, surfaceScatter, dispersion, absorption];
  const controls = [
    refractiveIndexControl,
    surfaceScatterControl,
    dispersionControl,
    absorptionControl,
  ];
  inputs.forEach((input) => {
    input.disabled = disabled;
  });
  controls.forEach((control) => {
    control.setAttribute("aria-disabled", String(disabled));
  });
  hiFiToggle.disabled = disabled;
}

function renderGlassRefraction(
  image,
  depth,
  transform,
  {
    materialOffsetX = 0,
    materialOffsetY = 0,
    mood = null,
    timeSeconds = 0,
    moodAnimationAmplitude = 2,
    moodAnimationFrequency = 0.6,
  } = {},
) {
  const directives = image.directives;
  const glassValues = [
    directives.glassCenterX,
    directives.glassCenterY,
    directives.glassCenterZ,
    directives.glassRadius,
  ];
  if (!glassValues.every(Number.isFinite) || directives.glassRadius <= 0) return;

  const normalizedZ = -1 +
    (2 * (directives.glassCenterZ + 0.5)) / directives.sliceCount;
  const center = rotateViewerPoint([
    directives.glassCenterX + 0.5 - directives.sliceWidth / 2 + materialOffsetX,
    directives.glassCenterY + 0.5 - directives.sliceHeight / 2 + materialOffsetY,
    normalizedZ * depth / 2,
  ]);
  const centerX = center[0] * transform.cameraScale + transform.offsetX;
  const centerY = center[1] * transform.cameraScale + transform.offsetY;
  const radius = directives.glassRadius * transform.cameraScale;
  if (radius < 1) return;

  const indexOfRefraction = Math.max(1, Math.min(2.5, Number(refractiveIndex.value) || 1.5));
  const baseHue = ((Number(glassColor.value) || 0) % 360 + 360) % 360;
  const hue = baseHue;
  const baseRoughness = Math.max(0, Math.min(1, Number(surfaceScatter.value) || 0));
  const moodAnimationStrength = Math.min(1, moodAnimationAmplitude / 4);
  const moodAnimationRunning = moodAnimationAmplitude > 0 && moodAnimationFrequency > 0;
  const angryScatterCycle = moodAnimationRunning
    ? 0.5 + 0.5 * Math.sin(
        timeSeconds * Math.PI * 2 * moodAnimationFrequency * 0.72,
      )
    : 0;
  const roughness = mood === "angry"
    ? 0.02 + angryScatterCycle * 0.96 * moodAnimationStrength
    : baseRoughness;
  const mirrorFinish = togglePressed(mirrorToggle);
  const hiFiEnabled = togglePressed(hiFiToggle) && !mirrorFinish;
  const dispersionAmount = Math.max(0, Math.min(1, Number(dispersion.value) || 0));
  const absorptionAmount = Math.max(0, Math.min(1, Number(absorption.value) || 0));
  const strength = Math.min(0.46, (indexOfRefraction - 1) * 0.31) *
    (1 - roughness * 0.16);
  const glassTint = mood === "angry"
    ? [250, 252, 255]
    : hslToRgb(hue, 0.52, 0.76);
  const cloudTint = mood === "angry"
    ? [245, 248, 255]
    : hslToRgb(hue, 0.16, 0.9);
  const absorptionTint = hslToRgb(hue, 0.68, 0.3);
  const mirrorTint = hslToRgb(hue, 0.18, 0.62);
  const sourceImage = context.getImageData(0, 0, canvas.width, canvas.height);
  const outputImage = context.createImageData(canvas.width, canvas.height);
  outputImage.data.set(sourceImage.data);
  const source = sourceImage.data;
  const output = outputImage.data;
  const startX = Math.max(0, Math.floor(centerX - radius));
  const endX = Math.min(canvas.width - 1, Math.ceil(centerX + radius));
  const startY = Math.max(0, Math.floor(centerY - radius));
  const endY = Math.min(canvas.height - 1, Math.ceil(centerY + radius));

  for (let y = startY; y <= endY; y += 1) {
    for (let x = startX; x <= endX; x += 1) {
      const nx = (x + 0.5 - centerX) / radius;
      const ny = (y + 0.5 - centerY) / radius;
      const radialSquared = nx * nx + ny * ny;
      if (radialSquared > 1) continue;

      const normalZ = Math.sqrt(Math.max(0, 1 - radialSquared));
      const destinationIndex = (y * canvas.width + x) * 4;

      if (mirrorFinish) {
        const reflectedX = 2 * nx * normalZ;
        const reflectedY = 2 * ny * normalZ;
        const reflectedLength = Math.hypot(reflectedX, reflectedY);
        const directionX = reflectedLength > 0.025
          ? reflectedX / reflectedLength
          : -0.34;
        const directionY = reflectedLength > 0.025
          ? reflectedY / reflectedLength
          : -0.94;
        const reflectionDistance = radius * (1.08 + (1 - normalZ) * 0.28);
        const reflectedSample = sampleScatteredPixel(
          source,
          canvas.width,
          canvas.height,
          centerX + directionX * reflectionDistance,
          centerY + directionY * reflectionDistance,
          0,
        );
        const environment = reflectedSample[3] > 32
          ? reflectedSample
          : directionY < 0
            ? [218, 229, 235, 255]
            : [38, 44, 52, 255];
        const fresnel = Math.pow(1 - normalZ, 0.72);
        const highlight = Math.max(
          0,
          1 - Math.hypot(nx + 0.38, ny + 0.4) / 0.2,
        );
        const reflectionBand = Math.exp(
          -Math.pow((ny - (0.08 + nx * 0.22)) / 0.105, 2),
        );
        const surfaceShade = 0.62 + normalZ * 0.38;
        for (let channel = 0; channel < 3; channel += 1) {
          let value = (
            environment[channel] * 0.78 +
            mirrorTint[channel] * 0.22
          ) * surfaceShade;
          value = value * (1 - fresnel * 0.28) + 238 * fresnel * 0.52;
          value += reflectionBand * 68 + highlight * 150;
          output[destinationIndex + channel] = Math.max(0, Math.min(255, Math.round(value)));
        }
        output[destinationIndex + 3] = 255;
        continue;
      }

      if (hiFiEnabled) {
        const reflectionX = 2 * nx * normalZ;
        const reflectionY = 2 * ny * normalZ;
        const reflectionLength = Math.hypot(reflectionX, reflectionY);
        const reflectionDirectionX = reflectionLength > 0.025
          ? reflectionX / reflectionLength
          : -0.34;
        const reflectionDirectionY = reflectionLength > 0.025
          ? reflectionY / reflectionLength
          : -0.94;
        const reflectionDistance = radius * (1.08 + (1 - normalZ) * 0.28);
        const scatterRadius = roughness * 3.5 * (0.4 + normalZ * 0.6);
        const reflectedSample = sampleScatteredPixel(
          source,
          canvas.width,
          canvas.height,
          centerX + reflectionDirectionX * reflectionDistance,
          centerY + reflectionDirectionY * reflectionDistance,
          scatterRadius * 0.55,
        );
        const environment = reflectedSample[3] > 32
          ? reflectedSample
          : reflectionDirectionY < 0
            ? [218, 229, 235, 255]
            : [38, 44, 52, 255];
        const dispersionShift = dispersionAmount * 0.035;
        const channelIndices = [
          Math.max(1, indexOfRefraction - dispersionShift),
          indexOfRefraction,
          Math.min(2.5, indexOfRefraction + dispersionShift),
        ];
        const traces = channelIndices.map((channelIndex) =>
          traceDielectricSphere([nx, ny, normalZ], channelIndex)
        );
        let accumulatedAlpha = 0;

        for (let channel = 0; channel < 3; channel += 1) {
          const trace = traces[channel];
          const transmission = trace.transmission;
          const transmittedSample = transmission > 0
            ? sampleScatteredPixel(
                source,
                canvas.width,
                canvas.height,
                centerX + trace.backgroundX * radius,
                centerY + trace.backgroundY * radius,
                scatterRadius,
              )
            : [0, 0, 0, 0];
          const opticalDepth = absorptionAmount * trace.pathLength * 1.3;
          const beerTransmittance = Math.exp(-opticalDepth);
          const transmittedColor =
            transmittedSample[channel] * beerTransmittance +
            absorptionTint[channel] * (1 - beerTransmittance) * 0.55;
          const reflectedWeight = 1 - transmission;
          output[destinationIndex + channel] = Math.max(
            0,
            Math.min(
              255,
              Math.round(
                transmittedColor * transmission +
                environment[channel] * reflectedWeight,
              ),
            ),
          );
          accumulatedAlpha +=
            transmittedSample[3] * transmission + 255 * reflectedWeight;
        }
        output[destinationIndex + 3] = Math.max(
          0,
          Math.min(255, Math.round(accumulatedAlpha / 3)),
        );

        const highlight = Math.max(
          0,
          1 - Math.hypot(nx + 0.38, ny + 0.4) / (0.22 + roughness * 0.14),
        );
        blendPixel(output, destinationIndex, glassTint, highlight * 0.22);
        const grain = ((((x * 73856093) ^ (y * 19349663)) >>> 0) % 101) / 100;
        blendPixel(
          output,
          destinationIndex,
          cloudTint,
          roughness * (0.1 + normalZ * 0.28) * (0.88 + grain * 0.24),
        );
        continue;
      }

      const bend = 1 - strength * normalZ * normalZ;
      const sampleX = centerX + (x - centerX) * bend;
      const sampleY = centerY + (y - centerY) * bend;
      const scatterRadius = roughness * 3.5 * (0.4 + normalZ * 0.6);
      let sample;
      if (dispersionAmount > 0.001) {
        const spread = dispersionAmount *
          (0.45 + strength * radius * 0.55) * normalZ;
        const red = sampleScatteredPixel(
          source,
          canvas.width,
          canvas.height,
          sampleX + nx * spread,
          sampleY + ny * spread,
          scatterRadius,
        );
        const green = sampleScatteredPixel(
          source,
          canvas.width,
          canvas.height,
          sampleX,
          sampleY,
          scatterRadius,
        );
        const blue = sampleScatteredPixel(
          source,
          canvas.width,
          canvas.height,
          sampleX - nx * spread,
          sampleY - ny * spread,
          scatterRadius,
        );
        sample = [
          red[0],
          green[1],
          blue[2],
          Math.round((red[3] + green[3] + blue[3]) / 3),
        ];
      } else {
        sample = sampleScatteredPixel(
          source,
          canvas.width,
          canvas.height,
          sampleX,
          sampleY,
          scatterRadius,
        );
      }
      output.set(sample, destinationIndex);

      const opticalDepth = absorptionAmount * normalZ * 2.6;
      const transmittance = Math.exp(-opticalDepth);
      for (let channel = 0; channel < 3; channel += 1) {
        output[destinationIndex + channel] = Math.round(
          output[destinationIndex + channel] * transmittance +
          absorptionTint[channel] * (1 - transmittance) * 0.55,
        );
      }
      blendPixel(
        output,
        destinationIndex,
        absorptionTint,
        (1 - transmittance) * 0.14,
      );

      const fresnel = Math.pow(1 - normalZ, 1.7);
      const highlight = Math.max(
        0,
        1 - Math.hypot(nx + 0.38, ny + 0.4) / (0.24 + roughness * 0.14),
      );
      blendPixel(
        output,
        destinationIndex,
        glassTint,
        0.045 + fresnel * (0.28 - roughness * 0.06) + highlight * 0.32,
      );
      const grain = ((((x * 73856093) ^ (y * 19349663)) >>> 0) % 101) / 100;
      blendPixel(
        output,
        destinationIndex,
        cloudTint,
        roughness * (0.12 + normalZ * 0.32) * (0.88 + grain * 0.24),
      );
    }
  }

  context.putImageData(outputImage, 0, 0);

  if (mood) {
    const moodPulse = moodAnimationRunning
      ? 0.5 + 0.5 * Math.sin(
          timeSeconds * Math.PI * 2 * moodAnimationFrequency,
        )
      : 0.5;
    context.save();
    context.globalCompositeOperation = "screen";
    if (mood === "angry" || mood === "pleased") {
      const glow = context.createRadialGradient(
        centerX,
        centerY,
        radius * 0.08,
        centerX,
        centerY,
        radius * 1.12,
      );
      if (mood === "angry") {
        glow.addColorStop(0, `rgb(255 255 255 / ${0.22 + angryScatterCycle * 0.18 * moodAnimationStrength})`);
        glow.addColorStop(0.72, `rgb(245 249 255 / ${0.13 + angryScatterCycle * 0.16 * moodAnimationStrength})`);
      } else {
        glow.addColorStop(0, `rgb(255 35 50 / ${0.24 + moodPulse * 0.36 * moodAnimationStrength})`);
        glow.addColorStop(0.7, `rgb(220 0 24 / ${0.12 + moodPulse * 0.24 * moodAnimationStrength})`);
      }
      glow.addColorStop(1, "rgb(0 0 0 / 0)");
      context.fillStyle = glow;
      context.beginPath();
      context.arc(centerX, centerY, radius * 1.14, 0, Math.PI * 2);
      context.fill();
    }
    context.restore();

    if (mood === "inquisitive") {
      context.save();
      context.fillStyle = "#8b4de8";
      context.strokeStyle = "rgb(255 255 255 / 78%)";
      context.lineWidth = Math.max(1, radius * 0.08);
      context.font = `900 ${Math.max(10, radius * 1.12)}px Monaco, monospace`;
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.strokeText("?", centerX + radius * 0.42, centerY - radius * 0.32);
      context.fillText("?", centerX + radius * 0.42, centerY - radius * 0.32);
      context.restore();
    }
  }
}

function renderDroneMirrorCore(
  image,
  depth,
  transform,
  {
    materialOffsetX = 0,
    materialOffsetY = 0,
  } = {},
) {
  const directives = image.directives;
  const coreRadiusVoxels = Number(directives.droneInnerRadius);
  const coreValues = [
    directives.glassCenterX,
    directives.glassCenterY,
    directives.glassCenterZ,
    coreRadiusVoxels,
  ];
  if (!coreValues.every(Number.isFinite) || coreRadiusVoxels <= 0) return;

  const normalizedZ = -1 +
    (2 * (directives.glassCenterZ + 0.5)) / directives.sliceCount;
  const center = rotateViewerPoint([
    directives.glassCenterX + 0.5 - directives.sliceWidth / 2 + materialOffsetX,
    directives.glassCenterY + 0.5 - directives.sliceHeight / 2 + materialOffsetY,
    normalizedZ * depth / 2,
  ]);
  const centerX = center[0] * transform.cameraScale + transform.offsetX;
  const centerY = center[1] * transform.cameraScale + transform.offsetY;
  const radius = coreRadiusVoxels * transform.cameraScale;
  const shellRadius = Math.max(
    radius,
    Number(directives.glassRadius) * transform.cameraScale || radius,
  );
  if (radius < 1) return;

  const sourceImage = context.getImageData(0, 0, canvas.width, canvas.height);
  const outputImage = context.createImageData(canvas.width, canvas.height);
  outputImage.data.set(sourceImage.data);
  const source = sourceImage.data;
  const output = outputImage.data;
  const chromeTint = [184, 193, 201];
  const startX = Math.max(0, Math.floor(centerX - radius));
  const endX = Math.min(canvas.width - 1, Math.ceil(centerX + radius));
  const startY = Math.max(0, Math.floor(centerY - radius));
  const endY = Math.min(canvas.height - 1, Math.ceil(centerY + radius));

  for (let y = startY; y <= endY; y += 1) {
    for (let x = startX; x <= endX; x += 1) {
      const nx = (x + 0.5 - centerX) / radius;
      const ny = (y + 0.5 - centerY) / radius;
      const radialSquared = nx * nx + ny * ny;
      if (radialSquared > 1) continue;

      const normalZ = Math.sqrt(Math.max(0, 1 - radialSquared));
      const reflectedX = 2 * nx * normalZ;
      const reflectedY = 2 * ny * normalZ;
      const reflectedLength = Math.hypot(reflectedX, reflectedY);
      const directionX = reflectedLength > 0.025
        ? reflectedX / reflectedLength
        : -0.34;
      const directionY = reflectedLength > 0.025
        ? reflectedY / reflectedLength
        : -0.94;
      const reflectionDistance = shellRadius * (1.08 + (1 - normalZ) * 0.28);
      const reflectedSample = sampleScatteredPixel(
        source,
        canvas.width,
        canvas.height,
        centerX + directionX * reflectionDistance,
        centerY + directionY * reflectionDistance,
        0,
      );
      const environment = reflectedSample[3] > 32
        ? reflectedSample
        : directionY < 0
          ? [218, 229, 235, 255]
          : [38, 44, 52, 255];
      const edgeReflection = Math.pow(1 - normalZ, 0.58);
      const highlight = Math.max(
        0,
        1 - Math.hypot(nx + 0.38, ny + 0.4) / 0.18,
      );
      const reflectionBand = Math.exp(
        -Math.pow((ny - (0.08 + nx * 0.22)) / 0.09, 2),
      );
      const destinationIndex = (y * canvas.width + x) * 4;

      for (let channel = 0; channel < 3; channel += 1) {
        let value = environment[channel] * 0.92 + chromeTint[channel] * 0.08;
        value = value * (1 - edgeReflection * 0.18) + 246 * edgeReflection * 0.26;
        value += reflectionBand * 72 + highlight * 168;
        output[destinationIndex + channel] = Math.max(
          0,
          Math.min(255, Math.round(value)),
        );
      }
      output[destinationIndex + 3] = 255;
    }
  }

  context.putImageData(outputImage, 0, 0);
}

function renderSphereSliceStack(image, depth) {
  const cachedSlices = getViewerSphereSlices(image);
  const activeSlices = depth > 0
    ? cachedSlices
    : [cachedSlices.reduce((closest, slice) =>
        Math.abs(slice.normalizedZ) < Math.abs(closest.normalizedZ) ? slice : closest
      )];
  renderCachedSliceStack(image.width, image.height, activeSlices, depth);
}

function getImpostorSphereWeights() {
  const yaw = (viewerYaw * Math.PI) / 180;
  const sharpness = 6;
  const facingZ = Math.abs(Math.cos(yaw));
  const facingX = Math.abs(Math.sin(yaw));
  const poweredZ = facingZ ** sharpness;
  const poweredX = facingX ** sharpness;
  const total = poweredZ + poweredX || 1;
  return [poweredZ / total, poweredX / total];
}

function getEnabledImpostorSphereWeights() {
  const [weightZ, weightX] = getImpostorSphereWeights();
  const enabledWeightZ = togglePressed(impostorZToggle) ? weightZ : 0;
  const enabledWeightX = togglePressed(impostorXToggle) ? weightX : 0;
  const total = enabledWeightZ + enabledWeightX;
  if (total <= 0) return [0, 0];
  return [enabledWeightZ / total, enabledWeightX / total];
}

function drawImpostorStack(
  targetContext,
  width,
  height,
  cachedSlices,
  depth,
  axis,
  cameraScale,
  offsetX,
  offsetY,
) {
  const planeWidth = axis === "z" ? width : depth;
  const stackDepth = axis === "z" ? depth : width;
  const yaw = (viewerYaw * Math.PI) / 180;
  const facing = axis === "z" ? Math.cos(yaw) : Math.sin(yaw);
  const textureDirection = facing < 0 ? -1 : 1;
  const textureLeft = -planeWidth / 2 * textureDirection;
  const textureRight = planeWidth / 2 * textureDirection;
  const mapPoint = axis === "z"
    ? (x, y, sliceDepth) => [x, y, sliceDepth]
    : (x, y, sliceDepth) => [-sliceDepth, y, x];
  const slices = cachedSlices.map((slice) => {
    const sliceDepth = slice.normalizedZ * stackDepth / 2;
    const points = [
      mapPoint(textureLeft, -height / 2, sliceDepth),
      mapPoint(textureRight, -height / 2, sliceDepth),
      mapPoint(textureRight, height / 2, sliceDepth),
      mapPoint(textureLeft, height / 2, sliceDepth),
    ].map(rotateViewerPoint);
    const center = rotateViewerPoint(mapPoint(0, 0, sliceDepth));
    return { ...slice, points, depth: center[2] };
  });

  targetContext.clearRect(0, 0, targetContext.canvas.width, targetContext.canvas.height);
  targetContext.imageSmoothingEnabled = false;
  slices.sort((left, right) => left.depth - right.depth).forEach((slice) => {
    const screen = slice.points.map(([x, y]) => [
      x * cameraScale + offsetX,
      y * cameraScale + offsetY,
    ]);
    const [topLeft, topRight, , bottomLeft] = screen;
    targetContext.save();
    targetContext.imageSmoothingEnabled = false;
    targetContext.setTransform(
      (topRight[0] - topLeft[0]) / width,
      (topRight[1] - topLeft[1]) / width,
      (bottomLeft[0] - topLeft[0]) / height,
      (bottomLeft[1] - topLeft[1]) / height,
      topLeft[0],
      topLeft[1],
    );
    targetContext.drawImage(slice.texture, 0, 0);
    targetContext.restore();
  });
}

function renderTwoXpmImpostorSphere(image, depth) {
  const { impostorWidth: width, impostorHeight: height } = image.directives;
  const stacks = getViewerImpostorSphereStacks(image);
  const activeStacks = depth > 0
    ? stacks
    : stacks.map((slices) => [slices.reduce((closest, slice) =>
        Math.abs(slice.normalizedZ) < Math.abs(closest.normalizedZ) ? slice : closest
      )]);
  const cameraSize = 72;
  const cameraPadding = 6;
  const diameter = Math.max(width, height, depth || 1);
  const cameraScale = Math.max(
    1,
    Math.floor((cameraSize - cameraPadding * 2) / diameter),
  );
  const offset = cameraSize / 2;
  const stackCanvases = activeStacks.map((slices, index) => {
    const stackCanvas = document.createElement("canvas");
    stackCanvas.width = cameraSize;
    stackCanvas.height = cameraSize;
    drawImpostorStack(
      stackCanvas.getContext("2d"),
      width,
      height,
      slices,
      depth,
      index === 0 ? "z" : "x",
      cameraScale,
      offset,
      offset,
    );
    return stackCanvas;
  });

  if (canvas.width !== cameraSize || canvas.height !== cameraSize) {
    canvas.width = cameraSize;
    canvas.height = cameraSize;
  }
  context.clearRect(0, 0, cameraSize, cameraSize);
  const [weightZ, weightX] = getEnabledImpostorSphereWeights();
  const dataZ = stackCanvases[0].getContext("2d").getImageData(
    0, 0, cameraSize, cameraSize,
  ).data;
  const dataX = stackCanvases[1].getContext("2d").getImageData(
    0, 0, cameraSize, cameraSize,
  ).data;
  const output = context.createImageData(cameraSize, cameraSize);
  const dominantWeight = Math.max(weightZ, weightX, 1e-6);

  for (let index = 0; index < output.data.length; index += 4) {
    const alphaZ = dataZ[index + 3] / 255;
    const alphaX = dataX[index + 3] / 255;
    const contributionZ = weightZ * alphaZ;
    const contributionX = weightX * alphaX;
    const contribution = contributionZ + contributionX;
    if (contribution <= 0) continue;

    for (let channel = 0; channel < 3; channel += 1) {
      output.data[index + channel] = Math.round(
        (dataZ[index + channel] * contributionZ +
          dataX[index + channel] * contributionX) / contribution,
      );
    }
    output.data[index + 3] = Math.round(
      Math.min(1, contribution / dominantWeight) * 255,
    );
  }
  context.putImageData(output, 0, 0);
}

function renderVolumeSliceStack(image, depth) {
  const isAnimated = image.directives.animation === "bob";
  const isDroneB = image.directives.material === "drone-b";
  const activeMood = isDroneB ? droneMood.value : null;
  const timeSeconds = performance.now() / 1000;
  const activeAmplitude = isAnimated || isDroneB
    ? Math.max(0, Math.min(8, Number(animationAmplitude.value) || 0))
    : 0;
  const activeFrequency = isAnimated || isDroneB
    ? Math.max(0, Math.min(3, Number(animationFrequency.value) || 0))
    : 0;
  const animationOffset = isAnimated
    ? Math.sin(timeSeconds * Math.PI * 2 * activeFrequency) * activeAmplitude
    : 0;
  const droneAnimationPhase = timeSeconds * Math.PI * 2 * activeFrequency;
  const droneShakeX = activeMood === "angry"
    ? (
        Math.sin(droneAnimationPhase * 7.4) * 0.23 +
        Math.sin(droneAnimationPhase * 11.1) * 0.09
      ) * activeAmplitude
    : 0;
  const droneShakeY = activeMood === "angry"
    ? (
        Math.cos(droneAnimationPhase * 8.2) * 0.17 +
        Math.sin(droneAnimationPhase * 12.7) * 0.08
      ) * activeAmplitude
    : isDroneB
      ? Math.sin(droneAnimationPhase) * activeAmplitude * 0.18
      : 0;
  const transform = renderCachedSliceStack(
    image.directives.sliceWidth,
    image.directives.sliceHeight,
    getViewerVolumeSlices(image),
    depth,
    {
      animationOffset,
      animationAmplitude: activeAmplitude,
      materialOffsetX: droneShakeX,
      materialOffsetY: droneShakeY,
      materialPadding: isDroneB ? activeAmplitude * 0.4 : 0,
    },
  );
  if (isDroneB) {
    renderDroneMirrorCore(image, depth, transform, {
      materialOffsetX: droneShakeX,
      materialOffsetY: droneShakeY,
    });
  }
  if (["glass", "drone-b"].includes(image.directives.material)) {
    renderGlassRefraction(image, depth, transform, {
      materialOffsetX: droneShakeX,
      materialOffsetY: isAnimated ? animationOffset : droneShakeY,
      mood: activeMood,
      timeSeconds,
      moodAnimationAmplitude: activeAmplitude,
      moodAnimationFrequency: activeFrequency,
    });
  }
}

function renderExtrudedXpm(image) {
  const depth = Number(viewerDepth.value);
  if (image.primitive === "impostor-sphere-2xpm") {
    renderTwoXpmImpostorSphere(image, depth);
    return;
  }
  if (image.primitive === "sphere") {
    renderSphereSliceStack(image, depth);
    return;
  }
  if (image.primitive === "slice-stack") {
    renderVolumeSliceStack(image, depth);
    return;
  }
  const front = depth / 2;
  const back = -depth / 2;
  const grid = image.pixels.map((row) =>
    Array.from({ length: image.width }, (_, x) => {
      const symbol = row.slice(x * image.cpp, (x + 1) * image.cpp);
      return image.colors.get(symbol) ?? null;
    }),
  );
  const faces = [];
  const addFace = (points, color) => {
    const rotated = points.map(rotateViewerPoint);
    faces.push({
      points: rotated,
      color,
      depth: rotated.reduce((sum, point) => sum + point[2], 0) / rotated.length,
    });
  };

  grid.forEach((row, y) => {
    row.forEach((color, x) => {
      if (color === null) return;
      const left = x - image.width / 2;
      const right = left + 1;
      const top = y - image.height / 2;
      const bottom = top + 1;
      addFace(
        [[left, top, front], [right, top, front], [right, bottom, front], [left, bottom, front]],
        color,
      );
      if (!depth) return;
      if (grid[y]?.[x - 1] == null) addFace([[left, top, back], [left, top, front], [left, bottom, front], [left, bottom, back]], shadeViewerColor(color, 0.58));
      if (grid[y]?.[x + 1] == null) addFace([[right, top, front], [right, top, back], [right, bottom, back], [right, bottom, front]], shadeViewerColor(color, 0.72));
      if (grid[y - 1]?.[x] == null) addFace([[left, top, back], [right, top, back], [right, top, front], [left, top, front]], shadeViewerColor(color, 0.84));
      if (grid[y + 1]?.[x] == null) addFace([[left, bottom, front], [right, bottom, front], [right, bottom, back], [left, bottom, back]], shadeViewerColor(color, 0.48));
    });
  });

  if (faces.length === 0) {
    canvas.width = image.width;
    canvas.height = image.height;
    context.clearRect(0, 0, canvas.width, canvas.height);
    return;
  }

  const points = faces.flatMap((face) => face.points);
  const minX = Math.min(...points.map((point) => point[0]));
  const maxX = Math.max(...points.map((point) => point[0]));
  const minY = Math.min(...points.map((point) => point[1]));
  const maxY = Math.max(...points.map((point) => point[1]));
  const cameraSize = 72;
  const cameraPadding = 6;
  const cameraScale = Math.max(
    1,
    Math.floor(
      Math.min(
        (cameraSize - cameraPadding * 2) / (maxX - minX || 1),
        (cameraSize - cameraPadding * 2) / (maxY - minY || 1),
      ),
    ),
  );
  const offsetX =
    (cameraSize - (maxX - minX) * cameraScale) / 2 - minX * cameraScale;
  const offsetY =
    (cameraSize - (maxY - minY) * cameraScale) / 2 - minY * cameraScale;
  if (canvas.width !== cameraSize || canvas.height !== cameraSize) {
    canvas.width = cameraSize;
    canvas.height = cameraSize;
  } else {
    context.clearRect(0, 0, canvas.width, canvas.height);
  }
  context.imageSmoothingEnabled = false;

  faces
    .sort((first, second) => first.depth - second.depth)
    .forEach((face) => {
      context.beginPath();
      face.points.forEach((point, index) => {
        const x = point[0] * cameraScale + offsetX;
        const y = point[1] * cameraScale + offsetY;
        if (index === 0) context.moveTo(x, y);
        else context.lineTo(x, y);
      });
      context.closePath();
      context.fillStyle = face.color;
      context.fill();
    });
}

function createSvg(image, scale) {
  const rectangles = [];
  const displayWidth = image.width * scale;
  const displayHeight = image.height * scale;

  image.pixels.forEach((row, y) => {
    let x = 0;
    while (x < image.width) {
      const symbol = row.slice(x * image.cpp, (x + 1) * image.cpp);
      if (!image.colors.has(symbol)) {
        throw new Error(`Unknown symbol "${symbol}" at row ${y + 1}, column ${x + 1}.`);
      }

      const color = image.colors.get(symbol);
      let runWidth = 1;
      while (x + runWidth < image.width) {
        const nextSymbol = row.slice(
          (x + runWidth) * image.cpp,
          (x + runWidth + 1) * image.cpp,
        );
        if (image.colors.get(nextSymbol) !== color) {
          break;
        }
        runWidth += 1;
      }

      if (color !== null) {
        rectangles.push(
          `<rect x="${x}" y="${y}" width="${runWidth}" height="1" fill="${escapeXmlAttribute(color)}"/>`,
        );
      }
      x += runWidth;
    }
  });

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    `<svg xmlns="http://www.w3.org/2000/svg" width="${displayWidth}" height="${displayHeight}" viewBox="0 0 ${image.width} ${image.height}" shape-rendering="crispEdges">`,
    "  <title>Exported XPM artwork</title>",
    ...rectangles.map((rectangle) => `  ${rectangle}`),
    "</svg>",
    "",
  ].join("\n");
}

function createCameraSvg(scale) {
  const image = context.getImageData(0, 0, canvas.width, canvas.height);
  const rectangles = [];

  for (let y = 0; y < canvas.height; y += 1) {
    let x = 0;
    while (x < canvas.width) {
      const offset = (y * canvas.width + x) * 4;
      const alpha = image.data[offset + 3];
      if (alpha === 0) {
        x += 1;
        continue;
      }
      const color = `rgb(${image.data[offset]} ${image.data[offset + 1]} ${image.data[offset + 2]} / ${alpha / 255})`;
      let width = 1;
      while (x + width < canvas.width) {
        const next = (y * canvas.width + x + width) * 4;
        if (
          image.data[next] !== image.data[offset] ||
          image.data[next + 1] !== image.data[offset + 1] ||
          image.data[next + 2] !== image.data[offset + 2] ||
          image.data[next + 3] !== alpha
        ) break;
        width += 1;
      }
      rectangles.push(`<rect x="${x}" y="${y}" width="${width}" height="1" fill="${color}"/>`);
      x += width;
    }
  }

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    `<svg xmlns="http://www.w3.org/2000/svg" width="${canvas.width * scale}" height="${canvas.height * scale}" viewBox="0 0 ${canvas.width} ${canvas.height}" shape-rendering="crispEdges">`,
    ...rectangles.map((rectangle) => `  ${rectangle}`),
    "</svg>",
    "",
  ].join("\n");
}

function cameraCanvasToXpm() {
  const image = context.getImageData(0, 0, canvas.width, canvas.height);
  const colorRows = [];
  const colors = new Set();

  for (let y = 0; y < canvas.height; y += 1) {
    const row = [];
    for (let x = 0; x < canvas.width; x += 1) {
      const offset = (y * canvas.width + x) * 4;
      if (image.data[offset + 3] < 128) {
        row.push(null);
        continue;
      }

      const color = `#${[
        image.data[offset],
        image.data[offset + 1],
        image.data[offset + 2],
      ]
        .map((channel) => channel.toString(16).padStart(2, "0"))
        .join("")
        .toUpperCase()}`;
      colors.add(color);
      row.push(color);
    }
    colorRows.push(row);
  }

  const alphabet =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789#$%&()*+,-./:;<=>?@[]^_`{|}~";
  const colorCount = colors.size + 1;
  const cpp = colorCount <= alphabet.length ? 1 : 2;
  const makeSymbol = (index) =>
    cpp === 1
      ? alphabet[index]
      : `${alphabet[Math.floor(index / alphabet.length)]}${alphabet[index % alphabet.length]}`;
  const symbols = new Map();
  [...colors].forEach((color, index) => symbols.set(color, makeSymbol(index + 1)));
  const transparentSymbol = makeSymbol(0);
  if (
    !transparentSymbol ||
    [...symbols.values()].some((symbol) => !symbol || symbol.length !== cpp)
  ) {
    throw new Error("The camera view contains too many colors to encode as XPM.");
  }

  return [
    "! XPM2",
    "! Rasterized from the current 2.5D camera angle",
    `${canvas.width} ${canvas.height} ${colorCount} ${cpp}`,
    "! colors",
    `${transparentSymbol.padEnd(cpp)} c None`,
    ...[...colors].map((color) => `${symbols.get(color)} c ${color}`),
    "! pixels",
    ...colorRows.map((row) =>
      row.map((color) => (color ? symbols.get(color) : transparentSymbol)).join(""),
    ),
  ].join("\n");
}

function downloadText(contents, filename, type) {
  const blobUrl = URL.createObjectURL(new Blob([contents], { type }));
  const link = document.createElement("a");
  link.href = blobUrl;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(blobUrl), 0);
}

function exportSvg() {
  try {
    const image = parseXpm(source.value);
    const svg =
      viewerMode === "2.5d"
        ? createCameraSvg(Number(scaleSlider.value))
        : createSvg(image, Number(scaleSlider.value));
    const blobUrl = URL.createObjectURL(
      new Blob([svg], { type: "image/svg+xml;charset=utf-8" }),
    );
    const link = document.createElement("a");
    const demoName = activeDemo >= 0 ? demos[activeDemo].name : importedArtworkName;

    link.href = blobUrl;
    link.download = `${demoName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.svg`;
    document.body.append(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(blobUrl), 0);
  } catch (error) {
    status.textContent = error instanceof Error ? error.message : "Unable to export SVG.";
    status.classList.add("error");
  }
}

function exportXpm() {
  try {
    const image = parseXpm(source.value);
    const exportCamera = viewerMode === "2.5d" &&
      !["slice-stack", "impostor-sphere-2xpm"].includes(image.primitive);
    const xpm = exportCamera ? cameraCanvasToXpm() : source.value;
    const demoName = activeDemo >= 0 ? demos[activeDemo].name : importedArtworkName;
    const suffix = exportCamera ? "-camera" : "";
    const filename = `${demoName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}${suffix}.xpm`;
    downloadText(xpm, filename, "text/plain;charset=utf-8");
  } catch (error) {
    status.textContent = error instanceof Error ? error.message : "Unable to export XPM.";
    status.classList.add("error");
  }
}

function render() {
  try {
    const image = parseXpm(source.value);
    const isSphere = image.primitive === "sphere";
    const isImpostorSphere = image.primitive === "impostor-sphere-2xpm";
    const isVolume = image.primitive === "slice-stack";
    const isDroneB = isVolume && image.directives.material === "drone-b";
    const isGlass = isVolume && ["glass", "drone-b"].includes(image.directives.material);
    const isAnimatedGlass = isGlass && !isDroneB && image.directives.animation === "bob";
    const hasAnimationControls = isAnimatedGlass || isDroneB;
    if (isGlass) {
      const directiveIndex = Number(image.directives.refractiveIndex);
      const serializedIndex = Number.isFinite(directiveIndex)
        ? Math.max(1, Math.min(2.5, directiveIndex))
        : 1.5;
      const directiveHue = Number(image.directives.glassHue);
      const serializedHue = Number.isFinite(directiveHue)
        ? Math.max(0, Math.min(360, directiveHue))
        : 184;
      const directiveRoughness = Number(image.directives.surfaceRoughness);
      const serializedRoughness = Number.isFinite(directiveRoughness)
        ? Math.max(0, Math.min(1, directiveRoughness))
        : 0.15;
      const directiveDispersion = Number(image.directives.dispersion);
      const serializedDispersion = Number.isFinite(directiveDispersion)
        ? Math.max(0, Math.min(1, directiveDispersion))
        : 0.12;
      const directiveAbsorption = Number(image.directives.absorption);
      const serializedAbsorption = Number.isFinite(directiveAbsorption)
        ? Math.max(0, Math.min(1, directiveAbsorption))
        : 0.08;
      const serializedMirror = image.directives.mirror === true;
      const serializedHiFi = image.directives.hiFi === true;
      const serializedMood = ["angry", "inquisitive", "pleased"].includes(image.directives.mood)
        ? image.directives.mood
        : "inquisitive";
      const serializedSurface = ["checkerboard", "grass", "sand", "mossy-rocks"].includes(image.directives.surface)
        ? image.directives.surface
        : "grass";
      const directiveAmplitude = Number(image.directives.animationAmplitude);
      const serializedAmplitude = Number.isFinite(directiveAmplitude)
        ? Math.max(0, Math.min(8, directiveAmplitude))
        : 2;
      const directiveFrequency = Number(image.directives.animationFrequency);
      const serializedFrequency = Number.isFinite(directiveFrequency)
        ? Math.max(0, Math.min(3, directiveFrequency))
        : 0.6;
      if (document.activeElement !== refractiveIndex) {
        refractiveIndex.value = String(serializedIndex);
        refractiveIndexValue.value = serializedIndex.toFixed(2);
        refractiveIndexValue.textContent = serializedIndex.toFixed(2);
      }
      if (document.activeElement !== glassColor) {
        glassColor.value = String(serializedHue);
        glassColorValue.value = `${Math.round(serializedHue)}°`;
        glassColorValue.textContent = `${Math.round(serializedHue)}°`;
      }
      if (document.activeElement !== surfaceScatter) {
        surfaceScatter.value = String(serializedRoughness);
        const surfaceLabel = serializedRoughness.toFixed(2);
        surfaceScatterValue.value = surfaceLabel;
        surfaceScatterValue.textContent = surfaceLabel;
      }
      if (document.activeElement !== dispersion) {
        dispersion.value = String(serializedDispersion);
        dispersionValue.value = serializedDispersion.toFixed(2);
        dispersionValue.textContent = serializedDispersion.toFixed(2);
      }
      if (document.activeElement !== absorption) {
        absorption.value = String(serializedAbsorption);
        absorptionValue.value = serializedAbsorption.toFixed(2);
        absorptionValue.textContent = serializedAbsorption.toFixed(2);
      }
      if (hasAnimationControls && document.activeElement !== animationAmplitude) {
        animationAmplitude.value = String(serializedAmplitude);
        animationAmplitudeValue.value = serializedAmplitude.toFixed(1);
        animationAmplitudeValue.textContent = serializedAmplitude.toFixed(1);
      }
      if (hasAnimationControls && document.activeElement !== animationFrequency) {
        animationFrequency.value = String(serializedFrequency);
        animationFrequencyValue.value = serializedFrequency.toFixed(2);
        animationFrequencyValue.textContent = serializedFrequency.toFixed(2);
      }
      if (document.activeElement !== mirrorToggle) {
        setTogglePressed(mirrorToggle, serializedMirror);
      }
      if (document.activeElement !== hiFiToggle) {
        setTogglePressed(hiFiToggle, serializedHiFi);
      }
      if (isDroneB && document.activeElement !== droneMood) {
        droneMood.value = serializedMood;
      }
      if (isDroneB && document.activeElement !== droneSurface) {
        droneSurface.value = serializedSurface;
      }
      setTransmissionControlsDisabled(togglePressed(mirrorToggle));
      glassColor.style.accentColor = `hsl(${serializedHue} 65% 48%)`;
    }
    const glassControlsHidden = viewerMode !== "2.5d" || !isGlass;
    glassModeControls.hidden = glassControlsHidden;
    impostorLayerControls.hidden = viewerMode !== "2.5d" || !isImpostorSphere;
    droneMoodControl.hidden = glassControlsHidden || !isDroneB;
    droneSurfaceControl.hidden = glassControlsHidden || !isDroneB;
    refractiveIndexControl.hidden = glassControlsHidden;
    glassColorControl.hidden = glassControlsHidden;
    surfaceScatterControl.hidden = glassControlsHidden;
    dispersionControl.hidden = glassControlsHidden;
    absorptionControl.hidden = glassControlsHidden;
    const animationControlsHidden = glassControlsHidden || !hasAnimationControls;
    animationAmplitudeControl.hidden = animationControlsHidden;
    animationFrequencyControl.hidden = animationControlsHidden;
    viewerDepthLabel.textContent = isImpostorSphere
      ? "Z thickness"
      : isSphere
      ? "Z diameter"
      : isVolume
        ? "Z depth"
        : "Extrude";
    if (viewerMode === "2.5d") {
      renderExtrudedXpm(image);
    } else {
      canvas.width = image.width;
      canvas.height = image.height;
      context.clearRect(0, 0, image.width, image.height);

      image.pixels.forEach((row, y) => {
        for (let x = 0; x < image.width; x += 1) {
          const symbol = row.slice(x * image.cpp, (x + 1) * image.cpp);
          if (!image.colors.has(symbol)) {
            throw new Error(`Unknown symbol "${symbol}" at row ${y + 1}, column ${x + 1}.`);
          }

          const color = image.colors.get(symbol);
          if (color !== null) {
            context.fillStyle = color;
            context.fillRect(x, y, 1, 1);
          }
        }
      });
    }

    updateCanvasScale();
    meta.textContent =
      viewerMode === "2.5d"
        ? isImpostorSphere
          ? (() => {
              const [weightZ, weightX] = getEnabledImpostorSphereWeights();
              const layerZ = togglePressed(impostorZToggle)
                ? `${Math.round(weightZ * 100)}%`
                : "off";
              const layerX = togglePressed(impostorXToggle)
                ? `${Math.round(weightX * 100)}%`
                : "off";
              return `${image.directives.impostorWidth} × ${image.directives.impostorHeight} × ${viewerDepth.value} · 2 XPM views · orthogonal stacks · Z ${layerZ} / X ${layerX}`;
            })()
          : isSphere
          ? `${image.width} × ${image.height} mask · sphere · ${Number(viewerDepth.value) > 0 ? getViewerSphereSlices(image).length : 1} slices · ${viewerDepth.value}px Z diameter`
          : isVolume
            ? `${image.directives.sliceWidth} × ${image.directives.sliceHeight} × ${image.directives.sliceCount} voxels · ${viewerDepth.value}px Z depth${isGlass ? ` · ${isDroneB ? `Drone B · ${droneMood.value} · ${droneSurface.value}` : ""}${isDroneB ? " · " : ""}${togglePressed(mirrorToggle) ? "opaque mirror" : `${togglePressed(hiFiToggle) ? "Hi-Fi dielectric" : "fast glass"} n=${Number(refractiveIndex.value).toFixed(2)} · scatter ${Number(surfaceScatter.value).toFixed(2)} · dispersion ${Number(dispersion.value).toFixed(2)} · absorption ${Number(absorption.value).toFixed(2)}`} · hue ${Math.round(Number(glassColor.value))}°${hasAnimationControls ? ` · ${isDroneB ? "motion" : "bob"} ${Number(animationAmplitude.value).toFixed(1)}px @ ${Number(animationFrequency.value).toFixed(2)}Hz` : ""}` : ""}`
            : `${image.width} × ${image.height} source · ${viewerDepth.value}px depth`
        : `${image.width} × ${image.height} · ${image.colorCount} colors`;
    status.textContent = "Valid XPM — preview updated";
    status.classList.remove("error");
    setMaterialAnimationActive(
      viewerMode === "2.5d" &&
      (
        (
          isAnimatedGlass &&
          Number(animationAmplitude.value) > 0 &&
          Number(animationFrequency.value) > 0
        ) ||
        (
          isDroneB &&
          Number(animationAmplitude.value) > 0 &&
          Number(animationFrequency.value) > 0
        )
      ),
    );
  } catch (error) {
    glassModeControls.hidden = true;
    impostorLayerControls.hidden = true;
    droneMoodControl.hidden = true;
    droneSurfaceControl.hidden = true;
    refractiveIndexControl.hidden = true;
    glassColorControl.hidden = true;
    surfaceScatterControl.hidden = true;
    dispersionControl.hidden = true;
    absorptionControl.hidden = true;
    animationAmplitudeControl.hidden = true;
    animationFrequencyControl.hidden = true;
    setMaterialAnimationActive(false);
    status.textContent = error instanceof Error ? error.message : "Unable to parse XPM.";
    status.classList.add("error");
  }
}

let renderTimer;
let viewerRenderFrame = null;
function scheduleViewerRender() {
  if (viewerRenderFrame !== null) return;
  viewerRenderFrame = requestAnimationFrame(() => {
    viewerRenderFrame = null;
    render();
  });
}

function setMaterialAnimationActive(enabled) {
  if (!enabled) {
    if (materialAnimationFrame !== null) {
      cancelAnimationFrame(materialAnimationFrame);
      materialAnimationFrame = null;
    }
    return;
  }
  if (materialAnimationFrame !== null) return;
  materialAnimationFrame = requestAnimationFrame(() => {
    materialAnimationFrame = null;
    scheduleViewerRender();
  });
}

function setAutoOrbit(enabled) {
  if (autoOrbitFrame !== null) {
    cancelAnimationFrame(autoOrbitFrame);
    autoOrbitFrame = null;
  }
  autoOrbitButton.classList.toggle("active", enabled);
  autoOrbitButton.setAttribute("aria-pressed", String(enabled));
  if (!enabled) return;

  autoOrbitLastTime = performance.now();
  const orbit = (time) => {
    if (autoOrbitFrame === null) return;
    const elapsed = Math.min(50, Math.max(0, time - autoOrbitLastTime));
    autoOrbitLastTime = time;
    viewerYaw = (viewerYaw + elapsed * 0.024) % 360;
    scheduleViewerRender();
    autoOrbitFrame = requestAnimationFrame(orbit);
  };
  autoOrbitFrame = requestAnimationFrame(orbit);
}
source.addEventListener("input", () => {
  activeDemo = -1;
  updateActiveDemo();
  if (autoSync.checked) {
    synchronizeXpm2Editor();
  }
  highlightXpm(source.value);
  window.clearTimeout(renderTimer);
  renderTimer = window.setTimeout(render, 120);
});

source.addEventListener("scroll", syncHighlightScroll);
scaleSlider.addEventListener("input", updateCanvasScale);
exportSvgButton.addEventListener("click", exportSvg);
exportXpmButton.addEventListener("click", exportXpm);
viewerDepth.addEventListener("input", () => {
  viewerDepthValue.textContent = `${viewerDepth.value} px`;
  scheduleViewerRender();
});

function serializeWorkbenchNumber(name, formatted) {
  const directive = new RegExp(
    `^!\\s*xpm-workbench\\s+${name}\\s+[0-9]*\\.?[0-9]+\\s*$`,
    "mi",
  );
  const updatedSource = source.value.replace(
    directive,
    `! xpm-workbench ${name} ${formatted}`,
  );
  if (updatedSource === source.value) return false;
  source.value = updatedSource;
  parsedXpmCache = null;
  highlightXpm(source.value);
  syncHighlightScroll();
  return true;
}

function serializeWorkbenchToggle(name, enabled) {
  const value = enabled ? "on" : "off";
  const directive = new RegExp(
    `^!\\s*xpm-workbench\\s+${name}\\s+(?:on|off)\\s*$`,
    "mi",
  );
  let updatedSource;
  if (directive.test(source.value)) {
    updatedSource = source.value.replace(
      directive,
      `! xpm-workbench ${name} ${value}`,
    );
  } else {
    updatedSource = source.value.replace(
      /^(!\s*xpm-workbench\s+material\s+(?:glass|drone-b)\s*)$/mi,
      `$1\n! xpm-workbench ${name} ${value}`,
    );
  }
  if (updatedSource === source.value) return false;
  source.value = updatedSource;
  parsedXpmCache = null;
  highlightXpm(source.value);
  syncHighlightScroll();
  return true;
}

function serializeDroneMood(value) {
  if (!["angry", "inquisitive", "pleased"].includes(value)) return false;
  const directive = /^!\s*xpm-workbench\s+mood\s+(?:angry|inquisitive|pleased)\s*$/mi;
  let updatedSource;
  if (directive.test(source.value)) {
    updatedSource = source.value.replace(
      directive,
      `! xpm-workbench mood ${value}`,
    );
  } else {
    updatedSource = source.value.replace(
      /^(!\s*xpm-workbench\s+material\s+drone-b\s*)$/mi,
      `$1\n! xpm-workbench mood ${value}`,
    );
  }
  if (updatedSource === source.value) return false;
  source.value = updatedSource;
  parsedXpmCache = null;
  highlightXpm(source.value);
  syncHighlightScroll();
  return true;
}

const droneSurfacePalettes = Object.freeze({
  checkerboard: ["#d8d3c6", "#343431", "#8d8c85"],
  grass: ["#4f7f39", "#294f2c", "#83aa58"],
  sand: ["#d5b873", "#9d7845", "#ead39a"],
  "mossy-rocks": ["#66705d", "#39463b", "#8c9a72"],
});

function serializeDroneSurface(value) {
  const palette = droneSurfacePalettes[value];
  if (!palette) return false;
  const directive = /^!\s*xpm-workbench\s+surface\s+(?:checkerboard|grass|sand|mossy-rocks)\s*$/mi;
  let updatedSource = XpmPrimitives.applyDroneSurfaceXpm(source.value, value);
  updatedSource = directive.test(updatedSource)
    ? updatedSource.replace(directive, `! xpm-workbench surface ${value}`)
    : updatedSource.replace(
        /^(!\s*xpm-workbench\s+material\s+drone-b\s*)$/mi,
        `$1\n! xpm-workbench surface ${value}`,
      );
  ["a", "b", "c"].forEach((symbol, index) => {
    updatedSource = updatedSource.replace(
      new RegExp(`^${symbol}\\s+c\\s+.+$`, "m"),
      `${symbol} c ${palette[index]}`,
    );
  });
  if (updatedSource === source.value) return false;
  source.value = updatedSource;
  parsedXpmCache = null;
  highlightXpm(source.value);
  syncHighlightScroll();
  return true;
}

function serializeGlassPalette(hue) {
  const palette = {
    D: [30, 25, "0.025"],
    S: [40, 35, "0.030"],
    M: [48, 48, "0.035"],
    L: [56, 63, "0.040"],
    H: [45, 82, "0.055"],
  };
  const updatedSource = source.value.replace(
    /^([DSMLH])\s+c\s+.+$/gm,
    (line, symbol) => {
      const [saturation, lightness, alpha] = palette[symbol];
      return `${symbol} c hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha})`;
    },
  );
  if (updatedSource === source.value) return false;
  source.value = updatedSource;
  return true;
}

refractiveIndex.addEventListener("input", () => {
  const value = Math.max(1, Math.min(2.5, Number(refractiveIndex.value) || 1.5));
  const formatted = value.toFixed(2);
  refractiveIndexValue.value = formatted;
  refractiveIndexValue.textContent = formatted;
  serializeWorkbenchNumber("refractive-index", formatted);
  scheduleViewerRender();
});
glassColor.addEventListener("input", () => {
  const value = Math.max(0, Math.min(360, Math.round(Number(glassColor.value) || 0)));
  const formatted = String(value);
  glassColorValue.value = `${formatted}°`;
  glassColorValue.textContent = `${formatted}°`;
  glassColor.style.accentColor = `hsl(${value} 65% 48%)`;
  const paletteChanged = serializeGlassPalette(value);
  const directiveChanged = serializeWorkbenchNumber("glass-hue", formatted);
  if (paletteChanged && !directiveChanged) {
    parsedXpmCache = null;
    highlightXpm(source.value);
    syncHighlightScroll();
  }
  scheduleViewerRender();
});
surfaceScatter.addEventListener("input", () => {
  const value = Math.max(0, Math.min(1, Number(surfaceScatter.value) || 0));
  const formatted = value.toFixed(2);
  surfaceScatterValue.value = formatted;
  surfaceScatterValue.textContent = formatted;
  serializeWorkbenchNumber("surface-roughness", formatted);
  scheduleViewerRender();
});
dispersion.addEventListener("input", () => {
  const value = Math.max(0, Math.min(1, Number(dispersion.value) || 0));
  const formatted = value.toFixed(2);
  dispersionValue.value = formatted;
  dispersionValue.textContent = formatted;
  serializeWorkbenchNumber("dispersion", formatted);
  scheduleViewerRender();
});
absorption.addEventListener("input", () => {
  const value = Math.max(0, Math.min(1, Number(absorption.value) || 0));
  const formatted = value.toFixed(2);
  absorptionValue.value = formatted;
  absorptionValue.textContent = formatted;
  serializeWorkbenchNumber("absorption", formatted);
  scheduleViewerRender();
});
mirrorToggle.addEventListener("click", () => {
  const enabled = !togglePressed(mirrorToggle);
  setTogglePressed(mirrorToggle, enabled);
  setTransmissionControlsDisabled(enabled);
  serializeWorkbenchToggle("mirror", enabled);
  scheduleViewerRender();
});
hiFiToggle.addEventListener("click", () => {
  const enabled = !togglePressed(hiFiToggle);
  setTogglePressed(hiFiToggle, enabled);
  serializeWorkbenchToggle("hi-fi", enabled);
  scheduleViewerRender();
});
impostorZToggle.addEventListener("click", () => {
  setTogglePressed(impostorZToggle, !togglePressed(impostorZToggle));
  scheduleViewerRender();
});
impostorXToggle.addEventListener("click", () => {
  setTogglePressed(impostorXToggle, !togglePressed(impostorXToggle));
  scheduleViewerRender();
});
droneMood.addEventListener("change", () => {
  const moodHue = droneMood.value === "inquisitive" ? 120 : 0;
  glassColor.value = String(moodHue);
  glassColorValue.value = `${moodHue}°`;
  glassColorValue.textContent = `${moodHue}°`;
  glassColor.style.accentColor = `hsl(${moodHue} 65% 48%)`;
  serializeDroneMood(droneMood.value);
  const paletteChanged = serializeGlassPalette(moodHue);
  const directiveChanged = serializeWorkbenchNumber("glass-hue", String(moodHue));
  if (paletteChanged && !directiveChanged) {
    parsedXpmCache = null;
    highlightXpm(source.value);
    syncHighlightScroll();
  }
  scheduleViewerRender();
});
droneSurface.addEventListener("change", () => {
  serializeDroneSurface(droneSurface.value);
  scheduleViewerRender();
});
animationAmplitude.addEventListener("input", () => {
  const value = Math.max(0, Math.min(8, Number(animationAmplitude.value) || 0));
  const formatted = value.toFixed(2);
  animationAmplitudeValue.value = value.toFixed(1);
  animationAmplitudeValue.textContent = value.toFixed(1);
  serializeWorkbenchNumber("animation-amplitude", formatted);
  scheduleViewerRender();
});
animationFrequency.addEventListener("input", () => {
  const value = Math.max(0, Math.min(3, Number(animationFrequency.value) || 0));
  const formatted = value.toFixed(2);
  animationFrequencyValue.value = formatted;
  animationFrequencyValue.textContent = formatted;
  serializeWorkbenchNumber("animation-frequency", formatted);
  scheduleViewerRender();
});

function setViewerMode(mode) {
  viewerMode = mode;
  const is25d = mode === "2.5d";
  mode2dButton.classList.toggle("active", !is25d);
  mode25dButton.classList.toggle("active", is25d);
  mode2dButton.setAttribute("aria-pressed", String(!is25d));
  mode25dButton.setAttribute("aria-pressed", String(is25d));
  viewerDepthControl.hidden = !is25d;
  orbitHint.hidden = !is25d;
  viewerStage.classList.toggle("orbit-enabled", is25d);
  render();
}

mode2dButton.addEventListener("click", () => {
  setAutoOrbit(false);
  setViewerMode("2d");
});
mode25dButton.addEventListener("click", () => {
  hasUsed25dMode = true;
  localStorage.setItem(viewerModeUsedStorageKey, "true");
  viewerModeGuide.hidden = true;
  setViewerMode("2.5d");
});
autoOrbitButton.addEventListener("click", () => {
  const shouldStart = autoOrbitFrame === null;
  if (shouldStart && viewerMode !== "2.5d") {
    hasUsed25dMode = true;
    localStorage.setItem(viewerModeUsedStorageKey, "true");
    viewerModeGuide.hidden = true;
    setViewerMode("2.5d");
  }
  setAutoOrbit(shouldStart);
});

let viewerOrbit = null;
viewerStage.addEventListener("pointerdown", (event) => {
  if (viewerMode !== "2.5d" || event.button !== 0) return;
  setAutoOrbit(false);
  viewerOrbit = {
    pointerId: event.pointerId,
    x: event.clientX,
    y: event.clientY,
    yaw: viewerYaw,
    pitch: viewerPitch,
  };
  viewerStage.setPointerCapture(event.pointerId);
  viewerStage.classList.add("orbiting");
});
viewerStage.addEventListener("pointermove", (event) => {
  if (!viewerOrbit || viewerOrbit.pointerId !== event.pointerId) return;
  viewerYaw = (
    viewerOrbit.yaw + (event.clientX - viewerOrbit.x) * 0.35 + 360
  ) % 360;
  viewerPitch = Math.max(-65, Math.min(65, viewerOrbit.pitch + (event.clientY - viewerOrbit.y) * 0.35));
  scheduleViewerRender();
});
function endViewerOrbit(event) {
  if (!viewerOrbit || viewerOrbit.pointerId !== event.pointerId) return;
  viewerOrbit = null;
  viewerStage.classList.remove("orbiting");
}
viewerStage.addEventListener("pointerup", endViewerOrbit);
viewerStage.addEventListener("pointercancel", endViewerOrbit);
viewerStage.addEventListener("dblclick", () => {
  if (viewerMode !== "2.5d") return;
  viewerYaw = 0;
  viewerPitch = 0;
  render();
});
openIntroButton.addEventListener("click", () => introDialog.showModal());
closeIntroButton.addEventListener("click", () => introDialog.close());
startExploringButton.addEventListener("click", () => introDialog.close());
introDialog.addEventListener("click", (event) => {
  if (event.target === introDialog) introDialog.close();
});
introDialog.addEventListener("close", () => {
  localStorage.setItem(introClosedStorageKey, "true");
});
openTutorialButton.addEventListener("click", () => tutorialDialog.showModal());
closeTutorialButton.addEventListener("click", () => tutorialDialog.close());
tutorialDialog.addEventListener("click", (event) => {
  if (event.target === tutorialDialog) tutorialDialog.close();
});

autoSync.addEventListener("change", () => {
  if (autoSync.checked) {
    synchronizeXpm2Editor();
    highlightXpm(source.value);
    render();
  }
});

resetButton.addEventListener("click", () => {
  void loadDemo(selectedDemo);
  source.focus();
});

function updateActiveDemo() {
  demoList.querySelectorAll(".demo-button").forEach((button, index) => {
    button.classList.toggle("active", index === activeDemo);
    button.setAttribute("aria-pressed", String(index === activeDemo));
  });
}

function setStlImportBusy(isBusy) {
  importStlButton.disabled = isBusy;
  importStlButton.setAttribute("aria-busy", String(isBusy));
  importStlButton.textContent = isBusy ? "Slicing…" : "Import STL";
  stlResolution.disabled = isBusy;
}

function makeAbortError() {
  const error = new Error("STL import cancelled.");
  error.name = "AbortError";
  return error;
}

function cancelActiveStlJob() {
  if (!activeStlJob) return;
  const job = activeStlJob;
  activeStlJob = null;
  job.worker.terminate();
  job.reject(makeAbortError());
}

function convertStlToXpm(buffer, { name, resolution, color = "#47b6b2" }) {
  cancelActiveStlJob();
  return new Promise((resolve, reject) => {
    const worker = new Worker("stl-worker.js");
    const job = { worker, reject };
    activeStlJob = job;

    const finish = (callback, value) => {
      if (activeStlJob !== job) return;
      activeStlJob = null;
      worker.terminate();
      callback(value);
    };

    worker.addEventListener("message", (event) => {
      const message = event.data;
      if (activeStlJob !== job) return;
      if (message.type === "progress") {
        status.textContent = `${message.detail} · ${Math.round(message.value * 100)}%`;
        status.classList.remove("error");
      } else if (message.type === "result") {
        finish(resolve, message);
      } else if (message.type === "error") {
        finish(reject, new Error(message.message));
      }
    });
    worker.addEventListener("error", (event) => {
      event.preventDefault();
      finish(reject, new Error(event.message || "The STL worker could not start."));
    });
    worker.postMessage(
      { buffer, name, resolution, color },
      [buffer],
    );
  });
}

function stlSummary(name, stats) {
  const dimensions = stats.dimensions.join(" × ");
  const warning = stats.oddScanlines
    ? ` · ${stats.oddScanlines.toLocaleString()} unmatched scanlines`
    : "";
  return `${name} · ${stats.triangleCount.toLocaleString()} triangles → ${dimensions} voxels${warning}`;
}

function applyStlResult(result, { name, demoIndex = -1 }) {
  activeDemo = demoIndex;
  if (demoIndex >= 0) selectedDemo = demoIndex;
  importedArtworkName = name.replace(/\.stl$/i, "") || "imported-stl";
  source.value = result.xpm;
  scaleSlider.value = "6";
  viewerDepth.value = String(result.stats.dimensions[2]);
  viewerDepthValue.textContent = `${result.stats.dimensions[2]} px`;
  highlightXpm(source.value);
  source.scrollTop = 0;
  source.scrollLeft = 0;
  syncHighlightScroll();
  setViewerMode("2.5d");
  updateActiveDemo();
  viewerModeGuide.hidden = true;
  status.textContent = stlSummary(name, result.stats);
  status.classList.remove("error");
}

async function importStlFile(file) {
  const operation = ++stlOperationVersion;
  cancelActiveStlJob();
  activeDemo = -1;
  updateActiveDemo();
  setStlImportBusy(true);
  status.textContent = `Reading ${file.name}…`;
  status.classList.remove("error");

  try {
    if (!/\.stl$/i.test(file.name)) {
      throw new Error("Choose an STL file exported by OpenSCAD or another mesh tool.");
    }
    if (file.size > 100 * 1024 * 1024) {
      throw new Error("This STL is larger than the 100 MB browser import limit.");
    }
    const buffer = await file.arrayBuffer();
    if (operation !== stlOperationVersion) return;
    const result = await convertStlToXpm(buffer, {
      name: file.name,
      resolution: Number(stlResolution.value),
    });
    if (operation !== stlOperationVersion) return;
    applyStlResult(result, { name: file.name });
  } catch (error) {
    if (error?.name !== "AbortError" && operation === stlOperationVersion) {
      status.textContent = error instanceof Error ? error.message : "Unable to import this STL.";
      status.classList.add("error");
    }
  } finally {
    if (operation === stlOperationVersion) setStlImportBusy(false);
    stlFileInput.value = "";
  }
}

async function loadDemo(index) {
  const operation = ++stlOperationVersion;
  cancelActiveStlJob();
  activeDemo = index;
  selectedDemo = index;
  const demo = demos[index];
  updateActiveDemo();
  setStlImportBusy(false);

  if (demo.xpmUrl && !demo.source) {
    status.textContent = `Loading ${demo.name}…`;
    status.classList.remove("error");
    try {
      const response = await fetch(demo.xpmUrl);
      if (!response.ok) throw new Error(`Unable to load the ${demo.name} demo.`);
      const xpm = await response.text();
      if (operation !== stlOperationVersion) return;
      demo.source = xpm;
    } catch (error) {
      if (operation === stlOperationVersion) {
        status.textContent =
          error instanceof Error ? error.message : "Unable to load this XPM demo.";
        status.classList.add("error");
      }
      return;
    }
  }

  if (demo.stlUrl && !demo.source) {
    setStlImportBusy(true);
    status.textContent = `Loading ${demo.name}…`;
    status.classList.remove("error");
    try {
      const response = await fetch(demo.stlUrl);
      if (!response.ok) throw new Error(`Unable to load the ${demo.name} demo.`);
      if (operation !== stlOperationVersion) return;
      const buffer = await response.arrayBuffer();
      if (operation !== stlOperationVersion) return;
      const result = await convertStlToXpm(buffer, {
        name: demo.stlUrl.split("/").at(-1),
        resolution: demo.stlResolution,
        color: demo.stlColor,
      });
      if (operation !== stlOperationVersion) return;
      demo.source = result.xpm;
      demo.depth = result.stats.dimensions[2];
      demo.scale = 6;
      demo.importStats = result.stats;
    } catch (error) {
      if (error?.name !== "AbortError" && operation === stlOperationVersion) {
        status.textContent = error instanceof Error ? error.message : "Unable to load this STL demo.";
        status.classList.add("error");
      }
      return;
    } finally {
      if (operation === stlOperationVersion) setStlImportBusy(false);
    }
  }

  if (operation !== stlOperationVersion) return;
  source.value = demo.source;
  scaleSlider.value = String(demo.scale || 16);
  if (demo.depth !== undefined) {
    viewerDepth.value = String(demo.depth);
    viewerDepthValue.textContent = `${demo.depth} px`;
  }
  highlightXpm(source.value);
  source.scrollTop = 0;
  source.scrollLeft = 0;
  syncHighlightScroll();
  if (demo.mode) {
    setViewerMode(demo.mode);
  } else {
    render();
  }
  updateActiveDemo();
  viewerModeGuide.hidden =
    demo.id !== "extruded-box" || hasUsed25dMode;
  if (demo.importStats) {
    status.textContent = stlSummary(demo.name, demo.importStats);
    status.classList.remove("error");
  }
}

importStlButton.addEventListener("click", () => stlFileInput.click());
stlFileInput.addEventListener("change", () => {
  const [file] = stlFileInput.files;
  if (file) void importStlFile(file);
});

let renderedDemoCategory = "";
demos.forEach((demo, index) => {
  if (demo.category !== renderedDemoCategory) {
    renderedDemoCategory = demo.category;
    const heading = document.createElement("p");
    heading.className = "demo-group-heading";
    heading.textContent = renderedDemoCategory;
    demoList.append(heading);
  }
  const button = document.createElement("button");
  button.className = "demo-button";
  button.type = "button";
  button.innerHTML = `
    <span class="demo-name">${demo.name}</span>
    <span class="demo-feature">${demo.feature}</span>
  `;
  button.addEventListener("click", () => void loadDemo(index));
  demoList.append(button);
});

void loadDemo(0);
if (localStorage.getItem(introClosedStorageKey) !== "true") {
  introDialog.showModal();
}

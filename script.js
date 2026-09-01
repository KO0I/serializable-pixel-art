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
    name: "Manual plaid",
    feature: "2-character keys",
    source: manualExample,
  },
  {
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
];

const source = document.querySelector("#xpm-source");
const highlight = document.querySelector("#xpm-highlight code");
const highlightLayer = document.querySelector("#xpm-highlight");
const canvas = document.querySelector("#xpm-canvas");
const status = document.querySelector("#editor-status");
const meta = document.querySelector("#image-meta");
const resetButton = document.querySelector("#reset-button");
const autoSync = document.querySelector("#auto-sync");
const demoList = document.querySelector("#demo-list");
const scaleSlider = document.querySelector("#scale-slider");
const scaleValue = document.querySelector("#scale-value");
const exportSvgButton = document.querySelector("#export-svg");
const exportXpmButton = document.querySelector("#export-xpm");
const mode2dButton = document.querySelector("#mode-2d");
const mode25dButton = document.querySelector("#mode-25d");
const viewerModeGuide = document.querySelector("#viewer-mode-guide");
const viewerDepthControl = document.querySelector("#viewer-depth-control");
const viewerDepth = document.querySelector("#viewer-depth");
const viewerDepthValue = document.querySelector("#viewer-depth-value");
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
let activeDemo = 0;
let selectedDemo = 0;
let viewerMode = "2d";
let viewerYaw = 28;
let viewerPitch = -18;
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
  const [red, green, blue] = colorProbe.getImageData(0, 0, 1, 1).data;
  const luminance = 0.2126 * red + 0.7152 * green + 0.0722 * blue;

  return {
    fill: fromBlack,
    ink: luminance > 150 ? "#171714" : "#ffffff",
    rgb: [red, green, blue],
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

  return { width, height, colorCount, cpp, colors, pixels };
}

function shadeViewerColor(color, amount) {
  const parsed = getPixelColors(color);
  if (!parsed) {
    return color;
  }
  return `rgb(${parsed.rgb.map((channel) => Math.round(channel * amount)).join(" ")})`;
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

function renderExtrudedXpm(image) {
  const depth = Number(viewerDepth.value);
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
  canvas.width = cameraSize;
  canvas.height = cameraSize;
  context.clearRect(0, 0, canvas.width, canvas.height);
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
    const demoName = activeDemo >= 0 ? demos[activeDemo].name : "xpm-artwork";

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
    parseXpm(source.value);
    const xpm = viewerMode === "2.5d" ? cameraCanvasToXpm() : source.value;
    const demoName = activeDemo >= 0 ? demos[activeDemo].name : "xpm-artwork";
    const suffix = viewerMode === "2.5d" ? "-camera" : "";
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
        ? `${image.width} × ${image.height} source · ${viewerDepth.value}px depth`
        : `${image.width} × ${image.height} · ${image.colorCount} colors`;
    status.textContent = "Valid XPM — preview updated";
    status.classList.remove("error");
  } catch (error) {
    status.textContent = error instanceof Error ? error.message : "Unable to parse XPM.";
    status.classList.add("error");
  }
}

let renderTimer;
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
  render();
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

mode2dButton.addEventListener("click", () => setViewerMode("2d"));
mode25dButton.addEventListener("click", () => {
  hasUsed25dMode = true;
  localStorage.setItem(viewerModeUsedStorageKey, "true");
  viewerModeGuide.hidden = true;
  setViewerMode("2.5d");
});

let viewerOrbit = null;
viewerStage.addEventListener("pointerdown", (event) => {
  if (viewerMode !== "2.5d" || event.button !== 0) return;
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
  viewerYaw = Math.max(-80, Math.min(80, viewerOrbit.yaw + (event.clientX - viewerOrbit.x) * 0.35));
  viewerPitch = Math.max(-65, Math.min(65, viewerOrbit.pitch + (event.clientY - viewerOrbit.y) * 0.35));
  render();
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
  loadDemo(selectedDemo);
  source.focus();
});

function updateActiveDemo() {
  demoList.querySelectorAll(".demo-button").forEach((button, index) => {
    button.classList.toggle("active", index === activeDemo);
    button.setAttribute("aria-pressed", String(index === activeDemo));
  });
}

function loadDemo(index) {
  activeDemo = index;
  selectedDemo = index;
  source.value = demos[index].source;
  scaleSlider.value = String(demos[index].scale || 16);
  if (demos[index].depth !== undefined) {
    viewerDepth.value = String(demos[index].depth);
    viewerDepthValue.textContent = `${demos[index].depth} px`;
  }
  highlightXpm(source.value);
  source.scrollTop = 0;
  source.scrollLeft = 0;
  syncHighlightScroll();
  render();
  updateActiveDemo();
  viewerModeGuide.hidden =
    demos[index].id !== "extruded-box" || hasUsed25dMode;
}

demos.forEach((demo, index) => {
  const button = document.createElement("button");
  button.className = "demo-button";
  button.type = "button";
  button.innerHTML = `
    <span class="demo-name">${demo.name}</span>
    <span class="demo-feature">${demo.feature}</span>
  `;
  button.addEventListener("click", () => loadDemo(index));
  demoList.append(button);
});

loadDemo(0);
if (localStorage.getItem(introClosedStorageKey) !== "true") {
  introDialog.showModal();
}

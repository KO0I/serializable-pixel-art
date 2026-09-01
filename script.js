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

function xpm3ToXpm2(input) {
  const strings = [];
  const quotedString = /"((?:\\.|[^"\\])*)"/g;
  let match;

  while ((match = quotedString.exec(input)) !== null) {
    strings.push(JSON.parse(`"${match[1]}"`));
  }

  const [width, height, colorCount, cpp] = strings[0]
    .trim()
    .split(/\s+/)
    .slice(0, 4)
    .map(Number);
  const rows = strings.slice(colorCount + 1, colorCount + 1 + height);
  const backgroundSymbol = rows[0].slice(0, cpp);
  let minX = width;
  let minY = height;
  let maxX = -1;
  let maxY = -1;

  rows.forEach((row, y) => {
    for (let x = 0; x < width; x += 1) {
      if (row.slice(x * cpp, (x + 1) * cpp) !== backgroundSymbol) {
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      }
    }
  });

  const margin = 2;
  minX = Math.max(0, minX - margin);
  minY = Math.max(0, minY - margin);
  maxX = Math.min(width - 1, maxX + margin);
  maxY = Math.min(height - 1, maxY + margin);
  const croppedRows = rows
    .slice(minY, maxY + 1)
    .map((row) => row.slice(minX * cpp, (maxX + 1) * cpp));
  const croppedHeader = `${maxX - minX + 1} ${maxY - minY + 1} ${colorCount} ${cpp}`;

  return [
    "! XPM2",
    "! Converted from the user-provided PNG with ImageMagick 7",
    "! 96px resize, trimmed background, 63-color palette, no dithering",
    croppedHeader,
    "! colors",
    ...strings.slice(1, colorCount + 1),
    "! pixels",
    ...croppedRows,
  ].join("\n");
}

const demos = [
  {
    name: "Manual plaid",
    feature: "2-character keys",
    source: manualExample,
  },
  {
    name: "Happy computer",
    feature: "ImageMagick conversion",
    source: `    ! XPM2
    ! Converted from the user-provided PNG with ImageMagick 7
    ! 48px resize, flattened background, 24-color palette, no dithering
    48 48 24 1
    ! colors
      c #040A0B
    . c #1F1E24
    X c #3E4339
    o c #66304A
    O c #574D50
    + c #6F5B61
    @ c #D83870
    # c #8B6572
    $ c #A99A58
    % c #A57A89
    & c #E17396
    * c #2FC4BD
    = c #18E3D4
    - c #2EE7D9
    ; c #2FF8E7
    : c #949292
    > c #B28B97
    , c #AAA4A6
    < c #D8A1AC
    1 c #F6E5A6
    2 c #F2B5C9
    3 c #E0B3DE
    4 c #E5C6CE
    5 c #FFFEF5
    ! pixels
    555555555555555555555555555555555555555555555555
    555555555555555555555555555555555555555555555555
    555555555555555555555555555555555555555555555555
    555555555555555555555555555555555555555555555555
    555555555555555555555555555555555555555555555555
    555555555555555555555555555555555555555555555555
    555555555555555555555555555555555555555555555555
    555555553555555555555555555533555555555555555555
    555555333355555555555555555555555555555555555555
    555555553555555555555555555555555555555555555555
    555555555555555555555555555555555555555555555555
    555555555555555535555555555555555555555555555555
    555555555555555555555555555555555555555555555555
    555555555554,,,::,,,:,,,,,,,,,,:,555555555555555
    55535555554+O++O+++O++++++++++++++55555555555555
    555355555:#55445555555555552<<<<5:+5555555555555
    555555555O25>+<542224242222>....#5O,555335555555
    55555555:+2%O5555555555555555555#>+:555555555555
    55555555:o2o%525>>>>>>>>>>%>>455<O+,555555555555
    55555555:o2o:55+ ............ <5>oXO:55555555555
    55555555:o2o:5+.;;;;;;;;;;;;;* X. X#O+5555555555
    55555555:o2o:5.*;=-----------; $1$51$O5555555555
    55555555:o2o%5.*;------------= $<<&@$X5555555555
    55555555:o2o%5.*;------------; +<@@@1X5555555555
    55555555:o2#>5.*;-= ----;.X;-; X5&@11X5555555555
    55555555:o2#%5.*;--:--;;-**;-;  11111O:555555555
    55555535:o3o#5.*;---;X*X*;---=.X$+OXXO5555555555
    55555535:o3o:5.*;----*X*-----; >O .:555555555555
    55555555:o3o:5.*;-----;;-----; <2O#,555555555555
    55555555:o2o%5.*;------------; <4O+,555555555555
    555555554O2o#5+ =============X 54+#,555555555555
    555555555+&+%55#              22<O#,555555555555
    5555555554+o:52<2555242222224422>+#,555535555555
    55555555554 .<4+2244222442244+%2o>+5555555555555
    5553555555,.>. .   ...........  O+45555555555555
    555555555,o.###5#<<45555552+o2<+5455555555555555
    55555555,o2<o .#+oo######O+OX+o 4555555555555555
    55555555+#22###%#+##::::#+####::O:55555555555555
    55555555+o2#>5254525555525+4O,#>5O,5535555555555
    55555555Oo&X222>4,455425#>#+OO# 45O5555555555555
    555555554+.4555<5,5555554,544>2%55,+555555555555
    5555555555 >>>%%%<>>>%%%>>%>><>>%>++555555555555
    5555555555,XOOOOOOOOOOOOOOOOOO+OOO+5555555555555
    555555555555555555555555555555555555555555555555
    555555555555555555555555555555555555555555555555
    555555555555555555555555555555555555555555555555
    555555555555555555555555555555555555555555555555
    555555555555555555555555555555555555555555555555`.replace(/^ {4}/gm, ""),
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
];

if (window.HAPPY_COMPUTER_XPM) {
  demos[1].source = xpm3ToXpm2(window.HAPPY_COMPUTER_XPM);
  demos[1].feature = "high-fidelity conversion";
  demos[1].scale = 4;
}

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
const context = canvas.getContext("2d");
const colorProbe = document.createElement("canvas").getContext("2d");
let activeDemo = 0;
let selectedDemo = 0;

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

function exportSvg() {
  try {
    const image = parseXpm(source.value);
    const svg = createSvg(image, Number(scaleSlider.value));
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

function render() {
  try {
    const image = parseXpm(source.value);
    canvas.width = image.width;
    canvas.height = image.height;
    updateCanvasScale();
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

    meta.textContent = `${image.width} × ${image.height} · ${image.colorCount} colors`;
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
  highlightXpm(source.value);
  source.scrollTop = 0;
  source.scrollLeft = 0;
  syncHighlightScroll();
  render();
  updateActiveDemo();
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

loadDemo(1);

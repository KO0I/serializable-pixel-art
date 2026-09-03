const form = document.querySelector("#command-form");
const input = document.querySelector("#command-input");
const history = document.querySelector("#terminal-history");
const canvas = document.querySelector("#command-canvas");
const context = canvas.getContext("2d");
const layerList = document.querySelector("#layer-list");
const autocomplete = document.querySelector("#command-autocomplete");
const expressionPreview = document.querySelector("#expression-preview");
const displayScaleInput = document.querySelector("#display-scale");
const displayScaleValue = document.querySelector("#display-scale-value");
const viewerCanvasWrap = document.querySelector(".viewer-canvas-scroll");
const resetLayersButton = document.querySelector("#reset-layers");
const colorList = document.querySelector("#color-list");
const defaultColorLabel = document.querySelector("#default-color");
const backgroundColorLabel = document.querySelector("#background-color");
const commandIntroDialog = document.querySelector("#command-intro-dialog");
const openCommandIntroButton = document.querySelector("#open-command-intro");
const closeCommandIntroButton = document.querySelector("#close-command-intro");
const startCommandExploringButton = document.querySelector(
  "#start-command-exploring",
);
const commandIntroPreview = document.querySelector("#command-intro-preview");
const maxSideLength = 256;
const historyStorageKey = "serialized-art-command-history-v2";
const layerStateStorageKey = "serialized-art-layer-state-v1";
const displayScaleStorageKey = "serialized-art-display-scale-v1";
const colorStorageKey = "serialized-art-colors-v1";
const defaultColorStorageKey = "serialized-art-default-color-v1";
const backgroundColorStorageKey = "serialized-art-background-color-v1";
const commandIntroClosedStorageKey = "serialized-art-command-intro-closed-v1";
const layers = [];
const customColors = new Map();
let nextSquareId = 1;
let nextCircleId = 1;
let nextRectId = 1;
let nextPixelsId = 1;
let nextOutlineId = 1;
let nextGroupId = 1;
let nextCreationOrder = 1;
let displayScale = 2;
let defaultColor = {
  color: "#000000",
  reference: null,
  label: "black",
};
let backgroundColor = {
  color: "transparent",
  reference: null,
  label: "none",
};
let pointerDrag = null;
let shapeDrag = null;
const commandHistory = [];
let historyIndex = 0;
let historyDraft = "";
let autocompleteIndex = -1;
let autocompleteSuppressed = false;

function saveHistory() {
  localStorage.setItem(historyStorageKey, JSON.stringify(commandHistory));
}

function rememberCommand(command) {
  for (let index = commandHistory.length - 1; index >= 0; index -= 1) {
    if (commandHistory[index] === command) commandHistory.splice(index, 1);
  }
  commandHistory.push(command);
  historyIndex = commandHistory.length;
  historyDraft = "";
  saveHistory();
}

function appendMessage(command, message, isError = false) {
  const entry = document.createElement("p");
  entry.className = `terminal-message${isError ? " error" : ""}`;
  entry.textContent = command ? `> ${command}\n${message}` : message;
  history.append(entry);
  history.scrollTop = history.scrollHeight;
}

function renderCommandIntroPreview() {
  const previewContext = commandIntroPreview.getContext("2d");
  previewContext.clearRect(
    0,
    0,
    commandIntroPreview.width,
    commandIntroPreview.height,
  );
  const fillPoints = (points, color, offsetX = 0, offsetY = 0) => {
    previewContext.fillStyle = color;
    points.forEach((key) => {
      const [x, y] = key.split(",").map(Number);
      previewContext.fillRect(x + offsetX, y + offsetY, 1, 1);
    });
  };

  fillPoints(circlePixelSet(12), "#ffd84d");
  const outer = circlePixelSet(10);
  const inner = circlePixelSet(8);
  fillPoints(
    new Set(
      [...outer].filter((key) => {
        const [x, y] = key.split(",").map(Number);
        return !inner.has(`${x - 1},${y - 1}`);
      }),
    ),
    "#000000",
    1,
    1,
  );
  previewContext.fillStyle = "#000000";
  previewContext.fillRect(4, 4, 1, 1);
  previewContext.fillRect(7, 4, 1, 1);
  previewContext.fillStyle = "#f28c28";
  [[4, 6], [7, 6], [5, 7], [6, 7]].forEach(([x, y]) => {
    previewContext.fillRect(x, y, 1, 1);
  });
}

function setupCommandLibrary() {
  const cards = [...document.querySelectorAll(".command-card")];

  function setCardOpen(card, isOpen) {
    const title = card.querySelector(".command-card-title");
    const body = card.querySelector(".command-card-body");
    card.classList.toggle("is-open", isOpen);
    title.setAttribute("aria-expanded", String(isOpen));
    body.hidden = !isOpen;
  }

  cards.forEach((card, index) => {
    const title = card.querySelector(".command-card-title");
    const body = document.createElement("div");
    body.className = "command-card-body";
    body.id = `command-card-body-${index + 1}`;

    while (title.nextSibling) {
      body.append(title.nextSibling);
    }
    card.append(body);

    title.setAttribute("role", "button");
    title.setAttribute("tabindex", "0");
    title.setAttribute("aria-controls", body.id);

    const toggle = () => {
      const shouldOpen = !card.classList.contains("is-open");
      cards.forEach((otherCard) => setCardOpen(otherCard, false));
      if (shouldOpen) setCardOpen(card, true);
    };

    title.addEventListener("click", toggle);
    title.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      toggle();
    });

    setCardOpen(card, index === 0);
  });
}

function restoreHistory() {
  const serialized = localStorage.getItem(historyStorageKey);
  if (!serialized) return;
  let stored;
  try {
    stored = JSON.parse(serialized);
  } catch {
    localStorage.removeItem(historyStorageKey);
    history.replaceChildren();
    appendMessage("", "Stored command history was invalid and has been reset.", true);
    return;
  }
  const storedCommands = Array.isArray(stored)
    ? stored
    : Array.isArray(stored?.commands)
      ? stored.commands
      : null;
  if (!storedCommands) {
    localStorage.removeItem(historyStorageKey);
    appendMessage("", "Stored command history was invalid and has been reset.", true);
    return;
  }
  storedCommands
    .filter((command) => typeof command === "string")
    .forEach((command) => {
      const existingIndex = commandHistory.indexOf(command);
      if (existingIndex !== -1) commandHistory.splice(existingIndex, 1);
      commandHistory.push(command);
    });
  historyIndex = commandHistory.length;
  saveHistory();
}

function saveLayerState() {
  localStorage.setItem(
    layerStateStorageKey,
    JSON.stringify({
      version: 2,
      layers,
      canvasWidth: canvas.width,
      canvasHeight: canvas.height,
      nextSquareId,
      nextCircleId,
      nextRectId,
      nextPixelsId,
      nextOutlineId,
      nextGroupId,
      nextCreationOrder,
    }),
  );
}

function restoreLayerState() {
  const serialized = localStorage.getItem(layerStateStorageKey);
  if (!serialized) return;
  let stored;
  try {
    stored = JSON.parse(serialized);
  } catch {
    localStorage.removeItem(layerStateStorageKey);
    appendMessage("", "Stored layer state was invalid and has been reset.", true);
    return;
  }
  const validRotation = (layer) =>
    (
      layer.rotation === undefined ||
      (
        Number.isInteger(layer.rotation) &&
        layer.rotation >= 0 &&
        layer.rotation < 360
      )
    );
  const validVisualLayer = (layer) =>
    typeof layer.color === "string" &&
    (layer.colorReference === undefined ||
      layer.colorReference === null ||
      typeof layer.colorReference === "string");
  const validRadius = (layer, width, height) =>
    layer.radius === undefined ||
    (
      Number.isInteger(layer.radius) &&
      layer.radius >= 0 &&
      layer.radius <= Math.floor(Math.min(width, height) / 2)
    );
  const validLayer = (layer) => {
    const validGeometry =
      (
        layer.type === "square" &&
        Number.isInteger(layer.sideLength) &&
        layer.sideLength > 0 &&
        validRadius(layer, layer.sideLength, layer.sideLength)
      ) ||
      (
        layer.type === "circle" &&
        Number.isInteger(layer.diameter) &&
        layer.diameter > 0
      ) ||
      (
        layer.type === "rectangle" &&
        Number.isInteger(layer.width) &&
        layer.width > 0 &&
        Number.isInteger(layer.height) &&
        layer.height > 0 &&
        validRadius(layer, layer.width, layer.height)
      ) ||
      (
        layer.type === "pixels" &&
        Number.isInteger(layer.width) &&
        layer.width > 0 &&
        Number.isInteger(layer.height) &&
        layer.height > 0 &&
        Array.isArray(layer.points) &&
        layer.points.every((point) =>
          Number.isInteger(point?.x) &&
          point.x >= 0 &&
          Number.isInteger(point?.y) &&
          point.y >= 0
        )
      ) ||
      (
        layer.type === "group" &&
        Number.isInteger(layer.width) &&
        layer.width >= 0 &&
        Number.isInteger(layer.height) &&
        layer.height >= 0 &&
        Array.isArray(layer.memberIds) &&
        layer.memberIds.every((id) => typeof id === "string")
      )
    ;
    return (
      typeof layer?.id === "string" &&
      validGeometry &&
      validRotation(layer) &&
      (layer.type === "group" || validVisualLayer(layer)) &&
      Number.isInteger(layer.x) &&
      Number.isInteger(layer.y) &&
      Number.isInteger(layer.zIndex) &&
      Number.isInteger(layer.creationOrder)
    );
  };
  const storedNextCircleId = stored.nextCircleId ?? 1;
  const storedNextRectId = stored.nextRectId ?? 1;
  const storedNextPixelsId = stored.nextPixelsId ?? 1;
  const storedNextOutlineId = stored.nextOutlineId ?? 1;
  const storedNextGroupId = stored.nextGroupId ?? 1;
  const valid =
    Array.isArray(stored.layers) &&
    stored.layers.every(validLayer) &&
    stored.layers
      .filter((layer) => layer.type === "group")
      .every((group) =>
        group.memberIds.every((id) =>
          id !== group.id && stored.layers.some((layer) => layer.id === id)
        )
      ) &&
    Number.isInteger(stored.canvasWidth) &&
    stored.canvasWidth > 0 &&
    Number.isInteger(stored.canvasHeight) &&
    stored.canvasHeight > 0 &&
    Number.isInteger(stored.nextSquareId) &&
    stored.nextSquareId > 0 &&
    Number.isInteger(storedNextCircleId) &&
    storedNextCircleId > 0 &&
    Number.isInteger(storedNextRectId) &&
    storedNextRectId > 0 &&
    Number.isInteger(storedNextPixelsId) &&
    storedNextPixelsId > 0 &&
    Number.isInteger(storedNextOutlineId) &&
    storedNextOutlineId > 0 &&
    Number.isInteger(storedNextGroupId) &&
    storedNextGroupId > 0 &&
    Number.isInteger(stored.nextCreationOrder) &&
    stored.nextCreationOrder > 0 &&
    new Set(stored.layers.map((layer) => layer.id)).size === stored.layers.length;
  if (!valid) {
    localStorage.removeItem(layerStateStorageKey);
    appendMessage("", "Stored layer state was invalid and has been reset.", true);
    return;
  }
  const needsCoordinateMigration = stored.version !== 2;
  const needsRadiusMigration = stored.layers.some(
    (layer) =>
      (layer.type === "square" || layer.type === "rectangle") &&
      layer.radius === undefined,
  );
  const needsRotationMigration = stored.layers.some(
    (layer) => layer.rotation === undefined,
  );
  layers.push(...stored.layers);
  layers.forEach((layer) => {
    if (layer.rotation === undefined) {
      layer.rotation = 0;
    }
    if (
      (layer.type === "square" || layer.type === "rectangle") &&
      layer.radius === undefined
    ) {
      layer.radius = 0;
    }
  });
  canvas.width = stored.canvasWidth;
  canvas.height = stored.canvasHeight;
  nextSquareId = stored.nextSquareId;
  nextCircleId = storedNextCircleId;
  nextRectId = storedNextRectId;
  nextPixelsId = storedNextPixelsId;
  nextOutlineId = storedNextOutlineId;
  nextGroupId = storedNextGroupId;
  nextCreationOrder = stored.nextCreationOrder;
  if (needsCoordinateMigration) {
    normalizeLayerCoordinates();
  }
  if (
    needsCoordinateMigration ||
    needsRadiusMigration ||
    needsRotationMigration
  ) {
    saveLayerState();
  }
  renderLayers();
}

function restoreDisplayScale() {
  const stored = Number(localStorage.getItem(displayScaleStorageKey));
  if (!Number.isInteger(stored) || stored < 2 || stored > 32) return;
  displayScale = stored;
  displayScaleInput.value = stored;
  displayScaleValue.textContent = `${stored}×`;
}

function saveColors() {
  localStorage.setItem(
    colorStorageKey,
    JSON.stringify(Object.fromEntries(customColors)),
  );
}

function saveDefaultColor() {
  localStorage.setItem(defaultColorStorageKey, JSON.stringify(defaultColor));
}

function renderDefaultColor() {
  defaultColorLabel.textContent = `Default: ${defaultColor.label}`;
  defaultColorLabel.style.setProperty("--default-color", defaultColor.color);
}

function saveBackgroundColor() {
  localStorage.setItem(
    backgroundColorStorageKey,
    JSON.stringify(backgroundColor),
  );
}

function renderBackgroundColor() {
  canvas.style.backgroundColor = backgroundColor.color;
  backgroundColorLabel.textContent = `Background: ${backgroundColor.label}`;
  backgroundColorLabel.style.setProperty(
    "--default-color",
    backgroundColor.color,
  );
}

function renderColorList() {
  colorList.replaceChildren();
  if (!customColors.size) {
    const empty = document.createElement("p");
    empty.className = "empty-colors";
    empty.textContent = "No custom colors yet.";
    colorList.append(empty);
    return;
  }
  customColors.forEach((color, name) => {
    const row = document.createElement("div");
    row.className = "color-row";
    const swatch = document.createElement("span");
    swatch.className = "color-swatch";
    swatch.style.background = color;
    const label = document.createElement("code");
    label.textContent = name;
    const value = document.createElement("span");
    value.textContent = color;
    row.append(swatch, label, value);
    colorList.append(row);
  });
}

function restoreColors() {
  const serialized = localStorage.getItem(colorStorageKey);
  if (!serialized) return;
  let stored;
  try {
    stored = JSON.parse(serialized);
  } catch {
    localStorage.removeItem(colorStorageKey);
    appendMessage("", "Stored custom colors were invalid and have been reset.", true);
    return;
  }
  if (!stored || Array.isArray(stored) || typeof stored !== "object") {
    localStorage.removeItem(colorStorageKey);
    appendMessage("", "Stored custom colors were invalid and have been reset.", true);
    return;
  }
  try {
    Object.entries(stored).forEach(([name, color]) => {
      if (!/^[a-z][a-z0-9-]*$/i.test(name) || typeof color !== "string") {
        throw new Error("Invalid stored color.");
      }
      customColors.set(name.toLowerCase(), normalizeCssColor(color));
    });
  } catch {
    customColors.clear();
    localStorage.removeItem(colorStorageKey);
    appendMessage("", "Stored custom colors were invalid and have been reset.", true);
  }
  renderColorList();
}

function restoreDefaultColor() {
  const serialized = localStorage.getItem(defaultColorStorageKey);
  if (!serialized) {
    renderDefaultColor();
    return;
  }
  let stored;
  try {
    stored = JSON.parse(serialized);
    if (
      typeof stored?.color !== "string" ||
      (stored.reference !== null && typeof stored.reference !== "string") ||
      typeof stored.label !== "string"
    ) {
      throw new Error("Invalid default color.");
    }
    const color = stored.reference
      ? customColors.get(stored.reference)
      : normalizeCssColor(stored.color);
    if (!color) throw new Error("Missing referenced color.");
    defaultColor = {
      color,
      reference: stored.reference,
      label: stored.label,
    };
  } catch {
    localStorage.removeItem(defaultColorStorageKey);
    appendMessage("", "Stored default color was invalid and has been reset.", true);
  }
  renderDefaultColor();
}

function restoreBackgroundColor() {
  const serialized = localStorage.getItem(backgroundColorStorageKey);
  if (!serialized) {
    renderBackgroundColor();
    return;
  }
  try {
    const stored = JSON.parse(serialized);
    if (
      typeof stored?.color !== "string" ||
      (stored.reference !== null && typeof stored.reference !== "string") ||
      typeof stored.label !== "string"
    ) {
      throw new Error("Invalid background color.");
    }
    const color = stored.reference
      ? customColors.get(stored.reference)
      : stored.color === "transparent"
        ? "transparent"
        : normalizeCssColor(stored.color);
    if (!color) throw new Error("Missing referenced color.");
    backgroundColor = {
      color,
      reference: stored.reference,
      label: stored.label,
    };
  } catch {
    localStorage.removeItem(backgroundColorStorageKey);
    appendMessage("", "Stored background color was invalid and has been reset.", true);
  }
  renderBackgroundColor();
}

function normalizeCssColor(value) {
  const probe = document.createElement("canvas").getContext("2d");
  probe.fillStyle = "#000000";
  probe.fillStyle = value;
  const fromBlack = probe.fillStyle;
  probe.fillStyle = "#ffffff";
  probe.fillStyle = value;
  if (fromBlack !== probe.fillStyle) {
    throw new Error(`Unknown color "${value}".`);
  }
  return fromBlack;
}

function resolveColor(value) {
  const reference = value.startsWith("$") ? value.slice(1) : value;
  const custom = customColors.get(reference.toLowerCase());
  return custom
    ? { color: custom, reference: reference.toLowerCase() }
    : { color: normalizeCssColor(value), reference: null };
}

function orderedLayers() {
  return [...layers].sort(
    (left, right) =>
      left.zIndex - right.zIndex ||
      left.creationOrder - right.creationOrder,
  );
}

function commitLayerOrder(displayed) {
  const changes = displayed.flatMap((idValue, index) => {
    const layer = layers.find((item) => item.id === idValue);
    const desiredZIndex = displayed.length - 1 - index;
    const amount = desiredZIndex - layer.zIndex;
    return amount === 0 ? [] : [{ layer, amount }];
  });
  if (!changes.length) {
    renderLayerList();
    return;
  }
  changes.forEach(({ layer, amount }) => {
    dispatchCommand(
      `chz ${layer.id} ${amount >= 0 ? "+" : ""}${amount}`,
      false,
    );
  });
}

function renderLayerList() {
  layerList.replaceChildren();
  if (!layers.length) {
    const empty = document.createElement("p");
    empty.className = "empty-layers";
    empty.textContent = "No layers yet.";
    layerList.append(empty);
    return;
  }
  [...orderedLayers()].reverse().forEach((layer) => {
    const row = document.createElement("div");
    row.className = "layer-row";
    row.dataset.layerId = layer.id;
    const handle = document.createElement("span");
    handle.className = "layer-drag-handle";
    handle.textContent = "::";
    handle.setAttribute("aria-label", `Drag ${layer.id} to reorder`);
    const id = document.createElement("code");
    id.textContent = layer.id;
    const details = document.createElement("span");
    const radius =
      (layer.type === "square" || layer.type === "rectangle") && layer.radius
        ? ` r${layer.radius}`
        : "";
    const rotation = layer.rotation
      ? ` ${layer.rotation}deg`
      : "";
    details.textContent = `${layer.type}${radius}${rotation} (${layer.x}, ${layer.y})`;
    const zInput = document.createElement("input");
    zInput.type = "number";
    zInput.value = layer.zIndex;
    zInput.setAttribute("aria-label", `${layer.id} z-index`);
    zInput.addEventListener("change", () => {
      const zIndex = Number(zInput.value);
      if (!Number.isInteger(zIndex)) {
        zInput.value = layer.zIndex;
        return;
      }
      const amount = zIndex - layer.zIndex;
      if (amount === 0) return;
      dispatchCommand(
        `chz ${layer.id} ${amount >= 0 ? "+" : ""}${amount}`,
        false,
      );
    });
    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "layer-delete";
    deleteButton.textContent = "x";
    deleteButton.setAttribute("aria-label", `Delete ${layer.id}`);
    deleteButton.addEventListener("click", () => {
      dispatchCommand(`delete ${layer.id}`, false);
    });
    row.addEventListener("pointerdown", (event) => {
      if (event.target.closest("input, button")) return;
      event.preventDefault();
      pointerDrag = {
        pointerId: event.pointerId,
        row,
        startX: event.clientX,
        startY: event.clientY,
        active: false,
      };
    });
    row.append(handle, id, details, zInput, deleteButton);
    layerList.append(row);
  });
}

function updatePointerDrag(event) {
  if (!pointerDrag || pointerDrag.pointerId !== event.pointerId) return;
  if (!pointerDrag.active) {
    const distance = Math.hypot(
      event.clientX - pointerDrag.startX,
      event.clientY - pointerDrag.startY,
    );
    if (distance < 4) return;
    pointerDrag.active = true;
    pointerDrag.row.classList.add("dragging");
  }
  const target = document.elementsFromPoint(event.clientX, event.clientY)
    .map((element) => element.closest?.(".layer-row"))
    .find((row) => row && row !== pointerDrag.row && layerList.contains(row));
  if (!target) return;
  const bounds = target.getBoundingClientRect();
  if (event.clientY < bounds.top + bounds.height / 2) {
    layerList.insertBefore(pointerDrag.row, target);
  } else {
    target.after(pointerDrag.row);
  }
}

function finishPointerDrag(event) {
  if (!pointerDrag || pointerDrag.pointerId !== event.pointerId) return;
  const displayed = [...layerList.querySelectorAll(".layer-row")]
    .map((item) => item.dataset.layerId);
  const {
    active,
    row,
  } = pointerDrag;
  pointerDrag = null;
  row.classList.remove("dragging");
  if (!active) return;
  commitLayerOrder(displayed);
}

window.addEventListener("pointermove", updatePointerDrag);
window.addEventListener("pointerup", finishPointerDrag);
window.addEventListener("pointercancel", finishPointerDrag);

function renderLayers() {
  refreshGroupBounds();
  context.clearRect(0, 0, canvas.width, canvas.height);
  orderedLayers().forEach((layer) => {
    if (layer.type === "group") return;
    context.fillStyle = layer.color;
    const drawX = layer.x;
    const drawY = layer.y;
    if ((layer.rotation ?? 0) !== 0) {
      rotatedLayerPoints(layer).forEach((point) => {
        context.fillRect(drawX + point.x, drawY + point.y, 1, 1);
      });
      return;
    }
    if (layer.type === "square") {
      drawPixelRectangle(
        drawX,
        drawY,
        layer.sideLength,
        layer.sideLength,
        layer.radius,
      );
      return;
    }
    if (layer.type === "rectangle") {
      drawPixelRectangle(
        drawX,
        drawY,
        layer.width,
        layer.height,
        layer.radius,
      );
      return;
    }
    if (layer.type === "circle") {
      const radius = layer.diameter / 2;
      for (let y = 0; y < layer.diameter; y += 1) {
        for (let x = 0; x < layer.diameter; x += 1) {
          const dx = x + 0.5 - radius;
          const dy = y + 0.5 - radius;
          if (dx * dx + dy * dy <= radius * radius) {
            context.fillRect(drawX + x, drawY + y, 1, 1);
          }
        }
      }
      return;
    }
    layer.points.forEach((point) => {
      context.fillRect(drawX + point.x, drawY + point.y, 1, 1);
    });
  });
  renderLayerList();
  applyCanvasScale();
  renderExpressionPreview();
}

function roundedRectangleContains(x, y, width, height, radius) {
  if (radius <= 0) return true;
  const centerX =
    x < radius ? radius : x >= width - radius ? width - radius : null;
  const centerY =
    y < radius ? radius : y >= height - radius ? height - radius : null;
  if (centerX === null || centerY === null) return true;
  const dx = x + 0.5 - centerX;
  const dy = y + 0.5 - centerY;
  return dx * dx + dy * dy <= radius * radius;
}

function drawPixelRectangle(drawX, drawY, width, height, radius = 0) {
  if (radius === 0) {
    context.fillRect(drawX, drawY, width, height);
    return;
  }
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      if (roundedRectangleContains(x, y, width, height, radius)) {
        context.fillRect(drawX + x, drawY + y, 1, 1);
      }
    }
  }
}

function rotatedLayerPoints(layer) {
  const width = layerBaseWidth(layer);
  const height = layerBaseHeight(layer);
  const rotation = layer.rotation ?? 0;
  const sourcePoints = layerPixelSet(layer);
  if (rotation === 0 || layer.type === "circle") {
    return [...sourcePoints].map((key) => {
      const [x, y] = key.split(",").map(Number);
      return { x, y };
    });
  }

  const radians = rotation * Math.PI / 180;
  const cosine = Math.cos(radians);
  const sine = Math.sin(radians);
  const dimensions = rotatedLayerDimensions(layer);
  const points = [];
  for (let y = 0; y < dimensions.height; y += 1) {
    for (let x = 0; x < dimensions.width; x += 1) {
      const outputX = x + 0.5 - dimensions.width / 2;
      const outputY = y + 0.5 - dimensions.height / 2;
      const sourceX = cosine * outputX + sine * outputY + width / 2;
      const sourceY = -sine * outputX + cosine * outputY + height / 2;
      const pixelX = Math.floor(sourceX);
      const pixelY = Math.floor(sourceY);
      if (sourcePoints.has(`${pixelX},${pixelY}`)) {
        points.push({ x, y });
      }
    }
  }
  return points;
}

function renderedLayerPixelSet(layer) {
  if ((layer.rotation ?? 0) === 0) return layerPixelSet(layer);
  return new Set(
    rotatedLayerPoints(layer).map((point) => `${point.x},${point.y}`),
  );
}

function applyCanvasScale(centerScene = false) {
  canvas.style.width = `${canvas.width * displayScale}px`;
  canvas.style.height = `${canvas.height * displayScale}px`;
  if (!centerScene) return;
  requestAnimationFrame(() => {
    if (!layers.length) {
      viewerCanvasWrap.scrollLeft =
        (viewerCanvasWrap.scrollWidth - viewerCanvasWrap.clientWidth) / 2;
      viewerCanvasWrap.scrollTop =
        (viewerCanvasWrap.scrollHeight - viewerCanvasWrap.clientHeight) / 2;
      return;
    }
    const minX = Math.min(...layers.map((layer) => layer.x));
    const minY = Math.min(...layers.map((layer) => layer.y));
    const maxX = Math.max(...layers.map((layer) => layer.x + layerWidth(layer)));
    const maxY = Math.max(...layers.map((layer) => layer.y + layerHeight(layer)));
    const sceneCenterX =
      canvas.offsetLeft +
      (minX + maxX) / 2 * displayScale;
    const sceneCenterY =
      canvas.offsetTop +
      (minY + maxY) / 2 * displayScale;
    viewerCanvasWrap.scrollLeft =
      sceneCenterX - viewerCanvasWrap.clientWidth / 2;
    viewerCanvasWrap.scrollTop =
      sceneCenterY - viewerCanvasWrap.clientHeight / 2;
  });
}

function extractEntityName(args, fallbackId) {
  const asIndex = args.lastIndexOf("as");
  if (asIndex === -1) {
    let id = fallbackId;
    const match = fallbackId.match(/^(.*?)(\d+)$/);
    let sequence = match ? Number(match[2]) : 1;
    while (layers.some((layer) => layer.id === id)) {
      sequence += 1;
      id = match
        ? `${match[1]}${sequence}`
        : `${fallbackId}-${sequence}`;
    }
    return { args, id, explicit: false };
  }
  if (asIndex !== args.length - 2) {
    throw new Error('"as" must be followed by one entity name at the end.');
  }
  const id = args[asIndex + 1];
  if (!/^[a-z][a-z0-9-]*$/i.test(id)) {
    throw new Error("entity name must start with a letter and use letters, numbers, or hyphens.");
  }
  if (layers.some((layer) => layer.id === id)) {
    throw new Error(`Entity "${id}" already exists.`);
  }
  return {
    args: args.slice(0, asIndex),
    id,
    explicit: true,
  };
}

function runSquare(args) {
  const named = extractEntityName(args, `sq-${nextSquareId}`);
  const sideLength = resolveIntegerExpression(
    named.args[0],
    {},
    "sideLength",
  );
  if (!Number.isInteger(sideLength) || sideLength < 1 || sideLength > maxSideLength) {
    throw new Error(`sideLength must be an integer from 1 to ${maxSideLength}.`);
  }
  const rounded = extractRadiusOption(
    named.args.slice(1),
    sideLength,
    sideLength,
    "sq sideLength [color] [x y] [radius number] [as name]",
  );
  const { color, colorReference, x, y } = parseShapeOptions(
    rounded.args,
    "sq sideLength [color] [x y] [radius number] [as name]",
    { 1: sideLength, sideLength },
  );
  if (!layers.length) {
    canvas.width = 1;
    canvas.height = 1;
  }
  const layer = {
    id: named.id,
    type: "square",
    sideLength,
    radius: rounded.radius,
    rotation: 0,
    color,
    colorReference,
    x,
    y,
    zIndex: layers.length
      ? Math.max(...layers.map((item) => item.zIndex)) + 1
      : 0,
    creationOrder: nextCreationOrder,
  };
  if (!named.explicit) nextSquareId += 1;
  nextCreationOrder += 1;
  layers.push(layer);
  expandPixelSpaceFor(layer);
  renderLayers();
  applyCanvasScale(true);
  return `Created ${layer.id}: ${sideLength} × ${sideLength}, z-index ${layer.zIndex}.`;
}

function runCircle(args) {
  const named = extractEntityName(args, `cir-${nextCircleId}`);
  const diameter = resolveIntegerExpression(
    named.args[0],
    {},
    "diameter",
  );
  if (!Number.isInteger(diameter) || diameter < 1 || diameter > maxSideLength) {
    throw new Error(`diameter must be an integer from 1 to ${maxSideLength}.`);
  }
  const { color, colorReference, x, y } = parseShapeOptions(
    named.args.slice(1),
    "circle diameter [color] [x y] [as name]",
    { 1: diameter, diameter },
  );
  if (!layers.length) {
    canvas.width = 1;
    canvas.height = 1;
  }
  const layer = {
    id: named.id,
    type: "circle",
    diameter,
    rotation: 0,
    color,
    colorReference,
    x,
    y,
    zIndex: layers.length
      ? Math.max(...layers.map((item) => item.zIndex)) + 1
      : 0,
    creationOrder: nextCreationOrder,
  };
  if (!named.explicit) nextCircleId += 1;
  nextCreationOrder += 1;
  layers.push(layer);
  expandPixelSpaceFor(layer);
  renderLayers();
  applyCanvasScale(true);
  return `Created ${layer.id}: ${diameter} px diameter, z-index ${layer.zIndex}.`;
}

function runRectangle(args) {
  const named = extractEntityName(args, `rect-${nextRectId}`);
  const width = resolveIntegerExpression(named.args[0], {}, "width");
  const height = resolveIntegerExpression(
    named.args[1],
    { 1: width, width },
    "height",
  );
  if (!Number.isInteger(width) || width < 1 || width > maxSideLength) {
    throw new Error(`width must be an integer from 1 to ${maxSideLength}.`);
  }
  if (!Number.isInteger(height) || height < 1 || height > maxSideLength) {
    throw new Error(`height must be an integer from 1 to ${maxSideLength}.`);
  }
  const rounded = extractRadiusOption(
    named.args.slice(2),
    width,
    height,
    "rect width height [color] [x y] [radius number] [as name]",
  );
  const { color, colorReference, x, y } = parseShapeOptions(
    rounded.args,
    "rect width height [color] [x y] [radius number] [as name]",
    { 1: width, 2: height, width, height },
  );
  if (!layers.length) {
    canvas.width = 1;
    canvas.height = 1;
  }
  const layer = {
    id: named.id,
    type: "rectangle",
    width,
    height,
    radius: rounded.radius,
    rotation: 0,
    color,
    colorReference,
    x,
    y,
    zIndex: layers.length
      ? Math.max(...layers.map((item) => item.zIndex)) + 1
      : 0,
    creationOrder: nextCreationOrder,
  };
  if (!named.explicit) nextRectId += 1;
  nextCreationOrder += 1;
  layers.push(layer);
  expandPixelSpaceFor(layer);
  renderLayers();
  applyCanvasScale(true);
  return `Created ${layer.id}: ${width} × ${height}, z-index ${layer.zIndex}.`;
}

function nextZIndex() {
  return layers.length
    ? Math.max(...layers.map((layer) => layer.zIndex)) + 1
    : 0;
}

function createPixelsLayer(id, absolutePoints, resolvedColor, creationOrder) {
  const uniquePoints = [
    ...new Map(
      absolutePoints.map((point) => [`${point.x},${point.y}`, point]),
    ).values(),
  ];
  if (!uniquePoints.length) {
    throw new Error("pixel layer must contain at least one point.");
  }
  const minX = Math.min(...uniquePoints.map((point) => point.x));
  const minY = Math.min(...uniquePoints.map((point) => point.y));
  const maxX = Math.max(...uniquePoints.map((point) => point.x));
  const maxY = Math.max(...uniquePoints.map((point) => point.y));
  return {
    id,
    type: "pixels",
    points: uniquePoints.map((point) => ({
      x: point.x - minX,
      y: point.y - minY,
    })),
    width: maxX - minX + 1,
    height: maxY - minY + 1,
    rotation: 0,
    color: resolvedColor.color,
    colorReference: resolvedColor.reference,
    x: minX,
    y: minY,
    zIndex: nextZIndex(),
    creationOrder,
  };
}

function parsePixelCoordinate(coordinate) {
  const parts = coordinate.split(",");
  if (parts.length !== 2) {
    throw new Error(`Invalid pixel coordinate "${coordinate}".`);
  }
  return {
    x: resolveCoordinate(parts[0], {}),
    y: resolveCoordinate(parts[1], {}),
  };
}

function rasterizePixelSegment(start, end) {
  const points = [];
  let x = start.x;
  let y = start.y;
  const deltaX = Math.abs(end.x - start.x);
  const deltaY = Math.abs(end.y - start.y);
  const stepX = start.x < end.x ? 1 : -1;
  const stepY = start.y < end.y ? 1 : -1;
  let error = deltaX - deltaY;

  while (true) {
    points.push({ x, y });
    if (x === end.x && y === end.y) break;
    const doubledError = error * 2;
    if (doubledError > -deltaY) {
      error -= deltaY;
      x += stepX;
    }
    if (doubledError < deltaX) {
      error += deltaX;
      y += stepY;
    }
  }

  return points;
}

function parsePixelExpression(expression) {
  const coordinates = expression.split("..");
  if (coordinates.length === 1) {
    return [parsePixelCoordinate(coordinates[0])];
  }
  if (coordinates.length !== 2 || coordinates.some((value) => !value)) {
    throw new Error(`Invalid pixel segment "${expression}".`);
  }
  return rasterizePixelSegment(
    parsePixelCoordinate(coordinates[0]),
    parsePixelCoordinate(coordinates[1]),
  );
}

function runPixels(args) {
  const named = extractEntityName(args, `pixels-${nextPixelsId}`);
  if (named.args.length < 2) {
    throw new Error(
      "Usage: pixels color x,y [x,y..x,y ...] [as name]",
    );
  }
  const resolvedColor = resolveColor(named.args[0]);
  const points = named.args.slice(1).flatMap(parsePixelExpression);
  if (!layers.length) {
    canvas.width = 1;
    canvas.height = 1;
  }
  const layer = createPixelsLayer(
    named.id,
    points,
    resolvedColor,
    nextCreationOrder,
  );
  if (!named.explicit) nextPixelsId += 1;
  nextCreationOrder += 1;
  layers.push(layer);
  expandPixelSpaceFor(layer);
  renderLayers();
  applyCanvasScale(true);
  return `Created ${layer.id} with ${layer.points.length} pixels.`;
}

function layerPixelSet(layer) {
  const points = new Set();
  if (layer.type === "square" || layer.type === "rectangle") {
    for (let y = 0; y < layerBaseHeight(layer); y += 1) {
      for (let x = 0; x < layerBaseWidth(layer); x += 1) {
        if (
          roundedRectangleContains(
            x,
            y,
            layerBaseWidth(layer),
            layerBaseHeight(layer),
            layer.radius ?? 0,
          )
        ) {
          points.add(`${x},${y}`);
        }
      }
    }
    return points;
  }
  if (layer.type === "circle") {
    return circlePixelSet(layer.diameter);
  }
  if (layer.type === "pixels") {
    layer.points.forEach((point) => points.add(`${point.x},${point.y}`));
    return points;
  }
  throw new Error("Groups cannot be outlined directly.");
}

function circlePixelSet(diameter) {
  const points = new Set();
  const radius = diameter / 2;
  for (let y = 0; y < diameter; y += 1) {
    for (let x = 0; x < diameter; x += 1) {
      const dx = x + 0.5 - radius;
      const dy = y + 0.5 - radius;
      if (dx * dx + dy * dy <= radius * radius) {
        points.add(`${x},${y}`);
      }
    }
  }
  return points;
}

function runCircleStroke(args) {
  const named = extractEntityName(args, `cirstroke-${nextOutlineId}`);
  if (named.args.length !== 4) {
    throw new Error(
      "Usage: cirstroke circle-reference inset width color [as name]",
    );
  }

  const [sourceId, insetToken, widthToken, colorToken] = named.args;
  const source = layers.find((layer) => layer.id === sourceId);
  if (!source) throw new Error(`Unknown layer "${sourceId}".`);
  if (source.type !== "circle") {
    throw new Error(`Entity "${sourceId}" must be a circle.`);
  }

  const sourceReferences = {
    diameter: source.diameter,
    width: source.diameter,
    height: source.diameter,
  };
  const inset = resolveIntegerExpression(
    insetToken,
    sourceReferences,
    "circle stroke inset",
  );
  const width = resolveIntegerExpression(
    widthToken,
    { ...sourceReferences, inset },
    "circle stroke width",
  );
  if (!Number.isInteger(inset) || inset < 0) {
    throw new Error("circle stroke inset must be a non-negative integer.");
  }
  if (!Number.isInteger(width) || width < 1) {
    throw new Error("circle stroke width must be a positive integer.");
  }

  const outerDiameter = source.diameter - inset * 2;
  const innerDiameter = outerDiameter - width * 2;
  if (outerDiameter < 1 || innerDiameter < 1) {
    throw new Error(
      `Inset ${inset} and width ${width} do not fit inside ${source.id}.`,
    );
  }

  const outerPoints = circlePixelSet(outerDiameter);
  const innerPoints = circlePixelSet(innerDiameter);
  const selected = [];
  outerPoints.forEach((key) => {
    const [x, y] = key.split(",").map(Number);
    if (!innerPoints.has(`${x - width},${y - width}`)) {
      selected.push({
        x: source.x + inset + x,
        y: source.y + inset + y,
      });
    }
  });

  const resolvedColor = resolveColor(colorToken);
  const layer = createPixelsLayer(
    named.id,
    selected,
    resolvedColor,
    nextCreationOrder,
  );
  if (!named.explicit) nextOutlineId += 1;
  nextCreationOrder += 1;
  layers.push(layer);
  expandPixelSpaceFor(layer);
  renderLayers();
  applyCanvasScale(true);
  return `Created ${width}px circle stroke ${layer.id}, inset ${inset}px from ${source.id}.`;
}

function runOutline(args) {
  const named = extractEntityName(args, `outline-${nextOutlineId}`);
  const [sourceId, ...options] = named.args;
  const source = layers.find((layer) => layer.id === sourceId);
  if (!source) throw new Error(`Unknown layer "${sourceId}".`);
  let thickness = 1;
  let mode = "inner";
  let colorToken = null;
  options.forEach((option) => {
    if (
      /^[\d()+\-*/%]/.test(option) ||
      /^\$[a-zA-Z][\w-]*\.(?:width|height)/.test(option)
    ) {
      thickness = resolveIntegerExpression(
        option,
        {
          width: layerWidth(source),
          height: layerHeight(source),
        },
        "outline width",
      );
    } else if (option === "inner" || option === "outer") {
      mode = option;
    } else if (colorToken === null) {
      colorToken = option;
    } else {
      throw new Error("Usage: outline reference [width] [color] [inner|outer] [as name]");
    }
  });
  if (thickness < 1 || thickness > maxSideLength) {
    throw new Error(`outline width must be from 1 to ${maxSideLength}.`);
  }
  const sourcePoints = renderedLayerPixelSet(source);
  const selected = [];
  const directions = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  if (mode === "inner") {
    sourcePoints.forEach((key) => {
      const [x, y] = key.split(",").map(Number);
      const edge = directions.some(([dx, dy]) =>
        Array.from({ length: thickness }, (_, index) => index + 1)
          .some((distance) => !sourcePoints.has(`${x + dx * distance},${y + dy * distance}`))
      );
      if (edge) selected.push({ x: source.x + x, y: source.y + y });
    });
  } else {
    for (let y = -thickness; y < layerHeight(source) + thickness; y += 1) {
      for (let x = -thickness; x < layerWidth(source) + thickness; x += 1) {
        if (sourcePoints.has(`${x},${y}`)) continue;
        const near = directions.some(([dx, dy]) =>
          Array.from({ length: thickness }, (_, index) => index + 1)
            .some((distance) => sourcePoints.has(`${x + dx * distance},${y + dy * distance}`))
        );
        if (near) selected.push({ x: source.x + x, y: source.y + y });
      }
    }
  }
  const resolvedColor = colorToken === null ? defaultColor : resolveColor(colorToken);
  const layer = createPixelsLayer(
    named.id,
    selected,
    resolvedColor,
    nextCreationOrder,
  );
  if (!named.explicit) nextOutlineId += 1;
  nextCreationOrder += 1;
  layers.push(layer);
  expandPixelSpaceFor(layer);
  renderLayers();
  applyCanvasScale(true);
  return `Created ${mode} outline ${layer.id} from ${source.id}.`;
}

function layerBaseWidth(layer) {
  if (layer.type === "circle") return layer.diameter;
  if (layer.type === "rectangle" || layer.type === "pixels" || layer.type === "group") {
    return layer.width;
  }
  return layer.sideLength;
}

function layerBaseHeight(layer) {
  if (layer.type === "circle") return layer.diameter;
  if (layer.type === "rectangle" || layer.type === "pixels" || layer.type === "group") {
    return layer.height;
  }
  return layer.sideLength;
}

function rotatedLayerDimensions(layer) {
  const width = layerBaseWidth(layer);
  const height = layerBaseHeight(layer);
  const rotation = layer.rotation ?? 0;
  if (rotation === 0 || layer.type === "circle") return { width, height };
  const radians = rotation * Math.PI / 180;
  const cosine = Math.abs(Math.cos(radians));
  const sine = Math.abs(Math.sin(radians));
  return {
    width: Math.max(1, Math.ceil(width * cosine + height * sine - 1e-10)),
    height: Math.max(1, Math.ceil(width * sine + height * cosine - 1e-10)),
  };
}

function layerWidth(layer) {
  if (layer.type === "group") return layer.width;
  return rotatedLayerDimensions(layer).width;
}

function layerHeight(layer) {
  if (layer.type === "group") return layer.height;
  return rotatedLayerDimensions(layer).height;
}

function refreshGroupBounds() {
  layers.filter((layer) => layer.type === "group").forEach((group) => {
    const members = group.memberIds
      .map((id) => layers.find((layer) => layer.id === id))
      .filter(Boolean);
    if (!members.length) {
      group.width = 0;
      group.height = 0;
      return;
    }
    const minX = Math.min(...members.map((layer) => layer.x));
    const minY = Math.min(...members.map((layer) => layer.y));
    const maxX = Math.max(...members.map((layer) => layer.x + layerWidth(layer)));
    const maxY = Math.max(...members.map((layer) => layer.y + layerHeight(layer)));
    group.x = minX;
    group.y = minY;
    group.width = maxX - minX;
    group.height = maxY - minY;
  });
}

function captureGroupRotationOrigin(group, members) {
  group.rotationOrigin = {
    centerX: group.x + group.width / 2,
    centerY: group.y + group.height / 2,
    members: members.map((member) => ({
      id: member.id,
      x: member.x,
      y: member.y,
      centerX: member.x + layerWidth(member) / 2,
      centerY: member.y + layerHeight(member) / 2,
      rotation: member.rotation ?? 0,
    })),
  };
}

function moveGroupRotationOrigin(group, deltaX, deltaY) {
  const origin = group.rotationOrigin;
  if (!origin) return;
  origin.centerX += deltaX;
  origin.centerY += deltaY;
  origin.members.forEach((member) => {
    member.x += deltaX;
    member.y += deltaY;
    member.centerX += deltaX;
    member.centerY += deltaY;
  });
}

function layerNumericProperties(layer) {
  const properties = {
    x: layer.x,
    y: layer.y,
    left: layer.x,
    top: layer.y,
    right: layer.x + layerWidth(layer),
    bottom: layer.y + layerHeight(layer),
    centerX: layer.x + Math.floor(layerWidth(layer) / 2),
    centerY: layer.y + Math.floor(layerHeight(layer) / 2),
    width: layerWidth(layer),
    height: layerHeight(layer),
    zIndex: layer.zIndex,
  };
  properties.rotation = layer.rotation ?? 0;
  if (layer.type === "square") {
    properties.sideLength = layer.sideLength;
    properties.radius = layer.radius ?? 0;
  }
  if (layer.type === "rectangle") {
    properties.radius = layer.radius ?? 0;
  }
  if (layer.type === "circle") {
    properties.diameter = layer.diameter;
    properties.radius = Math.floor(layer.diameter / 2);
  }
  return properties;
}

function resolveMathVariable(name, property, references) {
  let referenced = references[name];
  if (referenced === undefined && property) {
    const layer = name.toLowerCase() === "last"
      ? [...layers].sort(
          (left, right) => right.creationOrder - left.creationOrder,
        )[0]
      : layers.find((item) => item.id === name);
    if (!layer && name.toLowerCase() === "last") return 0;
    if (!layer) {
      throw new Error(`Unknown entity reference "$${name}".`);
    }
    referenced = layerNumericProperties(layer)[property];
  }
  if (!Number.isInteger(referenced)) {
    throw new Error(`Unknown numeric reference "$${name}${property ? `.${property}` : ""}".`);
  }
  return referenced;
}

function resolveIntegerExpression(value, references = {}, label = "value") {
  const expression = String(value);
  let index = 0;

  const parsePrimary = () => {
    if (expression[index] === "(") {
      index += 1;
      const result = parseAddition();
      if (expression[index] !== ")") {
        throw new Error(`Unclosed parenthesis in ${label} "${expression}".`);
      }
      index += 1;
      return result;
    }

    const numberMatch = expression.slice(index).match(/^\d+/);
    if (numberMatch) {
      index += numberMatch[0].length;
      return Number(numberMatch[0]);
    }

    const variableMatch = expression.slice(index).match(
      /^\$(?:([a-zA-Z][\w-]*|\d+)\.([a-zA-Z]\w*)|([a-zA-Z]\w*|\d+))/,
    );
    if (variableMatch) {
      index += variableMatch[0].length;
      return resolveMathVariable(
        variableMatch[1] || variableMatch[3],
        variableMatch[2],
        references,
      );
    }

    throw new Error(`Invalid ${label} expression "${expression}".`);
  };

  const parseUnary = () => {
    if (expression[index] === "+") {
      index += 1;
      return parseUnary();
    }
    if (expression[index] === "-") {
      index += 1;
      return -parseUnary();
    }
    return parsePrimary();
  };

  const parseMultiplication = () => {
    let result = parseUnary();
    while (
      expression[index] === "*" ||
      expression[index] === "/" ||
      expression[index] === "%"
    ) {
      const operator = expression[index];
      index += 1;
      const right = parseUnary();
      if ((operator === "/" || operator === "%") && right === 0) {
        throw new Error(`Cannot divide by zero in ${label} "${expression}".`);
      }
      if (operator === "*") result *= right;
      if (operator === "/") result /= right;
      if (operator === "%") result %= right;
    }
    return result;
  };

  function parseAddition() {
    let result = parseMultiplication();
    while (expression[index] === "+" || expression[index] === "-") {
      const operator = expression[index];
      index += 1;
      const right = parseMultiplication();
      result = operator === "+" ? result + right : result - right;
    }
    return result;
  }

  const result = parseAddition();
  if (index !== expression.length || !Number.isInteger(result)) {
    throw new Error(`${label} "${expression}" must resolve to an integer.`);
  }
  return result;
}

function resolveCoordinate(value, references) {
  return resolveIntegerExpression(value, references, "coordinate");
}

function parseShapeOptions(args, usage, references) {
  const axisValues = {};
  const remainingArgs = [];
  args.forEach((arg) => {
    const axisMatch = arg.match(/^([xy])((?:[+-])?\$[a-zA-Z0-9].*)$/);
    if (!axisMatch) {
      remainingArgs.push(arg);
      return;
    }
    const axis = axisMatch[1];
    if (axisValues[axis] !== undefined) {
      throw new Error(`Duplicate ${axis} coordinate.`);
    }
    axisValues[axis] = axisMatch[2];
  });

  let color = null;
  let coordinateArgs = [];
  if (remainingArgs.length === 1) {
    color = remainingArgs[0];
  } else if (remainingArgs.length === 2) {
    coordinateArgs = remainingArgs;
  } else if (remainingArgs.length === 3) {
    [color, ...coordinateArgs] = remainingArgs;
  } else if (remainingArgs.length !== 0) {
    throw new Error(`Usage: ${usage}`);
  }
  if (coordinateArgs.length && Object.keys(axisValues).length) {
    throw new Error("Named x/y shorthand cannot be mixed with positional coordinates.");
  }
  let x = 0;
  let y = 0;
  if (Object.keys(axisValues).length) {
    x = resolveCoordinate(axisValues.x ?? "0", references);
    y = resolveCoordinate(axisValues.y ?? "0", references);
  } else if (coordinateArgs.length) {
    x = resolveCoordinate(coordinateArgs[0], references);
    y = resolveCoordinate(coordinateArgs[1], references);
  }
  const resolvedColor = color === null ? defaultColor : resolveColor(color);
  return {
    color: resolvedColor.color,
    colorReference: resolvedColor.reference,
    x,
    y,
  };
}

function extractRadiusOption(args, width, height, usage) {
  const radiusIndexes = args.flatMap((value, index) =>
    value.toLowerCase() === "radius" ? [index] : []
  );
  if (!radiusIndexes.length) return { args, radius: 0 };
  if (radiusIndexes.length > 1) {
    throw new Error(`Usage: ${usage}`);
  }

  const index = radiusIndexes[0];
  const radius = resolveIntegerExpression(
    args[index + 1],
    { 1: width, 2: height, width, height },
    "radius",
  );
  const maximum = Math.floor(Math.min(width, height) / 2);
  if (!Number.isInteger(radius) || radius < 0 || radius > maximum) {
    throw new Error(`radius must be an integer from 0 to ${maximum}.`);
  }
  return {
    args: [...args.slice(0, index), ...args.slice(index + 2)],
    radius,
  };
}

function normalizeLayerCoordinates() {
  if (!layers.length) return;
  const minX = Math.min(...layers.map((layer) => layer.x));
  const minY = Math.min(...layers.map((layer) => layer.y));
  const maxX = Math.max(...layers.map((layer) => layer.x + layerWidth(layer)));
  const maxY = Math.max(...layers.map((layer) => layer.y + layerHeight(layer)));
  layers.forEach((layer) => {
    layer.x -= minX;
    layer.y -= minY;
  });
  layers
    .filter((layer) => layer.type === "group")
    .forEach((group) => moveGroupRotationOrigin(group, -minX, -minY));
  canvas.width = Math.max(1, maxX - minX);
  canvas.height = Math.max(1, maxY - minY);
}

function expandPixelSpaceFor(layer) {
  const widthOfLayer = layerWidth(layer);
  const heightOfLayer = layerHeight(layer);
  let width = canvas.width;
  let height = canvas.height;
  if (layer.x < 0) {
    const shiftX = -layer.x;
    layers.forEach((item) => {
      item.x += shiftX;
    });
    layers
      .filter((item) => item.type === "group")
      .forEach((group) => moveGroupRotationOrigin(group, shiftX, 0));
    if (shapeDrag) shapeDrag.startX += shiftX;
    shapeDrag?.memberStarts?.forEach((start) => {
      start.x += shiftX;
    });
    width += shiftX;
  }
  if (layer.y < 0) {
    const shiftY = -layer.y;
    layers.forEach((item) => {
      item.y += shiftY;
    });
    layers
      .filter((item) => item.type === "group")
      .forEach((group) => moveGroupRotationOrigin(group, 0, shiftY));
    if (shapeDrag) shapeDrag.startY += shiftY;
    shapeDrag?.memberStarts?.forEach((start) => {
      start.y += shiftY;
    });
    height += shiftY;
  }
  if (layer.x + widthOfLayer > width) {
    width = layer.x + widthOfLayer;
  }
  if (layer.y + heightOfLayer > height) {
    height = layer.y + heightOfLayer;
  }
  if (canvas.width !== width) canvas.width = width;
  if (canvas.height !== height) canvas.height = height;
}

canvas.addEventListener("pointerdown", (event) => {
  const bounds = canvas.getBoundingClientRect();
  const canvasX = (event.clientX - bounds.left) / bounds.width * canvas.width;
  const canvasY = (event.clientY - bounds.top) / bounds.height * canvas.height;
  const worldX = canvasX;
  const worldY = canvasY;
  const layer = [...orderedLayers()].reverse().find((item) =>
    worldX >= item.x &&
    worldX < item.x + layerWidth(item) &&
    worldY >= item.y &&
    worldY < item.y + layerHeight(item)
  );
  if (!layer) return;
  event.preventDefault();
  shapeDrag = {
    pointerId: event.pointerId,
    layer,
    startClientX: event.clientX,
    startClientY: event.clientY,
    startX: layer.x,
    startY: layer.y,
    memberStarts: layer.type === "group"
      ? layer.memberIds.map((id) => {
          const member = layers.find((item) => item.id === id);
          return member ? { id, x: member.x, y: member.y } : null;
        }).filter(Boolean)
      : null,
    rotationOriginStart: layer.type === "group" && layer.rotationOrigin
      ? structuredClone(layer.rotationOrigin)
      : null,
    pixelsPerCssX: canvas.width / bounds.width,
    pixelsPerCssY: canvas.height / bounds.height,
  };
  canvas.classList.add("dragging-shape");
  canvas.setPointerCapture(event.pointerId);
});

canvas.addEventListener("pointermove", (event) => {
  if (!shapeDrag || shapeDrag.pointerId !== event.pointerId) return;
  const deltaX = Math.round(
    (event.clientX - shapeDrag.startClientX) * shapeDrag.pixelsPerCssX,
  );
  const deltaY = Math.round(
    (event.clientY - shapeDrag.startClientY) * shapeDrag.pixelsPerCssY,
  );
  if (shapeDrag.layer.type === "group") {
    shapeDrag.memberStarts.forEach((start) => {
      const member = layers.find((item) => item.id === start.id);
      if (!member) return;
      member.x = start.x + deltaX;
      member.y = start.y + deltaY;
    });
    if (shapeDrag.rotationOriginStart) {
      shapeDrag.layer.rotationOrigin = structuredClone(
        shapeDrag.rotationOriginStart,
      );
      moveGroupRotationOrigin(shapeDrag.layer, deltaX, deltaY);
    }
    refreshGroupBounds();
    shapeDrag.memberStarts.forEach((start) => {
      const member = layers.find((item) => item.id === start.id);
      if (member) expandPixelSpaceFor(member);
    });
  } else {
    shapeDrag.layer.x = shapeDrag.startX + deltaX;
    shapeDrag.layer.y = shapeDrag.startY + deltaY;
    expandPixelSpaceFor(shapeDrag.layer);
  }
  renderLayers();
});

function finishShapeDrag(event) {
  if (!shapeDrag || shapeDrag.pointerId !== event.pointerId) return;
  const { layer, startX, startY } = shapeDrag;
  shapeDrag = null;
  canvas.classList.remove("dragging-shape");
  if (layer.x === startX && layer.y === startY) return;
  const command = `move ${layer.id} ${layer.x} ${layer.y}`;
  dispatchCommand(command, false);
}

canvas.addEventListener("pointerup", finishShapeDrag);
canvas.addEventListener("pointercancel", finishShapeDrag);

displayScaleInput.addEventListener("change", () => {
  dispatchCommand(`scale ${displayScaleInput.value}`, false);
});
resetLayersButton.addEventListener("click", () => {
  dispatchCommand("resetlayers", false);
});

function runChangeZIndex(args) {
  if (args.length !== 2) {
    throw new Error("Usage: chz reference number");
  }
  const [layerId, rawAmount] = args;
  const layer = layers.find((item) => item.id === layerId);
  if (!layer) {
    throw new Error(`Unknown layer "${layerId}".`);
  }
  const amount = resolveIntegerExpression(
    rawAmount,
    { z: layer.zIndex, zIndex: layer.zIndex },
    "z-index change",
  );
  if (!Number.isInteger(amount)) {
    throw new Error("number must be a signed integer.");
  }
  const affected = layer.type === "group"
    ? [
        layer,
        ...layer.memberIds
          .map((id) => layers.find((item) => item.id === id))
          .filter(Boolean),
      ]
    : [layer];
  affected.forEach((item) => {
    item.zIndex += amount;
  });
  renderLayers();
  return `Changed ${layer.id} z-index by ${amount >= 0 ? "+" : ""}${amount}; now ${layer.zIndex}.`;
}

function runMove(args) {
  if (args.length !== 3) {
    throw new Error("Usage: move reference x y");
  }
  const [layerId, rawX, rawY] = args;
  const layer = layers.find((item) => item.id === layerId);
  if (!layer) {
    throw new Error(`Unknown layer "${layerId}".`);
  }
  const x = resolveCoordinate(rawX, {});
  const y = resolveCoordinate(rawY, {});
  if (layer.type === "group") {
    const deltaX = x - layer.x;
    const deltaY = y - layer.y;
    layer.memberIds.forEach((id) => {
      const member = layers.find((item) => item.id === id);
      if (!member) return;
      member.x += deltaX;
      member.y += deltaY;
    });
    moveGroupRotationOrigin(layer, deltaX, deltaY);
    refreshGroupBounds();
    layer.memberIds.forEach((id) => {
      const member = layers.find((item) => item.id === id);
      if (member) expandPixelSpaceFor(member);
    });
  } else {
    layer.x = x;
    layer.y = y;
    expandPixelSpaceFor(layer);
  }
  renderLayers();
  return `Moved ${layer.id} to (${layer.x}, ${layer.y}).`;
}

function runChangeRadius(args) {
  if (args.length !== 2) {
    throw new Error("Usage: chradius reference number");
  }
  const [layerId, rawRadius] = args;
  const layer = layers.find((item) => item.id === layerId);
  if (!layer) {
    throw new Error(`Unknown layer "${layerId}".`);
  }
  if (layer.type !== "square" && layer.type !== "rectangle") {
    throw new Error(`Entity "${layerId}" must be a square or rectangle.`);
  }
  const radius = resolveIntegerExpression(
    rawRadius,
    {
      radius: layer.radius ?? 0,
      width: layerWidth(layer),
      height: layerHeight(layer),
    },
    "radius",
  );
  const relative = /^[+-]/.test(rawRadius);
  const nextRadius = relative ? (layer.radius ?? 0) + radius : radius;
  const maximum = Math.floor(
    Math.min(layerWidth(layer), layerHeight(layer)) / 2,
  );
  if (
    !Number.isInteger(radius) ||
    !Number.isInteger(nextRadius) ||
    nextRadius < 0 ||
    nextRadius > maximum
  ) {
    throw new Error(`resulting radius must be an integer from 0 to ${maximum}.`);
  }
  layer.radius = nextRadius;
  renderLayers();
  return relative
    ? `Changed ${layer.id} radius by ${radius >= 0 ? "+" : ""}${radius}; now ${nextRadius}.`
    : `Changed ${layer.id} radius to ${nextRadius}.`;
}

function runRotate(args) {
  if (args.length !== 2) {
    throw new Error("Usage: rotate reference degrees");
  }
  const [layerId, rawDegrees] = args;
  const layer = layers.find((item) => item.id === layerId);
  if (!layer) {
    throw new Error(`Unknown layer "${layerId}".`);
  }
  const degrees = resolveIntegerExpression(
    rawDegrees,
    { rotation: layer.rotation ?? 0 },
    "rotation",
  );
  const relative = /^[+-]/.test(rawDegrees);
  const requested = relative ? (layer.rotation ?? 0) + degrees : degrees;
  const nextRotation = ((requested % 360) + 360) % 360;

  if (layer.type === "group") {
    const members = layer.memberIds
      .map((id) => layers.find((item) => item.id === id))
      .filter((member) => member && member.type !== "group");
    if ((layer.rotation ?? 0) === 0 || !layer.rotationOrigin) {
      captureGroupRotationOrigin(layer, members);
    }
    const origin = layer.rotationOrigin;
    const radians = nextRotation * Math.PI / 180;
    const cosine = Math.cos(radians);
    const sine = Math.sin(radians);
    members.forEach((member) => {
      const memberOrigin = origin.members.find(
        (candidate) => candidate.id === member.id,
      );
      if (!memberOrigin) return;
      member.rotation = (
        (memberOrigin.rotation + nextRotation) % 360 + 360
      ) % 360;
      if (nextRotation === 0) {
        member.x = memberOrigin.x;
        member.y = memberOrigin.y;
        return;
      }
      const relativeX = memberOrigin.centerX - origin.centerX;
      const relativeY = memberOrigin.centerY - origin.centerY;
      const rotatedCenterX =
        origin.centerX + cosine * relativeX - sine * relativeY;
      const rotatedCenterY =
        origin.centerY + sine * relativeX + cosine * relativeY;
      member.x = Math.round(rotatedCenterX - layerWidth(member) / 2);
      member.y = Math.round(rotatedCenterY - layerHeight(member) / 2);
    });
    members.forEach((member) => expandPixelSpaceFor(member));
    layer.rotation = nextRotation;
    refreshGroupBounds();
    renderLayers();
    return relative
      ? `Rotated ${layer.id} by ${degrees >= 0 ? "+" : ""}${degrees}deg; now ${layer.rotation}deg.`
      : `Set ${layer.id} rotation to ${layer.rotation}deg.`;
  }

  const oldWidth = layerWidth(layer);
  const oldHeight = layerHeight(layer);
  layer.rotation = nextRotation;
  const newWidth = layerWidth(layer);
  const newHeight = layerHeight(layer);
  layer.x += Math.round((oldWidth - newWidth) / 2);
  layer.y += Math.round((oldHeight - newHeight) / 2);
  expandPixelSpaceFor(layer);
  renderLayers();
  return relative
    ? `Rotated ${layer.id} by ${degrees >= 0 ? "+" : ""}${degrees}deg; now ${layer.rotation}deg.`
    : `Set ${layer.id} rotation to ${layer.rotation}deg.`;
}

function runDelete(args) {
  if (args.length !== 1) {
    throw new Error("Usage: delete reference");
  }
  const [layerId] = args;
  const index = layers.findIndex((item) => item.id === layerId);
  if (index === -1) {
    throw new Error(`Unknown layer "${layerId}".`);
  }
  layers.splice(index, 1);
  layers
    .filter((layer) => layer.type === "group")
    .forEach((group) => {
      group.memberIds = group.memberIds.filter((id) => id !== layerId);
    });
  renderLayers();
  return `Deleted ${layerId}.`;
}

function runScale(args) {
  if (args.length !== 1) {
    throw new Error("Usage: scale number");
  }
  const rawScale = args[0];
  const value = resolveIntegerExpression(
    rawScale,
    { scale: displayScale },
    "scale",
  );
  if (!Number.isInteger(value)) {
    throw new Error("scale must be an integer.");
  }
  const relative = /^[+-]/.test(rawScale);
  const scale = relative ? displayScale + value : value;
  if (scale < 2 || scale > 32) {
    throw new Error("resulting scale must be from 2 to 32.");
  }
  displayScale = scale;
  localStorage.setItem(displayScaleStorageKey, String(scale));
  displayScaleInput.value = scale;
  displayScaleValue.textContent = `${scale}×`;
  applyCanvasScale(true);
  renderExpressionPreview();
  return relative
    ? `Changed Viewer scale by ${value >= 0 ? "+" : ""}${value}; now ${scale}×.`
    : `Set Viewer scale to ${scale}×.`;
}

function runResetLayers(args) {
  if (args.length !== 0) {
    throw new Error("Usage: resetlayers");
  }
  layers.splice(0);
  nextSquareId = 1;
  nextCircleId = 1;
  nextRectId = 1;
  nextPixelsId = 1;
  nextOutlineId = 1;
  nextGroupId = 1;
  nextCreationOrder = 1;
  canvas.width = 1;
  canvas.height = 1;
  renderLayers();
  return "Cleared all layers and their saved scene state.";
}

function runAddColor(args) {
  if (args.length !== 2) {
    throw new Error("Usage: addcolor name color");
  }
  const [rawName, rawColor] = args;
  if (!/^[a-z][a-z0-9-]*$/i.test(rawName)) {
    throw new Error("color name must start with a letter and use letters, numbers, or hyphens.");
  }
  const name = rawName.toLowerCase();
  if (customColors.has(name)) {
    throw new Error(`Color "${name}" already exists; use editpalette.`);
  }
  const color = normalizeCssColor(rawColor);
  customColors.set(name, color);
  saveColors();
  renderColorList();
  return `Added color ${name} = ${color}.`;
}

function runEditPalette(args) {
  if (args.length !== 2) {
    throw new Error("Usage: editpalette name color");
  }
  const [rawName, rawColor] = args;
  const name = rawName.startsWith("$")
    ? rawName.slice(1).toLowerCase()
    : rawName.toLowerCase();
  if (!customColors.has(name)) {
    throw new Error(`Unknown custom color "${name}".`);
  }
  const previousColor = customColors.get(name);
  const color = normalizeCssColor(rawColor);
  customColors.set(name, color);
  if (defaultColor.reference === name) {
    defaultColor.color = color;
    defaultColor.label = name;
    saveDefaultColor();
    renderDefaultColor();
  }
  if (backgroundColor.reference === name) {
    backgroundColor.color = color;
    backgroundColor.label = name;
    saveBackgroundColor();
    renderBackgroundColor();
  }
  let updatedLayers = 0;
  layers.forEach((layer) => {
    if (
      layer.colorReference === name ||
      (layer.colorReference == null && layer.color === previousColor)
    ) {
      layer.color = color;
      layer.colorReference = name;
      updatedLayers += 1;
    }
  });
  saveColors();
  renderColorList();
  renderLayers();
  return `Updated ${name} to ${color}; changed ${updatedLayers} layer${updatedLayers === 1 ? "" : "s"}.`;
}

function runChangeColor(args) {
  if (args.length !== 2) {
    throw new Error("Usage: chcolor reference color");
  }
  const [layerId, rawColor] = args;
  const layer = layers.find((item) => item.id === layerId);
  if (!layer) {
    throw new Error(`Unknown layer "${layerId}".`);
  }
  const resolvedColor = resolveColor(rawColor);
  const affected = layer.type === "group"
    ? layer.memberIds
        .map((id) => layers.find((item) => item.id === id))
        .filter((item) => item && item.type !== "group")
    : [layer];
  affected.forEach((item) => {
    item.color = resolvedColor.color;
    item.colorReference = resolvedColor.reference;
  });
  renderLayers();
  return `Changed ${layer.id} color to ${resolvedColor.color}.`;
}

function runGroup(args) {
  const named = extractEntityName(args, `group-${nextGroupId}`);
  if (!named.args.length) {
    throw new Error("Usage: group reference [reference ...] [as name]");
  }
  const memberIds = [...new Set(named.args)];
  const members = memberIds.map((id) => {
    const layer = layers.find((item) => item.id === id);
    if (!layer) throw new Error(`Unknown layer "${id}".`);
    if (layer.type === "group") {
      throw new Error("Nested groups are not supported.");
    }
    return layer;
  });
  const minX = Math.min(...members.map((layer) => layer.x));
  const minY = Math.min(...members.map((layer) => layer.y));
  const maxX = Math.max(...members.map((layer) => layer.x + layerWidth(layer)));
  const maxY = Math.max(...members.map((layer) => layer.y + layerHeight(layer)));
  const group = {
    id: named.id,
    type: "group",
    memberIds,
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY,
    rotation: 0,
    zIndex: Math.max(...members.map((layer) => layer.zIndex)),
    creationOrder: nextCreationOrder,
  };
  captureGroupRotationOrigin(group, members);
  if (!named.explicit) nextGroupId += 1;
  nextCreationOrder += 1;
  layers.push(group);
  renderLayers();
  return `Created ${group.id} with ${memberIds.length} members.`;
}

function runSelectColor(args) {
  if (args.length !== 1) {
    throw new Error("Usage: selectcolor color");
  }
  const rawColor = args[0];
  const resolvedColor = resolveColor(rawColor);
  defaultColor = {
    color: resolvedColor.color,
    reference: resolvedColor.reference,
    label: resolvedColor.reference || rawColor,
  };
  saveDefaultColor();
  renderDefaultColor();
  return `Selected ${defaultColor.label} as the global default color.`;
}

function runSetBackground(args) {
  if (args.length !== 1) {
    throw new Error("Usage: setbg color");
  }
  const rawColor = args[0];
  if (rawColor.toLowerCase() === "none" || rawColor.toLowerCase() === "transparent") {
    backgroundColor = {
      color: "transparent",
      reference: null,
      label: "none",
    };
  } else {
    const resolvedColor = resolveColor(rawColor);
    backgroundColor = {
      color: resolvedColor.color,
      reference: resolvedColor.reference,
      label: resolvedColor.reference || rawColor,
    };
  }
  saveBackgroundColor();
  renderBackgroundColor();
  return `Set background to ${backgroundColor.label}.`;
}

const commandNames = [
  "sq",
  "square",
  "circle",
  "cir",
  "rect",
  "rectangle",
  "cirstroke",
  "pixels",
  "outline",
  "group",
  "rotate",
  "chradius",
  "chradious",
  "chzindex",
  "chz",
  "move",
  "mv",
  "delete",
  "del",
  "scale",
  "resetlayers",
  "rl",
  "addcolor",
  "editpalette",
  "ep",
  "chcolor",
  "selectcolor",
  "setbg",
];

function editDistance(left, right) {
  const previous = Array.from(
    { length: right.length + 1 },
    (_, index) => index,
  );
  for (let leftIndex = 1; leftIndex <= left.length; leftIndex += 1) {
    const current = [leftIndex];
    for (let rightIndex = 1; rightIndex <= right.length; rightIndex += 1) {
      current[rightIndex] = Math.min(
        current[rightIndex - 1] + 1,
        previous[rightIndex] + 1,
        previous[rightIndex - 1] +
          (left[leftIndex - 1] === right[rightIndex - 1] ? 0 : 1),
      );
    }
    previous.splice(0, previous.length, ...current);
  }
  return previous[right.length];
}

function commandMatchScore(query, command) {
  if (command.startsWith(query)) return command.length - query.length;
  if (query.length < 2) return Number.POSITIVE_INFINITY;

  const substringIndex = command.indexOf(query);
  if (substringIndex !== -1) {
    return 100 + substringIndex + command.length - query.length;
  }

  let commandIndex = 0;
  let gaps = 0;
  for (const character of query) {
    const matchIndex = command.indexOf(character, commandIndex);
    if (matchIndex === -1) {
      commandIndex = -1;
      break;
    }
    gaps += matchIndex - commandIndex;
    commandIndex = matchIndex + 1;
  }
  if (commandIndex !== -1) {
    return 200 + gaps + command.length - query.length;
  }

  if (query.length < 3) return Number.POSITIVE_INFINITY;
  const distance = editDistance(query, command);
  const maximumDistance = Math.max(1, Math.floor(query.length / 3));
  return distance <= maximumDistance
    ? 300 + distance * 10 + Math.abs(command.length - query.length)
    : Number.POSITIVE_INFINITY;
}

function autocompleteSuggestions() {
  if (autocompleteSuppressed) return [];
  const value = currentInputLine().value;
  const commandMatch = value.match(/^\s*(\S*)$/);
  if (
    commandMatch &&
    commandMatch[1] &&
    !commandMatch[1].startsWith("$")
  ) {
    const prefix = commandMatch[1].toLowerCase();
    return commandNames
      .map((name) => ({
        name,
        score: commandMatchScore(prefix, name),
      }))
      .filter(({ score }) => Number.isFinite(score))
      .sort((left, right) => left.score - right.score)
      .map(({ name }) => ({
        label: name,
        completion: `${name} `,
      }));
  }

  const variableFragmentMatch = value.match(
    /(\$(?:[a-zA-Z][\w-]*|\d+)?(?:\.[a-zA-Z]\w*|\.)?)$/,
  );
  if (variableFragmentMatch) {
    const fragment = variableFragmentMatch[1];
    const body = fragment.slice(1);
    const dotIndex = body.indexOf(".");
    const completeVariable = (label, replacement) => ({
      label,
      completion:
        value.slice(0, value.length - fragment.length) + replacement,
    });

    if (dotIndex !== -1) {
      const entityId = body.slice(0, dotIndex);
      const propertyPrefix = body.slice(dotIndex + 1).toLowerCase();
      const layer = entityId.toLowerCase() === "last"
        ? [...layers].sort(
            (left, right) => right.creationOrder - left.creationOrder,
          )[0]
        : layers.find((item) => item.id === entityId);
      const propertyNames = layer
        ? Object.keys(layerNumericProperties(layer))
        : entityId.toLowerCase() === "last"
          ? [
              "x",
              "y",
              "left",
              "top",
              "right",
              "bottom",
              "centerX",
              "centerY",
              "width",
              "height",
              "zIndex",
              "rotation",
            ]
          : [];
      return propertyNames
        .filter((property) =>
          property.toLowerCase().startsWith(propertyPrefix)
        )
        .map((property) =>
          completeVariable(
            `$${entityId}.${property}`,
            `$${entityId}.${property}`,
          )
        );
    }

    const prefix = body.toLowerCase();
    const localVariables = Object.keys(
      previewCommandReferences(value.trim().split(/\s+/)),
    ).filter((name) => !/^\d+$/.test(name));
    const suggestions = [
      ...localVariables.map((name) => ({
        label: `$${name}`,
        replacement: `$${name}`,
      })),
      {
        label: "$last",
        replacement: "$last.",
      },
      ...layers.map((layer) => ({
        label: `$${layer.id}`,
        replacement: `$${layer.id}.`,
      })),
      ...[...customColors.keys()].map((name) => ({
        label: `$${name}`,
        replacement: `$${name}`,
      })),
    ];
    return suggestions
      .filter(({ label }) => label.slice(1).toLowerCase().startsWith(prefix))
      .filter(
        (suggestion, index, items) =>
          items.findIndex((item) => item.label === suggestion.label) === index,
      )
      .map(({ label, replacement }) =>
        completeVariable(label, replacement)
      );
  }

  const keyedTokens = value.trimStart().split(/\s+/);
  const keyedCommand = keyedTokens[0]?.toLowerCase();
  const keyedToken = keyedTokens.at(-1) || "";
  const keyedSeparator = keyedToken.indexOf(":");
  if (keyedTokens.length > 1 && keyedSeparator > 0) {
    const key = keyedToken.slice(0, keyedSeparator).toLowerCase();
    const rawValue = keyedToken.slice(keyedSeparator + 1);
    const completeValues = (items, prefix = rawValue) =>
      items
        .filter((item) => item.toLowerCase().startsWith(prefix.toLowerCase()))
        .map((item) => ({
          label: item,
          completion: `${value.slice(0, value.length - prefix.length)}${item} `,
        }));

    if (
      key === "color" &&
      [
        "sq",
        "square",
        "circle",
        "cir",
        "rect",
        "rectangle",
        "cirstroke",
        "pixels",
        "outline",
        "chcolor",
        "selectcolor",
        "setbg",
      ].includes(keyedCommand)
    ) {
      return completeValues([...customColors.keys()]);
    }

    if (
      (key === "name" && ["editpalette", "ep"].includes(keyedCommand))
    ) {
      return completeValues([...customColors.keys()]);
    }

    if (
      ["layer", "reference", "source", "circle"].includes(key)
    ) {
      let candidates = layers;
      if (keyedCommand === "cirstroke") {
        candidates = layers.filter((layer) => layer.type === "circle");
      } else if (
        keyedCommand === "chradius" ||
        keyedCommand === "chradious"
      ) {
        candidates = layers.filter(
          (layer) =>
            layer.type === "square" || layer.type === "rectangle",
        );
      } else if (keyedCommand === "outline") {
        candidates = layers.filter((layer) => layer.type !== "group");
      }
      return completeValues(candidates.map((layer) => layer.id));
    }

    if (
      ["members", "layers"].includes(key) &&
      keyedCommand === "group"
    ) {
      const lastComma = rawValue.lastIndexOf(",");
      const prefix = rawValue.slice(lastComma + 1);
      return completeValues(
        layers
          .filter((layer) => layer.type !== "group")
          .map((layer) => layer.id),
        prefix,
      );
    }
  }

  const layerMatch = value.match(
    /^\s*(?:chzindex|chz|move|mv|rotate|delete|del|chcolor|outline)\s+(\S*)$/i,
  );
  if (layerMatch) {
    const prefix = layerMatch[1].toLowerCase();
    return layers
      .map((layer) => layer.id)
      .filter((id) => id.toLowerCase().startsWith(prefix))
      .map((id) => ({
        label: id,
        completion: `${value.replace(/\S*$/, id)} `,
      }));
  }

  const radiusLayerMatch = value.match(
    /^\s*(?:chradius|chradious)\s+(\S*)$/i,
  );
  if (radiusLayerMatch) {
    const prefix = radiusLayerMatch[1].toLowerCase();
    return layers
      .filter(
        (layer) =>
          layer.type === "square" || layer.type === "rectangle",
      )
      .map((layer) => layer.id)
      .filter((id) => id.toLowerCase().startsWith(prefix))
      .map((id) => ({
        label: id,
        completion: `${value.replace(/\S*$/, id)} `,
      }));
  }

  const groupMatch = value.match(/^\s*group(?:\s+\S+)*\s+(\S*)$/i);
  if (
    groupMatch &&
    groupMatch[1] &&
    !/\s+as\s+\S*$/i.test(value)
  ) {
    const prefix = groupMatch[1].toLowerCase();
    return layers
      .filter((layer) => layer.type !== "group")
      .map((layer) => layer.id)
      .filter((id) => id.toLowerCase().startsWith(prefix))
      .map((id) => ({
        label: id,
        completion: `${value.replace(/\S*$/, id)} `,
      }));
  }

  const circleStrokeMatch = value.match(/^\s*cirstroke\s+(\S*)$/i);
  if (circleStrokeMatch) {
    const prefix = circleStrokeMatch[1].toLowerCase();
    return layers
      .filter((layer) => layer.type === "circle")
      .map((layer) => layer.id)
      .filter((id) => id.toLowerCase().startsWith(prefix))
      .map((id) => ({
        label: id,
        completion: `${value.replace(/\S*$/, id)} `,
      }));
  }

  const namedColorMatch = value.match(/^\s*(?:editpalette|ep)\s+(\S*)$/i);
  if (namedColorMatch) {
    const prefix = namedColorMatch[1].replace(/^\$/, "").toLowerCase();
    return [...customColors.keys()]
      .filter((name) => name.startsWith(prefix))
      .map((name) => ({
        label: name,
        completion: `${value.replace(/\S*$/, name)} `,
      }));
  }

  const colorMatch =
    value.match(/^\s*(?:sq|square|circle|cir)\s+\S+\s+(\S*)$/i) ||
    value.match(/^\s*(?:rect|rectangle)\s+\S+\s+\S+\s+(\S*)$/i) ||
    value.match(/^\s*chcolor\s+\S+\s+(\S*)$/i) ||
    value.match(/^\s*selectcolor\s+(\S*)$/i) ||
    value.match(/^\s*setbg\s+(\S*)$/i) ||
    value.match(/^\s*cirstroke\s+\S+\s+\S+\s+\S+\s+(\S*)$/i) ||
    value.match(/^\s*pixels\s+(\S*)$/i);
  if (!colorMatch) return [];
  const rawPrefix = colorMatch[1];
  const usesDollar = rawPrefix.startsWith("$");
  const prefix = (usesDollar ? rawPrefix.slice(1) : rawPrefix).toLowerCase();
  return [...customColors.keys()]
    .filter((name) => name.startsWith(prefix))
    .map((name) => {
      const reference = usesDollar ? `$${name}` : name;
      return {
        label: reference,
        completion: `${value.replace(/\S*$/, reference)} `,
      };
    });
}

function completeSuggestion(suggestion) {
  const line = currentInputLine();
  input.value =
    input.value.slice(0, line.start) +
    suggestion.completion +
    input.value.slice(line.end);
  const caret = line.start + suggestion.completion.length;
  input.setSelectionRange(caret, caret);
  autocomplete.hidden = true;
  autocompleteIndex = -1;
  autocompleteSuppressed = false;
  renderExpressionPreview();
  input.focus();
}

function currentInputLine() {
  const caret = input.selectionStart ?? input.value.length;
  const start = input.value.lastIndexOf("\n", caret - 1) + 1;
  const nextBreak = input.value.indexOf("\n", caret);
  const end = nextBreak === -1 ? input.value.length : nextBreak;
  return {
    start,
    end,
    value: input.value.slice(start, end),
  };
}

function previewExpressionToken(token, references) {
  const assignmentSeparator = token.indexOf("=");
  const separator = assignmentSeparator === -1
    ? token.indexOf(":")
    : assignmentSeparator;
  let label = "";
  let expression = token;
  if (separator > 0) {
    label = token.slice(0, separator);
    expression = token.slice(separator + 1);
  } else {
    const axisMatch = token.match(/^([xy])((?:[+-])?\$.*)$/);
    if (axisMatch) {
      label = axisMatch[1];
      expression = axisMatch[2];
    }
  }
  if (
    !expression ||
    (assignmentSeparator === -1 && !/[$+\-*/%()]/.test(expression)) ||
    expression.startsWith("#")
  ) {
    return null;
  }
  try {
    const result = resolveIntegerExpression(
      expression,
      references,
      "preview",
    );
    return {
      label: label || expression,
      expression,
      result,
    };
  } catch {
    return null;
  }
}

function previewVariables(token, references) {
  const resolvedVariables = [];
  const matches = token.matchAll(
    /\$(?:([a-zA-Z][\w-]*|\d+)\.([a-zA-Z]\w*)|([a-zA-Z]\w*|\d+))/g,
  );
  for (const match of matches) {
    const name = match[1] || match[3];
    const anchor = match[2];
    try {
      resolvedVariables.push({
        label: match[0],
        expression: match[0],
        result: resolveMathVariable(
          name,
          anchor,
          references,
        ),
      });
    } catch {
      // Incomplete or command-local references remain hidden until resolvable.
    }
  }
  return resolvedVariables;
}

function previewCommandReferences(tokens) {
  const references = { scale: displayScale };
  const command = tokens[0]?.toLowerCase();
  const args = tokens.slice(1);
  const keyed = new Map(
    args.flatMap((arg) => {
      const separator = arg.indexOf(":");
      return separator > 0
        ? [[arg.slice(0, separator).toLowerCase(), arg.slice(separator + 1)]]
        : [];
    }),
  );
  const positional = args.filter((arg) => !arg.includes(":"));
  const evaluate = (value) => {
    if (!value) return null;
    try {
      return resolveIntegerExpression(value, references, "preview");
    } catch {
      return null;
    }
  };

  if (command === "sq" || command === "square") {
    const sideLength = evaluate(
      keyed.get("size") ||
      keyed.get("side") ||
      keyed.get("sidelength") ||
      positional[0],
    );
    if (sideLength !== null) {
      references[1] = sideLength;
      references.sideLength = sideLength;
    }
  }
  if (command === "circle" || command === "cir") {
    const diameter = evaluate(
      keyed.get("diameter") || keyed.get("size") || positional[0],
    );
    if (diameter !== null) {
      references[1] = diameter;
      references.diameter = diameter;
    }
  }
  if (command === "rect" || command === "rectangle") {
    const width = evaluate(keyed.get("width") || positional[0]);
    if (width !== null) {
      references[1] = width;
      references.width = width;
    }
    const height = evaluate(keyed.get("height") || positional[1]);
    if (height !== null) {
      references[2] = height;
      references.height = height;
    }
  }
  if (command === "chradius" || command === "chradious") {
    const layerId =
      keyed.get("layer") || keyed.get("reference") || positional[0];
    const layer = layers.find((item) => item.id === layerId);
    if (layer && (layer.type === "square" || layer.type === "rectangle")) {
      references.radius = layer.radius ?? 0;
      references.width = layerWidth(layer);
      references.height = layerHeight(layer);
    }
  }
  if (command === "rotate") {
    const layerId =
      keyed.get("layer") || keyed.get("reference") || positional[0];
    const layer = layers.find((item) => item.id === layerId);
    if (layer) {
      references.rotation = layer.rotation ?? 0;
    }
  }
  return references;
}

function renderExpressionPreview() {
  const lineTokens = currentInputLine().value.trim().split(/\s+/);
  const expressionOnly = lineTokens[0]?.startsWith("$");
  const tokens = expressionOnly ? lineTokens : lineTokens.slice(1);
  const references = previewCommandReferences(lineTokens);
  const previews = [
    ...tokens.flatMap((token) => previewVariables(token, references)),
    ...tokens.map((token) => previewExpressionToken(token, references)),
  ]
    .filter(Boolean)
    .filter(
      (preview, index, items) =>
        items.findIndex(
          (item) =>
            item.label === preview.label &&
            item.expression === preview.expression,
        ) === index,
    );
  expressionPreview.replaceChildren();
  expressionPreview.hidden = previews.length === 0;
  previews.forEach(({ label, expression, result }) => {
    const value = document.createElement("code");
    value.textContent = label === expression
      ? `${expression} = ${result}`
      : `${label}: ${expression} = ${result}`;
    expressionPreview.append(value);
  });
}

function renderAutocomplete() {
  const suggestions = autocompleteSuggestions();
  autocomplete.replaceChildren();
  autocomplete.hidden = suggestions.length === 0;
  if (autocompleteIndex >= suggestions.length) autocompleteIndex = suggestions.length - 1;
  suggestions.forEach((suggestion, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = suggestion.label;
    button.classList.toggle("active", index === autocompleteIndex);
    button.addEventListener("mouseenter", () => {
      autocompleteIndex = index;
      [...autocomplete.children].forEach((item, itemIndex) => {
        item.classList.toggle("active", itemIndex === autocompleteIndex);
      });
    });
    button.addEventListener("click", () => completeSuggestion(suggestion));
    autocomplete.append(button);
  });
}

function translateKeyValueArgs(command, args) {
  if (!args.some((arg) => arg.includes(":"))) return args;

  const values = new Map();
  const positional = [];
  let foundKeyedArgument = false;
  args.forEach((arg) => {
    const separator = arg.indexOf(":");
    if (separator < 1) {
      if (foundKeyedArgument) {
        throw new Error("Positional arguments must come before key:value arguments.");
      }
      positional.push(arg);
      return;
    }
    foundKeyedArgument = true;
    const key = arg.slice(0, separator).toLowerCase();
    const value = arg.slice(separator + 1);
    if (!value) throw new Error(`Missing value for "${key}".`);
    if (values.has(key)) throw new Error(`Duplicate argument "${key}".`);
    values.set(key, value);
  });

  const take = (...keys) => {
    const found = keys.filter((key) => values.has(key));
    if (found.length > 1) {
      throw new Error(`Use only one of: ${keys.join(", ")}.`);
    }
    if (!found.length) return null;
    const key = found[0];
    const value = values.get(key);
    values.delete(key);
    return value;
  };
  const requireValue = (label, ...keys) => {
    const value = take(...keys);
    if (value !== null) return value;
    if (positional.length) return positional.shift();
    throw new Error(`Missing required argument "${label}".`);
  };
  const finish = (translated, allowId = false) => {
    const id = allowId ? take("id", "as") : null;
    if (positional.length) {
      throw new Error(`Unexpected positional argument "${positional[0]}".`);
    }
    if (values.size) {
      throw new Error(`Unknown argument "${values.keys().next().value}".`);
    }
    return id ? [...translated, "as", id] : translated;
  };
  const shapePosition = (translated, allowRadius = true) => {
    const color = take("color");
    const x = take("x");
    const y = take("y");
    if (color !== null) translated.push(color);
    if (x !== null || y !== null) {
      translated.push(x ?? "0", y ?? "0");
    }
    if (allowRadius) {
      const radius = take("radius");
      if (radius !== null) translated.push("radius", radius);
    }
    return finish(translated, true);
  };

  if (command === "sq" || command === "square") {
    return shapePosition([
      requireValue("size", "size", "side", "sidelength"),
    ]);
  }
  if (command === "circle" || command === "cir") {
    return shapePosition(
      [requireValue("diameter", "diameter", "size")],
      false,
    );
  }
  if (command === "rect" || command === "rectangle") {
    return shapePosition([
      requireValue("width", "width"),
      requireValue("height", "height"),
    ]);
  }
  if (command === "cirstroke") {
    return finish([
      requireValue("circle", "circle", "source", "reference"),
      requireValue("inset", "inset"),
      requireValue("width", "width"),
      requireValue("color", "color"),
    ], true);
  }
  if (command === "pixels") {
    const color = requireValue("color", "color");
    const points = requireValue("points", "points")
      .split(";")
      .filter(Boolean);
    if (!points.length) throw new Error('Argument "points" cannot be empty.');
    return finish([color, ...points], true);
  }
  if (command === "outline") {
    const translated = [
      requireValue("source", "source", "reference", "layer"),
    ];
    const width = take("width");
    const color = take("color");
    const mode = take("mode");
    if (width !== null) translated.push(width);
    if (color !== null) translated.push(color);
    if (mode !== null) translated.push(mode);
    return finish(translated, true);
  }
  if (command === "group") {
    const members = requireValue("members", "members", "layers")
      .split(",")
      .filter(Boolean);
    if (!members.length) throw new Error('Argument "members" cannot be empty.');
    return finish(members, true);
  }
  if (command === "chradius" || command === "chradious") {
    return finish([
      requireValue("layer", "layer", "reference"),
      requireValue("radius", "radius", "amount", "value"),
    ]);
  }
  if (command === "rotate") {
    return finish([
      requireValue("layer", "layer", "reference"),
      requireValue("degrees", "degrees", "rotation", "amount", "value"),
    ]);
  }
  if (command === "chzindex" || command === "chz") {
    return finish([
      requireValue("layer", "layer", "reference"),
      requireValue("amount", "amount", "value", "z"),
    ]);
  }
  if (command === "move" || command === "mv") {
    return finish([
      requireValue("layer", "layer", "reference"),
      requireValue("x", "x"),
      requireValue("y", "y"),
    ]);
  }
  if (command === "delete" || command === "del") {
    return finish([requireValue("layer", "layer", "reference")]);
  }
  if (command === "scale") {
    return finish([requireValue("value", "value", "scale", "amount")]);
  }
  if (command === "addcolor") {
    return finish([
      requireValue("name", "name"),
      requireValue("color", "color", "value"),
    ]);
  }
  if (command === "editpalette" || command === "ep") {
    return finish([
      requireValue("name", "name"),
      requireValue("color", "color", "value"),
    ]);
  }
  if (command === "chcolor") {
    return finish([
      requireValue("layer", "layer", "reference"),
      requireValue("color", "color", "value"),
    ]);
  }
  if (command === "selectcolor") {
    return finish([requireValue("color", "color", "value")]);
  }
  if (command === "setbg") {
    return finish([requireValue("color", "color", "value")]);
  }
  if (command === "resetlayers" || command === "rl") {
    return finish([]);
  }
  return args;
}

function runPropertyAssignment(command) {
  const match = command.match(
    /^\s*\$([a-zA-Z][\w-]*|last)\.([a-zA-Z]\w*)=(.+)\s*$/,
  );
  if (!match) return null;

  const [, reference, rawProperty, expression] = match;
  const layer = reference.toLowerCase() === "last"
    ? [...layers].sort(
        (left, right) => right.creationOrder - left.creationOrder,
      )[0]
    : layers.find((item) => item.id === reference);
  if (!layer) {
    throw new Error(`Unknown layer "${reference}".`);
  }

  const property = rawProperty.toLowerCase();
  const references = {
    ...layerNumericProperties(layer),
    rotation: layer.rotation ?? 0,
  };
  const value = resolveIntegerExpression(
    expression,
    references,
    `${layer.id}.${rawProperty}`,
  );

  if (property === "rotation") {
    return runRotate([layer.id, `(${value})`]);
  }
  if (property === "radius") {
    return runChangeRadius([layer.id, `(${value})`]);
  }
  if (property === "zindex") {
    return runChangeZIndex([layer.id, String(value - layer.zIndex)]);
  }
  if (property === "x" || property === "left") {
    return runMove([layer.id, String(value), String(layer.y)]);
  }
  if (property === "right") {
    return runMove([
      layer.id,
      String(value - layerWidth(layer)),
      String(layer.y),
    ]);
  }
  if (property === "centerx") {
    return runMove([
      layer.id,
      String(value - Math.floor(layerWidth(layer) / 2)),
      String(layer.y),
    ]);
  }
  if (property === "y" || property === "top") {
    return runMove([layer.id, String(layer.x), String(value)]);
  }
  if (property === "bottom") {
    return runMove([
      layer.id,
      String(layer.x),
      String(value - layerHeight(layer)),
    ]);
  }
  if (property === "centery") {
    return runMove([
      layer.id,
      String(layer.x),
      String(value - Math.floor(layerHeight(layer) / 2)),
    ]);
  }
  throw new Error(`Property "${rawProperty}" is read-only or unknown.`);
}

function execute(command) {
  const assignmentResult = runPropertyAssignment(command);
  if (assignmentResult !== null) return assignmentResult;
  let tokens = command.trim().split(/\s+/);
  const name = tokens.shift()?.toLowerCase();
  if (!name) return "";
  tokens = translateKeyValueArgs(name, tokens);
  if (name === "sq" || name === "square") {
    return runSquare(tokens);
  }
  if (name === "circle" || name === "cir") {
    return runCircle(tokens);
  }
  if (name === "rect" || name === "rectangle") {
    return runRectangle(tokens);
  }
  if (name === "cirstroke") {
    return runCircleStroke(tokens);
  }
  if (name === "pixels") {
    return runPixels(tokens);
  }
  if (name === "outline") {
    return runOutline(tokens);
  }
  if (name === "group") {
    return runGroup(tokens);
  }
  if (name === "rotate") {
    return runRotate(tokens);
  }
  if (name === "chradius" || name === "chradious") {
    return runChangeRadius(tokens);
  }
  if (name === "chzindex" || name === "chz") {
    return runChangeZIndex(tokens);
  }
  if (name === "move" || name === "mv") {
    return runMove(tokens);
  }
  if (name === "delete" || name === "del") {
    return runDelete(tokens);
  }
  if (name === "scale") {
    return runScale(tokens);
  }
  if (name === "resetlayers" || name === "rl") {
    return runResetLayers(tokens);
  }
  if (name === "addcolor") {
    return runAddColor(tokens);
  }
  if (name === "editpalette" || name === "ep") {
    return runEditPalette(tokens);
  }
  if (name === "chcolor") {
    return runChangeColor(tokens);
  }
  if (name === "selectcolor") {
    return runSelectColor(tokens);
  }
  if (name === "setbg") {
    return runSetBackground(tokens);
  }
  throw new Error(`Unknown command "${name}".`);
}

function dispatchCommand(command, recordHistory = true) {
  if (recordHistory) rememberCommand(command);
  try {
    const message = execute(command);
    if (/^\s*(?:resetlayers|rl)\s*$/i.test(command)) {
      localStorage.removeItem(layerStateStorageKey);
    } else {
      saveLayerState();
    }
    if (recordHistory) appendMessage(command, message);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to run command.";
    if (recordHistory) {
      appendMessage(command, message, true);
    } else {
      console.error(message);
    }
  }
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const commands = input.value
    .replace(/\r\n?/g, "\n")
    .split("\n")
    .map((command) => command.trim())
    .filter(Boolean);
  if (!commands.length) return;
  commands.forEach((command) => dispatchCommand(command));
  input.value = "";
  autocompleteSuppressed = false;
  renderAutocomplete();
  renderExpressionPreview();
});

input.addEventListener("input", () => {
  autocompleteIndex = -1;
  renderAutocomplete();
  renderExpressionPreview();
});
input.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
    event.preventDefault();
    form.requestSubmit();
    return;
  }
  if (event.key === "Backspace") {
    autocompleteSuppressed = false;
    autocompleteIndex = -1;
    return;
  }
  const suggestions = autocompleteSuggestions();
  if (
    suggestions.length &&
    (event.key === "ArrowUp" || event.key === "ArrowDown")
  ) {
    event.preventDefault();
    if (event.key === "ArrowDown") {
      autocompleteIndex = (autocompleteIndex + 1) % suggestions.length;
    } else {
      autocompleteIndex =
        (autocompleteIndex - 1 + suggestions.length) % suggestions.length;
    }
    renderAutocomplete();
    return;
  }
  if (
    suggestions.length &&
    (event.key === "Tab" ||
      (event.key === "Enter" &&
        !event.shiftKey &&
        (
          autocompleteIndex >= 0 ||
          /\S$/.test(currentInputLine().value)
        )))
  ) {
    event.preventDefault();
    completeSuggestion(suggestions[autocompleteIndex < 0 ? 0 : autocompleteIndex]);
    return;
  }
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    form.requestSubmit();
    return;
  }
  if (event.key === "ArrowUp") {
    if (input.value.includes("\n")) return;
    if (!commandHistory.length) return;
    event.preventDefault();
    if (historyIndex === commandHistory.length) historyDraft = input.value;
    historyIndex = Math.max(0, historyIndex - 1);
    input.value = commandHistory[historyIndex];
    autocompleteSuppressed = true;
    input.setSelectionRange(input.value.length, input.value.length);
    renderAutocomplete();
    renderExpressionPreview();
    return;
  }
  if (event.key === "ArrowDown") {
    if (input.value.includes("\n")) return;
    if (historyIndex >= commandHistory.length) return;
    event.preventDefault();
    historyIndex += 1;
    input.value =
      historyIndex === commandHistory.length
        ? historyDraft
        : commandHistory[historyIndex];
    autocompleteSuppressed = historyIndex !== commandHistory.length;
    input.setSelectionRange(input.value.length, input.value.length);
    renderAutocomplete();
    renderExpressionPreview();
    return;
  }
});

openCommandIntroButton.addEventListener("click", () => {
  commandIntroDialog.showModal();
});
closeCommandIntroButton.addEventListener("click", () => {
  commandIntroDialog.close();
});
startCommandExploringButton.addEventListener("click", () => {
  commandIntroDialog.close();
});
commandIntroDialog.addEventListener("click", (event) => {
  if (event.target === commandIntroDialog) commandIntroDialog.close();
});
commandIntroDialog.addEventListener("close", () => {
  localStorage.setItem(commandIntroClosedStorageKey, "true");
});

setupCommandLibrary();
restoreHistory();
restoreColors();
restoreDefaultColor();
restoreBackgroundColor();
restoreDisplayScale();
restoreLayerState();
applyCanvasScale(true);
renderCommandIntroPreview();
if (localStorage.getItem(commandIntroClosedStorageKey) !== "true") {
  commandIntroDialog.showModal();
}

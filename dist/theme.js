(() => {
  const storageKey = "xpm-workbench-theme-v1";
  const tabName = new URLSearchParams(location.search).get("section") === "extra"
    ? "extra" : (location.pathname.split("/").pop() || "index.html");
  const tabPaletteKey = `xpm-workbench-palette-${tabName}`;
  const defaultCustom = {
    background: "#24142c",
    accent: "#ff8fd8",
  };
  const presets = [
    { name: "Amethyst", background: "#1f101f", accent: "#e8b6e8" },
    { name: "Cobalt", background: "#101a2b", accent: "#69c7ff" },
    { name: "Pine", background: "#10231d", accent: "#7bd5a5" },
    { name: "Ember", background: "#2a1510", accent: "#ff9a70" },
    { name: "Solar", background: "#f3e6b0", accent: "#a44f00" },
    { name: "Bubblegum", background: "#f6d9ec", accent: "#a72d77" },
  ];

  const validHex = (value) => /^#[0-9a-f]{6}$/i.test(value || "");

  function readState() {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey));
      if (
        saved &&
        ["sun", "night", "custom"].includes(saved.mode) &&
        validHex(saved.background) &&
        validHex(saved.accent)
      ) {
        return saved;
      }
    } catch (_error) {
      // Storage can be unavailable in privacy-restricted browsing modes.
    }

    return { mode: "sun", ...defaultCustom };
  }

  function saveState(state) {
    try {
      localStorage.setItem(storageKey, JSON.stringify(state));
    } catch (_error) {
      // The selected theme still applies for the current page.
    }
  }

  function hexToRgb(hex) {
    return {
      r: Number.parseInt(hex.slice(1, 3), 16),
      g: Number.parseInt(hex.slice(3, 5), 16),
      b: Number.parseInt(hex.slice(5, 7), 16),
    };
  }

  function rgbToHex({ r, g, b }) {
    return `#${[r, g, b]
      .map((channel) => Math.round(channel).toString(16).padStart(2, "0"))
      .join("")}`;
  }

  function inverseColor(hex) {
    const { r, g, b } = hexToRgb(hex);
    return rgbToHex({ r: 255 - r, g: 255 - g, b: 255 - b });
  }

  function mix(first, second, amount) {
    const a = hexToRgb(first);
    const b = hexToRgb(second);
    return rgbToHex({
      r: a.r + (b.r - a.r) * amount,
      g: a.g + (b.g - a.g) * amount,
      b: a.b + (b.b - a.b) * amount,
    });
  }

  function luminance(hex) {
    const channels = Object.values(hexToRgb(hex)).map((channel) => {
      const value = channel / 255;
      return value <= 0.03928
        ? value / 12.92
        : ((value + 0.055) / 1.055) ** 2.4;
    });
    return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
  }

  function contrastingText(background) {
    return luminance(background) > 0.42 ? "#1d151d" : "#fff8ff";
  }

  function applyCustomPalette(state) {
    const root = document.documentElement;
    const background = state.background.toLowerCase();
    const accent = state.accent.toLowerCase();
    const dark = luminance(background) < 0.32;
    const text = validHex(state.text) ? state.text.toLowerCase() : contrastingText(background);
    const surface = mix(background, dark ? "#ffffff" : "#000000", dark ? 0.08 : 0.055);
    const strong = mix(background, "#000000", dark ? 0.34 : 0.82);
    const strongSurface = mix(strong, "#ffffff", 0.07);

    root.style.setProperty("--custom-bg", background);
    root.style.setProperty("--custom-surface", surface);
    root.style.setProperty("--custom-strong", strong);
    root.style.setProperty("--custom-strong-surface", strongSurface);
    root.style.setProperty("--custom-text", text);
    root.style.setProperty("--custom-on-strong", validHex(state.text) ? text : contrastingText(strong));
    root.style.setProperty("--custom-muted", mix(text, background, 0.42));
    root.style.setProperty("--custom-border", mix(background, text, 0.32));
    root.style.setProperty("--custom-accent", accent);
    root.style.setProperty("--custom-inverse-text", inverseColor(text));
    root.style.setProperty("--custom-inverse-bg", inverseColor(background));
    root.style.setProperty("--custom-inverse-accent", inverseColor(accent));
    root.style.setProperty("--custom-on-accent", contrastingText(accent));
    root.style.setProperty(
      "--custom-checker",
      mix(background, dark ? "#ffffff" : "#000000", dark ? 0.11 : 0.08),
    );
    root.style.colorScheme = dark ? "dark" : "light";
  }

  let state = readState();
  try {
    const palette = JSON.parse(localStorage.getItem(tabPaletteKey));
    if (palette && validHex(palette.background) && validHex(palette.accent)) {
      state = { ...state, background: palette.background, accent: palette.accent, text: validHex(palette.text) ? palette.text : undefined };
    }
  } catch (_error) { /* Keep the existing palette when storage is unavailable. */ }

  function applyState(nextState, persist = true) {
    state = nextState;
    document.documentElement.dataset.theme = state.mode;
    applyCustomPalette(state);
    if (state.mode !== "custom") {
      document.documentElement.style.colorScheme = state.mode === "night" ? "dark" : "light";
    }
    if (persist) saveState(state);
    if (persist && state.mode === "custom") {
      try {
        localStorage.setItem(tabPaletteKey, JSON.stringify({ background: state.background, accent: state.accent, text: state.text }));
      } catch (_error) { /* The current tab still retains its palette in memory. */ }
    }
    document.dispatchEvent(new CustomEvent("xpm-theme-change", { detail: { ...state } }));
  }

  applyState(state, false);

  function mountThemePicker() {
    const header = document.querySelector(".site-header");
    if (!header || document.querySelector(".theme-switcher")) return;

    const switcher = document.createElement("div");
    switcher.className = "theme-switcher";
    switcher.setAttribute("role", "group");
    switcher.setAttribute("aria-label", "Color theme");
    switcher.innerHTML = `
      <button class="theme-mode-button" type="button" data-theme-mode="sun" aria-label="Light theme" title="Light theme">
        <span aria-hidden="true">☀︎</span>
      </button>
      <button class="theme-mode-button" type="button" data-theme-mode="night" aria-label="Night theme" title="Night theme">
        <span aria-hidden="true">☾</span>
      </button>
      <button class="theme-mode-button" type="button" data-theme-mode="custom" aria-label="Custom color palette" title="Custom color palette" aria-controls="theme-palette" aria-expanded="false">
        <span class="theme-custom-glyph" aria-hidden="true">𓊒</span>
      </button>
    `;
    document.body.appendChild(switcher);

    const palette = document.createElement("section");
    palette.id = "theme-palette";
    palette.className = "theme-palette";
    palette.setAttribute("aria-label", "Custom color palette");
    palette.hidden = true;
    palette.innerHTML = `
      <div class="theme-palette-header">
        <strong>Palette</strong>
        <button class="theme-palette-close" type="button" aria-label="Close palette">×</button>
      </div>
      <div class="theme-presets" role="group" aria-label="Palette presets">
        ${presets
          .map(
            (preset) => `
              <button
                class="theme-preset"
                type="button"
                data-background="${preset.background}"
                data-accent="${preset.accent}"
                aria-label="${preset.name} palette"
                title="${preset.name}"
                style="--preset-background: ${preset.background}; --preset-accent: ${preset.accent}"
              ></button>`,
          )
          .join("")}
      </div>
      <div class="theme-color-fields">
        <label>
          <span>Background</span>
          <input class="theme-background-input" type="color" aria-label="Custom background color" />
        </label>
        <label>
          <span>Accent</span>
          <input class="theme-accent-input" type="color" aria-label="Custom accent color" />
        </label>
        <label>
          <span>Text</span>
          <input class="theme-text-input" type="color" aria-label="Custom text color" />
        </label>
      </div>
    `;
    document.body.appendChild(palette);

    const backgroundInput = palette.querySelector(".theme-background-input");
    const accentInput = palette.querySelector(".theme-accent-input");
    const textInput = palette.querySelector(".theme-text-input");
    const buttons = [...switcher.querySelectorAll("[data-theme-mode]")];

    function syncControls() {
      buttons.forEach((button) => {
        const active = button.dataset.themeMode === state.mode;
        button.classList.toggle("active", active);
        button.setAttribute("aria-pressed", String(active));
      });
      backgroundInput.value = state.background;
      accentInput.value = state.accent;
      textInput.value = validHex(state.text) ? state.text : contrastingText(state.background);
    }

    function closePalette() {
      palette.hidden = true;
      switcher
        .querySelector('[data-theme-mode="custom"]')
        .setAttribute("aria-expanded", "false");
    }

    function openPalette() {
      palette.hidden = false;
      switcher
        .querySelector('[data-theme-mode="custom"]')
        .setAttribute("aria-expanded", "true");
    }

    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        const mode = button.dataset.themeMode;
        if (mode === "custom") {
          const wasOpen = !palette.hidden;
          applyState({ ...state, mode: "custom" });
          syncControls();
          if (wasOpen) closePalette();
          else openPalette();
          return;
        }

        applyState({ ...state, mode });
        syncControls();
        closePalette();
      });
    });

    palette.querySelectorAll(".theme-preset").forEach((button) => {
      button.addEventListener("click", () => {
        applyState({
          mode: "custom",
          background: button.dataset.background,
          accent: button.dataset.accent,
          text: state.text,
        });
        syncControls();
      });
    });

    [backgroundInput, accentInput, textInput].forEach((input) => {
      input.addEventListener("input", () => {
        applyState({
          mode: "custom",
          background: backgroundInput.value,
          accent: accentInput.value,
          text: input === textInput ? textInput.value : state.text,
        });
        syncControls();
      });
    });

    palette.querySelector(".theme-palette-close").addEventListener("click", closePalette);
    document.addEventListener("click", (event) => {
      if (!palette.hidden && !palette.contains(event.target) && !switcher.contains(event.target)) {
        closePalette();
      }
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !palette.hidden) {
        closePalette();
        switcher.querySelector('[data-theme-mode="custom"]').focus();
      }
    });
    window.addEventListener("storage", (event) => {
      if (event.key !== storageKey) return;
      // Share the selected mode, but retain this tab's own custom palette.
      applyState({ ...state, mode: readState().mode }, false);
      syncControls();
    });

    syncControls();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mountThemePicker, { once: true });
  } else {
    mountThemePicker();
  }
})();

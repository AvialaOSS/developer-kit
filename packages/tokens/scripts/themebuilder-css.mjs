import { readFileSync } from "node:fs";
import { join } from "node:path";

const SOURCE_DIR = "source/themebuilder";

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function words(value) {
  return value
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/[\s/_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
}

function rgba(value) {
  const channel = (number) => Math.round(number * 255);
  const alpha = Number((value.a ?? 1).toFixed(4));
  if (alpha >= 1) {
    return `rgb(${channel(value.r)} ${channel(value.g)} ${channel(value.b)})`;
  }
  return `rgb(${channel(value.r)} ${channel(value.g)} ${channel(value.b)} / ${alpha})`;
}

export function loadThemeBuilderSnapshot(root) {
  const primary = readJson(join(root, SOURCE_DIR, "components.variables.json"));
  const dependencies = readJson(
    join(root, SOURCE_DIR, "components.dependencies.json")
  );
  return {
    collections: [...primary.collections, ...dependencies.collections],
    variables: [...primary.variables, ...dependencies.variables],
  };
}

export function createVariableRegistry(snapshot) {
  const collections = new Map(
    snapshot.collections.map((item) => [item.id, item])
  );
  const variables = new Map(snapshot.variables.map((item) => [item.i, item]));
  if (variables.size !== snapshot.variables.length) {
    throw new Error("ThemeBuilder snapshot contains duplicate variable IDs");
  }

  const cssName = (variable) => {
    const collection = collections.get(variable.c);
    if (!collection) throw new Error(`Missing collection for ${variable.n}`);
    if (collection.name === "numbers" || collection.name === "fontWeight") {
      return `--${words(variable.n.split("/").at(-1))}`;
    }
    if (collection.name === "Aviala Design Colors") {
      return `--aviala-${words(variable.n)}`;
    }
    return `--${words(variable.n)}`;
  };

  const names = new Map();
  for (const variable of variables.values()) {
    const name = cssName(variable);
    const other = names.get(name);
    if (other && other.i !== variable.i) {
      throw new Error(
        `CSS variable collision: ${other.n} and ${variable.n} -> ${name}`
      );
    }
    names.set(name, variable);
  }

  return { collections, variables, cssName };
}

function modeValue(variable, modeId) {
  return variable.v.find(([id]) => id === modeId)?.[1];
}

function matchingMode(collection, requestedName) {
  return (
    collection.modes.find(
      (mode) => mode.name.toLowerCase() === requestedName.toLowerCase()
    ) ?? collection.modes.find((mode) => mode.id === collection.defaultModeId)
  );
}

function literalCss(variable, value) {
  if (variable.t === "COLOR") return rgba(value);
  if (variable.t === "BOOLEAN") return value ? "1" : "0";
  if (variable.t === "TIMING") return `${value}s`;
  if (variable.t === "EASING") {
    const curve = value?.easingFunctionCubicBezier;
    if (curve)
      return `cubic-bezier(${curve.x1}, ${curve.y1}, ${curve.x2}, ${curve.y2})`;
    return String(value?.type ?? value)
      .toLowerCase()
      .replaceAll("_", "-");
  }
  if (variable.t === "STRING") return JSON.stringify(value);
  if (
    variable.s?.includes("OPACITY") ||
    /(^|\/)transparency(\/|$)/i.test(variable.n)
  ) {
    return String(value / 100);
  }
  return `${value}px`;
}

function valueCss(encoded, variable, registry, modeName) {
  if (!encoded) throw new Error(`Missing ${modeName} value for ${variable.n}`);
  const [kind, value] = encoded;
  if (kind === "l") return literalCss(variable, value);
  if (kind === "c") {
    const color = valueCss(encoded[1], variable, registry, modeName);
    const opacityVariable = { ...variable, t: "FLOAT", s: ["OPACITY"] };
    const opacity = valueCss(encoded[2], opacityVariable, registry, modeName);
    return `color-mix(in srgb, ${color} calc(${opacity} * 100%), transparent)`;
  }
  const target = registry.variables.get(value);
  if (!target) throw new Error(`Unresolved alias in ${variable.n}: ${value}`);
  return `var(${registry.cssName(target)})`;
}

function declarations(rows) {
  return rows.map(([name, value]) => `  ${name}: ${value};`).join("\n");
}

function foundationValue(variable, encoded) {
  if (!encoded || encoded[0] !== "l") {
    throw new Error(
      `Foundation token ${variable.n} must contain a literal value`
    );
  }
  const value = encoded[1];
  if (variable.s?.includes("FONT_WEIGHT")) return String(value);
  if (/^transparency\//i.test(variable.n)) return String(value / 100);
  if (/^(?:size|line-height)\//i.test(variable.n)) {
    const rem = value / 16;
    return `${Number.isInteger(rem) ? rem : rem.toFixed(4).replace(/\.?0+$/, "")}rem`;
  }
  return `${value}px`;
}

export const THEME_ALIASES = [
  ["--padding-littlesmall", "--padding-little-small"],
  [
    "--box-box-normal-background-blackonly",
    "--box-box-normal-background-black-only",
  ],
  [
    "--box-box-normal-background-whiteonly",
    "--box-box-normal-background-white-only",
  ],
  ["--special-effort-se-lineshadow-all", "--special-effort-se-line-shadow-all"],
  [
    "--special-effort-se-lineshadow-bottom",
    "--special-effort-se-line-shadow-bottom",
  ],
  [
    "--special-effort-se-lineshadow-bottomdeep",
    "--special-effort-se-line-shadow-bottom-deep",
  ],
  ["--border-border-theme-light", "--border-border-neutral-1"],
  ["--background", "--normal-background-theme"],
  ["--foreground", "--text-text-normal-text-black"],
  ["--primary", "--control-theme-primary-background-default"],
  ["--primary-foreground", "--text-text-normal-text-white"],
  ["--secondary", "--control-neutral-tertiary-background-default"],
  ["--secondary-foreground", "--text-text-normal-text-black"],
  ["--muted", "--control-neutral-quaternary-background-default"],
  ["--muted-foreground", "--text-text-normal-text-caption-black"],
  ["--accent", "--control-neutral-quaternary-background-default"],
  ["--accent-foreground", "--text-text-normal-text-black"],
  ["--destructive", "--control-fail-primary-background-default"],
  ["--destructive-foreground", "--text-text-normal-text-white"],
  ["--border", "--border-border-neutral-1"],
  ["--input", "--border-border-neutral-1"],
  ["--ring", "--border-border-theme-primary"],
  ["--card", "--box-box-normal-background-white1"],
  ["--card-foreground", "--foreground"],
  ["--popover", "--card"],
  ["--popover-foreground", "--foreground"],
];

export function buildFoundationTokenCss(snapshot) {
  const registry = createVariableRegistry(snapshot);
  const numbers = [...registry.collections.values()].find(
    (item) => item.name === "numbers"
  );
  const fontWeight = [...registry.collections.values()].find(
    (item) => item.name === "fontWeight"
  );
  if (!numbers || !fontWeight) {
    throw new Error("Missing numbers or fontWeight collection");
  }

  const variablesFor = (collection) =>
    [...registry.variables.values()]
      .filter((item) => item.c === collection.id)
      .sort((a, b) => a.n.localeCompare(b.n));
  const block = (selector, collection, modeName) => {
    const mode = matchingMode(collection, modeName);
    const rows = variablesFor(collection).map((variable) => [
      registry.cssName(variable),
      foundationValue(variable, modeValue(variable, mode.id)),
    ]);
    return `${selector} {\n${declarations(rows)}\n}`;
  };

  const defaultNumbers = block(":root", numbers, "Default");
  const weights = variablesFor(fontWeight).map((variable) => [
    registry.cssName(variable),
    foundationValue(variable, modeValue(variable, fontWeight.modes[0].id)),
  ]);
  const root = defaultNumbers.replace(/\n}$/, `\n${declarations(weights)}\n}`);
  return `${root}\n${block(
    '[data-density="mobile-friendly"]',
    numbers,
    "Mobile Friendly"
  )}\n`;
}

export function buildComponentTokenCss(snapshot) {
  const registry = createVariableRegistry(snapshot);
  const collection = [...registry.collections.values()].find(
    (item) => item.name === "componentToken"
  );
  if (!collection) throw new Error("Missing componentToken collection");
  if (collection.modes.length !== 1) {
    throw new Error(
      "componentToken must have exactly one mode; theme modes belong in semantic collections"
    );
  }
  const mode = collection.modes[0];
  const variables = [...registry.variables.values()]
    .filter((item) => item.c === collection.id)
    .sort((a, b) => a.n.localeCompare(b.n));
  const rows = variables.map((variable) => [
    registry.cssName(variable),
    valueCss(modeValue(variable, mode.id), variable, registry, mode.name),
  ]);
  return `/* Generated from Components / componentToken — do not edit by hand */\n:root {\n${declarations(rows)}\n}\n`;
}

export function buildSnapshotThemeCss(snapshot) {
  const registry = createVariableRegistry(snapshot);
  const colors = [...registry.collections.values()].find(
    (item) => item.name === "colorSystem"
  );
  const primitives = [...registry.collections.values()].find(
    (item) => item.name === "Aviala Design Colors"
  );
  if (!colors || !primitives)
    throw new Error("Missing colorSystem or Aviala Design Colors collection");

  const colorVariables = [...registry.variables.values()]
    .filter((item) => item.c === colors.id)
    .sort((a, b) => a.n.localeCompare(b.n));
  const primitiveVariables = [...registry.variables.values()]
    .filter((item) => item.c === primitives.id)
    .sort((a, b) => a.n.localeCompare(b.n));

  const block = (modeName, selector) => {
    const colorMode = matchingMode(colors, modeName);
    const primitiveMode = matchingMode(primitives, modeName);
    const rows = [];
    for (const variable of primitiveVariables) {
      rows.push([
        registry.cssName(variable),
        valueCss(
          modeValue(variable, primitiveMode.id),
          variable,
          registry,
          modeName
        ),
      ]);
    }
    for (const variable of colorVariables) {
      rows.push([
        registry.cssName(variable),
        valueCss(
          modeValue(variable, colorMode.id),
          variable,
          registry,
          modeName
        ),
      ]);
    }
    for (const [name, target] of THEME_ALIASES) {
      rows.push([name, `var(${target})`]);
    }
    return `${selector} {\n${declarations(rows)}\n}`;
  };

  return (
    "/* Generated from the current Components Figma variable graph — do not edit by hand */\n" +
    block("Light", ':root[data-theme="ald"]') +
    "\n" +
    block("Dark", ':root[data-theme="ald"][data-mode="dark"]') +
    "\n"
  );
}

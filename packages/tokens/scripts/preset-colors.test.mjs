import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import {
  addPresetColors,
  PRESET_COLOR_FAMILIES,
  PRESET_COLOR_SEEDS,
  generatePresetColorRamp,
  projectCssVariables,
  resolveProject,
  exportThemeBuilderSnapshot,
} from "../dist/project.js";
import { generateTheme } from "../dist/index.js";
import { buildStandardThemeCss } from "./standard-css.mjs";
const root = new URL("../", import.meta.url);
const project = JSON.parse(
  readFileSync(new URL("source/theme-engine/ald.project.json", root))
);
const isPreset = (t) => t.id.startsWith(`${project.id}:preset-color:`);

test("preset ramps live in ADC and public aliases keep their identities", () => {
  const isFoundation = (t) => t.id.includes(":preset-foundation:");
  const before = {
    ...project,
    tokens: project.tokens.filter((t) => !isPreset(t) && !isFoundation(t)),
  };
  const after = addPresetColors(before);
  assert.deepEqual(after.collections, before.collections);
  assert.deepEqual(after.tokens.slice(0, before.tokens.length), before.tokens);
  assert.equal(after.tokens.length - before.tokens.length, 288);
  assert.deepEqual(addPresetColors(after), after);
  const adc = after.collections.find((c) => c.name === "Aviala Design Colors");
  const system = after.collections.find((c) => c.name === "colorSystem");
  for (const t of after.tokens.filter(isPreset)) {
    assert.equal(t.collectionId, system.id);
    assert.equal(t.layer, "semantic");
    for (const value of Object.values(t.valuesByMode)) {
      assert.equal(value.kind, "alias");
      const source = after.tokens.find((entry) => entry.id === value.targetId);
      assert.equal(source.collectionId, adc.id);
      assert.equal(source.layer, "foundation");
      assert.equal(
        Object.values(source.valuesByMode).every((v) => v.kind === "literal"),
        true
      );
    }
  }
  const edited = structuredClone(after);
  edited.tokens.find(isFoundation).valuesByMode[adc.defaultModeId].value.r =
    0.123;
  assert.deepEqual(addPresetColors(edited), edited);
});

test("migrates the initial literal presets without losing authored colors or public IDs", () => {
  const legacy = structuredClone(project);
  const adc = legacy.collections.find((c) => c.name === "Aviala Design Colors");
  const system = legacy.collections.find((c) => c.name === "colorSystem");
  for (const t of legacy.tokens.filter(isPreset)) {
    const source = legacy.tokens.find(
      (v) => v.id === Object.values(t.valuesByMode)[0].targetId
    );
    t.layer = "foundation";
    t.valuesByMode = Object.fromEntries(
      system.modes.map((mode) => [
        mode.id,
        source.valuesByMode[adc.modes.find((m) => m.name === mode.name).id],
      ])
    );
  }
  legacy.tokens = legacy.tokens.filter(
    (t) => !t.id.includes(":preset-foundation:")
  );
  legacy.tokens.find(isPreset).valuesByMode[system.defaultModeId].value.r =
    0.123;
  const resolved = resolveProject(legacy, { color: "Light" });
  const migrated = addPresetColors(legacy);
  const migratedValues = resolveProject(migrated, { color: "Light" });
  for (const old of legacy.tokens) {
    const next = migrated.tokens.find((t) => t.id === old.id);
    if (!isPreset(old)) assert.deepEqual(next, old);
    else {
      assert.equal(next.cssName, old.cssName);
      assert.equal(next.collectionId, old.collectionId);
      assert.deepEqual(migratedValues[old.id], resolved[old.id]);
    }
  }
  assert.equal(migrated.tokens.length - legacy.tokens.length, 144);
  assert.deepEqual(addPresetColors(migrated), migrated);
});

test("all families have twelve actual colors and separate Light/Dark values", () => {
  const css = buildStandardThemeCss(fileURLToPath(root));
  const staticLight = projectCssVariables(project, { color: "Light" });
  const staticDark = projectCssVariables(project, { color: "Dark" });
  for (const family of PRESET_COLOR_FAMILIES) {
    const light = generatePresetColorRamp(family, "light");
    const dark = generatePresetColorRamp(family, "dark");
    assert.equal(light.length, 12);
    assert.equal(dark.length, 12);
    assert.equal(light[7].toUpperCase(), PRESET_COLOR_SEEDS[family]);
    assert.equal(new Set(light).size, 12, family);
    assert.equal(new Set(dark).size, 12, family);
    for (let step = 1; step <= 12; step++) {
      const name = `--aviala-${family}-${family}-${step}`;
      assert.ok(staticLight[name], name);
      assert.equal(
        staticLight[name],
        `var(--aviala-adc-${family}-${family}-${step})`
      );
      assert.notEqual(
        staticLight[`--aviala-adc-${family}-${family}-${step}`],
        staticDark[`--aviala-adc-${family}-${family}-${step}`],
        name
      );
      assert.ok(css.includes(`${name}:`), name);
    }
  }
});

test("runtime hue customization is independent of brand and survives local alias chains", () => {
  const a = generateTheme({ primary: "#123456" });
  const b = generateTheme({ primary: "#EE3344" });
  for (const family of PRESET_COLOR_FAMILIES)
    for (let step = 1; step <= 12; step++) {
      const name = `--aviala-${family}-${family}-${step}`;
      assert.equal(a[name], b[name]);
    }
  const custom = generateTheme({
    mode: "dark",
    presetColors: { blue: "#3344AA" },
  });
  assert.notEqual(
    custom["--aviala-adc-blue-blue-8"],
    generateTheme({ mode: "dark" })["--aviala-adc-blue-blue-8"]
  );
  assert.equal(
    custom["--aviala-red-red-8"],
    generateTheme({ mode: "dark" })["--aviala-red-red-8"]
  );
  const edited = structuredClone(project);
  const blue = edited.tokens.find(
    (t) => isPreset(t) && t.path.join("/") === "blue/blue-8"
  );
  const text = edited.tokens.find(
    (t) => t.path.join("/") === "text/text-theme-primary-black"
  );
  for (const mode of Object.keys(text.valuesByMode))
    text.valuesByMode[mode] = { kind: "alias", targetId: blue.id };
  const mode = project.collections
    .find((c) => c.id === blue.collectionId)
    .modes.find((m) => m.name === "Dark");
  assert.deepEqual(
    resolveProject(edited, { color: "Dark" })[text.id],
    resolveProject(edited, { color: "Dark" })[blue.id]
  );
});

test("Figma export retains colorSystem identities and modes without generating extra collections", () => {
  const snapshot = exportThemeBuilderSnapshot(project, {
    source: project.id,
    bindings: [],
    remPixels: 16,
  });
  assert.equal(snapshot.collections.length, project.collections.length);
  for (const token of project.tokens.filter(isPreset)) {
    const variable = snapshot.variables.find((v) => v.id === token.id);
    assert.equal(variable.collectionId, token.collectionId);
    assert.equal(variable.name, token.path.join("/"));
    assert.equal(Object.keys(variable.values).length, 2);
  }
});

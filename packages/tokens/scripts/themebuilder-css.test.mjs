import assert from "node:assert/strict";
import test from "node:test";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  buildComponentTokenCss,
  buildFoundationTokenCss,
  buildSnapshotThemeCss,
  createVariableRegistry,
  loadThemeBuilderSnapshot,
} from "./themebuilder-css.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const snapshot = loadThemeBuilderSnapshot(root);

test("the current Figma snapshot has a closed variable graph", () => {
  const registry = createVariableRegistry(snapshot);
  const componentCollection = snapshot.collections.find(
    (collection) => collection.name === "componentToken"
  );
  assert.ok(
    snapshot.variables.filter(
      (variable) => variable.c === componentCollection.id
    ).length >= 1694,
    "component snapshot must retain the migrated baseline"
  );
  for (const variable of snapshot.variables) {
    for (const [, encoded] of variable.v) {
      if (encoded[0] === "a") assert.ok(registry.variables.has(encoded[1]));
    }
  }
});

test("component tokens preserve aliases and normalized component names", () => {
  const css = buildComponentTokenCss(snapshot);
  assert.match(css, /--scroll-picker-size-padding-x: var\(--padding-none\);/);
  assert.match(
    css,
    /--scroll-picker-item-color-selected-text-default: var\(--text-text-theme-primary-black\);/
  );
  assert.doesNotMatch(css, /--scrollpicker/);
  assert.doesNotMatch(css, /-(?:font-size|line-height|font-weight):/);
});

test("foundation tokens preserve CSS units and density modes", () => {
  const css = buildFoundationTokenCss(snapshot);
  assert.match(css, /:root \{/);
  assert.match(css, /--size-small: 0\.75rem;/);
  assert.match(css, /--gap-inside-space: 6px;/);
  assert.match(css, /--transparency-placeholder: 0\.6;/);
  assert.match(css, /--font-weight-semibold: 600;/);
  assert.match(css, /\[data-density="mobile-friendly"\]/);
  assert.match(css, /--size-small: 1rem;/);
});

test("theme CSS emits current semantic colors for both modes", () => {
  const css = buildSnapshotThemeCss(snapshot);
  assert.match(css, /:root\[data-theme="ald"\]/);
  assert.match(css, /:root\[data-theme="ald"\]\[data-mode="dark"\]/);
  assert.match(
    css,
    /--control-neutral-tertiary-background-default: var\(--aviala-neutral-neutral-[46]\);/
  );
  assert.match(
    css,
    /--box-box-normal-background-white1: var\(--aviala-neutral-neutral-[16]\);/
  );
  assert.match(
    css,
    /--primary: var\(--control-theme-primary-background-default\);/
  );
  assert.match(css, /--card: var\(--box-box-normal-background-white1\);/);
  assert.match(
    css,
    /--border-border-theme-light: var\(--border-border-neutral-1\);/
  );
});

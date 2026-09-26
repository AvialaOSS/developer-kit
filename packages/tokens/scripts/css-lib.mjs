import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { buildStandardThemeCss } from "./standard-css.mjs";

/**
 * Pure CSS-generation functions for @aviala-design/tokens.
 *
 * Every function takes the tokens package root as its first argument so the
 * logic can be shared between:
 *   - scripts/build-css.mjs  (CLI — writes dist/*.css for publish/CI)
 *   - vite-plugin.mjs        (dev — generates the same CSS on the fly)
 */

export function buildComponentTokenCss(root) {
  // Include dependencies so the standalone component graph is never dangling.
  return buildStandardThemeCss(root, ":root");
}

export function buildAldThemeCss(root) {
  return buildStandardThemeCss(root);
}

/* ------------------------------------------------------------------ *
 * Combined styles.css (design tokens + base layer pieces)
 * ------------------------------------------------------------------ */

const STYLES_MERGE_FILES = [
  "src/semantic/colors.css",
  "src/semantic/components.css",
  "src/semantic/theme.css",
  "src/non-color/radius.css",
  "src/non-color/typography.css",
];

export function buildCombinedStylesCss(root) {
  const merged = STYLES_MERGE_FILES.map((f) =>
    readFileSync(join(root, f), "utf8")
  ).join("\n");
  const focusEffectsCss = readFileSync(
    join(root, "src/semantic/focus-effects.css"),
    "utf8"
  );
  return (
    "/* Legacy component definitions, followed by the standard project. */\n" +
    merged +
    "\n" +
    buildComponentTokenCss(root) +
    "\n" +
    focusEffectsCss +
    "\n"
  );
}

/* ------------------------------------------------------------------ *
 * Individual component-effects stylesheets (served 1:1 from src/semantic)
 * ------------------------------------------------------------------ */

const STANDALONE_CSS_RE = /-(effects|extras)\.css$/;

/**
 * Stable publish / aggregate order for every `*-effects.css` / `*-extras.css`
 * under src/semantic. Keep alphabetical. `assertStandaloneCssManifest` fails
 * the build when the directory drifts from this list.
 */
export const STANDALONE_CSS_MANIFEST = [
  "alert-effects.css",
  "badge-effects.css",
  "basic-input-effects.css",
  "button-effects.css",
  "cascader-effects.css",
  "color-picker-effects.css",
  "datepicker-effects.css",
  "drawer-effects.css",
  "feedback-effects.css",
  "focus-effects.css",
  "icon-effects.css",
  "information-collect-extras.css",
  "information-display-extras.css",
  "input-effects.css",
  "layout-effects.css",
  "list-effects.css",
  "loading-effects.css",
  "modal-effects.css",
  "navigation-effects.css",
  "popover-effects.css",
  "progress-effects.css",
  "structure-navigation-extras.css",
  "tab-effects.css",
  "tooltip-effects.css",
  "typeface-effects.css",
  "video-effects.css",
];

/**
 * Assert STANDALONE_CSS_MANIFEST matches every `-(effects|extras).css` file in
 * src/semantic (no missing, no extras). Throws on mismatch.
 */
export function assertStandaloneCssManifest(root) {
  const dir = join(root, "src/semantic");
  const onDisk = readdirSync(dir)
    .filter((name) => STANDALONE_CSS_RE.test(name))
    .sort();
  const expected = [...STANDALONE_CSS_MANIFEST].sort();
  const missing = expected.filter((n) => !onDisk.includes(n));
  const unexpected = onDisk.filter((n) => !expected.includes(n));
  if (missing.length || unexpected.length) {
    const parts = [];
    if (missing.length) parts.push(`missing on disk: ${missing.join(", ")}`);
    if (unexpected.length)
      parts.push(`on disk but not in manifest: ${unexpected.join(", ")}`);
    throw new Error(
      `Standalone CSS manifest out of sync with src/semantic (${parts.join("; ")}). Update STANDALONE_CSS_MANIFEST in css-lib.mjs.`
    );
  }
}

/**
 * List the standalone semantic stylesheets ("button-effects.css",
 * "information-display-extras.css", …) with their absolute paths.
 * Order follows STANDALONE_CSS_MANIFEST. Asserts directory ↔ manifest.
 */
export function listStandaloneCssFiles(root) {
  assertStandaloneCssManifest(root);
  const dir = join(root, "src/semantic");
  return STANDALONE_CSS_MANIFEST.map((name) => ({
    name,
    path: join(dir, name),
  }));
}

/**
 * Concatenate standalone effects/extras in manifest order.
 * `focus-effects.css` is already merged into tokens `styles.css` — skip it
 * when building the spiral aggregate to avoid a duplicate block.
 */
export function buildStandaloneEffectsCss(root, { skipFocus = true } = {}) {
  const files = listStandaloneCssFiles(root).filter(
    ({ name }) => !(skipFocus && name === "focus-effects.css")
  );
  return files.map(({ path }) => readFileSync(path, "utf8")).join("\n");
}

/**
 * Full default consumer stylesheet graph (tokens baseline + all effects +
 * frozen ALD theme). Used by spiral `styles.css` and the tokens vite-plugin.
 * Does not include spiral `@layer base` or precompiled Tailwind utilities —
 * those are assembled in packages/ui.
 */
export function buildSpiralAggregateCss(root) {
  return (
    buildCombinedStylesCss(root) +
    "\n" +
    buildStandaloneEffectsCss(root, { skipFocus: true }) +
    "\n" +
    buildAldThemeCss(root)
  );
}

/**
 * Resolve a `@aviala-design/tokens/<name>.css` subpath to its source file in
 * src/semantic, or null when it is not a standalone stylesheet (e.g.
 * styles.css / ald-theme.css are generated instead).
 */
export function resolveStandaloneCssSource(root, name) {
  if (!STANDALONE_CSS_RE.test(name)) return null;
  const path = join(root, "src/semantic", name);
  try {
    readFileSync(path, "utf8");
    return path;
  } catch {
    return null;
  }
}

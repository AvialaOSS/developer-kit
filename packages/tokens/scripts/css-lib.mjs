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
 * List the standalone semantic stylesheets ("button-effects.css",
 * "information-display-extras.css", …) with their absolute paths.
 */
export function listStandaloneCssFiles(root) {
  const dir = join(root, "src/semantic");
  return readdirSync(dir)
    .filter((name) => STANDALONE_CSS_RE.test(name))
    .map((name) => ({ name, path: join(dir, name) }));
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

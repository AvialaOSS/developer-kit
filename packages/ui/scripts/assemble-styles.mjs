import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { buildSpiralAggregateCss } from "../../tokens/scripts/css-lib.mjs";
import { compileAvialaUtilsCss } from "./compile-utils-css.mjs";

/**
 * Shared spiral `styles.css` assembly (aggregate + base + utils).
 * Keep SPIRAL_LAYER_BASE in sync with packages/tokens/vite-plugin.mjs.
 */

const __dirname = dirname(fileURLToPath(import.meta.url));
export const tokensRoot = join(__dirname, "../../tokens");

export const SPIRAL_LAYER_BASE = `@layer base {
  * {
    border-color: var(--border);
  }
  body {
    background-color: var(--background);
    color: var(--foreground);
    font-family: var(--font-sans);
    -webkit-font-smoothing: antialiased;
  }
}
`;

/**
 * Full `@aviala-design/spiral/styles.css` contents.
 */
export async function buildSpiralStylesCss(root = tokensRoot) {
  const aggregate = buildSpiralAggregateCss(root);
  const utils = await compileAvialaUtilsCss();
  return `${aggregate}

${SPIRAL_LAYER_BASE}

${utils}
`;
}

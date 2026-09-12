import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

/**
 * Build-time compile of residual Tailwind utilities used in packages/ui TSX.
 *
 * Output is intended for `@layer aviala-utils` inside spiral `styles.css` so
 * consumers do not need Tailwind / `@source`. Delete this step once component
 * token migration clears residual utilities (see residual-tailwind-utilities.md).
 */

const __dirname = dirname(fileURLToPath(import.meta.url));
const uiRoot = join(__dirname, "..");

const UTILS_INPUT = `@import "tailwindcss/theme" layer(theme);
@import "tailwindcss/utilities" layer(aviala-utils);

/* Library sources only — stories / demos stay out of the published sheet */
@source "./src";
@source not "./src/**/*.stories.tsx";
@source not "./src/**/*.stories.ts";
@source not "./src/**/*.test.ts";
@source not "./src/**/*.test.tsx";
`;

/**
 * Resolve @tailwindcss/node + oxide from this package's node_modules
 * (devDependencies). Fail with a clear message if missing.
 */
async function loadTailwindToolchain() {
  try {
    const nodeUrl = pathToFileURL(
      join(uiRoot, "node_modules/@tailwindcss/node/dist/index.mjs")
    ).href;
    const oxideUrl = pathToFileURL(
      join(uiRoot, "node_modules/@tailwindcss/oxide/index.js")
    ).href;
    const [{ compile }, oxide] = await Promise.all([
      import(nodeUrl),
      import(oxideUrl),
    ]);
    return { compile, Scanner: oxide.Scanner };
  } catch (err) {
    // pnpm may hoist — fall back to bare package names
    try {
      const [{ compile }, oxide] = await Promise.all([
        import("@tailwindcss/node"),
        import("@tailwindcss/oxide"),
      ]);
      return { compile, Scanner: oxide.Scanner };
    } catch {
      throw new Error(
        `Failed to load Tailwind build toolchain (${err?.message ?? err}). ` +
          "Ensure packages/ui lists tailwindcss, @tailwindcss/node, and @tailwindcss/oxide as devDependencies."
      );
    }
  }
}

/**
 * Compile residual utilities to a CSS string (includes theme vars needed by
 * those utilities). Empty string is not expected while utilities remain.
 */
export async function compileAvialaUtilsCss() {
  const { compile, Scanner } = await loadTailwindToolchain();
  const compiler = await compile(UTILS_INPUT, {
    base: uiRoot,
    from: join(uiRoot, "scripts/aviala-utils.entry.css"),
    onDependency() {},
  });

  const sources = (
    compiler.root === "none"
      ? []
      : compiler.root === null
        ? [{ base: uiRoot, pattern: "**/*", negated: false }]
        : [{ ...compiler.root, negated: false }]
  ).concat(compiler.sources);

  const scanner = new Scanner({ sources });
  const candidates = scanner.scan();
  const css = compiler.build(candidates);

  return (
    "/* Residual Tailwind utilities — generated at spiral build; do not edit */\n" +
    css
  );
}

// CLI: node scripts/compile-utils-css.mjs → stdout
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const css = await compileAvialaUtilsCss();
  process.stdout.write(css);
}

import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { assertStandaloneCssManifest } from "../../tokens/scripts/css-lib.mjs";

/**
 * No-Tailwind smoke: assert published spiral styles.css is self-contained
 * enough for a Hello Primary Button (effects + ald theme + residual utils).
 *
 * Run after `pnpm --filter @aviala-design/spiral build:styles` (or full build).
 */

const __dirname = dirname(fileURLToPath(import.meta.url));
const tokensRoot = join(__dirname, "../../tokens");
const stylesPath = join(__dirname, "../dist/styles.css");

assertStandaloneCssManifest(tokensRoot);

if (!existsSync(stylesPath)) {
  console.error(
    `Missing ${stylesPath}. Run build:styles (or full package build) first.`
  );
  process.exit(1);
}

const css = readFileSync(stylesPath, "utf8");

const required = [
  { label: "button effects", re: /\.aviala-button\b/ },
  { label: "typeface effects", re: /\.aviala-typeface\b|\.aviala-text\b/ },
  { label: "loading effects", re: /\.aviala-loading\b/ },
  { label: "focus ring", re: /\.aviala-focus-ring\b/ },
  { label: "ALD theme", re: /:root\[data-theme="ald"\]/ },
  { label: "spiral base layer", re: /@layer\s+base\b/ },
  {
    label: "aviala-utils layer",
    re: /@layer\s+aviala-utils\b|layer\(aviala-utils\)/,
  },
  { label: "inline-flex utility", re: /\.inline-flex\b/ },
  { label: "items-center utility", re: /\.items-center\b/ },
  { label: "relative utility", re: /\.relative\b/ },
];

const missing = required.filter(({ re }) => !re.test(css));
if (missing.length) {
  console.error(
    "spiral styles.css smoke failed — missing:\n" +
      missing.map((m) => `  - ${m.label}`).join("\n")
  );
  process.exit(1);
}

// Ensure we did not leave a consumer Tailwind peer requirement in package.json
const pkg = JSON.parse(
  readFileSync(join(__dirname, "../package.json"), "utf8")
);
if (pkg.peerDependencies?.tailwindcss || pkg.dependencies?.tailwindcss) {
  console.error(
    "tailwindcss must not be a runtime/peer dependency of @aviala-design/spiral"
  );
  process.exit(1);
}
if (!pkg.devDependencies?.tailwindcss) {
  console.error(
    "tailwindcss should remain a build-time (devDependency) of @aviala-design/spiral"
  );
  process.exit(1);
}

console.log(
  `OK: styles.css smoke passed (${(Buffer.byteLength(css, "utf8") / 1024).toFixed(1)} KiB raw, no consumer Tailwind required)`
);

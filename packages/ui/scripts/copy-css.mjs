import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { buildSpiralStylesCss } from "./assemble-styles.mjs";

/**
 * Write `@aviala-design/spiral/styles.css` into dist/.
 * See assemble-styles.mjs for composition.
 */

const __dirname = dirname(fileURLToPath(import.meta.url));
const dist = join(__dirname, "../dist");

mkdirSync(dist, { recursive: true });

const css = await buildSpiralStylesCss();
writeFileSync(join(dist, "styles.css"), css);
console.log(
  `Built dist/styles.css (${(Buffer.byteLength(css, "utf8") / 1024).toFixed(1)} KiB raw)`
);

function patchKeyboardFocusDts(filePath) {
  let content = readFileSync(filePath, "utf8");
  if (content.includes("initKeyboardFocus")) return;

  content = content.replace(
    /declare function cn\(/,
    "/** Installs keyboard-modality gate for `.aviala-focus-ring` (`html[data-aviala-kbd]`). Auto-run by ThemeProvider. */\ndeclare function initKeyboardFocus(): void;\ndeclare function cn("
  );
  content = content.replace(
    /ThemeScript, Tooltip,/,
    "ThemeScript, initKeyboardFocus, Tooltip,"
  );
  writeFileSync(filePath, content);
}

// The d.ts patch only applies when tsup has already emitted declarations —
// skip silently so this script can also run standalone (`build:styles`).
for (const file of ["index.d.ts", "index.d.cts"]) {
  const filePath = join(dist, file);
  if (existsSync(filePath)) patchKeyboardFocusDts(filePath);
}

import { readFileSync, writeFileSync } from "node:fs";
import { addPresetColors } from "../packages/tokens/dist/project.js";

const path = new URL(
  "../packages/tokens/source/theme-engine/ald.project.json",
  import.meta.url
);
const before = JSON.parse(readFileSync(path, "utf8"));
const after = addPresetColors(before);
if (JSON.stringify(after) !== JSON.stringify(before))
  writeFileSync(path, JSON.stringify(after, null, 2) + "\n");
console.log(
  `Added ${after.tokens.length - before.tokens.length} preset definitions; ADC holds ramps, colorSystem holds aliases`
);

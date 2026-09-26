import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { projectApi } from "./project-api.mjs";
import { THEME_ALIASES } from "./themebuilder-css.mjs";

const output = new URL(
  "../source/theme-engine/ald.project.json",
  import.meta.url
);
if (existsSync(output))
  throw new Error(
    "The standard project already exists; merge a candidate instead of overwriting it"
  );
const candidate = JSON.parse(
  readFileSync(
    new URL("../source/theme-engine/import-candidate.json", import.meta.url),
    "utf8"
  )
);
const project = projectApi.parseProject(JSON.stringify(candidate.project));
const names = new Map(
  project.tokens.map((token) => [projectApi.tokenCssName(token), token.id])
);
for (const [name, target] of THEME_ALIASES) {
  const targetId = names.get(target);
  if (!targetId) throw new Error(`Unknown alias target: ${target}`);
  project.cssCompatibility.push({ name, targetId });
  names.set(name, targetId);
}
projectApi.parseProject(JSON.stringify(project));
writeFileSync(output, JSON.stringify(project, null, 2) + "\n", { flag: "wx" });
console.log(`Initialized standard project: ${project.tokens.length} tokens`);

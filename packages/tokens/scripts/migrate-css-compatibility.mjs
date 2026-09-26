import { readFileSync, writeFileSync, renameSync } from "node:fs";
import { randomUUID } from "node:crypto";
import { projectApi } from "./project-api.mjs";
import { THEME_ALIASES } from "./themebuilder-css.mjs";

const file = new URL(
  "../source/theme-engine/ald.project.json",
  import.meta.url
);
const project = projectApi.parseProject(readFileSync(file, "utf8"));
const names = new Map(
  project.tokens.map((token) => [projectApi.tokenCssName(token), token.id])
);
for (const alias of project.cssCompatibility)
  names.set(alias.name, alias.targetId);
let added = 0;
for (const [name, target] of THEME_ALIASES) {
  const targetId = names.get(target);
  if (!targetId) throw new Error(`Missing alias target: ${target}`);
  if (names.has(name)) {
    if (names.get(name) !== targetId)
      throw new Error(`Conflicting alias: ${name}`);
    continue;
  }
  project.cssCompatibility.push({ name, targetId });
  names.set(name, targetId);
  added++;
}
if (added) {
  project.draftRevision++;
  projectApi.parseProject(JSON.stringify(project));
  const temporary = new URL(`./ald.project.${randomUUID()}.tmp`, file);
  writeFileSync(temporary, JSON.stringify(project, null, 2) + "\n");
  renameSync(temporary, file);
}
console.log(`Added ${added} CSS compatibility aliases`);

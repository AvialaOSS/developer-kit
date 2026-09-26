import assert from "node:assert/strict";
import { readFileSync, writeFileSync, renameSync } from "node:fs";
import { randomUUID } from "node:crypto";
import { projectApi } from "./project-api.mjs";

const path = new URL(
  "../source/theme-engine/ald.project.json",
  import.meta.url
);
const project = projectApi.parseProject(readFileSync(path, "utf8"));
const candidate = JSON.parse(
  readFileSync(
    new URL("../source/theme-engine/import-candidate.json", import.meta.url),
    "utf8"
  )
);
if (candidate.project.id !== project.id)
  throw new Error("Candidate belongs to a different project");
const before = structuredClone(project);
const imported = new Map(
  candidate.project.tokens.map((token) => [token.id, token])
);
let count = 0;
for (const token of project.tokens) {
  const seed = imported.get(token.id);
  // Only release names that still match both the known import and default path.
  if (
    token.cssName &&
    seed &&
    token.cssName === seed.cssName &&
    JSON.stringify(token.path) === JSON.stringify(seed.path) &&
    token.cssName === projectApi.tokenCssName({ path: token.path })
  ) {
    delete token.cssName;
    count++;
  }
}
for (const color of ["Light", "Dark"])
  for (const density of ["Default", "Mobile Friendly"])
    for (const effects of ["ON", "OFF"]) {
      const selection = { color, density, effects };
      assert.deepEqual(
        projectApi.projectCssVariables(project, selection),
        projectApi.projectCssVariables(before, selection)
      );
    }
if (count) {
  project.draftRevision++;
  const temporary = new URL(`ald.project.${randomUUID()}.tmp`, path);
  writeFileSync(temporary, JSON.stringify(project, null, 2) + "\n");
  renameSync(temporary, path);
}
console.log(
  `Converted ${count} imported names to automatic paths; all 8 CSS mode maps unchanged.`
);

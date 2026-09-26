import { randomUUID } from "node:crypto";
import {
  mkdirSync,
  readFileSync,
  writeFileSync,
  renameSync,
  existsSync,
} from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { importVariableSnapshot } from "../dist/project.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (file) => JSON.parse(readFileSync(file, "utf8"));
const local = read(join(root, "source/themebuilder/components.variables.json"));
const dependencies = read(
  join(root, "source/themebuilder/components.dependencies.json")
);
const snapshot = {
  collections: [...local.collections, ...dependencies.collections],
  variables: [...local.variables, ...dependencies.variables],
};
const output = join(root, "source/theme-engine/import-candidate.json");
const units = read(join(root, "source/theme-engine/import-units.json"));
if (units.source !== local.file)
  throw new Error("Numeric unit configuration belongs to a different source");
const previous = existsSync(output) ? read(output) : undefined;
if (previous && previous.source !== local.file)
  throw new Error("Existing import candidate belongs to a different source");
// Persist roles by source identity so display-name edits cannot change semantics.
const collections = read(
  join(root, "source/theme-engine/import-collections.json")
);
if (collections.source !== local.file)
  throw new Error("Collection configuration belongs to a different source");
const imported = importVariableSnapshot(snapshot, {
  projectId: previous?.project.id ?? `project_${randomUUID()}`,
  source: local.file,
  bindings: previous?.bindings,
  createId: (kind) => `${kind}_${randomUUID()}`,
  numericUnits: units.numericUnits,
  remPixels: units.remPixels,
  requireExplicitNumericUnits: true,
  rules: collections.rules,
});
const envelope = {
  format: "theme-engine-import-candidate",
  version: 1,
  source: local.file,
  sourceExportedAt: local.exportedAt,
  ...imported,
};
// The candidate and its identity bindings form one atomic file; no draft is overwritten.
mkdirSync(dirname(output), { recursive: true });
const temporary = `${output}.${randomUUID()}.tmp`;
writeFileSync(temporary, JSON.stringify(envelope, null, 2) + "\n");
renameSync(temporary, output);
console.log(
  `Prepared ${imported.project.tokens.length} tokens with ${imported.bindings.length} source bindings`
);

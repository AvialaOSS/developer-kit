import { randomUUID } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { importThemeBuilderSnapshot } from "../dist/project.js";

const [projectFile, configFile, outputFile] = process.argv.slice(2);
if (!projectFile || !configFile || !outputFile)
  throw new Error(
    "Usage: import-themebuilder-project.mjs EDITOR_PROJECT CONFIG NEW_CANDIDATE"
  );
const read = async (file) => JSON.parse(await readFile(file, "utf8"));
const editorProject = await read(projectFile);
const config = await read(configFile);
if (
  editorProject?.schemaVersion !== 1 ||
  typeof editorProject.id !== "string" ||
  !editorProject.id.trim()
)
  throw new Error("Unsupported ThemeBuilder project identity or version");
const source = `themebuilder:${editorProject.id}`;
if (config.source !== source)
  throw new Error("Import configuration belongs to a different editor project");
if (typeof config.projectId !== "string" || !config.projectId.trim())
  throw new Error(
    "A stable standard projectId is required in the import configuration"
  );
const imported = importThemeBuilderSnapshot(editorProject, {
  projectId: config.projectId,
  source,
  bindings: config.bindings ?? [],
  rules: config.rules,
  numericUnits: config.numericUnits,
  remPixels: config.remPixels,
  requireExplicitNumericUnits: true,
  createId: (kind) => `${kind}_${randomUUID()}`,
});
const candidate = {
  format: "theme-engine-import-candidate",
  version: 1,
  source,
  ...imported,
  // Keep editor-only metadata and Figma provenance outside the portable model.
  // The host must persist this sidecar alongside any accepted standard draft.
  editorProject,
};
await writeFile(outputFile, JSON.stringify(candidate, null, 2) + "\n", {
  flag: "wx",
});
console.log(
  `Prepared ${imported.project.tokens.length} tokens; editor project preserved. No draft or release was changed.`
);

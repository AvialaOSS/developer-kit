import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const inputPath = process.argv[2] ? resolve(process.argv[2]) : null;
const usage = "Usage: pnpm sync:themebuilder <project-or-snapshot.json>";

if (
  !inputPath ||
  process.argv.includes("--help") ||
  process.argv.includes("-h")
) {
  console.log(usage);
  process.exit(inputPath ? 0 : 1);
}

const input = JSON.parse(readFileSync(inputPath, "utf8"));
const source = input.data ?? input;
if (!Array.isArray(source.collections) || !Array.isArray(source.variables)) {
  throw new Error("ThemeBuilder export is missing collections or variables");
}

const encode = (value) => {
  if (value.kind === "alias") return ["a", value.target];
  if (value.kind === "literal") return ["l", value.value];
  if (value.kind === "composed") {
    return ["c", encode(value.color), encode(value.opacity)];
  }
  throw new Error(`Unsupported ThemeBuilder value: ${JSON.stringify(value)}`);
};

const collectionRows = source.collections.map((collection) => ({
  id: collection.id,
  name: collection.name,
  modes: collection.modes.map((mode) => ({ id: mode.id, name: mode.name })),
  defaultModeId: collection.defaultModeId,
  hiddenFromPublishing: collection.metadata?.hiddenFromPublishing ?? false,
  remote: collection.metadata?.remote ?? false,
  isExtension: collection.metadata?.isExtension ?? false,
}));
const collectionById = new Map(collectionRows.map((item) => [item.id, item]));
const variableRows = source.variables.map((variable) => ({
  i: variable.id,
  n: variable.name,
  t: variable.type,
  c: variable.collectionId,
  s: variable.metadata?.scopes ?? [],
  x: variable.metadata?.codeSyntax ?? {},
  v: Object.entries(variable.values).map(([mode, value]) => [
    mode,
    encode(value),
  ]),
  external: variable.external ?? false,
}));

for (const variable of variableRows) {
  if (!collectionById.has(variable.c)) {
    throw new Error(`Variable ${variable.n} references a missing collection`);
  }
}

const dependencyCollections = new Set(
  variableRows
    .filter(
      (variable) => variable.external || collectionById.get(variable.c).remote
    )
    .map((variable) => variable.c)
);
const outputDir = join(root, "source/themebuilder");
mkdirSync(outputDir, { recursive: true });

const write = (name, collections, variables, format) => {
  const payload = {
    format,
    version: 1,
    file: input.file ?? input.figmaFiles?.[0]?.id ?? null,
    name: input.name ?? "Components",
    exportedAt: input.exportedAt ?? input.updatedAt ?? new Date().toISOString(),
    collections,
    variables: variables.map(
      ({ external: _external, ...variable }) => variable
    ),
  };
  writeFileSync(join(outputDir, name), JSON.stringify(payload, null, 2) + "\n");
};

write(
  "components.variables.json",
  collectionRows.filter(
    (collection) => !dependencyCollections.has(collection.id)
  ),
  variableRows.filter((variable) => !dependencyCollections.has(variable.c)),
  "spiral-figma-variables"
);
write(
  "components.dependencies.json",
  collectionRows.filter((collection) =>
    dependencyCollections.has(collection.id)
  ),
  variableRows.filter((variable) => dependencyCollections.has(variable.c)),
  "spiral-figma-variable-dependencies"
);

console.log(
  `Synced ${variableRows.length} ThemeBuilder variables (${dependencyCollections.size} dependency collections)`
);

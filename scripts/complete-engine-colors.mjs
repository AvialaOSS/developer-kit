import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import { createProjectRelease } from "../packages/tokens/dist/project.js";
const root = new URL("../packages/tokens/source/", import.meta.url);
const projectPath = new URL("theme-engine/ald.project.json", root);
const provenancePath = new URL("theme-engine/ald-color-provenance.json", root);
const project = JSON.parse(readFileSync(projectPath, "utf8"));
const collection = project.collections.find(
  (c) => c.name === "Aviala Design Colors"
);
if (!collection) throw Error("Missing color collection");
const sources = Object.fromEntries(
  ["Light", "Dark"].map((mode) => [
    mode,
    JSON.parse(
      readFileSync(
        new URL("ald/Aviala Design Colors/" + mode + ".tokens.json", root),
        "utf8"
      )
    ),
  ])
);
const leaves = new Map();
function walk(node, path = []) {
  for (const [name, value] of Object.entries(node)) {
    if (name.startsWith("$")) continue;
    if (value?.$type === "color")
      leaves.set([...path, name].join("/"), { path: [...path, name], value });
    else if (value && typeof value === "object") walk(value, [...path, name]);
  }
}
walk(sources.Light);
const provenance = existsSync(provenancePath)
  ? JSON.parse(readFileSync(provenancePath, "utf8"))
  : [];
let added = 0;
for (const [name, { path, value }] of leaves) {
  if (
    project.tokens.some(
      (t) => t.collectionId === collection.id && t.path.join("/") === name
    )
  )
    continue;
  const externalId = value.$extensions?.["com.figma.variableId"];
  if (!externalId) throw Error("Missing Figma identity: " + name);
  const id =
    "token_" +
    createHash("sha256")
      .update(project.id + "\0Aviala Design Colors\0" + externalId)
      .digest("hex")
      .slice(0, 32);
  const valuesByMode = {};
  for (const mode of collection.modes) {
    const entry = path.reduce((o, k) => o?.[k], sources[mode.name]);
    if (!entry || entry.$extensions?.["com.figma.variableId"] !== externalId)
      throw Error("Missing mode or inconsistent identity: " + name);
    const v = entry.$value;
    if (v.colorSpace !== "srgb" || !Array.isArray(v.components))
      throw Error("Unsupported color: " + name);
    valuesByMode[mode.id] = {
      kind: "literal",
      value: {
        r: v.components[0],
        g: v.components[1],
        b: v.components[2],
        a: v.alpha ?? 1,
      },
    };
  }
  project.tokens.push({
    id,
    collectionId: collection.id,
    path,
    layer: "foundation",
    type: "color",
    cssName: "--aviala-" + path.join("-"),
    valuesByMode,
  });
  provenance.push({
    engineId: id,
    externalId,
    collection: "Aviala Design Colors",
    path: name,
    source: "ald/Aviala Design Colors",
    fileIdentityVerified: false,
  });
  added++;
}
if (added) project.draftRevision++;
await createProjectRelease(project, "0.1.1", async (text) =>
  createHash("sha256").update(text).digest("hex")
);
writeFileSync(projectPath, JSON.stringify(project, null, 2) + "\n");
writeFileSync(provenancePath, JSON.stringify(provenance, null, 2) + "\n");
console.log(
  JSON.stringify({
    added,
    colors: project.tokens.filter((t) => t.collectionId === collection.id)
      .length,
  })
);

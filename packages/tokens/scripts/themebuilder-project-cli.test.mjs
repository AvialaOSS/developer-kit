import assert from "node:assert/strict";
import test from "node:test";
import {
  mkdtemp,
  readFile,
  writeFile,
  readdir,
  unlink,
  rmdir,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

test("editor conversion preserves metadata, rejects unsafe inputs and never overwrites output", async (t) => {
  const directory = await mkdtemp(join(tmpdir(), "themebuilder-import-"));
  t.after(async () => {
    for (const name of await readdir(directory))
      await unlink(join(directory, name));
    await rmdir(directory);
  });
  const input = join(directory, "project.json"),
    configFile = join(directory, "config.json"),
    output = join(directory, "candidate.json");
  const editor = {
    schemaVersion: 1,
    id: "editor",
    name: "Fixture",
    updatedAt: "2026-09-21",
    collections: [
      {
        id: "c",
        name: "Numbers",
        defaultModeId: "m",
        modes: [{ id: "m", name: "Default" }],
      },
    ],
    variables: [
      {
        id: "v",
        collectionId: "c",
        name: "size",
        type: "FLOAT",
        values: { m: { kind: "literal", value: 12 } },
      },
    ],
    templates: [{ id: "template", pattern: "{state}" }],
    vocabularies: [{ id: "states", words: ["default"] }],
    figmaFiles: [{ id: "figma-file", name: "Components" }],
    baseline: { collections: [], variables: [] },
  };
  const config = {
    source: "themebuilder:editor",
    projectId: "engine",
    rules: { c: { axis: "none", layer: "foundation", css: "path" } },
    numericUnits: { v: "px" },
  };
  await writeFile(input, JSON.stringify(editor));
  await writeFile(configFile, JSON.stringify(config));
  const run = (destination) =>
    spawnSync(
      process.execPath,
      [
        fileURLToPath(
          new URL("./import-themebuilder-project.mjs", import.meta.url)
        ),
        input,
        configFile,
        destination,
      ],
      { encoding: "utf8" }
    );
  const first = run(output);
  assert.equal(first.status, 0, first.stderr);
  const original = await readFile(output, "utf8"),
    candidate = JSON.parse(original);
  assert.deepEqual(candidate.editorProject, editor);
  assert.equal(candidate.project.id, "engine");
  assert.equal(candidate.project.tokens.length, 1);
  assert.equal("templates" in candidate.project, false);
  assert.notEqual(run(output).status, 0);
  assert.equal(await readFile(output, "utf8"), original);
  await writeFile(
    configFile,
    JSON.stringify({ ...config, bindings: candidate.bindings })
  );
  editor.variables[0].name = "renamed";
  await writeFile(input, JSON.stringify(editor));
  const secondOutput = join(directory, "second.json"),
    second = run(secondOutput);
  assert.equal(second.status, 0, second.stderr);
  assert.equal(
    JSON.parse(await readFile(secondOutput, "utf8")).project.tokens[0].id,
    candidate.project.tokens[0].id
  );
  await writeFile(
    configFile,
    JSON.stringify({ ...config, source: "themebuilder:other" })
  );
  const rejectedOutput = join(directory, "rejected.json");
  assert.notEqual(run(rejectedOutput).status, 0);
  await assert.rejects(readFile(rejectedOutput), { code: "ENOENT" });
  await writeFile(configFile, JSON.stringify({ ...config, numericUnits: {} }));
  assert.notEqual(run(rejectedOutput).status, 0);
  await assert.rejects(readFile(rejectedOutput), { code: "ENOENT" });
});

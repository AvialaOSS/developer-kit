import assert from "node:assert/strict";
import test from "node:test";
import { mkdtemp, readdir, unlink, rmdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import {
  readProjectStore,
  commitProjectStore,
  mergeStoredSnapshot,
} from "../dist/node.js";

const project = () => ({
  schemaVersion: 1,
  id: "test",
  draftRevision: 0,
  collections: [
    {
      id: "c",
      name: "Numbers",
      axis: "none",
      modes: [{ id: "m", name: "Default" }],
      defaultModeId: "m",
    },
  ],
  tokens: [
    {
      id: "t",
      collectionId: "c",
      path: ["size"],
      layer: "foundation",
      type: "number",
      unit: "px",
      valuesByMode: { m: { kind: "literal", value: 1 } },
    },
  ],
  cssCompatibility: [],
});
const state = () => ({
  version: 1,
  project: project(),
  sources: [{ source: "figma-file", baseline: project(), bindings: [] }],
});
async function fixture(t) {
  const directory = await mkdtemp(join(tmpdir(), "theme-engine-store-"));
  // This private test directory contains only files created by this test.
  t.after(async () => {
    for (const name of await readdir(directory))
      await unlink(join(directory, name));
    await rmdir(directory);
  });
  return join(directory, "project.json");
}

test("store uses create-only initialization and rejects stale revisions", async (t) => {
  const file = await fixture(t);
  const original = await commitProjectStore(file, state(), null);
  await assert.rejects(
    commitProjectStore(file, state(), null),
    /changed after preview/
  );
  const first = structuredClone(original.state),
    second = structuredClone(original.state);
  first.project.tokens[0].valuesByMode.m.value = 2;
  second.project.tokens[0].valuesByMode.m.value = 3;
  const attempts = await Promise.allSettled([
    commitProjectStore(file, first, original.revision),
    commitProjectStore(file, second, original.revision),
  ]);
  assert.equal(
    attempts.filter((result) => result.status === "fulfilled").length,
    1
  );
  const current = await readProjectStore(file);
  assert.ok(
    [2, 3].includes(current.state.project.tokens[0].valuesByMode.m.value)
  );
  await assert.rejects(
    commitProjectStore(file, state(), original.revision),
    /changed after preview/
  );
});

test("merge conflict writes nothing; explicit choice commits project and baseline together", async (t) => {
  const file = await fixture(t),
    initial = state();
  initial.project.tokens[0].valuesByMode.m.value = 2;
  const saved = await commitProjectStore(file, initial, null),
    before = await readFile(file, "utf8");
  const incoming = project();
  incoming.tokens[0].valuesByMode.m.value = 3;
  const conflict = await mergeStoredSnapshot(
    file,
    saved.revision,
    "figma-file",
    incoming,
    []
  );
  assert.equal(conflict.ok, false);
  assert.equal(await readFile(file, "utf8"), before);
  const accepted = await mergeStoredSnapshot(
    file,
    saved.revision,
    "figma-file",
    incoming,
    [],
    { [conflict.conflicts[0].key]: "incoming" }
  );
  assert.equal(accepted.ok, true);
  const result = await readProjectStore(file);
  assert.equal(result.state.project.tokens[0].valuesByMode.m.value, 3);
  assert.equal(
    result.state.sources[0].baseline.tokens[0].valuesByMode.m.value,
    3
  );
  assert.notEqual(result.revision, saved.revision);
});

test("invalid store metadata fails before replacing the existing file", async (t) => {
  const file = await fixture(t),
    saved = await commitProjectStore(file, state(), null);
  const invalid = { ...saved.state, unknown: true };
  await assert.rejects(
    commitProjectStore(file, invalid, saved.revision),
    /Invalid store fields/
  );
  assert.equal((await readProjectStore(file)).revision, saved.revision);
});

test("store rejects ambiguous Engine identities but retains retired source history", async (t) => {
  const file = await fixture(t);
  const original = state();
  original.sources[0].bindings = [
    { source: "figma-file", kind: "token", externalId: "old", engineId: "t", retired: true },
    { source: "figma-file", kind: "token", externalId: "current", engineId: "t" },
  ];
  const saved = await commitProjectStore(file, original, null);
  const ambiguous = structuredClone(saved.state);
  ambiguous.sources[0].bindings.push({
    source: "figma-file", kind: "token", externalId: "another", engineId: "t",
  });
  await assert.rejects(
    commitProjectStore(file, ambiguous, saved.revision),
    /Duplicate active Engine ID/
  );
  assert.equal((await readProjectStore(file)).revision, saved.revision);
  assert.deepEqual((await readProjectStore(file)).state.sources[0].bindings, original.sources[0].bindings);
});

import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import test from "node:test";
import ts from "typescript";

const compile = (name) =>
  ts.transpileModule(
    readFileSync(new URL(`../src/engine/${name}.ts`, import.meta.url), "utf8"),
    {
      compilerOptions: {
        target: ts.ScriptTarget.ES2022,
        module: ts.ModuleKind.ES2022,
      },
    }
  ).outputText;
const url = (value) =>
  `data:text/javascript;base64,${Buffer.from(value).toString("base64")}`;
const projectUrl = url(compile("project"));
const { mergeProjects, mergeSnapshotCandidate } = await import(
  url(
    compile("project-merge").replace('"./project"', JSON.stringify(projectUrl))
  )
);
const { parseProjectDraft, parseProject } = await import(projectUrl);
const {
  deleteProjectToken,
  renameProjectToken,
  findRetiredTokenCandidates,
  adoptRetiredTokenIdentity,
} = await import(
  url(
    compile("project-edit").replace('"./project"', JSON.stringify(projectUrl))
  )
);
const {
  createProjectRelease,
  verifyProjectRelease,
  materializeTheme,
  upgradeTheme,
  detachTheme,
  parseProjectRelease,
  parseThemeOverlay,
} = await import(
  url(
    compile("project-theme").replace('"./project"', JSON.stringify(projectUrl))
  )
);

test("release and overlay JSON reject unknown fields and invalid contents", async () => {
  const release = await createProjectRelease(fixture(), "1.0.0", hash);
  assert.deepEqual(
    await parseProjectRelease(JSON.stringify(release), hash),
    release
  );
  await assert.rejects(
    parseProjectRelease(JSON.stringify({ ...release, unknown: true }), hash),
    /Unknown field/
  );
  await assert.rejects(
    parseProjectRelease(JSON.stringify({ ...release, version: "next" }), hash),
    /version/
  );
  const theme = overlay(release);
  assert.deepEqual(
    await parseThemeOverlay(JSON.stringify(theme), release, hash),
    theme
  );
  await assert.rejects(
    parseThemeOverlay(
      JSON.stringify({ ...theme, unknown: true }),
      release,
      hash
    ),
    /Unknown field/
  );
  theme.overrides[0].value = { kind: "alias", targetId: "a", unknown: true };
  await assert.rejects(
    parseThemeOverlay(JSON.stringify(theme), release, hash),
    /unknown/
  );
  theme.overrides[0].value = { kind: "literal", value: "wrong type" };
  await assert.rejects(
    parseThemeOverlay(JSON.stringify(theme), release, hash),
    /number|literal/i
  );
});

test("an async hash cannot expose materialization to caller mutation", async () => {
  const release = await createProjectRelease(fixture(), "1.0.0", hash);
  const theme = overlay(release);
  let resume;
  const gate = new Promise((resolve) => {
    resume = resolve;
  });
  const pending = materializeTheme(theme, release, async (value) => {
    await gate;
    return hash(value);
  });
  theme.overrides[0].value = literal(999);
  resume();
  const result = await pending;
  assert.deepEqual(result.tokens[2].valuesByMode.m, alias("a"));
});
const hash = async (value) => createHash("sha256").update(value).digest("hex");
const literal = (value) => ({ kind: "literal", value });
const alias = (targetId) => ({ kind: "alias", targetId });
const fixture = () => ({
  schemaVersion: 1,
  id: "base",
  draftRevision: 1,
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
      id: "a",
      collectionId: "c",
      path: ["a"],
      layer: "foundation",
      type: "number",
      unit: "px",
      valuesByMode: { m: literal(4) },
    },
    {
      id: "b",
      collectionId: "c",
      path: ["b"],
      layer: "foundation",
      type: "number",
      unit: "px",
      valuesByMode: { m: literal(8) },
    },
    {
      id: "component",
      collectionId: "c",
      path: ["component", "gap"],
      layer: "component",
      type: "number",
      unit: "px",
      valuesByMode: { m: alias("b") },
    },
  ],
  cssCompatibility: [],
});
test("renames follow paths, retain old aliases, respect fixed CSS names and reject collisions", () => {
  const original = fixture();
  const next = renameProjectToken(original, "b", ["spacing", "small"]);
  assert.deepEqual(next.cssCompatibility, [{ name: "--b", targetId: "b" }]);
  assert.equal(next.tokens[2].valuesByMode.m.targetId, "b");
  assert.deepEqual(original.tokens[1].path, ["b"]);
  const restored = renameProjectToken(next, "b", ["b"]);
  assert.deepEqual(restored.cssCompatibility, [
    { name: "--spacing-small", targetId: "b" },
  ]);
  const fixed = fixture();
  fixed.tokens[1].cssName = "--fixed";
  assert.equal(
    renameProjectToken(fixed, "b", ["new"]).tokens[1].cssName,
    "--fixed"
  );
  const auto = renameProjectToken(fixed, "b", ["new"], { cssName: null });
  assert.equal(auto.tokens[1].cssName, undefined);
  assert.deepEqual(auto.cssCompatibility, [{ name: "--fixed", targetId: "b" }]);
  assert.throws(
    () => renameProjectToken(original, "b", ["a"]),
    /collision|Duplicate|duplicate/i
  );
  assert.equal(
    renameProjectToken(original, "b", ["b"]).draftRevision,
    original.draftRevision
  );
});

const overlay = (release) => ({
  id: "custom",
  base: {
    projectId: release.projectId,
    version: release.version,
    contentHash: release.contentHash,
  },
  overrides: [{ tokenId: "component", modeId: "m", value: alias("a") }],
});

test("three-way merge combines independent edits and retains CSS rename compatibility", () => {
  const base = fixture(),
    local = fixture(),
    incoming = fixture();
  local.tokens[0].valuesByMode.m = literal(6);
  incoming.tokens[0].path = ["renamed"];
  const result = mergeProjects(base, local, incoming);
  assert.equal(result.ok, true);
  assert.equal(result.project.tokens[0].valuesByMode.m.value, 6);
  assert.deepEqual(result.project.tokens[0].path, ["renamed"]);
  assert.ok(
    result.project.cssCompatibility.some(
      (item) => item.name === "--a" && item.targetId === "a"
    )
  );
  assert.deepEqual(base.tokens[0].path, ["a"]);
});

test("three-way conflicts require explicit choices and do not change the local draft", () => {
  const base = fixture(),
    local = fixture(),
    incoming = fixture();
  local.tokens[0].valuesByMode.m = literal(6);
  incoming.tokens[0].valuesByMode.m = literal(10);
  const before = JSON.stringify(local);
  const conflict = mergeProjects(base, local, incoming);
  assert.equal(conflict.ok, false);
  assert.equal(conflict.conflicts.length, 1);
  assert.equal(JSON.stringify(local), before);
  const result = mergeProjects(base, local, incoming, {
    [conflict.conflicts[0].key]: "incoming",
  });
  assert.equal(result.ok, true);
  assert.equal(result.project.tokens[0].valuesByMode.m.value, 10);
});

test("snapshot merge preserves Engine metadata and validates deleted dependencies", () => {
  const base = fixture(),
    local = fixture(),
    incoming = fixture();
  local.cssCompatibility = [{ name: "--legacy-b", targetId: "b" }];
  incoming.tokens = incoming.tokens.filter((item) => item.id !== "a");
  const result = mergeSnapshotCandidate(base, local, incoming);
  assert.equal(result.ok, true);
  assert.equal(result.project.cssCompatibility.length, 1);
  assert.equal(result.project.tombstones[0].id, "a");
  incoming.tokens = incoming.tokens.filter((item) => item.id !== "b");
  const invalid = mergeSnapshotCandidate(base, local, incoming);
  assert.equal(invalid.ok, false);
  assert.ok(invalid.diagnostics.some((item) => item.code === "alias-missing"));
});

test("deletion preserves identity metadata and same-name recreation needs explicit adoption", async () => {
  const original = fixture();
  const deleted = deleteProjectToken(original, "b");
  assert.equal(original.tokens.length, 3);
  assert.equal(deleted.tombstones[0].id, "b");
  assert.deepEqual(parseProjectDraft(JSON.stringify(deleted)), deleted);
  assert.throws(
    () => parseProject(JSON.stringify(deleted)),
    /Missing target b/
  );
  await assert.rejects(
    createProjectRelease(deleted, "1.0.0", hash),
    /Missing target b/
  );
  deleted.tokens.push({
    ...original.tokens[1],
    id: "new-b",
    valuesByMode: { m: literal(12) },
  });
  assert.equal(findRetiredTokenCandidates(deleted, "c", ["b"])[0].id, "b");
  assert.equal(deleted.tokens.at(-1).id, "new-b");
  assert.throws(
    () => parseProject(JSON.stringify(deleted)),
    /Missing target b/
  );
  const restored = adoptRetiredTokenIdentity(deleted, "new-b", "b");
  assert.equal(restored.tombstones.length, 0);
  assert.deepEqual(restored.tokens[1].valuesByMode.m, alias("b"));
  assert.equal(
    restored.tokens.find((token) => token.id === "b").valuesByMode.m.value,
    12
  );
  assert.doesNotThrow(() => parseProject(JSON.stringify(restored)));
});

test("identity adoption rejects incompatible units and retired metadata is validated", () => {
  const deleted = deleteProjectToken(fixture(), "b");
  deleted.tokens.push({
    id: "new-b",
    collectionId: "c",
    path: ["b"],
    layer: "foundation",
    type: "number",
    unit: "ratio",
    valuesByMode: { m: literal(0.5) },
  });
  assert.throws(
    () => adoptRetiredTokenIdentity(deleted, "new-b", "b"),
    /incompatible/
  );
  deleted.tombstones[0].deletedInRevision = 999;
  assert.throws(
    () => parseProjectDraft(JSON.stringify(deleted)),
    /retired token/
  );
});

test("release snapshot is immutable, verifiable and independent from its draft", async () => {
  const draft = fixture();
  const release = await createProjectRelease(draft, "1.0.0", hash);
  draft.tokens[0].valuesByMode.m.value = 12;
  assert.equal(release.project.tokens[0].valuesByMode.m.value, 4);
  assert.throws(() => {
    release.project.tokens[0].path[0] = "changed";
  }, TypeError);
  await assert.rejects(
    createProjectRelease(draft, "1.0.0", hash, [release]),
    /already exists/
  );
  const tampered = JSON.parse(JSON.stringify(release));
  tampered.project.tokens[0].valuesByMode.m.value = 100;
  await assert.rejects(verifyProjectRelease(tampered, hash), /hash mismatch/);
  delete draft.tokens[0].valuesByMode.m;
  await assert.rejects(
    createProjectRelease(draft, "1.1.0", hash),
    /Missing|missing/
  );
});

test("overlays preserve base values and require the exact release", async () => {
  const release = await createProjectRelease(fixture(), "1.0.0", hash);
  const theme = overlay(release);
  const materialized = await materializeTheme(theme, release, hash);
  assert.deepEqual(materialized.tokens[2].valuesByMode.m, alias("a"));
  assert.deepEqual(release.project.tokens[2].valuesByMode.m, alias("b"));
  theme.base.version = "2.0.0";
  await assert.rejects(materializeTheme(theme, release, hash), /exact base/);
});

test("upgrade conflicts preserve the old theme until explicit replacement or drop", async () => {
  const from = await createProjectRelease(fixture(), "1.0.0", hash);
  const draft = fixture();
  draft.tokens = draft.tokens.filter((token) => token.id !== "a");
  const to = await createProjectRelease(draft, "2.0.0", hash);
  const theme = overlay(from),
    original = JSON.stringify(theme);
  const conflict = await upgradeTheme(theme, from, to, hash);
  assert.equal(conflict.ok, false);
  assert.match(conflict.conflicts.join("\n"), /a/);
  assert.equal(JSON.stringify(theme), original);
  const replaced = await upgradeTheme(theme, from, to, hash, {
    tokenReplacements: { a: "b" },
  });
  assert.equal(replaced.ok, true);
  assert.deepEqual(replaced.theme.overrides[0].value, alias("b"));
  assert.equal(replaced.theme.base.version, "2.0.0");
  assert.equal(JSON.stringify(theme), original);
  theme.overrides = [{ tokenId: "a", modeId: "m", value: literal(9) }];
  assert.equal((await upgradeTheme(theme, from, to, hash)).ok, false);
  const dropped = await upgradeTheme(theme, from, to, hash, {
    dropOverrides: [{ tokenId: "a", modeId: "m" }],
  });
  assert.equal(dropped.ok, true);
  assert.equal(dropped.theme.overrides.length, 0);
});

test("detaching copies complete dependencies without flattening references", async () => {
  const release = await createProjectRelease(fixture(), "1.0.0", hash);
  const detached = await detachTheme(
    overlay(release),
    release,
    "independent",
    hash
  );
  assert.equal(detached.id, "independent");
  assert.equal(detached.tokens.length, 3);
  assert.deepEqual(detached.tokens[2].valuesByMode.m, alias("a"));
  detached.tokens[0].valuesByMode.m.value = 30;
  assert.equal(release.project.tokens[0].valuesByMode.m.value, 4);
});

test("detaching retains valid retired identity history and remains publishable", async () => {
  const draft = fixture();
  draft.tokens.push({
    ...structuredClone(draft.tokens[0]),
    id: "retired",
    path: ["retired"],
  });
  const deleted = deleteProjectToken(draft, "retired");
  const release = await createProjectRelease(deleted, "1.0.0", hash);
  const original = JSON.stringify(release);
  const detached = await detachTheme(
    overlay(release),
    release,
    "independent",
    hash
  );
  assert.deepEqual(parseProject(JSON.stringify(detached)), detached);
  assert.deepEqual(detached.tombstones, release.project.tombstones);
  assert.equal(detached.draftRevision, release.project.draftRevision);
  assert.deepEqual(detached.tokens[2].valuesByMode.m, alias("a"));
  const independentRelease = await createProjectRelease(
    detached,
    "1.0.0",
    hash
  );
  assert.equal(independentRelease.projectId, "independent");
  assert.equal(JSON.stringify(release), original);
});

test("upgrade rejects stale decisions without changing the original theme", async () => {
  const from = await createProjectRelease(fixture(), "1.0.0", hash);
  const to = await createProjectRelease(fixture(), "1.1.0", hash);
  const theme = overlay(from),
    original = JSON.stringify(theme);
  for (const decisions of [
    { tokenReplacements: { b: "a" } },
    { modeReplacements: { unknown: "m" } },
    { modeReplacements: { m: "unknown" } },
    { dropOverrides: [{ tokenId: "unknown", modeId: "m" }] },
    { dropOverrides: [theme.overrides[0], theme.overrides[0]] },
  ]) {
    const result = await upgradeTheme(theme, from, to, hash, decisions);
    assert.equal(result.ok, false, JSON.stringify(decisions));
    assert.equal(JSON.stringify(theme), original);
  }
  const next = fixture();
  next.collections[0].modes[0].id = "replacement-mode";
  next.collections[0].defaultModeId = "replacement-mode";
  for (const token of next.tokens)
    token.valuesByMode = { "replacement-mode": token.valuesByMode.m };
  const changed = await createProjectRelease(next, "2.0.0", hash);
  const accepted = await upgradeTheme(theme, from, changed, hash, {
    modeReplacements: { m: "replacement-mode" },
  });
  assert.equal(accepted.ok, true);
  assert.equal(accepted.theme.overrides[0].modeId, "replacement-mode");
  assert.equal(JSON.stringify(theme), original);
});

test("upgrade rejects malformed decision payloads instead of silently ignoring them", async () => {
  const from = await createProjectRelease(fixture(), "1.0.0", hash);
  const to = await createProjectRelease(fixture(), "1.1.0", hash);
  const theme = overlay(from);
  const original = JSON.stringify({ theme, from, to });
  for (const decisions of [
    [],
    { dropOverride: [] },
    { tokenReplacements: [] },
    { tokenReplacements: null },
    { modeReplacements: "" },
    { dropOverrides: {} },
    { dropOverrides: [{ tokenId: "alias", modeId: "m", unexpected: true }] },
  ]) {
    const result = await upgradeTheme(theme, from, to, hash, decisions);
    assert.equal(result.ok, false, JSON.stringify(decisions));
    assert.equal(JSON.stringify({ theme, from, to }), original);
  }
});

test("upgrade cannot silently reinterpret retained overrides after a unit change", async () => {
  const from = await createProjectRelease(fixture(), "1.0.0", hash);
  const draft = fixture();
  draft.tokens[0].unit = "rem";
  const to = await createProjectRelease(draft, "2.0.0", hash);
  const theme = {
    ...overlay(from),
    overrides: [{ tokenId: "a", modeId: "m", value: literal(4) }],
  };
  const before = JSON.stringify({ theme, from, to });
  const conflict = await upgradeTheme(theme, from, to, hash);
  assert.equal(conflict.ok, false);
  assert.match(conflict.conflicts.join("\n"), /Incompatible.*a/);
  const replaced = await upgradeTheme(theme, from, to, hash, {
    tokenReplacements: { a: "b" },
  });
  assert.equal(replaced.ok, true);
  assert.equal(
    replaced.project.tokens.find((t) => t.id === "b").valuesByMode.m.value,
    4
  );
  const dropped = await upgradeTheme(theme, from, to, hash, {
    dropOverrides: [{ tokenId: "a", modeId: "m" }],
  });
  assert.equal(dropped.ok, true);
  assert.deepEqual(dropped.theme.overrides, []);
  assert.equal(JSON.stringify({ theme, from, to }), before);
});

test("upgrade rejects conflicting content under the same immutable version", async () => {
  const from = await createProjectRelease(fixture(), "1.0.0", hash);
  const draft = fixture();
  draft.tokens[0].valuesByMode.m = literal(8);
  const conflicting = await createProjectRelease(draft, "1.0.0", hash);
  const theme = overlay(from);
  const before = JSON.stringify({ theme, from, conflicting });
  const result = await upgradeTheme(theme, from, conflicting, hash);
  assert.equal(result.ok, false);
  assert.match(result.conflicts.join("\n"), /Conflicting immutable release/);
  assert.equal(JSON.stringify({ theme, from, conflicting }), before);
  assert.equal((await upgradeTheme(theme, from, from, hash)).ok, true);
  const next = await createProjectRelease(draft, "1.0.1", hash);
  assert.equal((await upgradeTheme(theme, from, next, hash)).ok, true);
});

test("removing public CSS names requires a major version and explicit migration list", async () => {
  const draft = fixture();
  draft.cssCompatibility.push({ name: "--old-a", targetId: "a" });
  const base = await createProjectRelease(draft, "1.0.0", hash);
  draft.cssCompatibility = [];
  await assert.rejects(
    createProjectRelease(draft, "1.1.0", hash, [base], ["--old-a"]),
    /major release/
  );
  await assert.rejects(
    createProjectRelease(draft, "2.0.0", hash, [base]),
    /approved migration/
  );
  const next = await createProjectRelease(
    draft,
    "2.0.0",
    hash,
    [base],
    ["--old-a"]
  );
  assert.equal(next.version, "2.0.0");
});

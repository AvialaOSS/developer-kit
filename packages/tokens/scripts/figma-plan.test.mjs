import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import ts from "typescript";

const url = (text) => `data:text/javascript;base64,${Buffer.from(text).toString("base64")}`;
const compile = (name) => ts.transpileModule(readFileSync(new URL(`../src/engine/${name}.ts`, import.meta.url), "utf8"), {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 },
}).outputText;
const core = url(compile("project"));
const { planFigmaValues, verifyFigmaReadback } = await import(url(compile("figma-plan").replace('"./project"', JSON.stringify(core))));
const { exportThemeBuilderSnapshot, createThemeBuilderChangePackage } = await import(url(compile("themebuilder-export").replace('"./project"', JSON.stringify(core))));

test("ThemeBuilder export keeps existing identities, percentage references and read-only dependencies", () => {
  const candidate = JSON.parse(readFileSync(new URL("../source/theme-engine/import-candidate.json", import.meta.url), "utf8"));
  const options = { source: candidate.source, bindings: candidate.bindings };
  const pack = createThemeBuilderChangePackage(candidate.project, candidate.project, "ALD", options);
  assert.deepEqual(pack.baseline, pack.target);
  assert.deepEqual(pack.target.variables.map(v => v.id).sort(), candidate.project.tokens.map(t => t.id).sort());
  assert.ok(pack.target.variables.some(v => v.external));
  for (const token of candidate.project.tokens) {
    const output = pack.target.variables.find(v => v.id === token.id);
    assert.equal(output.source.id, candidate.bindings.find(b => b.kind === "token" && b.engineId === token.id && !b.retired).externalId);
    for (const [mode, value] of Object.entries(token.valuesByMode)) {
      if (value.kind === "alias") assert.equal(output.values[mode].target, value.targetId);
      if (token.unit === "ratio" && value.kind === "literal") assert.equal(output.values[mode].value, value.value * 100);
      if (value.kind === "colorWithAlpha" && value.alpha.kind === "literal") assert.equal(output.values[mode].opacity.value, value.alpha.value * 100);
    }
  }
  assert.throws(() => createThemeBuilderChangePackage(candidate.project, candidate.project, "ALD", { ...options, bindings: [] }), /complete source/);
  assert.throws(() => exportThemeBuilderSnapshot(candidate.project, { ...options, bindings: [...options.bindings, options.bindings[0]] }), /Duplicate source/);
});

test("real project preflight names every restricted value without flattening references", () => {
  const project = JSON.parse(readFileSync(new URL("../source/theme-engine/ald.project.json", import.meta.url), "utf8"));
  const before = JSON.stringify(project);
  const plan = planFigmaValues(project);
  const expectedCount = project.tokens.reduce((n, token) => n + Object.keys(token.valuesByMode).length, 0);
  assert.equal(plan.length, expectedCount);
  const restricted = plan.filter((item) => item.disposition === "assistant");
  assert.ok(restricted.length > 0);
  for (const item of restricted) {
    assert.equal(item.expected.kind, "colorWithAlpha");
    assert.ok(item.instruction.includes(item.path));
    assert.ok(item.instruction.includes(item.modeName));
    assert.ok(item.instruction.includes(item.collectionName));
    assert.match(item.instruction, /回|核对/);
  }
  assert.equal(JSON.stringify(project), before);
  const protectedToken = project.tokens[0];
  const protectedPlan = planFigmaValues(project, { source: "file", bindings: [{
    source: "file", kind: "collection", externalId: "remote", engineId: protectedToken.collectionId, readOnly: true,
  }] });
  assert.ok(protectedPlan.filter((item) => item.collectionId === protectedToken.collectionId)
    .every((item) => item.disposition === "blocked" && item.reasons.includes("read-only-source")));
  plan[0].expected.kind = "modified";
  assert.equal(JSON.stringify(project), before);
});

test("timing is writable but unconfigured rem conversion and missing dependencies are rejected", () => {
  const project = {
    schemaVersion: 1, id: "p", draftRevision: 0, cssCompatibility: [],
    collections: [{ id: "c", name: "Values", axis: "none", defaultModeId: "m", modes: [{ id: "m", name: "Default" }] }],
    tokens: [
      { id: "duration", collectionId: "c", path: ["duration"], layer: "foundation", type: "duration", valuesByMode: { m: { kind: "literal", value: 200 } } },
      { id: "size", collectionId: "c", path: ["size"], layer: "foundation", type: "number", unit: "rem", valuesByMode: { m: { kind: "literal", value: 1 } } },
    ],
  };
  assert.deepEqual(planFigmaValues(project).map((v) => v.disposition), ["write", "blocked"]);
  project.tokens[0].valuesByMode.m = { kind: "alias", targetId: "missing" };
  assert.throws(() => planFigmaValues(project), /alias-missing/);
});

test("readback preserves alias identity and rejects partial or structurally different snapshots", () => {
  const project = {
    schemaVersion: 1, id: "p", draftRevision: 0, cssCompatibility: [],
    collections: [{ id: "c", name: "Values", axis: "none", defaultModeId: "m", modes: [{ id: "m", name: "Default" }] }],
    tokens: [
      { id: "base", collectionId: "c", path: ["base"], layer: "foundation", type: "number", unit: "px", valuesByMode: { m: { kind: "literal", value: 12 } } },
      { id: "alias", collectionId: "c", path: ["alias"], layer: "semantic", type: "number", unit: "px", valuesByMode: { m: { kind: "alias", targetId: "base" } } },
    ],
  };
  assert.equal(verifyFigmaReadback(project, structuredClone(project)).verified, true);
  const flat = structuredClone(project);
  flat.tokens[1].valuesByMode.m = { kind: "literal", value: 12 };
  const result = verifyFigmaReadback(project, flat);
  assert.equal(result.verified, false);
  assert.deepEqual(result.items[1].differences, ["value-or-reference"]);
  flat.tokens.pop();
  assert.equal(verifyFigmaReadback(project, flat).items[1].status, "missing");
  const extra = structuredClone(project);
  extra.collections.push({ id: "empty", name: "Empty", axis: "none", defaultModeId: "e", modes: [{ id: "e", name: "Default" }] });
  assert.equal(verifyFigmaReadback(project, extra).verified, false);
  const renamed = structuredClone(project);
  renamed.tokens[1].path = ["renamed"];
  assert.deepEqual(verifyFigmaReadback(project, renamed).items[1].differences, ["token-path"]);
});

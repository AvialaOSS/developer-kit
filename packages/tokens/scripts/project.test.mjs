import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import ts from "typescript";

// Transpile the portable module so tests also run on the supported Node 20 baseline.
const source = readFileSync(
  new URL("../src/engine/project.ts", import.meta.url),
  "utf8"
);
const compiled = ts.transpileModule(source, {
  compilerOptions: {
    target: ts.ScriptTarget.ES2022,
    module: ts.ModuleKind.ES2022,
  },
}).outputText;
const { validateProject, resolveProject, tokenCssName, parseProject } =
  await import(
    `data:text/javascript;base64,${Buffer.from(compiled).toString("base64")}`
  );
const literal = (value) => ({ kind: "literal", value });
const alias = (targetId) => ({ kind: "alias", targetId });
test("JSON boundary rejects malformed structures and preserves valid documents", () => {
  const project = fixture();
  assert.deepEqual(parseProject(JSON.stringify(project)), project);
  for (const value of [
    null,
    [],
    {},
    { ...project, tokens: [null] },
    { ...project, schemaVersion: 2 },
    { ...project, unexpected: true },
  ])
    assert.throws(
      () => parseProject(JSON.stringify(value)),
      /structure|schema/
    );
  project.tokens[0].valuesByMode.light = {
    kind: "literal",
    value: { r: 1, g: 1, b: 1 },
  };
  assert.throws(() => parseProject(JSON.stringify(project)), /value.a/);
});
test("JSON boundary validates semantics after structure", () => {
  const project = fixture();
  project.tokens[0].valuesByMode.light = alias("missing");
  assert.throws(() => parseProject(JSON.stringify(project)), /alias-missing/);
});

test("validation catches cycles formed by independent collection defaults", () => {
  const project = {
    schemaVersion: 1, id: "defaults", draftRevision: 0, cssCompatibility: [],
    collections: [
      { id: "a-col", name: "A", axis: "color", modes: [{ id: "light", name: "Light" }, { id: "dark", name: "Dark" }], defaultModeId: "dark" },
      { id: "b-col", name: "B", axis: "color", modes: [{ id: "light", name: "Light" }, { id: "dark", name: "Dark" }], defaultModeId: "light" },
    ],
    tokens: [
      { id: "a", collectionId: "a-col", path: ["a"], layer: "foundation", type: "number", unit: "px", valuesByMode: { light: literal(1), dark: alias("b") } },
      { id: "b", collectionId: "b-col", path: ["b"], layer: "foundation", type: "number", unit: "px", valuesByMode: { light: alias("a"), dark: literal(2) } },
    ],
  };
  // Explicit Light and Dark are acyclic; omitted color uses A/Dark + B/Light.
  const cycle = validateProject(project).find((issue) => issue.code === "resolution" && /cycle/.test(issue.message));
  assert.ok(cycle);
  assert.equal(cycle.tokenId, "a");
  assert.equal(cycle.path, "a");
  assert.equal(cycle.modeId, "dark");
  assert.throws(() => parseProject(JSON.stringify(project)), /cycle/);
  project.collections[0].defaultModeId = "light";
  assert.deepEqual(validateProject(project), []);
  assert.equal(resolveProject(project).b, 1);
  assert.equal(resolveProject(project, {color: "Dark"}).a, 2);
});
function fixture() {
  return {
    schemaVersion: 1,
    id: "project",
    draftRevision: 0,
    cssCompatibility: [],
    collections: [
      {
        id: "colors",
        name: "Renamable colors",
        axis: "color",
        modes: [
          { id: "light", name: "Light" },
          { id: "dark", name: "Dark" },
        ],
        defaultModeId: "light",
      },
      {
        id: "effects",
        name: "Effects",
        axis: "effects",
        modes: [
          { id: "on", name: "ON" },
          { id: "off", name: "OFF" },
        ],
        defaultModeId: "on",
      },
      {
        id: "components",
        name: "Components",
        axis: "none",
        modes: [{ id: "default", name: "Default" }],
        defaultModeId: "default",
      },
    ],
    tokens: [
      {
        id: "surface",
        collectionId: "colors",
        path: ["surface"],
        layer: "semantic",
        type: "color",
        valuesByMode: {
          light: literal({ r: 1, g: 1, b: 1, a: 0.5 }),
          dark: literal({ r: 0, g: 0, b: 0, a: 0.8 }),
        },
      },
      {
        id: "alpha",
        collectionId: "effects",
        path: ["alpha"],
        layer: "foundation",
        type: "number",
        unit: "ratio",
        valuesByMode: { on: literal(0.5), off: literal(0) },
      },
      {
        id: "component",
        collectionId: "components",
        path: ["scrollPicker", "background"],
        layer: "component",
        type: "color",
        valuesByMode: {
          default: {
            kind: "colorWithAlpha",
            color: alias("surface"),
            alpha: alias("alpha"),
          },
        },
      },
    ],
  };
}
test("independent axes follow target collection modes and multiply existing alpha", () => {
  const project = fixture();
  assert.deepEqual(validateProject(project), []);
  assert.deepEqual(
    resolveProject(project, { color: "Dark", effects: "ON" }).component,
    { r: 0, g: 0, b: 0, a: 0.4 }
  );
  assert.equal(
    resolveProject(project, { color: "Light", effects: "OFF" }).component.a,
    0
  );
  assert.equal(tokenCssName(project.tokens[2]), "--scroll-picker-background");
});
test("rename preserves ID references and explicit CSS names", () => {
  const project = fixture();
  project.tokens[0].path = ["newSurface"];
  project.tokens[0].cssName = "--stable-surface";
  assert.equal(resolveProject(project).component.a, 0.25);
  assert.equal(tokenCssName(project.tokens[0]), "--stable-surface");
});
test("missing values require explicit default inheritance", () => {
  const project = fixture();
  delete project.tokens[0].valuesByMode.dark;
  assert.ok(
    validateProject(project).some(
      (issue) => issue.code === "mode-value-missing"
    )
  );
  project.tokens[0].valuesByMode.dark = { kind: "inheritDefault" };
  assert.equal(resolveProject(project, { color: "Dark" }).surface.r, 1);
  project.tokens[0].valuesByMode.light = { kind: "inheritDefault" };
  assert.ok(
    validateProject(project).some(
      (issue) => issue.code === "default-inheritance"
    )
  );
});
test("cycles are detected in non-default modes", () => {
  const project = fixture();
  project.tokens[0].valuesByMode.dark = alias("component");
  assert.ok(
    validateProject(project).some(
      (issue) => issue.code === "resolution" && issue.message.includes("cycle")
    )
  );
});
test("invalid aliases, units and ranges cannot publish", () => {
  const project = fixture();
  project.tokens[2].valuesByMode.default = alias("absent");
  assert.ok(
    validateProject(project).some((issue) => issue.code === "alias-missing")
  );
  project.tokens[2].valuesByMode.default = alias("alpha");
  assert.ok(
    validateProject(project).some((issue) => issue.code === "alias-type")
  );
  project.tokens[1].valuesByMode.on = literal(50);
  assert.ok(validateProject(project).some((issue) => issue.code === "literal"));
});
test("CSS collisions include explicit and compatibility names", () => {
  const project = fixture();
  project.cssCompatibility.push({ name: "--surface", targetId: "component" });
  assert.ok(
    validateProject(project).some((issue) => issue.code === "css-name")
  );
});

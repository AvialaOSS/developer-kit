import assert from "node:assert/strict";
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
const url = (text) =>
  `data:text/javascript;base64,${Buffer.from(text).toString("base64")}`;
const projectUrl = url(compile("project"));
const { resolveProject } = await import(projectUrl);
const cssUrl = url(
  compile("project-css").replace('"./project"', JSON.stringify(projectUrl))
);
const { projectCssVariables, projectCssText } = await import(cssUrl);
const { applyProjectTheme, removeProjectTheme } = await import(
  url(
    compile("project-runtime").replace(
      '"./project-css"',
      JSON.stringify(cssUrl)
    )
  )
);
const { importVariableSnapshot, importThemeBuilderSnapshot, adoptTokenSourceBinding } = await import(
  url(
    compile("snapshot-adapter").replace(
      '"./project"',
      JSON.stringify(projectUrl)
    )
  )
);
const { exportThemeBuilderSnapshot } = await import(url(compile("themebuilder-export").replace('"./project"', JSON.stringify(projectUrl))));

test("string tokens use CSS escapes rather than JSON control escapes", () => {
  const value = '第一行\nA\tB\rC\fD\bE\\"\u0000\u007f';
  const project = {
    schemaVersion: 1, id: "strings", draftRevision: 0,
    collections: [{ id: "c", name: "Strings", axis: "none", defaultModeId: "m", modes: [{ id: "m", name: "Default" }] }],
    tokens: [{ id: "text", collectionId: "c", path: ["label"], layer: "foundation", type: "string", valuesByMode: { m: { kind: "literal", value } } }],
    cssCompatibility: [],
  };
  const expected = '"第一行\\a A\\9 B\\d C\\c D\\8 E\\\\\\"�\\7f "';
  const declarations = projectCssVariables(project);
  assert.equal(declarations["--label"], expected);
  assert.equal(projectCssText(project), `:root {\n  --label: ${expected};\n}\n`);
  const values = new Map();
  const target = { style: {
    getPropertyValue: (name) => values.get(name) ?? "",
    getPropertyPriority: () => "",
    setProperty: (name, text) => values.set(name, text),
    removeProperty: (name) => values.delete(name),
  } };
  applyProjectTheme(target, project);
  assert.equal(values.get("--label"), expected);
  assert.equal(project.tokens[0].valuesByMode.m.value, value);
});

test("timing seconds convert to CSS milliseconds and roundtrip without expanding aliases", () => {
  const source = {collections:[{id:"c",name:"QA",defaultModeId:"m",modes:[{id:"m",name:"Day"}]}],
    variables:[{i:"v",n:"motion/duration",t:"TIMING",c:"c",v:[["m",["l",0.25]]]},{i:"a",n:"motion/alias",t:"TIMING",c:"c",v:[["m",["a","v"]]]}]};
  let count=0;
  const imported=importVariableSnapshot(source,{projectId:"qa",source:"TestVar",rules:{c:{axis:"none",layer:"foundation",css:"path"}},createId:()=>`timing-${++count}`});
  assert.equal(Object.values(imported.project.tokens[0].valuesByMode)[0].value,250);
  const css=projectCssVariables(imported.project);
  assert.equal(css["--motion-duration"],"250ms");
  assert.equal(css["--motion-alias"],"var(--motion-duration)");
  const exported=exportThemeBuilderSnapshot(imported.project,{source:"TestVar",bindings:imported.bindings});
  assert.equal(exported.variables[0].type,"TIMING");
  assert.equal(Object.values(exported.variables[0].values)[0].value,0.25);
  assert.equal(Object.values(exported.variables[1].values)[0].target,imported.project.tokens[0].id);
});

test("observed TestVar custom easing preserves exact coordinates through import and export", () => {
  const curve = {type:"CUSTOM_CUBIC_BEZIER",easingFunctionCubicBezier:{x1:0.41999998688697815,y1:0,x2:0.5799999833106995,y2:1}};
  const source = {collections:[{id:"c",name:"QA",defaultModeId:"m",modes:[{id:"m",name:"Day"}]}],
    variables:[{i:"v",n:"qa/easing",t:"EASING",c:"c",v:[["m",["l",curve]]]}]};
  let count = 0;
  const imported = importVariableSnapshot(source,{projectId:"qa",source:"TestVar",rules:{c:{axis:"none",layer:"foundation",css:"path"}},createId:()=>`id-${++count}`});
  const output = exportThemeBuilderSnapshot(imported.project,{source:"TestVar",bindings:imported.bindings});
  assert.equal(output.variables[0].type,"EASING");
  assert.deepEqual(Object.values(output.variables[0].values)[0].value,curve);
  source.variables[0].v[0][1][1] = {type:"CUSTOM_SPRING",easingFunctionSpring:{bounce:0.5}};
  assert.throws(()=>importVariableSnapshot(source,{projectId:"qa",source:"TestVar",rules:{c:{axis:"none",layer:"foundation",css:"path"}},createId:()=>`id-${++count}`}),/Unsupported easing/);
});
const read = (file) =>
  JSON.parse(
    readFileSync(
      new URL(`../source/themebuilder/${file}`, import.meta.url),
      "utf8"
    )
  );

test("editor import keeps editor identity separate and preserves composed references", () => {
  const editor = {
    collections: [{ id: "c", name: "Editor", defaultModeId: "m", modes: [{ id: "m", name: "Default" }], source: { file: "figma", id: "figma-c" } }],
    variables: [
      { id: "color", name: "base", type: "COLOR", collectionId: "c", values: { m: { kind: "literal", value: { r: 1, g: 0, b: 0, a: 1 } } } },
      { id: "alpha", name: "alpha", type: "FLOAT", collectionId: "c", values: { m: { kind: "literal", value: 40 } } },
      { id: "mixed", name: "mixed", type: "COLOR", collectionId: "c", external: true, values: { m: { kind: "composed", color: { kind: "alias", target: "color" }, opacity: { kind: "alias", target: "alpha" } } } },
    ],
  };
  let next = 0;
  const config = { source: "themebuilder:project", projectId: "p", createId: () => `editor-${++next}`, rules: { c: { axis: "none", layer: "semantic", css: "path" } }, numericUnits: { alpha: "ratio" } };
  const first = importThemeBuilderSnapshot(editor, config);
  assert.equal(first.bindings.find(b => b.kind === "collection").externalId, "c");
  assert.ok(first.bindings.every(b => b.source === "themebuilder:project"));
  assert.equal(first.bindings.find(b => b.externalId === "mixed").readOnly, true);
  const mixed = first.project.tokens.find(t => t.path[0] === "mixed");
  assert.equal(resolveProject(first.project)[mixed.id].a, 0.4);
  assert.equal(Object.values(mixed.valuesByMode)[0].alpha.kind, "alias");
  editor.variables[0].name = "renamed";
  const again = importThemeBuilderSnapshot(editor, { ...config, bindings: first.bindings });
  assert.deepEqual(again.bindings, first.bindings);
  assert.throws(() => importThemeBuilderSnapshot(editor, { ...config, numericUnits: {} }), /Explicit numeric unit/);
  const missing = structuredClone(editor);
  missing.variables = missing.variables.filter(v => v.id !== "color");
  assert.throws(() => importThemeBuilderSnapshot(missing, config), /Missing dependency/);
});

test("explicit units preserve scalars and roundtrip rem aliases without guessing", () => {
  const source = { collections: [{ id: "c", name: "Numbers", defaultModeId: "m", modes: [{ id: "m", name: "Default" }] }],
    variables: [
      { i: "size", n: "custom/size", t: "FLOAT", c: "c", v: [["m", ["l", 24]]] },
      { i: "alias", n: "custom/alias", t: "FLOAT", c: "c", v: [["m", ["a", "size"]]] },
      { i: "count", n: "custom/count", t: "FLOAT", c: "c", v: [["m", ["l", 3]]] },
    ] };
  let next = 0;
  const options = { projectId: "units", source: "file", createId: () => `unit-${++next}`,
    rules: { c: { axis: "none", layer: "foundation", css: "path" } },
    requireExplicitNumericUnits: true, numericUnits: { size: "rem", count: "scalar" }, remPixels: 16 };
  const imported = importVariableSnapshot(source, options);
  const css = projectCssVariables(imported.project);
  assert.equal(css["--custom-size"], "1.5rem");
  assert.equal(css["--custom-alias"], "var(--custom-size)");
  assert.equal(css["--custom-count"], "3");
  const output = exportThemeBuilderSnapshot(imported.project, { source: "file", bindings: imported.bindings, remPixels: 16 });
  assert.equal(Object.values(output.variables[0].values)[0].value, 24);
  assert.equal(Object.values(output.variables[1].values)[0].target, imported.project.tokens[0].id);
  assert.throws(() => importVariableSnapshot(source, { ...options, numericUnits: {} }), /Explicit numeric unit required/);
  assert.throws(() => importVariableSnapshot(source, { ...options, remPixels: undefined }), /Explicit rem conversion required/);
  assert.throws(() => importVariableSnapshot(source, { ...options, numericUnits: { ...options.numericUnits, alias: "px" } }), /Inconsistent/);
  assert.throws(() => importVariableSnapshot(source, { ...options, numericUnits: { missing: "scalar" } }), /source FLOAT/);
  const deleted = structuredClone(source);
  deleted.variables = deleted.variables.filter(variable => variable.i !== "count");
  const afterDelete = importVariableSnapshot(deleted, { ...options, bindings: imported.bindings });
  assert.equal(afterDelete.project.tokens.length, 2);
  assert.deepEqual(afterDelete.bindings, imported.bindings);
  const recreated = structuredClone(deleted);
  recreated.variables.push({ ...source.variables[2], i: "new-count" });
  assert.throws(() => importVariableSnapshot(recreated, { ...options, bindings: afterDelete.bindings }), /Explicit numeric unit required/);
  const configured = importVariableSnapshot(recreated, { ...options, bindings: afterDelete.bindings, numericUnits: { ...options.numericUnits, "new-count": "scalar" } });
  assert.notEqual(configured.bindings.find(binding => binding.externalId === "new-count").engineId, imported.bindings.find(binding => binding.externalId === "count").engineId);
});
const local = read("components.variables.json"),
  deps = read("components.dependencies.json");
const snapshot = {
  collections: [...local.collections, ...deps.collections],
  variables: [...local.variables, ...deps.variables],
};
const roles = {
  numbers: { axis: "density", layer: "foundation", css: "leaf" },
  fontWeight: { axis: "none", layer: "foundation", css: "leaf" },
  colorSystem: { axis: "color", layer: "semantic", css: "path" },
  specialEffort: { axis: "effects", layer: "semantic", css: "path" },
  componentToken: { axis: "none", layer: "component", css: "path" },
  "Aviala Design Colors": {
    axis: "color",
    layer: "foundation",
    css: "palette",
  },
  control: { axis: "none", layer: "semantic", css: "path" },
};
let nextId = 0;
const options = {
  projectId: "ald",
  source: local.file,
  rules: Object.fromEntries(
    snapshot.collections.map((c) => [c.id, roles[c.name]])
  ),
  createId: (kind) => `${kind}_${++nextId}`,
};

test("remote capability stays in bindings and survives metadata omission", () => {
  const first = importVariableSnapshot(snapshot, options);
  const remote = snapshot.collections.find((c) => c.remote);
  const binding = first.bindings.find((b) => b.kind === "collection" && b.externalId === remote.id);
  assert.equal(binding.readOnly, true);
  const token = snapshot.variables.find((v) => v.c === remote.id);
  assert.equal(first.bindings.find((b) => b.kind === "token" && b.externalId === token.i).readOnly, true);
  assert.equal("readOnly" in first.project.tokens[0], false);
  const stripped = structuredClone(snapshot);
  for (const c of stripped.collections) { delete c.remote; delete c.isExtension; }
  for (const v of stripped.variables) delete v.remote;
  const again = importVariableSnapshot(stripped, { ...options, bindings: first.bindings });
  assert.equal(again.bindings.find((b) => b.engineId === binding.engineId).readOnly, true);
});

test("all eight mode combinations emit closed CSS graphs with no invalid numbers", () => {
  const { project } = importVariableSnapshot(snapshot, options);
  const small = project.tokens.find(
    (token) => token.path.join("/") === "size/size-small"
  );
  const remTokenIds = [small.id];
  for (const color of ["Light", "Dark"])
    for (const density of ["Default", "Mobile Friendly"])
      for (const effects of ["ON", "OFF"]) {
        const selection = { color, density, effects };
        const vars = projectCssVariables(project, selection, { remTokenIds });
        assert.equal(Object.keys(vars).length, snapshot.variables.length);
        assert.equal(
          vars["--size-small"],
          density === "Default" ? "0.75rem" : "1rem"
        );
        assert.equal(vars["--font-weight-semibold"], "600");
        assert.match(vars["--scroll-picker-color-background"], /^var\(/);
        for (const value of Object.values(vars)) {
          assert.doesNotMatch(value, /NaN|undefined|Infinity/);
          for (const [, target] of value.matchAll(/var\((--[\w-]+)\)/g))
            assert.ok(Object.hasOwn(vars, target), target);
        }
        const text = projectCssText(project, selection, {
          remTokenIds,
          selector: ".preview-theme",
        });
        assert.ok(text.startsWith(".preview-theme {"));
        for (const [name, value] of Object.entries(vars))
          assert.ok(text.includes(`  ${name}: ${value};`));
        if (effects === "OFF")
          assert.equal(vars["--light-effort-top"], "rgb(255 255 255 / 0)");
      }
});

test("persisted strict import units preserve the current eight-mode baseline", () => {
  const config = JSON.parse(readFileSync(new URL("../source/theme-engine/import-units.json", import.meta.url), "utf8"));
  const collections = JSON.parse(readFileSync(new URL("../source/theme-engine/import-collections.json", import.meta.url), "utf8"));
  assert.equal(config.source, local.file);
  assert.equal(collections.source, local.file);
  const previous = importVariableSnapshot(snapshot, options);
  const renamed = structuredClone(snapshot);
  renamed.collections.forEach((collection, index) => { collection.name = `Renamed collection ${index}`; });
  const strictOptions = {
    ...options, bindings: previous.bindings,
    rules: collections.rules,
    numericUnits: config.numericUnits, remPixels: config.remPixels,
    requireExplicitNumericUnits: true,
  };
  const strict = importVariableSnapshot(renamed, strictOptions);
  assert.deepEqual(strict.bindings, previous.bindings);
  assert.deepEqual(strict.project.tokens, previous.project.tokens);
  assert.deepEqual(strict.project.collections.map(c => [c.id, c.axis]), previous.project.collections.map(c => [c.id, c.axis]));
  const unknownCollection = structuredClone(renamed);
  unknownCollection.collections.push({ id: "unknown", name: "numbers", modes: [{ id: "new-mode", name: "Default" }], defaultModeId: "new-mode" });
  assert.throws(() => importVariableSnapshot(unknownCollection, strictOptions), /Missing import rule/);
  for (const color of ["Light", "Dark"])
    for (const density of ["Default", "Mobile Friendly"])
      for (const effects of ["ON", "OFF"]) {
        const selection = { color, density, effects };
        assert.deepEqual(projectCssVariables(strict.project, selection), projectCssVariables(previous.project, selection));
      }
});

test("CSS legacy reads remain linked, not copied literal values", () => {
  const { project } = importVariableSnapshot(snapshot, options);
  const token = project.tokens.find(
    (token) => token.path.join("/") === "padding/padding-littleSmall"
  );
  project.cssCompatibility.push({
    name: "--padding-littlesmall",
    targetId: token.id,
  });
  const vars = projectCssVariables(project);
  assert.equal(vars["--padding-littlesmall"], "var(--padding-little-small)");
  assert.throws(
    () => projectCssVariables(project, {}, { remTokenIds: ["missing"] }),
    /px token/
  );
});

test("runtime uses static declarations and only restores properties it still owns", () => {
  const { project } = importVariableSnapshot(snapshot, options);
  const values = new Map(),
    priorities = new Map();
  const target = {
    style: {
      getPropertyValue: (name) => values.get(name) ?? "",
      getPropertyPriority: (name) => priorities.get(name) ?? "",
      setProperty: (name, value, priority = "") => {
        values.set(name, value);
        priorities.set(name, priority);
      },
      removeProperty: (name) => {
        values.delete(name);
        priorities.delete(name);
      },
    },
  };
  target.style.setProperty("--app-private", "untouched");
  target.style.setProperty("--size-small", "99px", "important");
  const selection = {
    color: "Dark",
    effects: "OFF",
    density: "Mobile Friendly",
  };
  applyProjectTheme(target, project, selection);
  for (const [name, value] of Object.entries(
    projectCssVariables(project, selection)
  ))
    assert.equal(values.get(name), value);
  const before = new Map(values);
  const invalid = structuredClone(project);
  invalid.tokens[0].collectionId = "missing";
  assert.throws(() => applyProjectTheme(target, invalid));
  assert.deepEqual(values, before);
  target.style.setProperty("--padding-tiny", "user-edited");
  removeProjectTheme(target);
  assert.equal(values.get("--padding-tiny"), "user-edited");
  assert.equal(values.get("--app-private"), "untouched");
  assert.equal(values.get("--size-small"), "99px");
  assert.equal(priorities.get("--size-small"), "important");
  assert.equal(values.size, 3);
});
test("imports every local and dependency token, resolves independent modes", () => {
  const { project } = importVariableSnapshot(snapshot, options);
  assert.equal(project.tokens.length, snapshot.variables.length);
  assert.deepEqual(
    project.tokens.map((token) => token.path.join("/")).sort(),
    snapshot.variables.map((variable) => variable.n).sort()
  );
  const byPath = (path) =>
    project.tokens.find((token) => token.path.join("/") === path);
  const off = resolveProject(project, {
    color: "Dark",
    density: "Mobile Friendly",
    effects: "OFF",
  });
  assert.equal(off[byPath("light-effort-top").id].a, 0);
  assert.equal(off[byPath("size/size-small").id], 16);
  assert.equal(off[byPath("scrollPickerItem/transparency/default").id], 0.6);
  const hover = byPath("control/neutral-primary-background-hover");
  assert.ok(
    Object.values(hover.valuesByMode).every(
      (value) => value.kind === "colorWithAlpha" && value.color.kind === "alias"
    )
  );
  assert.equal(off[hover.id].a, 0.7);
});
test("repeat import and source rename preserve mapped IDs", () => {
  const first = importVariableSnapshot(snapshot, options);
  const renamed = structuredClone(snapshot);
  renamed.variables[0].n = "renamed/value";
  const next = importVariableSnapshot(renamed, {
    ...options,
    bindings: first.bindings,
    createId: () => {
      throw new Error("Unexpected allocation");
    },
  });
  assert.equal(next.project.tokens[0].id, first.project.tokens[0].id);
  assert.deepEqual(next.bindings, first.bindings);
});
test("incomplete graph fails without mutating supplied bindings", () => {
  const first = importVariableSnapshot(snapshot, options);
  const before = structuredClone(first.bindings);
  const incomplete = structuredClone(snapshot);
  incomplete.variables = incomplete.variables.filter(
    (v) => v.c !== deps.collections[0].id
  );
  assert.throws(
    () =>
      importVariableSnapshot(incomplete, {
        ...options,
        bindings: first.bindings,
      }),
    /Missing dependency/
  );
  assert.deepEqual(first.bindings, before);
});
test("a same-name new source object gets a new ID, never silently adopts deleted identity", () => {
  const small = {
    collections: [snapshot.collections[0]],
    variables: [
      snapshot.variables.find((v) => v.c === snapshot.collections[0].id),
    ],
  };
  const first = importVariableSnapshot(small, options);
  const recreated = structuredClone(small);
  recreated.variables[0].i = "new-source-object";
  const second = importVariableSnapshot(recreated, {
    ...options,
    bindings: first.bindings,
  });
  assert.notEqual(first.project.tokens[0].id, second.project.tokens[0].id);
});

test("explicit source adoption persists on reimport without letting retired objects reclaim it", () => {
  let sequence = 0;
  const small = {
    collections: [
      {
        id: "c",
        name: "Numbers",
        modes: [{ id: "m", name: "Default" }],
        defaultModeId: "m",
      },
    ],
    variables: [
      { i: "old", n: "spacing/test", t: "FLOAT", c: "c", v: [["m", ["l", 4]]] },
    ],
  };
  const config = {
    projectId: "test",
    source: "file",
    rules: { c: { axis: "none", layer: "foundation", css: "path" } },
    createId: (kind) => `${kind}-${++sequence}`,
  };
  const first = importVariableSnapshot(small, config);
  const nextSnapshot = structuredClone(small);
  nextSnapshot.variables[0].i = "new";
  const second = importVariableSnapshot(nextSnapshot, {
    ...config,
    bindings: first.bindings,
  });
  const originalId = first.project.tokens[0].id,
    newId = second.project.tokens[0].id;
  assert.notEqual(newId, originalId);
  const adopted = adoptTokenSourceBinding(
    second.bindings,
    "file",
    "new",
    newId,
    originalId
  );
  assert.equal(
    second.bindings.some((binding) => binding.retired),
    false
  );
  assert.equal(
    importVariableSnapshot(nextSnapshot, { ...config, bindings: adopted })
      .project.tokens[0].id,
    originalId
  );
  const reappeared = importVariableSnapshot(small, {
    ...config,
    bindings: adopted,
  });
  assert.notEqual(reappeared.project.tokens[0].id, originalId);
});

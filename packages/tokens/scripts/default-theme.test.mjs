import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { generateTheme, applyTheme, removeTheme } from "../dist/index.js";
import { loadAldTheme } from "../dist/node.js";
import { parseProject, projectCssVariables } from "../dist/project.js";
const project = parseProject(
  readFileSync(
    new URL("../source/theme-engine/ald.project.json", import.meta.url),
    "utf8"
  )
);
const options = {
  remTokenIds: project.tokens
    .filter(
      (token) =>
        token.type === "number" &&
        token.unit === "px" &&
        ["size", "line-height"].includes(token.path[0])
    )
    .map((token) => token.id),
};

test("default theme cleanup restores only owned properties and releases removed keys", () => {
  const values = new Map(),
    priorities = new Map();
  const target = {
    setAttribute() {},
    removeAttribute() {},
    style: {
      getPropertyValue: (name) => values.get(name) ?? "",
      getPropertyPriority: (name) => priorities.get(name) ?? "",
      setProperty(name, value, priority = "") {
        values.set(name, value);
        priorities.set(name, priority);
      },
      removeProperty(name) {
        values.delete(name);
        priorities.delete(name);
      },
    },
  };
  target.style.setProperty("--private", "keep");
  target.style.setProperty("--primary", "original", "important");
  applyTheme({ "--primary": "first", "--only-first": "1" }, { target });
  applyTheme({ "--primary": "second" }, { target });
  assert.equal(values.has("--only-first"), false);
  removeTheme(target);
  assert.deepEqual(
    [...values],
    [
      ["--private", "keep"],
      ["--primary", "original"],
    ]
  );
  assert.equal(priorities.get("--primary"), "important");
  applyTheme({ "--primary": "third" }, { target });
  target.style.setProperty("--primary", "user-edit");
  removeTheme(target);
  assert.equal(values.get("--primary"), "user-edit");
  assert.doesNotThrow(() => removeTheme());
});

test("Node ALD entry matches the standard project in all independent modes", () => {
  for (const mode of ["light", "dark"])
    for (const density of ["default", "mobile-friendly"])
      for (const effects of [true, false]) {
        const actual = loadAldTheme(mode, density, effects);
        const expected = projectCssVariables(
          project,
          {
            color: mode === "dark" ? "Dark" : "Light",
            density: density === "default" ? "Default" : "Mobile Friendly",
            effects: effects ? "ON" : "OFF",
          },
          options
        );
        for (const [name, value] of Object.entries(expected))
          assert.equal(actual[name], value, name);
        assert.ok(
          actual["--control-control-normal-lightbackground-1"],
          "old semantic value remains available"
        );
      }
});

test("dynamic palettes preserve semantic and component references", () => {
  for (const mode of ["light", "dark"]) {
    const first = generateTheme({
      mode,
      primary: "#165DFF",
      density: "mobile-friendly",
      effects: false,
    });
    const second = generateTheme({ mode, primary: "#FF5532" });
    const expected = projectCssVariables(
      project,
      {
        color: mode === "dark" ? "Dark" : "Light",
        density: "Mobile Friendly",
        effects: "OFF",
      },
      options
    );
    assert.notEqual(
      first["--aviala-primary-primary-10"],
      second["--aviala-primary-primary-10"]
    );
    assert.equal(first["--size-small"], "1rem");
    assert.equal(first["--line-shadow-all"], "rgb(0 0 0 / 0)");
    for (const [name, value] of Object.entries(expected)) {
      if (value.includes("var(")) assert.equal(first[name], value, name);
    }
    for (const value of Object.values(first)) {
      assert.doesNotMatch(value, /NaN|undefined|Infinity/);
      for (const [, reference] of value.matchAll(/var\((--[\w-]+)/g))
        assert.ok(reference in first, reference);
    }
  }
});

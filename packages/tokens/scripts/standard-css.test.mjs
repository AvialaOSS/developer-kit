import assert from "node:assert/strict";
import test from "node:test";
import { fileURLToPath } from "node:url";
import {
  buildStandardThemeCss,
  loadStandardProject,
  standardCssOptions,
} from "./standard-css.mjs";
import {
  buildAldThemeCss,
  buildCombinedStylesCss,
  buildComponentTokenCss,
} from "./css-lib.mjs";
import { projectApi } from "./project-api.mjs";

const root = fileURLToPath(new URL("..", import.meta.url));

test("production static modes match the canonical runtime declarations", () => {
  const project = loadStandardProject(root);
  const css = buildAldThemeCss(root);
  const blocks = [...css.matchAll(/([^{}]+)\{([^{}]+)\}/g)];
  assert.equal(blocks.length, 9);
  const declarations = (body) =>
    Object.fromEntries(
      [...body.matchAll(/\s*(--[\w-]+): ([^;]+);/g)].map(([, name, value]) => [
        name,
        value,
      ])
    );
  const common = declarations(blocks[0][2]);
  assert.ok(blocks[0][1].includes('[data-theme="ald"]'));
  assert.ok(Object.keys(common).length > 1694);
  let index = 1;
  for (const color of ["Light", "Dark"])
    for (const density of ["Default", "Mobile Friendly"])
      for (const effects of ["ON", "OFF"]) {
        const [, selector, body] = blocks[index++];
        assert.ok(
          selector.includes(
            color === "Dark" ? '[data-mode="dark"]' : ':not([data-mode="dark"])'
          )
        );
        const actual = { ...common, ...declarations(body) };
        const expected = projectApi.projectCssVariables(
          project,
          { color, density, effects },
          standardCssOptions(project)
        );
        assert.deepEqual(actual, { ...expected });
        assert.deepEqual(
          Object.keys(actual).sort(),
          [
            ...new Set([
              ...project.tokens.map(projectApi.tokenCssName),
              ...project.cssCompatibility.map((alias) => alias.name),
            ]),
          ].sort()
        );
        for (const value of Object.values(actual))
          for (const [, reference] of value.matchAll(/var\((--[\w-]+)/g))
            assert.ok(reference in actual, reference);
      }
  assert.doesNotMatch(css, /NaN|undefined|Infinity/);
});

test("all public static entry points consume the standard project", () => {
  const rootCss = buildStandardThemeCss(root, ":root");
  assert.equal(buildComponentTokenCss(root), rootCss);
  const combined = buildCombinedStylesCss(root);
  assert.ok(combined.includes(rootCss));
  assert.ok(
    combined.includes("--control-theme-lightbackground"),
    "legacy definitions remain separate"
  );
});

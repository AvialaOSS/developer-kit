import { readFileSync } from "node:fs";
import { join } from "node:path";
import { projectApi } from "./project-api.mjs";

export function loadStandardProject(root) {
  return projectApi.parseProject(
    readFileSync(join(root, "source/theme-engine/ald.project.json"), "utf8")
  );
}

export function standardCssOptions(project) {
  return projectApi.avialaProjectCssOptions(project);
}

/** Complete declarations on every scope keep cross-collection aliases local. */
export function buildStandardThemeCss(root, scope = '[data-theme="ald"]') {
  const project = loadStandardProject(root);
  const options = standardCssOptions(project);
  if (!scope.trim() || /[{}]/.test(scope))
    throw new Error("Invalid theme scope");
  const modes = [];
  for (const color of ["Light", "Dark"])
    for (const density of ["Default", "Mobile Friendly"])
      for (const effects of ["ON", "OFF"]) {
        const selector =
          scope +
          (color === "Dark"
            ? '[data-mode="dark"]'
            : ':not([data-mode="dark"])') +
          (density === "Mobile Friendly"
            ? '[data-density="mobile-friendly"]'
            : ':not([data-density="mobile-friendly"])') +
          (effects === "OFF"
            ? '[data-effects="off"]'
            : ':not([data-effects="off"])');
        modes.push({
          selector,
          variables: projectApi.projectCssVariables(
            project,
            { color, density, effects },
            options
          ),
        });
      }
  // Declare invariant aliases once on the scope itself, never on an ancestor.
  const common = Object.fromEntries(
    Object.entries(modes[0].variables).filter(([name, value]) =>
      modes.every((mode) => mode.variables[name] === value)
    )
  );
  const block = (selector, variables) =>
    `${selector} {\n${Object.entries(variables)
      .map(([name, value]) => `  ${name}: ${value};`)
      .join("\n")}\n}\n`;
  const blocks = [
    block(scope, common),
    ...modes.map(({ selector, variables }) =>
      block(
        selector,
        Object.fromEntries(
          Object.entries(variables).filter(([name]) => !(name in common))
        )
      )
    ),
  ];
  return (
    "/* Generated from the standard Theme Engine project. */\n" +
    blocks.join("\n")
  );
}

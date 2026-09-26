import { existsSync, readFileSync } from "node:fs";

// Source checkouts work without a prior build; published packages use dist.
// Both paths execute the same core implementation, never a second resolver.
async function load() {
  const source = new URL("../src/engine/project.ts", import.meta.url);
  if (!existsSync(source)) return import("../dist/project.js");
  const ts = (await import("typescript")).default;
  const compile = (name) =>
    ts.transpileModule(
      readFileSync(
        new URL(`../src/engine/${name}.ts`, import.meta.url),
        "utf8"
      ),
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
  const project = await import(projectUrl);
  const css = await import(
    url(
      compile("project-css").replace('"./project"', JSON.stringify(projectUrl))
    )
  );
  return { ...project, ...css };
}

export const projectApi = await load();

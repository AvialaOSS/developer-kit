import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import test from "node:test";
import ts from "typescript";

test("project declarations work with ES libraries only, without DOM or host types", () => {
  const program = ts.createProgram({
    rootNames: ["project.d.ts", "project.d.cts"].map((file) =>
      fileURLToPath(new URL(`../dist/${file}`, import.meta.url))
    ),
    options: {
      strict: true,
      noEmit: true,
      skipLibCheck: false,
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.NodeNext,
      moduleResolution: ts.ModuleResolutionKind.NodeNext,
      lib: ["lib.es2022.d.ts"],
      types: [],
    },
  });
  const diagnostics = ts.getPreEmitDiagnostics(program);
  assert.equal(
    diagnostics.length,
    0,
    ts.formatDiagnosticsWithColorAndContext(diagnostics, {
      getCurrentDirectory: () => process.cwd(),
      getCanonicalFileName: (file) => file,
      getNewLine: () => "\n",
    })
  );
});

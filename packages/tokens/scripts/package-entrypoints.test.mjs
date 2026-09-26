import assert from "node:assert/strict";
import { createRequire } from "node:module";
import test from "node:test";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
const require = createRequire(import.meta.url);
test("CommonJS and ESM package entry points expose equivalent theme outputs", async () => {
  const esm = await import("@aviala-design/tokens");
  const cjs = require("@aviala-design/tokens");
  assert.deepEqual(
    cjs.generateTheme({ mode: "dark" }),
    esm.generateTheme({ mode: "dark" })
  );
  const nodeEsm = await import("@aviala-design/tokens/node");
  assert.deepEqual(
    require("@aviala-design/tokens/node").loadAldTheme(
      "dark",
      "mobile-friendly",
      false
    ),
    nodeEsm.loadAldTheme("dark", "mobile-friendly", false)
  );
  assert.equal(
    typeof require("@aviala-design/tokens/project").mergeSnapshotCandidate,
    "function"
  );
  assert.ok(require("@aviala-design/tokens/tailwind.preset").default.theme);
});

test("Vite generation matches every published CSS entry", async () => {
  const root = dirname(
    dirname(fileURLToPath(import.meta.resolve("@aviala-design/tokens")))
  );
  const manifest = JSON.parse(
    await readFile(join(root, "package.json"), "utf8")
  );
  const cacheDir = await mkdtemp(join(tmpdir(), "spiral-token-entrypoints-"));
  try {
    const { default: createPlugin } =
      await import("@aviala-design/tokens/vite-plugin");
    const plugin = createPlugin({ cacheDir });
    await plugin.buildStart();
    for (const [subpath, target] of Object.entries(manifest.exports)) {
      if (!subpath.endsWith(".css")) continue;
      const id = `@aviala-design/tokens/${subpath.slice(2)}`;
      const published = fileURLToPath(import.meta.resolve(id));
      assert.equal(resolve(published), resolve(root, target), id);
      const generated = plugin.resolveId(id);
      assert.ok(generated, `${id} is handled by the Vite plugin`);
      assert.equal(
        await readFile(generated, "utf8"),
        await readFile(published, "utf8"),
        id
      );
    }
    for (const id of [
      "@aviala-design/tokens",
      "@aviala-design/tokens/project",
    ]) {
      assert.ok((await readFile(plugin.resolveId(id), "utf8")).length > 0, id);
    }
  } finally {
    // Only remove the unique temporary directory created by this test.
    await rm(cacheDir, { recursive: true, force: true });
  }
});

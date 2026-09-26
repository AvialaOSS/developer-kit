import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    node: "src/node.ts",
    project: "src/project.ts",
    "tailwind.preset": "src/tailwind.preset.ts",
  },
  format: ["esm", "cjs"],
  shims: true,
  dts: true,
  clean: true,
  splitting: false,
  sourcemap: true,
});

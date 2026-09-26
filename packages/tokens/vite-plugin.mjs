import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Vite plugin: serve @aviala-design/tokens (and spiral's styles.css) straight
 * from source — no `turbo build` required before Storybook / playground dev.
 *
 * What it intercepts (enforce "pre", ahead of aliasing & package exports):
 *   @aviala-design/tokens                     → src/index.ts
 *   @aviala-design/tokens/styles.css          → generated on the fly (cache file)
 *   @aviala-design/tokens/ald-theme.css       → generated on the fly (cache file)
 *   @aviala-design/tokens/<name>-effects.css  → src/semantic/<name>-effects.css
 *   @aviala-design/tokens/<name>-extras.css   → src/semantic/<name>-extras.css
 *   @aviala-design/spiral/styles.css          → tokens styles + @layer base reset
 *
 * Generated CSS lives in `<app>/node_modules/.cache/aviala-tokens-css/`. That
 * directory is inside Vite's default watch ignore list, so hot reload does NOT
 * rely on fs events for those files: handleHotUpdate watches the *sources*
 * (src/semantic, source/ald, source/themebuilder), regenerates the cache, then invalidates the
 * cache modules in the module graph so Vite pushes a normal css-update.
 *
 * Keep SPIRAL_LAYER_BASE in sync with packages/ui/scripts/copy-css.mjs.
 */

const SPIRAL_LAYER_BASE = `@layer base {
  * {
    border-color: var(--border);
  }
  body {
    background-color: var(--background);
    color: var(--foreground);
    font-family: var(--font-sans);
    -webkit-font-smoothing: antialiased;
  }
}
`;

const GENERATED_FILES = {
  "@aviala-design/tokens/ald-theme.css": "ald-theme.css",
  "@aviala-design/tokens/component-tokens.css": "component-tokens.css",
  "@aviala-design/tokens/styles.css": "tokens-styles.css",
  "@aviala-design/spiral/styles.css": "spiral-styles.css",
};

const normalize = (p) => p.replace(/\\/g, "/");

export default function avialaTokensCss(options = {}) {
  const tokensRoot = dirname(fileURLToPath(import.meta.url));
  const cacheDir = normalize(
    options.cacheDir ??
      join(process.cwd(), "node_modules", ".cache", "aviala-tokens-css")
  );
  const semanticDir = normalize(join(tokensRoot, "src", "semantic"));
  const nonColorDir = normalize(join(tokensRoot, "src", "non-color"));
  const aldDir = normalize(join(tokensRoot, "source", "ald"));
  const themeBuilderDir = normalize(join(tokensRoot, "source", "themebuilder"));
  const standardProjectDir = normalize(
    join(tokensRoot, "source", "theme-engine")
  );
  const srcDir = normalize(join(tokensRoot, "src"));

  async function generateAll() {
    const { buildAldThemeCss, buildComponentTokenCss, buildCombinedStylesCss } =
      await import("./scripts/css-lib.mjs");
    mkdirSync(cacheDir, { recursive: true });
    writeFileSync(
      join(cacheDir, "ald-theme.css"),
      buildAldThemeCss(tokensRoot)
    );
    writeFileSync(
      join(cacheDir, "component-tokens.css"),
      buildComponentTokenCss(tokensRoot)
    );
    const combined = buildCombinedStylesCss(tokensRoot);
    writeFileSync(join(cacheDir, "tokens-styles.css"), combined);
    writeFileSync(
      join(cacheDir, "spiral-styles.css"),
      combined + "\n\n" + SPIRAL_LAYER_BASE
    );
  }

  function isSourceFile(normalizedFile) {
    return (
      normalizedFile.startsWith(semanticDir + "/") ||
      normalizedFile.startsWith(nonColorDir + "/") ||
      normalizedFile.startsWith(aldDir + "/") ||
      normalizedFile.startsWith(themeBuilderDir + "/") ||
      normalizedFile.startsWith(standardProjectDir + "/")
    );
  }

  return {
    name: "aviala-tokens-css",
    enforce: "pre",

    async buildStart() {
      await generateAll();
    },

    resolveId(id, importer) {
      if (id === "@aviala-design/tokens") {
        const source = join(tokensRoot, "src", "index.ts");
        return normalize(
          existsSync(source) ? source : join(tokensRoot, "dist", "index.js")
        );
      }
      if (id === "@aviala-design/tokens/project") {
        const source = join(tokensRoot, "src", "project.ts");
        return normalize(
          existsSync(source) ? source : join(tokensRoot, "dist", "project.js")
        );
      }
      const generated = GENERATED_FILES[id];
      if (generated) {
        return normalize(join(cacheDir, generated));
      }
      const sub = /^@aviala-design\/tokens\/([\w-]+\.css)$/.exec(id);
      if (sub) {
        const source = join(semanticDir, sub[1]);
        if (/-(effects|extras)\.css$/.test(sub[1]) && existsSync(source))
          return normalize(source);
      }
      // Force .ts/.tsx for relative imports inside tokens/src: vite resolves
      // extensionless imports .js-first, which would otherwise pick up stale
      // tsc artifacts sitting next to the real sources.
      if (importer && id.startsWith(".")) {
        const imp = normalize(importer);
        if (imp.startsWith(srcDir + "/")) {
          const abs = normalize(join(dirname(imp), id));
          for (const ext of [".ts", ".tsx"]) {
            if (existsSync(abs + ext)) return abs + ext;
          }
        }
      }
      return null;
    },

    configureServer(server) {
      // Watch the token *sources* — including files like colors.css and the
      // ALD JSON that are never imported directly, so Vite would otherwise
      // never fire hotUpdate for them.
      server.watcher.add([
        semanticDir,
        nonColorDir,
        aldDir,
        themeBuilderDir,
        standardProjectDir,
      ]);
    },

    async handleHotUpdate({ file, server }) {
      const f = normalize(file);
      if (f.startsWith(cacheDir + "/") || !isSourceFile(f)) return;

      await generateAll();

      const modules = [];
      for (const name of Object.values(GENERATED_FILES)) {
        const id = normalize(join(cacheDir, name));
        const mod = server.moduleGraph.getModuleById(id);
        if (mod) {
          server.moduleGraph.invalidateModule(mod);
          modules.push(mod);
        }
      }
      // Keep default HMR for the changed file itself (e.g. a directly
      // imported effects stylesheet) alongside the regenerated cache modules.
      const ownMod = server.moduleGraph.getModuleById(f);
      if (ownMod) {
        server.moduleGraph.invalidateModule(ownMod);
        modules.push(ownMod);
      }
      return modules;
    },
  };
}

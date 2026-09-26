import { readFileSync, readdirSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import {
  loadThemeBuilderSnapshot,
  createVariableRegistry,
} from "./themebuilder-css.mjs";
import { buildStandardThemeCss, loadStandardProject } from "./standard-css.mjs";
import { projectApi } from "./project-api.mjs";

const packageRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const repoRoot = join(packageRoot, "../..");
const snapshot = loadThemeBuilderSnapshot(packageRoot);
const registry = createVariableRegistry(snapshot);
const project = loadStandardProject(packageRoot);
const candidate = JSON.parse(readFileSync(join(packageRoot, "source/theme-engine/import-candidate.json"), "utf8"));
const engineIds = new Map(candidate.bindings
  .filter((binding) => binding.kind === "token" && !binding.retired && binding.source === candidate.source)
  .map((binding) => [binding.externalId, binding.engineId]));
const tokens = new Map(project.tokens.map((token) => [token.id, token]));
const source = JSON.parse(
  readFileSync(
    join(packageRoot, "source/themebuilder/components.variables.json"),
    "utf8"
  )
);
const walk = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory() ? walk(join(dir, entry.name)) : [join(dir, entry.name)]
  );
const files = [
  ...walk(join(packageRoot, "src")),
  ...walk(join(repoRoot, "packages/ui/src")),
]
  .filter(
    (file) => /\.(css|tsx|ts)$/.test(file) && !/\.(stories|test)\./.test(file)
  )
  .sort();
const reads = new Map();
const declarations = new Map();
for (const file of files) {
  const text = readFileSync(file, "utf8");
  const name = relative(repoRoot, file).replaceAll("\\", "/");
  for (const [index, line] of text.split(/\r?\n/).entries()) {
    for (const match of line.matchAll(/(--[\w-]+)/g)) {
      const entries = reads.get(match[1]) ?? [];
      entries.push(`${name}:${index + 1}`);
      reads.set(match[1], entries);
    }
  }
  if (file.endsWith(".css")) {
    for (const match of text.matchAll(/(--[\w-]+)\s*:/g)) {
      declarations.set(match[1], [...(declarations.get(match[1]) ?? []), name]);
    }
  }
}
const generated = buildStandardThemeCss(packageRoot);
const generatedNames = new Set(
  [...generated.matchAll(/(--[\w-]+)\s*:/g)].map((match) => match[1])
);
// The canonical graph must be closed without relying on handwritten fallbacks.
const knownNames = generatedNames;
const missing = [
  ...new Set(
    [...generated.matchAll(/var\((--[\w-]+)/g)].map((match) => match[1])
  ),
]
  .filter((name) => !knownNames.has(name))
  .sort();
const collectAliases = (encoded) =>
  encoded[0] === "a"
    ? [encoded[1]]
    : encoded[0] === "c"
      ? [...collectAliases(encoded[1]), ...collectAliases(encoded[2])]
      : [];
const rows = snapshot.variables
  .map((variable) => {
    const collection = registry.collections.get(variable.c);
    const engineId = engineIds.get(variable.i);
    const token = tokens.get(engineId);
    const cssName = token ? projectApi.tokenCssName(token) : registry.cssName(variable);
    const oldPath = ["numbers", "fontWeight"].includes(collection.name)
      ? variable.n.split("/").at(-1)
      : variable.n;
    const oldName =
      (collection.name === "Aviala Design Colors" ? "--aviala-" : "--") +
      oldPath.replace(/[\s/]+/g, "-").toLowerCase();
    return {
      sourceId: variable.i,
      engineId: engineId ?? null,
      presentInStandardProject: Boolean(token),
      collection: collection.name,
      path: variable.n,
      type: variable.t,
      cssName,
      emitted: generatedNames.has(cssName),
      sourceOccurrences: reads.get(cssName) ?? [],
      handwrittenDefinitions: declarations.get(cssName) ?? [],
      legacySpellingCandidate: oldName !== cssName ? oldName : null,
      legacySourceOccurrences:
        oldName !== cssName ? (reads.get(oldName) ?? []) : [],
      references: [
        ...new Set(variable.v.flatMap(([, value]) => collectAliases(value))),
      ].map((id) => ({ id, path: registry.variables.get(id)?.n ?? null })),
    };
  })
  .sort(
    (a, b) =>
      a.collection.localeCompare(b.collection) || a.path.localeCompare(b.path)
  );
const mappedIds = new Set(rows.filter((row) => row.presentInStandardProject).map((row) => row.engineId));
const standardOnlyTokens = project.tokens.filter((token) => !mappedIds.has(token.id)).map((token) => ({
  id: token.id,
  collection: project.collections.find((collection) => collection.id === token.collectionId)?.name,
  path: token.path.join("/"),
  cssName: projectApi.tokenCssName(token),
}));
const unmappedSourceVariables = rows.filter((row) => !row.presentInStandardProject);
const report = {
  baseline: { file: source.file, exportedAt: source.exportedAt },
  standardProject: {
    id: project.id,
    draftRevision: project.draftRevision,
    tokenCount: project.tokens.length,
    compatibilityAliases: project.cssCompatibility.length,
    output: "buildStandardThemeCss (current production generator)",
  },
  scope:
    "Static source audit only; occurrences are not proof of runtime consumption. Legacy spellings are candidates, not approved semantic mappings.",
  collections: snapshot.collections.map((collection) => ({
    name: collection.name,
    modes: collection.modes.map((mode) => mode.name),
    count: rows.filter((row) => row.collection === collection.name).length,
  })),
  missingGeneratedReferences: missing,
  unmappedSourceVariables,
  standardOnlyTokens,
  variables: rows,
};
const out = join(repoRoot, "docs/theme-engine");
mkdirSync(out, { recursive: true });
writeFileSync(
  join(out, "alignment.json"),
  JSON.stringify(report, null, 2) + "\n"
);
const candidates = rows.filter((row) => row.legacySourceOccurrences.length);
const unresolved = rows.filter((row) => missing.includes(row.cssName));
const md = [
  "# Figma / Spiral 变量对齐清单",
  "",
  `基线：${source.exportedAt}，文件 ${source.file}。只审计本地快照，不表示线上最新状态。`,
  `当前输出：标准项目修订 ${project.draftRevision}，${project.tokens.length} 个 Token，${project.cssCompatibility.length} 个兼容别名。使用生产标准生成器核对，不使用历史快照生成器判断缺失。`,
  "",
  "运行 `node packages/tokens/scripts/audit-theme-alignment.mjs` 重新生成。完整逐变量记录见 alignment.json。源码出现位置不等于运行时生效，命名候选不等于语义映射已批准。",
  "",
  "## 本地 Figma 快照 Collection",
  "",
  "| 名称 | 数量 | 模式 |",
  "| --- | ---: | --- |",
  ...report.collections.map(
    (c) => `| ${c.name} | ${c.count} | ${c.modes.join(" / ")} |`
  ),
  "",
  "## 标准项目与快照的差异",
  "",
  `快照变量 ${rows.length} 项；未映射至标准项目 ${unmappedSourceVariables.length} 项；标准项目独有 ${standardOnlyTokens.length} 项。独有项只表示本地快照未包含，不能据此推断线上 Figma 已有或没有。`,
  "",
  "| 标准项目独有 Token | Collection | CSS 名 |",
  "| --- | --- | --- |",
  ...standardOnlyTokens.map((token) => `| ${token.path} | ${token.collection} | ${token.cssName} |`),
  ...unmappedSourceVariables.map((row) => `\n未映射快照变量：${row.collection} / ${row.path}（${row.sourceId}）`),
  "",
  "## 被引用但未生成定义的变量",
  "",
  `标准输出中未闭合的 CSS 引用：${missing.length}。此检查不借助手写兼容层补齐引用。`,
  ...missing.map((name) => `- ${name}`),
  "",
  "| Collection | Figma 路径 | 缺失 CSS 名 | 引用方示例 |",
  "| --- | --- | --- | --- |",
  ...unresolved.map(
    (row) =>
      `| ${row.collection} | ${row.path} | ${row.cssName} | ${rows
        .filter((other) =>
          other.references.some((ref) => ref.id === row.sourceId)
        )
        .slice(0, 4)
        .map((other) => other.path)
        .join("、")} |`
  ),
  "",
  "## 源码仍出现的旧拼写候选",
  "",
  "只列同一 Figma 路径的新旧规范化差异，不自动批准不同语义之间的替换。旧覆盖入口需单独保留。",
  "",
  "| Figma 路径 | 旧拼写 | 新拼写 | 旧名位置示例 |",
  "| --- | --- | --- | --- |",
  ...candidates.map(
    (row) =>
      `| ${row.path} | ${row.legacySpellingCandidate} | ${row.cssName} | ${row.legacySourceOccurrences.slice(0, 2).join("、")} |`
  ),
  "",
  "## 独立保留的旧语义层",
  "",
  "- 已确认：旧 control/control-normal-lightBackground 与 control/control-theme-lightbackground 等定义独立保留，不强行映射到新 colorSystem。",
  "- 新迁移组件严格消费标准项目中的 Figma Token；旧组件逐个迁移并验收后，再显式退役兼容定义。",
  "- ScrollPicker 原选中背景消费旧 theme-lightbackground，新组件 Token 消费 Figma 指定背景；以新 Figma 为准，但迁移差异应显式展示。",
  "- 字号、行高、字重继续使用共享 Typography；不得将全部基础变量直接消费统计视为缺陷。",
  "",
  "## 已确认的处理规则",
  "",
  "缺失依赖完整导入；特效支持 ON/OFF；旧名持续兼容直至明确破坏性升级；text-normal-text-white 允许随模式反转。详细实施规则见 ../THEME_ENGINE_PLAN.md。",
  "",
];
writeFileSync(join(out, "ALIGNMENT.md"), md.join("\n"));
console.log(
  JSON.stringify({
    variables: rows.length,
    missingReferences: missing.length,
    legacyCandidatesInSource: candidates.length,
    output: relative(repoRoot, out),
  })
);

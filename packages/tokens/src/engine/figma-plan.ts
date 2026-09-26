import { parseProject, type TokenProject, type TokenValue } from "./project";
import type { SourceBinding } from "./snapshot-adapter";

export interface FigmaValuePlan {
  tokenId: string;
  path: string;
  collectionId: string;
  collectionName: string;
  modeId: string;
  modeName: string;
  expected: TokenValue;
  disposition: "write" | "assistant" | "blocked";
  reasons: string[];
  instruction: string;
}

/** Portable preflight only. A write candidate is never a successful receipt. */
export function planFigmaValues(
  input: TokenProject,
  sourceContext?: { source: string; bindings: SourceBinding[] }
): FigmaValuePlan[] {
  const project = parseProject(JSON.stringify(input));
  const restricted = new Set(sourceContext?.bindings
    .filter((b) => b.source === sourceContext.source && !b.retired && b.readOnly)
    .map((b) => JSON.stringify([b.kind, b.engineId])) ?? []);
  const collections = new Map(project.collections.map((c) => [c.id, c]));
  const names = new Map(project.tokens.map((t) => [t.id, t.path.join("/")]));
  const describe = (value: TokenValue): string => {
    if (value.kind === "alias") return `引用「${names.get(value.targetId)}」`;
    if (value.kind === "colorWithAlpha")
      return `${describe(value.color)}，附加透明度 ${describe(value.alpha)}（0–1）`;
    if (value.kind === "inheritDefault") return "显式继承默认模式";
    return JSON.stringify(value.value);
  };
  return project.tokens.flatMap((token) => {
    const collection = collections.get(token.collectionId)!;
    return collection.modes.map((mode): FigmaValuePlan => {
      const expected = token.valuesByMode[mode.id]!;
      // Figma has no standard-project inheritDefault marker. Keep provenance
      // in expected while the adapter materializes the default expression.
      const effective = expected.kind === "inheritDefault"
        ? token.valuesByMode[collection.defaultModeId]!
        : expected;
      const reasons: string[] = [];
      let disposition: FigmaValuePlan["disposition"] = "write";
      if (token.type === "number" && token.unit === "rem") {
        disposition = "blocked";
        reasons.push("rem-conversion-required");
      }
      if (effective.kind === "colorWithAlpha") {
        disposition = "assistant";
        reasons.push("alpha-expression-needs-verification");
      }
      const readOnly = restricted.has(JSON.stringify(["token", token.id])) ||
        restricted.has(JSON.stringify(["collection", collection.id]));
      if (readOnly) {
        disposition = "blocked";
        reasons.push("read-only-source");
      }
      const target = `集合「${collection.name}」 · 变量「${token.path.join("/")}」 · 模式「${mode.name}」`;
      return {
        tokenId: token.id, path: token.path.join("/"),
        collectionId: collection.id, collectionName: collection.name,
        modeId: mode.id, modeName: mode.name, expected, disposition, reasons,
        instruction: readOnly
          ? `${target}：来源为只读外部库或扩展集合；请在拥有该变量的源文件修改，再重新导入核对，不能在当前文件直接写入。`
          : disposition === "assistant"
          ? `${target}：目标为 ${describe(effective)}。同步助手需保留引用并验证附加透明度；无法等价写入时，请手动设置后重新导入核对。不得静默展开引用。`
          : disposition === "blocked"
            ? `${target}：目标为 ${describe(effective)}。需先明确 ${token.type === "number" ? "rem 到 Figma 数值的转换配置" : "该类型在当前客户端的编码与单位"}，当前不写入。`
            : `${target}：写入 ${describe(effective)} 后回读核对，确认前不标记同步成功。`,
      };
    });
  });
}

export interface FigmaReadbackResult {
  verified: boolean;
  structuralDifferences: string[];
  items: (FigmaValuePlan & {
    status: "verified" | "missing" | "mismatch";
    differences: string[];
    actual?: TokenValue;
  })[];
}

/** Compare fresh, identity-mapped readback with the exact submitted project.
 * This is evidence comparison, not proof that an adapter actually read Figma.
 * The host must retain the submitted snapshot and attach source/read timestamps.
 */
export function verifyFigmaReadback(
  submitted: TokenProject,
  readback: TokenProject
): FigmaReadbackResult {
  const expected = parseProject(JSON.stringify(submitted));
  const actual = parseProject(JSON.stringify(readback));
  if (expected.id !== actual.id) throw new Error("Readback project identity mismatch");
  const planned = planFigmaValues(expected);
  const actualTokens = new Map(actual.tokens.map((t) => [t.id, t]));
  const expectedTokens = new Map(expected.tokens.map((t) => [t.id, t]));
  const actualCollections = new Map(actual.collections.map((c) => [c.id, c]));
  const expectedCollections = new Map(expected.collections.map((c) => [c.id, c]));
  // Object member order is immaterial; expression shape and reference identity are not.
  const canonical = (value: unknown): string => {
    if (Array.isArray(value)) return `[${value.map(canonical).join(",")}]`;
    if (value && typeof value === "object") return `{${Object.entries(value)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, entry]) => `${JSON.stringify(key)}:${canonical(entry)}`).join(",")}}`;
    return JSON.stringify(value);
  };
  const items: FigmaReadbackResult["items"] = planned.map((item) => {
    const token = actualTokens.get(item.tokenId);
    const collection = actualCollections.get(item.collectionId);
    const mode = collection?.modes.find((m) => m.id === item.modeId);
    const value = token?.valuesByMode[item.modeId];
    if (!token || !collection || !mode || !value)
      return { ...item, status: "missing", differences: ["missing-token-collection-or-mode"] };
    const origin = expectedTokens.get(item.tokenId)!;
    const sourceCollection = expectedCollections.get(item.collectionId)!;
    const differences: string[] = [];
    if (token.collectionId !== item.collectionId) differences.push("collection-identity");
    if (token.path.join("/") !== item.path) differences.push("token-path");
    if (token.type !== origin.type || token.unit !== origin.unit) differences.push("type-or-unit");
    if (collection.name !== item.collectionName) differences.push("collection-name");
    if (collection.axis !== sourceCollection.axis) differences.push("collection-axis");
    if (collection.defaultModeId !== sourceCollection.defaultModeId) differences.push("default-mode");
    if (mode.name !== item.modeName) differences.push("mode-name");
    const normalizedExpected = item.expected.kind === "inheritDefault"
      ? origin.valuesByMode[sourceCollection.defaultModeId] : item.expected;
    const normalizedActual = value.kind === "inheritDefault"
      ? token.valuesByMode[collection.defaultModeId] : value;
    if (canonical(normalizedExpected) !== canonical(normalizedActual)) differences.push("value-or-reference");
    return { ...item, status: differences.length ? "mismatch" : "verified", differences, actual: value };
  });
  const structuralDifferences: string[] = [];
  const byId = <T extends { id: string }>(values: T[]) =>
    [...values].sort((a, b) => a.id.localeCompare(b.id));
  if (canonical(byId(expected.collections)) !== canonical(byId(actual.collections)))
    structuralDifferences.push("collection-or-mode-structure");
  if (canonical([...expectedTokens.keys()].sort()) !== canonical([...actualTokens.keys()].sort()))
    structuralDifferences.push("token-identities");
  return {
    verified: structuralDifferences.length === 0 && items.every((item) => item.status === "verified"),
    structuralDifferences, items,
  };
}

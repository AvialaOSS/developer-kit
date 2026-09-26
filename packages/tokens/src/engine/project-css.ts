import {
  selectedMode,
  tokenCssName,
  validateProject,
  type Literal,
  type ModeSelection,
  type NumberUnit,
  type TokenProject,
  type TokenType,
  type TokenValue,
} from "./project";

export interface ProjectCssOptions {
  /** Explicit token IDs rendered in rem; source values remain design pixels. */
  remTokenIds?: readonly string[];
  rootFontSize?: number;
}

/** Opt-in Aviala typography convention; generic projects keep their source units. */
export function avialaProjectCssOptions(project: TokenProject): ProjectCssOptions {
  return {
    remTokenIds: project.tokens
      .filter((token) =>
        token.type === "number" && token.unit === "px" &&
        ["size", "line-height"].includes(token.path[0]!)
      )
      .map((token) => token.id),
  };
}

/** CSSOM string serialization; JSON escapes have different CSS meanings. */
function cssString(value: string): string {
  const escaped = value.replace(/[\u0000-\u001f\u007f"\\]/g, (character) => {
    const code = character.charCodeAt(0);
    if (code === 0) return "\uFFFD";
    if (code <= 0x1f || code === 0x7f) return `\\${code.toString(16)} `;
    return `\\${character}`;
  });
  return `"${escaped}"`;
}

/** One declaration map for style sheets and inline theme application. */
export function projectCssVariables(
  project: TokenProject,
  selection: ModeSelection = {},
  options: ProjectCssOptions = {}
): Record<string, string> {
  const issues = validateProject(project);
  if (issues.length)
    throw new Error(
      issues
        .map((issue) => `${issue.path ?? project.id}: ${issue.message}`)
        .join("\n")
    );
  const rootSize = options.rootFontSize ?? 16;
  if (!Number.isFinite(rootSize) || rootSize <= 0)
    throw new Error("rootFontSize must be positive");
  const tokens = new Map(project.tokens.map((token) => [token.id, token]));
  const rem = new Set(options.remTokenIds ?? []);
  for (const id of rem) {
    const token = tokens.get(id);
    if (!token || token.type !== "number" || token.unit !== "px")
      throw new Error(`rem conversion requires a px token: ${id}`);
  }
  const collections = new Map(
    project.collections.map((collection) => [collection.id, collection])
  );
  const output: Record<string, string> = Object.create(null) as Record<
    string,
    string
  >;
  const literal = (
    value: Literal,
    type: TokenType,
    unit: NumberUnit | undefined,
    convertRem: boolean
  ): string => {
    if (type === "color") {
      const c = value as { r: number; g: number; b: number; a: number };
      return `rgb(${c.r * 255} ${c.g * 255} ${c.b * 255} / ${c.a})`;
    }
    if (type === "string") return cssString(value as string);
    if (type === "boolean") return value ? "1" : "0";
    if (type === "duration") return `${value}ms`;
    if (type === "cubicBezier")
      return `cubic-bezier(${(value as number[]).join(", ")})`;
    if (unit === "px" && convertRem) return `${Number(value) / rootSize}rem`;
    return `${value}${unit === "px" || unit === "rem" ? unit : ""}`;
  };
  for (const token of project.tokens) {
    const collection = collections.get(token.collectionId)!;
    const mode = selectedMode(collection, selection);
    const encode = (
      value: TokenValue,
      type = token.type,
      unit = token.unit
    ): string => {
      if (value.kind === "literal")
        return literal(value.value, type, unit, rem.has(token.id));
      if (value.kind === "alias")
        return `var(${tokenCssName(tokens.get(value.targetId)!)})`;
      if (value.kind === "inheritDefault")
        return encode(token.valuesByMode[collection.defaultModeId]!);
      return `color-mix(in srgb, ${encode(value.color, "color", undefined)} calc(${encode(value.alpha, "number", "ratio")} * 100%), transparent)`;
    };
    output[tokenCssName(token)] = encode(token.valuesByMode[mode]!);
  }
  for (const alias of project.cssCompatibility)
    output[alias.name] = `var(${tokenCssName(tokens.get(alias.targetId)!)})`;
  return output;
}

/** Emit a complete scope, including aliases, so nested themes resolve locally. */
export function projectCssText(
  project: TokenProject,
  selection: ModeSelection = {},
  options: ProjectCssOptions & { selector?: string } = {}
): string {
  const selector = options.selector ?? ":root";
  if (!selector.trim() || /[{}]/.test(selector))
    throw new Error("Invalid theme scope selector");
  const vars = projectCssVariables(project, selection, options);
  return `${selector} {\n${Object.entries(vars)
    .map(([name, value]) => `  ${name}: ${value};`)
    .join("\n")}\n}\n`;
}

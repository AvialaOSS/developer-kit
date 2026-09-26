import { parseProject, type Literal, type TokenProject, type TokenValue } from "./project";
import type { SourceBinding } from "./snapshot-adapter";

type BuilderValue = { kind: "literal"; value: Literal | {type: "CUSTOM_CUBIC_BEZIER"; easingFunctionCubicBezier: {x1:number;y1:number;x2:number;y2:number}} } | { kind: "alias"; target: string } |
  { kind: "composed"; color: BuilderValue; opacity: BuilderValue };
export interface ThemeBuilderExportOptions {
  source: string;
  bindings: SourceBinding[];
  /** Explicit conversion only; do not assume a browser root size. */
  remPixels?: number;
}

/** Produce the existing ThemeBuilder snapshot shape without flattening aliases. */
export function exportThemeBuilderSnapshot(input: TokenProject, options: ThemeBuilderExportOptions) {
  const project = parseProject(JSON.stringify(input));
  if (!options.source.trim()) throw new Error("Target source is required");
  if (options.remPixels !== undefined && (!Number.isFinite(options.remPixels) || options.remPixels <= 0))
    throw new Error("Invalid rem conversion");
  const bindings = new Map<string, SourceBinding>();
  const external = new Set<string>();
  for (const binding of options.bindings) {
    if (binding.retired || binding.source !== options.source) continue;
    const key = JSON.stringify([binding.kind, binding.engineId]);
    const sourceKey = JSON.stringify([binding.kind, binding.externalId]);
    if (bindings.has(key) || external.has(sourceKey)) throw new Error("Duplicate source identity");
    bindings.set(key, binding); external.add(sourceKey);
  }
  const bindingFor = (kind: SourceBinding["kind"], id: string) => bindings.get(JSON.stringify([kind, id]));
  const origin = (kind: "collection" | "token", id: string) => {
    const binding = bindingFor(kind, id);
    return binding ? { file: options.source, id: binding.externalId } : undefined;
  };
  const collections = project.collections.map((collection) => {
    const source = origin("collection", collection.id);
    return {
      id: collection.id, name: collection.name, defaultModeId: collection.defaultModeId,
      ...(source ? { source } : {}),
      ...(bindingFor("collection", collection.id)?.readOnly ? { metadata: { remote: true } } : {}),
      modes: collection.modes.map((mode) => {
        const binding = bindingFor("mode", mode.id);
        let sourceId: string | undefined;
        if (binding) {
          const pair: unknown = JSON.parse(binding.externalId);
          if (!source || !Array.isArray(pair) || pair.length !== 2 || pair[0] !== source.id || typeof pair[1] !== "string")
            throw new Error(`Mode source mismatch: ${collection.name}/${mode.name}`);
          sourceId = pair[1];
        }
        return { ...mode, ...(sourceId ? { sourceId } : {}) };
      }),
    };
  });
  const variables = project.tokens.map((token) => {
    if (token.unit === "rem" && options.remPixels === undefined)
      throw new Error(`Explicit rem conversion required: ${token.path.join("/")}`);
    const collection = project.collections.find((c) => c.id === token.collectionId)!;
    const encode = (value: TokenValue, scale = 1): BuilderValue => {
      if (value.kind === "inheritDefault") return encode(token.valuesByMode[collection.defaultModeId]!, scale);
      if (value.kind === "alias") return { kind: "alias", target: value.targetId };
      if (value.kind === "colorWithAlpha") {
        if (value.color.kind === "colorWithAlpha" || value.alpha.kind === "colorWithAlpha")
          throw new Error(`Nested color expression cannot be exported: ${token.path.join("/")}`);
        return { kind: "composed", color: encode(value.color), opacity: encode(value.alpha, 100) };
      }
      if (token.type === "cubicBezier") {
        const [x1, y1, x2, y2] = value.value as [number, number, number, number];
        return {kind:"literal",value:{type:"CUSTOM_CUBIC_BEZIER",easingFunctionCubicBezier:{x1,y1,x2,y2}}};
      }
      return { kind: "literal", value: typeof value.value === "number" ? value.value * scale : value.value };
    };
    const scale = token.type === "duration" ? 1 / 1000 : token.unit === "ratio" ? 100 : token.unit === "rem" ? options.remPixels! : 1;
    const source = origin("token", token.id);
    const readOnly = bindingFor("token", token.id)?.readOnly || bindingFor("collection", collection.id)?.readOnly;
    return {
      id: token.id, collectionId: token.collectionId, name: token.path.join("/"),
      type: ({ color: "COLOR", number: "FLOAT", string: "STRING", boolean: "BOOLEAN", cubicBezier: "EASING", duration: "TIMING" } as const)[token.type],
      values: Object.fromEntries(collection.modes.map((mode) => [mode.id, encode(token.valuesByMode[mode.id]!, scale)])),
      ...(source ? { source } : {}), ...(readOnly ? { external: true } : {}),
    };
  });
  return { collections, variables };
}

export function createThemeBuilderChangePackage(
  baseline: TokenProject,
  target: TokenProject,
  projectName: string,
  options: ThemeBuilderExportOptions
) {
  if (baseline.id !== target.id) throw new Error("Baseline project identity mismatch");
  if (!projectName.trim()) throw new Error("Project name is required");
  const before = exportThemeBuilderSnapshot(baseline, options);
  if (before.collections.some((c) => !c.source) || before.variables.some((v) => !v.source))
    throw new Error("Figma baseline requires complete source identities");
  return {
    format: "themebuilder-figma-changes" as const, version: 1 as const,
    projectId: target.id, projectName, file: options.source,
    baseline: before, target: exportThemeBuilderSnapshot(target, options),
  };
}

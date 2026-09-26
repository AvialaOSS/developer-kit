import {
  tokenCssName,
  validateProject,
  type Axis,
  type Literal,
  type NumberUnit,
  type ProjectToken,
  type TokenProject,
  type TokenType,
  type TokenValue,
} from "./project";

export type EncodedValue =
  ["l", unknown] | ["a", string] | ["c", EncodedValue, EncodedValue];
export interface VariableSnapshot {
  collections: {
    id: string;
    name: string;
    modes: { id: string; name: string }[];
    defaultModeId: string;
    remote?: boolean;
    isExtension?: boolean;
  }[];
  variables: {
    i: string;
    n: string;
    t: string;
    c: string;
    s?: string[];
    remote?: boolean;
    v: [string, EncodedValue][];
  }[];
}
export interface SourceBinding {
  source: string;
  kind: "collection" | "mode" | "token";
  externalId: string;
  engineId: string;
  retired?: boolean;
  /** Source capability, not part of the portable token definition. */
  readOnly?: boolean;
}
export interface CollectionImportRule {
  axis: Axis;
  layer: ProjectToken["layer"];
  css: "path" | "leaf" | "palette";
}
export interface SnapshotImportOptions {
  projectId: string;
  source: string;
  bindings?: SourceBinding[];
  createId: (kind: SourceBinding["kind"]) => string;
  /** Keyed by source collection identity, never by a core-engine display name. */
  rules: Record<string, CollectionImportRule>;
  /** Explicit FLOAT units keyed by source variable ID. Alias units still must agree. */
  numericUnits?: Record<string, NumberUnit>;
  /** Pixels per rem when importing Figma pixel literals as rem. */
  remPixels?: number;
  /** Reject literal FLOAT values without explicit units instead of using legacy inference. */
  requireExplicitNumericUnits?: boolean;
}

export type ThemeBuilderValue =
  | { kind: "literal"; value: unknown }
  | { kind: "alias"; target: string }
  | { kind: "composed"; color: ThemeBuilderValue; opacity: ThemeBuilderValue };
export interface ThemeBuilderSnapshot {
  collections: {
    id: string;
    name: string;
    defaultModeId: string;
    modes: { id: string; name: string }[];
    metadata?: Record<string, unknown>;
  }[];
  variables: {
    id: string;
    name: string;
    type: string;
    collectionId: string;
    values: Record<string, ThemeBuilderValue>;
    external?: boolean;
  }[];
}

/** Import editor identities, not embedded Figma identities; use a separate source namespace. */
export function importThemeBuilderSnapshot(
  input: ThemeBuilderSnapshot,
  options: SnapshotImportOptions
): { project: TokenProject; bindings: SourceBinding[] } {
  const encode = (
    value: ThemeBuilderValue,
    path: string,
    depth = 0
  ): EncodedValue => {
    if (!value || typeof value !== "object" || depth > 64)
      throw new Error(`Invalid or excessively nested editor value at ${path}`);
    if (value.kind === "literal") return ["l", value.value];
    if (value.kind === "alias" && typeof value.target === "string")
      return ["a", value.target];
    if (value.kind === "composed")
      return [
        "c",
        encode(value.color, `${path}.color`, depth + 1),
        encode(value.opacity, `${path}.opacity`, depth + 1),
      ];
    throw new Error(`Unsupported editor value at ${path}`);
  };
  const snapshot: VariableSnapshot = {
    collections: input.collections.map((collection) => ({
      id: collection.id,
      name: collection.name,
      defaultModeId: collection.defaultModeId,
      modes: collection.modes.map((mode) => ({ id: mode.id, name: mode.name })),
      // Absence of metadata does not revoke a previously known restriction.
      ...(typeof collection.metadata?.remote === "boolean"
        ? { remote: collection.metadata.remote }
        : {}),
      ...(typeof collection.metadata?.isExtension === "boolean"
        ? { isExtension: collection.metadata.isExtension }
        : {}),
    })),
    variables: input.variables.map((variable) => ({
      i: variable.id,
      n: variable.name,
      t: variable.type,
      c: variable.collectionId,
      ...(typeof variable.external === "boolean"
        ? { remote: variable.external }
        : {}),
      v: Object.entries(variable.values).map(([mode, value]) => [
        mode,
        encode(value, `${variable.name}/${mode}`),
      ]),
    })),
  };
  return importVariableSnapshot(snapshot, {
    ...options,
    requireExplicitNumericUnits: options.requireExplicitNumericUnits ?? true,
  });
}

/** Converts a complete compact snapshot; callers merge the returned candidate into a draft. */
export function importVariableSnapshot(
  snapshot: VariableSnapshot,
  options: SnapshotImportOptions
): { project: TokenProject; bindings: SourceBinding[] } {
  const bindings = (options.bindings ?? []).map((binding) => ({ ...binding }));
  const sourceKeys = new Set<string>();
  const engineIds = new Set<string>();
  const activeEngineKeys = new Set<string>();
  const key = (
    kind: SourceBinding["kind"],
    externalId: string,
    source = options.source
  ) => JSON.stringify([source, kind, externalId]);
  const mapped = new Map<string, string>();
  for (const binding of bindings) {
    engineIds.add(binding.engineId);
    if (binding.retired) continue;
    const sourceKey = key(binding.kind, binding.externalId, binding.source);
    const engineKey = JSON.stringify([
      binding.source,
      binding.kind,
      binding.engineId,
    ]);
    if (sourceKeys.has(sourceKey) || activeEngineKeys.has(engineKey))
      throw new Error("Duplicate source binding or Engine ID");
    sourceKeys.add(sourceKey);
    activeEngineKeys.add(engineKey);
    mapped.set(sourceKey, binding.engineId);
  }
  const identity = (kind: SourceBinding["kind"], externalId: string) => {
    const sourceKey = key(kind, externalId);
    const existing = mapped.get(sourceKey);
    if (existing) return existing;
    const id = options.createId(kind);
    if (!id || engineIds.has(id))
      throw new Error("ID factory returned an empty or duplicate ID");
    engineIds.add(id);
    mapped.set(sourceKey, id);
    bindings.push({ source: options.source, kind, externalId, engineId: id });
    return id;
  };
  const collectionMap = new Map(
    snapshot.collections.map((collection) => [collection.id, collection])
  );
  const variableMap = new Map(
    snapshot.variables.map((variable) => [variable.i, variable])
  );
  if (
    collectionMap.size !== snapshot.collections.length ||
    variableMap.size !== snapshot.variables.length
  )
    throw new Error("Duplicate snapshot identity");
  const modeKey = (collectionId: string, modeId: string) =>
    JSON.stringify([collectionId, modeId]);
  const collections = snapshot.collections.map((collection) => {
    const rule = options.rules[collection.id];
    if (!rule) throw new Error(`Missing import rule for ${collection.name}`);
    if (
      new Set(collection.modes.map((mode) => mode.id)).size !==
        collection.modes.length ||
      !collection.modes.some((mode) => mode.id === collection.defaultModeId)
    )
      throw new Error(`Invalid source modes in ${collection.name}`);
    return {
      id: identity("collection", collection.id),
      name: collection.name,
      axis: rule.axis,
      modes: collection.modes.map((mode) => ({
        id: identity("mode", modeKey(collection.id, mode.id)),
        name: mode.name,
      })),
      defaultModeId: identity(
        "mode",
        modeKey(collection.id, collection.defaultModeId)
      ),
    };
  });
  for (const variable of snapshot.variables) identity("token", variable.i);
  for (const binding of bindings) {
    if (binding.retired || binding.source !== options.source) continue;
    const collection =
      binding.kind === "collection"
        ? collectionMap.get(binding.externalId)
        : binding.kind === "token"
          ? collectionMap.get(variableMap.get(binding.externalId)?.c ?? "")
          : undefined;
    const variable =
      binding.kind === "token"
        ? variableMap.get(binding.externalId)
        : undefined;
    if (
      collection?.remote === true ||
      collection?.isExtension === true ||
      variable?.remote === true
    )
      binding.readOnly = true;
    else if (
      collection?.remote === false &&
      collection?.isExtension === false &&
      (binding.kind === "collection" || variable?.remote === false)
    )
      binding.readOnly = false;
    // Missing metadata cannot silently revoke a previously known restriction.
  }
  const unitCache = new Map<string, NumberUnit>();
  if (
    options.remPixels !== undefined &&
    (!Number.isFinite(options.remPixels) || options.remPixels <= 0)
  )
    throw new Error("Invalid rem conversion");
  const knownSourceTokens = new Set(
    bindings
      .filter(
        (binding) =>
          binding.source === options.source && binding.kind === "token"
      )
      .map((binding) => binding.externalId)
  );
  for (const [id, unit] of Object.entries(options.numericUnits ?? {})) {
    if (!["px", "rem", "ratio", "fontWeight", "scalar"].includes(unit))
      throw new Error(`Invalid numeric unit for ${id}`);
    const variable = variableMap.get(id);
    // Preserve configuration for deleted, previously mapped source identities.
    // Unknown keys still fail so an ID typo cannot silently change import units.
    if (!variable && knownSourceTokens.has(id)) continue;
    if (variable?.t !== "FLOAT")
      throw new Error(
        `Numeric unit rule requires a source FLOAT variable: ${id}`
      );
  }
  const unitActive = new Set<string>();
  const unitFor = (id: string): NumberUnit => {
    if (unitCache.has(id)) return unitCache.get(id)!;
    const variable = variableMap.get(id);
    if (!variable) throw new Error(`Missing numeric dependency ${id}`);
    if (variable.t !== "FLOAT")
      throw new Error(
        `Numeric reference targets ${variable.n} of type ${variable.t}`
      );
    if (unitActive.has(id))
      throw new Error(`Numeric reference cycle at ${variable.n}`);
    unitActive.add(id);
    const units = new Set<NumberUnit>();
    const explicitUnit = options.numericUnits?.[id];
    if (explicitUnit) units.add(explicitUnit);
    for (const [, value] of variable.v) {
      if (value[0] === "a") units.add(unitFor(value[1]));
      else if (value[0] === "l") {
        if (!explicitUnit && options.requireExplicitNumericUnits)
          throw new Error(
            `Explicit numeric unit required for ${variable.n} (${id})`
          );
        units.add(
          explicitUnit ??
            (variable.s?.includes("FONT_WEIGHT")
              ? "fontWeight"
              : /(^|\/)transparency(\/|$)/i.test(variable.n) ||
                  variable.s?.includes("OPACITY")
                ? "ratio"
                : "px")
        );
      } else throw new Error(`Unexpected numeric composition at ${variable.n}`);
    }
    if (units.size !== 1)
      throw new Error(`Inconsistent or missing numeric units at ${variable.n}`);
    const unit = [...units][0]!;
    if (unit === "rem" && options.remPixels === undefined)
      throw new Error(`Explicit rem conversion required for ${variable.n}`);
    unitActive.delete(id);
    unitCache.set(id, unit);
    return unit;
  };
  const tokens: ProjectToken[] = snapshot.variables.map((variable) => {
    const sourceCollection = collectionMap.get(variable.c);
    if (!sourceCollection)
      throw new Error(`Missing collection for ${variable.n}`);
    const rule = options.rules[variable.c]!;
    const typeMap: Record<string, TokenType> = {
      COLOR: "color",
      FLOAT: "number",
      STRING: "string",
      BOOLEAN: "boolean",
      EASING: "cubicBezier",
      TIMING: "duration",
    };
    const type = typeMap[variable.t];
    if (!type)
      throw new Error(
        `Unsupported snapshot type ${variable.t} at ${variable.n}; configure a verified adapter conversion first`
      );
    const unit = type === "number" ? unitFor(variable.i) : undefined;
    const encode = (value: EncodedValue, numericUnit = unit): TokenValue => {
      if (value[0] === "a") {
        if (!variableMap.has(value[1]))
          throw new Error(`Missing dependency ${value[1]} at ${variable.n}`);
        return { kind: "alias", targetId: identity("token", value[1]) };
      }
      if (value[0] === "c")
        return {
          kind: "colorWithAlpha",
          color: encode(value[1]),
          alpha: encode(value[2], "ratio"),
        };
      if (value[0] !== "l")
        throw new Error(`Invalid encoding at ${variable.n}`);
      const raw = value[1];
      if (type === "duration") {
        if (typeof raw !== "number" || !Number.isFinite(raw))
          throw new Error(`Invalid timing value at ${variable.n}`);
        return { kind: "literal", value: raw * 1000 };
      }
      if (type === "cubicBezier") {
        if (
          !raw ||
          typeof raw !== "object" ||
          !("type" in raw) ||
          raw.type !== "CUSTOM_CUBIC_BEZIER" ||
          !("easingFunctionCubicBezier" in raw) ||
          !raw.easingFunctionCubicBezier ||
          typeof raw.easingFunctionCubicBezier !== "object"
        )
          throw new Error(
            `Unsupported easing expression at ${variable.n}; only custom cubic Bezier is currently mapped`
          );
        const curve = raw.easingFunctionCubicBezier as Record<string, unknown>;
        const coordinates = [curve.x1, curve.y1, curve.x2, curve.y2];
        if (
          !coordinates.every(
            (value) => typeof value === "number" && Number.isFinite(value)
          )
        )
          throw new Error(`Invalid cubic Bezier at ${variable.n}`);
        return {
          kind: "literal",
          value: coordinates as [number, number, number, number],
        };
      }
      if (
        type === "color" &&
        raw &&
        typeof raw === "object" &&
        "color" in raw &&
        "opacity" in raw
      ) {
        const color = raw.color;
        const colorValue: EncodedValue =
          color &&
          typeof color === "object" &&
          "type" in color &&
          color.type === "VARIABLE_ALIAS" &&
          "id" in color &&
          typeof color.id === "string"
            ? ["a", color.id]
            : ["l", color];
        return {
          kind: "colorWithAlpha",
          color: encode(colorValue),
          alpha: encode(["l", raw.opacity], "ratio"),
        };
      }
      return {
        kind: "literal",
        value: (numericUnit === "ratio" && typeof raw === "number"
          ? raw / 100
          : numericUnit === "rem" && typeof raw === "number"
            ? raw / options.remPixels!
            : raw) as Literal,
      };
    };
    const valuesByMode: Record<string, TokenValue> = Object.create(
      null
    ) as Record<string, TokenValue>;
    for (const [modeId, value] of variable.v) {
      if (!sourceCollection.modes.some((mode) => mode.id === modeId))
        throw new Error(`Unknown mode ${modeId} at ${variable.n}`);
      const id = identity("mode", modeKey(variable.c, modeId));
      if (Object.hasOwn(valuesByMode, id))
        throw new Error(`Duplicate mode value at ${variable.n}`);
      valuesByMode[id] = encode(value);
    }
    const path = variable.n.split("/");
    const cssPath =
      rule.css === "leaf"
        ? path.slice(-1)
        : rule.css === "palette"
          ? ["aviala", ...path]
          : path;
    return {
      id: identity("token", variable.i),
      collectionId: identity("collection", variable.c),
      path,
      layer: rule.layer,
      type,
      ...(unit ? { unit } : {}),
      ...(rule.css === "path"
        ? {}
        : { cssName: tokenCssName({ path: cssPath }) }),
      valuesByMode,
    };
  });
  const project: TokenProject = {
    schemaVersion: 1,
    id: options.projectId,
    draftRevision: 0,
    collections,
    tokens,
    cssCompatibility: [],
  };
  const diagnostics = validateProject(project);
  if (diagnostics.length)
    throw new Error(
      diagnostics
        .map((item) => `${item.path ?? project.id}: ${item.message}`)
        .join("\n")
    );
  return { project, bindings };
}

/** Update mappings after explicit token identity adoption, preserving old mapping history. */
export function adoptTokenSourceBinding(
  bindings: readonly SourceBinding[],
  source: string,
  externalId: string,
  newEngineId: string,
  retiredEngineId: string
): SourceBinding[] {
  if (newEngineId === retiredEngineId)
    throw new Error("Adoption requires distinct identities");
  const next = bindings.map((binding) => ({ ...binding }));
  const matches = next.filter(
    (binding) =>
      !binding.retired &&
      binding.source === source &&
      binding.kind === "token" &&
      binding.externalId === externalId &&
      binding.engineId === newEngineId
  );
  if (matches.length !== 1)
    throw new Error("New token source binding is missing or ambiguous");
  const previous = next.filter(
    (binding) =>
      !binding.retired &&
      binding.source === source &&
      binding.kind === "token" &&
      binding.engineId === retiredEngineId
  );
  if (previous.length !== 1)
    throw new Error("Retired token source binding is missing or ambiguous");
  previous[0]!.retired = true;
  matches[0]!.engineId = retiredEngineId;
  return next;
}

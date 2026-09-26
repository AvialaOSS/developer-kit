/** Portable authoring model; source-system IDs belong in adapter bindings. */
export type Axis = "color" | "density" | "effects" | "none";
export type TokenType =
  "color" | "number" | "string" | "boolean" | "duration" | "cubicBezier";
export type NumberUnit = "px" | "rem" | "ratio" | "fontWeight" | "scalar";
export type Literal =
  | string
  | number
  | boolean
  | { r: number; g: number; b: number; a: number }
  | [number, number, number, number];
export type TokenValue =
  | { kind: "literal"; value: Literal }
  | { kind: "alias"; targetId: string }
  | { kind: "colorWithAlpha"; color: TokenValue; alpha: TokenValue }
  | { kind: "inheritDefault" };
export interface TokenCollection {
  id: string;
  name: string;
  axis: Axis;
  modes: { id: string; name: string }[];
  defaultModeId: string;
}
export interface ProjectToken {
  id: string;
  collectionId: string;
  path: string[];
  layer: "foundation" | "semantic" | "component";
  type: TokenType;
  unit?: NumberUnit;
  cssName?: string;
  valuesByMode: Record<string, TokenValue>;
}
export interface TokenProject {
  schemaVersion: 1;
  id: string;
  draftRevision: number;
  collections: TokenCollection[];
  tokens: ProjectToken[];
  cssCompatibility: { name: string; targetId: string }[];
  tombstones?: TokenTombstone[];
}
export interface TokenTombstone {
  id: string;
  collectionId: string;
  path: string[];
  type: TokenType;
  unit?: NumberUnit;
  cssNames: string[];
  deletedInRevision: number;
}
export type ModeSelection = Partial<Record<Exclude<Axis, "none">, string>>;
export interface ProjectDiagnostic {
  code: string;
  message: string;
  tokenId?: string;
  path?: string;
  modeId?: string;
}

/** Read a JSON document at the trust boundary before semantic graph validation. */
export function parseProject(
  json: string,
  options: { allowMissingReferences?: boolean } = {}
): TokenProject {
  const input: unknown = JSON.parse(json);
  const fail = (path: string): never => {
    throw new Error(`Invalid project structure at ${path}`);
  };
  const record = (value: unknown, path: string): Record<string, unknown> => {
    if (!value || typeof value !== "object" || Array.isArray(value))
      return fail(path);
    return value as Record<string, unknown>;
  };
  const string = (value: unknown, path: string): void => {
    if (typeof value !== "string") fail(path);
  };
  const array = (value: unknown, path: string): unknown[] =>
    Array.isArray(value) ? value : fail(path);
  const allowed = (
    obj: Record<string, unknown>,
    keys: string[],
    path: string
  ): void => {
    for (const key of Object.keys(obj))
      if (!keys.includes(key)) fail(`${path}.${key}`);
  };
  const valueShape = (value: unknown, path: string, depth = 0): void => {
    if (depth > 64) fail(`${path}: expression nesting exceeds 64`);
    const node = record(value, path);
    if (node.kind === "literal") {
      allowed(node, ["kind", "value"], path);
      const literal = node.value;
      if (["number", "string", "boolean"].includes(typeof literal)) return;
      if (Array.isArray(literal)) {
        if (
          literal.length !== 4 ||
          !literal.every((item) => typeof item === "number")
        )
          fail(`${path}.value`);
        return;
      }
      const color = record(literal, `${path}.value`);
      allowed(color, ["r", "g", "b", "a"], `${path}.value`);
      for (const key of ["r", "g", "b", "a"])
        if (typeof color[key] !== "number") fail(`${path}.value.${key}`);
    } else if (node.kind === "alias") {
      allowed(node, ["kind", "targetId"], path);
      string(node.targetId, `${path}.targetId`);
    } else if (node.kind === "inheritDefault") allowed(node, ["kind"], path);
    else if (node.kind === "colorWithAlpha") {
      allowed(node, ["kind", "color", "alpha"], path);
      valueShape(node.color, `${path}.color`, depth + 1);
      valueShape(node.alpha, `${path}.alpha`, depth + 1);
    } else fail(`${path}.kind`);
  };
  const project = record(input, "project");
  allowed(
    project,
    [
      "schemaVersion",
      "id",
      "draftRevision",
      "collections",
      "tokens",
      "cssCompatibility",
      "tombstones",
    ],
    "project"
  );
  if (project.schemaVersion !== 1)
    throw new Error("Unsupported project schema version");
  string(project.id, "project.id");
  if (typeof project.draftRevision !== "number") fail("project.draftRevision");
  for (const [index, item] of array(
    project.collections,
    "collections"
  ).entries()) {
    const path = `collections[${index}]`,
      collection = record(item, path);
    allowed(collection, ["id", "name", "axis", "modes", "defaultModeId"], path);
    for (const key of ["id", "name", "axis", "defaultModeId"])
      string(collection[key], `${path}.${key}`);
    for (const [modeIndex, item] of array(
      collection.modes,
      `${path}.modes`
    ).entries()) {
      const modePath = `${path}.modes[${modeIndex}]`,
        mode = record(item, modePath);
      allowed(mode, ["id", "name"], modePath);
      string(mode.id, `${modePath}.id`);
      string(mode.name, `${modePath}.name`);
    }
  }
  for (const [index, item] of array(project.tokens, "tokens").entries()) {
    const path = `tokens[${index}]`,
      token = record(item, path);
    allowed(
      token,
      [
        "id",
        "collectionId",
        "path",
        "layer",
        "type",
        "unit",
        "cssName",
        "valuesByMode",
      ],
      path
    );
    for (const key of ["id", "collectionId", "layer", "type"])
      string(token[key], `${path}.${key}`);
    for (const key of ["unit", "cssName"])
      if (Object.hasOwn(token, key)) string(token[key], `${path}.${key}`);
    for (const part of array(token.path, `${path}.path`))
      string(part, `${path}.path`);
    for (const [mode, value] of Object.entries(
      record(token.valuesByMode, `${path}.valuesByMode`)
    ))
      valueShape(value, `${path}.valuesByMode.${mode}`);
  }
  for (const [index, item] of array(
    project.cssCompatibility,
    "cssCompatibility"
  ).entries()) {
    const path = `cssCompatibility[${index}]`,
      alias = record(item, path);
    allowed(alias, ["name", "targetId"], path);
    string(alias.name, `${path}.name`);
    string(alias.targetId, `${path}.targetId`);
  }
  const typed = input as TokenProject;
  if (Object.hasOwn(project, "tombstones"))
    for (const [index, item] of array(
      project.tombstones,
      "tombstones"
    ).entries()) {
      const path = `tombstones[${index}]`,
        tombstone = record(item, path);
      allowed(
        tombstone,
        [
          "id",
          "collectionId",
          "path",
          "type",
          "unit",
          "cssNames",
          "deletedInRevision",
        ],
        path
      );
      for (const key of ["id", "collectionId", "type"])
        string(tombstone[key], `${path}.${key}`);
      if (Object.hasOwn(tombstone, "unit"))
        string(tombstone.unit, `${path}.unit`);
      for (const key of ["path", "cssNames"])
        for (const part of array(tombstone[key], `${path}.${key}`))
          string(part, `${path}.${key}`);
      if (typeof tombstone.deletedInRevision !== "number")
        fail(`${path}.deletedInRevision`);
    }
  const diagnostics = validateProject(typed).filter(
    (issue) =>
      !(options.allowMissingReferences && issue.code === "alias-missing")
  );
  if (diagnostics.length)
    throw new Error(
      diagnostics
        .map(
          (item) => `${item.code}: ${item.path ?? typed.id}: ${item.message}`
        )
        .join("\n")
    );
  return typed;
}

/** Authoring drafts may retain broken references; publication is always strict. */
export function parseProjectDraft(json: string): TokenProject {
  return parseProject(json, { allowMissingReferences: true });
}

const axisModes: Record<Exclude<Axis, "none">, string[]> = {
  color: ["Light", "Dark"],
  density: ["Default", "Mobile Friendly"],
  effects: ["ON", "OFF"],
};
export function tokenCssName(
  token: Pick<ProjectToken, "path" | "cssName">
): string {
  return (
    token.cssName ??
    "--" +
      token.path
        .join("-")
        .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
        .replace(/[\s_]+/g, "-")
        .replace(/-+/g, "-")
        .toLowerCase()
  );
}

export function selectedMode(
  collection: TokenCollection,
  selection: ModeSelection
): string {
  if (collection.axis === "none" || selection[collection.axis] === undefined)
    return collection.defaultModeId;
  const mode = collection.modes.find(
    (item) => item.name === selection[collection.axis as Exclude<Axis, "none">]
  );
  if (!mode)
    throw new Error(
      `Collection ${collection.name} does not provide ${selection[collection.axis]}`
    );
  return mode.id;
}

function checkLiteral(
  type: TokenType,
  unit: NumberUnit | undefined,
  value: Literal
): boolean {
  if (type === "string") return typeof value === "string";
  if (type === "boolean") return typeof value === "boolean";
  if (type === "number" || type === "duration") {
    if (typeof value !== "number" || !Number.isFinite(value)) return false;
    if (type === "duration") return value >= 0;
    if (unit === "ratio") return value >= 0 && value <= 1;
    if (unit === "fontWeight") return value >= 1 && value <= 1000;
    return true;
  }
  if (type === "cubicBezier")
    return (
      Array.isArray(value) &&
      value.length === 4 &&
      value.every(Number.isFinite) &&
      value[0] >= 0 &&
      value[0] <= 1 &&
      value[2] >= 0 &&
      value[2] <= 1
    );
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value) &&
    [value.r, value.g, value.b, value.a].every(
      (channel) => Number.isFinite(channel) && channel >= 0 && channel <= 1
    )
  );
}

/** Validate the authored graph across every declared independent mode combination. */
export function validateProject(project: TokenProject): ProjectDiagnostic[] {
  const issues: ProjectDiagnostic[] = [];
  const report = (
    code: string,
    message: string,
    token?: ProjectToken,
    modeId?: string
  ) => {
    issues.push({
      code,
      message,
      ...(token ? { tokenId: token.id, path: token.path.join("/") } : {}),
      ...(modeId ? { modeId } : {}),
    });
  };
  if (project.schemaVersion !== 1)
    report("schema-version", "Unsupported project schema version");
  if (
    !project.id ||
    !Number.isInteger(project.draftRevision) ||
    project.draftRevision < 0
  )
    report(
      "project-identity",
      "Project ID and nonnegative integer draftRevision are required"
    );
  const collections = new Map<string, TokenCollection>();
  const tokens = new Map<string, ProjectToken>();
  const names = new Set<string>();
  const paths = new Set<string>();
  for (const collection of project.collections) {
    if (!collection.id || collections.has(collection.id))
      report(
        "collection-id",
        `Duplicate or empty collection ID: ${collection.id}`
      );
    collections.set(collection.id, collection);
    const ids = new Set(collection.modes.map((mode) => mode.id));
    const modeNames = new Set(collection.modes.map((mode) => mode.name));
    if (
      !collection.modes.length ||
      ids.size !== collection.modes.length ||
      modeNames.size !== collection.modes.length ||
      !ids.has(collection.defaultModeId) ||
      collection.modes.some((mode) => !mode.id || !mode.name)
    )
      report("collection-modes", `Invalid modes in ${collection.name}`);
    if (collection.axis === "none") {
      if (collection.modes.length !== 1)
        report(
          "mode-axis",
          `${collection.name} without an axis must have one mode`
        );
    } else if (
      !axisModes[collection.axis] ||
      collection.modes.some(
        (mode) =>
          !axisModes[collection.axis as Exclude<Axis, "none">]?.includes(
            mode.name
          )
      )
    )
      report("mode-axis", `Unexpected mode convention in ${collection.name}`);
  }
  for (const token of project.tokens) {
    if (!token.id || tokens.has(token.id))
      report("token-id", `Duplicate or empty token ID: ${token.id}`, token);
    tokens.set(token.id, token);
    const pathKey = JSON.stringify([token.collectionId, token.path]);
    if (
      !token.path.length ||
      token.path.some((part) => !part.trim() || part.includes("/")) ||
      paths.has(pathKey)
    )
      report("token-path", "Duplicate or invalid token path", token);
    paths.add(pathKey);
    const css = tokenCssName(token);
    if (!/^--[a-z][a-z0-9-]*$/.test(css) || names.has(css))
      report("css-name", `Invalid or duplicate CSS name: ${css}`, token);
    names.add(css);
    if (
      token.type === "number"
        ? !["px", "rem", "ratio", "fontWeight", "scalar"].includes(
            token.unit ?? ""
          )
        : token.unit !== undefined
    )
      report(
        "unit",
        "Numbers require an explicit unit; other types must not declare one",
        token
      );
    if (!["foundation", "semantic", "component"].includes(token.layer))
      report("layer", "Invalid token layer", token);
    if (
      ![
        "color",
        "number",
        "string",
        "boolean",
        "duration",
        "cubicBezier",
      ].includes(token.type)
    )
      report("type", "Invalid token type", token);
    const collection = collections.get(token.collectionId);
    if (!collection) {
      report("collection-missing", "Token collection does not exist", token);
      continue;
    }
    for (const mode of collection.modes)
      if (!Object.hasOwn(token.valuesByMode, mode.id))
        report(
          "mode-value-missing",
          `Missing value for ${mode.name}`,
          token,
          mode.id
        );
    for (const modeId of Object.keys(token.valuesByMode))
      if (!collection.modes.some((mode) => mode.id === modeId))
        report("mode-unknown", "Value uses an unknown mode", token, modeId);
  }
  for (const alias of project.cssCompatibility) {
    if (!/^--[a-z][a-z0-9-]*$/.test(alias.name) || names.has(alias.name))
      report("css-name", `Compatibility name collision: ${alias.name}`);
    names.add(alias.name);
    if (!tokens.has(alias.targetId))
      report(
        "alias-missing",
        `Missing compatibility target: ${alias.targetId}`
      );
  }
  const retired = new Set<string>();
  for (const tombstone of project.tombstones ?? []) {
    if (
      !tombstone.id ||
      retired.has(tombstone.id) ||
      tokens.has(tombstone.id) ||
      !tombstone.collectionId ||
      !tombstone.path.length ||
      tombstone.path.some((part) => !part.trim() || part.includes("/")) ||
      !Number.isInteger(tombstone.deletedInRevision) ||
      tombstone.deletedInRevision < 0 ||
      tombstone.deletedInRevision > project.draftRevision ||
      ![
        "color",
        "number",
        "string",
        "boolean",
        "duration",
        "cubicBezier",
      ].includes(tombstone.type) ||
      (tombstone.type === "number"
        ? !["px", "rem", "ratio", "fontWeight", "scalar"].includes(
            tombstone.unit ?? ""
          )
        : tombstone.unit !== undefined) ||
      !tombstone.cssNames.length ||
      tombstone.cssNames.some((name) => !/^--[a-z][a-z0-9-]*$/.test(name))
    )
      report("tombstone", `Invalid retired token identity: ${tombstone.id}`);
    retired.add(tombstone.id);
  }
  const checkValue = (
    value: TokenValue,
    token: ProjectToken,
    modeId: string,
    type = token.type,
    unit = token.unit
  ): void => {
    if (!value || typeof value !== "object") {
      report("value", "Invalid value", token, modeId);
      return;
    }
    switch (value.kind) {
      case "literal":
        if (!checkLiteral(type, unit, value.value))
          report(
            "literal",
            "Literal does not match type or range",
            token,
            modeId
          );
        break;
      case "alias": {
        const target = tokens.get(value.targetId);
        if (!target)
          report(
            "alias-missing",
            `Missing target ${value.targetId}`,
            token,
            modeId
          );
        else if (target.type !== type || target.unit !== unit)
          report(
            "alias-type",
            `Incompatible target ${target.path.join("/")}`,
            token,
            modeId
          );
        break;
      }
      case "inheritDefault":
        if (modeId === collections.get(token.collectionId)?.defaultModeId)
          report(
            "default-inheritance",
            "Default mode cannot inherit itself",
            token,
            modeId
          );
        break;
      case "colorWithAlpha":
        if (type !== "color")
          report(
            "composed-type",
            "Color composition requires a color token",
            token,
            modeId
          );
        if (
          value.color?.kind === "inheritDefault" ||
          value.alpha?.kind === "inheritDefault"
        )
          report(
            "composed-inheritance",
            "Inheritance must be the whole mode value",
            token,
            modeId
          );
        checkValue(value.color, token, modeId, "color", undefined);
        checkValue(value.alpha, token, modeId, "number", "ratio");
        break;
      default:
        report("value-kind", "Unknown value kind", token, modeId);
    }
  };
  for (const token of project.tokens)
    for (const [mode, value] of Object.entries(token.valuesByMode))
      checkValue(value, token, mode);
  if (issues.length) return issues;
  const choices = (axis: Exclude<Axis, "none">) => [
    ...new Set(
      project.collections
        .filter((c) => c.axis === axis)
        .flatMap((c) => c.modes.map((m) => m.name))
    ),
  ];
  let selections: ModeSelection[] = [{}];
  for (const axis of ["color", "density", "effects"] as const) {
    const modes = choices(axis);
    if (modes.length)
      selections = selections.flatMap((selection) => [
        // An omitted axis uses each collection's own default, which can differ
        // from every explicit shared-axis combination.
        selection,
        ...modes.map((mode) => ({ ...selection, [axis]: mode })),
      ]);
  }
  for (const selection of selections) {
    try {
      resolveUnchecked(project, selection);
    } catch (error) {
      report(
        "resolution",
        `${JSON.stringify(selection)}: ${error instanceof Error ? error.message : String(error)}`,
        error instanceof ProjectResolutionError ? error.token : undefined,
        error instanceof ProjectResolutionError ? error.modeId : undefined
      );
    }
  }
  return issues;
}

class ProjectResolutionError extends Error {
  constructor(
    message: string,
    readonly token: ProjectToken,
    readonly modeId: string
  ) {
    super(message);
    this.name = "ProjectResolutionError";
  }
}

function resolveUnchecked(
  project: TokenProject,
  selection: ModeSelection
): Record<string, Literal> {
  const tokens = new Map(project.tokens.map((token) => [token.id, token]));
  const collections = new Map(project.collections.map((c) => [c.id, c]));
  const result: Record<string, Literal> = Object.create(null) as Record<
    string,
    Literal
  >;
  const active = new Set<string>();
  const resolveToken = (id: string): Literal => {
    if (Object.hasOwn(result, id)) return result[id]!;
    const token = tokens.get(id);
    if (!token) throw new Error(`Missing token ${id}`);
    const collection = collections.get(token.collectionId)!;
    const modeId = selectedMode(collection, selection);
    if (active.has(id))
      throw new ProjectResolutionError(
        `Reference cycle at ${token.path.join("/")} (mode ${modeId})`,
        token,
        modeId
      );
    active.add(id);
    const resolveValue = (value: TokenValue): Literal => {
      if (value.kind === "literal") return value.value;
      if (value.kind === "alias") return resolveToken(value.targetId);
      if (value.kind === "inheritDefault")
        return resolveValue(token.valuesByMode[collection.defaultModeId]!);
      const color = resolveValue(value.color) as {
        r: number;
        g: number;
        b: number;
        a: number;
      };
      const alpha = resolveValue(value.alpha) as number;
      return { ...color, a: color.a * alpha };
    };
    result[id] = resolveValue(token.valuesByMode[modeId]!);
    active.delete(id);
    return result[id]!;
  };
  for (const token of project.tokens) resolveToken(token.id);
  return result;
}

export function resolveProject(
  project: TokenProject,
  selection: ModeSelection = {}
): Record<string, Literal> {
  const issues = validateProject(project);
  if (issues.length)
    throw new Error(
      issues
        .map(
          (issue) =>
            `${issue.code}: ${issue.path ?? project.id}: ${issue.message}`
        )
        .join("\n")
    );
  return resolveUnchecked(project, selection);
}

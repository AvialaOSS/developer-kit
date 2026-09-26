import {
  parseProject,
  tokenCssName,
  type TokenProject,
  type TokenValue,
} from "./project";

/** Hosts provide SHA-256; the core does not depend on Node, DOM or Figma APIs. */
export type ContentHasher = (canonicalJson: string) => Promise<string>;
export interface ProjectRelease {
  projectId: string;
  version: string;
  contentHash: string;
  project: TokenProject;
}
export interface ThemeOverlay {
  id: string;
  base: { projectId: string; version: string; contentHash: string };
  overrides: { tokenId: string; modeId: string; value: TokenValue }[];
}

function record(
  value: unknown,
  keys: string[],
  path: string
): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value))
    throw new Error(`Invalid object at ${path}`);
  const result = value as Record<string, unknown>;
  for (const key of Object.keys(result))
    if (!keys.includes(key)) throw new Error(`Unknown field: ${path}.${key}`);
  for (const key of keys)
    if (!Object.hasOwn(result, key))
      throw new Error(`Missing field: ${path}.${key}`);
  return result;
}
function text(value: unknown, path: string): asserts value is string {
  if (typeof value !== "string" || !value.trim())
    throw new Error(`Invalid string at ${path}`);
}
function validVersion(value: unknown): void {
  if (
    typeof value !== "string" ||
    !/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/.test(value) ||
    value.split(".").some((part) => !Number.isSafeInteger(Number(part)))
  )
    throw new Error("Release version must be major.minor.patch");
}
function baseShape(value: unknown, path: string): void {
  const base = record(value, ["projectId", "version", "contentHash"], path);
  text(base.projectId, `${path}.projectId`);
  validVersion(base.version);
  if (
    typeof base.contentHash !== "string" ||
    !/^[a-f0-9]{64}$/.test(base.contentHash)
  )
    throw new Error(`Invalid hash at ${path}.contentHash`);
}
function readRelease(json: string): ProjectRelease {
  const input: unknown = JSON.parse(json);
  const value = record(
    input,
    ["projectId", "version", "contentHash", "project"],
    "release"
  );
  baseShape(
    {
      projectId: value.projectId,
      version: value.version,
      contentHash: value.contentHash,
    },
    "release"
  );
  value.project = parseProject(JSON.stringify(value.project));
  return value as unknown as ProjectRelease;
}
function readOverlay(json: string): ThemeOverlay {
  const input: unknown = JSON.parse(json);
  const value = record(input, ["id", "base", "overrides"], "theme");
  text(value.id, "theme.id");
  baseShape(value.base, "theme.base");
  if (!Array.isArray(value.overrides))
    throw new Error("Invalid array at theme.overrides");
  for (const [index, item] of value.overrides.entries()) {
    const path = `theme.overrides[${index}]`;
    const override = record(item, ["tokenId", "modeId", "value"], path);
    text(override.tokenId, `${path}.tokenId`);
    text(override.modeId, `${path}.modeId`);
  }
  return value as unknown as ThemeOverlay;
}

export async function parseProjectRelease(
  json: string,
  hash: ContentHasher
): Promise<ProjectRelease> {
  const release = readRelease(json);
  await verifyProjectRelease(release, hash);
  return freeze(release);
}
export async function parseThemeOverlay(
  json: string,
  release: ProjectRelease,
  hash: ContentHasher
): Promise<ThemeOverlay> {
  const theme = readOverlay(json);
  await materializeTheme(theme, release, hash);
  return theme;
}

function canonical(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonical).join(",")}]`;
  if (value && typeof value === "object")
    return `{${Object.entries(value)
      .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
      .map(([key, item]) => `${JSON.stringify(key)}:${canonical(item)}`)
      .join(",")}}`;
  return JSON.stringify(value);
}
function freeze<T>(value: T): T {
  if (value && typeof value === "object") {
    for (const item of Object.values(value)) freeze(item);
    Object.freeze(value);
  }
  return value;
}
async function digest(
  project: TokenProject,
  hash: ContentHasher
): Promise<string> {
  const value = await hash(canonical(project));
  if (!/^[a-f0-9]{64}$/.test(value))
    throw new Error("ContentHasher must return a lowercase SHA-256 digest");
  return value;
}

/** Creates an immutable local release; persistence/publication belongs to the host. */
export async function createProjectRelease(
  project: TokenProject,
  version: string,
  hash: ContentHasher,
  existing: readonly ProjectRelease[] = [],
  approvedBreakingCssNames: readonly string[] = []
): Promise<ProjectRelease> {
  validVersion(version);
  existing = existing.map((item) => readRelease(JSON.stringify(item)));
  approvedBreakingCssNames = [...approvedBreakingCssNames];
  if (
    existing.some(
      (release) =>
        release.projectId === project.id && release.version === version
    )
  )
    throw new Error(`Release already exists: ${project.id}@${version}`);
  const snapshot = parseProject(JSON.stringify(project));
  const names = (value: TokenProject) =>
    new Map([
      ...value.tokens.map((token) => [tokenCssName(token), token.id] as const),
      ...value.cssCompatibility.map(
        (alias) => [alias.name, alias.targetId] as const
      ),
    ]);
  const currentNames = names(snapshot);
  const history = existing
    .filter((item) => item.projectId === snapshot.id)
    .sort((a, b) => {
      const left = a.version.split(".").map(Number),
        right = b.version.split(".").map(Number);
      return (
        right[0]! - left[0]! || right[1]! - left[1]! || right[2]! - left[2]!
      );
    });
  for (const previous of history.slice(0, 1)) {
    const verified = await verifyProjectRelease(previous, hash);
    const breaking = [...names(verified)]
      .filter(([name, id]) => currentNames.get(name) !== id)
      .map(([name]) => name);
    if (
      breaking.length &&
      (Number(version.split(".")[0]) <=
        Number(previous.version.split(".")[0]) ||
        breaking.some((name) => !approvedBreakingCssNames.includes(name)))
    ) {
      throw new Error(
        `CSS removals or identity changes require a major release and approved migration list: ${breaking.join(", ")}`
      );
    }
  }
  return freeze({
    projectId: snapshot.id,
    version,
    contentHash: await digest(snapshot, hash),
    project: snapshot,
  });
}

export async function verifyProjectRelease(
  release: ProjectRelease,
  hash: ContentHasher
): Promise<TokenProject> {
  const snapshot = readRelease(JSON.stringify(release));
  const project = snapshot.project;
  if (
    project.id !== snapshot.projectId ||
    (await digest(project, hash)) !== snapshot.contentHash
  )
    throw new Error("Release identity or content hash mismatch");
  return project;
}

function assertBase(theme: ThemeOverlay, release: ProjectRelease): void {
  if (!theme.id.trim()) throw new Error("Theme ID is required");
  if (
    theme.base.projectId !== release.projectId ||
    theme.base.version !== release.version ||
    theme.base.contentHash !== release.contentHash
  )
    throw new Error("Theme requires its exact base project release");
}

function applyOverrides(
  project: TokenProject,
  theme: ThemeOverlay
): TokenProject {
  const tokens = new Map(project.tokens.map((token) => [token.id, token]));
  const used = new Set<string>();
  const issues: string[] = [];
  for (const override of theme.overrides) {
    const key = JSON.stringify([override.tokenId, override.modeId]);
    if (used.has(key)) {
      issues.push(`Duplicate override: ${key}`);
      continue;
    }
    used.add(key);
    const token = tokens.get(override.tokenId);
    if (!token) {
      issues.push(`Missing overridden token: ${override.tokenId}`);
      continue;
    }
    const collection = project.collections.find(
      (item) => item.id === token.collectionId
    )!;
    if (!collection.modes.some((mode) => mode.id === override.modeId)) {
      issues.push(
        `Missing override mode: ${override.tokenId}/${override.modeId}`
      );
      continue;
    }
    token.valuesByMode[override.modeId] = override.value;
  }
  // Revalidates aliases, units, missing modes and cycles across every axis.
  if (issues.length) throw new Error(issues.join("\n"));
  return parseProject(JSON.stringify(project));
}

export async function materializeTheme(
  theme: ThemeOverlay,
  release: ProjectRelease,
  hash: ContentHasher
): Promise<TokenProject> {
  const overlay = readOverlay(JSON.stringify(theme));
  const snapshot = readRelease(JSON.stringify(release));
  assertBase(overlay, snapshot);
  return applyOverrides(await verifyProjectRelease(snapshot, hash), overlay);
}

export interface ThemeUpgradeDecisions {
  /** Explicit user-selected replacements; no name-based inference is made. */
  tokenReplacements?: Record<string, string>;
  modeReplacements?: Record<string, string>;
  dropOverrides?: { tokenId: string; modeId: string }[];
}
export type ThemeUpgradeResult =
  | { ok: true; theme: ThemeOverlay; project: TokenProject }
  | { ok: false; conflicts: string[] };

function readUpgradeDecisions(json: string): ThemeUpgradeDecisions {
  const input: unknown = JSON.parse(json);
  // Optional fields still need strict shape checks at the host boundary.
  const value = record(input, Object.keys(input ?? {}), "decisions");
  for (const key of Object.keys(value)) {
    if (
      !["tokenReplacements", "modeReplacements", "dropOverrides"].includes(key)
    )
      throw new Error(`Unknown field: decisions.${key}`);
  }
  for (const key of ["tokenReplacements", "modeReplacements"] as const) {
    if (!Object.hasOwn(value, key)) continue;
    const mapping = record(
      value[key],
      Object.keys(value[key] ?? {}),
      `decisions.${key}`
    );
    for (const [source, target] of Object.entries(mapping)) {
      text(source, `decisions.${key} source`);
      text(target, `decisions.${key}.${source}`);
    }
  }
  if (Object.hasOwn(value, "dropOverrides")) {
    if (!Array.isArray(value.dropOverrides))
      throw new Error("Invalid array at decisions.dropOverrides");
    for (const [index, item] of value.dropOverrides.entries()) {
      const path = `decisions.dropOverrides[${index}]`;
      const dropped = record(item, ["tokenId", "modeId"], path);
      text(dropped.tokenId, `${path}.tokenId`);
      text(dropped.modeId, `${path}.modeId`);
    }
  }
  return value as ThemeUpgradeDecisions;
}

/** Returns a new theme only after complete validation; the old theme is untouched. */
export async function upgradeTheme(
  theme: ThemeOverlay,
  from: ProjectRelease,
  to: ProjectRelease,
  hash: ContentHasher,
  decisions: ThemeUpgradeDecisions = {}
): Promise<ThemeUpgradeResult> {
  try {
    theme = readOverlay(JSON.stringify(theme));
    from = readRelease(JSON.stringify(from));
    to = readRelease(JSON.stringify(to));
    decisions = readUpgradeDecisions(JSON.stringify(decisions));
    await materializeTheme(theme, from, hash);
    if (from.projectId !== to.projectId)
      throw new Error("Cannot upgrade to a different base project");
    const target = await verifyProjectRelease(to, hash);
    if (from.version === to.version && from.contentHash !== to.contentHash)
      throw new Error(
        "Conflicting immutable release: the same project version has different content; publish a new version before upgrading"
      );
    const replacements: Record<string, string> = Object.assign(
      Object.create(null),
      decisions.tokenReplacements ?? {}
    );
    const modeReplacements: Record<string, string> = Object.assign(
      Object.create(null),
      decisions.modeReplacements ?? {}
    );
    const sourceTokens = new Map(
      from.project.tokens.map((token) => [token.id, token])
    );
    const targetTokens = new Map(
      target.tokens.map((token) => [token.id, token])
    );
    const existingOverrides = new Set(
      theme.overrides.map((item) => JSON.stringify([item.tokenId, item.modeId]))
    );
    const dropped = new Set<string>();
    for (const item of decisions.dropOverrides ?? []) {
      const key = JSON.stringify([item.tokenId, item.modeId]);
      if (!existingOverrides.has(key) || dropped.has(key))
        throw new Error(`Unknown or duplicate dropped override: ${key}`);
      dropped.add(key);
    }
    const retained = theme.overrides.filter(
      (item) => !dropped.has(JSON.stringify([item.tokenId, item.modeId]))
    );
    const referencedTokens = new Set(retained.map((item) => item.tokenId));
    const collectReferences = (value: TokenValue): void => {
      if (value.kind === "alias") referencedTokens.add(value.targetId);
      if (value.kind === "colorWithAlpha") {
        collectReferences(value.color);
        collectReferences(value.alpha);
      }
    };
    retained.forEach((item) => collectReferences(item.value));
    for (const [id, replacement] of Object.entries(replacements)) {
      if (!referencedTokens.has(id))
        throw new Error(`Unused token replacement: ${id}`);
      const old = sourceTokens.get(id),
        next = targetTokens.get(replacement);
      if (!old || !next || old.type !== next.type || old.unit !== next.unit)
        throw new Error(`Incompatible replacement: ${id} -> ${replacement}`);
    }
    // A stable ID does not authorize reinterpreting a retained value or alias.
    for (const id of referencedTokens) {
      const old = sourceTokens.get(id);
      const next = targetTokens.get(replacements[id] ?? id);
      if (old && next && (old.type !== next.type || old.unit !== next.unit))
        throw new Error(
          `Incompatible upgraded token: ${id}; choose a compatible replacement or drop the affected override`
        );
    }
    for (const [id, replacement] of Object.entries(modeReplacements)) {
      const affected = retained.filter((item) => item.modeId === id);
      if (!affected.length) throw new Error(`Unused mode replacement: ${id}`);
      for (const item of affected) {
        const token = targetTokens.get(
          replacements[item.tokenId] ?? item.tokenId
        );
        const collection = target.collections.find(
          (entry) => entry.id === token?.collectionId
        );
        if (!collection?.modes.some((mode) => mode.id === replacement))
          throw new Error(
            `Incompatible mode replacement: ${id} -> ${replacement} for ${item.tokenId}`
          );
      }
    }
    const remap = (value: TokenValue): TokenValue => {
      if (value.kind === "alias")
        return {
          ...value,
          targetId: replacements[value.targetId] ?? value.targetId,
        };
      if (value.kind === "colorWithAlpha")
        return {
          ...value,
          color: remap(value.color),
          alpha: remap(value.alpha),
        };
      return { ...value };
    };
    const next: ThemeOverlay = {
      id: theme.id,
      base: {
        projectId: to.projectId,
        version: to.version,
        contentHash: to.contentHash,
      },
      overrides: retained.map((item) => ({
        tokenId: replacements[item.tokenId] ?? item.tokenId,
        modeId: modeReplacements[item.modeId] ?? item.modeId,
        value: remap(item.value),
      })),
    };
    return { ok: true, theme: next, project: applyOverrides(target, next) };
  } catch (error) {
    return {
      ok: false,
      conflicts: (error instanceof Error ? error.message : String(error)).split(
        "\n"
      ),
    };
  }
}

/** Copies the full graph, preserving references rather than flattening values. */
export async function detachTheme(
  theme: ThemeOverlay,
  release: ProjectRelease,
  newProjectId: string,
  hash: ContentHasher
): Promise<TokenProject> {
  if (!newProjectId.trim() || newProjectId === release.projectId)
    throw new Error("Detached project needs a new project ID");
  const project = await materializeTheme(theme, release, hash);
  project.id = newProjectId;
  // Retired identities retain their deletion revisions in the copied history.
  // Resetting only the project revision would make that history invalid.
  return parseProject(JSON.stringify(project));
}

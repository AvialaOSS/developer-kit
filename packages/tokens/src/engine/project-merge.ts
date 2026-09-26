import {
  parseProjectDraft,
  tokenCssName,
  validateProject,
  type TokenProject,
  type ProjectDiagnostic,
} from "./project";

export interface ProjectMergeConflict {
  /** JSON-encoded path, stable across collection/token ordering changes. */
  key: string;
  base: unknown;
  local: unknown;
  incoming: unknown;
}
export type ProjectMergeResult =
  | { ok: true; project: TokenProject }
  | {
      ok: false;
      conflicts: ProjectMergeConflict[];
      diagnostics: ProjectDiagnostic[];
      /** Review-only graph for explicit identity repair; never apply without strict validation. */
      repairDraft?: TokenProject;
    };
type Choice = "local" | "incoming";
function canonical(value: unknown): string {
  if (value === undefined) return "undefined";
  if (Array.isArray(value)) return `[${value.map(canonical).join(",")}]`;
  if (value && typeof value === "object")
    return `{${Object.entries(value)
      .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
      .map(([key, item]) => `${JSON.stringify(key)}:${canonical(item)}`)
      .join(",")}}`;
  return JSON.stringify(value);
}
const equal = (a: unknown, b: unknown) => canonical(a) === canonical(b);
const object = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === "object" && !Array.isArray(value);

/** Three-way merge by stable identity. A conflicted/invalid result is never applied. */
export function mergeProjects(
  base: TokenProject,
  local: TokenProject,
  incoming: TokenProject,
  choices: Record<string, Choice> = {}
): ProjectMergeResult {
  base = parseProjectDraft(JSON.stringify(base));
  local = parseProjectDraft(JSON.stringify(local));
  incoming = parseProjectDraft(JSON.stringify(incoming));
  if (base.id !== local.id || local.id !== incoming.id)
    throw new Error("Cannot merge different project identities");
  const conflicts: ProjectMergeConflict[] = [],
    used = new Set<string>();
  const merge = (
    before: unknown,
    ours: unknown,
    theirs: unknown,
    path: string[]
  ): unknown => {
    if (equal(ours, theirs) || equal(before, theirs)) return ours;
    if (equal(before, ours)) return theirs;
    const listKey =
      path.at(-1) === "cssCompatibility"
        ? "name"
        : ["tokens", "collections", "modes", "tombstones"].includes(
              path.at(-1) ?? ""
            )
          ? "id"
          : undefined;
    if (
      listKey &&
      Array.isArray(before) &&
      Array.isArray(ours) &&
      Array.isArray(theirs)
    ) {
      const map = (items: unknown[]) =>
        new Map(
          items.map((item) => [(item as Record<string, string>)[listKey], item])
        );
      const b = map(before),
        l = map(ours),
        r = map(theirs);
      return [...new Set([...l.keys(), ...r.keys(), ...b.keys()])]
        .map((id) => merge(b.get(id), l.get(id), r.get(id), [...path, id]))
        .filter((item) => item !== undefined);
    }
    if (object(before) && object(ours) && object(theirs)) {
      const result: Record<string, unknown> = Object.create(null);
      for (const key of new Set([
        ...Object.keys(ours),
        ...Object.keys(theirs),
        ...Object.keys(before),
      ])) {
        const value = merge(before[key], ours[key], theirs[key], [
          ...path,
          key,
        ]);
        if (value !== undefined) result[key] = value;
      }
      return result;
    }
    const key = JSON.stringify(path);
    if (Object.hasOwn(choices, key)) {
      if (choices[key] !== "local" && choices[key] !== "incoming")
        throw new Error(`Invalid merge choice: ${key}`);
      used.add(key);
      return choices[key] === "local" ? ours : theirs;
    }
    conflicts.push({ key, base: before, local: ours, incoming: theirs });
    return ours;
  };
  // Revisions are host bookkeeping, never a competing authoring field.
  const revision = local.draftRevision;
  base.draftRevision = local.draftRevision = incoming.draftRevision = 0;
  base.tombstones ??= [];
  local.tombstones ??= [];
  incoming.tombstones ??= [];
  const merged = merge(base, local, incoming, []) as TokenProject;
  for (const key of Object.keys(choices))
    if (!used.has(key))
      throw new Error(`Stale or unknown merge choice: ${key}`);
  if (conflicts.length) return { ok: false, conflicts, diagnostics: [] };
  const changed = !equal(merged, local);
  merged.draftRevision = revision + (changed ? 1 : 0);
  const active = new Map(merged.tokens.map((token) => [token.id, token]));
  // Renames preserve old CSS names; deletions preserve retired identities.
  for (const old of local.tokens) {
    const next = active.get(old.id);
    if (!next) {
      if (!merged.tombstones!.some((item) => item.id === old.id))
        merged.tombstones!.push({
          id: old.id,
          collectionId: old.collectionId,
          path: old.path,
          type: old.type,
          ...(old.unit ? { unit: old.unit } : {}),
          cssNames: [
            tokenCssName(old),
            ...local.cssCompatibility
              .filter((alias) => alias.targetId === old.id)
              .map((alias) => alias.name),
          ],
          deletedInRevision: merged.draftRevision,
        });
    } else if (tokenCssName(old) !== tokenCssName(next)) {
      merged.cssCompatibility = merged.cssCompatibility.filter(
        (alias) =>
          !(alias.name === tokenCssName(next) && alias.targetId === next.id)
      );
      if (
        !merged.cssCompatibility.some(
          (alias) => alias.name === tokenCssName(old)
        )
      )
        merged.cssCompatibility.push({
          name: tokenCssName(old),
          targetId: old.id,
        });
    }
  }
  const diagnostics = validateProject(merged);
  if (diagnostics.length)
    return {
      ok: false,
      conflicts: [],
      diagnostics,
      ...(diagnostics.every((issue) => issue.code === "alias-missing")
        ? { repairDraft: parseProjectDraft(JSON.stringify(merged)) }
        : {}),
    };
  return { ok: true, project: parseProjectDraft(JSON.stringify(merged)) };
}

/** Figma does not own Engine-only compatibility and retirement metadata. */
export function mergeSnapshotCandidate(
  baseline: TokenProject,
  local: TokenProject,
  candidate: TokenProject,
  choices: Record<string, Choice> = {}
): ProjectMergeResult {
  return mergeProjects(
    baseline,
    local,
    {
      ...candidate,
      cssCompatibility: baseline.cssCompatibility,
      tombstones: baseline.tombstones ?? [],
    },
    choices
  );
}

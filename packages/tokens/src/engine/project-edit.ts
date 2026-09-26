import {
  parseProjectDraft,
  tokenCssName,
  type TokenProject,
  type TokenTombstone,
  type TokenValue,
} from "./project";

/** Rename without changing identity. null explicitly returns CSS naming to the path. */
export function renameProjectToken(
  project: TokenProject,
  tokenId: string,
  path: readonly string[],
  options: { cssName?: string | null } = {}
): TokenProject {
  const next = parseProjectDraft(JSON.stringify(project));
  const token = next.tokens.find((item) => item.id === tokenId);
  if (!token) throw new Error(`Token not found: ${tokenId}`);
  const previous = tokenCssName(token);
  const before = JSON.stringify(token);
  token.path = [...path];
  if (options.cssName === null) delete token.cssName;
  else if (options.cssName !== undefined) token.cssName = options.cssName;
  if (JSON.stringify(token) === before) return next;
  const current = tokenCssName(token);
  if (previous !== current) {
    // A historical alias may become this same token's canonical name again.
    next.cssCompatibility = next.cssCompatibility.filter(
      (alias) => !(alias.name === current && alias.targetId === tokenId)
    );
    if (
      !next.cssCompatibility.some(
        (alias) => alias.name === previous && alias.targetId === tokenId
      )
    )
      next.cssCompatibility.push({ name: previous, targetId: tokenId });
  }
  next.draftRevision++;
  return parseProjectDraft(JSON.stringify(next));
}

export function deleteProjectToken(
  project: TokenProject,
  tokenId: string
): TokenProject {
  const next = parseProjectDraft(JSON.stringify(project));
  const token = next.tokens.find((item) => item.id === tokenId);
  if (!token) throw new Error(`Token not found: ${tokenId}`);
  next.draftRevision++;
  const tombstone: TokenTombstone = {
    id: token.id,
    collectionId: token.collectionId,
    path: [...token.path],
    type: token.type,
    ...(token.unit ? { unit: token.unit } : {}),
    cssNames: [
      tokenCssName(token),
      ...next.cssCompatibility
        .filter((alias) => alias.targetId === token.id)
        .map((alias) => alias.name),
    ],
    deletedInRevision: next.draftRevision,
  };
  next.tokens = next.tokens.filter((item) => item.id !== tokenId);
  next.tombstones = [...(next.tombstones ?? []), tombstone];
  return parseProjectDraft(JSON.stringify(next));
}

/** Discovery only: same-name matches never adopt identities automatically. */
export function findRetiredTokenCandidates(
  project: TokenProject,
  collectionId: string,
  path: readonly string[]
): TokenTombstone[] {
  return (project.tombstones ?? [])
    .filter(
      (item) =>
        item.collectionId === collectionId &&
        JSON.stringify(item.path) === JSON.stringify(path)
    )
    .map((item) => ({
      ...item,
      path: [...item.path],
      cssNames: [...item.cssNames],
    }));
}

/** The caller must obtain an explicit user choice before invoking adoption. */
export function adoptRetiredTokenIdentity(
  project: TokenProject,
  newTokenId: string,
  retiredId: string
): TokenProject {
  const next = parseProjectDraft(JSON.stringify(project));
  const token = next.tokens.find((item) => item.id === newTokenId);
  const retired = next.tombstones?.find((item) => item.id === retiredId);
  if (!token || !retired)
    throw new Error("New token or retired identity not found");
  if (token.type !== retired.type || token.unit !== retired.unit)
    throw new Error("Retired identity has an incompatible type or unit");
  const remap = (value: TokenValue): TokenValue => {
    if (value.kind === "alias")
      return {
        ...value,
        targetId: value.targetId === newTokenId ? retiredId : value.targetId,
      };
    if (value.kind === "colorWithAlpha")
      return { ...value, color: remap(value.color), alpha: remap(value.alpha) };
    return value;
  };
  token.id = retiredId;
  for (const item of next.tokens)
    item.valuesByMode = Object.fromEntries(
      Object.entries(item.valuesByMode).map(([mode, value]) => [
        mode,
        remap(value),
      ])
    );
  for (const alias of next.cssCompatibility)
    if (alias.targetId === newTokenId) alias.targetId = retiredId;
  const names = new Set([
    tokenCssName(token),
    ...next.cssCompatibility
      .filter((alias) => alias.targetId === retiredId)
      .map((alias) => alias.name),
  ]);
  for (const name of retired.cssNames)
    if (!names.has(name)) {
      next.cssCompatibility.push({ name, targetId: retiredId });
      names.add(name);
    }
  next.tombstones = next.tombstones!.filter((item) => item.id !== retiredId);
  next.draftRevision++;
  return parseProjectDraft(JSON.stringify(next));
}

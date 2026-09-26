import { createHash, randomUUID } from "node:crypto";
import { mkdir, open, readFile, rename, unlink } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { parseProjectDraft, type TokenProject } from "./project";
import {
  mergeSnapshotCandidate,
  type ProjectMergeResult,
} from "./project-merge";
import type { SourceBinding } from "./snapshot-adapter";

export interface ProjectStoreState {
  version: 1;
  project: TokenProject;
  sources: {
    source: string;
    baseline: TokenProject;
    bindings: SourceBinding[];
  }[];
}
export interface StoredProject {
  state: ProjectStoreState;
  revision: string;
}
const digest = (text: string) =>
  createHash("sha256").update(text).digest("hex");
const missing = (error: unknown) =>
  (error as NodeJS.ErrnoException).code === "ENOENT";
async function removeIfPresent(file: string): Promise<void> {
  try {
    await unlink(file);
  } catch (error) {
    if (!missing(error)) throw error;
  }
}
function record(
  value: unknown,
  required: string[],
  optional: string[],
  path: string
): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value))
    throw new Error(`Invalid store object: ${path}`);
  const result = value as Record<string, unknown>;
  if (
    required.some((key) => !Object.hasOwn(result, key)) ||
    Object.keys(result).some(
      (key) => !required.includes(key) && !optional.includes(key)
    )
  )
    throw new Error(`Invalid store fields: ${path}`);
  return result;
}
function decode(json: string): ProjectStoreState {
  const state = record(
    JSON.parse(json),
    ["version", "project", "sources"],
    [],
    "state"
  );
  if (state.version !== 1 || !Array.isArray(state.sources))
    throw new Error("Unsupported project store format");
  const project = parseProjectDraft(JSON.stringify(state.project));
  const sources = new Set<string>();
  for (const [index, item] of state.sources.entries()) {
    const source = record(
      item,
      ["source", "baseline", "bindings"],
      [],
      `sources[${index}]`
    );
    if (
      typeof source.source !== "string" ||
      !source.source.trim() ||
      sources.has(source.source) ||
      !Array.isArray(source.bindings)
    )
      throw new Error("Invalid or duplicate source");
    sources.add(source.source);
    source.baseline = parseProjectDraft(JSON.stringify(source.baseline));
    if ((source.baseline as TokenProject).id !== project.id)
      throw new Error("Source baseline belongs to a different project");
    const activeKeys = new Set<string>();
    const activeEngineKeys = new Set<string>();
    for (const raw of source.bindings) {
      const binding = record(
        raw,
        ["source", "kind", "externalId", "engineId"],
        ["retired", "readOnly"],
        "binding"
      );
      if (
        binding.source !== source.source ||
        !["token", "mode", "collection"].includes(String(binding.kind)) ||
        typeof binding.externalId !== "string" ||
        !binding.externalId ||
        typeof binding.engineId !== "string" ||
        !binding.engineId ||
        (Object.hasOwn(binding, "retired") &&
          typeof binding.retired !== "boolean") ||
        (Object.hasOwn(binding, "readOnly") &&
          typeof binding.readOnly !== "boolean")
      )
        throw new Error("Invalid source binding");
      if (!binding.retired) {
        const key = JSON.stringify([binding.kind, binding.externalId]);
        if (activeKeys.has(key))
          throw new Error("Duplicate active source binding");
        const engineKey = JSON.stringify([binding.kind, binding.engineId]);
        if (activeEngineKeys.has(engineKey))
          throw new Error("Duplicate active Engine ID in source bindings");
        activeKeys.add(key);
        activeEngineKeys.add(engineKey);
      }
    }
  }
  return { ...state, project } as unknown as ProjectStoreState;
}

export async function readProjectStore(file: string): Promise<StoredProject> {
  const text = await readFile(resolve(file), "utf8");
  return { state: decode(text), revision: digest(text) };
}

/** Atomically commits project and baselines together. Null revision means create-only. */
export async function commitProjectStore(
  file: string,
  state: ProjectStoreState,
  expectedRevision: string | null
): Promise<StoredProject> {
  const validated = decode(JSON.stringify(state));
  const text = JSON.stringify(validated, null, 2) + "\n";
  const target = resolve(file),
    lockFile = `${target}.lock`,
    temporary = `${target}.${randomUUID()}.tmp`;
  await mkdir(dirname(target), { recursive: true });
  const lock = await open(lockFile, "wx");
  try {
    let current: string | null = null;
    try {
      current = digest(await readFile(target, "utf8"));
    } catch (error) {
      if (!missing(error)) throw error;
    }
    if (current !== expectedRevision)
      throw new Error(
        "Project store changed after preview; reload and review again"
      );
    await lock.writeFile(String(process.pid));
    const output = await open(temporary, "wx");
    try {
      await output.writeFile(text);
      await output.sync();
    } finally {
      await output.close();
    }
    await rename(temporary, target);
    return { state: validated, revision: digest(text) };
  } finally {
    try {
      await removeIfPresent(temporary);
    } finally {
      try {
        await lock.close();
      } finally {
        await removeIfPresent(lockFile);
      }
    }
  }
}

export async function mergeStoredSnapshot(
  file: string,
  expectedRevision: string,
  source: string,
  candidate: TokenProject,
  bindings: SourceBinding[],
  choices: Record<string, "local" | "incoming"> = {}
): Promise<
  | { ok: true; snapshot: StoredProject }
  | Exclude<ProjectMergeResult, { ok: true }>
> {
  // Capture the candidate before asynchronous I/O, just like the portable APIs.
  candidate = parseProjectDraft(JSON.stringify(candidate));
  bindings = JSON.parse(JSON.stringify(bindings)) as SourceBinding[];
  choices = { ...choices };
  const snapshot = await readProjectStore(file);
  if (snapshot.revision !== expectedRevision)
    throw new Error(
      "Project store changed after preview; reload and review again"
    );
  const baseline = snapshot.state.sources.find(
    (item) => item.source === source
  );
  if (!baseline)
    throw new Error(
      "Source baseline is missing; initialize from the last confirmed import"
    );
  const result = mergeSnapshotCandidate(
    baseline.baseline,
    snapshot.state.project,
    candidate,
    choices
  );
  if (!result.ok) return result;
  const state = {
    ...snapshot.state,
    project: result.project,
    sources: snapshot.state.sources.map((item) =>
      item.source === source ? { source, baseline: candidate, bindings } : item
    ),
  };
  return {
    ok: true,
    snapshot: await commitProjectStore(file, state, expectedRevision),
  };
}

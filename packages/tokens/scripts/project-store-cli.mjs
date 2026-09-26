import { readFile, writeFile } from "node:fs/promises";
import {
  readProjectStore,
  commitProjectStore,
  mergeStoredSnapshot,
} from "../dist/node.js";
import { parseProjectDraft, mergeSnapshotCandidate } from "../dist/project.js";

const [command, file, input, revision, decisionsFile] = process.argv.slice(2);
const json = async (path) => JSON.parse(await readFile(path, "utf8"));
if (!file)
  throw new Error(
    "Usage: project-store-cli.mjs init|preview|apply|export STORE INPUT [REVISION] [CHOICES_JSON]"
  );
if (command === "init") {
  if (!input || !revision)
    throw new Error("init requires STORE PROJECT_JSON CONFIRMED_BASELINE_JSON");
  const project = parseProjectDraft(await readFile(input, "utf8"));
  const baseline = await json(revision);
  const result = await commitProjectStore(
    file,
    {
      version: 1,
      project,
      sources: [
        {
          source: baseline.source,
          baseline: baseline.project,
          bindings: baseline.bindings,
        },
      ],
    },
    null
  );
  console.log(
    JSON.stringify({ revision: result.revision, tokens: project.tokens.length })
  );
} else if (command === "preview") {
  if (!input) throw new Error("preview requires STORE CANDIDATE_JSON");
  const store = await readProjectStore(file),
    candidate = await json(input);
  const source = store.state.sources.find(
    (item) => item.source === candidate.source
  );
  if (!source) throw new Error("No confirmed baseline for this source");
  const result = mergeSnapshotCandidate(
    source.baseline,
    store.state.project,
    candidate.project
  );
  console.log(JSON.stringify({ revision: store.revision, ...result }, null, 2));
} else if (command === "apply") {
  if (!input || !revision)
    throw new Error(
      "apply requires STORE CANDIDATE_JSON PREVIEW_REVISION [CHOICES_JSON]"
    );
  const candidate = await json(input),
    choices = decisionsFile ? await json(decisionsFile) : {};
  const result = await mergeStoredSnapshot(
    file,
    revision,
    candidate.source,
    candidate.project,
    candidate.bindings,
    choices
  );
  console.log(
    JSON.stringify(
      result.ok ? { ok: true, revision: result.snapshot.revision } : result,
      null,
      2
    )
  );
  if (!result.ok) process.exitCode = 1;
} else if (command === "export") {
  if (!input || !revision)
    throw new Error("export requires STORE NEW_PROJECT_JSON PREVIEW_REVISION");
  const store = await readProjectStore(file);
  if (store.revision !== revision)
    throw new Error("Store changed; review again before export");
  await writeFile(input, JSON.stringify(store.state.project, null, 2) + "\n", {
    flag: "wx",
  });
  console.log("Exported project without overwriting an existing file");
} else throw new Error(`Unknown command: ${command}`);

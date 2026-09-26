import { readFileSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { projectApi } from './project-api.mjs';

const read = (url) => JSON.parse(readFileSync(url, 'utf8'));
const delta = read(new URL('../../../docs/theme-engine/navigation-selected-figma-delta.json', import.meta.url));
const snapshotUrl = new URL('../source/themebuilder/components.variables.json', import.meta.url);
const snapshot = read(snapshotUrl);
if (snapshot.file !== delta.file) throw new Error('Source file mismatch');
for (const variable of delta.variables) {
  if (snapshot.variables.some(v => v.i === variable.id)) continue;
  if (snapshot.variables.some(v => v.n === variable.name)) throw new Error(`Name conflict: ${variable.name}`);
  snapshot.variables.push({ i: variable.id, n: variable.name, t: variable.type, c: variable.collectionId, s: variable.scopes, x: {}, v: Object.entries(variable.valuesByMode).map(([mode, value]) => [mode, ['a', value.id]]) });
}
// This is a targeted delta; do not claim the rest of the snapshot was refreshed.
writeFileSync(snapshotUrl, JSON.stringify(snapshot, null, 2) + '\n');
execFileSync(process.execPath, [fileURLToPath(new URL('./import-standard-project.mjs', import.meta.url))], { stdio: 'inherit' });
const candidate = read(new URL('../source/theme-engine/import-candidate.json', import.meta.url));
const projectUrl = new URL('../source/theme-engine/ald.project.json', import.meta.url);
const project = read(projectUrl);
let added = 0;
for (const variable of delta.variables) {
  const token = candidate.project.tokens.find(t => t.path.join('/') === variable.name);
  if (!token) throw new Error(`Missing imported token: ${variable.name}`);
  if (project.tokens.some(t => t.id === token.id)) continue;
  if (project.tokens.some(t => t.path.join('/') === variable.name)) throw new Error(`Project name conflict: ${variable.name}`);
  const { cssName, ...automaticNameToken } = token;
  project.tokens.push(automaticNameToken);
  added++;
}
if (added) project.draftRevision++;
projectApi.parseProject(JSON.stringify(project));
writeFileSync(projectUrl, JSON.stringify(project, null, 2) + '\n');
console.log(`Merged ${added} Navigation tokens, preserving existing project overrides.`);

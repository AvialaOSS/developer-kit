import { readFileSync, writeFileSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
import { parseProject } from '../dist/project.js';

const file = new URL('../source/theme-engine/ald.project.json', import.meta.url);
const project = parseProject(readFileSync(file, 'utf8'));
const before = JSON.stringify(project);
const effects = project.collections.find(c => c.axis === 'effects');
const components = project.collections.find(c => c.name === 'componentToken');
if (!effects || !components) throw new Error('Expected effects and component collections');
const literal = value => ({kind:'literal',value});
const alias = token => ({kind:'alias',targetId:token.id});
function add(path, collection, type, valuesByMode, unit) {
  let token = project.tokens.find(t => t.path.join('/') === path);
  if (!token) {
    token = {id:`token_${randomUUID()}`,collectionId:collection.id,path:path.split('/'),layer:collection===components?'component':'semantic',type,...(unit?{unit}:{}),valuesByMode};
    project.tokens.push(token);
  }
  return token;
}
function effect(path, alpha) {
  return add(path,effects,'color',Object.fromEntries(effects.modes.map(m => [m.id,literal({r:0,g:0,b:0,a:m.name==='ON'?alpha:0})])));
}
const menu = effect('shadow/menu',0.06);
const pointer = effect('shadow/switch-pointer',0.06);
const segmentator = effect('shadow/segmentator-nested',0.06);
add('segmentatorButton/color/nested/selected/shadow',components,'color',Object.fromEntries(components.modes.map(m=>[m.id,alias(segmentator)])));
for (const [name,value] of Object.entries({'offset-x':0,'offset-y':4,blur:16,spread:0})) {
  add(`segmentatorButton/size/nested/selected/shadow/${name}`,components,'number',Object.fromEntries(components.modes.map(m=>[m.id,literal(value)])),'px');
}
for (const [index, alpha] of [[1,0.07999999821186066],[2,0.18000000715255737]]) {
  const source = effect(`shadow/slider-${index}`,alpha);
  const target = project.tokens.find(t=>t.path.join('/')===`slider/color/thumb-shadow-${index}`);
  if (!target) throw new Error('Missing Slider shadow');
  target.valuesByMode = Object.fromEntries(components.modes.map(m=>[m.id,alias(source)]));
}
for (const [prefix, source, geometry] of [
  ['selectMenu', menu, { 'offset-x':0,'offset-y':5,radius:20,spread:0 }],
  ['switch', pointer, { 'offset-x':0,'offset-y':1,radius:2,spread:1 }],
]) {
  const part = prefix==='switch'?'pointer-shadow':'shadow';
  add(`${prefix}/color/${part}-default`,components,'color',Object.fromEntries(components.modes.map(m=>[m.id,alias(source)])));
  for(const [name,value] of Object.entries(geometry)) add(`${prefix}/size/${part}/${name}`,components,'number',Object.fromEntries(components.modes.map(m=>[m.id,literal(value)])),'px');
}
if(JSON.stringify(project)!==before) {
  project.draftRevision++;
  parseProject(JSON.stringify(project));
  writeFileSync(file,JSON.stringify(project,null,2)+'\n');
}
console.log(`Component effects project revision ${project.draftRevision}`);

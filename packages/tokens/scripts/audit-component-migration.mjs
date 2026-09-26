import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve, relative } from 'node:path';
import { tokenCssName } from '../dist/project.js';

const root = fileURLToPath(new URL('../../../', import.meta.url));
const project = JSON.parse(readFileSync(resolve(root, 'packages/tokens/source/theme-engine/ald.project.json'), 'utf8'));
const walk = (dir) => readdirSync(dir, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(resolve(dir, e.name)) : [resolve(dir, e.name)]);
const paths = [...walk(resolve(root, 'packages/ui/src')), ...walk(resolve(root, 'packages/tokens/src/semantic'))]
  .filter(p => /\.(tsx?|css)$/.test(p) && !/\.stories\.|\.test\./.test(p));
const sources = paths.map(path => ({path: relative(root, path).replaceAll('\\', '/'), text: readFileSync(path, 'utf8')}));
// These are unresolved surface gaps, not waivers or proof of migration completion.
// Stop emitting the note once a production consumer exists so stale decisions are visible.
const pendingSurfaces = new Map([
  ['cardItemHead/color/heading-default', 'CardHead renders textCaption; the recorded Figma title binding is text-default. No separate heading typography surface is implemented.'],
  ['cardItemBottom/color/heading-default', 'CardBottom renders textCaption; the recorded Figma title binding is text-default. No separate heading typography surface is implemented.'],
  ['buttonGroup/color/placeholder/text-default', 'The internal Card button group renders action slots without placeholder text; a standalone ButtonGroup API is not implemented.'],
]);
const groups = new Map();
for (const token of project.tokens.filter(t => t.layer === 'component')) {
  const group = token.path[0];
  const rows = groups.get(group) ?? [];
  const cssName = tokenCssName(token);
  const reference = new RegExp(`var\\(\\s*${cssName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[\\s,)]`);
  const path = token.path.join('/');
  const consumers = sources.filter(s => reference.test(s.text)).map(s => s.path);
  const reason = consumers.length === 0 ? pendingSurfaces.get(path) : undefined;
  const unusedTableGap = consumers.length === 0 && path === 'table/size/gap';
  rows.push({id: token.id, path, cssName, consumers, ...(unusedTableGap ? {review: {status: 'intentionally-unused', reason: 'User confirmed continuous tables with zero row/column gaps on 2026-09-24; retain this token without a Web consumer.', evidence: 'docs/theme-engine/TABLE_MIGRATION.md'}} : reason ? {review: {status: 'surface-not-implemented', reason, evidence: 'docs/theme-engine/CARD_MIGRATION.md'}} : {})});
  groups.set(group, rows);
}
// Explicitly reviewed absence, not inferred from zero textual references.
// A new consumer invalidates this classification automatically.
const unimplementedGroups = new Map([
]);
// User-confirmed design-only helpers stay in the project for Figma consumers.
const designOnlyGroups = new Set(['layoutHelper', 'layoutHelperGroup']);
const entries = [...groups].sort(([a], [b]) => a.localeCompare(b)).map(([group,tokens]) => {
  const directlyReferenced = tokens.filter(t=>t.consumers.length).length;
  const absence = directlyReferenced === 0 ? unimplementedGroups.get(group) : undefined;
  const designOnly = directlyReferenced === 0 && designOnlyGroups.has(group);
  return {group,count:tokens.length,directlyReferenced,status:designOnly?'web-not-applicable':absence?'not-implemented':'needs-review',...(designOnly?{reason:'User confirmed design-only placeholder helpers on 2026-09-24.',evidence:'docs/theme-engine/LAYOUT_HELPER_MIGRATION.md'}:absence?{reason:absence}:{}),tokens};
});
const uiPackage = JSON.parse(readFileSync(resolve(root, 'packages/ui/package.json'), 'utf8'));
const publicEntryPoints = Object.entries(uiPackage.exports)
  .filter(([, value]) => typeof value === 'object' && typeof value.development === 'string' && /\.tsx?$/.test(value.development))
  .map(([subpath, value]) => ({subpath, source: value.development, components: [...new Set([...readFileSync(resolve(root, 'packages/ui', value.development), 'utf8').matchAll(/from\s+"(\.\/components\/[^"\n]+)"/g)].map(m => m[1]))].sort()}));
const publicSources = [...new Set(publicEntryPoints.flatMap(entry => entry.components))].sort();
const report = {projectId:project.id,draftRevision:project.draftRevision,note:'Direct textual references only; zero is a review candidate, nonzero does not prove complete migration. Dynamic names, shared primitives and indirect references require manual review.',publicEntryPoints,publicSources,entries};
writeFileSync(resolve(root,'docs/theme-engine/component-migration.json'),JSON.stringify(report,null,2)+'\n');
const lines=['# 全组件 Token 迁移盘点','','用户已将全组件迁移纳入 Goal。此表只统计生产源码中组件 Token 的直接引用，不能当成迁移完成率。动态变量名、共享部件和间接引用需逐项检查。','','验收还需记录：公共组件对应的 Figma 部件、变体与状态、三轴模式、新旧覆盖入口、字体指标与算法常量例外、实际渲染证据。没有组件 Token 的公共组件也必须调查，不得漏项。','',`公共组件来源模块：${publicSources.length}；组件 Token 分组：${entries.length}；组件 Token：${entries.reduce((n,e)=>n+e.count,0)}。`,'','| Figma Token 分组 | Token 数 | 直接引用数 | 当前判定 |','| --- | ---: | ---: | --- |',...entries.map(e=>`| ${e.group} | ${e.count} | ${e.directlyReferenced} | ${e.status === 'web-not-applicable' ? 'Web 不适用：已确认设计占位工具' : e.status === 'not-implemented' ? 'Figma 已有；Spiral 未实现' : '待逐属性验收'} |`),'','## 公共组件来源模块','',...publicSources.map(s=>`- \`${s}\``),'','复跑：先构建 tokens，再运行 `node packages/tokens/scripts/audit-component-migration.mjs`。',''];
// Subpath components are part of the full migration scope, not optional extras.
const entryLines = ['\n## 公共入口覆盖\n', ...publicEntryPoints.map(entry => `- \`${entry.subpath}\` → \`${entry.source}\`：${entry.components.length} 个直接导出的组件来源模块。`), '\n此清单由 package.json 的 development 入口推导，包含 /form；间接再导出与内部视觉部件仍需人工核对。\n'];
const surfaceLines = ['\n## 已定位、仍待处理的呈现缺项\n', ...entries.flatMap(entry => entry.tokens.filter(token => token.review?.status === 'surface-not-implemented').map(token => `- \`${token.path}\`：${token.review.reason} 证据：[Card 迁移记录](./CARD_MIGRATION.md)。`)), '\n这些项目仍计入待验收范围；不自动用相近名称替换现有绑定，也不按直接引用率判定完成。\n'];
writeFileSync(resolve(root,'docs/theme-engine/COMPONENT_MIGRATION.md'),lines.join('\n') + entryLines.join('\n') + surfaceLines.join('\n') + '\n## 已确认当前不使用的 Token\n\n' + entries.flatMap(entry => entry.tokens.filter(token => token.review?.status === 'intentionally-unused').map(token => '- `' + token.path + '`：' + token.review.reason + ' 参见 [Table 迁移记录](./TABLE_MIGRATION.md)。')).join('\n') + '\n');
console.log(JSON.stringify({publicModules:publicSources.length,groups:entries.length,tokens:entries.reduce((n,e)=>n+e.count,0),directlyReferenced:entries.reduce((n,e)=>n+e.directlyReferenced,0)}));

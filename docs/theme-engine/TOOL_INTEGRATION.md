# 工具接入现状（2026-09-21）

## 网页接入首批

同批删除重建补充：合并因缺失引用失败时，核心可返回明确标注为 repairDraft 的只读修复候选，ok 仍为 false。ThemeBuilder 在其中识别同名墓碑供用户选择接替；应用前严格校验完整引用链，失败不写草稿/基线。未解决的三方冲突及其他无效结构不提供修复候选。7 项导入测试、14 项核心项目/主题测试和类型检查通过。

最新状态：ThemeBuilder 同名重建身份选择已接入，明确选择保留新身份或接替兼容的旧身份；接替更新引用、来源映射和基线，旧来源记录退役。导入与版本相关 11 项测试通过，类型检查通过。以下“身份接替未接入”为历史记录。

ThemeCat 尚无本地独立工程，升级界面仍待接入。核心 upgradeTheme 已拒绝未使用的 Token/Mode 替换、目标集合不含替换模式、未知或重复的删除覆盖选择；检查只针对保留的覆盖项，失败保持原主题完整。标准项目/主题 14 项定向测试及 tokens JS/类型构建通过；不代表 ThemeCat 产品界面或浏览器验收完成。

破坏性升级迁移清单现已接入本地版本面板：对比最高历史版本，列出 CSS 名删除/改绑的前后路径；逐项确认并提升主版本号后由同一核心发布校验器放行。不自动移除兼容别名；草稿变化清除确认，过期/未知确认拒绝。版本域与界面共 5 项测试通过，类型检查通过。以下“迁移清单未接入”为此前记录。

本地版本入口已接入：使用标准草稿和 Engine createProjectRelease 生成 SHA-256 内容快照，逐个回验既有版本，重复版本/不完整值/未确认破坏性变更阻止生成。保存先由 ThemeBuilder 同步本地存储事务完成，失败不下载；撤销编辑保留版本历史。新增 4 项版本相关测试通过，连同草稿测试共 9 项。远端发布、破坏性迁移清单、ThemeCat 跟进与独立主题界面仍未实现；本段替代下方“版本界面未接入”的历史状态。

最新补齐标准草稿接受：差异列表按 50 项分页；复用 mergeSnapshotCandidate 做三方合并，逐项冲突选择和校验错误会阻止保存。标准草稿、来源基线、bindings 在同一编辑事务持久化；改名保留旧 CSS 名。5 项定向测试覆盖 UI 接受、项目重开、改名兼容及冲突不推进基线，类型检查通过。后续发布与身份接替仍未接入；本段替代下方“草稿接受未实现”的历史状态。

ThemeBuilder 已通过本地 file 依赖接入 tokens 包，顶部新增“标准项目”配置与候选预览面板。使用现有 shadcn/ui New York 组件，支持逐集合显式选择 axis/layer/CSS 名策略、搜索数值变量、批量配置筛选内未设置的单位、单项单位和 rem 基准。检查通过后才允许保存配置并下载候选；配置和 bindings 保存到编辑器项目的 engineImport 字段，项目 JSON 导入时校验，模板/词表和 Figma 基线继续保留。

这是候选入口，尚未实现标准草稿接受合并、兼容名迁移、发布版本和冲突处理界面，不能直接用候选替换已发布基础项目。3 项网页/域测试覆盖配置保存、项目 JSON 重开与改名保持身份、预览期间项目变化后禁用保存；类型检查通过。浏览器标签页仍挂载超时，未作实际视觉验收。

以下“尚未依赖/尚未调用”段落为接入前调查记录，以上述最新状态为准。

## 编辑器快照入口

`@aviala-design/tokens/project` 新增 `importThemeBuilderSnapshot(snapshot, options)`，接受编辑器的 collections/variables/values，转换后复用 importVariableSnapshot。默认要求显式数值单位，保留 alias 和组合透明度引用，并携带 external/remote 只读限制。工具元数据（模板、词表等）仍由宿主持有，转换不会将其混进标准项目。

options.source 必须使用独立编辑器项目命名空间，例如 `themebuilder:<projectId>`；rules/numericUnits 的键是编辑器对象 ID。快照内 source/sourceId 是 Figma 元数据，此入口不拿它们冒充编辑器身份。原 Figma 来源映射需由宿主另行保留；这个入口不等于跨端身份合并或完整无损往返已完成。

已验证编辑器改名后 ID 不变、组合透明度仍是引用、只读标志保留、缺失依赖和未配置单位被拒绝。14 项适配测试和类型检查通过；ThemeBuilder 产品 UI 尚未调用此入口。

## 本地项目转换

构建 tokens 后，可在仓库根目录执行：

```sh
node packages/tokens/scripts/import-themebuilder-project.mjs EDITOR_PROJECT.json CONFIG.json NEW_CANDIDATE.json
```

CONFIG 包含稳定的标准 projectId、`source: "themebuilder:<编辑器项目 ID>"`、按编辑器 Collection ID 配置的 rules、按变量 ID 配置的 numericUnits，以及可选 remPixels。再次转换必须将上次候选的 bindings 存回 CONFIG，保留身份；此命令只创建新候选文件，拒绝覆盖输出，不发布版本。

输出的 project/bindings 是标准候选；editorProject 原样保留完整编辑器文件，包括模板、词表和 Figma 基线。当前 Node ProjectStore 仅保存标准草稿及来源基线，不会保存这份 editorProject 附属数据；宿主接入时必须另行持久化，不能丢弃候选后假设编辑器数据已迁移。命令不修改原编辑器文件，未接入浏览器本地存储。

真实子进程测试覆盖转换、附属信息保留、重复输出拒绝、改名复用 ID、来源错误及缺失单位不生成输出；构建和该集成测试通过。

核对本地 themebuilder/package.json 与 src/domain/model.ts：ThemeBuilder 尚未依赖 @aviala-design/tokens，Project 仍保存自己的 variables、templates、vocabularies、baseline。核心 API 已存在不代表编辑器已经以标准项目为权威来源。

下一阶段接入必须保留以下边界：

- Engine 的 Collection axis、Token layer、单位与稳定 ID 必须持久化；现有编辑器没有这些字段，不能靠每次导出时猜名称恢复。
- 编辑器项目的模板、词表、显示名称属于工具元数据，不塞入标准 TokenProject。
- 编辑器 alias.target 转为 Engine alias.targetId 时必须使用保存的来源映射；不能用名称重新认领身份。
- 组合透明度目前为 0–100，标准项目为 0–1；TIMING 编辑值为秒，标准 duration 为毫秒，转换复用既有适配器。
- 编辑器支持命名缓动和弹簧，当前标准输出支持自定义 cubicBezier；不能丢弃不支持的值后仍提示导入或发布成功。
- 先将编辑器操作同步到标准草稿，再提供严格校验与本地版本发布。产品界面、持久化和往返验收仍待实现，当前没有改动用户的 ThemeBuilder 项目。

来源身份存储在本轮补齐一个前置缺口：同一来源不能将两个活动外部对象映射到同一 Engine ID；已退役映射仍可用于显式身份接替。相关存储集成测试通过。

## 数值配置入口

删除流程保留已知来源 ID 的单位历史：规则指向当前快照中已删除、但 bindings 中曾存在的 Token 时，不阻止新候选生成。未知 ID 拼写错误仍拒绝；同名重建且 ID 不同仍需显式配置单位，并分配新的 Engine 身份。已有删除/重建回归覆盖该边界，不能以同名自动认领旧规则。

Collection 规则已从脚本内的名称匹配改为 `source/theme-engine/import-collections.json` 的 7 个来源 ID 配置，持久化 axis、layer、CSS 命名策略。改名保持原映射；新建同名 Collection 不会自动认领旧规则，缺少配置时拒绝导入。回归测试将所有集合改名，核对 Token、身份、模式轴和八模式 CSS 不变，并验证未知同名集合被拒绝。

仓库 `import-standard-project.mjs` 已启用严格模式。`source/theme-engine/import-units.json` 以真实来源 ID 固化当前标准项目的 1178 个数值单位；这是对现有基线的持久化，不代表逐个重新确认设计语义。新增数值字面量必须添加明确规则，纯别名可沿目标继承。完整导入得到 1974 Token / 1992 来源映射；没有改写 ald.project.json 草稿。严格配置与旧基线的八模式输出及来源 ID 一致性有专门回归测试。

`importVariableSnapshot` 新增 `numericUnits`（以来源变量 ID 为键）、`requireExplicitNumericUnits` 和 `remPixels`。工具接入应持久化单位选择，并开启严格模式；纯引用数值继承被引用变量单位，跨模式或显式声明冲突拒绝导入。px 转 rem 需要明确像素基准，导出使用同一 remPixels 可恢复原值，引用保持为引用。ratio 仍按 Figma 的 0–100 输入转换，scalar 不缩放。旧调用未开启严格模式时暂时保留已有推断，因此不能声称旧入口已停止猜测单位。

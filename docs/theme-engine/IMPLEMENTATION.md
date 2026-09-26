# Theme Engine 实施状态

## 已实现并验证

- `packages/tokens/src/engine/project.ts`：内部标准项目类型、稳定身份与可读 CSS 命名、声明单位、Collection 独立模式解析、显式默认继承、颜色附加透明度解析。
- 校验覆盖重复身份/路径/CSS 名、模式缺失、引用缺失、引用类型与单位不匹配、字面值范围和跨模式循环。
- `packages/tokens/scripts/project.test.mjs`：8 个行为测试，纳入 tokens 的 test 命令；Node 测试通过 TypeScript 转译执行，不依赖 Node 24 的类型擦除。
- tokens 类型检查通过。标准模型已通过独立 project 入口导出，尚未接入现有 ThemeProvider。
- `snapshot-adapter.ts` 将完整的 1964 个快照变量转换为标准项目，Collection 角色通过来源 ID 配置；外部 ID 映射可序列化，重复导入与改名复用 Engine ID。返回的是待合并候选，不直接覆盖草稿。
- 已识别快照 literal 中内嵌的 Figma 颜色引用与 opacity，转换为保留引用的 colorWithAlpha。完整图测试覆盖效果 OFF、移动密度与暗色。
- 删除后同名新对象不会自动接替旧 ID。用户选择接替的交互及三方合并尚未实现；导入脚本已持久化来源映射。

## 2026-09-21 输出层与持久映射进度

- 新增 `@aviala-design/tokens/project` 入口，包含标准模型、校验、快照适配与 CSS 输出，核心不依赖 DOM/Figma。
- `projectCssVariables` 与 `projectCssText` 共用声明生成逻辑；保留 alias 与 colorWithAlpha，不展开组件引用。8 种模式组合都生成 1964 个完整变量定义，没有缺失 CSS 引用或非法数字。
- 字体 px → rem 通过显式 Token ID 配置；单位转换不改变标准项目源值。duration 的标准输出单位为 ms。
- 运行 `pnpm --filter @aviala-design/tokens build` 后，再运行 `node packages/tokens/scripts/import-standard-project.mjs` 创建标准导入候选。候选位于 `source/theme-engine/import-candidate.json`，与 1982 条 Collection/Mode/Token 来源映射一起原子写入；连续导入两次文件字节一致。
- 候选文件不是已发布标准项目，也不是用户草稿。后续合并/发布流程必须消费此候选，不能将它直接当作可随意覆盖的权威项目。
- `parseProject` 为 JSON 提供结构与语义两层校验，拒绝未知字段、非法版本和不完整结构，并报告字段位置。
- 主入口新增 `applyProjectTheme` / `removeProjectTheme`，与静态 CSS 使用同一个声明生成器；仅管理目标上的自有属性，撤销恢复原值和优先级，并保留随后由用户修改的值。当前通过模拟 style 对象验证，浏览器验证尚未完成。
- tokens 共 19 个测试通过，类型检查、构建与新增文件 lint 通过。发布预览确认包含 project JS/类型入口及 CSS 生成器依赖。当前网页仍使用旧入口，浏览器端到端验收尚未完成。
- 用户已确认旧 control 语义独立保留，不全局映射到新 colorSystem；新迁移组件严格消费标准项目接入的 Figma Token。兼容层的实际拆分仍待完成。

## 2026-09-21 ThemeProvider 接入与浏览器进度

- ThemeProvider 新增 project / projectCssOptions / projectTarget；useTheme 提供独立 effects 开关。项目主题直接使用标准 CSS 输出与可恢复作用域应用，默认旧主题入口暂未替换。
- 新增 ScrollPicker Project / Independent Modes 故事，使用真实 1964 Token 导入候选作为只读验证夹具。
- 在 Storybook 浏览器中完成亮暗、默认/移动密度、效果开关组合操作。局部暗色背景实际为 rgb(37,37,37)，亮色为白色；外层保持 light。size-small 随密度由 0.75rem 变为 1rem，line-shadow-all 在 OFF 时解析为透明。
- 浏览器发现并修复 Typography 继承外层已解析值的问题：在 data-theme 容器重新声明共享别名。移动密度下 ScrollPicker 实际字号由错误的 14px 恢复为 18px，与 size-regular 1.125rem 一致。重复手写字重定义已移除。
- 初次新增故事遇到 Storybook importer 缓存错误，重启后正常；日志中的旧错误不能算新一轮错误。完整静态/动态对照、卸载恢复浏览器验收、默认静态生成器替换及动态主色映射仍未完成。

## 2026-09-21 静态输出统一

- `source/theme-engine/ald.project.json` 是仓库标准项目初始稿，由已对齐候选初始化，含 1964 Token 和 20 项公开 CSS 别名。此文件尚未代表已发布版本；再次导入不覆盖它。初始化脚本遇到已有文件会拒绝覆盖。
- styles.css、ald-theme.css、component-tokens.css 均通过标准项目的 projectCssText 生成；旧 themebuilder-css 仅保留给历史审计与快照测试，不再用于生产 CSS 输出。
- 每个作用域输出完整依赖，包含 specialEffort / control，按亮暗、密度、效果输出 8 个组合。当前优先确保作用域正确，CSS 体积优化尚未进行。
- 生产静态块与运行时声明逐项相等，所有 CSS 引用闭合，21 项测试通过；新增脚本 lint 通过，CSS 构建通过。
- 开发仓库直接转译同一核心源码，发布包读取已构建核心，避免维护另一套解析器。发布清单补全生成器依赖、语义 CSS 和非色彩 CSS，Vite 插件支持发布包的 dist 入口。
- 本轮静态路径替换后的浏览器复验与真实打包安装验收尚未完成。Node loadAldTheme 与默认动态 generateTheme 仍需接入标准项目。

## 2026-09-21 默认 Node 与动态入口

- `ald-project.ts` 将仓库标准项目接入 Node loadAldTheme 和默认 generateTheme；原有旧语义输出独立保留，标准项目拥有的名称以标准输出为准。
- 动态调色仅用生成的色盘替换 foundation 颜色字面值，再运行 projectCssVariables。语义/组件 alias 与附加透明度表达不展开、不重新手写映射。
- generateTheme 新增 density、effects；ThemeProvider 将设置传入默认动态入口，并在静态模式设置效果属性。
- 已构建产物的两项集成测试通过：Node 的 8 种组合与标准项目逐值相等；动态主色改变基础色盘，所有引用保持一致，依赖完整、无非法数值。可用 tokens 的 test:integration 重建后复验。
- 完整项目暂时随主入口打包，当前 index.js / node.js 约 1.08 MB（未压缩）。加载体积优化与本轮改动后的浏览器复验尚未完成，不能以集成测试代替端到端验收。

## 2026-09-21 静态压缩、安装包与默认入口浏览器验证

- 静态输出把各模式相同的声明提到当前主题作用域，差异声明仍按 8 组合输出；没有把引用移到祖先。ald-theme.css 从 1,090,011 字节降为 190,458 字节；静态/运行时逐值测试继续通过。
- 实际 npm pack 并安装到隔离消费目录，验证主入口、Node、project、Vite CSS 生成与各入口路径。初次浏览器重启发现 Storybook CJS 配置不支持依赖中的顶层 await，已改为 Vite 异步钩子中加载生成器；重启通过。
- 新增 Default Entry 故事。其本地主题控件关闭 Storybook 工具栏的反向重置，验证静态 ALD → 动态蓝色 → 暗色/移动密度/效果 OFF → 静态 ALD。实际背景暗色为 rgb(37,37,37)，字号 18px，line-shadow-all 透明；动态主色使选中态 Token 变蓝，返回静态后恢复设计色。
- 浏览器截图显示控件可见并响应。这里证明的是这组默认入口切换，不代表全部旧名覆盖、撤销恢复、版本/发布/升级流程已经完成。

## 2026-09-21 清理与旧拼写兼容

- 默认 applyTheme/removeTheme 与标准项目入口共用属性所有权追踪。切换时移除已不使用的自有键；清理恢复原值及 important，保留无关属性和用户后续修改。无 DOM 时 removeTheme 安全返回。
- 标准项目加入 6 个确认的同身份旧拼写别名（padding-littlesmall、blackonly/whiteonly、3 个 lineshadow 名），共 26 项 CSS 兼容别名。迁移脚本仅添加明确映射，拒绝冲突，重复执行文件字节不变。
- 旧 control 语义仍独立保留。这些 CSS 别名保证旧消费者读取新 Token；不把旧名覆盖自动解释为新 ID 覆盖。ScrollPicker 保留专属旧覆盖入口，尚需完成浏览器覆盖优先级验收。
- 单元测试 21 项通过；新增默认清理集成测试已通过。后续须完成清理的浏览器验证、稳定身份/版本/覆盖模型及最终全量要求核对。

## 2026-09-21 发布与覆盖核心

- project-theme.ts 新增不可变本地发布快照、SHA-256 内容验证、精确基础版本绑定的差异覆盖、冲突先行升级和完整图脱离。宿主注入 SHA-256 函数，核心不引入 Node/DOM/Figma 依赖。
- 发布 API 要求宿主传入已存在发布记录，用于版本唯一性与 CSS 兼容检查；持久存储端仍需保证并发唯一性。移除/重新绑定旧 CSS 名需要主版本变化及明确迁移名单。当前只生成内存快照，不写入远端。
- 升级只有在所有覆盖重新验证通过后返回新主题；失败返回冲突，原主题和发布快照不变。用户可显式替换 Token / Mode 或移除特定覆盖；不会根据相同名称猜测替代者。
- 5 项行为测试通过。发布/覆盖 JSON 边界、墓碑和同名接替、三方来源合并及宿主工具交互仍未完成；不得将此模块视为完整发布系统。

## 2026-09-21 发布与主题 JSON 边界

- parseProjectRelease / parseThemeOverlay 校验文件结构、未知字段、版本与内容摘要；覆盖值通过标准项目的完整类型/引用校验。
- 验证、合成和升级在异步摘要计算前复制输入，避免调用者随后修改草稿/覆盖影响正在进行的操作。缺失覆盖目标和模式集中返回。
- 此模块的 7 项行为测试通过，包括未知字段、错误值类型、精确版本和异步输入变更。
- 这些 API 仍未接入 ThemeBuilder/ThemeCat 持久化界面。删除墓碑、同名接替与来源三方合并继续待做。

## 2026-09-21 删除身份与显式接替

- 标准项目支持可选 tombstones，保存被删除 Token 的身份、路径、类型、单位、CSS 名与草稿删除修订号。旧项目文件仍可读取。
- deleteProjectToken 保留未解决引用；parseProjectDraft 可保存这种草稿，严格 parseProject、发布和输出仍拒绝缺失引用。
- findRetiredTokenCandidates 只提供同 Collection/路径候选；adoptRetiredTokenIdentity 需宿主先取得用户明确选择，校验类型/单位后恢复旧 ID，重定向新 ID 引用并保留历史 CSS 名。
- 9 项版本/编辑行为测试通过。同名新对象不自动认领；明确接替可恢复旧引用；错误单位或墓碑信息会拒绝。
- 接替后的外部来源映射更新与三方导入尚未接入。草稿可含未解决引用，不等于可以发布或同步。

## 2026-09-21 三方合并与来源身份接替

- mergeProjects 按 Collection/Mode/Token 稳定身份合并基线、本地、新版本；不同字段可组合，同字段冲突返回稳定路径键和三方值，只有明确选择才解决。校验失败不返回可提交项目。
- mergeSnapshotCandidate 保留 Engine 自有 CSS 兼容与墓碑元数据，Figma 候选不能删除这些字段。改名补旧 CSS 别名，来源删除补墓碑；依赖缺失仍阻止合并成功。
- adoptTokenSourceBinding 在明确身份接替后归档旧来源映射、将新对象绑定旧 Engine ID。重复导入保持接替结果；旧外部对象再次出现也不能夺回已接替的身份。
- 全套单元测试 34 项通过。当前是可调用核心 API，原导入脚本仍仅生成候选，尚未建立“确认合并后保存基线”的持久化入口，也未改写 ThemeBuilder 界面。

## 2026-09-21 本地合并持久化

- Node 入口新增工作区存储，把草稿、来源基线及映射作为单文件事务提交；预览 revision 不匹配时拒绝，冲突不写入，排他锁阻止并发覆盖。
- 本地 CLI 支持 init / preview / apply / export，使用方法见 LOCAL_WORKFLOW.md。真实 1964 Token、26 别名数据已完成初始化、预览和提交，测试工作区位于 `.design-qa/theme-engine.workspace.json`，未替换仓库构建输入。
- 3 项文件系统集成测试覆盖创建限制、并发/过期提交、冲突不写入、基线与草稿一起更新和非法元数据保护。进程崩溃残留锁不会自动抢占。
- 尚未改造 ThemeBuilder UI，也未执行 Figma 回写或远端发布。下一步对原目标逐项审计并补足浏览器覆盖与适配边界证据。

## 剩余要求

- 标准项目版本、覆盖、删除墓碑、显式同名接替和三方合并核心已实现；本地合并支持原子持久化，尚未接入 ThemeBuilder/ThemeCat 产品界面。
- TIMING 和自定义贝塞尔 EASING 已接入；其他命名缓动与弹簧表达仍需扩展模型，当前明确拒绝，不能宣称完整 EASING 类型覆盖。
- 静态构建与 ThemeProvider 已共用标准输出；已验证局部模式和默认动态切换，ScrollPicker 背景新旧覆盖优先级及浏览器清理也已验证（见下表）。其他属性的覆盖仍需结合组件消费规则检查。
- Figma 逐变量预检和标准化回读比较已实现；实际写入计划执行、同步助手处理和真实来源回执仍未接入。
- 最新代码安装包已通过独立安装验证；ScrollPicker 验收记录仍需最终逐要求汇总。

## 2026-09-21 对齐报告复核

- 对齐审计改用当前生产标准生成器，并按来源映射记录 Engine ID；不再用历史快照生成器判断缺失。
- 当前 1964 个 Token、26 个 CSS 兼容别名，生成引用缺失为 0；完整闭合不依赖手写兼容层。
- 已确认旧 control 语义独立保留，新迁移组件消费 Figma Token，旧消费者逐组件验收后再退役。对齐报告同步移除这一项的“待确认”状态。
- 上文各日期段为当时进度记录；本节“剩余要求”反映当前状态。

Goal 保持 active。首批内部单元测试不能证明完整迁移完成；后续必须逐项验收原目标。

## ScrollPicker 覆盖与局部主题恢复验收

Storybook `Information Collect/ScrollPicker Project/Override Ownership` 提供可重复的四种消费场景。2026-09-21 通过浏览器实际计算样式核对：

| 场景 | 应用局部标准主题前 | 应用后 | 移除后 |
| --- | --- | --- | --- |
| 仅容器原有背景 Token | rgb(70,80,90) | rgb(255,255,255) | rgb(70,80,90) |
| 组件新 Token 覆盖 | rgb(10,20,30) | 相同 | 相同 |
| 组件旧入口覆盖 | rgb(40,50,60) | 相同 | 相同 |
| 新旧同时覆盖 | 旧入口 rgb(40,50,60) | 相同 | 相同 |

无关 `--consumer-owned` 在三个阶段均保持 `preserved`。新旧同时存在时旧入口优先符合迁移期消费约定，不创建互相引用。验证场景补齐受控 value/onChange 后重载复验，控制台没有新增错误（旧场景缺失回调产生的历史日志仍留在工具记录中）。UI 类型检查通过。

## Figma 值预检

`planFigmaValues` 从完整标准项目生成逐 Token/Mode 预检项，包含 Collection/变量路径/模式名称、原始 expected 表达、处置类型和手动说明。附加透明度交给助手尝试等价处理；未验证的 Timing/Easing 编码、rem 转换明确阻止写入。普通值的 write 仅代表交给写入端处理，不代表已同步。

此 API 不连接 Figma、不执行写入、不产生成功回执；仍需宿主执行结构创建、引用写入和回读核对。两个测试验证真实项目逐项覆盖、不展开引用、不修改输入、诊断定位、拒绝缺失依赖及未验证转换。标准项目和 Web 输出不受这些 Figma 预检限制。

`verifyFigmaReadback` 比较宿主保存的提交快照与按 Engine ID 映射的回读项目。逐项核对路径、Collection、Mode、默认模式、轴、类型、单位和表达结构，保留引用身份；颜色/数值相同但引用被展开仍是差异。另核对完整 Collection/Mode 结构和 Token ID 集合，避免空集合或残留对象被忽略。显式继承默认模式可与默认表达相等价，但不会展开跨 Token 引用。

比较器不证明数据实际来自 Figma；宿主必须执行新鲜读取、记录来源及时间，并使用原提交快照，而不是新草稿。当前没有伪造在线成功回执。三项适配预检/回读测试及类型检查通过。

来源映射现保留 `readOnly` 能力信息：快照 remote / isExtension 集合及其变量不能被当作可编辑对象；该字段仅位于 SourceBinding，不进入标准 Token。重复导入缺少元数据时不会自动解除已有只读限制。工作区存储支持并校验此字段。回写预检传入 sourceContext 后，按目标文件的有效映射禁止外部对象写入。

实际导入候选已重新生成，仍为 1964 Token、1982 来源映射，并加入来源只读信息；未替换标准构建项目。宿主必须传入目标文件映射；无 sourceContext 的预检仅能判断值编码，不能作为写入权限检查。适配测试与六项构建后集成测试通过。

## ThemeBuilder 回写格式桥接

`exportThemeBuilderSnapshot` 输出现有 ThemeBuilder Snapshot，`createThemeBuilderChangePackage` 输出插件识别的 `themebuilder-figma-changes` 包。基线要求完整来源映射；模式来源核对所属 Collection；内部引用继续用 Engine ID，外部身份保存在 source/sourceId。ratio 和附加透明度字面量由 0–1 转为 0–100，引用不展开；rem 必须显式配置，未知 Timing/Easing 编码和嵌套颜色组合拒绝导出。

已使用本机 ThemeBuilder 实际 `readSnapshot` 与 `planWriteback` 验证完整 1964 Token：未修改项目 0 动作；修改 size-small 单一模式值，只产生一个指向原身份的 set-value 动作。验证脚本 `.design-qa/test-builder-export.mjs` 没有连接或修改 Figma。四项导出/诊断/回读测试通过，构建通过。

这完成了格式桥接，但尚未把生成包交给真实插件执行、处理受限项并取回新鲜回读。该部分仍不能标记为在线同步完成。

## 路径改名与固定 CSS 名

新增 `renameProjectToken`：保留 Token ID 和引用，默认随路径生成新名并保存旧别名；已有显式 cssName 保持固定，传入 `{cssName:null}` 才解除固定。恢复历史名称会移除同身份冗余别名，名称冲突在提交前拒绝，无变化不递增修订号。

导入器不再为 path 规则强行填写 cssName；leaf/palette 规则继续显式指定公开名。初始项目中与原导入、默认路径三者一致的 1845 个固定名已转为自动名称；迁移前后全部 8 个模式组合的 CSS 声明逐键相同，重复迁移为 0 项。脚本为 `scripts/migrate-auto-css-names.mjs`。改名与适配共 22 项测试、类型检查通过。

## TestVar 真实读取与 EASING 格式

通过 Figma 连接器只读访问测试文件 `oAsn0aY30N0WdlmVBemYdv`，发现 ThemeBuilder QA 集合（Day）及 color/string/boolean/timing/easing/number-alias 六个变量；没有修改文件。`qa/easing` 为 `CUSTOM_CUBIC_BEZIER`，曲线字段为 `easingFunctionCubicBezier: {x1:0.41999998688697815,y1:0,x2:0.5799999833106995,y2:1}`。

适配器现支持该格式与核心 cubicBezier 四元组互转，完整保留读到的精度；命名曲线和弹簧仍明确拒绝，不能悄悄近似为贝塞尔。TIMING 读到 0，不能由此证明单位，暂不映射。14 项适配测试和类型检查通过。这是实际读取加格式往返验证，尚不是插件写入验收。

随后通过 [Figma VariableValue 文档](https://developers.figma.com/docs/plugins/api/VariableValue/) 和 [Update 133](https://developers.figma.com/docs/plugins/updates/2026/08/05/version-1-update-133/) 确认 Plugin API 的 TIMING 单位为秒；ThemeBuilder 现有编辑器也按秒处理。标准 duration 使用毫秒，导入乘 1000，导出除 1000，别名保留。新增测试验证 `0.25 秒 → 250ms CSS → 0.25 秒` 以及引用不展开；15 项适配测试和类型检查通过。此项取代上一段“暂不映射”的历史状态。

## 最新安装包与全量检查

### 2026-09-23 集合默认模式组合校验

原图校验只枚举显式轴模式，遗漏调用方不传某个轴时各 Collection 自己的默认模式组合。构造 A 默认 Dark、B 默认 Light 的两个相互引用 Token 后，显式 Light/Dark 均无环，但默认组合形成环，原校验仍通过。现每个轴同时枚举省略与显式选择，覆盖部分指定轴和全部默认两种调用方式；不修改集合默认值或语义映射。回归验证默认环被严格导入拒绝，并确认修正默认模式后默认/显式解析均正常。核心 48 项测试通过。

循环诊断继续保留 `resolution` 代码，同时返回 `tokenId`、`path` 和实际选中的 `modeId`，错误文字也包含模式，编辑器无需解析文字猜测定位。上述默认循环的回归明确断言 A Token 与 dark 模式；9 项模型测试通过。普通缺值、类型与别名诊断的现有字段保持不变。

### 2026-09-23 独立主题删除历史修复

`detachTheme` 原先复制完整项目后将 `draftRevision` 清零，却保留 tombstone 的 `deletedInRevision`。基础项目有删除历史时，生成的独立项目因此不能通过严格校验或再次发布。现保留复制历史的修订号，只更换项目身份，并在返回前再次严格校验；Token ID、依赖引用与删除记录保留，基础发布快照不受修改。

新增回归先复现 `Invalid retired token identity`，修复后验证脱离项目严格解析成功、删除记录不丢失、覆盖中的 alias 不展开、独立项目可创建发布版本、原发布快照不变。项目主题测试共 15 项通过。该项不涉及 Figma 语义修改或交互测试。

### 2026-09-23 核心回归复核

重新执行 `pnpm --filter @aviala-design/tokens test`，46 项测试全部通过。此次先发现三个沿用旧快照数量的断言失效：导出变量固定为 1964、完整 CSS 声明固定为 1990、组件快照固定为 1694。导出改为逐 ID 对照输入项目；CSS 改为完整比对当前 Token 公开名及兼容别名集合，继续保留八模式静态/运行时逐值一致与引用闭合检查；组件快照保留原迁移数量下限及依赖检查，允许后续已确认的新增项。

本次没有变更 Token 定义或 Figma 语义，没有重新执行打包安装验收。ScrollPicker 动态几何浏览器验收和全组件迁移记录中的未完成项仍未因此通过；Goal 继续进行。

2026-09-21：36 项单元测试、6 项构建后集成测试通过。tokens 的 tsup、声明文件与静态 CSS 构建完成。最新 tgz 安装至 `.design-qa/package-final/consumer`，独立运行验证 main / project / node 入口、Vite 生成器和 CSS 文件，包含新增预检、合并、发布、身份接替及存储 API 的导出检查。没有进行远端发布。

仓库 `pnpm typecheck` 经 Turbo 调用失败，原因是本机 NVM 下旧 pnpm.exe 的 CommandNotFound；改用已验证的 pnpm.cmd 执行 `-r --if-present run typecheck`，icons、tokens、ui、docs、playground 五个包均通过。未修改本机包管理器配置，也未运行图标生成器。
# 2026-09-23：升级决策输入校验

补充：同一 Token ID 的类型或单位发生变化时，保留覆盖与表达式直接引用也必须兼容，不能只检查显式 replacement。已复现并修复 `4px` 覆盖被静默解释成 `4rem`；兼容替代 Token、显式移除覆盖均可继续，旧主题及两个发布快照不变。相关主题测试现为 17 项通过，tokens 类型检查通过。

`upgradeTheme` 在执行升级前严格检查决策对象、Token/Mode 替换映射及删除覆盖项。数组、未知字段、null 映射、非数组删除清单和多余字段均返回冲突，不再被静默当成空决策。该检查不改变已确认的语义映射规则；原主题和两个基础发布快照保持不变。

新增回归用例先复现空数组决策被接受，再验证修复及输入不变性；主题核心测试 16 项通过，tokens 类型检查通过。本轮未进行浏览器或 Figma 操作。

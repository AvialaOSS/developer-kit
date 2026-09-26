# Theme Engine 当前验收清单

本清单核对本次 Goal 与 THEME_ENGINE_PLAN.md，不把本地 API 测试等同于产品端接入或真实 Figma 同步。

## 最新复核（2026-09-24）

- Card/TimePicker/字符串修复后的三包已重新打包并在新目录独立安装80项依赖，真实tgz的ESM/CJS新功能SSR、CSS、字符串转义及既有八模式检查通过。当前产物路径与SHA-256见 package-verification-card-seconds-20260924.json；这份记录替代下文“包哈希早于新改动”的状态，不扩大到浏览器或插件实操验收。

- TimePicker可选秒列已按用户确认实现：新增showSeconds与可选seconds，默认时分不变，接入既有秒列5项组件Token。三项定向测试与Docs类型检查通过，Spiral ESM/CJS/声明/CSS构建通过。ThemeCat实际使用defaultValue时间对象时发现并修复继承原生按钮defaultValue造成的声明交叉冲突，已重新生成声明；随后ThemeCat网页/独立插件构建通过（网页JS `index-DfIiQDqJ.js`），预览包含真实秒列TimePickerField。没有真实滚轮/键盘/触摸验收；最新独立安装包哈希仍早于本次Card/TimePicker改动。

- Card 独立 heading 按用户选择完成 Web API、共享 Title、组件颜色、Story 与 ThemeCat 预览；两项 SSR、Docs 类型检查、Spiral完整构建通过。Figma原文件因连接器缺少 OPPO Sans 4.0 SemiBold，字体加载阶段失败，尚未写入，详见 CARD_MIGRATION.md。ThemeCat预览同时补入 ScrollPicker 的循环小时/有限分钟两列和当前值读数；这只是验收入口，不是滚轮交互通过证据。

- ThemeCat 完整 CSS 导出已补齐：`src/theme-css.ts` 经标准 projectCssText 生成八种组合，保留 data-theme 亮暗入口，新增同作用域的 data-density/data-effects。每个作用域声明完整图，嵌套作用域显式指定 data-theme，省略的轴使用 Default/ON。定向测试逐项比较八组全部声明与标准解析结果，通过；网页和独立插件类型检查及构建通过（网页 JS `index-DqYCSdq9.js`）。README已说明属性与默认规则。尚未进行浏览器下载/嵌套显示验收；此条替代下条“完整导出需后续处理”的历史状态。

- ThemeCat 已重新构建网页与独立插件（网页 JS `index-CeFQe3uI.js`），包含本轮 CSS 字符串修复。发现并补齐了模式选择接入：原先只传 color，现在通过 Spiral Select 增加 Default/Mobile Friendly 和 ON/OFF；同一 selection 同时供 Token 解析、已修改标记、恢复目标、编辑初始模式和 iframe 预览使用。选择本身不写入覆盖值。网页/插件类型检查与构建通过，未启动插件或进行浏览器交互验证。CSS 导出目前仍只提供亮暗两组，密度/效果完整导出需后续处理。

- CSS 字符串输出修复：旧实现直接使用 JSON.stringify，换行/制表符等被输出为 JSON 转义，CSS 会解析成不同字符。新增用例先复现失败，再改为 CSSOM 字符串序列化（控制字符用十六进制转义，NULL 按规范输出替换字符；原项目数据不变）。15项 snapshot-adapter 测试、6项构建后静态/运行时与纯核心声明检查通过，tokens ESM/CJS/声明/CSS 构建通过。规范依据：https://www.w3.org/TR/cssom-1/#serialize-a-string 。此修复晚于下列独立安装包哈希；旧包记录不证明本次修复已经打包安装，也未声称 ThemeCat 插件产物已重建。

- 最新三包已重新打包，并在新的 consumer-clean 目录按锁文件安装80项依赖。7项prepack与安装后的Rate/MultiSelect/ButtonGroup ESM/CJS、Card复用、属性文档、Nested阴影八模式以及ListItem/Alert/Avatar检查通过；哈希和真实目录见 package-verification-latest-20260924.json。检查脚本 installed-package-check-20260924.mjs 应复制到安装目录执行，避免从仓库解析依赖。首次npm内部异常留下的目录没有作为成功证据；最终使用干净目录验收。旧package-verification-20260924.json仅保留历史范围。

- Nested分段器阴影决策已解决：用户确认对齐Figma16px并接入效果开关。Figma6变量和8个选中变体已绑定；Engine修订14共2008Token，组件1720项、1535直接引用。八模式及7项标准产物测试通过；ThemeCat基础版本0.1.5可审阅升级。此更新覆盖下文旧待决状态，不等于浏览器交互已验收。

- 新增公共 ButtonGroup 并由 Card 复用，默认隐藏的说明槽消费组件 Caption 颜色；三个组Token已全部接入。ThemeCat预览和构建已跟进，类型检查及构建产物SSR核对通过。最新盘点52公共模块、1530直接引用，仍非完成率。
- Layout Helper / Group 共12项Token经用户明确确认仅供设计占位，Web标记不适用；变量保留，新增消费者会使豁免失效。详见 LAYOUT_HELPER_MIGRATION.md。
- ScrollPicker/日期时间滚轮已修复事件所有权、有限列CSS滚动链及deltaMode单位换算；16项定向测试通过。真实滚轮边界、触摸及跨设备验收仍暂缓，不由单元测试替代。
- Card独立heading层级已获用户授权，具体新增行/切换外观结构仍待Ask。Nested分段器重新读取发现Figma模糊16px、Web8px，且Web未接入效果OFF；已提供精确差异与选项，未擅自映射。TimePicker秒列同样等待用户决定。

- 用户确认补齐Select Tag多选；新增MultiSelect公共入口、故事和属性文档，复用Select/Tag Token，并接入ThemeCat iframe预览。2项SSR结构/表单检查及Storybook类型检查通过；真实交互尚未验证，详见MULTI_SELECT_MIGRATION.md。TimePicker可选秒列仍在Ask等待决定。
- 普通Select禁用分层已接入，修正占位标记选择器读取Trigger。Figma16个禁用变体已区分文字和Tag两种内层透明度，未混用。

- CascaderInput/ColorPickerInput/NumberInput 继续补齐已确认的禁用分层。Figma 8/8/16 个禁用变体均根=1、内容槽≈0.55、文字≈0.6；ColorPicker 新增文字内层，其他复用已有结构，保留旧覆盖。CSS 构建与2项包入口检查通过；不将菜单项/面板内控件或浏览器视觉算作已验收。直接引用盘点更新为1526项，非完成率。

- DatePicker/TimePicker 禁用输入补齐分层透明度：Figma API 汇总验证 16/8 个禁用变体全部根=1、内容槽≈0.55、内部文字≈0.6；Web 通过各自组件 Token 对应两层，禁用 placeholder 不再额外叠乘。CSS 构建与 ThemeCat 网页/插件产物更新通过，未进行浏览器测试。本项晚于下述隔离安装包检查，不将旧包哈希作为这次 CSS 的打包证据。

- 用户确认的 ListItem 内容顶线与尾部竖线统一 Default neutral-2 / Deep neutral-3；Figma 各 18 处已同步。ListItem 自身的 0 圆角绑定保持，Web 移除首尾项额外圆角。Alert 80 个 Link 全部 noBackgroundCustom；Avatar 9 处缺失高度绑定补齐，六级高度消费组件 Token。ThemeCat 已重新构建使用这些产物。
- 当前三个包重新打包并安装到独立临时目录，7 项 prepack 检查和安装后的 ESM/CJS、Rate 动态 Token、ListItem/Avatar CSS、Alert 四链接模式检查通过；路径及包哈希见 package-verification-20260924.json。该证据不覆盖真实交互或整组件视觉验收，未远端发布。
- 组件引用盘点刷新至 1519 项直接引用（50 公共模块、102 分组、1715 组件 Token），不作为完成率。Loading BiggerSize 的待决定状态已解决：保留 Figma 现状，Web 不新增该属性。

## 历史复核（2026-09-23）

- 当前对齐产物已刷新至标准项目修订 13：2002 Token、26 兼容别名，本地快照 1976 变量，未映射项 0、生成 CSS 未闭合引用 0。标准项目比旧快照多 26 项（12 个基础色阶及 14 个效果/组件阴影 Token），不等于线上文件缺失；线上只以实际读取/写入回执为准。组件清单为 50 个公共来源模块、102 分组、1715 组件 Token、1510 项直接文本引用；动态消费另见 Rate 等迁移记录，不换算完成率。

- ThemeCat 基础升级从直接应用/报错改为审阅窗口：列出基础 Token 新增/变更/删除，可选择保留或移除覆盖、兼容 Token 替换及模式映射；每次更改重新调用核心完整校验，通过后才能原子提交。取消不调用 commit；若审阅期间源主题已变化则拒绝应用。使用 Spiral 的 Modal/Select/Checkbox/Feedback/Button，未修改组件库外观。3 项定向测试覆盖引用替代、移除覆盖后清理失效决定、模式迁移与源数据不变性；不替代浏览器操作验收。

- prepack 补齐实际 CSS 产物检查：复用 package-entrypoints 测试，逐一比较所有导出 CSS 与 Vite 生成结果，并核对 ESM/CJS 入口。新增纳入门禁的 2 项检查当前通过；它们检查实际 dist，避免仅比较源码生成结果而遗漏过期的独立效果 CSS。此前已通过且未受修改影响的 5 项门禁结果未重复执行。

- 补齐不可变发布版本的升级边界：upgradeTheme 现在拒绝同项目同版本但 hash 不同的目标；不改变旧主题，要求发布新版本。相同发布包的无操作升级仍可用，新版本升级仍可用。18 项 project-theme 定向测试通过，包含输入不变性、冲突决策、单位兼容与不可变版本检查。

- 用户确认 Button tiny allRound 统一为 99px：标准项目及原 Figma 变量引用均已修改，保留变量身份。tokens 完整重建与 3 项运行时一致性检查通过，Spiral 样式和 changelog 已重新生成。ThemeCat 本地基础版本提升至 0.1.4，升级文件位于 themecat/artifacts/theme-engine-0.1.4.json，0.1.3 文件保留原内容。

- Textarea 禁用层级已跟进用户确认的 Figma 结构原则。重新只读核对四个禁用变体后，文字采用 Textarea content-disabled × placeholder，图标仅 content-disabled，Controller 独立不降透明度；普通占位文字也改为消费对应组件 Token。CSS 产物已重新生成。此项没有执行浏览器外观或操作验收，不沿用旧截图证明新行为。

- 安装包复核发现并修复上一轮仅 build:css 导致的运行时过期：Like Half 的静态输出已更新，但 JS 中仍为旧引用。完整重建 tokens 后 3 项默认主题检查通过；prepack 新增 5 项静态/运行时一致性门禁，并已实际执行通过。ThemeCat 网页与插件重新构建成功。
- 本轮新建独立目录 `C:/Users/MXrek/AppData/Local/Temp/spiral-rate-package-f951744f1d944d34a44dc2385f7e4561/consumer`，安装本地 icons/spiral/tokens tgz。check.mjs 验证 ESM/CJS Rate 公共入口、半分 SSR、18 组 RateIcon 的所有动态变量均在安装包定义、Like 半选最新运行时引用及 11px 遮罩值。Rate 样式依现有约定从 tokens/information-collect-extras.css 单独导入；ThemeCat、Storybook、Playground 均已导入该入口。不是浏览器交互或视觉验收。

- Loading BiggerSize 已由用户确认保持 Figma 现状、Web 暂不暴露；无需新增尺寸或修改 Figma，解除这一待决定项。

- 本轮已按用户决定新增 Rate/RateIcon 公共组件、Storybook 与属性文档，修正原 Components 文件 Like 的 9 个变体及 19 个变量（18 个遮罩尺寸、1 个选中色引用）。详情见 RATE_MIGRATION.md；取代下文“尚未决定是否新增”的历史状态。
- BaseInput 禁用内容层 55% × 文字层 60%，图标独立 90%；Select 阴影改为 Figma 的 0/5/20/0、黑色 6%。Switch、Slider 保留开启时几何及颜色，通过组件 Token 引用效果 ON/OFF。
- Rate 3 项静态语义/表单测试通过；Spiral 类型检查、完整构建通过（46 项属性文档、51 项 changelog）。八种模式的阴影开关及 Like 半选 Token 解析检查通过。未执行 Computer Use、浏览器或桌面插件交互测试。
- ThemeCat 基础项目更新为本地 0.1.3，预览新增 Rate 与已填写禁用 Input；网页和独立插件构建通过。已有主题保留其原基础版本及覆盖值，可通过升级基础项目导入 themecat/artifacts/theme-engine-0.1.3.json；未强制改写用户存储。

以下结果补充并覆盖下文对应的历史状态，不扩大已经验证的范围：

- 滚轮实例 ID 与单选声明修复后，Spiral 完整构建通过；分别通过构建后 ESM/CJS 公共入口渲染循环 ScrollPicker，选项 ID 唯一且仅活动后代声明选中。ThemeCat 网页与插件再次完整构建成功（网页 JS `index-GQxMLq-O.js`），单一 React 构建检查通过。此项不是隔离安装或真实滚动/屏幕阅读器验证。Rate/RateIcon 是否纳入新增实现已在问答面板等待范围决定，未据此擅自新增组件。
- 菜单局部 hover 修复已同步构建：Spiral ESM/CJS/声明、CSS 和文档生成成功；ThemeCat 网页与独立插件完整构建成功。检查 `index-mxigZwaF.css` 与 `plugin/dist/ui.html` 均包含消费处的 Select hover 回退链，且无旧 select/cascader-item-highlight-bg 默认声明。未启动或重连 Figma 插件，未作界面验证；构建仍有既存的大 chunk 提示。
- 升级决策结构校验修复后，当前工作树完整核心测试 **49 项**、构建后集成测试 **11 项**均通过；集成测试直接使用上轮成功构建的最新 dist，未重复构建。覆盖默认模式循环、脱离主题的删除历史、升级冲突与输入不变性、完整依赖、八模式、静态/运行时一致、存储事务、包入口及无 DOM 声明。下文 9 项集成与旧包哈希属于历史检查，不代表这次新代码的独立打包安装结果。
- 最新 Spiral ESM/CJS/声明、CSS、45 项属性文档与49项组件变更记录构建通过。ThemeCat 的实际依赖解析路径指向本工作树 UI/tokens dist；ThemeCat 网页和独立插件完整构建通过，插件构建内的单一 React 实例检查通过。最终网页 CSS 与插件 HTML 均含局部 hover 回退链，且未重新声明根 `--input-bg-hover` 默认。此项证明产物已跟进，不代表已重启 Figma 插件或完成视觉验收。Vite 仍有大于500kB的 chunk 提示，构建未失败。
- 全组件源码盘点已刷新：49 个公共来源模块、102 个组件 Token 分组、1705 个组件 Token、1494 项直接文本引用。仍不将此数字换算为完成率。Input 禁用已填文字 55% 与设计记录 33% 的差异已重新通过 Ask 请求决定，答复前保持现状。
- 重新生成对齐清单：当前标准项目修订 10，1988 Token、26 个兼容别名；本地 Figma 快照含 1976 个变量，未映射项 0、生成 CSS 未闭合引用 0。标准项目独有 12 个色阶已逐项列在 `ALIGNMENT.md`，不再将历史 1964 数量作为当前清单，也不据此声称线上 Figma 已同步。
- 新增 `project-types.test.mjs`：对构建后的 ESM/CJS project 声明及传递依赖执行严格 TypeScript 校验，只加载 ES2022，`types: []` 且不跳过声明检查。测试通过，证明标准 `/project` 入口无需 DOM、Node 或 Figma 全局类型；已加入构建后集成命令。浏览器运行时适配模块不属于该纯核心入口。
- 当前 tokens 构建（ESM/CJS、声明、CSS）及 9 项集成测试通过，涵盖默认主题属性所有权、独立模式、包入口、项目存储与编辑器转换。
- `package-entrypoints.test.mjs` 新增完整 CSS 导出检查：逐项解析 package exports，将 Vite 插件输出与发布 CSS 按完整文件内容比较，并检查主入口和 project 入口可读。
- 此前构建已本地打包并安装到独立临时目录 `C:/Users/MXrek/AppData/Local/Temp/spiral-package-audit-684b6f4b9c374f479ff22d491d788ff9`。该目录仅安装 tgz 及其运行依赖，未安装 TypeScript 或连接仓库源码；两项入口测试均通过。包 SHA-256：`4e90e311b81789f565dc254b5c8ee3910080cecc73ebbfd859b56b841142f048`，早于后续核心校验修复，不作为最新源码打包证明。没有远端发布。
- ScrollPicker 动态几何、八模式和覆盖所有权已有本日记录，见 `SCROLL_PICKER_MIGRATION.md`；不能再将动态几何统称为未验收。触摸设备、边界滚轮传递及全部嵌入消费者仍未完整验收。
- 用户现要求暂不进行 Computer Use 相关测试；这些交互待办保留，不能由本轮构建或包入口测试替代。全组件迁移仍以逐组件记录为准，Goal 尚未完成。

| 要求                                                 | 当前证据                                                                                         | 状态                                           |
| ---------------------------------------------------- | ------------------------------------------------------------------------------------------------ | ---------------------------------------------- |
| 独立标准模型、结构/类型/单位/引用/循环/模式校验      | project.ts、project.test.mjs；核心不依赖 DOM/Figma                                               | 已实现并测试                                   |
| 1964 Token 完整依赖、7 Collection                    | alignment.json；标准输出缺失引用 0                                                               | 已验证本地基线                                 |
| 来源 ID、重复导入、同名重建显式接替                  | snapshot-adapter、project-edit 测试                                                              | 已实现并测试                                   |
| 三方合并、草稿/基线原子存储                          | project-merge、project-store 集成测试                                                            | 已实现并测试                                   |
| 版本快照、精确基础版本覆盖、冲突先行升级、脱离保留图 | project-theme 测试                                                                               | 核心已实现；产品界面未接入                     |
| 可读 CSS、固定名、改名兼容、破坏性移除控制           | renameProjectToken、release 校验；1845 名迁移前后八模式输出相同                                  | 已实现并测试                                   |
| 旧 control 独立语义层                                | css-lib 的旧层与标准层；ALIGNMENT.md 已记录用户决定                                              | 已保留                                         |
| CSS/runtime 共用、局部作用域、三个独立模式维度       | standard-css 测试；ScrollPicker Project 实际浏览器验收                                           | 已验证                                         |
| 清理只移除自有属性、恢复原值                         | runtime 测试；Override Ownership 浏览器前/中/后值                                                | 已验证                                         |
| ScrollPicker 新/旧覆盖与共享 Typography              | 浏览器背景覆盖四场景、密度字号；组件 CSS 仍需最终逐属性汇总                                      | 部分验收待汇总                                 |
| Figma 来源只读、受限项定位、禁止静默展开             | bindings.readOnly、planFigmaValues、导出/回读测试                                                | 已实现并测试                                   |
| 标准项目生成 Figma 回写包                            | ThemeBuilder 实际解析器/规划器接受 1964 项；单值编辑只有一个动作                                 | 格式桥接已验证                                 |
| 实际写入、回读、恢复/撤销                            | 桌面插件成功新增 5 个变量；真实回执和独立 Figma 读取均通过；此前 scopes 错误后的撤销也已独立核对 | 创建/回读/失败撤销已验证；更新后主动撤销待验收 |
| TIMING/EASING 编码                                   | 官方秒单位、0.25s↔250ms 测试；真实自定义贝塞尔样本往返                                           | TIMING/自定义贝塞尔支持；其他缓动明确拒绝      |
| 发布包入口                                           | 最新包在 package-current/consumer 独立安装，新增改名、导出、回读 API 及 Vite/CSS 均通过          | 已验证当前代码                                 |

## TestVar 现场状态

### 当前 Token 包安装复核（2026-09-21）

后续 UI 安装检查发现并修复 CommonJS 链路：Spiral 的 require 入口依赖 tokens，但 tokens 原先只声明 import。tokens 现生成 ESM/CJS 及对应声明，并为主入口/project/node/Tailwind 配置分别提供条件入口。Node 文件路径通过 tsup shim 处理；新增集成测试对比 ESM/CJS 动态主题及 Node 三轴主题结果。

Spiral 完整构建通过（ESM/CJS、声明、CSS、45 项属性文档、49 项组件变更记录）。本地打包后在上述全新临时目录安装 icons/spiral/tokens，ui-check.mjs 通过主入口及 Form 子入口的 import/require、ColorPicker 图标槽顺序、Form 说明行角色、基础 CSS 与属性文档检查。独立效果 CSS 仍按现有包约定单独导入，未假设 styles.css 包含全部效果。此前 Token 包哈希仅对应该次打包；后续 CommonJS 修复已重新打包安装，不以旧哈希代表新产物。实际浏览器视觉/交互验收仍待完成。

重新打包当前工作树 tokens，在全新临时目录安装 tgz（未远端发布）。运行原安装后 smoke：Node / runtime / project / Vite / 生成 CSS 入口通过。额外通过安装包的 mergeSnapshotCandidate 构造同名重建及旧本地引用：结果保持 ok=false，repairDraft 无法直接通过严格校验；显式接替旧身份后校验成功并保留 alias。安装包 CSS 确认包含本轮 FormGroup 操作区留白、Tooltip 图标尺寸和 ScrollPicker 派生高度规则。

包 SHA-256：`7115e76cb6704b15c186c39866a1a4888677287a0016ec63752f4aa4fcbfbf17`。检查目录：`C:/Users/MXrek/AppData/Local/Temp/spiral-engine-package-89cab7a0505f4071884634f90fe9f386`，包含 check.mjs 与 identity-check.mjs。此轮只证明 Token 包入口与能力，未宣称 UI 包和浏览器视觉验收完成。

测试文件：oAsn0aY30N0WdlmVBemYdv。已保存实际捕获到 `.design-qa/testvar-before.json`。待执行包 `.design-qa/live-pack.json`，只新增 Theme Engine QA 集合及 spacing/alias/duration/curve/color 五个变量，不修改原 ThemeBuilder QA 集合。

连接器执行的是现有 ThemeBuilder `applyPackage`；在写入前的 `commitUndo` 即失败，返回 `safeToRetryWithoutCanvasRead: true`。没有替换或禁用撤销保护。已通过 Ask 请求用户在桌面插件打开包并查看预览；后续以真实回执核对，不用手工构造成功回执。

桌面报错详情确认 TestVar 插件身份为 `local-mu6yox8a-n16ggmfzusd`，已据此生成 `live-pack-desktop.json`，没有绕过身份检查。实际写入暴露 Timing/Easing 不支持设置 scopes；已修复 ThemeBuilder 适配器，14 项适配器测试及完整构建通过。失败后的独立读取确认原 6 个变量不变、失败创建的集合已撤销。

用户重新运行插件并成功应用，回执实际保存于 `C:\Users\MXrek\Downloads\TestVar.receipt.json`，归档为 `.design-qa/desktop-receipt.json`。`verify-desktop-receipt.mjs` 经标准适配器导入后，`verifyFigmaReadback` 返回 verified=true（`.design-qa/desktop-readback-result.json`）。独立连接器读取另存 `testvar-after-create-live.json`，`verify-live-create.mjs` 通过：spacing=12、alias 保留对 spacing 的真实 ID 引用、duration=0.25s 对应 250ms、贝塞尔四参数及颜色一致，原有 6 个变量的名称/类型/值未变。新集合真实 ID 为 `VariableCollectionId:22:6`。更新及主动撤销尚未执行，不重复应用创建包。

最新全套 42 项单元、6 项集成测试和 tokens lint 已通过。

2026-09-21 用户明确将全组件迁移纳入本次 Goal，ScrollPicker 不再是完成边界；全组件盘点和逐项迁移验收必须完成。未经授权的远端发布仍不在范围内。用户暂缓需要手动操作插件的验证，更新包已生成并通过真实规划器检查（恰好改名/改值两项），但未将其当成实际更新/撤销证据。

ThemeBuilder/ThemeCat 产品界面、命名缓动与弹簧模型扩展仍属未完成工作，不能用核心 API 存在来宣称整个统一工具链完成。

## 全组件迁移进展索引（2026-09-21）

2026-09-21 更新：已重新生成 COMPONENT_MIGRATION.md / component-migration.json，当前 49 个公共来源模块、102 个 Token 分组、1704 个组件 Token，其中 1468 项有直接文本引用。此数字仍不表示完成率；Rate/RateIcon 经源码及公共入口检查，目前无 Spiral 实现，明确标为“Figma 已有；Spiral 未实现”，不再与现有组件的迁移缺口混计。Form/FormGroup 本轮已接入 15 项 Token，实际模式/交互验收仍待完成。

此表记录实现与验收边界，不按 Token 引用数量推算组件完成率。

| 组件                     | 当前进展                                                                                                                              | 未完成边界                                                                                                                             |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| ScrollPicker             | 已接入组件 Token；局部主题和覆盖已有浏览器证据；行高已改为 Typography 加组件 padding，并监听尺寸变化                                  | 新增动态几何尚未完成浏览器验收，不能沿用此前背景/覆盖证据；还需逐属性汇总                                                              |
| Button                   | 普通尺寸、圆角、内容透明度、primary 颜色/阴影、描边/无背景颜色、部分仅图标布局已接入                                                  | 其他颜色语义、描边仅图标尺寸冲突、全状态回归；详见 BUTTON_MIGRATION.md                                                                 |
| Segmentator              | group/button Token 接入与多模式布局验证                                                                                               | selected nested 阴影决策及剩余交互回归                                                                                                 |
| Link                     | 39 Token 消费、asChild、禁用行为与八模式默认状态/覆盖验证                                                                             | text 自定义模式默认背景冲突、hover/active、嵌入回归；详见 LINK_MIGRATION.md                                                            |
| Checkbox / Input / Group | 外框、三态内边距/颜色/效果颜色、文字与组合间距已接入，八模式验证                                                                      | 标记尺寸Token决策、效果几何与嵌入/完整交互；详见 CHECKBOX_MIGRATION.md                                                                 |
| Radio / Input / Group    | 31项Token、整组禁用、八模式与键盘对照已验证                                                                                           | 尺寸/效果常量、复杂主题键盘偶发现象、嵌入回归；详见 RADIO_MIGRATION.md                                                                 |
| Switch                   | 15项Token、八模式基础状态、RTL与表单验证                                                                                              | hover/active及阴影Token决策、尺寸缺口、连续动画和嵌入回归；详见 SWITCH_MIGRATION.md                                                    |
| Badge                    | 62项Token已接入，48变体×8模式几何、颜色与旧覆盖；六类消费者基本交互及192px窄输入已验证                                                | 消费者全模式组合与受限宽度截断策略；详见 BADGE_MIGRATION.md                                                                            |
| Loading                  | 31项Token接入，84组合×8模式几何、渐变、新旧覆盖、Button加载状态验证                                                                   | BiggerSize设计缺口待决定，其他消费者随组件验收；详见 LOADING_MIGRATION.md                                                              |
| Input / NumberInput      | BaseInput 20项及NumberInput 22项Token接入；BaseInput八模式、NumberInput嵌套按钮及24组合×八模式、覆盖与步进验证                        | 透明度冲突、共享消费者回归；详见 INPUT_MIGRATION.md                                                                                    |
| 其他公共组件             | 已纳入 COMPONENT_MIGRATION 清单                                                                                                       | 仍需逐组件迁移与验收                                                                                                                   |
| Slider                   | 34项Token；普通/禁用八模式、32方向圆角组合、键盘/拖拽/范围间隔/表单及ColorPicker基本复用验证；修复禁用提交                            | 阴影效果开关语义、完整状态/消费者、动态禁用与表单重置；详见 SLIDER_MIGRATION.md                                                        |
| Cascader                 | 输入框20/22项及16组合×八模式；菜单/分组/列、菜单项主要Token、独立菜单八模式与选中阴影开关；新增Search并验证空结果及键盘选择           | 透明度语义、菜单外投影、左右图标颜色、表单复合项、搜索高级交互和消费者；详见 CASCADER_MIGRATION.md                                     |
| Select                   | 输入框20项Token；菜单/分组及多数菜单项Token，局部Portal、共享字体、子菜单标签与键盘关闭已修复；菜单亮暗/密度/效果八组合已有浏览器证据 | 效果OFF仍显示旧菜单阴影、普通选中态语义待Ask、左右图标色、Search/Tag、透明度、其他Portal消费者与完整状态回归；详见 SELECT_MIGRATION.md |
| Textarea / Controller    | 19+8项Token，12组合×八模式、独立/状态覆盖、FormField错误传递与拖拽/计数验证                                                           | 透明度语义、badge隐藏分支、hover/error语义；详见 TEXTAREA_MIGRATION.md                                                                 |

Link 的 text/noBackgroundCustom 白背景虽然按现有标准正确解析，但与 Figma 无填充设计冲突，仍然属于未完成项。

Progress：颜色、bar 几何与 ring 容器 Token 已接入，12 变体 × 八模式有浏览器证据；ring 内部几何、覆盖及边界验收未完成，见 PROGRESS_MIGRATION.md。

Avatar：文字/图标颜色、圆角与图标尺寸已接入，24 变体 × 八模式浏览器检查；内部高度冲突、图片与消费者未完成，见 AVATAR_MIGRATION.md。

Tag：基础颜色、描边、圆角、间距已接入，八变体 × 八模式已验证；内外层 padding、禁用透明度作用层级与图标几何未完成，见 TAG_MIGRATION.md。

Tooltip：表面/文字/阴影/指针颜色及指针几何已接入，已修复暗色文字覆盖；默认文字改为共享 Text，并增加可选前后图标槽。新增文字/图标的实际渲染、方向留白、边缘碰撞、效果 OFF 语义及完整交互仍待验收，见 TOOLTIP_MIGRATION.md。

## 当前待决定项与验证阻碍

本轮公开入口合并检查：UI 的 ESM/CJS/声明、CSS、45 项属性文档与49项组件变更记录生成通过；属性生成器已补上 PopoverIcon 子组件。重新打包 UI 和 tokens 至临时目录的 current-icons 子目录，并在隔离安装目录更新两个本地 tgz。current-icon-check.mjs 与既有 ui-check.mjs 通过：ESM/CJS 公开入口、图标装饰标记、颜色按钮选中/名称属性、无图标默认结构、Form 子入口、属性文档，以及 Popover/ColorPicker/Video 最新效果 CSS 均在安装包中。没有远端发布；上述证据仅覆盖包内容及 SSR 结构，不证明 Tooltip 字级、Popover 图标或 ScrollPicker 在浏览器中的实际布局与交互。

- ScrollPicker TokenGeometry 页面再次因内嵌浏览器 `Timed out waiting for the Browser webview to attach for this browser-use page` 无法打开。独立本地自动化浏览器的替代验证方式已通过 Ask 请求，尚未获得答复；没有将浏览器超时记为组件失败或通过。
- Input 的待决定项是禁用已填文字的最终透明度：Figma 的 input area 0.55 与内部 Typography 0.6 叠加为 0.33；当前 Web 已填文字为 0.55、占位文字为 0.33。当前 Web 已经只降低内容透明度，不能再把此冲突描述为“整个输入框或仅内容”。BaseInput 图标插槽的固定 0.9 与 Web 禁用图标 0.55 是另一项尚未确认的差异。
- Navigation 的三个选中背景与阴影已回读确认绑定组件 Token。用户补齐文字后，2026-09-21 回读确认三个 Text 节点均绑定 `navigationItem/color/selected/text-default`（`VariableID:2740:10504`）；共享字号、行高、字重绑定保留，Web 已消费对应 CSS 变量。文字绑定阻碍已解除；其余状态、菜单与完整交互验收仍未完成，详见 NAVIGATION_MIGRATION.md。
- ThemeBuilder 导入窗口现在会在外部标准配置更新后重新加载配置，并在保存配置/草稿的事务内拒绝过期项目快照。10 项导入定向测试和类型检查通过；此结果不替代桌面 Figma 回写或浏览器验证。

# 2026-09-24 最新安装包补充

当前门槛以CURRENT_GATES.md为准，下文保留历史批次证据与当时的未完成项。最新独立安装记录为package-verification-runtime-profile-20260924.json，包含可选表头图标、共享Aviala字体单位配置、ALD惰性初始化，以及此前Card heading和TimePicker秒列。ESM/CJS与CSS/SSR检查通过，不代表视觉、键盘、滚轮、触摸或Figma插件验收通过。

# Button 组件 Token 迁移

2026-09-23：用户确认 tiny allRound 统一为完整胶囊圆角。Figma 原文件变量 `VariableID:2519:32647` 已改为与 small 相同的 `VariableID:15:63` 引用；标准项目保留 Token ID，更新引用至同一共享 allround。四档默认解析均为 99px，不再保留 tiny 6px 例外。下文该项待决定为历史记录。

## 已接入

四档 tiny/small/regular/big 的普通 padding-x、padding-y、gap、default/radius 共 16 个 Token。
移除两份 CSS 中会遮蔽组件 Token 的旧尺寸默认值；消费端保留旧尺寸变量的显式覆盖优先级。共享 Typography 不新增组件级字体指标。

Upload 尚未迁移，其旧 Button padding 回退继续使用原来的基础语义变量，避免删除全局默认后丢失原有密度响应。

## 浏览器证据

Storybook `basic-input-button--component-spacing`：四档 baseline / token / legacy，共 12 个按钮。

| 尺寸    | 默认 padding（y / x） | gap | radius |
| ------- | --------------------- | --- | ------ |
| tiny    | 2px / 4px             | 4px | 6px    |
| small   | 4px / 6px             | 4px | 6px    |
| regular | 6px / 10px            | 4px | 8px    |
| big     | 8px / 14px            | 4px | 8px    |

四档显式组件覆盖均输出 padding 11px / 23px、gap 13px、radius 17px。新旧 x 覆盖同时存在时旧值 19px 优先，旧 gap 9px 生效。默认 gap 从旧 6px 变为标准 4px；small 的 y 从旧 2px 变为标准 4px，属于已存在标准 Token 的真实差异。

截图无布局溢出、页面非空、控制台无 error/warn。仅验证当前默认亮色配置，不能外推到全部模式或状态。

tokens 构建、UI 完整构建（含文档汇总）及工作区 5 个项目类型检查通过。盘点已重新生成，Button 直接消费 16 个 Token；全库直接引用数 88，不作为完成率。

## 尚未完成

- 颜色、描边、阴影、渐变；透明度已接入，完整状态组合仍需验证。
- rounded、iconOnly、图标槽位与特殊图标宽度；当前 iconOnly 仍采用原正方形算法。
- old second/default 与 Figma secondary/tertiary 的逐属性映射核对。
- destructive 在标准项目中缺少对应组件 Token，已通过 Ask 请求处理方式；决定前保留旧行为。2026-09-24再次只读核对线上集合129:5：Mode仅primary/secondary/tertiary/tertiaryCustom/noBackground/noBackgroundCustom/outline/outlineCustom，且无button路径下destructive/danger变量。已重新提出补齐双端、明确Web兼容例外或审阅后停用三种选项；未替用户选择。
- asChild 缺失 size 等数据属性的行为核对。
- 三轴模式、旧覆盖完整兼容、组合消费者回归。

本记录是迁移进度，不代表 Button 完成。

## 普通图标尺寸

- 接入四档 icon-width/icon-height 共 8 个 Token；容器使用高度 Token，默认 SVG 的尺寸通过图标库原 CSS 变量入口跟随宽度 Token。调用方显式 level/biggerSize 时跳过此默认覆盖。
- 旧每档 icon-size/icon-slot-height 和通用 button-icon-size 显式覆盖继续生效；旧根默认值转为内部兼容值，Video 共用引用保留原回退。
- `icon-component-tokens` 浏览器当前移动密度：tiny 容器 18×20、SVG 18×18；其余三档容器 20×24、SVG 20×20。新覆盖后四档容器 27×33、SVG 27×27。显式 caption + biggerSize=false 保持 SVG 16×16，不受 27px 默认覆盖影响。旧覆盖输出容器 21×29、SVG 21×21。
- iconOnly 的专属容器/padding 及两个特殊 leading/trailing 宽度仍待接入，不能将本轮记为图标全部完成。

## Outline / NoBackground 系列

- 四个同名变体接入各 3 个背景状态、文字与图标颜色；两个 outline 接入各 3 个描边状态及共用 stroke-width，共 27 个 Token。旧共享默认转为内部兼容回退，Link/Navigation 等未迁移消费者继续保留原值。
- `project-effects` 增加四个变体 baseline/disabled/token/legacy。亮色基础主题前景 rgb(205,57,35)，custom 前景 rgb(38,37,37)；暗色分别 rgb(255,174,155) / rgb(213,213,213)。默认背景透明。
- 新覆盖实测背景 rgb(220,230,240)、文字 rgb(30,50,70)、图标 rgb(20,110,80)；outline 描边 3px rgb(50,80,110)、inset -3px。hover 描边变为 rgb(70,100,130)。背景有 250ms 过渡，中途读值不能当最终值。
- 四档旧前景覆盖均读得 rgb(80,40,100)，outline 旧描边覆盖读得 rgb(150,70,110)。禁用按钮仍有 disabled 属性；active 消费已实现，但持续按下视觉仍待验收。
- 旧 second/default/defaultCustom 的命名映射已另行 Ask，尚未按近似名称自动迁移。
- 悬停过渡稳定后背景为 rgb(200,220,240)，描边保持 3px rgb(70,100,130)。截图无布局溢出、控制台无 error/warn；tokens 构建、全工作区类型检查通过。

## Primary 阴影和渐变

- 接入内外阴影各 5 个颜色/几何 Token，以及 2 个渐变色标 Token。原复合 shadow-basic / primary-gradient 仍可显式覆盖；destructive 暂保留原默认效果。
- 只读核对 Components 文件 Button 129:5 中 primary 节点 129:4、164:1082、163:1098、155:1328：渐变填充 opacity=0.2，色标位置 0 / 0.36；颜色绑定组件变量。内阴影 y=-1、blur=0；外阴影 blur=1，其余几何参数为 0。故保留填充透明度并消费色标 Token，不改标准颜色值。此前关于不透明渐变的疑问已由原组件证据解释，无需猜测。
- `project-effects` 已操作 Light/Dark × Default/Mobile Friendly × ON/OFF 八种组合。基线阴影 ON alpha 为 0.12/0.08，OFF 均为 0；渐变起点 ON alpha 为 0.2，OFF 为 0。暗色文字跟随已确认规则变为 rgb(2,2,2)。
- 组件覆盖可将外阴影模糊设为 7px、颜色设为 alpha 0.5；旧复合覆盖 none 优先。显式固定颜色覆盖不会随效果模式自动归零，这是覆盖的预期行为，基线按模式归零。
- 20% 填充透明度、36% 色标位置当前仍是已核对的组件设计常量，尚无独立 Token；是否进一步 Token 化需单独决定，不宣称它们已迁移。
- tokens/UI 构建及工作区 5 个项目类型检查通过；最终暗色 OFF 页面无错误遮罩，控制台无 error/warn。
- 后续只读检查确认 Figma Mode 实际为 primary/secondary/tertiary/outline/tertiaryCustom/outlineCustom/noBackground/noBackgroundCustom；tiny allRound 原组件 134:274、155:1420、134:278、155:1436 的实际 radius 也是 6，并绑定对应组件变量。当前 Web 的 6px 忠实匹配原稿；是否将设计改成 99px 仍由用户决定，不能作为适配错误擅自修正。

## Primary 颜色

- 接入 primary 的 background-default/hover/active、text-default、icon-default 共 5 个 Token。图标和文字各自消费颜色；旧 primary-fg 显式覆盖继续同时作用于两者。
- 原 primary 默认定义移至内部 `_legacy-button-primary-*`，Switch、Upload、Popover 等现存消费者先读取旧显式覆盖，再回退原默认。它们未因此被算作迁移完成。
- `primary-color-tokens` 实测：基线背景 rgb(255,85,50)，文字/图标 rgb(254,253,253)；新覆盖背景 rgb(20,80,120)、文字 rgb(230,220,210)、图标 rgb(100,230,180)；悬停背景 rgb(30,100,140)。旧覆盖背景 rgb(120,40,80)、文字/图标 rgb(245,235,225)，优先于新背景覆盖。
- Upload default 抽查：背景 rgb(255,85,50)、前景 rgb(254,253,253)、padding 6px 10px。未操作文件选择器。其他共享消费者的完整模式回归仍待完成。
- 页面与截图正常，控制台无 error/warn。active 已接入，但浏览器持续按下状态尚未采样，不宣称已验收。完整三轴颜色矩阵仍待完成。

## 内容透明度

- 接入 text-default/disable/loading、icon-default/disable/loading、loadingIcon-loading 共 7 个组件 Token。移除整体 disabled opacity，避免与加载文字叠乘；表面保持自身颜色。loading 与 disabled 同时存在时使用 loading 内容透明度。
- 旧 `--button-disabled-opacity`、`--button-loading-opacity` 显式值仍优先作用于对应状态的文字和图标。移除其全局默认，避免遮蔽新 Token。Link 的旧回退保持引用基础 disable 透明度，未将其误迁移到 Button Token。
- `content-opacity-tokens` 实测默认正常内容 1，禁用文字/图标 0.55，加载文字/图标 0.6、指示器 1；所有按钮根与表面 opacity 均为 1。
- 独立覆盖实测：正常文字/图标 0.8/0.7，禁用 0.4/0.3，加载 0.25/0.2、指示器 0.9；同时 disabled+loading 保持相同加载结果。无重复乘算。
- 本轮只验证当前亮色状态矩阵，不将其当作完整三轴或 Figma 回写验收。
- 旧覆盖另测：禁用内容 0.45、加载内容 0.35，根/表面/加载指示器保持 1；截图与控制台检查通过。两项 Button SSR 回归及 UI 类型检查通过，tokens 构建通过。

## Rounded 与 asChild 后续进度

- 四档 rounded/radius 接入，通过类名选择，不依赖普通按钮专有的 DOM；iconOnly 和 asChild 同样可消费。增加可选 `--button-rounded-radius` 显式覆盖入口。
- asChild 的 Slot 补齐 data-size、data-icon-only 与 aria-busy。此前缺失 data-size 导致所有子元素使用 regular 尺寸。
- `rounded-component-tokens` 浏览器实测：四档组件圆角覆盖均为 12px；链接按钮 padding 分别 2/4、4/6、6/10、8/14px，data-size 与请求一致。iconOnly 四档方形边长为 24/32/36/40px（当前密度）。
- 发现标准数据冲突：tiny rounded/radius 引用 `border-radius/border-radius-extra-small 2`（6px），其他三档引用 allround（99px）。当前消费忠实输出 6/99/99/99px，已通过 Ask 请求决定；尚未修改标准数据，不将此差异标为解决。
- 截图暴露 asChild 原先缺少 surface 与 Typography，导致白色链接没有背景，tiny 高度也不一致。现保留子元素及其属性并将原内容放入标准 Button 内层，同时修复自定义链接组件误判 iconOnly 的问题。
- 浏览器复验：链接均出现 primary 背景，四档高度 24/32/36/40px 与普通按钮一致，12px 圆角覆盖仍生效；点击 tiny link 后 URL 正确进入原 href 的 hash。两项 SSR 回归测试通过，验证链接属性保留、单层 anchor、视觉结构及自定义链接不误判。

## Primary 仅图标布局（2026-09-21）

只读核对 Figma 155:1328、155:1332、155:1336、155:1340：四档外层 x 内边距、图标容器宽高及 tiny/small/regular 内部 x 留白，共 15 个组件 Token 已接入。y 内边距继续共用对应尺寸 padding-y。big 容器内部没有额外留白，零值属于布局结构。图标默认大小由容器内容区计算，显式图标尺寸和旧尺寸/高度覆盖继续有效。

PrimaryIconOnlyTokens 浏览器证据（当前 Mobile Friendly）：tiny/small/regular/big 基线分别 24/32/36/42px 方形；加载态同尺寸，原图标隐藏并保留布局，加载环居中。覆盖容器 30×34px、外层 x=9px、内部 x=3px（big=0）后，外框宽均为 48px，高分别为 38/42/46/50px；旧尺寸高度覆盖 48px 时四档均为 48px 方形。截图排布正常，无浏览器错误。Token 包构建、五个工作区直接 typecheck 均通过；根 Turbo typecheck 因本机 NVM pnpm.exe 启动失败，已通过 pnpm.cmd 直接执行各包相同检查。

尚未完成：其他颜色变体的仅图标尺寸、完整模式矩阵、显式尺寸回归。Figma outline（1864:35854 等）的固定外框小于 x 内边距加图标总宽，已通过 Ask 提交处理选项，未擅自改变设计语义。上述主按钮实现不能视为所有 Button 完成迁移。

## 无背景仅图标迁移及八模式回归（2026-09-21）

只读检查 noBackground 155:1376/1380/1384/1388 与 noBackgroundCustom 155:1392/1396/1400/1404：外层 x/y 内边距、图标容器宽高、内部 x 留白均与 primary 引用相同 Token。共享消费规则现已覆盖这三种模式，未扩展到存在尺寸冲突的 outline 或尚待确认语义对应的其他模式。

新增 ProjectIconOnly 独立标准项目示例，实际浏览器切换 Light/Dark × Default/Mobile Friendly × ON/OFF 全部八种组合。三种模式四档默认及加载外框尺寸完全一致：Default 为 20/26/30/38px，Mobile Friendly 为 24/32/36/42px。默认图标尺寸分别 14/14/16/22px 和 18/20/22/26px。显式 caption/biggerSize=false 图标保持 16px；旧图标覆盖 19px 与旧高度覆盖 48px 在全部组合中有效。该检查证明布局与覆盖，不等同于所有 hover/active 颜色及阴影验收。

Token 包构建、五工作区 typecheck 通过。全组件与 Button 的其余待办继续保留。

## Icon 行高对齐与仅图标按钮（2026-09-21）

按用户确认的新规则，Icon 提供 off / heightOnly / both，both 的外层宽高共同引用对应 Typography 行高，内部图形尺寸独立。Button 所有 mode 的 iconOnly 使用相同 IconFrame，默认横纵 padding 共同引用该尺寸的 padding-y；旧 iconOnly 几何批次由此规则取代。显式高度和 icon-only-padding-x/y 仍可覆盖，普通文字按钮保留原 x/y。

Storybook IconLineBox 实测 9 个 mode × 4 个尺寸 × 普通/加载态（72 个 iconOnly）均为正方形，与相邻文字按钮等高，加载态不改变外框。此证据覆盖当前主题，未运行完整主题矩阵。图标包 ESM/CJS/类型构建、Storybook 类型检查和 CSS 构建通过。

mode=default 背景仍走旧兼容层：默认 lightbackground-1，hover 和 active 当前共同引用 filled-hover → lightbackground-2。本次未改色彩语义。

## Figma mode 命名与颜色迁移（2026-09-21）

用户确认公开 mode 使用 Figma 命名并兼容旧名。新增 secondary / tertiary / tertiaryCustom，second / default / defaultCustom 为同实现别名；替代此前待决定状态。三组默认/hover/active 背景、文字、图标及内阴影均消费组件 Token。旧全局默认移入 _legacy，调用者显式旧覆盖仍优先；Tab 等未完成迁移消费者补齐旧值回退。

tertiary 背景链为 button/color/tertiary/background-{default,hover,active} → control/neutral-tertiary-background-*；默认不透明，hover 70%、active 90%，不合并交互值。浏览器确认三组新旧名称的默认背景/文字/阴影一致，运行时 hover/active 引用分别保留透明度。图标包构建、Storybook 类型检查、CSS 构建和 changelog 配对通过；未执行全主题交互矩阵。

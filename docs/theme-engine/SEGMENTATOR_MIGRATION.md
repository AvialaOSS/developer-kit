# Segmentator 迁移记录

## 2026-09-24 当前 Nested 阴影复核

用户已确认对齐16px并接入效果开关，以下旧待决描述已解决。Figma新增6变量（2837:1960–1965），8个选中变体绑定组件颜色、offsetX/Y、radius与spread；原共享效果样式未修改，仅这些组件使用局部绑定。实际返回值与节点ID记录在 segmentator-shadow-figma-20260924.json。

Engine修订14新增效果源 shadow/segmentator-nested（ON黑色6%，OFF透明）及5项组件阴影Token，并将真实Figma ID纳入适配映射。Web移除会遮蔽新Token的全局segmentator-shadow-selected默认，显式旧覆盖仍优先。八种模式解析验证16px与ON/OFF正确，7项默认主题/静态CSS/包入口测试通过。ThemeCat本地基础版本0.1.5，旧0.1.4保留；既有主题通过升级审阅选择跟进。浏览器全状态及触摸回归仍暂缓。

API 只读核对 Basic Input 页 Self/SegmentatorButton（150:330）的全部16个 Nested 变体。8个 Status=ON 变体均使用同一效果样式 S:26bb7507e6e82678bd988bd86ffd8342f2e5b106：DROP_SHADOW，offset 0/4、radius16、spread0、黑色 alpha约0.06，效果属性无变量绑定；其余8个 Status=OFF 变体无效果。圆角、IconOnly 和可用性不改变这组规则。

Web 在 components.css 与 basic-input-effects.css 中仍将 segmentator-shadow-selected 定义为 0 4px 8px 黑色6%，并由选中滑块消费。因此不仅效果 OFF 失效，模糊半径也与当前设计源存在差异。已向用户展示数值并通过 Ask 确认：对齐16px后接入组件Token和效果开关，或对齐16px但保持常显。尚未得到新决定，没有修改设计语义。

## 已实施：Group 轨道

- `basic-input-effects.css` 直接消费全部 14 个 segmentatorGroup Token：nested/tiled 的 x/y padding、gap、default/rounded radius，以及 nested default/hover/active 和 tiled default 背景。
- 移除 `components.css` 与 `basic-input-effects.css` 中 5 个旧全局默认定义，避免这些值始终压过新 Token；消费端仍允许显式设置旧 padding/gap/radius、nested default/hover 背景覆盖。新增 active 背景也提供旧风格覆盖入口。
- 不修改标准项目里的 Figma 语义值。SegmentatorButton、阴影、动效及最小宽度尚未迁移，不能视为整个组件完成。

## 本轮验证

- tokens 构建通过；工作区 5 个项目的类型检查全部通过；Segmentator 类名与 CSS 双向检查无差异。
- Storybook `basic-input-segmentator--tiled`：实际 gap 6px、padding 0px、radius 10px、透明背景；原共用 gap 默认已不存在。点击“看板”后 radio 选中状态从列表切换到看板，控制台没有 error/warn。
- Storybook `basic-input-segmentator--nested`：实际 gap 4px、padding 2px、radius 8px、背景 rgb(240,239,239)；与当前标准 Token 相符，旧全局背景默认不存在。
- 浏览器窗口 1280×720，页面非空且无框架错误遮罩。当前仅验证默认亮色，三轴组合、局部覆盖优先级、rounded、hover/active 以及触摸/竖向回归仍需补齐。

## Button 本轮进度

- 文字颜色、默认/禁用内容透明度、普通按钮 x/y padding 与 gap、nested/tiled 选中滑块背景、未选中 default/hover/active 背景、selected/unselected/rounded 圆角已接入组件 Token。移除会覆盖这些 Token 的旧全局默认值，保留消费端已有专属覆盖入口。
- 禁用内容原先容器与文字/图标各应用 0.55，实际叠乘；现仅在 content 层应用一次组件透明度。新增 DisabledContent 故事验证两个 mode。
- 浏览器读值：普通内容 opacity=1；禁用内容 opacity=0.55，外层/文字/图标 opacity 均为 1。nested padding=4px 6px、tiled=6px 10px，gap 均为 6px。nested 未选中 radius=8px、选中=6px；tiled 为 8px。选中背景 nested 白色、tiled rgb(255,198,182)。点击可用项可切换 radio 状态，控制台无 error/warn。
- tokens 构建、7 项 Segmentator 逻辑测试通过。首次并行 typecheck 出现 playground 进程异常退出，无 TypeScript 诊断；顺序重跑全部 5 个项目成功。
- 图标与 iconOnly 尺寸、阴影和完整模式/局部覆盖回归仍未完成。nested 阴影缺少组件 Token 的处理已通过 Ask 请求用户决定；未收到决定前保留现有实现，不视为已迁移。
- 后续已接入普通图标容器 width/height 以及 iconOnly 容器 width、图标 padding-x、按钮 padding-x。通过 data-icon-only 区分；保留旧 icon-slot-height 覆盖，字体指标未改为组件 Token。浏览器当前移动密度下 nested iconOnly 容器 24×24px、图形 20px、内部横向 padding 1px、按钮 padding 4px；与本模式解析值相符。tokens 再构建与 UI 类型检查通过。图标全部模式回归仍待完成。
- tiled 阴影的颜色、偏移、模糊与扩散已接入 5 个组件 Token，保留旧 shadow-tiled 覆盖。浏览器实际输出 `rgba(0,0,0,0.04) 0px -0.5px 0px 0px inset`；tokens 构建通过。此时 14 个 Group 和 41 个 Button Token 均有消费引用，但这不等于全部变体/模式验收完成，nested 手写阴影与算法参数仍单独待决。

## 模式与覆盖浏览器验证

新增 `segmentator-project.stories.tsx`，使用完整标准项目的局部 ThemeProvider，展示 nested/tiled × baseline/canonical/legacy/both。

- 已操作 Light/Dark × Default/Mobile Friendly × ON/OFF 八种组合，nested/tiled 各读取轨道、选中背景、文字、字号、图标尺寸、阴影。字号 14→18px，图标容器 16×18→20×24px。颜色按本地模式切换，外层 html 保持 light。
- tiled 阴影 ON 为 alpha 0.04，OFF 为 0；nested 现存手写阴影一直 alpha 0.06，明确列为待决差异，未声明已解决。
- 新 Token 覆盖时两个 mode 的 group gap 均 13px、选中文字 rgb(10,80,160)；旧入口覆盖 gap 17px、文字 rgb(120,30,90)；两者同时存在旧入口优先。关闭覆盖后所有组恢复各自模式的基础间距/文字。
- nested 使用 ArrowRight 从文字项切换到 iconOnly 设置项，aria-checked=true；禁用项仍 disabled。1280×720 页面无空白、无渲染遮罩，截图确认暗色仅在本地容器内。
- 新增故事最初触发 Storybook importer 缓存错误；重启已确认运行的预览进程后恢复，重跑无新增 error/warn。UI 类型检查通过。

## 尚未完成

1. nested 选中阴影及动画参数中无对应组件 Token 的项目，等待语义确认。
2. rounded、竖向、鼠标 hover/active、触摸拖拽与组合消费者（DatePicker/Video）回归；目前不将整个 Segmentator 标记完成。

## 后续组合回归（2026-09-21）

- rounded / vertical 示例已检查：nested 文字组宽 104px、选中项与滑块均 100px；tiled 均 108px；iconOnly nested 组宽 46px、选中项与滑块均 42px。rounded 组、选中项、滑块均 99px 圆角。ArrowDown 可切换到“看板”。
- DatePicker 日期/时间切换可用，底部组宽 280px，选中项与滑块均 136px。
- 排查时间显示异常确认是原 DatePicker 的独立默认时间 17:00 覆盖 Date 的时分，并非 Segmentator Token 或滚动引起。修复后未单独配置时间时跟随 Date，显式时间配置继续优先。
- 浏览器 `with-time-open-on-time-panel` 初始 14:30，回调计数 0；小时和分钟各按一次 ArrowDown 后为 15:35、计数 2；外部设置 Date 为 09:45 后输入框和重新打开的时间轮均显示 09:45，小时/分钟滚动位置分别 1188/756px。输入框失焦提交会增加回调计数，未将其解释为时间轮初始化回调。
- `time-source-precedence` 实际显示：Date 14:30；显式 defaultTimeValue 10:15；显式 timeValue 11:20；范围起点时间 08:25。控制台无 error/warn，截图非空且无错误遮罩。日期工具 52 项测试与 UI 类型检查通过；这些纯函数测试不替代上述浏览器验收。
- hover/active、触摸、Video 及 nested 阴影决策仍未完成，不据此宣称全组件迁移完成。
- DatePicker 修复后的 UI 完整构建（含类型声明、样式、属性文档与 changelog 汇总）以及工作区 5 个项目的顺序类型检查均通过。

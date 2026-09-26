# Tag 迁移记录

状态：基础颜色、描边、圆角和间距已接入；未完成结构与状态验收。

## 设计依据

只读检查 Figma Information Display Tag 617:55892（16 个变体），详细核对 617:55918、617:56445、617:56038、617:56393。

外层用于 LineHeightFix 对齐 padding，内层 Badge 承担背景、描边、圆角、内容 gap/padding。当前 Web 只有一层；不能把两层 padding 简单混为同一属性。

本轮接入 background-default、border-default、radius、stroke-width、gap、caption/text 的各自 text-default 和 icon-default。人物标签与文字标签均绑定 tag/size/gap，已移除 Web 人物标签局部 2px 默认值。显式旧颜色、圆角和 gap 覆盖仍优先。

## 浏览器验证

ProjectModes：2 level × 2 content × 2 disabled，共八变体，切换亮暗/密度/效果八组合，共 64 实例。

- 亮色背景白，边框 rgb(249,248,248)；暗色背景黑，边框 rgb(18,18,18)。
- Caption 文字和图标亮色 rgb(97,96,96)，暗色 rgb(142,142,142)；Text 文字 rgb(38,37,37) → rgb(213,213,213)，图标仍独立使用 Caption 色。
- 所有组合描边 1px、圆角 6px、gap 4px，模式解析无空值。
- Docs 类型检查通过。

## 剩余项

- 禁用态作用层级已修正，见下方补充验证；完整模式回归仍待结构迁移后进行。
- 外层对齐与内层 padding 已拆分；图标宽度/容器高度及关闭图标上下 padding 已接入，见下方。
- 旧覆盖浏览器回归、关闭交互完整验收及消费者回归仍待完成。当前矩阵没有覆盖 LineHeightFix OFF。

## 内容透明度补充

只读核对 People disabled 的 617:56451 与 617:56475：根、Badge 和 Avata opacity=1，文字及关闭图标绑定 tag/transparency/disabled=.55。

已将透明度从整标签移到直接文字、图标、关闭按钮节点；正常值由 tag-transparency-normal 控制，禁用值优先旧 tag-disabled-opacity、其次 tag-transparency-disabled。注意旧值现在也仅作用于内容，这是对齐设计的行为修正；显式给根 style.opacity 仍按原生 CSS 对整标签生效。

OpacityOverrides 浏览器证据：normal=.8、disabled=.25 时三个内容节点分别取值；根始终 1，People 头像始终 1；旧覆盖 .4 优先于新值 .25。禁用关闭按钮仍 disabled=true。Docs 类型检查与 CSS 构建通过。

## 图标几何与键盘关闭

左右及关闭图标宽度接入 tag-size-icon-width，容器高度接入 tag-size-icon-container-height，关闭按钮上下 padding 接入 tag-size-close-icon-padding-y。移除局部 tag-icon-slot-height 默认值，显式旧覆盖仍优先；不再按文字级别推断不同图标尺寸。

ProjectModes 测量八个关闭按钮：Default 按钮 14×16、图标 14×14，Mobile Friendly 按钮 18×20、图标 18×18，上下 padding 均 1。普通 DOM 图标和自定义尺寸覆盖仍待检查。

CloseInForm 浏览器验证：Enter 和 Space 分别触发一次关闭，提交次数保持 0；Tab 跳过禁用关闭按钮到提交按钮，Enter 提交后次数为 1。Docs 类型检查、UI 构建通过。尚未完成完整 RTL/消费者回归。

## 内外布局拆分

再次读取 Figma 617:55919/56039，Badge 的描边为 OUTSIDE，布局高度 16/18，不包含描边。实现新增内层 aviala-tag__surface 承载背景、外描边、内容间距与内 padding；外层保留 ref、className、属性和事件，只负责对齐 padding。使用 outline 表达不占布局的外描边，原生根 style 仍作用于外层，使用者直接给根加背景/边框的场景需留意层级变化。

16 变体 × 八模式重新验证（示例使用 items-center 防止父 flex 拉伸掩盖 OFF 高度）：Default 下 Caption OFF/ON 高度 16/18，Text OFF/ON 高度 18/20；Mobile Friendly 分别为 20/22、24/26。内层透明度选择器随结构调整，禁用根为 1、内容为 .55。

PaddingOverrides：外层 9px 7px 与内层 3px 11px 独立生效；旧 tag-px=5 只改变内层横向值；关闭外层对齐后外层为 0、内层保持 3px 11px。旧全局 tag-px 默认值不再遮蔽 Text 级别自己的 4px Token。

结构变更后的键盘关闭重测、消费者、RTL、外描边裁切边界仍需继续验收。

## 结构变更后回归

CloseInForm 增加方向切换。LTR 下 Enter/Space 后关闭次数 2、提交次数 0；切换 RTL 再执行二者后关闭次数 4、提交次数仍 0。RTL 中关闭按钮位于文字左侧；Tab 跳过禁用关闭按钮，焦点到提交按钮。禁用按钮 disabled=true。

重新搜索 packages/ui/src 与 apps 的非 stories/test TSX，没有其他生产组件直接消费 Tag/TagClose（仅 Tag 自身创建 TagClose）；不能将 Avatar 示例中的组合称为生产消费者覆盖。外描边裁切边界、普通 DOM 自定义图标和跨浏览器仍待确认。本轮 Docs 类型检查通过。

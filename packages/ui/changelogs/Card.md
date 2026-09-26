# Card

## [Unreleased]

### Changed

- 头尾 action 区域复用公共 ButtonGroup，保留原按钮顺序及 card-trailing-gap 覆盖。

### Added

- CardHead 与 CardBottom 增加可选 heading 行，使用共享 Title 字体等级和各自 heading-default 颜色 Token，保留 title、description 与旧 card-fg 覆盖。

- CardBottom 支持可选 title、description 和 icon，分别消费底部标题区布局、文字和图标 Token；不传入时保持原有操作区结构。

### Changed

- action 操作区按 Figma 拆出按钮组与按钮插槽，内部间距消费 buttonGroup Token；select 变体支持同时显示传入的动作按钮，头部在选择器前、底部在选择器后。
- 标题区、头部操作区与底部操作区分别消费独立间距和内边距 Token；自定义 trailing 也使用操作区容器，显式旧布局变量仍优先。
- 标题、描述、图标和分隔线使用各区域组件 Token，图标容器随密度调整，文字指标继续共用 Typography。
- Card 外层与内容区接入独立布局 Token；标题、内容、底部使用各自背景和圆角 Token，正文颜色支持组件级覆盖，保留显式旧变量。

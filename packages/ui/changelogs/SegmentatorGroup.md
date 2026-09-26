# SegmentatorGroup

## [Unreleased]

### Fixed

- Nested 选中阴影对齐 Figma 的 16px 模糊半径，消费组件阴影 Token 并跟随效果 ON/OFF；显式 segmentator-shadow-selected 覆盖继续优先。

### Changed

- 按 nested / tiled 与选中状态消费组件文字颜色 Token；禁用时仅对内容应用一次组件透明度，避免容器与文字/图标重复变淡。字号、行高与字重仍使用共享 Typography。
- 按钮背景、横纵内边距、间距与选中/未选中/圆形圆角使用组件 Token，保留对应的旧专属覆盖入口。
- 图标容器及 iconOnly 的宽高、横向内边距分别消费组件 Token，避免普通按钮与纯图标按钮共用尺寸规则。

- nested / tiled 轨道的间距、横纵内边距、圆角和背景改为消费各自的组件 Token；nested 的 Hover / Active 背景跟随对应状态 Token。
- 保留旧 group padding / gap / radius 和 nested 背景自定义覆盖入口，移除会遮蔽新 Token 的全局默认定义。

## 3.0.0

### Added
- 键盘操作对齐 radiogroup 规范：方向键（horizontal 用 Left/Right，vertical 用 Up/Down，RTL 自动镜像）在项之间移动并同步选中，Home/End 跳到首尾

### Changed
- 改为 roving tabindex：仅选中项参与 Tab 序列（未选中时由首个可用项接管），进入分段控件后用方向键切换

## 2.8.0

### Fixed
- 指示器改用布局 offset 测量，避免 Popover 入场 `scale` 让 `getBoundingClientRect` 叠乘导致拇指偏移（点选后才复位）

## 2.7.0

### Changed
- nested 模式轨道 Hover 使用 `segmentator-bg-hover`（filled-hover）；项级 Hover/Active 仍独立
- 共享 elevation `BasicShadow-Level4WithLine` 发丝线透明度调整为 18%

## 2.6.1

### Changed
- 未选项 Hover/Active 使用共享 filled 交互 token

### Fixed
- nested 模式下未选项圆角改为与滑动指示器一致（`segmentator-item-nested-radius`），避免 hover / focus 填充与选中拇指圆角不一致

## 2.6.0

### Added
- `direction`：`horizontal`（默认）/ `vertical`，对齐 Figma SegmentatorGroup；竖向布局下拇指与触控拖选沿主轴（Y）工作

## 2.5.0

### Changed
- 内容超出容器时支持横向滚动（隐藏滚动条，触控板 / 触控仍可滑动）
- `equalWidth` 项以 `max-content` 为最小宽度，避免均分过窄裁切文案
- 溢出时触控横滑优先滚动并暂停段间拖选（点击切换仍可用）；选中项自动滚入可视区域，滑动拇指随 `scrollLeft` 同步

## 2.1.0

### Changed
- 拖拽预览改为命令式 DOM 切换，避免逐项 React 重渲染

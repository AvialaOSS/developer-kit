# Checkbox

## 3.1.0

### Changed

- 三态两档 x/y 内边距接入组件 Token，保留 Figma 固定标记居中布局；CheckboxInput 正文/说明颜色和禁用文字透明度可独立覆盖。

- 三态的默认/禁用背景、边框、勾选与半选颜色、高光及阴影颜色消费组件 Token；禁用仅降低内部标记透明度，背景保持设计色。

- default/huge 外框尺寸、默认/圆形圆角及半选标记圆角接入组件 Token，保留原尺寸覆盖。
- CheckboxInput 图标容器高度与间距、CheckboxGroup 横纵方向间距支持组件 Token 独立配置。

## 2.7.0

### Fixed
- 半选（`indeterminate`）时内部标记未居中：勾选 SVG 在 `opacity: 0` 下仍占 flex 布局宽度，现改为半选态隐藏勾选图标并将 indicator 绝对铺满

## 2.5.0

### Added
- `size="huge"`：对应 Figma Checkbox `Size=Huge`（26px / `--size-large`，圆角 `--border-radius-small`，勾选与半选标记 14px，勾选描边 2px）

### Changed
- 勾选图标改用 Figma `symbol_right` Black 描边动效：打钩 / 取消均为 300ms CSS transition（可中途打断），`vector-effect: non-scaling-stroke` 保持线宽
- 取消勾选时橙色表面与灰色底交叉淡入淡出，避免背景硬切
- 非圆角 Checkbox 圆角改为 `--border-radius-extra-small-2`（6px）

### Fixed
- Huge 尺寸下勾选路径画不全：`stroke-dasharray` / `stroke-dashoffset` 按 `iconSize / 12` 换算，避免 CSS 将无单位 `1` 解析为 `1px` 导致路径短一截

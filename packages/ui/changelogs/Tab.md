# Tab

## [Unreleased]

### Changed

- Card 选中态的图标宽度、容器高度以及图标/文字颜色分别接入组件 Token，图标尺寸旧覆盖入口继续有效。

- 指示器宽、高、圆角及颜色接入组件 Token，默认固定宽度居中；显式旧 inset 配置继续使用随按钮宽度计算的兼容行为。

- TabItem 各样式及 Card 选中态分别消费布局 Token，Card 内容背景和上下圆角可独立覆盖；附件槽与指示区底部留白分离。

- Default、Tiled、Card 的根间距、留白与背景分别接入组件 Token，保留显式旧覆盖；Card 附件槽恢复设计中的底部留白。

## 2.6.1

### Changed
- Tiled active Hover/Active 改为 second 面 token 换色

## 2.6.0

### Added

- `Tab` / `TabItem`（Figma Structure Navigation → Tab）
  - `style`：`default` | `card` | `tiled`
  - `background`：`none` | `default`
  - `startSlot` / `endSlot`；受控 / 非受控 `value`；键盘左右切换
  - Default：滑动下划线指示条（高 4px、顶圆角 `border-radius-extra-small-2`、相对 TabItem 左右各内缩 12px；item / slot `padding-bottom` 为 `padding-small`）
  - Card：active 白底顶圆角 + 稿面 2×8 侧翼矢量；`background="default"` 使用 `control-normal-lightBackground-1` 灰底；未选中水平 `padding-min`
  - Tiled：active 使用 Button `second` 表面
  - `TabItem` 复用 `buttonVariants`（对齐 Figma 嵌套 Button / NavigationItem）
  - 列表内容 hug 宽度（`inline-flex` / `width: max-content`）
  - tokens：`@aviala-design/tokens/tab-effects.css`

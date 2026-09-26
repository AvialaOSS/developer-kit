# Popover

## [Unreleased]

### Changed

- 新增 PopoverIcon 内容插槽，消费普通／主题图标颜色及尺寸 Token；tooltip 外观使用自身图标 Token。

- tooltip 外观默认使用共享 Text 字级，与 Tooltip 一致；显式 level="caption" 保持有效。

- 默认和主题指针按 Figma 使用 14×5 曲线及组件尺寸 Token，支持动态调整；移除默认描边，显式旧边框颜色以外轮廓保留，不占布局空间。
- 外层与内容 Slot 分别消费布局 Token；旧 px/py 覆盖作用于内容 Slot，flush 同时移除两层内边距。
- 默认与主题外观使用独立背景、文字、圆角和阴影 Token；默认两层阴影，主题外观一层，保留显式 popover-content 覆盖。
- tooltip 外观与桌面 Tooltip 共用组件级颜色、尺寸和阴影 Token；保留显式旧变量覆盖，指针尺寸参与动态定位。

### Fixed

- 默认及主题面板的最大宽度遵循可用空间，长路径自动换行，避免在窄屏撑出视口。
- 修正 tooltip 外观覆盖 flush 内边距清除规则的问题。
- tooltip 外观的长内容宽度遵循可用空间，支持长路径换行。

## 2.8.0

### Fixed
- 箭头 outline 路径恢复填充（去掉 `fill: none`），与面板底色一致，描边仍保留
- 浮层 Portal 挂到全屏元素或 Modal 容器，避免全屏 / 对话框内看不见、点不到

## 2.6.1

### Changed
- 浮层阴影统一为 `BasicShadow-Level4WithLine`

## 2.5.0

### Added
- `PopoverContent` 支持 `level`（`"caption"` | `"text"`）；未传时：`appearance="tooltip"` 默认为 `caption`，其余外观默认为 `text`

## 2.2.0

### Added
- `appearance` 变体：`tooltip`（反色提示皮肤）、`primary`（品牌主色表面、白字）

## 2.1.0

### Added
- `HoverPopover`：桌面悬停/焦点打开，触摸降级为点按；复用箭头、表面与动画
- 内容支持 `flush`（无内边距）

### Changed
- 进出场动画改为方向感知（自触发点缩放 + 淡入淡出）；箭头跟随各边
- 键盘打开时焦点移入内容，关闭后归还触发器

### Fixed
- 修复需按两次 Escape 才能关闭（移除吞掉首次关闭的 window-blur 抑制）

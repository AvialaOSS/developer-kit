# Tooltip

## [Unreleased]

### Changed

- ResponsiveTooltip 默认字级同步为 Text，保持桌面悬浮与触屏长按提示的字体规格一致，显式 Caption 仍可使用。

- 默认字体级别按 Figma 调整为 Text；可显式设置 level="caption" 保留紧凑字号。可选前后图标及内容间距消费独立组件 Token。

- 箭头宽高接入组件 Token，并将 SVG ref 转交定位层，使运行时尺寸变化能重新计算浮层位置。
- 表面颜色、文字、圆角、内边距和两层阴影接入组件 Token，箭头独立消费指针颜色；保留显式旧 CSS 覆盖。

### Fixed

- 长路径支持换行，气泡最大宽度遵循定位层可用空间，避免窄屏下超出视口。
- 修正气泡背景误用指针颜色 Token，支持分别调整表面与指针颜色。
- 修正共享文字规则对 Tooltip 前景色的覆盖，避免暗色主题下出现白底白字。

## 2.8.0

### Fixed
- Portal 挂到全屏元素或 Modal 容器，避免被对话框遮罩挡住

## 2.6.0

### Changed
- `ResponsiveTooltip` 触摸端改为**长按**打开（短按仍触发按钮自身点击）；可用 `longPressMs` 调整按住时长（默认 500ms）

## 2.5.0

### Added
- `TooltipContent` / `ResponsiveTooltip` 支持 `level`：`"caption"`（默认）或 `"text"`

## 2.2.0

### Changed
- `ResponsiveTooltip` 在触摸设备上保持 tooltip 外观，不再显示浅色 popover 面板

## 2.1.0

### Added
- `ResponsiveTooltip`：桌面为 Tooltip（悬停 + 键盘焦点），触摸自动切为 Popover（点按）

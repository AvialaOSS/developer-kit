# Pagination

## [Unreleased]

### Fixed

- 窄容器中页码过多时限制翻页区宽度，页码在内部滚动，避免挤出上一页与下一页按钮。

### Changed

- 页码采用 Tiled Segmentator 的组件样式和 Token，选中态支持独立背景、文字、圆角与阴影，保留分页按钮语义及显式旧覆盖。
- 容器、翻页按钮区、跳页区与每页条数区接入独立间距 Token，标签消费组件文字颜色；显式旧间距覆盖仍优先。

## 2.6.0

### Changed
- 默认文案改由 `LocaleProvider` 字典提供（`jumpLabel` / `sizeLabel` 等 props 仍可覆盖）

### Fixed
- 上一页 / 下一页箭头在 RTL 下随阅读方向翻转

## 2.1.0

### Changed
- 省略号打开页码跳转 Popover

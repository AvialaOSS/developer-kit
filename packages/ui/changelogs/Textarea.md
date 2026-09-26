# Textarea

## [Unreleased]

### Changed
- 底部计数与拖拽区接入 Controller 的8项Token，支持独立文字/图标颜色及尺寸；文字区预留空间随控制区高度变化，避免遮挡末行。
- 外框圆角、两档 padding/gap、文字区与图标插槽、背景/文字/图标/焦点描边和阴影接入 Textarea 组件 Token；保留旧覆盖入口。

### Fixed
- 禁用文字按 Figma 内容层与文字层叠加透明度；图标保留内容层透明度，计数与拖拽控制区独立保持不透明，消费 Textarea 组件 Token。
- 共享输入框悬浮背景在局部主题中重新解析，保留显式 input-bg-hover 覆盖。
- 修复共享 Typography 颜色覆盖组件文字颜色及旧 input-fg 的问题。
- 共享输入行高与图标插槽默认高度在局部主题中解析。

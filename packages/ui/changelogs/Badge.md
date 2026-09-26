# Badge

## [Unreleased]

### Changed
- 分离外层行高留白与内层彩色表面，接入背景、内外层 x/y 内边距、圆角、间距及图标尺寸 Token；保留 caption OFF/normal 圆角与 text warning 间距差异。
- 六种配色的 primary/secondary 文字按 caption/text 独立消费组件 Token。
- 图标消费独立组件颜色，不再默认继承文字配色；支持 badge-icon-fg 覆盖，显式 badge-fg 仍可统一覆盖文字与图标。

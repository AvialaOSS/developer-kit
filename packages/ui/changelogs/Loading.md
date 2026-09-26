# Loading

## [Unreleased]

### Changed
- 渐变分别消费组件起止色；lineHeightFix 新增 heightOnly、both、off，继续支持布尔值，both 使用组件容器宽度。
- 七档图标尺寸、对齐容器高度及环形描边消费组件 Token，保留显式 loading-icon-size 与 loading-ring-stroke 覆盖。

## 2.8.0

### Fixed
- 旋转环改为 SVG 2px stroke（Figma r15−r13，与 Progress 环形一致），避免 CSS mask 内沿发虚

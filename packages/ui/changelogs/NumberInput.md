# NumberInput

## [Unreleased]

### Fixed

- 禁用输入保持表面不透明，内容与文字按 Figma 图层分别消费组件透明度 Token，占位符不重复淡化。

### Fixed
- 共享输入框悬浮背景在局部主题中重新解析，保留显式 input-bg-hover 覆盖。

### Changed
- 步进按钮的横向 padding、半圆角及交互背景消费对应 Button Token；箭头按设计使用共享基础尺寸，移除人为偏移。
- 尺寸、图标、背景、文字、焦点描边及阴影消费 NumberInput 组件 Token，保留显式旧变量覆盖。
- 步进区域消费独立 gap 和纵向 padding，两个按钮均分剩余高度；大号内容纵向 padding 对齐设计。

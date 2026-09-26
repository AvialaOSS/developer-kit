# Link

## 3.1.0

### Changed

- caption/text 两档尺寸、两种模式的背景与文字/图标颜色接入组件 Token；图标容器与仅图标留白跟随设计变量，保留旧颜色覆盖。
- 禁用透明度仅作用于文字和图标，避免背景透明度叠乘。

### Fixed

- text 尺寸的 noBackgroundCustom 默认、悬浮和按下背景修正为与 Button 对应状态相同的语义引用，替换固定白色。
- asChild 复用图标与文字布局，禁用时移除子元素 href 与 Tab 焦点，阻止子元素点击处理器继续执行。

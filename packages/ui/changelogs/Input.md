# Input

## 3.1.0

### Fixed
- 禁用文本采用内容层 55% 与文字层 60% 的嵌套透明度，图标独立保持 90%，与 Figma 图层一致。
- 悬浮背景在当前输入框作用域解析组件 Token，避免局部亮暗主题继承根主题已解析的颜色；显式 input-bg-hover 覆盖仍优先。
- 悬浮背景接入 BaseInput background-hover 组件 Token，修复暗色主题落回亮色兼容变量的问题。
- 独立 ThemeProvider 切换密度时，输入文字行高跟随局部共享 Typography，不再继承外层主题已解析的旧行高。

### Changed
- 默认图标尺寸与插槽高度接入 BaseInput Token；显式图标 level/biggerSize 保留优先级。
- 默认、焦点、禁用背景与文字、图标、焦点边框及底部阴影接入组件 Token；支持独立 input-icon-fg 覆盖。
- 文本输入框的外层 padding、内容 padding、间距和圆角接入 BaseInput 组件 Token；显式旧尺寸覆盖继续生效，其他输入类组件保留旧默认值。

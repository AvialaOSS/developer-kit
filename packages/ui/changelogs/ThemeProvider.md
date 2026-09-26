# ThemeProvider

## [Unreleased]

### Added

- 支持通过 project 接入标准 Token 项目，亮暗、密度和效果模式独立切换。
- 支持 projectTarget 局部主题容器与 projectCssOptions 输出配置；卸载后恢复容器原有属性。
- useTheme 提供 effects、setEffects 与 isProjectTheme；项目值由传入项目管理，旧调色控件不会重写项目 Token。
- 默认动态主题也通过标准项目生成组件 Token；密度和效果设置同步到默认静态及动态主题。

### Fixed

- 局部projectTarget为弹出层提供默认挂载位置，使菜单继承当前项目Token；全屏和显式弹层容器保持优先。

- 默认主题切换仅清理自身写入的变量，保留使用者自定义属性，并在清理时恢复原值。
- 共享 Typography 在局部主题容器重新解析，避免继承外层已解析字号而使密度切换失效。

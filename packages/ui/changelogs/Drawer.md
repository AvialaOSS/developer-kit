# Drawer

## 3.1.0

### Changed

- 默认正文插槽和操作区插槽按设计补齐独立留白、间距；按钮间距与操作区外层间距分别消费 Token。

- 头部补齐内容区和关闭按钮插槽，接入独立间距、留白与图标尺寸；标题、说明及正文采用各自组件文字颜色，字体指标继续共用 Typography。

- 遮罩、四方向外边距、根容器圆角和边框、头部与内容/操作区的背景和留白接入组件 Token。
- 区分独立分区与 Drawer View 内的留白 Token，保留显式旧变量覆盖。

## 2.9.0

### Added
- 新增 `Drawer` 抽屉组件（对齐 Figma Components → Drawer）：支持 `position`（`left` / `right` / `top` / `bottom`），复合结构含 `DrawerHeader` / `DrawerHeaderText` / `DrawerBody` / `DrawerFooter`，遮罩与滑入退场动画；关闭文案由 `LocaleProvider` 提供

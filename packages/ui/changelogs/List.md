# List

## 3.1.0

### Added

- List、ListGroup、ListItemGroup 和 ListItem 支持 default/deep 外观，列表项默认继承所在组，也可独立覆盖。

### Changed

- ListItem 自身保持 0 圆角，移除首尾项圆角覆盖；内容顶部分隔线与尾部竖线 Default 使用 neutral-2、Deep 使用 neutral-3。

- 列表项只提供说明时保留说明颜色 Token，不再误用正文颜色；选中态覆盖规则保持不变。

- Action 尾部按 ButtonGroup、分隔线和箭头分层消费间距；更多按钮改用无底色样式，箭头跟随共享尺寸、行高和正文颜色。
- 普通前导图标跟随共享尺寸、行高与标题颜色 Token，保留旧尺寸和前景覆盖；补齐 ListItem 标题容器以消费独立间距及圆角。
- 带底形的前导图标消费 IconPlace 的尺寸、留白、圆角与颜色，字形大小跟随 Token；显式旧尺寸和颜色覆盖继续有效。
- 内容分隔线宽度、尾部竖线宽度及高度接入独立尺寸 Token，保留显式旧竖线高度覆盖。
- 列表背景、正文与说明消费组件 Token，显式旧背景及正文颜色覆盖继续有效。
- ListItem 的有图标／无图标留白、内容与图标区域间距、尾部操作间距接入独立 Token，保留显式旧布局覆盖。
- 列表容器和标题两层布局接入 List Token，支持独立留白、间距、圆角与标题颜色覆盖；显式旧变量优先。

### Fixed

- 点击或通过键盘激活行内按钮、开关等控件时，不再额外触发行点击回调；直接操作列表行仍正常响应。
- List 的 title 类型支持 ReactNode，不再与原生 HTML title 冲突。

## 3.0.0

### Fixed
- 可交互的 `ListItem`（传入 `onClick` 或 `interactive`）现在可以获得焦点：补上 `tabIndex`、`role="button"` 与 Enter / Space 触发，行内 Switch、Button、Select 等控件仍各自响应按键
- `disabled` 的可交互行标记 `aria-disabled`；`href` 链接行的行为保持不变

### Removed
- `ListItem` `actionLabel` 的 `Text` 默认值；未传 `actionLabel` 且未传 `action` 时不再渲染主操作按钮

## 2.6.2

### Fixed
- 行间顶部分割线与尾部竖向分隔线颜色对齐 Figma `border/border-normal-2`（此前误用 `border-normal-1`，中性色重调后几乎不可见）

## 2.6.1

### Changed
- 可交互行 Hover/Active 对齐共享 filled 交互 token（lightBackground-2 / Background-3）

## 2.6.0

### Changed
- 默认「更多」aria 文案改由 `LocaleProvider` 提供

### Fixed
- `action` 类型尾部 chevron 在 RTL 下指向阅读方向前方

## 2.4.0

### Added
- `ListItem` `showTrailing`：设为 `false`（或 `trailing={null}`）可隐藏尾部操作与竖向分隔线；`action` 类型仍显示 chevron
- `ListItem` `showChevron`：控制 `action` 行尾部 chevron 的显示
- `ListItem` `showTopDivider`：强制显示/隐藏内容行顶部分割线（默认：`ListGroup` 内首个子项隐藏）
- `ListItem` `href` / `target` / `rel`：将行渲染为导航链接

### Fixed
- `ListGroup` 内首个 `ListItem` 默认不再显示顶部分割线

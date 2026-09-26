# Navigation

## 3.1.0

### Changed

- 弹出菜单左右图标消费 SelectMenuItem 尺寸与颜色 Token；选中和普通项文字按设计使用正文 Token，仍允许显式旧选中文字覆盖。

- 弹出菜单表面、单组留白及菜单项尺寸/默认文字颜色接入 Select 系列组件 Token，保留原有平铺菜单结构。

- 品牌标题的间距、横纵留白、圆角与文字颜色接入组件 Token，保留显式品牌文字颜色覆盖。

- 选中背景、文字、主图标与内阴影消费新增 Navigation 组件 Token，背景采用已确认的 tertiary 语义；横向指示器使用独立宽高 Token（默认 50×2），纵向使用独立宽度 Token。

- 纵向子组间距、选中指示器颜色与圆角接入组件 Token；保留显式旧间距与指示器颜色覆盖。

- 横向品牌/导航/操作区、纵向导航项/子项/操作区分别接入布局 Token，保留旧导航项留白覆盖；子项起止缩进可独立调整。

- 横纵方向的根间距、留白、背景与分隔线接入独立组件 Token；纵向品牌区独立消费布局 Token，并保留显式旧覆盖。

## 2.8.0

### Fixed
- 菜单项悬浮背景在所在局部主题解析，共享 Select 的显式背景覆盖仍优先。
- 项菜单 Portal 挂到全屏元素或 Modal 容器，避免被对话框遮罩挡住或全屏后不可用

## 2.6.1

### Changed
- 激活项 second 面 Hover/Active 改为 token 换色（不再依赖 brightness）

## 2.6.0

### Fixed
- 垂直指示条读取 `--navigation-rail-inline-start`，RTL 下贴在 inline-start 侧
- 垂直 flyout 默认 `side` 随 `ConfigProvider` 方向翻转

## 2.5.0

### Changed
- 激活指示条与展开 / 收拢动效改用更干脆的 ease-out（`--navigation-transition-easing`: `cubic-bezier(0.16, 1, 0.3, 1)`；指示条脚本插值同步）

## 2.1.0

### Changed
- 垂直轨道在悬停/按下时伸展与收缩

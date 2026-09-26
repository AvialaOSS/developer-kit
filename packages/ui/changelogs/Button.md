# Button

## 3.1.0

### Changed

- tiny 尺寸的 allRound 圆角统一引用 99px 胶囊圆角，与其他尺寸及修正后的 Figma 一致。

- 新增 secondary / tertiary / tertiaryCustom mode，兼容 second / default / defaultCustom；背景三态、文字、图标和内阴影消费对应 Figma 组件 Token，保留旧变量显式覆盖。tertiary 的 Hover / Active 分别保留 70% / 90% 背景透明度。

- 仅图标按钮统一采用 Typography 行高作为图标外框宽高，默认横纵 padding 均跟随对应尺寸的纵向 Token；所有 mode 共用，加载态保持占位，保留显式尺寸覆盖。

- noBackground 与 noBackgroundCustom 的仅图标布局接入与 Figma 一致的组件尺寸 Token，加载态保持外框稳定。

- primary 仅图标按钮按组件 Token 设置外层内边距、图标容器宽高及内部留白，大号不再沿用文字按钮高度；保留旧高度显式覆盖。

- 四档普通按钮的 x/y 内边距、间距和默认圆角接入组件级 Token，保留原尺寸变量的显式覆盖能力。
- 四档 allRound 按钮消费对应 rounded/radius Token，支持独立覆盖；asChild 补齐尺寸与 iconOnly 属性，使子元素也能匹配尺寸样式。
- primary 的默认/悬停/按下背景、文字及图标颜色接入组件 Token，文字与图标可分别覆盖；保留旧 primary 颜色覆盖入口。
- primary 阴影参数及渐变端点接入组件 Token，跟随效果 ON/OFF；渐变保留 Figma 填充层的 20% 透明度及 0%/36% 色标位置。
- outline / outlineCustom / noBackground / noBackgroundCustom 接入各状态背景、文字和图标颜色；outline 描边颜色与厚度也消费组件 Token，支持按状态覆盖。
- 四档普通图标宽度与容器高度消费组件 Token，仍尊重显式图标 level/biggerSize 及旧尺寸覆盖。

### Fixed

- asChild 保留子元素属性并复用按钮的背景、文字、图标和加载层，修复 primary 链接只有白色文字而没有背景的问题。
- 禁用与加载透明度分别应用到文字、图标和加载指示器，避免整按钮透明度与内容透明度叠乘；背景保持自身颜色，支持独立组件 Token 覆盖。

## 2.6.1

### Changed
- Hover/Active 改为共享交互 token：Primary 悬停加深、按下变浅；Ghost 使用 neutral-3 → lightBackground-1；Default 使用 filled 1→2 阶

## 2.6.0

### Added
- `outline` / `outlineCustom` 模式（Figma `Mode=Outline` / `Outline-Custom`）：透明底 + `border-normal-primary` 外描边；主题色 / 中性色文字

## 2.1.0

### Added
- `compact` 变体（`min-w-0`）

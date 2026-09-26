# Tooltip 迁移记录

## 文字与可选图标补齐（2026-09-21）

实时读取 top `587:91991`：文字 `I581:91847;128:126` 为 14px / 18px，字号、行高、字重绑定共享基础变量；前后 Icons `581:91858` / `581:91848` 默认隐藏，绑定 icon-width 与 icon-container-height。Web 默认 level 从 caption 对齐为 text，显式 caption 仍支持。增加可选 leadingIcon/trailingIcon，默认不渲染；图标颜色和尺寸、表面 gap 消费对应组件 Token。文字内容单独包裹以保留长内容换行，图标从无障碍名称中排除。

本轮未改动 pointer padding 或效果语义。下方“可选图标与 Typography 尚待核对”为历史记录；当前新增 WithIcons 故事仍待真实浏览器验收，未使用此前的 Caption 截图充当本次通过证据。

状态：表面、文字、指针颜色与尺寸和阴影已接入；未完成整组件验收。

## 设计与实现

只读确认 Figma Information Display Tooltip 587:92012 的 12 个方向变体，详细读取 top 587:91991。气泡绑定 padding-x/y、radius、background-default；文字绑定 text-default；指针 588:55399 独立绑定 pointer-default、width/height。两层阴影均绑定 Tooltip effect Token。

本轮接入表面颜色、文字、圆角、padding、指针颜色、两层阴影完整参数。旧 tooltip-content-bg/fg/radius/px/py/shadow 显式覆盖仍优先，全局默认值不再遮蔽组件 Token。

## 验证与修复

ProjectModes 检查四个实际方向 × 八模式共 32 个浮层，局部 ThemeProvider 的 Portal 能正确继承主题。padding 4px 8px、radius 8px，两层阴影分别 offsetY 6/0、blur 18/1、alpha .08/.18。

首次浏览器矩阵发现暗色白底白字：typeface-effects 中直接给 Tooltip 表面的 Typography 规则仍使用白色 fallback。已将此规则也切换到 tooltip-color-text-default。修复背景与文字规则后重新执行四方向 × 八模式共 32 项检查：亮色背景黑/文字 rgb(254,253,253)，暗色背景白/文字 rgb(2,2,2)；默认密度指针 14×5，移动密度 18×5；padding 4px 8px、radius 8px 全部一致。效果 OFF 阴影仍存在，与当前标准项目字面值一致，效果语义仍待处理。

Docs 类型检查、UI 构建通过；CSS 构建包含文字规则修复。

## 指针与独立颜色补充验证

指针宽高消费组件 Token，SVG ref 传给 Radix 测量层。四方向从默认 14×5 改为 22×9 后，浮层与触发器间距增加约 4px；恢复主题后，移动密度下为 18×5。共享 OverlayPointer 的 Popover WithArrow 示例仍为 16×5，打开与 Escape 关闭通过。

发现并修复表面背景错误消费 pointer-default 的问题。ProjectModes 新增独立颜色覆盖：四方向实测表面 rgb(24,49,83)、指针 rgb(168,85,247)、文字白色，证明背景与指针可分别设置。CSS 构建与 Docs TypeScript 检查通过。

## 剩余项

长内容补充：新增 LongContent 故事，240px 视口中重现旧 max-width 240px 导致右边缘到 248px 的越界。表面 max-width 现取公开宽度上限与 Radix 可用宽度的较小值，并允许长路径任意断行；同视口实测宽 209px、右边缘 217px，无文字横向溢出。320/768px 视口实测宽 240px，均位于视口内且 scrollWidth 不超过 clientWidth。临时浏览器尺寸已恢复。这不覆盖超长内容的纵向滚动及触屏。

方位补充：ProjectModes 增加 12 方位、LTR/RTL 和触发器宽度切换。固定当前视口检查 12 方位 × 两种方向 × 两种指针尺寸，48 个浮层均在视口内。撑满网格的宽触发器配窄气泡时，top/end（22×9 时还有 top/start）指针被 Radix 隐藏；检查定位几何可见指针无法保持居中，保留其碰撞行为。改用内容宽度触发器后，22×9 在 LTR/RTL 各 12 个方位均可见。尚未覆盖屏幕角落、窄屏与滚动边界，不代表完整碰撞验收。

旧覆盖补充：同时启用组件颜色覆盖与旧覆盖，四方向确认旧 bg/fg/radius/px/py/shadow 优先，得到背景与箭头 rgb(52,86,120)、文字 rgb(254,220,186)、radius 13px、padding 7px 11px、shadow none。已保留可重复操作的 Storybook 开关。此检查仅覆盖显式设置在 Content 上的旧覆盖。

- 指针宽高和动态测量已接入；方向相关 padding 与边缘碰撞仍需核对，不能以四个居中方向证明全部方位完成。
- gap、可选图标宽高/颜色，Figma 默认 Typography 与当前 caption 的差异需核对。
- 阴影颜色在标准项目是固定字面值，效果 OFF 仍显示阴影；不能宣称独立效果控制完成，应随共享效果语义决策处理。
- 继承式旧覆盖、键盘/鼠标关闭、RTL、12 方位/边缘碰撞、触屏、长内容及所有消费者回归未完成。
- Popover tooltip 外观已接入共用 Token，四个亮暗/密度组合外观对比通过，详见 POPOVER_MIGRATION.md；Slider 值气泡仍需分别审查。

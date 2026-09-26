# Avatar 迁移记录

2026-09-24 用户确认并实施：六个等级的内部高度统一消费现有 avata 组件尺寸 Token，与 Figma 的 ON/OFF 变体一致。 Figma 已通过 API 修改或确认；Tokens 构建、ThemeCat 网页与插件构建及 2 项包入口一致性检查通过；本轮未运行 Computer Use 验证。以下旧记录中的待确认项以本条为准。

状态：颜色、圆角和图标尺寸部分接入，未完成整组件验收。

## 设计依据

2026-09-21 只读检查 Components Information Display 的 Avata 305:7013，共 36 个变体。保留设计路径 `avata`，React 公共名称仍为 Avatar。

- Text 使用 text/background-default 与六个级别对应的 text-default。
- Icon 使用 icon/background-default、icon-default 和 size/icon-width；全部级别都绑定同一图标宽度，子图形保持方形。
- 圆角使用 size/radius；字体指标继续由 Typography 提供。
- 显式 avatar-bg/avatar-fg 保留优先级，旧全局默认值移到兼容存档，避免遮蔽组件 Token。

## 验证

ProjectModes 浏览器检查六级别 × LineHeightFix ON/OFF × Text/Icon，24 变体 × 八种亮暗/密度/效果组合共 192 个实例。

- 文字背景亮色 rgb(255,123,91)，暗色 rgb(222,116,96)。前五级文字 rgb(38,37,37) → rgb(213,213,213)，Text 级别使用 Caption 色 rgb(97,96,96) → rgb(142,142,142)。
- 图标背景 rgb(240,239,239) → rgb(37,37,37)，前景使用 Caption 色。
- 所有级别图标宽度 Default=12px，Mobile Friendly=16px；效果模式不改变这些属性。
- Docs 类型检查通过，浏览器无 error 日志。

## 剩余项

- LineHeightFix ON 的 Display/Headline1/Headline2 内部没有高度绑定；已观察 Display/Headline1 高 28/24，与 OFF 的高度 Token 30/26 不同。用户选项待确认；本轮未迁移尺寸。
- Display 外层高度无组件 Token，其他五级别 container-height 已接入；六级别内部宽度已接入。
- 内部高度、图片背景/加载失败处理、普通 DOM 图标与自定义图标、消费者嵌入尚待验证。
- 当前消费者图标尺寸确实改变，以 Figma 已绑定 Token 为依据；不应将 192 个默认实例视为全部验收。

## 宽度和覆盖验证

TokenOverrides 浏览器证据：Headline1 宽度 Token=40、外层高度=60、圆角=5、图标宽度=18 均正确渲染，内部高度维持旧值 26（待尺寸决策）。独立图标背景/前景覆盖生效。

继承 avatar-size=36、avatar-bg/fg 在六级别中均渲染 36×36 且使用指定颜色；已修复局部默认 avatar-size 遮蔽祖先覆盖的问题。Docs 类型检查通过。发现实际 Avatar 消费者包括 Tag、Table，下一步检查嵌入；本轮不将独立示例等同于消费者验收。

## Tag / Table 消费者验证

新增 Consumers 示例，直接组合真实 Tag 与 TableCell。检查亮暗 × Default/Mobile Friendly 四组合中的 5 个头像（Tag 默认文字、禁用文字、自定义图标，Table 默认图标与自定义文字）。头像 14×14 → 18×18，图标 12 → 16，文字和图标背景/前景按各自组件 Token 切换。

Tag “移除 Kai”点击后消失，恢复按钮重新显示，禁用 Tag 的移除按钮 disabled=true。此证据仅覆盖这些组合及正常布局，不包含图片、受限宽度、Table 选择/排序或所有效果模式。本轮 Docs 类型检查、CSS 构建通过；顺便移除 line-height-fix 选择器中重复的私有颜色/宽度赋值，避免重复维护。

## 图片分支补充

修复 imgProps.className 覆盖基础图片类的问题，改为合并类名。回归测试确认自定义类、alt、loading 和 width/height 属性同时保留。

Pictures 浏览器示例使用本地 data GIF 避免外部请求，涵盖默认图片、自定义图片类（同时传入 96×48 属性）、Tag 图片与 Table 图片。在当前移动密度环境中四者均加载成功，图片与父表面均 18×18，object-fit=cover；自定义类不会破坏尺寸。透明单像素 fixture 只能验证加载和样式，不能证明实际照片的裁切视觉效果。加载失败、透明图片背景语义和完整模式矩阵仍未验收。Docs 类型检查与单项回归测试通过。

# Progress 迁移记录

状态：部分接入，未完成整组件验收。

## 设计与实现

- Figma Feedback 页 Progress 589:55818；bar 的轨道高度、圆角、背景、进度色、文字色和 gap 使用对应组件 Token。
- ring 容器使用 default/big 的独立宽高与 ring gap；default/success/fail 的轨道、进度颜色使用组件 Token。标准项目路径中的 `sucees` 保持原样，不擅自改名。
- 显式旧变量覆盖保留优先级；移除旧默认值对新 Token 的遮蔽，大尺寸 ring 不再通过局部声明覆盖继承的 `--progress-ring-size`。
- 字号、行高和字重继续使用共享 Typography。

## 浏览器证据（2026-09-21）

Storybook `response-and-feedback-progress--project-modes`：2 shape × 2 size × 3 type，在亮暗 × Default/Mobile Friendly × ON/OFF 八组合共检查 96 个渲染实例。

- bar 轨道 default/big 高度 6/8，gap 6；ring 容器 16/24，gap 8。
- bar 轨道亮色 rgb(240,239,239)，暗色 rgb(37,37,37)；默认进度 rgb(255,85,50) → rgb(255,138,113)。成功与失败颜色同步切换。
- 标签颜色 rgb(97,96,96) → rgb(142,142,142)；共享 Caption 字号随密度从 12 变为 16。
- success ring 的轨道与进度同色，遵循现有组件 Token，未擅自改为浅色背景。
- 效果模式切换未改变这些已迁移属性。

## 剩余验收

- success ring 特殊几何等待用户决定：小号 track/progress 比普通态大 2px，大号仅整圈轨道，无进度路径。暂时保留旧成功态 SVG，不擅自统一设计。
- 组件 Token 独立覆盖、旧变量覆盖的浏览器回归，以及 0/100、非有限数值、动态更新、RTL、受限宽度和消费者嵌入。
- 当前 96 个实例仅证明默认模式矩阵，不能替代以上验收。

本轮检查：Docs TypeScript、tokens 与 UI 包构建通过，浏览器无 error 日志。

## 环形几何补充（2026-09-21）

只读检查 Figma 589:56007/56008、589:55950/55951、589:56012/56013、589:55984/55985：track 是 OUTSIDE 描边的椭圆；progress 是开放向量中心线，不能把两者的宽高直接视为相同语义。

- 普通态/失败态改为不固定 viewBox 的 ellipse，以 CSS 消费独立宽高和描边；track 中心线尺寸 = 设计轨道尺寸 + 描边，progress 尺寸直接描述中心线。
- 使用 pathLength=100 保持不同尺寸下百分比稳定；0% 隐藏进度路径，100% 为完整环。
- RingGeometry 浏览器验证 16 个边界案例（两种尺寸 × 两种状态 × 0/25/75/100），截图中起点位于顶部并顺时针前进。
- 独立覆盖：容器 40×32、轨道 28×20、进度 32×24、描边 4，渲染中心线半径 16×12。
- 旧尺寸 36 覆盖：default 半径 15.75/描边 4.5，big 半径 16.5/描边 3，保留旧 viewBox 的缩放比例。
- 4 个数值边界测试通过，覆盖负数、NaN、Infinity 和超过 100；Docs 类型检查通过。动态更新动画、RTL、其他浏览器和消费者仍待验证。

## 动态更新与旧覆盖补充

`DynamicValues` 浏览器检查：75 → 100 → 0 → 25，bar 宽度、ring dash、标签与 aria-valuenow 同步；归零时进度路径隐藏，恢复非零后重新可见。此检查证明更新后的结果，尚未测量动画中间帧。

- RTL 条形进度 right=0，从右侧开始；环形保持顶部起点和顺时针方向。
- showLabel=false 不渲染标签，自定义 label 保留原文。
- 继承的旧 fill/track/ring-track/label 色覆盖在 default/success/fail 生效；旧 gap=9、bar height=9 生效。未覆盖 big 高度分支。
- 已修复长标签挤压：标签最多占组件一半宽度，超出省略并通过 title 保留完整文本；bar 的 max-width=100% 适应窄父容器。
- 在 packages/ui/src 和 apps 的 TSX 搜索未找到故事与测试外的 Progress 消费者，因此尚无实际嵌入页面证据。
- 本轮 Docs 类型检查通过。

长标签修复浏览器证据：80px 组件中“自定义状态”占 40px，轨道保留 34px；48px 父容器中组件宽 48px，标签 24px、轨道 18px。LTR/RTL 结果一致，RTL fill right=0，完整标签文本与 title 均保留。此验证不覆盖小于 gap 的极端容器或触屏提示方式。

# Link 组件 Token 迁移

状态：39 个标准组件 Token 已接入；仍有设计冲突及验收项，不能视为完成。

## 来源与实现

只读检查 Components Basic Input 的 Link 集合 140:445。caption 普通样本 140:506：padding-y=0、padding-x=2、图标 14×16；禁用样本 262:4547 根 opacity=1、文字及图标 opacity=.55；仅图标样本 156:714 容器宽16、内部 x 留白。标准项目对应39项：20颜色、18尺寸、1禁用透明度。

Link 两档尺寸、两种模式的默认/hover/active 背景及独立文字/图标颜色消费组件 Token。字号/行高/字重仍由共享 Typography 提供。旧 link-fg-theme/custom 与 button-no-bg 状态覆盖入口保留，移除会遮蔽新 Token 的根默认值；旧 button-disabled-opacity 显式覆盖继续作用于内容。显式图标 level/biggerSize 保留调用方语义。

## 已验证

ComponentTokens Storybook 的两档×两模式：当前 Mobile Friendly 普通图标分别18×20、20×24；仅图标容器20×20、24×24，内部图标18/22。默认padding=0/2，仅图标padding=0。新覆盖padding=7/11、gap=9、radius=13、图标容器23×27全部生效；文字rgb(20,60,100)、图标rgb(100,40,80)分别生效。旧前景覆盖rgb(80,40,100)同时作用于文字和图标。禁用根opacity=1，文字与图标=.55。

Token 构建与五个工作区typecheck通过。

## 待处理

- 来源冲突：text/noBackgroundCustom/background-default 解析为不透明白色，Figma 140:522 fills=[]。当前代码按标准 Token 消费，因此网页呈白色；已通过Ask请求统一方式。未擅自改写标准数据或Figma。
- asChild 视觉层与禁用行为已补齐并验证，证据见下文。
- 八模式默认状态、显式尺寸及旧覆盖已验证；hover/active 持续交互、嵌入其他组件回归仍未完成。
- 250ms ease 仍是旧交互常量，标准 Link Token 暂无对应项，不能宣称全部设计属性已经Token化。

## asChild 补齐（2026-09-21）

asChild 现在先读取子元素内容，再复用与原生 Link 相同的图标/文字层；仍保留子元素属性及单一 anchor。仅图标判断基于子内容，避免空路由组件掩盖 iconOnly。禁用时清除传入子元素的 href、点击处理器与可进入的 tabIndex，并在捕获阶段阻止后续点击传播。

新增3项SSR回归：保留目的地及视觉层、禁用子元素无href且tabIndex=-1、空子元素可推断仅图标。全部通过，UI typecheck与完整构建通过。真实浏览器 AsChildTokens：点击可用路由链接计数0→1、hash到link-target；禁用anchor按Enter后计数仍1且hash不变，子图标/文字opacity均.55；点击仅图标链接计数1→2并跳转icon-target。

以上补齐原asChild待办；第三方路由组件应遵循标准DOM属性/事件透传约定。完整模式矩阵与背景来源冲突仍未完成。

## 八模式默认状态矩阵（2026-09-21）

新增 ProjectModes：独立 ThemeProvider 使用完整标准项目，三个轴分别操作。真实浏览器完成 Light/Dark × Default/Mobile Friendly × ON/OFF 的八种组合，每组两档×两种模式，检查默认、仅图标、显式尺寸、禁用和旧覆盖。

| 属性                        | Default    | Mobile Friendly |
| --------------------------- | ---------- | --------------- |
| Caption 普通图标容器 / 图标 | 14×16 / 14 | 18×20 / 18      |
| Text 普通图标容器 / 图标    | 16×18 / 16 | 20×24 / 20      |
| Caption / Text 链接高度     | 16 / 18    | 20 / 24         |

八组旧前景色覆盖均为 rgb(80,40,100)，禁用根透明度1、文字/图标均.55，显式 caption/biggerSize=false 图标均16px。效果开关不改变这些无阴影链接的尺寸/颜色，符合当前 Token 引用结构。主题前景 Light 为 rgb(205,57,35)，Dark 为 rgb(255,174,155)；自定义 Caption 97/96/96→142/142/142，Text 38/37/37→213/213/213。

text/noBackgroundCustom 的白背景在八组均为255/255/255，准确反映现有标准 Token，但与无填充设计冲突，尤其暗色下仍明显；这一项保持待决，不能将矩阵执行完成误报为设计一致性全部通过。本轮新增示例 typecheck 通过。

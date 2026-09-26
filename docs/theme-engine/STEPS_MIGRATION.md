# Steps 组件 Token 迁移

状态：状态颜色及布局已接入，尚未完成全部消费者验收。

## Figma 依据

2026-09-21 只读核对 Navigation 页的 Steps `791:143426`、StepsItem `791:143311`、StepsIcon `789:145559`。

- 横/纵方向使用各自 gap，item 使用 stepsItem/size/gap，文字容器有独立 text/gap。
- 六种状态分别绑定图标背景/前景、标题、说明颜色。设计中的 `waring` 对应公开 API 的 `warning`，保留源 Token 拼写，没有改写 Figma。
- done/fail/waring/waiting 为图标；inProgress/default 为 caption 数字。waiting 的主组件是 `timeAndDate/alarm`，thickness=Medium，mode=default。
- 图标容器 width 22，内部图标 width 12；圆角及 default 描边宽度都有组件 Token。

## 实现与兼容

Steps、StepsItem、StepsIcon 消费上述 Token，文字指标仍共用 Typography。公开 state 名称不变；waiting 改为实际 Figma 图标，仍可通过 icon/children 自定义。

旧 Steps 显式覆盖仍优先；旧全局默认更名为内部 legacy 名以避免遮蔽新 Token。item-min-width 120px 保留为当前 Web 布局约束。StepsItem title 使用 Omit 排除原生属性类型冲突。

## 浏览器验证

- Light/Default 六状态：图标容器22、前四种 glyph12；waiting 显示图标，其余数字只出现在 inProgress/default。
- done/fail/warning/waiting 标题与图标色分别 rgb(0,147,31)、rgb(207,0,64)、rgb(209,140,6)、rgb(0,132,191)；说明各自解析为 rgb(38,37,37)。
- Dark/Mobile Friendly 自定义：水平gap19、垂直gap23、item gap11、文字gap5、容器30、glyph18；done 图标/标题/说明分别 rgb(96,48,128)、rgb(18,52,86)、rgb(112,80,32)，证明三个部位可独立覆盖。
- 旧覆盖同时开启：两个方向gap7、容器26、done标题/图标rgb(32,64,96)，符合兼容优先级。
- CSS生成和Docs类型检查通过。首次UI构建打包及DTS通过，文档生成阶段进程异常退出，使用稳定Node补跑产物步骤。

## 剩余验收

横向窄屏策略、全部模式与自定义宿主组合；通用圆角变量覆盖的兼容策略尚待统一。不能以 Token 引用数量作为完成证据。

## 高度与窄屏复核

只读核对 StepsIcon 六种状态：width/height 都是22，FIXED/FIXED，targetAspectRatio 均为20:20。因此图标容器高度跟随宽度保持1:1有设计依据。

新增 Storybook 长内容窄屏与 RTL 开关。Dark/Mobile Friendly、320px、六步骤、含无空格长标题和长说明场景：

- 纵向 LTR/RTL 容器与每项 clientWidth/scrollWidth 均320，无横向溢出。
- RTL 图标位于正文右侧，图标实测22×22。
- 横向 LTR/RTL 容器宽320而scrollWidth为790，每项最小宽度120；文字在各自项目内换行，但步骤总宽溢出。这是未解决的布局缺陷，不能标记为通过。
- 已通过 Ask 请求用户选择自动纵向、区域横向滚动或换行；未获答复前不擅自选择。此问题不阻止其他组件迁移。

# Form / FormGroup 迁移

2026-09-21 只读核对 System Composition / Form `527:56247`：垂直 `527:57461`、水平 `527:57641`、Form Group `530:65349` 及 Action `530:57274` 的绑定。

FormField 接入方向 gap、heading gap、content gap 与标签/说明/必填色；Fieldset 接入分组/content/action gap、action padding-x/y 与标题/说明/info 色，共 15 项组件 Token。Typography 字号、行高、字重继续共用。原 `--form-label-width` 显式覆盖保持不变。

Typeface 行添加稳定 data-line 索引，Form 颜色按角色选择，不依赖 nth-child；仅提供说明时不会误用标题颜色。信息插槽提供继承色，自定义子组件仍可自行指定色彩。错误消息继续共享语义色，动作按钮布局继续由已有按钮/插槽负责，尚未声称整个 Form 已完成验收。

待核对：八模式实际渲染、新 Token 局部覆盖、RHF 校验与嵌套控件、窄容器布局。浏览器连接目前不可用。

验证：两项 Typeface 缺省行角色测试、CSS 构建、变更日志配对通过。捆绑 Node 的类型检查曾误报未改动的 Navigation 行语法错误并发生 V8 崩溃；该行实读语法正常，使用系统 Node 重跑完整 Docs 类型检查通过，未改写 Navigation 来规避环境异常。

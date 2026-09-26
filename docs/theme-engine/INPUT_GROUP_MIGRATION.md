# InputGroup 迁移记录

状态：两层间距、附加文本颜色及共享字体指标已接入；旧通用间距覆盖策略待用户确认，不能标记完成。

## 设计证据

只读核对 Information Collect 的 InputGroup 345:8986 与 InputGroupInput 409:21706。外层水平 gap8 引用 inputGroup/size/gap；输入项水平 gap8 引用 inputGroupInput/size/gap，内部包含可选 Typography 和 BaseInput/NumberInput。隐藏前缀文本为 `-`，字体 14/18，颜色绑定 inputGroupInput/color/text-default。

## 实现

- 横向 InputGroup 消费专属 gap，提供显式 input-group-gap 覆盖入口。
- 新增并导出 InputGroupItem，承载前缀与输入控件，消费输入项 gap；不替换实际输入组件或其交互。
- InputGroupAddon 从 caption 改为共享 text 指标；专属颜色规则避免被 Typography 默认颜色覆盖，className/style 仍开放。
- 竖向排列为原有 Web 扩展，保留原 gap-inside 行为，没有凭空映射到 Figma 横向 Token。

## 验证

Light/Default 下两层 gap 均为 8，前缀颜色 rgb(38,37,37)、字号/行高 14/18；Dark/Mobile Friendly 下颜色 rgb(213,213,213)、字号/行高 18/24。独立覆盖将组 gap 改为19、项 gap13；初次颜色覆盖受 Typography 优先级干扰，修复后前缀实际为 rgb(18,52,86)。输入起点由12编辑成36成功。

Docs 类型检查、颜色修复后的 UI 构建和变更记录配对检查通过；产物包含 InputGroupItem 类型导出。这里只验证基础输入组合，不代表 OTP 数字限制、全部组合、竖向/RTL、窄屏或受控输入验收完成。

## 未决兼容项

原横向组直接依赖全局 --gap-component，该变量有全局默认，直接把它放在新 Token 前会持续遮蔽新值。已通过 Ask 请求确定独立兼容样式或显式兼容开关；当前开发实现优先消费专属 Token，旧通用覆盖兼容尚未完成。未发布。

# Pagehead 组件 Token 迁移

状态：组件布局、七种标题层级及说明颜色已接入；并非完整验收。

## 设计依据

2026-09-21 只读核对 Components / Structure Navigation 的 Pagehead `643:172156`。

- 根节点：gap 10、padding 0×18、背景、底边颜色及宽度均有 Pagehead 绑定。
- heading `643:171879`：gap 4、padding 4×0；包含返回 Button 与 title。
- title `643:171880`：纵向 gap 6、圆角绑定；内含 Breadcrumb 和 Typeface。
- Typeface `643:171881`：起始内边距 6。All-Custom 中大标题使用 heading-default，subtitle/text 使用 text-default，caption 使用 description-default。
- action `643:172076`：gap 4、padding 8×0；按钮自身继续消费 Button Token。

## 实现

根节点、heading、title、action、文本起始内边距均消费对应 Pagehead Token。现有正文标题和 caption 说明分别消费 text-default 与 description-default，字号/行高/字重继续来自 Typography。

显式旧 Pagehead 变量作为首选覆盖保留；旧全局默认定义更名为内部 legacy 名，避免遮蔽新组件 Token。title 属性排除原生 HTML title 类型约束，允许 ReactNode。

## 本轮验证

- CSS 生成、Docs TypeScript 检查通过。
- 浏览器默认布局：根 gap 10 / padding 0×18；heading gap 4 / padding 4×0；title gap 6 / 起始 padding 6；action gap 4 / padding 8×0。
- Dark + Mobile Friendly：正文 rgb(213,213,213)，18/24；说明 rgb(142,142,142)，16/20。
- 独立覆盖：根 gap 17 / padding 3×23 / stroke 3；heading gap 9 / padding 7×5；title gap 11 / radius 8 / 起始 padding 15；action gap 13 / padding 12×6；正文与说明分别为 rgb(18,52,86)、rgb(112,80,32)。
- 新旧覆盖同时存在：根 gap 4 / 水平 padding 8、title 起始 padding 2、action gap 3，符合旧显式值优先。
- 返回按钮 Enter 触发一次事件，ReactNode 标题正常显示。

## 未完成

- 多操作按钮、实际消费者及各模式完整交互组合仍需验收；不能以已接入 Token 数量认定完成。
- 原先 heading 直接消费通用 gap-inside，通用变量覆盖的兼容策略待统一决定；当前新组件 Token 优先。
- 插件人工验证继续按用户要求暂缓。

## 标题层级补齐

新增 titleLevel，复用 Typography 七种层级。display/headline1/headline2/title 使用 heading-default，subtitle/text 使用 text-default，caption 使用 description-default。默认仍为 text；titleAs 独立设置 span 或 h1–h6，默认 span 保持旧语义。

浏览器在 Dark + Mobile Friendly 验证七种层级自定义色：大标题 rgb(96,48,128)、正文 rgb(18,52,86)、caption rgb(112,80,32)。320px 容器内配合返回按钮、单个操作按钮及无空格长标题，七种层级在 LTR/RTL 下 clientWidth 与 scrollWidth 均为 320；RTL 起始内边距在右侧解析为 6px。此证据不覆盖任意长度的操作区或所有窄屏组合。

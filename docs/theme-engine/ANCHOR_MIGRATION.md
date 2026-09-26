# Anchor 迁移记录

状态：布局、竖线、标题/描述颜色、文本间距和未选中透明度已接入；原生链接 asChild 已修复，完整组合验收和兼容策略仍未完成。

## 设计证据

只读核对 Structure Navigation 的 Anchor 617:56764、Anchor Item 617:56638。四级缩进对应 gap4/10/18/24。根 padding0；wrapper padding-y2；content padding-x4/y0/radius6；竖线独立绑定 stroke-width 及 selected/unselected border-default。content 内有 Typeface，绑定 text/gap；未选中 Typeface opacity0.6 绑定 transparency/unselected/text。字体指标沿用共享 Typography。

## 实现与验证

替换原通用间距、padding、固定1px竖线、旧颜色和透明度引用为对应 Anchor Token。当前保持原简化结构：content class 对应 wrapper，label 对应设计 content；没有把缺少的描述文字与 text gap 伪装为已消费。

浏览器 Light/Default 四级×选中/未选中：gap4/10/18/24，文字 rgb(38,37,37)，选中竖线 rgb(255,85,50)、未选中 rgb(249,248,248)，透明度1/0.6。Dark/Mobile Friendly 文字 rgb(213,213,213)，字体18/24，透明度仍1/0.6。独立覆盖：组gap5、第0级gap7、竖线宽3、内容横向padding9、文字 rgb(18,52,86)、选中竖线 rgb(112,80,32)、未选中透明度0.3 均生效。

Docs 类型检查及 CSS 构建通过。Story 中链接阻止默认导航，只验证呈现，不代表页面滚动联动已验收。

## 剩余

- 标题/描述已支持，超长内容与嵌套自定义文本仍需组合验证。
- asChild 原生链接组合已修复；路由库自定义宿主仍需消费者验证。
- Anchor 原先直接消费通用旧语义变量，没有专属旧变量层。与 InputGroup 同类兼容问题仍待确认，未发布；不能称旧全局样式覆盖已全部保留。
- hover 恢复文字不透明是现有 Web 行为，Figma 只有 activated ON/OFF；需记录此扩展。
- RTL、长文本、键盘与无障碍当前位置语义，以及完整模式组合与消费者验收。

## asChild 组合修复

复用 Link 的组合方式：从唯一子元素提取内容，将 rail/content 装入原子元素后交给 Slot，保留其属性、ref 与事件合并。activated 默认设置 aria-current=location，显式父 props 或子链接语义仍可覆盖。未选中不生成当前位置属性。

新增3项回归测试：单一链接宿主与属性/嵌套标签保留、显式 aria-current=page 保留、未选中无当前位置属性，全部通过。浏览器组合示例显示宿主 A；点击后父/子事件分别为1/1，Enter 后为2/2，焦点留在链接，aria-current=location。示例阻止实际导航，不能据此声称路由跳转和页面滚动已测试。

## 可选描述与文本间距

只读核对 Typeface 617:56631：Content=Text+Caption，主文本14/18，描述12/16，描述父层默认隐藏；两行分别绑定 text-default 与 description-default。新增 description 属性，未提供时不渲染描述；补齐 surface/text 两层，content padding/radius 属于 surface，text/gap 和整体未选中 opacity 属于文本块。

浏览器 Light/Default 标题14/18、rgb(38,37,37)，描述12/16、rgb(97,96,96)；Dark/Mobile Friendly 标题18/24、rgb(213,213,213)，描述16/20、rgb(142,142,142)。未选中文本块opacity0.6、两行自身opacity1，未重复衰减。独立覆盖后标题rgb(18,52,86)、描述rgb(112,80,32)、gap6、文本块opacity0.3。带描述的 asChild 链接 Enter 后父/子事件1/1、宿主A。

3项回归测试继续通过，补充断言描述正常渲染且不泄漏为宿主 description 属性；Docs 类型检查、CSS 构建通过。

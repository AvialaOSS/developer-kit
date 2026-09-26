# TimePicker Token 迁移

## 2026-09-24 可选秒列

用户确认补齐可选秒列，默认仍时分。TimePicker、TimePickerField、TimePickerWheels 新增 showSeconds，TimePickerValue 新增可选 seconds。开启时显示 HH:mm:ss、缺省秒为00，秒列覆盖0–59；未开启且未提供seconds时，原两列及回调对象形状不变。已有秒值在修改时分及隐藏秒列时保留，模式切换本身不触发值更新。分钟继续保留原五分钟步进。

秒列独立消费 timePickerMenuItemGroupSec 的间距、留白与边框Token；开启后布局为三列，继续复用同一滚轮交互及共享Typography。中文/英文秒标签已提供，LocaleTimePicker.second为可选字段以兼容原有自定义语言包。WithSeconds Story 与 ThemeCat真实预览已接入。

三项定向测试验证默认/开启的显示、秒值补零、0–59选项、修改单位时保留其余值，以及旧两列回调形状；轮列回调在测试中隔离，不是实际键盘/滚轮验收。Docs类型检查通过。下文“仅支持hours/minutes”为历史状态，已由本节替代。

独立消费者ThemeCat构建补充暴露并修复了TimePickerField.defaultValue与原生按钮同名属性的类型冲突；该字段现在明确只接受TimePickerValue。声明重新生成后，ThemeCat网页和独立插件构建通过，预览含秒列示例。

2026-09-24：沿用用户确认的输入禁用分层结构，重新读取 Figma 禁用变体（TimePickerInput 450:21685、DatePickerInput 460:42310），根 opacity=1、内容槽=55%、内部 Typography=60%。Web 改用各自 content-disabled 与 placeholder Token 分层消费；文字有效透明度约33%，图标55%，背景保持自身颜色。显式 input-disabled-opacity/input-placeholder-opacity/input-icon-opacity 保留；禁用原生 placeholder 不再额外叠乘。以下“等待禁用策略决定”为历史状态。本轮未进行 Computer Use 验证。

状态：弹出面板、时分列布局、滚轮选项及输入框主要尺寸/配色已接入；禁用策略、效果及运行态验收未完成。

## 面板与滚轮

2026-09-21 核对 Figma Information Collect 原组件：450:46920 TimePickerSelectMenu、450:36109 TimePickerTimepick、450:26217 小时列、450:26216 分钟列。面板消费自身 gap、横纵留白、背景、边框和圆角；两列容器消费 Timepick gap、横向留白和圆角；小时/分钟分别消费自身 content/gap、横纵留白、外层纵向留白及末端分隔线颜色，Web 使用逻辑方向支持 RTL。

Timepick 内小时/分钟实例的外层纵向留白仍覆盖为 padding-none，而原列组件使用独立 padding-y Token；当前值均为 0。Web 按原列组件消费独立 Token，保留可独立调整列留白的能力。这不代表已修改原 Figma 实例覆盖。

选项与年月选择同用 ScrollPickerItem：共享 Typography 行高加上下留白得到选项高度；滚动行步长为选项高度加列间距。高亮、裁剪文字和滚动首尾补白按同一组尺寸计算。小时/分钟的完整循环逻辑保持原实现，共享滚轮尺寸监听包含视口、首项和高亮带。

显式旧 datepicker-time-wheel-item-height/height/fade-height、面板及选中配色覆盖继续优先。旧全局默认高度和渐隐高度转入兼容层，默认可见行数仍为 5，在各列本地按选项高度、间距及纵向留白计算视口高度，避免局部密度引用提前在根节点解析。DatePicker 内的时分选择通过共享 TimePickerWheels 同步消费这些 Token。

## 尚未完成

- 禁用态暂保留原整体透明度策略，待用户确认；Hover 和错误状态保留 Web 原有语义。
- 面板固定阴影尚未迁移；ScrollPickerItem 的 lineShadow-bottom 选中效果已接入，运行态模式切换待验收。
- Figma Timepick 有秒列；Web 当前值结构仅支持 hours/minutes，未擅自扩展公共 API。五分钟步进仍保持现有行为，不声称和设计中全部分钟选项等价。
- 亮暗、密度、效果组合，循环边界、快速滚轮、键盘、触摸与旧覆盖验证仍待阶段验收。当前浏览器控制接口及新标签页挂载超时，不能据此声称运行态通过。

本批 CSS 构建、UI 样式拷贝、文档项目类型检查和 changelog 配对通过；新增 hour/minute 类名均有对应样式，类名差集仅含包名 aviala-design。未运行全量构建或重复尝试已失效的浏览器交互。

## 输入框尺寸与配色

核对 450:21685 下全部 20 个变体：Regular/Big、普通/全圆角、激活/默认/禁用、空值/有值。对应独立 TimePickerInput 尺寸和状态 Token 已接入。激活正文与图标继续使用 text-default/icon-default，未虚构 active 文字映射；激活边框绘制在内部，避免额外增加高度。普通输入框 Figma 高 26/34，图标槽留白为 4/8，内阴影固定 offsetY=-0.5、radius/spread=0，颜色绑定自身 shadow-default。

保留 input-px/gap/field-py/slot-py、圆角、背景、文字、图标、阴影等显式旧覆盖。默认占位符透明度从旧全局声明移至 _legacy，DatePicker/TimePicker 直接使用各自 placeholder Token；其他仍使用旧规则的输入组件增加兼容回退，维持原默认值。禁用整体透明度继续待确认，尚未消费 content-disabled。

本批仅修改样式，CSS 构建、UI 拷贝与 changelog 配对通过，没有重复全量类型检查或浏览器验证。

滚轮选中内阴影已按 Figma 450:22890 的 lineShadow-bottom 绑定接入，与独立 ScrollPicker 和年月滚轮一致；固定面板阴影仍待处理。

# Pagination 迁移记录

状态：分页自身五个 Token 与页码 Tiled Segmentator 样式已接入；完整交互及布局验收未完成。

## 设计证据

只读核对 Structure Navigation 791:146366：外层 gap10；pageButtons 791:144678 gap4；jump 791:144835 gap4；pageSize（设计层名仍为 jump）791:144836 gap4。四处绑定各自 pagination/size Token。两个标签分别为“跳转至”“每页”，均绑定 pagination/color/text-default。

pageButtons 内部为 Button、SegmentatorGroup、Button。当前代码页码仍由普通按钮及旧选中态 CSS 拼装，这一差异尚未修复，不能将五个 Token 全引用视为组件迁移完成。

## 实现与验证

外层、controls、jump、size 接入对应 gap，去除 pagination-gap/controls-gap/jump-gap 的全局旧默认；显式旧名仍优先。jump 和 size 的直接 Typography 标签消费组件颜色，字体指标继续共享。

浏览器 Light/Default：四个 gap 为10/4/4/4，标签 rgb(38,37,37)。独立覆盖后为21/9/11/17，标签 rgb(112,80,32)；同时开启旧覆盖后为12/3/7/7，旧 jump-gap 继续覆盖两个区域。Dark/Mobile Friendly 标签为 rgb(213,213,213)，字体18/24。输入7并回车后 aria-current 为7，再点下一页变8。

Docs 类型检查、CSS 构建通过。未把有限交互证据扩大为完整边界、受控模式、RTL、任意宽度和全部模式组合验收。

## 剩余

- Tiled Segmentator 的 hover/pressed、效果切换及所有模式组合需要继续验收。
- 翻页按钮、Input、Select、Popover 使用其独立迁移结果，还需组合复验。
- 跳页输入宽65、选择器宽77、页码最小宽28及省略号菜单布局没有分页专属 Token，需确认是否保留为 Web 布局约束。
- 完整边界与交互、RTL、窄屏，以及所有模式组合。

## 页码样式对齐

只读核对 791:143659 的实例属性：Mode=Tiled、All-Round=OFF、direction=horizontal、Availability=ON；内部选中与未选中均为 Tiled SegmentatorButton。页码容器复用 Segmentator Group CSS，按钮复用 item/content 结构与 Token，同时保留普通按钮、aria-current、Tab/Enter 页码导航；没有引入 radiogroup 的选择语义或触摸拖选行为。选中态在页码按钮自身绘制 Tiled Token 阴影与背景。

旧 page-gap、page-px/py、page-active-px/py、page-radius、page-fg、page-active-bg/fg 移除全局默认，并在分页作用域保留显式优先。省略号和其菜单按钮也消费未选中 Tiled 样式。

Dark/Mobile Friendly 实测：选中背景 rgb(136,60,52)、文字 rgb(255,174,155)，未选中文字 rgb(213,213,213)、透明背景，padding6×10、radius8。独立 Token 覆盖为 gap13、选中背景 rgb(18,52,86)、文字 rgb(254,220,186)、radius12；同时旧覆盖后变为 gap5、背景 rgb(69,32,96)、文字白、radius3。Enter 选择2成功；打开省略号选择5后 aria-current=5、菜单数量0。

Docs 类型检查与 CSS 构建通过。本轮不声称原 Segmentator 的动效、拖动和单选组交互被整体搬入分页。

## 窄容器与 RTL

Dark/Mobile Friendly、320px 容器、当前页10复现：翻页区宽338，导致根 scrollWidth338 > clientWidth320。为 controls 添加 min-width:0/max-width:100%，保留 Segmentator 内部横向滚动。修复后根和 controls 均宽320；页码视口宽240、内容宽290，左右翻页按钮保留在容器内。

LTR 键盘激活20后 aria-current=20、下一页禁用。切换 RTL 后根宽320且无外溢；每页条数从10改为20成功。RTL 输入10回车后当前页10，根 scrollWidth320，内部仍为240/290。该检查未覆盖小于320px、长本地化标签、触摸滚动或自定义超大按钮等组合。

ProjectModes 增加宽度与方向控件，Docs 类型检查及 CSS 构建通过。

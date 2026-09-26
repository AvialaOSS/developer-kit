# Breadcrumb 组件 Token 迁移

状态：普通项、分隔符、Storage 三层布局及菜单主要属性完成首轮接入；效果、兼容和完整场景仍需验收。

## 设计证据

2026-09-21 只读核对 Breadcrumb Item 集合 `618:1816`。Default Content `618:1817`、Small Content `622:1781`、两种 Separator `618:1900`/`622:1791` 均包含外层、wrapper、Content。

外层 padding0、gap4；wrapper paddingY2；Content paddingX4/paddingY0/gap4/radius 均有对应尺寸 Token。图标容器 width 与 height 分别绑定，文字及图标颜色独立。分隔符 Typography 消费 separator/text-default 和独立透明度。

## 实现

保留 li→可交互元素的语义，增加 wrapper。普通项和分隔符使用尺寸相关的外层、wrapper、content Token；字体仍由 Typography 提供。未选中文字与图标分别应用透明度，不再对整个可交互项统一降透明度。分隔符保持 aria-hidden。

显式旧变量在对应属性中优先；旧全局默认移入内部 legacy 名。Storage 与菜单暂时继续使用兼容值，未宣称它们已经迁移。hover/active 保留原有 Web 交互背景及 hover 恢复透明度行为。

## 已验证

- Docs 类型检查通过。
- Default/Small 自定义：root gap9；外层padding0×3；wrapper padding5×0；content padding7×11。
- 两尺寸文字 rgb(18,52,86)/opacity .4，图标 rgb(96,48,128)/opacity .8，分隔符 rgb(112,80,32)/opacity .3，证明独立覆盖没有被全局默认遮蔽。
- Parent 用 Enter 触发一次事件；Storage 菜单可打开，Escape 关闭且焦点回到触发按钮。

## 待完成

- 菜单 hover/selected 语义和阴影效果策略；Storage 完整模式和自定义宿主验收。
- 两尺寸完整亮暗/密度/状态与 RTL、长路径、窄屏验收。
- 旧前景色覆盖对图标的兼容策略、通用基础变量覆盖兼容仍待核对，不能仅凭当前颜色相同认定兼容。

## Storage 后续迁移

只读核对 `619:1544`/`621:1754`/`622:1795`/`622:1799`：Default/Small、OFF/ON 的 Storage 外层、wrapper、Content 都有独立 Token。内部实际是 `All-Round=OFF, Mode=noBackgroundCustom, Size=tiny, IconOnly=ON, State=default` Button，而非 Breadcrumb 自有图标容器。

实现复用 Button 并增加 Storage wrapper/content；保留 Popover 状态与事件回调。图标 OFF 透明度 .6，ON 恢复1；按钮整体不降透明度。内部图标尺寸和按钮状态由 Button Token 决定。

浏览器 Light/Default 两尺寸按钮20×20、图标容器16×16；外层Default padding1×0、Small0，wrapper0，Content0×2。独立覆盖后三层分别padding3、5×0、4×9。Small触发器Enter展开后 aria-expanded=true、图标opacity1，另一个收起触发器仍为.6。

通用旧 padding 变量和旧 Breadcrumb 前景色对复用 Button 的覆盖仍需兼容核对。没有自动把 Breadcrumb Token 赋给 Button 的独立颜色与尺寸语义。

## Default 说明文字

只读核对 Typeface `618:1821`：Content=Text+Caption，标题14/18绑定 default/text-default，隐藏的说明12/16绑定 default/description-default。新增 BreadcrumbItem.description，仅Default显示，Small按现有设计保持单行，API注释和变更日志明确此行为。

文字容器消费 default/text/gap；未选中透明度作用于整个文字组一次，标题和说明不再分别叠乘。字号、行高、字重仍来自共享Typography。

浏览器Dark/Mobile Friendly自定义覆盖：文字gap6、组opacity.4、caption自身opacity1、颜色rgb(112,80,32)、字号16/行高20。Small无说明节点。Docs类型检查通过。

## 弹出菜单

只读核对 `622:5183`：Select Menu padding6×0、gap0，背景/边框/圆角绑定Select Menu；Item Group padding0×6、gap4；Item padding4×8、gap8，Typography与function箭头分别消费text-default/icon-default，箭头容器14×18。

菜单surface、group、item和箭头接入对应Token，Popover slot清除重复padding与gap。保留当前菜单hover兼容色，不将Selected颜色擅自映射为hover。阴影采用现有共享select-menu-shadow，仍与Figma固定0/5/20/黑6%不一致，等待既有共享效果策略决定。

浏览器Light/Default菜单120×68、两item108×26、group gap4、箭头14×18，恢复设计几何；Dark/Mobile Friendly背景rgb(37,37,37)、文字rgb(213,213,213)、18/24、箭头18×24。Enter触发Library回调一次，Escape关闭后焦点回到触发器；点击项是否自动关闭仍保持原行为，本轮未改动。

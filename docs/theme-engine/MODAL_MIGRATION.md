# Modal Token 迁移

状态：根圆角/边框与各区域背景/留白/分隔线首批接入；内部标题、文字、图标、按钮组结构、效果和完整交互尚未完成。

## Figma 依据

Information Display 166:135，Modal 553:58593。根 radius12，四边 stroke1，各自绑定 modal/size/radius、stroke-width 及 modal/color/border-default。

- 头部553:58474：padding0/6/0/14、背景绑定 modalHeadArea；info行 I553:58474;551:58293 gap10，绑定 info/gap。
- 正文553:58445：padding8×14、背景、顶部描边颜色和厚度绑定 modalContentArea。
- 操作区553:58451：padding8×14、背景、顶部描边颜色和厚度绑定 modalActionArea。外层gap10，内部Button Group gap4，Button Slot gap8，三者不能合并。
- 头部content框padding-y2/gap4，headline、icon和button-slot仍需深入核对；不能把旧header-main-py8直接替换为content-padding-y2。

## 实现及兼容

首批迁移根边框/圆角、头部外层留白及info间距、正文和操作区独立背景/留白/顶部描边。旧默认CSS别名移至_legacy，避免遮蔽新的组件Token；调用方显式设置modal-content-bg/radius/border、modal-header-*、modal-body-bg、modal-footer-bg及modal-section-*仍优先。

根背景、宽度、阴影、遮罩、文字、图标、header-main和操作按钮间距尚保留原规则。未声明整个Modal迁移完成。

## 验证

ProjectModes采用局部ThemeProvider和非Portal示例，验证CSS消费；不代表Modal跨Portal主题传递已验收。

浏览器Light默认各区域背景255/255/255，根及分隔线1px、249/248/248，根radius12，头部padding0/6/0/14，正文/操作区8×14。Dark按Figma引用变为背景0/0/0、边框18/18/18。

独立覆盖：根radius20、border2px/32-64-96；头部背景213/229/245、padding3/9/3/20；正文背景245/229/213、padding12×18、border2px/96-48-128；操作区背景229/213/245、padding6×10、border3px/32-64-96。三层覆盖均生效。

再启用旧覆盖：所有区域背景224/240/224、根radius11、正文与操作区padding5×7，验证旧统一覆盖优先。Token CSS构建及UI样式拷贝、文档TypeScript检查通过。尚需标题/正文Token、内部结构、密度/效果、Portal与交互矩阵验收。

## 文字颜色与共享字体指标

递归读取实例内部TEXT确认头部两行分别绑定modalHeadArea/color/heading/text-default与description/text-default，正文两行分别绑定modalContentArea/color/heading/text-default与text/text-default。对应CSS已接入四项Token，显式modal-content-fg和modal-description-fg保留优先。移除首个渲染行的强制semibold规则，字体指标回归共享Typography，避免没有标题时误将正文加粗。

浏览器覆盖四项颜色后依次为32/64/96、96/48/128、32/80/48、112/64/32；正文标题字重600，正文及无标题正文均400。CSS构建、文档类型检查通过。头部内部布局、图标、按钮组、效果及完整交互仍待完成。

## 头部内部布局

Figma头部info包含图标slot和content：info gap10；content gap4/padding-y2，内部为headline与button-slot；headline gap4/padding8×0，文字组gap0；button-slot gap4/padding2×0。图标外slot gap0/padding2×0并拉伸，内部Icons宽16/高22、padding-y3，实际图形16×16。均有对应组件绑定。

Web补齐header-content、close-slot、icon-frame，并让header-main对应headline，分别消费Token。移走相关旧默认别名，显式旧header-main-py、icon-size/slot-height/py/fg仍优先。关闭按钮本身继续共享Button，颜色策略尚待核对。

浏览器Default故事继承当前移动密度：info/content间距10/4，content padding2×0，headline padding8×0、gap4；图标frame20×26/padding3×0，图形20×20。关闭按钮点击后弹窗消失，焦点回到Open modal。CSS构建和文档类型检查通过；尚需独立覆盖及默认/移动密度成对验收，不把当前单场景视为完整验证。

本轮完整构建的代码、声明及CSS步骤通过；属性文档生成再次出现Windows进程异常（2147483651），整体构建未通过。按用户减少重复验证的要求，本轮不立即重复生成，留待阶段处理。

操作区已补齐Button Group/Button Slot容器，分别接入共享gap及按钮间距，外层接入modalActionArea gap；显式旧modal-footer-actions-gap继续控制按钮间距。浏览器一次关键检查确认三层gap依次10/4/8，Cancel与Confirm均呈现。类型检查及CSS构建通过。调用方自定义Footer直接子元素布局需在阶段回归中检查。

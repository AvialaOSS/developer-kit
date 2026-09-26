# Checkbox 组件 Token 迁移

状态：外框、组合布局、三态内边距/颜色/高光/阴影颜色已接入；八模式默认状态验证完成。标记尺寸Token决策、效果几何、完整交互与嵌入场景仍未完成。

## 来源

只读检查 Information Collect Checkbox 集合262:4810，样本262:4811默认20×20、1851:25163巨大26×26；宽高与圆角均有组件Token绑定。Checkbox Input 262:4819绑定输入间距与图标高度；Input Group 262:4826分别绑定横纵间距。

## 本轮实现

接入10项：default/huge size和radius、round radius、mark radius、Input gap和icon-height、Group vertical/horizontal gap。移除遮蔽新Token的旧根默认值，显式旧覆盖仍优先。Cascader及Select内旧checkbox-radius消费者保留原兼容回退。

## 验证

ComponentGeometry浏览器：默认20×20/radius6，巨大26×26/radius8；新覆盖均34×34/radius11，round覆盖14，旧覆盖30×30/radius9，半选标记圆角2。横纵group gap均可覆盖19、input gap13、icon-height31。默认尺寸鼠标点击与巨大尺寸Space均能从checked切到unchecked。无浏览器错误。tokens构建通过；五个工作区typecheck通过。

## 待完成

- 三态各自x/y内边距以及标记实际尺寸/描边的Token消费。
- 三态默认/禁用背景、叠层、边框、图标颜色、阴影和高光。
- CheckboxInput的heading/text/caption与禁用透明度，图标仍有18px固定尺寸，需要结合现有图标API核对。
- 三轴模式矩阵、禁用与受控交互、嵌入场景验证。


## 三态颜色与禁用表现（2026-09-21）

只读样本：262:4811选中、262:5461选中禁用、262:4815未选中、263:3593半选、262:5463未选中禁用、263:3594半选禁用。根opacity均1；选中/半选禁用内部标记opacity=.55。未选中禁用第二层paint visible=false，因此该overlay Token保留在标准数据但当前不渲染，不能为了引用覆盖率把隐藏层显示出来。

已接入三态默认/禁用背景与边框、勾选/半选标记颜色、selected/indeterminate阴影颜色、高光两端、mark-disabled透明度。高光保留Figma的20%paint透明度与0/36%色标；阴影保留inset 0 -0.5px 0几何，当前标准中没有对应几何Token。旧checkbox-disabled-opacity现在覆盖内部标记，避免与根透明度叠乘。其他旧颜色/复合surface覆盖及input-surface-shadow显式覆盖保留，Select/Cascader/Radio等消费者保留旧默认回退。

浏览器 ComponentStates 覆盖三态×启用/禁用/新Token/旧覆盖：根opacity均1、默认禁用indicator=.55，新透明度=.8、旧覆盖=.7；选中背景覆盖30/80/130、图标230/240/250，半选背景220/230/240和标记80/40/100，未选中背景220/230/240与边框20/60/100均生效。默认阴影alpha .04，与Figma一致。仍需八模式效果开关及其他消费者回归，不能将本轮默认状态证据泛化为完整验收。

## 状态内边距与输入文字（2026-09-21）

只读核对两档三态：选中padding均6，未选中/半选padding均0；Default图标/半选标记固定12、Huge固定14且居中。Default 20px外框padding6并不意味着标记8px，Figma固定子节点实际12px；禁止用外框减padding重新解释设计。尺寸Token缺失已通过Ask请求新增icon-size/mark-size，当前不擅自新增标准结构。

接入12项状态内边距和3项Input正文/说明颜色及禁用文字透明度。PaddingAndTextTokens浏览器检查：两档三态分别解析默认6/0，覆盖均2px 3px，外框保持20/26、勾选图标12/14；半选时勾选SVG隐藏。文字覆盖30/80/130与100/40/80分别生效，禁用文字opacity=.8；旧文字覆盖20/70/120与90/30/70生效。

CheckboxInput的style沿用现有API传入内部Checkbox，整行文字Token应放外层主题容器；已在示例中明确用父容器设置，未暗改style接口。heading Token当前没有可消费的heading结构，不为引用率凭空添加文字。tokens构建、工作区typecheck通过，示例修正后UI typecheck再通过。


## 八模式回归（2026-09-21）

新增 ProjectModes 独立标准主题容器。实际浏览器执行 Light/Dark × Default/Mobile Friendly × ON/OFF，覆盖两档×三态×启用/禁用/旧覆盖，合计每组18个控件。

- Effect ON：selected高光首端alpha=.2，selected/indeterminate阴影alpha=.04；OFF两者alpha均0。半选本身没有渐变。
- Light selected背景255/85/50、半选255/198/182、勾选254/253/253；Dark分别255/138/113、136/60/52、2/2/2，遵循已确认前景随亮暗反转规则。
- 全部组合根opacity=1、默认禁用内部标记=.55；旧透明度覆盖=.7，旧input-surface-shadow=none生效。
- 两种密度外框都为20/26px，已核对标准基础size-big与size-large在两个模式的值确实分别相同，并非模式切换未生效。

本轮Story typecheck通过。此证据覆盖默认状态和模式切换，不代表动画中间帧、所有嵌入消费者或尚未Token化的几何已经验收。

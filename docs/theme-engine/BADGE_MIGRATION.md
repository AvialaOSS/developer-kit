# Badge 组件 Token 迁移

状态：62/62项Token已接入，独立项目八模式几何/颜色及旧覆盖已验证；完整消费者验收尚未完成，引用数不代表已全部验收。

## 已核对来源

只读检查 Information Display 页166:135，Badge集合166:137全部48个变体的文字和图标填充绑定。六种Style × primary/secondary × caption/text分别对应24项文字Token。图标按层级和primary分为4项独立Token，secondary图标是中性文字色而非随Style变色。API info 对应设计既有拼写 infomation；没有更改标准项目路径或身份。

## 实现和验证

私有CSS变量承接各层级的组件文字色；显式旧badge-fg仍同时覆盖文字与图标。新增badge-icon-fg可单独覆盖图标。components.css的默认badge-fg移为legacy名，避免全局默认遮蔽组件Token。

浏览器ComponentColors覆盖24种组合及2种覆盖：caption secondary图标97/96/96，text secondary图标38/37/37；theme/info/fail/warning/success文字分别205/57/35、0/132/191、207/0/64、209/140/6、0/147/31。primary文字/图标254/253/253。独立覆盖文字30/80/130、图标140/50/90；旧覆盖两者40/90/60，均生效。构建和五工作区类型检查通过。

## 剩余工作

- 嵌入消费者与窄空间/长文本验收待完成；Typography字体指标继续共享。
- 当前已补充六类消费者的基本交互，以及192px窄输入与长徽标的单行滚动场景；消费者全模式组合仍未完整验收。
- 现有 caption 显式 lineHeightFix="subtitle" 是设计48变体之外的API扩展，暂保留共享subtitle最小行高，不假称存在对应组件Token。

## 背景与几何（2026-09-21）

只读检查166:138、181:8、184:1493、181:4、186:1655、182:1439的两层结构，并复核Theme/Normal/warning所有primary/secondary及LineHeightFix组合。外层对齐padding-y1，关闭对齐为0；内层caption padding-x2、text4、gap2，独立背景绑定12项组件Token。caption OFF radius4但Normal为6；text AlignToSubtitleLevel warning gap4，primary和secondary均如此。默认caption图标12×16容器、text14×18容器。

实现新增aviala-badge__surface，内层承担背景、圆角、间距与内容padding，外层仅承担对齐留白。图标实际glyph尺寸通过CSS变量传给现有图标组件，避免原来的内联基础尺寸压住组件Token。旧badge-bg/gap/px/radius/icon-size/icon-slot-height显式覆盖保留；全局默认移为legacy名防止遮蔽。

浏览器当前HTML data-density=mobile-friendly：caption内层20、对齐外层22、图标16；text内层24、对齐外层26、图标18；关闭对齐高度不增加。caption OFF theme/warning radius4、normal6，text对齐warning gap4，其余2。左右图标均显示。新覆盖内层padding3px 9px、外层4px 5px、gap7、radius11、icon20/slot24、背景150/180/210均生效；旧覆盖padding-x8、gap6、radius10、icon19/slot23、背景180/150/120均生效。Token构建与五工作区类型检查通过。Default密度不能用本次Mobile Friendly结果代替，下一步独立模式矩阵验收。

## 独立标准项目八模式

ProjectModes实际呈现48种设计组合及1个旧覆盖。全部8种亮暗/密度/效果组合逐项检查48个Badge的内层/外层高度、radius、gap及左右图标宽度，共384个组合无不符。Default caption内层16、对齐外层18、图标12；text内层18、外层20、图标14。Mobile Friendly分别20/22/16与24/26/18。双侧图标颜色和尺寸一致。

theme secondary Light背景255/198/182、文字205/57/35，Dark背景136/60/52、文字255/174/155；caption中性图标97/96/96→142/142/142，text中性图标38/37/37→213/213/213。Badge没有组件高光/阴影Token，ON/OFF不改变这些属性，符合当前设计。旧背景180/150/120、文字及图标40/90/60、icon19/slot23在8种组合保持。UI类型检查通过，浏览器无错误。

消费者盘点：Input、NumberInput、Select、Cascader、ColorPicker inputs和Table实际使用Badge；需逐项验收新增surface结构，不以展示矩阵代替消费者回归。

EmbeddedInputs已验证Input左右徽标、NumberInput左右徽标及disabled输入；当前Mobile Friendly输入框320×36，所有徽标22px高且边界完全在框内。文本编辑成功，数值步进12→13，禁用文本框仍不可编辑。其余四类消费者、窄空间和长文本仍待验收。

EmbeddedConsumers补充Select、Cascader、ColorPickerPanel及Table的实际组合。浏览器Mobile Friendly下，四类消费者Badge外层22px、内层20px；已检查Cascader选项、颜色字段及表格单元格内徽标边界均在各自容器内。Select从设计项目切换至标准项目成功；Cascader选择主题项目后菜单关闭，重新打开时该选项aria-selected与data-selected均为true。ColorPicker十六进制值改为336699并失焦保留，透明度改为65后输入和滑块同步为65，色相更新为210。浏览器无错误，新增故事的UI类型检查通过。此证据不覆盖消费者的所有模式、窄空间或长文本；这些仍需单独验收。

NarrowConsumers在192px容器中验证Input与NumberInput：文字编辑区域分别72px与63.875px，与左右徽标无水平重叠；文本可编辑，数值递增123456→123457成功。长中英文徽标保持现有nowrap契约，双图标场景宽414.17px、高22px；外部overflow-auto容器宽192px、scrollWidth414px，无额外垂直溢出。Badge本身不提供自动省略或换行，本次没有擅自改变此契约；需要受限宽度截断的消费者应另行设计和验收。新增故事UI类型检查通过。

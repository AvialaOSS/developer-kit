# Table Token 迁移

## 2026-09-24 可选表头图标

只读核对集合1455:35542：Frame 5（1449:35187）包含默认隐藏的左图标槽954:148420、headline954:148423及默认隐藏的右图标槽1449:35182。两槽绑定icon-slot-gap、padding-x、slot-padding-y；Icons绑定icon-width和icon-container-height，默认14×18。heading图标颜色Token现存且指向VariableID:140:846；本次读取未展开隐藏Icons的内部glyph，因此不声称原稿已绑定该颜色。

Web TableHead新增可选leftIcon/rightIcon，分别位于标题/操作区两侧，槽尺寸、留白、间距与颜色消费tableHead组件Token。默认无图标；Checkbox分支不显示这些槽。ContentVariants示例增加左右图标。此补齐未修改Figma，真实布局/交互仍需阶段验收。

验证：3项Table定向测试、Docs类型检查、Spiral完整构建和ThemeCat网页/插件构建通过。ThemeCat真实预览接入带图标的TableHead。此前独立tgz验收早于此项改动，不作为新增图标槽的安装验证。

2026-09-24 用户确认：保持连续表格，行距与列距均为0；table/size/gap保留为当前未使用Token。现有Web根与行均为Flex且没有gap声明，初始值即0，与Figma实际网格一致，无需改布局。此决定解除下文网格间距待决项；不据此豁免其他状态和交互验收。

状态：外层与单元格表面、文字、普通图标及主要内容槽布局已接入，图形占位与完整验收未完成。

2026-09-21 核对 Figma Table 1457:1475、Table Cell 1455:35539、Table Head 1455:35542。默认和 Checkbox 单元格共享各自背景/边框/描边宽度，留白绑定不同。Web 外层消费 Table 横纵留白、圆角、背景和描边；表头与正文分别消费自身背景、描边宽度和颜色。保留现有单侧公共边绘制方式，避免相邻单元格双线。

显式 table-bg/head-bg/border/radius 仍优先，其中 table-bg 同时覆盖外层和正文，table-border 同时覆盖外框和各单元格；旧全局默认声明移至 _legacy，避免默认值遮蔽新组件 Token。新 TableCell 颜色可独立于 Table 外层覆盖。

## 待完成

- Figma 根布局为 GRID，Web 为按行组织的 Flex。行列间距已确认均为 0；混合固定/等分列规则已核对并补示例，窄宽和多行内容的实际排版仍待验收。
- 图形占位表面及嵌入控件的具体变体仍需核对；共享 Typography 的局部模式解析尚待验收。
- 粘性表头、滚动、RTL、旧覆盖及八模式验收未完成；当前浏览器控制不可用，未声称可视验证通过。

## 正文与普通图标

读取 Text 955:148590、icon+text 955:148636 及表头 1455:35541 的可见子树。表头正文绑定 tableHead/color/text-default；正文与描述分别绑定 tableCellContent/color/title/text-default、description/text-default；普通图标绑定独立 icon-width、icon-container-height 和 icon-default。上述项已接入，并为默认 Typography 文字加入明确颜色类，避免字体组件自身默认色遮蔽表格语义。

旧 table-head-fg/cell-fg/cell-caption-fg/cell-icon-size 显式覆盖继续优先，其旧默认移入兼容层。原 icon-place 的普通图标内层仍维持旧尺寸和继承色，待图形占位本身一起迁移。字体指标仍共用 Typography，不新增组件字号/行高/字重。

Figma 内容结构：外层 content gap=8，标题与按钮同组 internal-gap=4；headline padding-y=8，居中槽 padding-y=2。Web 当前结构将图标放在 main 内且纵向留白施加于单元格外层，不能简单将这些 Token 叠加，否则高度与按钮对齐改变。内部布局仍待结构对齐后接入。

## 内容层布局接入

补读 icon-place、People、Badge、Switch、Action、Checkbox 六类内容，确认 Badge/Switch 也使用 headline 留白，Action 使用 centered-slot，Checkbox 直接使用 Checkbox 自身尺寸。

默认内容加入独立 content 容器，前置图标/头像从正文 main 移出，与正文和按钮分组并列。外层 Cell/Head 按各自默认或 Checkbox 路径消费留白；headline、leading、actions 各自消费已核对的间距/留白。表头将标题和按钮槽分开处理。逻辑横向边距支持 RTL，不再使用固定左/右位置。

旧 table-cell-px/px-end 仍覆盖外层；旧 table-cell-py/head-py 显式值应用于对应内容槽，默认情况下不叠加外层与标题区垂直留白。旧 cell-gap 覆盖主要内容间距。直接传入 TableCell children 的内容保留直接子节点结构和旧留白回退，不新增包装；自定义内容不会被自动替换为内置控件。固定 min-height 和 Checkbox 列宽保留当前 Web API，尚未以此声明完全几何一致。

CSS 构建、UI 拷贝与文档项目类型检查通过；两项服务端渲染回归验证自定义内容优先、直接节点结构、表格角色数量、文字/操作保留、Checkbox/Switch 已选状态和标签传递。该测试不证明浏览器布局或交互，浏览器验收继续待补。

## IconPlace 与默认人物头像

Figma 955:148616 引用 IconPlace 955:148504，变体 color=theme / Mode=Light / Rounded=OFF。现在消费其 width/height、gap、padding、default/radius、theme/light 背景和图标颜色、icon-width；默认由旧的主色圆形改为原稿浅色圆角矩形。显式 table-icon-place-size 和 table-cell-icon-size 仍优先，旧默认声明移入兼容层。

人物槽 965:2710 引用 Avata 307:352（Display / LineHeightFix OFF / Icon），实测 30×30；默认人物头像相应改为 level=display。用户传入 people 仍原样显示。开关 1455:35488 引用 Regular，与 Web 默认尺寸一致；已选状态属于业务值，未据设计样例强行设置默认 checked。

Table 根 Grid 的 rowGap/columnGap 均为 0，只有 itemSpacing 绑定 table/size/gap，实际网格间距未绑定。用户已通过 Ask 确认保持行列零间距，gap 保留并标记为当前未使用。

新增 ContentVariants Story 集中展示普通文字、图标、IconPlace、默认头像、Badge、Switch、按钮和自定义内容；原有选择行示例继续覆盖 Checkbox。样式构建及文档项目类型检查通过，未获得浏览器可视验收证据。

## 混合列宽（2026-09-24）

只读证据见 `table-grid-figma-20260924.json`。Table 1457:1475 的五列为 HUG、FLEX、FLEX、FLEX、FIXED(126)，实际宽度为 40、229.667、229.667、229.667、126px；九行全部 HUG，样稿表头 38px、正文 50px，行列间距均为 0。

Web 的 Checkbox 列默认 40px，其余列默认等分；通过现有 TableHead/TableCell 的 style 设置相同 `flex: 0 0 126px` 可表达样稿末列。新增 MixedColumnWidths Story 展示该配置。126px 是该样稿的列布局配置，不作为所有表格的默认值或新组件 Token；调用方需在表头与每行采用一致的列配置。Figma HUG 列可随内容变化，Web Checkbox 固定宽度仍可用现有 `--table-checkbox-col-width` 覆盖，两者并非通用的自动内容测量等价。此项源码核对不代替浏览器布局验收。

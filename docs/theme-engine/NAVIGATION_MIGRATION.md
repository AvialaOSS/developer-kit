# Navigation Token 迁移

状态：根容器、导航项布局、品牌标题、子组间距、指示器及选中态颜色/阴影已接入。用户补齐的三处 Figma 选中文字绑定已回读确认；其余状态、菜单及完整交互验收未完成。

只读核对624:92194父集合全部8变体：横向gap10/padding0×18，纵向gap10/padding14×0，分别绑定navigation/size/horizontal与vertical。背景统一navigation/color/background-default；分隔线为横向底边或纵向右边，绑定navigation/size/stroke-width和navigation/color/border-default。上述9项Token已接入，RTL继续沿用Web逻辑侧边。

纵向品牌实例624:92195绑定navigationItem/size/vertical/brand gap8、padding0×14，也已接入。显式旧navigation-gap/py/px-horizontal/bg/divider/brand-px继续优先，旧默认声明移至_legacy避免遮蔽新变量。

横向高度48未发现组件变量绑定，暂保留旧配置。横向品牌、导航项各状态、子组、指示器尺寸/位置、图标/文字和效果尚待迁移。CSS构建及拷贝通过；按用户要求浏览器模式矩阵留到阶段验收。

## 导航项布局批次

核对624:119382父集合全部10变体：横向品牌/Tab均gap8/padding8×0、操作gap4/padding8×0；纵向品牌gap8/padding0×14（前批）、Tab gap8/padding0×8、Child gap8/padding0/8/0/26、Action gap2/padding0×10。各自navigationItem路径的Token已接入，默认与选中共享相应布局。旧item-px/item-child-pl/item-py-horizontal显式覆盖仍优先，旧默认声明已移至_legacy。

纵向操作区gap从旧8改为绑定值2；space-between布局仍保留，实际可用空白可能大于gap最小值。此批只构建CSS并拷贝到UI，均通过；没有执行浏览器矩阵。交互状态、子组、指示器与文字图标仍待处理。

## 子组与指示器批次

Figma 643:127007 子组绑定 navigationChildGroup/size/gap，纵向普通与可折叠子组均接入；根导航组保留原共享间距，横向组维持既有布局。显式 navigation-group-gap 仍可覆盖两者，其默认声明移至兼容层，避免遮蔽子组 Token。

指示器 1179:22392 / 1179:22393 的颜色与圆角接入 navigationItem/color/selected/indicator-default 和 navigationItem/size/indicator/radius；横向只设置上方圆角，纵向设置四角。显式 navigation-item-rail 仍优先。尺寸尚由测量逻辑控制：横向当前高度 3 与设计绑定 2 不同，后续需独立接入横向高度并检查定位。

选中项 624:61629 / 624:119385 内的 Button 使用 box/box-theme-tertiary-default 及 tertiary 效果，而 Web 仍是 second，属于待确认语义差异，未擅自替换。本批浏览器检查合并至后续尺寸迁移。

本批 CSS 构建与 UI 样式拷贝通过，changelog 配对通过；未新增类名，类名差集仅含共享 Button/Typography/图标/焦点样式与动画名称，无新增硬编码颜色。未运行完整构建或浏览器矩阵。

## 选中态补齐（2026-09-21）

用户已确认 tertiary 语义并授权补齐原 Figma。新增 10 个 navigationItem 变量：color/selected 下 background-default/hover/active、text-default、icon-default、shadow-inner，以及 size/selected/shadow-inner 下 blur/spread/offset-x/offset-y。保留对现有 box/Button 变量的完整引用链，变量 ID 和来源见 navigation-selected-figma-delta.json。

原组件三个选中实例 624:61513、624:119386、643:118732 已绑定新背景与阴影；其主图标已绑定新 icon-default。回读绑定正确。文字绑定最初因连接器无法加载 OPPO Sans 4.0 Regular 而阻塞，随后由用户补齐，2026-09-21 已回读确认（见下）。Hover/Active 变量已创建，当前 Navigation 组件集合没有相应独立变体，未新增变体。尾部图标的横纵色彩绑定不同，保留原样。

### 用户补齐文字绑定后的回读

以下三个 Text 节点的 `boundVariables.fills` 和填充色引用均为 `VariableID:2740:10504`（`navigationItem/color/selected/text-default`）：

- `I624:61513;129:22;128:105`
- `I624:119386;129:22;128:105`
- `I643:118732;129:22;128:105`

三者的字号、行高、字重仍分别引用共享变量 `VariableID:15:8`、`VariableID:15:89`、`VariableID:15:6`，符合字体指标不增加组件级 Token 的约定。Web 已通过 `--navigation-item-color-selected-text-default` 消费同一 Token，显式旧 `--navigation-item-active-fg` 覆盖仍优先。本次仅核对绑定和现有 CSS 消费并更新记录，没有修改变量定义，也未重复执行构建或浏览器矩阵。

通过增量导入脚本将这 10 个变量并入快照与标准项目，保留原项目既有覆盖和稳定 ID；并非重新导出整个 Figma 文件。Web 选中背景、文字、主图标和内阴影已消费新 Token，显式 navigation-item-active-bg/fg/shadow 继续优先。

指示器用隐藏且不参与排版的尺寸元素解析 CSS 长度，避免干扰运行中的指示器动画。横向宽高各自消费组件 Token，纵向宽度独立；旧 rail-width 仍覆盖纵向宽度及横向高度。横向浏览器实测 50×2，类型检查和 CSS 构建通过；完整交互/兼容矩阵暂缓。

## 品牌标题批次

消费现有 navigationItem/size/brand/title 的 gap、padding-x、padding-y、radius，以及 navigationItem/color/brand/text-default。旧 navigation-brand-fg 默认移入兼容层，显式覆盖继续优先；未绑定组件高度变量的标题高度仍保留原配置。CSS 构建与 UI 拷贝通过；不重复运行浏览器模式矩阵。

选中态浏览器抽检：默认背景 rgb(255, 233, 227)、文字 rgb(205, 57, 35)、内阴影 rgba(0, 0, 0, 0.04) 0 -0.5px 0 0，与 tertiary 引用链一致。此证据不代表 Hover/Active 或全部模式已验收。

## 弹出菜单批次

只读核对 Navigation 内 Select Menu 实例 624:61953：菜单根绑定 selectMenu 的背景、边框、圆角、gap 与 padding；可见的单组绑定 selectMenuItemGroup gap/padding。网页菜单仍为单组平铺 API，将菜单与组的横纵留白相加，组内 gap 使用组 Token；只有一组，不需要菜单的组间 gap。保留原 DOM 结构和 asChild 行为。

普通菜单项的 gap、圆角、横纵留白及文字颜色接入现有 SelectMenuItem Token。菜单阴影、选中与禁用语义仍未迁移；没有将导航主项的 tertiary 自动套用到 Select Menu 选中项。菜单和组的显式旧覆盖入口继续保留，旧 select-slot-gap 显式值仍优先；默认声明移至兼容层，Select/Cascader 的旧默认回退也同步保留，避免遮蔽导航组 Token。

本菜单批次 CSS 构建与 UI 样式拷贝通过，无新增类名。按精简验证策略，菜单交互与模式矩阵留到阶段验收。

## 菜单图标与正文

继续从菜单父实例展开虚拟子节点：普通项 1903:4869 与选中项 1903:4868 的可见正文均绑定 selectMenuItem/color/text-default，主图标均绑定 icon-default，普通尾部图标同样使用 icon-default。选中尾部图标为选择标记，与当前 Web 可自定义尾部图标 API 不完全等价，未擅自添加标记。

菜单左右图标尺寸/颜色与正文颜色已接入上述 Token；显式旧 navigation-icon-box/size 仍优先。相关全局默认移至兼容层，主导航图标维持原默认回退。选中正文的旧 select-item-selected-fg 显式覆盖仍优先，默认改为已读取的正文 Token。背景、阴影和禁用规则继续待决。

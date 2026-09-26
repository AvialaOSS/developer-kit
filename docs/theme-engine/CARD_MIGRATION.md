# Card 迁移记录

## 2026-09-24 独立 heading

用户确认在现有 title/description 上方新增可选 heading 行。CardHead/CardBottom 已新增 heading: ReactNode，使用共享 Typography Title 和各自 cardItemHead/Bottom/color/heading-default，旧 card-fg 显式覆盖继续优先。标题容器为纵向布局；只提供 heading 时不生成空的 Typeface；未传 heading 的默认底部仍无标题区。OptionalHeading Story 与 ThemeCat 预览已接入。

两项 SSR 检查覆盖内容顺序、原有文字/动作保留、自定义 children、heading 不泄漏到 DOM 属性、默认底部和仅标题情况；不等同于视觉验收。

Figma 六变体已只读定位：头部集合738:140581、底部738:142112；共享 Title 来源128:98，现有颜色变量2511:36343/2511:36346。拟新增默认关闭的 Show heading 属性与可编辑 Typography 实例。实际写入在创建节点前加载 OPPO Sans 4.0 SemiBold 失败；连接器8927项可用字体中没有 OPPO，因此本轮未修改原文件，也未替换字体。Figma同步尚未完成。

## 2026-09-24 标题层级补齐决策

只读重新检查 Card item head 738:140581 与 Card item bottom 738:142112 下的全部6个变体：主文字均绑定本区域 text-default，次文字均绑定 description-default，当前没有 heading-default 消费者。不是 CSS 名称解析错误，也不能直接把现有 text 标题改绑到 heading。

用户已确认新增独立 heading 标题层级，并同步 Figma 与 Spiral。具体结构正在 Ask 确认：新增可选 Title 行，或让现有 title 可切换 Heading 外观。字体指标继续复用共享 Typography；不新增组件级字号、行高和字重。此项尚未实现，仍保留在迁移缺项清单中。

同时定位 Button Group 主组件 530:57323：纵向gap4，Button Slot 横向gap8，另有默认隐藏的 Text Slot，内部为 Caption Typography。它是真实可用的隐藏内容槽，不能因为默认不显示便将 placeholder/text-default 判为无用途。

已新增公共 ButtonGroup：children 为按钮槽，description 为默认省略的说明槽，采用共享 Caption Typography 与 buttonGroup/color/placeholder/text-default。Card 两个 action 区域改为复用此组件，card-trailing-gap 仍仅覆盖 Card 内部按钮间距，不影响独立 ButtonGroup。无 DOM role 强制或新交互语义。已加入默认、说明文字、RTL 故事与 ThemeCat 预览；实际视觉和交互验收仍待完成。

本次收尾：Storybook 类型检查通过；构建后的 CJS 入口 SSR 核对 CardHead/CardBottom 均复用按钮槽且默认无说明文字，独立 ButtonGroup 使用 Caption 并保留子按钮的 submit 属性。属性文档已包含公共 ButtonGroup；盘点确认该组3项Token都有消费者。首轮类型检查进程异常退出，重跑成功；这些检查不替代视觉验收。

状态：外层和正文布局、各区域背景及圆角、标题与描述、图标和分隔线、头尾内部布局、按钮组均已接入；底部支持可选标题区。完整验收仍未完成，以下按验证范围记录。

## 设计证据

只读核对 Structure Navigation Card 738:145715：外层透明、padding 0、gap 0、radius 10。子项 head 738:145234、body 738:145193、bottom 738:145197 各有独立背景 Token，三者外层均 padding 0×14、gap 10、radius 0。head 内部 Pagehead Items padding 8/0/4/0；body Items padding 8×0、gap 10；bottom Pagehead Items padding 4/0/8/0。

## 本轮实现与验证

外层消费 card-size gap/padding/radius；正文消费 card-item-body 的背景、文字、radius、gap/padding，以及 content gap/padding。head/bottom 仅先接入背景与 radius，其他布局仍是原有合并结构。显式 card-bg/radius/px/gap/body-py/fg 保留优先；去掉对应全局旧默认，防止覆盖新 Token。标题与底部的其他旧变量尚未退役。

ProjectModes 四种亮暗/密度组合确认：外层透明、0 gap/padding、radius 10；三区亮色背景 rgb(254,253,253)、暗色 rgb(26,26,26)；正文文字 rgb(38,37,37)/rgb(213,213,213)，body padding 0×14，content padding 8×0、gap 10。覆盖外层 gap 6、padding 7×9、正文深蓝背景/浅色文字、content py13 均生效，标题与底部背景保持独立。CSS 构建与 Docs 类型检查通过。

## 剩余

文字与图标补充：Figma 实例文字明确绑定 head text-default / description-default；图标矢量分别绑定 head/bottom icon-default，底部分隔线绑定 divider-default。现有 textCaption 标题与描述分别消费这两个颜色 Token，字体指标仍共用 Typography。图标容器消费 width/height，图形以 width 保持正方形；头部和底部操作图标另消费 action-icon padding-y。分隔线分别消费 head/bottom height、stroke-width、color。

四个亮暗/密度组合验证：标题与图标亮色 rgb(38,37,37)、暗色 rgb(213,213,213)，描述 rgb(97,96,96)/rgb(142,142,142)；图标容器默认 14×18、移动 18×24，图形 14/18；底部分隔线高 14、宽 1，颜色亮 rgb(249,248,248)、暗 rgb(18,18,18)。CSS 构建与 Docs 类型检查通过。尚未将默认故事的检查扩大解释为所有自定义 Typography/DOM 图标和变体均完成。

- 按钮组已拆分，独立 ButtonGroup 公共组件不在本轮新增；跨组件复用仍需后续迁移统一。
- head/bottom heading-default 等当前 API 尚未呈现的文本层级，以及自定义 Typography/DOM 图标的消费规则仍需核对。
- 标题/描述、图标与分隔线的独立运行时覆盖，以及非 action 变体检查。
- action/switch/select 变体、RTL、长文本/窄屏、旧覆盖、独立子组件及消费者验收。

## 标题与操作区布局拆分

head/bottom 外层分别消费自己的 gap/padding；head heading、title、action 与 bottom action 使用对应内部布局 Token。上下 padding 从外层移入 heading/action；自定义 head trailing 使用相同操作区容器，null 仍不渲染。旧 head-pt/pb、bottom-pt/pb、trailing-gap 仅保留显式覆盖优先级，移除会遮蔽新 Token 的全局默认。

浏览器在 Light/Default 下检查 action、switch、select 三种布局：外层均 0×14；head heading/action 为 8/0/4/0，bottom action 为 4/0/8/0，gap 均 10。运行时分别覆盖三处为 17/0/11/0 + gap7、13/0/9/0 + gap6、15/0/12/0 + gap5，三种布局均独立生效；同时开启旧变量后，head 两区变为 3/0/2/0，bottom 为 1/0/6/0，两操作区 gap4，标题 gap7 保持不变。

这轮只验证布局和覆盖优先级；select 插槽使用演示按钮，不代表 Select 弹层交互已验收。默认布局与固定宽度之外的长文本、RTL、完整模式组合仍待验证。

## 可选底部标题区

只读核对底部三个组件 738:142113 / 738:142122 / 738:142131：heading/title 均存在，标题与描述分别引用 cardItemBottom/color/text-default 与 description-default。完整 Card 的底部实例 738:145197 仅含操作区。因此新增可选 title/description/icon，未提供时保持无标题区；children 仍是原有操作区内容。CardHead 与 CardBottom 的 title 类型允许 ReactNode。

标题区消费 bottom heading 的 gap、padding-x/y-start/y-end，title gap/radius，独立文字、描述、图标颜色与图标容器尺寸。字体指标仍来自 Typeface/Typography。

浏览器核对三种变体 × 四个亮暗/密度组合：heading padding 4/0/8/0、gap10；图标容器默认 14×18、移动 18×24；标题亮色 rgb(38,37,37)、暗色 rgb(213,213,213)，描述亮色 rgb(97,96,96)、暗色 rgb(142,142,142)。原完整 Card 示例四次均无底部标题节点。运行时独立覆盖得到 padding16/0/10/0、gap9、标题 rgb(18,52,86)、描述 rgb(112,80,32)。CSS 构建、Docs 类型检查、Card 类名双向核对通过。

## 按钮组与选择器操作区

只读核对 738:142119：Button Group 为纵向 gap4，内部 Button Slot 为横向 gap8，分别绑定 buttonGroup/size/gap 与 buttonGroup/size/button-slot/gap。Card 的 action 变体加入这两层，分隔线仍是外部操作区的子项。显式 card-trailing-gap 同时覆盖原来的按钮间距，保留旧配置作用范围。浏览器确认默认组 gap4、按钮间 gap8；旧变量覆盖后按钮间 gap4。

Select 变体不再丢弃 action/actionLabel：头部顺序为动作、分隔线、选择器；底部为选择器、分隔线、动作，与设计一致。只有两端内容都存在时才插入分隔线，不额外生成默认动作按钮。ProjectModes 改用真实 Select：标题选择第二项后值更新；底部 Enter 打开、Escape 关闭，退出动画结束后焦点回到底部选择器，listbox 数量为 0。操作顺序经 DOM 核对。

Docs 类型检查、CSS 构建和 Card 类名双向核对通过；本次未扩大到窄屏/RTL 或所有交互状态验收。

## 320px 长标题与 RTL 验证

ProjectModes 增加长路径标题/底部标题的 320px 卡片夹具，以及 ConfigProvider 方向切换。三种变体在 Default/Mobile Friendly × LTR/RTL 四种组合中，clientWidth 与 scrollWidth 均为 320，无卡片横向溢出。移动密度截图确认长标题在剩余宽度内换行，操作区完整显示；因此卡片可能明显增高，本轮未引入截断或重排规则。

RTL 核对标题区位于操作区右侧，两区之间保持间距；action 的头尾箭头切换为左向路径。RTL 移动密度下，头尾 Switch 均可用空格切换到 checked，切回默认密度保持状态。Docs 类型检查通过。

上述覆盖固定 320px 卡片，不代表任意宽度、任意超长动作文本、所有自定义子节点和消费者都已验证；暗色外观的先前验证也不等价于完整状态笛卡尔积。

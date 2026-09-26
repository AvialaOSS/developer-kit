# Select 迁移

2026-09-24：重新读取275:4630的16个禁用变体，根1、内容槽55%；普通Typography为60%，Tag子实例为1。当前普通文字触发器已分层消费selectInput的content-disabled和placeholder，背景不再淡化；同时修正Radix占位标记位于Trigger而非Value的选择器。Tag多选模式是否新增已Ask，未把普通文字规则作为Tag分支完成证明。保留旧覆盖，未进行Computer Use验证。

## 隐藏图标颜色补齐

再次读取时明确关闭 skipInvisibleInstanceChildren，标题图标 299:9544 的内部 Vector I299:9544;131:75;62:171 可正常返回，填充绑定 selectMenuItem/color/title/icon-default（2443:22989）；普通图标 276:5945 的内部 Vector I276:5945;131:72;62:171 绑定 icon-default（2443:22988）。此前“无法遍历隐藏子层”的查证阻碍已解除。

普通项左右图标已消费正确变量；标题项此前只区分尺寸，现在补充独立标题图标颜色，仍以 select-item-function-fg 显式旧覆盖为优先。不据此改动选中背景、透明度或普通项语义。CSS 构建及 UI 样式拷贝通过；实际颜色覆盖和完整菜单状态矩阵仍待浏览器验证。

## 正文颜色修正（2026-09-21）

Navigation 内嵌菜单的深入绑定读取确认普通与选中正文使用 text-default，图标使用 icon-default。发现 .aviala-select-item__text 曾错误消费图标色，现改为继承父行颜色，并用高于共享 Typography 的选择器确保文字/标题/选中状态控制生效。此修正不预先改变待决的普通 selected 父行配色。

## 首轮尺寸证据

只读定位Information Collect的Select Input 275:4630（40变体）、Select Menu Item 296:5242（14变体）。核对275:4631和275:4646外框与全部直接子层绑定：regular外框padding0×10、gap6、slot-padding-y6，高30；big为0×14、gap8、slot-padding-y10，高38。左右Icons与ExpandIcon的内部框为16×18，绑定SelectInput自身icon-width/height，不是BaseInput的14×18。

## 已实现与验证

12项尺寸Token接入：两档gap/padding-x/padding-y/slot-padding-y、radius/round-radius、icon-width/height。图标槽采用content-box，使上下padding加到内容高度之外。默认箭头不再使用内联共享bigger档位覆盖组件Token；显式自定义图标档位仍保留。旧input尺寸覆盖优先。

ComponentGeometry浏览器Mobile Friendly下regular/big高36/44，三枚图标均20，槽高36/44。新Token覆盖padding3×17、gap11、radius13、icon-width22/icon-height28、slot-padding9，整体高52、槽46、图标22。旧padding-x19、radius15、icon-size24均生效。自定义尺寸下打开菜单并从产品设计部选择技术研发部成功，无error/warn。CSS生成及UI类型检查通过。

## 未完成

- 透明度冲突与Tag分支，焦点键盘状态完整回归。
- 菜单项剩余Token迁移；Portal局部主题、子菜单与键盘交互完整回归（菜单表面与分组已接入，见下方记录）。
- 八模式与显式图标档位回归，默认密度需独立项目验证。
- Figma隐藏badge/button槽位与React API覆盖范围对齐。

## 菜单表面与Portal首轮

只读核对Select Menu 276:6499、Select Menu Item Group 276:6234。菜单padding6×0、gap0、圆角及背景/边框对应selectMenu六项Token；组padding0×6、gap4，分割线padding2/4/4/4对应独立组Token（组尚未迁移）。默认菜单项276:6132内部文本I276:6074;168:150;128:105绑定selectMenuItem/color/text-default。

LocalProject浏览器复现：输入框局部dark的menu背景Token为37/37/37，Portal菜单挂body后却读取255/255/255。新增主题弹层上下文，优先级fullscreen > 显式OverlayContainer > 局部项目容器 > body；documentElement不作为局部挂载点。修复后菜单位于局部主题容器并读取相同Token。菜单六项Token及默认菜单文字已消费，实际背景37/37/37、边框18/18/18、圆角10、padding6×0，未选文字213/213/213；选择技术研发部成功。

旧select-menu-bg/border/radius/py与select-item-fg默认移到内部legacy名称，其他CSS消费者增加旧默认回退，显式覆盖优先。菜单shadow尚属旧层。首次分步热更新在import补齐前出现Provider未定义报错，完整重载后本轮无新error/warn；UI类型检查与CSS产物生成通过。

共享Portal修改尚需Modal/全屏/嵌套主题及其他弹层回归；分组、选中颜色、子菜单表面和菜单项其余Token仍未完成，不以本次暗色菜单截图宣称全组件验收。

## 颜色与状态首轮

只读核对275:4631、275:4661、275:4691、275:4721、275:4751的regular/default内容分支。根背景和effects有独立Token，文字绑定text-default；禁用根opacity1，图标及input area绑定content-disabled0.55，禁用Fill内部Typography仍绑定placeholder0.6。网页现有禁用整根opacity0.55，与设计有差异；未在未决输入透明度规则下擅自更改。

增加8项Token：default/active/disabled背景、文字、图标、描边、描边宽度、阴影色，总计20/23项。旧input背景、文字、shell/surface-shadow等显式覆盖优先。保留hover/error旧行为及共享Typography指标。

ComponentColors浏览器实际默认覆盖背景220/230/240、文字30/50/70、图标80/40/100、阴影70/80/90；禁用背景200/210/220（根opacity仍0.55）；展开背景240/230/220、描边40/90/60宽3px并保留底部阴影。旧背景210/190/170、文字及图标50/70/90有效。展开后选择技术研发部正常，控制台无error/warn，CSS产物及UI类型检查通过。

## 分组与分割线

按276:6234/296:6191已读取绑定接入7项selectMenuItemGroup Token：gap、padding-x/y、divider padding-x/y/y-end、divider颜色。将原viewport左右padding移至group，匹配设计层级；主菜单及子菜单viewport不再重复留白。分割线使用伪元素，在上下留白之内按Token定位1px线条，保留旧select-menu-border显式颜色覆盖。子菜单表面padding同步使用菜单Token。

MenuTokens浏览器读取菜单padding9×5、radius13、group间gap7；两组各padding3×11、内部gap8；divider总高12、top5、左右9、颜色40/90/60，全部覆盖生效。End移动至末组后Enter，项目丙成为selected；控制台无error/warn，UI类型检查与CSS生成通过。子菜单新留白仍需实际展开回归；默认分隔线位置由旧居中改为设计padding-top2，而非继续旧3px中线。

## 菜单项尺寸首轮

按已核对的296:5242/299:9543布局接入6项Token：gap、padding-x/y、radius、title padding-y-end、people padding-x-start。旧select-item-gap/px/py默认移入内部legacy名称，Cascader与导航菜单保留原默认回退；显式旧覆盖仍优先。功能区末端留白暂留旧值，不与普通行gap混为一项。

ItemGeometryTokens浏览器实测：普通项padding7×17/gap11/radius9；标题底部3；人员项起始5；旧覆盖padding2×19/gap13优先。NestedSubMenu主/子表面均padding6×0，分组0×6/gap4，普通与父级行均padding4×8/gap8/radius6。CSS产物生成及UI类型检查通过。

新发现待修：NestedSubMenu点击Sub option B后弹层关闭，但触发器textContent为空，不能宣称子菜单选择通过。需检查关闭时子项卸载与Radix ItemText注册生命周期。菜单项颜色/图标/功能区、完整模式矩阵仍待完成。

## 子菜单标签生命周期修复

关闭的子菜单使用DocumentFragment保留子项注册，避免Popover卸载ItemText后触发器文字丢失；内容不在可见DOM里，不使用强制挂载的隐藏弹层。延迟关闭检查当前焦点是否仍在本子菜单中，避免键盘进入后被指针离开定时器关闭。

浏览器复验：初始关闭子菜单时defaultValue=leaf-a可显示Sub option A；鼠标点击Sub option B后主菜单关闭且触发器显示Sub option B。重新打开，键盘进入子菜单后Down可移动至B，Enter后B具有selected状态，控制台无error/warn。键盘Enter后主菜单本轮仍保持打开，Escape行为还需继续排查（共享useCloseSuppression有窗口blur标志），未宣称完整键盘关闭验收。表单原生选项和深层嵌套尚需回归。

## 键盘关闭修复

共享useCloseSuppression原先在window捕获所有blur，将元素间焦点移动误标为窗口失焦。现在仅event.target===window设置保护，用户后续keydown/pointerdown清除旧标记；键盘操作同时清除指针关闭标志，恢复正确的焦点归还策略。

NestedSubMenu浏览器复验：Down/Up进入子菜单，Down/Enter选择B后主菜单关闭、触发器显示Sub option B且获得焦点；再次展开后一次Escape关闭、标签保留且焦点恢复。控制台无error/warn。新增5项事件流程单元测试，覆盖元素失焦、真正窗口失焦、返回后的键盘/指针关闭及禁用开启，全部通过。测试用轻量hook生命周期替身检验事件监听逻辑；不代替其他使用同一hook的复杂组件浏览器回归。

## 标题、副标题与附加功能区

只读遍历296:5242全部变体：299:9543内Text绑定group-title-default；305:6742的主/副Text分别绑定text-default/caption-default；276:6132内394:28581 MoreFunction绑定function/padding-x-end、height及divider-default。接入这5项Token。旧select-label-fg/subtitle-fg/function-height默认移至内部legacy变量，保留其他消费者回退及显式覆盖。

ItemGeometryTokens浏览器读取标题rgb(70,80,90)、副标题rgb(90,60,80)、MoreFunction高度27、末端留白13、分隔线rgb(40,90,60)。副标题曾被typeface-effects中继承父级色的双类选择器覆盖，已提高目标选择器精度并复验。CSS构建及五工作区typecheck通过。图标、选中状态、Search分支仍待完成。

另发现Figma People的Form-CheckBox/Form-Radio使用普通padding-x，而Simple/CheckBox/Radio使用people/padding-x-start；现有网页统一使用people起始留白，后续需按已证实的Function分支修正。heading-default在本轮返回的可见文字绑定未发现，不能按近似语义替代text-default。

## 左右图标与人员项分支

普通/标题左右图标消费4项icon-width/height Token，glyph使用width的正方形尺寸，插槽高度独立消费height；不再以内联共享biggerSize默认值遮住组件宽度。调用方明确传入level/biggerSize时保留旧档位行为。People Form-Radio/Form-CheckBox按本轮已读取绑定改回普通padding-x，其余People保留专属起始留白。

ItemGeometryTokens实际：普通glyph21/槽高29，标题glyph15/槽高23，显式title档位glyph22；普通People起始5，Form-Radio People起始17，旧padding覆盖19仍生效。CSS产物生成通过。尾部功能图标仍未迁移，颜色及选中状态等剩余项保留。

## 尾部默认图标与 Checked 背景

默认action/simple箭头、radio/checkbox标记glyph尺寸消费icon-width，尾部槽消费icon-height；移除全局默认function-icon-size对组件Token的遮挡，Cascader派生默认保留legacy回退。调用方icon显式传入的分支暂保留原有档位逻辑，尚未宣称自定义无档位图标也已迁移。

Checked行按623:57570已确认绑定消费selected/background-default；保留旧select-item-checked-bg显式覆盖，普通selected背景/文字仍待处理，未自动将两者混为同一语义。

浏览器ItemGeometryTokens默认尾部glyph21/槽高29；点击Checked token item正常关闭，重新展开仍选中、背景rgb(210,230,220)、shadow none。CSS生成通过。剩余包含图标颜色、自定义尾部图标、Search、badge槽、shared typography局部模式及完整模式矩阵。

## 功能图标颜色与 Badge 外层

按已读取394:24174内部fill绑定icon-default、296:7276/296:7344内部fill绑定selected/icon-default，分别接入普通尾部色与单选/复选选中标记色。旧selected-fg全局默认转内部legacy，普通selected文字及Navigation/Cascader/List/DatePicker派生仍保持旧回退，显式旧覆盖优先。

自定义尾部icon无level/biggerSize时使用组件icon-width；有显式档位仍保持原逻辑。Badge设计节点为外层对齐框，其padding-x消费组件Token，不改Badge内部底色框padding；网页移除额外wrapper的1px上下留白，保留Badge自身对齐留白。

浏览器自定义功能glyph21、颜色rgb(70,100,120)，Badge外层padding1×9；选择Radio function后关闭并重开，标记glyph21、颜色rgb(120,60,80)。CSS构建通过。左右图标颜色、Search、普通selected语义、标题Typography与完整八模式回归仍未完成。

## 局部共享 Typography

将6项菜单字体派生默认移至内部legacy变量；Select消费端直接解析当前作用域的共享Typography字号/行高，仍允许显式select/input覆盖，其他Cascader派生保留原回退。Title行在根节点明确使用caption指标，避免子文字继承正文指标覆盖其caption类。

MenuTypography独立项目浏览器验证：Default正文14/18，分组/Title/副标题12/16；切Mobile Friendly后正文18/24，分组/Title/副标题16/20；显式19/27两模式保持。单位为px。未新增组件级字体Token。CSS生成与类型检查通过。其余颜色/效果及八模式完整交叉矩阵仍待覆盖。

## 菜单八模式首轮交叉回归

MenuTypography增加亮暗/效果控制。浏览器遍历Light/Dark × Default/Mobile Friendly × ON/OFF八组合，每轮实际打开/关闭菜单。标题glyph12/16，正文glyph14/18；正文字号/行高14/18与18/24，标题12/16与16/20；显式字体19/27保持。菜单背景Light255、Dark37，边框249/248/248与18，未选正文38/37/37与213，标题97/96/96与142。

未通过效果要求：八组合菜单阴影都仍是旧rgba0.18细线+rgba0.08投影，OFF不消失，需要继续核对Figma共享效果绑定并接入ON/OFF。普通selected文字仍旧205/57/35，本轮已Ask是否统一Checked Token，等待用户决定。以上只证明当前菜单样例，不等同于全部变体/所有交互验收。

## 菜单效果与隐藏图标绑定审计

只读查询Select Menu 276:6499：effectStyleId=S:c14580cc2a01bb4afdc1f756832b2fe8018e0d76,，仅一层DROP_SHADOW，offset(0,5)、radius20、spread0、black alpha0.06，visible=true，boundVariables为空。Figma并没有当前网页旧两层阴影，也没有供ON/OFF消费的阴影绑定。已Ask是否补共享效果Token并接开关、保留固定设计例外或移除；尚未擅自改写设计/标准项目。

另读标题左右图标299:9544、普通图标276:5945：均为visible=false的Icons实例，本次连接器只返回实例外框白色fill、无颜色alias且无可遍历子层。不能将占位外框白色当成图标前景色，也不能据此宣称title/icon-default绑定已验证。尺寸绑定在前轮已确认，颜色仍待进一步查证。

相关Select结构与关闭保护测试共11项通过。这些单元测试不覆盖真实Figma回写或菜单效果。

## Search 行

新增导出的SelectSearch/SelectSearchProps，复用Input，消费search padding-x/y/radius及普通行radius。对应已读取460:42087外框与460:42174 BaseInput绑定。过滤和空结果交由调用方管理，Search示例在关闭时清空查询，让已选项标签继续可见。

键盘文字、编辑与IME事件不进入Radix typeahead；上下键进入首/末结果，Escape正常退出。过滤移除已选项时Radix会自动聚焦panel，新增编辑期焦点保护，只拦截这一panel焦点回落，不阻止用户聚焦结果或退出。

浏览器输入engi筛至Engineering，Down/Enter选择后关闭且标签正确；已有Engineering时输入zzzz完整保留焦点、出现空结果，Escape关闭后Engineering保留。搜索padding7×11、圆角13实测生效；初版圆角被BaseInput高优先级规则覆盖，已修正。无console error/warn。触屏、完整IME实机、异步过滤、表单集成仍需专门验收。

## Search 表单边界

搜索Input内Enter阻止浏览器隐式提交，仍允许调用方onKeyDown先处理；结果行Enter继续由Radix负责选择。SearchForm使用portalled=false覆盖输入真正处于form内的情况。浏览器输入eng后Enter，输入焦点保留、提交结果仍尚未提交；Down/Enter选择engineering并关闭后，点击提交得到且仅得到department=engineering。

本轮系统Node运行全工作区typecheck时Playground以2147483651崩溃，未当作通过；使用稳定捆绑Node对Playground重跑通过，再单独核对UI/Docs。未宣称表单内Search的IME、移动端和完整无障碍语义已完成。

# 2026-09-23 状态校正与局部 hover

用户已明确确认：选中行只增加选择标记，默认文字/背景及 hover/active 背景与未选中行一致，check 使用主题高亮色。当前 input-effects.css 已移除选中行额外背景/文字/阴影，尾部标记消费 selected/icon-default；因此下文历史“普通 selected 语义等待决定”和 Checked 独立背景记录不再代表当前实现。菜单固定投影与效果开关的语义仍未确认。

本轮移除根节点 select/cascader-item-highlight-bg 的默认遮挡，菜单行在消费处依次解析显式旧覆盖、现有 aviala-interaction-filled-hover、内部 legacy 回退；不重新选择色彩语义。同步补齐其他共享消费者的回退，避免移除旧默认后产生无效声明。CSS 构建通过；用户暂停界面测试期间未做浏览器亮暗/悬浮复验，不标记视觉验收完成。

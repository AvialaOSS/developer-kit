# Cascader 迁移

2026-09-24：已重新核对禁用变体，按用户确认的分层规则接入 content-disabled 与 placeholder Token：根保持100%、内容55%、内部文字60%。ColorPicker 新增文字内层，其余沿用现有结构。显式旧覆盖保留，禁用占位符不重复淡化；旧禁用策略待定表述由本条取代。未进行 Computer Use 验证。

## 左右图标颜色

关闭隐藏实例子层跳过后回读 345:12488、345:12493、345:21754：标题项左右 Vector 都绑定 cascaderMenuItem/color/title/icon-default，普通项绑定 icon-default，选中项绑定 selected/icon-default。Web 左右图标已从继承文字颜色改为各自组件 Token，旧普通/标题/选中前景覆盖仍分别优先。没有改变功能区的已有图标规则、选中背景或透明度。CSS 构建与 UI 样式拷贝通过；本批实际颜色独立覆盖待浏览器验证。

同次读取到 Typeface 隐藏文字档位分别绑定 heading-default/caption-default；当前菜单默认正文为 Text，不能把这两种 Token 强行套到所有正文。自定义 label 的 Typography/Typeface 扩展消费仍需单独定义和核对。

## 输入框首轮尺寸

只读定位Information Collect的Cascader Input 345:11744（20变体）、Menu Item 345:12487、Menu348:13915、Group345:16552和Group Group345:20543。核对regular345:11745/big345:11782：外框padding0×10/0×14、gap6/8、slot-padding-y6/10，Figma高度30/38。所有直接子层已读取，未根据Select名称推定绑定。

接入8项两档gap、padding-x/y、slot-padding-y；输入内容和图标槽使用各自旧覆盖优先，big不再写死padding-middle。颜色、border、radius、图标及透明度尚未迁移。

ComponentSpacing浏览器在当前外层移动密度字体下regular/big高度38/46（旧1px布局边框仍存在，尚未完成设计高度对齐）；组件覆盖padding3×17/gap11、field-py9均生效；旧覆盖px19/gap13/field-py5优先。自定义间距下选择中国/海南省/三亚市正常关闭且显示新路径。CSS生成及Docs类型检查通过。

后续需要输入框剩余属性、独立项目八模式、菜单/分组/列结构、键盘/表单/多选及所有相关复合消费者验收；不把这8项计为组件完成。

## 输入框外观与图标

只读补充345:11893/11967/12041/12115及激活节点。确认外框默认/激活/禁用背景、文字、图标色、普通/round radius、icon-width/height、border-width/border-active、shadow-default。激活strokeAlign=OUTSIDE，内部阴影y=-0.5、blur0且颜色绑定组件Token。接入共20/22项，禁用及placeholder透明度语义暂保留旧行为，未擅自解决填充文字叠加透明度。

边框改为不占布局的外描边，默认不再加2px高度；图标槽采用content-box，glyph默认组件宽度，显式档位兼容。错误态沿用destructive颜色，描边改为box-shadow保持可见。

浏览器当前Mobile Friendly两档高度36/44，glyph20、slot内容高24；新覆盖半径13、glyph22/slot28、背景220/230/240、文字30/50/70、图标80/40/100生效，整体高52。展开背景240/230/220、外描边40/90/60宽3，内部底阴影保留，高度仍52。CSS生成及Docs类型检查通过。独立项目Default/八模式、禁用背景和错误态专门回归尚需补齐。

## 输入框八模式矩阵

ProjectModes独立项目测试2尺寸×2圆角×4状态（空/填充/禁用/错误），共16组合×8模式=128。Default高度30/38、图标16；Mobile Friendly高度36/44、图标20；半径8/99。亮暗背景240/239/239与37，文字38/37/37与213，禁用根opacity仍0.55，明确不是已解决的透明度冲突。

普通与禁用底阴影ON=0.04，OFF=0。发现错误态根部默认input-shell-error-shadow在外层冻结，已移默认至legacy并让Cascader本地解析错误描边+组件底阴影；其他组件保留旧回退。修复后Dark/Default/OFF四个错误变体均底阴影alpha0、错误描边rgb255/130/138（原固定外层为255/29/78）；效果开关只影响装饰阴影，不隐藏错误提示。新增Story的Docs类型检查与CSS构建通过。

## 菜单、列与分组首轮

只读核对348:13915菜单6项Token（padding0、gap0、圆角/背景/描边）、345:20543列上下padding4及分隔线色、345:16552分组padding0×6/gap4。接入6+2+3共11项；对应旧全局默认改为内部legacy，显式cascader/select覆盖继续优先。分组内分隔线4项仍待下一轮迁移。

MenuTokens浏览器实际菜单padding7×5、radius13、bg220/230/240、border40/90/60；列间gap9，两列py11，第二列左线90/60/80；分组padding3×17/gap8。CSS构建及Docs类型检查通过。菜单项仍有旧颜色/尺寸/字体，菜单阴影亦未完成效果适配，不宣称暗色菜单整体已完成。

## 分组内分隔线

依据此前只读确认的345:16515/345:16516绑定，接入divider padding-x、padding-y、padding-y-end及divider-default四项Token。由居中渐变改为独立线条，支持非对称上下留白；显式cascader-menu-border/select-menu-border仍优先。

MenuTokens增加第二组及分隔线覆盖。浏览器验证高度14px、线条top5px、左右各12px、线宽1px、颜色rgb110/70/90；末尾组的分隔线保持隐藏。CSS生成和Docs类型检查通过。菜单项颜色/尺寸、菜单阴影及完整八模式仍待继续。

## 菜单项基础属性

依照此前345:12488/345:12493/345:21754读取的绑定，迁移padding-x/y、title padding-y-end、radius、普通/标题/选中文字及选中背景。尾部选中标记使用selected/icon-default。旧cascader默认移到legacy，旧select的selected-bg/label留白默认同步移到legacy；Select、导航和List保留原回退，显式旧覆盖优先。

MenuTokens浏览器验证普通/选中行padding7×13、radius9，标题底部11；普通文字30/50/70、标题90/50/100、选中文字40/80/60及背景200/230/210。旧覆盖行padding4×21、radius15、文字100/60/40均优先。无浏览器错误，CSS构建和Docs类型检查通过。图标尺寸、共享字体在局部主题下的解析、选中阴影及八模式仍未完成。

## 图标、徽标与共享字体

依据已有Figma绑定接入普通/标题icon-width与icon-height、功能图标普通/选中颜色、badge padding-x。默认图标通过组件宽度渲染；显式level/biggerSize继续原档位。功能图标支持同样规则。菜单项与标题字体移除根部冻结默认，在当前位置解析共享Typography。

MenuTokens浏览器：普通glyph22/槽高30，标题glyph18/槽高26，功能glyph22/槽高30，徽标px6；显式caption biggerSize glyph18优先。当前Mobile Friendly普通文字18/24、标题16/20。CSS生成及Docs类型检查通过；局部项目八模式及更完整键盘回归尚待完成。

## 菜单独立项目八模式

新增MenuProjectModes，普通、标题、选中、禁用及其他项在8组合下取浏览器样式。普通字号14/18行高18/24、图标16/20；标题12/16行高16/20、图标14/18。亮暗普通文字38/37/37与213，标题97/96/96与142，选中背景255/198/182与136/60/52。

发现选中阴影冻结于外层。只读再次核对345:21754阴影为y=-0.5 blur0，变量2448:38960确认为cascaderMenuItem/color/shadow-default；移除根部默认遮挡并接入自有Token。再次八模式验收ON alpha0.04/OFF alpha0。菜单外投影348:13915仍为无绑定固定样式(y5 blur20 alpha0.06)，未擅自决定转换。标题button排除Tab顺序，避免弹层默认焦点落入不可选标题。

重载浏览器初始焦点Normal；ArrowDown到Selected，再ArrowDown跳过Disabled到Other，标题tabIndex=-1。Docs类型检查通过。

## 搜索行

只读确认460:41506外层绑定search padding-x/y与菜单项radius，子BaseInput460:41542四角绑定search/radius，其他属性使用BaseInput自身Token。新增公开CascaderSearch及Props，复用Input并接入三项搜索Token；过滤和空状态由调用方控制，示例保留完整options以确保选中标签正确。

浏览器Search验证覆盖padding7×11、radius13；zzz空结果后仍能继续输入engi，ArrowDown进入Engineering，Enter选中并关闭；重开后Escape关闭。无控制台错误，Docs类型检查及CSS构建通过。输入法、嵌套表单、跨列/异步过滤和完整无障碍仍未验收。

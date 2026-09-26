# List Token 迁移

2026-09-24 用户确认并实施：ListItem 自身保持 0 圆角，移除首尾项圆角覆盖；内容顶部分隔线与尾部竖线 Default 使用 neutral-2、Deep 使用 neutral-3。 Figma 已通过 API 修改或确认；Tokens 构建、ThemeCat 网页与插件构建及 2 项包入口一致性检查通过；本轮未运行 Computer Use 验证。以下旧记录中的待确认项以本条为准。

2026-09-23 重新只读核对全部 18 个主变体，内容顶线仍交替绑定 neutral-2/3，与历史记录一致。完整节点及引用证据见 list-divider-bindings.json。已通过 Ask 请求选择逐变体保留或统一 Default/Deep 规则，答复前不改语义。

同轮补查尾部独立竖线：大部分跟随顶线的 2/3 级别，但 Default/Action/default、Deep/Action/shaped、Deep/Action/none 使用 divider/border-neutral-1-default。不能直接将顶线的规则套用到竖线；若选择统一顶线，竖线仍需保留原绑定或另行确认。

文字角色修正：ListItem、Alert、Feedback 的 Typeface 颜色/字重选择器改为 data-line 角色，避免省略主标题后说明被 first-child 当作标题。三个真实组件的无标题说明用例与两项 Typeface 用例通过；CSS 构建和 Docs 类型检查通过。分隔线颜色冲突仍待用户选择，本轮未改其语义。

状态：容器、标题和列表项布局首轮接入，完整验收尚未完成。

## 设计证据

Navigation617:56609，List集合2053:27650：Default738:148304、Deep2053:27923。根gap8绑定list/size/gap；外标题738:148281 gap10/padding0×12/radius0绑定heading系列；内标题738:148243 gap6/padding0/radius8绑定title系列，文字I738:148244;168:150;128:105绑定list/color/text-default。内容槽738:148045 gap0/padding0/radius10绑定content系列。

## 实现与验证

ListTitle补充内层title容器，使heading/title属性可以独立消费。List根、ListTitle两层、ListGroup布局接入对应Token；显式list-gap/list-title-px/list-title-fg/list-group-radius优先。旧全局默认移到内部legacy名；ListSeparator默认间距仍通过list-size-gap回退。ListProps排除原生title类型，支持ReactNode。

浏览器Light/Default默认根gap8、heading gap10/padding0×12、title gap6/radius8、content gap0/radius10。自定义后根gap13、heading padding3×17、title gap9/padding2×5、content gap7/padding6×11/radius19、标题rgb(18,52,86)；旧覆盖后根gap4、heading横向8、content radius12、标题rgb(96,48,128)。无浏览器error/warn，CSS生成与Docs类型检查通过。

## ListItem 布局首轮接入

只读核对List item集合647:87555，18变体（Select/Aciton/Switch × shaped/default/none × Default/Deep）。重点读取1434:32416及1482:20325：根gap14；有图标根start14、无图标根start0，内容start分别0和14；内容gap10/paddingY8/end14，icon gap10/padding8×0，head gap10，last与more各gap10且绑定独立Token。

根留白、gap、radius，图标区域留白/gap，内容区域gap/留白，head、last、more间距已接入对应Token；显式旧布局变量保留优先级。首尾项圆角改用list-size-item-radius。title子容器、文字颜色、内部图标形状及控件尚未接入，不以这次布局修改声称完整完成。

Light/Default浏览器自定义：shaped根start21/gap19、icon padding12×3、内容padding9/17/9/0；none根padding0、内容padding9/17/9/23。启用旧list-item-pl6及content-py5后，shaped根start6、none内容start6，两者内容Y5，独立Token其余覆盖保持。尾部last/more分离尚需独立渲染样例；RTL待验收。

## Default / Deep 与文字颜色

List/ListGroup/ListItemGroup/ListItem新增appearance=default|deep，项默认继承最近ListGroup，可显式覆盖；独立项默认Default。使用React Context，避免仅按祖先CSS选择器误覆盖嵌套组。导出ListAppearance类型。组容器沿用铺背景行为，并随外观使用同一背景Token；它并非此次证明Figma内容槽具有独立fill。

ListItemGroup补充显式displayName，修复属性文档生成无法识别的问题；定向docgen检查确认上述四个入口均包含appearance枚举。

只读读取1434:32416、2053:28970，分别绑定listItem/color/default/background-default和deep/background-default。内部Typography各文字级别绑定heading/text/description；当前API的textCaption消费text-default和description-default，字体指标仍共享。显式list-bg与list-item-fg保留优先。选中态沿用原Web状态变量，正文/说明跟随选中前景；它不是新推断的Figma选中映射。

浏览器Deep组内两项继承Deep，第三项显式Default：Light背景分别249/248/248与254/253/253；Dark分别37/37/37与26/26/26，正文随主题为38/37/37与213/213/213。Dark自定义Deep背景228/239/247、正文18/52/86、说明112/80/32均生效；旧背景213/229/245覆盖两外观，旧正文96/48/128优先。选中项在两轮覆盖下仍保持旧选中背景255/198/182及前景205/57/35，没有被appearance规则遮蔽。独立ListGroup/ListItemGroup和嵌套组仍待专门验收。

## 后续工作

### 分隔线尺寸与颜色冲突

18变体内容顶线读取结果不是统一颜色：Default顺序Select/shaped、Action/shaped、Switch/shaped、Select/default、Action/default、Switch/default、Select/none、Action/none、Switch/none依次为neutral-2/3/2/3/2/3/2/3/2，Deep恰好反转。已Ask询问统一Default2/Deep3、严格逐变体保留或等待设计统一；未按近似名称擅自映射。尾部1434:32425为VECTOR，stroke-width绑定listItem/size/divider/stroke-width、height绑定divider/height14，颜色为divider/border-neutral-1-default；其余尾部变体仍待核对。

内容顶线宽度已接入content/stroke-width，竖线宽高接入独立divider尺寸。保留首项默认无内容顶线以及showTopDivider=false，旧list-item-divider-height优先。Dark/Default浏览器自定义内容线3px、竖线4×20；六项内容线宽依次0/3/3/3/3/0，首项和显式隐藏项正确；旧高度覆盖后竖线4×11。颜色暂沿用旧list-item-border，未声称完成颜色迁移。

ListItem扩展文字层级、分隔线颜色与控件仍待迁移。首项另绑定list/size/item/stroke-width与list/color/item/border-default；不能与内容区分隔线混为一谈。

list/color/heading-default和description-default对应扩展文字层级尚无现有ListTitle API；字体指标继续共享Typography。交互态、亮暗/密度/效果轴、RTL与窄屏、旧泛化间距继承仍需后续验收。本记录不能作为全组件或List完成证明。

### Shaped 前导图标

Figma 1434:32352 为 IconPlace（theme / Primary / Rounded ON），绑定独立 width、height、gap、padding-x/y、rounded/radius 以及 theme/primary 的背景和图标颜色；内层 I1434:32352;800:146227 宽度绑定 iconPlace/size/icon-width，当前为 16。Web 带底形容器与直接 SVG 字形现消费这些共享 Token，替代原先固定 36px 容器和 20px 字形。显式 list-item-icon-shaped-size/bg/fg 继续优先；原全局默认改为 legacy 记录，避免遮蔽新 Token。未扩展 IconPlace 公共 API，也未改变用户传入图标的选择。

浏览器验证：Dark/Default 默认容器36×36、padding1×0、radius99、字形16×16，背景255/138/113、前景2/2/2；Light 前景254/253/253、背景255/85/50，符合共享白色语义随亮暗反转。自定义容器42×44、字形18×18、radius7、背景32/64/96、前景213/229/245均生效；叠加旧覆盖后容器32×32、背景96/48/128、前景245/229/213。页面无 warn/error，组件构建与文档类型检查通过。此处尚未证明普通图标、非 SVG 自定义图标或全部模式矩阵完成。

### 普通前导图标与标题内层

再次只读核对1434:32416：普通图标1434:32540的字形绑定size/size-semilarge、line-height/line-height-middle，颜色为text/text-normal-title-black；title容器1434:32421为垂直布局，绑定listItem/size/title/gap和radius，其内Typeface保持独立。Web补齐该容器，没有把title gap施加到Typeface文字行上；普通图标接入共享尺寸与颜色，显式旧list-item-icon-default-size和list-item-fg仍优先。

浏览器Light/Default普通图标22×22、标题gap6/radius8；Mobile Friendly为22×26，SVG跟随容器。自定义共享指标后28×30、颜色32/64/96，标题gap11/radius13；叠加旧覆盖后19×19、颜色96/48/128。Dark/Mobile Friendly为22×26、颜色255/255/255。构建、文档类型检查通过，新title类在组件和CSS双向匹配。热更新期间记录一次Storybook预览初始化时序错误，需区分开发服务器日志与组件运行错误；未以此声称完整交互验收通过。

### Action 尾部结构

只读核对六个Action变体1434:32350、1434:32416、1482:20325、2053:28935、2053:28970、2053:29003：均为last包含more与箭头，more包含ButtonGroup和竖线，ButtonGroup的按钮槽有独立间距。主按钮primary/regular，第二按钮noBackgroundCustom/regular/iconOnly。Web恢复这几层结构并消费button-group-size-gap/button-slot-gap；显式旧list-item-trailing-gap仍覆盖last、more和按钮槽。第二按钮复用既有Button无底色实现，自定义action/secondaryAction入口保留。

箭头1434:32426容器高度绑定line-height/line-height-regular，内部字形宽度size/size-regular，颜色text/text-normal-text-black；Web移除固定18px尺寸，保留原RTL左右箭头选择。Dark/Default浏览器容器14×18、字形14×14、颜色213/213/213；Mobile Friendly为18×24、字形18×18。默认last/more/button-slot间距10/10/8，自定义17/13/5独立生效。构建和文档类型检查通过，新增结构类双向匹配。按钮本身的状态矩阵、嵌套控件交互、RTL及自定义尾部仍需后续验收；分隔线颜色冲突保持待确认。

### 嵌套外观与行内交互验收

增加InteractionBoundaries故事：Deep列表内嵌Default ListGroup，包含显式Deep项，并提供行、按钮、开关独立状态。Light浏览器确认内层Default背景254/253/253，显式Deep及后续继承Deep项背景249/248/248，内层选择没有泄漏到外层后续项。

发现并修复非链接行的点击冒泡问题：修复前在子按钮按Enter同时触发行和按钮回调（1/1）；修复后为0/1，开关Space只将OFF切到ON，行计数保持0；行自身Enter和点击标题分别使行计数变为1和2。行点击忽略内部原生/ARIA交互控件及已preventDefault的事件，不阻止事件继续传给更外层应用处理器。该证据覆盖非链接行，href行、禁用子控件、Select弹层及完整RTL状态仍待专项验收，不能据此标记List完成。

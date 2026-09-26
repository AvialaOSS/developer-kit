# Feedback 组件 Token 迁移

状态：布局和颜色首轮接入，内部 Link、阴影和完整模式验收未完成。

## 设计证据

只读检查 Feedback 集合553:58620，共18变体；Normal没有Primary。重点读取Default信息553:58621、Small信息553:58630、Primary信息1179:22199。

根gap0/padding0、按尺寸radius、stroke-width均绑定Feedback Token。info布局gap8/padding8×10；Icons width22/height22分别绑定icon-width/icon-height；Typeface gap绑定text/gap。已逐ID核实变量名。

## 实现与验证

- 根间距、留白、圆角、描边、info布局、图标宽高及Typeface间距接入组件Token。旧全局布局默认值移至内部legacy名，显式旧覆盖优先。
- 无说明标题不再被last-child说明选择器错误覆盖；HTML title排除后支持ReactNode。
- Storybook ProjectModes提供18种设计组合及一个无说明标题样例。Light/Default默认info gap8/padding8×10，标题独立颜色rgb(18,52,86)。
- 18组合自定义后info gap13/padding11×17、图标26×30，9个双行Typeface gap5；加入旧覆盖后gap7、图标24×24，证明旧覆盖优先。
- CSS生成与Docs类型检查通过。此轮没有证明整个组件迁移完成。

## 待完成

阴影/效果轴、内部Link和关闭按钮仍需逐项接入。字号、行高和字重保留共享Typography。长文本、RTL、全部模式、全部旧颜色入口和交互验证尚未完成。

## 颜色接入证据

逐项读取18变体的根fills/strokes、文本及状态图标的paint变量名。背景、边框按type/mode消费Feedback Token；Default与Primary分别消费文字和说明Token。Primary Wrong Default节点1179:22223使用wrong/default/icon-default，Small节点1179:22229使用wrong/small/icon-default，保留两个独立覆盖入口。其他Primary图标同样按类型接入，不再统一固定白色。显式旧颜色变量优先，旧全局默认移至内部legacy名。

设计Default尺寸标题字体为Bold，Small为Regular，继续共享Typography字重。Small/Primary标题曾被Typography白色规则覆盖，已提高组件标题规则优先级。

浏览器Light/Default：18种标题自定义均为rgb(18,52,86)，说明均为rgb(112,80,32)；Primary Wrong两尺寸图标分别为rgb(96,48,128)和rgb(32,64,96)。启用旧覆盖后全部标题及Primary图标均为rgb(64,96,32)，切至Dark/Mobile Friendly后标题仍保持旧覆盖。关闭覆盖后，18种背景与边框的RGB分量均匹配当前Token解析值；本次比较未单独检验alpha。颜色覆盖样例仅证明传递与优先级，不代表对比度验收。

## 盘点差异

### 内部 Link 检查

操作链接553:58625、553:58634、1179:22203、1179:22209均为Text/noBackground，文字绑定link/color/text/noBackground/text-default。关闭按钮的默认模式图标为未绑定黑色，属于与Alert相同的待决语义；Primary节点1179:22204、1179:22210明确绑定text/text-normal-text-white。

Primary关闭图标已在内部Link图标节点上消费共享文字前景色，显式feedback-close-fg-on-primary优先，避免Link图标规则遮蔽。Mobile Friendly下8个Primary图标在Dark为rgb(2,2,2)、Light为rgb(254,253,253)，符合已确认的白色命名Token随主题反转规则。显式旧覆盖后8个均为rgb(96,48,128)。

尺寸待Ask：默认关闭槽18×18、横向padding1、图标16×16，绑定Link尺寸；Primary槽14×18、图标14×14，只有高度绑定共享行高，宽度未绑定。尚未擅自把Primary尺寸改为Link尺寸，旧14px实现暂留。操作链接及关闭的完整交互/RTL仍未验收。

### 长文本与键盘验证

新增320px、长无空格标题/操作、RTL开关与回调计数。Light/Mobile Friendly初始18种组合的内容区全部横向溢出、关闭按钮均被挤出。操作链接及内部label改为允许收缩，文字使用overflow-wrap:anywhere，不修改布局Token值。修复后Light/Mobile Friendly的LTR/RTL下内容区溢出、操作label裁切、关闭按钮裁切均为0；Dark/Mobile Friendly及Dark/Default的RTL样例内容区和操作label也无溢出。操作与关闭分别按Enter，回调计数从0到2。本例关闭只计数，未验证受控卸载和焦点转移；追加Light/Default的RTL样例内容区和操作label也无溢出；更多宽度仍待检查。

追加18变体图标检查：全部使用Regular/fill；Normal也使用symbol_informationCircle。网页已改为上述图形。浏览器读取18个默认状态SVG路径与图库RegularFill路径逐项比较，全部匹配；Normal两尺寸与Information形状一致。额外传入GeneralNotification/Light/default样例也与图库对应路径匹配，证明自定义icon未被替换或强制改为fill。Docs类型检查通过，浏览器无error/warn记录。

全部变体效果样式ID为S:7962be2ae359e855be7471db887748d40de06e0b,，单个DROP_SHADOW offset0/6、radius18、spread0、黑色alpha0.08，无变量绑定。不能把该固定效果未经确认映射为现有ON/OFF变量；继续按已有共享效果策略待决项处理。

Rate/rateIcon在标准项目存在Token，但当前公共入口与组件源码未发现评分组件实现。它属于设计/代码组件覆盖缺口，不能依据Token存在就宣称完成迁移；新建组件的行为范围需要另行确认。

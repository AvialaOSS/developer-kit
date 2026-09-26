# Alert 组件 Token 迁移

2026-09-24 用户确认并实施：全部内置 Link 统一为 noBackgroundCustom，包括快速操作、关闭和底部主次操作。 Figma 已通过 API 修改或确认；Tokens 构建、ThemeCat 网页与插件构建及 2 项包入口一致性检查通过；本轮未运行 Computer Use 验证。以下旧记录中的待确认项以本条为准。

状态：五类型×两外观×两尺寸完成首轮接入，尚非完整验收。

## 设计证据

2026-09-21 只读核对 Feedback页 Alert集合527:56855，重点读取527:56850、527:57144、1571:21077。API info/error/neutral 分别对应设计 infomation/Wrong/Normal，不改写源命名。

外层gap0/padding0/radius/stroke绑定Alert；info行gap8/padding6×8；图标容器width16/height18/paddingY1；Typeface有text/gap与独立标题、说明颜色。隐藏Action527:56797 padding0/10/8/30，各方向和gap均有绑定。

## 实现

背景、default边框、状态图标按类型使用组件Token，Light仍保留透明边框占位。外层、内容行、图标、文字gap、操作区接入独立Token；显式旧Alert变量优先，旧全局默认移到内部legacy名。

标题无说明时不再被last-child说明选择器覆盖；Small标题使用足够优先级避免通用Typography规则遮蔽。AlertProps排除HTML title类型冲突。字号/行高/字重继续共享基础Typography，未增加字体指标组件Token。

## 验证

- CSS生成、Docs类型检查通过。
- 浏览器渲染20种组合和一个无说明标题；Light/Default的五种Default背景/边框正常解析，Light外观边框透明。
- 默认图标16×18；无说明标题独立颜色rgb(18,52,86)正确，没有误用说明色。
- Dark/Mobile Friendly自定义覆盖：全部20种标题rgb(18,52,86)，所有可见说明rgb(112,80,32)；内容gap13/padding6×15，图标20×24，Action padding0/10/8/40。
- 操作链接Enter触发回调一次。

## 未完成

关闭/快速操作内部Link Token及覆盖兼容尚需逐属性核对；当前保留旧close变量。自定义图标、无图标时操作区缩进、长操作文字与全部模式组合待验收。Light透明边框占位与Figma描边几何仍需进一步核对。不能用Token引用数作为完成率。

## 内部 Link 与次操作覆盖

追加模式验证：320px、RTL、长无空格标题及三个长操作，20种组合在Dark/Default、Light/Default、Light/Mobile Friendly均无内容区或底部操作区横向溢出；Light两种密度的操作label也无裁切。结合前轮Dark/Mobile Friendly验证，已覆盖这四种颜色×密度组合的该布局样例，未覆盖效果轴。

快速操作为Text，主次操作为Caption：Default字体分别14px/12px，Mobile Friendly为18px/16px。Light主题快速/主操作颜色rgb(205,57,35)，次操作rgb(97,96,96)；Dark主题分别rgb(255,174,155)与rgb(142,142,142)。Dark/Default读取的实际颜色与各自Link Token解析值一致。此项只验证默认态，不能替代hover/active及显式Text/Caption分离覆盖验收。

Storybook加入独立效果开关。Light/Mobile Friendly、LTR、320px长操作样例中，从ON切至OFF后60个操作链接的实际颜色、宽高均保持一致。此检查证明效果轴没有误改该样例的操作布局/颜色，不代表所有效果属性和三轴组合已完整验收。追加Story类型检查通过。

Figma 次操作527:56820使用Caption/noBackgroundCustom，文字绑定link/color/caption/noBackgroundCustom/text-default。网页次操作直接消费对应Link Token；旧全局次操作默认值改为内部legacy名，避免遮蔽新Token。显式alert-secondary-action-fg仍优先，选择器优先级已修正，避免被Link规则覆盖。

浏览器在Dark/Mobile Friendly下检查五类型×两外观×两尺寸：启用新Token覆盖后，全部20个次操作链接及内部Typography均为rgb(96,48,128)；再启用旧变量覆盖，全部切换为rgb(32,64,96)。页面正常渲染，未见框架错误覆盖层，浏览器未记录error/warn。自定义测试颜色仅验证覆盖传递，不代表最终配色或对比度验收。

关闭527:57284的Figma变体为Text/noBackground/IconOnly，但内部图标是未绑定变量的固定黑色，与网页noBackgroundCustom存在冲突。已通过Ask询问采用中性Link、主题色Link还是新增Alert关闭Token；决定前不改变其语义。快速操作527:56735为Text/noBackground，主操作527:56800为Caption/noBackground，仍需完成逐属性验证。

## RTL 与长标题验证

操作区改用逻辑start/end留白。RTL下新start/end正确互换物理边，但显式旧actions-pl/actions-pr保持原来的物理左/右语义。

Storybook新增方向、320px窄屏长标题、旧留白覆盖开关与次操作。Dark/Mobile Friendly、自定义Token、RTL二十组合根及body均无横向scroll溢出；新start40/end10解析为右40/左10。旧pl12/pr7在RTL/LTR均解析为左12/右7。LTR对应二十组合也无根横向溢出。

关闭和次操作分别用Enter触发，回调计数由0变2。本例回调只计数，不声称已验证受控卸载或焦点转移。上述窄屏结论只覆盖本轮长标题+短操作文字样例。

追加长操作样例：Dark/Mobile Friendly、320px、20种组合同时提供长无空格标题、快速操作、主次操作。原快速操作宽465px使318px内容区scrollWidth达到549px，关闭按钮被挤出。快速操作与内部label现在允许收缩，文字overflow-wrap:anywhere；底部操作区允许换行，单个操作限于可用宽度。LTR/RTL下内容区、操作区横向溢出与label裁切均为0，快速操作高度120px，文字完整换行；Enter使计数0→1。此处换行是Web约束适配，未修改Figma Token值；全部模式、其他宽度及自定义图标仍待验证。

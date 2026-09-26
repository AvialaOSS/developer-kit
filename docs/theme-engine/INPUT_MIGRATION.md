# Input / NumberInput 组件 Token 迁移

2026-09-24：NumberInput 原组件197:3237的16个禁用变体根透明度全部为1，内容槽55%、内部Typography60%。Web 已接入 numberInput 的 content-disabled / placeholder 组件 Token，分层处理文字、图标、徽章和步进区，禁用占位符不再重复淡化。保留显式旧覆盖；未进行浏览器验证。

状态：BaseInput 20/22项几何、颜色、描边及图标Token已接入；NumberInput 22/24项接入并完成首轮独立覆盖验证，两者透明度冲突仍待决定。

## 设计来源

Information Collect页165:1362；BaseInput集合165:1365有20个变体，NumberInput集合197:3237有40个变体，后者还包含Default/Monospaced文字风格。只读核对BaseInput regular默认165:1518、big默认212:4409及active165:1442的根节点与插槽绑定。

BaseInput根节点横向padding10/14、纵向0、gap6/8；内部输入、图标及徽标插槽分别绑定slot-padding-y6/8。外层padding-y与内部slot-padding-y不可合并。普通/圆角分别有独立radius Token。尺寸和行高仍由共享Typography决定，不新增组件字体指标。

## 实现

Input外层增加稳定data-input-kind="text"用于限定BaseInput消费。两档padding-x/y、gap、slot-padding-y及普通/圆角共10项组件Token接入。显式旧input-px/gap/field-py/slot-py/radius继续优先。

全局旧几何默认移至_legacy名称；Input、NumberInput、Cascader、DatePicker、ColorPicker现有CSS读取增加legacy回退，以免全局默认压住新组件Token。其他组件未在本次自动映射到BaseInput。

## 验证

ComponentGeometry在当前Mobile Friendly环境：普通文本框36px高、padding0×10、gap6、radius8；大号圆角40px高、padding0×14、gap8、radius99。新Token覆盖外层padding3×17、内部纵向9、gap11、radius13，文本框48px高；同一区域NumberInput仍为36px、padding0×10、内部6、gap6、radius8，未受BaseInput覆盖影响。

旧覆盖padding-x19、field-y7、gap12、radius15在Input和NumberInput同时生效，两者高38px。Tokens构建与五工作区类型检查通过。

## 剩余

- placeholder/disabled透明度未迁移；部分透明度语义冲突待决定。
- 默认图标插槽在设计中为0.9 opacity，网页当前默认1；没有对应组件Token，后续需确认规范，不能默认添加近似绑定。
- 设计没有单独hover或error变体，网页已有行为需另行决定组件Token或兼容策略。
- NumberInput嵌套步进按钮的具体Button变体样式及八模式尚需验证；已补充未截断的属性读取，见下。
- Cascader/DatePicker/ColorPicker兼容回归尚待完成；透明度待决定的状态不计为设计验收完成。

## 颜色与状态首轮

只读核对165:1518、165:1442、165:1522、197:2529的可见插槽和内部文字绑定：文字与图标分别消费text-default/icon-default；disabled根背景有独立Token，外层opacity仍1。input area禁用opacity0.55；内部Typography在禁用Empty和Fill中都绑定placeholder opacity0.6，而图标插槽始终0.9且没有透明度绑定。这与网页现有行为不同，已Ask询问，不擅自更改该冲突。

本次增加默认/active/disabled背景、文字、图标、active边框色、边框宽度和阴影色共8项。底部阴影保持设计offset y=-0.5、blur/spread0。旧input-fg、背景、描边、shell/surface-shadow显式覆盖继续优先；尚未迁移的CSS消费者添加legacy默认回退。input-icon-fg可独立覆盖图标。

ComponentColors浏览器核对：新背景220/230/240、文字30/50/70、图标80/40/100、阴影70/80/90生效；disabled背景200/210/220。聚焦后背景240/230/220、边框40/90/60且宽3px，底部阴影保留。相邻NumberInput仍为原背景240/239/239和文字38/37/37。旧覆盖背景210/190/170、文字50/70/90在两类输入上同时生效。

Tokens首轮构建进程异常退出（3221225477）后独立重跑通过；并行类型检查中Icons进程也异常退出，其余四工作区通过，Icons独立重跑随后通过。最终五工作区均取得成功结果。CSS类名检查仍只有原有5项字符串误报。

## 图标尺寸

renderSlotIcon新增可选组件默认尺寸参数，仅Input启用。未显式指定level/biggerSize时，图标实际SVG内联尺寸使用组件Token，避免旧共享图标默认覆盖CSS；显式level/biggerSize仍沿用已有图标档位。旧input-slot-icon-size及input-icon-slot-height继续支持覆盖，其全局默认移到legacy并为其他CSS消费者补回退。

BaseInput插槽高度是icon-height加上下slot-padding-y，SVG图形本身保持icon-width的正方形。ComponentIcons在Mobile Friendly下默认图标18、插槽36（24+6×2）；新Token覆盖icon-width22、icon-height30得到SVG22、插槽42。显式caption/biggerSize=false得到SVG16，仍在42高插槽内；相邻NumberInput图标仍为共享默认20、整体高36。旧覆盖图标24、icon-slot-height32得到插槽44。左右默认图标一致。

CSS产物生成成功。系统Node运行UI类型检查异常退出2147483651，改用应用附带Node（同为24.19.0）独立检查通过；没有为绕过错误修改类型或关闭检查。

## 独立项目八模式与行高修复

ProjectModes包含两档尺寸×两种圆角×filled/empty/disabled，共12个输入及旧覆盖。首轮发现Default项目嵌入外层Mobile Friendly环境时，input-line-height在外层已解析为24px，尽管局部Typography行高为18px，输入框仍高36/40px。将全局input-line-height默认移至legacy，其他消费者补回退，BaseInput文字直接消费局部共享typography-text-line-height，显式input-line-height仍优先。未引入组件字体指标。

修复后八模式逐项断言全部12项输入的高度、图标宽度、圆角，共96组合无不符；Default行高18、常规/大号高30/34、图标14；Mobile Friendly行高24、高36/40、图标18。旧padding-x19、radius15和文字50/70/90在八模式不变。

Light默认背景240/239/239、文字38/37/37；Dark默认背景37/37/37、文字213/213/213。ON底部阴影alpha0.04，OFF为0。Dark Default焦点背景黑色、描边255/138/113且宽1px，底部阴影保留。空值及禁用透明度仍是当前网页行为，不算已解决设计冲突。故事UI类型检查和CSS产物生成通过。

## NumberInput 独立迁移

补充只读核对197:3253、212:4560、197:3238、197:3283、197:3298全部可见插槽绑定，以及197:3259/197:3255和Monospaced345:9314的文字/图标填充。NumberInput拥有独立背景、边框、阴影、文字和图标Token；big slot-padding-y为10px（BaseInput为8px）。stepper gap为0、padding-y6，两个子按钮均分剩余高度，默认regular各9px、big各13px。步进按钮自身绑定Button noBackground/small/iconOnly，并不是NumberInput图标尺寸Token的消费者。

NumberInput独立data-input-kind=number映射22项Token，保留共享旧覆盖。两档外层padding、gap、slot-padding、圆角、图标、背景/文字/阴影/焦点描边和步进区域gap/padding均接入。共享字体指标直接使用局部Typography，避免继承外层行高。透明度暂未迁移：禁用Fill也叠加placeholder，与BaseInput存在相同文字冲突；NumberInput禁用图标和按钮区则确实绑定0.55，与BaseInput不同。

ComponentTokens在Mobile Friendly环境：regular高36、big高44，图标18；步进区padding6，按钮分别12/16px高。新Token覆盖外层padding3×17、slot9、icon22/slot28、背景220/230/240、文字30/50/70，整体52px；步进区高46、padding5、gap2、两个按钮17px。同一区域Input保持36px、padding0×10和原颜色，未受NumberInput Token影响。旧padding-x19和文字50/70/90仍生效。

浏览器点击12→13→14，上限14时增加按钮disabled，ArrowDown回13并恢复增加按钮。控制台无错误，UI类型检查及CSS产物生成通过。步进区域首轮发现替换未写入，已修正并重新读取实际padding/gap/高度；不以初次尝试当作成功。

## NumberInput 嵌套按钮与八模式验收

步进按钮按 Figma 的 Button small/noBackground/iconOnly 绑定消费水平 padding、gap、半边圆角及默认/hover/active 背景。箭头沿用设计内部覆盖的基础 size-regular，而非 Button 通用 iconOnly 尺寸；移除原有负 margin。默认上下按钮宽22、高9/13，箭头14；Mobile Friendly 下宽26、高12/16，箭头18。

新增 ProjectModes 故事：两档尺寸、两种圆角、普通/等宽文字、filled/empty/disabled 共24项，另加旧覆盖。浏览器逐一切换亮暗×密度×效果的八模式，192组合的高度、圆角、步进按钮宽高和箭头宽度均无不符。默认 regular/big 高30/38，移动密度高36/44；八模式旧 padding-x19、radius15、文字50/70/90均保留。亮暗背景/文字及 ON/OFF 底部阴影随模式切换。

Dark Default 中两次增加到14后上限按钮禁用，ArrowDown到13恢复，再次增加到14禁用；读取当前 input.value 核对，未将初始 value 属性当成当前值。Storybook 页面正常渲染、无框架报错层，控制台无 error/warn。UI 类型检查通过。透明度语义冲突、共享消费者完整回归仍未完成。

## 共享消费者局部 Typography 回归

SharedConsumers 故事加入 Select、Cascader、DatePickerField、ColorPickerTrigger 和 Textarea 的 regular/big 对照。发现外层 Mobile Friendly 的旧行高已解析为24px，局部 Default 虽为18px，消费者仍使用外层值。默认 input-font-size 移到内部 legacy 名，消费者直接回退至局部 Typography；行高和图标槽高度也直接在消费处解析。显式公开覆盖仍优先。

实际浏览器修复前 Select/ColorPicker 高36/44、Cascader/DatePicker高38/46；修复后 Default 分别30/38、32/40。切换 Mobile Friendly 后分别36/44、38/46。Textarea 保留70px最小高度，实际文字行高随18/24变化。Select 下拉从草稿改为已发布正常，控制台无错误/警告，CSS产物生成与故事类型检查通过。

此轮只验证共享 Typography 的局部解析和基础交互，不等于上述消费者已迁移组件Token；它们的旧颜色、图标及弹层作用域仍需各自完整迁移和验收。

## 2026-09-23 局部 hover 引用修复

此前 `--input-bg-hover` 在 components.css 和 input-effects.css 的根作用域引用 BaseInput hover Token，继承进入局部主题时可能已解析成外层颜色。现将根默认移为 `--_legacy-input-bg-hover`，各消费位置按显式旧覆盖 → 局部 `--base-input-color-background-hover` → 旧默认回退解析。共享 Input/NumberInput、Textarea、Select、DatePicker、ColorPicker 链路一并更新；未改 Token 色值或透明度，也未替输入禁用文字作语义决定。

CSS 产物生成和四项静态/运行时及包入口检查通过。用户暂缓 Computer Use，本次没有实际 hover 渲染证据，仍需后续验证局部亮暗嵌套与显式旧覆盖。

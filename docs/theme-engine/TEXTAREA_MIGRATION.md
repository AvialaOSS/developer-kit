# Textarea 迁移

2026-09-23：沿用用户确认的输入控件按 Figma 图层结构实现。回读 301:6411 / 301:6426 / 301:6441 / 301:6456，禁用 Empty/Fill、Regular/Big 的 input area 与图标插槽均为 55%，内部 Typography 为 60%；Controller 独立保持 100%。CSS 已通过各自 Textarea 组件 Token 分层消费，填充值及占位文字均为约 33%，避免占位符再次叠加 60%；移除 Controller 的额外禁用透明度。旧 input-disabled-opacity / input-placeholder-opacity 显式覆盖仍保留。下文相同透明度待决定表述为历史记录；实际浏览器验证按用户要求暂缓。

## 设计证据

只读检查 Components / Information Collect / TextareaInput 301:6320 全部10个变体的外框，以及301:6381、301:6396、301:6441内部可见层级。regular外框padding0×10、gap6；big为0×14、gap8；圆角8。图标框14×18，上下padding6/10；文字区域使用相同slot-padding-y。字号、行高、字重仍绑定共享基础变量。控制区是独立Controller组件，不能映射为Textarea的badge属性。

## 已实现

19项Textarea Token接入：两档gap、padding-x/y、slot-padding-y，radius、icon-width/height，default/active/disabled背景、文字、图标、active描边和宽度、阴影色。旧textarea-radius和共享input覆盖继续优先。底部阴影保留既有-0.5px几何。未显式指定图标level/biggerSize时使用组件尺寸。固定70px最小高度和拖拽逻辑暂未更改。

## 首轮浏览器验证

ComponentTokens在Mobile Friendly下默认slot36/44，glyph18；新覆盖外框padding3×17、gap11、radius13、slot46、glyph22，背景220/230/240、文字30/50/70、图标80/40/100均生效。相邻Input保持原颜色；旧padding-x19、radius15、文字50/70/90生效。初测发现Typography样式覆盖文字颜色，增加消费选择器优先级后重新读取确认修复。可正常编辑文字。CSS产物生成、UI类型检查通过，浏览器无error/warn。

## 未完成

- Controller禁用状态语义验收；八模式基础布局/颜色与首轮独立覆盖/拖拽已通过。
- 八模式默认展示、焦点/禁用自定义覆盖及FormField布局组合已通过；未覆盖react-hook-form提交校验全流程。
- 禁用Fill内部Typography仍绑定placeholder0.6，与外层disabled0.55叠加为0.33，和网页0.55冲突；沿用已提出的输入透明度决策等待，不擅自改变。
- badge-padding-y没有当前React消费部件，不伪造消费；需核对隐藏设计分支与API范围。
- hover和error状态缺独立对应语义，继续保留旧行为并等待后续梳理。

## Controller 首轮

按已读取的内部绑定接入8项Controller Token：padding-x/y、radius、背景、文字、图标颜色及icon-width/height。保留textarea-controller-bg与textarea-counter-fg显式覆盖。2px内部gap、距底2px/侧4px定位目前没有组件Token，继续保留现有布局常量。文字区预留高度改为max(共享caption行高,icon-height)+2×padding-y，再加既有6px间隔，避免自定义控制区遮住文字。

Mobile Friendly默认框16×20、glyph16；覆盖padding3×7、radius9、框20×24、glyph20，控制区总高30，背景220/230/240、文字30/50/70、图标80/40/100均正确。旧背景210/190/170及文字/图标50/70/90有效。输入9字符后计数9/200，拖拽60×60使外框320×82变为380×142，文字保留。动态预留修复后默认/自定义底部padding32/42，文字底边距控制区上边均10px。控制台无error/warn，UI类型检查及CSS生成通过。

禁用状态中的Controller在Figma保持opacity1，网页原来是0.55；这仍需纳入输入透明度冲突决策，暂不改动。

## 独立项目八模式

ProjectModes覆盖两档尺寸×Controller开关×filled/empty/disabled，共12项。浏览器逐一切换亮暗×密度×效果，96组合中行高18/24、图标14/18、regular插槽30/36、big插槽38/44均正确。Controller默认框高16/20、图形12/16；所有组合文字底边距控制区上边10px，没有遮挡。Light文字38/37/37、背景240/239/239，Dark文字213/213/213、背景37/37/37；Controller文字97/96/96→142/142/142。阴影ON为alpha0.04、OFF为0。

Dark Default下聚焦背景黑色，输入9字符后显示9/200，控制台无error/warn；故事类型检查通过。普通Default控制区样例高70，Mobile Friendly带Controller为86（原生两行文字和底部预留撑高），这是最小高度而非固定高度，不宣称复刻Figma固定70px。库内无其他组件直接渲染Textarea，FormField组合仍待检查。

## 状态与FormField组合

StateTokens故事验证：焦点背景240/230/220、3px描边40/90/60、底部阴影70/80/90生效；禁用背景200/210/220生效，textarea及拖拽按钮均disabled。FormField提供错误时textarea的aria-invalid=true，显示原有错误描边；切换清除错误后aria-invalid移除。显式error=false的Textarea不继承父级错误。清除后输入“有效说明”，值及计数4/200正确。浏览器无error/warn，UI类型检查通过。错误状态继续使用既有错误语义，不将其算作已迁移的组件错误Token。

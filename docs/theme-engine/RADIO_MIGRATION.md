# Radio 组件 Token 迁移

状态：16项尺寸/布局与15项颜色/效果/文字 Token 已接入；整组禁用样式已修复，八模式基础矩阵已验证。完整交互/嵌入验收尚未完成。

## 来源

只读核对 Radio 261:3319、Radio Input 262:4643、Radio Input Group 262:4663。Radio 外框20×20，选中padding6、未选中padding0；普通输入gap8，卡片padding8/gap8；普通组gap10，卡片组gap8，横纵分别绑定组件Token。

## 实现

Radio 外框size/radius与两态x/y内边距共6项；输入普通/卡片gap、卡片x/y padding及radius、icon-height共6项；两种组横纵gap共4项。选中态移除旧透明1px边框，与Figma无描边吻合，让20px外框、两侧6px留白和8px固定圆点兼容。圆点设置不收缩，避免自定义padding隐式压扁固定尺寸。

直接包含卡片RadioInput且没有普通RadioInput的组采用卡片间距。混合组保持普通间距；额外包裹层不自动当成卡片组，此边界仍需产品API决策或后续结构支持。旧radio-size/input-gap/group-gap显式覆盖优先，原生Radix键盘与选择行为保持。

## 验证

ComponentGeometry浏览器基线Radio20px/radius99；新覆盖30px/radius10，选中后padding4px 3px且圆点8px；旧size覆盖28px。普通/卡片×横/纵组gap覆盖均17，输入gap13，icon-height29；卡片padding7px 11px/radius12。点击选中及ArrowRight切至下个选项均通过。Token构建与五工作区typecheck通过。

## 待完成

- 完整交互与嵌入消费者回归，尤其方向键自动选择行为。
- hover/press现有语义需核对设计支持。
- 圆点8px、图标18px、边框厚度与效果几何尚无完整组件Token消费。
- 卡片嵌套/混合组行为及嵌入消费者回归。

## 四状态颜色与效果（2026-09-21）

只读核对261:3318/3326/3320/3324：四态根opacity=1。选中内圆8px，未选中内圆16px且visible=true。选中禁用内圆opacity仍1；未选中禁用内圆opacity=.55且没有描边。选中启用仅inset 0 -0.5px 0阴影，无旧代码的外阴影；选中禁用effects=[]。未选中第二层填充visible=false，不渲染对应overlay Token。

接入15项颜色/透明度：选中默认及禁用背景、未选中默认及禁用背景/边框、内圆颜色/禁用透明度、高光两端、选中阴影、卡片默认/禁用选中边框、正文/说明颜色/文字禁用透明度。实际修正选中透明边框为0；上一轮文档描述的移除意图因文本替换未命中，本轮源代码与浏览器已确认。

ComponentStates实际验证：选中/禁用背景分别255/85/50与255/198/182；禁用选中无阴影，内圆8px/opacity1。未选中禁用背景240/239/239、内圆16px/opacity.55。新覆盖背景30/80/130与180/190/200、内圆220/230/240、未选中透明度.8、正文40/70/100、说明100/40/70、文字透明度.75及卡片边框60/80/100均生效。旧背景90/40/80、内圆240/230/220和透明度.6仍有效，根不叠乘。

其他旧消费者保留原Radio变量默认回退。固定内圆8/16、描边2、高光20%/36%和阴影几何仍来自设计常量，未伪称完整Token化；还需模式矩阵、切换动画和嵌入回归。

## 整组禁用回归（2026-09-21）

ComponentStates 移除子项重复 disabled 后，浏览器复现内部按钮已禁用但外层文字 opacity=1、鼠标 pointer、选中卡片仍用启用态边框的问题。CSS 现在同时识别显式 data-disabled 和直接子按钮的 :disabled，覆盖文字/图标、边框、cursor 与 hover/active 防护。依赖 Radix 实际状态，不在组件内重复维护状态。

修复后浏览器确认：启用文字 opacity=1；整组禁用默认=.55、新 Token 覆盖=.75、旧覆盖=.6；禁用 cursor=not-allowed，新禁用边框覆盖为 rgb(60,80,100)。Token 构建及全部五工作区 typecheck 通过，class/CSS 与硬编码颜色检查未新增异常。该记录不代表八模式与全部 Radio 验收完成。

## 标准项目八模式矩阵（2026-09-21）

新增 ProjectModes，用独立 ThemeProvider 和实际标准项目覆盖 normal/card × enabled/disabled/legacy，每组包含选中与未选中，共12项。通过界面切换亮暗、密度、效果的全部8种组合：正文 Light=rgb(38,37,37)、Dark=rgb(213,213,213)；内圆白→黑；未选中禁用背景240/239/239→37/37/37。禁用正文与未选中圆点透明度保持.55，显式旧覆盖保持.7。ON 高光alpha.2、阴影alpha.04，OFF 均归零；普通组gap10、卡片组gap8。

两种密度均20px，已直接解析标准项目确认 radio/size/size 在 Default 与 Mobile Friendly 中都是20。Dark选中背景实际位于surface层，为255/138/113，禁用为136/60/52，根背景透明属于结构设计。

标签点击与Space选择通过，UI类型检查通过，浏览器未报告错误。ArrowLeft在当前浏览器调用中只移动焦点、没有自动改变选中项，需继续核对事件与Radix行为，不计为键盘完整验收通过。模式矩阵也不替代嵌套结构及完整交互验收。

## 键盘对照调查（2026-09-21）

新增 KeyboardComparison，将 Spiral RadioGroupItem、原始 Radix Item 和卡片 RadioInput 放在同一页面对照。事件记录写入 ref 缓冲区、手动展示，避免在 keydown 与延迟 focus 之间引入诊断性重渲染。实际三组 ArrowRight 都产生 keydown → focus B → value b → keyup；另验证 Spiral ArrowLeft 返回 A。

已安装 Radix 源码中 roving-focus 使用 setTimeout 延迟 focus，Radio 在 document keydown/keyup 间维护方向键标志，并在 focus 时决定是否触发 click。快速按键时序可能解释先前 ProjectModes 只移动焦点的现象，但尚无该用例失败时的事件顺序证据，不能断言根因。当前没有修改生产键盘逻辑。UI typecheck 通过。保留复杂主题用例复核项，不将对照页通过当成全部交互验收。

盘点补充：标准项目包含 buttonGroup 三项 Token，但当前生产源码没有对应 ButtonGroup 组件或消费入口；不能为提高引用数而映射到普通 Button。后续需核对设计中的组合部件及其实际消费者。

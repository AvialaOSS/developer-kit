# ColorPicker Token 迁移

2026-09-24：已重新核对禁用变体，按用户确认的分层规则接入 content-disabled 与 placeholder Token：根保持100%、内容55%、内部文字60%。ColorPicker 新增文字内层，其余沿用现有结构。显式旧覆盖保留，禁用占位符不重复淡化；旧禁用策略待定表述由本条取代。未进行 Computer Use 验证。

## 禁用背景

回读 ColorPickerInput 392:16436 中 regular/big 的 Empty/Fill 禁用变体（392:16527、392:16542、392:16557、392:16572）：根填充均绑定 2452:77904，即 colorPickerInput/color/background-disabled。Web 禁用触发器已消费此变量，显式 input-bg-default 仍优先。此批 CSS 构建及样式拷贝通过。

同次读取确认 Figma 根 opacity=1，内部色块、文字和图标槽分别绑定 content-disabled。Web 当前仍对根施加旧禁用透明度；本批只修正背景来源，不将透明度语义视为完成，也不声称禁用视觉已经一致。后续需结合文字内部透明度决策一起处理。

## 可选色块按钮图标

只读核对 ColorPickButton 385:21734：预览后有默认隐藏的 Icons 385:21725，宽14/高18分别绑定 colorPickButton/size/icon-width 与 icon-height。关闭隐藏实例子节点跳过后读取内部 Vector I385:21725;131:72;276:102，其填充绑定 colorPickButton/color/icon-default。

Web ColorPickButton 新增可选 trailingIcon，装饰图标不改变按钮的颜色名称及选中状态。默认不渲染插槽，预设列表保持原布局；图标宽度和容器高度分别消费组件 Token。新增 PickButtonIcon 故事覆盖无图标、带图标、禁用及20×24覆盖。CSS 构建、UI 样式拷贝、Docs 类型检查及 changelog 配对通过；浏览器仍不可用，未将此批记为视觉/交互验收完成。

## 可选触发器图标

只读确认 ColorPickerInput `392:16497` 有默认隐藏的 first icon / last icon 层，位于色块之前和文字之后。Web 新增可选 leadingIcon / trailingIcon；未传时不渲染，传入时使用 icon-width/icon-height/icon-default，图标槽按装饰内容从无障碍名称中排除。占位文字透明度接入 colorPickerInput/transparency/placeholder，显式 input-placeholder-opacity 仍优先。新增 TriggerIcons 故事展示非正方形尺寸覆盖。

禁用透明度层级仍待用户决定，ColorPickButton 的图标能力未在本轮处理。浏览器挂载失败，故事的视觉/交互验收待完成。

状态：面板根容器、调色区分层布局、操作行、滑轨尺寸、输入、预设及触发器主要样式已接入；普通页面与 Modal 局部覆盖已验证。剩余状态语义、效果、完整交互及兼容矩阵仍未完成。

## Figma 证据

Information Collect 165:1362：ColorPickerPanel 394:17267、ColorPickButton 385:21734、ColorPickerInput 392:16436、ColorPicker 394:23493。

面板370×300，根gap10、padding0/0/8/0、radius10、border1；gap、四向留白、圆角、背景和边框颜色绑定colorPickerPanel相应Token。宽度和边框厚度没有发现组件变量绑定，暂保留既有规则。

调色区有两层：378:19226外层padding0绑定pick-area系列；378:19227内层padding10×8、radius0绑定palette系列。Web当前单层调色区域及surface圆角仍需对齐，不可把两组Token合并。指示器379:15099为14×14，描边颜色绑定indicator-border-default，Figma stroke1而Web当前2，待单独处理。

操作区384:21610、385:21696、379:15040、386:21745均gap8、padding0×8，绑定action-area系列。前两区各含共享Slider（big轨道height10），Web当前覆盖轨道16，需后续对齐。输入行复用BaseInput、Select；预设复用ColorPickButton。取色算法的黑白渐变与用户颜色属于颜色模型计算，不可用随主题反转的黑白语义代替。

## 已实现与验证

根gap、padding、radius、background和border-color消费ColorPickerPanel Token；显式旧color-picker-panel-gap/px/radius/bg/border保持优先。旧px继续控制根底部留白，内层未迁移位置保留padding-default回退，避免丢失原共享覆盖。shadow及固定宽度尚未迁移。

ProjectModes故事验证：Light默认gap10、padding0/0/8/0、radius10、背景255/255/255、边框249/248/248；Dark背景37/37/37、边框18/18/18。自定义gap17、padding3/5/13/5、radius19、背景213/229/245、边框32/64/96；叠加旧覆盖后gap7、padding3/5/9/5、radius11、背景245/229/213、边框96/48/128。

tokens及组件构建、文档类型检查通过。仅证明根容器和这组覆盖，尚未验证全部颜色格式、透明度、取色器、Portal主题继承、窄屏、键盘、密度和效果模式。不能将直接引用数量视为完成率。

## 调色区与操作行

补齐area外层和palette内层：外层消费pick-area三组留白，内层消费palette横纵留白及圆角；拖拽引用仍绑定实际surface，不把留白纳入选色坐标。操作行（色相、透明度、输入、预设）消费统一action-area间距和横纵留白。旧panel-px在内层及操作行仍优先。

指示器描边采用组件indicator-border-default，并按已读取设计从2px改为1px；14px几何尺寸尚为既有常量。滑轨去除外层重复3px留白，保留共享Slider内部3px；默认轨道使用slider-size-big-track-height10，显式color-picker-slider-height仍优先。渐变、棋盘格、滑轨描边、surface圆角与阴影尚需继续审计，没有声明整块完成。

Dark/Default浏览器：area padding0、palette10×8、操作行0×8/gap8，轨道10、Slider操作行总高16，指示器白色1px。独立覆盖后area2/4/6/4、palette7×11/radius12、操作行2×12/gap5、指示器96/48/128。点击实际surface中心后指示器left/top均50%，颜色804A40，验证留白未偏移选色坐标。旧panel-px9使palette和操作行横向均9；旧轨道高度20使两条轨道均20。构建与文档类型检查通过。

## 预设色块按钮

只读复核ColorPickButton 385:21734：26×26，HUG宽度，1px INSIDE描边，20×20预览，图标385:21725隐藏。Web改用预览宽高、横纵padding、gap、radius、背景和边框Token，内描边不占布局；显式旧swatch-button-size和swatch-button仍优先，旧input-radius覆盖保留。隐藏图标不擅自扩展新API；hover/selected/disabled暂沿用原Web状态规则，尚无对应Figma状态证据。

浏览器Dark默认外壳26×26、预览20×20、padding3、inset1描边；覆盖后预览18×22、padding2×4、外壳26×26、外壳radius12/预览radius3、背景229/213/245；旧覆盖使外壳36×36、预览24×24。Enter选取#FF0000后输入同步FF0000。验证发现预设大写与当前值小写导致selected错误，改为规范化颜色比较后aria-pressed=true。ColorPickButton默认使用颜色作可访问名称，用户仍可覆盖aria-label。构建与文档类型检查通过；透明色预览、完整状态样式和禁用交互还需后续验收。

## 面板输入框

依据379:15042与379:21170已读取的BaseInput绑定，颜色/透明度field的外壳、间距、横纵留白、输入及Badge槽留白改用base-input尺寸Token；正文仍用Typography文本指标。默认/聚焦背景、文字、底部阴影颜色与焦点边框跟随BaseInput，显式旧input-*覆盖入口保留。disabled透明度冲突仍未自行裁决；触发器的ColorPickerInput需独立迁移，不能沿用本次BaseInput映射。

Dark/Default浏览器两输入默认背景37/37/37、文字213/213/213、radius8、gap6、外壳padding0×10、内容padding6×0、字号14/行高18；Mobile Friendly字号18/行高24。覆盖后外壳padding1×12、内容4×0、gap7/radius5、背景213/229/245、正文32/64/96。聚焦背景245/229/213、焦点内描边96/48/128。输入00FF00并Enter，再输入透明度50并Enter：色相滑轨120、透明度滑轨50、饱和度100，画面同步为绿色。构建及文档类型检查通过。RGB/HSL格式、旧覆盖矩阵、禁用状态及Portal作用域仍未完整验收。

## ColorPickerInput 触发器

读取392:16436变体集合：regular根gap6/padding0×10、big gap8/padding0×14，slot-padding-y分别6/10；根及打开态均有独立ColorPickerInput背景、边框、阴影颜色，圆角分default/round。coloricon394:17119/394:17139与input area392:16502/392:16517均绑定对应slot-padding-y；预览Frame为18×18且无尺寸绑定，暂保留旧尺寸入口。触发器已接入这些根与插槽Token；色块槽高度不再固定为文字行高而挤压内留白。禁用透明度及Web hover规则仍待确认；未声称整个23项Token完成。

浏览器Dark默认密度regular/big高度30/38，移动密度36/44；示例布局显式items-start，避免并排flex拉伸掩盖真实高度。独立覆盖后regular padding2×13/gap9/radius12/height32，big padding3×17/gap11/radius24/height38，两者背景213/229/245、正文32/64/96。打开regular后背景245/229/213、焦点边框96/48/128。

发现Portal局部覆盖缺口：同一示例内嵌面板背景213/229/245、gap17，弹层面板背景37/37/37、gap10；暗色项目主题保留，但触发器祖先的额外CSS覆盖没有穿过Portal。需要检查现有Portal容器/主题传递机制，不能据当前结果宣称局部覆盖端到端通过。构建和文档类型检查通过。

## 普通页面的 Portal 局部覆盖修复

ColorPicker根元素现在提供本地ThemeOverlayContainer作用域；普通页面弹层及内部Select格式选单挂到该根，保持真实CSS继承及动态更新，不复制/展开Token值。useOverlayPortalContainer原有fullscreen、Modal优先级保留；这些优先目标与局部覆盖同时存在时仍需专项验证，不声称全部Portal场景已解决。

ProjectModes验证控件允许在弹层保持打开时切换主题覆盖（仅故事阻止点击测试按钮导致关闭）。打开regular后将覆盖OFF切为ON，两面板实时变为背景213/229/245、gap17。打开内层格式选单并选RGB后外层仍展开，输入显示255,85,50；普通页面这条局部继承链路已修复。

本轮代码编译、声明生成及文档类型检查通过，但完整构建在属性文档生成阶段出现Windows进程异常退出；独立重跑也失败。需继续核对生成工具，不把该次完整构建标记成功。

## Modal 与全屏边界内的局部覆盖

容器选择规则进一步细化：先确定全屏/嵌套 Modal 的有效边界，再允许该边界内更深的局部主题容器。边界外的主题容器不能取代有效边界。新增 6 项纯函数测试覆盖包含关系与无容器回退，全部通过。

新增 InModal 故事。真实浏览器中，开启局部覆盖后，内嵌面板及弹出面板背景均为 rgb(213, 229, 245)、gap 均为 17px，且均位于 Modal 内；弹出面板祖先包含 ColorPicker 的 inline-flex 根和局部覆盖节点。格式选单切换 RGB 后显示 255, 85, 50，外层颜色面板和 Modal 仍打开。文档 TypeScript 检查通过。真实全屏交互及其他弹层组件组合尚未全面验收。

属性文档生成使用 Node --jitless 独立重跑成功，生成 45 项组件文档；这只是重跑结果，尚不能证明常规构建的 Windows 异常已修复。

随后本轮改动的 JS/CJS 与声明重新编译通过，CSS 拷贝、48 项组件变更记录聚合及配对检查通过；属性文档使用常规 Node 再次生成成功（45 项）。本轮构建步骤均已通过，前述偶发进程异常的根因仍未确认。

## 触发器预览色块圆角

继续读取 Figma 394:17225/394:17215 的内部 Frame 394:17226/394:17216，四角均绑定 VariableID:2452:77914，即 colorPickerInput/size/preview/radius；默认 6px。Web 改为消费对应组件 Token，默认项目仍通过引用基础圆角获得 6px。浏览器 regular/round 外框默认分别 8/99px，内部预览均 6px；独立覆盖后外框 12/24px，内部预览均 2px，确认预览圆角与外框独立。

调色区 Figma 378:19227 自身直接承载渐变和 padding，Web 的渐变位于内层 surface，仍存在布局语义差异，后续需核对拖拽边界和指示器可见区域，不能仅凭 Token 已引用判定完成。指示器的 Figma 阴影是无变量绑定的 0/1/2/1、黑色 6%，目前 Web 阴影仍不同；应随统一效果策略确认，不擅自映射到某个组件效果 Token。

## 调色板填充边界修正

再次只读核对 378:19226/378:19227：外层和调色板均 370×160、clipsContent=true；调色板 padding10×8，指示器379:15099为ABSOLUTE（x327/y8、14×14），渐变直接绘制在调色板自身。Web 现在让 surface 绝对定位铺满 palette，继承 palette 圆角；pointer ref 仍是实际绘制渐变的 surface。外层 pick-area 留白继续缩小 palette，palette 自身留白不再误缩渐变。

浏览器默认实际内容宽368、高160（Web面板保留1px border），palette/surface均368×160、圆角0；自定义外层留白后两者均350×152、圆角12。点击中央后指示器left/top均50%，颜色804A40，说明渲染边界与选色坐标一致。CSS构建和拷贝通过。面板边框是否改为inset、阴影策略和调色区键盘操作仍未验收，未宣称整组件完成。

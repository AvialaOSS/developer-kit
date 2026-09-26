# Popover 迁移记录

## 可选内容图标

回读普通 top 587:92428 与主题 top 588:55617：Slot 为 VERTICAL，两个默认隐藏 Icons 位于 Typography 前后，宽/容器高绑定 popover/size/icon-width、icon-container-height；内部 Vector 的颜色分别绑定 default/icon-default（2464:32592）和 theme/icon-default（2464:32593）。不能凭“前后图标”将整个 Slot 改成横向。

新增公开 PopoverIcon 包装器供内容组合，默认装饰性 aria-hidden，沿既有 Slot 内容顺序布局；普通/primary 图标使用相应 Popover Token，tooltip 外观使用共享 Tooltip 图标 Token。未给所有现有弹层自动加图标，也未改变已有 children 的结构。ContentIcon 故事提供三外观入口。CSS 构建、UI 样式拷贝、Docs 类型检查与 changelog 配对通过；实际图标布局、交互及 Portal 作用域待浏览器验收。

## 共享提示文字默认值修正

Tooltip 默认字级改为设计中的 Text 后，Popover 的 tooltip 外观与 ResponsiveTooltip 仍默认 Caption，导致入口之间不一致。现将两处默认值统一为 Text，显式 level="caption" 继续保留。字号、行高、字重仍消费共享 Typography，不增加组件字体指标 Token。此修正使此前 Caption 默认下的几何证据不再能证明当前提示文字尺寸；实际渲染需恢复浏览器后补验收。

状态：tooltip 外观已接入共用 Tooltip Token；default / primary 已接入颜色、圆角和阴影，几何与整体交互尚未完成迁移验收。

## 已接入

`appearance="tooltip"` 用于 ResponsiveTooltip 的触屏提示，按现有组件约定与桌面 Tooltip 共用颜色、圆角、padding、两层阴影及指针尺寸。显式 tooltip-content-* 覆盖仍优先。SVG 的实际宽高传入共用指针并由 Radix 测量；长路径支持断行，最大宽度受 Popover 可用宽度限制。

ProjectModes 增加持续打开的 Popover tooltip 外观，与桌面 Tooltip 在同一局部 ThemeProvider 中比较。亮暗 × 默认/移动密度四组合实测背景、文字、padding、radius、阴影和指针尺寸一致：指针 14×5 / 18×5，padding 4×8，radius 8。CSS 构建与 Docs 类型检查通过。

该验证为浏览器中渲染触屏使用的外观，不是实际设备上的长按交互验收。新尺寸的边缘定位、旧覆盖与长内容需补充直接针对 Popover 的检查。

## 下一步

## 本体颜色与阴影

只读核对 Information Display 的 Popover 集合 587:92427，默认 top 587:92428、主题 top 588:55617。默认表面和指针绑定 popover/color/default/background，主题绑定 popover/color/theme/background；文字分别绑定对应 text-default。radius 10；默认两层阴影（6/18/.08 与 0/1/.18），主题仅第一层。Web 的 default / primary 外观已按这些绑定接入，旧 popover-content-bg/fg/radius/shadow 显式覆盖优先，移除会遮蔽组件 Token 的全局旧默认。

ProjectModes 三外观 × 四种亮暗/密度组合验证：默认背景亮白/暗 rgb(37,37,37)，文字 rgb(38,37,37)/rgb(213,213,213)；主题背景 rgb(255,85,50)/rgb(255,138,113)，文字 rgb(254,253,253)/rgb(2,2,2)。指针颜色与表面一致；default 两层阴影、primary 单层、radius 10。显式旧覆盖实测两种本体外观均为自定义背景/文字、radius 13、无阴影；tooltip 外观继续使用其独立 tooltip-content-* 覆盖。CSS 构建、Docs 类型检查通过。

布局证据：外层 padding 0、gap 6；Slot 1948:29383/1948:29401 使用 popoverSlot/size/padding-x/y 10 和 gap 8。指针 14×5，无描边；外层也无描边。现有 Web 单层 padding 8、default 带边框及 16×5 描边指针，需要后续结构迁移，不能把本轮颜色对齐算作整个组件完成。

## 剩余工作

窄屏补充：NarrowContent 长路径加表单场景在 240px 视口重现默认面板宽 320、右边缘 328 的越界；最大宽度现取公开上限与 Radix 可用宽度的较小值，并支持长路径换行。修复后默认面板宽 209、右边缘 217，输入框可编辑。主题面板在 240/320/768px 下分别为 209/304/320px，均未越界且无文本横向溢出。点击外部外观按钮能关闭面板，重新打开后正确使用主题外观。浏览器临时尺寸已恢复；CSS 构建及故事类型检查通过。超高内容、带固定宽度的自定义子组件与实际触屏仍未覆盖。

消费者补充：ProjectModes 增加四方向切换，三外观 × 四方向的 12 个浮层均在当前视口内，指针可见且方向正确。Breadcrumb EllipsisActivated 的 Esc 关闭并返回触发按钮、Enter 重开、Tab 进入 Library 链接均通过。Video 设置浮层 flush 两层为 0；原默认故事固定 objectFit="original"，无法用于更新验收，因此新增非受控 InteractiveSettings：选择“拉伸”后单选状态更新、video object-fit 变为 fill，Esc 关闭并将焦点返回设置按钮。未把固定受控故事的无更新误报为组件故障。

指针后续迁移：只读获取 588:55386 的 vectorPaths，使用设计原始 14×5 曲线。默认与主题外观均使用 popover pointer width/height，保留 SVG ref 动态测量；去掉旧默认边框、箭头描边及 1px 衔接位移。浏览器实测两种外观均为 14×5、stroke none、border 0；覆盖为 22×9 后间距从 13px 增为 17px。tooltip 外观仍使用自身 Token（移动密度 18×5）。显式旧边框颜色改为不占布局空间的 outline，使用依赖原有 1px border 布局的选择器需调整。旧覆盖示例确认默认表面为紫色 1px outline，箭头 stroke 同色；主题表面也有 outline，主题指针保持原有单路径结构。UI 完整构建通过。

布局分层已接入：Figma 外层及 Slot 都是垂直布局，Web default/primary 新增内容 Slot 层。浏览器确认外层 padding 0/gap 6、Slot padding 10/gap 8；分别覆盖后为外层 9×7、Slot 13×11；旧 px/py 将 Slot 改为 3×5，外层保持独立值。flush 同时清零两层，并修复原有 tooltip 外观优先级导致 flush 无效的问题。tooltip 外观保留原有单层结构。

实际 Pagination ManyPages 消费者打开“更多页码”，两层 padding 均为 0；选择第 2 页后页码更新且菜单关闭。其余 Breadcrumb/Video/HoverPopover 消费者仍需回归。Segmentator 使用 closest 查找表面监听动画，新增 Slot 没有改变该祖先关系。CSS 构建与 Docs 类型检查通过。

- 完成其余消费者的新增 Slot 结构回归，以及用户自定义后代选择器兼容说明。
- 指针已迁移，仍需四方向、边缘碰撞及显式旧边框覆盖的完整回归。
- 标准项目阴影颜色为固定字面值，效果 OFF 语义尚未解决。
- 实际 ResponsiveTooltip 长按、键盘关闭、焦点恢复与所有消费者回归未完成。

# DatePicker Token 迁移

2026-09-24：沿用用户确认的输入禁用分层结构，重新读取 Figma 禁用变体（TimePickerInput 450:21685、DatePickerInput 460:42310），根 opacity=1、内容槽=55%、内部 Typography=60%。Web 改用各自 content-disabled 与 placeholder Token 分层消费；文字有效透明度约33%，图标55%，背景保持自身颜色。显式 input-disabled-opacity/input-placeholder-opacity/input-icon-opacity 保留；禁用原生 placeholder 不再额外叠乘。以下“等待禁用策略决定”为历史状态。本轮未进行 Computer Use 验证。

状态：日期单元格首批接入，整组件未完成。

只读核对 Information Collect / DateButton 464:46294 的全部 10 个变体。根 gap、padding-x/y、外圆角与范围内部圆角分别绑定 dateButton/size；选中背景、选中/未选文字及今日标记分别使用独立颜色 Token。跨月只降低 Typography 容器透明度，使用 dateButton/transparency/outside-month。文字绑定从 464:46280、464:46276 的 Text 子节点核实。

上述 11 项 Token 已接入 Web。文字继续共用 Typography 字号/行高，并显式继承日期单元格状态颜色。旧 datepicker-day-radius/fg/fg-selected/bg-in-range/today-dot 显式覆盖仍优先；全局旧默认转至兼容层，时间轮的旧选中文字回退保留。

未完成：输入框、面板、星期标题、年月选择、时间选择与底部操作；范围连接条及跨周/RTL连接方式；选中圆角自定义、八模式及交互回归。单元格最小高度和面板高度仍有旧派生公式，需随日历整体布局迁移一起处理，不能据此宣称任意尺寸覆盖已完成。Hover/Disabled 没有在本批读取到对应设计绑定，保持旧行为。

本批 CSS 构建、UI 样式拷贝与 changelog 配对通过。无新增类名；按用户要求暂不重复执行浏览器模式矩阵。

## 输入框首批

只读核对 DatePickerInput 460:42310：regular/big 激活、默认空值/填值、禁用分支；根与直接子槽绑定均有独立 Token。读取 460:42311、460:42345 内部确认 icon-width/height、普通文字与图标颜色、placeholder 透明度。激活分支同时出现 icon-active 和 icon-default，暂不将所有图标统一改为 active；text-active 也未据名称直接应用。

两档根 gap/padding、内容及图标槽 padding、普通/全圆角、默认/激活/禁用背景、默认文字/图标、激活边框和阴影色已接入。图标槽改 content-box，确保槽上下留白增加在图标高度之外。保留显式旧 input 覆盖；TimePicker 共用基础样式但不套用 DatePicker 组件 Token。

禁用仍保留 Web 整根 opacity，与 Figma 各内容槽透明度不同，等待此前共用输入禁用规则决定。placeholder 仍允许旧全局 input-placeholder-opacity 优先，尚未退役其默认，不能视为完全独立覆盖。Range 激活边框、text-active、icon-active 尚待按节点用途核对。

本输入批次 CSS 构建与拷贝通过。关键路径检查发现真实 CSS border 将输入高度额外增加 2px，已改为内描边，与其他输入组件一致；错误态保留主题错误描边。浏览器当前 Mobile Friendly 下输入高 36px、槽高 36px，点击 2026/09/22 后输入显示 2026-09-22 17:00，并进入时间面板。该证据仅覆盖当前单选日期到时间流程，不代表完整键盘、Range 或八模式验收。

## 日历布局与派生高度

核对 DatePickerList 日视图 471:54457、DateButtonGrid 471:46566、DatePickerMonthPointer 471:46584。月份标题区使用 pointer padding-x/y/radius/text；标题与日期区间距来自 list/gap，日期区内部星期标题到网格间距来自 grid/gap，不再混用同一全局默认。日期区域横向留白使用 list/grid/padding-x；星期标题 radius/background/text 使用独立 Token（文字从 I479:56242;128:108 读取）。

日期、标题、网格、视图、面板高度默认转为日历容器内派生，日期高度跟随组件 padding-y 与共享正文行高。显式旧高度优先；未在日历容器中的旧消费者保留 legacy 默认。Header 内容目前仍包含 Web 年月切换按钮的共享留白，派生高度也保留该部分，尚非 Figma 静态标题的完整结构复刻。

外部容器 485:62144 未绑定 selectMenu Token，因此暂不凭名称将整个日历表面映射到 datePickerSelectMenu。面板阴影、底部布局、年月滚轮、列/行 gap 与 RTL 范围连接仍待后续核对。

本布局批次 CSS 构建与 UI 拷贝通过。浏览器切回日期视图：当前密度下标题高42、列表gap4、日期视图高202/gap6、日期网格高178，网格clientHeight与scrollHeight均178，面板body高252且无内部高度溢出。这里只验证本例布局，不扩展为全部自定义尺寸或动画验收。

## 外层与操作区

定位到实际外层 498:59948，名称为 TimePickerSelectMenu，但内部为 DatePickerListGroup（485:62181）及两份 DatePickerList；根绑定 datePickerSelectMenu 的 gap/padding/radius/background/border。Web 当前只呈现一个列表，因此扁平容器内合计 menu/list 的横纵 padding，子区域间距使用 list/gap，不把多列表间距套到标题与内容之间。

日历表面背景、边框、圆角及留白已接入；底部 action 横向/末端 padding 来自此前已核对的 1815:24441。内部仍复用 SegmentatorGroup，移除其上固定表面值的遮蔽，显式 datepicker-footer-bg 优先。日历内滚轮渐隐跟随局部表面 Token；独立 TimePicker 保留旧表面默认回退。

外层 Figma 阴影为固定 DROP_SHADOW (0,5)/blur20/spread0/black6%，无变量绑定，尚待与此前共享效果策略统一；本批未伪造效果 ON/OFF 支持。Web 单列表与 Figma 双列表范围模式的结构差异仍需单独处理。

## 年月选择容器

核对 Figma 498:58133、498:53057、498:53056：年月组合容器 gap 为 0，绑定独立背景、圆角和边框；两列均绑定各自右侧分隔线、内容横向留白。Web 已接入这些 Token，分隔线沿逻辑方向处理，选中高亮与裁剪文字同步使用对应列留白。隐藏的 Cascader 分支不参与映射。

选项 gap、纵向留白和 ScrollPickerItem 状态仍待接入，不能以本批容器完成代表滚轮迁移完成。当前滚动索引按固定行高计算，后续需要同时调整步长、选中裁剪轨道和首尾滚动补白。CSS 构建、UI 样式拷贝与文档项目类型检查通过；本批尚未做浏览器验证。

## 年月滚轮步长接入

继续接入年月列 content/gap、padding-y、content/padding-y；选项高度由共享 Typography 行高加 ScrollPickerItem 上下留白计算，并消费其圆角、横向留白、普通文字与透明度。Figma 498:50731 等选项确认为 26px 高、正文 18px，组内间距 4px。选中颜色仍待核对，不以普通态推断。

滚动行高度包含完整间距，高亮带只占选项高度。普通列表两端补白按滚动步长计算，选中文字轨道额外偏移半个间距；保留显式 datepicker-time-wheel-item-height 覆盖，时间滚轮默认仍为 36px、零间距。测量使用不受祖先变换影响的计算高度，保留小数像素；监听首项和视口尺寸变化后重定位已提交值，避免密度变化后索引漂移。尺寸未变化时不打断平滑滚动。

CSS 构建和文档项目类型检查通过。浏览器读取到日历，但打开年月视图连续发生控制接口超时，截图接口也不可用；尚无本批点击、键盘、首尾及动态密度验证证据，后续恢复后必须补验收，不能标记完成。

## 年月滚轮选中配色

年月列表展示实例均为未选中态，因此进一步核对其原组件集合 450:22847：选中变体 450:22890 的背景绑定 scrollPickerItem/color/background-selected，正文绑定 color/selected/text-default，透明度为 1。Web 高亮层与选中文字已接入这两个 Token，渐隐使用年月组合容器背景；显式旧 datepicker-day-bg-selected/fg-selected 继续优先。旧背景默认移至 _legacy，仅用于尚未迁移的时间滚轮，避免遮蔽年月新 Token。

选中变体另有 lineShadow-bottom 效果，尚未迁移；本批配色完成不代表完整年月选择或 DatePicker 验收完成。

本批后续验证：CSS 构建与样式拷贝通过。浏览器原生 Expand 操作也超时，新建临时验证页等待挂载超时，因此未得到新的运行态证据。进一步修正尺寸监听：同时观察高亮带高度，覆盖“行步长不变、选项高度与间距相反变化”的覆盖场景；该场景仍待浏览器验收。

## 共享时分选择接入

后续批次将 DatePicker 内 TimePickerWheels 与独立 TimePicker 一起接入时间列及 ScrollPickerItem Token，替代前文“时间滚轮保留旧默认”的阶段状态。旧显式覆盖仍保留，当前默认视口按五个选项及其间距在局部作用域计算。详情及秒列/API 差异见 TIME_PICKER_MIGRATION.md。

## 占位符兼容遮蔽修正

随着 TimePickerInput 接入，旧 input-placeholder-opacity 的全局默认声明已移入兼容层，DatePickerInput 的 placeholder Token 现在可作为默认消费入口。显式 input-placeholder-opacity 仍优先；其他旧输入组件通过 _legacy 回退保持原默认透明度。这项修正替代前文占位符 Token 被旧默认遮蔽的待办。

## 滚轮选中内阴影

回读 Figma ScrollPickerItem 选中变体 450:22890：INNER_SHADOW，offset=(0,-0.5)、radius/spread=0，颜色绑定 VariableID:1501:4546（lineShadow-bottom）。年月/时分滚轮与独立 ScrollPicker 已补齐相同内阴影，并提供 scroll-picker-item-shadow 显式覆盖。生成 CSS 的效果 OFF 模式将 line-shadow-bottom 解析为透明色，ON 保留引用链；这是静态链路证据，运行态组合仍待验收。本节替代前文该选中阴影尚未接入的状态。

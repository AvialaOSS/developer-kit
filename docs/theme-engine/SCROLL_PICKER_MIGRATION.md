# ScrollPicker 迁移

## 2026-09-24 滚轮事件所有权修复

输入单位补充：按 [W3C WheelEvent 定义](https://www.w3.org/TR/pointerevents4/#wheelevent-interface)，deltaMode 分别表示像素、文本行或页，旧代码直接使用 deltaY 会误把行/页数当像素。现两类选择器用实测选项行距作为控件的行单位、列 clientHeight 作为页单位，换算后再进入原步进算法；像素输入不变。无有效几何或未知模式时放行事件。16项相关测试通过，含等效三种单位生成相同步数与密度几何变化；仍未据此声称跨设备实测完成。

代码核对发现 ScrollPicker 会拦截 Ctrl+滚轮和纯横向手势；独立日期时间滚轮甚至在空列表检查前 preventDefault。现共用 shouldCapturePickerWheel 判定，只消费可选值的纵向手势：已被处理事件、Ctrl 缩放、零/无效纵向增量、空列表及单项列表不拦截。有限列达到首尾时放行外向滚动，保留向内选择。

同时发现原先 overscroll-behavior: contain 会继续阻断浏览器滚动链。两类滚轮新增有效循环标记，有限/空/单项列设为 auto，循环列保留 contain。读取不到有效几何时也不先阻止默认行为。

5项共享判定测试覆盖方向、边界容差、循环边界、无滚动空间及事件所有权；与两类滚轮8项SSR测试合计13项通过。此证据不等同于浏览器实际滚动链、触摸或缩放验收；用户暂缓 Computer Use 的交互待办仍保留。

2026-09-21 只读复核 Components / Information Collect / ScrollPicker `579:88681`：普通与选中项均为 HUG 高度，18px Typography 加上下各 4px 组件内边距得到 26px，不是固定高度约束。

移除全局 `--scroll-picker-item-height: 26px` 默认；列内计算共享行高加两倍组件 padding-y，供选项、高亮、裁切区、遮罩和首尾占位共同使用。显式旧 `--scroll-picker-item-height` 与 `--scroll-picker-item-py` 仍优先。未新增组件字号、行高或字重 Token。

ResizeObserver 监听滚动容器、选项与列表的尺寸变化，保持受控选中值居中并同步裁切轨道；首次观察且几何未变化时不打断原有平滑滚动。新增 TokenGeometry story，可切换 padding、旧高度覆盖，对照循环和非循环列。

监听器读取最新选中值引用，不因仅选中值变化而重建，以免选值与尺寸同时变化时把新尺寸当作初始基线而漏掉重新居中。此调整通过 Docs 类型检查；仍需实际浏览器验证并发切换场景。

CSS 构建和 Docs 类型检查通过。浏览器挂载再次超时，尚未验证本次动态几何与滚轮/键盘交互，不将既往背景及三轴模式验收当作本次通过证据。完整迁移仍待本次实际渲染核对和逐属性汇总。

## 2026-09-23 动态几何浏览器验收

实际运行 Storybook `information-collect-scrollpicker--token-geometry`，分别读取循环列和有限列的选项、活动后代、裁切文字层边界。当前 Storybook 共享 Typography 行高为 24px；组件没有强制把它改成设计稿的 18px。

- 初始 padding-y 4px：选项与裁切文字层均为 32px；两列选中 09，居中误差 0px。
- padding-y 8px：两者同步为 40px，09 保持居中。
- 启用旧 height 40px 后恢复 padding-y 4px：高度仍为 40px，证明旧高度入口优先。
- 有限列 ArrowDown：09 → 10，两列联动居中；随后 End 与关闭旧高度覆盖连续操作，最终 23 居中、高度恢复 32px。
- 循环列 ArrowDown：23 → 00，滚动稳定后两列仍居中，误差 0px。

验收发现循环列中间段选中行复用了首段 ID，活动后代错误指向屏幕外副本。现改为每个重复行始终使用自己的索引 ID，活动后代引用中间段索引。浏览器验证 96 个选项对应 96 个唯一 ID，活动后代在上述稳定状态下均居中。页面控制台无 error/warn，仓库五个包类型检查通过。

此轮补齐动态几何、旧高度兼容和关键键盘路径；真实滚轮/触摸、其他模式组合及消费者完整回归仍不计为本轮通过。

### 同日继续：真实滚轮、三轴模式与局部覆盖

使用浏览器真实滚动输入操作循环列，00 → 12，两列联动，停止后活动项居中误差均为 0px；没有通过脚本派发事件或修改 scrollTop 模拟结果。

在 `ScrollPicker Project / IndependentModes` 实际切换全部八种 Light/Dark × Default/Mobile Friendly × ON/OFF 组合。Default 行高 18px、选项高 26px；Mobile Friendly 行高 24px、选项高 32px。亮色表面 `rgb(255,255,255)`，暗色表面 `rgb(37,37,37)`；底部 inset 阴影 ON alpha 0.04、OFF alpha 0，几何保持不变。每个组合活动项居中误差 0px。文字颜色存在 CSS 过渡，瞬时采样不作为稳定终值证据。

在 `OverrideOwnership` 对照 baseline/canonical/legacy/both：应用前背景依次为 `rgb(70,80,90)`、`rgb(10,20,30)`、`rgb(40,50,60)`、`rgb(40,50,60)`；应用局部项目主题后仅 baseline 变白，其余显式覆盖保持；移除后 baseline 恢复原值。证明新覆盖可用、旧覆盖优先且移除主题恢复原有声明。该样例控制台无 error/warn。

未验证真实触摸设备、有限列边界向外层页面传递滚轮，以及所有嵌入消费者；这些范围仍保留为未验收。

## 2026-09-23 非交互补充核对

循环单选标记补充：两类滚轮原先都将三个重复段中的同值选项声明为 aria-selected=true。新增断言复现后，改为仅活动后代对应的选项声明选中，data-selected 保留视觉状态；ScrollPickerItem 单独使用时仍默认跟随 selected。两文件 8 项 SSR 测试通过，未将其视为屏幕阅读器实机验收。

消费者源码补充：当前 UI 生产源码中 ScrollPicker 仅自身定义和公共出口，无其他组件直接导入。DatePicker 时间滚轮是独立实现，不能将其算作已通过的 ScrollPicker 嵌入场景，也不应将“所有嵌入消费者”作为没有具体对象的待办。检查该独立实现发现相同 aria-label 的多个实例选项 ID 重复，以及缺失选中值的无效活动后代引用；已用 useId 与实际选项索引修复。两类滚轮共 8 项 SSR 标记测试通过，不替代实际日期/时间滚动交互验收。外部应用消费者不在此源码扫描覆盖范围。

用户暂缓 Computer Use 后，补充服务端渲染回归：循环与有限列的选项 ID 唯一、活动后代对应选中项，以及空列表/受控值已移除时省略活动后代。发现并修复后两种情况下此前仍生成无效引用的问题；不自动修改外部受控值。`scroll-picker.test.tsx` 四项通过。此证据只覆盖输出标记，不证明动态滚动或屏幕阅读器实际行为。

源码消费汇总（`information-collect-extras.css`）：

| 属性 | 标准入口 / 规则 | 旧覆盖入口 |
| --- | --- | --- |
| 容器间距、内边距、圆角 | scroll-picker-size-gap / padding-x / padding-y / radius | scroll-picker-gap / padding-x / padding-y / radius |
| 表面、边框 | scroll-picker-color-background / border | scroll-picker-bg / border |
| 列分隔线、内边距 | scroll-picker-column-color-divider、column-size-padding-x/y | scroll-picker-border、column-px/py |
| 选项间距、内边距、圆角 | column-size-gap、item-size-padding-x/y、item-size-radius | item-gap、item-px/py、item-radius |
| 普通/选中文字及高亮背景 | item-color-unselected-text-default、item-color-selected-text-default、item-color-background-selected | item-fg、item-fg-selected、item-bg-selected |
| 普通项透明度 | scroll-picker-item-transparency-default | scroll-picker-item-opacity |
| 字体指标和派生高度 | 共享 Typography text；行高 + 上下组件内边距 | scroll-picker-item-height 优先 |

表内省略前缀的 column/item 项均以 `scroll-picker-` 开头。容器 width/height 的 200px/230px 仍为可覆盖默认布局尺寸；容器 shadow 是可选旧覆盖。高亮内阴影当前消费共享 `line-shadow-bottom`，几何为 inset 0 -0.5px；这些值不能因上表存在便被称为全部组件级 Token。此前实际效果 ON/OFF 检查只证明颜色效果开关与几何稳定。
# 2026-09-24 滚动结束兜底

后续边界检查补充：已在第一项时按Home，ScrollPicker会调用无位移scrollTo而没有scroll事件，仍残留programmatic标记；新增用例先失败后通过。scrollToIndex现在仅在目标位置不同于当前位置时设置该标记，无位移时同时清除smooth目标。相同用例在时间轮列原实现已通过，未为此修改时间轮列。当前4项回调序列与8项SSR检查合计12项通过；范围仍限模拟事件与几何。

ScrollPicker和DatePicker/TimePicker共用的时间轮列，在程序滚动的scroll回调中提前返回，未启动既有空闲定时器；缺少scrollend时programmatic标记一直保留。两项隔离回调测试复现“键盘选下一项→仅scroll无scrollend→后续用户滚动不提交”的失败。修复为两类滚动均重置结束定时器，仅用户滚动设置user标记。修复后两项回归及八项既有SSR检查通过。测试使用模拟React hooks、几何和事件序列，不证明真实滚动动画、触摸或浏览器事件顺序；真实设备验收仍保留。

# Tab Token 迁移

状态：根布局与背景首批接入，TabItem状态及交互尚未迁移验收。

Figma Tab1860:28604含Default/Tiled/Card各两个背景变体。Default/Tiled根gap4、padding0×8，分别绑定tab/size/default与tiled；Card根gap8、padding0×8，绑定card系列。有背景Card1866:38218额外顶部padding4、底部0，绑定card/background/padding-y-start/end。三类背景各有独立tab/color绑定。

上述14项根Token已接入。旧tab-gap/px/slot-gap/bg/bg-card默认声明移至_legacy，显式旧覆盖保留。内部通过局部变量选择样式对应Token，不混用Tiled与Default。

附件槽使用基础gap8；Card底部padding2已对齐。Default附件槽Figma底部padding4而旧Web共用item-indicator-space6，尚待与TabItem指示区一起处理，当前保留旧行为。列表间距Default/Tiled为基础gap6、Card为0，现有规则暂保留。

CSS构建和拷贝通过。按用户要求暂不运行逐项浏览器矩阵；TabItem选中、按钮模式、指示器几何与动态更新、关闭/键盘/溢出、RTL和兼容覆盖均待阶段验证。

## TabItem 布局批次

读取1860:28669全部六变体：Default根gap8/padding0/0/6/0，Tiled gap8/padding0，Card未选中gap8/padding0×2、选中gap0/padding0；对应独立tabItem size系列已接入。Card选中Button1866:36474绑定专用content gap4/padding6×10、顶部radius8/底部0与背景，Web及两侧耳朵颜色已接入。旧item-control-gap/radius/card-active-bg等显式覆盖仍优先，默认声明移至_legacy。

Default附件槽底部恢复基础padding-tiny4，Item指示区域使用独立组件padding-y-end6；旧item-indicator-space显式覆盖仍同时作用于两处。指示器Rectangle1860:28679已发现独立宽、高、圆角及颜色绑定，但测量算法尚未改；Tiled选中表面仍需接入共享Button effects，未声明状态迁移完成。CSS构建与拷贝通过，未运行浏览器矩阵。

指示器已接入宽42/高4、圆角与颜色Token；测量读取浏览器解析后的CSS尺寸，默认按Token宽度居中。显式旧tab-indicator-inset-inline保持旧的按钮宽减双侧inset算法，零值不再被逻辑或回退吞掉。测量期间暂时关闭尺寸动画，恢复已有宽度后再应用新位置，避免读到插值中的尺寸。一次关键浏览器检查：默认42×4，点击第二项后仍宽42且位置更新；类型检查与CSS构建通过。独立尺寸覆盖、RTL和动画连续切换仍待阶段验收。

共享Button second模式尚未完成新语义切换，Tab的Tiled表面仍用旧兼容规则；不能把复用该模式视为迁移完成。

Card选中内容1866:36474内部图标1866:36475/1866:36477绑定icon-width16、icon-container-height18，向量与文字分别绑定tabItem/color/card/selected/icon-default、text-default。四项已接入，图标容器和实际图形尺寸分开；旧tab-icon-box/size显式覆盖保留。CSS构建通过，覆盖和密度矩阵尚未执行。现有Web只有leftIcon入口，Figma尾部图标/菜单并非已支持，仍需作为API差异记录。

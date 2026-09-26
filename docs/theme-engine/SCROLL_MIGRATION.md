# Scroll 迁移记录

状态：六个组件 Token 已接入；原生滚动条跨浏览器与显式覆盖验收未完成。

## 设计证据

只读核对 Figma System Composition Scroll 301:6312。Default 301:6311 宽 10，滑块 301:6310 宽 6；Small 301:6313 宽 8，滑块 301:6314 宽 4。两种尺寸共享 padding-x/y 和 thumb-radius、thumb-background 绑定，不能继续让小尺寸使用旧的 1px 内缩。

## 实现

宽度消费 default/small container-width，颜色消费 thumb-background，圆角消费 thumb-radius。横向留白用透明边框实现，轨道两端留白用 margin 实现（原 track padding 不可靠）。显式 scroll-size、scroll-size-small、scroll-thumb-bg、scroll-thumb-inset(-small)、scroll-track-padding-x/y 优先，旧全局默认改为兼容备份。

支持 WebKit 伪元素的浏览器使用 scrollbar-width/color:auto，让自定义伪元素几何与颜色生效；其他浏览器保留 thin 与标准 scrollbar-color。后者不能精确表达组件宽度、内缩与圆角，因此不能宣称全平台像素一致。

## 浏览器证据

ProjectModes 两尺寸 × 横纵方向 × 四种亮暗/密度组合共 16 项：实际占用厚度分别 10/8px；滑块 border 2px、radius 99px、track margin 4px。亮色 rgb(214,213,212)，暗色 rgb(113,114,114)，移动密度未改变这些尺寸。纵向区域聚焦后 End 滚动至 640（最大值 640）。CSS 构建与 Docs 类型检查通过。

## 剩余

运行时覆盖补充：四种尺寸/方向场景的新 Token 覆盖实测实际厚度为默认 18、小型 14，内缩 3、两端 margin 7、radius 5、紫色。叠加显式旧覆盖后实际厚度为 16/12、内缩 4/1、margin 6、旧深蓝色；关闭旧覆盖恢复新 Token 值。RTL 横向 ArrowLeft 滚动至 scrollLeft -40（可滚动范围 560）；切换短内容后四个容器均无溢出、滚动条占用厚度均为 0。故事类型检查通过。源码扫描未发现其他组件直接消费 Scroll（ScrollPicker 是独立组件，不能混作消费者覆盖）。

- 继承式覆盖、RTL 滚动终点及滚轮/拖动操作。
- Firefox 与系统覆盖式滚动条的实际兼容；如要求所有平台精确几何，需要讨论自绘滚动条方案。
- 容器无溢出、嵌套滚动、所有实际消费者及高对比模式。

# Video Token 迁移

## 控制弹层文字

回读 1958:1400 下的文字节点：设置弹层 1957:1371 内标题、画面比例及音量平衡，以及音量弹层 1963:4045 内百分比，均绑定 video/color/controls-text-default（2617:186287）。对应 Web Typography 添加专用 control-label 类，直接消费该组件 Token，避免 Typography 自身颜色遮蔽继承；字号、行高和字重仍由共享 Typography 负责。时间输入文字仍绑定 Input 变量 2436:22988，因此不将 Video 文字 Token 扩散到时间输入或嵌套 Segmentator。

CSS 构建、UI 样式拷贝、Docs 类型检查与 changelog 配对通过。实际弹层及局部主题运行态仍待浏览器验收。

状态：根容器、控制栏布局/表面、进度轨道与指示器已接入，材质、状态与完整交互验收未完成。

2026-09-21 核对 Information Display / Video Section 1958:1400，实际组件为 Light 1958:1398 和 Default 1958:1397。根容器消费 Video 背景、边框、描边、圆角与横纵留白。两种 Controls Container 消费各自横纵留白与共同 gap；Controls Bar 消费 gap/padding；左右 SLOT 消费 control-slot/gap；进度区消费 progress-container/gap。普通与浮动背景分别消费 radius-default/radius-light。

1939:28833 控制栏背景有两层 DROP_SHADOW，所有颜色和几何已绑定 video/effect/shadow。Web 浮动栏接入相同参数。当前效果颜色在标准项目中是组件级字面量，尚未沿 specialEffort 开关引用，不能声称效果 OFF 完成适配。

1939:29029 的 Slider 子树绑定 video/size/slider/padding-y、progress-track 高度/圆角、indicator 尺寸/圆角、indicator-icon 尺寸，以及对应 Video 颜色；指示器使用同样两层阴影。Web 仅在 seek Slider 内给共享 Slider 的 Token 提供 Video 默认映射，保留其显式旧 slider-* 覆盖入口，音量 Slider 不受该映射影响。公共 slider-pad-y 旧默认移至兼容层，普通水平/竖直 Slider 保留旧回退，避免遮蔽 Video 的局部 padding Token。

## 弹层内容留白（2026-09-21）

回读 Settings Popover 1957:1371 和 Volume Popover 1963:4424：内容 Slot 的 gap、padding-x/y 都绑定 popoverSlot 对应变量。Web 设置与音量内容已接入这些 Token，显式 video-settings-gap/padding 仍优先，旧默认声明移至兼容层。内部 Setlist 仍是共享 gap Token，未擅自增加 Video 语义。Speed Popover 1963:4438 的 Slot 上下留白单独绑定 padding-small、左右 padding-none，不能直接采用普通 PopoverSlot 默认留白，此批保留待后续对齐。

回读 Light/Default Controls Background 节点均为 PASS_THROUGH、opacity=1，paint 为 NORMAL。已更正原 CSS 中声称 luminosity 等价的注释，尚未改变既有 Web 玻璃材质。

本批 CSS 构建、UI 样式拷贝及 changelog 配对检查通过；没有新增类名或交互逻辑，未执行浏览器模式矩阵。

## 倍速菜单留白（2026-09-21）

继续回读 1963:4438 的 Select Menu Item Group：组自身有横向 padding-x=6，外层 Slot 为上下 padding-small、左右 padding-none。Web 原先外层和组各加一次横向留白，已去掉外层重复值，保留 select-group-px 在组上的覆盖。外层上下仍允许 select-menu-py 显式覆盖。标题使用 SelectMenuItem 的 padding-y、padding-x、title/padding-y-end；选项之间的 Slot gap=4 在 Figma 没有绑定，保留现状，不伪造组件 Token 来源。CSS 构建与拷贝通过；未执行浏览器交互或模式矩阵。

## 保留与待完成

### 倍速选中态已核对

回读 1963:4438 下普通项 1963:4430 与选中项 1963:4431（实例虚拟子节点）：两者 root fills/effects 均为空，选中由 Show function icon=true 表达；实际可见正文都使用 selectMenuItem/color/text-default，勾选图标使用 selected/icon-default。Web 去掉局部 color/font 继承造成的 Token 遮蔽，正文使用共享 Typography text 指标和组件文字颜色；选中默认透明且无阴影，显式 select-item-selected-bg/fg 和 input-surface-shadow 仍优先。勾选容器/图标尺寸接入 icon-width/height，保留 select-item-icon-size 显式覆盖。选中菜单并不因此等同于 Navigation 的 tertiary 表面。

本批 CSS 构建、样式拷贝和 changelog 配对通过；浏览器状态矩阵仍未验证。

- 播放区域黑边、宽高、object-fit、播放状态与自动隐藏逻辑保留；进度条禁用态继续使用共享 Slider 规则，尚无 Video 独立禁用绑定证据。
- Light 的既有 72% 混色和模糊/饱和度处理仍保留。此次读取到背景 paint 为 NORMAL、opacity=1，旧代码关于 luminosity 的说明不能作为已核对证据；需进一步核对节点合成和材质需求，未声称像素一致。
- 浮动栏/进度指示器效果 ON/OFF 规则仍待统一，不能仅靠接入固定颜色 Token 标记效果模式完成。
- 控制按钮、时间文本、菜单、进度悬浮状态与完整模式、全屏、键盘/拖动、旧覆盖、局部作用域验收尚未完成。
- 当前浏览器控制及新标签页挂载不可用，本批未做新的可视验证。

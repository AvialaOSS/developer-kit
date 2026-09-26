# ColorPicker

## 3.1.0

### Fixed

- 禁用输入保持表面不透明，内容与文字按 Figma 图层分别消费组件透明度 Token，占位符不重复淡化。

### Fixed

- 输入触发器的共享悬浮背景在局部主题中重新解析，保留显式 input-bg-hover 覆盖。

### Changed

- 禁用触发器背景接入 ColorPickerInput 的独立禁用背景 Token，保留显式 input-bg-default 覆盖。

- ColorPickButton 支持可选 trailingIcon，图标槽消费独立宽高和颜色 Token，默认预设色块保持原样。

- 触发器支持可选 leadingIcon / trailingIcon，消费独立图标宽高与颜色 Token；占位文字透明度改用 ColorPickerInput Token，显式旧覆盖仍优先。

- 调色板渐变与选色区域覆盖完整面板，按设计保留外层留白；内部留白不再缩小渐变，调色板圆角同步应用于渐变裁切。

- 触发器内色块的圆角接入独立组件 Token，可分别调整预览色块与外框圆角。

- 弹窗内的颜色面板与格式选单保留局部 Token 覆盖；容器选择同时检查 Modal 和全屏边界，避免弹层挂到边界之外。

- 触发器 regular/big 的间距、内外留白、默认与全圆角、背景、文字和打开态边框接入独立 ColorPickerInput Token。
- 面板颜色与透明度输入框接入共享 BaseInput 的尺寸、留白、背景、文字及焦点边框 Token，字体指标继续消费共享 Typography。
- 预设色块按钮接入 ColorPickButton 外壳与预览尺寸、留白、圆角和颜色 Token，按内描边保持默认26px外壳／20px预览；旧尺寸覆盖保留，按钮提供颜色名称与选中状态。
- 调色区补齐外层与调色板两层留白，操作行和指示器描边消费独立 Token；色相及透明度轨道跟随共享 Slider 的 big 尺寸，显式旧轨道高度仍可覆盖。
- 面板根容器的背景、边框颜色、圆角、间距与留白接入 ColorPickerPanel Token，保留显式旧变量覆盖。

### Fixed
- 普通页面中的弹层及其格式选单挂载到 ColorPicker 局部作用域，跟随祖先 Token 覆盖实时变化；全屏和 Modal 容器继续保留原有挂载优先级。
- 预设颜色按规范化后的颜色值判断选中，修复十六进制大小写不同导致选中状态丢失。
- 共享输入字号、行高和图标插槽默认高度在局部主题中解析，避免继承外层已解析的密度值；保留显式旧覆盖。

## 2.8.0

### Fixed
- 面板 Portal 挂到全屏元素或 Modal 容器，避免被对话框遮罩挡住或全屏后不可用

## 2.6.0

### Changed
- 色相 / 透明度轨道改为复用共享 `Slider`（新拇指视觉与交互），轨道仍为光谱 / 透明度渐变
- ColorPicker 内轨道使用 `size="big"`（16px，与拇指同高）+ inset ring；透明度渐变用同色 `rgba(…,0)` 避免脏插值，棋盘格与渐变均 `100%` 铺满
- 色相状态改为本地 HSVA 保真：拖到 360°（与 0° 同为红色）时拇指不再被 hex 往返弹回起点
- 占位与控件 aria 文案改由 `LocaleProvider` 提供

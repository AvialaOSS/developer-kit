# TimePickerField

## [Unreleased]

### Added

- TimePicker、TimePickerField、TimePickerWheels 支持 showSeconds；值结构新增可选 seconds。默认保持时分，开启后显示 HH:mm:ss 与 00–59 秒列，使用既有秒列组件 Token。
- 秒值省略时开启秒列按 00 显示；修改时分保留秒值，隐藏秒列不清空已有秒。中文与英文提供秒列无障碍标签。

### Fixed
- 时间滚轮的程序滚动补齐结束兜底，避免缺少 scrollend 时阻塞后续用户选值。

- 修复 TimePickerField.defaultValue 与原生按钮 defaultValue 类型相交，导致时间对象被拒绝的问题。

### Fixed

- 禁用输入框保持背景不透明，内容槽与内部文字分层消费组件透明度 Token，避免整体淡化背景或重复淡化占位符。

### Fixed
- 移除会遮蔽组件占位符透明度 Token 的旧全局默认声明，保留显式旧覆盖及其他输入组件的兼容回退。

### Changed
- 时分滚轮选中高亮补齐与 ScrollPicker 一致的底部内阴影，沿现有 Figma 引用链跟随效果模式。
- 时间输入框两档尺寸、全圆角、图标槽、文字、背景和激活边框接入 TimePickerInput Token，内阴影颜色使用自身引用，显式旧 Input 覆盖继续优先。
- 时间面板、时分列间距与留白、分隔线接入独立组件 Token；选项复用 ScrollPickerItem，保留显式旧样式覆盖。
- 滚轮视口高度在局部主题中按选项高度、间距和可见行数计算；调整密度或选项尺寸后重新对齐已选值。

## 3.0.0

### Fixed
- 时间面板不再使用 `role="application"`，改为 `role="group"`；面板内的时 / 分列仍是可 Tab 到达的 listbox，支持 Up / Down / Home / End

## 2.8.0

### Fixed
- 面板 Portal 挂到全屏元素或 Modal 容器，避免被对话框遮罩挡住或全屏后不可用

## 2.6.1

### Changed
- 时分滚轮：鼠标滚轮步进更灵敏，可一次跨多格，并允许打断进行中的平滑滚动
- loop 滚轮按当前位置最短路径滚动，跨 0/末项不再整段甩回；选中字色经固定高亮框裁切随列表滚动，停稳后对准居中

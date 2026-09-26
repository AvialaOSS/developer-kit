# Switch

## 3.1.0

### Changed
- 轨道四状态、滑块颜色、禁用透明度和选中高光接入组件 Token；禁用选中态使用独立背景且隐藏高光，未选中禁用态仅滑块半透明。
- regular/small 的 x/y 内边距与圆角、滑块圆角支持组件 Token 覆盖；保留显式旧颜色、内边距和透明度覆盖，旧禁用透明度作用于滑块，不再整体叠乘。

## 2.8.1

### Changed
- 拇指改为可打断的流体滑动（`inset-inline` 配对过渡，约 260ms），移动中轻微拉长，连点可从当前进度反转
- 选中态轨道 Hover / Active 改为可过渡的 `background-color`（高光仍用 gloss 层），避免 `background-image` 瞬切

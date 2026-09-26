# Alert

## 3.1.0

### Changed

- 全部内置 Link 统一为 noBackgroundCustom，包括快速操作、关闭和底部主次操作。

- 说明文字按独立行角色消费 Token，主标题为空时不再误用标题色和加粗样式。

- 五种类型、两种外观的背景、边框、状态图标接入 Alert Token，正文、说明及各区域布局支持独立组件级覆盖。
- 显式旧 Alert 变量仍优先，字号、行高和字重继续使用共享字体指标。

### Fixed

- 窄屏下长快速操作可收缩换行，避免挤出关闭按钮；底部操作在空间不足时换行。
- 次操作直接消费 Caption noBackgroundCustom Link 颜色，显式 alert-secondary-action-fg 覆盖现在可正确生效。
- 操作区 start/end 留白正确跟随 RTL；旧 actions-pl/actions-pr 覆盖继续保持物理左右方向。
- 无 description 时标题不再误用说明颜色，Small 标题颜色覆盖不再被通用 Typography 规则遮蔽。
- title 类型支持 ReactNode，不再受原生 HTML title 限制。

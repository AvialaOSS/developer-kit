# Table

## [Unreleased]

### Added
- TableHead 增加可选 leftIcon/rightIcon，使用表头独立图标尺寸、槽留白、间距及颜色 Token；默认不渲染，Checkbox 表头保持原内容。

### Changed
- 默认人物头像对齐 Figma 的 Display / Icon / LineHeightFix OFF 变体；显式传入 people 时仍使用调用方内容，新增内容变体展示便于集中验收。
- 图形占位按 Figma 引用的 IconPlace theme/light 非全圆角变体显示，尺寸、留白、圆角和图标配色使用 IconPlace Token，保留显式旧尺寸覆盖。
- 内容层区分标题、前置图标/头像、按钮槽和 Checkbox，分别接入留白与间距 Token；自定义 children 保留直接子节点结构，显式旧留白覆盖仍可用。
- 表头、正文与描述文字分别消费对应颜色 Token；普通图标宽度、容器高度与颜色独立消费 TableCellContent Token，继续共用 Typography 字体指标。
- 表格外层留白、圆角、背景和描边接入 Table Token，表头及正文单元格分别消费自身背景、边框颜色与宽度；保留显式旧背景、边框和圆角覆盖。

## 3.0.0

### Changed
- `TableCell` `content="people"` 未传 `people` 时，默认头像改用 `users_user` 图标，不再显示 `A` 占位字母

### Removed
- `TableCell` `content="badge"` 未传 `badge` / `badgeLabel` 时不再回填 `Text` 占位 Badge
- `TableCell` `content="icon-place+text"` 未传 `iconPlace` / `icon` 时不再渲染 `A` 占位形底，图标位整体省略

## 2.7.0

### Added
- `Table` `stickyHeader`：表头在表格滚动区域内吸顶
- `TableCell` `caption`：主文案下方次要说明
- `TableCell` `iconPlace` / `content="icon-place+text"`：带形底的图标位 + 文案布局
- `TableCell` `grabber`：可选前置拖拽/把手控件
- `TableHead` `actions` / `checkboxProps`：表头操作区与全选 Checkbox 配置

### Changed
- 单元格改为网格边框与表头底色 token（含 `--table-head-bg`、非对称左右内边距等）

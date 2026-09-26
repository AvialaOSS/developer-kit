# Layout Helper 迁移核对

2026-09-24 通过 Figma API 只读核对 Components 原文件的 System Composition 页（128:66）。未修改设计稿。

## 当前证据

- Layout Helper：299:12392，单一组件，横向不换行布局，padding 6px × 8px，gap 4px。
- 子节点为 Icons 实例（299:12374，14 × 18px）与文字 Replace Me（299:12372）。文字字号、行高、字重继续引用共享 Typography。
- 背景、描边、文字、图标及尺寸使用 layoutHelper 组件变量；标准项目包含 11 个该组 Token。
- Layout Helper Group：299:12469，纵向布局，padding 0，gap 6px，包含 7 个 Layout Helper 实例；标准项目另有 1 个组间距 Token。
- 此次在 System Composition 页按实例名称找到的 7 处均属于该组。未跨全部页面遍历，也未据此断言其他页面没有使用。
- Spiral 的公开组件入口与生产样式没有对应实现。Stack 是无占位外观的布局容器，不能据名称相近当作 Layout Helper 的消费者。

## 已确认范围

用户已通过 Ask 确认：仅作设计稿占位工具，记录为 Web 不适用。无需新增 Spiral 公共组件或开发预览组件。

12 个 Token 保留在标准项目及迁移盘点中，供设计端使用；Web 迁移标记为不适用，不计为已实现组件。如果未来出现生产消费者，盘点脚本自动取消该豁免并要求重新审查。此决定仅限这两个占位部件，不豁免其他零引用分组。

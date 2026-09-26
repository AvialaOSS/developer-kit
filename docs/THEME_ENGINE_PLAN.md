# Theme Engine 统一变量体系实施方案

状态：规则已确认；标准核心、静态与动态输出已实现，全组件迁移与验收进行中。本文包含本次 Goal 的完整范围，实际进展与剩余验收见 theme-engine/IMPLEMENTATION.md 及各组件迁移记录。

## 目标与职责

### 2026-09-21 用户扩展的 Goal 范围

本次 Goal 包含 Spiral 全组件迁移，不再以 ScrollPicker 试点作为完成边界。此前 Goal 摘要中的“不包含全组件迁移”已被用户的新指令替代。保留标准模型、完整依赖、静态/运行时一致、可读名称与兼容、独立模式及必要文档等原有要求；未经授权的远端发布仍不包含。

全组件验收按公共组件及其内部视觉部件逐项记录：设计属性消费已确认的组件 Token，字号/行高/字重继续共用 Typography，布局算法常量明确区分。每项需覆盖变体/交互状态、亮暗/密度/效果、新 Token 覆盖与旧覆盖兼容，并记录不适用项的理由。未找到对应 Token 或语义冲突的属性通过 Ask 决定，不按近似名称自动映射。

用户后续确认全组件范围同时包含新增 Rate/RateIcon；不能再将这两项仅作为本轮之外的未实现组件。实现仍需沿用已有 Figma 结构、组件 Token 与共享 Typography，界面测试暂缓的限制保持有效。

用户暂缓需要手动操作 Figma 插件的验证；已完成创建与回读证据保留，已有变量更新/主动撤销标记为未验收，不反复请求操作。

用户要求减少验证以节省 Token：普通 Token 映射按批次统一检查，不逐项重复构建和浏览器测试；布局、交互及主题作用域变更只验证受影响关键路径。完整模式与兼容矩阵留到阶段验收，已通过且未受后续改动影响的结果复用。未执行的验证如实记录，不视为通过。

Theme Engine 拥有独立标准变量模型、校验、引用解析、模式组合和生色规则。版本化的标准项目是权威数据。Figma Variables 与 Web 输出都由同一标准项目生成。

- ThemeBuilder：维护基础变量库及独立项目，负责结构编辑、导入差异、发布。
- ThemeCat：编辑已有 Token 的值或引用、预览、保存主题；不新增、删除、改名或修改 Collection/Mode 结构。
- Figma 适配器与同步助手：读取、差异比较、写入、回读验证，维护外部 ID 对应关系。
- Web 适配器：生成 CSS 和运行时主题，供 Spiral、ThemeCat 预览共同使用。
- Spiral：消费组件 Token；字号、行高、字重共用 Typography 与基础 Token。布局算法常量单独管理。

## 已确认的产品规则

1. ThemeCat 默认保存基础变量库的精确发布版本与差异覆盖，也可脱离为独立项目。脱离需复制完整依赖图，保留内部引用，而非展开为字面值。
2. Figma 编辑同步到标准项目草稿，确认差异后发布；各端自行选择跟进，发布不会自动写入所有文件。
3. Token ID 稳定且独立于名称、CSS 名称、Figma ID。同名重建时询问是否接替旧身份与引用；不得自动认领。接替前必须验证类型和受影响引用。
4. CSS 名默认由路径生成 kebab-case，可显式固定 cssName。旧 CSS 名集中兼容，只有明确破坏性升级且确认迁移清单后移除。
5. 模式约定：Light/Dark、Default/Mobile Friendly、ON/OFF，三个维度独立组合。已声明模式缺值阻止发布，除非显式声明继承默认模式。
6. 保留完整依赖链，包括 specialEffort 与外部 control Collection。ON/OFF 控制效果。
7. 移除字体重复固定值；通用 primary-foreground、destructive-foreground 跟随 text-normal-text-white，接受暗色反转。
8. Figma 不支持的表达不阻止标准项目与 Web 发布。同步助手尝试语义等价处理，回读验证成功后才标记完成；不得静默展开引用或近似替换。剩余项列明变量、模式、差异和手动操作。
9. 主题升级遇到删除冲突时，先选替代 Token、移除相关覆盖或取消升级；旧主题继续使用旧版本。升级必须原子提交。

## 标准模型草案

标准文件使用 schemaVersion，与项目发布版本分开。核心数据不包含 Figma 专用字段；外部对应关系由适配器持久化。

| 实体          | 主要字段与约束                                                                                             |
| ------------- | ---------------------------------------------------------------------------------------------------------- |
| Project       | id、schemaVersion、draftRevision、collections、tokens、cssCompatibility、tombstones                        |
| Release       | projectId、不可变 version、contentHash、标准项目快照                                                       |
| Collection    | id、name、axis、modes、defaultModeId；axis 为 color/density/effects/none，由导入配置指定                   |
| Mode          | id、name；名称遵循固定约定，none 轴允许单个默认模式                                                        |
| Token         | id、collectionId、path（分段数组）、layer、type、valuesByMode、可选 cssName                                |
| layer         | foundation/semantic/component；是语义分类，不从 Collection 显示名称推断                                    |
| type          | color、number、string、boolean、duration、cubicBezier；number 另带 dimension/ratio/fontWeight 等用途及单位 |
| Value         | literal、alias(targetId)、colorWithAlpha(color, alpha)、inheritDefault；引用类型必须兼容                   |
| Theme         | id、base(projectId, version, hash)、按 tokenId/modeId 保存的覆盖；独立主题直接关联独立 Project             |
| SourceBinding | adapter、外部文档身份、外部对象 ID/key、engineId、上次同步基线；Collection/Mode/Token 都保存映射           |
| Tombstone     | 已删除 ID、旧路径、类型、删除版本；用于同名重建候选和迁移诊断                                              |

颜色内部保存带 alpha 的结构化颜色；透明度内部统一 0–1，Figma 中 0–100 的数值仅由适配规则转换。尺寸显式记录单位；Web 对字体尺寸使用 rem 的规则由导出配置表达，不能仅凭 FLOAT 类型推断 px。Timing/Easing 导入单位与编码必须核对实际来源格式。

示意（不是现有文件格式）：

```json
{
  "id": "tok_scroll_background",
  "collectionId": "col_components",
  "path": ["scrollPicker", "color", "background"],
  "layer": "component",
  "type": "color",
  "valuesByMode": {
    "mode_default": { "kind": "alias", "targetId": "tok_surface" }
  }
}
```

CSS 仍展示 `--scroll-picker-color-background: var(--box-box-normal-background-white1)`。稳定 ID 不进入可见 CSS 名称。

## 适配与同步流程

首次导入：识别数据格式 → 显式映射 Collection 角色和模式 → 收集依赖 → 分配 Engine ID → 保存外部映射 → 完整校验 → 创建草稿。

再次导入：先按来源映射识别身份，不按名称盲目匹配；使用上次同步基线进行三方比较（基线、本地草稿、Figma 当前值）。冲突由用户选择，同名未知对象仅作为候选。

发布到 Figma：差异预览 → 能力检查 → 建立 Collection/Mode/Token → 第二遍写入引用 → 回读核对 → 保存每项结果与新基线。部分失败必须保留失败项与恢复信息，不将整个同步标记为成功。外部库变量不能假设可直接编辑。

模式解析时，各 Collection 根据自己的 axis 选择模式。引用跨 Collection 时按目标 Collection 的轴解析；组件默认模式因此可以引用 Dark 颜色和 Mobile Friendly 数值。只有显式 inheritDefault 才能回退，默认模式本身不得继承自己。

## CSS、作用域与兼容

- 已确认：旧 control-theme-lightbackground、control-normal-lightBackground 等语义定义作为独立兼容层保留，不强制映射到 colorSystem。新迁移组件严格消费标准项目接入的 Figma Token；旧消费者逐组件迁移并核对后，再显式退役对应兼容定义。
- 同一解析器服务静态输出与运行时应用；模式、覆盖和引用规则不可分别手写。
- CSS 名与兼容别名统一检测冲突；Collection 分组不能保证扁平 CSS 命名唯一。
- 在局部主题容器上重新声明对应引用链，避免从祖先继承的已解析值绕过局部覆盖。
- 主题切换仅清理由 Engine 写入的属性，不能删除使用者全部自定义属性。
- 兼容不仅是生成 `旧名: var(新名)`。这只能支持旧代码读取新值，不能让用户覆盖旧名驱动消费新名的组件。
- 迁移期需要保留组件消费端的旧覆盖入口，例如 `var(--旧覆盖名, var(--新名))`，或在显式主题配置导入时将旧覆盖转换为新 ID。两种方向分别记录，禁止相互引用形成环。
- 发布包验收覆盖生成器依赖文件、Vite 插件入口、CSS 入口与 Node API。

## 实施顺序与验收

| 阶段          | 交付                                                 | 验收门槛                                              |
| ------------- | ---------------------------------------------------- | ----------------------------------------------------- |
| A 对齐        | 本文、可重复运行的变量清单、待确认语义映射           | 区分确定的命名转换与待决语义变更，记录快照时间        |
| B 标准核心    | schema、解析器、校验、版本与覆盖模型                 | 类型/单位/循环/模式缺值均有具体诊断，导入 ID 稳定     |
| C 导入适配    | ThemeBuilder/Figma → 标准项目，完整依赖与来源映射    | 重复导入、改名、删除重建、三方冲突可验证              |
| D 双端输出    | CSS/runtime 共用解析器；Figma 写入计划与回读         | 静态与运行时一致，局部主题正确，受限项状态真实        |
| E 工具接入    | ThemeBuilder 草稿发布、ThemeCat 覆盖/独立主题/升级   | 冲突未解决不能升级；取消保持原主题完整                |
| F Spiral 迁移 | 全部公共组件及内部视觉部件逐项迁移，ScrollPicker 仅为起点 | 逐项完成变体/交互状态、模式组合、旧覆盖、新 Token 覆盖及安装后的发布包验证；不适用项说明理由 |

A 阶段只记录和审计。后续修改不得把语义相似当成已确认等价；具体冲突通过 Ask 确认。项目存储服务、多人协作和自动远端发布不在本次默认范围。

## 当前局限与待决项

- 当前基线是仓库内 2026-09-20 Components 快照，不代表持续同步的线上最新版本。
- 全组件迁移按各组件迁移记录推进；已接入 Token 不等于完成验收，不以单个试点或引用数量作为 Goal 完成依据。
- 旧 control 语义名与 colorSystem 新名不能只按词形自动配对。
- whiteOnly 等命名转换不等于颜色语义改变；保留现有 Figma 定义。
- Theme Engine 将先在现有 tokens 包中实现可独立测试、无 DOM/Figma 依赖的核心模块；是否拆成独立发布包在盘点 ThemeBuilder/ThemeCat 仓库后决定，避免提前绑定发布结构。

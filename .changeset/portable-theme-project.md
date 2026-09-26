---
"@aviala-design/tokens": minor
---

Add a portable project entry with typed tokens, graph validation, source identity mapping, independent mode resolution, and shared CSS declaration generation. Existing theme entry points remain available while the integration is migrated.

新增 Figma 逐变量和模式的写入预检说明，保留附加透明度引用表达，列明受限项；未验证类型和单位转换阻止写入，预检不冒充同步成功。

新增标准化回读比较，核对变量身份、路径、模式、单位及引用结构；缺失或残留对象、同值但引用被展开均不能标记验证通过。

来源映射保留外部库及扩展集合的只读能力，导入缺少元数据时不会解除已有约束；回写预检可按目标文件映射阻止只读对象修改。

支持导出 ThemeBuilder 快照与现有插件回写包，保留来源身份和引用，显式转换透明度单位并拒绝未支持的编码。

支持按路径改名并保留历史 CSS 别名，区分自动名称与显式固定名；初始项目迁移保持全部模式的 CSS 输出一致。

按 TestVar 真实格式支持自定义贝塞尔 EASING 的无损导入/导出，其他未映射缓动类型保持明确拒绝。

根据 Figma Plugin API 的秒单位转换 TIMING 与标准毫秒 duration，往返保留引用，避免千倍时长误差。

Validate imported project JSON before graph resolution, and provide scoped theme application that restores previous styles without removing unrelated custom properties. Include the CSS generator dependency in published packages.

Generate static styles from the canonical project with all dependency tokens and independent modes. Keep legacy semantic definitions separate, and include the source CSS needed by the published Vite plugin.

Use the same project for loadAldTheme and generateTheme. Dynamic palettes replace foundation colors while retaining authored references; density and effects can be selected independently.

Add local immutable release snapshots, exact-base theme overlays, validated upgrade decisions and independent theme detachment to the portable project API. Hosting and persistence remain caller responsibilities.

Track deleted token identities in drafts and offer explicit, type-checked adoption for recreated tokens. Unresolved draft references continue to block publication.

Provide three-way project merging with explicit conflict choices and preserved compatibility metadata, plus source-binding updates for confirmed identity adoption.

Add Node workspace storage with revision checks and atomic draft/baseline commits; conflicts do not write files.

# Theme Engine 本地草稿流程

所有命令从仓库根目录运行。先构建 tokens 包，使 Node 入口可用。此流程不发布 npm 包，也不写入 Figma。

## 初始化

```sh
node packages/tokens/scripts/project-store-cli.mjs init WORKSPACE.json PROJECT.json CONFIRMED_BASELINE.json
```

PROJECT 是标准项目，CONFIRMED_BASELINE 是上次已确认的导入候选（包含 source、project、bindings）。不要使用未经确认的新候选冒充基线。工作区已存在时拒绝覆盖。

工作区把草稿、来源基线和映射保存在同一个文件中。仓库用于生成 CSS 的 `ald.project.json` 不会被自动替换。

来源映射校验与导入器保持一致：同一来源、同一实体种类内，外部 ID 和 Engine ID 都不能出现重复的活动映射。显式接替身份时允许保留 retired 历史映射；不同来源仍可各自关联同一个 Engine ID。无效映射在读取或提交时拒绝，提交失败不会覆盖已有草稿。2026-09-21 已补齐重复 Engine ID 检查，4 项存储集成测试通过，包括历史接替与失败后文件不变。

## 预览和提交

```sh
node packages/tokens/scripts/project-store-cli.mjs preview WORKSPACE.json NEW_CANDIDATE.json
node packages/tokens/scripts/project-store-cli.mjs apply WORKSPACE.json NEW_CANDIDATE.json PREVIEW_REVISION CHOICES.json
```

预览返回 revision，以及合并结果或冲突。CHOICES 是以冲突 key 为键、local 或 incoming 为值的 JSON 对象；没有冲突时可以省略。提交必须使用刚刚预览的 revision，文件有新修改时会拒绝，不覆盖别人或用户后续编辑。冲突未解决时不写入。

成功提交同时更新本地草稿与来源基线。保留本地值时，来源基线仍记录此次实际来源值，以便下次正确识别双方变化。

## 导出

```sh
node packages/tokens/scripts/project-store-cli.mjs export WORKSPACE.json NEW_PROJECT.json PREVIEW_REVISION
```

导出只新建文件。确认结果后可将标准项目作为构建输入；发布仍需严格校验。草稿存储允许尚未解决的引用，不代表可发布。

## 并发与恢复

写入使用版本校验、排他锁和同目录临时文件替换。不能把旧预览的选择直接应用于新状态。进程崩溃可能留下 `.lock` 文件；先确认没有写入进程，再检查和恢复，程序不会自动抢占旧锁。

Node API 为 `readProjectStore`、`commitProjectStore`、`mergeStoredSnapshot`，从 `@aviala-design/tokens/node` 导入。纯项目、合并与版本 API 位于 `/project`，不包含文件系统依赖。

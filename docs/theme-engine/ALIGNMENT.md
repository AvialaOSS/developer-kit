# Figma / Spiral 变量对齐清单

基线：2026-09-20T05:39:38.523Z，文件 aykyMmGyzVPkAsf8oRBZg0。只审计本地快照，不表示线上最新状态。
当前输出：标准项目修订 13，2002 个 Token，26 个兼容别名。使用生产标准生成器核对，不使用历史快照生成器判断缺失。

运行 `node packages/tokens/scripts/audit-theme-alignment.mjs` 重新生成。完整逐变量记录见 alignment.json。源码出现位置不等于运行时生效，命名候选不等于语义映射已批准。

## 本地 Figma 快照 Collection

| 名称                 | 数量 | 模式                      |
| -------------------- | ---: | ------------------------- |
| numbers              |   58 | Default / Mobile Friendly |
| fontWeight           |    6 | Mode 1                    |
| colorSystem          |  138 | Light / Dark              |
| specialEffort        |    5 | ON / OFF                  |
| componentToken       | 1705 | Default                   |
| Aviala Design Colors |   62 | Light / Dark              |
| control              |    2 | default                   |

## 标准项目与快照的差异

快照变量 1976 项；未映射至标准项目 0 项；标准项目独有 26 项。独有项只表示本地快照未包含，不能据此推断线上 Figma 已有或没有。

| 标准项目独有 Token                  | Collection           | CSS 名                                |
| ----------------------------------- | -------------------- | ------------------------------------- |
| success/success-11                  | Aviala Design Colors | --aviala-success-success-11           |
| success/success-12                  | Aviala Design Colors | --aviala-success-success-12           |
| warning/warning-1                   | Aviala Design Colors | --aviala-warning-warning-1            |
| warning/warning-11                  | Aviala Design Colors | --aviala-warning-warning-11           |
| warning/warning-12                  | Aviala Design Colors | --aviala-warning-warning-12           |
| error/error-11                      | Aviala Design Colors | --aviala-error-error-11               |
| error/error-12                      | Aviala Design Colors | --aviala-error-error-12               |
| info/info-11                        | Aviala Design Colors | --aviala-info-info-11                 |
| info/info-12                        | Aviala Design Colors | --aviala-info-info-12                 |
| neutral/neutral-9                   | Aviala Design Colors | --aviala-neutral-neutral-9            |
| neutral/neutral-12                  | Aviala Design Colors | --aviala-neutral-neutral-12           |
| primary/primary-11                  | Aviala Design Colors | --aviala-primary-primary-11           |
| shadow/menu                         | specialEffort        | --shadow-menu                         |
| shadow/switch-pointer               | specialEffort        | --shadow-switch-pointer               |
| shadow/slider-1                     | specialEffort        | --shadow-slider-1                     |
| shadow/slider-2                     | specialEffort        | --shadow-slider-2                     |
| selectMenu/color/shadow-default     | componentToken       | --select-menu-color-shadow-default    |
| selectMenu/size/shadow/offset-x     | componentToken       | --select-menu-size-shadow-offset-x    |
| selectMenu/size/shadow/offset-y     | componentToken       | --select-menu-size-shadow-offset-y    |
| selectMenu/size/shadow/radius       | componentToken       | --select-menu-size-shadow-radius      |
| selectMenu/size/shadow/spread       | componentToken       | --select-menu-size-shadow-spread      |
| switch/color/pointer-shadow-default | componentToken       | --switch-color-pointer-shadow-default |
| switch/size/pointer-shadow/offset-x | componentToken       | --switch-size-pointer-shadow-offset-x |
| switch/size/pointer-shadow/offset-y | componentToken       | --switch-size-pointer-shadow-offset-y |
| switch/size/pointer-shadow/radius   | componentToken       | --switch-size-pointer-shadow-radius   |
| switch/size/pointer-shadow/spread   | componentToken       | --switch-size-pointer-shadow-spread   |

## 被引用但未生成定义的变量

标准输出中未闭合的 CSS 引用：0。此检查不借助手写兼容层补齐引用。

| Collection | Figma 路径 | 缺失 CSS 名 | 引用方示例 |
| ---------- | ---------- | ----------- | ---------- |

## 源码仍出现的旧拼写候选

只列同一 Figma 路径的新旧规范化差异，不自动批准不同语义之间的替换。旧覆盖入口需单独保留。

| Figma 路径                              | 旧拼写                                    | 新拼写                                      | 旧名位置示例                                                                                                     |
| --------------------------------------- | ----------------------------------------- | ------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| box/box-normal-Background-blackOnly     | --box-box-normal-background-blackonly     | --box-box-normal-background-black-only      | packages/tokens/src/semantic/colors.css:24、packages/tokens/src/semantic/components.css:994                      |
| box/box-normal-Background-whiteOnly     | --box-box-normal-background-whiteonly     | --box-box-normal-background-white-only      | packages/tokens/src/semantic/colors.css:23、packages/tokens/src/semantic/components.css:365                      |
| special-effort/se-lineShadow-all        | --special-effort-se-lineshadow-all        | --special-effort-se-line-shadow-all         | packages/tokens/src/semantic/button-effects.css:79                                                               |
| special-effort/se-lineShadow-bottom     | --special-effort-se-lineshadow-bottom     | --special-effort-se-line-shadow-bottom      | packages/tokens/src/semantic/button-effects.css:83、packages/tokens/src/semantic/components.css:120              |
| special-effort/se-lineShadow-bottomDeep | --special-effort-se-lineshadow-bottomdeep | --special-effort-se-line-shadow-bottom-deep | packages/tokens/src/semantic/button-effects.css:81                                                               |
| padding/padding-littleSmall             | --padding-littlesmall                     | --padding-little-small                      | packages/tokens/src/semantic/datepicker-effects.css:551、packages/tokens/src/semantic/datepicker-effects.css:593 |

## 独立保留的旧语义层

- 已确认：旧 control/control-normal-lightBackground 与 control/control-theme-lightbackground 等定义独立保留，不强行映射到新 colorSystem。
- 新迁移组件严格消费标准项目中的 Figma Token；旧组件逐个迁移并验收后，再显式退役兼容定义。
- ScrollPicker 原选中背景消费旧 theme-lightbackground，新组件 Token 消费 Figma 指定背景；以新 Figma 为准，但迁移差异应显式展示。
- 字号、行高、字重继续使用共享 Typography；不得将全部基础变量直接消费统计视为缺陷。

## 已确认的处理规则

缺失依赖完整导入；特效支持 ON/OFF；旧名持续兼容直至明确破坏性升级；text-normal-text-white 允许随模式反转。详细实施规则见 ../THEME_ENGINE_PLAN.md。

# 全组件 Token 迁移盘点

用户已将全组件迁移纳入 Goal。此表只统计生产源码中组件 Token 的直接引用，不能当成迁移完成率。动态变量名、共享部件和间接引用需逐项检查。

验收还需记录：公共组件对应的 Figma 部件、变体与状态、三轴模式、新旧覆盖入口、字体指标与算法常量例外、实际渲染证据。没有组件 Token 的公共组件也必须调查，不得漏项。

公共组件来源模块：52；组件 Token 分组：102；组件 Token：1720。

| Figma Token 分组                    | Token 数 | 直接引用数 | 当前判定                       |
| ----------------------------------- | -------: | ---------: | ------------------------------ |
| alert                               |       39 |         39 | 待逐属性验收                   |
| anchor                              |        1 |          1 | 待逐属性验收                   |
| anchorItem                          |       17 |         17 | 待逐属性验收                   |
| avata                               |       28 |         28 | 待逐属性验收                   |
| badge                               |       62 |         62 | 待逐属性验收                   |
| baseInput                           |       23 |         23 | 待逐属性验收                   |
| breadcrumb                          |        2 |          2 | 待逐属性验收                   |
| breadcrumbItem                      |       43 |         43 | 待逐属性验收                   |
| button                              |      134 |        110 | 待逐属性验收                   |
| buttonGroup                         |        3 |          3 | 待逐属性验收                   |
| card                                |        4 |          4 | 待逐属性验收                   |
| cardItemBody                        |        9 |          9 | 待逐属性验收                   |
| cardItemBottom                      |       25 |         25 | 待逐属性验收                   |
| cardItemHead                        |       25 |         25 | 待逐属性验收                   |
| cascaderInput                       |       22 |         22 | 待逐属性验收                   |
| cascaderMenu                        |        6 |          6 | 待逐属性验收                   |
| cascaderMenuItem                    |       22 |         17 | 待逐属性验收                   |
| cascaderMenuItemGroup               |        7 |          7 | 待逐属性验收                   |
| cascaderMenuItemGroupGroup          |        2 |          2 | 待逐属性验收                   |
| checkbox                            |       39 |         38 | 待逐属性验收                   |
| checkboxInput                       |        6 |          5 | 待逐属性验收                   |
| checkboxInputGroup                  |        2 |          2 | 待逐属性验收                   |
| colorPickButton                     |       12 |         12 | 待逐属性验收                   |
| colorPickerInput                    |       23 |         23 | 待逐属性验收                   |
| colorPickerPanel                    |       17 |         17 | 待逐属性验收                   |
| controller                          |        8 |          8 | 待逐属性验收                   |
| dateButton                          |       11 |         11 | 待逐属性验收                   |
| dateButtonGrid                      |        5 |          4 | 待逐属性验收                   |
| datePickerInput                     |       25 |         22 | 待逐属性验收                   |
| datePickerList                      |        9 |          6 | 待逐属性验收                   |
| datePickerMenuItemGroupMonth        |        5 |          5 | 待逐属性验收                   |
| datePickerMenuItemGroupYear         |        5 |          5 | 待逐属性验收                   |
| datePickerMenuItemGroupYearAndMonth |        3 |          3 | 待逐属性验收                   |
| datePickerMonthPointer              |        4 |          4 | 待逐属性验收                   |
| datePickerSelectMenu                |        6 |          5 | 待逐属性验收                   |
| drawerActionArea                    |       11 |         11 | 待逐属性验收                   |
| drawerContentArea                   |       13 |         13 | 待逐属性验收                   |
| drawerHeadArea                      |       22 |         22 | 待逐属性验收                   |
| drawerView                          |        6 |          6 | 待逐属性验收                   |
| drawerWrapper                       |        4 |          3 | 待逐属性验收                   |
| feedback                            |       44 |         44 | 待逐属性验收                   |
| form                                |        7 |          7 | 待逐属性验收                   |
| formGroup                           |        8 |          8 | 待逐属性验收                   |
| iconPlace                           |       36 |         12 | 待逐属性验收                   |
| inputGroup                          |        1 |          1 | 待逐属性验收                   |
| inputGroupInput                     |        2 |          2 | 待逐属性验收                   |
| layoutHelper                        |       11 |          0 | Web 不适用：已确认设计占位工具 |
| layoutHelperGroup                   |        1 |          0 | Web 不适用：已确认设计占位工具 |
| link                                |       39 |         39 | 待逐属性验收                   |
| list                                |       19 |         14 | 待逐属性验收                   |
| listItem                            |       32 |         30 | 待逐属性验收                   |
| loadingIcon                         |       31 |         23 | 待逐属性验收                   |
| modal                               |        3 |          3 | 待逐属性验收                   |
| modalActionArea                     |        6 |          6 | 待逐属性验收                   |
| modalContentArea                    |        7 |          7 | 待逐属性验收                   |
| modalHeadArea                       |       23 |         23 | 待逐属性验收                   |
| navigation                          |        9 |          9 | 待逐属性验收                   |
| navigationChildGroup                |        1 |          1 | 待逐属性验收                   |
| navigationItem                      |       42 |         42 | 待逐属性验收                   |
| numberInput                         |       24 |         24 | 待逐属性验收                   |
| pagehead                            |       18 |         18 | 待逐属性验收                   |
| pagination                          |        5 |          5 | 待逐属性验收                   |
| popover                             |       25 |         22 | 待逐属性验收                   |
| popoverSlot                         |        3 |          3 | 待逐属性验收                   |
| progress                            |       30 |         26 | 待逐属性验收                   |
| radio                               |       17 |         16 | 待逐属性验收                   |
| radioInput                          |       12 |         11 | 待逐属性验收                   |
| radioInputGroup                     |        4 |          4 | 待逐属性验收                   |
| rate                                |        4 |          2 | 待逐属性验收                   |
| rateIcon                            |       57 |          0 | 待逐属性验收                   |
| scroll                              |        6 |          6 | 待逐属性验收                   |
| scrollPicker                        |        6 |          6 | 待逐属性验收                   |
| scrollPickerColumn                  |        4 |          4 | 待逐属性验收                   |
| scrollPickerItem                    |        7 |          7 | 待逐属性验收                   |
| segmentatorButton                   |       46 |         46 | 待逐属性验收                   |
| segmentatorGroup                    |       14 |         14 | 待逐属性验收                   |
| selectInput                         |       23 |         23 | 待逐属性验收                   |
| selectMenu                          |       11 |         11 | 待逐属性验收                   |
| selectMenuItem                      |       25 |         23 | 待逐属性验收                   |
| selectMenuItemGroup                 |        7 |          7 | 待逐属性验收                   |
| slider                              |       34 |         34 | 待逐属性验收                   |
| steps                               |        2 |          2 | 待逐属性验收                   |
| stepsIcon                           |       17 |         17 | 待逐属性验收                   |
| stepsItem                           |       14 |         14 | 待逐属性验收                   |
| switch                              |       24 |         20 | 待逐属性验收                   |
| tab                                 |       14 |         14 | 待逐属性验收                   |
| tabItem                             |       29 |         27 | 待逐属性验收                   |
| table                               |        7 |          6 | 待逐属性验收                   |
| tableCell                           |        9 |          9 | 待逐属性验收                   |
| tableCellContent                    |       11 |         11 | 待逐属性验收                   |
| tableHead                           |       19 |         19 | 待逐属性验收                   |
| tag                                 |       25 |         25 | 待逐属性验收                   |
| textareaInput                       |       23 |         21 | 待逐属性验收                   |
| timePickerInput                     |       22 |         22 | 待逐属性验收                   |
| timePickerMenuItemGroupHour         |        5 |          5 | 待逐属性验收                   |
| timePickerMenuItemGroupMin          |        5 |          5 | 待逐属性验收                   |
| timePickerMenuItemGroupSec          |        5 |          5 | 待逐属性验收                   |
| timePickerSelectMenu                |        6 |          6 | 待逐属性验收                   |
| timePickerTimepick                  |        3 |          3 | 待逐属性验收                   |
| tooltip                             |       23 |         20 | 待逐属性验收                   |
| upload                              |        6 |          5 | 待逐属性验收                   |
| video                               |       37 |         37 | 待逐属性验收                   |

## 公共组件来源模块

- `./components/alert`
- `./components/anchor`
- `./components/avatar`
- `./components/badge`
- `./components/breadcrumb`
- `./components/button`
- `./components/button-group`
- `./components/card`
- `./components/cascader`
- `./components/checkbox`
- `./components/color-picker`
- `./components/date-picker`
- `./components/drawer`
- `./components/feedback`
- `./components/form-field`
- `./components/form-field-context`
- `./components/hover-popover`
- `./components/input`
- `./components/input-group`
- `./components/label`
- `./components/link`
- `./components/list`
- `./components/loading`
- `./components/modal`
- `./components/multi-select`
- `./components/navigation`
- `./components/number-input`
- `./components/pagehead`
- `./components/pagination`
- `./components/popover`
- `./components/progress`
- `./components/radio-group`
- `./components/rate`
- `./components/responsive-tooltip`
- `./components/scroll`
- `./components/scroll-picker`
- `./components/segmentator`
- `./components/select`
- `./components/slider`
- `./components/stack`
- `./components/steps`
- `./components/switch`
- `./components/tab`
- `./components/table`
- `./components/tag`
- `./components/textarea`
- `./components/time-picker`
- `./components/tooltip`
- `./components/typeface`
- `./components/typography`
- `./components/upload`
- `./components/video`

复跑：先构建 tokens，再运行 `node packages/tokens/scripts/audit-component-migration.mjs`。

## 公共入口覆盖

- `.` → `./src/index.ts`：51 个直接导出的组件来源模块。
- `./form` → `./src/form.ts`：1 个直接导出的组件来源模块。

此清单由 package.json 的 development 入口推导，包含 /form；间接再导出与内部视觉部件仍需人工核对。

## 已定位、仍待处理的呈现缺项

这些项目仍计入待验收范围；不自动用相近名称替换现有绑定，也不按直接引用率判定完成。

## 已确认当前不使用的 Token

- `table/size/gap`：User confirmed continuous tables with zero row/column gaps on 2026-09-24; retain this token without a Web consumer. 参见 [Table 迁移记录](./TABLE_MIGRATION.md)。

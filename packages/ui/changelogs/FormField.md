# FormField

## 3.1.0

### Changed

- 标签、说明、必填标记及横纵布局间距改为消费 Form 组件级 Token，字体指标继续共用 Typography。

## 3.0.0

### Changed
- **BREAKING** `FormField` 从主入口移至 `@aviala-design/spiral/form`（layout 模式与 react-hook-form 模式均在此入口）。迁移方式：`import { FormField } from "@aviala-design/spiral/form";`。
- `useResolvedControlError` 仍从主入口导出，Input / Textarea / Select / NumberInput / Cascader / DatePicker / TimePicker 的 error 联动行为不变。

## 2.7.2

### Changed
- 存在错误 tip（layout `error` 或 RHF 校验信息）时，子级 Input / Textarea / NumberInput / SelectTrigger / Cascader / DatePicker / TimePicker 自动进入 error 态；控件上显式 `error` 优先于联动。

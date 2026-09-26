---
"@aviala-design/spiral": patch
"@aviala-design/tokens": patch
---

Input 几何属性接入 BaseInput Token，保留共享旧尺寸覆盖及未迁移消费者默认行为。
背景、文字、图标、焦点描边及阴影色独立消费组件 Token。
默认图标尺寸及插槽高度消费组件 Token，显式图标档位保持优先。
修复嵌套独立主题切换密度时文字行高继承外层旧值的问题。

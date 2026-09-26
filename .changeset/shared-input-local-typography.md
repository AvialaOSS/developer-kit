---
"@aviala-design/tokens": patch
"@aviala-design/spiral": patch
---

修复共享输入消费者在局部 ThemeProvider 下继承外层已解析字号、行高和插槽高度的问题；保留显式 input-font-size、input-line-height 和 input-icon-slot-height 覆盖。

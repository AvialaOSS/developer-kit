---
"@aviala-design/tokens": patch
"@aviala-design/spiral": patch
---

Use component tokens for Tooltip surface, text, pointer color, padding, radius and both shadow layers while preserving explicit legacy CSS overrides.

Measure token-driven pointer dimensions through the forwarded SVG ref so runtime theme changes update placement. Keep surface and pointer color overrides independent.

Constrain long Tooltip content to the placement's available width and wrap unbroken paths on narrow screens.

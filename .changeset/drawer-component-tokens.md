---
"@aviala-design/spiral": patch
"@aviala-design/tokens": patch
---

Connect Drawer wrapper insets and backdrop, view layout and border, and section padding, backgrounds and separators to component tokens. Preserve explicit legacy overrides and distinguish standalone section padding from Drawer View padding.

Separate header content and close-button slots, consume independent icon and text tokens, and remove the first-body-line font-weight override so body-only text retains shared Typography metrics.

Add the default body slot and action slot containers, including their independent padding and gaps; consume shared button-group spacing inside the action area.

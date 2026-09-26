---
"@aviala-design/spiral": patch
"@aviala-design/tokens": patch
---

Connect Modal surface radius and border, header spacing, and section backgrounds, padding and separators to their component tokens. Preserve explicit legacy overrides and add a project-theme verification story.

Use independent heading and body text color tokens. Let shared Typography control font metrics instead of forcing the first rendered body line to semibold, including body-only content.

Separate header content, headline, icon frame and close-button slot containers to preserve independent Figma spacing and icon sizing tokens.

Separate action-area, button-group and button-slot spacing instead of conflating their tokens.

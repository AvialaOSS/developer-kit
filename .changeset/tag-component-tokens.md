---
"@aviala-design/tokens": patch
"@aviala-design/spiral": patch
---

Connect Tag surface, border, gap and level-specific text/icon colors to component tokens, retaining explicit legacy overrides.

Use component tokens for icon width, container height and close-button vertical padding, preserving explicit legacy slot-height overrides.

Separate Tag alignment padding from its inner surface padding. Render the Figma outside stroke without adding layout height; root refs and attributes remain on the outer element.

Apply normal/disabled opacity tokens to text and icons only, preserving the surface, border and people avatar as specified by Figma. Legacy tag-disabled-opacity now overrides content opacity.

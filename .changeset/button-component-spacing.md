---
"@aviala-design/tokens": minor
"@aviala-design/spiral": patch
---

Consume Button component tokens for normal padding, gap, default and rounded radius across all four sizes while retaining explicit legacy spacing overrides. Forward size and icon-only attributes through asChild so composed elements receive the requested dimensions.

Render Button surface and content layers inside asChild elements while retaining their attributes, and avoid treating custom link components as icons.

Use separate component opacity tokens for text, icons, and loading indicators instead of multiplying content opacity by whole-button disabled opacity.

Consume primary background state, text, and icon component colors. Retain explicit legacy overrides and keep the original defaults for other components that share the former Button variables.

Drive primary shadow geometry, shadow colors, and gradient endpoints from component tokens, preserving Figma paint opacity and stop positions and honoring the independent effects axis.

Migrate outlined and backgroundless Button variants to separate component background, text, icon, stroke-state, and stroke-width tokens while preserving explicit legacy overrides.

Consume normal icon width and slot-height component tokens, retaining explicit icon sizing props and legacy size overrides.

Migrate primary icon-only padding and icon container geometry to component tokens, preserving explicit legacy height overrides.

Apply verified icon-only component geometry to both backgroundless variants and add independent theme-axis regression examples.

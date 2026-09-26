---
"@aviala-design/tokens": patch
"@aviala-design/spiral": patch
---

Align Popover's tooltip appearance with Tooltip component tokens, including theme colors, shadows, pointer measurement and available-width constraints. Preserve explicit legacy overrides.

Use Popover-specific background, foreground, radius and shadow tokens for default and primary appearances. Match Figma's two shadow layers for default and single layer for primary.

Separate surface and content-slot spacing tokens. Explicit legacy padding overrides apply to the slot; flush clears both layers and now also works for tooltip appearance.

Match Figma's 14×5 Popover pointer curve with runtime token sizing and borderless defaults. Explicit legacy border colors remain as outlines without occupying layout space.

Constrain default and primary panels to the available width and wrap long paths on narrow screens.

---
"@aviala-design/spiral": patch
"@aviala-design/tokens": patch
---

Connect Feedback layout to component tokens while preserving explicit legacy overrides. Keep title colors independent from optional descriptions and allow ReactNode titles.

Use variant-specific Feedback surface, border, text and status icon tokens, including separate primary wrong icon colors by size.

Align default status glyphs with the filled Figma icons, including the information glyph for normal feedback, while retaining custom icon overrides.

Let primary dismiss icons follow the shared foreground token and explicit legacy color overrides through the nested Link icon.

Allow long Feedback actions to wrap within available width instead of pushing the dismiss control outside the visible area.

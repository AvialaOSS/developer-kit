---
"@aviala-design/spiral": patch
"@aviala-design/tokens": patch
---

Connect Video's surface and Default/Light control-bar geometry to component tokens. Map seek-slider dimensions, colors and shadows to Video tokens without changing volume-slider behavior, and preserve explicit legacy overrides. Existing glass treatment and unresolved state/effect-mode differences remain pending.

Use PopoverSlot tokens for settings and volume content spacing, preserving explicit video spacing overrides.

Remove duplicated horizontal padding around the speed-menu group and use SelectMenuItem title spacing tokens.

Align speed-menu text and selection-marker tokens with Figma. Use a checkmark-only default selection without inherited generic selection shadows, preserving explicit overrides and shared typography metrics.

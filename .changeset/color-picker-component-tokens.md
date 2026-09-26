---
"@aviala-design/spiral": patch
"@aviala-design/tokens": patch
---

Connect ColorPicker panel surface and root layout to component tokens while preserving explicit legacy overrides.

Separate picking-area and palette padding, consume action-row and indicator tokens, and align hue/alpha track dimensions with the shared big Slider.

Use ColorPickButton surface, padding and preview tokens with an inset border; preserve legacy size overrides and expose swatch names and selection state to assistive technology.

Normalize preset colors before comparing selection so hexadecimal letter casing does not lose the selected state.

Connect panel color and opacity fields to shared BaseInput layout and color tokens, including focus styling, while retaining Typography metrics and legacy overrides.

Connect regular/big trigger layout, radii, text and surface states to independent ColorPickerInput tokens.

Use the dedicated ColorPickerInput preview radius token for the trigger swatch.

Paint the palette gradient across its full bounds, matching Figma's fill and absolute indicator layout; inherit palette radius and keep pointer coordinates aligned with the painted area.

Keep ColorPicker portals and nested format menus in the picker's local CSS scope so ancestor token overrides remain live. Allow contained local scopes inside modal and fullscreen boundaries, while rejecting scopes outside the active boundary.

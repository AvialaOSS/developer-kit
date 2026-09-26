---
"@aviala-design/spiral": patch
"@aviala-design/tokens": patch
---

Connect horizontal and vertical Navigation spacing, padding, background and divider tokens, plus vertical brand layout, while preserving explicit legacy overrides.

Connect horizontal brand, item and action layouts and vertical item, child and action layouts to independent component spacing tokens, retaining legacy item padding overrides.

Use component tokens for vertical child-group spacing and indicator color and corner radius, preserving explicit legacy spacing and color overrides.

Consume newly authored Navigation selected-state tokens for tertiary surfaces, text, leading icons and inset effects. Resolve indicator dimensions through CSS layout, including independent horizontal height and explicit legacy overrides.

Connect brand title spacing, padding, corner radius and text color to component tokens while preserving explicit legacy brand color overrides.

Connect flyout surface, single-group insets and item geometry/default text to Select component tokens without adding wrappers to the public menu structure.

Use menu-specific icon sizes/colors and default text color in Navigation flyouts. Fix Select text incorrectly consuming the icon color token; text now inherits the row's text/state color.

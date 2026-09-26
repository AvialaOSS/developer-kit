---
"@aviala-design/spiral": patch
"@aviala-design/tokens": patch
---

Connect List container and nested title layout to component tokens while preserving explicit legacy overrides. Support ReactNode section titles.

Connect ListItem root, leading icon region, content and trailing action spacing to their distinct component tokens.

Add inheritable default/deep appearance with per-item overrides and consume component background, text and description tokens.

Consume distinct content divider thickness and trailing divider dimensions without conflating their color semantics.

Use shared IconPlace layout and color tokens for shaped leading icons, preserving explicit legacy size and color overrides.

Connect plain leading icons to shared title icon metrics and color. Add the distinct ListItem title container for its gap and radius tokens.

Align action trailing structure with ButtonGroup spacing, use the no-background secondary action, and consume shared chevron metrics and color.

Prevent nested control activation from also invoking a non-link ListItem row's click callback.

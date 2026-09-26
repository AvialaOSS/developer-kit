---
"@aviala-design/tokens": minor
"@aviala-design/spiral": patch
---

Consume Radio geometry and state padding tokens, separate normal/card input geometry, and use dedicated group spacing for direct card inputs. Preserve explicit legacy size and gap overrides.

Migrate Radio state colors and input typography/card borders. Match Figma disabled states and visible unselected inner circles, and remove the default extra outer shadow while retaining legacy overrides.

Derive RadioInput disabled styling from the actual Radix item state so group-level disabling also updates card borders, text and icon opacity, cursor, and interaction backgrounds.

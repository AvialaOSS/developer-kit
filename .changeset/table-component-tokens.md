---
"@aviala-design/spiral": patch
"@aviala-design/tokens": patch
---

Connect Table's surface, insets and border geometry to component tokens. Use independent TableHead and TableCell backgrounds and border widths/colors while retaining explicit legacy overrides and existing shared-edge behavior.

Connect header, title and description colors and ordinary icon geometry/color to the corresponding content tokens. Keep shared Typography metrics and explicit legacy overrides; preserve the shaped icon-place treatment pending its separate migration.

Separate cell content, headline, leading and action slots so outer and inner spacing tokens do not apply twice. Keep direct custom children and existing control props while preserving explicit legacy content-padding overrides.

Align shaped icon places with the Figma theme/light, non-rounded IconPlace variant and consume its surface, geometry and icon tokens instead of the previous primary circular treatment.

Match the default people avatar to the Figma Display/Icon variant and add a consolidated content-variant story for layout inspection.

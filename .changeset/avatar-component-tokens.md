---
"@aviala-design/tokens": patch
"@aviala-design/spiral": patch
---

Use separate Avatar component colors for text and icon content, and component tokens for radius and icon size, retaining explicit legacy color overrides.

Connect level widths and available alignment-container heights to component tokens, and honor inherited legacy avatar-size overrides.

Preserve the Avatar image sizing and cropping class when consumers supply imgProps.className.

---
"@aviala-design/tokens": patch
"@aviala-design/spiral": patch
---

Use component tokens for Card outer layout, body layout and text, and the independent head/body/bottom surfaces. Preserve explicit legacy overrides.

Use independent Card title, description, icon and divider tokens. Icon containers follow density while typography metrics remain shared.

Separate heading and action layout tokens, including custom trailing content, while retaining explicit legacy layout overrides.

Add optional CardBottom title, description and icon slots backed by bottom-specific tokens. Accept ReactNode titles on both CardHead and CardBottom.

Use Button Group layout tokens inside Card actions and honor supplied actions in select variants with the Figma ordering.

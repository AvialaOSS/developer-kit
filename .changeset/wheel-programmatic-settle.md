---
"@aviala-design/spiral": patch
---

Schedule idle settlement for programmatic ScrollPicker and time-wheel scrolls so subsequent user scrolling can update the value even when native scrollend is not delivered.

Avoid pending programmatic state after a ScrollPicker operation that does not move the scroll position.

---
"@aviala-design/tokens": patch
---

Validate theme upgrade decision payloads before applying replacements or dropping overrides. Reject unknown fields and malformed maps or drop entries instead of silently treating them as empty decisions, preserving the original theme on failure.

Reject incompatible type or unit changes to tokens retained by theme overrides, even when their IDs are unchanged. Require a compatible replacement or an explicit override removal instead of silently reinterpreting numeric values.

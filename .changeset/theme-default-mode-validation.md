---
"@aviala-design/tokens": patch
---

Validate omitted mode axes using each collection's default, preventing projects with default-only reference cycles from passing publication checks.

Include the token identity, path and selected mode in cycle diagnostics so editors can locate the invalid value directly.

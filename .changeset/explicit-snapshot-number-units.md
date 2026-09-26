---
"@aviala-design/tokens": patch
---

Support source-ID numeric unit rules and optional strict unit requirements during snapshot import. Convert pixel literals to rem only with an explicit pixels-per-rem setting, preserve aliases, and reject incompatible units across reference chains. Existing imports retain legacy inference unless strict mode is enabled.

Enable strict numeric units in the repository's standard import command using persisted source-ID rules from the current baseline.

Persist collection roles by source ID so collection renames preserve mode axes, layers and CSS naming policies; new collections require explicit mappings.

Retain unit rules for deleted source identities already present in saved bindings. Unknown rule IDs and same-name replacements without explicit units still fail validation.

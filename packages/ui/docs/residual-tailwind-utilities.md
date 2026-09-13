# Residual Tailwind utilities

Build-time bridge: `@aviala-design/spiral` compiles leftover Tailwind utility
class names from `packages/ui/src` into `dist/styles.css` under
`@layer aviala-utils` (see `scripts/compile-utils-css.mjs`).

Consumers **do not** need Tailwind. When this inventory is empty, delete the
compile step and drop `tailwindcss` / `@tailwindcss/*` from `packages/ui`
devDependencies.

## How to refresh

```bash
# After editing component class strings:
pnpm --filter @aviala-design/spiral build:styles
pnpm --filter @aviala-design/spiral smoke:styles
```

Inspect the “Residual Tailwind utilities” block at the end of
`packages/ui/dist/styles.css`.

## Priority migration (highest utility density → effects CSS)

Migrate layout/interaction leftovers into the matching `*-effects.css` and
strip TW tokens from `cva` / `cn(...)`. Prefer the Badge / color-picker pattern
(effects own layout).

| Priority | Component   | Notes                                                      |
| -------- | ----------- | ---------------------------------------------------------- |
| 1        | Button      | densest mix — display/flex/cursor/disabled/loading overlay |
| 2        | Input       | `relative`, width, transparent field chrome                |
| 3        | NumberInput | shares Input patterns                                      |
| 4        | Segmentator | sticky/transition/opacity leftovers                        |
| 5        | Link        | `inline-flex` / size utilities                             |
| 6        | InputGroup  | flex/gap/shrink                                            |

Lower priority: Modal, Drawer, Checkbox, Avatar, Alert, Navigation, Stack,
Video, Table (mostly semantic already, thin TW tails).

## Checklist

When a component no longer emits non-`aviala-*` utility class strings:

- [ ] Button
- [ ] Input
- [ ] NumberInput
- [ ] Segmentator
- [ ] Link
- [ ] InputGroup
- [ ] Remaining long-tail files under `packages/ui/src/components/`

When **all** boxes are checked and `dist/styles.css` has no
`@layer aviala-utils` rules beyond an empty marker:

1. Remove `scripts/compile-utils-css.mjs` usage from `assemble-styles.mjs` /
   `vite-plugin.mjs`.
2. Remove `tailwindcss`, `@tailwindcss/node`, `@tailwindcss/oxide` from
   `packages/ui` `devDependencies`.
3. Update this doc to “complete — compile step removed” or delete it.
4. Keep `tailwind-merge` only if `cn()` still needs it for consumer class merges.

## Known false positives in the compiled sheet

The Tailwind v4 scanner may emit a few unused candidates (e.g. bare `ring`,
`outline`, `com`) from string noise. Prefer cleaning component sources over
maintaining an allowlist; they shrink as migration proceeds.

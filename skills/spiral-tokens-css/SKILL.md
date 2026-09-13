---
name: spiral-tokens-css
description: >-
  Maintainer skill for Spiral semantic *-effects.css, class↔CSS sync, residual
  Tailwind utilities, and the aggregated @aviala-design/spiral/styles.css build.
  Use when adding or changing component styles in packages/tokens or packages/ui.
audience: maintainer
---

# Spiral Tokens / CSS (maintainers)

**Audience: maintainer.** Consumer install is `CONSUMER.md` / `spiral-consume` — one published `styles.css`, no Tailwind. This skill covers how that file is built and how effects CSS stays in sync with components.

## Layout

| Path | Role |
| ---- | ---- |
| `packages/tokens/src/semantic/*-effects.css` / `*-extras.css` | Per-area component effect styles |
| `packages/tokens/scripts/css-lib.mjs` → `STANDALONE_CSS_MANIFEST` | Ordered list of standalone sheets; build asserts disk ↔ manifest |
| `buildSpiralAggregateCss()` | Tokens baseline + all effects (skip duplicate focus) + ALD theme |
| `packages/ui/scripts/assemble-styles.mjs` (+ compile-utils) | Produces published `packages/ui/dist/styles.css` (`@aviala-design/spiral/styles.css`) |
| `packages/ui/docs/residual-tailwind-utilities.md` | Inventory / migration of leftover TW utilities into effects |

When you add a new `*-effects.css` or `*-extras.css`, update `STANDALONE_CSS_MANIFEST` in the same change.

## Class ↔ CSS (both directions)

After renames or new `aviala-*` classes, run the cross-check from root `AGENTS.md` (emitted classes vs styled classes). Ghost classes (emitted, never styled) are bugs unless they match the known false-positive baseline. Prefer mapping unused variants to `""` instead of empty semantic class names.

## Residual Tailwind

Components may still emit a few Tailwind utility class strings. Those are **compiled at spiral build time** into `@layer aviala-utils` inside `styles.css`. Consumers must not depend on having Tailwind installed.

When migrating a component: move layout into the matching effects sheet, strip TW tokens from `cva` / `cn(...)`, refresh with `pnpm --filter @aviala-design/spiral build:styles` and `smoke:styles`. See `packages/ui/docs/residual-tailwind-utilities.md`.

## Verify

```bash
pnpm --filter @aviala-design/tokens build   # if tokens CSS / plugin changed
pnpm --filter @aviala-design/spiral build:styles
pnpm --filter @aviala-design/spiral smoke:styles
```

Hardcoded colors in UI TSX (except the documented color-picker slider gradient) remain forbidden — use tokens CSS variables.

## Related

- Theme runtime API: skill `spiral-theme`
- Component structure / Figma: skill `spiral-component`
- Consumer Hello Button path: `CONSUMER.md` (do not paste monorepo CSS build steps there)

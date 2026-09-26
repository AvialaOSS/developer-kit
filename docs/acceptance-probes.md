# Acceptance probes — maintainer vs consumer agents

Use these probes to confirm the audience split. Each side must succeed **without** reading the other side’s primary doc as the main instructions.

## Consumer probe

**Give the agent only:**

- [`CONSUMER.md`](../CONSUMER.md) (and optionally `skills/spiral-consume`)
- Published `@aviala-design/spiral` on npm (or a local `file:` / `pnpm pack` of `packages/ui` that already includes `dist/styles.css`)

**Deny:**

- Reading root [`AGENTS.md`](../AGENTS.md) as the install guide
- Monorepo commands (`turbo`, `changeset`, `icons:export`, playground)

**Pass criteria:**

1. Empty Vite + React app (no `tailwindcss` in `package.json`).
2. App entry matches:

   ```tsx
   import "@aviala-design/spiral/styles.css";
   import { ThemeProvider, Button } from "@aviala-design/spiral";
   ```

3. Primary `Button` renders with ALD styling (filled primary, layout utilities present).

## Maintainer probe

**Give the agent only:**

- Root [`AGENTS.md`](../AGENTS.md)
- Skills `spiral-component` and/or `spiral-tokens-css` (and related maintainer skills as needed)

**Deny:**

- Treating [`CONSUMER.md`](../CONSUMER.md) as the source of truth for “where to edit Button”
- “Just change the npm consumer app” as the fix for a library bug

**Pass criteria:**

1. Agent names the correct edit surfaces for a Button visual change, e.g.:
   - `packages/ui/src/components/button.tsx` (and stories if needed)
   - matching `packages/tokens/src/semantic/button-effects.css` (and class↔CSS cross-check from `AGENTS.md`)
2. Mentions changelog + changeset for user-visible UI (`spiral-changelog`).
3. Does **not** invent a consumer-only Tailwind/`@source` install path as the library fix.

## Optional catalog / llms probe

Consumer agents that discover docs via the site should start from spiral-docs `llms.txt` (“Consumer agents start here”) and may use `@aviala-design/spiral/component-catalog.json` for import paths — still without opening maintainer `AGENTS.md` for install steps.

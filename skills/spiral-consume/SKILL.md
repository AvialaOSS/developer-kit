---
name: spiral-consume
description: >-
  Install and use published @aviala-design/spiral in an app repo — one styles.css
  import, ThemeProvider, form subpath, no consumer Tailwind. Use for consumer /
  product agents; never for monorepo library edits.
audience: consumer
---

# Spiral Consume (apps only)

**Audience: consumer.** Follow root `CONSUMER.md` as the short source of truth. This skill expands common pitfalls. Do **not** run developer-kit maintainer workflows (`icons:export`, changesets, playground, Storybook) inside the app repo.

## Install

```bash
pnpm add @aviala-design/spiral
```

Tokens and icons are transitive dependencies. Default CSS path does **not** require installing `tailwindcss`.

## Required setup

```tsx
import "@aviala-design/spiral/styles.css";
import { ThemeProvider, Button } from "@aviala-design/spiral";

export function App() {
  return (
    <ThemeProvider defaultMode="light" defaultPresetId="ald">
      <Button mode="primary">Hello</Button>
    </ThemeProvider>
  );
}
```

| Step | Required |
| ---- | -------- |
| `styles.css` once at app entry | Yes |
| `ThemeProvider` around Spiral UI | Yes |
| Consumer Tailwind / `@source` | **No** |

## Entries

- Main: `@aviala-design/spiral`
- Form bindings: `@aviala-design/spiral/form` + peer `react-hook-form` (`>=7.50`)
- Catalog: `@aviala-design/spiral/component-catalog.json`
- Props: `@aviala-design/spiral/props.json`

## Forbidden for consumer agents

- Editing `packages/ui` / `packages/tokens` unless the task is explicitly to contribute to developer-kit (then switch to `AGENTS.md` + maintainer skills).
- Multi-file effects CSS imports as the default path.
- Adding Tailwind solely so Spiral “works”.
- Running Figma icon export or release scripts in the product repo.

## Docs

- Human Chinese start guides: spiral-docs under avialaWebsite (`/docs/start/*`)
- Site agent index: spiral-docs `llms.txt`
- Library contribution: [developer-kit `AGENTS.md`](https://github.com/AvialaOSS/developer-kit/blob/main/AGENTS.md)

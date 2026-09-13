# Spiral — Consumer guide

**Audience: app / consumer agents only.** Use this file when installing and rendering `@aviala-design/spiral` in a product repo. Do **not** treat monorepo `AGENTS.md`, playground, changesets, or `icons:export` as part of app setup.

Human docs (Chinese): [spiral-docs · 安装](https://github.com/AvialaOSS/avialaWebsite/blob/main/apps/spiral-docs/src/content/start/installation.mdx) — keep that page aligned with this file.

## Install

```bash
pnpm add @aviala-design/spiral
# npm install / yarn add also fine
```

`@aviala-design/tokens` and `@aviala-design/icons` come in as dependencies of spiral. You usually do **not** need to install them separately.

## CSS (one import, no Tailwind)

```tsx
import "@aviala-design/spiral/styles.css";
```

That single file includes design tokens, component effects, the default ALD theme, and a small set of layout utilities precompiled at package build time.

You do **not** need `tailwindcss`, `@tailwindcss/vite`, or `@source` scanning of Spiral.

Advanced: granular `*-effects.css` / `ald-theme.css` still exist on `@aviala-design/tokens` subpaths. Default path is only `styles.css`.

## Minimal app

```tsx
import "@aviala-design/spiral/styles.css";
import { ThemeProvider, Button } from "@aviala-design/spiral";

export function App() {
  return (
    <ThemeProvider defaultMode="light" defaultPresetId="ald">
      <Button mode="primary">Hello Spiral</Button>
    </ThemeProvider>
  );
}
```

`defaultPresetId="ald"` uses the built-in ALD static theme (variables are already in `styles.css`). Wrap the tree that uses Spiral components in `ThemeProvider`.

## Entries

| Import | Contents | Extra peers |
| ------ | -------- | ----------- |
| `@aviala-design/spiral` | Components, `ThemeProvider`, hooks (except form bindings) | `react`, `react-dom` |
| `@aviala-design/spiral/form` | `Form`, `FormField`, … | also `react-hook-form` (`>=7.50`) |

Machine index: `@aviala-design/spiral/component-catalog.json` (name, import path, provider hints). Props detail: `@aviala-design/spiral/props.json`.

## Common mistakes

- Forgetting `import "@aviala-design/spiral/styles.css"` → unstyled components.
- Adding Tailwind only for Spiral → unnecessary; styles ship prebundled.
- Running `icons:export`, `changeset`, or playground commands in the **app** repo → those belong to [developer-kit](https://github.com/AvialaOSS/developer-kit) maintainers (`AGENTS.md`).
- Importing `Form` / `FormField` from the main entry → use `@aviala-design/spiral/form` and install `react-hook-form`.

## Next

- Theme / density: spiral-docs [主题](https://github.com/AvialaOSS/avialaWebsite/blob/main/apps/spiral-docs/src/content/start/theme.mdx)
- Locale: spiral-docs [国际化](https://github.com/AvialaOSS/avialaWebsite/blob/main/apps/spiral-docs/src/content/start/locale.mdx)
- Agent skill: `skills/spiral-consume` (`audience: consumer`)

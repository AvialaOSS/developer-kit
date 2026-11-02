# Preset colors

Theme Engine now supplies twelve independent hue families for Duo/Twotone icons,
illustrations and other multicolor graphics: red, orange, amber, yellow, lime,
green, teal, cyan, blue, indigo, purple and magenta. Each family has twelve actual
generated steps. The default seeds are starting points for design review, not
semantic aliases to success, warning, error, info or primary.

## Variables and modes

Editable ramps live in the existing `Aviala Design Colors` (ADC) collection.
The existing `colorSystem` variables reference those foundations in Light/Dark.
No collection is added. Paths follow the family convention, for example
`blue/blue-8`, in both collections.

Public colorSystem IDs and CSS names such as `--aviala-blue-blue-8` are preserved.
ADC sources use independent stable IDs and readable names such as
`--aviala-adc-blue-blue-8`. They are foundation tokens; colorSystem entries are
semantic aliases. Identical colors never collapse identities. There is no
per-icon token matrix or implicit behavior attached to S/N region names.

Static CSS, Node loading, runtime generation and ThemeCat exports use the same
standard project. Runtime generation can replace a preset seed independently:

```ts
import { generateTheme } from "@aviala-design/tokens";

const variables = generateTheme({
  mode: "dark",
  primary: "#FF5532",
  presetColors: { blue: "#3344AA" },
});
```

Changing the brand seed alone does not regenerate preset palettes from that seed.
Default preset generation uses Color 0.5.16, twelve steps, anchor 8 and the shared
hue-protection settings. Steps 11 and 12 are generated independently.

## Authoring and synchronization

`addPresetColors(project)` adds missing ADC ramps and colorSystem references,
returning a validated copy. It migrates the initial colorSystem literals into
ADC without changing public IDs, CSS names or resolved colors. Subsequent runs
preserve authored values and references. Retired names require an explicit identity decision. The repository
migration is `node scripts/add-preset-colors.mjs` after building Tokens; rerunning
it does not rewrite authored colors.

ThemeCat's color wizard groups preset hues separately from brand and status hues,
supports group selection, and previews Light/Dark before applying an undoable
batch of value overrides. Existing documents review a new base release before
upgrading; the release hash and overrides remain pinned until then.

Split-file deployment writes the 144 new foundation variables in ADC scope,
expanding the source palette from 74 to 218 variables. After publishing ADC,
Components scope creates or updates the 144 colorSystem references against the
explicitly selected ADC library. Existing Figma variable IDs remain unchanged.
Standalone scope writes both layers. Preview and readback verification remain
required; a successful local plan is not proof of a Figma write.

ThemeCat development base 0.2.1 retains the immutable 0.2.0 archive. Explicit
upgrade review transfers legacy literal preset overrides to the corresponding
ADC token and mode, preserving their resolved colors and public references.

## Icon asset boundary

Assets can bind their colored regions directly to these variables. S/N names
identify regions only; they do not imply replacement or inheritance behavior.
Preserving these bindings in Duo/Twotone SVG export is a separate implementation
step. This change does not add icon modes, automatic instance recoloring, or
internal disabled opacity.

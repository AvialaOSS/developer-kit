import { palette } from "@aviala-design/color";
import { DEFAULT_PALETTE_CONFIG } from "./variable-map";
import { parseProject, type TokenProject, type TokenValue } from "./project";

/** Independent hue palettes; matching a status color does not share its identity. */
export const PRESET_COLOR_SEEDS = {
  red: "#F53F3F",
  orange: "#FF7D00",
  amber: "#FFB400",
  yellow: "#FADC19",
  lime: "#9FDB1D",
  green: "#00B42A",
  teal: "#00BFA5",
  cyan: "#14C9C9",
  blue: "#165DFF",
  indigo: "#6A5ACD",
  purple: "#722ED1",
  magenta: "#D91AD9",
} as const;

export type PresetColorFamily = keyof typeof PRESET_COLOR_SEEDS;
export const PRESET_COLOR_FAMILIES = Object.keys(
  PRESET_COLOR_SEEDS
) as PresetColorFamily[];
export const PRESET_COLOR_STEPS = 12;
export const PRESET_COLOR_ANCHOR = 8;
export type PresetColorInput = Partial<Record<PresetColorFamily, string>>;

/** Generate actual twelve-step ramps, including independently generated 11/12. */
export function generatePresetColorRamp(
  family: PresetColorFamily,
  mode: "light" | "dark",
  seed: string = PRESET_COLOR_SEEDS[family]
): string[] {
  if (!/^#[\da-f]{6}$/i.test(seed))
    throw new Error(`Invalid preset color seed: ${family}`);
  const colors = palette.generate(seed, {
    list: true,
    steps: PRESET_COLOR_STEPS,
    anchorIndex: PRESET_COLOR_ANCHOR,
    dark: mode === "dark",
    format: "hex",
    curveGamma: DEFAULT_PALETTE_CONFIG.curveGamma,
    protectHueFamilies: [...DEFAULT_PALETTE_CONFIG.protectHueFamilies],
    protectHueStrength: DEFAULT_PALETTE_CONFIG.protectHueStrength,
  }) as string[];
  if (
    colors.length !== PRESET_COLOR_STEPS ||
    colors.some((color) => !/^#[\da-f]{6}$/i.test(color))
  )
    throw new Error(`Invalid generated preset ramp: ${family}`);
  return colors;
}

function colorValue(hex: string): TokenValue {
  return {
    kind: "literal",
    value: {
      r: parseInt(hex.slice(1, 3), 16) / 255,
      g: parseInt(hex.slice(3, 5), 16) / 255,
      b: parseInt(hex.slice(5, 7), 16) / 255,
      a: 1,
    },
  };
}

/** Keep public colorSystem identities while placing their editable ramps in ADC. */
export function addPresetColors(input: TokenProject): TokenProject {
  const project = parseProject(JSON.stringify(input));
  const system = project.collections.find((c) => c.name === "colorSystem");
  const adc = project.collections.find(
    (c) => c.name === "Aviala Design Colors"
  );
  for (const collection of [system, adc]) {
    if (
      !collection ||
      collection.axis !== "color" ||
      collection.modes.length !== 2 ||
      !["Light", "Dark"].every((name) =>
        collection.modes.some((m) => m.name === name)
      )
    )
      throw new Error(
        "Preset colors require ADC and colorSystem with Light/Dark modes"
      );
  }
  const before = JSON.stringify(project.tokens);
  for (const family of PRESET_COLOR_FAMILIES) {
    const light = generatePresetColorRamp(family, "light");
    const dark = generatePresetColorRamp(family, "dark");
    for (let step = 1; step <= PRESET_COLOR_STEPS; step++) {
      const path = [family, `${family}-${step}`];
      const find = (collectionId: string) =>
        project.tokens.find(
          (t) =>
            t.collectionId === collectionId &&
            t.path.join("/") === path.join("/")
        );
      const publicToken = find(system!.id);
      let foundation = find(adc!.id);
      if ([publicToken, foundation].some((t) => t && t.type !== "color"))
        throw new Error(
          `Preset path has an incompatible type: ${path.join("/")}`
        );
      for (const collection of [system!, adc!]) {
        if (
          !find(collection.id) &&
          project.tombstones?.some(
            (t) =>
              t.collectionId === collection.id &&
              t.path.join("/") === path.join("/")
          )
        )
          throw new Error(
            `Retired preset color needs an identity decision: ${path.join("/")}`
          );
      }
      if (!foundation) {
        foundation = {
          id: `${project.id}:preset-foundation:${family}:${step}`,
          collectionId: adc!.id,
          path,
          layer: "foundation",
          type: "color",
          cssName: `--aviala-adc-${family}-${family}-${step}`,
          valuesByMode: Object.fromEntries(
            adc!.modes.map((mode) => {
              const oldMode = system!.modes.find((m) => m.name === mode.name)!;
              const old = publicToken?.valuesByMode[oldMode.id];
              return [
                mode.id,
                publicToken?.layer === "foundation" && old?.kind === "literal"
                  ? structuredClone(old)
                  : colorValue(
                      (mode.name === "Dark" ? dark : light)[step - 1]!
                    ),
              ];
            })
          ),
        };
        project.tokens.push(foundation);
      }
      const aliases = Object.fromEntries(
        system!.modes.map((mode) => [
          mode.id,
          { kind: "alias" as const, targetId: foundation!.id },
        ])
      );
      if (!publicToken) {
        project.tokens.push({
          id: `${project.id}:preset-color:${family}:${step}`,
          collectionId: system!.id,
          path,
          layer: "semantic",
          type: "color",
          cssName: `--aviala-${family}-${family}-${step}`,
          valuesByMode: aliases,
        });
      } else if (publicToken.layer === "foundation") {
        publicToken.layer = "semantic";
        // Preserve deliberately authored references; migrate the original literals.
        for (const [mode, value] of Object.entries(publicToken.valuesByMode))
          if (value.kind === "literal")
            publicToken.valuesByMode[mode] = aliases[mode]!;
      }
    }
  }
  if (JSON.stringify(project.tokens) !== before) project.draftRevision++;
  return parseProject(JSON.stringify(project));
}

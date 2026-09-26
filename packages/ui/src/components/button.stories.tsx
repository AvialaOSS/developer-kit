import { DirectionArrowRight, GeneralSetting, Icon } from "@aviala-design/icons";
import type { Meta, StoryObj } from "@storybook/react";
import { useState, type CSSProperties } from "react";
import { parseProject } from "@aviala-design/tokens/project";
import standardProject from "../../../tokens/source/theme-engine/ald.project.json";
import { ThemeProvider, useTheme } from "../theme/theme-provider";
import { Button, type ButtonMode, type ButtonSize } from "./button";

const meta: Meta<typeof Button> = {
  title: "Basic Input/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    mode: {
      control: "select",
      options: [
        "primary",
        "secondary",
        "tertiary",
        "tertiaryCustom",
        "second",
        "default",
        "defaultCustom",
        "outline",
        "outlineCustom",
        "noBackground",
        "noBackgroundCustom",
        "destructive",
      ] satisfies ButtonMode[],
    },
    size: {
      control: "select",
      options: ["tiny", "small", "regular", "big"] satisfies ButtonSize[],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

const buttonProject = parseProject(JSON.stringify(standardProject));
const buttonCssOptions = {
  remTokenIds: buttonProject.tokens
    .filter(
      (t) =>
        t.type === "number" &&
        t.unit === "px" &&
        ["size", "line-height"].includes(t.path[0]!)
    )
    .map((t) => t.id),
};

function EffectCases() {
  const { mode, setMode, density, setDensity, effects, setEffects } =
    useTheme();
  return (
    <div className="flex flex-col items-start gap-4">
      <div className="flex gap-4">
        <Button onClick={() => setMode(mode === "light" ? "dark" : "light")}>
          颜色：{mode}
        </Button>
        <Button
          onClick={() =>
            setDensity(density === "default" ? "mobile-friendly" : "default")
          }
        >
          密度：{density}
        </Button>
        <Button onClick={() => setEffects(!effects)}>
          效果：{effects ? "ON" : "OFF"}
        </Button>
      </div>
      <div className="flex gap-4">
        <Button leftIcon={<GeneralSetting />}>effect baseline</Button>
        <Button
          style={
            {
              "--button-size-primary-shadow-outer-blur": "7px",
              "--button-color-primary-shadow-outer": "rgba(10, 80, 160, 0.5)",
              "--button-color-primary-background-gradient-start":
                "rgba(250, 240, 220, 0.7)",
            } as CSSProperties
          }
        >
          effect token
        </Button>
        <Button
          style={
            {
              "--button-size-primary-shadow-outer-blur": "7px",
              "--button-shadow-basic": "none",
              "--button-primary-gradient": "none",
            } as CSSProperties
          }
        >
          effect legacy
        </Button>
      </div>
      <TransparentCases />
    </div>
  );
}

function TransparentCases() {
  return (
    <div className="flex flex-col gap-4">
      {(
        [
          "outline",
          "outlineCustom",
          "noBackground",
          "noBackgroundCustom",
        ] as const
      ).map((mode) => {
        const token = mode.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);
        return (
          <div key={mode} className="flex flex-wrap gap-4">
            <Button mode={mode} leftIcon={<GeneralSetting />}>
              {mode} baseline
            </Button>
            <Button mode={mode} disabled leftIcon={<GeneralSetting />}>
              {mode} disabled
            </Button>
            <Button
              mode={mode}
              leftIcon={<GeneralSetting />}
              style={
                {
                  [`--button-color-${token}-background-default`]:
                    "rgb(220, 230, 240)",
                  [`--button-color-${token}-background-hover`]:
                    "rgb(200, 220, 240)",
                  [`--button-color-${token}-text-default`]: "rgb(30, 50, 70)",
                  [`--button-color-${token}-icon-default`]: "rgb(20, 110, 80)",
                  [`--button-color-${token}-stroke-default`]:
                    "rgb(50, 80, 110)",
                  [`--button-color-${token}-stroke-hover`]: "rgb(70, 100, 130)",
                  "--button-size-outline-stroke-width": "3px",
                } as CSSProperties
              }
            >
              {mode} token
            </Button>
            <Button
              mode={mode}
              leftIcon={<GeneralSetting />}
              style={
                {
                  "--button-no-bg-fg": "rgb(80, 40, 100)",
                  "--button-default-custom-fg": "rgb(80, 40, 100)",
                  "--button-outline-fg": "rgb(80, 40, 100)",
                  "--button-outline-custom-fg": "rgb(80, 40, 100)",
                  "--button-outline-border": "rgb(150, 70, 110)",
                } as CSSProperties
              }
            >
              {mode} legacy
            </Button>
          </div>
        );
      })}
    </div>
  );
}

export const ProjectEffects: Story = {
  render: () => {
    const [target, setTarget] = useState<HTMLDivElement | null>(null);
    return (
      <div
        ref={setTarget}
        data-testid="button-project-scope"
        style={{
          padding: "24px",
          background: "var(--box-box-normal-background-white1)",
        }}
      >
        {target && (
          <ThemeProvider
            project={buttonProject}
            projectCssOptions={buttonCssOptions}
            projectTarget={target}
            storageKey="button-project-demo"
          >
            <EffectCases />
          </ThemeProvider>
        )}
      </div>
    );
  },
};

export const ComponentSpacing: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-4">
      {(["tiny", "small", "regular", "big"] as const).map((size) => (
        <div key={size} className="flex items-center gap-4">
          <Button size={size} leftIcon={<GeneralSetting />}>
            {size} baseline
          </Button>
          <Button
            size={size}
            leftIcon={<GeneralSetting />}
            style={
              {
                [`--button-size-${size}-padding-x`]: "23px",
                [`--button-size-${size}-padding-y`]: "11px",
                [`--button-size-${size}-gap`]: "13px",
                [`--button-size-${size}-default-radius`]: "17px",
              } as CSSProperties
            }
          >
            {size} token
          </Button>
          <Button
            size={size}
            leftIcon={<GeneralSetting />}
            style={
              {
                [`--button-size-${size}-padding-x`]: "23px",
                [`--button-${size}-padding-x`]: "19px",
                "--button-gap": "9px",
              } as CSSProperties
            }
          >
            {size} legacy
          </Button>
        </div>
      ))}
    </div>
  ),
};

export const Primary: Story = {
  args: { mode: "primary", children: "Text" },
};

export const IconComponentTokens: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      {(["tiny", "small", "regular", "big"] as const).map((size) => (
        <div key={size} className="flex gap-4">
          <Button size={size} leftIcon={<GeneralSetting />}>
            {size} baseline
          </Button>
          <Button
            size={size}
            leftIcon={<GeneralSetting />}
            style={
              {
                [`--button-size-${size}-icon-width`]: "27px",
                [`--button-size-${size}-icon-height`]: "33px",
              } as CSSProperties
            }
          >
            {size} token
          </Button>
          <Button
            size={size}
            leftIcon={<GeneralSetting level="caption" biggerSize={false} />}
            style={
              { [`--button-size-${size}-icon-width`]: "27px" } as CSSProperties
            }
          >
            {size} explicit
          </Button>
          <Button
            size={size}
            leftIcon={<GeneralSetting />}
            style={
              {
                [`--button-${size}-icon-size`]: "21px",
                [`--button-${size}-icon-slot-height`]: "29px",
              } as CSSProperties
            }
          >
            {size} legacy
          </Button>
        </div>
      ))}
    </div>
  ),
};

export const PrimaryColorTokens: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Button leftIcon={<GeneralSetting />}>primary baseline</Button>
      <Button
        leftIcon={<GeneralSetting />}
        style={
          {
            "--button-color-primary-background-default": "rgb(20, 80, 120)",
            "--button-color-primary-background-hover": "rgb(30, 100, 140)",
            "--button-color-primary-background-active": "rgb(10, 60, 100)",
            "--button-color-primary-text-default": "rgb(230, 220, 210)",
            "--button-color-primary-icon-default": "rgb(100, 230, 180)",
          } as CSSProperties
        }
      >
        primary token
      </Button>
      <Button
        leftIcon={<GeneralSetting />}
        style={
          {
            "--button-color-primary-background-default": "rgb(20, 80, 120)",
            "--button-primary-bg": "rgb(120, 40, 80)",
            "--button-primary-bg-hover": "rgb(140, 60, 100)",
            "--button-primary-fg": "rgb(245, 235, 225)",
          } as CSSProperties
        }
      >
        primary legacy
      </Button>
    </div>
  ),
};

export const ContentOpacityTokens: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-4">
      {[false, true].map((override) => (
        <div
          key={String(override)}
          className="flex items-center gap-4"
          style={
            override
              ? ({
                  "--button-transparency-text-default": 0.8,
                  "--button-transparency-icon-default": 0.7,
                  "--button-transparency-text-disable": 0.4,
                  "--button-transparency-icon-disable": 0.3,
                  "--button-transparency-text-loading": 0.25,
                  "--button-transparency-icon-loading": 0.2,
                  "--button-transparency-loading-icon-loading": 0.9,
                } as CSSProperties)
              : undefined
          }
        >
          <Button leftIcon={<GeneralSetting />}>
            {override ? "override" : "base"} normal
          </Button>
          <Button disabled leftIcon={<GeneralSetting />}>
            {override ? "override" : "base"} disabled
          </Button>
          <Button loading leftIcon={<GeneralSetting />}>
            {override ? "override" : "base"} loading
          </Button>
          <Button loading disabled leftIcon={<GeneralSetting />}>
            {override ? "override" : "base"} both
          </Button>
        </div>
      ))}
      <div
        className="flex items-center gap-4"
        style={
          {
            "--button-disabled-opacity": 0.45,
            "--button-loading-opacity": 0.35,
          } as CSSProperties
        }
      >
        <Button disabled leftIcon={<GeneralSetting />}>
          legacy disabled
        </Button>
        <Button loading leftIcon={<GeneralSetting />}>
          legacy loading
        </Button>
      </div>
    </div>
  ),
};

export const RoundedComponentTokens: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-4">
      {(["tiny", "small", "regular", "big"] as const).map((size) => (
        <div key={size} className="flex items-center gap-4">
          <Button size={size} allRound>
            {size} baseline
          </Button>
          <Button
            size={size}
            allRound
            style={
              {
                [`--button-size-${size}-rounded-radius`]: "12px",
              } as CSSProperties
            }
          >
            {size} token
          </Button>
          <Button
            size={size}
            allRound
            iconOnly
            leftIcon={<GeneralSetting />}
            aria-label={`${size} icon`}
          />
          <Button
            size={size}
            allRound
            asChild
            style={
              {
                [`--button-size-${size}-rounded-radius`]: "12px",
              } as CSSProperties
            }
          >
            <a href="#button-token-example">{size} link</a>
          </Button>
        </div>
      ))}
    </div>
  ),
};

export const Second: Story = {
  args: { mode: "second", children: "Text" },
};

export const DefaultMode: Story = {
  args: { mode: "default", children: "Text" },
};

export const NoBackground: Story = {
  args: { mode: "noBackground", children: "Text" },
};

/** Non-theme custom color text/icon — transparent background (Figma `noBackgroundCustom`). */
export const NoBackgroundCustom: Story = {
  args: { mode: "noBackgroundCustom", children: "Text" },
};

/** Bordered — theme text (Figma `Outline`). */
export const Outline: Story = {
  args: { mode: "outline", children: "Text" },
};

/** Bordered — neutral text (Figma `Outline-Custom`). */
export const OutlineCustom: Story = {
  args: { mode: "outlineCustom", children: "Text" },
};

export const AllRound: Story = {
  args: { mode: "primary", allRound: true, children: "Text" },
};

export const WithIcons: Story = {
  args: {
    mode: "primary",
    leftIcon: <GeneralSetting aria-hidden />,
    rightIcon: <GeneralSetting aria-hidden />,
    children: "Text",
  },
};

/** Wide arrow icon — slot is line-height box; SVG height from --button-icon-size, width auto. */
export const WithWideIcon: Story = {
  args: {
    mode: "primary",
    leftIcon: <DirectionArrowRight aria-hidden />,
    children: "Continue",
  },
};

export const IconOnly: Story = {
  args: {
    mode: "primary",
    iconOnly: true,
    leftIcon: <GeneralSetting aria-hidden />,
    "aria-label": "Settings",
  },
};

export const IconOnlySizeMatrix: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      {modes.map((mode) => (
        <div key={mode} className="flex flex-wrap items-center gap-2">
          <span className="w-36 shrink-0 font-mono text-xs text-muted-foreground">
            {mode}
          </span>
          {sizes.map((size) => (
            <Button
              key={size}
              mode={mode}
              size={size}
              iconOnly
              leftIcon={<GeneralSetting aria-hidden />}
              aria-label={`${mode} ${size}`}
            />
          ))}
        </div>
      ))}
    </div>
  ),
};

/** Icon-only squares should match text button height at each size. */
export const IconOnlyHeightMatch: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      {sizes.map((size) => (
        <div key={size} className="flex flex-wrap items-center gap-2">
          <span className="w-16 shrink-0 font-mono text-xs text-muted-foreground">
            {size}
          </span>
          <Button mode="primary" size={size}>
            Text
          </Button>
          <Button
            mode="primary"
            size={size}
            iconOnly
            leftIcon={<GeneralSetting aria-hidden />}
            aria-label={`${size} icon`}
          />
        </div>
      ))}
    </div>
  ),
};

export const Loading: Story = {
  args: { mode: "primary", loading: true, children: "Text" },
};

export const Disabled: Story = {
  args: { mode: "primary", disabled: true, children: "Text" },
};

const modes: ButtonMode[] = [
  "primary",
  "second",
  "default",
  "defaultCustom",
  "outline",
  "outlineCustom",
  "noBackground",
  "noBackgroundCustom",
];

const sizes: ButtonSize[] = ["tiny", "small", "regular", "big"];

export const ModeMatrix: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      {modes.map((mode) => (
        <div key={mode} className="flex flex-wrap items-center gap-2">
          <span className="w-36 shrink-0 font-mono text-xs text-muted-foreground">
            {mode}
          </span>
          {sizes.map((size) => (
            <Button key={size} mode={mode} size={size}>
              Text
            </Button>
          ))}
        </div>
      ))}
    </div>
  ),
};

export const StateMatrix: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      {(["primary", "second", "default"] as ButtonMode[]).map((mode) => (
        <div key={mode} className="flex flex-wrap items-center gap-3">
          <span className="w-16 shrink-0 font-mono text-xs text-muted-foreground">
            {mode}
          </span>
          <Button mode={mode}>Default</Button>
          <Button mode={mode} loading>
            Loading
          </Button>
          <Button mode={mode} disabled>
            Disabled
          </Button>
        </div>
      ))}
    </div>
  ),
};

/** Hover each mode to preview 250ms transitions. Primary rests primary-8, hovers primary-7. Default rests neutral-5, hovers neutral-6. */
export const HoverState: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      {(
        [
          "primary",
          "second",
          "default",
          "defaultCustom",
          "outline",
          "outlineCustom",
          "noBackground",
          "noBackgroundCustom",
          "destructive",
        ] as ButtonMode[]
      ).map((mode) => (
        <Button key={mode} mode={mode}>
          {mode}
        </Button>
      ))}
    </div>
  ),
};

/** Click and hold to preview :active press (primary uses p-9; others darken 5%). */
export const PressedState: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      {(
        [
          "primary",
          "second",
          "default",
          "defaultCustom",
          "destructive",
        ] as ButtonMode[]
      ).map((mode) => (
        <Button key={mode} mode={mode}>
          {mode}
        </Button>
      ))}
    </div>
  ),
};

export const PrimaryIconOnlyTokens: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      {(["tiny", "small", "regular", "big"] as const).map((size) => (
        <div key={size} className="flex items-center gap-4">
          <span>{size}</span>
          <Button size={size} iconOnly loading aria-label={size + " loading"}>
            <GeneralSetting />
          </Button>
          <Button size={size} iconOnly aria-label={size + " baseline"}>
            <GeneralSetting />
          </Button>
          <Button
            size={size}
            iconOnly
            aria-label={size + " token"}
            style={
              {
                [`--button-size-${size}-icon-only-padding-x`]: "9px",
                [`--button-size-${size}-icon-only-icon-width`]: "30px",
                [`--button-size-${size}-icon-only-icon-height`]: "34px",
                ...(size !== "big"
                  ? {
                      [`--button-size-${size}-icon-only-icon-padding-x`]: "3px",
                    }
                  : {}),
              } as CSSProperties
            }
          >
            <GeneralSetting />
          </Button>
          <Button
            size={size}
            iconOnly
            aria-label={size + " legacy"}
            style={{ [`--button-${size}-height`]: "48px" } as CSSProperties}
          >
            <GeneralSetting />
          </Button>
        </div>
      ))}
    </div>
  ),
};

function IconOnlyModeCases() {
  const { mode, setMode, density, setDensity, effects, setEffects } =
    useTheme();
  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4">
        <Button onClick={() => setMode(mode === "light" ? "dark" : "light")}>
          颜色：{mode}
        </Button>
        <Button
          onClick={() =>
            setDensity(density === "default" ? "mobile-friendly" : "default")
          }
        >
          密度：{density}
        </Button>
        <Button onClick={() => setEffects(!effects)}>
          效果：{effects ? "ON" : "OFF"}
        </Button>
      </div>
      {(["primary", "noBackground", "noBackgroundCustom"] as const).map(
        (variant) => (
          <div key={variant} className="flex flex-col gap-2">
            <span>{variant}</span>
            {(["tiny", "small", "regular", "big"] as const).map((size) => (
              <div key={size} className="flex items-center gap-4">
                <span>{size}</span>
                <Button
                  mode={variant}
                  size={size}
                  iconOnly
                  aria-label={variant + " " + size + " baseline"}
                >
                  <GeneralSetting />
                </Button>
                <Button
                  mode={variant}
                  size={size}
                  iconOnly
                  loading
                  aria-label={variant + " " + size + " loading"}
                >
                  <GeneralSetting />
                </Button>
                <Button
                  mode={variant}
                  size={size}
                  iconOnly
                  aria-label={variant + " " + size + " explicit"}
                >
                  <GeneralSetting level="caption" biggerSize={false} />
                </Button>
                <Button
                  mode={variant}
                  size={size}
                  iconOnly
                  aria-label={variant + " " + size + " legacy"}
                  style={
                    {
                      [`--button-${size}-icon-size`]: "19px",
                      [`--button-${size}-height`]: "48px",
                    } as CSSProperties
                  }
                >
                  <GeneralSetting />
                </Button>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}

export const ProjectIconOnly: Story = {
  render: () => {
    const [target, setTarget] = useState<HTMLDivElement | null>(null);
    return (
      <div
        ref={setTarget}
        style={{
          padding: 24,
          background: "var(--box-box-normal-background-white1)",
        }}
      >
        {target && (
          <ThemeProvider
            project={buttonProject}
            projectCssOptions={buttonCssOptions}
            projectTarget={target}
            storageKey="button-icon-project-demo"
          >
            <IconOnlyModeCases />
          </ThemeProvider>
        )}
      </div>
    );
  },
};

export const IconLineBox: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        {(["off", "heightOnly", "both"] as const).map(alignment => (
          <Icon key={alignment} icon={GeneralSetting} level="text" lineHeightFix={alignment} title={alignment} />
        ))}
      </div>
      {(["primary", "second", "default", "defaultCustom", "outline", "outlineCustom", "noBackground", "noBackgroundCustom", "destructive"] as const).map(mode => (
        <div key={mode} className="flex items-center gap-4">
          {(["tiny", "small", "regular", "big"] as const).map(size => (
            <div key={size} className="flex items-center gap-2">
              <Button mode={mode} size={size}>Label</Button>
              <Button mode={mode} size={size} iconOnly leftIcon={<GeneralSetting />} aria-label={`${mode} ${size}`} />
              <Button mode={mode} size={size} iconOnly loading leftIcon={<GeneralSetting />} aria-label={`${mode} ${size} loading`} />
            </div>
          ))}
        </div>
      ))}
    </div>
  ),
};

export const FigmaModeAliases: Story = {
  render: () => (
    <div className="flex gap-4">
      {(["secondary", "second", "tertiary", "default", "tertiaryCustom", "defaultCustom"] as const).map(mode => (
        <Button key={mode} mode={mode} leftIcon={<GeneralSetting />}>{mode}</Button>
      ))}
    </div>
  ),
};

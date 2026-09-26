import { parseProject } from "@aviala-design/tokens/project";
import standardProject from "../../../tokens/source/theme-engine/ald.project.json";
import { ThemeProvider, useTheme } from "../theme/theme-provider";
import { Button } from "./button";
import { useState, type CSSProperties } from "react";
import { GeneralSetting } from "@aviala-design/icons";
import type { Meta, StoryObj } from "@storybook/react";
import { Checkbox, CheckboxGroup, CheckboxInput } from "./checkbox";
import { Typography } from "./typography";

const meta: Meta<typeof Checkbox> = {
  title: "Information Collect/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Control: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Checkbox id="cb-checked" defaultChecked />
        <Typography level="text" as="label" htmlFor="cb-checked">
          Checked
        </Typography>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="cb-unchecked" />
        <Typography level="text" as="label" htmlFor="cb-unchecked">
          Unchecked
        </Typography>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="cb-indeterminate" checked="indeterminate" />
        <Typography level="text" as="label" htmlFor="cb-indeterminate">
          Indeterminate
        </Typography>
      </div>
    </div>
  ),
};

export const Round: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Checkbox id="cb-round-checked" defaultChecked round />
        <Typography level="text" as="label" htmlFor="cb-round-checked">
          Round checked
        </Typography>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="cb-round-unchecked" round />
        <Typography level="text" as="label" htmlFor="cb-round-unchecked">
          Round unchecked
        </Typography>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="cb-round-half" checked="indeterminate" round />
        <Typography level="text" as="label" htmlFor="cb-round-half">
          Round indeterminate
        </Typography>
      </div>
    </div>
  ),
};

export const Huge: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Checkbox id="cb-huge-checked" defaultChecked size="huge" />
        <Typography level="text" as="label" htmlFor="cb-huge-checked">
          Huge checked
        </Typography>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="cb-huge-unchecked" size="huge" />
        <Typography level="text" as="label" htmlFor="cb-huge-unchecked">
          Huge unchecked
        </Typography>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="cb-huge-half" checked="indeterminate" size="huge" />
        <Typography level="text" as="label" htmlFor="cb-huge-half">
          Huge indeterminate
        </Typography>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="cb-huge-round" defaultChecked size="huge" round />
        <Typography level="text" as="label" htmlFor="cb-huge-round">
          Huge round
        </Typography>
      </div>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Checkbox id="cb-dis-checked" defaultChecked disabled />
        <Typography level="text" as="label" htmlFor="cb-dis-checked">
          Checked disabled
        </Typography>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="cb-dis-unchecked" disabled />
        <Typography level="text" as="label" htmlFor="cb-dis-unchecked">
          Unchecked disabled
        </Typography>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="cb-dis-half" checked="indeterminate" disabled />
        <Typography level="text" as="label" htmlFor="cb-dis-half">
          Indeterminate disabled
        </Typography>
      </div>
    </div>
  ),
};

export const VariantMatrix: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-8">
      <div>
        <p className="mb-3 text-sm text-muted-foreground">Default · Square</p>
        <div className="flex flex-col gap-3">
          <Checkbox defaultChecked aria-label="Checked" />
          <Checkbox defaultChecked disabled aria-label="Checked disabled" />
          <Checkbox aria-label="Unchecked" />
          <Checkbox disabled aria-label="Unchecked disabled" />
          <Checkbox checked="indeterminate" aria-label="Indeterminate" />
          <Checkbox
            checked="indeterminate"
            disabled
            aria-label="Indeterminate disabled"
          />
        </div>
      </div>
      <div>
        <p className="mb-3 text-sm text-muted-foreground">Huge · Square</p>
        <div className="flex flex-col gap-3">
          <Checkbox defaultChecked size="huge" aria-label="Huge checked" />
          <Checkbox
            defaultChecked
            size="huge"
            disabled
            aria-label="Huge checked disabled"
          />
          <Checkbox size="huge" aria-label="Huge unchecked" />
          <Checkbox size="huge" disabled aria-label="Huge unchecked disabled" />
          <Checkbox
            checked="indeterminate"
            size="huge"
            aria-label="Huge indeterminate"
          />
          <Checkbox
            checked="indeterminate"
            size="huge"
            disabled
            aria-label="Huge indeterminate disabled"
          />
        </div>
      </div>
      <div>
        <p className="mb-3 text-sm text-muted-foreground">Default · Round</p>
        <div className="flex flex-col gap-3">
          <Checkbox defaultChecked round aria-label="Round checked" />
          <Checkbox
            defaultChecked
            round
            disabled
            aria-label="Round checked disabled"
          />
          <Checkbox round aria-label="Round unchecked" />
          <Checkbox round disabled aria-label="Round unchecked disabled" />
          <Checkbox
            checked="indeterminate"
            round
            aria-label="Round indeterminate"
          />
          <Checkbox
            checked="indeterminate"
            round
            disabled
            aria-label="Round indeterminate disabled"
          />
        </div>
      </div>
      <div>
        <p className="mb-3 text-sm text-muted-foreground">Huge · Round</p>
        <div className="flex flex-col gap-3">
          <Checkbox
            defaultChecked
            size="huge"
            round
            aria-label="Huge round checked"
          />
          <Checkbox
            defaultChecked
            size="huge"
            round
            disabled
            aria-label="Huge round checked disabled"
          />
          <Checkbox size="huge" round aria-label="Huge round unchecked" />
          <Checkbox
            size="huge"
            round
            disabled
            aria-label="Huge round unchecked disabled"
          />
          <Checkbox
            checked="indeterminate"
            size="huge"
            round
            aria-label="Huge round indeterminate"
          />
          <Checkbox
            checked="indeterminate"
            size="huge"
            round
            disabled
            aria-label="Huge round indeterminate disabled"
          />
        </div>
      </div>
    </div>
  ),
};

export const NormalInput: Story = {
  render: () => (
    <CheckboxGroup direction="vertical" className="w-[200px]">
      <CheckboxInput
        id="cb-input-a"
        title="Text"
        description="Text"
        defaultChecked
      />
      <CheckboxInput id="cb-input-b" title="Text" description="Text" />
    </CheckboxGroup>
  ),
};

export const NormalInputWithIcon: Story = {
  render: () => (
    <CheckboxGroup direction="vertical" className="w-[200px]">
      <CheckboxInput
        id="cb-icon-a"
        title="Text"
        description="Text"
        defaultChecked
        icon={<GeneralSetting aria-hidden />}
      />
      <CheckboxInput
        id="cb-icon-b"
        title="Text"
        description="Text"
        icon={<GeneralSetting aria-hidden />}
      />
    </CheckboxGroup>
  ),
};

export const HorizontalGroup: Story = {
  render: () => (
    <CheckboxGroup direction="horizontal" className="w-[420px]">
      <CheckboxInput
        id="cb-h-a"
        title="Text"
        description="Text"
        defaultChecked
      />
      <CheckboxInput id="cb-h-b" title="Text" description="Text" />
    </CheckboxGroup>
  ),
};

export const InputDisabled: Story = {
  render: () => (
    <CheckboxGroup direction="vertical" className="w-[200px]">
      <CheckboxInput
        id="cb-dis-a"
        title="Text"
        description="Text"
        defaultChecked
        disabled
      />
      <CheckboxInput id="cb-dis-b" title="Text" description="Text" />
    </CheckboxGroup>
  ),
};

export const ComponentGeometry: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      {(["default", "huge"] as const).map((size) => (
        <div key={size} className="flex items-center gap-4">
          <Checkbox
            size={size}
            aria-label={size + " baseline"}
            defaultChecked
          />
          <Checkbox
            size={size}
            aria-label={size + " token"}
            defaultChecked
            style={
              {
                [`--checkbox-size-${size}-size`]: "34px",
                [`--checkbox-size-${size}-radius`]: "11px",
              } as CSSProperties
            }
          />
          <Checkbox
            size={size}
            aria-label={size + " round"}
            round
            style={{ "--checkbox-size-round-radius": "14px" } as CSSProperties}
          />
          <Checkbox
            size={size}
            aria-label={size + " legacy"}
            style={
              {
                [size === "huge" ? "--checkbox-size-huge" : "--checkbox-size"]:
                  "30px",
                [size === "huge"
                  ? "--checkbox-radius-huge"
                  : "--checkbox-radius"]: "9px",
              } as CSSProperties
            }
          />
        </div>
      ))}
      <Checkbox
        checked="indeterminate"
        aria-label="custom mark"
        style={{ "--checkbox-size-mark-radius": "2px" } as CSSProperties}
      />
      {(["vertical", "horizontal"] as const).map((direction) => (
        <CheckboxGroup
          key={direction}
          direction={direction}
          style={
            {
              [`--checkbox-input-group-size-${direction}-gap`]: "19px",
              "--checkbox-input-size-gap": "13px",
              "--checkbox-input-size-icon-height": "31px",
            } as CSSProperties
          }
        >
          <CheckboxInput title={direction + " A"} icon={<GeneralSetting />} />
          <CheckboxInput title={direction + " B"} icon={<GeneralSetting />} />
        </CheckboxGroup>
      ))}
    </div>
  ),
};

export const ComponentStates: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      {([false, true, "indeterminate"] as const).map((state) => (
        <div key={String(state)} className="flex gap-4 items-center">
          <span>{String(state)}</span>
          <Checkbox checked={state} aria-label={String(state) + " enabled"} />
          <Checkbox
            checked={state}
            disabled
            aria-label={String(state) + " disabled"}
          />
          <Checkbox
            checked={state}
            disabled
            aria-label={String(state) + " token"}
            style={
              {
                "--checkbox-color-unselected-background-disabled":
                  "rgb(220, 230, 240)",
                "--checkbox-color-unselected-border-disabled":
                  "rgb(20, 60, 100)",
                "--checkbox-color-selected-background-disabled":
                  "rgb(30, 80, 130)",
                "--checkbox-color-selected-icon-disabled": "rgb(230, 240, 250)",
                "--checkbox-color-indeterminate-background-disabled":
                  "rgb(220, 230, 240)",
                "--checkbox-color-indeterminate-mark-disabled":
                  "rgb(80, 40, 100)",
                "--checkbox-transparency-mark-disabled": ".8",
              } as CSSProperties
            }
          />
          <Checkbox
            checked={state}
            disabled
            aria-label={String(state) + " legacy"}
            style={
              {
                "--checkbox-disabled-opacity": ".7",
                "--checkbox-checked-bg": "rgb(70, 80, 90)",
                "--checkbox-indeterminate-bg": "rgb(170, 180, 190)",
              } as CSSProperties
            }
          />
        </div>
      ))}
    </div>
  ),
};

export const PaddingAndTextTokens: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      {(["default", "huge"] as const).flatMap((size) =>
        ([false, true, "indeterminate"] as const).map((state) => {
          const token =
            state === "indeterminate"
              ? "indeterminate"
              : state
                ? "selected"
                : "unselected";
          return (
            <div key={size + token} className="flex items-center gap-4">
              <span>
                {size} {token}
              </span>
              <Checkbox
                size={size}
                checked={state}
                aria-label={size + " " + token + " baseline"}
              />
              <Checkbox
                size={size}
                checked={state}
                aria-label={size + " " + token + " padding"}
                style={
                  {
                    [`--checkbox-size-${size}-${token}-padding-x`]: "3px",
                    [`--checkbox-size-${size}-${token}-padding-y`]: "2px",
                  } as CSSProperties
                }
              />
            </div>
          );
        })
      )}
      <CheckboxInput title="标题基线" description="说明基线" />
      <div
        style={
          {
            "--checkbox-input-color-text-default": "rgb(30, 80, 130)",
            "--checkbox-input-color-caption-default": "rgb(100, 40, 80)",
            "--checkbox-input-transparency-text-disabled": ".8",
          } as CSSProperties
        }
      >
        <CheckboxInput
          title="独立文字颜色"
          description="独立说明颜色"
          disabled
        />
      </div>
      <div
        style={
          {
            "--checkbox-label-fg": "rgb(20, 70, 120)",
            "--checkbox-caption-fg": "rgb(90, 30, 70)",
          } as CSSProperties
        }
      >
        <CheckboxInput title="兼容文字颜色" description="兼容说明颜色" />
      </div>
    </div>
  ),
};

const checkboxProject = parseProject(JSON.stringify(standardProject));
const checkboxCssOptions = {
  remTokenIds: checkboxProject.tokens
    .filter(
      (t) =>
        t.type === "number" &&
        t.unit === "px" &&
        ["size", "line-height"].includes(t.path[0]!)
    )
    .map((t) => t.id),
};
function CheckboxModeCases() {
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
      {(["default", "huge"] as const).flatMap((size) =>
        ([false, true, "indeterminate"] as const).map((state) => (
          <div key={size + String(state)} className="flex items-center gap-4">
            <span>
              {size} {String(state)}
            </span>
            <Checkbox
              size={size}
              checked={state}
              aria-label={size + " " + state + " enabled"}
            />
            <Checkbox
              size={size}
              checked={state}
              disabled
              aria-label={size + " " + state + " disabled"}
            />
            <Checkbox
              size={size}
              checked={state}
              disabled
              aria-label={size + " " + state + " legacy"}
              style={
                {
                  "--checkbox-disabled-opacity": ".7",
                  "--input-surface-shadow": "none",
                } as CSSProperties
              }
            />
          </div>
        ))
      )}
      <CheckboxGroup>
        <CheckboxInput title="正文颜色" description="说明颜色" />
        <CheckboxInput title="禁用正文" description="禁用说明" disabled />
      </CheckboxGroup>
    </div>
  );
}
export const ProjectModes: Story = {
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
            project={checkboxProject}
            projectCssOptions={checkboxCssOptions}
            projectTarget={target}
            storageKey="checkbox-project-demo"
          >
            <CheckboxModeCases />
          </ThemeProvider>
        )}
      </div>
    );
  },
};

import type { Meta, StoryObj } from "@storybook/react";
import { useState, type CSSProperties } from "react";
import { Switch, type SwitchSize } from "./switch";
import { parseProject } from "@aviala-design/tokens/project";
import standardProject from "../../../tokens/source/theme-engine/ald.project.json";
import { ThemeProvider, useTheme } from "../theme/theme-provider";
import { Button } from "./button";

const meta: Meta<typeof Switch> = {
  title: "Basic Input/Switch",
  component: Switch,
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["regular", "small"] satisfies SwitchSize[],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Switch>;

const switchProject = parseProject(JSON.stringify(standardProject));

function SwitchModeCases() {
  const { mode, setMode, density, setDensity, effects, setEffects } =
    useTheme();
  const [rtl, setRtl] = useState(false);
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
        <Button onClick={() => setRtl(!rtl)}>
          方向：{rtl ? "RTL" : "LTR"}
        </Button>
      </div>
      <div dir={rtl ? "rtl" : "ltr"} className="flex flex-col gap-4">
        {(["regular", "small"] as const).flatMap((size) =>
          ([false, true] as const).map((checked) => (
            <div key={size + checked} className="flex items-center gap-4">
              <span>
                {size} {checked ? "on" : "off"}
              </span>
              <Switch
                size={size}
                defaultChecked={checked}
                aria-label={`${size} ${checked} enabled`}
              />
              <Switch
                size={size}
                checked={checked}
                disabled
                aria-label={`${size} ${checked} disabled`}
              />
              <Switch
                size={size}
                checked={checked}
                disabled
                aria-label={`${size} ${checked} legacy`}
                style={
                  {
                    "--switch-disabled-opacity": ".7",
                    "--switch-thumb-shadow": "none",
                  } as CSSProperties
                }
              />
            </div>
          ))
        )}
      </div>
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
            project={switchProject}
            projectTarget={target}
            storageKey="switch-project-demo"
          >
            <SwitchModeCases />
          </ThemeProvider>
        )}
      </div>
    );
  },
};

export const FormIntegration: Story = {
  render: () => {
    const [checked, setChecked] = useState(false);
    const [result, setResult] = useState("尚未提交");
    return (
      <form
        className="flex flex-col gap-4"
        onSubmit={(event) => {
          event.preventDefault();
          setResult(
            JSON.stringify(
              Object.fromEntries(new FormData(event.currentTarget))
            )
          );
        }}
      >
        <label className="flex items-center gap-3">
          <Switch
            name="required"
            value="accepted"
            required
            aria-label="必选开关"
          />
          必选开关
        </label>
        <label className="flex items-center gap-3">
          <Switch
            name="controlled"
            value="enabled"
            checked={checked}
            onCheckedChange={setChecked}
            aria-label="受控开关"
          />
          受控开关：{checked ? "ON" : "OFF"}
        </label>
        <label className="flex items-center gap-3">
          <Switch
            name="disabled"
            value="excluded"
            defaultChecked
            disabled
            aria-label="禁用开关"
          />
          禁用开关
        </label>
        <Button type="submit">提交测试表单</Button>
        <output aria-label="表单提交结果">{result}</output>
      </form>
    );
  },
};

export const ComponentTokens: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      {(["regular", "small"] as const).flatMap((size) =>
        (["baseline", "token", "legacy"] as const).map((kind) => (
          <div
            key={size + kind}
            className="flex items-center gap-4"
            style={
              (kind === "token"
                ? {
                    [`--switch-size-${size}-padding-x`]: "4px",
                    [`--switch-size-${size}-padding-y`]: "3px",
                    [`--switch-size-${size}-radius`]: "7px",
                    "--switch-size-pointer-radius": "4px",
                    "--switch-color-selected-background-disabled":
                      "rgb(30, 80, 130)",
                    "--switch-color-unselected-background-disabled":
                      "rgb(180, 190, 200)",
                    "--switch-color-pointer-background-default":
                      "rgb(240, 230, 220)",
                    "--switch-transparency-pointer-disabled": ".8",
                  }
                : kind === "legacy"
                  ? {
                      "--switch-padding": "1px",
                      "--switch-checked-bg": "rgb(90, 40, 80)",
                      "--switch-track-bg": "rgb(130, 140, 150)",
                      "--switch-thumb-bg": "rgb(210, 220, 230)",
                      "--switch-disabled-opacity": ".6",
                    }
                  : {}) as CSSProperties
            }
          >
            <span>
              {size} {kind}
            </span>
            <Switch
              size={size}
              defaultChecked
              aria-label={`${size} ${kind} enabled`}
            />
            <Switch
              size={size}
              defaultChecked
              disabled
              aria-label={`${size} ${kind} selected disabled`}
            />
            <Switch
              size={size}
              disabled
              aria-label={`${size} ${kind} unselected disabled`}
            />
          </div>
        ))
      )}
    </div>
  ),
};

export const On: Story = {
  args: { defaultChecked: true, size: "regular" },
};

export const Off: Story = {
  args: { defaultChecked: false, size: "regular" },
};

export const Disabled: Story = {
  args: { defaultChecked: true, disabled: true },
};

const sizes: SwitchSize[] = ["regular", "small"];

export const SizeMatrix: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      {sizes.map((size) => (
        <div key={size} className="flex items-center gap-4">
          <span className="w-16 font-mono text-xs text-muted-foreground">
            {size}
          </span>
          <Switch size={size} defaultChecked={false} />
          <Switch size={size} defaultChecked />
          <Switch size={size} defaultChecked disabled />
        </div>
      ))}
    </div>
  ),
};

export const AnimationDemo: Story = {
  render: () => {
    const [controlled, setControlled] = useState(false);

    return (
      <div className="flex max-w-sm flex-col gap-6">
        <p className="text-sm text-muted-foreground">
          Press and hold for a light directional stretch. Toggle to slide — the
          thumb uses paired inset transitions (260ms) so it elongates slightly
          mid-travel and can reverse mid-flight if you interrupt.
        </p>
        <div className="flex flex-col gap-3">
          <label className="flex items-center gap-3 text-sm">
            <Switch defaultChecked={false} />
            Uncontrolled (starts off)
          </label>
          <label className="flex items-center gap-3 text-sm">
            <Switch defaultChecked />
            Uncontrolled (starts on)
          </label>
          <label className="flex items-center gap-3 text-sm">
            <Switch checked={controlled} onCheckedChange={setControlled} />
            Controlled ({controlled ? "on" : "off"})
          </label>
        </div>
        <div className="flex items-center gap-4">
          <span className="w-16 font-mono text-xs text-muted-foreground">
            small
          </span>
          <Switch size="small" defaultChecked={false} />
          <Switch size="small" defaultChecked />
        </div>
      </div>
    );
  },
};

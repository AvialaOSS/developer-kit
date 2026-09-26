import type { Meta, StoryObj } from "@storybook/react";
import { useState, type CSSProperties } from "react";
import { parseProject } from "@aviala-design/tokens/project";
import standardProject from "../../../tokens/source/theme-engine/ald.project.json";
import { ThemeProvider, useTheme } from "../theme/theme-provider";
import { Button } from "./button";
import { Loading, type LoadingLevel, type LoadingMode } from "./loading";

const meta: Meta<typeof Loading> = {
  title: "System Composition/Loading Icon",
  component: Loading,
  tags: ["autodocs"],
  argTypes: {
    level: {
      control: "select",
      options: [
        "display",
        "headline1",
        "headline2",
        "title",
        "subtitle",
        "text",
        "caption",
      ] satisfies LoadingLevel[],
    },
    mode: {
      control: "select",
      options: ["theme", "themeText", "black", "white"] satisfies LoadingMode[],
    },
    lineHeightFix: { control: "select", options: [true, false, "heightOnly", "both", "off"] },
  },
};

export default meta;
type Story = StoryObj<typeof Loading>;

export const Default: Story = {
  args: {
    level: "text",
    mode: "theme",
    lineHeightFix: true,
  },
};

export const GeometryOverrides: Story = {
  render: () => (
    <div className="flex gap-6">
      <div style={{ "--loading-icon-size-display-icon-width": "40px", "--loading-icon-size-display-icon-height": "36px", "--loading-icon-size-display-container-height": "48px", "--loading-icon-size-stroke-width": "3px" } as CSSProperties}>
        <Loading level="display" label="组件尺寸覆盖" />
      </div>
      <div style={{ "--loading-icon-size": "28px", "--loading-ring-stroke": "4px" } as CSSProperties}>
        <Loading level="text" lineHeightFix={false} label="旧尺寸覆盖" />
      </div>
    </div>
  ),
};

const levels: LoadingLevel[] = [
  "display",
  "headline1",
  "headline2",
  "title",
  "subtitle",
  "text",
  "caption",
];

const modes: LoadingMode[] = ["theme", "themeText", "black", "white"];

const loadingProject = parseProject(JSON.stringify(standardProject));
const loadingCssOptions = {
  remTokenIds: loadingProject.tokens.filter(token => token.type === "number" && token.unit === "px" && ["size", "line-height"].includes(token.path[0]!)).map(token => token.id),
};

function LoadingModeCases() {
  const { mode, setMode, density, setDensity, effects, setEffects } = useTheme();
  const [busy, setBusy] = useState(false);
  const [clicks, setClicks] = useState(0);
  return <div className="flex flex-col gap-4">
    <div className="flex gap-4">
      <Button onClick={() => setMode(mode === "light" ? "dark" : "light")}>颜色：{mode}</Button>
      <Button onClick={() => setDensity(density === "default" ? "mobile-friendly" : "default")}>密度：{density}</Button>
      <Button onClick={() => setEffects(!effects)}>效果：{effects ? "ON" : "OFF"}</Button>
      <Button onClick={() => setBusy(!busy)}>加载：{busy ? "ON" : "OFF"}</Button>
    </div>
    {levels.map(level => <div key={level} className="flex items-center gap-4">
      {(["off", "heightOnly", "both"] as const).flatMap(alignment => modes.map(color =>
        <Loading key={alignment + color} level={level} mode={color} lineHeightFix={alignment} label={`${level} ${alignment} ${color}`} />
      ))}
    </div>)}
    <div className="flex items-center gap-4" style={{ "--loading-fg-theme": "rgb(40, 90, 60)", "--loading-icon-size": "19px", "--loading-ring-stroke": "3px" } as CSSProperties}>
      <Loading label="旧覆盖" lineHeightFix={false} />
    </div>
    <div className="flex items-center gap-4">
      {(["tiny", "small", "regular", "big"] as const).map(size => <Button key={size} size={size} loading={busy} onClick={() => setClicks(value => value + 1)}>{size} 保存</Button>)}
    </div>
    <output>提交次数：{clicks}</output>
  </div>;
}

export const ProjectModes: Story = {
  render: () => {
    const [target, setTarget] = useState<HTMLDivElement | null>(null);
    return <div ref={setTarget} style={{ padding: 24, background: "var(--box-box-normal-background-white1)" }}>
      {target && <ThemeProvider project={loadingProject} projectCssOptions={loadingCssOptions} projectTarget={target} storageKey="loading-project-demo"><LoadingModeCases /></ThemeProvider>}
    </div>;
  },
};

export const ComponentTokens: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      {levels.map(level => <div key={level} className="flex gap-6">
        {modes.map(mode => <Loading key={mode} level={level} mode={mode} lineHeightFix="both" label={`${level} ${mode}`} />)}
      </div>)}
      <Loading label="新渐变覆盖" lineHeightFix="both" style={{ "--loading-icon-color-theme-gradient-start": "rgb(20, 40, 60)", "--loading-icon-color-theme-gradient-end": "rgb(80, 100, 120)" } as CSSProperties} />
      <Loading label="旧颜色覆盖" style={{ "--loading-fg-theme": "rgb(40, 90, 60)" } as CSSProperties} />
    </div>
  ),
};

export const ModeMatrixLineHeightFix: Story = {
  render: () => (
    <div className="flex gap-10">
      {modes.map((mode) => (
        <div key={mode} className="flex flex-col items-center gap-3">
          <span className="font-mono text-xs text-muted-foreground">
            {mode}
          </span>
          {levels.map((level) => (
            <Loading
              key={`${mode}-${level}`}
              level={level}
              mode={mode}
              lineHeightFix
            />
          ))}
        </div>
      ))}
    </div>
  ),
};

export const ModeMatrixCompact: Story = {
  render: () => (
    <div className="flex gap-10">
      {modes.map((mode) => (
        <div key={mode} className="flex flex-col items-center gap-3">
          <span className="font-mono text-xs text-muted-foreground">
            {mode}
          </span>
          {levels.map((level) => (
            <Loading
              key={`${mode}-${level}-compact`}
              level={level}
              mode={mode}
              lineHeightFix={false}
            />
          ))}
        </div>
      ))}
    </div>
  ),
};

export const OnDarkBackground: Story = {
  render: () => (
    <div className="flex items-center gap-6 rounded-lg bg-neutral-800 p-6">
      <Loading mode="white" level="text" lineHeightFix={false} />
      <Loading mode="theme" level="title" lineHeightFix={false} />
    </div>
  ),
};

import type { Meta, StoryObj } from "@storybook/react";
import { useState, type CSSProperties } from "react";
import { ThemeProvider, useTheme } from "../theme/theme-provider";
import { Button } from "./button";
import { parseProject } from "@aviala-design/tokens/project";
import standardProject from "../../../tokens/source/theme-engine/ald.project.json";
import { Progress } from "./progress";

const meta: Meta<typeof Progress> = {
  title: "Response And Feedback/Progress",
  component: Progress,
  tags: ["autodocs"],
  argTypes: {
    type: { control: "select", options: ["default", "success", "fail"] },
    size: { control: "select", options: ["default", "big"] },
    shape: { control: "select", options: ["bar", "ring"] },
    value: { control: { type: "range", min: 0, max: 100 } },
  },
};

export default meta;
type Story = StoryObj<typeof Progress>;

const progressProject = parseProject(JSON.stringify(standardProject));
function ProgressModeCases() {
  const { mode, setMode, density, setDensity, effects, setEffects } = useTheme();
  return <div className="flex flex-col gap-6">
    <div className="flex gap-4">
      <Button onClick={() => setMode(mode === "light" ? "dark" : "light")}>外观：{mode}</Button>
      <Button onClick={() => setDensity(density === "default" ? "mobile-friendly" : "default")}>密度：{density}</Button>
      <Button onClick={() => setEffects(!effects)}>效果：{effects ? "ON" : "OFF"}</Button>
    </div>
    {(["bar", "ring"] as const).flatMap(shape => (["default", "big"] as const).flatMap(size => (["default", "success", "fail"] as const).map(type => <Progress key={`${shape}-${size}-${type}`} aria-label={`${shape}-${size}-${type}`} shape={shape} size={size} type={type} value={75} />)))}
  </div>;
}
export const ProjectModes: Story = {
  render: function ProjectModesStory() {
    const [target, setTarget] = useState<HTMLDivElement | null>(null);
    return <div ref={setTarget}>{target && <ThemeProvider project={progressProject} projectTarget={target} defaultMode="light" storageKey="progress-project-modes"><ProgressModeCases /></ThemeProvider>}</div>;
  },
};

export const Bar: Story = {
  args: { shape: "bar", value: 75, type: "default", size: "default" },
};

export const RingGeometry: Story = {
  render: () => <div className="flex flex-col gap-6">
    {(["default", "big"] as const).flatMap(size => (["default", "fail"] as const).map(type =>
      <div key={`${size}-${type}`} className="flex items-center gap-6">
        {[0, 25, 75, 100].map(value => <Progress key={value} shape="ring" size={size} type={type} value={value} aria-label={`${size}-${type}-${value}`} />)}
      </div>))}
    <div style={{
      "--progress-size-ring-default-container-width": "40px",
      "--progress-size-ring-default-container-height": "32px",
      "--progress-size-ring-default-track-width": "28px",
      "--progress-size-ring-default-track-height": "20px",
      "--progress-size-ring-default-progress-width": "32px",
      "--progress-size-ring-default-progress-height": "24px",
      "--progress-size-ring-stroke-width": "4px",
    } as CSSProperties}><Progress shape="ring" value={75} aria-label="独立宽高和描边" /></div>
    <div style={{ "--progress-ring-size": "36px" } as CSSProperties} className="flex gap-6">
      <Progress shape="ring" value={75} aria-label="旧尺寸覆盖 default" />
      <Progress shape="ring" size="big" value={75} aria-label="旧尺寸覆盖 big" />
    </div>
  </div>,
};

export const BarBig: Story = {
  args: { shape: "bar", value: 75, type: "default", size: "big" },
};

export const DynamicValues: Story = {
  render: function DynamicValuesStory() {
    const [value, setValue] = useState(25);
    const [rtl, setRtl] = useState(false);
    return <div className="flex flex-col gap-6">
      <div className="flex gap-4">
        {[0, 25, 75, 100].map(next => <Button key={next} onClick={() => setValue(next)}>进度 {next}</Button>)}
        <Button onClick={() => setRtl(!rtl)}>方向：{rtl ? "RTL" : "LTR"}</Button>
      </div>
      <div dir={rtl ? "rtl" : "ltr"} className="flex flex-col gap-6" style={{ width: 120 }}>
        <Progress value={value} aria-label="动态条形" />
        <Progress shape="ring" value={value} aria-label="动态环形" />
        <Progress value={value} showLabel={false} aria-label="隐藏标签" />
        <Progress value={value} label="自定义状态" aria-label="自定义标签" />
        <div style={{ width: 48 }}><Progress value={value} label="窄容器中的完整状态文字" aria-label="窄容器标签" /></div>
      </div>
      <div style={{
        "--progress-fill-bg": "rebeccapurple",
        "--progress-track-bg": "gainsboro",
        "--progress-ring-track": "gainsboro",
        "--progress-label-fg": "rebeccapurple",
        "--progress-gap": "9px",
        "--progress-bar-height": "9px",
        "--progress-bar-height-big": "13px",
      } as CSSProperties} className="flex gap-6">
        {(["default", "success", "fail"] as const).flatMap(type => (["bar", "ring"] as const).map(shape =>
          <Progress key={`${type}-${shape}`} type={type} shape={shape} value={value} aria-label={`旧颜色覆盖 ${type} ${shape}`} />))}
      </div>
    </div>;
  },
};

export const Ring: Story = {
  args: { shape: "ring", value: 75, type: "default", size: "big" },
};

/** Figma Progress matrix (589:55818) */
export const FigmaMatrix: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 12,
          alignItems: "center",
        }}
      >
        <Progress shape="bar" size="default" type="default" value={75} />
        <Progress shape="bar" size="default" type="success" value={100} />
        <Progress shape="bar" size="default" type="fail" value={75} />
      </div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 12,
          alignItems: "center",
        }}
      >
        <Progress shape="bar" size="big" type="default" value={75} />
        <Progress shape="bar" size="big" type="success" value={100} />
        <Progress shape="bar" size="big" type="fail" value={75} />
      </div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 12,
          alignItems: "center",
        }}
      >
        <Progress shape="ring" size="big" type="default" value={75} />
        <Progress shape="ring" size="big" type="success" value={100} />
        <Progress shape="ring" size="big" type="fail" value={75} />
      </div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 12,
          alignItems: "center",
        }}
      >
        <Progress shape="ring" size="default" type="default" value={75} />
        <Progress shape="ring" size="default" type="success" value={100} />
        <Progress shape="ring" size="default" type="fail" value={75} />
      </div>
    </div>
  ),
};

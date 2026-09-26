import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Slider } from "./slider";
import { Button } from "./button";
import { ThemeProvider, useTheme } from "../theme/theme-provider";
import { parseProject } from "@aviala-design/tokens/project";
import standardProject from "../../../tokens/source/theme-engine/ald.project.json";

const meta: Meta<typeof Slider> = {
  title: "Information Collect/Slider",
  component: Slider,
  tags: ["autodocs"],
  argTypes: {
    size: { control: "select", options: ["default", "big"] },
    type: { control: "select", options: ["default", "range"] },
    orientation: { control: "select", options: ["horizontal", "vertical"] },
    disabled: { control: "boolean" },
    showValueTooltip: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Slider>;

const sliderProject = parseProject(JSON.stringify(standardProject));
function SliderModeCases() {
  const { mode, setMode, density, setDensity, effects, setEffects } = useTheme();
  return <div className="flex flex-col gap-6">
    <div className="flex gap-4">
      <Button onClick={() => setMode(mode === "light" ? "dark" : "light")}>外观：{mode}</Button>
      <Button onClick={() => setDensity(density === "default" ? "mobile-friendly" : "default")}>密度：{density}</Button>
      <Button onClick={() => setEffects(!effects)}>效果：{effects ? "ON" : "OFF"}</Button>
    </div>
    {(["default", "big"] as const).flatMap(size => [false, true].map(disabled =>
      <Slider key={`${size}-${disabled}`} aria-label={`${size}-${disabled}`} size={size} disabled={disabled} defaultValue={[40]} />
    ))}
  </div>;
}
export const ProjectModes: Story = {
  render: function ProjectModesStory() {
    const [target, setTarget] = useState<HTMLDivElement | null>(null);
    return <div ref={setTarget}>{target && <ThemeProvider project={sliderProject} projectTarget={target} defaultMode="light" storageKey="slider-project-modes"><SliderModeCases /></ThemeProvider>}</div>;
  },
};

export const ComponentGeometry: Story = {
  render: () => <div className="flex gap-10">
    {(["horizontal", "vertical"] as const).map(orientation => <div key={orientation} className="flex gap-8" style={{ "--slider-size-regular-track-height": "9px", "--slider-size-big-track-height": "15px", "--slider-size-regular-thumb-width": "20px", "--slider-size-regular-thumb-height": "24px", "--slider-size-big-thumb-width": "26px", "--slider-size-big-thumb-height": "30px", "--slider-color-track-default": "rgb(210, 220, 230)", "--slider-color-progress-default": "rgb(40, 90, 60)", "--slider-color-thumb-default": "rgb(240, 230, 220)", "--slider-color-thumb-mark-default": "rgb(80, 40, 100)", "--slider-size-regular-thumb-mark-width": "6px", "--slider-size-regular-thumb-mark-height": "10px", "--slider-size-thumb-mark-radius": "2px", "--slider-size-thumb-shadow-1-offset-x": "3px", "--slider-size-thumb-shadow-1-offset-y": "4px", "--slider-size-thumb-shadow-1-radius": "5px", "--slider-size-thumb-shadow-1-spread": "2px", "--slider-color-thumb-shadow-1": "rgba(30, 50, 70, 0.3)", "--slider-size-track-radius": "5px", "--slider-size-thumb-radius": "7px" } as React.CSSProperties}>
      <Slider aria-label={`${orientation} regular`} orientation={orientation} defaultValue={[40]} />
      <Slider aria-label={`${orientation} big`} orientation={orientation} size="big" defaultValue={[40]} />
      <Slider aria-label={`${orientation} legacy`} orientation={orientation} defaultValue={[40]} style={{ "--slider-track-height": "7px", "--slider-thumb-size": "18px", "--slider-thumb-core-size": "5px", "--slider-track-bg": "rgb(100, 60, 40)", "--slider-thumb-shadow": "none" } as React.CSSProperties} />
    </div>)}
  </div>,
};

export const ProgressCorners: Story = {
  render: () => <div className="flex flex-wrap gap-10" style={{ "--slider-size-progress-radius": "4px", "--slider-size-progress-inner-radius": "1px" } as React.CSSProperties}>
    {(["horizontal", "vertical"] as const).flatMap(orientation => (["ltr", "rtl"] as const).flatMap(dir => [false, true].flatMap(inverted => (["default", "range"] as const).flatMap(type => (["default", "big"] as const).map(size =>
      <div key={`${orientation}-${dir}-${inverted}-${type}-${size}`} className="flex flex-col gap-3">
        <span>{`${orientation}-${dir}-${inverted}-${type}-${size}`}</span>
        <Slider aria-label={`${orientation}-${dir}-${inverted}-${type}-${size}`} orientation={orientation} dir={dir} inverted={inverted} type={type} size={size} defaultValue={type === "range" ? [25, 75] : [40]} />
      </div>
    )))))}
  </div>,
};

export const FormBehavior: Story = {
  render: function FormBehaviorStory() {
    const [range, setRange] = useState([20, 60]);
    const [submitted, setSubmitted] = useState("");
    return <form className="flex flex-col gap-8" onSubmit={event => {
      event.preventDefault();
      setSubmitted(JSON.stringify(Array.from(new FormData(event.currentTarget).entries())));
    }}>
      <Slider name="volume" aria-label="Volume" defaultValue={[40]} step={5} showValueTooltip />
      <Slider name="interval" aria-label="Interval" type="range" value={range} onValueChange={setRange} step={5} minStepsBetweenThumbs={2} showValueTooltip formatValueTooltip={value => `${value}%`} />
      <output aria-label="当前范围">{range.join(",")}</output>
      <Slider name="locked" aria-label="Locked" defaultValue={[30]} disabled />
      <Button type="submit">提交数值</Button>
      <output aria-label="提交结果">{submitted}</output>
    </form>;
  },
};

export const Default: Story = {
  args: { size: "default", type: "default", defaultValue: [40] },
};

export const Big: Story = {
  args: { size: "big", type: "default", defaultValue: [40] },
};

export const Range: Story = {
  args: { size: "default", type: "range", defaultValue: [20, 70] },
};

export const Vertical: Story = {
  args: {
    size: "default",
    orientation: "vertical",
    defaultValue: [70],
    style: { height: 96 },
  },
};

export const SizeMatrix: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      {(
        [
          ["Default", { size: "default" as const }],
          ["Big", { size: "big" as const }],
          [
            "Range · Default",
            { type: "range" as const, defaultValue: [25, 65] },
          ],
          [
            "Range · Big",
            {
              size: "big" as const,
              type: "range" as const,
              defaultValue: [25, 65],
            },
          ],
          ["Disabled · Default", { disabled: true }],
          ["Disabled · Big", { size: "big" as const, disabled: true }],
        ] as const
      ).map(([label, props]) => (
        <div key={label} className="flex flex-col gap-2">
          <span className="font-mono text-xs text-muted-foreground">
            {label}
          </span>
          <Slider defaultValue={[40]} {...props} />
        </div>
      ))}
    </div>
  ),
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: [50] },
};

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState([35]);
    return (
      <Slider value={value} onValueChange={setValue} aria-label="Volume" />
    );
  },
};

export const ValueTooltip: Story = {
  name: "Value tooltip",
  args: {
    showValueTooltip: true,
    defaultValue: [40],
  },
  parameters: {
    docs: {
      description: {
        story:
          "Enable `showValueTooltip` to show the thumb value on hover and while dragging. Use `formatValueTooltip` to customize the label.",
      },
    },
  },
};

export const ValueTooltipFormatted: Story = {
  name: "Value tooltip · formatted",
  args: {
    showValueTooltip: true,
    defaultValue: [20, 70],
    type: "range",
    formatValueTooltip: (value) => `${value}%`,
  },
};

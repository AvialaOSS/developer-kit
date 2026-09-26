import type { Meta, StoryObj } from "@storybook/react";
import { Scroll } from "./scroll";
import { useState, type CSSProperties } from "react";
import { Button } from "./button";
import { ThemeProvider, useTheme } from "../theme/theme-provider";
import { parseProject } from "@aviala-design/tokens/project";
import standardProject from "../../../tokens/source/theme-engine/ald.project.json";

const meta: Meta<typeof Scroll> = {
  title: "System Composition/Scroll",
  component: Scroll,
  tags: ["autodocs"],
  argTypes: {
    size: { control: "select", options: ["default", "small"] },
  },
};

export default meta;
type Story = StoryObj<typeof Scroll>;

const scrollProject = parseProject(JSON.stringify(standardProject));
function ScrollModeCases() {
  const { mode, setMode, density, setDensity } = useTheme();
  const [custom, setCustom] = useState(false);
  const [legacy, setLegacy] = useState(false);
  const [rtl, setRtl] = useState(false);
  const [overflow, setOverflow] = useState(true);
  return <div className="flex flex-col gap-6">
    <div className="flex gap-4">
      <Button onClick={() => setMode(mode === "light" ? "dark" : "light")}>外观：{mode}</Button>
      <Button onClick={() => setDensity(density === "default" ? "mobile-friendly" : "default")}>密度：{density}</Button>
      <Button onClick={() => setCustom(!custom)}>Token 覆盖：{custom ? "ON" : "OFF"}</Button>
      <Button onClick={() => setLegacy(!legacy)}>旧覆盖：{legacy ? "ON" : "OFF"}</Button>
      <Button onClick={() => setRtl(!rtl)}>方向：{rtl ? "RTL" : "LTR"}</Button>
      <Button onClick={() => setOverflow(!overflow)}>内容：{overflow ? "溢出" : "短内容"}</Button>
    </div>
    <div className="flex flex-wrap gap-6">
      {(["default", "small"] as const).flatMap(size => (["vertical", "horizontal"] as const).map(orientation =>
        <Scroll key={`${size}-${orientation}`} size={size} orientation={orientation} dir={rtl ? "rtl" : "ltr"} tabIndex={0} aria-label={`${size}-${orientation}`} style={{width:240,height:160,
          ...(custom ? {"--scroll-size-default-container-width":"18px","--scroll-size-small-container-width":"14px","--scroll-size-padding-x":"3px","--scroll-size-padding-y":"7px","--scroll-size-thumb-radius":"5px","--scroll-color-thumb-background":"#a855f7"} : {}),
          ...(legacy ? {"--scroll-size":"16px","--scroll-size-small":"12px","--scroll-thumb-inset":"4px","--scroll-thumb-inset-small":"1px","--scroll-track-padding-y":"6px","--scroll-thumb-bg":"#123456"} : {}),
        } as CSSProperties}>
          <div style={!overflow ? undefined : orientation === "vertical" ? {height:800} : {width:800}}>{size} / {orientation}</div>
        </Scroll>
      ))}
    </div>
  </div>;
}

export const ProjectModes: Story = {
  render: function ProjectModesStory() {
    const [target, setTarget] = useState<HTMLDivElement | null>(null);
    return <div ref={setTarget}>{target && <ThemeProvider project={scrollProject} projectTarget={target} defaultMode="light" storageKey="scroll-project-modes"><ScrollModeCases /></ThemeProvider>}</div>;
  },
};

export const Default: Story = {
  args: {
    size: "default",
    style: { height: 160, width: 240 },
    children: (
      <div style={{ padding: 8 }}>
        {Array.from({ length: 30 }, (_, i) => (
          <p key={i} style={{ margin: "0 0 8px" }}>
            Line {i + 1}
          </p>
        ))}
      </div>
    ),
  },
};

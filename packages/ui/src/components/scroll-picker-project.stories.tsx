import type { Meta, StoryObj } from "@storybook/react";
import { useState, type CSSProperties } from "react";
import { parseProject } from "@aviala-design/tokens/project";
import standardProject from "../../../tokens/source/theme-engine/ald.project.json";
import { ThemeProvider, useTheme } from "../theme/theme-provider";
import { ScrollPicker, ScrollPickerColumn } from "./scroll-picker";
import { Button } from "./button";

// The same standard project supplies the static CSS build and this runtime demo.
const project = parseProject(JSON.stringify(standardProject));
const cssOptions = {
  remTokenIds: project.tokens
    .filter(
      (token) =>
        token.type === "number" &&
        token.unit === "px" &&
        ["size", "line-height"].includes(token.path[0]!)
    )
    .map((token) => token.id),
};

function Controls() {
  const {
    mode,
    setMode,
    density,
    setDensity,
    effects,
    setEffects,
    isProjectTheme,
    setPrimaryColor,
    applyPreset,
  } = useTheme();
  const [value, setValue] = useState("03");
  return (
    <>
      <div
        style={{
          display: "flex",
          gap: "var(--gap-inside)",
          marginBottom: "var(--padding-regular)",
        }}
      >
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
      <ScrollPicker>
        <ScrollPickerColumn
          aria-label="Project value"
          values={["01", "02", "03", "04", "05", "06", "07"]}
          value={value}
          onChange={setValue}
        />
      </ScrollPicker>
      {!isProjectTheme && (
        <div style={{ display: "flex", gap: "var(--gap-inside)" }}>
          <Button onClick={() => setPrimaryColor("#165DFF")}>动态蓝色</Button>
          <Button onClick={() => applyPreset("ald")}>静态 ALD</Button>
        </div>
      )}
    </>
  );
}

function ProjectDemo() {
  const [target, setTarget] = useState<HTMLDivElement | null>(null);
  return (
    <div
      ref={setTarget}
      data-testid="project-scope"
      style={{
        padding: "var(--padding-large)",
        background: "var(--box-box-normal-background-white1)",
        color: "var(--text-text-normal-text-black)",
      }}
    >
      {target && (
        <ThemeProvider
          project={project}
          projectCssOptions={cssOptions}
          projectTarget={target}
          storageKey="scroll-picker-project-demo"
        >
          <Controls />
        </ThemeProvider>
      )}
    </div>
  );
}

export default {
  title: "Information Collect/ScrollPicker Project",
  component: ProjectDemo,
} satisfies Meta<typeof ProjectDemo>;
export const IndependentModes: StoryObj<typeof ProjectDemo> = {};
export const DefaultEntry: StoryObj<typeof ProjectDemo> = {
  parameters: { localThemeControls: true },
  render: () => <Controls />,
};

function OverrideDemo() {
  const [target, setTarget] = useState<HTMLDivElement | null>(null);
  const [active, setActive] = useState(false);
  const [value, setValue] = useState("02");
  const variants = [
    { name: "baseline", style: {} },
    { name: "canonical", style: { "--scroll-picker-color-background": "rgb(10, 20, 30)" } },
    { name: "legacy", style: { "--scroll-picker-bg": "rgb(40, 50, 60)" } },
    { name: "both", style: { "--scroll-picker-color-background": "rgb(10, 20, 30)", "--scroll-picker-bg": "rgb(40, 50, 60)" } },
  ];
  return (
    <>
      <Button onClick={() => setActive(!active)}>
        {active ? "移除局部主题" : "应用局部主题"}
      </Button>
      <div ref={setTarget} data-testid="ownership-scope" style={{
        "--scroll-picker-color-background": "rgb(70, 80, 90)",
        "--consumer-owned": "preserved",
        display: "flex", gap: "var(--gap-inside)",
      } as CSSProperties}>
        {active && target && <ThemeProvider project={project} projectTarget={target}
          projectCssOptions={cssOptions} storageKey="scroll-picker-ownership-demo">
          <span>局部主题已应用</span>
        </ThemeProvider>}
        {variants.map(({ name, style }) => <div key={name}>
          <p>{name}</p>
          <ScrollPicker data-testid={`override-${name}`} style={style as CSSProperties}>
            <ScrollPickerColumn aria-label={name} values={["01", "02", "03"]} value={value} onChange={setValue} />
          </ScrollPicker>
        </div>)}
      </div>
    </>
  );
}

export const OverrideOwnership: StoryObj<typeof ProjectDemo> = {
  render: () => <OverrideDemo />,
};

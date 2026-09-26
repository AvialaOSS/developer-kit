import type { Meta, StoryObj } from "@storybook/react";
import { GeneralSetting } from "@aviala-design/icons";
import { Button } from "./button";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { useState, type CSSProperties } from "react";
import { ThemeProvider, useTheme } from "../theme/theme-provider";
import { parseProject } from "@aviala-design/tokens/project";
import standardProject from "../../../tokens/source/theme-engine/ald.project.json";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";

const meta: Meta<typeof Tooltip> = {
  title: "System Composition/Tooltip",
  component: Tooltip,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <TooltipProvider>
        <Story />
      </TooltipProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Tooltip>;

export const WithIcons: Story = {
  render: () => (
    <Tooltip defaultOpen>
      <TooltipTrigger asChild><Button>图标与正文</Button></TooltipTrigger>
      <TooltipContent leadingIcon={<GeneralSetting />} trailingIcon={<GeneralSetting />}>
        可选图标使用组件宽高与颜色，正文使用共享 Text 字体指标。
      </TooltipContent>
    </Tooltip>
  ),
};

const tooltipProject = parseProject(JSON.stringify(standardProject));
function TooltipModeCases() {
  const { mode, setMode, density, setDensity, effects, setEffects } = useTheme();
  const [customPointer, setCustomPointer] = useState(false);
  const [customColors, setCustomColors] = useState(false);
  const [legacyOverrides, setLegacyOverrides] = useState(false);
  const [rtl, setRtl] = useState(false);
  const [allAlignments, setAllAlignments] = useState(false);
  const [wideTriggers, setWideTriggers] = useState(false);
  return <div className="flex flex-col gap-6 p-16">
    <div className="flex flex-wrap gap-4">
      <Button onClick={() => setMode(mode === "light" ? "dark" : "light")}>外观：{mode}</Button>
      <Button onClick={() => setDensity(density === "default" ? "mobile-friendly" : "default")}>密度：{density}</Button>
      <Button onClick={() => setEffects(!effects)}>效果：{effects ? "ON" : "OFF"}</Button>
      <Button onClick={() => setCustomPointer(!customPointer)}>指针：{customPointer ? "22×9" : "主题"}</Button>
      <Button onClick={() => setCustomColors(!customColors)}>颜色：{customColors ? "独立覆盖" : "主题"}</Button>
      <Button onClick={() => setLegacyOverrides(!legacyOverrides)}>旧覆盖：{legacyOverrides ? "ON" : "OFF"}</Button>
      <Button onClick={() => setRtl(!rtl)}>方向：{rtl ? "RTL" : "LTR"}</Button>
      <Button onClick={() => setAllAlignments(!allAlignments)}>方位：{allAlignments ? "12" : "4"}</Button>
      <Button onClick={() => setWideTriggers(!wideTriggers)}>触发器：{wideTriggers ? "撑满" : "内容宽度"}</Button>
    </div>
    <div className={`grid grid-cols-3 gap-24 p-16 ${wideTriggers ? "" : "justify-items-center"}`} dir={rtl ? "rtl" : "ltr"}>
      {(["top", "right", "bottom", "left"] as const).flatMap(side => (allAlignments ? ["start", "center", "end"] as const : ["center"] as const).map(align => <Tooltip key={`${side}-${align}`} open>
        <TooltipTrigger asChild><Button>{side}-{align}</Button></TooltipTrigger>
        <TooltipContent side={side} align={align} dir={rtl ? "rtl" : "ltr"} style={{
          ...(customPointer ? { "--tooltip-size-pointer-width": "22px", "--tooltip-size-pointer-height": "9px" } : {}),
          ...(customColors ? { "--tooltip-color-background-default": "#183153", "--tooltip-color-pointer-default": "#a855f7", "--tooltip-color-text-default": "#ffffff" } : {}),
          ...(legacyOverrides ? { "--tooltip-content-bg": "#345678", "--tooltip-content-fg": "#fedcba", "--tooltip-content-radius": "13px", "--tooltip-content-px": "11px", "--tooltip-content-py": "7px", "--tooltip-content-shadow": "none" } : {}),
        } as CSSProperties}>提示 {side}-{align}</TooltipContent>
      </Tooltip>))}
    </div>
    <Popover open>
      <PopoverTrigger asChild><Button>触屏提示外观</Button></PopoverTrigger>
      <PopoverContent appearance="tooltip" showArrow side="bottom" onOpenAutoFocus={event => event.preventDefault()}>
        与桌面 Tooltip 共用组件 Token
      </PopoverContent>
    </Popover>
  </div>;
}
export const ProjectModes: Story = {
  render: function ProjectModesStory() {
    const [target, setTarget] = useState<HTMLDivElement | null>(null);
    return <div ref={setTarget}>{target && <ThemeProvider project={tooltipProject} projectTarget={target} defaultMode="light" storageKey="tooltip-project-modes"><TooltipModeCases /></ThemeProvider>}</div>;
  },
};

export const Default: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button mode="default">Hover me</Button>
      </TooltipTrigger>
      <TooltipContent>Tooltip with text typography</TooltipContent>
    </Tooltip>
  ),
};

export const LongContent: Story = {
  render: () => (
    <div className="flex justify-center p-8">
      <Tooltip open>
        <TooltipTrigger asChild><Button>Long token path</Button></TooltipTrigger>
        <TooltipContent side="bottom">
          componentToken/segmentatorButton/color/primary/unselected/background-default-with-a-very-long-unbroken-suffix
        </TooltipContent>
      </Tooltip>
    </div>
  ),
};

export const WithIconTrigger: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          mode="default"
          iconOnly
          leftIcon={<GeneralSetting aria-hidden />}
          aria-label="Settings"
        />
      </TooltipTrigger>
      <TooltipContent side="bottom">Settings</TooltipContent>
    </Tooltip>
  ),
};

export const Placements: Story = {
  render: () => (
    <div className="flex flex-wrap items-center justify-center gap-4 p-16">
      {(["top", "right", "bottom", "left"] as const).map((side) => (
        <Tooltip key={side}>
          <TooltipTrigger asChild>
            <Button mode="second" size="small">
              {side}
            </Button>
          </TooltipTrigger>
          <TooltipContent side={side}>Tooltip on {side}</TooltipContent>
        </Tooltip>
      ))}
    </div>
  ),
};

export const WithoutArrow: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button mode="noBackground">No arrow</Button>
      </TooltipTrigger>
      <TooltipContent showArrow={false}>Tooltip without caret</TooltipContent>
    </Tooltip>
  ),
};

export const TextLevel: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button mode="default">Text level</Button>
      </TooltipTrigger>
      <TooltipContent level="text">Tooltip with text typography</TooltipContent>
    </Tooltip>
  ),
};

export const InstantOpen: Story = {
  render: () => (
    <TooltipProvider delayDuration={0}>
      <Tooltip defaultOpen>
        <TooltipTrigger asChild>
          <Button mode="primary">Always visible</Button>
        </TooltipTrigger>
        <TooltipContent>Instant tooltip — no hover delay</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
};

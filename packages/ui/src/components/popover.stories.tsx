import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./button";
import { EditColorPicker } from "@aviala-design/icons";
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverIcon,
  PopoverTrigger,
} from "./popover";
import { HoverPopover } from "./hover-popover";
import { Stack } from "./stack";
import { useState, type CSSProperties } from "react";
import { ThemeProvider, useTheme } from "../theme/theme-provider";
import { parseProject } from "@aviala-design/tokens/project";
import standardProject from "../../../tokens/source/theme-engine/ald.project.json";

const meta: Meta<typeof Popover> = {
  title: "System Composition/Popover",
  component: Popover,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Popover>;

export const ContentIcon: Story = {
  render: () => (
    <div className="flex gap-8 p-16">
      {(["default", "primary", "tooltip"] as const).map(appearance => (
        <Popover key={appearance}>
          <PopoverTrigger asChild><Button>{appearance}</Button></PopoverTrigger>
          <PopoverContent appearance={appearance} showArrow>
            <PopoverIcon><EditColorPicker /></PopoverIcon>
            <span>选择颜色</span>
          </PopoverContent>
        </Popover>
      ))}
    </div>
  ),
};

const popoverProject = parseProject(JSON.stringify(standardProject));
function PopoverModeCases() {
  const { mode, setMode, density, setDensity, effects, setEffects } = useTheme();
  const [overrides, setOverrides] = useState(false);
  const [flush, setFlush] = useState(false);
  const [layoutOverrides, setLayoutOverrides] = useState(false);
  const sides = ["bottom", "left", "top", "right"] as const;
  const [sideIndex, setSideIndex] = useState(0);
  return <div className="flex flex-col gap-24 p-16">
    <div className="flex flex-wrap gap-4">
      <Button onClick={() => setMode(mode === "light" ? "dark" : "light")}>外观：{mode}</Button>
      <Button onClick={() => setDensity(density === "default" ? "mobile-friendly" : "default")}>密度：{density}</Button>
      <Button onClick={() => setEffects(!effects)}>效果：{effects ? "ON" : "OFF"}</Button>
      <Button onClick={() => setOverrides(!overrides)}>旧覆盖：{overrides ? "ON" : "OFF"}</Button>
      <Button onClick={() => setFlush(!flush)}>内边距：{flush ? "清空" : "主题"}</Button>
      <Button onClick={() => setLayoutOverrides(!layoutOverrides)}>布局覆盖：{layoutOverrides ? "ON" : "OFF"}</Button>
      <Button onClick={() => setSideIndex((sideIndex + 1) % sides.length)}>方位：{sides[sideIndex]}</Button>
    </div>
    <div className="flex justify-around gap-16">
      {(["default", "primary", "tooltip"] as const).map(appearance => <Popover key={appearance} open>
        <PopoverTrigger asChild><Button>{appearance}</Button></PopoverTrigger>
        <PopoverContent appearance={appearance} showArrow flush={flush} side={sides[sideIndex]} onOpenAutoFocus={event => event.preventDefault()} style={{...(overrides ? {
          "--popover-content-bg": "#123456", "--popover-content-fg": "#fedcba",
          "--popover-content-radius": "13px", "--popover-content-shadow": "none",
          "--popover-content-px": "5px", "--popover-content-py": "3px",
          "--popover-content-border": "#a855f7", "--popover-content-arrow-stroke": "#a855f7",
        } : {}), ...(layoutOverrides ? {
          "--popover-size-padding-x": "7px", "--popover-size-padding-y": "9px",
          "--popover-slot-size-padding-x": "11px", "--popover-slot-size-padding-y": "13px",
          "--popover-size-pointer-width": "22px", "--popover-size-pointer-height": "9px",
        } : {})} as CSSProperties}>示例 {appearance}</PopoverContent>
      </Popover>)}
    </div>
  </div>;
}

export const ProjectModes: Story = {
  render: function ProjectModesStory() {
    const [target, setTarget] = useState<HTMLDivElement | null>(null);
    return <div ref={setTarget}>{target && <ThemeProvider project={popoverProject} projectTarget={target} defaultMode="light" storageKey="popover-project-modes"><PopoverModeCases /></ThemeProvider>}</div>;
  },
};

export const Default: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button mode="default">Open popover</Button>
      </PopoverTrigger>
      <PopoverContent>
        <p>
          Popover content with text typography. Use for rich panels, forms, or
          actions.
        </p>
      </PopoverContent>
    </Popover>
  ),
};

export const NarrowContent: Story = {
  render: function NarrowContentStory() {
    const [primary, setPrimary] = useState(false);
    return <div className="flex flex-col items-center gap-8 p-8">
      <Button onClick={() => setPrimary(!primary)}>外观：{primary ? "primary" : "default"}</Button>
      <Popover defaultOpen>
        <PopoverTrigger asChild><Button>编辑 Token</Button></PopoverTrigger>
        <PopoverContent appearance={primary ? "primary" : "default"} side="bottom" showArrow>
          <span>componentToken/segmentatorButton/color/primary/unselected/background-default-with-a-very-long-unbroken-suffix</span>
          <label className="flex min-w-0 flex-col gap-2">变量名称<input className="min-w-0" defaultValue="background-default" /></label>
        </PopoverContent>
      </Popover>
    </div>;
  },
};

/** Side-aware enter/exit animation (150ms fade + translate). */
export const OpenByDefault: Story = {
  render: () => (
    <Popover defaultOpen>
      <PopoverTrigger asChild>
        <Button mode="primary">Anchor</Button>
      </PopoverTrigger>
      <PopoverContent side="bottom" align="start">
        Open by default — panel animates on close.
      </PopoverContent>
    </Popover>
  ),
};

export const WithArrow: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button mode="second">With arrow</Button>
      </PopoverTrigger>
      <PopoverContent showArrow side="top">
        Popover with caret arrow pointing at the trigger.
      </PopoverContent>
    </Popover>
  ),
};

/** `appearance="tooltip"` — the shared inverted tooltip skin (dark surface, caption
 *  text, solid caret). This is what `ResponsiveTooltip` renders on touch devices. */
export const TooltipAppearance: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button mode="default">Tooltip look</Button>
      </PopoverTrigger>
      <PopoverContent appearance="tooltip" showArrow side="top">
        Looks like a tooltip, triggers like a popover.
      </PopoverContent>
    </Popover>
  ),
};

/** `appearance="primary"` — brand primary surface with white text (same tokens as the
 *  primary button), borderless with a solid primary caret. */
export const PrimaryAppearance: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button mode="default">Primary look</Button>
      </PopoverTrigger>
      <PopoverContent appearance="primary" showArrow side="top">
        Primary surface with white text.
      </PopoverContent>
    </Popover>
  ),
};

/** Hover (desktop) / tap (touch) to reveal — `HoverPopover` wraps Popover with
 *  hover-intent + keyboard focus, and degrades to tap on touch devices. */
export const HoverTrigger: Story = {
  render: () => (
    <div className="flex flex-col items-center gap-3">
      <p className="text-sm text-muted-foreground">
        将鼠标悬浮在按钮上以显示 Popover（触屏为点按）
      </p>
      <HoverPopover
        content={
          <div className="flex flex-col gap-2 p-1">
            <p>富内容浮层：可交互。</p>
            <div className="flex gap-2">
              <Button mode="primary" size="small">
                Action
              </Button>
              <Button mode="second" size="small">
                Cancel
              </Button>
            </div>
          </div>
        }
      >
        <Button mode="default">Hover to open</Button>
      </HoverPopover>
    </div>
  ),
};

export const Placements: Story = {
  render: () => (
    <Stack gap="block" className="items-center p-16">
      {(["top", "right", "bottom", "left"] as const).map((side) => (
        <Popover key={side}>
          <PopoverTrigger asChild>
            <Button mode="default" size="small">
              {side}
            </Button>
          </PopoverTrigger>
          <PopoverContent side={side} showArrow>
            Popover on {side}
          </PopoverContent>
        </Popover>
      ))}
    </Stack>
  ),
};

export const WithAnchor: Story = {
  render: () => (
    <Popover>
      <PopoverAnchor asChild>
        <span className="inline-block rounded border border-border px-3 py-2 text-sm">
          Custom anchor element
        </span>
      </PopoverAnchor>
      <PopoverTrigger asChild>
        <Button mode="noBackground" size="small" className="ml-2">
          Toggle
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start">
        Content positioned relative to the anchor, not the trigger button.
      </PopoverContent>
    </Popover>
  ),
};

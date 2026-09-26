import type { Meta, StoryObj } from "@storybook/react";
import { Anchor, AnchorItem, type AnchorIndentLevel } from "./anchor";
import { useState, type CSSProperties } from "react";
import { Button } from "./button";
import { ThemeProvider, useTheme } from "../theme/theme-provider";
import { parseProject } from "@aviala-design/tokens/project";
import project from "../../../tokens/source/theme-engine/ald.project.json";

const meta: Meta<typeof Anchor> = {
  title: "System Composition/Anchor",
  component: Anchor,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Anchor>;

const indentLevels: AnchorIndentLevel[] = [0, 1, 2, 3];

const anchorProject = parseProject(JSON.stringify(project));
function AnchorCases() {
  const { mode, setMode, density, setDensity } = useTheme();
  const [custom, setCustom] = useState(false);
  const [clicks, setClicks] = useState(0);
  const [childClicks, setChildClicks] = useState(0);
  const [host, setHost] = useState<HTMLAnchorElement | null>(null);
  return (
    <div className="flex flex-col gap-6">
      <div className="flex gap-4">
        <Button onClick={() => setMode(mode === "light" ? "dark" : "light")}>
          外观：{mode}
        </Button>
        <Button
          onClick={() =>
            setDensity(density === "default" ? "mobile-friendly" : "default")
          }
        >
          密度：{density}
        </Button>
        <Button onClick={() => setCustom(!custom)}>
          覆盖：{custom ? "ON" : "OFF"}
        </Button>
      </div>
      <Anchor
        style={
          {
            width: 240,
            ...(custom
              ? {
                  "--anchor-size-gap": "5px",
                  "--anchor-item-size-level-0-gap": "7px",
                  "--anchor-item-size-stroke-width": "3px",
                  "--anchor-item-size-content-padding-x": "9px",
                  "--anchor-item-color-text-default": "#123456",
                  "--anchor-item-color-selected-border-default": "#705020",
                  "--anchor-item-transparency-unselected-text": "0.3",
                  "--anchor-item-size-text-gap": "6px",
                  "--anchor-item-color-description-default": "#705020",
                }
              : {}),
          } as CSSProperties
        }
      >
        {indentLevels.flatMap((level) =>
          [true, false].map((active) => (
            <AnchorItem
              key={`${level}-${active}`}
              href="#"
              onClick={(event) => event.preventDefault()}
              indentLevel={level}
              activated={active}
              description="Section description"
            >{`Level ${level} ${active ? "active" : "inactive"}`}</AnchorItem>
          ))
        )}
      </Anchor>
      <AnchorItem
        asChild
        activated
        description="自定义链接描述"
        ref={setHost}
        onClick={() => setClicks((value) => value + 1)}
      >
        <a
          href="#details"
          onClick={(event) => {
            event.preventDefault();
            setChildClicks((value) => value + 1);
          }}
        >
          组合链接
        </a>
      </AnchorItem>
      <output>{`父事件 ${clicks} · 子事件 ${childClicks} · 宿主 ${host?.tagName ?? "未挂载"}`}</output>
    </div>
  );
}
export const ProjectModes: Story = {
  render: function ProjectModesStory() {
    const [target, setTarget] = useState<HTMLDivElement | null>(null);
    return (
      <div ref={setTarget}>
        {target && (
          <ThemeProvider
            project={anchorProject}
            projectTarget={target}
            defaultMode="light"
            storageKey="anchor-project"
          >
            <AnchorCases />
          </ThemeProvider>
        )}
      </div>
    );
  },
};

const demoItems: {
  label: string;
  indentLevel: AnchorIndentLevel;
  activated: boolean;
}[] = [
  { label: "Getting started", indentLevel: 0, activated: true },
  { label: "Installation", indentLevel: 0, activated: false },
  { label: "Quick start", indentLevel: 1, activated: false },
  { label: "Configuration", indentLevel: 2, activated: false },
  { label: "Advanced", indentLevel: 3, activated: false },
];

export const Default: Story = {
  render: () => (
    <Anchor aria-label="Page sections" className="w-[200px]">
      {demoItems.map((item) => (
        <AnchorItem
          key={item.label}
          href="#"
          activated={item.activated}
          indentLevel={item.indentLevel}
        >
          {item.label}
        </AnchorItem>
      ))}
    </Anchor>
  ),
};

export const AllInactive: Story = {
  render: () => (
    <Anchor aria-label="Page sections" className="w-[200px]">
      {demoItems.map((item) => (
        <AnchorItem key={item.label} href="#" indentLevel={item.indentLevel}>
          {item.label}
        </AnchorItem>
      ))}
    </Anchor>
  ),
};

export const IndentMatrix: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      {indentLevels.map((indentLevel) => (
        <div key={indentLevel} className="flex flex-col gap-2">
          <span className="font-mono text-xs text-muted-foreground">
            indent {indentLevel}
          </span>
          <Anchor
            aria-label={`Indent level ${indentLevel}`}
            className="w-[200px]"
          >
            <AnchorItem href="#" indentLevel={indentLevel} activated>
              Active
            </AnchorItem>
            <AnchorItem href="#" indentLevel={indentLevel}>
              Inactive
            </AnchorItem>
          </Anchor>
        </div>
      ))}
    </div>
  ),
};

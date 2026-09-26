import type { Meta, StoryObj } from "@storybook/react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbSeparator } from "./breadcrumb";
import { Button } from "./button";
import { Pagehead } from "./pagehead";
import { useState, type CSSProperties } from "react";
import { ThemeProvider, useTheme } from "../theme/theme-provider";
import { parseProject } from "@aviala-design/tokens/project";
import project from "../../../tokens/source/theme-engine/ald.project.json";

const meta: Meta<typeof Pagehead> = {
  title: "Structure Navigation/Pagehead",
  component: Pagehead,
  tags: ["autodocs"],
};
export default meta;

const pageheadProject = parseProject(JSON.stringify(project));
function PageheadCases() {
  const { mode, setMode, density, setDensity } = useTheme();
  const [custom, setCustom] = useState(false);
  const [legacy, setLegacy] = useState(false);
  const [clicks, setClicks] = useState(0);
  const [narrow, setNarrow] = useState(false);
  const [rtl, setRtl] = useState(false);
  return <div className="flex flex-col gap-6">
    <div className="flex gap-4">
      <Button onClick={() => setMode(mode === "light" ? "dark" : "light")}>外观：{mode}</Button>
      <Button onClick={() => setDensity(density === "default" ? "mobile-friendly" : "default")}>密度：{density}</Button>
      <Button onClick={() => setCustom(!custom)}>覆盖：{custom ? "ON" : "OFF"}</Button>
      <Button onClick={() => setLegacy(!legacy)}>旧覆盖：{legacy ? "ON" : "OFF"}</Button>
      <Button onClick={() => setNarrow(!narrow)}>窄屏：{narrow ? "ON" : "OFF"}</Button>
      <Button onClick={() => setRtl(!rtl)}>方向：{rtl ? "RTL" : "LTR"}</Button>
    </div>
    <Pagehead title={<strong>Page title</strong>} description="Supporting description"
      breadcrumb={<Breadcrumb><BreadcrumbItem href="#">Home</BreadcrumbItem><BreadcrumbSeparator/><BreadcrumbItem current>Page</BreadcrumbItem></Breadcrumb>}
      back={<Button onClick={() => setClicks(value => value + 1)}>返回</Button>}
      actions={<><Button>分享</Button><Button>设置</Button></>}
      style={{ ...(custom ? {
        "--pagehead-size-gap": "17px", "--pagehead-size-padding-x": "23px",
        "--pagehead-size-padding-y": "3px", "--pagehead-size-heading-gap": "9px",
        "--pagehead-size-heading-padding-x": "5px", "--pagehead-size-heading-padding-y": "7px",
        "--pagehead-size-title-gap": "11px", "--pagehead-size-title-radius": "8px",
        "--pagehead-size-action-gap": "13px", "--pagehead-size-action-padding-x": "6px",
        "--pagehead-size-action-padding-y": "12px", "--pagehead-size-text-padding-x-start": "15px",
        "--pagehead-size-stroke-width": "3px", "--pagehead-color-text-default": "#123456",
        "--pagehead-color-description-default": "#705020",
      } : {}), ...(legacy ? {"--pagehead-gap": "4px", "--pagehead-px": "8px", "--pagehead-title-pl": "2px", "--pagehead-actions-gap": "3px"} : {}) } as CSSProperties}
    />
    <output>返回次数：{clicks}</output>
    <div dir={rtl ? "rtl" : "ltr"} style={{width: narrow ? 320 : "100%"}}>
      {(["display", "headline1", "headline2", "title", "subtitle", "text", "caption"] as const).map(level =>
        <Pagehead key={level} data-level={level} titleLevel={level} titleAs="h2"
          title={narrow ? "ProjectConfigurationWithoutAnyWordBreaksForLayoutVerification" : level}
          description="Supporting description" back={<Button>返回</Button>}
          actions={<Button>操作</Button>}
          style={custom ? {"--pagehead-color-heading-default":"#603080", "--pagehead-color-text-default":"#123456", "--pagehead-color-description-default":"#705020"} as CSSProperties : undefined}
        />
      )}
    </div>
  </div>;
}
export const ProjectModes: StoryObj<typeof Pagehead> = {
  render: function ProjectModesStory() {
    const [target, setTarget] = useState<HTMLDivElement | null>(null);
    return <div ref={setTarget}>{target && <ThemeProvider project={pageheadProject} projectTarget={target} defaultMode="light" storageKey="pagehead-project"><PageheadCases/></ThemeProvider>}</div>;
  },
};

export const Default: StoryObj<typeof Pagehead> = {
  args: {
    title: "Page title",
    description: "Supporting description for this page.",
    breadcrumb: (
      <Breadcrumb>
        <BreadcrumbItem href="#">Home</BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem current>Page</BreadcrumbItem>
      </Breadcrumb>
    ),
    actions: (
      <Button mode="primary" size="small">
        Action
      </Button>
    ),
  },
};

import type { Meta, StoryObj } from "@storybook/react";
import { Steps, StepsItem } from "./steps";
import { useState, type CSSProperties } from "react";
import { Button } from "./button";
import { ThemeProvider, useTheme } from "../theme/theme-provider";
import { parseProject } from "@aviala-design/tokens/project";
import project from "../../../tokens/source/theme-engine/ald.project.json";

const meta: Meta<typeof Steps> = {
  title: "Structure Navigation/Steps",
  component: Steps,
  tags: ["autodocs"],
};
export default meta;

const stepsProject = parseProject(JSON.stringify(project));
function StepsCases() {
  const { mode, setMode, density, setDensity } = useTheme();
  const [custom, setCustom] = useState(false);
  const [legacy, setLegacy] = useState(false);
  const [narrow, setNarrow] = useState(false);
  const [rtl, setRtl] = useState(false);
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
        <Button onClick={() => setLegacy(!legacy)}>
          旧覆盖：{legacy ? "ON" : "OFF"}
        </Button>
        <Button onClick={() => setNarrow(!narrow)}>
          长内容窄屏：{narrow ? "ON" : "OFF"}
        </Button>
        <Button onClick={() => setRtl(!rtl)}>
          方向：{rtl ? "RTL" : "LTR"}
        </Button>
      </div>
      {(["horizontal", "vertical"] as const).map((direction) => (
        <Steps
          key={direction}
          direction={direction}
          dir={rtl ? "rtl" : "ltr"}
          style={
            {
              width: narrow ? 320 : undefined,
              ...(custom
                ? {
                    "--steps-size-horizontal-gap": "19px",
                    "--steps-size-vertical-gap": "23px",
                    "--steps-item-size-gap": "11px",
                    "--steps-item-size-text-gap": "5px",
                    "--steps-icon-size-width": "30px",
                    "--steps-icon-size-icon-width": "18px",
                    "--steps-icon-size-radius": "7px",
                    "--steps-icon-size-stroke-width": "3px",
                    "--steps-item-color-done-text-default": "#123456",
                    "--steps-item-color-done-description-default": "#705020",
                    "--steps-icon-color-done-icon-default": "#603080",
                  }
                : {}),
              ...(legacy
                ? {
                    "--steps-gap": "7px",
                    "--steps-icon-size": "26px",
                    "--steps-done-fg": "#204060",
                  }
                : {}),
            } as CSSProperties
          }
        >
          {(
            [
              "done",
              "fail",
              "warning",
              "waiting",
              "inProgress",
              "default",
            ] as const
          ).map((state, index) => (
            <StepsItem
              key={state}
              state={state}
              title={
                narrow
                  ? `${state}: ProjectConfigurationWithoutWordBreaks`
                  : state
              }
              description={
                narrow
                  ? "Long supporting description to verify wrapping and reading order."
                  : "Description"
              }
              index={index + 1}
            />
          ))}
        </Steps>
      ))}
    </div>
  );
}
export const ProjectModes: StoryObj<typeof Steps> = {
  render: function ProjectModesStory() {
    const [target, setTarget] = useState<HTMLDivElement | null>(null);
    return (
      <div ref={setTarget}>
        {target && (
          <ThemeProvider
            project={stepsProject}
            projectTarget={target}
            defaultMode="light"
            storageKey="steps-project"
          >
            <StepsCases />
          </ThemeProvider>
        )}
      </div>
    );
  },
};

export const Horizontal: StoryObj<typeof Steps> = {
  render: () => (
    <Steps direction="horizontal" style={{ width: 388 }}>
      <StepsItem state="done" title="Done" description="Completed" index={1} />
      <StepsItem
        state="inProgress"
        title="In progress"
        description="Working"
        index={2}
      />
      <StepsItem state="default" title="Next" description="Waiting" index={3} />
    </Steps>
  ),
};

export const Vertical: StoryObj<typeof Steps> = {
  render: () => (
    <Steps direction="vertical">
      <StepsItem state="done" title="Done" index={1} />
      <StepsItem state="fail" title="Failed" index={2} />
      <StepsItem state="warning" title="Warning" index={3} />
      <StepsItem state="waiting" title="Waiting" index={4} />
      <StepsItem state="inProgress" title="In progress" index={5} />
      <StepsItem state="default" title="Default" index={6} />
    </Steps>
  ),
};

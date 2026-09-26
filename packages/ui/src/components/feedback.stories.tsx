import type { Meta, StoryObj } from "@storybook/react";
import { useState, type CSSProperties } from "react";
import { GeneralNotification } from "@aviala-design/icons";
import { Button } from "./button";
import { ThemeProvider, useTheme } from "../theme/theme-provider";
import { parseProject } from "@aviala-design/tokens/project";
import project from "../../../tokens/source/theme-engine/ald.project.json";
import {
  Feedback,
  type FeedbackMode,
  type FeedbackSize,
  type FeedbackType,
} from "./feedback";

const feedbackProject = parseProject(JSON.stringify(project));
function FeedbackCases() {
  const { mode, setMode, density, setDensity } = useTheme();
  const [custom, setCustom] = useState(false);
  const [legacy, setLegacy] = useState(false);
  const [narrow, setNarrow] = useState(false);
  const [rtl, setRtl] = useState(false);
  const [clicks, setClicks] = useState(0);
  return (
    <div className="flex flex-col gap-4">
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
          窄屏：{narrow ? "ON" : "OFF"}
        </Button>
        <Button onClick={() => setRtl(!rtl)}>
          方向：{rtl ? "RTL" : "LTR"}
        </Button>
      </div>
      <output>操作次数：{clicks}</output>
      {(
        ["information", "warning", "wrong", "success", "normal"] as const
      ).flatMap((type) =>
        (["default", "small"] as const).flatMap((size) =>
          (type === "normal"
            ? (["default"] as const)
            : (["default", "primary"] as const)
          ).map((feedbackMode) => (
            <Feedback
              key={`${type}-${size}-${feedbackMode}`}
              type={type}
              size={size}
              mode={feedbackMode}
              title={
                narrow
                  ? `${type}: LongTitleWithoutWordBreaksForLayoutVerification`
                  : `${type} ${size} ${feedbackMode}`
              }
              description="Supporting details"
              dir={rtl ? "rtl" : "ltr"}
              action={
                narrow
                  ? "QuickActionWithoutWordBreaksForLayoutVerification"
                  : "操作"
              }
              onAction={() => setClicks((v) => v + 1)}
              onClose={() => setClicks((v) => v + 1)}
              style={
                {
                  width: narrow ? 320 : undefined,
                  ...(custom
                    ? {
                        "--feedback-size-info-gap": "13px",
                        "--feedback-size-info-padding-x": "17px",
                        "--feedback-size-info-padding-y": "11px",
                        "--feedback-size-icon-width": "26px",
                        "--feedback-size-icon-height": "30px",
                        "--feedback-size-text-gap": "5px",
                        "--feedback-color-default-text-default": "#123456",
                        "--feedback-color-primary-text-default": "#123456",
                        "--feedback-color-default-description-default":
                          "#705020",
                        "--feedback-color-primary-description-default":
                          "#705020",
                        "--feedback-color-primary-wrong-default-icon-default":
                          "#603080",
                        "--feedback-color-primary-wrong-small-icon-default":
                          "#204060",
                      }
                    : {}),
                  ...(legacy
                    ? {
                        "--feedback-body-gap": "7px",
                        "--feedback-icon-slot-height": "24px",
                        "--feedback-title-fg-default": "#406020",
                        "--feedback-title-fg-primary": "#406020",
                        "--feedback-icon-fg-primary": "#406020",
                        "--feedback-close-fg-on-primary": "#603080",
                      }
                    : {}),
                } as CSSProperties
              }
            />
          ))
        )
      )}
      <Feedback
        title={<span>Title without description</span>}
        showClose={false}
        style={
          {
            "--feedback-title-fg-default": "#123456",
            "--feedback-description-fg-default": "#705020",
          } as CSSProperties
        }
      />
      <Feedback
        title="Custom notification icon"
        icon={
          <GeneralNotification
            mode="default"
            thickness="Light"
            data-feedback-custom-icon="true"
          />
        }
        showClose={false}
      />
    </div>
  );
}

export const ProjectModes: StoryObj<typeof Feedback> = {
  render: function FeedbackProjectStory() {
    const [target, setTarget] = useState<HTMLDivElement | null>(null);
    return (
      <div ref={setTarget}>
        {target && (
          <ThemeProvider
            project={feedbackProject}
            projectTarget={target}
            defaultMode="light"
            storageKey="feedback-project"
          >
            <FeedbackCases />
          </ThemeProvider>
        )}
      </div>
    );
  },
};

const meta: Meta<typeof Feedback> = {
  title: "Response And Feedback/Feedback",
  component: Feedback,
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: "select",
      options: [
        "information",
        "warning",
        "wrong",
        "success",
        "normal",
      ] satisfies FeedbackType[],
    },
    size: {
      control: "select",
      options: ["default", "small"] satisfies FeedbackSize[],
    },
    mode: {
      control: "select",
      options: ["default", "primary"] satisfies FeedbackMode[],
    },
    showClose: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Feedback>;

export const Default: Story = {
  args: {
    type: "information",
    size: "default",
    mode: "default",
    title: "Information",
    description: "Supporting details for this message.",
    showClose: true,
  },
};

export const Primary: Story = {
  args: {
    type: "success",
    size: "default",
    mode: "primary",
    title: "Saved",
    description: "Your changes were saved successfully.",
    showClose: true,
  },
};

export const SmallPill: Story = {
  args: {
    type: "warning",
    size: "small",
    mode: "default",
    title: "Check your input",
    showClose: true,
  },
};

export const WithAction: Story = {
  args: {
    type: "wrong",
    size: "default",
    mode: "default",
    title: "Upload failed",
    description: "The file could not be uploaded.",
    action: "Retry",
    showClose: true,
  },
};

const semanticTypes: FeedbackType[] = [
  "information",
  "warning",
  "wrong",
  "success",
  "normal",
];

export const TypeMatrixDefault: Story = {
  render: () => (
    <div className="flex w-[420px] flex-col gap-4">
      {semanticTypes.map((type) => (
        <Feedback
          key={type}
          type={type}
          size="default"
          mode="default"
          title={`${type.charAt(0).toUpperCase()}${type.slice(1)}`}
          description="Secondary caption text"
        />
      ))}
    </div>
  ),
};

export const TypeMatrixPrimary: Story = {
  render: () => (
    <div className="flex w-[420px] flex-col gap-4">
      {(["information", "warning", "wrong", "success"] as FeedbackType[]).map(
        (type) => (
          <Feedback
            key={type}
            type={type}
            size="default"
            mode="primary"
            title={`${type.charAt(0).toUpperCase()}${type.slice(1)}`}
            description="Secondary caption text"
          />
        )
      )}
    </div>
  ),
};

export const SizeComparison: Story = {
  render: () => (
    <div className="flex w-[420px] flex-col gap-6">
      <Feedback
        type="information"
        size="default"
        mode="default"
        title="Default size"
        description="Two-line typeface layout"
      />
      <Feedback
        type="information"
        size="small"
        mode="default"
        title="Small pill"
      />
      <Feedback
        type="information"
        size="small"
        mode="primary"
        title="Small primary pill"
      />
    </div>
  ),
};

export const WithoutClose: Story = {
  args: {
    type: "success",
    size: "small",
    mode: "primary",
    title: "Copied to clipboard",
    showClose: false,
  },
};

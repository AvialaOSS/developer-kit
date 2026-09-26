import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { ThemeProvider, useTheme } from "../theme/theme-provider";
import { Button } from "./button";
import { parseProject } from "@aviala-design/tokens/project";
import standardProject from "../../../tokens/source/theme-engine/ald.project.json";
import { Upload } from "./upload";

const meta: Meta<typeof Upload> = {
  title: "Information Collect/Upload",
  component: Upload,
  tags: ["autodocs"],
  argTypes: {
    style: { control: "select", options: ["default", "large"] },
    disabled: { control: "boolean" },
    multiple: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Upload>;

const uploadProject = parseProject(JSON.stringify(standardProject));
function UploadModeCases() {
  const { mode, setMode, density, setDensity, effects, setEffects } =
    useTheme();
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
        <Button onClick={() => setEffects(!effects)}>
          效果：{effects ? "ON" : "OFF"}
        </Button>
      </div>
      {(["default", "large"] as const).flatMap((style) =>
        [false, true].map((disabled) => (
          <Upload
            key={`${style}-${disabled}`}
            style={style}
            disabled={disabled}
            label={`${style}-${disabled}`}
            title={`${style}-${disabled}`}
          />
        ))
      )}
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
            project={uploadProject}
            projectTarget={target}
            defaultMode="light"
            storageKey="upload-project-modes"
          >
            <UploadModeCases />
          </ThemeProvider>
        )}
      </div>
    );
  },
};

export const ContainerTokens: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <Upload label="Default spacing" />
      <div
        style={
          {
            "--upload-size-padding-x": "17px",
            "--upload-size-padding-y": "9px",
            "--upload-size-gap": "5px",
          } as React.CSSProperties
        }
      >
        <Upload label="Custom spacing" />
        <Upload style="large" title="Large spacing" />
      </div>
    </div>
  ),
};

export const Default: Story = {
  args: { style: "default", label: "Upload" },
};

export const Large: Story = {
  args: { style: "large" },
  decorators: [
    (Story) => (
      <div style={{ width: 331 }}>
        <Story />
      </div>
    ),
  ],
};

export const Disabled: Story = {
  args: { style: "default", disabled: true },
};

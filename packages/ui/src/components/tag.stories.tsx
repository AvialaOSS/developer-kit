import type { Meta, StoryObj } from "@storybook/react";
import { Tag } from "./tag";
import { useState, type CSSProperties } from "react";
import { ThemeProvider, useTheme } from "../theme/theme-provider";
import { Button } from "./button";
import { UsersUserCircle } from "@aviala-design/icons";
import { parseProject } from "@aviala-design/tokens/project";
import standardProject from "../../../tokens/source/theme-engine/ald.project.json";

const meta: Meta<typeof Tag> = {
  title: "Information Display/Tag",
  component: Tag,
  tags: ["autodocs"],
  argTypes: {
    level: { control: "select", options: ["caption", "text"] },
    content: { control: "select", options: ["text", "people"] },
    disabled: { control: "boolean" },
    closable: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Tag>;

const tagProject = parseProject(JSON.stringify(standardProject));
function TagModeCases() {
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
      {(["caption", "text"] as const).flatMap((level) =>
        (["text", "people"] as const).map((content) => (
          <div key={`${level}-${content}`} className="flex gap-6 items-center">
            {[false, true].flatMap((disabled) =>
              [false, true].map((fix) => (
                <Tag
                  key={`${disabled}-${fix}`}
                  aria-label={`${level}-${content}-${disabled}-${fix}`}
                  level={level}
                  content={content}
                  disabled={disabled}
                  lineHeightFix={fix}
                  leftIcon={<UsersUserCircle />}
                  closable
                >
                  Kai
                </Tag>
              ))
            )}
          </div>
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
            project={tagProject}
            projectTarget={target}
            defaultMode="light"
            storageKey="tag-project-modes"
          >
            <TagModeCases />
          </ThemeProvider>
        )}
      </div>
    );
  },
};

export const Default: Story = {
  args: { children: "Text", closable: true },
};

export const People: Story = {
  args: { content: "people", children: "Kai", avatarText: "K", closable: true },
};

export const Disabled: Story = {
  args: { children: "Text", disabled: true, closable: true },
};

export const PaddingOverrides: Story = {
  render: () => (
    <div
      style={
        {
          "--tag-size-caption-align-to-text-level-padding-x": "7px",
          "--tag-size-caption-align-to-text-level-padding-y": "9px",
          "--tag-size-caption-padding-x": "11px",
          "--tag-size-caption-padding-y": "3px",
        } as CSSProperties
      }
      className="flex gap-6"
    >
      <Tag aria-label="独立内外间距" closable>
        Kai
      </Tag>
      <Tag
        aria-label="旧横向间距"
        style={{ "--tag-px": "5px" } as CSSProperties}
        closable
      >
        Kai
      </Tag>
      <Tag aria-label="关闭外层对齐" lineHeightFix={false} closable>
        Kai
      </Tag>
    </div>
  ),
};

export const CloseInForm: Story = {
  render: function CloseInFormStory() {
    const [closed, setClosed] = useState(0);
    const [submitted, setSubmitted] = useState(0);
    const [rtl, setRtl] = useState(false);
    return (
      <form
        dir={rtl ? "rtl" : "ltr"}
        onSubmit={(event) => {
          event.preventDefault();
          setSubmitted((n) => n + 1);
        }}
        className="flex flex-col items-start gap-6"
      >
        <Button type="button" onClick={() => setRtl(!rtl)}>
          方向：{rtl ? "RTL" : "LTR"}
        </Button>
        <Tag
          closable
          closeLabel="关闭标签"
          onClose={() => setClosed((n) => n + 1)}
        >
          Kai
        </Tag>
        <Tag
          closable
          disabled
          closeLabel="关闭禁用标签"
          onClose={() => setClosed((n) => n + 1)}
        >
          Ada
        </Tag>
        <Button type="submit">提交表单</Button>
        <output>
          关闭次数：{closed}；提交次数：{submitted}
        </output>
      </form>
    );
  },
};

export const OpacityOverrides: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div
        style={
          {
            "--tag-transparency-normal": 0.8,
            "--tag-transparency-disabled": 0.25,
          } as CSSProperties
        }
        className="flex gap-6"
      >
        <Tag
          aria-label="正常内容透明度"
          leftIcon={<UsersUserCircle />}
          closable
        >
          Kai
        </Tag>
        <Tag
          aria-label="禁用内容透明度"
          leftIcon={<UsersUserCircle />}
          disabled
          closable
        >
          Kai
        </Tag>
        <Tag aria-label="禁用头像保持原样" content="people" disabled closable>
          Kai
        </Tag>
      </div>
      <div
        style={
          {
            "--tag-disabled-opacity": 0.4,
            "--tag-transparency-disabled": 0.25,
          } as CSSProperties
        }
      >
        <Tag
          aria-label="旧透明度覆盖"
          leftIcon={<UsersUserCircle />}
          disabled
          closable
        >
          Kai
        </Tag>
      </div>
    </div>
  ),
};

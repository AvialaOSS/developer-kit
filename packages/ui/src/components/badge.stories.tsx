import type { Meta, StoryObj } from "@storybook/react";
import { Badge, type BadgeLevel, type BadgeStyle } from "./badge";
import { GeneralSetting } from "@aviala-design/icons";
import { useState, type CSSProperties } from "react";
import { parseProject } from "@aviala-design/tokens/project";
import standardProject from "../../../tokens/source/theme-engine/ald.project.json";
import { ThemeProvider, useTheme } from "../theme/theme-provider";
import { Button } from "./button";
import { Input } from "./input";
import { NumberInput } from "./number-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectItemGroup,
  SelectTrigger,
} from "./select";
import {
  Cascader,
  CascaderColumn,
  CascaderContent,
  CascaderItem,
  CascaderItemGroup,
  CascaderMenu,
  CascaderTrigger,
} from "./cascader";
import { ColorPickerPanel } from "./color-picker/color-picker-panel";
import { Table, TableCell, TableHead, TableRow } from "./table";

const meta: Meta<typeof Badge> = {
  title: "Information Display/Badge",
  component: Badge,
  tags: ["autodocs"],
  argTypes: {
    style: {
      control: "select",
      options: [
        "theme",
        "info",
        "fail",
        "warning",
        "success",
        "normal",
      ] satisfies BadgeStyle[],
    },
    level: {
      control: "select",
      options: ["caption", "text"] satisfies BadgeLevel[],
    },
    primary: { control: "boolean" },
    lineHeightFix: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

const badgeProject = parseProject(JSON.stringify(standardProject));
const badgeCssOptions = {
  remTokenIds: badgeProject.tokens
    .filter(
      (token) =>
        token.type === "number" &&
        token.unit === "px" &&
        ["size", "line-height"].includes(token.path[0]!)
    )
    .map((token) => token.id),
};

function BadgeModeCases() {
  const { mode, setMode, density, setDensity, effects, setEffects } =
    useTheme();
  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4">
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
      {(["caption", "text"] as const).flatMap((level) =>
        ([false, true] as const).flatMap((primary) =>
          ([false, true] as const).map((lineHeightFix) => (
            <div
              key={level + primary + lineHeightFix}
              className="flex flex-wrap items-center gap-4"
            >
              {(
                [
                  "theme",
                  "info",
                  "fail",
                  "warning",
                  "success",
                  "normal",
                ] as const
              ).map((style) => (
                <Badge
                  key={style}
                  style={style}
                  level={level}
                  primary={primary}
                  lineHeightFix={lineHeightFix}
                  leftIcon={<GeneralSetting />}
                  rightIcon={<GeneralSetting />}
                >
                  {level} {style} {primary ? "primary" : "secondary"}{" "}
                  {lineHeightFix ? "aligned" : "off"}
                </Badge>
              ))}
            </div>
          ))
        )
      )}
      <div
        style={
          {
            "--badge-bg": "rgb(180, 150, 120)",
            "--badge-fg": "rgb(40, 90, 60)",
            "--badge-icon-size": "19px",
            "--badge-icon-slot-height": "23px",
          } as CSSProperties
        }
      >
        <Badge leftIcon={<GeneralSetting />} rightIcon={<GeneralSetting />}>
          旧覆盖
        </Badge>
      </div>
    </div>
  );
}

export const ProjectModes: Story = {
  render: () => {
    const [target, setTarget] = useState<HTMLDivElement | null>(null);
    return (
      <div
        ref={setTarget}
        style={{
          padding: 24,
          background: "var(--box-box-normal-background-white1)",
        }}
      >
        {target && (
          <ThemeProvider
            project={badgeProject}
            projectCssOptions={badgeCssOptions}
            projectTarget={target}
            storageKey="badge-project-demo"
          >
            <BadgeModeCases />
          </ThemeProvider>
        )}
      </div>
    );
  },
};

export const EmbeddedInputs: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-4">
      <Input
        aria-label="带徽标文本框"
        defaultValue="Theme Engine"
        leftBadge="项目"
        rightBadge={
          <Badge style="success" primary>
            已发布
          </Badge>
        }
      />
      <NumberInput
        aria-label="带徽标数值框"
        defaultValue={12}
        leftBadge={<Badge style="normal">宽度</Badge>}
        rightBadge="px"
      />
      <Input
        aria-label="禁用徽标文本框"
        defaultValue="只读状态"
        leftBadge="状态"
        disabled
      />
    </div>
  ),
};

export const EmbeddedConsumers: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-4">
      <Select defaultValue="draft">
        <SelectTrigger aria-label="徽标选择器" className="w-full" />
        <SelectContent>
          <SelectItemGroup>
            <SelectItem value="draft" showBadge badge="草稿">
              设计项目
            </SelectItem>
            <SelectItem
              value="published"
              showBadge
              badge={
                <Badge style="success" primary>
                  已发布
                </Badge>
              }
            >
              标准项目
            </SelectItem>
          </SelectItemGroup>
        </SelectContent>
      </Select>
      <Cascader>
        <CascaderTrigger
          aria-label="徽标级联选择器"
          placeholder="选择项目"
          className="w-full"
        />
        <CascaderContent>
          <CascaderMenu>
            <CascaderColumn>
              <CascaderItemGroup>
                <CascaderItem
                  value="theme"
                  pathPrefix={[]}
                  showBadge
                  badge="推荐"
                >
                  主题项目
                </CascaderItem>
                <CascaderItem
                  value="archive"
                  pathPrefix={[]}
                  showBadge
                  badge="旧版"
                >
                  归档项目
                </CascaderItem>
              </CascaderItemGroup>
            </CascaderColumn>
          </CascaderMenu>
        </CascaderContent>
      </Cascader>
      <ColorPickerPanel
        defaultValue="#FF5532"
        showEyedropper={false}
        showPresets={false}
      />
      <Table>
        <TableRow header>
          <TableHead>发布状态</TableHead>
        </TableRow>
        <TableRow>
          <TableCell content="badge" badgeLabel="已发布" />
        </TableRow>
      </Table>
    </div>
  ),
};

export const NarrowConsumers: Story = {
  render: () => (
    <div className="flex w-48 flex-col gap-4">
      <Input
        aria-label="窄文本框"
        defaultValue="Very long project name with editable content"
        leftBadge="项目"
        rightBadge="已发布"
      />
      <NumberInput
        aria-label="窄数值框"
        defaultValue={123456}
        leftBadge="宽度"
        rightBadge="px"
      />
      <div className="overflow-auto" aria-label="长徽标滚动容器">
        <Badge leftIcon={<GeneralSetting />} rightIcon={<GeneralSetting />}>
          Very long project status / 这是一个很长的状态标签
        </Badge>
      </div>
    </div>
  ),
};

export const ComponentGeometry: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      {(["caption", "text"] as const).flatMap((level) =>
        ([false, true] as const).map((lineHeightFix) => (
          <div key={level + lineHeightFix} className="flex items-center gap-4">
            {(["theme", "normal", "warning"] as const).map((style) => (
              <Badge
                key={style}
                style={style}
                level={level}
                lineHeightFix={lineHeightFix}
                leftIcon={<GeneralSetting />}
                rightIcon={<GeneralSetting />}
              >
                {level} {style} {lineHeightFix ? "aligned" : "off"}
              </Badge>
            ))}
          </div>
        ))
      )}
      <div
        style={
          {
            "--badge-size-caption-padding-x": "9px",
            "--badge-size-caption-padding-y": "3px",
            "--badge-size-caption-align-to-text-level-padding-x": "5px",
            "--badge-size-caption-align-to-text-level-padding-y": "4px",
            "--badge-size-caption-gap": "7px",
            "--badge-size-radius": "11px",
            "--badge-size-caption-icon-width": "20px",
            "--badge-size-caption-icon-container-height": "24px",
            "--badge-color-theme-secondary-background-default":
              "rgb(150, 180, 210)",
          } as CSSProperties
        }
      >
        <Badge leftIcon={<GeneralSetting />}>新尺寸覆盖</Badge>
      </div>
      <div
        style={
          {
            "--badge-px": "8px",
            "--badge-gap": "6px",
            "--badge-radius": "10px",
            "--badge-icon-size": "19px",
            "--badge-icon-slot-height": "23px",
            "--badge-bg": "rgb(180, 150, 120)",
          } as CSSProperties
        }
      >
        <Badge leftIcon={<GeneralSetting />}>旧尺寸覆盖</Badge>
      </div>
    </div>
  ),
};

export const ComponentColors: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      {(["caption", "text"] as const).flatMap((level) =>
        ([false, true] as const).map((primary) => (
          <div key={level + primary} className="flex gap-4">
            {(
              ["theme", "info", "fail", "warning", "success", "normal"] as const
            ).map((style) => (
              <Badge
                key={style}
                style={style}
                level={level}
                primary={primary}
                leftIcon={<GeneralSetting />}
              >
                {level} {style} {primary ? "primary" : "secondary"}
              </Badge>
            ))}
          </div>
        ))
      )}
      <div
        style={
          {
            "--badge-color-caption-theme-secondary-text-default":
              "rgb(30, 80, 130)",
            "--badge-color-caption-secondary-icon-default": "rgb(140, 50, 90)",
          } as CSSProperties
        }
      >
        <Badge leftIcon={<GeneralSetting />}>独立文字与图标覆盖</Badge>
      </div>
      <div style={{ "--badge-fg": "rgb(40, 90, 60)" } as CSSProperties}>
        <Badge leftIcon={<GeneralSetting />}>旧前景色覆盖</Badge>
      </div>
    </div>
  ),
};

export const Theme: Story = {
  args: { style: "theme", level: "caption", children: "Text" },
};

export const Primary: Story = {
  args: { style: "theme", primary: true, children: "Text" },
};

export const Styles: Story = {
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      {(["theme", "info", "fail", "warning", "success", "normal"] as const).map(
        (style) => (
          <Badge key={style} style={style}>
            {style}
          </Badge>
        )
      )}
    </div>
  ),
};

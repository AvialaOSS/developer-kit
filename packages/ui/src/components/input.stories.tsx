import { GeneralSetting } from "@aviala-design/icons";
import type { Meta, StoryObj } from "@storybook/react";
import { useState, type CSSProperties } from "react";
import { parseProject } from "@aviala-design/tokens/project";
import standardProject from "../../../tokens/source/theme-engine/ald.project.json";
import { ThemeProvider, useTheme } from "../theme/theme-provider";
import { Button } from "./button";
import { NumberInput } from "./number-input";
import { Input, type InputSize } from "./input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectItemGroup,
} from "./select";
import { Cascader, CascaderTrigger } from "./cascader";
import { DatePickerField } from "./date-picker/date-picker";
import { ColorPicker, ColorPickerTrigger } from "./color-picker/color-picker";
import { Textarea } from "./textarea";

const meta: Meta<typeof Input> = {
  title: "Information Collect/Input",
  component: Input,
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["regular", "big"] satisfies InputSize[],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

const inputProject = parseProject(JSON.stringify(standardProject));
const inputCssOptions = {
  remTokenIds: inputProject.tokens
    .filter(
      (token) =>
        token.type === "number" &&
        token.unit === "px" &&
        ["size", "line-height"].includes(token.path[0]!)
    )
    .map((token) => token.id),
};
function InputModeCases() {
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
      {(["regular", "big"] as const).flatMap((size) =>
        [false, true].map((round) => (
          <div key={size + round} className="flex w-80 flex-col gap-3">
            <Input
              size={size}
              allRound={round}
              aria-label={`${size} ${round} filled`}
              defaultValue="Theme Engine"
              leftIcon={<GeneralSetting />}
            />
            <Input
              size={size}
              allRound={round}
              aria-label={`${size} ${round} empty`}
              placeholder="项目名称"
              leftIcon={<GeneralSetting />}
            />
            <Input
              size={size}
              allRound={round}
              aria-label={`${size} ${round} disabled`}
              defaultValue="Disabled"
              leftIcon={<GeneralSetting />}
              disabled
            />
          </div>
        ))
      )}
      <div
        className="w-80"
        style={
          {
            "--input-px-regular": "19px",
            "--input-radius": "15px",
            "--input-fg": "rgb(50, 70, 90)",
            "--input-bg-default": "rgb(210, 190, 170)",
          } as CSSProperties
        }
      >
        <Input aria-label="旧覆盖" defaultValue="Legacy" />
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
            project={inputProject}
            projectCssOptions={inputCssOptions}
            projectTarget={target}
            storageKey="input-project-demo"
          >
            <InputModeCases />
          </ThemeProvider>
        )}
      </div>
    );
  },
};

function SharedConsumerCases() {
  const { mode, setMode, density, setDensity, effects, setEffects } =
    useTheme();
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-4">
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
      {(["regular", "big"] as const).map((size) => (
        <div
          key={size}
          data-consumer-size={size}
          className="flex w-80 max-w-full flex-col gap-4"
        >
          <Select defaultValue="draft">
            <SelectTrigger
              size={size}
              aria-label={`${size} 选择器`}
              leftIcon={<GeneralSetting />}
            />
            <SelectContent>
              <SelectItemGroup>
                <SelectItem value="draft">草稿</SelectItem>
                <SelectItem value="published">已发布</SelectItem>
              </SelectItemGroup>
            </SelectContent>
          </Select>
          <Cascader>
            <CascaderTrigger
              size={size}
              aria-label={`${size} 级联选择器`}
              placeholder="选择项目"
              leftIcon={<GeneralSetting />}
            />
          </Cascader>
          <DatePickerField size={size} aria-label={`${size} 日期`} />
          <ColorPicker defaultValue="#FF5532">
            <ColorPickerTrigger size={size} aria-label={`${size} 颜色`} />
          </ColorPicker>
          <Textarea
            size={size}
            aria-label={`${size} 多行输入`}
            defaultValue="Theme Engine"
            leftIcon={<GeneralSetting />}
          />
        </div>
      ))}
    </div>
  );
}
export const SharedConsumers: Story = {
  render: function SharedConsumersStory() {
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
            project={inputProject}
            projectCssOptions={inputCssOptions}
            projectTarget={target}
            storageKey="shared-input-project-demo"
          >
            <SharedConsumerCases />
          </ThemeProvider>
        )}
      </div>
    );
  },
};

export const ComponentIcons: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-4">
      <Input
        aria-label="默认图标"
        defaultValue="默认组件图标"
        leftIcon={<GeneralSetting />}
        rightIcon={<GeneralSetting />}
      />
      <div
        style={
          {
            "--base-input-size-icon-width": "22px",
            "--base-input-size-icon-height": "30px",
          } as CSSProperties
        }
      >
        <Input
          aria-label="新图标尺寸"
          defaultValue="组件图标覆盖"
          leftIcon={<GeneralSetting />}
        />
        <Input
          aria-label="显式图标档位"
          defaultValue="Caption 优先"
          leftIcon={<GeneralSetting level="caption" biggerSize={false} />}
        />
        <NumberInput
          aria-label="独立数值图标"
          defaultValue={12}
          leftIcon={<GeneralSetting />}
        />
      </div>
      <div
        style={
          {
            "--input-slot-icon-size": "24px",
            "--input-icon-slot-height": "32px",
          } as CSSProperties
        }
      >
        <Input
          aria-label="旧图标尺寸"
          defaultValue="旧图标覆盖"
          leftIcon={<GeneralSetting />}
        />
      </div>
    </div>
  ),
};

export const ComponentColors: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-4">
      <Input
        aria-label="默认颜色"
        defaultValue="默认"
        leftIcon={<GeneralSetting />}
      />
      <div
        style={
          {
            "--base-input-color-background-default": "rgb(220, 230, 240)",
            "--base-input-color-background-active": "rgb(240, 230, 220)",
            "--base-input-color-background-disabled": "rgb(200, 210, 220)",
            "--base-input-color-text-default": "rgb(30, 50, 70)",
            "--base-input-color-icon-default": "rgb(80, 40, 100)",
            "--base-input-color-border-active": "rgb(40, 90, 60)",
            "--base-input-size-border-width": "3px",
            "--base-input-color-shadow-default": "rgb(70, 80, 90)",
          } as CSSProperties
        }
      >
        <Input
          aria-label="组件颜色"
          defaultValue="独立颜色"
          leftIcon={<GeneralSetting />}
        />
        <Input
          aria-label="禁用组件颜色"
          disabled
          defaultValue="禁用"
          leftIcon={<GeneralSetting />}
        />
        <NumberInput aria-label="独立数值颜色" defaultValue={12} />
      </div>
      <div
        style={
          {
            "--input-bg-default": "rgb(210, 190, 170)",
            "--input-fg": "rgb(50, 70, 90)",
          } as CSSProperties
        }
      >
        <Input
          aria-label="旧颜色"
          defaultValue="旧覆盖"
          leftIcon={<GeneralSetting />}
        />
        <NumberInput aria-label="旧数值颜色" defaultValue={12} />
      </div>
    </div>
  ),
};

export const ComponentGeometry: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-4">
      <Input aria-label="默认常规" defaultValue="常规" />
      <Input aria-label="默认大号" size="big" defaultValue="大号" allRound />
      <div
        style={
          {
            "--base-input-size-regular-padding-x": "17px",
            "--base-input-size-regular-padding-y": "3px",
            "--base-input-size-regular-slot-padding-y": "9px",
            "--base-input-size-regular-gap": "11px",
            "--base-input-size-radius": "13px",
          } as CSSProperties
        }
      >
        <Input
          aria-label="新尺寸覆盖"
          defaultValue="新组件 Token"
          leftBadge="项目"
        />
        <NumberInput aria-label="独立数值框" defaultValue={12} />
      </div>
      <div
        style={
          {
            "--input-px-regular": "19px",
            "--input-field-py-regular": "7px",
            "--input-slot-py-regular": "5px",
            "--input-gap-regular": "12px",
            "--input-radius": "15px",
          } as CSSProperties
        }
      >
        <Input aria-label="旧尺寸覆盖" defaultValue="旧覆盖" leftBadge="项目" />
        <NumberInput aria-label="旧数值覆盖" defaultValue={12} />
      </div>
    </div>
  ),
};

export const Empty: Story = {
  args: {
    placeholder: "请输入项目名称",
    leftIcon: <GeneralSetting aria-hidden />,
    rightIcon: <GeneralSetting aria-hidden />,
  },
};

export const Filled: Story = {
  args: {
    defaultValue: "季度经营分析报告",
    leftIcon: <GeneralSetting aria-hidden />,
    rightIcon: <GeneralSetting aria-hidden />,
  },
};

export const EmptyVsFilled: Story = {
  render: () => (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <div className="flex flex-col gap-1">
        <span className="font-mono text-xs text-muted-foreground">
          Empty (placeholder 60%)
        </span>
        <Input
          placeholder="请输入项目名称"
          leftIcon={<GeneralSetting aria-hidden />}
          rightIcon={<GeneralSetting aria-hidden />}
        />
      </div>
      <div className="flex flex-col gap-1">
        <span className="font-mono text-xs text-muted-foreground">
          Filled (100%)
        </span>
        <Input
          defaultValue="季度经营分析报告"
          leftIcon={<GeneralSetting aria-hidden />}
          rightIcon={<GeneralSetting aria-hidden />}
        />
      </div>
    </div>
  ),
};

export const Big: Story = {
  args: {
    size: "big",
    placeholder: "请输入项目名称",
    leftIcon: <GeneralSetting aria-hidden />,
    rightIcon: <GeneralSetting aria-hidden />,
  },
};

export const AllRound: Story = {
  args: {
    allRound: true,
    placeholder: "搜索文档",
    leftIcon: <GeneralSetting aria-hidden />,
    rightIcon: <GeneralSetting aria-hidden />,
  },
};

export const Disabled: Story = {
  args: {
    placeholder: "当前不可编辑",
    disabled: true,
    leftIcon: <GeneralSetting aria-hidden />,
    rightIcon: <GeneralSetting aria-hidden />,
  },
};

export const Error: Story = {
  args: {
    placeholder: "请输入有效的邮箱地址",
    error: true,
    leftIcon: <GeneralSetting aria-hidden />,
  },
};

export const Plain: Story = {
  args: { placeholder: "Email" },
};

const sizes: InputSize[] = ["regular", "big"];

export const SizeMatrix: Story = {
  render: () => (
    <div className="flex w-full max-w-sm flex-col gap-4">
      {sizes.map((size) => (
        <div key={size} className="flex flex-col gap-2">
          <span className="font-mono text-xs text-muted-foreground">
            {size}
          </span>
          <Input
            size={size}
            placeholder="Empty"
            leftIcon={<GeneralSetting aria-hidden />}
            rightIcon={<GeneralSetting aria-hidden />}
          />
          <Input
            size={size}
            defaultValue="Filled"
            leftIcon={<GeneralSetting aria-hidden />}
            rightIcon={<GeneralSetting aria-hidden />}
          />
        </div>
      ))}
    </div>
  ),
};

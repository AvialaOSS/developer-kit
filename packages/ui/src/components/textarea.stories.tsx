import { GeneralSetting } from "@aviala-design/icons";
import type { Meta, StoryObj } from "@storybook/react";
import { Textarea, type TextareaSize } from "./textarea";
import { useState, type CSSProperties } from "react";
import { Input } from "./input";
import { parseProject } from "@aviala-design/tokens/project";
import standardProject from "../../../tokens/source/theme-engine/ald.project.json";
import { ThemeProvider, useTheme } from "../theme/theme-provider";
import { Button } from "./button";
import { FormField } from "./form-field";

const meta: Meta<typeof Textarea> = {
  title: "Information Collect/Textarea",
  component: Textarea,
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["regular", "big"] satisfies TextareaSize[],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Textarea>;

const textareaProject = parseProject(JSON.stringify(standardProject));
const textareaCssOptions = {
  remTokenIds: textareaProject.tokens.filter(token => token.type === "number" && token.unit === "px" && ["size", "line-height"].includes(token.path[0]!)).map(token => token.id),
};
function TextareaModeCases() {
  const { mode, setMode, density, setDensity, effects, setEffects } = useTheme();
  return <div className="flex flex-col gap-4">
    <div className="flex flex-wrap gap-4">
      <Button onClick={() => setMode(mode === "light" ? "dark" : "light")}>颜色：{mode}</Button>
      <Button onClick={() => setDensity(density === "default" ? "mobile-friendly" : "default")}>密度：{density}</Button>
      <Button onClick={() => setEffects(!effects)}>效果：{effects ? "ON" : "OFF"}</Button>
    </div>
    {(["regular", "big"] as const).flatMap(size => [false, true].flatMap(controller => (["filled", "empty", "disabled"] as const).map(state =>
      <Textarea key={`${size}-${controller}-${state}`} className="w-80 max-w-full" size={size}
        aria-label={`${size} ${controller} ${state}`} defaultValue={state === "empty" ? undefined : "Theme Engine"}
        placeholder="输入内容" disabled={state === "disabled"} showController={controller}
        maxLength={200} leftIcon={<GeneralSetting />} rightIcon={<GeneralSetting />} />
    )))}
  </div>;
}
export const ProjectModes: Story = {
  render: function ProjectModesStory() {
    const [target, setTarget] = useState<HTMLDivElement | null>(null);
    return <div ref={setTarget} style={{ padding: 24, background: "var(--box-box-normal-background-white1)" }}>
      {target && <ThemeProvider project={textareaProject} projectCssOptions={textareaCssOptions} projectTarget={target} storageKey="textarea-project-demo"><TextareaModeCases /></ThemeProvider>}
    </div>;
  },
};

export const ComponentTokens: Story = {
  render: () => <div className="flex w-80 flex-col gap-4">
    <Textarea aria-label="默认多行" defaultValue="Theme Engine" leftIcon={<GeneralSetting />} />
    <Textarea aria-label="大号多行" size="big" defaultValue="Theme Engine" leftIcon={<GeneralSetting />} />
    <div style={{ "--textarea-input-size-regular-padding-x": "17px", "--textarea-input-size-regular-padding-y": "3px", "--textarea-input-size-regular-slot-padding-y": "9px", "--textarea-input-size-regular-gap": "11px", "--textarea-input-size-radius": "13px", "--textarea-input-size-icon-width": "22px", "--textarea-input-size-icon-height": "28px", "--textarea-input-color-background-default": "rgb(220, 230, 240)", "--textarea-input-color-text-default": "rgb(30, 50, 70)", "--textarea-input-color-icon-default": "rgb(80, 40, 100)" } as CSSProperties}>
      <Textarea aria-label="多行组件覆盖" defaultValue="独立 Token" leftIcon={<GeneralSetting />} />
      <Input aria-label="相邻单行" defaultValue="Independent" />
    </div>
    <div style={{ "--textarea-radius": "15px", "--input-px-regular": "19px", "--input-fg": "rgb(50, 70, 90)" } as CSSProperties}>
      <Textarea aria-label="旧多行覆盖" defaultValue="Legacy" />
    </div>
  </div>,
};

export const StateTokens: Story = {
  render: function StateTokensStory() {
    const [invalid, setInvalid] = useState(true);
    return <div className="flex w-80 flex-col gap-4" style={{
      "--textarea-input-color-background-active": "rgb(240, 230, 220)",
      "--textarea-input-color-background-disabled": "rgb(200, 210, 220)",
      "--textarea-input-color-border-active": "rgb(40, 90, 60)",
      "--textarea-input-size-border-width": "3px",
      "--textarea-input-color-shadow-default": "rgb(70, 80, 90)",
    } as CSSProperties}>
      <Textarea aria-label="自定义焦点" defaultValue="Focus" maxLength={200} />
      <Textarea aria-label="自定义禁用" defaultValue="Disabled" disabled maxLength={200} />
      <Button onClick={() => setInvalid(value => !value)}>切换表单错误</Button>
      <FormField label="项目说明" htmlFor="textarea-form-description" error={invalid ? "请补充项目说明" : undefined}>
        <Textarea id="textarea-form-description" defaultValue="Description" maxLength={200} />
      </FormField>
      <FormField label="显式覆盖错误" htmlFor="textarea-form-override" error="父级错误">
        <Textarea id="textarea-form-override" error={false} defaultValue="Explicit override" />
      </FormField>
    </div>;
  },
};

export const Empty: Story = {
  args: {
    placeholder: "Text",
    maxLength: 200,
    leftIcon: <GeneralSetting aria-hidden />,
    rightIcon: <GeneralSetting aria-hidden />,
  },
};

export const ControllerTokens: Story = {
  render: () => <div className="flex w-80 flex-col gap-4">
    <Textarea aria-label="默认控制区" defaultValue="Theme" maxLength={200} />
    <div style={{ "--controller-size-padding-x": "7px", "--controller-size-padding-y": "3px", "--controller-size-radius": "9px", "--controller-size-icon-width": "20px", "--controller-size-icon-height": "24px", "--controller-color-background-default": "rgb(220, 230, 240)", "--controller-color-text-default": "rgb(30, 50, 70)", "--controller-color-icon-default": "rgb(80, 40, 100)" } as CSSProperties}>
      <Textarea aria-label="自定义控制区" defaultValue="Theme" maxLength={200} />
    </div>
    <div style={{ "--textarea-controller-bg": "rgb(210, 190, 170)", "--textarea-counter-fg": "rgb(50, 70, 90)" } as CSSProperties}>
      <Textarea aria-label="旧控制区覆盖" defaultValue="Legacy" maxLength={200} />
    </div>
  </div>,
};

export const Filled: Story = {
  args: {
    defaultValue:
      "Excellent experience improves efficiency and stimulates potential. Bring excellent experience, help users improve efficiency, and stimulate potential",
    maxLength: 200,
    leftIcon: <GeneralSetting aria-hidden />,
    rightIcon: <GeneralSetting aria-hidden />,
  },
};

export const Big: Story = {
  args: {
    size: "big",
    placeholder: "Text",
    maxLength: 200,
    leftIcon: <GeneralSetting aria-hidden />,
    rightIcon: <GeneralSetting aria-hidden />,
  },
};

export const Disabled: Story = {
  args: {
    placeholder: "Text",
    maxLength: 200,
    disabled: true,
    leftIcon: <GeneralSetting aria-hidden />,
    rightIcon: <GeneralSetting aria-hidden />,
  },
};

export const Error: Story = {
  args: {
    placeholder: "Text",
    maxLength: 200,
    error: true,
    leftIcon: <GeneralSetting aria-hidden />,
  },
};

export const Plain: Story = {
  args: {
    placeholder: "Tell us about yourself",
  },
};

const sizes: TextareaSize[] = ["regular", "big"];

export const SizeMatrix: Story = {
  render: () => (
    <div className="flex w-full max-w-sm flex-col gap-4">
      {sizes.map((size) => (
        <div key={size} className="flex flex-col gap-2">
          <span className="font-mono text-xs text-muted-foreground">
            {size}
          </span>
          <Textarea
            size={size}
            placeholder="Empty"
            maxLength={200}
            leftIcon={<GeneralSetting aria-hidden />}
            rightIcon={<GeneralSetting aria-hidden />}
          />
          <Textarea
            size={size}
            defaultValue="Filled text area content"
            maxLength={200}
            leftIcon={<GeneralSetting aria-hidden />}
            rightIcon={<GeneralSetting aria-hidden />}
          />
        </div>
      ))}
    </div>
  ),
};

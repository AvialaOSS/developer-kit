import { GeneralSetting } from "@aviala-design/icons";
import type { Meta, StoryObj } from "@storybook/react";
import { useState, type CSSProperties } from "react";
import { Input } from "./input";
import { type InputSize } from "./input";
import { NumberInput, type NumberInputStyle } from "./number-input";
import { parseProject } from "@aviala-design/tokens/project";
import standardProject from "../../../tokens/source/theme-engine/ald.project.json";
import { ThemeProvider, useTheme } from "../theme/theme-provider";
import { Button } from "./button";

const meta: Meta<typeof NumberInput> = {
  title: "Information Collect/NumberInput",
  component: NumberInput,
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["regular", "big"] satisfies InputSize[],
    },
    inputStyle: {
      control: "select",
      options: ["default", "monospaced"] satisfies NumberInputStyle[],
    },
  },
};

export default meta;
type Story = StoryObj<typeof NumberInput>;

const numberProject = parseProject(JSON.stringify(standardProject));
const numberCssOptions = {
  remTokenIds: numberProject.tokens
    .filter(
      (token) =>
        token.type === "number" &&
        token.unit === "px" &&
        ["size", "line-height"].includes(token.path[0]!)
    )
    .map((token) => token.id),
};
function NumberModeCases() {
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
      {(["regular", "big"] as const).flatMap((size) =>
        [false, true].flatMap((round) =>
          (["default", "monospaced"] as const).map((inputStyle) => (
            <div
              key={`${size}-${round}-${inputStyle}`}
              className="flex w-80 max-w-full flex-col gap-3"
            >
              {(["filled", "empty", "disabled"] as const).map((state) => (
                <NumberInput
                  key={state}
                  size={size}
                  allRound={round}
                  inputStyle={inputStyle}
                  aria-label={`${size} ${round} ${inputStyle} ${state}`}
                  defaultValue={state === "empty" ? undefined : 12}
                  placeholder="数量"
                  min={10}
                  max={14}
                  disabled={state === "disabled"}
                  leftIcon={<GeneralSetting />}
                />
              ))}
            </div>
          ))
        )
      )}
      <div
        className="w-80 max-w-full"
        style={
          {
            "--input-px-regular": "19px",
            "--input-radius": "15px",
            "--input-fg": "rgb(50, 70, 90)",
          } as CSSProperties
        }
      >
        <NumberInput aria-label="旧覆盖" defaultValue={12} />
      </div>
    </div>
  );
}
export const ProjectModes: Story = {
  render: function ProjectModesStory() {
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
            project={numberProject}
            projectCssOptions={numberCssOptions}
            projectTarget={target}
            storageKey="number-input-project-demo"
          >
            <NumberModeCases />
          </ThemeProvider>
        )}
      </div>
    );
  },
};

export const ComponentTokens: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-4">
      <NumberInput
        aria-label="常规数值"
        defaultValue={12}
        min={10}
        max={14}
        leftIcon={<GeneralSetting />}
      />
      <NumberInput
        aria-label="大号数值"
        size="big"
        defaultValue={12}
        leftIcon={<GeneralSetting />}
        allRound
      />
      <div
        style={
          {
            "--number-input-size-regular-padding-x": "17px",
            "--number-input-size-regular-padding-y": "3px",
            "--number-input-size-regular-slot-padding-y": "9px",
            "--number-input-size-icon-width": "22px",
            "--number-input-size-icon-height": "28px",
            "--number-input-size-radius": "13px",
            "--number-input-color-background-default": "rgb(220, 230, 240)",
            "--number-input-color-text-default": "rgb(30, 50, 70)",
            "--number-input-color-icon-default": "rgb(80, 40, 100)",
            "--number-input-size-stepper-gap": "2px",
            "--number-input-size-stepper-padding-y": "5px",
          } as CSSProperties
        }
      >
        <NumberInput
          aria-label="数值组件覆盖"
          defaultValue={12}
          leftIcon={<GeneralSetting />}
        />
        <Input aria-label="独立文本框" defaultValue="Independent" />
      </div>
      <div
        style={
          {
            "--input-px-regular": "19px",
            "--input-fg": "rgb(50, 70, 90)",
          } as CSSProperties
        }
      >
        <NumberInput aria-label="旧数值覆盖" defaultValue={12} />
      </div>
    </div>
  ),
};

export const Empty: Story = {
  args: {
    placeholder: "Text",
    leftIcon: <GeneralSetting aria-hidden />,
  },
};

export const Filled: Story = {
  args: {
    defaultValue: 12,
    leftIcon: <GeneralSetting aria-hidden />,
  },
};

export const Monospaced: Story = {
  args: {
    defaultValue: 5,
    inputStyle: "monospaced",
    leftIcon: <GeneralSetting aria-hidden />,
  },
};

export const Big: Story = {
  args: {
    size: "big",
    defaultValue: 12,
    leftIcon: <GeneralSetting aria-hidden />,
  },
};

export const AllRound: Story = {
  args: {
    allRound: true,
    defaultValue: 12,
    leftIcon: <GeneralSetting aria-hidden />,
  },
};

export const Disabled: Story = {
  args: {
    placeholder: "Text",
    disabled: true,
    leftIcon: <GeneralSetting aria-hidden />,
  },
};

export const DisabledFilled: Story = {
  args: {
    defaultValue: 12,
    disabled: true,
    leftIcon: <GeneralSetting aria-hidden />,
  },
};

export const Error: Story = {
  args: {
    defaultValue: 12,
    error: true,
    leftIcon: <GeneralSetting aria-hidden />,
  },
};

export const WithoutControls: Story = {
  args: {
    defaultValue: 42,
    showControls: false,
    leftIcon: <GeneralSetting aria-hidden />,
  },
};

export const MinMaxStep: Story = {
  args: {
    defaultValue: 0,
    min: 0,
    max: 10,
    step: 0.5,
    leftIcon: <GeneralSetting aria-hidden />,
  },
};

export const Controlled: Story = {
  render: function ControlledNumberInput() {
    const [value, setValue] = useState<number | "">(3);
    return (
      <div className="flex w-full max-w-sm flex-col gap-2">
        <NumberInput
          value={value}
          leftIcon={<GeneralSetting aria-hidden />}
          onValueChange={(next) => setValue(next ?? "")}
        />
        <span className="font-mono text-xs text-muted-foreground">
          value: {value === "" ? "(empty)" : value}
        </span>
      </div>
    );
  },
};

const sizes: InputSize[] = ["regular", "big"];
const styles: NumberInputStyle[] = ["default", "monospaced"];

export const SizeMatrix: Story = {
  render: () => (
    <div className="flex w-full max-w-md flex-col gap-6">
      {styles.map((inputStyle) => (
        <div key={inputStyle} className="flex flex-col gap-3">
          <span className="font-mono text-xs text-muted-foreground">
            {inputStyle}
          </span>
          {sizes.map((size) => (
            <div key={`${inputStyle}-${size}`} className="flex flex-col gap-2">
              <span className="font-mono text-xs text-muted-foreground">
                {size}
              </span>
              <NumberInput
                size={size}
                inputStyle={inputStyle}
                placeholder="Empty"
                leftIcon={<GeneralSetting aria-hidden />}
              />
              <NumberInput
                size={size}
                inputStyle={inputStyle}
                defaultValue={12}
                leftIcon={<GeneralSetting aria-hidden />}
              />
              <NumberInput
                size={size}
                inputStyle={inputStyle}
                allRound
                defaultValue={12}
                leftIcon={<GeneralSetting aria-hidden />}
              />
              <NumberInput
                size={size}
                inputStyle={inputStyle}
                defaultValue={12}
                disabled
                leftIcon={<GeneralSetting aria-hidden />}
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  ),
};

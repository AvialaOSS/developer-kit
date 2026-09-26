import { useRef, useState, type CSSProperties } from "react";
import { parseProject } from "@aviala-design/tokens/project";
import standardProject from "../../../tokens/source/theme-engine/ald.project.json";
import { ThemeProvider, useTheme } from "../theme/theme-provider";
import { Button } from "./button";
import * as RadioPrimitive from "@radix-ui/react-radio-group";
import { GeneralSetting } from "@aviala-design/icons";
import type { Meta, StoryObj } from "@storybook/react";
import { RadioGroup, RadioGroupItem, RadioInput } from "./radio-group";
import { Typography } from "./typography";

const meta: Meta<typeof RadioGroup> = {
  title: "Information Collect/Radio",
  component: RadioGroup,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof RadioGroup>;

const radioProject = parseProject(JSON.stringify(standardProject));
const radioCssOptions = {
  remTokenIds: radioProject.tokens
    .filter(
      (token) =>
        token.type === "number" &&
        token.unit === "px" &&
        ["size", "line-height"].includes(token.path[0]!)
    )
    .map((token) => token.id),
};

function RadioModeCases() {
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
      {(["normal", "card"] as const).flatMap((variant) =>
        (["enabled", "disabled", "legacy"] as const).map((state) => (
          <RadioGroup
            key={variant + state}
            defaultValue="a"
            direction="horizontal"
            disabled={state !== "enabled"}
            style={
              state === "legacy"
                ? ({
                    "--radio-disabled-opacity": ".7",
                    "--radio-shadow": "none",
                  } as CSSProperties)
                : undefined
            }
          >
            <RadioInput
              value="a"
              variant={variant}
              title={`${variant} ${state} selected`}
              description="说明颜色"
              icon={<GeneralSetting />}
            />
            <RadioInput
              value="b"
              variant={variant}
              title={`${variant} ${state} unselected`}
              description="说明颜色"
              icon={<GeneralSetting />}
            />
          </RadioGroup>
        ))
      )}
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
            project={radioProject}
            projectCssOptions={radioCssOptions}
            projectTarget={target}
            storageKey="radio-project-demo"
          >
            <RadioModeCases />
          </ThemeProvider>
        )}
      </div>
    );
  },
};

export const KeyboardComparison: Story = {
  render: () => {
    const [events, setEvents] = useState<string[]>([]);
    const eventBuffer = useRef<string[]>([]);
    // Avoid introducing a render between keydown, deferred focus, and keyup.
    const record = (message: string) => {
      eventBuffer.current = [...eventBuffer.current.slice(-23), message];
    };
    return (
      <div
        className="flex flex-col gap-4"
        onKeyDownCapture={(event) => record(`keydown ${event.key}`)}
        onKeyUpCapture={(event) => record(`keyup ${event.key}`)}
        onFocusCapture={(event) =>
          record(
            `focus ${event.target.getAttribute("aria-label") ?? event.target.textContent}`
          )
        }
      >
        <Typography level="text">Spiral 与原始 Radix 的键盘行为对照</Typography>
        <RadioGroup
          defaultValue="a"
          onValueChange={(value) => record(`Spiral value ${value}`)}
        >
          <RadioGroupItem value="a" aria-label="Spiral A" />
          <RadioGroupItem value="b" aria-label="Spiral B" />
        </RadioGroup>
        <RadioPrimitive.Root
          defaultValue="a"
          onValueChange={(value) => record(`Radix value ${value}`)}
        >
          <RadioPrimitive.Item value="a" aria-label="Radix A">
            Radix A
          </RadioPrimitive.Item>
          <RadioPrimitive.Item value="b" aria-label="Radix B">
            Radix B
          </RadioPrimitive.Item>
        </RadioPrimitive.Root>
        <RadioGroup
          defaultValue="a"
          direction="horizontal"
          onValueChange={(value) => record(`RadioInput value ${value}`)}
        >
          <RadioInput
            value="a"
            aria-label="RadioInput A"
            title="RadioInput A"
            variant="card"
          />
          <RadioInput
            value="b"
            aria-label="RadioInput B"
            title="RadioInput B"
            variant="card"
          />
        </RadioGroup>
        <Button onClick={() => setEvents([...eventBuffer.current])}>
          显示事件记录
        </Button>
        <pre aria-label="键盘事件记录">{events.join("\n")}</pre>
      </div>
    );
  },
};

export const Control: Story = {
  render: () => (
    <RadioGroup defaultValue="on">
      <div className="flex items-center gap-2">
        <RadioGroupItem value="on" id="radio-on" />
        <Typography level="text" as="label" htmlFor="radio-on">
          Selected
        </Typography>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="off" id="radio-off" />
        <Typography level="text" as="label" htmlFor="radio-off">
          Unselected
        </Typography>
      </div>
    </RadioGroup>
  ),
};

export const NormalInput: Story = {
  render: () => (
    <RadioGroup defaultValue="a" direction="vertical" className="w-[200px]">
      <RadioInput value="a" id="radio-a" title="Text" description="Text" />
      <RadioInput value="b" id="radio-b" title="Text" description="Text" />
    </RadioGroup>
  ),
};

export const NormalInputWithIcon: Story = {
  render: () => (
    <RadioGroup defaultValue="a" direction="vertical" className="w-[200px]">
      <RadioInput
        value="a"
        id="radio-icon-a"
        title="Text"
        description="Text"
        icon={<GeneralSetting aria-hidden />}
      />
      <RadioInput
        value="b"
        id="radio-icon-b"
        title="Text"
        description="Text"
        icon={<GeneralSetting aria-hidden />}
      />
    </RadioGroup>
  ),
};

export const CardInput: Story = {
  render: () => (
    <RadioGroup defaultValue="a" direction="vertical" className="w-[200px]">
      <RadioInput
        value="a"
        id="radio-card-a"
        title="Text"
        description="Text"
        variant="card"
      />
      <RadioInput
        value="b"
        id="radio-card-b"
        title="Text"
        description="Text"
        variant="card"
      />
    </RadioGroup>
  ),
};

export const HorizontalGroup: Story = {
  render: () => (
    <RadioGroup defaultValue="a" direction="horizontal" className="w-[200px]">
      <RadioInput value="a" id="radio-h-a" title="Text" description="Text" />
      <RadioInput value="b" id="radio-h-b" title="Text" description="Text" />
    </RadioGroup>
  ),
};

export const Disabled: Story = {
  render: () => (
    <RadioGroup defaultValue="a" direction="vertical" className="w-[200px]">
      <RadioInput
        value="a"
        id="radio-dis-a"
        title="Text"
        description="Text"
        disabled
      />
      <RadioInput value="b" id="radio-dis-b" title="Text" description="Text" />
    </RadioGroup>
  ),
};

export const ComponentGeometry: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <RadioGroup defaultValue="a" direction="horizontal">
        <RadioGroupItem value="a" aria-label="baseline" />
        <RadioGroupItem
          value="b"
          aria-label="token"
          style={
            {
              "--radio-size-size": "30px",
              "--radio-size-radius": "10px",
              "--radio-size-selected-padding-x": "3px",
              "--radio-size-selected-padding-y": "4px",
            } as CSSProperties
          }
        />
        <RadioGroupItem
          value="c"
          aria-label="legacy"
          style={{ "--radio-size": "28px" } as CSSProperties}
        />
      </RadioGroup>
      {(["normal", "card"] as const).flatMap((variant) =>
        (["vertical", "horizontal"] as const).map((direction) => (
          <RadioGroup
            key={variant + direction}
            defaultValue="a"
            direction={direction}
            style={
              {
                [`--radio-input-group-size-${variant}-${direction}-gap`]:
                  "17px",
                [`--radio-input-size-${variant}-gap`]: "13px",
                "--radio-input-size-card-padding-x": "11px",
                "--radio-input-size-card-padding-y": "7px",
                "--radio-input-size-card-radius": "12px",
                "--radio-input-size-icon-height": "29px",
              } as CSSProperties
            }
          >
            <RadioInput
              value="a"
              variant={variant}
              title={variant + " " + direction + " A"}
              description="说明"
              icon={<GeneralSetting />}
            />
            <RadioInput
              value="b"
              variant={variant}
              title={variant + " " + direction + " B"}
              description="说明"
              icon={<GeneralSetting />}
            />
          </RadioGroup>
        ))
      )}
    </div>
  ),
};

export const ComponentStates: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      {(["baseline", "disabled", "token", "legacy"] as const).map((kind) => (
        <RadioGroup
          key={kind}
          defaultValue="a"
          direction="horizontal"
          disabled={kind !== "baseline"}
          style={
            (kind === "token"
              ? {
                  "--radio-color-selected-background-disabled":
                    "rgb(30, 80, 130)",
                  "--radio-color-unselected-background-disabled":
                    "rgb(180, 190, 200)",
                  "--radio-color-dot-background-default": "rgb(220, 230, 240)",
                  "--radio-transparency-dot-disabled": ".8",
                  "--radio-input-color-text-default": "rgb(40, 70, 100)",
                  "--radio-input-color-caption-default": "rgb(100, 40, 70)",
                  "--radio-input-transparency-text-disabled": ".75",
                  "--radio-input-color-card-selected-border-disabled":
                    "rgb(60, 80, 100)",
                }
              : kind === "legacy"
                ? {
                    "--radio-checked-bg": "rgb(90, 40, 80)",
                    "--radio-indicator-bg": "rgb(240, 230, 220)",
                    "--radio-disabled-opacity": ".6",
                  }
                : {}) as CSSProperties
          }
        >
          <RadioInput
            value="a"
            title={kind + " selected"}
            description="说明"
            variant="card"
          />
          <RadioInput
            value="b"
            title={kind + " unselected"}
            description="说明"
            variant="card"
          />
        </RadioGroup>
      ))}
    </div>
  ),
};

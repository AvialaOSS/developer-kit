import { parseProject } from "@aviala-design/tokens/project";
import standardProject from "../../../tokens/source/theme-engine/ald.project.json";
import { ThemeProvider, useTheme } from "../theme/theme-provider";
import { Button } from "./button";
import { useState, type CSSProperties, type ComponentProps } from "react";
import { GeneralSetting } from "@aviala-design/icons";
import type { Meta, StoryObj } from "@storybook/react";
import { Link, type LinkLevel, type LinkMode } from "./link";

const meta: Meta<typeof Link> = {
  title: "Basic Input/Link",
  component: Link,
  tags: ["autodocs"],
  argTypes: {
    level: {
      control: "select",
      options: ["caption", "text"] satisfies LinkLevel[],
    },
    mode: {
      control: "select",
      options: ["noBackground", "noBackgroundCustom"] satisfies LinkMode[],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Link>;

export const Caption: Story = {
  args: {
    href: "#",
    level: "caption",
    mode: "noBackground",
    children: "Text",
  },
};

export const Text: Story = {
  args: {
    href: "#",
    level: "text",
    mode: "noBackground",
    children: "Text",
  },
};

export const WithIcons: Story = {
  args: {
    href: "#",
    level: "text",
    leftIcon: <GeneralSetting aria-hidden />,
    rightIcon: <GeneralSetting aria-hidden />,
    children: "Text",
  },
};

export const IconOnly: Story = {
  args: {
    href: "#",
    level: "caption",
    iconOnly: true,
    leftIcon: <GeneralSetting aria-hidden />,
    "aria-label": "Settings",
  },
};

export const Disabled: Story = {
  args: {
    href: "#",
    disabled: true,
    children: "Disabled",
  },
};

const levels: LinkLevel[] = ["caption", "text"];
const modes: LinkMode[] = ["noBackground", "noBackgroundCustom"];

export const ModeMatrix: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      {modes.map((mode) => (
        <div key={mode} className="flex flex-wrap items-center gap-3">
          <span className="w-40 shrink-0 font-mono text-xs text-muted-foreground">
            {mode}
          </span>
          {levels.map((level) => (
            <Link
              key={level}
              href="#"
              mode={mode}
              level={level}
              leftIcon={<GeneralSetting aria-hidden />}
              rightIcon={<GeneralSetting aria-hidden />}
            >
              Text
            </Link>
          ))}
        </div>
      ))}
    </div>
  ),
};

export const ComponentTokens: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      {(["caption", "text"] as const).flatMap((level) =>
        (["noBackground", "noBackgroundCustom"] as const).map((mode) => {
          const prefix = `--link-color-${level}-${mode.replace(/[A-Z]/g, (c) => "-" + c.toLowerCase())}`;
          return (
            <div key={level + mode} className="flex items-center gap-4">
              <Link
                href="#"
                level={level}
                mode={mode}
                leftIcon={<GeneralSetting />}
              >
                {level} {mode} baseline
              </Link>
              <Link
                href="#"
                level={level}
                mode={mode}
                leftIcon={<GeneralSetting />}
                disabled
              >
                {level} disabled
              </Link>
              <Link
                href="#"
                level={level}
                mode={mode}
                leftIcon={<GeneralSetting />}
                aria-label={level + " " + mode + " icon"}
              />
              <Link
                href="#"
                level={level}
                mode={mode}
                leftIcon={<GeneralSetting />}
                style={
                  {
                    [`--link-size-${level}-padding-x`]: "11px",
                    [`--link-size-${level}-padding-y`]: "7px",
                    [`--link-size-${level}-gap`]: "9px",
                    [`--link-size-${level}-radius`]: "13px",
                    [`--link-size-${level}-icon-width`]: "23px",
                    [`--link-size-${level}-icon-height`]: "27px",
                    [prefix + "-text-default"]: "rgb(20, 60, 100)",
                    [prefix + "-icon-default"]: "rgb(100, 40, 80)",
                    [prefix + "-background-default"]: "rgb(220, 230, 240)",
                  } as CSSProperties
                }
              >
                {level} token
              </Link>
              <Link
                href="#"
                level={level}
                mode={mode}
                leftIcon={<GeneralSetting />}
                style={
                  {
                    "--link-fg-theme": "rgb(80, 40, 100)",
                    "--link-fg-custom": "rgb(80, 40, 100)",
                  } as CSSProperties
                }
              >
                {level} legacy
              </Link>
            </div>
          );
        })
      )}
    </div>
  ),
};

function RoutedLink({ children, onClick, ...props }: ComponentProps<"a">) {
  return (
    <a {...props} onClick={onClick}>
      {children}
    </a>
  );
}
function AsChildCases() {
  const [clicks, setClicks] = useState(0);
  return (
    <div className="flex flex-col items-start gap-4">
      <span>点击次数：{clicks}</span>
      <Link asChild leftIcon={<GeneralSetting />}>
        <RoutedLink href="#link-target" onClick={() => setClicks((n) => n + 1)}>
          可用路由链接
        </RoutedLink>
      </Link>
      <Link asChild disabled leftIcon={<GeneralSetting />}>
        <RoutedLink
          href="#disabled-target"
          tabIndex={0}
          onClick={() => setClicks((n) => n + 100)}
        >
          禁用路由链接
        </RoutedLink>
      </Link>
      <Link asChild leftIcon={<GeneralSetting />}>
        <RoutedLink
          href="#icon-target"
          aria-label="仅图标路由链接"
          onClick={() => setClicks((n) => n + 1)}
        />
      </Link>
      <span id="link-target">链接目标</span>
    </div>
  );
}
export const AsChildTokens: Story = { render: () => <AsChildCases /> };

const linkProject = parseProject(JSON.stringify(standardProject));
const linkCssOptions = {
  remTokenIds: linkProject.tokens
    .filter(
      (t) =>
        t.type === "number" &&
        t.unit === "px" &&
        ["size", "line-height"].includes(t.path[0]!)
    )
    .map((t) => t.id),
};
function LinkModeCases() {
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
        (["noBackground", "noBackgroundCustom"] as const).map((variant) => (
          <div key={level + variant} className="flex gap-4 items-center">
            <Link
              href="#"
              level={level}
              mode={variant}
              leftIcon={<GeneralSetting />}
            >
              {level} {variant} baseline
            </Link>
            <Link
              href="#"
              level={level}
              mode={variant}
              leftIcon={<GeneralSetting />}
              aria-label={level + " " + variant + " icon"}
            />
            <Link
              href="#"
              level={level}
              mode={variant}
              leftIcon={<GeneralSetting level="caption" biggerSize={false} />}
            >
              {level} {variant} explicit
            </Link>
            <Link
              href="#"
              level={level}
              mode={variant}
              leftIcon={<GeneralSetting />}
              disabled
            >
              {level} {variant} disabled
            </Link>
            <Link
              href="#"
              level={level}
              mode={variant}
              leftIcon={<GeneralSetting />}
              style={
                {
                  "--link-fg-theme": "rgb(80, 40, 100)",
                  "--link-fg-custom": "rgb(80, 40, 100)",
                } as CSSProperties
              }
            >
              {level} {variant} legacy
            </Link>
          </div>
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
            project={linkProject}
            projectCssOptions={linkCssOptions}
            projectTarget={target}
            storageKey="link-project-demo"
          >
            <LinkModeCases />
          </ThemeProvider>
        )}
      </div>
    );
  },
};

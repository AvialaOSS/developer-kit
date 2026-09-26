import type { Meta, StoryObj } from "@storybook/react";
import { UsersUserCircle } from "@aviala-design/icons";
import { Avatar, type AvatarLevel } from "./avatar";
import { useState, type CSSProperties } from "react";
import { ThemeProvider, useTheme } from "../theme/theme-provider";
import { Button } from "./button";
import { parseProject } from "@aviala-design/tokens/project";
import standardProject from "../../../tokens/source/theme-engine/ald.project.json";
import { Tag } from "./tag";
import { Table, TableCell, TableRow } from "./table";

const meta: Meta<typeof Avatar> = {
  title: "Information Display/Avatar",
  component: Avatar,
  tags: ["autodocs"],
  argTypes: {
    level: {
      control: "select",
      options: [
        "display",
        "headline1",
        "headline2",
        "title",
        "subtitle",
        "text",
      ] satisfies AvatarLevel[],
    },
    content: {
      control: "select",
      options: ["text", "picture", "icon"],
    },
    lineHeightFix: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Avatar>;

const avatarProject = parseProject(JSON.stringify(standardProject));
function AvatarModeCases() {
  const { mode, setMode, density, setDensity, effects, setEffects } = useTheme();
  return <div className="flex flex-col gap-6">
    <div className="flex gap-4">
      <Button onClick={() => setMode(mode === "light" ? "dark" : "light")}>外观：{mode}</Button>
      <Button onClick={() => setDensity(density === "default" ? "mobile-friendly" : "default")}>密度：{density}</Button>
      <Button onClick={() => setEffects(!effects)}>效果：{effects ? "ON" : "OFF"}</Button>
    </div>
    {(["display", "headline1", "headline2", "title", "subtitle", "text"] as const).map(level => <div key={level} className="flex gap-6 items-center">
      {([true, false] as const).flatMap(fix => (["text", "icon"] as const).map(content => <Avatar key={`${fix}-${content}`} aria-label={`${level}-${fix}-${content}`} level={level} lineHeightFix={fix} content={content} icon={<UsersUserCircle />}>A</Avatar>))}
    </div>)}
  </div>;
}

function AvatarConsumerCases() {
  const { mode, setMode, density, setDensity } = useTheme();
  const [visible, setVisible] = useState(true);
  return <div className="flex flex-col gap-6">
    <div className="flex gap-4">
      <Button onClick={() => setMode(mode === "light" ? "dark" : "light")}>外观：{mode}</Button>
      <Button onClick={() => setDensity(density === "default" ? "mobile-friendly" : "default")}>密度：{density}</Button>
      <Button onClick={() => setVisible(true)}>恢复标签</Button>
    </div>
    <div className="flex gap-4">
      {visible && <Tag content="people" closable closeLabel="移除 Kai" onClose={() => setVisible(false)}>Kai</Tag>}
      <Tag content="people" disabled closable closeLabel="移除禁用标签">Ada</Tag>
      <Tag content="people" avatar={<Avatar content="icon" icon={<UsersUserCircle />} lineHeightFix={false} />}>Icon</Tag>
    </div>
    <Table><TableRow>
      <TableCell content="people" text="默认图标头像" />
      <TableCell content="people" people={<Avatar lineHeightFix={false}>K</Avatar>} text="文字头像" />
    </TableRow></Table>
  </div>;
}

export const Consumers: Story = {
  render: function ConsumersStory() {
    const [target, setTarget] = useState<HTMLDivElement | null>(null);
    return <div ref={setTarget}>{target && <ThemeProvider project={avatarProject} projectTarget={target} defaultMode="light" storageKey="avatar-consumers"><AvatarConsumerCases /></ThemeProvider>}</div>;
  },
};
export const ProjectModes: Story = {
  render: function ProjectModesStory() {
    const [target, setTarget] = useState<HTMLDivElement | null>(null);
    return <div ref={setTarget}>{target && <ThemeProvider project={avatarProject} projectTarget={target} defaultMode="light" storageKey="avatar-project-modes"><AvatarModeCases /></ThemeProvider>}</div>;
  },
};

export const Text: Story = {
  args: { content: "text", level: "display", children: "K" },
};

export const TokenOverrides: Story = {
  render: () => <div className="flex flex-col gap-6">
    <div style={{
      "--avata-size-headline1-width": "40px",
      "--avata-size-headline1-container-height": "60px",
      "--avata-size-radius": "5px",
      "--avata-size-icon-width": "18px",
      "--avata-color-icon-background-default": "gainsboro",
      "--avata-color-icon-default": "rebeccapurple",
    } as CSSProperties}>
      <Avatar aria-label="组件覆盖" level="headline1" content="icon" icon={<UsersUserCircle />} />
    </div>
    <div style={{ "--avatar-size": "36px", "--avatar-bg": "gainsboro", "--avatar-fg": "rebeccapurple" } as CSSProperties} className="flex gap-6">
      {(["display", "headline1", "headline2", "title", "subtitle", "text"] as const).map(level => <Avatar key={level} aria-label={`旧覆盖 ${level}`} level={level} lineHeightFix={false}>A</Avatar>)}
    </div>
  </div>,
};

export const Icon: Story = {
  args: {
    content: "icon",
    level: "display",
    icon: <UsersUserCircle />,
  },
};

export const Pictures: Story = {
  render: () => {
    const src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
    return <div className="flex gap-6 items-center">
      <Avatar content="picture" src={src} alt="默认图片" lineHeightFix={false} />
      <Avatar content="picture" src={src} alt="带自定义类的图片" lineHeightFix={false} imgProps={{ className: "consumer-avatar", width: 96, height: 48 }} />
      <Tag content="people" avatarSrc={src}>图片标签</Tag>
      <Table><TableRow><TableCell content="people" people={<Avatar content="picture" src={src} alt="表格图片" lineHeightFix={false} />} text="图片单元格" /></TableRow></Table>
    </div>;
  },
};

export const Levels: Story = {
  render: () => (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 12 }}>
      {(
        [
          "display",
          "headline1",
          "headline2",
          "title",
          "subtitle",
          "text",
        ] as const
      ).map((level) => (
        <Avatar key={level} level={level} content="text" lineHeightFix={false}>
          K
        </Avatar>
      ))}
    </div>
  ),
};

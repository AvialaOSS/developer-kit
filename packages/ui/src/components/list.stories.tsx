import { GeneralSetting } from "@aviala-design/icons";
import type { Meta, StoryObj } from "@storybook/react";
import { useState, type ReactNode, type CSSProperties } from "react";
import { Button } from "./button";
import { ThemeProvider, useTheme } from "../theme/theme-provider";
import { parseProject } from "@aviala-design/tokens/project";
import project from "../../../tokens/source/theme-engine/ald.project.json";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectItemGroup,
  SelectTrigger,
} from "./select";
import {
  List,
  ListItem,
  ListItemGroup,
  ListGroup,
  ListSeparator,
  type ListItemLeading,
  type ListItemType,
} from "./list";

const meta: Meta<typeof List> = {
  title: "Structure Navigation/List",
  component: List,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof List>;

const listProject = parseProject(JSON.stringify(project));
function ListProjectCases() {
  const { mode, setMode, density, setDensity } = useTheme();
  const [custom, setCustom] = useState(false);
  const [legacy, setLegacy] = useState(false);
  const [deep, setDeep] = useState(false);
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
        <Button onClick={() => setDeep(!deep)}>
          列表外观：{deep ? "Deep" : "Default"}
        </Button>
      </div>
      <List
        appearance={deep ? "deep" : "default"}
        title={<span>List section</span>}
        style={
          {
            ...(custom
              ? {
                  "--list-item-size-title-gap": "11px",
                  "--list-item-size-title-radius": "13px",
                  "--list-item-size-last-gap": "17px",
                  "--list-item-size-more-gap": "13px",
                  "--button-group-size-button-slot-gap": "5px",
                  "--size-semilarge": "28px",
                  "--line-height-middle": "30px",
                  "--text-text-normal-title-black": "#204060",
                  "--list-item-size-content-stroke-width": "3px",
                  "--list-item-size-divider-stroke-width": "4px",
                  "--list-item-size-divider-height": "20px",
                  "--list-item-color-text-default": "#123456",
                  "--list-item-color-description-default": "#705020",
                  "--list-item-color-deep-background-default": "#e4eff7",
                  "--list-item-size-gap": "19px",
                  "--list-item-size-with-icon-padding-x-start": "21px",
                  "--list-item-size-content-no-icon-padding-x-start": "23px",
                  "--list-item-size-content-padding-y": "9px",
                  "--list-item-size-icon-padding-x": "3px",
                  "--list-item-size-icon-padding-y": "12px",
                  "--list-item-size-content-padding-x-end": "17px",
                  "--list-size-gap": "13px",
                  "--list-size-heading-padding-x": "17px",
                  "--list-size-heading-padding-y": "3px",
                  "--icon-place-size-width": "42px",
                  "--icon-place-size-height": "44px",
                  "--icon-place-size-icon-width": "18px",
                  "--icon-place-size-rounded-radius": "7px",
                  "--icon-place-color-theme-primary-background-default":
                    "#204060",
                  "--icon-place-color-theme-primary-icon-default": "#d5e5f5",
                  "--list-size-title-padding-x": "5px",
                  "--list-size-title-padding-y": "2px",
                  "--list-size-title-gap": "9px",
                  "--list-size-content-gap": "7px",
                  "--list-size-content-padding-x": "11px",
                  "--list-size-content-padding-y": "6px",
                  "--list-size-content-radius": "19px",
                  "--list-color-text-default": "#123456",
                }
              : {}),
            ...(legacy
              ? {
                  "--list-item-icon-default-size": "19px",
                  "--list-item-icon-shaped-size": "32px",
                  "--list-item-icon-shaped-bg": "#603080",
                  "--list-item-icon-shaped-fg": "#f5e5d5",
                  "--list-item-divider-height": "11px",
                  "--list-bg": "#d5e5f5",
                  "--list-item-fg": "#603080",
                  "--list-item-pl": "6px",
                  "--list-item-content-py": "5px",
                  "--list-gap": "4px",
                  "--list-title-px": "8px",
                  "--list-group-radius": "12px",
                  "--list-title-fg": "#603080",
                }
              : {}),
          } as CSSProperties
        }
      >
        <ListItem
          title="First item"
          subtitle="Supporting details"
          showTrailing={false}
        />
        <ListItem title="Second item" leading="none" showTrailing={false} />
        <ListItem
          title="Explicit default item"
          leading="default"
          appearance="default"
          showTrailing={false}
        />
        <ListItem
          title="Selected item"
          subtitle="Selected description"
          selected
          showTrailing={false}
        />
        <ListItem
          title="Trailing actions"
          itemType="action"
          actionLabel="Action"
        />
        <ListItem
          title="Hidden content divider"
          showTopDivider={false}
          showTrailing={false}
        />
      </List>
    </div>
  );
}
export const ProjectModes: Story = {
  render: function ListProjectStory() {
    const [target, setTarget] = useState<HTMLDivElement | null>(null);
    return (
      <div ref={setTarget}>
        {target && (
          <ThemeProvider
            project={listProject}
            projectTarget={target}
            defaultMode="light"
            storageKey="list-project"
          >
            <ListProjectCases />
          </ThemeProvider>
        )}
      </div>
    );
  },
};

export const InteractionBoundaries: Story = {
  render: function InteractionCases() {
    const [target, setTarget] = useState<HTMLDivElement | null>(null);
    const [rows, setRows] = useState(0);
    const [actions, setActions] = useState(0);
    const [checked, setChecked] = useState(false);
    return (
      <div ref={setTarget}>
        {target && (
          <ThemeProvider
            project={listProject}
            projectTarget={target}
            defaultMode="light"
            storageKey="list-interaction"
          >
            <p role="status">
              Rows: {rows}; Actions: {actions}; Switch: {checked ? "ON" : "OFF"}
            </p>
            <List appearance="deep" title="Interaction boundaries">
              <ListItem
                title="Action row"
                itemType="action"
                onClick={() => setRows((n) => n + 1)}
                action={
                  <Button onClick={() => setActions((n) => n + 1)}>
                    Nested action
                  </Button>
                }
              />
              <ListItem
                title="Switch row"
                itemType="switch"
                onClick={() => setRows((n) => n + 1)}
                switchProps={{
                  "aria-label": "Nested switch",
                  checked,
                  onCheckedChange: setChecked,
                }}
              />
              <div role="listitem">
                <ListGroup appearance="default">
                  <ListItem title="Nested default" showTrailing={false} />
                  <ListItem
                    title="Explicit deep"
                    appearance="deep"
                    showTrailing={false}
                  />
                </ListGroup>
              </div>
              <ListItem title="Inherited deep" showTrailing={false} />
            </List>
          </ThemeProvider>
        )}
      </div>
    );
  },
};

function DemoSelect() {
  return (
    <Select defaultValue="a">
      <SelectTrigger
        size="regular"
        placeholder="请选择提醒方式"
        leftIcon={<GeneralSetting aria-hidden />}
        rightIcon={<GeneralSetting aria-hidden />}
        className="w-full"
      />
      <SelectContent portalled={false}>
        <SelectItemGroup>
          <SelectItem value="a">仅应用内提醒</SelectItem>
          <SelectItem value="b">应用内 + 邮件</SelectItem>
        </SelectItemGroup>
      </SelectContent>
    </Select>
  );
}

function ListItemMatrix({
  itemType,
  leading,
}: {
  itemType: ListItemType;
  leading: ListItemLeading;
}) {
  return (
    <ListItem
      itemType={itemType}
      leading={leading}
      title="消息推送"
      subtitle="接收新消息的系统推送"
      actionLabel="管理"
      select={<DemoSelect />}
    />
  );
}

/** Figma List (738:148304) — title + card with Select-type items */
export const Default: Story = {
  render: () => (
    <List title="通知设置" className="w-[387px]">
      <ListItem
        itemType="select"
        leading="shaped"
        title="消息推送"
        subtitle="接收新消息的系统推送"
        actionLabel="管理"
        select={<DemoSelect />}
      />
      <ListItem
        itemType="select"
        leading="shaped"
        title="评论回复"
        subtitle="有人回复我的评论时提醒"
        actionLabel="管理"
        select={<DemoSelect />}
      />
      <ListItem
        itemType="select"
        leading="shaped"
        title="审批待办"
        subtitle="待我处理的审批任务"
        actionLabel="管理"
        select={<DemoSelect />}
      />
      <ListItem
        itemType="select"
        leading="shaped"
        title="日程提醒"
        subtitle="会议开始前的提前提醒"
        actionLabel="管理"
        select={<DemoSelect />}
      />
      <ListItem
        itemType="select"
        leading="shaped"
        title="安全提醒"
        subtitle="异地登录与密码变更通知"
        actionLabel="管理"
        select={<DemoSelect />}
      />
    </List>
  ),
};

/** Figma List item variant matrix (647:87555) — all Type × left icon setting */
export const ItemVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      {(["select", "action", "switch"] as const).map((itemType) => (
        <ListGroupSection key={itemType} label={`Type=${itemType}`}>
          {(["shaped", "default", "none"] as const).map((leading) => (
            <ListItem
              key={`${itemType}-${leading}`}
              itemType={itemType}
              leading={leading}
              title="消息推送"
              subtitle="接收新消息的系统推送"
              actionLabel="管理"
              select={<DemoSelect />}
            />
          ))}
        </ListGroupSection>
      ))}
    </div>
  ),
};

function ListGroupSection({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <ListItemGroup label={label} className="w-[507px]">
      {children}
    </ListItemGroup>
  );
}

/** Leading icon settings */
export const LeadingIcons: Story = {
  render: () => (
    <List title="通知设置" className="w-[507px]">
      <ListItem
        itemType="select"
        leading="shaped"
        title="Shaped icon"
        subtitle="36px theme circle"
        select={<DemoSelect />}
      />
      <ListItem
        itemType="select"
        leading="default"
        title="Default icon"
        subtitle="22px plain icon"
        select={<DemoSelect />}
      />
      <ListItem
        itemType="select"
        leading="none"
        title="No icon"
        subtitle="Content aligned to edge"
        select={<DemoSelect />}
      />
    </List>
  ),
};

/** Trailing Type variants */
export const TrailingTypes: Story = {
  render: () => (
    <List title="通知设置" className="w-[507px]">
      <ListItem
        itemType="select"
        leading="shaped"
        title="Select trailing"
        subtitle="Primary button + select"
        actionLabel="管理"
        select={<DemoSelect />}
      />
      <ListItem
        itemType="action"
        leading="shaped"
        title="Action trailing"
        subtitle="Button group + chevron"
        actionLabel="管理"
      />
      <ListItem
        itemType="switch"
        leading="shaped"
        title="Switch trailing"
        subtitle="Primary button + switch"
        actionLabel="管理"
        switchProps={{ defaultChecked: true }}
      />
    </List>
  ),
};

/** Multiple titled groups with separator */
export const GroupedSections: Story = {
  render: () => (
    <div className="flex w-[387px] flex-col gap-4">
      <ListItemGroup label="Section A">
        <ListItem
          itemType="select"
          leading="shaped"
          title="Item A1"
          subtitle="Caption"
          select={<DemoSelect />}
        />
        <ListItem
          itemType="select"
          leading="shaped"
          title="Item A2"
          subtitle="Caption"
          select={<DemoSelect />}
        />
      </ListItemGroup>
      <ListSeparator />
      <ListItemGroup label="Section B">
        <ListItem
          itemType="action"
          leading="default"
          title="Item B1"
          subtitle="Caption"
        />
        <ListItem
          itemType="switch"
          leading="none"
          title="Item B2"
          subtitle="Caption"
          switchProps={{ defaultChecked: true }}
        />
      </ListItemGroup>
    </div>
  ),
};

/** Interactive row with hover highlight */
export const Interactive: Story = {
  render: () => (
    <List title="通知设置" className="w-[507px]">
      <ListItem
        itemType="action"
        leading="shaped"
        title="Clickable row"
        subtitle="Hover highlight"
        interactive
        onClick={() => undefined}
      />
      <ListItem
        itemType="select"
        leading="shaped"
        title="Selected row"
        subtitle="Selected state"
        selected
        select={<DemoSelect />}
      />
      <ListItem
        itemType="switch"
        leading="shaped"
        title="Disabled row"
        subtitle="Reduced opacity"
        disabled
        switchProps={{ defaultChecked: true }}
      />
    </List>
  ),
};

/** Link row without trailing actions / divider (chevron kept) */
export const LinkWithoutTrailing: Story = {
  render: () => (
    <List className="w-[507px]">
      <ListItem
        itemType="action"
        leading="default"
        title="对文档有改进意见吗？"
        subtitle="欢迎编辑文档，为更多开发者提供帮助"
        showTrailing={false}
        href="https://github.com/AvialaOSS/avialaWebsite/tree/main/apps/spiral-docs"
        target="_blank"
        rel="noopener noreferrer"
      />
    </List>
  ),
};

/** Single variant helper for controls */
export const SingleItem: Story = {
  args: {
    title: "通知设置",
    className: "w-[507px]",
  },
  render: (args) => (
    <List {...args}>
      <ListItemMatrix itemType="select" leading="shaped" />
    </List>
  ),
};

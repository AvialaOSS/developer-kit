import { GeneralSetting } from "@aviala-design/icons";
import type { Meta, StoryObj } from "@storybook/react";
import { useState, type CSSProperties } from "react";
import { parseProject } from "@aviala-design/tokens/project";
import standardProject from "../../../tokens/source/theme-engine/ald.project.json";
import { ThemeProvider, useTheme } from "../theme/theme-provider";
import { Button } from "./button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectItemGroup,
  SelectItemPeople,
  SelectSubItem,
  SelectSubMenu,
  SelectTrigger,
  SelectSearch,
  type SelectItemFunction,
  type SelectItemLayout,
  type SelectSize,
} from "./select";

const meta: Meta<typeof Select> = {
  title: "Information Collect/Select",
  component: Select,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Select>;

const selectProject = parseProject(JSON.stringify(standardProject));
function MenuTypographyDemo() {
  const { mode, setMode, density, setDensity, effects, setEffects } =
    useTheme();
  return (
    <>
      <Button
        onClick={() =>
          setDensity(density === "default" ? "mobile-friendly" : "default")
        }
      >
        密度：{density}
      </Button>
      <Button onClick={() => setMode(mode === "light" ? "dark" : "light")}>
        外观：{mode}
      </Button>
      <Button onClick={() => setEffects(!effects)}>
        效果：{effects ? "ON" : "OFF"}
      </Button>
      <Select defaultValue="body">
        <SelectTrigger aria-label="局部菜单字体" />
        <SelectContent>
          <SelectItemGroup label="Group caption">
            <SelectItem
              value="title"
              layout="title"
              showFunctionIcon={false}
              showLeftIcon
              leftIcon={<GeneralSetting aria-hidden />}
            >
              Title caption
            </SelectItem>
            <SelectItem
              value="body"
              showLeftIcon
              leftIcon={<GeneralSetting aria-hidden />}
            >
              Body text
            </SelectItem>
            <SelectItemPeople value="person" subtitle="Person caption">
              Person text
            </SelectItemPeople>
            <SelectItem
              value="legacy"
              style={
                {
                  "--select-item-font-size": "19px",
                  "--select-item-line-height": "27px",
                } as CSSProperties
              }
            >
              Explicit typography
            </SelectItem>
          </SelectItemGroup>
        </SelectContent>
      </Select>
    </>
  );
}
export const MenuTypography: Story = {
  render: function MenuTypographyStory() {
    const [target, setTarget] = useState<HTMLDivElement | null>(null);
    return (
      <div ref={setTarget} data-select-theme-scope="typography">
        {target && (
          <ThemeProvider
            project={selectProject}
            projectTarget={target}
            defaultMode="light"
            storageKey="select-menu-typography"
          >
            <MenuTypographyDemo />
          </ThemeProvider>
        )}
      </div>
    );
  },
};
export const LocalProject: Story = {
  render: function LocalProjectStory() {
    const [target, setTarget] = useState<HTMLDivElement | null>(null);
    return (
      <div
        ref={setTarget}
        data-select-theme-scope="local"
        style={{
          padding: 24,
          background: "var(--box-box-normal-background-white1)",
        }}
      >
        {target && (
          <ThemeProvider
            project={selectProject}
            projectTarget={target}
            defaultMode="dark"
            storageKey="select-local-project-demo"
          >
            <SelectDemo defaultValue="a" />
          </ThemeProvider>
        )}
      </div>
    );
  },
};

function SelectDemo({
  size = "regular",
  allRound = false,
  placeholder = "请选择所属部门",
  defaultValue,
  disabled = false,
}: {
  size?: SelectSize;
  allRound?: boolean;
  placeholder?: string;
  defaultValue?: string;
  disabled?: boolean;
}) {
  return (
    <Select defaultValue={defaultValue} disabled={disabled}>
      <SelectTrigger
        size={size}
        allRound={allRound}
        placeholder={placeholder}
        leftIcon={<GeneralSetting aria-hidden />}
        rightIcon={<GeneralSetting aria-hidden />}
        className="w-[290px]"
      />
      <SelectContent>
        <SelectItemGroup label="常用部门" showDivider>
          <SelectItem value="a">产品设计部</SelectItem>
          <SelectItem value="b">技术研发部</SelectItem>
        </SelectItemGroup>
        <SelectItemGroup label="全部部门">
          <SelectItem value="c">市场运营部</SelectItem>
          <SelectItem value="d">财务管理部</SelectItem>
        </SelectItemGroup>
      </SelectContent>
    </Select>
  );
}

export const Empty: Story = {
  render: () => <SelectDemo />,
};

export const Search: Story = {
  render: function SearchStory() {
    const [query, setQuery] = useState("");
    const options = ["Design", "Engineering", "Marketing"];
    const matches = options.filter((value) =>
      value.toLowerCase().includes(query.toLowerCase())
    );
    return (
      <Select
        onOpenChange={(open) => {
          if (!open) setQuery("");
        }}
      >
        <SelectTrigger
          placeholder="选择部门"
          aria-label="搜索部门"
          className="w-80"
        />
        <SelectContent
          style={
            {
              "--select-menu-item-size-search-padding-x": "11px",
              "--select-menu-item-size-search-padding-y": "7px",
              "--select-menu-item-size-search-radius": "13px",
            } as CSSProperties
          }
        >
          <SelectSearch
            aria-label="筛选部门"
            placeholder="输入部门名称"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <SelectItemGroup>
            {matches.map((value) => (
              <SelectItem key={value} value={value}>
                {value}
              </SelectItem>
            ))}
            {matches.length === 0 && <div role="status">没有匹配的部门</div>}
          </SelectItemGroup>
        </SelectContent>
      </Select>
    );
  },
};

export const ComponentGeometry: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <SelectDemo defaultValue="a" />
      <SelectDemo size="big" defaultValue="a" allRound />
      <div
        style={
          {
            "--select-input-size-regular-padding-x": "17px",
            "--select-input-size-regular-padding-y": "3px",
            "--select-input-size-regular-gap": "11px",
            "--select-input-size-regular-slot-padding-y": "9px",
            "--select-input-size-radius": "13px",
            "--select-input-size-icon-width": "22px",
            "--select-input-size-icon-height": "28px",
          } as CSSProperties
        }
      >
        <SelectDemo defaultValue="a" />
      </div>
      <div
        style={
          {
            "--input-px-regular": "19px",
            "--input-radius": "15px",
            "--input-slot-icon-size": "24px",
          } as CSSProperties
        }
      >
        <SelectDemo defaultValue="a" />
      </div>
    </div>
  ),
};

export const SearchForm: Story = {
  render: function SearchFormStory() {
    const [query, setQuery] = useState("");
    const [submission, setSubmission] = useState("尚未提交");
    return (
      <form
        onSubmit={(event) => {
          event.preventDefault();
          setSubmission(
            JSON.stringify(
              Object.fromEntries(new FormData(event.currentTarget))
            )
          );
        }}
      >
        <Select
          name="department"
          defaultValue="design"
          onOpenChange={(open) => {
            if (!open) setQuery("");
          }}
        >
          <SelectTrigger aria-label="表单部门" />
          <SelectContent portalled={false}>
            <SelectSearch
              aria-label="搜索表单部门"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            <SelectItemGroup>
              {["design", "engineering"]
                .filter((value) => value.includes(query))
                .map((value) => (
                  <SelectItem key={value} value={value}>
                    {value}
                  </SelectItem>
                ))}
            </SelectItemGroup>
          </SelectContent>
        </Select>
        <Button type="submit">提交搜索表单</Button>
        <output aria-label="提交结果">{submission}</output>
      </form>
    );
  },
};

export const ComponentColors: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <SelectDemo defaultValue="a" />
      <div
        className="flex flex-col gap-4"
        style={
          {
            "--select-input-color-background-default": "rgb(220, 230, 240)",
            "--select-input-color-background-active": "rgb(240, 230, 220)",
            "--select-input-color-background-disabled": "rgb(200, 210, 220)",
            "--select-input-color-text-default": "rgb(30, 50, 70)",
            "--select-input-color-icon-default": "rgb(80, 40, 100)",
            "--select-input-color-border-active": "rgb(40, 90, 60)",
            "--select-input-size-border-width": "3px",
            "--select-input-color-shadow-default": "rgb(70, 80, 90)",
          } as CSSProperties
        }
      >
        <SelectDemo defaultValue="a" />
        <SelectDemo defaultValue="a" disabled />
      </div>
      <div
        style={
          {
            "--input-bg-default": "rgb(210, 190, 170)",
            "--input-fg": "rgb(50, 70, 90)",
          } as CSSProperties
        }
      >
        <SelectDemo defaultValue="a" />
      </div>
    </div>
  ),
};

export const MenuTokens: Story = {
  render: () => (
    <Select defaultValue="a" defaultOpen>
      <SelectTrigger aria-label="菜单Token覆盖" className="w-80" />
      <SelectContent
        style={
          {
            "--select-menu-size-padding-x": "5px",
            "--select-menu-size-padding-y": "9px",
            "--select-menu-size-gap": "7px",
            "--select-menu-size-radius": "13px",
            "--select-menu-color-background-default": "rgb(220, 230, 240)",
            "--select-menu-item-group-size-padding-x": "11px",
            "--select-menu-item-group-size-padding-y": "3px",
            "--select-menu-item-group-size-gap": "8px",
            "--select-menu-item-group-size-divider-padding-x": "9px",
            "--select-menu-item-group-size-divider-padding-y": "5px",
            "--select-menu-item-group-size-divider-padding-y-end": "7px",
            "--select-menu-item-group-color-divider-default": "rgb(40, 90, 60)",
          } as CSSProperties
        }
      >
        <SelectItemGroup label="第一组" showDivider>
          <SelectItem value="a">项目甲</SelectItem>
          <SelectItem value="b">项目乙</SelectItem>
        </SelectItemGroup>
        <SelectItemGroup label="第二组">
          <SelectItem value="c">项目丙</SelectItem>
        </SelectItemGroup>
      </SelectContent>
    </Select>
  ),
};

export const Filled: Story = {
  render: () => <SelectDemo defaultValue="a" />,
};

export const Big: Story = {
  render: () => <SelectDemo size="big" defaultValue="b" />,
};

export const AllRound: Story = {
  render: () => <SelectDemo allRound defaultValue="c" />,
};

/**
 * Figma Select Menu Item Group — showTitle=true (`276:6234`).
 * QA: stays open when clicking DevTools; closes on one outside click, Escape, or item select.
 */
export const MenuWithTitle: Story = {
  render: () => (
    <Select defaultOpen defaultValue="a">
      <SelectTrigger
        placeholder="请选择所属部门"
        leftIcon={<GeneralSetting aria-hidden />}
        rightIcon={<GeneralSetting aria-hidden />}
        className="w-[290px]"
      />
      <SelectContent>
        <SelectItemGroup label="常用部门" showDivider>
          <SelectItem value="a">产品设计部</SelectItem>
          <SelectItem value="b">技术研发部</SelectItem>
        </SelectItemGroup>
        <SelectItemGroup label="全部部门">
          <SelectItem value="c">市场运营部</SelectItem>
          <SelectItem value="d">财务管理部</SelectItem>
        </SelectItemGroup>
      </SelectContent>
    </Select>
  ),
};

/** Figma Select Menu Item Group — showTitle=false (no label row) */
export const MenuNoTitle: Story = {
  render: () => (
    <Select defaultOpen defaultValue="a">
      <SelectTrigger
        placeholder="请选择所属部门"
        leftIcon={<GeneralSetting aria-hidden />}
        rightIcon={<GeneralSetting aria-hidden />}
        className="w-[290px]"
      />
      <SelectContent>
        <SelectItemGroup showDivider>
          <SelectItem value="a">产品设计部</SelectItem>
          <SelectItem value="b">技术研发部</SelectItem>
        </SelectItemGroup>
        <SelectItemGroup>
          <SelectItem value="c">市场运营部</SelectItem>
          <SelectItem value="d">财务管理部</SelectItem>
        </SelectItemGroup>
      </SelectContent>
    </Select>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Select defaultValue="a" disabled>
      <SelectTrigger
        placeholder="请选择所属部门"
        leftIcon={<GeneralSetting aria-hidden />}
        rightIcon={<GeneralSetting aria-hidden />}
        className="w-[290px]"
      />
      <SelectContent>
        <SelectItemGroup>
          <SelectItem value="a">产品设计部</SelectItem>
        </SelectItemGroup>
      </SelectContent>
    </Select>
  ),
};

/** Figma Action Item with icons, badge, and MoreFunction */
export const ActionItemVariants: Story = {
  render: () => (
    <Select defaultOpen defaultValue="action">
      <SelectTrigger placeholder="Action items" className="w-[290px]" />
      <SelectContent>
        <SelectItemGroup>
          <SelectItem
            value="action"
            showLeftIcon
            leftIcon={<GeneralSetting aria-hidden />}
          >
            Default action
          </SelectItem>
          <SelectItem
            value="rich"
            showLeftIcon
            leftIcon={<GeneralSetting aria-hidden />}
            showRightIcon
            rightIcon={<GeneralSetting aria-hidden />}
            showBadge
            badge="New"
            showMoreFunction
            moreAction={
              <span className="text-[length:var(--size-regular, 1.125rem)] text-[var(--select-item-selected-fg,var(--_legacy-select-item-selected-fg))]">
                More
              </span>
            }
          >
            With slots
          </SelectItem>
        </SelectItemGroup>
      </SelectContent>
    </Select>
  ),
};

/** Figma Function=Radio / Form-Radio / CheckBox / Form-CheckBox */
export const FormControlItems: Story = {
  render: () => (
    <Select defaultOpen defaultValue="radio-trail">
      <SelectTrigger placeholder="Form controls" className="w-[290px]" />
      <SelectContent>
        <SelectItemGroup label="Trailing">
          <SelectItem value="radio-trail" itemFunction="radio">
            Radio
          </SelectItem>
          <SelectItem value="checkbox-trail" itemFunction="checkbox">
            CheckBox
          </SelectItem>
        </SelectItemGroup>
        <SelectItemGroup label="Leading">
          <SelectItem value="form-radio" itemFunction="form-radio">
            Form-Radio
          </SelectItem>
          <SelectItem value="form-checkbox" itemFunction="form-checkbox">
            Form-CheckBox
          </SelectItem>
        </SelectItemGroup>
      </SelectContent>
    </Select>
  ),
};

/** Figma Type=Checked — hides function icon when selected */
export const CheckedLayout: Story = {
  render: () => (
    <Select defaultOpen defaultValue="checked">
      <SelectTrigger placeholder="Checked layout" className="w-[290px]" />
      <SelectContent>
        <SelectItemGroup>
          <SelectItem value="checked" layout="checked" itemFunction="simple">
            Selected item
          </SelectItem>
          <SelectItem value="other" layout="checked" itemFunction="simple">
            Other item
          </SelectItem>
        </SelectItemGroup>
      </SelectContent>
    </Select>
  ),
};

/** Figma Type=People with optional form controls */
export const PeopleItems: Story = {
  render: () => (
    <Select defaultOpen defaultValue="people-action">
      <SelectTrigger placeholder="People" className="w-[290px]" />
      <SelectContent>
        <SelectItemGroup>
          <SelectItemPeople value="people-action" subtitle="Design">
            Alex Chen
          </SelectItemPeople>
          <SelectItemPeople
            value="people-radio"
            itemFunction="radio"
            subtitle="Engineering"
          >
            Sam Rivera
          </SelectItemPeople>
          <SelectItemPeople
            value="people-form-radio"
            itemFunction="form-radio"
            subtitle="Product"
          >
            Jordan Lee
          </SelectItemPeople>
        </SelectItemGroup>
      </SelectContent>
    </Select>
  ),
};

/** Figma Type=Title row inside a group */
export const ItemGeometryTokens: Story = {
  render: () => (
    <Select defaultOpen defaultValue="normal">
      <SelectTrigger placeholder="Item geometry" className="w-[290px]" />
      <SelectContent
        style={
          {
            "--select-menu-item-size-gap": "11px",
            "--select-menu-item-size-padding-x": "17px",
            "--select-menu-item-size-padding-y": "7px",
            "--select-menu-item-size-radius": "9px",
            "--select-menu-item-size-title-padding-y-end": "3px",
            "--select-menu-item-size-people-padding-x-start": "5px",
            "--select-menu-item-color-group-title-default": "rgb(70, 80, 90)",
            "--select-menu-item-color-caption-default": "rgb(90, 60, 80)",
            "--select-menu-item-size-function-height": "27px",
            "--select-menu-item-size-function-padding-x-end": "13px",
            "--select-menu-item-color-function-divider-default":
              "rgb(40, 90, 60)",
            "--select-menu-item-size-icon-width": "21px",
            "--select-menu-item-size-icon-height": "29px",
            "--select-menu-item-size-title-icon-width": "15px",
            "--select-menu-item-size-title-icon-height": "23px",
            "--select-menu-item-color-selected-background-default":
              "rgb(210, 230, 220)",
            "--select-menu-item-color-icon-default": "rgb(70, 100, 120)",
            "--select-menu-item-color-selected-icon-default":
              "rgb(120, 60, 80)",
            "--select-menu-item-size-badge-padding-x": "9px",
          } as CSSProperties
        }
      >
        <SelectItemGroup>
          <SelectItem
            value="title"
            layout="title"
            itemFunction="simple"
            showLeftIcon
            leftIcon={<GeneralSetting aria-hidden />}
          >
            Section title
          </SelectItem>
          <SelectItem
            value="normal"
            showLeftIcon
            leftIcon={<GeneralSetting aria-hidden />}
            showMoreFunction
            moreAction={<GeneralSetting aria-hidden />}
          >
            Normal item
          </SelectItem>
          <SelectItemPeople value="people" subtitle="Caption">
            People item
          </SelectItemPeople>
          <SelectItemPeople value="form-people" itemFunction="form-radio">
            Form people item
          </SelectItemPeople>
          <SelectItem value="checked-token" layout="checked">
            Checked token item
          </SelectItem>
          <SelectItem
            value="custom-function"
            icon={<GeneralSetting aria-hidden />}
            showBadge
            badge="New"
          >
            Custom function
          </SelectItem>
          <SelectItem value="radio-function" itemFunction="radio">
            Radio function
          </SelectItem>
          <SelectItem
            value="explicit-icon"
            showLeftIcon
            leftIcon={
              <GeneralSetting level="title" biggerSize={false} aria-hidden />
            }
          >
            Explicit icon level
          </SelectItem>
          <SelectItem
            value="legacy"
            style={
              {
                "--select-item-gap": "13px",
                "--select-item-px": "19px",
                "--select-item-py": "2px",
              } as CSSProperties
            }
          >
            Legacy overrides
          </SelectItem>
        </SelectItemGroup>
      </SelectContent>
    </Select>
  ),
};

export const TitleRow: Story = {
  render: () => (
    <Select defaultOpen defaultValue="row">
      <SelectTrigger placeholder="Title row" className="w-[290px]" />
      <SelectContent>
        <SelectItemGroup>
          <SelectItem
            value="title"
            layout="title"
            itemFunction="simple"
            showFunctionIcon={false}
          >
            Section title
          </SelectItem>
          <SelectItem value="row">Default row</SelectItem>
        </SelectItemGroup>
      </SelectContent>
    </Select>
  ),
};

/** Matrix of Function × Layout for visual QA */
export const ItemVariantMatrix: Story = {
  render: () => {
    const functions: SelectItemFunction[] = [
      "action",
      "radio",
      "checkbox",
      "form-radio",
      "form-checkbox",
    ];
    const layouts: SelectItemLayout[] = ["default", "people"];

    return (
      <Select defaultOpen defaultValue="action-default">
        <SelectTrigger placeholder="Matrix" className="w-[290px]" />
        <SelectContent className="max-h-[480px]">
          {layouts.map((layout) => (
            <SelectItemGroup key={layout} label={layout} showDivider>
              {functions.map((itemFunction) => {
                const value = `${itemFunction}-${layout}`;
                const Item =
                  layout === "people" ? SelectItemPeople : SelectItem;
                return (
                  <Item
                    key={value}
                    value={value}
                    itemFunction={itemFunction}
                    layout={layout === "people" ? "people" : "default"}
                    subtitle={layout === "people" ? "Caption" : undefined}
                  >
                    {itemFunction}
                  </Item>
                );
              })}
            </SelectItemGroup>
          ))}
        </SelectContent>
      </Select>
    );
  },
};

/**
 * Figma Select Menu Item with nested sub-menu flyout.
 * Hover parent to open; panel is vertically centered, 8px to the right (flips left on collision).
 */
export const NestedSubMenu: Story = {
  render: () => (
    <Select defaultOpen defaultValue="leaf-a">
      <SelectTrigger placeholder="Nested sub-menu" className="w-[290px]" />
      <SelectContent>
        <SelectItemGroup label="Actions">
          <SelectSubItem itemFunction="action">
            More options
            <SelectSubMenu>
              <SelectItemGroup label="Sub group">
                <SelectItem value="leaf-a">Sub option A</SelectItem>
                <SelectItem value="leaf-b">Sub option B</SelectItem>
              </SelectItemGroup>
              <SelectItemGroup label="More">
                <SelectItem value="leaf-c">Sub option C</SelectItem>
              </SelectItemGroup>
            </SelectSubMenu>
          </SelectSubItem>
          <SelectItem value="simple">Simple option</SelectItem>
        </SelectItemGroup>
        <SelectItemGroup label="Regions" showDivider>
          <SelectSubItem
            itemFunction="action"
            showLeftIcon
            leftIcon={<GeneralSetting aria-hidden />}
          >
            Settings
            <SelectSubMenu>
              <SelectItemGroup>
                <SelectItem value="pref-a">Preference A</SelectItem>
                <SelectItem value="pref-b">Preference B</SelectItem>
              </SelectItemGroup>
            </SelectSubMenu>
          </SelectSubItem>
        </SelectItemGroup>
      </SelectContent>
    </Select>
  ),
};

import { GeneralSetting } from "@aviala-design/icons";
import type { Meta, StoryObj } from "@storybook/react";
import { useState, type CSSProperties } from "react";
import { parseProject } from "@aviala-design/tokens/project";
import standardProject from "../../../tokens/source/theme-engine/ald.project.json";
import { ThemeProvider, useTheme } from "../theme/theme-provider";
import { Button } from "./button";
import {
  Cascader,
  CascaderColumn,
  CascaderContent,
  CascaderField,
  CascaderItem,
  CascaderItemGroup,
  CascaderSearch,
  CascaderMenu,
  CascaderOptionsMenu,
  CascaderTrigger,
  type CascaderOption,
  type CascaderSize,
} from "./cascader";

const meta: Meta<typeof Cascader> = {
  title: "Information Collect/Cascader",
  component: Cascader,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Cascader>;

const cascaderProject = parseProject(JSON.stringify(standardProject));
function CascaderModeCases() {
  const { mode, setMode, density, setDensity, effects, setEffects } =
    useTheme();
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
        <Button onClick={() => setEffects(!effects)}>
          效果：{effects ? "ON" : "OFF"}
        </Button>
      </div>
      {(["regular", "big"] as const).flatMap((size) =>
        [false, true].flatMap((allRound) =>
          (["empty", "filled", "disabled", "error"] as const).map((state) => (
            <div
              key={`${size}-${allRound}-${state}`}
              data-cascader-case={`${size}-${allRound}-${state}`}
            >
              <CascaderField
                options={regionOptions}
                size={size}
                allRound={allRound}
                disabled={state === "disabled"}
                error={state === "error"}
                defaultValue={
                  state === "empty" ? undefined : ["china", "hainan", "haikou"]
                }
                leftIcon={<GeneralSetting aria-hidden />}
                rightIcon={<GeneralSetting aria-hidden />}
                className="w-80"
              />
            </div>
          ))
        )
      )}
    </div>
  );
}
export const ProjectModes: Story = {
  render: function ProjectModesStory() {
    const [target, setTarget] = useState<HTMLDivElement | null>(null);
    return (
      <div ref={setTarget} data-cascader-theme="local">
        {target && (
          <ThemeProvider
            project={cascaderProject}
            projectTarget={target}
            defaultMode="light"
            storageKey="cascader-project-modes"
          >
            <CascaderModeCases />
          </ThemeProvider>
        )}
      </div>
    );
  },
};

const regionOptions: CascaderOption[] = [
  {
    value: "china",
    label: "中国",
    children: [
      {
        value: "hainan",
        label: "海南省",
        children: [
          { value: "haikou", label: "海口市" },
          { value: "sanya", label: "三亚市" },
        ],
      },
      {
        value: "guangdong",
        label: "广东省",
        children: [
          { value: "guangzhou", label: "广州市" },
          { value: "shenzhen", label: "深圳市" },
        ],
      },
    ],
  },
  {
    value: "usa",
    label: "美国",
    children: [
      {
        value: "ca",
        label: "加利福尼亚州",
        children: [
          { value: "sf", label: "旧金山" },
          { value: "la", label: "洛杉矶" },
        ],
      },
    ],
  },
];

export const ComponentSpacing: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <CascaderDemo defaultValue={["china", "hainan", "haikou"]} />
      <CascaderDemo size="big" defaultValue={["china", "hainan", "haikou"]} />
      <div
        style={
          {
            "--cascader-input-size-regular-padding-x": "17px",
            "--cascader-input-size-regular-padding-y": "3px",
            "--cascader-input-size-regular-gap": "11px",
            "--cascader-input-size-regular-slot-padding-y": "9px",
            "--cascader-input-size-icon-width": "22px",
            "--cascader-input-size-icon-height": "28px",
            "--cascader-input-size-radius": "13px",
            "--cascader-input-color-background-default": "rgb(220, 230, 240)",
            "--cascader-input-color-text-default": "rgb(30, 50, 70)",
            "--cascader-input-color-icon-default": "rgb(80, 40, 100)",
            "--cascader-input-color-background-active": "rgb(240, 230, 220)",
            "--cascader-input-color-border-active": "rgb(40, 90, 60)",
            "--cascader-input-size-border-width": "3px",
          } as CSSProperties
        }
      >
        <CascaderDemo defaultValue={["china", "hainan", "haikou"]} />
      </div>
      <div
        style={
          {
            "--input-px-regular": "19px",
            "--input-gap-regular": "13px",
            "--input-field-py-regular": "5px",
          } as CSSProperties
        }
      >
        <CascaderDemo defaultValue={["china", "hainan", "haikou"]} />
      </div>
    </div>
  ),
};

export const MenuTokens: Story = {
  render: () => (
    <Cascader defaultOpen defaultValue={["a", "b"]}>
      <CascaderTrigger placeholder="菜单 Token" />
      <CascaderContent
        style={
          {
            "--cascader-menu-size-padding-x": "5px",
            "--cascader-menu-size-padding-y": "7px",
            "--cascader-menu-size-gap": "9px",
            "--cascader-menu-size-radius": "13px",
            "--cascader-menu-color-background-default": "rgb(220, 230, 240)",
            "--cascader-menu-color-border-default": "rgb(40, 90, 60)",
            "--cascader-menu-item-group-group-size-padding-y": "11px",
            "--cascader-menu-item-group-group-color-divider-default":
              "rgb(90, 60, 80)",
            "--cascader-menu-item-group-size-padding-x": "17px",
            "--cascader-menu-item-group-size-padding-y": "3px",
            "--cascader-menu-item-group-size-gap": "8px",
            "--cascader-menu-item-group-size-divider-padding-x": "12px",
            "--cascader-menu-item-group-size-divider-padding-y": "5px",
            "--cascader-menu-item-group-size-divider-padding-y-end": "9px",
            "--cascader-menu-item-group-color-divider-default":
              "rgb(110, 70, 90)",
            "--cascader-menu-item-size-icon-width": "22px",
            "--cascader-menu-item-size-icon-height": "30px",
            "--cascader-menu-item-size-title-icon-width": "18px",
            "--cascader-menu-item-size-title-icon-height": "26px",
            "--cascader-menu-item-size-badge-padding-x": "6px",
            "--cascader-menu-item-size-padding-x": "13px",
            "--cascader-menu-item-size-padding-y": "7px",
            "--cascader-menu-item-size-title-padding-y-end": "11px",
            "--cascader-menu-item-size-radius": "9px",
            "--cascader-menu-item-color-text-default": "rgb(30, 50, 70)",
            "--cascader-menu-item-color-group-title-default":
              "rgb(90, 50, 100)",
            "--cascader-menu-item-color-selected-text-default":
              "rgb(40, 80, 60)",
            "--cascader-menu-item-color-selected-background-default":
              "rgb(200, 230, 210)",
          } as CSSProperties
        }
      >
        <CascaderMenu>
          <CascaderColumn>
            <CascaderItemGroup label="父级" showDivider>
              <CascaderItem
                value="a"
                pathPrefix={[]}
                hasChildren
                showLeftIcon
                leftIcon={<GeneralSetting />}
                showBadge
                badge="8"
              >
                Parent
              </CascaderItem>
            </CascaderItemGroup>
            <CascaderItemGroup label="其他">
              <CascaderItem value="c" pathPrefix={[]}>
                Other
              </CascaderItem>
            </CascaderItemGroup>
          </CascaderColumn>
          <CascaderColumn>
            <CascaderItemGroup label="子级">
              <CascaderItem value="b" pathPrefix={["a"]}>
                Child
              </CascaderItem>
              <CascaderItem
                value="heading"
                layout="title"
                showLeftIcon
                leftIcon={<GeneralSetting />}
              >
                Item title
              </CascaderItem>
              <div
                style={
                  {
                    "--cascader-item-px": "21px",
                    "--cascader-item-py": "4px",
                    "--cascader-item-radius": "15px",
                    "--cascader-item-fg": "rgb(100, 60, 40)",
                  } as CSSProperties
                }
              >
                <CascaderItem
                  value="legacy"
                  pathPrefix={["a"]}
                  showLeftIcon
                  leftIcon={<GeneralSetting level="caption" biggerSize />}
                >
                  Legacy override
                </CascaderItem>
              </div>
            </CascaderItemGroup>
          </CascaderColumn>
        </CascaderMenu>
      </CascaderContent>
    </Cascader>
  ),
};

function CascaderMenuModeCases() {
  const { mode, setMode, density, setDensity, effects, setEffects } =
    useTheme();
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
        <Button onClick={() => setEffects(!effects)}>
          效果：{effects ? "ON" : "OFF"}
        </Button>
      </div>
      <Cascader open defaultValue={["selected"]}>
        <CascaderTrigger placeholder="菜单模式验证" />
        <CascaderContent>
          <CascaderMenu>
            <CascaderColumn>
              <CascaderItemGroup label="状态" showDivider>
                <CascaderItem
                  value="title"
                  layout="title"
                  showLeftIcon
                  leftIcon={<GeneralSetting />}
                >
                  Title
                </CascaderItem>
                <CascaderItem
                  value="normal"
                  showLeftIcon
                  leftIcon={<GeneralSetting />}
                  icon={<GeneralSetting />}
                >
                  Normal
                </CascaderItem>
                <CascaderItem
                  value="selected"
                  showLeftIcon
                  leftIcon={<GeneralSetting />}
                  showBadge
                  badge="8"
                >
                  Selected
                </CascaderItem>
                <CascaderItem
                  value="disabled"
                  disabled
                  showLeftIcon
                  leftIcon={<GeneralSetting />}
                >
                  Disabled
                </CascaderItem>
              </CascaderItemGroup>
              <CascaderItemGroup label="其他">
                <CascaderItem value="other">Other</CascaderItem>
              </CascaderItemGroup>
            </CascaderColumn>
          </CascaderMenu>
        </CascaderContent>
      </Cascader>
    </div>
  );
}

export const MenuProjectModes: Story = {
  render: function MenuProjectModesStory() {
    const [target, setTarget] = useState<HTMLDivElement | null>(null);
    return (
      <div ref={setTarget} data-cascader-menu-theme="local">
        {target && (
          <ThemeProvider
            project={cascaderProject}
            projectTarget={target}
            defaultMode="light"
            storageKey="cascader-menu-project-modes"
          >
            <CascaderMenuModeCases />
          </ThemeProvider>
        )}
      </div>
    );
  },
};

export const Search: Story = {
  render: function SearchStory() {
    const [query, setQuery] = useState("");
    const options = [
      { value: "design", label: "Design" },
      { value: "engineering", label: "Engineering" },
      { value: "operations", label: "Operations" },
    ];
    const matches = options.filter((option) =>
      String(option.label).toLowerCase().includes(query.toLowerCase())
    );
    return (
      <Cascader
        options={options}
        defaultOpen
        onOpenChange={(open) => {
          if (!open) setQuery("");
        }}
      >
        <CascaderTrigger placeholder="搜索并选择部门" />
        <CascaderContent
          style={
            {
              "--cascader-menu-item-size-search-padding-x": "11px",
              "--cascader-menu-item-size-search-padding-y": "7px",
              "--cascader-menu-item-size-search-radius": "13px",
            } as CSSProperties
          }
        >
          <CascaderMenu>
            <CascaderColumn>
              <CascaderSearch
                aria-label="搜索部门"
                placeholder="搜索部门"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
              <CascaderItemGroup>
                {matches.map((option) => (
                  <CascaderItem key={option.value} value={option.value}>
                    {option.label}
                  </CascaderItem>
                ))}
              </CascaderItemGroup>
              {matches.length === 0 && <div role="status">没有匹配部门</div>}
            </CascaderColumn>
          </CascaderMenu>
        </CascaderContent>
      </Cascader>
    );
  },
};

function CascaderDemo({
  size = "regular",
  allRound = false,
  placeholder = "请选择所在地区",
  defaultValue,
  defaultOpen = false,
  error = false,
  className = "w-[290px]",
}: {
  size?: CascaderSize;
  allRound?: boolean;
  placeholder?: string;
  defaultValue?: string[];
  defaultOpen?: boolean;
  error?: boolean;
  className?: string;
}) {
  return (
    <CascaderField
      options={regionOptions}
      defaultValue={defaultValue}
      defaultOpen={defaultOpen}
      size={size}
      allRound={allRound}
      placeholder={placeholder}
      error={error}
      leftIcon={<GeneralSetting aria-hidden />}
      rightIcon={<GeneralSetting aria-hidden />}
      className={className}
    />
  );
}

/** Figma Cascader Input — Input State=Empty (`345:11819`). */
export const Empty: Story = {
  render: () => <CascaderDemo />,
};

/** Figma Cascader Input — Input State=Fill (`345:11893`). */
export const Filled: Story = {
  render: () => <CascaderDemo defaultValue={["china", "hainan", "haikou"]} />,
};

/** Figma Cascader Input — Size=Big (`345:11782`). */
export const Big: Story = {
  render: () => (
    <CascaderDemo
      size="big"
      defaultValue={["china", "hainan", "haikou"]}
      className="w-[300px]"
    />
  ),
};

/** Figma Cascader Input — All-Round=ON (`345:12115`). */
export const AllRound: Story = {
  render: () => (
    <CascaderDemo allRound defaultValue={["china", "guangdong", "guangzhou"]} />
  ),
};

/** Figma Cascader — open panel with multi-column menu (`498:72783`). */
export const OpenPanel: Story = {
  render: () => (
    <CascaderDemo defaultOpen defaultValue={["china", "hainan", "haikou"]} />
  ),
};

/** Figma Cascader Input — State=Disable (`345:11967`). */
export const Disabled: Story = {
  render: () => (
    <CascaderField
      options={regionOptions}
      defaultValue={["china", "hainan", "haikou"]}
      disabled
      leftIcon={<GeneralSetting aria-hidden />}
      rightIcon={<GeneralSetting aria-hidden />}
      className="w-[290px]"
    />
  ),
};

/** Figma Cascader Input — error border (matches Select error pattern). */
export const Error: Story = {
  render: () => (
    <CascaderDemo defaultValue={["china", "hainan", "sanya"]} error />
  ),
};

/** Multi-level cascade — parent selection allowed at any level (Figma default). */
export const AnyLevelSelect: Story = {
  render: () => (
    <CascaderField
      options={regionOptions}
      defaultOpen
      defaultValue={["china", "hainan"]}
      changeOnSelect
      leftIcon={<GeneralSetting aria-hidden />}
      className="w-[290px]"
    />
  ),
};

/** Compound composition — manual columns matching Figma menu structure. */
export const CompoundMenu: Story = {
  render: () => (
    <Cascader defaultOpen defaultValue={["a", "a2"]}>
      <CascaderTrigger
        placeholder="请选择产品型号"
        leftIcon={<GeneralSetting aria-hidden />}
        rightIcon={<GeneralSetting aria-hidden />}
        className="w-[290px]"
      />
      <CascaderContent>
        <CascaderMenu>
          <CascaderColumn>
            <CascaderItemGroup label="业务线" showDivider>
              <CascaderItem value="a" pathPrefix={[]} hasChildren>
                服务器产品线
              </CascaderItem>
              <CascaderItem value="b" pathPrefix={[]} hasChildren>
                存储产品线
              </CascaderItem>
              <CascaderItem value="c" pathPrefix={[]}>
                网络产品线
              </CascaderItem>
            </CascaderItemGroup>
            <CascaderItemGroup label="其他" showDivider>
              <CascaderItem value="d" pathPrefix={[]}>
                未分类产品
              </CascaderItem>
            </CascaderItemGroup>
          </CascaderColumn>
          <CascaderColumn>
            <CascaderItemGroup label="子产品线" showDivider>
              <CascaderItem value="a1" pathPrefix={["a"]}>
                通用服务器
              </CascaderItem>
              <CascaderItem value="a2" pathPrefix={["a"]} hasChildren>
                AI 服务器
              </CascaderItem>
            </CascaderItemGroup>
          </CascaderColumn>
          <CascaderColumn>
            <CascaderItemGroup label="型号" showDivider>
              <CascaderItem value="a2x" pathPrefix={["a", "a2"]}>
                AI-100 训练机型
              </CascaderItem>
              <CascaderItem value="a2y" pathPrefix={["a", "a2"]}>
                AI-200 推理机型
              </CascaderItem>
            </CascaderItemGroup>
          </CascaderColumn>
        </CascaderMenu>
      </CascaderContent>
    </Cascader>
  ),
};

/** Figma Cascader Menu Item function variants (`345:12487`). */
export const ItemFunctionVariants: Story = {
  render: () => (
    <div className="w-[200px] rounded-[10px] border border-[var(--select-menu-border)] bg-[var(--select-menu-bg)] p-1.5 shadow-[var(--select-menu-shadow)]">
      <Cascader defaultOpen defaultValue={["selected"]}>
        <CascaderItemGroup label="选项类型" showDivider>
          <CascaderItem value="title" layout="title">
            分组标题
          </CascaderItem>
          <CascaderItem value="simple" pathPrefix={[]} hasChildren>
            Simple Item
          </CascaderItem>
          <CascaderItem value="selected" pathPrefix={[]} hasChildren>
            Selected
          </CascaderItem>
          <CascaderItem value="radio" pathPrefix={[]} itemFunction="radio">
            Radio
          </CascaderItem>
          <CascaderItem
            value="checkbox"
            pathPrefix={[]}
            itemFunction="checkbox"
          >
            Checkbox
          </CascaderItem>
          <CascaderItem
            value="form-radio"
            pathPrefix={[]}
            itemFunction="form-radio"
          >
            Form Radio
          </CascaderItem>
          <CascaderItem
            value="form-checkbox"
            pathPrefix={[]}
            itemFunction="form-checkbox"
          >
            Form Checkbox
          </CascaderItem>
        </CascaderItemGroup>
      </Cascader>
    </div>
  ),
};

/** Multi-group column — last group auto-hides divider; columns hug content width. */
export const GroupDividerAndHugWidth: Story = {
  render: () => (
    <Cascader defaultOpen>
      <CascaderTrigger placeholder="请选择所在地区" className="w-[290px]" />
      <CascaderContent>
        <CascaderMenu>
          <CascaderColumn>
            <CascaderItemGroup label="地区">
              <CascaderItem value="short" pathPrefix={[]} hasChildren>
                华南
              </CascaderItem>
              <CascaderItem value="long" pathPrefix={[]} hasChildren>
                粤港澳大湾区综合服务区
              </CascaderItem>
            </CascaderItemGroup>
            <CascaderItemGroup label="其他">
              <CascaderItem value="leaf" pathPrefix={[]}>
                海外节点
              </CascaderItem>
            </CascaderItemGroup>
          </CascaderColumn>
        </CascaderMenu>
      </CascaderContent>
    </Cascader>
  ),
};

/** Options-driven three-level demo with an opt-in column group header (`groupTitle`). */
export const MultiLevel: Story = {
  render: () => (
    <Cascader
      options={regionOptions}
      defaultOpen
      defaultValue={["china", "hainan", "haikou"]}
    >
      <CascaderTrigger
        placeholder="请选择所在地区"
        leftIcon={<GeneralSetting aria-hidden />}
        className="w-[290px]"
      />
      <CascaderContent>
        <CascaderOptionsMenu groupTitle="地区" />
      </CascaderContent>
    </Cascader>
  ),
};

/** Region cascader — open and hover/click parents to preview column expand animation. */
export const ColumnExpandAnimation: Story = {
  render: () => (
    <CascaderField
      options={regionOptions}
      placeholder="请选择所在地区"
      leftIcon={<GeneralSetting aria-hidden />}
      className="w-[290px]"
    />
  ),
};

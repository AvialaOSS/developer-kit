import type { Meta, StoryObj } from "@storybook/react";
import { useState, type CSSProperties } from "react";
import { Button } from "./button";
import { ThemeProvider, useTheme } from "../theme/theme-provider";
import { parseProject } from "@aviala-design/tokens/project";
import project from "../../../tokens/source/theme-engine/ald.project.json";
import {
  Alert,
  type AlertAppearance,
  type AlertSize,
  type AlertType,
} from "./alert";

const alertProject = parseProject(JSON.stringify(project));
function AlertCases() {
  const {mode,setMode,density,setDensity,effects,setEffects}=useTheme();
  const [custom,setCustom]=useState(false);
  const [clicks,setClicks]=useState(0);
  const [rtl,setRtl]=useState(false);
  const [narrow,setNarrow]=useState(false);
  const [legacy,setLegacy]=useState(false);
  const [longActions,setLongActions]=useState(false);
  return <div className="flex flex-col gap-4">
    <div className="flex gap-4">
      <Button onClick={()=>setMode(mode==="light"?"dark":"light")}>外观：{mode}</Button>
      <Button onClick={()=>setDensity(density==="default"?"mobile-friendly":"default")}>密度：{density}</Button>
      <Button onClick={()=>setEffects(!effects)}>效果：{effects?"ON":"OFF"}</Button>
      <Button onClick={()=>setCustom(!custom)}>覆盖：{custom?"ON":"OFF"}</Button>
      <Button onClick={()=>setRtl(!rtl)}>方向：{rtl?"RTL":"LTR"}</Button>
      <Button onClick={()=>setNarrow(!narrow)}>窄屏：{narrow?"ON":"OFF"}</Button>
      <Button onClick={()=>setLegacy(!legacy)}>旧留白：{legacy?"ON":"OFF"}</Button>
      <Button onClick={()=>setLongActions(!longActions)}>长操作：{longActions?"ON":"OFF"}</Button>
    </div>
    <output>操作次数：{clicks}</output>
    {(["default","small"] as const).flatMap(size=>(["default","light"] as const).flatMap(appearance=>(["info","warning","error","success","neutral"] as const).map(type=><Alert key={`${size}-${appearance}-${type}`} size={size} appearance={appearance} type={type}
      dir={rtl?"rtl":"ltr"}
      quickAction={longActions?"QuickActionWithoutWordBreaksForLayoutVerification":undefined}
      onQuickAction={()=>setClicks(v=>v+1)}
      title={narrow?`${type}: LongTitleWithoutWordBreaksForLayoutVerification`:`${size} ${appearance} ${type}`} description="Supporting details" showActions action={longActions?"PrimaryActionWithoutWordBreaksForLayoutVerification":"继续"} secondaryAction={longActions?"SecondaryActionWithoutWordBreaksForLayoutVerification":"取消"} onSecondaryAction={()=>setClicks(v=>v+1)} onAction={()=>setClicks(v=>v+1)} onDismiss={()=>setClicks(v=>v+1)}
      style={{width:narrow?320:undefined,...(custom?{"--alert-size-info-gap":"13px","--alert-size-info-padding-x":"15px","--alert-size-text-gap":"5px","--alert-size-action-padding-x-start":"40px","--alert-size-icon-width":"20px","--alert-size-icon-height":"24px","--alert-size-icon-padding-y":"2px","--alert-color-text-default":"#123456","--alert-color-description-default":"#705020","--link-color-caption-no-background-custom-text-default":"#603080"}:{}),...(legacy?{"--alert-actions-pl":"12px","--alert-actions-pr":"7px","--alert-secondary-action-fg":"#204060"}:{})} as CSSProperties}
    />)))}
    <Alert title="Title without description" dismissible={false} style={{"--alert-color-text-default":"#123456","--alert-color-description-default":"#705020"} as CSSProperties}/>
  </div>;
}
export const ProjectModes: StoryObj<typeof Alert> = {
  render: function ProjectModesStory(){
    const [target,setTarget]=useState<HTMLDivElement|null>(null);
    return <div ref={setTarget}>{target&&<ThemeProvider project={alertProject} projectTarget={target} defaultMode="light" storageKey="alert-project"><AlertCases/></ThemeProvider>}</div>;
  },
};

const meta: Meta<typeof Alert> = {
  title: "Response And Feedback/Alert",
  component: Alert,
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: "select",
      options: [
        "info",
        "warning",
        "error",
        "success",
        "neutral",
      ] satisfies AlertType[],
    },
    size: {
      control: "select",
      options: ["default", "small"] satisfies AlertSize[],
    },
    appearance: {
      control: "select",
      options: ["default", "light"] satisfies AlertAppearance[],
    },
    showIcon: { control: "boolean" },
    dismissible: { control: "boolean" },
    showActions: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Alert>;

export const Info: Story = {
  args: {
    type: "info",
    size: "default",
    appearance: "default",
    title: "Information",
    description: "Supporting details for this alert message.",
    dismissible: true,
  },
};

export const Warning: Story = {
  args: {
    type: "warning",
    size: "default",
    appearance: "default",
    title: "Warning",
    description: "Please review before continuing.",
    dismissible: true,
  },
};

export const Error: Story = {
  args: {
    type: "error",
    size: "default",
    appearance: "default",
    title: "Something went wrong",
    description: "We could not complete your request.",
    dismissible: true,
  },
};

export const Success: Story = {
  args: {
    type: "success",
    size: "default",
    appearance: "default",
    title: "Success",
    description: "Your changes were saved.",
    dismissible: true,
  },
};

export const Neutral: Story = {
  args: {
    type: "neutral",
    size: "default",
    appearance: "default",
    title: "Neutral",
    description: "General notice without semantic emphasis.",
    dismissible: true,
  },
};

export const LightAppearance: Story = {
  args: {
    type: "info",
    size: "default",
    appearance: "light",
    title: "Light style",
    description: "Filled secondary background without border.",
    dismissible: true,
  },
};

export const Small: Story = {
  args: {
    type: "warning",
    size: "small",
    appearance: "default",
    title: "Compact alert",
    dismissible: true,
  },
};

export const WithQuickAction: Story = {
  args: {
    type: "info",
    size: "default",
    appearance: "default",
    title: "Update available",
    description: "A new version is ready to install.",
    quickAction: "Update now",
    dismissible: true,
  },
};

export const WithFooterActions: Story = {
  args: {
    type: "error",
    size: "default",
    appearance: "default",
    title: "Upload failed",
    description: "The file could not be uploaded.",
    showActions: true,
    action: "Retry",
    secondaryAction: "Cancel",
    dismissible: true,
  },
};

export const WithoutIcon: Story = {
  args: {
    type: "success",
    size: "default",
    appearance: "light",
    title: "No icon",
    description: "Icon hidden via showIcon={false}.",
    showIcon: false,
    dismissible: true,
  },
};

export const NotDismissible: Story = {
  args: {
    type: "info",
    size: "small",
    appearance: "light",
    title: "Persistent notice",
    dismissible: false,
  },
};

const semanticTypes: AlertType[] = [
  "info",
  "warning",
  "error",
  "success",
  "neutral",
];

export const TypeMatrixDefault: Story = {
  render: () => (
    <div className="flex w-[360px] flex-col gap-3">
      {semanticTypes.map((type) => (
        <Alert
          key={type}
          type={type}
          size="default"
          appearance="default"
          title={`${type.charAt(0).toUpperCase()}${type.slice(1)}`}
          description="Secondary caption text"
        />
      ))}
    </div>
  ),
};

export const TypeMatrixLight: Story = {
  render: () => (
    <div className="flex w-[360px] flex-col gap-3">
      {semanticTypes.map((type) => (
        <Alert
          key={type}
          type={type}
          size="default"
          appearance="light"
          title={`${type.charAt(0).toUpperCase()}${type.slice(1)}`}
          description="Secondary caption text"
        />
      ))}
    </div>
  ),
};

export const SizeComparison: Story = {
  render: () => (
    <div className="flex w-[360px] flex-col gap-4">
      <Alert
        type="info"
        size="default"
        appearance="default"
        title="Default size"
        description="Two-line typeface layout with icon and close"
      />
      <Alert type="info" size="small" appearance="default" title="Small size" />
      <Alert
        type="info"
        size="small"
        appearance="light"
        title="Small light style"
      />
    </div>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex w-[360px] flex-col gap-6">
      {semanticTypes.flatMap((type) =>
        (["default", "light"] as AlertAppearance[]).flatMap((appearance) =>
          (["default", "small"] as AlertSize[]).map((size) => (
            <Alert
              key={`${type}-${appearance}-${size}`}
              type={type}
              size={size}
              appearance={appearance}
              title={`${type} / ${appearance} / ${size}`}
              description={size === "default" ? "Description line" : undefined}
            />
          ))
        )
      )}
    </div>
  ),
};

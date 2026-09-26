import type { Meta, StoryObj } from "@storybook/react";
import { useState, type CSSProperties } from "react";
import { SymbolMore } from "@aviala-design/icons";
import { Button } from "./button";
import { ThemeProvider, useTheme } from "../theme/theme-provider";
import { parseProject } from "@aviala-design/tokens/project";
import project from "../../../tokens/source/theme-engine/ald.project.json";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbEllipsisItem,
  BreadcrumbItem,
  BreadcrumbSeparator,
} from "./breadcrumb";

const meta: Meta<typeof Breadcrumb> = {
  title: "Structure Navigation/Breadcrumb",
  component: Breadcrumb,
  tags: ["autodocs"],
};
export default meta;

const breadcrumbProject = parseProject(JSON.stringify(project));
function BreadcrumbCases() {
  const {mode,setMode,density,setDensity}=useTheme();
  const [custom,setCustom]=useState(false);
  const [clicks,setClicks]=useState(0);
  return <div className="flex flex-col gap-6">
    <div className="flex gap-4">
      <Button onClick={()=>setMode(mode==="light"?"dark":"light")}>外观：{mode}</Button>
      <Button onClick={()=>setDensity(density==="default"?"mobile-friendly":"default")}>密度：{density}</Button>
      <Button onClick={()=>setCustom(!custom)}>覆盖：{custom?"ON":"OFF"}</Button>
    </div>
    {(["default","small"] as const).map(size=><Breadcrumb key={size} size={size} style={custom?{
      [`--breadcrumb-size-${size}-gap`]:"9px",
      [`--breadcrumb-item-size-${size}-padding-x`]:"3px",
      [`--breadcrumb-item-size-${size}-wrapper-padding-y`]:"5px",
      [`--breadcrumb-item-size-${size}-content-padding-x`]:"11px",
      [`--breadcrumb-item-size-${size}-content-padding-y`]:"7px",
      [`--breadcrumb-item-size-${size}-storage-padding-y`]:"3px",
      [`--breadcrumb-item-size-${size}-storage-wrapper-padding-y`]:"5px",
      [`--breadcrumb-item-size-${size}-storage-content-padding-x`]:"9px",
      [`--breadcrumb-item-size-${size}-storage-content-padding-y`]:"4px",
      [`--breadcrumb-item-color-${size}-text-default`]:"#123456",
      [`--breadcrumb-item-color-${size}-icon-default`]:"#603080",
      [`--breadcrumb-item-color-${size}-separator-text-default`]:"#705020",
      "--breadcrumb-item-transparency-unselected-text":"0.4",
      "--breadcrumb-item-transparency-unselected-icon":"0.8",
      "--breadcrumb-item-transparency-separator-text":"0.3",
      "--breadcrumb-item-size-default-text-gap":"6px",
      "--breadcrumb-item-color-default-description-default":"#705020",
    } as CSSProperties:undefined}>
      <BreadcrumbItem icon={<SymbolMore/>} description="Parent details" onClick={()=>setClicks(v=>v+1)}>Parent</BreadcrumbItem>
      <BreadcrumbSeparator/>
      <BreadcrumbEllipsis menu={<><BreadcrumbEllipsisItem onClick={()=>setClicks(v=>v+1)}>Library</BreadcrumbEllipsisItem><BreadcrumbEllipsisItem>Docs</BreadcrumbEllipsisItem></>}/>
      <BreadcrumbSeparator/>
      <BreadcrumbItem current description="Current details" icon={<SymbolMore/>}>Current</BreadcrumbItem>
    </Breadcrumb>)}
    <output>点击次数：{clicks}</output>
  </div>;
}
export const ProjectModes: StoryObj<typeof Breadcrumb> = {
  render: function ProjectModesStory(){
    const [target,setTarget]=useState<HTMLDivElement|null>(null);
    return <div ref={setTarget}>{target&&<ThemeProvider project={breadcrumbProject} projectTarget={target} defaultMode="light" storageKey="breadcrumb-project"><BreadcrumbCases/></ThemeProvider>}</div>;
  },
};

export const Default: StoryObj<typeof Breadcrumb> = {
  render: () => (
    <Breadcrumb>
      <BreadcrumbItem href="#">Home</BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbEllipsis
        menu={
          <>
            <BreadcrumbEllipsisItem href="#">Library</BreadcrumbEllipsisItem>
            <BreadcrumbEllipsisItem href="#">Docs</BreadcrumbEllipsisItem>
          </>
        }
      />
      <BreadcrumbSeparator />
      <BreadcrumbItem current>Current</BreadcrumbItem>
    </Breadcrumb>
  ),
};

export const Small: StoryObj<typeof Breadcrumb> = {
  render: () => (
    <Breadcrumb size="small">
      <BreadcrumbItem href="#">Home</BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbEllipsis
        menu={
          <>
            <BreadcrumbEllipsisItem href="#">Library</BreadcrumbEllipsisItem>
            <BreadcrumbEllipsisItem href="#">Docs</BreadcrumbEllipsisItem>
          </>
        }
      />
      <BreadcrumbSeparator />
      <BreadcrumbItem current>Current</BreadcrumbItem>
    </Breadcrumb>
  ),
};

/** Figma Storage item button activated=ON */
export const EllipsisActivated: StoryObj<typeof Breadcrumb> = {
  render: () => {
    const [activated, setActivated] = useState(true);
    return (
      <Breadcrumb>
        <BreadcrumbItem href="#">Home</BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbEllipsis
          activated={activated}
          onActivatedChange={setActivated}
          menu={
            <>
              <BreadcrumbEllipsisItem href="#">Library</BreadcrumbEllipsisItem>
              <BreadcrumbEllipsisItem href="#">Docs</BreadcrumbEllipsisItem>
            </>
          }
        />
        <BreadcrumbSeparator />
        <BreadcrumbItem current>Current</BreadcrumbItem>
      </Breadcrumb>
    );
  },
};

import type { Meta, StoryObj } from "@storybook/react";
import { useState, type CSSProperties } from "react";
import { parseProject } from "@aviala-design/tokens/project";
import project from "../../../tokens/source/theme-engine/ald.project.json";
import { ThemeProvider, useTheme } from "../theme/theme-provider";
import { InputGroup, InputGroupItem, InputGroupAddon } from "./input-group";
import { Input } from "./input";
import { Button } from "./button";

const meta: Meta<typeof InputGroup> = { title: "Information Collect/InputGroup", component: InputGroup, tags: ["autodocs"] };
export default meta;
const standardProject = parseProject(JSON.stringify(project));
function Cases() {
  const {mode,setMode,density,setDensity}=useTheme();
  const [custom,setCustom]=useState(false);
  return <div className="flex flex-col gap-6">
    <div className="flex gap-4">
      <Button onClick={()=>setMode(mode==="light"?"dark":"light")}>外观：{mode}</Button>
      <Button onClick={()=>setDensity(density==="default"?"mobile-friendly":"default")}>密度：{density}</Button>
      <Button onClick={()=>setCustom(!custom)}>覆盖：{custom?"ON":"OFF"}</Button>
    </div>
    <InputGroup data-testid="token-input-group" style={custom?{"--input-group-size-gap":"19px","--input-group-input-size-gap":"13px","--input-group-input-color-text-default":"#123456"} as CSSProperties:undefined}>
      <InputGroupItem><InputGroupAddon>起点</InputGroupAddon><Input aria-label="起点" defaultValue="12" style={{width:100}}/></InputGroupItem>
      <InputGroupItem><InputGroupAddon>终点</InputGroupAddon><Input aria-label="终点" defaultValue="24" style={{width:100}}/></InputGroupItem>
    </InputGroup>
  </div>;
}
export const ProjectModes: StoryObj<typeof InputGroup> = {
  render: function ProjectModesStory() {
    const [target,setTarget]=useState<HTMLDivElement|null>(null);
    return <div ref={setTarget}>{target&&<ThemeProvider project={standardProject} projectTarget={target} defaultMode="light" storageKey="input-group-project"><Cases/></ThemeProvider>}</div>;
  },
};

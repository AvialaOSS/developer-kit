import type { Meta, StoryObj } from "@storybook/react";
import { Card, CardBody, CardBottom, CardHead } from "./card";
import { useState, type CSSProperties } from "react";
import { Button } from "./button";
import { ConfigProvider } from "../config";
import { Select, SelectTrigger, SelectContent, SelectItem } from "./select";
import { ThemeProvider, useTheme } from "../theme/theme-provider";
import { parseProject } from "@aviala-design/tokens/project";
import standardProject from "../../../tokens/source/theme-engine/ald.project.json";

const meta: Meta<typeof Card> = {
  title: "Structure Navigation/Card",
  component: Card,
  tags: ["autodocs"],
};
export default meta;

export const OptionalHeading: StoryObj<typeof Card> = {
  render: () => <Card style={{width:387,maxWidth:"100%"}}>
    <CardHead heading="项目设置" title="工作区" description="保留原有说明文字" trailing={null}/>
    <CardBody>Heading 使用共享 Title 字体等级。</CardBody>
    <CardBottom heading="下一步" title="检查更改" description="确认后保存" actionLabel="保存"/>
  </Card>,
};

const cardProject = parseProject(JSON.stringify(standardProject));
function CardSelect({ label }: { label: string }) {
  return <Select defaultValue="first">
    <SelectTrigger aria-label={label} />
    <SelectContent>
      <SelectItem value="first">第一项</SelectItem>
      <SelectItem value="second">第二项</SelectItem>
    </SelectContent>
  </Select>;
}
function CardModeCases() {
  const {mode,setMode,density,setDensity}=useTheme();
  const [custom,setCustom]=useState(false);
  const [legacy,setLegacy]=useState(false);
  const [narrow,setNarrow]=useState(false);
  const [rtl,setRtl]=useState(false);
  return <div className="flex flex-col gap-6">
    <div className="flex gap-4">
      <Button onClick={()=>setMode(mode==="light"?"dark":"light")}>外观：{mode}</Button>
      <Button onClick={()=>setDensity(density==="default"?"mobile-friendly":"default")}>密度：{density}</Button>
      <Button onClick={()=>setCustom(!custom)}>覆盖：{custom?"ON":"OFF"}</Button>
      <Button onClick={()=>setLegacy(!legacy)}>旧布局：{legacy?"ON":"OFF"}</Button>
      <Button onClick={()=>setNarrow(!narrow)}>长标题窄卡片：{narrow?"ON":"OFF"}</Button>
      <Button onClick={()=>setRtl(!rtl)}>方向：{rtl?"RTL":"LTR"}</Button>
    </div>
    <Card style={{width:387,...(custom?{"--card-size-gap":"6px","--card-size-padding-x":"9px","--card-size-padding-y":"7px","--card-item-body-color-background-default":"#123456","--card-item-body-color-text-default":"#fedcba","--card-item-body-size-content-padding-y":"13px"}:{})} as CSSProperties}>
      <CardHead title="Card title" description="Caption" trailing={null}/>
      <CardBody>Body content</CardBody>
      <CardBottom slotType="action" actionLabel="设置"/>
    </Card>
    <ConfigProvider direction={rtl?"rtl":"ltr"}>
    <div dir={rtl?"rtl":"ltr"} className="flex flex-col gap-6">
    {(["action", "switch", "select"] as const).map(slotType => (
      <Card key={slotType} data-layout-case={slotType} style={{width:narrow?320:600,maxWidth:"100%",...(custom?{
        "--card-item-head-size-heading-padding-y-start":"17px",
        "--card-item-head-size-heading-padding-y-end":"11px",
        "--card-item-head-size-heading-gap":"7px",
        "--card-item-head-size-action-padding-y-start":"13px",
        "--card-item-head-size-action-padding-y-end":"9px",
        "--card-item-head-size-action-gap":"6px",
        "--card-item-bottom-size-action-padding-y-start":"15px",
        "--card-item-bottom-size-action-padding-y-end":"12px",
        "--card-item-bottom-size-action-gap":"5px",
        "--card-item-bottom-size-heading-padding-y-start":"16px",
        "--card-item-bottom-size-heading-padding-y-end":"10px",
        "--card-item-bottom-size-heading-gap":"9px",
        "--card-item-bottom-color-text-default":"#123456",
        "--card-item-bottom-color-description-default":"#705020",
      }:{}),...(legacy?{
        "--card-head-pt":"3px","--card-head-pb":"2px",
        "--card-bottom-pt":"1px","--card-bottom-pb":"6px",
        "--card-trailing-gap":"4px",
      }:{})} as CSSProperties}>
        <CardHead slotType={slotType} title={narrow?"ThemeEngine/component/card/very-long-unbroken-title":`${slotType} title`} description="Caption" actionLabel="设置" select={<CardSelect label="标题选择" />} switchProps={{"aria-label":"标题开关"}}/>
        <CardBottom slotType={slotType} title={narrow?"ThemeEngine/component/card/very-long-unbroken-footer":`${slotType} footer`} description="Footer caption" actionLabel="设置" select={<CardSelect label="底部选择" />} switchProps={{"aria-label":"底部开关"}}/>
      </Card>
    ))}
    </div>
    </ConfigProvider>
  </div>;
}
export const ProjectModes: StoryObj<typeof Card> = {
  render: function ProjectModesStory() {
    const [target,setTarget]=useState<HTMLDivElement|null>(null);
    return <div ref={setTarget}>{target&&<ThemeProvider project={cardProject} projectTarget={target} defaultMode="light" storageKey="card-project-modes"><CardModeCases/></ThemeProvider>}</div>;
  },
};

/** Matches Figma Card composite (738:145715): head title + body + bottom actions */
export const Default: StoryObj<typeof Card> = {
  render: () => (
    <Card style={{ width: 387 }}>
      <CardHead title="Card title" description="Caption" trailing={null} />
      <CardBody>Body content for this card.</CardBody>
      <CardBottom slotType="action" actionLabel="设置" />
    </Card>
  ),
};

export const HeadAction: StoryObj<typeof CardHead> = {
  render: () => (
    <Card style={{ width: 387 }}>
      <CardHead
        slotType="action"
        title="Card title"
        description="Caption"
        actionLabel="设置"
      />
    </Card>
  ),
};

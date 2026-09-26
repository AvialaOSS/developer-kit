import type { Meta, StoryObj } from "@storybook/react";
import { useState, type CSSProperties } from "react";
import { GeneralSetting } from "@aviala-design/icons";
import { parseProject } from "@aviala-design/tokens/project";
import standardProject from "../../../tokens/source/theme-engine/ald.project.json";
import { ThemeProvider, useTheme } from "../theme/theme-provider";
import { SegmentatorGroup, SegmentatorItem } from "./segmentator";
import { Button } from "./button";

const project = parseProject(JSON.stringify(standardProject));
const cssOptions = { remTokenIds: project.tokens.filter(t => t.type === "number" && t.unit === "px" && ["size", "line-height"].includes(t.path[0]!)).map(t => t.id) };

function Cases() {
  const { mode, setMode, density, setDensity, effects, setEffects } = useTheme();
  const [overrides, setOverrides] = useState(false);
  return <>
    <div className="flex flex-wrap gap-2 mb-4">
      <Button onClick={() => setMode(mode === "light" ? "dark" : "light")}>颜色：{mode}</Button>
      <Button onClick={() => setDensity(density === "default" ? "mobile-friendly" : "default")}>密度：{density}</Button>
      <Button onClick={() => setEffects(!effects)}>效果：{effects ? "ON" : "OFF"}</Button>
      <Button onClick={() => setOverrides(!overrides)}>覆盖：{overrides ? "ON" : "OFF"}</Button>
    </div>
    <div className="flex flex-col gap-6">
      {(["nested", "tiled"] as const).map(variant => <div key={variant} className="flex flex-wrap gap-4">
        {(["baseline", "canonical", "legacy", "both"] as const).map(kind => {
          const custom: Record<string,string> = {};
          if (overrides && (kind === "canonical" || kind === "both")) {
            custom[`--segmentator-group-size-${variant}-gap`] = "13px";
            custom[`--segmentator-button-color-${variant}-selected-text-default`] = "rgb(10, 80, 160)";
          }
          if (overrides && (kind === "legacy" || kind === "both")) {
            custom["--segmentator-group-gap"] = "17px";
            custom["--segmentator-selected-fg"] = "rgb(120, 30, 90)";
          }
          return <div key={kind}><p>{variant} / {kind}</p>
            <SegmentatorGroup aria-label={`${variant}-${kind}`} mode={variant} defaultValue="a" style={custom as CSSProperties}>
              <SegmentatorItem value="a" leftIcon={<GeneralSetting aria-hidden />}>选中</SegmentatorItem>
              <SegmentatorItem value="b" leftIcon={<GeneralSetting aria-hidden />} iconOnly aria-label="设置" />
              <SegmentatorItem value="c" disabled>禁用</SegmentatorItem>
            </SegmentatorGroup>
          </div>;
        })}
      </div>)}
    </div>
  </>;
}

function ProjectDemo() {
  const [target,setTarget] = useState<HTMLDivElement|null>(null);
  return <div ref={setTarget} data-testid="segmentator-project-scope" style={{padding:"var(--padding-large)",background:"var(--box-box-normal-background-white1)",color:"var(--text-text-normal-text-black)"}}>
    {target && <ThemeProvider project={project} projectCssOptions={cssOptions} projectTarget={target} storageKey="segmentator-project-demo"><Cases /></ThemeProvider>}
  </div>;
}

export default {title:"Basic Input/Segmentator Project",component:ProjectDemo} satisfies Meta<typeof ProjectDemo>;
export const ModesAndOverrides: StoryObj<typeof ProjectDemo> = {};

import type { Meta, StoryObj } from "@storybook/react";
import { useState, type CSSProperties } from "react";
import { Pagination } from "./pagination";
import { Button } from "./button";
import { ConfigProvider } from "../config";
import { ThemeProvider, useTheme } from "../theme/theme-provider";
import { parseProject } from "@aviala-design/tokens/project";
import standardProject from "../../../tokens/source/theme-engine/ald.project.json";

const meta: Meta<typeof Pagination> = {
  title: "Structure Navigation/Pagination",
  component: Pagination,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Pagination>;

const paginationProject = parseProject(JSON.stringify(standardProject));
function PaginationCases() {
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
      <Button onClick={()=>setLegacy(!legacy)}>旧间距：{legacy?"ON":"OFF"}</Button>
      <Button onClick={()=>setNarrow(!narrow)}>窄宽度：{narrow?"ON":"OFF"}</Button>
      <Button onClick={()=>setRtl(!rtl)}>方向：{rtl?"RTL":"LTR"}</Button>
    </div>
    <ConfigProvider direction={rtl?"rtl":"ltr"}>
    <Pagination pageCount={20} style={{width:narrow?320:undefined,maxWidth:"100%",...(custom?{
      "--pagination-size-gap":"21px","--pagination-size-page-buttons-gap":"9px",
      "--pagination-size-jump-gap":"11px","--pagination-size-page-size-gap":"17px",
      "--pagination-color-text-default":"#705020",
      "--segmentator-group-size-tiled-gap":"13px",
      "--segmentator-button-color-tiled-selected-background-default":"#123456",
      "--segmentator-button-color-tiled-selected-text-default":"#fedcba",
      "--segmentator-button-size-tiled-selected-radius":"12px",
    }:{}),...(legacy?{"--pagination-gap":"12px","--pagination-controls-gap":"3px","--pagination-jump-gap":"7px","--pagination-page-gap":"5px","--pagination-page-active-bg":"#452060","--pagination-page-active-fg":"#ffffff","--pagination-page-radius":"3px"}:{})} as CSSProperties}/>
    </ConfigProvider>
  </div>;
}
export const ProjectModes: Story = {
  render: function ProjectModesStory() {
    const [target,setTarget]=useState<HTMLDivElement|null>(null);
    return <div ref={setTarget}>{target&&<ThemeProvider project={paginationProject} projectTarget={target} defaultMode="light" storageKey="pagination-project"><PaginationCases/></ThemeProvider>}</div>;
  },
};

export const Default: Story = {
  render: () => {
    const [page, setPage] = useState(1);
    return <Pagination page={page} pageCount={10} onPageChange={setPage} />;
  },
};

export const ManyPages: Story = {
  render: () => {
    const [page, setPage] = useState(5);
    return <Pagination page={page} pageCount={20} onPageChange={setPage} />;
  },
};

export const WithSizeChanger: Story = {
  render: () => {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    return (
      <Pagination
        page={page}
        pageCount={12}
        onPageChange={setPage}
        showSizeChanger
        pageSize={pageSize}
        onPageSizeChange={setPageSize}
      />
    );
  },
};

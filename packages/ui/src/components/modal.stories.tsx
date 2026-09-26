import { SymbolInformationCircle } from "@aviala-design/icons";
import type { Meta, StoryObj } from "@storybook/react";
import { useState, type CSSProperties } from "react";
import { ThemeProvider, useTheme } from "../theme/theme-provider";
import { parseProject } from "@aviala-design/tokens/project";
import project from "../../../tokens/source/theme-engine/ald.project.json";
import { Button } from "./button";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeaderText,
  ModalTrigger,
} from "./modal";
import { Stack } from "./stack";

const meta: Meta<typeof Modal> = {
  title: "Information Display/Modal",
  component: Modal,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Modal>;

const modalProject = parseProject(JSON.stringify(project));
function ProjectModal() {
  const { mode, setMode } = useTheme();
  const [custom, setCustom] = useState(false);
  const [legacy, setLegacy] = useState(false);
  return <Modal defaultOpen><ModalContent portalled={false} style={{
    ...(custom ? {
      "--modal-size-radius": "20px", "--modal-size-stroke-width": "2px", "--modal-color-border-default": "#204060",
      "--modal-head-area-color-heading-text-default": "#204060", "--modal-head-area-color-description-text-default": "#603080", "--modal-content-area-color-heading-text-default": "#205030", "--modal-content-area-color-text-text-default": "#704020",
      "--modal-head-area-size-padding-x-start": "20px", "--modal-head-area-size-padding-x-end": "9px", "--modal-head-area-size-padding-y": "3px", "--modal-head-area-size-info-gap": "15px", "--modal-head-area-color-background-default": "#d5e5f5",
      "--modal-content-area-size-padding-x": "18px", "--modal-content-area-size-padding-y": "12px", "--modal-content-area-size-stroke-width": "2px", "--modal-content-area-color-border-default": "#603080", "--modal-content-area-color-background-default": "#f5e5d5",
      "--modal-action-area-size-padding-x": "10px", "--modal-action-area-size-padding-y": "6px", "--modal-action-area-size-stroke-width": "3px", "--modal-action-area-color-border-default": "#204060", "--modal-action-area-color-background-default": "#e5d5f5",
    } : {}),
    ...(legacy ? {"--modal-content-radius":"11px", "--modal-content-bg":"#e0f0e0", "--modal-section-px":"7px", "--modal-section-py":"5px"} : {}),
  } as CSSProperties}>
    <ModalHeaderText title="Modal Token 验证" description="头部、正文与操作区独立覆盖" showClose={false} />
    <ModalBody layout="text" title="正文标题" description="正文内容" />
    <ModalBody layout="text" description="只有正文，没有标题" />
    <ModalBody><div className="flex flex-col gap-2">
      <Button onClick={() => setMode(mode === "light" ? "dark" : "light")}>外观：{mode}</Button>
      <Button onClick={() => setCustom(!custom)}>覆盖：{custom ? "ON" : "OFF"}</Button>
      <Button onClick={() => setLegacy(!legacy)}>旧覆盖：{legacy ? "ON" : "OFF"}</Button>
    </div></ModalBody>
    <ModalFooter><Button>取消</Button><Button mode="primary">确认</Button></ModalFooter>
  </ModalContent></Modal>;
}
export const ProjectModes: Story = {
  render: function ProjectModalStory() {
    const [target, setTarget] = useState<HTMLDivElement | null>(null);
    return <div ref={setTarget}>{target && <ThemeProvider project={modalProject} projectTarget={target} defaultMode="light" storageKey="modal-project"><ProjectModal /></ThemeProvider>}</div>;
  },
};

export const Default: Story = {
  render: () => (
    <Modal>
      <ModalTrigger asChild>
        <Button mode="default">Open modal</Button>
      </ModalTrigger>
      <ModalContent>
        <ModalHeaderText
          showIcon
          icon={
            <SymbolInformationCircle
              thickness="Regular"
              mode="fill"
              aria-hidden
            />
          }
          title="Modal title"
          description="Supporting caption in the header."
        />
        <ModalBody
          layout="text"
          title="Section title"
          description="Body copy for the dialog."
        />
        <ModalFooter>
          <Button mode="second">Cancel</Button>
          <Button mode="primary">Confirm</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  ),
};

export const Large: Story = {
  render: () => (
    <Modal>
      <ModalTrigger asChild>
        <Button mode="primary">Open large modal</Button>
      </ModalTrigger>
      <ModalContent size="large">
        <ModalHeaderText
          title="Large modal"
          description="480px max content width."
        />
        <ModalBody>
          <p>Use the large size for forms or richer content panels.</p>
        </ModalBody>
        <ModalFooter>
          <Button mode="primary">Done</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  ),
};

export const CustomBodySlot: Story = {
  render: () => (
    <Modal>
      <ModalTrigger asChild>
        <Button mode="second">Custom body slot</Button>
      </ModalTrigger>
      <ModalContent>
        <ModalHeaderText title="Custom content" />
        <ModalBody>
          <Stack gap="content">
            <p>Figma `Content=Default` slot — compose any children here.</p>
            <Button mode="default" size="small">
              Inline action
            </Button>
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  ),
};

export const WithoutFooter: Story = {
  render: () => (
    <Modal>
      <ModalTrigger asChild>
        <Button mode="noBackground">No footer</Button>
      </ModalTrigger>
      <ModalContent>
        <ModalHeaderText
          title="Read only"
          description="Dismiss with the header close control."
        />
        <ModalBody
          layout="text"
          description="Informational modal without action buttons."
        />
      </ModalContent>
    </Modal>
  ),
};

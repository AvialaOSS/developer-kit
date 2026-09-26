import type { Meta, StoryObj } from "@storybook/react";
import { EditColorPicker, DirectionArrowDown } from "@aviala-design/icons";
import { useState, type CSSProperties } from "react";
import { ThemeProvider, useTheme } from "../../theme/theme-provider";
import { Button } from "../button";
import { Modal, ModalContent, ModalTitle, ModalTrigger } from "../modal";
import { parseProject } from "@aviala-design/tokens/project";
import project from "../../../../tokens/source/theme-engine/ald.project.json";
import {
  ColorPicker,
  ColorPickerContent,
  ColorPickerTrigger,
  type ColorPickerTriggerProps,
} from "./color-picker";
import { ColorPickerPanel } from "./color-picker-panel";
import { ColorPickButton } from "./color-pick-button";
import { DEFAULT_COLOR } from "./color-utils";

const meta: Meta<typeof ColorPicker> = {
  title: "Information Collect/ColorPicker",
  component: ColorPicker,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ColorPicker>;

export const TriggerIcons: Story = {
  render: () => (
    <ColorPicker defaultValue="#ff5532">
      <ColorPickerTrigger aria-label="选择颜色" leadingIcon={<EditColorPicker />} trailingIcon={<DirectionArrowDown />}
        style={{ "--color-picker-input-size-icon-width": "20px", "--color-picker-input-size-icon-height": "24px" } as CSSProperties} />
      <ColorPickerContent />
    </ColorPicker>
  ),
};

export const PickButtonIcon: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <ColorPickButton color="#ff5532" />
      <ColorPickButton color="#ff5532" trailingIcon={<DirectionArrowDown />} />
      <ColorPickButton color="#ff5532" disabled trailingIcon={<DirectionArrowDown />} />
      <ColorPickButton color="#ff5532" trailingIcon={<DirectionArrowDown />}
        style={{ "--color-pick-button-size-icon-width": "20px", "--color-pick-button-size-icon-height": "24px" } as CSSProperties} />
    </div>
  ),
};

const colorProject = parseProject(JSON.stringify(project));
function ProjectPanelCases() {
  const { mode, setMode, density, setDensity } = useTheme();
  const [custom, setCustom] = useState(false);
  const [legacy, setLegacy] = useState(false);
  return <div className="flex flex-col gap-4" style={{...(custom ? {
    "--color-picker-panel-size-gap":"17px", "--color-picker-panel-size-padding-x":"5px",
    "--color-picker-panel-size-padding-y":"3px", "--color-picker-panel-size-padding-y-end":"13px",
    "--color-picker-panel-size-radius":"19px", "--color-picker-panel-color-background-default":"#d5e5f5",
    "--color-picker-panel-color-border-default":"#204060",
    "--color-picker-input-size-regular-padding-x":"13px", "--color-picker-input-size-regular-padding-y":"2px", "--color-picker-input-size-regular-slot-padding-y":"5px", "--color-picker-input-size-regular-gap":"9px",
    "--color-picker-input-size-big-padding-x":"17px", "--color-picker-input-size-big-padding-y":"3px", "--color-picker-input-size-big-slot-padding-y":"7px", "--color-picker-input-size-big-gap":"11px",
    "--color-picker-input-size-radius":"12px", "--color-picker-input-size-round-radius":"24px", "--color-picker-input-size-preview-radius":"2px", "--color-picker-input-color-background-default":"#d5e5f5", "--color-picker-input-color-background-active":"#f5e5d5", "--color-picker-input-color-border-active":"#603080", "--color-picker-input-color-text-default":"#204060",
    "--base-input-size-regular-padding-x":"12px", "--base-input-size-regular-padding-y":"1px", "--base-input-size-regular-slot-padding-y":"4px", "--base-input-size-regular-gap":"7px",
    "--base-input-size-radius":"5px", "--base-input-color-background-default":"#d5e5f5", "--base-input-color-text-default":"#204060", "--base-input-color-background-active":"#f5e5d5", "--base-input-color-border-active":"#603080",
    "--color-picker-panel-size-pick-area-padding-x":"4px", "--color-picker-panel-size-pick-area-padding-y":"2px", "--color-picker-panel-size-pick-area-padding-y-end":"6px",
    "--color-picker-panel-size-palette-padding-x":"11px", "--color-picker-panel-size-palette-padding-y":"7px", "--color-picker-panel-size-palette-radius":"12px",
    "--color-picker-panel-size-action-area-gap":"5px", "--color-picker-panel-size-action-area-padding-x":"12px", "--color-picker-panel-size-action-area-padding-y":"2px",
    "--color-picker-panel-color-indicator-border-default":"#603080",
    "--color-pick-button-size-preview-width":"18px", "--color-pick-button-size-preview-height":"22px", "--color-pick-button-size-padding-x":"4px", "--color-pick-button-size-padding-y":"2px", "--color-pick-button-size-radius":"12px", "--color-pick-button-size-preview-radius":"3px", "--color-pick-button-color-background-default":"#e5d5f5", "--color-pick-button-color-border-default":"#603080",
  } : {}), ...(legacy ? {"--color-picker-swatch-button-size":"36px", "--color-picker-swatch-button":"24px", "--color-picker-slider-height":"20px", "--color-picker-panel-gap":"7px", "--color-picker-panel-px":"9px", "--color-picker-panel-radius":"11px", "--color-picker-panel-bg":"#f5e5d5", "--color-picker-panel-border":"#603080"} : {})} as CSSProperties}>
    <div className="flex gap-2" data-theme-test-controls>
      <Button onClick={() => setMode(mode === "light" ? "dark" : "light")}>外观：{mode}</Button>
      <Button onClick={() => setDensity(density === "default" ? "mobile-friendly" : "default")}>密度：{density}</Button>
      <Button onClick={() => setCustom(!custom)}>覆盖：{custom ? "ON" : "OFF"}</Button>
      <Button onClick={() => setLegacy(!legacy)}>旧覆盖：{legacy ? "ON" : "OFF"}</Button>
    </div>
    <ColorPickerPanel defaultValue="#ff5532" presets={DEFAULT_PRESETS} showEyedropper={false} />
    <div className="flex items-start gap-2">
      <ColorPicker defaultValue="#ff5532"><ColorPickerTrigger aria-label="Regular trigger" /><ColorPickerContent showEyedropper={false} onInteractOutside={event => {
        if (event.target instanceof Element && event.target.closest('[data-theme-test-controls]')) event.preventDefault();
      }} /></ColorPicker>
      <ColorPicker defaultValue="#ff5532"><ColorPickerTrigger size="big" allRound aria-label="Big round trigger" /><ColorPickerContent showEyedropper={false} /></ColorPicker>
    </div>
  </div>;
}
export const ProjectModes: Story = {
  render: function ProjectPanelStory() {
    const [target, setTarget] = useState<HTMLDivElement | null>(null);
    return <div ref={setTarget}>{target && <ThemeProvider project={colorProject} projectTarget={target} defaultMode="light" storageKey="color-picker-project"><ProjectPanelCases /></ThemeProvider>}</div>;
  },
};

export const InModal: Story = {
  render: function ModalPanelStory() {
    const [target, setTarget] = useState<HTMLDivElement | null>(null);
    return <Modal>
      <ModalTrigger asChild><Button>打开颜色编辑</Button></ModalTrigger>
      <ModalContent aria-describedby={undefined}>
        <ModalTitle>弹窗内的局部主题</ModalTitle>
        <div ref={setTarget}>{target && <ThemeProvider project={colorProject} projectTarget={target} defaultMode="light" storageKey="color-picker-modal"><ProjectPanelCases /></ThemeProvider>}</div>
      </ModalContent>
    </Modal>;
  },
};

/** Demo fixture: swatch values the user picks from, not theme tokens. */
const DEFAULT_PRESETS = [
  "#FF0000",
  "#165DFF",
  "#00B42A",
  "#FF7D00",
  "#F53F3F",
  "#722ED1",
];

function ColorPickerDemo({
  size = "regular",
  allRound = false,
  disabled = false,
  defaultOpen = false,
  defaultValue = DEFAULT_COLOR,
  presets = DEFAULT_PRESETS,
}: {
  size?: ColorPickerTriggerProps["size"];
  allRound?: boolean;
  disabled?: boolean;
  defaultOpen?: boolean;
  defaultValue?: string;
  presets?: string[];
}) {
  const [color, setColor] = useState(defaultValue);
  const [savedPresets, setSavedPresets] = useState(presets);

  return (
    <ColorPicker
      value={color}
      onChange={setColor}
      presets={savedPresets}
      onPresetsChange={setSavedPresets}
      disabled={disabled}
      defaultOpen={defaultOpen}
    >
      <ColorPickerTrigger
        size={size}
        allRound={allRound}
        className="w-[120px]"
      />
      <ColorPickerContent />
    </ColorPicker>
  );
}

export const Default: Story = {
  render: () => <ColorPickerDemo />,
};

/** Open by default — panel enter/exit animation (150ms fade + translate). */
export const OpenByDefault: Story = {
  render: () => <ColorPickerDemo defaultOpen />,
};

export const WithAlpha: Story = {
  /* Demo fixture: literal color data for the picker, not a theme token. */
  render: () => <ColorPickerDemo defaultValue="#FF000080" />,
};

export const Big: Story = {
  render: () => <ColorPickerDemo size="big" />,
};

export const AllRound: Story = {
  render: () => <ColorPickerDemo allRound />,
};

export const Disabled: Story = {
  /* Demo fixture: literal color data for the picker, not a theme token. */
  render: () => <ColorPickerDemo disabled defaultValue="#FF0000" />,
};

export const SizeMatrix: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <ColorPickerDemo size="regular" />
      <ColorPickerDemo size="big" />
      <ColorPickerDemo size="regular" allRound />
      <ColorPickerDemo size="big" allRound />
    </div>
  ),
};

export const PanelStandalone: Story = {
  render: function PanelStandaloneStory() {
    const [color, setColor] = useState(DEFAULT_COLOR);
    const [presets, setPresets] = useState(DEFAULT_PRESETS);

    return (
      <ColorPickerPanel
        value={color}
        onChange={setColor}
        presets={presets}
        onPresetsChange={setPresets}
      />
    );
  },
};

export const SwatchButton: Story = {
  render: function SwatchButtonStory() {
    /* Demo fixture: literal color data for the picker, not a theme token. */
    const [selected, setSelected] = useState("#FF0000");
    return (
      <div className="flex flex-wrap gap-2">
        {DEFAULT_PRESETS.map((color) => (
          <ColorPickButton
            key={color}
            color={color}
            selected={selected === color}
            onClick={() => setSelected(color)}
          />
        ))}
      </div>
    );
  },
};

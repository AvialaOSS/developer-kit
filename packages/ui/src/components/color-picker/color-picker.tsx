import * as PopoverPrimitive from "@radix-ui/react-popover";
import {
  forwardRef,
  useState,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";
import { spiralDebugId } from "../../lib/spiral-debug";
import { cn } from "../../lib/utils";
import { ThemeOverlayContainerProvider, useOverlayPortalContainer } from "../../overlay/overlay-container";
import { useLocaleMessages } from "../../locale";
import { ColorPickerArea } from "./color-picker-area";
import {
  ColorPickerContext,
  useColorPickerContext,
} from "./color-picker-context";
import { ColorPickerInputs } from "./color-picker-inputs";
import { ColorPickerPresets } from "./color-picker-presets";
import { ColorPickerSlider } from "./color-picker-slider";
import {
  useColorPickerState,
  type UseColorPickerStateOptions,
} from "./use-color-picker-state";
import type { ColorFormat } from "./color-utils";

export type ColorPickerProps = UseColorPickerStateOptions & {
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  presets?: string[];
  onPresetsChange?: (presets: string[]) => void;
  maxPresets?: number;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export function ColorPicker({
  children,
  className,
  disabled,
  presets,
  onPresetsChange,
  maxPresets = 8,
  value,
  defaultValue,
  onChange,
  format,
  defaultFormat,
  onFormatChange,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
}: ColorPickerProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const [overlayScope, setOverlayScope] = useState<HTMLDivElement | null>(null);
  const open = controlledOpen ?? uncontrolledOpen;

  const handleOpenChange = (next: boolean) => {
    if (disabled && next) return;
    if (controlledOpen === undefined) {
      setUncontrolledOpen(next);
    }
    onOpenChange?.(next);
  };

  const state = useColorPickerState({
    value,
    defaultValue,
    onChange,
    format,
    defaultFormat,
    onFormatChange,
  });

  const contextValue = {
    ...state,
    open,
    disabled,
    presets,
    onPresetsChange,
    maxPresets,
  };

  return (
    <ThemeOverlayContainerProvider value={overlayScope}>
    <ColorPickerContextProvider value={contextValue}>
      <PopoverPrimitive.Root
        open={open}
        onOpenChange={handleOpenChange}
        modal={false}
      >
        <div
          ref={setOverlayScope}
          className={cn("inline-flex", className)}
          {...spiralDebugId("color-picker")}
        >
          {children}
        </div>
      </PopoverPrimitive.Root>
    </ColorPickerContextProvider>
    </ThemeOverlayContainerProvider>
  );
}

function ColorPickerContextProvider({
  value,
  children,
}: {
  value: NonNullable<
    React.ComponentProps<typeof ColorPickerContext.Provider>["value"]
  >;
  children: ReactNode;
}) {
  return (
    <ColorPickerContext.Provider value={value}>
      {children}
    </ColorPickerContext.Provider>
  );
}

export type ColorPickerTriggerProps = ComponentPropsWithoutRef<
  typeof PopoverPrimitive.Trigger
> & {
  size?: "regular" | "big";
  allRound?: boolean;
  placeholder?: string;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  className?: string;
};

export const ColorPickerTrigger = forwardRef<
  HTMLButtonElement,
  ColorPickerTriggerProps
>(
  (
    { className, size = "regular", allRound = false, placeholder, leadingIcon, trailingIcon, ...props },
    ref
  ) => {
    const locale = useLocaleMessages("ColorPicker");
    const resolvedPlaceholder = placeholder ?? locale.placeholder;
    const { value, open, disabled } = useColorPickerContext();

    return (
      <PopoverPrimitive.Trigger asChild>
        <button
          ref={ref}
          type="button"
          className={cn(
            "aviala-color-picker-trigger aviala-focus-ring",
            className
          )}
          {...spiralDebugId("color-picker.trigger")}
          data-size={size}
          data-all-round={allRound ? "true" : "false"}
          data-open={open ? "true" : "false"}
          data-disabled={disabled ? "true" : undefined}
          disabled={disabled}
          {...props}
        >
          {leadingIcon != null && <span className="aviala-color-picker-trigger__icon" aria-hidden>{leadingIcon}</span>}
          <span
            className="aviala-color-picker-trigger__swatch"
            {...spiralDebugId("color-picker.trigger.swatch")}
          >
            <span
              className="aviala-color-picker-trigger__swatch-inner"
              style={{ backgroundColor: value }}
              aria-hidden
            />
          </span>
          <span
            className="aviala-color-picker-trigger__value"
            {...spiralDebugId("color-picker.trigger.value")}
          >
            <span className="aviala-color-picker-trigger__text">
              {value ? (
                value.replace(/^#/, "").slice(0, 6).toUpperCase()
              ) : (
                <span className="aviala-color-picker-trigger__placeholder">
                  {resolvedPlaceholder}
                </span>
              )}
            </span>
          </span>
          {trailingIcon != null && <span className="aviala-color-picker-trigger__icon" aria-hidden>{trailingIcon}</span>}
        </button>
      </PopoverPrimitive.Trigger>
    );
  }
);
ColorPickerTrigger.displayName = "ColorPickerTrigger";

function isWithinSelectLayer(target: EventTarget | null) {
  return (
    target instanceof Element &&
    (target.closest(".aviala-select-content") !== null ||
      target.closest("[data-radix-select-viewport]") !== null)
  );
}

export type ColorPickerContentProps = ComponentPropsWithoutRef<
  typeof PopoverPrimitive.Content
> & {
  showEyedropper?: boolean;
  showPresets?: boolean;
};

export const ColorPickerContent = forwardRef<
  HTMLDivElement,
  ColorPickerContentProps
>(
  (
    {
      className,
      align = "start",
      sideOffset = 8,
      showEyedropper = true,
      showPresets = true,
      ...props
    },
    ref
  ) => {
    const overlayContainer = useOverlayPortalContainer();
    const { presets, onPresetsChange, maxPresets, disabled } =
      useColorPickerContext();

    return (
      <PopoverPrimitive.Portal container={overlayContainer}>
        <PopoverPrimitive.Content
          ref={ref}
          align={align}
          sideOffset={sideOffset}
          className={cn("aviala-color-picker-content", className)}
          {...spiralDebugId("color-picker.content")}
          onPointerDownOutside={(event) => {
            if (isWithinSelectLayer(event.target)) event.preventDefault();
          }}
          onInteractOutside={(event) => {
            if (isWithinSelectLayer(event.target)) event.preventDefault();
          }}
          onFocusOutside={(event) => event.preventDefault()}
          {...props}
        >
          <div className="aviala-color-picker-panel">
            <ColorPickerArea disabled={disabled} />
            <ColorPickerSlider kind="hue" disabled={disabled} />
            <ColorPickerSlider kind="alpha" disabled={disabled} />
            <ColorPickerInputs
              disabled={disabled}
              showEyedropper={showEyedropper}
            />
            {showPresets ? (
              <ColorPickerPresets
                disabled={disabled}
                presets={presets}
                onPresetsChange={onPresetsChange}
                maxPresets={maxPresets}
              />
            ) : null}
          </div>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    );
  }
);
ColorPickerContent.displayName = "ColorPickerContent";

export type { ColorFormat };

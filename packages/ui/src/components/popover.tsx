import * as PopoverPrimitive from "@radix-ui/react-popover";
import {
  forwardRef,
  useCallback,
  useState,
  type ComponentPropsWithoutRef,
} from "react";
import { typographyVariants } from "./typography";
import { cn } from "../lib/utils";
import { useOverlayPortalContainer } from "../overlay/overlay-container";
import {
  OverlayPointerSvg,
  POPOVER_POINTER,
  TOOLTIP_POINTER,
} from "./overlay-pointer";

export type PopoverProps = ComponentPropsWithoutRef<
  typeof PopoverPrimitive.Root
>;

/**
 * Thin controlled/uncontrolled wrapper around Radix `Popover.Root`. We don't add
 * any custom close-suppression: a non-modal Popover already prevents focus-outside
 * from dismissing (`onFocusOutside` is default-prevented by Radix), so a window
 * blur never closes it — no extra bookkeeping needed, and it keeps Escape a
 * single, predictable dismiss.
 */
export function Popover({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  modal = false,
  ...props
}: PopoverProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isControlled = openProp !== undefined;
  const open = isControlled ? openProp : internalOpen;

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (!isControlled) setInternalOpen(nextOpen);
      onOpenChange?.(nextOpen);
    },
    [isControlled, onOpenChange]
  );

  return (
    <PopoverPrimitive.Root
      open={open}
      onOpenChange={handleOpenChange}
      modal={modal}
      {...props}
    />
  );
}

export const PopoverTrigger = PopoverPrimitive.Trigger;
export const PopoverAnchor = PopoverPrimitive.Anchor;

export type PopoverAppearance = "default" | "tooltip" | "primary";
export type PopoverContentLevel = "caption" | "text";

export type PopoverIconProps = ComponentPropsWithoutRef<"span">;

/** Decorative icon placed in the Popover content slot. */
export const PopoverIcon = forwardRef<HTMLSpanElement, PopoverIconProps>(
  ({ className, ...props }, ref) => (
    <span ref={ref} aria-hidden="true" {...props}
      className={cn("aviala-popover-content__icon", className)} />
  )
);
PopoverIcon.displayName = "PopoverIcon";

export type PopoverContentProps = ComponentPropsWithoutRef<
  typeof PopoverPrimitive.Content
> & {
  /** Render without Portal — use inside nested overlays. */
  portalled?: boolean;
  /** Show a caret arrow pointing at the trigger (Figma with-arrow variant). */
  showArrow?: boolean;
  /** Strip surface and slot padding — consumer controls inner spacing. */
  flush?: boolean;
  /**
   * Visual skin of the surface:
   * - `default` — neutral panel and caret using Popover component tokens.
   * - `tooltip` — shared inverted tooltip skin (Text typography, borderless, solid caret).
   * - `primary` — theme surface and foreground using Popover component tokens.
   */
  appearance?: PopoverAppearance;
  /**
   * Typography level for the surface copy.
   * Defaults to `text`, matching the shared Tooltip surface.
   */
  level?: PopoverContentLevel;
};

export const PopoverContent = forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  PopoverContentProps
>(
  (
    {
      className,
      children,
      align = "center",
      sideOffset = 8,
      collisionPadding = 8,
      portalled = true,
      showArrow = false,
      flush = false,
      appearance = "default",
      level,
      ...props
    },
    ref
  ) => {
    const overlayContainer = useOverlayPortalContainer();
    const isDefaultAppearance = appearance === "default";
    const surfaceLevel = level ?? "text";
    const pointer = appearance === "tooltip" ? TOOLTIP_POINTER : POPOVER_POINTER;

    const content = (
      <PopoverPrimitive.Content
        ref={ref}
        align={align}
        sideOffset={sideOffset}
        collisionPadding={collisionPadding}
        data-appearance={appearance}
        className={cn("aviala-popover-content", className)}
        {...props}
      >
        <div
          className={cn(
            "aviala-popover-content__surface",
            typographyVariants({ level: surfaceLevel })
          )}
          data-flush={flush ? "true" : undefined}
        >
          {appearance === "tooltip" ? children : (
            <div className="aviala-popover-content__slot">{children}</div>
          )}
        </div>
        {showArrow ? (
          <PopoverPrimitive.Arrow
            asChild
            width={pointer.width}
            height={pointer.height}
          >
            <OverlayPointerSvg
              variant={isDefaultAppearance ? "popover" : "default"}
              className="aviala-popover-content__arrow"
              width={pointer.width}
              height={pointer.height}
              path={pointer.path}
              style={appearance === "tooltip" ? {
                width: "var(--tooltip-size-pointer-width)",
                height: "var(--tooltip-size-pointer-height)",
              } : {
                width: "var(--popover-size-pointer-width)",
                height: "var(--popover-size-pointer-height)",
              }}
            />
          </PopoverPrimitive.Arrow>
        ) : null}
      </PopoverPrimitive.Content>
    );

    if (!portalled) return content;

    return (
      <PopoverPrimitive.Portal container={overlayContainer}>
        {content}
      </PopoverPrimitive.Portal>
    );
  }
);
PopoverContent.displayName = PopoverPrimitive.Content.displayName;

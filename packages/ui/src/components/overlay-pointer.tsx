import { forwardRef, type ComponentPropsWithoutRef } from "react";

/** Figma System Composition → Tooltip pointer (14×5). */
export const TOOLTIP_POINTER = {
  width: 14,
  height: 5,
  path: "M14 0L0 0C4.97025 1 3.98967 5 7 5C10.0103 5 9.02975 1 14 0Z",
} as const;

/** Figma Information Display → Popover pointer (14×5). */
export const POPOVER_POINTER = {
  width: 14,
  height: 5,
  path: "M14 0L0 0C3.608921468257904 0 4.173548877239227 5.000000370104402 7 5C9.826451122760773 4.999999629895626 10.391078531742096 0 14 0Z",
} as const;

export type OverlayPointerSvgProps = ComponentPropsWithoutRef<"svg"> & {
  width: number;
  height: number;
  path: string;
  /** Popover caret — stroked outline so the pointer reads on light page backgrounds. */
  variant?: "default" | "popover";
};

/** Curved caret SVG — fill via parent `color` / CSS token on the svg class. */
export const OverlayPointerSvg = forwardRef<SVGSVGElement, OverlayPointerSvgProps>(({
  width,
  height,
  path,
  variant = "default",
  className,
  style,
  ...props
}, ref) => {
  const isPopover = variant === "popover";

  return (
    <svg
      {...props}
      ref={ref}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className={className}
      style={{ width, height, ...style }}
    >
      {isPopover ? (
        <>
          <path d={path} className="aviala-popover-content__arrow-outline" />
          <path d={path} className="aviala-popover-content__arrow-fill" />
        </>
      ) : (
        <path d={path} />
      )}
    </svg>
  );
});
OverlayPointerSvg.displayName = "OverlayPointerSvg";

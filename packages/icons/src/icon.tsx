import type { ComponentType } from "react";
import { applyAvialaIconProps } from "./icon-size";
import { IconFrame, type IconLineHeightFix } from "./icon-frame";
import {
  DEFAULT_ICON_MODE,
  DEFAULT_ICON_THICKNESS,
  type AvialaIconProps,
} from "./types";

export type IconProps = AvialaIconProps & {
  icon: ComponentType<AvialaIconProps>;
  /** Explicit pixel/CSS size; ignored when `level` is set unless both width and height are provided */
  size?: number | string;
  title?: string;
  /** Align the outer box to shared Typography; the SVG size stays independent. */
  lineHeightFix?: IconLineHeightFix | boolean;
};

export function Icon({
  icon: IconComponent,
  size,
  title,
  thickness = DEFAULT_ICON_THICKNESS,
  mode = DEFAULT_ICON_MODE,
  biggerSize,
  level,
  className,
  width,
  height,
  lineHeightFix = "off",
  ...props
}: IconProps) {
  const ariaProps = title
    ? { role: "img" as const, "aria-label": title }
    : { "aria-hidden": true as const };

  const svgProps = applyAvialaIconProps({
    biggerSize,
    level,
    size: level
      ? size
      : (size ?? "var(--icon-size-text, var(--size-regular, 0.875rem))"),
    width,
    height,
    className,
    ...props,
  });

  const glyph = (
    <IconComponent
      {...ariaProps}
      {...svgProps}
      thickness={thickness}
      mode={mode}
    />
  );
  return lineHeightFix === false || lineHeightFix === "off" ? (
    glyph
  ) : (
    <IconFrame level={level} lineHeightFix={lineHeightFix}>
      {glyph}
    </IconFrame>
  );
}

export type {
  AvialaIconProps,
  IconLevel,
  IconMode,
  IconThickness,
} from "./types";

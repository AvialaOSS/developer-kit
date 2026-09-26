import type { HTMLAttributes } from "react";
import type { IconLevel } from "./types";

export type IconLineHeightFix = "off" | "heightOnly" | "both";

export type IconFrameProps = HTMLAttributes<HTMLSpanElement> & {
  level?: IconLevel;
  lineHeightFix?: IconLineHeightFix | boolean;
};

/** Layout only: the glyph keeps its own size inside the typography line box. */
export function IconFrame({
  level = "text",
  lineHeightFix = "heightOnly",
  style,
  ...props
}: IconFrameProps) {
  const alignment =
    lineHeightFix === true
      ? "heightOnly"
      : lineHeightFix === false
        ? "off"
        : lineHeightFix;
  const lineHeight = `var(--typography-${level}-line-height)`;
  return (
    <span
      {...props}
      data-icon-alignment={alignment}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        ...(alignment !== "off" ? { height: lineHeight } : {}),
        ...(alignment === "both" ? { width: lineHeight } : {}),
        ...style,
      }}
    />
  );
}

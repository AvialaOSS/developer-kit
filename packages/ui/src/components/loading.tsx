import { cva, type VariantProps } from "class-variance-authority";
import {
  forwardRef,
  useId,
  type CSSProperties,
  type HTMLAttributes,
} from "react";
import { cn } from "../lib/utils";
import { useLocaleMessages } from "../locale";

/** Figma Components → Loading Icon */
export type LoadingLevel =
  | "display"
  | "headline1"
  | "headline2"
  | "title"
  | "subtitle"
  | "text"
  | "caption";

export type LoadingMode = "theme" | "themeText" | "black" | "white" | "inherit";
export type LoadingAlignment = "heightOnly" | "both" | "off";

const loadingVariants = cva("aviala-loading", {
  variants: {
    level: {
      display: "aviala-loading--level-display",
      headline1: "aviala-loading--level-headline1",
      headline2: "aviala-loading--level-headline2",
      title: "aviala-loading--level-title",
      subtitle: "aviala-loading--level-subtitle",
      text: "aviala-loading--level-text",
      caption: "aviala-loading--level-caption",
    },
    lineHeightFix: {
      true: "aviala-loading--line-height-fix",
      false: "",
    },
  },
  defaultVariants: {
    level: "text",
    lineHeightFix: true,
  },
});

const BUTTON_SIZE_TO_LOADING_LEVEL = {
  tiny: "caption",
  small: "text",
  regular: "text",
  big: "text",
} as const satisfies Record<string, LoadingLevel>;

export type LoadingButtonSize = keyof typeof BUTTON_SIZE_TO_LOADING_LEVEL;

export function loadingLevelForButtonSize(
  size: LoadingButtonSize
): LoadingLevel {
  return BUTTON_SIZE_TO_LOADING_LEVEL[size];
}

/** Conic fill — inline so theme tokens still apply inside SVG foreignObject. */
function loadingRingStyle(mode: LoadingMode): CSSProperties {
  const conic = (legacy: string, start: string, end: string): CSSProperties =>
    ({
      // An absent legacy variable invalidates only this custom property,
      // allowing the gradient start to fall back to its independent token.
      "--_loading-legacy-start": `color-mix(in srgb, var(${legacy}) 0%, transparent)`,
      background: `conic-gradient(from 90deg, var(--_loading-legacy-start, var(${start})) 0deg, var(${legacy}, var(${end})) 360deg)`,
    }) as CSSProperties;

  switch (mode) {
    case "theme":
      return conic(
        "--loading-fg-theme",
        "--loading-icon-color-theme-gradient-start",
        "--loading-icon-color-theme-gradient-end"
      );
    case "themeText":
      return conic(
        "--loading-fg-theme-text",
        "--loading-icon-color-theme-text-gradient-start",
        "--loading-icon-color-theme-text-gradient-end"
      );
    case "black":
      return conic(
        "--loading-fg-black",
        "--loading-icon-color-black-gradient-start",
        "--loading-icon-color-black-gradient-end"
      );
    case "white":
      return conic(
        "--loading-fg-white",
        "--loading-icon-color-white-gradient-start",
        "--loading-icon-color-white-gradient-end"
      );
    case "inherit":
      return {
        background:
          "conic-gradient(from 90deg, color-mix(in srgb, currentColor 0%, transparent) 0deg, currentColor 360deg)",
      };
  }
}

export type LoadingProps = HTMLAttributes<HTMLSpanElement> &
  Omit<VariantProps<typeof loadingVariants>, "lineHeightFix"> & {
    /** true = heightOnly; false = off. `both` aligns width and height. */
    lineHeightFix?: boolean | LoadingAlignment | null;
    /** Ring color source; applied through the inline conic gradient, not a class. */
    mode?: LoadingMode;
    /** Accessible name; omit when decorative (`aria-hidden`). */
    label?: string;
  };

export const Loading = forwardRef<HTMLSpanElement, LoadingProps>(
  (
    {
      className,
      level = "text",
      mode = "theme",
      lineHeightFix = true,
      label,
      ...props
    },
    ref
  ) => {
    const locale = useLocaleMessages("Loading");
    const ringMaskId = `aviala-loading-ring-${useId().replace(/:/g, "")}`;
    const resolvedLabel = label ?? locale.label;
    const isDecorative =
      props["aria-hidden"] === true || props["aria-hidden"] === "true";

    return (
      <span
        ref={ref}
        className={cn(
          loadingVariants({
            level,
            lineHeightFix: !!lineHeightFix && lineHeightFix !== "off",
          }),
          className
        )}
        data-alignment={
          lineHeightFix === "both"
            ? "both"
            : lineHeightFix && lineHeightFix !== "off"
              ? "heightOnly"
              : "off"
        }
        role={isDecorative ? undefined : "status"}
        aria-label={isDecorative ? undefined : resolvedLabel}
        aria-live={isDecorative ? undefined : "polite"}
        {...props}
      >
        <span className="aviala-loading__icon" aria-hidden>
          <svg className="aviala-loading__ring">
            <defs>
              <mask id={ringMaskId} maskUnits="userSpaceOnUse">
                <circle
                  className="aviala-loading__path"
                  cx="50%"
                  cy="50%"
                  fill="none"
                />
              </mask>
            </defs>
            <foreignObject
              width="100%"
              height="100%"
              mask={`url(#${ringMaskId})`}
            >
              <div
                className="aviala-loading__conic"
                style={loadingRingStyle(mode ?? "theme")}
              />
            </foreignObject>
          </svg>
        </span>
      </span>
    );
  }
);

Loading.displayName = "Loading";

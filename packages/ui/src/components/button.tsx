import { Loading, loadingLevelForButtonSize } from "./loading";
import { typographyVariants } from "./typography";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import {
  cloneElement,
  forwardRef,
  isValidElement,
  type ButtonHTMLAttributes,
  type CSSProperties,
  type ReactElement,
  type ReactNode,
} from "react";
import type { AvialaIconProps, IconLevel } from "@aviala-design/icons";
import { IconFrame, resolveIconSizeToken } from "@aviala-design/icons";
import { cloneAvialaIconElement } from "../lib/clone-aviala-icon";
import { resolveIconSlotSizing } from "../lib/icon-slot-sizing";
import { cn } from "../lib/utils";
import { spiralDebugId } from "../lib/spiral-debug";

/** Figma Components → Basic Input → Button */
export type ButtonMode =
  | "primary"
  | "secondary"
  | "tertiary"
  | "tertiaryCustom"
  | "second"
  | "default"
  | "defaultCustom"
  | "outline"
  | "outlineCustom"
  | "noBackground"
  | "noBackgroundCustom"
  | "destructive";

export type ButtonSize = "tiny" | "small" | "regular" | "big";

const sizeLabelLevels = {
  tiny: "caption" as const,
  small: "text" as const,
  regular: "text" as const,
  big: "text" as const,
} as const;

const buttonVariants = cva(
  "aviala-button aviala-focus-ring relative inline-flex shrink-0 cursor-pointer items-center justify-center overflow-hidden border-0 bg-transparent font-sans whitespace-nowrap focus-visible:outline-none disabled:pointer-events-none disabled:cursor-not-allowed",
  {
    variants: {
      mode: {
        primary: "aviala-button--mode-primary",
        secondary: "aviala-button--mode-second",
        tertiary: "aviala-button--mode-default",
        tertiaryCustom: "aviala-button--mode-defaultCustom",
        second: "aviala-button--mode-second",
        default: "aviala-button--mode-default",
        defaultCustom: "aviala-button--mode-defaultCustom",
        noBackground: "aviala-button--mode-noBackground",
        noBackgroundCustom: "aviala-button--mode-noBackgroundCustom",
        outline: "aviala-button--mode-outline",
        outlineCustom: "aviala-button--mode-outlineCustom",
        destructive: "aviala-button--mode-destructive",
      },
      allRound: {
        true: "aviala-button--rounded min-w-[var(--button-min-width-allround,48px)]",
        false: "min-w-[var(--button-min-width,46px)]",
      },
      compact: {
        true: "min-w-0",
        false: "",
      },
    },
    defaultVariants: {
      mode: "primary",
      allRound: false,
    },
  }
);

function resolveMode(
  mode?: ButtonMode | null,
  variant?: LegacyVariant | null
): Exclude<ButtonMode, "secondary" | "tertiary" | "tertiaryCustom"> {
  if (mode === "secondary") return "second";
  if (mode === "tertiary") return "default";
  if (mode === "tertiaryCustom") return "defaultCustom";
  if (mode) return mode;
  switch (variant) {
    case "secondary":
      return "second";
    case "outline":
      return "outline";
    case "ghost":
      return "noBackground";
    case "destructive":
      return "destructive";
    case "link":
      return "noBackground";
    default:
      return "primary";
  }
}

function resolveSize(
  size?: ButtonSize | LegacySize | null,
  iconOnly?: boolean,
  variant?: LegacyVariant | null
): ButtonSize {
  if (
    size === "tiny" ||
    size === "small" ||
    size === "regular" ||
    size === "big"
  ) {
    return size;
  }
  switch (size) {
    case "sm":
      return "small";
    case "lg":
      return "big";
    case "icon":
      return "regular";
    default:
      break;
  }
  if (variant === "link" || iconOnly) return "regular";
  return "regular";
}

type LegacyVariant =
  "default" | "secondary" | "outline" | "ghost" | "destructive" | "link";

type LegacySize = "default" | "sm" | "lg" | "icon";

function hasSurface(mode: ButtonMode): boolean {
  return (
    mode !== "noBackground" &&
    mode !== "noBackgroundCustom" &&
    mode !== "outline" &&
    mode !== "outlineCustom"
  );
}

function renderIcon(
  node: ReactNode,
  iconLevel: IconLevel,
  debugId?: string,
  iconOnly = false
): ReactNode {
  if (!node) return null;

  const slotSizing = resolveIconSlotSizing(node, iconLevel, true);
  const customSize =
    isValidElement<AvialaIconProps>(node) &&
    (node.props.level !== undefined || node.props.biggerSize !== undefined);
  const content = cloneAvialaIconElement(node, {
    level: iconLevel,
    biggerSize: true,
  });

  return (
    <IconFrame
      level={iconLevel}
      lineHeightFix={iconOnly ? "both" : "off"}
      className="aviala-button__icon"
      data-custom-icon-size={customSize || undefined}
      style={
        customSize
          ? ({
              "--button-icon-size": resolveIconSizeToken(
                slotSizing.level,
                slotSizing.biggerSize
              ),
            } as CSSProperties)
          : undefined
      }
      {...(debugId ? spiralDebugId(debugId) : undefined)}
    >
      {content}
    </IconFrame>
  );
}

function resolveIconOnlyIcon(
  leftIcon?: ReactNode,
  icon?: ReactNode,
  children?: ReactNode,
  iconOnly?: boolean
): ReactNode {
  const fromProp = leftIcon ?? icon;
  if (fromProp) return fromProp;
  if (!iconOnly || children == null || children === false) return undefined;
  if (isValidElement(children) && typeof children.type !== "string")
    return children;
  return undefined;
}

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  Omit<VariantProps<typeof buttonVariants>, "mode"> & {
    /** Figma `Mode` — preferred over legacy `variant`. */
    mode?: ButtonMode;
    /** Figma `Size` — preferred over legacy shadcn sizes. */
    size?: ButtonSize | LegacySize;
    /** Figma `All-Round` */
    allRound?: boolean;
    /** Figma `IconOnly` */
    iconOnly?: boolean;
    /** @deprecated Use `mode` instead. */
    variant?: LegacyVariant;
    loading?: boolean;
    /** @deprecated Use `leftIcon`. */
    icon?: ReactNode;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
    asChild?: boolean;
  };

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      mode: modeProp,
      variant,
      size: sizeProp,
      allRound = false,
      compact,
      iconOnly: iconOnlyProp,
      asChild = false,
      loading = false,
      disabled,
      icon,
      leftIcon,
      rightIcon,
      children,
      ...props
    },
    ref
  ) => {
    const mode = resolveMode(modeProp, variant);
    const child =
      asChild && isValidElement<{ children?: ReactNode }>(children)
        ? children
        : undefined;
    const content = child ? child.props.children : children;
    const iconOnly =
      iconOnlyProp ??
      (sizeProp === "icon" ||
        ((!!(leftIcon ?? icon) ||
          (isValidElement(content) && typeof content.type !== "string")) &&
          !rightIcon &&
          ((leftIcon ?? icon) ? !content : true)));
    const size = resolveSize(sizeProp, iconOnly, variant);
    const isDisabled = disabled || loading;
    const showSurface = hasSurface(mode);

    const resolvedLeft = iconOnly
      ? resolveIconOnlyIcon(leftIcon, icon, content, true)
      : (leftIcon ?? icon);
    const label = iconOnly ? null : content;
    const iconLevel = sizeLabelLevels[size];

    const inner = (
      <>
        {showSurface && (
          <span
            aria-hidden
            className="aviala-button-surface pointer-events-none absolute inset-0 rounded-[inherit]"
            {...spiralDebugId("button.surface")}
          />
        )}
        {loading && (
          <Loading
            level={loadingLevelForButtonSize(size)}
            mode="inherit"
            lineHeightFix={false}
            className="aviala-button__loading relative z-[1] shrink-0 text-inherit"
            aria-hidden
          />
        )}
        {!iconOnly && renderIcon(resolvedLeft, iconLevel, "button.icon-left")}
        {iconOnly
          ? renderIcon(resolvedLeft, iconLevel, "button.icon-left", true)
          : label !== null &&
            label !== undefined && (
              <span
                className={cn(
                  typographyVariants({ level: sizeLabelLevels[size] }),
                  "aviala-button__label relative z-[1] shrink-0"
                )}
                {...spiralDebugId("button.label")}
              >
                {label}
              </span>
            )}
        {!iconOnly && renderIcon(rightIcon, iconLevel, "button.icon-right")}
      </>
    );

    const classes = cn(
      buttonVariants({ mode, ...(iconOnly ? {} : { allRound }), compact }),
      iconOnly && "min-w-0",
      iconOnly && allRound && "aviala-button--rounded",
      className
    );

    if (asChild) {
      return (
        <Slot
          className={classes}
          ref={ref}
          data-size={size}
          data-icon-only={iconOnly || undefined}
          aria-busy={loading || undefined}
          aria-disabled={isDisabled || undefined}
          {...props}
        >
          {child ? cloneElement(child, undefined, inner) : children}
        </Slot>
      );
    }

    return (
      <button
        className={classes}
        ref={ref}
        data-size={size}
        data-icon-only={iconOnly || undefined}
        disabled={isDisabled}
        aria-busy={loading || undefined}
        {...spiralDebugId("button")}
        {...props}
      >
        {inner}
      </button>
    );
  }
);
Button.displayName = "Button";

export { buttonVariants };

import { Slot } from "@radix-ui/react-slot";
import type { AvialaIconProps, IconLevel } from "@aviala-design/icons";
import {
  cloneElement,
  forwardRef,
  isValidElement,
  type AnchorHTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from "react";
import { cloneAvialaIconElement } from "../lib/clone-aviala-icon";
import { cn } from "../lib/utils";
import { typographyVariants } from "./typography";

/** Figma Components → Basic Input → Link */
export type LinkLevel = "caption" | "text";
export type LinkMode = "noBackground" | "noBackgroundCustom";

const levelStyles = {
  caption: {
    className: typographyVariants({ level: "caption" }),
  },
  text: {
    className: typographyVariants({ level: "text" }),
  },
} as const;

function renderIcon(node: ReactNode, level: LinkLevel): ReactNode {
  if (!node) return null;
  const customSize =
    isValidElement<AvialaIconProps>(node) &&
    (node.props.level !== undefined || node.props.biggerSize !== undefined);
  const iconLevel: IconLevel = level;
  const content = cloneAvialaIconElement(node, {
    level: iconLevel,
    biggerSize: true,
  });

  return (
    <span
      data-custom-icon-size={customSize || undefined}
      className="aviala-link__icon relative inline-flex shrink-0 items-center justify-center"
    >
      {content}
    </span>
  );
}

export type LinkProps = Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  "disabled"
> & {
  level?: LinkLevel;
  mode?: LinkMode;
  iconOnly?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  asChild?: boolean;
  disabled?: boolean;
};

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  (
    {
      className,
      level = "caption",
      mode = "noBackground",
      iconOnly: iconOnlyProp,
      leftIcon,
      rightIcon,
      children,
      asChild = false,
      disabled,
      ...props
    },
    ref
  ) => {
    const child =
      asChild &&
      isValidElement<AnchorHTMLAttributes<HTMLAnchorElement>>(children)
        ? children
        : undefined;
    const content = child ? child.props.children : children;
    const iconOnly = iconOnlyProp ?? (!!(leftIcon ?? rightIcon) && !content);
    const resolvedLevel = level ?? "caption";
    const Comp = asChild ? Slot : "a";

    const sharedClassName = cn(
      "aviala-link aviala-focus-ring",
      `aviala-link--${resolvedLevel}`,
      iconOnly ? "aviala-link--icon-only" : undefined,
      className
    );
    const { href, onClick, onClickCapture, tabIndex, ...restProps } = props;
    const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
      if (disabled) {
        e.preventDefault();
        return;
      }
      onClick?.(e);
    };

    const inner = (
      <>
        {renderIcon(
          leftIcon ?? (iconOnly ? rightIcon : undefined),
          resolvedLevel
        )}
        {!iconOnly && content !== undefined && content !== null && (
          <span
            className={cn(
              "aviala-link__label relative shrink-0",
              levelStyles[resolvedLevel].className
            )}
          >
            {content}
          </span>
        )}
        {!iconOnly && renderIcon(rightIcon, resolvedLevel)}
      </>
    );
    const handleClickCapture = (e: MouseEvent<HTMLAnchorElement>) => {
      if (disabled) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      onClickCapture?.(e);
    };

    return (
      <Comp
        className={sharedClassName}
        data-mode={mode}
        data-disabled={disabled ? "true" : undefined}
        ref={ref}
        aria-disabled={disabled || undefined}
        {...restProps}
        href={disabled ? undefined : href}
        tabIndex={disabled ? -1 : tabIndex}
        onClick={handleClick}
        onClickCapture={handleClickCapture}
      >
        {child
          ? cloneElement(
              child,
              disabled
                ? {
                    href: undefined,
                    tabIndex: -1,
                    onClick: undefined,
                    onClickCapture: undefined,
                  }
                : {},
              inner
            )
          : inner}
      </Comp>
    );
  }
);
Link.displayName = "Link";

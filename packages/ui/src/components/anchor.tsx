import { Slot } from "@radix-ui/react-slot";
import {
  createElement,
  cloneElement,
  forwardRef,
  isValidElement,
  type AnchorHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "../lib/utils";
import { Typography } from "./typography";

/** Figma Components → System Composition → Anchor */
export type AnchorIndentLevel = 0 | 1 | 2 | 3;

export type AnchorProps = HTMLAttributes<HTMLElement> & {
  as?: "nav" | "div";
};

// JSX resolves a union `as` tag to the intersection of every member's props, which
// no single element ref can satisfy. createElement keeps the ref typed as HTMLElement.
export const Anchor = forwardRef<HTMLElement, AnchorProps>(
  ({ className, as = "nav", ...props }, ref) =>
    createElement(as, {
      ...props,
      ref,
      className: cn("aviala-anchor", className),
    })
);
Anchor.displayName = "Anchor";

export type AnchorItemProps = Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  "children"
> & {
  activated?: boolean;
  indentLevel?: AnchorIndentLevel;
  asChild?: boolean;
  /** Optional secondary caption, matching the Figma Text+Caption slot. */
  description?: ReactNode;
  children: ReactNode;
};

export const AnchorItem = forwardRef<HTMLAnchorElement, AnchorItemProps>(
  (
    {
      className,
      activated = false,
      indentLevel = 0,
      asChild = false,
      description,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "a";
    const child =
      asChild &&
      isValidElement<AnchorHTMLAttributes<HTMLAnchorElement>>(children)
        ? children
        : undefined;
    const content = child ? child.props.children : children;
    const inner = (
      <>
        <span className="aviala-anchor-item__rail" aria-hidden />
        <span className="aviala-anchor-item__content">
          <span className="aviala-anchor-item__surface">
            <span className="aviala-anchor-item__text">
              <Typography
                level="text"
                as="span"
                className="aviala-anchor-item__label"
              >
                {content}
              </Typography>
              {description != null && (
                <Typography
                  level="caption"
                  as="span"
                  className="aviala-anchor-item__description"
                >
                  {description}
                </Typography>
              )}
            </span>
          </span>
        </span>
      </>
    );

    return (
      <Comp
        ref={ref}
        className={cn("aviala-anchor-item aviala-focus-ring", className)}
        data-activated={activated ? "true" : "false"}
        data-indent={String(indentLevel)}
        aria-current={activated ? "location" : undefined}
        {...props}
      >
        {child ? cloneElement(child, {}, inner) : inner}
      </Comp>
    );
  }
);
AnchorItem.displayName = "AnchorItem";

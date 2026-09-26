import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../lib/utils";
import { Typography, type TypographyLevel } from "./typography";

/** Figma Components → Structure Navigation → Pagehead (643:172156) */

export type PageheadProps = Omit<HTMLAttributes<HTMLElement>, "title"> & {
  /** Optional leading control (typically back button) */
  back?: ReactNode;
  /** Optional breadcrumb above the title */
  breadcrumb?: ReactNode;
  /** Primary title line */
  title?: ReactNode;
  /** Shared typography scale; does not change the document heading hierarchy. */
  titleLevel?: TypographyLevel;
  /** Semantic title element, independent from its visual size. */
  titleAs?: "span" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  /** Secondary caption under title */
  description?: ReactNode;
  /** Trailing actions slot */
  actions?: ReactNode;
};

export const Pagehead = forwardRef<HTMLElement, PageheadProps>(
  (
    {
      className,
      back,
      breadcrumb,
      title,
      titleLevel = "text",
      titleAs = "span",
      description,
      actions,
      children,
      ...props
    },
    ref
  ) => (
    <header ref={ref} className={cn("aviala-pagehead", className)} {...props}>
      <div className="aviala-pagehead__main">
        {back != null ? (
          <div className="aviala-pagehead__back">{back}</div>
        ) : null}
        <div className="aviala-pagehead__title-block">
          {breadcrumb != null ? (
            <div className="aviala-pagehead__breadcrumb">{breadcrumb}</div>
          ) : null}
          {title != null || description != null ? (
            <div className="aviala-pagehead__title">
              <div className="aviala-typeface" data-content="textCaption">
                {title != null && <Typography as={titleAs} level={titleLevel} className={cn(
                  "aviala-pagehead__text",
                  ["display", "headline1", "headline2", "title"].includes(titleLevel) && "aviala-pagehead__heading",
                  titleLevel === "caption" && "aviala-pagehead__description"
                )}>{title}</Typography>}
                {description != null && <Typography level="caption" className="aviala-pagehead__description">{description}</Typography>}
              </div>
            </div>
          ) : null}
          {children}
        </div>
      </div>
      {actions != null ? (
        <div className="aviala-pagehead__actions">{actions}</div>
      ) : null}
    </header>
  )
);
Pagehead.displayName = "Pagehead";

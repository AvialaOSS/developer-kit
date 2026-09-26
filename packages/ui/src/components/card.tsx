import {
  DirectionArrowLeftLight,
  DirectionArrowRightLight,
  GeneralSetting,
} from "@aviala-design/icons";
import {
  cloneElement,
  forwardRef,
  isValidElement,
  type ComponentPropsWithoutRef,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
} from "react";
import { useRtl } from "../config";
import { cn } from "../lib/utils";
import { useLocaleMessages } from "../locale";
import { Button } from "./button";
import { ButtonGroup } from "./button-group";
import { Switch, type SwitchProps } from "./switch";
import { Typeface } from "./typeface";
import { Typography } from "./typography";

/** Figma Components → Structure Navigation → Card (738:145715) */
export type CardSlotType = "action" | "switch" | "select";

export type CardProps = HTMLAttributes<HTMLDivElement>;

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn("aviala-card", className)} {...props}>
      {children}
    </div>
  )
);
Card.displayName = "Card";

function renderCardIcon(node: ReactNode, section: "head" | "bottom" = "head"): ReactNode {
  if (!node) return null;
  const content =
    isValidElement(node) && typeof node.type !== "string"
      ? cloneElement(
          node as ReactElement<{
            width?: number | string;
            height?: number | string;
            className?: string;
          }>,
          {
            width: `var(--card-item-${section}-size-icon-width)`,
            height: `var(--card-item-${section}-size-icon-width)`,
            className: cn(
              (node as ReactElement<{ className?: string }>).props.className,
              "shrink-0"
            ),
          }
        )
      : node;

  return <span className={section === "head" ? "aviala-card-head__icon" : "aviala-card-bottom__heading-icon"}>{content}</span>;
}

export type CardHeadProps = Omit<ComponentPropsWithoutRef<"div">, "title"> & {
  slotType?: CardSlotType;
  icon?: ReactNode;
  /** Optional Title-level row above the existing title and description. */
  heading?: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  actionLabel?: ReactNode;
  action?: ReactNode;
  secondaryAction?: ReactNode;
  select?: ReactNode;
  switchProps?: Omit<SwitchProps, "size">;
  trailing?: ReactNode;
};

export const CardHead = forwardRef<HTMLDivElement, CardHeadProps>(
  (
    {
      className,
      slotType = "select",
      icon,
      heading,
      title,
      description,
      actionLabel,
      action,
      secondaryAction,
      select,
      switchProps,
      trailing,
      children,
      ...props
    },
    ref
  ) => {
    const locale = useLocaleMessages("Card");
    const rtl = useRtl();
    const ChevronIcon = rtl
      ? DirectionArrowLeftLight
      : DirectionArrowRightLight;
    const primaryAction =
      action ??
      (actionLabel != null ? (
        <Button
          mode="primary"
          size="regular"
          leftIcon={<GeneralSetting aria-hidden />}
        >
          {actionLabel}
        </Button>
      ) : null);

    const renderTrailing = () => {
      if (trailing !== undefined) {
        return trailing == null ? null : (
          <div className="aviala-card-head__trailing">{trailing}</div>
        );
      }

      switch (slotType) {
        case "action":
          return (
            <div className="aviala-card-head__trailing">
              <ButtonGroup className="aviala-card__button-group">
                  {primaryAction}
                  {secondaryAction ?? (
                    <Button
                      mode="default"
                      size="regular"
                      iconOnly
                      aria-label={locale.more}
                      leftIcon={<GeneralSetting aria-hidden />}
                    />
                  )}
                </ButtonGroup>
              <span className="aviala-card__divider" aria-hidden />
              <span className="aviala-card-head__action-icon"><ChevronIcon width="var(--card-item-head-size-icon-width)" height="var(--card-item-head-size-icon-width)" aria-hidden /></span>
            </div>
          );
        case "switch":
          return (
            <div className="aviala-card-head__trailing">
              {primaryAction}
              <span className="aviala-card__divider" aria-hidden />
              <Switch {...switchProps} />
            </div>
          );
        case "select":
        default:
          return select != null || primaryAction != null ? (
            <div className="aviala-card-head__trailing">
              {primaryAction}
              {select != null && primaryAction != null && <span className="aviala-card__divider" aria-hidden />}
              {select}
            </div>
          ) : null;
      }
    };

    return (
      <div
        ref={ref}
        className={cn("aviala-card-head", className)}
        data-type={slotType}
        {...props}
      >
        <div className="aviala-card-head__main">
          {/* Figma Card item head always includes a leading icon slot */}
          {renderCardIcon(icon ?? <GeneralSetting aria-hidden />)}
          <div className="aviala-card-head__title">
            {heading != null && heading !== false && (
              <Typography level="title" className="aviala-card-head__heading">{heading}</Typography>
            )}
            {title != null || description != null ? (
              <Typeface
                content="textCaption"
                primary={title}
                secondary={description}
              />
            ) : (
              children
            )}
          </div>
        </div>
        {renderTrailing()}
      </div>
    );
  }
);
CardHead.displayName = "CardHead";

export type CardBodyProps = HTMLAttributes<HTMLDivElement>;

export const CardBody = forwardRef<HTMLDivElement, CardBodyProps>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn("aviala-card-body", className)} {...props}>
      <div className="aviala-card-body__content">
        {typeof children === "string" || typeof children === "number" ? (
          <Typography level="text" as="span">
            {children}
          </Typography>
        ) : (
          children
        )}
      </div>
    </div>
  )
);
CardBody.displayName = "CardBody";

export type CardBottomProps = Omit<ComponentPropsWithoutRef<"div">, "title"> & {
  /** Optional Title-level row above the existing title and description. */
  heading?: ReactNode;
  /** Optional supporting title; omitted by the Figma Card composite. */
  title?: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  slotType?: CardSlotType;
  actionLabel?: ReactNode;
  action?: ReactNode;
  secondaryAction?: ReactNode;
  select?: ReactNode;
  switchProps?: Omit<SwitchProps, "size">;
  trailing?: ReactNode;
};

export const CardBottom = forwardRef<HTMLDivElement, CardBottomProps>(
  (
    {
      className,
      slotType = "action",
      heading,
      title,
      description,
      icon,
      actionLabel,
      action,
      secondaryAction,
      select,
      switchProps,
      trailing,
      children,
      ...props
    },
    ref
  ) => {
    const locale = useLocaleMessages("Card");
    const rtl = useRtl();
    const ChevronIcon = rtl
      ? DirectionArrowLeftLight
      : DirectionArrowRightLight;
    const primaryAction =
      action ??
      (actionLabel != null ? (
        <Button
          mode="primary"
          size="regular"
          leftIcon={<GeneralSetting aria-hidden />}
        >
          {actionLabel}
        </Button>
      ) : null);

    const renderTrailing = () => {
      if (trailing !== undefined) return trailing;
      if (children != null) return children;

      switch (slotType) {
        case "switch":
          return (
            <>
              {primaryAction}
              <span className="aviala-card__divider" aria-hidden />
              <Switch {...switchProps} />
            </>
          );
        case "select":
          return (
            <>
              {select}
              {select != null && primaryAction != null && <span className="aviala-card__divider" aria-hidden />}
              {primaryAction}
            </>
          );
        case "action":
        default:
          return (
            <>
              <ButtonGroup className="aviala-card__button-group">
                  {primaryAction}
                  {secondaryAction ?? (
                    <Button
                      mode="default"
                      size="regular"
                      iconOnly
                      aria-label={locale.more}
                      leftIcon={<GeneralSetting aria-hidden />}
                    />
                  )}
                </ButtonGroup>
              <span className="aviala-card__divider" aria-hidden />
              <span className="aviala-card-bottom__icon"><ChevronIcon width="var(--card-item-bottom-size-icon-width)" height="var(--card-item-bottom-size-icon-width)" aria-hidden /></span>
            </>
          );
      }
    };

    return (
      <div
        ref={ref}
        className={cn("aviala-card-bottom", className)}
        data-type={slotType}
        {...props}
      >
        {((heading != null && heading !== false) || title != null || description != null || icon != null) && (
          <div className="aviala-card-bottom__main">
            {renderCardIcon(icon ?? <GeneralSetting aria-hidden />, "bottom")}
            <div className="aviala-card-bottom__title">
              {heading != null && heading !== false && (
                <Typography level="title" className="aviala-card-bottom__heading">{heading}</Typography>
              )}
              {(title != null || description != null) && <Typeface content="textCaption" primary={title} secondary={description} />}
            </div>
          </div>
        )}
        <div className="aviala-card-bottom__trailing">{renderTrailing()}</div>
      </div>
    );
  }
);
CardBottom.displayName = "CardBottom";

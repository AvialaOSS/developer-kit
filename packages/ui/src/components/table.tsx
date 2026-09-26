import { UsersUser } from "@aviala-design/icons";
import {
  cloneElement,
  forwardRef,
  isValidElement,
  type ComponentPropsWithoutRef,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
} from "react";
import { cn } from "../lib/utils";
import { Avatar } from "./avatar";
import { Badge } from "./badge";
import { Checkbox } from "./checkbox";
import { Switch, type SwitchProps } from "./switch";
import { Typography } from "./typography";

/** Figma Components → Information Display → Table (953:75844 / 1457:1475) */
export type TableCellContent =
  | "text"
  | "icon+text"
  | "icon-place+text"
  | "people"
  | "badge"
  | "switch"
  | "action"
  | "checkbox";

export type TableProps = HTMLAttributes<HTMLDivElement> & {
  /** Freeze header row while the table body scrolls */
  stickyHeader?: boolean;
};

export const Table = forwardRef<HTMLDivElement, TableProps>(
  ({ className, stickyHeader = false, children, ...props }, ref) => (
    <div
      ref={ref}
      role="table"
      className={cn("aviala-table", className)}
      data-sticky-header={stickyHeader ? "true" : undefined}
      {...props}
    >
      {children}
    </div>
  )
);
Table.displayName = "Table";

export type TableRowProps = HTMLAttributes<HTMLDivElement> & {
  header?: boolean;
};

export const TableRow = forwardRef<HTMLDivElement, TableRowProps>(
  ({ className, header = false, children, ...props }, ref) => (
    <div
      ref={ref}
      role="row"
      className={cn("aviala-table__row", className)}
      data-header={header ? "true" : undefined}
      {...props}
    >
      {children}
    </div>
  )
);
TableRow.displayName = "TableRow";

function renderCellIcon(node: ReactNode, sized = true): ReactNode {
  if (!node) return null;
  const content =
    sized && isValidElement(node) && typeof node.type !== "string"
      ? cloneElement(
          node as ReactElement<{
            width?: number | string;
            height?: number | string;
            className?: string;
          }>,
          {
            width: "100%",
            height: "100%",
            className: cn(
              (node as ReactElement<{ className?: string }>).props.className,
              "shrink-0"
            ),
          }
        )
      : node;

  return <span className="aviala-table-cell__icon">{content}</span>;
}

function renderHeadIcon(node: ReactNode): ReactNode {
  if (node == null || node === false) return null;
  const content =
    isValidElement(node) && typeof node.type !== "string"
      ? cloneElement(
          node as ReactElement<{ width?: string; height?: string }>,
          {
            width: "var(--table-head-size-icon-width)",
            height: "var(--table-head-size-icon-width)",
          }
        )
      : node;
  return (
    <span className="aviala-table-head__icon-slot">
      <span className="aviala-table-head__icon">{content}</span>
    </span>
  );
}

function TableCellDefaultAvatar() {
  return (
    <Avatar
      content="icon"
      level="display"
      lineHeightFix={false}
      icon={<UsersUser aria-hidden />}
    />
  );
}

function renderTextBlock(text: ReactNode, caption?: ReactNode) {
  return (
    <span className="aviala-table-cell__text">
      <Typography level="text" as="span" className="aviala-table-cell__title">
        {text}
      </Typography>
      {caption != null && caption !== false ? (
        <Typography
          level="caption"
          as="span"
          className="aviala-table-cell__caption"
        >
          {caption}
        </Typography>
      ) : null}
    </span>
  );
}

function renderActions(actions: ReactNode) {
  if (actions == null) return null;
  return <div className="aviala-table-cell__actions">{actions}</div>;
}

function renderCellBody(
  main: ReactNode,
  actions?: ReactNode,
  leading?: ReactNode
) {
  return (
    <>
      {leading != null && (
        <div className="aviala-table-cell__leading">{leading}</div>
      )}
      <div className="aviala-table-cell__body">
        <div className="aviala-table-cell__main">{main}</div>
        {renderActions(actions)}
      </div>
    </>
  );
}

export type TableHeadProps = ComponentPropsWithoutRef<"div"> & {
  content?: Extract<TableCellContent, "text" | "checkbox">;
  /** Optional leading/trailing icon slots in the default header variant. */
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  /** Header trailing button area (Figma Table Head Default) */
  actions?: ReactNode;
  /** Select-all / indeterminate / unchecked via Checkbox props */
  checkboxProps?: ComponentPropsWithoutRef<typeof Checkbox>;
};

export const TableHead = forwardRef<HTMLDivElement, TableHeadProps>(
  (
    {
      className,
      content = "text",
      leftIcon,
      rightIcon,
      actions,
      checkboxProps,
      children,
      ...props
    },
    ref
  ) => {
    const renderBody = () => {
      if (content === "checkbox") {
        return children ?? <Checkbox {...checkboxProps} />;
      }

      if (children != null) {
        return (
          <>
            <span className="aviala-table-cell__main">
              {typeof children === "string" || typeof children === "number" ? (
                <Typography
                  level="text"
                  as="span"
                  className="aviala-table-head__title"
                >
                  {children}
                </Typography>
              ) : (
                children
              )}
            </span>
            {renderActions(actions)}
          </>
        );
      }

      return null;
    };

    return (
      <div
        ref={ref}
        role="columnheader"
        className={cn("aviala-table-head", className)}
        data-content={content}
        {...props}
      >
        <div className="aviala-table-head__content">
          {content !== "checkbox" && renderHeadIcon(leftIcon)}
          {renderBody()}
          {content !== "checkbox" && renderHeadIcon(rightIcon)}
        </div>
      </div>
    );
  }
);
TableHead.displayName = "TableHead";

export type TableCellProps = ComponentPropsWithoutRef<"div"> & {
  content?: TableCellContent;
  icon?: ReactNode;
  /** Shaped icon place (Figma `icon place+text`) */
  iconPlace?: ReactNode;
  text?: ReactNode;
  /** Secondary caption under primary text (Figma Typeface pair) */
  caption?: ReactNode;
  people?: ReactNode;
  badge?: ReactNode;
  badgeLabel?: ReactNode;
  switchProps?: SwitchProps;
  /** Trailing button area — supported on text / icon / people / badge / action */
  actions?: ReactNode;
  /** Optional leading grabber control */
  grabber?: ReactNode;
  checkboxProps?: ComponentPropsWithoutRef<typeof Checkbox>;
};

export const TableCell = forwardRef<HTMLDivElement, TableCellProps>(
  (
    {
      className,
      content = "text",
      icon,
      iconPlace,
      text,
      caption,
      people,
      badge,
      badgeLabel,
      switchProps,
      actions,
      grabber,
      checkboxProps,
      children,
      ...props
    },
    ref
  ) => {
    const renderContent = () => {
      if (children != null) return children;

      switch (content) {
        case "checkbox":
          return <Checkbox {...checkboxProps} />;
        case "switch":
          return (
            <div className="aviala-table-cell__headline">
              <Switch {...switchProps} />
            </div>
          );
        case "action":
          return renderActions(actions);
        case "icon+text":
          return (
            <>
              {grabber}
              {renderCellBody(
                renderTextBlock(text, caption),
                actions,
                renderCellIcon(icon)
              )}
            </>
          );
        case "icon-place+text": {
          const iconPlaceNode = iconPlace ?? renderCellIcon(icon, false);
          return (
            <>
              {grabber}
              {renderCellBody(
                renderTextBlock(text, caption),
                actions,
                iconPlaceNode != null ? (
                  <span className="aviala-table-cell__icon-place">
                    {iconPlaceNode}
                  </span>
                ) : null
              )}
            </>
          );
        }
        case "people":
          return (
            <>
              {grabber}
              {renderCellBody(
                renderTextBlock(text, caption),
                actions,
                people ?? <TableCellDefaultAvatar />
              )}
            </>
          );
        case "badge":
          return (
            <>
              {grabber}
              {renderCellBody(
                <div className="aviala-table-cell__headline">
                  {badge ??
                    (badgeLabel != null ? (
                      <Badge style="theme" level="caption">
                        {badgeLabel}
                      </Badge>
                    ) : null)}
                </div>,
                actions
              )}
            </>
          );
        case "text":
        default:
          return (
            <>
              {grabber}
              {renderCellBody(renderTextBlock(text, caption), actions)}
            </>
          );
      }
    };

    return (
      <div
        ref={ref}
        role="cell"
        className={cn("aviala-table-cell", className)}
        data-content={content}
        data-custom-content={children != null ? "true" : undefined}
        {...props}
      >
        {children != null ? (
          children
        ) : (
          <div className="aviala-table-cell__content">{renderContent()}</div>
        )}
      </div>
    );
  }
);
TableCell.displayName = "TableCell";

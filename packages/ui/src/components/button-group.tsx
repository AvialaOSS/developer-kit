import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../lib/utils";
import { Typography } from "./typography";

export interface ButtonGroupProps extends HTMLAttributes<HTMLDivElement> {
  /** Optional Figma Text Slot; omitted by default. */
  description?: ReactNode;
}

/** Figma Button Group (530:57323): horizontal actions and optional caption. */
export const ButtonGroup = forwardRef<HTMLDivElement, ButtonGroupProps>(
  ({ className, children, description, ...props }, ref) => (
    <div ref={ref} className={cn("aviala-button-group", className)} {...props}>
      <div className="aviala-button-group__buttons">{children}</div>
      {description != null && description !== false && description !== "" && (
        <Typography level="caption" className="aviala-button-group__description">{description}</Typography>
      )}
    </div>
  )
);
ButtonGroup.displayName = "ButtonGroup";

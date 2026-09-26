import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../lib/utils";
import { typographyVariants } from "./typography";

export type InputGroupProps = HTMLAttributes<HTMLDivElement> & {
  orientation?: "horizontal" | "vertical";
};

export const InputGroup = forwardRef<HTMLDivElement, InputGroupProps>(
  ({ className, orientation = "horizontal", ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex",
        orientation === "horizontal"
          ? "flex-row items-center gap-[var(--input-group-gap,var(--input-group-size-gap))]"
          : "flex-col gap-[var(--gap-inside,4px)]",
        className
      )}
      {...props}
    />
  )
);
InputGroup.displayName = "InputGroup";

/** Figma InputGroupInput: optional prefix and an independently styled input. */
export const InputGroupItem = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex min-w-0 items-center gap-[var(--input-group-input-size-gap)]", className)} {...props} />
  )
);
InputGroupItem.displayName = "InputGroupItem";

export const InputGroupAddon = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex items-center shrink-0",
      typographyVariants({ level: "text" }),
      "aviala-input-group-addon",
      className
    )}
    {...props}
  />
));
InputGroupAddon.displayName = "InputGroupAddon";

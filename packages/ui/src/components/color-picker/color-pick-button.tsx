import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "../../lib/utils";
import { parseColor } from "./color-utils";

export type ColorPickButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "color"
> & {
  color: string;
  selected?: boolean;
  /** Optional decorative icon after the color preview. */
  trailingIcon?: ReactNode;
};

export const ColorPickButton = forwardRef<
  HTMLButtonElement,
  ColorPickButtonProps
>(
  (
    { className, color, selected = false, trailingIcon, style, ...props },
    ref
  ) => {
    const swatch = parseColor(color).toHex();

    return (
      <button
        ref={ref}
        type="button"
        aria-label={color}
        aria-pressed={selected}
        className={cn("aviala-color-pick-button aviala-focus-ring", className)}
        data-selected={selected ? "true" : undefined}
        style={style}
        {...props}
      >
        <span
          className="aviala-color-pick-button__swatch"
          style={{ backgroundColor: swatch }}
          aria-hidden
        />
        {trailingIcon != null && (
          <span className="aviala-color-pick-button__icon" aria-hidden>
            {trailingIcon}
          </span>
        )}
      </button>
    );
  }
);
ColorPickButton.displayName = "ColorPickButton";

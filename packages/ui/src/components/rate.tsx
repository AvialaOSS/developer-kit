import { CommunicateLike, SymbolStar } from "@aviala-design/icons";
import { forwardRef, useState, type CSSProperties, type HTMLAttributes } from "react";
import { cn } from "../lib/utils";

export type RateSize = "default" | "small" | "big";
export type RateType = "star" | "like";
export type RateIconStatus = "empty" | "half" | "fill";
export interface RateIconProps extends HTMLAttributes<HTMLSpanElement> {
  size?: RateSize;
  type?: RateType;
  status?: RateIconStatus;
}

/** Figma Rateicon (518:55703): independent background and masked foreground. */
export const RateIcon = forwardRef<HTMLSpanElement, RateIconProps>(function RateIcon(
  { size = "default", type = "star", status = "empty", className, style, ...props }, ref,
) {
  const scale = size === "default" ? "regular" : size;
  const Icon = type === "like" ? CommunicateLike : SymbolStar;
  const variables = {
    "--rate-icon-width": `var(--rate-icon-size-${scale}-background-width)`,
    "--rate-icon-foreground-width": `var(--rate-icon-size-${scale}-foreground-width)`,
    "--rate-icon-height": `var(--rate-icon-size-${scale}-icon-height)`,
    "--rate-icon-mask-width": `var(--rate-icon-size-${scale}-${type}-${status}-mask-width)`,
    "--rate-icon-mask-height": `var(--rate-icon-size-${scale}-${type}-${status}-mask-height)`,
    "--rate-icon-background": `var(--rate-icon-color-${type}-${status}-unselected-default)`,
    "--rate-icon-foreground": `var(--rate-icon-color-${type}-${status}-selected-default)`,
    ...style,
  } as CSSProperties;
  return <span ref={ref} aria-hidden="true" {...props} className={cn("aviala-rate-icon", className)} data-type={type} data-status={status} style={variables}>
    <Icon mode="fill" thickness={type === "like" ? "Light" : "Regular"} className="aviala-rate-icon__background" />
    <span className="aviala-rate-icon__mask"><Icon mode="fill" thickness={type === "like" ? "Light" : "Regular"} className="aviala-rate-icon__foreground" /></span>
  </span>;
});

export interface RateProps extends Omit<HTMLAttributes<HTMLDivElement>, "defaultValue" | "onChange"> {
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  count?: number;
  allowHalf?: boolean;
  allowClear?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  size?: RateSize;
  type?: RateType;
  name?: string;
}

/** Figma Rate (516:55613), with keyboard and optional half-step selection. */
export const Rate = forwardRef<HTMLDivElement, RateProps>(function Rate({
  value, defaultValue = 0, onValueChange, count = 5, allowHalf = false, allowClear = true,
  disabled = false, readOnly = false, size = "default", type = "star", name,
  className, style, onKeyDown, onPointerLeave, ...props
}, ref) {
  const maximum = Number.isFinite(count) ? Math.max(1, Math.floor(count)) : 5;
  const step = allowHalf ? 0.5 : 1;
  const normalize = (v: number) => Math.max(0, Math.min(maximum, Math.round((Number.isFinite(v) ? v : 0) / step) * step));
  const [internal, setInternal] = useState(defaultValue);
  const [hovered, setHovered] = useState<number>();
  const current = normalize(value ?? internal);
  const editable = !disabled && !readOnly;
  const displayed = editable ? hovered ?? current : current;
  const commit = (next: number) => {
    if (!editable) return;
    const normalized = normalize(next);
    if (value === undefined) setInternal(normalized);
    if (normalized !== current) onValueChange?.(normalized);
  };
  return <div {...props} ref={ref} role="slider" aria-label={props["aria-label"] ?? "Rating"}
    aria-valuemin={0} aria-valuemax={maximum} aria-valuenow={current}
    aria-valuetext={`${current} / ${maximum}`} aria-disabled={disabled || undefined} aria-readonly={readOnly || undefined}
    tabIndex={disabled ? -1 : props.tabIndex ?? 0} data-disabled={disabled || undefined} data-readonly={readOnly || undefined}
    className={cn("aviala-rate aviala-focus-ring", className)}
    style={{ "--rate-gap": `var(--rate-size-${size === "default" ? "regular" : size}-gap)`, ...style } as CSSProperties}
    onPointerLeave={event => { setHovered(undefined); onPointerLeave?.(event); }}
    onKeyDown={event => {
      onKeyDown?.(event);
      if (event.defaultPrevented || !editable) return;
      const rtl = event.currentTarget.closest('[dir]')?.getAttribute('dir') === 'rtl';
      const delta = event.key === "ArrowUp" ? step : event.key === "ArrowDown" ? -step : event.key === "ArrowRight" ? (rtl ? -step : step) : event.key === "ArrowLeft" ? (rtl ? step : -step) : undefined;
      const next = event.key === "Home" ? 0 : event.key === "End" ? maximum : delta === undefined ? undefined : current + delta;
      if (next !== undefined) { event.preventDefault(); setHovered(undefined); commit(next); }
    }}>
    {Array.from({ length: maximum }, (_, index) => {
      const pointerValue = (element: HTMLElement, clientX: number) => {
        const bounds = element.getBoundingClientRect();
        const rtl = element.closest('[dir]')?.getAttribute('dir') === 'rtl';
        const firstHalf = rtl ? clientX > bounds.left + bounds.width / 2 : clientX < bounds.left + bounds.width / 2;
        return index + (allowHalf && firstHalf ? 0.5 : 1);
      };
      return <span key={index} className="aviala-rate__item" aria-hidden="true"
        onPointerMove={event => { if (editable) setHovered(pointerValue(event.currentTarget, event.clientX)); }}
        onClick={event => { const next = pointerValue(event.currentTarget, event.clientX); setHovered(undefined); commit(allowClear && next === current ? 0 : next); event.currentTarget.parentElement?.focus(); }}>
        <RateIcon size={size} type={type} status={displayed >= index + 1 ? "fill" : displayed >= index + 0.5 ? "half" : "empty"} />
      </span>;
    })}
    {name && <input type="hidden" name={name} value={current} disabled={disabled} />}
  </div>;
});

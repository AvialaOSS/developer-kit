import * as Popover from "@radix-ui/react-popover";
import { DirectionArrowDownLight, SymbolRight } from "@aviala-design/icons";
import { forwardRef, useEffect, useId, useRef, useState, type HTMLAttributes } from "react";
import { useOverlayPortalContainer } from "../overlay/overlay-container";
import { useResolvedControlError } from "./form-field-context";
import { cn } from "../lib/utils";
import { resolveRovingIndex, resolveRovingMove } from "../lib/roving-focus";
import { useLocaleMessages } from "../locale";
import { Tag } from "./tag";
import { Typography } from "./typography";
import type { SelectSize } from "./select";

export interface MultiSelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface MultiSelectProps extends Omit<HTMLAttributes<HTMLDivElement>, "defaultValue" | "onChange"> {
  options: readonly MultiSelectOption[];
  value?: readonly string[];
  defaultValue?: readonly string[];
  onValueChange?: (value: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  size?: SelectSize;
  allRound?: boolean;
  error?: boolean;
  name?: string;
}

/** Select's Tag content variant. Popover keeps multiple choices open. */
export const MultiSelect = forwardRef<HTMLDivElement, MultiSelectProps>(function MultiSelect({
  options, value, defaultValue = [], onValueChange, placeholder = "Select", disabled = false,
  size = "regular", allRound = false, error, name, className, onKeyDown, onClick, ...props
}, ref) {
  const tagLocale = useLocaleMessages("Tag");
  const [internal, setInternal] = useState<readonly string[]>(defaultValue);
  const [open, setOpen] = useState(false);
  useEffect(() => { if (disabled) setOpen(false); }, [disabled]);
  const selected = [...new Set(value ?? internal)];
  const items = options.filter((option, index) => options.findIndex(item => item.value === option.value) === index);
  const trigger = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const search = useRef({ text: "", time: 0 });
  const entryEdge = useRef<"first" | "last">("first");
  const id = useId();
  const container = useOverlayPortalContainer();
  const resolvedError = useResolvedControlError(error);
  useEffect(() => {
    if (value !== undefined) return;
    const form = trigger.current?.form;
    const reset = (event: Event) => {
      queueMicrotask(() => {
        if (event.defaultPrevented) return;
        setInternal(defaultValue);
        setOpen(false);
      });
    };
    form?.addEventListener("reset", reset);
    return () => form?.removeEventListener("reset", reset);
  }, [value, defaultValue]);
  const change = (next: string[]) => {
    if (disabled) return;
    if (value === undefined) setInternal(next);
    onValueChange?.(next);
  };
  const remove = (item: string) => {
    if (items.find(option => option.value === item)?.disabled) return;
    change(selected.filter(value => value !== item));
  };
  const focusable = () => Array.from(panel.current?.querySelectorAll<HTMLElement>('[role="option"]:not([aria-disabled="true"])') ?? []);
  return <Popover.Root open={open && !disabled} onOpenChange={setOpen}>
    <Popover.Anchor asChild>
      <div {...props} ref={ref} role="group" aria-disabled={disabled || undefined}
        className={cn("aviala-select-trigger aviala-multi-select", className)}
        data-size={size} data-all-round={allRound} data-error={resolvedError || undefined}
        data-disabled={disabled || undefined} data-state={open && !disabled ? "open" : "closed"}
        onClick={event => {
          onClick?.(event);
          if (!disabled && !event.defaultPrevented && !(event.target as HTMLElement).closest('button')) {
            trigger.current?.focus(); setOpen(true);
          }
        }}
        onKeyDown={event => {
          onKeyDown?.(event);
          if (disabled || event.defaultPrevented || event.target !== trigger.current) return;
          if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            entryEdge.current = event.key === "ArrowUp" ? "last" : "first";
            setOpen(true);
          }
          if (event.key === "Backspace" && !open) {
            const last = selected.filter(value => !items.find(option => option.value === value)?.disabled).at(-1);
            if (last !== undefined) { event.preventDefault(); remove(last); }
          }
        }}>
        <span className="aviala-select-trigger__field aviala-multi-select__tags">
          {selected.length ? selected.map(item => {
            const option = items.find(option => option.value === item);
            const removable = !disabled && !option?.disabled;
            return <Tag key={item} level="text" lineHeightFix="off" closable disabled={!removable}
              closeLabel={`${tagLocale.remove} ${option?.label ?? item}`}
              onClose={event => { event.stopPropagation(); remove(item); trigger.current?.focus(); }}>
              {option?.label ?? item}
            </Tag>;
          }) : <Typography level="text" className="aviala-multi-select__placeholder">{placeholder}</Typography>}
        </span>
        <Popover.Trigger asChild>
          <button ref={trigger} type="button" disabled={disabled} className="aviala-select-trigger__expand aviala-focus-ring"
            aria-label={props["aria-label"] ?? placeholder} aria-labelledby={props["aria-labelledby"]}
            aria-describedby={props["aria-describedby"]} aria-invalid={resolvedError || undefined}
            aria-haspopup="listbox" aria-controls={id}>
            <DirectionArrowDownLight aria-hidden className="aviala-select-trigger__expand-icon" />
          </button>
        </Popover.Trigger>
        {name && selected.map(item => <input key={item} type="hidden" name={name} value={item} disabled={disabled} />)}
      </div>
    </Popover.Anchor>
    <Popover.Portal container={container}>
      <Popover.Content className="aviala-select-content aviala-multi-select__content" align="start" sideOffset={4}
        onOpenAutoFocus={event => {
          event.preventDefault();
          const rows = focusable();
          search.current = { text: "", time: 0 };
          (rows.find(row => row.getAttribute('aria-selected') === 'true') ?? rows[resolveRovingIndex(-1, rows.length, entryEdge.current)] ?? panel.current)?.focus();
          entryEdge.current = "first";
        }}>
        <div ref={panel} id={id} role="listbox" aria-multiselectable="true" tabIndex={-1}
          aria-label={props["aria-label"] ?? placeholder} className="aviala-select-group aviala-multi-select__options"
          onKeyDown={event => {
            const rows = focusable(); const index = rows.indexOf(event.target as HTMLElement);
            const move = resolveRovingMove(event.key, "vertical");
            if (move && !event.altKey && !event.ctrlKey && !event.metaKey) {
              event.preventDefault(); rows[resolveRovingIndex(index, rows.length, move)]?.focus();
            }
            if (event.key.length === 1 && event.key !== " " && !event.ctrlKey && !event.metaKey && !event.altKey) {
              const now = Date.now();
              const text = (now - search.current.time < 700 ? search.current.text : "") + event.key.toLocaleLowerCase();
              search.current = { text, time: now };
              const query = [...text].every(character => character === text[0]) ? text[0] : text;
              const ordered = [...rows.slice(index + 1), ...rows.slice(0, index + 1)];
              const match = ordered.find(row => row.textContent?.trim().toLocaleLowerCase().startsWith(query));
              if (match) { event.preventDefault(); match.focus(); }
            }
          }}>
          {items.map(option => {
            const checked = selected.includes(option.value);
            const toggle = () => { if (!option.disabled) change(checked ? selected.filter(item => item !== option.value) : [...selected, option.value]); };
            return <div key={option.value} role="option" tabIndex={-1} aria-selected={checked}
              aria-disabled={option.disabled || undefined} data-disabled={option.disabled ? "" : undefined}
              data-state={checked ? "checked" : "unchecked"} className="aviala-select-item aviala-multi-select__option"
              onClick={event => { if (!option.disabled) { event.currentTarget.focus(); toggle(); } }} onKeyDown={event => {
                if (event.key === " " || event.key === "Enter") { event.preventDefault(); toggle(); }
              }}>
              <Typography level="text" className="aviala-select-item__text">{option.label}</Typography>
              {checked && <span className="aviala-select-item__indicator"><SymbolRight aria-hidden /></span>}
            </div>;
          })}
        </div>
      </Popover.Content>
    </Popover.Portal>
  </Popover.Root>;
});

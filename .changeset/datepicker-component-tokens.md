---
"@aviala-design/spiral": patch
"@aviala-design/tokens": patch
---

Connect DatePicker day cells to DateButton spacing, corner, state color, today marker and outside-month opacity tokens, preserving explicit legacy overrides and shared Typography metrics.

Connect DatePicker input geometry, icon slots, corner radii, surface/text colors and open-state border to independent input tokens without changing TimePicker or the pending disabled-opacity policy.

Connect calendar header and weekday tokens, separate list and grid spacing, and resolve derived panel heights in the calendar theme scope while retaining explicit legacy height overrides.

Use DatePickerSelectMenu surface tokens and DatePickerList action insets, preserve SegmentatorGroup footer styling, and resolve wheel fades against the local calendar background.

Connect the year/month container surface and independent column insets and separators to component tokens, keeping highlight and clipped text aligned with the scrolling content.

Separate wheel row stride from the visible option height so year/month content gaps, item dimensions and vertical insets can follow tokens. Preserve fractional row measurements and realign committed values when row or viewport dimensions change.

Use ScrollPickerItem selected colors for year/month wheels and derive their fades from the local year/month surface; preserve explicit legacy color overrides and the time wheel's legacy default.

Migrate TimePicker's panel and shared hour/minute wheels to TimePickerSelectMenu, TimePickerTimepick, column and ScrollPickerItem tokens. Resolve wheel viewport and fade dimensions locally while preserving explicit legacy overrides. Input and effect migration remain pending.

Connect TimePicker input size variants, rounded geometry, icon slots, foreground, surfaces and active inset border to independent TimePickerInput tokens. Keep the existing disabled-opacity policy pending confirmation.

Move the legacy global placeholder opacity default behind a compatibility fallback so DatePicker/TimePicker placeholder tokens can take effect without changing existing Input, Cascader or ColorPicker defaults.

Restore the Figma-bound bottom inner shadow on ScrollPicker and date/time wheel highlights using the shared effect-mode alias, with an explicit scroll-picker-item-shadow override.

import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { TimePicker, TimePickerTrigger } from "./time-picker";
import { TimePickerWheels } from "./time-picker-wheels";

const columns = vi.hoisted(
  () =>
    [] as Array<{
      value: number;
      values: readonly number[];
      onChange: (value: number) => void;
    }>
);
vi.mock("../date-picker/date-picker-time-wheel", () => ({
  DatePickerTimeWheelColumn: (props: (typeof columns)[number]) => {
    columns.push(props);
    return null;
  },
}));
beforeEach(() => {
  columns.length = 0;
});

describe("optional seconds", () => {
  it("keeps the existing display by default and pads enabled seconds", () => {
    const value = { hours: 9, minutes: 5, seconds: 7 };
    const render = (showSeconds = false, input = value) =>
      renderToStaticMarkup(
        <TimePicker value={input} showSeconds={showSeconds}>
          <TimePickerTrigger />
        </TimePicker>
      );
    expect(render()).toContain("09:05");
    expect(render()).not.toContain("09:05:07");
    expect(render(true)).toContain("09:05:07");
    expect(
      renderToStaticMarkup(
        <TimePicker showSeconds defaultValue={{ hours: 9, minutes: 5 }}>
          <TimePickerTrigger />
        </TimePicker>
      )
    ).toContain("09:05:00");
    expect(value).toEqual({ hours: 9, minutes: 5, seconds: 7 });
  });
  it("provides all seconds and retains the other units on wheel changes", () => {
    const value = { hours: 9, minutes: 5, seconds: 7 },
      change = vi.fn();
    renderToStaticMarkup(
      <TimePickerWheels value={value} onChange={change} showSeconds />
    );
    expect(columns).toHaveLength(3);
    expect(columns[2].values).toEqual(Array.from({ length: 60 }, (_, i) => i));
    columns[0].onChange(10);
    columns[1].onChange(15);
    columns[2].onChange(59);
    expect(change.mock.calls.map(([next]) => next)).toEqual([
      { hours: 10, minutes: 5, seconds: 7 },
      { hours: 9, minutes: 15, seconds: 7 },
      { hours: 9, minutes: 5, seconds: 59 },
    ]);
    expect(value.seconds).toBe(7);
  });
  it("retains two-column output and existing callback shape when seconds are omitted", () => {
    const change = vi.fn();
    renderToStaticMarkup(
      <TimePickerWheels value={{ hours: 9, minutes: 5 }} onChange={change} />
    );
    expect(columns).toHaveLength(2);
    columns[1].onChange(10);
    expect(change).toHaveBeenCalledWith({ hours: 9, minutes: 10 });
  });
});

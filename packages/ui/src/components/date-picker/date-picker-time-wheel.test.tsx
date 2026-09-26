import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";
import { DatePickerTimeWheelColumn } from "./date-picker-time-wheel";
import {
  WHEEL_LOOP_MIDDLE_SECTION,
  WHEEL_LOOP_SECTIONS,
} from "../../lib/sticky-wheel";

it.each([false, true])(
  "keeps identically labelled wheels independent (loop=%s)",
  (loop) => {
    const props = {
      values: [8, 9, 10],
      value: 9,
      onChange: () => {},
      "aria-label": "Hour",
      loop,
    };
    const html = renderToStaticMarkup(
      <>
        <DatePickerTimeWheelColumn {...props} />
        <DatePickerTimeWheelColumn {...props} />
      </>
    );
    const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
    const count = props.values.length * (loop ? WHEEL_LOOP_SECTIONS : 1);
    expect(ids).toHaveLength(count * 2);
    expect(new Set(ids).size).toBe(ids.length);
    const active = [...html.matchAll(/aria-activedescendant="([^"]+)"/g)].map(
      (match) => match[1]
    );
    const offset =
      1 + (loop ? WHEEL_LOOP_MIDDLE_SECTION * props.values.length : 0);
    expect(active).toEqual([ids[offset], ids[count + offset]]);
    expect([...html.matchAll(/aria-selected="true"/g)]).toHaveLength(2);
  }
);

it.each([{ values: [] }, { values: [8, 10] }])(
  "omits missing selected descendants ($values)",
  ({ values }) => {
    const html = renderToStaticMarkup(
      <DatePickerTimeWheelColumn
        values={values}
        value={9}
        onChange={() => {}}
        aria-label="Hour"
      />
    );
    expect(html).not.toContain("aria-activedescendant=");
    expect(html).not.toContain('aria-selected="true"');
  }
);

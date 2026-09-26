import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";
import { ScrollPickerColumn } from "./scroll-picker";
import {
  WHEEL_LOOP_MIDDLE_SECTION,
  WHEEL_LOOP_SECTIONS,
} from "../lib/sticky-wheel";

it.each([false, true])("keeps option identities unique (loop=%s)", (loop) => {
  const values = ["08", "09", "10"];
  const html = renderToStaticMarkup(
    <ScrollPickerColumn
      values={values}
      value="09"
      onChange={() => {}}
      aria-label="Hour"
      loop={loop}
    />
  );
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
  expect(ids).toHaveLength(values.length * (loop ? WHEEL_LOOP_SECTIONS : 1));
  expect(new Set(ids).size).toBe(ids.length);
  expect(html).toContain(`data-loop="${loop}"`);
  const activeId = /aria-activedescendant="([^"]+)"/.exec(html)?.[1];
  expect(activeId).toBe(
    ids[1 + (loop ? WHEEL_LOOP_MIDDLE_SECTION * values.length : 0)]
  );
  expect(html).toContain(`id="${activeId}" role="option" aria-selected="true"`);
  expect([...html.matchAll(/aria-selected="true"/g)]).toHaveLength(1);
});

it.each([{ values: [] }, { values: ["08", "10"] }])(
  "omits an active descendant when the selected value is absent: $values",
  ({ values }) => {
    const html = renderToStaticMarkup(
      <ScrollPickerColumn
        values={values}
        value="09"
        onChange={() => {}}
        aria-label="Hour"
      />
    );
    expect(html).not.toContain("aria-activedescendant=");
    expect(html).not.toContain('aria-selected="true"');
    if (values.length === 0) expect(html).toContain('data-loop="false"');
  }
);

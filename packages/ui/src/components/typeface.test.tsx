import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";
import { Typeface } from "./typeface";

it("keeps the description role when the primary line is omitted", () => {
  const html = renderToStaticMarkup(<Typeface content="textCaption" secondary="Description" />);
  expect(html).toContain('data-line="1"');
  expect(html).not.toContain('data-line="0"');
  expect(html).toContain("Description");
});

it("keeps line roles stable when only tertiary content is supplied", () => {
  const html = renderToStaticMarkup(<Typeface content="textCaptionSubtitle" tertiary="Caption" />);
  expect(html).toContain('data-line="2"');
  expect(html).not.toContain('data-line="0"');
  expect(html).not.toContain('data-line="1"');
});

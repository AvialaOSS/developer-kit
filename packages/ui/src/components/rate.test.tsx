import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Rate } from "./rate";

describe("Rate value and accessibility", () => {
  it("exposes the controlled half value to assistive technology and forms", () => {
    const html = renderToStaticMarkup(<Rate value={2.5} defaultValue={1} allowHalf name="rating" />);
    expect(html).toContain('role="slider"');
    expect(html).toContain('aria-valuenow="2.5"');
    expect(html).toContain('name="rating" value="2.5"');
    expect(html.match(/data-status="fill"/g)).toHaveLength(2);
    expect(html.match(/data-status="half"/g)).toHaveLength(1);
    expect(html.match(/data-status="empty"/g)).toHaveLength(2);
  });
  it("clamps invalid bounds and excludes disabled values from form submission", () => {
    const html = renderToStaticMarkup(<Rate value={10} count={3} disabled name="rating" />);
    expect(html).toContain('aria-valuenow="3"');
    expect(html).toContain('tabindex="-1"');
    expect(html).toMatch(/<input[^>]*disabled=""/);
  });
  it("keeps readonly ratings available to keyboards and form submission", () => {
    const html = renderToStaticMarkup(<Rate defaultValue={2} readOnly name="rating" />);
    expect(html).toContain('aria-readonly="true"');
    expect(html).toContain('tabindex="0"');
    expect(html).not.toMatch(/<input[^>]*disabled=/);
  });
});

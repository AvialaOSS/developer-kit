import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { MultiSelect } from "./multi-select";

const options = [{ value: "a", label: "Alpha" }, { value: "b", label: "Beta", disabled: true }];
describe("MultiSelect tags and form ownership", () => {
  it("uses controlled values, removes duplicates and preserves unlisted identities", () => {
    const html = renderToStaticMarkup(<MultiSelect options={options} value={["a", "a", "missing"]} defaultValue={["b"]} name="choices" />);
    expect(html.match(/type="hidden"/g)).toHaveLength(2);
    expect(html).toContain('name="choices" value="a"');
    expect(html).toContain('name="choices" value="missing"');
    expect(html).not.toContain('name="choices" value="b"');
    let depth = 0;
    for (const [tag] of html.matchAll(/<\/?button\b[^>]*>/g)) {
      depth += tag.startsWith("</") ? -1 : 1;
      expect(depth).toBeGreaterThanOrEqual(0);
      expect(depth).toBeLessThanOrEqual(1);
    }
    expect(depth).toBe(0);
  });
  it("disables submission and every removal control", () => {
    const html = renderToStaticMarkup(<MultiSelect options={options} defaultValue={["a", "b"]} disabled name="choices" />);
    const buttons = [...html.matchAll(/<button\b[^>]*>/g)].map(match => match[0]);
    expect(buttons).toHaveLength(3);
    expect(buttons.every(button => button.includes('disabled=""'))).toBe(true);
    expect([...html.matchAll(/<input\b[^>]*>/g)].every(match => match[0].includes('disabled=""'))).toBe(true);
  });
});

import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Progress } from "./progress";

describe("Progress bounded values", () => {
  it.each([-1, Number.NaN, Number.POSITIVE_INFINITY])(
    "renders %s as zero without a rounded-cap dot",
    (value) => {
      const html = renderToStaticMarkup(
        <Progress shape="ring" value={value} />
      );
      expect(html).toContain('aria-valuenow="0"');
      expect(html).toContain('visibility="hidden"');
      expect(html).not.toMatch(/NaN|Infinity/);
    }
  );

  it("clamps overflow to a complete ring", () => {
    const html = renderToStaticMarkup(<Progress shape="ring" value={120} />);
    expect(html).toContain('aria-valuenow="100"');
    expect(html).toContain('stroke-dasharray="100 0"');
    expect(html).not.toContain('visibility="hidden"');
  });
});

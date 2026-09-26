import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Slider } from "./slider";

describe("Slider form inputs", () => {
  it.each(["default", "range"] as const)(
    "disables every hidden input for a disabled %s slider",
    (type) => {
      const html = renderToStaticMarkup(
        <form>
          <Slider
            name="value"
            type={type}
            disabled
            defaultValue={type === "range" ? [20, 60] : [40]}
          />
        </form>
      );
      const inputs = html.match(/<input\b[^>]*>/g) ?? [];
      expect(inputs).toHaveLength(type === "range" ? 2 : 1);
      for (const input of inputs) expect(input).toMatch(/\bdisabled=""/);
    }
  );

  it("keeps enabled inputs successful form controls", () => {
    const html = renderToStaticMarkup(
      <form>
        <Slider name="value" defaultValue={[40]} />
      </form>
    );
    const inputs = html.match(/<input\b[^>]*>/g) ?? [];
    expect(inputs).toHaveLength(1);
    expect(inputs[0]).not.toMatch(/\bdisabled=/);
  });
});

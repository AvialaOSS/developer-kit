import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { AnchorItem } from "./anchor";

describe("AnchorItem composition", () => {
  it("decorates one child link without nesting links or losing its attributes", () => {
    const html = renderToStaticMarkup(
      <AnchorItem
        asChild
        activated
        indentLevel={2}
        className="parent-class"
        description="Additional details"
      >
        <a href="#details" className="child-class" aria-label="Read details">
          <strong>Details</strong>
        </a>
      </AnchorItem>
    );
    expect(html.match(/<a\b/g)).toHaveLength(1);
    expect(html).toContain('href="#details"');
    expect(html).toContain('aria-label="Read details"');
    expect(html).toContain('data-indent="2"');
    expect(html).toContain('aria-current="location"');
    expect(html).toContain("parent-class");
    expect(html).toContain("child-class");
    expect(html).toContain("aviala-anchor-item__rail");
    expect(html).toContain("aviala-anchor-item__label");
    expect(html).toContain("<strong>Details</strong>");
    expect(html).toContain("aviala-anchor-item__description");
    expect(html).toContain("Additional details");
    expect(html).not.toContain('description="');
  });

  it("preserves an explicit current-page semantic supplied by the child", () => {
    const html = renderToStaticMarkup(
      <AnchorItem asChild activated>
        <a href="/details" aria-current="page">
          Details
        </a>
      </AnchorItem>
    );
    expect(html).toContain('aria-current="page"');
  });

  it("does not mark inactive links as the current location", () => {
    const html = renderToStaticMarkup(
      <AnchorItem href="#details">Details</AnchorItem>
    );
    expect(html).not.toContain("aria-current");
  });
});

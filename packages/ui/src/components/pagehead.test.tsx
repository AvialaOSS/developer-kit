import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Pagehead } from "./pagehead";

describe("Pagehead title semantics", () => {
  it("keeps document heading level independent of visual scale and preserves content", () => {
    const html = renderToStaticMarkup(<Pagehead title={<em>Settings</em>} titleLevel="display" titleAs="h2" description="Account preferences" aria-label="Account header" />);
    expect(html).toContain('<h2');
    expect(html).not.toContain('<h1');
    expect(html).toContain('aviala-typography--display');
    expect(html).toContain('<em>Settings</em>');
    expect(html).toContain('aria-label="Account header"');
    expect(html).not.toMatch(/titleLevel=|titleAs=|description=/i);
  });

  it("does not introduce an implicit heading for existing consumers or descriptions alone", () => {
    const html = renderToStaticMarkup(<Pagehead title="Existing title" />);
    expect(html).not.toMatch(/<h[1-6]\b/);
    const descriptionOnly = renderToStaticMarkup(<Pagehead description="Only description" titleAs="h1" />);
    expect(descriptionOnly).toContain('Only description');
    expect(descriptionOnly).not.toContain('<h1');
  });
});

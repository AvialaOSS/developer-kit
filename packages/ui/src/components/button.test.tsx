import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Button } from "./button";

describe("Button asChild", () => {
  it("keeps the link destination and renders the same visual layers as a button", () => {
    const html = renderToStaticMarkup(
      <Button asChild size="tiny" allRound>
        <a href="/settings" aria-label="Open settings">
          Settings
        </a>
      </Button>
    );
    expect(html).toContain('href="/settings"');
    expect(html).toContain('aria-label="Open settings"');
    expect(html).toContain('data-size="tiny"');
    expect(html).toContain("aviala-button--rounded");
    expect(html).toContain("aviala-button-surface");
    expect(html).toContain("aviala-typography");
    expect(html.match(/<a\b/g)).toHaveLength(1);
    expect(html).not.toContain("<button");
  });

  it("does not mistake a custom link component for an icon-only child", () => {
    const Link = ({ children, ...props }: React.ComponentProps<"a">) => (
      <a {...props}>{children}</a>
    );
    const html = renderToStaticMarkup(
      <Button asChild>
        <Link href="/settings">Settings</Link>
      </Button>
    );
    expect(html).toContain("Settings</span>");
    expect(html).not.toContain('data-icon-only="true"');
    expect(html).toContain("aviala-button-surface");
  });
});

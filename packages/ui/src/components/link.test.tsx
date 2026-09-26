import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { GeneralSetting } from "@aviala-design/icons";
import { Link } from "./link";

describe("Link asChild", () => {
  it("preserves the destination and applies shared icon and text layers", () => {
    const html = renderToStaticMarkup(
      <Link asChild level="text" leftIcon={<GeneralSetting />}>
        <a href="/settings" aria-label="Settings">
          Settings
        </a>
      </Link>
    );
    expect(html).toContain('href="/settings"');
    expect(html).toContain('aria-label="Settings"');
    expect(html).toContain("aviala-link__icon");
    expect(html).toContain("aviala-link__label");
    expect(html).toContain("aviala-typography");
    expect(html.match(/<a\b/g)).toHaveLength(1);
  });
  it("removes the child's destination and keyboard tab stop when disabled", () => {
    const html = renderToStaticMarkup(
      <Link asChild disabled>
        <a href="/settings" tabIndex={0}>
          Settings
        </a>
      </Link>
    );
    expect(html).not.toContain("href=");
    expect(html).toContain('tabindex="-1"');
    expect(html).toContain('aria-disabled="true"');
    expect(html).toContain("aviala-link__label");
  });
  it("infers icon-only from the wrapped child's content", () => {
    const html = renderToStaticMarkup(
      <Link asChild leftIcon={<GeneralSetting />}>
        <a href="/settings" aria-label="Settings" />
      </Link>
    );
    expect(html).toContain("aviala-link--icon-only");
    expect(html).not.toContain("aviala-link__label");
  });
});

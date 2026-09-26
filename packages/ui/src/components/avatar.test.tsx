import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Avatar } from "./avatar";

describe("Avatar image styles", () => {
  it("preserves sizing and cropping when the consumer supplies a class", () => {
    const html = renderToStaticMarkup(
      <Avatar
        content="picture"
        src="avatar.png"
        alt="Kai"
        imgProps={{
          className: "consumer-avatar",
          loading: "lazy",
          width: 96,
          height: 48,
        }}
      />
    );
    expect(html).toContain('class="aviala-avatar__image consumer-avatar"');
    expect(html).toContain('alt="Kai"');
    expect(html).toContain('loading="lazy"');
    expect(html).toContain('width="96"');
    expect(html).toContain('height="48"');
  });
});

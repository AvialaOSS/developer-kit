import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";
import { Alert } from "./alert";
import { Feedback } from "./feedback";
import { ListItem } from "./list";

it.each([
  ["Alert", <Alert title={null} description="Details" />],
  ["Feedback", <Feedback title={null} description="Details" />],
  [
    "ListItem",
    <ListItem
      title={null}
      subtitle="Details"
      leading="none"
      itemType="switch"
    />,
  ],
] as const)(
  "%s preserves description identity without a title",
  (_name, element) => {
    const html = renderToStaticMarkup(element);
    expect(html).toContain('data-line="1"');
    expect(html).not.toContain('data-line="0"');
    expect(html).toContain("Details");
  }
);

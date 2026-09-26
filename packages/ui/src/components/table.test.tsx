import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Table, TableCell, TableHead, TableRow } from "./table";

describe("Table content contracts", () => {
  it("keeps optional header icons around the content without leaking props or changing checkbox headers", () => {
    const icons = {
      leftIcon: <span>Leading</span>,
      rightIcon: <span>Trailing</span>,
    };
    const html = renderToStaticMarkup(
      <TableHead {...icons} actions={<button>Action</button>}>
        Heading
      </TableHead>
    );
    expect(html.indexOf("Leading")).toBeLessThan(html.indexOf("Heading"));
    expect(html.indexOf("Action")).toBeLessThan(html.indexOf("Trailing"));
    expect(html).not.toContain("leftIcon=");
    expect(html.match(/class="aviala-table-head__icon-slot"/g)).toHaveLength(2);
    expect(renderToStaticMarkup(<TableHead>Heading</TableHead>)).not.toContain(
      "aviala-table-head__icon-slot"
    );
    const checkbox = renderToStaticMarkup(
      <TableHead
        {...icons}
        content="checkbox"
        checkboxProps={{ "aria-label": "Select all" }}
      />
    );
    expect(checkbox).not.toContain("Leading");
    expect(checkbox).not.toContain("Trailing");
    expect(checkbox).toContain('aria-label="Select all"');
  });
  it("keeps explicit children as direct cell content and ignores generated content", () => {
    const html = renderToStaticMarkup(
      <TableCell
        content="switch"
        text="Generated text"
        actions={<button>Generated action</button>}
      >
        <a href="/details">Custom content</a>
      </TableCell>
    );
    expect(html).toMatch(
      /<div[^>]*role="cell"[^>]*><a href="\/details">Custom content<\/a><\/div>/
    );
    expect(html).not.toContain("Generated");
    expect(html).not.toContain('role="switch"');
  });

  it("preserves table semantics, accessible controls and content through the layout layers", () => {
    const html = renderToStaticMarkup(
      <Table aria-label="Members">
        <TableRow header>
          <TableHead>Member</TableHead>
          <TableHead
            content="checkbox"
            checkboxProps={{
              "aria-label": "Select all",
              checked: true,
              disabled: true,
            }}
          />
        </TableRow>
        <TableRow>
          <TableCell
            text="Ada"
            caption="Designer"
            actions={<button aria-label="Edit Ada">Edit</button>}
          />
          <TableCell
            content="switch"
            switchProps={{
              "aria-label": "Enable Ada",
              checked: true,
              disabled: true,
            }}
          />
        </TableRow>
      </Table>
    );
    expect(html).toContain('role="table"');
    expect(html.match(/role="row"/g)).toHaveLength(2);
    expect(html.match(/role="columnheader"/g)).toHaveLength(2);
    expect(html.match(/role="cell"/g)).toHaveLength(2);
    expect(html).toContain("Ada");
    expect(html).toContain("Designer");
    expect(html).toContain('aria-label="Edit Ada"');
    expect(html).toMatch(
      /<button[^>]*role="checkbox"[^>]*aria-checked="true"[^>]*>/
    );
    expect(html).toMatch(
      /<button[^>]*role="switch"[^>]*aria-checked="true"[^>]*>/
    );
    expect(html).toContain('aria-label="Select all"');
    expect(html).toContain('aria-label="Enable Ada"');
  });
});

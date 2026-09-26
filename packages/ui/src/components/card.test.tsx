import {renderToStaticMarkup} from "react-dom/server";
import {describe,expect,it} from "vitest";
import {CardHead,CardBottom} from "./card";

describe("Card optional heading",()=>{
  it("preserves supporting text, custom children and actions alongside the heading",()=>{
    for(const Component of [CardHead,CardBottom]) {
      const html=renderToStaticMarkup(<Component heading="Heading" title="Title" description="Description" trailing={<button>Action</button>}/>);
      expect(html.indexOf("Heading")).toBeLessThan(html.indexOf("Title"));
      expect(html.indexOf("Title")).toBeLessThan(html.indexOf("Description"));
      expect(html).toContain("aviala-typography--title");
      expect(html).toContain("aviala-typography--text");
      expect(html).toContain("aviala-typography--caption");
      expect(html).toContain("<button>Action</button>");
      expect(html).not.toContain('heading="');
    }
    expect(renderToStaticMarkup(<CardHead heading="Heading"><a href="/details">Custom title</a></CardHead>)).toContain('<a href="/details">Custom title</a>');
  });
  it("leaves the default footer without a heading region and supports a heading alone",()=>{
    expect(renderToStaticMarkup(<CardBottom trailing={null}/>)).not.toContain("aviala-card-bottom__main");
    const html=renderToStaticMarkup(<CardBottom heading={0} trailing={null}/>);
    expect(html).toContain("aviala-card-bottom__heading");
    expect(html).not.toContain("aviala-typeface");
    expect(renderToStaticMarkup(<CardBottom heading={false} trailing={null}/>)).not.toContain("aviala-card-bottom__main");
  });
});

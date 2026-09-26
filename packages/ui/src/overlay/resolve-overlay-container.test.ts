import { describe, expect, it } from "vitest";
import { resolveOverlayContainer } from "./resolve-overlay-container";

function container(...children: HTMLElement[]): HTMLElement {
  const node = { contains: (other: HTMLElement): boolean => other === node as unknown as HTMLElement || children.some(child => child.contains(other)) };
  return node as unknown as HTMLElement;
}

describe("overlay theme containment", () => {
  it("keeps a local scope inside a modal", () => {
    const theme = container();
    const modal = container(theme);
    expect(resolveOverlayContainer(null, modal, theme)).toBe(theme);
  });
  it("does not send a modal overlay to an unrelated theme", () => {
    const modal = container();
    expect(resolveOverlayContainer(null, modal, container())).toBe(modal);
  });
  it("keeps the deepest scope inside fullscreen and modal", () => {
    const theme = container();
    const modal = container(theme);
    expect(resolveOverlayContainer(container(modal), modal, theme)).toBe(theme);
  });
  it("keeps fullscreen overlays away from unrelated modal and theme roots", () => {
    const fullscreen = container();
    expect(resolveOverlayContainer(fullscreen, container(), container())).toBe(fullscreen);
  });
  it("does not escape a modal inside fullscreen for a sibling theme", () => {
    const theme = container();
    const modal = container();
    expect(resolveOverlayContainer(container(modal, theme), modal, theme)).toBe(modal);
  });
  it("falls back to the local theme or the default body target", () => {
    const theme = container();
    expect(resolveOverlayContainer(null, null, theme)).toBe(theme);
    expect(resolveOverlayContainer(null, null, null)).toBeUndefined();
  });
});

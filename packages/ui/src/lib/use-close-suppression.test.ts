import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const effects = vi.hoisted(() => ({ cleanups: [] as (() => void)[] }));
vi.mock("react", () => ({
  useRef: (current: unknown) => ({ current }),
  useCallback: (callback: unknown) => callback,
  useEffect: (effect: () => void | (() => void)) => {
    const cleanup = effect();
    if (cleanup) effects.cleanups.push(cleanup);
  },
}));

import { useCloseSuppression } from "./use-close-suppression";

describe("close suppression event handling", () => {
  beforeEach(() => {
    vi.stubGlobal("window", new EventTarget());
    vi.stubGlobal("document", new EventTarget());
  });
  afterEach(() => {
    effects.cleanups.splice(0).forEach((cleanup) => cleanup());
    vi.unstubAllGlobals();
  });

  it("does not treat captured element blur as window blur", () => {
    const control = useCloseSuppression({ open: true });
    const event = new Event("blur");
    Object.defineProperty(event, "target", { value: new EventTarget() });
    window.dispatchEvent(event);
    expect(control.shouldCommitOpenChange(false)).toBe(true);
  });

  it("suppresses an actual window blur close once", () => {
    const control = useCloseSuppression({ open: true });
    window.dispatchEvent(new Event("blur"));
    expect(control.shouldCommitOpenChange(false)).toBe(false);
    expect(control.shouldCommitOpenChange(false)).toBe(true);
  });

  it("allows the first keyboard close after returning from another window", () => {
    const control = useCloseSuppression({
      open: true,
      keepPointerDownFlagAfterClose: true,
    });
    document.dispatchEvent(new Event("pointerdown"));
    window.dispatchEvent(new Event("blur"));
    document.dispatchEvent(new Event("keydown"));
    expect(control.shouldCommitOpenChange(false)).toBe(true);
    expect(control.pointerDownCloseRef.current).toBe(false);
  });

  it("preserves pointer dismissal focus behavior", () => {
    const control = useCloseSuppression({
      open: true,
      keepPointerDownFlagAfterClose: true,
    });
    window.dispatchEvent(new Event("blur"));
    document.dispatchEvent(new Event("pointerdown"));
    expect(control.shouldCommitOpenChange(false)).toBe(true);
    expect(control.pointerDownCloseRef.current).toBe(true);
  });

  it("still refuses opening a disabled control", () => {
    const control = useCloseSuppression({ open: false, disabled: true });
    expect(control.shouldCommitOpenChange(true)).toBe(false);
  });
});

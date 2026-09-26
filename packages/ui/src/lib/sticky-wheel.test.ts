import { describe, expect, it } from "vitest";
import { shouldCapturePickerWheel, pickerWheelDeltaPixels, consumeWheelSteps } from "./sticky-wheel";

describe("picker wheel units", () => {
  it("gives equivalent pixel, row and page inputs identical selection steps", () => {
    const results = [[48, 0], [2, 1], [0.4, 2]].map(([delta, mode]) =>
      consumeWheelSteps(0, pickerWheelDeltaPixels(delta, mode, 24, 120), 24 * 0.35));
    expect(results[1]).toEqual(results[0]);
    expect(results[2]).toEqual(results[0]);
    expect(results[0].steps).toBe(5);
  });
  it("preserves signed fractional pixel input and reads current row geometry", () => {
    expect(pickerWheelDeltaPixels(-0.25, 0, 24, 120)).toBe(-0.25);
    expect(pickerWheelDeltaPixels(-2, 1, 32, 160)).toBe(-64);
    expect(pickerWheelDeltaPixels(-1, 2, 32, 160)).toBe(-160);
  });
  it("rejects unknown units and unavailable geometry without poisoning accumulation", () => {
    for (const [delta, mode, row, page] of [[1, 3, 24, 120], [1, 1, 0, 120], [1, 2, 24, 0], [Infinity, 0, 24, 120]]) {
      expect(pickerWheelDeltaPixels(delta, mode, row, page)).toBe(0);
    }
  });
});

const event = { deltaY: 12, ctrlKey: false, defaultPrevented: false };
const geometry = { count: 24, loop: false, scrollTop: 100, scrollHeight: 800, clientHeight: 200 };

describe("picker wheel ownership", () => {
  it("leaves zoom, horizontal-only and already handled gestures alone", () => {
    for (const change of [{ ctrlKey: true }, { deltaY: 0 }, { defaultPrevented: true }, { deltaY: NaN }]) {
      expect(shouldCapturePickerWheel({ ...event, ...change }, geometry)).toBe(false);
    }
  });
  it("does not trap scrolling over empty or single-option columns", () => {
    for (const count of [0, 1]) for (const loop of [false, true]) {
      expect(shouldCapturePickerWheel(event, { ...geometry, count, loop })).toBe(false);
    }
  });
  it("releases outward gestures at both finite boundaries, but accepts inward gestures", () => {
    for (const scrollTop of [0, -2, 0.5]) {
      expect(shouldCapturePickerWheel({ ...event, deltaY: -12 }, { ...geometry, scrollTop })).toBe(false);
      expect(shouldCapturePickerWheel(event, { ...geometry, scrollTop })).toBe(true);
    }
    for (const scrollTop of [600, 602, 599.5]) {
      expect(shouldCapturePickerWheel(event, { ...geometry, scrollTop })).toBe(false);
      expect(shouldCapturePickerWheel({ ...event, deltaY: -12 }, { ...geometry, scrollTop })).toBe(true);
    }
  });
  it("accepts both directions inside a finite column and at loop buffer boundaries", () => {
    for (const deltaY of [-12, 12]) {
      expect(shouldCapturePickerWheel({ ...event, deltaY }, geometry)).toBe(true);
      for (const scrollTop of [0, 600]) {
        expect(shouldCapturePickerWheel({ ...event, deltaY }, { ...geometry, loop: true, scrollTop })).toBe(true);
      }
    }
  });
  it("does not capture a finite column with no scrollable extent", () => {
    for (const deltaY of [-12, 12]) {
      expect(shouldCapturePickerWheel({ ...event, deltaY }, { ...geometry, scrollTop: 0, scrollHeight: 200 })).toBe(false);
    }
  });
});

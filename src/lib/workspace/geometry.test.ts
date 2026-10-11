import { describe, expect, it } from "vitest";
import {
  createNormalizedRegion,
  getMediaLayout,
  normalizedToViewport,
  nudgePoint,
  viewportToNormalized,
} from "@/lib/workspace/geometry";

describe("workspace geometry", () => {
  it("maps viewport points to normalized coordinates with letterboxing", () => {
    const layout = getMediaLayout({ x: 0, y: 0, width: 1000, height: 600 }, { width: 800, height: 800 }, 1, {
      x: 0,
      y: 0,
    });

    expect(layout.mediaX).toBe(200);
    expect(layout.mediaY).toBe(0);

    const point = viewportToNormalized({ x: 600, y: 300 }, layout);
    expect(point.x).toBeCloseTo(0.6667, 3);
    expect(point.y).toBeCloseTo(0.5, 3);
  });

  it("converts normalized coordinates back to viewport coordinates", () => {
    const layout = getMediaLayout({ x: 0, y: 0, width: 1200, height: 900 }, { width: 1200, height: 600 }, 1.2, {
      x: -20,
      y: 10,
    });

    const viewport = normalizedToViewport({ x: 0.25, y: 0.75 }, layout);
    expect(viewport.x).toBeCloseTo(layout.mediaX + layout.mediaWidth * 0.25, 5);
    expect(viewport.y).toBeCloseTo(layout.mediaY + layout.mediaHeight * 0.75, 5);
  });

  it("creates normalized region with proper ordering", () => {
    const region = createNormalizedRegion({ x: 0.8, y: 0.1 }, { x: 0.3, y: 0.55 });

    expect(region).toEqual({
      type: "region",
      x: 0.3,
      y: 0.1,
      width: 0.5,
      height: 0.45,
    });
  });

  it("nudges point selection within bounds", () => {
    const point = nudgePoint({ type: "point", x: 0.99, y: 0.01 }, { x: 3, y: -3 });

    expect(point).toEqual({ type: "point", x: 1, y: 0 });
  });
});

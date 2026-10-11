export type Rect = { x: number; y: number; width: number; height: number };

export type PointSelection = { type: "point"; x: number; y: number };
export type RegionSelection = { type: "region"; x: number; y: number; width: number; height: number };
export type Selection = PointSelection | RegionSelection;

export type MediaLayout = {
  mediaX: number;
  mediaY: number;
  mediaWidth: number;
  mediaHeight: number;
};

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

export function getMediaLayout(
  viewport: Rect,
  asset: { width: number; height: number },
  zoom = 1,
  pan = { x: 0, y: 0 },
): MediaLayout {
  const safeZoom = Number.isFinite(zoom) && zoom > 0 ? zoom : 1;
  const fitScale = Math.min(viewport.width / asset.width, viewport.height / asset.height);
  const mediaWidth = asset.width * fitScale * safeZoom;
  const mediaHeight = asset.height * fitScale * safeZoom;

  return {
    mediaX: viewport.x + (viewport.width - mediaWidth) / 2 + pan.x,
    mediaY: viewport.y + (viewport.height - mediaHeight) / 2 + pan.y,
    mediaWidth,
    mediaHeight,
  };
}

export function viewportToNormalized(
  point: { x: number; y: number },
  media: MediaLayout,
): { x: number; y: number } {
  return {
    x: clamp01((point.x - media.mediaX) / media.mediaWidth),
    y: clamp01((point.y - media.mediaY) / media.mediaHeight),
  };
}

export function normalizedToViewport(
  point: { x: number; y: number },
  media: MediaLayout,
): { x: number; y: number } {
  return {
    x: media.mediaX + clamp01(point.x) * media.mediaWidth,
    y: media.mediaY + clamp01(point.y) * media.mediaHeight,
  };
}

export function createNormalizedRegion(
  start: { x: number; y: number },
  end: { x: number; y: number },
): RegionSelection {
  const x1 = clamp01(Math.min(start.x, end.x));
  const y1 = clamp01(Math.min(start.y, end.y));
  const x2 = clamp01(Math.max(start.x, end.x));
  const y2 = clamp01(Math.max(start.y, end.y));

  return {
    type: "region",
    x: x1,
    y: y1,
    width: x2 - x1,
    height: y2 - y1,
  };
}

export function nudgePoint(
  point: PointSelection,
  delta: { x: number; y: number },
  step = 0.005,
): PointSelection {
  return {
    type: "point",
    x: clamp01(point.x + delta.x * step),
    y: clamp01(point.y + delta.y * step),
  };
}

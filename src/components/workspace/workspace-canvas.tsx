"use client";

import { useEffect, useMemo, useRef, useState, type PointerEventHandler } from "react";
import Image from "next/image";
import { Crosshair, Hand, MousePointer2, Search, ZoomIn, ZoomOut } from "lucide-react";
import {
  createNormalizedRegion,
  getMediaLayout,
  normalizedToViewport,
  nudgePoint,
  viewportToNormalized,
  type PointSelection,
  type Selection,
} from "@/lib/workspace/geometry";
import type { AnalysisState } from "@/components/analysis/analysis-inspector";

type Props = {
  selection: Selection | null;
  setSelection: (selection: Selection | null) => void;
  analysisState: AnalysisState;
};

const sampleSvg = `<svg xmlns='http://www.w3.org/2000/svg' width='1280' height='800' viewBox='0 0 1280 800'>
<defs>
<linearGradient id='bg' x1='0' y1='0' x2='1' y2='1'><stop stop-color='#21283A'/><stop offset='1' stop-color='#121726'/></linearGradient>
<linearGradient id='panel' x1='0' y1='0' x2='1' y2='0'><stop stop-color='#313B56'/><stop offset='1' stop-color='#242B3E'/></linearGradient>
</defs>
<rect width='1280' height='800' fill='url(#bg)'/>
<rect x='104' y='96' width='1072' height='608' rx='24' fill='url(#panel)' stroke='#4A5778'/>
<rect x='164' y='162' width='520' height='280' rx='20' fill='#1A2030' stroke='#4A5778'/>
<rect x='728' y='162' width='396' height='168' rx='20' fill='#171E2B' stroke='#46516D'/>
<rect x='728' y='356' width='396' height='284' rx='20' fill='#171E2B' stroke='#46516D'/>
<circle cx='384' cy='538' r='98' fill='#D07A5E' opacity='0.75'/>
<text x='164' y='128' fill='#D7DDF0' font-size='34' font-family='Arial'>TRACE Sample Scene (Demo)</text>
</svg>`;

export function WorkspaceCanvas({ selection, setSelection, analysisState }: Props) {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const uploadedObjectUrlRef = useRef<string | null>(null);
  const [viewport, setViewport] = useState({ width: 1, height: 1 });
  const [assetSrc, setAssetSrc] = useState<string>(`data:image/svg+xml;utf8,${encodeURIComponent(sampleSvg)}`);
  const [assetName, setAssetName] = useState<string>("Sample fixture (demo)");
  const [assetSize, setAssetSize] = useState({ width: 1280, height: 800 });
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dragOver, setDragOver] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [tool, setTool] = useState<"point" | "region" | "pan">("point");
  const [activePointerId, setActivePointerId] = useState<number | null>(null);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const [panStart, setPanStart] = useState<{ x: number; y: number; panX: number; panY: number } | null>(null);

  useEffect(() => {
    const target = viewportRef.current;
    if (!target) {
      return;
    }

    const observer = new ResizeObserver((entries) => {
      const box = entries[0]?.contentRect;
      if (!box) {
        return;
      }
      setViewport({ width: box.width, height: box.height });
    });

    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  useEffect(
    () => () => {
      if (uploadedObjectUrlRef.current) {
        URL.revokeObjectURL(uploadedObjectUrlRef.current);
      }
    },
    [],
  );

  const mediaLayout = useMemo(
    () => getMediaLayout({ x: 0, y: 0, width: viewport.width, height: viewport.height }, assetSize, zoom, pan),
    [viewport, assetSize, zoom, pan],
  );

  const statusText =
    analysisState === "uploading"
      ? "Upload in progress"
      : analysisState === "processing"
        ? "Processing media"
        : analysisState === "analyzing"
          ? "Analysis running"
          : "Ready";

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setUploadError("Unsupported file type. Please upload an image.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setUploadError("File too large. Limit is 10MB in this phase.");
      return;
    }

    setUploadError(null);
    if (uploadedObjectUrlRef.current) {
      URL.revokeObjectURL(uploadedObjectUrlRef.current);
    }
    const url = URL.createObjectURL(file);
    uploadedObjectUrlRef.current = url;
    setAssetSrc(url);
    setAssetName(file.name);
    setSelection(null);
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const handlePointerDown: PointerEventHandler<HTMLDivElement> = (event) => {
    if (activePointerId !== null) {
      return;
    }

    const normalized = viewportToNormalized({ x: event.nativeEvent.offsetX, y: event.nativeEvent.offsetY }, mediaLayout);
    setActivePointerId(event.pointerId);
    event.currentTarget.setPointerCapture(event.pointerId);

    if (tool === "point") {
      setSelection({ type: "point", x: normalized.x, y: normalized.y });
      return;
    }

    if (tool === "region") {
      setDragStart(normalized);
      setSelection({ type: "region", x: normalized.x, y: normalized.y, width: 0, height: 0 });
      return;
    }

    setPanStart({ x: event.clientX, y: event.clientY, panX: pan.x, panY: pan.y });
  };

  const handlePointerMove: PointerEventHandler<HTMLDivElement> = (event) => {
    if (event.pointerId !== activePointerId) {
      return;
    }

    if (tool === "region" && dragStart) {
      const normalized = viewportToNormalized({ x: event.nativeEvent.offsetX, y: event.nativeEvent.offsetY }, mediaLayout);
      setSelection(createNormalizedRegion(dragStart, normalized));
      return;
    }

    if (tool === "pan" && panStart) {
      setPan({
        x: panStart.panX + (event.clientX - panStart.x),
        y: panStart.panY + (event.clientY - panStart.y),
      });
    }
  };

  const handlePointerUp: PointerEventHandler<HTMLDivElement> = (event) => {
    if (event.pointerId !== activePointerId) {
      return;
    }

    setActivePointerId(null);
    setDragStart(null);
    setPanStart(null);
  };

  const pointScreen =
    selection?.type === "point" ? normalizedToViewport({ x: selection.x, y: selection.y }, mediaLayout) : null;

  const regionScreen =
    selection?.type === "region"
      ? {
          topLeft: normalizedToViewport({ x: selection.x, y: selection.y }, mediaLayout),
          bottomRight: normalizedToViewport(
            { x: selection.x + selection.width, y: selection.y + selection.height },
            mediaLayout,
          ),
        }
      : null;

  return (
    <section className="flex min-h-[420px] flex-1 flex-col overflow-hidden rounded-2xl border border-[var(--trace-border)] bg-[var(--trace-surface)]">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--trace-border)] p-3">
        <div className="flex items-center gap-2">
          <button onClick={() => setTool("point")} className={`trace-tool-btn ${tool === "point" ? "trace-tool-btn-active" : ""}`}>
            <Crosshair className="h-4 w-4" /> Point
          </button>
          <button onClick={() => setTool("region")} className={`trace-tool-btn ${tool === "region" ? "trace-tool-btn-active" : ""}`}>
            <MousePointer2 className="h-4 w-4" /> Region
          </button>
          <button onClick={() => setTool("pan")} className={`trace-tool-btn ${tool === "pan" ? "trace-tool-btn-active" : ""}`}>
            <Hand className="h-4 w-4" /> Pan
          </button>
        </div>

        <div className="flex items-center gap-1">
          <button aria-label="Zoom out" onClick={() => setZoom((value) => Math.max(0.5, value - 0.1))} className="trace-icon-btn">
            <ZoomOut className="h-4 w-4" />
          </button>
          <button aria-label="Zoom in" onClick={() => setZoom((value) => Math.min(3, value + 0.1))} className="trace-icon-btn">
            <ZoomIn className="h-4 w-4" />
          </button>
          <button
            onClick={() => {
              setZoom(1);
              setPan({ x: 0, y: 0 });
            }}
            className="trace-tool-btn"
          >
            <Search className="h-4 w-4" /> Fit
          </button>
          <button onClick={() => setSelection(null)} className="trace-tool-btn">
            Clear selection
          </button>
        </div>
      </div>

      <div
        ref={viewportRef}
        className="relative min-h-[360px] flex-1 overflow-hidden bg-[#090e18]"
        onDragOver={(event) => {
          event.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragOver(false);
          const file = event.dataTransfer.files.item(0);
          if (file) {
            handleFile(file);
          }
        }}
      >
        <>
          <Image
              src={assetSrc}
              alt={assetName}
              unoptimized
              width={assetSize.width}
              height={assetSize.height}
              style={{
                left: mediaLayout.mediaX,
                top: mediaLayout.mediaY,
                width: mediaLayout.mediaWidth,
                height: mediaLayout.mediaHeight,
              }}
              onLoad={(event) => {
                const target = event.currentTarget as HTMLImageElement;
                setAssetSize({ width: target.naturalWidth, height: target.naturalHeight });
              }}
              className="pointer-events-none absolute object-contain"
            />

            <div
              role="application"
              aria-label="Selection canvas"
              tabIndex={0}
              onKeyDown={(event) => {
                if (selection?.type === "point") {
                  if (event.key === "ArrowLeft") setSelection(nudgePoint(selection as PointSelection, { x: -1, y: 0 }));
                  if (event.key === "ArrowRight") setSelection(nudgePoint(selection as PointSelection, { x: 1, y: 0 }));
                  if (event.key === "ArrowUp") setSelection(nudgePoint(selection as PointSelection, { x: 0, y: -1 }));
                  if (event.key === "ArrowDown") setSelection(nudgePoint(selection as PointSelection, { x: 0, y: 1 }));
                }
                if (event.key === "Escape") {
                  setSelection(null);
                }
              }}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              className="absolute inset-0 cursor-crosshair outline-none focus-visible:ring-2 focus-visible:ring-[var(--trace-accent)]"
            >
              <svg className="absolute inset-0 h-full w-full" aria-hidden="true">
                {pointScreen && (
                  <g>
                    <circle cx={pointScreen.x} cy={pointScreen.y} r="10" fill="none" stroke="var(--trace-selection)" strokeWidth="2" />
                    <line x1={pointScreen.x - 18} y1={pointScreen.y} x2={pointScreen.x + 18} y2={pointScreen.y} stroke="var(--trace-selection)" strokeWidth="2" />
                    <line x1={pointScreen.x} y1={pointScreen.y - 18} x2={pointScreen.x} y2={pointScreen.y + 18} stroke="var(--trace-selection)" strokeWidth="2" />
                    <path d={`M ${pointScreen.x + 16} ${pointScreen.y - 28} l 18 -10 l -8 18 z`} fill="var(--trace-selection)" />
                  </g>
                )}

                {regionScreen && (
                  <rect
                    x={regionScreen.topLeft.x}
                    y={regionScreen.topLeft.y}
                    width={Math.max(2, regionScreen.bottomRight.x - regionScreen.topLeft.x)}
                    height={Math.max(2, regionScreen.bottomRight.y - regionScreen.topLeft.y)}
                    fill="color-mix(in oklab, var(--trace-selection) 18%, transparent)"
                    stroke="var(--trace-selection)"
                    strokeWidth="2"
                    rx="6"
                  />
                )}
              </svg>
            </div>
        </>

        <label className="absolute left-4 top-4 rounded-xl border border-[var(--trace-border)] bg-black/40 px-3 py-2 text-xs text-[var(--trace-text-secondary)]">
          Upload image
          <input
            type="file"
            className="sr-only"
            accept="image/*"
            onChange={(event) => {
              const file = event.target.files?.item(0);
              if (file) {
                handleFile(file);
              }
            }}
          />
        </label>

        <button
          onClick={() => {
            setAssetSrc(`data:image/svg+xml;utf8,${encodeURIComponent(sampleSvg)}`);
            setAssetName("Sample fixture (demo)");
            setAssetSize({ width: 1280, height: 800 });
            setSelection(null);
          }}
          className="absolute left-4 top-16 rounded-xl border border-[var(--trace-border)] bg-black/40 px-3 py-2 text-xs text-[var(--trace-text-secondary)]"
        >
          Load sample fixture
        </button>

        {dragOver && (
          <div className="absolute inset-0 grid place-items-center bg-[color-mix(in_oklab,var(--trace-accent)_24%,transparent)] text-sm font-medium text-white">
            Drop image to upload
          </div>
        )}

        {uploadError && (
          <p className="absolute bottom-4 left-4 rounded-lg border border-red-500/50 bg-red-500/15 px-3 py-2 text-xs text-red-200">{uploadError}</p>
        )}
      </div>

      <footer className="flex flex-wrap items-center justify-between gap-2 border-t border-[var(--trace-border)] px-3 py-2 text-xs text-[var(--trace-text-secondary)]">
        <p>
          {assetName} • {assetSize.width}×{assetSize.height}
        </p>
        <p>
          Zoom {Math.round(zoom * 100)}% • status: {statusText}
        </p>
      </footer>
    </section>
  );
}

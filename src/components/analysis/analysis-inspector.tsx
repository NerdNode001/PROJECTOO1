"use client";

import { AlertTriangle, CheckCircle2, Loader2 } from "lucide-react";
import type { AnalysisReportV1 } from "@/types/analysis";
import type { Selection } from "@/lib/workspace/geometry";

export type AnalysisState =
  | "idle"
  | "uploading"
  | "processing"
  | "analyzing"
  | "success"
  | "network-error"
  | "model-missing"
  | "rate-limit"
  | "validation-error";

type Props = {
  mode: string;
  setMode: (mode: string) => void;
  intent: string;
  setIntent: (value: string) => void;
  consentChecked: boolean;
  setConsentChecked: (value: boolean) => void;
  selection: Selection | null;
  analysisState: AnalysisState;
  runAnalysis: () => void;
  cancelAnalysis: () => void;
  report: AnalysisReportV1 | null;
  className?: string;
};

const modeOptions = [
  { value: "auto", label: "Auto" },
  { value: "photography", label: "Photography" },
  { value: "video", label: "Video Frame" },
  { value: "graphic-design", label: "Graphic Design" },
  { value: "ui", label: "Website/UI" },
  { value: "product-3d", label: "Product/3D" },
];

const intentOptions = [
  "Recreate lighting",
  "Understand composition",
  "Recreate typography/layout",
  "Explain this texture",
];

const errorCopy: Record<string, string> = {
  "network-error": "Network failure. Retry when connection is stable.",
  "model-missing": "Model not configured. Add TRACE_VISION_PROVIDER and TRACE_VISION_MODEL in environment config.",
  "rate-limit": "Rate limit reached. Wait and retry.",
  "validation-error": "Analysis output validation failed. Retry or adjust selection.",
};

export function AnalysisInspector(props: Props) {
  const {
    mode,
    setMode,
    intent,
    setIntent,
    consentChecked,
    setConsentChecked,
    selection,
    analysisState,
    runAnalysis,
    cancelAnalysis,
    report,
    className,
  } = props;

  const busy = ["uploading", "processing", "analyzing"].includes(analysisState);
  const hasError = analysisState.includes("error") || analysisState === "model-missing" || analysisState === "rate-limit";

  return (
    <aside className={`w-full border-l border-[var(--trace-border)] bg-[var(--trace-panel)] p-4 md:w-[392px] ${className ?? ""}`}>
      <div className="space-y-4">
        <div>
          <h2 className="text-sm font-semibold text-white">Analysis Inspector</h2>
          <p className="mt-1 text-xs text-[var(--trace-text-secondary)]">Seeded sample states for Phase 1 UI validation.</p>
        </div>

        <label className="block space-y-2 text-sm">
          <span className="text-[var(--trace-text-secondary)]">Mode</span>
          <select
            value={mode}
            onChange={(event) => setMode(event.target.value)}
            className="trace-input"
          >
            {modeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="block space-y-2 text-sm">
          <span className="text-[var(--trace-text-secondary)]">Goal</span>
          <select value={intent} onChange={(event) => setIntent(event.target.value)} className="trace-input">
            {intentOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <label className="flex items-start gap-2 rounded-xl border border-[var(--trace-border)] bg-[var(--trace-surface)] p-3 text-xs text-[var(--trace-text-secondary)]">
          <input
            type="checkbox"
            checked={consentChecked}
            onChange={(event) => setConsentChecked(event.target.checked)}
            className="mt-0.5"
          />
          I understand selected media is sent to a configured remote analysis service when Analyze is pressed.
        </label>

        <div className="rounded-xl border border-[var(--trace-border)] bg-[var(--trace-surface)] p-3 text-xs text-[var(--trace-text-secondary)]">
          {selection ? (
            selection.type === "point" ? (
              <p>Target: point ({selection.x.toFixed(3)}, {selection.y.toFixed(3)})</p>
            ) : (
              <p>
                Target: region ({selection.x.toFixed(3)}, {selection.y.toFixed(3)}) / {selection.width.toFixed(3)}×{selection.height.toFixed(3)}
              </p>
            )
          ) : (
            <p>No selection set yet.</p>
          )}
        </div>

        <div className="flex gap-2">
          <button
            disabled={!selection || !consentChecked || busy}
            onClick={runAnalysis}
            className="flex-1 rounded-xl bg-[var(--trace-accent)] px-3 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            Analyze selection
          </button>
          <button
            onClick={cancelAnalysis}
            disabled={!busy}
            className="rounded-xl border border-[var(--trace-border)] px-3 py-2 text-sm text-[var(--trace-text-secondary)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>
        </div>

        {busy && (
          <div className="flex items-center gap-2 rounded-xl border border-[var(--trace-border)] bg-[var(--trace-surface)] p-3 text-sm text-[var(--trace-text-secondary)]">
            <Loader2 className="h-4 w-4 animate-spin" />
            {analysisState === "uploading" && "Uploading media..."}
            {analysisState === "processing" && "Processing asset..."}
            {analysisState === "analyzing" && "Generating structured analysis..."}
          </div>
        )}

        {hasError && (
          <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-200">
            <div className="mb-1 flex items-center gap-2 font-medium">
              <AlertTriangle className="h-4 w-4" />
              Analysis failed
            </div>
            <p>{errorCopy[analysisState] ?? "Unknown error"}</p>
          </div>
        )}

        {analysisState === "success" && report && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-3 text-sm text-emerald-200">
              <CheckCircle2 className="h-4 w-4" />
              Analysis complete
            </div>
            <section className="trace-card">
              <h3 className="trace-card-title">Summary</h3>
              <p className="trace-card-copy">{report.summary}</p>
            </section>
            <section className="trace-card">
              <h3 className="trace-card-title">Observations</h3>
              <ul className="space-y-2 text-xs text-[var(--trace-text-secondary)]">
                {report.observations.map((item) => (
                  <li key={item.detail}>• {item.detail}</li>
                ))}
              </ul>
            </section>
            <section className="trace-card">
              <h3 className="trace-card-title">Recreation steps</h3>
              <ol className="space-y-2 text-xs text-[var(--trace-text-secondary)]">
                {report.steps.map((step) => (
                  <li key={step.order}>
                    {step.order}. {step.instruction}
                  </li>
                ))}
              </ol>
            </section>
          </div>
        )}
      </div>
    </aside>
  );
}

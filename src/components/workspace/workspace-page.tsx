"use client";

import { useEffect, useState } from "react";
import { PanelRightClose, PanelRightOpen } from "lucide-react";
import { AnalysisInspector, type AnalysisState } from "@/components/analysis/analysis-inspector";
import { WorkspaceCanvas } from "@/components/workspace/workspace-canvas";
import { sampleReport } from "@/lib/analysis/sample-report";
import type { Selection } from "@/lib/workspace/geometry";
import { analysisReportV1Schema } from "@/types/analysis";

export function WorkspacePage() {
  const [selection, setSelection] = useState<Selection | null>(null);
  const [mode, setMode] = useState("auto");
  const [intent, setIntent] = useState("Recreate lighting");
  const [consentChecked, setConsentChecked] = useState(false);
  const [analysisState, setAnalysisState] = useState<AnalysisState>("idle");
  const [mobileInspectorOpen, setMobileInspectorOpen] = useState(false);

  useEffect(() => {
    if (!["uploading", "processing", "analyzing"].includes(analysisState)) {
      return;
    }

    const timers = [
      setTimeout(() => setAnalysisState("processing"), 800),
      setTimeout(() => setAnalysisState("analyzing"), 1700),
      setTimeout(() => {
        const result = analysisReportV1Schema.safeParse(sampleReport);
        setAnalysisState(result.success ? "success" : "validation-error");
      }, 2700),
    ];

    return () => timers.forEach((timer) => clearTimeout(timer));
  }, [analysisState]);

  return (
    <div className="relative flex flex-1 overflow-hidden">
      <div className="flex min-h-0 flex-1 flex-col gap-4 p-4 pb-20 md:p-6">
        <div className="rounded-xl border border-[var(--trace-border)] bg-[var(--trace-panel)] px-3 py-2 text-xs text-[var(--trace-text-secondary)]">
          Demo notice: this phase includes real interactions and seeded analysis states only.
        </div>
        <WorkspaceCanvas selection={selection} setSelection={setSelection} analysisState={analysisState} />
      </div>
      <button
        onClick={() => setMobileInspectorOpen((open) => !open)}
        className="fixed bottom-20 right-4 z-40 flex items-center gap-1 rounded-full border border-[var(--trace-border)] bg-[var(--trace-panel)] px-3 py-2 text-xs text-white md:hidden"
      >
        {mobileInspectorOpen ? <PanelRightClose className="h-4 w-4" /> : <PanelRightOpen className="h-4 w-4" />}
        Inspector
      </button>
      <AnalysisInspector
        mode={mode}
        setMode={setMode}
        intent={intent}
        setIntent={setIntent}
        consentChecked={consentChecked}
        setConsentChecked={setConsentChecked}
        selection={selection}
        analysisState={analysisState}
        runAnalysis={() => setAnalysisState("uploading")}
        cancelAnalysis={() => setAnalysisState("idle")}
        report={analysisState === "success" ? sampleReport : null}
        className={`${mobileInspectorOpen ? "fixed inset-x-0 bottom-14 top-28 z-30 max-h-[calc(100vh-9rem)] overflow-y-auto" : "hidden"} md:static md:block`}
      />
    </div>
  );
}

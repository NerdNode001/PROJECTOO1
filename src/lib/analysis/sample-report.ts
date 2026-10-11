import type { AnalysisReportV1 } from "@/types/analysis";

export const sampleReport: AnalysisReportV1 = {
  schemaVersion: "1.0",
  analysisId: "sample-phase1",
  mode: "photography",
  userGoal: "Recreate lighting and composition",
  selectedRegion: { type: "region", x: 0.24, y: 0.2, width: 0.42, height: 0.48 },
  summary:
    "Soft side lighting and a moderate telephoto perspective create separation between the subject and dark background.",
  observations: [
    {
      detail: "Key light appears from camera-left at a 45° angle.",
      evidence: "Shadow falloff transitions from left-to-right across the face.",
      relevance: "Primary light placement sets mood and contrast.",
    },
  ],
  inferences: [
    {
      technique: "Use a softbox with feathered edge on subject.",
      reasoning: "Specular highlights are broad and gentle, indicating diffusion.",
      confidence: "Medium",
      alternatives: ["Large bounce card", "Window light with sheer curtain"],
      validationTest: "Move key light laterally until nose shadow aligns with reference.",
    },
  ],
  metadataFacts: [
    { field: "EXIF available", value: "Not present in this sample", source: "exif", available: false },
  ],
  unknowns: ["Exact lens model cannot be verified from pixels alone."],
  materials: ["Dark backdrop", "Diffusion fabric", "Flag for spill control"],
  tools: ["Camera", "Tripod", "Softbox strobe"],
  steps: [
    {
      order: 1,
      instruction: "Frame the subject at eye level and leave negative space to camera-right.",
      checkpoint: "Subject occupies roughly 40% of frame width.",
      targetTool: "Camera",
      adjustableParameters: ["Distance", "Focal range 50-85mm equivalent"],
    },
    {
      order: 2,
      instruction: "Place soft key light at 45° camera-left and slightly above eye level.",
      checkpoint: "Shadow edge remains soft with visible cheek contour.",
      targetTool: "Lighting",
      adjustableParameters: ["Light distance", "Power"],
    },
  ],
  troubleshooting: [
    {
      symptom: "Shadows look harsh",
      likelyCause: "Light source too small or too far",
      adjustment: "Increase diffusion size or move light closer",
    },
  ],
  references: [],
  limitations: ["This is a seeded demo report, not a live provider analysis."],
  modelInfo: { provider: "demo", model: "seeded-state" },
  promptVersion: "phase1-demo",
};

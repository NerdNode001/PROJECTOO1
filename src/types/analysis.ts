import { z } from "zod";

const confidence = z.enum(["High", "Medium", "Low"]);

export const analysisReportV1Schema = z.object({
  schemaVersion: z.literal("1.0"),
  analysisId: z.string().min(1),
  mode: z.enum(["auto", "photography", "video", "graphic-design", "ui", "product-3d"]),
  userGoal: z.string().min(1),
  selectedRegion: z.object({
    type: z.enum(["point", "region"]),
    x: z.number().min(0).max(1),
    y: z.number().min(0).max(1),
    width: z.number().min(0).max(1).optional(),
    height: z.number().min(0).max(1).optional(),
  }),
  summary: z.string().min(1),
  observations: z.array(
    z.object({
      detail: z.string().min(1),
      evidence: z.string().min(1),
      relevance: z.string().min(1),
    }),
  ),
  inferences: z.array(
    z.object({
      technique: z.string().min(1),
      reasoning: z.string().min(1),
      confidence,
      alternatives: z.array(z.string()),
      validationTest: z.string().min(1),
    }),
  ),
  metadataFacts: z.array(
    z.object({
      field: z.string(),
      value: z.string(),
      source: z.enum(["exif", "iptc", "user", "verified-other"]),
      available: z.boolean(),
    }),
  ),
  unknowns: z.array(z.string()),
  materials: z.array(z.string()),
  tools: z.array(z.string()),
  steps: z.array(
    z.object({
      order: z.number().int().positive(),
      instruction: z.string().min(1),
      checkpoint: z.string().min(1),
      targetTool: z.string().min(1),
      adjustableParameters: z.array(z.string()),
      notes: z.string().optional(),
    }),
  ),
  troubleshooting: z.array(
    z.object({
      symptom: z.string(),
      likelyCause: z.string(),
      adjustment: z.string(),
    }),
  ),
  references: z.array(
    z.object({
      title: z.string(),
      source: z.string(),
      url: z.string().url(),
    }),
  ),
  limitations: z.array(z.string()),
  modelInfo: z.object({
    provider: z.string(),
    model: z.string(),
  }),
  promptVersion: z.string(),
});

export type AnalysisReportV1 = z.infer<typeof analysisReportV1Schema>;

import { describe, expect, it } from "vitest";
import { sampleReport } from "@/lib/analysis/sample-report";
import { analysisReportV1Schema } from "@/types/analysis";

describe("analysis report schema", () => {
  it("accepts the seeded sample report", () => {
    expect(analysisReportV1Schema.safeParse(sampleReport).success).toBe(true);
  });
});

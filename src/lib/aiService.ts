import type { ExtractedInformation } from "./documentService";

export interface StructuredMedicalInformation {
  history: string;
  summary: string;
}

/** Returns draft structure only. A physician must verify every generated field. */
export async function structureMedicalInformation(
  complaint: string,
  extracted: ExtractedInformation,
): Promise<StructuredMedicalInformation> {
  return {
    history: `${complaint || "Current concern not entered"}. Previous records include ${extracted.conditions.join(", ") || "no listed conditions"}.`,
    summary: "Draft summary based on patient responses and uploaded records. Physician review required.",
  };
}

export async function generateCaseSummary(): Promise<string> {
  return "Draft only: patient-reported information and uploaded records are ready for physician verification.";
}
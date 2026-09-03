export interface ExtractedInformation {
  conditions: string[];
  medications: string[];
  labResults: { name: string; value: string; status: string }[];
  source: "demo" | "ocr";
}

/** Replace this mock with OCR / Gemini Vision while keeping the document flow intact. */
export async function extractDocument(_fileName: string): Promise<ExtractedInformation> {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return {
    conditions: ["Type 2 Diabetes"],
    medications: ["Metformin 500 mg"],
    labResults: [{ name: "Hemoglobin", value: "10.8 g/dL", status: "Below reference range" }],
    source: "demo",
  };
}
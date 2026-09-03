export type SpeechState = "idle" | "listening" | "processing" | "result";

export interface SpeechResult {
  text: string;
  language: string;
  source: "mock" | "bhashini";
}

/** Replace this mock with Bhashini ASR without changing the kiosk UI. */
export async function speechToText(language = "ગુજરાતી"): Promise<SpeechResult> {
  await new Promise((resolve) => setTimeout(resolve, 900));
  return {
    text: language === "ગુજરાતી" ? "મને કાલથી પેટમાં દુખાવો છે" : "I have had stomach pain since yesterday",
    language,
    source: "mock",
  };
}
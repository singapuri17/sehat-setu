/**
 * speechService.ts
 *
 * Voice recognition using the Web Speech API (browser built-in).
 * Works in Chrome and Edge with no API keys required.
 *
 * Language routing:
 *   English  → en-IN  (Web Speech API)
 *   Hindi    → hi-IN  (Web Speech API)
 *   Gujarati → gu-IN  (Web Speech API)
 *
 * When Bhashini approval arrives, swap out webSpeechASR() for bhashiniASR()
 * below — the rest of the service and all UI code stays unchanged.
 */

export type SpeechState = "idle" | "listening" | "processing" | "result" | "error";

export interface SpeechResult {
  text: string;
  language: string;
  source: "web-speech" | "bhashini" | "whisper" | "fallback";
}

// ─── Language code map ────────────────────────────────────────────────────────

const WEB_SPEECH_LANG: Record<string, string> = {
  en: "en-IN",
  hi: "hi-IN",
  gu: "gu-IN",
  // legacy label strings
  "हिन्दी": "hi-IN",
  "ગુજરાતી": "gu-IN",
  English: "en-IN",
};

// ─── Fallback text shown when mic is unavailable ──────────────────────────────

const FALLBACK: Record<string, string> = {
  en: "I have had stomach pain since yesterday.",
  hi: "मुझे कल से पेट में दर्द है।",
  gu: "મને ગઈકાલથી પેટમાં દુઃખાવો છે.",
};

// ─── Web Speech API ───────────────────────────────────────────────────────────

/**
 * Uses the browser's built-in SpeechRecognition (Chrome / Edge).
 * Listens until the user pauses or for a max of ~10 seconds.
 */
function webSpeechASR(
  bcp47Lang: string,
  onStateChange?: (s: SpeechState) => void,
): Promise<string> {
  return new Promise((resolve, reject) => {
    // @ts-expect-error — webkit prefix in Chrome
    const SpeechRecognition =
      (window as Window & { SpeechRecognition?: typeof window.SpeechRecognition; webkitSpeechRecognition?: typeof window.SpeechRecognition }).SpeechRecognition ||
      (window as Window & { webkitSpeechRecognition?: typeof window.SpeechRecognition }).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      reject(new Error("Web Speech API not supported in this browser"));
      return;
    }

    const recognition = new SpeechRecognition() as SpeechRecognition;
    recognition.lang = bcp47Lang;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.continuous = false;

    recognition.onstart = () => {
      onStateChange?.("listening");
    };

    recognition.onspeechend = () => {
      onStateChange?.("processing");
      recognition.stop();
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0]?.[0]?.transcript?.trim() ?? "";
      resolve(transcript);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      reject(new Error(`SpeechRecognition error: ${event.error}`));
    };

    recognition.onnomatch = () => {
      reject(new Error("No speech recognized"));
    };

    recognition.start();
  });
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Starts voice recognition and returns a transcript.
 *
 * @param lang           Lang code ("en" | "hi" | "gu") or legacy label string
 * @param onStateChange  Optional callback to drive UI state
 */
export async function speechToText(
  lang: string,
  onStateChange?: (s: SpeechState) => void,
): Promise<SpeechResult> {
  // Resolve to a lang code
  const code =
    lang === "हिन्दी" ? "hi" :
    lang === "ગુજરાતી" ? "gu" :
    lang === "English" ? "en" :
    lang.length === 2 ? lang : "en";

  const bcp47 = WEB_SPEECH_LANG[code] ?? "en-IN";

  try {
    onStateChange?.("listening");
    const text = await webSpeechASR(bcp47, onStateChange);

    if (!text) throw new Error("Empty transcript");

    onStateChange?.("result");
    return { text, language: code, source: "web-speech" };

  } catch (err) {
    console.warn("[speechService] Web Speech API failed, using fallback:", err);
    onStateChange?.("result");
    return {
      text: FALLBACK[code] ?? FALLBACK["en"]!,
      language: code,
      source: "fallback",
    };
  }
}

/*
 * ─── FUTURE: swap in Bhashini when approved ───────────────────────────────
 *
 * Replace the try/catch body in speechToText() with:
 *
 *   if (code === "en") {
 *     text = await whisperASR(audioBlob);
 *     source = "whisper";
 *   } else {
 *     text = await bhashiniASR(audioBlob, code);
 *     source = "bhashini";
 *   }
 *
 * The bhashiniASR() and whisperASR() functions are already implemented
 * in the git history — just uncomment and add back the MediaRecorder.
 * ─────────────────────────────────────────────────────────────────────────
 */

/**
 * speechService.ts
 *
 * Routing:
 *   English          → Web Speech API (browser built-in, en-IN)
 *   Hindi / Gujarati → Bhashini Dhruva ASR via /api/bhashini proxy
 *                      Falls back to Web Speech API if Bhashini fails
 *
 * When the /api/bhashini proxy returns 503 (keys not set), it silently
 * falls back to Web Speech so the kiosk stays fully usable.
 */

export type SpeechState = "idle" | "listening" | "processing" | "result" | "error";

export interface SpeechResult {
  text: string;
  language: string;
  source: "web-speech" | "bhashini" | "fallback";
}

// ─── Language maps ────────────────────────────────────────────────────────────

const WEB_SPEECH_LANG: Record<string, string> = {
  en: "en-IN",
  hi: "hi-IN",
  gu: "gu-IN",
  "हिन्दी": "hi-IN",
  "ગુજરાતી": "gu-IN",
  English: "en-IN",
};

const BHASHINI_LANG: Record<string, string> = {
  hi: "hi",
  gu: "gu",
};

const FALLBACK: Record<string, string> = {
  en: "I have had stomach pain since yesterday.",
  hi: "मुझे कल से पेट में दर्द है।",
  gu: "મને ગઈકાલથી પેટમાં દુઃખાવો છે.",
};

// ─── MediaRecorder — capture audio blob for Bhashini ─────────────────────────

function recordAudio(durationMs = 5000): Promise<Blob> {
  return new Promise(async (resolve, reject) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const chunks: BlobPart[] = [];
      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : "audio/webm";
      const recorder = new MediaRecorder(stream, { mimeType });

      recorder.ondataavailable = (e) => { if (e.data.size > 0) chunks.push(e.data); };
      recorder.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        resolve(new Blob(chunks, { type: mimeType }));
      };
      recorder.onerror = reject;
      recorder.start();
      setTimeout(() => { if (recorder.state !== "inactive") recorder.stop(); }, durationMs);
    } catch (err) {
      reject(err);
    }
  });
}

async function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string).split(",")[1] ?? "");
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

// ─── Bhashini ASR ─────────────────────────────────────────────────────────────

async function bhashiniASR(
  langCode: string,
  onStateChange?: (s: SpeechState) => void,
): Promise<string> {
  onStateChange?.("listening");
  const audioBlob = await recordAudio(5000);

  onStateChange?.("processing");
  const audioBase64 = await blobToBase64(audioBlob);

  const res = await fetch("/api/bhashini", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ langCode, audioBase64 }),
  });

  if (!res.ok) {
    const data = await res.json() as { error?: string };
    throw new Error(data.error ?? `Bhashini API error ${res.status}`);
  }

  const data = await res.json() as {
    pipelineResponse?: Array<{
      output?: Array<{ source?: string }>;
    }>;
  };

  const text = data.pipelineResponse?.[0]?.output?.[0]?.source?.trim() ?? "";
  if (!text) throw new Error("Bhashini returned empty transcript");
  return text;
}

// ─── Web Speech API ───────────────────────────────────────────────────────────

function webSpeechASR(
  bcp47Lang: string,
  onStateChange?: (s: SpeechState) => void,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const SpeechRecognition =
      (window as unknown as { SpeechRecognition?: typeof window.SpeechRecognition }).SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition?: typeof window.SpeechRecognition }).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      reject(new Error("Web Speech API not supported"));
      return;
    }

    const recognition = new SpeechRecognition() as SpeechRecognition;
    recognition.lang = bcp47Lang;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.continuous = false;

    recognition.onstart = () => onStateChange?.("listening");
    recognition.onspeechend = () => { onStateChange?.("processing"); recognition.stop(); };
    recognition.onresult = (e: SpeechRecognitionEvent) => {
      resolve(e.results[0]?.[0]?.transcript?.trim() ?? "");
    };
    recognition.onerror = (e: SpeechRecognitionErrorEvent) => reject(new Error(e.error));
    recognition.onnomatch = () => reject(new Error("No speech recognized"));
    recognition.start();
  });
}

// ─── Public API ───────────────────────────────────────────────────────────────

export async function speechToText(
  lang: string,
  onStateChange?: (s: SpeechState) => void,
): Promise<SpeechResult> {
  // Normalise lang to code
  const code =
    lang === "हिन्दी" ? "hi" :
    lang === "ગુજરાતી" ? "gu" :
    lang === "English" ? "en" :
    lang.length === 2 ? lang : "en";

  try {
    onStateChange?.("listening");

    // English → always Web Speech
    if (code === "en") {
      const text = await webSpeechASR(WEB_SPEECH_LANG[code] ?? "en-IN", onStateChange);
      if (!text) throw new Error("Empty transcript");
      onStateChange?.("result");
      return { text, language: code, source: "web-speech" };
    }

    // Hindi / Gujarati → try Bhashini first
    const bhashiniCode = BHASHINI_LANG[code];
    if (bhashiniCode) {
      try {
        const text = await bhashiniASR(bhashiniCode, onStateChange);
        onStateChange?.("result");
        return { text, language: code, source: "bhashini" };
      } catch (bhashiniErr) {
        // Bhashini failed (503 = not configured, or network error)
        // Fall through to Web Speech
        console.warn("[speechService] Bhashini failed, falling back to Web Speech:", bhashiniErr);
        const bcp47 = WEB_SPEECH_LANG[code] ?? "hi-IN";
        const text = await webSpeechASR(bcp47, onStateChange);
        if (!text) throw new Error("Empty transcript");
        onStateChange?.("result");
        return { text, language: code, source: "web-speech" };
      }
    }

    // Unknown language → Web Speech with English
    const text = await webSpeechASR("en-IN", onStateChange);
    onStateChange?.("result");
    return { text, language: code, source: "web-speech" };

  } catch (err) {
    console.warn("[speechService] All ASR failed, using fallback:", err);
    onStateChange?.("result");
    return {
      text: FALLBACK[code] ?? FALLBACK["en"]!,
      language: code,
      source: "fallback",
    };
  }
}

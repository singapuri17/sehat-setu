/**
 * speechService.ts
 *
 * ASR routing:
 *   English          → Web Speech API (en-IN)
 *                      Falls back to OpenAI Whisper if Web Speech fails
 *   Hindi / Gujarati → Bhashini Dhruva ASR via /api/bhashini proxy
 *                      Falls back to Web Speech API, then Whisper, on failure
 *
 * When /api/bhashini returns 503 (keys not set), the kiosk degrades
 * gracefully to Web Speech so it is always usable.
 * When /api/whisper returns 503 (OPENAI_API_KEY not set), the last
 * resort is the static FALLBACK strings.
 */

export type SpeechState = "idle" | "listening" | "processing" | "result" | "error";

export interface SpeechResult {
  text: string;
  language: string;
  source: "web-speech" | "bhashini" | "whisper" | "fallback";
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

// ─── MediaRecorder — capture audio blob for Bhashini / Whisper ───────────────

function recordAudio(durationMs = 5000): Promise<Blob> {
  return new Promise(async (resolve, reject) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const chunks: BlobPart[] = [];
      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : "audio/webm";
      const recorder = new MediaRecorder(stream, { mimeType });

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };
      recorder.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        resolve(new Blob(chunks, { type: mimeType }));
      };
      recorder.onerror = reject;
      recorder.start();
      setTimeout(() => {
        if (recorder.state !== "inactive") recorder.stop();
      }, durationMs);
    } catch (err) {
      reject(err);
    }
  });
}

async function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () =>
      resolve((reader.result as string).split(",")[1] ?? "");
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
    const data = (await res.json()) as { error?: string };
    throw new Error(data.error ?? `Bhashini API error ${res.status}`);
  }

  const data = (await res.json()) as {
    pipelineResponse?: Array<{
      output?: Array<{ source?: string }>;
    }>;
  };

  const text =
    data.pipelineResponse?.[0]?.output?.[0]?.source?.trim() ?? "";
  if (!text) throw new Error("Bhashini returned empty transcript");
  return text;
}

// ─── OpenAI Whisper ASR ───────────────────────────────────────────────────────

async function whisperASR(
  audioBlob: Blob,
  onStateChange?: (s: SpeechState) => void,
): Promise<string> {
  onStateChange?.("processing");

  const formData = new FormData();
  // Whisper accepts webm; name must have an extension it recognises
  formData.append("file", audioBlob, "audio.webm");
  formData.append("model", "whisper-1");

  const res = await fetch("/api/whisper", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const data = (await res.json()) as { error?: string };
    throw new Error(data.error ?? `Whisper API error ${res.status}`);
  }

  const data = (await res.json()) as { text?: string };
  const text = data.text?.trim() ?? "";
  if (!text) throw new Error("Whisper returned empty transcript");
  return text;
}

// ─── Web Speech API ───────────────────────────────────────────────────────────

function webSpeechASR(
  bcp47Lang: string,
  onStateChange?: (s: SpeechState) => void,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const SpeechRecognition =
      (
        window as unknown as {
          SpeechRecognition?: typeof window.SpeechRecognition;
        }
      ).SpeechRecognition ||
      (
        window as unknown as {
          webkitSpeechRecognition?: typeof window.SpeechRecognition;
        }
      ).webkitSpeechRecognition;

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
    recognition.onspeechend = () => {
      onStateChange?.("processing");
      recognition.stop();
    };
    recognition.onresult = (e: SpeechRecognitionEvent) => {
      resolve(e.results[0]?.[0]?.transcript?.trim() ?? "");
    };
    recognition.onerror = (e: SpeechRecognitionErrorEvent) =>
      reject(new Error(e.error));
    recognition.onnomatch = () => reject(new Error("No speech recognized"));
    recognition.start();
  });
}

// ─── Public API ───────────────────────────────────────────────────────────────

export async function speechToText(
  lang: string,
  onStateChange?: (s: SpeechState) => void,
): Promise<SpeechResult> {
  // Normalise lang label to 2-letter code
  const code =
    lang === "हिन्दी"
      ? "hi"
      : lang === "ગુજરાતી"
        ? "gu"
        : lang === "English"
          ? "en"
          : lang.length === 2
            ? lang
            : "en";

  try {
    onStateChange?.("listening");

    // ── English: Web Speech → Whisper fallback ──────────────────────────────
    if (code === "en") {
      try {
        const text = await webSpeechASR(
          WEB_SPEECH_LANG[code] ?? "en-IN",
          onStateChange,
        );
        if (!text) throw new Error("Empty transcript");
        onStateChange?.("result");
        return { text, language: code, source: "web-speech" };
      } catch (webSpeechErr) {
        console.warn(
          "[speechService] Web Speech failed for English, trying Whisper:",
          webSpeechErr,
        );
        // Capture audio for Whisper
        onStateChange?.("listening");
        const audioBlob = await recordAudio(5000);
        const text = await whisperASR(audioBlob, onStateChange);
        onStateChange?.("result");
        return { text, language: code, source: "whisper" };
      }
    }

    // ── Hindi / Gujarati: Bhashini → Web Speech → Whisper fallback ──────────
    const bhashiniCode = BHASHINI_LANG[code];
    if (bhashiniCode) {
      try {
        const text = await bhashiniASR(bhashiniCode, onStateChange);
        onStateChange?.("result");
        return { text, language: code, source: "bhashini" };
      } catch (bhashiniErr) {
        console.warn(
          "[speechService] Bhashini failed, trying Web Speech:",
          bhashiniErr,
        );
        try {
          const bcp47 = WEB_SPEECH_LANG[code] ?? "hi-IN";
          const text = await webSpeechASR(bcp47, onStateChange);
          if (!text) throw new Error("Empty transcript");
          onStateChange?.("result");
          return { text, language: code, source: "web-speech" };
        } catch (webSpeechErr) {
          console.warn(
            "[speechService] Web Speech also failed, trying Whisper:",
            webSpeechErr,
          );
          onStateChange?.("listening");
          const audioBlob = await recordAudio(5000);
          const text = await whisperASR(audioBlob, onStateChange);
          onStateChange?.("result");
          return { text, language: code, source: "whisper" };
        }
      }
    }

    // ── Unknown language: Web Speech with English ────────────────────────────
    const text = await webSpeechASR("en-IN", onStateChange);
    onStateChange?.("result");
    return { text, language: code, source: "web-speech" };
  } catch (err) {
    console.warn("[speechService] All ASR engines failed, using fallback:", err);
    onStateChange?.("result");
    return {
      text: FALLBACK[code] ?? FALLBACK["en"]!,
      language: code,
      source: "fallback",
    };
  }
}

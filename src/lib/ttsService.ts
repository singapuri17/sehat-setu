/**
 * ttsService.ts
 *
 * Routing:
 *   English          → Web Speech API (SpeechSynthesis, browser built-in)
 *   Hindi / Gujarati → Bhashini Dhruva TTS via /api/bhashini-tts proxy
 *                      Falls back to Web Speech API if Bhashini fails or
 *                      returns 503 (keys not configured).
 *
 * Usage:
 *   import { speak, cancelSpeech } from "@/lib/ttsService";
 *   await speak("Hello", "en");
 *   cancelSpeech();
 */

import type { Lang } from "./i18n";

// ─── Language maps ────────────────────────────────────────────────────────────

/** BCP-47 candidates for Web Speech fallback, in preference order */
const WEB_SPEECH_TTS_LANG: Record<Lang, string[]> = {
  en: ["en-IN", "en-US", "en-GB"],
  hi: ["hi-IN", "hi"],
  gu: ["gu-IN", "gu", "hi-IN", "hi"], // gu-IN often missing; fall back to Hindi voice
};

/** Bhashini langCode for TTS */
const BHASHINI_TTS_LANG: Partial<Record<Lang, string>> = {
  hi: "hi",
  gu: "gu",
};

// ─── Web Speech TTS ───────────────────────────────────────────────────────────

/** Pick the best installed voice for the given BCP-47 candidates. */
function pickVoice(candidates: string[]): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis?.getVoices() ?? [];
  for (const candidate of candidates) {
    const exact = voices.find((v) => v.lang === candidate);
    if (exact) return exact;
    const prefix = voices.find((v) =>
      v.lang.startsWith(candidate.split("-")[0]!),
    );
    if (prefix) return prefix;
  }
  return null;
}

function webSpeechTTS(text: string, lang: Lang): Promise<void> {
  return new Promise((resolve) => {
    if (!window.speechSynthesis) {
      resolve();
      return;
    }
    window.speechSynthesis.cancel();

    const utt = new SpeechSynthesisUtterance(text);
    const candidates = WEB_SPEECH_TTS_LANG[lang];

    const trySpeak = () => {
      const voice = pickVoice(candidates);
      if (voice) {
        utt.voice = voice;
        utt.lang = voice.lang;
      } else {
        utt.lang = candidates[0] ?? "en-IN";
      }
      utt.rate = 0.88;
      utt.pitch = 1.0;
      utt.onend = () => resolve();
      utt.onerror = () => resolve();
      window.speechSynthesis.speak(utt);
    };

    if (window.speechSynthesis.getVoices().length === 0) {
      const handler = () => {
        trySpeak();
        window.speechSynthesis.removeEventListener("voiceschanged", handler);
      };
      window.speechSynthesis.addEventListener("voiceschanged", handler);
      // Safety timeout — speak anyway if voiceschanged never fires
      setTimeout(() => {
        window.speechSynthesis.removeEventListener("voiceschanged", handler);
        trySpeak();
      }, 800);
    } else {
      trySpeak();
    }
  });
}

// ─── Bhashini TTS ─────────────────────────────────────────────────────────────

async function bhashiniTTS(text: string, langCode: string): Promise<void> {
  const res = await fetch("/api/bhashini-tts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ langCode, text }),
  });

  if (!res.ok) {
    const data = (await res.json()) as { error?: string };
    throw new Error(data.error ?? `Bhashini TTS error ${res.status}`);
  }

  const { audioBase64 } = (await res.json()) as { audioBase64?: string };
  if (!audioBase64) throw new Error("Bhashini TTS returned empty audio");

  // Decode base64 → ArrayBuffer → AudioBuffer → play via Web Audio API
  const binary = atob(audioBase64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }

  const audioCtx = new AudioContext();
  const audioBuffer = await audioCtx.decodeAudioData(bytes.buffer);
  return new Promise((resolve, reject) => {
    const source = audioCtx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioCtx.destination);
    source.onended = () => {
      audioCtx.close().catch(() => {});
      resolve();
    };
    source.onerror = (e) => {
      audioCtx.close().catch(() => {});
      reject(e);
    };
    source.start(0);
  });
}

// ─── Public API ───────────────────────────────────────────────────────────────

/** Cancel any in-progress Web Speech utterance. */
export function cancelSpeech(): void {
  window.speechSynthesis?.cancel();
}

/**
 * Speak `text` in `lang`.
 *
 * - English → Web Speech API (always)
 * - Hindi / Gujarati → Bhashini TTS, falling back to Web Speech on any error
 *
 * Always resolves (never rejects) so callers can safely `await speak(...)`.
 */
export async function speak(text: string, lang: Lang): Promise<void> {
  if (!text.trim()) return;

  const bhashiniCode = BHASHINI_TTS_LANG[lang];

  // English always uses Web Speech
  if (!bhashiniCode) {
    return webSpeechTTS(text, lang);
  }

  // Hindi / Gujarati → try Bhashini first
  try {
    await bhashiniTTS(text, bhashiniCode);
  } catch (err) {
    console.warn("[ttsService] Bhashini TTS failed, falling back to Web Speech:", err);
    return webSpeechTTS(text, lang);
  }
}

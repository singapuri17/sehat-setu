/**
 * sessionService.ts
 *
 * Lightweight client-side session management for MediEase.
 *
 * A "session" ties together a patient's in-progress or completed clinical
 * intake regardless of which channel they used (kiosk or mobile).
 *
 * Session IDs are short-lived, alphanumeric, 8-character tokens that are
 * safe to embed in a URL and easy to type if needed.
 *
 * Storage: localStorage (client) + /api/session (server-side in-memory store).
 * For production you would persist to a database; in-memory is fine for demo.
 */

export type SessionChannel = "kiosk" | "mobile";
export type SessionStatus = "started" | "in-progress" | "complete";

export interface MediSession {
  id: string;
  channel: SessionChannel;
  status: SessionStatus;
  lang: string;
  createdAt: number; // epoch ms
  updatedAt: number;
  /** Partial intake data â€” populated as the patient progresses */
  data: Partial<{
    name: string;
    age: string;
    gender: string;
    complaint: string;
    answers: Record<number, string>;
    stream: string;
  }>;
}

const SESSION_KEY = "MediEase_session_id";

// â”€â”€â”€ ID generation â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function randomId(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // unambiguous charset
  let id = "";
  const arr = new Uint8Array(8);
  crypto.getRandomValues(arr);
  for (const byte of arr) id += chars[byte % chars.length];
  return id;
}

// â”€â”€â”€ Local storage helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export function getLocalSessionId(): string | null {
  try {
    return localStorage.getItem(SESSION_KEY);
  } catch {
    return null;
  }
}

export function setLocalSessionId(id: string): void {
  try {
    localStorage.setItem(SESSION_KEY, id);
  } catch {
    /* storage unavailable â€” kiosk still works without persistence */
  }
}

export function clearLocalSession(): void {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch { /* noop */ }
}

// â”€â”€â”€ API helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

/** Create a new session on the server and persist its ID locally. */
export async function createSession(
  channel: SessionChannel,
  lang = "en",
): Promise<MediSession> {
  const res = await fetch("/api/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ channel, lang }),
  });
  if (!res.ok) throw new Error(`Session create failed: ${res.status}`);
  const session = (await res.json()) as MediSession;
  setLocalSessionId(session.id);
  return session;
}

/** Fetch an existing session by ID. Returns null if not found / expired. */
export async function getSession(id: string): Promise<MediSession | null> {
  const res = await fetch(`/api/session?id=${encodeURIComponent(id)}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Session fetch failed: ${res.status}`);
  return (await res.json()) as MediSession;
}

/** Patch a session's data (partial update). */
export async function updateSession(
  id: string,
  patch: Partial<Pick<MediSession, "status" | "lang" | "data">>,
): Promise<MediSession> {
  const res = await fetch("/api/session", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, ...patch }),
  });
  if (!res.ok) throw new Error(`Session update failed: ${res.status}`);
  return (await res.json()) as MediSession;
}

/** Build the full mobile URL for a given session ID. */
export function mobileUrl(sessionId: string): string {
  const base =
    typeof window !== "undefined"
      ? window.location.origin
      : "https://MediEase.vercel.app";
  return `${base}/mobile?session=${sessionId}`;
}

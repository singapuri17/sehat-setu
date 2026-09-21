/**
 * GET  /api/session?id=XXXX  — fetch a session by ID
 * POST /api/session           — create a new session
 * PATCH /api/session          — update session data / status
 *
 * Storage: in-memory Map (sufficient for demo; replace with DB for prod).
 * Sessions expire after 2 hours of inactivity.
 */

import { createAPIFileRoute } from "@tanstack/react-start/api";
import { json } from "@tanstack/react-start";

// ─── Types ─────────────────────────────────────────────────────────────────

type SessionChannel = "kiosk" | "mobile";
type SessionStatus = "started" | "in-progress" | "complete";

interface MediSession {
  id: string;
  channel: SessionChannel;
  status: SessionStatus;
  lang: string;
  createdAt: number;
  updatedAt: number;
  data: Record<string, unknown>;
}

// ─── In-memory store ────────────────────────────────────────────────────────

const SESSIONS = new Map<string, MediSession>();
const TTL_MS = 2 * 60 * 60 * 1000; // 2 hours

function randomId(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let id = "";
  // Use Math.random as fallback (server has no crypto.getRandomValues issue)
  for (let i = 0; i < 8; i++) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }
  return id;
}

function pruneExpired(): void {
  const now = Date.now();
  for (const [id, session] of SESSIONS) {
    if (now - session.updatedAt > TTL_MS) SESSIONS.delete(id);
  }
}

// ─── Route ──────────────────────────────────────────────────────────────────

export const APIRoute = createAPIFileRoute("/api/session")({
  // ── GET — fetch session by id ──────────────────────────────────────────
  GET: async ({ request }) => {
    pruneExpired();
    const url = new URL(request.url);
    const id = url.searchParams.get("id")?.toUpperCase().trim();

    if (!id) {
      return json({ error: "Missing id parameter" }, { status: 400 });
    }

    const session = SESSIONS.get(id);
    if (!session) {
      return json({ error: "Session not found or expired" }, { status: 404 });
    }

    return json(session, { status: 200 });
  },

  // ── POST — create new session ──────────────────────────────────────────
  POST: async ({ request }) => {
    pruneExpired();
    const body = (await request.json()) as {
      channel?: SessionChannel;
      lang?: string;
    };

    // Ensure uniqueness
    let id = randomId();
    while (SESSIONS.has(id)) id = randomId();

    const now = Date.now();
    const session: MediSession = {
      id,
      channel: body.channel ?? "kiosk",
      status: "started",
      lang: body.lang ?? "en",
      createdAt: now,
      updatedAt: now,
      data: {},
    };

    SESSIONS.set(id, session);
    return json(session, { status: 201 });
  },

  // ── PATCH — update session ─────────────────────────────────────────────
  PATCH: async ({ request }) => {
    pruneExpired();
    const body = (await request.json()) as {
      id?: string;
      status?: SessionStatus;
      lang?: string;
      data?: Record<string, unknown>;
    };

    const id = body.id?.toUpperCase().trim();
    if (!id) return json({ error: "Missing id" }, { status: 400 });

    const session = SESSIONS.get(id);
    if (!session) {
      return json({ error: "Session not found or expired" }, { status: 404 });
    }

    if (body.status) session.status = body.status;
    if (body.lang) session.lang = body.lang;
    if (body.data) session.data = { ...session.data, ...body.data };
    session.updatedAt = Date.now();

    SESSIONS.set(id, session);
    return json(session, { status: 200 });
  },
});

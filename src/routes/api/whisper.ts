/**
 * POST /api/whisper
 *
 * Server-side proxy for OpenAI Whisper transcription.
 * Keeps OPENAI_API_KEY off the client.
 *
 * Required environment variable:
 *   OPENAI_API_KEY   – OpenAI secret key
 *
 * Client sends multipart/form-data with a "file" field (audio blob).
 * This proxy forwards it to the OpenAI transcriptions endpoint and
 * returns { text: "..." }.
 */

import { createAPIFileRoute } from "@tanstack/react-start/api";
import { json } from "@tanstack/react-start";

const OPENAI_URL = "https://api.openai.com/v1/audio/transcriptions";

export const APIRoute = createAPIFileRoute("/api/whisper")({
  POST: async ({ request }) => {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return json(
        { error: "Whisper API not configured (missing OPENAI_API_KEY)" },
        { status: 503 },
      );
    }

    // Forward the multipart form data as-is, just swap in our auth header
    const formData = await request.formData();

    // Ensure model is set
    if (!formData.has("model")) {
      formData.set("model", "whisper-1");
    }

    const upstream = await fetch(OPENAI_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        // Do NOT set Content-Type — fetch sets it automatically with boundary
      },
      body: formData,
    });

    const data = await upstream.json();
    return json(data, { status: upstream.status });
  },
});

/**
 * POST /api/bhashini
 *
 * Server-side proxy for Bhashini Dhruva ASR pipeline.
 * Keeps BHASHINI_API_KEY and BHASHINI_PIPELINE_ID off the client.
 *
 * Required environment variables:
 *   BHASHINI_API_KEY       – Authorization header value from Dhruva dashboard
 *   BHASHINI_PIPELINE_ID   – Pipeline ID for ASR (get from pipeline config API)
 *
 * The client sends the same payload shape as the Dhruva pipeline API but
 * leaves serviceId blank — this proxy fills it in from the env.
 */

import { createAPIFileRoute } from "@tanstack/react-start/api";
import { json } from "@tanstack/react-start";

const DHRUVA_URL =
  "https://dhruva-api.bhashini.gov.in/services/inference/pipeline";

export const APIRoute = createAPIFileRoute("/api/bhashini")({
  POST: async ({ request }) => {
    const apiKey = process.env.BHASHINI_API_KEY;
    const pipelineId = process.env.BHASHINI_PIPELINE_ID;

    // If not configured, return an error so the client falls back gracefully
    if (!apiKey || !pipelineId) {
      return json(
        { error: "Bhashini API not configured (missing env vars)" },
        { status: 503 },
      );
    }

    const body = await request.json() as {
      pipelineTasks: Array<{
        taskType: string;
        config: { serviceId: string; language: { sourceLanguage: string } };
      }>;
      inputData: unknown;
    };

    // Inject pipeline ID and service ID from server env
    body.pipelineTasks[0]!.config.serviceId = pipelineId;

    const upstream = await fetch(DHRUVA_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: apiKey,
      },
      body: JSON.stringify(body),
    });

    const data = await upstream.json();
    return json(data, { status: upstream.status });
  },
});

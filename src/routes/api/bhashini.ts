/**
 * POST /api/bhashini
 *
 * Server-side proxy for Bhashini Dhruva ASR.
 * Step 1: Calls the pipeline config API to get the ASR service ID for the language.
 * Step 2: Calls the inference API with the audio and resolved service ID.
 *
 * Required environment variables (set in Vercel Dashboard):
 *   BHASHINI_USER_ID    – User ID from bhashini.ai dashboard
 *   BHASHINI_API_KEY    – Inference key from bhashini.ai dashboard
 *   BHASHINI_UDYAT_KEY  – Udyat key from bhashini.ai dashboard
 *
 * Client sends:
 *   { langCode: "hi" | "gu", audioBase64: "..." }
 */

import { createAPIFileRoute } from "@tanstack/react-start/api";
import { json } from "@tanstack/react-start";

const CONFIG_URL = "https://meity-auth.ulcacontrib.org/ulca/apis/v0/model/getModelsPipeline";
const INFERENCE_URL = "https://dhruva-api.bhashini.gov.in/services/inference/pipeline";

export const APIRoute = createAPIFileRoute("/api/bhashini")({
  POST: async ({ request }) => {
    const userId = process.env.BHASHINI_USER_ID;
    const apiKey = process.env.BHASHINI_API_KEY;
    const udyatKey = process.env.BHASHINI_UDYAT_KEY;

    if (!userId || !apiKey) {
      return json({ error: "Bhashini API not configured" }, { status: 503 });
    }

    const body = await request.json() as { langCode: string; audioBase64: string };
    const { langCode, audioBase64 } = body;

    if (!langCode || !audioBase64) {
      return json({ error: "Missing langCode or audioBase64" }, { status: 400 });
    }

    try {
      // ── Step 1: Discover ASR pipeline for the requested language ──────────
      const configRes = await fetch(CONFIG_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          userID: userId,
          ulcaApiKey: udyatKey ?? apiKey,
        },
        body: JSON.stringify({
          pipelineTasks: [{ taskType: "asr", config: { language: { sourceLanguage: langCode } } }],
          pipelineRequestConfig: { pipelineId: "64392f96daac500b55c543cd" },
        }),
      });

      if (!configRes.ok) {
        throw new Error(`Config API failed: ${configRes.status}`);
      }

      const configData = await configRes.json() as {
        pipelineResponseConfig?: Array<{
          taskType: string;
          config?: Array<{ serviceId: string }>;
        }>;
        pipelineInferenceAPIEndPoint?: {
          callbackUrl: string;
          inferenceApiKey: { name: string; value: string };
        };
      };

      const serviceId =
        configData.pipelineResponseConfig?.[0]?.config?.[0]?.serviceId;
      const callbackUrl =
        configData.pipelineInferenceAPIEndPoint?.callbackUrl ?? INFERENCE_URL;
      const inferenceKeyName =
        configData.pipelineInferenceAPIEndPoint?.inferenceApiKey?.name ?? "Authorization";
      const inferenceKeyValue =
        configData.pipelineInferenceAPIEndPoint?.inferenceApiKey?.value ?? apiKey;

      if (!serviceId) {
        throw new Error("Could not resolve ASR service ID from config API");
      }

      // ── Step 2: Call the inference pipeline with the audio ─────────────────
      // The browser records audio/webm (opus). Bhashini accepts "wav", "mp3",
      // "flac", or "webm". Sending "webm" avoids any server-side decode failure.
      const inferencePayload = {
        pipelineTasks: [
          {
            taskType: "asr",
            config: {
              serviceId,
              language: { sourceLanguage: langCode },
              audioFormat: "webm",
              samplingRate: 16000,
              postProcessors: null,
            },
          },
        ],
        inputData: {
          audio: [{ audioContent: audioBase64 }],
        },
      };

      const inferenceRes = await fetch(callbackUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          [inferenceKeyName]: inferenceKeyValue,
        },
        body: JSON.stringify(inferencePayload),
      });

      if (!inferenceRes.ok) {
        throw new Error(`Inference API failed: ${inferenceRes.status}`);
      }

      const inferenceData = await inferenceRes.json();
      return json(inferenceData, { status: 200 });

    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      console.error("[bhashini proxy]", message);
      return json({ error: message }, { status: 500 });
    }
  },
});

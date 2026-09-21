/**
 * POST /api/bhashini-tts
 *
 * Server-side proxy for Bhashini Dhruva TTS (Text-to-Speech).
 * Step 1: Calls the ULCA pipeline config API to get the TTS service ID.
 * Step 2: Calls the Dhruva inference API with the text and resolved service ID.
 * Returns: { audioBase64: "..." } — a base64-encoded WAV/mp3 audio clip.
 *
 * Required environment variables (same as /api/bhashini):
 *   BHASHINI_USER_ID    – User ID from bhashini.ai dashboard
 *   BHASHINI_API_KEY    – Inference key from bhashini.ai dashboard
 *   BHASHINI_UDYAT_KEY  – Udyat key from bhashini.ai dashboard
 *
 * Client sends:
 *   { langCode: "hi" | "gu", text: "..." }
 */

import { createAPIFileRoute } from "@tanstack/react-start/api";
import { json } from "@tanstack/react-start";

const CONFIG_URL =
  "https://meity-auth.ulcacontrib.org/ulca/apis/v0/model/getModelsPipeline";
const INFERENCE_URL =
  "https://dhruva-api.bhashini.gov.in/services/inference/pipeline";

export const APIRoute = createAPIFileRoute("/api/bhashini-tts")({
  POST: async ({ request }) => {
    const userId = process.env.BHASHINI_USER_ID;
    const apiKey = process.env.BHASHINI_API_KEY;
    const udyatKey = process.env.BHASHINI_UDYAT_KEY;

    if (!userId || !apiKey) {
      return json({ error: "Bhashini TTS not configured" }, { status: 503 });
    }

    const body = (await request.json()) as { langCode: string; text: string };
    const { langCode, text } = body;

    if (!langCode || !text) {
      return json({ error: "Missing langCode or text" }, { status: 400 });
    }

    try {
      // ── Step 1: Discover TTS pipeline for the requested language ──────────
      const configRes = await fetch(CONFIG_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          userID: userId,
          ulcaApiKey: udyatKey ?? apiKey,
        },
        body: JSON.stringify({
          pipelineTasks: [
            {
              taskType: "tts",
              config: {
                language: { sourceLanguage: langCode },
              },
            },
          ],
          pipelineRequestConfig: { pipelineId: "64392f96daac500b55c543cd" },
        }),
      });

      if (!configRes.ok) {
        throw new Error(`Config API failed: ${configRes.status}`);
      }

      const configData = (await configRes.json()) as {
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
        configData.pipelineInferenceAPIEndPoint?.inferenceApiKey?.name ??
        "Authorization";
      const inferenceKeyValue =
        configData.pipelineInferenceAPIEndPoint?.inferenceApiKey?.value ??
        apiKey;

      if (!serviceId) {
        throw new Error("Could not resolve TTS service ID from config API");
      }

      // ── Step 2: Call the inference pipeline with the text ─────────────────
      const inferencePayload = {
        pipelineTasks: [
          {
            taskType: "tts",
            config: {
              serviceId,
              language: { sourceLanguage: langCode },
              gender: "female",
              samplingRate: 8000,
            },
          },
        ],
        inputData: {
          input: [{ source: text }],
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
        throw new Error(`TTS inference API failed: ${inferenceRes.status}`);
      }

      const inferenceData = (await inferenceRes.json()) as {
        pipelineResponse?: Array<{
          audio?: Array<{ audioContent?: string }>;
        }>;
      };

      const audioBase64 =
        inferenceData.pipelineResponse?.[0]?.audio?.[0]?.audioContent ?? "";

      if (!audioBase64) {
        throw new Error("Bhashini TTS returned empty audio");
      }

      return json({ audioBase64 }, { status: 200 });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      console.error("[bhashini-tts proxy]", message);
      return json({ error: message }, { status: 500 });
    }
  },
});

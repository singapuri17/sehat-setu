/**
 * POST /api/notify
 *
 * Simulated SMS / email notification dispatcher.
 *
 * In production this would call:
 *   SMS  â†’ Twilio / MSG91 / Kaleyra (popular in India)
 *   Email â†’ SendGrid / Resend / AWS SES
 *
 * For the demo, this:
 *  1. Validates the payload
 *  2. Logs the notification to the server console
 *  3. Returns a simulated success/failure response
 *
 * Body: {
 *   appointmentId: string
 *   channel: "sms" | "email" | "both"
 *   message: string
 *   phone?: string       — required for sms
 *   email?: string       — required for email
 *   scheduledFor?: string — ISO datetime; if omitted, sends immediately
 * }
 */

import { createAPIFileRoute } from "@tanstack/react-start/api";
import { json } from "@tanstack/react-start";

interface NotifyBody {
  appointmentId: string;
  channel: "sms" | "email" | "both";
  message: string;
  phone?: string;
  email?: string;
  scheduledFor?: string;
}

export const APIRoute = createAPIFileRoute("/api/notify")({
  POST: async ({ request }) => {
    const body = (await request.json()) as NotifyBody;

    if (!body.appointmentId || !body.channel || !body.message) {
      return json({ success: false, message: "Missing required fields" }, { status: 400 });
    }

    const now = new Date().toISOString();
    const isScheduled = body.scheduledFor && new Date(body.scheduledFor) > new Date();

    const results: { channel: string; status: string; detail: string }[] = [];

    if (body.channel === "sms" || body.channel === "both") {
      // Simulate SMS dispatch
      console.log(`[Sehat Setu Notify] SMS â†’ ${body.phone ?? "on-file"} | Apt: ${body.appointmentId}`);
      console.log(`  Message: ${body.message}`);
      results.push({
        channel: "sms",
        status: isScheduled ? "scheduled" : "sent",
        detail: isScheduled
          ? `SMS scheduled for ${body.scheduledFor}`
          : `SMS sent at ${now}`,
      });
    }

    if (body.channel === "email" || body.channel === "both") {
      // Simulate email dispatch
      console.log(`[Sehat Setu Notify] Email â†’ ${body.email ?? "on-file"} | Apt: ${body.appointmentId}`);
      console.log(`  Message: ${body.message}`);
      results.push({
        channel: "email",
        status: isScheduled ? "scheduled" : "sent",
        detail: isScheduled
          ? `Email scheduled for ${body.scheduledFor}`
          : `Email sent at ${now}`,
      });
    }

    return json(
      {
        success: true,
        message: isScheduled
          ? `Notification scheduled for ${body.scheduledFor}`
          : `Notification dispatched at ${now}`,
        results,
        // In a real system this would return the vendor message ID
        mockId: `NOTIF-${Date.now()}`,
      },
      { status: 200 },
    );
  },
});

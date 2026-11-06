/**
 * GET  /api/appointment              — list all appointments
 * GET  /api/appointment?phone=XXXX   — appointments by phone number
 * GET  /api/appointment?id=APT-XXXX  — single appointment by ID
 * POST /api/appointment              — create appointment
 * PATCH /api/appointment             — update status / add follow-up
 */

import { createAPIFileRoute } from "@tanstack/react-start/api";
import { json } from "@tanstack/react-start";

// â”€â”€â”€ Types â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

type AppointmentStatus =
  | "scheduled" | "waiting" | "in-progress"
  | "completed" | "cancelled" | "no-show";
type ReminderChannel = "sms" | "email" | "both";

interface Reminder {
  id: string;
  appointmentId: string;
  channel: ReminderChannel;
  scheduledFor: string;
  sentAt?: string;
  status: "pending" | "sent" | "failed";
  message: string;
}

interface FollowUp {
  id: string;
  appointmentId: string;
  scheduledDate: string;
  reason: string;
  doctorNote: string;
  status: "scheduled" | "completed" | "missed";
  reminders: Reminder[];
}

interface Appointment {
  id: string;
  token: string;
  patientName: string;
  patientAge: string;
  patientGender: string;
  phone: string;
  email: string;
  complaint: string;
  department: string;
  doctor: string;
  date: string;
  timeSlot: string;
  status: AppointmentStatus;
  queuePosition: number;
  estimatedWait: number;
  sessionId?: string;
  createdAt: string;
  updatedAt: string;
  reminders: Reminder[];
  followUps: FollowUp[];
  notes: string;
}

// â”€â”€â”€ In-memory store with seeded demo data â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const APPOINTMENTS = new Map<string, Appointment>();
let tokenCounter = 105;
let aptCounter   = 104;

function randomId(prefix: string): string {
  return `${prefix}-${String(++aptCounter).padStart(4, "0")}`;
}
function nextToken(): string {
  return `A-${tokenCounter++}`;
}

// Seed demo data on first request
function seed() {
  if (APPOINTMENTS.size > 0) return;
  const today     = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  const tomorrow  = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
  const in5Days   = new Date(Date.now() + 5 * 86400000).toISOString().slice(0, 10);

  const priya: Appointment = {
    id: "APT-0100", token: "A-101",
    patientName: "Priya Mehta", patientAge: "29", patientGender: "Female",
    phone: "9900112233", email: "priya.mehta@example.com",
    complaint: "Fever", department: "OPD — General", doctor: "Dr. M. Rao",
    date: today, timeSlot: "09:00 AM", status: "completed",
    queuePosition: 0, estimatedWait: 0,
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    updatedAt: new Date(Date.now() - 1800000).toISOString(),
    notes: "Prescribed paracetamol. Follow-up in 5 days if fever persists.",
    reminders: [{
      id: "REM-003", appointmentId: "APT-0100", channel: "sms",
      scheduledFor: new Date(Date.now() - 86400000).toISOString(),
      sentAt: new Date(Date.now() - 86400000).toISOString(), status: "sent",
      message: "Reminder: Your appointment tomorrow at 09:00 AM with Dr. M. Rao at City Hospital OPD.",
    }],
    followUps: [{
      id: "FU-001", appointmentId: "APT-0100", scheduledDate: in5Days,
      reason: "Review fever — check if resolved", status: "scheduled",
      doctorNote: "Prescribed paracetamol 500mg TDS for 3 days. Return if fever persists beyond 5 days.",
      reminders: [{
        id: "REM-FU-001", appointmentId: "APT-0100", channel: "both",
        scheduledFor: new Date(Date.now() + 4 * 86400000).toISOString(),
        status: "pending",
        message: "Follow-up reminder: Your follow-up visit with Dr. M. Rao is tomorrow. Please visit City Hospital OPD.",
      }],
    }],
  };

  const suresh: Appointment = {
    id: "APT-0099", token: "A-100",
    patientName: "Suresh Kumar", patientAge: "71", patientGender: "Male",
    phone: "9811223344", email: "suresh.kumar@example.com",
    complaint: "Chest pain", department: "OPD — Cardiology", doctor: "Dr. M. Rao",
    date: yesterday, timeSlot: "08:30 AM", status: "completed",
    queuePosition: 0, estimatedWait: 0,
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
    notes: "ECG normal. Referred to Cardiology for echo.",
    reminders: [],
    followUps: [{
      id: "FU-002", appointmentId: "APT-0099", scheduledDate: tomorrow,
      reason: "Cardiology echo results review", status: "scheduled",
      doctorNote: "Refer for 2D echo. Review results in OPD next week.",
      reminders: [{
        id: "REM-FU-002", appointmentId: "APT-0099", channel: "sms",
        scheduledFor: new Date(Date.now() + 86400000 - 3600000).toISOString(),
        status: "pending",
        message: "Follow-up reminder: Please visit City Hospital OPD tomorrow for your echo results review.",
      }],
    }],
  };

  const rahul: Appointment = {
    id: "APT-0101", token: "A-102",
    patientName: "Rahul Patel", patientAge: "52", patientGender: "Male",
    phone: "9876543210", email: "rahul.patel@example.com",
    complaint: "Abdominal pain", department: "OPD — General", doctor: "Dr. M. Rao",
    date: today, timeSlot: "09:30 AM", status: "waiting",
    queuePosition: 2, estimatedWait: 14,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    updatedAt: new Date().toISOString(),
    notes: "Pre-consultation completed via Sehat Setu. Hemoglobin below reference range.",
    reminders: [{
      id: "REM-001", appointmentId: "APT-0101", channel: "sms",
      scheduledFor: new Date(Date.now() - 7200000).toISOString(),
      sentAt: new Date(Date.now() - 7200000).toISOString(), status: "sent",
      message: "Reminder: Your appointment with Dr. M. Rao is today at 09:30 AM at City Hospital OPD.",
    }],
    followUps: [],
  };

  const meena: Appointment = {
    id: "APT-0102", token: "A-103",
    patientName: "Meena Shah", patientAge: "64", patientGender: "Female",
    phone: "9845012345", email: "meena.shah@example.com",
    complaint: "Cough", department: "OPD — General", doctor: "Dr. M. Rao",
    date: today, timeSlot: "10:00 AM", status: "waiting",
    queuePosition: 3, estimatedWait: 22,
    createdAt: new Date(Date.now() - 2400000).toISOString(),
    updatedAt: new Date().toISOString(), notes: "", reminders: [], followUps: [],
  };

  const arjun: Appointment = {
    id: "APT-0103", token: "A-104",
    patientName: "Arjun Desai", patientAge: "38", patientGender: "Male",
    phone: "9123456789", email: "arjun.desai@example.com",
    complaint: "Headache", department: "OPD — General", doctor: "Dr. M. Rao",
    date: today, timeSlot: "10:30 AM", status: "scheduled",
    queuePosition: 4, estimatedWait: 35,
    createdAt: new Date(Date.now() - 1800000).toISOString(),
    updatedAt: new Date().toISOString(), notes: "", reminders: [], followUps: [],
  };

  [priya, suresh, rahul, meena, arjun].forEach((a) => APPOINTMENTS.set(a.id, a));
}

// â”€â”€â”€ Route â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export const APIRoute = createAPIFileRoute("/api/appointment")({
  GET: async ({ request }) => {
    seed();
    const url    = new URL(request.url);
    const id     = url.searchParams.get("id");
    const phone  = url.searchParams.get("phone");

    if (id) {
      const apt = APPOINTMENTS.get(id);
      return apt
        ? json(apt, { status: 200 })
        : json({ error: "Not found" }, { status: 404 });
    }

    const all = Array.from(APPOINTMENTS.values())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    if (phone) {
      const filtered = all.filter((a) => a.phone === phone);
      return json(filtered, { status: 200 });
    }

    return json(all, { status: 200 });
  },

  POST: async ({ request }) => {
    seed();
    const body = (await request.json()) as Omit<
      Appointment, "id" | "token" | "createdAt" | "updatedAt" | "reminders" | "followUps"
    >;
    const now   = new Date().toISOString();
    const today = now.slice(0, 10);

    // Assign queue position = count of today's non-completed appointments + 1
    const todayQueue = Array.from(APPOINTMENTS.values())
      .filter((a) => a.date === today && !["completed", "cancelled", "no-show"].includes(a.status));
    const queuePos = todayQueue.length + 1;
    const estWait  = queuePos * 10; // 10 min per patient (simple estimate)

    const apt: Appointment = {
      ...body,
      id:           randomId("APT"),
      token:        nextToken(),
      status:       "scheduled",
      queuePosition: queuePos,
      estimatedWait: estWait,
      createdAt:    now,
      updatedAt:    now,
      reminders:    [],
      followUps:    [],
      notes:        body.notes ?? "",
    };

    APPOINTMENTS.set(apt.id, apt);

    // Auto-create a day-before reminder
    const dayBefore = new Date(new Date(apt.date + "T00:00:00").getTime() - 86400000).toISOString();
    const reminder: Reminder = {
      id: `REM-${apt.id}`,
      appointmentId: apt.id,
      channel: "sms",
      scheduledFor: dayBefore,
      status: "pending",
      message: `Reminder: Your appointment with ${apt.doctor} is tomorrow at ${apt.timeSlot} at City Hospital OPD. Please bring your health records.`,
    };
    apt.reminders.push(reminder);
    APPOINTMENTS.set(apt.id, apt);

    return json(apt, { status: 201 });
  },

  PATCH: async ({ request }) => {
    seed();
    const body = (await request.json()) as {
      id: string;
      status?: AppointmentStatus;
      queuePosition?: number;
      estimatedWait?: number;
      notes?: string;
      addFollowUp?: {
        scheduledDate: string;
        reason: string;
        doctorNote: string;
        channel: ReminderChannel;
      };
    };

    const apt = APPOINTMENTS.get(body.id);
    if (!apt) return json({ error: "Not found" }, { status: 404 });

    if (body.status)         apt.status         = body.status;
    if (body.queuePosition !== undefined) apt.queuePosition = body.queuePosition;
    if (body.estimatedWait  !== undefined) apt.estimatedWait = body.estimatedWait;
    if (body.notes          !== undefined) apt.notes         = body.notes;
    apt.updatedAt = new Date().toISOString();

    if (body.addFollowUp) {
      const { scheduledDate, reason, doctorNote, channel } = body.addFollowUp;
      const fuId  = `FU-${apt.id}-${Date.now()}`;
      const remId = `REM-${fuId}`;
      const dayBeforeFollowUp = new Date(
        new Date(scheduledDate + "T08:00:00").getTime() - 86400000
      ).toISOString();

      const followUpReminder: Reminder = {
        id: remId,
        appointmentId: apt.id,
        channel,
        scheduledFor: dayBeforeFollowUp,
        status: "pending",
        message: `Follow-up reminder: Your follow-up visit with ${apt.doctor} is tomorrow (${scheduledDate}). Please visit City Hospital OPD.`,
      };
      const followUp: FollowUp = {
        id: fuId,
        appointmentId: apt.id,
        scheduledDate,
        reason,
        doctorNote,
        status: "scheduled",
        reminders: [followUpReminder],
      };
      apt.followUps.push(followUp);
      APPOINTMENTS.set(apt.id, apt);
      return json({ followUp, reminder: followUpReminder }, { status: 200 });
    }

    APPOINTMENTS.set(apt.id, apt);
    return json(apt, { status: 200 });
  },
});

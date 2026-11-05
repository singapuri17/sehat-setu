/**
 * appointmentService.ts
 *
 * Data models, demo data, and client-side helpers for the appointment,
 * queue, reminder, and follow-up system.
 *
 * In a production system these would be backed by a database (PostgreSQL/Firestore).
 * For the demo, /api/appointment uses an in-memory store.
 */

// â”€â”€â”€ Types â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export type AppointmentStatus =
  | "scheduled"   // Booked, not yet attended
  | "waiting"     // Patient has checked in, in queue
  | "in-progress" // Currently with doctor
  | "completed"   // Consultation done
  | "cancelled"   // Cancelled by patient or staff
  | "no-show";    // Did not arrive

export type ReminderChannel = "sms" | "email" | "both";
export type ReminderStatus  = "pending" | "sent" | "failed";

export interface Reminder {
  id: string;
  appointmentId: string;
  channel: ReminderChannel;
  scheduledFor: string;   // ISO datetime â€” when to send
  sentAt?: string;        // ISO datetime â€” when actually sent
  status: ReminderStatus;
  message: string;
}

export interface FollowUp {
  id: string;
  appointmentId: string;
  scheduledDate: string;  // ISO date "YYYY-MM-DD"
  reason: string;
  doctorNote: string;
  status: "scheduled" | "completed" | "missed";
  reminders: Reminder[];
}

export interface Appointment {
  id: string;             // e.g. "APT-0042"
  token: string;          // Queue token e.g. "A-105"
  patientName: string;
  patientAge: string;
  patientGender: string;
  phone: string;          // Mobile number for SMS
  email: string;          // Email for email reminders
  complaint: string;
  department: string;     // e.g. "OPD â€” General"
  doctor: string;         // e.g. "Dr. M. Rao"
  date: string;           // ISO date "YYYY-MM-DD"
  timeSlot: string;       // e.g. "10:30 AM"
  status: AppointmentStatus;
  queuePosition: number;  // Live position in queue (1 = next)
  estimatedWait: number;  // Minutes
  sessionId?: string;     // Linked kiosk/mobile session
  createdAt: string;
  updatedAt: string;
  reminders: Reminder[];
  followUps: FollowUp[];
  notes: string;
}

// â”€â”€â”€ Demo data â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const TODAY = new Date().toISOString().slice(0, 10);
const TOMORROW = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
const YESTERDAY = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

export const demoAppointments: Appointment[] = [
  {
    id: "APT-0101",
    token: "A-102",
    patientName: "Rahul Patel",
    patientAge: "52",
    patientGender: "Male",
    phone: "9876543210",
    email: "rahul.patel@example.com",
    complaint: "Abdominal pain",
    department: "OPD â€” General",
    doctor: "Dr. M. Rao",
    date: TODAY,
    timeSlot: "09:30 AM",
    status: "waiting",
    queuePosition: 2,
    estimatedWait: 14,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    updatedAt: new Date().toISOString(),
    notes: "Pre-consultation completed via MediEase. Hemoglobin below reference range.",
    reminders: [
      {
        id: "REM-001",
        appointmentId: "APT-0101",
        channel: "sms",
        scheduledFor: new Date(Date.now() - 7200000).toISOString(),
        sentAt: new Date(Date.now() - 7200000).toISOString(),
        status: "sent",
        message: "Reminder: Your appointment with Dr. M. Rao is today at 09:30 AM at City Hospital OPD.",
      },
    ],
    followUps: [],
  },
  {
    id: "APT-0102",
    token: "A-103",
    patientName: "Meena Shah",
    patientAge: "64",
    patientGender: "Female",
    phone: "9845012345",
    email: "meena.shah@example.com",
    complaint: "Cough",
    department: "OPD â€” General",
    doctor: "Dr. M. Rao",
    date: TODAY,
    timeSlot: "10:00 AM",
    status: "waiting",
    queuePosition: 3,
    estimatedWait: 22,
    createdAt: new Date(Date.now() - 2400000).toISOString(),
    updatedAt: new Date().toISOString(),
    notes: "",
    reminders: [
      {
        id: "REM-002",
        appointmentId: "APT-0102",
        channel: "both",
        scheduledFor: new Date(Date.now() - 3600000).toISOString(),
        sentAt: new Date(Date.now() - 3600000).toISOString(),
        status: "sent",
        message: "Reminder: Your appointment with Dr. M. Rao is today at 10:00 AM.",
      },
    ],
    followUps: [],
  },
  {
    id: "APT-0103",
    token: "A-104",
    patientName: "Arjun Desai",
    patientAge: "38",
    patientGender: "Male",
    phone: "9123456789",
    email: "arjun.desai@example.com",
    complaint: "Headache",
    department: "OPD â€” General",
    doctor: "Dr. M. Rao",
    date: TODAY,
    timeSlot: "10:30 AM",
    status: "scheduled",
    queuePosition: 4,
    estimatedWait: 35,
    createdAt: new Date(Date.now() - 1800000).toISOString(),
    updatedAt: new Date().toISOString(),
    notes: "",
    reminders: [],
    followUps: [],
  },
  {
    id: "APT-0100",
    token: "A-101",
    patientName: "Priya Mehta",
    patientAge: "29",
    patientGender: "Female",
    phone: "9900112233",
    email: "priya.mehta@example.com",
    complaint: "Fever",
    department: "OPD â€” General",
    doctor: "Dr. M. Rao",
    date: TODAY,
    timeSlot: "09:00 AM",
    status: "completed",
    queuePosition: 0,
    estimatedWait: 0,
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    updatedAt: new Date(Date.now() - 1800000).toISOString(),
    notes: "Prescribed paracetamol. Follow-up in 5 days if fever persists.",
    reminders: [
      {
        id: "REM-003",
        appointmentId: "APT-0100",
        channel: "sms",
        scheduledFor: new Date(Date.now() - 86400000).toISOString(),
        sentAt: new Date(Date.now() - 86400000).toISOString(),
        status: "sent",
        message: "Reminder: Your appointment tomorrow at 09:00 AM with Dr. M. Rao.",
      },
    ],
    followUps: [
      {
        id: "FU-001",
        appointmentId: "APT-0100",
        scheduledDate: new Date(Date.now() + 5 * 86400000).toISOString().slice(0, 10),
        reason: "Review fever â€” check if resolved",
        doctorNote: "Prescribed paracetamol 500mg TDS for 3 days. Return if fever persists beyond 5 days.",
        status: "scheduled",
        reminders: [
          {
            id: "REM-FU-001",
            appointmentId: "APT-0100",
            channel: "both",
            scheduledFor: new Date(Date.now() + 4 * 86400000).toISOString(),
            status: "pending",
            message: "Follow-up reminder: Your follow-up visit with Dr. M. Rao is tomorrow. Please visit City Hospital OPD.",
          },
        ],
      },
    ],
  },
  {
    id: "APT-0099",
    token: "A-100",
    patientName: "Suresh Kumar",
    patientAge: "71",
    patientGender: "Male",
    phone: "9811223344",
    email: "suresh.kumar@example.com",
    complaint: "Chest pain",
    department: "OPD â€” Cardiology",
    doctor: "Dr. M. Rao",
    date: YESTERDAY,
    timeSlot: "08:30 AM",
    status: "completed",
    queuePosition: 0,
    estimatedWait: 0,
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
    notes: "ECG normal. Referred to Cardiology for echo.",
    reminders: [],
    followUps: [
      {
        id: "FU-002",
        appointmentId: "APT-0099",
        scheduledDate: TOMORROW,
        reason: "Cardiology echo results review",
        doctorNote: "Refer for 2D echo. Review results in OPD next week.",
        status: "scheduled",
        reminders: [
          {
            id: "REM-FU-002",
            appointmentId: "APT-0099",
            channel: "sms",
            scheduledFor: new Date(Date.now() + 86400000 - 3600000).toISOString(),
            status: "pending",
            message: "Follow-up reminder: Please visit City Hospital OPD tomorrow for your echo results review.",
          },
        ],
      },
    ],
  },
];

// â”€â”€â”€ Client helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

/** Get all appointments from the server. Falls back to local store in dev. */
export async function getAppointments(): Promise<Appointment[]> {
  try {
    const res = await fetch("/api/appointment");
    if (res.ok) return (await res.json()) as Appointment[];
    return [..._localStore];
  } catch {
    return [..._localStore];
  }
}

/** Get a single appointment by ID or phone number. */
export async function getAppointmentByPhone(phone: string): Promise<Appointment[]> {
  try {
    const res = await fetch(`/api/appointment?phone=${encodeURIComponent(phone)}`);
    if (res.ok) {
      const data = (await res.json()) as Appointment[];
      if (data.length > 0) return data;
    }
  } catch { /* noop */ }
  // Fallback: search local store (includes demo data + newly created appointments)
  return _localStore.filter((a) => a.phone === phone);
}

// â”€â”€â”€ Client-side fallback store (used in dev when API routes return 404) â”€â”€â”€â”€â”€

let _localCounter = 200;
const _localStore: Appointment[] = [...demoAppointments];

function makeLocalAppointment(
  data: Omit<Appointment, "id" | "token" | "createdAt" | "updatedAt" | "reminders" | "followUps">,
): Appointment {
  const id    = `APT-LOCAL-${++_localCounter}`;
  const token = `A-${_localCounter}`;
  const today = data.date ?? new Date().toISOString().slice(0, 10);
  const todayQ = _localStore.filter(
    (a) => a.date === today && !["completed","cancelled","no-show"].includes(a.status)
  );
  const queuePos = todayQ.length + 1;
  const now = new Date().toISOString();
  const apt: Appointment = {
    ...data,
    id, token,
    status: "scheduled",
    queuePosition: queuePos,
    estimatedWait: queuePos * 10,
    createdAt: now,
    updatedAt: now,
    reminders: [],
    followUps: [],
    notes: data.notes ?? "",
  };
  _localStore.push(apt);
  return apt;
}

/** Create a new appointment. Falls back to client-side store in dev (when /api/appointment returns 404). */
export async function createAppointment(
  data: Omit<Appointment, "id" | "token" | "createdAt" | "updatedAt" | "reminders" | "followUps">,
): Promise<Appointment> {
  try {
    const res = await fetch("/api/appointment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) return (await res.json()) as Appointment;
    // API unavailable (e.g. Vite dev mode) â€” use local fallback
    console.warn("[appointmentService] API unavailable, using local fallback");
    return makeLocalAppointment(data);
  } catch {
    console.warn("[appointmentService] Fetch failed, using local fallback");
    return makeLocalAppointment(data);
  }
}

/** Update appointment status, notes, or queue position. Falls back silently in dev. */
export async function updateAppointment(
  id: string,
  patch: Partial<Pick<Appointment, "status" | "queuePosition" | "estimatedWait" | "notes">>,
): Promise<Appointment> {
  try {
    const res = await fetch("/api/appointment", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...patch }),
    });
    if (res.ok) return (await res.json()) as Appointment;
  } catch { /* noop */ }
  // Local fallback â€” mutate _localStore
  const idx = _localStore.findIndex((a) => a.id === id);
  if (idx !== -1) {
    _localStore[idx] = { ..._localStore[idx], ...patch, updatedAt: new Date().toISOString() };
    return _localStore[idx]!;
  }
  throw new Error("Appointment not found");
}

/** Dispatch a reminder (SMS / email). Silently succeeds in dev when API is unavailable. */
export async function sendReminder(
  appointmentId: string,
  channel: ReminderChannel,
  message: string,
  scheduledFor?: string,
): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch("/api/notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ appointmentId, channel, message, scheduledFor }),
    });
    if (res.ok) return (await res.json()) as { success: boolean; message: string };
  } catch { /* noop */ }
  // Dev fallback â€” log and pretend it worked
  console.info(`[notify-dev] ${channel.toUpperCase()} â†’ Apt ${appointmentId}: ${message}`);
  return { success: true, message: `[Dev] ${channel} notification simulated` };
}

/** Book a follow-up visit and dispatch reminder. */
export async function bookFollowUp(
  appointmentId: string,
  scheduledDate: string,
  reason: string,
  doctorNote: string,
  channel: ReminderChannel,
): Promise<{ followUp: FollowUp; reminder: Reminder }> {
  try {
    const res = await fetch("/api/appointment", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: appointmentId, addFollowUp: { scheduledDate, reason, doctorNote, channel } }),
    });
    if (res.ok) return (await res.json()) as { followUp: FollowUp; reminder: Reminder };
  } catch { /* noop */ }
  // Dev fallback
  const fuId = `FU-LOCAL-${Date.now()}`;
  const remId = `REM-FU-LOCAL-${Date.now()}`;
  const followUp: FollowUp = {
    id: fuId, appointmentId, scheduledDate, reason, doctorNote,
    status: "scheduled",
    reminders: [{
      id: remId, appointmentId, channel,
      scheduledFor: new Date(new Date(scheduledDate + "T08:00:00").getTime() - 86400000).toISOString(),
      status: "pending",
      message: `Follow-up reminder: Your follow-up is tomorrow (${scheduledDate}).`,
    }],
  };
  const apt = _localStore.find((a) => a.id === appointmentId);
  if (apt) apt.followUps.push(followUp);
  return { followUp, reminder: followUp.reminders[0]! };
}

/** Returns a patient-facing portal URL. */
export function portalUrl(phone: string): string {
  const base = typeof window !== "undefined" ? window.location.origin : "";
  return `${base}/portal?phone=${encodeURIComponent(phone)}`;
}

/** Human-readable wait time string. */
export function formatWait(minutes: number): string {
  if (minutes === 0) return "Now";
  if (minutes < 60) return `~${minutes} min`;
  return `~${Math.floor(minutes / 60)}h ${minutes % 60}min`;
}

/** Status badge colour classes. */
export function statusColor(status: AppointmentStatus): string {
  switch (status) {
    case "scheduled":   return "bg-kiosk-sky/15 text-kiosk-sky border border-kiosk-sky/20";
    case "waiting":     return "bg-kiosk-yellow/20 text-kiosk-navy border border-kiosk-yellow/30";
    case "in-progress": return "bg-kiosk-coral/15 text-kiosk-coral border border-kiosk-coral/20";
    case "completed":   return "bg-kiosk-teal/15 text-kiosk-teal border border-kiosk-teal/20";
    case "cancelled":   return "bg-foreground/10 text-foreground/50 border border-foreground/20";
    case "no-show":     return "bg-kiosk-coral/10 text-kiosk-coral/70 border border-kiosk-coral/15";
  }
}

/**
 * /staff — Hospital Staff Appointment Management Portal
 *
 * For reception / front-desk / nursing staff to:
 *   - View today's appointment schedule
 *   - Book new appointments quickly
 *   - Update appointment status (check-in, call next, complete)
 *   - Send SMS / email reminders
 *   - Book follow-up visits
 *   - Search patients by phone / name / token
 */

import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertTriangle, ArrowRight, BadgeCheck, Bell, Calendar,
  Check, CheckCircle2, ChevronRight, Clock3, HeartPulse,
  LogIn, Mail, Menu, Pencil, Phone, Plus, RefreshCw,
  Search, Settings, ShieldCheck, Stethoscope, Timer,
  UserRound, Users, X, ClipboardList, BarChart3,
} from "lucide-react";
import {
  type Appointment, type ReminderChannel,
  getAppointments, createAppointment, updateAppointment,
  sendReminder, bookFollowUp, formatWait, statusColor,
  type AppointmentStatus,
} from "@/lib/appointmentService";

export const Route = createFileRoute("/staff")({
  head: () => ({
    meta: [
      { title: "MediKiosk — Staff Portal" },
      { name: "description", content: "Hospital staff appointment management — book, track, remind, follow up." },
    ],
  }),
  component: StaffPage,
});

// ─── Demo departments / doctors ───────────────────────────────────────────────

const DEPARTMENTS = [
  "OPD — General", "OPD — Cardiology", "OPD — Orthopaedics",
  "OPD — Gynaecology", "OPD — Paediatrics", "OPD — ENT",
  "OPD — Dermatology", "OPD — Neurology", "OPD — AYUSH",
];

const DOCTORS: Record<string, string[]> = {
  "OPD — General":      ["Dr. M. Rao", "Dr. S. Nair"],
  "OPD — Cardiology":   ["Dr. R. Sharma", "Dr. P. Joshi"],
  "OPD — Orthopaedics": ["Dr. A. Mehta"],
  "OPD — Gynaecology":  ["Dr. K. Desai", "Dr. L. Pillai"],
  "OPD — Paediatrics":  ["Dr. N. Kumar"],
  "OPD — ENT":          ["Dr. H. Singh"],
  "OPD — Dermatology":  ["Dr. V. Reddy"],
  "OPD — Neurology":    ["Dr. B. Iyer"],
  "OPD — AYUSH":        ["Dr. T. Gupta"],
};

const TIME_SLOTS = [
  "08:00 AM", "08:30 AM", "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM",
  "11:00 AM", "11:30 AM", "12:00 PM", "02:00 PM", "02:30 PM", "03:00 PM",
  "03:30 PM", "04:00 PM", "04:30 PM", "05:00 PM",
];

const COMPLAINTS = [
  "Fever", "Abdominal pain", "Headache", "Cough", "Chest pain",
  "Back pain", "Joint pain", "Skin rash", "Eye problem", "Ear problem",
  "Dental pain", "General check-up", "Follow-up visit", "Other",
];

// ─── Nav items ────────────────────────────────────────────────────────────────

type StaffNav = "today" | "book" | "search" | "settings";

const NAV_ITEMS: Array<{ key: StaffNav; label: string; Icon: typeof BarChart3 }> = [
  { key: "today",    label: "Today",        Icon: Calendar    },
  { key: "book",     label: "Book",         Icon: Plus        },
  { key: "search",   label: "Search",       Icon: Search      },
  { key: "settings", label: "Settings",     Icon: Settings    },
];

// ─── Staff auth (demo) ────────────────────────────────────────────────────────

const DEMO_CREDS = { username: "staff@hospital.demo", password: "staff123" };

// ─── Main page component ──────────────────────────────────────────────────────

function StaffPage() {
  const [authed, setAuthed]         = useState(false);
  const [loginUser, setLoginUser]   = useState("");
  const [loginPass, setLoginPass]   = useState("");
  const [loginErr, setLoginErr]     = useState(false);
  const [nav, setNav]               = useState<StaffNav>("today");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogin = () => {
    if (loginUser === DEMO_CREDS.username && loginPass === DEMO_CREDS.password) {
      setAuthed(true); setLoginErr(false);
    } else setLoginErr(true);
  };

  if (!authed) return <StaffLogin user={loginUser} pass={loginPass}
    setUser={setLoginUser} setPass={setLoginPass} err={loginErr} onLogin={handleLogin} />;

  return (
    <div className="min-h-screen bg-gray-50 text-foreground">
      {/* Top bar */}
      <header className="sticky top-0 z-30 border-b border-border/50 bg-white shadow-sm">
        <div className="flex min-h-14 items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-foreground/50 hover:text-kiosk-teal" aria-label="menu">
              <Menu size={20} />
            </button>
            <img src="/logo.png" alt="MediKiosk" className="size-8 rounded-lg object-contain" />
            <div>
              <p className="text-sm font-black text-kiosk-navy">MediKiosk Staff</p>
              <p className="text-[9px] font-bold uppercase tracking-widest text-kiosk-teal/70">Reception · Front Desk</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a href="/portal" className="hidden sm:flex items-center gap-1.5 rounded-xl border border-kiosk-teal/30 px-3 py-1.5 text-xs font-bold text-kiosk-navy hover:bg-kiosk-teal/5 transition-colors">
              <HeartPulse size={12} className="text-kiosk-teal" /> Patient Portal
            </a>
            <a href="/" className="hidden sm:flex items-center gap-1.5 rounded-xl border border-kiosk-teal/30 px-3 py-1.5 text-xs font-bold text-kiosk-navy hover:bg-kiosk-teal/5 transition-colors">
              <UserRound size={12} className="text-kiosk-teal" /> Patient Booking
            </a>
            <div className="grid size-8 place-items-center rounded-full bg-kiosk-teal text-white text-xs font-black shadow">ST</div>
          </div>
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-56px)]">
        {/* Desktop sidebar */}
        <aside className="hidden w-52 shrink-0 border-r border-border/50 bg-white lg:flex lg:flex-col py-4 px-3">
          <nav className="space-y-1 flex-1">
            {NAV_ITEMS.map(({ key, label, Icon }) => (
              <button key={key} onClick={() => setNav(key)}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold transition-all text-left ${nav === key ? "bg-kiosk-teal/10 text-kiosk-teal" : "text-foreground/60 hover:bg-gray-100 hover:text-kiosk-navy"}`}>
                <Icon size={16} /> {label}
              </button>
            ))}
          </nav>
          <div className="mt-4 rounded-xl bg-gray-50 border border-border/40 p-3 text-[11px] font-medium text-foreground/40">
            Staff: Reception<br />City Hospital · Demo mode
          </div>
        </aside>

        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
            <aside className="absolute left-0 top-0 bottom-0 w-56 bg-white border-r border-border/50 py-4 px-3 flex flex-col shadow-xl">
              <div className="flex items-center justify-between mb-4 px-1">
                <p className="text-sm font-black text-kiosk-navy">Staff Menu</p>
                <button onClick={() => setSidebarOpen(false)} className="text-foreground/40 hover:text-kiosk-coral"><X size={18} /></button>
              </div>
              <nav className="space-y-1 flex-1">
                {NAV_ITEMS.map(({ key, label, Icon }) => (
                  <button key={key} onClick={() => { setNav(key); setSidebarOpen(false); }}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold transition-all text-left ${nav === key ? "bg-kiosk-teal/10 text-kiosk-teal" : "text-foreground/60 hover:bg-gray-100"}`}>
                    <Icon size={16} /> {label}
                  </button>
                ))}
              </nav>
            </aside>
          </div>
        )}

        {/* Main content */}
        <main className="flex-1 p-4 sm:p-6 min-w-0">
          {nav === "today"    && <TodayView />}
          {nav === "book"     && <BookView onBooked={() => setNav("today")} />}
          {nav === "search"   && <SearchView />}
          {nav === "settings" && <StaffSettingsView />}
        </main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 flex border-t border-border/50 bg-white lg:hidden">
        {NAV_ITEMS.map(({ key, label, Icon }) => (
          <button key={key} onClick={() => setNav(key)}
            className={`flex flex-1 flex-col items-center gap-0.5 py-2 text-[10px] font-bold transition-colors ${nav === key ? "text-kiosk-teal" : "text-foreground/40"}`}>
            <Icon size={18} />
            {label}
          </button>
        ))}
      </nav>
    </div>
  );
}

// ─── Login screen ─────────────────────────────────────────────────────────────

function StaffLogin({ user, pass, setUser, setPass, err, onLogin }: {
  user: string; pass: string; setUser: (v: string) => void; setPass: (v: string) => void;
  err: boolean; onLogin: () => void;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-sm rounded-3xl border border-border/50 bg-white p-8 shadow-xl">
        <div className="mb-6 flex items-center gap-3">
          <div className="grid size-12 place-items-center rounded-2xl bg-kiosk-teal text-white shadow-lg shadow-kiosk-teal/30">
            <UserRound size={22} />
          </div>
          <div>
            <p className="text-xl font-black text-kiosk-navy">Staff Login</p>
            <p className="text-xs font-medium text-foreground/45">Hospital Reception · Demo</p>
          </div>
        </div>
        <div className="space-y-3">
          <div>
            <label className="text-[11px] font-black uppercase tracking-wide text-foreground/50">Username</label>
            <Input value={user} onChange={(e) => setUser(e.target.value)}
              placeholder="staff@hospital.demo"
              onKeyDown={(e) => e.key === "Enter" && onLogin()}
              className="mt-1 rounded-xl border-border/60 focus-visible:ring-kiosk-teal" />
          </div>
          <div>
            <label className="text-[11px] font-black uppercase tracking-wide text-foreground/50">Password</label>
            <Input type="password" value={pass} onChange={(e) => setPass(e.target.value)}
              placeholder="staff123"
              onKeyDown={(e) => e.key === "Enter" && onLogin()}
              className="mt-1 rounded-xl border-border/60 focus-visible:ring-kiosk-teal" />
          </div>
        </div>
        {err && (
          <div className="mt-3 flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 px-3 py-2 text-xs font-bold text-red-600">
            <AlertTriangle size={13} /> Invalid credentials. Use demo credentials below.
          </div>
        )}
        <div className="mt-3 rounded-xl bg-kiosk-teal/5 border border-kiosk-teal/20 p-3 text-xs font-medium text-kiosk-navy">
          <p className="font-bold">Demo credentials:</p>
          <p className="mt-0.5 text-foreground/60">Username: staff@hospital.demo</p>
          <p className="text-foreground/60">Password: staff123</p>
        </div>
        <Button onClick={onLogin} className="mt-5 w-full min-h-12 rounded-2xl bg-kiosk-teal font-black text-white shadow-lg shadow-kiosk-teal/25 hover:bg-kiosk-teal/90">
          <LogIn size={16} /> Sign in
        </Button>
        <div className="mt-4 flex items-center justify-center gap-2">
          <a href="/" className="text-xs font-bold text-kiosk-teal hover:underline">← Patient booking</a>
          <span className="text-foreground/30">·</span>
          <a href="/portal" className="text-xs font-bold text-kiosk-teal hover:underline">Patient portal</a>
        </div>
      </div>
    </div>
  );
}

// ─── Today's Schedule View ────────────────────────────────────────────────────

function TodayView() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading]           = useState(true);
  const [filter, setFilter]             = useState<"all" | "waiting" | "completed">("all");
  const [toast, setToast]               = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const today = new Date().toISOString().slice(0, 10);

  const load = useCallback(async () => {
    const all = await getAppointments();
    setAppointments(all.filter((a) => a.date === today));
    setLoading(false);
  }, [today]);

  useEffect(() => { load(); }, [load]);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 4000); };

  const setStatus = async (id: string, status: AppointmentStatus) => {
    setActionLoading(id + status);
    await updateAppointment(id, { status });
    await load();
    showToast(`Status updated to "${status.replace("-", " ")}"`);
    setActionLoading(null);
  };

  const sendSMS = async (apt: Appointment) => {
    setActionLoading(apt.id + "sms");
    const msg = `Reminder: Your appointment with ${apt.doctor} is today at ${apt.timeSlot}. Token: ${apt.token}. City Hospital OPD.`;
    const r = await sendReminder(apt.id, "sms", msg);
    showToast(r.success ? `SMS sent to ${apt.phone}` : "Failed to send SMS");
    setActionLoading(null);
  };

  const stats = {
    total:     appointments.length,
    waiting:   appointments.filter((a) => a.status === "waiting").length,
    completed: appointments.filter((a) => a.status === "completed").length,
    scheduled: appointments.filter((a) => a.status === "scheduled").length,
  };

  const filtered = appointments.filter((a) => {
    if (filter === "waiting")   return ["waiting", "in-progress"].includes(a.status);
    if (filter === "completed") return a.status === "completed";
    return true;
  }).sort((a, b) => a.timeSlot.localeCompare(b.timeSlot));

  return (
    <div className="max-w-4xl space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-kiosk-navy">Today's Schedule</h1>
          <p className="text-sm font-medium text-foreground/50">{new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</p>
        </div>
        <Button onClick={load} variant="outline" size="sm" className="rounded-xl gap-1.5 font-bold">
          <RefreshCw size={13} /> Refresh
        </Button>
      </div>

      {toast && (
        <div className="flex items-center gap-2 rounded-2xl bg-kiosk-teal/10 border border-kiosk-teal/20 px-4 py-3 text-sm font-bold text-kiosk-teal">
          <CheckCircle2 size={15} /> {toast}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Total",     value: stats.total,     color: "bg-kiosk-sky/10 text-kiosk-sky" },
          { label: "Scheduled", value: stats.scheduled, color: "bg-kiosk-teal/10 text-kiosk-teal" },
          { label: "Waiting",   value: stats.waiting,   color: "bg-kiosk-yellow/20 text-kiosk-navy" },
          { label: "Completed", value: stats.completed, color: "bg-kiosk-green/15 text-kiosk-green" },
        ].map(({ label, value, color }) => (
          <div key={label} className="rounded-2xl border border-border/50 bg-white p-4 shadow-sm">
            <p className="text-xs font-black uppercase tracking-wide text-foreground/45">{label}</p>
            <p className={`mt-1 text-3xl font-black ${color.split(" ")[1]}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 rounded-xl bg-gray-100 p-1 w-fit">
        {(["all", "waiting", "completed"] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`rounded-lg px-4 py-1.5 text-sm font-bold capitalize transition-all ${filter === f ? "bg-white text-kiosk-navy shadow-sm" : "text-foreground/50"}`}>
            {f}
          </button>
        ))}
      </div>

      {/* Appointment list */}
      {loading ? (
        <div className="flex items-center gap-2 text-sm text-foreground/50"><RefreshCw size={14} className="animate-spin" /> Loading…</div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-border/40 bg-white p-8 text-center">
          <Calendar size={32} className="mx-auto mb-2 text-foreground/20" />
          <p className="text-sm font-bold text-kiosk-navy">No appointments for this filter</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((apt) => (
            <AppointmentRow key={apt.id} apt={apt}
              onStatus={setStatus}
              onSMS={sendSMS}
              loading={actionLoading}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Appointment row ──────────────────────────────────────────────────────────

function AppointmentRow({ apt, onStatus, onSMS, loading }: {
  apt: Appointment;
  onStatus: (id: string, s: AppointmentStatus) => void;
  onSMS: (apt: Appointment) => void;
  loading: string | null;
}) {
  const [expanded, setExpanded] = useState(false);
  const [fuOpen, setFuOpen]     = useState(false);
  const [fuDate, setFuDate]     = useState("");
  const [fuReason, setFuReason] = useState("");
  const [fuNote, setFuNote]     = useState("");
  const [fuChannel, setFuChannel] = useState<ReminderChannel>("sms");
  const [fuLoading, setFuLoading] = useState(false);
  const [fuToast, setFuToast]   = useState<string | null>(null);

  const handleBookFu = async () => {
    if (!fuDate || !fuReason) return;
    setFuLoading(true);
    await bookFollowUp(apt.id, fuDate, fuReason, fuNote, fuChannel).catch(() => {});
    setFuToast(`Follow-up booked for ${fuDate}`);
    setTimeout(() => setFuToast(null), 4000);
    setFuOpen(false); setFuDate(""); setFuReason(""); setFuNote("");
    setFuLoading(false);
  };

  const nextStatus: Record<AppointmentStatus, { label: string; status: AppointmentStatus } | null> = {
    "scheduled":   { label: "Check in", status: "waiting" },
    "waiting":     { label: "Call in",  status: "in-progress" },
    "in-progress": { label: "Complete", status: "completed" },
    "completed":   null,
    "cancelled":   null,
    "no-show":     null,
  };
  const next = nextStatus[apt.status];

  return (
    <div className="rounded-2xl border border-border/50 bg-white shadow-sm overflow-hidden">
      {fuToast && (
        <div className="flex items-center gap-2 bg-kiosk-teal/10 px-4 py-2 text-xs font-bold text-kiosk-teal border-b border-kiosk-teal/20">
          <CheckCircle2 size={12} /> {fuToast}
        </div>
      )}
      <div className="flex items-center gap-3 p-3 sm:p-4">
        {/* Time */}
        <div className="shrink-0 w-16 text-center">
          <p className="text-xs font-black text-kiosk-navy">{apt.timeSlot.replace(" AM", "").replace(" PM", "")}</p>
          <p className="text-[9px] font-bold text-foreground/40">{apt.timeSlot.includes("AM") ? "AM" : "PM"}</p>
        </div>

        {/* Token */}
        <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-kiosk-coral/10 text-sm font-black text-kiosk-coral">
          {apt.token.split("-")[1]}
        </div>

        {/* Patient */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-black text-kiosk-navy truncate">{apt.patientName}</p>
          <p className="text-xs font-medium text-foreground/50 truncate">{apt.patientAge}y · {apt.patientGender} · {apt.complaint}</p>
        </div>

        {/* Status badge */}
        <span className={`hidden sm:inline-flex shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-black ${statusColor(apt.status)}`}>
          {apt.status.replace("-", " ")}
        </span>

        {/* Next action */}
        {next && (
          <Button size="sm" onClick={() => onStatus(apt.id, next.status)}
            disabled={loading === apt.id + next.status}
            className="shrink-0 rounded-xl bg-kiosk-teal text-white text-xs font-black shadow-sm hover:bg-kiosk-teal/90 disabled:opacity-50 px-3">
            {loading === apt.id + next.status ? <RefreshCw size={12} className="animate-spin" /> : next.label}
          </Button>
        )}
        {apt.status === "completed" && (
          <span className="shrink-0 flex items-center gap-1 text-xs font-black text-kiosk-teal">
            <BadgeCheck size={14} /> Done
          </span>
        )}

        <button onClick={() => setExpanded((e) => !e)}
          className="shrink-0 text-foreground/30 hover:text-kiosk-teal transition-colors">
          <ChevronRight size={16} className={`transition-transform ${expanded ? "rotate-90" : ""}`} />
        </button>
      </div>

      {/* Expanded */}
      {expanded && (
        <div className="border-t border-border/40 px-4 py-3 bg-gray-50/50 space-y-3">
          <div className="flex flex-wrap gap-3 text-xs font-medium text-foreground/55">
            <span className="flex items-center gap-1"><Phone size={11} /> {apt.phone}</span>
            {apt.email && <span className="flex items-center gap-1"><Mail size={11} /> {apt.email}</span>}
            <span className="flex items-center gap-1"><Stethoscope size={11} /> {apt.doctor}</span>
            <span className="flex items-center gap-1"><Clock3 size={11} /> {apt.timeSlot} · {apt.department}</span>
            {apt.queuePosition > 0 && (
              <span className="flex items-center gap-1"><Timer size={11} /> Queue #{apt.queuePosition} · {formatWait(apt.estimatedWait)}</span>
            )}
          </div>

          {apt.notes && (
            <div className="rounded-xl bg-kiosk-teal/5 border border-kiosk-teal/15 px-3 py-2 text-xs font-medium text-kiosk-navy">
              {apt.notes}
            </div>
          )}

          {/* Follow-ups */}
          {apt.followUps.length > 0 && (
            <div className="space-y-1">
              {apt.followUps.map((fu) => (
                <div key={fu.id} className="flex items-center gap-2 text-xs text-foreground/60">
                  <Calendar size={11} className="text-kiosk-coral shrink-0" />
                  <span className="font-bold text-kiosk-navy">{fu.scheduledDate}</span>
                  <span>— {fu.reason}</span>
                  <span className={`ml-auto rounded-full px-2 py-0.5 text-[10px] font-black ${fu.status === "completed" ? "bg-kiosk-teal/15 text-kiosk-teal" : "bg-kiosk-yellow/20 text-kiosk-navy"}`}>{fu.status}</span>
                </div>
              ))}
            </div>
          )}

          {/* Action buttons */}
          <div className="flex flex-wrap gap-2">
            <button onClick={() => onSMS(apt)}
              disabled={loading === apt.id + "sms"}
              className="flex items-center gap-1.5 rounded-xl border border-kiosk-teal/30 bg-white px-3 py-1.5 text-xs font-bold text-kiosk-teal hover:bg-kiosk-teal/5 disabled:opacity-50 transition-colors">
              <Phone size={11} /> Send SMS
            </button>
            <button onClick={async () => {
              const msg = `Reminder: Your appointment with ${apt.doctor} is today at ${apt.timeSlot}. Token: ${apt.token}.`;
              await sendReminder(apt.id, "email", msg);
            }}
              className="flex items-center gap-1.5 rounded-xl border border-kiosk-teal/30 bg-white px-3 py-1.5 text-xs font-bold text-kiosk-teal hover:bg-kiosk-teal/5 transition-colors">
              <Mail size={11} /> Send Email
            </button>
            {["scheduled", "waiting", "in-progress"].includes(apt.status) && (
              <button onClick={() => onStatus(apt.id, "cancelled")}
                className="flex items-center gap-1.5 rounded-xl border border-red-200 bg-white px-3 py-1.5 text-xs font-bold text-red-500 hover:bg-red-50 transition-colors">
                <X size={11} /> Cancel
              </button>
            )}
            {["scheduled", "waiting"].includes(apt.status) && (
              <button onClick={() => onStatus(apt.id, "no-show")}
                className="flex items-center gap-1.5 rounded-xl border border-border/40 bg-white px-3 py-1.5 text-xs font-bold text-foreground/50 hover:bg-gray-100 transition-colors">
                No show
              </button>
            )}
            {apt.status === "completed" && (
              <button onClick={() => setFuOpen((o) => !o)}
                className="flex items-center gap-1.5 rounded-xl border border-kiosk-coral/30 bg-white px-3 py-1.5 text-xs font-bold text-kiosk-coral hover:bg-kiosk-coral/5 transition-colors">
                <Calendar size={11} /> Book follow-up
              </button>
            )}
          </div>

          {/* Follow-up form */}
          {fuOpen && (
            <div className="rounded-2xl border border-kiosk-coral/20 bg-kiosk-coral/3 p-4 space-y-3">
              <p className="text-xs font-black text-kiosk-coral uppercase tracking-wide">Book Follow-up Visit</p>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="text-[11px] font-black uppercase text-foreground/40">Date</label>
                  <Input type="date" value={fuDate} onChange={(e) => setFuDate(e.target.value)}
                    min={new Date(Date.now() + 86400000).toISOString().slice(0, 10)}
                    className="mt-1 h-9 rounded-xl border-border/60 text-sm" />
                </div>
                <div>
                  <label className="text-[11px] font-black uppercase text-foreground/40">Reason</label>
                  <Input value={fuReason} onChange={(e) => setFuReason(e.target.value)}
                    placeholder="e.g. Review fever"
                    className="mt-1 h-9 rounded-xl border-border/60 text-sm" />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-[11px] font-black uppercase text-foreground/40">Note for patient</label>
                  <Input value={fuNote} onChange={(e) => setFuNote(e.target.value)}
                    placeholder="Instructions…"
                    className="mt-1 h-9 rounded-xl border-border/60 text-sm" />
                </div>
                <div>
                  <label className="text-[11px] font-black uppercase text-foreground/40">Remind via</label>
                  <div className="mt-1 flex gap-1.5">
                    {(["sms", "email", "both"] as ReminderChannel[]).map((ch) => (
                      <button key={ch} onClick={() => setFuChannel(ch)}
                        className={`flex-1 rounded-lg py-1.5 text-[11px] font-black capitalize transition-all ${fuChannel === ch ? "bg-kiosk-teal text-white" : "border border-border/50 text-foreground/50"}`}>
                        {ch}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => setFuOpen(false)} className="rounded-xl font-bold">Cancel</Button>
                <Button size="sm" onClick={handleBookFu} disabled={!fuDate || !fuReason || fuLoading}
                  className="rounded-xl bg-kiosk-teal text-white font-black hover:bg-kiosk-teal/90 disabled:opacity-40">
                  {fuLoading ? <RefreshCw size={12} className="animate-spin" /> : <><Calendar size={12} /> Book & notify</>}
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Quick Book View ──────────────────────────────────────────────────────────

function BookView({ onBooked }: { onBooked: () => void }) {
  const [form, setForm] = useState({
    patientName: "", patientAge: "", patientGender: "Male",
    phone: "", email: "",
    complaint: "Fever", department: "OPD — General", doctor: "Dr. M. Rao",
    date: new Date().toISOString().slice(0, 10), timeSlot: "09:00 AM",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<Appointment | null>(null);
  const [error, setError]     = useState<string | null>(null);

  const f = <K extends keyof typeof form>(key: K, val: typeof form[K]) =>
    setForm((p) => ({ ...p, [key]: val }));

  const availableDoctors = DOCTORS[form.department] ?? ["Dr. M. Rao"];

  const handleBook = async () => {
    if (!form.patientName || !form.phone || form.phone.length < 10) {
      setError("Patient name and 10-digit mobile number are required.");
      return;
    }
    setLoading(true); setError(null);
    try {
      const apt = await createAppointment({
        ...form,
        patientGender: form.patientGender,
        status: "scheduled" as AppointmentStatus,
        queuePosition: 0, estimatedWait: 0,
        notes: "",
      });
      setSuccess(apt);
      // Auto-send SMS confirmation
      await sendReminder(apt.id, "sms",
        `Appointment confirmed at City Hospital. Token: ${apt.token}. ${apt.doctor}, ${apt.department}. Date: ${apt.date} at ${apt.timeSlot}. Check your queue at /portal.`
      );
    } catch {
      setError("Failed to book appointment. Please try again.");
    }
    setLoading(false);
  };

  if (success) return (
    <div className="max-w-md mx-auto space-y-4">
      <div className="rounded-3xl border-2 border-kiosk-teal/25 bg-white p-8 text-center shadow-xl">
        <div className="mx-auto grid size-16 place-items-center rounded-full bg-kiosk-green/15 text-kiosk-green ring-8 ring-kiosk-green/10">
          <Check size={32} strokeWidth={2.5} />
        </div>
        <p className="mt-5 text-xs font-black uppercase tracking-widest text-kiosk-green">Appointment Booked</p>
        <h2 className="mt-2 text-2xl font-black text-kiosk-navy">{success.patientName}</h2>
        <p className="mt-1 text-sm font-medium text-foreground/55">{success.department} · {success.doctor}</p>
        <div className="mt-5 rounded-2xl bg-kiosk-teal/5 border border-kiosk-teal/20 p-4 space-y-2 text-left">
          <Row label="Token"    value={success.token} large />
          <Row label="Date"     value={success.date === new Date().toISOString().slice(0, 10) ? `Today, ${success.date}` : success.date} />
          <Row label="Time"     value={success.timeSlot} />
          <Row label="Queue"    value={`Position #${success.queuePosition} · ~${success.estimatedWait} min wait`} />
          <Row label="Complaint" value={success.complaint} />
          <Row label="Phone"    value={success.phone} />
        </div>
        <div className="mt-4 flex items-center gap-2 rounded-xl bg-kiosk-teal/8 border border-kiosk-teal/20 px-3 py-2 text-xs font-bold text-kiosk-teal">
          <Phone size={12} /> SMS confirmation sent to {success.phone}
        </div>
        <div className="mt-5 flex gap-3">
          <Button variant="outline" onClick={() => { setSuccess(null); setForm({ patientName: "", patientAge: "", patientGender: "Male", phone: "", email: "", complaint: "Fever", department: "OPD — General", doctor: "Dr. M. Rao", date: new Date().toISOString().slice(0, 10), timeSlot: "09:00 AM" }); }}
            className="flex-1 rounded-2xl font-bold border-border">
            Book another
          </Button>
          <Button onClick={onBooked} className="flex-1 rounded-2xl bg-kiosk-teal text-white font-black hover:bg-kiosk-teal/90">
            View today <ArrowRight size={14} />
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-2xl space-y-5">
      <div>
        <h1 className="text-2xl font-black text-kiosk-navy">Book Appointment</h1>
        <p className="text-sm font-medium text-foreground/50">Quick booking for walk-in and phone patients</p>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-2xl bg-red-50 border border-red-200 px-4 py-3 text-sm font-bold text-red-600">
          <AlertTriangle size={14} /> {error}
        </div>
      )}

      <div className="rounded-2xl border border-border/50 bg-white p-5 shadow-sm space-y-4">
        <p className="text-xs font-black uppercase tracking-wide text-foreground/40 border-b border-border/40 pb-2">Patient Details</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="text-[11px] font-black uppercase tracking-wide text-foreground/50">Full Name *</label>
            <Input value={form.patientName} onChange={(e) => f("patientName", e.target.value)}
              placeholder="Patient's full name"
              className="mt-1.5 rounded-xl border-border/60 focus-visible:ring-kiosk-teal" />
          </div>
          <div>
            <label className="text-[11px] font-black uppercase tracking-wide text-foreground/50">Age</label>
            <Input inputMode="numeric" value={form.patientAge} onChange={(e) => f("patientAge", e.target.value.replace(/\D/g, ""))}
              placeholder="e.g. 45"
              className="mt-1.5 rounded-xl border-border/60 focus-visible:ring-kiosk-teal" />
          </div>
          <div>
            <label className="text-[11px] font-black uppercase tracking-wide text-foreground/50">Gender</label>
            <div className="mt-1.5 flex gap-2">
              {["Male", "Female", "Other"].map((g) => (
                <button key={g} onClick={() => f("patientGender", g)}
                  className={`flex-1 rounded-xl py-2 text-xs font-bold transition-all ${form.patientGender === g ? "bg-kiosk-teal text-white" : "border border-border/50 text-foreground/60 hover:border-kiosk-teal/40"}`}>
                  {g}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-[11px] font-black uppercase tracking-wide text-foreground/50">Mobile * (for SMS)</label>
            <Input inputMode="numeric" value={form.phone} onChange={(e) => f("phone", e.target.value.replace(/\D/g, "").slice(0, 10))}
              placeholder="10-digit number"
              className="mt-1.5 rounded-xl border-border/60 focus-visible:ring-kiosk-teal" maxLength={10} />
          </div>
          <div>
            <label className="text-[11px] font-black uppercase tracking-wide text-foreground/50">Email (optional)</label>
            <Input type="email" value={form.email} onChange={(e) => f("email", e.target.value)}
              placeholder="patient@email.com"
              className="mt-1.5 rounded-xl border-border/60 focus-visible:ring-kiosk-teal" />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border/50 bg-white p-5 shadow-sm space-y-4">
        <p className="text-xs font-black uppercase tracking-wide text-foreground/40 border-b border-border/40 pb-2">Appointment Details</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-[11px] font-black uppercase tracking-wide text-foreground/50">Chief Complaint</label>
            <select value={form.complaint} onChange={(e) => f("complaint", e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-border/60 bg-white px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-kiosk-teal/30">
              {COMPLAINTS.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[11px] font-black uppercase tracking-wide text-foreground/50">Department</label>
            <select value={form.department} onChange={(e) => { f("department", e.target.value); f("doctor", DOCTORS[e.target.value]?.[0] ?? "Dr. M. Rao"); }}
              className="mt-1.5 w-full rounded-xl border border-border/60 bg-white px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-kiosk-teal/30">
              {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[11px] font-black uppercase tracking-wide text-foreground/50">Doctor</label>
            <select value={form.doctor} onChange={(e) => f("doctor", e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-border/60 bg-white px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-kiosk-teal/30">
              {availableDoctors.map((d) => <option key={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[11px] font-black uppercase tracking-wide text-foreground/50">Date</label>
            <Input type="date" value={form.date} onChange={(e) => f("date", e.target.value)}
              min={new Date().toISOString().slice(0, 10)}
              className="mt-1.5 rounded-xl border-border/60 focus-visible:ring-kiosk-teal" />
          </div>
          <div className="sm:col-span-2">
            <label className="text-[11px] font-black uppercase tracking-wide text-foreground/50">Time Slot</label>
            <div className="mt-1.5 flex flex-wrap gap-2">
              {TIME_SLOTS.map((slot) => (
                <button key={slot} onClick={() => f("timeSlot", slot)}
                  className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${form.timeSlot === slot ? "bg-kiosk-teal text-white shadow-sm" : "border border-border/50 text-foreground/60 hover:border-kiosk-teal/40"}`}>
                  {slot}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 rounded-xl bg-kiosk-teal/5 border border-kiosk-teal/20 px-4 py-3 text-xs font-bold text-kiosk-teal">
        <Phone size={12} /> An SMS confirmation will be sent to the patient automatically after booking.
      </div>

      <Button onClick={handleBook} disabled={loading || !form.patientName || form.phone.length < 10}
        className="w-full min-h-12 rounded-2xl bg-kiosk-teal font-black text-white shadow-lg shadow-kiosk-teal/25 hover:bg-kiosk-teal/90 disabled:opacity-40">
        {loading ? <><RefreshCw size={16} className="animate-spin" /> Booking…</> : <><Calendar size={16} /> Confirm Booking & Send SMS</>}
      </Button>
    </div>
  );
}

function Row({ label, value, large }: { label: string; value: string; large?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[11px] font-black uppercase text-foreground/40">{label}</span>
      <span className={`font-black text-kiosk-navy ${large ? "text-xl text-kiosk-coral" : "text-sm"}`}>{value}</span>
    </div>
  );
}

// ─── Search View ──────────────────────────────────────────────────────────────

function SearchView() {
  const [query, setQuery]             = useState("");
  const [results, setResults]         = useState<Appointment[]>([]);
  const [loading, setLoading]         = useState(false);
  const [searched, setSearched]       = useState(false);
  const [toast, setToast]             = useState<string | null>(null);

  const search = async () => {
    if (!query.trim()) return;
    setLoading(true); setSearched(true);
    const all = await getAppointments();
    const q = query.toLowerCase().trim();
    setResults(all.filter((a) =>
      a.patientName.toLowerCase().includes(q) ||
      a.phone.includes(q) ||
      a.token.toLowerCase().includes(q) ||
      a.complaint.toLowerCase().includes(q)
    ));
    setLoading(false);
  };

  const sendSMS = async (apt: Appointment) => {
    const msg = `Reminder: Your appointment with ${apt.doctor} is on ${apt.date} at ${apt.timeSlot}. Token: ${apt.token}. City Hospital OPD.`;
    const r = await sendReminder(apt.id, "sms", msg);
    setToast(r.success ? `SMS sent to ${apt.phone}` : "Failed");
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="max-w-2xl space-y-5">
      <h1 className="text-2xl font-black text-kiosk-navy">Search Patients</h1>

      {toast && (
        <div className="flex items-center gap-2 rounded-2xl bg-kiosk-teal/10 border border-kiosk-teal/20 px-4 py-3 text-sm font-bold text-kiosk-teal">
          <CheckCircle2 size={15} /> {toast}
        </div>
      )}

      <div className="flex gap-2">
        <Input value={query} onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && search()}
          placeholder="Search by name, phone, token, complaint…"
          className="flex-1 rounded-xl border-border/60 focus-visible:ring-kiosk-teal" />
        <Button onClick={search} disabled={loading || !query.trim()}
          className="rounded-xl bg-kiosk-teal text-white font-black px-5 hover:bg-kiosk-teal/90 disabled:opacity-40">
          {loading ? <RefreshCw size={15} className="animate-spin" /> : <Search size={15} />}
        </Button>
      </div>

      {searched && !loading && results.length === 0 && (
        <div className="rounded-2xl border border-border/40 bg-white p-6 text-center">
          <Search size={28} className="mx-auto mb-2 text-foreground/20" />
          <p className="text-sm font-bold text-kiosk-navy">No results for "{query}"</p>
        </div>
      )}

      {results.length > 0 && (
        <div className="space-y-2">
          {results.map((apt) => (
            <div key={apt.id} className="rounded-2xl border border-border/50 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-kiosk-coral/10 text-sm font-black text-kiosk-coral">
                  {apt.token.split("-")[1]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-black text-kiosk-navy">{apt.patientName}</p>
                  <p className="text-xs font-medium text-foreground/50">{apt.patientAge}y · {apt.gender} · {apt.complaint}</p>
                  <p className="text-xs font-medium text-foreground/40">{apt.date} · {apt.timeSlot} · {apt.doctor}</p>
                </div>
                <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-black ${statusColor(apt.status)}`}>
                  {apt.status.replace("-", " ")}
                </span>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <button onClick={() => sendSMS(apt)}
                  className="flex items-center gap-1.5 rounded-xl border border-kiosk-teal/30 bg-white px-3 py-1.5 text-xs font-bold text-kiosk-teal hover:bg-kiosk-teal/5 transition-colors">
                  <Phone size={11} /> SMS reminder
                </button>
                <a href={`/portal?phone=${apt.phone}`} target="_blank" rel="noreferrer"
                  className="flex items-center gap-1.5 rounded-xl border border-kiosk-sky/30 bg-white px-3 py-1.5 text-xs font-bold text-kiosk-sky hover:bg-kiosk-sky/5 transition-colors">
                  View portal
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Staff Settings ───────────────────────────────────────────────────────────

function StaffSettingsView() {
  const [smsAuto, setSmsAuto]     = useState(true);
  const [emailAuto, setEmailAuto] = useState(false);
  const [dayBefore, setDayBefore] = useState(true);
  const [onDay, setOnDay]         = useState(true);
  const [saved, setSaved]         = useState(false);

  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 3000); };

  return (
    <div className="max-w-xl space-y-5">
      <h1 className="text-2xl font-black text-kiosk-navy">Settings</h1>

      {saved && (
        <div className="flex items-center gap-2 rounded-2xl bg-kiosk-teal/10 border border-kiosk-teal/20 px-4 py-3 text-sm font-bold text-kiosk-teal">
          <CheckCircle2 size={15} /> Settings saved
        </div>
      )}

      <div className="rounded-2xl border border-border/50 bg-white p-5 shadow-sm space-y-4">
        <p className="text-xs font-black uppercase tracking-wide text-foreground/40 border-b border-border/40 pb-2">Automatic Reminders</p>
        {[
          { label: "SMS — auto-send on booking",       desc: "Send SMS confirmation when appointment is booked", value: smsAuto,   set: setSmsAuto   },
          { label: "Email — auto-send on booking",     desc: "Send email confirmation when appointment is booked", value: emailAuto, set: setEmailAuto },
          { label: "SMS reminder — day before visit",  desc: "Remind patient the day before their appointment",  value: dayBefore, set: setDayBefore },
          { label: "SMS reminder — morning of visit",  desc: "Remind patient on the morning of their appointment", value: onDay,    set: setOnDay     },
        ].map(({ label, desc, value, set }) => (
          <div key={label} className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-kiosk-navy">{label}</p>
              <p className="text-xs font-medium text-foreground/45">{desc}</p>
            </div>
            <button onClick={() => set((v) => !v)} aria-pressed={value}
              className={`relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors ${value ? "bg-kiosk-teal" : "bg-border"}`}>
              <span className={`inline-block size-5 rounded-full bg-white shadow transition-transform ${value ? "translate-x-5" : "translate-x-0"}`} />
            </button>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-border/50 bg-white p-5 shadow-sm space-y-3">
        <p className="text-xs font-black uppercase tracking-wide text-foreground/40 border-b border-border/40 pb-2">Hospital Info</p>
        {[
          { label: "Hospital Name",  value: "City Hospital" },
          { label: "OPD Block",      value: "Block A, Ground Floor" },
          { label: "Contact Number", value: "011-2345-6789" },
        ].map(({ label, value }) => (
          <div key={label}>
            <label className="text-[11px] font-black uppercase text-foreground/40">{label}</label>
            <Input defaultValue={value} className="mt-1 h-9 rounded-xl border-border/60 text-sm" />
          </div>
        ))}
      </div>

      <Button onClick={save} className="w-full min-h-12 rounded-2xl bg-kiosk-teal font-black text-white shadow-lg shadow-kiosk-teal/25 hover:bg-kiosk-teal/90">
        <ShieldCheck size={16} /> Save Settings
      </Button>

      <p className="text-center text-xs font-medium text-foreground/35">Demo mode — settings not persisted between sessions</p>
    </div>
  );
}

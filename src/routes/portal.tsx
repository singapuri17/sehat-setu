/**
 * /portal — Patient Appointment Portal
 *
 * Entry points:
 *   /portal                    → phone number lookup form
 *   /portal?phone=9876543210   → direct load by phone (from QR on success screen)
 *
 * Shows:
 *   - Upcoming appointment card with queue position + live countdown
 *   - SMS/email reminder preferences (update channel)
 *   - Follow-up visit history and upcoming follow-ups
 *   - Past appointments
 */

import { createFileRoute, useSearch } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertTriangle, ArrowRight, BadgeCheck, Bell, BellOff,
  Calendar, Check, CheckCircle2, ChevronRight, Clock3,
  HeartPulse, History, Mail, MapPin, Phone, RefreshCw,
  ShieldCheck, Smartphone, Stethoscope, Timer, User, X,
} from "lucide-react";
import {
  type Appointment, type ReminderChannel,
  getAppointmentByPhone, sendReminder,
  formatWait, statusColor,
} from "@/lib/appointmentService";
import { QRCodeSVG } from "qrcode.react";

export const Route = createFileRoute("/portal")({
  head: () => ({
    meta: [
      { title: "MediKiosk — My Appointments & Health Portal" },
      { name: "description", content: "Check your appointment status, queue position, reminders and follow-ups." },
      { name: "viewport", content: "width=device-width, initial-scale=1, maximum-scale=1" },
    ],
  }),
  component: PortalPage,
  validateSearch: (search: Record<string, unknown>) => ({
    phone: typeof search.phone === "string" ? search.phone : undefined,
  }),
});

// ─── Main component ───────────────────────────────────────────────────────────

function PortalPage() {
  const { phone: phoneParam } = useSearch({ from: "/portal" });

  const [phone, setPhone]           = useState(phoneParam ?? "");
  const [inputPhone, setInputPhone] = useState(phoneParam ?? "");
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState<string | null>(null);
  const [activeTab, setActiveTab]   = useState<"upcoming" | "history">("upcoming");
  const [notifSent, setNotifSent]   = useState<string | null>(null);

  const load = useCallback(async (ph: string) => {
    if (!ph || ph.length < 10) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getAppointmentByPhone(ph);
      setAppointments(data);
      if (data.length === 0) setError("No appointments found for this number. Please check and try again.");
    } catch {
      setError("Could not load appointments. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-load if phone param is present
  useEffect(() => {
    if (phoneParam) { setPhone(phoneParam); load(phoneParam); }
  }, [phoneParam, load]);

  // Live queue refresh every 30 seconds for active appointments
  useEffect(() => {
    if (!phone) return;
    const interval = setInterval(() => load(phone), 30000);
    return () => clearInterval(interval);
  }, [phone, load]);

  const upcoming = appointments.filter((a) =>
    ["scheduled", "waiting", "in-progress"].includes(a.status)
  );
  const past = appointments.filter((a) =>
    ["completed", "cancelled", "no-show"].includes(a.status)
  );

  const handleSendReminder = async (apt: Appointment, channel: ReminderChannel) => {
    setNotifSent(null);
    const msg = `Reminder: Your appointment with ${apt.doctor} is on ${apt.date} at ${apt.timeSlot} at City Hospital OPD. Token: ${apt.token}.`;
    const result = await sendReminder(apt.id, channel, msg);
    setNotifSent(result.success ? `${channel === "sms" ? "SMS" : channel === "email" ? "Email" : "SMS & Email"} sent!` : "Failed to send.");
    setTimeout(() => setNotifSent(null), 4000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50/60 via-white to-blue-50/30">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-border/40 bg-white/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2.5">
            <img src="/logo.png" alt="MediKiosk" className="size-9 rounded-xl object-contain" />
            <div>
              <p className="text-sm font-black text-kiosk-navy">MediKiosk</p>
              <p className="text-[9px] font-bold uppercase tracking-widest text-kiosk-teal/70">Patient Portal</p>
            </div>
          </div>
          <a href="/" className="flex items-center gap-1.5 rounded-xl border border-kiosk-teal/30 bg-white px-3 py-1.5 text-xs font-bold text-kiosk-navy hover:bg-kiosk-teal/5 transition-colors">
            <HeartPulse size={13} className="text-kiosk-teal" /> Kiosk
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-6 pb-20 space-y-5">

        {/* ── Phone lookup form ──────────────────────────────────────────── */}
        <div className="rounded-3xl border-2 border-kiosk-teal/20 bg-white/90 p-5 shadow-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="grid size-10 place-items-center rounded-2xl bg-kiosk-teal text-white shadow-lg shadow-kiosk-teal/25">
              <Phone size={18} />
            </div>
            <div>
              <p className="text-base font-black text-kiosk-navy">Find my appointments</p>
              <p className="text-xs font-medium text-foreground/50">Enter your registered mobile number</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Input
              inputMode="numeric"
              placeholder="10-digit mobile number"
              value={inputPhone}
              onChange={(e) => setInputPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
              onKeyDown={(e) => { if (e.key === "Enter") { setPhone(inputPhone); load(inputPhone); } }}
              className="flex-1 min-h-12 rounded-2xl bg-white border-border/60 text-base font-medium focus-visible:ring-kiosk-teal"
              maxLength={10}
            />
            <Button
              onClick={() => { setPhone(inputPhone); load(inputPhone); }}
              disabled={inputPhone.length < 10 || loading}
              className="min-h-12 rounded-2xl bg-kiosk-teal px-5 font-black text-white shadow-lg shadow-kiosk-teal/25 hover:bg-kiosk-teal/90 disabled:opacity-40"
            >
              {loading ? <RefreshCw size={16} className="animate-spin" /> : <ArrowRight size={18} />}
            </Button>
          </div>
          {error && (
            <div className="mt-3 flex items-center gap-2 rounded-xl bg-kiosk-coral/10 border border-kiosk-coral/20 px-3 py-2 text-xs font-bold text-kiosk-coral">
              <AlertTriangle size={13} /> {error}
            </div>
          )}
          {/* Demo hint */}
          <div className="mt-3 flex flex-wrap gap-2">
            {[
              { name: "Rahul",  ph: "9876543210" },
              { name: "Priya",  ph: "9900112233" },
              { name: "Suresh", ph: "9811223344" },
            ].map(({ name, ph }) => (
              <button key={ph} onClick={() => { setInputPhone(ph); setPhone(ph); load(ph); }}
                className="rounded-full border border-kiosk-teal/20 bg-kiosk-teal/5 px-2.5 py-1 text-[11px] font-bold text-kiosk-teal hover:bg-kiosk-teal/10 transition-colors">
                Demo: {name} ({ph})
              </button>
            ))}
          </div>
        </div>

        {/* ── Toast notification ─────────────────────────────────────────── */}
        {notifSent && (
          <div className="flex items-center gap-2 rounded-2xl bg-kiosk-teal/10 border border-kiosk-teal/20 px-4 py-3 text-sm font-bold text-kiosk-teal mk-rise">
            <CheckCircle2 size={16} /> {notifSent}
          </div>
        )}

        {/* ── Results ────────────────────────────────────────────────────── */}
        {appointments.length > 0 && (
          <>
            {/* Patient summary bar */}
            <div className="flex items-center gap-3 rounded-2xl bg-kiosk-navy px-4 py-3">
              <div className="grid size-10 place-items-center rounded-full bg-white/10 text-white">
                <User size={18} />
              </div>
              <div>
                <p className="text-sm font-black text-white">{appointments[0]?.patientName}</p>
                <p className="text-xs font-medium text-white/55">
                  {appointments[0]?.patientAge}y · {appointments[0]?.patientGender} · {phone}
                </p>
              </div>
              <span className="ml-auto text-xs font-bold text-white/40">{appointments.length} appointment{appointments.length !== 1 ? "s" : ""}</span>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 rounded-2xl bg-border/20 p-1">
              {[
                { key: "upcoming", label: `Upcoming (${upcoming.length})` },
                { key: "history",  label: `History (${past.length})` },
              ].map(({ key, label }) => (
                <button key={key} onClick={() => setActiveTab(key as typeof activeTab)}
                  className={`flex-1 rounded-xl py-2 text-sm font-black transition-all ${activeTab === key ? "bg-white text-kiosk-navy shadow-sm" : "text-foreground/50 hover:text-kiosk-navy"}`}>
                  {label}
                </button>
              ))}
            </div>

            {/* ── Upcoming appointments ───────────────────────────────────── */}
            {activeTab === "upcoming" && (
              <div className="space-y-4">
                {upcoming.length === 0 ? (
                  <div className="rounded-2xl border border-border/40 bg-white/80 p-6 text-center">
                    <CheckCircle2 size={32} className="mx-auto mb-2 text-kiosk-teal/40" />
                    <p className="text-sm font-bold text-kiosk-navy">No upcoming appointments</p>
                    <p className="mt-1 text-xs font-medium text-foreground/45">Visit the kiosk to check in for today's OPD</p>
                  </div>
                ) : (
                  upcoming.map((apt) => (
                    <AppointmentCard key={apt.id} apt={apt} onSendReminder={handleSendReminder} />
                  ))
                )}
              </div>
            )}

            {/* ── Past appointments ───────────────────────────────────────── */}
            {activeTab === "history" && (
              <div className="space-y-4">
                {past.length === 0 ? (
                  <div className="rounded-2xl border border-border/40 bg-white/80 p-6 text-center">
                    <History size={32} className="mx-auto mb-2 text-foreground/20" />
                    <p className="text-sm font-bold text-kiosk-navy">No past appointments</p>
                  </div>
                ) : (
                  past.map((apt) => (
                    <PastAppointmentCard key={apt.id} apt={apt} onSendFollowUpReminder={handleSendReminder} />
                  ))
                )}
              </div>
            )}
          </>
        )}

        {/* ── Empty state / landing ──────────────────────────────────────── */}
        {!phone && appointments.length === 0 && (
          <div className="space-y-4">
            <div className="rounded-3xl border border-border/40 bg-white/80 p-6 text-center space-y-3">
              <div className="mx-auto grid size-16 place-items-center rounded-full bg-kiosk-teal/10">
                <Calendar size={28} className="text-kiosk-teal" />
              </div>
              <h2 className="text-xl font-black text-kiosk-navy">Your Health Portal</h2>
              <p className="text-sm font-medium leading-relaxed text-foreground/55 max-w-xs mx-auto">
                View your appointments, check your queue position, get reminders, and track follow-up visits.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { icon: <Timer size={20} />, title: "Live Queue", desc: "See your real-time position in the OPD queue", color: "text-kiosk-teal bg-kiosk-teal/10" },
                { icon: <Bell size={20} />,  title: "Reminders", desc: "Get SMS or email reminders before your visit", color: "text-kiosk-coral bg-kiosk-coral/10" },
                { icon: <History size={20} />, title: "Follow-ups", desc: "Track follow-up visits and doctor's notes", color: "text-kiosk-sky bg-kiosk-sky/10" },
              ].map(({ icon, title, desc, color }) => (
                <div key={title} className="rounded-2xl border border-border/40 bg-white/80 p-4 text-center">
                  <div className={`mx-auto mb-3 grid size-10 place-items-center rounded-xl ${color}`}>{icon}</div>
                  <p className="text-sm font-black text-kiosk-navy">{title}</p>
                  <p className="mt-1 text-xs font-medium text-foreground/50 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-center gap-2 text-xs font-semibold text-foreground/40">
              <ShieldCheck size={12} className="text-kiosk-green" />
              Your data is private and secure · Ayushman Bharat Digital Mission
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// ─── Appointment card (upcoming) ──────────────────────────────────────────────

function AppointmentCard({
  apt, onSendReminder,
}: {
  apt: Appointment;
  onSendReminder: (apt: Appointment, channel: ReminderChannel) => void;
}) {
  const [expanded, setExpanded] = useState(true);
  const [sending, setSending]   = useState(false);

  const isToday    = apt.date === new Date().toISOString().slice(0, 10);
  const isWaiting  = apt.status === "waiting" || apt.status === "in-progress";

  return (
    <div className={`rounded-3xl border-2 bg-white shadow-xl overflow-hidden ${isWaiting ? "border-kiosk-yellow/50" : "border-kiosk-teal/25"}`}>
      {/* Status bar */}
      <div className={`px-5 py-2.5 flex items-center justify-between ${isWaiting ? "bg-kiosk-yellow/15" : "bg-kiosk-teal/8"}`}>
        <span className={`flex items-center gap-1.5 text-xs font-black uppercase tracking-wide ${isWaiting ? "text-kiosk-navy" : "text-kiosk-teal"}`}>
          {isWaiting && <span className="size-2 rounded-full bg-kiosk-yellow animate-pulse" />}
          {apt.status.replace("-", " ")}
        </span>
        <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-black ${statusColor(apt.status)}`}>
          Token {apt.token}
        </span>
      </div>

      <div className="p-5">
        {/* Doctor + dept */}
        <div className="flex items-start gap-3 mb-4">
          <div className="grid size-11 place-items-center rounded-2xl bg-kiosk-teal/10 text-kiosk-teal shrink-0">
            <Stethoscope size={20} />
          </div>
          <div className="flex-1">
            <p className="text-base font-black text-kiosk-navy">{apt.doctor}</p>
            <p className="text-xs font-medium text-foreground/50">{apt.department}</p>
            <p className="text-xs font-medium text-foreground/50">{apt.complaint}</p>
          </div>
          <button onClick={() => setExpanded((e) => !e)}
            className="text-foreground/30 hover:text-kiosk-teal transition-colors">
            <ChevronRight size={18} className={`transition-transform ${expanded ? "rotate-90" : ""}`} />
          </button>
        </div>

        {/* Date + time */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center gap-2 rounded-xl bg-kiosk-teal/5 border border-kiosk-teal/15 px-3 py-2.5">
            <Calendar size={15} className="text-kiosk-teal shrink-0" />
            <div>
              <p className="text-[10px] font-black uppercase text-foreground/40">Date</p>
              <p className="text-sm font-black text-kiosk-navy">{isToday ? "Today" : apt.date}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-xl bg-kiosk-teal/5 border border-kiosk-teal/15 px-3 py-2.5">
            <Clock3 size={15} className="text-kiosk-teal shrink-0" />
            <div>
              <p className="text-[10px] font-black uppercase text-foreground/40">Time</p>
              <p className="text-sm font-black text-kiosk-navy">{apt.timeSlot}</p>
            </div>
          </div>
        </div>

        {/* Live queue position */}
        {isWaiting && (
          <div className="mb-4 rounded-2xl bg-gradient-to-r from-kiosk-yellow/20 to-kiosk-coral/10 border border-kiosk-yellow/30 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black uppercase tracking-wide text-kiosk-navy/70">Queue position</span>
              <span className="flex items-center gap-1 text-[10px] font-bold text-foreground/40">
                <RefreshCw size={10} /> Live
              </span>
            </div>
            <div className="flex items-end gap-3">
              <p className="text-5xl font-black text-kiosk-coral leading-none">#{apt.queuePosition}</p>
              <div className="mb-1">
                <p className="text-sm font-black text-kiosk-navy">{formatWait(apt.estimatedWait)} wait</p>
                <p className="text-[10px] font-medium text-foreground/45">Estimated based on current queue</p>
              </div>
            </div>
            {/* Queue visual */}
            <div className="mt-3 flex gap-1.5">
              {Array.from({ length: Math.min(apt.queuePosition + 2, 8) }).map((_, i) => (
                <div key={i} className={`h-2 flex-1 rounded-full ${i < apt.queuePosition ? "bg-kiosk-yellow" : "bg-border"}`} />
              ))}
            </div>
          </div>
        )}

        {/* Expanded details */}
        {expanded && (
          <div className="space-y-3 border-t border-border/40 pt-4">
            {/* Location */}
            <div className="flex items-center gap-2 text-sm text-foreground/60">
              <MapPin size={14} className="text-kiosk-coral shrink-0" />
              <span className="font-medium">City Hospital, OPD Block A · Ground Floor</span>
            </div>

            {/* Notes */}
            {apt.notes && (
              <div className="rounded-xl bg-kiosk-teal/5 border border-kiosk-teal/15 px-3 py-2.5">
                <p className="text-[10px] font-black uppercase text-kiosk-teal/70 mb-1">Doctor's note</p>
                <p className="text-sm font-medium text-kiosk-navy">{apt.notes}</p>
              </div>
            )}

            {/* Reminders sent */}
            {apt.reminders.length > 0 && (
              <div>
                <p className="text-[10px] font-black uppercase tracking-wide text-foreground/40 mb-2">Reminders</p>
                {apt.reminders.map((rem) => (
                  <div key={rem.id} className="flex items-center gap-2 text-xs text-foreground/55 mb-1">
                    {rem.status === "sent"
                      ? <CheckCircle2 size={12} className="text-kiosk-teal shrink-0" />
                      : <Timer size={12} className="text-kiosk-yellow shrink-0" />
                    }
                    <span className="font-medium capitalize">{rem.channel}</span>
                    <span className="text-foreground/35">—</span>
                    <span>{rem.status === "sent" ? "Sent" : `Scheduled ${new Date(rem.scheduledFor).toLocaleDateString()}`}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Send reminder buttons */}
            <div>
              <p className="text-[10px] font-black uppercase tracking-wide text-foreground/40 mb-2">Send reminder now</p>
              <div className="flex gap-2 flex-wrap">
                {(["sms", "email", "both"] as ReminderChannel[]).map((ch) => (
                  <button
                    key={ch}
                    disabled={sending}
                    onClick={async () => { setSending(true); await onSendReminder(apt, ch); setSending(false); }}
                    className="flex items-center gap-1.5 rounded-xl border border-kiosk-teal/30 bg-white px-3 py-1.5 text-xs font-bold text-kiosk-teal hover:bg-kiosk-teal/5 transition-colors disabled:opacity-50"
                  >
                    {ch === "sms"   && <Phone size={11} />}
                    {ch === "email" && <Mail size={11} />}
                    {ch === "both"  && <Bell size={11} />}
                    {ch === "sms" ? "SMS" : ch === "email" ? "Email" : "Both"}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Past appointment card ────────────────────────────────────────────────────

function PastAppointmentCard({
  apt, onSendFollowUpReminder,
}: {
  apt: Appointment;
  onSendFollowUpReminder: (apt: Appointment, channel: ReminderChannel) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const pendingFollowUps = apt.followUps.filter((f) => f.status === "scheduled");

  return (
    <div className="rounded-3xl border border-border/50 bg-white/90 shadow-sm overflow-hidden">
      <button onClick={() => setExpanded((e) => !e)}
        className="w-full px-5 py-4 flex items-center gap-3 text-left hover:bg-kiosk-teal/3 transition-colors">
        <div className={`grid size-10 shrink-0 place-items-center rounded-xl ${statusColor(apt.status)}`}>
          {apt.status === "completed" ? <Check size={16} /> : <X size={16} />}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-black text-kiosk-navy">{apt.doctor}</p>
          <p className="text-xs font-medium text-foreground/50">{apt.date} · {apt.timeSlot} · {apt.complaint}</p>
        </div>
        {pendingFollowUps.length > 0 && (
          <span className="shrink-0 rounded-full bg-kiosk-coral/15 border border-kiosk-coral/20 px-2 py-0.5 text-[10px] font-black text-kiosk-coral">
            {pendingFollowUps.length} follow-up
          </span>
        )}
        <ChevronRight size={16} className={`shrink-0 text-foreground/30 transition-transform ${expanded ? "rotate-90" : ""}`} />
      </button>

      {expanded && (
        <div className="border-t border-border/40 px-5 py-4 space-y-4">
          {apt.notes && (
            <div className="rounded-xl bg-kiosk-teal/5 border border-kiosk-teal/15 px-3 py-2.5">
              <p className="text-[10px] font-black uppercase text-kiosk-teal/70 mb-1">Doctor's notes</p>
              <p className="text-sm font-medium text-kiosk-navy leading-relaxed">{apt.notes}</p>
            </div>
          )}

          {apt.followUps.map((fu) => (
            <div key={fu.id} className={`rounded-2xl border p-4 ${fu.status === "completed" ? "border-kiosk-teal/20 bg-kiosk-teal/3" : "border-kiosk-coral/25 bg-kiosk-coral/5"}`}>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <p className="text-xs font-black uppercase tracking-wide text-kiosk-coral">Follow-up Visit</p>
                  <p className="text-sm font-black text-kiosk-navy mt-0.5">{fu.scheduledDate}</p>
                </div>
                <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-black ${fu.status === "completed" ? "bg-kiosk-teal/15 text-kiosk-teal" : "bg-kiosk-yellow/20 text-kiosk-navy"}`}>
                  {fu.status}
                </span>
              </div>
              <p className="text-xs font-medium text-foreground/60 mb-1">{fu.reason}</p>
              {fu.doctorNote && (
                <p className="text-xs font-medium text-kiosk-navy italic">{fu.doctorNote}</p>
              )}
              {/* Follow-up reminders */}
              {fu.reminders.map((rem) => (
                <div key={rem.id} className="mt-2 flex items-center gap-2 text-[11px] text-foreground/50">
                  {rem.status === "sent"
                    ? <CheckCircle2 size={11} className="text-kiosk-teal" />
                    : <Timer size={11} className="text-kiosk-yellow" />
                  }
                  <span className="font-medium">Reminder {rem.status === "sent" ? "sent" : `scheduled ${new Date(rem.scheduledFor).toLocaleDateString()}`}</span>
                </div>
              ))}
              {/* Resend reminder for pending follow-ups */}
              {fu.status === "scheduled" && (
                <div className="mt-3 flex gap-2">
                  {(["sms", "email"] as ReminderChannel[]).map((ch) => (
                    <button key={ch}
                      onClick={() => onSendFollowUpReminder(apt, ch)}
                      className="flex items-center gap-1 rounded-xl border border-kiosk-coral/30 bg-white px-2.5 py-1 text-[11px] font-bold text-kiosk-coral hover:bg-kiosk-coral/5 transition-colors">
                      {ch === "sms" ? <Phone size={10} /> : <Mail size={10} />}
                      Resend {ch.toUpperCase()}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Token badge */}
          <div className="flex items-center gap-2 text-xs text-foreground/40">
            <BadgeCheck size={13} className="text-kiosk-teal" />
            <span>Token {apt.token} · {apt.department}</span>
          </div>
        </div>
      )}
    </div>
  );
}

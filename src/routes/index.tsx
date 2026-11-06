/**
 * / — Patient Appointment Booking
 *
 * Primary flow (3 steps):
 *   1. Book  — name, phone, complaint, dept, date, time slot
 *   2. History (optional) — basic symptoms Q&A + document upload
 *   3. Confirm — review + submit â†’ appointment created + SMS sent
 *
 * Navigation links to:
 *   /portal  — patient checks own appointments + queue
 *   /staff   — staff manage schedule
 *   /doctor  — doctor dashboard (via doctorLogin view)
 */

import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Activity, AlertTriangle, ArrowLeft, ArrowRight, BadgeCheck,
  BarChart3, Bell, Brain, Calendar, Check, CheckCircle2,
  ChevronRight, CircleHelp, ClipboardList, Clock3,
  FileImage, FileText, HeartPulse, LogIn, Mail, Menu,
  Mic, Paperclip, Pencil, Phone, Plus, RefreshCw, Save,
  Settings, ShieldCheck, Smartphone, Stethoscope,
  Upload, UserRound, Users, Volume2, X,
} from "lucide-react";
import { extractDocument, type ExtractedInformation } from "@/lib/documentService";
import { speechToText, type SpeechState } from "@/lib/speechService";
import { speak, cancelSpeech } from "@/lib/ttsService";
import { languageOptions, makeT, type T, type Lang } from "@/lib/i18n";
import { demoConsultation } from "@/lib/consultationService";
import { demoPatients } from "@/lib/patientService";
import {
  createAppointment, portalUrl,
  type AppointmentStatus,
} from "@/lib/appointmentService";
import { QRCodeSVG } from "qrcode.react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sehat Setu — Book Your Appointment" },
      { name: "description", content: "Book a hospital appointment, check your queue position and get SMS reminders." },
      { property: "og:title", content: "Sehat Setu — Digital Health & Appointment System" },
      { property: "og:type", content: "website" },
    ],
  }),
  component: App,
});

// â”€â”€â”€ Types â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

type View =
  | "home"         // Landing — book or check appointment
  | "book"         // Step 1: quick booking form
  | "history"      // Step 2 (optional): symptoms + documents
  | "confirm"      // Step 3: review + submit
  | "success"      // Booking confirmed
  | "doctorLogin"  // Doctor portal entry
  | "dashboard"    // Doctor queue
  | "case";        // Individual doctor case

type Complaint = "Fever" | "Abdominal pain" | "Headache" | "Cough" | "Chest pain";

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
  "08:00 AM","08:30 AM","09:00 AM","09:30 AM","10:00 AM","10:30 AM",
  "11:00 AM","11:30 AM","12:00 PM","02:00 PM","02:30 PM","03:00 PM",
  "03:30 PM","04:00 PM","04:30 PM","05:00 PM",
];

const COMPLAINTS_LIST = [
  "Fever","Abdominal pain","Headache","Cough","Chest pain",
  "Back pain","Joint pain","Skin rash","Eye problem","Ear problem",
  "General check-up","Follow-up visit","Other",
];

// Adaptive symptom questions
const interviewQuestions: Record<Complaint, { question: string; choices?: string[] }[]> = {
  Fever: [
    { question: "When did the fever start?", choices: ["Today","Yesterday","A few days ago"] },
    { question: "How high was the fever?", choices: ["Mild","High","I do not know"] },
    { question: "Do you have body pain?", choices: ["No","Yes"] },
    { question: "Do you have vomiting?", choices: ["No","Yes"] },
  ],
  "Abdominal pain": [
    { question: "Where is the pain?", choices: ["Upper abdomen","Around the navel","Lower abdomen","All over"] },
    { question: "When did it start?", choices: ["Today","Yesterday","A few days ago","More than a week ago"] },
    { question: "How severe?", choices: ["Mild","Moderate","Severe"] },
    { question: "Do you have vomiting?", choices: ["No","Yes"] },
  ],
  Headache: [
    { question: "Where is the pain?", choices: ["Front","Back","One side","All over"] },
    { question: "How severe?", choices: ["Mild","Moderate","Severe"] },
    { question: "Do you feel dizzy?", choices: ["No","Yes"] },
  ],
  Cough: [
    { question: "When did it start?", choices: ["Today","A few days ago","More than a week ago"] },
    { question: "Is there mucus?", choices: ["No","Yes","Not sure"] },
    { question: "Do you have fever?", choices: ["No","Yes"] },
  ],
  "Chest pain": [
    { question: "How severe?", choices: ["Mild","Moderate","Severe"] },
    { question: "Do you feel breathless?", choices: ["No","Yes"] },
    { question: "Does it spread to arm or jaw?", choices: ["No","Yes"] },
  ],
};

const defaultPatient = demoPatients[0] ?? {
  token: "A-102", name: "Demo", age: "52", gender: "Male",
  complaint: "Abdominal pain", status: "Ready" as const, submitted: "09:42",
};

// â”€â”€â”€ App shell â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function App() {
  const [view, setView]   = useState<View>("home");
  const [lang, setLang]   = useState<Lang>("en");
  const t = makeT(lang);

  // Booking form state
  const [form, setForm] = useState({
    name: "", age: "", gender: "Male", phone: "", email: "",
    complaint: "Fever", department: "OPD — General",
    doctor: "Dr. M. Rao",
    date: new Date().toISOString().slice(0, 10),
    timeSlot: "09:00 AM",
  });
  const [includeHistory, setIncludeHistory] = useState(false);

  // History / symptom state
  const [questionIndex, setQuestionIndex]   = useState(0);
  const [answers, setAnswers]               = useState<Record<number, string>>({});
  const [speechState, setSpeechState]       = useState<SpeechState>("idle");
  const [transcription, setTranscription]   = useState("");
  const [pendingVoice, setPendingVoice]     = useState<string | null>(null);
  const [documents, setDocuments]           = useState<string[]>([]);
  const [processing, setProcessing]         = useState(false);
  const [extracted, setExtracted]           = useState<ExtractedInformation | null>(null);

  // Success state
  const [bookedApt, setBookedApt]           = useState<{ token: string; id: string; queuePosition: number; estimatedWait: number } | null>(null);
  const [bookError, setBookError]           = useState<string | null>(null);
  const [booking, setBooking]               = useState(false);

  // Doctor shell
  const [selectedPatient, setSelectedPatient] = useState(defaultPatient.token);
  const selectedCase = selectedPatient === "A-102"
    ? demoConsultation
    : { ...demoConsultation, ...(demoPatients.find((p) => p.token === selectedPatient) ?? defaultPatient) };

  const fSet = <K extends keyof typeof form>(k: K, v: typeof form[K]) =>
    setForm((p) => ({ ...p, [k]: v }));

  const complaint = form.complaint as Complaint;
  const questions = interviewQuestions[complaint] ?? [];
  const currentQ  = questions[questionIndex] ?? { question: "Anything else to tell your doctor?", choices: [] };
  const hasRedFlag = form.complaint === "Chest pain" &&
    Object.values(answers).some((a) => ["Severe","Yes"].includes(a));

  const resetAll = () => {
    setView("home");
    setForm({ name:"",age:"",gender:"Male",phone:"",email:"",complaint:"Fever",department:"OPD — General",doctor:"Dr. M. Rao",date:new Date().toISOString().slice(0,10),timeSlot:"09:00 AM" });
    setIncludeHistory(false); setQuestionIndex(0); setAnswers({}); setSpeechState("idle");
    setTranscription(""); setPendingVoice(null); setDocuments([]); setProcessing(false);
    setExtracted(null); setBookedApt(null); setBookError(null);
    cancelSpeech();
  };

  const handleSubmit = async () => {
    setBooking(true); setBookError(null);
    // Check slot capacity from staff settings
    let capacity = 10;
    try { capacity = parseInt(localStorage.getItem("mediease_slot_capacity") || "10", 10); } catch { /* noop */ }
    const { getAppointments } = await import("@/lib/appointmentService");
    const allAppts = await getAppointments();
    const sameSlot = allAppts.filter((a) => a.date === form.date && a.timeSlot === form.timeSlot && !["cancelled","no-show","completed"].includes(a.status));
    if (sameSlot.length >= capacity) {
      setBookError(`This time slot (${form.timeSlot}) is full. Please choose a different time slot.`);
      setBooking(false);
      return;
    }
    try {
      const apt = await createAppointment({
        patientName: form.name, patientAge: form.age, patientGender: form.gender,
        phone: form.phone, email: form.email, complaint: form.complaint,
        department: form.department, doctor: form.doctor,
        date: form.date, timeSlot: form.timeSlot,
        status: "scheduled" as AppointmentStatus,
        queuePosition: 0, estimatedWait: 0,
        notes: Object.entries(answers).map(([i, a]) => `Q${+i+1}: ${a}`).join("; "),
      });
      // Auto-send SMS
      await fetch("/api/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appointmentId: apt.id, channel: "sms", phone: form.phone,
          message: `Appointment confirmed at City Hospital. Token: ${apt.token}. ${apt.doctor}, ${apt.department}. ${apt.date} at ${apt.timeSlot}. Check queue: ${window.location.origin}/portal?phone=${encodeURIComponent(form.phone)}`,
        }),
      }).catch(() => {});
      setBookedApt({ token: apt.token, id: apt.id, queuePosition: apt.queuePosition, estimatedWait: apt.estimatedWait });
      setView("success");
    } catch {
      setBookError("Booking failed. Please try again.");
    }
    setBooking(false);
  };

  const startSpeech = async () => {
    setSpeechState("listening"); setPendingVoice(null);
    const result = await speechToText(lang, setSpeechState);
    const rawText = result.text.trim();
    setTranscription(rawText); setSpeechState("result");
    const choices = currentQ.choices ?? [];
    if (choices.length > 0 && rawText) {
      const norm = rawText.toLowerCase();
      const matched = choices.find((c) => {
        const tr = t(c).toLowerCase();
        return norm === tr || tr.includes(norm) || norm.includes(tr) ||
          c.toLowerCase().includes(norm) || norm.includes(c.toLowerCase());
      });
      if (matched) { setAnswers((a) => ({ ...a, [questionIndex]: matched })); setPendingVoice(null); }
      else setPendingVoice(rawText);
    } else if (rawText) setAnswers((a) => ({ ...a, [questionIndex]: rawText }));
  };

  const processDocuments = async () => {
    setProcessing(true);
    const r = await extractDocument(documents[0] ?? "demo.pdf");
    setExtracted(r); setProcessing(false);
  };

  // Doctor shell
  if (["doctorLogin","dashboard","case"].includes(view)) {
    return <DoctorShell view={view} setView={setView}
      selectedPatient={selectedPatient} setSelectedPatient={setSelectedPatient}
      selectedCase={selectedCase} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 text-foreground">
      {/* â”€â”€ Header â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <header className="sticky top-0 z-30 border-b border-border/40 bg-white/95 backdrop-blur-sm shadow-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
          <a href="/" className="flex items-center gap-2.5 no-underline">
            <img src="/logo.png" alt="Sehat Setu" className="size-9 rounded-xl object-contain" />
            <div>
              <p className="text-base font-black tracking-tight text-kiosk-navy">Sehat Setu</p>
              <p className="text-[9px] font-semibold uppercase tracking-widest text-kiosk-teal/70">Digital Health & Appointment System</p>
            </div>
          </a>
          <nav className="flex items-center gap-1 sm:gap-2">
            {/* Language picker */}
            <div className="hidden sm:flex gap-1">
              {languageOptions.map((opt) => (
                <button key={opt.code} onClick={() => setLang(opt.code)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-all ${lang === opt.code ? "bg-kiosk-teal text-white" : "text-foreground/50 hover:text-kiosk-navy hover:bg-gray-100"}`}>
                  {opt.label}
                </button>
              ))}
            </div>
            <div className="h-4 w-px bg-border/50 hidden sm:block" />
            <a href="/portal" className="flex items-center gap-1.5 rounded-xl border border-border/50 bg-white px-3 py-1.5 text-xs font-bold text-kiosk-navy hover:border-kiosk-teal/40 hover:bg-kiosk-teal/5 transition-colors">
              <HeartPulse size={12} className="text-kiosk-teal" />
              <span className="hidden sm:inline">My Appointments</span>
              <span className="sm:hidden">Portal</span>
            </a>
            <a href="/staff" className="flex items-center gap-1.5 rounded-xl border border-border/50 bg-white px-3 py-1.5 text-xs font-bold text-kiosk-navy hover:border-kiosk-teal/40 hover:bg-kiosk-teal/5 transition-colors">
              <UserRound size={12} className="text-kiosk-teal" />
              <span className="hidden sm:inline">Staff</span>
            </a>
            <button onClick={() => setView("doctorLogin")}
              className="flex items-center gap-1.5 rounded-xl border border-border/50 bg-white px-3 py-1.5 text-xs font-bold text-kiosk-navy hover:border-kiosk-teal/40 hover:bg-kiosk-teal/5 transition-colors">
              <Stethoscope size={12} className="text-kiosk-teal" />
              <span className="hidden sm:inline">Doctor</span>
            </button>
          </nav>
        </div>
      </header>

      {/* â”€â”€ Content â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 pb-16">
        {view === "home"    && <HomeView t={t} lang={lang} setLang={setLang} onBook={() => setView("book")} />}
        {view === "book"    && (
          <BookStep t={t} form={form} fSet={fSet} includeHistory={includeHistory}
            setIncludeHistory={setIncludeHistory}
            onBack={() => setView("home")}
            onNext={() => setView(includeHistory ? "history" : "confirm")} />
        )}
        {view === "history" && (
          <HistoryStep t={t} lang={lang} complaint={complaint} questions={questions}
            currentQ={currentQ} questionIndex={questionIndex} answers={answers}
            setAnswer={(a) => { setAnswers((prev) => ({ ...prev, [questionIndex]: a })); setPendingVoice(null); }}
            onNextQuestion={() => setQuestionIndex((i) => i + 1)}
            onPrevQuestion={() => setQuestionIndex((i) => Math.max(0, i - 1))}
            pendingVoice={pendingVoice} onConfirmVoice={() => { if (pendingVoice) { setAnswers((a) => ({ ...a, [questionIndex]: pendingVoice })); setPendingVoice(null); } }}
            onRejectVoice={() => { setPendingVoice(null); setSpeechState("idle"); }}
            speechState={speechState} transcription={transcription} startSpeech={startSpeech}
            hasRedFlag={hasRedFlag} documents={documents} setDocuments={setDocuments}
            processing={processing} processDocuments={processDocuments} extracted={extracted}
            onBack={() => setView("book")} onNext={() => setView("confirm")}
          />
        )}
        {view === "confirm" && (
          <ConfirmStep t={t} form={form} answers={answers} questions={questions}
            documents={documents} extracted={extracted}
            booking={booking} error={bookError}
            onBack={() => setView(includeHistory ? "history" : "book")}
            onSubmit={handleSubmit} />
        )}
        {view === "success" && bookedApt && (
          <SuccessView t={t} name={form.name} phone={form.phone} apt={bookedApt}
            form={form} onNewBooking={resetAll} />
        )}
      </main>

      {/* â”€â”€ Footer â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <footer className="border-t border-border/40 bg-white py-4 text-center">
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-foreground/40">
          <span>This system does not provide medical diagnosis.</span>
        </div>
      </footer>
    </div>
  );
}

// â”€â”€â”€ Step 0: Home / Landing â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function HomeView({ t, lang, setLang, onBook }: { t: T; lang: Lang; setLang: (l: Lang) => void; onBook: () => void }) {
  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="text-center space-y-3 pt-4">
        <div className="inline-flex items-center gap-2 rounded-full bg-kiosk-teal/10 border border-kiosk-teal/20 px-4 py-1.5 text-xs font-bold text-kiosk-teal">
          <span className="size-1.5 rounded-full bg-kiosk-teal animate-pulse" /> City Hospital OPD
        </div>
        <h1 className="text-4xl font-black tracking-tight text-kiosk-navy sm:text-5xl">
          Book your<br />appointment online
        </h1>
        <p className="text-base font-medium text-foreground/55 max-w-md mx-auto leading-relaxed">
          Book in seconds, track your queue position live, and get reminders on your phone — no waiting at the counter.
        </p>

        {/* Language selector */}
        <div className="flex justify-center gap-2 pt-1">
          {languageOptions.map((opt) => (
            <button key={opt.code} onClick={() => setLang(opt.code)}
              className={`rounded-xl px-4 py-2 text-sm font-black transition-all ${lang === opt.code ? "bg-kiosk-teal text-white shadow-lg shadow-kiosk-teal/30" : "border border-border/60 bg-white text-kiosk-navy hover:border-kiosk-teal/40"}`}>
              {opt.label}
            </button>
          ))}
        </div>

        <Button onClick={onBook}
          className="mt-2 min-h-14 px-10 rounded-2xl bg-kiosk-coral text-lg font-black text-white shadow-xl shadow-kiosk-coral/30 hover:bg-kiosk-coral/90 transition-all">
          {t("Start")} <ChevronRight size={22} />
        </Button>
        <p className="text-xs font-medium text-foreground/40">Takes less than 2 minutes</p>
      </div>

      {/* Feature cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { icon: <Calendar size={22} />, title: "Quick Booking",     desc: "Book an OPD appointment in under 2 minutes with just your name and phone number.", color: "text-kiosk-teal bg-kiosk-teal/10" },
          { icon: <Bell size={22} />,     title: "SMS Reminders",     desc: "Get automatic SMS reminders the day before and on the morning of your visit.",      color: "text-kiosk-coral bg-kiosk-coral/10" },
          { icon: <Clock3 size={22} />,   title: "Live Queue",        desc: "Track your real-time queue position and estimated wait from your phone.",           color: "text-kiosk-sky bg-kiosk-sky/10" },
        ].map(({ icon, title, desc, color }) => (
          <div key={title} className="rounded-2xl border border-border/50 bg-white p-5 shadow-sm">
            <div className={`mb-3 grid size-11 place-items-center rounded-xl ${color}`}>{icon}</div>
            <p className="text-sm font-black text-kiosk-navy">{title}</p>
            <p className="mt-1.5 text-xs font-medium text-foreground/55 leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>

      {/* Already have appointment? */}
      <div className="rounded-2xl border border-kiosk-teal/20 bg-white p-5 flex items-center gap-4 shadow-sm">
        <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-kiosk-teal/10 text-kiosk-teal">
          <HeartPulse size={20} />
        </div>
        <div className="flex-1">
          <p className="text-sm font-black text-kiosk-navy">Already have an appointment?</p>
          <p className="text-xs font-medium text-foreground/50">Check your queue position, reminders and follow-up visits.</p>
        </div>
        <a href="/portal"
          className="shrink-0 flex items-center gap-1.5 rounded-xl bg-kiosk-teal px-4 py-2 text-sm font-black text-white shadow-lg shadow-kiosk-teal/25 hover:bg-kiosk-teal/90 transition-colors">
          My Portal <ArrowRight size={14} />
        </a>
      </div>
    </div>
  );
}

// â”€â”€â”€ Step 1: Book â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function BookStep({ t, form, fSet, includeHistory, setIncludeHistory, onBack, onNext }: {
  t: T;
  form: { name: string; age: string; gender: string; phone: string; email: string;
          complaint: string; department: string; doctor: string; date: string; timeSlot: string };
  fSet: <K extends keyof typeof form>(k: K, v: typeof form[K]) => void;
  includeHistory: boolean; setIncludeHistory: (v: boolean) => void;
  onBack: () => void; onNext: () => void;
}) {
  const [error, setError] = useState<string | null>(null);
  const availableDoctors = DOCTORS[form.department] ?? ["Dr. M. Rao"];

  const handleNext = () => {
    if (!form.name.trim()) { setError("Please enter patient name."); return; }
    if (form.phone.length < 10) { setError("Please enter a valid 10-digit mobile number."); return; }
    setError(null); onNext();
  };

  return (
    <div className="space-y-6">
      {/* Progress */}
      <StepBar current={1} total={includeHistory ? 3 : 2} />

      <div>
        <h1 className="text-2xl font-black text-kiosk-navy">Book Appointment</h1>
        <p className="text-sm font-medium text-foreground/50 mt-1">Fill in your details to book an OPD appointment.</p>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm font-bold text-red-600">
          <AlertTriangle size={14} /> {error}
        </div>
      )}

      {/* Patient info */}
      <div className="rounded-2xl border border-border/50 bg-white p-5 shadow-sm space-y-4">
        <p className="text-xs font-black uppercase tracking-wide text-foreground/40 border-b border-border/40 pb-2.5">Your Details</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="text-[11px] font-black uppercase tracking-wide text-foreground/50">{t("Your name")} *</label>
            <Input value={form.name} onChange={(e) => fSet("name", e.target.value)}
              placeholder={t("Type your name")}
              className="mt-1.5 rounded-xl border-border/60 focus-visible:ring-kiosk-teal" />
          </div>
          <div>
            <label className="text-[11px] font-black uppercase tracking-wide text-foreground/50">{t("Your age")}</label>
            <Input inputMode="numeric" value={form.age} onChange={(e) => fSet("age", e.target.value.replace(/\D/g,""))}
              placeholder={t("Example: 52")}
              className="mt-1.5 rounded-xl border-border/60 focus-visible:ring-kiosk-teal" />
          </div>
          <div>
            <label className="text-[11px] font-black uppercase tracking-wide text-foreground/50">{t("I am")}</label>
            <div className="mt-1.5 flex gap-2">
              {["Male","Female","Other"].map((g) => (
                <button key={g} onClick={() => fSet("gender", g)}
                  className={`flex-1 rounded-xl py-2 text-xs font-bold transition-all ${form.gender === g ? "bg-kiosk-teal text-white shadow-sm" : "border border-border/50 text-foreground/60 hover:border-kiosk-teal/40"}`}>
                  {t(g)}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-[11px] font-black uppercase tracking-wide text-foreground/50">
              <span className="flex items-center gap-1"><Phone size={10} /> Mobile * (SMS reminders)</span>
            </label>
            <Input inputMode="numeric" value={form.phone} onChange={(e) => fSet("phone", e.target.value.replace(/\D/g,"").slice(0,10))}
              placeholder="10-digit mobile number" maxLength={10}
              className="mt-1.5 rounded-xl border-border/60 focus-visible:ring-kiosk-teal" />
          </div>
          <div>
            <label className="text-[11px] font-black uppercase tracking-wide text-foreground/50">
              <span className="flex items-center gap-1"><Mail size={10} /> Email (optional)</span>
            </label>
            <Input type="email" value={form.email} onChange={(e) => fSet("email", e.target.value)}
              placeholder="For email reminders"
              className="mt-1.5 rounded-xl border-border/60 focus-visible:ring-kiosk-teal" />
          </div>
        </div>
      </div>

      {/* Appointment details */}
      <div className="rounded-2xl border border-border/50 bg-white p-5 shadow-sm space-y-4">
        <p className="text-xs font-black uppercase tracking-wide text-foreground/40 border-b border-border/40 pb-2.5">Appointment Details</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-[11px] font-black uppercase tracking-wide text-foreground/50">Chief Complaint</label>
            <select value={form.complaint} onChange={(e) => fSet("complaint", e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-border/60 bg-white px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-kiosk-teal/30">
              {COMPLAINTS_LIST.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[11px] font-black uppercase tracking-wide text-foreground/50">Department</label>
            <select value={form.department}
              onChange={(e) => { fSet("department", e.target.value); fSet("doctor", DOCTORS[e.target.value]?.[0] ?? "Dr. M. Rao"); }}
              className="mt-1.5 w-full rounded-xl border border-border/60 bg-white px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-kiosk-teal/30">
              {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[11px] font-black uppercase tracking-wide text-foreground/50">Doctor</label>
            <select value={form.doctor} onChange={(e) => fSet("doctor", e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-border/60 bg-white px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-kiosk-teal/30">
              {(DOCTORS[form.department] ?? ["Dr. M. Rao"]).map((d) => <option key={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[11px] font-black uppercase tracking-wide text-foreground/50">Preferred Date</label>
            <Input type="date" value={form.date} onChange={(e) => fSet("date", e.target.value)}
              min={new Date().toISOString().slice(0,10)}
              className="mt-1.5 rounded-xl border-border/60 focus-visible:ring-kiosk-teal" />
          </div>
          <div className="sm:col-span-2">
            <label className="text-[11px] font-black uppercase tracking-wide text-foreground/50">Time Slot</label>
            <div className="mt-1.5 flex flex-wrap gap-2">
              {TIME_SLOTS.map((slot) => (
                <button key={slot} onClick={() => fSet("timeSlot", slot)}
                  className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${form.timeSlot === slot ? "bg-kiosk-teal text-white shadow-sm" : "border border-border/50 text-foreground/60 hover:border-kiosk-teal/40"}`}>
                  {slot}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Optional medical history toggle */}
      <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-kiosk-teal/20 bg-kiosk-teal/3 p-4 hover:bg-kiosk-teal/5 transition-colors">
        <Checkbox checked={includeHistory} onCheckedChange={(v) => setIncludeHistory(v === true)}
          className="mt-0.5 size-5 border-kiosk-teal data-[state=checked]:bg-kiosk-teal" />
        <div>
          <p className="text-sm font-black text-kiosk-navy">Add medical history (optional)</p>
          <p className="text-xs font-medium text-foreground/50 mt-0.5">
            Answer a few symptom questions and upload documents so your doctor is prepared. Takes ~2 minutes.
          </p>
        </div>
      </label>

      {/* Nav */}
      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="rounded-2xl px-5 font-bold border-border">
          <ArrowLeft size={16} /> Back
        </Button>
        <Button onClick={handleNext} className="flex-1 min-h-12 rounded-2xl bg-kiosk-teal font-black text-white shadow-lg shadow-kiosk-teal/25 hover:bg-kiosk-teal/90">
          {includeHistory ? "Next: Add history" : "Review & confirm"} <ArrowRight size={16} />
        </Button>
      </div>
    </div>
  );
}

// â”€â”€â”€ Step 2: History (optional) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function HistoryStep({ t, lang, complaint, questions, currentQ, questionIndex, answers,
  setAnswer, onNextQuestion, onPrevQuestion, pendingVoice, onConfirmVoice, onRejectVoice,
  speechState, transcription, startSpeech, hasRedFlag,
  documents, setDocuments, processing, processDocuments, extracted,
  onBack, onNext,
}: {
  t: T; lang: Lang; complaint: Complaint;
  questions: { question: string; choices?: string[] }[];
  currentQ: { question: string; choices?: string[] };
  questionIndex: number; answers: Record<number, string>;
  setAnswer: (a: string) => void;
  onNextQuestion: () => void;
  onPrevQuestion: () => void;
  pendingVoice: string | null; onConfirmVoice: () => void; onRejectVoice: () => void;
  speechState: SpeechState; transcription: string; startSpeech: () => void;
  hasRedFlag: boolean;
  documents: string[]; setDocuments: React.Dispatch<React.SetStateAction<string[]>>;
  processing: boolean; processDocuments: () => void;
  extracted: ExtractedInformation | null;
  onBack: () => void; onNext: () => void;
}) {
  const [tab, setTab] = useState<"symptoms" | "docs">("symptoms");
  const total = questions.length;

  return (
    <div className="space-y-5">
      <StepBar current={2} total={3} />

      <div>
        <h1 className="text-2xl font-black text-kiosk-navy">Medical History</h1>
        <p className="text-sm font-medium text-foreground/50 mt-1">Optional — helps your doctor prepare before your visit.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 rounded-xl bg-gray-100 p-1 w-fit">
        {(["symptoms","docs"] as const).map((tb) => (
          <button key={tb} onClick={() => setTab(tb)}
            className={`rounded-lg px-4 py-1.5 text-sm font-bold capitalize transition-all ${tab === tb ? "bg-white text-kiosk-navy shadow-sm" : "text-foreground/50"}`}>
            {tb === "symptoms" ? `Symptoms (${total}Q)` : "Documents"}
          </button>
        ))}
      </div>

      {tab === "symptoms" && (
        <div className="rounded-2xl border border-border/50 bg-white p-5 shadow-sm space-y-4">
          {/* Progress */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-xs font-black text-kiosk-navy">{t(currentQ.question)}</p>
              <span className="text-[11px] font-bold text-foreground/40">{questionIndex + 1}/{total}</span>
            </div>
            <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
              <div className="h-full rounded-full bg-kiosk-teal transition-all" style={{ width: `${((questionIndex+1)/total)*100}%` }} />
            </div>
          </div>

          {/* Choices */}
          {currentQ.choices && (
            <div className="grid gap-2 sm:grid-cols-2">
              {currentQ.choices.map((choice) => (
                <button key={choice} onClick={() => setAnswer(choice)}
                  className={`flex items-center gap-2.5 min-h-12 rounded-xl border-2 px-4 text-left text-sm font-bold transition-all ${answers[questionIndex] === choice ? "border-kiosk-teal bg-kiosk-teal/8 text-kiosk-navy" : "border-border/50 bg-white text-kiosk-navy hover:border-kiosk-teal/40"}`}>
                  <div className={`size-4 rounded-full border-2 shrink-0 flex items-center justify-center ${answers[questionIndex] === choice ? "border-kiosk-teal bg-kiosk-teal" : "border-border"}`}>
                    {answers[questionIndex] === choice && <Check size={9} className="text-white" strokeWidth={3} />}
                  </div>
                  {t(choice)}
                </button>
              ))}
            </div>
          )}

          {/* Voice confirmation */}
          {pendingVoice && (
            <div className="rounded-xl border-2 border-kiosk-yellow/40 bg-kiosk-yellow/8 p-4">
              <p className="text-xs font-black text-kiosk-yellow/80 mb-1">ðŸŽ™ {t("Did you mean this?")}</p>
              <p className="text-base font-black text-kiosk-navy">"{pendingVoice}"</p>
              <div className="mt-3 flex gap-2">
                <Button size="sm" onClick={onConfirmVoice} className="flex-1 rounded-xl bg-kiosk-teal text-white font-black hover:bg-kiosk-teal/90">
                  <Check size={13} /> {t("Yes, that's correct")}
                </Button>
                <Button size="sm" variant="outline" onClick={onRejectVoice} className="flex-1 rounded-xl font-bold">
                  <RefreshCw size={12} /> {t("Try again")}
                </Button>
              </div>
            </div>
          )}

          {/* Mic */}
          <div className="flex items-center gap-3 rounded-xl bg-gray-50 border border-border/40 p-3">
            <button onClick={startSpeech} disabled={speechState === "listening" || speechState === "processing"}
              aria-label="Speak"
              className={`size-11 shrink-0 rounded-full text-white flex items-center justify-center shadow-lg transition-all disabled:opacity-60 ${speechState === "listening" ? "bg-kiosk-coral ring-4 ring-kiosk-coral/25 scale-110" : "bg-kiosk-coral hover:scale-105"}`}>
              <Mic size={18} />
            </button>
            <div>
              <p className="text-sm font-bold text-kiosk-navy">
                {speechState === "listening" ? t("Listening…") : speechState === "processing" ? t("Understanding…") : "Speak your answer"}
              </p>
              {transcription && <p className="text-xs text-foreground/50">{transcription}</p>}
            </div>
          </div>

          {/* Red flag */}
          {hasRedFlag && (
            <div className="flex items-start gap-3 rounded-xl border-2 border-kiosk-coral/30 bg-kiosk-coral/5 p-4">
              <AlertTriangle size={18} className="shrink-0 text-kiosk-coral mt-0.5" />
              <div>
                <p className="text-sm font-black text-kiosk-navy">{t("Potential red flag detected.")}</p>
                <p className="text-xs font-medium text-foreground/65">{t("Please alert medical staff. This is not a diagnosis.")}</p>
              </div>
            </div>
          )}

          {/* Q navigation */}
          <div className="flex gap-2">
            {questionIndex > 0 && (
              <Button variant="outline" onClick={onPrevQuestion} className="rounded-xl px-4 font-bold">
                <ArrowLeft size={14} />
              </Button>
            )}
            <Button
              onClick={() => {
                if (questionIndex < total - 1) {
                  onNextQuestion();
                } else {
                  setTab("docs");
                }
              }}
              disabled={!answers[questionIndex]}
              className="flex-1 rounded-xl bg-kiosk-teal text-white font-black hover:bg-kiosk-teal/90 disabled:opacity-40">
              {questionIndex < total - 1 ? "Next question" : "Done — add documents"} <ArrowRight size={14} />
            </Button>
          </div>
        </div>
      )}

      {tab === "docs" && (
        <div className="rounded-2xl border border-border/50 bg-white p-5 shadow-sm space-y-4">
          <p className="text-sm font-medium text-foreground/60">Upload prescriptions, lab reports or any previous records (optional).</p>
          <label className="flex min-h-24 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-kiosk-teal/35 bg-kiosk-teal/3 text-center hover:border-kiosk-teal/60 hover:bg-kiosk-teal/5 transition-all">
            <Upload className="mb-1 text-kiosk-teal" size={22} />
            <span className="text-sm font-bold text-kiosk-navy">Tap to upload</span>
            <span className="text-xs text-foreground/40">PDF · JPG · PNG</span>
            <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) setDocuments((d) => [...d, f.name]); }} />
          </label>
          {documents.map((doc, i) => (
            <div key={i} className="flex items-center gap-3 rounded-xl border border-border/40 bg-white p-3">
              {doc.endsWith(".pdf") ? <FileText size={16} className="text-kiosk-teal" /> : <FileImage size={16} className="text-kiosk-teal" />}
              <span className="flex-1 text-sm font-bold text-kiosk-navy truncate">{doc}</span>
              <button onClick={() => setDocuments((d) => d.filter((_,j) => j !== i))} className="text-foreground/30 hover:text-kiosk-coral"><X size={14} /></button>
            </div>
          ))}
          {documents.length > 0 && !extracted && (
            <Button onClick={processDocuments} disabled={processing} variant="outline"
              className="w-full rounded-xl font-bold border-kiosk-teal/40 text-kiosk-navy hover:bg-kiosk-teal/5">
              {processing ? <><RefreshCw size={14} className="animate-spin" /> Extracting…</> : "Extract information from documents"}
            </Button>
          )}
          {extracted && (
            <div className="rounded-xl bg-kiosk-teal/5 border border-kiosk-teal/20 p-3 space-y-1">
              <p className="text-[11px] font-black uppercase text-kiosk-teal">Extracted</p>
              {extracted.conditions.length > 0 && <p className="text-xs font-medium text-kiosk-navy">Conditions: {extracted.conditions.join(", ")}</p>}
              {extracted.medications.length > 0 && <p className="text-xs font-medium text-kiosk-navy">Medicines: {extracted.medications.join(", ")}</p>}
            </div>
          )}
        </div>
      )}

      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="rounded-2xl px-5 font-bold border-border">
          <ArrowLeft size={16} /> Back
        </Button>
        <Button onClick={onNext} className="flex-1 min-h-12 rounded-2xl bg-kiosk-teal font-black text-white shadow-lg shadow-kiosk-teal/25 hover:bg-kiosk-teal/90">
          Review & confirm <ArrowRight size={16} />
        </Button>
      </div>
    </div>
  );
}

// â”€â”€â”€ Step 3: Confirm â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function ConfirmStep({ t, form, answers, questions, documents, extracted, booking, error, onBack, onSubmit }: {
  t: T;
  form: { name: string; age: string; gender: string; phone: string; email: string;
          complaint: string; department: string; doctor: string; date: string; timeSlot: string };
  answers: Record<number, string>;
  questions: { question: string; choices?: string[] }[];
  documents: string[]; extracted: ExtractedInformation | null;
  booking: boolean; error: string | null;
  onBack: () => void; onSubmit: () => void;
}) {
  const rows = [
    { label: "Patient",    value: `${form.name}${form.age ? `, ${form.age}y` : ""}${form.gender ? ` · ${form.gender}` : ""}` },
    { label: "Mobile",     value: form.phone },
    { label: "Complaint",  value: form.complaint },
    { label: "Department", value: form.department },
    { label: "Doctor",     value: form.doctor },
    { label: "Date",       value: form.date === new Date().toISOString().slice(0,10) ? `Today, ${form.date}` : form.date },
    { label: "Time",       value: form.timeSlot },
  ];

  return (
    <div className="space-y-5">
      <StepBar current={questions.length > 0 ? 3 : 2} total={questions.length > 0 ? 3 : 2} />
      <div>
        <h1 className="text-2xl font-black text-kiosk-navy">Confirm Appointment</h1>
        <p className="text-sm font-medium text-foreground/50 mt-1">Review your details before confirming.</p>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm font-bold text-red-600">
          <AlertTriangle size={14} /> {error}
        </div>
      )}

      <div className="rounded-2xl border border-border/50 bg-white p-5 shadow-sm space-y-3">
        {rows.map(({ label, value }) => value && (
          <div key={label} className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-black uppercase tracking-wide text-foreground/40 shrink-0">{label}</span>
            <span className="text-sm font-bold text-kiosk-navy text-right">{value}</span>
          </div>
        ))}
        {form.email && (
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-black uppercase text-foreground/40">Email</span>
            <span className="text-sm font-bold text-kiosk-navy">{form.email}</span>
          </div>
        )}
      </div>

      {/* Symptom summary */}
      {Object.keys(answers).length > 0 && (
        <div className="rounded-2xl border border-border/50 bg-white p-5 shadow-sm space-y-2">
          <p className="text-xs font-black uppercase text-foreground/40 pb-1 border-b border-border/40">Symptom answers</p>
          {questions.map((q, i) => answers[i] && (
            <div key={i} className="flex gap-2 text-xs">
              <span className="font-medium text-foreground/55 flex-1">{q.question}</span>
              <span className="font-bold text-kiosk-navy shrink-0">{answers[i]}</span>
            </div>
          ))}
        </div>
      )}

      {/* Documents */}
      {documents.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {documents.map((d) => (
            <span key={d} className="flex items-center gap-1.5 rounded-xl border border-kiosk-teal/20 bg-kiosk-teal/5 px-3 py-1.5 text-xs font-bold text-kiosk-teal">
              <FileText size={11} /> {d}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center gap-2 rounded-xl bg-kiosk-teal/5 border border-kiosk-teal/20 px-4 py-3 text-xs font-bold text-kiosk-teal">
        <Phone size={12} /> SMS confirmation will be sent to {form.phone || "your number"}
      </div>
      <p className="text-[11px] font-medium text-foreground/35 text-center">This system does not provide medical diagnosis. All information is for physician use only.</p>

      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="rounded-2xl px-5 font-bold border-border">
          <ArrowLeft size={16} /> Back
        </Button>
        <Button onClick={onSubmit} disabled={booking}
          className="flex-1 min-h-12 rounded-2xl bg-kiosk-coral font-black text-white shadow-lg shadow-kiosk-coral/25 hover:bg-kiosk-coral/90 disabled:opacity-40">
          {booking ? <><RefreshCw size={16} className="animate-spin" /> Booking…</> : <><Calendar size={16} /> Confirm Booking</>}
        </Button>
      </div>
    </div>
  );
}

// â”€â”€â”€ Success â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function SuccessView({ t, name, phone, apt, form, onNewBooking }: {
  t: T; name: string; phone: string;
  apt: { token: string; id: string; queuePosition: number; estimatedWait: number };
  form: { doctor: string; department: string; date: string; timeSlot: string };
  onNewBooking: () => void;
}) {
  const portalLink = phone ? portalUrl(phone) : "/portal";

  return (
    <div className="max-w-md mx-auto space-y-4">
      <div className="rounded-3xl border-2 border-kiosk-teal/25 bg-white p-8 text-center shadow-2xl">
        <div className="mx-auto grid size-20 place-items-center rounded-full bg-kiosk-green/15 text-kiosk-green ring-8 ring-kiosk-green/10">
          <Check size={44} strokeWidth={2.5} />
        </div>
        <p className="mt-5 text-xs font-black uppercase tracking-[0.2em] text-kiosk-green">Appointment Confirmed</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-kiosk-navy">{name || "Your appointment"} is booked.</h1>
        <p className="mt-2 text-sm font-medium text-foreground/55">{form.doctor} · {form.department}</p>

        <div className="mt-5 rounded-2xl bg-kiosk-teal/5 border border-kiosk-teal/20 p-5 space-y-3 text-left">
          {[
            { label: "Token",    value: apt.token,    big: true },
            { label: "Date",     value: form.date === new Date().toISOString().slice(0,10) ? `Today, ${form.date}` : form.date },
            { label: "Time",     value: form.timeSlot },
            { label: "Queue",    value: apt.queuePosition > 0 ? `#${apt.queuePosition} · ~${apt.estimatedWait} min wait` : "Assigned shortly" },
          ].map(({ label, value, big }) => (
            <div key={label} className="flex items-center justify-between">
              <span className="text-[11px] font-black uppercase text-foreground/40">{label}</span>
              <span className={`font-black ${big ? "text-2xl text-kiosk-coral" : "text-sm text-kiosk-navy"}`}>{value}</span>
            </div>
          ))}
        </div>

        {phone && (
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-kiosk-teal/8 border border-kiosk-teal/20 px-3 py-2.5 text-xs font-bold text-kiosk-teal">
            <Phone size={12} /> SMS confirmation sent to {phone}
          </div>
        )}
      </div>

      {/* Portal QR */}
      {phone && (
        <div className="rounded-2xl border border-kiosk-teal/20 bg-white p-5 shadow-sm flex items-center gap-4">
          <div className="rounded-xl bg-white border border-border/40 p-2 shadow-sm shrink-0">
            <QRCodeSVG value={portalLink} size={90} fgColor="#0f3052" bgColor="#ffffff"
              level="M" imageSettings={{ src: "/logo.png", height: 18, width: 18, excavate: true }} />
          </div>
          <div>
            <p className="text-sm font-black text-kiosk-navy">Track your appointment</p>
            <p className="text-xs font-medium text-foreground/50 leading-relaxed mt-0.5">
              Scan to check your queue position, reminders and follow-ups.
            </p>
            <a href={portalLink} className="mt-2 inline-flex items-center gap-1 text-xs font-black text-kiosk-teal hover:underline">
              Open Portal <ArrowRight size={11} />
            </a>
          </div>
        </div>
      )}

      <div className="flex gap-3">
        <a href="/portal" className="flex-1 flex items-center justify-center gap-1.5 min-h-12 rounded-2xl border border-kiosk-teal/30 bg-white text-sm font-bold text-kiosk-teal hover:bg-kiosk-teal/5 transition-colors">
          <HeartPulse size={15} /> My Portal
        </a>
        <Button onClick={onNewBooking} className="flex-1 min-h-12 rounded-2xl bg-kiosk-navy font-black text-white hover:bg-kiosk-navy/90">
          New booking
        </Button>
      </div>
    </div>
  );
}

// â”€â”€â”€ Step progress bar â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function StepBar({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className={`h-1.5 flex-1 rounded-full transition-all ${i < current ? "bg-kiosk-teal" : "bg-gray-200"}`} />
      ))}
      <span className="text-xs font-black text-foreground/40 shrink-0">{current}/{total}</span>
    </div>
  );
}

// â”€â”€â”€ Doctor shell (unchanged, kept for Doctor portal nav link) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// All doctor-related components below are preserved from the previous version.

const doctorNavItems: Array<{ label: string; Icon: typeof BarChart3 }> = [
  { label: "Dashboard",      Icon: BarChart3    },
  { label: "Patient queue",  Icon: Users        },
  { label: "Appointments",   Icon: Calendar     },
  { label: "Today's cases",  Icon: ClipboardList },
  { label: "Settings",       Icon: Settings     },
];

function DoctorShell({ view, setView, selectedPatient, setSelectedPatient, selectedCase }: {
  view: View; setView: (v: View) => void;
  selectedPatient: string; setSelectedPatient: (t: string) => void;
  selectedCase: typeof demoConsultation;
}) {
  const [navView, setNavView] = useState<"queue" | "today" | "settings" | "appointments">("queue");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (view === "doctorLogin") return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-5">
      <div className="w-full max-w-md rounded-3xl border border-border/50 bg-white p-8 shadow-xl">
        <div className="mb-6 flex items-center gap-3">
          <div className="grid size-12 place-items-center rounded-2xl bg-kiosk-teal text-white shadow-lg shadow-kiosk-teal/30"><Stethoscope size={22} /></div>
          <div><p className="text-2xl font-black text-kiosk-navy">Doctor sign in</p><p className="text-xs font-medium text-foreground/45">Sehat Setu · demo</p></div>
        </div>
        <div className="rounded-xl bg-kiosk-teal/5 border border-kiosk-teal/20 p-4 text-sm font-medium text-kiosk-navy mb-4 space-y-1">
          <p className="font-bold">Demo credentials:</p>
          <p className="text-foreground/60">Email: doctor@Sehat Setu.demo</p>
          <p className="text-foreground/60">Password: demo123</p>
        </div>
        <Button onClick={() => setView("dashboard")} className="w-full min-h-12 rounded-2xl bg-kiosk-teal font-black text-white hover:bg-kiosk-teal/90">
          <LogIn size={18} /> Enter dashboard
        </Button>
        <Button variant="ghost" onClick={() => setView("home")} className="mt-2 w-full font-bold text-kiosk-navy hover:bg-gray-100">
          <ArrowLeft size={16} /> Back
        </Button>
      </div>
    </div>
  );

  const navMap: Record<string, () => void> = {
    "Dashboard":     () => { setNavView("queue");        setView("dashboard"); setSidebarOpen(false); },
    "Patient queue": () => { setNavView("queue");        setView("dashboard"); setSidebarOpen(false); },
    "Appointments":  () => { setNavView("appointments"); setView("dashboard"); setSidebarOpen(false); },
    "Today's cases": () => { setNavView("today");        setView("dashboard"); setSidebarOpen(false); },
    "Settings":      () => { setNavView("settings");     setView("dashboard"); setSidebarOpen(false); },
  };
  const activeLabel = view === "case" ? "" : navView === "today" ? "Today's cases" : navView === "appointments" ? "Appointments" : navView === "settings" ? "Settings" : "Patient queue";
  const headerTitle = view === "case" ? "Patient case" : navView === "today" ? "Today's cases" : navView === "appointments" ? "Appointments" : navView === "settings" ? "Settings" : "Patients ready for consultation";

  const SidebarContent = ({ mobile = false }: { mobile?: boolean }) => (
    <div className={`flex flex-col ${mobile ? "h-full" : "h-full"}`}>
      <div className={`flex items-center gap-3 border-b border-white/10 pb-5 ${mobile ? "mb-2" : ""}`}>
        <img src="/logo.png" alt="Sehat Setu" className="size-9 rounded-xl object-contain" />
        <div><p className="text-base font-black">Sehat Setu</p><p className="text-[9px] font-bold uppercase tracking-widest text-white/40">Physician desk</p></div>
        {mobile && <button onClick={() => setSidebarOpen(false)} className="ml-auto text-white/40 hover:text-white"><X size={18} /></button>}
      </div>
      <nav className="mt-4 flex-1 space-y-1">
        {doctorNavItems.map(({ label, Icon }) => (
          <button key={label} onClick={navMap[label]}
            className={`flex min-h-10 w-full items-center gap-3 rounded-xl px-3 text-left text-sm font-bold transition-all ${activeLabel === label ? "bg-kiosk-teal/20 text-emerald-300 border border-kiosk-teal/20" : "text-white/50 hover:bg-white/8 hover:text-white"}`}>
            <Icon size={16} />{label}
          </button>
        ))}
      </nav>
      <div className="mt-4 rounded-xl bg-white/5 border border-white/10 p-3 text-xs text-white/35">Demo data only.</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex min-h-screen">
        <aside className="hidden w-56 shrink-0 bg-kiosk-navy text-white lg:flex lg:flex-col p-5"><SidebarContent /></aside>
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/60" onClick={() => setSidebarOpen(false)} />
            <aside className="absolute left-0 top-0 bottom-0 w-60 bg-kiosk-navy text-white p-5 shadow-2xl flex flex-col"><SidebarContent mobile /></aside>
          </div>
        )}
        <div className="flex-1 min-w-0">
          <header className="flex min-h-14 items-center justify-between border-b border-border/50 bg-white px-5 sm:px-7">
            <div className="flex items-center gap-3">
              <Button size="icon" variant="ghost" className="lg:hidden" onClick={() => setSidebarOpen(true)}><Menu size={18} /></Button>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-kiosk-teal">Physician workspace</p>
                <h1 className="text-base font-black text-kiosk-navy">{headerTitle}</h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <a href="/" className="hidden sm:flex items-center gap-1.5 rounded-xl border border-border/50 px-3 py-1.5 text-xs font-bold text-kiosk-navy hover:bg-gray-100 transition-colors">
                <ArrowLeft size={12} /> Patient booking
              </a>
              <span className="hidden text-sm font-bold text-foreground/45 sm:inline">Dr. M. Rao</span>
              <div className="grid size-8 place-items-center rounded-full bg-kiosk-teal text-white font-black text-xs shadow">MR</div>
            </div>
          </header>
          <main className="p-5 sm:p-7">
            {view === "case"                ? <CaseView selectedCase={selectedCase} onBack={() => setView("dashboard")} />
             : navView === "today"          ? <TodaysCasesView onOpenCase={(t) => { setSelectedPatient(t); setView("case"); }} />
             : navView === "appointments"   ? <AppointmentsView />
             : navView === "settings"       ? <DoctorSettingsView />
             :                               <DoctorDashboard selectedPatient={selectedPatient} setSelectedPatient={setSelectedPatient} setView={setView} />}
          </main>
        </div>
      </div>
    </div>
  );
}

// â”€â”€â”€ Doctor sub-views (preserved) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function DoctorDashboard({ selectedPatient, setSelectedPatient, setView }: { selectedPatient: string; setSelectedPatient: (t: string) => void; setView: (v: View) => void }) {
  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <Metric icon={<Users />}   label="Ready now"       value="2"     tone="teal"  />
        <Metric icon={<Clock3 />}  label="Average wait"    value="14 min" tone="sky"   />
        <Metric icon={<Bell />}    label="Needs attention" value="1"     tone="coral" />
      </div>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black text-kiosk-navy">Patient queue</h2>
        <span className="rounded-xl bg-kiosk-yellow/20 border border-kiosk-yellow/30 px-3 py-1.5 text-xs font-black text-kiosk-navy">DEMO DATA</span>
      </div>
      <div className="space-y-3">
        {demoPatients.map((patient) => (
          <button key={patient.token} onClick={() => { setSelectedPatient(patient.token); setView("case"); }}
            className={`flex w-full flex-col gap-3 rounded-2xl border bg-white p-4 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md sm:flex-row sm:items-center ${selectedPatient === patient.token ? "border-kiosk-teal/40" : "border-border/60 hover:border-kiosk-teal/30"}`}>
            <span className="grid size-10 place-items-center rounded-xl bg-kiosk-coral/10 font-black text-kiosk-coral">{patient.token.split("-")[1]}</span>
            <span className="flex-1 min-w-0">
              <span className="block font-black text-kiosk-navy">{patient.name}</span>
              <span className="block text-xs font-medium text-foreground/50">{patient.age}y · {patient.gender} · {patient.submitted}</span>
            </span>
            <span className="flex-1 text-sm font-bold text-foreground/65">{patient.complaint}</span>
            <span className={`rounded-full px-3 py-1 text-xs font-black ${
              patient.status === "Verified" ? "bg-kiosk-teal/15 text-kiosk-teal border border-kiosk-teal/20" :
              patient.status === "Ready"    ? "bg-kiosk-green/15 text-kiosk-green border border-kiosk-green/20" :
                                              "bg-kiosk-yellow/20 text-kiosk-navy border border-kiosk-yellow/30"
            }`}>{patient.status}</span>
            <ChevronRight className="hidden text-foreground/25 sm:block" size={16} />
          </button>
        ))}
      </div>
    </div>
  );
}

function Metric({ icon, label, value, tone }: { icon: React.ReactNode; label: string; value: string; tone: "teal"|"sky"|"coral" }) {
  const tones = { teal:"bg-kiosk-teal/10 text-kiosk-teal border-kiosk-teal/20", sky:"bg-kiosk-sky/10 text-kiosk-sky border-kiosk-sky/20", coral:"bg-kiosk-coral/10 text-kiosk-coral border-kiosk-coral/20" };
  return (
    <div className="rounded-2xl border border-border/50 bg-white p-4 shadow-sm">
      <div className={`mb-2 grid size-9 place-items-center rounded-xl border ${tones[tone]}`}>{icon}</div>
      <p className="text-xs font-black uppercase tracking-wide text-foreground/45">{label}</p>
      <p className="mt-0.5 text-2xl font-black text-kiosk-navy">{value}</p>
    </div>
  );
}

function TodaysCasesView({ onOpenCase }: { onOpenCase: (t: string) => void }) {
  const allToday = [
    ...demoPatients,
    { token:"A-101", name:"Priya Mehta",  age:"29", gender:"Female", complaint:"Fever",      status:"Verified" as const, submitted:"08:55" },
    { token:"A-100", name:"Suresh Kumar", age:"71", gender:"Male",   complaint:"Chest pain", status:"Verified" as const, submitted:"08:30" },
  ];
  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <Metric icon={<BadgeCheck />} label="Verified" value={String(allToday.filter(p=>p.status==="Verified").length)} tone="teal" />
        <Metric icon={<RefreshCw />}  label="In review" value={String(allToday.filter(p=>p.status==="In review").length)} tone="sky" />
        <Metric icon={<Bell />}       label="Ready"     value={String(allToday.filter(p=>p.status==="Ready").length)}    tone="coral" />
      </div>
      <h2 className="text-xl font-black text-kiosk-navy">All cases today</h2>
      <div className="space-y-2">
        {allToday.map((p) => (
          <button key={p.token} onClick={() => onOpenCase(p.token)}
            className="w-full flex flex-col gap-2 rounded-2xl border bg-white p-4 text-left shadow-sm hover:border-kiosk-teal/30 hover:shadow-md transition-all sm:flex-row sm:items-center border-border/60">
            <span className="grid size-10 place-items-center rounded-xl bg-kiosk-coral/10 font-black text-kiosk-coral">{p.token.split("-")[1]}</span>
            <span className="flex-1"><span className="block font-black text-kiosk-navy">{p.name}</span><span className="text-xs font-medium text-foreground/50">{p.age}y · {p.gender} · {p.submitted}</span></span>
            <span className="flex-1 text-sm font-bold text-foreground/65">{p.complaint}</span>
            <span className={`rounded-full px-3 py-1 text-xs font-black ${p.status==="Verified"?"bg-kiosk-teal/15 text-kiosk-teal border border-kiosk-teal/20":p.status==="Ready"?"bg-kiosk-green/15 text-kiosk-green border border-kiosk-green/20":"bg-kiosk-yellow/20 text-kiosk-navy border border-kiosk-yellow/30"}`}>{p.status}</span>
            <ChevronRight className="hidden text-foreground/25 sm:block" size={16} />
          </button>
        ))}
      </div>
    </div>
  );
}

function AppointmentsView() {
  const [appointments, setAppointments] = useState<import("@/lib/appointmentService").Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter]   = useState<"all"|"today"|"upcoming">("today");
  const [toast, setToast]     = useState<string | null>(null);
  const [fuModal, setFuModal] = useState<string | null>(null);
  const [fuDate, setFuDate]   = useState(""); const [fuReason, setFuReason] = useState(""); const [fuNote, setFuNote] = useState("");
  const [fuChannel, setFuChannel] = useState<import("@/lib/appointmentService").ReminderChannel>("sms");
  const [fuLoading, setFuLoading] = useState(false);
  const today = new Date().toISOString().slice(0,10);

  useEffect(() => { import("@/lib/appointmentService").then(({ getAppointments }) => getAppointments().then((d) => { setAppointments(d); setLoading(false); })); }, []);

  const filtered = appointments.filter((a) => filter==="today"?a.date===today:filter==="upcoming"?a.date>=today&&a.status!=="completed":true)
    .sort((a,b)=>a.date.localeCompare(b.date)||a.timeSlot.localeCompare(b.timeSlot));

  const stats = { total:appointments.filter(a=>a.date===today).length, waiting:appointments.filter(a=>a.date===today&&a.status==="waiting").length, completed:appointments.filter(a=>a.date===today&&a.status==="completed").length, followUps:appointments.reduce((n,a)=>n+a.followUps.filter(f=>f.status==="scheduled").length,0) };

  const bookFu = async () => {
    if (!fuModal||!fuDate||!fuReason) return; setFuLoading(true);
    const { bookFollowUp } = await import("@/lib/appointmentService");
    await bookFollowUp(fuModal, fuDate, fuReason, fuNote, fuChannel).catch(()=>{});
    setToast(`Follow-up booked for ${fuDate}`); setTimeout(()=>setToast(null),4000);
    setFuModal(null); setFuDate(""); setFuReason(""); setFuNote("");
    const { getAppointments } = await import("@/lib/appointmentService");
    getAppointments().then(setAppointments);
    setFuLoading(false);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      {toast && <div className="flex items-center gap-2 rounded-2xl bg-kiosk-teal/10 border border-kiosk-teal/20 px-4 py-3 text-sm font-bold text-kiosk-teal"><CheckCircle2 size={15}/>{toast}</div>}
      <div className="grid gap-4 sm:grid-cols-4">
        <Metric icon={<Calendar/>}   label="Today"         value={String(stats.total)}     tone="teal"/>
        <Metric icon={<Clock3/>}     label="Waiting"       value={String(stats.waiting)}   tone="sky"/>
        <Metric icon={<BadgeCheck/>} label="Completed"     value={String(stats.completed)} tone="teal"/>
        <Metric icon={<Bell/>}       label="Follow-ups due" value={String(stats.followUps)} tone="coral"/>
      </div>
      <div className="flex gap-2 rounded-xl bg-gray-100 p-1 w-fit">
        {(["today","upcoming","all"] as const).map((f)=>(
          <button key={f} onClick={()=>setFilter(f)} className={`rounded-lg px-4 py-1.5 text-sm font-bold capitalize ${filter===f?"bg-white text-kiosk-navy shadow-sm":"text-foreground/50"}`}>{f}</button>
        ))}
      </div>
      {loading ? <div className="flex items-center gap-2 text-sm text-foreground/50"><RefreshCw size={14} className="animate-spin"/>Loading…</div>
      : filtered.length===0 ? <div className="rounded-2xl border bg-white p-8 text-center"><p className="text-sm font-bold text-kiosk-navy">No appointments</p></div>
      : <div className="space-y-2">
          {filtered.map((apt) => (
            <div key={apt.id} className="rounded-2xl border border-border/50 bg-white p-4 shadow-sm">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-kiosk-coral/10 font-black text-kiosk-coral">{apt.token.split("-")[1]}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-black text-kiosk-navy">{apt.patientName}</p>
                  <p className="text-xs font-medium text-foreground/50">{apt.patientAge}y · {apt.complaint} · {apt.doctor}</p>
                  <p className="text-xs font-medium text-foreground/40">{apt.date===today?"Today":apt.date} · {apt.timeSlot}</p>
                </div>
                <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-black ${import_statusColor_inline(apt.status)}`}>{apt.status.replace("-"," ")}</span>
                <div className="flex gap-2 flex-wrap">
                  {(["sms","email"] as const).map(ch=>(
                    <button key={ch} onClick={async()=>{const{sendReminder}=await import("@/lib/appointmentService");const r=await sendReminder(apt.id,ch,`Reminder: ${apt.doctor} on ${apt.date} at ${apt.timeSlot}. Token: ${apt.token}.`);setToast(r.success?`${ch.toUpperCase()} sent`:"Failed");setTimeout(()=>setToast(null),3000);}}
                      className="flex items-center gap-1 rounded-xl border border-kiosk-teal/30 bg-white px-2.5 py-1.5 text-[11px] font-bold text-kiosk-teal hover:bg-kiosk-teal/5">
                      {ch==="sms"?<Phone size={10}/>:<Mail size={10}/>}{ch.toUpperCase()}
                    </button>
                  ))}
                  {apt.status==="completed"&&<button onClick={()=>setFuModal(apt.id)} className="flex items-center gap-1 rounded-xl border border-kiosk-coral/30 bg-white px-2.5 py-1.5 text-[11px] font-bold text-kiosk-coral hover:bg-kiosk-coral/5"><Calendar size={10}/>Follow-up</button>}
                </div>
              </div>
            </div>
          ))}
        </div>}
      {fuModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={()=>setFuModal(null)}/>
          <div className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between"><p className="text-lg font-black text-kiosk-navy">Book Follow-up</p><button onClick={()=>setFuModal(null)}><X size={18}/></button></div>
            <div className="space-y-3">
              <div><label className="text-[11px] font-black uppercase text-foreground/40">Date</label><Input type="date" value={fuDate} onChange={e=>setFuDate(e.target.value)} min={new Date(Date.now()+86400000).toISOString().slice(0,10)} className="mt-1 rounded-xl border-border/60"/></div>
              <div><label className="text-[11px] font-black uppercase text-foreground/40">Reason</label><Input value={fuReason} onChange={e=>setFuReason(e.target.value)} placeholder="e.g. Review results" className="mt-1 rounded-xl border-border/60"/></div>
              <div><label className="text-[11px] font-black uppercase text-foreground/40">Note for patient</label><Input value={fuNote} onChange={e=>setFuNote(e.target.value)} placeholder="Instructions…" className="mt-1 rounded-xl border-border/60"/></div>
              <div><label className="text-[11px] font-black uppercase text-foreground/40">Remind via</label>
                <div className="mt-1 flex gap-2">{(["sms","email","both"] as const).map(ch=><button key={ch} onClick={()=>setFuChannel(ch)} className={`flex-1 rounded-lg py-1.5 text-xs font-black capitalize ${fuChannel===ch?"bg-kiosk-teal text-white":"border border-border/50 text-foreground/50"}`}>{ch}</button>)}</div>
              </div>
            </div>
            <div className="flex gap-2"><Button variant="outline" onClick={()=>setFuModal(null)} className="flex-1 rounded-2xl font-bold">Cancel</Button><Button onClick={bookFu} disabled={!fuDate||!fuReason||fuLoading} className="flex-1 rounded-2xl bg-kiosk-teal text-white font-black">{fuLoading?<RefreshCw size={14} className="animate-spin"/>:<><Calendar size={14}/>Book</>}</Button></div>
          </div>
        </div>
      )}
    </div>
  );
}

function import_statusColor_inline(s:string):string{
  switch(s){case"scheduled":return"bg-kiosk-sky/15 text-kiosk-sky border border-kiosk-sky/20";case"waiting":return"bg-kiosk-yellow/20 text-kiosk-navy border border-kiosk-yellow/30";case"in-progress":return"bg-kiosk-coral/15 text-kiosk-coral border border-kiosk-coral/20";case"completed":return"bg-kiosk-teal/15 text-kiosk-teal border border-kiosk-teal/20";default:return"bg-foreground/10 text-foreground/50 border border-foreground/20";}
}

function DoctorSettingsView() {
  const [notifs,setNotifs]=useState(true); const [autosave,setAutosave]=useState(true); const [redFlag,setRedFlag]=useState(true);
  const [fs,setFs]=useState<"normal"|"large">("normal"); const [saved,setSaved]=useState(false);
  return (
    <div className="mx-auto max-w-xl space-y-5">
      <h2 className="text-2xl font-black text-kiosk-navy">Settings</h2>
      {saved&&<div className="flex items-center gap-2 rounded-2xl bg-kiosk-teal/10 border border-kiosk-teal/20 px-4 py-3 text-sm font-bold text-kiosk-teal"><CheckCircle2 size={15}/>Saved</div>}
      <div className="rounded-2xl border bg-white p-5 shadow-sm space-y-4">
        <p className="text-xs font-black uppercase text-foreground/40 border-b pb-2">Preferences</p>
        {[{l:"Patient ready notifications",d:"Alert when intake completed",v:notifs,s:setNotifs},{l:"Auto-save edits",d:"Save field changes after 3s",v:autosave,s:setAutosave},{l:"Red-flag alerts",d:"Highlight chest pain / breathlessness",v:redFlag,s:setRedFlag}].map(({l,d,v,s})=>(
          <div key={l} className="flex items-center justify-between gap-4">
            <div><p className="text-sm font-bold text-kiosk-navy">{l}</p><p className="text-xs text-foreground/45">{d}</p></div>
            <button onClick={()=>s(p=>!p)} className={`relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors ${v?"bg-kiosk-teal":"bg-border"}`}><span className={`inline-block size-5 rounded-full bg-white shadow transition-transform ${v?"translate-x-5":"translate-x-0"}`}/></button>
          </div>
        ))}
        <div className="flex items-center justify-between gap-4">
          <div><p className="text-sm font-bold text-kiosk-navy">Text size</p><p className="text-xs text-foreground/45">Reading comfort</p></div>
          <div className="flex gap-2">{(["normal","large"] as const).map(s=><button key={s} onClick={()=>setFs(s)} className={`rounded-xl px-3 py-1.5 text-xs font-black capitalize ${fs===s?"bg-kiosk-teal text-white":"border border-border/50 text-foreground/50"}`}>{s}</button>)}</div>
        </div>
      </div>
      <Button onClick={()=>{setSaved(true);setTimeout(()=>setSaved(false),3000);}} className="w-full min-h-12 rounded-2xl bg-kiosk-teal font-black text-white shadow-lg hover:bg-kiosk-teal/90">
        <Save size={16}/> Save preferences
      </Button>
      <p className="text-center text-xs text-foreground/35">Demo mode — not persisted between sessions</p>
    </div>
  );
}

function CaseView({ selectedCase, onBack }: { selectedCase: typeof demoConsultation; onBack: () => void }) {
  const [verified,setVerified]=useState(false); const [isEditing,setIsEditing]=useState(false);
  const [draft,setDraft]=useState({complaint:selectedCase.complaint,history:selectedCase.history,pastHistory:"Type 2 Diabetes — uploaded record",medications:selectedCase.medications.join(", "),allergies:selectedCase.allergies,investigations:selectedCase.investigations.join(", ")});
  useEffect(()=>{setDraft({complaint:selectedCase.complaint,history:selectedCase.history,pastHistory:"Type 2 Diabetes — uploaded record",medications:selectedCase.medications.join(", "),allergies:selectedCase.allergies,investigations:selectedCase.investigations.join(", ")});setVerified(false);setIsEditing(false);},[selectedCase.token]); // eslint-disable-line
  const field=(key:keyof typeof draft)=>({text:draft[key],editing:isEditing,onEdit:(v:string)=>setDraft(d=>({...d,[key]:v}))});
  return (
    <div className="mx-auto max-w-4xl space-y-4">
      <Button variant="ghost" onClick={onBack} className="px-0 font-bold text-kiosk-navy hover:text-kiosk-teal"><ArrowLeft size={16}/> Back to queue</Button>
      <div className="flex flex-col justify-between gap-3 border-b border-border/50 pb-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-kiosk-coral">Token {selectedCase.token}</p>
          <h2 className="mt-1 text-2xl font-black text-kiosk-navy">{selectedCase.name}</h2>
          <p className="text-sm text-foreground/50">{selectedCase.age}y · {selectedCase.gender} · {draft.complaint} · {selectedCase.submitted}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={()=>setIsEditing(e=>!e)} className={`rounded-xl font-bold ${isEditing?"border-kiosk-teal bg-kiosk-teal/10 text-kiosk-teal":"bg-white border-border/60 text-kiosk-navy"}`}>
            {isEditing?<><Check size={14}/>Done</>:<><Pencil size={14}/>Edit</>}
          </Button>
          <Button onClick={()=>{setVerified(true);setIsEditing(false);}} disabled={verified} className="rounded-xl bg-kiosk-teal font-bold text-white hover:bg-kiosk-teal/90 disabled:opacity-60">
            <Save size={14}/>{verified?"Verified âœ“":"Verify & save"}
          </Button>
        </div>
      </div>
      {isEditing&&<div className="flex items-center gap-2 rounded-xl bg-kiosk-teal/8 border border-kiosk-teal/20 px-4 py-2.5 text-sm font-bold text-kiosk-teal"><Pencil size={14}/>Click any field to edit · Press "Done" when finished.</div>}
      {verified&&<div className="flex items-center gap-2 rounded-xl bg-kiosk-green/12 border border-kiosk-green/20 px-4 py-2.5 text-sm font-bold text-kiosk-green"><BadgeCheck size={16}/>Case verified and saved.</div>}
      <div className="grid gap-4 lg:grid-cols-[1.2fr_.8fr]">
        <div className="space-y-3">
          <div className="rounded-2xl border-2 border-kiosk-coral/25 bg-kiosk-coral/5 p-4"><h3 className="flex items-center gap-2 text-sm font-black text-kiosk-navy"><AlertTriangle size={16} className="text-kiosk-coral"/>Attention</h3>{selectedCase.attention.map(a=><p key={a} className="mt-1.5 text-sm font-bold text-kiosk-navy">{a}</p>)}</div>
          <Section title="Chief complaint"            icon={<UserRound size={14}/>}    source="ðŸŽ¤ Patient interview"    {...field("complaint")} />
          <Section title="History of present illness" icon={<HeartPulse size={14}/>}   source="ðŸŽ¤ Patient interview" draft {...field("history")} />
          <div className="grid gap-3 sm:grid-cols-2">
            <Section title="Past medical history"     icon={<ClipboardList size={14}/>} source="ðŸ“„ Uploaded document"   {...field("pastHistory")} />
            <Section title="Medications"              icon={<Activity size={14}/>}      source="ðŸ“„ Uploaded document"   {...field("medications")} />
          </div>
          <Section title="Allergies"                  icon={<AlertTriangle size={14}/>} source="Patient review"         {...field("allergies")} />
          <Section title="Previous investigations"    icon={<BarChart3 size={14}/>}     source="ðŸ“„ Uploaded document"   {...field("investigations")} />
        </div>
        <div className="space-y-3">
          <div className="rounded-2xl border bg-white p-4 shadow-sm">
            <h3 className="flex items-center gap-2 text-sm font-black text-kiosk-navy"><FileText size={16} className="text-kiosk-coral"/>Documents</h3>
            <div className="mt-3 space-y-2">{selectedCase.documents.map(d=><div key={d} className="flex items-center gap-2 rounded-xl bg-kiosk-sky/8 border border-kiosk-sky/15 p-2.5 text-xs font-bold text-kiosk-navy"><Paperclip size={13} className="text-kiosk-sky"/>{d}<BadgeCheck className="ml-auto text-kiosk-green" size={14}/></div>)}</div>
          </div>
          <div className="rounded-2xl border bg-white p-4 shadow-sm">
            <h3 className="flex items-center gap-2 text-sm font-black text-kiosk-navy"><Clock3 size={16} className="text-kiosk-coral"/>Timeline</h3>
            <div className="relative mt-3 space-y-3 pl-5 before:absolute before:bottom-2 before:left-[5px] before:top-2 before:w-0.5 before:bg-kiosk-teal/20">
              {selectedCase.timeline.map(item=><div key={item.year+item.event} className="relative"><span className="absolute -left-[18px] top-1.5 size-2.5 rounded-full bg-kiosk-teal ring-3 ring-white"/><p className="text-[10px] font-black text-kiosk-coral">{item.year}</p><p className="text-xs font-bold text-kiosk-navy">{item.event}</p></div>)}
            </div>
          </div>
          <div className="rounded-2xl border border-kiosk-teal/20 bg-kiosk-teal/5 p-4">
            <h3 className="flex items-center gap-2 text-sm font-black text-kiosk-navy"><Brain size={16} className="text-kiosk-teal"/>AI summary</h3>
            <p className="mt-2 text-xs font-medium text-foreground/60">{draft.complaint} — {draft.history.slice(0,80)}{draft.history.length>80?"…":""}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ title, icon, text, source, draft: isDraft = false, editing = false, onEdit }: {
  title: string; icon: React.ReactNode; text: string; source: string;
  draft?: boolean; editing?: boolean; onEdit?: (v: string) => void;
}) {
  return (
    <div className={`rounded-2xl border bg-white p-4 shadow-sm transition-all ${editing?"border-kiosk-teal/40 ring-2 ring-kiosk-teal/15":"border-border/50"}`}>
      <h3 className="flex items-center gap-2 text-sm font-black text-kiosk-navy">{icon}{title}</h3>
      {editing&&onEdit?<textarea value={text} onChange={e=>onEdit(e.target.value)} rows={3} autoFocus className="mt-2 w-full resize-none rounded-xl border border-kiosk-teal/30 bg-kiosk-teal/3 p-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-kiosk-teal/30"/>
      :<p className="mt-2 text-sm font-medium text-foreground/65 leading-relaxed">{text}</p>}
      <div className="mt-2 flex flex-wrap items-center gap-2 text-[10px] font-black text-kiosk-teal">
        <span>{source}</span>
        {editing&&<span className="rounded-full bg-kiosk-teal/15 border border-kiosk-teal/20 px-2 py-0.5">Editing</span>}
      </div>
    </div>
  );
}

// Keep unused imports quiet
void (Activity);

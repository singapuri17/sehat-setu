import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Activity, AlertTriangle, ArrowLeft, ArrowRight, BadgeCheck, BarChart3, Bell, Check,
  ChevronRight, CircleHelp, ClipboardList, Clock3, FileImage, FileText, HeartPulse,
  LogIn, Menu, Mic, Paperclip, Pencil, Plus, RefreshCw, Save, Settings, ShieldCheck,
  Stethoscope, Upload, UserRound, Users, Volume2, X, Brain,
  CheckCircle2, PhoneCall, HelpCircle, Touchpad, MonitorSmartphone, RotateCcw,
} from "lucide-react";
import { extractDocument, type ExtractedInformation } from "@/lib/documentService";
import { speechToText, type SpeechState } from "@/lib/speechService";
import { languageOptions, makeT, type T, type Lang } from "@/lib/i18n";
import { demoConsultation } from "@/lib/consultationService";
import { demoPatients } from "@/lib/patientService";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MediKiosk — AI-Powered Pre-Consultation | ABDM Ready" },
      { name: "description", content: "MediKiosk is an AI-powered pre-consultation kiosk for Ayushman Bharat Digital Mission." },
      { property: "og:title", content: "MediKiosk — AI-Powered Pre-Consultation" },
      { property: "og:description", content: "ABDM-ready AI kiosk for patient intake." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: MediKiosk,
});

type View =
  | "welcome"
  | "modeSelect"
  | "consent"
  | "login"
  | "details"
  | "stream"
  | "interview"
  | "documents"
  | "extracted"
  | "review"
  | "success"
  | "doctorLogin"
  | "dashboard"
  | "case";

type InputMode = "touch" | "voice";
type MedicalStream = "ayush" | "allopathy";

type Complaint = "Fever" | "Abdominal pain" | "Headache" | "Cough" | "Chest pain";

// Allergy questions appended to every complaint
const allergyQuestions: { question: string; choices?: string[] }[] = [
  { question: "Do you have any known allergies?", choices: ["No known allergies", "Medicine allergy", "Food allergy", "Dust / Pollen allergy", "Not sure"] },
  { question: "Are you allergic to any medicines?", choices: ["No", "Yes — Penicillin / Antibiotics", "Yes — Painkillers (NSAIDs)", "Yes — Other medicines"] },
];

const interviewQuestions: Record<Complaint, { question: string; choices?: string[] }[]> = {
  "Abdominal pain": [
    { question: "What is your main problem?", choices: ["Pain in my stomach", "Burning feeling", "Something else"] },
    { question: "Where exactly is the pain?", choices: ["Upper abdomen", "Around the navel", "Lower abdomen", "All over"] },
    { question: "When did it start?", choices: ["Today", "Yesterday", "A few days ago", "More than a week ago"] },
    { question: "How severe is the pain?", choices: ["Mild", "Moderate", "Severe"] },
    { question: "Do you have vomiting?", choices: ["No", "Yes"] },
    { question: "Any change in bowel movement?", choices: ["No change", "Loose motion", "Constipation"] },
    ...allergyQuestions,
  ],
  Fever: [
    { question: "When did the fever start?", choices: ["Today", "Yesterday", "A few days ago"] },
    { question: "How high was the fever?", choices: ["I do not know", "Mild", "High"] },
    { question: "Do you have cough?", choices: ["No", "Yes"] },
    { question: "Do you have body pain?", choices: ["No", "Yes"] },
    { question: "Do you have vomiting?", choices: ["No", "Yes"] },
    ...allergyQuestions,
  ],
  Headache: [
    { question: "When did the headache start?", choices: ["Today", "Yesterday", "A few days ago"] },
    { question: "Where is the pain?", choices: ["Front", "Back", "One side", "All over"] },
    { question: "How severe is it?", choices: ["Mild", "Moderate", "Severe"] },
    { question: "Do you feel dizzy?", choices: ["No", "Yes"] },
    ...allergyQuestions,
  ],
  Cough: [
    { question: "When did the cough start?", choices: ["Today", "A few days ago", "More than a week ago"] },
    { question: "Is there mucus?", choices: ["No", "Yes", "I am not sure"] },
    { question: "Do you have fever?", choices: ["No", "Yes"] },
    { question: "Do you feel breathless?", choices: ["No", "Yes"] },
    ...allergyQuestions,
  ],
  "Chest pain": [
    { question: "How severe is the chest pain?", choices: ["Mild", "Moderate", "Severe"] },
    { question: "Do you feel breathless?", choices: ["No", "Yes"] },
    { question: "Have you fainted or felt like fainting?", choices: ["No", "Yes"] },
    { question: "Does it spread to your arm or jaw?", choices: ["No", "Yes"] },
    ...allergyQuestions,
  ],
};

const iconMap: Record<Complaint, typeof HeartPulse> = {
  "Abdominal pain": Activity,
  Fever: Activity,
  Headache: CircleHelp,
  Cough: Volume2,
  "Chest pain": HeartPulse,
};

const defaultPatient = demoPatients[0] ?? {
  token: "A-102", name: "Demo patient", age: "52", gender: "Male",
  complaint: "Abdominal pain", status: "Ready" as const, submitted: "09:42",
};

const doctorNavItems: Array<{ label: string; Icon: typeof BarChart3 }> = [
  { label: "Dashboard", Icon: BarChart3 },
  { label: "Patient queue", Icon: Users },
  { label: "Today's cases", Icon: ClipboardList },
  { label: "Settings", Icon: Settings },
];

// ─── Sahayak (Emergency Help) Modal ──────────────────────────────────────────

function SahayakModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      {/* Card — matches the reference photo: dark navy bg, amber border */}
      <div className="relative mx-auto w-full max-w-sm rounded-3xl border-2 border-kiosk-yellow bg-[oklch(0.18_0.04_225)] p-8 shadow-2xl text-center mk-rise">
        {/* Icon circle */}
        <div className="mx-auto mb-5 flex size-20 items-center justify-center rounded-full bg-kiosk-yellow shadow-lg shadow-kiosk-yellow/40">
          <UserRound size={36} className="text-kiosk-navy" strokeWidth={2} />
          <CircleHelp size={20} className="absolute ml-8 mt-8 text-kiosk-navy" strokeWidth={2.5} />
        </div>

        <h2 className="text-xl font-black uppercase tracking-wide text-kiosk-yellow">
          HOSPITAL SAHAYAK NOTIFIED
        </h2>

        <p className="mt-3 text-base font-medium leading-relaxed text-white/80">
          A hospital staff assistant has been dispatched to assist you at{" "}
          <strong className="font-black text-white">Kiosk #ND-01</strong>.
        </p>

        <Button
          onClick={onClose}
          className="mt-7 min-h-14 w-full rounded-2xl bg-kiosk-yellow text-base font-black text-kiosk-navy hover:bg-kiosk-yellow/90 shadow-lg"
        >
          Resume Kiosk Intake
        </Button>
      </div>
    </div>
  );
}

// ─── Emergency Help Button (always visible) ──────────────────────────────────

function HelpButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label="Emergency Help"
      className="fixed bottom-6 right-6 z-40 flex min-h-14 items-center gap-2 rounded-2xl border-2 border-kiosk-yellow bg-kiosk-navy px-5 text-sm font-black text-kiosk-yellow shadow-2xl transition-all hover:bg-kiosk-yellow hover:text-kiosk-navy active:scale-95"
    >
      <HelpCircle size={22} />
      HELP
    </button>
  );
}

// ─── Main App ────────────────────────────────────────────────────────────────

function MediKiosk() {
  const [view, setView] = useState<View>("welcome");
  const [lang, setLang] = useState<Lang>("en");
  const t = makeT(lang);

  const [inputMode, setInputMode] = useState<InputMode>("touch");
  const [consent, setConsent] = useState(false);
  const [stream, setStream] = useState<MedicalStream | null>(null);
  const [details, setDetails] = useState({ name: "", age: "", gender: "", complaint: "Abdominal pain" as Complaint });
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [speechState, setSpeechState] = useState<SpeechState>("idle");
  const [transcription, setTranscription] = useState("");
  // When voice doesn't match any choice, we hold the transcript here for confirmation
  const [pendingVoice, setPendingVoice] = useState<string | null>(null);
  const [documents, setDocuments] = useState<string[]>(["Blood_Report.pdf", "Prescription.jpg"]);
  const [processing, setProcessing] = useState(false);
  const [extracted, setExtracted] = useState<ExtractedInformation | null>(null);
  const [selectedPatient, setSelectedPatient] = useState(defaultPatient.token);
  const [showSahayak, setShowSahayak] = useState(false);

  const questions = interviewQuestions[details.complaint];
  const currentQuestion = questions[questionIndex] ?? { question: "What would you like to tell us?", choices: [] };
  const hasRedFlag = details.complaint === "Chest pain" && Object.values(answers).some((a) => ["Severe", "Yes"].includes(a));
  const selectedCase = selectedPatient === "A-102"
    ? demoConsultation
    : { ...demoConsultation, ...(demoPatients.find((p) => p.token === selectedPatient) ?? defaultPatient) };

  /** Full session reset — clears all patient data and returns to welcome */
  const resetSession = () => {
    setView("welcome");
    setLang("en");
    setInputMode("touch");
    setConsent(false);
    setStream(null);
    setDetails({ name: "", age: "", gender: "", complaint: "Abdominal pain" });
    setQuestionIndex(0);
    setAnswers({});
    setSpeechState("idle");
    setTranscription("");
    setPendingVoice(null);
    setDocuments([]);
    setProcessing(false);
    setExtracted(null);
  };

  const startSpeech = async () => {
    setSpeechState("listening");
    setPendingVoice(null);
    const result = await speechToText(lang, setSpeechState);
    const rawText = result.text.trim();
    setTranscription(rawText);
    setSpeechState("result");

    // Try to fuzzy-match the transcript against available choices
    const choices = currentQuestion.choices ?? [];
    if (choices.length > 0 && rawText) {
      const normalized = rawText.toLowerCase();
      // Exact or substring match against the translated choice text
      const matched = choices.find((c) => {
        const translated = t(c).toLowerCase();
        return (
          normalized === translated ||
          translated.includes(normalized) ||
          normalized.includes(translated) ||
          // also try matching against English original
          c.toLowerCase().includes(normalized) ||
          normalized.includes(c.toLowerCase())
        );
      });
      if (matched) {
        // Auto-select the matched choice
        setAnswers((a) => ({ ...a, [questionIndex]: matched }));
        setPendingVoice(null);
        // Speak confirmation in voice mode
        if (inputMode === "voice") {
          await speakText(`${t("Selected")}: ${t(matched)}`, lang);
        }
      } else {
        // No match — hold for user confirmation
        setPendingVoice(rawText);
      }
    } else if (rawText) {
      // No choices (open question) — store directly
      setAnswers((a) => ({ ...a, [questionIndex]: rawText }));
    }
  };

  const processDocuments = async () => {
    setProcessing(true);
    const result = await extractDocument(documents[0] ?? "demo.pdf");
    setExtracted(result);
    setProcessing(false);
    setView("extracted");
  };

  const patientBack = () => {
    const previous: Partial<Record<View, View>> = {
      modeSelect: "welcome",
      consent: "modeSelect",
      login: "consent",
      details: "login",
      stream: "details",
      interview: "stream",
      documents: "interview",
      extracted: "documents",
      review: "extracted",
    };
    setView(previous[view] ?? "welcome");
  };

  if (["doctorLogin", "dashboard", "case"].includes(view)) {
    return <DoctorShell view={view} setView={setView} selectedPatient={selectedPatient} setSelectedPatient={setSelectedPatient} selectedCase={selectedCase} />;
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(160deg,oklch(0.96_0.04_175/0.35)_0%,oklch(0.99_0.005_200)_50%,oklch(0.98_0.015_95)_100%)] text-foreground">
      {/* Government top bar */}
      <div className="bg-kiosk-navy py-2">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5">
          <div className="flex items-center gap-3">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/b/b4/Emblem_of_India_with_transparent_background.png"
              alt="Emblem of India"
              className="h-7 w-auto brightness-200 invert"
            />
            <div className="h-5 w-px bg-white/20" />
            <span className="text-xs font-semibold text-white/65">Ayushman Bharat Digital Mission</span>
          </div>
          <span className="flex items-center gap-1.5 rounded-full bg-kiosk-green/20 px-3 py-1 text-[11px] font-bold text-emerald-300">
            <span className="size-1.5 rounded-full bg-kiosk-green animate-pulse" />
            ABDM Ready
          </span>
        </div>
      </div>

      {/* Main header */}
      <header className="mx-auto flex max-w-5xl items-center justify-between px-5 py-3">
        <div className="flex items-center gap-2.5">
          <div className="relative grid size-10 place-items-center rounded-xl bg-kiosk-teal text-white shadow-lg shadow-kiosk-teal/30">
            <Plus size={22} strokeWidth={3} />
            <span className="absolute -bottom-1 -right-1 grid size-4 place-items-center rounded-full bg-kiosk-coral text-[7px] font-black text-white">AI</span>
          </div>
          <div>
            <p className="text-lg font-black tracking-tight text-kiosk-navy">MediKiosk</p>
            <p className="text-[9px] font-semibold uppercase tracking-widest text-kiosk-teal/70">{t("AI-assisted pre-consultation")}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Show active mode badge when not on welcome */}
          {view !== "welcome" && view !== "modeSelect" && (
            <span className={`hidden rounded-lg px-2.5 py-1 text-[10px] font-black uppercase tracking-wide sm:inline ${inputMode === "voice" ? "bg-kiosk-coral/10 text-kiosk-coral" : "bg-kiosk-teal/10 text-kiosk-teal"}`}>
              {inputMode === "voice" ? "🎙 Voice" : "👆 Touch"} mode
            </span>
          )}
          <span className="hidden rounded-lg bg-kiosk-teal/10 px-2.5 py-1 text-xs font-bold text-kiosk-teal sm:inline">
            {t("Kiosk 04 · North Wing")}
          </span>
          <Button
            variant="outline"
            className="min-h-9 gap-1.5 rounded-xl border-kiosk-teal/30 bg-white/80 text-sm font-bold text-kiosk-navy hover:bg-kiosk-teal hover:text-white hover:border-kiosk-teal"
            onClick={() => setView("doctorLogin")}
          >
            <Stethoscope size={15} /> {t("Doctor")}
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-5 pb-24">
        {view === "welcome" && (
          <Welcome t={t} lang={lang} setLang={setLang} onStart={() => setView("modeSelect")} />
        )}
        {view === "modeSelect" && (
          <ModeSelect t={t} inputMode={inputMode} setInputMode={setInputMode} onBack={patientBack} onContinue={() => setView("consent")} />
        )}
        {view === "consent" && (
          <Consent t={t} lang={lang} inputMode={inputMode} consent={consent} setConsent={setConsent} onBack={patientBack} onContinue={() => setView("login")} />
        )}
        {view === "login" && (
          <PatientLogin t={t} onBack={patientBack} onContinue={() => setView("details")} />
        )}
        {view === "details" && (
          <PatientDetails t={t} details={details} setDetails={setDetails} onBack={patientBack} onContinue={() => setView("stream")} />
        )}
        {view === "stream" && (
          <MedicalStreamSelect t={t} stream={stream} setStream={setStream} onBack={patientBack} onContinue={() => setView("interview")} />
        )}
        {view === "interview" && (
          <Interview
            t={t} lang={lang} inputMode={inputMode}
            details={details} currentQuestion={currentQuestion}
            questionIndex={questionIndex} answers={answers}
            setAnswer={(answer) => { setAnswers((a) => ({ ...a, [questionIndex]: answer })); setPendingVoice(null); }}
            pendingVoice={pendingVoice}
            onConfirmVoice={() => {
              if (pendingVoice) {
                setAnswers((a) => ({ ...a, [questionIndex]: pendingVoice }));
                setPendingVoice(null);
              }
            }}
            onRejectVoice={() => {
              setPendingVoice(null);
              setSpeechState("idle");
            }}
            speechState={speechState} transcription={transcription} startSpeech={startSpeech}
            hasRedFlag={hasRedFlag} onBack={patientBack}
            onNext={() => {
              setPendingVoice(null);
              questionIndex < questions.length - 1 ? setQuestionIndex((i) => i + 1) : setView("documents");
            }}
          />
        )}
        {view === "documents" && (
          <Documents t={t} documents={documents} setDocuments={setDocuments} processing={processing} processDocuments={processDocuments} onBack={patientBack} />
        )}
        {view === "extracted" && (
          <Extracted t={t} extracted={extracted} onBack={patientBack} onContinue={() => setView("review")} />
        )}
        {view === "review" && (
          <Review t={t} details={details} stream={stream} transcription={transcription} documents={documents} extracted={extracted} onBack={patientBack} onSubmit={() => setView("success")} />
        )}
        {view === "success" && (
          <Success t={t} name={details.name || "Patient"} onSummary={() => setView("review")} onDoctor={() => setView("doctorLogin")} onNewPatient={resetSession} />
        )}
      </main>

      {/* Persistent help button */}
      <HelpButton onClick={() => setShowSahayak(true)} />
      {showSahayak && <SahayakModal onClose={() => setShowSahayak(false)} />}
    </div>
  );
}

// ─── Welcome Screen (kiosk-style card) ───────────────────────────────────────

function Welcome({ t, lang, setLang, onStart }: { t: T; lang: Lang; setLang: (l: Lang) => void; onStart: () => void }) {
  return (
    <div className="mk-rise flex min-h-[calc(100vh-130px)] flex-col items-center justify-center py-8">
      <div className="w-full max-w-xl rounded-3xl border-2 border-kiosk-teal/25 bg-white/90 p-8 shadow-2xl shadow-kiosk-navy/10 backdrop-blur-xl">
        {/* Logo + name */}
        <div className="flex flex-col items-center text-center">
          <div className="relative mb-4">
            <div className="grid size-20 place-items-center rounded-[22px] bg-kiosk-teal text-white shadow-xl shadow-kiosk-teal/40">
              <Plus size={42} strokeWidth={2.5} />
            </div>
            <span className="absolute -bottom-1 -right-1 grid size-8 place-items-center rounded-xl bg-kiosk-coral text-white shadow-md">
              <HeartPulse size={16} />
            </span>
          </div>

          <h1 className="text-4xl font-black tracking-tight text-kiosk-navy">MediKiosk</h1>
          <p className="mt-1 text-sm font-bold text-kiosk-teal">{t("AI-assisted pre-consultation")}</p>

          <p className="mt-4 max-w-xs text-base font-medium leading-relaxed text-foreground/60">
            {t("Answer a few simple questions so your doctor is ready when you are.")}
          </p>
        </div>

        {/* Language selector */}
        <div className="mt-7">
          <p className="mb-3 text-center text-xs font-black uppercase tracking-[0.18em] text-foreground/40">
            {t("Choose your language")}
          </p>
          <div className="grid grid-cols-3 gap-3">
            {languageOptions.map((item) => (
              <Button
                key={item.code}
                variant={lang === item.code ? "default" : "outline"}
                onClick={() => setLang(item.code)}
                className={`min-h-14 rounded-2xl text-base font-black transition-all ${
                  lang === item.code
                    ? "bg-kiosk-teal text-white shadow-lg shadow-kiosk-teal/30 hover:bg-kiosk-teal/90"
                    : "border-border/60 bg-white text-kiosk-navy hover:border-kiosk-teal/40 hover:bg-kiosk-teal/5"
                }`}
              >
                {item.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Start button */}
        <Button
          onClick={onStart}
          className="mt-7 min-h-16 w-full rounded-2xl bg-kiosk-coral text-xl font-black text-white shadow-xl shadow-kiosk-coral/35 hover:bg-kiosk-coral/90 transition-all"
        >
          {t("Start")} <ChevronRight size={24} />
        </Button>

        {/* Safety notice */}
        <div className="mt-5 flex items-center justify-center gap-2 text-xs font-semibold text-foreground/45">
          <ShieldCheck size={13} className="text-kiosk-green" />
          {t("Safe, simple, patient-first · This kiosk does not provide a diagnosis")}
        </div>
      </div>

      {/* Ministry logos */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-6 opacity-60">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/b/b4/Emblem_of_India_with_transparent_background.png"
          alt="Emblem of India"
          className="h-10 w-auto"
        />
        <img
          src="https://qa.pikorua.ai/assets/img/logo-abha.png"
          alt="Ayushman Bharat Digital Mission"
          className="h-10 w-auto"
          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
        />
        <div className="flex flex-col items-center">
          <div className="grid size-10 place-items-center rounded-xl bg-kiosk-navy/10">
            <Plus size={20} className="text-kiosk-navy/50" strokeWidth={2} />
          </div>
          <span className="mt-1 text-[9px] font-bold text-foreground/35 uppercase tracking-wide">Ministry of Health</span>
        </div>
      </div>
    </div>
  );
}

// ─── Mode Select (Touch vs Voice) ────────────────────────────────────────────

function ModeSelect({ t, inputMode, setInputMode, onBack, onContinue }: {
  t: T;
  inputMode: InputMode;
  setInputMode: (m: InputMode) => void;
  onBack: () => void;
  onContinue: () => void;
}) {
  return (
    <div className="mk-rise flex min-h-[calc(100vh-130px)] flex-col items-center justify-center py-8">
      <div className="w-full max-w-xl rounded-3xl border-2 border-kiosk-teal/25 bg-white/90 p-8 shadow-2xl shadow-kiosk-navy/10 backdrop-blur-xl">
        <div className="mb-7 text-center">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-kiosk-coral">{t("Step 1 · Input mode")}</p>
          <h2 className="mt-2 text-3xl font-black tracking-tight text-kiosk-navy">{t("How would you like to answer?")}</h2>
          <p className="mt-2 text-sm font-medium text-foreground/55">{t("Touch mode is selected by default")}</p>
        </div>

        <div className="space-y-4">
          {/* Touch / Display mode */}
          <button
            onClick={() => setInputMode("touch")}
            className={`group w-full flex items-center gap-5 rounded-2xl border-2 p-5 text-left transition-all active:scale-[0.99] ${
              inputMode === "touch"
                ? "border-kiosk-teal bg-kiosk-teal/8 shadow-md"
                : "border-border/40 bg-white hover:border-kiosk-teal/40 hover:bg-kiosk-teal/3"
            }`}
          >
            <div className={`grid size-16 shrink-0 place-items-center rounded-2xl transition-colors ${
              inputMode === "touch" ? "bg-kiosk-teal text-white shadow-lg shadow-kiosk-teal/30" : "bg-kiosk-teal/10 text-kiosk-teal"
            }`}>
              <Touchpad size={30} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="text-lg font-black text-kiosk-navy">{t("Touch / Display Mode")}</p>
                <span className="rounded-full bg-kiosk-teal/15 px-2 py-0.5 text-[10px] font-black text-kiosk-teal uppercase tracking-wide">Default</span>
              </div>
              <p className="mt-1 text-sm font-medium text-foreground/55">{t("Tap buttons and type answers on screen")}</p>
            </div>
            <div className={`shrink-0 size-6 rounded-full border-2 flex items-center justify-center transition-all ${
              inputMode === "touch" ? "border-kiosk-teal bg-kiosk-teal" : "border-border"
            }`}>
              {inputMode === "touch" && <Check size={13} className="text-white" strokeWidth={3} />}
            </div>
          </button>

          {/* Voice mode */}
          <button
            onClick={() => setInputMode("voice")}
            className={`group w-full flex items-center gap-5 rounded-2xl border-2 p-5 text-left transition-all active:scale-[0.99] ${
              inputMode === "voice"
                ? "border-kiosk-coral bg-kiosk-coral/8 shadow-md"
                : "border-border/40 bg-white hover:border-kiosk-coral/40 hover:bg-kiosk-coral/3"
            }`}
          >
            <div className={`grid size-16 shrink-0 place-items-center rounded-2xl transition-colors ${
              inputMode === "voice" ? "bg-kiosk-coral text-white shadow-lg shadow-kiosk-coral/30" : "bg-kiosk-coral/10 text-kiosk-coral"
            }`}>
              <Mic size={30} />
            </div>
            <div className="flex-1">
              <p className="text-lg font-black text-kiosk-navy">{t("Voice Mode")}</p>
              <p className="mt-1 text-sm font-medium text-foreground/55">{t("Questions are read aloud · Answer by speaking")}</p>
              <p className="mt-1 text-[10px] font-bold text-kiosk-coral/70">🎙 {t("Works in Chrome / Edge")}</p>
            </div>
            <div className={`shrink-0 size-6 rounded-full border-2 flex items-center justify-center transition-all ${
              inputMode === "voice" ? "border-kiosk-coral bg-kiosk-coral" : "border-border"
            }`}>
              {inputMode === "voice" && <Check size={13} className="text-white" strokeWidth={3} />}
            </div>
          </button>
        </div>

        {/* Info box for voice mode */}
        {inputMode === "voice" && (
          <div className="mt-5 flex items-start gap-3 rounded-xl bg-kiosk-coral/8 border border-kiosk-coral/20 p-4">
            <Volume2 size={18} className="shrink-0 mt-0.5 text-kiosk-coral" />
            <p className="text-xs font-medium leading-relaxed text-foreground/65">
              {t("Questions will be spoken in your selected language. After each question, the mic opens automatically for your answer. Touch buttons are also available as backup.")}
            </p>
          </div>
        )}

        <div className="mt-7 flex items-center justify-between gap-3 border-t border-border/40 pt-5">
          <Button variant="outline" onClick={onBack} className="min-h-12 rounded-2xl border-border bg-white px-5 font-bold text-kiosk-navy hover:bg-kiosk-teal/5">
            <ArrowLeft size={18} /> {t("Back")}
          </Button>
          <Button onClick={onContinue} className="min-h-12 rounded-2xl bg-kiosk-teal px-8 font-black text-white shadow-lg shadow-kiosk-teal/30 hover:bg-kiosk-teal/90">
            {t("Continue")} <ArrowRight size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Shared Step Frame ────────────────────────────────────────────────────────

function StepHeader({ eyebrow, title, subtitle, step }: { eyebrow: string; title: string; subtitle?: string; step: string }) {
  return (
    <div className="mb-6 flex items-start justify-between gap-4">
      <div>
        <p className="mb-1.5 text-xs font-black uppercase tracking-[0.18em] text-kiosk-coral">{eyebrow}</p>
        <h1 className="text-2xl font-black leading-tight tracking-tight text-kiosk-navy sm:text-3xl">{title}</h1>
        {subtitle && <p className="mt-2 max-w-lg text-sm font-medium leading-relaxed text-foreground/60">{subtitle}</p>}
      </div>
      <span className="shrink-0 rounded-xl bg-kiosk-teal/10 px-2.5 py-1.5 text-xs font-black text-kiosk-teal">{step}</span>
    </div>
  );
}

function KioskFrame({ children, onBack, onContinue, continueLabel = "Continue", disabled = false, t = (s: string) => s }: { children: React.ReactNode; onBack?: () => void; onContinue?: () => void; continueLabel?: string; disabled?: boolean; t?: T }) {
  return (
    <div className="mk-rise mx-auto max-w-2xl rounded-3xl border-2 border-kiosk-teal/20 bg-white/90 p-6 shadow-2xl shadow-kiosk-navy/10 backdrop-blur-xl sm:p-8">
      {children}
      {(onBack || onContinue) && (
        <div className="mt-8 flex items-center justify-between gap-3 border-t border-border/40 pt-5">
          {onBack ? (
            <Button variant="outline" onClick={onBack} className="min-h-12 rounded-2xl border-border bg-white px-5 text-sm font-bold text-kiosk-navy hover:bg-kiosk-teal/5 hover:border-kiosk-teal/30">
              <ArrowLeft size={18} /> {t("Back")}
            </Button>
          ) : <span />}
          {onContinue && (
            <Button onClick={onContinue} disabled={disabled} className="min-h-12 rounded-2xl bg-kiosk-teal px-6 text-sm font-black text-white shadow-lg shadow-kiosk-teal/30 hover:bg-kiosk-teal/90 disabled:opacity-40">
              {t(continueLabel)} <ArrowRight size={18} />
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Step 2: Consent ──────────────────────────────────────────────────────────

function Consent({ t, lang, inputMode, consent, setConsent, onBack, onContinue }: {
  t: T; lang: Lang; inputMode: InputMode;
  consent: boolean; setConsent: (b: boolean) => void;
  onBack: () => void; onContinue: () => void;
}) {
  const consentText = t("Can we collect your health details?") + ". " +
    t("We will use your answers and previous records to prepare your consultation history.") + ". " +
    t("Your information helps your doctor prepare. A staff member can help you at any time.") + ". " +
    t("I agree to continue") + ".";

  // Auto-speak in voice mode when page loads
  useEffect(() => {
    if (inputMode === "voice") {
      speakText(consentText, lang);
    }
    return () => { window.speechSynthesis?.cancel(); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <KioskFrame t={t} onBack={onBack} onContinue={onContinue} disabled={!consent}>
      <StepHeader
        eyebrow={t("Step 2 · Your privacy")}
        title={t("Can we collect your health details?")}
        subtitle={t("We will use your answers and previous records to prepare your consultation history.")}
        step="2 / 9"
      />
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl bg-kiosk-sky/10 border border-kiosk-sky/20 p-5">
          <Volume2 className="mb-3 text-kiosk-sky" size={26} />
          <p className="text-base font-black text-kiosk-navy">{t("Listen")}</p>
          <Button
            variant="outline"
            onClick={() => speakText(consentText, lang)}
            className="mt-3 min-h-11 w-full rounded-xl border-kiosk-sky/30 bg-white text-sm font-bold text-kiosk-navy hover:bg-kiosk-sky/10"
          >
            <Volume2 size={16} /> {t("Hear this")}
          </Button>
        </div>
        <div className="rounded-2xl bg-kiosk-teal/8 border border-kiosk-teal/20 p-5 sm:col-span-2">
          <ShieldCheck className="mb-3 text-kiosk-teal" size={26} />
          <p className="text-base font-black text-kiosk-navy">{t("Your choice")}</p>
          <p className="mt-2 text-sm font-medium leading-relaxed text-foreground/60">
            {t("Your information helps your doctor prepare. A staff member can help you at any time.")}
          </p>
          <label className="mt-4 flex min-h-14 cursor-pointer items-center gap-3 rounded-xl bg-kiosk-teal/5 border border-kiosk-teal/20 p-3 text-sm font-bold text-kiosk-navy hover:bg-kiosk-teal/10 transition-colors">
            <Checkbox
              checked={consent}
              onCheckedChange={(v) => setConsent(v === true)}
              className="size-6 border-kiosk-teal data-[state=checked]:bg-kiosk-teal data-[state=checked]:border-kiosk-teal"
            />
            {t("I agree to continue")}
          </label>
        </div>
      </div>
      <div className="mt-5 flex items-center gap-2 rounded-xl bg-kiosk-yellow/20 border border-kiosk-yellow/30 px-4 py-3 text-xs font-bold text-kiosk-navy">
        <AlertTriangle size={16} className="text-kiosk-yellow shrink-0" />
        {t("This prototype does not provide medical diagnosis.")}
      </div>
    </KioskFrame>
  );
}

// ─── Step 3: Patient Login (ABHA / Guest) ─────────────────────────────────────

function PatientLogin({ t, onBack, onContinue }: { t: T; onBack: () => void; onContinue: () => void }) {
  const [mode, setMode] = useState<"choose" | "abha" | "mobile" | "guest">("choose");
  const [abhaId, setAbhaId] = useState("");
  const [mobile, setMobile] = useState("");

  if (mode === "choose") {
    return (
      <KioskFrame t={t} onBack={onBack}>
        <StepHeader eyebrow={t("Step 3 · Identify yourself")} title={t("How would you like to proceed?")} step="3 / 8" />
        <div className="grid gap-4">
          {/* ABHA ID */}
          <button
            onClick={() => setMode("abha")}
            className="flex items-center gap-4 rounded-2xl border-2 border-kiosk-teal/30 bg-kiosk-teal/5 p-5 text-left transition-all hover:border-kiosk-teal hover:bg-kiosk-teal/10 active:scale-[0.99]"
          >
            <div className="grid size-12 shrink-0 place-items-center rounded-xl bg-kiosk-teal text-white shadow-lg shadow-kiosk-teal/30">
              <BadgeCheck size={24} />
            </div>
            <div>
              <p className="text-base font-black text-kiosk-navy">{t("Login with ABHA ID")}</p>
              <p className="mt-0.5 text-xs font-medium text-foreground/55">{t("Use your Ayushman Bharat Health Account")}</p>
            </div>
            <ChevronRight size={20} className="ml-auto text-foreground/30" />
          </button>

          {/* Mobile OTP */}
          <button
            onClick={() => setMode("mobile")}
            className="flex items-center gap-4 rounded-2xl border-2 border-kiosk-sky/30 bg-kiosk-sky/5 p-5 text-left transition-all hover:border-kiosk-sky hover:bg-kiosk-sky/10 active:scale-[0.99]"
          >
            <div className="grid size-12 shrink-0 place-items-center rounded-xl bg-kiosk-sky text-white shadow-lg shadow-kiosk-sky/30">
              <PhoneCall size={22} />
            </div>
            <div>
              <p className="text-base font-black text-kiosk-navy">{t("Login with Mobile OTP")}</p>
              <p className="mt-0.5 text-xs font-medium text-foreground/55">{t("Enter your phone number to receive OTP")}</p>
            </div>
            <ChevronRight size={20} className="ml-auto text-foreground/30" />
          </button>

          {/* Guest */}
          <button
            onClick={() => setMode("guest")}
            className="flex items-center gap-4 rounded-2xl border-2 border-border/40 bg-muted/30 p-5 text-left transition-all hover:border-foreground/20 hover:bg-muted/50 active:scale-[0.99]"
          >
            <div className="grid size-12 shrink-0 place-items-center rounded-xl bg-foreground/10 text-foreground/60">
              <UserRound size={22} />
            </div>
            <div>
              <p className="text-base font-black text-kiosk-navy">{t("Continue as Guest")}</p>
              <p className="mt-0.5 text-xs font-medium text-foreground/55">{t("No account needed · Records not saved")}</p>
            </div>
            <ChevronRight size={20} className="ml-auto text-foreground/30" />
          </button>
        </div>
      </KioskFrame>
    );
  }

  if (mode === "abha") {
    return (
      <KioskFrame t={t} onBack={() => setMode("choose")} onContinue={onContinue} disabled={abhaId.length < 4} continueLabel="Verify & Continue">
        <StepHeader eyebrow={t("Step 3 · ABHA Login")} title={t("Enter your ABHA ID")} subtitle={t("Your 14-digit health account number or @abdm address")} step="3 / 8" />
        <div className="space-y-4">
          <div>
            <label className="text-xs font-black uppercase tracking-wide text-foreground/50">{t("ABHA ID / Address")}</label>
            <Input
              value={abhaId}
              onChange={(e) => setAbhaId(e.target.value)}
              placeholder="14-digit number or name@abdm"
              className="mt-2 min-h-14 rounded-2xl bg-white border-border/60 text-lg font-medium focus-visible:ring-kiosk-teal"
            />
          </div>
          <div className="rounded-xl bg-kiosk-teal/8 border border-kiosk-teal/20 p-4 text-xs font-medium text-kiosk-navy">
            <p className="font-bold">What is ABHA?</p>
            <p className="mt-1 text-foreground/60">Ayushman Bharat Health Account — your unique digital health identity under the National Health Mission.</p>
          </div>
        </div>
      </KioskFrame>
    );
  }

  if (mode === "mobile") {
    return (
      <KioskFrame t={t} onBack={() => setMode("choose")} onContinue={onContinue} disabled={mobile.length < 10} continueLabel="Send OTP">
        <StepHeader eyebrow={t("Step 3 · Mobile Login")} title={t("Enter your mobile number")} step="3 / 8" />
        <div>
          <label className="text-xs font-black uppercase tracking-wide text-foreground/50">{t("Mobile Number")}</label>
          <Input
            inputMode="numeric"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            placeholder="10-digit mobile number"
            className="mt-2 min-h-14 rounded-2xl bg-white border-border/60 text-lg font-medium focus-visible:ring-kiosk-teal"
            maxLength={10}
          />
          <p className="mt-2 text-xs font-medium text-foreground/45">OTP will be sent to your registered number · Demo mode</p>
        </div>
      </KioskFrame>
    );
  }

  // Guest mode — just proceed
  return (
    <KioskFrame t={t} onBack={() => setMode("choose")} onContinue={onContinue} continueLabel="Continue as Guest">
      <StepHeader eyebrow={t("Step 3 · Guest Mode")} title={t("Continuing without account")} step="3 / 8" />
      <div className="rounded-2xl border border-kiosk-yellow/30 bg-kiosk-yellow/10 p-5 text-sm font-medium text-kiosk-navy">
        <p className="font-bold">No account linked.</p>
        <p className="mt-1 text-foreground/60">Your consultation history will not be saved to any health account. You can still complete the intake and share with your doctor today.</p>
      </div>
    </KioskFrame>
  );
}

// ─── Step 5: Medical Stream Select ───────────────────────────────────────────

const medicalStreams: {
  id: MedicalStream;
  name: string;
  subtitle: string;
  desc: string;
  emoji: string;
  color: string;
  iconBg: string;
}[] = [
  {
    id: "ayush",
    name: "AYUSH / Ayurveda OPD",
    subtitle: "Prakriti, Agni, Koshtha & Dashavidha Pariksha assessment.",
    desc: "Traditional Indian medicine with holistic evaluation.",
    emoji: "🪷",
    color: "border-blue-500 bg-blue-50",
    iconBg: "bg-blue-100 text-blue-700",
  },
  {
    id: "allopathy",
    name: "Allopathy (Conventional)",
    subtitle: "Evidence-based acute/chronic clinical history & triage.",
    desc: "Modern medicine with standard clinical protocols.",
    emoji: "💊",
    color: "border-kiosk-teal/30 bg-kiosk-teal/5",
    iconBg: "bg-kiosk-teal/15 text-kiosk-teal",
  },
];

function MedicalStreamSelect({
  t, stream, setStream, onBack, onContinue,
}: {
  t: T;
  stream: MedicalStream | null;
  setStream: (s: MedicalStream) => void;
  onBack: () => void;
  onContinue: () => void;
}) {
  return (
    <KioskFrame t={t} onBack={onBack} onContinue={onContinue} disabled={!stream} continueLabel="Confirm & Continue">
      <StepHeader
        eyebrow={t("Step 5 · Medical stream")}
        title={t("Select Medical Stream")}
        subtitle={t("Choose clinical evaluation methodology")}
        step="5 / 9"
      />
      <div className="space-y-3">
        {medicalStreams.map((s) => {
          const selected = stream === s.id;
          return (
            <button
              key={s.id}
              onClick={() => setStream(s.id)}
              className={`group w-full flex items-center gap-4 rounded-2xl border-2 p-4 text-left transition-all active:scale-[0.99] ${
                selected
                  ? `${s.color} shadow-md`
                  : "border-border/40 bg-white hover:border-kiosk-teal/30 hover:bg-kiosk-teal/3"
              }`}
            >
              {/* Icon box */}
              <div className={`grid size-14 shrink-0 place-items-center rounded-2xl text-2xl ${selected ? s.iconBg : "bg-muted/60"} transition-colors`}>
                {s.emoji}
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <p className="text-base font-black text-kiosk-navy">{s.name}</p>
                <p className="mt-0.5 text-xs font-medium leading-relaxed text-foreground/55">{s.subtitle}</p>
              </div>

              {/* Radio indicator */}
              <div className={`shrink-0 size-6 rounded-full border-2 flex items-center justify-center transition-all ${
                selected
                  ? "border-blue-600 bg-blue-600"
                  : "border-border group-hover:border-kiosk-teal/50"
              }`}>
                {selected && <Check size={13} className="text-white" strokeWidth={3} />}
              </div>
            </button>
          );
        })}
      </div>

      {stream && (
        <div className="mt-5 flex items-center gap-3 rounded-xl bg-kiosk-teal/8 border border-kiosk-teal/20 px-4 py-3">
          <span className="text-xl">{medicalStreams.find((s) => s.id === stream)?.emoji}</span>
          <div>
            <p className="text-xs font-black text-kiosk-navy">Selected: {medicalStreams.find((s) => s.id === stream)?.name}</p>
            <p className="text-[10px] font-medium text-foreground/50">{medicalStreams.find((s) => s.id === stream)?.desc}</p>
          </div>
        </div>
      )}
    </KioskFrame>
  );
}

// ─── Step 6: Patient Details ──────────────────────────────────────────────────

const initialDetails = { name: "", age: "", gender: "", complaint: "Abdominal pain" as Complaint };

function PatientDetails({ t, details, setDetails, onBack, onContinue }: { t: T; details: typeof initialDetails; setDetails: React.Dispatch<React.SetStateAction<typeof initialDetails>>; onBack: () => void; onContinue: () => void }) {
  return (
    <KioskFrame t={t} onBack={onBack} onContinue={onContinue} disabled={!details.name || !details.age || !details.gender}>
      <StepHeader eyebrow={t("Step 4 · About you")} title={t("Tell us about yourself")} subtitle={t("Use the boxes below. You can ask for help.")} step="4 / 9" />
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-xs font-black uppercase tracking-wide text-foreground/50">
          {t("Your name")}
          <Input value={details.name} onChange={(e) => setDetails((d) => ({ ...d, name: e.target.value }))} placeholder={t("Type your name")} className="mt-2 min-h-14 rounded-2xl bg-white border-border/60 text-lg font-medium focus-visible:ring-kiosk-teal" />
        </label>
        <label className="text-xs font-black uppercase tracking-wide text-foreground/50">
          {t("Your age")}
          <Input inputMode="numeric" value={details.age} onChange={(e) => setDetails((d) => ({ ...d, age: e.target.value }))} placeholder={t("Example: 52")} className="mt-2 min-h-14 rounded-2xl bg-white border-border/60 text-lg font-medium focus-visible:ring-kiosk-teal" />
        </label>
        <div>
          <p className="text-xs font-black uppercase tracking-wide text-foreground/50 mb-2">{t("I am")}</p>
          <div className="grid grid-cols-3 gap-2">
            {["Male", "Female", "Other"].map((item) => (
              <Button key={item} variant={details.gender === item ? "default" : "outline"} onClick={() => setDetails((d) => ({ ...d, gender: item }))}
                className={`min-h-12 rounded-2xl text-sm font-bold transition-all ${details.gender === item ? "bg-kiosk-teal text-white shadow-lg shadow-kiosk-teal/25 hover:bg-kiosk-teal/90" : "bg-white border-border/60 text-kiosk-navy hover:border-kiosk-teal/40 hover:bg-kiosk-teal/5"}`}>
                {t(item)}
              </Button>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs font-black uppercase tracking-wide text-foreground/50 mb-2">{t("Main problem")}</p>
          <div className="grid grid-cols-2 gap-2">
            {Object.keys(interviewQuestions).map((item) => {
              const Icon = iconMap[item as Complaint];
              return (
                <Button key={item} variant={details.complaint === item ? "default" : "outline"} onClick={() => setDetails((d) => ({ ...d, complaint: item as Complaint }))}
                  className={`min-h-12 justify-start rounded-2xl px-3 text-xs font-bold transition-all ${details.complaint === item ? "bg-kiosk-coral text-white shadow-lg shadow-kiosk-coral/25 hover:bg-kiosk-coral/90" : "bg-white border-border/60 text-kiosk-navy hover:border-kiosk-coral/30 hover:bg-kiosk-coral/5"}`}>
                  <Icon size={16} />{t(item)}
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    </KioskFrame>
  );
}

// ─── TTS helper ──────────────────────────────────────────────────────────────

const TTS_LANG: Record<Lang, string[]> = {
  en: ["en-IN", "en-US", "en-GB"],
  hi: ["hi-IN", "hi"],
  gu: ["gu-IN", "gu", "hi-IN", "hi"], // gu-IN often missing; fall back to Hindi
};

/** Pick the best available voice for a language, falling back gracefully. */
function pickVoice(langCandidates: string[]): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis?.getVoices() ?? [];
  for (const candidate of langCandidates) {
    const exact = voices.find((v) => v.lang === candidate);
    if (exact) return exact;
    const prefix = voices.find((v) => v.lang.startsWith(candidate.split("-")[0]!));
    if (prefix) return prefix;
  }
  return null;
}

/**
 * Speak `text` in `lang`.
 * Gujarati falls back to Hindi voice if gu-IN is not installed.
 * Always resolves (never rejects) so callers can await safely.
 */
function speakText(text: string, lang: Lang): Promise<void> {
  return new Promise((resolve) => {
    if (!window.speechSynthesis) { resolve(); return; }
    window.speechSynthesis.cancel();

    const utt = new SpeechSynthesisUtterance(text);
    const candidates = TTS_LANG[lang] ?? TTS_LANG["en"];

    // Voices may not be loaded yet — try once after a short delay if empty
    const trySpeak = () => {
      const voice = pickVoice(candidates);
      if (voice) {
        utt.voice = voice;
        utt.lang = voice.lang;
      } else {
        utt.lang = candidates[0] ?? "en-IN";
      }
      utt.rate = 0.88;
      utt.pitch = 1;
      utt.onend = () => resolve();
      utt.onerror = () => resolve();
      window.speechSynthesis.speak(utt);
    };

    if (window.speechSynthesis.getVoices().length === 0) {
      // Voices not loaded yet — wait for the event
      const handler = () => { trySpeak(); window.speechSynthesis.removeEventListener("voiceschanged", handler); };
      window.speechSynthesis.addEventListener("voiceschanged", handler);
      // Safety timeout — speak anyway after 800ms even if event never fires
      setTimeout(() => { window.speechSynthesis.removeEventListener("voiceschanged", handler); trySpeak(); }, 800);
    } else {
      trySpeak();
    }
  });
}

/** Build a full spoken string: question + numbered options. */
function buildSpokenQuestion(question: string, choices: string[] | undefined, t: T): string {
  if (!choices || choices.length === 0) return question;
  const optionText = choices.map((c, i) => `${i + 1}. ${t(c)}`).join(". ");
  return `${question}. ${optionText}`;
}

// ─── Step 6: Interview ────────────────────────────────────────────────────────

function Interview({
  t, lang, inputMode, details, currentQuestion, questionIndex, answers,
  setAnswer, pendingVoice, onConfirmVoice, onRejectVoice,
  speechState, transcription, startSpeech, hasRedFlag, onBack, onNext,
}: {
  t: T; lang: Lang; inputMode: InputMode;
  details: typeof initialDetails;
  currentQuestion: { question: string; choices?: string[] };
  questionIndex: number; answers: Record<number, string>;
  setAnswer: (answer: string) => void;
  pendingVoice: string | null;
  onConfirmVoice: () => void;
  onRejectVoice: () => void;
  speechState: SpeechState; transcription: string;
  startSpeech: () => void; hasRedFlag: boolean;
  onBack: () => void; onNext: () => void;
}) {
  const total = interviewQuestions[details.complaint].length;
  const isVoice = inputMode === "voice";

  // In voice mode: speak question + choices when question changes, then auto-start mic
  useEffect(() => {
    if (!isVoice) return;
    let cancelled = false;
    const run = async () => {
      const fullText = buildSpokenQuestion(t(currentQuestion.question), currentQuestion.choices, t);
      await speakText(fullText, lang);
      if (!cancelled) startSpeech();
    };
    run();
    return () => { cancelled = true; window.speechSynthesis?.cancel(); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionIndex, isVoice]);

  const fullSpokenText = buildSpokenQuestion(t(currentQuestion.question), currentQuestion.choices, t);

  return (
    <KioskFrame t={t} onBack={onBack} onContinue={onNext}
      continueLabel={questionIndex === total - 1 ? "Next: records" : "Next question"}>

      {/* Voice mode banner */}
      {isVoice && (
        <div className="mb-4 flex items-center gap-2 rounded-xl bg-kiosk-coral/10 border border-kiosk-coral/20 px-4 py-2.5">
          <Volume2 size={16} className="text-kiosk-coral shrink-0" />
          <span className="text-xs font-black text-kiosk-coral uppercase tracking-wide">Voice mode active</span>
          <span className="ml-auto text-[10px] font-medium text-foreground/45">
            {lang === "hi" ? "🎙 Hindi" : lang === "gu" ? "🎙 Gujarati" : "🎙 English"}
          </span>
        </div>
      )}

      <StepHeader
        eyebrow={t("Step 6 · Tell us")}
        title={t(currentQuestion.question)}
        subtitle={isVoice ? t("Question is being read aloud. Speak your answer.") : t("Tap one answer, or speak your answer.")}
        step={`${questionIndex + 1} / ${total}`}
      />

      {/* Progress bar */}
      <div className="mb-6 h-2 overflow-hidden rounded-full bg-border">
        <div className="h-full rounded-full bg-kiosk-teal transition-all duration-500 ease-out"
          style={{ width: `${((questionIndex + 1) / total) * 100}%` }} />
      </div>

      {/* Choice buttons — always shown (touch backup in voice mode) */}
      {currentQuestion.choices && (
        <div className="grid gap-3 sm:grid-cols-2">
          {currentQuestion.choices.map((choice) => (
            <Button key={choice}
              variant={answers[questionIndex] === choice ? "default" : "outline"}
              onClick={() => setAnswer(choice)}
              className={`min-h-14 justify-start rounded-2xl px-4 text-left text-base font-bold transition-all
                ${answers[questionIndex] === choice
                  ? "bg-kiosk-teal text-white shadow-lg shadow-kiosk-teal/25 hover:bg-kiosk-teal/90"
                  : "bg-white border-border/60 text-kiosk-navy hover:border-kiosk-teal/40 hover:bg-kiosk-teal/5"}`}>
              {answers[questionIndex] === choice
                ? <CheckCircle2 size={20} className="shrink-0" />
                : <span className="size-5 rounded-full border-2 border-current shrink-0" />}
              {t(choice)}
            </Button>
          ))}
        </div>
      )}

      {/* ── Voice confirmation card ─────────────────────────────────────────── */}
      {pendingVoice && (
        <div className="mt-5 rounded-2xl border-2 border-kiosk-yellow/50 bg-kiosk-yellow/10 p-5 mk-rise">
          <p className="text-xs font-black uppercase tracking-wide text-kiosk-yellow/80 mb-2">
            🎙 {t("Did you mean this?")}
          </p>
          {/* Show the raw transcript prominently */}
          <p className="text-xl font-black text-kiosk-navy leading-snug">
            "{pendingVoice}"
          </p>
          <p className="mt-1 text-xs font-medium text-foreground/50">
            {t("This answer will be saved as free text for your doctor.")}
          </p>
          <div className="mt-4 flex gap-3">
            {/* Yes — confirm and store as free text answer */}
            <Button
              onClick={onConfirmVoice}
              className="flex-1 min-h-12 rounded-2xl bg-kiosk-teal font-black text-white shadow-lg shadow-kiosk-teal/25 hover:bg-kiosk-teal/90"
            >
              <CheckCircle2 size={18} /> {t("Yes, that's correct")}
            </Button>
            {/* No — discard and let them re-record */}
            <Button
              variant="outline"
              onClick={onRejectVoice}
              className="flex-1 min-h-12 rounded-2xl border-border font-bold text-kiosk-navy hover:bg-kiosk-coral/5 hover:border-kiosk-coral/30"
            >
              <RefreshCw size={16} /> {t("Try again")}
            </Button>
          </div>
        </div>
      )}

      {/* Show confirmed free-text answer badge */}
      {!pendingVoice && answers[questionIndex] && !currentQuestion.choices?.includes(answers[questionIndex]) && (
        <div className="mt-4 flex items-center gap-3 rounded-xl bg-kiosk-teal/8 border border-kiosk-teal/20 px-4 py-3">
          <CheckCircle2 size={18} className="text-kiosk-teal shrink-0" />
          <div>
            <p className="text-[10px] font-black uppercase tracking-wide text-kiosk-teal/70">{t("Voice answer recorded")}</p>
            <p className="text-sm font-bold text-kiosk-navy">"{answers[questionIndex]}"</p>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setAnswer("")} className="ml-auto text-foreground/30 hover:text-kiosk-coral">
            <X size={15} />
          </Button>
        </div>
      )}

      {/* Mic panel */}
      <div className={`mt-6 flex flex-col items-center gap-4 rounded-2xl p-4 sm:flex-row
        ${isVoice && speechState === "listening"
          ? "bg-kiosk-coral/10 border-2 border-kiosk-coral/40"
          : "bg-kiosk-sky/8 border border-kiosk-sky/20"}`}>

        {/* Mic button */}
        <button
          onClick={startSpeech}
          disabled={speechState === "listening" || speechState === "processing"}
          className={`mk-mic size-16 shrink-0 rounded-full text-white shadow-xl flex items-center justify-center transition-all disabled:opacity-60
            ${speechState === "listening"
              ? "bg-kiosk-coral ring-8 ring-kiosk-coral/25 scale-110"
              : "bg-kiosk-coral shadow-kiosk-coral/30 hover:scale-105"}`}
          aria-label="Speak">
          <Mic size={26} />
        </button>

        <div className="text-center sm:text-left flex-1">
          <p className="text-base font-black text-kiosk-navy">
            {speechState === "idle" && !isVoice ? t("Speak") :
             speechState === "listening" ? t("Listening…") :
             speechState === "processing" ? t("Understanding…") :
             speechState === "error" ? "Mic error — tap to retry" :
             speechState === "result" ? t("Got it") :
             isVoice ? "Reading question…" : t("Speak")}
          </p>
          <p className="text-xs font-medium text-foreground/50 mt-0.5">
            {transcription
              ? `${t("Transcription")}: ${transcription}`
              : speechState === "listening"
              ? t("Speak now — or tap an answer above")
              : isVoice
              ? t("Mic will open automatically after question")
              : t("Tap the microphone and say your answer")}
          </p>
          <p className="mt-1 text-[10px] font-bold text-kiosk-teal/60">
            {lang === "en" ? "🎙 Web Speech · English" : lang === "hi" ? "🎙 Web Speech · हिन्दी" : "🎙 Web Speech · ગુજરાતી"}
          </p>
        </div>

        {/* Re-read button in voice mode */}
        {isVoice && (
          <button
            onClick={() => speakText(fullSpokenText, lang)}
            className="shrink-0 rounded-xl border border-kiosk-teal/30 bg-white px-3 py-2 text-xs font-black text-kiosk-teal hover:bg-kiosk-teal/5 transition-colors"
            aria-label="Repeat question">
            <Volume2 size={16} />
          </button>
        )}
      </div>

      {hasRedFlag && (
        <div className="mt-4 flex items-start gap-3 rounded-2xl border-2 border-kiosk-coral/30 bg-kiosk-coral/8 p-4">
          <AlertTriangle className="mt-0.5 shrink-0 text-kiosk-coral" size={22} />
          <div>
            <p className="text-sm font-black text-kiosk-navy">{t("Potential red flag detected.")}</p>
            <p className="mt-1 text-xs font-medium text-foreground/65">{t("Please alert medical staff. This is not a diagnosis.")}</p>
          </div>
        </div>
      )}
    </KioskFrame>
  );
}

// ─── Step 6: Documents ────────────────────────────────────────────────────────

function Documents({ t, documents, setDocuments, processing, processDocuments, onBack }: { t: T; documents: string[]; setDocuments: React.Dispatch<React.SetStateAction<string[]>>; processing: boolean; processDocuments: () => void; onBack: () => void }) {
  const addDocument = (event: React.ChangeEvent<HTMLInputElement>) => { const file = event.target.files?.[0]; if (file) setDocuments((items) => [...items, file.name]); };
  return (
    <KioskFrame t={t} onBack={onBack} onContinue={processDocuments} continueLabel={processing ? "Processing…" : "Process documents"} disabled={processing}>
      <StepHeader eyebrow={t("Step 7 · Previous records")} title={t("Do you have old medical papers?")} subtitle={t("You can upload a prescription, lab report, or discharge summary.")} step="7 / 9" />
      <label className="flex min-h-32 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-kiosk-teal/35 bg-kiosk-teal/5 text-center transition-all hover:border-kiosk-teal/60 hover:bg-kiosk-teal/10">
        <Upload className="mb-2 text-kiosk-teal" size={28} />
        <span className="text-base font-black text-kiosk-navy">{t("Tap to add a document")}</span>
        <span className="mt-1 text-xs font-medium text-foreground/50">PDF · JPG · PNG</span>
        <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={addDocument} />
      </label>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {documents.map((doc, index) => (
          <div key={`${doc}-${index}`} className="flex min-h-14 items-center gap-3 rounded-2xl border border-border/50 bg-white px-4 shadow-sm">
            <span className="grid size-9 place-items-center rounded-xl bg-kiosk-teal/10 text-kiosk-teal">
              {doc.endsWith(".pdf") ? <FileText size={18} /> : <FileImage size={18} />}
            </span>
            <span className="flex-1 text-sm font-bold text-kiosk-navy">{doc}</span>
            <BadgeCheck className="text-kiosk-green" size={18} />
            <button aria-label={`Remove ${doc}`} className="text-foreground/30 hover:text-kiosk-coral transition-colors" onClick={() => setDocuments((items) => items.filter((_, i) => i !== index))}>
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
      {processing && (
        <div className="mt-5 rounded-2xl bg-kiosk-sky/10 border border-kiosk-sky/20 p-4">
          <div className="flex items-center gap-3 text-sm font-bold text-kiosk-navy">
            <RefreshCw className="mk-spin text-kiosk-sky" size={18} /> {t("Uploading → Extracting text → Identifying information")}
          </div>
          <div className="mt-3 h-2 rounded-full bg-border">
            <div className="h-full w-2/3 rounded-full bg-kiosk-sky animate-pulse" />
          </div>
        </div>
      )}
    </KioskFrame>
  );
}

// ─── Step 7: Extracted ────────────────────────────────────────────────────────

function Extracted({ t, extracted, onBack, onContinue }: { t: T; extracted: ExtractedInformation | null; onBack: () => void; onContinue: () => void }) {
  return (
    <KioskFrame t={t} onBack={onBack} onContinue={onContinue} continueLabel="Review my case">
      <StepHeader eyebrow={t("Step 8 · Check the draft")} title={t("We found these details")} subtitle={t("Please check the information. You can edit it before sending to your doctor.")} step="8 / 9" />
      <div className="mb-5 flex items-center gap-2 rounded-xl bg-kiosk-yellow/20 border border-kiosk-yellow/30 px-4 py-3 text-xs font-bold text-kiosk-navy">
        <CircleHelp size={16} className="shrink-0 text-kiosk-yellow" /> {t("Demo data · Please check every detail")}
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <InfoCard icon={<Activity />} title={t("Past conditions")} value={extracted?.conditions.join(", ") || t("No details found")} />
        <InfoCard icon={<PillIcon />} title={t("Medicines listed")} value={extracted?.medications.join(", ") || t("No details found")} />
        <InfoCard icon={<AlertTriangle />} title={t("Lab result")} value={extracted?.labResults[0] ? `${extracted.labResults[0].name} — ${extracted.labResults[0].value}` : t("No details found")} tone="warning" />
      </div>
      <p className="mt-5 text-xs font-medium text-foreground/45">{t("These are simulated extracted details for this prototype. They are not medical advice.")}</p>
    </KioskFrame>
  );
}

function PillIcon() { return <span className="text-xl">◒</span>; }

function InfoCard({ icon, title, value, tone = "teal", t = (s: string) => s }: { icon: React.ReactNode; title: string; value: string; tone?: "teal" | "warning"; t?: T }) {
  return (
    <div className={`rounded-2xl border p-4 ${tone === "warning" ? "border-kiosk-yellow/30 bg-kiosk-yellow/10" : "border-kiosk-teal/20 bg-kiosk-teal/5"}`}>
      <div className="mb-3 text-kiosk-teal">{icon}</div>
      <p className="text-[10px] font-black uppercase tracking-wide text-foreground/50">{title}</p>
      <p className="mt-1 text-sm font-bold text-kiosk-navy">{value}</p>
      <Button variant="ghost" className="mt-2 min-h-9 rounded-xl px-0 text-xs font-bold text-kiosk-coral hover:bg-kiosk-coral/5">
        <Pencil size={14} /> {t("Edit")}
      </Button>
    </div>
  );
}

// ─── Step 8: Review ───────────────────────────────────────────────────────────

function Review({ t, details, stream, transcription, documents, extracted, onBack, onSubmit }: { t: T; details: typeof initialDetails; stream: MedicalStream | null; transcription: string; documents: string[]; extracted: ExtractedInformation | null; onBack: () => void; onSubmit: () => void }) {
  const rows = useMemo(() => [
    { title: t("Medical stream"), text: medicalStreams.find((s) => s.id === stream)?.name ?? "Not selected", source: "Patient selection" },
    { title: t("Chief complaint"), text: t(details.complaint), source: t("Patient answer") },
    { title: t("History of present illness"), text: transcription || t("Patient details recorded during interview."), source: t("🎤 Patient interview") },
    { title: t("Past medical history"), text: extracted?.conditions.join(", ") || t("Not entered"), source: t("📄 Uploaded document") },
    { title: t("Medications"), text: extracted?.medications.join(", ") || t("Not entered"), source: t("📄 Uploaded document") },
    { title: t("Allergies"), text: t("Not entered"), source: t("Patient review") },
    { title: t("Previous investigations"), text: extracted?.labResults.map((item) => `${item.name} — ${item.value} (${item.status})`).join(", ") || t("Not entered"), source: t("📄 Uploaded document") },
  ], [t, stream, details, transcription, extracted]);
  return (
    <KioskFrame t={t} onBack={onBack} onContinue={onSubmit} continueLabel="Confirm & send to doctor">
      <StepHeader eyebrow={t("Step 9 · Final check")} title={t("Is everything correct?")} subtitle={t("Review your information. Your doctor will verify it before care.")} step="9 / 9" />
      <div className="grid gap-3 sm:grid-cols-2">
        {rows.map((row) => (
          <div key={row.title} className="rounded-2xl border border-border/50 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[10px] font-black uppercase tracking-wide text-foreground/45">{row.title}</p>
                <p className="mt-1 text-sm font-bold text-kiosk-navy">{row.text}</p>
              </div>
              <Button size="icon" variant="ghost" className="shrink-0 text-kiosk-coral hover:bg-kiosk-coral/5" aria-label={`Edit ${row.title}`}>
                <Pencil size={16} />
              </Button>
            </div>
            <p className="mt-2 text-[10px] font-bold text-kiosk-teal">{row.source}</p>
          </div>
        ))}
      </div>
      <div className="mt-5 flex items-start gap-3 rounded-xl bg-kiosk-teal/8 border border-kiosk-teal/20 p-3 text-xs font-bold text-kiosk-navy">
        <ShieldCheck size={16} className="mt-0.5 shrink-0 text-kiosk-teal" /> {t("No diagnosis or treatment advice is provided by this prototype.")}
      </div>
      <p className="mt-3 text-xs font-medium text-foreground/40">{t("Documents")}: {documents.join(" · ") || t("None uploaded")}</p>
    </KioskFrame>
  );
}

// ─── Success ──────────────────────────────────────────────────────────────────

function Success({ t, name, onSummary, onDoctor, onNewPatient }: { t: T; name: string; onSummary: () => void; onDoctor: () => void; onNewPatient: () => void }) {
  // Auto-reset countdown (90 seconds for kiosk idle)
  const [countdown, setCountdown] = useState(90);
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) { clearInterval(timer); onNewPatient(); return 0; }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [onNewPatient]);

  return (
    <div className="mk-rise flex min-h-[calc(100vh-180px)] items-center justify-center py-10">
      <div className="w-full max-w-sm rounded-3xl border-2 border-kiosk-teal/25 bg-white/90 p-8 text-center shadow-2xl">
        <div className="mx-auto grid size-20 place-items-center rounded-full bg-kiosk-green/15 text-kiosk-green ring-8 ring-kiosk-green/10">
          <Check size={44} strokeWidth={2.5} />
        </div>
        <p className="mt-6 text-xs font-black uppercase tracking-[0.2em] text-kiosk-green">{t("Ready for physician review")}</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-kiosk-navy">{t("Your history is ready.")}</h1>
        <p className="mt-3 text-sm font-medium leading-relaxed text-foreground/55">
          {name}, {t("your doctor can now review your information before consultation.")}
        </p>

        {/* Token */}
        <div className="mt-6 rounded-2xl border border-kiosk-teal/20 bg-kiosk-teal/5 p-5">
          <p className="text-xs font-black uppercase tracking-wide text-foreground/40">{t("Your token number")}</p>
          <p className="mt-1 text-5xl font-black text-kiosk-coral tracking-tight">A-105</p>
          <p className="mt-1 text-xs font-medium text-foreground/35">{t("Please wait in the queue")}</p>
        </div>

        {/* Actions */}
        <div className="mt-6 flex flex-col gap-3">
          <Button variant="outline" onClick={onSummary}
            className="min-h-12 rounded-2xl border-border bg-white font-bold text-kiosk-navy hover:border-kiosk-teal/40 hover:bg-kiosk-teal/5">
            <ClipboardList size={18} /> {t("View summary")}
          </Button>
          <Button onClick={onDoctor}
            className="min-h-12 rounded-2xl bg-kiosk-teal font-bold text-white shadow-lg shadow-kiosk-teal/25 hover:bg-kiosk-teal/90">
            {t("Doctor view")} <Stethoscope size={18} />
          </Button>
        </div>

        {/* New patient / session reset */}
        <div className="mt-5 border-t border-border/40 pt-5">
          <Button
            onClick={onNewPatient}
            className="min-h-14 w-full rounded-2xl bg-kiosk-navy text-base font-black text-white shadow-lg hover:bg-kiosk-navy/90 gap-2"
          >
            <RotateCcw size={20} />
            {t("New Patient — Start Fresh")}
          </Button>
          <p className="mt-3 text-xs font-medium text-foreground/35">
            {t("Auto-resets in")} <span className="font-black text-kiosk-coral">{countdown}s</span>
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Doctor Shell ─────────────────────────────────────────────────────────────

function DoctorShell({ view, setView, selectedPatient, setSelectedPatient, selectedCase }: { view: View; setView: (view: View) => void; selectedPatient: string; setSelectedPatient: (token: string) => void; selectedCase: typeof demoConsultation }) {
  if (view === "doctorLogin") return (
    <div className="min-h-screen bg-[linear-gradient(160deg,oklch(0.96_0.04_175/0.3)_0%,oklch(0.99_0.005_200)_100%)] p-5 sm:p-10">
      <div className="mx-auto flex min-h-[80vh] max-w-md items-center">
        <div className="w-full rounded-3xl border-2 border-kiosk-teal/25 bg-white/90 p-8 shadow-2xl backdrop-blur-xl sm:p-10">
          <div className="mb-6 flex items-center gap-3">
            <div className="grid size-12 place-items-center rounded-2xl bg-kiosk-teal text-white shadow-lg shadow-kiosk-teal/30">
              <Stethoscope size={24} />
            </div>
            <div>
              <p className="text-2xl font-black text-kiosk-navy">Doctor sign in</p>
              <p className="text-xs font-bold text-foreground/45">MediKiosk · demo mode</p>
            </div>
          </div>
          <p className="text-sm font-medium text-foreground/60">Use the demo account to view fictional patient cases.</p>
          <div className="mt-5 space-y-2 rounded-2xl bg-kiosk-teal/8 border border-kiosk-teal/20 p-4 text-sm font-bold text-kiosk-navy">
            <p>Email: doctor@medikiosk.demo</p>
            <p>Password: demo123</p>
          </div>
          <Button onClick={() => setView("dashboard")} className="mt-5 min-h-14 w-full rounded-2xl bg-kiosk-teal text-base font-bold text-white shadow-lg shadow-kiosk-teal/30 hover:bg-kiosk-teal/90">
            <LogIn size={20} /> Enter dashboard
          </Button>
          <Button variant="ghost" onClick={() => setView("welcome")} className="mt-2 min-h-11 w-full font-bold text-kiosk-navy hover:bg-kiosk-teal/5">
            <ArrowLeft size={17} /> Back to patient kiosk
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[linear-gradient(160deg,oklch(0.96_0.04_175/0.2)_0%,oklch(0.99_0.005_200)_100%)] text-foreground">
      <div className="flex min-h-screen">
        <aside className="hidden w-60 shrink-0 border-r border-kiosk-teal/20 bg-kiosk-navy text-white lg:flex lg:flex-col p-5">
          <div className="flex items-center gap-3 border-b border-white/10 pb-5">
            <div className="grid size-9 place-items-center rounded-xl bg-kiosk-teal shadow-lg">
              <Plus size={20} strokeWidth={3} />
            </div>
            <div>
              <p className="text-base font-black">MediKiosk</p>
              <p className="text-[9px] font-bold uppercase tracking-widest text-white/40">Physician desk</p>
            </div>
          </div>
          <nav className="mt-5 flex-1 space-y-1">
            {doctorNavItems.map(({ label, Icon }) => (
              <button key={label} className={`flex min-h-10 w-full items-center gap-3 rounded-xl px-3 text-left text-sm font-bold transition-all ${label === "Patient queue" ? "bg-kiosk-teal/20 text-emerald-300 border border-kiosk-teal/20" : "text-white/50 hover:bg-white/8 hover:text-white"}`} onClick={() => setView("dashboard")}>
                <Icon size={17} />{label}
              </button>
            ))}
          </nav>
          <div className="rounded-xl bg-white/5 border border-white/10 p-3 text-xs font-medium text-white/35">
            Demo data only. Verify with patient.
          </div>
        </aside>
        <div className="min-w-0 flex-1">
          <header className="flex min-h-16 items-center justify-between border-b border-border/50 bg-white/80 px-5 backdrop-blur-sm sm:px-7">
            <div className="flex items-center gap-3">
              <Button size="icon" variant="ghost" className="lg:hidden" aria-label="Open menu"><Menu /></Button>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-kiosk-teal">Physician workspace</p>
                <h1 className="text-lg font-black text-kiosk-navy">{view === "case" ? "Patient case" : "Patients ready for consultation"}</h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="hidden text-sm font-bold text-foreground/45 sm:inline">Dr. M. Rao</span>
              <div className="grid size-9 place-items-center rounded-full bg-kiosk-teal text-white font-black text-sm shadow-lg">MR</div>
            </div>
          </header>
          <main className="p-5 sm:p-7">
            {view === "dashboard"
              ? <DoctorDashboard selectedPatient={selectedPatient} setSelectedPatient={setSelectedPatient} setView={setView} />
              : <CaseView selectedCase={selectedCase} onBack={() => setView("dashboard")} />}
          </main>
        </div>
      </div>
    </div>
  );
}

function DoctorDashboard({ selectedPatient, setSelectedPatient, setView }: { selectedPatient: string; setSelectedPatient: (token: string) => void; setView: (view: View) => void }) {
  return (
    <div className="mx-auto max-w-5xl">
      <div className="mk-stagger grid gap-4 md:grid-cols-3">
        <Metric icon={<Users />} label="Ready now" value="2" tone="teal" />
        <Metric icon={<Clock3 />} label="Average wait" value="14 min" tone="sky" />
        <Metric icon={<Bell />} label="Needs attention" value="1" tone="coral" />
      </div>
      <div className="mt-7 flex items-center justify-between">
        <h2 className="text-xl font-black text-kiosk-navy">Patient queue</h2>
        <span className="rounded-xl bg-kiosk-yellow/20 border border-kiosk-yellow/30 px-3 py-1.5 text-xs font-black text-kiosk-navy">DEMO DATA</span>
      </div>
      <div className="mt-4 mk-stagger grid gap-3">
        {demoPatients.map((patient) => (
          <button key={patient.token} onClick={() => { setSelectedPatient(patient.token); setView("case"); }}
            className={`flex flex-col gap-3 rounded-2xl border bg-white/90 p-4 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg sm:flex-row sm:items-center ${selectedPatient === patient.token ? "border-kiosk-teal/40" : "border-border/60 hover:border-kiosk-teal/30"}`}>
            <span className="grid size-11 place-items-center rounded-xl bg-kiosk-coral/10 text-base font-black text-kiosk-coral">{patient.token.split("-")[1]}</span>
            <span className="min-w-32 flex-1">
              <span className="block text-base font-black text-kiosk-navy">{patient.name}</span>
              <span className="block text-xs font-medium text-foreground/50">{patient.age}y · {patient.gender} · {patient.submitted}</span>
            </span>
            <span className="flex-1 text-sm font-bold text-foreground/65">{patient.complaint}</span>
            <span className={`rounded-full px-3 py-1 text-xs font-black ${patient.status === "Ready" ? "bg-kiosk-green/15 text-kiosk-green border border-kiosk-green/20" : "bg-kiosk-yellow/20 text-kiosk-navy border border-kiosk-yellow/30"}`}>{patient.status}</span>
            <ChevronRight className="hidden text-foreground/25 sm:block" size={18} />
          </button>
        ))}
      </div>
    </div>
  );
}

function Metric({ icon, label, value, tone }: { icon: React.ReactNode; label: string; value: string; tone: "teal" | "sky" | "coral" }) {
  const tones = { teal: "bg-kiosk-teal/10 text-kiosk-teal border-kiosk-teal/20", sky: "bg-kiosk-sky/10 text-kiosk-sky border-kiosk-sky/20", coral: "bg-kiosk-coral/10 text-kiosk-coral border-kiosk-coral/20" };
  return (
    <div className="rounded-2xl border border-border/50 bg-white/90 p-4 shadow-sm">
      <div className={`mb-3 grid size-10 place-items-center rounded-xl border ${tones[tone]}`}>{icon}</div>
      <p className="text-xs font-black uppercase tracking-wide text-foreground/45">{label}</p>
      <p className="mt-0.5 text-2xl font-black text-kiosk-navy">{value}</p>
    </div>
  );
}

function CaseView({ selectedCase, onBack }: { selectedCase: typeof demoConsultation; onBack: () => void }) {
  const [verified, setVerified] = useState(false);
  return (
    <div className="mx-auto max-w-5xl">
      <Button variant="ghost" onClick={onBack} className="mb-4 min-h-10 px-0 font-bold text-kiosk-navy hover:text-kiosk-teal">
        <ArrowLeft size={18} /> Back to queue
      </Button>
      <div className="flex flex-col justify-between gap-4 border-b border-border/50 pb-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-kiosk-coral">Token {selectedCase.token}</p>
          <h2 className="mt-1 text-3xl font-black text-kiosk-navy">{selectedCase.name}</h2>
          <p className="mt-1 text-sm font-medium text-foreground/50">{selectedCase.age}y · {selectedCase.gender} · {selectedCase.complaint} · {selectedCase.submitted}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="min-h-11 rounded-xl bg-white font-bold text-kiosk-navy border-border/60"><Pencil size={16} /> Edit</Button>
          <Button onClick={() => setVerified(true)} className="min-h-11 rounded-xl bg-kiosk-teal font-bold text-white shadow-lg shadow-kiosk-teal/25 hover:bg-kiosk-teal/90"><Save size={16} /> {verified ? "Saved" : "Verify & save"}</Button>
        </div>
      </div>
      {verified && <div className="mt-4 flex items-center gap-2 rounded-xl bg-kiosk-green/12 border border-kiosk-green/20 px-4 py-3 text-sm font-bold text-kiosk-green"><BadgeCheck size={18} /> Case marked verified.</div>}
      <div className="mt-5 grid gap-4 lg:grid-cols-[1.2fr_.8fr]">
        <div className="space-y-4">
          <Attention items={selectedCase.attention} />
          <Section title="Chief complaint" icon={<UserRound size={16} />} text={selectedCase.complaint} source="🎤 Patient interview" />
          <Section title="History of present illness" icon={<HeartPulse size={16} />} text={selectedCase.history} source="🎤 Patient interview" draft />
          <div className="grid gap-4 sm:grid-cols-2">
            <Section title="Past medical history" icon={<ClipboardList size={16} />} text="Type 2 Diabetes — uploaded record" source="📄 Uploaded document" />
            <Section title="Medications" icon={<Activity size={16} />} text={selectedCase.medications.join(", ")} source="📄 Uploaded document" />
          </div>
          <Section title="Allergies" icon={<AlertTriangle size={16} />} text={selectedCase.allergies} source="Patient review" />
          <Section title="Previous investigations" icon={<BarChart3 size={16} />} text={selectedCase.investigations.join(", ")} source="📄 Uploaded document" />
        </div>
        <div className="space-y-4">
          <div className="rounded-2xl border border-border/50 bg-white/90 p-4 shadow-sm">
            <h3 className="flex items-center gap-2 text-base font-black text-kiosk-navy"><FileText size={18} className="text-kiosk-coral" /> Medical documents</h3>
            <div className="mt-3 space-y-2">
              {selectedCase.documents.map((doc) => (
                <div key={doc} className="flex items-center gap-3 rounded-xl bg-kiosk-sky/8 border border-kiosk-sky/15 p-3 text-xs font-bold text-kiosk-navy">
                  <Paperclip size={15} className="text-kiosk-sky" />{doc}<BadgeCheck className="ml-auto text-kiosk-green" size={16} />
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-border/50 bg-white/90 p-4 shadow-sm">
            <h3 className="flex items-center gap-2 text-base font-black text-kiosk-navy"><Clock3 size={18} className="text-kiosk-coral" /> Timeline</h3>
            <div className="relative mt-4 space-y-4 pl-5 before:absolute before:bottom-2 before:left-[6px] before:top-2 before:w-0.5 before:bg-kiosk-teal/20">
              {selectedCase.timeline.map((item) => (
                <div key={`${item.year}-${item.event}`} className="relative">
                  <span className="absolute -left-[19px] top-1.5 size-2.5 rounded-full bg-kiosk-teal ring-3 ring-background" />
                  <p className="text-[10px] font-black text-kiosk-coral">{item.year}</p>
                  <p className="mt-0.5 text-xs font-bold text-kiosk-navy">{item.event}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-kiosk-teal/20 bg-kiosk-teal/5 p-4">
            <h3 className="flex items-center gap-2 text-base font-black text-kiosk-navy"><Brain size={18} className="text-kiosk-teal" /> AI summary</h3>
            <p className="mt-2 text-xs font-medium leading-relaxed text-foreground/60">Draft only — ready for physician verification.</p>
            <p className="mt-3 text-[10px] font-black text-kiosk-coral">AI draft — verification required.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Attention({ items }: { items: string[] }) {
  return (
    <div className="rounded-2xl border-2 border-kiosk-coral/25 bg-kiosk-coral/8 p-4">
      <h3 className="flex items-center gap-2 text-base font-black text-kiosk-navy"><AlertTriangle size={18} className="text-kiosk-coral" /> Attention</h3>
      {items.map((item) => <p key={item} className="mt-2 text-sm font-bold text-kiosk-navy">{item}</p>)}
    </div>
  );
}

function Section({ title, icon, text, source, draft = false }: { title: string; icon: React.ReactNode; text: string; source: string; draft?: boolean }) {
  return (
    <div className="rounded-2xl border border-border/50 bg-white/90 p-4 shadow-sm">
      <h3 className="flex items-center gap-2 text-sm font-black text-kiosk-navy">{icon}{title}</h3>
      <p className="mt-2 text-sm font-medium leading-relaxed text-foreground/65">{text}</p>
      <div className="mt-3 flex flex-wrap items-center gap-2 text-[10px] font-black text-kiosk-teal">
        <span>{source}</span>
        {draft && <span className="rounded-full bg-kiosk-yellow/25 border border-kiosk-yellow/30 px-2 py-0.5 text-kiosk-navy">AI draft</span>}
      </div>
    </div>
  );
}

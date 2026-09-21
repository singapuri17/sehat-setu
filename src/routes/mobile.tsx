/**
 * /mobile — Patient's personal phone intake
 *
 * Entry points:
 *   /mobile                  → fresh mobile session (language select → full intake)
 *   /mobile?session=XXXX     → resume an existing session (kiosk→phone handoff)
 *
 * This is the SAME clinical intake engine as the kiosk.
 * Only differences: optimised for small screens, no kiosk chrome,
 * session ID shown prominently, channel = "mobile".
 */

import { createFileRoute, useSearch } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Activity, AlertTriangle, ArrowLeft, ArrowRight, BadgeCheck, Check,
  CheckCircle2, ChevronRight, CircleHelp, FileImage, FileText,
  HeartPulse, Mic, PhoneCall, RefreshCw, ShieldCheck,
  Smartphone, Upload, UserRound, Volume2, X,
} from "lucide-react";
import { extractDocument, type ExtractedInformation } from "@/lib/documentService";
import { speechToText, type SpeechState } from "@/lib/speechService";
import { speak, cancelSpeech } from "@/lib/ttsService";
import { languageOptions, makeT, type T, type Lang } from "@/lib/i18n";
import {
  createSession, getSession, updateSession,
  type MediSession,
} from "@/lib/sessionService";

export const Route = createFileRoute("/mobile")({
  head: () => ({
    meta: [
      { title: "MediKiosk — Mobile Pre-Consultation" },
      { name: "description", content: "Complete your pre-consultation on your phone before reaching the OPD counter." },
      { name: "viewport", content: "width=device-width, initial-scale=1, maximum-scale=1" },
    ],
  }),
  component: MobilePage,
  validateSearch: (search: Record<string, unknown>) => ({
    session: typeof search.session === "string" ? search.session : undefined,
  }),
});

// ─── Types (shared with kiosk) ────────────────────────────────────────────────

type MobileView =
  | "loading"
  | "welcome"
  | "resume"
  | "consent"
  | "details"
  | "interview"
  | "documents"
  | "complete";

type Complaint = "Fever" | "Abdominal pain" | "Headache" | "Cough" | "Chest pain";

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

// ─── Main component ───────────────────────────────────────────────────────────

function MobilePage() {
  const { session: sessionParam } = useSearch({ from: "/mobile" });

  const [view, setView] = useState<MobileView>("loading");
  const [session, setSession] = useState<MediSession | null>(null);
  const [lang, setLang] = useState<Lang>("en");
  const t = makeT(lang);

  const [consent, setConsent] = useState(false);
  const [details, setDetails] = useState({ name: "", age: "", gender: "", complaint: "Abdominal pain" as Complaint });
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [speechState, setSpeechState] = useState<SpeechState>("idle");
  const [transcription, setTranscription] = useState("");
  const [pendingVoice, setPendingVoice] = useState<string | null>(null);
  const [documents, setDocuments] = useState<string[]>([]);
  const [extracted, setExtracted] = useState<ExtractedInformation | null>(null);
  const [processing, setProcessing] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const questions = interviewQuestions[details.complaint];
  const currentQuestion = questions[questionIndex] ?? { question: "What would you like to tell us?", choices: [] };
  const hasRedFlag = details.complaint === "Chest pain" &&
    Object.values(answers).some((a) => ["Severe", "Yes"].includes(a));

  // ── Boot: resolve session ─────────────────────────────────────────────────
  useEffect(() => {
    const init = async () => {
      try {
        if (sessionParam) {
          // Attempt to resume existing session
          const existing = await getSession(sessionParam.toUpperCase());
          if (existing) {
            setSession(existing);
            setLang((existing.lang as Lang) ?? "en");
            // Hydrate any already-saved data
            const d = existing.data;
            if (d.name || d.age || d.gender || d.complaint) {
              setDetails({
                name: (d.name as string) ?? "",
                age: (d.age as string) ?? "",
                gender: (d.gender as string) ?? "",
                complaint: (d.complaint as Complaint) ?? "Abdominal pain",
              });
            }
            if (d.answers) setAnswers(d.answers as Record<number, string>);
            setView(existing.status === "complete" ? "complete" : "resume");
          } else {
            setLoadError("This session has expired or was not found. Starting a new session.");
            const s = await createSession("mobile");
            setSession(s);
            setView("welcome");
          }
        } else {
          // Fresh mobile visit
          const s = await createSession("mobile");
          setSession(s);
          setView("welcome");
        }
      } catch {
        setView("welcome");
      }
    };
    init();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist progress whenever details/answers change
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (!session) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      updateSession(session.id, {
        status: "in-progress",
        lang,
        data: { ...details, answers },
      }).catch(() => {/* best-effort */});
    }, 1500);
    return () => { if (saveTimer.current) clearTimeout(saveTimer.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [details, answers, lang]);

  // ── Speech ────────────────────────────────────────────────────────────────
  const startSpeech = async () => {
    setSpeechState("listening");
    setPendingVoice(null);
    const result = await speechToText(lang, setSpeechState);
    const rawText = result.text.trim();
    setTranscription(rawText);
    setSpeechState("result");

    const choices = currentQuestion.choices ?? [];
    if (choices.length > 0 && rawText) {
      const normalized = rawText.toLowerCase();
      const matched = choices.find((c) => {
        const tr = t(c).toLowerCase();
        return normalized === tr || tr.includes(normalized) || normalized.includes(tr) ||
          c.toLowerCase().includes(normalized) || normalized.includes(c.toLowerCase());
      });
      if (matched) {
        setAnswers((a) => ({ ...a, [questionIndex]: matched }));
        setPendingVoice(null);
      } else {
        setPendingVoice(rawText);
      }
    } else if (rawText) {
      setAnswers((a) => ({ ...a, [questionIndex]: rawText }));
    }
  };

  const finishSession = async () => {
    if (session) {
      await updateSession(session.id, {
        status: "complete",
        data: { ...details, answers },
      }).catch(() => {});
    }
    setView("complete");
  };

  const processDocuments = async () => {
    setProcessing(true);
    const result = await extractDocument(documents[0] ?? "demo.pdf");
    setExtracted(result);
    setProcessing(false);
  };

  // ── Render ────────────────────────────────────────────────────────────────

  if (view === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-teal-50 to-white">
        <div className="text-center">
          <div className="mx-auto size-14 animate-spin rounded-full border-4 border-kiosk-teal border-t-transparent" />
          <p className="mt-4 text-sm font-bold text-kiosk-navy">Loading your session…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50/60 via-white to-orange-50/30 text-foreground">
      {/* Mobile header */}
      <header className="sticky top-0 z-30 border-b border-border/40 bg-white/90 backdrop-blur-sm px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="MediKiosk" className="size-8 rounded-xl object-contain" />
            <div>
              <p className="text-sm font-black text-kiosk-navy">MediKiosk</p>
              <p className="text-[9px] font-bold uppercase tracking-widest text-kiosk-teal/70">Mobile intake</p>
            </div>
          </div>
          {session && (
            <div className="flex items-center gap-1.5 rounded-full bg-kiosk-teal/10 px-2.5 py-1">
              <Smartphone size={11} className="text-kiosk-teal" />
              <span className="font-mono text-[11px] font-black text-kiosk-teal tracking-widest">{session.id}</span>
            </div>
          )}
        </div>
      </header>

      {loadError && (
        <div className="mx-4 mt-3 flex items-center gap-2 rounded-xl bg-kiosk-yellow/20 border border-kiosk-yellow/30 px-3 py-2 text-xs font-bold text-kiosk-navy">
          <AlertTriangle size={14} className="shrink-0 text-kiosk-yellow" /> {loadError}
        </div>
      )}

      <main className="mx-auto max-w-lg px-4 pb-20 pt-4">
        {view === "welcome" && (
          <MobileWelcome t={t} lang={lang} setLang={setLang} sessionId={session?.id}
            onStart={() => setView("consent")} />
        )}
        {view === "resume" && (
          <MobileResume t={t} session={session!} details={details}
            onContinue={() => setView("details")} onFresh={async () => {
              const s = await createSession("mobile", lang);
              setSession(s);
              setDetails({ name: "", age: "", gender: "", complaint: "Abdominal pain" });
              setAnswers({});
              setView("welcome");
            }} />
        )}
        {view === "consent" && (
          <MobileConsent t={t} lang={lang} consent={consent} setConsent={setConsent}
            onBack={() => setView("welcome")} onContinue={() => setView("details")} />
        )}
        {view === "details" && (
          <MobileDetails t={t} lang={lang} details={details} setDetails={setDetails}
            onBack={() => setView("consent")} onContinue={() => setView("interview")} />
        )}
        {view === "interview" && (
          <MobileInterview
            t={t} lang={lang} details={details} currentQuestion={currentQuestion}
            questionIndex={questionIndex} questions={questions} answers={answers}
            setAnswer={(a) => { setAnswers((prev) => ({ ...prev, [questionIndex]: a })); setPendingVoice(null); }}
            pendingVoice={pendingVoice}
            onConfirmVoice={() => { if (pendingVoice) { setAnswers((a) => ({ ...a, [questionIndex]: pendingVoice })); setPendingVoice(null); } }}
            onRejectVoice={() => { setPendingVoice(null); setSpeechState("idle"); }}
            speechState={speechState} transcription={transcription} startSpeech={startSpeech}
            hasRedFlag={hasRedFlag}
            onBack={() => setView("details")}
            onNext={() => {
              setPendingVoice(null);
              questionIndex < questions.length - 1
                ? setQuestionIndex((i) => i + 1)
                : setView("documents");
            }}
          />
        )}
        {view === "documents" && (
          <MobileDocuments t={t} documents={documents} setDocuments={setDocuments}
            processing={processing} extracted={extracted}
            processDocuments={processDocuments}
            onBack={() => setView("interview")} onContinue={finishSession} />
        )}
        {view === "complete" && (
          <MobileComplete t={t} sessionId={session?.id ?? ""} name={details.name} />
        )}
      </main>
    </div>
  );
}

// ─── Mobile sub-screens ───────────────────────────────────────────────────────

function MobileWelcome({ t, lang, setLang, sessionId, onStart }: {
  t: T; lang: Lang; setLang: (l: Lang) => void; sessionId?: string; onStart: () => void;
}) {
  return (
    <div className="mk-rise space-y-6 pt-2">
      <div className="text-center">
        <div className="relative mx-auto mb-4 size-20">
          <img src="/logo.png" alt="MediKiosk" className="size-20 rounded-[18px] object-contain drop-shadow-xl" />
          <span className="absolute -bottom-1 -right-1 grid size-7 place-items-center rounded-xl bg-kiosk-coral text-white shadow-md">
            <HeartPulse size={14} />
          </span>
        </div>
        <h1 className="text-3xl font-black tracking-tight text-kiosk-navy">MediKiosk</h1>
        <p className="mt-1 text-sm font-bold text-kiosk-teal">{t("AI-assisted pre-consultation")}</p>
        <p className="mt-3 text-sm font-medium leading-relaxed text-foreground/60 max-w-xs mx-auto">
          Complete your pre-consultation on your phone before reaching the OPD counter.
        </p>
      </div>

      {/* Session ID badge */}
      {sessionId && (
        <div className="flex items-center justify-center gap-2 rounded-2xl bg-kiosk-teal/8 border border-kiosk-teal/20 px-4 py-3">
          <Smartphone size={16} className="text-kiosk-teal" />
          <div>
            <p className="text-[10px] font-black uppercase tracking-wide text-foreground/45">Your session ID</p>
            <p className="font-mono text-xl font-black tracking-[0.25em] text-kiosk-teal">{sessionId}</p>
          </div>
        </div>
      )}

      {/* Language */}
      <div>
        <p className="mb-2 text-center text-xs font-black uppercase tracking-[0.18em] text-foreground/40">{t("Choose your language")}</p>
        <div className="grid grid-cols-3 gap-2">
          {languageOptions.map((item) => (
            <Button key={item.code} variant={lang === item.code ? "default" : "outline"}
              onClick={() => setLang(item.code)}
              className={`min-h-12 rounded-2xl text-sm font-black transition-all ${lang === item.code ? "bg-kiosk-teal text-white shadow-lg shadow-kiosk-teal/30 hover:bg-kiosk-teal/90" : "border-border/60 bg-white text-kiosk-navy hover:border-kiosk-teal/40"}`}>
              {item.label}
            </Button>
          ))}
        </div>
      </div>

      <Button onClick={onStart} className="min-h-14 w-full rounded-2xl bg-kiosk-coral text-lg font-black text-white shadow-xl shadow-kiosk-coral/35 hover:bg-kiosk-coral/90">
        {t("Start")} <ChevronRight size={22} />
      </Button>

      <div className="flex items-center justify-center gap-2 text-xs font-semibold text-foreground/45">
        <ShieldCheck size={12} className="text-kiosk-green" />
        {t("Safe, simple, patient-first · This kiosk does not provide a diagnosis")}
      </div>
    </div>
  );
}

function MobileResume({ t, session, details, onContinue, onFresh }: {
  t: T; session: MediSession; details: { name: string; age: string; gender: string; complaint: string };
  onContinue: () => void; onFresh: () => void;
}) {
  const pct = Math.round(
    ([details.name, details.age, details.gender, details.complaint].filter(Boolean).length / 4) * 100
  );
  return (
    <div className="mk-rise space-y-5 pt-2">
      <div className="text-center">
        <div className="mx-auto mb-3 grid size-16 place-items-center rounded-full bg-kiosk-teal/10">
          <Smartphone size={30} className="text-kiosk-teal" />
        </div>
        <h1 className="text-2xl font-black text-kiosk-navy">Session found</h1>
        <p className="mt-1 text-sm font-medium text-foreground/55">
          A session <span className="font-mono font-black text-kiosk-teal">{session.id}</span> started from the kiosk. Continue where you left off.
        </p>
      </div>

      <div className="rounded-2xl border border-kiosk-teal/20 bg-kiosk-teal/5 p-4">
        <p className="text-xs font-black uppercase tracking-wide text-foreground/45 mb-2">Progress saved</p>
        <div className="h-2 rounded-full bg-border overflow-hidden mb-3">
          <div className="h-full rounded-full bg-kiosk-teal transition-all" style={{ width: `${pct}%` }} />
        </div>
        <div className="space-y-1 text-sm font-medium text-kiosk-navy">
          {details.name && <p>👤 {details.name}{details.age ? `, ${details.age}y` : ""}</p>}
          {details.gender && <p>⚧ {details.gender}</p>}
          {details.complaint && <p>🩺 {details.complaint}</p>}
        </div>
      </div>

      <Button onClick={onContinue} className="min-h-14 w-full rounded-2xl bg-kiosk-teal text-base font-black text-white shadow-lg shadow-kiosk-teal/25 hover:bg-kiosk-teal/90">
        Continue from here <ArrowRight size={20} />
      </Button>
      <Button variant="outline" onClick={onFresh} className="min-h-12 w-full rounded-2xl border-border font-bold text-kiosk-navy hover:bg-kiosk-coral/5 hover:border-kiosk-coral/30">
        Start fresh instead
      </Button>
    </div>
  );
}

function MobileConsent({ t, lang, consent, setConsent, onBack, onContinue }: {
  t: T; lang: Lang; consent: boolean; setConsent: (b: boolean) => void; onBack: () => void; onContinue: () => void;
}) {
  const text = t("Can we collect your health details?") + ". " +
    t("We will use your answers and previous records to prepare your consultation history.");
  return (
    <div className="mk-rise space-y-5">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.18em] text-kiosk-coral mb-1">Step 1 · Privacy</p>
        <h2 className="text-2xl font-black text-kiosk-navy">{t("Can we collect your health details?")}</h2>
        <p className="mt-2 text-sm font-medium leading-relaxed text-foreground/60">
          {t("We will use your answers and previous records to prepare your consultation history.")}
        </p>
      </div>
      <Button variant="outline" onClick={() => speak(text, lang)}
        className="flex items-center gap-2 rounded-xl border-kiosk-sky/30 text-sm font-bold text-kiosk-navy">
        <Volume2 size={16} className="text-kiosk-sky" /> {t("Hear this")}
      </Button>
      <label className="flex min-h-14 cursor-pointer items-center gap-3 rounded-2xl bg-kiosk-teal/5 border border-kiosk-teal/20 p-4 text-sm font-bold text-kiosk-navy hover:bg-kiosk-teal/10">
        <Checkbox checked={consent} onCheckedChange={(v) => setConsent(v === true)}
          className="size-6 border-kiosk-teal data-[state=checked]:bg-kiosk-teal" />
        {t("I agree to continue")}
      </label>
      <div className="flex items-center gap-2 rounded-xl bg-kiosk-yellow/20 border border-kiosk-yellow/30 px-3 py-2 text-xs font-bold text-kiosk-navy">
        <AlertTriangle size={14} className="text-kiosk-yellow shrink-0" />
        {t("This prototype does not provide medical diagnosis.")}
      </div>
      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="min-h-12 rounded-2xl px-5 font-bold"><ArrowLeft size={16} /> {t("Back")}</Button>
        <Button onClick={onContinue} disabled={!consent} className="flex-1 min-h-12 rounded-2xl bg-kiosk-teal font-black text-white shadow-lg shadow-kiosk-teal/25 hover:bg-kiosk-teal/90 disabled:opacity-40">
          {t("Continue")} <ArrowRight size={16} />
        </Button>
      </div>
    </div>
  );
}

function MobileDetails({ t, lang, details, setDetails, onBack, onContinue }: {
  t: T; lang: Lang;
  details: { name: string; age: string; gender: string; complaint: Complaint };
  setDetails: React.Dispatch<React.SetStateAction<{ name: string; age: string; gender: string; complaint: Complaint }>>;
  onBack: () => void; onContinue: () => void;
}) {
  return (
    <div className="mk-rise space-y-5">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.18em] text-kiosk-coral mb-1">Step 2 · About you</p>
        <h2 className="text-2xl font-black text-kiosk-navy">{t("Tell us about yourself")}</h2>
      </div>
      <div className="space-y-4">
        <div>
          <label className="text-xs font-black uppercase tracking-wide text-foreground/50">{t("Your name")}</label>
          <Input value={details.name} onChange={(e) => setDetails((d) => ({ ...d, name: e.target.value }))}
            placeholder={t("Type your name")} className="mt-2 min-h-14 rounded-2xl bg-white border-border/60 text-lg font-medium focus-visible:ring-kiosk-teal" />
        </div>
        <div>
          <label className="text-xs font-black uppercase tracking-wide text-foreground/50">{t("Your age")}</label>
          <Input inputMode="numeric" value={details.age} onChange={(e) => setDetails((d) => ({ ...d, age: e.target.value }))}
            placeholder={t("Example: 52")} className="mt-2 min-h-14 rounded-2xl bg-white border-border/60 text-lg font-medium focus-visible:ring-kiosk-teal" />
        </div>
        <div>
          <p className="text-xs font-black uppercase tracking-wide text-foreground/50 mb-2">{t("I am")}</p>
          <div className="grid grid-cols-3 gap-2">
            {["Male", "Female", "Other"].map((item) => (
              <Button key={item} variant={details.gender === item ? "default" : "outline"}
                onClick={() => setDetails((d) => ({ ...d, gender: item }))}
                className={`min-h-12 rounded-2xl text-sm font-bold ${details.gender === item ? "bg-kiosk-teal text-white shadow-lg shadow-kiosk-teal/25 hover:bg-kiosk-teal/90" : "bg-white border-border/60 text-kiosk-navy hover:border-kiosk-teal/40"}`}>
                {t(item)}
              </Button>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs font-black uppercase tracking-wide text-foreground/50 mb-2">{t("Main problem")}</p>
          <div className="grid grid-cols-2 gap-2">
            {(Object.keys(interviewQuestions) as Complaint[]).map((item) => (
              <Button key={item} variant={details.complaint === item ? "default" : "outline"}
                onClick={() => setDetails((d) => ({ ...d, complaint: item }))}
                className={`min-h-12 justify-start rounded-2xl px-3 text-xs font-bold ${details.complaint === item ? "bg-kiosk-coral text-white shadow-lg shadow-kiosk-coral/25 hover:bg-kiosk-coral/90" : "bg-white border-border/60 text-kiosk-navy hover:border-kiosk-coral/30"}`}>
                {t(item)}
              </Button>
            ))}
          </div>
        </div>
      </div>
      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="min-h-12 rounded-2xl px-5 font-bold"><ArrowLeft size={16} /> {t("Back")}</Button>
        <Button onClick={onContinue} disabled={!details.name || !details.age || !details.gender}
          className="flex-1 min-h-12 rounded-2xl bg-kiosk-teal font-black text-white shadow-lg shadow-kiosk-teal/25 hover:bg-kiosk-teal/90 disabled:opacity-40">
          {t("Continue")} <ArrowRight size={16} />
        </Button>
      </div>
    </div>
  );
}

function MobileInterview({ t, lang, details, currentQuestion, questionIndex, questions, answers,
  setAnswer, pendingVoice, onConfirmVoice, onRejectVoice,
  speechState, transcription, startSpeech, hasRedFlag, onBack, onNext,
}: {
  t: T; lang: Lang;
  details: { name: string; age: string; gender: string; complaint: Complaint };
  currentQuestion: { question: string; choices?: string[] };
  questionIndex: number; questions: { question: string; choices?: string[] }[];
  answers: Record<number, string>; setAnswer: (a: string) => void;
  pendingVoice: string | null; onConfirmVoice: () => void; onRejectVoice: () => void;
  speechState: SpeechState; transcription: string; startSpeech: () => void;
  hasRedFlag: boolean; onBack: () => void; onNext: () => void;
}) {
  const total = questions.length;
  return (
    <div className="mk-rise space-y-5">
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-kiosk-coral">Step 3 · Questions</p>
          <span className="text-xs font-bold text-foreground/45">{questionIndex + 1} / {total}</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-border mb-4">
          <div className="h-full rounded-full bg-kiosk-teal transition-all" style={{ width: `${((questionIndex + 1) / total) * 100}%` }} />
        </div>
        <h2 className="text-xl font-black text-kiosk-navy leading-snug">{t(currentQuestion.question)}</h2>
      </div>

      {currentQuestion.choices && (
        <div className="space-y-2">
          {currentQuestion.choices.map((choice) => (
            <button key={choice} onClick={() => setAnswer(choice)}
              className={`w-full flex items-center gap-3 min-h-14 rounded-2xl border-2 px-4 text-left text-sm font-bold transition-all ${answers[questionIndex] === choice ? "border-kiosk-teal bg-kiosk-teal/10 text-kiosk-navy" : "border-border/50 bg-white text-kiosk-navy hover:border-kiosk-teal/40"}`}>
              <div className={`size-5 rounded-full border-2 flex items-center justify-center shrink-0 ${answers[questionIndex] === choice ? "border-kiosk-teal bg-kiosk-teal" : "border-border"}`}>
                {answers[questionIndex] === choice && <Check size={11} className="text-white" strokeWidth={3} />}
              </div>
              {t(choice)}
            </button>
          ))}
        </div>
      )}

      {pendingVoice && (
        <div className="rounded-2xl border-2 border-kiosk-yellow/50 bg-kiosk-yellow/10 p-4">
          <p className="text-xs font-black uppercase text-kiosk-yellow/80 mb-1">🎙 {t("Did you mean this?")}</p>
          <p className="text-lg font-black text-kiosk-navy">"{pendingVoice}"</p>
          <div className="mt-3 flex gap-2">
            <Button onClick={onConfirmVoice} size="sm" className="flex-1 rounded-xl bg-kiosk-teal text-white font-black hover:bg-kiosk-teal/90">
              <CheckCircle2 size={15} /> {t("Yes, that's correct")}
            </Button>
            <Button variant="outline" onClick={onRejectVoice} size="sm" className="flex-1 rounded-xl font-bold">
              <RefreshCw size={14} /> {t("Try again")}
            </Button>
          </div>
        </div>
      )}

      {/* Mic */}
      <div className={`flex items-center gap-4 rounded-2xl p-4 ${speechState === "listening" ? "bg-kiosk-coral/10 border-2 border-kiosk-coral/30" : "bg-kiosk-sky/8 border border-kiosk-sky/20"}`}>
        <button onClick={startSpeech} disabled={speechState === "listening" || speechState === "processing"}
          aria-label="Speak"
          className={`size-14 shrink-0 rounded-full text-white flex items-center justify-center shadow-xl transition-all disabled:opacity-60 ${speechState === "listening" ? "bg-kiosk-coral ring-8 ring-kiosk-coral/25 scale-110" : "bg-kiosk-coral hover:scale-105"}`}>
          <Mic size={22} />
        </button>
        <div>
          <p className="text-sm font-black text-kiosk-navy">
            {speechState === "listening" ? t("Listening…") : speechState === "processing" ? t("Understanding…") : t("Speak")}
          </p>
          {transcription && <p className="text-xs text-foreground/50 mt-0.5">{transcription}</p>}
        </div>
      </div>

      {hasRedFlag && (
        <div className="flex items-start gap-3 rounded-2xl border-2 border-kiosk-coral/30 bg-kiosk-coral/8 p-4">
          <AlertTriangle size={20} className="shrink-0 text-kiosk-coral mt-0.5" />
          <div>
            <p className="text-sm font-black text-kiosk-navy">{t("Potential red flag detected.")}</p>
            <p className="text-xs font-medium text-foreground/65">{t("Please alert medical staff. This is not a diagnosis.")}</p>
          </div>
        </div>
      )}

      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="min-h-12 rounded-2xl px-5 font-bold"><ArrowLeft size={16} /></Button>
        <Button onClick={onNext} disabled={!answers[questionIndex] && !pendingVoice}
          className="flex-1 min-h-12 rounded-2xl bg-kiosk-teal font-black text-white shadow-lg shadow-kiosk-teal/25 hover:bg-kiosk-teal/90 disabled:opacity-40">
          {questionIndex === total - 1 ? t("Next: records") : t("Next question")} <ArrowRight size={16} />
        </Button>
      </div>
    </div>
  );
}

function MobileDocuments({ t, documents, setDocuments, processing, extracted, processDocuments, onBack, onContinue }: {
  t: T; documents: string[];
  setDocuments: React.Dispatch<React.SetStateAction<string[]>>;
  processing: boolean; extracted: ExtractedInformation | null;
  processDocuments: () => void; onBack: () => void; onContinue: () => void;
}) {
  const addDoc = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setDocuments((d) => [...d, file.name]);
  };
  return (
    <div className="mk-rise space-y-5">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.18em] text-kiosk-coral mb-1">Step 4 · Documents</p>
        <h2 className="text-2xl font-black text-kiosk-navy">{t("Do you have old medical papers?")}</h2>
        <p className="mt-1 text-sm font-medium text-foreground/55">Upload photos of prescriptions or lab reports.</p>
      </div>

      <label className="flex min-h-28 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-kiosk-teal/35 bg-kiosk-teal/5 transition-all hover:border-kiosk-teal/60">
        <Upload className="mb-2 text-kiosk-teal" size={24} />
        <span className="text-sm font-black text-kiosk-navy">Tap to upload</span>
        <span className="mt-1 text-xs font-medium text-foreground/45">PDF · JPG · PNG</span>
        <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={addDoc} />
      </label>

      {documents.map((doc, i) => (
        <div key={i} className="flex items-center gap-3 rounded-2xl border border-border/50 bg-white px-4 py-3 shadow-sm">
          {doc.endsWith(".pdf") ? <FileText size={18} className="text-kiosk-teal" /> : <FileImage size={18} className="text-kiosk-teal" />}
          <span className="flex-1 text-sm font-bold text-kiosk-navy">{doc}</span>
          <button onClick={() => setDocuments((d) => d.filter((_, j) => j !== i))} className="text-foreground/30 hover:text-kiosk-coral">
            <X size={15} />
          </button>
        </div>
      ))}

      {documents.length > 0 && !extracted && (
        <Button onClick={processDocuments} disabled={processing} variant="outline"
          className="w-full min-h-12 rounded-2xl border-kiosk-teal/40 font-bold text-kiosk-navy hover:bg-kiosk-teal/5">
          {processing ? <><RefreshCw size={16} className="animate-spin" /> Processing…</> : "Extract information"}
        </Button>
      )}

      {extracted && (
        <div className="rounded-2xl bg-kiosk-teal/5 border border-kiosk-teal/20 p-4 space-y-2">
          <p className="text-xs font-black uppercase text-kiosk-teal">Extracted</p>
          {extracted.conditions.length > 0 && <p className="text-sm font-bold text-kiosk-navy">Conditions: {extracted.conditions.join(", ")}</p>}
          {extracted.medications.length > 0 && <p className="text-sm font-bold text-kiosk-navy">Medicines: {extracted.medications.join(", ")}</p>}
        </div>
      )}

      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="min-h-12 rounded-2xl px-5 font-bold"><ArrowLeft size={16} /></Button>
        <Button onClick={onContinue} className="flex-1 min-h-12 rounded-2xl bg-kiosk-teal font-black text-white shadow-lg shadow-kiosk-teal/25 hover:bg-kiosk-teal/90">
          Finish & submit <ArrowRight size={16} />
        </Button>
      </div>
    </div>
  );
}

function MobileComplete({ t, sessionId, name }: { t: T; sessionId: string; name: string }) {
  return (
    <div className="mk-rise flex min-h-[70vh] flex-col items-center justify-center text-center py-10 space-y-6">
      <div className="grid size-24 place-items-center rounded-full bg-kiosk-green/15 text-kiosk-green ring-8 ring-kiosk-green/10">
        <Check size={48} strokeWidth={2.5} />
      </div>
      <div>
        <p className="text-xs font-black uppercase tracking-[0.2em] text-kiosk-green">Pre-consultation complete</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-kiosk-navy">
          {name ? `${name}, you're ready!` : "You're ready!"}
        </h1>
        <p className="mt-3 text-sm font-medium leading-relaxed text-foreground/55 max-w-xs mx-auto">
          Your clinical history is ready for your doctor. Please proceed to the OPD counter and mention your session ID.
        </p>
      </div>

      <div className="w-full rounded-2xl border border-kiosk-teal/20 bg-kiosk-teal/5 p-5">
        <p className="text-xs font-black uppercase tracking-wide text-foreground/40">Your session ID</p>
        <p className="mt-1 font-mono text-4xl font-black tracking-[0.3em] text-kiosk-coral">{sessionId}</p>
        <p className="mt-1 text-xs font-medium text-foreground/40">Show this to hospital staff or scan at the kiosk</p>
      </div>

      <div className="flex items-center gap-2 text-xs font-semibold text-foreground/40">
        <ShieldCheck size={13} className="text-kiosk-green" />
        No diagnosis provided · For physician review only
      </div>
    </div>
  );
}

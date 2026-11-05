import { i as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, o as require_react } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { n as Input, t as Button } from "./input-BZBVMCdW.mjs";
import { B as ArrowLeft, D as FileText, E as HeartPulse, M as ChevronRight, N as Check, O as FileImage, b as Mic, d as ShieldCheck, h as RefreshCw, j as CircleCheck, n as Volume2, o as Upload, s as TriangleAlert, t as X, u as Smartphone, z as ArrowRight } from "../_libs/lucide-react.mjs";
import { a as makeT, i as languageOptions, o as speak, r as extractDocument, s as speechToText, t as Checkbox } from "./i18n-BJRXaFO7.mjs";
import { f as useSearch } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/mobile-2uI_CqhY.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var SESSION_KEY = "MediEase_session_id";
function setLocalSessionId(id) {
	try {
		localStorage.setItem(SESSION_KEY, id);
	} catch {}
}
/** Create a new session on the server and persist its ID locally. */
async function createSession(channel, lang = "en") {
	const res = await fetch("/api/session", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			channel,
			lang
		})
	});
	if (!res.ok) throw new Error(`Session create failed: ${res.status}`);
	const session = await res.json();
	setLocalSessionId(session.id);
	return session;
}
/** Fetch an existing session by ID. Returns null if not found / expired. */
async function getSession(id) {
	const res = await fetch(`/api/session?id=${encodeURIComponent(id)}`);
	if (res.status === 404) return null;
	if (!res.ok) throw new Error(`Session fetch failed: ${res.status}`);
	return await res.json();
}
/** Patch a session's data (partial update). */
async function updateSession(id, patch) {
	const res = await fetch("/api/session", {
		method: "PATCH",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			id,
			...patch
		})
	});
	if (!res.ok) throw new Error(`Session update failed: ${res.status}`);
	return await res.json();
}
/**
* /mobile â€” Patient's personal phone intake
*
* Entry points:
*   /mobile                  â†’ fresh mobile session (language select â†’ full intake)
*   /mobile?session=XXXX     â†’ resume an existing session (kioskâ†’phone handoff)
*
* This is the SAME clinical intake engine as the kiosk.
* Only differences: optimised for small screens, no kiosk chrome,
* session ID shown prominently, channel = "mobile".
*/
var allergyQuestions = [{
	question: "Do you have any known allergies?",
	choices: [
		"No known allergies",
		"Medicine allergy",
		"Food allergy",
		"Dust / Pollen allergy",
		"Not sure"
	]
}, {
	question: "Are you allergic to any medicines?",
	choices: [
		"No",
		"Yes â€” Penicillin / Antibiotics",
		"Yes â€” Painkillers (NSAIDs)",
		"Yes â€” Other medicines"
	]
}];
var interviewQuestions = {
	"Abdominal pain": [
		{
			question: "What is your main problem?",
			choices: [
				"Pain in my stomach",
				"Burning feeling",
				"Something else"
			]
		},
		{
			question: "Where exactly is the pain?",
			choices: [
				"Upper abdomen",
				"Around the navel",
				"Lower abdomen",
				"All over"
			]
		},
		{
			question: "When did it start?",
			choices: [
				"Today",
				"Yesterday",
				"A few days ago",
				"More than a week ago"
			]
		},
		{
			question: "How severe is the pain?",
			choices: [
				"Mild",
				"Moderate",
				"Severe"
			]
		},
		{
			question: "Do you have vomiting?",
			choices: ["No", "Yes"]
		},
		{
			question: "Any change in bowel movement?",
			choices: [
				"No change",
				"Loose motion",
				"Constipation"
			]
		},
		...allergyQuestions
	],
	Fever: [
		{
			question: "When did the fever start?",
			choices: [
				"Today",
				"Yesterday",
				"A few days ago"
			]
		},
		{
			question: "How high was the fever?",
			choices: [
				"I do not know",
				"Mild",
				"High"
			]
		},
		{
			question: "Do you have cough?",
			choices: ["No", "Yes"]
		},
		{
			question: "Do you have body pain?",
			choices: ["No", "Yes"]
		},
		{
			question: "Do you have vomiting?",
			choices: ["No", "Yes"]
		},
		...allergyQuestions
	],
	Headache: [
		{
			question: "When did the headache start?",
			choices: [
				"Today",
				"Yesterday",
				"A few days ago"
			]
		},
		{
			question: "Where is the pain?",
			choices: [
				"Front",
				"Back",
				"One side",
				"All over"
			]
		},
		{
			question: "How severe is it?",
			choices: [
				"Mild",
				"Moderate",
				"Severe"
			]
		},
		{
			question: "Do you feel dizzy?",
			choices: ["No", "Yes"]
		},
		...allergyQuestions
	],
	Cough: [
		{
			question: "When did the cough start?",
			choices: [
				"Today",
				"A few days ago",
				"More than a week ago"
			]
		},
		{
			question: "Is there mucus?",
			choices: [
				"No",
				"Yes",
				"I am not sure"
			]
		},
		{
			question: "Do you have fever?",
			choices: ["No", "Yes"]
		},
		{
			question: "Do you feel breathless?",
			choices: ["No", "Yes"]
		},
		...allergyQuestions
	],
	"Chest pain": [
		{
			question: "How severe is the chest pain?",
			choices: [
				"Mild",
				"Moderate",
				"Severe"
			]
		},
		{
			question: "Do you feel breathless?",
			choices: ["No", "Yes"]
		},
		{
			question: "Have you fainted or felt like fainting?",
			choices: ["No", "Yes"]
		},
		{
			question: "Does it spread to your arm or jaw?",
			choices: ["No", "Yes"]
		},
		...allergyQuestions
	]
};
function MobilePage() {
	const { session: sessionParam } = useSearch({ from: "/mobile" });
	const [view, setView] = (0, import_react.useState)("loading");
	const [session, setSession] = (0, import_react.useState)(null);
	const [lang, setLang] = (0, import_react.useState)("en");
	const t = makeT(lang);
	const [consent, setConsent] = (0, import_react.useState)(false);
	const [details, setDetails] = (0, import_react.useState)({
		name: "",
		age: "",
		gender: "",
		complaint: "Abdominal pain"
	});
	const [questionIndex, setQuestionIndex] = (0, import_react.useState)(0);
	const [answers, setAnswers] = (0, import_react.useState)({});
	const [speechState, setSpeechState] = (0, import_react.useState)("idle");
	const [transcription, setTranscription] = (0, import_react.useState)("");
	const [pendingVoice, setPendingVoice] = (0, import_react.useState)(null);
	const [documents, setDocuments] = (0, import_react.useState)([]);
	const [extracted, setExtracted] = (0, import_react.useState)(null);
	const [processing, setProcessing] = (0, import_react.useState)(false);
	const [loadError, setLoadError] = (0, import_react.useState)(null);
	const questions = interviewQuestions[details.complaint];
	const currentQuestion = questions[questionIndex] ?? {
		question: "What would you like to tell us?",
		choices: []
	};
	const hasRedFlag = details.complaint === "Chest pain" && Object.values(answers).some((a) => ["Severe", "Yes"].includes(a));
	(0, import_react.useEffect)(() => {
		const init = async () => {
			try {
				if (sessionParam) {
					const existing = await getSession(sessionParam.toUpperCase());
					if (existing) {
						setSession(existing);
						setLang(existing.lang ?? "en");
						const d = existing.data;
						if (d.name || d.age || d.gender || d.complaint) setDetails({
							name: d.name ?? "",
							age: d.age ?? "",
							gender: d.gender ?? "",
							complaint: d.complaint ?? "Abdominal pain"
						});
						if (d.answers) setAnswers(d.answers);
						setView(existing.status === "complete" ? "complete" : "resume");
					} else {
						setLoadError("This session has expired or was not found. Starting a new session.");
						const s = await createSession("mobile");
						setSession(s);
						setView("welcome");
					}
				} else {
					const s = await createSession("mobile");
					setSession(s);
					setView("welcome");
				}
			} catch {
				setView("welcome");
			}
		};
		init();
	}, []);
	const saveTimer = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		if (!session) return;
		if (saveTimer.current) clearTimeout(saveTimer.current);
		saveTimer.current = setTimeout(() => {
			updateSession(session.id, {
				status: "in-progress",
				lang,
				data: {
					...details,
					answers
				}
			}).catch(() => {});
		}, 1500);
		return () => {
			if (saveTimer.current) clearTimeout(saveTimer.current);
		};
	}, [
		details,
		answers,
		lang
	]);
	const startSpeech = async () => {
		setSpeechState("listening");
		setPendingVoice(null);
		const rawText = (await speechToText(lang, setSpeechState)).text.trim();
		setTranscription(rawText);
		setSpeechState("result");
		const choices = currentQuestion.choices ?? [];
		if (choices.length > 0 && rawText) {
			const normalized = rawText.toLowerCase();
			const matched = choices.find((c) => {
				const tr = t(c).toLowerCase();
				return normalized === tr || tr.includes(normalized) || normalized.includes(tr) || c.toLowerCase().includes(normalized) || normalized.includes(c.toLowerCase());
			});
			if (matched) {
				setAnswers((a) => ({
					...a,
					[questionIndex]: matched
				}));
				setPendingVoice(null);
			} else setPendingVoice(rawText);
		} else if (rawText) setAnswers((a) => ({
			...a,
			[questionIndex]: rawText
		}));
	};
	const finishSession = async () => {
		if (session) await updateSession(session.id, {
			status: "complete",
			data: {
				...details,
				answers
			}
		}).catch(() => {});
		setView("complete");
	};
	const processDocuments = async () => {
		setProcessing(true);
		const result = await extractDocument(documents[0] ?? "demo.pdf");
		setExtracted(result);
		setProcessing(false);
	};
	if (view === "loading") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-gradient-to-br from-teal-50 to-white",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "text-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mx-auto size-14 animate-spin rounded-full border-4 border-kiosk-teal border-t-transparent" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-sm font-bold text-kiosk-navy",
				children: "Loading your sessionâ€¦"
			})]
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-gradient-to-br from-teal-50/60 via-white to-orange-50/30 text-foreground",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "sticky top-0 z-30 border-b border-border/40 bg-white/90 backdrop-blur-sm px-4 py-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: "/logo.png",
							alt: "MediEase",
							className: "size-8 rounded-xl object-contain"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-black text-kiosk-navy",
							children: "MediEase"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[9px] font-bold uppercase tracking-widest text-kiosk-teal/70",
							children: "Mobile intake"
						})] })]
					}), session && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1.5 rounded-full bg-kiosk-teal/10 px-2.5 py-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Smartphone, {
							size: 11,
							className: "text-kiosk-teal"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono text-[11px] font-black text-kiosk-teal tracking-widest",
							children: session.id
						})]
					})]
				})
			}),
			loadError && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-4 mt-3 flex items-center gap-2 rounded-xl bg-kiosk-yellow/20 border border-kiosk-yellow/30 px-3 py-2 text-xs font-bold text-kiosk-navy",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
						size: 14,
						className: "shrink-0 text-kiosk-yellow"
					}),
					" ",
					loadError
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "mx-auto max-w-lg px-4 pb-20 pt-4",
				children: [
					view === "welcome" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MobileWelcome, {
						t,
						lang,
						setLang,
						sessionId: session?.id,
						onStart: () => setView("consent")
					}),
					view === "resume" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MobileResume, {
						t,
						session,
						details,
						onContinue: () => setView("details"),
						onFresh: async () => {
							const s = await createSession("mobile", lang);
							setSession(s);
							setDetails({
								name: "",
								age: "",
								gender: "",
								complaint: "Abdominal pain"
							});
							setAnswers({});
							setView("welcome");
						}
					}),
					view === "consent" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MobileConsent, {
						t,
						lang,
						consent,
						setConsent,
						onBack: () => setView("welcome"),
						onContinue: () => setView("details")
					}),
					view === "details" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MobileDetails, {
						t,
						lang,
						details,
						setDetails,
						onBack: () => setView("consent"),
						onContinue: () => setView("interview")
					}),
					view === "interview" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MobileInterview, {
						t,
						lang,
						details,
						currentQuestion,
						questionIndex,
						questions,
						answers,
						setAnswer: (a) => {
							setAnswers((prev) => ({
								...prev,
								[questionIndex]: a
							}));
							setPendingVoice(null);
						},
						pendingVoice,
						onConfirmVoice: () => {
							if (pendingVoice) {
								setAnswers((a) => ({
									...a,
									[questionIndex]: pendingVoice
								}));
								setPendingVoice(null);
							}
						},
						onRejectVoice: () => {
							setPendingVoice(null);
							setSpeechState("idle");
						},
						speechState,
						transcription,
						startSpeech,
						hasRedFlag,
						onBack: () => setView("details"),
						onNext: () => {
							setPendingVoice(null);
							questionIndex < questions.length - 1 ? setQuestionIndex((i) => i + 1) : setView("documents");
						}
					}),
					view === "documents" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MobileDocuments, {
						t,
						documents,
						setDocuments,
						processing,
						extracted,
						processDocuments,
						onBack: () => setView("interview"),
						onContinue: finishSession
					}),
					view === "complete" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MobileComplete, {
						t,
						sessionId: session?.id ?? "",
						name: details.name
					})
				]
			})
		]
	});
}
function MobileWelcome({ t, lang, setLang, sessionId, onStart }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mk-rise space-y-6 pt-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative mx-auto mb-4 size-20",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: "/logo.png",
							alt: "MediEase",
							className: "size-20 rounded-[18px] object-contain drop-shadow-xl"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "absolute -bottom-1 -right-1 grid size-7 place-items-center rounded-xl bg-kiosk-coral text-white shadow-md",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeartPulse, { size: 14 })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-3xl font-black tracking-tight text-kiosk-navy",
						children: "MediEase"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm font-bold text-kiosk-teal",
						children: t("AI-assisted pre-consultation")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm font-medium leading-relaxed text-foreground/60 max-w-xs mx-auto",
						children: "Complete your pre-consultation on your phone before reaching the OPD counter."
					})
				]
			}),
			sessionId && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-center gap-2 rounded-2xl bg-kiosk-teal/8 border border-kiosk-teal/20 px-4 py-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Smartphone, {
					size: 16,
					className: "text-kiosk-teal"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[10px] font-black uppercase tracking-wide text-foreground/45",
					children: "Your session ID"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-xl font-black tracking-[0.25em] text-kiosk-teal",
					children: sessionId
				})] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-2 text-center text-xs font-black uppercase tracking-[0.18em] text-foreground/40",
				children: t("Choose your language")
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-3 gap-2",
				children: languageOptions.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: lang === item.code ? "default" : "outline",
					onClick: () => setLang(item.code),
					className: `min-h-12 rounded-2xl text-sm font-black transition-all ${lang === item.code ? "bg-kiosk-teal text-white shadow-lg shadow-kiosk-teal/30 hover:bg-kiosk-teal/90" : "border-border/60 bg-white text-kiosk-navy hover:border-kiosk-teal/40"}`,
					children: item.label
				}, item.code))
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				onClick: onStart,
				className: "min-h-14 w-full rounded-2xl bg-kiosk-coral text-lg font-black text-white shadow-xl shadow-kiosk-coral/35 hover:bg-kiosk-coral/90",
				children: [
					t("Start"),
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { size: 22 })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-center gap-2 text-xs font-semibold text-foreground/45",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, {
					size: 12,
					className: "text-kiosk-green"
				}), t("Safe, simple, patient-first Â· This kiosk does not provide a diagnosis")]
			})
		]
	});
}
function MobileResume({ t, session, details, onContinue, onFresh }) {
	const pct = Math.round([
		details.name,
		details.age,
		details.gender,
		details.complaint
	].filter(Boolean).length / 4 * 100);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mk-rise space-y-5 pt-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mx-auto mb-3 grid size-16 place-items-center rounded-full bg-kiosk-teal/10",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Smartphone, {
							size: 30,
							className: "text-kiosk-teal"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-2xl font-black text-kiosk-navy",
						children: "Session found"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-sm font-medium text-foreground/55",
						children: [
							"A session ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono font-black text-kiosk-teal",
								children: session.id
							}),
							" started from the kiosk. Continue where you left off."
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-kiosk-teal/20 bg-kiosk-teal/5 p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-black uppercase tracking-wide text-foreground/45 mb-2",
						children: "Progress saved"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-2 rounded-full bg-border overflow-hidden mb-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-full rounded-full bg-kiosk-teal transition-all",
							style: { width: `${pct}%` }
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1 text-sm font-medium text-kiosk-navy",
						children: [
							details.name && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
								"ðŸ‘¤ ",
								details.name,
								details.age ? `, ${details.age}y` : ""
							] }),
							details.gender && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["âš§ ", details.gender] }),
							details.complaint && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["ðŸ©º ", details.complaint] })
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				onClick: onContinue,
				className: "min-h-14 w-full rounded-2xl bg-kiosk-teal text-base font-black text-white shadow-lg shadow-kiosk-teal/25 hover:bg-kiosk-teal/90",
				children: ["Continue from here ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { size: 20 })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "outline",
				onClick: onFresh,
				className: "min-h-12 w-full rounded-2xl border-border font-bold text-kiosk-navy hover:bg-kiosk-coral/5 hover:border-kiosk-coral/30",
				children: "Start fresh instead"
			})
		]
	});
}
function MobileConsent({ t, lang, consent, setConsent, onBack, onContinue }) {
	const text = t("Can we collect your health details?") + ". " + t("We will use your answers and previous records to prepare your consultation history.");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mk-rise space-y-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-black uppercase tracking-[0.18em] text-kiosk-coral mb-1",
					children: "Step 1 Â· Privacy"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-2xl font-black text-kiosk-navy",
					children: t("Can we collect your health details?")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm font-medium leading-relaxed text-foreground/60",
					children: t("We will use your answers and previous records to prepare your consultation history.")
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "outline",
				onClick: () => speak(text, lang),
				className: "flex items-center gap-2 rounded-xl border-kiosk-sky/30 text-sm font-bold text-kiosk-navy",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, {
						size: 16,
						className: "text-kiosk-sky"
					}),
					" ",
					t("Hear this")
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "flex min-h-14 cursor-pointer items-center gap-3 rounded-2xl bg-kiosk-teal/5 border border-kiosk-teal/20 p-4 text-sm font-bold text-kiosk-navy hover:bg-kiosk-teal/10",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
					checked: consent,
					onCheckedChange: (v) => setConsent(v === true),
					className: "size-6 border-kiosk-teal data-[state=checked]:bg-kiosk-teal"
				}), t("I agree to continue")]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2 rounded-xl bg-kiosk-yellow/20 border border-kiosk-yellow/30 px-3 py-2 text-xs font-bold text-kiosk-navy",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
					size: 14,
					className: "text-kiosk-yellow shrink-0"
				}), t("This prototype does not provide medical diagnosis.")]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "outline",
					onClick: onBack,
					className: "min-h-12 rounded-2xl px-5 font-bold",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { size: 16 }),
						" ",
						t("Back")
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: onContinue,
					disabled: !consent,
					className: "flex-1 min-h-12 rounded-2xl bg-kiosk-teal font-black text-white shadow-lg shadow-kiosk-teal/25 hover:bg-kiosk-teal/90 disabled:opacity-40",
					children: [
						t("Continue"),
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { size: 16 })
					]
				})]
			})
		]
	});
}
function MobileDetails({ t, lang, details, setDetails, onBack, onContinue }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mk-rise space-y-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-black uppercase tracking-[0.18em] text-kiosk-coral mb-1",
				children: "Step 2 Â· About you"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-2xl font-black text-kiosk-navy",
				children: t("Tell us about yourself")
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "text-xs font-black uppercase tracking-wide text-foreground/50",
						children: t("Your name")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: details.name,
						onChange: (e) => setDetails((d) => ({
							...d,
							name: e.target.value
						})),
						placeholder: t("Type your name"),
						className: "mt-2 min-h-14 rounded-2xl bg-white border-border/60 text-lg font-medium focus-visible:ring-kiosk-teal"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "text-xs font-black uppercase tracking-wide text-foreground/50",
						children: t("Your age")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						inputMode: "numeric",
						value: details.age,
						onChange: (e) => setDetails((d) => ({
							...d,
							age: e.target.value
						})),
						placeholder: t("Example: 52"),
						className: "mt-2 min-h-14 rounded-2xl bg-white border-border/60 text-lg font-medium focus-visible:ring-kiosk-teal"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-black uppercase tracking-wide text-foreground/50 mb-2",
						children: t("I am")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-3 gap-2",
						children: [
							"Male",
							"Female",
							"Other"
						].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: details.gender === item ? "default" : "outline",
							onClick: () => setDetails((d) => ({
								...d,
								gender: item
							})),
							className: `min-h-12 rounded-2xl text-sm font-bold ${details.gender === item ? "bg-kiosk-teal text-white shadow-lg shadow-kiosk-teal/25 hover:bg-kiosk-teal/90" : "bg-white border-border/60 text-kiosk-navy hover:border-kiosk-teal/40"}`,
							children: t(item)
						}, item))
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-black uppercase tracking-wide text-foreground/50 mb-2",
						children: t("Main problem")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-2 gap-2",
						children: Object.keys(interviewQuestions).map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: details.complaint === item ? "default" : "outline",
							onClick: () => setDetails((d) => ({
								...d,
								complaint: item
							})),
							className: `min-h-12 justify-start rounded-2xl px-3 text-xs font-bold ${details.complaint === item ? "bg-kiosk-coral text-white shadow-lg shadow-kiosk-coral/25 hover:bg-kiosk-coral/90" : "bg-white border-border/60 text-kiosk-navy hover:border-kiosk-coral/30"}`,
							children: t(item)
						}, item))
					})] })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "outline",
					onClick: onBack,
					className: "min-h-12 rounded-2xl px-5 font-bold",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { size: 16 }),
						" ",
						t("Back")
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: onContinue,
					disabled: !details.name || !details.age || !details.gender,
					className: "flex-1 min-h-12 rounded-2xl bg-kiosk-teal font-black text-white shadow-lg shadow-kiosk-teal/25 hover:bg-kiosk-teal/90 disabled:opacity-40",
					children: [
						t("Continue"),
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { size: 16 })
					]
				})]
			})
		]
	});
}
function MobileInterview({ t, lang, details, currentQuestion, questionIndex, questions, answers, setAnswer, pendingVoice, onConfirmVoice, onRejectVoice, speechState, transcription, startSpeech, hasRedFlag, onBack, onNext }) {
	const total = questions.length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mk-rise space-y-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between mb-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-black uppercase tracking-[0.18em] text-kiosk-coral",
						children: "Step 3 Â· Questions"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-xs font-bold text-foreground/45",
						children: [
							questionIndex + 1,
							" / ",
							total
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-1.5 overflow-hidden rounded-full bg-border mb-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-full rounded-full bg-kiosk-teal transition-all",
						style: { width: `${(questionIndex + 1) / total * 100}%` }
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-xl font-black text-kiosk-navy leading-snug",
					children: t(currentQuestion.question)
				})
			] }),
			currentQuestion.choices && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-2",
				children: currentQuestion.choices.map((choice) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => setAnswer(choice),
					className: `w-full flex items-center gap-3 min-h-14 rounded-2xl border-2 px-4 text-left text-sm font-bold transition-all ${answers[questionIndex] === choice ? "border-kiosk-teal bg-kiosk-teal/10 text-kiosk-navy" : "border-border/50 bg-white text-kiosk-navy hover:border-kiosk-teal/40"}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: `size-5 rounded-full border-2 flex items-center justify-center shrink-0 ${answers[questionIndex] === choice ? "border-kiosk-teal bg-kiosk-teal" : "border-border"}`,
						children: answers[questionIndex] === choice && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
							size: 11,
							className: "text-white",
							strokeWidth: 3
						})
					}), t(choice)]
				}, choice))
			}),
			pendingVoice && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border-2 border-kiosk-yellow/50 bg-kiosk-yellow/10 p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs font-black uppercase text-kiosk-yellow/80 mb-1",
						children: ["ðŸŽ™ ", t("Did you mean this?")]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-lg font-black text-kiosk-navy",
						children: [
							"\"",
							pendingVoice,
							"\""
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							onClick: onConfirmVoice,
							size: "sm",
							className: "flex-1 rounded-xl bg-kiosk-teal text-white font-black hover:bg-kiosk-teal/90",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { size: 15 }),
								" ",
								t("Yes, that's correct")
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							onClick: onRejectVoice,
							size: "sm",
							className: "flex-1 rounded-xl font-bold",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { size: 14 }),
								" ",
								t("Try again")
							]
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: `flex items-center gap-4 rounded-2xl p-4 ${speechState === "listening" ? "bg-kiosk-coral/10 border-2 border-kiosk-coral/30" : "bg-kiosk-sky/8 border border-kiosk-sky/20"}`,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: startSpeech,
					disabled: speechState === "listening" || speechState === "processing",
					"aria-label": "Speak",
					className: `size-14 shrink-0 rounded-full text-white flex items-center justify-center shadow-xl transition-all disabled:opacity-60 ${speechState === "listening" ? "bg-kiosk-coral ring-8 ring-kiosk-coral/25 scale-110" : "bg-kiosk-coral hover:scale-105"}`,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mic, { size: 22 })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-black text-kiosk-navy",
					children: speechState === "listening" ? t("Listeningâ€¦") : speechState === "processing" ? t("Understandingâ€¦") : t("Speak")
				}), transcription && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-foreground/50 mt-0.5",
					children: transcription
				})] })]
			}),
			hasRedFlag && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start gap-3 rounded-2xl border-2 border-kiosk-coral/30 bg-kiosk-coral/8 p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
					size: 20,
					className: "shrink-0 text-kiosk-coral mt-0.5"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-black text-kiosk-navy",
					children: t("Potential red flag detected.")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-medium text-foreground/65",
					children: t("Please alert medical staff. This is not a diagnosis.")
				})] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					onClick: onBack,
					className: "min-h-12 rounded-2xl px-5 font-bold",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { size: 16 })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: onNext,
					disabled: !answers[questionIndex] && !pendingVoice,
					className: "flex-1 min-h-12 rounded-2xl bg-kiosk-teal font-black text-white shadow-lg shadow-kiosk-teal/25 hover:bg-kiosk-teal/90 disabled:opacity-40",
					children: [
						questionIndex === total - 1 ? t("Next: records") : t("Next question"),
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { size: 16 })
					]
				})]
			})
		]
	});
}
function MobileDocuments({ t, documents, setDocuments, processing, extracted, processDocuments, onBack, onContinue }) {
	const addDoc = (e) => {
		const file = e.target.files?.[0];
		if (file) setDocuments((d) => [...d, file.name]);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mk-rise space-y-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-black uppercase tracking-[0.18em] text-kiosk-coral mb-1",
					children: "Step 4 Â· Documents"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-2xl font-black text-kiosk-navy",
					children: t("Do you have old medical papers?")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm font-medium text-foreground/55",
					children: "Upload photos of prescriptions or lab reports."
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "flex min-h-28 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-kiosk-teal/35 bg-kiosk-teal/5 transition-all hover:border-kiosk-teal/60",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, {
						className: "mb-2 text-kiosk-teal",
						size: 24
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-sm font-black text-kiosk-navy",
						children: "Tap to upload"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mt-1 text-xs font-medium text-foreground/45",
						children: "PDF Â· JPG Â· PNG"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "file",
						accept: ".pdf,.jpg,.jpeg,.png",
						className: "hidden",
						onChange: addDoc
					})
				]
			}),
			documents.map((doc, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3 rounded-2xl border border-border/50 bg-white px-4 py-3 shadow-sm",
				children: [
					doc.endsWith(".pdf") ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, {
						size: 18,
						className: "text-kiosk-teal"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileImage, {
						size: 18,
						className: "text-kiosk-teal"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "flex-1 text-sm font-bold text-kiosk-navy",
						children: doc
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setDocuments((d) => d.filter((_, j) => j !== i)),
						className: "text-foreground/30 hover:text-kiosk-coral",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { size: 15 })
					})
				]
			}, i)),
			documents.length > 0 && !extracted && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				onClick: processDocuments,
				disabled: processing,
				variant: "outline",
				className: "w-full min-h-12 rounded-2xl border-kiosk-teal/40 font-bold text-kiosk-navy hover:bg-kiosk-teal/5",
				children: processing ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, {
					size: 16,
					className: "animate-spin"
				}), " Processingâ€¦"] }) : "Extract information"
			}),
			extracted && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl bg-kiosk-teal/5 border border-kiosk-teal/20 p-4 space-y-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-black uppercase text-kiosk-teal",
						children: "Extracted"
					}),
					extracted.conditions.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm font-bold text-kiosk-navy",
						children: ["Conditions: ", extracted.conditions.join(", ")]
					}),
					extracted.medications.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm font-bold text-kiosk-navy",
						children: ["Medicines: ", extracted.medications.join(", ")]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					onClick: onBack,
					className: "min-h-12 rounded-2xl px-5 font-bold",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { size: 16 })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: onContinue,
					className: "flex-1 min-h-12 rounded-2xl bg-kiosk-teal font-black text-white shadow-lg shadow-kiosk-teal/25 hover:bg-kiosk-teal/90",
					children: ["Finish & submit ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { size: 16 })]
				})]
			})
		]
	});
}
function MobileComplete({ t, sessionId, name }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mk-rise flex min-h-[70vh] flex-col items-center justify-center text-center py-10 space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid size-24 place-items-center rounded-full bg-kiosk-green/15 text-kiosk-green ring-8 ring-kiosk-green/10",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
					size: 48,
					strokeWidth: 2.5
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-black uppercase tracking-[0.2em] text-kiosk-green",
					children: "Pre-consultation complete"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-2 text-3xl font-black tracking-tight text-kiosk-navy",
					children: name ? `${name}, you're ready!` : "You're ready!"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm font-medium leading-relaxed text-foreground/55 max-w-xs mx-auto",
					children: "Your clinical history is ready for your doctor. Please proceed to the OPD counter and mention your session ID."
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "w-full rounded-2xl border border-kiosk-teal/20 bg-kiosk-teal/5 p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-black uppercase tracking-wide text-foreground/40",
						children: "Your session ID"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 font-mono text-4xl font-black tracking-[0.3em] text-kiosk-coral",
						children: sessionId
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs font-medium text-foreground/40",
						children: "Show this to hospital staff or scan at the kiosk"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2 text-xs font-semibold text-foreground/40",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, {
					size: 13,
					className: "text-kiosk-green"
				}), "No diagnosis provided Â· For physician review only"]
			})
		]
	});
}
//#endregion
export { MobilePage as component };

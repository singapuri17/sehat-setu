import { i as __toESM } from "../_runtime.mjs";
import { r as createAppointment, s as portalUrl } from "./appointmentService-CWZMbfqp.mjs";
import { a as require_jsx_runtime, o as require_react } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { n as Input, t as Button } from "./input-BZBVMCdW.mjs";
import { A as ClipboardList, B as ArrowLeft, C as Mail, D as FileText, E as HeartPulse, F as Calendar, I as Brain, L as Bell, M as ChevronRight, N as Check, O as FileImage, P as ChartColumn, R as BadgeCheck, V as Activity, _ as Phone, a as UserRound, b as Mic, f as Settings, h as RefreshCw, j as CircleCheck, k as Clock3, l as Stethoscope, m as Save, o as Upload, r as Users, s as TriangleAlert, t as X, v as Pencil, w as LogIn, x as Menu, y as Paperclip, z as ArrowRight } from "../_libs/lucide-react.mjs";
import { a as makeT, i as languageOptions, n as cancelSpeech, r as extractDocument, s as speechToText, t as Checkbox } from "./i18n-BJRXaFO7.mjs";
import { t as QRCodeSVG } from "../_libs/qrcode.react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-DjZEHOqH.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var demoConsultation = {
	token: "A-102",
	name: "Rahul Patel",
	age: "52",
	gender: "Male",
	complaint: "Abdominal pain",
	status: "Ready",
	submitted: "09:42",
	attention: ["Hemoglobin 10.8 g/dL — below reference range"],
	history: "Patient reports abdominal pain since yesterday. Details are based on the patient interview and are not a diagnosis.",
	medications: ["Metformin 500 mg — listed in uploaded record"],
	allergies: "Not entered",
	investigations: ["Hemoglobin — 10.8 g/dL — below reference range"],
	documents: ["Blood_Report.pdf", "Prescription.jpg"],
	timeline: [
		{
			year: "2024",
			event: "Type 2 Diabetes listed in patient record"
		},
		{
			year: "2025",
			event: "Prescription uploaded"
		},
		{
			year: "2026",
			event: "Blood test uploaded"
		},
		{
			year: "2026",
			event: "Current complaint recorded"
		}
	]
};
var demoPatients = [
	{
		token: "A-102",
		name: "Rahul Patel",
		age: "52",
		gender: "Male",
		complaint: "Abdominal pain",
		status: "Ready",
		submitted: "09:42"
	},
	{
		token: "A-103",
		name: "Meena Shah",
		age: "64",
		gender: "Female",
		complaint: "Cough",
		status: "Ready",
		submitted: "09:48"
	},
	{
		token: "A-104",
		name: "Arjun Desai",
		age: "38",
		gender: "Male",
		complaint: "Headache",
		status: "In review",
		submitted: "10:03"
	}
];
/**
* / â€” Patient Appointment Booking
*
* Primary flow (3 steps):
*   1. Book  â€” name, phone, complaint, dept, date, time slot
*   2. History (optional) â€” basic symptoms Q&A + document upload
*   3. Confirm â€” review + submit â†’ appointment created + SMS sent
*
* Navigation links to:
*   /portal  â€” patient checks own appointments + queue
*   /staff   â€” staff manage schedule
*   /doctor  â€” doctor dashboard (via doctorLogin view)
*/
var DEPARTMENTS = [
	"OPD â€” General",
	"OPD â€” Cardiology",
	"OPD â€” Orthopaedics",
	"OPD â€” Gynaecology",
	"OPD â€” Paediatrics",
	"OPD â€” ENT",
	"OPD â€” Dermatology",
	"OPD â€” Neurology",
	"OPD â€” AYUSH"
];
var DOCTORS = {
	"OPD â€” General": ["Dr. M. Rao", "Dr. S. Nair"],
	"OPD â€” Cardiology": ["Dr. R. Sharma", "Dr. P. Joshi"],
	"OPD â€” Orthopaedics": ["Dr. A. Mehta"],
	"OPD â€” Gynaecology": ["Dr. K. Desai", "Dr. L. Pillai"],
	"OPD â€” Paediatrics": ["Dr. N. Kumar"],
	"OPD â€” ENT": ["Dr. H. Singh"],
	"OPD â€” Dermatology": ["Dr. V. Reddy"],
	"OPD â€” Neurology": ["Dr. B. Iyer"],
	"OPD â€” AYUSH": ["Dr. T. Gupta"]
};
var TIME_SLOTS = [
	"08:00 AM",
	"08:30 AM",
	"09:00 AM",
	"09:30 AM",
	"10:00 AM",
	"10:30 AM",
	"11:00 AM",
	"11:30 AM",
	"12:00 PM",
	"02:00 PM",
	"02:30 PM",
	"03:00 PM",
	"03:30 PM",
	"04:00 PM",
	"04:30 PM",
	"05:00 PM"
];
var COMPLAINTS_LIST = [
	"Fever",
	"Abdominal pain",
	"Headache",
	"Cough",
	"Chest pain",
	"Back pain",
	"Joint pain",
	"Skin rash",
	"Eye problem",
	"Ear problem",
	"General check-up",
	"Follow-up visit",
	"Other"
];
var interviewQuestions = {
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
				"Mild",
				"High",
				"I do not know"
			]
		},
		{
			question: "Do you have body pain?",
			choices: ["No", "Yes"]
		},
		{
			question: "Do you have vomiting?",
			choices: ["No", "Yes"]
		}
	],
	"Abdominal pain": [
		{
			question: "Where is the pain?",
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
			question: "How severe?",
			choices: [
				"Mild",
				"Moderate",
				"Severe"
			]
		},
		{
			question: "Do you have vomiting?",
			choices: ["No", "Yes"]
		}
	],
	Headache: [
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
			question: "How severe?",
			choices: [
				"Mild",
				"Moderate",
				"Severe"
			]
		},
		{
			question: "Do you feel dizzy?",
			choices: ["No", "Yes"]
		}
	],
	Cough: [
		{
			question: "When did it start?",
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
				"Not sure"
			]
		},
		{
			question: "Do you have fever?",
			choices: ["No", "Yes"]
		}
	],
	"Chest pain": [
		{
			question: "How severe?",
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
			question: "Does it spread to arm or jaw?",
			choices: ["No", "Yes"]
		}
	]
};
var defaultPatient = demoPatients[0] ?? {
	token: "A-102",
	name: "Demo",
	age: "52",
	gender: "Male",
	complaint: "Abdominal pain",
	status: "Ready",
	submitted: "09:42"
};
function App() {
	const [view, setView] = (0, import_react.useState)("home");
	const [lang, setLang] = (0, import_react.useState)("en");
	const t = makeT(lang);
	const [form, setForm] = (0, import_react.useState)({
		name: "",
		age: "",
		gender: "Male",
		phone: "",
		email: "",
		complaint: "Fever",
		department: "OPD â€” General",
		doctor: "Dr. M. Rao",
		date: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
		timeSlot: "09:00 AM"
	});
	const [includeHistory, setIncludeHistory] = (0, import_react.useState)(false);
	const [questionIndex, setQuestionIndex] = (0, import_react.useState)(0);
	const [answers, setAnswers] = (0, import_react.useState)({});
	const [speechState, setSpeechState] = (0, import_react.useState)("idle");
	const [transcription, setTranscription] = (0, import_react.useState)("");
	const [pendingVoice, setPendingVoice] = (0, import_react.useState)(null);
	const [documents, setDocuments] = (0, import_react.useState)([]);
	const [processing, setProcessing] = (0, import_react.useState)(false);
	const [extracted, setExtracted] = (0, import_react.useState)(null);
	const [bookedApt, setBookedApt] = (0, import_react.useState)(null);
	const [bookError, setBookError] = (0, import_react.useState)(null);
	const [booking, setBooking] = (0, import_react.useState)(false);
	const [selectedPatient, setSelectedPatient] = (0, import_react.useState)(defaultPatient.token);
	const selectedCase = selectedPatient === "A-102" ? demoConsultation : {
		...demoConsultation,
		...demoPatients.find((p) => p.token === selectedPatient) ?? defaultPatient
	};
	const fSet = (k, v) => setForm((p) => ({
		...p,
		[k]: v
	}));
	const complaint = form.complaint;
	const questions = interviewQuestions[complaint] ?? [];
	const currentQ = questions[questionIndex] ?? {
		question: "Anything else to tell your doctor?",
		choices: []
	};
	const hasRedFlag = form.complaint === "Chest pain" && Object.values(answers).some((a) => ["Severe", "Yes"].includes(a));
	const resetAll = () => {
		setView("home");
		setForm({
			name: "",
			age: "",
			gender: "Male",
			phone: "",
			email: "",
			complaint: "Fever",
			department: "OPD â€” General",
			doctor: "Dr. M. Rao",
			date: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
			timeSlot: "09:00 AM"
		});
		setIncludeHistory(false);
		setQuestionIndex(0);
		setAnswers({});
		setSpeechState("idle");
		setTranscription("");
		setPendingVoice(null);
		setDocuments([]);
		setProcessing(false);
		setExtracted(null);
		setBookedApt(null);
		setBookError(null);
		cancelSpeech();
	};
	const handleSubmit = async () => {
		setBooking(true);
		setBookError(null);
		try {
			const apt = await createAppointment({
				patientName: form.name,
				patientAge: form.age,
				patientGender: form.gender,
				phone: form.phone,
				email: form.email,
				complaint: form.complaint,
				department: form.department,
				doctor: form.doctor,
				date: form.date,
				timeSlot: form.timeSlot,
				status: "scheduled",
				queuePosition: 0,
				estimatedWait: 0,
				notes: Object.entries(answers).map(([i, a]) => `Q${+i + 1}: ${a}`).join("; ")
			});
			await fetch("/api/notify", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					appointmentId: apt.id,
					channel: "sms",
					phone: form.phone,
					message: `Appointment confirmed at City Hospital. Token: ${apt.token}. ${apt.doctor}, ${apt.department}. ${apt.date} at ${apt.timeSlot}. Check queue: ${window.location.origin}/portal?phone=${encodeURIComponent(form.phone)}`
				})
			}).catch(() => {});
			setBookedApt({
				token: apt.token,
				id: apt.id,
				queuePosition: apt.queuePosition,
				estimatedWait: apt.estimatedWait
			});
			setView("success");
		} catch {
			setBookError("Booking failed. Please try again.");
		}
		setBooking(false);
	};
	const startSpeech = async () => {
		setSpeechState("listening");
		setPendingVoice(null);
		const rawText = (await speechToText(lang, setSpeechState)).text.trim();
		setTranscription(rawText);
		setSpeechState("result");
		const choices = currentQ.choices ?? [];
		if (choices.length > 0 && rawText) {
			const norm = rawText.toLowerCase();
			const matched = choices.find((c) => {
				const tr = t(c).toLowerCase();
				return norm === tr || tr.includes(norm) || norm.includes(tr) || c.toLowerCase().includes(norm) || norm.includes(c.toLowerCase());
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
	const processDocuments = async () => {
		setProcessing(true);
		const r = await extractDocument(documents[0] ?? "demo.pdf");
		setExtracted(r);
		setProcessing(false);
	};
	if ([
		"doctorLogin",
		"dashboard",
		"case"
	].includes(view)) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DoctorShell, {
		view,
		setView,
		selectedPatient,
		setSelectedPatient,
		selectedCase
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-gray-50 text-foreground",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "sticky top-0 z-30 border-b border-border/40 bg-white/95 backdrop-blur-sm shadow-sm",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						href: "/",
						className: "flex items-center gap-2.5 no-underline",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: "/logo.png",
							alt: "MediEase",
							className: "size-9 rounded-xl object-contain"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-base font-black tracking-tight text-kiosk-navy",
							children: "MediEase"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[9px] font-semibold uppercase tracking-widest text-kiosk-teal/70",
							children: "Digital Health & Appointment System"
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
						className: "flex items-center gap-1 sm:gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "hidden sm:flex gap-1",
								children: languageOptions.map((opt) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setLang(opt.code),
									className: `rounded-lg px-2.5 py-1 text-xs font-bold transition-all ${lang === opt.code ? "bg-kiosk-teal text-white" : "text-foreground/50 hover:text-kiosk-navy hover:bg-gray-100"}`,
									children: opt.label
								}, opt.code))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-4 w-px bg-border/50 hidden sm:block" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								href: "/portal",
								className: "flex items-center gap-1.5 rounded-xl border border-border/50 bg-white px-3 py-1.5 text-xs font-bold text-kiosk-navy hover:border-kiosk-teal/40 hover:bg-kiosk-teal/5 transition-colors",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeartPulse, {
										size: 12,
										className: "text-kiosk-teal"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "hidden sm:inline",
										children: "My Appointments"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "sm:hidden",
										children: "Portal"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								href: "/staff",
								className: "flex items-center gap-1.5 rounded-xl border border-border/50 bg-white px-3 py-1.5 text-xs font-bold text-kiosk-navy hover:border-kiosk-teal/40 hover:bg-kiosk-teal/5 transition-colors",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserRound, {
									size: 12,
									className: "text-kiosk-teal"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "hidden sm:inline",
									children: "Staff"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => setView("doctorLogin"),
								className: "flex items-center gap-1.5 rounded-xl border border-border/50 bg-white px-3 py-1.5 text-xs font-bold text-kiosk-navy hover:border-kiosk-teal/40 hover:bg-kiosk-teal/5 transition-colors",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stethoscope, {
									size: 12,
									className: "text-kiosk-teal"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "hidden sm:inline",
									children: "Doctor"
								})]
							})
						]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "mx-auto max-w-3xl px-4 py-8 sm:px-6 pb-16",
				children: [
					view === "home" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HomeView, {
						t,
						lang,
						setLang,
						onBook: () => setView("book")
					}),
					view === "book" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookStep, {
						t,
						form,
						fSet,
						includeHistory,
						setIncludeHistory,
						onBack: () => setView("home"),
						onNext: () => setView(includeHistory ? "history" : "confirm")
					}),
					view === "history" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HistoryStep, {
						t,
						lang,
						complaint,
						questions,
						currentQ,
						questionIndex,
						answers,
						setAnswer: (a) => {
							setAnswers((prev) => ({
								...prev,
								[questionIndex]: a
							}));
							setPendingVoice(null);
						},
						onNextQuestion: () => setQuestionIndex((i) => i + 1),
						onPrevQuestion: () => setQuestionIndex((i) => Math.max(0, i - 1)),
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
						documents,
						setDocuments,
						processing,
						processDocuments,
						extracted,
						onBack: () => setView("book"),
						onNext: () => setView("confirm")
					}),
					view === "confirm" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfirmStep, {
						t,
						form,
						answers,
						questions,
						documents,
						extracted,
						booking,
						error: bookError,
						onBack: () => setView(includeHistory ? "history" : "book"),
						onSubmit: handleSubmit
					}),
					view === "success" && bookedApt && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SuccessView, {
						t,
						name: form.name,
						phone: form.phone,
						apt: bookedApt,
						form,
						onNewBooking: resetAll
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
				className: "border-t border-border/40 bg-white py-4 text-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-foreground/40",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "This system does not provide medical diagnosis." })
				})
			})
		]
	});
}
function HomeView({ t, lang, setLang, onBook }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-center space-y-3 pt-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "inline-flex items-center gap-2 rounded-full bg-kiosk-teal/10 border border-kiosk-teal/20 px-4 py-1.5 text-xs font-bold text-kiosk-teal",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-1.5 rounded-full bg-kiosk-teal animate-pulse" }), " City Hospital OPD"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
						className: "text-4xl font-black tracking-tight text-kiosk-navy sm:text-5xl",
						children: [
							"Book your",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
							"appointment online"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-base font-medium text-foreground/55 max-w-md mx-auto leading-relaxed",
						children: "Book in seconds, track your queue position live, and get reminders on your phone â€” no waiting at the counter."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex justify-center gap-2 pt-1",
						children: languageOptions.map((opt) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setLang(opt.code),
							className: `rounded-xl px-4 py-2 text-sm font-black transition-all ${lang === opt.code ? "bg-kiosk-teal text-white shadow-lg shadow-kiosk-teal/30" : "border border-border/60 bg-white text-kiosk-navy hover:border-kiosk-teal/40"}`,
							children: opt.label
						}, opt.code))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						onClick: onBook,
						className: "mt-2 min-h-14 px-10 rounded-2xl bg-kiosk-coral text-lg font-black text-white shadow-xl shadow-kiosk-coral/30 hover:bg-kiosk-coral/90 transition-all",
						children: [
							t("Start"),
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { size: 22 })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium text-foreground/40",
						children: "Takes less than 2 minutes"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-4 sm:grid-cols-3",
				children: [
					{
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { size: 22 }),
						title: "Quick Booking",
						desc: "Book an OPD appointment in under 2 minutes with just your name and phone number.",
						color: "text-kiosk-teal bg-kiosk-teal/10"
					},
					{
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { size: 22 }),
						title: "SMS Reminders",
						desc: "Get automatic SMS reminders the day before and on the morning of your visit.",
						color: "text-kiosk-coral bg-kiosk-coral/10"
					},
					{
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock3, { size: 22 }),
						title: "Live Queue",
						desc: "Track your real-time queue position and estimated wait from your phone.",
						color: "text-kiosk-sky bg-kiosk-sky/10"
					}
				].map(({ icon, title, desc, color }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-border/50 bg-white p-5 shadow-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: `mb-3 grid size-11 place-items-center rounded-xl ${color}`,
							children: icon
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-black text-kiosk-navy",
							children: title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1.5 text-xs font-medium text-foreground/55 leading-relaxed",
							children: desc
						})
					]
				}, title))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-kiosk-teal/20 bg-white p-5 flex items-center gap-4 shadow-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid size-11 shrink-0 place-items-center rounded-xl bg-kiosk-teal/10 text-kiosk-teal",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeartPulse, { size: 20 })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-black text-kiosk-navy",
							children: "Already have an appointment?"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-medium text-foreground/50",
							children: "Check your queue position, reminders and follow-up visits."
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						href: "/portal",
						className: "shrink-0 flex items-center gap-1.5 rounded-xl bg-kiosk-teal px-4 py-2 text-sm font-black text-white shadow-lg shadow-kiosk-teal/25 hover:bg-kiosk-teal/90 transition-colors",
						children: ["My Portal ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { size: 14 })]
					})
				]
			})
		]
	});
}
function BookStep({ t, form, fSet, includeHistory, setIncludeHistory, onBack, onNext }) {
	const [error, setError] = (0, import_react.useState)(null);
	DOCTORS[form.department];
	const handleNext = () => {
		if (!form.name.trim()) {
			setError("Please enter patient name.");
			return;
		}
		if (form.phone.length < 10) {
			setError("Please enter a valid 10-digit mobile number.");
			return;
		}
		setError(null);
		onNext();
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StepBar, {
				current: 1,
				total: includeHistory ? 3 : 2
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-black text-kiosk-navy",
				children: "Book Appointment"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm font-medium text-foreground/50 mt-1",
				children: "Fill in your details to book an OPD appointment."
			})] }),
			error && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm font-bold text-red-600",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { size: 14 }),
					" ",
					error
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-border/50 bg-white p-5 shadow-sm space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-black uppercase tracking-wide text-foreground/40 border-b border-border/40 pb-2.5",
					children: "Your Details"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-4 sm:grid-cols-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "sm:col-span-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "text-[11px] font-black uppercase tracking-wide text-foreground/50",
								children: [t("Your name"), " *"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: form.name,
								onChange: (e) => fSet("name", e.target.value),
								placeholder: t("Type your name"),
								className: "mt-1.5 rounded-xl border-border/60 focus-visible:ring-kiosk-teal"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-[11px] font-black uppercase tracking-wide text-foreground/50",
							children: t("Your age")
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							inputMode: "numeric",
							value: form.age,
							onChange: (e) => fSet("age", e.target.value.replace(/\D/g, "")),
							placeholder: t("Example: 52"),
							className: "mt-1.5 rounded-xl border-border/60 focus-visible:ring-kiosk-teal"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-[11px] font-black uppercase tracking-wide text-foreground/50",
							children: t("I am")
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-1.5 flex gap-2",
							children: [
								"Male",
								"Female",
								"Other"
							].map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => fSet("gender", g),
								className: `flex-1 rounded-xl py-2 text-xs font-bold transition-all ${form.gender === g ? "bg-kiosk-teal text-white shadow-sm" : "border border-border/50 text-foreground/60 hover:border-kiosk-teal/40"}`,
								children: t(g)
							}, g))
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-[11px] font-black uppercase tracking-wide text-foreground/50",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex items-center gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { size: 10 }), " Mobile * (SMS reminders)"]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							inputMode: "numeric",
							value: form.phone,
							onChange: (e) => fSet("phone", e.target.value.replace(/\D/g, "").slice(0, 10)),
							placeholder: "10-digit mobile number",
							maxLength: 10,
							className: "mt-1.5 rounded-xl border-border/60 focus-visible:ring-kiosk-teal"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-[11px] font-black uppercase tracking-wide text-foreground/50",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex items-center gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { size: 10 }), " Email (optional)"]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "email",
							value: form.email,
							onChange: (e) => fSet("email", e.target.value),
							placeholder: "For email reminders",
							className: "mt-1.5 rounded-xl border-border/60 focus-visible:ring-kiosk-teal"
						})] })
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-border/50 bg-white p-5 shadow-sm space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-black uppercase tracking-wide text-foreground/40 border-b border-border/40 pb-2.5",
					children: "Appointment Details"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-4 sm:grid-cols-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-[11px] font-black uppercase tracking-wide text-foreground/50",
							children: "Chief Complaint"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							value: form.complaint,
							onChange: (e) => fSet("complaint", e.target.value),
							className: "mt-1.5 w-full rounded-xl border border-border/60 bg-white px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-kiosk-teal/30",
							children: COMPLAINTS_LIST.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: c }, c))
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-[11px] font-black uppercase tracking-wide text-foreground/50",
							children: "Department"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							value: form.department,
							onChange: (e) => {
								fSet("department", e.target.value);
								fSet("doctor", DOCTORS[e.target.value]?.[0] ?? "Dr. M. Rao");
							},
							className: "mt-1.5 w-full rounded-xl border border-border/60 bg-white px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-kiosk-teal/30",
							children: DEPARTMENTS.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: d }, d))
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-[11px] font-black uppercase tracking-wide text-foreground/50",
							children: "Doctor"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							value: form.doctor,
							onChange: (e) => fSet("doctor", e.target.value),
							className: "mt-1.5 w-full rounded-xl border border-border/60 bg-white px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-kiosk-teal/30",
							children: (DOCTORS[form.department] ?? ["Dr. M. Rao"]).map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: d }, d))
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-[11px] font-black uppercase tracking-wide text-foreground/50",
							children: "Preferred Date"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "date",
							value: form.date,
							onChange: (e) => fSet("date", e.target.value),
							min: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
							className: "mt-1.5 rounded-xl border-border/60 focus-visible:ring-kiosk-teal"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "sm:col-span-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-[11px] font-black uppercase tracking-wide text-foreground/50",
								children: "Time Slot"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-1.5 flex flex-wrap gap-2",
								children: TIME_SLOTS.map((slot) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => fSet("timeSlot", slot),
									className: `rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${form.timeSlot === slot ? "bg-kiosk-teal text-white shadow-sm" : "border border-border/50 text-foreground/60 hover:border-kiosk-teal/40"}`,
									children: slot
								}, slot))
							})]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "flex cursor-pointer items-start gap-3 rounded-2xl border border-kiosk-teal/20 bg-kiosk-teal/3 p-4 hover:bg-kiosk-teal/5 transition-colors",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
					checked: includeHistory,
					onCheckedChange: (v) => setIncludeHistory(v === true),
					className: "mt-0.5 size-5 border-kiosk-teal data-[state=checked]:bg-kiosk-teal"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-black text-kiosk-navy",
					children: "Add medical history (optional)"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-medium text-foreground/50 mt-0.5",
					children: "Answer a few symptom questions and upload documents so your doctor is prepared. Takes ~2 minutes."
				})] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "outline",
					onClick: onBack,
					className: "rounded-2xl px-5 font-bold border-border",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { size: 16 }), " Back"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: handleNext,
					className: "flex-1 min-h-12 rounded-2xl bg-kiosk-teal font-black text-white shadow-lg shadow-kiosk-teal/25 hover:bg-kiosk-teal/90",
					children: [
						includeHistory ? "Next: Add history" : "Review & confirm",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { size: 16 })
					]
				})]
			})
		]
	});
}
function HistoryStep({ t, lang, complaint, questions, currentQ, questionIndex, answers, setAnswer, onNextQuestion, onPrevQuestion, pendingVoice, onConfirmVoice, onRejectVoice, speechState, transcription, startSpeech, hasRedFlag, documents, setDocuments, processing, processDocuments, extracted, onBack, onNext }) {
	const [tab, setTab] = (0, import_react.useState)("symptoms");
	const total = questions.length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StepBar, {
				current: 2,
				total: 3
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-black text-kiosk-navy",
				children: "Medical History"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm font-medium text-foreground/50 mt-1",
				children: "Optional â€” helps your doctor prepare before your visit."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex gap-2 rounded-xl bg-gray-100 p-1 w-fit",
				children: ["symptoms", "docs"].map((tb) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setTab(tb),
					className: `rounded-lg px-4 py-1.5 text-sm font-bold capitalize transition-all ${tab === tb ? "bg-white text-kiosk-navy shadow-sm" : "text-foreground/50"}`,
					children: tb === "symptoms" ? `Symptoms (${total}Q)` : "Documents"
				}, tb))
			}),
			tab === "symptoms" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-border/50 bg-white p-5 shadow-sm space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between mb-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-black text-kiosk-navy",
							children: t(currentQ.question)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-[11px] font-bold text-foreground/40",
							children: [
								questionIndex + 1,
								"/",
								total
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-1.5 rounded-full bg-gray-100 overflow-hidden",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-full rounded-full bg-kiosk-teal transition-all",
							style: { width: `${(questionIndex + 1) / total * 100}%` }
						})
					})] }),
					currentQ.choices && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid gap-2 sm:grid-cols-2",
						children: currentQ.choices.map((choice) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setAnswer(choice),
							className: `flex items-center gap-2.5 min-h-12 rounded-xl border-2 px-4 text-left text-sm font-bold transition-all ${answers[questionIndex] === choice ? "border-kiosk-teal bg-kiosk-teal/8 text-kiosk-navy" : "border-border/50 bg-white text-kiosk-navy hover:border-kiosk-teal/40"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: `size-4 rounded-full border-2 shrink-0 flex items-center justify-center ${answers[questionIndex] === choice ? "border-kiosk-teal bg-kiosk-teal" : "border-border"}`,
								children: answers[questionIndex] === choice && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
									size: 9,
									className: "text-white",
									strokeWidth: 3
								})
							}), t(choice)]
						}, choice))
					}),
					pendingVoice && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border-2 border-kiosk-yellow/40 bg-kiosk-yellow/8 p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs font-black text-kiosk-yellow/80 mb-1",
								children: ["ðŸŽ™ ", t("Did you mean this?")]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-base font-black text-kiosk-navy",
								children: [
									"\"",
									pendingVoice,
									"\""
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 flex gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									size: "sm",
									onClick: onConfirmVoice,
									className: "flex-1 rounded-xl bg-kiosk-teal text-white font-black hover:bg-kiosk-teal/90",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { size: 13 }),
										" ",
										t("Yes, that's correct")
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									size: "sm",
									variant: "outline",
									onClick: onRejectVoice,
									className: "flex-1 rounded-xl font-bold",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { size: 12 }),
										" ",
										t("Try again")
									]
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3 rounded-xl bg-gray-50 border border-border/40 p-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: startSpeech,
							disabled: speechState === "listening" || speechState === "processing",
							"aria-label": "Speak",
							className: `size-11 shrink-0 rounded-full text-white flex items-center justify-center shadow-lg transition-all disabled:opacity-60 ${speechState === "listening" ? "bg-kiosk-coral ring-4 ring-kiosk-coral/25 scale-110" : "bg-kiosk-coral hover:scale-105"}`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mic, { size: 18 })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-bold text-kiosk-navy",
							children: speechState === "listening" ? t("Listeningâ€¦") : speechState === "processing" ? t("Understandingâ€¦") : "Speak your answer"
						}), transcription && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-foreground/50",
							children: transcription
						})] })]
					}),
					hasRedFlag && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start gap-3 rounded-xl border-2 border-kiosk-coral/30 bg-kiosk-coral/5 p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
							size: 18,
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
						className: "flex gap-2",
						children: [questionIndex > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							onClick: onPrevQuestion,
							className: "rounded-xl px-4 font-bold",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { size: 14 })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							onClick: () => {
								if (questionIndex < total - 1) onNextQuestion();
								else setTab("docs");
							},
							disabled: !answers[questionIndex],
							className: "flex-1 rounded-xl bg-kiosk-teal text-white font-black hover:bg-kiosk-teal/90 disabled:opacity-40",
							children: [
								questionIndex < total - 1 ? "Next question" : "Done â€” add documents",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { size: 14 })
							]
						})]
					})
				]
			}),
			tab === "docs" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-border/50 bg-white p-5 shadow-sm space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-medium text-foreground/60",
						children: "Upload prescriptions, lab reports or any previous records (optional)."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex min-h-24 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-kiosk-teal/35 bg-kiosk-teal/3 text-center hover:border-kiosk-teal/60 hover:bg-kiosk-teal/5 transition-all",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, {
								className: "mb-1 text-kiosk-teal",
								size: 22
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm font-bold text-kiosk-navy",
								children: "Tap to upload"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-foreground/40",
								children: "PDF Â· JPG Â· PNG"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "file",
								accept: ".pdf,.jpg,.jpeg,.png",
								className: "hidden",
								onChange: (e) => {
									const f = e.target.files?.[0];
									if (f) setDocuments((d) => [...d, f.name]);
								}
							})
						]
					}),
					documents.map((doc, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3 rounded-xl border border-border/40 bg-white p-3",
						children: [
							doc.endsWith(".pdf") ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, {
								size: 16,
								className: "text-kiosk-teal"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileImage, {
								size: 16,
								className: "text-kiosk-teal"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "flex-1 text-sm font-bold text-kiosk-navy truncate",
								children: doc
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setDocuments((d) => d.filter((_, j) => j !== i)),
								className: "text-foreground/30 hover:text-kiosk-coral",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { size: 14 })
							})
						]
					}, i)),
					documents.length > 0 && !extracted && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: processDocuments,
						disabled: processing,
						variant: "outline",
						className: "w-full rounded-xl font-bold border-kiosk-teal/40 text-kiosk-navy hover:bg-kiosk-teal/5",
						children: processing ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, {
							size: 14,
							className: "animate-spin"
						}), " Extractingâ€¦"] }) : "Extract information from documents"
					}),
					extracted && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl bg-kiosk-teal/5 border border-kiosk-teal/20 p-3 space-y-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] font-black uppercase text-kiosk-teal",
								children: "Extracted"
							}),
							extracted.conditions.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs font-medium text-kiosk-navy",
								children: ["Conditions: ", extracted.conditions.join(", ")]
							}),
							extracted.medications.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs font-medium text-kiosk-navy",
								children: ["Medicines: ", extracted.medications.join(", ")]
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "outline",
					onClick: onBack,
					className: "rounded-2xl px-5 font-bold border-border",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { size: 16 }), " Back"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: onNext,
					className: "flex-1 min-h-12 rounded-2xl bg-kiosk-teal font-black text-white shadow-lg shadow-kiosk-teal/25 hover:bg-kiosk-teal/90",
					children: ["Review & confirm ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { size: 16 })]
				})]
			})
		]
	});
}
function ConfirmStep({ t, form, answers, questions, documents, extracted, booking, error, onBack, onSubmit }) {
	const rows = [
		{
			label: "Patient",
			value: `${form.name}${form.age ? `, ${form.age}y` : ""}${form.gender ? ` Â· ${form.gender}` : ""}`
		},
		{
			label: "Mobile",
			value: form.phone
		},
		{
			label: "Complaint",
			value: form.complaint
		},
		{
			label: "Department",
			value: form.department
		},
		{
			label: "Doctor",
			value: form.doctor
		},
		{
			label: "Date",
			value: form.date === (/* @__PURE__ */ new Date()).toISOString().slice(0, 10) ? `Today, ${form.date}` : form.date
		},
		{
			label: "Time",
			value: form.timeSlot
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StepBar, {
				current: questions.length > 0 ? 3 : 2,
				total: questions.length > 0 ? 3 : 2
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-black text-kiosk-navy",
				children: "Confirm Appointment"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm font-medium text-foreground/50 mt-1",
				children: "Review your details before confirming."
			})] }),
			error && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm font-bold text-red-600",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { size: 14 }),
					" ",
					error
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-border/50 bg-white p-5 shadow-sm space-y-3",
				children: [rows.map(({ label, value }) => value && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[11px] font-black uppercase tracking-wide text-foreground/40 shrink-0",
						children: label
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-sm font-bold text-kiosk-navy text-right",
						children: value
					})]
				}, label)), form.email && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[11px] font-black uppercase text-foreground/40",
						children: "Email"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-sm font-bold text-kiosk-navy",
						children: form.email
					})]
				})]
			}),
			Object.keys(answers).length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-border/50 bg-white p-5 shadow-sm space-y-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-black uppercase text-foreground/40 pb-1 border-b border-border/40",
					children: "Symptom answers"
				}), questions.map((q, i) => answers[i] && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2 text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-medium text-foreground/55 flex-1",
						children: q.question
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-bold text-kiosk-navy shrink-0",
						children: answers[i]
					})]
				}, i))]
			}),
			documents.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap gap-2",
				children: documents.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "flex items-center gap-1.5 rounded-xl border border-kiosk-teal/20 bg-kiosk-teal/5 px-3 py-1.5 text-xs font-bold text-kiosk-teal",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { size: 11 }),
						" ",
						d
					]
				}, d))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2 rounded-xl bg-kiosk-teal/5 border border-kiosk-teal/20 px-4 py-3 text-xs font-bold text-kiosk-teal",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { size: 12 }),
					" SMS confirmation will be sent to ",
					form.phone || "your number"
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[11px] font-medium text-foreground/35 text-center",
				children: "This system does not provide medical diagnosis. All information is for physician use only."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "outline",
					onClick: onBack,
					className: "rounded-2xl px-5 font-bold border-border",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { size: 16 }), " Back"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: onSubmit,
					disabled: booking,
					className: "flex-1 min-h-12 rounded-2xl bg-kiosk-coral font-black text-white shadow-lg shadow-kiosk-coral/25 hover:bg-kiosk-coral/90 disabled:opacity-40",
					children: booking ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, {
						size: 16,
						className: "animate-spin"
					}), " Bookingâ€¦"] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { size: 16 }), " Confirm Booking"] })
				})]
			})
		]
	});
}
function SuccessView({ t, name, phone, apt, form, onNewBooking }) {
	const portalLink = phone ? portalUrl(phone) : "/portal";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "max-w-md mx-auto space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-3xl border-2 border-kiosk-teal/25 bg-white p-8 text-center shadow-2xl",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mx-auto grid size-20 place-items-center rounded-full bg-kiosk-green/15 text-kiosk-green ring-8 ring-kiosk-green/10",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
							size: 44,
							strokeWidth: 2.5
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-5 text-xs font-black uppercase tracking-[0.2em] text-kiosk-green",
						children: "Appointment Confirmed"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
						className: "mt-2 text-3xl font-black tracking-tight text-kiosk-navy",
						children: [name || "Your appointment", " is booked."]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-sm font-medium text-foreground/55",
						children: [
							form.doctor,
							" Â· ",
							form.department
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-5 rounded-2xl bg-kiosk-teal/5 border border-kiosk-teal/20 p-5 space-y-3 text-left",
						children: [
							{
								label: "Token",
								value: apt.token,
								big: true
							},
							{
								label: "Date",
								value: form.date === (/* @__PURE__ */ new Date()).toISOString().slice(0, 10) ? `Today, ${form.date}` : form.date
							},
							{
								label: "Time",
								value: form.timeSlot
							},
							{
								label: "Queue",
								value: apt.queuePosition > 0 ? `#${apt.queuePosition} Â· ~${apt.estimatedWait} min wait` : "Assigned shortly"
							}
						].map(({ label, value, big }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] font-black uppercase text-foreground/40",
								children: label
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `font-black ${big ? "text-2xl text-kiosk-coral" : "text-sm text-kiosk-navy"}`,
								children: value
							})]
						}, label))
					}),
					phone && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex items-center gap-2 rounded-xl bg-kiosk-teal/8 border border-kiosk-teal/20 px-3 py-2.5 text-xs font-bold text-kiosk-teal",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { size: 12 }),
							" SMS confirmation sent to ",
							phone
						]
					})
				]
			}),
			phone && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-kiosk-teal/20 bg-white p-5 shadow-sm flex items-center gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "rounded-xl bg-white border border-border/40 p-2 shadow-sm shrink-0",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QRCodeSVG, {
						value: portalLink,
						size: 90,
						fgColor: "#0f3052",
						bgColor: "#ffffff",
						level: "M",
						imageSettings: {
							src: "/logo.png",
							height: 18,
							width: 18,
							excavate: true
						}
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-black text-kiosk-navy",
						children: "Track your appointment"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium text-foreground/50 leading-relaxed mt-0.5",
						children: "Scan to check your queue position, reminders and follow-ups."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						href: portalLink,
						className: "mt-2 inline-flex items-center gap-1 text-xs font-black text-kiosk-teal hover:underline",
						children: ["Open Portal ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { size: 11 })]
					})
				] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
					href: "/portal",
					className: "flex-1 flex items-center justify-center gap-1.5 min-h-12 rounded-2xl border border-kiosk-teal/30 bg-white text-sm font-bold text-kiosk-teal hover:bg-kiosk-teal/5 transition-colors",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeartPulse, { size: 15 }), " My Portal"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: onNewBooking,
					className: "flex-1 min-h-12 rounded-2xl bg-kiosk-navy font-black text-white hover:bg-kiosk-navy/90",
					children: "New booking"
				})]
			})
		]
	});
}
function StepBar({ current, total }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-2",
		children: [Array.from({ length: total }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `h-1.5 flex-1 rounded-full transition-all ${i < current ? "bg-kiosk-teal" : "bg-gray-200"}` }, i)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "text-xs font-black text-foreground/40 shrink-0",
			children: [
				current,
				"/",
				total
			]
		})]
	});
}
var doctorNavItems = [
	{
		label: "Dashboard",
		Icon: ChartColumn
	},
	{
		label: "Patient queue",
		Icon: Users
	},
	{
		label: "Appointments",
		Icon: Calendar
	},
	{
		label: "Today's cases",
		Icon: ClipboardList
	},
	{
		label: "Settings",
		Icon: Settings
	}
];
function DoctorShell({ view, setView, selectedPatient, setSelectedPatient, selectedCase }) {
	const [navView, setNavView] = (0, import_react.useState)("queue");
	const [sidebarOpen, setSidebarOpen] = (0, import_react.useState)(false);
	if (view === "doctorLogin") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen bg-gray-50 flex items-center justify-center p-5",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-md rounded-3xl border border-border/50 bg-white p-8 shadow-xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-6 flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid size-12 place-items-center rounded-2xl bg-kiosk-teal text-white shadow-lg shadow-kiosk-teal/30",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stethoscope, { size: 22 })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-2xl font-black text-kiosk-navy",
						children: "Doctor sign in"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium text-foreground/45",
						children: "MediEase Â· demo"
					})] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl bg-kiosk-teal/5 border border-kiosk-teal/20 p-4 text-sm font-medium text-kiosk-navy mb-4 space-y-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-bold",
							children: "Demo credentials:"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-foreground/60",
							children: "Email: doctor@MediEase.demo"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-foreground/60",
							children: "Password: demo123"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: () => setView("dashboard"),
					className: "w-full min-h-12 rounded-2xl bg-kiosk-teal font-black text-white hover:bg-kiosk-teal/90",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogIn, { size: 18 }), " Enter dashboard"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "ghost",
					onClick: () => setView("home"),
					className: "mt-2 w-full font-bold text-kiosk-navy hover:bg-gray-100",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { size: 16 }), " Back"]
				})
			]
		})
	});
	const navMap = {
		"Dashboard": () => {
			setNavView("queue");
			setView("dashboard");
			setSidebarOpen(false);
		},
		"Patient queue": () => {
			setNavView("queue");
			setView("dashboard");
			setSidebarOpen(false);
		},
		"Appointments": () => {
			setNavView("appointments");
			setView("dashboard");
			setSidebarOpen(false);
		},
		"Today's cases": () => {
			setNavView("today");
			setView("dashboard");
			setSidebarOpen(false);
		},
		"Settings": () => {
			setNavView("settings");
			setView("dashboard");
			setSidebarOpen(false);
		}
	};
	const activeLabel = view === "case" ? "" : navView === "today" ? "Today's cases" : navView === "appointments" ? "Appointments" : navView === "settings" ? "Settings" : "Patient queue";
	const headerTitle = view === "case" ? "Patient case" : navView === "today" ? "Today's cases" : navView === "appointments" ? "Appointments" : navView === "settings" ? "Settings" : "Patients ready for consultation";
	const SidebarContent = ({ mobile = false }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `flex flex-col ${mobile ? "h-full" : "h-full"}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: `flex items-center gap-3 border-b border-white/10 pb-5 ${mobile ? "mb-2" : ""}`,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: "/logo.png",
						alt: "MediEase",
						className: "size-9 rounded-xl object-contain"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-base font-black",
						children: "MediEase"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[9px] font-bold uppercase tracking-widest text-white/40",
						children: "Physician desk"
					})] }),
					mobile && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setSidebarOpen(false),
						className: "ml-auto text-white/40 hover:text-white",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { size: 18 })
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "mt-4 flex-1 space-y-1",
				children: doctorNavItems.map(({ label, Icon }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: navMap[label],
					className: `flex min-h-10 w-full items-center gap-3 rounded-xl px-3 text-left text-sm font-bold transition-all ${activeLabel === label ? "bg-kiosk-teal/20 text-emerald-300 border border-kiosk-teal/20" : "text-white/50 hover:bg-white/8 hover:text-white"}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { size: 16 }), label]
				}, label))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 rounded-xl bg-white/5 border border-white/10 p-3 text-xs text-white/35",
				children: "Demo data only."
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen bg-gray-50",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex min-h-screen",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
					className: "hidden w-56 shrink-0 bg-kiosk-navy text-white lg:flex lg:flex-col p-5",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarContent, {})
				}),
				sidebarOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "fixed inset-0 z-50 lg:hidden",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "absolute inset-0 bg-black/60",
						onClick: () => setSidebarOpen(false)
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
						className: "absolute left-0 top-0 bottom-0 w-60 bg-kiosk-navy text-white p-5 shadow-2xl flex flex-col",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarContent, { mobile: true })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex-1 min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
						className: "flex min-h-14 items-center justify-between border-b border-border/50 bg-white px-5 sm:px-7",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "icon",
								variant: "ghost",
								className: "lg:hidden",
								onClick: () => setSidebarOpen(true),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { size: 18 })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[10px] font-black uppercase tracking-widest text-kiosk-teal",
								children: "Physician workspace"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "text-base font-black text-kiosk-navy",
								children: headerTitle
							})] })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
									href: "/",
									className: "hidden sm:flex items-center gap-1.5 rounded-xl border border-border/50 px-3 py-1.5 text-xs font-bold text-kiosk-navy hover:bg-gray-100 transition-colors",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { size: 12 }), " Patient booking"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "hidden text-sm font-bold text-foreground/45 sm:inline",
									children: "Dr. M. Rao"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid size-8 place-items-center rounded-full bg-kiosk-teal text-white font-black text-xs shadow",
									children: "MR"
								})
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
						className: "p-5 sm:p-7",
						children: view === "case" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CaseView, {
							selectedCase,
							onBack: () => setView("dashboard")
						}) : navView === "today" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TodaysCasesView, { onOpenCase: (t) => {
							setSelectedPatient(t);
							setView("case");
						} }) : navView === "appointments" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppointmentsView, {}) : navView === "settings" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DoctorSettingsView, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DoctorDashboard, {
							selectedPatient,
							setSelectedPatient,
							setView
						})
					})]
				})
			]
		})
	});
}
function DoctorDashboard({ selectedPatient, setSelectedPatient, setView }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-4xl space-y-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 sm:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, {}),
						label: "Ready now",
						value: "2",
						tone: "teal"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock3, {}),
						label: "Average wait",
						value: "14 min",
						tone: "sky"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, {}),
						label: "Needs attention",
						value: "1",
						tone: "coral"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-xl font-black text-kiosk-navy",
					children: "Patient queue"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "rounded-xl bg-kiosk-yellow/20 border border-kiosk-yellow/30 px-3 py-1.5 text-xs font-black text-kiosk-navy",
					children: "DEMO DATA"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-3",
				children: demoPatients.map((patient) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => {
						setSelectedPatient(patient.token);
						setView("case");
					},
					className: `flex w-full flex-col gap-3 rounded-2xl border bg-white p-4 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md sm:flex-row sm:items-center ${selectedPatient === patient.token ? "border-kiosk-teal/40" : "border-border/60 hover:border-kiosk-teal/30"}`,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "grid size-10 place-items-center rounded-xl bg-kiosk-coral/10 font-black text-kiosk-coral",
							children: patient.token.split("-")[1]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex-1 min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block font-black text-kiosk-navy",
								children: patient.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "block text-xs font-medium text-foreground/50",
								children: [
									patient.age,
									"y Â· ",
									patient.gender,
									" Â· ",
									patient.submitted
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "flex-1 text-sm font-bold text-foreground/65",
							children: patient.complaint
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: `rounded-full px-3 py-1 text-xs font-black ${patient.status === "Verified" ? "bg-kiosk-teal/15 text-kiosk-teal border border-kiosk-teal/20" : patient.status === "Ready" ? "bg-kiosk-green/15 text-kiosk-green border border-kiosk-green/20" : "bg-kiosk-yellow/20 text-kiosk-navy border border-kiosk-yellow/30"}`,
							children: patient.status
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, {
							className: "hidden text-foreground/25 sm:block",
							size: 16
						})
					]
				}, patient.token))
			})
		]
	});
}
function Metric({ icon, label, value, tone }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-border/50 bg-white p-4 shadow-sm",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: `mb-2 grid size-9 place-items-center rounded-xl border ${{
					teal: "bg-kiosk-teal/10 text-kiosk-teal border-kiosk-teal/20",
					sky: "bg-kiosk-sky/10 text-kiosk-sky border-kiosk-sky/20",
					coral: "bg-kiosk-coral/10 text-kiosk-coral border-kiosk-coral/20"
				}[tone]}`,
				children: icon
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-black uppercase tracking-wide text-foreground/45",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-0.5 text-2xl font-black text-kiosk-navy",
				children: value
			})
		]
	});
}
function TodaysCasesView({ onOpenCase }) {
	const allToday = [
		...demoPatients,
		{
			token: "A-101",
			name: "Priya Mehta",
			age: "29",
			gender: "Female",
			complaint: "Fever",
			status: "Verified",
			submitted: "08:55"
		},
		{
			token: "A-100",
			name: "Suresh Kumar",
			age: "71",
			gender: "Male",
			complaint: "Chest pain",
			status: "Verified",
			submitted: "08:30"
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-4xl space-y-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 sm:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BadgeCheck, {}),
						label: "Verified",
						value: String(allToday.filter((p) => p.status === "Verified").length),
						tone: "teal"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, {}),
						label: "In review",
						value: String(allToday.filter((p) => p.status === "In review").length),
						tone: "sky"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, {}),
						label: "Ready",
						value: String(allToday.filter((p) => p.status === "Ready").length),
						tone: "coral"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-xl font-black text-kiosk-navy",
				children: "All cases today"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-2",
				children: allToday.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => onOpenCase(p.token),
					className: "w-full flex flex-col gap-2 rounded-2xl border bg-white p-4 text-left shadow-sm hover:border-kiosk-teal/30 hover:shadow-md transition-all sm:flex-row sm:items-center border-border/60",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "grid size-10 place-items-center rounded-xl bg-kiosk-coral/10 font-black text-kiosk-coral",
							children: p.token.split("-")[1]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block font-black text-kiosk-navy",
								children: p.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-xs font-medium text-foreground/50",
								children: [
									p.age,
									"y Â· ",
									p.gender,
									" Â· ",
									p.submitted
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "flex-1 text-sm font-bold text-foreground/65",
							children: p.complaint
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: `rounded-full px-3 py-1 text-xs font-black ${p.status === "Verified" ? "bg-kiosk-teal/15 text-kiosk-teal border border-kiosk-teal/20" : p.status === "Ready" ? "bg-kiosk-green/15 text-kiosk-green border border-kiosk-green/20" : "bg-kiosk-yellow/20 text-kiosk-navy border border-kiosk-yellow/30"}`,
							children: p.status
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, {
							className: "hidden text-foreground/25 sm:block",
							size: 16
						})
					]
				}, p.token))
			})
		]
	});
}
function AppointmentsView() {
	const [appointments, setAppointments] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [filter, setFilter] = (0, import_react.useState)("today");
	const [toast, setToast] = (0, import_react.useState)(null);
	const [fuModal, setFuModal] = (0, import_react.useState)(null);
	const [fuDate, setFuDate] = (0, import_react.useState)("");
	const [fuReason, setFuReason] = (0, import_react.useState)("");
	const [fuNote, setFuNote] = (0, import_react.useState)("");
	const [fuChannel, setFuChannel] = (0, import_react.useState)("sms");
	const [fuLoading, setFuLoading] = (0, import_react.useState)(false);
	const today = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
	(0, import_react.useEffect)(() => {
		import("./appointmentService-CWZMbfqp.mjs").then((n) => n.t).then((n) => n.t).then(({ getAppointments }) => getAppointments().then((d) => {
			setAppointments(d);
			setLoading(false);
		}));
	}, []);
	const filtered = appointments.filter((a) => filter === "today" ? a.date === today : filter === "upcoming" ? a.date >= today && a.status !== "completed" : true).sort((a, b) => a.date.localeCompare(b.date) || a.timeSlot.localeCompare(b.timeSlot));
	const stats = {
		total: appointments.filter((a) => a.date === today).length,
		waiting: appointments.filter((a) => a.date === today && a.status === "waiting").length,
		completed: appointments.filter((a) => a.date === today && a.status === "completed").length,
		followUps: appointments.reduce((n, a) => n + a.followUps.filter((f) => f.status === "scheduled").length, 0)
	};
	const bookFu = async () => {
		if (!fuModal || !fuDate || !fuReason) return;
		setFuLoading(true);
		const { bookFollowUp } = await import("./appointmentService-CWZMbfqp.mjs").then((n) => n.t).then((n) => n.t);
		await bookFollowUp(fuModal, fuDate, fuReason, fuNote, fuChannel).catch(() => {});
		setToast(`Follow-up booked for ${fuDate}`);
		setTimeout(() => setToast(null), 4e3);
		setFuModal(null);
		setFuDate("");
		setFuReason("");
		setFuNote("");
		const { getAppointments } = await import("./appointmentService-CWZMbfqp.mjs").then((n) => n.t).then((n) => n.t);
		getAppointments().then(setAppointments);
		setFuLoading(false);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-4xl space-y-5",
		children: [
			toast && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2 rounded-2xl bg-kiosk-teal/10 border border-kiosk-teal/20 px-4 py-3 text-sm font-bold text-kiosk-teal",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { size: 15 }), toast]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 sm:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, {}),
						label: "Today",
						value: String(stats.total),
						tone: "teal"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock3, {}),
						label: "Waiting",
						value: String(stats.waiting),
						tone: "sky"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BadgeCheck, {}),
						label: "Completed",
						value: String(stats.completed),
						tone: "teal"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, {}),
						label: "Follow-ups due",
						value: String(stats.followUps),
						tone: "coral"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex gap-2 rounded-xl bg-gray-100 p-1 w-fit",
				children: [
					"today",
					"upcoming",
					"all"
				].map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setFilter(f),
					className: `rounded-lg px-4 py-1.5 text-sm font-bold capitalize ${filter === f ? "bg-white text-kiosk-navy shadow-sm" : "text-foreground/50"}`,
					children: f
				}, f))
			}),
			loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2 text-sm text-foreground/50",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, {
					size: 14,
					className: "animate-spin"
				}), "Loadingâ€¦"]
			}) : filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-2xl border bg-white p-8 text-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-bold text-kiosk-navy",
					children: "No appointments"
				})
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-2",
				children: filtered.map((apt) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "rounded-2xl border border-border/50 bg-white p-4 shadow-sm",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-2 sm:flex-row sm:items-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "grid size-10 shrink-0 place-items-center rounded-xl bg-kiosk-coral/10 font-black text-kiosk-coral",
								children: apt.token.split("-")[1]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex-1 min-w-0",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-black text-kiosk-navy",
										children: apt.patientName
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-xs font-medium text-foreground/50",
										children: [
											apt.patientAge,
											"y Â· ",
											apt.complaint,
											" Â· ",
											apt.doctor
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-xs font-medium text-foreground/40",
										children: [
											apt.date === today ? "Today" : apt.date,
											" Â· ",
											apt.timeSlot
										]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-black ${import_statusColor_inline(apt.status)}`,
								children: apt.status.replace("-", " ")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex gap-2 flex-wrap",
								children: [["sms", "email"].map((ch) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: async () => {
										const { sendReminder } = await import("./appointmentService-CWZMbfqp.mjs").then((n) => n.t).then((n) => n.t);
										const r = await sendReminder(apt.id, ch, `Reminder: ${apt.doctor} on ${apt.date} at ${apt.timeSlot}. Token: ${apt.token}.`);
										setToast(r.success ? `${ch.toUpperCase()} sent` : "Failed");
										setTimeout(() => setToast(null), 3e3);
									},
									className: "flex items-center gap-1 rounded-xl border border-kiosk-teal/30 bg-white px-2.5 py-1.5 text-[11px] font-bold text-kiosk-teal hover:bg-kiosk-teal/5",
									children: [ch === "sms" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { size: 10 }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { size: 10 }), ch.toUpperCase()]
								}, ch)), apt.status === "completed" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => setFuModal(apt.id),
									className: "flex items-center gap-1 rounded-xl border border-kiosk-coral/30 bg-white px-2.5 py-1.5 text-[11px] font-bold text-kiosk-coral hover:bg-kiosk-coral/5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { size: 10 }), "Follow-up"]
								})]
							})
						]
					})
				}, apt.id))
			}),
			fuModal && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "fixed inset-0 z-50 flex items-center justify-center p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute inset-0 bg-black/50",
					onClick: () => setFuModal(null)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-lg font-black text-kiosk-navy",
								children: "Book Follow-up"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setFuModal(null),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { size: 18 })
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-[11px] font-black uppercase text-foreground/40",
									children: "Date"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "date",
									value: fuDate,
									onChange: (e) => setFuDate(e.target.value),
									min: new Date(Date.now() + 864e5).toISOString().slice(0, 10),
									className: "mt-1 rounded-xl border-border/60"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-[11px] font-black uppercase text-foreground/40",
									children: "Reason"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: fuReason,
									onChange: (e) => setFuReason(e.target.value),
									placeholder: "e.g. Review results",
									className: "mt-1 rounded-xl border-border/60"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-[11px] font-black uppercase text-foreground/40",
									children: "Note for patient"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: fuNote,
									onChange: (e) => setFuNote(e.target.value),
									placeholder: "Instructionsâ€¦",
									className: "mt-1 rounded-xl border-border/60"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-[11px] font-black uppercase text-foreground/40",
									children: "Remind via"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-1 flex gap-2",
									children: [
										"sms",
										"email",
										"both"
									].map((ch) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => setFuChannel(ch),
										className: `flex-1 rounded-lg py-1.5 text-xs font-black capitalize ${fuChannel === ch ? "bg-kiosk-teal text-white" : "border border-border/50 text-foreground/50"}`,
										children: ch
									}, ch))
								})] })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								onClick: () => setFuModal(null),
								className: "flex-1 rounded-2xl font-bold",
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								onClick: bookFu,
								disabled: !fuDate || !fuReason || fuLoading,
								className: "flex-1 rounded-2xl bg-kiosk-teal text-white font-black",
								children: fuLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, {
									size: 14,
									className: "animate-spin"
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { size: 14 }), "Book"] })
							})]
						})
					]
				})]
			})
		]
	});
}
function import_statusColor_inline(s) {
	switch (s) {
		case "scheduled": return "bg-kiosk-sky/15 text-kiosk-sky border border-kiosk-sky/20";
		case "waiting": return "bg-kiosk-yellow/20 text-kiosk-navy border border-kiosk-yellow/30";
		case "in-progress": return "bg-kiosk-coral/15 text-kiosk-coral border border-kiosk-coral/20";
		case "completed": return "bg-kiosk-teal/15 text-kiosk-teal border border-kiosk-teal/20";
		default: return "bg-foreground/10 text-foreground/50 border border-foreground/20";
	}
}
function DoctorSettingsView() {
	const [notifs, setNotifs] = (0, import_react.useState)(true);
	const [autosave, setAutosave] = (0, import_react.useState)(true);
	const [redFlag, setRedFlag] = (0, import_react.useState)(true);
	const [fs, setFs] = (0, import_react.useState)("normal");
	const [saved, setSaved] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-xl space-y-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-2xl font-black text-kiosk-navy",
				children: "Settings"
			}),
			saved && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2 rounded-2xl bg-kiosk-teal/10 border border-kiosk-teal/20 px-4 py-3 text-sm font-bold text-kiosk-teal",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { size: 15 }), "Saved"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border bg-white p-5 shadow-sm space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-black uppercase text-foreground/40 border-b pb-2",
						children: "Preferences"
					}),
					[
						{
							l: "Patient ready notifications",
							d: "Alert when intake completed",
							v: notifs,
							s: setNotifs
						},
						{
							l: "Auto-save edits",
							d: "Save field changes after 3s",
							v: autosave,
							s: setAutosave
						},
						{
							l: "Red-flag alerts",
							d: "Highlight chest pain / breathlessness",
							v: redFlag,
							s: setRedFlag
						}
					].map(({ l, d, v, s }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-bold text-kiosk-navy",
							children: l
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-foreground/45",
							children: d
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => s((p) => !p),
							className: `relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors ${v ? "bg-kiosk-teal" : "bg-border"}`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `inline-block size-5 rounded-full bg-white shadow transition-transform ${v ? "translate-x-5" : "translate-x-0"}` })
						})]
					}, l)),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-bold text-kiosk-navy",
							children: "Text size"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-foreground/45",
							children: "Reading comfort"
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex gap-2",
							children: ["normal", "large"].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setFs(s),
								className: `rounded-xl px-3 py-1.5 text-xs font-black capitalize ${fs === s ? "bg-kiosk-teal text-white" : "border border-border/50 text-foreground/50"}`,
								children: s
							}, s))
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				onClick: () => {
					setSaved(true);
					setTimeout(() => setSaved(false), 3e3);
				},
				className: "w-full min-h-12 rounded-2xl bg-kiosk-teal font-black text-white shadow-lg hover:bg-kiosk-teal/90",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { size: 16 }), " Save preferences"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-center text-xs text-foreground/35",
				children: "Demo mode â€” not persisted between sessions"
			})
		]
	});
}
function CaseView({ selectedCase, onBack }) {
	const [verified, setVerified] = (0, import_react.useState)(false);
	const [isEditing, setIsEditing] = (0, import_react.useState)(false);
	const [draft, setDraft] = (0, import_react.useState)({
		complaint: selectedCase.complaint,
		history: selectedCase.history,
		pastHistory: "Type 2 Diabetes â€” uploaded record",
		medications: selectedCase.medications.join(", "),
		allergies: selectedCase.allergies,
		investigations: selectedCase.investigations.join(", ")
	});
	(0, import_react.useEffect)(() => {
		setDraft({
			complaint: selectedCase.complaint,
			history: selectedCase.history,
			pastHistory: "Type 2 Diabetes â€” uploaded record",
			medications: selectedCase.medications.join(", "),
			allergies: selectedCase.allergies,
			investigations: selectedCase.investigations.join(", ")
		});
		setVerified(false);
		setIsEditing(false);
	}, [selectedCase.token]);
	const field = (key) => ({
		text: draft[key],
		editing: isEditing,
		onEdit: (v) => setDraft((d) => ({
			...d,
			[key]: v
		}))
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-4xl space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "ghost",
				onClick: onBack,
				className: "px-0 font-bold text-kiosk-navy hover:text-kiosk-teal",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { size: 16 }), " Back to queue"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col justify-between gap-3 border-b border-border/50 pb-4 sm:flex-row sm:items-end",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-[10px] font-black uppercase tracking-widest text-kiosk-coral",
						children: ["Token ", selectedCase.token]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-1 text-2xl font-black text-kiosk-navy",
						children: selectedCase.name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-foreground/50",
						children: [
							selectedCase.age,
							"y Â· ",
							selectedCase.gender,
							" Â· ",
							draft.complaint,
							" Â· ",
							selectedCase.submitted
						]
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						onClick: () => setIsEditing((e) => !e),
						className: `rounded-xl font-bold ${isEditing ? "border-kiosk-teal bg-kiosk-teal/10 text-kiosk-teal" : "bg-white border-border/60 text-kiosk-navy"}`,
						children: isEditing ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { size: 14 }), "Done"] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { size: 14 }), "Edit"] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						onClick: () => {
							setVerified(true);
							setIsEditing(false);
						},
						disabled: verified,
						className: "rounded-xl bg-kiosk-teal font-bold text-white hover:bg-kiosk-teal/90 disabled:opacity-60",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { size: 14 }), verified ? "Verified âœ“" : "Verify & save"]
					})]
				})]
			}),
			isEditing && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2 rounded-xl bg-kiosk-teal/8 border border-kiosk-teal/20 px-4 py-2.5 text-sm font-bold text-kiosk-teal",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { size: 14 }), "Click any field to edit Â· Press \"Done\" when finished."]
			}),
			verified && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2 rounded-xl bg-kiosk-green/12 border border-kiosk-green/20 px-4 py-2.5 text-sm font-bold text-kiosk-green",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BadgeCheck, { size: 16 }), "Case verified and saved."]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 lg:grid-cols-[1.2fr_.8fr]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border-2 border-kiosk-coral/25 bg-kiosk-coral/5 p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
								className: "flex items-center gap-2 text-sm font-black text-kiosk-navy",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
									size: 16,
									className: "text-kiosk-coral"
								}), "Attention"]
							}), selectedCase.attention.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1.5 text-sm font-bold text-kiosk-navy",
								children: a
							}, a))]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
							title: "Chief complaint",
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserRound, { size: 14 }),
							source: "ðŸŽ¤ Patient interview",
							...field("complaint")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
							title: "History of present illness",
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeartPulse, { size: 14 }),
							source: "ðŸŽ¤ Patient interview",
							draft: true,
							...field("history")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-3 sm:grid-cols-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
								title: "Past medical history",
								icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClipboardList, { size: 14 }),
								source: "ðŸ“„ Uploaded document",
								...field("pastHistory")
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
								title: "Medications",
								icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { size: 14 }),
								source: "ðŸ“„ Uploaded document",
								...field("medications")
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
							title: "Allergies",
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { size: 14 }),
							source: "Patient review",
							...field("allergies")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
							title: "Previous investigations",
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartColumn, { size: 14 }),
							source: "ðŸ“„ Uploaded document",
							...field("investigations")
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border bg-white p-4 shadow-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
								className: "flex items-center gap-2 text-sm font-black text-kiosk-navy",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, {
									size: 16,
									className: "text-kiosk-coral"
								}), "Documents"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-3 space-y-2",
								children: selectedCase.documents.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 rounded-xl bg-kiosk-sky/8 border border-kiosk-sky/15 p-2.5 text-xs font-bold text-kiosk-navy",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Paperclip, {
											size: 13,
											className: "text-kiosk-sky"
										}),
										d,
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BadgeCheck, {
											className: "ml-auto text-kiosk-green",
											size: 14
										})
									]
								}, d))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border bg-white p-4 shadow-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
								className: "flex items-center gap-2 text-sm font-black text-kiosk-navy",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock3, {
									size: 16,
									className: "text-kiosk-coral"
								}), "Timeline"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "relative mt-3 space-y-3 pl-5 before:absolute before:bottom-2 before:left-[5px] before:top-2 before:w-0.5 before:bg-kiosk-teal/20",
								children: selectedCase.timeline.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute -left-[18px] top-1.5 size-2.5 rounded-full bg-kiosk-teal ring-3 ring-white" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[10px] font-black text-kiosk-coral",
											children: item.year
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs font-bold text-kiosk-navy",
											children: item.event
										})
									]
								}, item.year + item.event))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border border-kiosk-teal/20 bg-kiosk-teal/5 p-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
									className: "flex items-center gap-2 text-sm font-black text-kiosk-navy",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Brain, {
										size: 16,
										className: "text-kiosk-teal"
									}), "AI summary"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-2 text-xs font-medium text-foreground/60",
									children: [
										draft.complaint,
										" â€” ",
										draft.history.slice(0, 80),
										draft.history.length > 80 ? "â€¦" : ""
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-[10px] font-black text-kiosk-coral",
									children: "AI draft â€” physician verification required."
								})
							]
						})
					]
				})]
			})
		]
	});
}
function Section({ title, icon, text, source, draft: isDraft = false, editing = false, onEdit }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `rounded-2xl border bg-white p-4 shadow-sm transition-all ${editing ? "border-kiosk-teal/40 ring-2 ring-kiosk-teal/15" : "border-border/50"}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
				className: "flex items-center gap-2 text-sm font-black text-kiosk-navy",
				children: [icon, title]
			}),
			editing && onEdit ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
				value: text,
				onChange: (e) => onEdit(e.target.value),
				rows: 3,
				autoFocus: true,
				className: "mt-2 w-full resize-none rounded-xl border border-kiosk-teal/30 bg-kiosk-teal/3 p-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-kiosk-teal/30"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm font-medium text-foreground/65 leading-relaxed",
				children: text
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-2 flex flex-wrap items-center gap-2 text-[10px] font-black text-kiosk-teal",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: source }),
					isDraft && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "rounded-full bg-kiosk-yellow/25 border border-kiosk-yellow/30 px-2 py-0.5 text-kiosk-navy",
						children: "AI draft"
					}),
					editing && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "rounded-full bg-kiosk-teal/15 border border-kiosk-teal/20 px-2 py-0.5",
						children: "Editing"
					})
				]
			})
		]
	});
}
//#endregion
export { App as component };

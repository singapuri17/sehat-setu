import { i as __toESM } from "../_runtime.mjs";
import { c as sendReminder, i as formatWait, l as statusColor, n as bookFollowUp, o as getAppointments, r as createAppointment, u as updateAppointment } from "./appointmentService-CWZMbfqp.mjs";
import { a as require_jsx_runtime, o as require_react } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { n as Input, t as Button } from "./input-BZBVMCdW.mjs";
import { C as Mail, E as HeartPulse, F as Calendar, M as ChevronRight, N as Check, R as BadgeCheck, _ as Phone, a as UserRound, c as Timer, d as ShieldCheck, f as Settings, g as Plus, h as RefreshCw, j as CircleCheck, k as Clock3, l as Stethoscope, p as Search, s as TriangleAlert, t as X, w as LogIn, x as Menu, z as ArrowRight } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/staff-CJe6-p12.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/**
* /staff â€” Hospital Staff Appointment Management Portal
*
* For reception / front-desk / nursing staff to:
*   - View today's appointment schedule
*   - Book new appointments quickly
*   - Update appointment status (check-in, call next, complete)
*   - Send SMS / email reminders
*   - Book follow-up visits
*   - Search patients by phone / name / token
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
var COMPLAINTS = [
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
	"Dental pain",
	"General check-up",
	"Follow-up visit",
	"Other"
];
var NAV_ITEMS = [
	{
		key: "today",
		label: "Today",
		Icon: Calendar
	},
	{
		key: "book",
		label: "Book",
		Icon: Plus
	},
	{
		key: "search",
		label: "Search",
		Icon: Search
	},
	{
		key: "settings",
		label: "Settings",
		Icon: Settings
	}
];
var DEMO_CREDS = {
	username: "staff@hospital.demo",
	password: "staff123"
};
function StaffPage() {
	const [authed, setAuthed] = (0, import_react.useState)(false);
	const [loginUser, setLoginUser] = (0, import_react.useState)("");
	const [loginPass, setLoginPass] = (0, import_react.useState)("");
	const [loginErr, setLoginErr] = (0, import_react.useState)(false);
	const [nav, setNav] = (0, import_react.useState)("today");
	const [sidebarOpen, setSidebarOpen] = (0, import_react.useState)(false);
	const handleLogin = () => {
		if (loginUser === DEMO_CREDS.username && loginPass === DEMO_CREDS.password) {
			setAuthed(true);
			setLoginErr(false);
		} else setLoginErr(true);
	};
	if (!authed) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StaffLogin, {
		user: loginUser,
		pass: loginPass,
		setUser: setLoginUser,
		setPass: setLoginPass,
		err: loginErr,
		onLogin: handleLogin
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-gray-50 text-foreground",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "sticky top-0 z-30 border-b border-border/50 bg-white shadow-sm",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex min-h-14 items-center justify-between px-4 sm:px-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setSidebarOpen(true),
								className: "lg:hidden text-foreground/50 hover:text-kiosk-teal",
								"aria-label": "menu",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { size: 20 })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: "/logo.png",
								alt: "MediEase",
								className: "size-8 rounded-lg object-contain"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-black text-kiosk-navy",
								children: "MediEase Staff"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[9px] font-bold uppercase tracking-widest text-kiosk-teal/70",
								children: "Reception Â· Front Desk"
							})] })
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								href: "/portal",
								className: "hidden sm:flex items-center gap-1.5 rounded-xl border border-kiosk-teal/30 px-3 py-1.5 text-xs font-bold text-kiosk-navy hover:bg-kiosk-teal/5 transition-colors",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeartPulse, {
									size: 12,
									className: "text-kiosk-teal"
								}), " Patient Portal"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								href: "/",
								className: "hidden sm:flex items-center gap-1.5 rounded-xl border border-kiosk-teal/30 px-3 py-1.5 text-xs font-bold text-kiosk-navy hover:bg-kiosk-teal/5 transition-colors",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserRound, {
									size: 12,
									className: "text-kiosk-teal"
								}), " Patient Booking"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid size-8 place-items-center rounded-full bg-kiosk-teal text-white text-xs font-black shadow",
								children: "ST"
							})
						]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex min-h-[calc(100vh-56px)]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
						className: "hidden w-52 shrink-0 border-r border-border/50 bg-white lg:flex lg:flex-col py-4 px-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
							className: "space-y-1 flex-1",
							children: NAV_ITEMS.map(({ key, label, Icon }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => setNav(key),
								className: `flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold transition-all text-left ${nav === key ? "bg-kiosk-teal/10 text-kiosk-teal" : "text-foreground/60 hover:bg-gray-100 hover:text-kiosk-navy"}`,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { size: 16 }),
									" ",
									label
								]
							}, key))
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 rounded-xl bg-gray-50 border border-border/40 p-3 text-[11px] font-medium text-foreground/40",
							children: [
								"Staff: Reception",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
								"City Hospital Â· Demo mode"
							]
						})]
					}),
					sidebarOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "fixed inset-0 z-50 lg:hidden",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "absolute inset-0 bg-black/40",
							onClick: () => setSidebarOpen(false)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
							className: "absolute left-0 top-0 bottom-0 w-56 bg-white border-r border-border/50 py-4 px-3 flex flex-col shadow-xl",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between mb-4 px-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm font-black text-kiosk-navy",
									children: "Staff Menu"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setSidebarOpen(false),
									className: "text-foreground/40 hover:text-kiosk-coral",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { size: 18 })
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
								className: "space-y-1 flex-1",
								children: NAV_ITEMS.map(({ key, label, Icon }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => {
										setNav(key);
										setSidebarOpen(false);
									},
									className: `flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold transition-all text-left ${nav === key ? "bg-kiosk-teal/10 text-kiosk-teal" : "text-foreground/60 hover:bg-gray-100"}`,
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { size: 16 }),
										" ",
										label
									]
								}, key))
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
						className: "flex-1 p-4 sm:p-6 min-w-0",
						children: [
							nav === "today" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TodayView, {}),
							nav === "book" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookView, { onBooked: () => setNav("today") }),
							nav === "search" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SearchView, {}),
							nav === "settings" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StaffSettingsView, {})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "fixed bottom-0 left-0 right-0 z-30 flex border-t border-border/50 bg-white lg:hidden",
				children: NAV_ITEMS.map(({ key, label, Icon }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => setNav(key),
					className: `flex flex-1 flex-col items-center gap-0.5 py-2 text-[10px] font-bold transition-colors ${nav === key ? "text-kiosk-teal" : "text-foreground/40"}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { size: 18 }), label]
				}, key))
			})
		]
	});
}
function StaffLogin({ user, pass, setUser, setPass, err, onLogin }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-gray-50 p-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-sm rounded-3xl border border-border/50 bg-white p-8 shadow-xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-6 flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid size-12 place-items-center rounded-2xl bg-kiosk-teal text-white shadow-lg shadow-kiosk-teal/30",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserRound, { size: 22 })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xl font-black text-kiosk-navy",
						children: "Staff Login"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium text-foreground/45",
						children: "Hospital Reception Â· Demo"
					})] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "text-[11px] font-black uppercase tracking-wide text-foreground/50",
						children: "Username"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: user,
						onChange: (e) => setUser(e.target.value),
						placeholder: "staff@hospital.demo",
						onKeyDown: (e) => e.key === "Enter" && onLogin(),
						className: "mt-1 rounded-xl border-border/60 focus-visible:ring-kiosk-teal"
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "text-[11px] font-black uppercase tracking-wide text-foreground/50",
						children: "Password"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "password",
						value: pass,
						onChange: (e) => setPass(e.target.value),
						placeholder: "staff123",
						onKeyDown: (e) => e.key === "Enter" && onLogin(),
						className: "mt-1 rounded-xl border-border/60 focus-visible:ring-kiosk-teal"
					})] })]
				}),
				err && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 px-3 py-2 text-xs font-bold text-red-600",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { size: 13 }), " Invalid credentials. Use demo credentials below."]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 rounded-xl bg-kiosk-teal/5 border border-kiosk-teal/20 p-3 text-xs font-medium text-kiosk-navy",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-bold",
							children: "Demo credentials:"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-0.5 text-foreground/60",
							children: "Username: staff@hospital.demo"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-foreground/60",
							children: "Password: staff123"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: onLogin,
					className: "mt-5 w-full min-h-12 rounded-2xl bg-kiosk-teal font-black text-white shadow-lg shadow-kiosk-teal/25 hover:bg-kiosk-teal/90",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogIn, { size: 16 }), " Sign in"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 flex items-center justify-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "/",
							className: "text-xs font-bold text-kiosk-teal hover:underline",
							children: "â† Patient booking"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-foreground/30",
							children: "Â·"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "/portal",
							className: "text-xs font-bold text-kiosk-teal hover:underline",
							children: "Patient portal"
						})
					]
				})
			]
		})
	});
}
function TodayView() {
	const [appointments, setAppointments] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [filter, setFilter] = (0, import_react.useState)("all");
	const [toast, setToast] = (0, import_react.useState)(null);
	const [actionLoading, setActionLoading] = (0, import_react.useState)(null);
	const today = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
	const load = (0, import_react.useCallback)(async () => {
		const all = await getAppointments();
		setAppointments(all.filter((a) => a.date === today));
		setLoading(false);
	}, [today]);
	(0, import_react.useEffect)(() => {
		load();
	}, [load]);
	const showToast = (msg) => {
		setToast(msg);
		setTimeout(() => setToast(null), 4e3);
	};
	const setStatus = async (id, status) => {
		setActionLoading(id + status);
		await updateAppointment(id, { status });
		await load();
		showToast(`Status updated to "${status.replace("-", " ")}"`);
		setActionLoading(null);
	};
	const sendSMS = async (apt) => {
		setActionLoading(apt.id + "sms");
		const msg = `Reminder: Your appointment with ${apt.doctor} is today at ${apt.timeSlot}. Token: ${apt.token}. City Hospital OPD.`;
		const r = await sendReminder(apt.id, "sms", msg);
		showToast(r.success ? `SMS sent to ${apt.phone}` : "Failed to send SMS");
		setActionLoading(null);
	};
	const stats = {
		total: appointments.length,
		waiting: appointments.filter((a) => a.status === "waiting").length,
		completed: appointments.filter((a) => a.status === "completed").length,
		scheduled: appointments.filter((a) => a.status === "scheduled").length
	};
	const filtered = appointments.filter((a) => {
		if (filter === "waiting") return ["waiting", "in-progress"].includes(a.status);
		if (filter === "completed") return a.status === "completed";
		return true;
	}).sort((a, b) => a.timeSlot.localeCompare(b.timeSlot));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "max-w-4xl space-y-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-black text-kiosk-navy",
					children: "Today's Schedule"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-medium text-foreground/50",
					children: (/* @__PURE__ */ new Date()).toLocaleDateString("en-IN", {
						weekday: "long",
						day: "numeric",
						month: "long",
						year: "numeric"
					})
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: load,
					variant: "outline",
					size: "sm",
					className: "rounded-xl gap-1.5 font-bold",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { size: 13 }), " Refresh"]
				})]
			}),
			toast && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2 rounded-2xl bg-kiosk-teal/10 border border-kiosk-teal/20 px-4 py-3 text-sm font-bold text-kiosk-teal",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { size: 15 }),
					" ",
					toast
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 gap-3 sm:grid-cols-4",
				children: [
					{
						label: "Total",
						value: stats.total,
						color: "bg-kiosk-sky/10 text-kiosk-sky"
					},
					{
						label: "Scheduled",
						value: stats.scheduled,
						color: "bg-kiosk-teal/10 text-kiosk-teal"
					},
					{
						label: "Waiting",
						value: stats.waiting,
						color: "bg-kiosk-yellow/20 text-kiosk-navy"
					},
					{
						label: "Completed",
						value: stats.completed,
						color: "bg-kiosk-green/15 text-kiosk-green"
					}
				].map(({ label, value, color }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-border/50 bg-white p-4 shadow-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-black uppercase tracking-wide text-foreground/45",
						children: label
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: `mt-1 text-3xl font-black ${color.split(" ")[1]}`,
						children: value
					})]
				}, label))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex gap-2 rounded-xl bg-gray-100 p-1 w-fit",
				children: [
					"all",
					"waiting",
					"completed"
				].map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setFilter(f),
					className: `rounded-lg px-4 py-1.5 text-sm font-bold capitalize transition-all ${filter === f ? "bg-white text-kiosk-navy shadow-sm" : "text-foreground/50"}`,
					children: f
				}, f))
			}),
			loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2 text-sm text-foreground/50",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, {
					size: 14,
					className: "animate-spin"
				}), " Loadingâ€¦"]
			}) : filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-border/40 bg-white p-8 text-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, {
					size: 32,
					className: "mx-auto mb-2 text-foreground/20"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-bold text-kiosk-navy",
					children: "No appointments for this filter"
				})]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-2",
				children: filtered.map((apt) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppointmentRow, {
					apt,
					onStatus: setStatus,
					onSMS: sendSMS,
					loading: actionLoading
				}, apt.id))
			})
		]
	});
}
function AppointmentRow({ apt, onStatus, onSMS, loading }) {
	const [expanded, setExpanded] = (0, import_react.useState)(false);
	const [fuOpen, setFuOpen] = (0, import_react.useState)(false);
	const [fuDate, setFuDate] = (0, import_react.useState)("");
	const [fuReason, setFuReason] = (0, import_react.useState)("");
	const [fuNote, setFuNote] = (0, import_react.useState)("");
	const [fuChannel, setFuChannel] = (0, import_react.useState)("sms");
	const [fuLoading, setFuLoading] = (0, import_react.useState)(false);
	const [fuToast, setFuToast] = (0, import_react.useState)(null);
	const handleBookFu = async () => {
		if (!fuDate || !fuReason) return;
		setFuLoading(true);
		await bookFollowUp(apt.id, fuDate, fuReason, fuNote, fuChannel).catch(() => {});
		setFuToast(`Follow-up booked for ${fuDate}`);
		setTimeout(() => setFuToast(null), 4e3);
		setFuOpen(false);
		setFuDate("");
		setFuReason("");
		setFuNote("");
		setFuLoading(false);
	};
	const next = {
		"scheduled": {
			label: "Check in",
			status: "waiting"
		},
		"waiting": {
			label: "Call in",
			status: "in-progress"
		},
		"in-progress": {
			label: "Complete",
			status: "completed"
		},
		"completed": null,
		"cancelled": null,
		"no-show": null
	}[apt.status];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-border/50 bg-white shadow-sm overflow-hidden",
		children: [
			fuToast && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2 bg-kiosk-teal/10 px-4 py-2 text-xs font-bold text-kiosk-teal border-b border-kiosk-teal/20",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { size: 12 }),
					" ",
					fuToast
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3 p-3 sm:p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "shrink-0 w-16 text-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-black text-kiosk-navy",
							children: apt.timeSlot.replace(" AM", "").replace(" PM", "")
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[9px] font-bold text-foreground/40",
							children: apt.timeSlot.includes("AM") ? "AM" : "PM"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid size-9 shrink-0 place-items-center rounded-xl bg-kiosk-coral/10 text-sm font-black text-kiosk-coral",
						children: apt.token.split("-")[1]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex-1 min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-black text-kiosk-navy truncate",
							children: apt.patientName
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs font-medium text-foreground/50 truncate",
							children: [
								apt.patientAge,
								"y Â· ",
								apt.patientGender,
								" Â· ",
								apt.complaint
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: `hidden sm:inline-flex shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-black ${statusColor(apt.status)}`,
						children: apt.status.replace("-", " ")
					}),
					next && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						onClick: () => onStatus(apt.id, next.status),
						disabled: loading === apt.id + next.status,
						className: "shrink-0 rounded-xl bg-kiosk-teal text-white text-xs font-black shadow-sm hover:bg-kiosk-teal/90 disabled:opacity-50 px-3",
						children: loading === apt.id + next.status ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, {
							size: 12,
							className: "animate-spin"
						}) : next.label
					}),
					apt.status === "completed" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "shrink-0 flex items-center gap-1 text-xs font-black text-kiosk-teal",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BadgeCheck, { size: 14 }), " Done"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setExpanded((e) => !e),
						className: "shrink-0 text-foreground/30 hover:text-kiosk-teal transition-colors",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, {
							size: 16,
							className: `transition-transform ${expanded ? "rotate-90" : ""}`
						})
					})
				]
			}),
			expanded && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "border-t border-border/40 px-4 py-3 bg-gray-50/50 space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-3 text-xs font-medium text-foreground/55",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex items-center gap-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { size: 11 }),
									" ",
									apt.phone
								]
							}),
							apt.email && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex items-center gap-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { size: 11 }),
									" ",
									apt.email
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex items-center gap-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stethoscope, { size: 11 }),
									" ",
									apt.doctor
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex items-center gap-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock3, { size: 11 }),
									" ",
									apt.timeSlot,
									" Â· ",
									apt.department
								]
							}),
							apt.queuePosition > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex items-center gap-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Timer, { size: 11 }),
									" Queue #",
									apt.queuePosition,
									" Â· ",
									formatWait(apt.estimatedWait)
								]
							})
						]
					}),
					apt.notes && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "rounded-xl bg-kiosk-teal/5 border border-kiosk-teal/15 px-3 py-2 text-xs font-medium text-kiosk-navy",
						children: apt.notes
					}),
					apt.followUps.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-1",
						children: apt.followUps.map((fu) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 text-xs text-foreground/60",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, {
									size: 11,
									className: "text-kiosk-coral shrink-0"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-bold text-kiosk-navy",
									children: fu.scheduledDate
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["â€” ", fu.reason] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: `ml-auto rounded-full px-2 py-0.5 text-[10px] font-black ${fu.status === "completed" ? "bg-kiosk-teal/15 text-kiosk-teal" : "bg-kiosk-yellow/20 text-kiosk-navy"}`,
									children: fu.status
								})
							]
						}, fu.id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => onSMS(apt),
								disabled: loading === apt.id + "sms",
								className: "flex items-center gap-1.5 rounded-xl border border-kiosk-teal/30 bg-white px-3 py-1.5 text-xs font-bold text-kiosk-teal hover:bg-kiosk-teal/5 disabled:opacity-50 transition-colors",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { size: 11 }), " Send SMS"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: async () => {
									const msg = `Reminder: Your appointment with ${apt.doctor} is today at ${apt.timeSlot}. Token: ${apt.token}.`;
									await sendReminder(apt.id, "email", msg);
								},
								className: "flex items-center gap-1.5 rounded-xl border border-kiosk-teal/30 bg-white px-3 py-1.5 text-xs font-bold text-kiosk-teal hover:bg-kiosk-teal/5 transition-colors",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { size: 11 }), " Send Email"]
							}),
							[
								"scheduled",
								"waiting",
								"in-progress"
							].includes(apt.status) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => onStatus(apt.id, "cancelled"),
								className: "flex items-center gap-1.5 rounded-xl border border-red-200 bg-white px-3 py-1.5 text-xs font-bold text-red-500 hover:bg-red-50 transition-colors",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { size: 11 }), " Cancel"]
							}),
							["scheduled", "waiting"].includes(apt.status) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => onStatus(apt.id, "no-show"),
								className: "flex items-center gap-1.5 rounded-xl border border-border/40 bg-white px-3 py-1.5 text-xs font-bold text-foreground/50 hover:bg-gray-100 transition-colors",
								children: "No show"
							}),
							apt.status === "completed" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => setFuOpen((o) => !o),
								className: "flex items-center gap-1.5 rounded-xl border border-kiosk-coral/30 bg-white px-3 py-1.5 text-xs font-bold text-kiosk-coral hover:bg-kiosk-coral/5 transition-colors",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { size: 11 }), " Book follow-up"]
							})
						]
					}),
					fuOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-kiosk-coral/20 bg-kiosk-coral/3 p-4 space-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-black text-kiosk-coral uppercase tracking-wide",
								children: "Book Follow-up Visit"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-3 sm:grid-cols-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "text-[11px] font-black uppercase text-foreground/40",
										children: "Date"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "date",
										value: fuDate,
										onChange: (e) => setFuDate(e.target.value),
										min: new Date(Date.now() + 864e5).toISOString().slice(0, 10),
										className: "mt-1 h-9 rounded-xl border-border/60 text-sm"
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "text-[11px] font-black uppercase text-foreground/40",
										children: "Reason"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: fuReason,
										onChange: (e) => setFuReason(e.target.value),
										placeholder: "e.g. Review fever",
										className: "mt-1 h-9 rounded-xl border-border/60 text-sm"
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "sm:col-span-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "text-[11px] font-black uppercase text-foreground/40",
											children: "Note for patient"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											value: fuNote,
											onChange: (e) => setFuNote(e.target.value),
											placeholder: "Instructionsâ€¦",
											className: "mt-1 h-9 rounded-xl border-border/60 text-sm"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "text-[11px] font-black uppercase text-foreground/40",
										children: "Remind via"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-1 flex gap-1.5",
										children: [
											"sms",
											"email",
											"both"
										].map((ch) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => setFuChannel(ch),
											className: `flex-1 rounded-lg py-1.5 text-[11px] font-black capitalize transition-all ${fuChannel === ch ? "bg-kiosk-teal text-white" : "border border-border/50 text-foreground/50"}`,
											children: ch
										}, ch))
									})] })
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									variant: "outline",
									onClick: () => setFuOpen(false),
									className: "rounded-xl font-bold",
									children: "Cancel"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									onClick: handleBookFu,
									disabled: !fuDate || !fuReason || fuLoading,
									className: "rounded-xl bg-kiosk-teal text-white font-black hover:bg-kiosk-teal/90 disabled:opacity-40",
									children: fuLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, {
										size: 12,
										className: "animate-spin"
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { size: 12 }), " Book & notify"] })
								})]
							})
						]
					})
				]
			})
		]
	});
}
function BookView({ onBooked }) {
	const [form, setForm] = (0, import_react.useState)({
		patientName: "",
		patientAge: "",
		patientGender: "Male",
		phone: "",
		email: "",
		complaint: "Fever",
		department: "OPD â€” General",
		doctor: "Dr. M. Rao",
		date: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
		timeSlot: "09:00 AM"
	});
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [success, setSuccess] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)(null);
	const f = (key, val) => setForm((p) => ({
		...p,
		[key]: val
	}));
	const availableDoctors = DOCTORS[form.department] ?? ["Dr. M. Rao"];
	const handleBook = async () => {
		if (!form.patientName || !form.phone || form.phone.length < 10) {
			setError("Patient name and 10-digit mobile number are required.");
			return;
		}
		setLoading(true);
		setError(null);
		try {
			const apt = await createAppointment({
				...form,
				patientGender: form.patientGender,
				status: "scheduled",
				queuePosition: 0,
				estimatedWait: 0,
				notes: ""
			});
			setSuccess(apt);
			await sendReminder(apt.id, "sms", `Appointment confirmed at City Hospital. Token: ${apt.token}. ${apt.doctor}, ${apt.department}. Date: ${apt.date} at ${apt.timeSlot}. Check your queue at /portal.`);
		} catch {
			setError("Failed to book appointment. Please try again.");
		}
		setLoading(false);
	};
	if (success) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "max-w-md mx-auto space-y-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-3xl border-2 border-kiosk-teal/25 bg-white p-8 text-center shadow-xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto grid size-16 place-items-center rounded-full bg-kiosk-green/15 text-kiosk-green ring-8 ring-kiosk-green/10",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
						size: 32,
						strokeWidth: 2.5
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-5 text-xs font-black uppercase tracking-widest text-kiosk-green",
					children: "Appointment Booked"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-2 text-2xl font-black text-kiosk-navy",
					children: success.patientName
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 text-sm font-medium text-foreground/55",
					children: [
						success.department,
						" Â· ",
						success.doctor
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-5 rounded-2xl bg-kiosk-teal/5 border border-kiosk-teal/20 p-4 space-y-2 text-left",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Token",
							value: success.token,
							large: true
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Date",
							value: success.date === (/* @__PURE__ */ new Date()).toISOString().slice(0, 10) ? `Today, ${success.date}` : success.date
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Time",
							value: success.timeSlot
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Queue",
							value: `Position #${success.queuePosition} Â· ~${success.estimatedWait} min wait`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Complaint",
							value: success.complaint
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Phone",
							value: success.phone
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 flex items-center gap-2 rounded-xl bg-kiosk-teal/8 border border-kiosk-teal/20 px-3 py-2 text-xs font-bold text-kiosk-teal",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { size: 12 }),
						" SMS confirmation sent to ",
						success.phone
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-5 flex gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						onClick: () => {
							setSuccess(null);
							setForm({
								patientName: "",
								patientAge: "",
								patientGender: "Male",
								phone: "",
								email: "",
								complaint: "Fever",
								department: "OPD â€” General",
								doctor: "Dr. M. Rao",
								date: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
								timeSlot: "09:00 AM"
							});
						},
						className: "flex-1 rounded-2xl font-bold border-border",
						children: "Book another"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						onClick: onBooked,
						className: "flex-1 rounded-2xl bg-kiosk-teal text-white font-black hover:bg-kiosk-teal/90",
						children: ["View today ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { size: 14 })]
					})]
				})
			]
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "max-w-2xl space-y-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-black text-kiosk-navy",
				children: "Book Appointment"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm font-medium text-foreground/50",
				children: "Quick booking for walk-in and phone patients"
			})] }),
			error && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2 rounded-2xl bg-red-50 border border-red-200 px-4 py-3 text-sm font-bold text-red-600",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { size: 14 }),
					" ",
					error
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-border/50 bg-white p-5 shadow-sm space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-black uppercase tracking-wide text-foreground/40 border-b border-border/40 pb-2",
					children: "Patient Details"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-4 sm:grid-cols-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "sm:col-span-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-[11px] font-black uppercase tracking-wide text-foreground/50",
								children: "Full Name *"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: form.patientName,
								onChange: (e) => f("patientName", e.target.value),
								placeholder: "Patient's full name",
								className: "mt-1.5 rounded-xl border-border/60 focus-visible:ring-kiosk-teal"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-[11px] font-black uppercase tracking-wide text-foreground/50",
							children: "Age"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							inputMode: "numeric",
							value: form.patientAge,
							onChange: (e) => f("patientAge", e.target.value.replace(/\D/g, "")),
							placeholder: "e.g. 45",
							className: "mt-1.5 rounded-xl border-border/60 focus-visible:ring-kiosk-teal"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-[11px] font-black uppercase tracking-wide text-foreground/50",
							children: "Gender"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-1.5 flex gap-2",
							children: [
								"Male",
								"Female",
								"Other"
							].map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => f("patientGender", g),
								className: `flex-1 rounded-xl py-2 text-xs font-bold transition-all ${form.patientGender === g ? "bg-kiosk-teal text-white" : "border border-border/50 text-foreground/60 hover:border-kiosk-teal/40"}`,
								children: g
							}, g))
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-[11px] font-black uppercase tracking-wide text-foreground/50",
							children: "Mobile * (for SMS)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							inputMode: "numeric",
							value: form.phone,
							onChange: (e) => f("phone", e.target.value.replace(/\D/g, "").slice(0, 10)),
							placeholder: "10-digit number",
							className: "mt-1.5 rounded-xl border-border/60 focus-visible:ring-kiosk-teal",
							maxLength: 10
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-[11px] font-black uppercase tracking-wide text-foreground/50",
							children: "Email (optional)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "email",
							value: form.email,
							onChange: (e) => f("email", e.target.value),
							placeholder: "patient@email.com",
							className: "mt-1.5 rounded-xl border-border/60 focus-visible:ring-kiosk-teal"
						})] })
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-border/50 bg-white p-5 shadow-sm space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-black uppercase tracking-wide text-foreground/40 border-b border-border/40 pb-2",
					children: "Appointment Details"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-4 sm:grid-cols-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-[11px] font-black uppercase tracking-wide text-foreground/50",
							children: "Chief Complaint"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							value: form.complaint,
							onChange: (e) => f("complaint", e.target.value),
							className: "mt-1.5 w-full rounded-xl border border-border/60 bg-white px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-kiosk-teal/30",
							children: COMPLAINTS.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: c }, c))
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-[11px] font-black uppercase tracking-wide text-foreground/50",
							children: "Department"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							value: form.department,
							onChange: (e) => {
								f("department", e.target.value);
								f("doctor", DOCTORS[e.target.value]?.[0] ?? "Dr. M. Rao");
							},
							className: "mt-1.5 w-full rounded-xl border border-border/60 bg-white px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-kiosk-teal/30",
							children: DEPARTMENTS.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: d }, d))
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-[11px] font-black uppercase tracking-wide text-foreground/50",
							children: "Doctor"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							value: form.doctor,
							onChange: (e) => f("doctor", e.target.value),
							className: "mt-1.5 w-full rounded-xl border border-border/60 bg-white px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-kiosk-teal/30",
							children: availableDoctors.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: d }, d))
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-[11px] font-black uppercase tracking-wide text-foreground/50",
							children: "Date"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "date",
							value: form.date,
							onChange: (e) => f("date", e.target.value),
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
									onClick: () => f("timeSlot", slot),
									className: `rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${form.timeSlot === slot ? "bg-kiosk-teal text-white shadow-sm" : "border border-border/50 text-foreground/60 hover:border-kiosk-teal/40"}`,
									children: slot
								}, slot))
							})]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2 rounded-xl bg-kiosk-teal/5 border border-kiosk-teal/20 px-4 py-3 text-xs font-bold text-kiosk-teal",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { size: 12 }), " An SMS confirmation will be sent to the patient automatically after booking."]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				onClick: handleBook,
				disabled: loading || !form.patientName || form.phone.length < 10,
				className: "w-full min-h-12 rounded-2xl bg-kiosk-teal font-black text-white shadow-lg shadow-kiosk-teal/25 hover:bg-kiosk-teal/90 disabled:opacity-40",
				children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, {
					size: 16,
					className: "animate-spin"
				}), " Bookingâ€¦"] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { size: 16 }), " Confirm Booking & Send SMS"] })
			})
		]
	});
}
function Row({ label, value, large }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center justify-between",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-[11px] font-black uppercase text-foreground/40",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: `font-black text-kiosk-navy ${large ? "text-xl text-kiosk-coral" : "text-sm"}`,
			children: value
		})]
	});
}
function SearchView() {
	const [query, setQuery] = (0, import_react.useState)("");
	const [results, setResults] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [searched, setSearched] = (0, import_react.useState)(false);
	const [toast, setToast] = (0, import_react.useState)(null);
	const search = async () => {
		if (!query.trim()) return;
		setLoading(true);
		setSearched(true);
		const all = await getAppointments();
		const q = query.toLowerCase().trim();
		setResults(all.filter((a) => a.patientName.toLowerCase().includes(q) || a.phone.includes(q) || a.token.toLowerCase().includes(q) || a.complaint.toLowerCase().includes(q)));
		setLoading(false);
	};
	const sendSMS = async (apt) => {
		const msg = `Reminder: Your appointment with ${apt.doctor} is on ${apt.date} at ${apt.timeSlot}. Token: ${apt.token}. City Hospital OPD.`;
		const r = await sendReminder(apt.id, "sms", msg);
		setToast(r.success ? `SMS sent to ${apt.phone}` : "Failed");
		setTimeout(() => setToast(null), 3e3);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "max-w-2xl space-y-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-black text-kiosk-navy",
				children: "Search Patients"
			}),
			toast && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2 rounded-2xl bg-kiosk-teal/10 border border-kiosk-teal/20 px-4 py-3 text-sm font-bold text-kiosk-teal",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { size: 15 }),
					" ",
					toast
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: query,
					onChange: (e) => setQuery(e.target.value),
					onKeyDown: (e) => e.key === "Enter" && search(),
					placeholder: "Search by name, phone, token, complaintâ€¦",
					className: "flex-1 rounded-xl border-border/60 focus-visible:ring-kiosk-teal"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: search,
					disabled: loading || !query.trim(),
					className: "rounded-xl bg-kiosk-teal text-white font-black px-5 hover:bg-kiosk-teal/90 disabled:opacity-40",
					children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, {
						size: 15,
						className: "animate-spin"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { size: 15 })
				})]
			}),
			searched && !loading && results.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-border/40 bg-white p-6 text-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, {
					size: 28,
					className: "mx-auto mb-2 text-foreground/20"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm font-bold text-kiosk-navy",
					children: [
						"No results for \"",
						query,
						"\""
					]
				})]
			}),
			results.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-2",
				children: results.map((apt) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-border/50 bg-white p-4 shadow-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid size-10 shrink-0 place-items-center rounded-xl bg-kiosk-coral/10 text-sm font-black text-kiosk-coral",
								children: apt.token.split("-")[1]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex-1 min-w-0",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm font-black text-kiosk-navy",
										children: apt.patientName
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-xs font-medium text-foreground/50",
										children: [
											apt.patientAge,
											"y Â· ",
											apt.gender,
											" Â· ",
											apt.complaint
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-xs font-medium text-foreground/40",
										children: [
											apt.date,
											" Â· ",
											apt.timeSlot,
											" Â· ",
											apt.doctor
										]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-black ${statusColor(apt.status)}`,
								children: apt.status.replace("-", " ")
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex flex-wrap gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => sendSMS(apt),
							className: "flex items-center gap-1.5 rounded-xl border border-kiosk-teal/30 bg-white px-3 py-1.5 text-xs font-bold text-kiosk-teal hover:bg-kiosk-teal/5 transition-colors",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { size: 11 }), " SMS reminder"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: `/portal?phone=${apt.phone}`,
							target: "_blank",
							rel: "noreferrer",
							className: "flex items-center gap-1.5 rounded-xl border border-kiosk-sky/30 bg-white px-3 py-1.5 text-xs font-bold text-kiosk-sky hover:bg-kiosk-sky/5 transition-colors",
							children: "View portal"
						})]
					})]
				}, apt.id))
			})
		]
	});
}
function StaffSettingsView() {
	const [smsAuto, setSmsAuto] = (0, import_react.useState)(true);
	const [emailAuto, setEmailAuto] = (0, import_react.useState)(false);
	const [dayBefore, setDayBefore] = (0, import_react.useState)(true);
	const [onDay, setOnDay] = (0, import_react.useState)(true);
	const [saved, setSaved] = (0, import_react.useState)(false);
	const save = () => {
		setSaved(true);
		setTimeout(() => setSaved(false), 3e3);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "max-w-xl space-y-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-black text-kiosk-navy",
				children: "Settings"
			}),
			saved && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2 rounded-2xl bg-kiosk-teal/10 border border-kiosk-teal/20 px-4 py-3 text-sm font-bold text-kiosk-teal",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { size: 15 }), " Settings saved"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-border/50 bg-white p-5 shadow-sm space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-black uppercase tracking-wide text-foreground/40 border-b border-border/40 pb-2",
					children: "Automatic Reminders"
				}), [
					{
						label: "SMS â€” auto-send on booking",
						desc: "Send SMS confirmation when appointment is booked",
						value: smsAuto,
						set: setSmsAuto
					},
					{
						label: "Email â€” auto-send on booking",
						desc: "Send email confirmation when appointment is booked",
						value: emailAuto,
						set: setEmailAuto
					},
					{
						label: "SMS reminder â€” day before visit",
						desc: "Remind patient the day before their appointment",
						value: dayBefore,
						set: setDayBefore
					},
					{
						label: "SMS reminder â€” morning of visit",
						desc: "Remind patient on the morning of their appointment",
						value: onDay,
						set: setOnDay
					}
				].map(({ label, desc, value, set }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-bold text-kiosk-navy",
						children: label
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium text-foreground/45",
						children: desc
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => set((v) => !v),
						"aria-pressed": value,
						className: `relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors ${value ? "bg-kiosk-teal" : "bg-border"}`,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `inline-block size-5 rounded-full bg-white shadow transition-transform ${value ? "translate-x-5" : "translate-x-0"}` })
					})]
				}, label))]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-border/50 bg-white p-5 shadow-sm space-y-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-black uppercase tracking-wide text-foreground/40 border-b border-border/40 pb-2",
					children: "Hospital Info"
				}), [
					{
						label: "Hospital Name",
						value: "City Hospital"
					},
					{
						label: "OPD Block",
						value: "Block A, Ground Floor"
					},
					{
						label: "Contact Number",
						value: "011-2345-6789"
					}
				].map(({ label, value }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "text-[11px] font-black uppercase text-foreground/40",
					children: label
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					defaultValue: value,
					className: "mt-1 h-9 rounded-xl border-border/60 text-sm"
				})] }, label))]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				onClick: save,
				className: "w-full min-h-12 rounded-2xl bg-kiosk-teal font-black text-white shadow-lg shadow-kiosk-teal/25 hover:bg-kiosk-teal/90",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { size: 16 }), " Save Settings"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-center text-xs font-medium text-foreground/35",
				children: "Demo mode â€” settings not persisted between sessions"
			})
		]
	});
}
//#endregion
export { StaffPage as component };

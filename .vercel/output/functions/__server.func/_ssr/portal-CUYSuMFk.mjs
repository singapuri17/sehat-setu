import { i as __toESM } from "../_runtime.mjs";
import { a as getAppointmentByPhone, c as sendReminder, i as formatWait, l as statusColor } from "./appointmentService-CWZMbfqp.mjs";
import { a as require_jsx_runtime, o as require_react } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { n as Input, t as Button } from "./input-BZBVMCdW.mjs";
import { C as Mail, E as HeartPulse, F as Calendar, L as Bell, M as ChevronRight, N as Check, R as BadgeCheck, S as MapPin, T as History, _ as Phone, c as Timer, d as ShieldCheck, h as RefreshCw, i as User, j as CircleCheck, k as Clock3, l as Stethoscope, s as TriangleAlert, t as X, z as ArrowRight } from "../_libs/lucide-react.mjs";
import { f as useSearch } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/portal-CUYSuMFk.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/**
* /portal â€” Patient Appointment Portal
*
* Entry points:
*   /portal                    â†’ phone number lookup form
*   /portal?phone=9876543210   â†’ direct load by phone (from QR on success screen)
*
* Shows:
*   - Upcoming appointment card with queue position + live countdown
*   - SMS/email reminder preferences (update channel)
*   - Follow-up visit history and upcoming follow-ups
*   - Past appointments
*/
function PortalPage() {
	const { phone: phoneParam } = useSearch({ from: "/portal" });
	const [phone, setPhone] = (0, import_react.useState)(phoneParam ?? "");
	const [inputPhone, setInputPhone] = (0, import_react.useState)(phoneParam ?? "");
	const [appointments, setAppointments] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	const [activeTab, setActiveTab] = (0, import_react.useState)("upcoming");
	const [notifSent, setNotifSent] = (0, import_react.useState)(null);
	const load = (0, import_react.useCallback)(async (ph) => {
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
	(0, import_react.useEffect)(() => {
		if (phoneParam) {
			setPhone(phoneParam);
			load(phoneParam);
		}
	}, [phoneParam, load]);
	(0, import_react.useEffect)(() => {
		if (!phone) return;
		const interval = setInterval(() => load(phone), 3e4);
		return () => clearInterval(interval);
	}, [phone, load]);
	const upcoming = appointments.filter((a) => [
		"scheduled",
		"waiting",
		"in-progress"
	].includes(a.status));
	const past = appointments.filter((a) => [
		"completed",
		"cancelled",
		"no-show"
	].includes(a.status));
	const handleSendReminder = async (apt, channel) => {
		setNotifSent(null);
		const msg = `Reminder: Your appointment with ${apt.doctor} is on ${apt.date} at ${apt.timeSlot} at City Hospital OPD. Token: ${apt.token}.`;
		const result = await sendReminder(apt.id, channel, msg);
		setNotifSent(result.success ? `${channel === "sms" ? "SMS" : channel === "email" ? "Email" : "SMS & Email"} sent!` : "Failed to send.");
		setTimeout(() => setNotifSent(null), 4e3);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-gradient-to-br from-teal-50/60 via-white to-blue-50/30",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
			className: "sticky top-0 z-30 border-b border-border/40 bg-white/90 backdrop-blur-sm",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto flex max-w-2xl items-center justify-between px-4 py-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: "/logo.png",
						alt: "MediEase",
						className: "size-9 rounded-xl object-contain"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-black text-kiosk-navy",
						children: "MediEase"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[9px] font-bold uppercase tracking-widest text-kiosk-teal/70",
						children: "Patient Portal"
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
					href: "/",
					className: "flex items-center gap-1.5 rounded-xl border border-kiosk-teal/30 bg-white px-3 py-1.5 text-xs font-bold text-kiosk-navy hover:bg-kiosk-teal/5 transition-colors",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeartPulse, {
						size: 13,
						className: "text-kiosk-teal"
					}), " Home"]
				})]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "mx-auto max-w-2xl px-4 py-6 pb-20 space-y-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-3xl border-2 border-kiosk-teal/20 bg-white/90 p-5 shadow-xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3 mb-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid size-10 place-items-center rounded-2xl bg-kiosk-teal text-white shadow-lg shadow-kiosk-teal/25",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { size: 18 })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-base font-black text-kiosk-navy",
								children: "Find my appointments"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-medium text-foreground/50",
								children: "Enter your registered mobile number"
							})] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								inputMode: "numeric",
								placeholder: "10-digit mobile number",
								value: inputPhone,
								onChange: (e) => setInputPhone(e.target.value.replace(/\D/g, "").slice(0, 10)),
								onKeyDown: (e) => {
									if (e.key === "Enter") {
										setPhone(inputPhone);
										load(inputPhone);
									}
								},
								className: "flex-1 min-h-12 rounded-2xl bg-white border-border/60 text-base font-medium focus-visible:ring-kiosk-teal",
								maxLength: 10
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								onClick: () => {
									setPhone(inputPhone);
									load(inputPhone);
								},
								disabled: inputPhone.length < 10 || loading,
								className: "min-h-12 rounded-2xl bg-kiosk-teal px-5 font-black text-white shadow-lg shadow-kiosk-teal/25 hover:bg-kiosk-teal/90 disabled:opacity-40",
								children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, {
									size: 16,
									className: "animate-spin"
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { size: 18 })
							})]
						}),
						error && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 flex items-center gap-2 rounded-xl bg-kiosk-coral/10 border border-kiosk-coral/20 px-3 py-2 text-xs font-bold text-kiosk-coral",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { size: 13 }),
								" ",
								error
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-3 flex flex-wrap gap-2",
							children: [
								{
									name: "Rahul",
									ph: "9876543210"
								},
								{
									name: "Priya",
									ph: "9900112233"
								},
								{
									name: "Suresh",
									ph: "9811223344"
								}
							].map(({ name, ph }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => {
									setInputPhone(ph);
									setPhone(ph);
									load(ph);
								},
								className: "rounded-full border border-kiosk-teal/20 bg-kiosk-teal/5 px-2.5 py-1 text-[11px] font-bold text-kiosk-teal hover:bg-kiosk-teal/10 transition-colors",
								children: [
									"Demo: ",
									name,
									" (",
									ph,
									")"
								]
							}, ph))
						})
					]
				}),
				notifSent && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 rounded-2xl bg-kiosk-teal/10 border border-kiosk-teal/20 px-4 py-3 text-sm font-bold text-kiosk-teal mk-rise",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { size: 16 }),
						" ",
						notifSent
					]
				}),
				appointments.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3 rounded-2xl bg-kiosk-navy px-4 py-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid size-10 place-items-center rounded-full bg-white/10 text-white",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { size: 18 })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-black text-white",
								children: appointments[0]?.patientName
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs font-medium text-white/55",
								children: [
									appointments[0]?.patientAge,
									"y Â· ",
									appointments[0]?.patientGender,
									" Â· ",
									phone
								]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "ml-auto text-xs font-bold text-white/40",
								children: [
									appointments.length,
									" appointment",
									appointments.length !== 1 ? "s" : ""
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex gap-2 rounded-2xl bg-border/20 p-1",
						children: [{
							key: "upcoming",
							label: `Upcoming (${upcoming.length})`
						}, {
							key: "history",
							label: `History (${past.length})`
						}].map(({ key, label }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setActiveTab(key),
							className: `flex-1 rounded-xl py-2 text-sm font-black transition-all ${activeTab === key ? "bg-white text-kiosk-navy shadow-sm" : "text-foreground/50 hover:text-kiosk-navy"}`,
							children: label
						}, key))
					}),
					activeTab === "upcoming" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-4",
						children: upcoming.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border border-border/40 bg-white/80 p-6 text-center",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, {
									size: 32,
									className: "mx-auto mb-2 text-kiosk-teal/40"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm font-bold text-kiosk-navy",
									children: "No upcoming appointments"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-xs font-medium text-foreground/45",
									children: "Book an appointment online to check in for today's OPD"
								})
							]
						}) : upcoming.map((apt) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppointmentCard, {
							apt,
							onSendReminder: handleSendReminder
						}, apt.id))
					}),
					activeTab === "history" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-4",
						children: past.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border border-border/40 bg-white/80 p-6 text-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(History, {
								size: 32,
								className: "mx-auto mb-2 text-foreground/20"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-bold text-kiosk-navy",
								children: "No past appointments"
							})]
						}) : past.map((apt) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PastAppointmentCard, {
							apt,
							onSendFollowUpReminder: handleSendReminder
						}, apt.id))
					})
				] }),
				!phone && appointments.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-3xl border border-border/40 bg-white/80 p-6 text-center space-y-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mx-auto grid size-16 place-items-center rounded-full bg-kiosk-teal/10",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, {
										size: 28,
										className: "text-kiosk-teal"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-xl font-black text-kiosk-navy",
									children: "Your Health Portal"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm font-medium leading-relaxed text-foreground/55 max-w-xs mx-auto",
									children: "View your appointments, check your queue position, get reminders, and track follow-up visits."
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid gap-3 sm:grid-cols-3",
							children: [
								{
									icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Timer, { size: 20 }),
									title: "Live Queue",
									desc: "See your real-time position in the OPD queue",
									color: "text-kiosk-teal bg-kiosk-teal/10"
								},
								{
									icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { size: 20 }),
									title: "Reminders",
									desc: "Get SMS or email reminders before your visit",
									color: "text-kiosk-coral bg-kiosk-coral/10"
								},
								{
									icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(History, { size: 20 }),
									title: "Follow-ups",
									desc: "Track follow-up visits and doctor's notes",
									color: "text-kiosk-sky bg-kiosk-sky/10"
								}
							].map(({ icon, title, desc, color }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-2xl border border-border/40 bg-white/80 p-4 text-center",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: `mx-auto mb-3 grid size-10 place-items-center rounded-xl ${color}`,
										children: icon
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm font-black text-kiosk-navy",
										children: title
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-xs font-medium text-foreground/50 leading-relaxed",
										children: desc
									})
								]
							}, title))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-center gap-2 text-xs font-semibold text-foreground/40",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, {
								size: 12,
								className: "text-kiosk-green"
							}), "Your data is private and secure Â· Ayushman Bharat Digital Mission"]
						})
					]
				})
			]
		})]
	});
}
function AppointmentCard({ apt, onSendReminder }) {
	const [expanded, setExpanded] = (0, import_react.useState)(true);
	const [sending, setSending] = (0, import_react.useState)(false);
	const isToday = apt.date === (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
	const isWaiting = apt.status === "waiting" || apt.status === "in-progress";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `rounded-3xl border-2 bg-white shadow-xl overflow-hidden ${isWaiting ? "border-kiosk-yellow/50" : "border-kiosk-teal/25"}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: `px-5 py-2.5 flex items-center justify-between ${isWaiting ? "bg-kiosk-yellow/15" : "bg-kiosk-teal/8"}`,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: `flex items-center gap-1.5 text-xs font-black uppercase tracking-wide ${isWaiting ? "text-kiosk-navy" : "text-kiosk-teal"}`,
				children: [isWaiting && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-2 rounded-full bg-kiosk-yellow animate-pulse" }), apt.status.replace("-", " ")]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: `rounded-full px-2.5 py-0.5 text-[11px] font-black ${statusColor(apt.status)}`,
				children: ["Token ", apt.token]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "p-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start gap-3 mb-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid size-11 place-items-center rounded-2xl bg-kiosk-teal/10 text-kiosk-teal shrink-0",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stethoscope, { size: 20 })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-base font-black text-kiosk-navy",
									children: apt.doctor
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-medium text-foreground/50",
									children: apt.department
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-medium text-foreground/50",
									children: apt.complaint
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setExpanded((e) => !e),
							className: "text-foreground/30 hover:text-kiosk-teal transition-colors",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, {
								size: 18,
								className: `transition-transform ${expanded ? "rotate-90" : ""}`
							})
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-3 mb-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 rounded-xl bg-kiosk-teal/5 border border-kiosk-teal/15 px-3 py-2.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, {
							size: 15,
							className: "text-kiosk-teal shrink-0"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[10px] font-black uppercase text-foreground/40",
							children: "Date"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-black text-kiosk-navy",
							children: isToday ? "Today" : apt.date
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 rounded-xl bg-kiosk-teal/5 border border-kiosk-teal/15 px-3 py-2.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock3, {
							size: 15,
							className: "text-kiosk-teal shrink-0"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[10px] font-black uppercase text-foreground/40",
							children: "Time"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-black text-kiosk-navy",
							children: apt.timeSlot
						})] })]
					})]
				}),
				isWaiting && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-4 rounded-2xl bg-gradient-to-r from-kiosk-yellow/20 to-kiosk-coral/10 border border-kiosk-yellow/30 p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between mb-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs font-black uppercase tracking-wide text-kiosk-navy/70",
								children: "Queue position"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex items-center gap-1 text-[10px] font-bold text-foreground/40",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { size: 10 }), " Live"]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-end gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-5xl font-black text-kiosk-coral leading-none",
								children: ["#", apt.queuePosition]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mb-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-sm font-black text-kiosk-navy",
									children: [formatWait(apt.estimatedWait), " wait"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[10px] font-medium text-foreground/45",
									children: "Estimated based on current queue"
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-3 flex gap-1.5",
							children: Array.from({ length: Math.min(apt.queuePosition + 2, 8) }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `h-2 flex-1 rounded-full ${i < apt.queuePosition ? "bg-kiosk-yellow" : "bg-border"}` }, i))
						})
					]
				}),
				expanded && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-3 border-t border-border/40 pt-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 text-sm text-foreground/60",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, {
								size: 14,
								className: "text-kiosk-coral shrink-0"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-medium",
								children: "City Hospital, OPD Block A Â· Ground Floor"
							})]
						}),
						apt.notes && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl bg-kiosk-teal/5 border border-kiosk-teal/15 px-3 py-2.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[10px] font-black uppercase text-kiosk-teal/70 mb-1",
								children: "Doctor's note"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-medium text-kiosk-navy",
								children: apt.notes
							})]
						}),
						apt.reminders.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[10px] font-black uppercase tracking-wide text-foreground/40 mb-2",
							children: "Reminders"
						}), apt.reminders.map((rem) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 text-xs text-foreground/55 mb-1",
							children: [
								rem.status === "sent" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, {
									size: 12,
									className: "text-kiosk-teal shrink-0"
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Timer, {
									size: 12,
									className: "text-kiosk-yellow shrink-0"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-medium capitalize",
									children: rem.channel
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-foreground/35",
									children: "â€”"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: rem.status === "sent" ? "Sent" : `Scheduled ${new Date(rem.scheduledFor).toLocaleDateString()}` })
							]
						}, rem.id))] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[10px] font-black uppercase tracking-wide text-foreground/40 mb-2",
							children: "Send reminder now"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex gap-2 flex-wrap",
							children: [
								"sms",
								"email",
								"both"
							].map((ch) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								disabled: sending,
								onClick: async () => {
									setSending(true);
									await onSendReminder(apt, ch);
									setSending(false);
								},
								className: "flex items-center gap-1.5 rounded-xl border border-kiosk-teal/30 bg-white px-3 py-1.5 text-xs font-bold text-kiosk-teal hover:bg-kiosk-teal/5 transition-colors disabled:opacity-50",
								children: [
									ch === "sms" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { size: 11 }),
									ch === "email" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { size: 11 }),
									ch === "both" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { size: 11 }),
									ch === "sms" ? "SMS" : ch === "email" ? "Email" : "Both"
								]
							}, ch))
						})] })
					]
				})
			]
		})]
	});
}
function PastAppointmentCard({ apt, onSendFollowUpReminder }) {
	const [expanded, setExpanded] = (0, import_react.useState)(false);
	const pendingFollowUps = apt.followUps.filter((f) => f.status === "scheduled");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-3xl border border-border/50 bg-white/90 shadow-sm overflow-hidden",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			onClick: () => setExpanded((e) => !e),
			className: "w-full px-5 py-4 flex items-center gap-3 text-left hover:bg-kiosk-teal/3 transition-colors",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: `grid size-10 shrink-0 place-items-center rounded-xl ${statusColor(apt.status)}`,
					children: apt.status === "completed" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { size: 16 }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { size: 16 })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex-1 min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-black text-kiosk-navy",
						children: apt.doctor
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs font-medium text-foreground/50",
						children: [
							apt.date,
							" Â· ",
							apt.timeSlot,
							" Â· ",
							apt.complaint
						]
					})]
				}),
				pendingFollowUps.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "shrink-0 rounded-full bg-kiosk-coral/15 border border-kiosk-coral/20 px-2 py-0.5 text-[10px] font-black text-kiosk-coral",
					children: [pendingFollowUps.length, " follow-up"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, {
					size: 16,
					className: `shrink-0 text-foreground/30 transition-transform ${expanded ? "rotate-90" : ""}`
				})
			]
		}), expanded && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "border-t border-border/40 px-5 py-4 space-y-4",
			children: [
				apt.notes && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl bg-kiosk-teal/5 border border-kiosk-teal/15 px-3 py-2.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[10px] font-black uppercase text-kiosk-teal/70 mb-1",
						children: "Doctor's notes"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-medium text-kiosk-navy leading-relaxed",
						children: apt.notes
					})]
				}),
				apt.followUps.map((fu) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: `rounded-2xl border p-4 ${fu.status === "completed" ? "border-kiosk-teal/20 bg-kiosk-teal/3" : "border-kiosk-coral/25 bg-kiosk-coral/5"}`,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between gap-2 mb-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-black uppercase tracking-wide text-kiosk-coral",
								children: "Follow-up Visit"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-black text-kiosk-navy mt-0.5",
								children: fu.scheduledDate
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `rounded-full px-2.5 py-0.5 text-[10px] font-black ${fu.status === "completed" ? "bg-kiosk-teal/15 text-kiosk-teal" : "bg-kiosk-yellow/20 text-kiosk-navy"}`,
								children: fu.status
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-medium text-foreground/60 mb-1",
							children: fu.reason
						}),
						fu.doctorNote && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-medium text-kiosk-navy italic",
							children: fu.doctorNote
						}),
						fu.reminders.map((rem) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-2 flex items-center gap-2 text-[11px] text-foreground/50",
							children: [rem.status === "sent" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, {
								size: 11,
								className: "text-kiosk-teal"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Timer, {
								size: 11,
								className: "text-kiosk-yellow"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-medium",
								children: ["Reminder ", rem.status === "sent" ? "sent" : `scheduled ${new Date(rem.scheduledFor).toLocaleDateString()}`]
							})]
						}, rem.id)),
						fu.status === "scheduled" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-3 flex gap-2",
							children: ["sms", "email"].map((ch) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => onSendFollowUpReminder(apt, ch),
								className: "flex items-center gap-1 rounded-xl border border-kiosk-coral/30 bg-white px-2.5 py-1 text-[11px] font-bold text-kiosk-coral hover:bg-kiosk-coral/5 transition-colors",
								children: [
									ch === "sms" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { size: 10 }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { size: 10 }),
									"Resend ",
									ch.toUpperCase()
								]
							}, ch))
						})
					]
				}, fu.id)),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 text-xs text-foreground/40",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BadgeCheck, {
						size: 13,
						className: "text-kiosk-teal"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						"Token ",
						apt.token,
						" Â· ",
						apt.department
					] })]
				})
			]
		})]
	});
}
//#endregion
export { PortalPage as component };

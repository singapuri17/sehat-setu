import { n as __exportAll$1 } from "../_runtime.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/appointmentService-CWZMbfqp.js
var appointmentService_CWZMbfqp_exports = /* @__PURE__ */ __exportAll$1({
	a: () => getAppointmentByPhone,
	c: () => sendReminder,
	i: () => formatWait,
	l: () => statusColor,
	n: () => bookFollowUp,
	o: () => getAppointments,
	r: () => createAppointment,
	s: () => portalUrl,
	t: () => appointmentService_exports,
	u: () => updateAppointment
});
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var appointmentService_exports = /* @__PURE__ */ __exportAll({
	bookFollowUp: () => bookFollowUp,
	createAppointment: () => createAppointment,
	demoAppointments: () => demoAppointments,
	formatWait: () => formatWait,
	getAppointmentByPhone: () => getAppointmentByPhone,
	getAppointments: () => getAppointments,
	portalUrl: () => portalUrl,
	sendReminder: () => sendReminder,
	statusColor: () => statusColor,
	updateAppointment: () => updateAppointment
});
var TODAY = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
var TOMORROW = new Date(Date.now() + 864e5).toISOString().slice(0, 10);
var YESTERDAY = (/* @__PURE__ */ new Date(Date.now() - 864e5)).toISOString().slice(0, 10);
var demoAppointments = [
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
		createdAt: (/* @__PURE__ */ new Date(Date.now() - 36e5)).toISOString(),
		updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
		notes: "Pre-consultation completed via MediEase. Hemoglobin below reference range.",
		reminders: [{
			id: "REM-001",
			appointmentId: "APT-0101",
			channel: "sms",
			scheduledFor: (/* @__PURE__ */ new Date(Date.now() - 72e5)).toISOString(),
			sentAt: (/* @__PURE__ */ new Date(Date.now() - 72e5)).toISOString(),
			status: "sent",
			message: "Reminder: Your appointment with Dr. M. Rao is today at 09:30 AM at City Hospital OPD."
		}],
		followUps: []
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
		createdAt: (/* @__PURE__ */ new Date(Date.now() - 24e5)).toISOString(),
		updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
		notes: "",
		reminders: [{
			id: "REM-002",
			appointmentId: "APT-0102",
			channel: "both",
			scheduledFor: (/* @__PURE__ */ new Date(Date.now() - 36e5)).toISOString(),
			sentAt: (/* @__PURE__ */ new Date(Date.now() - 36e5)).toISOString(),
			status: "sent",
			message: "Reminder: Your appointment with Dr. M. Rao is today at 10:00 AM."
		}],
		followUps: []
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
		createdAt: (/* @__PURE__ */ new Date(Date.now() - 18e5)).toISOString(),
		updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
		notes: "",
		reminders: [],
		followUps: []
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
		createdAt: (/* @__PURE__ */ new Date(Date.now() - 72e5)).toISOString(),
		updatedAt: (/* @__PURE__ */ new Date(Date.now() - 18e5)).toISOString(),
		notes: "Prescribed paracetamol. Follow-up in 5 days if fever persists.",
		reminders: [{
			id: "REM-003",
			appointmentId: "APT-0100",
			channel: "sms",
			scheduledFor: (/* @__PURE__ */ new Date(Date.now() - 864e5)).toISOString(),
			sentAt: (/* @__PURE__ */ new Date(Date.now() - 864e5)).toISOString(),
			status: "sent",
			message: "Reminder: Your appointment tomorrow at 09:00 AM with Dr. M. Rao."
		}],
		followUps: [{
			id: "FU-001",
			appointmentId: "APT-0100",
			scheduledDate: new Date(Date.now() + 432e6).toISOString().slice(0, 10),
			reason: "Review fever â€” check if resolved",
			doctorNote: "Prescribed paracetamol 500mg TDS for 3 days. Return if fever persists beyond 5 days.",
			status: "scheduled",
			reminders: [{
				id: "REM-FU-001",
				appointmentId: "APT-0100",
				channel: "both",
				scheduledFor: new Date(Date.now() + 3456e5).toISOString(),
				status: "pending",
				message: "Follow-up reminder: Your follow-up visit with Dr. M. Rao is tomorrow. Please visit City Hospital OPD."
			}]
		}]
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
		createdAt: (/* @__PURE__ */ new Date(Date.now() - 1728e5)).toISOString(),
		updatedAt: (/* @__PURE__ */ new Date(Date.now() - 864e5)).toISOString(),
		notes: "ECG normal. Referred to Cardiology for echo.",
		reminders: [],
		followUps: [{
			id: "FU-002",
			appointmentId: "APT-0099",
			scheduledDate: TOMORROW,
			reason: "Cardiology echo results review",
			doctorNote: "Refer for 2D echo. Review results in OPD next week.",
			status: "scheduled",
			reminders: [{
				id: "REM-FU-002",
				appointmentId: "APT-0099",
				channel: "sms",
				scheduledFor: (/* @__PURE__ */ new Date(Date.now() + 864e5 - 36e5)).toISOString(),
				status: "pending",
				message: "Follow-up reminder: Please visit City Hospital OPD tomorrow for your echo results review."
			}]
		}]
	}
];
/** Get all appointments from the server. Falls back to local store in dev. */
async function getAppointments() {
	try {
		const res = await fetch("/api/appointment");
		if (res.ok) return await res.json();
		return [..._localStore];
	} catch {
		return [..._localStore];
	}
}
/** Get a single appointment by ID or phone number. */
async function getAppointmentByPhone(phone) {
	try {
		const res = await fetch(`/api/appointment?phone=${encodeURIComponent(phone)}`);
		if (res.ok) {
			const data = await res.json();
			if (data.length > 0) return data;
		}
	} catch {}
	return _localStore.filter((a) => a.phone === phone);
}
var _localCounter = 200;
var _localStore = [...demoAppointments];
function makeLocalAppointment(data) {
	const id = `APT-LOCAL-${++_localCounter}`;
	const token = `A-${_localCounter}`;
	const today = data.date ?? (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
	const queuePos = _localStore.filter((a) => a.date === today && ![
		"completed",
		"cancelled",
		"no-show"
	].includes(a.status)).length + 1;
	const now = (/* @__PURE__ */ new Date()).toISOString();
	const apt = {
		...data,
		id,
		token,
		status: "scheduled",
		queuePosition: queuePos,
		estimatedWait: queuePos * 10,
		createdAt: now,
		updatedAt: now,
		reminders: [],
		followUps: [],
		notes: data.notes ?? ""
	};
	_localStore.push(apt);
	return apt;
}
/** Create a new appointment. Falls back to client-side store in dev (when /api/appointment returns 404). */
async function createAppointment(data) {
	try {
		const res = await fetch("/api/appointment", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(data)
		});
		if (res.ok) return await res.json();
		console.warn("[appointmentService] API unavailable, using local fallback");
		return makeLocalAppointment(data);
	} catch {
		console.warn("[appointmentService] Fetch failed, using local fallback");
		return makeLocalAppointment(data);
	}
}
/** Update appointment status, notes, or queue position. Falls back silently in dev. */
async function updateAppointment(id, patch) {
	try {
		const res = await fetch("/api/appointment", {
			method: "PATCH",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				id,
				...patch
			})
		});
		if (res.ok) return await res.json();
	} catch {}
	const idx = _localStore.findIndex((a) => a.id === id);
	if (idx !== -1) {
		_localStore[idx] = {
			..._localStore[idx],
			...patch,
			updatedAt: (/* @__PURE__ */ new Date()).toISOString()
		};
		return _localStore[idx];
	}
	throw new Error("Appointment not found");
}
/** Dispatch a reminder (SMS / email). Silently succeeds in dev when API is unavailable. */
async function sendReminder(appointmentId, channel, message, scheduledFor) {
	try {
		const res = await fetch("/api/notify", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				appointmentId,
				channel,
				message,
				scheduledFor
			})
		});
		if (res.ok) return await res.json();
	} catch {}
	console.info(`[notify-dev] ${channel.toUpperCase()} â†’ Apt ${appointmentId}: ${message}`);
	return {
		success: true,
		message: `[Dev] ${channel} notification simulated`
	};
}
/** Book a follow-up visit and dispatch reminder. */
async function bookFollowUp(appointmentId, scheduledDate, reason, doctorNote, channel) {
	try {
		const res = await fetch("/api/appointment", {
			method: "PATCH",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				id: appointmentId,
				addFollowUp: {
					scheduledDate,
					reason,
					doctorNote,
					channel
				}
			})
		});
		if (res.ok) return await res.json();
	} catch {}
	const followUp = {
		id: `FU-LOCAL-${Date.now()}`,
		appointmentId,
		scheduledDate,
		reason,
		doctorNote,
		status: "scheduled",
		reminders: [{
			id: `REM-FU-LOCAL-${Date.now()}`,
			appointmentId,
			channel,
			scheduledFor: (/* @__PURE__ */ new Date((/* @__PURE__ */ new Date(scheduledDate + "T08:00:00")).getTime() - 864e5)).toISOString(),
			status: "pending",
			message: `Follow-up reminder: Your follow-up is tomorrow (${scheduledDate}).`
		}]
	};
	const apt = _localStore.find((a) => a.id === appointmentId);
	if (apt) apt.followUps.push(followUp);
	return {
		followUp,
		reminder: followUp.reminders[0]
	};
}
/** Returns a patient-facing portal URL. */
function portalUrl(phone) {
	return `${typeof window !== "undefined" ? window.location.origin : ""}/portal?phone=${encodeURIComponent(phone)}`;
}
/** Human-readable wait time string. */
function formatWait(minutes) {
	if (minutes === 0) return "Now";
	if (minutes < 60) return `~${minutes} min`;
	return `~${Math.floor(minutes / 60)}h ${minutes % 60}min`;
}
/** Status badge colour classes. */
function statusColor(status) {
	switch (status) {
		case "scheduled": return "bg-kiosk-sky/15 text-kiosk-sky border border-kiosk-sky/20";
		case "waiting": return "bg-kiosk-yellow/20 text-kiosk-navy border border-kiosk-yellow/30";
		case "in-progress": return "bg-kiosk-coral/15 text-kiosk-coral border border-kiosk-coral/20";
		case "completed": return "bg-kiosk-teal/15 text-kiosk-teal border border-kiosk-teal/20";
		case "cancelled": return "bg-foreground/10 text-foreground/50 border border-foreground/20";
		case "no-show": return "bg-kiosk-coral/10 text-kiosk-coral/70 border border-kiosk-coral/15";
	}
}
//#endregion
export { getAppointmentByPhone as a, sendReminder as c, formatWait as i, statusColor as l, bookFollowUp as n, getAppointments as o, createAppointment as r, portalUrl as s, appointmentService_CWZMbfqp_exports as t, updateAppointment as u };

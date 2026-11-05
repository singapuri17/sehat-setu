import { i as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, o as require_react } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { c as lazyRouteComponent, d as Link, i as HeadContent, l as createFileRoute, o as createRouter, p as useRouter, r as Scripts, s as Outlet, u as createRootRouteWithContext } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { t as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-CGNHCzBt.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-TTx5CYEO.css";
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
	const message = error instanceof Response ? `Response ${error.status}${error.url ? ` at ${error.url}` : ""}` : error instanceof Error ? error.message : String(error);
	const stack = error instanceof Error ? error.stack : void 0;
	window.__lovableReportRuntimeError?.({
		message,
		...stack !== void 0 && { stack },
		filename: window.location.pathname
	});
}
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$4 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "MediEase â€” Digital Health & Appointment System" },
			{
				name: "description",
				content: "MediEase: Appointment booking, live queue tracking, SMS/email reminders and follow-up support for public healthcare facilities."
			},
			{
				name: "author",
				content: "MediEase"
			},
			{
				property: "og:title",
				content: "MediEase â€” Digital Health & Appointment System"
			},
			{
				property: "og:description",
				content: "Appointment management, queue tracking, SMS/email reminders and follow-ups."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			},
			{
				name: "twitter:site",
				content: "@Lovable"
			}
		],
		links: [{
			rel: "stylesheet",
			href: styles_default
		}, {
			rel: "icon",
			href: "/logo.png",
			type: "image/png"
		}]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$4.useRouteContext();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
	});
}
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
var $$splitComponentImporter$3 = () => import("./routes-DjZEHOqH.mjs");
var Route$3 = createFileRoute("/")({
	head: () => ({ meta: [
		{ title: "MediEase â€” Book Your Appointment" },
		{
			name: "description",
			content: "Book a hospital appointment, check your queue position and get SMS reminders."
		},
		{
			property: "og:title",
			content: "MediEase â€” Digital Health & Appointment System"
		},
		{
			property: "og:type",
			content: "website"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
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
var $$splitComponentImporter$2 = () => import("./mobile-2uI_CqhY.mjs");
var Route$2 = createFileRoute("/mobile")({
	head: () => ({ meta: [
		{ title: "MediEase â€” Mobile Pre-Consultation" },
		{
			name: "description",
			content: "Complete your pre-consultation on your phone before reaching the OPD counter."
		},
		{
			name: "viewport",
			content: "width=device-width, initial-scale=1, maximum-scale=1"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component"),
	validateSearch: (search) => ({ session: typeof search.session === "string" ? search.session : void 0 })
});
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
var $$splitComponentImporter$1 = () => import("./portal-CUYSuMFk.mjs");
var Route$1 = createFileRoute("/portal")({
	head: () => ({ meta: [
		{ title: "MediEase â€” My Appointments & Health Portal" },
		{
			name: "description",
			content: "Check your appointment status, queue position, reminders and follow-ups."
		},
		{
			name: "viewport",
			content: "width=device-width, initial-scale=1, maximum-scale=1"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component"),
	validateSearch: (search) => ({ phone: typeof search.phone === "string" ? search.phone : void 0 })
});
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
var $$splitComponentImporter = () => import("./staff-CJe6-p12.mjs");
var Route = createFileRoute("/staff")({
	head: () => ({ meta: [{ title: "MediEase â€” Staff Portal" }, {
		name: "description",
		content: "Hospital staff appointment management â€” book, track, remind, follow up."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var rootRouteChildren = {
	IndexRoute: Route$3.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$4
	}),
	MobileRoute: Route$2.update({
		id: "/mobile",
		path: "/mobile",
		getParentRoute: () => Route$4
	}),
	PortalRoute: Route$1.update({
		id: "/portal",
		path: "/portal",
		getParentRoute: () => Route$4
	}),
	StaffRoute: Route.update({
		id: "/staff",
		path: "/staff",
		getParentRoute: () => Route$4
	})
};
var routeTree = Route$4._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	const queryClient = new QueryClient();
	return createRouter({
		routeTree,
		context: { queryClient },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };

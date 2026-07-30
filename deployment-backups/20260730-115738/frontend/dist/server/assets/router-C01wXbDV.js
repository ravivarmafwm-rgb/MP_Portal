import { tt as isStoredAuthenticated } from "./api-CQX857SN.js";
import { t as AuthProvider } from "./auth-B-xQo2jy.js";
import { t as Route$98 } from "./_app.projects.progress-tracker-oOl8OKgv.js";
import { t as Route$99 } from "./_app.projects.budget-monitoring-D79XNdlk.js";
import { t as Route$100 } from "./_app.projects.analytics-B5RqcNJE.js";
import { t as Route$101 } from "./_app.citizens.profile-Ccnfj7a0.js";
import { useEffect } from "react";
import { HeadContent, Link, Outlet, Scripts, createFileRoute, createRootRouteWithContext, createRouter, lazyRouteComponent, redirect, useRouter } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { z } from "zod";
//#region src/styles.css?url
var styles_default = "/assets/styles-CykjX8EH.css";
//#endregion
//#region src/lib/lovable-error-reporting.ts
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
}
//#endregion
//#region src/components/theme/ThemeProvider.tsx
function ThemeProvider$1({ children }) {
	return /* @__PURE__ */ jsx(ThemeProvider, {
		attribute: "class",
		defaultTheme: "light",
		enableSystem: true,
		disableTransitionOnChange: true,
		children
	});
}
//#endregion
//#region src/components/ui/sonner.tsx
var Toaster$1 = ({ ...props }) => {
	return /* @__PURE__ */ jsx(Toaster, {
		className: "toaster group",
		toastOptions: { classNames: {
			toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
			description: "group-[.toast]:text-muted-foreground",
			actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
			cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
		} },
		...props
	});
};
//#endregion
//#region src/routes/__root.tsx
function NotFoundComponent() {
	return /* @__PURE__ */ jsx("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ jsxs("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ jsx("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ jsx("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ jsx("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ jsx("div", {
					className: "mt-6",
					children: /* @__PURE__ */ jsx(Link, {
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
	useEffect(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ jsx("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ jsxs("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ jsx("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ jsx("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ jsx("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					}), /* @__PURE__ */ jsx("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$97 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "Lovable App" },
			{
				name: "description",
				content: "MP Constituency Management Platform is a modern, enterprise-grade web application for navigating constituency data and operations."
			},
			{
				name: "author",
				content: "Lovable"
			},
			{
				property: "og:title",
				content: "Lovable App"
			},
			{
				property: "og:description",
				content: "MP Constituency Management Platform is a modern, enterprise-grade web application for navigating constituency data and operations."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary"
			},
			{
				name: "twitter:site",
				content: "@Lovable"
			},
			{
				name: "twitter:title",
				content: "Lovable App"
			},
			{
				name: "twitter:description",
				content: "MP Constituency Management Platform is a modern, enterprise-grade web application for navigating constituency data and operations."
			},
			{
				property: "og:image",
				content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/b9637a70-3c23-4b0e-9f86-f3b61bf2b474/id-preview-7c62edd3--ba25cedb-16ed-422a-86cf-5e09ede34012.lovable.app-1781845015649.png"
			},
			{
				name: "twitter:image",
				content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/b9637a70-3c23-4b0e-9f86-f3b61bf2b474/id-preview-7c62edd3--ba25cedb-16ed-422a-86cf-5e09ede34012.lovable.app-1781845015649.png"
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: ""
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ jsxs("html", {
		lang: "en",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ jsx("head", { children: /* @__PURE__ */ jsx(HeadContent, {}) }), /* @__PURE__ */ jsxs("body", { children: [children, /* @__PURE__ */ jsx(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$97.useRouteContext();
	return /* @__PURE__ */ jsx(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ jsx(ThemeProvider$1, { children: /* @__PURE__ */ jsxs(AuthProvider, { children: [/* @__PURE__ */ jsx(Outlet, {}), /* @__PURE__ */ jsx(Toaster$1, {
			richColors: true,
			position: "top-right"
		})] }) })
	});
}
//#endregion
//#region src/routes/register.tsx
var $$splitComponentImporter$92 = () => import("./register-DKFhHgGa.js");
var Route$96 = createFileRoute("/register")({ component: lazyRouteComponent($$splitComponentImporter$92, "component") });
z.object({
	name: z.string().min(2, "Name must be at least 2 characters"),
	email: z.string().email("Enter a valid email"),
	password: z.string().min(8, "Password must be at least 8 characters"),
	password_confirmation: z.string().min(8, "Confirm password must be at least 8 characters"),
	role_slug: z.string().min(1, "Please select a role")
}).refine((data) => data.password === data.password_confirmation, {
	message: "Passwords don't match",
	path: ["password_confirmation"]
});
//#endregion
//#region src/routes/login.tsx
var $$splitComponentImporter$91 = () => import("./login-B6-ZZQfO.js");
var Route$95 = createFileRoute("/login")({ component: lazyRouteComponent($$splitComponentImporter$91, "component") });
z.object({
	email: z.string().email("Enter a valid email"),
	password: z.string().min(4, "Password required")
});
//#endregion
//#region src/routes/_app.tsx
var $$splitComponentImporter$90 = () => import("./_app-CVAvvnNZ.js");
var Route$94 = createFileRoute("/_app")({
	beforeLoad: () => {
		if (!isStoredAuthenticated()) throw redirect({
			to: "/login",
			replace: true
		});
	},
	component: lazyRouteComponent($$splitComponentImporter$90, "component")
});
//#endregion
//#region src/routes/index.tsx
var $$splitComponentImporter$89 = () => import("./routes-CuF1XkpH.js");
var Route$93 = createFileRoute("/")({ component: lazyRouteComponent($$splitComponentImporter$89, "component") });
//#endregion
//#region src/routes/_app.volunteers.tsx
var $$splitComponentImporter$88 = () => import("./_app.volunteers-B9nHRV23.js");
var Route$92 = createFileRoute("/_app/volunteers")({ component: lazyRouteComponent($$splitComponentImporter$88, "component") });
//#endregion
//#region src/routes/_app.volunteer.tsx
var $$splitComponentImporter$87 = () => import("./_app.volunteer-CFRMSMDR.js");
var Route$91 = createFileRoute("/_app/volunteer")({
	head: () => ({ meta: [{ title: "Volunteer Dashboard — MP Platform" }] }),
	component: lazyRouteComponent($$splitComponentImporter$87, "component")
});
//#endregion
//#region src/routes/_app.surveys.tsx
var $$splitComponentImporter$86 = () => import("./_app.surveys-B0zIDB1m.js");
var Route$90 = createFileRoute("/_app/surveys")({ component: lazyRouteComponent($$splitComponentImporter$86, "component") });
//#endregion
//#region src/routes/_app.staff.tsx
var $$splitComponentImporter$85 = () => import("./_app.staff-Dl6yuyY5.js");
var Route$89 = createFileRoute("/_app/staff")({
	head: () => ({ meta: [{ title: "Staff Dashboard — MP Platform" }] }),
	component: lazyRouteComponent($$splitComponentImporter$85, "component")
});
//#endregion
//#region src/routes/_app.settings.tsx
var $$splitComponentImporter$84 = () => import("./_app.settings-DQQn5S7M.js");
var Route$88 = createFileRoute("/_app/settings")({
	head: () => ({ meta: [{ title: "Settings — MP Constituency Platform" }, {
		name: "description",
		content: "Workspace, team, integrations and security configuration."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$84, "component")
});
//#endregion
//#region src/routes/_app.schemes.tsx
var $$splitComponentImporter$83 = () => import("./_app.schemes-DXu2hFJR.js");
var Route$87 = createFileRoute("/_app/schemes")({ component: lazyRouteComponent($$splitComponentImporter$83, "component") });
//#endregion
//#region src/routes/_app.projects.tsx
var $$splitComponentImporter$82 = () => import("./_app.projects-m9nTjKlf.js");
var Route$86 = createFileRoute("/_app/projects")({ component: lazyRouteComponent($$splitComponentImporter$82, "component") });
//#endregion
//#region src/routes/_app.officer.tsx
var $$splitComponentImporter$81 = () => import("./_app.officer-Cgguwg2i.js");
var Route$85 = createFileRoute("/_app/officer")({
	head: () => ({ meta: [{ title: "Officer Dashboard — MP Platform" }] }),
	component: lazyRouteComponent($$splitComponentImporter$81, "component")
});
//#endregion
//#region src/routes/_app.mp.tsx
var $$splitComponentImporter$80 = () => import("./_app.mp-pRTxZD7l.js");
var Route$84 = createFileRoute("/_app/mp")({
	head: () => ({ meta: [{ title: "MP Command Center — MP Platform" }] }),
	component: lazyRouteComponent($$splitComponentImporter$80, "component")
});
//#endregion
//#region src/routes/_app.mla.tsx
var $$splitComponentImporter$79 = () => import("./_app.mla-DcYhOfRI.js");
var Route$83 = createFileRoute("/_app/mla")({
	head: () => ({ meta: [{ title: "MLA Assembly Dashboard — MP Platform" }] }),
	component: lazyRouteComponent($$splitComponentImporter$79, "component")
});
//#endregion
//#region src/routes/_app.meetings.tsx
var $$splitComponentImporter$78 = () => import("./_app.meetings-D9sFfBv3.js");
var Route$82 = createFileRoute("/_app/meetings")({ component: lazyRouteComponent($$splitComponentImporter$78, "component") });
//#endregion
//#region src/routes/_app.grievances.tsx
var $$splitComponentImporter$77 = () => import("./_app.grievances-DvXXp4YN.js");
var Route$81 = createFileRoute("/_app/grievances")({ component: lazyRouteComponent($$splitComponentImporter$77, "component") });
//#endregion
//#region src/routes/_app.documents.tsx
var $$splitComponentImporter$76 = () => import("./_app.documents-DK2ATboA.js");
var Route$80 = createFileRoute("/_app/documents")({ component: lazyRouteComponent($$splitComponentImporter$76, "component") });
//#endregion
//#region src/routes/_app.dashboard.tsx
var $$splitComponentImporter$75 = () => import("./_app.dashboard-Bin9gHbD.js");
var Route$79 = createFileRoute("/_app/dashboard")({
	head: () => ({ meta: [{ title: "Command Center — MP Constituency Platform" }, {
		name: "description",
		content: "Live mission-control view of citizens, grievances, projects, schemes, volunteers and survey insights."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$75, "component")
});
//#endregion
//#region src/routes/_app.coordinator.tsx
var $$splitComponentImporter$74 = () => import("./_app.coordinator-Dmi-IiUW.js");
var Route$78 = createFileRoute("/_app/coordinator")({
	head: () => ({ meta: [{ title: "Coordinator Dashboard — MP Platform" }] }),
	component: lazyRouteComponent($$splitComponentImporter$74, "component")
});
//#endregion
//#region src/routes/_app.communication.tsx
var $$splitComponentImporter$73 = () => import("./_app.communication-CSIMH9IS.js");
var Route$77 = createFileRoute("/_app/communication")({ component: lazyRouteComponent($$splitComponentImporter$73, "component") });
//#endregion
//#region src/routes/_app.citizens.tsx
var $$splitComponentImporter$72 = () => import("./_app.citizens-CZ3epkbO.js");
var Route$76 = createFileRoute("/_app/citizens")({ component: lazyRouteComponent($$splitComponentImporter$72, "component") });
//#endregion
//#region src/routes/_app.citizen.tsx
var $$splitComponentImporter$71 = () => import("./_app.citizen-BcCOq6dv.js");
var Route$75 = createFileRoute("/_app/citizen")({
	head: () => ({ meta: [{ title: "Citizen Portal — MP Platform" }] }),
	component: lazyRouteComponent($$splitComponentImporter$71, "component")
});
//#endregion
//#region src/routes/_app.analytics.tsx
var $$splitComponentImporter$70 = () => import("./_app.analytics-DX9amyyW.js");
var Route$74 = createFileRoute("/_app/analytics")({ component: lazyRouteComponent($$splitComponentImporter$70, "component") });
//#endregion
//#region src/routes/_app.admin.tsx
var $$splitComponentImporter$69 = () => import("./_app.admin-DRQ48Fo9.js");
var Route$73 = createFileRoute("/_app/admin")({
	head: () => ({ meta: [{ title: "Admin Dashboard — MP Platform" }] }),
	component: lazyRouteComponent($$splitComponentImporter$69, "component")
});
//#endregion
//#region src/routes/_app.volunteers.index.tsx
var $$splitComponentImporter$68 = () => import("./_app.volunteers.index-CWQ_oEmi.js");
var Route$72 = createFileRoute("/_app/volunteers/")({
	head: () => ({ meta: [{ title: "Field Operations Command Center — Volunteers" }, {
		name: "description",
		content: "Live operations dashboard for the MP volunteer field force."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$68, "component")
});
//#endregion
//#region src/routes/_app.surveys.index.tsx
var Route$71 = createFileRoute("/_app/surveys/")({ beforeLoad: () => {
	throw redirect({ to: "/surveys/dashboard" });
} });
//#endregion
//#region src/routes/_app.schemes.index.tsx
var Route$70 = createFileRoute("/_app/schemes/")({ beforeLoad: () => {
	throw redirect({ to: "/schemes/dashboard" });
} });
//#endregion
//#region src/routes/_app.projects.index.tsx
var Route$69 = createFileRoute("/_app/projects/")({ beforeLoad: () => {
	throw redirect({ to: "/projects/dashboard" });
} });
//#endregion
//#region src/routes/_app.meetings.index.tsx
var $$splitComponentImporter$67 = () => import("./_app.meetings.index-D10BMG6W.js");
var Route$68 = createFileRoute("/_app/meetings/")({ component: lazyRouteComponent($$splitComponentImporter$67, "component") });
//#endregion
//#region src/routes/_app.grievances.index.tsx
var Route$67 = createFileRoute("/_app/grievances/")({ beforeLoad: () => {
	throw redirect({ to: "/grievances/dashboard" });
} });
//#endregion
//#region src/routes/_app.documents.index.tsx
var $$splitComponentImporter$66 = () => import("./_app.documents.index-CVb7IBee.js");
var Route$66 = createFileRoute("/_app/documents/")({
	head: () => ({ meta: [{ title: "Documents — MP Constituency Platform" }, {
		name: "description",
		content: "Citizen records and project documentation — searchable and secure."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$66, "component")
});
//#endregion
//#region src/routes/_app.communication.index.tsx
var $$splitComponentImporter$65 = () => import("./_app.communication.index-8lKfG8F0.js");
var Route$65 = createFileRoute("/_app/communication/")({
	head: () => ({ meta: [{ title: "Communication Hub — MP Constituency Platform" }, {
		name: "description",
		content: "Broadcast and one-to-one outreach across SMS, WhatsApp and email."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$65, "component")
});
//#endregion
//#region src/routes/_app.citizens.index.tsx
var $$splitComponentImporter$64 = () => import("./_app.citizens.index-DrV5EnZy.js");
var Route$64 = createFileRoute("/_app/citizens/")({ component: lazyRouteComponent($$splitComponentImporter$64, "component") });
//#endregion
//#region src/routes/_app.analytics.index.tsx
var $$splitComponentImporter$63 = () => import("./_app.analytics.index-CYPO_wcE.js");
var Route$63 = createFileRoute("/_app/analytics/")({
	head: () => ({ meta: [{ title: "Analytics — MP Constituency Platform" }, {
		name: "description",
		content: "Drill down from constituency to village with rich visual analytics."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$63, "component")
});
//#endregion
//#region src/routes/_app.volunteers.training.tsx
var $$splitComponentImporter$62 = () => import("./_app.volunteers.training-BOJ8P1hj.js");
var Route$62 = createFileRoute("/_app/volunteers/training")({
	head: () => ({ meta: [{ title: "Training Center — Volunteers" }, {
		name: "description",
		content: "Volunteer training programs, certifications and completion tracking."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$62, "component")
});
//#endregion
//#region src/routes/_app.volunteers.profile.tsx
var $$splitComponentImporter$61 = () => import("./_app.volunteers.profile-ODED5sIz.js");
var Route$61 = createFileRoute("/_app/volunteers/profile")({
	head: () => ({ meta: [{ title: "Volunteer 360 — MP Constituency Platform" }, {
		name: "description",
		content: "Complete 360° view of a single volunteer — activity, surveys, complaints, attendance and timeline."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$61, "component")
});
//#endregion
//#region src/routes/_app.volunteers.performance.tsx
var $$splitComponentImporter$60 = () => import("./_app.volunteers.performance-COo7DCQv.js");
var Route$60 = createFileRoute("/_app/volunteers/performance")({
	head: () => ({ meta: [{ title: "Performance Center — Volunteers" }, {
		name: "description",
		content: "Leaderboards and rankings of top performing volunteers, villages and mandals."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$60, "component")
});
//#endregion
//#region src/routes/_app.volunteers.list.tsx
var $$splitComponentImporter$59 = () => import("./_app.volunteers.list-BIFQMX2z.js");
var Route$59 = createFileRoute("/_app/volunteers/list")({
	head: () => ({ meta: [{ title: "Volunteer Directory — MP Constituency Platform" }] }),
	component: lazyRouteComponent($$splitComponentImporter$59, "component")
});
//#endregion
//#region src/routes/_app.volunteers.geographic-coverage.tsx
var $$splitComponentImporter$58 = () => import("./_app.volunteers.geographic-coverage-BZV33Cy_.js");
var Route$58 = createFileRoute("/_app/volunteers/geographic-coverage")({
	head: () => ({ meta: [{ title: "Geographic Coverage — Volunteers" }, {
		name: "description",
		content: "GIS-style coverage dashboard showing village, mandal and constituency reach."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$58, "component")
});
//#endregion
//#region src/routes/_app.volunteers.enrolled-citizens.tsx
var $$splitComponentImporter$57 = () => import("./_app.volunteers.enrolled-citizens-DQolTOrX.js");
var Route$57 = createFileRoute("/_app/volunteers/enrolled-citizens")({
	head: () => ({ meta: [{ title: "Enrolled Citizens — Volunteers" }, {
		name: "description",
		content: "Citizens enrolled and verified by field volunteers."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$57, "component")
});
//#endregion
//#region src/routes/_app.volunteers.attendance.tsx
var $$splitComponentImporter$56 = () => import("./_app.volunteers.attendance-oOutUMqt.js");
var Route$56 = createFileRoute("/_app/volunteers/attendance")({
	head: () => ({ meta: [{ title: "Attendance Management — Volunteers" }, {
		name: "description",
		content: "Track volunteer attendance, GPS check-ins and field visits."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$56, "component")
});
//#endregion
//#region src/routes/_app.volunteers.activity.tsx
var $$splitComponentImporter$55 = () => import("./_app.volunteers.activity-CjIXEsJS.js");
var Route$55 = createFileRoute("/_app/volunteers/activity")({
	head: () => ({ meta: [{ title: "Activity Monitor — Volunteers" }, {
		name: "description",
		content: "Real-time field activity monitoring across the volunteer workforce."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$55, "component")
});
//#endregion
//#region src/routes/_app.surveys.responses.tsx
var $$splitComponentImporter$54 = () => import("./_app.surveys.responses-CO5eo5y4.js");
var Route$54 = createFileRoute("/_app/surveys/responses")({
	head: () => ({ meta: [{ title: "Survey Responses — MP Constituency Platform" }] }),
	component: lazyRouteComponent($$splitComponentImporter$54, "component")
});
//#endregion
//#region src/routes/_app.surveys.intelligence.tsx
var $$splitComponentImporter$53 = () => import("./_app.surveys.intelligence-DH93TRIH.js");
var Route$53 = createFileRoute("/_app/surveys/intelligence")({
	head: () => ({ meta: [{ title: "Constituency Intelligence — MP Constituency Platform" }] }),
	component: lazyRouteComponent($$splitComponentImporter$53, "component")
});
//#endregion
//#region src/routes/_app.surveys.form-builder.tsx
var $$splitComponentImporter$52 = () => import("./_app.surveys.form-builder-fsT2P7Vf.js");
var Route$52 = createFileRoute("/_app/surveys/form-builder")({
	head: () => ({ meta: [{ title: "Form Builder — MP Constituency Platform" }] }),
	component: lazyRouteComponent($$splitComponentImporter$52, "component")
});
//#endregion
//#region src/routes/_app.surveys.detail.tsx
var $$splitComponentImporter$51 = () => import("./_app.surveys.detail-EpcEUnAf.js");
var Route$51 = createFileRoute("/_app/surveys/detail")({
	validateSearch: (s) => ({ id: String(s.id ?? "") }),
	head: () => ({ meta: [{ title: "Survey 360 — MP Constituency Platform" }] }),
	component: lazyRouteComponent($$splitComponentImporter$51, "component")
});
//#endregion
//#region src/routes/_app.surveys.dashboard.tsx
var $$splitComponentImporter$50 = () => import("./_app.surveys.dashboard-l-b3Kl8T.js");
var Route$50 = createFileRoute("/_app/surveys/dashboard")({
	head: () => ({ meta: [{ title: "Surveys — Command Center" }] }),
	component: lazyRouteComponent($$splitComponentImporter$50, "component")
});
//#endregion
//#region src/routes/_app.surveys.census.tsx
var $$splitComponentImporter$49 = () => import("./_app.surveys.census-CXNJeMwT.js");
var Route$49 = createFileRoute("/_app/surveys/census")({
	head: () => ({ meta: [{ title: "Constituency Census Center — MP Constituency" }] }),
	component: lazyRouteComponent($$splitComponentImporter$49, "component")
});
//#endregion
//#region src/routes/_app.surveys.analytics.tsx
var $$splitComponentImporter$48 = () => import("./_app.surveys.analytics-_IFCu3vW.js");
var Route$48 = createFileRoute("/_app/surveys/analytics")({
	head: () => ({ meta: [{ title: "Survey Analytics — MP Constituency Platform" }] }),
	component: lazyRouteComponent($$splitComponentImporter$48, "component")
});
//#endregion
//#region src/routes/_app.surveys.active.tsx
var $$splitComponentImporter$47 = () => import("./_app.surveys.active-xuN3qYLI.js");
var Route$47 = createFileRoute("/_app/surveys/active")({
	head: () => ({ meta: [{ title: "Active Surveys — MP Constituency Platform" }] }),
	component: lazyRouteComponent($$splitComponentImporter$47, "component")
});
//#endregion
//#region src/routes/_app.schemes.scheme-catalog.tsx
var $$splitComponentImporter$46 = () => import("./_app.schemes.scheme-catalog-Bt-4UBcc.js");
var Route$46 = createFileRoute("/_app/schemes/scheme-catalog")({
	head: () => ({ meta: [{ title: "Scheme Catalog — Welfare Programs" }, {
		name: "description",
		content: "Explore all government welfare schemes available to constituents."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$46, "component")
});
//#endregion
//#region src/routes/_app.schemes.performance.tsx
var $$splitComponentImporter$45 = () => import("./_app.schemes.performance-YQk6tI9w.js");
var Route$45 = createFileRoute("/_app/schemes/performance")({
	head: () => ({ meta: [{ title: "Scheme Performance Center" }, {
		name: "description",
		content: "Department efficiency and scheme performance analytics."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$45, "component")
});
//#endregion
//#region src/routes/_app.schemes.eligibility.tsx
var $$splitComponentImporter$44 = () => import("./_app.schemes.eligibility-C3HIMGix.js");
var Route$44 = createFileRoute("/_app/schemes/eligibility")({
	head: () => ({ meta: [{ title: "Eligibility Engine — Scheme Management" }, {
		name: "description",
		content: "AI-powered citizen eligibility matrix across welfare schemes."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$44, "component")
});
//#endregion
//#region src/routes/_app.schemes.dashboard.tsx
var $$splitComponentImporter$43 = () => import("./_app.schemes.dashboard-BUZBLuE8.js");
var Route$43 = createFileRoute("/_app/schemes/dashboard")({
	head: () => ({ meta: [{ title: "Schemes — Command Center" }] }),
	component: lazyRouteComponent($$splitComponentImporter$43, "component")
});
//#endregion
//#region src/routes/_app.schemes.coverage-analysis.tsx
var $$splitComponentImporter$42 = () => import("./_app.schemes.coverage-analysis-CJLAFd7G.js");
var Route$42 = createFileRoute("/_app/schemes/coverage-analysis")({
	head: () => ({ meta: [{ title: "Coverage Analysis — Welfare Geography" }, {
		name: "description",
		content: "Geographic welfare coverage and underserved area identification."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$42, "component")
});
//#endregion
//#region src/routes/_app.schemes.beneficiaries.tsx
var $$splitComponentImporter$41 = () => import("./_app.schemes.beneficiaries-pjWFF6cS.js");
var Route$41 = createFileRoute("/_app/schemes/beneficiaries")({
	head: () => ({ meta: [{ title: "Beneficiary Intelligence Center" }, {
		name: "description",
		content: "Welfare beneficiary analytics across schemes, villages and assemblies."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$41, "component")
});
//#endregion
//#region src/routes/_app.schemes.applications.tsx
var $$splitComponentImporter$40 = () => import("./_app.schemes.applications-4G_dOIST.js");
var Route$40 = createFileRoute("/_app/schemes/applications")({
	head: () => ({ meta: [{ title: "Applications — Scheme Management" }, {
		name: "description",
		content: "Enterprise application directory across all welfare schemes."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$40, "component")
});
//#endregion
//#region src/routes/_app.schemes.application-detail.tsx
var $$splitComponentImporter$39 = () => import("./_app.schemes.application-detail-Czft2C6Y.js");
var Route$39 = createFileRoute("/_app/schemes/application-detail")({
	head: () => ({ meta: [{ title: "Application 360 — Scheme Management" }, {
		name: "description",
		content: "Complete application journey, verification and benefit history."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$39, "component")
});
//#endregion
//#region src/routes/_app.projects.project-detail.tsx
var $$splitComponentImporter$38 = () => import("./_app.projects.project-detail-B1D1eBVd.js");
var Route$38 = createFileRoute("/_app/projects/project-detail")({
	validateSearch: (s) => ({ id: String(s.id ?? "") }),
	head: () => ({ meta: [{ title: "Project 360 — Detail View" }] }),
	component: lazyRouteComponent($$splitComponentImporter$38, "component")
});
//#endregion
//#region src/routes/_app.projects.mplads.tsx
var $$splitComponentImporter$37 = () => import("./_app.projects.mplads-2gNTldZY.js");
var Route$37 = createFileRoute("/_app/projects/mplads")({
	head: () => ({ meta: [{ title: "MPLADS Management Center" }] }),
	component: lazyRouteComponent($$splitComponentImporter$37, "component")
});
//#endregion
//#region src/routes/_app.projects.development.tsx
var $$splitComponentImporter$36 = () => import("./_app.projects.development-DSnDTEaq.js");
var Route$36 = createFileRoute("/_app/projects/development")({
	head: () => ({ meta: [{ title: "Development Project Directory" }] }),
	component: lazyRouteComponent($$splitComponentImporter$36, "component")
});
//#endregion
//#region src/routes/_app.projects.dashboard.tsx
var $$splitComponentImporter$35 = () => import("./_app.projects.dashboard-CCUwTx3N.js");
var Route$35 = createFileRoute("/_app/projects/dashboard")({
	head: () => ({ meta: [{ title: "Projects — Command Center" }] }),
	component: lazyRouteComponent($$splitComponentImporter$35, "component")
});
//#endregion
//#region src/routes/_app.projects.contractors.tsx
var $$splitComponentImporter$34 = () => import("./_app.projects.contractors-DKbmPRM4.js");
var Route$34 = createFileRoute("/_app/projects/contractors")({
	head: () => ({ meta: [{ title: "Contractor Management" }, {
		name: "description",
		content: "Contractor intelligence center · performance, risk and assignments."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$34, "component")
});
//#endregion
//#region src/routes/_app.meetings.tours.tsx
var $$splitComponentImporter$33 = () => import("./_app.meetings.tours-BusJDZQ6.js");
var Route$33 = createFileRoute("/_app/meetings/tours")({
	head: () => ({ meta: [{ title: "MP Tours — Constituency Field Visits" }] }),
	component: lazyRouteComponent($$splitComponentImporter$33, "component")
});
//#endregion
//#region src/routes/_app.meetings.public-meetings.tsx
var $$splitComponentImporter$32 = () => import("./_app.meetings.public-meetings-BAZ2SWBb.js");
var Route$32 = createFileRoute("/_app/meetings/public-meetings")({
	head: () => ({ meta: [{ title: "Public Meetings — Community Engagement" }] }),
	component: lazyRouteComponent($$splitComponentImporter$32, "component")
});
//#endregion
//#region src/routes/_app.meetings.janata-darbar.tsx
var $$splitComponentImporter$31 = () => import("./_app.meetings.janata-darbar-BX4E6Li_.js");
var Route$31 = createFileRoute("/_app/meetings/janata-darbar")({
	head: () => ({ meta: [{ title: "Janata Darbar — Public Grievance Sessions" }] }),
	component: lazyRouteComponent($$splitComponentImporter$31, "component")
});
//#endregion
//#region src/routes/_app.meetings.engagement-analytics.tsx
var $$splitComponentImporter$30 = () => import("./_app.meetings.engagement-analytics-BN7uyX9W.js");
var Route$30 = createFileRoute("/_app/meetings/engagement-analytics")({
	head: () => ({ meta: [{ title: "Engagement Analytics — Meeting Insights" }] }),
	component: lazyRouteComponent($$splitComponentImporter$30, "component")
});
//#endregion
//#region src/routes/_app.meetings.dashboard.tsx
var $$splitComponentImporter$29 = () => import("./_app.meetings.dashboard-BV6XA-XW.js");
var Route$29 = createFileRoute("/_app/meetings/dashboard")({
	head: () => ({ meta: [{ title: "Meetings — Engagement Command Center" }] }),
	component: lazyRouteComponent($$splitComponentImporter$29, "component")
});
//#endregion
//#region src/routes/_app.meetings.calendar.tsx
var $$splitComponentImporter$28 = () => import("./_app.meetings.calendar-DU4jBASB.js");
var Route$28 = createFileRoute("/_app/meetings/calendar")({
	head: () => ({ meta: [{ title: "Meeting Calendar — Schedule View" }] }),
	component: lazyRouteComponent($$splitComponentImporter$28, "component")
});
//#endregion
//#region src/routes/_app.meetings.appointments.tsx
var $$splitComponentImporter$27 = () => import("./_app.meetings.appointments-DFgB4MQ_.js");
var Route$27 = createFileRoute("/_app/meetings/appointments")({
	head: () => ({ meta: [{ title: "Appointments — Citizen Meetings" }] }),
	component: lazyRouteComponent($$splitComponentImporter$27, "component")
});
//#endregion
//#region src/routes/_app.meetings.appointment-detail.tsx
var $$splitComponentImporter$26 = () => import("./_app.meetings.appointment-detail-CCwT4JEz.js");
var Route$26 = createFileRoute("/_app/meetings/appointment-detail")({
	validateSearch: (search) => ({ id: String(search.id ?? "") }),
	head: () => ({ meta: [{ title: "Appointment Detail — Case 360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$26, "component")
});
//#endregion
//#region src/routes/_app.grievances.resolution-center.tsx
var $$splitComponentImporter$25 = () => import("./_app.grievances.resolution-center-Bv2uSqjQ.js");
var Route$25 = createFileRoute("/_app/grievances/resolution-center")({
	head: () => ({ meta: [{ title: "Resolution Center — Grievances" }] }),
	component: lazyRouteComponent($$splitComponentImporter$25, "component")
});
//#endregion
//#region src/routes/_app.grievances.list.tsx
var $$splitComponentImporter$24 = () => import("./_app.grievances.list-DnM5rNmS.js");
var Route$24 = createFileRoute("/_app/grievances/list")({
	head: () => ({ meta: [{ title: "Complaint Directory — Grievances" }] }),
	component: lazyRouteComponent($$splitComponentImporter$24, "component")
});
//#endregion
//#region src/routes/_app.grievances.escalations.tsx
var $$splitComponentImporter$23 = () => import("./_app.grievances.escalations-DcZcr_W2.js");
var Route$23 = createFileRoute("/_app/grievances/escalations")({
	head: () => ({ meta: [{ title: "Escalations — Grievances" }] }),
	component: lazyRouteComponent($$splitComponentImporter$23, "component")
});
//#endregion
//#region src/routes/_app.grievances.detail.tsx
var $$splitComponentImporter$22 = () => import("./_app.grievances.detail-Dh_bjGKr.js");
var Route$22 = createFileRoute("/_app/grievances/detail")({
	validateSearch: (s) => ({ id: String(s.id ?? "") }),
	head: () => ({ meta: [{ title: "Case 360 — Grievances" }] }),
	component: lazyRouteComponent($$splitComponentImporter$22, "component")
});
//#endregion
//#region src/routes/_app.grievances.departments.tsx
var $$splitComponentImporter$21 = () => import("./_app.grievances.departments-Dz3vATwo.js");
var Route$21 = createFileRoute("/_app/grievances/departments")({
	head: () => ({ meta: [{ title: "Departments — Grievances" }] }),
	component: lazyRouteComponent($$splitComponentImporter$21, "component")
});
//#endregion
//#region src/routes/_app.grievances.dashboard.tsx
var $$splitComponentImporter$20 = () => import("./_app.grievances.dashboard-CfcLPHUY.js");
var Route$20 = createFileRoute("/_app/grievances/dashboard")({
	head: () => ({ meta: [{ title: "Grievance Command Center" }] }),
	component: lazyRouteComponent($$splitComponentImporter$20, "component")
});
//#endregion
//#region src/routes/_app.grievances.categories.tsx
var $$splitComponentImporter$19 = () => import("./_app.grievances.categories-uBsGI4l-.js");
var Route$19 = createFileRoute("/_app/grievances/categories")({
	head: () => ({ meta: [{ title: "Categories — Grievances" }] }),
	component: lazyRouteComponent($$splitComponentImporter$19, "component")
});
//#endregion
//#region src/routes/_app.grievances.analytics.tsx
var $$splitComponentImporter$18 = () => import("./_app.grievances.analytics-CZQTw4fF.js");
var Route$18 = createFileRoute("/_app/grievances/analytics")({
	head: () => ({ meta: [{ title: "Analytics — Grievances" }] }),
	component: lazyRouteComponent($$splitComponentImporter$18, "component")
});
//#endregion
//#region src/routes/_app.documents.project-documents.tsx
var $$splitComponentImporter$17 = () => import("./_app.documents.project-documents-CAMbjJ-C.js");
var Route$17 = createFileRoute("/_app/documents/project-documents")({
	head: () => ({ meta: [{ title: "Project Documents — MP Constituency Platform" }, {
		name: "description",
		content: "Sanction letters, utilisation certificates, photos and progress reports."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$17, "component")
});
//#endregion
//#region src/routes/_app.documents.citizen-documents.tsx
var $$splitComponentImporter$16 = () => import("./_app.documents.citizen-documents-BwyD9sXs.js");
var Route$16 = createFileRoute("/_app/documents/citizen-documents")({
	head: () => ({ meta: [{ title: "Citizen Documents — MP Constituency Platform" }, {
		name: "description",
		content: "Aadhaar, ration cards, certificates and verifications attached to citizen profiles."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$16, "component")
});
//#endregion
//#region src/routes/_app.communication.whatsapp.tsx
var $$splitComponentImporter$15 = () => import("./_app.communication.whatsapp-D4o6TNGx.js");
var Route$15 = createFileRoute("/_app/communication/whatsapp")({
	head: () => ({ meta: [{ title: "WhatsApp — MP Constituency Platform" }, {
		name: "description",
		content: "WhatsApp templates, broadcasts and 1:1 conversations."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$15, "component")
});
//#endregion
//#region src/routes/_app.communication.sms.tsx
var $$splitComponentImporter$14 = () => import("./_app.communication.sms-CzsWBxvj.js");
var Route$14 = createFileRoute("/_app/communication/sms")({
	head: () => ({ meta: [{ title: "SMS — MP Constituency Platform" }, {
		name: "description",
		content: "Bulk SMS campaigns with DLT compliance and delivery tracking."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$14, "component")
});
//#endregion
//#region src/routes/_app.communication.email.tsx
var $$splitComponentImporter$13 = () => import("./_app.communication.email-Bb-Hktvx.js");
var Route$13 = createFileRoute("/_app/communication/email")({
	head: () => ({ meta: [{ title: "Email — MP Constituency Platform" }, {
		name: "description",
		content: "Email newsletters, updates and constituent communication."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$13, "component")
});
//#endregion
//#region src/routes/_app.citizens.surveys.tsx
var $$splitComponentImporter$12 = () => import("./_app.citizens.surveys-DJeyVaXN.js");
var Route$12 = createFileRoute("/_app/citizens/surveys")({
	head: () => ({ meta: [{ title: "Citizen Surveys — MP Constituency Platform" }] }),
	component: lazyRouteComponent($$splitComponentImporter$12, "component")
});
//#endregion
//#region src/routes/_app.citizens.schemes.tsx
var $$splitComponentImporter$11 = () => import("./_app.citizens.schemes-DQ040CNL.js");
var Route$11 = createFileRoute("/_app/citizens/schemes")({
	head: () => ({ meta: [{ title: "Citizen Schemes — MP Constituency Platform" }] }),
	component: lazyRouteComponent($$splitComponentImporter$11, "component")
});
//#endregion
//#region src/routes/_app.citizens.list.tsx
var $$splitComponentImporter$10 = () => import("./_app.citizens.list-R-PMNgXg.js");
var Route$10 = createFileRoute("/_app/citizens/list")({
	head: () => ({ meta: [{ title: "Citizen Directory — MP Constituency Platform" }] }),
	component: lazyRouteComponent($$splitComponentImporter$10, "component")
});
//#endregion
//#region src/routes/_app.citizens.interactions.tsx
var $$splitComponentImporter$9 = () => import("./_app.citizens.interactions-8L85TnJl.js");
var Route$9 = createFileRoute("/_app/citizens/interactions")({
	head: () => ({ meta: [{ title: "Interaction History — MP Constituency Platform" }, {
		name: "description",
		content: "Every citizen touchpoint across voice, SMS, WhatsApp, meetings and visits."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
//#endregion
//#region src/routes/_app.citizens.grievances.tsx
var $$splitComponentImporter$8 = () => import("./_app.citizens.grievances-B5rACUI9.js");
var Route$8 = createFileRoute("/_app/citizens/grievances")({
	head: () => ({ meta: [{ title: "Citizen Grievances — MP Constituency Platform" }] }),
	component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
//#endregion
//#region src/routes/_app.citizens.families.tsx
var $$splitComponentImporter$7 = () => import("./_app.citizens.families-CfsZyJBr.js");
var Route$7 = createFileRoute("/_app/citizens/families")({
	head: () => ({ meta: [{ title: "Family Management — MP Constituency Platform" }, {
		name: "description",
		content: "Family registry, household summaries and relationship graph."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
//#endregion
//#region src/routes/_app.citizens.documents.tsx
var $$splitComponentImporter$6 = () => import("./_app.citizens.documents-B76gdB37.js");
var Route$6 = createFileRoute("/_app/citizens/documents")({
	head: () => ({ meta: [{ title: "Document Center — MP Constituency Platform" }, {
		name: "description",
		content: "Citizen document repository with previews, OCR and verification."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
//#endregion
//#region src/routes/_app.citizens.create-profile.tsx
var $$splitComponentImporter$5 = () => import("./_app.citizens.create-profile-hYXDWp7d.js");
var Route$5 = createFileRoute("/_app/citizens/create-profile")({
	head: () => ({ meta: [{ title: "Enroll Citizen — MP Platform" }] }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
z.object({
	first_name: z.string().min(1, "First name required"),
	last_name: z.string().min(1, "Last name required"),
	middle_name: z.string().optional(),
	date_of_birth: z.string().min(1, "Date of birth required"),
	gender: z.enum([
		"Male",
		"Female",
		"Other"
	]),
	mobile_number: z.string().min(10, "Valid mobile required"),
	aadhaar_number: z.string().optional(),
	voter_id: z.string().optional(),
	occupation: z.string().optional(),
	education: z.string().optional(),
	father_name: z.string().optional(),
	blood_group: z.string().optional(),
	house_number: z.string().optional(),
	street: z.string().optional(),
	pincode: z.string().optional(),
	district: z.string().optional(),
	state: z.string().optional()
});
//#endregion
//#region src/routes/_app.citizens.booth-mapping.tsx
var $$splitComponentImporter$4 = () => import("./_app.citizens.booth-mapping-D2ANbFiN.js");
var Route$4 = createFileRoute("/_app/citizens/booth-mapping")({
	head: () => ({ meta: [{ title: "Booth Mapping — MP Constituency Platform" }, {
		name: "description",
		content: "Map every citizen to their polling booth, ward and assembly segment."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
//#endregion
//#region src/routes/_app.analytics.village.tsx
var $$splitComponentImporter$3 = () => import("./_app.analytics.village-C_5IBlXu.js");
var Route$3 = createFileRoute("/_app/analytics/village")({
	head: () => ({ meta: [{ title: "Village Analytics — MP Constituency Platform" }, {
		name: "description",
		content: "Village-level deep dives with booth-grain insight."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
//#endregion
//#region src/routes/_app.analytics.mandal.tsx
var $$splitComponentImporter$2 = () => import("./_app.analytics.mandal-BQ8WlbMP.js");
var Route$2 = createFileRoute("/_app/analytics/mandal")({
	head: () => ({ meta: [{ title: "Mandal Analytics — MP Constituency Platform" }, {
		name: "description",
		content: "Mandal-wise rollups for ground operations and outreach."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
//#endregion
//#region src/routes/_app.analytics.constituency.tsx
var $$splitComponentImporter$1 = () => import("./_app.analytics.constituency-BAdKlGeg.js");
var Route$1 = createFileRoute("/_app/analytics/constituency")({
	head: () => ({ meta: [{ title: "Constituency Analytics — MP Constituency Platform" }, {
		name: "description",
		content: "Top-level KPIs across your entire constituency."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
//#endregion
//#region src/routes/_app.analytics.assembly.tsx
var $$splitComponentImporter = () => import("./_app.analytics.assembly-BSirj1-l.js");
var Route = createFileRoute("/_app/analytics/assembly")({
	head: () => ({ meta: [{ title: "Assembly Analytics — MP Constituency Platform" }, {
		name: "description",
		content: "Assembly-segment level performance and trends."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
//#region src/routeTree.gen.ts
var RegisterRoute = Route$96.update({
	id: "/register",
	path: "/register",
	getParentRoute: () => Route$97
});
var LoginRoute = Route$95.update({
	id: "/login",
	path: "/login",
	getParentRoute: () => Route$97
});
var AppRoute = Route$94.update({
	id: "/_app",
	getParentRoute: () => Route$97
});
var IndexRoute = Route$93.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$97
});
var AppVolunteersRoute = Route$92.update({
	id: "/volunteers",
	path: "/volunteers",
	getParentRoute: () => AppRoute
});
var AppVolunteerRoute = Route$91.update({
	id: "/volunteer",
	path: "/volunteer",
	getParentRoute: () => AppRoute
});
var AppSurveysRoute = Route$90.update({
	id: "/surveys",
	path: "/surveys",
	getParentRoute: () => AppRoute
});
var AppStaffRoute = Route$89.update({
	id: "/staff",
	path: "/staff",
	getParentRoute: () => AppRoute
});
var AppSettingsRoute = Route$88.update({
	id: "/settings",
	path: "/settings",
	getParentRoute: () => AppRoute
});
var AppSchemesRoute = Route$87.update({
	id: "/schemes",
	path: "/schemes",
	getParentRoute: () => AppRoute
});
var AppProjectsRoute = Route$86.update({
	id: "/projects",
	path: "/projects",
	getParentRoute: () => AppRoute
});
var AppOfficerRoute = Route$85.update({
	id: "/officer",
	path: "/officer",
	getParentRoute: () => AppRoute
});
var AppMpRoute = Route$84.update({
	id: "/mp",
	path: "/mp",
	getParentRoute: () => AppRoute
});
var AppMlaRoute = Route$83.update({
	id: "/mla",
	path: "/mla",
	getParentRoute: () => AppRoute
});
var AppMeetingsRoute = Route$82.update({
	id: "/meetings",
	path: "/meetings",
	getParentRoute: () => AppRoute
});
var AppGrievancesRoute = Route$81.update({
	id: "/grievances",
	path: "/grievances",
	getParentRoute: () => AppRoute
});
var AppDocumentsRoute = Route$80.update({
	id: "/documents",
	path: "/documents",
	getParentRoute: () => AppRoute
});
var AppDashboardRoute = Route$79.update({
	id: "/dashboard",
	path: "/dashboard",
	getParentRoute: () => AppRoute
});
var AppCoordinatorRoute = Route$78.update({
	id: "/coordinator",
	path: "/coordinator",
	getParentRoute: () => AppRoute
});
var AppCommunicationRoute = Route$77.update({
	id: "/communication",
	path: "/communication",
	getParentRoute: () => AppRoute
});
var AppCitizensRoute = Route$76.update({
	id: "/citizens",
	path: "/citizens",
	getParentRoute: () => AppRoute
});
var AppCitizenRoute = Route$75.update({
	id: "/citizen",
	path: "/citizen",
	getParentRoute: () => AppRoute
});
var AppAnalyticsRoute = Route$74.update({
	id: "/analytics",
	path: "/analytics",
	getParentRoute: () => AppRoute
});
var AppAdminRoute = Route$73.update({
	id: "/admin",
	path: "/admin",
	getParentRoute: () => AppRoute
});
var AppVolunteersIndexRoute = Route$72.update({
	id: "/",
	path: "/",
	getParentRoute: () => AppVolunteersRoute
});
var AppSurveysIndexRoute = Route$71.update({
	id: "/",
	path: "/",
	getParentRoute: () => AppSurveysRoute
});
var AppSchemesIndexRoute = Route$70.update({
	id: "/",
	path: "/",
	getParentRoute: () => AppSchemesRoute
});
var AppProjectsIndexRoute = Route$69.update({
	id: "/",
	path: "/",
	getParentRoute: () => AppProjectsRoute
});
var AppMeetingsIndexRoute = Route$68.update({
	id: "/",
	path: "/",
	getParentRoute: () => AppMeetingsRoute
});
var AppGrievancesIndexRoute = Route$67.update({
	id: "/",
	path: "/",
	getParentRoute: () => AppGrievancesRoute
});
var AppDocumentsIndexRoute = Route$66.update({
	id: "/",
	path: "/",
	getParentRoute: () => AppDocumentsRoute
});
var AppCommunicationIndexRoute = Route$65.update({
	id: "/",
	path: "/",
	getParentRoute: () => AppCommunicationRoute
});
var AppCitizensIndexRoute = Route$64.update({
	id: "/",
	path: "/",
	getParentRoute: () => AppCitizensRoute
});
var AppAnalyticsIndexRoute = Route$63.update({
	id: "/",
	path: "/",
	getParentRoute: () => AppAnalyticsRoute
});
var AppVolunteersTrainingRoute = Route$62.update({
	id: "/training",
	path: "/training",
	getParentRoute: () => AppVolunteersRoute
});
var AppVolunteersProfileRoute = Route$61.update({
	id: "/profile",
	path: "/profile",
	getParentRoute: () => AppVolunteersRoute
});
var AppVolunteersPerformanceRoute = Route$60.update({
	id: "/performance",
	path: "/performance",
	getParentRoute: () => AppVolunteersRoute
});
var AppVolunteersListRoute = Route$59.update({
	id: "/list",
	path: "/list",
	getParentRoute: () => AppVolunteersRoute
});
var AppVolunteersGeographicCoverageRoute = Route$58.update({
	id: "/geographic-coverage",
	path: "/geographic-coverage",
	getParentRoute: () => AppVolunteersRoute
});
var AppVolunteersEnrolledCitizensRoute = Route$57.update({
	id: "/enrolled-citizens",
	path: "/enrolled-citizens",
	getParentRoute: () => AppVolunteersRoute
});
var AppVolunteersAttendanceRoute = Route$56.update({
	id: "/attendance",
	path: "/attendance",
	getParentRoute: () => AppVolunteersRoute
});
var AppVolunteersActivityRoute = Route$55.update({
	id: "/activity",
	path: "/activity",
	getParentRoute: () => AppVolunteersRoute
});
var AppSurveysResponsesRoute = Route$54.update({
	id: "/responses",
	path: "/responses",
	getParentRoute: () => AppSurveysRoute
});
var AppSurveysIntelligenceRoute = Route$53.update({
	id: "/intelligence",
	path: "/intelligence",
	getParentRoute: () => AppSurveysRoute
});
var AppSurveysFormBuilderRoute = Route$52.update({
	id: "/form-builder",
	path: "/form-builder",
	getParentRoute: () => AppSurveysRoute
});
var AppSurveysDetailRoute = Route$51.update({
	id: "/detail",
	path: "/detail",
	getParentRoute: () => AppSurveysRoute
});
var AppSurveysDashboardRoute = Route$50.update({
	id: "/dashboard",
	path: "/dashboard",
	getParentRoute: () => AppSurveysRoute
});
var AppSurveysCensusRoute = Route$49.update({
	id: "/census",
	path: "/census",
	getParentRoute: () => AppSurveysRoute
});
var AppSurveysAnalyticsRoute = Route$48.update({
	id: "/analytics",
	path: "/analytics",
	getParentRoute: () => AppSurveysRoute
});
var AppSurveysActiveRoute = Route$47.update({
	id: "/active",
	path: "/active",
	getParentRoute: () => AppSurveysRoute
});
var AppSchemesSchemeCatalogRoute = Route$46.update({
	id: "/scheme-catalog",
	path: "/scheme-catalog",
	getParentRoute: () => AppSchemesRoute
});
var AppSchemesPerformanceRoute = Route$45.update({
	id: "/performance",
	path: "/performance",
	getParentRoute: () => AppSchemesRoute
});
var AppSchemesEligibilityRoute = Route$44.update({
	id: "/eligibility",
	path: "/eligibility",
	getParentRoute: () => AppSchemesRoute
});
var AppSchemesDashboardRoute = Route$43.update({
	id: "/dashboard",
	path: "/dashboard",
	getParentRoute: () => AppSchemesRoute
});
var AppSchemesCoverageAnalysisRoute = Route$42.update({
	id: "/coverage-analysis",
	path: "/coverage-analysis",
	getParentRoute: () => AppSchemesRoute
});
var AppSchemesBeneficiariesRoute = Route$41.update({
	id: "/beneficiaries",
	path: "/beneficiaries",
	getParentRoute: () => AppSchemesRoute
});
var AppSchemesApplicationsRoute = Route$40.update({
	id: "/applications",
	path: "/applications",
	getParentRoute: () => AppSchemesRoute
});
var AppSchemesApplicationDetailRoute = Route$39.update({
	id: "/application-detail",
	path: "/application-detail",
	getParentRoute: () => AppSchemesRoute
});
var AppProjectsProjectDetailRoute = Route$38.update({
	id: "/project-detail",
	path: "/project-detail",
	getParentRoute: () => AppProjectsRoute
});
var AppProjectsProgressTrackerRoute = Route$98.update({
	id: "/progress-tracker",
	path: "/progress-tracker",
	getParentRoute: () => AppProjectsRoute
});
var AppProjectsMpladsRoute = Route$37.update({
	id: "/mplads",
	path: "/mplads",
	getParentRoute: () => AppProjectsRoute
});
var AppProjectsDevelopmentRoute = Route$36.update({
	id: "/development",
	path: "/development",
	getParentRoute: () => AppProjectsRoute
});
var AppProjectsDashboardRoute = Route$35.update({
	id: "/dashboard",
	path: "/dashboard",
	getParentRoute: () => AppProjectsRoute
});
var AppProjectsContractorsRoute = Route$34.update({
	id: "/contractors",
	path: "/contractors",
	getParentRoute: () => AppProjectsRoute
});
var AppProjectsBudgetMonitoringRoute = Route$99.update({
	id: "/budget-monitoring",
	path: "/budget-monitoring",
	getParentRoute: () => AppProjectsRoute
});
var AppProjectsAnalyticsRoute = Route$100.update({
	id: "/analytics",
	path: "/analytics",
	getParentRoute: () => AppProjectsRoute
});
var AppMeetingsToursRoute = Route$33.update({
	id: "/tours",
	path: "/tours",
	getParentRoute: () => AppMeetingsRoute
});
var AppMeetingsPublicMeetingsRoute = Route$32.update({
	id: "/public-meetings",
	path: "/public-meetings",
	getParentRoute: () => AppMeetingsRoute
});
var AppMeetingsJanataDarbarRoute = Route$31.update({
	id: "/janata-darbar",
	path: "/janata-darbar",
	getParentRoute: () => AppMeetingsRoute
});
var AppMeetingsEngagementAnalyticsRoute = Route$30.update({
	id: "/engagement-analytics",
	path: "/engagement-analytics",
	getParentRoute: () => AppMeetingsRoute
});
var AppMeetingsDashboardRoute = Route$29.update({
	id: "/dashboard",
	path: "/dashboard",
	getParentRoute: () => AppMeetingsRoute
});
var AppMeetingsCalendarRoute = Route$28.update({
	id: "/calendar",
	path: "/calendar",
	getParentRoute: () => AppMeetingsRoute
});
var AppMeetingsAppointmentsRoute = Route$27.update({
	id: "/appointments",
	path: "/appointments",
	getParentRoute: () => AppMeetingsRoute
});
var AppMeetingsAppointmentDetailRoute = Route$26.update({
	id: "/appointment-detail",
	path: "/appointment-detail",
	getParentRoute: () => AppMeetingsRoute
});
var AppGrievancesResolutionCenterRoute = Route$25.update({
	id: "/resolution-center",
	path: "/resolution-center",
	getParentRoute: () => AppGrievancesRoute
});
var AppGrievancesListRoute = Route$24.update({
	id: "/list",
	path: "/list",
	getParentRoute: () => AppGrievancesRoute
});
var AppGrievancesEscalationsRoute = Route$23.update({
	id: "/escalations",
	path: "/escalations",
	getParentRoute: () => AppGrievancesRoute
});
var AppGrievancesDetailRoute = Route$22.update({
	id: "/detail",
	path: "/detail",
	getParentRoute: () => AppGrievancesRoute
});
var AppGrievancesDepartmentsRoute = Route$21.update({
	id: "/departments",
	path: "/departments",
	getParentRoute: () => AppGrievancesRoute
});
var AppGrievancesDashboardRoute = Route$20.update({
	id: "/dashboard",
	path: "/dashboard",
	getParentRoute: () => AppGrievancesRoute
});
var AppGrievancesCategoriesRoute = Route$19.update({
	id: "/categories",
	path: "/categories",
	getParentRoute: () => AppGrievancesRoute
});
var AppGrievancesAnalyticsRoute = Route$18.update({
	id: "/analytics",
	path: "/analytics",
	getParentRoute: () => AppGrievancesRoute
});
var AppDocumentsProjectDocumentsRoute = Route$17.update({
	id: "/project-documents",
	path: "/project-documents",
	getParentRoute: () => AppDocumentsRoute
});
var AppDocumentsCitizenDocumentsRoute = Route$16.update({
	id: "/citizen-documents",
	path: "/citizen-documents",
	getParentRoute: () => AppDocumentsRoute
});
var AppCommunicationWhatsappRoute = Route$15.update({
	id: "/whatsapp",
	path: "/whatsapp",
	getParentRoute: () => AppCommunicationRoute
});
var AppCommunicationSmsRoute = Route$14.update({
	id: "/sms",
	path: "/sms",
	getParentRoute: () => AppCommunicationRoute
});
var AppCommunicationEmailRoute = Route$13.update({
	id: "/email",
	path: "/email",
	getParentRoute: () => AppCommunicationRoute
});
var AppCitizensSurveysRoute = Route$12.update({
	id: "/surveys",
	path: "/surveys",
	getParentRoute: () => AppCitizensRoute
});
var AppCitizensSchemesRoute = Route$11.update({
	id: "/schemes",
	path: "/schemes",
	getParentRoute: () => AppCitizensRoute
});
var AppCitizensProfileRoute = Route$101.update({
	id: "/profile",
	path: "/profile",
	getParentRoute: () => AppCitizensRoute
});
var AppCitizensListRoute = Route$10.update({
	id: "/list",
	path: "/list",
	getParentRoute: () => AppCitizensRoute
});
var AppCitizensInteractionsRoute = Route$9.update({
	id: "/interactions",
	path: "/interactions",
	getParentRoute: () => AppCitizensRoute
});
var AppCitizensGrievancesRoute = Route$8.update({
	id: "/grievances",
	path: "/grievances",
	getParentRoute: () => AppCitizensRoute
});
var AppCitizensFamiliesRoute = Route$7.update({
	id: "/families",
	path: "/families",
	getParentRoute: () => AppCitizensRoute
});
var AppCitizensDocumentsRoute = Route$6.update({
	id: "/documents",
	path: "/documents",
	getParentRoute: () => AppCitizensRoute
});
var AppCitizensCreateProfileRoute = Route$5.update({
	id: "/create-profile",
	path: "/create-profile",
	getParentRoute: () => AppCitizensRoute
});
var AppCitizensBoothMappingRoute = Route$4.update({
	id: "/booth-mapping",
	path: "/booth-mapping",
	getParentRoute: () => AppCitizensRoute
});
var AppAnalyticsVillageRoute = Route$3.update({
	id: "/village",
	path: "/village",
	getParentRoute: () => AppAnalyticsRoute
});
var AppAnalyticsMandalRoute = Route$2.update({
	id: "/mandal",
	path: "/mandal",
	getParentRoute: () => AppAnalyticsRoute
});
var AppAnalyticsConstituencyRoute = Route$1.update({
	id: "/constituency",
	path: "/constituency",
	getParentRoute: () => AppAnalyticsRoute
});
var AppAnalyticsRouteChildren = {
	AppAnalyticsAssemblyRoute: Route.update({
		id: "/assembly",
		path: "/assembly",
		getParentRoute: () => AppAnalyticsRoute
	}),
	AppAnalyticsConstituencyRoute,
	AppAnalyticsMandalRoute,
	AppAnalyticsVillageRoute,
	AppAnalyticsIndexRoute
};
var AppAnalyticsRouteWithChildren = AppAnalyticsRoute._addFileChildren(AppAnalyticsRouteChildren);
var AppCitizensRouteChildren = {
	AppCitizensBoothMappingRoute,
	AppCitizensCreateProfileRoute,
	AppCitizensDocumentsRoute,
	AppCitizensFamiliesRoute,
	AppCitizensGrievancesRoute,
	AppCitizensInteractionsRoute,
	AppCitizensListRoute,
	AppCitizensProfileRoute,
	AppCitizensSchemesRoute,
	AppCitizensSurveysRoute,
	AppCitizensIndexRoute
};
var AppCitizensRouteWithChildren = AppCitizensRoute._addFileChildren(AppCitizensRouteChildren);
var AppCommunicationRouteChildren = {
	AppCommunicationEmailRoute,
	AppCommunicationSmsRoute,
	AppCommunicationWhatsappRoute,
	AppCommunicationIndexRoute
};
var AppCommunicationRouteWithChildren = AppCommunicationRoute._addFileChildren(AppCommunicationRouteChildren);
var AppDocumentsRouteChildren = {
	AppDocumentsCitizenDocumentsRoute,
	AppDocumentsProjectDocumentsRoute,
	AppDocumentsIndexRoute
};
var AppDocumentsRouteWithChildren = AppDocumentsRoute._addFileChildren(AppDocumentsRouteChildren);
var AppGrievancesRouteChildren = {
	AppGrievancesAnalyticsRoute,
	AppGrievancesCategoriesRoute,
	AppGrievancesDashboardRoute,
	AppGrievancesDepartmentsRoute,
	AppGrievancesDetailRoute,
	AppGrievancesEscalationsRoute,
	AppGrievancesListRoute,
	AppGrievancesResolutionCenterRoute,
	AppGrievancesIndexRoute
};
var AppGrievancesRouteWithChildren = AppGrievancesRoute._addFileChildren(AppGrievancesRouteChildren);
var AppMeetingsRouteChildren = {
	AppMeetingsAppointmentDetailRoute,
	AppMeetingsAppointmentsRoute,
	AppMeetingsCalendarRoute,
	AppMeetingsDashboardRoute,
	AppMeetingsEngagementAnalyticsRoute,
	AppMeetingsJanataDarbarRoute,
	AppMeetingsPublicMeetingsRoute,
	AppMeetingsToursRoute,
	AppMeetingsIndexRoute
};
var AppMeetingsRouteWithChildren = AppMeetingsRoute._addFileChildren(AppMeetingsRouteChildren);
var AppProjectsRouteChildren = {
	AppProjectsAnalyticsRoute,
	AppProjectsBudgetMonitoringRoute,
	AppProjectsContractorsRoute,
	AppProjectsDashboardRoute,
	AppProjectsDevelopmentRoute,
	AppProjectsMpladsRoute,
	AppProjectsProgressTrackerRoute,
	AppProjectsProjectDetailRoute,
	AppProjectsIndexRoute
};
var AppProjectsRouteWithChildren = AppProjectsRoute._addFileChildren(AppProjectsRouteChildren);
var AppSchemesRouteChildren = {
	AppSchemesApplicationDetailRoute,
	AppSchemesApplicationsRoute,
	AppSchemesBeneficiariesRoute,
	AppSchemesCoverageAnalysisRoute,
	AppSchemesDashboardRoute,
	AppSchemesEligibilityRoute,
	AppSchemesPerformanceRoute,
	AppSchemesSchemeCatalogRoute,
	AppSchemesIndexRoute
};
var AppSchemesRouteWithChildren = AppSchemesRoute._addFileChildren(AppSchemesRouteChildren);
var AppSurveysRouteChildren = {
	AppSurveysActiveRoute,
	AppSurveysAnalyticsRoute,
	AppSurveysCensusRoute,
	AppSurveysDashboardRoute,
	AppSurveysDetailRoute,
	AppSurveysFormBuilderRoute,
	AppSurveysIntelligenceRoute,
	AppSurveysResponsesRoute,
	AppSurveysIndexRoute
};
var AppSurveysRouteWithChildren = AppSurveysRoute._addFileChildren(AppSurveysRouteChildren);
var AppVolunteersRouteChildren = {
	AppVolunteersActivityRoute,
	AppVolunteersAttendanceRoute,
	AppVolunteersEnrolledCitizensRoute,
	AppVolunteersGeographicCoverageRoute,
	AppVolunteersListRoute,
	AppVolunteersPerformanceRoute,
	AppVolunteersProfileRoute,
	AppVolunteersTrainingRoute,
	AppVolunteersIndexRoute
};
var AppRouteChildren = {
	AppAdminRoute,
	AppAnalyticsRoute: AppAnalyticsRouteWithChildren,
	AppCitizenRoute,
	AppCitizensRoute: AppCitizensRouteWithChildren,
	AppCommunicationRoute: AppCommunicationRouteWithChildren,
	AppCoordinatorRoute,
	AppDashboardRoute,
	AppDocumentsRoute: AppDocumentsRouteWithChildren,
	AppGrievancesRoute: AppGrievancesRouteWithChildren,
	AppMeetingsRoute: AppMeetingsRouteWithChildren,
	AppMlaRoute,
	AppMpRoute,
	AppOfficerRoute,
	AppProjectsRoute: AppProjectsRouteWithChildren,
	AppSchemesRoute: AppSchemesRouteWithChildren,
	AppSettingsRoute,
	AppStaffRoute,
	AppSurveysRoute: AppSurveysRouteWithChildren,
	AppVolunteerRoute,
	AppVolunteersRoute: AppVolunteersRoute._addFileChildren(AppVolunteersRouteChildren)
};
var rootRouteChildren = {
	IndexRoute,
	AppRoute: AppRoute._addFileChildren(AppRouteChildren),
	LoginRoute,
	RegisterRoute
};
var routeTree = Route$97._addFileChildren(rootRouteChildren)._addFileTypes();
//#endregion
//#region src/router.tsx
var getRouter = () => {
	return createRouter({
		routeTree,
		context: { queryClient: new QueryClient() },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };

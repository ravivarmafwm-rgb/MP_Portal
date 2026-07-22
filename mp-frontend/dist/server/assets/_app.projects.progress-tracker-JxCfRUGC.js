import { t as Route } from "./_app.projects.progress-tracker-oOl8OKgv.js";
import { t as cn } from "./utils-C_uf36nf.js";
import { t as Button } from "./button-Bq5vK6RO.js";
import { t as Card } from "./card-CzXpCsbD.js";
import { t as Badge } from "./badge-D1Dupn2y.js";
import { t as PageHeader } from "./PageHeader-B7gZRr0G.js";
import { Link } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { Activity, AlertTriangle, Clock, Download, Target } from "lucide-react";
import { motion } from "framer-motion";
//#region src/routes/_app.projects.progress-tracker.tsx?tsr-split=component
var stageGroups = [
	"Planned",
	"Approved",
	"Tender Released",
	"Work Started",
	"In Progress",
	"Completed",
	"Delayed"
];
function ProgressTracker() {
	const { projects, stats } = Route.useLoaderData();
	const inflight = (projects.data || []).filter((p) => [
		"In Progress",
		"Work Started",
		"Delayed"
	].includes(p.status)).slice(0, 14);
	const delayed = (projects.data || []).filter((p) => p.status === "Delayed").slice(0, 6);
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(PageHeader, {
		title: "Project Progress Tracker",
		description: "Monitor execution velocity, milestones and slipping projects.",
		actions: /* @__PURE__ */ jsxs(Button, {
			variant: "outline",
			size: "sm",
			className: "gap-1.5",
			children: [/* @__PURE__ */ jsx(Download, { className: "h-4 w-4" }), " Tracker Report"]
		})
	}), /* @__PURE__ */ jsxs("div", {
		className: "space-y-6 p-4 md:p-8",
		children: [
			/* @__PURE__ */ jsx("div", {
				className: "grid grid-cols-2 gap-3 md:grid-cols-4",
				children: [
					{
						l: "In Execution",
						v: stats.in_progress || 0,
						icon: Activity,
						tone: "bg-primary/10 text-primary"
					},
					{
						l: "Delayed Projects",
						v: stats.delayed || 0,
						icon: AlertTriangle,
						tone: "bg-destructive/10 text-destructive"
					},
					{
						l: "Upcoming Deadlines",
						v: 12,
						icon: Clock,
						tone: "bg-warning/15 text-warning"
					},
					{
						l: "Milestones This Week",
						v: 18,
						icon: Target,
						tone: "bg-info/10 text-info"
					}
				].map((k) => /* @__PURE__ */ jsxs(Card, {
					className: "p-5",
					children: [
						/* @__PURE__ */ jsx("div", {
							className: cn("grid h-10 w-10 place-items-center rounded-lg", k.tone),
							children: /* @__PURE__ */ jsx(k.icon, { className: "h-5 w-5" })
						}),
						/* @__PURE__ */ jsx("div", {
							className: "mt-3 text-[11px] uppercase tracking-wider text-muted-foreground",
							children: k.l
						}),
						/* @__PURE__ */ jsx("div", {
							className: "mt-1 font-display text-2xl font-bold tabular-nums",
							children: k.v
						})
					]
				}, k.l))
			}),
			/* @__PURE__ */ jsxs(Card, {
				className: "p-5",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ jsx("h3", {
						className: "font-display text-base font-bold",
						children: "Pipeline by Stage"
					}), /* @__PURE__ */ jsx(Badge, {
						variant: "secondary",
						className: "bg-primary/10 text-primary",
						children: "Live"
					})]
				}), /* @__PURE__ */ jsx("div", {
					className: "mt-4 grid gap-2 md:grid-cols-7",
					children: stageGroups.map((s, i) => {
						const count = (projects.data || []).filter((p) => p.status === s).length;
						return /* @__PURE__ */ jsxs(motion.div, {
							initial: {
								opacity: 0,
								y: 6
							},
							animate: {
								opacity: 1,
								y: 0
							},
							transition: { delay: i * .04 },
							className: "rounded-xl border border-border/70 bg-card p-3 text-center",
							children: [/* @__PURE__ */ jsx("div", {
								className: "text-[10px] uppercase tracking-wider text-muted-foreground",
								children: s
							}), /* @__PURE__ */ jsx("div", {
								className: "mt-1 font-display text-xl font-bold tabular-nums",
								children: count
							})]
						}, s);
					})
				})]
			}),
			/* @__PURE__ */ jsxs(Card, {
				className: "p-5",
				children: [/* @__PURE__ */ jsx("h3", {
					className: "font-display text-base font-bold",
					children: "Gantt View · Active Projects"
				}), /* @__PURE__ */ jsxs("div", {
					className: "mt-4 space-y-2",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "grid grid-cols-[200px_repeat(12,1fr)] gap-1 text-[10px] uppercase tracking-wider text-muted-foreground",
						children: [/* @__PURE__ */ jsx("div", {}), [
							"Jan",
							"Feb",
							"Mar",
							"Apr",
							"May",
							"Jun",
							"Jul",
							"Aug",
							"Sep",
							"Oct",
							"Nov",
							"Dec"
						].map((m) => /* @__PURE__ */ jsx("div", {
							className: "text-center",
							children: m
						}, m))]
					}), inflight.map((p, i) => {
						const startMonth = Math.floor(Math.random() * 8);
						const span = Math.max(2, Math.min(4, Math.floor(Math.random() * 4) + 2));
						const isLate = p.status === "Delayed";
						return /* @__PURE__ */ jsxs(motion.div, {
							initial: { opacity: 0 },
							animate: { opacity: 1 },
							transition: { delay: i * .03 },
							className: "grid grid-cols-[200px_repeat(12,1fr)] items-center gap-1",
							children: [/* @__PURE__ */ jsx(Link, {
								to: "/projects/project-detail",
								search: { id: p.id },
								className: "truncate text-xs font-medium hover:text-primary",
								children: p.name
							}), Array.from({ length: 12 }).map((_, idx) => {
								return /* @__PURE__ */ jsx("div", { className: cn("h-5 rounded", idx >= startMonth && idx < startMonth + span ? isLate ? "bg-gradient-to-r from-warning to-destructive" : "bg-gradient-to-r from-primary to-info" : "bg-muted/40") }, idx);
							})]
						}, p.id);
					})]
				})]
			}),
			/* @__PURE__ */ jsxs(Card, {
				className: "border-destructive/30 p-5",
				children: [/* @__PURE__ */ jsx("h3", {
					className: "font-display text-base font-bold",
					children: "Slipping Projects · Needs Action"
				}), /* @__PURE__ */ jsx("div", {
					className: "mt-4 grid gap-3 md:grid-cols-2",
					children: delayed.map((p) => /* @__PURE__ */ jsxs(Link, {
						to: "/projects/project-detail",
						search: { id: p.id },
						className: "flex items-center gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-3",
						children: [
							/* @__PURE__ */ jsx(AlertTriangle, { className: "h-4 w-4 text-destructive" }),
							/* @__PURE__ */ jsxs("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ jsx("div", {
									className: "truncate text-sm font-semibold",
									children: p.name
								}), /* @__PURE__ */ jsxs("div", {
									className: "text-[11px] text-muted-foreground",
									children: [
										p.id,
										" · ",
										p.contractor?.name || "N/A"
									]
								})]
							}),
							/* @__PURE__ */ jsxs(Badge, {
								variant: "secondary",
								className: "bg-destructive/10 text-destructive",
								children: [p.completion_percentage || 0, "%"]
							})
						]
					}, p.id))
				})]
			})
		]
	})] });
}
//#endregion
export { ProgressTracker as component };

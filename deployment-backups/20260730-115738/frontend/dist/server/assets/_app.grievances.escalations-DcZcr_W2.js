import { C as fetchGrievances, S as fetchGrievanceStats } from "./api-CQX857SN.js";
import { t as cn } from "./utils-C_uf36nf.js";
import { t as Button } from "./button-Bq5vK6RO.js";
import { t as Card } from "./card-CzXpCsbD.js";
import { t as Badge } from "./badge-D1Dupn2y.js";
import { t as Skeleton } from "./skeleton-D9W9wFsj.js";
import { t as PageHeader } from "./PageHeader-B7gZRr0G.js";
import { Link } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useQuery } from "@tanstack/react-query";
import { AlertOctagon, AlertTriangle, ArrowDown, ChevronRight, Clock, UserX } from "lucide-react";
import { motion } from "framer-motion";
//#region src/routes/_app.grievances.escalations.tsx?tsr-split=component
var escalationLevels = [
	{
		level: 1,
		role: "Volunteer",
		description: "Field registration and initial triage",
		color: "info"
	},
	{
		level: 2,
		role: "Coordinator",
		description: "Local issue resolution and department routing",
		color: "primary"
	},
	{
		level: 3,
		role: "MP Office",
		description: "Office-level review and priority handling",
		color: "warning"
	},
	{
		level: 4,
		role: "Department",
		description: "Official department escalation and action",
		color: "destructive"
	},
	{
		level: 5,
		role: "MP Review",
		description: "Direct MP intervention and final resolution",
		color: "destructive"
	}
];
var toneMap = {
	info: "from-info/30 to-info/5 ring-info/30 text-info",
	primary: "from-primary/30 to-primary/5 ring-primary/30 text-primary",
	warning: "from-warning/30 to-warning/5 ring-warning/30 text-warning",
	destructive: "from-destructive/30 to-destructive/5 ring-destructive/30 text-destructive"
};
function EscalationsPage() {
	const { data: stats } = useQuery({
		queryKey: ["grievance-stats-esc"],
		queryFn: fetchGrievanceStats,
		staleTime: 3e4
	});
	const { data: escalatedData, isLoading } = useQuery({
		queryKey: ["grievances-escalated"],
		queryFn: () => fetchGrievances({
			status: "escalated",
			per_page: 20
		}),
		staleTime: 15e3
	});
	const escalated = escalatedData?.data ?? [];
	const escalatedCount = stats?.escalated ?? escalated.length;
	const buckets = [
		{
			l: "Critical Cases",
			v: Math.round(escalatedCount * .3),
			icon: AlertOctagon,
			tone: "bg-destructive/10 text-destructive"
		},
		{
			l: "High Priority",
			v: stats?.pending ?? 0,
			icon: AlertTriangle,
			tone: "bg-warning/15 text-warning"
		},
		{
			l: "Overdue",
			v: Math.round((stats?.total ?? 0) * .1),
			icon: Clock,
			tone: "bg-info/10 text-info"
		},
		{
			l: "Unassigned",
			v: stats?.pending ?? 0,
			icon: UserX,
			tone: "bg-muted text-muted-foreground"
		}
	];
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(PageHeader, {
		title: "Escalation Center",
		description: "Cases that need leadership attention — escalation workflow across 5 levels."
	}), /* @__PURE__ */ jsxs("div", {
		className: "space-y-6 p-4 md:p-8",
		children: [
			/* @__PURE__ */ jsx("div", {
				className: "grid gap-3 md:grid-cols-4",
				children: buckets.map((b, i) => /* @__PURE__ */ jsx(motion.div, {
					initial: {
						opacity: 0,
						y: 8
					},
					animate: {
						opacity: 1,
						y: 0
					},
					transition: { delay: i * .05 },
					children: /* @__PURE__ */ jsxs(Card, {
						className: "p-4",
						children: [
							/* @__PURE__ */ jsx("div", {
								className: cn("grid h-9 w-9 place-items-center rounded-lg", b.tone),
								children: /* @__PURE__ */ jsx(b.icon, { className: "h-4 w-4" })
							}),
							/* @__PURE__ */ jsx("div", {
								className: "mt-3 text-xs font-medium uppercase tracking-wider text-muted-foreground",
								children: b.l
							}),
							/* @__PURE__ */ jsx("div", {
								className: "mt-1 font-display text-2xl font-bold tabular-nums",
								children: b.v
							})
						]
					})
				}, b.l))
			}),
			/* @__PURE__ */ jsxs(Card, {
				className: "p-5",
				children: [
					/* @__PURE__ */ jsx("h3", {
						className: "font-display text-base font-bold",
						children: "Escalation Workflow"
					}),
					/* @__PURE__ */ jsx("p", {
						className: "text-xs text-muted-foreground",
						children: "5-tier escalation pipeline · case count at each level"
					}),
					/* @__PURE__ */ jsx("div", {
						className: "mt-6 grid items-stretch gap-3 md:grid-cols-5",
						children: escalationLevels.map((l, i) => /* @__PURE__ */ jsxs(motion.div, {
							initial: {
								opacity: 0,
								y: 10
							},
							animate: {
								opacity: 1,
								y: 0
							},
							transition: { delay: i * .08 },
							className: "relative",
							children: [
								/* @__PURE__ */ jsxs(Card, {
									className: cn("h-full bg-gradient-to-br p-4 ring-1", toneMap[l.color]),
									children: [
										/* @__PURE__ */ jsxs("div", {
											className: "flex items-center justify-between",
											children: [/* @__PURE__ */ jsxs(Badge, {
												variant: "secondary",
												className: "bg-background/80 font-mono text-[10px]",
												children: ["L", l.level]
											}), /* @__PURE__ */ jsx("span", {
												className: "font-display text-2xl font-bold tabular-nums",
												children: l.level === 4 ? escalatedCount : Math.max(0, Math.round(escalatedCount * (.5 - l.level * .08)))
											})]
										}),
										/* @__PURE__ */ jsx("h4", {
											className: "mt-3 font-display text-sm font-bold text-foreground",
											children: l.role
										}),
										/* @__PURE__ */ jsx("p", {
											className: "mt-1 text-[11px] leading-relaxed text-muted-foreground",
											children: l.description
										})
									]
								}),
								i < escalationLevels.length - 1 && /* @__PURE__ */ jsx(ChevronRight, { className: "absolute -right-3 top-1/2 z-10 hidden h-5 w-5 -translate-y-1/2 text-muted-foreground md:block" }),
								i < escalationLevels.length - 1 && /* @__PURE__ */ jsx(ArrowDown, { className: "mx-auto mt-2 h-4 w-4 text-muted-foreground md:hidden" })
							]
						}, l.level))
					})
				]
			}),
			/* @__PURE__ */ jsxs(Card, {
				className: "p-5",
				children: [
					/* @__PURE__ */ jsx("h3", {
						className: "font-display text-base font-bold",
						children: "Currently Escalated"
					}),
					/* @__PURE__ */ jsx("p", {
						className: "text-xs text-muted-foreground",
						children: "Cases at escalated status — requiring immediate action"
					}),
					/* @__PURE__ */ jsx("div", {
						className: "mt-4 space-y-2",
						children: isLoading ? Array.from({ length: 5 }).map((_, i) => /* @__PURE__ */ jsx(Skeleton, { className: "h-16 w-full" }, i)) : escalated.length === 0 ? /* @__PURE__ */ jsx("div", {
							className: "py-8 text-center text-sm text-muted-foreground",
							children: "No escalated grievances — great work!"
						}) : escalated.map((g) => /* @__PURE__ */ jsx(Link, {
							to: "/grievances/detail",
							search: { id: String(g.id) },
							className: "block",
							children: /* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-3 rounded-lg border border-border/70 bg-card p-3 transition-colors hover:bg-muted/40",
								children: [
									/* @__PURE__ */ jsx("div", {
										className: "grid h-9 w-9 place-items-center rounded-lg bg-destructive/10 text-destructive",
										children: /* @__PURE__ */ jsx(AlertTriangle, { className: "h-4 w-4" })
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "min-w-0 flex-1",
										children: [
											/* @__PURE__ */ jsxs("div", {
												className: "flex items-center gap-2",
												children: [
													/* @__PURE__ */ jsx("span", {
														className: "font-mono text-[11px] text-muted-foreground",
														children: String(g.grievance_number ?? "")
													}),
													/* @__PURE__ */ jsx(Badge, {
														variant: "secondary",
														className: "bg-destructive/10 text-[10px] text-destructive",
														children: "Escalated"
													}),
													/* @__PURE__ */ jsx(Badge, {
														variant: "secondary",
														className: "bg-warning/15 text-[10px] text-warning capitalize",
														children: String(g.priority ?? "high")
													})
												]
											}),
											/* @__PURE__ */ jsx("div", {
												className: "truncate text-sm font-medium",
												children: String(g.subject ?? "")
											}),
											/* @__PURE__ */ jsxs("div", {
												className: "text-[11px] text-muted-foreground",
												children: [
													String(g.citizen_name ?? ""),
													" · ",
													String(g.created_at ?? "").substring(0, 10)
												]
											})
										]
									}),
									/* @__PURE__ */ jsx(Button, {
										size: "sm",
										variant: "outline",
										children: "Review"
									})
								]
							})
						}, String(g.id)))
					})
				]
			})
		]
	})] });
}
//#endregion
export { EscalationsPage as component };

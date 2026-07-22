import { C as fetchGrievances, S as fetchGrievanceStats } from "./api-CQX857SN.js";
import { t as cn } from "./utils-C_uf36nf.js";
import { t as Button } from "./button-Bq5vK6RO.js";
import { t as Card } from "./card-CzXpCsbD.js";
import { t as Badge } from "./badge-D1Dupn2y.js";
import { t as PageHeader } from "./PageHeader-B7gZRr0G.js";
import { Link } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useQuery } from "@tanstack/react-query";
import { AlertOctagon, AlertTriangle, ArrowRight, CheckCircle2, Clock, Flame, Plus } from "lucide-react";
import { motion } from "framer-motion";
//#region src/routes/_app.grievances.resolution-center.tsx?tsr-split=component
var mockFeedback = [
	{
		citizen: "Ravi Reddy",
		rating: 5,
		comment: "Quick action by MP office. Very satisfied."
	},
	{
		citizen: "Anitha Rao",
		rating: 4,
		comment: "Issue resolved within expected time."
	},
	{
		citizen: "Mohan Singh",
		rating: 3,
		comment: "Took longer than expected but resolved."
	},
	{
		citizen: "Sunita Devi",
		rating: 5,
		comment: "Excellent response. Thank you!"
	},
	{
		citizen: "Rajesh Kumar",
		rating: 4,
		comment: "Good resolution, follow-up was prompt."
	}
];
function ResolutionCenter() {
	const { data: statsData } = useQuery({
		queryKey: ["grievance-stats-rc"],
		queryFn: fetchGrievanceStats,
		staleTime: 3e4
	});
	const { data: urgentData, isLoading: loadingUrgent } = useQuery({
		queryKey: ["grievances-urgent"],
		queryFn: () => fetchGrievances({
			priority: "urgent",
			per_page: 5
		}),
		staleTime: 15e3
	});
	const { data: escalatedData } = useQuery({
		queryKey: ["grievances-escalated-rc"],
		queryFn: () => fetchGrievances({
			status: "escalated",
			per_page: 5
		}),
		staleTime: 15e3
	});
	const { data: resolvedData } = useQuery({
		queryKey: ["grievances-resolved-rc"],
		queryFn: () => fetchGrievances({
			status: "resolved",
			per_page: 5
		}),
		staleTime: 15e3
	});
	const { data: pendingData } = useQuery({
		queryKey: ["grievances-pending-rc"],
		queryFn: () => fetchGrievances({
			status: "pending",
			per_page: 5
		}),
		staleTime: 15e3
	});
	const { data: highData } = useQuery({
		queryKey: ["grievances-high-rc"],
		queryFn: () => fetchGrievances({
			priority: "high",
			per_page: 5
		}),
		staleTime: 15e3
	});
	const buckets = [
		{
			icon: AlertOctagon,
			title: "Requires Attention",
			tone: "bg-destructive/10 text-destructive",
			items: urgentData?.data ?? [],
			delay: 0
		},
		{
			icon: Clock,
			title: "Pending",
			tone: "bg-warning/15 text-warning",
			items: pendingData?.data ?? [],
			delay: 1
		},
		{
			icon: AlertTriangle,
			title: "Escalated",
			tone: "bg-info/10 text-info",
			items: escalatedData?.data ?? [],
			delay: 2
		},
		{
			icon: CheckCircle2,
			title: "Recently Resolved",
			tone: "bg-success/10 text-success",
			items: resolvedData?.data ?? [],
			delay: 3
		},
		{
			icon: Flame,
			title: "High Priority",
			tone: "bg-destructive/10 text-destructive",
			items: highData?.data ?? [],
			delay: 4
		}
	];
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(PageHeader, {
		title: "Resolution Center",
		description: "Operations cockpit — what needs attention right now.",
		actions: /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsxs(Button, {
			variant: "outline",
			size: "sm",
			className: "gap-1.5",
			children: [/* @__PURE__ */ jsx(CheckCircle2, { className: "h-4 w-4" }), " Generate Report"]
		}), /* @__PURE__ */ jsx(Button, {
			asChild: true,
			size: "sm",
			className: "gap-1.5",
			children: /* @__PURE__ */ jsxs(Link, {
				to: "/grievances/list",
				children: [/* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }), " Register Complaint"]
			})
		})] })
	}), /* @__PURE__ */ jsxs("div", {
		className: "space-y-6 p-4 md:p-8",
		children: [/* @__PURE__ */ jsx("div", {
			className: "grid grid-cols-3 gap-3 sm:grid-cols-6",
			children: [
				{
					l: "Total",
					v: statsData?.total ?? 0,
					tone: "text-foreground"
				},
				{
					l: "Pending",
					v: statsData?.pending ?? 0,
					tone: "text-destructive"
				},
				{
					l: "In Progress",
					v: statsData?.in_progress ?? 0,
					tone: "text-warning"
				},
				{
					l: "Escalated",
					v: statsData?.escalated ?? 0,
					tone: "text-info"
				},
				{
					l: "Resolved",
					v: statsData?.resolved ?? 0,
					tone: "text-success"
				},
				{
					l: "Closed",
					v: statsData?.closed ?? 0,
					tone: "text-muted-foreground"
				}
			].map((s) => /* @__PURE__ */ jsxs(Card, {
				className: "p-3 text-center",
				children: [/* @__PURE__ */ jsx("div", {
					className: `font-display text-2xl font-bold tabular-nums ${s.tone}`,
					children: s.v
				}), /* @__PURE__ */ jsx("div", {
					className: "text-xs text-muted-foreground",
					children: s.l
				})]
			}, s.l))
		}), /* @__PURE__ */ jsxs("div", {
			className: "grid gap-4 lg:grid-cols-2 xl:grid-cols-3",
			children: [buckets.map((b) => /* @__PURE__ */ jsx(Bucket, { ...b }, b.title)), /* @__PURE__ */ jsxs(Card, {
				className: "p-5",
				children: [
					/* @__PURE__ */ jsx("h3", {
						className: "font-display text-base font-bold",
						children: "Citizen Feedback"
					}),
					/* @__PURE__ */ jsx("p", {
						className: "text-xs text-muted-foreground",
						children: "Satisfaction snapshot"
					}),
					/* @__PURE__ */ jsx("div", {
						className: "mt-4 space-y-2",
						children: mockFeedback.map((f, i) => /* @__PURE__ */ jsxs("div", {
							className: "rounded-lg border border-border/70 p-3",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ jsx("span", {
									className: "text-xs font-semibold",
									children: f.citizen
								}), /* @__PURE__ */ jsxs("span", {
									className: "text-xs text-warning",
									children: ["★".repeat(f.rating), /* @__PURE__ */ jsx("span", {
										className: "text-muted-foreground/40",
										children: "★".repeat(5 - f.rating)
									})]
								})]
							}), /* @__PURE__ */ jsxs("p", {
								className: "mt-0.5 text-[11px] text-muted-foreground italic",
								children: [
									"\"",
									f.comment,
									"\""
								]
							})]
						}, i))
					})
				]
			})]
		})]
	})] });
}
function Bucket({ icon: Icon, title, tone, items, delay }) {
	return /* @__PURE__ */ jsx(motion.div, {
		initial: {
			opacity: 0,
			y: 10
		},
		animate: {
			opacity: 1,
			y: 0
		},
		transition: { delay: delay * .06 },
		children: /* @__PURE__ */ jsxs(Card, {
			className: "flex h-full flex-col p-5",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ jsx("div", {
						className: cn("grid h-9 w-9 place-items-center rounded-lg", tone),
						children: /* @__PURE__ */ jsx(Icon, { className: "h-4 w-4" })
					}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", {
						className: "font-display text-sm font-bold",
						children: title
					}), /* @__PURE__ */ jsxs("div", {
						className: "text-[11px] text-muted-foreground",
						children: [items.length, " cases"]
					})] })]
				}),
				/* @__PURE__ */ jsx("div", {
					className: "mt-4 flex-1 space-y-2",
					children: items.length === 0 ? /* @__PURE__ */ jsx("p", {
						className: "text-xs text-muted-foreground text-center py-4",
						children: "No cases"
					}) : items.map((g) => /* @__PURE__ */ jsx(Link, {
						to: "/grievances/detail",
						search: { id: String(g.id) },
						className: "block",
						children: /* @__PURE__ */ jsxs("div", {
							className: "rounded-lg border border-border/70 bg-card p-2.5 transition-colors hover:bg-muted/40",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ jsx("span", {
										className: "font-mono text-[10px] text-muted-foreground",
										children: String(g.grievance_number ?? "")
									}), /* @__PURE__ */ jsx(Badge, {
										variant: "secondary",
										className: "bg-muted text-[10px] capitalize",
										children: String(g.priority ?? "")
									})]
								}),
								/* @__PURE__ */ jsx("div", {
									className: "mt-1 truncate text-xs font-medium",
									children: String(g.subject ?? "")
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "text-[10px] text-muted-foreground",
									children: [
										String(g.citizen_name ?? ""),
										" · ",
										String(g.created_at ?? "").substring(0, 10)
									]
								})
							]
						})
					}, String(g.id)))
				}),
				/* @__PURE__ */ jsx(Button, {
					asChild: true,
					variant: "ghost",
					size: "sm",
					className: "mt-3 gap-1 text-xs",
					children: /* @__PURE__ */ jsxs(Link, {
						to: "/grievances/list",
						children: ["View all ", /* @__PURE__ */ jsx(ArrowRight, { className: "h-3 w-3" })]
					})
				})
			]
		})
	});
}
//#endregion
export { ResolutionCenter as component };

import { S as fetchGrievanceStats, x as fetchGrievanceCategories } from "./api-CQX857SN.js";
import { t as cn } from "./utils-C_uf36nf.js";
import { t as Button } from "./button-Bq5vK6RO.js";
import { t as Card } from "./card-CzXpCsbD.js";
import { t as Skeleton } from "./skeleton-D9W9wFsj.js";
import { t as PageHeader } from "./PageHeader-B7gZRr0G.js";
import { Link } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, CheckCircle2, Clock, MessageSquareWarning, Plus, TrendingDown } from "lucide-react";
import { motion } from "framer-motion";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
//#region src/routes/_app.grievances.dashboard.tsx?tsr-split=component
var trendFallback = [
	{
		d: "Mon",
		filed: 28,
		resolved: 22
	},
	{
		d: "Tue",
		filed: 35,
		resolved: 30
	},
	{
		d: "Wed",
		filed: 42,
		resolved: 33
	},
	{
		d: "Thu",
		filed: 38,
		resolved: 40
	},
	{
		d: "Fri",
		filed: 51,
		resolved: 45
	},
	{
		d: "Sat",
		filed: 33,
		resolved: 38
	},
	{
		d: "Sun",
		filed: 27,
		resolved: 30
	}
];
function GrievanceDashboard() {
	const { data: stats, isLoading: statsLoading } = useQuery({
		queryKey: ["grievance-stats"],
		queryFn: fetchGrievanceStats,
		staleTime: 3e4
	});
	const { data: categories } = useQuery({
		queryKey: ["grievance-categories"],
		queryFn: fetchGrievanceCategories,
		staleTime: 6e4
	});
	const kpis = [
		{
			label: "Total",
			value: stats?.total ?? 0,
			icon: MessageSquareWarning,
			tone: "bg-primary/10 text-primary",
			bgTone: "from-primary/10"
		},
		{
			label: "Pending",
			value: stats?.pending ?? 0,
			icon: Clock,
			tone: "bg-destructive/10 text-destructive",
			bgTone: "from-destructive/10"
		},
		{
			label: "Assigned",
			value: stats?.assigned ?? 0,
			icon: TrendingDown,
			tone: "bg-info/10 text-info",
			bgTone: "from-info/10"
		},
		{
			label: "Escalated",
			value: stats?.escalated ?? 0,
			icon: AlertTriangle,
			tone: "bg-warning/15 text-warning",
			bgTone: "from-warning/10"
		},
		{
			label: "Resolved",
			value: stats?.resolved ?? 0,
			icon: CheckCircle2,
			tone: "bg-success/10 text-success",
			bgTone: "from-success/10"
		}
	];
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(PageHeader, {
		title: "Grievance Command Center",
		description: "Live case monitoring, SLA tracking and escalation management",
		actions: /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsx(Button, {
			asChild: true,
			size: "sm",
			className: "gap-1.5",
			children: /* @__PURE__ */ jsxs(Link, {
				to: "/grievances/list",
				children: [/* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }), "New Grievance"]
			})
		}) })
	}), /* @__PURE__ */ jsxs("div", {
		className: "space-y-6 p-4 md:p-8",
		children: [
			statsLoading ? /* @__PURE__ */ jsx("div", {
				className: "grid gap-4 sm:grid-cols-3 lg:grid-cols-5",
				children: Array.from({ length: 5 }).map((_, i) => /* @__PURE__ */ jsx(Skeleton, { className: "h-28 rounded-xl" }, i))
			}) : /* @__PURE__ */ jsx("div", {
				className: "grid gap-4 sm:grid-cols-3 lg:grid-cols-5",
				children: kpis.map((k, i) => /* @__PURE__ */ jsx(motion.div, {
					initial: {
						opacity: 0,
						y: 8
					},
					animate: {
						opacity: 1,
						y: 0
					},
					transition: { delay: i * .04 },
					children: /* @__PURE__ */ jsxs(Card, {
						className: "overflow-hidden p-5 shadow-card",
						children: [
							/* @__PURE__ */ jsx("div", {
								className: cn("grid h-10 w-10 place-items-center rounded-xl", k.tone),
								children: /* @__PURE__ */ jsx(k.icon, { className: "h-5 w-5" })
							}),
							/* @__PURE__ */ jsx("div", {
								className: "mt-3 text-xs font-medium uppercase tracking-wider text-muted-foreground",
								children: k.label
							}),
							/* @__PURE__ */ jsx("div", {
								className: "mt-1 font-display text-3xl font-bold tabular-nums",
								children: k.value.toLocaleString()
							})
						]
					})
				}, k.label))
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "grid gap-6 lg:grid-cols-[1.4fr_1fr]",
				children: [/* @__PURE__ */ jsxs(Card, {
					className: "p-6",
					children: [/* @__PURE__ */ jsx("h3", {
						className: "text-h3 font-bold mb-4",
						children: "Weekly Trend"
					}), /* @__PURE__ */ jsx("div", {
						className: "h-56",
						children: /* @__PURE__ */ jsx(ResponsiveContainer, {
							width: "100%",
							height: "100%",
							children: /* @__PURE__ */ jsxs(AreaChart, {
								data: trendFallback,
								margin: {
									top: 5,
									right: 8,
									left: -20,
									bottom: 0
								},
								children: [
									/* @__PURE__ */ jsxs("defs", { children: [/* @__PURE__ */ jsxs("linearGradient", {
										id: "gF2",
										x1: "0",
										y1: "0",
										x2: "0",
										y2: "1",
										children: [/* @__PURE__ */ jsx("stop", {
											offset: "0%",
											stopColor: "var(--color-primary)",
											stopOpacity: .45
										}), /* @__PURE__ */ jsx("stop", {
											offset: "100%",
											stopColor: "var(--color-primary)",
											stopOpacity: 0
										})]
									}), /* @__PURE__ */ jsxs("linearGradient", {
										id: "gR2",
										x1: "0",
										y1: "0",
										x2: "0",
										y2: "1",
										children: [/* @__PURE__ */ jsx("stop", {
											offset: "0%",
											stopColor: "var(--color-success)",
											stopOpacity: .4
										}), /* @__PURE__ */ jsx("stop", {
											offset: "100%",
											stopColor: "var(--color-success)",
											stopOpacity: 0
										})]
									})] }),
									/* @__PURE__ */ jsx(CartesianGrid, {
										stroke: "var(--color-border)",
										strokeDasharray: "3 3",
										vertical: false
									}),
									/* @__PURE__ */ jsx(XAxis, {
										dataKey: "d",
										stroke: "var(--color-muted-foreground)",
										fontSize: 11,
										tickLine: false,
										axisLine: false
									}),
									/* @__PURE__ */ jsx(YAxis, {
										stroke: "var(--color-muted-foreground)",
										fontSize: 11,
										tickLine: false,
										axisLine: false
									}),
									/* @__PURE__ */ jsx(Tooltip, { contentStyle: {
										background: "var(--color-popover)",
										border: "1px solid var(--color-border)",
										borderRadius: 8,
										fontSize: 12
									} }),
									/* @__PURE__ */ jsx(Area, {
										type: "monotone",
										dataKey: "filed",
										stroke: "var(--color-primary)",
										strokeWidth: 2,
										fill: "url(#gF2)",
										name: "Filed"
									}),
									/* @__PURE__ */ jsx(Area, {
										type: "monotone",
										dataKey: "resolved",
										stroke: "var(--color-success)",
										strokeWidth: 2,
										fill: "url(#gR2)",
										name: "Resolved"
									})
								]
							})
						})
					})]
				}), /* @__PURE__ */ jsxs(Card, {
					className: "p-6",
					children: [/* @__PURE__ */ jsx("h3", {
						className: "text-h3 font-bold mb-4",
						children: "By Category"
					}), /* @__PURE__ */ jsxs("div", {
						className: "space-y-3",
						children: [(categories ?? []).slice(0, 8).map((c, i) => {
							const maxCount = Math.max(...(categories ?? []).map((x) => Number(x.grievances_count ?? 0)));
							const pct = maxCount > 0 ? Math.round(Number(c.grievances_count ?? 0) / maxCount * 100) : 0;
							return /* @__PURE__ */ jsxs("div", {
								className: "space-y-1",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "flex items-center justify-between text-xs",
									children: [/* @__PURE__ */ jsx("span", {
										className: "font-medium",
										children: String(c.name ?? "")
									}), /* @__PURE__ */ jsx("span", {
										className: "text-muted-foreground tabular-nums",
										children: String(c.grievances_count ?? 0)
									})]
								}), /* @__PURE__ */ jsx(motion.div, {
									className: "h-1.5 overflow-hidden rounded-full bg-muted",
									initial: { width: "100%" },
									children: /* @__PURE__ */ jsx(motion.div, {
										initial: { width: 0 },
										animate: { width: `${pct}%` },
										transition: {
											duration: .7,
											delay: i * .04
										},
										className: "h-full rounded-full bg-primary"
									})
								})]
							}, String(c.id));
						}), (!categories || categories.length === 0) && /* @__PURE__ */ jsx("p", {
							className: "text-sm text-muted-foreground",
							children: "Loading categories…"
						})]
					})]
				})]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "flex justify-end",
				children: /* @__PURE__ */ jsx(Button, {
					asChild: true,
					variant: "outline",
					children: /* @__PURE__ */ jsx(Link, {
						to: "/grievances/list",
						children: "View All Grievances →"
					})
				})
			})
		]
	})] });
}
//#endregion
export { GrievanceDashboard as component };

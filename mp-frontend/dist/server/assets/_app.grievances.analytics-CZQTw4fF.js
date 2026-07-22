import { S as fetchGrievanceStats, x as fetchGrievanceCategories } from "./api-CQX857SN.js";
import { t as cn } from "./utils-C_uf36nf.js";
import { t as Card } from "./card-CzXpCsbD.js";
import { t as Badge } from "./badge-D1Dupn2y.js";
import { t as Skeleton } from "./skeleton-D9W9wFsj.js";
import { t as PageHeader } from "./PageHeader-B7gZRr0G.js";
import { t as Progress } from "./progress-DOIEKRJF.js";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useQuery } from "@tanstack/react-query";
import { BarChart3, Building2, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
//#region src/routes/_app.grievances.analytics.tsx?tsr-split=component
function buildWeeklyTrend(total, resolved) {
	return [
		"W1",
		"W2",
		"W3",
		"W4",
		"W5",
		"W6",
		"W7",
		"W8"
	].map((w, i) => ({
		week: w,
		submitted: Math.max(1, Math.round(total / 8 * (.8 + i % 3 * .15))),
		resolved: Math.max(0, Math.round(resolved / 8 * (.7 + i % 4 * .1)))
	}));
}
function AnalyticsPage() {
	const { data: stats, isLoading: statsLoading } = useQuery({
		queryKey: ["grievance-stats-analytics"],
		queryFn: fetchGrievanceStats,
		staleTime: 3e4
	});
	const { data: cats, isLoading: catsLoading } = useQuery({
		queryKey: ["grievance-cats-analytics"],
		queryFn: fetchGrievanceCategories,
		staleTime: 6e4
	});
	const categories = cats ?? [];
	const total = stats?.total ?? 0;
	const weeklyTrend = buildWeeklyTrend(total, stats?.resolved ?? 0);
	Math.max(...categories.map((c) => Number(c.grievances_count ?? 0)), 1);
	const assemblyStats = [
		{
			assembly: "Madhapur",
			complaints: Math.round(total * .28),
			rate: 74
		},
		{
			assembly: "Serilingampally",
			complaints: Math.round(total * .24),
			rate: 68
		},
		{
			assembly: "Kukatpally",
			complaints: Math.round(total * .22),
			rate: 72
		},
		{
			assembly: "Rajendranagar",
			complaints: Math.round(total * .26),
			rate: 65
		}
	];
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(PageHeader, {
		title: "Analytics Center",
		description: "Executive insight across complaint geography, departments and trends."
	}), /* @__PURE__ */ jsxs("div", {
		className: "space-y-6 p-4 md:p-8",
		children: [
			/* @__PURE__ */ jsx("div", {
				className: "grid grid-cols-3 gap-3 sm:grid-cols-6",
				children: [
					{
						l: "Total",
						v: stats?.total ?? 0,
						tone: "text-foreground"
					},
					{
						l: "Pending",
						v: stats?.pending ?? 0,
						tone: "text-destructive"
					},
					{
						l: "Assigned",
						v: stats?.assigned ?? 0,
						tone: "text-info"
					},
					{
						l: "Escalated",
						v: stats?.escalated ?? 0,
						tone: "text-warning"
					},
					{
						l: "Resolved",
						v: stats?.resolved ?? 0,
						tone: "text-success"
					},
					{
						l: "This Week",
						v: stats?.this_week ?? 0,
						tone: "text-primary"
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
			}),
			/* @__PURE__ */ jsxs(Card, {
				className: "p-5",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-center justify-between mb-4",
					children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", {
						className: "font-display text-base font-bold",
						children: "Complaints By Category"
					}), /* @__PURE__ */ jsx("p", {
						className: "text-xs text-muted-foreground",
						children: "Volume across all categories"
					})] }), /* @__PURE__ */ jsxs(Badge, {
						variant: "secondary",
						className: "gap-1 bg-primary/10 text-primary",
						children: [
							/* @__PURE__ */ jsx(BarChart3, { className: "h-3 w-3" }),
							" ",
							total,
							" total"
						]
					})]
				}), catsLoading ? /* @__PURE__ */ jsx(Skeleton, { className: "h-48" }) : /* @__PURE__ */ jsx(ResponsiveContainer, {
					width: "100%",
					height: 200,
					children: /* @__PURE__ */ jsxs(BarChart, {
						data: categories.map((c) => ({
							name: String(c.name ?? "").substring(0, 8),
							value: Number(c.grievances_count ?? 0)
						})),
						children: [
							/* @__PURE__ */ jsx(CartesianGrid, {
								strokeDasharray: "3 3",
								stroke: "hsl(var(--border))"
							}),
							/* @__PURE__ */ jsx(XAxis, {
								dataKey: "name",
								tick: { fontSize: 11 }
							}),
							/* @__PURE__ */ jsx(YAxis, { tick: { fontSize: 11 } }),
							/* @__PURE__ */ jsx(Tooltip, { contentStyle: {
								fontSize: 12,
								borderRadius: 8
							} }),
							/* @__PURE__ */ jsx(Bar, {
								dataKey: "value",
								fill: "hsl(var(--primary))",
								radius: [
									4,
									4,
									0,
									0
								]
							})
						]
					})
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "grid gap-4 lg:grid-cols-2",
				children: [/* @__PURE__ */ jsxs(Card, {
					className: "p-5",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-center justify-between mb-4",
						children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", {
							className: "font-display text-base font-bold",
							children: "Resolution Trend"
						}), /* @__PURE__ */ jsx("p", {
							className: "text-xs text-muted-foreground",
							children: "Weekly submitted vs. resolved"
						})] }), /* @__PURE__ */ jsxs(Badge, {
							variant: "secondary",
							className: "gap-1 bg-success/10 text-success",
							children: [/* @__PURE__ */ jsx(TrendingUp, { className: "h-3 w-3" }), " Improving"]
						})]
					}), statsLoading ? /* @__PURE__ */ jsx(Skeleton, { className: "h-48" }) : /* @__PURE__ */ jsx(ResponsiveContainer, {
						width: "100%",
						height: 200,
						children: /* @__PURE__ */ jsxs(LineChart, {
							data: weeklyTrend,
							children: [
								/* @__PURE__ */ jsx(CartesianGrid, {
									strokeDasharray: "3 3",
									stroke: "hsl(var(--border))"
								}),
								/* @__PURE__ */ jsx(XAxis, {
									dataKey: "week",
									tick: { fontSize: 11 }
								}),
								/* @__PURE__ */ jsx(YAxis, { tick: { fontSize: 11 } }),
								/* @__PURE__ */ jsx(Tooltip, { contentStyle: {
									fontSize: 12,
									borderRadius: 8
								} }),
								/* @__PURE__ */ jsx(Legend, {}),
								/* @__PURE__ */ jsx(Line, {
									type: "monotone",
									dataKey: "submitted",
									stroke: "hsl(var(--primary)/0.6)",
									strokeWidth: 2,
									dot: false,
									name: "Submitted"
								}),
								/* @__PURE__ */ jsx(Line, {
									type: "monotone",
									dataKey: "resolved",
									stroke: "hsl(var(--success))",
									strokeWidth: 2,
									dot: false,
									name: "Resolved"
								})
							]
						})
					})]
				}), /* @__PURE__ */ jsxs(Card, {
					className: "p-5",
					children: [
						/* @__PURE__ */ jsx("h3", {
							className: "font-display text-base font-bold",
							children: "Complaints By Assembly"
						}),
						/* @__PURE__ */ jsx("p", {
							className: "text-xs text-muted-foreground",
							children: "Constituency rollup"
						}),
						/* @__PURE__ */ jsx("div", {
							className: "mt-4 grid grid-cols-2 gap-3",
							children: assemblyStats.map((a, i) => /* @__PURE__ */ jsx(motion.div, {
								initial: {
									opacity: 0,
									scale: .95
								},
								animate: {
									opacity: 1,
									scale: 1
								},
								transition: { delay: i * .06 },
								children: /* @__PURE__ */ jsxs(Card, {
									className: "bg-muted/30 p-4",
									children: [
										/* @__PURE__ */ jsx("div", {
											className: "text-xs font-medium text-muted-foreground",
											children: a.assembly
										}),
										/* @__PURE__ */ jsx("div", {
											className: "mt-1 font-display text-2xl font-bold tabular-nums",
											children: a.complaints.toLocaleString()
										}),
										/* @__PURE__ */ jsxs(Badge, {
											variant: "secondary",
											className: "mt-2 bg-success/10 text-success",
											children: [a.rate, "% resolved"]
										})
									]
								})
							}, a.assembly))
						})
					]
				})]
			}),
			/* @__PURE__ */ jsxs(Card, {
				className: "p-5",
				children: [
					/* @__PURE__ */ jsx("h3", {
						className: "font-display text-base font-bold",
						children: "Department Performance"
					}),
					/* @__PURE__ */ jsx("p", {
						className: "text-xs text-muted-foreground",
						children: "SLA compliance ranking"
					}),
					/* @__PURE__ */ jsx("div", {
						className: "mt-4 space-y-3",
						children: [...[
							{
								name: "Roads & Buildings",
								slaCompliance: 88
							},
							{
								name: "Water Board",
								slaCompliance: 76
							},
							{
								name: "Revenue",
								slaCompliance: 82
							},
							{
								name: "Health",
								slaCompliance: 91
							},
							{
								name: "Education",
								slaCompliance: 78
							}
						]].sort((a, b) => b.slaCompliance - a.slaCompliance).map((d, i) => /* @__PURE__ */ jsxs("div", {
							className: "grid grid-cols-12 items-center gap-3 text-xs",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "col-span-1 text-center font-mono text-muted-foreground",
									children: ["#", i + 1]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "col-span-4 inline-flex items-center gap-2 font-medium",
									children: [
										/* @__PURE__ */ jsx(Building2, { className: "h-3 w-3 text-muted-foreground" }),
										" ",
										d.name
									]
								}),
								/* @__PURE__ */ jsx("div", {
									className: "col-span-5",
									children: /* @__PURE__ */ jsx(Progress, {
										value: d.slaCompliance,
										className: "h-2"
									})
								}),
								/* @__PURE__ */ jsxs("div", {
									className: cn("col-span-2 text-right font-semibold tabular-nums", d.slaCompliance >= 85 ? "text-success" : d.slaCompliance >= 70 ? "text-warning" : "text-destructive"),
									children: [d.slaCompliance, "%"]
								})
							]
						}, d.name))
					})
				]
			})
		]
	})] });
}
//#endregion
export { AnalyticsPage as component };

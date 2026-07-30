import { t as Route } from "./_app.projects.analytics-B5RqcNJE.js";
import { t as cn } from "./utils-C_uf36nf.js";
import { t as Button } from "./button-Bq5vK6RO.js";
import { t as Card } from "./card-CzXpCsbD.js";
import { t as Badge } from "./badge-D1Dupn2y.js";
import { t as PageHeader } from "./PageHeader-B7gZRr0G.js";
import { t as Progress } from "./progress-DOIEKRJF.js";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { BarChart3, Download, MapPin, Trophy } from "lucide-react";
import { motion } from "framer-motion";
//#region src/routes/_app.projects.analytics.tsx?tsr-split=component
var completionTrend = [
	{
		month: "Jan",
		projects: 8
	},
	{
		month: "Feb",
		projects: 10
	},
	{
		month: "Mar",
		projects: 12
	},
	{
		month: "Apr",
		projects: 14
	},
	{
		month: "May",
		projects: 16
	},
	{
		month: "Jun",
		projects: 18
	}
];
var monthlyBudgetTrend = [
	{
		month: "Jan",
		allocated: 24,
		utilized: 18
	},
	{
		month: "Feb",
		allocated: 28,
		utilized: 22
	},
	{
		month: "Mar",
		allocated: 32,
		utilized: 26
	},
	{
		month: "Apr",
		allocated: 30,
		utilized: 24
	},
	{
		month: "May",
		allocated: 26,
		utilized: 20
	},
	{
		month: "Jun",
		allocated: 44.6,
		utilized: 22.4
	}
];
var contractorsData = [
	{
		id: "C001",
		name: "Sri Venkateshwara Constructions",
		projectsAssigned: 12,
		completed: 10,
		performanceScore: 88,
		budgetHandled: 48,
		risk: "Low"
	},
	{
		id: "C002",
		name: "Jaya Bharat Infrastructure",
		projectsAssigned: 10,
		completed: 8,
		performanceScore: 82,
		budgetHandled: 36,
		risk: "Low"
	},
	{
		id: "C003",
		name: "Telangana Road Works Ltd",
		projectsAssigned: 8,
		completed: 6,
		performanceScore: 76,
		budgetHandled: 28,
		risk: "Medium"
	},
	{
		id: "C004",
		name: "Vasavi Builders & Developers",
		projectsAssigned: 6,
		completed: 4,
		performanceScore: 70,
		budgetHandled: 20,
		risk: "Medium"
	},
	{
		id: "C005",
		name: "Sri Sai Engineering Works",
		projectsAssigned: 4,
		completed: 2,
		performanceScore: 64,
		budgetHandled: 12,
		risk: "High"
	}
];
var mpladsCategoryAllocations = [
	{
		category: "Roads & Highways",
		icon: "🛣️",
		allocated: 80,
		utilized: 68
	},
	{
		category: "Water Supply",
		icon: "💧",
		allocated: 40,
		utilized: 36
	},
	{
		category: "Education",
		icon: "🏫",
		allocated: 30,
		utilized: 24
	},
	{
		category: "Healthcare",
		icon: "🏥",
		allocated: 25,
		utilized: 18
	},
	{
		category: "Community Halls",
		icon: "🏛️",
		allocated: 15,
		utilized: 12
	}
];
var villageBudget = [
	{
		village: "Kothaguda",
		budget: 24,
		projects: 12,
		score: 88
	},
	{
		village: "Gachibowli",
		budget: 22,
		projects: 10,
		score: 84
	},
	{
		village: "Madhapur",
		budget: 18,
		projects: 9,
		score: 78
	},
	{
		village: "Hitech City",
		budget: 16,
		projects: 8,
		score: 76
	},
	{
		village: "Jubilee Hills",
		budget: 14,
		projects: 7,
		score: 72
	},
	{
		village: "Banjara Hills",
		budget: 12,
		projects: 6,
		score: 68
	},
	{
		village: "Manikonda",
		budget: 10,
		projects: 5,
		score: 64
	},
	{
		village: "Narsingi",
		budget: 8,
		projects: 4,
		score: 60
	},
	{
		village: "Kokapet",
		budget: 6,
		projects: 3,
		score: 56
	}
];
function AnalyticsPage() {
	const { stats } = Route.useLoaderData();
	const maxCompl = Math.max(...completionTrend.map((t) => t.projects));
	const maxBud = Math.max(...monthlyBudgetTrend.map((t) => t.allocated));
	const topContractors = [...contractorsData].sort((a, b) => b.performanceScore - a.performanceScore).slice(0, 5);
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(PageHeader, {
		title: "Project Analytics Center",
		description: "Trends, performance leaderboards and constituency development indices.",
		actions: /* @__PURE__ */ jsxs(Button, {
			variant: "outline",
			size: "sm",
			className: "gap-1.5",
			children: [/* @__PURE__ */ jsx(Download, { className: "h-4 w-4" }), " Analytics Pack"]
		})
	}), /* @__PURE__ */ jsxs("div", {
		className: "space-y-6 p-4 md:p-8",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "grid gap-4 lg:grid-cols-2",
				children: [/* @__PURE__ */ jsxs(Card, {
					className: "p-5",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ jsx("h3", {
							className: "font-display text-base font-bold",
							children: "Project Completion Trend"
						}), /* @__PURE__ */ jsx(Badge, {
							variant: "secondary",
							className: "bg-success/10 text-success",
							children: "+22% YoY"
						})]
					}), /* @__PURE__ */ jsx("div", {
						className: "mt-6 flex h-40 items-end gap-3",
						children: completionTrend.map((t, i) => /* @__PURE__ */ jsxs(motion.div, {
							initial: { height: 0 },
							animate: { height: "auto" },
							transition: { delay: i * .06 },
							className: "flex flex-1 flex-col items-center gap-1",
							children: [
								/* @__PURE__ */ jsx("div", {
									className: "w-full rounded-t bg-gradient-to-t from-success to-primary",
									style: { height: `${t.projects / maxCompl * 130}px` }
								}),
								/* @__PURE__ */ jsx("span", {
									className: "text-[10px] text-muted-foreground",
									children: t.month
								}),
								/* @__PURE__ */ jsx("span", {
									className: "text-[10px] font-semibold tabular-nums",
									children: t.projects
								})
							]
						}, t.month))
					})]
				}), /* @__PURE__ */ jsxs(Card, {
					className: "p-5",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ jsx("h3", {
							className: "font-display text-base font-bold",
							children: "Budget Utilization Trend (₹ Cr)"
						}), /* @__PURE__ */ jsx(Badge, {
							variant: "secondary",
							className: "bg-primary/10 text-primary",
							children: "FY 25-26"
						})]
					}), /* @__PURE__ */ jsx("div", {
						className: "mt-6 flex h-40 items-end gap-3",
						children: monthlyBudgetTrend.map((t, i) => /* @__PURE__ */ jsxs(motion.div, {
							initial: { height: 0 },
							animate: { height: "auto" },
							transition: { delay: i * .06 },
							className: "flex flex-1 flex-col items-center gap-1",
							children: [
								/* @__PURE__ */ jsx("div", {
									className: "w-full rounded-t bg-gradient-to-t from-primary to-info",
									style: { height: `${t.utilized / maxBud * 130}px` }
								}),
								/* @__PURE__ */ jsx("span", {
									className: "text-[10px] text-muted-foreground",
									children: t.month
								}),
								/* @__PURE__ */ jsxs("span", {
									className: "text-[10px] font-semibold tabular-nums",
									children: ["₹", t.utilized]
								})
							]
						}, t.month))
					})]
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "grid gap-4 lg:grid-cols-2",
				children: [/* @__PURE__ */ jsxs(Card, {
					className: "p-5",
					children: [/* @__PURE__ */ jsxs("h3", {
						className: "font-display text-base font-bold flex items-center gap-2",
						children: [/* @__PURE__ */ jsx(Trophy, { className: "h-4 w-4 text-warning" }), " Top Contractors"]
					}), /* @__PURE__ */ jsx("div", {
						className: "mt-3 space-y-2",
						children: topContractors.map((c, i) => /* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-3 rounded-lg border border-border/70 p-3",
							children: [
								/* @__PURE__ */ jsx("div", {
									className: cn("grid h-8 w-8 place-items-center rounded-full font-bold", i === 0 ? "bg-warning text-warning-foreground" : i === 1 ? "bg-muted" : "bg-muted/60"),
									children: i + 1
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "min-w-0 flex-1",
									children: [/* @__PURE__ */ jsx("div", {
										className: "truncate text-sm font-semibold",
										children: c.name
									}), /* @__PURE__ */ jsxs("div", {
										className: "text-[11px] text-muted-foreground",
										children: [
											c.completed,
											"/",
											c.projectsAssigned,
											" delivered · ₹",
											c.budgetHandled,
											"Cr"
										]
									})]
								}),
								/* @__PURE__ */ jsx(Badge, {
									variant: "secondary",
									className: "bg-success/10 text-success",
									children: c.performanceScore
								})
							]
						}, c.id))
					})]
				}), /* @__PURE__ */ jsxs(Card, {
					className: "p-5",
					children: [/* @__PURE__ */ jsx("h3", {
						className: "font-display text-base font-bold",
						children: "Category Performance"
					}), /* @__PURE__ */ jsx("div", {
						className: "mt-3 space-y-2",
						children: mpladsCategoryAllocations.map((c) => {
							const eff = Math.round(c.utilized / c.allocated * 100);
							return /* @__PURE__ */ jsxs("div", {
								className: "rounded-lg border border-border/70 p-3",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "flex items-center justify-between text-sm",
									children: [/* @__PURE__ */ jsxs("span", { children: [/* @__PURE__ */ jsx("span", {
										className: "mr-1.5",
										children: c.icon
									}), c.category] }), /* @__PURE__ */ jsxs("span", {
										className: "font-semibold tabular-nums",
										children: [eff, "%"]
									})]
								}), /* @__PURE__ */ jsx(Progress, {
									value: eff,
									className: "mt-1.5 h-1.5"
								})]
							}, c.category);
						})
					})]
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "grid gap-4 lg:grid-cols-2",
				children: [/* @__PURE__ */ jsxs(Card, {
					className: "p-5",
					children: [/* @__PURE__ */ jsx("h3", {
						className: "font-display text-base font-bold",
						children: "Village Development Index"
					}), /* @__PURE__ */ jsx("div", {
						className: "mt-3 space-y-2",
						children: villageBudget.map((v, i) => /* @__PURE__ */ jsxs(motion.div, {
							initial: {
								opacity: 0,
								x: -6
							},
							animate: {
								opacity: 1,
								x: 0
							},
							transition: { delay: i * .04 },
							className: "flex items-center gap-3 rounded-lg border border-border/70 p-3",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "text-[11px] font-bold text-muted-foreground tabular-nums",
									children: ["#", i + 1]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "min-w-0 flex-1",
									children: [/* @__PURE__ */ jsx("div", {
										className: "text-sm font-semibold",
										children: v.village
									}), /* @__PURE__ */ jsxs("div", {
										className: "text-[11px] text-muted-foreground",
										children: [
											v.projects,
											" projects · ₹",
											v.budget,
											"Cr"
										]
									})]
								}),
								/* @__PURE__ */ jsxs(Badge, {
									variant: "secondary",
									className: cn(v.score >= 80 ? "bg-success/10 text-success" : v.score >= 70 ? "bg-info/10 text-info" : "bg-warning/15 text-warning"),
									children: [v.score, "/100"]
								})
							]
						}, v.village))
					})]
				}), /* @__PURE__ */ jsxs(Card, {
					className: "p-5",
					children: [/* @__PURE__ */ jsx("h3", {
						className: "font-display text-base font-bold",
						children: "Mandal Development Index"
					}), /* @__PURE__ */ jsx("div", {
						className: "mt-3 space-y-2",
						children: [
							{
								mandal: "Serilingampally",
								score: 86,
								projects: 84,
								budget: 62.4
							},
							{
								mandal: "Kukatpally",
								score: 78,
								projects: 52,
								budget: 38.8
							},
							{
								mandal: "Khairatabad",
								score: 82,
								projects: 28,
								budget: 24.6
							},
							{
								mandal: "Rajendranagar",
								score: 68,
								projects: 46,
								budget: 31.4
							},
							{
								mandal: "Maheshwaram",
								score: 62,
								projects: 38,
								budget: 27.4
							}
						].map((m, i) => /* @__PURE__ */ jsxs(motion.div, {
							initial: {
								opacity: 0,
								x: -6
							},
							animate: {
								opacity: 1,
								x: 0
							},
							transition: { delay: i * .04 },
							className: "rounded-lg border border-border/70 p-3",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "flex items-center justify-between text-sm",
									children: [/* @__PURE__ */ jsx("span", {
										className: "font-semibold",
										children: m.mandal
									}), /* @__PURE__ */ jsx(Badge, {
										variant: "secondary",
										className: cn(m.score >= 80 ? "bg-success/10 text-success" : m.score >= 70 ? "bg-info/10 text-info" : "bg-warning/15 text-warning"),
										children: m.score
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "mt-1 flex justify-between text-[11px] text-muted-foreground",
									children: [/* @__PURE__ */ jsxs("span", { children: [m.projects, " projects"] }), /* @__PURE__ */ jsxs("span", { children: [
										"₹",
										m.budget,
										"Cr"
									] })]
								}),
								/* @__PURE__ */ jsx(Progress, {
									value: m.score,
									className: "mt-1.5 h-1.5"
								})
							]
						}, m.mandal))
					})]
				})]
			}),
			/* @__PURE__ */ jsxs(Card, {
				className: "p-5",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("h3", {
						className: "font-display text-base font-bold flex items-center gap-2",
						children: [/* @__PURE__ */ jsx(BarChart3, { className: "h-4 w-4 text-primary" }), " Constituency Development Map"]
					}), /* @__PURE__ */ jsx("p", {
						className: "text-xs text-muted-foreground",
						children: "Roads · Water · Schools · Hospitals · MPLADS"
					})] }), /* @__PURE__ */ jsx(Badge, {
						variant: "secondary",
						className: "bg-info/10 text-info",
						children: "GIS Preview"
					})]
				}), /* @__PURE__ */ jsx("div", {
					className: "mt-4 grid h-72 place-items-center rounded-xl border border-dashed border-border/70 bg-[radial-gradient(circle_at_25%_25%,hsl(var(--primary)/0.14),transparent_50%),radial-gradient(circle_at_75%_65%,hsl(var(--success)/0.12),transparent_45%),radial-gradient(circle_at_55%_40%,hsl(var(--warning)/0.12),transparent_40%)]",
					children: /* @__PURE__ */ jsxs("div", {
						className: "text-center",
						children: [
							/* @__PURE__ */ jsx(MapPin, { className: "mx-auto h-8 w-8 text-primary" }),
							/* @__PURE__ */ jsx("div", {
								className: "mt-2 text-sm font-semibold",
								children: "Project density heatmap"
							}),
							/* @__PURE__ */ jsx("div", {
								className: "text-xs text-muted-foreground",
								children: "Layered view of all infrastructure works"
							})
						]
					})
				})]
			})
		]
	})] });
}
//#endregion
export { AnalyticsPage as component };

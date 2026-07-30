import { t as Route } from "./_app.projects.budget-monitoring-D79XNdlk.js";
import { t as cn } from "./utils-C_uf36nf.js";
import { t as Button } from "./button-Bq5vK6RO.js";
import { t as Card } from "./card-CzXpCsbD.js";
import { t as Badge } from "./badge-D1Dupn2y.js";
import { t as PageHeader } from "./PageHeader-B7gZRr0G.js";
import { t as Progress } from "./progress-DOIEKRJF.js";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { Download, IndianRupee, Percent, TrendingDown, TrendingUp, Wallet } from "lucide-react";
import { motion } from "framer-motion";
//#region src/routes/_app.projects.budget-monitoring.tsx?tsr-split=component
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
function BudgetMonitoring() {
	const { stats } = Route.useLoaderData();
	const maxBudget = Math.max(...monthlyBudgetTrend.map((m) => m.allocated));
	const maxVilBudget = Math.max(...villageBudget.map((v) => v.budget));
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(PageHeader, {
		title: "Budget Monitoring Center",
		description: "Financial efficiency across MPLADS, state and central funds.",
		actions: /* @__PURE__ */ jsxs(Button, {
			variant: "outline",
			size: "sm",
			className: "gap-1.5",
			children: [/* @__PURE__ */ jsx(Download, { className: "h-4 w-4" }), " Finance Report"]
		})
	}), /* @__PURE__ */ jsxs("div", {
		className: "space-y-6 p-4 md:p-8",
		children: [
			/* @__PURE__ */ jsx("div", {
				className: "grid grid-cols-2 gap-3 md:grid-cols-5",
				children: [
					{
						l: "Total Budget",
						v: `₹${(stats.total_budget || 0).toLocaleString()}`,
						icon: IndianRupee,
						tone: "bg-primary/10 text-primary"
					},
					{
						l: "Utilized",
						v: `₹${(stats.total_spent || 0).toLocaleString()}`,
						icon: Wallet,
						tone: "bg-success/10 text-success"
					},
					{
						l: "Remaining",
						v: `₹${((stats.total_budget || 0) - (stats.total_spent || 0)).toLocaleString()}`,
						icon: TrendingUp,
						tone: "bg-info/10 text-info"
					},
					{
						l: "Cost Overruns",
						v: "₹1.84Cr",
						icon: TrendingDown,
						tone: "bg-destructive/10 text-destructive"
					},
					{
						l: "Budget Efficiency",
						v: stats.total_budget > 0 ? `${Math.round(stats.total_spent / stats.total_budget * 100)}%` : "0%",
						icon: Percent,
						tone: "bg-warning/15 text-warning"
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
							className: "mt-1 font-display text-xl font-bold tabular-nums",
							children: k.v
						})
					]
				}, k.l))
			}),
			/* @__PURE__ */ jsxs(Card, {
				className: "p-5",
				children: [
					/* @__PURE__ */ jsx("h3", {
						className: "font-display text-base font-bold",
						children: "Budget vs Utilization · Last 6 months (₹ Cr)"
					}),
					/* @__PURE__ */ jsx("div", {
						className: "mt-6 flex h-48 items-end gap-4",
						children: monthlyBudgetTrend.map((t, i) => /* @__PURE__ */ jsxs(motion.div, {
							initial: {
								height: 0,
								opacity: 0
							},
							animate: {
								height: "auto",
								opacity: 1
							},
							transition: { delay: i * .06 },
							className: "flex flex-1 flex-col items-center gap-1",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "flex w-full items-end gap-1",
								children: [/* @__PURE__ */ jsx("div", {
									className: "flex-1 rounded-t bg-primary/20",
									style: { height: `${t.allocated / maxBudget * 160}px` }
								}), /* @__PURE__ */ jsx("div", {
									className: "flex-1 rounded-t bg-primary",
									style: { height: `${t.utilized / maxBudget * 160}px` }
								})]
							}), /* @__PURE__ */ jsx("span", {
								className: "text-[10px] text-muted-foreground",
								children: t.month
							})]
						}, t.month))
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "mt-3 flex gap-4 text-xs text-muted-foreground",
						children: [/* @__PURE__ */ jsxs("span", {
							className: "inline-flex items-center gap-1.5",
							children: [/* @__PURE__ */ jsx("span", { className: "h-2 w-2 rounded bg-primary/20" }), " Allocated"]
						}), /* @__PURE__ */ jsxs("span", {
							className: "inline-flex items-center gap-1.5",
							children: [/* @__PURE__ */ jsx("span", { className: "h-2 w-2 rounded bg-primary" }), " Utilized"]
						})]
					})
				]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "grid gap-4 lg:grid-cols-2",
				children: [/* @__PURE__ */ jsxs(Card, {
					className: "p-5",
					children: [/* @__PURE__ */ jsx("h3", {
						className: "font-display text-base font-bold",
						children: "Budget by Village · Top 9"
					}), /* @__PURE__ */ jsx("div", {
						className: "mt-4 space-y-2",
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
							children: [/* @__PURE__ */ jsxs("div", {
								className: "flex items-center justify-between text-xs",
								children: [/* @__PURE__ */ jsx("span", {
									className: "font-semibold",
									children: v.village
								}), /* @__PURE__ */ jsxs("span", {
									className: "text-muted-foreground tabular-nums",
									children: [
										"₹",
										v.budget,
										"Cr · ",
										v.projects,
										" projects"
									]
								})]
							}), /* @__PURE__ */ jsx("div", {
								className: "mt-1 h-2 overflow-hidden rounded bg-muted",
								children: /* @__PURE__ */ jsx(motion.div, {
									initial: { width: 0 },
									animate: { width: `${v.budget / maxVilBudget * 100}%` },
									transition: {
										duration: .8,
										delay: .1 + i * .04
									},
									className: "h-full rounded bg-gradient-to-r from-primary to-info"
								})
							})]
						}, v.village))
					})]
				}), /* @__PURE__ */ jsxs(Card, {
					className: "p-5",
					children: [/* @__PURE__ */ jsx("h3", {
						className: "font-display text-base font-bold",
						children: "Budget by Category"
					}), /* @__PURE__ */ jsx("div", {
						className: "mt-4 space-y-3",
						children: mpladsCategoryAllocations.map((c) => {
							const eff = Math.round(c.utilized / c.allocated * 100);
							return /* @__PURE__ */ jsxs("div", {
								className: "rounded-lg border border-border/70 p-3",
								children: [
									/* @__PURE__ */ jsxs("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ jsxs("span", {
											className: "text-sm font-semibold",
											children: [/* @__PURE__ */ jsx("span", {
												className: "mr-1.5",
												children: c.icon
											}), c.category]
										}), /* @__PURE__ */ jsxs(Badge, {
											variant: "secondary",
											className: cn(eff >= 80 ? "bg-success/10 text-success" : eff >= 60 ? "bg-warning/15 text-warning" : "bg-destructive/10 text-destructive"),
											children: [eff, "% efficient"]
										})]
									}),
									/* @__PURE__ */ jsx(Progress, {
										value: eff,
										className: "mt-2 h-1.5"
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "mt-1 flex justify-between text-[11px] text-muted-foreground",
										children: [/* @__PURE__ */ jsxs("span", { children: [
											"Allocated ₹",
											(c.allocated / 100).toFixed(1),
											"Cr"
										] }), /* @__PURE__ */ jsxs("span", { children: [
											"Utilized ₹",
											(c.utilized / 100).toFixed(1),
											"Cr"
										] })]
									})
								]
							}, c.category);
						})
					})]
				})]
			})
		]
	})] });
}
//#endregion
export { BudgetMonitoring as component };

import { S as fetchGrievanceStats, x as fetchGrievanceCategories } from "./api-CQX857SN.js";
import { t as Card } from "./card-CzXpCsbD.js";
import { t as Badge } from "./badge-D1Dupn2y.js";
import { t as Skeleton } from "./skeleton-D9W9wFsj.js";
import { t as PageHeader } from "./PageHeader-B7gZRr0G.js";
import { t as Progress } from "./progress-DOIEKRJF.js";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useQuery } from "@tanstack/react-query";
import { Clock, TrendingDown, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
//#region src/routes/_app.grievances.categories.tsx?tsr-split=component
var CATEGORY_ICONS = {
	"Roads": "🛣️",
	"Water Supply": "💧",
	"Drainage": "🚿",
	"Health": "🏥",
	"Education": "🎓",
	"Welfare": "🤝",
	"Agriculture": "🌾",
	"Electricity": "⚡",
	"Revenue": "📋",
	"Railways": "🚂",
	"Passport": "📜",
	"Pension": "👴"
};
function CategoriesPage() {
	const { data: categories, isLoading } = useQuery({
		queryKey: ["grievance-categories-detail"],
		queryFn: fetchGrievanceCategories,
		staleTime: 6e4
	});
	const { data: stats } = useQuery({
		queryKey: ["grievance-stats-cats"],
		queryFn: fetchGrievanceStats,
		staleTime: 6e4
	});
	const cats = categories ?? [];
	const maxVolume = Math.max(...cats.map((c) => Number(c.grievances_count ?? 0)), 1);
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(PageHeader, {
		title: "Category Management",
		description: "Volume, resolution rate and SLA performance across complaint categories."
	}), /* @__PURE__ */ jsxs("div", {
		className: "space-y-6 p-4 md:p-8",
		children: [/* @__PURE__ */ jsx("div", {
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
					children: s.v ?? 0
				}), /* @__PURE__ */ jsx("div", {
					className: "text-xs text-muted-foreground",
					children: s.l
				})]
			}, s.l))
		}), isLoading ? /* @__PURE__ */ jsx("div", {
			className: "grid gap-4 md:grid-cols-2 xl:grid-cols-3",
			children: Array.from({ length: 8 }).map((_, i) => /* @__PURE__ */ jsx(Skeleton, { className: "h-44 rounded-xl" }, i))
		}) : /* @__PURE__ */ jsxs("div", {
			className: "grid gap-4 md:grid-cols-2 xl:grid-cols-3",
			children: [cats.map((c, i) => {
				const volume = Number(c.grievances_count ?? 0);
				const slaFraction = Number(c.sla_days ?? 14);
				const resolutionRate = volume > 0 ? Math.min(99, Math.round(60 + i % 4 * 8)) : 0;
				const icon = CATEGORY_ICONS[String(c.name ?? "")] ?? "📋";
				const trend = i % 3 === 0 ? "up" : "down";
				return /* @__PURE__ */ jsx(motion.div, {
					initial: {
						opacity: 0,
						y: 10
					},
					animate: {
						opacity: 1,
						y: 0
					},
					transition: { delay: i * .05 },
					children: /* @__PURE__ */ jsxs(Card, {
						className: "p-5 transition-all hover:shadow-lg",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-start justify-between",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-3",
								children: [/* @__PURE__ */ jsx("div", {
									className: "grid h-12 w-12 place-items-center rounded-xl bg-muted text-2xl",
									children: icon
								}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", {
									className: "font-display text-base font-bold",
									children: String(c.name ?? "")
								}), /* @__PURE__ */ jsxs("div", {
									className: "text-xs text-muted-foreground tabular-nums",
									children: [volume.toLocaleString(), " complaints"]
								})] })]
							}), /* @__PURE__ */ jsxs(Badge, {
								variant: "secondary",
								className: trend === "up" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive",
								children: [trend === "up" ? /* @__PURE__ */ jsx(TrendingUp, { className: "mr-0.5 inline h-3 w-3" }) : /* @__PURE__ */ jsx(TrendingDown, { className: "mr-0.5 inline h-3 w-3" }), " trend"]
							})]
						}), /* @__PURE__ */ jsxs("div", {
							className: "mt-4 space-y-3",
							children: [
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
									className: "flex items-center justify-between text-xs",
									children: [/* @__PURE__ */ jsx("span", {
										className: "text-muted-foreground",
										children: "Volume"
									}), /* @__PURE__ */ jsx("span", {
										className: "font-semibold tabular-nums",
										children: volume
									})]
								}), /* @__PURE__ */ jsx(Progress, {
									value: maxVolume > 0 ? volume / maxVolume * 100 : 0,
									className: "mt-1 h-1.5"
								})] }),
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
									className: "flex items-center justify-between text-xs",
									children: [/* @__PURE__ */ jsx("span", {
										className: "text-muted-foreground",
										children: "Est. Resolution Rate"
									}), /* @__PURE__ */ jsxs("span", {
										className: "font-semibold tabular-nums",
										children: [resolutionRate, "%"]
									})]
								}), /* @__PURE__ */ jsx(Progress, {
									value: resolutionRate,
									className: "mt-1 h-1.5"
								})] }),
								/* @__PURE__ */ jsxs("div", {
									className: "flex items-center justify-between text-xs",
									children: [/* @__PURE__ */ jsxs("span", {
										className: "inline-flex items-center gap-1 text-muted-foreground",
										children: [/* @__PURE__ */ jsx(Clock, { className: "h-3 w-3" }), " SLA Days"]
									}), /* @__PURE__ */ jsxs("span", {
										className: "font-semibold tabular-nums",
										children: [slaFraction, " days"]
									})]
								}),
								c.severity && /* @__PURE__ */ jsx(Badge, {
									variant: "secondary",
									className: "text-[10px] capitalize",
									children: String(c.severity)
								})
							]
						})]
					})
				}, String(c.id));
			}), cats.length === 0 && /* @__PURE__ */ jsx("div", {
				className: "col-span-3 py-12 text-center text-sm text-muted-foreground",
				children: "No categories found."
			})]
		})]
	})] });
}
//#endregion
export { CategoriesPage as component };

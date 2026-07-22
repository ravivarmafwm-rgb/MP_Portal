import { B as fetchSurveyStats, V as fetchSurveys } from "./api-CQX857SN.js";
import { t as Button } from "./button-Bq5vK6RO.js";
import { t as Card } from "./card-CzXpCsbD.js";
import { t as Badge } from "./badge-D1Dupn2y.js";
import { t as Skeleton } from "./skeleton-D9W9wFsj.js";
import { t as PageHeader } from "./PageHeader-B7gZRr0G.js";
import { t as Progress } from "./progress-DOIEKRJF.js";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useQuery } from "@tanstack/react-query";
import { BarChart3, Download, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
//#region src/routes/_app.surveys.analytics.tsx?tsr-split=component
function SurveyAnalytics() {
	const { data: stats, isLoading: statsLoading } = useQuery({
		queryKey: ["survey-stats-analytics"],
		queryFn: fetchSurveyStats,
		staleTime: 6e4
	});
	const { data: surveysData, isLoading } = useQuery({
		queryKey: ["surveys-analytics"],
		queryFn: () => fetchSurveys({ per_page: 50 }),
		staleTime: 6e4
	});
	const surveys = surveysData?.data ?? [];
	const maxR = Math.max(...surveys.map((s) => Number(s.total_responses ?? 0)), 1);
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(PageHeader, {
		title: "Survey Analytics Center",
		description: "Executive-grade analytics across every active survey and field volunteer.",
		actions: /* @__PURE__ */ jsxs(Button, {
			variant: "outline",
			size: "sm",
			className: "gap-1.5",
			children: [/* @__PURE__ */ jsx(Download, { className: "h-4 w-4" }), " Export PDF"]
		})
	}), /* @__PURE__ */ jsxs("div", {
		className: "space-y-4 p-4 md:p-8",
		children: [
			/* @__PURE__ */ jsx("div", {
				className: "grid gap-3 sm:grid-cols-4",
				children: [
					{
						l: "Total Surveys",
						v: stats?.total ?? 0
					},
					{
						l: "Active",
						v: stats?.active ?? 0
					},
					{
						l: "Total Responses",
						v: stats?.total_responses ?? 0
					},
					{
						l: "This Month",
						v: stats?.this_month ?? 0
					}
				].map((s, i) => /* @__PURE__ */ jsx(motion.div, {
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
						className: "p-4 text-center",
						children: [/* @__PURE__ */ jsx("div", {
							className: "text-[11px] uppercase tracking-wider text-muted-foreground",
							children: s.l
						}), /* @__PURE__ */ jsx("div", {
							className: "mt-1 font-display text-2xl font-bold tabular-nums",
							children: s.v.toLocaleString("en-IN")
						})]
					})
				}, s.l))
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "grid gap-4 xl:grid-cols-3",
				children: [/* @__PURE__ */ jsxs(Card, {
					className: "p-5 xl:col-span-2",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "mb-4 flex items-center justify-between",
							children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("h3", {
								className: "font-display text-base font-bold flex items-center gap-2",
								children: [/* @__PURE__ */ jsx(TrendingUp, { className: "h-4 w-4 text-primary" }), " Response Count by Survey"]
							}), /* @__PURE__ */ jsx("p", {
								className: "text-xs text-muted-foreground",
								children: "All surveys — response distribution"
							})] }), /* @__PURE__ */ jsx(Badge, {
								variant: "secondary",
								className: "bg-success/10 text-success",
								children: "Live data"
							})]
						}),
						isLoading ? /* @__PURE__ */ jsx(Skeleton, { className: "h-52" }) : /* @__PURE__ */ jsx("div", {
							className: "flex h-52 items-end gap-2",
							children: surveys.slice(0, 12).map((s, i) => {
								const v = Number(s.total_responses ?? 0);
								const h = maxR > 0 ? Math.max(4, Math.round(v / maxR * 180)) : 4;
								return /* @__PURE__ */ jsx(motion.div, {
									initial: { height: 0 },
									animate: { height: `${h}px` },
									transition: {
										duration: .6,
										delay: i * .04
									},
									className: "flex-1 rounded-t bg-gradient-to-t from-primary/80 to-primary/30 cursor-pointer hover:opacity-80",
									title: `${String(s.title ?? "")}: ${v} responses`
								}, String(s.id));
							})
						}),
						/* @__PURE__ */ jsx("div", {
							className: "mt-2 flex justify-between text-[10px] text-muted-foreground overflow-hidden",
							children: surveys.slice(0, 12).map((s) => /* @__PURE__ */ jsx("span", {
								className: "flex-1 truncate text-center",
								children: String(s.title ?? "").substring(0, 6)
							}, String(s.id)))
						})
					]
				}), /* @__PURE__ */ jsxs(Card, {
					className: "p-5",
					children: [/* @__PURE__ */ jsxs("h3", {
						className: "font-display text-base font-bold flex items-center gap-2",
						children: [/* @__PURE__ */ jsx(BarChart3, { className: "h-4 w-4 text-primary" }), " Surveys by Status"]
					}), /* @__PURE__ */ jsx("div", {
						className: "mt-4 space-y-3",
						children: [
							{
								l: "Active",
								v: stats?.active ?? 0,
								pct: stats?.total ? Math.round((stats?.active ?? 0) / stats.total * 100) : 0,
								tone: "bg-success"
							},
							{
								l: "Draft",
								v: stats?.draft ?? 0,
								pct: stats?.total ? Math.round((stats?.draft ?? 0) / stats.total * 100) : 0,
								tone: "bg-warning"
							},
							{
								l: "Closed",
								v: stats?.total ? stats.total - (stats?.active ?? 0) - (stats?.draft ?? 0) : 0,
								pct: stats?.total ? Math.round((stats.total - (stats?.active ?? 0) - (stats?.draft ?? 0)) / stats.total * 100) : 0,
								tone: "bg-muted-foreground"
							}
						].map((c) => /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
							className: "flex justify-between text-xs",
							children: [/* @__PURE__ */ jsx("span", { children: c.l }), /* @__PURE__ */ jsxs("span", {
								className: "font-semibold tabular-nums",
								children: [
									c.v,
									" (",
									c.pct,
									"%)"
								]
							})]
						}), /* @__PURE__ */ jsx(Progress, {
							value: c.pct,
							className: "mt-1 h-1.5"
						})] }, c.l))
					})]
				})]
			}),
			/* @__PURE__ */ jsxs(Card, {
				className: "p-5",
				children: [/* @__PURE__ */ jsx("h3", {
					className: "font-display text-base font-bold",
					children: "Survey Details — Response Progress"
				}), /* @__PURE__ */ jsx("div", {
					className: "mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3",
					children: surveys.slice(0, 9).map((s, i) => {
						const resp = Number(s.total_responses ?? 0);
						const target = Number(s.target_responses ?? 100);
						const pct = target > 0 ? Math.min(100, Math.round(resp / target * 100)) : 0;
						return /* @__PURE__ */ jsx(motion.div, {
							initial: {
								opacity: 0,
								y: 6
							},
							animate: {
								opacity: 1,
								y: 0
							},
							transition: { delay: i * .04 },
							children: /* @__PURE__ */ jsxs(Card, {
								className: "p-3",
								children: [
									/* @__PURE__ */ jsx(Badge, {
										variant: "outline",
										className: "text-[10px]",
										children: String(s.category ?? "General")
									}),
									/* @__PURE__ */ jsx("div", {
										className: "mt-2 text-sm font-semibold line-clamp-2",
										children: String(s.title ?? "")
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "mt-2 flex items-end justify-between",
										children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
											className: "text-[10px] uppercase text-muted-foreground",
											children: "Responses"
										}), /* @__PURE__ */ jsx("div", {
											className: "font-display text-lg font-bold tabular-nums",
											children: resp.toLocaleString("en-IN")
										})] }), /* @__PURE__ */ jsxs("div", {
											className: "text-right",
											children: [/* @__PURE__ */ jsx("div", {
												className: "text-[10px] uppercase text-muted-foreground",
												children: "Done"
											}), /* @__PURE__ */ jsxs("div", {
												className: "font-display text-lg font-bold text-primary tabular-nums",
												children: [pct, "%"]
											})]
										})]
									}),
									/* @__PURE__ */ jsx(Progress, {
										value: pct,
										className: "mt-2 h-1.5"
									})
								]
							})
						}, String(s.id));
					})
				})]
			})
		]
	})] });
}
//#endregion
export { SurveyAnalytics as component };

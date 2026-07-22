import { t as cn } from "./utils-C_uf36nf.js";
import { t as Card } from "./card-CzXpCsbD.js";
import { t as Badge } from "./badge-D1Dupn2y.js";
import { t as PageHeader } from "./PageHeader-B7gZRr0G.js";
import { f as departmentPerformance, k as schemes } from "./live-data-6hUqpYkS.js";
import { t as Progress } from "./progress-DOIEKRJF.js";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { Building2, CheckCircle2, Clock, Trophy, XCircle } from "lucide-react";
import { motion } from "framer-motion";
//#region src/routes/_app.schemes.performance.tsx?tsr-split=component
var overall = [
	{
		l: "Approval Rate",
		v: "82%",
		icon: CheckCircle2,
		tone: "bg-success/10 text-success"
	},
	{
		l: "Rejection Rate",
		v: "7%",
		icon: XCircle,
		tone: "bg-destructive/10 text-destructive"
	},
	{
		l: "Avg Processing",
		v: "11 days",
		icon: Clock,
		tone: "bg-warning/15 text-warning"
	},
	{
		l: "Benefit Distributed",
		v: "₹482 Cr",
		icon: Trophy,
		tone: "bg-primary/10 text-primary"
	}
];
function PerformancePage() {
	const ranked = [...departmentPerformance].sort((a, b) => b.slaCompliance - a.slaCompliance);
	const topSchemes = [...schemes].sort((a, b) => b.beneficiaries - a.beneficiaries).slice(0, 6);
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(PageHeader, {
		title: "Scheme Performance Center",
		description: "Approval, rejection, processing time and department efficiency across all welfare schemes."
	}), /* @__PURE__ */ jsxs("div", {
		className: "space-y-6 p-4 md:p-8",
		children: [
			/* @__PURE__ */ jsx("div", {
				className: "grid grid-cols-2 gap-3 md:grid-cols-4",
				children: overall.map((k, i) => /* @__PURE__ */ jsx(motion.div, {
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
								className: cn("inline-grid h-9 w-9 place-items-center rounded-lg", k.tone),
								children: /* @__PURE__ */ jsx(k.icon, { className: "h-4 w-4" })
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
					})
				}, k.l))
			}),
			/* @__PURE__ */ jsxs(Card, {
				className: "p-5",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ jsxs("h3", {
						className: "font-display text-base font-bold inline-flex items-center gap-2",
						children: [/* @__PURE__ */ jsx(Building2, { className: "h-4 w-4" }), " Department Rankings"]
					}), /* @__PURE__ */ jsx(Badge, {
						variant: "secondary",
						className: "bg-success/10 text-success",
						children: "By SLA Compliance"
					})]
				}), /* @__PURE__ */ jsx("div", {
					className: "mt-4 overflow-x-auto",
					children: /* @__PURE__ */ jsxs("table", {
						className: "w-full text-sm",
						children: [/* @__PURE__ */ jsx("thead", {
							className: "text-xs uppercase text-muted-foreground",
							children: /* @__PURE__ */ jsxs("tr", { children: [
								/* @__PURE__ */ jsx("th", {
									className: "p-2 text-left",
									children: "Rank"
								}),
								/* @__PURE__ */ jsx("th", {
									className: "p-2 text-left",
									children: "Department"
								}),
								/* @__PURE__ */ jsx("th", {
									className: "p-2 text-right",
									children: "Applications"
								}),
								/* @__PURE__ */ jsx("th", {
									className: "p-2 text-right",
									children: "Approval %"
								}),
								/* @__PURE__ */ jsx("th", {
									className: "p-2 text-right",
									children: "Avg Days"
								}),
								/* @__PURE__ */ jsx("th", {
									className: "p-2 text-right",
									children: "SLA"
								}),
								/* @__PURE__ */ jsx("th", {
									className: "p-2 text-left",
									children: "Status"
								})
							] })
						}), /* @__PURE__ */ jsx("tbody", { children: ranked.map((d, i) => /* @__PURE__ */ jsxs("tr", {
							className: "border-t border-border/40",
							children: [
								/* @__PURE__ */ jsx("td", {
									className: "p-2",
									children: /* @__PURE__ */ jsx("div", {
										className: cn("grid h-7 w-7 place-items-center rounded-full font-bold text-xs", i === 0 ? "bg-warning/20 text-warning" : i === 1 ? "bg-muted text-foreground" : i === 2 ? "bg-orange-500/15 text-orange-600" : "bg-muted/40 text-muted-foreground"),
										children: i + 1
									})
								}),
								/* @__PURE__ */ jsx("td", {
									className: "p-2 font-medium",
									children: d.name
								}),
								/* @__PURE__ */ jsx("td", {
									className: "p-2 text-right tabular-nums",
									children: d.applications.toLocaleString()
								}),
								/* @__PURE__ */ jsxs("td", {
									className: "p-2 text-right tabular-nums font-semibold text-success",
									children: [d.approvalRate, "%"]
								}),
								/* @__PURE__ */ jsx("td", {
									className: "p-2 text-right tabular-nums",
									children: d.avgDays
								}),
								/* @__PURE__ */ jsx("td", {
									className: "p-2 text-right",
									children: /* @__PURE__ */ jsxs("div", {
										className: "flex items-center justify-end gap-2",
										children: [/* @__PURE__ */ jsx(Progress, {
											value: d.slaCompliance,
											className: "h-1.5 w-20"
										}), /* @__PURE__ */ jsxs("span", {
											className: "tabular-nums font-semibold",
											children: [d.slaCompliance, "%"]
										})]
									})
								}),
								/* @__PURE__ */ jsx("td", {
									className: "p-2",
									children: /* @__PURE__ */ jsx(Badge, {
										variant: "secondary",
										className: cn("text-[10px]", d.slaCompliance >= 90 ? "bg-success/10 text-success" : d.slaCompliance >= 80 ? "bg-info/10 text-info" : d.slaCompliance >= 70 ? "bg-warning/15 text-warning" : "bg-destructive/10 text-destructive"),
										children: d.slaCompliance >= 90 ? "Excellent" : d.slaCompliance >= 80 ? "Good" : d.slaCompliance >= 70 ? "Average" : "Needs Attention"
									})
								})
							]
						}, d.name)) })]
					})
				})]
			}),
			/* @__PURE__ */ jsxs(Card, {
				className: "p-5",
				children: [/* @__PURE__ */ jsxs("h3", {
					className: "font-display text-base font-bold inline-flex items-center gap-2",
					children: [/* @__PURE__ */ jsx(Trophy, { className: "h-4 w-4 text-warning" }), " Top-Performing Schemes"]
				}), /* @__PURE__ */ jsx("div", {
					className: "mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-3",
					children: topSchemes.map((s, i) => /* @__PURE__ */ jsxs(motion.div, {
						initial: {
							opacity: 0,
							y: 8
						},
						animate: {
							opacity: 1,
							y: 0
						},
						transition: { delay: i * .06 },
						className: "rounded-lg border border-border/70 p-4",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ jsx("div", {
								className: "grid h-10 w-10 place-items-center rounded-lg bg-muted text-xl",
								children: s.icon
							}), /* @__PURE__ */ jsxs("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ jsx("div", {
									className: "truncate font-semibold",
									children: s.name
								}), /* @__PURE__ */ jsx("div", {
									className: "text-[10px] text-muted-foreground",
									children: s.department
								})]
							})]
						}), /* @__PURE__ */ jsxs("div", {
							className: "mt-3 grid grid-cols-2 gap-2 text-xs",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "rounded bg-muted/40 p-2",
								children: [/* @__PURE__ */ jsx("div", {
									className: "text-muted-foreground",
									children: "Beneficiaries"
								}), /* @__PURE__ */ jsx("div", {
									className: "font-bold tabular-nums",
									children: s.beneficiaries.toLocaleString()
								})]
							}), /* @__PURE__ */ jsxs("div", {
								className: "rounded bg-muted/40 p-2",
								children: [/* @__PURE__ */ jsx("div", {
									className: "text-muted-foreground",
									children: "Growth"
								}), /* @__PURE__ */ jsxs("div", {
									className: "font-bold tabular-nums text-success",
									children: [
										"+",
										s.growthPct,
										"%"
									]
								})]
							})]
						})]
					}, s.id))
				})]
			})
		]
	})] });
}
//#endregion
export { PerformancePage as component };

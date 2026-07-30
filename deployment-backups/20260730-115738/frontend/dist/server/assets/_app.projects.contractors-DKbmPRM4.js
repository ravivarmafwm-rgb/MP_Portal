import { t as cn } from "./utils-C_uf36nf.js";
import { t as Button } from "./button-Bq5vK6RO.js";
import { t as Card } from "./card-CzXpCsbD.js";
import { t as AnimatedNumber } from "./AnimatedNumber-DX8kBKDO.js";
import { t as Badge } from "./badge-D1Dupn2y.js";
import { t as PageHeader } from "./PageHeader-B7gZRr0G.js";
import { t as Input } from "./input-B8Q2ztVi.js";
import { t as Progress } from "./progress-DOIEKRJF.js";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { AlertTriangle, Building2, Download, Plus, Search, ShieldCheck, Users } from "lucide-react";
import { motion } from "framer-motion";
//#region src/routes/_app.projects.contractors.tsx?tsr-split=component
var contractorsData = [
	{
		id: "C001",
		name: "Sri Venkateshwara Constructions",
		projectsAssigned: 12,
		completed: 10,
		performanceScore: 88,
		budgetHandled: 48,
		risk: "Low",
		empanelledSince: "2022"
	},
	{
		id: "C002",
		name: "Jaya Bharat Infrastructure",
		projectsAssigned: 10,
		completed: 8,
		performanceScore: 82,
		budgetHandled: 36,
		risk: "Low",
		empanelledSince: "2022"
	},
	{
		id: "C003",
		name: "Telangana Road Works Ltd",
		projectsAssigned: 8,
		completed: 6,
		performanceScore: 76,
		budgetHandled: 28,
		risk: "Medium",
		empanelledSince: "2023"
	},
	{
		id: "C004",
		name: "Vasavi Builders & Developers",
		projectsAssigned: 6,
		completed: 4,
		performanceScore: 70,
		budgetHandled: 20,
		risk: "Medium",
		empanelledSince: "2023"
	},
	{
		id: "C005",
		name: "Sri Sai Engineering Works",
		projectsAssigned: 4,
		completed: 2,
		performanceScore: 64,
		budgetHandled: 12,
		risk: "High",
		empanelledSince: "2024"
	}
];
var kpis = [
	{
		l: "Total Contractors",
		v: contractorsData.length,
		icon: Building2,
		tone: "bg-primary/10 text-primary"
	},
	{
		l: "Active",
		v: 4,
		icon: Users,
		tone: "bg-info/10 text-info"
	},
	{
		l: "High Performing",
		v: 2,
		icon: ShieldCheck,
		tone: "bg-success/10 text-success"
	},
	{
		l: "Delayed / Risk",
		v: 1,
		icon: AlertTriangle,
		tone: "bg-destructive/10 text-destructive"
	}
];
var riskTone = {
	Low: "bg-success/10 text-success",
	Medium: "bg-warning/15 text-warning",
	High: "bg-destructive/10 text-destructive"
};
function ContractorsPage() {
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(PageHeader, {
		title: "Contractor Management",
		description: "Empanelled contractors, performance ratings and risk intelligence.",
		actions: /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsxs(Button, {
			variant: "outline",
			size: "sm",
			className: "gap-1.5",
			children: [/* @__PURE__ */ jsx(Download, { className: "h-4 w-4" }), " Export"]
		}), /* @__PURE__ */ jsxs(Button, {
			size: "sm",
			className: "gap-1.5",
			children: [/* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }), " Empanel Contractor"]
		})] })
	}), /* @__PURE__ */ jsxs("div", {
		className: "space-y-6 p-4 md:p-8",
		children: [/* @__PURE__ */ jsx("div", {
			className: "grid grid-cols-2 gap-3 md:grid-cols-4",
			children: kpis.map((k, i) => /* @__PURE__ */ jsx(motion.div, {
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
							children: /* @__PURE__ */ jsx(AnimatedNumber, { value: k.v })
						})
					]
				})
			}, k.l))
		}), /* @__PURE__ */ jsxs(Card, {
			className: "overflow-hidden",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "flex flex-wrap items-center gap-2 border-b border-border/70 bg-muted/30 p-3",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "relative flex-1 min-w-[200px]",
					children: [/* @__PURE__ */ jsx(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ jsx(Input, {
						placeholder: "Search contractors…",
						className: "h-9 bg-background pl-9"
					})]
				}), /* @__PURE__ */ jsx(Button, {
					variant: "outline",
					size: "sm",
					children: "All Risk"
				})]
			}), /* @__PURE__ */ jsxs("table", {
				className: "w-full text-sm",
				children: [/* @__PURE__ */ jsx("thead", {
					className: "bg-muted/30 text-[11px] uppercase tracking-wider text-muted-foreground",
					children: /* @__PURE__ */ jsxs("tr", { children: [
						/* @__PURE__ */ jsx("th", {
							className: "px-4 py-3 text-left",
							children: "Contractor"
						}),
						/* @__PURE__ */ jsx("th", {
							className: "px-4 py-3 text-left",
							children: "Assigned"
						}),
						/* @__PURE__ */ jsx("th", {
							className: "px-4 py-3 text-left",
							children: "Completion Rate"
						}),
						/* @__PURE__ */ jsx("th", {
							className: "px-4 py-3 text-left",
							children: "Performance"
						}),
						/* @__PURE__ */ jsx("th", {
							className: "px-4 py-3 text-left",
							children: "Budget"
						}),
						/* @__PURE__ */ jsx("th", {
							className: "px-4 py-3 text-left",
							children: "Risk"
						})
					] })
				}), /* @__PURE__ */ jsx("tbody", { children: contractorsData.map((c, i) => /* @__PURE__ */ jsxs(motion.tr, {
					initial: { opacity: 0 },
					animate: { opacity: 1 },
					transition: { delay: i * .03 },
					className: "border-t border-border/60 hover:bg-muted/30",
					children: [
						/* @__PURE__ */ jsx("td", {
							className: "px-4 py-3",
							children: /* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-3",
								children: [/* @__PURE__ */ jsx("div", {
									className: "grid h-9 w-9 place-items-center rounded-lg bg-primary/10 text-primary",
									children: /* @__PURE__ */ jsx(Building2, { className: "h-4 w-4" })
								}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
									className: "font-semibold",
									children: c.name
								}), /* @__PURE__ */ jsxs("div", {
									className: "text-[11px] text-muted-foreground",
									children: [
										c.id,
										" · since ",
										c.empanelledSince
									]
								})] })]
							})
						}),
						/* @__PURE__ */ jsxs("td", {
							className: "px-4 py-3 tabular-nums",
							children: [
								c.projectsAssigned,
								" ",
								/* @__PURE__ */ jsxs("span", {
									className: "text-[11px] text-muted-foreground",
									children: [
										"/ ",
										c.completed,
										" done"
									]
								})
							]
						}),
						/* @__PURE__ */ jsx("td", {
							className: "px-4 py-3",
							children: /* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ jsx(Progress, {
									value: c.performanceScore,
									className: "h-1.5 w-24"
								}), /* @__PURE__ */ jsxs("span", {
									className: "tabular-nums text-xs font-semibold",
									children: [c.performanceScore, "%"]
								})]
							})
						}),
						/* @__PURE__ */ jsx("td", {
							className: "px-4 py-3",
							children: /* @__PURE__ */ jsxs(Badge, {
								variant: "secondary",
								className: cn(c.performanceScore >= 80 ? "bg-success/10 text-success" : c.performanceScore >= 65 ? "bg-warning/15 text-warning" : "bg-destructive/10 text-destructive"),
								children: [c.performanceScore, "/100"]
							})
						}),
						/* @__PURE__ */ jsxs("td", {
							className: "px-4 py-3 tabular-nums",
							children: [
								"₹",
								c.budgetHandled,
								"Cr"
							]
						}),
						/* @__PURE__ */ jsx("td", {
							className: "px-4 py-3",
							children: /* @__PURE__ */ jsx(Badge, {
								variant: "secondary",
								className: riskTone[c.risk],
								children: c.risk
							})
						})
					]
				}, c.id)) })]
			})]
		})]
	})] });
}
//#endregion
export { ContractorsPage as component };

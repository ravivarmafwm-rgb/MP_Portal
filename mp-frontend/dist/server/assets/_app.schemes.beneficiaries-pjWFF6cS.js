import { t as cn } from "./utils-C_uf36nf.js";
import { t as Button } from "./button-Bq5vK6RO.js";
import { t as Card } from "./card-CzXpCsbD.js";
import { t as PageHeader } from "./PageHeader-B7gZRr0G.js";
import { I as villageCoverage, k as schemes, o as assemblyCoverage } from "./live-data-6hUqpYkS.js";
import { t as Progress } from "./progress-DOIEKRJF.js";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { Download, IndianRupee, MapPin, Plus, UserPlus, Users } from "lucide-react";
import { motion } from "framer-motion";
//#region src/routes/_app.schemes.beneficiaries.tsx?tsr-split=component
var kpis = [
	{
		l: "Total Beneficiaries",
		v: "21,530",
		icon: Users,
		tone: "bg-primary/10 text-primary"
	},
	{
		l: "New This Month",
		v: "1,284",
		icon: UserPlus,
		tone: "bg-success/10 text-success"
	},
	{
		l: "Benefits Distributed",
		v: "₹482 Cr",
		icon: IndianRupee,
		tone: "bg-info/10 text-info"
	},
	{
		l: "Villages Covered",
		v: "286 / 312",
		icon: MapPin,
		tone: "bg-warning/15 text-warning"
	}
];
var categoryDist = [
	{
		name: "General",
		value: 6240
	},
	{
		name: "OBC",
		value: 8420
	},
	{
		name: "SC",
		value: 4680
	},
	{
		name: "ST",
		value: 2190
	}
];
var total = categoryDist.reduce((s, c) => s + c.value, 0);
function BeneficiariesPage() {
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(PageHeader, {
		title: "Beneficiary Intelligence Center",
		description: "21,530 beneficiaries · 12 schemes · 286 villages — analytics & welfare distribution.",
		actions: /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsxs(Button, {
			variant: "outline",
			size: "sm",
			className: "gap-1.5",
			children: [/* @__PURE__ */ jsx(Download, { className: "h-4 w-4" }), " Export"]
		}), /* @__PURE__ */ jsxs(Button, {
			size: "sm",
			className: "gap-1.5",
			children: [/* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }), " Add Beneficiary"]
		})] })
	}), /* @__PURE__ */ jsxs("div", {
		className: "space-y-6 p-4 md:p-8",
		children: [
			/* @__PURE__ */ jsx("div", {
				className: "grid grid-cols-2 gap-3 md:grid-cols-4",
				children: kpis.map((k, i) => /* @__PURE__ */ jsx(motion.div, {
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
			/* @__PURE__ */ jsxs("div", {
				className: "grid gap-4 xl:grid-cols-2",
				children: [/* @__PURE__ */ jsxs(Card, {
					className: "p-5",
					children: [/* @__PURE__ */ jsx("h3", {
						className: "font-display text-base font-bold",
						children: "Beneficiaries by Scheme"
					}), /* @__PURE__ */ jsx("div", {
						className: "mt-4 space-y-3",
						children: [...schemes].sort((a, b) => b.beneficiaries - a.beneficiaries).slice(0, 8).map((s) => /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-center justify-between text-xs",
							children: [/* @__PURE__ */ jsxs("span", {
								className: "inline-flex items-center gap-2 font-medium",
								children: [
									s.icon,
									" ",
									s.name
								]
							}), /* @__PURE__ */ jsx("span", {
								className: "tabular-nums text-muted-foreground",
								children: s.beneficiaries.toLocaleString()
							})]
						}), /* @__PURE__ */ jsx(Progress, {
							value: s.beneficiaries / 3700 * 100,
							className: "mt-1 h-1.5"
						})] }, s.id))
					})]
				}), /* @__PURE__ */ jsxs(Card, {
					className: "p-5",
					children: [/* @__PURE__ */ jsx("h3", {
						className: "font-display text-base font-bold",
						children: "By Category"
					}), /* @__PURE__ */ jsx("div", {
						className: "mt-6 flex items-end justify-around gap-3 h-44",
						children: categoryDist.map((c, i) => /* @__PURE__ */ jsxs(motion.div, {
							initial: { height: 0 },
							animate: { height: "auto" },
							transition: { delay: i * .1 },
							className: "flex w-full flex-col items-center gap-2",
							children: [
								/* @__PURE__ */ jsx("div", {
									className: "text-xs font-semibold tabular-nums",
									children: c.value.toLocaleString()
								}),
								/* @__PURE__ */ jsx("div", {
									className: "w-full rounded-t-lg bg-gradient-to-t from-primary to-primary/40",
									style: { height: `${c.value / total * 160}px` }
								}),
								/* @__PURE__ */ jsx("div", {
									className: "text-[10px] text-muted-foreground",
									children: c.name
								})
							]
						}, c.name))
					})]
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "grid gap-4 xl:grid-cols-2",
				children: [/* @__PURE__ */ jsxs(Card, {
					className: "p-5",
					children: [/* @__PURE__ */ jsx("h3", {
						className: "font-display text-base font-bold",
						children: "Top Villages"
					}), /* @__PURE__ */ jsx("div", {
						className: "mt-3 space-y-2",
						children: [...villageCoverage].sort((a, b) => b.beneficiaries - a.beneficiaries).slice(0, 6).map((v) => /* @__PURE__ */ jsxs("div", {
							className: "flex items-center justify-between rounded-md bg-muted/40 p-2.5",
							children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
								className: "text-sm font-semibold",
								children: v.village
							}), /* @__PURE__ */ jsx("div", {
								className: "text-[10px] text-muted-foreground",
								children: v.mandal
							})] }), /* @__PURE__ */ jsxs("div", {
								className: "text-right",
								children: [/* @__PURE__ */ jsx("div", {
									className: "font-display text-base font-bold tabular-nums",
									children: v.beneficiaries.toLocaleString()
								}), /* @__PURE__ */ jsxs("div", {
									className: "text-[10px] text-muted-foreground",
									children: [v.coverage, "% coverage"]
								})]
							})]
						}, v.village))
					})]
				}), /* @__PURE__ */ jsxs(Card, {
					className: "p-5",
					children: [/* @__PURE__ */ jsx("h3", {
						className: "font-display text-base font-bold",
						children: "By Assembly"
					}), /* @__PURE__ */ jsx("div", {
						className: "mt-3 space-y-3",
						children: assemblyCoverage.map((a) => /* @__PURE__ */ jsxs("div", { children: [
							/* @__PURE__ */ jsxs("div", {
								className: "flex items-center justify-between text-xs",
								children: [/* @__PURE__ */ jsx("span", {
									className: "font-medium",
									children: a.assembly
								}), /* @__PURE__ */ jsxs("span", {
									className: "tabular-nums text-muted-foreground",
									children: [
										a.beneficiaries.toLocaleString(),
										" / ",
										a.population.toLocaleString()
									]
								})]
							}),
							/* @__PURE__ */ jsx(Progress, {
								value: a.coverage,
								className: "mt-1 h-2"
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "mt-0.5 text-right text-[10px] text-muted-foreground",
								children: [a.coverage, "% coverage"]
							})
						] }, a.assembly))
					})]
				})]
			})
		]
	})] });
}
//#endregion
export { BeneficiariesPage as component };

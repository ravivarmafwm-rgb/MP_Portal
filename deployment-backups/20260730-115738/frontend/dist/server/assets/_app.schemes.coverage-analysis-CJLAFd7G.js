import { t as cn } from "./utils-C_uf36nf.js";
import { t as Card } from "./card-CzXpCsbD.js";
import { t as Badge } from "./badge-D1Dupn2y.js";
import { t as PageHeader } from "./PageHeader-B7gZRr0G.js";
import { I as villageCoverage, o as assemblyCoverage } from "./live-data-6hUqpYkS.js";
import { t as Progress } from "./progress-DOIEKRJF.js";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { AlertTriangle, Flame, MapPin, TrendingDown } from "lucide-react";
import { motion } from "framer-motion";
//#region src/routes/_app.schemes.coverage-analysis.tsx?tsr-split=component
var statusTone = {
	Excellent: "bg-success/10 text-success",
	Good: "bg-info/10 text-info",
	Average: "bg-warning/15 text-warning",
	Low: "bg-destructive/10 text-destructive"
};
function CoveragePage() {
	const sorted = [...villageCoverage].sort((a, b) => a.coverage - b.coverage);
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(PageHeader, {
		title: "Coverage Analysis",
		description: "Geographic welfare coverage across 312 villages, 24 mandals and 4 assemblies."
	}), /* @__PURE__ */ jsxs("div", {
		className: "space-y-6 p-4 md:p-8",
		children: [
			/* @__PURE__ */ jsxs(Card, {
				className: "p-5",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", {
							className: "font-display text-base font-bold",
							children: "Constituency Welfare Heatmap"
						}), /* @__PURE__ */ jsx("p", {
							className: "text-xs text-muted-foreground",
							children: "Coverage density & welfare gaps"
						})] }), /* @__PURE__ */ jsx(Badge, {
							variant: "secondary",
							className: "bg-info/10 text-info",
							children: "GIS Preview"
						})]
					}),
					/* @__PURE__ */ jsx("div", {
						className: "mt-4 grid h-80 place-items-center rounded-xl border border-dashed border-border/70 bg-[radial-gradient(circle_at_25%_30%,hsl(var(--success)/0.18),transparent_55%),radial-gradient(circle_at_70%_40%,hsl(var(--warning)/0.2),transparent_50%),radial-gradient(circle_at_50%_75%,hsl(var(--destructive)/0.18),transparent_45%),radial-gradient(circle_at_85%_75%,hsl(var(--primary)/0.15),transparent_45%)]",
						children: /* @__PURE__ */ jsxs("div", {
							className: "text-center",
							children: [
								/* @__PURE__ */ jsx(MapPin, { className: "mx-auto h-10 w-10 text-primary" }),
								/* @__PURE__ */ jsx("div", {
									className: "mt-2 text-sm font-semibold",
									children: "312 villages mapped"
								}),
								/* @__PURE__ */ jsx("div", {
									className: "text-xs text-muted-foreground",
									children: "Green = strong coverage · Red = underserved"
								})
							]
						})
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "mt-4 grid grid-cols-2 gap-2 md:grid-cols-4 text-xs",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ jsx("span", { className: "h-3 w-3 rounded-sm bg-success/40" }), " Excellent (85%+)"]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ jsx("span", { className: "h-3 w-3 rounded-sm bg-info/40" }), " Good (75-84%)"]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ jsx("span", { className: "h-3 w-3 rounded-sm bg-warning/40" }), " Average (60-74%)"]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ jsx("span", { className: "h-3 w-3 rounded-sm bg-destructive/40" }), " Low (<60%)"]
							})
						]
					})
				]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "grid gap-4 xl:grid-cols-2",
				children: [/* @__PURE__ */ jsxs(Card, {
					className: "p-5",
					children: [/* @__PURE__ */ jsx("h3", {
						className: "font-display text-base font-bold",
						children: "Assembly Coverage"
					}), /* @__PURE__ */ jsx("div", {
						className: "mt-4 space-y-3",
						children: assemblyCoverage.map((a, i) => /* @__PURE__ */ jsxs(motion.div, {
							initial: {
								opacity: 0,
								x: -8
							},
							animate: {
								opacity: 1,
								x: 0
							},
							transition: { delay: i * .08 },
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "flex items-center justify-between text-sm",
									children: [/* @__PURE__ */ jsx("span", {
										className: "font-semibold",
										children: a.assembly
									}), /* @__PURE__ */ jsxs("span", {
										className: "tabular-nums text-xs text-muted-foreground",
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
									className: "mt-0.5 text-right text-[10px] tabular-nums",
									children: [a.coverage, "%"]
								})
							]
						}, a.assembly))
					})]
				}), /* @__PURE__ */ jsxs(Card, {
					className: "p-5",
					children: [
						/* @__PURE__ */ jsxs("h3", {
							className: "font-display text-base font-bold inline-flex items-center gap-2",
							children: [/* @__PURE__ */ jsx(AlertTriangle, { className: "h-4 w-4 text-destructive" }), " Underserved Areas"]
						}),
						/* @__PURE__ */ jsx("p", {
							className: "text-xs text-muted-foreground",
							children: "Priority villages with welfare gaps"
						}),
						/* @__PURE__ */ jsx("div", {
							className: "mt-3 space-y-2",
							children: sorted.slice(0, 5).map((v) => /* @__PURE__ */ jsxs("div", {
								className: "flex items-center justify-between rounded-md border border-destructive/20 bg-destructive/5 p-2.5",
								children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
									className: "text-sm font-semibold",
									children: v.village
								}), /* @__PURE__ */ jsxs("div", {
									className: "text-[10px] text-muted-foreground",
									children: [
										v.mandal,
										" · gap ",
										v.gap.toLocaleString()
									]
								})] }), /* @__PURE__ */ jsxs(Badge, {
									variant: "secondary",
									className: cn("text-[10px]", statusTone[v.status]),
									children: [v.coverage, "%"]
								})]
							}, v.village))
						})
					]
				})]
			}),
			/* @__PURE__ */ jsxs(Card, {
				className: "overflow-hidden p-0",
				children: [/* @__PURE__ */ jsx("div", {
					className: "border-b border-border/70 p-4",
					children: /* @__PURE__ */ jsx("h3", {
						className: "font-display text-base font-bold",
						children: "Village Coverage Detail"
					})
				}), /* @__PURE__ */ jsxs("table", {
					className: "w-full text-sm",
					children: [/* @__PURE__ */ jsx("thead", {
						className: "bg-muted/50 text-xs uppercase text-muted-foreground",
						children: /* @__PURE__ */ jsxs("tr", { children: [
							/* @__PURE__ */ jsx("th", {
								className: "p-3 text-left",
								children: "Village"
							}),
							/* @__PURE__ */ jsx("th", {
								className: "p-3 text-left",
								children: "Mandal"
							}),
							/* @__PURE__ */ jsx("th", {
								className: "p-3 text-right",
								children: "Population"
							}),
							/* @__PURE__ */ jsx("th", {
								className: "p-3 text-right",
								children: "Beneficiaries"
							}),
							/* @__PURE__ */ jsx("th", {
								className: "p-3 text-right",
								children: "Coverage"
							}),
							/* @__PURE__ */ jsx("th", {
								className: "p-3 text-right",
								children: "Gap"
							}),
							/* @__PURE__ */ jsx("th", {
								className: "p-3 text-left",
								children: "Status"
							})
						] })
					}), /* @__PURE__ */ jsx("tbody", { children: villageCoverage.map((v) => /* @__PURE__ */ jsxs("tr", {
						className: "border-t border-border/40 hover:bg-muted/30",
						children: [
							/* @__PURE__ */ jsx("td", {
								className: "p-3 font-medium",
								children: v.village
							}),
							/* @__PURE__ */ jsx("td", {
								className: "p-3 text-xs",
								children: v.mandal
							}),
							/* @__PURE__ */ jsx("td", {
								className: "p-3 text-right tabular-nums",
								children: v.population.toLocaleString()
							}),
							/* @__PURE__ */ jsx("td", {
								className: "p-3 text-right tabular-nums",
								children: v.beneficiaries.toLocaleString()
							}),
							/* @__PURE__ */ jsxs("td", {
								className: "p-3 text-right tabular-nums font-semibold",
								children: [v.coverage, "%"]
							}),
							/* @__PURE__ */ jsx("td", {
								className: "p-3 text-right tabular-nums text-destructive",
								children: v.gap.toLocaleString()
							}),
							/* @__PURE__ */ jsx("td", {
								className: "p-3",
								children: /* @__PURE__ */ jsx(Badge, {
									variant: "secondary",
									className: cn("text-[10px]", statusTone[v.status]),
									children: v.status
								})
							})
						]
					}, v.village)) })]
				})]
			}),
			/* @__PURE__ */ jsxs(Card, {
				className: "p-5",
				children: [
					/* @__PURE__ */ jsxs("h3", {
						className: "font-display text-base font-bold inline-flex items-center gap-2",
						children: [/* @__PURE__ */ jsx(Flame, { className: "h-4 w-4 text-warning" }), " High-Demand Hotspots"]
					}),
					/* @__PURE__ */ jsx("p", {
						className: "text-xs text-muted-foreground",
						children: "Villages with most pending applications"
					}),
					/* @__PURE__ */ jsx("div", {
						className: "mt-3 grid gap-2 md:grid-cols-3",
						children: [
							{
								v: "Miyapur",
								a: 412,
								p: "PMAY-G, MGNREGA"
							},
							{
								v: "Kukatpally",
								a: 386,
								p: "PM-Kisan, Ayushman"
							},
							{
								v: "Madhapur",
								a: 318,
								p: "Scholarships, PMAY-U"
							}
						].map((h) => /* @__PURE__ */ jsxs("div", {
							className: "rounded-lg border border-warning/20 bg-warning/5 p-3",
							children: [
								/* @__PURE__ */ jsx("div", {
									className: "text-sm font-bold",
									children: h.v
								}),
								/* @__PURE__ */ jsx("div", {
									className: "mt-1 text-xs text-muted-foreground",
									children: h.p
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "mt-2 inline-flex items-center gap-1.5 text-xs",
									children: [
										/* @__PURE__ */ jsx(TrendingDown, { className: "h-3 w-3 text-warning" }),
										" ",
										/* @__PURE__ */ jsx("span", {
											className: "font-semibold tabular-nums",
											children: h.a
										}),
										" pending applications"
									]
								})
							]
						}, h.v))
					})
				]
			})
		]
	})] });
}
//#endregion
export { CoveragePage as component };

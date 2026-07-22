import { t as cn } from "./utils-C_uf36nf.js";
import { t as Button } from "./button-Bq5vK6RO.js";
import { t as Card } from "./card-CzXpCsbD.js";
import { t as Badge } from "./badge-D1Dupn2y.js";
import { t as PageHeader } from "./PageHeader-B7gZRr0G.js";
import { h as eligibilityMatrix, r as aiSchemeAdvisor } from "./live-data-6hUqpYkS.js";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { AlertTriangle, BadgeCheck, FileWarning, Sparkles, XCircle } from "lucide-react";
import { motion } from "framer-motion";
//#region src/routes/_app.schemes.eligibility.tsx?tsr-split=component
var cellTone = {
	Eligible: "bg-success/10 text-success",
	Enrolled: "bg-primary/10 text-primary",
	"Docs Missing": "bg-warning/15 text-warning",
	"Not Eligible": "bg-muted text-muted-foreground"
};
var cellIcon = {
	Eligible: BadgeCheck,
	Enrolled: BadgeCheck,
	"Docs Missing": FileWarning,
	"Not Eligible": XCircle
};
var columns = [
	{
		key: "pmay",
		label: "PMAY",
		icon: "🏠"
	},
	{
		key: "pmKisan",
		label: "PM-Kisan",
		icon: "🌾"
	},
	{
		key: "ayushman",
		label: "Ayushman",
		icon: "🏥"
	},
	{
		key: "scholarship",
		label: "Scholarship",
		icon: "🎓"
	},
	{
		key: "pension",
		label: "Pension",
		icon: "👴"
	}
];
var summary = [
	{
		l: "Eligible (not enrolled)",
		v: 1284,
		icon: BadgeCheck,
		tone: "bg-success/10 text-success"
	},
	{
		l: "Already Enrolled",
		v: 18420,
		icon: BadgeCheck,
		tone: "bg-primary/10 text-primary"
	},
	{
		l: "Documents Missing",
		v: 642,
		icon: FileWarning,
		tone: "bg-warning/15 text-warning"
	},
	{
		l: "Verification Needed",
		v: 412,
		icon: AlertTriangle,
		tone: "bg-info/10 text-info"
	}
];
function EligibilityPage() {
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(PageHeader, {
		title: "Eligibility Engine",
		description: "AI-assisted matching of citizens to schemes they qualify for.",
		actions: /* @__PURE__ */ jsxs(Button, {
			size: "sm",
			className: "gap-1.5",
			children: [/* @__PURE__ */ jsx(Sparkles, { className: "h-4 w-4" }), " Run Eligibility Scan"]
		})
	}), /* @__PURE__ */ jsxs("div", {
		className: "space-y-6 p-4 md:p-8",
		children: [
			/* @__PURE__ */ jsx("div", {
				className: "grid grid-cols-2 gap-3 md:grid-cols-4",
				children: summary.map((s, i) => /* @__PURE__ */ jsx(motion.div, {
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
								className: cn("inline-grid h-9 w-9 place-items-center rounded-lg", s.tone),
								children: /* @__PURE__ */ jsx(s.icon, { className: "h-4 w-4" })
							}),
							/* @__PURE__ */ jsx("div", {
								className: "mt-3 text-[11px] uppercase tracking-wider text-muted-foreground",
								children: s.l
							}),
							/* @__PURE__ */ jsx("div", {
								className: "mt-1 font-display text-xl font-bold tabular-nums",
								children: s.v.toLocaleString()
							})
						]
					})
				}, s.l))
			}),
			/* @__PURE__ */ jsxs(Card, {
				className: "overflow-hidden p-0",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "border-b border-border/70 p-4",
					children: [/* @__PURE__ */ jsx("h3", {
						className: "font-display text-base font-bold",
						children: "Citizen Eligibility Matrix"
					}), /* @__PURE__ */ jsxs("p", {
						className: "text-xs text-muted-foreground",
						children: [
							"Live scoring · ",
							eligibilityMatrix.length,
							" citizens shown · ",
							eligibilityMatrix.length * 5,
							" eligibility checks"
						]
					})]
				}), /* @__PURE__ */ jsx("div", {
					className: "overflow-x-auto",
					children: /* @__PURE__ */ jsxs("table", {
						className: "w-full text-sm",
						children: [/* @__PURE__ */ jsx("thead", {
							className: "bg-muted/50 text-xs uppercase text-muted-foreground",
							children: /* @__PURE__ */ jsxs("tr", { children: [
								/* @__PURE__ */ jsx("th", {
									className: "p-3 text-left",
									children: "Citizen"
								}),
								/* @__PURE__ */ jsx("th", {
									className: "p-3 text-left",
									children: "Village"
								}),
								columns.map((c) => /* @__PURE__ */ jsxs("th", {
									className: "p-3 text-left whitespace-nowrap",
									children: [
										c.icon,
										" ",
										c.label
									]
								}, c.key))
							] })
						}), /* @__PURE__ */ jsx("tbody", { children: eligibilityMatrix.map((row) => /* @__PURE__ */ jsxs("tr", {
							className: "border-t border-border/40 hover:bg-muted/30",
							children: [
								/* @__PURE__ */ jsxs("td", {
									className: "p-3",
									children: [/* @__PURE__ */ jsx("div", {
										className: "font-medium",
										children: row.citizen
									}), /* @__PURE__ */ jsx("div", {
										className: "text-[10px] text-muted-foreground",
										children: row.citizenId
									})]
								}),
								/* @__PURE__ */ jsx("td", {
									className: "p-3 text-xs",
									children: row.village
								}),
								columns.map((c) => {
									const v = row[c.key];
									const Icon = cellIcon[v];
									return /* @__PURE__ */ jsx("td", {
										className: "p-3",
										children: /* @__PURE__ */ jsxs(Badge, {
											variant: "secondary",
											className: cn("text-[10px]", cellTone[v]),
											children: [/* @__PURE__ */ jsx(Icon, { className: "mr-0.5 inline h-3 w-3" }), v]
										})
									}, c.key);
								})
							]
						}, row.citizenId)) })]
					})
				})]
			}),
			/* @__PURE__ */ jsxs(Card, {
				className: "border-primary/20 bg-gradient-to-br from-primary/5 via-background to-background p-5",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-2",
					children: [
						/* @__PURE__ */ jsx(Sparkles, { className: "h-4 w-4 text-primary" }),
						/* @__PURE__ */ jsx("h3", {
							className: "font-display text-base font-bold",
							children: "AI Eligibility Recommendations"
						}),
						/* @__PURE__ */ jsx(Badge, {
							variant: "secondary",
							className: "bg-primary/10 text-[10px] text-primary",
							children: "Preview"
						})
					]
				}), /* @__PURE__ */ jsx("div", {
					className: "mt-4 grid gap-3 md:grid-cols-2",
					children: aiSchemeAdvisor.map((s, i) => /* @__PURE__ */ jsxs("div", {
						className: "rounded-lg border border-border/70 bg-card/50 p-3",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "text-xs font-semibold text-primary",
							children: [
								"\"",
								s.q,
								"\""
							]
						}), /* @__PURE__ */ jsxs("p", {
							className: "mt-1 text-xs text-muted-foreground",
							children: ["→ ", s.a]
						})]
					}, i))
				})]
			})
		]
	})] });
}
//#endregion
export { EligibilityPage as component };

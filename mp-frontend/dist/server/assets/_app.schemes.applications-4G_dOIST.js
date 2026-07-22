import { t as cn } from "./utils-C_uf36nf.js";
import { t as Button } from "./button-Bq5vK6RO.js";
import { t as Card } from "./card-CzXpCsbD.js";
import { t as Badge } from "./badge-D1Dupn2y.js";
import { t as PageHeader } from "./PageHeader-B7gZRr0G.js";
import { t as Input } from "./input-B8Q2ztVi.js";
import { O as schemeKpis, a as applications } from "./live-data-6hUqpYkS.js";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-C0WYWEQX.js";
import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { CheckCircle2, Clock, Download, Eye, FileBadge, Filter, MoreHorizontal, Plus, Search, XCircle } from "lucide-react";
import { motion } from "framer-motion";
//#region src/routes/_app.schemes.applications.tsx?tsr-split=component
var statusTone = {
	"Submitted": "bg-info/10 text-info",
	"Under Review": "bg-warning/15 text-warning",
	"Verification Pending": "bg-warning/15 text-warning",
	"Approved": "bg-success/10 text-success",
	"Rejected": "bg-destructive/10 text-destructive",
	"Benefit Released": "bg-primary/10 text-primary",
	"Draft": "bg-muted text-muted-foreground"
};
var kpis = [
	{
		l: "Total",
		v: schemeKpis.totalApplications,
		icon: FileBadge,
		tone: "bg-primary/10 text-primary"
	},
	{
		l: "Approved",
		v: schemeKpis.approved,
		icon: CheckCircle2,
		tone: "bg-success/10 text-success"
	},
	{
		l: "Pending",
		v: schemeKpis.pending,
		icon: Clock,
		tone: "bg-warning/15 text-warning"
	},
	{
		l: "Rejected",
		v: schemeKpis.rejected,
		icon: XCircle,
		tone: "bg-destructive/10 text-destructive"
	}
];
var statusTabs = [
	"All",
	"Submitted",
	"Under Review",
	"Verification Pending",
	"Approved",
	"Rejected",
	"Benefit Released"
];
function ApplicationsPage() {
	const [q, setQ] = useState("");
	const [tab, setTab] = useState("All");
	const rows = useMemo(() => applications.filter((a) => {
		const matchTab = tab === "All" || a.status === tab;
		const text = `${a.id} ${a.citizen} ${a.scheme} ${a.village} ${a.department}`.toLowerCase();
		return matchTab && (q === "" || text.includes(q.toLowerCase()));
	}), [q, tab]);
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(PageHeader, {
		title: "Applications",
		description: "26,420 applications across 12 schemes. Search, filter and drill into any case.",
		actions: /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsxs(Button, {
			variant: "outline",
			size: "sm",
			className: "gap-1.5",
			children: [/* @__PURE__ */ jsx(Download, { className: "h-4 w-4" }), " Export"]
		}), /* @__PURE__ */ jsxs(Button, {
			size: "sm",
			className: "gap-1.5",
			children: [/* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }), " New Application"]
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
								children: k.v.toLocaleString()
							})
						]
					})
				}, k.l))
			}),
			/* @__PURE__ */ jsxs(Card, {
				className: "p-4",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex flex-wrap items-center gap-3",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "relative min-w-[240px] flex-1",
						children: [/* @__PURE__ */ jsx(Search, { className: "absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ jsx(Input, {
							placeholder: "Search by citizen, scheme, village…",
							value: q,
							onChange: (e) => setQ(e.target.value),
							className: "pl-8"
						})]
					}), /* @__PURE__ */ jsxs(Button, {
						variant: "outline",
						size: "sm",
						className: "gap-1.5",
						children: [/* @__PURE__ */ jsx(Filter, { className: "h-4 w-4" }), " Advanced"]
					})]
				}), /* @__PURE__ */ jsx("div", {
					className: "mt-3 flex flex-wrap gap-1.5",
					children: statusTabs.map((s) => /* @__PURE__ */ jsx("button", {
						onClick: () => setTab(s),
						className: cn("rounded-full border px-3 py-1 text-xs font-medium transition", tab === s ? "border-primary bg-primary text-primary-foreground" : "border-border hover:bg-muted/60"),
						children: s
					}, s))
				})]
			}),
			/* @__PURE__ */ jsxs(Card, {
				className: "overflow-hidden",
				children: [/* @__PURE__ */ jsxs(Table, { children: [/* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
					/* @__PURE__ */ jsx(TableHead, { children: "Application ID" }),
					/* @__PURE__ */ jsx(TableHead, { children: "Citizen" }),
					/* @__PURE__ */ jsx(TableHead, { children: "Scheme" }),
					/* @__PURE__ */ jsx(TableHead, { children: "Village" }),
					/* @__PURE__ */ jsx(TableHead, { children: "Applied" }),
					/* @__PURE__ */ jsx(TableHead, {
						className: "text-right",
						children: "Benefit"
					}),
					/* @__PURE__ */ jsx(TableHead, { children: "Status" }),
					/* @__PURE__ */ jsx(TableHead, { children: "Department" }),
					/* @__PURE__ */ jsx(TableHead, { className: "w-20" })
				] }) }), /* @__PURE__ */ jsx(TableBody, { children: rows.slice(0, 24).map((a) => /* @__PURE__ */ jsxs(TableRow, {
					className: "hover:bg-muted/40",
					children: [
						/* @__PURE__ */ jsx(TableCell, {
							className: "font-mono text-xs",
							children: a.id
						}),
						/* @__PURE__ */ jsx(TableCell, {
							className: "font-medium",
							children: a.citizen
						}),
						/* @__PURE__ */ jsxs(TableCell, { children: [/* @__PURE__ */ jsx("span", {
							className: "text-sm",
							children: a.scheme
						}), /* @__PURE__ */ jsx("div", {
							className: "text-[10px] text-muted-foreground",
							children: a.schemeCode
						})] }),
						/* @__PURE__ */ jsxs(TableCell, { children: [a.village, /* @__PURE__ */ jsx("div", {
							className: "text-[10px] text-muted-foreground",
							children: a.mandal
						})] }),
						/* @__PURE__ */ jsx(TableCell, {
							className: "tabular-nums text-xs",
							children: a.appliedOn
						}),
						/* @__PURE__ */ jsxs(TableCell, {
							className: "text-right font-semibold tabular-nums",
							children: ["₹", a.benefit.toLocaleString()]
						}),
						/* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(Badge, {
							variant: "secondary",
							className: cn("text-[10px]", statusTone[a.status]),
							children: a.status
						}) }),
						/* @__PURE__ */ jsx(TableCell, {
							className: "text-xs",
							children: a.department
						}),
						/* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-1",
							children: [/* @__PURE__ */ jsx(Button, {
								asChild: true,
								variant: "ghost",
								size: "icon",
								className: "h-8 w-8",
								children: /* @__PURE__ */ jsx(Link, {
									to: "/schemes/application-detail",
									children: /* @__PURE__ */ jsx(Eye, { className: "h-4 w-4" })
								})
							}), /* @__PURE__ */ jsx(Button, {
								variant: "ghost",
								size: "icon",
								className: "h-8 w-8",
								children: /* @__PURE__ */ jsx(MoreHorizontal, { className: "h-4 w-4" })
							})]
						}) })
					]
				}, a.id)) })] }), /* @__PURE__ */ jsxs("div", {
					className: "flex items-center justify-between border-t border-border/70 p-3 text-xs text-muted-foreground",
					children: [/* @__PURE__ */ jsxs("span", { children: [
						"Showing ",
						Math.min(24, rows.length),
						" of ",
						rows.length
					] }), /* @__PURE__ */ jsxs("div", {
						className: "flex gap-1",
						children: [/* @__PURE__ */ jsx(Button, {
							variant: "outline",
							size: "sm",
							children: "Prev"
						}), /* @__PURE__ */ jsx(Button, {
							variant: "outline",
							size: "sm",
							children: "Next"
						})]
					})]
				})]
			})
		]
	})] });
}
//#endregion
export { ApplicationsPage as component };

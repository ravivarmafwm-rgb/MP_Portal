import { t as cn } from "./utils-C_uf36nf.js";
import { t as Button } from "./button-Bq5vK6RO.js";
import { t as Card } from "./card-CzXpCsbD.js";
import { t as Badge } from "./badge-D1Dupn2y.js";
import { t as PageHeader } from "./PageHeader-B7gZRr0G.js";
import { t as Input } from "./input-B8Q2ztVi.js";
import { k as schemes } from "./live-data-6hUqpYkS.js";
import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { Building2, Search } from "lucide-react";
import { motion } from "framer-motion";
//#region src/routes/_app.schemes.scheme-catalog.tsx?tsr-split=component
var categories = [
	"All",
	"Housing",
	"Agriculture",
	"Health",
	"Education",
	"Women Welfare",
	"Youth Welfare",
	"Senior Citizens",
	"Employment",
	"Social Security"
];
function SchemeCatalog() {
	const [cat, setCat] = useState("All");
	const [q, setQ] = useState("");
	const rows = useMemo(() => schemes.filter((s) => {
		return (cat === "All" || s.category === cat) && (q === "" || `${s.name} ${s.shortCode} ${s.department}`.toLowerCase().includes(q.toLowerCase()));
	}), [cat, q]);
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(PageHeader, {
		title: "Scheme Catalog",
		description: "12 active welfare schemes across 9 categories — explore eligibility, benefits and impact."
	}), /* @__PURE__ */ jsxs("div", {
		className: "space-y-6 p-4 md:p-8",
		children: [/* @__PURE__ */ jsxs(Card, {
			className: "p-4",
			children: [/* @__PURE__ */ jsx("div", {
				className: "flex flex-wrap gap-3",
				children: /* @__PURE__ */ jsxs("div", {
					className: "relative min-w-[240px] flex-1",
					children: [/* @__PURE__ */ jsx(Search, { className: "absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ jsx(Input, {
						placeholder: "Search schemes…",
						value: q,
						onChange: (e) => setQ(e.target.value),
						className: "pl-8"
					})]
				})
			}), /* @__PURE__ */ jsx("div", {
				className: "mt-3 flex flex-wrap gap-1.5",
				children: categories.map((c) => /* @__PURE__ */ jsx("button", {
					onClick: () => setCat(c),
					className: cn("rounded-full border px-3 py-1 text-xs font-medium transition", cat === c ? "border-primary bg-primary text-primary-foreground" : "border-border hover:bg-muted/60"),
					children: c
				}, c))
			})]
		}), /* @__PURE__ */ jsx("div", {
			className: "grid gap-4 md:grid-cols-2 xl:grid-cols-3",
			children: rows.map((s, i) => /* @__PURE__ */ jsx(motion.div, {
				initial: {
					opacity: 0,
					y: 10
				},
				animate: {
					opacity: 1,
					y: 0
				},
				transition: { delay: i * .04 },
				children: /* @__PURE__ */ jsxs(Card, {
					className: "flex h-full flex-col p-5 transition-all hover:shadow-lg",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "flex items-start justify-between",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-3",
								children: [/* @__PURE__ */ jsx("div", {
									className: "grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 text-2xl",
									children: s.icon
								}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", {
									className: "font-display text-base font-bold",
									children: s.name
								}), /* @__PURE__ */ jsx("div", {
									className: "text-[10px] font-mono uppercase text-muted-foreground",
									children: s.shortCode
								})] })]
							}), /* @__PURE__ */ jsxs(Badge, {
								variant: "secondary",
								className: cn(s.trend === "up" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"),
								children: [
									s.growthPct > 0 ? "+" : "",
									s.growthPct,
									"%"
								]
							})]
						}),
						/* @__PURE__ */ jsx("p", {
							className: "mt-3 text-xs text-muted-foreground",
							children: s.description
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "mt-4 space-y-2 text-xs",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "flex justify-between border-b border-border/40 pb-1.5",
									children: [/* @__PURE__ */ jsx("span", {
										className: "text-muted-foreground",
										children: "Category"
									}), /* @__PURE__ */ jsx("span", {
										className: "font-semibold",
										children: s.category
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "flex justify-between border-b border-border/40 pb-1.5",
									children: [/* @__PURE__ */ jsx("span", {
										className: "text-muted-foreground",
										children: "Eligibility"
									}), /* @__PURE__ */ jsx("span", {
										className: "text-right font-semibold",
										children: s.eligibility
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "flex justify-between border-b border-border/40 pb-1.5",
									children: [/* @__PURE__ */ jsx("span", {
										className: "text-muted-foreground",
										children: "Benefit"
									}), /* @__PURE__ */ jsx("span", {
										className: "font-semibold text-success",
										children: s.benefit
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "flex justify-between border-b border-border/40 pb-1.5",
									children: [/* @__PURE__ */ jsxs("span", {
										className: "text-muted-foreground inline-flex items-center gap-1",
										children: [/* @__PURE__ */ jsx(Building2, { className: "h-3 w-3" }), " Department"]
									}), /* @__PURE__ */ jsx("span", {
										className: "font-semibold",
										children: s.department
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "flex justify-between",
									children: [/* @__PURE__ */ jsx("span", {
										className: "text-muted-foreground",
										children: "Applications"
									}), /* @__PURE__ */ jsx("span", {
										className: "font-semibold tabular-nums",
										children: s.applications.toLocaleString()
									})]
								})
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "mt-4 flex gap-2",
							children: [/* @__PURE__ */ jsx(Button, {
								asChild: true,
								variant: "outline",
								size: "sm",
								className: "flex-1",
								children: /* @__PURE__ */ jsx(Link, {
									to: "/schemes/applications",
									children: "Applications"
								})
							}), /* @__PURE__ */ jsx(Button, {
								asChild: true,
								size: "sm",
								className: "flex-1",
								children: /* @__PURE__ */ jsx(Link, {
									to: "/schemes/application-detail",
									children: "Apply"
								})
							})]
						})
					]
				})
			}, s.id))
		})]
	})] });
}
//#endregion
export { SchemeCatalog as component };

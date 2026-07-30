import { t as cn } from "./utils-C_uf36nf.js";
import { t as Card } from "./card-CzXpCsbD.js";
import { jsx, jsxs } from "react/jsx-runtime";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
//#region src/components/layout/StatCard.tsx
function StatCard({ label, value, delta, trend = "up", icon: Icon, hint, index = 0 }) {
	return /* @__PURE__ */ jsx(motion.div, {
		initial: {
			opacity: 0,
			y: 8
		},
		animate: {
			opacity: 1,
			y: 0
		},
		transition: {
			duration: .3,
			delay: index * .04
		},
		children: /* @__PURE__ */ jsxs(Card, {
			className: "group relative overflow-hidden p-5 transition-all hover:-translate-y-0.5 hover:shadow-md",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "flex items-start justify-between",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "min-w-0",
					children: [
						/* @__PURE__ */ jsx("p", {
							className: "text-xs font-medium uppercase tracking-wider text-muted-foreground",
							children: label
						}),
						/* @__PURE__ */ jsx("p", {
							className: "mt-2 font-display text-3xl font-bold tracking-tight text-foreground",
							children: value
						}),
						hint && /* @__PURE__ */ jsx("p", {
							className: "mt-1 text-xs text-muted-foreground",
							children: hint
						})
					]
				}), /* @__PURE__ */ jsx("div", {
					className: "grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary",
					children: /* @__PURE__ */ jsx(Icon, { className: "h-5 w-5" })
				})]
			}), delta && /* @__PURE__ */ jsxs("div", {
				className: "mt-3 flex items-center gap-1.5",
				children: [/* @__PURE__ */ jsxs("span", {
					className: cn("inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-xs font-semibold", trend === "up" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"),
					children: [trend === "up" ? /* @__PURE__ */ jsx(ArrowUpRight, { className: "h-3 w-3" }) : /* @__PURE__ */ jsx(ArrowDownRight, { className: "h-3 w-3" }), delta]
				}), /* @__PURE__ */ jsx("span", {
					className: "text-xs text-muted-foreground",
					children: "vs last month"
				})]
			})]
		})
	});
}
//#endregion
export { StatCard as t };

import { t as cn } from "./utils-C_uf36nf.js";
import { t as Card } from "./card-CzXpCsbD.js";
import { t as AnimatedNumber } from "./AnimatedNumber-DX8kBKDO.js";
import { jsx, jsxs } from "react/jsx-runtime";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
//#region src/components/dashboard/KpiCard.tsx
var toneMap = {
	primary: {
		bg: "bg-primary/10",
		text: "text-primary",
		ring: "ring-primary/20"
	},
	success: {
		bg: "bg-success/10",
		text: "text-success",
		ring: "ring-success/20"
	},
	warning: {
		bg: "bg-warning/15",
		text: "text-warning",
		ring: "ring-warning/20"
	},
	info: {
		bg: "bg-info/10",
		text: "text-info",
		ring: "ring-info/20"
	},
	destructive: {
		bg: "bg-destructive/10",
		text: "text-destructive",
		ring: "ring-destructive/20"
	}
};
function KpiCard({ label, value, suffix, prefix, delta, trend = "up", icon: Icon, hint, tone = "primary", index = 0, format }) {
	const t = toneMap[tone];
	return /* @__PURE__ */ jsx(motion.div, {
		initial: {
			opacity: 0,
			y: 10
		},
		animate: {
			opacity: 1,
			y: 0
		},
		transition: {
			duration: .35,
			delay: index * .04,
			ease: [
				.22,
				1,
				.36,
				1
			]
		},
		children: /* @__PURE__ */ jsxs(Card, {
			className: "group relative overflow-hidden p-5 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-elevated",
			children: [
				/* @__PURE__ */ jsx("div", { className: cn("absolute -right-8 -top-8 h-28 w-28 rounded-full opacity-50 blur-2xl transition-opacity group-hover:opacity-80", t.bg) }),
				/* @__PURE__ */ jsxs("div", {
					className: "relative flex items-start justify-between",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "min-w-0",
						children: [
							/* @__PURE__ */ jsx("p", {
								className: "text-label",
								children: label
							}),
							/* @__PURE__ */ jsxs("p", {
								className: "mt-2 font-display text-3xl font-bold tracking-tight tabular-nums",
								children: [
									prefix,
									/* @__PURE__ */ jsx(AnimatedNumber, {
										value,
										format
									}),
									suffix
								]
							}),
							hint && /* @__PURE__ */ jsx("p", {
								className: "mt-1 text-xs text-muted-foreground",
								children: hint
							})
						]
					}), /* @__PURE__ */ jsx("div", {
						className: cn("grid h-11 w-11 shrink-0 place-items-center rounded-xl ring-1", t.bg, t.text, t.ring),
						children: /* @__PURE__ */ jsx(Icon, { className: "h-5 w-5" })
					})]
				}),
				delta && /* @__PURE__ */ jsxs("div", {
					className: "relative mt-3 flex items-center gap-1.5",
					children: [/* @__PURE__ */ jsxs("span", {
						className: cn("inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-xs font-semibold", trend === "up" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"),
						children: [trend === "up" ? /* @__PURE__ */ jsx(ArrowUpRight, { className: "h-3 w-3" }) : /* @__PURE__ */ jsx(ArrowDownRight, { className: "h-3 w-3" }), delta]
					}), /* @__PURE__ */ jsx("span", {
						className: "text-xs text-muted-foreground",
						children: "vs last month"
					})]
				})
			]
		})
	});
}
//#endregion
export { KpiCard as t };

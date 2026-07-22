import { t as Button } from "./button-Bq5vK6RO.js";
import { t as Card } from "./card-CzXpCsbD.js";
import { t as PageHeader } from "./PageHeader-B7gZRr0G.js";
import { M as surveysByCitizen } from "./live-data-6hUqpYkS.js";
import { Link } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { ClipboardList } from "lucide-react";
import { motion } from "framer-motion";
//#region src/routes/_app.citizens.surveys.tsx?tsr-split=component
var SplitComponent = () => {
	const rows = surveysByCitizen["CTZ-100245"];
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(PageHeader, {
		title: "Citizen Surveys",
		description: "Participation history across constituency surveys.",
		actions: /* @__PURE__ */ jsx(Button, {
			asChild: true,
			size: "sm",
			variant: "outline",
			children: /* @__PURE__ */ jsx(Link, {
				to: "/citizens/profile",
				children: "Open Citizen 360"
			})
		})
	}), /* @__PURE__ */ jsxs("div", {
		className: "space-y-4 p-4 md:p-8",
		children: [/* @__PURE__ */ jsxs(Card, {
			className: "flex items-center gap-3 p-4 text-sm text-muted-foreground",
			children: [/* @__PURE__ */ jsx(ClipboardList, { className: "h-4 w-4 text-primary" }), " Showing surveys for Anitha Rao · CTZ-100245"]
		}), /* @__PURE__ */ jsx("div", {
			className: "grid gap-4 md:grid-cols-2 xl:grid-cols-4",
			children: rows.map((s, i) => /* @__PURE__ */ jsx(motion.div, {
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
					delay: i * .05
				},
				children: /* @__PURE__ */ jsxs(Card, {
					className: "p-4",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2 text-xs text-muted-foreground",
							children: [/* @__PURE__ */ jsx(ClipboardList, { className: "h-3.5 w-3.5" }), s.date]
						}),
						/* @__PURE__ */ jsx("h4", {
							className: "mt-2 font-display text-sm font-semibold",
							children: s.survey
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "mt-3 flex items-end justify-between",
							children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
								className: "text-[11px] uppercase tracking-wider text-muted-foreground",
								children: "Responses"
							}), /* @__PURE__ */ jsx("div", {
								className: "font-display text-xl font-bold",
								children: s.responses
							})] }), /* @__PURE__ */ jsxs("div", {
								className: "text-right",
								children: [/* @__PURE__ */ jsx("div", {
									className: "text-[11px] uppercase tracking-wider text-muted-foreground",
									children: "Completion"
								}), /* @__PURE__ */ jsxs("div", {
									className: "font-display text-xl font-bold text-primary",
									children: [s.completion, "%"]
								})]
							})]
						}),
						/* @__PURE__ */ jsx("div", {
							className: "mt-3 h-1.5 overflow-hidden rounded-full bg-muted",
							children: /* @__PURE__ */ jsx("div", {
								className: "h-full rounded-full bg-primary",
								style: { width: `${s.completion}%` }
							})
						})
					]
				})
			}, s.id))
		})]
	})] });
};
//#endregion
export { SplitComponent as component };

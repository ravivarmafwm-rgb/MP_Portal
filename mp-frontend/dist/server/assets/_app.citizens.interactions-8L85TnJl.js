import { t as Button } from "./button-Bq5vK6RO.js";
import { t as Card } from "./card-CzXpCsbD.js";
import { t as Badge } from "./badge-D1Dupn2y.js";
import { t as PageHeader } from "./PageHeader-B7gZRr0G.js";
import { t as StatCard } from "./StatCard-BdFv4BKh.js";
import { T as interactionsByCitizen } from "./live-data-6hUqpYkS.js";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { CalendarDays, Filter, MessageCircle, MessageSquare, Phone, Users } from "lucide-react";
import { motion } from "framer-motion";
//#region src/routes/_app.citizens.interactions.tsx?tsr-split=component
var iconMap = {
	Call: Phone,
	SMS: MessageSquare,
	WhatsApp: MessageCircle,
	Meeting: Users,
	Appointment: CalendarDays,
	"Volunteer Visit": Users
};
var toneMap = {
	Call: "bg-blue-500/10 text-blue-600 dark:text-blue-300",
	SMS: "bg-purple-500/10 text-purple-600 dark:text-purple-300",
	WhatsApp: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300",
	Meeting: "bg-amber-500/10 text-amber-600 dark:text-amber-300",
	Appointment: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-300",
	"Volunteer Visit": "bg-primary/10 text-primary"
};
function InteractionsPage() {
	const events = interactionsByCitizen["CTZ-100245"];
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(PageHeader, {
		title: "Interaction History",
		description: "Every citizen touchpoint, unified across voice, SMS, WhatsApp, meetings and field visits.",
		actions: /* @__PURE__ */ jsxs(Button, {
			variant: "outline",
			size: "sm",
			className: "gap-1.5",
			children: [/* @__PURE__ */ jsx(Filter, { className: "h-4 w-4" }), " Filter"]
		})
	}), /* @__PURE__ */ jsxs("div", {
		className: "space-y-6 p-4 md:p-8",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "grid gap-4 md:grid-cols-4",
			children: [
				/* @__PURE__ */ jsx(StatCard, {
					label: "Interactions / Day",
					value: "3,820",
					icon: MessageCircle,
					index: 0,
					delta: "+8.2%"
				}),
				/* @__PURE__ */ jsx(StatCard, {
					label: "WhatsApp Reach",
					value: "78.4K",
					icon: MessageCircle,
					index: 1,
					delta: "+12%"
				}),
				/* @__PURE__ */ jsx(StatCard, {
					label: "Field Visits",
					value: "1,204",
					icon: Users,
					index: 2,
					delta: "+3%"
				}),
				/* @__PURE__ */ jsx(StatCard, {
					label: "Meetings Hosted",
					value: "312",
					icon: CalendarDays,
					index: 3,
					delta: "+5%"
				})
			]
		}), /* @__PURE__ */ jsxs(Card, {
			className: "p-5",
			children: [/* @__PURE__ */ jsx("h3", {
				className: "mb-4 font-display text-sm font-semibold",
				children: "Recent Interactions — Anitha Rao (CTZ-100245)"
			}), /* @__PURE__ */ jsx("ol", {
				className: "space-y-3",
				children: events.map((e, i) => {
					const Icon = iconMap[e.type];
					return /* @__PURE__ */ jsxs(motion.li, {
						initial: {
							opacity: 0,
							x: -8
						},
						animate: {
							opacity: 1,
							x: 0
						},
						transition: {
							duration: .3,
							delay: i * .05
						},
						className: "flex gap-3 rounded-lg border border-border/60 bg-card/60 p-3",
						children: [/* @__PURE__ */ jsx("div", {
							className: `grid h-9 w-9 shrink-0 place-items-center rounded-lg ${toneMap[e.type]}`,
							children: /* @__PURE__ */ jsx(Icon, { className: "h-4 w-4" })
						}), /* @__PURE__ */ jsxs("div", {
							className: "min-w-0 flex-1",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "flex flex-wrap items-baseline justify-between gap-2",
									children: [/* @__PURE__ */ jsx("h4", {
										className: "text-sm font-semibold",
										children: e.type
									}), /* @__PURE__ */ jsx("span", {
										className: "text-xs text-muted-foreground",
										children: e.date
									})]
								}),
								/* @__PURE__ */ jsx("p", {
									className: "mt-0.5 text-sm text-muted-foreground",
									children: e.summary
								}),
								/* @__PURE__ */ jsxs(Badge, {
									variant: "outline",
									className: "mt-2 text-[10px]",
									children: ["By ", e.by]
								})
							]
						})]
					}, e.id);
				})
			})]
		})]
	})] });
}
//#endregion
export { InteractionsPage as component };

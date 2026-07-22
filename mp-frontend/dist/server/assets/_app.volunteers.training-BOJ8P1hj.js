import { t as cn } from "./utils-C_uf36nf.js";
import { t as Button } from "./button-Bq5vK6RO.js";
import { t as Card } from "./card-CzXpCsbD.js";
import { t as Badge } from "./badge-D1Dupn2y.js";
import { t as PageHeader } from "./PageHeader-B7gZRr0G.js";
import { P as trainingPrograms } from "./live-data-6hUqpYkS.js";
import { t as Progress } from "./progress-DOIEKRJF.js";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { Award, BookOpen, CheckCircle2, Clock, GraduationCap, Play, Plus } from "lucide-react";
import { motion } from "framer-motion";
//#region src/routes/_app.volunteers.training.tsx?tsr-split=component
var stats = [
	{
		l: "Programs Active",
		v: 4,
		icon: BookOpen,
		tone: "bg-primary/10 text-primary"
	},
	{
		l: "Volunteers Enrolled",
		v: 1842,
		icon: GraduationCap,
		tone: "bg-info/10 text-info"
	},
	{
		l: "Certifications Issued",
		v: 5320,
		icon: Award,
		tone: "bg-success/10 text-success"
	},
	{
		l: "Avg Completion",
		v: "82%",
		icon: CheckCircle2,
		tone: "bg-warning/15 text-warning"
	}
];
function TrainingPage() {
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(PageHeader, {
		title: "Training Center",
		description: "Onboarding, skill-up and certification programs for the field force.",
		actions: /* @__PURE__ */ jsxs(Button, {
			size: "sm",
			className: "gap-1.5",
			children: [/* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }), " Launch Program"]
		})
	}), /* @__PURE__ */ jsxs("div", {
		className: "space-y-6 p-4 md:p-8",
		children: [/* @__PURE__ */ jsx("div", {
			className: "grid grid-cols-2 gap-3 md:grid-cols-4",
			children: stats.map((s, i) => /* @__PURE__ */ jsx(motion.div, {
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
							className: cn("grid h-9 w-9 place-items-center rounded-lg", s.tone),
							children: /* @__PURE__ */ jsx(s.icon, { className: "h-4 w-4" })
						}),
						/* @__PURE__ */ jsx("div", {
							className: "mt-3 text-xs font-medium uppercase tracking-wider text-muted-foreground",
							children: s.l
						}),
						/* @__PURE__ */ jsx("div", {
							className: "mt-1 font-display text-2xl font-bold tabular-nums",
							children: typeof s.v === "number" ? s.v.toLocaleString() : s.v
						})
					]
				})
			}, s.l))
		}), /* @__PURE__ */ jsx("div", {
			className: "grid gap-4 md:grid-cols-2 xl:grid-cols-3",
			children: trainingPrograms.map((p, i) => {
				const completePct = Math.round(p.completed / p.enrolled * 100);
				const certPct = Math.round(p.certified / p.enrolled * 100);
				return /* @__PURE__ */ jsx(motion.div, {
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
						className: "overflow-hidden",
						children: [/* @__PURE__ */ jsxs("div", {
							className: cn("h-24 bg-gradient-to-br p-4", i % 3 === 0 ? "from-primary/40 to-primary/10" : i % 3 === 1 ? "from-info/40 to-info/10" : "from-success/40 to-success/10"),
							children: [/* @__PURE__ */ jsxs("div", {
								className: "flex items-start justify-between",
								children: [/* @__PURE__ */ jsx(Badge, {
									variant: "secondary",
									className: "bg-background/80",
									children: p.category
								}), /* @__PURE__ */ jsx(Badge, {
									variant: "secondary",
									className: p.status === "Live" ? "bg-success/15 text-success" : p.status === "Upcoming" ? "bg-info/15 text-info" : "bg-muted text-muted-foreground",
									children: p.status
								})]
							}), /* @__PURE__ */ jsx(GraduationCap, { className: "mt-2 h-8 w-8 text-foreground/60" })]
						}), /* @__PURE__ */ jsxs("div", {
							className: "p-5",
							children: [
								/* @__PURE__ */ jsx("h3", {
									className: "font-display text-base font-bold leading-tight",
									children: p.title
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "mt-1 flex items-center gap-3 text-[11px] text-muted-foreground",
									children: [/* @__PURE__ */ jsxs("span", {
										className: "inline-flex items-center gap-1",
										children: [
											/* @__PURE__ */ jsx(Clock, { className: "h-3 w-3" }),
											" ",
											p.duration
										]
									}), /* @__PURE__ */ jsxs("span", {
										className: "inline-flex items-center gap-1",
										children: [
											/* @__PURE__ */ jsx(GraduationCap, { className: "h-3 w-3" }),
											" ",
											p.enrolled.toLocaleString(),
											" enrolled"
										]
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "mt-4 space-y-3",
									children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
										className: "flex items-center justify-between text-xs",
										children: [/* @__PURE__ */ jsx("span", {
											className: "text-muted-foreground",
											children: "Completion"
										}), /* @__PURE__ */ jsxs("span", {
											className: "font-semibold tabular-nums",
											children: [completePct, "%"]
										})]
									}), /* @__PURE__ */ jsx(Progress, {
										value: completePct,
										className: "mt-1 h-1.5"
									})] }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
										className: "flex items-center justify-between text-xs",
										children: [/* @__PURE__ */ jsx("span", {
											className: "text-muted-foreground",
											children: "Certified"
										}), /* @__PURE__ */ jsxs("span", {
											className: "font-semibold tabular-nums",
											children: [certPct, "%"]
										})]
									}), /* @__PURE__ */ jsx(Progress, {
										value: certPct,
										className: "mt-1 h-1.5"
									})] })]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "mt-4 flex gap-2",
									children: [/* @__PURE__ */ jsxs(Button, {
										size: "sm",
										className: "flex-1 gap-1.5",
										children: [/* @__PURE__ */ jsx(Play, { className: "h-3.5 w-3.5" }), " Open Program"]
									}), /* @__PURE__ */ jsx(Button, {
										variant: "outline",
										size: "sm",
										children: "Details"
									})]
								})
							]
						})]
					})
				}, p.id);
			})
		})]
	})] });
}
//#endregion
export { TrainingPage as component };

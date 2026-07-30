import { t as cn } from "./utils-C_uf36nf.js";
import { t as Button } from "./button-Bq5vK6RO.js";
import { t as Card } from "./card-CzXpCsbD.js";
import { t as Badge } from "./badge-D1Dupn2y.js";
import { t as PageHeader } from "./PageHeader-B7gZRr0G.js";
import { d as coverageAreas } from "./live-data-6hUqpYkS.js";
import { t as Progress } from "./progress-DOIEKRJF.js";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { AlertTriangle, CheckCircle2, Layers, Map, MapPin, Navigation } from "lucide-react";
import { motion } from "framer-motion";
//#region src/routes/_app.volunteers.geographic-coverage.tsx?tsr-split=component
var overall = {
	villages: 312,
	covered: 248,
	uncovered: 64,
	density: 5.9,
	coverageScore: 79
};
function CoveragePage() {
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(PageHeader, {
		title: "Geographic Coverage",
		description: "GIS-style view of constituency reach — covered zones, blind spots and volunteer density.",
		actions: /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsxs(Button, {
			variant: "outline",
			size: "sm",
			className: "gap-1.5",
			children: [/* @__PURE__ */ jsx(Layers, { className: "h-4 w-4" }), " Layers"]
		}), /* @__PURE__ */ jsxs(Button, {
			size: "sm",
			className: "gap-1.5",
			children: [/* @__PURE__ */ jsx(Navigation, { className: "h-4 w-4" }), " Plan Route"]
		})] })
	}), /* @__PURE__ */ jsxs("div", {
		className: "space-y-6 p-4 md:p-8",
		children: [
			/* @__PURE__ */ jsx("div", {
				className: "grid grid-cols-2 gap-3 md:grid-cols-4",
				children: [
					{
						l: "Villages Covered",
						v: `${overall.covered}/${overall.villages}`,
						icon: CheckCircle2,
						tone: "bg-success/10 text-success"
					},
					{
						l: "Uncovered Zones",
						v: overall.uncovered,
						icon: AlertTriangle,
						tone: "bg-destructive/10 text-destructive"
					},
					{
						l: "Volunteer Density",
						v: `${overall.density}/km²`,
						icon: MapPin,
						tone: "bg-info/10 text-info"
					},
					{
						l: "Coverage Score",
						v: `${overall.coverageScore}%`,
						icon: Map,
						tone: "bg-primary/10 text-primary"
					}
				].map((s, i) => /* @__PURE__ */ jsx(motion.div, {
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
								children: s.v
							})
						]
					})
				}, s.l))
			}),
			/* @__PURE__ */ jsxs(Card, {
				className: "overflow-hidden",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "relative h-96 bg-gradient-to-br from-info/5 via-primary/5 to-accent/30",
					children: [
						/* @__PURE__ */ jsx("div", {
							className: "absolute inset-0 opacity-30",
							style: {
								backgroundImage: "linear-gradient(hsl(var(--border)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px)",
								backgroundSize: "40px 40px"
							}
						}),
						[
							{
								x: 22,
								y: 30,
								size: 90,
								color: "bg-success/30",
								label: "Madhapur"
							},
							{
								x: 45,
								y: 25,
								size: 70,
								color: "bg-success/30",
								label: "Kondapur"
							},
							{
								x: 65,
								y: 40,
								size: 80,
								color: "bg-info/30",
								label: "Gachibowli"
							},
							{
								x: 35,
								y: 60,
								size: 60,
								color: "bg-warning/30",
								label: "Miyapur"
							},
							{
								x: 75,
								y: 65,
								size: 50,
								color: "bg-destructive/30",
								label: "Maheshwaram"
							},
							{
								x: 55,
								y: 75,
								size: 70,
								color: "bg-info/30",
								label: "Shamshabad"
							},
							{
								x: 20,
								y: 70,
								size: 55,
								color: "bg-success/30",
								label: "Kukatpally"
							}
						].map((c, i) => /* @__PURE__ */ jsxs(motion.div, {
							initial: {
								opacity: 0,
								scale: 0
							},
							animate: {
								opacity: 1,
								scale: 1
							},
							transition: {
								delay: i * .1,
								type: "spring"
							},
							className: "absolute -translate-x-1/2 -translate-y-1/2",
							style: {
								left: `${c.x}%`,
								top: `${c.y}%`
							},
							children: [/* @__PURE__ */ jsx("div", {
								className: cn("rounded-full blur-xl", c.color),
								style: {
									width: c.size,
									height: c.size
								}
							}), /* @__PURE__ */ jsx("div", {
								className: "absolute inset-0 grid place-items-center",
								children: /* @__PURE__ */ jsxs("div", {
									className: "grid place-items-center",
									children: [/* @__PURE__ */ jsx(MapPin, { className: "h-5 w-5 text-foreground" }), /* @__PURE__ */ jsx("span", {
										className: "mt-1 whitespace-nowrap rounded-md bg-background/90 px-1.5 py-0.5 text-[10px] font-semibold shadow-sm",
										children: c.label
									})]
								})
							})]
						}, c.label)),
						/* @__PURE__ */ jsxs("div", {
							className: "absolute left-4 top-4 rounded-lg bg-background/80 px-3 py-2 backdrop-blur",
							children: [/* @__PURE__ */ jsx("div", {
								className: "text-[10px] font-semibold uppercase tracking-wider text-muted-foreground",
								children: "Coverage Map · Live preview"
							}), /* @__PURE__ */ jsx("div", {
								className: "text-xs",
								children: "Hyderabad Constituency · 3 Assemblies"
							})]
						}),
						/* @__PURE__ */ jsx("div", {
							className: "absolute right-4 bottom-4 flex flex-col gap-1 rounded-lg bg-background/90 p-2 text-[10px] backdrop-blur",
							children: [
								{
									c: "bg-success",
									l: "High (>80%)"
								},
								{
									c: "bg-info",
									l: "Medium (50–80%)"
								},
								{
									c: "bg-warning",
									l: "Low (30–50%)"
								},
								{
									c: "bg-destructive",
									l: "Critical (<30%)"
								}
							].map((l) => /* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-1.5",
								children: [/* @__PURE__ */ jsx("span", { className: cn("h-2 w-2 rounded-sm", l.c) }), l.l]
							}, l.l))
						})
					]
				}), /* @__PURE__ */ jsx("div", {
					className: "border-t border-border/70 bg-muted/30 px-4 py-2 text-[11px] text-muted-foreground",
					children: "Map placeholder · Mapbox/Google Maps integration planned for Phase 6"
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "grid gap-4 lg:grid-cols-2",
				children: [/* @__PURE__ */ jsxs(Card, {
					className: "p-5",
					children: [/* @__PURE__ */ jsx("h3", {
						className: "mb-4 font-display text-base font-bold",
						children: "Coverage by mandal"
					}), /* @__PURE__ */ jsx("div", {
						className: "space-y-4",
						children: coverageAreas.map((c, i) => /* @__PURE__ */ jsxs(motion.div, {
							initial: {
								opacity: 0,
								x: -6
							},
							animate: {
								opacity: 1,
								x: 0
							},
							transition: { delay: i * .05 },
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "flex items-center justify-between text-sm",
									children: [/* @__PURE__ */ jsx("span", {
										className: "font-semibold",
										children: c.mandal
									}), /* @__PURE__ */ jsxs(Badge, {
										variant: "secondary",
										className: c.coverageScore > 80 ? "bg-success/10 text-success" : c.coverageScore > 60 ? "bg-info/10 text-info" : c.coverageScore > 40 ? "bg-warning/15 text-warning" : "bg-destructive/10 text-destructive",
										children: [c.coverageScore, "%"]
									})]
								}),
								/* @__PURE__ */ jsx(Progress, {
									value: c.coverageScore,
									className: "mt-1.5 h-2"
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "mt-1 flex items-center justify-between text-[11px] text-muted-foreground",
									children: [/* @__PURE__ */ jsxs("span", { children: [
										c.covered,
										"/",
										c.villages,
										" villages · ",
										c.volunteers,
										" volunteers"
									] }), /* @__PURE__ */ jsxs("span", { children: [c.citizens.toLocaleString(), " citizens"] })]
								})
							]
						}, c.mandal))
					})]
				}), /* @__PURE__ */ jsxs(Card, {
					className: "p-5",
					children: [/* @__PURE__ */ jsx("h3", {
						className: "mb-4 font-display text-base font-bold",
						children: "Uncovered villages — priority list"
					}), /* @__PURE__ */ jsx("div", {
						className: "space-y-2",
						children: [
							{
								name: "Tellapur",
								mandal: "Serilingampally",
								citizens: 1840,
								priority: "High"
							},
							{
								name: "Patancheru",
								mandal: "Patancheru",
								citizens: 2200,
								priority: "High"
							},
							{
								name: "Chevella",
								mandal: "Chevella",
								citizens: 1240,
								priority: "Medium"
							},
							{
								name: "Shankarpalli",
								mandal: "Shankarpalli",
								citizens: 980,
								priority: "Medium"
							},
							{
								name: "Moinabad",
								mandal: "Moinabad",
								citizens: 1620,
								priority: "High"
							},
							{
								name: "Manchal",
								mandal: "Maheshwaram",
								citizens: 720,
								priority: "Low"
							}
						].map((u, i) => /* @__PURE__ */ jsxs(motion.div, {
							initial: {
								opacity: 0,
								x: 6
							},
							animate: {
								opacity: 1,
								x: 0
							},
							transition: { delay: i * .04 },
							className: "flex items-center gap-3 rounded-lg border border-border/60 p-3",
							children: [
								/* @__PURE__ */ jsx("div", {
									className: "grid h-9 w-9 place-items-center rounded-lg bg-destructive/10 text-destructive",
									children: /* @__PURE__ */ jsx(AlertTriangle, { className: "h-4 w-4" })
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "min-w-0 flex-1",
									children: [/* @__PURE__ */ jsx("div", {
										className: "text-sm font-semibold",
										children: u.name
									}), /* @__PURE__ */ jsxs("div", {
										className: "text-[11px] text-muted-foreground",
										children: [
											u.mandal,
											" · ",
											u.citizens.toLocaleString(),
											" citizens"
										]
									})]
								}),
								/* @__PURE__ */ jsx(Badge, {
									variant: "secondary",
									className: u.priority === "High" ? "bg-destructive/10 text-destructive" : u.priority === "Medium" ? "bg-warning/15 text-warning" : "bg-muted text-muted-foreground",
									children: u.priority
								})
							]
						}, u.name))
					})]
				})]
			})
		]
	})] });
}
//#endregion
export { CoveragePage as component };

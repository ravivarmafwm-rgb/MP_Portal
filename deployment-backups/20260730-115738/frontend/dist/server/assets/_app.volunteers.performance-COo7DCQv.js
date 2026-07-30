import { t as cn } from "./utils-C_uf36nf.js";
import { t as Card } from "./card-CzXpCsbD.js";
import { t as Badge } from "./badge-D1Dupn2y.js";
import { n as AvatarFallback, t as Avatar } from "./avatar-CiQwCJNR.js";
import { t as PageHeader } from "./PageHeader-B7gZRr0G.js";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./tabs-CCJRliUM.js";
import { R as volunteers } from "./live-data-6hUqpYkS.js";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { Award, Building2, MapPin, Medal, TrendingUp, Trophy } from "lucide-react";
import { motion } from "framer-motion";
//#region src/routes/_app.volunteers.performance.tsx?tsr-split=component
var rankTones = [
	"bg-gradient-to-br from-amber-400 to-amber-600 text-white",
	"bg-gradient-to-br from-slate-300 to-slate-500 text-white",
	"bg-gradient-to-br from-orange-400 to-orange-600 text-white"
];
var rankIcons = [
	Trophy,
	Medal,
	Award
];
function PerformancePage() {
	const top = [...volunteers].sort((a, b) => b.activityScore - a.activityScore).slice(0, 10);
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(PageHeader, {
		title: "Performance Center",
		description: "Rankings, awards and leaderboards — celebrating the top contributors across the constituency."
	}), /* @__PURE__ */ jsxs("div", {
		className: "space-y-6 p-4 md:p-8",
		children: [/* @__PURE__ */ jsx("div", {
			className: "grid gap-4 md:grid-cols-3",
			children: top.slice(0, 3).map((v, i) => {
				const Icon = rankIcons[i];
				const order = [
					1,
					0,
					2
				][i];
				return /* @__PURE__ */ jsx(motion.div, {
					initial: {
						opacity: 0,
						y: 20
					},
					animate: {
						opacity: 1,
						y: 0
					},
					transition: { delay: i * .1 },
					style: { order },
					className: cn(i === 0 ? "md:mt-0" : "md:mt-6"),
					children: /* @__PURE__ */ jsxs(Card, {
						className: "relative overflow-hidden p-6 text-center",
						children: [
							/* @__PURE__ */ jsx("div", {
								className: cn("absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full", rankTones[i]),
								children: /* @__PURE__ */ jsx(Icon, { className: "h-4 w-4" })
							}),
							/* @__PURE__ */ jsx(Avatar, {
								className: "mx-auto h-20 w-20 ring-4 ring-background",
								children: /* @__PURE__ */ jsx(AvatarFallback, {
									className: "font-display text-xl font-bold",
									children: v.name.split(" ").map((p) => p[0]).slice(0, 2).join("")
								})
							}),
							/* @__PURE__ */ jsx("div", {
								className: "mt-3 font-display text-lg font-bold",
								children: v.name
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "text-xs text-muted-foreground",
								children: [
									v.village,
									" · ",
									v.mandal
								]
							}),
							/* @__PURE__ */ jsx("div", {
								className: "mt-3 font-display text-4xl font-bold tabular-nums text-primary",
								children: v.activityScore
							}),
							/* @__PURE__ */ jsx("div", {
								className: "text-[10px] uppercase tracking-wider text-muted-foreground",
								children: "Activity Score"
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "mt-3 grid grid-cols-3 gap-2 border-t border-border/60 pt-3 text-xs",
								children: [
									/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
										className: "font-bold tabular-nums",
										children: v.citizensRegistered
									}), /* @__PURE__ */ jsx("div", {
										className: "text-muted-foreground",
										children: "Citizens"
									})] }),
									/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
										className: "font-bold tabular-nums",
										children: v.surveysCompleted
									}), /* @__PURE__ */ jsx("div", {
										className: "text-muted-foreground",
										children: "Surveys"
									})] }),
									/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
										className: "font-bold tabular-nums",
										children: v.meetingsAttended
									}), /* @__PURE__ */ jsx("div", {
										className: "text-muted-foreground",
										children: "Meetings"
									})] })
								]
							})
						]
					})
				}, v.id);
			})
		}), /* @__PURE__ */ jsxs(Tabs, {
			defaultValue: "volunteers",
			children: [
				/* @__PURE__ */ jsxs(TabsList, { children: [
					/* @__PURE__ */ jsx(TabsTrigger, {
						value: "volunteers",
						children: "Top Volunteers"
					}),
					/* @__PURE__ */ jsx(TabsTrigger, {
						value: "villages",
						children: "Top Villages"
					}),
					/* @__PURE__ */ jsx(TabsTrigger, {
						value: "mandals",
						children: "Top Mandals"
					})
				] }),
				/* @__PURE__ */ jsx(TabsContent, {
					value: "volunteers",
					className: "mt-4",
					children: /* @__PURE__ */ jsx(Card, {
						className: "p-5",
						children: /* @__PURE__ */ jsx("div", {
							className: "space-y-2",
							children: top.map((v, i) => /* @__PURE__ */ jsxs(motion.div, {
								initial: {
									opacity: 0,
									x: -8
								},
								animate: {
									opacity: 1,
									x: 0
								},
								transition: { delay: i * .04 },
								className: cn("flex items-center gap-3 rounded-xl border p-3", i < 3 ? "border-primary/30 bg-primary/5" : "border-border/60"),
								children: [
									/* @__PURE__ */ jsx("div", {
										className: "grid w-8 place-items-center font-display text-lg font-bold tabular-nums text-muted-foreground",
										children: i + 1
									}),
									/* @__PURE__ */ jsx(Avatar, {
										className: "h-10 w-10",
										children: /* @__PURE__ */ jsx(AvatarFallback, { children: v.name.split(" ").map((p) => p[0]).slice(0, 2).join("") })
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "min-w-0 flex-1",
										children: [/* @__PURE__ */ jsxs("div", {
											className: "flex flex-wrap items-center gap-2",
											children: [/* @__PURE__ */ jsx("span", {
												className: "font-semibold",
												children: v.name
											}), v.badges.slice(0, 2).map((b) => /* @__PURE__ */ jsx(Badge, {
												variant: "outline",
												className: "text-[10px]",
												children: b
											}, b))]
										}), /* @__PURE__ */ jsxs("div", {
											className: "text-[11px] text-muted-foreground",
											children: [
												v.village,
												" · ",
												v.mandal
											]
										})]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "hidden gap-6 text-right text-xs sm:flex",
										children: [
											/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
												className: "font-bold tabular-nums",
												children: v.citizensRegistered
											}), /* @__PURE__ */ jsx("div", {
												className: "text-muted-foreground",
												children: "Citizens"
											})] }),
											/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
												className: "font-bold tabular-nums",
												children: v.surveysCompleted
											}), /* @__PURE__ */ jsx("div", {
												className: "text-muted-foreground",
												children: "Surveys"
											})] }),
											/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
												className: "font-bold tabular-nums",
												children: v.complaintsSubmitted
											}), /* @__PURE__ */ jsx("div", {
												className: "text-muted-foreground",
												children: "Cases"
											})] })
										]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "text-right",
										children: [/* @__PURE__ */ jsx("div", {
											className: "font-display text-2xl font-bold tabular-nums text-primary",
											children: v.activityScore
										}), /* @__PURE__ */ jsx("div", {
											className: "text-[10px] text-muted-foreground",
											children: "score"
										})]
									})
								]
							}, v.id))
						})
					})
				}),
				/* @__PURE__ */ jsx(TabsContent, {
					value: "villages",
					className: "mt-4",
					children: /* @__PURE__ */ jsx("div", {
						className: "grid gap-3 md:grid-cols-2 lg:grid-cols-3",
						children: [
							{
								name: "Madhapur",
								score: 94,
								volunteers: 86,
								citizens: 12420
							},
							{
								name: "Kondapur",
								score: 91,
								volunteers: 74,
								citizens: 10980
							},
							{
								name: "Gachibowli",
								score: 88,
								volunteers: 68,
								citizens: 9870
							},
							{
								name: "Hi-Tec City",
								score: 84,
								volunteers: 64,
								citizens: 9120
							},
							{
								name: "Miyapur",
								score: 79,
								volunteers: 58,
								citizens: 8240
							}
						].map((v, i) => /* @__PURE__ */ jsx(motion.div, {
							initial: {
								opacity: 0,
								y: 6
							},
							animate: {
								opacity: 1,
								y: 0
							},
							transition: { delay: i * .05 },
							children: /* @__PURE__ */ jsxs(Card, {
								className: "p-5",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "flex items-start justify-between",
									children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
										className: "flex items-center gap-2 text-xs text-muted-foreground",
										children: [/* @__PURE__ */ jsx(MapPin, { className: "h-3 w-3" }), " Village"]
									}), /* @__PURE__ */ jsx("div", {
										className: "mt-1 font-display text-lg font-bold",
										children: v.name
									})] }), /* @__PURE__ */ jsxs(Badge, {
										variant: "secondary",
										className: "bg-success/10 text-success gap-1",
										children: [
											/* @__PURE__ */ jsx(TrendingUp, { className: "h-3 w-3" }),
											" ",
											v.score
										]
									})]
								}), /* @__PURE__ */ jsxs("div", {
									className: "mt-4 grid grid-cols-2 gap-2 text-xs",
									children: [/* @__PURE__ */ jsxs("div", {
										className: "rounded-md bg-muted/40 p-2",
										children: [/* @__PURE__ */ jsx("div", {
											className: "font-bold tabular-nums",
											children: v.volunteers
										}), /* @__PURE__ */ jsx("div", {
											className: "text-muted-foreground",
											children: "Volunteers"
										})]
									}), /* @__PURE__ */ jsxs("div", {
										className: "rounded-md bg-muted/40 p-2",
										children: [/* @__PURE__ */ jsx("div", {
											className: "font-bold tabular-nums",
											children: v.citizens.toLocaleString()
										}), /* @__PURE__ */ jsx("div", {
											className: "text-muted-foreground",
											children: "Citizens"
										})]
									})]
								})]
							})
						}, v.name))
					})
				}),
				/* @__PURE__ */ jsx(TabsContent, {
					value: "mandals",
					className: "mt-4",
					children: /* @__PURE__ */ jsx("div", {
						className: "grid gap-3 md:grid-cols-2",
						children: [
							{
								name: "Serilingampally",
								score: 92,
								volunteers: 412
							},
							{
								name: "Khairatabad",
								score: 86,
								volunteers: 286
							},
							{
								name: "Kukatpally",
								score: 81,
								volunteers: 348
							},
							{
								name: "Shamshabad",
								score: 90,
								volunteers: 240
							}
						].map((m, i) => /* @__PURE__ */ jsx(motion.div, {
							initial: {
								opacity: 0,
								y: 6
							},
							animate: {
								opacity: 1,
								y: 0
							},
							transition: { delay: i * .05 },
							children: /* @__PURE__ */ jsx(Card, {
								className: "p-5",
								children: /* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-3",
									children: [
										/* @__PURE__ */ jsx("div", {
											className: "grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary",
											children: /* @__PURE__ */ jsx(Building2, { className: "h-6 w-6" })
										}),
										/* @__PURE__ */ jsxs("div", {
											className: "min-w-0 flex-1",
											children: [/* @__PURE__ */ jsx("div", {
												className: "font-display text-base font-bold",
												children: m.name
											}), /* @__PURE__ */ jsxs("div", {
												className: "text-xs text-muted-foreground",
												children: [m.volunteers, " active volunteers"]
											})]
										}),
										/* @__PURE__ */ jsxs("div", {
											className: "text-right",
											children: [/* @__PURE__ */ jsx("div", {
												className: "font-display text-3xl font-bold tabular-nums text-primary",
												children: m.score
											}), /* @__PURE__ */ jsx("div", {
												className: "text-[10px] text-muted-foreground",
												children: "Performance"
											})]
										})
									]
								})
							})
						}, m.name))
					})
				})
			]
		})]
	})] });
}
//#endregion
export { PerformancePage as component };

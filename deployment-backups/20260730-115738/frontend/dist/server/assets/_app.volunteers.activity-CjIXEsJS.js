import { t as cn } from "./utils-C_uf36nf.js";
import { t as Button } from "./button-Bq5vK6RO.js";
import { t as Card } from "./card-CzXpCsbD.js";
import { t as Badge } from "./badge-D1Dupn2y.js";
import { n as AvatarFallback, t as Avatar } from "./avatar-CiQwCJNR.js";
import { t as PageHeader } from "./PageHeader-B7gZRr0G.js";
import { i as TabsTrigger, r as TabsList, t as Tabs } from "./tabs-CCJRliUM.js";
import { R as volunteers, n as activityLogs } from "./live-data-6hUqpYkS.js";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { Activity, Calendar, ClipboardList, Download, Filter, MessageSquareWarning, TrendingDown, TrendingUp, Users } from "lucide-react";
import { motion } from "framer-motion";
//#region src/routes/_app.volunteers.activity.tsx?tsr-split=component
var chartData = [
	{
		d: "Mon",
		reg: 240,
		sur: 180,
		comp: 32
	},
	{
		d: "Tue",
		reg: 312,
		sur: 220,
		comp: 41
	},
	{
		d: "Wed",
		reg: 280,
		sur: 245,
		comp: 28
	},
	{
		d: "Thu",
		reg: 360,
		sur: 290,
		comp: 52
	},
	{
		d: "Fri",
		reg: 412,
		sur: 320,
		comp: 64
	},
	{
		d: "Sat",
		reg: 380,
		sur: 280,
		comp: 48
	},
	{
		d: "Sun",
		reg: 196,
		sur: 140,
		comp: 22
	}
];
var maxVal = 412;
function ActivityPage() {
	const top5 = [...volunteers].sort((a, b) => b.activityScore - a.activityScore).slice(0, 5);
	const bot5 = [...volunteers].sort((a, b) => a.activityScore - b.activityScore).slice(0, 5);
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(PageHeader, {
		title: "Activity Monitor",
		description: "Live view of every registration, survey and field interaction across the constituency.",
		actions: /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsxs(Button, {
			variant: "outline",
			size: "sm",
			className: "gap-1.5",
			children: [/* @__PURE__ */ jsx(Filter, { className: "h-4 w-4" }), " Filters"]
		}), /* @__PURE__ */ jsxs(Button, {
			size: "sm",
			className: "gap-1.5",
			children: [/* @__PURE__ */ jsx(Download, { className: "h-4 w-4" }), " Export"]
		})] })
	}), /* @__PURE__ */ jsxs("div", {
		className: "space-y-6 p-4 md:p-8",
		children: [
			/* @__PURE__ */ jsx(Tabs, {
				defaultValue: "week",
				children: /* @__PURE__ */ jsxs(TabsList, { children: [
					/* @__PURE__ */ jsx(TabsTrigger, {
						value: "day",
						children: "Today"
					}),
					/* @__PURE__ */ jsx(TabsTrigger, {
						value: "week",
						children: "This Week"
					}),
					/* @__PURE__ */ jsx(TabsTrigger, {
						value: "month",
						children: "This Month"
					})
				] })
			}),
			/* @__PURE__ */ jsx("div", {
				className: "grid grid-cols-2 gap-3 md:grid-cols-4",
				children: [
					{
						l: "Citizens Registered",
						v: 2180,
						d: "+18%",
						icon: Users,
						tone: "bg-primary/10 text-primary"
					},
					{
						l: "Surveys Completed",
						v: 1675,
						d: "+9%",
						icon: ClipboardList,
						tone: "bg-info/10 text-info"
					},
					{
						l: "Complaints Submitted",
						v: 287,
						d: "+4%",
						icon: MessageSquareWarning,
						tone: "bg-warning/15 text-warning"
					},
					{
						l: "Meetings Conducted",
						v: 142,
						d: "-2%",
						icon: Calendar,
						tone: "bg-success/10 text-success"
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
							/* @__PURE__ */ jsxs("div", {
								className: "mt-1 flex items-baseline justify-between",
								children: [/* @__PURE__ */ jsx("span", {
									className: "font-display text-2xl font-bold tabular-nums",
									children: s.v.toLocaleString()
								}), /* @__PURE__ */ jsx("span", {
									className: cn("text-xs font-semibold", s.d.startsWith("+") ? "text-success" : "text-destructive"),
									children: s.d
								})]
							})
						]
					})
				}, s.l))
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "grid gap-4 lg:grid-cols-3",
				children: [/* @__PURE__ */ jsxs(Card, {
					className: "p-6 lg:col-span-2",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "mb-5 flex items-center justify-between",
						children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", {
							className: "font-display text-lg font-bold",
							children: "Weekly trend"
						}), /* @__PURE__ */ jsx("p", {
							className: "text-xs text-muted-foreground",
							children: "Registrations · Surveys · Complaints"
						})] }), /* @__PURE__ */ jsxs("div", {
							className: "flex gap-3 text-[11px]",
							children: [
								/* @__PURE__ */ jsxs("span", {
									className: "inline-flex items-center gap-1",
									children: [/* @__PURE__ */ jsx("span", { className: "h-2 w-2 rounded-sm bg-primary" }), " Reg"]
								}),
								/* @__PURE__ */ jsxs("span", {
									className: "inline-flex items-center gap-1",
									children: [/* @__PURE__ */ jsx("span", { className: "h-2 w-2 rounded-sm bg-info" }), " Sur"]
								}),
								/* @__PURE__ */ jsxs("span", {
									className: "inline-flex items-center gap-1",
									children: [/* @__PURE__ */ jsx("span", { className: "h-2 w-2 rounded-sm bg-warning" }), " Comp"]
								})
							]
						})]
					}), /* @__PURE__ */ jsx("div", {
						className: "flex h-64 items-end gap-3",
						children: chartData.map((c, i) => /* @__PURE__ */ jsxs("div", {
							className: "flex flex-1 flex-col items-center gap-1",
							children: [/* @__PURE__ */ jsx("div", {
								className: "flex w-full flex-1 items-end gap-0.5",
								children: [
									{
										v: c.reg,
										cls: "bg-primary"
									},
									{
										v: c.sur,
										cls: "bg-info"
									},
									{
										v: c.comp * 4,
										cls: "bg-warning"
									}
								].map((b, j) => /* @__PURE__ */ jsx(motion.div, {
									initial: { height: 0 },
									animate: { height: `${b.v / maxVal * 100}%` },
									transition: {
										delay: i * .05 + j * .05,
										duration: .5
									},
									className: cn("flex-1 rounded-t", b.cls)
								}, j))
							}), /* @__PURE__ */ jsx("span", {
								className: "text-[10px] text-muted-foreground",
								children: c.d
							})]
						}, c.d))
					})]
				}), /* @__PURE__ */ jsxs(Card, {
					className: "p-6",
					children: [/* @__PURE__ */ jsx("h3", {
						className: "mb-4 font-display text-lg font-bold",
						children: "Activity heatmap"
					}), /* @__PURE__ */ jsx("div", {
						className: "space-y-1.5",
						children: [
							"Madhapur",
							"Kondapur",
							"Gachibowli",
							"Hi-Tec City",
							"Miyapur"
						].map((v, i) => /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
							className: "mb-1 flex items-center justify-between text-xs",
							children: [/* @__PURE__ */ jsx("span", { children: v }), /* @__PURE__ */ jsx("span", {
								className: "tabular-nums text-muted-foreground",
								children: [
									420,
									380,
									310,
									260,
									180
								][i]
							})]
						}), /* @__PURE__ */ jsx("div", {
							className: "grid grid-cols-12 gap-0.5",
							children: Array.from({ length: 12 }).map((_, j) => {
								return /* @__PURE__ */ jsx("div", {
									className: "aspect-square rounded-sm",
									style: { background: `hsl(var(--primary) / ${Math.max(0, Math.min(1, (420 - i * 60) / 420 * (1 - j * .06))).toFixed(2)})` }
								}, j);
							})
						})] }, v))
					})]
				})]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "grid gap-4 lg:grid-cols-2",
				children: [{
					title: "Most active volunteers",
					icon: TrendingUp,
					tone: "text-success",
					list: top5
				}, {
					title: "Needs attention",
					icon: TrendingDown,
					tone: "text-destructive",
					list: bot5
				}].map((s, idx) => /* @__PURE__ */ jsxs(Card, {
					className: "p-5",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "mb-4 flex items-center gap-2",
						children: [/* @__PURE__ */ jsx(s.icon, { className: cn("h-5 w-5", s.tone) }), /* @__PURE__ */ jsx("h3", {
							className: "font-display text-base font-bold",
							children: s.title
						})]
					}), /* @__PURE__ */ jsx("div", {
						className: "space-y-2",
						children: s.list.map((v, i) => /* @__PURE__ */ jsxs(motion.div, {
							initial: {
								opacity: 0,
								x: idx === 0 ? -6 : 6
							},
							animate: {
								opacity: 1,
								x: 0
							},
							transition: { delay: i * .04 },
							className: "flex items-center gap-3 rounded-lg border border-border/60 p-2.5",
							children: [
								/* @__PURE__ */ jsx(Avatar, {
									className: "h-8 w-8",
									children: /* @__PURE__ */ jsx(AvatarFallback, {
										className: "text-[10px]",
										children: v.name.split(" ").map((p) => p[0]).slice(0, 2).join("")
									})
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "min-w-0 flex-1",
									children: [/* @__PURE__ */ jsx("div", {
										className: "truncate text-sm font-semibold",
										children: v.name
									}), /* @__PURE__ */ jsxs("div", {
										className: "text-[11px] text-muted-foreground",
										children: [
											v.village,
											" · ",
											v.mandal
										]
									})]
								}),
								/* @__PURE__ */ jsx(Badge, {
									variant: "secondary",
									className: idx === 0 ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive",
									children: v.activityScore
								})
							]
						}, v.id))
					})]
				}, s.title))
			}),
			/* @__PURE__ */ jsxs(Card, {
				className: "p-5",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "mb-3 flex items-center justify-between",
					children: [/* @__PURE__ */ jsx("h3", {
						className: "font-display text-base font-bold",
						children: "Live activity feed"
					}), /* @__PURE__ */ jsx(Badge, {
						variant: "secondary",
						className: "bg-success/10 text-success",
						children: "Live"
					})]
				}), /* @__PURE__ */ jsx("div", {
					className: "space-y-2",
					children: activityLogs.map((a, i) => /* @__PURE__ */ jsxs(motion.div, {
						initial: {
							opacity: 0,
							x: -6
						},
						animate: {
							opacity: 1,
							x: 0
						},
						transition: { delay: i * .03 },
						className: "flex items-center gap-3 rounded-lg border border-border/60 p-2.5",
						children: [
							/* @__PURE__ */ jsx("div", {
								className: "grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary",
								children: /* @__PURE__ */ jsx(Activity, { className: "h-4 w-4" })
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ jsx("div", {
									className: "truncate text-sm",
									children: a.description
								}), /* @__PURE__ */ jsxs("div", {
									className: "text-[11px] text-muted-foreground",
									children: [
										a.village,
										" · ",
										a.date
									]
								})]
							}),
							/* @__PURE__ */ jsx(Badge, {
								variant: "outline",
								className: "text-[10px]",
								children: a.type
							})
						]
					}, a.id))
				})]
			})
		]
	})] });
}
//#endregion
export { ActivityPage as component };

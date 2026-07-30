import { t as cn } from "./utils-C_uf36nf.js";
import { t as Button } from "./button-Bq5vK6RO.js";
import { t as Card } from "./card-CzXpCsbD.js";
import { t as Badge } from "./badge-D1Dupn2y.js";
import { n as AvatarFallback, t as Avatar } from "./avatar-CiQwCJNR.js";
import { t as PageHeader } from "./PageHeader-B7gZRr0G.js";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./tabs-CCJRliUM.js";
import { R as volunteers, s as attendanceCalendar } from "./live-data-6hUqpYkS.js";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-C0WYWEQX.js";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { CalendarCheck, Download, MapPin, UserCheck, UserX, Wifi } from "lucide-react";
import { motion } from "framer-motion";
//#region src/routes/_app.volunteers.attendance.tsx?tsr-split=component
var kpis = [
	{
		l: "Present Today",
		v: 1284,
		icon: UserCheck,
		tone: "bg-success/10 text-success"
	},
	{
		l: "Absent Today",
		v: 172,
		icon: UserX,
		tone: "bg-destructive/10 text-destructive"
	},
	{
		l: "Field Visits",
		v: 612,
		icon: MapPin,
		tone: "bg-info/10 text-info"
	},
	{
		l: "GPS Check-ins",
		v: 3420,
		icon: Wifi,
		tone: "bg-primary/10 text-primary"
	}
];
function AttendancePage() {
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(PageHeader, {
		title: "Attendance Management",
		description: "Daily check-ins, deployment hours and zone-wise coverage of the volunteer force.",
		actions: /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsxs(Button, {
			variant: "outline",
			size: "sm",
			className: "gap-1.5",
			children: [/* @__PURE__ */ jsx(Download, { className: "h-4 w-4" }), " Export"]
		}), /* @__PURE__ */ jsxs(Button, {
			size: "sm",
			className: "gap-1.5",
			children: [/* @__PURE__ */ jsx(CalendarCheck, { className: "h-4 w-4" }), " Mark Attendance"]
		})] })
	}), /* @__PURE__ */ jsxs("div", {
		className: "space-y-6 p-4 md:p-8",
		children: [/* @__PURE__ */ jsx("div", {
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
							className: cn("grid h-9 w-9 place-items-center rounded-lg", k.tone),
							children: /* @__PURE__ */ jsx(k.icon, { className: "h-4 w-4" })
						}),
						/* @__PURE__ */ jsx("div", {
							className: "mt-3 text-xs font-medium uppercase tracking-wider text-muted-foreground",
							children: k.l
						}),
						/* @__PURE__ */ jsx("div", {
							className: "mt-1 font-display text-2xl font-bold tabular-nums",
							children: k.v.toLocaleString()
						})
					]
				})
			}, k.l))
		}), /* @__PURE__ */ jsxs(Tabs, {
			defaultValue: "calendar",
			children: [
				/* @__PURE__ */ jsxs(TabsList, { children: [
					/* @__PURE__ */ jsx(TabsTrigger, {
						value: "calendar",
						children: "Calendar View"
					}),
					/* @__PURE__ */ jsx(TabsTrigger, {
						value: "table",
						children: "Table View"
					}),
					/* @__PURE__ */ jsx(TabsTrigger, {
						value: "analytics",
						children: "Analytics"
					})
				] }),
				/* @__PURE__ */ jsx(TabsContent, {
					value: "calendar",
					className: "mt-4",
					children: /* @__PURE__ */ jsxs(Card, {
						className: "p-5",
						children: [
							/* @__PURE__ */ jsx("h3", {
								className: "mb-3 font-display text-base font-bold",
								children: "June 2026 · Constituency-wide attendance"
							}),
							/* @__PURE__ */ jsx("div", {
								className: "grid grid-cols-7 gap-1.5 text-center text-[10px] text-muted-foreground",
								children: [
									"S",
									"M",
									"T",
									"W",
									"T",
									"F",
									"S"
								].map((d, i) => /* @__PURE__ */ jsx("div", { children: d }, i))
							}),
							/* @__PURE__ */ jsx("div", {
								className: "mt-2 grid grid-cols-7 gap-1.5",
								children: attendanceCalendar.map((d, i) => {
									const presentPct = d.status === "P" ? 92 : d.status === "F" ? 78 : d.status === "L" ? 60 : 40;
									const tone = presentPct > 85 ? "bg-success/15 border-success/30 text-success" : presentPct > 65 ? "bg-info/15 border-info/30 text-info" : presentPct > 50 ? "bg-warning/15 border-warning/30 text-warning" : "bg-destructive/15 border-destructive/30 text-destructive";
									return /* @__PURE__ */ jsxs(motion.div, {
										initial: {
											opacity: 0,
											scale: .9
										},
										animate: {
											opacity: 1,
											scale: 1
										},
										transition: { delay: i * .01 },
										className: cn("aspect-square rounded-md border p-1.5 text-left", tone),
										children: [/* @__PURE__ */ jsx("div", {
											className: "text-xs font-bold tabular-nums",
											children: d.date
										}), /* @__PURE__ */ jsxs("div", {
											className: "mt-1 text-[10px] font-semibold opacity-80",
											children: [presentPct, "%"]
										})]
									}, i);
								})
							})
						]
					})
				}),
				/* @__PURE__ */ jsx(TabsContent, {
					value: "table",
					className: "mt-4",
					children: /* @__PURE__ */ jsx(Card, {
						className: "overflow-hidden",
						children: /* @__PURE__ */ jsxs(Table, { children: [/* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
							/* @__PURE__ */ jsx(TableHead, { children: "Volunteer" }),
							/* @__PURE__ */ jsx(TableHead, { children: "Village" }),
							/* @__PURE__ */ jsx(TableHead, { children: "Check-in" }),
							/* @__PURE__ */ jsx(TableHead, { children: "Check-out" }),
							/* @__PURE__ */ jsx(TableHead, { children: "Hours" }),
							/* @__PURE__ */ jsx(TableHead, { children: "Visits" }),
							/* @__PURE__ */ jsx(TableHead, { children: "Status" })
						] }) }), /* @__PURE__ */ jsx(TableBody, { children: volunteers.slice(0, 12).map((v, i) => /* @__PURE__ */ jsxs(TableRow, { children: [
							/* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ jsx(Avatar, {
									className: "h-7 w-7",
									children: /* @__PURE__ */ jsx(AvatarFallback, {
										className: "text-[10px]",
										children: v.name.split(" ").map((p) => p[0]).slice(0, 2).join("")
									})
								}), /* @__PURE__ */ jsx("span", {
									className: "text-sm font-semibold",
									children: v.name
								})]
							}) }),
							/* @__PURE__ */ jsx(TableCell, { children: v.village }),
							/* @__PURE__ */ jsx(TableCell, {
								className: "text-xs tabular-nums",
								children: `0${8 + i % 2}:${i * 7 % 60 < 10 ? "0" : ""}${i * 7 % 60} AM`
							}),
							/* @__PURE__ */ jsx(TableCell, {
								className: "text-xs tabular-nums",
								children: `0${5 + i % 3}:${i * 11 % 60 < 10 ? "0" : ""}${i * 11 % 60} PM`
							}),
							/* @__PURE__ */ jsx(TableCell, {
								className: "tabular-nums",
								children: 8 + i % 3
							}),
							/* @__PURE__ */ jsx(TableCell, {
								className: "tabular-nums",
								children: 2 + i % 5
							}),
							/* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(Badge, {
								variant: "secondary",
								className: i % 6 === 0 ? "bg-warning/15 text-warning" : "bg-success/10 text-success",
								children: i % 6 === 0 ? "Late" : "On time"
							}) })
						] }, v.id)) })] })
					})
				}),
				/* @__PURE__ */ jsx(TabsContent, {
					value: "analytics",
					className: "mt-4",
					children: /* @__PURE__ */ jsxs("div", {
						className: "grid gap-4 md:grid-cols-2",
						children: [/* @__PURE__ */ jsxs(Card, {
							className: "p-5",
							children: [/* @__PURE__ */ jsx("h3", {
								className: "mb-4 font-display text-base font-bold",
								children: "Attendance by mandal"
							}), /* @__PURE__ */ jsx("div", {
								className: "space-y-3",
								children: [
									"Serilingampally",
									"Kukatpally",
									"Khairatabad",
									"Rajendranagar"
								].map((m, i) => {
									const pct = [
										92,
										86,
										78,
										64
									][i];
									return /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
										className: "flex items-center justify-between text-sm",
										children: [/* @__PURE__ */ jsx("span", { children: m }), /* @__PURE__ */ jsxs("span", {
											className: "font-semibold tabular-nums",
											children: [pct, "%"]
										})]
									}), /* @__PURE__ */ jsx("div", {
										className: "mt-1 h-2 overflow-hidden rounded-full bg-muted",
										children: /* @__PURE__ */ jsx(motion.div, {
											initial: { width: 0 },
											animate: { width: `${pct}%` },
											transition: {
												delay: i * .1,
												duration: .6
											},
											className: "h-full bg-primary"
										})
									})] }, m);
								})
							})]
						}), /* @__PURE__ */ jsxs(Card, {
							className: "p-5",
							children: [/* @__PURE__ */ jsx("h3", {
								className: "mb-4 font-display text-base font-bold",
								children: "GPS check-in distribution"
							}), /* @__PURE__ */ jsx("div", {
								className: "grid grid-cols-3 gap-2 text-center",
								children: [
									"Morning",
									"Afternoon",
									"Evening"
								].map((s, i) => /* @__PURE__ */ jsxs("div", {
									className: "rounded-lg border border-border/60 p-3",
									children: [/* @__PURE__ */ jsx("div", {
										className: "font-display text-2xl font-bold tabular-nums",
										children: [
											1820,
											1245,
											355
										][i]
									}), /* @__PURE__ */ jsx("div", {
										className: "text-[11px] text-muted-foreground",
										children: s
									})]
								}, s))
							})]
						})]
					})
				})
			]
		})]
	})] });
}
//#endregion
export { AttendancePage as component };

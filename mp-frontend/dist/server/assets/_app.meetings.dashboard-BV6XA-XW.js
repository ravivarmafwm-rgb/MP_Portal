import { k as fetchMeetingDashboard } from "./api-CQX857SN.js";
import { t as cn } from "./utils-C_uf36nf.js";
import { t as Button } from "./button-Bq5vK6RO.js";
import { t as Card } from "./card-CzXpCsbD.js";
import { t as Badge } from "./badge-D1Dupn2y.js";
import { t as Skeleton } from "./skeleton-D9W9wFsj.js";
import { t as PageHeader } from "./PageHeader-B7gZRr0G.js";
import { Link } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Building2, Calendar, CalendarDays, CheckCircle2, Clock, MapPin, Plus, Star, TrendingUp, Users } from "lucide-react";
import { motion } from "framer-motion";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
//#region src/routes/_app.meetings.dashboard.tsx?tsr-split=component
var toneMap = {
	primary: "bg-primary/10 text-primary",
	info: "bg-info/10 text-info",
	success: "bg-success/10 text-success",
	warning: "bg-warning/15 text-warning",
	destructive: "bg-destructive/10 text-destructive"
};
function MeetingsDashboardPage() {
	const { data, isLoading } = useQuery({
		queryKey: ["meeting-dashboard"],
		queryFn: fetchMeetingDashboard,
		staleTime: 3e4,
		refetchInterval: 6e4
	});
	const kpis = data?.kpis ?? {};
	const score = data?.engagement_score ?? 0;
	const todaySchedule = data?.today_schedule ?? [];
	const weeklyTrend = data?.weekly_trend ?? [];
	const byCategory = data?.by_category ?? [];
	const upcoming = data?.upcoming ?? [];
	const recentJD = data?.recent_jd_sessions ?? [];
	const kpiCards = [
		{
			label: "Total Appointments",
			value: kpis.total_appointments ?? 0,
			icon: CalendarDays,
			tone: "primary",
			path: "/meetings/appointments"
		},
		{
			label: "Pending",
			value: kpis.pending ?? 0,
			icon: Clock,
			tone: "warning",
			path: "/meetings/appointments?status=pending"
		},
		{
			label: "Confirmed",
			value: kpis.confirmed ?? 0,
			icon: CheckCircle2,
			tone: "success",
			path: "/meetings/appointments?status=confirmed"
		},
		{
			label: "Completed",
			value: kpis.completed ?? 0,
			icon: Star,
			tone: "info",
			path: "/meetings/appointments?status=completed"
		},
		{
			label: "Public Meetings",
			value: kpis.public_meetings ?? 0,
			icon: Building2,
			tone: "primary",
			path: "/meetings/public-meetings"
		},
		{
			label: "Tours Planned",
			value: kpis.tours_planned ?? 0,
			icon: MapPin,
			tone: "success",
			path: "/meetings/tours"
		},
		{
			label: "Citizens Met",
			value: kpis.citizens_met ?? 0,
			icon: Users,
			tone: "info",
			path: "/meetings/appointments"
		},
		{
			label: "Villages Visited",
			value: kpis.villages_visited ?? 0,
			icon: MapPin,
			tone: "warning",
			path: "/meetings/tours"
		}
	];
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(PageHeader, {
		title: "Engagement Command Center",
		description: "Citizen appointments, public meetings, tours and Janata Darbar — all in one view",
		actions: /* @__PURE__ */ jsxs("div", {
			className: "flex gap-2",
			children: [/* @__PURE__ */ jsx(Button, {
				asChild: true,
				size: "sm",
				variant: "outline",
				children: /* @__PURE__ */ jsxs(Link, {
					to: "/meetings/calendar",
					children: [/* @__PURE__ */ jsx(Calendar, { className: "h-4 w-4 mr-1.5" }), "Calendar"]
				})
			}), /* @__PURE__ */ jsx(Button, {
				asChild: true,
				size: "sm",
				children: /* @__PURE__ */ jsxs(Link, {
					to: "/meetings/appointments",
					children: [/* @__PURE__ */ jsx(Plus, { className: "h-4 w-4 mr-1.5" }), "Schedule"]
				})
			})]
		})
	}), /* @__PURE__ */ jsxs("div", {
		className: "space-y-6 p-4 md:p-8",
		children: [
			/* @__PURE__ */ jsx("div", {
				className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-4",
				children: isLoading ? Array.from({ length: 8 }).map((_, i) => /* @__PURE__ */ jsx(Skeleton, { className: "h-28 rounded-xl" }, i)) : kpiCards.map((k, i) => /* @__PURE__ */ jsx(motion.div, {
					initial: {
						opacity: 0,
						y: 8
					},
					animate: {
						opacity: 1,
						y: 0
					},
					transition: { delay: i * .04 },
					children: /* @__PURE__ */ jsx(Link, {
						to: k.path,
						children: /* @__PURE__ */ jsx(Card, {
							className: "group p-5 hover:-translate-y-0.5 hover:shadow-elevated transition-all cursor-pointer",
							children: /* @__PURE__ */ jsxs("div", {
								className: "flex items-start justify-between",
								children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
									className: "text-xs font-medium text-muted-foreground uppercase tracking-wide",
									children: k.label
								}), /* @__PURE__ */ jsx("p", {
									className: "mt-2 font-display text-3xl font-bold tabular-nums",
									children: k.value.toLocaleString()
								})] }), /* @__PURE__ */ jsx("div", {
									className: cn("grid h-10 w-10 place-items-center rounded-xl", toneMap[k.tone]),
									children: /* @__PURE__ */ jsx(k.icon, { className: "h-5 w-5" })
								})]
							})
						})
					})
				}, k.label))
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "grid gap-6 lg:grid-cols-[1fr_1.6fr]",
				children: [/* @__PURE__ */ jsxs(Card, {
					className: "p-6 flex flex-col items-center justify-center text-center space-y-4",
					children: [
						/* @__PURE__ */ jsx("h3", {
							className: "text-h3 font-bold",
							children: "Constituency Engagement Score"
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "relative flex items-center justify-center",
							children: [/* @__PURE__ */ jsxs("svg", {
								className: "h-40 w-40 -rotate-90",
								viewBox: "0 0 100 100",
								children: [/* @__PURE__ */ jsx("circle", {
									cx: "50",
									cy: "50",
									r: "42",
									fill: "none",
									stroke: "currentColor",
									strokeWidth: "8",
									className: "text-muted/30"
								}), /* @__PURE__ */ jsx("circle", {
									cx: "50",
									cy: "50",
									r: "42",
									fill: "none",
									stroke: "currentColor",
									strokeWidth: "8",
									strokeLinecap: "round",
									className: "text-primary",
									strokeDasharray: `${score / 100 * 264} 264`
								})]
							}), /* @__PURE__ */ jsxs("div", {
								className: "absolute text-center",
								children: [/* @__PURE__ */ jsx("div", {
									className: "font-display text-4xl font-bold text-primary",
									children: score
								}), /* @__PURE__ */ jsx("div", {
									className: "text-xs text-muted-foreground",
									children: "/ 100"
								})]
							})]
						}),
						/* @__PURE__ */ jsx("div", {
							className: "w-full space-y-2 text-sm",
							children: [
								{
									label: "Citizen Accessibility",
									pct: Math.min(99, score + 5)
								},
								{
									label: "Meeting Attendance",
									pct: Math.min(99, score - 5)
								},
								{
									label: "Village Visits",
									pct: Math.min(99, score - 10)
								},
								{
									label: "Public Outreach",
									pct: Math.min(99, score + 2)
								}
							].map((f) => /* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-2",
								children: [
									/* @__PURE__ */ jsx("span", {
										className: "w-36 text-left text-xs text-muted-foreground",
										children: f.label
									}),
									/* @__PURE__ */ jsx("div", {
										className: "flex-1 h-1.5 overflow-hidden rounded-full bg-muted",
										children: /* @__PURE__ */ jsx("div", {
											className: "h-full rounded-full bg-primary transition-all",
											style: { width: `${f.pct}%` }
										})
									}),
									/* @__PURE__ */ jsxs("span", {
										className: "w-8 text-right text-xs font-semibold tabular-nums",
										children: [f.pct, "%"]
									})
								]
							}, f.label))
						})
					]
				}), /* @__PURE__ */ jsxs(Card, {
					className: "p-6",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-center justify-between mb-4",
						children: [/* @__PURE__ */ jsx("h3", {
							className: "text-h3 font-bold",
							children: "Today's Schedule"
						}), /* @__PURE__ */ jsx(Badge, {
							variant: "secondary",
							className: "bg-primary/10 text-primary",
							children: data?.date_label ?? "Today"
						})]
					}), isLoading ? /* @__PURE__ */ jsx("div", {
						className: "space-y-3",
						children: Array.from({ length: 4 }).map((_, i) => /* @__PURE__ */ jsx(Skeleton, { className: "h-14" }, i))
					}) : todaySchedule.length === 0 ? /* @__PURE__ */ jsxs("div", {
						className: "flex flex-col items-center justify-center py-8 text-center",
						children: [
							/* @__PURE__ */ jsx(CalendarDays, { className: "h-10 w-10 text-muted-foreground/40 mb-2" }),
							/* @__PURE__ */ jsx("p", {
								className: "text-sm text-muted-foreground",
								children: "No events scheduled today"
							}),
							/* @__PURE__ */ jsx(Button, {
								asChild: true,
								size: "sm",
								variant: "outline",
								className: "mt-3",
								children: /* @__PURE__ */ jsx(Link, {
									to: "/meetings/appointments",
									children: "Schedule Appointment"
								})
							})
						]
					}) : /* @__PURE__ */ jsx("div", {
						className: "space-y-2 max-h-72 overflow-y-auto",
						children: todaySchedule.map((item, i) => /* @__PURE__ */ jsxs(motion.div, {
							initial: {
								opacity: 0,
								x: -8
							},
							animate: {
								opacity: 1,
								x: 0
							},
							transition: { delay: i * .04 },
							className: "flex items-center gap-3 rounded-lg border border-border/60 bg-muted/30 p-3 hover:bg-muted/60 transition-colors",
							children: [
								/* @__PURE__ */ jsx("div", {
									className: "text-xs font-semibold tabular-nums text-muted-foreground w-14 shrink-0",
									children: String(item.time ?? "TBD")
								}),
								/* @__PURE__ */ jsx("div", {
									className: "min-w-0 flex-1",
									children: /* @__PURE__ */ jsx("p", {
										className: "text-sm font-medium truncate",
										children: String(item.title ?? "")
									})
								}),
								/* @__PURE__ */ jsx(Badge, {
									variant: "secondary",
									className: cn("text-[10px]", toneMap[String(item.tone ?? "primary")]),
									children: String(item.badge ?? "")
								})
							]
						}, String(item.id ?? i)))
					})]
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "grid gap-6 lg:grid-cols-2",
				children: [/* @__PURE__ */ jsxs(Card, {
					className: "p-6",
					children: [/* @__PURE__ */ jsx("h3", {
						className: "text-h3 font-bold mb-4",
						children: "Weekly Appointment Trend"
					}), /* @__PURE__ */ jsx(ResponsiveContainer, {
						width: "100%",
						height: 200,
						children: /* @__PURE__ */ jsxs(BarChart, {
							data: weeklyTrend,
							children: [
								/* @__PURE__ */ jsx(CartesianGrid, {
									strokeDasharray: "3 3",
									stroke: "hsl(var(--border))"
								}),
								/* @__PURE__ */ jsx(XAxis, {
									dataKey: "d",
									tick: { fontSize: 11 }
								}),
								/* @__PURE__ */ jsx(YAxis, { tick: { fontSize: 11 } }),
								/* @__PURE__ */ jsx(Tooltip, { contentStyle: {
									fontSize: 12,
									borderRadius: 8
								} }),
								/* @__PURE__ */ jsx(Bar, {
									dataKey: "requested",
									fill: "hsl(var(--primary))",
									radius: [
										4,
										4,
										0,
										0
									],
									name: "Requested"
								}),
								/* @__PURE__ */ jsx(Bar, {
									dataKey: "completed",
									fill: "hsl(var(--success))",
									radius: [
										4,
										4,
										0,
										0
									],
									name: "Completed"
								})
							]
						})
					})]
				}), /* @__PURE__ */ jsxs(Card, {
					className: "p-6",
					children: [/* @__PURE__ */ jsx("h3", {
						className: "text-h3 font-bold mb-4",
						children: "Appointments by Category"
					}), /* @__PURE__ */ jsx(ResponsiveContainer, {
						width: "100%",
						height: 200,
						children: /* @__PURE__ */ jsxs(BarChart, {
							data: byCategory,
							layout: "vertical",
							children: [
								/* @__PURE__ */ jsx(CartesianGrid, {
									strokeDasharray: "3 3",
									stroke: "hsl(var(--border))"
								}),
								/* @__PURE__ */ jsx(XAxis, {
									type: "number",
									tick: { fontSize: 11 }
								}),
								/* @__PURE__ */ jsx(YAxis, {
									dataKey: "name",
									type: "category",
									tick: { fontSize: 11 },
									width: 80
								}),
								/* @__PURE__ */ jsx(Tooltip, { contentStyle: {
									fontSize: 12,
									borderRadius: 8
								} }),
								/* @__PURE__ */ jsx(Bar, {
									dataKey: "value",
									fill: "hsl(var(--info))",
									radius: [
										0,
										4,
										4,
										0
									]
								})
							]
						})
					})]
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "grid gap-6 lg:grid-cols-2",
				children: [/* @__PURE__ */ jsxs(Card, {
					className: "p-6",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-center justify-between mb-4",
						children: [/* @__PURE__ */ jsx("h3", {
							className: "text-h3 font-bold",
							children: "Upcoming Events"
						}), /* @__PURE__ */ jsx(Button, {
							variant: "ghost",
							size: "sm",
							asChild: true,
							children: /* @__PURE__ */ jsxs(Link, {
								to: "/meetings/calendar",
								children: ["View Calendar ", /* @__PURE__ */ jsx(ArrowRight, { className: "ml-1 h-3.5 w-3.5" })]
							})
						})]
					}), /* @__PURE__ */ jsx("div", {
						className: "space-y-3",
						children: upcoming.length === 0 ? /* @__PURE__ */ jsx("p", {
							className: "text-sm text-muted-foreground text-center py-4",
							children: "No upcoming events in next 14 days"
						}) : upcoming.slice(0, 6).map((ev, i) => /* @__PURE__ */ jsxs(motion.div, {
							initial: { opacity: 0 },
							animate: { opacity: 1 },
							transition: { delay: i * .05 },
							className: "flex items-center gap-3",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: cn("flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-lg text-center", String(ev.tone ?? "bg-primary/10 text-primary")),
									children: [/* @__PURE__ */ jsx("div", {
										className: "text-[10px] font-medium",
										children: String(ev.date ?? "")
									}), /* @__PURE__ */ jsx("div", {
										className: "font-display text-lg font-bold leading-tight",
										children: String(ev.day ?? "")
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "min-w-0 flex-1",
									children: [/* @__PURE__ */ jsx("p", {
										className: "text-sm font-semibold truncate",
										children: String(ev.title ?? "")
									}), /* @__PURE__ */ jsx("p", {
										className: "text-xs text-muted-foreground truncate",
										children: String(ev.meta ?? "")
									})]
								}),
								/* @__PURE__ */ jsx(Badge, {
									variant: "secondary",
									className: "text-[10px] capitalize",
									children: String(ev.type ?? "").replace("_", " ")
								})
							]
						}, String(ev.id ?? i)))
					})]
				}), /* @__PURE__ */ jsxs(Card, {
					className: "p-6",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-center justify-between mb-4",
						children: [/* @__PURE__ */ jsx("h3", {
							className: "text-h3 font-bold",
							children: "Janata Darbar Sessions"
						}), /* @__PURE__ */ jsx(Button, {
							variant: "ghost",
							size: "sm",
							asChild: true,
							children: /* @__PURE__ */ jsxs(Link, {
								to: "/meetings/janata-darbar",
								children: ["View All ", /* @__PURE__ */ jsx(ArrowRight, { className: "ml-1 h-3.5 w-3.5" })]
							})
						})]
					}), /* @__PURE__ */ jsx("div", {
						className: "space-y-3",
						children: recentJD.length === 0 ? /* @__PURE__ */ jsx("p", {
							className: "text-sm text-muted-foreground text-center py-4",
							children: "No Janata Darbar sessions yet"
						}) : recentJD.slice(0, 4).map((s, i) => /* @__PURE__ */ jsxs("div", {
							className: "rounded-lg border border-border/60 bg-muted/30 p-3",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "flex items-start justify-between gap-2",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "min-w-0",
									children: [/* @__PURE__ */ jsx("p", {
										className: "text-sm font-semibold truncate",
										children: String(s.title ?? "")
									}), /* @__PURE__ */ jsxs("p", {
										className: "text-xs text-muted-foreground",
										children: [
											String(s.venue ?? ""),
											" · ",
											String(s.session_date ?? "").substring(0, 10)
										]
									})]
								}), /* @__PURE__ */ jsx(Badge, {
									variant: "secondary",
									className: s.status === "completed" ? "bg-success/10 text-success" : "bg-primary/10 text-primary",
									children: String(s.status ?? "")
								})]
							}), /* @__PURE__ */ jsxs("div", {
								className: "mt-2 flex gap-3 text-xs text-muted-foreground",
								children: [
									/* @__PURE__ */ jsxs("span", { children: [/* @__PURE__ */ jsx("strong", {
										className: "text-foreground",
										children: Number(s.registered_citizens ?? 0)
									}), " registered"] }),
									/* @__PURE__ */ jsxs("span", { children: [/* @__PURE__ */ jsx("strong", {
										className: "text-success",
										children: Number(s.issues_resolved ?? 0)
									}), " resolved"] }),
									/* @__PURE__ */ jsxs("span", { children: [/* @__PURE__ */ jsx("strong", {
										className: "text-warning",
										children: Number(s.issues_pending ?? 0)
									}), " pending"] })
								]
							})]
						}, String(s.id ?? i)))
					})]
				})]
			}),
			/* @__PURE__ */ jsxs(Card, {
				className: "p-6",
				children: [/* @__PURE__ */ jsx("h3", {
					className: "text-h3 font-bold mb-4",
					children: "Quick Access"
				}), /* @__PURE__ */ jsx("div", {
					className: "grid grid-cols-2 gap-3 sm:grid-cols-4",
					children: [
						{
							label: "Appointment Management",
							path: "/meetings/appointments",
							icon: CalendarDays,
							tone: "primary"
						},
						{
							label: "Janata Darbar",
							path: "/meetings/janata-darbar",
							icon: Users,
							tone: "warning"
						},
						{
							label: "Public Meetings",
							path: "/meetings/public-meetings",
							icon: Building2,
							tone: "info"
						},
						{
							label: "MP Tours",
							path: "/meetings/tours",
							icon: MapPin,
							tone: "success"
						},
						{
							label: "Master Calendar",
							path: "/meetings/calendar",
							icon: Calendar,
							tone: "primary"
						},
						{
							label: "Engagement Analytics",
							path: "/meetings/engagement-analytics",
							icon: TrendingUp,
							tone: "info"
						}
					].map((item) => /* @__PURE__ */ jsx(Link, {
						to: item.path,
						children: /* @__PURE__ */ jsxs("div", {
							className: cn("flex flex-col items-center gap-2 rounded-xl border border-border/60 p-4 text-center hover:-translate-y-0.5 hover:shadow-md transition-all cursor-pointer"),
							children: [/* @__PURE__ */ jsx("div", {
								className: cn("grid h-10 w-10 place-items-center rounded-xl", toneMap[item.tone]),
								children: /* @__PURE__ */ jsx(item.icon, { className: "h-5 w-5" })
							}), /* @__PURE__ */ jsx("span", {
								className: "text-xs font-medium",
								children: item.label
							})]
						})
					}, item.path))
				})]
			})
		]
	})] });
}
//#endregion
export { MeetingsDashboardPage as component };

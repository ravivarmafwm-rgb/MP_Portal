import { m as fetchCalendarEvents } from "./api-CQX857SN.js";
import { t as cn } from "./utils-C_uf36nf.js";
import { t as Button } from "./button-Bq5vK6RO.js";
import { t as Card } from "./card-CzXpCsbD.js";
import { t as Badge } from "./badge-D1Dupn2y.js";
import { t as Skeleton } from "./skeleton-D9W9wFsj.js";
import { t as PageHeader } from "./PageHeader-B7gZRr0G.js";
import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useQuery } from "@tanstack/react-query";
import { Building2, Calendar, CalendarDays, ChevronLeft, ChevronRight, MapPin, Users } from "lucide-react";
import { motion } from "framer-motion";
//#region src/routes/_app.meetings.calendar.tsx?tsr-split=component
var EVENT_COLORS = {
	appointment: {
		bg: "bg-primary/15",
		text: "text-primary",
		label: "Appointment",
		icon: CalendarDays
	},
	public_meeting: {
		bg: "bg-info/15",
		text: "text-info",
		label: "Public Meeting",
		icon: Building2
	},
	tour: {
		bg: "bg-success/15",
		text: "text-success",
		label: "Tour",
		icon: MapPin
	},
	janata_darbar: {
		bg: "bg-warning/15",
		text: "text-warning",
		label: "Janata Darbar",
		icon: Users
	}
};
var DAYS = [
	"Sun",
	"Mon",
	"Tue",
	"Wed",
	"Thu",
	"Fri",
	"Sat"
];
var MONTHS = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December"
];
function CalendarPage() {
	const [currentDate, setCurrentDate] = useState(/* @__PURE__ */ new Date());
	const [view, setView] = useState("month");
	const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
	const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
	const { data, isLoading } = useQuery({
		queryKey: [
			"calendar",
			currentDate.getFullYear(),
			currentDate.getMonth()
		],
		queryFn: () => fetchCalendarEvents(startOfMonth.toISOString().substring(0, 10), endOfMonth.toISOString().substring(0, 10)),
		staleTime: 6e4
	});
	const events = data?.events ?? [];
	const calendarDays = useMemo(() => {
		const days = [];
		const firstDay = startOfMonth.getDay();
		const daysInMonth = endOfMonth.getDate();
		const daysInPrevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate();
		for (let i = firstDay - 1; i >= 0; i--) {
			const d = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, daysInPrevMonth - i);
			days.push({
				date: d,
				inMonth: false,
				events: []
			});
		}
		for (let i = 1; i <= daysInMonth; i++) {
			const d = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);
			const dateStr = d.toISOString().substring(0, 10);
			const dayEvents = events.filter((e) => String(e.date ?? "").substring(0, 10) === dateStr);
			days.push({
				date: d,
				inMonth: true,
				events: dayEvents
			});
		}
		const remaining = 42 - days.length;
		for (let i = 1; i <= remaining; i++) {
			const d = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, i);
			days.push({
				date: d,
				inMonth: false,
				events: []
			});
		}
		return days;
	}, [currentDate, events]);
	const today = (/* @__PURE__ */ new Date()).toISOString().substring(0, 10);
	const prevMonth = () => setCurrentDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));
	const nextMonth = () => setCurrentDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));
	const eventCounts = events.reduce((acc, e) => {
		const t = String(e.type ?? "");
		acc[t] = (acc[t] ?? 0) + 1;
		return acc;
	}, {});
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(PageHeader, {
		title: "Master Calendar",
		description: "All appointments, public meetings, tours and Janata Darbar in one view"
	}), /* @__PURE__ */ jsxs("div", {
		className: "space-y-4 p-4 md:p-8",
		children: [
			/* @__PURE__ */ jsxs(Card, {
				className: "p-4",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex flex-wrap items-center justify-between gap-3",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-2",
						children: [
							/* @__PURE__ */ jsx(Button, {
								variant: "outline",
								size: "icon",
								onClick: prevMonth,
								children: /* @__PURE__ */ jsx(ChevronLeft, { className: "h-4 w-4" })
							}),
							/* @__PURE__ */ jsxs("h2", {
								className: "font-display text-xl font-bold min-w-[200px] text-center",
								children: [
									MONTHS[currentDate.getMonth()],
									" ",
									currentDate.getFullYear()
								]
							}),
							/* @__PURE__ */ jsx(Button, {
								variant: "outline",
								size: "icon",
								onClick: nextMonth,
								children: /* @__PURE__ */ jsx(ChevronRight, { className: "h-4 w-4" })
							}),
							/* @__PURE__ */ jsx(Button, {
								variant: "outline",
								size: "sm",
								onClick: () => setCurrentDate(/* @__PURE__ */ new Date()),
								children: "Today"
							})
						]
					}), /* @__PURE__ */ jsx("div", {
						className: "flex items-center gap-2",
						children: /* @__PURE__ */ jsx("div", {
							className: "flex gap-1.5",
							children: [
								"month",
								"week",
								"agenda"
							].map((v) => /* @__PURE__ */ jsx(Button, {
								size: "sm",
								variant: view === v ? "default" : "outline",
								onClick: () => setView(v),
								className: "capitalize",
								children: v
							}, v))
						})
					})]
				}), /* @__PURE__ */ jsx("div", {
					className: "mt-3 flex flex-wrap gap-2",
					children: Object.entries(EVENT_COLORS).map(([type, meta]) => /* @__PURE__ */ jsxs("div", {
						className: cn("flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium", meta.bg, meta.text),
						children: [
							/* @__PURE__ */ jsx(meta.icon, { className: "h-3 w-3" }),
							meta.label,
							eventCounts[type] ? /* @__PURE__ */ jsxs("span", {
								className: "font-bold",
								children: [
									"(",
									eventCounts[type],
									")"
								]
							}) : null
						]
					}, type))
				})]
			}),
			view === "month" && /* @__PURE__ */ jsxs(Card, {
				className: "overflow-hidden",
				children: [/* @__PURE__ */ jsx("div", {
					className: "grid grid-cols-7 border-b border-border/70",
					children: DAYS.map((d) => /* @__PURE__ */ jsx("div", {
						className: "py-2 text-center text-xs font-semibold text-muted-foreground",
						children: d
					}, d))
				}), isLoading ? /* @__PURE__ */ jsx("div", {
					className: "grid grid-cols-7",
					children: Array.from({ length: 42 }).map((_, i) => /* @__PURE__ */ jsx("div", {
						className: "h-24 border-b border-r border-border/40 p-1",
						children: /* @__PURE__ */ jsx(Skeleton, { className: "h-4 w-6" })
					}, i))
				}) : /* @__PURE__ */ jsx("div", {
					className: "grid grid-cols-7",
					children: calendarDays.map(({ date, inMonth, events: dayEvents }, i) => {
						const isToday = date.toISOString().substring(0, 10) === today;
						return /* @__PURE__ */ jsxs("div", {
							className: cn("min-h-[96px] border-b border-r border-border/40 p-1.5 overflow-hidden", !inMonth && "bg-muted/20", isToday && "bg-primary/5"),
							children: [/* @__PURE__ */ jsx("div", {
								className: cn("flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold mb-1", isToday ? "bg-primary text-primary-foreground" : inMonth ? "text-foreground" : "text-muted-foreground/50"),
								children: date.getDate()
							}), /* @__PURE__ */ jsxs("div", {
								className: "space-y-0.5",
								children: [dayEvents.slice(0, 3).map((ev, ei) => {
									const meta = EVENT_COLORS[String(ev.type ?? "")] ?? EVENT_COLORS.appointment;
									return /* @__PURE__ */ jsx("div", {
										className: cn("rounded px-1 py-0.5 text-[10px] font-medium truncate cursor-pointer hover:opacity-80", meta.bg, meta.text),
										children: String(ev.title ?? "").substring(0, 20)
									}, ei);
								}), dayEvents.length > 3 && /* @__PURE__ */ jsxs("div", {
									className: "text-[10px] text-muted-foreground pl-1",
									children: [
										"+",
										dayEvents.length - 3,
										" more"
									]
								})]
							})]
						}, i);
					})
				})]
			}),
			view === "agenda" && /* @__PURE__ */ jsx(Card, {
				className: "overflow-hidden divide-y divide-border/60",
				children: isLoading ? /* @__PURE__ */ jsx("div", {
					className: "space-y-2 p-4",
					children: Array.from({ length: 8 }).map((_, i) => /* @__PURE__ */ jsx(Skeleton, { className: "h-14" }, i))
				}) : events.length === 0 ? /* @__PURE__ */ jsxs("div", {
					className: "py-16 text-center text-sm text-muted-foreground",
					children: [/* @__PURE__ */ jsx(Calendar, { className: "h-10 w-10 mx-auto text-muted-foreground/40 mb-2" }), "No events this month"]
				}) : events.map((ev, i) => {
					const meta = EVENT_COLORS[String(ev.type ?? "")] ?? EVENT_COLORS.appointment;
					return /* @__PURE__ */ jsxs(motion.div, {
						initial: { opacity: 0 },
						animate: { opacity: 1 },
						transition: { delay: i * .02 },
						className: "flex items-center gap-4 p-4 hover:bg-muted/30 transition-colors",
						children: [
							/* @__PURE__ */ jsx("div", {
								className: cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-lg", meta.bg, meta.text),
								children: /* @__PURE__ */ jsx(meta.icon, { className: "h-5 w-5" })
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ jsx("p", {
									className: "text-sm font-semibold truncate",
									children: String(ev.title ?? "")
								}), /* @__PURE__ */ jsxs("p", {
									className: "text-xs text-muted-foreground",
									children: [
										String(ev.date ?? "").substring(0, 10),
										" ",
										ev.time ? `· ${String(ev.time)}` : ""
									]
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ jsx(Badge, {
									variant: "secondary",
									className: cn("text-[10px]", meta.bg, meta.text),
									children: meta.label
								}), /* @__PURE__ */ jsx(Badge, {
									variant: "secondary",
									className: "text-[10px] capitalize",
									children: String(ev.status ?? "")
								})]
							})
						]
					}, String(ev.id ?? i));
				})
			}),
			/* @__PURE__ */ jsx("div", {
				className: "flex flex-wrap gap-3",
				children: [
					{
						label: "Appointments",
						path: "/meetings/appointments",
						icon: CalendarDays,
						tone: "bg-primary/10 text-primary"
					},
					{
						label: "Janata Darbar",
						path: "/meetings/janata-darbar",
						icon: Users,
						tone: "bg-warning/15 text-warning"
					},
					{
						label: "Public Meetings",
						path: "/meetings/public-meetings",
						icon: Building2,
						tone: "bg-info/10 text-info"
					},
					{
						label: "Tours",
						path: "/meetings/tours",
						icon: MapPin,
						tone: "bg-success/10 text-success"
					}
				].map((item) => /* @__PURE__ */ jsx(Link, {
					to: item.path,
					children: /* @__PURE__ */ jsxs(Button, {
						variant: "outline",
						size: "sm",
						className: "gap-1.5",
						children: [/* @__PURE__ */ jsx("span", {
							className: cn("grid h-4 w-4 place-items-center rounded", item.tone),
							children: /* @__PURE__ */ jsx(item.icon, { className: "h-3 w-3" })
						}), item.label]
					})
				}, item.path))
			})
		]
	})] });
}
//#endregion
export { CalendarPage as component };

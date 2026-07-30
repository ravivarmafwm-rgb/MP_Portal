import { t as cn } from "./utils-C_uf36nf.js";
import { t as Button } from "./button-Bq5vK6RO.js";
import { t as Card } from "./card-CzXpCsbD.js";
import { t as Badge } from "./badge-D1Dupn2y.js";
import { n as AvatarFallback, t as Avatar } from "./avatar-CiQwCJNR.js";
import { t as PageHeader } from "./PageHeader-B7gZRr0G.js";
import { R as volunteers, n as activityLogs, x as fieldOps } from "./live-data-6hUqpYkS.js";
import { Link } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { Activity, ArrowUpRight, ClipboardCheck, FileBarChart, GraduationCap, Map, MapPin, MessageSquareWarning, Plus, Radio, Smartphone, Trophy, UserPlus, Users, Wifi } from "lucide-react";
import { motion } from "framer-motion";
//#region src/routes/_app.volunteers.index.tsx?tsr-split=component
var liveTiles = [
	{
		label: "Active Now",
		value: fieldOps.activeNow,
		icon: Radio,
		tone: "bg-success/10 text-success",
		pulse: true
	},
	{
		label: "Ongoing Surveys",
		value: fieldOps.ongoingSurveys,
		icon: ClipboardCheck,
		tone: "bg-info/10 text-info"
	},
	{
		label: "Complaints Today",
		value: fieldOps.complaintsToday,
		icon: MessageSquareWarning,
		tone: "bg-warning/15 text-warning"
	},
	{
		label: "Registrations Today",
		value: fieldOps.registrationsToday,
		icon: UserPlus,
		tone: "bg-primary/10 text-primary"
	},
	{
		label: "Villages Visited",
		value: fieldOps.villagesVisited,
		icon: MapPin,
		tone: "bg-accent text-accent-foreground"
	}
];
var quickLinks = [
	{
		title: "Directory",
		desc: "Browse all 1,842 volunteers",
		icon: Users,
		to: "/volunteers/list"
	},
	{
		title: "Performance",
		desc: "Leaderboards & rankings",
		icon: Trophy,
		to: "/volunteers/performance"
	},
	{
		title: "Activity Monitor",
		desc: "Live field activity",
		icon: Activity,
		to: "/volunteers/activity"
	},
	{
		title: "Coverage Map",
		desc: "Geographic intelligence",
		icon: Map,
		to: "/volunteers/geographic-coverage"
	},
	{
		title: "Training Center",
		desc: "Programs & certifications",
		icon: GraduationCap,
		to: "/volunteers/training"
	},
	{
		title: "Attendance",
		desc: "Daily check-ins & GPS",
		icon: Wifi,
		to: "/volunteers/attendance"
	}
];
var mobileScreens = [
	{
		title: "Field Dashboard",
		body: "Today's targets · 12 of 20 done",
		accent: "bg-primary"
	},
	{
		title: "Register Citizen",
		body: "Scan Aadhaar · Auto-fill profile",
		accent: "bg-info"
	},
	{
		title: "Survey Collection",
		body: "Farmer Welfare · 6 questions",
		accent: "bg-success"
	},
	{
		title: "File Complaint",
		body: "Category · Photo · Geotag",
		accent: "bg-warning"
	},
	{
		title: "GPS Check-in",
		body: "Madhapur Booth 32 · 09:12 AM",
		accent: "bg-destructive"
	}
];
function VolunteersHome() {
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(PageHeader, {
		title: "Field Operations Command Center",
		description: "Live status of the constituency's volunteer field force — track every check-in, registration and survey in real time.",
		actions: /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsxs(Button, {
			variant: "outline",
			size: "sm",
			className: "gap-1.5",
			children: [/* @__PURE__ */ jsx(FileBarChart, { className: "h-4 w-4" }), " Daily Report"]
		}), /* @__PURE__ */ jsxs(Button, {
			size: "sm",
			className: "gap-1.5",
			children: [/* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }), " Quick Action"]
		})] })
	}), /* @__PURE__ */ jsxs("div", {
		className: "space-y-6 p-4 md:p-8",
		children: [
			/* @__PURE__ */ jsx("div", {
				className: "grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5",
				children: liveTiles.map((t, i) => /* @__PURE__ */ jsx(motion.div, {
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
						className: "relative overflow-hidden p-4",
						children: [
							/* @__PURE__ */ jsx("div", {
								className: cn("grid h-10 w-10 place-items-center rounded-xl", t.tone),
								children: /* @__PURE__ */ jsx(t.icon, { className: "h-5 w-5" })
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "mt-3 flex items-center gap-2",
								children: [/* @__PURE__ */ jsx("span", {
									className: "text-xs font-medium uppercase tracking-wider text-muted-foreground",
									children: t.label
								}), t.pulse && /* @__PURE__ */ jsxs("span", {
									className: "relative flex h-2 w-2",
									children: [/* @__PURE__ */ jsx("span", { className: "absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" }), /* @__PURE__ */ jsx("span", { className: "relative inline-flex h-2 w-2 rounded-full bg-success" })]
								})]
							}),
							/* @__PURE__ */ jsx("div", {
								className: "mt-1 font-display text-3xl font-bold tabular-nums",
								children: t.value.toLocaleString()
							})
						]
					})
				}, t.label))
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "grid gap-6 lg:grid-cols-3",
				children: [/* @__PURE__ */ jsxs(Card, {
					className: "lg:col-span-2 p-6",
					children: [/* @__PURE__ */ jsx("div", {
						className: "mb-4 flex items-center justify-between",
						children: /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", {
							className: "font-display text-lg font-bold",
							children: "Volunteer modules"
						}), /* @__PURE__ */ jsx("p", {
							className: "text-xs text-muted-foreground",
							children: "Jump into any workflow"
						})] })
					}), /* @__PURE__ */ jsx("div", {
						className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-3",
						children: quickLinks.map((q, i) => /* @__PURE__ */ jsx(motion.div, {
							initial: {
								opacity: 0,
								y: 6
							},
							animate: {
								opacity: 1,
								y: 0
							},
							transition: { delay: i * .04 },
							children: /* @__PURE__ */ jsx(Link, {
								to: q.to,
								className: "group block",
								children: /* @__PURE__ */ jsx(Card, {
									className: "p-4 transition-all hover:-translate-y-0.5 hover:shadow-elevated",
									children: /* @__PURE__ */ jsxs("div", {
										className: "flex items-start gap-3",
										children: [/* @__PURE__ */ jsx("div", {
											className: "grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary",
											children: /* @__PURE__ */ jsx(q.icon, { className: "h-5 w-5" })
										}), /* @__PURE__ */ jsxs("div", {
											className: "min-w-0 flex-1",
											children: [/* @__PURE__ */ jsxs("div", {
												className: "flex items-center justify-between",
												children: [/* @__PURE__ */ jsx("span", {
													className: "text-sm font-semibold",
													children: q.title
												}), /* @__PURE__ */ jsx(ArrowUpRight, { className: "h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" })]
											}), /* @__PURE__ */ jsx("p", {
												className: "mt-0.5 text-xs text-muted-foreground",
												children: q.desc
											})]
										})]
									})
								})
							})
						}, q.title))
					})]
				}), /* @__PURE__ */ jsxs(Card, {
					className: "p-6",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "mb-4 flex items-center justify-between",
						children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", {
							className: "font-display text-lg font-bold",
							children: "Live field activity"
						}), /* @__PURE__ */ jsx("p", {
							className: "text-xs text-muted-foreground",
							children: "Last 4 hours"
						})] }), /* @__PURE__ */ jsx(Badge, {
							variant: "secondary",
							className: "bg-success/10 text-success",
							children: "Streaming"
						})]
					}), /* @__PURE__ */ jsx("div", {
						className: "space-y-3",
						children: activityLogs.slice(0, 6).map((a, i) => /* @__PURE__ */ jsxs(motion.div, {
							initial: {
								opacity: 0,
								x: -6
							},
							animate: {
								opacity: 1,
								x: 0
							},
							transition: { delay: i * .05 },
							className: "flex items-start gap-3 rounded-lg border border-border/60 p-2.5",
							children: [/* @__PURE__ */ jsx(Avatar, {
								className: "h-8 w-8",
								children: /* @__PURE__ */ jsx(AvatarFallback, {
									className: "text-[10px]",
									children: volunteers[i].name.split(" ").map((p) => p[0]).slice(0, 2).join("")
								})
							}), /* @__PURE__ */ jsxs("div", {
								className: "min-w-0 flex-1",
								children: [
									/* @__PURE__ */ jsxs("div", {
										className: "flex items-center justify-between gap-2",
										children: [/* @__PURE__ */ jsx("span", {
											className: "truncate text-xs font-semibold",
											children: volunteers[i].name
										}), /* @__PURE__ */ jsx(Badge, {
											variant: "outline",
											className: "shrink-0 text-[10px]",
											children: a.type
										})]
									}),
									/* @__PURE__ */ jsx("p", {
										className: "mt-0.5 truncate text-xs text-muted-foreground",
										children: a.description
									}),
									/* @__PURE__ */ jsxs("p", {
										className: "mt-0.5 text-[10px] text-muted-foreground",
										children: [
											a.village,
											" · ",
											a.date.split(" ")[1]
										]
									})
								]
							})]
						}, a.id))
					})]
				})]
			}),
			/* @__PURE__ */ jsxs(Card, {
				className: "overflow-hidden p-6",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "mb-5 flex flex-wrap items-end justify-between gap-3",
					children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", {
						className: "font-display text-lg font-bold",
						children: "Volunteer mobile app · Preview"
					}), /* @__PURE__ */ jsx("p", {
						className: "text-xs text-muted-foreground",
						children: "Future companion app — UI mockups only"
					})] }), /* @__PURE__ */ jsxs(Badge, {
						variant: "secondary",
						className: "bg-info/10 text-info gap-1",
						children: [/* @__PURE__ */ jsx(Smartphone, { className: "h-3 w-3" }), " Coming Q3 2026"]
					})]
				}), /* @__PURE__ */ jsx("div", {
					className: "flex gap-4 overflow-x-auto pb-2",
					children: mobileScreens.map((s, i) => /* @__PURE__ */ jsxs(motion.div, {
						initial: {
							opacity: 0,
							y: 12
						},
						animate: {
							opacity: 1,
							y: 0
						},
						transition: { delay: i * .08 },
						className: "shrink-0",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "relative h-[360px] w-[180px] rounded-[2rem] border-[6px] border-foreground/90 bg-background p-2 shadow-elevated",
							children: [/* @__PURE__ */ jsx("div", { className: "absolute left-1/2 top-2 z-10 h-1 w-12 -translate-x-1/2 rounded-full bg-foreground/30" }), /* @__PURE__ */ jsxs("div", {
								className: "flex h-full flex-col overflow-hidden rounded-[1.5rem] bg-muted/30",
								children: [
									/* @__PURE__ */ jsx("div", { className: cn("h-1.5 w-full", s.accent) }),
									/* @__PURE__ */ jsxs("div", {
										className: "flex-1 p-3",
										children: [
											/* @__PURE__ */ jsx("div", {
												className: "text-[10px] uppercase tracking-wider text-muted-foreground",
												children: "MP Field"
											}),
											/* @__PURE__ */ jsx("div", {
												className: "mt-1 font-display text-sm font-bold",
												children: s.title
											}),
											/* @__PURE__ */ jsxs("div", {
												className: "mt-3 space-y-1.5",
												children: [
													/* @__PURE__ */ jsx("div", { className: "h-2 w-3/4 rounded bg-foreground/10" }),
													/* @__PURE__ */ jsx("div", { className: "h-2 w-full rounded bg-foreground/10" }),
													/* @__PURE__ */ jsx("div", { className: "h-2 w-2/3 rounded bg-foreground/10" })
												]
											}),
											/* @__PURE__ */ jsx("div", {
												className: "mt-4 rounded-lg bg-background p-2 text-[10px] text-muted-foreground",
												children: s.body
											}),
											/* @__PURE__ */ jsxs("div", {
												className: "mt-3 grid grid-cols-2 gap-1.5",
												children: [
													/* @__PURE__ */ jsx("div", { className: "h-12 rounded-lg bg-primary/10" }),
													/* @__PURE__ */ jsx("div", { className: "h-12 rounded-lg bg-accent" }),
													/* @__PURE__ */ jsx("div", { className: "h-12 rounded-lg bg-info/10" }),
													/* @__PURE__ */ jsx("div", { className: "h-12 rounded-lg bg-success/10" })
												]
											})
										]
									}),
									/* @__PURE__ */ jsx("div", {
										className: "border-t border-border/60 p-2",
										children: /* @__PURE__ */ jsx("div", { className: "h-6 rounded-md bg-foreground/10" })
									})
								]
							})]
						}), /* @__PURE__ */ jsx("p", {
							className: "mt-2 text-center text-xs font-semibold",
							children: s.title
						})]
					}, s.title))
				})]
			})
		]
	})] });
}
//#endregion
export { VolunteersHome as component };

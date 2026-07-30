import { t as cn } from "./utils-C_uf36nf.js";
import { t as Button } from "./button-Bq5vK6RO.js";
import { t as Card } from "./card-CzXpCsbD.js";
import { t as Badge } from "./badge-D1Dupn2y.js";
import { n as AvatarFallback, t as Avatar } from "./avatar-CiQwCJNR.js";
import { t as PageHeader } from "./PageHeader-B7gZRr0G.js";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./tabs-CCJRliUM.js";
import { L as volunteerComplaints, N as timeline, R as volunteers, b as featuredVolunteer, j as surveyContributions, p as documents, s as attendanceCalendar } from "./live-data-6hUqpYkS.js";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-C0WYWEQX.js";
import { t as Progress } from "./progress-DOIEKRJF.js";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { Activity, Calendar, CheckCircle2, ClipboardList, Clock, Download, Eye, FileText, Mail, MapPin, MessageCircle, MessageSquareWarning, Phone, Shield, Star, Users, XCircle } from "lucide-react";
import { motion } from "framer-motion";
//#region src/routes/_app.volunteers.profile.tsx?tsr-split=component
var v = featuredVolunteer;
var overviewStats = [
	{
		label: "Citizens Registered",
		value: v.citizensRegistered,
		icon: Users
	},
	{
		label: "Surveys Completed",
		value: v.surveysCompleted,
		icon: ClipboardList
	},
	{
		label: "Complaints Filed",
		value: v.complaintsSubmitted,
		icon: MessageSquareWarning
	},
	{
		label: "Meetings Attended",
		value: v.meetingsAttended,
		icon: Calendar
	}
];
var registeredCitizens = volunteers.slice(1, 9).map((x, i) => ({
	name: x.name,
	village: x.village,
	date: `2026-06-${String(18 - i).padStart(2, "0")}`,
	verified: i % 3 !== 0
}));
function VolunteerProfilePage() {
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(PageHeader, {
		title: "Volunteer 360",
		description: "Single source of truth for every field operator — performance, history, contributions.",
		actions: /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsxs(Button, {
			variant: "outline",
			size: "sm",
			className: "gap-1.5",
			children: [/* @__PURE__ */ jsx(MessageCircle, { className: "h-4 w-4" }), " Message"]
		}), /* @__PURE__ */ jsxs(Button, {
			size: "sm",
			className: "gap-1.5",
			children: [/* @__PURE__ */ jsx(Phone, { className: "h-4 w-4" }), " Call"]
		})] })
	}), /* @__PURE__ */ jsxs("div", {
		className: "space-y-6 p-4 md:p-8",
		children: [/* @__PURE__ */ jsx(motion.div, {
			initial: {
				opacity: 0,
				y: 10
			},
			animate: {
				opacity: 1,
				y: 0
			},
			children: /* @__PURE__ */ jsxs(Card, {
				className: "overflow-hidden",
				children: [/* @__PURE__ */ jsx("div", { className: "h-24 bg-gradient-to-r from-primary/30 via-info/20 to-accent" }), /* @__PURE__ */ jsxs("div", {
					className: "grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 p-6 sm:flex sm:flex-wrap sm:justify-between",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex min-w-0 items-start gap-4",
						children: [/* @__PURE__ */ jsx(Avatar, {
							className: "-mt-12 h-20 w-20 shrink-0 ring-4 ring-background",
							children: /* @__PURE__ */ jsx(AvatarFallback, {
								className: "text-xl font-bold",
								children: v.name.split(" ").map((p) => p[0]).slice(0, 2).join("")
							})
						}), /* @__PURE__ */ jsxs("div", {
							className: "min-w-0",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "flex flex-wrap items-center gap-2",
									children: [/* @__PURE__ */ jsx("h2", {
										className: "truncate font-display text-2xl font-bold",
										children: v.name
									}), /* @__PURE__ */ jsx(Badge, {
										variant: "secondary",
										className: "bg-success/10 text-success",
										children: v.status
									})]
								}),
								/* @__PURE__ */ jsxs("p", {
									className: "text-xs text-muted-foreground",
									children: [
										"Volunteer ID · ",
										v.id,
										" · Joined ",
										v.joinedOn
									]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground",
									children: [
										/* @__PURE__ */ jsxs("span", {
											className: "inline-flex items-center gap-1",
											children: [
												/* @__PURE__ */ jsx(Phone, { className: "h-3 w-3" }),
												" ",
												v.mobile
											]
										}),
										/* @__PURE__ */ jsxs("span", {
											className: "inline-flex items-center gap-1",
											children: [
												/* @__PURE__ */ jsx(Mail, { className: "h-3 w-3" }),
												" ",
												v.email
											]
										}),
										/* @__PURE__ */ jsxs("span", {
											className: "inline-flex items-center gap-1",
											children: [
												/* @__PURE__ */ jsx(MapPin, { className: "h-3 w-3" }),
												" ",
												v.village,
												", ",
												v.mandal
											]
										})
									]
								}),
								/* @__PURE__ */ jsx("div", {
									className: "mt-3 flex flex-wrap gap-1.5",
									children: v.badges.map((b) => /* @__PURE__ */ jsxs(Badge, {
										variant: "outline",
										className: "gap-1 border-primary/30 bg-primary/5 text-primary",
										children: [
											/* @__PURE__ */ jsx(Star, { className: "h-3 w-3" }),
											" ",
											b
										]
									}, b))
								})
							]
						})]
					}), /* @__PURE__ */ jsxs("div", {
						className: "shrink-0 text-right",
						children: [
							/* @__PURE__ */ jsx("div", {
								className: "text-xs text-muted-foreground",
								children: "Activity Score"
							}),
							/* @__PURE__ */ jsx("div", {
								className: "font-display text-4xl font-bold tabular-nums text-primary",
								children: v.activityScore
							}),
							/* @__PURE__ */ jsx("div", {
								className: "mt-1 text-[10px] text-muted-foreground",
								children: "Top 5% in constituency"
							})
						]
					})]
				})]
			})
		}), /* @__PURE__ */ jsxs(Tabs, {
			defaultValue: "overview",
			className: "space-y-4",
			children: [
				/* @__PURE__ */ jsxs(TabsList, {
					className: "flex w-full flex-wrap justify-start",
					children: [
						/* @__PURE__ */ jsx(TabsTrigger, {
							value: "overview",
							children: "Overview"
						}),
						/* @__PURE__ */ jsx(TabsTrigger, {
							value: "activity",
							children: "Activity"
						}),
						/* @__PURE__ */ jsx(TabsTrigger, {
							value: "citizens",
							children: "Citizens"
						}),
						/* @__PURE__ */ jsx(TabsTrigger, {
							value: "surveys",
							children: "Surveys"
						}),
						/* @__PURE__ */ jsx(TabsTrigger, {
							value: "complaints",
							children: "Complaints"
						}),
						/* @__PURE__ */ jsx(TabsTrigger, {
							value: "attendance",
							children: "Attendance"
						}),
						/* @__PURE__ */ jsx(TabsTrigger, {
							value: "documents",
							children: "Documents"
						}),
						/* @__PURE__ */ jsx(TabsTrigger, {
							value: "timeline",
							children: "Timeline"
						})
					]
				}),
				/* @__PURE__ */ jsxs(TabsContent, {
					value: "overview",
					className: "space-y-4",
					children: [/* @__PURE__ */ jsx("div", {
						className: "grid grid-cols-2 gap-3 md:grid-cols-4",
						children: overviewStats.map((s, i) => /* @__PURE__ */ jsx(motion.div, {
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
								className: "p-4",
								children: [
									/* @__PURE__ */ jsx("div", {
										className: "grid h-9 w-9 place-items-center rounded-lg bg-primary/10 text-primary",
										children: /* @__PURE__ */ jsx(s.icon, { className: "h-4 w-4" })
									}),
									/* @__PURE__ */ jsx("div", {
										className: "mt-3 text-xs font-medium uppercase tracking-wider text-muted-foreground",
										children: s.label
									}),
									/* @__PURE__ */ jsx("div", {
										className: "mt-1 font-display text-2xl font-bold tabular-nums",
										children: s.value.toLocaleString()
									})
								]
							})
						}, s.label))
					}), /* @__PURE__ */ jsxs("div", {
						className: "grid gap-4 lg:grid-cols-3",
						children: [/* @__PURE__ */ jsxs(Card, {
							className: "p-5 lg:col-span-2",
							children: [
								/* @__PURE__ */ jsx("h3", {
									className: "font-display text-base font-bold",
									children: "Assigned coverage"
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-xs text-muted-foreground",
									children: "Cluster of 4 booths · 2,840 citizens"
								}),
								/* @__PURE__ */ jsx("div", {
									className: "mt-4 grid gap-3 sm:grid-cols-2",
									children: [
										{
											booth: "Booth 32 · Madhapur",
											citizens: 824,
											coverage: 92
										},
										{
											booth: "Booth 33 · Madhapur",
											citizens: 712,
											coverage: 84
										},
										{
											booth: "Booth 41 · Kondapur",
											citizens: 668,
											coverage: 76
										},
										{
											booth: "Booth 42 · Kondapur",
											citizens: 636,
											coverage: 70
										}
									].map((b) => /* @__PURE__ */ jsxs("div", {
										className: "rounded-lg border border-border/60 p-3",
										children: [
											/* @__PURE__ */ jsxs("div", {
												className: "flex items-center justify-between text-sm font-semibold",
												children: [/* @__PURE__ */ jsx("span", { children: b.booth }), /* @__PURE__ */ jsxs("span", {
													className: "tabular-nums text-primary",
													children: [b.coverage, "%"]
												})]
											}),
											/* @__PURE__ */ jsxs("div", {
												className: "text-xs text-muted-foreground",
												children: [b.citizens, " citizens"]
											}),
											/* @__PURE__ */ jsx(Progress, {
												value: b.coverage,
												className: "mt-2 h-1.5"
											})
										]
									}, b.booth))
								})
							]
						}), /* @__PURE__ */ jsxs(Card, {
							className: "p-5",
							children: [/* @__PURE__ */ jsx("h3", {
								className: "font-display text-base font-bold",
								children: "Performance summary"
							}), /* @__PURE__ */ jsx("div", {
								className: "mt-4 space-y-3 text-sm",
								children: [
									{
										k: "Attendance",
										v: v.attendanceRate,
										suf: "%"
									},
									{
										k: "Survey completion",
										v: 87,
										suf: "%"
									},
									{
										k: "Grievance resolution",
										v: 71,
										suf: "%"
									},
									{
										k: "Training completion",
										v: 95,
										suf: "%"
									}
								].map((m) => /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ jsx("span", {
										className: "text-xs text-muted-foreground",
										children: m.k
									}), /* @__PURE__ */ jsxs("span", {
										className: "font-semibold tabular-nums",
										children: [m.v, m.suf]
									})]
								}), /* @__PURE__ */ jsx(Progress, {
									value: m.v,
									className: "mt-1 h-1.5"
								})] }, m.k))
							})]
						})]
					})]
				}),
				/* @__PURE__ */ jsxs(TabsContent, {
					value: "activity",
					className: "space-y-4",
					children: [/* @__PURE__ */ jsx("div", {
						className: "grid grid-cols-3 gap-3",
						children: [
							"Today",
							"This Week",
							"This Month"
						].map((p, i) => /* @__PURE__ */ jsxs(Card, {
							className: "p-4",
							children: [
								/* @__PURE__ */ jsx("div", {
									className: "text-xs uppercase tracking-wider text-muted-foreground",
									children: p
								}),
								/* @__PURE__ */ jsx("div", {
									className: "mt-2 font-display text-2xl font-bold tabular-nums",
									children: [
										12,
										84,
										312
									][i]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "text-xs text-success",
									children: [
										"+",
										[
											3,
											12,
											28
										][i],
										"% vs prev"
									]
								})
							]
						}, p))
					}), /* @__PURE__ */ jsxs(Card, {
						className: "p-5",
						children: [/* @__PURE__ */ jsx("h3", {
							className: "mb-3 font-display text-base font-bold",
							children: "Recent activity"
						}), /* @__PURE__ */ jsx("div", {
							className: "space-y-2",
							children: [
								{
									t: "Registered 4 citizens at Madhapur Ward 32",
									time: "09:12 AM",
									icon: Users
								},
								{
									t: "Submitted 8 Farmer Survey responses",
									time: "11:30 AM",
									icon: ClipboardList
								},
								{
									t: "Filed water supply complaint #GR-2841",
									time: "12:45 PM",
									icon: MessageSquareWarning
								},
								{
									t: "Attended booth coordinator meeting",
									time: "02:10 PM",
									icon: Calendar
								},
								{
									t: "GPS check-out at Kondapur cluster",
									time: "06:02 PM",
									icon: MapPin
								}
							].map((a, i) => /* @__PURE__ */ jsxs(motion.div, {
								initial: {
									opacity: 0,
									x: -6
								},
								animate: {
									opacity: 1,
									x: 0
								},
								transition: { delay: i * .04 },
								className: "flex items-center gap-3 rounded-lg border border-border/60 p-3",
								children: [
									/* @__PURE__ */ jsx("div", {
										className: "grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary",
										children: /* @__PURE__ */ jsx(a.icon, { className: "h-4 w-4" })
									}),
									/* @__PURE__ */ jsx("div", {
										className: "min-w-0 flex-1 text-sm",
										children: a.t
									}),
									/* @__PURE__ */ jsx("div", {
										className: "text-xs text-muted-foreground tabular-nums",
										children: a.time
									})
								]
							}, i))
						})]
					})]
				}),
				/* @__PURE__ */ jsx(TabsContent, {
					value: "citizens",
					children: /* @__PURE__ */ jsxs(Card, {
						className: "overflow-hidden",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "border-b border-border/70 bg-muted/30 px-4 py-3 text-sm",
							children: [
								/* @__PURE__ */ jsx("span", {
									className: "font-semibold",
									children: v.citizensRegistered
								}),
								" citizens registered by ",
								v.name
							]
						}), /* @__PURE__ */ jsxs(Table, { children: [/* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
							/* @__PURE__ */ jsx(TableHead, { children: "Citizen Name" }),
							/* @__PURE__ */ jsx(TableHead, { children: "Village" }),
							/* @__PURE__ */ jsx(TableHead, { children: "Registration Date" }),
							/* @__PURE__ */ jsx(TableHead, { children: "Verification" })
						] }) }), /* @__PURE__ */ jsx(TableBody, { children: registeredCitizens.map((c, i) => /* @__PURE__ */ jsxs(TableRow, { children: [
							/* @__PURE__ */ jsx(TableCell, {
								className: "font-medium",
								children: c.name
							}),
							/* @__PURE__ */ jsx(TableCell, { children: c.village }),
							/* @__PURE__ */ jsx(TableCell, {
								className: "text-xs tabular-nums",
								children: c.date
							}),
							/* @__PURE__ */ jsx(TableCell, { children: c.verified ? /* @__PURE__ */ jsxs(Badge, {
								variant: "secondary",
								className: "bg-success/10 text-success gap-1",
								children: [/* @__PURE__ */ jsx(CheckCircle2, { className: "h-3 w-3" }), " Verified"]
							}) : /* @__PURE__ */ jsxs(Badge, {
								variant: "secondary",
								className: "bg-warning/15 text-warning gap-1",
								children: [/* @__PURE__ */ jsx(XCircle, { className: "h-3 w-3" }), " Pending"]
							}) })
						] }, i)) })] })]
					})
				}),
				/* @__PURE__ */ jsx(TabsContent, {
					value: "surveys",
					children: /* @__PURE__ */ jsx("div", {
						className: "grid gap-4 md:grid-cols-2",
						children: surveyContributions.map((s, i) => {
							const pct = Math.round(s.responses / s.target * 100);
							return /* @__PURE__ */ jsx(motion.div, {
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
									children: [
										/* @__PURE__ */ jsxs("div", {
											className: "flex items-start justify-between gap-3",
											children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
												className: "font-display text-base font-bold",
												children: s.name
											}), /* @__PURE__ */ jsxs("div", {
												className: "text-xs text-muted-foreground",
												children: ["Last submission · ", s.lastSubmission]
											})] }), /* @__PURE__ */ jsxs(Badge, {
												variant: "secondary",
												className: "bg-info/10 text-info",
												children: [pct, "%"]
											})]
										}),
										/* @__PURE__ */ jsxs("div", {
											className: "mt-4 flex items-baseline gap-2",
											children: [/* @__PURE__ */ jsx("span", {
												className: "font-display text-3xl font-bold tabular-nums",
												children: s.responses
											}), /* @__PURE__ */ jsxs("span", {
												className: "text-sm text-muted-foreground",
												children: [
													"/ ",
													s.target,
													" target"
												]
											})]
										}),
										/* @__PURE__ */ jsx(Progress, {
											value: pct,
											className: "mt-3 h-2"
										})
									]
								})
							}, s.id);
						})
					})
				}),
				/* @__PURE__ */ jsx(TabsContent, {
					value: "complaints",
					children: /* @__PURE__ */ jsx(Card, {
						className: "overflow-hidden",
						children: /* @__PURE__ */ jsxs(Table, { children: [/* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
							/* @__PURE__ */ jsx(TableHead, { children: "Complaint ID" }),
							/* @__PURE__ */ jsx(TableHead, { children: "Citizen" }),
							/* @__PURE__ */ jsx(TableHead, { children: "Category" }),
							/* @__PURE__ */ jsx(TableHead, { children: "Filed" }),
							/* @__PURE__ */ jsx(TableHead, { children: "Status" })
						] }) }), /* @__PURE__ */ jsx(TableBody, { children: volunteerComplaints.map((c) => /* @__PURE__ */ jsxs(TableRow, { children: [
							/* @__PURE__ */ jsx(TableCell, {
								className: "font-mono text-xs",
								children: c.id
							}),
							/* @__PURE__ */ jsx(TableCell, {
								className: "font-medium",
								children: c.citizen
							}),
							/* @__PURE__ */ jsx(TableCell, { children: c.category }),
							/* @__PURE__ */ jsx(TableCell, {
								className: "text-xs tabular-nums",
								children: c.filedOn
							}),
							/* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(Badge, {
								variant: "secondary",
								className: c.status === "Resolved" ? "bg-success/10 text-success" : c.status === "In Progress" ? "bg-info/10 text-info" : "bg-warning/15 text-warning",
								children: c.status
							}) })
						] }, c.id)) })] })
					})
				}),
				/* @__PURE__ */ jsxs(TabsContent, {
					value: "attendance",
					className: "space-y-4",
					children: [/* @__PURE__ */ jsx("div", {
						className: "grid grid-cols-2 gap-3 md:grid-cols-4",
						children: [
							{
								l: "Present",
								v: 22,
								tone: "text-success"
							},
							{
								l: "Absent",
								v: 3,
								tone: "text-destructive"
							},
							{
								l: "Field Visits",
								v: 18,
								tone: "text-info"
							},
							{
								l: "GPS Check-ins",
								v: 96,
								tone: "text-primary"
							}
						].map((s) => /* @__PURE__ */ jsxs(Card, {
							className: "p-4",
							children: [/* @__PURE__ */ jsx("div", {
								className: "text-xs uppercase tracking-wider text-muted-foreground",
								children: s.l
							}), /* @__PURE__ */ jsx("div", {
								className: cn("mt-1 font-display text-2xl font-bold tabular-nums", s.tone),
								children: s.v
							})]
						}, s.l))
					}), /* @__PURE__ */ jsxs(Card, {
						className: "p-5",
						children: [
							/* @__PURE__ */ jsx("h3", {
								className: "mb-3 font-display text-base font-bold",
								children: "June 2026 attendance"
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
									const tone = d.status === "P" ? "bg-success/15 text-success border-success/30" : d.status === "F" ? "bg-info/15 text-info border-info/30" : d.status === "L" ? "bg-warning/15 text-warning border-warning/30" : "bg-destructive/15 text-destructive border-destructive/30";
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
										className: cn("aspect-square rounded-md border text-center text-xs font-bold", tone),
										children: [/* @__PURE__ */ jsx("div", {
											className: "pt-1.5 tabular-nums",
											children: d.date
										}), /* @__PURE__ */ jsx("div", {
											className: "text-[9px] font-normal opacity-70",
											children: d.status
										})]
									}, i);
								})
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "mt-3 flex flex-wrap gap-3 text-[11px] text-muted-foreground",
								children: [
									/* @__PURE__ */ jsxs("span", {
										className: "inline-flex items-center gap-1",
										children: [/* @__PURE__ */ jsx("span", { className: "h-2 w-2 rounded-sm bg-success" }), " Present"]
									}),
									/* @__PURE__ */ jsxs("span", {
										className: "inline-flex items-center gap-1",
										children: [/* @__PURE__ */ jsx("span", { className: "h-2 w-2 rounded-sm bg-info" }), " Field Visit"]
									}),
									/* @__PURE__ */ jsxs("span", {
										className: "inline-flex items-center gap-1",
										children: [/* @__PURE__ */ jsx("span", { className: "h-2 w-2 rounded-sm bg-warning" }), " Leave"]
									}),
									/* @__PURE__ */ jsxs("span", {
										className: "inline-flex items-center gap-1",
										children: [/* @__PURE__ */ jsx("span", { className: "h-2 w-2 rounded-sm bg-destructive" }), " Absent"]
									})
								]
							})
						]
					})]
				}),
				/* @__PURE__ */ jsx(TabsContent, {
					value: "documents",
					children: /* @__PURE__ */ jsx("div", {
						className: "grid gap-3 md:grid-cols-2 lg:grid-cols-3",
						children: documents.map((d, i) => /* @__PURE__ */ jsx(motion.div, {
							initial: {
								opacity: 0,
								y: 6
							},
							animate: {
								opacity: 1,
								y: 0
							},
							transition: { delay: i * .04 },
							children: /* @__PURE__ */ jsx(Card, {
								className: "p-4",
								children: /* @__PURE__ */ jsxs("div", {
									className: "flex items-start gap-3",
									children: [/* @__PURE__ */ jsx("div", {
										className: "grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary",
										children: /* @__PURE__ */ jsx(FileText, { className: "h-5 w-5" })
									}), /* @__PURE__ */ jsxs("div", {
										className: "min-w-0 flex-1",
										children: [
											/* @__PURE__ */ jsxs("div", {
												className: "flex items-center justify-between",
												children: [/* @__PURE__ */ jsx("span", {
													className: "truncate text-sm font-semibold",
													children: d.name
												}), d.verified ? /* @__PURE__ */ jsx(Shield, { className: "h-3.5 w-3.5 text-success" }) : /* @__PURE__ */ jsx(Clock, { className: "h-3.5 w-3.5 text-warning" })]
											}),
											/* @__PURE__ */ jsxs("div", {
												className: "text-xs text-muted-foreground",
												children: [
													d.type,
													" · ",
													d.uploadedOn
												]
											}),
											/* @__PURE__ */ jsxs("div", {
												className: "mt-3 flex gap-1.5",
												children: [/* @__PURE__ */ jsxs(Button, {
													variant: "outline",
													size: "sm",
													className: "h-7 gap-1 text-xs",
													children: [/* @__PURE__ */ jsx(Eye, { className: "h-3 w-3" }), " Preview"]
												}), /* @__PURE__ */ jsxs(Button, {
													variant: "outline",
													size: "sm",
													className: "h-7 gap-1 text-xs",
													children: [/* @__PURE__ */ jsx(Download, { className: "h-3 w-3" }), " Download"]
												})]
											})
										]
									})]
								})
							})
						}, d.id))
					})
				}),
				/* @__PURE__ */ jsx(TabsContent, {
					value: "timeline",
					children: /* @__PURE__ */ jsx(Card, {
						className: "p-6",
						children: /* @__PURE__ */ jsx("ol", {
							className: "relative ml-3 border-l border-border/70",
							children: timeline.map((t, i) => /* @__PURE__ */ jsxs(motion.li, {
								initial: {
									opacity: 0,
									x: -6
								},
								animate: {
									opacity: 1,
									x: 0
								},
								transition: { delay: i * .06 },
								className: "mb-6 ml-6",
								children: [
									/* @__PURE__ */ jsx("span", {
										className: "absolute -left-3 grid h-6 w-6 place-items-center rounded-full bg-primary text-primary-foreground",
										children: /* @__PURE__ */ jsx(Activity, { className: "h-3 w-3" })
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ jsx(Badge, {
											variant: "outline",
											className: "text-[10px]",
											children: t.type
										}), /* @__PURE__ */ jsx("span", {
											className: "text-xs text-muted-foreground tabular-nums",
											children: t.date
										})]
									}),
									/* @__PURE__ */ jsx("p", {
										className: "mt-1 text-sm font-semibold",
										children: t.event
									})
								]
							}, t.id))
						})
					})
				})
			]
		})]
	})] });
}
//#endregion
export { VolunteerProfilePage as component };

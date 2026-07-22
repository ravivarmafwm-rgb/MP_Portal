import { Y as updateAppointment, p as fetchAppointments } from "./api-CQX857SN.js";
import { t as cn } from "./utils-C_uf36nf.js";
import { t as Button } from "./button-Bq5vK6RO.js";
import { t as Card } from "./card-CzXpCsbD.js";
import { t as Badge } from "./badge-D1Dupn2y.js";
import { t as Skeleton } from "./skeleton-D9W9wFsj.js";
import { t as PageHeader } from "./PageHeader-B7gZRr0G.js";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./tabs-CCJRliUM.js";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-Dg1urBTx.js";
import { Link, useSearch } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AlertCircle, ArrowLeft, CalendarDays, CheckCircle2, ClipboardList, Clock, FileText, Link2, MapPin, MessageSquare, Phone, Star, User } from "lucide-react";
import { motion } from "framer-motion";
//#region src/routes/_app.meetings.appointment-detail.tsx?tsr-split=component
var statusTone = {
	pending: "bg-warning/15 text-warning",
	confirmed: "bg-info/10 text-info",
	completed: "bg-success/10 text-success",
	cancelled: "bg-muted text-muted-foreground",
	rescheduled: "bg-primary/10 text-primary",
	no_show: "bg-destructive/10 text-destructive"
};
var priorityTone = {
	urgent: "bg-destructive/10 text-destructive",
	high: "bg-warning/15 text-warning",
	medium: "bg-info/10 text-info",
	low: "bg-muted text-muted-foreground"
};
function AppointmentDetailPage() {
	const { id } = useSearch({ from: "/_app/meetings/appointment-detail" });
	const qc = useQueryClient();
	const { data: list } = useQuery({
		queryKey: ["appointments", "all"],
		queryFn: () => fetchAppointments({ per_page: 100 }),
		staleTime: 3e4
	});
	const appointment = id ? list?.data?.find((a) => a.id === id) ?? list?.data?.[0] : list?.data?.[0];
	const { mutate: doUpdate, isPending: updating } = useMutation({
		mutationFn: ({ status }) => updateAppointment(String(appointment?.id ?? ""), { status }),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["appointments"] });
			toast.success("Appointment updated");
		},
		onError: () => toast.error("Update failed")
	});
	if (!appointment) return /* @__PURE__ */ jsxs("div", {
		className: "p-8 space-y-4",
		children: [/* @__PURE__ */ jsx(Skeleton, { className: "h-12 w-full" }), /* @__PURE__ */ jsx(Skeleton, { className: "h-64 w-full" })]
	});
	const a = appointment;
	const timeline = [
		{
			step: "Request Submitted",
			date: String(a.created_at ?? "").substring(0, 10),
			done: true,
			icon: ClipboardList
		},
		{
			step: "Under Review",
			date: String(a.requested_date ?? "").substring(0, 10),
			done: [
				"confirmed",
				"completed",
				"cancelled"
			].includes(String(a.status)),
			icon: Clock
		},
		{
			step: "Confirmed",
			date: String(a.scheduled_date ?? "").substring(0, 10) || "—",
			done: ["confirmed", "completed"].includes(String(a.status)),
			icon: CheckCircle2
		},
		{
			step: "Meeting Conducted",
			date: String(a.scheduled_date ?? "").substring(0, 10) || "—",
			done: a.status === "completed",
			icon: User
		},
		{
			step: "Follow-Up Completed",
			date: String(a.follow_up_date ?? "").substring(0, 10) || "—",
			done: Boolean(a.follow_up_completed),
			icon: CheckCircle2
		}
	];
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(PageHeader, {
		title: `Appointment ${String(a.token_number ?? a.appointment_number ?? "")}`,
		description: "Complete appointment journey and citizen interaction view",
		actions: /* @__PURE__ */ jsx(Button, {
			variant: "outline",
			size: "sm",
			asChild: true,
			children: /* @__PURE__ */ jsxs(Link, {
				to: "/meetings/appointments",
				children: [/* @__PURE__ */ jsx(ArrowLeft, { className: "h-4 w-4 mr-1.5" }), " Back"]
			})
		})
	}), /* @__PURE__ */ jsxs("div", {
		className: "space-y-6 p-4 md:p-8",
		children: [/* @__PURE__ */ jsx(Card, {
			className: "p-6",
			children: /* @__PURE__ */ jsxs("div", {
				className: "flex flex-wrap items-start gap-4 justify-between",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-4",
					children: [/* @__PURE__ */ jsx("div", {
						className: "grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 text-primary shrink-0",
						children: /* @__PURE__ */ jsx(User, { className: "h-7 w-7" })
					}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h2", {
						className: "text-xl font-bold",
						children: String(a.citizen_name ?? "")
					}), /* @__PURE__ */ jsxs("div", {
						className: "flex flex-wrap gap-3 mt-1 text-sm text-muted-foreground",
						children: [
							/* @__PURE__ */ jsxs("span", {
								className: "flex items-center gap-1",
								children: [/* @__PURE__ */ jsx(Phone, { className: "h-3.5 w-3.5" }), String(a.citizen_mobile ?? "—")]
							}),
							/* @__PURE__ */ jsxs("span", {
								className: "flex items-center gap-1",
								children: [
									/* @__PURE__ */ jsx(MapPin, { className: "h-3.5 w-3.5" }),
									String(a.citizen_village ?? "—"),
									", ",
									String(a.citizen_mandal ?? "")
								]
							}),
							/* @__PURE__ */ jsxs("span", {
								className: "flex items-center gap-1",
								children: [
									/* @__PURE__ */ jsx(CalendarDays, { className: "h-3.5 w-3.5" }),
									"Requested: ",
									String(a.requested_date ?? "").substring(0, 10)
								]
							})
						]
					})] })]
				}), /* @__PURE__ */ jsxs("div", {
					className: "flex flex-wrap items-center gap-2",
					children: [
						/* @__PURE__ */ jsx(Badge, {
							variant: "secondary",
							className: cn("text-xs", priorityTone[String(a.priority ?? "medium")]),
							children: String(a.priority ?? "").toUpperCase()
						}),
						/* @__PURE__ */ jsx(Badge, {
							variant: "secondary",
							className: cn("text-xs", statusTone[String(a.status ?? "pending")]),
							children: String(a.status ?? "").replace("_", " ")
						}),
						/* @__PURE__ */ jsxs(Select, {
							defaultValue: String(a.status ?? "pending"),
							onValueChange: (v) => doUpdate({ status: v }),
							children: [/* @__PURE__ */ jsx(SelectTrigger, {
								className: "h-8 w-[150px] text-xs",
								children: /* @__PURE__ */ jsx(SelectValue, {})
							}), /* @__PURE__ */ jsxs(SelectContent, { children: [
								/* @__PURE__ */ jsx(SelectItem, {
									value: "pending",
									children: "Pending"
								}),
								/* @__PURE__ */ jsx(SelectItem, {
									value: "confirmed",
									children: "Confirm"
								}),
								/* @__PURE__ */ jsx(SelectItem, {
									value: "completed",
									children: "Mark Completed"
								}),
								/* @__PURE__ */ jsx(SelectItem, {
									value: "cancelled",
									children: "Cancel"
								}),
								/* @__PURE__ */ jsx(SelectItem, {
									value: "rescheduled",
									children: "Rescheduled"
								}),
								/* @__PURE__ */ jsx(SelectItem, {
									value: "no_show",
									children: "No Show"
								})
							] })]
						})
					]
				})]
			})
		}), /* @__PURE__ */ jsxs(Tabs, {
			defaultValue: "overview",
			className: "space-y-4",
			children: [
				/* @__PURE__ */ jsxs(TabsList, {
					className: "flex flex-wrap gap-1 h-auto",
					children: [
						/* @__PURE__ */ jsx(TabsTrigger, {
							value: "overview",
							children: "Overview"
						}),
						/* @__PURE__ */ jsx(TabsTrigger, {
							value: "citizen",
							children: "Citizen Profile"
						}),
						/* @__PURE__ */ jsx(TabsTrigger, {
							value: "complaints",
							children: "Related Complaints"
						}),
						/* @__PURE__ */ jsx(TabsTrigger, {
							value: "schemes",
							children: "Related Schemes"
						}),
						/* @__PURE__ */ jsx(TabsTrigger, {
							value: "documents",
							children: "Documents"
						}),
						/* @__PURE__ */ jsx(TabsTrigger, {
							value: "notes",
							children: "Meeting Notes"
						}),
						/* @__PURE__ */ jsx(TabsTrigger, {
							value: "timeline",
							children: "Timeline"
						})
					]
				}),
				/* @__PURE__ */ jsx(TabsContent, {
					value: "overview",
					children: /* @__PURE__ */ jsxs("div", {
						className: "grid gap-4 sm:grid-cols-2",
						children: [/* @__PURE__ */ jsxs(Card, {
							className: "p-5 space-y-4",
							children: [/* @__PURE__ */ jsxs("h4", {
								className: "font-semibold flex items-center gap-2",
								children: [/* @__PURE__ */ jsx(FileText, { className: "h-4 w-4 text-primary" }), "Meeting Details"]
							}), [
								{
									label: "Appointment #",
									value: String(a.appointment_number ?? "—")
								},
								{
									label: "Token",
									value: String(a.token_number ?? "—")
								},
								{
									label: "Purpose",
									value: String(a.purpose ?? "—")
								},
								{
									label: "Category",
									value: String(a.category ?? "—")
								},
								{
									label: "Meeting Type",
									value: String(a.meeting_type ?? "—").replace("_", " ")
								},
								{
									label: "Venue",
									value: String(a.venue ?? "MP Office")
								},
								{
									label: "Duration",
									value: `${String(a.duration_minutes ?? "30")} minutes`
								},
								{
									label: "Scheduled Date",
									value: String(a.scheduled_date ?? "—").substring(0, 10)
								},
								{
									label: "Scheduled Time",
									value: String(a.scheduled_time ?? "TBD")
								}
							].map((row) => /* @__PURE__ */ jsxs("div", {
								className: "flex justify-between text-sm",
								children: [/* @__PURE__ */ jsx("span", {
									className: "text-muted-foreground",
									children: row.label
								}), /* @__PURE__ */ jsx("span", {
									className: "font-medium text-right max-w-[60%]",
									children: row.value
								})]
							}, row.label))]
						}), /* @__PURE__ */ jsxs("div", {
							className: "space-y-4",
							children: [/* @__PURE__ */ jsxs(Card, {
								className: "p-5",
								children: [/* @__PURE__ */ jsx("h4", {
									className: "font-semibold mb-3",
									children: "Outcome & Follow-up"
								}), /* @__PURE__ */ jsxs("div", {
									className: "space-y-2 text-sm",
									children: [
										/* @__PURE__ */ jsx("div", {
											className: "text-muted-foreground",
											children: "Meeting Outcome"
										}),
										/* @__PURE__ */ jsx("p", {
											className: "text-sm rounded-lg bg-muted/40 p-3",
											children: String(a.meeting_outcome ?? "Not yet completed")
										}),
										/* @__PURE__ */ jsx("div", {
											className: "text-muted-foreground mt-2",
											children: "Action Items"
										}),
										/* @__PURE__ */ jsx("p", {
											className: "text-sm rounded-lg bg-muted/40 p-3",
											children: String(a.action_items ?? "—")
										}),
										a.follow_up_required && /* @__PURE__ */ jsxs("div", {
											className: "flex items-center gap-2 rounded-lg bg-warning/10 p-2 text-warning text-xs mt-2",
											children: [
												/* @__PURE__ */ jsx(AlertCircle, { className: "h-4 w-4 shrink-0" }),
												"Follow-up required by ",
												String(a.follow_up_date ?? "—").substring(0, 10)
											]
										})
									]
								})]
							}), a.satisfaction_rating && /* @__PURE__ */ jsxs(Card, {
								className: "p-5",
								children: [
									/* @__PURE__ */ jsx("h4", {
										className: "font-semibold mb-3",
										children: "Citizen Satisfaction"
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "flex items-center gap-2",
										children: [Array.from({ length: 5 }).map((_, i) => /* @__PURE__ */ jsx(Star, { className: cn("h-6 w-6", i < Number(a.satisfaction_rating ?? 0) ? "fill-warning text-warning" : "text-muted") }, i)), /* @__PURE__ */ jsxs("span", {
											className: "text-sm font-semibold ml-1",
											children: [Number(a.satisfaction_rating), "/5"]
										})]
									}),
									a.citizen_feedback && /* @__PURE__ */ jsx("p", {
										className: "text-sm text-muted-foreground mt-2",
										children: String(a.citizen_feedback)
									})
								]
							})]
						})]
					})
				}),
				/* @__PURE__ */ jsx(TabsContent, {
					value: "citizen",
					children: /* @__PURE__ */ jsxs(Card, {
						className: "p-6",
						children: [
							/* @__PURE__ */ jsxs("h4", {
								className: "font-semibold mb-4 flex items-center gap-2",
								children: [/* @__PURE__ */ jsx(User, { className: "h-4 w-4 text-primary" }), "Citizen Snapshot"]
							}),
							/* @__PURE__ */ jsx("div", {
								className: "grid gap-3 sm:grid-cols-2",
								children: [
									{
										label: "Name",
										value: String(a.citizen_name ?? "—")
									},
									{
										label: "Mobile",
										value: String(a.citizen_mobile ?? "—")
									},
									{
										label: "Village",
										value: String(a.citizen_village ?? "—")
									},
									{
										label: "Mandal",
										value: String(a.citizen_mandal ?? "—")
									},
									{
										label: "Submitted Via",
										value: String(a.created_via ?? "office").replace("_", " ")
									},
									{
										label: "Queue Position",
										value: String(a.queue_position ?? "—")
									}
								].map((row) => /* @__PURE__ */ jsxs("div", {
									className: "flex justify-between text-sm border-b border-border/40 pb-2",
									children: [/* @__PURE__ */ jsx("span", {
										className: "text-muted-foreground",
										children: row.label
									}), /* @__PURE__ */ jsx("span", {
										className: "font-medium",
										children: row.value
									})]
								}, row.label))
							}),
							a.citizen_id && /* @__PURE__ */ jsx("div", {
								className: "mt-4",
								children: /* @__PURE__ */ jsx(Button, {
									asChild: true,
									variant: "outline",
									size: "sm",
									children: /* @__PURE__ */ jsxs(Link, {
										to: "/citizens/profile",
										search: { id: String(a.citizen_id) },
										children: [/* @__PURE__ */ jsx(Link2, { className: "h-4 w-4 mr-1.5" }), "View Full Citizen 360"]
									})
								})
							})
						]
					})
				}),
				/* @__PURE__ */ jsx(TabsContent, {
					value: "complaints",
					children: /* @__PURE__ */ jsxs(Card, {
						className: "p-6",
						children: [/* @__PURE__ */ jsxs("h4", {
							className: "font-semibold mb-4 flex items-center gap-2",
							children: [/* @__PURE__ */ jsx(AlertCircle, { className: "h-4 w-4 text-destructive" }), "Related Grievances"]
						}), a.grievance_id ? /* @__PURE__ */ jsxs("div", {
							className: "rounded-lg border border-border/60 p-4",
							children: [/* @__PURE__ */ jsx("p", {
								className: "text-sm font-medium",
								children: "Linked grievance found"
							}), /* @__PURE__ */ jsx(Button, {
								asChild: true,
								variant: "outline",
								size: "sm",
								className: "mt-2",
								children: /* @__PURE__ */ jsx(Link, {
									to: "/grievances/detail",
									children: "View Grievance"
								})
							})]
						}) : /* @__PURE__ */ jsxs("div", {
							className: "py-8 text-center text-sm text-muted-foreground",
							children: ["No grievances linked to this appointment.", /* @__PURE__ */ jsx("div", {
								className: "mt-3",
								children: /* @__PURE__ */ jsx(Button, {
									asChild: true,
									variant: "outline",
									size: "sm",
									children: /* @__PURE__ */ jsx(Link, {
										to: "/grievances/list",
										children: "Browse All Grievances"
									})
								})
							})]
						})]
					})
				}),
				/* @__PURE__ */ jsx(TabsContent, {
					value: "schemes",
					children: /* @__PURE__ */ jsxs(Card, {
						className: "p-6",
						children: [/* @__PURE__ */ jsxs("h4", {
							className: "font-semibold mb-4 flex items-center gap-2",
							children: [/* @__PURE__ */ jsx(CheckCircle2, { className: "h-4 w-4 text-success" }), "Related Scheme Applications"]
						}), a.scheme_application_id ? /* @__PURE__ */ jsxs("div", {
							className: "rounded-lg border border-border/60 p-4",
							children: [/* @__PURE__ */ jsx("p", {
								className: "text-sm font-medium",
								children: "Linked scheme application found"
							}), /* @__PURE__ */ jsx(Button, {
								asChild: true,
								variant: "outline",
								size: "sm",
								className: "mt-2",
								children: /* @__PURE__ */ jsx(Link, {
									to: "/schemes/application-detail",
									children: "View Application"
								})
							})]
						}) : /* @__PURE__ */ jsxs("div", {
							className: "py-8 text-center text-sm text-muted-foreground",
							children: ["No scheme applications linked to this appointment.", /* @__PURE__ */ jsx("div", {
								className: "mt-3",
								children: /* @__PURE__ */ jsx(Button, {
									asChild: true,
									variant: "outline",
									size: "sm",
									children: /* @__PURE__ */ jsx(Link, {
										to: "/schemes/applications",
										children: "Browse Applications"
									})
								})
							})]
						})]
					})
				}),
				/* @__PURE__ */ jsx(TabsContent, {
					value: "documents",
					children: /* @__PURE__ */ jsxs(Card, {
						className: "p-6",
						children: [/* @__PURE__ */ jsxs("h4", {
							className: "font-semibold mb-4 flex items-center gap-2",
							children: [/* @__PURE__ */ jsx(FileText, { className: "h-4 w-4 text-primary" }), "Supporting Documents"]
						}), /* @__PURE__ */ jsx("div", {
							className: "grid gap-3 sm:grid-cols-3",
							children: [
								"Identity Proof",
								"Petition Letter",
								"Previous Correspondence"
							].map((doc) => /* @__PURE__ */ jsxs("div", {
								className: "rounded-lg border-2 border-dashed border-border/60 p-4 text-center hover:border-primary/40 hover:bg-primary/5 transition-colors cursor-pointer",
								children: [
									/* @__PURE__ */ jsx(FileText, { className: "h-8 w-8 mx-auto text-muted-foreground/50 mb-2" }),
									/* @__PURE__ */ jsx("p", {
										className: "text-xs font-medium",
										children: doc
									}),
									/* @__PURE__ */ jsx("p", {
										className: "text-[10px] text-muted-foreground mt-1",
										children: "Click to upload"
									})
								]
							}, doc))
						})]
					})
				}),
				/* @__PURE__ */ jsx(TabsContent, {
					value: "notes",
					children: /* @__PURE__ */ jsxs(Card, {
						className: "p-6",
						children: [/* @__PURE__ */ jsxs("h4", {
							className: "font-semibold mb-4 flex items-center gap-2",
							children: [/* @__PURE__ */ jsx(MessageSquare, { className: "h-4 w-4 text-primary" }), "Meeting Notes"]
						}), /* @__PURE__ */ jsxs("div", {
							className: "space-y-3",
							children: [
								a.meeting_outcome ? /* @__PURE__ */ jsxs("div", {
									className: "rounded-lg bg-muted/40 p-4",
									children: [/* @__PURE__ */ jsxs("div", {
										className: "flex items-center justify-between mb-2",
										children: [/* @__PURE__ */ jsx("span", {
											className: "text-xs font-semibold text-primary uppercase tracking-wide",
											children: "Discussion Summary"
										}), /* @__PURE__ */ jsx(Badge, {
											variant: "secondary",
											className: "text-[10px]",
											children: "general"
										})]
									}), /* @__PURE__ */ jsx("p", {
										className: "text-sm",
										children: String(a.meeting_outcome)
									})]
								}) : null,
								a.action_items ? /* @__PURE__ */ jsxs("div", {
									className: "rounded-lg bg-warning/5 border border-warning/20 p-4",
									children: [/* @__PURE__ */ jsxs("div", {
										className: "flex items-center gap-2 mb-2",
										children: [/* @__PURE__ */ jsx(AlertCircle, { className: "h-4 w-4 text-warning" }), /* @__PURE__ */ jsx("span", {
											className: "text-xs font-semibold text-warning uppercase tracking-wide",
											children: "Action Items"
										})]
									}), /* @__PURE__ */ jsx("p", {
										className: "text-sm",
										children: String(a.action_items)
									})]
								}) : null,
								!a.meeting_outcome && !a.action_items && /* @__PURE__ */ jsx("div", {
									className: "py-8 text-center text-sm text-muted-foreground",
									children: "No notes recorded yet. Notes will appear after the meeting is conducted."
								})
							]
						})]
					})
				}),
				/* @__PURE__ */ jsx(TabsContent, {
					value: "timeline",
					children: /* @__PURE__ */ jsxs(Card, {
						className: "p-6",
						children: [/* @__PURE__ */ jsxs("h4", {
							className: "font-semibold mb-6 flex items-center gap-2",
							children: [/* @__PURE__ */ jsx(Clock, { className: "h-4 w-4 text-primary" }), "Appointment Journey"]
						}), /* @__PURE__ */ jsxs("div", {
							className: "relative",
							children: [/* @__PURE__ */ jsx("div", { className: "absolute left-5 top-0 bottom-0 w-px bg-border" }), /* @__PURE__ */ jsx("div", {
								className: "space-y-6",
								children: timeline.map((step, i) => /* @__PURE__ */ jsxs(motion.div, {
									initial: {
										opacity: 0,
										x: -8
									},
									animate: {
										opacity: 1,
										x: 0
									},
									transition: { delay: i * .08 },
									className: "relative flex items-start gap-4 pl-12",
									children: [/* @__PURE__ */ jsx("div", {
										className: cn("absolute left-2 flex h-6 w-6 items-center justify-center rounded-full border-2", step.done ? "border-success bg-success text-success-foreground" : "border-muted-foreground/30 bg-background text-muted-foreground"),
										children: /* @__PURE__ */ jsx(step.icon, { className: "h-3 w-3" })
									}), /* @__PURE__ */ jsxs("div", {
										className: "min-w-0 flex-1 pt-0.5",
										children: [/* @__PURE__ */ jsx("p", {
											className: cn("text-sm font-semibold", step.done ? "text-foreground" : "text-muted-foreground"),
											children: step.step
										}), /* @__PURE__ */ jsx("p", {
											className: "text-xs text-muted-foreground",
											children: step.date
										})]
									})]
								}, step.step))
							})]
						})]
					})
				})
			]
		})]
	})] });
}
//#endregion
export { AppointmentDetailPage as component };

import { F as fetchPublicMeetings, u as createPublicMeeting } from "./api-CQX857SN.js";
import { t as cn } from "./utils-C_uf36nf.js";
import { t as Button } from "./button-Bq5vK6RO.js";
import { t as Card } from "./card-CzXpCsbD.js";
import { t as Badge } from "./badge-D1Dupn2y.js";
import { t as Skeleton } from "./skeleton-D9W9wFsj.js";
import { t as PageHeader } from "./PageHeader-B7gZRr0G.js";
import { t as Input } from "./input-B8Q2ztVi.js";
import { t as Label } from "./label-DBD1bRRP.js";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-Dg1urBTx.js";
import { a as DialogTitle, i as DialogHeader, n as DialogContent, r as DialogFooter, t as Dialog } from "./dialog-CzUx__WV.js";
import { t as Textarea } from "./textarea-kko37XEX.js";
import { useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowUpRight, Building2, Calendar, Loader2, MapPin, Mic, Plus } from "lucide-react";
import { motion } from "framer-motion";
//#region src/routes/_app.meetings.public-meetings.tsx?tsr-split=component
var statusTone = {
	scheduled: "bg-primary/10 text-primary",
	ongoing: "bg-warning/15 text-warning",
	completed: "bg-success/10 text-success",
	cancelled: "bg-muted text-muted-foreground",
	postponed: "bg-destructive/10 text-destructive"
};
var typeTone = {
	town_hall: "bg-primary/10 text-primary",
	community_meeting: "bg-info/10 text-info",
	department_review: "bg-warning/15 text-warning",
	stakeholder_meeting: "bg-success/10 text-success",
	awareness_program: "bg-destructive/10 text-destructive"
};
function PublicMeetingsPage() {
	const qc = useQueryClient();
	const [typeFilter, setTypeFilter] = useState("all");
	const [statusFilter, setStatusFilter] = useState("all");
	const [showCreate, setShowCreate] = useState(false);
	const [form, setForm] = useState({
		title: "",
		description: "",
		meeting_type: "town_hall",
		venue: "",
		meeting_date: "",
		start_time: "10:00",
		expected_attendance: 100,
		chief_guest: "",
		agenda_items: []
	});
	const { data, isLoading } = useQuery({
		queryKey: [
			"public-meetings",
			typeFilter,
			statusFilter
		],
		queryFn: () => fetchPublicMeetings({
			per_page: 50,
			...typeFilter !== "all" ? { type: typeFilter } : {},
			...statusFilter !== "all" ? { status: statusFilter } : {}
		}),
		staleTime: 3e4
	});
	const meetings = data?.data ?? [];
	const { mutate: doCreate, isPending: creating } = useMutation({
		mutationFn: createPublicMeeting,
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["public-meetings"] });
			setShowCreate(false);
			toast.success("Public meeting scheduled!");
		},
		onError: () => toast.error("Failed to schedule meeting")
	});
	const upcoming = meetings.filter((m) => m.status === "scheduled").length;
	const completedCount = meetings.filter((m) => m.status === "completed").length;
	const totalAttendance = meetings.reduce((acc, m) => acc + Number(m.actual_attendance ?? 0), 0);
	return /* @__PURE__ */ jsxs(Fragment, { children: [
		/* @__PURE__ */ jsx(PageHeader, {
			title: "Public Meetings Center",
			description: "Town halls, community meetings, department reviews and awareness programs",
			actions: /* @__PURE__ */ jsxs(Button, {
				size: "sm",
				className: "gap-1.5",
				onClick: () => setShowCreate(true),
				children: [/* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }), " Schedule Meeting"]
			})
		}),
		/* @__PURE__ */ jsxs("div", {
			className: "space-y-6 p-4 md:p-8",
			children: [
				/* @__PURE__ */ jsx("div", {
					className: "grid grid-cols-2 gap-3 sm:grid-cols-4",
					children: [
						{
							label: "Total Meetings",
							value: meetings.length,
							tone: "text-foreground"
						},
						{
							label: "Upcoming",
							value: upcoming,
							tone: "text-primary"
						},
						{
							label: "Completed",
							value: completedCount,
							tone: "text-success"
						},
						{
							label: "Total Attendance",
							value: totalAttendance,
							tone: "text-info"
						}
					].map((s) => /* @__PURE__ */ jsxs(Card, {
						className: "p-4 text-center",
						children: [/* @__PURE__ */ jsx("div", {
							className: `font-display text-2xl font-bold tabular-nums ${s.tone}`,
							children: s.value.toLocaleString()
						}), /* @__PURE__ */ jsx("div", {
							className: "text-xs text-muted-foreground",
							children: s.label
						})]
					}, s.label))
				}),
				/* @__PURE__ */ jsx("div", {
					className: "flex flex-wrap gap-2",
					children: [
						"all",
						"town_hall",
						"community_meeting",
						"department_review",
						"awareness_program"
					].map((t) => /* @__PURE__ */ jsx(Button, {
						size: "sm",
						variant: typeFilter === t ? "default" : "outline",
						onClick: () => setTypeFilter(t),
						className: "text-xs capitalize",
						children: t.replace(/_/g, " ")
					}, t))
				}),
				isLoading ? /* @__PURE__ */ jsx("div", {
					className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
					children: Array.from({ length: 6 }).map((_, i) => /* @__PURE__ */ jsx(Skeleton, { className: "h-52 rounded-xl" }, i))
				}) : /* @__PURE__ */ jsx("div", {
					className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
					children: meetings.map((m, i) => {
						const isPast = m.status === "completed";
						return /* @__PURE__ */ jsx(motion.div, {
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
								className: "p-5 flex flex-col gap-3 hover:-translate-y-0.5 hover:shadow-elevated transition-all",
								children: [
									/* @__PURE__ */ jsxs("div", {
										className: "flex items-start justify-between gap-2",
										children: [/* @__PURE__ */ jsxs("div", {
											className: "min-w-0",
											children: [/* @__PURE__ */ jsx(Badge, {
												variant: "secondary",
												className: cn("text-[10px] mb-1", typeTone[String(m.meeting_type ?? "town_hall")]),
												children: String(m.meeting_type ?? "").replace(/_/g, " ")
											}), /* @__PURE__ */ jsx("h3", {
												className: "font-semibold text-sm leading-tight",
												children: String(m.title ?? "")
											})]
										}), /* @__PURE__ */ jsx(Badge, {
											variant: "secondary",
											className: cn("shrink-0 text-[10px]", statusTone[String(m.status ?? "scheduled")]),
											children: String(m.status ?? "")
										})]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "space-y-1.5 text-xs text-muted-foreground",
										children: [
											/* @__PURE__ */ jsxs("div", {
												className: "flex items-center gap-1.5",
												children: [/* @__PURE__ */ jsx(MapPin, { className: "h-3.5 w-3.5 shrink-0" }), String(m.venue ?? "")]
											}),
											/* @__PURE__ */ jsxs("div", {
												className: "flex items-center gap-1.5",
												children: [
													/* @__PURE__ */ jsx(Calendar, { className: "h-3.5 w-3.5 shrink-0" }),
													String(m.meeting_date ?? "").substring(0, 10),
													" · ",
													String(m.start_time ?? "10:00")
												]
											}),
											m.chief_guest && /* @__PURE__ */ jsxs("div", {
												className: "flex items-center gap-1.5",
												children: [/* @__PURE__ */ jsx(Mic, { className: "h-3.5 w-3.5 shrink-0" }), String(m.chief_guest)]
											})
										]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "grid grid-cols-2 gap-2 rounded-lg bg-muted/40 p-3 text-center text-xs",
										children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
											className: "font-bold text-base tabular-nums",
											children: Number(m.expected_attendance ?? 0)
										}), /* @__PURE__ */ jsx("div", {
											className: "text-muted-foreground",
											children: "Expected"
										})] }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
											className: cn("font-bold text-base tabular-nums", isPast ? "text-success" : "text-muted-foreground"),
											children: isPast ? Number(m.actual_attendance ?? 0) : "—"
										}), /* @__PURE__ */ jsx("div", {
											className: "text-muted-foreground",
											children: "Attended"
										})] })]
									}),
									m.key_outcomes && /* @__PURE__ */ jsx("p", {
										className: "text-xs text-muted-foreground line-clamp-2 rounded-md bg-success/5 p-2 border border-success/20",
										children: String(m.key_outcomes)
									}),
									/* @__PURE__ */ jsx("div", {
										className: "flex justify-end mt-auto",
										children: /* @__PURE__ */ jsxs(Button, {
											variant: "ghost",
											size: "sm",
											className: "h-7 gap-1 text-xs",
											children: ["Details ", /* @__PURE__ */ jsx(ArrowUpRight, { className: "h-3 w-3" })]
										})
									})
								]
							})
						}, String(m.id));
					})
				}),
				meetings.length === 0 && !isLoading && /* @__PURE__ */ jsxs("div", {
					className: "py-16 text-center",
					children: [
						/* @__PURE__ */ jsx(Building2, { className: "h-12 w-12 mx-auto text-muted-foreground/40 mb-4" }),
						/* @__PURE__ */ jsx("p", {
							className: "text-muted-foreground",
							children: "No public meetings found"
						}),
						/* @__PURE__ */ jsxs(Button, {
							size: "sm",
							className: "mt-3",
							onClick: () => setShowCreate(true),
							children: [/* @__PURE__ */ jsx(Plus, { className: "h-4 w-4 mr-1.5" }), " Schedule First Meeting"]
						})
					]
				})
			]
		}),
		/* @__PURE__ */ jsx(Dialog, {
			open: showCreate,
			onOpenChange: setShowCreate,
			children: /* @__PURE__ */ jsxs(DialogContent, {
				className: "max-w-lg max-h-[90vh] overflow-y-auto",
				children: [
					/* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsx(DialogTitle, { children: "Schedule Public Meeting" }) }),
					/* @__PURE__ */ jsxs("div", {
						className: "grid gap-4",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ jsx(Label, { children: "Meeting Title *" }), /* @__PURE__ */ jsx(Input, {
									value: form.title,
									onChange: (e) => setForm((f) => ({
										...f,
										title: e.target.value
									})),
									placeholder: "e.g. Town Hall — Water Supply Review"
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ jsx(Label, { children: "Meeting Type" }), /* @__PURE__ */ jsxs(Select, {
									value: form.meeting_type,
									onValueChange: (v) => setForm((f) => ({
										...f,
										meeting_type: v
									})),
									children: [/* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, {}) }), /* @__PURE__ */ jsxs(SelectContent, { children: [
										/* @__PURE__ */ jsx(SelectItem, {
											value: "town_hall",
											children: "Town Hall"
										}),
										/* @__PURE__ */ jsx(SelectItem, {
											value: "community_meeting",
											children: "Community Meeting"
										}),
										/* @__PURE__ */ jsx(SelectItem, {
											value: "department_review",
											children: "Department Review"
										}),
										/* @__PURE__ */ jsx(SelectItem, {
											value: "stakeholder_meeting",
											children: "Stakeholder Meeting"
										}),
										/* @__PURE__ */ jsx(SelectItem, {
											value: "awareness_program",
											children: "Awareness Program"
										}),
										/* @__PURE__ */ jsx(SelectItem, {
											value: "public_hearing",
											children: "Public Hearing"
										})
									] })]
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ jsx(Label, { children: "Venue *" }), /* @__PURE__ */ jsx(Input, {
									value: form.venue,
									onChange: (e) => setForm((f) => ({
										...f,
										venue: e.target.value
									})),
									placeholder: "Community Hall, Village name…"
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "grid gap-3 sm:grid-cols-2",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ jsx(Label, { children: "Meeting Date *" }), /* @__PURE__ */ jsx(Input, {
										type: "date",
										value: form.meeting_date,
										onChange: (e) => setForm((f) => ({
											...f,
											meeting_date: e.target.value
										}))
									})]
								}), /* @__PURE__ */ jsxs("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ jsx(Label, { children: "Start Time *" }), /* @__PURE__ */ jsx(Input, {
										type: "time",
										value: form.start_time,
										onChange: (e) => setForm((f) => ({
											...f,
											start_time: e.target.value
										}))
									})]
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "grid gap-3 sm:grid-cols-2",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ jsx(Label, { children: "Expected Attendance" }), /* @__PURE__ */ jsx(Input, {
										type: "number",
										value: form.expected_attendance,
										onChange: (e) => setForm((f) => ({
											...f,
											expected_attendance: Number(e.target.value)
										}))
									})]
								}), /* @__PURE__ */ jsxs("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ jsx(Label, { children: "Chief Guest" }), /* @__PURE__ */ jsx(Input, {
										value: form.chief_guest,
										onChange: (e) => setForm((f) => ({
											...f,
											chief_guest: e.target.value
										})),
										placeholder: "Hon. MP Ravi Varma"
									})]
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ jsx(Label, { children: "Description" }), /* @__PURE__ */ jsx(Textarea, {
									value: form.description,
									onChange: (e) => setForm((f) => ({
										...f,
										description: e.target.value
									})),
									rows: 3
								})]
							})
						]
					}),
					/* @__PURE__ */ jsxs(DialogFooter, { children: [/* @__PURE__ */ jsx(Button, {
						variant: "outline",
						onClick: () => setShowCreate(false),
						children: "Cancel"
					}), /* @__PURE__ */ jsx(Button, {
						disabled: creating || !form.title || !form.venue || !form.meeting_date,
						onClick: () => doCreate({
							...form,
							start_time: form.start_time + ":00"
						}),
						children: creating ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin mr-2" }), "Scheduling…"] }) : "Schedule Meeting"
					})] })
				]
			})
		})
	] });
}
//#endregion
export { PublicMeetingsPage as component };

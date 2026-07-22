import { f as fetchAppointmentStats, p as fetchAppointments, s as createAppointment } from "./api-CQX857SN.js";
import { t as cn } from "./utils-C_uf36nf.js";
import { t as Button } from "./button-Bq5vK6RO.js";
import { t as Card } from "./card-CzXpCsbD.js";
import { t as Badge } from "./badge-D1Dupn2y.js";
import { t as Skeleton } from "./skeleton-D9W9wFsj.js";
import { t as PageHeader } from "./PageHeader-B7gZRr0G.js";
import { t as Input } from "./input-B8Q2ztVi.js";
import { t as Label } from "./label-DBD1bRRP.js";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-Dg1urBTx.js";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-C0WYWEQX.js";
import { a as DialogTitle, i as DialogHeader, n as DialogContent, r as DialogFooter, t as Dialog } from "./dialog-CzUx__WV.js";
import { t as Textarea } from "./textarea-kko37XEX.js";
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Download, Eye, Loader2, Phone, Plus, Search, User } from "lucide-react";
import { motion } from "framer-motion";
//#region src/routes/_app.meetings.appointments.tsx?tsr-split=component
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
function AppointmentsPage() {
	const qc = useQueryClient();
	const [search, setSearch] = useState("");
	const [status, setStatus] = useState("all");
	const [priority, setPriority] = useState("all");
	const [page, setPage] = useState(1);
	const [showCreate, setShowCreate] = useState(false);
	const [form, setForm] = useState({
		citizen_name: "",
		citizen_mobile: "",
		citizen_village: "",
		citizen_mandal: "",
		purpose: "",
		description: "",
		meeting_type: "in_person",
		category: "general",
		priority: "medium",
		requested_date: ""
	});
	const { data: statsData } = useQuery({
		queryKey: ["appointment-stats"],
		queryFn: fetchAppointmentStats,
		staleTime: 3e4
	});
	const { data, isLoading } = useQuery({
		queryKey: [
			"appointments",
			search,
			status,
			priority,
			page
		],
		queryFn: () => fetchAppointments({
			search,
			page,
			per_page: 20,
			...status !== "all" ? { status } : {},
			...priority !== "all" ? { priority } : {}
		}),
		staleTime: 15e3
	});
	const appointments = data?.data ?? [];
	const meta = data?.meta ?? {
		total: 0,
		current_page: 1,
		last_page: 1
	};
	const { mutate: doCreate, isPending: creating } = useMutation({
		mutationFn: createAppointment,
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["appointments"] });
			qc.invalidateQueries({ queryKey: ["appointment-stats"] });
			setShowCreate(false);
			setForm({
				citizen_name: "",
				citizen_mobile: "",
				citizen_village: "",
				citizen_mandal: "",
				purpose: "",
				description: "",
				meeting_type: "in_person",
				category: "general",
				priority: "medium",
				requested_date: ""
			});
			toast.success("Appointment scheduled successfully!");
		},
		onError: () => toast.error("Failed to create appointment")
	});
	const statCards = [
		{
			label: "Total",
			value: statsData?.total ?? 0,
			tone: "text-foreground"
		},
		{
			label: "Pending",
			value: statsData?.pending ?? 0,
			tone: "text-warning"
		},
		{
			label: "Confirmed",
			value: statsData?.confirmed ?? 0,
			tone: "text-info"
		},
		{
			label: "Completed",
			value: statsData?.completed ?? 0,
			tone: "text-success"
		},
		{
			label: "Today",
			value: statsData?.today ?? 0,
			tone: "text-primary"
		},
		{
			label: "Follow-up Pending",
			value: statsData?.follow_up_pending ?? 0,
			tone: "text-destructive"
		}
	];
	return /* @__PURE__ */ jsxs(Fragment, { children: [
		/* @__PURE__ */ jsx(PageHeader, {
			title: "Appointment Management",
			description: `${meta.total} total appointments · manage citizen meeting requests`,
			actions: /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsxs(Button, {
				variant: "outline",
				size: "sm",
				className: "gap-1.5",
				children: [/* @__PURE__ */ jsx(Download, { className: "h-4 w-4" }), " Export"]
			}), /* @__PURE__ */ jsxs(Button, {
				size: "sm",
				className: "gap-1.5",
				onClick: () => setShowCreate(true),
				children: [/* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }), " New Appointment"]
			})] })
		}),
		/* @__PURE__ */ jsxs("div", {
			className: "space-y-6 p-4 md:p-8",
			children: [/* @__PURE__ */ jsx("div", {
				className: "grid grid-cols-3 gap-3 sm:grid-cols-6",
				children: statCards.map((s) => /* @__PURE__ */ jsxs(Card, {
					className: "p-3 text-center",
					children: [/* @__PURE__ */ jsx("div", {
						className: `font-display text-2xl font-bold tabular-nums ${s.tone}`,
						children: s.value
					}), /* @__PURE__ */ jsx("div", {
						className: "text-xs text-muted-foreground",
						children: s.label
					})]
				}, s.label))
			}), /* @__PURE__ */ jsxs(Card, {
				className: "overflow-hidden",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "flex flex-wrap items-center gap-2 border-b border-border/70 bg-muted/30 p-3",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "relative min-w-[220px] flex-1",
								children: [/* @__PURE__ */ jsx(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ jsx(Input, {
									placeholder: "Search by name, mobile, purpose…",
									className: "h-9 bg-background pl-9",
									value: search,
									onChange: (e) => {
										setSearch(e.target.value);
										setPage(1);
									}
								})]
							}),
							/* @__PURE__ */ jsxs(Select, {
								value: status,
								onValueChange: (v) => {
									setStatus(v);
									setPage(1);
								},
								children: [/* @__PURE__ */ jsx(SelectTrigger, {
									className: "h-9 w-[130px]",
									children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Status" })
								}), /* @__PURE__ */ jsxs(SelectContent, { children: [
									/* @__PURE__ */ jsx(SelectItem, {
										value: "all",
										children: "All Status"
									}),
									/* @__PURE__ */ jsx(SelectItem, {
										value: "pending",
										children: "Pending"
									}),
									/* @__PURE__ */ jsx(SelectItem, {
										value: "confirmed",
										children: "Confirmed"
									}),
									/* @__PURE__ */ jsx(SelectItem, {
										value: "completed",
										children: "Completed"
									}),
									/* @__PURE__ */ jsx(SelectItem, {
										value: "cancelled",
										children: "Cancelled"
									}),
									/* @__PURE__ */ jsx(SelectItem, {
										value: "rescheduled",
										children: "Rescheduled"
									})
								] })]
							}),
							/* @__PURE__ */ jsxs(Select, {
								value: priority,
								onValueChange: (v) => {
									setPriority(v);
									setPage(1);
								},
								children: [/* @__PURE__ */ jsx(SelectTrigger, {
									className: "h-9 w-[130px]",
									children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Priority" })
								}), /* @__PURE__ */ jsxs(SelectContent, { children: [
									/* @__PURE__ */ jsx(SelectItem, {
										value: "all",
										children: "All Priority"
									}),
									/* @__PURE__ */ jsx(SelectItem, {
										value: "urgent",
										children: "Urgent"
									}),
									/* @__PURE__ */ jsx(SelectItem, {
										value: "high",
										children: "High"
									}),
									/* @__PURE__ */ jsx(SelectItem, {
										value: "medium",
										children: "Medium"
									}),
									/* @__PURE__ */ jsx(SelectItem, {
										value: "low",
										children: "Low"
									})
								] })]
							})
						]
					}),
					isLoading ? /* @__PURE__ */ jsx("div", {
						className: "space-y-2 p-4",
						children: Array.from({ length: 10 }).map((_, i) => /* @__PURE__ */ jsx(Skeleton, { className: "h-12 w-full" }, i))
					}) : /* @__PURE__ */ jsx("div", {
						className: "overflow-x-auto",
						children: /* @__PURE__ */ jsxs(Table, { children: [/* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
							/* @__PURE__ */ jsx(TableHead, { children: "Token" }),
							/* @__PURE__ */ jsx(TableHead, { children: "Citizen" }),
							/* @__PURE__ */ jsx(TableHead, { children: "Purpose" }),
							/* @__PURE__ */ jsx(TableHead, { children: "Village" }),
							/* @__PURE__ */ jsx(TableHead, { children: "Priority" }),
							/* @__PURE__ */ jsx(TableHead, { children: "Requested" }),
							/* @__PURE__ */ jsx(TableHead, { children: "Scheduled" }),
							/* @__PURE__ */ jsx(TableHead, { children: "Status" }),
							/* @__PURE__ */ jsx(TableHead, {
								className: "text-right",
								children: "Actions"
							})
						] }) }), /* @__PURE__ */ jsxs(TableBody, { children: [appointments.map((a, i) => /* @__PURE__ */ jsxs(motion.tr, {
							initial: { opacity: 0 },
							animate: { opacity: 1 },
							transition: { delay: i * .01 },
							className: "border-b hover:bg-muted/40",
							children: [
								/* @__PURE__ */ jsx(TableCell, {
									className: "font-mono text-xs",
									children: String(a.token_number ?? "—")
								}),
								/* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ jsx("div", {
										className: "grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary/10 text-primary",
										children: /* @__PURE__ */ jsx(User, { className: "h-4 w-4" })
									}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
										className: "text-sm font-semibold",
										children: String(a.citizen_name ?? "")
									}), /* @__PURE__ */ jsx("div", {
										className: "text-[11px] text-muted-foreground tabular-nums",
										children: String(a.citizen_mobile ?? "—")
									})] })]
								}) }),
								/* @__PURE__ */ jsx(TableCell, {
									className: "max-w-[160px] truncate text-sm",
									children: String(a.purpose ?? "")
								}),
								/* @__PURE__ */ jsx(TableCell, {
									className: "text-xs",
									children: String(a.citizen_village ?? "—")
								}),
								/* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(Badge, {
									variant: "secondary",
									className: cn("text-[10px]", priorityTone[String(a.priority ?? "medium")]),
									children: String(a.priority ?? "").toUpperCase()
								}) }),
								/* @__PURE__ */ jsx(TableCell, {
									className: "text-xs tabular-nums",
									children: String(a.requested_date ?? "").substring(0, 10)
								}),
								/* @__PURE__ */ jsx(TableCell, {
									className: "text-xs tabular-nums",
									children: String(a.scheduled_date ?? "—").substring(0, 10)
								}),
								/* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(Badge, {
									variant: "secondary",
									className: cn("text-[10px]", statusTone[String(a.status ?? "pending")]),
									children: String(a.status ?? "").replace("_", " ")
								}) }),
								/* @__PURE__ */ jsx(TableCell, {
									className: "text-right",
									children: /* @__PURE__ */ jsxs("div", {
										className: "inline-flex items-center gap-1",
										children: [/* @__PURE__ */ jsx(Button, {
											variant: "ghost",
											size: "icon",
											className: "h-7 w-7",
											children: /* @__PURE__ */ jsx(Phone, { className: "h-3.5 w-3.5" })
										}), /* @__PURE__ */ jsx(Link, {
											to: "/meetings/appointment-detail",
											search: { id: String(a.id) },
											children: /* @__PURE__ */ jsx(Button, {
												variant: "ghost",
												size: "icon",
												className: "h-7 w-7",
												children: /* @__PURE__ */ jsx(Eye, { className: "h-3.5 w-3.5" })
											})
										})]
									})
								})
							]
						}, String(a.id))), appointments.length === 0 && /* @__PURE__ */ jsx(TableRow, { children: /* @__PURE__ */ jsx(TableCell, {
							colSpan: 9,
							className: "py-12 text-center text-sm text-muted-foreground",
							children: "No appointments found."
						}) })] })] })
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "flex items-center justify-between border-t border-border/70 px-4 py-3 text-xs text-muted-foreground",
						children: [/* @__PURE__ */ jsxs("span", { children: [
							"Showing ",
							appointments.length,
							" of ",
							meta.total
						] }), /* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-1",
							children: [
								/* @__PURE__ */ jsx(Button, {
									variant: "outline",
									size: "sm",
									className: "h-7",
									disabled: page <= 1,
									onClick: () => setPage((p) => p - 1),
									children: "Previous"
								}),
								/* @__PURE__ */ jsxs("span", {
									className: "px-2",
									children: [
										"Page ",
										meta.current_page,
										" / ",
										meta.last_page
									]
								}),
								/* @__PURE__ */ jsx(Button, {
									variant: "outline",
									size: "sm",
									className: "h-7",
									disabled: page >= meta.last_page,
									onClick: () => setPage((p) => p + 1),
									children: "Next"
								})
							]
						})]
					})
				]
			})]
		}),
		/* @__PURE__ */ jsx(Dialog, {
			open: showCreate,
			onOpenChange: setShowCreate,
			children: /* @__PURE__ */ jsxs(DialogContent, {
				className: "max-w-2xl max-h-[90vh] overflow-y-auto",
				children: [
					/* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsx(DialogTitle, { children: "Schedule New Appointment" }) }),
					/* @__PURE__ */ jsxs("div", {
						className: "grid gap-4 sm:grid-cols-2",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ jsx(Label, { children: "Citizen Name *" }), /* @__PURE__ */ jsx(Input, {
									value: form.citizen_name,
									onChange: (e) => setForm((f) => ({
										...f,
										citizen_name: e.target.value
									})),
									placeholder: "Full name"
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ jsx(Label, { children: "Mobile Number" }), /* @__PURE__ */ jsx(Input, {
									value: form.citizen_mobile,
									onChange: (e) => setForm((f) => ({
										...f,
										citizen_mobile: e.target.value
									})),
									placeholder: "9876543210"
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ jsx(Label, { children: "Village" }), /* @__PURE__ */ jsx(Input, {
									value: form.citizen_village,
									onChange: (e) => setForm((f) => ({
										...f,
										citizen_village: e.target.value
									})),
									placeholder: "Village name"
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ jsx(Label, { children: "Mandal" }), /* @__PURE__ */ jsx(Input, {
									value: form.citizen_mandal,
									onChange: (e) => setForm((f) => ({
										...f,
										citizen_mandal: e.target.value
									})),
									placeholder: "Mandal name"
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "space-y-1.5 sm:col-span-2",
								children: [/* @__PURE__ */ jsx(Label, { children: "Purpose *" }), /* @__PURE__ */ jsx(Input, {
									value: form.purpose,
									onChange: (e) => setForm((f) => ({
										...f,
										purpose: e.target.value
									})),
									placeholder: "Reason for appointment"
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "space-y-1.5 sm:col-span-2",
								children: [/* @__PURE__ */ jsx(Label, { children: "Description" }), /* @__PURE__ */ jsx(Textarea, {
									value: form.description,
									onChange: (e) => setForm((f) => ({
										...f,
										description: e.target.value
									})),
									placeholder: "Additional details",
									rows: 3
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ jsx(Label, { children: "Category" }), /* @__PURE__ */ jsxs(Select, {
									value: form.category,
									onValueChange: (v) => setForm((f) => ({
										...f,
										category: v
									})),
									children: [/* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, {}) }), /* @__PURE__ */ jsxs(SelectContent, { children: [
										/* @__PURE__ */ jsx(SelectItem, {
											value: "general",
											children: "General"
										}),
										/* @__PURE__ */ jsx(SelectItem, {
											value: "grievance",
											children: "Grievance"
										}),
										/* @__PURE__ */ jsx(SelectItem, {
											value: "scheme",
											children: "Scheme"
										}),
										/* @__PURE__ */ jsx(SelectItem, {
											value: "project",
											children: "Project"
										}),
										/* @__PURE__ */ jsx(SelectItem, {
											value: "personal",
											children: "Personal"
										})
									] })]
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ jsx(Label, { children: "Priority" }), /* @__PURE__ */ jsxs(Select, {
									value: form.priority,
									onValueChange: (v) => setForm((f) => ({
										...f,
										priority: v
									})),
									children: [/* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, {}) }), /* @__PURE__ */ jsxs(SelectContent, { children: [
										/* @__PURE__ */ jsx(SelectItem, {
											value: "low",
											children: "Low"
										}),
										/* @__PURE__ */ jsx(SelectItem, {
											value: "medium",
											children: "Medium"
										}),
										/* @__PURE__ */ jsx(SelectItem, {
											value: "high",
											children: "High"
										}),
										/* @__PURE__ */ jsx(SelectItem, {
											value: "urgent",
											children: "Urgent"
										})
									] })]
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ jsx(Label, { children: "Requested Date *" }), /* @__PURE__ */ jsx(Input, {
									type: "date",
									value: form.requested_date,
									onChange: (e) => setForm((f) => ({
										...f,
										requested_date: e.target.value
									}))
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
											value: "in_person",
											children: "In Person"
										}),
										/* @__PURE__ */ jsx(SelectItem, {
											value: "phone",
											children: "Phone"
										}),
										/* @__PURE__ */ jsx(SelectItem, {
											value: "video",
											children: "Video"
										})
									] })]
								})]
							})
						]
					}),
					/* @__PURE__ */ jsxs(DialogFooter, {
						className: "mt-4",
						children: [/* @__PURE__ */ jsx(Button, {
							variant: "outline",
							onClick: () => setShowCreate(false),
							children: "Cancel"
						}), /* @__PURE__ */ jsx(Button, {
							disabled: creating || !form.citizen_name || !form.purpose || !form.requested_date,
							onClick: () => doCreate(form),
							children: creating ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin mr-2" }), "Scheduling…"] }) : "Schedule Appointment"
						})]
					})
				]
			})
		})
	] });
}
//#endregion
export { AppointmentsPage as component };

import { D as fetchLocVillages, T as fetchLocMandals, l as createJanataDarbar, w as fetchJanataDarbars } from "./api-CQX857SN.js";
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
import { AlertCircle, ArrowUpRight, Calendar, Loader2, MapPin, Plus, Users } from "lucide-react";
import { motion } from "framer-motion";
//#region src/routes/_app.meetings.janata-darbar.tsx?tsr-split=component
var statusTone = {
	scheduled: "bg-primary/10 text-primary",
	ongoing: "bg-warning/15 text-warning",
	completed: "bg-success/10 text-success",
	cancelled: "bg-muted text-muted-foreground"
};
function JanataDarbarPage() {
	const qc = useQueryClient();
	const [filter, setFilter] = useState("all");
	const [showCreate, setShowCreate] = useState(false);
	const [form, setForm] = useState({
		title: "",
		venue: "",
		session_date: "",
		start_time: "09:00",
		description: "",
		max_registrations: 200,
		mandal_id: "",
		village_id: ""
	});
	const [mandalId, setMandalId] = useState("");
	const { data, isLoading } = useQuery({
		queryKey: ["janata-darbars", filter],
		queryFn: () => fetchJanataDarbars({
			...filter !== "all" ? { status: filter } : {},
			per_page: 50
		}),
		staleTime: 3e4
	});
	const { data: mandals } = useQuery({
		queryKey: ["mandals"],
		queryFn: () => fetchLocMandals()
	});
	const { data: villages } = useQuery({
		queryKey: ["villages-jd", mandalId],
		queryFn: () => fetchLocVillages(mandalId),
		enabled: !!mandalId
	});
	const sessions = data?.data ?? [];
	const { mutate: doCreate, isPending: creating } = useMutation({
		mutationFn: createJanataDarbar,
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["janata-darbars"] });
			setShowCreate(false);
			setForm({
				title: "",
				venue: "",
				session_date: "",
				start_time: "09:00",
				description: "",
				max_registrations: 200,
				mandal_id: "",
				village_id: ""
			});
			toast.success("Janata Darbar session created!");
		},
		onError: () => toast.error("Failed to create session")
	});
	const totalSessions = sessions.length;
	const upcoming = sessions.filter((s) => s.status === "scheduled").length;
	const completed = sessions.filter((s) => s.status === "completed").length;
	const totalIssues = sessions.reduce((acc, s) => acc + Number(s.issues_raised ?? 0), 0);
	const resolvedIssues = sessions.reduce((acc, s) => acc + Number(s.issues_resolved ?? 0), 0);
	const totalCitizens = sessions.reduce((acc, s) => acc + Number(s.registered_citizens ?? 0), 0);
	return /* @__PURE__ */ jsxs(Fragment, { children: [
		/* @__PURE__ */ jsx(PageHeader, {
			title: "Janata Darbar Management",
			description: "Open-house public grievance sessions — register, manage and track outcomes",
			actions: /* @__PURE__ */ jsxs(Button, {
				size: "sm",
				className: "gap-1.5",
				onClick: () => setShowCreate(true),
				children: [/* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }), " New Session"]
			})
		}),
		/* @__PURE__ */ jsxs("div", {
			className: "space-y-6 p-4 md:p-8",
			children: [
				/* @__PURE__ */ jsx("div", {
					className: "grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6",
					children: [
						{
							label: "Total Sessions",
							value: totalSessions,
							tone: "text-foreground"
						},
						{
							label: "Upcoming",
							value: upcoming,
							tone: "text-primary"
						},
						{
							label: "Completed",
							value: completed,
							tone: "text-success"
						},
						{
							label: "Citizens Registered",
							value: totalCitizens,
							tone: "text-info"
						},
						{
							label: "Issues Raised",
							value: totalIssues,
							tone: "text-warning"
						},
						{
							label: "Issues Resolved",
							value: resolvedIssues,
							tone: "text-success"
						}
					].map((s) => /* @__PURE__ */ jsxs(Card, {
						className: "p-3 text-center",
						children: [/* @__PURE__ */ jsx("div", {
							className: `font-display text-2xl font-bold tabular-nums ${s.tone}`,
							children: s.value
						}), /* @__PURE__ */ jsx("div", {
							className: "text-xs text-muted-foreground",
							children: s.label
						})]
					}, s.label))
				}),
				/* @__PURE__ */ jsx("div", {
					className: "flex gap-2",
					children: [
						"all",
						"scheduled",
						"ongoing",
						"completed",
						"cancelled"
					].map((f) => /* @__PURE__ */ jsx(Button, {
						size: "sm",
						variant: filter === f ? "default" : "outline",
						onClick: () => setFilter(f),
						className: "capitalize",
						children: f
					}, f))
				}),
				isLoading ? /* @__PURE__ */ jsx("div", {
					className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
					children: Array.from({ length: 6 }).map((_, i) => /* @__PURE__ */ jsx(Skeleton, { className: "h-52 rounded-xl" }, i))
				}) : /* @__PURE__ */ jsx("div", {
					className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
					children: sessions.map((s, i) => /* @__PURE__ */ jsx(motion.div, {
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
										children: [/* @__PURE__ */ jsx("p", {
											className: "font-mono text-xs text-muted-foreground",
											children: String(s.session_number ?? "")
										}), /* @__PURE__ */ jsx("h3", {
											className: "font-semibold truncate text-sm mt-0.5",
											children: String(s.title ?? "")
										})]
									}), /* @__PURE__ */ jsx(Badge, {
										variant: "secondary",
										className: cn("shrink-0 text-[10px]", statusTone[String(s.status ?? "scheduled")]),
										children: String(s.status ?? "")
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "space-y-1.5 text-xs text-muted-foreground",
									children: [/* @__PURE__ */ jsxs("div", {
										className: "flex items-center gap-1.5",
										children: [/* @__PURE__ */ jsx(MapPin, { className: "h-3.5 w-3.5 shrink-0" }), String(s.venue ?? "")]
									}), /* @__PURE__ */ jsxs("div", {
										className: "flex items-center gap-1.5",
										children: [
											/* @__PURE__ */ jsx(Calendar, { className: "h-3.5 w-3.5 shrink-0" }),
											String(s.session_date ?? "").substring(0, 10),
											" · ",
											String(s.start_time ?? "09:00")
										]
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "grid grid-cols-3 gap-2 rounded-lg bg-muted/40 p-3 text-center text-xs",
									children: [
										/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
											className: "font-bold text-base tabular-nums",
											children: Number(s.registered_citizens ?? 0)
										}), /* @__PURE__ */ jsx("div", {
											className: "text-muted-foreground",
											children: "Registered"
										})] }),
										/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
											className: "font-bold text-base tabular-nums text-warning",
											children: Number(s.issues_raised ?? 0)
										}), /* @__PURE__ */ jsx("div", {
											className: "text-muted-foreground",
											children: "Issues"
										})] }),
										/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
											className: "font-bold text-base tabular-nums text-success",
											children: Number(s.issues_resolved ?? 0)
										}), /* @__PURE__ */ jsx("div", {
											className: "text-muted-foreground",
											children: "Resolved"
										})] })
									]
								}),
								s.issues_pending && Number(s.issues_pending) > 0 && /* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-1.5 rounded-md bg-warning/10 px-2 py-1.5 text-xs text-warning",
									children: [
										/* @__PURE__ */ jsx(AlertCircle, { className: "h-3.5 w-3.5 shrink-0" }),
										Number(s.issues_pending),
										" issues still pending"
									]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "flex items-center justify-between mt-auto pt-1",
									children: [/* @__PURE__ */ jsxs("div", {
										className: "text-xs text-muted-foreground",
										children: [
											"Max: ",
											Number(s.max_registrations ?? 200),
											" · Token: #",
											Number(s.token_counter ?? 0)
										]
									}), /* @__PURE__ */ jsxs(Button, {
										variant: "ghost",
										size: "sm",
										className: "h-7 gap-1 text-xs",
										children: ["View ", /* @__PURE__ */ jsx(ArrowUpRight, { className: "h-3 w-3" })]
									})]
								})
							]
						})
					}, String(s.id)))
				}),
				sessions.length === 0 && !isLoading && /* @__PURE__ */ jsxs("div", {
					className: "py-16 text-center",
					children: [
						/* @__PURE__ */ jsx(Users, { className: "h-12 w-12 mx-auto text-muted-foreground/40 mb-4" }),
						/* @__PURE__ */ jsx("p", {
							className: "text-muted-foreground",
							children: "No Janata Darbar sessions found"
						}),
						/* @__PURE__ */ jsxs(Button, {
							size: "sm",
							className: "mt-3",
							onClick: () => setShowCreate(true),
							children: [/* @__PURE__ */ jsx(Plus, { className: "h-4 w-4 mr-1.5" }), " Create First Session"]
						})
					]
				})
			]
		}),
		/* @__PURE__ */ jsx(Dialog, {
			open: showCreate,
			onOpenChange: setShowCreate,
			children: /* @__PURE__ */ jsxs(DialogContent, {
				className: "max-w-lg",
				children: [
					/* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsx(DialogTitle, { children: "New Janata Darbar Session" }) }),
					/* @__PURE__ */ jsxs("div", {
						className: "grid gap-4",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ jsx(Label, { children: "Session Title *" }), /* @__PURE__ */ jsx(Input, {
									value: form.title,
									onChange: (e) => setForm((f) => ({
										...f,
										title: e.target.value
									})),
									placeholder: "e.g. Janata Darbar — Kondapur Mandal"
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
									placeholder: "Mandal Office, Community Hall…"
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "grid gap-3 sm:grid-cols-2",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ jsx(Label, { children: "Session Date *" }), /* @__PURE__ */ jsx(Input, {
										type: "date",
										value: form.session_date,
										onChange: (e) => setForm((f) => ({
											...f,
											session_date: e.target.value
										}))
									})]
								}), /* @__PURE__ */ jsxs("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ jsx(Label, { children: "Start Time" }), /* @__PURE__ */ jsx(Input, {
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
									children: [/* @__PURE__ */ jsx(Label, { children: "Mandal" }), /* @__PURE__ */ jsxs(Select, {
										value: mandalId,
										onValueChange: (v) => {
											setMandalId(v);
											setForm((f) => ({
												...f,
												mandal_id: v
											}));
										},
										children: [/* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Select mandal" }) }), /* @__PURE__ */ jsx(SelectContent, { children: (mandals ?? []).map((m) => /* @__PURE__ */ jsx(SelectItem, {
											value: m.id,
											children: m.name
										}, m.id)) })]
									})]
								}), /* @__PURE__ */ jsxs("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ jsx(Label, { children: "Max Registrations" }), /* @__PURE__ */ jsx(Input, {
										type: "number",
										value: form.max_registrations,
										onChange: (e) => setForm((f) => ({
											...f,
											max_registrations: Number(e.target.value)
										}))
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
						disabled: creating || !form.title || !form.venue || !form.session_date,
						onClick: () => doCreate(form),
						children: creating ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin mr-2" }), "Creating…"] }) : "Create Session"
					})] })
				]
			})
		})
	] });
}
//#endregion
export { JanataDarbarPage as component };

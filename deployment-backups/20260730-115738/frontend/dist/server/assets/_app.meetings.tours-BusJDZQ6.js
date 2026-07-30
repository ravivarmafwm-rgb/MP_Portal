import { H as fetchTours, d as createTour } from "./api-CQX857SN.js";
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
import { ArrowUpRight, Calendar, Flag, Layers, Loader2, MapPin, Navigation, Plus } from "lucide-react";
import { motion } from "framer-motion";
//#region src/routes/_app.meetings.tours.tsx?tsr-split=component
var statusTone = {
	planned: "bg-primary/10 text-primary",
	ongoing: "bg-warning/15 text-warning",
	completed: "bg-success/10 text-success",
	cancelled: "bg-muted text-muted-foreground",
	postponed: "bg-destructive/10 text-destructive"
};
var tourTypeIcon = {
	constituency_visit: MapPin,
	inspection: Flag,
	project_inspection: Layers,
	field_survey: Navigation,
	other: MapPin
};
function ToursPage() {
	const qc = useQueryClient();
	const [filter, setFilter] = useState("all");
	const [showCreate, setShowCreate] = useState(false);
	const [form, setForm] = useState({
		title: "",
		objectives: "",
		tour_type: "constituency_visit",
		start_date: "",
		end_date: "",
		villages_count: 5
	});
	const { data, isLoading } = useQuery({
		queryKey: ["tours", filter],
		queryFn: () => fetchTours({
			per_page: 50,
			...filter !== "all" ? { status: filter } : {}
		}),
		staleTime: 3e4
	});
	const tours = data?.data ?? [];
	const { mutate: doCreate, isPending: creating } = useMutation({
		mutationFn: createTour,
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["tours"] });
			setShowCreate(false);
			toast.success("Tour planned successfully!");
		},
		onError: () => toast.error("Failed to create tour")
	});
	const planned = tours.filter((t) => t.status === "planned").length;
	const ongoing = tours.filter((t) => t.status === "ongoing").length;
	const completed = tours.filter((t) => t.status === "completed").length;
	const totalVillages = tours.reduce((acc, t) => acc + Number(t.villages_count ?? 0), 0);
	tours.reduce((acc, t) => acc + Number(t.citizens_met ?? 0), 0);
	return /* @__PURE__ */ jsxs(Fragment, { children: [
		/* @__PURE__ */ jsx(PageHeader, {
			title: "MP Tour Management",
			description: "Constituency tours, inspection visits and field reviews",
			actions: /* @__PURE__ */ jsxs(Button, {
				size: "sm",
				className: "gap-1.5",
				onClick: () => setShowCreate(true),
				children: [/* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }), " Plan Tour"]
			})
		}),
		/* @__PURE__ */ jsxs("div", {
			className: "space-y-6 p-4 md:p-8",
			children: [
				/* @__PURE__ */ jsx("div", {
					className: "grid grid-cols-2 gap-3 sm:grid-cols-5",
					children: [
						{
							label: "Total Tours",
							value: tours.length,
							tone: "text-foreground"
						},
						{
							label: "Planned",
							value: planned,
							tone: "text-primary"
						},
						{
							label: "Ongoing",
							value: ongoing,
							tone: "text-warning"
						},
						{
							label: "Completed",
							value: completed,
							tone: "text-success"
						},
						{
							label: "Villages Covered",
							value: totalVillages,
							tone: "text-info"
						}
					].map((s) => /* @__PURE__ */ jsxs(Card, {
						className: "p-4 text-center",
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
					className: "flex flex-wrap gap-2",
					children: [
						"all",
						"planned",
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
					children: Array.from({ length: 6 }).map((_, i) => /* @__PURE__ */ jsx(Skeleton, { className: "h-56 rounded-xl" }, i))
				}) : /* @__PURE__ */ jsx("div", {
					className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
					children: tours.map((t, i) => {
						const TIcon = tourTypeIcon[String(t.tour_type ?? "other")] ?? MapPin;
						const isPast = t.status === "completed";
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
											className: "flex items-start gap-3 min-w-0",
											children: [/* @__PURE__ */ jsx("div", {
												className: "grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary",
												children: /* @__PURE__ */ jsx(TIcon, { className: "h-5 w-5" })
											}), /* @__PURE__ */ jsxs("div", {
												className: "min-w-0",
												children: [/* @__PURE__ */ jsx("p", {
													className: "font-mono text-xs text-muted-foreground",
													children: String(t.tour_number ?? "")
												}), /* @__PURE__ */ jsx("h3", {
													className: "font-semibold text-sm leading-tight truncate",
													children: String(t.title ?? "")
												})]
											})]
										}), /* @__PURE__ */ jsx(Badge, {
											variant: "secondary",
											className: cn("shrink-0 text-[10px]", statusTone[String(t.status ?? "planned")]),
											children: String(t.status ?? "")
										})]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "space-y-1.5 text-xs text-muted-foreground",
										children: [/* @__PURE__ */ jsxs("div", {
											className: "flex items-center gap-1.5",
											children: [
												/* @__PURE__ */ jsx(Calendar, { className: "h-3.5 w-3.5 shrink-0" }),
												String(t.start_date ?? "").substring(0, 10),
												t.end_date && ` → ${String(t.end_date).substring(0, 10)}`
											]
										}), /* @__PURE__ */ jsxs("div", {
											className: "flex items-center gap-1.5",
											children: [
												/* @__PURE__ */ jsx(MapPin, { className: "h-3.5 w-3.5 shrink-0" }),
												Number(t.villages_count ?? 0),
												" villages planned"
											]
										})]
									}),
									t.objectives && /* @__PURE__ */ jsx("p", {
										className: "text-xs text-muted-foreground line-clamp-2 rounded-md bg-muted/40 p-2",
										children: String(t.objectives)
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "grid grid-cols-2 gap-2 rounded-lg bg-muted/40 p-3 text-center text-xs",
										children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
											className: "font-bold text-base tabular-nums",
											children: Number(t.villages_count ?? 0)
										}), /* @__PURE__ */ jsx("div", {
											className: "text-muted-foreground",
											children: "Villages"
										})] }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
											className: cn("font-bold text-base tabular-nums", isPast ? "text-success" : "text-muted-foreground"),
											children: isPast ? Number(t.citizens_met ?? 0).toLocaleString() : "—"
										}), /* @__PURE__ */ jsx("div", {
											className: "text-muted-foreground",
											children: "Citizens Met"
										})] })]
									}),
									t.key_outcomes && /* @__PURE__ */ jsx("p", {
										className: "text-xs text-muted-foreground line-clamp-2 rounded-md bg-success/5 border border-success/20 p-2",
										children: String(t.key_outcomes)
									}),
									/* @__PURE__ */ jsx("div", {
										className: "flex justify-end mt-auto",
										children: /* @__PURE__ */ jsxs(Button, {
											variant: "ghost",
											size: "sm",
											className: "h-7 gap-1 text-xs",
											children: ["View Details ", /* @__PURE__ */ jsx(ArrowUpRight, { className: "h-3 w-3" })]
										})
									})
								]
							})
						}, String(t.id));
					})
				}),
				tours.length === 0 && !isLoading && /* @__PURE__ */ jsxs("div", {
					className: "py-16 text-center",
					children: [
						/* @__PURE__ */ jsx(MapPin, { className: "h-12 w-12 mx-auto text-muted-foreground/40 mb-4" }),
						/* @__PURE__ */ jsx("p", {
							className: "text-muted-foreground",
							children: "No tours found"
						}),
						/* @__PURE__ */ jsxs(Button, {
							size: "sm",
							className: "mt-3",
							onClick: () => setShowCreate(true),
							children: [/* @__PURE__ */ jsx(Plus, { className: "h-4 w-4 mr-1.5" }), " Plan First Tour"]
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
					/* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsx(DialogTitle, { children: "Plan New Tour" }) }),
					/* @__PURE__ */ jsxs("div", {
						className: "grid gap-4",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ jsx(Label, { children: "Tour Title *" }), /* @__PURE__ */ jsx(Input, {
									value: form.title,
									onChange: (e) => setForm((f) => ({
										...f,
										title: e.target.value
									})),
									placeholder: "e.g. Madhapur Constituency Development Tour"
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ jsx(Label, { children: "Tour Type *" }), /* @__PURE__ */ jsxs(Select, {
									value: form.tour_type,
									onValueChange: (v) => setForm((f) => ({
										...f,
										tour_type: v
									})),
									children: [/* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, {}) }), /* @__PURE__ */ jsxs(SelectContent, { children: [
										/* @__PURE__ */ jsx(SelectItem, {
											value: "constituency_visit",
											children: "Constituency Visit"
										}),
										/* @__PURE__ */ jsx(SelectItem, {
											value: "inspection",
											children: "Inspection"
										}),
										/* @__PURE__ */ jsx(SelectItem, {
											value: "project_inspection",
											children: "Project Inspection"
										}),
										/* @__PURE__ */ jsx(SelectItem, {
											value: "field_survey",
											children: "Field Survey"
										}),
										/* @__PURE__ */ jsx(SelectItem, {
											value: "scheme_review",
											children: "Scheme Review"
										}),
										/* @__PURE__ */ jsx(SelectItem, {
											value: "other",
											children: "Other"
										})
									] })]
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "grid gap-3 sm:grid-cols-2",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ jsx(Label, { children: "Start Date *" }), /* @__PURE__ */ jsx(Input, {
										type: "date",
										value: form.start_date,
										onChange: (e) => setForm((f) => ({
											...f,
											start_date: e.target.value
										}))
									})]
								}), /* @__PURE__ */ jsxs("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ jsx(Label, { children: "End Date" }), /* @__PURE__ */ jsx(Input, {
										type: "date",
										value: form.end_date,
										onChange: (e) => setForm((f) => ({
											...f,
											end_date: e.target.value
										}))
									})]
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ jsx(Label, { children: "Villages to Cover" }), /* @__PURE__ */ jsx(Input, {
									type: "number",
									value: form.villages_count,
									onChange: (e) => setForm((f) => ({
										...f,
										villages_count: Number(e.target.value)
									})),
									min: 1
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ jsx(Label, { children: "Objectives" }), /* @__PURE__ */ jsx(Textarea, {
									value: form.objectives,
									onChange: (e) => setForm((f) => ({
										...f,
										objectives: e.target.value
									})),
									rows: 3,
									placeholder: "Review ongoing projects, address citizen issues…"
								})]
							})
						]
					}),
					/* @__PURE__ */ jsxs(DialogFooter, { children: [/* @__PURE__ */ jsx(Button, {
						variant: "outline",
						onClick: () => setShowCreate(false),
						children: "Cancel"
					}), /* @__PURE__ */ jsx(Button, {
						disabled: creating || !form.title || !form.start_date,
						onClick: () => doCreate(form),
						children: creating ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin mr-2" }), "Planning…"] }) : "Plan Tour"
					})] })
				]
			})
		})
	] });
}
//#endregion
export { ToursPage as component };

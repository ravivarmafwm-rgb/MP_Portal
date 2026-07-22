import { C as fetchGrievances, S as fetchGrievanceStats } from "./api-CQX857SN.js";
import { t as cn } from "./utils-C_uf36nf.js";
import { t as Button } from "./button-Bq5vK6RO.js";
import { t as Card } from "./card-CzXpCsbD.js";
import { t as Badge } from "./badge-D1Dupn2y.js";
import { t as Skeleton } from "./skeleton-D9W9wFsj.js";
import { t as PageHeader } from "./PageHeader-B7gZRr0G.js";
import { t as Input } from "./input-B8Q2ztVi.js";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-Dg1urBTx.js";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-C0WYWEQX.js";
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useQuery } from "@tanstack/react-query";
import { Download, Eye, Plus, Search } from "lucide-react";
import { motion } from "framer-motion";
//#region src/routes/_app.grievances.list.tsx?tsr-split=component
var statusTone = {
	pending: "bg-destructive/10 text-destructive",
	assigned: "bg-info/10 text-info",
	in_progress: "bg-primary/10 text-primary",
	escalated: "bg-warning/15 text-warning",
	resolved: "bg-success/10 text-success",
	closed: "bg-muted text-muted-foreground"
};
var priorityTone = {
	urgent: "bg-destructive/10 text-destructive",
	high: "bg-warning/15 text-warning",
	medium: "bg-info/10 text-info",
	low: "bg-muted text-muted-foreground"
};
function GrievanceListPage() {
	const [search, setSearch] = useState("");
	const [status, setStatus] = useState("all");
	const [priority, setPriority] = useState("all");
	const [page, setPage] = useState(1);
	const { data: statsData } = useQuery({
		queryKey: ["grievance-stats"],
		queryFn: fetchGrievanceStats,
		staleTime: 3e4
	});
	const { data, isLoading } = useQuery({
		queryKey: [
			"grievances",
			search,
			status,
			priority,
			page
		],
		queryFn: () => fetchGrievances({
			search,
			...status !== "all" ? { status } : {},
			...priority !== "all" ? { priority } : {},
			page,
			per_page: 20
		}),
		staleTime: 15e3
	});
	const grievances = data?.data ?? [];
	const meta = data?.meta ?? {
		total: 0,
		current_page: 1,
		last_page: 1
	};
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(PageHeader, {
		title: "Master Complaint Directory",
		description: `${meta.total} total cases · search, filter and triage at scale`,
		actions: /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsxs(Button, {
			variant: "outline",
			size: "sm",
			className: "gap-1.5",
			children: [/* @__PURE__ */ jsx(Download, { className: "h-4 w-4" }), " Export"]
		}), /* @__PURE__ */ jsxs(Button, {
			size: "sm",
			className: "gap-1.5",
			children: [/* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }), " Register Complaint"]
		})] })
	}), /* @__PURE__ */ jsxs("div", {
		className: "space-y-6 p-4 md:p-8",
		children: [statsData && /* @__PURE__ */ jsx("div", {
			className: "grid grid-cols-3 gap-3 sm:grid-cols-6",
			children: [
				{
					label: "Total",
					value: statsData.total,
					tone: "text-foreground"
				},
				{
					label: "Pending",
					value: statsData.pending,
					tone: "text-destructive"
				},
				{
					label: "Assigned",
					value: statsData.assigned,
					tone: "text-info"
				},
				{
					label: "Escalated",
					value: statsData.escalated,
					tone: "text-warning"
				},
				{
					label: "Resolved",
					value: statsData.resolved,
					tone: "text-success"
				},
				{
					label: "This Week",
					value: statsData.this_week,
					tone: "text-primary"
				}
			].map((s) => /* @__PURE__ */ jsxs(Card, {
				className: "p-3 text-center",
				children: [/* @__PURE__ */ jsx("div", {
					className: `font-display text-2xl font-bold tabular-nums ${s.tone}`,
					children: s.value ?? 0
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
							className: "relative min-w-[200px] flex-1",
							children: [/* @__PURE__ */ jsx(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ jsx(Input, {
								placeholder: "Search by ID, citizen, subject…",
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
									value: "assigned",
									children: "Assigned"
								}),
								/* @__PURE__ */ jsx(SelectItem, {
									value: "in_progress",
									children: "In Progress"
								}),
								/* @__PURE__ */ jsx(SelectItem, {
									value: "escalated",
									children: "Escalated"
								}),
								/* @__PURE__ */ jsx(SelectItem, {
									value: "resolved",
									children: "Resolved"
								}),
								/* @__PURE__ */ jsx(SelectItem, {
									value: "closed",
									children: "Closed"
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
						/* @__PURE__ */ jsx(TableHead, { children: "Grievance #" }),
						/* @__PURE__ */ jsx(TableHead, { children: "Citizen" }),
						/* @__PURE__ */ jsx(TableHead, { children: "Subject" }),
						/* @__PURE__ */ jsx(TableHead, { children: "Priority" }),
						/* @__PURE__ */ jsx(TableHead, { children: "Status" }),
						/* @__PURE__ */ jsx(TableHead, { children: "Date" }),
						/* @__PURE__ */ jsx(TableHead, {
							className: "text-right",
							children: "View"
						})
					] }) }), /* @__PURE__ */ jsxs(TableBody, { children: [grievances.map((g, i) => /* @__PURE__ */ jsxs(motion.tr, {
						initial: { opacity: 0 },
						animate: { opacity: 1 },
						transition: { delay: i * .01 },
						className: "border-b hover:bg-muted/40",
						children: [
							/* @__PURE__ */ jsx(TableCell, {
								className: "font-mono text-xs",
								children: String(g.grievance_number ?? "")
							}),
							/* @__PURE__ */ jsxs(TableCell, { children: [/* @__PURE__ */ jsx("div", {
								className: "text-sm font-semibold",
								children: String(g.citizen_name ?? "")
							}), /* @__PURE__ */ jsx("div", {
								className: "text-[11px] tabular-nums text-muted-foreground",
								children: String(g.citizen_mobile ?? "")
							})] }),
							/* @__PURE__ */ jsx(TableCell, {
								className: "max-w-[200px] truncate text-sm",
								children: String(g.subject ?? "")
							}),
							/* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(Badge, {
								variant: "secondary",
								className: cn("text-[10px]", priorityTone[String(g.priority ?? "medium")]),
								children: String(g.priority ?? "").toUpperCase()
							}) }),
							/* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(Badge, {
								variant: "secondary",
								className: cn("text-[10px]", statusTone[String(g.status ?? "pending")]),
								children: String(g.status ?? "").replace("_", " ")
							}) }),
							/* @__PURE__ */ jsx(TableCell, {
								className: "text-xs tabular-nums",
								children: String(g.created_at ?? "").substring(0, 10)
							}),
							/* @__PURE__ */ jsx(TableCell, {
								className: "text-right",
								children: /* @__PURE__ */ jsx(Link, {
									to: "/grievances/detail",
									children: /* @__PURE__ */ jsx(Button, {
										variant: "ghost",
										size: "icon",
										className: "h-7 w-7",
										children: /* @__PURE__ */ jsx(Eye, { className: "h-3.5 w-3.5" })
									})
								})
							})
						]
					}, String(g.id))), grievances.length === 0 && /* @__PURE__ */ jsx(TableRow, { children: /* @__PURE__ */ jsx(TableCell, {
						colSpan: 7,
						className: "py-12 text-center text-sm text-muted-foreground",
						children: "No grievances found."
					}) })] })] })
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "flex items-center justify-between border-t border-border/70 px-4 py-3 text-xs text-muted-foreground",
					children: [/* @__PURE__ */ jsxs("span", { children: [
						"Showing ",
						grievances.length,
						" of ",
						meta.total,
						" grievances"
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
	})] });
}
//#endregion
export { GrievanceListPage as component };

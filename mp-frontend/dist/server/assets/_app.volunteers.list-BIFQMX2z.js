import { G as fetchVolunteerStats, K as fetchVolunteers } from "./api-CQX857SN.js";
import { t as cn } from "./utils-C_uf36nf.js";
import { t as Button } from "./button-Bq5vK6RO.js";
import { t as Card } from "./card-CzXpCsbD.js";
import { t as Badge } from "./badge-D1Dupn2y.js";
import { n as AvatarFallback, t as Avatar } from "./avatar-CiQwCJNR.js";
import { t as Skeleton } from "./skeleton-D9W9wFsj.js";
import { t as PageHeader } from "./PageHeader-B7gZRr0G.js";
import { t as Input } from "./input-B8Q2ztVi.js";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-Dg1urBTx.js";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-C0WYWEQX.js";
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useQuery } from "@tanstack/react-query";
import { Download, Eye, MapPin, Phone, Plus, Search, UserCheck, UserMinus, UserPlus, Users } from "lucide-react";
import { motion } from "framer-motion";
//#region src/routes/_app.volunteers.list.tsx?tsr-split=component
var statusTone = {
	active: "bg-success/10 text-success",
	inactive: "bg-muted text-muted-foreground",
	on_leave: "bg-warning/15 text-warning",
	training: "bg-info/10 text-info"
};
function VolunteerListPage() {
	const [search, setSearch] = useState("");
	const [status, setStatus] = useState("all");
	const [page, setPage] = useState(1);
	const { data: statsData } = useQuery({
		queryKey: ["volunteer-stats"],
		queryFn: fetchVolunteerStats,
		staleTime: 6e4
	});
	const { data, isLoading } = useQuery({
		queryKey: [
			"volunteers",
			search,
			status,
			page
		],
		queryFn: () => fetchVolunteers({
			search,
			...status !== "all" ? { status } : {},
			page,
			per_page: 20
		}),
		staleTime: 3e4
	});
	const volunteers = data?.data ?? [];
	const meta = data?.meta ?? {
		total: 0,
		current_page: 1,
		last_page: 1
	};
	const kpis = [
		{
			label: "Total",
			value: statsData?.total ?? 0,
			icon: Users,
			tone: "bg-primary/10 text-primary"
		},
		{
			label: "Active",
			value: statsData?.active ?? 0,
			icon: UserCheck,
			tone: "bg-success/10 text-success"
		},
		{
			label: "Inactive",
			value: statsData?.inactive ?? 0,
			icon: UserMinus,
			tone: "bg-muted text-muted-foreground"
		},
		{
			label: "Available Now",
			value: statsData?.available_now ?? 0,
			icon: UserPlus,
			tone: "bg-info/10 text-info"
		},
		{
			label: "Villages Covered",
			value: statsData?.villages_covered ?? 0,
			icon: MapPin,
			tone: "bg-warning/15 text-warning"
		}
	];
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(PageHeader, {
		title: "Volunteer Directory",
		description: `${meta.total} field volunteers — search, filter, drill into any profile`,
		actions: /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsxs(Button, {
			variant: "outline",
			size: "sm",
			className: "gap-1.5",
			children: [/* @__PURE__ */ jsx(Download, { className: "h-4 w-4" }), " Export"]
		}), /* @__PURE__ */ jsxs(Button, {
			size: "sm",
			className: "gap-1.5",
			children: [/* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }), " Add Volunteer"]
		})] })
	}), /* @__PURE__ */ jsxs("div", {
		className: "space-y-6 p-4 md:p-8",
		children: [/* @__PURE__ */ jsx("div", {
			className: "grid grid-cols-2 gap-3 md:grid-cols-5",
			children: kpis.map((k, i) => /* @__PURE__ */ jsx(motion.div, {
				initial: {
					opacity: 0,
					y: 8
				},
				animate: {
					opacity: 1,
					y: 0
				},
				transition: { delay: i * .04 },
				children: /* @__PURE__ */ jsxs(Card, {
					className: "p-4",
					children: [
						/* @__PURE__ */ jsx("div", {
							className: cn("grid h-9 w-9 place-items-center rounded-lg", k.tone),
							children: /* @__PURE__ */ jsx(k.icon, { className: "h-4 w-4" })
						}),
						/* @__PURE__ */ jsx("div", {
							className: "mt-3 text-xs font-medium uppercase tracking-wider text-muted-foreground",
							children: k.label
						}),
						/* @__PURE__ */ jsx("div", {
							className: "mt-1 font-display text-2xl font-bold tabular-nums",
							children: k.value.toLocaleString()
						})
					]
				})
			}, k.label))
		}), /* @__PURE__ */ jsxs(Card, {
			className: "overflow-hidden",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "flex flex-wrap items-center gap-2 border-b border-border/70 bg-muted/30 p-3",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "relative min-w-[200px] flex-1",
						children: [/* @__PURE__ */ jsx(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ jsx(Input, {
							placeholder: "Search by name, mobile, ID…",
							className: "h-9 bg-background pl-9",
							value: search,
							onChange: (e) => {
								setSearch(e.target.value);
								setPage(1);
							}
						})]
					}), /* @__PURE__ */ jsxs(Select, {
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
								value: "active",
								children: "Active"
							}),
							/* @__PURE__ */ jsx(SelectItem, {
								value: "inactive",
								children: "Inactive"
							})
						] })]
					})]
				}),
				isLoading ? /* @__PURE__ */ jsx("div", {
					className: "space-y-2 p-4",
					children: Array.from({ length: 10 }).map((_, i) => /* @__PURE__ */ jsx(Skeleton, { className: "h-12 w-full" }, i))
				}) : /* @__PURE__ */ jsx("div", {
					className: "overflow-x-auto",
					children: /* @__PURE__ */ jsxs(Table, { children: [/* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
						/* @__PURE__ */ jsx(TableHead, { children: "Volunteer" }),
						/* @__PURE__ */ jsx(TableHead, { children: "ID" }),
						/* @__PURE__ */ jsx(TableHead, { children: "Mobile" }),
						/* @__PURE__ */ jsx(TableHead, { children: "Joined" }),
						/* @__PURE__ */ jsx(TableHead, { children: "Activities" }),
						/* @__PURE__ */ jsx(TableHead, { children: "Performance" }),
						/* @__PURE__ */ jsx(TableHead, { children: "Status" }),
						/* @__PURE__ */ jsx(TableHead, {
							className: "text-right",
							children: "Actions"
						})
					] }) }), /* @__PURE__ */ jsxs(TableBody, { children: [volunteers.map((v, i) => /* @__PURE__ */ jsxs(motion.tr, {
						initial: { opacity: 0 },
						animate: { opacity: 1 },
						transition: { delay: i * .015 },
						className: "border-b hover:bg-muted/40",
						children: [
							/* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-3",
								children: [/* @__PURE__ */ jsx(Avatar, {
									className: "h-9 w-9",
									children: /* @__PURE__ */ jsxs(AvatarFallback, {
										className: "text-xs",
										children: [String(v.first_name ?? "").charAt(0), String(v.last_name ?? "").charAt(0)]
									})
								}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
									className: "text-sm font-semibold",
									children: [
										String(v.first_name ?? ""),
										" ",
										String(v.last_name ?? "")
									]
								}), /* @__PURE__ */ jsx("div", {
									className: "text-[11px] text-muted-foreground",
									children: String(v.email ?? "—")
								})] })]
							}) }),
							/* @__PURE__ */ jsx(TableCell, {
								className: "font-mono text-xs",
								children: String(v.volunteer_id ?? "")
							}),
							/* @__PURE__ */ jsx(TableCell, {
								className: "tabular-nums text-xs",
								children: String(v.mobile_number ?? "—")
							}),
							/* @__PURE__ */ jsx(TableCell, {
								className: "text-xs tabular-nums",
								children: String(v.joining_date ?? "—")
							}),
							/* @__PURE__ */ jsx(TableCell, {
								className: "tabular-nums text-sm",
								children: String(v.total_activities ?? 0)
							}),
							/* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ jsx("div", {
									className: "h-1.5 w-16 overflow-hidden rounded-full bg-muted",
									children: /* @__PURE__ */ jsx("div", {
										className: "h-full rounded-full bg-primary",
										style: { width: `${Math.min(100, Number(v.performance_score ?? 0) * 10)}%` }
									})
								}), /* @__PURE__ */ jsx("span", {
									className: "text-xs font-semibold tabular-nums",
									children: Number(v.performance_score ?? 0).toFixed(1)
								})]
							}) }),
							/* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(Badge, {
								variant: "secondary",
								className: statusTone[String(v.status ?? "active")] ?? "bg-muted",
								children: String(v.status ?? "—")
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
										to: "/volunteers/profile",
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
					}, String(v.id))), volunteers.length === 0 && /* @__PURE__ */ jsx(TableRow, { children: /* @__PURE__ */ jsx(TableCell, {
						colSpan: 8,
						className: "py-12 text-center text-sm text-muted-foreground",
						children: "No volunteers found."
					}) })] })] })
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "flex items-center justify-between border-t border-border/70 px-4 py-3 text-xs text-muted-foreground",
					children: [/* @__PURE__ */ jsxs("span", { children: [
						"Showing ",
						volunteers.length,
						" of ",
						meta.total,
						" volunteers"
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
export { VolunteerListPage as component };

import { N as fetchProjectStats, P as fetchProjects } from "./api-CQX857SN.js";
import { t as cn } from "./utils-C_uf36nf.js";
import { t as Button } from "./button-Bq5vK6RO.js";
import { t as Card } from "./card-CzXpCsbD.js";
import { t as Badge } from "./badge-D1Dupn2y.js";
import { t as Skeleton } from "./skeleton-D9W9wFsj.js";
import { t as PageHeader } from "./PageHeader-B7gZRr0G.js";
import { t as Progress } from "./progress-DOIEKRJF.js";
import { Link } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useQuery } from "@tanstack/react-query";
import { Activity, Clock, Download, IndianRupee, Landmark, Plus, Wallet } from "lucide-react";
import { motion } from "framer-motion";
//#region src/routes/_app.projects.mplads.tsx?tsr-split=component
var MPLADS_CATEGORIES = [
	{
		category: "Roads & Connectivity",
		icon: "🛣️",
		projects: 0,
		allocated: 1800,
		utilized: 1250
	},
	{
		category: "Education",
		icon: "🎓",
		projects: 0,
		allocated: 800,
		utilized: 560
	},
	{
		category: "Health Infrastructure",
		icon: "🏥",
		projects: 0,
		allocated: 600,
		utilized: 380
	},
	{
		category: "Water Supply",
		icon: "💧",
		projects: 0,
		allocated: 700,
		utilized: 480
	},
	{
		category: "Community Halls",
		icon: "🏛️",
		projects: 0,
		allocated: 400,
		utilized: 240
	},
	{
		category: "Street Lighting",
		icon: "💡",
		projects: 0,
		allocated: 300,
		utilized: 200
	},
	{
		category: "Drainage & Sanitation",
		icon: "🚿",
		projects: 0,
		allocated: 500,
		utilized: 310
	}
];
function MpladsPage() {
	const { data: stats } = useQuery({
		queryKey: ["project-stats-mplads"],
		queryFn: fetchProjectStats,
		staleTime: 6e4
	});
	const { data: projectsData, isLoading } = useQuery({
		queryKey: ["projects-mplads-list"],
		queryFn: () => fetchProjects({ per_page: 12 }),
		staleTime: 3e4
	});
	const projects = projectsData?.data ?? [];
	const totalBudget = stats?.total_budget ?? 0;
	const totalSpent = stats?.total_spent ?? 0;
	const totalAlloc = MPLADS_CATEGORIES.reduce((s, c) => s + c.allocated, 0);
	const mpladsKpis = [
		{
			l: "Budget Allocated",
			v: `₹${(totalBudget / 1e7).toFixed(1)}Cr`,
			icon: IndianRupee,
			tone: "bg-primary/10 text-primary"
		},
		{
			l: "Budget Utilized",
			v: `₹${(totalSpent / 1e7).toFixed(1)}Cr`,
			icon: Wallet,
			tone: "bg-success/10 text-success"
		},
		{
			l: "Pending",
			v: `₹${((totalBudget - totalSpent) / 1e7).toFixed(1)}Cr`,
			icon: Clock,
			tone: "bg-warning/15 text-warning"
		},
		{
			l: "Active Projects",
			v: stats?.in_progress ?? 0,
			icon: Activity,
			tone: "bg-info/10 text-info"
		}
	];
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(PageHeader, {
		title: "MPLADS Management Center",
		description: "Track allocations, sanctions and utilisation across MPLADS categories.",
		actions: /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsxs(Button, {
			variant: "outline",
			size: "sm",
			className: "gap-1.5",
			children: [/* @__PURE__ */ jsx(Download, { className: "h-4 w-4" }), " MPLADS Statement"]
		}), /* @__PURE__ */ jsxs(Button, {
			size: "sm",
			className: "gap-1.5",
			children: [/* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }), " Allocate Budget"]
		})] })
	}), /* @__PURE__ */ jsxs("div", {
		className: "space-y-6 p-4 md:p-8",
		children: [
			/* @__PURE__ */ jsx("div", {
				className: "grid grid-cols-2 gap-3 md:grid-cols-4",
				children: mpladsKpis.map((k, i) => /* @__PURE__ */ jsx(motion.div, {
					initial: {
						opacity: 0,
						y: 10
					},
					animate: {
						opacity: 1,
						y: 0
					},
					transition: { delay: i * .05 },
					children: /* @__PURE__ */ jsxs(Card, {
						className: "p-5",
						children: [
							/* @__PURE__ */ jsx("div", {
								className: cn("grid h-10 w-10 place-items-center rounded-lg", k.tone),
								children: /* @__PURE__ */ jsx(k.icon, { className: "h-5 w-5" })
							}),
							/* @__PURE__ */ jsx("div", {
								className: "mt-3 text-[11px] uppercase tracking-wider text-muted-foreground",
								children: k.l
							}),
							/* @__PURE__ */ jsx("div", {
								className: "mt-1 font-display text-2xl font-bold tabular-nums",
								children: k.v
							})
						]
					})
				}, k.l))
			}),
			/* @__PURE__ */ jsxs(Card, {
				className: "p-5",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ jsx("h3", {
						className: "font-display text-base font-bold",
						children: "Allocation Analytics · By Category"
					}), /* @__PURE__ */ jsx(Badge, {
						variant: "secondary",
						className: "bg-primary/10 text-primary",
						children: "FY 2025-26"
					})]
				}), /* @__PURE__ */ jsx("div", {
					className: "mt-4 space-y-3",
					children: MPLADS_CATEGORIES.map((c, i) => {
						const utilPct = Math.round(c.utilized / c.allocated * 100);
						const widthPct = c.allocated / totalAlloc * 100;
						return /* @__PURE__ */ jsxs(motion.div, {
							initial: {
								opacity: 0,
								x: -8
							},
							animate: {
								opacity: 1,
								x: 0
							},
							transition: { delay: i * .04 },
							className: "rounded-xl border border-border/70 p-4",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-3",
									children: [/* @__PURE__ */ jsx("div", {
										className: "grid h-9 w-9 place-items-center rounded-lg bg-muted text-base",
										children: c.icon
									}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
										className: "text-sm font-semibold",
										children: c.category
									}), /* @__PURE__ */ jsxs("div", {
										className: "text-[11px] text-muted-foreground",
										children: [c.projects, " projects"]
									})] })]
								}), /* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-4 text-right text-xs",
									children: [
										/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
											className: "text-muted-foreground",
											children: "Allocated"
										}), /* @__PURE__ */ jsxs("div", {
											className: "font-semibold tabular-nums",
											children: [
												"₹",
												(c.allocated / 100).toFixed(2),
												"Cr"
											]
										})] }),
										/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
											className: "text-muted-foreground",
											children: "Utilized"
										}), /* @__PURE__ */ jsxs("div", {
											className: "font-semibold tabular-nums text-success",
											children: [
												"₹",
												(c.utilized / 100).toFixed(2),
												"Cr"
											]
										})] }),
										/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
											className: "text-muted-foreground",
											children: "%"
										}), /* @__PURE__ */ jsxs("div", {
											className: "font-semibold tabular-nums",
											children: [utilPct, "%"]
										})] })
									]
								})]
							}), /* @__PURE__ */ jsx("div", {
								className: "mt-3 flex h-2 overflow-hidden rounded-full bg-muted",
								children: /* @__PURE__ */ jsx(motion.div, {
									initial: { width: 0 },
									animate: { width: `${widthPct}%` },
									transition: {
										duration: .9,
										delay: .1 + i * .04
									},
									className: "bg-gradient-to-r from-primary to-info"
								})
							})]
						}, c.category);
					})
				})]
			}),
			/* @__PURE__ */ jsxs(Card, {
				className: "p-5",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ jsx("h3", {
						className: "font-display text-base font-bold",
						children: "Active Projects"
					}), /* @__PURE__ */ jsx(Button, {
						asChild: true,
						variant: "ghost",
						size: "sm",
						children: /* @__PURE__ */ jsx(Link, {
							to: "/projects/development",
							children: "View all"
						})
					})]
				}), isLoading ? /* @__PURE__ */ jsx("div", {
					className: "mt-4 space-y-2",
					children: Array.from({ length: 6 }).map((_, i) => /* @__PURE__ */ jsx(Skeleton, { className: "h-20 w-full" }, i))
				}) : /* @__PURE__ */ jsxs("div", {
					className: "mt-4 grid gap-3 md:grid-cols-2",
					children: [projects.map((p) => /* @__PURE__ */ jsxs(Link, {
						to: "/projects/project-detail",
						search: { id: String(p.id) },
						className: "group rounded-xl border border-border/70 p-4 transition-all hover:-translate-y-0.5 hover:shadow-elevated",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-2 text-[10px]",
								children: [/* @__PURE__ */ jsx(Badge, {
									variant: "secondary",
									className: "rounded-full capitalize",
									children: String(p.project_type ?? p.category ?? "general")
								}), /* @__PURE__ */ jsxs(Badge, {
									variant: "secondary",
									className: "rounded-full bg-accent text-accent-foreground",
									children: [/* @__PURE__ */ jsx(Landmark, { className: "mr-1 h-3 w-3" }), " Project"]
								})]
							}),
							/* @__PURE__ */ jsx("div", {
								className: "mt-2 truncate text-sm font-semibold",
								children: String(p.name ?? "")
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "text-[11px] text-muted-foreground",
								children: [
									String(p.location ?? "—"),
									" · ₹",
									(Number(p.sanctioned_amount ?? 0) / 1e5).toFixed(1),
									"L"
								]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "mt-3 flex items-center justify-between text-xs",
								children: [/* @__PURE__ */ jsx("span", {
									className: "text-muted-foreground",
									children: "Progress"
								}), /* @__PURE__ */ jsxs("span", {
									className: "font-semibold tabular-nums",
									children: [Number(p.progress_percentage ?? 0).toFixed(0), "%"]
								})]
							}),
							/* @__PURE__ */ jsx(Progress, {
								value: Number(p.progress_percentage ?? 0),
								className: "mt-1 h-1.5"
							})
						]
					}, String(p.id))), projects.length === 0 && /* @__PURE__ */ jsx("div", {
						className: "col-span-2 py-8 text-center text-sm text-muted-foreground",
						children: "No projects found."
					})]
				})]
			})
		]
	})] });
}
//#endregion
export { MpladsPage as component };

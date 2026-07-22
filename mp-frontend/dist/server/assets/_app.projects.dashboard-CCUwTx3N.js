import { N as fetchProjectStats, P as fetchProjects } from "./api-CQX857SN.js";
import { t as cn } from "./utils-C_uf36nf.js";
import { t as Card } from "./card-CzXpCsbD.js";
import { t as Badge } from "./badge-D1Dupn2y.js";
import { t as Skeleton } from "./skeleton-D9W9wFsj.js";
import { t as PageHeader } from "./PageHeader-B7gZRr0G.js";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, CheckCircle2, Clock, DollarSign, HardHat } from "lucide-react";
import { motion } from "framer-motion";
//#region src/routes/_app.projects.dashboard.tsx?tsr-split=component
function ProjectsDashboardPage() {
	const { data: stats } = useQuery({
		queryKey: ["project-stats"],
		queryFn: fetchProjectStats,
		staleTime: 6e4
	});
	const { data: projectsData, isLoading } = useQuery({
		queryKey: ["projects-list"],
		queryFn: () => fetchProjects({ per_page: 10 }),
		staleTime: 3e4
	});
	const projects = projectsData?.data ?? [];
	const statusTone = {
		in_progress: "bg-primary/10 text-primary",
		completed: "bg-success/10 text-success",
		delayed: "bg-warning/15 text-warning",
		proposed: "bg-muted text-muted-foreground"
	};
	const kpis = [
		{
			label: "Total Projects",
			value: stats?.total ?? 0,
			icon: HardHat,
			tone: "bg-primary/10 text-primary"
		},
		{
			label: "In Progress",
			value: stats?.in_progress ?? 0,
			icon: Clock,
			tone: "bg-info/10 text-info"
		},
		{
			label: "Completed",
			value: stats?.completed ?? 0,
			icon: CheckCircle2,
			tone: "bg-success/10 text-success"
		},
		{
			label: "Delayed",
			value: stats?.delayed ?? 0,
			icon: AlertTriangle,
			tone: "bg-warning/15 text-warning"
		}
	];
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(PageHeader, {
		title: "Project Command Center",
		description: "MPLADS and development projects across the constituency"
	}), /* @__PURE__ */ jsxs("div", {
		className: "space-y-6 p-4 md:p-8",
		children: [
			/* @__PURE__ */ jsx("div", {
				className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
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
						className: "p-5",
						children: [
							/* @__PURE__ */ jsx("div", {
								className: cn("grid h-10 w-10 place-items-center rounded-xl", k.tone),
								children: /* @__PURE__ */ jsx(k.icon, { className: "h-5 w-5" })
							}),
							/* @__PURE__ */ jsx("div", {
								className: "mt-3 text-xs font-medium uppercase tracking-wider text-muted-foreground",
								children: k.label
							}),
							/* @__PURE__ */ jsx("div", {
								className: "mt-1 font-display text-3xl font-bold tabular-nums",
								children: k.value
							})
						]
					})
				}, k.label))
			}),
			stats && /* @__PURE__ */ jsx("div", {
				className: "grid gap-4 sm:grid-cols-2",
				children: /* @__PURE__ */ jsxs(Card, {
					className: "p-5",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-2 mb-3",
						children: [/* @__PURE__ */ jsx(DollarSign, { className: "h-4 w-4 text-primary" }), /* @__PURE__ */ jsx("h3", {
							className: "font-semibold",
							children: "Budget Overview"
						})]
					}), /* @__PURE__ */ jsxs("div", {
						className: "space-y-2",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "flex justify-between text-sm",
								children: [/* @__PURE__ */ jsx("span", {
									className: "text-muted-foreground",
									children: "Total Sanctioned"
								}), /* @__PURE__ */ jsxs("span", {
									className: "font-semibold",
									children: [
										"₹",
										(stats.total_budget / 1e7).toFixed(1),
										" Cr"
									]
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "flex justify-between text-sm",
								children: [/* @__PURE__ */ jsx("span", {
									className: "text-muted-foreground",
									children: "Total Spent"
								}), /* @__PURE__ */ jsxs("span", {
									className: "font-semibold text-primary",
									children: [
										"₹",
										(stats.total_spent / 1e7).toFixed(1),
										" Cr"
									]
								})]
							}),
							/* @__PURE__ */ jsx("div", {
								className: "h-2 overflow-hidden rounded-full bg-muted mt-2",
								children: /* @__PURE__ */ jsx("div", {
									className: "h-full rounded-full bg-primary",
									style: { width: stats.total_budget > 0 ? `${Math.round(stats.total_spent / stats.total_budget * 100)}%` : "0%" }
								})
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "text-xs text-muted-foreground text-right",
								children: [stats.total_budget > 0 ? Math.round(stats.total_spent / stats.total_budget * 100) : 0, "% utilized"]
							})
						]
					})]
				})
			}),
			/* @__PURE__ */ jsxs(Card, {
				className: "overflow-hidden",
				children: [/* @__PURE__ */ jsx("div", {
					className: "border-b border-border/70 bg-muted/30 p-4",
					children: /* @__PURE__ */ jsx("h3", {
						className: "font-semibold",
						children: "Recent Projects"
					})
				}), isLoading ? /* @__PURE__ */ jsx("div", {
					className: "space-y-2 p-4",
					children: Array.from({ length: 5 }).map((_, i) => /* @__PURE__ */ jsx(Skeleton, { className: "h-16 w-full" }, i))
				}) : /* @__PURE__ */ jsxs("div", {
					className: "divide-y divide-border/60",
					children: [projects.map((p, i) => /* @__PURE__ */ jsxs(motion.div, {
						initial: { opacity: 0 },
						animate: { opacity: 1 },
						transition: { delay: i * .02 },
						className: "flex items-center gap-4 p-4 hover:bg-muted/30",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ jsx("div", {
									className: "text-sm font-semibold truncate",
									children: String(p.name ?? "")
								}), /* @__PURE__ */ jsxs("div", {
									className: "text-xs text-muted-foreground",
									children: [
										String(p.project_type ?? "—"),
										" · ",
										String(p.location ?? "—")
									]
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "text-right text-sm",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "font-semibold",
									children: [Number(p.progress_percentage ?? 0).toFixed(0), "%"]
								}), /* @__PURE__ */ jsx("div", {
									className: "text-xs text-muted-foreground",
									children: "complete"
								})]
							}),
							/* @__PURE__ */ jsx(Badge, {
								variant: "secondary",
								className: statusTone[String(p.status ?? "proposed")] ?? "bg-muted",
								children: String(p.status ?? "").replace("_", " ")
							})
						]
					}, String(p.id))), projects.length === 0 && /* @__PURE__ */ jsx("div", {
						className: "p-8 text-center text-sm text-muted-foreground",
						children: "No projects found."
					})]
				})]
			})
		]
	})] });
}
//#endregion
export { ProjectsDashboardPage as component };

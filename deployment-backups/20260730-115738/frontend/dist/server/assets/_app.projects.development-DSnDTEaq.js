import { P as fetchProjects } from "./api-CQX857SN.js";
import { t as cn } from "./utils-C_uf36nf.js";
import { t as Button } from "./button-Bq5vK6RO.js";
import { t as Card } from "./card-CzXpCsbD.js";
import { t as Badge } from "./badge-D1Dupn2y.js";
import { t as Skeleton } from "./skeleton-D9W9wFsj.js";
import { t as PageHeader } from "./PageHeader-B7gZRr0G.js";
import { t as Input } from "./input-B8Q2ztVi.js";
import { t as Progress } from "./progress-DOIEKRJF.js";
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useQuery } from "@tanstack/react-query";
import { ArrowUpDown, Download, Eye, Landmark, Plus, Search } from "lucide-react";
import { motion } from "framer-motion";
//#region src/routes/_app.projects.development.tsx?tsr-split=component
var statusTone = {
	proposed: "bg-muted text-muted-foreground",
	approved: "bg-info/10 text-info",
	in_progress: "bg-primary/10 text-primary",
	completed: "bg-success/10 text-success",
	delayed: "bg-destructive/10 text-destructive",
	at_risk: "bg-destructive/15 text-destructive",
	cancelled: "bg-muted text-muted-foreground"
};
function DevelopmentDirectory() {
	const [q, setQ] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");
	const [page, setPage] = useState(1);
	const { data, isLoading } = useQuery({
		queryKey: [
			"projects-dev",
			q,
			statusFilter,
			page
		],
		queryFn: () => fetchProjects({
			search: q,
			page,
			per_page: 20,
			...statusFilter !== "all" ? { status: statusFilter } : {}
		}),
		staleTime: 3e4
	});
	const projects = data?.data ?? [];
	const meta = data?.meta ?? {
		total: 0,
		current_page: 1,
		last_page: 1
	};
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(PageHeader, {
		title: "Development Project Directory",
		description: "Search, filter and drill into every constituency project.",
		actions: /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsxs(Button, {
			variant: "outline",
			size: "sm",
			className: "gap-1.5",
			children: [/* @__PURE__ */ jsx(Download, { className: "h-4 w-4" }), " Export CSV"]
		}), /* @__PURE__ */ jsxs(Button, {
			size: "sm",
			className: "gap-1.5",
			children: [/* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }), " New Project"]
		})] })
	}), /* @__PURE__ */ jsx("div", {
		className: "space-y-4 p-4 md:p-8",
		children: /* @__PURE__ */ jsxs(Card, {
			className: "overflow-hidden",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "flex flex-wrap items-center gap-2 border-b border-border/70 bg-muted/30 p-3",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "relative flex-1 min-w-[220px]",
						children: [/* @__PURE__ */ jsx(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ jsx(Input, {
							value: q,
							onChange: (e) => {
								setQ(e.target.value);
								setPage(1);
							},
							placeholder: "Search by name, location…",
							className: "h-9 bg-background pl-9"
						})]
					}), /* @__PURE__ */ jsx("div", {
						className: "flex flex-wrap items-center gap-1",
						children: [
							"all",
							"in_progress",
							"completed",
							"delayed",
							"proposed",
							"approved"
						].map((f) => /* @__PURE__ */ jsx(Button, {
							size: "sm",
							variant: statusFilter === f ? "default" : "outline",
							onClick: () => {
								setStatusFilter(f);
								setPage(1);
							},
							className: "capitalize text-xs",
							children: f.replace("_", " ")
						}, f))
					})]
				}),
				isLoading ? /* @__PURE__ */ jsx("div", {
					className: "space-y-2 p-4",
					children: Array.from({ length: 8 }).map((_, i) => /* @__PURE__ */ jsx(Skeleton, { className: "h-14 w-full" }, i))
				}) : /* @__PURE__ */ jsx("div", {
					className: "overflow-x-auto",
					children: /* @__PURE__ */ jsxs("table", {
						className: "w-full text-sm",
						children: [/* @__PURE__ */ jsx("thead", {
							className: "bg-muted/30 text-[11px] uppercase tracking-wider text-muted-foreground",
							children: /* @__PURE__ */ jsx("tr", { children: [
								"Project #",
								"Project Name",
								"Type",
								"Location",
								"Budget",
								"Completion",
								"Status",
								""
							].map((h) => /* @__PURE__ */ jsx("th", {
								className: "px-4 py-3 text-left font-medium",
								children: /* @__PURE__ */ jsxs("span", {
									className: "inline-flex items-center gap-1",
									children: [h, h && h !== "" && /* @__PURE__ */ jsx(ArrowUpDown, { className: "h-3 w-3 opacity-40" })]
								})
							}, h)) })
						}), /* @__PURE__ */ jsxs("tbody", { children: [projects.map((p, i) => /* @__PURE__ */ jsxs(motion.tr, {
							initial: { opacity: 0 },
							animate: { opacity: 1 },
							transition: { delay: Math.min(i * .01, .3) },
							className: "border-t border-border/60 transition-colors hover:bg-muted/30",
							children: [
								/* @__PURE__ */ jsx("td", {
									className: "px-4 py-3 font-mono text-xs",
									children: String(p.project_number ?? "").substring(0, 12)
								}),
								/* @__PURE__ */ jsxs("td", {
									className: "px-4 py-3",
									children: [/* @__PURE__ */ jsx("div", {
										className: "font-semibold truncate max-w-[180px]",
										children: String(p.name ?? "")
									}), String(p.fund_source ?? "") === "MPLADS" && /* @__PURE__ */ jsxs("div", {
										className: "text-[10px] text-accent-foreground/70",
										children: [/* @__PURE__ */ jsx(Landmark, { className: "mr-1 inline h-3 w-3" }), "MPLADS"]
									})]
								}),
								/* @__PURE__ */ jsx("td", {
									className: "px-4 py-3",
									children: /* @__PURE__ */ jsx(Badge, {
										variant: "secondary",
										className: "rounded-full text-[10px] capitalize",
										children: String(p.project_type ?? p.category ?? "general")
									})
								}),
								/* @__PURE__ */ jsx("td", {
									className: "px-4 py-3 text-xs",
									children: String(p.location ?? "—")
								}),
								/* @__PURE__ */ jsxs("td", {
									className: "px-4 py-3 tabular-nums text-xs",
									children: [
										"₹",
										(Number(p.sanctioned_amount ?? p.estimated_cost ?? 0) / 1e5).toFixed(1),
										"L"
									]
								}),
								/* @__PURE__ */ jsx("td", {
									className: "px-4 py-3",
									children: /* @__PURE__ */ jsxs("div", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ jsx(Progress, {
											value: Number(p.progress_percentage ?? 0),
											className: "h-1.5 w-20"
										}), /* @__PURE__ */ jsxs("span", {
											className: "tabular-nums text-xs font-semibold",
											children: [Number(p.progress_percentage ?? 0).toFixed(0), "%"]
										})]
									})
								}),
								/* @__PURE__ */ jsx("td", {
									className: "px-4 py-3",
									children: /* @__PURE__ */ jsx(Badge, {
										variant: "secondary",
										className: cn("text-[10px]", statusTone[String(p.status ?? "proposed")]),
										children: String(p.status ?? "").replace("_", " ")
									})
								}),
								/* @__PURE__ */ jsx("td", {
									className: "px-4 py-3",
									children: /* @__PURE__ */ jsx(Button, {
										asChild: true,
										variant: "ghost",
										size: "sm",
										children: /* @__PURE__ */ jsxs(Link, {
											to: "/projects/project-detail",
											search: { id: String(p.id) },
											children: [/* @__PURE__ */ jsx(Eye, { className: "h-3.5 w-3.5" }), " Open"]
										})
									})
								})
							]
						}, String(p.id))), projects.length === 0 && /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", {
							colSpan: 8,
							className: "px-4 py-12 text-center text-sm text-muted-foreground",
							children: "No projects found."
						}) })] })]
					})
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "flex items-center justify-between border-t border-border/70 bg-muted/20 px-4 py-3 text-xs text-muted-foreground",
					children: [/* @__PURE__ */ jsxs("span", { children: [
						"Showing ",
						projects.length,
						" of ",
						meta.total,
						" projects"
					] }), /* @__PURE__ */ jsxs("div", {
						className: "flex gap-1",
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
		})
	})] });
}
//#endregion
export { DevelopmentDirectory as component };

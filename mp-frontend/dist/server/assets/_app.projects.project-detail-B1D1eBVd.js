import { M as fetchProject, P as fetchProjects } from "./api-CQX857SN.js";
import { t as cn } from "./utils-C_uf36nf.js";
import { t as Button } from "./button-Bq5vK6RO.js";
import { t as Card } from "./card-CzXpCsbD.js";
import { t as Badge } from "./badge-D1Dupn2y.js";
import { t as Skeleton } from "./skeleton-D9W9wFsj.js";
import { t as PageHeader } from "./PageHeader-B7gZRr0G.js";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./tabs-CCJRliUM.js";
import { t as Progress } from "./progress-DOIEKRJF.js";
import { useSearch } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useQuery } from "@tanstack/react-query";
import { Calendar, ClipboardList, Download, Edit3, FileText, ImageIcon, IndianRupee, MapPin, TrendingUp, User } from "lucide-react";
import { motion } from "framer-motion";
//#region src/routes/_app.projects.project-detail.tsx?tsr-split=component
var statusTone = {
	proposed: "bg-muted text-muted-foreground",
	in_progress: "bg-primary/10 text-primary",
	completed: "bg-success/10 text-success",
	delayed: "bg-warning/15 text-warning",
	at_risk: "bg-destructive/10 text-destructive",
	cancelled: "bg-muted text-muted-foreground"
};
function ProjectDetail() {
	const { id } = useSearch({ from: "/_app/projects/project-detail" });
	const { data: listData } = useQuery({
		queryKey: ["projects-for-detail-fallback"],
		queryFn: () => fetchProjects({ per_page: 1 }),
		enabled: !id,
		staleTime: 6e4
	});
	const projectId = id || listData?.data?.[0]?.id;
	const { data: p, isLoading } = useQuery({
		queryKey: ["project-detail", projectId],
		queryFn: () => fetchProject(projectId),
		enabled: !!projectId,
		staleTime: 3e4
	});
	if (isLoading || !p) return /* @__PURE__ */ jsx("div", {
		className: "p-8 space-y-4",
		children: Array.from({ length: 4 }).map((_, i) => /* @__PURE__ */ jsx(Skeleton, { className: "h-20 w-full" }, i))
	});
	const budget = Number(p.sanctioned_amount ?? p.estimated_cost ?? 0);
	const spent = Number(p.expenditure ?? 0);
	const progress = Number(p.progress_percentage ?? 0);
	const milestones = p.milestones ?? [];
	const updates = p.updates ?? [];
	const budgets = p.budgets ?? [];
	const photos = p.photos ?? [];
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(PageHeader, {
		title: "Project 360",
		description: "Complete oversight of a single constituency project.",
		actions: /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsxs(Button, {
			variant: "outline",
			size: "sm",
			className: "gap-1.5",
			children: [/* @__PURE__ */ jsx(Download, { className: "h-4 w-4" }), " Report"]
		}), /* @__PURE__ */ jsxs(Button, {
			size: "sm",
			className: "gap-1.5",
			children: [/* @__PURE__ */ jsx(Edit3, { className: "h-4 w-4" }), " Update Progress"]
		})] })
	}), /* @__PURE__ */ jsxs("div", {
		className: "space-y-6 p-4 md:p-8",
		children: [/* @__PURE__ */ jsx(Card, {
			className: "overflow-hidden",
			children: /* @__PURE__ */ jsxs("div", {
				className: "bg-gradient-to-br from-primary/10 via-background to-background p-6",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex flex-wrap items-start justify-between gap-4",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "min-w-0",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "flex flex-wrap items-center gap-2",
								children: [
									/* @__PURE__ */ jsx(Badge, {
										variant: "secondary",
										className: "rounded-full capitalize",
										children: String(p.project_type ?? p.category ?? "general")
									}),
									/* @__PURE__ */ jsx(Badge, {
										variant: "secondary",
										className: cn("rounded-full", statusTone[String(p.status ?? "proposed")]),
										children: String(p.status ?? "").replace("_", " ")
									}),
									String(p.status) === "delayed" && /* @__PURE__ */ jsx(Badge, {
										variant: "secondary",
										className: "rounded-full bg-warning/15 text-warning",
										children: "Delayed"
									})
								]
							}),
							/* @__PURE__ */ jsx("h2", {
								className: "mt-2 font-display text-2xl font-bold",
								children: String(p.name ?? "")
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground",
								children: [
									/* @__PURE__ */ jsx("span", {
										className: "font-mono",
										children: String(p.project_number ?? "").substring(0, 12)
									}),
									/* @__PURE__ */ jsxs("span", {
										className: "inline-flex items-center gap-1",
										children: [
											/* @__PURE__ */ jsx(MapPin, { className: "h-3 w-3" }),
											" ",
											String(p.location ?? "—")
										]
									}),
									/* @__PURE__ */ jsxs("span", {
										className: "inline-flex items-center gap-1",
										children: [
											/* @__PURE__ */ jsx(Calendar, { className: "h-3 w-3" }),
											" ",
											String(p.start_date ?? "").substring(0, 10),
											" → ",
											String(p.scheduled_completion_date ?? "—").substring(0, 10)
										]
									}),
									p.contractor && /* @__PURE__ */ jsxs("span", {
										className: "inline-flex items-center gap-1",
										children: [
											/* @__PURE__ */ jsx(User, { className: "h-3 w-3" }),
											" ",
											String(p.contractor?.name ?? "—")
										]
									})
								]
							})
						]
					}), /* @__PURE__ */ jsxs("div", {
						className: "grid grid-cols-3 gap-4 text-right",
						children: [
							/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
								className: "text-[10px] uppercase tracking-wider text-muted-foreground",
								children: "Budget"
							}), /* @__PURE__ */ jsxs("div", {
								className: "font-display text-xl font-bold tabular-nums",
								children: [
									"₹",
									(budget / 1e5).toFixed(1),
									"L"
								]
							})] }),
							/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
								className: "text-[10px] uppercase tracking-wider text-muted-foreground",
								children: "Utilized"
							}), /* @__PURE__ */ jsxs("div", {
								className: "font-display text-xl font-bold tabular-nums text-success",
								children: [
									"₹",
									(spent / 1e5).toFixed(1),
									"L"
								]
							})] }),
							/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
								className: "text-[10px] uppercase tracking-wider text-muted-foreground",
								children: "Progress"
							}), /* @__PURE__ */ jsxs("div", {
								className: "font-display text-xl font-bold tabular-nums",
								children: [progress, "%"]
							})] })
						]
					})]
				}), /* @__PURE__ */ jsx(Progress, {
					value: progress,
					className: "mt-5 h-2"
				})]
			})
		}), /* @__PURE__ */ jsxs(Tabs, {
			defaultValue: "overview",
			children: [
				/* @__PURE__ */ jsxs(TabsList, {
					className: "flex w-full flex-wrap justify-start",
					children: [
						/* @__PURE__ */ jsxs(TabsTrigger, {
							value: "overview",
							children: [/* @__PURE__ */ jsx(ClipboardList, { className: "mr-1.5 h-3.5 w-3.5" }), " Overview"]
						}),
						/* @__PURE__ */ jsxs(TabsTrigger, {
							value: "budget",
							children: [/* @__PURE__ */ jsx(IndianRupee, { className: "mr-1.5 h-3.5 w-3.5" }), " Budget"]
						}),
						/* @__PURE__ */ jsxs(TabsTrigger, {
							value: "timeline",
							children: [/* @__PURE__ */ jsx(Calendar, { className: "mr-1.5 h-3.5 w-3.5" }), " Timeline"]
						}),
						/* @__PURE__ */ jsxs(TabsTrigger, {
							value: "progress",
							children: [/* @__PURE__ */ jsx(TrendingUp, { className: "mr-1.5 h-3.5 w-3.5" }), " Progress"]
						}),
						/* @__PURE__ */ jsxs(TabsTrigger, {
							value: "documents",
							children: [/* @__PURE__ */ jsx(FileText, { className: "mr-1.5 h-3.5 w-3.5" }), " Documents"]
						}),
						/* @__PURE__ */ jsxs(TabsTrigger, {
							value: "photos",
							children: [/* @__PURE__ */ jsx(ImageIcon, { className: "mr-1.5 h-3.5 w-3.5" }), " Photos"]
						})
					]
				}),
				/* @__PURE__ */ jsx(TabsContent, {
					value: "overview",
					className: "mt-4",
					children: /* @__PURE__ */ jsxs("div", {
						className: "grid gap-4 lg:grid-cols-3",
						children: [/* @__PURE__ */ jsxs(Card, {
							className: "p-5 lg:col-span-2",
							children: [
								/* @__PURE__ */ jsx("h3", {
									className: "font-display text-base font-bold",
									children: "Project Summary"
								}),
								/* @__PURE__ */ jsx("p", {
									className: "mt-2 text-sm text-muted-foreground",
									children: String(p.description ?? "No description available for this project.")
								}),
								/* @__PURE__ */ jsx("div", {
									className: "mt-4 grid gap-3 sm:grid-cols-2",
									children: [
										{
											l: "Project Number",
											v: String(p.project_number ?? "—")
										},
										{
											l: "Status",
											v: String(p.status ?? "—").replace("_", " ")
										},
										{
											l: "Fund Source",
											v: String(p.fund_source ?? "Government")
										},
										{
											l: "Beneficiaries",
											v: String(p.beneficiary_count ?? "—")
										},
										{
											l: "Start Date",
											v: String(p.start_date ?? "—").substring(0, 10)
										},
										{
											l: "Completion",
											v: String(p.scheduled_completion_date ?? "—").substring(0, 10)
										}
									].map(({ l, v }) => /* @__PURE__ */ jsxs("div", {
										className: "rounded-lg border border-border/70 p-3",
										children: [/* @__PURE__ */ jsx("div", {
											className: "text-[10px] uppercase tracking-wider text-muted-foreground",
											children: l
										}), /* @__PURE__ */ jsx("div", {
											className: "mt-1 text-sm font-semibold capitalize",
											children: v
										})]
									}, l))
								})
							]
						}), /* @__PURE__ */ jsxs(Card, {
							className: "p-5",
							children: [
								/* @__PURE__ */ jsx("h3", {
									className: "font-display text-base font-bold",
									children: "Location"
								}),
								/* @__PURE__ */ jsx("div", {
									className: "mt-3 grid h-40 place-items-center rounded-lg border border-dashed border-border/70 bg-muted/30",
									children: /* @__PURE__ */ jsxs("div", {
										className: "text-center",
										children: [/* @__PURE__ */ jsx(MapPin, { className: "mx-auto h-7 w-7 text-primary" }), /* @__PURE__ */ jsx("div", {
											className: "mt-2 text-xs font-semibold",
											children: String(p.location ?? "—")
										})]
									})
								}),
								p.constituency && /* @__PURE__ */ jsxs("div", {
									className: "mt-3 text-xs text-muted-foreground",
									children: ["Constituency: ", /* @__PURE__ */ jsx("span", {
										className: "font-semibold text-foreground",
										children: String(p.constituency?.name ?? "—")
									})]
								})
							]
						})]
					})
				}),
				/* @__PURE__ */ jsxs(TabsContent, {
					value: "budget",
					className: "mt-4",
					children: [/* @__PURE__ */ jsx("div", {
						className: "grid gap-4 lg:grid-cols-4",
						children: [
							{
								l: "Allocated",
								v: `₹${(budget / 1e5).toFixed(1)}L`,
								tone: "bg-primary/10 text-primary"
							},
							{
								l: "Utilized",
								v: `₹${(spent / 1e5).toFixed(1)}L`,
								tone: "bg-success/10 text-success"
							},
							{
								l: "Remaining",
								v: `₹${((budget - spent) / 1e5).toFixed(1)}L`,
								tone: "bg-info/10 text-info"
							},
							{
								l: "Efficiency",
								v: `${budget > 0 ? Math.round(spent / budget * 100) : 0}%`,
								tone: "bg-warning/15 text-warning"
							}
						].map((k) => /* @__PURE__ */ jsxs(Card, {
							className: "p-5",
							children: [/* @__PURE__ */ jsx("div", {
								className: cn("inline-flex rounded px-2 py-0.5 text-[10px] font-medium", k.tone),
								children: k.l
							}), /* @__PURE__ */ jsx("div", {
								className: "mt-2 font-display text-2xl font-bold tabular-nums",
								children: k.v
							})]
						}, k.l))
					}), budgets.length > 0 && /* @__PURE__ */ jsxs(Card, {
						className: "mt-4 p-5",
						children: [/* @__PURE__ */ jsx("h3", {
							className: "font-display text-base font-bold",
							children: "Budget Breakdown"
						}), /* @__PURE__ */ jsx("div", {
							className: "mt-4 space-y-2",
							children: budgets.map((b) => /* @__PURE__ */ jsxs("div", {
								className: "flex items-center justify-between rounded-lg border border-border/70 p-3 text-sm",
								children: [/* @__PURE__ */ jsx("span", {
									className: "font-medium",
									children: String(b.budget_head ?? b.head ?? "Budget Item")
								}), /* @__PURE__ */ jsxs("span", {
									className: "tabular-nums",
									children: [
										"₹",
										(Number(b.allocated_amount ?? 0) / 1e5).toFixed(1),
										"L"
									]
								})]
							}, String(b.id)))
						})]
					})]
				}),
				/* @__PURE__ */ jsx(TabsContent, {
					value: "timeline",
					className: "mt-4",
					children: /* @__PURE__ */ jsxs(Card, {
						className: "p-5",
						children: [/* @__PURE__ */ jsx("h3", {
							className: "font-display text-base font-bold",
							children: "Project Milestones"
						}), milestones.length === 0 ? /* @__PURE__ */ jsx("p", {
							className: "mt-4 text-sm text-muted-foreground",
							children: "No milestones recorded yet."
						}) : /* @__PURE__ */ jsx("div", {
							className: "mt-6 relative space-y-4 border-l border-border/70 pl-6",
							children: milestones.map((m, i) => /* @__PURE__ */ jsxs(motion.div, {
								initial: {
									opacity: 0,
									x: -8
								},
								animate: {
									opacity: 1,
									x: 0
								},
								transition: { delay: i * .05 },
								className: "relative",
								children: [/* @__PURE__ */ jsx("div", {
									className: cn("absolute -left-[31px] grid h-8 w-8 place-items-center rounded-full border-2 border-background text-sm", m.status === "completed" ? "bg-success/15" : "bg-warning/15"),
									children: m.status === "completed" ? "✓" : "⏳"
								}), /* @__PURE__ */ jsxs("div", {
									className: "rounded-lg border border-border/70 p-3",
									children: [/* @__PURE__ */ jsxs("div", {
										className: "flex items-center justify-between text-xs",
										children: [/* @__PURE__ */ jsx("span", {
											className: "font-semibold",
											children: String(m.title ?? m.milestone_name ?? "Milestone")
										}), /* @__PURE__ */ jsx(Badge, {
											variant: "secondary",
											className: cn("text-[10px]", m.status === "completed" ? "bg-success/10 text-success" : "bg-warning/15 text-warning"),
											children: String(m.status ?? "pending")
										})]
									}), /* @__PURE__ */ jsx("div", {
										className: "mt-1 text-[11px] text-muted-foreground",
										children: String(m.target_date ?? "").substring(0, 10)
									})]
								})]
							}, String(m.id ?? i)))
						})]
					})
				}),
				/* @__PURE__ */ jsx(TabsContent, {
					value: "progress",
					className: "mt-4",
					children: /* @__PURE__ */ jsxs("div", {
						className: "grid gap-4 lg:grid-cols-3",
						children: [
							/* @__PURE__ */ jsxs(Card, {
								className: "p-5",
								children: [/* @__PURE__ */ jsx("h3", {
									className: "font-display text-base font-bold",
									children: "Physical Progress"
								}), /* @__PURE__ */ jsx("div", {
									className: "mt-4 grid place-items-center",
									children: /* @__PURE__ */ jsxs("div", {
										className: "relative grid h-28 w-28 place-items-center",
										children: [/* @__PURE__ */ jsxs("svg", {
											className: "absolute inset-0 -rotate-90",
											viewBox: "0 0 100 100",
											children: [/* @__PURE__ */ jsx("circle", {
												cx: "50",
												cy: "50",
												r: "44",
												stroke: "currentColor",
												className: "text-muted/40",
												strokeWidth: "8",
												fill: "none"
											}), /* @__PURE__ */ jsx("circle", {
												cx: "50",
												cy: "50",
												r: "44",
												stroke: "currentColor",
												className: "text-primary",
												strokeWidth: "8",
												fill: "none",
												strokeDasharray: `${progress * 2.76} 276`,
												strokeLinecap: "round"
											})]
										}), /* @__PURE__ */ jsxs("span", {
											className: "font-display text-2xl font-bold tabular-nums",
											children: [progress, "%"]
										})]
									})
								})]
							}),
							/* @__PURE__ */ jsxs(Card, {
								className: "p-5",
								children: [/* @__PURE__ */ jsx("h3", {
									className: "font-display text-base font-bold",
									children: "Financial Progress"
								}), /* @__PURE__ */ jsx("div", {
									className: "mt-4 grid place-items-center",
									children: /* @__PURE__ */ jsxs("div", {
										className: "relative grid h-28 w-28 place-items-center",
										children: [/* @__PURE__ */ jsxs("svg", {
											className: "absolute inset-0 -rotate-90",
											viewBox: "0 0 100 100",
											children: [/* @__PURE__ */ jsx("circle", {
												cx: "50",
												cy: "50",
												r: "44",
												stroke: "currentColor",
												className: "text-muted/40",
												strokeWidth: "8",
												fill: "none"
											}), /* @__PURE__ */ jsx("circle", {
												cx: "50",
												cy: "50",
												r: "44",
												stroke: "currentColor",
												className: "text-success",
												strokeWidth: "8",
												fill: "none",
												strokeDasharray: `${(budget > 0 ? spent / budget : 0) * 276} 276`,
												strokeLinecap: "round"
											})]
										}), /* @__PURE__ */ jsxs("span", {
											className: "font-display text-2xl font-bold tabular-nums",
											children: [budget > 0 ? Math.round(spent / budget * 100) : 0, "%"]
										})]
									})
								})]
							}),
							/* @__PURE__ */ jsxs(Card, {
								className: "p-5",
								children: [/* @__PURE__ */ jsx("h3", {
									className: "font-display text-base font-bold",
									children: "Recent Updates"
								}), /* @__PURE__ */ jsx("div", {
									className: "mt-3 space-y-2 text-xs",
									children: updates.length === 0 ? /* @__PURE__ */ jsx("p", {
										className: "text-muted-foreground",
										children: "No updates recorded."
									}) : updates.slice(0, 4).map((u, i) => /* @__PURE__ */ jsxs("div", {
										className: "flex items-center justify-between rounded border border-border/70 p-2",
										children: [/* @__PURE__ */ jsx("span", {
											className: "truncate",
											children: String(u.update_title ?? u.remarks ?? "Update")
										}), /* @__PURE__ */ jsx("span", {
											className: "text-muted-foreground ml-2 shrink-0",
											children: String(u.created_at ?? "").substring(0, 10)
										})]
									}, String(u.id ?? i)))
								})]
							})
						]
					})
				}),
				/* @__PURE__ */ jsx(TabsContent, {
					value: "documents",
					className: "mt-4",
					children: /* @__PURE__ */ jsx("div", {
						className: "grid gap-3 md:grid-cols-2 lg:grid-cols-3",
						children: [
							"DPR",
							"Tender Documents",
							"Progress Reports",
							"Bills & Vouchers",
							"Completion Certificate",
							"Photos"
						].map((docName, i) => /* @__PURE__ */ jsxs(Card, {
							className: "flex items-center gap-3 p-4 transition-all hover:-translate-y-0.5 hover:shadow-elevated",
							children: [
								/* @__PURE__ */ jsx("div", {
									className: "grid h-11 w-11 place-items-center rounded-lg bg-primary/10 text-primary",
									children: /* @__PURE__ */ jsx(FileText, { className: "h-5 w-5" })
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "min-w-0 flex-1",
									children: [/* @__PURE__ */ jsx("div", {
										className: "truncate text-sm font-semibold",
										children: docName
									}), /* @__PURE__ */ jsx("div", {
										className: "text-[11px] text-muted-foreground",
										children: "Click to upload"
									})]
								}),
								/* @__PURE__ */ jsx(Button, {
									variant: "ghost",
									size: "sm",
									children: /* @__PURE__ */ jsx(Download, { className: "h-3.5 w-3.5" })
								})
							]
						}, docName))
					})
				}),
				/* @__PURE__ */ jsx(TabsContent, {
					value: "photos",
					className: "mt-4",
					children: photos.length === 0 ? /* @__PURE__ */ jsx("div", {
						className: "grid gap-3 sm:grid-cols-2 md:grid-cols-3",
						children: [
							"Before Work",
							"During Construction",
							"Completion"
						].map((phase) => /* @__PURE__ */ jsxs(Card, {
							className: "overflow-hidden",
							children: [/* @__PURE__ */ jsx("div", {
								className: "grid h-44 place-items-center bg-muted/30 border-2 border-dashed border-border/40",
								children: /* @__PURE__ */ jsx(ImageIcon, { className: "h-10 w-10 text-muted-foreground/60" })
							}), /* @__PURE__ */ jsxs("div", {
								className: "p-3",
								children: [/* @__PURE__ */ jsx("div", {
									className: "text-xs font-semibold",
									children: phase
								}), /* @__PURE__ */ jsx("div", {
									className: "text-[11px] text-muted-foreground",
									children: "Click to upload photo"
								})]
							})]
						}, phase))
					}) : /* @__PURE__ */ jsx("div", {
						className: "grid gap-3 sm:grid-cols-2 md:grid-cols-3",
						children: photos.map((ph, i) => /* @__PURE__ */ jsxs(Card, {
							className: "overflow-hidden",
							children: [/* @__PURE__ */ jsx("div", {
								className: "grid h-44 place-items-center bg-muted/30",
								children: /* @__PURE__ */ jsx(ImageIcon, { className: "h-10 w-10 text-muted-foreground/60" })
							}), /* @__PURE__ */ jsxs("div", {
								className: "p-3",
								children: [/* @__PURE__ */ jsx("div", {
									className: "text-xs font-semibold",
									children: String(ph.caption ?? `Photo ${i + 1}`)
								}), /* @__PURE__ */ jsx("div", {
									className: "text-[11px] text-muted-foreground",
									children: String(ph.created_at ?? "").substring(0, 10)
								})]
							})]
						}, String(ph.id ?? i)))
					})
				})
			]
		})]
	})] });
}
//#endregion
export { ProjectDetail as component };

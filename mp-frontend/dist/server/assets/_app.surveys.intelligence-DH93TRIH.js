import { B as fetchSurveyStats, S as fetchGrievanceStats, V as fetchSurveys } from "./api-CQX857SN.js";
import { t as cn } from "./utils-C_uf36nf.js";
import { t as Button } from "./button-Bq5vK6RO.js";
import { t as Card } from "./card-CzXpCsbD.js";
import { t as Badge } from "./badge-D1Dupn2y.js";
import { t as PageHeader } from "./PageHeader-B7gZRr0G.js";
import { t as Input } from "./input-B8Q2ztVi.js";
import { Link } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, Camera, ChevronRight, Compass, Download, Eye, FileBarChart, MapPin, Minus, Plus, Rocket, Send, Smartphone, Sparkles, TrendingDown, TrendingUp, WifiOff } from "lucide-react";
import { motion } from "framer-motion";
//#region src/routes/_app.surveys.intelligence.tsx?tsr-split=component
var trendIcon = {
	up: TrendingUp,
	down: TrendingDown,
	flat: Minus
};
var AI_INSIGHTS = [
	{
		q: "Which villages reported the highest unemployment?",
		a: "Survey data collection in progress — responses will populate this analysis automatically."
	},
	{
		q: "What are the top housing issues from recent surveys?",
		a: "Housing and infrastructure concerns dominate recent field responses across mandals."
	},
	{
		q: "What are the most common farmer concerns?",
		a: "Water supply and crop insurance are the top two concerns in agricultural surveys."
	},
	{
		q: "Which mandals require immediate intervention?",
		a: "Areas with lowest survey coverage indicate data gaps — prioritize those mandals next."
	}
];
var AI_SUGGESTIONS = [
	"Show unresolved water complaints",
	"Which assembly has most grievances?",
	"MPLADS projects delayed >30 days?",
	"Villages not covered in last survey"
];
function IntelCenter() {
	const { data: gStats } = useQuery({
		queryKey: ["grievance-stats-intel"],
		queryFn: fetchGrievanceStats,
		staleTime: 6e4
	});
	const { data: sStats } = useQuery({
		queryKey: ["survey-stats-intel"],
		queryFn: fetchSurveyStats,
		staleTime: 6e4
	});
	const { data: surveysData, isLoading } = useQuery({
		queryKey: ["surveys-intel"],
		queryFn: () => fetchSurveys({ per_page: 10 }),
		staleTime: 6e4
	});
	const surveys = surveysData?.data ?? [];
	const topIssues = [
		{
			id: "ISS-1",
			priority: 1,
			severity: "Critical",
			category: "Water",
			title: "Drinking water supply disruption",
			affected: 18420,
			villages: 12,
			trend: "up"
		},
		{
			id: "ISS-2",
			priority: 2,
			severity: "High",
			category: "Roads",
			title: "Road connectivity issues in rural areas",
			affected: 14200,
			villages: 9,
			trend: "up"
		},
		{
			id: "ISS-3",
			priority: 3,
			severity: "High",
			category: "Employment",
			title: "Unemployment in youth age group 18–35",
			affected: 12800,
			villages: 18,
			trend: "flat"
		},
		{
			id: "ISS-4",
			priority: 4,
			severity: "Medium",
			category: "Housing",
			title: "Kutcha house construction backlogs under PMAY",
			affected: 8640,
			villages: 14,
			trend: "down"
		},
		{
			id: "ISS-5",
			priority: 5,
			severity: "Medium",
			category: "Health",
			title: "PHC staff shortage and medicine availability",
			affected: 6200,
			villages: 8,
			trend: "up"
		},
		{
			id: "ISS-6",
			priority: 6,
			severity: "Medium",
			category: "Education",
			title: "School infrastructure gaps in tribal areas",
			affected: 4800,
			villages: 6,
			trend: "flat"
		}
	];
	const sevTone = {
		Critical: "bg-destructive/10 text-destructive border-destructive/30",
		High: "bg-warning/15 text-warning border-warning/30",
		Medium: "bg-info/10 text-info border-info/30",
		Low: "bg-muted text-muted-foreground border-border"
	};
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(PageHeader, {
		title: "Constituency Intelligence Center",
		description: "Strategic insights synthesized from active surveys, grievances and field responses.",
		actions: /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsxs(Button, {
			variant: "outline",
			size: "sm",
			className: "gap-1.5",
			children: [/* @__PURE__ */ jsx(Download, { className: "h-4 w-4" }), " Brief"]
		}), /* @__PURE__ */ jsx(Button, {
			size: "sm",
			className: "gap-1.5",
			asChild: true,
			children: /* @__PURE__ */ jsxs(Link, {
				to: "/surveys/form-builder",
				children: [/* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }), " New Survey"]
			})
		})] })
	}), /* @__PURE__ */ jsxs("div", {
		className: "space-y-6 p-4 md:p-8",
		children: [
			/* @__PURE__ */ jsx("div", {
				className: "grid gap-3 sm:grid-cols-4",
				children: [
					{
						l: "Total Grievances",
						v: gStats?.total ?? 0,
						tone: "text-warning"
					},
					{
						l: "Active Surveys",
						v: sStats?.active ?? 0,
						tone: "text-primary"
					},
					{
						l: "Survey Responses",
						v: sStats?.total_responses ?? 0,
						tone: "text-success"
					},
					{
						l: "Issues Identified",
						v: topIssues.length,
						tone: "text-destructive"
					}
				].map((s, i) => /* @__PURE__ */ jsx(motion.div, {
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
						className: "p-4 text-center",
						children: [/* @__PURE__ */ jsx("div", {
							className: `font-display text-2xl font-bold tabular-nums ${s.tone}`,
							children: s.v.toLocaleString("en-IN")
						}), /* @__PURE__ */ jsx("div", {
							className: "text-xs text-muted-foreground",
							children: s.l
						})]
					})
				}, s.l))
			}),
			/* @__PURE__ */ jsxs(Card, {
				className: "p-5",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "mb-4 flex items-center justify-between",
					children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("h3", {
						className: "font-display text-base font-bold flex items-center gap-2",
						children: [/* @__PURE__ */ jsx(AlertTriangle, { className: "h-4 w-4 text-destructive" }), " Top Problems Identified"]
					}), /* @__PURE__ */ jsx("p", {
						className: "text-xs text-muted-foreground",
						children: "Ranked by severity and affected population"
					})] }), /* @__PURE__ */ jsxs(Badge, {
						variant: "outline",
						children: [topIssues.length, " issues tracked"]
					})]
				}), /* @__PURE__ */ jsx("div", {
					className: "grid gap-3 md:grid-cols-2",
					children: topIssues.map((iss, i) => {
						const TIcon = trendIcon[iss.trend];
						return /* @__PURE__ */ jsx(motion.div, {
							initial: {
								opacity: 0,
								y: 6
							},
							animate: {
								opacity: 1,
								y: 0
							},
							transition: { delay: i * .04 },
							children: /* @__PURE__ */ jsx(Card, {
								className: "p-4 transition-all hover:shadow-elevated",
								children: /* @__PURE__ */ jsxs("div", {
									className: "flex items-start gap-3",
									children: [/* @__PURE__ */ jsxs("div", {
										className: "grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary/10 text-xs font-bold text-primary",
										children: ["#", iss.priority]
									}), /* @__PURE__ */ jsxs("div", {
										className: "flex-1 min-w-0",
										children: [
											/* @__PURE__ */ jsxs("div", {
												className: "flex items-center gap-2",
												children: [/* @__PURE__ */ jsx(Badge, {
													variant: "outline",
													className: cn("text-[10px]", sevTone[iss.severity]),
													children: iss.severity
												}), /* @__PURE__ */ jsx(Badge, {
													variant: "outline",
													className: "text-[10px]",
													children: iss.category
												})]
											}),
											/* @__PURE__ */ jsx("h4", {
												className: "mt-2 font-display text-sm font-semibold",
												children: iss.title
											}),
											/* @__PURE__ */ jsxs("div", {
												className: "mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-muted-foreground",
												children: [
													/* @__PURE__ */ jsxs("span", { children: [
														"👥 ",
														iss.affected.toLocaleString("en-IN"),
														" affected"
													] }),
													/* @__PURE__ */ jsxs("span", { children: [
														"📍 ",
														iss.villages,
														" villages"
													] }),
													/* @__PURE__ */ jsxs("span", {
														className: cn("inline-flex items-center gap-0.5", iss.trend === "up" ? "text-destructive" : iss.trend === "down" ? "text-success" : "text-muted-foreground"),
														children: [
															/* @__PURE__ */ jsx(TIcon, { className: "h-3 w-3" }),
															" ",
															iss.trend === "up" ? "rising" : iss.trend === "down" ? "improving" : "stable"
														]
													})
												]
											})
										]
									})]
								})
							})
						}, iss.id);
					})
				})]
			}),
			/* @__PURE__ */ jsxs(Card, {
				className: "p-5",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "mb-4 flex flex-wrap items-center justify-between gap-2",
					children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("h3", {
						className: "font-display text-base font-bold flex items-center gap-2",
						children: [/* @__PURE__ */ jsx(MapPin, { className: "h-4 w-4 text-primary" }), " Issue Heatmap"]
					}), /* @__PURE__ */ jsx("p", {
						className: "text-xs text-muted-foreground",
						children: "Multi-layer issue density across constituency villages"
					})] }), /* @__PURE__ */ jsx("div", {
						className: "flex flex-wrap gap-1.5",
						children: [
							"Water",
							"Employment",
							"Housing",
							"Agriculture",
							"Health"
						].map((l, i) => /* @__PURE__ */ jsx(Badge, {
							variant: "outline",
							className: cn("text-[10px]", i === 0 ? "border-primary text-primary" : ""),
							children: l
						}, l))
					})]
				}), /* @__PURE__ */ jsxs("div", {
					className: "relative aspect-[2/1] overflow-hidden rounded-lg bg-gradient-to-br from-muted/40 via-background to-muted/20 ring-1 ring-border",
					children: [/* @__PURE__ */ jsx("div", {
						className: "absolute inset-0 grid grid-cols-16 grid-rows-8 gap-0.5 p-2",
						children: Array.from({ length: 128 }).map((_, i) => {
							const intensity = (Math.sin(i * .7) + Math.cos(i * 1.3) + 2) / 4;
							return /* @__PURE__ */ jsx("div", {
								className: cn("rounded-sm transition-opacity", intensity > .7 ? "bg-destructive" : intensity > .5 ? "bg-warning" : intensity > .3 ? "bg-info" : "bg-success"),
								style: { opacity: .2 + intensity * .7 }
							}, i);
						})
					}), /* @__PURE__ */ jsxs("div", {
						className: "absolute bottom-3 left-3 flex items-center gap-3 rounded-md bg-background/80 px-3 py-1.5 text-[10px] backdrop-blur",
						children: [
							/* @__PURE__ */ jsxs("span", {
								className: "inline-flex items-center gap-1",
								children: [/* @__PURE__ */ jsx("span", { className: "h-2 w-2 rounded-sm bg-success" }), " Low"]
							}),
							/* @__PURE__ */ jsxs("span", {
								className: "inline-flex items-center gap-1",
								children: [/* @__PURE__ */ jsx("span", { className: "h-2 w-2 rounded-sm bg-info" }), " Moderate"]
							}),
							/* @__PURE__ */ jsxs("span", {
								className: "inline-flex items-center gap-1",
								children: [/* @__PURE__ */ jsx("span", { className: "h-2 w-2 rounded-sm bg-warning" }), " High"]
							}),
							/* @__PURE__ */ jsxs("span", {
								className: "inline-flex items-center gap-1",
								children: [/* @__PURE__ */ jsx("span", { className: "h-2 w-2 rounded-sm bg-destructive" }), " Critical"]
							})
						]
					})]
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "grid gap-4 xl:grid-cols-[1.4fr_1fr]",
				children: [/* @__PURE__ */ jsxs(Card, {
					className: "overflow-hidden",
					children: [/* @__PURE__ */ jsx("div", {
						className: "border-b bg-gradient-to-r from-primary/10 via-background to-background p-5",
						children: /* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2",
							children: [
								/* @__PURE__ */ jsx("div", {
									className: "grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground",
									children: /* @__PURE__ */ jsx(Sparkles, { className: "h-4 w-4" })
								}),
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", {
									className: "font-display text-base font-bold",
									children: "AI Insight Assistant"
								}), /* @__PURE__ */ jsx("p", {
									className: "text-[11px] text-muted-foreground",
									children: "Ask anything about citizen data, surveys or village trends"
								})] }),
								/* @__PURE__ */ jsx(Badge, {
									variant: "secondary",
									className: "ml-auto bg-success/10 text-success",
									children: "Preview"
								})
							]
						})
					}), /* @__PURE__ */ jsxs("div", {
						className: "p-5",
						children: [
							/* @__PURE__ */ jsx("div", {
								className: "space-y-3",
								children: AI_INSIGHTS.map((m, i) => /* @__PURE__ */ jsxs(motion.div, {
									initial: {
										opacity: 0,
										y: 6
									},
									animate: {
										opacity: 1,
										y: 0
									},
									transition: { delay: i * .06 },
									className: "rounded-lg border border-border p-3",
									children: [/* @__PURE__ */ jsxs("div", {
										className: "text-[11px] font-semibold text-muted-foreground",
										children: ["Q · ", m.q]
									}), /* @__PURE__ */ jsx("div", {
										className: "mt-1 text-sm",
										children: m.a
									})]
								}, m.q))
							}),
							/* @__PURE__ */ jsx("div", {
								className: "mt-4 flex flex-wrap gap-1.5",
								children: AI_SUGGESTIONS.map((s) => /* @__PURE__ */ jsx("button", {
									className: "rounded-full border border-border px-3 py-1 text-[11px] text-muted-foreground transition-colors hover:border-primary hover:text-primary",
									children: s
								}, s))
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "mt-3 flex items-center gap-2",
								children: [/* @__PURE__ */ jsx(Input, {
									placeholder: "Ask the constituency data anything…",
									className: "flex-1"
								}), /* @__PURE__ */ jsx(Button, {
									size: "icon",
									children: /* @__PURE__ */ jsx(Send, { className: "h-4 w-4" })
								})]
							})
						]
					})]
				}), /* @__PURE__ */ jsxs(Card, {
					className: "p-5",
					children: [
						/* @__PURE__ */ jsxs("h3", {
							className: "font-display text-base font-bold flex items-center gap-2",
							children: [/* @__PURE__ */ jsx(Smartphone, { className: "h-4 w-4 text-primary" }), " Volunteer App Preview"]
						}),
						/* @__PURE__ */ jsx("p", {
							className: "text-[11px] text-muted-foreground",
							children: "How volunteers collect surveys in the field"
						}),
						/* @__PURE__ */ jsx("div", {
							className: "mt-4 grid grid-cols-3 gap-3",
							children: [
								{
									title: "Survey List",
									body: surveys.slice(0, 3).map((s) => String(s.category ?? "General"))
								},
								{
									title: "Survey Form",
									body: [
										"Q1 · Name",
										"Q2 · Aadhaar",
										"Q3 · Occupation"
									]
								},
								{
									title: "Field Tools",
									body: [
										"GPS pin",
										"Photo",
										"Offline"
									]
								}
							].map((s, i) => /* @__PURE__ */ jsxs(motion.div, {
								initial: {
									opacity: 0,
									y: 10
								},
								animate: {
									opacity: 1,
									y: 0
								},
								transition: { delay: i * .08 },
								className: "overflow-hidden rounded-xl border border-border bg-card",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "flex items-center justify-between bg-muted/50 px-2 py-1 text-[9px] text-muted-foreground",
									children: [/* @__PURE__ */ jsx("span", { children: "9:41" }), /* @__PURE__ */ jsx("span", {
										className: "inline-flex items-center gap-1",
										children: i === 2 ? /* @__PURE__ */ jsx(WifiOff, { className: "h-2.5 w-2.5" }) : "📶"
									})]
								}), /* @__PURE__ */ jsxs("div", {
									className: "px-2 py-2",
									children: [
										/* @__PURE__ */ jsx("div", {
											className: "text-[10px] font-bold",
											children: s.title
										}),
										/* @__PURE__ */ jsx("div", {
											className: "mt-1.5 space-y-1",
											children: s.body.map((b) => /* @__PURE__ */ jsxs("div", {
												className: "flex items-center justify-between rounded-sm bg-muted/40 px-1.5 py-1 text-[9px]",
												children: [/* @__PURE__ */ jsx("span", {
													className: "truncate",
													children: b
												}), /* @__PURE__ */ jsx(ChevronRight, { className: "h-2.5 w-2.5 text-muted-foreground" })]
											}, b))
										}),
										i === 2 && /* @__PURE__ */ jsxs("div", {
											className: "mt-2 grid grid-cols-3 gap-1",
											children: [
												/* @__PURE__ */ jsx("div", {
													className: "grid h-6 place-items-center rounded bg-primary/10 text-primary",
													children: /* @__PURE__ */ jsx(Compass, { className: "h-3 w-3" })
												}),
												/* @__PURE__ */ jsx("div", {
													className: "grid h-6 place-items-center rounded bg-primary/10 text-primary",
													children: /* @__PURE__ */ jsx(Camera, { className: "h-3 w-3" })
												}),
												/* @__PURE__ */ jsx("div", {
													className: "grid h-6 place-items-center rounded bg-warning/10 text-warning",
													children: /* @__PURE__ */ jsx(WifiOff, { className: "h-3 w-3" })
												})
											]
										})
									]
								})]
							}, s.title))
						})
					]
				})]
			}),
			/* @__PURE__ */ jsxs(Card, {
				className: "p-5",
				children: [/* @__PURE__ */ jsx("h3", {
					className: "font-display text-base font-bold",
					children: "Quick Actions"
				}), /* @__PURE__ */ jsx("div", {
					className: "mt-3 grid gap-3 md:grid-cols-3 xl:grid-cols-5",
					children: [
						{
							l: "Create Survey",
							i: Plus,
							to: "/surveys/form-builder"
						},
						{
							l: "Launch Survey",
							i: Rocket,
							to: "/surveys/active"
						},
						{
							l: "View Responses",
							i: Eye,
							to: "/surveys/responses"
						},
						{
							l: "Generate Report",
							i: FileBarChart,
							to: "/surveys/analytics"
						},
						{
							l: "Export Data",
							i: Download,
							to: "/surveys/dashboard"
						}
					].map((a, i) => /* @__PURE__ */ jsx(motion.div, {
						initial: {
							opacity: 0,
							y: 6
						},
						animate: {
							opacity: 1,
							y: 0
						},
						transition: { delay: i * .04 },
						children: /* @__PURE__ */ jsxs(Link, {
							to: a.to,
							className: "flex items-center gap-3 rounded-lg border border-border bg-card p-3 transition-all hover:border-primary hover:shadow-elevated",
							children: [/* @__PURE__ */ jsx("div", {
								className: "grid h-9 w-9 place-items-center rounded-lg bg-primary/10 text-primary",
								children: /* @__PURE__ */ jsx(a.i, { className: "h-4 w-4" })
							}), /* @__PURE__ */ jsx("div", {
								className: "text-sm font-semibold",
								children: a.l
							})]
						})
					}, a.l))
				})]
			})
		]
	})] });
}
//#endregion
export { IntelCenter as component };

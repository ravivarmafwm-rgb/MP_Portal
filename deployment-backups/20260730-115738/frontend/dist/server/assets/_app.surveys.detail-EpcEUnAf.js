import { V as fetchSurveys, z as fetchSurvey } from "./api-CQX857SN.js";
import { t as cn } from "./utils-C_uf36nf.js";
import { t as Button } from "./button-Bq5vK6RO.js";
import { t as Card } from "./card-CzXpCsbD.js";
import { t as Badge } from "./badge-D1Dupn2y.js";
import { t as Skeleton } from "./skeleton-D9W9wFsj.js";
import { t as PageHeader } from "./PageHeader-B7gZRr0G.js";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./tabs-CCJRliUM.js";
import { t as Progress } from "./progress-DOIEKRJF.js";
import { Link, useSearch } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Calendar, CheckCircle2, CheckSquare, ChevronDown, Circle, CircleDot, Clock, Download, Hash, ListChecks, MapPin, Share2, ShieldCheck, Star, Type, Upload, Users2 } from "lucide-react";
import { motion } from "framer-motion";
//#region src/routes/_app.surveys.detail.tsx?tsr-split=component
var typeIcon = {
	"short_text": Type,
	"long_text": Type,
	"number": Hash,
	"dropdown": ChevronDown,
	"radio": CircleDot,
	"checkbox": CheckSquare,
	"rating": Star,
	"file_upload": Upload,
	"gps_location": MapPin,
	"aadhaar_verification": ShieldCheck
};
function SurveyDetail() {
	const { id } = useSearch({ from: "/_app/surveys/detail" });
	const { data: listData } = useQuery({
		queryKey: ["surveys-for-detail-fallback"],
		queryFn: () => fetchSurveys({ per_page: 1 }),
		enabled: !id,
		staleTime: 6e4
	});
	const surveyId = id || listData?.data?.[0]?.id;
	const { data: survey, isLoading } = useQuery({
		queryKey: ["survey-detail", surveyId],
		queryFn: () => fetchSurvey(surveyId),
		enabled: !!surveyId,
		staleTime: 3e4
	});
	if (isLoading || !survey) return /* @__PURE__ */ jsx("div", {
		className: "p-8 space-y-4",
		children: Array.from({ length: 4 }).map((_, i) => /* @__PURE__ */ jsx(Skeleton, { className: "h-20 w-full" }, i))
	});
	const questions = survey.questions ?? [];
	const responseCount = survey.response_count ?? survey.total_responses ?? 0;
	const targetResponses = survey.target_responses ?? 100;
	const coverage = targetResponses > 0 ? Math.min(100, Math.round(responseCount / targetResponses * 100)) : 0;
	const lifecycle = [
		{
			stage: "Survey Created",
			date: String(survey.created_at ?? "").substring(0, 10),
			by: "Admin",
			status: "done"
		},
		{
			stage: "Published / Active",
			date: String(survey.start_date ?? "").substring(0, 10),
			by: "Admin",
			status: survey.status !== "draft" ? "done" : "pending"
		},
		{
			stage: "Responses Collecting",
			date: "Ongoing",
			by: "Field Volunteers",
			status: survey.status === "active" ? "active" : responseCount > 0 ? "done" : "pending"
		},
		{
			stage: "Survey Closed",
			date: String(survey.end_date ?? "—").substring(0, 10) || "—",
			by: "Admin",
			status: survey.status === "closed" ? "done" : "pending"
		}
	];
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(PageHeader, {
		title: String(survey.title ?? "Survey 360"),
		description: `${String(survey.survey_code ?? survey.id ?? "").substring(0, 12)} · ${String(survey.category ?? "General")} · started ${String(survey.start_date ?? "").substring(0, 10)}`,
		actions: /* @__PURE__ */ jsxs(Fragment, { children: [
			/* @__PURE__ */ jsx(Button, {
				size: "sm",
				variant: "outline",
				asChild: true,
				children: /* @__PURE__ */ jsxs(Link, {
					to: "/surveys/active",
					children: [/* @__PURE__ */ jsx(ArrowLeft, { className: "h-4 w-4" }), " Back"]
				})
			}),
			/* @__PURE__ */ jsxs(Button, {
				size: "sm",
				variant: "outline",
				className: "gap-1.5",
				children: [/* @__PURE__ */ jsx(Share2, { className: "h-4 w-4" }), " Share"]
			}),
			/* @__PURE__ */ jsxs(Button, {
				size: "sm",
				className: "gap-1.5",
				children: [/* @__PURE__ */ jsx(Download, { className: "h-4 w-4" }), " Report"]
			})
		] })
	}), /* @__PURE__ */ jsxs("div", {
		className: "space-y-4 p-4 md:p-8",
		children: [/* @__PURE__ */ jsx(Card, {
			className: "overflow-hidden",
			children: /* @__PURE__ */ jsx("div", {
				className: "bg-gradient-to-r from-primary/10 via-background to-background p-5",
				children: /* @__PURE__ */ jsxs("div", {
					className: "flex flex-wrap items-start justify-between gap-3",
					children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ jsx(Badge, {
							variant: "outline",
							children: String(survey.category ?? "General")
						}), /* @__PURE__ */ jsx(Badge, {
							variant: "secondary",
							className: survey.status === "active" ? "bg-success/10 text-success" : "bg-muted",
							children: String(survey.status ?? "draft")
						})]
					}), /* @__PURE__ */ jsxs("div", {
						className: "mt-3 flex flex-wrap gap-x-6 gap-y-2 text-xs text-muted-foreground",
						children: [
							/* @__PURE__ */ jsxs("span", {
								className: "inline-flex items-center gap-1",
								children: [
									/* @__PURE__ */ jsx(Calendar, { className: "h-3.5 w-3.5" }),
									" ",
									String(survey.start_date ?? "").substring(0, 10),
									" → ",
									String(survey.end_date ?? "ongoing").substring(0, 10)
								]
							}),
							/* @__PURE__ */ jsxs("span", {
								className: "inline-flex items-center gap-1",
								children: [
									/* @__PURE__ */ jsx(Users2, { className: "h-3.5 w-3.5" }),
									" ",
									questions.length,
									" questions"
								]
							}),
							/* @__PURE__ */ jsxs("span", {
								className: "inline-flex items-center gap-1",
								children: [/* @__PURE__ */ jsx(MapPin, { className: "h-3.5 w-3.5" }), " All villages"]
							})
						]
					})] }), /* @__PURE__ */ jsxs("div", {
						className: "grid grid-cols-3 gap-6 text-center",
						children: [
							/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
								className: "text-[10px] uppercase text-muted-foreground",
								children: "Responses"
							}), /* @__PURE__ */ jsx("div", {
								className: "font-display text-xl font-bold tabular-nums",
								children: responseCount.toLocaleString("en-IN")
							})] }),
							/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
								className: "text-[10px] uppercase text-muted-foreground",
								children: "Coverage"
							}), /* @__PURE__ */ jsxs("div", {
								className: "font-display text-xl font-bold text-primary tabular-nums",
								children: [coverage, "%"]
							})] }),
							/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
								className: "text-[10px] uppercase text-muted-foreground",
								children: "Target"
							}), /* @__PURE__ */ jsx("div", {
								className: "font-display text-xl font-bold tabular-nums",
								children: targetResponses.toLocaleString("en-IN")
							})] })
						]
					})]
				})
			})
		}), /* @__PURE__ */ jsxs(Tabs, {
			defaultValue: "overview",
			children: [
				/* @__PURE__ */ jsxs(TabsList, {
					className: "flex w-full flex-wrap justify-start",
					children: [
						/* @__PURE__ */ jsx(TabsTrigger, {
							value: "overview",
							children: "Overview"
						}),
						/* @__PURE__ */ jsx(TabsTrigger, {
							value: "questions",
							children: "Questions"
						}),
						/* @__PURE__ */ jsx(TabsTrigger, {
							value: "responses",
							children: "Responses"
						}),
						/* @__PURE__ */ jsx(TabsTrigger, {
							value: "coverage",
							children: "Coverage"
						}),
						/* @__PURE__ */ jsx(TabsTrigger, {
							value: "timeline",
							children: "Timeline"
						})
					]
				}),
				/* @__PURE__ */ jsxs(TabsContent, {
					value: "overview",
					className: "mt-4 grid gap-4 xl:grid-cols-3",
					children: [/* @__PURE__ */ jsxs(Card, {
						className: "p-5 xl:col-span-2",
						children: [
							/* @__PURE__ */ jsx("h4", {
								className: "font-display text-sm font-bold",
								children: "Survey Summary"
							}),
							/* @__PURE__ */ jsx("p", {
								className: "mt-2 text-sm text-muted-foreground",
								children: String(survey.description ?? "No description provided.")
							}),
							/* @__PURE__ */ jsx("div", {
								className: "mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4",
								children: [
									{
										l: "Target",
										v: targetResponses.toLocaleString("en-IN")
									},
									{
										l: "Collected",
										v: responseCount.toLocaleString("en-IN")
									},
									{
										l: "Pending",
										v: Math.max(0, targetResponses - responseCount).toLocaleString("en-IN")
									},
									{
										l: "Questions",
										v: questions.length
									}
								].map((s) => /* @__PURE__ */ jsxs("div", {
									className: "rounded-lg border border-border p-3",
									children: [/* @__PURE__ */ jsx("div", {
										className: "text-[10px] uppercase text-muted-foreground",
										children: s.l
									}), /* @__PURE__ */ jsx("div", {
										className: "font-display text-lg font-bold tabular-nums",
										children: s.v
									})]
								}, s.l))
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "mt-4",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "flex justify-between text-xs mb-1",
									children: [/* @__PURE__ */ jsx("span", {
										className: "text-muted-foreground",
										children: "Overall Progress"
									}), /* @__PURE__ */ jsxs("span", {
										className: "font-semibold",
										children: [coverage, "%"]
									})]
								}), /* @__PURE__ */ jsx(Progress, {
									value: coverage,
									className: "h-2"
								})]
							})
						]
					}), /* @__PURE__ */ jsxs(Card, {
						className: "p-5",
						children: [/* @__PURE__ */ jsx("h4", {
							className: "font-display text-sm font-bold",
							children: "Participation"
						}), /* @__PURE__ */ jsx("div", {
							className: "mt-4 space-y-3",
							children: [
								{
									l: "Response Rate",
									v: coverage,
									max: 100
								},
								{
									l: "Questions Covered",
									v: questions.length,
									max: Math.max(questions.length, 10)
								},
								{
									l: "Target Completion",
									v: Math.min(coverage, 100),
									max: 100
								}
							].map((s) => /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
								className: "flex justify-between text-xs",
								children: [/* @__PURE__ */ jsx("span", {
									className: "text-muted-foreground",
									children: s.l
								}), /* @__PURE__ */ jsxs("span", {
									className: "font-semibold tabular-nums",
									children: [s.v, s.max === 100 ? "%" : `/${s.max}`]
								})]
							}), /* @__PURE__ */ jsx(Progress, {
								value: s.v / s.max * 100,
								className: "mt-1 h-1.5"
							})] }, s.l))
						})]
					})]
				}),
				/* @__PURE__ */ jsx(TabsContent, {
					value: "questions",
					className: "mt-4",
					children: /* @__PURE__ */ jsxs(Card, {
						className: "p-5",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "mb-3 flex items-center justify-between",
							children: [/* @__PURE__ */ jsx("h4", {
								className: "font-display text-sm font-bold",
								children: "Survey Structure"
							}), /* @__PURE__ */ jsxs(Badge, {
								variant: "outline",
								children: [questions.length, " questions"]
							})]
						}), questions.length === 0 ? /* @__PURE__ */ jsx("p", {
							className: "text-sm text-muted-foreground py-8 text-center",
							children: "No questions defined for this survey."
						}) : /* @__PURE__ */ jsx("div", {
							className: "space-y-2",
							children: questions.map((q, i) => {
								return /* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-3 rounded-md border border-border p-3",
									children: [/* @__PURE__ */ jsx("div", {
										className: "grid h-8 w-8 place-items-center rounded-md bg-muted",
										children: /* @__PURE__ */ jsx(typeIcon[String(q.question_type ?? "short_text")] ?? Type, { className: "h-4 w-4" })
									}), /* @__PURE__ */ jsxs("div", {
										className: "flex-1",
										children: [/* @__PURE__ */ jsxs("div", {
											className: "flex items-center gap-2 text-[10px] uppercase tracking-wider text-muted-foreground",
											children: [
												"Q",
												Number(q.order_number ?? i + 1),
												" · ",
												String(q.question_type ?? "text"),
												q.is_required && /* @__PURE__ */ jsx(Badge, {
													variant: "secondary",
													className: "bg-destructive/10 text-destructive text-[9px]",
													children: "Required"
												})
											]
										}), /* @__PURE__ */ jsx("div", {
											className: "text-sm font-medium",
											children: String(q.question_text ?? q.label ?? "Question")
										})]
									})]
								}, String(q.id ?? i));
							})
						})]
					})
				}),
				/* @__PURE__ */ jsx(TabsContent, {
					value: "responses",
					className: "mt-4 grid gap-4 md:grid-cols-4",
					children: [
						{
							l: "Total Responses",
							v: responseCount,
							tone: "text-success"
						},
						{
							l: "Target",
							v: targetResponses,
							tone: "text-primary"
						},
						{
							l: "Coverage",
							v: `${coverage}%`,
							tone: "text-foreground"
						},
						{
							l: "Status",
							v: String(survey.status ?? "draft"),
							tone: "text-foreground"
						}
					].map((s) => /* @__PURE__ */ jsxs(Card, {
						className: "p-5",
						children: [/* @__PURE__ */ jsx("div", {
							className: "text-[11px] uppercase text-muted-foreground",
							children: s.l
						}), /* @__PURE__ */ jsx("div", {
							className: cn("mt-1 font-display text-2xl font-bold tabular-nums", s.tone),
							children: s.v
						})]
					}, s.l))
				}),
				/* @__PURE__ */ jsx(TabsContent, {
					value: "coverage",
					className: "mt-4",
					children: /* @__PURE__ */ jsxs(Card, {
						className: "p-5",
						children: [
							/* @__PURE__ */ jsxs("h4", {
								className: "font-display text-sm font-bold flex items-center gap-2",
								children: [/* @__PURE__ */ jsx(MapPin, { className: "h-4 w-4 text-primary" }), " Coverage Progress"]
							}),
							/* @__PURE__ */ jsx("div", {
								className: "mt-4 grid grid-cols-6 gap-1.5 sm:grid-cols-10",
								children: Array.from({ length: 60 }).map((_, i) => {
									return /* @__PURE__ */ jsx("div", { className: cn("aspect-square rounded-sm", i < Math.round(coverage / 100 * 60) ? "bg-success" : "bg-muted/50") }, i);
								})
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "mt-4 flex justify-between text-sm",
								children: [/* @__PURE__ */ jsx("span", {
									className: "text-muted-foreground",
									children: "Responses collected"
								}), /* @__PURE__ */ jsxs("span", {
									className: "font-semibold tabular-nums",
									children: [
										responseCount.toLocaleString("en-IN"),
										" / ",
										targetResponses.toLocaleString("en-IN")
									]
								})]
							}),
							/* @__PURE__ */ jsx(Progress, {
								value: coverage,
								className: "mt-2 h-2"
							})
						]
					})
				}),
				/* @__PURE__ */ jsx(TabsContent, {
					value: "timeline",
					className: "mt-4",
					children: /* @__PURE__ */ jsxs(Card, {
						className: "p-5",
						children: [/* @__PURE__ */ jsxs("h4", {
							className: "font-display text-sm font-bold flex items-center gap-2",
							children: [/* @__PURE__ */ jsx(ListChecks, { className: "h-4 w-4 text-primary" }), " Survey Lifecycle"]
						}), /* @__PURE__ */ jsx("div", {
							className: "relative mt-5 ml-3 border-l-2 border-dashed border-border pl-6",
							children: lifecycle.map((step, i) => {
								const Icon = step.status === "done" ? CheckCircle2 : step.status === "active" ? Clock : Circle;
								const tone = step.status === "done" ? "bg-success/10 text-success" : step.status === "active" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground";
								return /* @__PURE__ */ jsxs(motion.div, {
									initial: {
										opacity: 0,
										x: -8
									},
									animate: {
										opacity: 1,
										x: 0
									},
									transition: { delay: i * .06 },
									className: "relative pb-5",
									children: [
										/* @__PURE__ */ jsx("div", {
											className: cn("absolute -left-[34px] grid h-7 w-7 place-items-center rounded-full ring-2 ring-background", tone),
											children: /* @__PURE__ */ jsx(Icon, { className: "h-3.5 w-3.5" })
										}),
										/* @__PURE__ */ jsx("div", {
											className: "text-sm font-semibold",
											children: step.stage
										}),
										/* @__PURE__ */ jsxs("div", {
											className: "text-[11px] text-muted-foreground",
											children: [
												step.date,
												" · ",
												step.by
											]
										})
									]
								}, step.stage);
							})
						})]
					})
				})
			]
		})]
	})] });
}
//#endregion
export { SurveyDetail as component };

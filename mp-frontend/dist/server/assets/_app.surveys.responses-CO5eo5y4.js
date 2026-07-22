import { B as fetchSurveyStats, V as fetchSurveys, t as api } from "./api-CQX857SN.js";
import { t as Button } from "./button-Bq5vK6RO.js";
import { t as Card } from "./card-CzXpCsbD.js";
import { t as Badge } from "./badge-D1Dupn2y.js";
import { t as Skeleton } from "./skeleton-D9W9wFsj.js";
import { t as PageHeader } from "./PageHeader-B7gZRr0G.js";
import { t as Input } from "./input-B8Q2ztVi.js";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-Dg1urBTx.js";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-C0WYWEQX.js";
import { t as Progress } from "./progress-DOIEKRJF.js";
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useQuery } from "@tanstack/react-query";
import { Download, ExternalLink, Filter, Search } from "lucide-react";
import { motion } from "framer-motion";
//#region src/routes/_app.surveys.responses.tsx?tsr-split=component
function SurveyResponses() {
	const [q, setQ] = useState("");
	const [sv, setSv] = useState("all");
	const [page, setPage] = useState(1);
	const { data: statsData } = useQuery({
		queryKey: ["survey-stats-resp"],
		queryFn: fetchSurveyStats,
		staleTime: 6e4
	});
	const { data: surveysData } = useQuery({
		queryKey: ["surveys-for-filter"],
		queryFn: () => fetchSurveys({ per_page: 50 }),
		staleTime: 6e4
	});
	const surveys = surveysData?.data ?? [];
	const { data: respData, isLoading } = useQuery({
		queryKey: [
			"survey-responses-list",
			q,
			sv,
			page
		],
		queryFn: async () => {
			const params = {
				page,
				per_page: 20
			};
			if (sv !== "all") params.survey_id = sv;
			if (q) params.search = q;
			return (await api.get("/surveys/responses", { params })).data;
		},
		staleTime: 3e4
	});
	const responses = respData?.data ?? [];
	const meta = respData?.meta ?? {
		total: 0,
		current_page: 1,
		last_page: 1
	};
	const stats = [
		{
			l: "Total Responses",
			v: (statsData?.total_responses ?? 0).toLocaleString("en-IN")
		},
		{
			l: "This Month",
			v: (statsData?.this_month ?? 0).toLocaleString("en-IN")
		},
		{
			l: "Active Surveys",
			v: statsData?.active ?? 0
		},
		{
			l: "Total Surveys",
			v: statsData?.total ?? 0
		}
	];
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(PageHeader, {
		title: "Survey Response Center",
		description: "Drill into every individual response captured by field volunteers.",
		actions: /* @__PURE__ */ jsxs(Button, {
			variant: "outline",
			size: "sm",
			className: "gap-1.5",
			children: [/* @__PURE__ */ jsx(Download, { className: "h-4 w-4" }), " Export CSV"]
		})
	}), /* @__PURE__ */ jsxs("div", {
		className: "space-y-4 p-4 md:p-8",
		children: [
			/* @__PURE__ */ jsx("div", {
				className: "grid gap-3 md:grid-cols-4",
				children: stats.map((s, i) => /* @__PURE__ */ jsx(motion.div, {
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
						className: "p-4",
						children: [/* @__PURE__ */ jsx("div", {
							className: "text-[11px] uppercase tracking-wider text-muted-foreground",
							children: s.l
						}), /* @__PURE__ */ jsx("div", {
							className: "mt-1 font-display text-2xl font-bold tabular-nums",
							children: s.v
						})]
					})
				}, s.l))
			}),
			/* @__PURE__ */ jsx(Card, {
				className: "p-4",
				children: /* @__PURE__ */ jsxs("div", {
					className: "flex flex-wrap items-center gap-2",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "relative min-w-[240px] flex-1",
						children: [/* @__PURE__ */ jsx(Search, { className: "absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ jsx(Input, {
							value: q,
							onChange: (e) => {
								setQ(e.target.value);
								setPage(1);
							},
							placeholder: "Search citizen, village, ID",
							className: "pl-8"
						})]
					}), /* @__PURE__ */ jsxs(Select, {
						value: sv,
						onValueChange: (v) => {
							setSv(v);
							setPage(1);
						},
						children: [/* @__PURE__ */ jsxs(SelectTrigger, {
							className: "w-[260px]",
							children: [/* @__PURE__ */ jsx(Filter, { className: "mr-1 h-3.5 w-3.5" }), /* @__PURE__ */ jsx(SelectValue, {})]
						}), /* @__PURE__ */ jsxs(SelectContent, { children: [/* @__PURE__ */ jsx(SelectItem, {
							value: "all",
							children: "All surveys"
						}), surveys.map((s) => /* @__PURE__ */ jsx(SelectItem, {
							value: String(s.id),
							children: String(s.title ?? "")
						}, String(s.id)))] })]
					})]
				})
			}),
			/* @__PURE__ */ jsxs(Card, {
				className: "overflow-hidden",
				children: [isLoading ? /* @__PURE__ */ jsx("div", {
					className: "space-y-2 p-4",
					children: Array.from({ length: 8 }).map((_, i) => /* @__PURE__ */ jsx(Skeleton, { className: "h-12 w-full" }, i))
				}) : responses.length === 0 ? /* @__PURE__ */ jsx("div", {
					className: "py-12 text-center text-sm text-muted-foreground",
					children: "No responses found. Responses will appear here as volunteers collect surveys."
				}) : /* @__PURE__ */ jsxs(Table, { children: [/* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
					/* @__PURE__ */ jsx(TableHead, { children: "Response ID" }),
					/* @__PURE__ */ jsx(TableHead, { children: "Survey" }),
					/* @__PURE__ */ jsx(TableHead, { children: "Village" }),
					/* @__PURE__ */ jsx(TableHead, { children: "Volunteer" }),
					/* @__PURE__ */ jsx(TableHead, { children: "Date" }),
					/* @__PURE__ */ jsx(TableHead, { children: "Completion" }),
					/* @__PURE__ */ jsx(TableHead, {})
				] }) }), /* @__PURE__ */ jsx(TableBody, { children: responses.map((r, i) => /* @__PURE__ */ jsxs(motion.tr, {
					initial: { opacity: 0 },
					animate: { opacity: 1 },
					transition: { delay: i * .02 },
					className: "border-b",
					children: [
						/* @__PURE__ */ jsx(TableCell, {
							className: "font-mono text-xs",
							children: String(r.id ?? "").substring(0, 8)
						}),
						/* @__PURE__ */ jsx(TableCell, {
							className: "max-w-[200px] truncate text-xs",
							children: String(r?.survey?.title ?? r.survey_id ?? "")
						}),
						/* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(Badge, {
							variant: "outline",
							className: "text-[10px]",
							children: String(r.village ?? "—")
						}) }),
						/* @__PURE__ */ jsx(TableCell, {
							className: "text-xs text-muted-foreground",
							children: String(r.volunteer_id ?? "—")
						}),
						/* @__PURE__ */ jsx(TableCell, {
							className: "text-xs text-muted-foreground",
							children: String(r.response_date ?? r.created_at ?? "").substring(0, 10)
						}),
						/* @__PURE__ */ jsx(TableCell, {
							className: "min-w-[140px]",
							children: /* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ jsx(Progress, {
									value: 100,
									className: "h-1.5 flex-1"
								}), /* @__PURE__ */ jsx("span", {
									className: "text-xs tabular-nums",
									children: "100%"
								})]
							})
						}),
						/* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(Button, {
							size: "sm",
							variant: "ghost",
							asChild: true,
							children: /* @__PURE__ */ jsx(Link, {
								to: "/surveys/detail",
								children: /* @__PURE__ */ jsx(ExternalLink, { className: "h-3.5 w-3.5" })
							})
						}) })
					]
				}, String(r.id))) })] }), /* @__PURE__ */ jsxs("div", {
					className: "flex items-center justify-between border-t border-border/70 px-4 py-3 text-xs text-muted-foreground",
					children: [/* @__PURE__ */ jsxs("span", { children: [
						"Showing ",
						responses.length,
						" of ",
						meta.total,
						" responses"
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
				})]
			})
		]
	})] });
}
//#endregion
export { SurveyResponses as component };

import { B as fetchSurveyStats, V as fetchSurveys } from "./api-CQX857SN.js";
import { t as cn } from "./utils-C_uf36nf.js";
import { t as Button } from "./button-Bq5vK6RO.js";
import { t as Card } from "./card-CzXpCsbD.js";
import { t as Badge } from "./badge-D1Dupn2y.js";
import { t as Skeleton } from "./skeleton-D9W9wFsj.js";
import { t as PageHeader } from "./PageHeader-B7gZRr0G.js";
import { Link } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, ClipboardList, FileEdit, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";
//#region src/routes/_app.surveys.dashboard.tsx?tsr-split=component
function SurveysDashboardPage() {
	const { data: stats } = useQuery({
		queryKey: ["survey-stats"],
		queryFn: fetchSurveyStats,
		staleTime: 6e4
	});
	const { data: surveysData, isLoading } = useQuery({
		queryKey: ["surveys-list"],
		queryFn: () => fetchSurveys({ per_page: 10 }),
		staleTime: 3e4
	});
	const surveys = surveysData?.data ?? [];
	const statusTone = {
		active: "bg-success/10 text-success",
		draft: "bg-muted text-muted-foreground",
		closed: "bg-warning/15 text-warning",
		archived: "bg-muted text-muted-foreground"
	};
	const kpis = [
		{
			label: "Total Surveys",
			value: stats?.total ?? 0,
			icon: ClipboardList,
			tone: "bg-primary/10 text-primary"
		},
		{
			label: "Active",
			value: stats?.active ?? 0,
			icon: CheckCircle2,
			tone: "bg-success/10 text-success"
		},
		{
			label: "Draft",
			value: stats?.draft ?? 0,
			icon: FileEdit,
			tone: "bg-muted text-muted-foreground"
		},
		{
			label: "Total Responses",
			value: stats?.total_responses ?? 0,
			icon: MessageSquare,
			tone: "bg-info/10 text-info"
		}
	];
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(PageHeader, {
		title: "Survey Command Center",
		description: "Field survey campaigns, responses and insights"
	}), /* @__PURE__ */ jsxs("div", {
		className: "space-y-6 p-4 md:p-8",
		children: [/* @__PURE__ */ jsx("div", {
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
							children: k.value.toLocaleString()
						})
					]
				})
			}, k.label))
		}), /* @__PURE__ */ jsxs(Card, {
			className: "overflow-hidden",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "flex items-center justify-between border-b border-border/70 bg-muted/30 p-4",
				children: [/* @__PURE__ */ jsx("h3", {
					className: "font-semibold",
					children: "All Surveys"
				}), /* @__PURE__ */ jsx(Button, {
					variant: "ghost",
					size: "sm",
					asChild: true,
					children: /* @__PURE__ */ jsx(Link, {
						to: "/surveys/active",
						children: "Active Surveys"
					})
				})]
			}), isLoading ? /* @__PURE__ */ jsx("div", {
				className: "space-y-2 p-4",
				children: Array.from({ length: 5 }).map((_, i) => /* @__PURE__ */ jsx(Skeleton, { className: "h-14 w-full" }, i))
			}) : /* @__PURE__ */ jsxs("div", {
				className: "divide-y divide-border/60",
				children: [surveys.map((s, i) => /* @__PURE__ */ jsxs(motion.div, {
					initial: { opacity: 0 },
					animate: { opacity: 1 },
					transition: { delay: i * .02 },
					className: "flex items-center gap-4 p-4 hover:bg-muted/30",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ jsx("div", {
								className: "text-sm font-semibold",
								children: String(s.title ?? "")
							}), /* @__PURE__ */ jsxs("div", {
								className: "text-xs text-muted-foreground",
								children: [
									String(s.category ?? "—"),
									" · ",
									String(s.total_responses ?? 0),
									" responses"
								]
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "text-right text-xs text-muted-foreground",
							children: [/* @__PURE__ */ jsx("div", { children: String(s.start_date ?? "—") }), /* @__PURE__ */ jsxs("div", { children: ["to ", String(s.end_date ?? "ongoing")] })]
						}),
						/* @__PURE__ */ jsx(Badge, {
							variant: "secondary",
							className: statusTone[String(s.status ?? "draft")] ?? "bg-muted",
							children: String(s.status ?? "draft")
						})
					]
				}, String(s.id))), surveys.length === 0 && /* @__PURE__ */ jsx("div", {
					className: "p-8 text-center text-sm text-muted-foreground",
					children: "No surveys found."
				})]
			})]
		})]
	})] });
}
//#endregion
export { SurveysDashboardPage as component };

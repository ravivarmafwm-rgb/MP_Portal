import { V as fetchSurveys } from "./api-CQX857SN.js";
import { t as cn } from "./utils-C_uf36nf.js";
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
import { Download, ExternalLink, Filter, Plus, Search, Users2 } from "lucide-react";
import { motion } from "framer-motion";
//#region src/routes/_app.surveys.active.tsx?tsr-split=component
var statusTone = {
	active: "bg-success/10 text-success border-success/30",
	closed: "bg-muted text-muted-foreground border-border",
	draft: "bg-warning/15 text-warning border-warning/30",
	archived: "bg-info/10 text-info border-info/30"
};
function ActiveSurveys() {
	const [q, setQ] = useState("");
	const [status, setStatus] = useState("all");
	const [page, setPage] = useState(1);
	const { data, isLoading } = useQuery({
		queryKey: [
			"surveys-active",
			q,
			status,
			page
		],
		queryFn: () => fetchSurveys({
			search: q,
			page,
			per_page: 20,
			...status !== "all" ? { status } : {}
		}),
		staleTime: 3e4
	});
	const surveys = data?.data ?? [];
	const meta = data?.meta ?? {
		total: 0,
		current_page: 1,
		last_page: 1
	};
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(PageHeader, {
		title: "Active Surveys Directory",
		description: `${meta.total} surveys — search, filter and drill into any survey.`,
		actions: /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsxs(Button, {
			variant: "outline",
			size: "sm",
			className: "gap-1.5",
			children: [/* @__PURE__ */ jsx(Download, { className: "h-4 w-4" }), " Export"]
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
		className: "space-y-4 p-4 md:p-8",
		children: [/* @__PURE__ */ jsx(Card, {
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
						placeholder: "Search by title",
						className: "pl-8"
					})]
				}), /* @__PURE__ */ jsxs(Select, {
					value: status,
					onValueChange: (v) => {
						setStatus(v);
						setPage(1);
					},
					children: [/* @__PURE__ */ jsxs(SelectTrigger, {
						className: "w-[160px]",
						children: [/* @__PURE__ */ jsx(Filter, { className: "mr-1 h-3.5 w-3.5" }), /* @__PURE__ */ jsx(SelectValue, {})]
					}), /* @__PURE__ */ jsxs(SelectContent, { children: [
						/* @__PURE__ */ jsx(SelectItem, {
							value: "all",
							children: "All status"
						}),
						/* @__PURE__ */ jsx(SelectItem, {
							value: "active",
							children: "Active"
						}),
						/* @__PURE__ */ jsx(SelectItem, {
							value: "draft",
							children: "Draft"
						}),
						/* @__PURE__ */ jsx(SelectItem, {
							value: "closed",
							children: "Closed"
						})
					] })]
				})]
			})
		}), /* @__PURE__ */ jsxs(Card, {
			className: "overflow-hidden",
			children: [isLoading ? /* @__PURE__ */ jsx("div", {
				className: "space-y-2 p-4",
				children: Array.from({ length: 8 }).map((_, i) => /* @__PURE__ */ jsx(Skeleton, { className: "h-12 w-full" }, i))
			}) : /* @__PURE__ */ jsxs(Table, { children: [/* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
				/* @__PURE__ */ jsx(TableHead, { children: "Survey Code" }),
				/* @__PURE__ */ jsx(TableHead, { children: "Title" }),
				/* @__PURE__ */ jsx(TableHead, { children: "Category" }),
				/* @__PURE__ */ jsx(TableHead, { children: "Start Date" }),
				/* @__PURE__ */ jsx(TableHead, {
					className: "text-right",
					children: "Responses"
				}),
				/* @__PURE__ */ jsx(TableHead, { children: "Coverage" }),
				/* @__PURE__ */ jsx(TableHead, { children: "Status" }),
				/* @__PURE__ */ jsx(TableHead, {
					className: "text-right",
					children: "Volunteers"
				}),
				/* @__PURE__ */ jsx(TableHead, {})
			] }) }), /* @__PURE__ */ jsxs(TableBody, { children: [surveys.map((s, i) => /* @__PURE__ */ jsxs(motion.tr, {
				initial: { opacity: 0 },
				animate: { opacity: 1 },
				transition: { delay: i * .02 },
				className: "border-b",
				children: [
					/* @__PURE__ */ jsx(TableCell, {
						className: "font-mono text-xs",
						children: String(s.survey_code ?? s.id ?? "")
					}),
					/* @__PURE__ */ jsx(TableCell, {
						className: "max-w-[260px] truncate font-medium",
						children: String(s.title ?? "")
					}),
					/* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(Badge, {
						variant: "outline",
						className: "text-[10px]",
						children: String(s.category ?? "General")
					}) }),
					/* @__PURE__ */ jsx(TableCell, {
						className: "text-xs text-muted-foreground",
						children: String(s.start_date ?? "").substring(0, 10)
					}),
					/* @__PURE__ */ jsx(TableCell, {
						className: "text-right tabular-nums",
						children: Number(s.total_responses ?? s.response_count ?? 0).toLocaleString("en-IN")
					}),
					/* @__PURE__ */ jsx(TableCell, {
						className: "min-w-[140px]",
						children: /* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ jsx(Progress, {
								value: Number(s.total_responses ?? 0) > 0 ? Math.min(100, Math.round(Number(s.total_responses ?? 0) / Math.max(1, Number(s.target_responses ?? 100)) * 100)) : 0,
								className: "h-1.5 flex-1"
							}), /* @__PURE__ */ jsxs("span", {
								className: "text-xs tabular-nums",
								children: [Number(s.total_responses ?? 0) > 0 ? Math.min(100, Math.round(Number(s.total_responses ?? 0) / Math.max(1, Number(s.target_responses ?? 100)) * 100)) : 0, "%"]
							})]
						})
					}),
					/* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(Badge, {
						variant: "outline",
						className: cn("text-[10px]", statusTone[String(s.status ?? "draft")]),
						children: String(s.status ?? "draft")
					}) }),
					/* @__PURE__ */ jsx(TableCell, {
						className: "text-right tabular-nums",
						children: /* @__PURE__ */ jsxs("span", {
							className: "inline-flex items-center gap-1",
							children: [/* @__PURE__ */ jsx(Users2, { className: "h-3 w-3 text-muted-foreground" }), "0"]
						})
					}),
					/* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(Button, {
						size: "sm",
						variant: "ghost",
						asChild: true,
						children: /* @__PURE__ */ jsx(Link, {
							to: "/surveys/detail",
							search: { id: String(s.id) },
							children: /* @__PURE__ */ jsx(ExternalLink, { className: "h-3.5 w-3.5" })
						})
					}) })
				]
			}, String(s.id))), surveys.length === 0 && /* @__PURE__ */ jsx(TableRow, { children: /* @__PURE__ */ jsx(TableCell, {
				colSpan: 9,
				className: "py-12 text-center text-sm text-muted-foreground",
				children: "No surveys found."
			}) })] })] }), /* @__PURE__ */ jsxs("div", {
				className: "flex items-center justify-between border-t border-border/70 px-4 py-3 text-xs text-muted-foreground",
				children: [/* @__PURE__ */ jsxs("span", { children: [
					"Showing ",
					surveys.length,
					" of ",
					meta.total
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
		})]
	})] });
}
//#endregion
export { ActiveSurveys as component };

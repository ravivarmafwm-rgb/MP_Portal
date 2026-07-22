import { L as fetchSchemeStats, R as fetchSchemes } from "./api-CQX857SN.js";
import { t as cn } from "./utils-C_uf36nf.js";
import { t as Button } from "./button-Bq5vK6RO.js";
import { t as Card } from "./card-CzXpCsbD.js";
import { t as Badge } from "./badge-D1Dupn2y.js";
import { t as Skeleton } from "./skeleton-D9W9wFsj.js";
import { t as PageHeader } from "./PageHeader-B7gZRr0G.js";
import { Link } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, Clock, FileBadge, Users, XCircle } from "lucide-react";
import { motion } from "framer-motion";
//#region src/routes/_app.schemes.dashboard.tsx?tsr-split=component
function SchemesDashboardPage() {
	const { data: stats } = useQuery({
		queryKey: ["scheme-stats"],
		queryFn: fetchSchemeStats,
		staleTime: 6e4
	});
	const { data: schemesData, isLoading } = useQuery({
		queryKey: ["schemes-list"],
		queryFn: () => fetchSchemes({
			active_only: "1",
			per_page: 10
		}),
		staleTime: 6e4
	});
	const schemes = schemesData?.data ?? [];
	const kpis = [
		{
			label: "Active Schemes",
			value: stats?.active_schemes ?? 0,
			icon: FileBadge,
			tone: "bg-primary/10 text-primary"
		},
		{
			label: "Total Applications",
			value: stats?.total_applications ?? 0,
			icon: Clock,
			tone: "bg-info/10 text-info"
		},
		{
			label: "Approved",
			value: stats?.approved ?? 0,
			icon: CheckCircle2,
			tone: "bg-success/10 text-success"
		},
		{
			label: "Beneficiaries",
			value: stats?.total_beneficiaries ?? 0,
			icon: Users,
			tone: "bg-warning/15 text-warning"
		}
	];
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(PageHeader, {
		title: "Scheme Command Center",
		description: "Welfare schemes, applications and beneficiary tracking"
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
								children: k.value.toLocaleString()
							})
						]
					})
				}, k.label))
			}),
			stats && /* @__PURE__ */ jsx("div", {
				className: "grid gap-4 sm:grid-cols-3",
				children: [
					{
						label: "Pending Review",
						value: stats.pending,
						tone: "text-warning",
						icon: Clock
					},
					{
						label: "Approved",
						value: stats.approved,
						tone: "text-success",
						icon: CheckCircle2
					},
					{
						label: "Rejected",
						value: stats.rejected,
						tone: "text-destructive",
						icon: XCircle
					}
				].map((s) => /* @__PURE__ */ jsxs(Card, {
					className: "p-4 flex items-center gap-4",
					children: [/* @__PURE__ */ jsx(s.icon, { className: cn("h-8 w-8", s.tone) }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
						className: cn("font-display text-2xl font-bold tabular-nums", s.tone),
						children: s.value ?? 0
					}), /* @__PURE__ */ jsx("div", {
						className: "text-xs text-muted-foreground",
						children: s.label
					})] })]
				}, s.label))
			}),
			/* @__PURE__ */ jsxs(Card, {
				className: "overflow-hidden",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-center justify-between border-b border-border/70 bg-muted/30 p-4",
					children: [/* @__PURE__ */ jsx("h3", {
						className: "font-semibold",
						children: "Active Schemes"
					}), /* @__PURE__ */ jsx(Button, {
						variant: "ghost",
						size: "sm",
						asChild: true,
						children: /* @__PURE__ */ jsx(Link, {
							to: "/schemes/scheme-catalog",
							children: "View All"
						})
					})]
				}), isLoading ? /* @__PURE__ */ jsx("div", {
					className: "space-y-2 p-4",
					children: Array.from({ length: 5 }).map((_, i) => /* @__PURE__ */ jsx(Skeleton, { className: "h-14 w-full" }, i))
				}) : /* @__PURE__ */ jsxs("div", {
					className: "divide-y divide-border/60",
					children: [schemes.map((s, i) => /* @__PURE__ */ jsxs(motion.div, {
						initial: { opacity: 0 },
						animate: { opacity: 1 },
						transition: { delay: i * .02 },
						className: "flex items-center gap-4 p-4 hover:bg-muted/30",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ jsx("div", {
								className: "text-sm font-semibold",
								children: String(s.name ?? "")
							}), /* @__PURE__ */ jsxs("div", {
								className: "text-xs text-muted-foreground",
								children: [
									String(s.category ?? "—"),
									" · Code: ",
									String(s.code ?? "—")
								]
							})]
						}), /* @__PURE__ */ jsx(Badge, {
							variant: "secondary",
							className: s.is_active ? "bg-success/10 text-success" : "bg-muted",
							children: s.is_active ? "Active" : "Inactive"
						})]
					}, String(s.id))), schemes.length === 0 && /* @__PURE__ */ jsx("div", {
						className: "p-8 text-center text-sm text-muted-foreground",
						children: "No schemes found."
					})]
				})]
			})
		]
	})] });
}
//#endregion
export { SchemesDashboardPage as component };

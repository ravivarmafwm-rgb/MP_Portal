import { N as fetchProjectStats, S as fetchGrievanceStats } from "./api-CQX857SN.js";
import { t as Button } from "./button-Bq5vK6RO.js";
import { t as RoleGuard } from "./RoleGuard-CJSqkr6i.js";
import { t as Card } from "./card-CzXpCsbD.js";
import { t as KpiCard } from "./KpiCard-CiWIW3zy.js";
import { t as Skeleton } from "./skeleton-D9W9wFsj.js";
import { t as PageHeader } from "./PageHeader-B7gZRr0G.js";
import { Link } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { useQuery } from "@tanstack/react-query";
import { HardHat, MessageSquareWarning } from "lucide-react";
//#region src/routes/_app.officer.tsx?tsr-split=component
function OfficerDashboardPage() {
	const { data: grievances, isLoading: gLoading } = useQuery({
		queryKey: ["grievance-stats"],
		queryFn: fetchGrievanceStats,
		refetchInterval: 6e4
	});
	const { data: projects, isLoading: pLoading } = useQuery({
		queryKey: ["project-stats"],
		queryFn: fetchProjectStats,
		refetchInterval: 6e4
	});
	return /* @__PURE__ */ jsxs(RoleGuard, {
		route: "/officer",
		children: [/* @__PURE__ */ jsx(PageHeader, {
			title: "Government Officer Dashboard",
			description: "Grievance and project oversight"
		}), /* @__PURE__ */ jsxs("div", {
			className: "space-y-6 p-4 md:p-8",
			children: [gLoading || pLoading ? /* @__PURE__ */ jsx("div", {
				className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
				children: Array.from({ length: 4 }).map((_, i) => /* @__PURE__ */ jsx(Skeleton, { className: "h-[112px] rounded-xl" }, i))
			}) : /* @__PURE__ */ jsxs("div", {
				className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
				children: [
					/* @__PURE__ */ jsx(KpiCard, {
						label: "Total Grievances",
						value: grievances?.total ?? 0,
						icon: MessageSquareWarning,
						tone: "destructive",
						index: 0
					}),
					/* @__PURE__ */ jsx(KpiCard, {
						label: "Pending",
						value: grievances?.pending ?? 0,
						icon: MessageSquareWarning,
						tone: "warning",
						index: 1
					}),
					/* @__PURE__ */ jsx(KpiCard, {
						label: "Resolved",
						value: grievances?.resolved ?? 0,
						icon: MessageSquareWarning,
						tone: "success",
						index: 2
					}),
					/* @__PURE__ */ jsx(KpiCard, {
						label: "Active Projects",
						value: projects?.in_progress ?? projects?.active ?? 0,
						icon: HardHat,
						tone: "info",
						index: 3
					})
				]
			}), /* @__PURE__ */ jsxs(Card, {
				className: "p-6",
				children: [/* @__PURE__ */ jsx("h3", {
					className: "font-bold mb-4",
					children: "Quick Actions"
				}), /* @__PURE__ */ jsxs("div", {
					className: "flex flex-wrap gap-2",
					children: [
						/* @__PURE__ */ jsx(Button, {
							asChild: true,
							variant: "outline",
							size: "sm",
							children: /* @__PURE__ */ jsx(Link, {
								to: "/grievances/list",
								children: "View Grievances"
							})
						}),
						/* @__PURE__ */ jsx(Button, {
							asChild: true,
							variant: "outline",
							size: "sm",
							children: /* @__PURE__ */ jsx(Link, {
								to: "/grievances/dashboard",
								children: "Grievance Center"
							})
						}),
						/* @__PURE__ */ jsx(Button, {
							asChild: true,
							variant: "outline",
							size: "sm",
							children: /* @__PURE__ */ jsx(Link, {
								to: "/projects/dashboard",
								children: "Projects"
							})
						})
					]
				})]
			})]
		})]
	});
}
//#endregion
export { OfficerDashboardPage as component };

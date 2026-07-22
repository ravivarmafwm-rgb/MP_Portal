import { L as fetchSchemeStats, S as fetchGrievanceStats } from "./api-CQX857SN.js";
import { t as Button } from "./button-Bq5vK6RO.js";
import { t as RoleGuard } from "./RoleGuard-CJSqkr6i.js";
import { t as Card } from "./card-CzXpCsbD.js";
import { t as PageHeader } from "./PageHeader-B7gZRr0G.js";
import { Link } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { useQuery } from "@tanstack/react-query";
import { FileBadge, MessageSquareWarning } from "lucide-react";
//#region src/routes/_app.citizen.tsx?tsr-split=component
function CitizenPortalPage() {
	const { data: schemes } = useQuery({
		queryKey: ["scheme-stats"],
		queryFn: fetchSchemeStats,
		refetchInterval: 12e4
	});
	const { data: grievances } = useQuery({
		queryKey: ["grievance-stats"],
		queryFn: fetchGrievanceStats,
		refetchInterval: 12e4
	});
	return /* @__PURE__ */ jsxs(RoleGuard, {
		route: "/citizen",
		children: [/* @__PURE__ */ jsx(PageHeader, {
			title: "Citizen Portal",
			description: "Access schemes, file grievances, and track your requests"
		}), /* @__PURE__ */ jsx("div", {
			className: "space-y-6 p-4 md:p-8",
			children: /* @__PURE__ */ jsxs("div", {
				className: "grid gap-4 sm:grid-cols-2",
				children: [/* @__PURE__ */ jsxs(Card, {
					className: "p-6",
					children: [
						/* @__PURE__ */ jsx(FileBadge, { className: "h-8 w-8 text-primary mb-3" }),
						/* @__PURE__ */ jsx("h3", {
							className: "font-bold",
							children: "Government Schemes"
						}),
						/* @__PURE__ */ jsxs("p", {
							className: "mt-1 text-sm text-muted-foreground",
							children: [schemes?.total ?? 0, " schemes available in your constituency"]
						}),
						/* @__PURE__ */ jsx(Button, {
							asChild: true,
							className: "mt-4",
							size: "sm",
							variant: "outline",
							children: /* @__PURE__ */ jsx(Link, {
								to: "/schemes/dashboard",
								children: "Browse Schemes"
							})
						})
					]
				}), /* @__PURE__ */ jsxs(Card, {
					className: "p-6",
					children: [
						/* @__PURE__ */ jsx(MessageSquareWarning, { className: "h-8 w-8 text-destructive mb-3" }),
						/* @__PURE__ */ jsx("h3", {
							className: "font-bold",
							children: "File a Grievance"
						}),
						/* @__PURE__ */ jsxs("p", {
							className: "mt-1 text-sm text-muted-foreground",
							children: [grievances?.resolved ?? 0, " grievances resolved this term"]
						}),
						/* @__PURE__ */ jsx(Button, {
							asChild: true,
							className: "mt-4",
							size: "sm",
							variant: "outline",
							children: /* @__PURE__ */ jsx(Link, {
								to: "/grievances/list",
								children: "File Complaint"
							})
						})
					]
				})]
			})
		})]
	});
}
//#endregion
export { CitizenPortalPage as component };

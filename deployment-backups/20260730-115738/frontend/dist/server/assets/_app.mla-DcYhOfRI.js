import { A as fetchMlaDashboardStats } from "./api-CQX857SN.js";
import { t as RoleGuard } from "./RoleGuard-CJSqkr6i.js";
import { t as Card } from "./card-CzXpCsbD.js";
import { t as KpiCard } from "./KpiCard-CiWIW3zy.js";
import { t as Badge } from "./badge-D1Dupn2y.js";
import { t as Skeleton } from "./skeleton-D9W9wFsj.js";
import { t as PageHeader } from "./PageHeader-B7gZRr0G.js";
import { jsx, jsxs } from "react/jsx-runtime";
import { useQuery } from "@tanstack/react-query";
import { Building2, HardHat, HeartHandshake, Landmark, MapPin, MessageSquareWarning, Users, Vote } from "lucide-react";
import { motion } from "framer-motion";
//#region src/routes/_app.mla.tsx?tsr-split=component
function MlaDashboardPage() {
	const { data: stats, isLoading } = useQuery({
		queryKey: ["mla-dashboard-stats"],
		queryFn: fetchMlaDashboardStats,
		staleTime: 3e4,
		refetchInterval: 6e4
	});
	const kpis = stats?.kpis ?? {};
	return /* @__PURE__ */ jsxs(RoleGuard, {
		route: "/mla",
		children: [/* @__PURE__ */ jsx(PageHeader, {
			title: "Assembly Constituency Dashboard",
			description: stats ? `${stats.assembly_name} · ${stats.constituency}` : "Your assigned assembly constituency"
		}), /* @__PURE__ */ jsxs("div", {
			className: "space-y-6 p-4 md:p-8",
			children: [
				/* @__PURE__ */ jsxs(motion.section, {
					initial: {
						opacity: 0,
						y: 6
					},
					animate: {
						opacity: 1,
						y: 0
					},
					className: "rounded-2xl border border-border/60 bg-gradient-to-br from-info/10 via-card to-primary/5 p-6",
					children: [
						/* @__PURE__ */ jsx("p", {
							className: "text-sm text-muted-foreground",
							children: stats?.date_label
						}),
						/* @__PURE__ */ jsxs("h1", {
							className: "mt-1 text-2xl font-bold",
							children: ["Good day, ", /* @__PURE__ */ jsx("span", {
								className: "text-primary",
								children: stats?.mla_name ?? "Hon. MLA"
							})]
						}),
						/* @__PURE__ */ jsxs("p", {
							className: "mt-1 text-sm text-muted-foreground",
							children: [
								"Assembly: ",
								/* @__PURE__ */ jsx("strong", { children: stats?.assembly_name ?? "—" }),
								" — scoped view only"
							]
						})
					]
				}),
				isLoading ? /* @__PURE__ */ jsx("div", {
					className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
					children: Array.from({ length: 8 }).map((_, i) => /* @__PURE__ */ jsx(Skeleton, { className: "h-[112px] rounded-xl" }, i))
				}) : /* @__PURE__ */ jsxs("div", {
					className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
					children: [
						/* @__PURE__ */ jsx(KpiCard, {
							label: "Mandals",
							value: kpis.mandals ?? 0,
							icon: Landmark,
							tone: "primary",
							index: 0
						}),
						/* @__PURE__ */ jsx(KpiCard, {
							label: "Villages",
							value: kpis.villages ?? 0,
							icon: MapPin,
							tone: "info",
							index: 1
						}),
						/* @__PURE__ */ jsx(KpiCard, {
							label: "Polling Booths",
							value: kpis.booths ?? 0,
							icon: Vote,
							tone: "warning",
							index: 2
						}),
						/* @__PURE__ */ jsx(KpiCard, {
							label: "Citizens",
							value: kpis.citizens ?? 0,
							icon: Users,
							tone: "success",
							index: 3
						}),
						/* @__PURE__ */ jsx(KpiCard, {
							label: "Beneficiaries",
							value: kpis.beneficiaries ?? 0,
							icon: Building2,
							tone: "primary",
							index: 4
						}),
						/* @__PURE__ */ jsx(KpiCard, {
							label: "Local Grievances",
							value: kpis.local_grievances ?? 0,
							icon: MessageSquareWarning,
							tone: "destructive",
							index: 5
						}),
						/* @__PURE__ */ jsx(KpiCard, {
							label: "Local Projects",
							value: kpis.local_projects ?? 0,
							icon: HardHat,
							tone: "info",
							index: 6
						}),
						/* @__PURE__ */ jsx(KpiCard, {
							label: "Volunteers",
							value: kpis.volunteers ?? 0,
							icon: HeartHandshake,
							tone: "success",
							index: 7
						})
					]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "grid gap-6 lg:grid-cols-2",
					children: [/* @__PURE__ */ jsxs(Card, {
						className: "p-6",
						children: [/* @__PURE__ */ jsx("h3", {
							className: "font-bold mb-4",
							children: "Mandals"
						}), /* @__PURE__ */ jsx("div", {
							className: "space-y-2",
							children: (stats?.mandals ?? []).map((m) => /* @__PURE__ */ jsxs("div", {
								className: "flex justify-between rounded-lg border p-3 text-sm",
								children: [/* @__PURE__ */ jsx("span", {
									className: "font-medium",
									children: m.name
								}), /* @__PURE__ */ jsxs(Badge, {
									variant: "secondary",
									children: [m.villages, " villages"]
								})]
							}, m.id))
						})]
					}), /* @__PURE__ */ jsxs(Card, {
						className: "p-6",
						children: [/* @__PURE__ */ jsx("h3", {
							className: "font-bold mb-4",
							children: "Volunteer Network"
						}), /* @__PURE__ */ jsx("div", {
							className: "space-y-2",
							children: (stats?.volunteer_network ?? []).map((v, i) => /* @__PURE__ */ jsxs("div", {
								className: "flex justify-between rounded-lg border p-3 text-sm",
								children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
									className: "font-medium",
									children: v.name
								}), /* @__PURE__ */ jsx("div", {
									className: "text-xs text-muted-foreground",
									children: v.village
								})] }), /* @__PURE__ */ jsxs(Badge, { children: [v.score, " pts"] })]
							}, i))
						})]
					})]
				})
			]
		})]
	});
}
//#endregion
export { MlaDashboardPage as component };

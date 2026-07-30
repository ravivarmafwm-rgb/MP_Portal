import { t as api } from "./api-CQX857SN.js";
import { t as cn } from "./utils-C_uf36nf.js";
import { t as Button } from "./button-Bq5vK6RO.js";
import { t as Card } from "./card-CzXpCsbD.js";
import { t as Badge } from "./badge-D1Dupn2y.js";
import { t as Skeleton } from "./skeleton-D9W9wFsj.js";
import { t as PageHeader } from "./PageHeader-B7gZRr0G.js";
import { t as Progress } from "./progress-DOIEKRJF.js";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useQuery } from "@tanstack/react-query";
import { Building2, ExternalLink, Mail, Phone } from "lucide-react";
import { motion } from "framer-motion";
//#region src/routes/_app.grievances.departments.tsx?tsr-split=component
function DepartmentsPage() {
	const { data: departments, isLoading } = useQuery({
		queryKey: ["departments-grievances"],
		queryFn: async () => {
			return (await api.get("/departments")).data;
		},
		staleTime: 6e4
	});
	const depts = departments ?? [];
	const mockPerf = (i) => ({
		assigned: 80 + i * 12,
		pending: 20 + i * 5,
		resolved: 60 + i * 7,
		slaCompliance: Math.max(60, 95 - i * 5),
		avgDays: 4 + i
	});
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(PageHeader, {
		title: "Department Management",
		description: "Performance scorecard across line departments — case load, SLA and resolution velocity."
	}), /* @__PURE__ */ jsx("div", {
		className: "space-y-6 p-4 md:p-8",
		children: isLoading ? /* @__PURE__ */ jsx("div", {
			className: "grid gap-4 md:grid-cols-2 xl:grid-cols-3",
			children: Array.from({ length: 6 }).map((_, i) => /* @__PURE__ */ jsx(Skeleton, { className: "h-52 rounded-xl" }, i))
		}) : /* @__PURE__ */ jsxs("div", {
			className: "grid gap-4 md:grid-cols-2 xl:grid-cols-3",
			children: [depts.map((d, i) => {
				const perf = mockPerf(i);
				const slaTone = perf.slaCompliance >= 85 ? "bg-success/10 text-success" : perf.slaCompliance >= 70 ? "bg-warning/15 text-warning" : "bg-destructive/10 text-destructive";
				return /* @__PURE__ */ jsx(motion.div, {
					initial: {
						opacity: 0,
						y: 10
					},
					animate: {
						opacity: 1,
						y: 0
					},
					transition: { delay: i * .05 },
					children: /* @__PURE__ */ jsxs(Card, {
						className: "overflow-hidden",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "bg-gradient-to-br from-primary/15 via-primary/5 to-transparent p-4",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "flex items-start justify-between",
									children: [/* @__PURE__ */ jsx("div", {
										className: "grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary",
										children: /* @__PURE__ */ jsx(Building2, { className: "h-5 w-5" })
									}), /* @__PURE__ */ jsxs(Badge, {
										variant: "secondary",
										className: cn("text-[10px]", slaTone),
										children: [
											"SLA ",
											perf.slaCompliance,
											"%"
										]
									})]
								}),
								/* @__PURE__ */ jsx("h3", {
									className: "mt-3 font-display text-base font-bold",
									children: String(d.name ?? "")
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "text-xs text-muted-foreground",
									children: [
										"Code: ",
										String(d.code ?? "—"),
										" · ",
										String(d.description ?? "Line department")
									]
								})
							]
						}), /* @__PURE__ */ jsxs("div", {
							className: "space-y-3 p-4",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "grid grid-cols-3 gap-2 text-center",
									children: [
										/* @__PURE__ */ jsx(Stat, {
											label: "Assigned",
											value: perf.assigned
										}),
										/* @__PURE__ */ jsx(Stat, {
											label: "Pending",
											value: perf.pending,
											tone: "text-warning"
										}),
										/* @__PURE__ */ jsx(Stat, {
											label: "Resolved",
											value: perf.resolved,
											tone: "text-success"
										})
									]
								}),
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
									className: "flex items-center justify-between text-xs",
									children: [/* @__PURE__ */ jsx("span", {
										className: "text-muted-foreground",
										children: "SLA Compliance"
									}), /* @__PURE__ */ jsxs("span", {
										className: "font-semibold tabular-nums",
										children: [perf.slaCompliance, "%"]
									})]
								}), /* @__PURE__ */ jsx(Progress, {
									value: perf.slaCompliance,
									className: "mt-1 h-1.5"
								})] }),
								/* @__PURE__ */ jsxs("div", {
									className: "flex items-center justify-between text-xs text-muted-foreground",
									children: [/* @__PURE__ */ jsx("span", { children: "Avg Resolution" }), /* @__PURE__ */ jsxs("span", {
										className: "font-semibold tabular-nums",
										children: [perf.avgDays, " days"]
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "flex gap-2 pt-2",
									children: [
										/* @__PURE__ */ jsxs(Button, {
											variant: "outline",
											size: "sm",
											className: "h-7 flex-1 gap-1",
											children: [/* @__PURE__ */ jsx(Phone, { className: "h-3 w-3" }), " Call"]
										}),
										/* @__PURE__ */ jsxs(Button, {
											variant: "outline",
											size: "sm",
											className: "h-7 flex-1 gap-1",
											children: [/* @__PURE__ */ jsx(Mail, { className: "h-3 w-3" }), " Email"]
										}),
										/* @__PURE__ */ jsxs(Button, {
											size: "sm",
											className: "h-7 gap-1",
											children: [/* @__PURE__ */ jsx(ExternalLink, { className: "h-3 w-3" }), " Open"]
										})
									]
								})
							]
						})]
					})
				}, String(d.id));
			}), depts.length === 0 && /* @__PURE__ */ jsx("div", {
				className: "col-span-3 py-12 text-center text-sm text-muted-foreground",
				children: "No departments found."
			})]
		})
	})] });
}
function Stat({ label, value, tone = "" }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "rounded-md border border-border/70 bg-muted/20 p-2",
		children: [/* @__PURE__ */ jsx("div", {
			className: cn("font-display text-base font-bold tabular-nums", tone),
			children: value
		}), /* @__PURE__ */ jsx("div", {
			className: "text-[10px] uppercase text-muted-foreground",
			children: label
		})]
	});
}
//#endregion
export { DepartmentsPage as component };

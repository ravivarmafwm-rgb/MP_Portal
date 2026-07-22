import { W as fetchVolunteerDashboardStats } from "./api-CQX857SN.js";
import { t as Button } from "./button-Bq5vK6RO.js";
import { t as RoleGuard } from "./RoleGuard-CJSqkr6i.js";
import { t as Card } from "./card-CzXpCsbD.js";
import { t as KpiCard } from "./KpiCard-CiWIW3zy.js";
import { t as Badge } from "./badge-D1Dupn2y.js";
import { t as Skeleton } from "./skeleton-D9W9wFsj.js";
import { t as PageHeader } from "./PageHeader-B7gZRr0G.js";
import { Link } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { useQuery } from "@tanstack/react-query";
import { Bell, Calendar, CheckCircle2, ClipboardList, MapPin, MessageSquareWarning, UserPlus, Users } from "lucide-react";
import { motion } from "framer-motion";
//#region src/routes/_app.volunteer.tsx?tsr-split=component
function VolunteerDashboardPage() {
	const { data: stats, isLoading } = useQuery({
		queryKey: ["volunteer-dashboard-stats"],
		queryFn: fetchVolunteerDashboardStats,
		staleTime: 3e4,
		refetchInterval: 6e4
	});
	const kpis = stats?.kpis ?? {};
	return /* @__PURE__ */ jsxs(RoleGuard, {
		route: "/volunteer",
		children: [/* @__PURE__ */ jsx(PageHeader, {
			title: "Volunteer Field Dashboard",
			description: stats?.assigned_village ? `Assigned: ${stats.assigned_village}, ${stats.assigned_mandal}` : "Your assigned field operations",
			actions: /* @__PURE__ */ jsx(Button, {
				size: "sm",
				asChild: true,
				children: /* @__PURE__ */ jsxs(Link, {
					to: "/citizens/create-profile",
					children: [/* @__PURE__ */ jsx(UserPlus, { className: "h-4 w-4 mr-1.5" }), " Enroll Citizen"]
				})
			})
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
					className: "rounded-2xl border border-border/60 bg-gradient-to-br from-success/10 via-card to-primary/5 p-6",
					children: [
						/* @__PURE__ */ jsx("p", {
							className: "text-sm text-muted-foreground",
							children: stats?.date_label
						}),
						/* @__PURE__ */ jsxs("h1", {
							className: "mt-1 text-2xl font-bold",
							children: ["Good day, ", /* @__PURE__ */ jsx("span", {
								className: "text-primary",
								children: stats?.volunteer_name ?? "Volunteer"
							})]
						}),
						stats?.volunteer_id && /* @__PURE__ */ jsxs("p", {
							className: "mt-1 text-sm text-muted-foreground",
							children: ["ID: ", stats.volunteer_id]
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
							label: "My Tasks",
							value: kpis.my_tasks ?? 0,
							icon: ClipboardList,
							tone: "warning",
							index: 0
						}),
						/* @__PURE__ */ jsx(KpiCard, {
							label: "My Citizens",
							value: kpis.assigned_citizens ?? 0,
							icon: Users,
							tone: "primary",
							index: 1
						}),
						/* @__PURE__ */ jsx(KpiCard, {
							label: "Registrations Today",
							value: kpis.registrations_today ?? 0,
							icon: UserPlus,
							tone: "success",
							index: 2
						}),
						/* @__PURE__ */ jsx(KpiCard, {
							label: "Complaints Today",
							value: kpis.complaints_today ?? 0,
							icon: MessageSquareWarning,
							tone: "destructive",
							index: 3
						}),
						/* @__PURE__ */ jsx(KpiCard, {
							label: "Village Citizens",
							value: kpis.village_citizens ?? 0,
							icon: MapPin,
							tone: "info",
							index: 4
						}),
						/* @__PURE__ */ jsx(KpiCard, {
							label: "Surveys Done",
							value: kpis.surveys_completed ?? 0,
							icon: CheckCircle2,
							tone: "success",
							index: 5
						}),
						/* @__PURE__ */ jsx(KpiCard, {
							label: "Attendance (Month)",
							value: kpis.attendance_this_month ?? 0,
							icon: Calendar,
							tone: "primary",
							index: 6
						}),
						/* @__PURE__ */ jsx(KpiCard, {
							label: "Notifications",
							value: kpis.unread_notifications ?? 0,
							icon: Bell,
							tone: "warning",
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
							children: "My Assigned Citizens"
						}), /* @__PURE__ */ jsx("div", {
							className: "space-y-2",
							children: (stats?.assigned_citizens ?? []).length === 0 ? /* @__PURE__ */ jsx("p", {
								className: "text-sm text-muted-foreground",
								children: "No citizens enrolled yet."
							}) : stats.assigned_citizens.map((c) => /* @__PURE__ */ jsxs("div", {
								className: "flex justify-between rounded-lg border p-3 text-sm",
								children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
									className: "font-medium",
									children: [
										c.first_name,
										" ",
										c.last_name
									]
								}), /* @__PURE__ */ jsx("div", {
									className: "text-xs text-muted-foreground",
									children: c.unique_id
								})] }), /* @__PURE__ */ jsx("span", {
									className: "text-xs text-muted-foreground",
									children: c.mobile_number ?? "—"
								})]
							}, c.id))
						})]
					}), /* @__PURE__ */ jsxs(Card, {
						className: "p-6",
						children: [/* @__PURE__ */ jsx("h3", {
							className: "font-bold mb-4",
							children: "Recent Complaints"
						}), /* @__PURE__ */ jsx("div", {
							className: "space-y-2",
							children: (stats?.recent_complaints ?? []).length === 0 ? /* @__PURE__ */ jsx("p", {
								className: "text-sm text-muted-foreground",
								children: "No complaints filed."
							}) : stats.recent_complaints.map((g) => /* @__PURE__ */ jsxs("div", {
								className: "flex justify-between rounded-lg border p-3 text-sm",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "min-w-0",
									children: [/* @__PURE__ */ jsx("div", {
										className: "font-medium truncate",
										children: g.subject
									}), /* @__PURE__ */ jsx("div", {
										className: "text-xs text-muted-foreground",
										children: g.grievance_number
									})]
								}), /* @__PURE__ */ jsx(Badge, {
									variant: "outline",
									children: g.status
								})]
							}, g.id))
						})]
					})]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "flex flex-wrap gap-2",
					children: [
						/* @__PURE__ */ jsx(Button, {
							asChild: true,
							variant: "outline",
							size: "sm",
							children: /* @__PURE__ */ jsx(Link, {
								to: "/citizens/create-profile",
								children: "Citizen Enrollment"
							})
						}),
						/* @__PURE__ */ jsx(Button, {
							asChild: true,
							variant: "outline",
							size: "sm",
							children: /* @__PURE__ */ jsx(Link, {
								to: "/grievances/list",
								children: "File Complaint"
							})
						}),
						/* @__PURE__ */ jsx(Button, {
							asChild: true,
							variant: "outline",
							size: "sm",
							children: /* @__PURE__ */ jsx(Link, {
								to: "/surveys/active",
								children: "Surveys"
							})
						}),
						/* @__PURE__ */ jsx(Button, {
							asChild: true,
							variant: "outline",
							size: "sm",
							children: /* @__PURE__ */ jsx(Link, {
								to: "/volunteers/attendance",
								children: "Attendance"
							})
						})
					]
				})
			]
		})]
	});
}
//#endregion
export { VolunteerDashboardPage as component };

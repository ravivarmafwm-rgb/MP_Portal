import { y as fetchEngagementAnalytics } from "./api-CQX857SN.js";
import { t as Card } from "./card-CzXpCsbD.js";
import { t as Skeleton } from "./skeleton-D9W9wFsj.js";
import { t as PageHeader } from "./PageHeader-B7gZRr0G.js";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle, MapPin, Star, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart as PieChart$1, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
//#region src/routes/_app.meetings.engagement-analytics.tsx?tsr-split=component
var COLORS = [
	"hsl(var(--primary))",
	"hsl(var(--info))",
	"hsl(var(--success))",
	"hsl(var(--warning))",
	"hsl(var(--destructive))"
];
function EngagementAnalyticsPage() {
	const { data, isLoading } = useQuery({
		queryKey: ["engagement-analytics"],
		queryFn: fetchEngagementAnalytics,
		staleTime: 6e4
	});
	const monthlyTrend = data?.monthly_trend ?? [];
	const byCategory = data?.by_category ?? [];
	const byVillage = data?.by_village ?? [];
	const byMandal = data?.by_mandal ?? [];
	const meetingAttendance = data?.meeting_attendance ?? [];
	const satisfaction = data?.satisfaction ?? [];
	const avgSatisfaction = data?.avg_satisfaction ?? 0;
	const followUpPending = data?.follow_up_pending ?? 0;
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(PageHeader, {
		title: "Engagement Analytics",
		description: "Deep insights into citizen appointments, public meetings and constituency outreach"
	}), /* @__PURE__ */ jsxs("div", {
		className: "space-y-6 p-4 md:p-8",
		children: [
			/* @__PURE__ */ jsx("div", {
				className: "grid gap-4 sm:grid-cols-3",
				children: [
					{
						label: "Avg Satisfaction",
						value: `${avgSatisfaction}/5`,
						icon: Star,
						tone: "bg-warning/15 text-warning",
						hint: "Based on completed appointments"
					},
					{
						label: "Follow-up Pending",
						value: followUpPending,
						icon: AlertCircle,
						tone: "bg-destructive/10 text-destructive",
						hint: "Require follow-up action"
					},
					{
						label: "Engaged Villages",
						value: byVillage.length,
						icon: MapPin,
						tone: "bg-success/10 text-success",
						hint: "Villages with appointments"
					}
				].map((s, i) => /* @__PURE__ */ jsx(motion.div, {
					initial: {
						opacity: 0,
						y: 8
					},
					animate: {
						opacity: 1,
						y: 0
					},
					transition: { delay: i * .05 },
					children: /* @__PURE__ */ jsx(Card, {
						className: "p-5",
						children: /* @__PURE__ */ jsxs("div", {
							className: "flex items-start justify-between",
							children: [/* @__PURE__ */ jsxs("div", { children: [
								/* @__PURE__ */ jsx("p", {
									className: "text-xs font-medium text-muted-foreground uppercase tracking-wide",
									children: s.label
								}),
								/* @__PURE__ */ jsx("p", {
									className: "mt-2 font-display text-3xl font-bold tabular-nums",
									children: s.value
								}),
								/* @__PURE__ */ jsx("p", {
									className: "mt-1 text-xs text-muted-foreground",
									children: s.hint
								})
							] }), /* @__PURE__ */ jsx("div", {
								className: `grid h-10 w-10 place-items-center rounded-xl ${s.tone}`,
								children: /* @__PURE__ */ jsx(s.icon, { className: "h-5 w-5" })
							})]
						})
					})
				}, s.label))
			}),
			/* @__PURE__ */ jsxs(Card, {
				className: "p-6",
				children: [/* @__PURE__ */ jsx("h3", {
					className: "text-h3 font-bold mb-4",
					children: "6-Month Engagement Trend"
				}), isLoading ? /* @__PURE__ */ jsx(Skeleton, { className: "h-56" }) : /* @__PURE__ */ jsx(ResponsiveContainer, {
					width: "100%",
					height: 220,
					children: /* @__PURE__ */ jsxs(LineChart, {
						data: monthlyTrend,
						children: [
							/* @__PURE__ */ jsx(CartesianGrid, {
								strokeDasharray: "3 3",
								stroke: "hsl(var(--border))"
							}),
							/* @__PURE__ */ jsx(XAxis, {
								dataKey: "month",
								tick: { fontSize: 11 }
							}),
							/* @__PURE__ */ jsx(YAxis, { tick: { fontSize: 11 } }),
							/* @__PURE__ */ jsx(Tooltip, { contentStyle: {
								fontSize: 12,
								borderRadius: 8
							} }),
							/* @__PURE__ */ jsx(Legend, {}),
							/* @__PURE__ */ jsx(Line, {
								type: "monotone",
								dataKey: "appointments",
								stroke: "hsl(var(--primary))",
								strokeWidth: 2,
								dot: false,
								name: "Appointments"
							}),
							/* @__PURE__ */ jsx(Line, {
								type: "monotone",
								dataKey: "completed",
								stroke: "hsl(var(--success))",
								strokeWidth: 2,
								dot: false,
								name: "Completed"
							}),
							/* @__PURE__ */ jsx(Line, {
								type: "monotone",
								dataKey: "public_meetings",
								stroke: "hsl(var(--info))",
								strokeWidth: 2,
								dot: false,
								name: "Public Meetings"
							})
						]
					})
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "grid gap-6 lg:grid-cols-2",
				children: [/* @__PURE__ */ jsxs(Card, {
					className: "p-6",
					children: [/* @__PURE__ */ jsx("h3", {
						className: "text-h3 font-bold mb-4",
						children: "Appointments by Category"
					}), isLoading ? /* @__PURE__ */ jsx(Skeleton, { className: "h-48" }) : /* @__PURE__ */ jsx(ResponsiveContainer, {
						width: "100%",
						height: 200,
						children: /* @__PURE__ */ jsxs(PieChart$1, { children: [/* @__PURE__ */ jsx(Pie, {
							data: byCategory,
							dataKey: "value",
							nameKey: "name",
							cx: "50%",
							cy: "50%",
							outerRadius: 75,
							label: ({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`,
							children: byCategory.map((_, i) => /* @__PURE__ */ jsx(Cell, { fill: COLORS[i % COLORS.length] }, i))
						}), /* @__PURE__ */ jsx(Tooltip, { contentStyle: {
							fontSize: 12,
							borderRadius: 8
						} })] })
					})]
				}), /* @__PURE__ */ jsxs(Card, {
					className: "p-6",
					children: [/* @__PURE__ */ jsx("h3", {
						className: "text-h3 font-bold mb-4",
						children: "Citizen Satisfaction Ratings"
					}), isLoading ? /* @__PURE__ */ jsx(Skeleton, { className: "h-48" }) : /* @__PURE__ */ jsx(ResponsiveContainer, {
						width: "100%",
						height: 200,
						children: /* @__PURE__ */ jsxs(BarChart, {
							data: satisfaction,
							children: [
								/* @__PURE__ */ jsx(CartesianGrid, {
									strokeDasharray: "3 3",
									stroke: "hsl(var(--border))"
								}),
								/* @__PURE__ */ jsx(XAxis, {
									dataKey: "rating",
									tick: { fontSize: 12 }
								}),
								/* @__PURE__ */ jsx(YAxis, { tick: { fontSize: 11 } }),
								/* @__PURE__ */ jsx(Tooltip, { contentStyle: {
									fontSize: 12,
									borderRadius: 8
								} }),
								/* @__PURE__ */ jsx(Bar, {
									dataKey: "count",
									fill: "hsl(var(--warning))",
									radius: [
										4,
										4,
										0,
										0
									],
									name: "Count"
								})
							]
						})
					})]
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "grid gap-6 lg:grid-cols-2",
				children: [/* @__PURE__ */ jsxs(Card, {
					className: "p-6",
					children: [/* @__PURE__ */ jsx("h3", {
						className: "text-h3 font-bold mb-4",
						children: "Appointments by Village"
					}), isLoading ? /* @__PURE__ */ jsx(Skeleton, { className: "h-52" }) : /* @__PURE__ */ jsx(ResponsiveContainer, {
						width: "100%",
						height: 220,
						children: /* @__PURE__ */ jsxs(BarChart, {
							data: byVillage,
							layout: "vertical",
							children: [
								/* @__PURE__ */ jsx(CartesianGrid, {
									strokeDasharray: "3 3",
									stroke: "hsl(var(--border))"
								}),
								/* @__PURE__ */ jsx(XAxis, {
									type: "number",
									tick: { fontSize: 11 }
								}),
								/* @__PURE__ */ jsx(YAxis, {
									dataKey: "village",
									type: "category",
									tick: { fontSize: 10 },
									width: 90
								}),
								/* @__PURE__ */ jsx(Tooltip, { contentStyle: {
									fontSize: 12,
									borderRadius: 8
								} }),
								/* @__PURE__ */ jsx(Bar, {
									dataKey: "count",
									fill: "hsl(var(--primary))",
									radius: [
										0,
										4,
										4,
										0
									]
								})
							]
						})
					})]
				}), /* @__PURE__ */ jsxs(Card, {
					className: "p-6",
					children: [/* @__PURE__ */ jsx("h3", {
						className: "text-h3 font-bold mb-4",
						children: "Appointments by Mandal"
					}), isLoading ? /* @__PURE__ */ jsx(Skeleton, { className: "h-52" }) : /* @__PURE__ */ jsx(ResponsiveContainer, {
						width: "100%",
						height: 220,
						children: /* @__PURE__ */ jsxs(BarChart, {
							data: byMandal,
							layout: "vertical",
							children: [
								/* @__PURE__ */ jsx(CartesianGrid, {
									strokeDasharray: "3 3",
									stroke: "hsl(var(--border))"
								}),
								/* @__PURE__ */ jsx(XAxis, {
									type: "number",
									tick: { fontSize: 11 }
								}),
								/* @__PURE__ */ jsx(YAxis, {
									dataKey: "mandal",
									type: "category",
									tick: { fontSize: 10 },
									width: 90
								}),
								/* @__PURE__ */ jsx(Tooltip, { contentStyle: {
									fontSize: 12,
									borderRadius: 8
								} }),
								/* @__PURE__ */ jsx(Bar, {
									dataKey: "count",
									fill: "hsl(var(--info))",
									radius: [
										0,
										4,
										4,
										0
									]
								})
							]
						})
					})]
				})]
			}),
			meetingAttendance.length > 0 && /* @__PURE__ */ jsxs(Card, {
				className: "p-6",
				children: [/* @__PURE__ */ jsx("h3", {
					className: "text-h3 font-bold mb-4",
					children: "Public Meeting Attendance"
				}), /* @__PURE__ */ jsx(ResponsiveContainer, {
					width: "100%",
					height: 220,
					children: /* @__PURE__ */ jsxs(BarChart, {
						data: meetingAttendance,
						children: [
							/* @__PURE__ */ jsx(CartesianGrid, {
								strokeDasharray: "3 3",
								stroke: "hsl(var(--border))"
							}),
							/* @__PURE__ */ jsx(XAxis, {
								dataKey: "date",
								tick: { fontSize: 11 }
							}),
							/* @__PURE__ */ jsx(YAxis, { tick: { fontSize: 11 } }),
							/* @__PURE__ */ jsx(Tooltip, { contentStyle: {
								fontSize: 12,
								borderRadius: 8
							} }),
							/* @__PURE__ */ jsx(Legend, {}),
							/* @__PURE__ */ jsx(Bar, {
								dataKey: "expected",
								fill: "hsl(var(--muted))",
								radius: [
									4,
									4,
									0,
									0
								],
								name: "Expected"
							}),
							/* @__PURE__ */ jsx(Bar, {
								dataKey: "actual",
								fill: "hsl(var(--success))",
								radius: [
									4,
									4,
									0,
									0
								],
								name: "Actual"
							})
						]
					})
				})]
			}),
			/* @__PURE__ */ jsxs(Card, {
				className: "p-6 border-2 border-dashed border-border/60",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-3 mb-4",
						children: [/* @__PURE__ */ jsx("div", {
							className: "grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary",
							children: /* @__PURE__ */ jsx(TrendingUp, { className: "h-4 w-4" })
						}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", {
							className: "font-semibold text-sm",
							children: "AI Engagement Assistant"
						}), /* @__PURE__ */ jsx("p", {
							className: "text-xs text-muted-foreground",
							children: "Coming soon — AI-powered constituency insights"
						})] })]
					}),
					/* @__PURE__ */ jsx("div", {
						className: "space-y-2",
						children: [
							"Which villages have not been visited in the last 90 days?",
							"Show citizens waiting more than 30 days for appointments.",
							"What are the top discussion topics from recent Janata Darbars?",
							"Which areas have the lowest engagement scores?"
						].map((q, i) => /* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2 rounded-lg bg-muted/40 px-3 py-2 text-xs text-muted-foreground cursor-not-allowed",
							children: [/* @__PURE__ */ jsx(TrendingUp, { className: "h-3 w-3 shrink-0 text-primary/50" }), q]
						}, i))
					}),
					/* @__PURE__ */ jsx("p", {
						className: "mt-3 text-xs text-muted-foreground",
						children: "AI features will be available in the next platform update."
					})
				]
			})
		]
	})] });
}
//#endregion
export { EngagementAnalyticsPage as component };

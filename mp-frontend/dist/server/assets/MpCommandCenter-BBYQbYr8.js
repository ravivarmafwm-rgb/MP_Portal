import { _ as fetchDashboardStats } from "./api-CQX857SN.js";
import { n as useAuth } from "./auth-B-xQo2jy.js";
import { t as cn } from "./utils-C_uf36nf.js";
import { t as Button } from "./button-Bq5vK6RO.js";
import { t as Card } from "./card-CzXpCsbD.js";
import { t as KpiCard } from "./KpiCard-CiWIW3zy.js";
import { t as EmptyState } from "./EmptyState-DOWaGSUW.js";
import { t as Badge } from "./badge-D1Dupn2y.js";
import { n as AvatarFallback, t as Avatar } from "./avatar-CiQwCJNR.js";
import { t as Skeleton } from "./skeleton-D9W9wFsj.js";
import * as React from "react";
import { Link } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useQuery } from "@tanstack/react-query";
import { Activity, AlertCircle, AlertOctagon, AlertTriangle, ArrowRight, ArrowUpRight, Award, Briefcase, Calendar, CalendarPlus, CalendarRange, CheckCircle2, ChevronRight, ClipboardList, Clock, FileBadge, FileText, Hammer, HardHat, HeartHandshake, HeartPulse, Home, IndianRupee, Layers, MapPin, MapPinned, Medal, Megaphone, MessageSquareWarning, MoreHorizontal, PiggyBank, ShieldAlert, Tractor, TrendingUp, Trophy, UserPlus, Users } from "lucide-react";
import { Slot } from "@radix-ui/react-slot";
import { motion } from "framer-motion";
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
//#region src/components/ui/breadcrumb.tsx
var Breadcrumb = React.forwardRef(({ ...props }, ref) => /* @__PURE__ */ jsx("nav", {
	ref,
	"aria-label": "breadcrumb",
	...props
}));
Breadcrumb.displayName = "Breadcrumb";
var BreadcrumbList = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx("ol", {
	ref,
	className: cn("flex flex-wrap items-center gap-1.5 break-words text-sm text-muted-foreground sm:gap-2.5", className),
	...props
}));
BreadcrumbList.displayName = "BreadcrumbList";
var BreadcrumbItem = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx("li", {
	ref,
	className: cn("inline-flex items-center gap-1.5", className),
	...props
}));
BreadcrumbItem.displayName = "BreadcrumbItem";
var BreadcrumbLink = React.forwardRef(({ asChild, className, ...props }, ref) => {
	return /* @__PURE__ */ jsx(asChild ? Slot : "a", {
		ref,
		className: cn("transition-colors hover:text-foreground", className),
		...props
	});
});
BreadcrumbLink.displayName = "BreadcrumbLink";
var BreadcrumbPage = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx("span", {
	ref,
	role: "link",
	"aria-disabled": "true",
	"aria-current": "page",
	className: cn("font-normal text-foreground", className),
	...props
}));
BreadcrumbPage.displayName = "BreadcrumbPage";
var BreadcrumbSeparator = ({ children, className, ...props }) => /* @__PURE__ */ jsx("li", {
	role: "presentation",
	"aria-hidden": "true",
	className: cn("[&>svg]:w-3.5 [&>svg]:h-3.5", className),
	...props,
	children: children ?? /* @__PURE__ */ jsx(ChevronRight, {})
});
BreadcrumbSeparator.displayName = "BreadcrumbSeparator";
var BreadcrumbEllipsis = ({ className, ...props }) => /* @__PURE__ */ jsxs("span", {
	role: "presentation",
	"aria-hidden": "true",
	className: cn("flex h-9 w-9 items-center justify-center", className),
	...props,
	children: [/* @__PURE__ */ jsx(MoreHorizontal, { className: "h-4 w-4" }), /* @__PURE__ */ jsx("span", {
		className: "sr-only",
		children: "More"
	})]
});
BreadcrumbEllipsis.displayName = "BreadcrumbElipssis";
//#endregion
//#region src/components/dashboard/HealthScore.tsx
function HealthScore({ score = 0, stats }) {
	const hs = stats?.health_score;
	const factors = hs ? [
		{
			label: "Project Completion",
			value: hs.project_completion ?? 0,
			tone: "text-info"
		},
		{
			label: "Grievance Resolution",
			value: hs.grievance_resolution ?? 0,
			tone: "text-success"
		},
		{
			label: "Scheme Reach",
			value: hs.scheme_reach ?? 0,
			tone: "text-primary"
		},
		{
			label: "Volunteer Activity",
			value: hs.volunteer_activity ?? 0,
			tone: "text-warning"
		}
	] : [];
	const label = score >= 75 ? "Healthy" : score >= 50 ? "Fair" : "Needs attention";
	const hasData = score > 0 || factors.some((f) => f.value > 0);
	return /* @__PURE__ */ jsxs(Card, {
		className: "relative overflow-hidden p-6 shadow-card",
		children: [/* @__PURE__ */ jsx("div", { className: "absolute inset-x-0 -top-24 h-48 bg-[radial-gradient(ellipse_at_top,oklch(0.65_0.16_235/0.18),transparent_70%)]" }), /* @__PURE__ */ jsxs("div", {
			className: "relative grid gap-6 sm:grid-cols-[1fr_auto] sm:items-center",
			children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
				className: "flex items-center gap-2 text-label",
				children: [/* @__PURE__ */ jsx(Activity, { className: "h-3.5 w-3.5 text-primary" }), "Constituency Health"]
			}), !hasData ? /* @__PURE__ */ jsx(EmptyState, {
				icon: Activity,
				title: "No health score data",
				description: "Health score will be calculated as data is submitted"
			}) : /* @__PURE__ */ jsxs(Fragment, { children: [
				/* @__PURE__ */ jsx("h3", {
					className: "mt-1 text-h2 font-bold",
					children: score >= 75 ? "Operating in good shape" : score >= 50 ? "Needs improvement" : "Requires immediate attention"
				}),
				/* @__PURE__ */ jsx("p", {
					className: "mt-1 max-w-md text-sm text-muted-foreground",
					children: "Composite index of grievance resolution, scheme reach, project pace and volunteer activity across the constituency."
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "mt-4 inline-flex items-center gap-2 rounded-full bg-success/10 px-3 py-1 text-xs font-semibold text-success",
					children: [/* @__PURE__ */ jsx(TrendingUp, { className: "h-3.5 w-3.5" }), " Live from PostgreSQL"]
				}),
				/* @__PURE__ */ jsx("div", {
					className: "mt-6 grid gap-3 sm:grid-cols-2",
					children: factors.map((f, i) => /* @__PURE__ */ jsxs(motion.div, {
						initial: {
							opacity: 0,
							x: -8
						},
						animate: {
							opacity: 1,
							x: 0
						},
						transition: {
							duration: .3,
							delay: .2 + i * .06
						},
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-center justify-between text-xs",
							children: [/* @__PURE__ */ jsx("span", {
								className: "font-medium",
								children: f.label
							}), /* @__PURE__ */ jsx("span", {
								className: "tabular-nums font-semibold " + f.tone,
								children: f.value
							})]
						}), /* @__PURE__ */ jsx("div", {
							className: "mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted",
							children: /* @__PURE__ */ jsx(motion.div, {
								initial: { width: 0 },
								animate: { width: `${f.value}%` },
								transition: {
									duration: .9,
									delay: .3 + i * .06,
									ease: "easeOut"
								},
								className: "h-full rounded-full bg-linear-to-r from-primary to-info"
							})
						})]
					}, f.label))
				})
			] })] }), hasData && /* @__PURE__ */ jsx("div", {
				className: "relative grid h-44 w-44 place-items-center justify-self-center sm:h-52 sm:w-52",
				children: /* @__PURE__ */ jsxs("div", {
					className: "absolute flex flex-col items-center",
					children: [
						/* @__PURE__ */ jsx("span", {
							className: "text-label",
							children: "Score"
						}),
						/* @__PURE__ */ jsx("span", {
							className: "font-display text-5xl font-bold tabular-nums",
							children: score
						}),
						/* @__PURE__ */ jsxs("span", {
							className: "flex items-center gap-1 text-xs text-success",
							children: [
								/* @__PURE__ */ jsx(CheckCircle2, { className: "h-3 w-3" }),
								" ",
								label
							]
						})
					]
				})
			})]
		})]
	});
}
//#endregion
//#region src/components/dashboard/GrievanceCenter.tsx
function GrievanceCenter({ grievanceData }) {
	const buckets = grievanceData?.buckets ?? [];
	const trend = grievanceData?.trend ?? [];
	const categories = grievanceData?.categories ?? [];
	const resolvedCount = buckets.find((b) => b.label === "Resolved")?.value ?? 0;
	const totalCount = buckets.reduce((s, b) => s + b.value, 0);
	const resolutionRate = totalCount > 0 ? Math.round(resolvedCount / totalCount * 100) : 0;
	const hasData = buckets.length > 0 || trend.length > 0 || categories.length > 0;
	return /* @__PURE__ */ jsxs(Card, {
		className: "overflow-hidden p-6 shadow-card",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "flex flex-wrap items-start justify-between gap-3",
			children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", {
				className: "text-h3 font-bold",
				children: "Grievance command center"
			}), /* @__PURE__ */ jsx("p", {
				className: "text-xs text-muted-foreground",
				children: "Live snapshot across all booths and mandals."
			})] }), hasData && /* @__PURE__ */ jsxs(Badge, {
				variant: "secondary",
				className: "gap-1 bg-success/10 text-success",
				children: [resolutionRate, "% resolution rate"]
			})]
		}), !hasData ? /* @__PURE__ */ jsx(EmptyState, {
			icon: MessageSquareWarning,
			title: "No grievance data",
			description: "Grievance data will appear here as they are submitted"
		}) : /* @__PURE__ */ jsx("div", {
			className: "mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4",
			children: buckets.map((b, i) => /* @__PURE__ */ jsxs(motion.div, {
				initial: {
					opacity: 0,
					y: 6
				},
				animate: {
					opacity: 1,
					y: 0
				},
				transition: {
					duration: .3,
					delay: i * .04
				},
				className: "rounded-lg border border-border/70 bg-muted/30 p-3",
				children: [/* @__PURE__ */ jsx("div", {
					className: "text-label",
					children: b.label
				}), /* @__PURE__ */ jsxs("div", {
					className: "mt-1 flex items-center justify-between",
					children: [/* @__PURE__ */ jsx("span", {
						className: "font-display text-2xl font-bold tabular-nums",
						children: b.value
					}), /* @__PURE__ */ jsx("span", { className: "h-2 w-2 rounded-full " + (b.tone?.split(" ")[0] ?? "bg-muted") })]
				})]
			}, b.label))
		})]
	});
}
//#endregion
//#region src/components/dashboard/ProjectMonitor.tsx
var statusTone = {
	"On track": "bg-success/10 text-success",
	"Delayed": "bg-warning/15 text-warning",
	"At risk": "bg-destructive/15 text-destructive",
	"Completing": "bg-info/10 text-info",
	"Completing soon": "bg-info/10 text-info"
};
function ProjectMonitor({ projects }) {
	const list = projects ?? [];
	return /* @__PURE__ */ jsxs(Card, {
		className: "p-6 shadow-card",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "mb-4 flex items-center justify-between",
			children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", {
				className: "text-h3 font-bold",
				children: "Project monitoring"
			}), /* @__PURE__ */ jsx("p", {
				className: "text-xs text-muted-foreground",
				children: "MPLADS & state schemes in execution"
			})] }), list.length > 0 && /* @__PURE__ */ jsx(Button, {
				variant: "ghost",
				size: "sm",
				className: "gap-1",
				asChild: true,
				children: /* @__PURE__ */ jsxs(Link, {
					to: "/projects/dashboard",
					children: ["All projects ", /* @__PURE__ */ jsx(ArrowRight, { className: "h-3.5 w-3.5" })]
				})
			})]
		}), list.length === 0 ? /* @__PURE__ */ jsx(EmptyState, {
			icon: HardHat,
			title: "No projects yet",
			description: "Project data will appear here as they are added"
		}) : /* @__PURE__ */ jsx("div", {
			className: "grid gap-3 md:grid-cols-2",
			children: list.slice(0, 4).map((p, i) => {
				const tone = statusTone[p.status] ?? "bg-muted text-muted-foreground";
				const delayed = p.status === "Delayed" || p.status === "At risk";
				return /* @__PURE__ */ jsxs(motion.div, {
					initial: {
						opacity: 0,
						y: 6
					},
					animate: {
						opacity: 1,
						y: 0
					},
					transition: {
						duration: .3,
						delay: i * .05
					},
					className: cn("group relative overflow-hidden rounded-xl border border-border/70 bg-card p-4 transition-all hover:shadow-elevated", delayed && "border-warning/40"),
					children: [
						delayed && /* @__PURE__ */ jsx("div", {
							className: "absolute right-3 top-3",
							children: /* @__PURE__ */ jsx(AlertTriangle, { className: "h-4 w-4 text-warning" })
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ jsx(Badge, {
								variant: "secondary",
								className: "rounded-full text-[10px] uppercase",
								children: p.category
							}), /* @__PURE__ */ jsx(Badge, {
								variant: "secondary",
								className: "rounded-full text-[10px] " + tone,
								children: p.status
							})]
						}),
						/* @__PURE__ */ jsx("h4", {
							className: "mt-2 truncate text-sm font-semibold",
							children: p.name
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "mt-1 flex items-center gap-3 text-xs text-muted-foreground",
							children: [/* @__PURE__ */ jsxs("span", {
								className: "inline-flex items-center gap-1",
								children: [/* @__PURE__ */ jsx(MapPin, { className: "h-3 w-3" }), p.location]
							}), /* @__PURE__ */ jsxs("span", {
								className: "inline-flex items-center gap-1",
								children: [/* @__PURE__ */ jsx(IndianRupee, { className: "h-3 w-3" }), p.budget]
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "mt-3 flex items-center justify-between text-xs",
							children: [/* @__PURE__ */ jsx("span", {
								className: "text-muted-foreground",
								children: "Progress"
							}), /* @__PURE__ */ jsxs("span", {
								className: "font-semibold tabular-nums",
								children: [p.progress, "%"]
							})]
						}),
						/* @__PURE__ */ jsx("div", {
							className: "mt-1 h-2 overflow-hidden rounded-full bg-muted",
							children: /* @__PURE__ */ jsx(motion.div, {
								initial: { width: 0 },
								animate: { width: `${p.progress}%` },
								transition: {
									duration: .9,
									delay: .15 + i * .05,
									ease: "easeOut"
								},
								className: cn("h-full rounded-full", delayed ? "bg-linear-to-r from-warning to-destructive" : "bg-linear-to-r from-primary to-info")
							})
						}),
						/* @__PURE__ */ jsxs("p", {
							className: "mt-2 text-[11px] text-muted-foreground",
							children: ["Expected · ", p.due]
						})
					]
				}, i);
			})
		})]
	});
}
//#endregion
//#region src/components/dashboard/SchemePerformance.tsx
var palette = [
	"var(--color-primary)",
	"var(--color-info)",
	"var(--color-success)",
	"var(--color-warning)",
	"var(--color-accent)"
];
function SchemePerformance({ schemes }) {
	const data = schemes?.length ? schemes : [];
	return /* @__PURE__ */ jsxs(Card, {
		className: "p-6 shadow-card",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "mb-2 flex items-center justify-between",
			children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", {
				className: "text-h3 font-bold",
				children: "Scheme performance"
			}), /* @__PURE__ */ jsx("p", {
				className: "text-xs text-muted-foreground",
				children: "Applications this quarter"
			})] }), /* @__PURE__ */ jsx("span", {
				className: "text-label",
				children: "Top 5"
			})]
		}), data.length === 0 ? /* @__PURE__ */ jsx("p", {
			className: "flex h-64 items-center justify-center text-sm text-muted-foreground",
			children: "No scheme data available"
		}) : /* @__PURE__ */ jsx("div", {
			className: "h-64 w-full",
			children: /* @__PURE__ */ jsx(ResponsiveContainer, {
				width: "100%",
				height: "100%",
				children: /* @__PURE__ */ jsxs(BarChart, {
					data,
					margin: {
						top: 10,
						right: 8,
						left: -10,
						bottom: 0
					},
					children: [
						/* @__PURE__ */ jsx(CartesianGrid, {
							stroke: "var(--color-border)",
							strokeDasharray: "3 3",
							vertical: false
						}),
						/* @__PURE__ */ jsx(XAxis, {
							dataKey: "name",
							stroke: "var(--color-muted-foreground)",
							fontSize: 11,
							tickLine: false,
							axisLine: false
						}),
						/* @__PURE__ */ jsx(YAxis, {
							stroke: "var(--color-muted-foreground)",
							fontSize: 11,
							tickLine: false,
							axisLine: false
						}),
						/* @__PURE__ */ jsx(Tooltip, {
							cursor: {
								fill: "var(--color-muted)",
								opacity: .4
							},
							contentStyle: {
								background: "var(--color-popover)",
								border: "1px solid var(--color-border)",
								borderRadius: 8,
								fontSize: 12
							}
						}),
						/* @__PURE__ */ jsx(Bar, {
							dataKey: "value",
							radius: [
								6,
								6,
								0,
								0
							],
							animationDuration: 900,
							children: data.map((_, i) => /* @__PURE__ */ jsx(Cell, { fill: palette[i % palette.length] }, i))
						})
					]
				})
			})
		})]
	});
}
//#endregion
//#region src/components/dashboard/VolunteerLeaderboard.tsx
var rankIcons = [
	Trophy,
	Medal,
	Award
];
var rankTones = [
	"bg-gradient-to-br from-amber-400 to-amber-600 text-white",
	"bg-gradient-to-br from-slate-300 to-slate-500 text-white",
	"bg-gradient-to-br from-orange-400 to-orange-600 text-white"
];
function VolunteerLeaderboard({ volunteers }) {
	const leaders = volunteers ?? [];
	return /* @__PURE__ */ jsxs(Card, {
		className: "p-6 shadow-card",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "mb-4",
			children: [/* @__PURE__ */ jsx("h3", {
				className: "text-h3 font-bold",
				children: "Volunteer leaderboard"
			}), /* @__PURE__ */ jsx("p", {
				className: "text-xs text-muted-foreground",
				children: "Top performers this week"
			})]
		}), leaders.length === 0 ? /* @__PURE__ */ jsx(EmptyState, {
			icon: Users,
			title: "No volunteer data",
			description: "Leaderboard will show up as volunteers submit data"
		}) : /* @__PURE__ */ jsx("div", {
			className: "space-y-2",
			children: leaders.slice(0, 5).map((v, i) => {
				const Icon = rankIcons[i];
				return /* @__PURE__ */ jsxs(motion.div, {
					initial: {
						opacity: 0,
						x: -8
					},
					animate: {
						opacity: 1,
						x: 0
					},
					transition: {
						duration: .3,
						delay: i * .05
					},
					className: "flex items-center gap-3 rounded-lg border border-border/60 bg-card p-3 transition-colors hover:bg-muted/40",
					children: [
						/* @__PURE__ */ jsx("div", {
							className: "grid w-6 place-items-center text-xs font-bold tabular-nums text-muted-foreground",
							children: i + 1
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "relative",
							children: [/* @__PURE__ */ jsx(Avatar, {
								className: "h-9 w-9",
								children: /* @__PURE__ */ jsx(AvatarFallback, {
									className: "text-xs",
									children: v.name.split(" ").map((p) => p[0]).slice(0, 2).join("")
								})
							}), Icon && /* @__PURE__ */ jsx("div", {
								className: cn("absolute -bottom-1 -right-1 grid h-4 w-4 place-items-center rounded-full ring-2 ring-card", rankTones[i]),
								children: /* @__PURE__ */ jsx(Icon, { className: "h-2.5 w-2.5" })
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ jsx("div", {
								className: "truncate text-sm font-semibold",
								children: v.name
							}), /* @__PURE__ */ jsx("div", {
								className: "text-[11px] text-muted-foreground",
								children: v.mandal
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "hidden text-right sm:block",
							children: [/* @__PURE__ */ jsx("div", {
								className: "text-[10px] text-muted-foreground",
								children: "Surveys · Regs"
							}), /* @__PURE__ */ jsxs("div", {
								className: "text-xs font-medium tabular-nums",
								children: [
									v.surveys,
									" · ",
									v.regs
								]
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "text-right",
							children: [/* @__PURE__ */ jsx("div", {
								className: "text-[10px] text-muted-foreground",
								children: "Points"
							}), /* @__PURE__ */ jsx("div", {
								className: "font-display text-sm font-bold tabular-nums text-primary",
								children: v.points
							})]
						})
					]
				}, i);
			})
		})]
	});
}
//#endregion
//#region src/components/dashboard/SurveyInsights.tsx
var icons = [
	Briefcase,
	Tractor,
	Home,
	HeartPulse
];
var colors = [
	"from-primary to-info",
	"from-success to-info",
	"from-warning to-primary",
	"from-destructive to-warning"
];
function SurveyInsights({ surveys }) {
	const list = surveys ?? [];
	return /* @__PURE__ */ jsxs(Card, {
		className: "p-6 shadow-card",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "mb-4",
			children: [/* @__PURE__ */ jsx("h3", {
				className: "text-h3 font-bold",
				children: "Survey insights"
			}), /* @__PURE__ */ jsx("p", {
				className: "text-xs text-muted-foreground",
				children: "Aggregated responses across ground campaigns"
			})]
		}), list.length === 0 ? /* @__PURE__ */ jsx(EmptyState, {
			icon: ClipboardList,
			title: "No survey data",
			description: "Survey insights will show up as responses are collected"
		}) : /* @__PURE__ */ jsx("div", {
			className: "grid gap-3 sm:grid-cols-2",
			children: list.slice(0, 4).map((s, i) => {
				const Icon = icons[i % icons.length];
				const color = colors[i % colors.length];
				return /* @__PURE__ */ jsxs(motion.div, {
					initial: {
						opacity: 0,
						y: 6
					},
					animate: {
						opacity: 1,
						y: 0
					},
					transition: {
						duration: .3,
						delay: i * .05
					},
					className: "group relative overflow-hidden rounded-xl border border-border/70 bg-card p-4 transition-all hover:shadow-elevated",
					children: [
						/* @__PURE__ */ jsx("div", { className: "absolute -right-10 -top-10 h-24 w-24 rounded-full bg-gradient-to-br opacity-20 blur-2xl " + color }),
						/* @__PURE__ */ jsxs("div", {
							className: "relative flex items-start justify-between",
							children: [/* @__PURE__ */ jsx("div", {
								className: "grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br text-white " + color,
								children: /* @__PURE__ */ jsx(Icon, { className: "h-4 w-4" })
							}), /* @__PURE__ */ jsxs("span", {
								className: "inline-flex items-center gap-0.5 rounded-md bg-success/10 px-1.5 py-0.5 text-[10px] font-semibold text-success",
								children: [/* @__PURE__ */ jsx(ArrowUpRight, { className: "h-3 w-3" }), s.delta ?? "+0%"]
							})]
						}),
						/* @__PURE__ */ jsx("h4", {
							className: "mt-3 text-sm font-semibold",
							children: s.title
						}),
						/* @__PURE__ */ jsx("div", {
							className: "mt-0.5 font-display text-2xl font-bold tabular-nums",
							children: (s.responses ?? 0).toLocaleString("en-IN")
						}),
						/* @__PURE__ */ jsx("p", {
							className: "mt-1 text-[11px] text-muted-foreground",
							children: s.insight ?? "Responses collected"
						})
					]
				}, i);
			})
		})]
	});
}
//#endregion
//#region src/components/dashboard/GeoInsights.tsx
var hotspots = [
	{
		top: "22%",
		left: "30%",
		label: "Madhapur",
		n: 42,
		tone: "bg-destructive"
	},
	{
		top: "44%",
		left: "58%",
		label: "Kondapur",
		n: 31,
		tone: "bg-warning"
	},
	{
		top: "60%",
		left: "22%",
		label: "Gachibowli",
		n: 18,
		tone: "bg-info"
	},
	{
		top: "30%",
		left: "72%",
		label: "Hi-Tec City",
		n: 26,
		tone: "bg-warning"
	},
	{
		top: "72%",
		left: "48%",
		label: "Sector 7",
		n: 12,
		tone: "bg-success"
	}
];
function GeoInsights() {
	return /* @__PURE__ */ jsxs(Card, {
		className: "overflow-hidden p-6 shadow-card",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "mb-4 flex items-center justify-between",
			children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", {
				className: "text-h3 font-bold",
				children: "Geographic insights"
			}), /* @__PURE__ */ jsx("p", {
				className: "text-xs text-muted-foreground",
				children: "Live activity by mandal & ward"
			})] }), /* @__PURE__ */ jsxs(Badge, {
				variant: "secondary",
				className: "gap-1",
				children: [/* @__PURE__ */ jsx(Layers, { className: "h-3 w-3" }), " Grievances · Projects · Beneficiaries"]
			})]
		}), /* @__PURE__ */ jsxs("div", {
			className: "relative aspect-[16/9] w-full overflow-hidden rounded-xl border border-border/70 bg-gradient-to-br from-muted/40 via-background to-muted/20",
			children: [
				/* @__PURE__ */ jsxs("svg", {
					className: "absolute inset-0 h-full w-full text-border",
					"aria-hidden": true,
					children: [/* @__PURE__ */ jsx("defs", { children: /* @__PURE__ */ jsx("pattern", {
						id: "grid",
						width: "32",
						height: "32",
						patternUnits: "userSpaceOnUse",
						children: /* @__PURE__ */ jsx("path", {
							d: "M 32 0 L 0 0 0 32",
							fill: "none",
							stroke: "currentColor",
							strokeWidth: "0.5"
						})
					}) }), /* @__PURE__ */ jsx("rect", {
						width: "100%",
						height: "100%",
						fill: "url(#grid)"
					})]
				}),
				/* @__PURE__ */ jsxs("svg", {
					className: "absolute inset-0 h-full w-full",
					viewBox: "0 0 400 225",
					preserveAspectRatio: "none",
					children: [/* @__PURE__ */ jsx("path", {
						d: "M40 60 Q120 30 200 80 T380 70 L370 180 Q260 200 180 170 T40 190 Z",
						fill: "oklch(0.65 0.16 235 / 0.10)",
						stroke: "oklch(0.65 0.16 235 / 0.4)",
						strokeWidth: "1"
					}), /* @__PURE__ */ jsx("path", {
						d: "M80 100 Q150 80 220 110 T340 110",
						fill: "none",
						stroke: "oklch(0.65 0.16 235 / 0.3)",
						strokeDasharray: "3 3"
					})]
				}),
				hotspots.map((h) => /* @__PURE__ */ jsxs("div", {
					className: "absolute -translate-x-1/2 -translate-y-1/2",
					style: {
						top: h.top,
						left: h.left
					},
					children: [/* @__PURE__ */ jsx("span", {
						className: "relative flex h-3 w-3 " + h.tone + " rounded-full",
						children: /* @__PURE__ */ jsx("span", { className: "absolute inline-flex h-full w-full animate-ping rounded-full opacity-60 " + h.tone })
					}), /* @__PURE__ */ jsxs("div", {
						className: "mt-1 whitespace-nowrap rounded-md bg-background/90 px-2 py-0.5 text-[10px] font-semibold shadow-sm backdrop-blur",
						children: [
							h.label,
							" · ",
							h.n
						]
					})]
				}, h.label)),
				/* @__PURE__ */ jsxs("div", {
					className: "absolute bottom-3 right-3 flex items-center gap-1 rounded-md bg-background/90 px-2 py-1 text-[10px] text-muted-foreground backdrop-blur",
					children: [/* @__PURE__ */ jsx(MapPin, { className: "h-3 w-3" }), " GIS preview · 47 villages"]
				})
			]
		})]
	});
}
//#endregion
//#region src/components/dashboard/UrgentPanel.tsx
var sevTone = {
	Critical: "bg-destructive/15 text-destructive border-destructive/30",
	High: "bg-warning/15 text-warning border-warning/30",
	Medium: "bg-info/15 text-info border-info/30",
	Low: "bg-muted text-muted-foreground border-border"
};
var sevIcons = {
	Critical: AlertOctagon,
	High: ShieldAlert,
	Medium: Clock,
	Low: AlertTriangle
};
function UrgentPanel({ urgent }) {
	const items = urgent ?? [];
	return /* @__PURE__ */ jsxs(Card, {
		className: "p-6 shadow-card",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "mb-4 flex items-center justify-between",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ jsx("div", {
					className: "grid h-9 w-9 place-items-center rounded-lg bg-destructive/10 text-destructive",
					children: /* @__PURE__ */ jsx(ShieldAlert, { className: "h-4 w-4" })
				}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", {
					className: "text-h3 font-bold",
					children: "Needs your attention"
				}), /* @__PURE__ */ jsx("p", {
					className: "text-xs text-muted-foreground",
					children: "Triaged by impact and SLA"
				})] })]
			}), items.length > 0 && /* @__PURE__ */ jsxs(Badge, {
				variant: "secondary",
				className: "bg-destructive/10 text-destructive",
				children: [items.length, " items"]
			})]
		}), items.length === 0 ? /* @__PURE__ */ jsx(EmptyState, {
			icon: AlertTriangle,
			title: "Nothing urgent",
			description: "You're all caught up!"
		}) : /* @__PURE__ */ jsx("div", {
			className: "space-y-2",
			children: items.map((it, i) => {
				const sev = it.severity || "Medium";
				const Icon = sevIcons[sev] ?? AlertTriangle;
				return /* @__PURE__ */ jsxs(motion.div, {
					initial: {
						opacity: 0,
						x: -6
					},
					animate: {
						opacity: 1,
						x: 0
					},
					transition: {
						duration: .3,
						delay: i * .05
					},
					className: "flex w-full items-start gap-3 rounded-lg border border-border/60 bg-card p-3 text-left transition-colors hover:bg-muted/40",
					children: [
						/* @__PURE__ */ jsx("div", {
							className: cn("grid h-8 w-8 shrink-0 place-items-center rounded-md border", sevTone[sev]),
							children: /* @__PURE__ */ jsx(Icon, { className: "h-4 w-4" })
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ jsx("p", {
								className: "truncate text-sm font-semibold",
								children: it.title
							}), /* @__PURE__ */ jsx("p", {
								className: "text-[11px] text-muted-foreground",
								children: it.meta
							})]
						}),
						/* @__PURE__ */ jsx(Badge, {
							variant: "secondary",
							className: cn("border shrink-0", sevTone[sev]),
							children: sev
						})
					]
				}, i);
			})
		})]
	});
}
//#endregion
//#region src/components/dashboard/UpcomingEvents.tsx
function UpcomingEvents({ events }) {
	const list = events ?? [];
	return /* @__PURE__ */ jsxs(Card, {
		className: "p-6 shadow-card",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "mb-4 flex items-center gap-2",
			children: [/* @__PURE__ */ jsx(Calendar, { className: "h-4 w-4 text-primary" }), /* @__PURE__ */ jsx("h3", {
				className: "text-h3 font-bold",
				children: "Upcoming events"
			})]
		}), list.length === 0 ? /* @__PURE__ */ jsx(EmptyState, {
			icon: Calendar,
			title: "No upcoming events",
			description: "Events will be shown here once scheduled"
		}) : /* @__PURE__ */ jsx("div", {
			className: "relative ml-3 space-y-3 border-l border-border/70 pl-4",
			children: list.map((e, i) => {
				const tone = e.tone ?? "bg-primary/10 text-primary";
				return /* @__PURE__ */ jsxs(motion.div, {
					initial: {
						opacity: 0,
						x: 8
					},
					animate: {
						opacity: 1,
						x: 0
					},
					transition: {
						duration: .3,
						delay: i * .05
					},
					className: "relative",
					children: [/* @__PURE__ */ jsx("div", { className: "absolute -left-[22px] top-1 grid h-3 w-3 place-items-center rounded-full bg-background ring-2 ring-primary" }), /* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-3 rounded-lg border border-border/60 bg-card p-3",
						children: [/* @__PURE__ */ jsx("div", {
							className: "grid h-12 w-12 shrink-0 place-items-center rounded-lg " + tone,
							children: /* @__PURE__ */ jsxs("div", {
								className: "text-center leading-none",
								children: [/* @__PURE__ */ jsx("div", {
									className: "text-[10px] uppercase",
									children: e.date
								}), /* @__PURE__ */ jsx("div", {
									className: "font-display text-lg font-bold",
									children: e.day
								})]
							})
						}), /* @__PURE__ */ jsxs("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ jsx("p", {
								className: "truncate text-sm font-semibold",
								children: e.title
							}), /* @__PURE__ */ jsxs("p", {
								className: "flex items-center gap-1 text-[11px] text-muted-foreground",
								children: [/* @__PURE__ */ jsx(MapPin, { className: "h-3 w-3" }), e.meta]
							})]
						})]
					})]
				}, i);
			})
		})]
	});
}
//#endregion
//#region src/components/dashboard/ActivityFeed.tsx
function ActivityFeed({ activity }) {
	const items = activity ?? [];
	return /* @__PURE__ */ jsxs(Card, {
		className: "p-6 shadow-card",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "mb-4 flex items-center justify-between",
			children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", {
				className: "text-h3 font-bold",
				children: "Recent activity"
			}), /* @__PURE__ */ jsx("p", {
				className: "text-xs text-muted-foreground",
				children: "Across booths, mandals & departments"
			})] }), items.length > 0 && /* @__PURE__ */ jsx(Button, {
				variant: "ghost",
				size: "sm",
				children: "View all"
			})]
		}), items.length === 0 ? /* @__PURE__ */ jsx(EmptyState, {
			icon: Activity,
			title: "No activity yet",
			description: "Activity will appear here as volunteers start submitting data"
		}) : /* @__PURE__ */ jsx("ol", {
			className: "space-y-3",
			children: items.slice(0, 8).map((a, i) => {
				const Icon = Activity;
				return /* @__PURE__ */ jsxs(motion.li, {
					initial: {
						opacity: 0,
						y: 4
					},
					animate: {
						opacity: 1,
						y: 0
					},
					transition: {
						duration: .3,
						delay: i * .04
					},
					className: "flex items-start gap-3",
					children: [/* @__PURE__ */ jsx("div", {
						className: "grid h-8 w-8 shrink-0 place-items-center rounded-md bg-primary/10 text-primary",
						children: /* @__PURE__ */ jsx(Icon, { className: "h-4 w-4" })
					}), /* @__PURE__ */ jsxs("div", {
						className: "min-w-0 flex-1 border-b border-border/60 pb-3",
						children: [/* @__PURE__ */ jsxs("p", {
							className: "text-sm",
							children: [
								/* @__PURE__ */ jsx("span", {
									className: "font-semibold",
									children: a.who
								}),
								" ",
								/* @__PURE__ */ jsxs("span", {
									className: "text-muted-foreground",
									children: ["— ", a.what]
								})
							]
						}), /* @__PURE__ */ jsx("p", {
							className: "text-[11px] text-muted-foreground",
							children: a.when
						})]
					})]
				}, i);
			})
		})]
	});
}
//#endregion
//#region src/components/dashboard/QuickActionsStrip.tsx
var actions = [
	{
		label: "Register Citizen",
		icon: UserPlus,
		tone: "from-primary to-info"
	},
	{
		label: "Add Grievance",
		icon: AlertCircle,
		tone: "from-warning to-destructive"
	},
	{
		label: "Launch Survey",
		icon: ClipboardList,
		tone: "from-success to-info"
	},
	{
		label: "Create Project",
		icon: Hammer,
		tone: "from-primary to-accent"
	},
	{
		label: "Schedule Meeting",
		icon: CalendarPlus,
		tone: "from-info to-primary"
	},
	{
		label: "Broadcast Message",
		icon: Megaphone,
		tone: "from-destructive to-warning"
	}
];
function QuickActionsStrip() {
	return /* @__PURE__ */ jsx(Card, {
		className: "p-4 shadow-card",
		children: /* @__PURE__ */ jsx("div", {
			className: "grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6",
			children: actions.map((a, i) => /* @__PURE__ */ jsxs(motion.button, {
				initial: {
					opacity: 0,
					y: 4
				},
				animate: {
					opacity: 1,
					y: 0
				},
				transition: {
					duration: .25,
					delay: i * .03
				},
				className: "group relative overflow-hidden rounded-lg border border-border/70 bg-card p-3 text-left transition-all hover:-translate-y-0.5 hover:shadow-elevated",
				children: [/* @__PURE__ */ jsx("div", {
					className: "mb-2 grid h-8 w-8 place-items-center rounded-md bg-gradient-to-br text-white " + a.tone,
					children: /* @__PURE__ */ jsx(a.icon, { className: "h-4 w-4" })
				}), /* @__PURE__ */ jsx("p", {
					className: "text-xs font-semibold",
					children: a.label
				})]
			}, a.label))
		})
	});
}
//#endregion
//#region src/components/dashboard/MpCommandCenter.tsx
function MpCommandCenter({ title = "Command Center" }) {
	const { user } = useAuth();
	const { data: stats, isLoading } = useQuery({
		queryKey: ["dashboard-stats"],
		queryFn: fetchDashboardStats,
		staleTime: 3e4,
		refetchInterval: 6e4
	});
	const kpis = stats?.kpis ?? {};
	const healthScore = stats?.health_score ?? {};
	const mpName = stats?.mp_name ?? user?.name ?? "Hon. MP";
	const constituencyName = stats?.constituency_name ?? "Constituency";
	const dateLabel = stats?.date_label ?? (/* @__PURE__ */ new Date()).toLocaleDateString("en-IN", {
		weekday: "long",
		day: "numeric",
		month: "long",
		year: "numeric"
	});
	return /* @__PURE__ */ jsxs("div", {
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
				transition: {
					duration: .4,
					ease: [
						.22,
						1,
						.36,
						1
					]
				},
				className: "relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-primary/10 via-card to-info/10 p-6 shadow-card sm:p-8",
				children: [
					/* @__PURE__ */ jsx("div", { className: "absolute -right-20 -top-20 h-56 w-56 rounded-full bg-primary/10 blur-3xl" }),
					/* @__PURE__ */ jsx("div", { className: "absolute -bottom-24 -left-10 h-56 w-56 rounded-full bg-info/10 blur-3xl" }),
					/* @__PURE__ */ jsxs("div", {
						className: "relative",
						children: [/* @__PURE__ */ jsx(Breadcrumb, { children: /* @__PURE__ */ jsxs(BreadcrumbList, { children: [
							/* @__PURE__ */ jsx(BreadcrumbItem, { children: /* @__PURE__ */ jsx(BreadcrumbLink, {
								href: "/",
								children: "Home"
							}) }),
							/* @__PURE__ */ jsx(BreadcrumbSeparator, {}),
							/* @__PURE__ */ jsx(BreadcrumbItem, { children: /* @__PURE__ */ jsx(BreadcrumbPage, { children: title }) })
						] }) }), /* @__PURE__ */ jsxs("div", {
							className: "mt-3 grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "min-w-0",
								children: [
									/* @__PURE__ */ jsx("p", {
										className: "text-label",
										children: dateLabel
									}),
									/* @__PURE__ */ jsxs("h1", {
										className: "mt-1 text-display-l",
										children: ["Good day, ", /* @__PURE__ */ jsx("span", {
											className: "text-primary",
											children: mpName
										})]
									}),
									/* @__PURE__ */ jsxs("p", {
										className: "mt-1 max-w-2xl text-body text-muted-foreground",
										children: [
											"Here's what is happening across the ",
											/* @__PURE__ */ jsx("strong", { children: constituencyName }),
											" constituency today — triaged, ranked and ready for your review."
										]
									})
								]
							}), /* @__PURE__ */ jsxs("div", {
								className: "flex flex-wrap gap-2",
								children: [/* @__PURE__ */ jsxs(Button, {
									variant: "outline",
									size: "sm",
									className: "gap-1.5",
									children: [/* @__PURE__ */ jsx(CalendarRange, { className: "h-4 w-4" }), " This week"]
								}), /* @__PURE__ */ jsxs(Button, {
									size: "sm",
									className: "gap-1.5",
									children: [/* @__PURE__ */ jsx(FileText, { className: "h-4 w-4" }), " Generate brief"]
								})]
							})]
						})]
					})
				]
			}),
			/* @__PURE__ */ jsx("section", { children: isLoading ? /* @__PURE__ */ jsx("div", {
				className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
				children: Array.from({ length: 8 }).map((_, i) => /* @__PURE__ */ jsx(Skeleton, { className: "h-[112px] rounded-xl" }, i))
			}) : /* @__PURE__ */ jsxs("div", {
				className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
				children: [
					/* @__PURE__ */ jsx(KpiCard, {
						label: "Total Citizens",
						value: kpis.total_citizens ?? 0,
						icon: Users,
						hint: "Registered records",
						tone: "primary",
						index: 0
					}),
					/* @__PURE__ */ jsx(KpiCard, {
						label: "Total Families",
						value: kpis.total_families ?? 0,
						icon: Home,
						hint: "Family units mapped",
						tone: "info",
						index: 1
					}),
					/* @__PURE__ */ jsx(KpiCard, {
						label: "Volunteers",
						value: kpis.volunteers ?? 0,
						icon: HeartHandshake,
						hint: "Active across mandals",
						tone: "success",
						index: 2
					}),
					/* @__PURE__ */ jsx(KpiCard, {
						label: "Villages",
						value: kpis.villages ?? 0,
						icon: MapPinned,
						hint: "Under direct coverage",
						tone: "warning",
						index: 3
					}),
					/* @__PURE__ */ jsx(KpiCard, {
						label: "Active Grievances",
						value: kpis.active_grievances ?? 0,
						icon: MessageSquareWarning,
						hint: "Awaiting resolution",
						tone: "destructive",
						index: 4
					}),
					/* @__PURE__ */ jsx(KpiCard, {
						label: "Active Projects",
						value: kpis.active_projects ?? 0,
						icon: HardHat,
						hint: "In execution",
						tone: "info",
						index: 5
					}),
					/* @__PURE__ */ jsx(KpiCard, {
						label: "Scheme Applications",
						value: kpis.scheme_applications ?? 0,
						icon: FileBadge,
						hint: "This quarter",
						tone: "primary",
						index: 6
					}),
					/* @__PURE__ */ jsx(KpiCard, {
						label: "Budget Utilization",
						value: kpis.budget_utilization ?? 0,
						suffix: "%",
						icon: PiggyBank,
						hint: kpis.budget_spent ? `₹${(kpis.budget_spent / 1e7).toFixed(1)} Cr spent` : "Budget data",
						tone: "success",
						index: 7
					})
				]
			}) }),
			/* @__PURE__ */ jsxs("section", {
				className: "grid gap-6 lg:grid-cols-[1.6fr_1fr]",
				children: [/* @__PURE__ */ jsx(HealthScore, {
					score: healthScore.score ?? 0,
					stats
				}), /* @__PURE__ */ jsx(UrgentPanel, { urgent: stats?.urgent })]
			}),
			/* @__PURE__ */ jsx("section", { children: /* @__PURE__ */ jsx(GrievanceCenter, { grievanceData: stats?.grievance_center }) }),
			/* @__PURE__ */ jsxs("section", {
				className: "grid gap-6 lg:grid-cols-[1.4fr_1fr]",
				children: [/* @__PURE__ */ jsx(ProjectMonitor, { projects: stats?.projects }), /* @__PURE__ */ jsx(SchemePerformance, { schemes: stats?.schemes })]
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "grid gap-6 lg:grid-cols-2",
				children: [/* @__PURE__ */ jsx(VolunteerLeaderboard, { volunteers: stats?.volunteers }), /* @__PURE__ */ jsx(SurveyInsights, { surveys: stats?.surveys })]
			}),
			/* @__PURE__ */ jsx("section", { children: /* @__PURE__ */ jsx(GeoInsights, {}) }),
			/* @__PURE__ */ jsxs("section", {
				className: "grid gap-6 lg:grid-cols-[1.4fr_1fr]",
				children: [/* @__PURE__ */ jsx(ActivityFeed, { activity: stats?.activity }), /* @__PURE__ */ jsx(UpcomingEvents, { events: stats?.events })]
			}),
			/* @__PURE__ */ jsx("section", { children: /* @__PURE__ */ jsx(QuickActionsStrip, {}) })
		]
	});
}
//#endregion
export { MpCommandCenter as t };

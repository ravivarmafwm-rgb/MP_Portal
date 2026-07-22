import { t as cn } from "./utils-C_uf36nf.js";
import { t as Button } from "./button-Bq5vK6RO.js";
import { t as Card } from "./card-CzXpCsbD.js";
import { t as Badge } from "./badge-D1Dupn2y.js";
import { n as AvatarFallback, t as Avatar } from "./avatar-CiQwCJNR.js";
import { t as PageHeader } from "./PageHeader-B7gZRr0G.js";
import { t as Input } from "./input-B8Q2ztVi.js";
import { _ as enrollmentKpis, g as enrolledCitizens } from "./live-data-6hUqpYkS.js";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-C0WYWEQX.js";
import { Link } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { Clock, Download, Eye, Filter, MapPin, Plus, Search, Trophy, UserCheck, Users } from "lucide-react";
import { motion } from "framer-motion";
//#region src/routes/_app.volunteers.enrolled-citizens.tsx?tsr-split=component
var kpis = [
	{
		l: "Total Enrolled",
		v: enrollmentKpis.total,
		icon: Users,
		tone: "bg-primary/10 text-primary"
	},
	{
		l: "Verified",
		v: enrollmentKpis.verified,
		icon: UserCheck,
		tone: "bg-success/10 text-success"
	},
	{
		l: "Pending Verification",
		v: enrollmentKpis.pending,
		icon: Clock,
		tone: "bg-warning/15 text-warning"
	},
	{
		l: "This Week",
		v: enrollmentKpis.thisWeek,
		icon: Plus,
		tone: "bg-info/10 text-info"
	},
	{
		l: "Top Volunteer",
		v: enrollmentKpis.topVolunteer,
		icon: Trophy,
		tone: "bg-accent text-accent-foreground"
	},
	{
		l: "Avg / Volunteer",
		v: enrollmentKpis.avgPerVolunteer,
		icon: Users,
		tone: "bg-muted text-muted-foreground"
	}
];
function statusBadge(s) {
	return {
		Verified: "bg-success/10 text-success",
		"Pending Verification": "bg-warning/15 text-warning",
		Rejected: "bg-destructive/10 text-destructive"
	}[s] ?? "bg-muted";
}
function EnrolledCitizensPage() {
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(PageHeader, {
		title: "Enrolled Citizens",
		description: "Citizens registered by volunteers in the field — verification status, scheme uptake, source attribution.",
		actions: /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsxs(Button, {
			variant: "outline",
			size: "sm",
			className: "gap-1.5",
			children: [/* @__PURE__ */ jsx(Download, { className: "h-4 w-4" }), " Export"]
		}), /* @__PURE__ */ jsx(Button, {
			asChild: true,
			size: "sm",
			className: "gap-1.5",
			children: /* @__PURE__ */ jsxs(Link, {
				to: "/citizens/create-profile",
				children: [/* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }), " Enroll Citizen"]
			})
		})] })
	}), /* @__PURE__ */ jsxs("div", {
		className: "space-y-6 p-4 md:p-8",
		children: [/* @__PURE__ */ jsx("div", {
			className: "grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6",
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
					className: "p-4",
					children: [
						/* @__PURE__ */ jsx("div", {
							className: cn("grid h-9 w-9 place-items-center rounded-lg", k.tone),
							children: /* @__PURE__ */ jsx(k.icon, { className: "h-4 w-4" })
						}),
						/* @__PURE__ */ jsx("div", {
							className: "mt-3 text-xs font-medium uppercase tracking-wider text-muted-foreground",
							children: k.l
						}),
						/* @__PURE__ */ jsx("div", {
							className: "mt-1 font-display text-xl font-bold tabular-nums",
							children: typeof k.v === "number" ? k.v.toLocaleString() : k.v
						})
					]
				})
			}, k.l))
		}), /* @__PURE__ */ jsxs(Card, {
			className: "overflow-hidden",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "flex flex-wrap items-center gap-2 border-b border-border/70 bg-muted/30 p-3",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "relative min-w-[220px] flex-1",
						children: [/* @__PURE__ */ jsx(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ jsx(Input, {
							placeholder: "Search by citizen name, volunteer, village…",
							className: "h-9 bg-background pl-9"
						})]
					}),
					/* @__PURE__ */ jsxs(Button, {
						variant: "outline",
						size: "sm",
						className: "gap-1.5",
						children: [/* @__PURE__ */ jsx(Filter, { className: "h-4 w-4" }), " Volunteer"]
					}),
					/* @__PURE__ */ jsxs(Button, {
						variant: "outline",
						size: "sm",
						className: "gap-1.5",
						children: [/* @__PURE__ */ jsx(Filter, { className: "h-4 w-4" }), " Status"]
					}),
					/* @__PURE__ */ jsxs(Button, {
						variant: "outline",
						size: "sm",
						className: "gap-1.5",
						children: [/* @__PURE__ */ jsx(Filter, { className: "h-4 w-4" }), " Mandal"]
					})
				]
			}), /* @__PURE__ */ jsx("div", {
				className: "overflow-x-auto",
				children: /* @__PURE__ */ jsxs(Table, { children: [/* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
					/* @__PURE__ */ jsx(TableHead, { children: "Citizen" }),
					/* @__PURE__ */ jsx(TableHead, { children: "ID" }),
					/* @__PURE__ */ jsx(TableHead, { children: "Age / Gender" }),
					/* @__PURE__ */ jsx(TableHead, { children: "Village" }),
					/* @__PURE__ */ jsx(TableHead, { children: "Enrolled By" }),
					/* @__PURE__ */ jsx(TableHead, { children: "Date" }),
					/* @__PURE__ */ jsx(TableHead, {
						className: "text-right",
						children: "Docs"
					}),
					/* @__PURE__ */ jsx(TableHead, {
						className: "text-right",
						children: "Schemes"
					}),
					/* @__PURE__ */ jsx(TableHead, { children: "Status" }),
					/* @__PURE__ */ jsx(TableHead, {
						className: "text-right",
						children: "Action"
					})
				] }) }), /* @__PURE__ */ jsx(TableBody, { children: enrolledCitizens.map((c, i) => /* @__PURE__ */ jsxs(motion.tr, {
					initial: { opacity: 0 },
					animate: { opacity: 1 },
					transition: { delay: i * .015 },
					className: "border-b hover:bg-muted/40",
					children: [
						/* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ jsx(Avatar, {
								className: "h-9 w-9",
								children: /* @__PURE__ */ jsx(AvatarFallback, {
									className: "text-xs",
									children: c.name.split(" ").map((p) => p[0]).slice(0, 2).join("")
								})
							}), /* @__PURE__ */ jsx("div", {
								className: "text-sm font-semibold",
								children: c.name
							})]
						}) }),
						/* @__PURE__ */ jsx(TableCell, {
							className: "font-mono text-xs",
							children: c.id
						}),
						/* @__PURE__ */ jsxs(TableCell, {
							className: "text-xs",
							children: [
								c.age,
								" · ",
								c.gender
							]
						}),
						/* @__PURE__ */ jsx(TableCell, {
							className: "text-sm",
							children: /* @__PURE__ */ jsxs("span", {
								className: "inline-flex items-center gap-1",
								children: [
									/* @__PURE__ */ jsx(MapPin, { className: "h-3 w-3 text-muted-foreground" }),
									" ",
									c.village
								]
							})
						}),
						/* @__PURE__ */ jsxs(TableCell, { children: [/* @__PURE__ */ jsx("div", {
							className: "text-sm font-medium",
							children: c.enrolledBy
						}), /* @__PURE__ */ jsx("div", {
							className: "font-mono text-[10px] text-muted-foreground",
							children: c.volunteerId
						})] }),
						/* @__PURE__ */ jsx(TableCell, {
							className: "text-xs tabular-nums",
							children: c.enrolledOn
						}),
						/* @__PURE__ */ jsx(TableCell, {
							className: "text-right text-xs tabular-nums",
							children: c.documents
						}),
						/* @__PURE__ */ jsx(TableCell, {
							className: "text-right text-xs tabular-nums",
							children: c.schemes
						}),
						/* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(Badge, {
							variant: "secondary",
							className: statusBadge(c.status),
							children: c.status
						}) }),
						/* @__PURE__ */ jsx(TableCell, {
							className: "text-right",
							children: /* @__PURE__ */ jsx(Link, {
								to: "/citizens/profile",
								children: /* @__PURE__ */ jsx(Button, {
									variant: "ghost",
									size: "icon",
									className: "h-7 w-7",
									children: /* @__PURE__ */ jsx(Eye, { className: "h-3.5 w-3.5" })
								})
							})
						})
					]
				}, c.id)) })] })
			})]
		})]
	})] });
}
//#endregion
export { EnrolledCitizensPage as component };

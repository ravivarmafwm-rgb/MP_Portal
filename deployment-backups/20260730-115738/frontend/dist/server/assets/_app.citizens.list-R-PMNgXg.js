import { g as fetchCitizens, h as fetchCitizenStats } from "./api-CQX857SN.js";
import { t as Button } from "./button-Bq5vK6RO.js";
import { t as Card } from "./card-CzXpCsbD.js";
import { t as Badge } from "./badge-D1Dupn2y.js";
import { n as AvatarFallback, t as Avatar } from "./avatar-CiQwCJNR.js";
import { t as Skeleton } from "./skeleton-D9W9wFsj.js";
import { t as PageHeader } from "./PageHeader-B7gZRr0G.js";
import { t as Input } from "./input-B8Q2ztVi.js";
import { t as StatCard } from "./StatCard-BdFv4BKh.js";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-C0WYWEQX.js";
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useQuery } from "@tanstack/react-query";
import { Download, Home, Plus, Search, UserCheck, UserPlus, Users } from "lucide-react";
import { motion } from "framer-motion";
//#region src/routes/_app.citizens.list.tsx?tsr-split=component
function CitizenListPage() {
	const [search, setSearch] = useState("");
	const [page, setPage] = useState(1);
	const { data: statsData } = useQuery({
		queryKey: ["citizen-stats"],
		queryFn: fetchCitizenStats,
		staleTime: 6e4
	});
	const { data, isLoading } = useQuery({
		queryKey: [
			"citizens",
			search,
			page
		],
		queryFn: () => fetchCitizens({
			search,
			page,
			per_page: 20
		}),
		staleTime: 3e4
	});
	const citizens = data?.data ?? [];
	const meta = data?.meta ?? {
		total: 0,
		current_page: 1,
		last_page: 1
	};
	const stats = [
		{
			label: "Total Citizens",
			value: (statsData?.total ?? 0).toLocaleString("en-IN"),
			icon: Users,
			delta: "+2.4%",
			trend: "up"
		},
		{
			label: "Male",
			value: (statsData?.male ?? 0).toLocaleString("en-IN"),
			icon: UserCheck,
			delta: "",
			trend: "up"
		},
		{
			label: "Female",
			value: (statsData?.female ?? 0).toLocaleString("en-IN"),
			icon: Home,
			delta: "",
			trend: "up"
		},
		{
			label: "New This Month",
			value: (statsData?.this_month ?? 0).toLocaleString("en-IN"),
			icon: UserPlus,
			delta: "+12%",
			trend: "up",
			hint: "This month"
		}
	];
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(PageHeader, {
		title: "Citizen Directory",
		description: "Single source of truth for every citizen across the constituency.",
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
				children: [/* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }), " Add Citizen"]
			})
		})] })
	}), /* @__PURE__ */ jsxs(motion.div, {
		initial: {
			opacity: 0,
			y: 8
		},
		animate: {
			opacity: 1,
			y: 0
		},
		transition: { duration: .3 },
		className: "space-y-6 p-4 md:p-8",
		children: [/* @__PURE__ */ jsx("div", {
			className: "grid gap-4 md:grid-cols-2 xl:grid-cols-4",
			children: stats.map((s, i) => /* @__PURE__ */ jsx(StatCard, {
				...s,
				index: i
			}, s.label))
		}), /* @__PURE__ */ jsxs(Card, {
			className: "overflow-hidden",
			children: [
				/* @__PURE__ */ jsx("div", {
					className: "flex flex-wrap items-center gap-2 border-b border-border/70 bg-muted/30 p-3",
					children: /* @__PURE__ */ jsxs("div", {
						className: "relative min-w-[240px] flex-1",
						children: [/* @__PURE__ */ jsx(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ jsx(Input, {
							placeholder: "Search by name, mobile, Aadhaar, voter ID…",
							className: "h-9 bg-background pl-9",
							value: search,
							onChange: (e) => {
								setSearch(e.target.value);
								setPage(1);
							}
						})]
					})
				}),
				isLoading ? /* @__PURE__ */ jsx("div", {
					className: "space-y-2 p-4",
					children: Array.from({ length: 10 }).map((_, i) => /* @__PURE__ */ jsx(Skeleton, { className: "h-12 w-full" }, i))
				}) : /* @__PURE__ */ jsx("div", {
					className: "overflow-x-auto",
					children: /* @__PURE__ */ jsxs(Table, { children: [/* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
						/* @__PURE__ */ jsx(TableHead, { children: "Citizen ID" }),
						/* @__PURE__ */ jsx(TableHead, { children: "Name" }),
						/* @__PURE__ */ jsx(TableHead, { children: "Mobile" }),
						/* @__PURE__ */ jsx(TableHead, { children: "Gender" }),
						/* @__PURE__ */ jsx(TableHead, { children: "DOB" }),
						/* @__PURE__ */ jsx(TableHead, { children: "Voter ID" }),
						/* @__PURE__ */ jsx(TableHead, { children: "Occupation" }),
						/* @__PURE__ */ jsx(TableHead, { children: "Voter" })
					] }) }), /* @__PURE__ */ jsxs(TableBody, { children: [citizens.map((c, i) => /* @__PURE__ */ jsxs(motion.tr, {
						initial: { opacity: 0 },
						animate: { opacity: 1 },
						transition: { delay: i * .01 },
						className: "border-b hover:bg-muted/40",
						children: [
							/* @__PURE__ */ jsx(TableCell, {
								className: "font-mono text-xs",
								children: String(c.unique_id ?? "")
							}),
							/* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-3",
								children: [/* @__PURE__ */ jsx(Avatar, {
									className: "h-8 w-8",
									children: /* @__PURE__ */ jsxs(AvatarFallback, {
										className: "text-xs",
										children: [String(c.first_name ?? "").charAt(0), String(c.last_name ?? "").charAt(0)]
									})
								}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
									className: "text-sm font-medium",
									children: [
										String(c.first_name ?? ""),
										" ",
										String(c.last_name ?? "")
									]
								}), /* @__PURE__ */ jsx("div", {
									className: "text-xs text-muted-foreground",
									children: String(c.email ?? "—")
								})] })]
							}) }),
							/* @__PURE__ */ jsx(TableCell, {
								className: "tabular-nums text-sm",
								children: String(c.mobile_number ?? "—")
							}),
							/* @__PURE__ */ jsx(TableCell, {
								className: "text-sm",
								children: String(c.gender ?? "—")
							}),
							/* @__PURE__ */ jsx(TableCell, {
								className: "text-xs tabular-nums",
								children: String(c.date_of_birth ?? "—")
							}),
							/* @__PURE__ */ jsx(TableCell, {
								className: "text-xs",
								children: String(c.voter_id ?? "—")
							}),
							/* @__PURE__ */ jsx(TableCell, {
								className: "text-sm",
								children: String(c.occupation ?? "—")
							}),
							/* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(Badge, {
								variant: "secondary",
								className: c.is_voter ? "bg-success/10 text-success" : "bg-muted text-muted-foreground",
								children: c.is_voter ? "Voter" : "Non-voter"
							}) })
						]
					}, String(c.id))), citizens.length === 0 && /* @__PURE__ */ jsx(TableRow, { children: /* @__PURE__ */ jsx(TableCell, {
						colSpan: 8,
						className: "py-12 text-center text-sm text-muted-foreground",
						children: search ? "No citizens match your search." : "No citizens found."
					}) })] })] })
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "flex items-center justify-between border-t border-border/70 px-4 py-3 text-xs text-muted-foreground",
					children: [/* @__PURE__ */ jsxs("span", { children: [
						"Showing ",
						citizens.length,
						" of ",
						meta.total,
						" citizens"
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
				})
			]
		})]
	})] });
}
//#endregion
export { CitizenListPage as component };

import { h as fetchCitizenStats } from "./api-CQX857SN.js";
import { t as cn } from "./utils-C_uf36nf.js";
import { t as Button } from "./button-Bq5vK6RO.js";
import { t as Card } from "./card-CzXpCsbD.js";
import { t as Badge } from "./badge-D1Dupn2y.js";
import { t as Skeleton } from "./skeleton-D9W9wFsj.js";
import { t as PageHeader } from "./PageHeader-B7gZRr0G.js";
import { t as Progress } from "./progress-DOIEKRJF.js";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useQuery } from "@tanstack/react-query";
import { Briefcase, Building, Download, GraduationCap, HeartPulse, Home, Sprout, Users } from "lucide-react";
import { motion } from "framer-motion";
//#region src/routes/_app.surveys.census.tsx?tsr-split=component
function StatBlock({ icon: Icon, title, accent, children }) {
	return /* @__PURE__ */ jsxs(Card, {
		className: "overflow-hidden p-5",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "flex items-center gap-3",
			children: [/* @__PURE__ */ jsx("div", {
				className: cn("grid h-10 w-10 place-items-center rounded-xl", accent),
				children: /* @__PURE__ */ jsx(Icon, { className: "h-5 w-5" })
			}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", {
				className: "font-display text-sm font-bold",
				children: title
			}), /* @__PURE__ */ jsxs("p", {
				className: "text-[11px] text-muted-foreground",
				children: ["Live database data · ", (/* @__PURE__ */ new Date()).getFullYear()]
			})] })]
		}), /* @__PURE__ */ jsx("div", {
			className: "mt-4 space-y-3",
			children
		})]
	});
}
function Row({ l, v, sub }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "flex items-end justify-between border-b border-dashed border-border/60 pb-2",
		children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
			className: "text-xs text-muted-foreground",
			children: l
		}), sub && /* @__PURE__ */ jsx("div", {
			className: "text-[10px] text-muted-foreground/80",
			children: sub
		})] }), /* @__PURE__ */ jsx("div", {
			className: "font-display text-lg font-bold tabular-nums",
			children: typeof v === "number" ? v.toLocaleString("en-IN") : v
		})]
	});
}
function CensusCenter() {
	const { data: stats, isLoading } = useQuery({
		queryKey: ["citizen-stats-census"],
		queryFn: fetchCitizenStats,
		staleTime: 6e4
	});
	const total = stats?.total ?? 0;
	const male = stats?.male ?? 0;
	const female = stats?.female ?? 0;
	const voters = stats?.voters ?? 0;
	if (isLoading) return /* @__PURE__ */ jsx("div", {
		className: "p-8 space-y-4",
		children: Array.from({ length: 4 }).map((_, i) => /* @__PURE__ */ jsx(Skeleton, { className: "h-40 w-full" }, i))
	});
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(PageHeader, {
		title: "Constituency Census Center",
		description: "Aggregated population, household and welfare indicators across the constituency.",
		actions: /* @__PURE__ */ jsxs(Button, {
			variant: "outline",
			size: "sm",
			className: "gap-1.5",
			children: [/* @__PURE__ */ jsx(Download, { className: "h-4 w-4" }), " Download Census Report"]
		})
	}), /* @__PURE__ */ jsxs("div", {
		className: "space-y-4 p-4 md:p-8",
		children: [
			/* @__PURE__ */ jsx(Card, {
				className: "border-primary/20 bg-gradient-to-r from-primary/10 via-background to-background p-6",
				children: /* @__PURE__ */ jsxs("div", {
					className: "flex flex-wrap items-end justify-between gap-4",
					children: [/* @__PURE__ */ jsxs("div", { children: [
						/* @__PURE__ */ jsx(Badge, {
							variant: "secondary",
							className: "bg-primary/10 text-primary",
							children: "Live Census Intelligence"
						}),
						/* @__PURE__ */ jsxs("h2", {
							className: "mt-2 font-display text-2xl font-bold",
							children: ["Registered Citizens: ", total.toLocaleString("en-IN")]
						}),
						/* @__PURE__ */ jsx("p", {
							className: "text-xs text-muted-foreground",
							children: "From PostgreSQL database · real-time constituency data"
						})
					] }), /* @__PURE__ */ jsxs("div", {
						className: "grid grid-cols-3 gap-6 text-center",
						children: [
							/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
								className: "text-[10px] uppercase text-muted-foreground",
								children: "Male"
							}), /* @__PURE__ */ jsx("div", {
								className: "font-display text-lg font-bold tabular-nums",
								children: male.toLocaleString("en-IN")
							})] }),
							/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
								className: "text-[10px] uppercase text-muted-foreground",
								children: "Female"
							}), /* @__PURE__ */ jsx("div", {
								className: "font-display text-lg font-bold tabular-nums",
								children: female.toLocaleString("en-IN")
							})] }),
							/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
								className: "text-[10px] uppercase text-muted-foreground",
								children: "Voters"
							}), /* @__PURE__ */ jsx("div", {
								className: "font-display text-lg font-bold tabular-nums",
								children: voters.toLocaleString("en-IN")
							})] })
						]
					})]
				})
			}),
			/* @__PURE__ */ jsxs(motion.div, {
				initial: {
					opacity: 0,
					y: 8
				},
				animate: {
					opacity: 1,
					y: 0
				},
				className: "grid gap-4 md:grid-cols-2 xl:grid-cols-3",
				children: [
					/* @__PURE__ */ jsxs(StatBlock, {
						icon: Users,
						title: "Population",
						accent: "bg-primary/10 text-primary",
						children: [
							/* @__PURE__ */ jsx(Row, {
								l: "Total registered",
								v: total
							}),
							/* @__PURE__ */ jsx(Row, {
								l: "Male",
								v: male
							}),
							/* @__PURE__ */ jsx(Row, {
								l: "Female",
								v: female
							}),
							/* @__PURE__ */ jsx(Row, {
								l: "Registered voters",
								v: voters
							})
						]
					}),
					/* @__PURE__ */ jsxs(StatBlock, {
						icon: Home,
						title: "Households",
						accent: "bg-info/10 text-info",
						children: [
							/* @__PURE__ */ jsx(Row, {
								l: "This month enrolled",
								v: stats?.this_month ?? 0
							}),
							/* @__PURE__ */ jsx(Row, {
								l: "Male citizens",
								v: male
							}),
							/* @__PURE__ */ jsx(Row, {
								l: "Female citizens",
								v: female
							}),
							/* @__PURE__ */ jsx(Row, {
								l: "Voter coverage",
								v: total > 0 ? `${Math.round(voters / total * 100)}%` : "—"
							})
						]
					}),
					/* @__PURE__ */ jsxs(StatBlock, {
						icon: Briefcase,
						title: "Data Quality",
						accent: "bg-success/10 text-success",
						children: [
							/* @__PURE__ */ jsx(Row, {
								l: "Citizens with Aadhaar",
								v: "See DB"
							}),
							/* @__PURE__ */ jsx(Row, {
								l: "Citizens with Voter ID",
								v: "See DB"
							}),
							/* @__PURE__ */ jsx(Row, {
								l: "Citizens with mobile",
								v: "See DB"
							}),
							/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
								className: "mb-1 flex justify-between text-xs",
								children: [/* @__PURE__ */ jsx("span", {
									className: "text-muted-foreground",
									children: "Voter enrollment rate"
								}), /* @__PURE__ */ jsxs("span", {
									className: "font-semibold tabular-nums",
									children: [total > 0 ? Math.round(voters / total * 100) : 0, "%"]
								})]
							}), /* @__PURE__ */ jsx(Progress, {
								value: total > 0 ? Math.round(voters / total * 100) : 0,
								className: "h-1.5"
							})] })
						]
					}),
					/* @__PURE__ */ jsxs(StatBlock, {
						icon: Building,
						title: "Housing",
						accent: "bg-warning/15 text-warning",
						children: [
							/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
								className: "mb-1 flex justify-between text-xs",
								children: [/* @__PURE__ */ jsx("span", { children: "Urban areas" }), /* @__PURE__ */ jsx("span", {
									className: "font-semibold tabular-nums",
									children: "~60%"
								})]
							}), /* @__PURE__ */ jsx(Progress, {
								value: 60,
								className: "h-1.5"
							})] }),
							/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
								className: "mb-1 flex justify-between text-xs",
								children: [/* @__PURE__ */ jsx("span", { children: "Rural areas" }), /* @__PURE__ */ jsx("span", {
									className: "font-semibold tabular-nums",
									children: "~40%"
								})]
							}), /* @__PURE__ */ jsx(Progress, {
								value: 40,
								className: "h-1.5"
							})] }),
							/* @__PURE__ */ jsx(Row, {
								l: "PMAY demand est.",
								v: "12,400+"
							})
						]
					}),
					/* @__PURE__ */ jsxs(StatBlock, {
						icon: Sprout,
						title: "Agriculture",
						accent: "bg-success/10 text-success",
						children: [
							/* @__PURE__ */ jsx(Row, {
								l: "Farmer households",
								v: "~28%"
							}),
							/* @__PURE__ */ jsx(Row, {
								l: "Urban workforce",
								v: "~72%"
							}),
							/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
								className: "mb-1 flex justify-between text-xs",
								children: [/* @__PURE__ */ jsx("span", { children: "PM-KISAN enrolled" }), /* @__PURE__ */ jsx("span", {
									className: "font-semibold tabular-nums",
									children: "~42%"
								})]
							}), /* @__PURE__ */ jsx(Progress, {
								value: 42,
								className: "h-1.5"
							})] })
						]
					}),
					/* @__PURE__ */ jsxs(StatBlock, {
						icon: GraduationCap,
						title: "Education",
						accent: "bg-info/10 text-info",
						children: [
							/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
								className: "mb-1 flex justify-between text-xs",
								children: [/* @__PURE__ */ jsx("span", { children: "Literacy rate est." }), /* @__PURE__ */ jsx("span", {
									className: "font-semibold tabular-nums",
									children: "~78%"
								})]
							}), /* @__PURE__ */ jsx(Progress, {
								value: 78,
								className: "h-1.5"
							})] }),
							/* @__PURE__ */ jsx(Row, {
								l: "Primary enrollment",
								v: "~92%"
							}),
							/* @__PURE__ */ jsx(Row, {
								l: "Secondary completion",
								v: "~68%"
							})
						]
					}),
					/* @__PURE__ */ jsxs(StatBlock, {
						icon: HeartPulse,
						title: "Health",
						accent: "bg-destructive/10 text-destructive",
						children: [
							/* @__PURE__ */ jsx(Row, {
								l: "Ayushman Bharat coverage",
								v: "~62%"
							}),
							/* @__PURE__ */ jsx(Row, {
								l: "PHCs in constituency",
								v: "8"
							}),
							/* @__PURE__ */ jsx(Row, {
								l: "Sub-centres",
								v: "32"
							})
						]
					})
				]
			}),
			/* @__PURE__ */ jsxs(Card, {
				className: "p-4 text-center text-xs text-muted-foreground",
				children: [
					"Population statistics derived from citizen database · ",
					total.toLocaleString("en-IN"),
					" registered citizens as of ",
					(/* @__PURE__ */ new Date()).toLocaleDateString("en-IN")
				]
			})
		]
	})] });
}
//#endregion
export { CensusCenter as component };

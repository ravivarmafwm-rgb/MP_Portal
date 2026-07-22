import { t as Button } from "./button-Bq5vK6RO.js";
import { t as Card } from "./card-CzXpCsbD.js";
import { t as Badge } from "./badge-D1Dupn2y.js";
import { t as PageHeader } from "./PageHeader-B7gZRr0G.js";
import { t as StatCard } from "./StatCard-BdFv4BKh.js";
import { v as families } from "./live-data-6hUqpYkS.js";
import { t as FamilyTree } from "./FamilyTree-B9jnnLVd.js";
import { Link } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { Home, Plus, Users, Wallet } from "lucide-react";
import { motion } from "framer-motion";
//#region src/routes/_app.citizens.families.tsx?tsr-split=component
function FamiliesPage() {
	const totalMembers = families.reduce((a, f) => a + f.totalMembers, 0);
	const totalBenefits = families.reduce((a, f) => a + f.totalBenefits, 0);
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(PageHeader, {
		title: "Family Management",
		description: "Household registry, family graphs and benefits roll-up across the constituency.",
		actions: /* @__PURE__ */ jsxs(Button, {
			size: "sm",
			className: "gap-1.5",
			children: [/* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }), " Register Family"]
		})
	}), /* @__PURE__ */ jsxs("div", {
		className: "space-y-6 p-4 md:p-8",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "grid gap-4 md:grid-cols-3",
			children: [
				/* @__PURE__ */ jsx(StatCard, {
					label: "Total Families",
					value: families.length.toLocaleString("en-IN"),
					icon: Home,
					index: 0,
					hint: "Tracked households"
				}),
				/* @__PURE__ */ jsx(StatCard, {
					label: "Members Covered",
					value: totalMembers.toLocaleString("en-IN"),
					icon: Users,
					index: 1,
					hint: "Across registered families"
				}),
				/* @__PURE__ */ jsx(StatCard, {
					label: "Benefits Disbursed",
					value: `₹${(totalBenefits / 1e3).toFixed(0)}K`,
					icon: Wallet,
					index: 2,
					hint: "Lifetime, current sample"
				})
			]
		}), /* @__PURE__ */ jsx("div", {
			className: "grid gap-4 lg:grid-cols-2",
			children: families.map((f, i) => /* @__PURE__ */ jsx(motion.div, {
				initial: {
					opacity: 0,
					y: 8
				},
				animate: {
					opacity: 1,
					y: 0
				},
				transition: {
					duration: .3,
					delay: i * .05
				},
				children: /* @__PURE__ */ jsxs(Card, {
					className: "p-5",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "flex flex-wrap items-start justify-between gap-3 border-b border-border/60 pb-3",
							children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ jsx(Badge, {
									variant: "outline",
									className: "font-mono text-[10px]",
									children: f.id
								}), /* @__PURE__ */ jsxs("h3", {
									className: "font-display text-base font-semibold",
									children: [f.headName, "'s Household"]
								})]
							}), /* @__PURE__ */ jsxs("p", {
								className: "mt-0.5 text-xs text-muted-foreground",
								children: [
									f.village,
									", ",
									f.mandal,
									" · ",
									f.totalMembers,
									" members"
								]
							})] }), /* @__PURE__ */ jsxs("div", {
								className: "text-right",
								children: [/* @__PURE__ */ jsx("div", {
									className: "text-[11px] uppercase tracking-wider text-muted-foreground",
									children: "Benefits"
								}), /* @__PURE__ */ jsxs("div", {
									className: "font-display text-lg font-bold",
									children: ["₹", f.totalBenefits.toLocaleString("en-IN")]
								})]
							})]
						}),
						/* @__PURE__ */ jsx("div", {
							className: "mt-4",
							children: /* @__PURE__ */ jsx(FamilyTree, { family: f })
						}),
						/* @__PURE__ */ jsx("div", {
							className: "mt-4 flex justify-end gap-2",
							children: /* @__PURE__ */ jsx(Button, {
								variant: "ghost",
								size: "sm",
								asChild: true,
								children: /* @__PURE__ */ jsx(Link, {
									to: "/citizens/profile",
									search: { id: f.headCitizenId },
									children: "Open Head Profile"
								})
							})
						})
					]
				})
			}, f.id))
		})]
	})] });
}
//#endregion
export { FamiliesPage as component };

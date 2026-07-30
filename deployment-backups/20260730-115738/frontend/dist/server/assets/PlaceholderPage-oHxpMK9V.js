import { t as Button } from "./button-Bq5vK6RO.js";
import { t as Card } from "./card-CzXpCsbD.js";
import { t as EmptyState } from "./EmptyState-DOWaGSUW.js";
import { t as Badge } from "./badge-D1Dupn2y.js";
import { t as PageHeader } from "./PageHeader-B7gZRr0G.js";
import { t as Input } from "./input-B8Q2ztVi.js";
import { i as TabsTrigger, r as TabsList, t as Tabs } from "./tabs-CCJRliUM.js";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { Download, Filter, Plus, Search, SlidersHorizontal } from "lucide-react";
import { motion } from "framer-motion";
//#region src/components/layout/PlaceholderPage.tsx
function PlaceholderPage({ title, description, icon, emptyTitle, emptyDescription, emptyAction = "Get started", tabs, stats }) {
	const defaultStats = stats ?? [
		{
			label: "Total Records",
			value: "—"
		},
		{
			label: "This Month",
			value: "—",
			tone: "info"
		},
		{
			label: "Pending Review",
			value: "—",
			tone: "warning"
		},
		{
			label: "Completed",
			value: "—",
			tone: "success"
		}
	];
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(PageHeader, {
		title,
		description,
		actions: /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsxs(Button, {
			variant: "outline",
			size: "sm",
			className: "gap-1.5",
			children: [/* @__PURE__ */ jsx(Download, { className: "h-4 w-4" }), " Export"]
		}), /* @__PURE__ */ jsxs(Button, {
			size: "sm",
			className: "gap-1.5",
			children: [
				/* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }),
				" ",
				emptyAction
			]
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
		children: [
			/* @__PURE__ */ jsx("div", {
				className: "grid grid-cols-2 gap-3 md:grid-cols-4",
				children: defaultStats.map((s) => /* @__PURE__ */ jsxs(Card, {
					className: "p-4",
					children: [/* @__PURE__ */ jsx("div", {
						className: "text-xs font-medium uppercase tracking-wider text-muted-foreground",
						children: s.label
					}), /* @__PURE__ */ jsxs("div", {
						className: "mt-2 flex items-baseline gap-2",
						children: [/* @__PURE__ */ jsx("span", {
							className: "font-display text-2xl font-bold tracking-tight",
							children: s.value
						}), s.tone && s.tone !== "default" && /* @__PURE__ */ jsx(Badge, {
							variant: "secondary",
							className: s.tone === "success" ? "bg-success/10 text-success" : s.tone === "warning" ? "bg-warning/15 text-warning" : "bg-info/10 text-info",
							children: s.tone === "warning" ? "Action" : s.tone === "success" ? "OK" : "Live"
						})]
					})]
				}, s.label))
			}),
			tabs && tabs.length > 0 && /* @__PURE__ */ jsx(Tabs, {
				defaultValue: tabs[0],
				children: /* @__PURE__ */ jsx(TabsList, { children: tabs.map((t) => /* @__PURE__ */ jsx(TabsTrigger, {
					value: t,
					children: t
				}, t)) })
			}),
			/* @__PURE__ */ jsxs(Card, {
				className: "overflow-hidden",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex flex-wrap items-center gap-2 border-b border-border/70 bg-muted/30 p-3",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "relative flex-1 min-w-[200px]",
							children: [/* @__PURE__ */ jsx(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ jsx(Input, {
								placeholder: `Search ${title.toLowerCase()}…`,
								className: "h-9 pl-9 bg-background"
							})]
						}),
						/* @__PURE__ */ jsxs(Button, {
							variant: "outline",
							size: "sm",
							className: "gap-1.5",
							children: [/* @__PURE__ */ jsx(Filter, { className: "h-4 w-4" }), " Filters"]
						}),
						/* @__PURE__ */ jsxs(Button, {
							variant: "outline",
							size: "sm",
							className: "gap-1.5",
							children: [/* @__PURE__ */ jsx(SlidersHorizontal, { className: "h-4 w-4" }), " View"]
						})
					]
				}), /* @__PURE__ */ jsx("div", {
					className: "p-6",
					children: /* @__PURE__ */ jsx(EmptyState, {
						icon,
						title: emptyTitle ?? `No ${title.toLowerCase()} yet`,
						description: emptyDescription ?? `Once your team starts working with ${title.toLowerCase()}, records will appear here with rich filtering, exports and detailed views.`,
						actionLabel: emptyAction,
						secondaryAction: /* @__PURE__ */ jsx(Button, {
							variant: "outline",
							size: "sm",
							children: "Import data"
						})
					})
				})]
			})
		]
	})] });
}
//#endregion
export { PlaceholderPage as t };

import { t as findBreadcrumb } from "./nav-config-DTTFNxmT.js";
import { Link, useRouterState } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { ChevronRight, Home } from "lucide-react";
import { motion } from "framer-motion";
//#region src/components/layout/PageHeader.tsx
function PageHeader({ title, description, actions }) {
	const crumbs = findBreadcrumb(useRouterState({ select: (s) => s.location.pathname }));
	return /* @__PURE__ */ jsx(motion.div, {
		initial: {
			opacity: 0,
			y: -6
		},
		animate: {
			opacity: 1,
			y: 0
		},
		transition: { duration: .25 },
		className: "border-b border-border/70 bg-background",
		children: /* @__PURE__ */ jsxs("div", {
			className: "px-4 pt-5 pb-4 md:px-8",
			children: [/* @__PURE__ */ jsxs("nav", {
				className: "flex items-center gap-1.5 text-xs text-muted-foreground",
				children: [/* @__PURE__ */ jsxs(Link, {
					to: "/dashboard",
					className: "flex items-center gap-1 hover:text-foreground",
					children: [/* @__PURE__ */ jsx(Home, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ jsx("span", { children: "Home" })]
				}), crumbs.map((c, i) => /* @__PURE__ */ jsxs("span", {
					className: "flex items-center gap-1.5",
					children: [/* @__PURE__ */ jsx(ChevronRight, { className: "h-3.5 w-3.5" }), i === crumbs.length - 1 ? /* @__PURE__ */ jsx("span", {
						className: "font-medium text-foreground",
						children: c.title
					}) : /* @__PURE__ */ jsx(Link, {
						to: c.url,
						className: "hover:text-foreground",
						children: c.title
					})]
				}, c.url))]
			}), /* @__PURE__ */ jsxs("div", {
				className: "mt-3 grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 sm:flex sm:flex-wrap sm:items-end sm:justify-between",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ jsx("h1", {
						className: "truncate font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl",
						children: title
					}), description && /* @__PURE__ */ jsx("p", {
						className: "mt-1 max-w-2xl text-sm text-muted-foreground",
						children: description
					})]
				}), actions && /* @__PURE__ */ jsx("div", {
					className: "flex shrink-0 items-center gap-2",
					children: actions
				})]
			})]
		})
	});
}
//#endregion
export { PageHeader as t };

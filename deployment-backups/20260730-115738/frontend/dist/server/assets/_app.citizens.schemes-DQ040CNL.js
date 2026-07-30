import { t as Button } from "./button-Bq5vK6RO.js";
import { t as Card } from "./card-CzXpCsbD.js";
import { t as Badge } from "./badge-D1Dupn2y.js";
import { t as PageHeader } from "./PageHeader-B7gZRr0G.js";
import { A as schemesByCitizen } from "./live-data-6hUqpYkS.js";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-C0WYWEQX.js";
import { Link } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { FileBadge } from "lucide-react";
//#region src/routes/_app.citizens.schemes.tsx?tsr-split=component
var tone = {
	Approved: "bg-success/10 text-success",
	Pending: "bg-warning/15 text-warning",
	Rejected: "bg-destructive/10 text-destructive",
	"Under Review": "bg-primary/10 text-primary"
};
var SplitComponent = () => {
	const rows = schemesByCitizen["CTZ-100245"];
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(PageHeader, {
		title: "Citizen Schemes",
		description: "Applied, approved, pending and rejected schemes mapped per citizen.",
		actions: /* @__PURE__ */ jsx(Button, {
			asChild: true,
			size: "sm",
			variant: "outline",
			children: /* @__PURE__ */ jsx(Link, {
				to: "/citizens/profile",
				children: "Open Citizen 360"
			})
		})
	}), /* @__PURE__ */ jsxs("div", {
		className: "space-y-4 p-4 md:p-8",
		children: [/* @__PURE__ */ jsxs(Card, {
			className: "flex items-center gap-3 p-4 text-sm text-muted-foreground",
			children: [/* @__PURE__ */ jsx(FileBadge, { className: "h-4 w-4 text-primary" }), " Showing scheme history for Anitha Rao · CTZ-100245"]
		}), /* @__PURE__ */ jsx(Card, {
			className: "overflow-hidden",
			children: /* @__PURE__ */ jsxs(Table, { children: [/* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
				/* @__PURE__ */ jsx(TableHead, { children: "Scheme" }),
				/* @__PURE__ */ jsx(TableHead, { children: "Department" }),
				/* @__PURE__ */ jsx(TableHead, { children: "Applied" }),
				/* @__PURE__ */ jsx(TableHead, { children: "Status" }),
				/* @__PURE__ */ jsx(TableHead, {
					className: "text-right",
					children: "Benefit (₹)"
				})
			] }) }), /* @__PURE__ */ jsx(TableBody, { children: rows.map((s) => /* @__PURE__ */ jsxs(TableRow, { children: [
				/* @__PURE__ */ jsx(TableCell, {
					className: "font-medium",
					children: s.scheme
				}),
				/* @__PURE__ */ jsx(TableCell, {
					className: "text-muted-foreground",
					children: s.department
				}),
				/* @__PURE__ */ jsx(TableCell, { children: s.appliedOn }),
				/* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(Badge, {
					variant: "secondary",
					className: tone[s.status],
					children: s.status
				}) }),
				/* @__PURE__ */ jsx(TableCell, {
					className: "text-right tabular-nums",
					children: s.benefitAmount ? s.benefitAmount.toLocaleString("en-IN") : "—"
				})
			] }, s.id)) })] })
		})]
	})] });
};
//#endregion
export { SplitComponent as component };

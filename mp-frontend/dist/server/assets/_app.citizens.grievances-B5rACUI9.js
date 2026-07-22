import { t as Button } from "./button-Bq5vK6RO.js";
import { t as Card } from "./card-CzXpCsbD.js";
import { t as Badge } from "./badge-D1Dupn2y.js";
import { t as PageHeader } from "./PageHeader-B7gZRr0G.js";
import { w as grievancesByCitizen } from "./live-data-6hUqpYkS.js";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-C0WYWEQX.js";
import { Link } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { MessageSquareWarning } from "lucide-react";
//#region src/routes/_app.citizens.grievances.tsx?tsr-split=component
var tone = {
	Open: "bg-destructive/10 text-destructive",
	"In Progress": "bg-warning/15 text-warning",
	Resolved: "bg-success/10 text-success",
	Closed: "bg-muted text-muted-foreground"
};
var SplitComponent = () => {
	const rows = grievancesByCitizen["CTZ-100245"];
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(PageHeader, {
		title: "Citizen Grievances",
		description: "Complaints raised, assignment trail and resolutions.",
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
			children: [/* @__PURE__ */ jsx(MessageSquareWarning, { className: "h-4 w-4 text-primary" }), " Showing grievance history for Anitha Rao · CTZ-100245"]
		}), /* @__PURE__ */ jsx(Card, {
			className: "overflow-hidden",
			children: /* @__PURE__ */ jsxs(Table, { children: [/* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
				/* @__PURE__ */ jsx(TableHead, { children: "ID" }),
				/* @__PURE__ */ jsx(TableHead, { children: "Category" }),
				/* @__PURE__ */ jsx(TableHead, { children: "Title" }),
				/* @__PURE__ */ jsx(TableHead, { children: "Date" }),
				/* @__PURE__ */ jsx(TableHead, { children: "Status" }),
				/* @__PURE__ */ jsx(TableHead, { children: "Resolution" })
			] }) }), /* @__PURE__ */ jsx(TableBody, { children: rows.map((g) => /* @__PURE__ */ jsxs(TableRow, { children: [
				/* @__PURE__ */ jsx(TableCell, {
					className: "font-mono text-xs",
					children: g.id
				}),
				/* @__PURE__ */ jsx(TableCell, { children: g.category }),
				/* @__PURE__ */ jsx(TableCell, {
					className: "max-w-[280px] truncate",
					children: g.title
				}),
				/* @__PURE__ */ jsx(TableCell, { children: g.date }),
				/* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(Badge, {
					variant: "secondary",
					className: tone[g.status],
					children: g.status
				}) }),
				/* @__PURE__ */ jsx(TableCell, {
					className: "text-xs text-muted-foreground",
					children: g.resolution ?? "—"
				})
			] }, g.id)) })] })
		})]
	})] });
};
//#endregion
export { SplitComponent as component };

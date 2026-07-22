import { t as Button } from "./button-Bq5vK6RO.js";
import { t as Badge } from "./badge-D1Dupn2y.js";
import { t as PageHeader } from "./PageHeader-B7gZRr0G.js";
import { t as Input } from "./input-B8Q2ztVi.js";
import { t as StatCard } from "./StatCard-BdFv4BKh.js";
import { t as DocumentCard } from "./DocumentCard-BoJNIg6V.js";
import { m as documentsByCitizen } from "./live-data-6hUqpYkS.js";
import { useMemo, useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { FileText, Filter, ScanLine, Upload } from "lucide-react";
import { motion } from "framer-motion";
//#region src/routes/_app.citizens.documents.tsx?tsr-split=component
var allDocs = documentsByCitizen["CTZ-100245"];
var filters = [
	"All",
	"Aadhaar",
	"Voter ID",
	"Income Certificate",
	"Caste Certificate",
	"Land Records",
	"Ration Card",
	"PAN"
];
function DocumentCenterPage() {
	const [filter, setFilter] = useState("All");
	const [q, setQ] = useState("");
	const filtered = useMemo(() => {
		return allDocs.filter((d) => {
			const matchFilter = filter === "All" || d.type === filter;
			const matchQ = !q || d.number.toLowerCase().includes(q.toLowerCase()) || d.type.toLowerCase().includes(q.toLowerCase());
			return matchFilter && matchQ;
		});
	}, [filter, q]);
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(PageHeader, {
		title: "Document Center",
		description: "Unified document repository with previews, OCR and version history.",
		actions: /* @__PURE__ */ jsxs(Button, {
			size: "sm",
			className: "gap-1.5",
			children: [/* @__PURE__ */ jsx(Upload, { className: "h-4 w-4" }), " Upload Document"]
		})
	}), /* @__PURE__ */ jsxs("div", {
		className: "space-y-6 p-4 md:p-8",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "grid gap-4 md:grid-cols-3",
				children: [
					/* @__PURE__ */ jsx(StatCard, {
						label: "Documents on File",
						value: "48,902",
						icon: FileText,
						index: 0,
						delta: "+3.1%"
					}),
					/* @__PURE__ */ jsx(StatCard, {
						label: "OCR Extracted",
						value: "42,180",
						icon: ScanLine,
						index: 1,
						delta: "+4.8%",
						hint: "Auto-indexed"
					}),
					/* @__PURE__ */ jsx(StatCard, {
						label: "Pending Verification",
						value: "1,204",
						icon: Filter,
						index: 2,
						delta: "-1.2%",
						trend: "down"
					})
				]
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
				transition: { duration: .3 },
				className: "flex flex-wrap items-center gap-3",
				children: [/* @__PURE__ */ jsx(Input, {
					placeholder: "Search documents…",
					value: q,
					onChange: (e) => setQ(e.target.value),
					className: "h-9 max-w-xs"
				}), /* @__PURE__ */ jsx("div", {
					className: "flex flex-wrap gap-1.5",
					children: filters.map((f) => /* @__PURE__ */ jsx(Badge, {
						variant: filter === f ? "default" : "outline",
						className: "cursor-pointer",
						onClick: () => setFilter(f),
						children: f
					}, f))
				})]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "grid gap-4 md:grid-cols-2 xl:grid-cols-4",
				children: filtered.map((d, i) => /* @__PURE__ */ jsx(DocumentCard, {
					doc: d,
					index: i
				}, d.id))
			})
		]
	})] });
}
//#endregion
export { DocumentCenterPage as component };

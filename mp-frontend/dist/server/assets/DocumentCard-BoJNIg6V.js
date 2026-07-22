import { t as Button } from "./button-Bq5vK6RO.js";
import { t as Card } from "./card-CzXpCsbD.js";
import { t as Badge } from "./badge-D1Dupn2y.js";
import { jsx, jsxs } from "react/jsx-runtime";
import { Download, Eye, FileText, ShieldAlert, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
//#region src/components/citizens/DocumentCard.tsx
function DocumentCard({ doc, index = 0 }) {
	return /* @__PURE__ */ jsx(motion.div, {
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
			delay: index * .04
		},
		children: /* @__PURE__ */ jsxs(Card, {
			className: "group flex h-full flex-col p-4 transition-all hover:-translate-y-0.5 hover:shadow-md",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "flex items-start justify-between",
					children: [/* @__PURE__ */ jsx("div", {
						className: "grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary",
						children: /* @__PURE__ */ jsx(FileText, { className: "h-5 w-5" })
					}), doc.verified ? /* @__PURE__ */ jsxs(Badge, {
						variant: "outline",
						className: "border-success/40 text-success",
						children: [/* @__PURE__ */ jsx(ShieldCheck, { className: "mr-1 h-3 w-3" }), "Verified"]
					}) : /* @__PURE__ */ jsxs(Badge, {
						variant: "outline",
						className: "border-warning/40 text-warning",
						children: [/* @__PURE__ */ jsx(ShieldAlert, { className: "mr-1 h-3 w-3" }), "Unverified"]
					})]
				}),
				/* @__PURE__ */ jsx("h4", {
					className: "mt-3 font-display text-sm font-semibold",
					children: doc.type
				}),
				/* @__PURE__ */ jsx("p", {
					className: "text-xs text-muted-foreground",
					children: doc.number
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "mt-3 grid grid-cols-2 gap-2 text-xs",
					children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
						className: "text-muted-foreground",
						children: "Issued"
					}), /* @__PURE__ */ jsx("div", {
						className: "font-medium",
						children: doc.issuedOn
					})] }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
						className: "text-muted-foreground",
						children: "OCR"
					}), /* @__PURE__ */ jsx("div", {
						className: "font-medium",
						children: "Auto-extracted"
					})] })]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "mt-auto flex gap-1.5 pt-4",
					children: [/* @__PURE__ */ jsxs(Button, {
						size: "sm",
						variant: "outline",
						className: "flex-1 gap-1.5",
						children: [/* @__PURE__ */ jsx(Eye, { className: "h-3.5 w-3.5" }), "Preview"]
					}), /* @__PURE__ */ jsx(Button, {
						size: "sm",
						variant: "ghost",
						className: "px-2",
						children: /* @__PURE__ */ jsx(Download, { className: "h-3.5 w-3.5" })
					})]
				})
			]
		})
	});
}
//#endregion
export { DocumentCard as t };

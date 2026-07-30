import { t as Button } from "./button-Bq5vK6RO.js";
import { jsx, jsxs } from "react/jsx-runtime";
import { motion } from "framer-motion";
//#region src/components/layout/EmptyState.tsx
function EmptyState({ icon: Icon, title, description, actionLabel, secondaryAction }) {
	return /* @__PURE__ */ jsxs(motion.div, {
		initial: {
			opacity: 0,
			y: 10
		},
		animate: {
			opacity: 1,
			y: 0
		},
		transition: { duration: .3 },
		className: "flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/50 px-6 py-16 text-center",
		children: [
			/* @__PURE__ */ jsx("div", {
				className: "grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 text-primary ring-8 ring-primary/5",
				children: /* @__PURE__ */ jsx(Icon, { className: "h-6 w-6" })
			}),
			/* @__PURE__ */ jsx("h3", {
				className: "mt-5 font-display text-lg font-semibold text-foreground",
				children: title
			}),
			/* @__PURE__ */ jsx("p", {
				className: "mt-1.5 max-w-md text-sm text-muted-foreground",
				children: description
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "mt-5 flex flex-wrap items-center justify-center gap-2",
				children: [actionLabel && /* @__PURE__ */ jsx(Button, {
					size: "sm",
					children: actionLabel
				}), secondaryAction]
			})
		]
	});
}
//#endregion
export { EmptyState as t };

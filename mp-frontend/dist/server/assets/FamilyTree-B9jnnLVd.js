import { t as cn } from "./utils-C_uf36nf.js";
import { jsx, jsxs } from "react/jsx-runtime";
import { Crown, User } from "lucide-react";
import { motion } from "framer-motion";
//#region src/components/citizens/FamilyTree.tsx
function FamilyTree({ family }) {
	const head = family.members.find((m) => m.isHead) ?? family.members[0];
	const others = family.members.filter((m) => m !== head);
	return /* @__PURE__ */ jsx("div", {
		className: "rounded-xl border border-border/70 bg-card p-6",
		children: /* @__PURE__ */ jsxs("div", {
			className: "flex flex-col items-center",
			children: [
				/* @__PURE__ */ jsxs(motion.div, {
					initial: {
						opacity: 0,
						scale: .9
					},
					animate: {
						opacity: 1,
						scale: 1
					},
					transition: { duration: .35 },
					className: "relative flex flex-col items-center",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "relative grid h-20 w-20 place-items-center rounded-2xl bg-gradient-to-br from-primary to-primary/70 text-primary-foreground shadow-lg",
						children: [/* @__PURE__ */ jsx(Crown, { className: "absolute -top-3 h-5 w-5 text-amber-500" }), /* @__PURE__ */ jsx("span", {
							className: "text-xl font-bold",
							children: head.name.split(" ").map((p) => p[0]).slice(0, 2).join("")
						})]
					}), /* @__PURE__ */ jsxs("div", {
						className: "mt-2 text-center",
						children: [/* @__PURE__ */ jsx("div", {
							className: "text-sm font-semibold",
							children: head.name
						}), /* @__PURE__ */ jsxs("div", {
							className: "text-xs text-muted-foreground",
							children: [
								"Head · ",
								head.age,
								" yrs"
							]
						})]
					})]
				}),
				/* @__PURE__ */ jsx("div", {
					className: "my-6 h-8 w-px bg-border",
					"aria-hidden": true
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "relative w-full",
					children: [/* @__PURE__ */ jsx("div", {
						className: "absolute left-1/2 top-0 hidden h-px w-[calc(100%-4rem)] -translate-x-1/2 bg-border md:block",
						"aria-hidden": true
					}), /* @__PURE__ */ jsx("div", {
						className: "grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5",
						children: others.map((m, i) => /* @__PURE__ */ jsxs(motion.div, {
							initial: {
								opacity: 0,
								y: 10
							},
							animate: {
								opacity: 1,
								y: 0
							},
							transition: {
								duration: .3,
								delay: .1 + i * .05
							},
							className: "relative flex flex-col items-center",
							children: [
								/* @__PURE__ */ jsx("div", {
									className: "hidden h-6 w-px bg-border md:block",
									"aria-hidden": true
								}),
								/* @__PURE__ */ jsx("div", {
									className: cn("mt-0 grid h-16 w-16 place-items-center rounded-2xl border bg-background text-sm font-semibold shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md", m.gender === "Female" ? "border-rose-200 text-rose-700 dark:border-rose-500/30 dark:text-rose-300" : "border-sky-200 text-sky-700 dark:border-sky-500/30 dark:text-sky-300"),
									children: /* @__PURE__ */ jsx(User, { className: "h-5 w-5" })
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "mt-2 text-center",
									children: [/* @__PURE__ */ jsx("div", {
										className: "text-sm font-medium leading-tight",
										children: m.name
									}), /* @__PURE__ */ jsxs("div", {
										className: "text-[11px] text-muted-foreground",
										children: [
											m.relation,
											" · ",
											m.age,
											" yrs"
										]
									})]
								})
							]
						}, m.citizenId))
					})]
				})
			]
		})
	});
}
//#endregion
export { FamilyTree as t };

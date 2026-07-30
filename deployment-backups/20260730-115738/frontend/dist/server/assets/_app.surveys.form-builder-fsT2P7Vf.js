import { t as cn } from "./utils-C_uf36nf.js";
import { t as Button } from "./button-Bq5vK6RO.js";
import { t as Card } from "./card-CzXpCsbD.js";
import { t as Badge } from "./badge-D1Dupn2y.js";
import { t as PageHeader } from "./PageHeader-B7gZRr0G.js";
import { t as Input } from "./input-B8Q2ztVi.js";
import { t as Label } from "./label-DBD1bRRP.js";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-Dg1urBTx.js";
import { t as Textarea } from "./textarea-kko37XEX.js";
import * as React from "react";
import { useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { AlignLeft, Calendar, CheckSquare, ChevronDown, CircleDot, Copy, Download, Eye, GripVertical, Hash, MapPin, Plus, Save, Send, ShieldCheck, Smartphone, Sparkles, Star, Trash2, Type, Upload } from "lucide-react";
import { motion } from "framer-motion";
import * as SwitchPrimitives from "@radix-ui/react-switch";
//#region src/components/ui/switch.tsx
var Switch = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(SwitchPrimitives.Root, {
	className: cn("peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input", className),
	...props,
	ref,
	children: /* @__PURE__ */ jsx(SwitchPrimitives.Thumb, { className: cn("pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0") })
}));
Switch.displayName = SwitchPrimitives.Root.displayName;
//#endregion
//#region src/routes/_app.surveys.form-builder.tsx?tsr-split=component
var questionLibrary = [
	{
		type: "Short Text",
		icon: "Type",
		desc: "Single-line text input"
	},
	{
		type: "Long Text",
		icon: "AlignLeft",
		desc: "Multi-line text input"
	},
	{
		type: "Number",
		icon: "Hash",
		desc: "Numeric input"
	},
	{
		type: "Dropdown",
		icon: "ChevronDown",
		desc: "Single select list"
	},
	{
		type: "Radio",
		icon: "CircleDot",
		desc: "Multiple choice (1 answer)"
	},
	{
		type: "Checkbox",
		icon: "CheckSquare",
		desc: "Multiple choice (multi)"
	},
	{
		type: "Date",
		icon: "Calendar",
		desc: "Date picker"
	},
	{
		type: "Rating",
		icon: "Star",
		desc: "1–5 star rating"
	},
	{
		type: "File Upload",
		icon: "Upload",
		desc: "Upload photos/docs"
	},
	{
		type: "GPS Location",
		icon: "MapPin",
		desc: "Auto-capture GPS"
	},
	{
		type: "Aadhaar Verification",
		icon: "ShieldCheck",
		desc: "OTP-based verify"
	},
	{
		type: "Mobile",
		icon: "Smartphone",
		desc: "Mobile number field"
	}
];
var iconMap = {
	Type,
	AlignLeft,
	Hash,
	ChevronDown,
	CircleDot,
	CheckSquare,
	Calendar,
	Star,
	Upload,
	MapPin,
	ShieldCheck,
	Smartphone
};
var defaultQuestions = [
	{
		id: "Q1",
		type: "Short Text",
		label: "Respondent Full Name",
		required: true
	},
	{
		id: "Q2",
		type: "Aadhaar Verification",
		label: "Aadhaar Number",
		required: true
	},
	{
		id: "Q3",
		type: "Dropdown",
		label: "Primary Occupation",
		required: true
	},
	{
		id: "Q4",
		type: "Number",
		label: "Annual Family Income (₹)",
		required: false
	},
	{
		id: "Q5",
		type: "Checkbox",
		label: "Issues Faced",
		required: false
	},
	{
		id: "Q6",
		type: "GPS Location",
		label: "Current Location",
		required: false
	}
];
function FormBuilder() {
	const [selected, setSelected] = useState(defaultQuestions[0].id);
	const [questions, setQuestions] = useState(defaultQuestions);
	const active = questions.find((q) => q.id === selected) ?? questions[0];
	function addQuestion(type) {
		const id = `Q${questions.length + 1}`;
		setQuestions([...questions, {
			id,
			type,
			label: `New ${type} question`,
			required: false
		}]);
		setSelected(id);
	}
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(PageHeader, {
		title: "Survey Form Builder",
		description: "Drag · drop · configure. Build multi-language survey forms with conditional logic — no code.",
		actions: /* @__PURE__ */ jsxs("div", {
			className: "flex flex-wrap items-center gap-2",
			children: [
				/* @__PURE__ */ jsxs(Button, {
					size: "sm",
					variant: "outline",
					className: "gap-1.5",
					children: [/* @__PURE__ */ jsx(Save, { className: "h-4 w-4" }), " Save Draft"]
				}),
				/* @__PURE__ */ jsxs(Button, {
					size: "sm",
					variant: "outline",
					className: "gap-1.5",
					children: [/* @__PURE__ */ jsx(Eye, { className: "h-4 w-4" }), " Preview"]
				}),
				/* @__PURE__ */ jsxs(Button, {
					size: "sm",
					variant: "outline",
					className: "gap-1.5",
					children: [/* @__PURE__ */ jsx(Copy, { className: "h-4 w-4" }), " Clone"]
				}),
				/* @__PURE__ */ jsxs(Button, {
					size: "sm",
					variant: "outline",
					className: "gap-1.5",
					children: [/* @__PURE__ */ jsx(Download, { className: "h-4 w-4" }), " Export"]
				}),
				/* @__PURE__ */ jsxs(Button, {
					size: "sm",
					className: "gap-1.5",
					children: [/* @__PURE__ */ jsx(Send, { className: "h-4 w-4" }), " Publish"]
				})
			]
		})
	}), /* @__PURE__ */ jsxs("div", {
		className: "grid gap-4 p-4 md:p-8 xl:grid-cols-[260px_minmax(0,1fr)_320px]",
		children: [
			/* @__PURE__ */ jsxs(Card, {
				className: "p-3",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "mb-2 px-1",
					children: [/* @__PURE__ */ jsx("h3", {
						className: "font-display text-sm font-bold",
						children: "Question Library"
					}), /* @__PURE__ */ jsx("p", {
						className: "text-[11px] text-muted-foreground",
						children: "Click to add to canvas"
					})]
				}), /* @__PURE__ */ jsx("div", {
					className: "grid grid-cols-2 gap-1.5 xl:grid-cols-1",
					children: questionLibrary.map((q, i) => {
						const Icon = iconMap[q.icon] ?? Type;
						return /* @__PURE__ */ jsxs(motion.button, {
							initial: {
								opacity: 0,
								x: -8
							},
							animate: {
								opacity: 1,
								x: 0
							},
							transition: { delay: i * .02 },
							onClick: () => addQuestion(q.type),
							className: "group flex items-center gap-2 rounded-md border border-border bg-card p-2 text-left transition-all hover:border-primary hover:bg-primary/5",
							children: [/* @__PURE__ */ jsx("div", {
								className: "grid h-7 w-7 shrink-0 place-items-center rounded-md bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground",
								children: /* @__PURE__ */ jsx(Icon, { className: "h-3.5 w-3.5" })
							}), /* @__PURE__ */ jsxs("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ jsx("div", {
									className: "truncate text-xs font-semibold",
									children: q.type
								}), /* @__PURE__ */ jsx("div", {
									className: "hidden truncate text-[10px] text-muted-foreground xl:block",
									children: q.desc
								})]
							})]
						}, q.type);
					})
				})]
			}),
			/* @__PURE__ */ jsxs(Card, {
				className: "p-5",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "mb-4 flex items-center justify-between border-b border-dashed border-border pb-3",
					children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(Input, {
						defaultValue: "New Survey Form",
						className: "border-0 px-0 font-display text-lg font-bold focus-visible:ring-0"
					}), /* @__PURE__ */ jsxs("p", {
						className: "text-xs text-muted-foreground",
						children: [
							"1 section · ",
							questions.length,
							" questions · Telugu / English"
						]
					})] }), /* @__PURE__ */ jsx(Badge, {
						variant: "secondary",
						className: "bg-warning/15 text-warning",
						children: "Draft"
					})]
				}), /* @__PURE__ */ jsxs("div", {
					className: "space-y-2",
					children: [
						/* @__PURE__ */ jsx("div", {
							className: "rounded-md bg-primary/5 px-3 py-1.5 text-xs font-semibold text-primary",
							children: "SECTION 1 · Respondent Information"
						}),
						questions.map((q, i) => {
							const Icon = iconMap[questionLibrary.find((x) => x.type === q.type)?.icon ?? "Type"] ?? Type;
							const sel = q.id === selected;
							return /* @__PURE__ */ jsxs(motion.div, {
								initial: {
									opacity: 0,
									y: 4
								},
								animate: {
									opacity: 1,
									y: 0
								},
								transition: { delay: i * .03 },
								onClick: () => setSelected(q.id),
								className: cn("group flex cursor-pointer items-center gap-3 rounded-lg border bg-card p-3 transition-all", sel ? "border-primary shadow-elevated ring-1 ring-primary/30" : "border-border hover:border-primary/40"),
								children: [
									/* @__PURE__ */ jsx(GripVertical, { className: "h-4 w-4 text-muted-foreground/60" }),
									/* @__PURE__ */ jsx("div", {
										className: "grid h-8 w-8 place-items-center rounded-md bg-muted",
										children: /* @__PURE__ */ jsx(Icon, { className: "h-4 w-4" })
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "flex-1 min-w-0",
										children: [/* @__PURE__ */ jsxs("div", {
											className: "flex items-center gap-2",
											children: [
												/* @__PURE__ */ jsx("span", {
													className: "text-[10px] font-mono text-muted-foreground",
													children: q.id
												}),
												/* @__PURE__ */ jsx("span", {
													className: "text-[10px] uppercase tracking-wider text-muted-foreground",
													children: q.type
												}),
												q.required && /* @__PURE__ */ jsx(Badge, {
													variant: "secondary",
													className: "bg-destructive/10 text-destructive text-[9px]",
													children: "Required"
												})
											]
										}), /* @__PURE__ */ jsx("div", {
											className: "mt-0.5 truncate text-sm font-medium",
											children: q.label
										})]
									}),
									/* @__PURE__ */ jsx(Button, {
										variant: "ghost",
										size: "icon",
										className: "h-7 w-7 opacity-0 group-hover:opacity-100",
										onClick: (e) => {
											e.stopPropagation();
											setQuestions(questions.filter((x) => x.id !== q.id));
										},
										children: /* @__PURE__ */ jsx(Trash2, { className: "h-3.5 w-3.5 text-destructive" })
									})
								]
							}, q.id);
						}),
						/* @__PURE__ */ jsxs("button", {
							onClick: () => addQuestion("Short Text"),
							className: "flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border py-3 text-xs font-medium text-muted-foreground transition-colors hover:border-primary hover:text-primary",
							children: [/* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }), " Add question"]
						})
					]
				})]
			}),
			/* @__PURE__ */ jsxs(Card, {
				className: "p-4",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "mb-3 flex items-center justify-between",
					children: [/* @__PURE__ */ jsx("h3", {
						className: "font-display text-sm font-bold",
						children: "Question Properties"
					}), /* @__PURE__ */ jsx(Badge, {
						variant: "outline",
						className: "font-mono text-[10px]",
						children: active.id
					})]
				}), /* @__PURE__ */ jsxs("div", {
					className: "space-y-3",
					children: [
						/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(Label, {
							className: "text-xs",
							children: "Question label"
						}), /* @__PURE__ */ jsx(Input, {
							defaultValue: active.label,
							className: "mt-1"
						})] }),
						/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(Label, {
							className: "text-xs",
							children: "Description / help text"
						}), /* @__PURE__ */ jsx(Textarea, {
							placeholder: "Optional guidance for the volunteer",
							className: "mt-1 min-h-[60px]"
						})] }),
						/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(Label, {
							className: "text-xs",
							children: "Question type"
						}), /* @__PURE__ */ jsxs(Select, {
							defaultValue: active.type,
							children: [/* @__PURE__ */ jsx(SelectTrigger, {
								className: "mt-1",
								children: /* @__PURE__ */ jsx(SelectValue, {})
							}), /* @__PURE__ */ jsx(SelectContent, { children: questionLibrary.map((q) => /* @__PURE__ */ jsx(SelectItem, {
								value: q.type,
								children: q.type
							}, q.type)) })]
						})] }),
						/* @__PURE__ */ jsxs("div", {
							className: "flex items-center justify-between rounded-md border border-border p-2.5",
							children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
								className: "text-xs font-semibold",
								children: "Required"
							}), /* @__PURE__ */ jsx("div", {
								className: "text-[10px] text-muted-foreground",
								children: "Volunteer must answer"
							})] }), /* @__PURE__ */ jsx(Switch, { defaultChecked: active.required })]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "flex items-center justify-between rounded-md border border-border p-2.5",
							children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
								className: "text-xs font-semibold",
								children: "Validation"
							}), /* @__PURE__ */ jsx("div", {
								className: "text-[10px] text-muted-foreground",
								children: "Aadhaar / mobile / regex"
							})] }), /* @__PURE__ */ jsx(Switch, { defaultChecked: true })]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "rounded-md border border-dashed border-primary/30 bg-primary/5 p-3",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-1.5 text-xs font-semibold text-primary",
									children: [/* @__PURE__ */ jsx(Sparkles, { className: "h-3.5 w-3.5" }), " Conditional Logic"]
								}),
								/* @__PURE__ */ jsxs("p", {
									className: "mt-1 text-[11px] text-muted-foreground",
									children: ["Show only if ", /* @__PURE__ */ jsx("span", {
										className: "font-medium text-foreground",
										children: "Q3 = Farmer"
									})]
								}),
								/* @__PURE__ */ jsx(Button, {
									size: "sm",
									variant: "outline",
									className: "mt-2 h-7 w-full text-xs",
									children: "Edit rule"
								})
							]
						})
					]
				})]
			})
		]
	})] });
}
//#endregion
export { FormBuilder as component };

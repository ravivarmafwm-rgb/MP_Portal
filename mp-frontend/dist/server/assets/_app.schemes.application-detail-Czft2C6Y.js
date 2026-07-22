import { t as cn } from "./utils-C_uf36nf.js";
import { t as Button } from "./button-Bq5vK6RO.js";
import { t as Card } from "./card-CzXpCsbD.js";
import { t as Badge } from "./badge-D1Dupn2y.js";
import { n as AvatarFallback, t as Avatar } from "./avatar-CiQwCJNR.js";
import { t as PageHeader } from "./PageHeader-B7gZRr0G.js";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./tabs-CCJRliUM.js";
import { D as requiredDocs, E as previousBenefits, F as verificationFlow, c as auditTrail, i as applicationTimeline, l as benefitHistory, y as featuredApplication } from "./live-data-6hUqpYkS.js";
import { t as Progress } from "./progress-DOIEKRJF.js";
import { Link } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { Activity, AlertCircle, CheckCircle2, Clock, Download, FileBadge, FileText, History, IndianRupee, Printer, Share2, ShieldCheck, User, XCircle } from "lucide-react";
import { motion } from "framer-motion";
//#region src/routes/_app.schemes.application-detail.tsx?tsr-split=component
function ApplicationDetail() {
	const a = featuredApplication;
	const docVerified = requiredDocs.filter((d) => d.verified).length;
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(PageHeader, {
		title: `Application ${a.id}`,
		description: `${a.scheme} · ${a.citizen} · ${a.village}, ${a.mandal}`,
		actions: /* @__PURE__ */ jsxs(Fragment, { children: [
			/* @__PURE__ */ jsxs(Button, {
				variant: "outline",
				size: "sm",
				className: "gap-1.5",
				children: [/* @__PURE__ */ jsx(Share2, { className: "h-4 w-4" }), " Share"]
			}),
			/* @__PURE__ */ jsxs(Button, {
				variant: "outline",
				size: "sm",
				className: "gap-1.5",
				children: [/* @__PURE__ */ jsx(Printer, { className: "h-4 w-4" }), " Print"]
			}),
			/* @__PURE__ */ jsxs(Button, {
				size: "sm",
				className: "gap-1.5",
				children: [/* @__PURE__ */ jsx(CheckCircle2, { className: "h-4 w-4" }), " Approve"]
			})
		] })
	}), /* @__PURE__ */ jsxs("div", {
		className: "space-y-6 p-4 md:p-8",
		children: [/* @__PURE__ */ jsx(Card, {
			className: "overflow-hidden p-0",
			children: /* @__PURE__ */ jsx("div", {
				className: "bg-gradient-to-br from-primary/10 via-background to-background p-5",
				children: /* @__PURE__ */ jsxs("div", {
					className: "flex flex-wrap items-center gap-4",
					children: [/* @__PURE__ */ jsx(Avatar, {
						className: "h-14 w-14 ring-2 ring-primary/30",
						children: /* @__PURE__ */ jsx(AvatarFallback, {
							className: "bg-primary/15 text-primary font-bold",
							children: a.citizen.split(" ").map((x) => x[0]).join("")
						})
					}), /* @__PURE__ */ jsxs("div", {
						className: "min-w-0 flex-1",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex flex-wrap items-center gap-2",
							children: [
								/* @__PURE__ */ jsx("h2", {
									className: "font-display text-xl font-bold",
									children: a.citizen
								}),
								/* @__PURE__ */ jsx(Badge, {
									variant: "secondary",
									className: "bg-warning/15 text-warning",
									children: a.status
								}),
								/* @__PURE__ */ jsx(Badge, {
									variant: "secondary",
									className: "bg-primary/10 text-primary",
									children: a.schemeCode
								})
							]
						}), /* @__PURE__ */ jsxs("div", {
							className: "mt-1 grid grid-cols-2 gap-3 text-xs text-muted-foreground sm:grid-cols-5",
							children: [
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
									className: "font-semibold text-foreground",
									children: a.id
								}), "Application ID"] }),
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
									className: "font-semibold text-foreground",
									children: a.scheme
								}), "Scheme"] }),
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
									className: "font-semibold text-foreground",
									children: a.department
								}), "Department"] }),
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
									className: "font-semibold text-foreground",
									children: a.appliedOn
								}), "Submission Date"] }),
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
									className: "font-semibold text-foreground",
									children: ["₹", a.benefit.toLocaleString()]
								}), "Benefit Amount"] })
							]
						})]
					})]
				})
			})
		}), /* @__PURE__ */ jsxs(Tabs, {
			defaultValue: "overview",
			className: "w-full",
			children: [
				/* @__PURE__ */ jsxs(TabsList, {
					className: "flex w-full flex-wrap justify-start",
					children: [
						/* @__PURE__ */ jsxs(TabsTrigger, {
							value: "overview",
							children: [/* @__PURE__ */ jsx(FileBadge, { className: "mr-1.5 h-3.5 w-3.5" }), "Overview"]
						}),
						/* @__PURE__ */ jsxs(TabsTrigger, {
							value: "citizen",
							children: [/* @__PURE__ */ jsx(User, { className: "mr-1.5 h-3.5 w-3.5" }), "Citizen"]
						}),
						/* @__PURE__ */ jsxs(TabsTrigger, {
							value: "docs",
							children: [/* @__PURE__ */ jsx(FileText, { className: "mr-1.5 h-3.5 w-3.5" }), "Documents"]
						}),
						/* @__PURE__ */ jsxs(TabsTrigger, {
							value: "verify",
							children: [/* @__PURE__ */ jsx(ShieldCheck, { className: "mr-1.5 h-3.5 w-3.5" }), "Verification"]
						}),
						/* @__PURE__ */ jsxs(TabsTrigger, {
							value: "timeline",
							children: [/* @__PURE__ */ jsx(Activity, { className: "mr-1.5 h-3.5 w-3.5" }), "Timeline"]
						}),
						/* @__PURE__ */ jsxs(TabsTrigger, {
							value: "benefits",
							children: [/* @__PURE__ */ jsx(IndianRupee, { className: "mr-1.5 h-3.5 w-3.5" }), "Benefits"]
						}),
						/* @__PURE__ */ jsxs(TabsTrigger, {
							value: "audit",
							children: [/* @__PURE__ */ jsx(History, { className: "mr-1.5 h-3.5 w-3.5" }), "Audit"]
						})
					]
				}),
				/* @__PURE__ */ jsxs(TabsContent, {
					value: "overview",
					className: "mt-4 grid gap-4 lg:grid-cols-2",
					children: [
						/* @__PURE__ */ jsxs(Card, {
							className: "p-5",
							children: [/* @__PURE__ */ jsx("h3", {
								className: "font-display text-sm font-bold",
								children: "Application Summary"
							}), /* @__PURE__ */ jsx("dl", {
								className: "mt-3 space-y-2 text-sm",
								children: [
									["Application ID", a.id],
									["Submitted", a.appliedOn],
									["Channel", "Mobile App"],
									["Volunteer Assist", "Suresh Reddy (VOL-2412)"],
									["Current Stage", a.status],
									["Expected Decision", "2026-06-25"]
								].map(([k, v]) => /* @__PURE__ */ jsxs("div", {
									className: "flex justify-between border-b border-border/40 pb-1.5 text-xs",
									children: [/* @__PURE__ */ jsx("span", {
										className: "text-muted-foreground",
										children: k
									}), /* @__PURE__ */ jsx("span", {
										className: "font-semibold",
										children: v
									})]
								}, k))
							})]
						}),
						/* @__PURE__ */ jsxs(Card, {
							className: "p-5",
							children: [
								/* @__PURE__ */ jsx("h3", {
									className: "font-display text-sm font-bold",
									children: "Scheme Summary"
								}),
								/* @__PURE__ */ jsx("p", {
									className: "mt-2 text-xs text-muted-foreground",
									children: "PMAY Gramin — pucca house with basic amenities for rural homeless families."
								}),
								/* @__PURE__ */ jsx("dl", {
									className: "mt-3 space-y-2 text-sm",
									children: [
										["Scheme", a.scheme],
										["Code", a.schemeCode],
										["Department", a.department],
										["Benefit", `₹${a.benefit.toLocaleString()}`],
										["Category", a.category]
									].map(([k, v]) => /* @__PURE__ */ jsxs("div", {
										className: "flex justify-between border-b border-border/40 pb-1.5 text-xs",
										children: [/* @__PURE__ */ jsx("span", {
											className: "text-muted-foreground",
											children: k
										}), /* @__PURE__ */ jsx("span", {
											className: "font-semibold",
											children: v
										})]
									}, k))
								})
							]
						}),
						/* @__PURE__ */ jsxs(Card, {
							className: "p-5",
							children: [/* @__PURE__ */ jsx("h3", {
								className: "font-display text-sm font-bold",
								children: "Eligibility Summary"
							}), /* @__PURE__ */ jsx("div", {
								className: "mt-3 space-y-2",
								children: [
									{
										c: "BPL household",
										ok: true
									},
									{
										c: "Rural residence",
										ok: true
									},
									{
										c: "No pucca house",
										ok: true
									},
									{
										c: "SECC listed",
										ok: true
									},
									{
										c: "Aadhaar seeded bank a/c",
										ok: true
									},
									{
										c: "Land record verified",
										ok: false
									}
								].map((e, i) => /* @__PURE__ */ jsxs("div", {
									className: "flex items-center justify-between rounded-md bg-muted/40 p-2 text-xs",
									children: [/* @__PURE__ */ jsx("span", { children: e.c }), e.ok ? /* @__PURE__ */ jsx(Badge, {
										variant: "secondary",
										className: "bg-success/10 text-success",
										children: "Met"
									}) : /* @__PURE__ */ jsx(Badge, {
										variant: "secondary",
										className: "bg-warning/15 text-warning",
										children: "Pending"
									})]
								}, i))
							})]
						}),
						/* @__PURE__ */ jsxs(Card, {
							className: "p-5",
							children: [/* @__PURE__ */ jsx("h3", {
								className: "font-display text-sm font-bold",
								children: "Benefit Summary"
							}), /* @__PURE__ */ jsxs("div", {
								className: "mt-3 grid grid-cols-2 gap-3",
								children: [
									/* @__PURE__ */ jsxs("div", {
										className: "rounded-lg bg-muted/40 p-3",
										children: [/* @__PURE__ */ jsx("div", {
											className: "text-[10px] uppercase text-muted-foreground",
											children: "Total Benefit"
										}), /* @__PURE__ */ jsxs("div", {
											className: "mt-1 font-display text-xl font-bold tabular-nums",
											children: ["₹", a.benefit.toLocaleString()]
										})]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "rounded-lg bg-muted/40 p-3",
										children: [/* @__PURE__ */ jsx("div", {
											className: "text-[10px] uppercase text-muted-foreground",
											children: "Tranches"
										}), /* @__PURE__ */ jsx("div", {
											className: "mt-1 font-display text-xl font-bold tabular-nums",
											children: "3"
										})]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "rounded-lg bg-muted/40 p-3",
										children: [/* @__PURE__ */ jsx("div", {
											className: "text-[10px] uppercase text-muted-foreground",
											children: "Released"
										}), /* @__PURE__ */ jsx("div", {
											className: "mt-1 font-display text-xl font-bold tabular-nums",
											children: "₹0"
										})]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "rounded-lg bg-muted/40 p-3",
										children: [/* @__PURE__ */ jsx("div", {
											className: "text-[10px] uppercase text-muted-foreground",
											children: "Pending"
										}), /* @__PURE__ */ jsxs("div", {
											className: "mt-1 font-display text-xl font-bold tabular-nums",
											children: ["₹", a.benefit.toLocaleString()]
										})]
									})
								]
							})]
						})
					]
				}),
				/* @__PURE__ */ jsxs(TabsContent, {
					value: "citizen",
					className: "mt-4 grid gap-4 lg:grid-cols-2",
					children: [/* @__PURE__ */ jsxs(Card, {
						className: "p-5",
						children: [
							/* @__PURE__ */ jsx("h3", {
								className: "font-display text-sm font-bold",
								children: "Citizen Snapshot"
							}),
							/* @__PURE__ */ jsx("dl", {
								className: "mt-3 space-y-2",
								children: [
									["Name", a.citizen],
									["Citizen ID", a.citizenId],
									["Mobile", "+91 98XXXXXX42"],
									["Age / Gender", "42 / Female"],
									["Aadhaar", "XXXX-XXXX-9821"],
									["Village", `${a.village}, ${a.mandal}`],
									["Category", "OBC · BPL"]
								].map(([k, v]) => /* @__PURE__ */ jsxs("div", {
									className: "flex justify-between border-b border-border/40 pb-1.5 text-xs",
									children: [/* @__PURE__ */ jsx("span", {
										className: "text-muted-foreground",
										children: k
									}), /* @__PURE__ */ jsx("span", {
										className: "font-semibold",
										children: v
									})]
								}, k))
							}),
							/* @__PURE__ */ jsx(Button, {
								asChild: true,
								variant: "outline",
								size: "sm",
								className: "mt-3 w-full",
								children: /* @__PURE__ */ jsx(Link, {
									to: "/citizens/profile",
									children: "Open Citizen 360 →"
								})
							})
						]
					}), /* @__PURE__ */ jsxs(Card, {
						className: "p-5",
						children: [
							/* @__PURE__ */ jsx("h3", {
								className: "font-display text-sm font-bold",
								children: "Family Information"
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "mt-3 grid grid-cols-2 gap-2 text-xs",
								children: [
									/* @__PURE__ */ jsxs("div", {
										className: "rounded-md bg-muted/40 p-2",
										children: [/* @__PURE__ */ jsx("div", {
											className: "text-muted-foreground",
											children: "Family ID"
										}), /* @__PURE__ */ jsx("div", {
											className: "font-semibold",
											children: "FAM-104821"
										})]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "rounded-md bg-muted/40 p-2",
										children: [/* @__PURE__ */ jsx("div", {
											className: "text-muted-foreground",
											children: "Members"
										}), /* @__PURE__ */ jsx("div", {
											className: "font-semibold",
											children: "5"
										})]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "rounded-md bg-muted/40 p-2",
										children: [/* @__PURE__ */ jsx("div", {
											className: "text-muted-foreground",
											children: "Head"
										}), /* @__PURE__ */ jsx("div", {
											className: "font-semibold",
											children: "Krishna Rao"
										})]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "rounded-md bg-muted/40 p-2",
										children: [/* @__PURE__ */ jsx("div", {
											className: "text-muted-foreground",
											children: "Income"
										}), /* @__PURE__ */ jsx("div", {
											className: "font-semibold",
											children: "₹1.8L / yr"
										})]
									})
								]
							}),
							/* @__PURE__ */ jsx("h4", {
								className: "mt-4 text-xs font-semibold uppercase text-muted-foreground",
								children: "Previous Benefits"
							}),
							/* @__PURE__ */ jsx("div", {
								className: "mt-2 space-y-1.5",
								children: previousBenefits.map((b, i) => /* @__PURE__ */ jsxs("div", {
									className: "flex items-center justify-between rounded-md bg-muted/40 p-2 text-xs",
									children: [/* @__PURE__ */ jsx("span", {
										className: "font-medium",
										children: b.scheme
									}), /* @__PURE__ */ jsxs("span", {
										className: "tabular-nums",
										children: [
											b.year,
											" · ₹",
											b.amount.toLocaleString()
										]
									})]
								}, i))
							})
						]
					})]
				}),
				/* @__PURE__ */ jsx(TabsContent, {
					value: "docs",
					className: "mt-4",
					children: /* @__PURE__ */ jsxs(Card, {
						className: "p-5",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", {
									className: "font-display text-sm font-bold",
									children: "Required Documents"
								}), /* @__PURE__ */ jsxs("p", {
									className: "text-xs text-muted-foreground",
									children: [
										docVerified,
										" of ",
										requiredDocs.length,
										" verified"
									]
								})] }), /* @__PURE__ */ jsxs(Button, {
									variant: "outline",
									size: "sm",
									className: "gap-1.5",
									children: [/* @__PURE__ */ jsx(Download, { className: "h-4 w-4" }), " Download All"]
								})]
							}),
							/* @__PURE__ */ jsx(Progress, {
								value: docVerified / requiredDocs.length * 100,
								className: "mt-3 h-1.5"
							}),
							/* @__PURE__ */ jsx("div", {
								className: "mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3",
								children: requiredDocs.map((d) => /* @__PURE__ */ jsxs("div", {
									className: "rounded-lg border border-border/70 p-3",
									children: [/* @__PURE__ */ jsxs("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ jsx("span", {
											className: "text-sm font-semibold",
											children: d.name
										}), d.verified ? /* @__PURE__ */ jsxs(Badge, {
											variant: "secondary",
											className: "bg-success/10 text-success",
											children: [/* @__PURE__ */ jsx(CheckCircle2, { className: "mr-0.5 inline h-3 w-3" }), "Verified"]
										}) : d.submitted ? /* @__PURE__ */ jsxs(Badge, {
											variant: "secondary",
											className: "bg-warning/15 text-warning",
											children: [/* @__PURE__ */ jsx(Clock, { className: "mr-0.5 inline h-3 w-3" }), "Pending"]
										}) : /* @__PURE__ */ jsxs(Badge, {
											variant: "secondary",
											className: "bg-destructive/10 text-destructive",
											children: [/* @__PURE__ */ jsx(AlertCircle, { className: "mr-0.5 inline h-3 w-3" }), "Missing"]
										})]
									}), /* @__PURE__ */ jsx("div", {
										className: "mt-2 grid h-24 place-items-center rounded-md bg-muted/40",
										children: /* @__PURE__ */ jsx(FileText, { className: "h-8 w-8 text-muted-foreground/60" })
									})]
								}, d.name))
							})
						]
					})
				}),
				/* @__PURE__ */ jsx(TabsContent, {
					value: "verify",
					className: "mt-4",
					children: /* @__PURE__ */ jsxs(Card, {
						className: "p-5",
						children: [/* @__PURE__ */ jsx("h3", {
							className: "font-display text-sm font-bold",
							children: "Verification Workflow"
						}), /* @__PURE__ */ jsx("div", {
							className: "mt-4 space-y-3",
							children: verificationFlow.map((v, i) => /* @__PURE__ */ jsxs(motion.div, {
								initial: {
									opacity: 0,
									x: -10
								},
								animate: {
									opacity: 1,
									x: 0
								},
								transition: { delay: i * .08 },
								className: "flex gap-4 rounded-lg border border-border/70 p-4",
								children: [/* @__PURE__ */ jsx("div", {
									className: cn("grid h-9 w-9 shrink-0 place-items-center rounded-full", v.status === "Completed" ? "bg-success/10 text-success" : v.status === "In Progress" ? "bg-warning/15 text-warning" : "bg-muted text-muted-foreground"),
									children: v.status === "Completed" ? /* @__PURE__ */ jsx(CheckCircle2, { className: "h-4 w-4" }) : v.status === "In Progress" ? /* @__PURE__ */ jsx(Clock, { className: "h-4 w-4" }) : /* @__PURE__ */ jsx(XCircle, { className: "h-4 w-4" })
								}), /* @__PURE__ */ jsxs("div", {
									className: "min-w-0 flex-1",
									children: [
										/* @__PURE__ */ jsxs("div", {
											className: "flex flex-wrap items-center gap-2",
											children: [/* @__PURE__ */ jsx("span", {
												className: "font-semibold",
												children: v.step
											}), /* @__PURE__ */ jsx(Badge, {
												variant: "secondary",
												className: cn("text-[10px]", v.status === "Completed" ? "bg-success/10 text-success" : v.status === "In Progress" ? "bg-warning/15 text-warning" : "bg-muted"),
												children: v.status
											})]
										}),
										/* @__PURE__ */ jsxs("div", {
											className: "mt-0.5 text-xs text-muted-foreground",
											children: [
												v.actor,
												" · ",
												v.date
											]
										}),
										/* @__PURE__ */ jsx("p", {
											className: "mt-1 text-xs",
											children: v.note
										})
									]
								})]
							}, i))
						})]
					})
				}),
				/* @__PURE__ */ jsx(TabsContent, {
					value: "timeline",
					className: "mt-4",
					children: /* @__PURE__ */ jsxs(Card, {
						className: "p-5",
						children: [/* @__PURE__ */ jsx("h3", {
							className: "font-display text-sm font-bold",
							children: "Application Journey"
						}), /* @__PURE__ */ jsx("div", {
							className: "relative mt-4 border-l-2 border-border/70 pl-6",
							children: applicationTimeline.map((t, i) => /* @__PURE__ */ jsxs(motion.div, {
								initial: {
									opacity: 0,
									x: -8
								},
								animate: {
									opacity: 1,
									x: 0
								},
								transition: { delay: i * .06 },
								className: "relative mb-5",
								children: [/* @__PURE__ */ jsx("span", {
									className: "absolute -left-[31px] grid h-5 w-5 place-items-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground",
									children: i + 1
								}), /* @__PURE__ */ jsxs("div", {
									className: "rounded-lg bg-muted/40 p-3",
									children: [/* @__PURE__ */ jsxs("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ jsx("span", {
											className: "text-sm font-semibold",
											children: t.event
										}), /* @__PURE__ */ jsx(Badge, {
											variant: "secondary",
											className: "bg-primary/10 text-[10px] text-primary",
											children: t.type
										})]
									}), /* @__PURE__ */ jsxs("div", {
										className: "mt-0.5 text-xs text-muted-foreground",
										children: [
											t.actor,
											" · ",
											t.date
										]
									})]
								})]
							}, i))
						})]
					})
				}),
				/* @__PURE__ */ jsx(TabsContent, {
					value: "benefits",
					className: "mt-4",
					children: /* @__PURE__ */ jsxs(Card, {
						className: "p-5",
						children: [/* @__PURE__ */ jsx("h3", {
							className: "font-display text-sm font-bold",
							children: "Benefit History"
						}), /* @__PURE__ */ jsx("div", {
							className: "mt-3 overflow-hidden rounded-lg border border-border/70",
							children: /* @__PURE__ */ jsxs("table", {
								className: "w-full text-sm",
								children: [/* @__PURE__ */ jsx("thead", {
									className: "bg-muted/50 text-xs uppercase text-muted-foreground",
									children: /* @__PURE__ */ jsxs("tr", { children: [
										/* @__PURE__ */ jsx("th", {
											className: "p-3 text-left",
											children: "ID"
										}),
										/* @__PURE__ */ jsx("th", {
											className: "p-3 text-left",
											children: "Scheme"
										}),
										/* @__PURE__ */ jsx("th", {
											className: "p-3 text-right",
											children: "Amount"
										}),
										/* @__PURE__ */ jsx("th", {
											className: "p-3 text-left",
											children: "Date"
										}),
										/* @__PURE__ */ jsx("th", {
											className: "p-3 text-left",
											children: "Department"
										}),
										/* @__PURE__ */ jsx("th", {
											className: "p-3 text-left",
											children: "Status"
										})
									] })
								}), /* @__PURE__ */ jsx("tbody", { children: benefitHistory.map((b) => /* @__PURE__ */ jsxs("tr", {
									className: "border-t border-border/40",
									children: [
										/* @__PURE__ */ jsx("td", {
											className: "p-3 font-mono text-xs",
											children: b.id
										}),
										/* @__PURE__ */ jsx("td", {
											className: "p-3 font-medium",
											children: b.scheme
										}),
										/* @__PURE__ */ jsxs("td", {
											className: "p-3 text-right tabular-nums",
											children: ["₹", b.amount.toLocaleString()]
										}),
										/* @__PURE__ */ jsx("td", {
											className: "p-3 tabular-nums",
											children: b.date
										}),
										/* @__PURE__ */ jsx("td", {
											className: "p-3",
											children: b.department
										}),
										/* @__PURE__ */ jsx("td", {
											className: "p-3",
											children: /* @__PURE__ */ jsx(Badge, {
												variant: "secondary",
												className: "bg-success/10 text-success",
												children: b.status
											})
										})
									]
								}, b.id)) })]
							})
						})]
					})
				}),
				/* @__PURE__ */ jsx(TabsContent, {
					value: "audit",
					className: "mt-4",
					children: /* @__PURE__ */ jsxs(Card, {
						className: "p-5",
						children: [/* @__PURE__ */ jsx("h3", {
							className: "font-display text-sm font-bold",
							children: "Audit Trail"
						}), /* @__PURE__ */ jsx("div", {
							className: "mt-3 space-y-2",
							children: auditTrail.map((a, i) => /* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-3 rounded-lg border border-border/70 p-3 text-xs",
								children: [
									/* @__PURE__ */ jsx(Badge, {
										variant: "secondary",
										className: "bg-primary/10 font-mono text-[10px] text-primary",
										children: a.action
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "min-w-0 flex-1",
										children: [/* @__PURE__ */ jsx("div", {
											className: "font-medium",
											children: a.user
										}), /* @__PURE__ */ jsx("div", {
											className: "text-muted-foreground",
											children: a.remarks
										})]
									}),
									/* @__PURE__ */ jsx("span", {
										className: "shrink-0 tabular-nums text-muted-foreground",
										children: a.date
									})
								]
							}, i))
						})]
					})
				})
			]
		})]
	})] });
}
//#endregion
export { ApplicationDetail as component };

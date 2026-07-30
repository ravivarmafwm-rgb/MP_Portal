import { C as fetchGrievances, X as updateGrievance } from "./api-CQX857SN.js";
import { t as cn } from "./utils-C_uf36nf.js";
import { t as Button } from "./button-Bq5vK6RO.js";
import { t as Card } from "./card-CzXpCsbD.js";
import { t as Badge } from "./badge-D1Dupn2y.js";
import { n as AvatarFallback, t as Avatar } from "./avatar-CiQwCJNR.js";
import { t as Skeleton } from "./skeleton-D9W9wFsj.js";
import { t as PageHeader } from "./PageHeader-B7gZRr0G.js";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./tabs-CCJRliUM.js";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-Dg1urBTx.js";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-C0WYWEQX.js";
import { Link, useSearch } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AlertCircle, ArrowUpRight, Building2, Calendar, CheckCircle2, Download, FileText, MapPin, MessageCircle, Phone, ShieldCheck, User } from "lucide-react";
import { motion } from "framer-motion";
//#region src/routes/_app.grievances.detail.tsx?tsr-split=component
var statusTone = {
	pending: "bg-warning/15 text-warning",
	assigned: "bg-info/10 text-info",
	in_progress: "bg-primary/10 text-primary",
	escalated: "bg-destructive/10 text-destructive",
	resolved: "bg-success/10 text-success",
	closed: "bg-muted text-muted-foreground"
};
function GrievanceDetailPage() {
	const { id } = useSearch({ from: "/_app/grievances/detail" });
	const qc = useQueryClient();
	const { data: listData, isLoading } = useQuery({
		queryKey: ["grievances-for-detail", id],
		queryFn: () => fetchGrievances({ per_page: 100 }),
		staleTime: 3e4
	});
	const grievance = id ? listData?.data?.find((g) => g.id === id) ?? listData?.data?.[0] : listData?.data?.[0];
	const { mutate: doUpdate } = useMutation({
		mutationFn: ({ status }) => updateGrievance(String(grievance?.id ?? ""), { status }),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["grievances-for-detail"] });
			toast.success("Status updated");
		},
		onError: () => toast.error("Update failed")
	});
	if (isLoading) return /* @__PURE__ */ jsx("div", {
		className: "p-8 space-y-4",
		children: Array.from({ length: 3 }).map((_, i) => /* @__PURE__ */ jsx(Skeleton, { className: "h-20 w-full" }, i))
	});
	if (!grievance) return /* @__PURE__ */ jsxs("div", {
		className: "p-8 text-center text-sm text-muted-foreground",
		children: ["No grievance found. ", /* @__PURE__ */ jsx(Link, {
			to: "/grievances/list",
			className: "text-primary hover:underline",
			children: "Back to list"
		})]
	});
	const g = grievance;
	const timeline = [{
		id: "t1",
		date: String(g.created_at ?? "").substring(0, 10),
		event: "Complaint Registered",
		actor: String(g.citizen_name ?? "Citizen"),
		type: "create"
	}, {
		id: "t2",
		date: String(g.updated_at ?? "").substring(0, 10),
		event: "Status: " + String(g.status ?? "pending"),
		actor: "System",
		type: "update"
	}];
	if (String(g.status) === "resolved" || String(g.status) === "closed") timeline.push({
		id: "t3",
		date: String(g.resolved_date ?? g.updated_at ?? "").substring(0, 10),
		event: "Resolved",
		actor: "Department",
		type: "resolve"
	});
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(PageHeader, {
		title: "Case 360",
		description: `${String(g.grievance_number ?? "")} — complete view of this grievance`,
		actions: /* @__PURE__ */ jsxs(Fragment, { children: [
			/* @__PURE__ */ jsxs(Button, {
				variant: "outline",
				size: "sm",
				className: "gap-1.5",
				children: [/* @__PURE__ */ jsx(MessageCircle, { className: "h-4 w-4" }), " Message"]
			}),
			/* @__PURE__ */ jsxs(Button, {
				variant: "outline",
				size: "sm",
				className: "gap-1.5",
				children: [/* @__PURE__ */ jsx(ArrowUpRight, { className: "h-4 w-4" }), " Escalate"]
			}),
			/* @__PURE__ */ jsxs(Button, {
				size: "sm",
				className: "gap-1.5",
				onClick: () => doUpdate({ status: "resolved" }),
				children: [/* @__PURE__ */ jsx(CheckCircle2, { className: "h-4 w-4" }), " Mark Resolved"]
			})
		] })
	}), /* @__PURE__ */ jsxs("div", {
		className: "space-y-6 p-4 md:p-8",
		children: [/* @__PURE__ */ jsx(motion.div, {
			initial: {
				opacity: 0,
				y: 8
			},
			animate: {
				opacity: 1,
				y: 0
			},
			children: /* @__PURE__ */ jsx(Card, {
				className: "overflow-hidden",
				children: /* @__PURE__ */ jsx("div", {
					className: "bg-gradient-to-r from-primary/15 via-primary/5 to-transparent p-5",
					children: /* @__PURE__ */ jsxs("div", {
						className: "flex flex-wrap items-start gap-4",
						children: [
							/* @__PURE__ */ jsx(Avatar, {
								className: "h-14 w-14",
								children: /* @__PURE__ */ jsx(AvatarFallback, { children: String(g.citizen_name ?? "?").split(" ").map((p) => p[0]).slice(0, 2).join("") })
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "min-w-0 flex-1",
								children: [
									/* @__PURE__ */ jsxs("div", {
										className: "flex flex-wrap items-center gap-2",
										children: [
											/* @__PURE__ */ jsx("span", {
												className: "font-mono text-xs text-muted-foreground",
												children: String(g.grievance_number ?? "")
											}),
											/* @__PURE__ */ jsx(Badge, {
												variant: "secondary",
												className: cn("text-[10px]", statusTone[String(g.priority ?? "medium")] ?? "bg-warning/15 text-warning"),
												children: String(g.priority ?? "medium")
											}),
											/* @__PURE__ */ jsx(Badge, {
												variant: "secondary",
												className: cn("text-[10px]", statusTone[String(g.status ?? "pending")]),
												children: String(g.status ?? "").replace("_", " ")
											})
										]
									}),
									/* @__PURE__ */ jsx("h2", {
										className: "mt-1 font-display text-xl font-bold",
										children: String(g.subject ?? "Grievance")
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground",
										children: [
											/* @__PURE__ */ jsxs("span", {
												className: "inline-flex items-center gap-1",
												children: [
													/* @__PURE__ */ jsx(User, { className: "h-3 w-3" }),
													" ",
													String(g.citizen_name ?? "Unknown")
												]
											}),
											/* @__PURE__ */ jsxs("span", {
												className: "inline-flex items-center gap-1",
												children: [
													/* @__PURE__ */ jsx(Phone, { className: "h-3 w-3" }),
													" ",
													String(g.citizen_mobile ?? "—")
												]
											}),
											/* @__PURE__ */ jsxs("span", {
												className: "inline-flex items-center gap-1",
												children: [
													/* @__PURE__ */ jsx(Calendar, { className: "h-3 w-3" }),
													" ",
													String(g.created_at ?? "").substring(0, 10)
												]
											})
										]
									})
								]
							}),
							/* @__PURE__ */ jsx("div", {
								className: "flex items-center gap-2",
								children: /* @__PURE__ */ jsxs(Select, {
									defaultValue: String(g.status ?? "pending"),
									onValueChange: (v) => doUpdate({ status: v }),
									children: [/* @__PURE__ */ jsx(SelectTrigger, {
										className: "h-8 w-[160px] text-xs",
										children: /* @__PURE__ */ jsx(SelectValue, {})
									}), /* @__PURE__ */ jsxs(SelectContent, { children: [
										/* @__PURE__ */ jsx(SelectItem, {
											value: "pending",
											children: "Pending"
										}),
										/* @__PURE__ */ jsx(SelectItem, {
											value: "assigned",
											children: "Assigned"
										}),
										/* @__PURE__ */ jsx(SelectItem, {
											value: "in_progress",
											children: "In Progress"
										}),
										/* @__PURE__ */ jsx(SelectItem, {
											value: "escalated",
											children: "Escalated"
										}),
										/* @__PURE__ */ jsx(SelectItem, {
											value: "resolved",
											children: "Resolved"
										}),
										/* @__PURE__ */ jsx(SelectItem, {
											value: "closed",
											children: "Closed"
										})
									] })]
								})
							})
						]
					})
				})
			})
		}), /* @__PURE__ */ jsxs(Tabs, {
			defaultValue: "overview",
			className: "space-y-4",
			children: [
				/* @__PURE__ */ jsxs(TabsList, {
					className: "w-full justify-start overflow-x-auto",
					children: [
						/* @__PURE__ */ jsx(TabsTrigger, {
							value: "overview",
							children: "Overview"
						}),
						/* @__PURE__ */ jsx(TabsTrigger, {
							value: "citizen",
							children: "Citizen Details"
						}),
						/* @__PURE__ */ jsx(TabsTrigger, {
							value: "attachments",
							children: "Attachments"
						}),
						/* @__PURE__ */ jsx(TabsTrigger, {
							value: "actions",
							children: "Department Actions"
						}),
						/* @__PURE__ */ jsx(TabsTrigger, {
							value: "timeline",
							children: "Timeline"
						}),
						/* @__PURE__ */ jsx(TabsTrigger, {
							value: "resolution",
							children: "Resolution"
						}),
						/* @__PURE__ */ jsx(TabsTrigger, {
							value: "audit",
							children: "Audit Trail"
						})
					]
				}),
				/* @__PURE__ */ jsx(TabsContent, {
					value: "overview",
					className: "space-y-4",
					children: /* @__PURE__ */ jsxs("div", {
						className: "grid gap-4 md:grid-cols-3",
						children: [/* @__PURE__ */ jsxs(Card, {
							className: "p-5 md:col-span-2",
							children: [
								/* @__PURE__ */ jsx("h3", {
									className: "text-sm font-semibold",
									children: "Complaint Summary"
								}),
								/* @__PURE__ */ jsx("p", {
									className: "mt-2 text-sm text-muted-foreground",
									children: String(g.description ?? "No description provided.")
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "mt-4 grid gap-3 sm:grid-cols-2",
									children: [
										/* @__PURE__ */ jsx(InfoBox, {
											icon: AlertCircle,
											label: "Priority",
											value: String(g.priority ?? "medium")
										}),
										/* @__PURE__ */ jsx(InfoBox, {
											icon: Building2,
											label: "Status",
											value: String(g.status ?? "pending")
										}),
										/* @__PURE__ */ jsx(InfoBox, {
											icon: Calendar,
											label: "Submitted",
											value: String(g.created_at ?? "").substring(0, 10)
										}),
										/* @__PURE__ */ jsx(InfoBox, {
											icon: MapPin,
											label: "Source",
											value: String(g.source ?? "portal")
										})
									]
								})
							]
						}), /* @__PURE__ */ jsxs(Card, {
							className: "p-5",
							children: [/* @__PURE__ */ jsx("h3", {
								className: "text-sm font-semibold",
								children: "Quick Actions"
							}), /* @__PURE__ */ jsxs("div", {
								className: "mt-3 grid grid-cols-2 gap-2",
								children: [
									/* @__PURE__ */ jsxs(Button, {
										variant: "outline",
										size: "sm",
										className: "justify-start gap-1.5",
										children: [/* @__PURE__ */ jsx(User, { className: "h-4 w-4" }), " Reassign"]
									}),
									/* @__PURE__ */ jsxs(Button, {
										variant: "outline",
										size: "sm",
										className: "justify-start gap-1.5",
										onClick: () => doUpdate({ status: "escalated" }),
										children: [/* @__PURE__ */ jsx(ArrowUpRight, { className: "h-4 w-4" }), " Escalate"]
									}),
									/* @__PURE__ */ jsxs(Button, {
										variant: "outline",
										size: "sm",
										className: "justify-start gap-1.5",
										children: [/* @__PURE__ */ jsx(Phone, { className: "h-4 w-4" }), " Call Citizen"]
									}),
									/* @__PURE__ */ jsxs(Button, {
										variant: "outline",
										size: "sm",
										className: "justify-start gap-1.5",
										children: [/* @__PURE__ */ jsx(FileText, { className: "h-4 w-4" }), " Generate Report"]
									})
								]
							})]
						})]
					})
				}),
				/* @__PURE__ */ jsx(TabsContent, {
					value: "citizen",
					className: "space-y-4",
					children: /* @__PURE__ */ jsxs("div", {
						className: "grid gap-4 md:grid-cols-3",
						children: [
							/* @__PURE__ */ jsxs(Card, {
								className: "p-5",
								children: [
									/* @__PURE__ */ jsxs("div", {
										className: "flex items-center gap-3",
										children: [/* @__PURE__ */ jsx(Avatar, {
											className: "h-12 w-12",
											children: /* @__PURE__ */ jsx(AvatarFallback, { children: String(g.citizen_name ?? "?").split(" ").map((p) => p[0]).slice(0, 2).join("") })
										}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
											className: "font-semibold",
											children: String(g.citizen_name ?? "Unknown")
										}), /* @__PURE__ */ jsx("div", {
											className: "font-mono text-[11px] text-muted-foreground",
											children: String(g.citizen_mobile ?? "—")
										})] })]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "mt-4 space-y-2 text-xs",
										children: [
											/* @__PURE__ */ jsx(Row, {
												label: "Mobile",
												value: String(g.citizen_mobile ?? "—")
											}),
											/* @__PURE__ */ jsx(Row, {
												label: "Source",
												value: String(g.source ?? "portal")
											}),
											/* @__PURE__ */ jsx(Row, {
												label: "Created",
												value: String(g.created_at ?? "").substring(0, 10)
											})
										]
									}),
									g.citizen_id && /* @__PURE__ */ jsx(Button, {
										asChild: true,
										variant: "outline",
										size: "sm",
										className: "mt-4 w-full",
										children: /* @__PURE__ */ jsx(Link, {
											to: "/citizens/profile",
											search: { id: String(g.citizen_id) },
											children: "Open Citizen 360"
										})
									})
								]
							}),
							/* @__PURE__ */ jsxs(Card, {
								className: "p-5",
								children: [/* @__PURE__ */ jsx("h3", {
									className: "text-sm font-semibold",
									children: "Related Info"
								}), /* @__PURE__ */ jsxs("div", {
									className: "mt-3 space-y-1.5 text-xs",
									children: [
										/* @__PURE__ */ jsx(Row, {
											label: "Grievance #",
											value: String(g.grievance_number ?? "—")
										}),
										/* @__PURE__ */ jsx(Row, {
											label: "Priority",
											value: String(g.priority ?? "medium")
										}),
										/* @__PURE__ */ jsx(Row, {
											label: "Severity",
											value: String(g.severity ?? "—")
										}),
										/* @__PURE__ */ jsx(Row, {
											label: "Category",
											value: String(g?.category?.name ?? "—")
										})
									]
								})]
							}),
							/* @__PURE__ */ jsxs(Card, {
								className: "p-5",
								children: [/* @__PURE__ */ jsx("h3", {
									className: "text-sm font-semibold",
									children: "Previous Complaints"
								}), /* @__PURE__ */ jsxs("div", {
									className: "mt-3 py-4 text-center text-xs text-muted-foreground",
									children: ["Previous complaints visible on Citizen 360 profile.", /* @__PURE__ */ jsx(Button, {
										asChild: true,
										variant: "ghost",
										size: "sm",
										className: "mt-2 block w-full",
										children: /* @__PURE__ */ jsx(Link, {
											to: "/grievances/list",
											children: "Browse All Grievances"
										})
									})]
								})]
							})
						]
					})
				}),
				/* @__PURE__ */ jsx(TabsContent, {
					value: "attachments",
					children: /* @__PURE__ */ jsx("div", {
						className: "grid gap-3 sm:grid-cols-2 md:grid-cols-3",
						children: [
							"Site Photo",
							"Complaint Letter",
							"Supporting Document"
						].map((name, i) => /* @__PURE__ */ jsxs(Card, {
							className: "overflow-hidden",
							children: [/* @__PURE__ */ jsx("div", {
								className: cn("grid h-32 place-items-center", i === 0 ? "bg-gradient-to-br from-info/20 to-info/5" : i === 1 ? "bg-gradient-to-br from-primary/20 to-primary/5" : "bg-gradient-to-br from-success/20 to-success/5"),
								children: /* @__PURE__ */ jsx(FileText, { className: "h-10 w-10 text-foreground/40" })
							}), /* @__PURE__ */ jsxs("div", {
								className: "p-3",
								children: [
									/* @__PURE__ */ jsx("div", {
										className: "truncate text-xs font-semibold",
										children: name
									}),
									/* @__PURE__ */ jsx("div", {
										className: "mt-0.5 text-[10px] text-muted-foreground",
										children: "Upload to attach"
									}),
									/* @__PURE__ */ jsxs(Button, {
										variant: "outline",
										size: "sm",
										className: "mt-2 h-7 w-full gap-1 text-xs",
										children: [/* @__PURE__ */ jsx(Download, { className: "h-3 w-3" }), " Upload"]
									})
								]
							})]
						}, name))
					})
				}),
				/* @__PURE__ */ jsx(TabsContent, {
					value: "actions",
					children: /* @__PURE__ */ jsx(Card, {
						className: "overflow-hidden",
						children: /* @__PURE__ */ jsxs(Table, { children: [/* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
							/* @__PURE__ */ jsx(TableHead, { children: "Date" }),
							/* @__PURE__ */ jsx(TableHead, { children: "Officer" }),
							/* @__PURE__ */ jsx(TableHead, { children: "Action" }),
							/* @__PURE__ */ jsx(TableHead, { children: "Remarks" })
						] }) }), /* @__PURE__ */ jsxs(TableBody, { children: [/* @__PURE__ */ jsxs(TableRow, { children: [
							/* @__PURE__ */ jsx(TableCell, {
								className: "text-xs",
								children: String(g.created_at ?? "").substring(0, 10)
							}),
							/* @__PURE__ */ jsx(TableCell, { children: "System" }),
							/* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(Badge, {
								variant: "secondary",
								className: "bg-primary/10 text-primary",
								children: "Case Created"
							}) }),
							/* @__PURE__ */ jsxs(TableCell, {
								className: "text-xs text-muted-foreground",
								children: ["Grievance registered via ", String(g.source ?? "portal")]
							})
						] }), String(g.status) !== "pending" && /* @__PURE__ */ jsxs(TableRow, { children: [
							/* @__PURE__ */ jsx(TableCell, {
								className: "text-xs",
								children: String(g.updated_at ?? "").substring(0, 10)
							}),
							/* @__PURE__ */ jsx(TableCell, { children: "Staff" }),
							/* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(Badge, {
								variant: "secondary",
								className: "bg-info/10 text-info",
								children: "Status Updated"
							}) }),
							/* @__PURE__ */ jsxs(TableCell, {
								className: "text-xs text-muted-foreground",
								children: ["Status changed to ", String(g.status ?? "")]
							})
						] })] })] })
					})
				}),
				/* @__PURE__ */ jsx(TabsContent, {
					value: "timeline",
					children: /* @__PURE__ */ jsx(Card, {
						className: "p-5",
						children: /* @__PURE__ */ jsx("div", {
							className: "relative space-y-5 pl-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-px before:bg-border",
							children: timeline.map((t, i) => /* @__PURE__ */ jsxs(motion.div, {
								initial: {
									opacity: 0,
									x: -8
								},
								animate: {
									opacity: 1,
									x: 0
								},
								transition: { delay: i * .08 },
								className: "relative",
								children: [
									/* @__PURE__ */ jsx("span", { className: "absolute -left-[18px] top-1 grid h-3.5 w-3.5 place-items-center rounded-full border-2 border-background bg-primary" }),
									/* @__PURE__ */ jsx("div", {
										className: "text-[10px] uppercase tracking-wider text-muted-foreground",
										children: t.date
									}),
									/* @__PURE__ */ jsx("div", {
										className: "text-sm font-semibold",
										children: t.event
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "text-xs text-muted-foreground",
										children: [
											t.actor,
											" · ",
											/* @__PURE__ */ jsx(Badge, {
												variant: "secondary",
												className: "bg-muted text-[10px]",
												children: t.type
											})
										]
									})
								]
							}, t.id))
						})
					})
				}),
				/* @__PURE__ */ jsx(TabsContent, {
					value: "resolution",
					children: /* @__PURE__ */ jsx(Card, {
						className: "p-5",
						children: String(g.status) === "resolved" || String(g.status) === "closed" ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-3",
							children: [
								/* @__PURE__ */ jsx("div", {
									className: "grid h-10 w-10 place-items-center rounded-full bg-success/10 text-success",
									children: /* @__PURE__ */ jsx(CheckCircle2, { className: "h-5 w-5" })
								}),
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", {
									className: "font-display text-lg font-bold",
									children: "Resolved"
								}), /* @__PURE__ */ jsx("p", {
									className: "text-xs text-muted-foreground",
									children: String(g.resolved_date ?? g.updated_at ?? "").substring(0, 10)
								})] }),
								/* @__PURE__ */ jsx(ShieldCheck, { className: "ml-auto h-5 w-5 text-success" })
							]
						}), /* @__PURE__ */ jsxs("div", {
							className: "mt-5",
							children: [/* @__PURE__ */ jsx("h4", {
								className: "text-xs font-semibold uppercase text-muted-foreground",
								children: "Resolution Summary"
							}), /* @__PURE__ */ jsx("p", {
								className: "mt-2 text-sm",
								children: String(g.resolution_summary ?? "Issue was addressed and resolved by the concerned department.")
							})]
						})] }) : /* @__PURE__ */ jsxs("div", {
							className: "py-8 text-center",
							children: [
								/* @__PURE__ */ jsx(CheckCircle2, { className: "h-12 w-12 mx-auto text-muted-foreground/40 mb-3" }),
								/* @__PURE__ */ jsx("p", {
									className: "text-sm text-muted-foreground",
									children: "This grievance is not yet resolved."
								}),
								/* @__PURE__ */ jsxs(Button, {
									className: "mt-3 gap-2",
									onClick: () => doUpdate({ status: "resolved" }),
									children: [/* @__PURE__ */ jsx(CheckCircle2, { className: "h-4 w-4" }), " Mark as Resolved"]
								})
							]
						})
					})
				}),
				/* @__PURE__ */ jsx(TabsContent, {
					value: "audit",
					children: /* @__PURE__ */ jsx(Card, {
						className: "overflow-hidden",
						children: /* @__PURE__ */ jsxs(Table, { children: [/* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
							/* @__PURE__ */ jsx(TableHead, { children: "Date" }),
							/* @__PURE__ */ jsx(TableHead, { children: "User" }),
							/* @__PURE__ */ jsx(TableHead, { children: "Action" }),
							/* @__PURE__ */ jsx(TableHead, { children: "Remarks" })
						] }) }), /* @__PURE__ */ jsx(TableBody, { children: [{
							date: String(g.created_at ?? "").substring(0, 10),
							user: "System",
							action: "CREATED",
							remarks: "Grievance created via " + String(g.source ?? "portal")
						}, {
							date: String(g.updated_at ?? "").substring(0, 10),
							user: "Staff",
							action: "STATUS_UPDATED",
							remarks: "Status: " + String(g.status ?? "")
						}].map((a, i) => /* @__PURE__ */ jsxs(TableRow, { children: [
							/* @__PURE__ */ jsx(TableCell, {
								className: "text-xs tabular-nums",
								children: a.date
							}),
							/* @__PURE__ */ jsx(TableCell, {
								className: "text-sm",
								children: a.user
							}),
							/* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(Badge, {
								variant: "secondary",
								className: "bg-muted font-mono text-[10px]",
								children: a.action
							}) }),
							/* @__PURE__ */ jsx(TableCell, {
								className: "text-xs text-muted-foreground",
								children: a.remarks
							})
						] }, i)) })] })
					})
				})
			]
		})]
	})] });
}
function InfoBox({ icon: Icon, label, value }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "rounded-lg border border-border/70 bg-muted/20 p-3",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "flex items-center gap-2 text-[10px] uppercase tracking-wider text-muted-foreground",
			children: [
				/* @__PURE__ */ jsx(Icon, { className: "h-3 w-3" }),
				" ",
				label
			]
		}), /* @__PURE__ */ jsx("div", {
			className: "mt-1 text-sm font-semibold capitalize",
			children: value
		})]
	});
}
function Row({ label, value }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "flex items-center justify-between",
		children: [/* @__PURE__ */ jsx("span", {
			className: "text-muted-foreground",
			children: label
		}), /* @__PURE__ */ jsx("span", {
			className: "font-medium",
			children: value
		})]
	});
}
//#endregion
export { GrievanceDetailPage as component };

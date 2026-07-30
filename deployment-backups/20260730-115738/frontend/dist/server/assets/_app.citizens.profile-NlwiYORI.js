import { t as Route } from "./_app.citizens.profile-Ccnfj7a0.js";
import { t as Button } from "./button-Bq5vK6RO.js";
import { t as Card } from "./card-CzXpCsbD.js";
import { t as Badge } from "./badge-D1Dupn2y.js";
import { n as AvatarFallback, t as Avatar } from "./avatar-CiQwCJNR.js";
import { t as PageHeader } from "./PageHeader-B7gZRr0G.js";
import { t as Input } from "./input-B8Q2ztVi.js";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./tabs-CCJRliUM.js";
import { t as DocumentCard } from "./DocumentCard-BoJNIg6V.js";
import { A as schemesByCitizen, C as getFamilyOf, M as surveysByCitizen, S as getCitizen, m as documentsByCitizen, t as activityByCitizen, u as citizens, w as grievancesByCitizen } from "./live-data-6hUqpYkS.js";
import { t as FamilyTree } from "./FamilyTree-B9jnnLVd.js";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-C0WYWEQX.js";
import { Link } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { BadgeCheck, Briefcase, Building2, CalendarDays, CalendarPlus, ClipboardList, Compass, FileBadge, FilePlus2, FileText, FolderOpen, Heart, History, IdCard, Mail, MapPin, MessageSquareWarning, Phone, Search, ShieldCheck, User, UserCircle2, UserPlus, Users, Wallet } from "lucide-react";
import { motion } from "framer-motion";
//#region src/components/citizens/CitizenProfileHeader.tsx
function CitizenProfileHeader({ citizen }) {
	const initials = citizen.name.split(" ").map((p) => p[0]).slice(0, 2).join("");
	return /* @__PURE__ */ jsx(motion.div, {
		initial: {
			opacity: 0,
			y: 12
		},
		animate: {
			opacity: 1,
			y: 0
		},
		transition: { duration: .35 },
		children: /* @__PURE__ */ jsxs(Card, {
			className: "overflow-hidden",
			children: [/* @__PURE__ */ jsx("div", { className: "h-24 bg-gradient-to-r from-primary/15 via-primary/5 to-transparent" }), /* @__PURE__ */ jsxs("div", {
				className: "-mt-12 grid gap-5 px-5 pb-5 md:grid-cols-[auto_1fr_auto] md:items-end md:gap-6",
				children: [
					/* @__PURE__ */ jsx(Avatar, {
						className: "h-24 w-24 ring-4 ring-background shadow-md",
						children: /* @__PURE__ */ jsx(AvatarFallback, {
							className: "bg-primary/15 text-xl font-semibold text-primary",
							children: initials
						})
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "min-w-0",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "flex flex-wrap items-center gap-2",
								children: [/* @__PURE__ */ jsx("h2", {
									className: "font-display text-2xl font-bold tracking-tight",
									children: citizen.name
								}), /* @__PURE__ */ jsxs(Badge, {
									variant: "secondary",
									className: "bg-muted text-muted-foreground",
									children: [
										/* @__PURE__ */ jsx(IdCard, { className: "mr-1 h-3 w-3" }),
										" ",
										citizen.id
									]
								})]
							}),
							/* @__PURE__ */ jsxs("p", {
								className: "mt-0.5 text-sm text-muted-foreground",
								children: [
									citizen.occupation,
									" · ",
									citizen.gender,
									" · ",
									citizen.age,
									" yrs"
								]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-muted-foreground",
								children: [
									/* @__PURE__ */ jsxs("span", {
										className: "inline-flex items-center gap-1.5",
										children: [/* @__PURE__ */ jsx(Phone, { className: "h-3.5 w-3.5" }), citizen.mobile]
									}),
									/* @__PURE__ */ jsxs("span", {
										className: "inline-flex items-center gap-1.5",
										children: [/* @__PURE__ */ jsx(Mail, { className: "h-3.5 w-3.5" }), "citizen@mp-platform.in"]
									}),
									/* @__PURE__ */ jsxs("span", {
										className: "inline-flex items-center gap-1.5",
										children: [
											/* @__PURE__ */ jsx(MapPin, { className: "h-3.5 w-3.5" }),
											citizen.village,
											", ",
											citizen.mandal,
											" — ",
											citizen.pincode
										]
									})
								]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "mt-3 flex flex-wrap gap-1.5",
								children: [
									citizen.status === "Active" && /* @__PURE__ */ jsx(Badge, {
										className: "bg-success/10 text-success hover:bg-success/15",
										children: "Active"
									}),
									citizen.status === "Pending" && /* @__PURE__ */ jsx(Badge, {
										className: "bg-warning/15 text-warning hover:bg-warning/20",
										children: "Pending"
									}),
									citizen.status === "Inactive" && /* @__PURE__ */ jsx(Badge, {
										variant: "secondary",
										children: "Inactive"
									}),
									citizen.isSchemeBeneficiary && /* @__PURE__ */ jsxs(Badge, {
										variant: "outline",
										className: "border-primary/40 text-primary",
										children: [/* @__PURE__ */ jsx(BadgeCheck, { className: "mr-1 h-3 w-3" }), "Scheme Beneficiary"]
									}),
									citizen.isVolunteerVerified && /* @__PURE__ */ jsxs(Badge, {
										variant: "outline",
										className: "border-success/40 text-success",
										children: [/* @__PURE__ */ jsx(ShieldCheck, { className: "mr-1 h-3 w-3" }), "Volunteer Verified"]
									}),
									citizen.isSeniorCitizen && /* @__PURE__ */ jsxs(Badge, {
										variant: "outline",
										className: "border-rose-500/40 text-rose-600",
										children: [/* @__PURE__ */ jsx(Heart, { className: "mr-1 h-3 w-3" }), "Senior Citizen"]
									})
								]
							})
						]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "hidden flex-col items-end gap-1 text-right md:flex",
						children: [
							/* @__PURE__ */ jsx("span", {
								className: "text-[11px] font-medium uppercase tracking-wider text-muted-foreground",
								children: "Family ID"
							}),
							/* @__PURE__ */ jsx("span", {
								className: "text-sm font-semibold",
								children: citizen.familyId
							}),
							/* @__PURE__ */ jsx("span", {
								className: "mt-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground",
								children: "Booth"
							}),
							/* @__PURE__ */ jsx("span", {
								className: "text-sm font-semibold",
								children: citizen.booth
							})
						]
					})
				]
			})]
		})
	});
}
//#endregion
//#region src/components/citizens/QuickActionsBar.tsx
var actions = [
	{
		label: "Add Complaint",
		icon: MessageSquareWarning
	},
	{
		label: "Apply Scheme",
		icon: FileBadge
	},
	{
		label: "Schedule Meeting",
		icon: CalendarPlus
	},
	{
		label: "Register Survey",
		icon: ClipboardList
	},
	{
		label: "View Documents",
		icon: FolderOpen
	},
	{
		label: "New Note",
		icon: FilePlus2
	}
];
function QuickActionsBar() {
	return /* @__PURE__ */ jsxs(Card, {
		className: "flex flex-wrap items-center justify-between gap-3 p-3",
		children: [/* @__PURE__ */ jsx("div", {
			className: "pl-2 text-xs font-medium uppercase tracking-wider text-muted-foreground",
			children: "Quick Actions"
		}), /* @__PURE__ */ jsx("div", {
			className: "flex flex-wrap gap-1.5",
			children: actions.map((a) => /* @__PURE__ */ jsxs(Button, {
				variant: "outline",
				size: "sm",
				className: "gap-1.5",
				children: [/* @__PURE__ */ jsx(a.icon, { className: "h-3.5 w-3.5" }), a.label]
			}, a.label))
		})]
	});
}
//#endregion
//#region src/components/citizens/InfoCard.tsx
function InfoCard({ title, icon: Icon, items, footer, index = 0 }) {
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
			className: "p-5",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-2 border-b border-border/60 pb-3",
					children: [/* @__PURE__ */ jsx("div", {
						className: "grid h-8 w-8 place-items-center rounded-md bg-primary/10 text-primary",
						children: /* @__PURE__ */ jsx(Icon, { className: "h-4 w-4" })
					}), /* @__PURE__ */ jsx("h3", {
						className: "font-display text-sm font-semibold tracking-tight",
						children: title
					})]
				}),
				/* @__PURE__ */ jsx("dl", {
					className: "mt-3 grid gap-3 sm:grid-cols-2",
					children: items.map((it) => /* @__PURE__ */ jsxs("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ jsx("dt", {
							className: "text-[11px] font-medium uppercase tracking-wider text-muted-foreground",
							children: it.label
						}), /* @__PURE__ */ jsx("dd", {
							className: "mt-0.5 truncate text-sm font-medium text-foreground",
							children: it.value
						})]
					}, it.label))
				}),
				footer && /* @__PURE__ */ jsx("div", {
					className: "mt-4 border-t border-border/60 pt-3 text-xs text-muted-foreground",
					children: footer
				})
			]
		})
	});
}
//#endregion
//#region src/components/citizens/ActivityTimeline.tsx
var iconMap = {
	register: UserPlus,
	visit: Users,
	scheme: FileBadge,
	grievance: MessageSquareWarning,
	survey: ClipboardList,
	meeting: CalendarDays,
	document: FileText
};
function ActivityTimeline({ events }) {
	return /* @__PURE__ */ jsx("ol", {
		className: "relative ml-3 border-l border-border/70",
		children: events.map((e, i) => {
			const Icon = iconMap[e.icon];
			return /* @__PURE__ */ jsxs(motion.li, {
				initial: {
					opacity: 0,
					x: -8
				},
				animate: {
					opacity: 1,
					x: 0
				},
				transition: {
					duration: .3,
					delay: i * .05
				},
				className: "mb-6 ml-6",
				children: [
					/* @__PURE__ */ jsx("span", {
						className: "absolute -left-[14px] grid h-7 w-7 place-items-center rounded-full bg-primary/10 ring-4 ring-background",
						children: /* @__PURE__ */ jsx(Icon, { className: "h-3.5 w-3.5 text-primary" })
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "flex flex-wrap items-baseline justify-between gap-2",
						children: [/* @__PURE__ */ jsx("h4", {
							className: "text-sm font-semibold",
							children: e.title
						}), /* @__PURE__ */ jsx("time", {
							className: "text-xs text-muted-foreground",
							children: e.date
						})]
					}),
					/* @__PURE__ */ jsx("p", {
						className: "mt-0.5 text-sm text-muted-foreground",
						children: e.description
					})
				]
			}, e.id);
		})
	});
}
//#endregion
//#region src/routes/_app.citizens.profile.tsx?tsr-split=component
var schemeTone = {
	Approved: "bg-success/10 text-success",
	Pending: "bg-warning/15 text-warning",
	Rejected: "bg-destructive/10 text-destructive",
	"Under Review": "bg-primary/10 text-primary"
};
var grievTone = {
	Open: "bg-destructive/10 text-destructive",
	"In Progress": "bg-warning/15 text-warning",
	Resolved: "bg-success/10 text-success",
	Closed: "bg-muted text-muted-foreground"
};
function CitizenProfilePage() {
	const { id } = Route.useSearch();
	const citizen = getCitizen(id);
	const family = getFamilyOf(citizen);
	const docs = documentsByCitizen[citizen.id] ?? documentsByCitizen["CTZ-100245"];
	const schemes = schemesByCitizen[citizen.id] ?? schemesByCitizen["CTZ-100245"];
	const grievances = grievancesByCitizen[citizen.id] ?? grievancesByCitizen["CTZ-100245"];
	const surveys = surveysByCitizen[citizen.id] ?? surveysByCitizen["CTZ-100245"];
	const activity = activityByCitizen[citizen.id] ?? activityByCitizen["CTZ-100245"];
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(PageHeader, {
		title: "Citizen 360",
		description: "Unified view of every interaction across the constituency.",
		actions: /* @__PURE__ */ jsxs("div", {
			className: "flex items-center gap-2",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "relative hidden md:block",
				children: [/* @__PURE__ */ jsx(Search, { className: "pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ jsx(Input, {
					placeholder: "Search Aadhaar, mobile, voter ID, family ID…",
					className: "h-9 w-[320px] pl-8 text-sm"
				})]
			}), /* @__PURE__ */ jsx(Button, {
				variant: "outline",
				size: "sm",
				asChild: true,
				children: /* @__PURE__ */ jsx(Link, {
					to: "/citizens/list",
					children: "Back to Directory"
				})
			})]
		})
	}), /* @__PURE__ */ jsxs("div", {
		className: "space-y-6 p-4 md:p-8",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "grid gap-6 xl:grid-cols-[1fr_280px]",
				children: [/* @__PURE__ */ jsx(CitizenProfileHeader, { citizen }), /* @__PURE__ */ jsxs(Card, {
					className: "hidden p-4 xl:block",
					children: [/* @__PURE__ */ jsx("div", {
						className: "text-xs font-medium uppercase tracking-wider text-muted-foreground",
						children: "Jump to another citizen"
					}), /* @__PURE__ */ jsx("div", {
						className: "mt-3 space-y-1.5",
						children: citizens.slice(0, 6).map((c) => /* @__PURE__ */ jsxs(Link, {
							to: "/citizens/profile",
							search: { id: c.id },
							className: "flex items-center justify-between rounded-md px-2 py-1.5 text-sm hover:bg-accent",
							children: [/* @__PURE__ */ jsx("span", {
								className: "truncate",
								children: c.name
							}), /* @__PURE__ */ jsx("span", {
								className: "text-[10px] text-muted-foreground",
								children: c.id.slice(-4)
							})]
						}, c.id))
					})]
				})]
			}),
			/* @__PURE__ */ jsx(QuickActionsBar, {}),
			/* @__PURE__ */ jsxs(Tabs, {
				defaultValue: "overview",
				className: "w-full",
				children: [
					/* @__PURE__ */ jsxs(TabsList, {
						className: "flex w-full flex-wrap justify-start gap-1 bg-muted/60 p-1",
						children: [
							/* @__PURE__ */ jsxs(TabsTrigger, {
								value: "overview",
								className: "gap-1.5",
								children: [/* @__PURE__ */ jsx(UserCircle2, { className: "h-3.5 w-3.5" }), "Overview"]
							}),
							/* @__PURE__ */ jsxs(TabsTrigger, {
								value: "family",
								className: "gap-1.5",
								children: [/* @__PURE__ */ jsx(Users, { className: "h-3.5 w-3.5" }), "Family"]
							}),
							/* @__PURE__ */ jsxs(TabsTrigger, {
								value: "schemes",
								className: "gap-1.5",
								children: [/* @__PURE__ */ jsx(FileBadge, { className: "h-3.5 w-3.5" }), "Schemes"]
							}),
							/* @__PURE__ */ jsxs(TabsTrigger, {
								value: "grievances",
								className: "gap-1.5",
								children: [/* @__PURE__ */ jsx(MessageSquareWarning, { className: "h-3.5 w-3.5" }), "Grievances"]
							}),
							/* @__PURE__ */ jsxs(TabsTrigger, {
								value: "surveys",
								className: "gap-1.5",
								children: [/* @__PURE__ */ jsx(ClipboardList, { className: "h-3.5 w-3.5" }), "Surveys"]
							}),
							/* @__PURE__ */ jsxs(TabsTrigger, {
								value: "documents",
								className: "gap-1.5",
								children: [/* @__PURE__ */ jsx(FileText, { className: "h-3.5 w-3.5" }), "Documents"]
							}),
							/* @__PURE__ */ jsxs(TabsTrigger, {
								value: "activity",
								className: "gap-1.5",
								children: [/* @__PURE__ */ jsx(History, { className: "h-3.5 w-3.5" }), "Activity"]
							})
						]
					}),
					/* @__PURE__ */ jsx(TabsContent, {
						value: "overview",
						className: "mt-5",
						children: /* @__PURE__ */ jsxs(motion.div, {
							initial: {
								opacity: 0,
								y: 8
							},
							animate: {
								opacity: 1,
								y: 0
							},
							transition: { duration: .3 },
							className: "grid gap-4 lg:grid-cols-2",
							children: [
								/* @__PURE__ */ jsx(InfoCard, {
									title: "Personal Information",
									icon: User,
									index: 0,
									items: [
										{
											label: "Full Name",
											value: citizen.name
										},
										{
											label: "Gender",
											value: citizen.gender
										},
										{
											label: "Age",
											value: `${citizen.age} years`
										},
										{
											label: "Occupation",
											value: citizen.occupation
										},
										{
											label: "Mobile",
											value: citizen.mobile
										},
										{
											label: "Registered",
											value: citizen.registeredOn
										}
									]
								}),
								/* @__PURE__ */ jsx(InfoCard, {
									title: "Demographics",
									icon: Compass,
									index: 1,
									items: [
										{
											label: "Social Category",
											value: citizen.category
										},
										{
											label: "Economic Category",
											value: citizen.economicCategory
										},
										{
											label: "Aadhaar",
											value: citizen.aadhaar
										},
										{
											label: "Voter ID",
											value: citizen.voterId
										}
									]
								}),
								/* @__PURE__ */ jsx(InfoCard, {
									title: "Economic Profile",
									icon: Wallet,
									index: 2,
									items: [
										{
											label: "Income Band",
											value: citizen.economicCategory === "BPL" ? "Below ₹1L / yr" : "₹3L–₹6L / yr"
										},
										{
											label: "Occupation",
											value: citizen.occupation
										},
										{
											label: "Ration Card",
											value: citizen.economicCategory === "BPL" ? "Pink (Priority)" : "White (APL)"
										},
										{
											label: "Skill Level",
											value: "Intermediate"
										}
									]
								}),
								/* @__PURE__ */ jsx(InfoCard, {
									title: "Location Information",
									icon: MapPin,
									index: 3,
									items: [
										{
											label: "Village / Ward",
											value: citizen.village
										},
										{
											label: "Mandal",
											value: citizen.mandal
										},
										{
											label: "Pincode",
											value: citizen.pincode
										},
										{
											label: "Address",
											value: `${citizen.village}, ${citizen.mandal}`
										}
									]
								}),
								/* @__PURE__ */ jsx(InfoCard, {
									title: "Constituency Mapping",
									icon: Building2,
									index: 4,
									items: [
										{
											label: "Lok Sabha Constituency",
											value: citizen.constituency
										},
										{
											label: "Assembly",
											value: "Serilingampally"
										},
										{
											label: "Booth",
											value: citizen.booth
										},
										{
											label: "Family ID",
											value: citizen.familyId
										}
									]
								}),
								/* @__PURE__ */ jsx(InfoCard, {
									title: "Engagement Summary",
									icon: Briefcase,
									index: 5,
									items: [
										{
											label: "Schemes Availed",
											value: `${schemes.filter((s) => s.status === "Approved").length}`
										},
										{
											label: "Grievances Filed",
											value: `${grievances.length}`
										},
										{
											label: "Surveys Completed",
											value: `${surveys.length}`
										},
										{
											label: "Documents on File",
											value: `${docs.length}`
										}
									]
								})
							]
						})
					}),
					/* @__PURE__ */ jsx(TabsContent, {
						value: "family",
						className: "mt-5",
						children: /* @__PURE__ */ jsx(motion.div, {
							initial: {
								opacity: 0,
								y: 8
							},
							animate: {
								opacity: 1,
								y: 0
							},
							transition: { duration: .3 },
							children: /* @__PURE__ */ jsxs(Card, {
								className: "p-5",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "mb-4 flex flex-wrap items-center justify-between gap-3",
									children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("h3", {
										className: "font-display text-base font-semibold",
										children: [family.headName, "'s Household"]
									}), /* @__PURE__ */ jsxs("p", {
										className: "text-xs text-muted-foreground",
										children: [
											family.id,
											" · ",
											family.village,
											", ",
											family.mandal,
											" · ",
											family.totalMembers,
											" members"
										]
									})] }), /* @__PURE__ */ jsxs(Badge, {
										variant: "outline",
										children: ["Total Benefits ₹", family.totalBenefits.toLocaleString("en-IN")]
									})]
								}), /* @__PURE__ */ jsx(FamilyTree, { family })]
							})
						})
					}),
					/* @__PURE__ */ jsx(TabsContent, {
						value: "schemes",
						className: "mt-5",
						children: /* @__PURE__ */ jsx(Card, {
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
							] }) }), /* @__PURE__ */ jsx(TableBody, { children: schemes.map((s) => /* @__PURE__ */ jsxs(TableRow, { children: [
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
									className: schemeTone[s.status],
									children: s.status
								}) }),
								/* @__PURE__ */ jsx(TableCell, {
									className: "text-right tabular-nums",
									children: s.benefitAmount ? s.benefitAmount.toLocaleString("en-IN") : "—"
								})
							] }, s.id)) })] })
						})
					}),
					/* @__PURE__ */ jsx(TabsContent, {
						value: "grievances",
						className: "mt-5",
						children: /* @__PURE__ */ jsxs("div", {
							className: "grid gap-4 lg:grid-cols-[1fr_380px]",
							children: [/* @__PURE__ */ jsx(Card, {
								className: "overflow-hidden",
								children: /* @__PURE__ */ jsxs(Table, { children: [/* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
									/* @__PURE__ */ jsx(TableHead, { children: "ID" }),
									/* @__PURE__ */ jsx(TableHead, { children: "Category" }),
									/* @__PURE__ */ jsx(TableHead, { children: "Title" }),
									/* @__PURE__ */ jsx(TableHead, { children: "Date" }),
									/* @__PURE__ */ jsx(TableHead, { children: "Status" })
								] }) }), /* @__PURE__ */ jsx(TableBody, { children: grievances.map((g) => /* @__PURE__ */ jsxs(TableRow, { children: [
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
										className: grievTone[g.status],
										children: g.status
									}) })
								] }, g.id)) })] })
							}), /* @__PURE__ */ jsxs(Card, {
								className: "p-5",
								children: [/* @__PURE__ */ jsx("h4", {
									className: "mb-3 font-display text-sm font-semibold",
									children: "Resolution Timeline"
								}), /* @__PURE__ */ jsx(ActivityTimeline, { events: grievances.map((g) => ({
									id: g.id,
									date: g.date,
									icon: "grievance",
									title: `${g.category} — ${g.status}`,
									description: g.resolution ?? g.title
								})) })]
							})]
						})
					}),
					/* @__PURE__ */ jsx(TabsContent, {
						value: "surveys",
						className: "mt-5",
						children: /* @__PURE__ */ jsx("div", {
							className: "grid gap-4 md:grid-cols-2 xl:grid-cols-4",
							children: surveys.map((s, i) => /* @__PURE__ */ jsx(motion.div, {
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
									delay: i * .05
								},
								children: /* @__PURE__ */ jsxs(Card, {
									className: "p-4",
									children: [
										/* @__PURE__ */ jsxs("div", {
											className: "flex items-center gap-2 text-xs text-muted-foreground",
											children: [/* @__PURE__ */ jsx(ClipboardList, { className: "h-3.5 w-3.5" }), s.date]
										}),
										/* @__PURE__ */ jsx("h4", {
											className: "mt-2 font-display text-sm font-semibold",
											children: s.survey
										}),
										/* @__PURE__ */ jsxs("div", {
											className: "mt-3 flex items-end justify-between",
											children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
												className: "text-[11px] uppercase tracking-wider text-muted-foreground",
												children: "Responses"
											}), /* @__PURE__ */ jsx("div", {
												className: "font-display text-xl font-bold",
												children: s.responses
											})] }), /* @__PURE__ */ jsxs("div", {
												className: "text-right",
												children: [/* @__PURE__ */ jsx("div", {
													className: "text-[11px] uppercase tracking-wider text-muted-foreground",
													children: "Completion"
												}), /* @__PURE__ */ jsxs("div", {
													className: "font-display text-xl font-bold text-primary",
													children: [s.completion, "%"]
												})]
											})]
										}),
										/* @__PURE__ */ jsx("div", {
											className: "mt-3 h-1.5 overflow-hidden rounded-full bg-muted",
											children: /* @__PURE__ */ jsx("div", {
												className: "h-full rounded-full bg-primary",
												style: { width: `${s.completion}%` }
											})
										})
									]
								})
							}, s.id))
						})
					}),
					/* @__PURE__ */ jsx(TabsContent, {
						value: "documents",
						className: "mt-5",
						children: /* @__PURE__ */ jsx("div", {
							className: "grid gap-4 md:grid-cols-2 xl:grid-cols-4",
							children: docs.map((d, i) => /* @__PURE__ */ jsx(DocumentCard, {
								doc: d,
								index: i
							}, d.id))
						})
					}),
					/* @__PURE__ */ jsx(TabsContent, {
						value: "activity",
						className: "mt-5",
						children: /* @__PURE__ */ jsx(Card, {
							className: "p-6",
							children: /* @__PURE__ */ jsx(ActivityTimeline, { events: activity })
						})
					})
				]
			})
		]
	})] });
}
//#endregion
export { CitizenProfilePage as component };

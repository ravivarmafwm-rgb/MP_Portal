import { n as useAuth } from "./auth-B-xQo2jy.js";
import { r as getDashboardPath } from "./roles-C9ZSVofD.js";
import { t as Button } from "./button-Bq5vK6RO.js";
import { t as Input } from "./input-B8Q2ztVi.js";
import { t as Label } from "./label-DBD1bRRP.js";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { toast } from "sonner";
import { z } from "zod";
import { Building2, Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
//#region src/routes/login.tsx?tsr-split=component
var schema = z.object({
	email: z.string().email("Enter a valid email"),
	password: z.string().min(4, "Password required")
});
function LoginPage() {
	const navigate = useNavigate();
	const { login, isAuthenticated, user, isLoading } = useAuth();
	const [showPass, setShowPass] = useState(false);
	useEffect(() => {
		if (!isLoading && isAuthenticated && user) navigate({
			to: getDashboardPath(user.role_slug),
			replace: true
		});
	}, [
		isLoading,
		isAuthenticated,
		user,
		navigate
	]);
	const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(schema) });
	const onSubmit = async (data) => {
		try {
			const authUser = await login(data.email, data.password);
			toast.success("Welcome back!");
			navigate({
				to: getDashboardPath(authUser.role_slug),
				replace: true
			});
		} catch (err) {
			const msg = err?.response?.data?.message ?? "Invalid credentials. Please try again.";
			toast.error(msg);
		}
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "flex min-h-screen",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "hidden lg:flex lg:w-1/2 bg-sidebar flex-col justify-between p-12 relative overflow-hidden",
			children: [
				/* @__PURE__ */ jsx("div", { className: "absolute -top-32 -right-32 h-96 w-96 rounded-full bg-sidebar-primary/20 blur-3xl" }),
				/* @__PURE__ */ jsx("div", { className: "absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-sidebar-primary/10 blur-3xl" }),
				/* @__PURE__ */ jsxs("div", {
					className: "relative flex items-center gap-3",
					children: [/* @__PURE__ */ jsx("div", {
						className: "grid h-10 w-10 place-items-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground shadow-lg",
						children: /* @__PURE__ */ jsx(Building2, { className: "h-6 w-6" })
					}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
						className: "font-display text-lg font-bold text-sidebar-foreground",
						children: "MP Connect"
					}), /* @__PURE__ */ jsx("div", {
						className: "text-xs text-sidebar-foreground/60",
						children: "Constituency Platform"
					})] })]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "relative space-y-6",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "inline-flex items-center gap-2 rounded-full border border-sidebar-border/40 bg-sidebar-accent/40 px-3 py-1 text-xs text-sidebar-foreground/70",
							children: [/* @__PURE__ */ jsx("div", { className: "h-1.5 w-1.5 rounded-full bg-success animate-pulse" }), "Live Constituency Data"]
						}),
						/* @__PURE__ */ jsxs("h1", {
							className: "font-display text-4xl font-bold leading-tight text-sidebar-foreground",
							children: [
								"Manage your",
								/* @__PURE__ */ jsx("br", {}),
								/* @__PURE__ */ jsx("span", {
									className: "text-sidebar-primary",
									children: "constituency"
								}),
								/* @__PURE__ */ jsx("br", {}),
								"with confidence."
							]
						}),
						/* @__PURE__ */ jsx("p", {
							className: "text-sidebar-foreground/60 text-sm max-w-xs leading-relaxed",
							children: "Real-time citizen data, grievance tracking, scheme coverage, and project monitoring — all in one place."
						}),
						/* @__PURE__ */ jsx("div", {
							className: "grid grid-cols-3 gap-4 pt-4",
							children: [
								{
									label: "Live Data",
									value: "PostgreSQL"
								},
								{
									label: "Modules",
									value: "12+"
								},
								{
									label: "Roles",
									value: "11"
								}
							].map((stat) => /* @__PURE__ */ jsxs("div", {
								className: "rounded-xl border border-sidebar-border/40 bg-sidebar-accent/40 p-3 text-center",
								children: [/* @__PURE__ */ jsx("div", {
									className: "font-display text-xl font-bold text-sidebar-foreground",
									children: stat.value
								}), /* @__PURE__ */ jsx("div", {
									className: "text-xs text-sidebar-foreground/50 mt-0.5",
									children: stat.label
								})]
							}, stat.label))
						})
					]
				}),
				/* @__PURE__ */ jsx("div", {
					className: "relative text-xs text-sidebar-foreground/40",
					children: "MP Constituency Management System · Lok Sabha 2024–2029"
				})
			]
		}), /* @__PURE__ */ jsxs("div", {
			className: "flex flex-1 flex-col items-center justify-center bg-background p-6",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "mb-8 flex items-center gap-3 lg:hidden",
				children: [/* @__PURE__ */ jsx("div", {
					className: "grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground",
					children: /* @__PURE__ */ jsx(Building2, { className: "h-5 w-5" })
				}), /* @__PURE__ */ jsx("div", {
					className: "font-display text-lg font-bold",
					children: "MP Connect"
				})]
			}), /* @__PURE__ */ jsxs("div", {
				className: "w-full max-w-sm space-y-7",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "space-y-1",
						children: [/* @__PURE__ */ jsx("h2", {
							className: "font-display text-2xl font-bold",
							children: "Sign in"
						}), /* @__PURE__ */ jsx("p", {
							className: "text-sm text-muted-foreground",
							children: "Enter your credentials to access the platform"
						})]
					}),
					/* @__PURE__ */ jsxs("form", {
						onSubmit: handleSubmit(onSubmit),
						className: "space-y-4",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "space-y-1.5",
								children: [
									/* @__PURE__ */ jsx(Label, {
										htmlFor: "email",
										children: "Email address"
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "relative",
										children: [/* @__PURE__ */ jsx(Mail, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ jsx(Input, {
											id: "email",
											type: "email",
											placeholder: "admin@mpdashboard.com",
											className: "pl-9",
											autoComplete: "email",
											...register("email")
										})]
									}),
									errors.email && /* @__PURE__ */ jsx("p", {
										className: "text-xs text-destructive",
										children: errors.email.message
									})
								]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "space-y-1.5",
								children: [
									/* @__PURE__ */ jsx(Label, {
										htmlFor: "password",
										children: "Password"
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "relative",
										children: [
											/* @__PURE__ */ jsx(Lock, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }),
											/* @__PURE__ */ jsx(Input, {
												id: "password",
												type: showPass ? "text" : "password",
												placeholder: "••••••••",
												className: "pl-9 pr-10",
												autoComplete: "current-password",
												...register("password")
											}),
											/* @__PURE__ */ jsx("button", {
												type: "button",
												onClick: () => setShowPass((v) => !v),
												className: "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground",
												tabIndex: -1,
												children: showPass ? /* @__PURE__ */ jsx(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ jsx(Eye, { className: "h-4 w-4" })
											})
										]
									}),
									errors.password && /* @__PURE__ */ jsx("p", {
										className: "text-xs text-destructive",
										children: errors.password.message
									})
								]
							}),
							/* @__PURE__ */ jsx(Button, {
								type: "submit",
								className: "w-full",
								disabled: isSubmitting,
								children: isSubmitting ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }), "Signing in…"] }) : "Sign in"
							})
						]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "rounded-xl border border-border/60 bg-muted/30 p-4 space-y-2",
						children: [/* @__PURE__ */ jsx("p", {
							className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide",
							children: "Quick access"
						}), /* @__PURE__ */ jsxs("div", {
							className: "space-y-1.5 text-xs text-muted-foreground",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "flex justify-between",
									children: [/* @__PURE__ */ jsx("span", { children: "Super Admin" }), /* @__PURE__ */ jsx("code", {
										className: "rounded bg-muted px-1",
										children: "admin@mpdashboard.com / Admin@1234"
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "flex justify-between",
									children: [/* @__PURE__ */ jsx("span", { children: "MP" }), /* @__PURE__ */ jsx("code", {
										className: "rounded bg-muted px-1",
										children: "mp@mpdashboard.com / MP@1234"
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "flex justify-between",
									children: [/* @__PURE__ */ jsx("span", { children: "Volunteer" }), /* @__PURE__ */ jsx("code", {
										className: "rounded bg-muted px-1",
										children: "volunteer@mpdashboard.com / Volunteer@1234"
									})]
								})
							]
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "text-center text-sm",
						children: [
							"Don't have an account?",
							" ",
							/* @__PURE__ */ jsx(Link, {
								to: "/register",
								className: "text-primary hover:underline",
								children: "Sign up"
							})
						]
					})
				]
			})]
		})]
	});
}
//#endregion
export { LoginPage as component };

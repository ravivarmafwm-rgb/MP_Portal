import { o as apiRoles } from "./api-CQX857SN.js";
import { n as useAuth } from "./auth-B-xQo2jy.js";
import { r as getDashboardPath } from "./roles-C9ZSVofD.js";
import { t as Button } from "./button-Bq5vK6RO.js";
import { t as Input } from "./input-B8Q2ztVi.js";
import { t as Label } from "./label-DBD1bRRP.js";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-Dg1urBTx.js";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { toast } from "sonner";
import { z } from "zod";
import { Building2, Eye, EyeOff, Loader2, Lock, Mail, User } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
//#region src/routes/register.tsx?tsr-split=component
var schema = z.object({
	name: z.string().min(2, "Name must be at least 2 characters"),
	email: z.string().email("Enter a valid email"),
	password: z.string().min(8, "Password must be at least 8 characters"),
	password_confirmation: z.string().min(8, "Confirm password must be at least 8 characters"),
	role_slug: z.string().min(1, "Please select a role")
}).refine((data) => data.password === data.password_confirmation, {
	message: "Passwords don't match",
	path: ["password_confirmation"]
});
function RegisterPage() {
	const navigate = useNavigate();
	const { register: authRegister, isAuthenticated, user, isLoading } = useAuth();
	const [showPass, setShowPass] = useState(false);
	const [showConfirmPass, setShowConfirmPass] = useState(false);
	const [roles, setRoles] = useState([]);
	const [rolesLoading, setRolesLoading] = useState(true);
	if (!isLoading && isAuthenticated && user) {
		navigate({
			to: getDashboardPath(user.role_slug),
			replace: true
		});
		return null;
	}
	const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(schema) });
	useEffect(() => {
		const fetchRoles = async () => {
			try {
				setRoles(await apiRoles());
			} catch (err) {
				console.error("Failed to fetch roles", err);
				toast.error("Failed to load roles");
			} finally {
				setRolesLoading(false);
			}
		};
		fetchRoles();
	}, []);
	const onSubmit = async (data) => {
		try {
			const authUser = await authRegister(data.name, data.email, data.password, data.password_confirmation, data.role_slug);
			toast.success("Registration successful!");
			navigate({
				to: getDashboardPath(authUser.role_slug),
				replace: true
			});
		} catch (err) {
			const msg = err?.response?.data?.message || err?.response?.data?.errors?.email?.[0] || "Registration failed. Please try again.";
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
					children: [/* @__PURE__ */ jsxs("h1", {
						className: "font-display text-4xl font-bold leading-tight text-sidebar-foreground",
						children: [
							"Create your ",
							/* @__PURE__ */ jsx("br", {}),
							/* @__PURE__ */ jsx("span", {
								className: "text-sidebar-primary",
								children: "account"
							})
						]
					}), /* @__PURE__ */ jsx("p", {
						className: "text-sidebar-foreground/60 text-sm max-w-xs leading-relaxed",
						children: "Join our platform and manage constituency operations efficiently."
					})]
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
							children: "Sign up"
						}), /* @__PURE__ */ jsx("p", {
							className: "text-sm text-muted-foreground",
							children: "Create an account to get started"
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
										htmlFor: "name",
										children: "Full Name"
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "relative",
										children: [/* @__PURE__ */ jsx(User, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ jsx(Input, {
											id: "name",
											type: "text",
											placeholder: "John Doe",
											className: "pl-9",
											...register("name")
										})]
									}),
									errors.name && /* @__PURE__ */ jsx("p", {
										className: "text-xs text-destructive",
										children: errors.name.message
									})
								]
							}),
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
											placeholder: "you@example.com",
											className: "pl-9",
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
										htmlFor: "role",
										children: "Role"
									}),
									/* @__PURE__ */ jsx("div", {
										className: "relative",
										children: rolesLoading ? /* @__PURE__ */ jsxs(Button, {
											variant: "outline",
											disabled: true,
											className: "w-full justify-start text-muted-foreground",
											children: [/* @__PURE__ */ jsx(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }), "Loading roles..."]
										}) : /* @__PURE__ */ jsxs(Select, {
											onValueChange: (value) => setValue("role_slug", value),
											children: [/* @__PURE__ */ jsx(SelectTrigger, {
												className: "w-full",
												children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Select your role" })
											}), /* @__PURE__ */ jsx(SelectContent, { children: roles.map((role) => /* @__PURE__ */ jsx(SelectItem, {
												value: role.slug,
												children: role.name
											}, role.id)) })]
										})
									}),
									errors.role_slug && /* @__PURE__ */ jsx("p", {
										className: "text-xs text-destructive",
										children: errors.role_slug.message
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
							/* @__PURE__ */ jsxs("div", {
								className: "space-y-1.5",
								children: [
									/* @__PURE__ */ jsx(Label, {
										htmlFor: "password_confirmation",
										children: "Confirm Password"
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "relative",
										children: [
											/* @__PURE__ */ jsx(Lock, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }),
											/* @__PURE__ */ jsx(Input, {
												id: "password_confirmation",
												type: showConfirmPass ? "text" : "password",
												placeholder: "••••••••",
												className: "pl-9 pr-10",
												...register("password_confirmation")
											}),
											/* @__PURE__ */ jsx("button", {
												type: "button",
												onClick: () => setShowConfirmPass((v) => !v),
												className: "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground",
												tabIndex: -1,
												children: showConfirmPass ? /* @__PURE__ */ jsx(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ jsx(Eye, { className: "h-4 w-4" })
											})
										]
									}),
									errors.password_confirmation && /* @__PURE__ */ jsx("p", {
										className: "text-xs text-destructive",
										children: errors.password_confirmation.message
									})
								]
							}),
							/* @__PURE__ */ jsx(Button, {
								type: "submit",
								className: "w-full",
								disabled: isSubmitting || rolesLoading,
								children: isSubmitting ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }), "Creating account..."] }) : "Sign up"
							})
						]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "text-center text-sm",
						children: [
							"Already have an account?",
							" ",
							/* @__PURE__ */ jsx(Link, {
								to: "/login",
								className: "text-primary hover:underline",
								children: "Log in"
							})
						]
					})
				]
			})]
		})]
	});
}
//#endregion
export { RegisterPage as component };

import { n as useAuth } from "./auth-B-xQo2jy.js";
import { r as getDashboardPath, t as canAccessRoute } from "./roles-C9ZSVofD.js";
import { t as Button } from "./button-Bq5vK6RO.js";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { ShieldAlert } from "lucide-react";
//#region src/components/auth/RoleGuard.tsx
/**
* Redirects users who lack permission for the current route to their role dashboard.
*/
function RoleGuard({ children, route }) {
	const { user } = useAuth();
	const roleSlug = user?.role_slug ?? "";
	if (!canAccessRoute(roleSlug, route)) return /* @__PURE__ */ jsxs("div", {
		className: "flex min-h-[50vh] flex-col items-center justify-center gap-4 p-8 text-center",
		children: [
			/* @__PURE__ */ jsx(ShieldAlert, { className: "h-12 w-12 text-muted-foreground" }),
			/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h2", {
				className: "text-xl font-bold",
				children: "Access Denied"
			}), /* @__PURE__ */ jsxs("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: [
					"Your role (",
					user?.role,
					") does not have permission to view this page."
				]
			})] }),
			/* @__PURE__ */ jsx(Button, {
				asChild: true,
				variant: "outline",
				children: /* @__PURE__ */ jsx("a", {
					href: getDashboardPath(roleSlug),
					children: "Go to My Dashboard"
				})
			})
		]
	});
	return /* @__PURE__ */ jsx(Fragment, { children });
}
//#endregion
export { RoleGuard as t };

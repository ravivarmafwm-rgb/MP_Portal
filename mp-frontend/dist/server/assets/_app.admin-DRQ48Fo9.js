import { t as RoleGuard } from "./RoleGuard-CJSqkr6i.js";
import { t as MpCommandCenter } from "./MpCommandCenter-BBYQbYr8.js";
import { jsx } from "react/jsx-runtime";
//#region src/routes/_app.admin.tsx?tsr-split=component
function AdminDashboardPage() {
	return /* @__PURE__ */ jsx(RoleGuard, {
		route: "/admin",
		children: /* @__PURE__ */ jsx(MpCommandCenter, { title: "Admin Command Center" })
	});
}
//#endregion
export { AdminDashboardPage as component };

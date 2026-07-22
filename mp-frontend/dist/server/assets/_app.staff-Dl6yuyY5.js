import { t as RoleGuard } from "./RoleGuard-CJSqkr6i.js";
import { t as MpCommandCenter } from "./MpCommandCenter-BBYQbYr8.js";
import { jsx } from "react/jsx-runtime";
//#region src/routes/_app.staff.tsx?tsr-split=component
function StaffDashboardPage() {
	return /* @__PURE__ */ jsx(RoleGuard, {
		route: "/staff",
		children: /* @__PURE__ */ jsx(MpCommandCenter, { title: "Staff Operations Center" })
	});
}
//#endregion
export { StaffDashboardPage as component };

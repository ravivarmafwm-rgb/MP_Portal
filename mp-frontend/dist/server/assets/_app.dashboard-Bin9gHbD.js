import { t as RoleGuard } from "./RoleGuard-CJSqkr6i.js";
import { t as MpCommandCenter } from "./MpCommandCenter-BBYQbYr8.js";
import { jsx } from "react/jsx-runtime";
//#region src/routes/_app.dashboard.tsx?tsr-split=component
function DashboardPage() {
	return /* @__PURE__ */ jsx(RoleGuard, {
		route: "/dashboard",
		children: /* @__PURE__ */ jsx(MpCommandCenter, {})
	});
}
//#endregion
export { DashboardPage as component };

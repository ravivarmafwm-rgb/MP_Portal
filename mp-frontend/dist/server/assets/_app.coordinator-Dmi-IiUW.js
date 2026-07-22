import { t as RoleGuard } from "./RoleGuard-CJSqkr6i.js";
import { t as MpCommandCenter } from "./MpCommandCenter-BBYQbYr8.js";
import { jsx } from "react/jsx-runtime";
//#region src/routes/_app.coordinator.tsx?tsr-split=component
function CoordinatorDashboardPage() {
	return /* @__PURE__ */ jsx(RoleGuard, {
		route: "/coordinator",
		children: /* @__PURE__ */ jsx(MpCommandCenter, { title: "Coordinator Command Center" })
	});
}
//#endregion
export { CoordinatorDashboardPage as component };

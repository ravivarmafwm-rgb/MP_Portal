import { t as RoleGuard } from "./RoleGuard-CJSqkr6i.js";
import { t as MpCommandCenter } from "./MpCommandCenter-BBYQbYr8.js";
import { jsx } from "react/jsx-runtime";
//#region src/routes/_app.mp.tsx?tsr-split=component
function MpDashboardPage() {
	return /* @__PURE__ */ jsx(RoleGuard, {
		route: "/mp",
		children: /* @__PURE__ */ jsx(MpCommandCenter, {})
	});
}
//#endregion
export { MpDashboardPage as component };

import { Navigate } from "@tanstack/react-router";
import { jsx } from "react/jsx-runtime";
//#region src/routes/_app.meetings.index.tsx?tsr-split=component
var SplitComponent = () => /* @__PURE__ */ jsx(Navigate, {
	to: "/meetings/dashboard",
	replace: true
});
//#endregion
export { SplitComponent as component };

import { Navigate } from "@tanstack/react-router";
import { jsx } from "react/jsx-runtime";
//#region src/routes/_app.citizens.index.tsx?tsr-split=component
var SplitComponent = () => /* @__PURE__ */ jsx(Navigate, {
	to: "/citizens/list",
	replace: true
});
//#endregion
export { SplitComponent as component };

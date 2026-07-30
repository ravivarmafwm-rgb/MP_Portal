import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
//#region src/routes/_app.citizens.profile.tsx
var $$splitComponentImporter = () => import("./_app.citizens.profile-NlwiYORI.js");
var Route = createFileRoute("/_app/citizens/profile")({
	validateSearch: (search) => ({
		id: typeof search.id === "string" ? search.id : void 0,
		tab: typeof search.tab === "string" ? search.tab : void 0
	}),
	head: () => ({ meta: [{ title: "Citizen 360 — MP Constituency Platform" }, {
		name: "description",
		content: "Complete 360° profile: schemes, grievances, surveys and history."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };

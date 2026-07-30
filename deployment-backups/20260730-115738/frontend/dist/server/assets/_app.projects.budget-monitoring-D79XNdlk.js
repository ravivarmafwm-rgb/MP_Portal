import { N as fetchProjectStats, P as fetchProjects } from "./api-CQX857SN.js";
import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
//#region src/routes/_app.projects.budget-monitoring.tsx
var $$splitComponentImporter = () => import("./_app.projects.budget-monitoring-D3F0GRts.js");
var Route = createFileRoute("/_app/projects/budget-monitoring")({
	head: () => ({ meta: [{ title: "Budget Monitoring Center" }, {
		name: "description",
		content: "Financial oversight of all constituency development budgets."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter, "component"),
	loader: async () => {
		const [projects, stats] = await Promise.all([fetchProjects(), fetchProjectStats()]);
		return {
			projects,
			stats
		};
	}
});
//#endregion
export { Route as t };

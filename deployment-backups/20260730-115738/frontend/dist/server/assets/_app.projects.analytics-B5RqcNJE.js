import { N as fetchProjectStats, P as fetchProjects } from "./api-CQX857SN.js";
import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
//#region src/routes/_app.projects.analytics.tsx
var $$splitComponentImporter = () => import("./_app.projects.analytics-f5ypyQuQ.js");
var Route = createFileRoute("/_app/projects/analytics")({
	head: () => ({ meta: [{ title: "Project Analytics Center" }, {
		name: "description",
		content: "Executive analytics across projects, budgets, contractors and geography."
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

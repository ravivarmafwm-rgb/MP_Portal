import { N as fetchProjectStats, P as fetchProjects } from "./api-CQX857SN.js";
import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
//#region src/routes/_app.projects.progress-tracker.tsx
var $$splitComponentImporter = () => import("./_app.projects.progress-tracker-JxCfRUGC.js");
var Route = createFileRoute("/_app/projects/progress-tracker")({
	head: () => ({ meta: [{ title: "Project Progress Tracker" }, {
		name: "description",
		content: "Gantt-style tracker for in-flight constituency projects."
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

import { createFileRoute } from "@tanstack/react-router";
import { AnalyticsReportPage } from "@/components/analytics/AnalyticsReportPage";
import { fetchParliamentaryAnalytics } from "@/lib/api";
export const Route = createFileRoute("/_app/analytics/assembly")({
  loader: () => fetchParliamentaryAnalytics("assembly"),
  component: Page,
});
function Page() {
  return (
    <AnalyticsReportPage
      report={Route.useLoaderData()}
      title="Assembly Analytics"
      description="Assembly-wise citizens, service applications, grievances, projects and budget utilization."
    />
  );
}

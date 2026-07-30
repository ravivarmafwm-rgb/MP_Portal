import { createFileRoute } from "@tanstack/react-router";
import { AnalyticsReportPage } from "@/components/analytics/AnalyticsReportPage";
import { fetchParliamentaryAnalytics } from "@/lib/api";
export const Route = createFileRoute("/_app/analytics/village")({
  loader: () => fetchParliamentaryAnalytics("village"),
  component: Page,
});
function Page() {
  return (
    <AnalyticsReportPage
      report={Route.useLoaderData()}
      title="Village Analytics"
      description="Village-level citizen, grievance, scheme, project, volunteer and booth metrics."
    />
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { AnalyticsReportPage } from "@/components/analytics/AnalyticsReportPage";
import { fetchParliamentaryAnalytics } from "@/lib/api";
export const Route = createFileRoute("/_app/analytics/booth")({
  loader: () => fetchParliamentaryAnalytics("booth"),
  component: Page,
});
function Page() {
  return (
    <AnalyticsReportPage
      report={Route.useLoaderData()}
      title="Booth Analytics"
      description="Polling-booth citizen, family, voter and grievance metrics within your authorized geography."
    />
  );
}

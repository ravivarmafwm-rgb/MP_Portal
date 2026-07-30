import { createFileRoute } from "@tanstack/react-router";
import { AnalyticsReportPage } from "@/components/analytics/AnalyticsReportPage";
import { fetchParliamentaryAnalytics } from "@/lib/api";
export const Route = createFileRoute("/_app/analytics/mandal")({
  loader: () => fetchParliamentaryAnalytics("mandal"),
  component: Page,
});
function Page() {
  return (
    <AnalyticsReportPage
      report={Route.useLoaderData()}
      title="Mandal Analytics"
      description="Mandal-wise operational and development metrics within your authorized geography."
    />
  );
}

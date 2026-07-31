import { createFileRoute } from "@tanstack/react-router";
import { AnalyticsReportPage } from "@/components/analytics/AnalyticsReportPage";
import { fetchParliamentaryAnalytics } from "@/lib/api";
export const Route = createFileRoute("/_app/analytics/")({
  loader: () => fetchParliamentaryAnalytics("constituency"),
  component: Page,
});
function Page() {
  return (
    <AnalyticsReportPage
      report={Route.useLoaderData()}
      title="Parliamentary Analytics"
      description="Scoped constituency metrics with assembly, mandal, village and booth drill-downs."
    />
  );
}

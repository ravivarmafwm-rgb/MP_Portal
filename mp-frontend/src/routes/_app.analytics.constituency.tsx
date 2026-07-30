import { createFileRoute } from "@tanstack/react-router";
import { AnalyticsReportPage } from "@/components/analytics/AnalyticsReportPage";
import { fetchParliamentaryAnalytics } from "@/lib/api";
export const Route = createFileRoute("/_app/analytics/constituency")({
  loader: () => fetchParliamentaryAnalytics("constituency"),
  component: Page,
});
function Page() {
  return (
    <AnalyticsReportPage
      report={Route.useLoaderData()}
      title="Constituency Analytics"
      description="Top-level constituency operations, public-service demand and development expenditure."
    />
  );
}

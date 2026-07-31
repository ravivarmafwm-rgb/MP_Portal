import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/card";
import {
  fetchVolunteerGeographicCoverage,
  type VolunteerGeographicRecord,
} from "@/lib/api";
export const Route = createFileRoute("/_app/volunteers/geographic-coverage")({
  loader: fetchVolunteerGeographicCoverage,
  component: Page,
});
function Page() {
  const result = Route.useLoaderData();
  return (
    <>
      <PageHeader
        title="Volunteer Geographic Distribution"
        description="Active volunteer counts by village within your authorized geographic scope."
      />
      <div className="space-y-4 p-4 md:p-8">
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="p-5">
            <p className="text-sm text-muted-foreground">Active volunteers</p>
            <p className="text-3xl font-bold">
              {result.total_active_volunteers}
            </p>
          </Card>
          <Card className="p-5">
            <p className="text-sm text-muted-foreground">
              Villages with active volunteers
            </p>
            <p className="text-3xl font-bold">
              {result.villages_with_active_volunteers}
            </p>
          </Card>
        </div>
        {result.data.length === 0 ? (
          <Card className="p-8 text-center text-muted-foreground">
            No active volunteers with village assignments were found.
          </Card>
        ) : (
          <Card className="divide-y">
            {result.data.map((row: VolunteerGeographicRecord) => (
              <div
                key={row.id}
                className="flex items-center justify-between p-4"
              >
                <div>
                  <strong>{row.name}</strong>
                  <p className="text-xs text-muted-foreground">
                    {row.mandal_name ?? "Mandal not assigned"}
                  </p>
                </div>
                <span className="font-semibold">
                  {row.volunteer_count} volunteer
                  {Number(row.volunteer_count) === 1 ? "" : "s"}
                </span>
              </div>
            ))}
          </Card>
        )}
      </div>
    </>
  );
}

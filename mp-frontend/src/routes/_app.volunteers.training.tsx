import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  fetchVolunteerTraining,
  type VolunteerTrainingRecord,
  type VolunteerRecord,
} from "@/lib/api";
export const Route = createFileRoute("/_app/volunteers/training")({
  loader: () => fetchVolunteerTraining({ per_page: 50 }),
  component: Page,
});
function Page() {
  const result = Route.useLoaderData();
  return (
    <>
      <PageHeader
        title="Volunteer Training"
        description="Training and certification records for volunteers in your geographic scope."
      />
      <div className="space-y-3 p-4 md:p-8">
        <Card className="p-4 text-sm text-muted-foreground">
          {result.meta.total} training records
        </Card>
        {result.data.length === 0 ? (
          <Card className="p-8 text-center text-muted-foreground">
            No training records found.
          </Card>
        ) : (
          result.data.map(
            (
              row: VolunteerTrainingRecord & {
                volunteer: Pick<
                  VolunteerRecord,
                  "id" | "volunteer_id" | "first_name" | "last_name"
                >;
              },
            ) => (
              <Card
                key={row.id}
                className="flex flex-col justify-between gap-3 p-4 md:flex-row md:items-center"
              >
                <div>
                  <Link
                    to="/volunteers/profile"
                    search={{ id: row.volunteer.id }}
                    className="font-semibold hover:text-primary"
                  >
                    {row.training_name}
                  </Link>
                  <p className="text-sm text-muted-foreground">
                    {row.volunteer.first_name} {row.volunteer.last_name} ·{" "}
                    {row.training_type}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(row.start_date).toLocaleDateString()}
                    {row.end_date
                      ? ` – ${new Date(row.end_date).toLocaleDateString()}`
                      : ""}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{row.status}</Badge>
                  {row.certificate_number && (
                    <Badge variant="outline">
                      Certificate {row.certificate_number}
                    </Badge>
                  )}
                </div>
              </Card>
            ),
          )
        )}
      </div>
    </>
  );
}

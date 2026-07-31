import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { fetchCitizen, type CitizenDetailRecord } from "@/lib/api";
export const Route = createFileRoute("/_app/citizens/schemes")({
  validateSearch: z.object({ id: z.string().optional() }),
  loaderDeps: ({ search }) => ({ id: search.id }),
  loader: ({ deps }) => (deps.id ? fetchCitizen(deps.id) : null),
  component: Page,
});
function Page() {
  const citizen = Route.useLoaderData();
  return (
    <>
      <PageHeader
        title="Citizen Schemes"
        description="Scheme applications recorded for the selected citizen."
      />
      <div className="space-y-3 p-4 md:p-8">
        {!citizen ? (
          <Select />
        ) : (
          <>
            <Card className="p-4 text-sm">
              {citizen.first_name} {citizen.last_name} · {citizen.unique_id}
            </Card>
            {citizen.scheme_applications.length === 0 ? (
              <Card className="p-8 text-center text-muted-foreground">
                No scheme applications recorded.
              </Card>
            ) : (
              citizen.scheme_applications.map(
                (row: CitizenDetailRecord["scheme_applications"][number]) => (
                  <Card
                    key={row.id}
                    className="flex items-center justify-between gap-4 p-4"
                  >
                    <div>
                      <Link
                        to="/schemes/application-detail"
                        search={{ id: row.id }}
                        className="font-medium hover:text-primary"
                      >
                        {row.scheme?.name ?? row.application_number}
                      </Link>
                      <p className="text-xs text-muted-foreground">
                        {row.application_number} ·{" "}
                        {new Date(row.application_date).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant="secondary">{row.status}</Badge>
                  </Card>
                ),
              )
            )}
          </>
        )}
      </div>
    </>
  );
}
function Select() {
  return (
    <Card className="p-6 text-center">
      <p className="text-muted-foreground">
        Select a citizen from the directory to view scheme applications.
      </p>
      <Button asChild className="mt-4">
        <Link to="/citizens/list">Open citizen directory</Link>
      </Button>
    </Card>
  );
}

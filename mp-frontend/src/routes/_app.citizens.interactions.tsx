import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { fetchCitizen, type CitizenDetailRecord } from "@/lib/api";
export const Route = createFileRoute("/_app/citizens/interactions")({
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
        title="Interaction History"
        description="Recorded touchpoints for the selected citizen."
      />
      <div className="space-y-3 p-4 md:p-8">
        {!citizen ? (
          <Select />
        ) : (
          <>
            <Card className="p-4 text-sm">
              {citizen.first_name} {citizen.last_name} · {citizen.unique_id}
            </Card>
            {citizen.interactions.length === 0 ? (
              <Card className="p-8 text-center text-muted-foreground">
                No interactions recorded.
              </Card>
            ) : (
              citizen.interactions.map(
                (row: CitizenDetailRecord["interactions"][number]) => (
                  <Card key={row.id} className="p-4">
                    <div className="flex justify-between gap-4">
                      <strong>{row.subject}</strong>
                      <span className="text-xs text-muted-foreground">
                        {new Date(row.interaction_date).toLocaleString()}
                      </span>
                    </div>
                    <p className="mt-1 text-xs font-medium text-primary">
                      {row.interaction_type}
                    </p>
                    {row.description && (
                      <p className="mt-2 text-sm text-muted-foreground">
                        {row.description}
                      </p>
                    )}
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
        Select a citizen from the directory to view interactions.
      </p>
      <Button asChild className="mt-4">
        <Link to="/citizens/list">Open citizen directory</Link>
      </Button>
    </Card>
  );
}

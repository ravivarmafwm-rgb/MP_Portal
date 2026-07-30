import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { fetchCitizen, type CitizenDetailRecord } from "@/lib/api";

export const Route = createFileRoute("/_app/citizens/grievances")({
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
        title="Citizen Grievances"
        description="Complaints recorded for the selected citizen."
      />
      <div className="space-y-4 p-4 md:p-8">
        {!citizen ? (
          <SelectCitizen />
        ) : (
          <>
            <Card className="p-4 text-sm">
              {citizen.first_name} {citizen.last_name} · {citizen.unique_id}
            </Card>
            {citizen.grievances.length === 0 ? (
              <Empty label="No grievances recorded." />
            ) : (
              citizen.grievances.map(
                (g: CitizenDetailRecord["grievances"][number]) => (
                  <Card
                    key={g.id}
                    className="flex items-center justify-between gap-4 p-4"
                  >
                    <div>
                      <Link
                        to="/grievances/detail"
                        search={{ id: g.id }}
                        className="font-medium hover:text-primary"
                      >
                        {g.title}
                      </Link>
                      <p className="text-xs text-muted-foreground">
                        {g.grievance_number} ·{" "}
                        {g.category?.name ?? "Uncategorised"} ·{" "}
                        {new Date(g.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant="secondary">{g.status}</Badge>
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
function SelectCitizen() {
  return (
    <Card className="p-6 text-center">
      <p className="text-muted-foreground">
        Select a citizen from the directory to view grievances.
      </p>
      <Button asChild className="mt-4">
        <Link to="/citizens/list">Open citizen directory</Link>
      </Button>
    </Card>
  );
}
function Empty({ label }: { label: string }) {
  return <Card className="p-8 text-center text-muted-foreground">{label}</Card>;
}

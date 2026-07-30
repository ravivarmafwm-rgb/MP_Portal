import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { fetchCitizen, type CitizenDetailRecord } from "@/lib/api";
export const Route = createFileRoute("/_app/citizens/documents")({
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
        title="Citizen Documents"
        description="Secure documents associated with the selected citizen."
      />
      <div className="space-y-3 p-4 md:p-8">
        {!citizen ? (
          <Card className="p-6 text-center">
            <p className="text-muted-foreground">
              Select a citizen from the directory to view documents.
            </p>
            <Button asChild className="mt-4">
              <Link to="/citizens/list">Open citizen directory</Link>
            </Button>
          </Card>
        ) : (
          <>
            <Card className="p-4 text-sm">
              {citizen.first_name} {citizen.last_name} · {citizen.unique_id}
            </Card>
            {citizen.documents.length === 0 ? (
              <Card className="p-8 text-center text-muted-foreground">
                No documents recorded.
              </Card>
            ) : (
              citizen.documents.map(
                (row: CitizenDetailRecord["documents"][number]) => (
                  <Card
                    key={row.id}
                    className="flex items-center justify-between gap-4 p-4"
                  >
                    <div>
                      <strong>{row.title}</strong>
                      <p className="text-xs text-muted-foreground">
                        {row.original_name} ·{" "}
                        {new Date(row.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant="outline">
                      {row.category?.name ?? row.mime_type}
                    </Badge>
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

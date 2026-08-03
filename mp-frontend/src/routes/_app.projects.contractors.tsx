import { createFileRoute } from "@tanstack/react-router";
import { Building2, Download, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { fetchProjects, type ProjectRecord } from "@/lib/api";

export const Route = createFileRoute("/_app/projects/contractors")({
  head: () => ({ meta: [{ title: "Contractor Management" }] }),
  component: ContractorsPage,
  loader: () => fetchProjects({ per_page: 100 }),
});

function ContractorsPage() {
  const projectResponse = Route.useLoaderData();
  const [search, setSearch] = useState("");
  const contractors = useMemo(() => {
    const projects = projectResponse.data ?? [];
    const grouped = new Map<
      string,
      {
        id: string;
        name: string;
        assigned: number;
        completed: number;
        budget: number;
      }
    >();
    projects.forEach((project: ProjectRecord) => {
      if (!project.contractor?.id || !project.contractor.name) return;
      const current = grouped.get(project.contractor.id) ?? {
        id: project.contractor.id,
        name: project.contractor.name,
        assigned: 0,
        completed: 0,
        budget: 0,
      };
      current.assigned += 1;
      if (project.status === "completed") current.completed += 1;
      current.budget += Number(project.sanctioned_amount ?? 0);
      grouped.set(project.contractor.id, current);
    });
    return [...grouped.values()].filter((contractor) =>
      contractor.name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [projectResponse.data, search]);

  return (
    <>
      <PageHeader
        title="Contractor Management"
        description="Contractors linked to projects in your authorized geography."
        actions={
          <Button asChild variant="outline" size="sm">
            <a href="/api/projects/financial-export" download>
              <Download className="mr-1.5 h-4 w-4" /> Export project report
            </a>
          </Button>
        }
      />
      <div className="space-y-6 p-4 md:p-8">
        <Card className="overflow-hidden">
          <div className="flex flex-wrap items-center gap-2 border-b border-border/70 bg-muted/30 p-3">
            <div className="relative min-w-[240px] flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search contractors"
                className="h-9 bg-background pl-9"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead className="bg-muted/30 text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="p-3 text-left">Contractor</th>
                  <th className="p-3 text-left">Projects</th>
                  <th className="p-3 text-left">Completion</th>
                  <th className="p-3 text-right">Sanctioned value</th>
                </tr>
              </thead>
              <tbody>
                {contractors.map((contractor) => {
                  const completion = contractor.assigned
                    ? (contractor.completed / contractor.assigned) * 100
                    : 0;
                  return (
                    <tr key={contractor.id} className="border-t">
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-primary" />
                          <span className="font-medium">{contractor.name}</span>
                        </div>
                      </td>
                      <td className="p-3">{contractor.assigned}</td>
                      <td className="p-3">
                        <Badge variant="secondary">
                          {completion.toFixed(0)}%
                        </Badge>
                      </td>
                      <td className="p-3 text-right">
                        ₹{contractor.budget.toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {contractors.length === 0 && (
              <p className="py-10 text-center text-sm text-muted-foreground">
                No contractors are linked to projects in your scope.
              </p>
            )}
          </div>
        </Card>
      </div>
    </>
  );
}

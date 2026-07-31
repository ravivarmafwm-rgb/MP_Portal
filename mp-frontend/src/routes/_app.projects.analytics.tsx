import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { BarChart3, Download, TrendingUp } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  fetchProjectBudgetSummary,
  fetchProjectStats,
  fetchProjects,
} from "@/lib/api";

export const Route = createFileRoute("/_app/projects/analytics")({
  head: () => ({ meta: [{ title: "Project Analytics Center" }] }),
  component: AnalyticsPage,
  loader: async () => {
    const [projects, stats, budget] = await Promise.all([
      fetchProjects({ per_page: 100 }),
      fetchProjectStats(),
      fetchProjectBudgetSummary(),
    ]);
    return { projects, stats, budget };
  },
});

function AnalyticsPage() {
  const { projects, stats, budget } = Route.useLoaderData();
  const projectRows = projects.data ?? [];
  const statusBreakdown = useMemo(() => {
    const counts = new Map<string, number>();
    (projects.data ?? []).forEach((project) =>
      counts.set(project.status, (counts.get(project.status) ?? 0) + 1),
    );
    return [...counts.entries()].sort((a, b) => b[1] - a[1]);
  }, [projects.data]);
  const utilization =
    budget.allocated > 0
      ? Math.min((budget.utilized / budget.allocated) * 100, 100)
      : 0;

  return (
    <>
      <PageHeader
        title="Project Analytics Center"
        description="Live project, budget and status metrics for your authorized geography."
        actions={
          <Button asChild variant="outline" size="sm">
            <a href="/api/projects/financial-export" download>
              <Download className="mr-1.5 h-4 w-4" /> Export financial report
            </a>
          </Button>
        }
      />
      <div className="space-y-6 p-4 md:p-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Total projects", stats.total ?? 0],
            ["Completed", stats.completed ?? 0],
            ["In progress", stats.in_progress ?? 0],
            ["Proposed", stats.proposed ?? 0],
          ].map(([label, value]) => (
            <Card key={String(label)} className="p-5">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {label}
              </p>
              <p className="mt-2 text-3xl font-bold tabular-nums">
                {Number(value).toLocaleString()}
              </p>
            </Card>
          ))}
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          <Card className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="flex items-center gap-2 font-display text-base font-bold">
                  <TrendingUp className="h-4 w-4 text-primary" /> Budget
                  utilization
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  Live totals from project budgets and expenditure.
                </p>
              </div>
              <Badge variant="secondary">{utilization.toFixed(1)}%</Badge>
            </div>
            <Progress value={utilization} className="mt-6 h-3" />
            <div className="mt-3 grid grid-cols-3 gap-3 text-sm">
              <div>
                <p className="text-xs text-muted-foreground">Allocated</p>
                <p className="font-semibold">
                  ₹{Number(budget.allocated ?? 0).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Utilized</p>
                <p className="font-semibold">
                  ₹{Number(budget.utilized ?? 0).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Balance</p>
                <p className="font-semibold">
                  ₹{Number(budget.balance ?? 0).toLocaleString()}
                </p>
              </div>
            </div>
          </Card>
          <Card className="p-5">
            <h3 className="flex items-center gap-2 font-display text-base font-bold">
              <BarChart3 className="h-4 w-4 text-primary" /> Project status
            </h3>
            <div className="mt-4 space-y-3">
              {statusBreakdown.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  No projects are available in your scope.
                </p>
              ) : (
                statusBreakdown.map(([status, count]) => (
                  <div
                    key={status}
                    className="flex items-center justify-between rounded-lg border p-3 text-sm"
                  >
                    <span className="capitalize">
                      {status.replaceAll("_", " ")}
                    </span>
                    <Badge variant="secondary">{count}</Badge>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
        <Card className="p-5">
          <h3 className="font-display text-base font-bold">
            Projects in scope
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            The latest records returned by the project API.
          </p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="border-b text-left text-xs text-muted-foreground">
                  <th className="p-2">Project</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">Progress</th>
                  <th className="p-2 text-right">Expenditure</th>
                </tr>
              </thead>
              <tbody>
                {projectRows.map((project) => (
                  <tr key={project.id} className="border-b last:border-0">
                    <td className="p-2 font-medium">{project.name}</td>
                    <td className="p-2 capitalize">
                      {project.status.replaceAll("_", " ")}
                    </td>
                    <td className="p-2">{project.progress_percentage ?? 0}%</td>
                    <td className="p-2 text-right">
                      ₹{Number(project.expenditure ?? 0).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {projectRows.length === 0 && (
              <p className="py-8 text-center text-sm text-muted-foreground">
                No projects are available in your scope.
              </p>
            )}
          </div>
        </Card>
      </div>
    </>
  );
}

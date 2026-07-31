import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Download, IndianRupee, Wallet, Clock, Activity } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  fetchProjectStats,
  fetchProjects,
  fetchProjectBudgetSummary,
  downloadProjectFinancialExport,
} from "@/lib/api";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/projects/mplads")({
  component: MpladsPage,
});

function MpladsPage() {
  const stats = useQuery({
    queryKey: ["project-stats-mplads"],
    queryFn: fetchProjectStats,
  });
  const projects = useQuery({
    queryKey: ["projects-mplads-list"],
    queryFn: () => fetchProjects({ per_page: 12 }),
  });
  const summary = useQuery({
    queryKey: ["project-budget-summary-mplads"],
    queryFn: fetchProjectBudgetSummary,
  });
  const exportStatement = async () => {
    try {
      const blob = await downloadProjectFinancialExport();
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = "mplads-financial-report.csv";
      anchor.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to export statement",
      );
    }
  };
  const allocated = summary.data?.allocated ?? stats.data?.total_budget ?? 0;
  const utilized = summary.data?.utilized ?? stats.data?.total_spent ?? 0;
  const utilization =
    allocated > 0 ? Math.min(100, (utilized / allocated) * 100) : 0;
  const kpis = [
    ["Budget Allocated", allocated, IndianRupee],
    ["Budget Utilized", utilized, Wallet],
    ["Balance", allocated - utilized, Clock],
    ["Active Projects", stats.data?.in_progress ?? 0, Activity],
  ] as const;
  return (
    <>
      <PageHeader
        title="MPLADS Management Center"
        description="Live allocations, releases and utilisation across projects."
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={exportStatement}>
              <Download className="mr-1 h-4 w-4" />
              MPLADS Statement
            </Button>
            <Button asChild size="sm">
              <Link to="/projects/budget-monitoring">Manage Allocations</Link>
            </Button>
          </div>
        }
      />
      <div className="space-y-6 p-4 md:p-8">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {kpis.map(([label, value, Icon]) => (
            <Card key={label} className="p-5">
              <Icon className="h-5 w-5 text-primary" />
              <div className="mt-3 text-[11px] uppercase tracking-wider text-muted-foreground">
                {label}
              </div>
              <div className="mt-1 text-2xl font-bold tabular-nums">
                {label === "Active Projects"
                  ? value
                  : `₹${Number(value).toLocaleString("en-IN")}`}
              </div>
            </Card>
          ))}
        </div>
        <Card className="p-5">
          <h3 className="font-semibold">Allocation utilization</h3>
          <div className="mt-3 flex justify-between text-sm">
            <span>Utilized</span>
            <span>{utilization.toFixed(1)}%</span>
          </div>
          <Progress value={utilization} className="mt-2" />
          <p className="mt-2 text-xs text-muted-foreground">
            {summary.data?.budget_heads ?? 0} budget heads ·{" "}
            {summary.data?.projects ?? 0} projects · release balance ₹
            {Number(summary.data?.release_balance ?? 0).toLocaleString("en-IN")}
          </p>
        </Card>
        <Card className="p-5">
          <h3 className="font-semibold">Projects</h3>
          {projects.isLoading ? (
            <div className="mt-4 space-y-2">
              <Skeleton className="h-14" />
              <Skeleton className="h-14" />
            </div>
          ) : (
            <div className="mt-3 divide-y">
              {(projects.data?.data ?? []).map((p) => (
                <Link
                  key={p.id}
                  to="/projects/project-detail"
                  search={{ id: p.id }}
                  className="flex items-center justify-between py-3 text-sm hover:text-primary"
                >
                  <span>
                    {p.project_number} · {p.name}
                  </span>
                  <span>{Number(p.progress_percentage ?? 0).toFixed(0)}%</span>
                </Link>
              ))}
              {!projects.data?.data.length && (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  No projects found.
                </p>
              )}
            </div>
          )}
        </Card>
      </div>
    </>
  );
}

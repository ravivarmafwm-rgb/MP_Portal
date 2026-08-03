import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Download, IndianRupee, Wallet, TrendingDown, type LucideIcon } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  fetchProjectBudgetSummary,
  fetchProjects,
  downloadProjectBudgetExport,
  downloadProjectFinancialExport,
} from "@/lib/api";
import { toast } from "sonner";
export const Route = createFileRoute("/_app/projects/budget-monitoring")({
  component: BudgetMonitoring,
});
function saveBlob(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}
function BudgetMonitoring() {
  const summary = useQuery({
    queryKey: ["project-budget-summary"],
    queryFn: fetchProjectBudgetSummary,
  });
  const projects = useQuery({
    queryKey: ["project-budget-projects"],
    queryFn: () => fetchProjects({ per_page: 50 }),
  });
  const busy = summary.isLoading || projects.isLoading;
  const s = summary.data;
  const utilization =
    s && s.allocated > 0 ? (s.utilized / s.allocated) * 100 : 0;
  const exportCsv = async (kind: "budget" | "financial") => {
    try {
      saveBlob(
        await (kind === "budget"
          ? downloadProjectBudgetExport()
          : downloadProjectFinancialExport()),
        `${kind}-export.csv`,
      );
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Export failed");
    }
  };
  return (
    <>
      <PageHeader
        title="Budget Monitoring Center"
        description="Live MPLADS allocations, releases, expenditure and balances."
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => exportCsv("budget")}>
              <Download className="mr-1 h-4 w-4" />
              Budget CSV
            </Button>
            <Button variant="outline" onClick={() => exportCsv("financial")}>
              <Download className="mr-1 h-4 w-4" />
              Financial CSV
            </Button>
          </div>
        }
      />
      <div className="space-y-5 p-4 md:p-8">
        {busy ? (
          <div className="grid gap-3 md:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-28" />
            ))}
          </div>
        ) : (
          <>
            <div className="grid gap-3 md:grid-cols-4">
              {([
                ["Allocated", s?.allocated, IndianRupee],
                ["Utilized", s?.utilized, Wallet],
                ["Released", s?.released, TrendingDown],
                ["Balance", s?.balance, IndianRupee],
              ] as Array<[string, number | undefined, LucideIcon]>).map(([label, value, Icon]) => (
                <Card key={String(label)} className="p-5">
                  <Icon className="h-5 w-5 text-primary" />
                  <div className="mt-2 text-xs text-muted-foreground">
                    {label}
                  </div>
                  <div className="text-2xl font-bold">
                    ₹{Number(value ?? 0).toLocaleString("en-IN")}
                  </div>
                </Card>
              ))}
            </div>
            <Card className="p-5">
              <div className="flex justify-between text-sm">
                <span>Budget utilization</span>
                <span>{utilization.toFixed(1)}%</span>
              </div>
              <Progress value={utilization} className="mt-2" />
              <div className="mt-2 text-xs text-muted-foreground">
                {s?.budget_heads ?? 0} budget heads across {s?.projects ?? 0}{" "}
                projects · release balance ₹
                {Number(s?.release_balance ?? 0).toLocaleString("en-IN")}
              </div>
            </Card>
            <Card className="p-5">
              <h2 className="font-semibold">Projects</h2>
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
                    <span>
                      ₹{Number(p.expenditure ?? 0).toLocaleString("en-IN")} ·{" "}
                      {Number(p.progress_percentage ?? 0).toFixed(0)}%
                    </span>
                  </Link>
                ))}
                {!projects.data?.data.length && (
                  <p className="py-8 text-center text-sm text-muted-foreground">
                    No projects found.
                  </p>
                )}
              </div>
            </Card>
          </>
        )}
      </div>
    </>
  );
}

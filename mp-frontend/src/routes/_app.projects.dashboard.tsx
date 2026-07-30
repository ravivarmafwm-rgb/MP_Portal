import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  HardHat,
  CheckCircle2,
  AlertTriangle,
  Clock,
  DollarSign,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchProjectStats, fetchProjects } from "@/lib/api";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/projects/dashboard")({
  head: () => ({ meta: [{ title: "Projects — Command Center" }] }),
  component: ProjectsDashboardPage,
});

function ProjectsDashboardPage() {
  const { data: stats } = useQuery({
    queryKey: ["project-stats"],
    queryFn: fetchProjectStats,
    staleTime: 60_000,
  });
  const { data: projectsData, isLoading } = useQuery({
    queryKey: ["projects-list"],
    queryFn: () => fetchProjects({ per_page: 10 }),
    staleTime: 30_000,
  });
  const projects = projectsData?.data ?? [];

  const statusTone: Record<string, string> = {
    in_progress: "bg-primary/10 text-primary",
    completed: "bg-success/10 text-success",
    delayed: "bg-warning/15 text-warning",
    proposed: "bg-muted text-muted-foreground",
  };

  const kpis = [
    {
      label: "Total Projects",
      value: stats?.total ?? 0,
      icon: HardHat,
      tone: "bg-primary/10 text-primary",
    },
    {
      label: "In Progress",
      value: stats?.in_progress ?? 0,
      icon: Clock,
      tone: "bg-info/10 text-info",
    },
    {
      label: "Completed",
      value: stats?.completed ?? 0,
      icon: CheckCircle2,
      tone: "bg-success/10 text-success",
    },
    {
      label: "Delayed",
      value: stats?.delayed ?? 0,
      icon: AlertTriangle,
      tone: "bg-warning/15 text-warning",
    },
  ];

  return (
    <>
      <PageHeader
        title="Project Command Center"
        description="MPLADS and development projects across the constituency"
      />
      <div className="space-y-6 p-4 md:p-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {kpis.map((k, i) => (
            <motion.div
              key={k.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <Card className="p-5">
                <div
                  className={cn(
                    "grid h-10 w-10 place-items-center rounded-xl",
                    k.tone,
                  )}
                >
                  <k.icon className="h-5 w-5" />
                </div>
                <div className="mt-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {k.label}
                </div>
                <div className="mt-1 font-display text-3xl font-bold tabular-nums">
                  {k.value}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {stats && (
          <div className="grid gap-4 sm:grid-cols-2">
            <Card className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <DollarSign className="h-4 w-4 text-primary" />
                <h3 className="font-semibold">Budget Overview</h3>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Total Sanctioned
                  </span>
                  <span className="font-semibold">
                    ₹{(stats.total_budget / 10000000).toFixed(1)} Cr
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Spent</span>
                  <span className="font-semibold text-primary">
                    ₹{(stats.total_spent / 10000000).toFixed(1)} Cr
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted mt-2">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{
                      width:
                        stats.total_budget > 0
                          ? `${Math.round((stats.total_spent / stats.total_budget) * 100)}%`
                          : "0%",
                    }}
                  />
                </div>
                <div className="text-xs text-muted-foreground text-right">
                  {stats.total_budget > 0
                    ? Math.round((stats.total_spent / stats.total_budget) * 100)
                    : 0}
                  % utilized
                </div>
              </div>
            </Card>
          </div>
        )}

        <Card className="overflow-hidden">
          <div className="border-b border-border/70 bg-muted/30 p-4">
            <h3 className="font-semibold">Recent Projects</h3>
          </div>
          {isLoading ? (
            <div className="space-y-2 p-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : (
            <div className="divide-y divide-border/60">
              {projects.map((p: Record<string, unknown>, i: number) => (
                <motion.div
                  key={String(p.id)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.02 }}
                  className="flex items-center gap-4 p-4 hover:bg-muted/30"
                >
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold truncate">
                      {String(p.name ?? "")}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {String(p.project_type ?? "—")} ·{" "}
                      {String(p.location ?? "—")}
                    </div>
                  </div>
                  <div className="text-right text-sm">
                    <div className="font-semibold">
                      {Number(p.progress_percentage ?? 0).toFixed(0)}%
                    </div>
                    <div className="text-xs text-muted-foreground">
                      complete
                    </div>
                  </div>
                  <Badge
                    variant="secondary"
                    className={
                      statusTone[String(p.status ?? "proposed")] ?? "bg-muted"
                    }
                  >
                    {String(p.status ?? "").replace("_", " ")}
                  </Badge>
                </motion.div>
              ))}
              {projects.length === 0 && (
                <div className="p-8 text-center text-sm text-muted-foreground">
                  No projects found.
                </div>
              )}
            </div>
          )}
        </Card>
      </div>
    </>
  );
}

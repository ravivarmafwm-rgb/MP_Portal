import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Activity, AlertTriangle, Clock, Target, Download } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { fetchProjects, fetchProjectStats } from "@/lib/api";
import type { ProjectRecord } from "@/lib/api";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/projects/progress-tracker")({
  head: () => ({
    meta: [
      { title: "Project Progress Tracker" },
      {
        name: "description",
        content: "Gantt-style tracker for in-flight constituency projects.",
      },
    ],
  }),
  component: ProgressTracker,
  loader: async () => {
    const [projects, stats] = await Promise.all([
      fetchProjects(),
      fetchProjectStats(),
    ]);
    return { projects, stats };
  },
});

const stageGroups = [
  "Planned",
  "Approved",
  "Tender Released",
  "Work Started",
  "In Progress",
  "Completed",
  "Delayed",
] as const;

function ProgressTracker() {
  const { projects, stats } = Route.useLoaderData();
  const inflight = (projects.data || [])
    .filter((p: ProjectRecord) =>
      ["In Progress", "Work Started", "Delayed"].includes(p.status),
    )
    .slice(0, 14);
  const delayed = (projects.data || [])
    .filter((p: ProjectRecord) => p.status === "Delayed")
    .slice(0, 6);
  return (
    <>
      <PageHeader
        title="Project Progress Tracker"
        description="Monitor execution velocity, milestones and slipping projects."
        actions={
          <Button variant="outline" size="sm" className="gap-1.5">
            <Download className="h-4 w-4" /> Tracker Report
          </Button>
        }
      />
      <div className="space-y-6 p-4 md:p-8">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            {
              l: "In Execution",
              v: stats.in_progress || 0,
              icon: Activity,
              tone: "bg-primary/10 text-primary",
            },
            {
              l: "Delayed Projects",
              v: stats.delayed || 0,
              icon: AlertTriangle,
              tone: "bg-destructive/10 text-destructive",
            },
            {
              l: "Completed",
              v: stats.completed || 0,
              icon: Clock,
              tone: "bg-warning/15 text-warning",
            },
            {
              l: "Proposed",
              v: stats.proposed || 0,
              icon: Target,
              tone: "bg-info/10 text-info",
            },
          ].map((k) => (
            <Card key={k.l} className="p-5">
              <div
                className={cn(
                  "grid h-10 w-10 place-items-center rounded-lg",
                  k.tone,
                )}
              >
                <k.icon className="h-5 w-5" />
              </div>
              <div className="mt-3 text-[11px] uppercase tracking-wider text-muted-foreground">
                {k.l}
              </div>
              <div className="mt-1 font-display text-2xl font-bold tabular-nums">
                {k.v}
              </div>
            </Card>
          ))}
        </div>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-base font-bold">
              Pipeline by Stage
            </h3>
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              Live
            </Badge>
          </div>
          <div className="mt-4 grid gap-2 md:grid-cols-7">
            {stageGroups.map((s, i) => {
              const count = (projects.data || []).filter(
                (p: ProjectRecord) => p.status === s,
              ).length;
              return (
                <motion.div
                  key={s}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="rounded-xl border border-border/70 bg-card p-3 text-center"
                >
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    {s}
                  </div>
                  <div className="mt-1 font-display text-xl font-bold tabular-nums">
                    {count}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="font-display text-base font-bold">
            Gantt View · Active Projects
          </h3>
          <div className="mt-4 space-y-2">
            <div className="grid grid-cols-[200px_repeat(12,1fr)] gap-1 text-[10px] uppercase tracking-wider text-muted-foreground">
              <div></div>
              {[
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec",
              ].map((m) => (
                <div key={m} className="text-center">
                  {m}
                </div>
              ))}
            </div>
            {inflight.map((p: ProjectRecord, i: number) => {
              const startDate = p.start_date ? new Date(p.start_date) : null;
              const endDate = p.expected_completion_date
                ? new Date(p.expected_completion_date)
                : null;
              const startMonth =
                startDate && !Number.isNaN(startDate.getTime())
                  ? startDate.getMonth()
                  : 0;
              const span =
                endDate && startDate && endDate >= startDate
                  ? Math.max(1, endDate.getMonth() - startMonth + 1)
                  : 1;
              const isLate = p.status === "Delayed";
              return (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="grid grid-cols-[200px_repeat(12,1fr)] items-center gap-1"
                >
                  <Link
                    to="/projects/project-detail"
                    search={{ id: p.id }}
                    className="truncate text-xs font-medium hover:text-primary"
                  >
                    {p.name}
                  </Link>
                  {Array.from({ length: 12 }).map((_, idx) => {
                    const inSpan = idx >= startMonth && idx < startMonth + span;
                    return (
                      <div
                        key={idx}
                        className={cn(
                          "h-5 rounded",
                          inSpan
                            ? isLate
                              ? "bg-gradient-to-r from-warning to-destructive"
                              : "bg-gradient-to-r from-primary to-info"
                            : "bg-muted/40",
                        )}
                      />
                    );
                  })}
                </motion.div>
              );
            })}
          </div>
        </Card>

        <Card className="border-destructive/30 p-5">
          <h3 className="font-display text-base font-bold">
            Slipping Projects · Needs Action
          </h3>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {delayed.map((p: ProjectRecord) => (
              <Link
                key={p.id}
                to="/projects/project-detail"
                search={{ id: p.id }}
                className="flex items-center gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-3"
              >
                <AlertTriangle className="h-4 w-4 text-destructive" />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold">{p.name}</div>
                  <div className="text-[11px] text-muted-foreground">
                    {p.id} · {p.contractor?.name || "N/A"}
                  </div>
                </div>
                <Badge
                  variant="secondary"
                  className="bg-destructive/10 text-destructive"
                >
                  {p.completion_percentage || 0}%
                </Badge>
              </Link>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}

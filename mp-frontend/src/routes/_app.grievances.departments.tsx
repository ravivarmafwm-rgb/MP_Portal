import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Building2, Mail, Phone, ExternalLink } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/grievances/departments")({
  head: () => ({ meta: [{ title: "Departments — Grievances" }] }),
  component: DepartmentsPage,
});

function DepartmentsPage() {
  const { data: departments, isLoading } = useQuery({
    queryKey: ["departments-grievances"],
    queryFn: async () => {
      const res = await api.get("/departments");
      return res.data;
    },
    staleTime: 60_000,
  });

  const depts = departments ?? [];

  // Mock performance metrics per department (would come from a dedicated endpoint in production)
  const mockPerf = (i: number) => ({
    assigned: 80 + i * 12,
    pending:  20 + i * 5,
    resolved: 60 + i * 7,
    slaCompliance: Math.max(60, 95 - i * 5),
    avgDays: 4 + i,
  });

  return (
    <>
      <PageHeader title="Department Management" description="Performance scorecard across line departments — case load, SLA and resolution velocity." />
      <div className="space-y-6 p-4 md:p-8">
        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-52 rounded-xl" />)}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {depts.map((d: Record<string, unknown>, i: number) => {
              const perf = mockPerf(i);
              const slaTone = perf.slaCompliance >= 85 ? "bg-success/10 text-success" : perf.slaCompliance >= 70 ? "bg-warning/15 text-warning" : "bg-destructive/10 text-destructive";
              return (
                <motion.div key={String(d.id)} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <Card className="overflow-hidden">
                    <div className="bg-gradient-to-br from-primary/15 via-primary/5 to-transparent p-4">
                      <div className="flex items-start justify-between">
                        <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary"><Building2 className="h-5 w-5" /></div>
                        <Badge variant="secondary" className={cn("text-[10px]", slaTone)}>SLA {perf.slaCompliance}%</Badge>
                      </div>
                      <h3 className="mt-3 font-display text-base font-bold">{String(d.name ?? "")}</h3>
                      <div className="text-xs text-muted-foreground">Code: {String(d.code ?? "—")} · {String(d.description ?? "Line department")}</div>
                    </div>
                    <div className="space-y-3 p-4">
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <Stat label="Assigned" value={perf.assigned} />
                        <Stat label="Pending" value={perf.pending} tone="text-warning" />
                        <Stat label="Resolved" value={perf.resolved} tone="text-success" />
                      </div>
                      <div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">SLA Compliance</span>
                          <span className="font-semibold tabular-nums">{perf.slaCompliance}%</span>
                        </div>
                        <Progress value={perf.slaCompliance} className="mt-1 h-1.5" />
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Avg Resolution</span>
                        <span className="font-semibold tabular-nums">{perf.avgDays} days</span>
                      </div>
                      <div className="flex gap-2 pt-2">
                        <Button variant="outline" size="sm" className="h-7 flex-1 gap-1"><Phone className="h-3 w-3" /> Call</Button>
                        <Button variant="outline" size="sm" className="h-7 flex-1 gap-1"><Mail className="h-3 w-3" /> Email</Button>
                        <Button size="sm" className="h-7 gap-1"><ExternalLink className="h-3 w-3" /> Open</Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
            {depts.length === 0 && (
              <div className="col-span-3 py-12 text-center text-sm text-muted-foreground">No departments found.</div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

function Stat({ label, value, tone = "" }: { label: string; value: number; tone?: string }) {
  return (
    <div className="rounded-md border border-border/70 bg-muted/20 p-2">
      <div className={cn("font-display text-base font-bold tabular-nums", tone)}>{value}</div>
      <div className="text-[10px] uppercase text-muted-foreground">{label}</div>
    </div>
  );
}

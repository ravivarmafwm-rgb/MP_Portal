import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { MessageSquareWarning, CheckCircle2, AlertTriangle, Clock, TrendingDown, Plus } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { fetchGrievanceStats, fetchGrievanceCategories } from "@/lib/api";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/grievances/dashboard")({
  head: () => ({ meta: [{ title: "Grievance Command Center" }] }),
  component: GrievanceDashboard,
});

const trendFallback = [
  { d: "Mon", filed: 28, resolved: 22 }, { d: "Tue", filed: 35, resolved: 30 },
  { d: "Wed", filed: 42, resolved: 33 }, { d: "Thu", filed: 38, resolved: 40 },
  { d: "Fri", filed: 51, resolved: 45 }, { d: "Sat", filed: 33, resolved: 38 },
  { d: "Sun", filed: 27, resolved: 30 },
];

function GrievanceDashboard() {
  const { data: stats, isLoading: statsLoading } = useQuery({ queryKey: ["grievance-stats"], queryFn: fetchGrievanceStats, staleTime: 30_000 });
  const { data: categories } = useQuery({ queryKey: ["grievance-categories"], queryFn: fetchGrievanceCategories, staleTime: 60_000 });

  const kpis = [
    { label: "Total",      value: stats?.total     ?? 0, icon: MessageSquareWarning, tone: "bg-primary/10 text-primary",    bgTone: "from-primary/10" },
    { label: "Pending",    value: stats?.pending    ?? 0, icon: Clock,                tone: "bg-destructive/10 text-destructive", bgTone: "from-destructive/10" },
    { label: "Assigned",   value: stats?.assigned   ?? 0, icon: TrendingDown,         tone: "bg-info/10 text-info",          bgTone: "from-info/10" },
    { label: "Escalated",  value: stats?.escalated  ?? 0, icon: AlertTriangle,        tone: "bg-warning/15 text-warning",    bgTone: "from-warning/10" },
    { label: "Resolved",   value: stats?.resolved   ?? 0, icon: CheckCircle2,         tone: "bg-success/10 text-success",    bgTone: "from-success/10" },
  ];

  return (
    <>
      <PageHeader
        title="Grievance Command Center"
        description="Live case monitoring, SLA tracking and escalation management"
        actions={
          <>
            <Button asChild size="sm" className="gap-1.5"><Link to="/grievances/list"><Plus className="h-4 w-4" />New Grievance</Link></Button>
          </>
        }
      />
      <div className="space-y-6 p-4 md:p-8">
        {statsLoading ? (
          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-5">{Array.from({length:5}).map((_,i)=><Skeleton key={i} className="h-28 rounded-xl"/>)}</div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {kpis.map((k, i) => (
              <motion.div key={k.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                <Card className="overflow-hidden p-5 shadow-card">
                  <div className={cn("grid h-10 w-10 place-items-center rounded-xl", k.tone)}><k.icon className="h-5 w-5" /></div>
                  <div className="mt-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">{k.label}</div>
                  <div className="mt-1 font-display text-3xl font-bold tabular-nums">{k.value.toLocaleString()}</div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <Card className="p-6">
            <h3 className="text-h3 font-bold mb-4">Weekly Trend</h3>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendFallback} margin={{ top: 5, right: 8, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gF2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.45} />
                      <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gR2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-success)" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="var(--color-success)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="d" stroke="var(--color-muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--color-muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 12 }} />
                  <Area type="monotone" dataKey="filed" stroke="var(--color-primary)" strokeWidth={2} fill="url(#gF2)" name="Filed" />
                  <Area type="monotone" dataKey="resolved" stroke="var(--color-success)" strokeWidth={2} fill="url(#gR2)" name="Resolved" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-h3 font-bold mb-4">By Category</h3>
            <div className="space-y-3">
              {(categories ?? []).slice(0, 8).map((c: Record<string, unknown>, i: number) => {
                const maxCount = Math.max(...(categories ?? []).map((x: Record<string, unknown>) => Number(x.grievances_count ?? 0)));
                const pct = maxCount > 0 ? Math.round((Number(c.grievances_count ?? 0) / maxCount) * 100) : 0;
                return (
                  <div key={String(c.id)} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium">{String(c.name ?? "")}</span>
                      <span className="text-muted-foreground tabular-nums">{String(c.grievances_count ?? 0)}</span>
                    </div>
                    <motion.div className="h-1.5 overflow-hidden rounded-full bg-muted" initial={{ width: "100%" }}>
                      <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.7, delay: i * 0.04 }}
                        className="h-full rounded-full bg-primary" />
                    </motion.div>
                  </div>
                );
              })}
              {(!categories || categories.length === 0) && <p className="text-sm text-muted-foreground">Loading categories…</p>}
            </div>
          </Card>
        </div>

        <div className="flex justify-end">
          <Button asChild variant="outline"><Link to="/grievances/list">View All Grievances →</Link></Button>
        </div>
      </div>
    </>
  );
}

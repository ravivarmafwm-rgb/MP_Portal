import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { BarChart3, TrendingUp, Building2 } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  fetchGrievanceAnalytics,
  fetchGrievanceStats,
  fetchGrievanceCategories,
} from "@/lib/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from "recharts";

export const Route = createFileRoute("/_app/grievances/analytics")({
  head: () => ({ meta: [{ title: "Analytics — Grievances" }] }),
  component: AnalyticsPage,
});

function AnalyticsPage() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["grievance-stats-analytics"],
    queryFn: fetchGrievanceStats,
    staleTime: 30_000,
  });
  const { data: cats, isLoading: catsLoading } = useQuery({
    queryKey: ["grievance-cats-analytics"],
    queryFn: fetchGrievanceCategories,
    staleTime: 60_000,
  });
  const { data: analytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ["grievance-analytics"],
    queryFn: fetchGrievanceAnalytics,
    staleTime: 30_000,
  });

  const categories = cats ?? [];
  const total = stats?.total ?? 0;
  const weeklyTrend = analytics?.weekly_trend ?? [];
  const assemblyStats = analytics?.assembly ?? [];
  const deptStats = analytics?.departments ?? [];

  return (
    <>
      <PageHeader
        title="Analytics Center"
        description="Executive insight across complaint geography, departments and trends."
      />
      <div className="space-y-6 p-4 md:p-8">
        {/* Summary */}
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
          {[
            { l: "Total", v: stats?.total ?? 0, tone: "text-foreground" },
            { l: "Pending", v: stats?.pending ?? 0, tone: "text-destructive" },
            { l: "Assigned", v: stats?.assigned ?? 0, tone: "text-info" },
            { l: "Escalated", v: stats?.escalated ?? 0, tone: "text-warning" },
            { l: "Resolved", v: stats?.resolved ?? 0, tone: "text-success" },
            { l: "This Week", v: stats?.this_week ?? 0, tone: "text-primary" },
          ].map((s) => (
            <Card key={s.l} className="p-3 text-center">
              <div
                className={`font-display text-2xl font-bold tabular-nums ${s.tone}`}
              >
                {s.v}
              </div>
              <div className="text-xs text-muted-foreground">{s.l}</div>
            </Card>
          ))}
        </div>

        {/* Category bar chart */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-display text-base font-bold">
                Complaints By Category
              </h3>
              <p className="text-xs text-muted-foreground">
                Volume across all categories
              </p>
            </div>
            <Badge
              variant="secondary"
              className="gap-1 bg-primary/10 text-primary"
            >
              <BarChart3 className="h-3 w-3" /> {total} total
            </Badge>
          </div>
          {catsLoading ? (
            <Skeleton className="h-48" />
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart
                data={categories.map((c: Record<string, unknown>) => ({
                  name: String(c.name ?? "").substring(0, 8),
                  value: Number(c.grievances_count ?? 0),
                }))}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                <Bar
                  dataKey="value"
                  fill="hsl(var(--primary))"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>

        {/* Weekly trend + Assembly breakdown */}
        <div className="grid gap-4 lg:grid-cols-2">
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-display text-base font-bold">
                  Resolution Trend
                </h3>
                <p className="text-xs text-muted-foreground">
                  Weekly submitted vs. resolved
                </p>
              </div>
              <Badge
                variant="secondary"
                className="gap-1 bg-success/10 text-success"
              >
                <TrendingUp className="h-3 w-3" /> Improving
              </Badge>
            </div>
            {statsLoading || analyticsLoading ? (
              <Skeleton className="h-48" />
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={weeklyTrend}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--border))"
                  />
                  <XAxis dataKey="week" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="submitted"
                    stroke="hsl(var(--primary)/0.6)"
                    strokeWidth={2}
                    dot={false}
                    name="Submitted"
                  />
                  <Line
                    type="monotone"
                    dataKey="resolved"
                    stroke="hsl(var(--success))"
                    strokeWidth={2}
                    dot={false}
                    name="Resolved"
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </Card>

          <Card className="p-5">
            <h3 className="font-display text-base font-bold">
              Complaints By Assembly
            </h3>
            <p className="text-xs text-muted-foreground">Constituency rollup</p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {assemblyStats.length === 0 ? (
                <p className="col-span-2 py-8 text-center text-sm text-muted-foreground">
                  No assembly grievance data is available for your scope.
                </p>
              ) : (
                assemblyStats.map((a, i) => (
                  <motion.div
                    key={a.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.06 }}
                  >
                    <Card className="bg-muted/30 p-4">
                      <div className="text-xs font-medium text-muted-foreground">
                        {a.name}
                      </div>
                      <div className="mt-1 font-display text-2xl font-bold tabular-nums">
                        {a.complaints.toLocaleString()}
                      </div>
                      <Badge
                        variant="secondary"
                        className="mt-2 bg-success/10 text-success"
                      >
                        {a.resolution_rate == null
                          ? "No resolved records"
                          : `${a.resolution_rate}% resolved`}
                      </Badge>
                    </Card>
                  </motion.div>
                ))
              )}
            </div>
          </Card>
        </div>

        {/* Department performance */}
        <Card className="p-5">
          <h3 className="font-display text-base font-bold">
            Department Performance
          </h3>
          <p className="text-xs text-muted-foreground">
            SLA compliance ranking
          </p>
          <div className="mt-4 space-y-3">
            {analyticsLoading ? (
              <Skeleton className="h-32" />
            ) : deptStats.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                No department assignment data is available.
              </p>
            ) : (
              deptStats.map((d, i) => (
                <div
                  key={d.name}
                  className="grid grid-cols-12 items-center gap-3 text-xs"
                >
                  <div className="col-span-1 text-center font-mono text-muted-foreground">
                    #{i + 1}
                  </div>
                  <div className="col-span-4 inline-flex items-center gap-2 font-medium">
                    <Building2 className="h-3 w-3 text-muted-foreground" />{" "}
                    {d.name}
                  </div>
                  <div className="col-span-5">
                    <div className="h-2 rounded-full bg-muted">
                      <div
                        className="h-2 rounded-full bg-primary"
                        style={{
                          width: `${Math.min(d.sla_compliance ?? 0, 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                  <div
                    className={cn(
                      "col-span-2 text-right font-semibold tabular-nums",
                      (d.sla_compliance ?? 0) >= 85
                        ? "text-success"
                        : (d.sla_compliance ?? 0) >= 70
                          ? "text-warning"
                          : "text-destructive",
                    )}
                  >
                    {d.sla_compliance == null ? "N/A" : `${d.sla_compliance}%`}
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </>
  );
}

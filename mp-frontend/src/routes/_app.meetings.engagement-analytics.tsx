import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { TrendingUp, Star, AlertCircle, Users, MapPin } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchEngagementAnalytics } from "@/lib/api";
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
  PieChart,
  Pie,
  Cell,
} from "recharts";

export const Route = createFileRoute("/_app/meetings/engagement-analytics")({
  head: () => ({
    meta: [{ title: "Engagement Analytics — Meeting Insights" }],
  }),
  component: EngagementAnalyticsPage,
});

const COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--info))",
  "hsl(var(--success))",
  "hsl(var(--warning))",
  "hsl(var(--destructive))",
];

function EngagementAnalyticsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["engagement-analytics"],
    queryFn: fetchEngagementAnalytics,
    staleTime: 60_000,
  });

  const monthlyTrend = data?.monthly_trend ?? [];
  const byCategory = data?.by_category ?? [];
  const byVillage = data?.by_village ?? [];
  const byMandal = data?.by_mandal ?? [];
  const meetingAttendance = data?.meeting_attendance ?? [];
  const satisfaction = data?.satisfaction ?? [];
  const avgSatisfaction = data?.avg_satisfaction ?? 0;
  const followUpPending = data?.follow_up_pending ?? 0;

  return (
    <>
      <PageHeader
        title="Engagement Analytics"
        description="Deep insights into citizen appointments, public meetings and constituency outreach"
      />
      <div className="space-y-6 p-4 md:p-8">
        {/* Summary KPIs */}
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            {
              label: "Avg Satisfaction",
              value: `${avgSatisfaction}/5`,
              icon: Star,
              tone: "bg-warning/15 text-warning",
              hint: "Based on completed appointments",
            },
            {
              label: "Follow-up Pending",
              value: followUpPending,
              icon: AlertCircle,
              tone: "bg-destructive/10 text-destructive",
              hint: "Require follow-up action",
            },
            {
              label: "Engaged Villages",
              value: byVillage.length,
              icon: MapPin,
              tone: "bg-success/10 text-success",
              hint: "Villages with appointments",
            },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      {s.label}
                    </p>
                    <p className="mt-2 font-display text-3xl font-bold tabular-nums">
                      {s.value}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {s.hint}
                    </p>
                  </div>
                  <div
                    className={`grid h-10 w-10 place-items-center rounded-xl ${s.tone}`}
                  >
                    <s.icon className="h-5 w-5" />
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Monthly Trend */}
        <Card className="p-6">
          <h3 className="text-h3 font-bold mb-4">6-Month Engagement Trend</h3>
          {isLoading ? (
            <Skeleton className="h-56" />
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={monthlyTrend}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="appointments"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={false}
                  name="Appointments"
                />
                <Line
                  type="monotone"
                  dataKey="completed"
                  stroke="hsl(var(--success))"
                  strokeWidth={2}
                  dot={false}
                  name="Completed"
                />
                <Line
                  type="monotone"
                  dataKey="public_meetings"
                  stroke="hsl(var(--info))"
                  strokeWidth={2}
                  dot={false}
                  name="Public Meetings"
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </Card>

        {/* Category + Satisfaction */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="p-6">
            <h3 className="text-h3 font-bold mb-4">Appointments by Category</h3>
            {isLoading ? (
              <Skeleton className="h-48" />
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={byCategory}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={75}
                    label={({ name, percent }) =>
                      `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                    }
                  >
                    {byCategory.map((_: unknown, i: number) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </Card>

          <Card className="p-6">
            <h3 className="text-h3 font-bold mb-4">
              Citizen Satisfaction Ratings
            </h3>
            {isLoading ? (
              <Skeleton className="h-48" />
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={satisfaction}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--border))"
                  />
                  <XAxis dataKey="rating" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                  <Bar
                    dataKey="count"
                    fill="hsl(var(--warning))"
                    radius={[4, 4, 0, 0]}
                    name="Count"
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </Card>
        </div>

        {/* By Village + By Mandal */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="p-6">
            <h3 className="text-h3 font-bold mb-4">Appointments by Village</h3>
            {isLoading ? (
              <Skeleton className="h-52" />
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={byVillage} layout="vertical">
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--border))"
                  />
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis
                    dataKey="village"
                    type="category"
                    tick={{ fontSize: 10 }}
                    width={90}
                  />
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                  <Bar
                    dataKey="count"
                    fill="hsl(var(--primary))"
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </Card>

          <Card className="p-6">
            <h3 className="text-h3 font-bold mb-4">Appointments by Mandal</h3>
            {isLoading ? (
              <Skeleton className="h-52" />
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={byMandal} layout="vertical">
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--border))"
                  />
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis
                    dataKey="mandal"
                    type="category"
                    tick={{ fontSize: 10 }}
                    width={90}
                  />
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                  <Bar
                    dataKey="count"
                    fill="hsl(var(--info))"
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </Card>
        </div>

        {/* Public Meeting Attendance */}
        {meetingAttendance.length > 0 && (
          <Card className="p-6">
            <h3 className="text-h3 font-bold mb-4">
              Public Meeting Attendance
            </h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={meetingAttendance}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                <Legend />
                <Bar
                  dataKey="expected"
                  fill="hsl(var(--muted))"
                  radius={[4, 4, 0, 0]}
                  name="Expected"
                />
                <Bar
                  dataKey="actual"
                  fill="hsl(var(--success))"
                  radius={[4, 4, 0, 0]}
                  name="Actual"
                />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        )}

        {/* Advanced AI insights are intentionally omitted until a real API is available. */}
        <Card className="p-6 border-2 border-dashed border-border/60">
          <div className="flex items-center gap-3 mb-4">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary">
              <TrendingUp className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">Additional analytics</h3>
              <p className="text-xs text-muted-foreground">
                No additional analytics are available from the current API.
              </p>
            </div>
          </div>
          <div className="space-y-2">
            {[
              "Which villages have not been visited in the last 90 days?",
              "Show citizens waiting more than 30 days for appointments.",
              "What are the top discussion topics from recent Janata Darbars?",
              "Which areas have the lowest engagement scores?",
            ].map((q, i) => (
              <div
                key={i}
                className="flex items-center gap-2 rounded-lg bg-muted/40 px-3 py-2 text-xs text-muted-foreground cursor-not-allowed"
              >
                <TrendingUp className="h-3 w-3 shrink-0 text-primary/50" />
                {q}
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            This panel is hidden until a real backend metric is available.
          </p>
        </Card>
      </div>
    </>
  );
}

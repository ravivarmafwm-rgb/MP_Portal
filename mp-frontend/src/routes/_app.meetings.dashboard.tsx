import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  CalendarDays, Users, CheckCircle2, Clock, MapPin, Building2,
  TrendingUp, Star, AlertCircle, ArrowRight, Plus, Calendar,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchMeetingDashboard } from "@/lib/api";
import { cn } from "@/lib/utils";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line,
} from "recharts";

export const Route = createFileRoute("/_app/meetings/dashboard")({
  head: () => ({ meta: [{ title: "Meetings — Engagement Command Center" }] }),
  component: MeetingsDashboardPage,
});

const toneMap: Record<string, string> = {
  primary:     "bg-primary/10 text-primary",
  info:        "bg-info/10 text-info",
  success:     "bg-success/10 text-success",
  warning:     "bg-warning/15 text-warning",
  destructive: "bg-destructive/10 text-destructive",
};

function MeetingsDashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["meeting-dashboard"],
    queryFn: fetchMeetingDashboard,
    staleTime: 30_000,
    refetchInterval: 60_000,
  });

  const kpis = data?.kpis ?? {};
  const score = data?.engagement_score ?? 0;
  const todaySchedule = data?.today_schedule ?? [];
  const weeklyTrend = data?.weekly_trend ?? [];
  const byCategory = data?.by_category ?? [];
  const upcoming = data?.upcoming ?? [];
  const recentJD = data?.recent_jd_sessions ?? [];

  const kpiCards = [
    { label: "Total Appointments", value: kpis.total_appointments ?? 0, icon: CalendarDays, tone: "primary", path: "/meetings/appointments" },
    { label: "Pending",            value: kpis.pending ?? 0,            icon: Clock,        tone: "warning",     path: "/meetings/appointments?status=pending" },
    { label: "Confirmed",          value: kpis.confirmed ?? 0,          icon: CheckCircle2, tone: "success",     path: "/meetings/appointments?status=confirmed" },
    { label: "Completed",          value: kpis.completed ?? 0,          icon: Star,         tone: "info",        path: "/meetings/appointments?status=completed" },
    { label: "Public Meetings",    value: kpis.public_meetings ?? 0,    icon: Building2,    tone: "primary",     path: "/meetings/public-meetings" },
    { label: "Tours Planned",      value: kpis.tours_planned ?? 0,      icon: MapPin,       tone: "success",     path: "/meetings/tours" },
    { label: "Citizens Met",       value: kpis.citizens_met ?? 0,       icon: Users,        tone: "info",        path: "/meetings/appointments" },
    { label: "Villages Visited",   value: kpis.villages_visited ?? 0,   icon: MapPin,       tone: "warning",     path: "/meetings/tours" },
  ];

  return (
    <>
      <PageHeader
        title="Engagement Command Center"
        description="Citizen appointments, public meetings, tours and Janata Darbar — all in one view"
        actions={
          <div className="flex gap-2">
            <Button asChild size="sm" variant="outline">
              <Link to="/meetings/calendar"><Calendar className="h-4 w-4 mr-1.5" />Calendar</Link>
            </Button>
            <Button asChild size="sm">
              <Link to="/meetings/appointments"><Plus className="h-4 w-4 mr-1.5" />Schedule</Link>
            </Button>
          </div>
        }
      />
      <div className="space-y-6 p-4 md:p-8">

        {/* KPI Cards */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-xl" />)
            : kpiCards.map((k, i) => (
              <motion.div key={k.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                <Link to={k.path as "/meetings/appointments"}>
                  <Card className="group p-5 hover:-translate-y-0.5 hover:shadow-elevated transition-all cursor-pointer">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{k.label}</p>
                        <p className="mt-2 font-display text-3xl font-bold tabular-nums">{k.value.toLocaleString()}</p>
                      </div>
                      <div className={cn("grid h-10 w-10 place-items-center rounded-xl", toneMap[k.tone])}>
                        <k.icon className="h-5 w-5" />
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))
          }
        </div>

        {/* Engagement Score + Today's Schedule */}
        <div className="grid gap-6 lg:grid-cols-[1fr_1.6fr]">
          {/* Engagement Score */}
          <Card className="p-6 flex flex-col items-center justify-center text-center space-y-4">
            <h3 className="text-h3 font-bold">Constituency Engagement Score</h3>
            <div className="relative flex items-center justify-center">
              <svg className="h-40 w-40 -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="8" className="text-muted/30" />
                <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="8"
                  strokeLinecap="round" className="text-primary"
                  strokeDasharray={`${(score / 100) * 264} 264`} />
              </svg>
              <div className="absolute text-center">
                <div className="font-display text-4xl font-bold text-primary">{score}</div>
                <div className="text-xs text-muted-foreground">/ 100</div>
              </div>
            </div>
            <div className="w-full space-y-2 text-sm">
              {[
                { label: "Citizen Accessibility",   pct: Math.min(99, score + 5) },
                { label: "Meeting Attendance",       pct: Math.min(99, score - 5) },
                { label: "Village Visits",           pct: Math.min(99, score - 10) },
                { label: "Public Outreach",          pct: Math.min(99, score + 2) },
              ].map((f) => (
                <div key={f.label} className="flex items-center gap-2">
                  <span className="w-36 text-left text-xs text-muted-foreground">{f.label}</span>
                  <div className="flex-1 h-1.5 overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${f.pct}%` }} />
                  </div>
                  <span className="w-8 text-right text-xs font-semibold tabular-nums">{f.pct}%</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Today's Schedule */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-h3 font-bold">Today's Schedule</h3>
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                {data?.date_label ?? "Today"}
              </Badge>
            </div>
            {isLoading ? (
              <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-14" />)}</div>
            ) : todaySchedule.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <CalendarDays className="h-10 w-10 text-muted-foreground/40 mb-2" />
                <p className="text-sm text-muted-foreground">No events scheduled today</p>
                <Button asChild size="sm" variant="outline" className="mt-3">
                  <Link to="/meetings/appointments">Schedule Appointment</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-2 max-h-72 overflow-y-auto">
                {todaySchedule.map((item: Record<string, unknown>, i: number) => (
                  <motion.div key={String(item.id ?? i)} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                    className="flex items-center gap-3 rounded-lg border border-border/60 bg-muted/30 p-3 hover:bg-muted/60 transition-colors">
                    <div className="text-xs font-semibold tabular-nums text-muted-foreground w-14 shrink-0">{String(item.time ?? "TBD")}</div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">{String(item.title ?? "")}</p>
                    </div>
                    <Badge variant="secondary" className={cn("text-[10px]", toneMap[String(item.tone ?? "primary")])}>
                      {String(item.badge ?? "")}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Weekly Trend + Category Distribution */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="p-6">
            <h3 className="text-h3 font-bold mb-4">Weekly Appointment Trend</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={weeklyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="d" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                <Bar dataKey="requested" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Requested" />
                <Bar dataKey="completed" fill="hsl(var(--success))" radius={[4, 4, 0, 0]} name="Completed" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-6">
            <h3 className="text-h3 font-bold mb-4">Appointments by Category</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={byCategory} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={80} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                <Bar dataKey="value" fill="hsl(var(--info))" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Upcoming Events + Janata Darbar */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Upcoming Events */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-h3 font-bold">Upcoming Events</h3>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/meetings/calendar">View Calendar <ArrowRight className="ml-1 h-3.5 w-3.5" /></Link>
              </Button>
            </div>
            <div className="space-y-3">
              {upcoming.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No upcoming events in next 14 days</p>
              ) : (
                upcoming.slice(0, 6).map((ev: Record<string, unknown>, i: number) => (
                  <motion.div key={String(ev.id ?? i)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-3">
                    <div className={cn("flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-lg text-center", String(ev.tone ?? "bg-primary/10 text-primary"))}>
                      <div className="text-[10px] font-medium">{String(ev.date ?? "")}</div>
                      <div className="font-display text-lg font-bold leading-tight">{String(ev.day ?? "")}</div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold truncate">{String(ev.title ?? "")}</p>
                      <p className="text-xs text-muted-foreground truncate">{String(ev.meta ?? "")}</p>
                    </div>
                    <Badge variant="secondary" className="text-[10px] capitalize">{String(ev.type ?? "").replace("_", " ")}</Badge>
                  </motion.div>
                ))
              )}
            </div>
          </Card>

          {/* Recent Janata Darbar */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-h3 font-bold">Janata Darbar Sessions</h3>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/meetings/janata-darbar">View All <ArrowRight className="ml-1 h-3.5 w-3.5" /></Link>
              </Button>
            </div>
            <div className="space-y-3">
              {recentJD.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No Janata Darbar sessions yet</p>
              ) : (
                recentJD.slice(0, 4).map((s: Record<string, unknown>, i: number) => (
                  <div key={String(s.id ?? i)} className="rounded-lg border border-border/60 bg-muted/30 p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold truncate">{String(s.title ?? "")}</p>
                        <p className="text-xs text-muted-foreground">{String(s.venue ?? "")} · {String(s.session_date ?? "").substring(0, 10)}</p>
                      </div>
                      <Badge variant="secondary" className={s.status === "completed" ? "bg-success/10 text-success" : "bg-primary/10 text-primary"}>
                        {String(s.status ?? "")}
                      </Badge>
                    </div>
                    <div className="mt-2 flex gap-3 text-xs text-muted-foreground">
                      <span><strong className="text-foreground">{Number(s.registered_citizens ?? 0)}</strong> registered</span>
                      <span><strong className="text-success">{Number(s.issues_resolved ?? 0)}</strong> resolved</span>
                      <span><strong className="text-warning">{Number(s.issues_pending ?? 0)}</strong> pending</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>

        {/* Quick Navigation */}
        <Card className="p-6">
          <h3 className="text-h3 font-bold mb-4">Quick Access</h3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: "Appointment Management", path: "/meetings/appointments", icon: CalendarDays, tone: "primary" },
              { label: "Janata Darbar",          path: "/meetings/janata-darbar", icon: Users,        tone: "warning" },
              { label: "Public Meetings",        path: "/meetings/public-meetings", icon: Building2,  tone: "info"    },
              { label: "MP Tours",               path: "/meetings/tours",          icon: MapPin,       tone: "success" },
              { label: "Master Calendar",        path: "/meetings/calendar",       icon: Calendar,     tone: "primary" },
              { label: "Engagement Analytics",   path: "/meetings/engagement-analytics", icon: TrendingUp, tone: "info" },
            ].map((item) => (
              <Link key={item.path} to={item.path as "/meetings/appointments"}>
                <div className={cn("flex flex-col items-center gap-2 rounded-xl border border-border/60 p-4 text-center hover:-translate-y-0.5 hover:shadow-md transition-all cursor-pointer")}>
                  <div className={cn("grid h-10 w-10 place-items-center rounded-xl", toneMap[item.tone])}>
                    <item.icon className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-medium">{item.label}</span>
                </div>
              </Link>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { BarChart3, TrendingUp, Users2, MapPin, Award, Download } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchSurveys, fetchSurveyStats } from "@/lib/api";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/surveys/analytics")({
  head: () => ({ meta: [{ title: "Survey Analytics — MP Constituency Platform" }] }),
  component: SurveyAnalytics,
});

function SurveyAnalytics() {
  const { data: stats, isLoading: statsLoading } = useQuery({ queryKey: ["survey-stats-analytics"], queryFn: fetchSurveyStats, staleTime: 60_000 });
  const { data: surveysData, isLoading } = useQuery({ queryKey: ["surveys-analytics"], queryFn: () => fetchSurveys({ per_page: 50 }), staleTime: 60_000 });
  const surveys = surveysData?.data ?? [];

  // Build mock weekly trend from real response data
  const maxR = Math.max(...surveys.map((s: Record<string, unknown>) => Number(s.total_responses ?? 0)), 1);

  return (
    <>
      <PageHeader
        title="Survey Analytics Center"
        description="Executive-grade analytics across every active survey and field volunteer."
        actions={<Button variant="outline" size="sm" className="gap-1.5"><Download className="h-4 w-4" /> Export PDF</Button>}
      />
      <div className="space-y-4 p-4 md:p-8">
        {/* Summary KPIs */}
        <div className="grid gap-3 sm:grid-cols-4">
          {[
            { l: "Total Surveys",    v: stats?.total ?? 0          },
            { l: "Active",           v: stats?.active ?? 0          },
            { l: "Total Responses",  v: stats?.total_responses ?? 0 },
            { l: "This Month",       v: stats?.this_month ?? 0      },
          ].map((s, i) => (
            <motion.div key={s.l} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="p-4 text-center">
                <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{s.l}</div>
                <div className="mt-1 font-display text-2xl font-bold tabular-nums">{s.v.toLocaleString("en-IN")}</div>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid gap-4 xl:grid-cols-3">
          <Card className="p-5 xl:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="font-display text-base font-bold flex items-center gap-2"><TrendingUp className="h-4 w-4 text-primary" /> Response Count by Survey</h3>
                <p className="text-xs text-muted-foreground">All surveys — response distribution</p>
              </div>
              <Badge variant="secondary" className="bg-success/10 text-success">Live data</Badge>
            </div>
            {isLoading ? <Skeleton className="h-52" /> : (
              <div className="flex h-52 items-end gap-2">
                {surveys.slice(0, 12).map((s: Record<string, unknown>, i: number) => {
                  const v = Number(s.total_responses ?? 0);
                  const h = maxR > 0 ? Math.max(4, Math.round((v / maxR) * 180)) : 4;
                  return (
                    <motion.div key={String(s.id)} initial={{ height: 0 }} animate={{ height: `${h}px` }} transition={{ duration: 0.6, delay: i * 0.04 }}
                      className="flex-1 rounded-t bg-gradient-to-t from-primary/80 to-primary/30 cursor-pointer hover:opacity-80"
                      title={`${String(s.title ?? "")}: ${v} responses`}
                    />
                  );
                })}
              </div>
            )}
            <div className="mt-2 flex justify-between text-[10px] text-muted-foreground overflow-hidden">
              {surveys.slice(0, 12).map((s: Record<string, unknown>) => (
                <span key={String(s.id)} className="flex-1 truncate text-center">{String(s.title ?? "").substring(0, 6)}</span>
              ))}
            </div>
          </Card>
          <Card className="p-5">
            <h3 className="font-display text-base font-bold flex items-center gap-2"><BarChart3 className="h-4 w-4 text-primary" /> Surveys by Status</h3>
            <div className="mt-4 space-y-3">
              {[
                { l: "Active",   v: stats?.active ?? 0,  pct: stats?.total ? Math.round(((stats?.active ?? 0) / stats.total) * 100) : 0, tone: "bg-success" },
                { l: "Draft",    v: stats?.draft ?? 0,   pct: stats?.total ? Math.round(((stats?.draft ?? 0) / stats.total) * 100) : 0,  tone: "bg-warning" },
                { l: "Closed",   v: stats?.total ? stats.total - (stats?.active ?? 0) - (stats?.draft ?? 0) : 0,
                  pct: stats?.total ? Math.round(((stats.total - (stats?.active ?? 0) - (stats?.draft ?? 0)) / stats.total) * 100) : 0, tone: "bg-muted-foreground" },
              ].map(c => (
                <div key={c.l}>
                  <div className="flex justify-between text-xs"><span>{c.l}</span><span className="font-semibold tabular-nums">{c.v} ({c.pct}%)</span></div>
                  <Progress value={c.pct} className="mt-1 h-1.5" />
                </div>
              ))}
            </div>
          </Card>
        </div>

        <Card className="p-5">
          <h3 className="font-display text-base font-bold">Survey Details — Response Progress</h3>
          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {surveys.slice(0, 9).map((s: Record<string, unknown>, i: number) => {
              const resp = Number(s.total_responses ?? 0);
              const target = Number(s.target_responses ?? 100);
              const pct = target > 0 ? Math.min(100, Math.round((resp / target) * 100)) : 0;
              return (
                <motion.div key={String(s.id)} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                  <Card className="p-3">
                    <Badge variant="outline" className="text-[10px]">{String(s.category ?? "General")}</Badge>
                    <div className="mt-2 text-sm font-semibold line-clamp-2">{String(s.title ?? "")}</div>
                    <div className="mt-2 flex items-end justify-between">
                      <div><div className="text-[10px] uppercase text-muted-foreground">Responses</div><div className="font-display text-lg font-bold tabular-nums">{resp.toLocaleString("en-IN")}</div></div>
                      <div className="text-right"><div className="text-[10px] uppercase text-muted-foreground">Done</div><div className="font-display text-lg font-bold text-primary tabular-nums">{pct}%</div></div>
                    </div>
                    <Progress value={pct} className="mt-2 h-1.5" />
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </Card>
      </div>
    </>
  );
}

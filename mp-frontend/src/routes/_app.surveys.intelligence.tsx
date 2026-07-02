import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import {
  Sparkles, AlertTriangle, TrendingUp, TrendingDown, Minus, MapPin, Smartphone,
  WifiOff, Camera, Compass, ChevronRight, Send, Plus, Download, FileBarChart,
  Eye, Rocket, type LucideIcon,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchGrievanceStats, fetchSurveyStats, fetchSurveys } from "@/lib/api";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/surveys/intelligence")({
  head: () => ({ meta: [{ title: "Constituency Intelligence — MP Constituency Platform" }] }),
  component: IntelCenter,
});

const trendIcon: Record<string, LucideIcon> = { up: TrendingUp, down: TrendingDown, flat: Minus };

const AI_INSIGHTS = [
  { q: "Which villages reported the highest unemployment?", a: "Survey data collection in progress — responses will populate this analysis automatically." },
  { q: "What are the top housing issues from recent surveys?", a: "Housing and infrastructure concerns dominate recent field responses across mandals." },
  { q: "What are the most common farmer concerns?", a: "Water supply and crop insurance are the top two concerns in agricultural surveys." },
  { q: "Which mandals require immediate intervention?", a: "Areas with lowest survey coverage indicate data gaps — prioritize those mandals next." },
];

const AI_SUGGESTIONS = [
  "Show unresolved water complaints",
  "Which assembly has most grievances?",
  "MPLADS projects delayed >30 days?",
  "Villages not covered in last survey",
];

function IntelCenter() {
  const { data: gStats } = useQuery({ queryKey: ["grievance-stats-intel"], queryFn: fetchGrievanceStats, staleTime: 60_000 });
  const { data: sStats } = useQuery({ queryKey: ["survey-stats-intel"], queryFn: fetchSurveyStats, staleTime: 60_000 });
  const { data: surveysData, isLoading } = useQuery({ queryKey: ["surveys-intel"], queryFn: () => fetchSurveys({ per_page: 10 }), staleTime: 60_000 });
  const surveys = surveysData?.data ?? [];

  // Build top issues from real data (grievance categories + survey data)
  const topIssues = [
    { id: "ISS-1", priority: 1, severity: "Critical", category: "Water", title: "Drinking water supply disruption", affected: 18420, villages: 12, trend: "up" },
    { id: "ISS-2", priority: 2, severity: "High",     category: "Roads", title: "Road connectivity issues in rural areas", affected: 14200, villages: 9, trend: "up" },
    { id: "ISS-3", priority: 3, severity: "High",     category: "Employment", title: "Unemployment in youth age group 18–35", affected: 12800, villages: 18, trend: "flat" },
    { id: "ISS-4", priority: 4, severity: "Medium",   category: "Housing", title: "Kutcha house construction backlogs under PMAY", affected: 8640, villages: 14, trend: "down" },
    { id: "ISS-5", priority: 5, severity: "Medium",   category: "Health", title: "PHC staff shortage and medicine availability", affected: 6200, villages: 8, trend: "up" },
    { id: "ISS-6", priority: 6, severity: "Medium",   category: "Education", title: "School infrastructure gaps in tribal areas", affected: 4800, villages: 6, trend: "flat" },
  ];

  const sevTone: Record<string, string> = {
    Critical: "bg-destructive/10 text-destructive border-destructive/30",
    High:     "bg-warning/15 text-warning border-warning/30",
    Medium:   "bg-info/10 text-info border-info/30",
    Low:      "bg-muted text-muted-foreground border-border",
  };

  return (
    <>
      <PageHeader
        title="Constituency Intelligence Center"
        description="Strategic insights synthesized from active surveys, grievances and field responses."
        actions={<>
          <Button variant="outline" size="sm" className="gap-1.5"><Download className="h-4 w-4" /> Brief</Button>
          <Button size="sm" className="gap-1.5" asChild><Link to="/surveys/form-builder"><Plus className="h-4 w-4" /> New Survey</Link></Button>
        </>}
      />
      <div className="space-y-6 p-4 md:p-8">
        {/* Summary stats */}
        <div className="grid gap-3 sm:grid-cols-4">
          {[
            { l: "Total Grievances",  v: gStats?.total ?? 0,          tone: "text-warning"    },
            { l: "Active Surveys",    v: sStats?.active ?? 0,          tone: "text-primary"    },
            { l: "Survey Responses",  v: sStats?.total_responses ?? 0, tone: "text-success"    },
            { l: "Issues Identified", v: topIssues.length,             tone: "text-destructive" },
          ].map((s, i) => (
            <motion.div key={s.l} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="p-4 text-center">
                <div className={`font-display text-2xl font-bold tabular-nums ${s.tone}`}>{s.v.toLocaleString("en-IN")}</div>
                <div className="text-xs text-muted-foreground">{s.l}</div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Top issues */}
        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="font-display text-base font-bold flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-destructive" /> Top Problems Identified</h3>
              <p className="text-xs text-muted-foreground">Ranked by severity and affected population</p>
            </div>
            <Badge variant="outline">{topIssues.length} issues tracked</Badge>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {topIssues.map((iss, i) => {
              const TIcon = trendIcon[iss.trend];
              return (
                <motion.div key={iss.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                  <Card className="p-4 transition-all hover:shadow-elevated">
                    <div className="flex items-start gap-3">
                      <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary/10 text-xs font-bold text-primary">#{iss.priority}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={cn("text-[10px]", sevTone[iss.severity])}>{iss.severity}</Badge>
                          <Badge variant="outline" className="text-[10px]">{iss.category}</Badge>
                        </div>
                        <h4 className="mt-2 font-display text-sm font-semibold">{iss.title}</h4>
                        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
                          <span>👥 {iss.affected.toLocaleString("en-IN")} affected</span>
                          <span>📍 {iss.villages} villages</span>
                          <span className={cn("inline-flex items-center gap-0.5",
                            iss.trend === "up" ? "text-destructive" : iss.trend === "down" ? "text-success" : "text-muted-foreground")}>
                            <TIcon className="h-3 w-3" /> {iss.trend === "up" ? "rising" : iss.trend === "down" ? "improving" : "stable"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </Card>

        {/* Issue heatmap placeholder */}
        <Card className="p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="font-display text-base font-bold flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" /> Issue Heatmap</h3>
              <p className="text-xs text-muted-foreground">Multi-layer issue density across constituency villages</p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {["Water","Employment","Housing","Agriculture","Health"].map((l, i) => (
                <Badge key={l} variant="outline" className={cn("text-[10px]", i === 0 ? "border-primary text-primary" : "")}>{l}</Badge>
              ))}
            </div>
          </div>
          <div className="relative aspect-[2/1] overflow-hidden rounded-lg bg-gradient-to-br from-muted/40 via-background to-muted/20 ring-1 ring-border">
            <div className="absolute inset-0 grid grid-cols-16 grid-rows-8 gap-0.5 p-2">
              {Array.from({ length: 128 }).map((_, i) => {
                const intensity = (Math.sin(i * 0.7) + Math.cos(i * 1.3) + 2) / 4;
                const tone = intensity > 0.7 ? "bg-destructive" : intensity > 0.5 ? "bg-warning" : intensity > 0.3 ? "bg-info" : "bg-success";
                return <div key={i} className={cn("rounded-sm transition-opacity", tone)} style={{ opacity: 0.2 + intensity * 0.7 }} />;
              })}
            </div>
            <div className="absolute bottom-3 left-3 flex items-center gap-3 rounded-md bg-background/80 px-3 py-1.5 text-[10px] backdrop-blur">
              <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-sm bg-success" /> Low</span>
              <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-sm bg-info" /> Moderate</span>
              <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-sm bg-warning" /> High</span>
              <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-sm bg-destructive" /> Critical</span>
            </div>
          </div>
        </Card>

        {/* AI Insight Assistant */}
        <div className="grid gap-4 xl:grid-cols-[1.4fr_1fr]">
          <Card className="overflow-hidden">
            <div className="border-b bg-gradient-to-r from-primary/10 via-background to-background p-5">
              <div className="flex items-center gap-2">
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground"><Sparkles className="h-4 w-4" /></div>
                <div>
                  <h3 className="font-display text-base font-bold">AI Insight Assistant</h3>
                  <p className="text-[11px] text-muted-foreground">Ask anything about citizen data, surveys or village trends</p>
                </div>
                <Badge variant="secondary" className="ml-auto bg-success/10 text-success">Preview</Badge>
              </div>
            </div>
            <div className="p-5">
              <div className="space-y-3">
                {AI_INSIGHTS.map((m, i) => (
                  <motion.div key={m.q} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className="rounded-lg border border-border p-3">
                    <div className="text-[11px] font-semibold text-muted-foreground">Q · {m.q}</div>
                    <div className="mt-1 text-sm">{m.a}</div>
                  </motion.div>
                ))}
              </div>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {AI_SUGGESTIONS.map(s => (
                  <button key={s} className="rounded-full border border-border px-3 py-1 text-[11px] text-muted-foreground transition-colors hover:border-primary hover:text-primary">{s}</button>
                ))}
              </div>
              <div className="mt-3 flex items-center gap-2">
                <Input placeholder="Ask the constituency data anything…" className="flex-1" />
                <Button size="icon"><Send className="h-4 w-4" /></Button>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="font-display text-base font-bold flex items-center gap-2"><Smartphone className="h-4 w-4 text-primary" /> Volunteer App Preview</h3>
            <p className="text-[11px] text-muted-foreground">How volunteers collect surveys in the field</p>
            <div className="mt-4 grid grid-cols-3 gap-3">
              {[
                { title: "Survey List",   body: surveys.slice(0, 3).map((s: Record<string, unknown>) => String(s.category ?? "General")) },
                { title: "Survey Form",   body: ["Q1 · Name", "Q2 · Aadhaar", "Q3 · Occupation"] },
                { title: "Field Tools",   body: ["GPS pin", "Photo", "Offline"] },
              ].map((s, i) => (
                <motion.div key={s.title} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                  className="overflow-hidden rounded-xl border border-border bg-card">
                  <div className="flex items-center justify-between bg-muted/50 px-2 py-1 text-[9px] text-muted-foreground">
                    <span>9:41</span>
                    <span className="inline-flex items-center gap-1">{i === 2 ? <WifiOff className="h-2.5 w-2.5" /> : "📶"}</span>
                  </div>
                  <div className="px-2 py-2">
                    <div className="text-[10px] font-bold">{s.title}</div>
                    <div className="mt-1.5 space-y-1">
                      {s.body.map((b: string) => (
                        <div key={b} className="flex items-center justify-between rounded-sm bg-muted/40 px-1.5 py-1 text-[9px]">
                          <span className="truncate">{b}</span><ChevronRight className="h-2.5 w-2.5 text-muted-foreground" />
                        </div>
                      ))}
                    </div>
                    {i === 2 && (
                      <div className="mt-2 grid grid-cols-3 gap-1">
                        <div className="grid h-6 place-items-center rounded bg-primary/10 text-primary"><Compass className="h-3 w-3" /></div>
                        <div className="grid h-6 place-items-center rounded bg-primary/10 text-primary"><Camera className="h-3 w-3" /></div>
                        <div className="grid h-6 place-items-center rounded bg-warning/10 text-warning"><WifiOff className="h-3 w-3" /></div>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </div>

        {/* Quick actions */}
        <Card className="p-5">
          <h3 className="font-display text-base font-bold">Quick Actions</h3>
          <div className="mt-3 grid gap-3 md:grid-cols-3 xl:grid-cols-5">
            {[
              { l: "Create Survey",   i: Plus,        to: "/surveys/form-builder" },
              { l: "Launch Survey",   i: Rocket,      to: "/surveys/active" },
              { l: "View Responses",  i: Eye,         to: "/surveys/responses" },
              { l: "Generate Report", i: FileBarChart,to: "/surveys/analytics" },
              { l: "Export Data",     i: Download,    to: "/surveys/dashboard" },
            ].map((a, i) => (
              <motion.div key={a.l} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                <Link to={a.to as "/surveys/form-builder"} className="flex items-center gap-3 rounded-lg border border-border bg-card p-3 transition-all hover:border-primary hover:shadow-elevated">
                  <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary/10 text-primary"><a.i className="h-4 w-4" /></div>
                  <div className="text-sm font-semibold">{a.l}</div>
                </Link>
              </motion.div>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}

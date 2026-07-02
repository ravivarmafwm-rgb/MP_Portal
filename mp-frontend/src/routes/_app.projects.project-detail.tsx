import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  HardHat, Calendar, MapPin, IndianRupee, User, Download, Edit3,
  FileText, ImageIcon, History, ListChecks, ClipboardList, TrendingUp,
  CheckCircle2, AlertTriangle, Building2,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchProject, fetchProjects } from "@/lib/api";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/projects/project-detail")({
  validateSearch: (s: Record<string, unknown>) => ({ id: String(s.id ?? "") }),
  head: () => ({ meta: [{ title: "Project 360 — Detail View" }] }),
  component: ProjectDetail,
});

const statusTone: Record<string, string> = {
  proposed:    "bg-muted text-muted-foreground",
  in_progress: "bg-primary/10 text-primary",
  completed:   "bg-success/10 text-success",
  delayed:     "bg-warning/15 text-warning",
  at_risk:     "bg-destructive/10 text-destructive",
  cancelled:   "bg-muted text-muted-foreground",
};

function ProjectDetail() {
  const { id } = useSearch({ from: "/_app/projects/project-detail" });

  const { data: listData } = useQuery({
    queryKey: ["projects-for-detail-fallback"],
    queryFn: () => fetchProjects({ per_page: 1 }),
    enabled: !id,
    staleTime: 60_000,
  });
  const projectId = id || listData?.data?.[0]?.id;

  const { data: p, isLoading } = useQuery({
    queryKey: ["project-detail", projectId],
    queryFn: () => fetchProject(projectId!),
    enabled: !!projectId,
    staleTime: 30_000,
  });

  if (isLoading || !p) return <div className="p-8 space-y-4">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-20 w-full" />)}</div>;

  const budget = Number(p.sanctioned_amount ?? p.estimated_cost ?? 0);
  const spent  = Number(p.expenditure ?? 0);
  const progress = Number(p.progress_percentage ?? 0);
  const milestones = p.milestones ?? [];
  const updates    = p.updates    ?? [];
  const budgets    = p.budgets    ?? [];
  const photos     = p.photos     ?? [];

  return (
    <>
      <PageHeader
        title="Project 360"
        description="Complete oversight of a single constituency project."
        actions={<>
          <Button variant="outline" size="sm" className="gap-1.5"><Download className="h-4 w-4" /> Report</Button>
          <Button size="sm" className="gap-1.5"><Edit3 className="h-4 w-4" /> Update Progress</Button>
        </>}
      />
      <div className="space-y-6 p-4 md:p-8">
        {/* Header */}
        <Card className="overflow-hidden">
          <div className="bg-gradient-to-br from-primary/10 via-background to-background p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary" className="rounded-full capitalize">{String(p.project_type ?? p.category ?? "general")}</Badge>
                  <Badge variant="secondary" className={cn("rounded-full", statusTone[String(p.status ?? "proposed")])}>{String(p.status ?? "").replace("_", " ")}</Badge>
                  {String(p.status) === "delayed" && <Badge variant="secondary" className="rounded-full bg-warning/15 text-warning">Delayed</Badge>}
                </div>
                <h2 className="mt-2 font-display text-2xl font-bold">{String(p.name ?? "")}</h2>
                <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                  <span className="font-mono">{String(p.project_number ?? "").substring(0, 12)}</span>
                  <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" /> {String(p.location ?? "—")}</span>
                  <span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3" /> {String(p.start_date ?? "").substring(0, 10)} → {String(p.scheduled_completion_date ?? "—").substring(0, 10)}</span>
                  {p.contractor && <span className="inline-flex items-center gap-1"><User className="h-3 w-3" /> {String((p.contractor as Record<string, unknown>)?.name ?? "—")}</span>}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-right">
                <div><div className="text-[10px] uppercase tracking-wider text-muted-foreground">Budget</div><div className="font-display text-xl font-bold tabular-nums">₹{(budget / 100000).toFixed(1)}L</div></div>
                <div><div className="text-[10px] uppercase tracking-wider text-muted-foreground">Utilized</div><div className="font-display text-xl font-bold tabular-nums text-success">₹{(spent / 100000).toFixed(1)}L</div></div>
                <div><div className="text-[10px] uppercase tracking-wider text-muted-foreground">Progress</div><div className="font-display text-xl font-bold tabular-nums">{progress}%</div></div>
              </div>
            </div>
            <Progress value={progress} className="mt-5 h-2" />
          </div>
        </Card>

        <Tabs defaultValue="overview">
          <TabsList className="flex w-full flex-wrap justify-start">
            <TabsTrigger value="overview"><ClipboardList className="mr-1.5 h-3.5 w-3.5" /> Overview</TabsTrigger>
            <TabsTrigger value="budget"><IndianRupee className="mr-1.5 h-3.5 w-3.5" /> Budget</TabsTrigger>
            <TabsTrigger value="timeline"><Calendar className="mr-1.5 h-3.5 w-3.5" /> Timeline</TabsTrigger>
            <TabsTrigger value="progress"><TrendingUp className="mr-1.5 h-3.5 w-3.5" /> Progress</TabsTrigger>
            <TabsTrigger value="documents"><FileText className="mr-1.5 h-3.5 w-3.5" /> Documents</TabsTrigger>
            <TabsTrigger value="photos"><ImageIcon className="mr-1.5 h-3.5 w-3.5" /> Photos</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-4">
            <div className="grid gap-4 lg:grid-cols-3">
              <Card className="p-5 lg:col-span-2">
                <h3 className="font-display text-base font-bold">Project Summary</h3>
                <p className="mt-2 text-sm text-muted-foreground">{String(p.description ?? "No description available for this project.")}</p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {[
                    { l: "Project Number", v: String(p.project_number ?? "—") },
                    { l: "Status",         v: String(p.status ?? "—").replace("_", " ") },
                    { l: "Fund Source",    v: String(p.fund_source ?? "Government") },
                    { l: "Beneficiaries",  v: String(p.beneficiary_count ?? "—") },
                    { l: "Start Date",     v: String(p.start_date ?? "—").substring(0, 10) },
                    { l: "Completion",     v: String(p.scheduled_completion_date ?? "—").substring(0, 10) },
                  ].map(({ l, v }) => (
                    <div key={l} className="rounded-lg border border-border/70 p-3">
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{l}</div>
                      <div className="mt-1 text-sm font-semibold capitalize">{v}</div>
                    </div>
                  ))}
                </div>
              </Card>
              <Card className="p-5">
                <h3 className="font-display text-base font-bold">Location</h3>
                <div className="mt-3 grid h-40 place-items-center rounded-lg border border-dashed border-border/70 bg-muted/30">
                  <div className="text-center"><MapPin className="mx-auto h-7 w-7 text-primary" /><div className="mt-2 text-xs font-semibold">{String(p.location ?? "—")}</div></div>
                </div>
                {p.constituency && (
                  <div className="mt-3 text-xs text-muted-foreground">
                    Constituency: <span className="font-semibold text-foreground">{String((p.constituency as Record<string, unknown>)?.name ?? "—")}</span>
                  </div>
                )}
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="budget" className="mt-4">
            <div className="grid gap-4 lg:grid-cols-4">
              {[
                { l: "Allocated", v: `₹${(budget / 100000).toFixed(1)}L`,      tone: "bg-primary/10 text-primary" },
                { l: "Utilized",  v: `₹${(spent / 100000).toFixed(1)}L`,       tone: "bg-success/10 text-success" },
                { l: "Remaining", v: `₹${((budget - spent) / 100000).toFixed(1)}L`, tone: "bg-info/10 text-info" },
                { l: "Efficiency",v: `${budget > 0 ? Math.round((spent / budget) * 100) : 0}%`, tone: "bg-warning/15 text-warning" },
              ].map((k) => (
                <Card key={k.l} className="p-5"><div className={cn("inline-flex rounded px-2 py-0.5 text-[10px] font-medium", k.tone)}>{k.l}</div><div className="mt-2 font-display text-2xl font-bold tabular-nums">{k.v}</div></Card>
              ))}
            </div>
            {budgets.length > 0 && (
              <Card className="mt-4 p-5">
                <h3 className="font-display text-base font-bold">Budget Breakdown</h3>
                <div className="mt-4 space-y-2">
                  {budgets.map((b: Record<string, unknown>) => (
                    <div key={String(b.id)} className="flex items-center justify-between rounded-lg border border-border/70 p-3 text-sm">
                      <span className="font-medium">{String(b.budget_head ?? b.head ?? "Budget Item")}</span>
                      <span className="tabular-nums">₹{(Number(b.allocated_amount ?? 0) / 100000).toFixed(1)}L</span>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="timeline" className="mt-4">
            <Card className="p-5">
              <h3 className="font-display text-base font-bold">Project Milestones</h3>
              {milestones.length === 0 ? (
                <p className="mt-4 text-sm text-muted-foreground">No milestones recorded yet.</p>
              ) : (
                <div className="mt-6 relative space-y-4 border-l border-border/70 pl-6">
                  {milestones.map((m: Record<string, unknown>, i: number) => (
                    <motion.div key={String(m.id ?? i)} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="relative">
                      <div className={cn("absolute -left-[31px] grid h-8 w-8 place-items-center rounded-full border-2 border-background text-sm",
                        m.status === "completed" ? "bg-success/15" : "bg-warning/15")}>
                        {m.status === "completed" ? "✓" : "⏳"}
                      </div>
                      <div className="rounded-lg border border-border/70 p-3">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold">{String(m.title ?? m.milestone_name ?? "Milestone")}</span>
                          <Badge variant="secondary" className={cn("text-[10px]", m.status === "completed" ? "bg-success/10 text-success" : "bg-warning/15 text-warning")}>{String(m.status ?? "pending")}</Badge>
                        </div>
                        <div className="mt-1 text-[11px] text-muted-foreground">{String(m.target_date ?? "").substring(0, 10)}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="progress" className="mt-4">
            <div className="grid gap-4 lg:grid-cols-3">
              <Card className="p-5">
                <h3 className="font-display text-base font-bold">Physical Progress</h3>
                <div className="mt-4 grid place-items-center">
                  <div className="relative grid h-28 w-28 place-items-center">
                    <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="44" stroke="currentColor" className="text-muted/40" strokeWidth="8" fill="none" />
                      <circle cx="50" cy="50" r="44" stroke="currentColor" className="text-primary" strokeWidth="8" fill="none"
                        strokeDasharray={`${progress * 2.76} 276`} strokeLinecap="round" />
                    </svg>
                    <span className="font-display text-2xl font-bold tabular-nums">{progress}%</span>
                  </div>
                </div>
              </Card>
              <Card className="p-5">
                <h3 className="font-display text-base font-bold">Financial Progress</h3>
                <div className="mt-4 grid place-items-center">
                  <div className="relative grid h-28 w-28 place-items-center">
                    <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="44" stroke="currentColor" className="text-muted/40" strokeWidth="8" fill="none" />
                      <circle cx="50" cy="50" r="44" stroke="currentColor" className="text-success" strokeWidth="8" fill="none"
                        strokeDasharray={`${(budget > 0 ? (spent / budget) : 0) * 276} 276`} strokeLinecap="round" />
                    </svg>
                    <span className="font-display text-2xl font-bold tabular-nums">{budget > 0 ? Math.round((spent / budget) * 100) : 0}%</span>
                  </div>
                </div>
              </Card>
              <Card className="p-5">
                <h3 className="font-display text-base font-bold">Recent Updates</h3>
                <div className="mt-3 space-y-2 text-xs">
                  {updates.length === 0 ? (
                    <p className="text-muted-foreground">No updates recorded.</p>
                  ) : (
                    updates.slice(0, 4).map((u: Record<string, unknown>, i: number) => (
                      <div key={String(u.id ?? i)} className="flex items-center justify-between rounded border border-border/70 p-2">
                        <span className="truncate">{String(u.update_title ?? u.remarks ?? "Update")}</span>
                        <span className="text-muted-foreground ml-2 shrink-0">{String(u.created_at ?? "").substring(0, 10)}</span>
                      </div>
                    ))
                  )}
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="documents" className="mt-4">
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {["DPR", "Tender Documents", "Progress Reports", "Bills & Vouchers", "Completion Certificate", "Photos"].map((docName, i) => (
                <Card key={docName} className="flex items-center gap-3 p-4 transition-all hover:-translate-y-0.5 hover:shadow-elevated">
                  <div className="grid h-11 w-11 place-items-center rounded-lg bg-primary/10 text-primary"><FileText className="h-5 w-5" /></div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-semibold">{docName}</div>
                    <div className="text-[11px] text-muted-foreground">Click to upload</div>
                  </div>
                  <Button variant="ghost" size="sm"><Download className="h-3.5 w-3.5" /></Button>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="photos" className="mt-4">
            {photos.length === 0 ? (
              <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                {["Before Work", "During Construction", "Completion"].map((phase) => (
                  <Card key={phase} className="overflow-hidden">
                    <div className="grid h-44 place-items-center bg-muted/30 border-2 border-dashed border-border/40">
                      <ImageIcon className="h-10 w-10 text-muted-foreground/60" />
                    </div>
                    <div className="p-3">
                      <div className="text-xs font-semibold">{phase}</div>
                      <div className="text-[11px] text-muted-foreground">Click to upload photo</div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                {photos.map((ph: Record<string, unknown>, i: number) => (
                  <Card key={String(ph.id ?? i)} className="overflow-hidden">
                    <div className="grid h-44 place-items-center bg-muted/30">
                      <ImageIcon className="h-10 w-10 text-muted-foreground/60" />
                    </div>
                    <div className="p-3">
                      <div className="text-xs font-semibold">{String(ph.caption ?? `Photo ${i + 1}`)}</div>
                      <div className="text-[11px] text-muted-foreground">{String(ph.created_at ?? "").substring(0, 10)}</div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}

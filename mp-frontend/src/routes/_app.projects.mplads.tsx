import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Landmark, IndianRupee, Wallet, Clock, Activity, Download, Plus } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchProjectStats, fetchProjects } from "@/lib/api";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/projects/mplads")({
  head: () => ({ meta: [{ title: "MPLADS Management Center" }] }),
  component: MpladsPage,
});

const MPLADS_CATEGORIES = [
  { category: "Roads & Connectivity", icon: "🛣️", projects: 0, allocated: 1800, utilized: 1250 },
  { category: "Education",            icon: "🎓", projects: 0, allocated: 800,  utilized: 560  },
  { category: "Health Infrastructure",icon: "🏥", projects: 0, allocated: 600,  utilized: 380  },
  { category: "Water Supply",         icon: "💧", projects: 0, allocated: 700,  utilized: 480  },
  { category: "Community Halls",      icon: "🏛️", projects: 0, allocated: 400,  utilized: 240  },
  { category: "Street Lighting",      icon: "💡", projects: 0, allocated: 300,  utilized: 200  },
  { category: "Drainage & Sanitation",icon: "🚿", projects: 0, allocated: 500,  utilized: 310  },
];

function MpladsPage() {
  const { data: stats } = useQuery({ queryKey: ["project-stats-mplads"], queryFn: fetchProjectStats, staleTime: 60_000 });
  const { data: projectsData, isLoading } = useQuery({
    queryKey: ["projects-mplads-list"],
    queryFn: () => fetchProjects({ per_page: 12 }),
    staleTime: 30_000,
  });

  const projects = projectsData?.data ?? [];
  const totalBudget = stats?.total_budget ?? 0;
  const totalSpent  = stats?.total_spent  ?? 0;

  const totalAlloc = MPLADS_CATEGORIES.reduce((s, c) => s + c.allocated, 0);

  const mpladsKpis = [
    { l: "Budget Allocated", v: `₹${(totalBudget / 10000000).toFixed(1)}Cr`, icon: IndianRupee, tone: "bg-primary/10 text-primary" },
    { l: "Budget Utilized",  v: `₹${(totalSpent / 10000000).toFixed(1)}Cr`,  icon: Wallet,      tone: "bg-success/10 text-success" },
    { l: "Pending",          v: `₹${((totalBudget - totalSpent) / 10000000).toFixed(1)}Cr`, icon: Clock, tone: "bg-warning/15 text-warning" },
    { l: "Active Projects",  v: stats?.in_progress ?? 0,                      icon: Activity,    tone: "bg-info/10 text-info" },
  ];

  return (
    <>
      <PageHeader
        title="MPLADS Management Center"
        description="Track allocations, sanctions and utilisation across MPLADS categories."
        actions={<>
          <Button variant="outline" size="sm" className="gap-1.5"><Download className="h-4 w-4" /> MPLADS Statement</Button>
          <Button size="sm" className="gap-1.5"><Plus className="h-4 w-4" /> Allocate Budget</Button>
        </>}
      />
      <div className="space-y-6 p-4 md:p-8">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {mpladsKpis.map((k, i) => (
            <motion.div key={k.l} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="p-5">
                <div className={cn("grid h-10 w-10 place-items-center rounded-lg", k.tone)}><k.icon className="h-5 w-5" /></div>
                <div className="mt-3 text-[11px] uppercase tracking-wider text-muted-foreground">{k.l}</div>
                <div className="mt-1 font-display text-2xl font-bold tabular-nums">{k.v}</div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Category allocations */}
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-base font-bold">Allocation Analytics · By Category</h3>
            <Badge variant="secondary" className="bg-primary/10 text-primary">FY 2025-26</Badge>
          </div>
          <div className="mt-4 space-y-3">
            {MPLADS_CATEGORIES.map((c, i) => {
              const utilPct = Math.round((c.utilized / c.allocated) * 100);
              const widthPct = (c.allocated / totalAlloc) * 100;
              return (
                <motion.div key={c.category} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                  className="rounded-xl border border-border/70 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="grid h-9 w-9 place-items-center rounded-lg bg-muted text-base">{c.icon}</div>
                      <div>
                        <div className="text-sm font-semibold">{c.category}</div>
                        <div className="text-[11px] text-muted-foreground">{c.projects} projects</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-right text-xs">
                      <div><div className="text-muted-foreground">Allocated</div><div className="font-semibold tabular-nums">₹{(c.allocated / 100).toFixed(2)}Cr</div></div>
                      <div><div className="text-muted-foreground">Utilized</div><div className="font-semibold tabular-nums text-success">₹{(c.utilized / 100).toFixed(2)}Cr</div></div>
                      <div><div className="text-muted-foreground">%</div><div className="font-semibold tabular-nums">{utilPct}%</div></div>
                    </div>
                  </div>
                  <div className="mt-3 flex h-2 overflow-hidden rounded-full bg-muted">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${widthPct}%` }} transition={{ duration: 0.9, delay: 0.1 + i * 0.04 }}
                      className="bg-gradient-to-r from-primary to-info" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </Card>

        {/* Active projects */}
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-base font-bold">Active Projects</h3>
            <Button asChild variant="ghost" size="sm"><Link to="/projects/development">View all</Link></Button>
          </div>
          {isLoading ? (
            <div className="mt-4 space-y-2">{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-20 w-full" />)}</div>
          ) : (
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {projects.map((p: Record<string, unknown>) => (
                <Link key={String(p.id)} to="/projects/project-detail" search={{ id: String(p.id) }}
                  className="group rounded-xl border border-border/70 p-4 transition-all hover:-translate-y-0.5 hover:shadow-elevated">
                  <div className="flex items-center gap-2 text-[10px]">
                    <Badge variant="secondary" className="rounded-full capitalize">{String(p.project_type ?? p.category ?? "general")}</Badge>
                    <Badge variant="secondary" className="rounded-full bg-accent text-accent-foreground"><Landmark className="mr-1 h-3 w-3" /> Project</Badge>
                  </div>
                  <div className="mt-2 truncate text-sm font-semibold">{String(p.name ?? "")}</div>
                  <div className="text-[11px] text-muted-foreground">{String(p.location ?? "—")} · ₹{(Number(p.sanctioned_amount ?? 0) / 100000).toFixed(1)}L</div>
                  <div className="mt-3 flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-semibold tabular-nums">{Number(p.progress_percentage ?? 0).toFixed(0)}%</span>
                  </div>
                  <Progress value={Number(p.progress_percentage ?? 0)} className="mt-1 h-1.5" />
                </Link>
              ))}
              {projects.length === 0 && <div className="col-span-2 py-8 text-center text-sm text-muted-foreground">No projects found.</div>}
            </div>
          )}
        </Card>
      </div>
    </>
  );
}

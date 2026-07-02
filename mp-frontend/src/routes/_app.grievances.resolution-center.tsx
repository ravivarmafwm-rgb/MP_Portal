import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { AlertOctagon, Clock, AlertTriangle, CheckCircle2, Flame, Plus, ArrowRight, Star } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchGrievances, fetchGrievanceStats } from "@/lib/api";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/grievances/resolution-center")({
  head: () => ({ meta: [{ title: "Resolution Center — Grievances" }] }),
  component: ResolutionCenter,
});

// Mock recent feedback (in production this would come from grievance_feedback table)
const mockFeedback = [
  { citizen: "Ravi Reddy",    rating: 5, comment: "Quick action by MP office. Very satisfied." },
  { citizen: "Anitha Rao",    rating: 4, comment: "Issue resolved within expected time." },
  { citizen: "Mohan Singh",   rating: 3, comment: "Took longer than expected but resolved." },
  { citizen: "Sunita Devi",   rating: 5, comment: "Excellent response. Thank you!" },
  { citizen: "Rajesh Kumar",  rating: 4, comment: "Good resolution, follow-up was prompt." },
];

function ResolutionCenter() {
  const { data: statsData } = useQuery({ queryKey: ["grievance-stats-rc"], queryFn: fetchGrievanceStats, staleTime: 30_000 });
  const { data: urgentData, isLoading: loadingUrgent } = useQuery({
    queryKey: ["grievances-urgent"],
    queryFn: () => fetchGrievances({ priority: "urgent", per_page: 5 }),
    staleTime: 15_000,
  });
  const { data: escalatedData } = useQuery({
    queryKey: ["grievances-escalated-rc"],
    queryFn: () => fetchGrievances({ status: "escalated", per_page: 5 }),
    staleTime: 15_000,
  });
  const { data: resolvedData } = useQuery({
    queryKey: ["grievances-resolved-rc"],
    queryFn: () => fetchGrievances({ status: "resolved", per_page: 5 }),
    staleTime: 15_000,
  });
  const { data: pendingData } = useQuery({
    queryKey: ["grievances-pending-rc"],
    queryFn: () => fetchGrievances({ status: "pending", per_page: 5 }),
    staleTime: 15_000,
  });
  const { data: highData } = useQuery({
    queryKey: ["grievances-high-rc"],
    queryFn: () => fetchGrievances({ priority: "high", per_page: 5 }),
    staleTime: 15_000,
  });

  const buckets = [
    { icon: AlertOctagon, title: "Requires Attention",   tone: "bg-destructive/10 text-destructive", items: urgentData?.data ?? [],   delay: 0 },
    { icon: Clock,        title: "Pending",               tone: "bg-warning/15 text-warning",         items: pendingData?.data ?? [],  delay: 1 },
    { icon: AlertTriangle,title: "Escalated",             tone: "bg-info/10 text-info",               items: escalatedData?.data ?? [],delay: 2 },
    { icon: CheckCircle2, title: "Recently Resolved",     tone: "bg-success/10 text-success",         items: resolvedData?.data ?? [], delay: 3 },
    { icon: Flame,        title: "High Priority",         tone: "bg-destructive/10 text-destructive", items: highData?.data ?? [],     delay: 4 },
  ];

  return (
    <>
      <PageHeader
        title="Resolution Center"
        description="Operations cockpit — what needs attention right now."
        actions={
          <>
            <Button variant="outline" size="sm" className="gap-1.5"><CheckCircle2 className="h-4 w-4" /> Generate Report</Button>
            <Button asChild size="sm" className="gap-1.5"><Link to="/grievances/list"><Plus className="h-4 w-4" /> Register Complaint</Link></Button>
          </>
        }
      />
      <div className="space-y-6 p-4 md:p-8">
        {/* Summary stats */}
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
          {[
            { l: "Total",     v: statsData?.total     ?? 0, tone: "text-foreground"  },
            { l: "Pending",   v: statsData?.pending   ?? 0, tone: "text-destructive" },
            { l: "In Progress",v: statsData?.in_progress ?? 0, tone: "text-warning"  },
            { l: "Escalated", v: statsData?.escalated ?? 0, tone: "text-info"        },
            { l: "Resolved",  v: statsData?.resolved  ?? 0, tone: "text-success"     },
            { l: "Closed",    v: statsData?.closed    ?? 0, tone: "text-muted-foreground" },
          ].map((s) => (
            <Card key={s.l} className="p-3 text-center">
              <div className={`font-display text-2xl font-bold tabular-nums ${s.tone}`}>{s.v}</div>
              <div className="text-xs text-muted-foreground">{s.l}</div>
            </Card>
          ))}
        </div>

        <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {buckets.map((b) => (
            <Bucket key={b.title} {...b} />
          ))}

          {/* Citizen Feedback */}
          <Card className="p-5">
            <h3 className="font-display text-base font-bold">Citizen Feedback</h3>
            <p className="text-xs text-muted-foreground">Satisfaction snapshot</p>
            <div className="mt-4 space-y-2">
              {mockFeedback.map((f, i) => (
                <div key={i} className="rounded-lg border border-border/70 p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold">{f.citizen}</span>
                    <span className="text-xs text-warning">
                      {"★".repeat(f.rating)}<span className="text-muted-foreground/40">{"★".repeat(5 - f.rating)}</span>
                    </span>
                  </div>
                  <p className="mt-0.5 text-[11px] text-muted-foreground italic">"{f.comment}"</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}

function Bucket({ icon: Icon, title, tone, items, delay }: {
  icon: typeof AlertOctagon; title: string; tone: string;
  items: Record<string, unknown>[]; delay: number;
}) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: delay * 0.06 }}>
      <Card className="flex h-full flex-col p-5">
        <div className="flex items-center gap-2">
          <div className={cn("grid h-9 w-9 place-items-center rounded-lg", tone)}><Icon className="h-4 w-4" /></div>
          <div>
            <h3 className="font-display text-sm font-bold">{title}</h3>
            <div className="text-[11px] text-muted-foreground">{items.length} cases</div>
          </div>
        </div>
        <div className="mt-4 flex-1 space-y-2">
          {items.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-4">No cases</p>
          ) : (
            items.map((g) => (
              <Link key={String(g.id)} to="/grievances/detail" search={{ id: String(g.id) }} className="block">
                <div className="rounded-lg border border-border/70 bg-card p-2.5 transition-colors hover:bg-muted/40">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-muted-foreground">{String(g.grievance_number ?? "")}</span>
                    <Badge variant="secondary" className="bg-muted text-[10px] capitalize">{String(g.priority ?? "")}</Badge>
                  </div>
                  <div className="mt-1 truncate text-xs font-medium">{String(g.subject ?? "")}</div>
                  <div className="text-[10px] text-muted-foreground">{String(g.citizen_name ?? "")} · {String(g.created_at ?? "").substring(0, 10)}</div>
                </div>
              </Link>
            ))
          )}
        </div>
        <Button asChild variant="ghost" size="sm" className="mt-3 gap-1 text-xs">
          <Link to="/grievances/list">View all <ArrowRight className="h-3 w-3" /></Link>
        </Button>
      </Card>
    </motion.div>
  );
}

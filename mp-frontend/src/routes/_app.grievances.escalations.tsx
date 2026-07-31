import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  AlertOctagon,
  AlertTriangle,
  Clock,
  UserX,
  ChevronRight,
  ArrowDown,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchGrievances, fetchGrievanceStats } from "@/lib/api";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/grievances/escalations")({
  head: () => ({ meta: [{ title: "Escalations — Grievances" }] }),
  component: EscalationsPage,
});

const escalationLevels = [
  {
    level: 1,
    role: "Volunteer",
    description: "Field registration and initial triage",
    color: "info",
  },
  {
    level: 2,
    role: "Coordinator",
    description: "Local issue resolution and department routing",
    color: "primary",
  },
  {
    level: 3,
    role: "MP Office",
    description: "Office-level review and priority handling",
    color: "warning",
  },
  {
    level: 4,
    role: "Department",
    description: "Official department escalation and action",
    color: "destructive",
  },
  {
    level: 5,
    role: "MP Review",
    description: "Direct MP intervention and final resolution",
    color: "destructive",
  },
];

const toneMap: Record<string, string> = {
  info: "from-info/30 to-info/5 ring-info/30 text-info",
  primary: "from-primary/30 to-primary/5 ring-primary/30 text-primary",
  warning: "from-warning/30 to-warning/5 ring-warning/30 text-warning",
  destructive:
    "from-destructive/30 to-destructive/5 ring-destructive/30 text-destructive",
};

function EscalationsPage() {
  const { data: stats } = useQuery({
    queryKey: ["grievance-stats-esc"],
    queryFn: fetchGrievanceStats,
    staleTime: 30_000,
  });
  const { data: escalatedData, isLoading } = useQuery({
    queryKey: ["grievances-escalated"],
    queryFn: () => fetchGrievances({ status: "escalated", per_page: 20 }),
    staleTime: 15_000,
  });

  const escalated = escalatedData?.data ?? [];
  const escalatedCount = stats?.escalated ?? escalated.length;

  const buckets = [
    {
      l: "Critical Cases",
      v: stats?.urgent ?? 0,
      icon: AlertOctagon,
      tone: "bg-destructive/10 text-destructive",
    },
    {
      l: "High Priority",
      v: escalatedCount,
      icon: AlertTriangle,
      tone: "bg-warning/15 text-warning",
    },
    {
      l: "Overdue",
      v: stats?.overdue ?? 0,
      icon: Clock,
      tone: "bg-info/10 text-info",
    },
    {
      l: "Unassigned",
      v: stats?.unassigned ?? 0,
      icon: UserX,
      tone: "bg-muted text-muted-foreground",
    },
  ];

  return (
    <>
      <PageHeader
        title="Escalation Center"
        description="Cases that need leadership attention — escalation workflow across 5 levels."
      />
      <div className="space-y-6 p-4 md:p-8">
        <div className="grid gap-3 md:grid-cols-4">
          {buckets.map((b, i) => (
            <motion.div
              key={b.l}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="p-4">
                <div
                  className={cn(
                    "grid h-9 w-9 place-items-center rounded-lg",
                    b.tone,
                  )}
                >
                  <b.icon className="h-4 w-4" />
                </div>
                <div className="mt-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {b.l}
                </div>
                <div className="mt-1 font-display text-2xl font-bold tabular-nums">
                  {b.v}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Escalation workflow */}
        <Card className="p-5">
          <h3 className="font-display text-base font-bold">
            Escalation Workflow
          </h3>
          <p className="text-xs text-muted-foreground">
            5-tier escalation pipeline · case count at each level
          </p>
          <div className="mt-6 grid items-stretch gap-3 md:grid-cols-5">
            {escalationLevels.map((l, i) => (
              <motion.div
                key={l.level}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="relative"
              >
                <Card
                  className={cn(
                    "h-full bg-gradient-to-br p-4 ring-1",
                    toneMap[l.color],
                  )}
                >
                  <div className="flex items-center justify-between">
                    <Badge
                      variant="secondary"
                      className="bg-background/80 font-mono text-[10px]"
                    >
                      L{l.level}
                    </Badge>
                  </div>
                  <h4 className="mt-3 font-display text-sm font-bold text-foreground">
                    {l.role}
                  </h4>
                  <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
                    {l.description}
                  </p>
                </Card>
                {i < escalationLevels.length - 1 && (
                  <ChevronRight className="absolute -right-3 top-1/2 z-10 hidden h-5 w-5 -translate-y-1/2 text-muted-foreground md:block" />
                )}
                {i < escalationLevels.length - 1 && (
                  <ArrowDown className="mx-auto mt-2 h-4 w-4 text-muted-foreground md:hidden" />
                )}
              </motion.div>
            ))}
          </div>
        </Card>

        {/* Currently escalated list */}
        <Card className="p-5">
          <h3 className="font-display text-base font-bold">
            Currently Escalated
          </h3>
          <p className="text-xs text-muted-foreground">
            Cases at escalated status — requiring immediate action
          </p>
          <div className="mt-4 space-y-2">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))
            ) : escalated.length === 0 ? (
              <div className="py-8 text-center text-sm text-muted-foreground">
                No escalated grievances — great work!
              </div>
            ) : (
              escalated.map((g: Record<string, unknown>) => (
                <Link
                  key={String(g.id)}
                  to="/grievances/detail"
                  search={{ id: String(g.id) }}
                  className="block"
                >
                  <div className="flex items-center gap-3 rounded-lg border border-border/70 bg-card p-3 transition-colors hover:bg-muted/40">
                    <div className="grid h-9 w-9 place-items-center rounded-lg bg-destructive/10 text-destructive">
                      <AlertTriangle className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[11px] text-muted-foreground">
                          {String(g.grievance_number ?? "")}
                        </span>
                        <Badge
                          variant="secondary"
                          className="bg-destructive/10 text-[10px] text-destructive"
                        >
                          Escalated
                        </Badge>
                        <Badge
                          variant="secondary"
                          className="bg-warning/15 text-[10px] text-warning capitalize"
                        >
                          {String(g.priority ?? "high")}
                        </Badge>
                      </div>
                      <div className="truncate text-sm font-medium">
                        {String(g.subject ?? "")}
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        {String(g.citizen_name ?? "")} ·{" "}
                        {String(g.created_at ?? "").substring(0, 10)}
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      Review
                    </Button>
                  </div>
                </Link>
              ))
            )}
          </div>
        </Card>
      </div>
    </>
  );
}

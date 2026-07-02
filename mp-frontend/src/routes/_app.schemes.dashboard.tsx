import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { FileBadge, CheckCircle2, Clock, XCircle, Users } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchSchemeStats, fetchSchemes } from "@/lib/api";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/schemes/dashboard")({
  head: () => ({ meta: [{ title: "Schemes — Command Center" }] }),
  component: SchemesDashboardPage,
});

function SchemesDashboardPage() {
  const { data: stats } = useQuery({ queryKey: ["scheme-stats"], queryFn: fetchSchemeStats, staleTime: 60_000 });
  const { data: schemesData, isLoading } = useQuery({ queryKey: ["schemes-list"], queryFn: () => fetchSchemes({ active_only: "1", per_page: 10 }), staleTime: 60_000 });
  const schemes = schemesData?.data ?? [];

  const kpis = [
    { label: "Active Schemes",      value: stats?.active_schemes ?? 0,      icon: FileBadge,   tone: "bg-primary/10 text-primary"   },
    { label: "Total Applications",  value: stats?.total_applications ?? 0,   icon: Clock,       tone: "bg-info/10 text-info"         },
    { label: "Approved",            value: stats?.approved ?? 0,             icon: CheckCircle2,tone: "bg-success/10 text-success"   },
    { label: "Beneficiaries",       value: stats?.total_beneficiaries ?? 0,  icon: Users,       tone: "bg-warning/15 text-warning"   },
  ];

  return (
    <>
      <PageHeader title="Scheme Command Center" description="Welfare schemes, applications and beneficiary tracking" />
      <div className="space-y-6 p-4 md:p-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {kpis.map((k, i) => (
            <motion.div key={k.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
              <Card className="p-5">
                <div className={cn("grid h-10 w-10 place-items-center rounded-xl", k.tone)}><k.icon className="h-5 w-5" /></div>
                <div className="mt-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">{k.label}</div>
                <div className="mt-1 font-display text-3xl font-bold tabular-nums">{k.value.toLocaleString()}</div>
              </Card>
            </motion.div>
          ))}
        </div>

        {stats && (
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { label: "Pending Review", value: stats.pending, tone: "text-warning", icon: Clock },
              { label: "Approved",       value: stats.approved, tone: "text-success", icon: CheckCircle2 },
              { label: "Rejected",       value: stats.rejected, tone: "text-destructive", icon: XCircle },
            ].map((s) => (
              <Card key={s.label} className="p-4 flex items-center gap-4">
                <s.icon className={cn("h-8 w-8", s.tone)} />
                <div>
                  <div className={cn("font-display text-2xl font-bold tabular-nums", s.tone)}>{s.value ?? 0}</div>
                  <div className="text-xs text-muted-foreground">{s.label}</div>
                </div>
              </Card>
            ))}
          </div>
        )}

        <Card className="overflow-hidden">
          <div className="flex items-center justify-between border-b border-border/70 bg-muted/30 p-4">
            <h3 className="font-semibold">Active Schemes</h3>
            <Button variant="ghost" size="sm" asChild><Link to="/schemes/scheme-catalog">View All</Link></Button>
          </div>
          {isLoading ? (
            <div className="space-y-2 p-4">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}</div>
          ) : (
            <div className="divide-y divide-border/60">
              {schemes.map((s: Record<string, unknown>, i: number) => (
                <motion.div key={String(s.id)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
                  className="flex items-center gap-4 p-4 hover:bg-muted/30">
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold">{String(s.name ?? "")}</div>
                    <div className="text-xs text-muted-foreground">{String(s.category ?? "—")} · Code: {String(s.code ?? "—")}</div>
                  </div>
                  <Badge variant="secondary" className={s.is_active ? "bg-success/10 text-success" : "bg-muted"}>
                    {s.is_active ? "Active" : "Inactive"}
                  </Badge>
                </motion.div>
              ))}
              {schemes.length === 0 && <div className="p-8 text-center text-sm text-muted-foreground">No schemes found.</div>}
            </div>
          )}
        </Card>
      </div>
    </>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  MapPin,
  Users,
  MessageSquareWarning,
  HardHat,
  HeartHandshake,
  Building2,
  Vote,
  Landmark,
} from "lucide-react";
import { RoleGuard } from "@/components/auth/RoleGuard";
import { PageHeader } from "@/components/layout/PageHeader";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchMlaDashboardStats } from "@/lib/api";

export const Route = createFileRoute("/_app/mla")({
  head: () => ({ meta: [{ title: "MLA Assembly Dashboard — MP Platform" }] }),
  component: MlaDashboardPage,
});

function MlaDashboardPage() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["mla-dashboard-stats"],
    queryFn: fetchMlaDashboardStats,
    staleTime: 30_000,
    refetchInterval: 60_000,
  });

  const kpis = stats?.kpis ?? {};

  return (
    <RoleGuard route="/mla">
      <PageHeader
        title="Assembly Constituency Dashboard"
        description={
          stats
            ? `${stats.assembly_name} · ${stats.constituency}`
            : "Your assigned assembly constituency"
        }
      />
      <div className="space-y-6 p-4 md:p-8">
        <motion.section
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-border/60 bg-gradient-to-br from-info/10 via-card to-primary/5 p-6"
        >
          <p className="text-sm text-muted-foreground">{stats?.date_label}</p>
          <h1 className="mt-1 text-2xl font-bold">
            Good day,{" "}
            <span className="text-primary">
              {stats?.mla_name ?? "Hon. MLA"}
            </span>
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Assembly: <strong>{stats?.assembly_name ?? "—"}</strong> — scoped
            view only
          </p>
        </motion.section>

        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-[112px] rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <KpiCard
              label="Mandals"
              value={kpis.mandals ?? 0}
              icon={Landmark}
              tone="primary"
              index={0}
            />
            <KpiCard
              label="Villages"
              value={kpis.villages ?? 0}
              icon={MapPin}
              tone="info"
              index={1}
            />
            <KpiCard
              label="Polling Booths"
              value={kpis.booths ?? 0}
              icon={Vote}
              tone="warning"
              index={2}
            />
            <KpiCard
              label="Citizens"
              value={kpis.citizens ?? 0}
              icon={Users}
              tone="success"
              index={3}
            />
            <KpiCard
              label="Beneficiaries"
              value={kpis.beneficiaries ?? 0}
              icon={Building2}
              tone="primary"
              index={4}
            />
            <KpiCard
              label="Local Grievances"
              value={kpis.local_grievances ?? 0}
              icon={MessageSquareWarning}
              tone="destructive"
              index={5}
            />
            <KpiCard
              label="Local Projects"
              value={kpis.local_projects ?? 0}
              icon={HardHat}
              tone="info"
              index={6}
            />
            <KpiCard
              label="Volunteers"
              value={kpis.volunteers ?? 0}
              icon={HeartHandshake}
              tone="success"
              index={7}
            />
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="p-6">
            <h3 className="font-bold mb-4">Mandals</h3>
            <div className="space-y-2">
              {(stats?.mandals ?? []).map(
                (m: { id: string; name: string; villages: number }) => (
                  <div
                    key={m.id}
                    className="flex justify-between rounded-lg border p-3 text-sm"
                  >
                    <span className="font-medium">{m.name}</span>
                    <Badge variant="secondary">{m.villages} villages</Badge>
                  </div>
                ),
              )}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-bold mb-4">Volunteer Network</h3>
            <div className="space-y-2">
              {(stats?.volunteer_network ?? []).map(
                (
                  v: { name: string; village: string; score: number },
                  i: number,
                ) => (
                  <div
                    key={i}
                    className="flex justify-between rounded-lg border p-3 text-sm"
                  >
                    <div>
                      <div className="font-medium">{v.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {v.village}
                      </div>
                    </div>
                    <Badge>{v.score} pts</Badge>
                  </div>
                ),
              )}
            </div>
          </Card>
        </div>
      </div>
    </RoleGuard>
  );
}

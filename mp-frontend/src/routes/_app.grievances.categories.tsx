import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchGrievanceCategories, fetchGrievanceStats } from "@/lib/api";

export const Route = createFileRoute("/_app/grievances/categories")({
  head: () => ({ meta: [{ title: "Categories — Grievances" }] }),
  component: CategoriesPage,
});

const CATEGORY_ICONS: Record<string, string> = {
  Roads: "🛣️",
  "Water Supply": "💧",
  Drainage: "🚿",
  Health: "🏥",
  Education: "🎓",
  Welfare: "🤝",
  Agriculture: "🌾",
  Electricity: "⚡",
  Revenue: "📋",
  Railways: "🚂",
  Passport: "📜",
  Pension: "👴",
};

function CategoriesPage() {
  const { data: categories, isLoading } = useQuery({
    queryKey: ["grievance-categories-detail"],
    queryFn: fetchGrievanceCategories,
    staleTime: 60_000,
  });
  const { data: stats } = useQuery({
    queryKey: ["grievance-stats-cats"],
    queryFn: fetchGrievanceStats,
    staleTime: 60_000,
  });

  const cats = categories ?? [];
  const maxVolume = Math.max(...cats.map((c) => c.grievances_count), 1);

  return (
    <>
      <PageHeader
        title="Category Management"
        description="Volume, resolution rate and SLA performance across complaint categories."
      />
      <div className="space-y-6 p-4 md:p-8">
        {/* Summary */}
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
          {[
            { l: "Total", v: stats?.total ?? 0, tone: "text-foreground" },
            { l: "Pending", v: stats?.pending ?? 0, tone: "text-destructive" },
            { l: "Assigned", v: stats?.assigned ?? 0, tone: "text-info" },
            { l: "Escalated", v: stats?.escalated ?? 0, tone: "text-warning" },
            { l: "Resolved", v: stats?.resolved ?? 0, tone: "text-success" },
            { l: "This Week", v: stats?.this_week ?? 0, tone: "text-primary" },
          ].map((s) => (
            <Card key={s.l} className="p-3 text-center">
              <div
                className={`font-display text-2xl font-bold tabular-nums ${s.tone}`}
              >
                {s.v ?? 0}
              </div>
              <div className="text-xs text-muted-foreground">{s.l}</div>
            </Card>
          ))}
        </div>

        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-44 rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {cats.map((c, i) => {
              const volume = c.grievances_count;
              const slaFraction = c.sla_days;
              const resolutionRate = c.resolution_rate;
              const icon = CATEGORY_ICONS[String(c.name ?? "")] ?? "📋";
              return (
                <motion.div
                  key={String(c.id)}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card className="p-5 transition-all hover:shadow-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="grid h-12 w-12 place-items-center rounded-xl bg-muted text-2xl">
                          {icon}
                        </div>
                        <div>
                          <h3 className="font-display text-base font-bold">
                            {String(c.name ?? "")}
                          </h3>
                          <div className="text-xs text-muted-foreground tabular-nums">
                            {volume.toLocaleString()} complaints
                          </div>
                        </div>
                      </div>
                      <Badge variant="secondary">
                        {c.resolved_grievances_count} resolved
                      </Badge>
                    </div>
                    <div className="mt-4 space-y-3">
                      <div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Volume</span>
                          <span className="font-semibold tabular-nums">
                            {volume}
                          </span>
                        </div>
                        <Progress
                          value={maxVolume > 0 ? (volume / maxVolume) * 100 : 0}
                          className="mt-1 h-1.5"
                        />
                      </div>
                      <div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">
                            Est. Resolution Rate
                          </span>
                          <span className="font-semibold tabular-nums">
                            {resolutionRate}%
                          </span>
                        </div>
                        <Progress
                          value={resolutionRate}
                          className="mt-1 h-1.5"
                        />
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="inline-flex items-center gap-1 text-muted-foreground">
                          <Clock className="h-3 w-3" /> SLA Days
                        </span>
                        <span className="font-semibold tabular-nums">
                          {slaFraction} days
                        </span>
                      </div>
                      {c.severity && (
                        <Badge
                          variant="secondary"
                          className="text-[10px] capitalize"
                        >
                          {String(c.severity)}
                        </Badge>
                      )}
                    </div>
                  </Card>
                </motion.div>
              );
            })}
            {cats.length === 0 && (
              <div className="col-span-3 py-12 text-center text-sm text-muted-foreground">
                No categories found.
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

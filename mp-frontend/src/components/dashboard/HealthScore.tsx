import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Activity, CheckCircle2, TrendingUp } from "lucide-react";
import { EmptyState } from "@/components/layout/EmptyState";

interface HealthStats {
  health_score?: {
    project_completion?: number;
    grievance_resolution?: number;
    scheme_reach?: number;
    volunteer_activity?: number;
  };
}

export function HealthScore({
  score = 0,
  stats,
}: {
  score?: number;
  stats?: HealthStats;
}) {
  const hs = stats?.health_score;
  const factors = hs
    ? [
        {
          label: "Project Completion",
          value: hs.project_completion ?? 0,
          tone: "text-info",
        },
        {
          label: "Grievance Resolution",
          value: hs.grievance_resolution ?? 0,
          tone: "text-success",
        },
        {
          label: "Scheme Reach",
          value: hs.scheme_reach ?? 0,
          tone: "text-primary",
        },
        {
          label: "Volunteer Activity",
          value: hs.volunteer_activity ?? 0,
          tone: "text-warning",
        },
      ]
    : [];

  const label =
    score >= 75 ? "Healthy" : score >= 50 ? "Fair" : "Needs attention";
  const hasData = score > 0 || factors.some((f) => f.value > 0);

  return (
    <Card className="relative overflow-hidden p-6 shadow-card">
      <div className="absolute inset-x-0 -top-24 h-48 bg-[radial-gradient(ellipse_at_top,oklch(0.65_0.16_235/0.18),transparent_70%)]" />
      <div className="relative grid gap-6 sm:grid-cols-[1fr_auto] sm:items-center">
        <div>
          <div className="flex items-center gap-2 text-label">
            <Activity className="h-3.5 w-3.5 text-primary" />
            Constituency Health
          </div>
          {!hasData ? (
            <EmptyState
              icon={Activity}
              title="No health score data"
              description="Health score will be calculated as data is submitted"
            />
          ) : (
            <>
              <h3 className="mt-1 text-h2 font-bold">
                {score >= 75
                  ? "Operating in good shape"
                  : score >= 50
                    ? "Needs improvement"
                    : "Requires immediate attention"}
              </h3>
              <p className="mt-1 max-w-md text-sm text-muted-foreground">
                Composite index of grievance resolution, scheme reach, project
                pace and volunteer activity across the constituency.
              </p>
              <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-success/10 px-3 py-1 text-xs font-semibold text-success">
                <TrendingUp className="h-3.5 w-3.5" /> Live from PostgreSQL
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {factors.map((f, i) => (
                  <motion.div
                    key={f.label}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 + i * 0.06 }}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium">{f.label}</span>
                      <span className={"tabular-nums font-semibold " + f.tone}>
                        {f.value}
                      </span>
                    </div>
                    <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${f.value}%` }}
                        transition={{
                          duration: 0.9,
                          delay: 0.3 + i * 0.06,
                          ease: "easeOut",
                        }}
                        className="h-full rounded-full bg-linear-to-r from-primary to-info"
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </div>
        {hasData && (
          <div className="relative grid h-44 w-44 place-items-center justify-self-center sm:h-52 sm:w-52">
            <div className="absolute flex flex-col items-center">
              <span className="text-label">Score</span>
              <span className="font-display text-5xl font-bold tabular-nums">
                {score}
              </span>
              <span className="flex items-center gap-1 text-xs text-success">
                <CheckCircle2 className="h-3 w-3" /> {label}
              </span>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { MessageSquareWarning } from "lucide-react";
import { EmptyState } from "@/components/layout/EmptyState";

interface GrievanceData {
  buckets?: { label: string; value: number; tone: string }[];
  trend?: { d: string; filed: number; resolved: number }[];
  categories?: { name: string; value: number }[];
}

export function GrievanceCenter({ grievanceData }: { grievanceData?: GrievanceData }) {
  const buckets = grievanceData?.buckets ?? [];
  const trend = grievanceData?.trend ?? [];
  const categories = grievanceData?.categories ?? [];

  const resolvedCount = buckets.find((b) => b.label === "Resolved")?.value ?? 0;
  const totalCount = buckets.reduce((s, b) => s + b.value, 0);
  const resolutionRate = totalCount > 0 ? Math.round((resolvedCount / totalCount) * 100) : 0;

  const hasData = buckets.length > 0 || trend.length > 0 || categories.length > 0;

  return (
    <Card className="overflow-hidden p-6 shadow-card">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-h3 font-bold">Grievance command center</h3>
          <p className="text-xs text-muted-foreground">Live snapshot across all booths and mandals.</p>
        </div>
        {hasData && (
          <Badge variant="secondary" className="gap-1 bg-success/10 text-success">
            {resolutionRate}% resolution rate
          </Badge>
        )}
      </div>

      {!hasData ? (
        <EmptyState icon={MessageSquareWarning} title="No grievance data" description="Grievance data will appear here as they are submitted" />
      ) : (
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {buckets.map((b, i) => (
            <motion.div
              key={b.label}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.04 }}
              className="rounded-lg border border-border/70 bg-muted/30 p-3"
            >
              <div className="text-label">{b.label}</div>
              <div className="mt-1 flex items-center justify-between">
                <span className="font-display text-2xl font-bold tabular-nums">{b.value}</span>
                <span className={"h-2 w-2 rounded-full " + (b.tone?.split(" ")[0] ?? "bg-muted")} />
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </Card>
  );
}
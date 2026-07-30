import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertOctagon, AlertTriangle, Clock, ShieldAlert } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { EmptyState } from "@/components/layout/EmptyState";

type Severity = "Critical" | "High" | "Medium" | "Low";

interface UrgentItem {
  title: string;
  meta: string;
  severity: Severity;
}

const sevTone: Record<Severity, string> = {
  Critical: "bg-destructive/15 text-destructive border-destructive/30",
  High: "bg-warning/15 text-warning border-warning/30",
  Medium: "bg-info/15 text-info border-info/30",
  Low: "bg-muted text-muted-foreground border-border",
};

const sevIcons: Record<Severity, typeof AlertOctagon> = {
  Critical: AlertOctagon,
  High: ShieldAlert,
  Medium: Clock,
  Low: AlertTriangle,
};

export function UrgentPanel({ urgent }: { urgent?: UrgentItem[] }) {
  const items = urgent ?? [];

  return (
    <Card className="p-6 shadow-card">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-destructive/10 text-destructive">
            <ShieldAlert className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-h3 font-bold">Needs your attention</h3>
            <p className="text-xs text-muted-foreground">
              Triaged by impact and SLA
            </p>
          </div>
        </div>
        {items.length > 0 && (
          <Badge
            variant="secondary"
            className="bg-destructive/10 text-destructive"
          >
            {items.length} items
          </Badge>
        )}
      </div>
      {items.length === 0 ? (
        <EmptyState
          icon={AlertTriangle}
          title="Nothing urgent"
          description="You're all caught up!"
        />
      ) : (
        <div className="space-y-2">
          {items.map((it, i) => {
            const sev = (it.severity as Severity) || "Medium";
            const Icon = sevIcons[sev] ?? AlertTriangle;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="flex w-full items-start gap-3 rounded-lg border border-border/60 bg-card p-3 text-left transition-colors hover:bg-muted/40"
              >
                <div
                  className={cn(
                    "grid h-8 w-8 shrink-0 place-items-center rounded-md border",
                    sevTone[sev],
                  )}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{it.title}</p>
                  <p className="text-[11px] text-muted-foreground">{it.meta}</p>
                </div>
                <Badge
                  variant="secondary"
                  className={cn("border shrink-0", sevTone[sev])}
                >
                  {sev}
                </Badge>
              </motion.div>
            );
          })}
        </div>
      )}
    </Card>
  );
}

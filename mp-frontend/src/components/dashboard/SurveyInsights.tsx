import { Card } from "@/components/ui/card";
import {
  Briefcase,
  Tractor,
  Home as HomeIcon,
  HeartPulse,
  ArrowUpRight,
  ClipboardList,
} from "lucide-react";
import { motion } from "framer-motion";
import { EmptyState } from "@/components/layout/EmptyState";

interface SurveyItem {
  title: string;
  responses: number;
  delta?: string;
  insight?: string;
}

const icons = [Briefcase, Tractor, HomeIcon, HeartPulse];
const colors = [
  "from-primary to-info",
  "from-success to-info",
  "from-warning to-primary",
  "from-destructive to-warning",
];

export function SurveyInsights({ surveys }: { surveys?: SurveyItem[] }) {
  const list = surveys ?? [];

  return (
    <Card className="p-6 shadow-card">
      <div className="mb-4">
        <h3 className="text-h3 font-bold">Survey insights</h3>
        <p className="text-xs text-muted-foreground">
          Aggregated responses across ground campaigns
        </p>
      </div>
      {list.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="No survey data"
          description="Survey insights will show up as responses are collected"
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {list.slice(0, 4).map((s, i) => {
            const Icon = icons[i % icons.length];
            const color = colors[i % colors.length];
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="group relative overflow-hidden rounded-xl border border-border/70 bg-card p-4 transition-all hover:shadow-elevated"
              >
                <div
                  className={
                    "absolute -right-10 -top-10 h-24 w-24 rounded-full bg-gradient-to-br opacity-20 blur-2xl " +
                    color
                  }
                />
                <div className="relative flex items-start justify-between">
                  <div
                    className={
                      "grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br text-white " +
                      color
                    }
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="inline-flex items-center gap-0.5 rounded-md bg-success/10 px-1.5 py-0.5 text-[10px] font-semibold text-success">
                    <ArrowUpRight className="h-3 w-3" />
                    {s.delta ?? "+0%"}
                  </span>
                </div>
                <h4 className="mt-3 text-sm font-semibold">{s.title}</h4>
                <div className="mt-0.5 font-display text-2xl font-bold tabular-nums">
                  {(s.responses ?? 0).toLocaleString("en-IN")}
                </div>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  {s.insight ?? "Responses collected"}
                </p>
              </motion.div>
            );
          })}
        </div>
      )}
    </Card>
  );
}

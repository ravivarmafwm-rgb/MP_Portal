import { motion } from "framer-motion";
import { ArrowDownRight, ArrowUpRight, type LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { AnimatedNumber } from "./AnimatedNumber";

type Tone = "primary" | "success" | "warning" | "info" | "destructive";

const toneMap: Record<Tone, { bg: string; text: string; ring: string }> = {
  primary: {
    bg: "bg-primary/10",
    text: "text-primary",
    ring: "ring-primary/20",
  },
  success: {
    bg: "bg-success/10",
    text: "text-success",
    ring: "ring-success/20",
  },
  warning: {
    bg: "bg-warning/15",
    text: "text-warning",
    ring: "ring-warning/20",
  },
  info: { bg: "bg-info/10", text: "text-info", ring: "ring-info/20" },
  destructive: {
    bg: "bg-destructive/10",
    text: "text-destructive",
    ring: "ring-destructive/20",
  },
};

export function KpiCard({
  label,
  value,
  suffix,
  prefix,
  delta,
  trend = "up",
  icon: Icon,
  hint,
  tone = "primary",
  index = 0,
  format,
}: {
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
  delta?: string;
  trend?: "up" | "down";
  icon: LucideIcon;
  hint?: string;
  tone?: Tone;
  index?: number;
  format?: (v: number) => string;
}) {
  const t = toneMap[tone];
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.35,
        delay: index * 0.04,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <Card className="group relative overflow-hidden p-5 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-elevated">
        <div
          className={cn(
            "absolute -right-8 -top-8 h-28 w-28 rounded-full opacity-50 blur-2xl transition-opacity group-hover:opacity-80",
            t.bg,
          )}
        />
        <div className="relative flex items-start justify-between">
          <div className="min-w-0">
            <p className="text-label">{label}</p>
            <p className="mt-2 font-display text-3xl font-bold tracking-tight tabular-nums">
              {prefix}
              <AnimatedNumber value={value} format={format} />
              {suffix}
            </p>
            {hint && (
              <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
            )}
          </div>
          <div
            className={cn(
              "grid h-11 w-11 shrink-0 place-items-center rounded-xl ring-1",
              t.bg,
              t.text,
              t.ring,
            )}
          >
            <Icon className="h-5 w-5" />
          </div>
        </div>
        {delta && (
          <div className="relative mt-3 flex items-center gap-1.5">
            <span
              className={cn(
                "inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-xs font-semibold",
                trend === "up"
                  ? "bg-success/10 text-success"
                  : "bg-destructive/10 text-destructive",
              )}
            >
              {trend === "up" ? (
                <ArrowUpRight className="h-3 w-3" />
              ) : (
                <ArrowDownRight className="h-3 w-3" />
              )}
              {delta}
            </span>
            <span className="text-xs text-muted-foreground">vs last month</span>
          </div>
        )}
      </Card>
    </motion.div>
  );
}

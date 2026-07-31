import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export function InfoCard({
  title,
  icon: Icon,
  items,
  footer,
  index = 0,
}: {
  title: string;
  icon: LucideIcon;
  items: { label: string; value: ReactNode }[];
  footer?: ReactNode;
  index?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
    >
      <Card className="p-5">
        <div className="flex items-center gap-2 border-b border-border/60 pb-3">
          <div className="grid h-8 w-8 place-items-center rounded-md bg-primary/10 text-primary">
            <Icon className="h-4 w-4" />
          </div>
          <h3 className="font-display text-sm font-semibold tracking-tight">
            {title}
          </h3>
        </div>
        <dl className="mt-3 grid gap-3 sm:grid-cols-2">
          {items.map((it) => (
            <div key={it.label} className="min-w-0">
              <dt className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                {it.label}
              </dt>
              <dd className="mt-0.5 truncate text-sm font-medium text-foreground">
                {it.value}
              </dd>
            </div>
          ))}
        </dl>
        {footer && (
          <div className="mt-4 border-t border-border/60 pt-3 text-xs text-muted-foreground">
            {footer}
          </div>
        )}
      </Card>
    </motion.div>
  );
}

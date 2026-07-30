import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Activity } from "lucide-react";
import { motion } from "framer-motion";
import { EmptyState } from "@/components/layout/EmptyState";

interface ActivityItem {
  who: string;
  what: string;
  when: string;
  type?: string;
}

export function ActivityFeed({ activity }: { activity?: ActivityItem[] }) {
  const items = activity ?? [];

  return (
    <Card className="p-6 shadow-card">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-h3 font-bold">Recent activity</h3>
          <p className="text-xs text-muted-foreground">
            Across booths, mandals & departments
          </p>
        </div>
        {items.length > 0 && (
          <Button variant="ghost" size="sm">
            View all
          </Button>
        )}
      </div>
      {items.length === 0 ? (
        <EmptyState
          icon={Activity}
          title="No activity yet"
          description="Activity will appear here as volunteers start submitting data"
        />
      ) : (
        <ol className="space-y-3">
          {items.slice(0, 8).map((a, i) => {
            const Icon = Activity;
            const tone = "bg-primary/10 text-primary";
            return (
              <motion.li
                key={i}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.04 }}
                className="flex items-start gap-3"
              >
                <div
                  className={
                    "grid h-8 w-8 shrink-0 place-items-center rounded-md " +
                    tone
                  }
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1 border-b border-border/60 pb-3">
                  <p className="text-sm">
                    <span className="font-semibold">{a.who}</span>{" "}
                    <span className="text-muted-foreground">— {a.what}</span>
                  </p>
                  <p className="text-[11px] text-muted-foreground">{a.when}</p>
                </div>
              </motion.li>
            );
          })}
        </ol>
      )}
    </Card>
  );
}

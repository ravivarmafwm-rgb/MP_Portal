import { Card } from "@/components/ui/card";
import { Calendar, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { EmptyState } from "@/components/layout/EmptyState";

interface EventItem { date: string; day: string; title: string; meta: string; tone: string; }

export function UpcomingEvents({ events }: { events?: EventItem[] }) {
  const list = events ?? [];

  return (
    <Card className="p-6 shadow-card">
      <div className="mb-4 flex items-center gap-2">
        <Calendar className="h-4 w-4 text-primary" />
        <h3 className="text-h3 font-bold">Upcoming events</h3>
      </div>
      {list.length === 0 ? (
        <EmptyState icon={Calendar} title="No upcoming events" description="Events will be shown here once scheduled" />
      ) : (
        <div className="relative ml-3 space-y-3 border-l border-border/70 pl-4">
          {list.map((e, i) => {
            const tone = e.tone ?? "bg-primary/10 text-primary";
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="relative"
              >
                <div className="absolute -left-[22px] top-1 grid h-3 w-3 place-items-center rounded-full bg-background ring-2 ring-primary" />
                <div className="flex items-center gap-3 rounded-lg border border-border/60 bg-card p-3">
                  <div className={"grid h-12 w-12 shrink-0 place-items-center rounded-lg " + tone}>
                    <div className="text-center leading-none">
                      <div className="text-[10px] uppercase">{e.date}</div>
                      <div className="font-display text-lg font-bold">{e.day}</div>
                    </div>
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{e.title}</p>
                    <p className="flex items-center gap-1 text-[11px] text-muted-foreground">
                      <MapPin className="h-3 w-3" />{e.meta}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
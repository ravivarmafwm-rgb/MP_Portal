import { motion } from "framer-motion";
import {
  CalendarDays,
  FileBadge,
  FileText,
  MessageSquareWarning,
  UserPlus,
  ClipboardList,
  Users,
} from "lucide-react";
import type { ActivityEvent } from "@/lib/citizen-types";

const iconMap = {
  register: UserPlus,
  visit: Users,
  scheme: FileBadge,
  grievance: MessageSquareWarning,
  survey: ClipboardList,
  meeting: CalendarDays,
  document: FileText,
};

export function ActivityTimeline({ events }: { events: ActivityEvent[] }) {
  return (
    <ol className="relative ml-3 border-l border-border/70">
      {events.map((e, i) => {
        const Icon = iconMap[e.icon];
        return (
          <motion.li
            key={e.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
            className="mb-6 ml-6"
          >
            <span className="absolute -left-[14px] grid h-7 w-7 place-items-center rounded-full bg-primary/10 ring-4 ring-background">
              <Icon className="h-3.5 w-3.5 text-primary" />
            </span>
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h4 className="text-sm font-semibold">{e.title}</h4>
              <time className="text-xs text-muted-foreground">{e.date}</time>
            </div>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {e.description}
            </p>
          </motion.li>
        );
      })}
    </ol>
  );
}

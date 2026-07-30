import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Trophy, Medal, Award, Users } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { EmptyState } from "@/components/layout/EmptyState";

interface LeaderItem {
  name: string;
  mandal: string;
  points: number;
  surveys: number;
  regs: number;
}

const rankIcons = [Trophy, Medal, Award];
const rankTones = [
  "bg-gradient-to-br from-amber-400 to-amber-600 text-white",
  "bg-gradient-to-br from-slate-300 to-slate-500 text-white",
  "bg-gradient-to-br from-orange-400 to-orange-600 text-white",
];

export function VolunteerLeaderboard({
  volunteers,
}: {
  volunteers?: LeaderItem[];
}) {
  const leaders = volunteers ?? [];

  return (
    <Card className="p-6 shadow-card">
      <div className="mb-4">
        <h3 className="text-h3 font-bold">Volunteer leaderboard</h3>
        <p className="text-xs text-muted-foreground">
          Top performers this week
        </p>
      </div>
      {leaders.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No volunteer data"
          description="Leaderboard will show up as volunteers submit data"
        />
      ) : (
        <div className="space-y-2">
          {leaders.slice(0, 5).map((v, i) => {
            const Icon = rankIcons[i];
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="flex items-center gap-3 rounded-lg border border-border/60 bg-card p-3 transition-colors hover:bg-muted/40"
              >
                <div className="grid w-6 place-items-center text-xs font-bold tabular-nums text-muted-foreground">
                  {i + 1}
                </div>
                <div className="relative">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="text-xs">
                      {v.name
                        .split(" ")
                        .map((p) => p[0])
                        .slice(0, 2)
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  {Icon && (
                    <div
                      className={cn(
                        "absolute -bottom-1 -right-1 grid h-4 w-4 place-items-center rounded-full ring-2 ring-card",
                        rankTones[i],
                      )}
                    >
                      <Icon className="h-2.5 w-2.5" />
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold">{v.name}</div>
                  <div className="text-[11px] text-muted-foreground">
                    {v.mandal}
                  </div>
                </div>
                <div className="hidden text-right sm:block">
                  <div className="text-[10px] text-muted-foreground">
                    Surveys · Regs
                  </div>
                  <div className="text-xs font-medium tabular-nums">
                    {v.surveys} · {v.regs}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-muted-foreground">
                    Points
                  </div>
                  <div className="font-display text-sm font-bold tabular-nums text-primary">
                    {v.points}
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

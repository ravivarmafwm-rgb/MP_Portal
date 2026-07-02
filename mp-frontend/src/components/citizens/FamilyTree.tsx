import { motion } from "framer-motion";
import { Crown, User } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Family } from "@/lib/citizen-data";

export function FamilyTree({ family }: { family: Family }) {
  const head = family.members.find((m) => m.isHead) ?? family.members[0];
  const others = family.members.filter((m) => m !== head);
  return (
    <div className="rounded-xl border border-border/70 bg-card p-6">
      <div className="flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35 }}
          className="relative flex flex-col items-center"
        >
          <div className="relative grid h-20 w-20 place-items-center rounded-2xl bg-gradient-to-br from-primary to-primary/70 text-primary-foreground shadow-lg">
            <Crown className="absolute -top-3 h-5 w-5 text-amber-500" />
            <span className="text-xl font-bold">
              {head.name.split(" ").map((p) => p[0]).slice(0, 2).join("")}
            </span>
          </div>
          <div className="mt-2 text-center">
            <div className="text-sm font-semibold">{head.name}</div>
            <div className="text-xs text-muted-foreground">Head · {head.age} yrs</div>
          </div>
        </motion.div>

        <div className="my-6 h-8 w-px bg-border" aria-hidden />
        <div className="relative w-full">
          <div className="absolute left-1/2 top-0 hidden h-px w-[calc(100%-4rem)] -translate-x-1/2 bg-border md:block" aria-hidden />
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
            {others.map((m, i) => (
              <motion.div
                key={m.citizenId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 + i * 0.05 }}
                className="relative flex flex-col items-center"
              >
                <div className="hidden h-6 w-px bg-border md:block" aria-hidden />
                <div
                  className={cn(
                    "mt-0 grid h-16 w-16 place-items-center rounded-2xl border bg-background text-sm font-semibold shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md",
                    m.gender === "Female" ? "border-rose-200 text-rose-700 dark:border-rose-500/30 dark:text-rose-300" : "border-sky-200 text-sky-700 dark:border-sky-500/30 dark:text-sky-300",
                  )}
                >
                  <User className="h-5 w-5" />
                </div>
                <div className="mt-2 text-center">
                  <div className="text-sm font-medium leading-tight">{m.name}</div>
                  <div className="text-[11px] text-muted-foreground">
                    {m.relation} · {m.age} yrs
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
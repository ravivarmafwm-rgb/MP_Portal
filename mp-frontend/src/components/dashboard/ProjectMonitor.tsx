import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, AlertTriangle, IndianRupee, MapPin, HardHat } from "lucide-react";
import { cn } from "@/lib/utils";
import { EmptyState } from "@/components/layout/EmptyState";

interface ProjectItem {
  name: string; category: string; location: string;
  budget: string; progress: number; status: string; due: string;
}

const statusTone: Record<string, string> = {
  "On track":  "bg-success/10 text-success",
  "Delayed":   "bg-warning/15 text-warning",
  "At risk":   "bg-destructive/15 text-destructive",
  "Completing":"bg-info/10 text-info",
  "Completing soon": "bg-info/10 text-info",
};

export function ProjectMonitor({ projects }: { projects?: ProjectItem[] }) {
  const list = projects ?? [];

  return (
    <Card className="p-6 shadow-card">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-h3 font-bold">Project monitoring</h3>
          <p className="text-xs text-muted-foreground">MPLADS & state schemes in execution</p>
        </div>
        {list.length > 0 && (
          <Button variant="ghost" size="sm" className="gap-1" asChild>
            <Link to="/projects/dashboard">All projects <ArrowRight className="h-3.5 w-3.5" /></Link>
          </Button>
        )}
      </div>
      {list.length === 0 ? (
        <EmptyState icon={HardHat} title="No projects yet" description="Project data will appear here as they are added" />
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {list.slice(0, 4).map((p, i) => {
            const tone = statusTone[p.status] ?? "bg-muted text-muted-foreground";
            const delayed = p.status === "Delayed" || p.status === "At risk";
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className={cn("group relative overflow-hidden rounded-xl border border-border/70 bg-card p-4 transition-all hover:shadow-elevated", delayed && "border-warning/40")}
              >
                {delayed && <div className="absolute right-3 top-3"><AlertTriangle className="h-4 w-4 text-warning" /></div>}
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="rounded-full text-[10px] uppercase">{p.category}</Badge>
                  <Badge variant="secondary" className={"rounded-full text-[10px] " + tone}>{p.status}</Badge>
                </div>
                <h4 className="mt-2 truncate text-sm font-semibold">{p.name}</h4>
                <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" />{p.location}</span>
                  <span className="inline-flex items-center gap-1"><IndianRupee className="h-3 w-3" />{p.budget}</span>
                </div>
                <div className="mt-3 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-semibold tabular-nums">{p.progress}%</span>
                </div>
                <div className="mt-1 h-2 overflow-hidden rounded-full bg-muted">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${p.progress}%` }}
                    transition={{ duration: 0.9, delay: 0.15 + i * 0.05, ease: "easeOut" }}
                    className={cn("h-full rounded-full", delayed ? "bg-linear-to-r from-warning to-destructive" : "bg-linear-to-r from-primary to-info")}
                  />
                </div>
                <p className="mt-2 text-[11px] text-muted-foreground">Expected · {p.due}</p>
              </motion.div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
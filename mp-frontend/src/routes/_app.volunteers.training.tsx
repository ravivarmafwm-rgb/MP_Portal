import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { GraduationCap, Play, CheckCircle2, Clock, Award, BookOpen, Plus } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { trainingPrograms } from "@/lib/volunteer-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/volunteers/training")({
  head: () => ({
    meta: [
      { title: "Training Center — Volunteers" },
      { name: "description", content: "Volunteer training programs, certifications and completion tracking." },
    ],
  }),
  component: TrainingPage,
});

const stats = [
  { l: "Programs Active", v: 4, icon: BookOpen, tone: "bg-primary/10 text-primary" },
  { l: "Volunteers Enrolled", v: 1842, icon: GraduationCap, tone: "bg-info/10 text-info" },
  { l: "Certifications Issued", v: 5320, icon: Award, tone: "bg-success/10 text-success" },
  { l: "Avg Completion", v: "82%", icon: CheckCircle2, tone: "bg-warning/15 text-warning" },
];

function TrainingPage() {
  return (
    <>
      <PageHeader
        title="Training Center"
        description="Onboarding, skill-up and certification programs for the field force."
        actions={
          <Button size="sm" className="gap-1.5"><Plus className="h-4 w-4" /> Launch Program</Button>
        }
      />
      <div className="space-y-6 p-4 md:p-8">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {stats.map((s, i) => (
            <motion.div key={s.l} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i*0.05 }}>
              <Card className="p-4">
                <div className={cn("grid h-9 w-9 place-items-center rounded-lg", s.tone)}><s.icon className="h-4 w-4" /></div>
                <div className="mt-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">{s.l}</div>
                <div className="mt-1 font-display text-2xl font-bold tabular-nums">{typeof s.v === "number" ? s.v.toLocaleString() : s.v}</div>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {trainingPrograms.map((p, i) => {
            const completePct = Math.round((p.completed / p.enrolled) * 100);
            const certPct = Math.round((p.certified / p.enrolled) * 100);
            return (
              <motion.div key={p.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i*0.05 }}>
                <Card className="overflow-hidden">
                  <div className={cn(
                    "h-24 bg-gradient-to-br p-4",
                    i % 3 === 0 ? "from-primary/40 to-primary/10" :
                    i % 3 === 1 ? "from-info/40 to-info/10" : "from-success/40 to-success/10"
                  )}>
                    <div className="flex items-start justify-between">
                      <Badge variant="secondary" className="bg-background/80">{p.category}</Badge>
                      <Badge variant="secondary" className={
                        p.status === "Live" ? "bg-success/15 text-success" :
                        p.status === "Upcoming" ? "bg-info/15 text-info" : "bg-muted text-muted-foreground"
                      }>{p.status}</Badge>
                    </div>
                    <GraduationCap className="mt-2 h-8 w-8 text-foreground/60" />
                  </div>
                  <div className="p-5">
                    <h3 className="font-display text-base font-bold leading-tight">{p.title}</h3>
                    <div className="mt-1 flex items-center gap-3 text-[11px] text-muted-foreground">
                      <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> {p.duration}</span>
                      <span className="inline-flex items-center gap-1"><GraduationCap className="h-3 w-3" /> {p.enrolled.toLocaleString()} enrolled</span>
                    </div>
                    <div className="mt-4 space-y-3">
                      <div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Completion</span>
                          <span className="font-semibold tabular-nums">{completePct}%</span>
                        </div>
                        <Progress value={completePct} className="mt-1 h-1.5" />
                      </div>
                      <div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Certified</span>
                          <span className="font-semibold tabular-nums">{certPct}%</span>
                        </div>
                        <Progress value={certPct} className="mt-1 h-1.5" />
                      </div>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <Button size="sm" className="flex-1 gap-1.5"><Play className="h-3.5 w-3.5" /> Open Program</Button>
                      <Button variant="outline" size="sm">Details</Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </>
  );
}

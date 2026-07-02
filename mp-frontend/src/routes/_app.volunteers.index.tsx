import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Activity, ClipboardCheck, MessageSquareWarning, UserPlus, MapPin,
  Smartphone, Radio, Plus, FileBarChart, Users, Trophy, Map, GraduationCap,
  ArrowUpRight, Wifi,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { fieldOps, volunteers, activityLogs } from "@/lib/volunteer-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/volunteers/")({
  head: () => ({
    meta: [
      { title: "Field Operations Command Center — Volunteers" },
      { name: "description", content: "Live operations dashboard for the MP volunteer field force." },
    ],
  }),
  component: VolunteersHome,
});

const liveTiles = [
  { label: "Active Now", value: fieldOps.activeNow, icon: Radio, tone: "bg-success/10 text-success", pulse: true },
  { label: "Ongoing Surveys", value: fieldOps.ongoingSurveys, icon: ClipboardCheck, tone: "bg-info/10 text-info" },
  { label: "Complaints Today", value: fieldOps.complaintsToday, icon: MessageSquareWarning, tone: "bg-warning/15 text-warning" },
  { label: "Registrations Today", value: fieldOps.registrationsToday, icon: UserPlus, tone: "bg-primary/10 text-primary" },
  { label: "Villages Visited", value: fieldOps.villagesVisited, icon: MapPin, tone: "bg-accent text-accent-foreground" },
];

const quickLinks = [
  { title: "Directory", desc: "Browse all 1,842 volunteers", icon: Users, to: "/volunteers/list" as const },
  { title: "Performance", desc: "Leaderboards & rankings", icon: Trophy, to: "/volunteers/performance" as const },
  { title: "Activity Monitor", desc: "Live field activity", icon: Activity, to: "/volunteers/activity" as const },
  { title: "Coverage Map", desc: "Geographic intelligence", icon: Map, to: "/volunteers/geographic-coverage" as const },
  { title: "Training Center", desc: "Programs & certifications", icon: GraduationCap, to: "/volunteers/training" as const },
  { title: "Attendance", desc: "Daily check-ins & GPS", icon: Wifi, to: "/volunteers/attendance" as const },
];

const mobileScreens = [
  { title: "Field Dashboard", body: "Today's targets · 12 of 20 done", accent: "bg-primary" },
  { title: "Register Citizen", body: "Scan Aadhaar · Auto-fill profile", accent: "bg-info" },
  { title: "Survey Collection", body: "Farmer Welfare · 6 questions", accent: "bg-success" },
  { title: "File Complaint", body: "Category · Photo · Geotag", accent: "bg-warning" },
  { title: "GPS Check-in", body: "Madhapur Booth 32 · 09:12 AM", accent: "bg-destructive" },
];

function VolunteersHome() {
  return (
    <>
      <PageHeader
        title="Field Operations Command Center"
        description="Live status of the constituency's volunteer field force — track every check-in, registration and survey in real time."
        actions={
          <>
            <Button variant="outline" size="sm" className="gap-1.5"><FileBarChart className="h-4 w-4" /> Daily Report</Button>
            <Button size="sm" className="gap-1.5"><Plus className="h-4 w-4" /> Quick Action</Button>
          </>
        }
      />
      <div className="space-y-6 p-4 md:p-8">
        {/* Live ops tiles */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
          {liveTiles.map((t, i) => (
            <motion.div key={t.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="relative overflow-hidden p-4">
                <div className={cn("grid h-10 w-10 place-items-center rounded-xl", t.tone)}>
                  <t.icon className="h-5 w-5" />
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{t.label}</span>
                  {t.pulse && (
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
                    </span>
                  )}
                </div>
                <div className="mt-1 font-display text-3xl font-bold tabular-nums">{t.value.toLocaleString()}</div>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Quick navigation */}
          <Card className="lg:col-span-2 p-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="font-display text-lg font-bold">Volunteer modules</h3>
                <p className="text-xs text-muted-foreground">Jump into any workflow</p>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {quickLinks.map((q, i) => (
                <motion.div key={q.title} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                  <Link to={q.to} className="group block">
                    <Card className="p-4 transition-all hover:-translate-y-0.5 hover:shadow-elevated">
                      <div className="flex items-start gap-3">
                        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                          <q.icon className="h-5 w-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold">{q.title}</span>
                            <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                          </div>
                          <p className="mt-0.5 text-xs text-muted-foreground">{q.desc}</p>
                        </div>
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </Card>

          {/* Live activity feed */}
          <Card className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="font-display text-lg font-bold">Live field activity</h3>
                <p className="text-xs text-muted-foreground">Last 4 hours</p>
              </div>
              <Badge variant="secondary" className="bg-success/10 text-success">Streaming</Badge>
            </div>
            <div className="space-y-3">
              {activityLogs.slice(0, 6).map((a, i) => (
                <motion.div
                  key={a.id}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-start gap-3 rounded-lg border border-border/60 p-2.5"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-[10px]">{volunteers[i].name.split(" ").map(p=>p[0]).slice(0,2).join("")}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate text-xs font-semibold">{volunteers[i].name}</span>
                      <Badge variant="outline" className="shrink-0 text-[10px]">{a.type}</Badge>
                    </div>
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">{a.description}</p>
                    <p className="mt-0.5 text-[10px] text-muted-foreground">{a.village} · {a.date.split(" ")[1]}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </div>

        {/* Volunteer Mobile App Preview */}
        <Card className="overflow-hidden p-6">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h3 className="font-display text-lg font-bold">Volunteer mobile app · Preview</h3>
              <p className="text-xs text-muted-foreground">Future companion app — UI mockups only</p>
            </div>
            <Badge variant="secondary" className="bg-info/10 text-info gap-1"><Smartphone className="h-3 w-3" /> Coming Q3 2026</Badge>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {mobileScreens.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="shrink-0"
              >
                <div className="relative h-[360px] w-[180px] rounded-[2rem] border-[6px] border-foreground/90 bg-background p-2 shadow-elevated">
                  <div className="absolute left-1/2 top-2 z-10 h-1 w-12 -translate-x-1/2 rounded-full bg-foreground/30" />
                  <div className="flex h-full flex-col overflow-hidden rounded-[1.5rem] bg-muted/30">
                    <div className={cn("h-1.5 w-full", s.accent)} />
                    <div className="flex-1 p-3">
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">MP Field</div>
                      <div className="mt-1 font-display text-sm font-bold">{s.title}</div>
                      <div className="mt-3 space-y-1.5">
                        <div className="h-2 w-3/4 rounded bg-foreground/10" />
                        <div className="h-2 w-full rounded bg-foreground/10" />
                        <div className="h-2 w-2/3 rounded bg-foreground/10" />
                      </div>
                      <div className="mt-4 rounded-lg bg-background p-2 text-[10px] text-muted-foreground">
                        {s.body}
                      </div>
                      <div className="mt-3 grid grid-cols-2 gap-1.5">
                        <div className="h-12 rounded-lg bg-primary/10" />
                        <div className="h-12 rounded-lg bg-accent" />
                        <div className="h-12 rounded-lg bg-info/10" />
                        <div className="h-12 rounded-lg bg-success/10" />
                      </div>
                    </div>
                    <div className="border-t border-border/60 p-2">
                      <div className="h-6 rounded-md bg-foreground/10" />
                    </div>
                  </div>
                </div>
                <p className="mt-2 text-center text-xs font-semibold">{s.title}</p>
              </motion.div>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}

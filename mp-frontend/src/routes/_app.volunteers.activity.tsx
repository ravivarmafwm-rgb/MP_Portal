import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Activity, TrendingUp, TrendingDown, Users, ClipboardList, MessageSquareWarning, Calendar, Filter, Download } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { volunteers, activityLogs } from "@/lib/volunteer-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/volunteers/activity")({
  head: () => ({
    meta: [
      { title: "Activity Monitor — Volunteers" },
      { name: "description", content: "Real-time field activity monitoring across the volunteer workforce." },
    ],
  }),
  component: ActivityPage,
});

const days = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
const chartData = [
  { d: "Mon", reg: 240, sur: 180, comp: 32 },
  { d: "Tue", reg: 312, sur: 220, comp: 41 },
  { d: "Wed", reg: 280, sur: 245, comp: 28 },
  { d: "Thu", reg: 360, sur: 290, comp: 52 },
  { d: "Fri", reg: 412, sur: 320, comp: 64 },
  { d: "Sat", reg: 380, sur: 280, comp: 48 },
  { d: "Sun", reg: 196, sur: 140, comp: 22 },
];
const maxVal = 412;

function ActivityPage() {
  const top5 = [...volunteers].sort((a,b)=>b.activityScore-a.activityScore).slice(0,5);
  const bot5 = [...volunteers].sort((a,b)=>a.activityScore-b.activityScore).slice(0,5);

  return (
    <>
      <PageHeader
        title="Activity Monitor"
        description="Live view of every registration, survey and field interaction across the constituency."
        actions={
          <>
            <Button variant="outline" size="sm" className="gap-1.5"><Filter className="h-4 w-4" /> Filters</Button>
            <Button size="sm" className="gap-1.5"><Download className="h-4 w-4" /> Export</Button>
          </>
        }
      />
      <div className="space-y-6 p-4 md:p-8">
        <Tabs defaultValue="week">
          <TabsList>
            <TabsTrigger value="day">Today</TabsTrigger>
            <TabsTrigger value="week">This Week</TabsTrigger>
            <TabsTrigger value="month">This Month</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            { l: "Citizens Registered", v: 2180, d: "+18%", icon: Users, tone: "bg-primary/10 text-primary" },
            { l: "Surveys Completed", v: 1675, d: "+9%", icon: ClipboardList, tone: "bg-info/10 text-info" },
            { l: "Complaints Submitted", v: 287, d: "+4%", icon: MessageSquareWarning, tone: "bg-warning/15 text-warning" },
            { l: "Meetings Conducted", v: 142, d: "-2%", icon: Calendar, tone: "bg-success/10 text-success" },
          ].map((s, i) => (
            <motion.div key={s.l} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i*0.05 }}>
              <Card className="p-4">
                <div className={cn("grid h-9 w-9 place-items-center rounded-lg", s.tone)}><s.icon className="h-4 w-4" /></div>
                <div className="mt-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">{s.l}</div>
                <div className="mt-1 flex items-baseline justify-between">
                  <span className="font-display text-2xl font-bold tabular-nums">{s.v.toLocaleString()}</span>
                  <span className={cn("text-xs font-semibold", s.d.startsWith("+") ? "text-success" : "text-destructive")}>{s.d}</span>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="p-6 lg:col-span-2">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h3 className="font-display text-lg font-bold">Weekly trend</h3>
                <p className="text-xs text-muted-foreground">Registrations · Surveys · Complaints</p>
              </div>
              <div className="flex gap-3 text-[11px]">
                <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-sm bg-primary" /> Reg</span>
                <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-sm bg-info" /> Sur</span>
                <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-sm bg-warning" /> Comp</span>
              </div>
            </div>
            <div className="flex h-64 items-end gap-3">
              {chartData.map((c, i) => (
                <div key={c.d} className="flex flex-1 flex-col items-center gap-1">
                  <div className="flex w-full flex-1 items-end gap-0.5">
                    {[{v:c.reg,cls:"bg-primary"},{v:c.sur,cls:"bg-info"},{v:c.comp*4,cls:"bg-warning"}].map((b,j)=>(
                      <motion.div key={j} initial={{ height: 0 }} animate={{ height: `${(b.v/maxVal)*100}%` }} transition={{ delay: i*0.05+j*0.05, duration: 0.5 }}
                        className={cn("flex-1 rounded-t", b.cls)} />
                    ))}
                  </div>
                  <span className="text-[10px] text-muted-foreground">{c.d}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="mb-4 font-display text-lg font-bold">Activity heatmap</h3>
            <div className="space-y-1.5">
              {["Madhapur","Kondapur","Gachibowli","Hi-Tec City","Miyapur"].map((v, i) => (
                <div key={v}>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span>{v}</span><span className="tabular-nums text-muted-foreground">{[420,380,310,260,180][i]}</span>
                  </div>
                  <div className="grid grid-cols-12 gap-0.5">
                    {Array.from({length: 12}).map((_, j) => {
                      const intensity = Math.max(0, Math.min(1, ((420-i*60)/420) * (1 - j*0.06)));
                      return <div key={j} className="aspect-square rounded-sm" style={{ background: `hsl(var(--primary) / ${intensity.toFixed(2)})` }} />;
                    })}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {[
            { title: "Most active volunteers", icon: TrendingUp, tone: "text-success", list: top5 },
            { title: "Needs attention", icon: TrendingDown, tone: "text-destructive", list: bot5 },
          ].map((s, idx) => (
            <Card key={s.title} className="p-5">
              <div className="mb-4 flex items-center gap-2">
                <s.icon className={cn("h-5 w-5", s.tone)} />
                <h3 className="font-display text-base font-bold">{s.title}</h3>
              </div>
              <div className="space-y-2">
                {s.list.map((v, i) => (
                  <motion.div key={v.id} initial={{ opacity: 0, x: idx === 0 ? -6 : 6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i*0.04 }}
                    className="flex items-center gap-3 rounded-lg border border-border/60 p-2.5">
                    <Avatar className="h-8 w-8"><AvatarFallback className="text-[10px]">{v.name.split(" ").map(p=>p[0]).slice(0,2).join("")}</AvatarFallback></Avatar>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-semibold">{v.name}</div>
                      <div className="text-[11px] text-muted-foreground">{v.village} · {v.mandal}</div>
                    </div>
                    <Badge variant="secondary" className={idx===0?"bg-success/10 text-success":"bg-destructive/10 text-destructive"}>{v.activityScore}</Badge>
                  </motion.div>
                ))}
              </div>
            </Card>
          ))}
        </div>

        <Card className="p-5">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-display text-base font-bold">Live activity feed</h3>
            <Badge variant="secondary" className="bg-success/10 text-success">Live</Badge>
          </div>
          <div className="space-y-2">
            {activityLogs.map((a, i) => (
              <motion.div key={a.id} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i*0.03 }}
                className="flex items-center gap-3 rounded-lg border border-border/60 p-2.5">
                <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary"><Activity className="h-4 w-4" /></div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm">{a.description}</div>
                  <div className="text-[11px] text-muted-foreground">{a.village} · {a.date}</div>
                </div>
                <Badge variant="outline" className="text-[10px]">{a.type}</Badge>
              </motion.div>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}

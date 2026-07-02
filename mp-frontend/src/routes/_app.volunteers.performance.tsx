import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Trophy, Medal, Award, MapPin, Building2, TrendingUp } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { volunteers } from "@/lib/volunteer-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/volunteers/performance")({
  head: () => ({
    meta: [
      { title: "Performance Center — Volunteers" },
      { name: "description", content: "Leaderboards and rankings of top performing volunteers, villages and mandals." },
    ],
  }),
  component: PerformancePage,
});

const rankTones = [
  "bg-gradient-to-br from-amber-400 to-amber-600 text-white",
  "bg-gradient-to-br from-slate-300 to-slate-500 text-white",
  "bg-gradient-to-br from-orange-400 to-orange-600 text-white",
];
const rankIcons = [Trophy, Medal, Award];

function PerformancePage() {
  const top = [...volunteers].sort((a,b)=>b.activityScore - a.activityScore).slice(0,10);
  const topVillages = [
    { name: "Madhapur", score: 94, volunteers: 86, citizens: 12420 },
    { name: "Kondapur", score: 91, volunteers: 74, citizens: 10980 },
    { name: "Gachibowli", score: 88, volunteers: 68, citizens: 9870 },
    { name: "Hi-Tec City", score: 84, volunteers: 64, citizens: 9120 },
    { name: "Miyapur", score: 79, volunteers: 58, citizens: 8240 },
  ];
  const topMandals = [
    { name: "Serilingampally", score: 92, volunteers: 412 },
    { name: "Khairatabad", score: 86, volunteers: 286 },
    { name: "Kukatpally", score: 81, volunteers: 348 },
    { name: "Shamshabad", score: 90, volunteers: 240 },
  ];

  return (
    <>
      <PageHeader
        title="Performance Center"
        description="Rankings, awards and leaderboards — celebrating the top contributors across the constituency."
      />
      <div className="space-y-6 p-4 md:p-8">
        {/* Podium */}
        <div className="grid gap-4 md:grid-cols-3">
          {top.slice(0,3).map((v, i) => {
            const Icon = rankIcons[i];
            const order = [1,0,2][i];
            return (
              <motion.div key={v.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i*0.1 }}
                style={{ order }} className={cn(i === 0 ? "md:mt-0" : "md:mt-6")}>
                <Card className="relative overflow-hidden p-6 text-center">
                  <div className={cn("absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full", rankTones[i])}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <Avatar className="mx-auto h-20 w-20 ring-4 ring-background">
                    <AvatarFallback className="font-display text-xl font-bold">{v.name.split(" ").map(p=>p[0]).slice(0,2).join("")}</AvatarFallback>
                  </Avatar>
                  <div className="mt-3 font-display text-lg font-bold">{v.name}</div>
                  <div className="text-xs text-muted-foreground">{v.village} · {v.mandal}</div>
                  <div className="mt-3 font-display text-4xl font-bold tabular-nums text-primary">{v.activityScore}</div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Activity Score</div>
                  <div className="mt-3 grid grid-cols-3 gap-2 border-t border-border/60 pt-3 text-xs">
                    <div><div className="font-bold tabular-nums">{v.citizensRegistered}</div><div className="text-muted-foreground">Citizens</div></div>
                    <div><div className="font-bold tabular-nums">{v.surveysCompleted}</div><div className="text-muted-foreground">Surveys</div></div>
                    <div><div className="font-bold tabular-nums">{v.meetingsAttended}</div><div className="text-muted-foreground">Meetings</div></div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <Tabs defaultValue="volunteers">
          <TabsList>
            <TabsTrigger value="volunteers">Top Volunteers</TabsTrigger>
            <TabsTrigger value="villages">Top Villages</TabsTrigger>
            <TabsTrigger value="mandals">Top Mandals</TabsTrigger>
          </TabsList>

          <TabsContent value="volunteers" className="mt-4">
            <Card className="p-5">
              <div className="space-y-2">
                {top.map((v, i) => (
                  <motion.div key={v.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i*0.04 }}
                    className={cn(
                      "flex items-center gap-3 rounded-xl border p-3",
                      i < 3 ? "border-primary/30 bg-primary/5" : "border-border/60"
                    )}>
                    <div className="grid w-8 place-items-center font-display text-lg font-bold tabular-nums text-muted-foreground">{i+1}</div>
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>{v.name.split(" ").map(p=>p[0]).slice(0,2).join("")}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold">{v.name}</span>
                        {v.badges.slice(0,2).map((b) => (
                          <Badge key={b} variant="outline" className="text-[10px]">{b}</Badge>
                        ))}
                      </div>
                      <div className="text-[11px] text-muted-foreground">{v.village} · {v.mandal}</div>
                    </div>
                    <div className="hidden gap-6 text-right text-xs sm:flex">
                      <div><div className="font-bold tabular-nums">{v.citizensRegistered}</div><div className="text-muted-foreground">Citizens</div></div>
                      <div><div className="font-bold tabular-nums">{v.surveysCompleted}</div><div className="text-muted-foreground">Surveys</div></div>
                      <div><div className="font-bold tabular-nums">{v.complaintsSubmitted}</div><div className="text-muted-foreground">Cases</div></div>
                    </div>
                    <div className="text-right">
                      <div className="font-display text-2xl font-bold tabular-nums text-primary">{v.activityScore}</div>
                      <div className="text-[10px] text-muted-foreground">score</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="villages" className="mt-4">
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {topVillages.map((v, i) => (
                <motion.div key={v.name} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i*0.05 }}>
                  <Card className="p-5">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground"><MapPin className="h-3 w-3" /> Village</div>
                        <div className="mt-1 font-display text-lg font-bold">{v.name}</div>
                      </div>
                      <Badge variant="secondary" className="bg-success/10 text-success gap-1"><TrendingUp className="h-3 w-3" /> {v.score}</Badge>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                      <div className="rounded-md bg-muted/40 p-2"><div className="font-bold tabular-nums">{v.volunteers}</div><div className="text-muted-foreground">Volunteers</div></div>
                      <div className="rounded-md bg-muted/40 p-2"><div className="font-bold tabular-nums">{v.citizens.toLocaleString()}</div><div className="text-muted-foreground">Citizens</div></div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="mandals" className="mt-4">
            <div className="grid gap-3 md:grid-cols-2">
              {topMandals.map((m, i) => (
                <motion.div key={m.name} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i*0.05 }}>
                  <Card className="p-5">
                    <div className="flex items-center gap-3">
                      <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary"><Building2 className="h-6 w-6" /></div>
                      <div className="min-w-0 flex-1">
                        <div className="font-display text-base font-bold">{m.name}</div>
                        <div className="text-xs text-muted-foreground">{m.volunteers} active volunteers</div>
                      </div>
                      <div className="text-right">
                        <div className="font-display text-3xl font-bold tabular-nums text-primary">{m.score}</div>
                        <div className="text-[10px] text-muted-foreground">Performance</div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}

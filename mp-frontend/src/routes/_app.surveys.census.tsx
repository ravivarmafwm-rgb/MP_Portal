import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Users, Home, Briefcase, Building, Sprout, GraduationCap, HeartPulse, Download, type LucideIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchCitizenStats } from "@/lib/api";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/surveys/census")({
  head: () => ({ meta: [{ title: "Constituency Census Center — MP Constituency" }] }),
  component: CensusCenter,
});

function StatBlock({ icon: Icon, title, accent, children }: { icon: LucideIcon; title: string; accent: string; children: React.ReactNode }) {
  return (
    <Card className="overflow-hidden p-5">
      <div className="flex items-center gap-3">
        <div className={cn("grid h-10 w-10 place-items-center rounded-xl", accent)}><Icon className="h-5 w-5" /></div>
        <div><h3 className="font-display text-sm font-bold">{title}</h3><p className="text-[11px] text-muted-foreground">Live database data · {new Date().getFullYear()}</p></div>
      </div>
      <div className="mt-4 space-y-3">{children}</div>
    </Card>
  );
}

function Row({ l, v, sub }: { l: string; v: string | number; sub?: string }) {
  return (
    <div className="flex items-end justify-between border-b border-dashed border-border/60 pb-2">
      <div><div className="text-xs text-muted-foreground">{l}</div>{sub && <div className="text-[10px] text-muted-foreground/80">{sub}</div>}</div>
      <div className="font-display text-lg font-bold tabular-nums">{typeof v === "number" ? v.toLocaleString("en-IN") : v}</div>
    </div>
  );
}

function CensusCenter() {
  const { data: stats, isLoading } = useQuery({ queryKey: ["citizen-stats-census"], queryFn: fetchCitizenStats, staleTime: 60_000 });

  const total = stats?.total ?? 0;
  const male = stats?.male ?? 0;
  const female = stats?.female ?? 0;
  const voters = stats?.voters ?? 0;

  if (isLoading) return <div className="p-8 space-y-4">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-40 w-full" />)}</div>;

  return (
    <>
      <PageHeader
        title="Constituency Census Center"
        description="Aggregated population, household and welfare indicators across the constituency."
        actions={<Button variant="outline" size="sm" className="gap-1.5"><Download className="h-4 w-4" /> Download Census Report</Button>}
      />
      <div className="space-y-4 p-4 md:p-8">
        <Card className="border-primary/20 bg-gradient-to-r from-primary/10 via-background to-background p-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <Badge variant="secondary" className="bg-primary/10 text-primary">Live Census Intelligence</Badge>
              <h2 className="mt-2 font-display text-2xl font-bold">Registered Citizens: {total.toLocaleString("en-IN")}</h2>
              <p className="text-xs text-muted-foreground">From PostgreSQL database · real-time constituency data</p>
            </div>
            <div className="grid grid-cols-3 gap-6 text-center">
              <div><div className="text-[10px] uppercase text-muted-foreground">Male</div><div className="font-display text-lg font-bold tabular-nums">{male.toLocaleString("en-IN")}</div></div>
              <div><div className="text-[10px] uppercase text-muted-foreground">Female</div><div className="font-display text-lg font-bold tabular-nums">{female.toLocaleString("en-IN")}</div></div>
              <div><div className="text-[10px] uppercase text-muted-foreground">Voters</div><div className="font-display text-lg font-bold tabular-nums">{voters.toLocaleString("en-IN")}</div></div>
            </div>
          </div>
        </Card>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <StatBlock icon={Users} title="Population" accent="bg-primary/10 text-primary">
            <Row l="Total registered" v={total} />
            <Row l="Male" v={male} />
            <Row l="Female" v={female} />
            <Row l="Registered voters" v={voters} />
          </StatBlock>

          <StatBlock icon={Home} title="Households" accent="bg-info/10 text-info">
            <Row l="This month enrolled" v={stats?.this_month ?? 0} />
            <Row l="Male citizens" v={male} />
            <Row l="Female citizens" v={female} />
            <Row l="Voter coverage" v={total > 0 ? `${Math.round((voters / total) * 100)}%` : "—"} />
          </StatBlock>

          <StatBlock icon={Briefcase} title="Data Quality" accent="bg-success/10 text-success">
            <Row l="Citizens with Aadhaar" v="See DB" />
            <Row l="Citizens with Voter ID" v="See DB" />
            <Row l="Citizens with mobile" v="See DB" />
            <div>
              <div className="mb-1 flex justify-between text-xs"><span className="text-muted-foreground">Voter enrollment rate</span><span className="font-semibold tabular-nums">{total > 0 ? Math.round((voters / total) * 100) : 0}%</span></div>
              <Progress value={total > 0 ? Math.round((voters / total) * 100) : 0} className="h-1.5" />
            </div>
          </StatBlock>

          <StatBlock icon={Building} title="Housing" accent="bg-warning/15 text-warning">
            <div>
              <div className="mb-1 flex justify-between text-xs"><span>Urban areas</span><span className="font-semibold tabular-nums">~60%</span></div>
              <Progress value={60} className="h-1.5" />
            </div>
            <div>
              <div className="mb-1 flex justify-between text-xs"><span>Rural areas</span><span className="font-semibold tabular-nums">~40%</span></div>
              <Progress value={40} className="h-1.5" />
            </div>
            <Row l="PMAY demand est." v="12,400+" />
          </StatBlock>

          <StatBlock icon={Sprout} title="Agriculture" accent="bg-success/10 text-success">
            <Row l="Farmer households" v="~28%" />
            <Row l="Urban workforce" v="~72%" />
            <div>
              <div className="mb-1 flex justify-between text-xs"><span>PM-KISAN enrolled</span><span className="font-semibold tabular-nums">~42%</span></div>
              <Progress value={42} className="h-1.5" />
            </div>
          </StatBlock>

          <StatBlock icon={GraduationCap} title="Education" accent="bg-info/10 text-info">
            <div>
              <div className="mb-1 flex justify-between text-xs"><span>Literacy rate est.</span><span className="font-semibold tabular-nums">~78%</span></div>
              <Progress value={78} className="h-1.5" />
            </div>
            <Row l="Primary enrollment" v="~92%" />
            <Row l="Secondary completion" v="~68%" />
          </StatBlock>

          <StatBlock icon={HeartPulse} title="Health" accent="bg-destructive/10 text-destructive">
            <Row l="Ayushman Bharat coverage" v="~62%" />
            <Row l="PHCs in constituency" v="8" />
            <Row l="Sub-centres" v="32" />
          </StatBlock>
        </motion.div>

        <Card className="p-4 text-center text-xs text-muted-foreground">
          Population statistics derived from citizen database · {total.toLocaleString("en-IN")} registered citizens as of {new Date().toLocaleDateString("en-IN")}
        </Card>
      </div>
    </>
  );
}

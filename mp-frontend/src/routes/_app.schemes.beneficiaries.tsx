import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Users, UserPlus, IndianRupee, MapPin, Download, Plus } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { schemes, villageCoverage, assemblyCoverage } from "@/lib/scheme-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/schemes/beneficiaries")({
  head: () => ({ meta: [{ title: "Beneficiary Intelligence Center" }, { name: "description", content: "Welfare beneficiary analytics across schemes, villages and assemblies." }] }),
  component: BeneficiariesPage,
});

const kpis = [
  { l: "Total Beneficiaries", v: "21,530", icon: Users, tone: "bg-primary/10 text-primary" },
  { l: "New This Month", v: "1,284", icon: UserPlus, tone: "bg-success/10 text-success" },
  { l: "Benefits Distributed", v: "₹482 Cr", icon: IndianRupee, tone: "bg-info/10 text-info" },
  { l: "Villages Covered", v: "286 / 312", icon: MapPin, tone: "bg-warning/15 text-warning" },
];

const categoryDist = [
  { name: "General", value: 6240 }, { name: "OBC", value: 8420 },
  { name: "SC", value: 4680 }, { name: "ST", value: 2190 },
];
const total = categoryDist.reduce((s, c) => s + c.value, 0);

function BeneficiariesPage() {
  return (
    <>
      <PageHeader
        title="Beneficiary Intelligence Center"
        description="21,530 beneficiaries · 12 schemes · 286 villages — analytics & welfare distribution."
        actions={
          <>
            <Button variant="outline" size="sm" className="gap-1.5"><Download className="h-4 w-4" /> Export</Button>
            <Button size="sm" className="gap-1.5"><Plus className="h-4 w-4" /> Add Beneficiary</Button>
          </>
        }
      />
      <div className="space-y-6 p-4 md:p-8">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {kpis.map((k, i) => (
            <motion.div key={k.l} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="p-4">
                <div className={cn("inline-grid h-9 w-9 place-items-center rounded-lg", k.tone)}><k.icon className="h-4 w-4" /></div>
                <div className="mt-3 text-[11px] uppercase tracking-wider text-muted-foreground">{k.l}</div>
                <div className="mt-1 font-display text-xl font-bold tabular-nums">{k.v}</div>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
          <Card className="p-5">
            <h3 className="font-display text-base font-bold">Beneficiaries by Scheme</h3>
            <div className="mt-4 space-y-3">
              {[...schemes].sort((a,b) => b.beneficiaries - a.beneficiaries).slice(0, 8).map((s) => (
                <div key={s.id}>
                  <div className="flex items-center justify-between text-xs">
                    <span className="inline-flex items-center gap-2 font-medium">{s.icon} {s.name}</span>
                    <span className="tabular-nums text-muted-foreground">{s.beneficiaries.toLocaleString()}</span>
                  </div>
                  <Progress value={(s.beneficiaries / 3700) * 100} className="mt-1 h-1.5" />
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="font-display text-base font-bold">By Category</h3>
            <div className="mt-6 flex items-end justify-around gap-3 h-44">
              {categoryDist.map((c, i) => (
                <motion.div key={c.name} initial={{ height: 0 }} animate={{ height: "auto" }} transition={{ delay: i * 0.1 }} className="flex w-full flex-col items-center gap-2">
                  <div className="text-xs font-semibold tabular-nums">{c.value.toLocaleString()}</div>
                  <div className="w-full rounded-t-lg bg-gradient-to-t from-primary to-primary/40" style={{ height: `${(c.value / total) * 160}px` }} />
                  <div className="text-[10px] text-muted-foreground">{c.name}</div>
                </motion.div>
              ))}
            </div>
          </Card>
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
          <Card className="p-5">
            <h3 className="font-display text-base font-bold">Top Villages</h3>
            <div className="mt-3 space-y-2">
              {[...villageCoverage].sort((a,b)=>b.beneficiaries-a.beneficiaries).slice(0,6).map((v) => (
                <div key={v.village} className="flex items-center justify-between rounded-md bg-muted/40 p-2.5">
                  <div>
                    <div className="text-sm font-semibold">{v.village}</div>
                    <div className="text-[10px] text-muted-foreground">{v.mandal}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-display text-base font-bold tabular-nums">{v.beneficiaries.toLocaleString()}</div>
                    <div className="text-[10px] text-muted-foreground">{v.coverage}% coverage</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
          <Card className="p-5">
            <h3 className="font-display text-base font-bold">By Assembly</h3>
            <div className="mt-3 space-y-3">
              {assemblyCoverage.map((a) => (
                <div key={a.assembly}>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium">{a.assembly}</span>
                    <span className="tabular-nums text-muted-foreground">{a.beneficiaries.toLocaleString()} / {a.population.toLocaleString()}</span>
                  </div>
                  <Progress value={a.coverage} className="mt-1 h-2" />
                  <div className="mt-0.5 text-right text-[10px] text-muted-foreground">{a.coverage}% coverage</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
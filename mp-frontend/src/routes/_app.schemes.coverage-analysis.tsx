import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { MapPin, TrendingDown, AlertTriangle, Flame } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { villageCoverage, assemblyCoverage } from "@/lib/scheme-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/schemes/coverage-analysis")({
  head: () => ({ meta: [{ title: "Coverage Analysis — Welfare Geography" }, { name: "description", content: "Geographic welfare coverage and underserved area identification." }] }),
  component: CoveragePage,
});

const statusTone: Record<string, string> = {
  Excellent: "bg-success/10 text-success",
  Good: "bg-info/10 text-info",
  Average: "bg-warning/15 text-warning",
  Low: "bg-destructive/10 text-destructive",
};

function CoveragePage() {
  const sorted = [...villageCoverage].sort((a, b) => a.coverage - b.coverage);
  return (
    <>
      <PageHeader title="Coverage Analysis" description="Geographic welfare coverage across 312 villages, 24 mandals and 4 assemblies." />
      <div className="space-y-6 p-4 md:p-8">
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display text-base font-bold">Constituency Welfare Heatmap</h3>
              <p className="text-xs text-muted-foreground">Coverage density & welfare gaps</p>
            </div>
            <Badge variant="secondary" className="bg-info/10 text-info">GIS Preview</Badge>
          </div>
          <div className="mt-4 grid h-80 place-items-center rounded-xl border border-dashed border-border/70 bg-[radial-gradient(circle_at_25%_30%,hsl(var(--success)/0.18),transparent_55%),radial-gradient(circle_at_70%_40%,hsl(var(--warning)/0.2),transparent_50%),radial-gradient(circle_at_50%_75%,hsl(var(--destructive)/0.18),transparent_45%),radial-gradient(circle_at_85%_75%,hsl(var(--primary)/0.15),transparent_45%)]">
            <div className="text-center">
              <MapPin className="mx-auto h-10 w-10 text-primary" />
              <div className="mt-2 text-sm font-semibold">312 villages mapped</div>
              <div className="text-xs text-muted-foreground">Green = strong coverage · Red = underserved</div>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-4 text-xs">
            <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-sm bg-success/40" /> Excellent (85%+)</div>
            <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-sm bg-info/40" /> Good (75-84%)</div>
            <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-sm bg-warning/40" /> Average (60-74%)</div>
            <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-sm bg-destructive/40" /> Low (&lt;60%)</div>
          </div>
        </Card>

        <div className="grid gap-4 xl:grid-cols-2">
          <Card className="p-5">
            <h3 className="font-display text-base font-bold">Assembly Coverage</h3>
            <div className="mt-4 space-y-3">
              {assemblyCoverage.map((a, i) => (
                <motion.div key={a.assembly} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold">{a.assembly}</span>
                    <span className="tabular-nums text-xs text-muted-foreground">{a.beneficiaries.toLocaleString()} / {a.population.toLocaleString()}</span>
                  </div>
                  <Progress value={a.coverage} className="mt-1 h-2" />
                  <div className="mt-0.5 text-right text-[10px] tabular-nums">{a.coverage}%</div>
                </motion.div>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="font-display text-base font-bold inline-flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-destructive" /> Underserved Areas</h3>
            <p className="text-xs text-muted-foreground">Priority villages with welfare gaps</p>
            <div className="mt-3 space-y-2">
              {sorted.slice(0, 5).map((v) => (
                <div key={v.village} className="flex items-center justify-between rounded-md border border-destructive/20 bg-destructive/5 p-2.5">
                  <div>
                    <div className="text-sm font-semibold">{v.village}</div>
                    <div className="text-[10px] text-muted-foreground">{v.mandal} · gap {v.gap.toLocaleString()}</div>
                  </div>
                  <Badge variant="secondary" className={cn("text-[10px]", statusTone[v.status])}>{v.coverage}%</Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <Card className="overflow-hidden p-0">
          <div className="border-b border-border/70 p-4">
            <h3 className="font-display text-base font-bold">Village Coverage Detail</h3>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="p-3 text-left">Village</th>
                <th className="p-3 text-left">Mandal</th>
                <th className="p-3 text-right">Population</th>
                <th className="p-3 text-right">Beneficiaries</th>
                <th className="p-3 text-right">Coverage</th>
                <th className="p-3 text-right">Gap</th>
                <th className="p-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {villageCoverage.map((v) => (
                <tr key={v.village} className="border-t border-border/40 hover:bg-muted/30">
                  <td className="p-3 font-medium">{v.village}</td>
                  <td className="p-3 text-xs">{v.mandal}</td>
                  <td className="p-3 text-right tabular-nums">{v.population.toLocaleString()}</td>
                  <td className="p-3 text-right tabular-nums">{v.beneficiaries.toLocaleString()}</td>
                  <td className="p-3 text-right tabular-nums font-semibold">{v.coverage}%</td>
                  <td className="p-3 text-right tabular-nums text-destructive">{v.gap.toLocaleString()}</td>
                  <td className="p-3"><Badge variant="secondary" className={cn("text-[10px]", statusTone[v.status])}>{v.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <Card className="p-5">
          <h3 className="font-display text-base font-bold inline-flex items-center gap-2"><Flame className="h-4 w-4 text-warning" /> High-Demand Hotspots</h3>
          <p className="text-xs text-muted-foreground">Villages with most pending applications</p>
          <div className="mt-3 grid gap-2 md:grid-cols-3">
            {[
              { v: "Miyapur", a: 412, p: "PMAY-G, MGNREGA" },
              { v: "Kukatpally", a: 386, p: "PM-Kisan, Ayushman" },
              { v: "Madhapur", a: 318, p: "Scholarships, PMAY-U" },
            ].map((h) => (
              <div key={h.v} className="rounded-lg border border-warning/20 bg-warning/5 p-3">
                <div className="text-sm font-bold">{h.v}</div>
                <div className="mt-1 text-xs text-muted-foreground">{h.p}</div>
                <div className="mt-2 inline-flex items-center gap-1.5 text-xs"><TrendingDown className="h-3 w-3 text-warning" /> <span className="font-semibold tabular-nums">{h.a}</span> pending applications</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}
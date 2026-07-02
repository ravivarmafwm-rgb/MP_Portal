import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Trophy, Clock, CheckCircle2, XCircle, Building2 } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { departmentPerformance, schemes } from "@/lib/scheme-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/schemes/performance")({
  head: () => ({ meta: [{ title: "Scheme Performance Center" }, { name: "description", content: "Department efficiency and scheme performance analytics." }] }),
  component: PerformancePage,
});

const overall = [
  { l: "Approval Rate", v: "82%", icon: CheckCircle2, tone: "bg-success/10 text-success" },
  { l: "Rejection Rate", v: "7%", icon: XCircle, tone: "bg-destructive/10 text-destructive" },
  { l: "Avg Processing", v: "11 days", icon: Clock, tone: "bg-warning/15 text-warning" },
  { l: "Benefit Distributed", v: "₹482 Cr", icon: Trophy, tone: "bg-primary/10 text-primary" },
];

function PerformancePage() {
  const ranked = [...departmentPerformance].sort((a, b) => b.slaCompliance - a.slaCompliance);
  const topSchemes = [...schemes].sort((a, b) => b.beneficiaries - a.beneficiaries).slice(0, 6);

  return (
    <>
      <PageHeader title="Scheme Performance Center" description="Approval, rejection, processing time and department efficiency across all welfare schemes." />
      <div className="space-y-6 p-4 md:p-8">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {overall.map((k, i) => (
            <motion.div key={k.l} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="p-4">
                <div className={cn("inline-grid h-9 w-9 place-items-center rounded-lg", k.tone)}><k.icon className="h-4 w-4" /></div>
                <div className="mt-3 text-[11px] uppercase tracking-wider text-muted-foreground">{k.l}</div>
                <div className="mt-1 font-display text-xl font-bold tabular-nums">{k.v}</div>
              </Card>
            </motion.div>
          ))}
        </div>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-base font-bold inline-flex items-center gap-2"><Building2 className="h-4 w-4" /> Department Rankings</h3>
            <Badge variant="secondary" className="bg-success/10 text-success">By SLA Compliance</Badge>
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="p-2 text-left">Rank</th>
                  <th className="p-2 text-left">Department</th>
                  <th className="p-2 text-right">Applications</th>
                  <th className="p-2 text-right">Approval %</th>
                  <th className="p-2 text-right">Avg Days</th>
                  <th className="p-2 text-right">SLA</th>
                  <th className="p-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {ranked.map((d, i) => (
                  <tr key={d.name} className="border-t border-border/40">
                    <td className="p-2">
                      <div className={cn("grid h-7 w-7 place-items-center rounded-full font-bold text-xs",
                        i === 0 ? "bg-warning/20 text-warning" : i === 1 ? "bg-muted text-foreground" : i === 2 ? "bg-orange-500/15 text-orange-600" : "bg-muted/40 text-muted-foreground")}>
                        {i + 1}
                      </div>
                    </td>
                    <td className="p-2 font-medium">{d.name}</td>
                    <td className="p-2 text-right tabular-nums">{d.applications.toLocaleString()}</td>
                    <td className="p-2 text-right tabular-nums font-semibold text-success">{d.approvalRate}%</td>
                    <td className="p-2 text-right tabular-nums">{d.avgDays}</td>
                    <td className="p-2 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Progress value={d.slaCompliance} className="h-1.5 w-20" />
                        <span className="tabular-nums font-semibold">{d.slaCompliance}%</span>
                      </div>
                    </td>
                    <td className="p-2">
                      <Badge variant="secondary" className={cn("text-[10px]",
                        d.slaCompliance >= 90 ? "bg-success/10 text-success" :
                        d.slaCompliance >= 80 ? "bg-info/10 text-info" :
                        d.slaCompliance >= 70 ? "bg-warning/15 text-warning" : "bg-destructive/10 text-destructive")}>
                        {d.slaCompliance >= 90 ? "Excellent" : d.slaCompliance >= 80 ? "Good" : d.slaCompliance >= 70 ? "Average" : "Needs Attention"}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="font-display text-base font-bold inline-flex items-center gap-2"><Trophy className="h-4 w-4 text-warning" /> Top-Performing Schemes</h3>
          <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {topSchemes.map((s, i) => (
              <motion.div key={s.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className="rounded-lg border border-border/70 p-4">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-lg bg-muted text-xl">{s.icon}</div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-semibold">{s.name}</div>
                    <div className="text-[10px] text-muted-foreground">{s.department}</div>
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                  <div className="rounded bg-muted/40 p-2"><div className="text-muted-foreground">Beneficiaries</div><div className="font-bold tabular-nums">{s.beneficiaries.toLocaleString()}</div></div>
                  <div className="rounded bg-muted/40 p-2"><div className="text-muted-foreground">Growth</div><div className="font-bold tabular-nums text-success">+{s.growthPct}%</div></div>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}
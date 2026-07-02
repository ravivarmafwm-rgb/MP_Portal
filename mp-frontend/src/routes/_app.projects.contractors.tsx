import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Building2, Users, ShieldCheck, AlertTriangle, Download, Plus, Search } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { AnimatedNumber } from "@/components/dashboard/AnimatedNumber";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/projects/contractors")({
  head: () => ({ meta: [{ title: "Contractor Management" }, { name: "description", content: "Contractor intelligence center · performance, risk and assignments." }] }),
  component: ContractorsPage,
});

const contractorsData = [
  { id: "C001", name: "Sri Venkateshwara Constructions", projectsAssigned: 12, completed: 10, performanceScore: 88, budgetHandled: 48, risk: "Low", empanelledSince: "2022" },
  { id: "C002", name: "Jaya Bharat Infrastructure", projectsAssigned: 10, completed: 8, performanceScore: 82, budgetHandled: 36, risk: "Low", empanelledSince: "2022" },
  { id: "C003", name: "Telangana Road Works Ltd", projectsAssigned: 8, completed: 6, performanceScore: 76, budgetHandled: 28, risk: "Medium", empanelledSince: "2023" },
  { id: "C004", name: "Vasavi Builders & Developers", projectsAssigned: 6, completed: 4, performanceScore: 70, budgetHandled: 20, risk: "Medium", empanelledSince: "2023" },
  { id: "C005", name: "Sri Sai Engineering Works", projectsAssigned: 4, completed: 2, performanceScore: 64, budgetHandled: 12, risk: "High", empanelledSince: "2024" },
];

const kpis = [
  { l: "Total Contractors", v: contractorsData.length, icon: Building2, tone: "bg-primary/10 text-primary" },
  { l: "Active", v: 4, icon: Users, tone: "bg-info/10 text-info" },
  { l: "High Performing", v: 2, icon: ShieldCheck, tone: "bg-success/10 text-success" },
  { l: "Delayed / Risk", v: 1, icon: AlertTriangle, tone: "bg-destructive/10 text-destructive" },
];

const riskTone = { Low: "bg-success/10 text-success", Medium: "bg-warning/15 text-warning", High: "bg-destructive/10 text-destructive" };

function ContractorsPage() {
  return (
    <>
      <PageHeader
        title="Contractor Management"
        description="Empanelled contractors, performance ratings and risk intelligence."
        actions={<>
          <Button variant="outline" size="sm" className="gap-1.5"><Download className="h-4 w-4" /> Export</Button>
          <Button size="sm" className="gap-1.5"><Plus className="h-4 w-4" /> Empanel Contractor</Button>
        </>}
      />
      <div className="space-y-6 p-4 md:p-8">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {kpis.map((k, i) => (
            <motion.div key={k.l} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="p-5">
                <div className={cn("grid h-10 w-10 place-items-center rounded-lg", k.tone)}><k.icon className="h-5 w-5" /></div>
                <div className="mt-3 text-[11px] uppercase tracking-wider text-muted-foreground">{k.l}</div>
                <div className="mt-1 font-display text-2xl font-bold tabular-nums"><AnimatedNumber value={k.v} /></div>
              </Card>
            </motion.div>
          ))}
        </div>

        <Card className="overflow-hidden">
          <div className="flex flex-wrap items-center gap-2 border-b border-border/70 bg-muted/30 p-3">
            <div className="relative flex-1 min-w-[200px]"><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input placeholder="Search contractors…" className="h-9 bg-background pl-9" /></div>
            <Button variant="outline" size="sm">All Risk</Button>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-muted/30 text-[11px] uppercase tracking-wider text-muted-foreground"><tr>
              <th className="px-4 py-3 text-left">Contractor</th><th className="px-4 py-3 text-left">Assigned</th><th className="px-4 py-3 text-left">Completion Rate</th><th className="px-4 py-3 text-left">Performance</th><th className="px-4 py-3 text-left">Budget</th><th className="px-4 py-3 text-left">Risk</th>
            </tr></thead>
            <tbody>
              {contractorsData.map((c, i) => (
                <motion.tr key={c.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="border-t border-border/60 hover:bg-muted/30">
                  <td className="px-4 py-3"><div className="flex items-center gap-3"><div className="grid h-9 w-9 place-items-center rounded-lg bg-primary/10 text-primary"><Building2 className="h-4 w-4" /></div><div><div className="font-semibold">{c.name}</div><div className="text-[11px] text-muted-foreground">{c.id} · since {c.empanelledSince}</div></div></div></td>
                  <td className="px-4 py-3 tabular-nums">{c.projectsAssigned} <span className="text-[11px] text-muted-foreground">/ {c.completed} done</span></td>
                  <td className="px-4 py-3"><div className="flex items-center gap-2"><Progress value={c.performanceScore} className="h-1.5 w-24" /><span className="tabular-nums text-xs font-semibold">{c.performanceScore}%</span></div></td>
                  <td className="px-4 py-3"><Badge variant="secondary" className={cn(c.performanceScore >= 80 ? "bg-success/10 text-success" : c.performanceScore >= 65 ? "bg-warning/15 text-warning" : "bg-destructive/10 text-destructive")}>{c.performanceScore}/100</Badge></td>
                  <td className="px-4 py-3 tabular-nums">₹{c.budgetHandled}Cr</td>
                  <td className="px-4 py-3"><Badge variant="secondary" className={riskTone[c.risk]}>{c.risk}</Badge></td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </>
  );
}

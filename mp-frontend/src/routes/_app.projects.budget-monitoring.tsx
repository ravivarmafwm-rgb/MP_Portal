import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { IndianRupee, Wallet, TrendingDown, TrendingUp, Percent, Download } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AnimatedNumber } from "@/components/dashboard/AnimatedNumber";
import { fetchProjects, fetchProjectStats } from "@/lib/api";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/projects/budget-monitoring")({
  head: () => ({ meta: [{ title: "Budget Monitoring Center" }, { name: "description", content: "Financial oversight of all constituency development budgets." }] }),
  component: BudgetMonitoring,
  loader: async () => {
    const [projects, stats] = await Promise.all([fetchProjects(), fetchProjectStats()]);
    return { projects, stats };
  },
});

const monthlyBudgetTrend = [
  { month: "Jan", allocated: 24, utilized: 18 },
  { month: "Feb", allocated: 28, utilized: 22 },
  { month: "Mar", allocated: 32, utilized: 26 },
  { month: "Apr", allocated: 30, utilized: 24 },
  { month: "May", allocated: 26, utilized: 20 },
  { month: "Jun", allocated: 44.6, utilized: 22.4 },
];
const villageBudget = [
  { village: "Kothaguda", budget: 24, projects: 12, score: 88 },
  { village: "Gachibowli", budget: 22, projects: 10, score: 84 },
  { village: "Madhapur", budget: 18, projects: 9, score: 78 },
  { village: "Hitech City", budget: 16, projects: 8, score: 76 },
  { village: "Jubilee Hills", budget: 14, projects: 7, score: 72 },
  { village: "Banjara Hills", budget: 12, projects: 6, score: 68 },
  { village: "Manikonda", budget: 10, projects: 5, score: 64 },
  { village: "Narsingi", budget: 8, projects: 4, score: 60 },
  { village: "Kokapet", budget: 6, projects: 3, score: 56 },
];
const mpladsCategoryAllocations = [
  { category: "Roads & Highways", icon: "🛣️", allocated: 80, utilized: 68 },
  { category: "Water Supply", icon: "💧", allocated: 40, utilized: 36 },
  { category: "Education", icon: "🏫", allocated: 30, utilized: 24 },
  { category: "Healthcare", icon: "🏥", allocated: 25, utilized: 18 },
  { category: "Community Halls", icon: "🏛️", allocated: 15, utilized: 12 },
];

function BudgetMonitoring() {
  const { stats } = Route.useLoaderData();
  const maxBudget = Math.max(...monthlyBudgetTrend.map((m) => m.allocated));
  const maxVilBudget = Math.max(...villageBudget.map((v) => v.budget));
  return (
    <>
      <PageHeader
        title="Budget Monitoring Center"
        description="Financial efficiency across MPLADS, state and central funds."
        actions={<Button variant="outline" size="sm" className="gap-1.5"><Download className="h-4 w-4" /> Finance Report</Button>}
      />
      <div className="space-y-6 p-4 md:p-8">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
          {[
            { l: "Total Budget", v: `₹${(stats.total_budget || 0).toLocaleString()}`, icon: IndianRupee, tone: "bg-primary/10 text-primary" },
            { l: "Utilized", v: `₹${(stats.total_spent || 0).toLocaleString()}`, icon: Wallet, tone: "bg-success/10 text-success" },
            { l: "Remaining", v: `₹${((stats.total_budget || 0) - (stats.total_spent || 0)).toLocaleString()}`, icon: TrendingUp, tone: "bg-info/10 text-info" },
            { l: "Cost Overruns", v: "₹1.84Cr", icon: TrendingDown, tone: "bg-destructive/10 text-destructive" },
            { l: "Budget Efficiency", v: stats.total_budget > 0 ? `${Math.round((stats.total_spent / stats.total_budget) * 100)}%` : "0%", icon: Percent, tone: "bg-warning/15 text-warning" },
          ].map((k) => (
            <Card key={k.l} className="p-5">
              <div className={cn("grid h-10 w-10 place-items-center rounded-lg", k.tone)}><k.icon className="h-5 w-5" /></div>
              <div className="mt-3 text-[11px] uppercase tracking-wider text-muted-foreground">{k.l}</div>
              <div className="mt-1 font-display text-xl font-bold tabular-nums">{k.v}</div>
            </Card>
          ))}
        </div>

        <Card className="p-5">
          <h3 className="font-display text-base font-bold">Budget vs Utilization · Last 6 months (₹ Cr)</h3>
          <div className="mt-6 flex h-48 items-end gap-4">
            {monthlyBudgetTrend.map((t, i) => (
              <motion.div key={t.month} initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} transition={{ delay: i * 0.06 }}
                className="flex flex-1 flex-col items-center gap-1">
                <div className="flex w-full items-end gap-1">
                  <div className="flex-1 rounded-t bg-primary/20" style={{ height: `${(t.allocated / maxBudget) * 160}px` }} />
                  <div className="flex-1 rounded-t bg-primary" style={{ height: `${(t.utilized / maxBudget) * 160}px` }} />
                </div>
                <span className="text-[10px] text-muted-foreground">{t.month}</span>
              </motion.div>
            ))}
          </div>
          <div className="mt-3 flex gap-4 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded bg-primary/20" /> Allocated</span>
            <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded bg-primary" /> Utilized</span>
          </div>
        </Card>

        <div className="grid gap-4 lg:grid-cols-2">
          <Card className="p-5">
            <h3 className="font-display text-base font-bold">Budget by Village · Top 9</h3>
            <div className="mt-4 space-y-2">
              {villageBudget.map((v, i) => (
                <motion.div key={v.village} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold">{v.village}</span>
                    <span className="text-muted-foreground tabular-nums">₹{v.budget}Cr · {v.projects} projects</span>
                  </div>
                  <div className="mt-1 h-2 overflow-hidden rounded bg-muted">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${(v.budget / maxVilBudget) * 100}%` }} transition={{ duration: 0.8, delay: 0.1 + i * 0.04 }} className="h-full rounded bg-gradient-to-r from-primary to-info" />
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
          <Card className="p-5">
            <h3 className="font-display text-base font-bold">Budget by Category</h3>
            <div className="mt-4 space-y-3">
              {mpladsCategoryAllocations.map((c) => {
                const eff = Math.round((c.utilized / c.allocated) * 100);
                return (
                  <div key={c.category} className="rounded-lg border border-border/70 p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold"><span className="mr-1.5">{c.icon}</span>{c.category}</span>
                      <Badge variant="secondary" className={cn(eff >= 80 ? "bg-success/10 text-success" : eff >= 60 ? "bg-warning/15 text-warning" : "bg-destructive/10 text-destructive")}>{eff}% efficient</Badge>
                    </div>
                    <Progress value={eff} className="mt-2 h-1.5" />
                    <div className="mt-1 flex justify-between text-[11px] text-muted-foreground"><span>Allocated ₹{(c.allocated/100).toFixed(1)}Cr</span><span>Utilized ₹{(c.utilized/100).toFixed(1)}Cr</span></div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}

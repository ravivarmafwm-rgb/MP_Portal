import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Sparkles, BadgeCheck, AlertTriangle, XCircle, FileWarning } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { eligibilityMatrix, aiSchemeAdvisor } from "@/lib/scheme-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/schemes/eligibility")({
  head: () => ({ meta: [{ title: "Eligibility Engine — Scheme Management" }, { name: "description", content: "AI-powered citizen eligibility matrix across welfare schemes." }] }),
  component: EligibilityPage,
});

const cellTone: Record<string, string> = {
  Eligible: "bg-success/10 text-success",
  Enrolled: "bg-primary/10 text-primary",
  "Docs Missing": "bg-warning/15 text-warning",
  "Not Eligible": "bg-muted text-muted-foreground",
};
const cellIcon: Record<string, any> = {
  Eligible: BadgeCheck, Enrolled: BadgeCheck,
  "Docs Missing": FileWarning, "Not Eligible": XCircle,
};

const columns = [
  { key: "pmay", label: "PMAY", icon: "🏠" },
  { key: "pmKisan", label: "PM-Kisan", icon: "🌾" },
  { key: "ayushman", label: "Ayushman", icon: "🏥" },
  { key: "scholarship", label: "Scholarship", icon: "🎓" },
  { key: "pension", label: "Pension", icon: "👴" },
] as const;

const summary = [
  { l: "Eligible (not enrolled)", v: 1284, icon: BadgeCheck, tone: "bg-success/10 text-success" },
  { l: "Already Enrolled", v: 18420, icon: BadgeCheck, tone: "bg-primary/10 text-primary" },
  { l: "Documents Missing", v: 642, icon: FileWarning, tone: "bg-warning/15 text-warning" },
  { l: "Verification Needed", v: 412, icon: AlertTriangle, tone: "bg-info/10 text-info" },
];

function EligibilityPage() {
  return (
    <>
      <PageHeader
        title="Eligibility Engine"
        description="AI-assisted matching of citizens to schemes they qualify for."
        actions={<Button size="sm" className="gap-1.5"><Sparkles className="h-4 w-4" /> Run Eligibility Scan</Button>}
      />
      <div className="space-y-6 p-4 md:p-8">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {summary.map((s, i) => (
            <motion.div key={s.l} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="p-4">
                <div className={cn("inline-grid h-9 w-9 place-items-center rounded-lg", s.tone)}><s.icon className="h-4 w-4" /></div>
                <div className="mt-3 text-[11px] uppercase tracking-wider text-muted-foreground">{s.l}</div>
                <div className="mt-1 font-display text-xl font-bold tabular-nums">{s.v.toLocaleString()}</div>
              </Card>
            </motion.div>
          ))}
        </div>

        <Card className="overflow-hidden p-0">
          <div className="border-b border-border/70 p-4">
            <h3 className="font-display text-base font-bold">Citizen Eligibility Matrix</h3>
            <p className="text-xs text-muted-foreground">Live scoring · {eligibilityMatrix.length} citizens shown · {eligibilityMatrix.length * 5} eligibility checks</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="p-3 text-left">Citizen</th>
                  <th className="p-3 text-left">Village</th>
                  {columns.map((c) => (
                    <th key={c.key} className="p-3 text-left whitespace-nowrap">{c.icon} {c.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {eligibilityMatrix.map((row) => (
                  <tr key={row.citizenId} className="border-t border-border/40 hover:bg-muted/30">
                    <td className="p-3"><div className="font-medium">{row.citizen}</div><div className="text-[10px] text-muted-foreground">{row.citizenId}</div></td>
                    <td className="p-3 text-xs">{row.village}</td>
                    {columns.map((c) => {
                      const v = row[c.key];
                      const Icon = cellIcon[v];
                      return (
                        <td key={c.key} className="p-3">
                          <Badge variant="secondary" className={cn("text-[10px]", cellTone[v])}>
                            <Icon className="mr-0.5 inline h-3 w-3" />{v}
                          </Badge>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 via-background to-background p-5">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <h3 className="font-display text-base font-bold">AI Eligibility Recommendations</h3>
            <Badge variant="secondary" className="bg-primary/10 text-[10px] text-primary">Preview</Badge>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {aiSchemeAdvisor.map((s, i) => (
              <div key={i} className="rounded-lg border border-border/70 bg-card/50 p-3">
                <div className="text-xs font-semibold text-primary">"{s.q}"</div>
                <p className="mt-1 text-xs text-muted-foreground">→ {s.a}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}
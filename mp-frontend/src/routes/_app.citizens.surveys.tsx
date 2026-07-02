import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ClipboardList } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { surveysByCitizen } from "@/lib/citizen-data";

export const Route = createFileRoute("/_app/citizens/surveys")({
  head: () => ({ meta: [{ title: "Citizen Surveys — MP Constituency Platform" }] }),
  component: () => {
    const rows = surveysByCitizen["CTZ-100245"];
    return (
      <>
        <PageHeader title="Citizen Surveys" description="Participation history across constituency surveys." actions={<Button asChild size="sm" variant="outline"><Link to="/citizens/profile">Open Citizen 360</Link></Button>} />
        <div className="space-y-4 p-4 md:p-8">
          <Card className="flex items-center gap-3 p-4 text-sm text-muted-foreground"><ClipboardList className="h-4 w-4 text-primary" /> Showing surveys for Anitha Rao · CTZ-100245</Card>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {rows.map((s, i) => (
              <motion.div key={s.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: i * 0.05 }}>
                <Card className="p-4">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground"><ClipboardList className="h-3.5 w-3.5" />{s.date}</div>
                  <h4 className="mt-2 font-display text-sm font-semibold">{s.survey}</h4>
                  <div className="mt-3 flex items-end justify-between">
                    <div><div className="text-[11px] uppercase tracking-wider text-muted-foreground">Responses</div><div className="font-display text-xl font-bold">{s.responses}</div></div>
                    <div className="text-right"><div className="text-[11px] uppercase tracking-wider text-muted-foreground">Completion</div><div className="font-display text-xl font-bold text-primary">{s.completion}%</div></div>
                  </div>
                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-primary" style={{ width: `${s.completion}%` }} /></div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </>
    );
  },
});
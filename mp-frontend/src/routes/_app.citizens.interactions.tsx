import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Phone, MessageCircle, MessageSquare, CalendarDays, Users, Filter } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/layout/StatCard";
import { interactionsByCitizen, type InteractionRecord } from "@/lib/citizen-data";

const iconMap: Record<InteractionRecord["type"], typeof Phone> = {
  Call: Phone,
  SMS: MessageSquare,
  WhatsApp: MessageCircle,
  Meeting: Users,
  Appointment: CalendarDays,
  "Volunteer Visit": Users,
};

const toneMap: Record<InteractionRecord["type"], string> = {
  Call: "bg-blue-500/10 text-blue-600 dark:text-blue-300",
  SMS: "bg-purple-500/10 text-purple-600 dark:text-purple-300",
  WhatsApp: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300",
  Meeting: "bg-amber-500/10 text-amber-600 dark:text-amber-300",
  Appointment: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-300",
  "Volunteer Visit": "bg-primary/10 text-primary",
};

export const Route = createFileRoute("/_app/citizens/interactions")({
  head: () => ({
    meta: [
      { title: "Interaction History — MP Constituency Platform" },
      { name: "description", content: "Every citizen touchpoint across voice, SMS, WhatsApp, meetings and visits." },
    ],
  }),
  component: InteractionsPage,
});

function InteractionsPage() {
  const events = interactionsByCitizen["CTZ-100245"];
  return (
    <>
      <PageHeader
        title="Interaction History"
        description="Every citizen touchpoint, unified across voice, SMS, WhatsApp, meetings and field visits."
        actions={
          <Button variant="outline" size="sm" className="gap-1.5">
            <Filter className="h-4 w-4" /> Filter
          </Button>
        }
      />
      <div className="space-y-6 p-4 md:p-8">
        <div className="grid gap-4 md:grid-cols-4">
          <StatCard label="Interactions / Day" value="3,820" icon={MessageCircle} index={0} delta="+8.2%" />
          <StatCard label="WhatsApp Reach" value="78.4K" icon={MessageCircle} index={1} delta="+12%" />
          <StatCard label="Field Visits" value="1,204" icon={Users} index={2} delta="+3%" />
          <StatCard label="Meetings Hosted" value="312" icon={CalendarDays} index={3} delta="+5%" />
        </div>

        <Card className="p-5">
          <h3 className="mb-4 font-display text-sm font-semibold">Recent Interactions — Anitha Rao (CTZ-100245)</h3>
          <ol className="space-y-3">
            {events.map((e, i) => {
              const Icon = iconMap[e.type];
              return (
                <motion.li
                  key={e.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  className="flex gap-3 rounded-lg border border-border/60 bg-card/60 p-3"
                >
                  <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${toneMap[e.type]}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <h4 className="text-sm font-semibold">{e.type}</h4>
                      <span className="text-xs text-muted-foreground">{e.date}</span>
                    </div>
                    <p className="mt-0.5 text-sm text-muted-foreground">{e.summary}</p>
                    <Badge variant="outline" className="mt-2 text-[10px]">By {e.by}</Badge>
                  </div>
                </motion.li>
              );
            })}
          </ol>
        </Card>
      </div>
    </>
  );
}
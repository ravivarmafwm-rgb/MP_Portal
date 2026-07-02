import { Card } from "@/components/ui/card";
import { UserPlus, AlertCircle, ClipboardList, Hammer, CalendarPlus, Megaphone } from "lucide-react";
import { motion } from "framer-motion";

const actions = [
  { label: "Register Citizen", icon: UserPlus, tone: "from-primary to-info" },
  { label: "Add Grievance", icon: AlertCircle, tone: "from-warning to-destructive" },
  { label: "Launch Survey", icon: ClipboardList, tone: "from-success to-info" },
  { label: "Create Project", icon: Hammer, tone: "from-primary to-accent" },
  { label: "Schedule Meeting", icon: CalendarPlus, tone: "from-info to-primary" },
  { label: "Broadcast Message", icon: Megaphone, tone: "from-destructive to-warning" },
];

export function QuickActionsStrip() {
  return (
    <Card className="p-4 shadow-card">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
        {actions.map((a, i) => (
          <motion.button
            key={a.label}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: i * 0.03 }}
            className="group relative overflow-hidden rounded-lg border border-border/70 bg-card p-3 text-left transition-all hover:-translate-y-0.5 hover:shadow-elevated"
          >
            <div className={"mb-2 grid h-8 w-8 place-items-center rounded-md bg-gradient-to-br text-white " + a.tone}>
              <a.icon className="h-4 w-4" />
            </div>
            <p className="text-xs font-semibold">{a.label}</p>
          </motion.button>
        ))}
      </div>
    </Card>
  );
}
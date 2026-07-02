import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CalendarPlus, FileBadge, FilePlus2, MessageSquareWarning, ClipboardList, FolderOpen } from "lucide-react";

const actions = [
  { label: "Add Complaint", icon: MessageSquareWarning },
  { label: "Apply Scheme", icon: FileBadge },
  { label: "Schedule Meeting", icon: CalendarPlus },
  { label: "Register Survey", icon: ClipboardList },
  { label: "View Documents", icon: FolderOpen },
  { label: "New Note", icon: FilePlus2 },
];

export function QuickActionsBar() {
  return (
    <Card className="flex flex-wrap items-center justify-between gap-3 p-3">
      <div className="pl-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        Quick Actions
      </div>
      <div className="flex flex-wrap gap-1.5">
        {actions.map((a) => (
          <Button key={a.label} variant="outline" size="sm" className="gap-1.5">
            <a.icon className="h-3.5 w-3.5" />
            {a.label}
          </Button>
        ))}
      </div>
    </Card>
  );
}
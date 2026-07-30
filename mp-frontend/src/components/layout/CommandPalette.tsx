import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { navSections } from "./nav-config";
import {
  Users,
  MessageSquareWarning,
  HardHat,
  HeartHandshake,
  FileBadge,
  Plus,
  Settings,
} from "lucide-react";

const quickRecords = [
  { label: "Search citizens", icon: Users, to: "/citizens/list" },
  { label: "Search volunteers", icon: HeartHandshake, to: "/volunteers/list" },
  { label: "Search projects", icon: HardHat, to: "/projects/mplads" },
  {
    label: "Search grievances",
    icon: MessageSquareWarning,
    to: "/grievances/open",
  },
  { label: "Search schemes", icon: FileBadge, to: "/schemes/applications" },
] as const;

const quickActions = [
  { label: "Add new citizen", to: "/citizens/list" },
  { label: "Log new grievance", to: "/grievances/open" },
  { label: "Schedule appointment", to: "/meetings/appointments" },
  { label: "Launch survey", to: "/surveys/active" },
] as const;

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const go = (to: string) => {
    setOpen(false);
    navigate({ to });
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search records, jump to a page, or run an action…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Quick search">
          {quickRecords.map((r) => (
            <CommandItem key={r.label} onSelect={() => go(r.to)}>
              <r.icon className="mr-2 h-4 w-4" />
              {r.label}
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Quick actions">
          {quickActions.map((a) => (
            <CommandItem key={a.label} onSelect={() => go(a.to)}>
              <Plus className="mr-2 h-4 w-4" />
              {a.label}
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Navigate">
          {navSections.map((s) => (
            <CommandItem key={s.url} onSelect={() => go(s.url)}>
              <s.icon className="mr-2 h-4 w-4" />
              {s.title}
              <CommandShortcut>↵</CommandShortcut>
            </CommandItem>
          ))}
          <CommandItem onSelect={() => go("/settings")}>
            <Settings className="mr-2 h-4 w-4" /> Settings
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}

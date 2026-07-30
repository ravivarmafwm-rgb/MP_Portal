import { PageHeader } from "./PageHeader";
import { EmptyState } from "./EmptyState";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Filter,
  Download,
  Plus,
  Search,
  SlidersHorizontal,
  type LucideIcon,
} from "lucide-react";
import { motion } from "framer-motion";

export function PlaceholderPage({
  title,
  description,
  icon,
  emptyTitle,
  emptyDescription,
  emptyAction = "Get started",
  tabs,
  stats,
}: {
  title: string;
  description: string;
  icon: LucideIcon;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: string;
  tabs?: string[];
  stats?: {
    label: string;
    value: string;
    tone?: "default" | "success" | "warning" | "info";
  }[];
}) {
  const defaultStats = stats ?? [
    { label: "Total Records", value: "—" },
    { label: "This Month", value: "—", tone: "info" },
    { label: "Pending Review", value: "—", tone: "warning" },
    { label: "Completed", value: "—", tone: "success" },
  ];

  return (
    <>
      <PageHeader
        title={title}
        description={description}
        actions={
          <>
            <Button variant="outline" size="sm" className="gap-1.5">
              <Download className="h-4 w-4" /> Export
            </Button>
            <Button size="sm" className="gap-1.5">
              <Plus className="h-4 w-4" /> {emptyAction}
            </Button>
          </>
        }
      />

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-6 p-4 md:p-8"
      >
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {defaultStats.map((s) => (
            <Card key={s.label} className="p-4">
              <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {s.label}
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="font-display text-2xl font-bold tracking-tight">
                  {s.value}
                </span>
                {s.tone && s.tone !== "default" && (
                  <Badge
                    variant="secondary"
                    className={
                      s.tone === "success"
                        ? "bg-success/10 text-success"
                        : s.tone === "warning"
                          ? "bg-warning/15 text-warning"
                          : "bg-info/10 text-info"
                    }
                  >
                    {s.tone === "warning"
                      ? "Action"
                      : s.tone === "success"
                        ? "OK"
                        : "Live"}
                  </Badge>
                )}
              </div>
            </Card>
          ))}
        </div>

        {tabs && tabs.length > 0 && (
          <Tabs defaultValue={tabs[0]}>
            <TabsList>
              {tabs.map((t) => (
                <TabsTrigger key={t} value={t}>
                  {t}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        )}

        <Card className="overflow-hidden">
          <div className="flex flex-wrap items-center gap-2 border-b border-border/70 bg-muted/30 p-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={`Search ${title.toLowerCase()}…`}
                className="h-9 pl-9 bg-background"
              />
            </div>
            <Button variant="outline" size="sm" className="gap-1.5">
              <Filter className="h-4 w-4" /> Filters
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5">
              <SlidersHorizontal className="h-4 w-4" /> View
            </Button>
          </div>

          <div className="p-6">
            <EmptyState
              icon={icon}
              title={emptyTitle ?? `No ${title.toLowerCase()} yet`}
              description={
                emptyDescription ??
                `Once your team starts working with ${title.toLowerCase()}, records will appear here with rich filtering, exports and detailed views.`
              }
              actionLabel={emptyAction}
              secondaryAction={
                <Button variant="outline" size="sm">
                  Import data
                </Button>
              }
            />
          </div>
        </Card>
      </motion.div>
    </>
  );
}

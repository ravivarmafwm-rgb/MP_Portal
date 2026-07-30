import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  ClipboardList,
  CheckCircle2,
  FileEdit,
  MessageSquare,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchSurveyStats, fetchSurveys } from "@/lib/api";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/surveys/dashboard")({
  head: () => ({ meta: [{ title: "Surveys — Command Center" }] }),
  component: SurveysDashboardPage,
});

function SurveysDashboardPage() {
  const { data: stats } = useQuery({
    queryKey: ["survey-stats"],
    queryFn: fetchSurveyStats,
    staleTime: 60_000,
  });
  const { data: surveysData, isLoading } = useQuery({
    queryKey: ["surveys-list"],
    queryFn: () => fetchSurveys({ per_page: 10 }),
    staleTime: 30_000,
  });
  const surveys = surveysData?.data ?? [];

  const statusTone: Record<string, string> = {
    active: "bg-success/10 text-success",
    draft: "bg-muted text-muted-foreground",
    closed: "bg-warning/15 text-warning",
    archived: "bg-muted text-muted-foreground",
  };

  const kpis = [
    {
      label: "Total Surveys",
      value: stats?.total ?? 0,
      icon: ClipboardList,
      tone: "bg-primary/10 text-primary",
    },
    {
      label: "Active",
      value: stats?.active ?? 0,
      icon: CheckCircle2,
      tone: "bg-success/10 text-success",
    },
    {
      label: "Draft",
      value: stats?.draft ?? 0,
      icon: FileEdit,
      tone: "bg-muted text-muted-foreground",
    },
    {
      label: "Total Responses",
      value: stats?.total_responses ?? 0,
      icon: MessageSquare,
      tone: "bg-info/10 text-info",
    },
  ];

  return (
    <>
      <PageHeader
        title="Survey Command Center"
        description="Field survey campaigns, responses and insights"
      />
      <div className="space-y-6 p-4 md:p-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {kpis.map((k, i) => (
            <motion.div
              key={k.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <Card className="p-5">
                <div
                  className={cn(
                    "grid h-10 w-10 place-items-center rounded-xl",
                    k.tone,
                  )}
                >
                  <k.icon className="h-5 w-5" />
                </div>
                <div className="mt-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {k.label}
                </div>
                <div className="mt-1 font-display text-3xl font-bold tabular-nums">
                  {k.value.toLocaleString()}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <Card className="overflow-hidden">
          <div className="flex items-center justify-between border-b border-border/70 bg-muted/30 p-4">
            <h3 className="font-semibold">All Surveys</h3>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/surveys/active">Active Surveys</Link>
            </Button>
          </div>
          {isLoading ? (
            <div className="space-y-2 p-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-14 w-full" />
              ))}
            </div>
          ) : (
            <div className="divide-y divide-border/60">
              {surveys.map((s: Record<string, unknown>, i: number) => (
                <motion.div
                  key={String(s.id)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.02 }}
                  className="flex items-center gap-4 p-4 hover:bg-muted/30"
                >
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold">
                      {String(s.title ?? "")}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {String(s.category ?? "—")} ·{" "}
                      {String(s.total_responses ?? 0)} responses
                    </div>
                  </div>
                  <div className="text-right text-xs text-muted-foreground">
                    <div>{String(s.start_date ?? "—")}</div>
                    <div>to {String(s.end_date ?? "ongoing")}</div>
                  </div>
                  <Badge
                    variant="secondary"
                    className={
                      statusTone[String(s.status ?? "draft")] ?? "bg-muted"
                    }
                  >
                    {String(s.status ?? "draft")}
                  </Badge>
                </motion.div>
              ))}
              {surveys.length === 0 && (
                <div className="p-8 text-center text-sm text-muted-foreground">
                  No surveys found.
                </div>
              )}
            </div>
          )}
        </Card>
      </div>
    </>
  );
}

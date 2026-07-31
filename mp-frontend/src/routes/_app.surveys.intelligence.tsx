import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  AlertTriangle,
  BarChart3,
  ClipboardList,
  Plus,
  ShieldCheck,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  fetchGrievanceCategories,
  fetchGrievanceStats,
  fetchSurveyStats,
  fetchSurveys,
  getApiErrorMessage,
} from "@/lib/api";

export const Route = createFileRoute("/_app/surveys/intelligence")({
  head: () => ({
    meta: [{ title: "Constituency Intelligence — MP Constituency" }],
  }),
  component: IntelligenceCenter,
});

interface CategoryAggregate {
  id: string;
  name: string;
  grievances_count: number;
  resolved_grievances_count: number;
  resolution_rate: number;
}

function IntelligenceCenter() {
  const grievances = useQuery({
    queryKey: ["grievance-stats-intelligence"],
    queryFn: fetchGrievanceStats,
    staleTime: 60_000,
  });
  const categories = useQuery({
    queryKey: ["grievance-categories-intelligence"],
    queryFn: fetchGrievanceCategories,
    staleTime: 60_000,
  });
  const surveyStats = useQuery({
    queryKey: ["survey-stats-intelligence"],
    queryFn: fetchSurveyStats,
    staleTime: 60_000,
  });
  const surveys = useQuery({
    queryKey: ["surveys-intelligence"],
    queryFn: () => fetchSurveys({ per_page: 10 }),
    staleTime: 60_000,
  });
  const queries = [grievances, categories, surveyStats, surveys];
  const error = queries.find((query) => query.isError);
  if (queries.some((query) => query.isLoading))
    return (
      <div className="space-y-4 p-8">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton className="h-28" key={index} />
        ))}
      </div>
    );
  if (error)
    return (
      <div className="p-8">
        <Card className="p-10 text-center text-sm text-destructive">
          {getApiErrorMessage(error.error)}
        </Card>
      </div>
    );
  const categoryRows = (categories.data ?? []) as CategoryAggregate[];
  const maxIssues = Math.max(
    ...categoryRows.map((item) => item.grievances_count),
    1,
  );
  const surveyRows = surveys.data?.data ?? [];
  return (
    <>
      <PageHeader
        title="Constituency Intelligence"
        description="Verified operational signals from scoped grievances and survey collections."
        actions={
          <Button size="sm" asChild>
            <Link to="/surveys/form-builder">
              <Plus className="mr-1 h-4 w-4" />
              New survey
            </Link>
          </Button>
        }
      />
      <div className="space-y-4 p-4 md:p-8">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {[
            ["Total grievances", grievances.data?.total ?? 0],
            [
              "Open / active",
              (grievances.data?.pending ?? 0) +
                (grievances.data?.assigned ?? 0) +
                (grievances.data?.in_progress ?? 0) +
                (grievances.data?.escalated ?? 0),
            ],
            ["Active surveys", surveyStats.data?.active ?? 0],
            ["Survey responses", surveyStats.data?.total_responses ?? 0],
          ].map(([label, value]) => (
            <Card key={String(label)} className="p-4">
              <div className="text-xs text-muted-foreground">{label}</div>
              <div className="mt-1 font-display text-2xl font-bold">
                {Number(value).toLocaleString("en-IN")}
              </div>
            </Card>
          ))}
        </div>
        <div className="grid gap-4 xl:grid-cols-2">
          <Card className="p-5">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-warning" />
              <h2 className="font-semibold">Grievance categories by volume</h2>
            </div>
            <p className="text-xs text-muted-foreground">
              Ranked only by persisted grievance count; severity and impact are
              not inferred.
            </p>
            {categoryRows.length === 0 ? (
              <p className="py-12 text-center text-sm text-muted-foreground">
                No grievance category data is available.
              </p>
            ) : (
              <div className="mt-4 space-y-3">
                {categoryRows
                  .filter((row) => row.grievances_count > 0)
                  .slice(0, 10)
                  .map((row, index) => (
                    <div key={row.id}>
                      <div className="flex items-center justify-between gap-3 text-sm">
                        <span>
                          #{index + 1} {row.name}
                        </span>
                        <span className="tabular-nums">
                          {row.grievances_count} total · {row.resolution_rate}%
                          resolved
                        </span>
                      </div>
                      <Progress
                        className="mt-1 h-1.5"
                        value={(row.grievances_count * 100) / maxIssues}
                      />
                    </div>
                  ))}
              </div>
            )}
          </Card>
          <Card className="p-5">
            <div className="flex items-center gap-2">
              <ClipboardList className="h-4 w-4 text-primary" />
              <h2 className="font-semibold">Survey collection progress</h2>
            </div>
            <p className="text-xs text-muted-foreground">
              Response totals and targets from persisted surveys.
            </p>
            {surveyRows.length === 0 ? (
              <p className="py-12 text-center text-sm text-muted-foreground">
                No surveys are available in your scope.
              </p>
            ) : (
              <div className="mt-4 space-y-3">
                {surveyRows.map((survey) => {
                  const count =
                    survey.response_count ?? survey.total_responses ?? 0;
                  const target = survey.target_responses ?? 0;
                  const pct =
                    target > 0
                      ? Math.min(100, Math.round((count * 100) / target))
                      : 0;
                  return (
                    <div key={survey.id} className="rounded-md border p-3">
                      <div className="flex justify-between gap-2">
                        <Link
                          to="/surveys/detail"
                          search={{ id: survey.id }}
                          className="text-sm font-semibold hover:text-primary"
                        >
                          {survey.title}
                        </Link>
                        <Badge variant="outline">{survey.status}</Badge>
                      </div>
                      <div className="mt-2 flex items-center gap-3">
                        <Progress className="h-1.5 flex-1" value={pct} />
                        <span className="text-xs tabular-nums">
                          {count}
                          {target ? ` / ${target}` : " responses"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>
        <Card className="border-primary/20 bg-primary/5 p-5">
          <div className="flex gap-3">
            <ShieldCheck className="mt-0.5 h-5 w-5 text-primary" />
            <div>
              <h2 className="font-semibold">Evidence boundary</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                This page does not claim AI analysis, affected-population
                estimates, trends, or a geographic heat map because the current
                data contracts do not prove those conclusions. Use question
                analytics and the response center for auditable source data.
              </p>
              <Button className="mt-3" size="sm" variant="outline" asChild>
                <Link to="/surveys/analytics">
                  <BarChart3 className="mr-1 h-4 w-4" />
                  Question analytics
                </Link>
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}

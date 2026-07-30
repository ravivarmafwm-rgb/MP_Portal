import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Calendar,
  Users2,
  MapPin,
  ClipboardList,
  BarChart3,
  ListChecks,
  CheckCircle2,
  Clock,
  Circle,
  ArrowLeft,
  UserPlus,
  Type,
  Hash,
  ChevronDown,
  CircleDot,
  CheckSquare,
  Star,
  Upload,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  closeSurvey,
  fetchSurvey,
  fetchSurveyAssignments,
  getApiErrorMessage,
} from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth";
import { SurveyAssignmentDialog } from "@/components/surveys/SurveyAssignmentDialog";

export const Route = createFileRoute("/_app/surveys/detail")({
  validateSearch: (s: Record<string, unknown>) => ({ id: String(s.id ?? "") }),
  head: () => ({ meta: [{ title: "Survey 360 — MP Constituency Platform" }] }),
  component: SurveyDetail,
});

const typeIcon: Record<string, LucideIcon> = {
  short_text: Type,
  long_text: Type,
  number: Hash,
  dropdown: ChevronDown,
  radio: CircleDot,
  checkbox: CheckSquare,
  rating: Star,
  file_upload: Upload,
  gps_location: MapPin,
  aadhaar_verification: ShieldCheck,
};

function SurveyDetail() {
  const { id } = useSearch({ from: "/_app/surveys/detail" });

  const surveyId = id;
  const client = useQueryClient();
  const { user } = useAuth();
  const [assignmentOpen, setAssignmentOpen] = useState(false);
  const canManage = [
    "super-admin",
    "mp",
    "mp-staff",
    "constituency-coordinator",
  ].includes(user?.role_slug ?? "");

  const { data: survey, isLoading } = useQuery({
    queryKey: ["survey-detail", surveyId],
    queryFn: () => fetchSurvey(surveyId!),
    enabled: !!surveyId,
    staleTime: 30_000,
  });
  const closing = useMutation({
    mutationFn: () => closeSurvey(surveyId),
    onSuccess: async () => {
      toast.success("Survey closed.");
      await client.invalidateQueries({ queryKey: ["survey-detail", surveyId] });
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
  const assignments = useQuery({
    queryKey: ["survey-assignments", surveyId],
    queryFn: () => fetchSurveyAssignments(surveyId),
    enabled: !!surveyId && canManage,
  });

  if (isLoading || !survey) {
    return (
      <div className="p-8 space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </div>
    );
  }

  const questions = survey.questions ?? [];
  const responseCount = survey.response_count ?? survey.total_responses ?? 0;
  const targetResponses = survey.target_responses ?? 100;
  const coverage =
    targetResponses > 0
      ? Math.min(100, Math.round((responseCount / targetResponses) * 100))
      : 0;

  const lifecycle = [
    {
      stage: "Survey Created",
      date: String(survey.created_at ?? "").substring(0, 10),
      by: "Admin",
      status: "done",
    },
    {
      stage: "Published / Active",
      date: String(survey.start_date ?? "").substring(0, 10),
      by: "Admin",
      status: survey.status !== "draft" ? "done" : "pending",
    },
    {
      stage: "Responses Collecting",
      date: "Ongoing",
      by: "Field Volunteers",
      status:
        survey.status === "active"
          ? "active"
          : responseCount > 0
            ? "done"
            : "pending",
    },
    {
      stage: "Survey Closed",
      date: String(survey.end_date ?? "—").substring(0, 10) || "—",
      by: "Admin",
      status: survey.status === "closed" ? "done" : "pending",
    },
  ];

  return (
    <>
      <PageHeader
        title={String(survey.title ?? "Survey 360")}
        description={`${String(survey.survey_code ?? survey.id ?? "").substring(0, 12)} · ${String(survey.category ?? "General")} · started ${String(survey.start_date ?? "").substring(0, 10)}`}
        actions={
          <>
            <Button size="sm" variant="outline" asChild>
              <Link to="/surveys/active">
                <ArrowLeft className="h-4 w-4" /> Back
              </Link>
            </Button>
            {survey.status === "draft" && (
              <Button size="sm" variant="outline" asChild>
                <Link to="/surveys/form-builder" search={{ id: survey.id }}>
                  Edit
                </Link>
              </Button>
            )}
            {survey.status === "active" && (
              <>
                {canManage && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setAssignmentOpen(true)}
                  >
                    <UserPlus className="h-4 w-4" /> Assign volunteers
                  </Button>
                )}
                <Button size="sm" asChild>
                  <Link to="/surveys/collect" search={{ id: survey.id }}>
                    Collect response
                  </Link>
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={closing.isPending}
                  onClick={() => closing.mutate()}
                >
                  Close survey
                </Button>
              </>
            )}
          </>
        }
      />
      <div className="space-y-4 p-4 md:p-8">
        <Card className="overflow-hidden">
          <div className="bg-gradient-to-r from-primary/10 via-background to-background p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">
                    {String(survey.category ?? "General")}
                  </Badge>
                  <Badge
                    variant="secondary"
                    className={
                      survey.status === "active"
                        ? "bg-success/10 text-success"
                        : "bg-muted"
                    }
                  >
                    {String(survey.status ?? "draft")}
                  </Badge>
                </div>
                <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />{" "}
                    {String(survey.start_date ?? "").substring(0, 10)} →{" "}
                    {String(survey.end_date ?? "ongoing").substring(0, 10)}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Users2 className="h-3.5 w-3.5" /> {questions.length}{" "}
                    questions
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />{" "}
                    {survey.village_id
                      ? "Selected village"
                      : survey.mandal_id
                        ? "Selected mandal"
                        : survey.assembly_constituency_id
                          ? "Selected assembly"
                          : "Constituency-wide"}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-[10px] uppercase text-muted-foreground">
                    Responses
                  </div>
                  <div className="font-display text-xl font-bold tabular-nums">
                    {responseCount.toLocaleString("en-IN")}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] uppercase text-muted-foreground">
                    Coverage
                  </div>
                  <div className="font-display text-xl font-bold text-primary tabular-nums">
                    {coverage}%
                  </div>
                </div>
                <div>
                  <div className="text-[10px] uppercase text-muted-foreground">
                    Target
                  </div>
                  <div className="font-display text-xl font-bold tabular-nums">
                    {targetResponses.toLocaleString("en-IN")}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Tabs defaultValue="overview">
          <TabsList className="flex w-full flex-wrap justify-start">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="questions">Questions</TabsTrigger>
            <TabsTrigger value="responses">Responses</TabsTrigger>
            <TabsTrigger value="coverage">Coverage</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            {canManage && (
              <TabsTrigger value="assignments">Assignments</TabsTrigger>
            )}
          </TabsList>

          <TabsContent
            value="overview"
            className="mt-4 grid gap-4 xl:grid-cols-3"
          >
            <Card className="p-5 xl:col-span-2">
              <h4 className="font-display text-sm font-bold">Survey Summary</h4>
              <p className="mt-2 text-sm text-muted-foreground">
                {String(survey.description ?? "No description provided.")}
              </p>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  { l: "Target", v: targetResponses.toLocaleString("en-IN") },
                  { l: "Collected", v: responseCount.toLocaleString("en-IN") },
                  {
                    l: "Pending",
                    v: Math.max(
                      0,
                      targetResponses - responseCount,
                    ).toLocaleString("en-IN"),
                  },
                  { l: "Questions", v: questions.length },
                ].map((s) => (
                  <div
                    key={s.l}
                    className="rounded-lg border border-border p-3"
                  >
                    <div className="text-[10px] uppercase text-muted-foreground">
                      {s.l}
                    </div>
                    <div className="font-display text-lg font-bold tabular-nums">
                      {s.v}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">
                    Overall Progress
                  </span>
                  <span className="font-semibold">{coverage}%</span>
                </div>
                <Progress value={coverage} className="h-2" />
              </div>
            </Card>
            <Card className="p-5">
              <h4 className="font-display text-sm font-bold">Participation</h4>
              <div className="mt-4 space-y-3">
                {[
                  { l: "Response Rate", v: coverage, max: 100 },
                  {
                    l: "Questions Covered",
                    v: questions.length,
                    max: Math.max(questions.length, 10),
                  },
                  {
                    l: "Target Completion",
                    v: Math.min(coverage, 100),
                    max: 100,
                  },
                ].map((s) => (
                  <div key={s.l}>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">{s.l}</span>
                      <span className="font-semibold tabular-nums">
                        {s.v}
                        {s.max === 100 ? "%" : `/${s.max}`}
                      </span>
                    </div>
                    <Progress
                      value={(s.v / s.max) * 100}
                      className="mt-1 h-1.5"
                    />
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="questions" className="mt-4">
            <Card className="p-5">
              <div className="mb-3 flex items-center justify-between">
                <h4 className="font-display text-sm font-bold">
                  Survey Structure
                </h4>
                <Badge variant="outline">{questions.length} questions</Badge>
              </div>
              {questions.length === 0 ? (
                <p className="text-sm text-muted-foreground py-8 text-center">
                  No questions defined for this survey.
                </p>
              ) : (
                <div className="space-y-2">
                  {questions.map((q, i) => {
                    const Icon = typeIcon[q.question_type] ?? Type;
                    return (
                      <div
                        key={String(q.id ?? i)}
                        className="flex items-center gap-3 rounded-md border border-border p-3"
                      >
                        <div className="grid h-8 w-8 place-items-center rounded-md bg-muted">
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-muted-foreground">
                            Q{Number(q.order_number ?? i + 1)} ·{" "}
                            {String(q.question_type ?? "text")}
                            {q.is_required && (
                              <Badge
                                variant="secondary"
                                className="bg-destructive/10 text-destructive text-[9px]"
                              >
                                Required
                              </Badge>
                            )}
                          </div>
                          <div className="text-sm font-medium">
                            {q.question_text}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>
          </TabsContent>

          <TabsContent
            value="responses"
            className="mt-4 grid gap-4 md:grid-cols-4"
          >
            {[
              { l: "Total Responses", v: responseCount, tone: "text-success" },
              { l: "Target", v: targetResponses, tone: "text-primary" },
              { l: "Coverage", v: `${coverage}%`, tone: "text-foreground" },
              {
                l: "Status",
                v: String(survey.status ?? "draft"),
                tone: "text-foreground",
              },
            ].map((s) => (
              <Card key={s.l} className="p-5">
                <div className="text-[11px] uppercase text-muted-foreground">
                  {s.l}
                </div>
                <div
                  className={cn(
                    "mt-1 font-display text-2xl font-bold tabular-nums",
                    s.tone,
                  )}
                >
                  {s.v}
                </div>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="coverage" className="mt-4">
            <Card className="p-5">
              <h4 className="font-display text-sm font-bold flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" /> Coverage Progress
              </h4>
              <div className="mt-4 grid grid-cols-6 gap-1.5 sm:grid-cols-10">
                {Array.from({ length: 60 }).map((_, i) => {
                  const filled = i < Math.round((coverage / 100) * 60);
                  return (
                    <div
                      key={i}
                      className={cn(
                        "aspect-square rounded-sm",
                        filled ? "bg-success" : "bg-muted/50",
                      )}
                    />
                  );
                })}
              </div>
              <div className="mt-4 flex justify-between text-sm">
                <span className="text-muted-foreground">
                  Responses collected
                </span>
                <span className="font-semibold tabular-nums">
                  {responseCount.toLocaleString("en-IN")} /{" "}
                  {targetResponses.toLocaleString("en-IN")}
                </span>
              </div>
              <Progress value={coverage} className="mt-2 h-2" />
            </Card>
          </TabsContent>

          <TabsContent value="timeline" className="mt-4">
            <Card className="p-5">
              <h4 className="font-display text-sm font-bold flex items-center gap-2">
                <ListChecks className="h-4 w-4 text-primary" /> Survey Lifecycle
              </h4>
              <div className="relative mt-5 ml-3 border-l-2 border-dashed border-border pl-6">
                {lifecycle.map((step, i) => {
                  const Icon =
                    step.status === "done"
                      ? CheckCircle2
                      : step.status === "active"
                        ? Clock
                        : Circle;
                  const tone =
                    step.status === "done"
                      ? "bg-success/10 text-success"
                      : step.status === "active"
                        ? "bg-primary/10 text-primary"
                        : "bg-muted text-muted-foreground";
                  return (
                    <motion.div
                      key={step.stage}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06 }}
                      className="relative pb-5"
                    >
                      <div
                        className={cn(
                          "absolute -left-[34px] grid h-7 w-7 place-items-center rounded-full ring-2 ring-background",
                          tone,
                        )}
                      >
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                      <div className="text-sm font-semibold">{step.stage}</div>
                      <div className="text-[11px] text-muted-foreground">
                        {step.date} · {step.by}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </Card>
          </TabsContent>
          {canManage && (
            <TabsContent value="assignments" className="mt-4">
              <Card className="p-5">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h4 className="font-display text-sm font-bold">
                      Field assignments
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      Targets and collection progress from persisted
                      assignments.
                    </p>
                  </div>
                  <Button size="sm" onClick={() => setAssignmentOpen(true)}>
                    <UserPlus className="mr-1 h-4 w-4" />
                    Assign
                  </Button>
                </div>
                {assignments.isLoading ? (
                  <Skeleton className="h-28" />
                ) : (assignments.data?.data ?? []).length === 0 ? (
                  <p className="py-8 text-center text-sm text-muted-foreground">
                    No volunteers have been assigned.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {assignments.data?.data.map((assignment) => {
                      const target = assignment.target_responses ?? 0;
                      const pct =
                        target > 0
                          ? Math.min(
                              100,
                              Math.round(
                                (assignment.completed_responses / target) * 100,
                              ),
                            )
                          : 0;
                      return (
                        <div
                          key={assignment.id}
                          className="rounded-md border p-3"
                        >
                          <div className="flex flex-wrap justify-between gap-2">
                            <div className="text-sm font-semibold">
                              {assignment.volunteer
                                ? `${assignment.volunteer.first_name} ${assignment.volunteer.last_name}`
                                : "Volunteer unavailable"}
                              <div className="text-xs font-normal text-muted-foreground">
                                {assignment.volunteer?.volunteer_id} · due{" "}
                                {assignment.due_date?.substring(0, 10) ??
                                  "not set"}
                              </div>
                            </div>
                            <Badge variant="outline">{assignment.status}</Badge>
                          </div>
                          <div className="mt-2 flex items-center gap-3">
                            <Progress value={pct} className="h-1.5 flex-1" />
                            <span className="text-xs tabular-nums">
                              {assignment.completed_responses}
                              {target ? ` / ${target}` : " collected"}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>
      <SurveyAssignmentDialog
        surveyId={surveyId}
        open={assignmentOpen}
        onOpenChange={setAssignmentOpen}
      />
    </>
  );
}

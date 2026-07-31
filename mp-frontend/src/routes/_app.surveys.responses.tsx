import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Search, Download, Eye, Filter, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import {
  downloadSurveyResponseAttachment,
  downloadSurveyResponses,
  fetchSurveys,
  fetchSurveyResponse,
  fetchSurveyResponses,
  fetchSurveyStats,
  getApiErrorMessage,
} from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/surveys/responses")({
  head: () => ({
    meta: [{ title: "Survey Responses — MP Constituency Platform" }],
  }),
  component: SurveyResponses,
});

function SurveyResponses() {
  const [q, setQ] = useState("");
  const [sv, setSv] = useState("all");
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);

  const { data: statsData } = useQuery({
    queryKey: ["survey-stats-resp"],
    queryFn: fetchSurveyStats,
    staleTime: 60_000,
  });
  const { data: surveysData } = useQuery({
    queryKey: ["surveys-for-filter"],
    queryFn: () => fetchSurveys({ per_page: 50 }),
    staleTime: 60_000,
  });
  const surveys = surveysData?.data ?? [];

  // Fetch survey responses from the API
  const {
    data: respData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["survey-responses-list", q, sv, page],
    queryFn: () => {
      const params: Record<string, string | number> = { page, per_page: 20 };
      if (sv !== "all") params.survey_id = sv;
      if (q) params.search = q;
      return fetchSurveyResponses(params);
    },
    staleTime: 30_000,
  });
  const detail = useQuery({
    queryKey: ["survey-response", selectedId],
    queryFn: () => fetchSurveyResponse(selectedId!),
    enabled: !!selectedId,
  });
  const exportCsv = async () => {
    setExporting(true);
    try {
      const url = await downloadSurveyResponses(sv === "all" ? undefined : sv);
      const link = document.createElement("a");
      link.href = url;
      link.download = `survey-responses-${new Date().toISOString().slice(0, 10)}.csv`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (exportError) {
      toast.error(getApiErrorMessage(exportError));
    } finally {
      setExporting(false);
    }
  };
  const downloadAttachment = async (responseId: string, detailId: string) => {
    try {
      const url = await downloadSurveyResponseAttachment(responseId, detailId);
      const link = document.createElement("a");
      link.href = url;
      link.download = "survey-attachment";
      link.click();
      URL.revokeObjectURL(url);
    } catch (downloadError) {
      toast.error(getApiErrorMessage(downloadError));
    }
  };

  const responses = respData?.data ?? [];
  const meta = respData?.meta ?? { total: 0, current_page: 1, last_page: 1 };

  const stats = [
    {
      l: "Total Responses",
      v: (statsData?.total_responses ?? 0).toLocaleString("en-IN"),
    },
    {
      l: "This Month",
      v: (statsData?.this_month ?? 0).toLocaleString("en-IN"),
    },
    { l: "Active Surveys", v: statsData?.active ?? 0 },
    { l: "Total Surveys", v: statsData?.total ?? 0 },
  ];

  return (
    <>
      <PageHeader
        title="Survey Response Center"
        description="Drill into every individual response captured by field volunteers."
        actions={
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            disabled={exporting}
            onClick={exportCsv}
          >
            {exporting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}{" "}
            Export CSV
          </Button>
        }
      />
      <div className="space-y-4 p-4 md:p-8">
        <div className="grid gap-3 md:grid-cols-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.l}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="p-4">
                <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
                  {s.l}
                </div>
                <div className="mt-1 font-display text-2xl font-bold tabular-nums">
                  {s.v}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <Card className="p-4">
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative min-w-[240px] flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                value={q}
                onChange={(e) => {
                  setQ(e.target.value);
                  setPage(1);
                }}
                placeholder="Search citizen, village, ID"
                className="pl-8"
              />
            </div>
            <Select
              value={sv}
              onValueChange={(v) => {
                setSv(v);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-[260px]">
                <Filter className="mr-1 h-3.5 w-3.5" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All surveys</SelectItem>
                {surveys.map((s: Record<string, unknown>) => (
                  <SelectItem key={String(s.id)} value={String(s.id)}>
                    {String(s.title ?? "")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </Card>

        <Card className="overflow-hidden">
          {isLoading ? (
            <div className="space-y-2 p-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : isError ? (
            <div className="py-12 text-center text-sm text-destructive">
              {getApiErrorMessage(error)}
            </div>
          ) : responses.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              No responses found. Responses will appear here as volunteers
              collect surveys.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Response ID</TableHead>
                  <TableHead>Survey</TableHead>
                  <TableHead>Village</TableHead>
                  <TableHead>Volunteer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Completion</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {responses.map((r, i) => (
                  <motion.tr
                    key={String(r.id)}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.02 }}
                    className="border-b"
                  >
                    <TableCell className="font-mono text-xs">
                      {String(r.id ?? "").substring(0, 8)}
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate text-xs">
                      {r.survey?.title ?? r.survey_id}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[10px]">
                        {r.village?.name ?? "—"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {r.volunteer
                        ? `${r.volunteer.first_name} ${r.volunteer.last_name}`
                        : "—"}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {String(r.response_date ?? r.created_at ?? "").substring(
                        0,
                        10,
                      )}
                    </TableCell>
                    <TableCell className="min-w-[140px]">
                      <div className="flex items-center gap-2">
                        <Progress value={100} className="h-1.5 flex-1" />
                        <span className="text-xs tabular-nums">100%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setSelectedId(r.id)}
                        aria-label="Review response"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </Button>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          )}
          <div className="flex items-center justify-between border-t border-border/70 px-4 py-3 text-xs text-muted-foreground">
            <span>
              Showing {responses.length} of {meta.total} responses
            </span>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                className="h-7"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </Button>
              <span className="px-2">
                Page {meta.current_page} / {meta.last_page}
              </span>
              <Button
                variant="outline"
                size="sm"
                className="h-7"
                disabled={page >= meta.last_page}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </Card>
      </div>
      <Dialog
        open={!!selectedId}
        onOpenChange={(open) => !open && setSelectedId(null)}
      >
        <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Survey response</DialogTitle>
            <DialogDescription>
              {detail.data?.survey?.title ?? "Loading response details…"}
            </DialogDescription>
          </DialogHeader>
          {detail.isLoading ? (
            <div className="flex justify-center p-12">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : detail.isError ? (
            <p className="py-8 text-center text-sm text-destructive">
              {getApiErrorMessage(detail.error)}
            </p>
          ) : detail.data ? (
            <div className="space-y-4">
              <div className="grid gap-2 rounded-md bg-muted/40 p-3 text-sm sm:grid-cols-2">
                <div>
                  <span className="text-muted-foreground">Respondent:</span>{" "}
                  {detail.data.respondent_name || "Not provided"}
                </div>
                <div>
                  <span className="text-muted-foreground">Village:</span>{" "}
                  {detail.data.village?.name ?? "Not provided"}
                </div>
                <div>
                  <span className="text-muted-foreground">Date:</span>{" "}
                  {detail.data.response_date?.substring(0, 10)}
                </div>
                <div>
                  <span className="text-muted-foreground">Volunteer:</span>{" "}
                  {detail.data.volunteer
                    ? `${detail.data.volunteer.first_name} ${detail.data.volunteer.last_name}`
                    : "Self-submitted"}
                </div>
              </div>
              <div className="space-y-2">
                {detail.data.response_details?.map((answer, index) => (
                  <div key={answer.id} className="rounded-md border p-3">
                    <div className="text-xs font-semibold text-muted-foreground">
                      Q{index + 1}. {answer.survey_question?.question_text}
                    </div>
                    <div className="mt-1 whitespace-pre-wrap text-sm">
                      {answer.answer ||
                        (answer.has_attachment ? "File attached" : "No answer")}
                    </div>
                    {answer.has_attachment && (
                      <Button
                        className="mt-2"
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          downloadAttachment(detail.data!.id, answer.id)
                        }
                      >
                        <Download className="mr-1 h-3.5 w-3.5" />
                        Download attachment
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}

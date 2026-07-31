import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Download,
  Plus,
  ExternalLink,
  Filter,
  Users2,
} from "lucide-react";
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
import { fetchSurveys } from "@/lib/api";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/surveys/active")({
  head: () => ({
    meta: [{ title: "Active Surveys — MP Constituency Platform" }],
  }),
  component: ActiveSurveys,
});

const statusTone: Record<string, string> = {
  active: "bg-success/10 text-success border-success/30",
  closed: "bg-muted text-muted-foreground border-border",
  draft: "bg-warning/15 text-warning border-warning/30",
  archived: "bg-info/10 text-info border-info/30",
};

function ActiveSurveys() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["surveys-active", q, status, page],
    queryFn: () =>
      fetchSurveys({
        search: q,
        page,
        per_page: 20,
        ...(status !== "all" ? { status } : {}),
      }),
    staleTime: 30_000,
  });

  const surveys = data?.data ?? [];
  const meta = data?.meta ?? { total: 0, current_page: 1, last_page: 1 };

  return (
    <>
      <PageHeader
        title="Active Surveys Directory"
        description={`${meta.total} surveys — search, filter and drill into any survey.`}
        actions={
          <>
            <Button variant="outline" size="sm" className="gap-1.5">
              <Download className="h-4 w-4" /> Export
            </Button>
            <Button size="sm" className="gap-1.5" asChild>
              <Link to="/surveys/form-builder">
                <Plus className="h-4 w-4" /> New Survey
              </Link>
            </Button>
          </>
        }
      />
      <div className="space-y-4 p-4 md:p-8">
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
                placeholder="Search by title"
                className="pl-8"
              />
            </div>
            <Select
              value={status}
              onValueChange={(v) => {
                setStatus(v);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-[160px]">
                <Filter className="mr-1 h-3.5 w-3.5" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
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
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Survey Code</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead className="text-right">Responses</TableHead>
                  <TableHead>Coverage</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Volunteers</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {surveys.map((s: Record<string, unknown>, i: number) => (
                  <motion.tr
                    key={String(s.id)}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.02 }}
                    className="border-b"
                  >
                    <TableCell className="font-mono text-xs">
                      {String(s.survey_code ?? s.id ?? "")}
                    </TableCell>
                    <TableCell className="max-w-[260px] truncate font-medium">
                      {String(s.title ?? "")}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[10px]">
                        {String(s.category ?? "General")}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {String(s.start_date ?? "").substring(0, 10)}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {Number(
                        s.total_responses ?? s.response_count ?? 0,
                      ).toLocaleString("en-IN")}
                    </TableCell>
                    <TableCell className="min-w-[140px]">
                      <div className="flex items-center gap-2">
                        <Progress
                          value={
                            Number(s.total_responses ?? 0) > 0
                              ? Math.min(
                                  100,
                                  Math.round(
                                    (Number(s.total_responses ?? 0) /
                                      Math.max(
                                        1,
                                        Number(s.target_responses ?? 100),
                                      )) *
                                      100,
                                  ),
                                )
                              : 0
                          }
                          className="h-1.5 flex-1"
                        />
                        <span className="text-xs tabular-nums">
                          {Number(s.total_responses ?? 0) > 0
                            ? Math.min(
                                100,
                                Math.round(
                                  (Number(s.total_responses ?? 0) /
                                    Math.max(
                                      1,
                                      Number(s.target_responses ?? 100),
                                    )) *
                                    100,
                                ),
                              )
                            : 0}
                          %
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-[10px]",
                          statusTone[String(s.status ?? "draft")],
                        )}
                      >
                        {String(s.status ?? "draft")}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      <span className="inline-flex items-center gap-1">
                        <Users2 className="h-3 w-3 text-muted-foreground" />
                        {Number(
                          s.responses_count ?? s.total_responses ?? 0,
                        ).toLocaleString("en-IN")}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button size="sm" variant="ghost" asChild>
                        <Link
                          to="/surveys/detail"
                          search={{ id: String(s.id) }}
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </Link>
                      </Button>
                    </TableCell>
                  </motion.tr>
                ))}
                {surveys.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={9}
                      className="py-12 text-center text-sm text-muted-foreground"
                    >
                      No surveys found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
          <div className="flex items-center justify-between border-t border-border/70 px-4 py-3 text-xs text-muted-foreground">
            <span>
              Showing {surveys.length} of {meta.total}
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
    </>
  );
}

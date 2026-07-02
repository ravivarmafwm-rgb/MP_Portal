import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Search, Download, ExternalLink, Filter } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchSurveys, fetchSurveyStats } from "@/lib/api";
import { api } from "@/lib/api";
import { useQuery as uq } from "@tanstack/react-query";

export const Route = createFileRoute("/_app/surveys/responses")({
  head: () => ({ meta: [{ title: "Survey Responses — MP Constituency Platform" }] }),
  component: SurveyResponses,
});

function SurveyResponses() {
  const [q, setQ] = useState("");
  const [sv, setSv] = useState("all");
  const [page, setPage] = useState(1);

  const { data: statsData } = useQuery({ queryKey: ["survey-stats-resp"], queryFn: fetchSurveyStats, staleTime: 60_000 });
  const { data: surveysData } = useQuery({ queryKey: ["surveys-for-filter"], queryFn: () => fetchSurveys({ per_page: 50 }), staleTime: 60_000 });
  const surveys = surveysData?.data ?? [];

  // Fetch survey responses from the API
  const { data: respData, isLoading } = useQuery({
    queryKey: ["survey-responses-list", q, sv, page],
    queryFn: async () => {
      const params: Record<string, string | number> = { page, per_page: 20 };
      if (sv !== "all") params.survey_id = sv;
      if (q) params.search = q;
      const res = await api.get("/surveys/responses", { params });
      return res.data;
    },
    staleTime: 30_000,
  });

  const responses = respData?.data ?? [];
  const meta = respData?.meta ?? { total: 0, current_page: 1, last_page: 1 };

  const stats = [
    { l: "Total Responses", v: (statsData?.total_responses ?? 0).toLocaleString("en-IN") },
    { l: "This Month",      v: (statsData?.this_month ?? 0).toLocaleString("en-IN") },
    { l: "Active Surveys",  v: statsData?.active ?? 0 },
    { l: "Total Surveys",   v: statsData?.total ?? 0 },
  ];

  return (
    <>
      <PageHeader
        title="Survey Response Center"
        description="Drill into every individual response captured by field volunteers."
        actions={<Button variant="outline" size="sm" className="gap-1.5"><Download className="h-4 w-4" /> Export CSV</Button>}
      />
      <div className="space-y-4 p-4 md:p-8">
        <div className="grid gap-3 md:grid-cols-4">
          {stats.map((s, i) => (
            <motion.div key={s.l} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="p-4">
                <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{s.l}</div>
                <div className="mt-1 font-display text-2xl font-bold tabular-nums">{s.v}</div>
              </Card>
            </motion.div>
          ))}
        </div>

        <Card className="p-4">
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative min-w-[240px] flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} placeholder="Search citizen, village, ID" className="pl-8" />
            </div>
            <Select value={sv} onValueChange={(v) => { setSv(v); setPage(1); }}>
              <SelectTrigger className="w-[260px]"><Filter className="mr-1 h-3.5 w-3.5" /><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All surveys</SelectItem>
                {surveys.map((s: Record<string, unknown>) => <SelectItem key={String(s.id)} value={String(s.id)}>{String(s.title ?? "")}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </Card>

        <Card className="overflow-hidden">
          {isLoading ? (
            <div className="space-y-2 p-4">{Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
          ) : responses.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              No responses found. Responses will appear here as volunteers collect surveys.
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
                {responses.map((r: Record<string, unknown>, i: number) => (
                  <motion.tr key={String(r.id)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }} className="border-b">
                    <TableCell className="font-mono text-xs">{String(r.id ?? "").substring(0, 8)}</TableCell>
                    <TableCell className="max-w-[200px] truncate text-xs">{String((r as Record<string, unknown>)?.survey?.title ?? r.survey_id ?? "")}</TableCell>
                    <TableCell><Badge variant="outline" className="text-[10px]">{String(r.village ?? "—")}</Badge></TableCell>
                    <TableCell className="text-xs text-muted-foreground">{String(r.volunteer_id ?? "—")}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{String(r.response_date ?? r.created_at ?? "").substring(0, 10)}</TableCell>
                    <TableCell className="min-w-[140px]">
                      <div className="flex items-center gap-2"><Progress value={100} className="h-1.5 flex-1" /><span className="text-xs tabular-nums">100%</span></div>
                    </TableCell>
                    <TableCell><Button size="sm" variant="ghost" asChild><Link to="/surveys/detail"><ExternalLink className="h-3.5 w-3.5" /></Link></Button></TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          )}
          <div className="flex items-center justify-between border-t border-border/70 px-4 py-3 text-xs text-muted-foreground">
            <span>Showing {responses.length} of {meta.total} responses</span>
            <div className="flex items-center gap-1">
              <Button variant="outline" size="sm" className="h-7" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Previous</Button>
              <span className="px-2">Page {meta.current_page} / {meta.last_page}</span>
              <Button variant="outline" size="sm" className="h-7" disabled={page >= meta.last_page} onClick={() => setPage(p => p + 1)}>Next</Button>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}

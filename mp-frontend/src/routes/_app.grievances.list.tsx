import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  MessageSquareWarning,
  Search,
  Download,
  Plus,
  Eye,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fetchGrievances, fetchGrievanceStats } from "@/lib/api";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/grievances/list")({
  head: () => ({ meta: [{ title: "Complaint Directory — Grievances" }] }),
  component: GrievanceListPage,
});

const statusTone: Record<string, string> = {
  pending: "bg-destructive/10 text-destructive",
  assigned: "bg-info/10 text-info",
  in_progress: "bg-primary/10 text-primary",
  escalated: "bg-warning/15 text-warning",
  resolved: "bg-success/10 text-success",
  closed: "bg-muted text-muted-foreground",
};

const priorityTone: Record<string, string> = {
  urgent: "bg-destructive/10 text-destructive",
  high: "bg-warning/15 text-warning",
  medium: "bg-info/10 text-info",
  low: "bg-muted text-muted-foreground",
};

function GrievanceListPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [priority, setPriority] = useState("all");
  const [page, setPage] = useState(1);

  const { data: statsData } = useQuery({
    queryKey: ["grievance-stats"],
    queryFn: fetchGrievanceStats,
    staleTime: 30_000,
  });
  const { data, isLoading } = useQuery({
    queryKey: ["grievances", search, status, priority, page],
    queryFn: () =>
      fetchGrievances({
        search,
        ...(status !== "all" ? { status } : {}),
        ...(priority !== "all" ? { priority } : {}),
        page,
        per_page: 20,
      }),
    staleTime: 15_000,
  });

  const grievances = data?.data ?? [];
  const meta = data?.meta ?? { total: 0, current_page: 1, last_page: 1 };

  return (
    <>
      <PageHeader
        title="Master Complaint Directory"
        description={`${meta.total} total cases · search, filter and triage at scale`}
        actions={
          <>
            <Button variant="outline" size="sm" className="gap-1.5">
              <Download className="h-4 w-4" /> Export
            </Button>
            <Button size="sm" className="gap-1.5">
              <Plus className="h-4 w-4" /> Register Complaint
            </Button>
          </>
        }
      />
      <div className="space-y-6 p-4 md:p-8">
        {/* Stats row */}
        {statsData && (
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
            {[
              {
                label: "Total",
                value: statsData.total,
                tone: "text-foreground",
              },
              {
                label: "Pending",
                value: statsData.pending,
                tone: "text-destructive",
              },
              {
                label: "Assigned",
                value: statsData.assigned,
                tone: "text-info",
              },
              {
                label: "Escalated",
                value: statsData.escalated,
                tone: "text-warning",
              },
              {
                label: "Resolved",
                value: statsData.resolved,
                tone: "text-success",
              },
              {
                label: "This Week",
                value: statsData.this_week,
                tone: "text-primary",
              },
            ].map((s) => (
              <Card key={s.label} className="p-3 text-center">
                <div
                  className={`font-display text-2xl font-bold tabular-nums ${s.tone}`}
                >
                  {s.value ?? 0}
                </div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </Card>
            ))}
          </div>
        )}

        <Card className="overflow-hidden">
          <div className="flex flex-wrap items-center gap-2 border-b border-border/70 bg-muted/30 p-3">
            <div className="relative min-w-[200px] flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by ID, citizen, subject…"
                className="h-9 bg-background pl-9"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
            </div>
            <Select
              value={status}
              onValueChange={(v) => {
                setStatus(v);
                setPage(1);
              }}
            >
              <SelectTrigger className="h-9 w-[130px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="assigned">Assigned</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="escalated">Escalated</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={priority}
              onValueChange={(v) => {
                setPriority(v);
                setPage(1);
              }}
            >
              <SelectTrigger className="h-9 w-[130px]">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className="space-y-2 p-4">
              {Array.from({ length: 10 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Grievance #</TableHead>
                    <TableHead>Citizen</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">View</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {grievances.map((g: Record<string, unknown>, i: number) => (
                    <motion.tr
                      key={String(g.id)}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.01 }}
                      className="border-b hover:bg-muted/40"
                    >
                      <TableCell className="font-mono text-xs">
                        {String(g.grievance_number ?? "")}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm font-semibold">
                          {String(g.citizen_name ?? "")}
                        </div>
                        <div className="text-[11px] tabular-nums text-muted-foreground">
                          {String(g.citizen_mobile ?? "")}
                        </div>
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate text-sm">
                        {String(g.subject ?? "")}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={cn(
                            "text-[10px]",
                            priorityTone[String(g.priority ?? "medium")],
                          )}
                        >
                          {String(g.priority ?? "").toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={cn(
                            "text-[10px]",
                            statusTone[String(g.status ?? "pending")],
                          )}
                        >
                          {String(g.status ?? "").replace("_", " ")}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs tabular-nums">
                        {String(g.created_at ?? "").substring(0, 10)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Link to="/grievances/detail">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </Button>
                        </Link>
                      </TableCell>
                    </motion.tr>
                  ))}
                  {grievances.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="py-12 text-center text-sm text-muted-foreground"
                      >
                        No grievances found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
          <div className="flex items-center justify-between border-t border-border/70 px-4 py-3 text-xs text-muted-foreground">
            <span>
              Showing {grievances.length} of {meta.total} grievances
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

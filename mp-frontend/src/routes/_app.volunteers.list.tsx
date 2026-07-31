import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Users,
  UserCheck,
  UserMinus,
  UserPlus,
  MapPin,
  Search,
  Download,
  Plus,
  Eye,
  Phone,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
import { fetchVolunteers, fetchVolunteerStats } from "@/lib/api";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/volunteers/list")({
  head: () => ({
    meta: [{ title: "Volunteer Directory — MP Constituency Platform" }],
  }),
  component: VolunteerListPage,
});

const statusTone: Record<string, string> = {
  active: "bg-success/10 text-success",
  inactive: "bg-muted text-muted-foreground",
  on_leave: "bg-warning/15 text-warning",
  training: "bg-info/10 text-info",
};

function VolunteerListPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);

  const { data: statsData } = useQuery({
    queryKey: ["volunteer-stats"],
    queryFn: fetchVolunteerStats,
    staleTime: 60_000,
  });
  const { data, isLoading } = useQuery({
    queryKey: ["volunteers", search, status, page],
    queryFn: () =>
      fetchVolunteers({
        search,
        ...(status !== "all" ? { status } : {}),
        page,
        per_page: 20,
      }),
    staleTime: 30_000,
  });

  const volunteers = data?.data ?? [];
  const meta = data?.meta ?? { total: 0, current_page: 1, last_page: 1 };

  const kpis = [
    {
      label: "Total",
      value: statsData?.total ?? 0,
      icon: Users,
      tone: "bg-primary/10 text-primary",
    },
    {
      label: "Active",
      value: statsData?.active ?? 0,
      icon: UserCheck,
      tone: "bg-success/10 text-success",
    },
    {
      label: "Inactive",
      value: statsData?.inactive ?? 0,
      icon: UserMinus,
      tone: "bg-muted text-muted-foreground",
    },
    {
      label: "Available Now",
      value: statsData?.available_now ?? 0,
      icon: UserPlus,
      tone: "bg-info/10 text-info",
    },
    {
      label: "Villages Covered",
      value: statsData?.villages_covered ?? 0,
      icon: MapPin,
      tone: "bg-warning/15 text-warning",
    },
  ];

  return (
    <>
      <PageHeader
        title="Volunteer Directory"
        description={`${meta.total} field volunteers — search, filter, drill into any profile`}
        actions={
          <>
            <Button variant="outline" size="sm" className="gap-1.5">
              <Download className="h-4 w-4" /> Export
            </Button>
            <Button size="sm" className="gap-1.5">
              <Plus className="h-4 w-4" /> Add Volunteer
            </Button>
          </>
        }
      />
      <div className="space-y-6 p-4 md:p-8">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
          {kpis.map((k, i) => (
            <motion.div
              key={k.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <Card className="p-4">
                <div
                  className={cn(
                    "grid h-9 w-9 place-items-center rounded-lg",
                    k.tone,
                  )}
                >
                  <k.icon className="h-4 w-4" />
                </div>
                <div className="mt-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {k.label}
                </div>
                <div className="mt-1 font-display text-2xl font-bold tabular-nums">
                  {k.value.toLocaleString()}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <Card className="overflow-hidden">
          <div className="flex flex-wrap items-center gap-2 border-b border-border/70 bg-muted/30 p-3">
            <div className="relative min-w-[200px] flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name, mobile, ID…"
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
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
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
                    <TableHead>Volunteer</TableHead>
                    <TableHead>ID</TableHead>
                    <TableHead>Mobile</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Activities</TableHead>
                    <TableHead>Performance</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {volunteers.map((v: Record<string, unknown>, i: number) => (
                    <motion.tr
                      key={String(v.id)}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.015 }}
                      className="border-b hover:bg-muted/40"
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarFallback className="text-xs">
                              {String(v.first_name ?? "").charAt(0)}
                              {String(v.last_name ?? "").charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="text-sm font-semibold">
                              {String(v.first_name ?? "")}{" "}
                              {String(v.last_name ?? "")}
                            </div>
                            <div className="text-[11px] text-muted-foreground">
                              {String(v.email ?? "—")}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {String(v.volunteer_id ?? "")}
                      </TableCell>
                      <TableCell className="tabular-nums text-xs">
                        {String(v.mobile_number ?? "—")}
                      </TableCell>
                      <TableCell className="text-xs tabular-nums">
                        {String(v.joining_date ?? "—")}
                      </TableCell>
                      <TableCell className="tabular-nums text-sm">
                        {String(v.total_activities ?? 0)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
                            <div
                              className="h-full rounded-full bg-primary"
                              style={{
                                width: `${Math.min(100, Number(v.performance_score ?? 0) * 10)}%`,
                              }}
                            />
                          </div>
                          <span className="text-xs font-semibold tabular-nums">
                            {Number(v.performance_score ?? 0).toFixed(1)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={
                            statusTone[String(v.status ?? "active")] ??
                            "bg-muted"
                          }
                        >
                          {String(v.status ?? "—")}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="inline-flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                          >
                            <Phone className="h-3.5 w-3.5" />
                          </Button>
                          <Link
                            to="/volunteers/profile"
                            search={{ id: String(v.id) }}
                          >
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                            >
                              <Eye className="h-3.5 w-3.5" />
                            </Button>
                          </Link>
                        </div>
                      </TableCell>
                    </motion.tr>
                  ))}
                  {volunteers.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={8}
                        className="py-12 text-center text-sm text-muted-foreground"
                      >
                        No volunteers found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
          <div className="flex items-center justify-between border-t border-border/70 px-4 py-3 text-xs text-muted-foreground">
            <span>
              Showing {volunteers.length} of {meta.total} volunteers
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

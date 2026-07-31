import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  CalendarDays,
  Search,
  Download,
  Plus,
  Eye,
  CheckCircle2,
  Clock,
  XCircle,
  Phone,
  User,
  Loader2,
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  fetchAppointments,
  fetchAppointmentStats,
  createAppointment,
  fetchLocMandals,
  fetchLocVillages,
} from "@/lib/api";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/meetings/appointments")({
  head: () => ({ meta: [{ title: "Appointments — Citizen Meetings" }] }),
  component: AppointmentsPage,
});

const statusTone: Record<string, string> = {
  pending: "bg-warning/15 text-warning",
  confirmed: "bg-info/10 text-info",
  completed: "bg-success/10 text-success",
  cancelled: "bg-muted text-muted-foreground",
  rescheduled: "bg-primary/10 text-primary",
  no_show: "bg-destructive/10 text-destructive",
};

const priorityTone: Record<string, string> = {
  urgent: "bg-destructive/10 text-destructive",
  high: "bg-warning/15 text-warning",
  medium: "bg-info/10 text-info",
  low: "bg-muted text-muted-foreground",
};

function AppointmentsPage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [priority, setPriority] = useState("all");
  const [page, setPage] = useState(1);
  const [showCreate, setShowCreate] = useState(false);

  // Create form state
  const [form, setForm] = useState({
    citizen_name: "",
    citizen_mobile: "",
    citizen_village: "",
    citizen_mandal: "",
    purpose: "",
    description: "",
    meeting_type: "in_person",
    category: "general",
    priority: "medium",
    requested_date: "",
  });

  const { data: statsData } = useQuery({
    queryKey: ["appointment-stats"],
    queryFn: fetchAppointmentStats,
    staleTime: 30_000,
  });
  const { data, isLoading } = useQuery({
    queryKey: ["appointments", search, status, priority, page],
    queryFn: () =>
      fetchAppointments({
        search,
        page,
        per_page: 20,
        ...(status !== "all" ? { status } : {}),
        ...(priority !== "all" ? { priority } : {}),
      }),
    staleTime: 15_000,
  });

  const appointments = data?.data ?? [];
  const meta = data?.meta ?? { total: 0, current_page: 1, last_page: 1 };

  const { mutate: doCreate, isPending: creating } = useMutation({
    mutationFn: createAppointment,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["appointments"] });
      qc.invalidateQueries({ queryKey: ["appointment-stats"] });
      setShowCreate(false);
      setForm({
        citizen_name: "",
        citizen_mobile: "",
        citizen_village: "",
        citizen_mandal: "",
        purpose: "",
        description: "",
        meeting_type: "in_person",
        category: "general",
        priority: "medium",
        requested_date: "",
      });
      toast.success("Appointment scheduled successfully!");
    },
    onError: () => toast.error("Failed to create appointment"),
  });

  const statCards = [
    { label: "Total", value: statsData?.total ?? 0, tone: "text-foreground" },
    { label: "Pending", value: statsData?.pending ?? 0, tone: "text-warning" },
    { label: "Confirmed", value: statsData?.confirmed ?? 0, tone: "text-info" },
    {
      label: "Completed",
      value: statsData?.completed ?? 0,
      tone: "text-success",
    },
    { label: "Today", value: statsData?.today ?? 0, tone: "text-primary" },
    {
      label: "Follow-up Pending",
      value: statsData?.follow_up_pending ?? 0,
      tone: "text-destructive",
    },
  ];

  return (
    <>
      <PageHeader
        title="Appointment Management"
        description={`${meta.total} total appointments · manage citizen meeting requests`}
        actions={
          <>
            <Button variant="outline" size="sm" className="gap-1.5">
              <Download className="h-4 w-4" /> Export
            </Button>
            <Button
              size="sm"
              className="gap-1.5"
              onClick={() => setShowCreate(true)}
            >
              <Plus className="h-4 w-4" /> New Appointment
            </Button>
          </>
        }
      />
      <div className="space-y-6 p-4 md:p-8">
        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
          {statCards.map((s) => (
            <Card key={s.label} className="p-3 text-center">
              <div
                className={`font-display text-2xl font-bold tabular-nums ${s.tone}`}
              >
                {s.value}
              </div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
            </Card>
          ))}
        </div>

        <Card className="overflow-hidden">
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2 border-b border-border/70 bg-muted/30 p-3">
            <div className="relative min-w-[220px] flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name, mobile, purpose…"
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
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="rescheduled">Rescheduled</SelectItem>
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

          {/* Table */}
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
                    <TableHead>Token</TableHead>
                    <TableHead>Citizen</TableHead>
                    <TableHead>Purpose</TableHead>
                    <TableHead>Village</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Requested</TableHead>
                    <TableHead>Scheduled</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {appointments.map((a: Record<string, unknown>, i: number) => (
                    <motion.tr
                      key={String(a.id)}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.01 }}
                      className="border-b hover:bg-muted/40"
                    >
                      <TableCell className="font-mono text-xs">
                        {String(a.token_number ?? "—")}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
                            <User className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="text-sm font-semibold">
                              {String(a.citizen_name ?? "")}
                            </div>
                            <div className="text-[11px] text-muted-foreground tabular-nums">
                              {String(a.citizen_mobile ?? "—")}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-[160px] truncate text-sm">
                        {String(a.purpose ?? "")}
                      </TableCell>
                      <TableCell className="text-xs">
                        {String(a.citizen_village ?? "—")}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={cn(
                            "text-[10px]",
                            priorityTone[String(a.priority ?? "medium")],
                          )}
                        >
                          {String(a.priority ?? "").toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs tabular-nums">
                        {String(a.requested_date ?? "").substring(0, 10)}
                      </TableCell>
                      <TableCell className="text-xs tabular-nums">
                        {String(a.scheduled_date ?? "—").substring(0, 10)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={cn(
                            "text-[10px]",
                            statusTone[String(a.status ?? "pending")],
                          )}
                        >
                          {String(a.status ?? "").replace("_", " ")}
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
                            to="/meetings/appointment-detail"
                            search={{ id: String(a.id) }}
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
                  {appointments.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={9}
                        className="py-12 text-center text-sm text-muted-foreground"
                      >
                        No appointments found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
          <div className="flex items-center justify-between border-t border-border/70 px-4 py-3 text-xs text-muted-foreground">
            <span>
              Showing {appointments.length} of {meta.total}
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

      {/* Create Appointment Dialog */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Schedule New Appointment</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Citizen Name *</Label>
              <Input
                value={form.citizen_name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, citizen_name: e.target.value }))
                }
                placeholder="Full name"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Mobile Number</Label>
              <Input
                value={form.citizen_mobile}
                onChange={(e) =>
                  setForm((f) => ({ ...f, citizen_mobile: e.target.value }))
                }
                placeholder="9876543210"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Village</Label>
              <Input
                value={form.citizen_village}
                onChange={(e) =>
                  setForm((f) => ({ ...f, citizen_village: e.target.value }))
                }
                placeholder="Village name"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Mandal</Label>
              <Input
                value={form.citizen_mandal}
                onChange={(e) =>
                  setForm((f) => ({ ...f, citizen_mandal: e.target.value }))
                }
                placeholder="Mandal name"
              />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label>Purpose *</Label>
              <Input
                value={form.purpose}
                onChange={(e) =>
                  setForm((f) => ({ ...f, purpose: e.target.value }))
                }
                placeholder="Reason for appointment"
              />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label>Description</Label>
              <Textarea
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
                placeholder="Additional details"
                rows={3}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Category</Label>
              <Select
                value={form.category}
                onValueChange={(v) => setForm((f) => ({ ...f, category: v }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="grievance">Grievance</SelectItem>
                  <SelectItem value="scheme">Scheme</SelectItem>
                  <SelectItem value="project">Project</SelectItem>
                  <SelectItem value="personal">Personal</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Priority</Label>
              <Select
                value={form.priority}
                onValueChange={(v) => setForm((f) => ({ ...f, priority: v }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Requested Date *</Label>
              <Input
                type="date"
                value={form.requested_date}
                onChange={(e) =>
                  setForm((f) => ({ ...f, requested_date: e.target.value }))
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label>Meeting Type</Label>
              <Select
                value={form.meeting_type}
                onValueChange={(v) =>
                  setForm((f) => ({ ...f, meeting_type: v }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="in_person">In Person</SelectItem>
                  <SelectItem value="phone">Phone</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setShowCreate(false)}>
              Cancel
            </Button>
            <Button
              disabled={
                creating ||
                !form.citizen_name ||
                !form.purpose ||
                !form.requested_date
              }
              onClick={() => doCreate(form as Record<string, unknown>)}
            >
              {creating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Scheduling…
                </>
              ) : (
                "Schedule Appointment"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

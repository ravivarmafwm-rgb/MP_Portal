import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Building2,
  Calendar,
  MapPin,
  Users,
  Plus,
  Loader2,
  Clock,
  CheckCircle2,
  ArrowUpRight,
  Mic,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { fetchPublicMeetings, createPublicMeeting } from "@/lib/api";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/meetings/public-meetings")({
  head: () => ({ meta: [{ title: "Public Meetings — Community Engagement" }] }),
  component: PublicMeetingsPage,
});

const statusTone: Record<string, string> = {
  scheduled: "bg-primary/10 text-primary",
  ongoing: "bg-warning/15 text-warning",
  completed: "bg-success/10 text-success",
  cancelled: "bg-muted text-muted-foreground",
  postponed: "bg-destructive/10 text-destructive",
};

const typeTone: Record<string, string> = {
  town_hall: "bg-primary/10 text-primary",
  community_meeting: "bg-info/10 text-info",
  department_review: "bg-warning/15 text-warning",
  stakeholder_meeting: "bg-success/10 text-success",
  awareness_program: "bg-destructive/10 text-destructive",
};

function PublicMeetingsPage() {
  const qc = useQueryClient();
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    meeting_type: "town_hall",
    venue: "",
    meeting_date: "",
    start_time: "10:00",
    expected_attendance: 100,
    chief_guest: "",
    agenda_items: [] as string[],
  });

  const { data, isLoading } = useQuery({
    queryKey: ["public-meetings", typeFilter, statusFilter],
    queryFn: () =>
      fetchPublicMeetings({
        per_page: 50,
        ...(typeFilter !== "all" ? { type: typeFilter } : {}),
        ...(statusFilter !== "all" ? { status: statusFilter } : {}),
      }),
    staleTime: 30_000,
  });

  const meetings = data?.data ?? [];

  const { mutate: doCreate, isPending: creating } = useMutation({
    mutationFn: createPublicMeeting,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["public-meetings"] });
      setShowCreate(false);
      toast.success("Public meeting scheduled!");
    },
    onError: () => toast.error("Failed to schedule meeting"),
  });

  const upcoming = meetings.filter((m) => m.status === "scheduled").length;
  const completedCount = meetings.filter(
    (m) => m.status === "completed",
  ).length;
  const totalAttendance = meetings.reduce(
    (acc, m) => acc + m.actual_attendance,
    0,
  );

  return (
    <>
      <PageHeader
        title="Public Meetings Center"
        description="Town halls, community meetings, department reviews and awareness programs"
        actions={
          <Button
            size="sm"
            className="gap-1.5"
            onClick={() => setShowCreate(true)}
          >
            <Plus className="h-4 w-4" /> Schedule Meeting
          </Button>
        }
      />
      <div className="space-y-6 p-4 md:p-8">
        {/* Summary Stats */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            {
              label: "Total Meetings",
              value: meetings.length,
              tone: "text-foreground",
            },
            { label: "Upcoming", value: upcoming, tone: "text-primary" },
            { label: "Completed", value: completedCount, tone: "text-success" },
            {
              label: "Total Attendance",
              value: totalAttendance,
              tone: "text-info",
            },
          ].map((s) => (
            <Card key={s.label} className="p-4 text-center">
              <div
                className={`font-display text-2xl font-bold tabular-nums ${s.tone}`}
              >
                {s.value.toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          {[
            "all",
            "town_hall",
            "community_meeting",
            "department_review",
            "awareness_program",
          ].map((t) => (
            <Button
              key={t}
              size="sm"
              variant={typeFilter === t ? "default" : "outline"}
              onClick={() => setTypeFilter(t)}
              className="text-xs capitalize"
            >
              {t.replace(/_/g, " ")}
            </Button>
          ))}
        </div>

        {/* Meeting Cards Grid */}
        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-52 rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {meetings.map((m, i) => {
              const isPast = m.status === "completed";
              return (
                <motion.div
                  key={String(m.id)}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card className="p-5 flex flex-col gap-3 hover:-translate-y-0.5 hover:shadow-elevated transition-all">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <Badge
                          variant="secondary"
                          className={cn(
                            "text-[10px] mb-1",
                            typeTone[String(m.meeting_type ?? "town_hall")],
                          )}
                        >
                          {String(m.meeting_type ?? "").replace(/_/g, " ")}
                        </Badge>
                        <h3 className="font-semibold text-sm leading-tight">
                          {String(m.title ?? "")}
                        </h3>
                      </div>
                      <Badge
                        variant="secondary"
                        className={cn(
                          "shrink-0 text-[10px]",
                          statusTone[String(m.status ?? "scheduled")],
                        )}
                      >
                        {String(m.status ?? "")}
                      </Badge>
                    </div>

                    <div className="space-y-1.5 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 shrink-0" />
                        {String(m.venue ?? "")}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 shrink-0" />
                        {String(m.meeting_date ?? "").substring(0, 10)} ·{" "}
                        {String(m.start_time ?? "10:00")}
                      </div>
                      {m.chief_guest && (
                        <div className="flex items-center gap-1.5">
                          <Mic className="h-3.5 w-3.5 shrink-0" />
                          {String(m.chief_guest)}
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2 rounded-lg bg-muted/40 p-3 text-center text-xs">
                      <div>
                        <div className="font-bold text-base tabular-nums">
                          {Number(m.expected_attendance ?? 0)}
                        </div>
                        <div className="text-muted-foreground">Expected</div>
                      </div>
                      <div>
                        <div
                          className={cn(
                            "font-bold text-base tabular-nums",
                            isPast ? "text-success" : "text-muted-foreground",
                          )}
                        >
                          {isPast ? Number(m.actual_attendance ?? 0) : "—"}
                        </div>
                        <div className="text-muted-foreground">Attended</div>
                      </div>
                    </div>

                    {m.key_outcomes && (
                      <p className="text-xs text-muted-foreground line-clamp-2 rounded-md bg-success/5 p-2 border border-success/20">
                        {String(m.key_outcomes)}
                      </p>
                    )}

                    <div className="flex justify-end mt-auto">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 gap-1 text-xs"
                      >
                        Details <ArrowUpRight className="h-3 w-3" />
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}

        {meetings.length === 0 && !isLoading && (
          <div className="py-16 text-center">
            <Building2 className="h-12 w-12 mx-auto text-muted-foreground/40 mb-4" />
            <p className="text-muted-foreground">No public meetings found</p>
            <Button
              size="sm"
              className="mt-3"
              onClick={() => setShowCreate(true)}
            >
              <Plus className="h-4 w-4 mr-1.5" /> Schedule First Meeting
            </Button>
          </div>
        )}
      </div>

      {/* Create Dialog */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Schedule Public Meeting</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="space-y-1.5">
              <Label>Meeting Title *</Label>
              <Input
                value={form.title}
                onChange={(e) =>
                  setForm((f) => ({ ...f, title: e.target.value }))
                }
                placeholder="e.g. Town Hall — Water Supply Review"
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
                  <SelectItem value="town_hall">Town Hall</SelectItem>
                  <SelectItem value="community_meeting">
                    Community Meeting
                  </SelectItem>
                  <SelectItem value="department_review">
                    Department Review
                  </SelectItem>
                  <SelectItem value="stakeholder_meeting">
                    Stakeholder Meeting
                  </SelectItem>
                  <SelectItem value="awareness_program">
                    Awareness Program
                  </SelectItem>
                  <SelectItem value="public_hearing">Public Hearing</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Venue *</Label>
              <Input
                value={form.venue}
                onChange={(e) =>
                  setForm((f) => ({ ...f, venue: e.target.value }))
                }
                placeholder="Community Hall, Village name…"
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Meeting Date *</Label>
                <Input
                  type="date"
                  value={form.meeting_date}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, meeting_date: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label>Start Time *</Label>
                <Input
                  type="time"
                  value={form.start_time}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, start_time: e.target.value }))
                  }
                />
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Expected Attendance</Label>
                <Input
                  type="number"
                  value={form.expected_attendance}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      expected_attendance: Number(e.target.value),
                    }))
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label>Chief Guest</Label>
                <Input
                  value={form.chief_guest}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, chief_guest: e.target.value }))
                  }
                  placeholder="Hon. MP Ravi Varma"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Description</Label>
              <Textarea
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreate(false)}>
              Cancel
            </Button>
            <Button
              disabled={
                creating || !form.title || !form.venue || !form.meeting_date
              }
              onClick={() =>
                doCreate({
                  ...form,
                  start_time: form.start_time + ":00",
                } as Record<string, unknown>)
              }
            >
              {creating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Scheduling…
                </>
              ) : (
                "Schedule Meeting"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

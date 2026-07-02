import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  ArrowLeft, User, Phone, MapPin, CalendarDays, Clock,
  FileText, MessageSquare, CheckCircle2, AlertCircle, Star,
  ClipboardList, Link2,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { fetchAppointments, updateAppointment } from "@/lib/api";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/meetings/appointment-detail")({
  validateSearch: (search: Record<string, unknown>) => ({ id: String(search.id ?? "") }),
  head: () => ({ meta: [{ title: "Appointment Detail — Case 360" }] }),
  component: AppointmentDetailPage,
});

const statusTone: Record<string, string> = {
  pending:     "bg-warning/15 text-warning",
  confirmed:   "bg-info/10 text-info",
  completed:   "bg-success/10 text-success",
  cancelled:   "bg-muted text-muted-foreground",
  rescheduled: "bg-primary/10 text-primary",
  no_show:     "bg-destructive/10 text-destructive",
};

const priorityTone: Record<string, string> = {
  urgent: "bg-destructive/10 text-destructive",
  high:   "bg-warning/15 text-warning",
  medium: "bg-info/10 text-info",
  low:    "bg-muted text-muted-foreground",
};

function AppointmentDetailPage() {
  const { id } = useSearch({ from: "/_app/meetings/appointment-detail" });
  const qc = useQueryClient();

  // Fetch specific appointment — fall back to list query if no id
  const { data: list } = useQuery({
    queryKey: ["appointments", "all"],
    queryFn: () => fetchAppointments({ per_page: 100 }),
    staleTime: 30_000,
  });

  const appointment = id
    ? list?.data?.find((a: Record<string, unknown>) => a.id === id) ?? list?.data?.[0]
    : list?.data?.[0];

  const { mutate: doUpdate, isPending: updating } = useMutation({
    mutationFn: ({ status }: { status: string }) => updateAppointment(String(appointment?.id ?? ""), { status }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["appointments"] });
      toast.success("Appointment updated");
    },
    onError: () => toast.error("Update failed"),
  });

  if (!appointment) {
    return (
      <div className="p-8 space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  const a = appointment as Record<string, unknown>;

  const timeline = [
    { step: "Request Submitted",  date: String(a.created_at ?? "").substring(0, 10), done: true,  icon: ClipboardList },
    { step: "Under Review",        date: String(a.requested_date ?? "").substring(0, 10), done: ["confirmed", "completed", "cancelled"].includes(String(a.status)), icon: Clock },
    { step: "Confirmed",           date: String(a.scheduled_date ?? "").substring(0, 10) || "—", done: ["confirmed", "completed"].includes(String(a.status)), icon: CheckCircle2 },
    { step: "Meeting Conducted",   date: String(a.scheduled_date ?? "").substring(0, 10) || "—", done: a.status === "completed", icon: User },
    { step: "Follow-Up Completed", date: String(a.follow_up_date ?? "").substring(0, 10) || "—", done: Boolean(a.follow_up_completed), icon: CheckCircle2 },
  ];

  return (
    <>
      <PageHeader
        title={`Appointment ${String(a.token_number ?? a.appointment_number ?? "")}`}
        description="Complete appointment journey and citizen interaction view"
        actions={
          <Button variant="outline" size="sm" asChild>
            <Link to="/meetings/appointments"><ArrowLeft className="h-4 w-4 mr-1.5" /> Back</Link>
          </Button>
        }
      />
      <div className="space-y-6 p-4 md:p-8">
        {/* Header card */}
        <Card className="p-6">
          <div className="flex flex-wrap items-start gap-4 justify-between">
            <div className="flex items-center gap-4">
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 text-primary shrink-0">
                <User className="h-7 w-7" />
              </div>
              <div>
                <h2 className="text-xl font-bold">{String(a.citizen_name ?? "")}</h2>
                <div className="flex flex-wrap gap-3 mt-1 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1"><Phone className="h-3.5 w-3.5" />{String(a.citizen_mobile ?? "—")}</span>
                  <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{String(a.citizen_village ?? "—")}, {String(a.citizen_mandal ?? "")}</span>
                  <span className="flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5" />Requested: {String(a.requested_date ?? "").substring(0, 10)}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className={cn("text-xs", priorityTone[String(a.priority ?? "medium")])}>{String(a.priority ?? "").toUpperCase()}</Badge>
              <Badge variant="secondary" className={cn("text-xs", statusTone[String(a.status ?? "pending")])}>{String(a.status ?? "").replace("_", " ")}</Badge>
              <Select defaultValue={String(a.status ?? "pending")} onValueChange={(v) => doUpdate({ status: v })}>
                <SelectTrigger className="h-8 w-[150px] text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirm</SelectItem>
                  <SelectItem value="completed">Mark Completed</SelectItem>
                  <SelectItem value="cancelled">Cancel</SelectItem>
                  <SelectItem value="rescheduled">Rescheduled</SelectItem>
                  <SelectItem value="no_show">No Show</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="flex flex-wrap gap-1 h-auto">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="citizen">Citizen Profile</TabsTrigger>
            <TabsTrigger value="complaints">Related Complaints</TabsTrigger>
            <TabsTrigger value="schemes">Related Schemes</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="notes">Meeting Notes</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
          </TabsList>

          {/* Overview */}
          <TabsContent value="overview">
            <div className="grid gap-4 sm:grid-cols-2">
              <Card className="p-5 space-y-4">
                <h4 className="font-semibold flex items-center gap-2"><FileText className="h-4 w-4 text-primary" />Meeting Details</h4>
                {[
                  { label: "Appointment #",  value: String(a.appointment_number ?? "—") },
                  { label: "Token",           value: String(a.token_number ?? "—") },
                  { label: "Purpose",         value: String(a.purpose ?? "—") },
                  { label: "Category",        value: String(a.category ?? "—") },
                  { label: "Meeting Type",    value: String(a.meeting_type ?? "—").replace("_", " ") },
                  { label: "Venue",           value: String(a.venue ?? "MP Office") },
                  { label: "Duration",        value: `${String(a.duration_minutes ?? "30")} minutes` },
                  { label: "Scheduled Date",  value: String(a.scheduled_date ?? "—").substring(0, 10) },
                  { label: "Scheduled Time",  value: String(a.scheduled_time ?? "TBD") },
                ].map((row) => (
                  <div key={row.label} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{row.label}</span>
                    <span className="font-medium text-right max-w-[60%]">{row.value}</span>
                  </div>
                ))}
              </Card>
              <div className="space-y-4">
                <Card className="p-5">
                  <h4 className="font-semibold mb-3">Outcome & Follow-up</h4>
                  <div className="space-y-2 text-sm">
                    <div className="text-muted-foreground">Meeting Outcome</div>
                    <p className="text-sm rounded-lg bg-muted/40 p-3">{String(a.meeting_outcome ?? "Not yet completed")}</p>
                    <div className="text-muted-foreground mt-2">Action Items</div>
                    <p className="text-sm rounded-lg bg-muted/40 p-3">{String(a.action_items ?? "—")}</p>
                    {a.follow_up_required && (
                      <div className="flex items-center gap-2 rounded-lg bg-warning/10 p-2 text-warning text-xs mt-2">
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        Follow-up required by {String(a.follow_up_date ?? "—").substring(0, 10)}
                      </div>
                    )}
                  </div>
                </Card>
                {a.satisfaction_rating && (
                  <Card className="p-5">
                    <h4 className="font-semibold mb-3">Citizen Satisfaction</h4>
                    <div className="flex items-center gap-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={cn("h-6 w-6", i < Number(a.satisfaction_rating ?? 0) ? "fill-warning text-warning" : "text-muted")} />
                      ))}
                      <span className="text-sm font-semibold ml-1">{Number(a.satisfaction_rating)}/5</span>
                    </div>
                    {a.citizen_feedback && <p className="text-sm text-muted-foreground mt-2">{String(a.citizen_feedback)}</p>}
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Citizen Profile */}
          <TabsContent value="citizen">
            <Card className="p-6">
              <h4 className="font-semibold mb-4 flex items-center gap-2"><User className="h-4 w-4 text-primary" />Citizen Snapshot</h4>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  { label: "Name",    value: String(a.citizen_name ?? "—") },
                  { label: "Mobile",  value: String(a.citizen_mobile ?? "—") },
                  { label: "Village", value: String(a.citizen_village ?? "—") },
                  { label: "Mandal",  value: String(a.citizen_mandal ?? "—") },
                  { label: "Submitted Via", value: String(a.created_via ?? "office").replace("_", " ") },
                  { label: "Queue Position", value: String(a.queue_position ?? "—") },
                ].map((row) => (
                  <div key={row.label} className="flex justify-between text-sm border-b border-border/40 pb-2">
                    <span className="text-muted-foreground">{row.label}</span>
                    <span className="font-medium">{row.value}</span>
                  </div>
                ))}
              </div>
              {a.citizen_id && (
                <div className="mt-4">
                  <Button asChild variant="outline" size="sm">
                    <Link to="/citizens/profile" search={{ id: String(a.citizen_id) }}>
                      <Link2 className="h-4 w-4 mr-1.5" />View Full Citizen 360
                    </Link>
                  </Button>
                </div>
              )}
            </Card>
          </TabsContent>

          {/* Related Complaints */}
          <TabsContent value="complaints">
            <Card className="p-6">
              <h4 className="font-semibold mb-4 flex items-center gap-2"><AlertCircle className="h-4 w-4 text-destructive" />Related Grievances</h4>
              {a.grievance_id ? (
                <div className="rounded-lg border border-border/60 p-4">
                  <p className="text-sm font-medium">Linked grievance found</p>
                  <Button asChild variant="outline" size="sm" className="mt-2">
                    <Link to="/grievances/detail">View Grievance</Link>
                  </Button>
                </div>
              ) : (
                <div className="py-8 text-center text-sm text-muted-foreground">
                  No grievances linked to this appointment.
                  <div className="mt-3">
                    <Button asChild variant="outline" size="sm">
                      <Link to="/grievances/list">Browse All Grievances</Link>
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          </TabsContent>

          {/* Related Schemes */}
          <TabsContent value="schemes">
            <Card className="p-6">
              <h4 className="font-semibold mb-4 flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-success" />Related Scheme Applications</h4>
              {a.scheme_application_id ? (
                <div className="rounded-lg border border-border/60 p-4">
                  <p className="text-sm font-medium">Linked scheme application found</p>
                  <Button asChild variant="outline" size="sm" className="mt-2">
                    <Link to="/schemes/application-detail">View Application</Link>
                  </Button>
                </div>
              ) : (
                <div className="py-8 text-center text-sm text-muted-foreground">
                  No scheme applications linked to this appointment.
                  <div className="mt-3">
                    <Button asChild variant="outline" size="sm">
                      <Link to="/schemes/applications">Browse Applications</Link>
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          </TabsContent>

          {/* Documents */}
          <TabsContent value="documents">
            <Card className="p-6">
              <h4 className="font-semibold mb-4 flex items-center gap-2"><FileText className="h-4 w-4 text-primary" />Supporting Documents</h4>
              <div className="grid gap-3 sm:grid-cols-3">
                {["Identity Proof", "Petition Letter", "Previous Correspondence"].map((doc) => (
                  <div key={doc} className="rounded-lg border-2 border-dashed border-border/60 p-4 text-center hover:border-primary/40 hover:bg-primary/5 transition-colors cursor-pointer">
                    <FileText className="h-8 w-8 mx-auto text-muted-foreground/50 mb-2" />
                    <p className="text-xs font-medium">{doc}</p>
                    <p className="text-[10px] text-muted-foreground mt-1">Click to upload</p>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Meeting Notes */}
          <TabsContent value="notes">
            <Card className="p-6">
              <h4 className="font-semibold mb-4 flex items-center gap-2"><MessageSquare className="h-4 w-4 text-primary" />Meeting Notes</h4>
              <div className="space-y-3">
                {a.meeting_outcome ? (
                  <div className="rounded-lg bg-muted/40 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-primary uppercase tracking-wide">Discussion Summary</span>
                      <Badge variant="secondary" className="text-[10px]">general</Badge>
                    </div>
                    <p className="text-sm">{String(a.meeting_outcome)}</p>
                  </div>
                ) : null}
                {a.action_items ? (
                  <div className="rounded-lg bg-warning/5 border border-warning/20 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="h-4 w-4 text-warning" />
                      <span className="text-xs font-semibold text-warning uppercase tracking-wide">Action Items</span>
                    </div>
                    <p className="text-sm">{String(a.action_items)}</p>
                  </div>
                ) : null}
                {!a.meeting_outcome && !a.action_items && (
                  <div className="py-8 text-center text-sm text-muted-foreground">
                    No notes recorded yet. Notes will appear after the meeting is conducted.
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>

          {/* Timeline */}
          <TabsContent value="timeline">
            <Card className="p-6">
              <h4 className="font-semibold mb-6 flex items-center gap-2"><Clock className="h-4 w-4 text-primary" />Appointment Journey</h4>
              <div className="relative">
                <div className="absolute left-5 top-0 bottom-0 w-px bg-border" />
                <div className="space-y-6">
                  {timeline.map((step, i) => (
                    <motion.div key={step.step} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                      className="relative flex items-start gap-4 pl-12">
                      <div className={cn(
                        "absolute left-2 flex h-6 w-6 items-center justify-center rounded-full border-2",
                        step.done ? "border-success bg-success text-success-foreground" : "border-muted-foreground/30 bg-background text-muted-foreground"
                      )}>
                        <step.icon className="h-3 w-3" />
                      </div>
                      <div className="min-w-0 flex-1 pt-0.5">
                        <p className={cn("text-sm font-semibold", step.done ? "text-foreground" : "text-muted-foreground")}>{step.step}</p>
                        <p className="text-xs text-muted-foreground">{step.date}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}

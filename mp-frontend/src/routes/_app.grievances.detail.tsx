import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Phone,
  MessageCircle,
  ArrowUpRight,
  MapPin,
  Calendar,
  AlertCircle,
  Building2,
  User,
  FileText,
  Image as ImageIcon,
  History,
  CheckCircle2,
  Star,
  ShieldCheck,
  Download,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
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
import { fetchGrievance, updateGrievance } from "@/lib/api";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/grievances/detail")({
  validateSearch: (s: Record<string, unknown>) => ({ id: String(s.id ?? "") }),
  head: () => ({ meta: [{ title: "Case 360 — Grievances" }] }),
  component: GrievanceDetailPage,
});

const statusTone: Record<string, string> = {
  pending: "bg-warning/15 text-warning",
  assigned: "bg-info/10 text-info",
  in_progress: "bg-primary/10 text-primary",
  escalated: "bg-destructive/10 text-destructive",
  resolved: "bg-success/10 text-success",
  closed: "bg-muted text-muted-foreground",
};

function GrievanceDetailPage() {
  const { id } = useSearch({ from: "/_app/grievances/detail" });
  const qc = useQueryClient();

  const { data: grievance, isLoading } = useQuery({
    queryKey: ["grievance-detail", id],
    queryFn: () => fetchGrievance(id),
    enabled: Boolean(id),
    staleTime: 30_000,
  });

  const { mutate: doUpdate } = useMutation({
    mutationFn: ({ status }: { status: string }) =>
      updateGrievance(String(grievance?.id ?? ""), { status }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["grievance-detail", id] });
      toast.success("Status updated");
    },
    onError: () => toast.error("Update failed"),
  });

  if (isLoading)
    return (
      <div className="p-8 space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </div>
    );
  if (!grievance)
    return (
      <div className="p-8 text-center text-sm text-muted-foreground">
        No grievance found.{" "}
        <Link to="/grievances/list" className="text-primary hover:underline">
          Back to list
        </Link>
      </div>
    );

  const g = grievance;

  const timeline = [
    {
      id: "t1",
      date: String(g.created_at ?? "").substring(0, 10),
      event: "Complaint Registered",
      actor: String(g.citizen_name ?? "Citizen"),
      type: "create",
    },
    {
      id: "t2",
      date: String(g.updated_at ?? "").substring(0, 10),
      event: "Status: " + String(g.status ?? "pending"),
      actor: "System",
      type: "update",
    },
  ];

  if (String(g.status) === "resolved" || String(g.status) === "closed") {
    timeline.push({
      id: "t3",
      date: String(g.resolved_date ?? g.updated_at ?? "").substring(0, 10),
      event: "Resolved",
      actor: "Department",
      type: "resolve",
    });
  }

  return (
    <>
      <PageHeader
        title="Case 360"
        description={`${String(g.grievance_number ?? "")} — complete view of this grievance`}
        actions={
          <>
            <Button variant="outline" size="sm" className="gap-1.5">
              <MessageCircle className="h-4 w-4" /> Message
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5">
              <ArrowUpRight className="h-4 w-4" /> Escalate
            </Button>
            <Button
              size="sm"
              className="gap-1.5"
              onClick={() => doUpdate({ status: "resolved" })}
            >
              <CheckCircle2 className="h-4 w-4" /> Mark Resolved
            </Button>
          </>
        }
      />
      <div className="space-y-6 p-4 md:p-8">
        {/* Header card */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="overflow-hidden">
            <div className="bg-gradient-to-r from-primary/15 via-primary/5 to-transparent p-5">
              <div className="flex flex-wrap items-start gap-4">
                <Avatar className="h-14 w-14">
                  <AvatarFallback>
                    {String(g.citizen_name ?? "?")
                      .split(" ")
                      .map((p: string) => p[0])
                      .slice(0, 2)
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs text-muted-foreground">
                      {String(g.grievance_number ?? "")}
                    </span>
                    <Badge
                      variant="secondary"
                      className={cn(
                        "text-[10px]",
                        statusTone[String(g.priority ?? "medium")] ??
                          "bg-warning/15 text-warning",
                      )}
                    >
                      {String(g.priority ?? "medium")}
                    </Badge>
                    <Badge
                      variant="secondary"
                      className={cn(
                        "text-[10px]",
                        statusTone[String(g.status ?? "pending")],
                      )}
                    >
                      {String(g.status ?? "").replace("_", " ")}
                    </Badge>
                  </div>
                  <h2 className="mt-1 font-display text-xl font-bold">
                    {String(g.subject ?? "Grievance")}
                  </h2>
                  <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <User className="h-3 w-3" />{" "}
                      {String(g.citizen_name ?? "Unknown")}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Phone className="h-3 w-3" />{" "}
                      {String(g.citizen_mobile ?? "—")}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="h-3 w-3" />{" "}
                      {String(g.created_at ?? "").substring(0, 10)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Select
                    defaultValue={String(g.status ?? "pending")}
                    onValueChange={(v) => doUpdate({ status: v })}
                  >
                    <SelectTrigger className="h-8 w-[160px] text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="assigned">Assigned</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="escalated">Escalated</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="w-full justify-start overflow-x-auto">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="citizen">Citizen Details</TabsTrigger>
            <TabsTrigger value="attachments">Attachments</TabsTrigger>
            <TabsTrigger value="actions">Department Actions</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="resolution">Resolution</TabsTrigger>
            <TabsTrigger value="audit">Audit Trail</TabsTrigger>
          </TabsList>

          {/* OVERVIEW */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <Card className="p-5 md:col-span-2">
                <h3 className="text-sm font-semibold">Complaint Summary</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {String(g.description ?? "No description provided.")}
                </p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <InfoBox
                    icon={AlertCircle}
                    label="Priority"
                    value={String(g.priority ?? "medium")}
                  />
                  <InfoBox
                    icon={Building2}
                    label="Status"
                    value={String(g.status ?? "pending")}
                  />
                  <InfoBox
                    icon={Calendar}
                    label="Submitted"
                    value={String(g.created_at ?? "").substring(0, 10)}
                  />
                  <InfoBox
                    icon={MapPin}
                    label="Source"
                    value={String(g.source ?? "portal")}
                  />
                </div>
              </Card>
              <Card className="p-5">
                <h3 className="text-sm font-semibold">Quick Actions</h3>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="justify-start gap-1.5"
                  >
                    <User className="h-4 w-4" /> Reassign
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="justify-start gap-1.5"
                    onClick={() => doUpdate({ status: "escalated" })}
                  >
                    <ArrowUpRight className="h-4 w-4" /> Escalate
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="justify-start gap-1.5"
                  >
                    <Phone className="h-4 w-4" /> Call Citizen
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="justify-start gap-1.5"
                  >
                    <FileText className="h-4 w-4" /> Generate Report
                  </Button>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* CITIZEN DETAILS */}
          <TabsContent value="citizen" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <Card className="p-5">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback>
                      {String(g.citizen_name ?? "?")
                        .split(" ")
                        .map((p: string) => p[0])
                        .slice(0, 2)
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold">
                      {String(g.citizen_name ?? "Unknown")}
                    </div>
                    <div className="font-mono text-[11px] text-muted-foreground">
                      {String(g.citizen_mobile ?? "—")}
                    </div>
                  </div>
                </div>
                <div className="mt-4 space-y-2 text-xs">
                  <Row label="Mobile" value={String(g.citizen_mobile ?? "—")} />
                  <Row label="Source" value={String(g.source ?? "portal")} />
                  <Row
                    label="Created"
                    value={String(g.created_at ?? "").substring(0, 10)}
                  />
                </div>
                {g.citizen_id && (
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="mt-4 w-full"
                  >
                    <Link
                      to="/citizens/profile"
                      search={{ id: String(g.citizen_id) }}
                    >
                      Open Citizen 360
                    </Link>
                  </Button>
                )}
              </Card>
              <Card className="p-5">
                <h3 className="text-sm font-semibold">Related Info</h3>
                <div className="mt-3 space-y-1.5 text-xs">
                  <Row
                    label="Grievance #"
                    value={String(g.grievance_number ?? "—")}
                  />
                  <Row
                    label="Priority"
                    value={String(g.priority ?? "medium")}
                  />
                  <Row label="Severity" value={String(g.severity ?? "—")} />
                  <Row label="Category" value={g.category?.name ?? "—"} />
                </div>
              </Card>
              <Card className="p-5">
                <h3 className="text-sm font-semibold">Previous Complaints</h3>
                <div className="mt-3 py-4 text-center text-xs text-muted-foreground">
                  Previous complaints visible on Citizen 360 profile.
                  <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="mt-2 block w-full"
                  >
                    <Link to="/grievances/list">Browse All Grievances</Link>
                  </Button>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* ATTACHMENTS */}
          <TabsContent value="attachments">
            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
              {["Site Photo", "Complaint Letter", "Supporting Document"].map(
                (name, i) => (
                  <Card key={name} className="overflow-hidden">
                    <div
                      className={cn(
                        "grid h-32 place-items-center",
                        i === 0
                          ? "bg-gradient-to-br from-info/20 to-info/5"
                          : i === 1
                            ? "bg-gradient-to-br from-primary/20 to-primary/5"
                            : "bg-gradient-to-br from-success/20 to-success/5",
                      )}
                    >
                      <FileText className="h-10 w-10 text-foreground/40" />
                    </div>
                    <div className="p-3">
                      <div className="truncate text-xs font-semibold">
                        {name}
                      </div>
                      <div className="mt-0.5 text-[10px] text-muted-foreground">
                        Upload to attach
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2 h-7 w-full gap-1 text-xs"
                      >
                        <Download className="h-3 w-3" /> Upload
                      </Button>
                    </div>
                  </Card>
                ),
              )}
            </div>
          </TabsContent>

          {/* DEPARTMENT ACTIONS */}
          <TabsContent value="actions">
            <Card className="overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Officer</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Remarks</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="text-xs">
                      {String(g.created_at ?? "").substring(0, 10)}
                    </TableCell>
                    <TableCell>System</TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className="bg-primary/10 text-primary"
                      >
                        Case Created
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      Grievance registered via {String(g.source ?? "portal")}
                    </TableCell>
                  </TableRow>
                  {String(g.status) !== "pending" && (
                    <TableRow>
                      <TableCell className="text-xs">
                        {String(g.updated_at ?? "").substring(0, 10)}
                      </TableCell>
                      <TableCell>Staff</TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className="bg-info/10 text-info"
                        >
                          Status Updated
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        Status changed to {String(g.status ?? "")}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          {/* TIMELINE */}
          <TabsContent value="timeline">
            <Card className="p-5">
              <div className="relative space-y-5 pl-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-px before:bg-border">
                {timeline.map((t, i) => (
                  <motion.div
                    key={t.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="relative"
                  >
                    <span className="absolute -left-[18px] top-1 grid h-3.5 w-3.5 place-items-center rounded-full border-2 border-background bg-primary" />
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      {t.date}
                    </div>
                    <div className="text-sm font-semibold">{t.event}</div>
                    <div className="text-xs text-muted-foreground">
                      {t.actor} ·{" "}
                      <Badge
                        variant="secondary"
                        className="bg-muted text-[10px]"
                      >
                        {t.type}
                      </Badge>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* RESOLUTION */}
          <TabsContent value="resolution">
            <Card className="p-5">
              {String(g.status) === "resolved" ||
              String(g.status) === "closed" ? (
                <>
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-full bg-success/10 text-success">
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-display text-lg font-bold">
                        Resolved
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {String(
                          g.resolved_date ?? g.updated_at ?? "",
                        ).substring(0, 10)}
                      </p>
                    </div>
                    <ShieldCheck className="ml-auto h-5 w-5 text-success" />
                  </div>
                  <div className="mt-5">
                    <h4 className="text-xs font-semibold uppercase text-muted-foreground">
                      Resolution Summary
                    </h4>
                    <p className="mt-2 text-sm">
                      {String(
                        g.resolution_summary ??
                          "Issue was addressed and resolved by the concerned department.",
                      )}
                    </p>
                  </div>
                </>
              ) : (
                <div className="py-8 text-center">
                  <CheckCircle2 className="h-12 w-12 mx-auto text-muted-foreground/40 mb-3" />
                  <p className="text-sm text-muted-foreground">
                    This grievance is not yet resolved.
                  </p>
                  <Button
                    className="mt-3 gap-2"
                    onClick={() => doUpdate({ status: "resolved" })}
                  >
                    <CheckCircle2 className="h-4 w-4" /> Mark as Resolved
                  </Button>
                </div>
              )}
            </Card>
          </TabsContent>

          {/* AUDIT TRAIL */}
          <TabsContent value="audit">
            <Card className="overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Remarks</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    {
                      date: String(g.created_at ?? "").substring(0, 10),
                      user: "System",
                      action: "CREATED",
                      remarks:
                        "Grievance created via " + String(g.source ?? "portal"),
                    },
                    {
                      date: String(g.updated_at ?? "").substring(0, 10),
                      user: "Staff",
                      action: "STATUS_UPDATED",
                      remarks: "Status: " + String(g.status ?? ""),
                    },
                  ].map((a, i) => (
                    <TableRow key={i}>
                      <TableCell className="text-xs tabular-nums">
                        {a.date}
                      </TableCell>
                      <TableCell className="text-sm">{a.user}</TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className="bg-muted font-mono text-[10px]"
                        >
                          {a.action}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {a.remarks}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}

function InfoBox({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof AlertCircle;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-border/70 bg-muted/20 p-3">
      <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-muted-foreground">
        <Icon className="h-3 w-3" /> {label}
      </div>
      <div className="mt-1 text-sm font-semibold capitalize">{value}</div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

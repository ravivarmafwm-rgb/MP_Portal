import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Users,
  Calendar,
  MapPin,
  CheckCircle2,
  Clock,
  Plus,
  ArrowUpRight,
  Loader2,
  AlertCircle,
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
import {
  fetchJanataDarbars,
  createJanataDarbar,
  fetchLocMandals,
  fetchLocVillages,
} from "@/lib/api";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/meetings/janata-darbar")({
  head: () => ({
    meta: [{ title: "Janata Darbar — Public Grievance Sessions" }],
  }),
  component: JanataDarbarPage,
});

const statusTone: Record<string, string> = {
  scheduled: "bg-primary/10 text-primary",
  ongoing: "bg-warning/15 text-warning",
  completed: "bg-success/10 text-success",
  cancelled: "bg-muted text-muted-foreground",
};

function JanataDarbarPage() {
  const qc = useQueryClient();
  const [filter, setFilter] = useState("all");
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({
    title: "",
    venue: "",
    session_date: "",
    start_time: "09:00",
    description: "",
    max_registrations: 200,
    mandal_id: "",
    village_id: "",
  });
  const [mandalId, setMandalId] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["janata-darbars", filter],
    queryFn: () =>
      fetchJanataDarbars({
        ...(filter !== "all" ? { status: filter } : {}),
        per_page: 50,
      }),
    staleTime: 30_000,
  });

  const { data: mandals } = useQuery({
    queryKey: ["mandals"],
    queryFn: () => fetchLocMandals(),
  });
  const { data: villages } = useQuery({
    queryKey: ["villages-jd", mandalId],
    queryFn: () => fetchLocVillages(mandalId),
    enabled: !!mandalId,
  });

  const sessions = data?.data ?? [];

  const { mutate: doCreate, isPending: creating } = useMutation({
    mutationFn: createJanataDarbar,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["janata-darbars"] });
      setShowCreate(false);
      setForm({
        title: "",
        venue: "",
        session_date: "",
        start_time: "09:00",
        description: "",
        max_registrations: 200,
        mandal_id: "",
        village_id: "",
      });
      toast.success("Janata Darbar session created!");
    },
    onError: () => toast.error("Failed to create session"),
  });

  // Summary stats
  const totalSessions = sessions.length;
  const upcoming = sessions.filter((s) => s.status === "scheduled").length;
  const completed = sessions.filter((s) => s.status === "completed").length;
  const totalIssues = sessions.reduce((acc, s) => acc + s.issues_raised, 0);
  const resolvedIssues = sessions.reduce(
    (acc, s) => acc + s.issues_resolved,
    0,
  );
  const totalCitizens = sessions.reduce(
    (acc, s) => acc + s.registered_citizens,
    0,
  );

  return (
    <>
      <PageHeader
        title="Janata Darbar Management"
        description="Open-house public grievance sessions — register, manage and track outcomes"
        actions={
          <Button
            size="sm"
            className="gap-1.5"
            onClick={() => setShowCreate(true)}
          >
            <Plus className="h-4 w-4" /> New Session
          </Button>
        }
      />
      <div className="space-y-6 p-4 md:p-8">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {[
            {
              label: "Total Sessions",
              value: totalSessions,
              tone: "text-foreground",
            },
            { label: "Upcoming", value: upcoming, tone: "text-primary" },
            { label: "Completed", value: completed, tone: "text-success" },
            {
              label: "Citizens Registered",
              value: totalCitizens,
              tone: "text-info",
            },
            {
              label: "Issues Raised",
              value: totalIssues,
              tone: "text-warning",
            },
            {
              label: "Issues Resolved",
              value: resolvedIssues,
              tone: "text-success",
            },
          ].map((s) => (
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

        {/* Filter Tabs */}
        <div className="flex gap-2">
          {["all", "scheduled", "ongoing", "completed", "cancelled"].map(
            (f) => (
              <Button
                key={f}
                size="sm"
                variant={filter === f ? "default" : "outline"}
                onClick={() => setFilter(f)}
                className="capitalize"
              >
                {f}
              </Button>
            ),
          )}
        </div>

        {/* Session Cards */}
        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-52 rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sessions.map((s, i) => (
              <motion.div
                key={String(s.id)}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="p-5 flex flex-col gap-3 hover:-translate-y-0.5 hover:shadow-elevated transition-all">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-mono text-xs text-muted-foreground">
                        {String(s.session_number ?? "")}
                      </p>
                      <h3 className="font-semibold truncate text-sm mt-0.5">
                        {String(s.title ?? "")}
                      </h3>
                    </div>
                    <Badge
                      variant="secondary"
                      className={cn(
                        "shrink-0 text-[10px]",
                        statusTone[String(s.status ?? "scheduled")],
                      )}
                    >
                      {String(s.status ?? "")}
                    </Badge>
                  </div>

                  <div className="space-y-1.5 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 shrink-0" />
                      {String(s.venue ?? "")}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 shrink-0" />
                      {String(s.session_date ?? "").substring(0, 10)} ·{" "}
                      {String(s.start_time ?? "09:00")}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 rounded-lg bg-muted/40 p-3 text-center text-xs">
                    <div>
                      <div className="font-bold text-base tabular-nums">
                        {Number(s.registered_citizens ?? 0)}
                      </div>
                      <div className="text-muted-foreground">Registered</div>
                    </div>
                    <div>
                      <div className="font-bold text-base tabular-nums text-warning">
                        {Number(s.issues_raised ?? 0)}
                      </div>
                      <div className="text-muted-foreground">Issues</div>
                    </div>
                    <div>
                      <div className="font-bold text-base tabular-nums text-success">
                        {Number(s.issues_resolved ?? 0)}
                      </div>
                      <div className="text-muted-foreground">Resolved</div>
                    </div>
                  </div>

                  {s.issues_pending && Number(s.issues_pending) > 0 && (
                    <div className="flex items-center gap-1.5 rounded-md bg-warning/10 px-2 py-1.5 text-xs text-warning">
                      <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                      {Number(s.issues_pending)} issues still pending
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-auto pt-1">
                    <div className="text-xs text-muted-foreground">
                      Max: {Number(s.max_registrations ?? 200)} · Token: #
                      {Number(s.token_counter ?? 0)}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 gap-1 text-xs"
                    >
                      View <ArrowUpRight className="h-3 w-3" />
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {sessions.length === 0 && !isLoading && (
          <div className="py-16 text-center">
            <Users className="h-12 w-12 mx-auto text-muted-foreground/40 mb-4" />
            <p className="text-muted-foreground">
              No Janata Darbar sessions found
            </p>
            <Button
              size="sm"
              className="mt-3"
              onClick={() => setShowCreate(true)}
            >
              <Plus className="h-4 w-4 mr-1.5" /> Create First Session
            </Button>
          </div>
        )}
      </div>

      {/* Create Dialog */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>New Janata Darbar Session</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="space-y-1.5">
              <Label>Session Title *</Label>
              <Input
                value={form.title}
                onChange={(e) =>
                  setForm((f) => ({ ...f, title: e.target.value }))
                }
                placeholder="e.g. Janata Darbar — Kondapur Mandal"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Venue *</Label>
              <Input
                value={form.venue}
                onChange={(e) =>
                  setForm((f) => ({ ...f, venue: e.target.value }))
                }
                placeholder="Mandal Office, Community Hall…"
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Session Date *</Label>
                <Input
                  type="date"
                  value={form.session_date}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, session_date: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label>Start Time</Label>
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
                <Label>Mandal</Label>
                <Select
                  value={mandalId}
                  onValueChange={(v) => {
                    setMandalId(v);
                    setForm((f) => ({ ...f, mandal_id: v }));
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select mandal" />
                  </SelectTrigger>
                  <SelectContent>
                    {(mandals ?? []).map((m: { id: string; name: string }) => (
                      <SelectItem key={m.id} value={m.id}>
                        {m.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Max Registrations</Label>
                <Input
                  type="number"
                  value={form.max_registrations}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      max_registrations: Number(e.target.value),
                    }))
                  }
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
                creating || !form.title || !form.venue || !form.session_date
              }
              onClick={() => doCreate(form as Record<string, unknown>)}
            >
              {creating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Creating…
                </>
              ) : (
                "Create Session"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

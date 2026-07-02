import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  MapPin, Calendar, Users, CheckCircle2, Clock, Plus, Loader2,
  Navigation, Flag, ArrowUpRight, Layers,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { fetchTours, createTour } from "@/lib/api";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/meetings/tours")({
  head: () => ({ meta: [{ title: "MP Tours — Constituency Field Visits" }] }),
  component: ToursPage,
});

const statusTone: Record<string, string> = {
  planned:   "bg-primary/10 text-primary",
  ongoing:   "bg-warning/15 text-warning",
  completed: "bg-success/10 text-success",
  cancelled: "bg-muted text-muted-foreground",
  postponed: "bg-destructive/10 text-destructive",
};

const tourTypeIcon: Record<string, typeof MapPin> = {
  constituency_visit: MapPin,
  inspection:         Flag,
  project_inspection: Layers,
  field_survey:       Navigation,
  other:              MapPin,
};

function ToursPage() {
  const qc = useQueryClient();
  const [filter, setFilter] = useState("all");
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({
    title: "", objectives: "", tour_type: "constituency_visit",
    start_date: "", end_date: "", villages_count: 5,
  });

  const { data, isLoading } = useQuery({
    queryKey: ["tours", filter],
    queryFn: () => fetchTours({ per_page: 50, ...(filter !== "all" ? { status: filter } : {}) }),
    staleTime: 30_000,
  });

  const tours = data?.data ?? [];

  const { mutate: doCreate, isPending: creating } = useMutation({
    mutationFn: createTour,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tours"] });
      setShowCreate(false);
      toast.success("Tour planned successfully!");
    },
    onError: () => toast.error("Failed to create tour"),
  });

  const planned   = tours.filter((t: Record<string, unknown>) => t.status === "planned").length;
  const ongoing   = tours.filter((t: Record<string, unknown>) => t.status === "ongoing").length;
  const completed = tours.filter((t: Record<string, unknown>) => t.status === "completed").length;
  const totalVillages = tours.reduce((acc: number, t: Record<string, unknown>) => acc + Number(t.villages_count ?? 0), 0);
  const totalCitizensMet = tours.reduce((acc: number, t: Record<string, unknown>) => acc + Number(t.citizens_met ?? 0), 0);

  return (
    <>
      <PageHeader
        title="MP Tour Management"
        description="Constituency tours, inspection visits and field reviews"
        actions={
          <Button size="sm" className="gap-1.5" onClick={() => setShowCreate(true)}>
            <Plus className="h-4 w-4" /> Plan Tour
          </Button>
        }
      />
      <div className="space-y-6 p-4 md:p-8">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          {[
            { label: "Total Tours",  value: tours.length,      tone: "text-foreground" },
            { label: "Planned",      value: planned,             tone: "text-primary"    },
            { label: "Ongoing",      value: ongoing,             tone: "text-warning"    },
            { label: "Completed",    value: completed,           tone: "text-success"    },
            { label: "Villages Covered", value: totalVillages,  tone: "text-info"       },
          ].map((s) => (
            <Card key={s.label} className="p-4 text-center">
              <div className={`font-display text-2xl font-bold tabular-nums ${s.tone}`}>{s.value}</div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
            </Card>
          ))}
        </div>

        {/* Filter */}
        <div className="flex flex-wrap gap-2">
          {["all", "planned", "ongoing", "completed", "cancelled"].map((f) => (
            <Button key={f} size="sm" variant={filter === f ? "default" : "outline"}
              onClick={() => setFilter(f)} className="capitalize">{f}</Button>
          ))}
        </div>

        {/* Tour Cards */}
        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-56 rounded-xl" />)}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tours.map((t: Record<string, unknown>, i: number) => {
              const TIcon = tourTypeIcon[String(t.tour_type ?? "other")] ?? MapPin;
              const isPast = t.status === "completed";
              return (
                <motion.div key={String(t.id)} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <Card className="p-5 flex flex-col gap-3 hover:-translate-y-0.5 hover:shadow-elevated transition-all">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                          <TIcon className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-mono text-xs text-muted-foreground">{String(t.tour_number ?? "")}</p>
                          <h3 className="font-semibold text-sm leading-tight truncate">{String(t.title ?? "")}</h3>
                        </div>
                      </div>
                      <Badge variant="secondary" className={cn("shrink-0 text-[10px]", statusTone[String(t.status ?? "planned")])}>
                        {String(t.status ?? "")}
                      </Badge>
                    </div>

                    <div className="space-y-1.5 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 shrink-0" />
                        {String(t.start_date ?? "").substring(0, 10)}
                        {t.end_date && ` → ${String(t.end_date).substring(0, 10)}`}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 shrink-0" />
                        {Number(t.villages_count ?? 0)} villages planned
                      </div>
                    </div>

                    {t.objectives && (
                      <p className="text-xs text-muted-foreground line-clamp-2 rounded-md bg-muted/40 p-2">
                        {String(t.objectives)}
                      </p>
                    )}

                    <div className="grid grid-cols-2 gap-2 rounded-lg bg-muted/40 p-3 text-center text-xs">
                      <div>
                        <div className="font-bold text-base tabular-nums">{Number(t.villages_count ?? 0)}</div>
                        <div className="text-muted-foreground">Villages</div>
                      </div>
                      <div>
                        <div className={cn("font-bold text-base tabular-nums", isPast ? "text-success" : "text-muted-foreground")}>
                          {isPast ? Number(t.citizens_met ?? 0).toLocaleString() : "—"}
                        </div>
                        <div className="text-muted-foreground">Citizens Met</div>
                      </div>
                    </div>

                    {t.key_outcomes && (
                      <p className="text-xs text-muted-foreground line-clamp-2 rounded-md bg-success/5 border border-success/20 p-2">
                        {String(t.key_outcomes)}
                      </p>
                    )}

                    <div className="flex justify-end mt-auto">
                      <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs">
                        View Details <ArrowUpRight className="h-3 w-3" />
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}

        {tours.length === 0 && !isLoading && (
          <div className="py-16 text-center">
            <MapPin className="h-12 w-12 mx-auto text-muted-foreground/40 mb-4" />
            <p className="text-muted-foreground">No tours found</p>
            <Button size="sm" className="mt-3" onClick={() => setShowCreate(true)}>
              <Plus className="h-4 w-4 mr-1.5" /> Plan First Tour
            </Button>
          </div>
        )}
      </div>

      {/* Create Dialog */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Plan New Tour</DialogTitle></DialogHeader>
          <div className="grid gap-4">
            <div className="space-y-1.5">
              <Label>Tour Title *</Label>
              <Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Madhapur Constituency Development Tour" />
            </div>
            <div className="space-y-1.5">
              <Label>Tour Type *</Label>
              <Select value={form.tour_type} onValueChange={v => setForm(f => ({ ...f, tour_type: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="constituency_visit">Constituency Visit</SelectItem>
                  <SelectItem value="inspection">Inspection</SelectItem>
                  <SelectItem value="project_inspection">Project Inspection</SelectItem>
                  <SelectItem value="field_survey">Field Survey</SelectItem>
                  <SelectItem value="scheme_review">Scheme Review</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Start Date *</Label>
                <Input type="date" value={form.start_date} onChange={e => setForm(f => ({ ...f, start_date: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label>End Date</Label>
                <Input type="date" value={form.end_date} onChange={e => setForm(f => ({ ...f, end_date: e.target.value }))} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Villages to Cover</Label>
              <Input type="number" value={form.villages_count} onChange={e => setForm(f => ({ ...f, villages_count: Number(e.target.value) }))} min={1} />
            </div>
            <div className="space-y-1.5">
              <Label>Objectives</Label>
              <Textarea value={form.objectives} onChange={e => setForm(f => ({ ...f, objectives: e.target.value }))} rows={3} placeholder="Review ongoing projects, address citizen issues…" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
            <Button disabled={creating || !form.title || !form.start_date}
              onClick={() => doCreate(form as Record<string, unknown>)}>
              {creating ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />Planning…</> : "Plan Tour"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

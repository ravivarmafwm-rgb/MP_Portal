import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Download, Search, Filter, Eye, ArrowUpDown, Landmark } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchProjects } from "@/lib/api";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/projects/development")({
  head: () => ({ meta: [{ title: "Development Project Directory" }] }),
  component: DevelopmentDirectory,
});

const statusTone: Record<string, string> = {
  proposed:       "bg-muted text-muted-foreground",
  approved:       "bg-info/10 text-info",
  in_progress:    "bg-primary/10 text-primary",
  completed:      "bg-success/10 text-success",
  delayed:        "bg-destructive/10 text-destructive",
  at_risk:        "bg-destructive/15 text-destructive",
  cancelled:      "bg-muted text-muted-foreground",
};

function DevelopmentDirectory() {
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["projects-dev", q, statusFilter, page],
    queryFn: () => fetchProjects({
      search: q, page, per_page: 20,
      ...(statusFilter !== "all" ? { status: statusFilter } : {}),
    }),
    staleTime: 30_000,
  });

  const projects = data?.data ?? [];
  const meta = data?.meta ?? { total: 0, current_page: 1, last_page: 1 };

  const filters = ["all", "in_progress", "completed", "delayed", "proposed", "approved"];

  return (
    <>
      <PageHeader
        title="Development Project Directory"
        description="Search, filter and drill into every constituency project."
        actions={<>
          <Button variant="outline" size="sm" className="gap-1.5"><Download className="h-4 w-4" /> Export CSV</Button>
          <Button size="sm" className="gap-1.5"><Plus className="h-4 w-4" /> New Project</Button>
        </>}
      />
      <div className="space-y-4 p-4 md:p-8">
        <Card className="overflow-hidden">
          <div className="flex flex-wrap items-center gap-2 border-b border-border/70 bg-muted/30 p-3">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} placeholder="Search by name, location…" className="h-9 bg-background pl-9" />
            </div>
            <div className="flex flex-wrap items-center gap-1">
              {filters.map((f) => (
                <Button key={f} size="sm" variant={statusFilter === f ? "default" : "outline"} onClick={() => { setStatusFilter(f); setPage(1); }} className="capitalize text-xs">
                  {f.replace("_", " ")}
                </Button>
              ))}
            </div>
          </div>

          {isLoading ? (
            <div className="space-y-2 p-4">{Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/30 text-[11px] uppercase tracking-wider text-muted-foreground">
                  <tr>
                    {["Project #", "Project Name", "Type", "Location", "Budget", "Completion", "Status", ""].map((h) => (
                      <th key={h} className="px-4 py-3 text-left font-medium">
                        <span className="inline-flex items-center gap-1">{h}{h && h !== "" && <ArrowUpDown className="h-3 w-3 opacity-40" />}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {projects.map((p: Record<string, unknown>, i: number) => (
                    <motion.tr key={String(p.id)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: Math.min(i * 0.01, 0.3) }}
                      className="border-t border-border/60 transition-colors hover:bg-muted/30">
                      <td className="px-4 py-3 font-mono text-xs">{String(p.project_number ?? "").substring(0, 12)}</td>
                      <td className="px-4 py-3">
                        <div className="font-semibold truncate max-w-[180px]">{String(p.name ?? "")}</div>
                        {String(p.fund_source ?? "") === "MPLADS" && (
                          <div className="text-[10px] text-accent-foreground/70"><Landmark className="mr-1 inline h-3 w-3" />MPLADS</div>
                        )}
                      </td>
                      <td className="px-4 py-3"><Badge variant="secondary" className="rounded-full text-[10px] capitalize">{String(p.project_type ?? p.category ?? "general")}</Badge></td>
                      <td className="px-4 py-3 text-xs">{String(p.location ?? "—")}</td>
                      <td className="px-4 py-3 tabular-nums text-xs">₹{(Number(p.sanctioned_amount ?? p.estimated_cost ?? 0) / 100000).toFixed(1)}L</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Progress value={Number(p.progress_percentage ?? 0)} className="h-1.5 w-20" />
                          <span className="tabular-nums text-xs font-semibold">{Number(p.progress_percentage ?? 0).toFixed(0)}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3"><Badge variant="secondary" className={cn("text-[10px]", statusTone[String(p.status ?? "proposed")])}>{String(p.status ?? "").replace("_", " ")}</Badge></td>
                      <td className="px-4 py-3">
                        <Button asChild variant="ghost" size="sm"><Link to="/projects/project-detail" search={{ id: String(p.id) }}><Eye className="h-3.5 w-3.5" /> Open</Link></Button>
                      </td>
                    </motion.tr>
                  ))}
                  {projects.length === 0 && (
                    <tr><td colSpan={8} className="px-4 py-12 text-center text-sm text-muted-foreground">No projects found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          <div className="flex items-center justify-between border-t border-border/70 bg-muted/20 px-4 py-3 text-xs text-muted-foreground">
            <span>Showing {projects.length} of {meta.total} projects</span>
            <div className="flex gap-1">
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

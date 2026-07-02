import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Search, Filter, Download, Plus, Eye, MoreHorizontal,
  FileBadge, CheckCircle2, Clock, XCircle,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { applications, schemeKpis } from "@/lib/scheme-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/schemes/applications")({
  head: () => ({ meta: [{ title: "Applications — Scheme Management" }, { name: "description", content: "Enterprise application directory across all welfare schemes." }] }),
  component: ApplicationsPage,
});

const statusTone: Record<string, string> = {
  "Submitted": "bg-info/10 text-info",
  "Under Review": "bg-warning/15 text-warning",
  "Verification Pending": "bg-warning/15 text-warning",
  "Approved": "bg-success/10 text-success",
  "Rejected": "bg-destructive/10 text-destructive",
  "Benefit Released": "bg-primary/10 text-primary",
  "Draft": "bg-muted text-muted-foreground",
};

const kpis = [
  { l: "Total", v: schemeKpis.totalApplications, icon: FileBadge, tone: "bg-primary/10 text-primary" },
  { l: "Approved", v: schemeKpis.approved, icon: CheckCircle2, tone: "bg-success/10 text-success" },
  { l: "Pending", v: schemeKpis.pending, icon: Clock, tone: "bg-warning/15 text-warning" },
  { l: "Rejected", v: schemeKpis.rejected, icon: XCircle, tone: "bg-destructive/10 text-destructive" },
];

const statusTabs = ["All","Submitted","Under Review","Verification Pending","Approved","Rejected","Benefit Released"];

function ApplicationsPage() {
  const [q, setQ] = useState("");
  const [tab, setTab] = useState("All");
  const rows = useMemo(() => applications.filter(a => {
    const matchTab = tab === "All" || a.status === tab;
    const text = `${a.id} ${a.citizen} ${a.scheme} ${a.village} ${a.department}`.toLowerCase();
    return matchTab && (q === "" || text.includes(q.toLowerCase()));
  }), [q, tab]);

  return (
    <>
      <PageHeader
        title="Applications"
        description="26,420 applications across 12 schemes. Search, filter and drill into any case."
        actions={
          <>
            <Button variant="outline" size="sm" className="gap-1.5"><Download className="h-4 w-4" /> Export</Button>
            <Button size="sm" className="gap-1.5"><Plus className="h-4 w-4" /> New Application</Button>
          </>
        }
      />
      <div className="space-y-6 p-4 md:p-8">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {kpis.map((k, i) => (
            <motion.div key={k.l} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="p-4">
                <div className={cn("inline-grid h-9 w-9 place-items-center rounded-lg", k.tone)}><k.icon className="h-4 w-4" /></div>
                <div className="mt-3 text-[11px] uppercase tracking-wider text-muted-foreground">{k.l}</div>
                <div className="mt-1 font-display text-xl font-bold tabular-nums">{k.v.toLocaleString()}</div>
              </Card>
            </motion.div>
          ))}
        </div>

        <Card className="p-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative min-w-[240px] flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search by citizen, scheme, village…" value={q} onChange={(e) => setQ(e.target.value)} className="pl-8" />
            </div>
            <Button variant="outline" size="sm" className="gap-1.5"><Filter className="h-4 w-4" /> Advanced</Button>
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {statusTabs.map((s) => (
              <button key={s} onClick={() => setTab(s)} className={cn("rounded-full border px-3 py-1 text-xs font-medium transition", tab === s ? "border-primary bg-primary text-primary-foreground" : "border-border hover:bg-muted/60")}>{s}</button>
            ))}
          </div>
        </Card>

        <Card className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Application ID</TableHead>
                <TableHead>Citizen</TableHead>
                <TableHead>Scheme</TableHead>
                <TableHead>Village</TableHead>
                <TableHead>Applied</TableHead>
                <TableHead className="text-right">Benefit</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Department</TableHead>
                <TableHead className="w-20"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.slice(0, 24).map((a) => (
                <TableRow key={a.id} className="hover:bg-muted/40">
                  <TableCell className="font-mono text-xs">{a.id}</TableCell>
                  <TableCell className="font-medium">{a.citizen}</TableCell>
                  <TableCell><span className="text-sm">{a.scheme}</span><div className="text-[10px] text-muted-foreground">{a.schemeCode}</div></TableCell>
                  <TableCell>{a.village}<div className="text-[10px] text-muted-foreground">{a.mandal}</div></TableCell>
                  <TableCell className="tabular-nums text-xs">{a.appliedOn}</TableCell>
                  <TableCell className="text-right font-semibold tabular-nums">₹{a.benefit.toLocaleString()}</TableCell>
                  <TableCell><Badge variant="secondary" className={cn("text-[10px]", statusTone[a.status])}>{a.status}</Badge></TableCell>
                  <TableCell className="text-xs">{a.department}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button asChild variant="ghost" size="icon" className="h-8 w-8"><Link to="/schemes/application-detail"><Eye className="h-4 w-4" /></Link></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex items-center justify-between border-t border-border/70 p-3 text-xs text-muted-foreground">
            <span>Showing {Math.min(24, rows.length)} of {rows.length}</span>
            <div className="flex gap-1"><Button variant="outline" size="sm">Prev</Button><Button variant="outline" size="sm">Next</Button></div>
          </div>
        </Card>
      </div>
    </>
  );
}
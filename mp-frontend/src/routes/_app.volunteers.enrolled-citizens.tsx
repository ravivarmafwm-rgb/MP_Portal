import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Users, UserCheck, Clock, Trophy, Search, Filter, Download, Plus, Eye, MapPin } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { enrolledCitizens, enrollmentKpis } from "@/lib/grievance-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/volunteers/enrolled-citizens")({
  head: () => ({ meta: [{ title: "Enrolled Citizens — Volunteers" }, { name: "description", content: "Citizens enrolled and verified by field volunteers." }] }),
  component: EnrolledCitizensPage,
});

const kpis = [
  { l: "Total Enrolled", v: enrollmentKpis.total, icon: Users, tone: "bg-primary/10 text-primary" },
  { l: "Verified", v: enrollmentKpis.verified, icon: UserCheck, tone: "bg-success/10 text-success" },
  { l: "Pending Verification", v: enrollmentKpis.pending, icon: Clock, tone: "bg-warning/15 text-warning" },
  { l: "This Week", v: enrollmentKpis.thisWeek, icon: Plus, tone: "bg-info/10 text-info" },
  { l: "Top Volunteer", v: enrollmentKpis.topVolunteer, icon: Trophy, tone: "bg-accent text-accent-foreground" },
  { l: "Avg / Volunteer", v: enrollmentKpis.avgPerVolunteer, icon: Users, tone: "bg-muted text-muted-foreground" },
];

function statusBadge(s: string) {
  const m: Record<string, string> = {
    Verified: "bg-success/10 text-success",
    "Pending Verification": "bg-warning/15 text-warning",
    Rejected: "bg-destructive/10 text-destructive",
  };
  return m[s] ?? "bg-muted";
}

function EnrolledCitizensPage() {
  return (
    <>
      <PageHeader
        title="Enrolled Citizens"
        description="Citizens registered by volunteers in the field — verification status, scheme uptake, source attribution."
        actions={
          <>
            <Button variant="outline" size="sm" className="gap-1.5"><Download className="h-4 w-4" /> Export</Button>
            <Button asChild size="sm" className="gap-1.5"><Link to="/citizens/create-profile"><Plus className="h-4 w-4" /> Enroll Citizen</Link></Button>
          </>
        }
      />
      <div className="space-y-6 p-4 md:p-8">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
          {kpis.map((k, i) => (
            <motion.div key={k.l} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
              <Card className="p-4">
                <div className={cn("grid h-9 w-9 place-items-center rounded-lg", k.tone)}><k.icon className="h-4 w-4" /></div>
                <div className="mt-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">{k.l}</div>
                <div className="mt-1 font-display text-xl font-bold tabular-nums">{typeof k.v === "number" ? k.v.toLocaleString() : k.v}</div>
              </Card>
            </motion.div>
          ))}
        </div>

        <Card className="overflow-hidden">
          <div className="flex flex-wrap items-center gap-2 border-b border-border/70 bg-muted/30 p-3">
            <div className="relative min-w-[220px] flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search by citizen name, volunteer, village…" className="h-9 bg-background pl-9" />
            </div>
            <Button variant="outline" size="sm" className="gap-1.5"><Filter className="h-4 w-4" /> Volunteer</Button>
            <Button variant="outline" size="sm" className="gap-1.5"><Filter className="h-4 w-4" /> Status</Button>
            <Button variant="outline" size="sm" className="gap-1.5"><Filter className="h-4 w-4" /> Mandal</Button>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Citizen</TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead>Age / Gender</TableHead>
                  <TableHead>Village</TableHead>
                  <TableHead>Enrolled By</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Docs</TableHead>
                  <TableHead className="text-right">Schemes</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {enrolledCitizens.map((c, i) => (
                  <motion.tr key={c.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.015 }} className="border-b hover:bg-muted/40">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9"><AvatarFallback className="text-xs">{c.name.split(" ").map(p => p[0]).slice(0,2).join("")}</AvatarFallback></Avatar>
                        <div className="text-sm font-semibold">{c.name}</div>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-xs">{c.id}</TableCell>
                    <TableCell className="text-xs">{c.age} · {c.gender}</TableCell>
                    <TableCell className="text-sm"><span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3 text-muted-foreground" /> {c.village}</span></TableCell>
                    <TableCell>
                      <div className="text-sm font-medium">{c.enrolledBy}</div>
                      <div className="font-mono text-[10px] text-muted-foreground">{c.volunteerId}</div>
                    </TableCell>
                    <TableCell className="text-xs tabular-nums">{c.enrolledOn}</TableCell>
                    <TableCell className="text-right text-xs tabular-nums">{c.documents}</TableCell>
                    <TableCell className="text-right text-xs tabular-nums">{c.schemes}</TableCell>
                    <TableCell><Badge variant="secondary" className={statusBadge(c.status)}>{c.status}</Badge></TableCell>
                    <TableCell className="text-right">
                      <Link to="/citizens/profile"><Button variant="ghost" size="icon" className="h-7 w-7"><Eye className="h-3.5 w-3.5" /></Button></Link>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </>
  );
}

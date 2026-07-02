import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  FileBadge, User, FileText, ShieldCheck, History, IndianRupee, Activity,
  CheckCircle2, Clock, AlertCircle, XCircle, Download, Share2, Printer,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  featuredApplication, requiredDocs, verificationFlow,
  applicationTimeline, benefitHistory, auditTrail, previousBenefits,
} from "@/lib/scheme-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/schemes/application-detail")({
  head: () => ({ meta: [{ title: "Application 360 — Scheme Management" }, { name: "description", content: "Complete application journey, verification and benefit history." }] }),
  component: ApplicationDetail,
});

function ApplicationDetail() {
  const a = featuredApplication;
  const docVerified = requiredDocs.filter(d => d.verified).length;

  return (
    <>
      <PageHeader
        title={`Application ${a.id}`}
        description={`${a.scheme} · ${a.citizen} · ${a.village}, ${a.mandal}`}
        actions={
          <>
            <Button variant="outline" size="sm" className="gap-1.5"><Share2 className="h-4 w-4" /> Share</Button>
            <Button variant="outline" size="sm" className="gap-1.5"><Printer className="h-4 w-4" /> Print</Button>
            <Button size="sm" className="gap-1.5"><CheckCircle2 className="h-4 w-4" /> Approve</Button>
          </>
        }
      />
      <div className="space-y-6 p-4 md:p-8">
        <Card className="overflow-hidden p-0">
          <div className="bg-gradient-to-br from-primary/10 via-background to-background p-5">
            <div className="flex flex-wrap items-center gap-4">
              <Avatar className="h-14 w-14 ring-2 ring-primary/30">
                <AvatarFallback className="bg-primary/15 text-primary font-bold">{a.citizen.split(" ").map(x => x[0]).join("")}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-display text-xl font-bold">{a.citizen}</h2>
                  <Badge variant="secondary" className="bg-warning/15 text-warning">{a.status}</Badge>
                  <Badge variant="secondary" className="bg-primary/10 text-primary">{a.schemeCode}</Badge>
                </div>
                <div className="mt-1 grid grid-cols-2 gap-3 text-xs text-muted-foreground sm:grid-cols-5">
                  <div><div className="font-semibold text-foreground">{a.id}</div>Application ID</div>
                  <div><div className="font-semibold text-foreground">{a.scheme}</div>Scheme</div>
                  <div><div className="font-semibold text-foreground">{a.department}</div>Department</div>
                  <div><div className="font-semibold text-foreground">{a.appliedOn}</div>Submission Date</div>
                  <div><div className="font-semibold text-foreground">₹{a.benefit.toLocaleString()}</div>Benefit Amount</div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="flex w-full flex-wrap justify-start">
            <TabsTrigger value="overview"><FileBadge className="mr-1.5 h-3.5 w-3.5" />Overview</TabsTrigger>
            <TabsTrigger value="citizen"><User className="mr-1.5 h-3.5 w-3.5" />Citizen</TabsTrigger>
            <TabsTrigger value="docs"><FileText className="mr-1.5 h-3.5 w-3.5" />Documents</TabsTrigger>
            <TabsTrigger value="verify"><ShieldCheck className="mr-1.5 h-3.5 w-3.5" />Verification</TabsTrigger>
            <TabsTrigger value="timeline"><Activity className="mr-1.5 h-3.5 w-3.5" />Timeline</TabsTrigger>
            <TabsTrigger value="benefits"><IndianRupee className="mr-1.5 h-3.5 w-3.5" />Benefits</TabsTrigger>
            <TabsTrigger value="audit"><History className="mr-1.5 h-3.5 w-3.5" />Audit</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-4 grid gap-4 lg:grid-cols-2">
            <Card className="p-5">
              <h3 className="font-display text-sm font-bold">Application Summary</h3>
              <dl className="mt-3 space-y-2 text-sm">
                {[
                  ["Application ID", a.id], ["Submitted", a.appliedOn],
                  ["Channel", "Mobile App"], ["Volunteer Assist", "Suresh Reddy (VOL-2412)"],
                  ["Current Stage", a.status], ["Expected Decision", "2026-06-25"],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between border-b border-border/40 pb-1.5 text-xs"><span className="text-muted-foreground">{k}</span><span className="font-semibold">{v}</span></div>
                ))}
              </dl>
            </Card>
            <Card className="p-5">
              <h3 className="font-display text-sm font-bold">Scheme Summary</h3>
              <p className="mt-2 text-xs text-muted-foreground">PMAY Gramin — pucca house with basic amenities for rural homeless families.</p>
              <dl className="mt-3 space-y-2 text-sm">
                {[
                  ["Scheme", a.scheme], ["Code", a.schemeCode], ["Department", a.department],
                  ["Benefit", `₹${a.benefit.toLocaleString()}`], ["Category", a.category],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between border-b border-border/40 pb-1.5 text-xs"><span className="text-muted-foreground">{k}</span><span className="font-semibold">{v}</span></div>
                ))}
              </dl>
            </Card>
            <Card className="p-5">
              <h3 className="font-display text-sm font-bold">Eligibility Summary</h3>
              <div className="mt-3 space-y-2">
                {[
                  { c: "BPL household", ok: true }, { c: "Rural residence", ok: true },
                  { c: "No pucca house", ok: true }, { c: "SECC listed", ok: true },
                  { c: "Aadhaar seeded bank a/c", ok: true }, { c: "Land record verified", ok: false },
                ].map((e, i) => (
                  <div key={i} className="flex items-center justify-between rounded-md bg-muted/40 p-2 text-xs">
                    <span>{e.c}</span>
                    {e.ok ? <Badge variant="secondary" className="bg-success/10 text-success">Met</Badge> : <Badge variant="secondary" className="bg-warning/15 text-warning">Pending</Badge>}
                  </div>
                ))}
              </div>
            </Card>
            <Card className="p-5">
              <h3 className="font-display text-sm font-bold">Benefit Summary</h3>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-muted/40 p-3">
                  <div className="text-[10px] uppercase text-muted-foreground">Total Benefit</div>
                  <div className="mt-1 font-display text-xl font-bold tabular-nums">₹{a.benefit.toLocaleString()}</div>
                </div>
                <div className="rounded-lg bg-muted/40 p-3">
                  <div className="text-[10px] uppercase text-muted-foreground">Tranches</div>
                  <div className="mt-1 font-display text-xl font-bold tabular-nums">3</div>
                </div>
                <div className="rounded-lg bg-muted/40 p-3">
                  <div className="text-[10px] uppercase text-muted-foreground">Released</div>
                  <div className="mt-1 font-display text-xl font-bold tabular-nums">₹0</div>
                </div>
                <div className="rounded-lg bg-muted/40 p-3">
                  <div className="text-[10px] uppercase text-muted-foreground">Pending</div>
                  <div className="mt-1 font-display text-xl font-bold tabular-nums">₹{a.benefit.toLocaleString()}</div>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="citizen" className="mt-4 grid gap-4 lg:grid-cols-2">
            <Card className="p-5">
              <h3 className="font-display text-sm font-bold">Citizen Snapshot</h3>
              <dl className="mt-3 space-y-2">
                {[
                  ["Name", a.citizen], ["Citizen ID", a.citizenId], ["Mobile", "+91 98XXXXXX42"],
                  ["Age / Gender", "42 / Female"], ["Aadhaar", "XXXX-XXXX-9821"],
                  ["Village", `${a.village}, ${a.mandal}`], ["Category", "OBC · BPL"],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between border-b border-border/40 pb-1.5 text-xs"><span className="text-muted-foreground">{k}</span><span className="font-semibold">{v}</span></div>
                ))}
              </dl>
              <Button asChild variant="outline" size="sm" className="mt-3 w-full"><Link to="/citizens/profile">Open Citizen 360 →</Link></Button>
            </Card>
            <Card className="p-5">
              <h3 className="font-display text-sm font-bold">Family Information</h3>
              <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-md bg-muted/40 p-2"><div className="text-muted-foreground">Family ID</div><div className="font-semibold">FAM-104821</div></div>
                <div className="rounded-md bg-muted/40 p-2"><div className="text-muted-foreground">Members</div><div className="font-semibold">5</div></div>
                <div className="rounded-md bg-muted/40 p-2"><div className="text-muted-foreground">Head</div><div className="font-semibold">Krishna Rao</div></div>
                <div className="rounded-md bg-muted/40 p-2"><div className="text-muted-foreground">Income</div><div className="font-semibold">₹1.8L / yr</div></div>
              </div>
              <h4 className="mt-4 text-xs font-semibold uppercase text-muted-foreground">Previous Benefits</h4>
              <div className="mt-2 space-y-1.5">
                {previousBenefits.map((b, i) => (
                  <div key={i} className="flex items-center justify-between rounded-md bg-muted/40 p-2 text-xs">
                    <span className="font-medium">{b.scheme}</span>
                    <span className="tabular-nums">{b.year} · ₹{b.amount.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="docs" className="mt-4">
            <Card className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display text-sm font-bold">Required Documents</h3>
                  <p className="text-xs text-muted-foreground">{docVerified} of {requiredDocs.length} verified</p>
                </div>
                <Button variant="outline" size="sm" className="gap-1.5"><Download className="h-4 w-4" /> Download All</Button>
              </div>
              <Progress value={(docVerified / requiredDocs.length) * 100} className="mt-3 h-1.5" />
              <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {requiredDocs.map((d) => (
                  <div key={d.name} className="rounded-lg border border-border/70 p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold">{d.name}</span>
                      {d.verified ? <Badge variant="secondary" className="bg-success/10 text-success"><CheckCircle2 className="mr-0.5 inline h-3 w-3" />Verified</Badge>
                        : d.submitted ? <Badge variant="secondary" className="bg-warning/15 text-warning"><Clock className="mr-0.5 inline h-3 w-3" />Pending</Badge>
                        : <Badge variant="secondary" className="bg-destructive/10 text-destructive"><AlertCircle className="mr-0.5 inline h-3 w-3" />Missing</Badge>}
                    </div>
                    <div className="mt-2 grid h-24 place-items-center rounded-md bg-muted/40">
                      <FileText className="h-8 w-8 text-muted-foreground/60" />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="verify" className="mt-4">
            <Card className="p-5">
              <h3 className="font-display text-sm font-bold">Verification Workflow</h3>
              <div className="mt-4 space-y-3">
                {verificationFlow.map((v, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }} className="flex gap-4 rounded-lg border border-border/70 p-4">
                    <div className={cn("grid h-9 w-9 shrink-0 place-items-center rounded-full",
                      v.status === "Completed" ? "bg-success/10 text-success" : v.status === "In Progress" ? "bg-warning/15 text-warning" : "bg-muted text-muted-foreground")}>
                      {v.status === "Completed" ? <CheckCircle2 className="h-4 w-4" /> : v.status === "In Progress" ? <Clock className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold">{v.step}</span>
                        <Badge variant="secondary" className={cn("text-[10px]", v.status === "Completed" ? "bg-success/10 text-success" : v.status === "In Progress" ? "bg-warning/15 text-warning" : "bg-muted")}>{v.status}</Badge>
                      </div>
                      <div className="mt-0.5 text-xs text-muted-foreground">{v.actor} · {v.date}</div>
                      <p className="mt-1 text-xs">{v.note}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="timeline" className="mt-4">
            <Card className="p-5">
              <h3 className="font-display text-sm font-bold">Application Journey</h3>
              <div className="relative mt-4 border-l-2 border-border/70 pl-6">
                {applicationTimeline.map((t, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }} className="relative mb-5">
                    <span className="absolute -left-[31px] grid h-5 w-5 place-items-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">{i + 1}</span>
                    <div className="rounded-lg bg-muted/40 p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold">{t.event}</span>
                        <Badge variant="secondary" className="bg-primary/10 text-[10px] text-primary">{t.type}</Badge>
                      </div>
                      <div className="mt-0.5 text-xs text-muted-foreground">{t.actor} · {t.date}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="benefits" className="mt-4">
            <Card className="p-5">
              <h3 className="font-display text-sm font-bold">Benefit History</h3>
              <div className="mt-3 overflow-hidden rounded-lg border border-border/70">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
                    <tr><th className="p-3 text-left">ID</th><th className="p-3 text-left">Scheme</th><th className="p-3 text-right">Amount</th><th className="p-3 text-left">Date</th><th className="p-3 text-left">Department</th><th className="p-3 text-left">Status</th></tr>
                  </thead>
                  <tbody>
                    {benefitHistory.map((b) => (
                      <tr key={b.id} className="border-t border-border/40">
                        <td className="p-3 font-mono text-xs">{b.id}</td>
                        <td className="p-3 font-medium">{b.scheme}</td>
                        <td className="p-3 text-right tabular-nums">₹{b.amount.toLocaleString()}</td>
                        <td className="p-3 tabular-nums">{b.date}</td>
                        <td className="p-3">{b.department}</td>
                        <td className="p-3"><Badge variant="secondary" className="bg-success/10 text-success">{b.status}</Badge></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="audit" className="mt-4">
            <Card className="p-5">
              <h3 className="font-display text-sm font-bold">Audit Trail</h3>
              <div className="mt-3 space-y-2">
                {auditTrail.map((a, i) => (
                  <div key={i} className="flex items-center gap-3 rounded-lg border border-border/70 p-3 text-xs">
                    <Badge variant="secondary" className="bg-primary/10 font-mono text-[10px] text-primary">{a.action}</Badge>
                    <div className="min-w-0 flex-1">
                      <div className="font-medium">{a.user}</div>
                      <div className="text-muted-foreground">{a.remarks}</div>
                    </div>
                    <span className="shrink-0 tabular-nums text-muted-foreground">{a.date}</span>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Phone, Mail, MapPin, Calendar, Award, Star, Shield, Users,
  ClipboardList, MessageSquareWarning, FileText, Activity, Clock,
  Download, MessageCircle, CheckCircle2, XCircle, Eye,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import {
  featuredVolunteer, surveyContributions, volunteerComplaints,
  attendanceCalendar, documents, timeline, volunteers,
} from "@/lib/volunteer-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/volunteers/profile")({
  head: () => ({
    meta: [
      { title: "Volunteer 360 — MP Constituency Platform" },
      { name: "description", content: "Complete 360° view of a single volunteer — activity, surveys, complaints, attendance and timeline." },
    ],
  }),
  component: VolunteerProfilePage,
});

const v = featuredVolunteer;

const overviewStats = [
  { label: "Citizens Registered", value: v.citizensRegistered, icon: Users },
  { label: "Surveys Completed", value: v.surveysCompleted, icon: ClipboardList },
  { label: "Complaints Filed", value: v.complaintsSubmitted, icon: MessageSquareWarning },
  { label: "Meetings Attended", value: v.meetingsAttended, icon: Calendar },
];

const registeredCitizens = volunteers.slice(1, 9).map((x, i) => ({
  name: x.name,
  village: x.village,
  date: `2026-06-${String(18 - i).padStart(2, "0")}`,
  verified: i % 3 !== 0,
}));

function VolunteerProfilePage() {
  return (
    <>
      <PageHeader
        title="Volunteer 360"
        description="Single source of truth for every field operator — performance, history, contributions."
        actions={
          <>
            <Button variant="outline" size="sm" className="gap-1.5"><MessageCircle className="h-4 w-4" /> Message</Button>
            <Button size="sm" className="gap-1.5"><Phone className="h-4 w-4" /> Call</Button>
          </>
        }
      />

      <div className="space-y-6 p-4 md:p-8">
        {/* Profile header */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="overflow-hidden">
            <div className="h-24 bg-gradient-to-r from-primary/30 via-info/20 to-accent" />
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 p-6 sm:flex sm:flex-wrap sm:justify-between">
              <div className="flex min-w-0 items-start gap-4">
                <Avatar className="-mt-12 h-20 w-20 shrink-0 ring-4 ring-background">
                  <AvatarFallback className="text-xl font-bold">{v.name.split(" ").map(p=>p[0]).slice(0,2).join("")}</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="truncate font-display text-2xl font-bold">{v.name}</h2>
                    <Badge variant="secondary" className="bg-success/10 text-success">{v.status}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">Volunteer ID · {v.id} · Joined {v.joinedOn}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1"><Phone className="h-3 w-3" /> {v.mobile}</span>
                    <span className="inline-flex items-center gap-1"><Mail className="h-3 w-3" /> {v.email}</span>
                    <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" /> {v.village}, {v.mandal}</span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {v.badges.map((b) => (
                      <Badge key={b} variant="outline" className="gap-1 border-primary/30 bg-primary/5 text-primary">
                        <Star className="h-3 w-3" /> {b}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              <div className="shrink-0 text-right">
                <div className="text-xs text-muted-foreground">Activity Score</div>
                <div className="font-display text-4xl font-bold tabular-nums text-primary">{v.activityScore}</div>
                <div className="mt-1 text-[10px] text-muted-foreground">Top 5% in constituency</div>
              </div>
            </div>
          </Card>
        </motion.div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="flex w-full flex-wrap justify-start">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="citizens">Citizens</TabsTrigger>
            <TabsTrigger value="surveys">Surveys</TabsTrigger>
            <TabsTrigger value="complaints">Complaints</TabsTrigger>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
          </TabsList>

          {/* OVERVIEW */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {overviewStats.map((s, i) => (
                <motion.div key={s.label} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <Card className="p-4">
                    <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary/10 text-primary">
                      <s.icon className="h-4 w-4" />
                    </div>
                    <div className="mt-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">{s.label}</div>
                    <div className="mt-1 font-display text-2xl font-bold tabular-nums">{s.value.toLocaleString()}</div>
                  </Card>
                </motion.div>
              ))}
            </div>
            <div className="grid gap-4 lg:grid-cols-3">
              <Card className="p-5 lg:col-span-2">
                <h3 className="font-display text-base font-bold">Assigned coverage</h3>
                <p className="text-xs text-muted-foreground">Cluster of 4 booths · 2,840 citizens</p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {[
                    { booth: "Booth 32 · Madhapur", citizens: 824, coverage: 92 },
                    { booth: "Booth 33 · Madhapur", citizens: 712, coverage: 84 },
                    { booth: "Booth 41 · Kondapur", citizens: 668, coverage: 76 },
                    { booth: "Booth 42 · Kondapur", citizens: 636, coverage: 70 },
                  ].map((b) => (
                    <div key={b.booth} className="rounded-lg border border-border/60 p-3">
                      <div className="flex items-center justify-between text-sm font-semibold">
                        <span>{b.booth}</span>
                        <span className="tabular-nums text-primary">{b.coverage}%</span>
                      </div>
                      <div className="text-xs text-muted-foreground">{b.citizens} citizens</div>
                      <Progress value={b.coverage} className="mt-2 h-1.5" />
                    </div>
                  ))}
                </div>
              </Card>
              <Card className="p-5">
                <h3 className="font-display text-base font-bold">Performance summary</h3>
                <div className="mt-4 space-y-3 text-sm">
                  {[
                    { k: "Attendance", v: v.attendanceRate, suf: "%" },
                    { k: "Survey completion", v: 87, suf: "%" },
                    { k: "Grievance resolution", v: 71, suf: "%" },
                    { k: "Training completion", v: 95, suf: "%" },
                  ].map((m) => (
                    <div key={m.k}>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">{m.k}</span>
                        <span className="font-semibold tabular-nums">{m.v}{m.suf}</span>
                      </div>
                      <Progress value={m.v} className="mt-1 h-1.5" />
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* ACTIVITY */}
          <TabsContent value="activity" className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              {["Today","This Week","This Month"].map((p, i) => (
                <Card key={p} className="p-4">
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">{p}</div>
                  <div className="mt-2 font-display text-2xl font-bold tabular-nums">{[12, 84, 312][i]}</div>
                  <div className="text-xs text-success">+{[3, 12, 28][i]}% vs prev</div>
                </Card>
              ))}
            </div>
            <Card className="p-5">
              <h3 className="mb-3 font-display text-base font-bold">Recent activity</h3>
              <div className="space-y-2">
                {[
                  { t: "Registered 4 citizens at Madhapur Ward 32", time: "09:12 AM", icon: Users },
                  { t: "Submitted 8 Farmer Survey responses", time: "11:30 AM", icon: ClipboardList },
                  { t: "Filed water supply complaint #GR-2841", time: "12:45 PM", icon: MessageSquareWarning },
                  { t: "Attended booth coordinator meeting", time: "02:10 PM", icon: Calendar },
                  { t: "GPS check-out at Kondapur cluster", time: "06:02 PM", icon: MapPin },
                ].map((a, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                    className="flex items-center gap-3 rounded-lg border border-border/60 p-3">
                    <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary"><a.icon className="h-4 w-4" /></div>
                    <div className="min-w-0 flex-1 text-sm">{a.t}</div>
                    <div className="text-xs text-muted-foreground tabular-nums">{a.time}</div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* CITIZENS */}
          <TabsContent value="citizens">
            <Card className="overflow-hidden">
              <div className="border-b border-border/70 bg-muted/30 px-4 py-3 text-sm">
                <span className="font-semibold">{v.citizensRegistered}</span> citizens registered by {v.name}
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Citizen Name</TableHead>
                    <TableHead>Village</TableHead>
                    <TableHead>Registration Date</TableHead>
                    <TableHead>Verification</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {registeredCitizens.map((c, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium">{c.name}</TableCell>
                      <TableCell>{c.village}</TableCell>
                      <TableCell className="text-xs tabular-nums">{c.date}</TableCell>
                      <TableCell>
                        {c.verified ? (
                          <Badge variant="secondary" className="bg-success/10 text-success gap-1"><CheckCircle2 className="h-3 w-3" /> Verified</Badge>
                        ) : (
                          <Badge variant="secondary" className="bg-warning/15 text-warning gap-1"><XCircle className="h-3 w-3" /> Pending</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          {/* SURVEYS */}
          <TabsContent value="surveys">
            <div className="grid gap-4 md:grid-cols-2">
              {surveyContributions.map((s, i) => {
                const pct = Math.round((s.responses / s.target) * 100);
                return (
                  <motion.div key={s.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                    <Card className="p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="font-display text-base font-bold">{s.name}</div>
                          <div className="text-xs text-muted-foreground">Last submission · {s.lastSubmission}</div>
                        </div>
                        <Badge variant="secondary" className="bg-info/10 text-info">{pct}%</Badge>
                      </div>
                      <div className="mt-4 flex items-baseline gap-2">
                        <span className="font-display text-3xl font-bold tabular-nums">{s.responses}</span>
                        <span className="text-sm text-muted-foreground">/ {s.target} target</span>
                      </div>
                      <Progress value={pct} className="mt-3 h-2" />
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </TabsContent>

          {/* COMPLAINTS */}
          <TabsContent value="complaints">
            <Card className="overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Complaint ID</TableHead>
                    <TableHead>Citizen</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Filed</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {volunteerComplaints.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell className="font-mono text-xs">{c.id}</TableCell>
                      <TableCell className="font-medium">{c.citizen}</TableCell>
                      <TableCell>{c.category}</TableCell>
                      <TableCell className="text-xs tabular-nums">{c.filedOn}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={
                          c.status === "Resolved" ? "bg-success/10 text-success" :
                          c.status === "In Progress" ? "bg-info/10 text-info" : "bg-warning/15 text-warning"
                        }>{c.status}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          {/* ATTENDANCE */}
          <TabsContent value="attendance" className="space-y-4">
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {[
                { l: "Present", v: 22, tone: "text-success" },
                { l: "Absent", v: 3, tone: "text-destructive" },
                { l: "Field Visits", v: 18, tone: "text-info" },
                { l: "GPS Check-ins", v: 96, tone: "text-primary" },
              ].map((s) => (
                <Card key={s.l} className="p-4">
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">{s.l}</div>
                  <div className={cn("mt-1 font-display text-2xl font-bold tabular-nums", s.tone)}>{s.v}</div>
                </Card>
              ))}
            </div>
            <Card className="p-5">
              <h3 className="mb-3 font-display text-base font-bold">June 2026 attendance</h3>
              <div className="grid grid-cols-7 gap-1.5 text-center text-[10px] text-muted-foreground">
                {["S","M","T","W","T","F","S"].map((d,i) => <div key={i}>{d}</div>)}
              </div>
              <div className="mt-2 grid grid-cols-7 gap-1.5">
                {attendanceCalendar.map((d, i) => {
                  const tone =
                    d.status === "P" ? "bg-success/15 text-success border-success/30" :
                    d.status === "F" ? "bg-info/15 text-info border-info/30" :
                    d.status === "L" ? "bg-warning/15 text-warning border-warning/30" :
                    "bg-destructive/15 text-destructive border-destructive/30";
                  return (
                    <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.01 }}
                      className={cn("aspect-square rounded-md border text-center text-xs font-bold", tone)}>
                      <div className="pt-1.5 tabular-nums">{d.date}</div>
                      <div className="text-[9px] font-normal opacity-70">{d.status}</div>
                    </motion.div>
                  );
                })}
              </div>
              <div className="mt-3 flex flex-wrap gap-3 text-[11px] text-muted-foreground">
                <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-sm bg-success" /> Present</span>
                <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-sm bg-info" /> Field Visit</span>
                <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-sm bg-warning" /> Leave</span>
                <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-sm bg-destructive" /> Absent</span>
              </div>
            </Card>
          </TabsContent>

          {/* DOCUMENTS */}
          <TabsContent value="documents">
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {documents.map((d, i) => (
                <motion.div key={d.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                  <Card className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary"><FileText className="h-5 w-5" /></div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="truncate text-sm font-semibold">{d.name}</span>
                          {d.verified ? <Shield className="h-3.5 w-3.5 text-success" /> : <Clock className="h-3.5 w-3.5 text-warning" />}
                        </div>
                        <div className="text-xs text-muted-foreground">{d.type} · {d.uploadedOn}</div>
                        <div className="mt-3 flex gap-1.5">
                          <Button variant="outline" size="sm" className="h-7 gap-1 text-xs"><Eye className="h-3 w-3" /> Preview</Button>
                          <Button variant="outline" size="sm" className="h-7 gap-1 text-xs"><Download className="h-3 w-3" /> Download</Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* TIMELINE */}
          <TabsContent value="timeline">
            <Card className="p-6">
              <ol className="relative ml-3 border-l border-border/70">
                {timeline.map((t, i) => (
                  <motion.li key={t.id} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
                    className="mb-6 ml-6">
                    <span className="absolute -left-3 grid h-6 w-6 place-items-center rounded-full bg-primary text-primary-foreground">
                      <Activity className="h-3 w-3" />
                    </span>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-[10px]">{t.type}</Badge>
                      <span className="text-xs text-muted-foreground tabular-nums">{t.date}</span>
                    </div>
                    <p className="mt-1 text-sm font-semibold">{t.event}</p>
                  </motion.li>
                ))}
              </ol>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}

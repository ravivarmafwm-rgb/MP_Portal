import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { CalendarCheck, UserCheck, UserX, MapPin, Wifi, Download } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { volunteers, attendanceCalendar } from "@/lib/volunteer-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/volunteers/attendance")({
  head: () => ({
    meta: [
      { title: "Attendance Management — Volunteers" },
      { name: "description", content: "Track volunteer attendance, GPS check-ins and field visits." },
    ],
  }),
  component: AttendancePage,
});

const kpis = [
  { l: "Present Today", v: 1284, icon: UserCheck, tone: "bg-success/10 text-success" },
  { l: "Absent Today", v: 172, icon: UserX, tone: "bg-destructive/10 text-destructive" },
  { l: "Field Visits", v: 612, icon: MapPin, tone: "bg-info/10 text-info" },
  { l: "GPS Check-ins", v: 3420, icon: Wifi, tone: "bg-primary/10 text-primary" },
];

function AttendancePage() {
  return (
    <>
      <PageHeader
        title="Attendance Management"
        description="Daily check-ins, deployment hours and zone-wise coverage of the volunteer force."
        actions={
          <>
            <Button variant="outline" size="sm" className="gap-1.5"><Download className="h-4 w-4" /> Export</Button>
            <Button size="sm" className="gap-1.5"><CalendarCheck className="h-4 w-4" /> Mark Attendance</Button>
          </>
        }
      />
      <div className="space-y-6 p-4 md:p-8">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {kpis.map((k, i) => (
            <motion.div key={k.l} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i*0.05 }}>
              <Card className="p-4">
                <div className={cn("grid h-9 w-9 place-items-center rounded-lg", k.tone)}><k.icon className="h-4 w-4" /></div>
                <div className="mt-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">{k.l}</div>
                <div className="mt-1 font-display text-2xl font-bold tabular-nums">{k.v.toLocaleString()}</div>
              </Card>
            </motion.div>
          ))}
        </div>

        <Tabs defaultValue="calendar">
          <TabsList>
            <TabsTrigger value="calendar">Calendar View</TabsTrigger>
            <TabsTrigger value="table">Table View</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="calendar" className="mt-4">
            <Card className="p-5">
              <h3 className="mb-3 font-display text-base font-bold">June 2026 · Constituency-wide attendance</h3>
              <div className="grid grid-cols-7 gap-1.5 text-center text-[10px] text-muted-foreground">
                {["S","M","T","W","T","F","S"].map((d, i) => <div key={i}>{d}</div>)}
              </div>
              <div className="mt-2 grid grid-cols-7 gap-1.5">
                {attendanceCalendar.map((d, i) => {
                  const presentPct = d.status === "P" ? 92 : d.status === "F" ? 78 : d.status === "L" ? 60 : 40;
                  const tone =
                    presentPct > 85 ? "bg-success/15 border-success/30 text-success" :
                    presentPct > 65 ? "bg-info/15 border-info/30 text-info" :
                    presentPct > 50 ? "bg-warning/15 border-warning/30 text-warning" :
                    "bg-destructive/15 border-destructive/30 text-destructive";
                  return (
                    <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i*0.01 }}
                      className={cn("aspect-square rounded-md border p-1.5 text-left", tone)}>
                      <div className="text-xs font-bold tabular-nums">{d.date}</div>
                      <div className="mt-1 text-[10px] font-semibold opacity-80">{presentPct}%</div>
                    </motion.div>
                  );
                })}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="table" className="mt-4">
            <Card className="overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Volunteer</TableHead>
                    <TableHead>Village</TableHead>
                    <TableHead>Check-in</TableHead>
                    <TableHead>Check-out</TableHead>
                    <TableHead>Hours</TableHead>
                    <TableHead>Visits</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {volunteers.slice(0, 12).map((v, i) => (
                    <TableRow key={v.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-7 w-7"><AvatarFallback className="text-[10px]">{v.name.split(" ").map(p=>p[0]).slice(0,2).join("")}</AvatarFallback></Avatar>
                          <span className="text-sm font-semibold">{v.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{v.village}</TableCell>
                      <TableCell className="text-xs tabular-nums">{`0${8+(i%2)}:${(i*7)%60 < 10 ? "0":""}${(i*7)%60} AM`}</TableCell>
                      <TableCell className="text-xs tabular-nums">{`0${5+(i%3)}:${(i*11)%60 < 10 ? "0":""}${(i*11)%60} PM`}</TableCell>
                      <TableCell className="tabular-nums">{8 + (i%3)}</TableCell>
                      <TableCell className="tabular-nums">{2 + (i%5)}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={i%6===0?"bg-warning/15 text-warning":"bg-success/10 text-success"}>
                          {i%6===0?"Late":"On time"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="mt-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="p-5">
                <h3 className="mb-4 font-display text-base font-bold">Attendance by mandal</h3>
                <div className="space-y-3">
                  {["Serilingampally","Kukatpally","Khairatabad","Rajendranagar"].map((m, i) => {
                    const pct = [92, 86, 78, 64][i];
                    return (
                      <div key={m}>
                        <div className="flex items-center justify-between text-sm">
                          <span>{m}</span><span className="font-semibold tabular-nums">{pct}%</span>
                        </div>
                        <div className="mt-1 h-2 overflow-hidden rounded-full bg-muted">
                          <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ delay: i*0.1, duration: 0.6 }}
                            className="h-full bg-primary" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
              <Card className="p-5">
                <h3 className="mb-4 font-display text-base font-bold">GPS check-in distribution</h3>
                <div className="grid grid-cols-3 gap-2 text-center">
                  {["Morning","Afternoon","Evening"].map((s, i) => (
                    <div key={s} className="rounded-lg border border-border/60 p-3">
                      <div className="font-display text-2xl font-bold tabular-nums">{[1820,1245,355][i]}</div>
                      <div className="text-[11px] text-muted-foreground">{s}</div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Map, MapPin, Layers, Navigation, AlertTriangle, CheckCircle2 } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { coverageAreas } from "@/lib/volunteer-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/volunteers/geographic-coverage")({
  head: () => ({
    meta: [
      { title: "Geographic Coverage — Volunteers" },
      { name: "description", content: "GIS-style coverage dashboard showing village, mandal and constituency reach." },
    ],
  }),
  component: CoveragePage,
});

const overall = {
  villages: 312,
  covered: 248,
  uncovered: 64,
  density: 5.9,
  coverageScore: 79,
};

function CoveragePage() {
  return (
    <>
      <PageHeader
        title="Geographic Coverage"
        description="GIS-style view of constituency reach — covered zones, blind spots and volunteer density."
        actions={
          <>
            <Button variant="outline" size="sm" className="gap-1.5"><Layers className="h-4 w-4" /> Layers</Button>
            <Button size="sm" className="gap-1.5"><Navigation className="h-4 w-4" /> Plan Route</Button>
          </>
        }
      />
      <div className="space-y-6 p-4 md:p-8">
        {/* Top stats */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            { l: "Villages Covered", v: `${overall.covered}/${overall.villages}`, icon: CheckCircle2, tone: "bg-success/10 text-success" },
            { l: "Uncovered Zones", v: overall.uncovered, icon: AlertTriangle, tone: "bg-destructive/10 text-destructive" },
            { l: "Volunteer Density", v: `${overall.density}/km²`, icon: MapPin, tone: "bg-info/10 text-info" },
            { l: "Coverage Score", v: `${overall.coverageScore}%`, icon: Map, tone: "bg-primary/10 text-primary" },
          ].map((s, i) => (
            <motion.div key={s.l} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i*0.05 }}>
              <Card className="p-4">
                <div className={cn("grid h-9 w-9 place-items-center rounded-lg", s.tone)}><s.icon className="h-4 w-4" /></div>
                <div className="mt-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">{s.l}</div>
                <div className="mt-1 font-display text-2xl font-bold tabular-nums">{s.v}</div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Map placeholder */}
        <Card className="overflow-hidden">
          <div className="relative h-96 bg-gradient-to-br from-info/5 via-primary/5 to-accent/30">
            {/* Grid lines */}
            <div className="absolute inset-0 opacity-30" style={{
              backgroundImage: "linear-gradient(hsl(var(--border)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px)",
              backgroundSize: "40px 40px"
            }} />
            {/* Coverage circles */}
            {[
              { x: 22, y: 30, size: 90, color: "bg-success/30", label: "Madhapur" },
              { x: 45, y: 25, size: 70, color: "bg-success/30", label: "Kondapur" },
              { x: 65, y: 40, size: 80, color: "bg-info/30", label: "Gachibowli" },
              { x: 35, y: 60, size: 60, color: "bg-warning/30", label: "Miyapur" },
              { x: 75, y: 65, size: 50, color: "bg-destructive/30", label: "Maheshwaram" },
              { x: 55, y: 75, size: 70, color: "bg-info/30", label: "Shamshabad" },
              { x: 20, y: 70, size: 55, color: "bg-success/30", label: "Kukatpally" },
            ].map((c, i) => (
              <motion.div key={c.label}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i*0.1, type: "spring" }}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${c.x}%`, top: `${c.y}%` }}
              >
                <div className={cn("rounded-full blur-xl", c.color)} style={{ width: c.size, height: c.size }} />
                <div className="absolute inset-0 grid place-items-center">
                  <div className="grid place-items-center">
                    <MapPin className="h-5 w-5 text-foreground" />
                    <span className="mt-1 whitespace-nowrap rounded-md bg-background/90 px-1.5 py-0.5 text-[10px] font-semibold shadow-sm">{c.label}</span>
                  </div>
                </div>
              </motion.div>
            ))}
            <div className="absolute left-4 top-4 rounded-lg bg-background/80 px-3 py-2 backdrop-blur">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Coverage Map · Live preview</div>
              <div className="text-xs">Hyderabad Constituency · 3 Assemblies</div>
            </div>
            <div className="absolute right-4 bottom-4 flex flex-col gap-1 rounded-lg bg-background/90 p-2 text-[10px] backdrop-blur">
              {[
                { c: "bg-success", l: "High (>80%)" },
                { c: "bg-info", l: "Medium (50–80%)" },
                { c: "bg-warning", l: "Low (30–50%)" },
                { c: "bg-destructive", l: "Critical (<30%)" },
              ].map((l) => (
                <div key={l.l} className="flex items-center gap-1.5">
                  <span className={cn("h-2 w-2 rounded-sm", l.c)} />{l.l}
                </div>
              ))}
            </div>
          </div>
          <div className="border-t border-border/70 bg-muted/30 px-4 py-2 text-[11px] text-muted-foreground">
            Map placeholder · Mapbox/Google Maps integration planned for Phase 6
          </div>
        </Card>

        {/* Mandal breakdown */}
        <div className="grid gap-4 lg:grid-cols-2">
          <Card className="p-5">
            <h3 className="mb-4 font-display text-base font-bold">Coverage by mandal</h3>
            <div className="space-y-4">
              {coverageAreas.map((c, i) => (
                <motion.div key={c.mandal} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i*0.05 }}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold">{c.mandal}</span>
                    <Badge variant="secondary" className={
                      c.coverageScore > 80 ? "bg-success/10 text-success" :
                      c.coverageScore > 60 ? "bg-info/10 text-info" :
                      c.coverageScore > 40 ? "bg-warning/15 text-warning" : "bg-destructive/10 text-destructive"
                    }>{c.coverageScore}%</Badge>
                  </div>
                  <Progress value={c.coverageScore} className="mt-1.5 h-2" />
                  <div className="mt-1 flex items-center justify-between text-[11px] text-muted-foreground">
                    <span>{c.covered}/{c.villages} villages · {c.volunteers} volunteers</span>
                    <span>{c.citizens.toLocaleString()} citizens</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="mb-4 font-display text-base font-bold">Uncovered villages — priority list</h3>
            <div className="space-y-2">
              {[
                { name: "Tellapur", mandal: "Serilingampally", citizens: 1840, priority: "High" },
                { name: "Patancheru", mandal: "Patancheru", citizens: 2200, priority: "High" },
                { name: "Chevella", mandal: "Chevella", citizens: 1240, priority: "Medium" },
                { name: "Shankarpalli", mandal: "Shankarpalli", citizens: 980, priority: "Medium" },
                { name: "Moinabad", mandal: "Moinabad", citizens: 1620, priority: "High" },
                { name: "Manchal", mandal: "Maheshwaram", citizens: 720, priority: "Low" },
              ].map((u, i) => (
                <motion.div key={u.name} initial={{ opacity: 0, x: 6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i*0.04 }}
                  className="flex items-center gap-3 rounded-lg border border-border/60 p-3">
                  <div className="grid h-9 w-9 place-items-center rounded-lg bg-destructive/10 text-destructive"><AlertTriangle className="h-4 w-4" /></div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold">{u.name}</div>
                    <div className="text-[11px] text-muted-foreground">{u.mandal} · {u.citizens.toLocaleString()} citizens</div>
                  </div>
                  <Badge variant="secondary" className={
                    u.priority === "High" ? "bg-destructive/10 text-destructive" :
                    u.priority === "Medium" ? "bg-warning/15 text-warning" : "bg-muted text-muted-foreground"
                  }>{u.priority}</Badge>
                </motion.div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}

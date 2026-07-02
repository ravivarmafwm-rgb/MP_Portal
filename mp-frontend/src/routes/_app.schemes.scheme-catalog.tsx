import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, Building2 } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { schemes, type SchemeCategory } from "@/lib/scheme-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/schemes/scheme-catalog")({
  head: () => ({ meta: [{ title: "Scheme Catalog — Welfare Programs" }, { name: "description", content: "Explore all government welfare schemes available to constituents." }] }),
  component: SchemeCatalog,
});

const categories: ("All" | SchemeCategory)[] = ["All","Housing","Agriculture","Health","Education","Women Welfare","Youth Welfare","Senior Citizens","Employment","Social Security"];

function SchemeCatalog() {
  const [cat, setCat] = useState<"All" | SchemeCategory>("All");
  const [q, setQ] = useState("");
  const rows = useMemo(() => schemes.filter((s) => {
    return (cat === "All" || s.category === cat) && (q === "" || `${s.name} ${s.shortCode} ${s.department}`.toLowerCase().includes(q.toLowerCase()));
  }), [cat, q]);

  return (
    <>
      <PageHeader title="Scheme Catalog" description="12 active welfare schemes across 9 categories — explore eligibility, benefits and impact." />
      <div className="space-y-6 p-4 md:p-8">
        <Card className="p-4">
          <div className="flex flex-wrap gap-3">
            <div className="relative min-w-[240px] flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search schemes…" value={q} onChange={(e) => setQ(e.target.value)} className="pl-8" />
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {categories.map((c) => (
              <button key={c} onClick={() => setCat(c)} className={cn("rounded-full border px-3 py-1 text-xs font-medium transition", cat === c ? "border-primary bg-primary text-primary-foreground" : "border-border hover:bg-muted/60")}>{c}</button>
            ))}
          </div>
        </Card>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {rows.map((s, i) => (
            <motion.div key={s.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
              <Card className="flex h-full flex-col p-5 transition-all hover:shadow-lg">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 text-2xl">{s.icon}</div>
                    <div>
                      <h3 className="font-display text-base font-bold">{s.name}</h3>
                      <div className="text-[10px] font-mono uppercase text-muted-foreground">{s.shortCode}</div>
                    </div>
                  </div>
                  <Badge variant="secondary" className={cn(s.trend === "up" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive")}>
                    {s.growthPct > 0 ? "+" : ""}{s.growthPct}%
                  </Badge>
                </div>
                <p className="mt-3 text-xs text-muted-foreground">{s.description}</p>
                <div className="mt-4 space-y-2 text-xs">
                  <div className="flex justify-between border-b border-border/40 pb-1.5"><span className="text-muted-foreground">Category</span><span className="font-semibold">{s.category}</span></div>
                  <div className="flex justify-between border-b border-border/40 pb-1.5"><span className="text-muted-foreground">Eligibility</span><span className="text-right font-semibold">{s.eligibility}</span></div>
                  <div className="flex justify-between border-b border-border/40 pb-1.5"><span className="text-muted-foreground">Benefit</span><span className="font-semibold text-success">{s.benefit}</span></div>
                  <div className="flex justify-between border-b border-border/40 pb-1.5"><span className="text-muted-foreground inline-flex items-center gap-1"><Building2 className="h-3 w-3" /> Department</span><span className="font-semibold">{s.department}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Applications</span><span className="font-semibold tabular-nums">{s.applications.toLocaleString()}</span></div>
                </div>
                <div className="mt-4 flex gap-2">
                  <Button asChild variant="outline" size="sm" className="flex-1"><Link to="/schemes/applications">Applications</Link></Button>
                  <Button asChild size="sm" className="flex-1"><Link to="/schemes/application-detail">Apply</Link></Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </>
  );
}
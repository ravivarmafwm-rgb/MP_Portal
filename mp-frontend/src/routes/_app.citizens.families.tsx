import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Home, Users, Wallet, Plus } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatCard } from "@/components/layout/StatCard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FamilyTree } from "@/components/citizens/FamilyTree";
import { families } from "@/lib/citizen-data";

export const Route = createFileRoute("/_app/citizens/families")({
  head: () => ({
    meta: [
      { title: "Family Management — MP Constituency Platform" },
      { name: "description", content: "Family registry, household summaries and relationship graph." },
    ],
  }),
  component: FamiliesPage,
});

function FamiliesPage() {
  const totalMembers = families.reduce((a, f) => a + f.totalMembers, 0);
  const totalBenefits = families.reduce((a, f) => a + f.totalBenefits, 0);
  return (
    <>
      <PageHeader
        title="Family Management"
        description="Household registry, family graphs and benefits roll-up across the constituency."
        actions={
          <Button size="sm" className="gap-1.5">
            <Plus className="h-4 w-4" /> Register Family
          </Button>
        }
      />
      <div className="space-y-6 p-4 md:p-8">
        <div className="grid gap-4 md:grid-cols-3">
          <StatCard label="Total Families" value={families.length.toLocaleString("en-IN")} icon={Home} index={0} hint="Tracked households" />
          <StatCard label="Members Covered" value={totalMembers.toLocaleString("en-IN")} icon={Users} index={1} hint="Across registered families" />
          <StatCard label="Benefits Disbursed" value={`₹${(totalBenefits / 1000).toFixed(0)}K`} icon={Wallet} index={2} hint="Lifetime, current sample" />
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {families.map((f, i) => (
            <motion.div
              key={f.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
            >
              <Card className="p-5">
                <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border/60 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="font-mono text-[10px]">{f.id}</Badge>
                      <h3 className="font-display text-base font-semibold">{f.headName}'s Household</h3>
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {f.village}, {f.mandal} · {f.totalMembers} members
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Benefits</div>
                    <div className="font-display text-lg font-bold">₹{f.totalBenefits.toLocaleString("en-IN")}</div>
                  </div>
                </div>
                <div className="mt-4">
                  <FamilyTree family={f} />
                </div>
                <div className="mt-4 flex justify-end gap-2">
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/citizens/profile" search={{ id: f.headCitizenId }}>Open Head Profile</Link>
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </>
  );
}
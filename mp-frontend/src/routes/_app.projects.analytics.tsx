import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { BarChart3, Download, MapPin, Trophy } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { fetchProjects, fetchProjectStats } from "@/lib/api";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/projects/analytics")({
  head: () => ({
    meta: [
      { title: "Project Analytics Center" },
      {
        name: "description",
        content:
          "Executive analytics across projects, budgets, contractors and geography.",
      },
    ],
  }),
  component: AnalyticsPage,
  loader: async () => {
    const [projects, stats] = await Promise.all([
      fetchProjects(),
      fetchProjectStats(),
    ]);
    return { projects, stats };
  },
});

const completionTrend = [
  { month: "Jan", projects: 8 },
  { month: "Feb", projects: 10 },
  { month: "Mar", projects: 12 },
  { month: "Apr", projects: 14 },
  { month: "May", projects: 16 },
  { month: "Jun", projects: 18 },
];
const monthlyBudgetTrend = [
  { month: "Jan", allocated: 24, utilized: 18 },
  { month: "Feb", allocated: 28, utilized: 22 },
  { month: "Mar", allocated: 32, utilized: 26 },
  { month: "Apr", allocated: 30, utilized: 24 },
  { month: "May", allocated: 26, utilized: 20 },
  { month: "Jun", allocated: 44.6, utilized: 22.4 },
];
const contractorsData = [
  {
    id: "C001",
    name: "Sri Venkateshwara Constructions",
    projectsAssigned: 12,
    completed: 10,
    performanceScore: 88,
    budgetHandled: 48,
    risk: "Low",
  },
  {
    id: "C002",
    name: "Jaya Bharat Infrastructure",
    projectsAssigned: 10,
    completed: 8,
    performanceScore: 82,
    budgetHandled: 36,
    risk: "Low",
  },
  {
    id: "C003",
    name: "Telangana Road Works Ltd",
    projectsAssigned: 8,
    completed: 6,
    performanceScore: 76,
    budgetHandled: 28,
    risk: "Medium",
  },
  {
    id: "C004",
    name: "Vasavi Builders & Developers",
    projectsAssigned: 6,
    completed: 4,
    performanceScore: 70,
    budgetHandled: 20,
    risk: "Medium",
  },
  {
    id: "C005",
    name: "Sri Sai Engineering Works",
    projectsAssigned: 4,
    completed: 2,
    performanceScore: 64,
    budgetHandled: 12,
    risk: "High",
  },
];
const mpladsCategoryAllocations = [
  { category: "Roads & Highways", icon: "🛣️", allocated: 80, utilized: 68 },
  { category: "Water Supply", icon: "💧", allocated: 40, utilized: 36 },
  { category: "Education", icon: "🏫", allocated: 30, utilized: 24 },
  { category: "Healthcare", icon: "🏥", allocated: 25, utilized: 18 },
  { category: "Community Halls", icon: "🏛️", allocated: 15, utilized: 12 },
];
const villageBudget = [
  { village: "Kothaguda", budget: 24, projects: 12, score: 88 },
  { village: "Gachibowli", budget: 22, projects: 10, score: 84 },
  { village: "Madhapur", budget: 18, projects: 9, score: 78 },
  { village: "Hitech City", budget: 16, projects: 8, score: 76 },
  { village: "Jubilee Hills", budget: 14, projects: 7, score: 72 },
  { village: "Banjara Hills", budget: 12, projects: 6, score: 68 },
  { village: "Manikonda", budget: 10, projects: 5, score: 64 },
  { village: "Narsingi", budget: 8, projects: 4, score: 60 },
  { village: "Kokapet", budget: 6, projects: 3, score: 56 },
];

function AnalyticsPage() {
  const { stats } = Route.useLoaderData();
  const maxCompl = Math.max(...completionTrend.map((t) => t.projects));
  const maxBud = Math.max(...monthlyBudgetTrend.map((t) => t.allocated));
  const topContractors = [...contractorsData]
    .sort((a, b) => b.performanceScore - a.performanceScore)
    .slice(0, 5);
  return (
    <>
      <PageHeader
        title="Project Analytics Center"
        description="Trends, performance leaderboards and constituency development indices."
        actions={
          <Button variant="outline" size="sm" className="gap-1.5">
            <Download className="h-4 w-4" /> Analytics Pack
          </Button>
        }
      />
      <div className="space-y-6 p-4 md:p-8">
        <div className="grid gap-4 lg:grid-cols-2">
          <Card className="p-5">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-base font-bold">
                Project Completion Trend
              </h3>
              <Badge variant="secondary" className="bg-success/10 text-success">
                +22% YoY
              </Badge>
            </div>
            <div className="mt-6 flex h-40 items-end gap-3">
              {completionTrend.map((t, i) => (
                <motion.div
                  key={t.month}
                  initial={{ height: 0 }}
                  animate={{ height: "auto" }}
                  transition={{ delay: i * 0.06 }}
                  className="flex flex-1 flex-col items-center gap-1"
                >
                  <div
                    className="w-full rounded-t bg-gradient-to-t from-success to-primary"
                    style={{ height: `${(t.projects / maxCompl) * 130}px` }}
                  />
                  <span className="text-[10px] text-muted-foreground">
                    {t.month}
                  </span>
                  <span className="text-[10px] font-semibold tabular-nums">
                    {t.projects}
                  </span>
                </motion.div>
              ))}
            </div>
          </Card>
          <Card className="p-5">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-base font-bold">
                Budget Utilization Trend (₹ Cr)
              </h3>
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                FY 25-26
              </Badge>
            </div>
            <div className="mt-6 flex h-40 items-end gap-3">
              {monthlyBudgetTrend.map((t, i) => (
                <motion.div
                  key={t.month}
                  initial={{ height: 0 }}
                  animate={{ height: "auto" }}
                  transition={{ delay: i * 0.06 }}
                  className="flex flex-1 flex-col items-center gap-1"
                >
                  <div
                    className="w-full rounded-t bg-gradient-to-t from-primary to-info"
                    style={{ height: `${(t.utilized / maxBud) * 130}px` }}
                  />
                  <span className="text-[10px] text-muted-foreground">
                    {t.month}
                  </span>
                  <span className="text-[10px] font-semibold tabular-nums">
                    ₹{t.utilized}
                  </span>
                </motion.div>
              ))}
            </div>
          </Card>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <Card className="p-5">
            <h3 className="font-display text-base font-bold flex items-center gap-2">
              <Trophy className="h-4 w-4 text-warning" /> Top Contractors
            </h3>
            <div className="mt-3 space-y-2">
              {topContractors.map((c, i) => (
                <div
                  key={c.id}
                  className="flex items-center gap-3 rounded-lg border border-border/70 p-3"
                >
                  <div
                    className={cn(
                      "grid h-8 w-8 place-items-center rounded-full font-bold",
                      i === 0
                        ? "bg-warning text-warning-foreground"
                        : i === 1
                          ? "bg-muted"
                          : "bg-muted/60",
                    )}
                  >
                    {i + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-semibold">
                      {c.name}
                    </div>
                    <div className="text-[11px] text-muted-foreground">
                      {c.completed}/{c.projectsAssigned} delivered · ₹
                      {c.budgetHandled}Cr
                    </div>
                  </div>
                  <Badge
                    variant="secondary"
                    className="bg-success/10 text-success"
                  >
                    {c.performanceScore}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
          <Card className="p-5">
            <h3 className="font-display text-base font-bold">
              Category Performance
            </h3>
            <div className="mt-3 space-y-2">
              {mpladsCategoryAllocations.map((c) => {
                const eff = Math.round((c.utilized / c.allocated) * 100);
                return (
                  <div
                    key={c.category}
                    className="rounded-lg border border-border/70 p-3"
                  >
                    <div className="flex items-center justify-between text-sm">
                      <span>
                        <span className="mr-1.5">{c.icon}</span>
                        {c.category}
                      </span>
                      <span className="font-semibold tabular-nums">{eff}%</span>
                    </div>
                    <Progress value={eff} className="mt-1.5 h-1.5" />
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <Card className="p-5">
            <h3 className="font-display text-base font-bold">
              Village Development Index
            </h3>
            <div className="mt-3 space-y-2">
              {villageBudget.map((v, i) => (
                <motion.div
                  key={v.village}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="flex items-center gap-3 rounded-lg border border-border/70 p-3"
                >
                  <div className="text-[11px] font-bold text-muted-foreground tabular-nums">
                    #{i + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold">{v.village}</div>
                    <div className="text-[11px] text-muted-foreground">
                      {v.projects} projects · ₹{v.budget}Cr
                    </div>
                  </div>
                  <Badge
                    variant="secondary"
                    className={cn(
                      v.score >= 80
                        ? "bg-success/10 text-success"
                        : v.score >= 70
                          ? "bg-info/10 text-info"
                          : "bg-warning/15 text-warning",
                    )}
                  >
                    {v.score}/100
                  </Badge>
                </motion.div>
              ))}
            </div>
          </Card>
          <Card className="p-5">
            <h3 className="font-display text-base font-bold">
              Mandal Development Index
            </h3>
            <div className="mt-3 space-y-2">
              {[
                {
                  mandal: "Serilingampally",
                  score: 86,
                  projects: 84,
                  budget: 62.4,
                },
                { mandal: "Kukatpally", score: 78, projects: 52, budget: 38.8 },
                {
                  mandal: "Khairatabad",
                  score: 82,
                  projects: 28,
                  budget: 24.6,
                },
                {
                  mandal: "Rajendranagar",
                  score: 68,
                  projects: 46,
                  budget: 31.4,
                },
                {
                  mandal: "Maheshwaram",
                  score: 62,
                  projects: 38,
                  budget: 27.4,
                },
              ].map((m, i) => (
                <motion.div
                  key={m.mandal}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="rounded-lg border border-border/70 p-3"
                >
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold">{m.mandal}</span>
                    <Badge
                      variant="secondary"
                      className={cn(
                        m.score >= 80
                          ? "bg-success/10 text-success"
                          : m.score >= 70
                            ? "bg-info/10 text-info"
                            : "bg-warning/15 text-warning",
                      )}
                    >
                      {m.score}
                    </Badge>
                  </div>
                  <div className="mt-1 flex justify-between text-[11px] text-muted-foreground">
                    <span>{m.projects} projects</span>
                    <span>₹{m.budget}Cr</span>
                  </div>
                  <Progress value={m.score} className="mt-1.5 h-1.5" />
                </motion.div>
              ))}
            </div>
          </Card>
        </div>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display text-base font-bold flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-primary" /> Constituency
                Development Map
              </h3>
              <p className="text-xs text-muted-foreground">
                Roads · Water · Schools · Hospitals · MPLADS
              </p>
            </div>
            <Badge variant="secondary" className="bg-info/10 text-info">
              GIS Preview
            </Badge>
          </div>
          <div className="mt-4 grid h-72 place-items-center rounded-xl border border-dashed border-border/70 bg-[radial-gradient(circle_at_25%_25%,hsl(var(--primary)/0.14),transparent_50%),radial-gradient(circle_at_75%_65%,hsl(var(--success)/0.12),transparent_45%),radial-gradient(circle_at_55%_40%,hsl(var(--warning)/0.12),transparent_40%)]">
            <div className="text-center">
              <MapPin className="mx-auto h-8 w-8 text-primary" />
              <div className="mt-2 text-sm font-semibold">
                Project density heatmap
              </div>
              <div className="text-xs text-muted-foreground">
                Layered view of all infrastructure works
              </div>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}

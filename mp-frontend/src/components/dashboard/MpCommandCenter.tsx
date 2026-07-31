import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Users,
  Home as HomeIcon,
  HeartHandshake,
  MessageSquareWarning,
  HardHat,
  FileBadge,
  MapPinned,
  PiggyBank,
  CalendarRange,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { HealthScore } from "@/components/dashboard/HealthScore";
import { GrievanceCenter } from "@/components/dashboard/GrievanceCenter";
import { ProjectMonitor } from "@/components/dashboard/ProjectMonitor";
import { SchemePerformance } from "@/components/dashboard/SchemePerformance";
import { VolunteerLeaderboard } from "@/components/dashboard/VolunteerLeaderboard";
import { SurveyInsights } from "@/components/dashboard/SurveyInsights";
import { GeoInsights } from "@/components/dashboard/GeoInsights";
import { UrgentPanel } from "@/components/dashboard/UrgentPanel";
import { UpcomingEvents } from "@/components/dashboard/UpcomingEvents";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { QuickActionsStrip } from "@/components/dashboard/QuickActionsStrip";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchDashboardStats } from "@/lib/api";
import { useAuth } from "@/lib/auth";

interface MpCommandCenterProps {
  title?: string;
}

export function MpCommandCenter({
  title = "Command Center",
}: MpCommandCenterProps) {
  const { user } = useAuth();

  const { data: stats, isLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: fetchDashboardStats,
    staleTime: 30_000,
    refetchInterval: 60_000,
  });

  const kpis = stats?.kpis ?? {};
  const healthScore = stats?.health_score ?? {};
  const mpName = stats?.mp_name ?? user?.name ?? "Hon. MP";
  const constituencyName = stats?.constituency_name ?? "Constituency";
  const dateLabel =
    stats?.date_label ??
    new Date().toLocaleDateString("en-IN", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  return (
    <div className="space-y-6 p-4 md:p-8">
      <motion.section
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-primary/10 via-card to-info/10 p-6 shadow-card sm:p-8"
      >
        <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-10 h-56 w-56 rounded-full bg-info/10 blur-3xl" />
        <div className="relative">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="mt-3 grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
            <div className="min-w-0">
              <p className="text-label">{dateLabel}</p>
              <h1 className="mt-1 text-display-l">
                Good day, <span className="text-primary">{mpName}</span>
              </h1>
              <p className="mt-1 max-w-2xl text-body text-muted-foreground">
                Here's what is happening across the{" "}
                <strong>{constituencyName}</strong> constituency today —
                triaged, ranked and ready for your review.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" className="gap-1.5">
                <CalendarRange className="h-4 w-4" /> This week
              </Button>
              <Button size="sm" className="gap-1.5">
                <FileText className="h-4 w-4" /> Generate brief
              </Button>
            </div>
          </div>
        </div>
      </motion.section>

      <section>
        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-[112px] rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <KpiCard
              label="Total Citizens"
              value={kpis.total_citizens ?? 0}
              icon={Users}
              hint="Registered records"
              tone="primary"
              index={0}
            />
            <KpiCard
              label="Total Families"
              value={kpis.total_families ?? 0}
              icon={HomeIcon}
              hint="Family units mapped"
              tone="info"
              index={1}
            />
            <KpiCard
              label="Volunteers"
              value={kpis.volunteers ?? 0}
              icon={HeartHandshake}
              hint="Active across mandals"
              tone="success"
              index={2}
            />
            <KpiCard
              label="Villages"
              value={kpis.villages ?? 0}
              icon={MapPinned}
              hint="Under direct coverage"
              tone="warning"
              index={3}
            />
            <KpiCard
              label="Active Grievances"
              value={kpis.active_grievances ?? 0}
              icon={MessageSquareWarning}
              hint="Awaiting resolution"
              tone="destructive"
              index={4}
            />
            <KpiCard
              label="Active Projects"
              value={kpis.active_projects ?? 0}
              icon={HardHat}
              hint="In execution"
              tone="info"
              index={5}
            />
            <KpiCard
              label="Scheme Applications"
              value={kpis.scheme_applications ?? 0}
              icon={FileBadge}
              hint="This quarter"
              tone="primary"
              index={6}
            />
            <KpiCard
              label="Budget Utilization"
              value={kpis.budget_utilization ?? 0}
              suffix="%"
              icon={PiggyBank}
              hint={
                kpis.budget_spent
                  ? `₹${(kpis.budget_spent / 10000000).toFixed(1)} Cr spent`
                  : "Budget data"
              }
              tone="success"
              index={7}
            />
          </div>
        )}
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <HealthScore score={healthScore.score ?? 0} stats={stats} />
        <UrgentPanel urgent={stats?.urgent} />
      </section>

      <section>
        <GrievanceCenter grievanceData={stats?.grievance_center} />
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <ProjectMonitor projects={stats?.projects} />
        <SchemePerformance schemes={stats?.schemes} />
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <VolunteerLeaderboard volunteers={stats?.volunteers} />
        <SurveyInsights surveys={stats?.surveys} />
      </section>

      <section>
        <GeoInsights />
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <ActivityFeed activity={stats?.activity} />
        <UpcomingEvents events={stats?.events} />
      </section>

      <section>
        <QuickActionsStrip />
      </section>
    </div>
  );
}

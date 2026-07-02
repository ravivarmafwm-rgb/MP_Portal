import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  ClipboardList, UserPlus, MessageSquareWarning, MapPin,
  Users, Bell, CheckCircle2, Calendar,
} from "lucide-react";
import { RoleGuard } from "@/components/auth/RoleGuard";
import { PageHeader } from "@/components/layout/PageHeader";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchVolunteerDashboardStats } from "@/lib/api";

export const Route = createFileRoute("/_app/volunteer")({
  head: () => ({ meta: [{ title: "Volunteer Dashboard — MP Platform" }] }),
  component: VolunteerDashboardPage,
});

function VolunteerDashboardPage() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["volunteer-dashboard-stats"],
    queryFn: fetchVolunteerDashboardStats,
    staleTime: 30_000,
    refetchInterval: 60_000,
  });

  const kpis = stats?.kpis ?? {};

  return (
    <RoleGuard route="/volunteer">
      <PageHeader
        title="Volunteer Field Dashboard"
        description={stats?.assigned_village ? `Assigned: ${stats.assigned_village}, ${stats.assigned_mandal}` : "Your assigned field operations"}
        actions={
          <Button size="sm" asChild>
            <Link to="/citizens/create-profile"><UserPlus className="h-4 w-4 mr-1.5" /> Enroll Citizen</Link>
          </Button>
        }
      />
      <div className="space-y-6 p-4 md:p-8">
        <motion.section
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-border/60 bg-gradient-to-br from-success/10 via-card to-primary/5 p-6"
        >
          <p className="text-sm text-muted-foreground">{stats?.date_label}</p>
          <h1 className="mt-1 text-2xl font-bold">
            Good day, <span className="text-primary">{stats?.volunteer_name ?? "Volunteer"}</span>
          </h1>
          {stats?.volunteer_id && (
            <p className="mt-1 text-sm text-muted-foreground">ID: {stats.volunteer_id}</p>
          )}
        </motion.section>

        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-[112px] rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <KpiCard label="My Tasks" value={kpis.my_tasks ?? 0} icon={ClipboardList} tone="warning" index={0} />
            <KpiCard label="My Citizens" value={kpis.assigned_citizens ?? 0} icon={Users} tone="primary" index={1} />
            <KpiCard label="Registrations Today" value={kpis.registrations_today ?? 0} icon={UserPlus} tone="success" index={2} />
            <KpiCard label="Complaints Today" value={kpis.complaints_today ?? 0} icon={MessageSquareWarning} tone="destructive" index={3} />
            <KpiCard label="Village Citizens" value={kpis.village_citizens ?? 0} icon={MapPin} tone="info" index={4} />
            <KpiCard label="Surveys Done" value={kpis.surveys_completed ?? 0} icon={CheckCircle2} tone="success" index={5} />
            <KpiCard label="Attendance (Month)" value={kpis.attendance_this_month ?? 0} icon={Calendar} tone="primary" index={6} />
            <KpiCard label="Notifications" value={kpis.unread_notifications ?? 0} icon={Bell} tone="warning" index={7} />
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="p-6">
            <h3 className="font-bold mb-4">My Assigned Citizens</h3>
            <div className="space-y-2">
              {(stats?.assigned_citizens ?? []).length === 0 ? (
                <p className="text-sm text-muted-foreground">No citizens enrolled yet.</p>
              ) : (
                stats.assigned_citizens.map((c: { id: string; unique_id: string; first_name: string; last_name: string; mobile_number?: string }) => (
                  <div key={c.id} className="flex justify-between rounded-lg border p-3 text-sm">
                    <div>
                      <div className="font-medium">{c.first_name} {c.last_name}</div>
                      <div className="text-xs text-muted-foreground">{c.unique_id}</div>
                    </div>
                    <span className="text-xs text-muted-foreground">{c.mobile_number ?? "—"}</span>
                  </div>
                ))
              )}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-bold mb-4">Recent Complaints</h3>
            <div className="space-y-2">
              {(stats?.recent_complaints ?? []).length === 0 ? (
                <p className="text-sm text-muted-foreground">No complaints filed.</p>
              ) : (
                stats.recent_complaints.map((g: { id: string; grievance_number: string; subject: string; status: string }) => (
                  <div key={g.id} className="flex justify-between rounded-lg border p-3 text-sm">
                    <div className="min-w-0">
                      <div className="font-medium truncate">{g.subject}</div>
                      <div className="text-xs text-muted-foreground">{g.grievance_number}</div>
                    </div>
                    <Badge variant="outline">{g.status}</Badge>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline" size="sm"><Link to="/citizens/create-profile">Citizen Enrollment</Link></Button>
          <Button asChild variant="outline" size="sm"><Link to="/grievances/list">File Complaint</Link></Button>
          <Button asChild variant="outline" size="sm"><Link to="/surveys/active">Surveys</Link></Button>
          <Button asChild variant="outline" size="sm"><Link to="/volunteers/attendance">Attendance</Link></Button>
        </div>
      </div>
    </RoleGuard>
  );
}

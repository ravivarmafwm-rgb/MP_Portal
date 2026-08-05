import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  Users, ShieldCheck, Activity, FileText,
  TrendingUp, AlertCircle, CheckCircle2, Clock,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchDashboardStats, getApiErrorMessage } from "@/lib/api";

export const Route = createFileRoute("/_app/admin/")({
  head: () => ({ meta: [{ title: "Admin Dashboard — MP Platform" }] }),
  component: AdminDashboardIndex,
});

function AdminDashboardIndex() {
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: fetchDashboardStats,
    staleTime: 30_000,
  });

  return (
    <>
      <PageHeader
        title="Admin Command Center"
        description="Super-admin overview — users, permissions, and system health."
        actions={
          <Button asChild size="sm">
            <Link to="/admin/users">Manage Users</Link>
          </Button>
        }
      />
      <div className="p-4 md:p-8 space-y-6">
        {isLoading && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-28 rounded-xl" />
            ))}
          </div>
        )}
        {error && (
          <Card className="p-6 border-destructive/30">
            <p className="text-sm text-destructive">{getApiErrorMessage(error)}</p>
          </Card>
        )}
        {stats && (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard label="Total Citizens"    value={stats.total_citizens   ?? 0} icon={Users}       color="text-blue-500"   />
              <StatCard label="Total Families"    value={stats.total_families   ?? 0} icon={Users}       color="text-green-500"  />
              <StatCard label="Open Grievances"   value={stats.open_grievances  ?? 0} icon={AlertCircle} color="text-red-500"    />
              <StatCard label="Active Projects"   value={stats.active_projects  ?? 0} icon={TrendingUp}  color="text-amber-500"  />
              <StatCard label="Scheme Apps"       value={stats.scheme_applications ?? 0} icon={FileText} color="text-purple-500" />
              <StatCard label="Active Volunteers" value={stats.active_volunteers ?? 0} icon={CheckCircle2} color="text-emerald-500" />
              <StatCard label="Meetings Today"    value={stats.meetings_today   ?? 0} icon={Clock}       color="text-cyan-500"   />
              <StatCard label="Resolved Today"    value={stats.resolved_today   ?? 0} icon={CheckCircle2} color="text-green-600" />
            </div>

            {/* Quick admin links */}
            <div className="grid gap-4 sm:grid-cols-3">
              <AdminCard
                icon={Users}
                title="User Management"
                description="Invite officials, manage roles and access levels."
                href="/admin/users"
              />
              <AdminCard
                icon={ShieldCheck}
                title="Permissions"
                description="Review role permissions and geographic scope assignments."
                href="/admin/permissions"
              />
              <AdminCard
                icon={Activity}
                title="Activity Logs"
                description="System-wide audit trail across all modules and users."
                href="/admin/activity"
              />
            </div>
          </>
        )}
      </div>
    </>
  );
}

function StatCard({ label, value, icon: Icon, color }: {
  label: string; value: number; icon: typeof Users; color: string;
}) {
  return (
    <Card className="flex items-center gap-4 p-5">
      <div className={`rounded-xl bg-muted p-3 ${color}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-2xl font-bold">{value.toLocaleString("en-IN")}</p>
      </div>
    </Card>
  );
}

function AdminCard({ icon: Icon, title, description, href }: {
  icon: typeof Users; title: string; description: string; href: string;
}) {
  return (
    <Card className="p-5 space-y-3 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-primary/10 p-2">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <h3 className="font-semibold">{title}</h3>
      </div>
      <p className="text-sm text-muted-foreground">{description}</p>
      <Button asChild variant="outline" size="sm" className="w-full">
        <Link to={href as "/admin/users"}>Open →</Link>
      </Button>
    </Card>
  );
}

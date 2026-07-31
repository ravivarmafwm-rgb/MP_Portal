import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { MessageSquareWarning, HardHat } from "lucide-react";
import { RoleGuard } from "@/components/auth/RoleGuard";
import { PageHeader } from "@/components/layout/PageHeader";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchGrievanceStats, fetchProjectStats } from "@/lib/api";

export const Route = createFileRoute("/_app/officer")({
  head: () => ({ meta: [{ title: "Officer Dashboard — MP Platform" }] }),
  component: OfficerDashboardPage,
});

function OfficerDashboardPage() {
  const { data: grievances, isLoading: gLoading } = useQuery({
    queryKey: ["grievance-stats"],
    queryFn: fetchGrievanceStats,
    refetchInterval: 60_000,
  });
  const { data: projects, isLoading: pLoading } = useQuery({
    queryKey: ["project-stats"],
    queryFn: fetchProjectStats,
    refetchInterval: 60_000,
  });

  const isLoading = gLoading || pLoading;

  return (
    <RoleGuard route="/officer">
      <PageHeader
        title="Government Officer Dashboard"
        description="Grievance and project oversight"
      />
      <div className="space-y-6 p-4 md:p-8">
        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-[112px] rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <KpiCard
              label="Total Grievances"
              value={grievances?.total ?? 0}
              icon={MessageSquareWarning}
              tone="destructive"
              index={0}
            />
            <KpiCard
              label="Pending"
              value={grievances?.pending ?? 0}
              icon={MessageSquareWarning}
              tone="warning"
              index={1}
            />
            <KpiCard
              label="Resolved"
              value={grievances?.resolved ?? 0}
              icon={MessageSquareWarning}
              tone="success"
              index={2}
            />
            <KpiCard
              label="Active Projects"
              value={projects?.in_progress ?? projects?.active ?? 0}
              icon={HardHat}
              tone="info"
              index={3}
            />
          </div>
        )}
        <Card className="p-6">
          <h3 className="font-bold mb-4">Quick Actions</h3>
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline" size="sm">
              <Link to="/grievances/list">View Grievances</Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link to="/grievances/dashboard">Grievance Center</Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link to="/projects/dashboard">Projects</Link>
            </Button>
          </div>
        </Card>
      </div>
    </RoleGuard>
  );
}

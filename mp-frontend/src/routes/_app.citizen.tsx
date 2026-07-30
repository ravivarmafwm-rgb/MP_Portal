import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { FileBadge, MessageSquareWarning } from "lucide-react";
import { RoleGuard } from "@/components/auth/RoleGuard";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { fetchGrievanceStats, fetchSchemeStats } from "@/lib/api";

export const Route = createFileRoute("/_app/citizen")({
  head: () => ({ meta: [{ title: "Citizen Portal — MP Platform" }] }),
  component: CitizenPortalPage,
});

function CitizenPortalPage() {
  const { data: schemes } = useQuery({
    queryKey: ["scheme-stats"],
    queryFn: fetchSchemeStats,
    refetchInterval: 120_000,
  });
  const { data: grievances } = useQuery({
    queryKey: ["grievance-stats"],
    queryFn: fetchGrievanceStats,
    refetchInterval: 120_000,
  });

  return (
    <RoleGuard route="/citizen">
      <PageHeader
        title="Citizen Portal"
        description="Access schemes, file grievances, and track your requests"
      />
      <div className="space-y-6 p-4 md:p-8">
        <div className="grid gap-4 sm:grid-cols-2">
          <Card className="p-6">
            <FileBadge className="h-8 w-8 text-primary mb-3" />
            <h3 className="font-bold">Government Schemes</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {schemes?.active_schemes ?? 0} active schemes available in your
              constituency
            </p>
            <Button asChild className="mt-4" size="sm" variant="outline">
              <Link to="/schemes/dashboard">Browse Schemes</Link>
            </Button>
          </Card>
          <Card className="p-6">
            <MessageSquareWarning className="h-8 w-8 text-destructive mb-3" />
            <h3 className="font-bold">File a Grievance</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {grievances?.resolved ?? 0} grievances resolved this term
            </p>
            <Button asChild className="mt-4" size="sm" variant="outline">
              <Link to="/grievances/list">File Complaint</Link>
            </Button>
          </Card>
        </div>
      </div>
    </RoleGuard>
  );
}

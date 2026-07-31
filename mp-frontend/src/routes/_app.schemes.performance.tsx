import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import {
  AlertCircle,
  Building2,
  CheckCircle2,
  IndianRupee,
  Users,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchSchemeAnalytics, fetchSchemeStats } from "@/lib/api";

export const Route = createFileRoute("/_app/schemes/performance")({
  head: () => ({ meta: [{ title: "Scheme Performance" }] }),
  component: PerformancePage,
});

function PerformancePage() {
  const stats = useQuery({
    queryKey: ["scheme-stats"],
    queryFn: fetchSchemeStats,
  });
  const analytics = useQuery({
    queryKey: ["scheme-analytics"],
    queryFn: fetchSchemeAnalytics,
  });
  if (stats.isLoading || analytics.isLoading) return <Loading />;
  if (stats.isError || analytics.isError)
    return (
      <State message="Scheme performance could not be loaded. Please retry." />
    );
  const totals = stats.data!;
  const approvalRate = totals.total_applications
    ? Math.round((totals.approved / totals.total_applications) * 100)
    : 0;
  const departments = analytics
    .data!.by_department.map((item) => ({
      ...item,
      approvalRate: item.applications
        ? Math.round((item.approved / item.applications) * 100)
        : 0,
    }))
    .sort((a, b) => b.approvalRate - a.approvalRate);
  const schemes = [...analytics.data!.by_scheme].sort(
    (a, b) => b.beneficiaries - a.beneficiaries,
  );

  return (
    <>
      <PageHeader
        title="Scheme Performance"
        description="Performance calculated from recorded applications and beneficiary disbursements."
      />
      <div className="space-y-6 p-4 md:p-8">
        <div className="grid gap-4 sm:grid-cols-3">
          <Metric
            label="Approval rate"
            value={`${approvalRate}%`}
            icon={CheckCircle2}
          />
          <Metric
            label="Active beneficiaries"
            value={totals.total_beneficiaries.toLocaleString()}
            icon={Users}
          />
          <Metric
            label="Benefits distributed"
            value={`₹${totals.total_benefit_distributed.toLocaleString("en-IN")}`}
            icon={IndianRupee}
          />
        </div>
        <Card className="p-5">
          <h2 className="flex items-center gap-2 font-semibold">
            <Building2 className="h-4 w-4" /> Department performance
          </h2>
          {departments.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">
              No application performance has been recorded.
            </p>
          ) : (
            <div className="mt-4 space-y-4">
              {departments.map((department) => (
                <div key={department.id ?? "unassigned"}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span>{department.name ?? "Unassigned department"}</span>
                    <span>
                      {department.approved.toLocaleString()} /{" "}
                      {department.applications.toLocaleString()} approved
                    </span>
                  </div>
                  <Progress value={department.approvalRate} className="h-2" />
                </div>
              ))}
            </div>
          )}
        </Card>
        <Card className="p-5">
          <h2 className="font-semibold">
            Beneficiaries and distribution by scheme
          </h2>
          {schemes.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">
              No beneficiary records are available.
            </p>
          ) : (
            <div className="mt-4 divide-y">
              {schemes.map((item) => (
                <div
                  key={item.scheme_id}
                  className="grid gap-1 py-3 text-sm sm:grid-cols-3"
                >
                  <span className="font-medium">{item.scheme.name}</span>
                  <span>
                    {item.beneficiaries.toLocaleString()} beneficiaries
                  </span>
                  <span className="sm:text-right">
                    ₹{Number(item.distributed).toLocaleString("en-IN")}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </>
  );
}

function Metric({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: typeof Users;
}) {
  return (
    <Card className="p-5">
      <Icon className="h-5 w-5 text-primary" />
      <div className="mt-3 text-xs text-muted-foreground">{label}</div>
      <div className="mt-1 text-2xl font-bold tabular-nums">{value}</div>
    </Card>
  );
}
function Loading() {
  return (
    <div className="space-y-4 p-8">
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="h-24" />
      ))}
    </div>
  );
}
function State({ message }: { message: string }) {
  return (
    <div className="grid min-h-[50vh] place-items-center p-8 text-center text-muted-foreground">
      <div>
        <AlertCircle className="mx-auto mb-3 h-8 w-8" />
        {message}
      </div>
    </div>
  );
}

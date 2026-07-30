import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { AlertCircle, MapPin } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchSchemeAnalytics } from "@/lib/api";

export const Route = createFileRoute("/_app/schemes/coverage-analysis")({
  component: CoveragePage,
});

function CoveragePage() {
  const query = useQuery({
    queryKey: ["scheme-analytics"],
    queryFn: fetchSchemeAnalytics,
  });
  if (query.isLoading)
    return (
      <div className="space-y-3 p-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-20" />
        ))}
      </div>
    );
  if (query.isError)
    return (
      <State text="Geographic application analytics could not be loaded." />
    );
  const rows = query.data!.by_village.map((row) => ({
    ...row,
    approvalRate: row.applications
      ? Math.round((row.approved / row.applications) * 100)
      : 0,
  }));
  return (
    <>
      <PageHeader
        title="Geographic Application Analysis"
        description="Approval and application volumes calculated from recorded scheme applications. This is not a population coverage estimate."
      />
      <div className="space-y-5 p-4 md:p-8">
        <Card className="p-5">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            <h2 className="font-semibold">Village application outcomes</h2>
          </div>
          {rows.length === 0 ? (
            <p className="py-12 text-center text-sm text-muted-foreground">
              No geographically linked applications are available.
            </p>
          ) : (
            <div className="mt-5 space-y-4">
              {rows.slice(0, 10).map((row) => (
                <div key={row.village_id}>
                  <div className="mb-1 flex flex-wrap justify-between gap-2 text-sm">
                    <span className="font-medium">
                      {row.village.name}
                      <span className="ml-2 text-xs font-normal text-muted-foreground">
                        {row.village.mandal?.name ?? "Mandal not recorded"}
                      </span>
                    </span>
                    <span>
                      {row.approved} of {row.applications} approved
                    </span>
                  </div>
                  <Progress value={row.approvalRate} className="h-2" />
                </div>
              ))}
            </div>
          )}
        </Card>
        {rows.length > 0 && (
          <Card className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="p-3 text-left">Village</th>
                  <th className="p-3 text-left">Mandal</th>
                  <th className="p-3 text-right">Applications</th>
                  <th className="p-3 text-right">Approved</th>
                  <th className="p-3 text-right">Approval rate</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.village_id} className="border-t">
                    <td className="p-3 font-medium">{row.village.name}</td>
                    <td className="p-3">{row.village.mandal?.name ?? "—"}</td>
                    <td className="p-3 text-right">
                      {row.applications.toLocaleString()}
                    </td>
                    <td className="p-3 text-right">
                      {row.approved.toLocaleString()}
                    </td>
                    <td className="p-3 text-right">
                      <Badge variant="secondary">{row.approvalRate}%</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        )}
      </div>
    </>
  );
}
function State({ text }: { text: string }) {
  return (
    <div className="grid min-h-[50vh] place-items-center text-center text-muted-foreground">
      <div>
        <AlertCircle className="mx-auto mb-3 h-8 w-8" />
        {text}
      </div>
    </div>
  );
}

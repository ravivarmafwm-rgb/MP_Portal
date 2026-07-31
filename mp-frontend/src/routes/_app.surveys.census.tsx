import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Download, Home, IdCard, Loader2, Phone, Users } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { downloadCensus, fetchCensus, getApiErrorMessage } from "@/lib/api";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/_app/surveys/census")({
  head: () => ({ meta: [{ title: "Constituency Census — MP Constituency" }] }),
  component: CensusCenter,
});

function CensusCenter() {
  const [exporting, setExporting] = useState(false);
  const { user } = useAuth();
  const canExport = [
    "super-admin",
    "mp",
    "mp-staff",
    "constituency-coordinator",
    "assembly-coordinator",
  ].includes(user?.role_slug ?? "");
  const query = useQuery({
    queryKey: ["constituency-census"],
    queryFn: fetchCensus,
    staleTime: 60_000,
  });
  const exportReport = async () => {
    setExporting(true);
    try {
      const url = await downloadCensus();
      const link = document.createElement("a");
      link.href = url;
      link.download = `constituency-census-${new Date().toISOString().slice(0, 10)}.csv`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setExporting(false);
    }
  };
  if (query.isLoading)
    return (
      <div className="space-y-4 p-8">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} className="h-32" />
        ))}
      </div>
    );
  if (query.isError)
    return (
      <div className="p-8">
        <Card className="p-10 text-center text-sm text-destructive">
          {getApiErrorMessage(query.error)}
        </Card>
      </div>
    );
  const data = query.data!;
  const percent = (value: number, total = data.total_citizens) =>
    total > 0 ? Math.round((value * 100) / total) : 0;
  const coverage = [
    { label: "Aadhaar recorded", value: data.with_aadhaar, icon: IdCard },
    { label: "Voter ID recorded", value: data.with_voter_id, icon: IdCard },
    { label: "Mobile recorded", value: data.with_mobile, icon: Phone },
    { label: "Education recorded", value: data.with_education, icon: Users },
    { label: "Occupation recorded", value: data.with_occupation, icon: Users },
  ];
  return (
    <>
      <PageHeader
        title="Constituency Census Center"
        description="Scoped aggregates calculated from registered citizens and households."
        actions={
          canExport ? (
            <Button
              variant="outline"
              size="sm"
              disabled={exporting}
              onClick={exportReport}
            >
              {exporting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Download className="mr-2 h-4 w-4" />
              )}
              Download CSV
            </Button>
          ) : undefined
        }
      />
      <div className="space-y-4 p-4 md:p-8">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {[
            ["Registered citizens", data.total_citizens],
            ["Households", data.households],
            ["Registered voters", data.voters],
            ["BPL households", data.bpl_households],
          ].map(([label, value]) => (
            <Card key={String(label)} className="p-4">
              <div className="text-xs text-muted-foreground">{label}</div>
              <div className="mt-1 font-display text-2xl font-bold tabular-nums">
                {Number(value).toLocaleString("en-IN")}
              </div>
            </Card>
          ))}
        </div>
        {data.total_citizens === 0 ? (
          <Card className="p-12 text-center">
            <Users className="mx-auto h-8 w-8 text-muted-foreground" />
            <h2 className="mt-3 font-semibold">
              No census records in your scope
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Aggregates will appear after citizen and family records are
              registered.
            </p>
          </Card>
        ) : (
          <>
            <div className="grid gap-4 lg:grid-cols-3">
              <Card className="p-5">
                <h3 className="font-semibold">Gender registration</h3>
                <div className="mt-4 space-y-3">
                  {[
                    ["Male", data.male],
                    ["Female", data.female],
                    ["Other / unspecified", data.other_gender],
                  ].map(([label, value]) => (
                    <div key={String(label)}>
                      <div className="flex justify-between text-sm">
                        <span>{label}</span>
                        <span>
                          {Number(value).toLocaleString("en-IN")} (
                          {percent(Number(value))}%)
                        </span>
                      </div>
                      <Progress
                        className="mt-1 h-1.5"
                        value={percent(Number(value))}
                      />
                    </div>
                  ))}
                </div>
              </Card>
              <Card className="p-5">
                <h3 className="font-semibold">Age groups</h3>
                <div className="mt-4 space-y-3">
                  {[
                    ["Under 18", data.children],
                    ["18–59", data.working_age],
                    ["60 and above", data.senior_citizens],
                  ].map(([label, value]) => (
                    <div key={String(label)}>
                      <div className="flex justify-between text-sm">
                        <span>{label}</span>
                        <span>
                          {Number(value).toLocaleString("en-IN")} (
                          {percent(Number(value))}%)
                        </span>
                      </div>
                      <Progress
                        className="mt-1 h-1.5"
                        value={percent(Number(value))}
                      />
                    </div>
                  ))}
                </div>
              </Card>
              <Card className="p-5">
                <h3 className="font-semibold">Household indicators</h3>
                <div className="mt-4 space-y-3">
                  <div className="flex items-center justify-between rounded-md border p-3">
                    <span className="flex items-center gap-2 text-sm">
                      <Home className="h-4 w-4" />
                      Households
                    </span>
                    <strong>{data.households.toLocaleString("en-IN")}</strong>
                  </div>
                  <div className="flex items-center justify-between rounded-md border p-3">
                    <span className="text-sm">BPL households</span>
                    <strong>
                      {data.bpl_households.toLocaleString("en-IN")}
                    </strong>
                  </div>
                  <div className="flex items-center justify-between rounded-md border p-3">
                    <span className="text-sm">Persons with disability</span>
                    <strong>
                      {data.persons_with_disability.toLocaleString("en-IN")}
                    </strong>
                  </div>
                </div>
              </Card>
            </div>
            <Card className="p-5">
              <h3 className="font-semibold">Record completeness</h3>
              <p className="text-xs text-muted-foreground">
                Coverage means the field is present in a citizen record; it does
                not imply external verification.
              </p>
              <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
                {coverage.map((item) => (
                  <div key={item.label} className="rounded-md border p-3">
                    <item.icon className="h-4 w-4 text-primary" />
                    <div className="mt-2 text-xs text-muted-foreground">
                      {item.label}
                    </div>
                    <div className="font-semibold">
                      {item.value.toLocaleString("en-IN")} ·{" "}
                      {percent(item.value)}%
                    </div>
                    <Progress
                      className="mt-2 h-1.5"
                      value={percent(item.value)}
                    />
                  </div>
                ))}
              </div>
            </Card>
            <div className="grid gap-4 lg:grid-cols-2">
              {[
                ["Education", data.education_breakdown],
                ["Occupation", data.occupation_breakdown],
              ].map(([title, rows]) => (
                <Card key={String(title)} className="p-5">
                  <h3 className="font-semibold">{String(title)} breakdown</h3>
                  {(rows as Array<{ label: string; count: number }>).length ===
                  0 ? (
                    <p className="py-8 text-center text-sm text-muted-foreground">
                      No {String(title).toLowerCase()} data recorded.
                    </p>
                  ) : (
                    <div className="mt-3 space-y-2">
                      {(rows as Array<{ label: string; count: number }>).map(
                        (row) => (
                          <div
                            key={row.label}
                            className="flex justify-between border-b py-2 text-sm"
                          >
                            <span>{row.label}</span>
                            <strong>{row.count.toLocaleString("en-IN")}</strong>
                          </div>
                        ),
                      )}
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </>
        )}
        <p className="text-center text-xs text-muted-foreground">
          Generated from the scoped database at{" "}
          {new Date(data.generated_at).toLocaleString("en-IN")}. No estimates or
          external census claims are included.
        </p>
      </div>
    </>
  );
}

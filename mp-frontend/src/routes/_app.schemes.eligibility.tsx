import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { AlertCircle, BadgeCheck, FileWarning } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchSchemeEligibilityRules } from "@/lib/api";

export const Route = createFileRoute("/_app/schemes/eligibility")({
  component: EligibilityPage,
});

function EligibilityPage() {
  const query = useQuery({
    queryKey: ["scheme-eligibility-rules"],
    queryFn: fetchSchemeEligibilityRules,
  });
  if (query.isLoading)
    return (
      <div className="space-y-3 p-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
    );
  if (query.isError)
    return (
      <div className="grid min-h-[50vh] place-items-center text-center text-muted-foreground">
        <div>
          <AlertCircle className="mx-auto mb-3 h-8 w-8" />
          Eligibility rules could not be loaded.
        </div>
      </div>
    );
  const schemes = query.data!.data;
  return (
    <>
      <PageHeader
        title="Scheme Eligibility Rules"
        description="Authoritative eligibility criteria configured for active schemes. No automated citizen decision is shown unless supported by recorded rules and verified citizen data."
      />
      <div className="space-y-4 p-4 md:p-8">
        {schemes.length === 0 && (
          <div className="py-16 text-center text-sm text-muted-foreground">
            No active schemes are configured.
          </div>
        )}
        {schemes.map((scheme) => (
          <Card key={scheme.id} className="p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="font-semibold">{scheme.name}</h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  {scheme.code} ·{" "}
                  {scheme.department?.name ?? "Department not assigned"}
                </p>
              </div>
              <Badge variant="secondary">
                {scheme.eligibility_rules?.length ?? 0} structured rules
              </Badge>
            </div>
            {scheme.eligibility && (
              <div className="mt-4 rounded-md bg-muted/40 p-3 text-sm">
                <div className="mb-1 font-medium">Published eligibility</div>
                <p className="whitespace-pre-wrap text-muted-foreground">
                  {scheme.eligibility}
                </p>
              </div>
            )}
            {(scheme.eligibility_rules?.length ?? 0) > 0 ? (
              <div className="mt-4 divide-y rounded-md border">
                {scheme.eligibility_rules!.map((rule) => (
                  <div key={rule.id} className="flex gap-3 p-3">
                    <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-medium">{rule.rule_name}</span>
                        {rule.is_mandatory && (
                          <Badge variant="destructive" className="text-[10px]">
                            Mandatory
                          </Badge>
                        )}
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {rule.condition ||
                          [rule.field_name, rule.operator, rule.value]
                            .filter(Boolean)
                            .join(" ") ||
                          "Rule details have not been recorded."}
                      </p>
                      {rule.error_message && (
                        <p className="mt-1 text-xs text-destructive">
                          {rule.error_message}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              !scheme.eligibility && (
                <div className="mt-4 flex gap-2 rounded-md border border-warning/30 bg-warning/5 p-3 text-sm text-muted-foreground">
                  <FileWarning className="h-4 w-4 shrink-0 text-warning" />
                  No eligibility criteria have been configured for this scheme.
                </div>
              )
            )}
          </Card>
        ))}
      </div>
    </>
  );
}

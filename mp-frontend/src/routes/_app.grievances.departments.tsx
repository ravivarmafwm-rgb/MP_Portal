import { createFileRoute } from "@tanstack/react-router";
import { Building2, Mail, Phone } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  fetchGrievanceDepartments,
  type GrievanceDepartmentRecord,
} from "@/lib/api";
export const Route = createFileRoute("/_app/grievances/departments")({
  loader: fetchGrievanceDepartments,
  component: Page,
});
function Page() {
  const departments = Route.useLoaderData();
  return (
    <>
      <PageHeader
        title="Grievance Departments"
        description="Real case load and SLA performance by assigned department."
      />
      <div className="grid gap-4 p-4 md:grid-cols-2 md:p-8 xl:grid-cols-3">
        {departments.length === 0 ? (
          <Card className="p-8 text-center text-muted-foreground md:col-span-2 xl:col-span-3">
            No active departments found.
          </Card>
        ) : (
          departments.map((d: GrievanceDepartmentRecord) => (
            <Card key={d.id} className="p-5">
              <div className="flex items-start justify-between">
                <Building2 className="h-5 w-5 text-primary" />
                <Badge variant="secondary">
                  {d.sla_compliance == null
                    ? "No SLA data"
                    : `SLA ${d.sla_compliance}%`}
                </Badge>
              </div>
              <h3 className="mt-3 font-semibold">{d.name}</h3>
              <p className="text-xs text-muted-foreground">
                {d.code ?? "No code"} · {d.description ?? "No description"}
              </p>
              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                <Metric label="Assigned" value={d.assigned} />
                <Metric label="Pending" value={d.pending} />
                <Metric label="Resolved" value={d.resolved} />
              </div>
              {d.contact_person && (
                <p className="mt-3 text-xs text-muted-foreground">
                  Contact: {d.contact_person}
                </p>
              )}
              <div className="mt-3 flex gap-2">
                {d.contact_phone && (
                  <Button asChild variant="outline" size="sm">
                    <a href={`tel:${d.contact_phone}`}>
                      <Phone className="mr-1 h-3 w-3" />
                      Call
                    </a>
                  </Button>
                )}
                {d.contact_email && (
                  <Button asChild variant="outline" size="sm">
                    <a href={`mailto:${d.contact_email}`}>
                      <Mail className="mr-1 h-3 w-3" />
                      Email
                    </a>
                  </Button>
                )}
              </div>
            </Card>
          ))
        )}
      </div>
    </>
  );
}
function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded border p-2">
      <div className="font-bold">{value}</div>
      <div className="text-[10px] text-muted-foreground">{label}</div>
    </div>
  );
}

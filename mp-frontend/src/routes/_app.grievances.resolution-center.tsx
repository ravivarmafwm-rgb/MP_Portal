import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  fetchGrievances,
  fetchGrievanceStats,
  fetchGrievanceFeedback,
  type GrievanceRecord,
  type GrievanceFeedbackRecord,
} from "@/lib/api";
export const Route = createFileRoute("/_app/grievances/resolution-center")({
  loader: async () => {
    const [stats, urgent, pending, escalated, resolved, feedback] =
      await Promise.all([
        fetchGrievanceStats(),
        fetchGrievances({ priority: "urgent", per_page: 5 }),
        fetchGrievances({ status: "pending", per_page: 5 }),
        fetchGrievances({ status: "escalated", per_page: 5 }),
        fetchGrievances({ status: "resolved", per_page: 5 }),
        fetchGrievanceFeedback({ per_page: 5 }),
      ]);
    return { stats, urgent, pending, escalated, resolved, feedback };
  },
  component: Page,
});
function Page() {
  const data = Route.useLoaderData();
  const buckets = [
    { label: "Urgent", rows: data.urgent.data },
    { label: "Pending", rows: data.pending.data },
    { label: "Escalated", rows: data.escalated.data },
    { label: "Recently resolved", rows: data.resolved.data },
  ];
  return (
    <>
      <PageHeader
        title="Resolution Center"
        description="Live grievance queues requiring operational attention."
      />
      <div className="space-y-6 p-4 md:p-8">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-6">
          {[
            "total",
            "pending",
            "in_progress",
            "escalated",
            "resolved",
            "closed",
          ].map((key) => (
            <Card key={key} className="p-3 text-center">
              <div className="text-2xl font-bold">
                {Number(data.stats[key] ?? 0)}
              </div>
              <div className="text-xs capitalize text-muted-foreground">
                {key.replace("_", " ")}
              </div>
            </Card>
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {buckets.map((bucket) => (
            <Card key={bucket.label} className="p-5">
              <h3 className="font-semibold">{bucket.label}</h3>
              <div className="mt-3 space-y-2">
                {bucket.rows.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No cases.</p>
                ) : (
                  bucket.rows.map((g: GrievanceRecord) => (
                    <Link
                      key={g.id}
                      to="/grievances/detail"
                      search={{ id: g.id }}
                      className="flex items-center justify-between rounded border p-3 hover:bg-muted/40"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">
                          {g.title || String(g.subject ?? "")}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {g.grievance_number} · {g.citizen_name ?? "Anonymous"}
                        </p>
                      </div>
                      <Badge variant="secondary">{g.status}</Badge>
                    </Link>
                  ))
                )}
              </div>
            </Card>
          ))}
        </div>
        <Card className="p-5">
          <h3 className="font-semibold">Citizen Feedback</h3>
          <div className="mt-3 space-y-2">
            {data.feedback.data.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No citizen feedback recorded.
              </p>
            ) : (
              data.feedback.data.map((f: GrievanceFeedbackRecord) => (
                <div key={f.id} className="rounded border p-3">
                  <div className="flex justify-between">
                    <strong className="text-sm">
                      {f.citizen
                        ? `${f.citizen.first_name} ${f.citizen.last_name}`
                        : "Anonymous citizen"}
                    </strong>
                    <span className="text-warning">
                      {"★".repeat(f.rating ?? 0)}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {f.comments ?? "No written comment."}
                  </p>
                  {f.grievance && (
                    <Link
                      to="/grievances/detail"
                      search={{ id: f.grievance.id }}
                      className="mt-1 block text-xs text-primary"
                    >
                      {f.grievance.grievance_number}
                    </Link>
                  )}
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </>
  );
}

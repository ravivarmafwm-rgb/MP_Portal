import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertCircle, Search, UserPlus, Users } from "lucide-react";
import { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchVolunteerEnrolledCitizens } from "@/lib/api";
import { VolunteerSchemeApplicationDialog } from "@/components/schemes/VolunteerSchemeApplicationDialog";
export const Route = createFileRoute("/_app/volunteers/enrolled-citizens")({
  component: EnrolledPage,
});
function EnrolledPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const q = useQuery({
    queryKey: ["volunteer-enrolled-citizens", search, page],
    queryFn: () =>
      fetchVolunteerEnrolledCitizens({ search, page, per_page: 20 }),
  });
  return (
    <>
      <PageHeader
        title="Volunteer-Enrolled Citizens"
        description="Citizens whose persisted creator account is linked to a volunteer."
        actions={<VolunteerSchemeApplicationDialog />}
      />
      <div className="space-y-4 p-4 md:p-8">
        <div className="grid gap-3 sm:grid-cols-3">
          <Metric
            label="Total enrolled"
            value={q.data?.stats.total ?? 0}
            icon={Users}
          />
          <Metric
            label="This week"
            value={q.data?.stats.this_week ?? 0}
            icon={UserPlus}
          />
          <Card className="p-4">
            <div className="text-xs text-muted-foreground">
              Top enrolling volunteer
            </div>
            <div className="mt-2 font-semibold">
              {q.data?.stats.top_volunteer ?? "No enrollments"}
            </div>
          </Card>
        </div>
        <Card className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-9"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Citizen name or ID"
            />
          </div>
        </Card>
        {q.isLoading && (
          <div className="space-y-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-12" />
            ))}
          </div>
        )}
        {q.isError && (
          <div className="py-16 text-center text-muted-foreground">
            <AlertCircle className="mx-auto mb-2" />
            Enrolled citizens could not be loaded.
          </div>
        )}
        {q.data && (
          <Card className="divide-y">
            {q.data.data.map((c) => (
              <div key={c.id} className="grid gap-2 p-4 text-sm md:grid-cols-4">
                <Link
                  to="/citizens/profile"
                  search={{ id: c.id }}
                  className="font-medium text-primary"
                >
                  {[c.first_name, c.middle_name, c.last_name]
                    .filter(Boolean)
                    .join(" ")}
                </Link>
                <span>{c.unique_id}</span>
                <span>
                  {c.addresses[0]?.village?.name ?? "Village not recorded"}
                </span>
                <span>{c.created_by?.name ?? "Creator unavailable"}</span>
              </div>
            ))}
            {!q.data.data.length && (
              <div className="p-10 text-center text-sm text-muted-foreground">
                No volunteer-enrolled citizens match the search.
              </div>
            )}
          </Card>
        )}
        {q.data && q.data.meta.last_page > 1 && (
          <div className="flex justify-between">
            <span>
              Page {page} of {q.data.meta.last_page}
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                disabled={page === q.data.meta.last_page}
                onClick={() => setPage(page + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
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
  value: number;
  icon: typeof Users;
}) {
  return (
    <Card className="p-4">
      <Icon className="h-5 w-5 text-primary" />
      <div className="mt-2 text-xs text-muted-foreground">{label}</div>
      <div className="text-2xl font-bold">{value.toLocaleString()}</div>
    </Card>
  );
}

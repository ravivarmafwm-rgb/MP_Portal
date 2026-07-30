import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertCircle, Search } from "lucide-react";
import { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchVolunteerActivities } from "@/lib/api";
export const Route = createFileRoute("/_app/volunteers/activity")({
  component: ActivityPage,
});
function ActivityPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const q = useQuery({
    queryKey: ["volunteer-activities", search, page],
    queryFn: () => fetchVolunteerActivities({ search, page, per_page: 20 }),
  });
  return (
    <>
      <PageHeader
        title="Volunteer Activity"
        description="Persisted field activities recorded by volunteers."
      />
      <div className="space-y-4 p-4 md:p-8">
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
              placeholder="Search activity title or description"
            />
          </div>
        </Card>
        {q.isLoading && <Loading />}
        {q.isError && (
          <State text="Volunteer activities could not be loaded." />
        )}
        {q.data && (
          <Card className="divide-y">
            {q.data.data.map((a) => (
              <div key={a.id} className="grid gap-2 p-4 text-sm md:grid-cols-5">
                <Link
                  to="/volunteers/profile"
                  search={{ id: a.volunteer.id }}
                  className="font-medium text-primary"
                >
                  {a.volunteer.first_name} {a.volunteer.last_name}
                </Link>
                <span>{a.title}</span>
                <span>
                  {new Date(a.activity_date).toLocaleDateString("en-IN")}
                </span>
                <span>{Number(a.hours_spent)} hours</span>
                <Badge variant="secondary" className="w-fit capitalize">
                  {a.status}
                </Badge>
              </div>
            ))}
            {!q.data.data.length && <Empty />}
          </Card>
        )}
        {q.data && q.data.meta.last_page > 1 && (
          <Pager page={page} last={q.data.meta.last_page} setPage={setPage} />
        )}
      </div>
    </>
  );
}
function Loading() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 8 }).map((_, i) => (
        <Skeleton key={i} className="h-12" />
      ))}
    </div>
  );
}
function State({ text }: { text: string }) {
  return (
    <div className="py-16 text-center text-muted-foreground">
      <AlertCircle className="mx-auto mb-2" />
      {text}
    </div>
  );
}
function Empty() {
  return (
    <div className="p-10 text-center text-sm text-muted-foreground">
      No activities match the search.
    </div>
  );
}
function Pager({
  page,
  last,
  setPage,
}: {
  page: number;
  last: number;
  setPage: (n: number) => void;
}) {
  return (
    <div className="flex justify-between">
      <span>
        Page {page} of {last}
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
          disabled={page === last}
          onClick={() => setPage(page + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

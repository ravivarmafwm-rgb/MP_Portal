import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertCircle, Trophy } from "lucide-react";
import { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchVolunteerPerformance } from "@/lib/api";
export const Route = createFileRoute("/_app/volunteers/performance")({
  component: PerformancePage,
});
function PerformancePage() {
  const [page, setPage] = useState(1);
  const q = useQuery({
    queryKey: ["volunteer-performance", page],
    queryFn: () => fetchVolunteerPerformance({ page, per_page: 20 }),
  });
  return (
    <>
      <PageHeader
        title="Volunteer Performance"
        description="Recorded evaluation periods and scores. Rankings are based only on persisted evaluations."
      />
      <div className="space-y-4 p-4 md:p-8">
        {q.isLoading && (
          <div className="space-y-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-16" />
            ))}
          </div>
        )}
        {q.isError && (
          <div className="py-16 text-center text-muted-foreground">
            <AlertCircle className="mx-auto mb-2" />
            Performance evaluations could not be loaded.
          </div>
        )}
        {q.data && (
          <Card className="divide-y">
            {q.data.data.map((p, index) => (
              <div
                key={p.id}
                className="grid items-center gap-3 p-4 text-sm md:grid-cols-[50px_1.5fr_1fr_1fr_1fr]"
              >
                <div className="grid h-8 w-8 place-items-center rounded-full bg-primary/10 font-bold">
                  {index + 1 + (page - 1) * 20}
                </div>
                <Link
                  to="/volunteers/profile"
                  search={{ id: p.volunteer.id }}
                  className="font-medium text-primary"
                >
                  {p.volunteer.first_name} {p.volunteer.last_name}
                </Link>
                <span>{p.evaluation_period}</span>
                <div>
                  <div className="mb-1 flex justify-between">
                    <span>Overall</span>
                    <span>{p.overall_score}</span>
                  </div>
                  <Progress value={Number(p.overall_score)} className="h-2" />
                </div>
                <Badge variant="secondary" className="w-fit">
                  {p.rating ?? "Not rated"}
                </Badge>
              </div>
            ))}
            {!q.data.data.length && (
              <div className="p-10 text-center text-sm text-muted-foreground">
                <Trophy className="mx-auto mb-2" />
                No performance evaluations are recorded.
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

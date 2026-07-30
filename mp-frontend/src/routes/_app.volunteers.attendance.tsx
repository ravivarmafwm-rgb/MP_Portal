import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertCircle } from "lucide-react";
import { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchVolunteerAttendance } from "@/lib/api";
export const Route = createFileRoute("/_app/volunteers/attendance")({
  component: AttendancePage,
});
function AttendancePage() {
  const [date, setDate] = useState("");
  const [page, setPage] = useState(1);
  const q = useQuery({
    queryKey: ["volunteer-attendance", date, page],
    queryFn: () =>
      fetchVolunteerAttendance({
        ...(date ? { date } : {}),
        page,
        per_page: 20,
      }),
  });
  return (
    <>
      <PageHeader
        title="Volunteer Attendance"
        description="Recorded check-ins, check-outs, locations and worked hours."
      />
      <div className="space-y-4 p-4 md:p-8">
        <Card className="p-4">
          <Input
            type="date"
            value={date}
            onChange={(e) => {
              setDate(e.target.value);
              setPage(1);
            }}
            className="max-w-xs"
          />
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
            Attendance could not be loaded.
          </div>
        )}
        {q.data && (
          <Card className="divide-y">
            {q.data.data.map((a) => (
              <div key={a.id} className="grid gap-2 p-4 text-sm md:grid-cols-6">
                <Link
                  to="/volunteers/profile"
                  search={{ id: a.volunteer.id }}
                  className="font-medium text-primary"
                >
                  {a.volunteer.first_name} {a.volunteer.last_name}
                </Link>
                <span>
                  {new Date(a.attendance_date).toLocaleDateString("en-IN")}
                </span>
                <Badge variant="secondary" className="w-fit capitalize">
                  {a.status}
                </Badge>
                <span>
                  {a.check_in
                    ? new Date(a.check_in).toLocaleTimeString("en-IN")
                    : "No check-in"}
                </span>
                <span>{Number(a.hours_worked)} hours</span>
                <span>{a.location ?? "No location"}</span>
              </div>
            ))}
            {!q.data.data.length && (
              <div className="p-10 text-center text-sm text-muted-foreground">
                No attendance records found.
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

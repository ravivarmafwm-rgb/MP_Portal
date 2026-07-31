import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AlertCircle, CheckCircle2, MapPin, Search } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  checkInVolunteerVisit,
  completeVolunteerVisit,
  fetchVolunteerVisits,
  getApiErrorMessage,
  type VolunteerVisitRecord,
} from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { VolunteerVisitCreateDialog } from "@/components/volunteers/VolunteerVisitCreateDialog";

export const Route = createFileRoute("/_app/volunteers/visits")({
  component: VolunteerVisitsPage,
});
function VolunteerVisitsPage() {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [attachments, setAttachments] = useState<File[]>([]);
  const client = useQueryClient();
  const q = useQuery({
    queryKey: ["volunteer-visits", search, status, page],
    queryFn: () => fetchVolunteerVisits({ search, status, page, per_page: 20 }),
  });
  const checkin = useMutation({
    mutationFn: (visit: VolunteerVisitRecord) =>
      new Promise<VolunteerVisitRecord>((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(
          (p) =>
            checkInVolunteerVisit(visit.id, {
              latitude: p.coords.latitude,
              longitude: p.coords.longitude,
            })
              .then(resolve)
              .catch(reject),
          () =>
            reject(new Error("Location permission is required to check in.")),
        ),
      ),
    onSuccess: () => {
      toast.success("Visit checked in.");
      client.invalidateQueries({ queryKey: ["volunteer-visits"] });
    },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  });
  const complete = useMutation({
    mutationFn: ({
      visit,
      outcome,
    }: {
      visit: VolunteerVisitRecord;
      outcome: string;
    }) =>
      new Promise<VolunteerVisitRecord>((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(
          (p) => {
            const form = new FormData();
            form.append("latitude", String(p.coords.latitude));
            form.append("longitude", String(p.coords.longitude));
            form.append("outcome", outcome);
            attachments.forEach((file) => form.append("attachments[]", file));
            completeVolunteerVisit(visit.id, form).then(resolve).catch(reject);
          },
          () =>
            reject(
              new Error(
                "Location permission is required to complete the visit.",
              ),
            ),
        ),
      ),
    onSuccess: () => {
      toast.success("Visit completed.");
      client.invalidateQueries({ queryKey: ["volunteer-visits"] });
    },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  });
  return (
    <>
      <PageHeader
        title="Volunteer Visits"
        description="Assigned household and citizen field visits."
        actions={
          user?.role_slug !== "volunteer" ? (
            <VolunteerVisitCreateDialog />
          ) : undefined
        }
      />
      <div className="space-y-4 p-4 md:p-8">
        <Card className="flex flex-wrap gap-3 p-4">
          <div className="relative min-w-[240px] flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-9"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search citizen, notes or outcome"
            />
          </div>
          <select
            className="h-10 rounded-md border bg-background px-3 text-sm"
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
          >
            <option value="">All statuses</option>
            {[
              "assigned",
              "accepted",
              "checked_in",
              "completed",
              "missed",
              "cancelled",
            ].map((s) => (
              <option key={s} value={s}>
                {s.replace("_", " ")}
              </option>
            ))}
          </select>
          {user?.role_slug === "volunteer" && (
            <Input
              type="file"
              accept="image/jpeg,image/png,image/webp,application/pdf"
              multiple
              onChange={(e) =>
                setAttachments(Array.from(e.target.files ?? []).slice(0, 5))
              }
              className="max-w-xs"
            />
          )}
        </Card>
        {q.isLoading && (
          <div className="space-y-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-16" />
            ))}
          </div>
        )}
        {q.isError && (
          <State text="Visits could not be loaded or you do not have permission." />
        )}
        {q.data && (
          <Card className="divide-y">
            {q.data.data.map((visit) => (
              <div
                key={visit.id}
                className="flex flex-wrap items-center justify-between gap-3 p-4 text-sm"
              >
                <div>
                  <Link
                    to="/volunteers/visits/$id"
                    params={{ id: visit.id }}
                    className="font-medium text-primary"
                  >
                    {visit.citizen
                      ? `${visit.citizen.first_name} ${visit.citizen.last_name}`
                      : (visit.family?.head_of_family_name ??
                        "Household visit")}
                  </Link>
                  <p className="text-muted-foreground">
                    {visit.visit_type} ·{" "}
                    {visit.scheduled_at
                      ? new Date(visit.scheduled_at).toLocaleString("en-IN")
                      : "Unscheduled"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="capitalize">
                    {visit.status.replace("_", " ")}
                  </Badge>
                  {visit.status === "assigned" &&
                    user?.role_slug === "volunteer" && (
                      <Button
                        size="sm"
                        onClick={() => checkin.mutate(visit)}
                        disabled={checkin.isPending}
                      >
                        <MapPin className="mr-1 h-4 w-4" />
                        Check in
                      </Button>
                    )}
                  {visit.status === "checked_in" &&
                    user?.role_slug === "volunteer" && (
                      <Button
                        size="sm"
                        onClick={() => {
                          const outcome = window.prompt(
                            "Describe the visit outcome:",
                          );
                          if (outcome?.trim())
                            complete.mutate({ visit, outcome: outcome.trim() });
                        }}
                        disabled={complete.isPending}
                      >
                        <CheckCircle2 className="mr-1 h-4 w-4" />
                        Complete
                      </Button>
                    )}
                </div>
              </div>
            ))}
            {!q.data.data.length && (
              <div className="p-10 text-center text-sm text-muted-foreground">
                No visits match the filters.
              </div>
            )}
          </Card>
        )}
        {q.data && q.data.meta.last_page > 1 && (
          <div className="flex justify-between">
            <Button
              variant="outline"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              Previous
            </Button>
            <span>
              Page {page} of {q.data.meta.last_page}
            </span>
            <Button
              variant="outline"
              disabled={page === q.data.meta.last_page}
              onClick={() => setPage(page + 1)}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </>
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

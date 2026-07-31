import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle, History, MapPin } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  deleteVolunteerVisitAttachment,
  downloadVolunteerVisitAttachment,
  fetchVolunteerVisit,
  fetchVolunteers,
  updateVolunteerVisit,
  getApiErrorMessage,
  previewVolunteerVisitAttachment,
} from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";

type VolunteerOption = {
  id: string;
  volunteer_id: string;
  first_name: string;
  last_name: string;
};

export const Route = createFileRoute("/_app/volunteers/visits/$id")({
  component: VisitDetailPage,
});

function VisitDetailPage() {
  const { id } = Route.useParams();
  const q = useQuery({
    queryKey: ["volunteer-visit", id],
    queryFn: () => fetchVolunteerVisit(id),
  });
  const client = useQueryClient();
  const { user } = useAuth();
  const staff = user?.role_slug !== "volunteer";
  const volunteers = useQuery({
    queryKey: ["visit-detail-volunteers"],
    queryFn: () => fetchVolunteers({ per_page: 100 }),
    enabled: staff,
  });
  const update = useMutation({
    mutationFn: (data: Record<string, unknown>) =>
      updateVolunteerVisit(id, data),
    onSuccess: () => {
      toast.success("Visit updated.");
      client.invalidateQueries({ queryKey: ["volunteer-visit", id] });
      client.invalidateQueries({ queryKey: ["volunteer-visits"] });
    },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  });
  const removeAttachment = useMutation({
    mutationFn: (index: number) => deleteVolunteerVisitAttachment(id, index),
    onSuccess: () => {
      toast.success("Attachment deleted.");
      client.invalidateQueries({ queryKey: ["volunteer-visit", id] });
    },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  });
  if (q.isLoading)
    return (
      <div className="space-y-3 p-8">
        <Skeleton className="h-12" />
        <Skeleton className="h-48" />
      </div>
    );
  if (q.isError || !q.data)
    return (
      <div className="py-16 text-center text-muted-foreground">
        <AlertCircle className="mx-auto mb-2" />
        Visit could not be loaded.
      </div>
    );
  const v = q.data;
  return (
    <>
      <PageHeader
        title="Visit detail"
        description={`${v.visit_type} field visit`}
      />
      <div className="grid gap-5 p-4 md:grid-cols-2 md:p-8">
        <Card className="space-y-3 p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Visit status</h2>
            <Badge variant="secondary" className="capitalize">
              {v.status.replace("_", " ")}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            {v.citizen
              ? `${v.citizen.first_name} ${v.citizen.last_name} (${v.citizen.unique_id})`
              : (v.family?.head_of_family_name ?? "Household visit")}
          </p>
          <p className="text-sm">
            Scheduled:{" "}
            {v.scheduled_at
              ? new Date(v.scheduled_at).toLocaleString("en-IN")
              : "Not scheduled"}
          </p>
          <p className="text-sm">{v.notes ?? "No notes recorded."}</p>
          <p className="text-sm">Outcome: {v.outcome ?? "Pending"}</p>
          {staff && (
            <div className="grid gap-2 sm:grid-cols-2">
              <select
                className="h-10 rounded-md border bg-background px-3 text-sm"
                value={v.volunteer?.id ?? ""}
                onChange={(e) =>
                  update.mutate({ volunteer_id: e.target.value })
                }
                disabled={update.isPending}
              >
                <option value="">Assign volunteer</option>
                {(volunteers.data?.data ?? []).map((vol: VolunteerOption) => (
                  <option key={vol.id} value={vol.id}>
                    {vol.first_name} {vol.last_name} ({vol.volunteer_id})
                  </option>
                ))}
              </select>
              <select
                className="h-10 rounded-md border bg-background px-3 text-sm capitalize"
                value={v.status}
                onChange={(e) => update.mutate({ status: e.target.value })}
                disabled={update.isPending}
              >
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
            </div>
          )}
          <div className="space-y-2">
            <div className="text-sm font-medium">Attachments</div>
            {v.attachments.length ? (
              v.attachments.map((a) => (
                <div key={a.index} className="flex items-center gap-2 text-sm">
                  <Button
                    variant="link"
                    size="sm"
                    onClick={() =>
                      previewVolunteerVisitAttachment(v.id, a.index)
                    }
                  >
                    Preview
                  </Button>
                  <Button
                    variant="link"
                    size="sm"
                    onClick={() =>
                      downloadVolunteerVisitAttachment(v.id, a.index)
                    }
                  >
                    Download
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeAttachment.mutate(a.index)}
                    disabled={removeAttachment.isPending}
                  >
                    Delete
                  </Button>
                </div>
              ))
            ) : (
              <p className="text-xs text-muted-foreground">No attachments.</p>
            )}
          </div>
          {(v.check_in_latitude || v.check_out_latitude) && (
            <p className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" />
              GPS captured for check-in/out
            </p>
          )}
        </Card>
        <Card className="p-5">
          <h2 className="mb-3 flex items-center gap-2 font-semibold">
            <History className="h-4 w-4" />
            Visit timeline
          </h2>
          <div className="space-y-3">
            {(v.activity_logs ?? []).map((log) => (
              <div key={log.id} className="border-l-2 pl-3 text-sm">
                <div className="font-medium capitalize">
                  {log.action.replaceAll("_", " ")}
                </div>
                <div className="text-xs text-muted-foreground">
                  {new Date(log.created_at).toLocaleString("en-IN")}
                </div>
              </div>
            ))}
            {!(v.activity_logs ?? []).length && (
              <p className="text-sm text-muted-foreground">
                No timeline events recorded.
              </p>
            )}
          </div>
        </Card>
      </div>
    </>
  );
}

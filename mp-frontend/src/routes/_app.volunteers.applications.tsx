import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Check, Loader2, UserCheck, X } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  fetchVolunteerApplications,
  reviewVolunteerApplication,
  type VolunteerApplicationRecord,
} from "@/lib/api";
import { toast } from "sonner";
import { RoleGuard } from "@/components/auth/RoleGuard";

export const Route = createFileRoute("/_app/volunteers/applications")({
  component: VolunteerApplicationsRoute,
});

function VolunteerApplicationsRoute() {
  return (
    <RoleGuard route="/volunteers/applications">
      <VolunteerApplicationsPage />
    </RoleGuard>
  );
}

function VolunteerApplicationsPage() {
  const [status, setStatus] = useState("pending");
  const [reviewing, setReviewing] = useState<VolunteerApplicationRecord>();
  const [decision, setDecision] = useState<"approved" | "rejected">("approved");
  const [notes, setNotes] = useState("");
  const client = useQueryClient();
  const query = useQuery({
    queryKey: ["volunteer-applications", status],
    queryFn: () => fetchVolunteerApplications({ status }),
  });
  const mutation = useMutation({
    mutationFn: () =>
      reviewVolunteerApplication(reviewing!.id, decision, notes || undefined),
    onSuccess: async (result) => {
      toast.success(result.message);
      setReviewing(undefined);
      setNotes("");
      await client.invalidateQueries({ queryKey: ["volunteer-applications"] });
    },
    onError: (error: unknown) =>
      toast.error(
        (error as { response?: { data?: { message?: string } } }).response?.data
          ?.message ?? "Review could not be saved",
      ),
  });
  const beginReview = (
    application: VolunteerApplicationRecord,
    nextDecision: "approved" | "rejected",
  ) => {
    setReviewing(application);
    setDecision(nextDecision);
    setNotes("");
  };

  return (
    <>
      <PageHeader
        title="Volunteer Applications"
        description="Review field-service applicants before any portal account is created."
      />
      <div className="space-y-5 p-4 md:p-8">
        <div className="flex gap-2">
          {["pending", "approved", "rejected"].map((value) => (
            <Button
              key={value}
              variant={status === value ? "default" : "outline"}
              size="sm"
              onClick={() => setStatus(value)}
              className="capitalize"
            >
              {value}
            </Button>
          ))}
        </div>
        {query.isLoading && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading applications
          </div>
        )}
        {query.isError && (
          <Card
            className="border-destructive/30 p-6 text-sm text-destructive"
            role="alert"
          >
            Applications could not be loaded. Check your permission and try
            again.
          </Card>
        )}
        {query.data?.data.length === 0 && (
          <Card className="p-8 text-center text-sm text-muted-foreground">
            No {status} volunteer applications.
          </Card>
        )}
        <div className="grid gap-4 lg:grid-cols-2">
          {query.data?.data.map((application) => (
            <Card key={application.id} className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-bold">
                    {application.first_name} {application.last_name}
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {application.email} · {application.mobile_number}
                  </p>
                </div>
                <Badge variant="outline" className="capitalize">
                  {application.status}
                </Badge>
              </div>
              <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-muted-foreground">Village</dt>
                  <dd className="font-medium">
                    {application.village?.name ?? "Not available"}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Date of birth</dt>
                  <dd className="font-medium">{application.date_of_birth}</dd>
                </div>
              </dl>
              <div className="mt-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Motivation
                </p>
                <p className="mt-1 text-sm leading-6">
                  {application.motivation}
                </p>
              </div>
              {application.status === "pending" && (
                <div className="mt-5 flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => beginReview(application, "approved")}
                  >
                    <Check className="mr-1 h-4 w-4" />
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => beginReview(application, "rejected")}
                  >
                    <X className="mr-1 h-4 w-4" />
                    Reject
                  </Button>
                </div>
              )}
            </Card>
          ))}
        </div>
        {reviewing && (
          <div
            className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4"
            role="dialog"
            aria-modal="true"
          >
            <Card className="w-full max-w-lg p-6">
              <div className="flex items-center gap-3">
                <UserCheck className="h-6 w-6 text-primary" />
                <div>
                  <h2 className="font-bold capitalize">
                    {decision} application
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {reviewing.first_name} {reviewing.last_name}
                  </p>
                </div>
              </div>
              <label className="mt-5 block text-sm font-medium">
                Review notes
              </label>
              <Textarea
                className="mt-2"
                rows={4}
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                placeholder={
                  decision === "rejected"
                    ? "Explain why the application is being rejected"
                    : "Optional onboarding notes"
                }
              />
              <div className="mt-5 flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setReviewing(undefined)}
                  disabled={mutation.isPending}
                >
                  Cancel
                </Button>
                <Button
                  variant={decision === "rejected" ? "destructive" : "default"}
                  onClick={() => mutation.mutate()}
                  disabled={
                    mutation.isPending ||
                    (decision === "rejected" && notes.trim().length < 5)
                  }
                >
                  {mutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Confirm
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </>
  );
}

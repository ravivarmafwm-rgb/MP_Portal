import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  ClipboardList,
  FileBadge,
  FileText,
  MessageSquareWarning,
  UserRound,
} from "lucide-react";
import { RoleGuard } from "@/components/auth/RoleGuard";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/card";
import {
  fetchMyCitizen,
  fetchMyFamily,
  fetchMyGrievances,
  fetchMySchemeApplications,
  getApiErrorMessage,
} from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { CitizenGrievanceFeedbackDialog } from "@/components/grievances/CitizenGrievanceFeedbackDialog";
import { CitizenGrievanceFilingDialog } from "@/components/grievances/CitizenGrievanceFilingDialog";
import { CitizenSchemeApplicationDialog } from "@/components/schemes/CitizenSchemeApplicationDialog";
import { CitizenSchemeDocumentUploadDialog } from "@/components/schemes/CitizenSchemeDocumentUploadDialog";
import { CitizenSchemeWithdrawalDialog } from "@/components/schemes/CitizenSchemeWithdrawalDialog";

export const Route = createFileRoute("/_app/citizen")({
  head: () => ({ meta: [{ title: "Citizen Portal — MP Platform" }] }),
  component: CitizenPortalPage,
});

function CitizenPortalPage() {
  const citizen = useQuery({
    queryKey: ["my-citizen"],
    queryFn: fetchMyCitizen,
  });
  const grievances = useQuery({
    queryKey: ["my-grievances"],
    queryFn: fetchMyGrievances,
  });
  const schemeApplications = useQuery({
    queryKey: ["my-scheme-applications"],
    queryFn: fetchMySchemeApplications,
  });
  const family = useQuery({
    queryKey: ["my-family"],
    queryFn: fetchMyFamily,
  });

  return (
    <RoleGuard route="/citizen">
      <PageHeader
        title="Citizen Portal"
        description="Access schemes, file grievances, and track your requests"
        actions={
          <div className="flex flex-wrap gap-2">
            <CitizenSchemeApplicationDialog />
            <CitizenGrievanceFilingDialog />
          </div>
        }
      />
      <div className="space-y-6 p-4 md:p-8">
        {citizen.isLoading && <Skeleton className="h-36 w-full" />}
        {citizen.isError && (
          <Card className="border-destructive/30 p-6 text-destructive">
            {getApiErrorMessage(citizen.error)}
          </Card>
        )}
        {citizen.data && (
          <Card className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center">
            <div className="grid h-12 w-12 place-items-center rounded-full bg-primary/10 text-primary">
              <UserRound className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <h2 className="font-display text-xl font-bold">
                {citizen.data.first_name} {citizen.data.last_name}
              </h2>
              <p className="text-sm text-muted-foreground">
                Citizen ID {citizen.data.unique_id} ·{" "}
                {citizen.data.mobile_number ?? "Mobile not recorded"}
              </p>
            </div>
          </Card>
        )}
        {family.isLoading ? (
          <Skeleton className="h-44 w-full" />
        ) : family.data ? (
          <Card className="p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="font-display text-lg font-bold">My Family</h3>
                <p className="text-sm text-muted-foreground">{family.data.family_id} · Head: {family.data.head_of_family_name}</p>
              </div>
              <Badge variant="outline">{family.data.members_count} members</Badge>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {family.data.family_members?.map((member) => (
                <div key={member.id} className="rounded-lg border p-3 text-sm">
                  <p className="font-medium">{member.citizen.first_name} {member.citizen.last_name}</p>
                  <p className="text-xs text-muted-foreground">{member.relationship_with_head} · {member.citizen.gender}</p>
                  <Link className="mt-2 inline-block text-xs text-primary hover:underline" to="/citizens/profile" search={{ id: member.citizen.id }}>View profile</Link>
                </div>
              ))}
            </div>
          </Card>
        ) : family.isError ? (
          <Card className="border-dashed p-6 text-sm text-muted-foreground">Your account is not linked to a family yet.</Card>
        ) : null}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="p-6">
            <FileBadge className="h-8 w-8 text-primary mb-3" />
            <h3 className="font-bold">Scheme applications</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {citizen.data?.counts.scheme_applications ?? 0} applications
              linked to your verified profile
            </p>
          </Card>
          <Card className="p-6">
            <MessageSquareWarning className="h-8 w-8 text-destructive mb-3" />
            <h3 className="font-bold">Your grievances</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {citizen.data?.counts.grievances ?? 0} grievances linked to your
              verified profile
            </p>
          </Card>
          <Card className="p-6">
            <ClipboardList className="h-8 w-8 text-success mb-3" />
            <h3 className="font-bold">Survey responses</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {citizen.data?.counts.survey_responses ?? 0} responses associated
              with your profile
            </p>
          </Card>
          <Card className="p-6">
            <FileText className="h-8 w-8 text-amber-600 mb-3" />
            <h3 className="font-bold">Documents</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {citizen.data?.counts.documents ?? 0} secured documents associated
              with your profile
            </p>
          </Card>
        </div>
        <Card className="p-6">
          <h3 className="font-display text-lg font-bold">Your grievances</h3>
          <p className="text-sm text-muted-foreground">
            Live cases linked to your verified citizen identity.
          </p>
          {grievances.isLoading ? (
            <Skeleton className="mt-4 h-24 w-full" />
          ) : grievances.isError ? (
            <div className="mt-4 text-sm text-destructive">
              {getApiErrorMessage(grievances.error)}
            </div>
          ) : grievances.data?.data.length ? (
            <div className="mt-4 space-y-3">
              {grievances.data.data.map((grievance) => (
                <div
                  key={grievance.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-lg border p-4"
                >
                  <div>
                    <div className="font-medium">
                      {grievance.subject ?? grievance.grievance_number}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {grievance.grievance_number} ·{" "}
                      {new Date(grievance.created_at).toLocaleDateString()}
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {grievance.assigned_department?.name
                        ? `Department: ${grievance.assigned_department.name}`
                        : "Awaiting department assignment"}
                      {grievance.due_date
                        ? ` · Target: ${new Date(grievance.due_date).toLocaleDateString()}`
                        : ""}
                    </div>
                    {grievance.resolution_summary && (
                      <p className="mt-2 text-sm">
                        Resolution: {grievance.resolution_summary}
                      </p>
                    )}
                    {grievance.updates?.length ? (
                      <div className="mt-3 space-y-1 border-l-2 pl-3">
                        {grievance.updates.slice(0, 3).map((update) => (
                          <div key={update.id} className="text-xs">
                            <span className="font-medium">
                              {update.to_status?.replace("_", " ") ??
                                update.update_type.replaceAll("_", " ")}
                            </span>
                            {update.remarks ? ` — ${update.remarks}` : ""}
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">
                      {grievance.status.replace("_", " ")}
                    </Badge>
                    {["resolved", "closed"].includes(grievance.status) && (
                      <CitizenGrievanceFeedbackDialog
                        grievanceId={grievance.id}
                        hasFeedback={Boolean(grievance.feedback?.length)}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-4 text-sm text-muted-foreground">
              No grievances are linked to your account.
            </div>
          )}
        </Card>
        <Card className="p-6">
          <h3 className="font-display text-lg font-bold">
            Your scheme applications
          </h3>
          <p className="text-sm text-muted-foreground">
            Live applications submitted using your verified citizen identity.
          </p>
          {schemeApplications.isLoading ? (
            <Skeleton className="mt-4 h-24 w-full" />
          ) : schemeApplications.isError ? (
            <div className="mt-4 text-sm text-destructive">
              {getApiErrorMessage(schemeApplications.error)}
            </div>
          ) : schemeApplications.data?.data.length ? (
            <div className="mt-4 space-y-3">
              {schemeApplications.data.data.map((application) => (
                <div
                  key={application.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-lg border p-4"
                >
                  <div>
                    <div className="font-medium">{application.scheme.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {application.application_number} ·{" "}
                      {new Date(
                        application.application_date,
                      ).toLocaleDateString()}
                    </div>
                    {application.rejection_reason && (
                      <p className="mt-1 text-xs text-destructive">
                        {application.rejection_reason}
                      </p>
                    )}
                    {application.pending_reason && (
                      <p className="mt-2 text-sm">Pending reason: {application.pending_reason}</p>
                    )}
                    {application.application_source === "volunteer" && (
                      <p className="mt-1 text-xs text-muted-foreground">Submitted with volunteer assistance.</p>
                    )}
                    {application.benefit_disbursements?.map((benefit) => (
                      <div
                        key={benefit.id}
                        className="mt-2 text-xs text-muted-foreground"
                      >
                        Benefit ₹
                        {Number(benefit.amount).toLocaleString("en-IN")} ·{" "}
                        {benefit.status}
                        {benefit.account_number_masked
                          ? ` · Account ${benefit.account_number_masked}`
                          : ""}
                        {benefit.failure_reason
                          ? ` · ${benefit.failure_reason}`
                          : ""}
                      </div>
                    ))}
                  </div>
                  <Badge variant="secondary" className="capitalize">
                    {application.status.replaceAll("_", " ")}
                  </Badge>
                  <CitizenSchemeDocumentUploadDialog
                    application={application}
                  />
                  {["submitted", "under_review"].includes(
                    application.status,
                  ) && (
                    <CitizenSchemeWithdrawalDialog
                      applicationId={application.id}
                    />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-4 text-sm text-muted-foreground">
              No scheme applications are linked to your account.
            </div>
          )}
        </Card>
      </div>
    </RoleGuard>
  );
}

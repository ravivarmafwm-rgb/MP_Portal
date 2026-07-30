import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AlertCircle,
  FileText,
  History,
  IndianRupee,
  User,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetchSchemeApplication } from "@/lib/api";

export const Route = createFileRoute("/_app/schemes/application-detail")({
  validateSearch: (search: Record<string, unknown>) => ({
    id: typeof search.id === "string" ? search.id : undefined,
  }),
  component: ApplicationDetail,
});

function ApplicationDetail() {
  const { id } = Route.useSearch();
  const query = useQuery({
    queryKey: ["scheme-application", id],
    queryFn: () => fetchSchemeApplication(id!),
    enabled: Boolean(id),
  });
  if (!id)
    return <State text="Select an application from the applications list." />;
  if (query.isLoading)
    return (
      <div className="space-y-3 p-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-20" />
        ))}
      </div>
    );
  if (query.isError)
    return (
      <State text="The application could not be loaded or you do not have access to it." />
    );
  const application = query.data!;
  return (
    <>
      <PageHeader
        title={`Application ${application.application_number}`}
        description={`${application.scheme?.name ?? "Scheme unavailable"} · ${application.applicant_name}`}
        actions={
          <Button asChild variant="outline">
            <Link to="/schemes/applications">Back to applications</Link>
          </Button>
        }
      />
      <div className="space-y-5 p-4 md:p-8">
        <Card className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-4">
          <Info label="Applicant" value={application.applicant_name} />
          <Info label="Mobile" value={application.applicant_mobile} />
          <Info
            label="Village"
            value={application.village?.name ?? "Not recorded"}
          />
          <div>
            <div className="text-xs text-muted-foreground">Status</div>
            <Badge className="mt-1 capitalize" variant="secondary">
              {application.status.replaceAll("_", " ")}
            </Badge>
          </div>
          <Info
            label="Application date"
            value={new Date(application.application_date).toLocaleDateString(
              "en-IN",
            )}
          />
          <Info
            label="Sanctioned amount"
            value={
              application.sanctioned_amount
                ? `₹${Number(application.sanctioned_amount).toLocaleString("en-IN")}`
                : "Not sanctioned"
            }
          />
          <Info
            label="Payment status"
            value={
              application.payment_status?.replaceAll("_", " ") ?? "Not recorded"
            }
          />
          <Info
            label="Processed by"
            value={application.processed_by?.name ?? "Not processed"}
          />
        </Card>
        {(application.remarks || application.rejection_reason) && (
          <Card className="p-5">
            {application.remarks && (
              <div>
                <h2 className="font-medium">Remarks</h2>
                <p className="mt-1 whitespace-pre-wrap text-sm text-muted-foreground">
                  {application.remarks}
                </p>
              </div>
            )}
            {application.rejection_reason && (
              <div className="mt-4">
                <h2 className="font-medium text-destructive">
                  Rejection reason
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {application.rejection_reason}
                </p>
              </div>
            )}
          </Card>
        )}
        <Tabs defaultValue="documents">
          <TabsList>
            <TabsTrigger value="documents">
              <FileText className="mr-2 h-4 w-4" />
              Documents
            </TabsTrigger>
            <TabsTrigger value="benefits">
              <IndianRupee className="mr-2 h-4 w-4" />
              Benefits
            </TabsTrigger>
            <TabsTrigger value="audit">
              <History className="mr-2 h-4 w-4" />
              Audit
            </TabsTrigger>
          </TabsList>
          <TabsContent value="documents">
            <Card className="divide-y">
              {application.documents?.map((document) => (
                <div
                  key={document.id}
                  className="flex justify-between gap-3 p-4"
                >
                  <div>
                    <div className="font-medium">{document.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {document.original_name}
                    </div>
                  </div>
                  <Badge variant="secondary">{document.mime_type}</Badge>
                </div>
              ))}
              {!application.documents?.length && (
                <Empty text="No documents are attached to this application." />
              )}
            </Card>
          </TabsContent>
          <TabsContent value="benefits">
            <Card className="divide-y">
              {application.benefit_disbursements?.map((payment) => (
                <div
                  key={payment.id}
                  className="grid gap-1 p-4 text-sm sm:grid-cols-4"
                >
                  <span className="font-medium">
                    ₹{Number(payment.amount).toLocaleString("en-IN")}
                  </span>
                  <span>
                    {new Date(payment.disbursement_date).toLocaleDateString(
                      "en-IN",
                    )}
                  </span>
                  <span className="capitalize">{payment.status}</span>
                  <span>{payment.transaction_id ?? "No transaction ID"}</span>
                </div>
              ))}
              {!application.benefit_disbursements?.length && (
                <Empty text="No benefit disbursements are recorded." />
              )}
            </Card>
          </TabsContent>
          <TabsContent value="audit">
            <Card className="divide-y">
              {application.activity_logs?.map((entry) => (
                <div key={entry.id} className="p-4">
                  <div className="flex justify-between gap-3">
                    <span className="font-medium capitalize">
                      {entry.action.replaceAll("_", " ")}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(entry.created_at).toLocaleString("en-IN")}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {entry.description}
                  </p>
                  <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                    <User className="h-3 w-3" />
                    {entry.user?.name ?? "System"}
                  </p>
                </div>
              ))}
              {!application.activity_logs?.length && (
                <Empty text="No audit events are recorded for this application." />
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-1 font-medium capitalize">{value}</div>
    </div>
  );
}
function Empty({ text }: { text: string }) {
  return (
    <div className="p-10 text-center text-sm text-muted-foreground">{text}</div>
  );
}
function State({ text }: { text: string }) {
  return (
    <div className="grid min-h-[50vh] place-items-center p-8 text-center text-muted-foreground">
      <div>
        <AlertCircle className="mx-auto mb-3 h-8 w-8" />
        {text}
      </div>
    </div>
  );
}

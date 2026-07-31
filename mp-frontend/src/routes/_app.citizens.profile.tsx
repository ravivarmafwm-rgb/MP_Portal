import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  AlertCircle,
  CalendarDays,
  FileBadge,
  FileText,
  History,
  MapPin,
  MessageSquareWarning,
  Building2,
  User,
  Users,
  Trash2,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  deleteCitizen,
  deleteCitizenAddress,
  fetchCitizen,
  getApiErrorMessage,
} from "@/lib/api";
import { CitizenEditDialog } from "@/components/citizens/CitizenEditDialog";
import { CitizenAddressDialog } from "@/components/citizens/CitizenAddressDialog";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/citizens/profile")({
  validateSearch: (search: Record<string, unknown>) => ({
    id: typeof search.id === "string" ? search.id : undefined,
  }),
  component: CitizenProfilePage,
});

function CitizenProfilePage() {
  const { id } = Route.useSearch();
  const { user } = useAuth();
  const navigate = useNavigate();
  const canUpdate = [
    "super-admin",
    "mp-staff",
    "constituency-coordinator",
    "assembly-coordinator",
    "mandal-coordinator",
    "village-coordinator",
  ].includes(user?.role_slug ?? "");
  const archive = useMutation({
    mutationFn: deleteCitizen,
    onSuccess: async () => {
      toast.success("Citizen record archived.");
      await navigate({ to: "/citizens/list" });
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
  const archiveAddress = useMutation({
    mutationFn: (addressId: string) => deleteCitizenAddress(id!, addressId),
    onSuccess: async () => {
      toast.success("Address archived.");
      await query.refetch();
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
  const query = useQuery({
    queryKey: ["citizen", id],
    queryFn: () => fetchCitizen(id!),
    enabled: Boolean(id),
  });
  if (!id) return <State text="Select a citizen from the citizen directory." />;
  if (query.isLoading)
    return (
      <div className="space-y-3 p-8">
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton key={i} className="h-20" />
        ))}
      </div>
    );
  if (query.isError)
    return (
      <State text="The citizen could not be loaded or is outside your assigned area." />
    );
  const citizen = query.data!;
  const name = [citizen.first_name, citizen.middle_name, citizen.last_name]
    .filter(Boolean)
    .join(" ");
  const primary =
    citizen.addresses.find((address) => address.address_type === "permanent") ??
    citizen.addresses[0];
  return (
    <>
      <PageHeader
        title={name}
        description={`Citizen ID ${citizen.unique_id}`}
        actions={
          <>
            {canUpdate && <CitizenEditDialog citizen={citizen} />}
            {user?.role_slug === "super-admin" && (
              <Button
                variant="destructive"
                disabled={archive.isPending}
                onClick={() => {
                  if (
                    window.confirm(
                      "Archive this citizen? Records with linked operational history cannot be archived.",
                    )
                  )
                    archive.mutate(citizen.id);
                }}
              >
                <Trash2 className="h-4 w-4" /> Archive
              </Button>
            )}
            <Button asChild variant="outline">
              <Link to="/citizens/list">Back to directory</Link>
            </Button>
          </>
        }
      />
      <div className="space-y-5 p-4 md:p-8">
        <Card className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-4">
          <Info
            label="Mobile"
            value={citizen.mobile_number ?? "Not recorded"}
          />
          <Info label="Gender" value={citizen.gender} />
          <Info
            label="Date of birth"
            value={
              citizen.date_of_birth
                ? new Date(citizen.date_of_birth).toLocaleDateString("en-IN")
                : "Not recorded"
            }
          />
          <Info
            label="Aadhaar"
            value={citizen.aadhaar_masked ?? "Not recorded"}
          />
          <Info label="Voter ID" value={citizen.voter_id ?? "Not recorded"} />
          <Info
            label="Occupation"
            value={citizen.occupation ?? "Not recorded"}
          />
          <Info label="Education" value={citizen.education ?? "Not recorded"} />
          <Info label="Email" value={citizen.email ?? "Not recorded"} />
        </Card>
        <Card className="p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="flex items-center gap-2 font-semibold">
              <MapPin className="h-4 w-4" />
              Addresses
            </h2>
            {canUpdate && <CitizenAddressDialog citizenId={citizen.id} />}
          </div>
          <div className="mt-3 divide-y">
            {citizen.addresses.map((address) => (
              <div
                key={address.id}
                className="flex flex-wrap items-start justify-between gap-3 py-3 text-sm"
              >
                <div>
                  <div className="flex items-center gap-2 font-medium">
                    {address.address_type}
                    <Badge variant={address.is_primary ? "default" : "outline"}>
                      {address.is_primary ? "Primary" : "History"}
                    </Badge>
                  </div>
                  <p className="mt-1 text-muted-foreground">
                    {[
                      address.house_number,
                      address.street,
                      address.locality,
                      address.ward?.name,
                      address.village?.name,
                      address.village?.mandal?.name,
                      address.pincode,
                      address.district,
                      address.state,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                </div>
                {canUpdate && (
                  <div className="flex gap-2">
                    <CitizenAddressDialog
                      citizenId={citizen.id}
                      address={address}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={archiveAddress.isPending}
                      onClick={() => {
                        if (window.confirm("Archive this address?"))
                          archiveAddress.mutate(address.id);
                      }}
                    >
                      Archive
                    </Button>
                  </div>
                )}
              </div>
            ))}
            {!citizen.addresses.length && (
              <Empty text="No address is recorded." />
            )}
          </div>
        </Card>
        <Tabs defaultValue="schemes">
          <TabsList className="flex flex-wrap">
            <TabsTrigger value="schemes">
              <FileBadge className="mr-1 h-4 w-4" />
              Schemes
            </TabsTrigger>
            <TabsTrigger value="grievances">
              <MessageSquareWarning className="mr-1 h-4 w-4" />
              Grievances
            </TabsTrigger>
            <TabsTrigger value="families">
              <Users className="mr-1 h-4 w-4" />
              Families
            </TabsTrigger>
            <TabsTrigger value="appointments">
              <CalendarDays className="mr-1 h-4 w-4" />
              Appointments
            </TabsTrigger>
            <TabsTrigger value="projects">
              <Building2 className="mr-1 h-4 w-4" />
              Projects
            </TabsTrigger>
            <TabsTrigger value="documents">
              <FileText className="mr-1 h-4 w-4" />
              Documents
            </TabsTrigger>
            <TabsTrigger value="history">
              <History className="mr-1 h-4 w-4" />
              History
            </TabsTrigger>
          </TabsList>
          <TabsContent value="schemes">
            <Card className="divide-y">
              {citizen.scheme_applications.map((item) => (
                <div
                  key={item.id}
                  className="grid gap-2 p-4 text-sm sm:grid-cols-4"
                >
                  <Link
                    to="/schemes/application-detail"
                    search={{ id: item.id }}
                    className="font-medium text-primary hover:underline"
                  >
                    {item.application_number}
                  </Link>
                  <span>{item.scheme?.name ?? "Scheme unavailable"}</span>
                  <span>
                    {new Date(item.application_date).toLocaleDateString(
                      "en-IN",
                    )}
                  </span>
                  <Badge variant="secondary" className="w-fit capitalize">
                    {item.status.replaceAll("_", " ")}
                  </Badge>
                </div>
              ))}
              {!citizen.scheme_applications.length && (
                <Empty text="No scheme applications are recorded." />
              )}
            </Card>
          </TabsContent>
          <TabsContent value="appointments">
            <Card className="divide-y">
              {citizen.appointments.map((item) => (
                <div
                  key={item.id}
                  className="grid gap-2 p-4 text-sm sm:grid-cols-4"
                >
                  <span className="font-mono text-xs">
                    {item.appointment_number}
                  </span>
                  <span className="font-medium">{item.purpose}</span>
                  <span>
                    {new Date(item.requested_date).toLocaleDateString("en-IN")}
                  </span>
                  <Badge variant="secondary" className="w-fit capitalize">
                    {item.status.replaceAll("_", " ")}
                  </Badge>
                </div>
              ))}
              {!citizen.appointments.length && (
                <Empty text="No appointment requests are recorded." />
              )}
            </Card>
          </TabsContent>
          <TabsContent value="projects">
            <Card className="divide-y">
              {citizen.related_projects.map((item) => (
                <div
                  key={item.id}
                  className="grid gap-2 p-4 text-sm sm:grid-cols-4"
                >
                  <span className="font-mono text-xs">
                    {item.project_number}
                  </span>
                  <span className="font-medium">{item.name}</span>
                  <span>{item.village?.name ?? "Village unavailable"}</span>
                  <Badge variant="secondary" className="w-fit capitalize">
                    {item.status.replaceAll("_", " ")}
                  </Badge>
                </div>
              ))}
              {!citizen.related_projects.length && (
                <Empty text="No projects are related to this citizen's address." />
              )}
            </Card>
          </TabsContent>
          <TabsContent value="grievances">
            <Card className="divide-y">
              {citizen.grievances.map((item) => (
                <div
                  key={item.id}
                  className="grid gap-2 p-4 text-sm sm:grid-cols-4"
                >
                  <span className="font-mono text-xs">
                    {item.grievance_number}
                  </span>
                  <span className="font-medium">{item.title}</span>
                  <span>{item.category?.name ?? "Uncategorized"}</span>
                  <Badge variant="secondary" className="w-fit capitalize">
                    {item.status.replaceAll("_", " ")}
                  </Badge>
                </div>
              ))}
              {!citizen.grievances.length && (
                <Empty text="No grievances are recorded." />
              )}
            </Card>
          </TabsContent>
          <TabsContent value="families">
            <div className="grid gap-4 md:grid-cols-2">
              {citizen.families.map((family) => (
                <Card key={family.id} className="p-4">
                  <div className="flex justify-between gap-2">
                    <div>
                      <h3 className="font-medium">
                        {family.head_of_family_name}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {family.family_id}
                      </p>
                    </div>
                    <Badge variant="outline">
                      {family.members_count} members
                    </Badge>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">
                    {family.village?.name ?? "Village not recorded"}
                  </p>
                </Card>
              ))}
              {!citizen.families.length && (
                <Empty text="No family relationship is recorded." />
              )}
            </div>
          </TabsContent>
          <TabsContent value="documents">
            <Card className="divide-y">
              {citizen.documents.map((item) => (
                <div key={item.id} className="flex justify-between gap-3 p-4">
                  <div>
                    <div className="font-medium">{item.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {item.original_name}
                    </div>
                  </div>
                  <Badge variant="secondary">
                    {item.category?.name ?? item.mime_type}
                  </Badge>
                </div>
              ))}
              {!citizen.documents.length && (
                <Empty text="No documents are recorded." />
              )}
            </Card>
          </TabsContent>
          <TabsContent value="history">
            <Card className="divide-y">
              {[
                ...citizen.activity_logs.map((item) => ({
                  id: item.id,
                  date: item.created_at,
                  title: item.description,
                  actor: item.user?.name ?? "System",
                })),
                ...citizen.interactions.map((item) => ({
                  id: item.id,
                  date: item.interaction_date,
                  title: item.subject,
                  actor: item.interaction_type,
                })),
              ]
                .sort((a, b) => b.date.localeCompare(a.date))
                .map((item) => (
                  <div key={item.id} className="p-4">
                    <div className="flex justify-between gap-3">
                      <span className="font-medium">{item.title}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(item.date).toLocaleString("en-IN")}
                      </span>
                    </div>
                    <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                      <User className="h-3 w-3" />
                      {item.actor}
                    </p>
                  </div>
                ))}
              {!citizen.activity_logs.length &&
                !citizen.interactions.length && (
                  <Empty text="No activity history is recorded." />
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
      <div className="mt-1 font-medium">{value}</div>
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

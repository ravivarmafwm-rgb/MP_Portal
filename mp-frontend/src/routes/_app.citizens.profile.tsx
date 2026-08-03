import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  AlertCircle, CalendarDays, FileBadge, FileText, History, MapPin,
  MessageSquareWarning, Building2, User, Users, Trash2, Phone, Mail,
  Heart, ShieldCheck, Vote, Accessibility, ClipboardList, BarChart3,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { deleteCitizen, deleteCitizenAddress, fetchCitizen, getApiErrorMessage } from "@/lib/api";
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

  const canUpdate = ["super-admin","mp-staff","constituency-coordinator",
    "assembly-coordinator","mandal-coordinator","village-coordinator"].includes(user?.role_slug ?? "");

  const archive = useMutation({
    mutationFn: deleteCitizen,
    onSuccess: async () => { toast.success("Citizen record archived."); await navigate({ to: "/citizens/list" }); },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  });
  const archiveAddress = useMutation({
    mutationFn: (addressId: string) => deleteCitizenAddress(id!, addressId),
    onSuccess: async () => { toast.success("Address archived."); await query.refetch(); },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  });

  const query = useQuery({
    queryKey: ["citizen", id],
    queryFn: () => fetchCitizen(id!),
    enabled: Boolean(id),
  });

  if (!id) return <State text="Select a citizen from the citizen directory." />;
  if (query.isLoading) return <div className="space-y-3 p-8">{Array.from({length:6}).map((_,i) => <Skeleton key={i} className="h-20" />)}</div>;
  if (query.isError) return <State text="The citizen could not be loaded or is outside your assigned area." />;

  const c = query.data!;
  const name = [c.first_name, c.middle_name, c.last_name].filter(Boolean).join(" ");

  return (
    <>
      <PageHeader
        title={name}
        description={`Citizen ID: ${c.unique_id}`}
        actions={
          <div className="flex flex-wrap gap-2">
            {canUpdate && <CitizenEditDialog citizen={c} />}
            {user?.role_slug === "super-admin" && (
              <Button variant="destructive" size="sm" disabled={archive.isPending}
                onClick={() => { if (window.confirm("Archive this citizen?")) archive.mutate(c.id); }}>
                <Trash2 className="h-4 w-4 mr-1" /> Archive
              </Button>
            )}
            <Button asChild variant="outline" size="sm"><Link to="/citizens/list">Back to List</Link></Button>
          </div>
        }
      />

      <div className="space-y-5 p-4 md:p-8">
        {/* Hero summary card */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Mobile" value={c.mobile_number ?? "—"} icon={Phone} />
          <StatCard label="Email" value={c.email ?? "—"} icon={Mail} />
          <StatCard label="Gender" value={c.gender} icon={User} />
          <StatCard label="Blood Group" value={c.blood_group ?? "—"} icon={Heart} />
        </div>

        <Tabs defaultValue="overview">
          <TabsList className="flex flex-wrap h-auto gap-1">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="personal">Personal</TabsTrigger>
            <TabsTrigger value="political"><Vote className="mr-1 h-3.5 w-3.5" />Political</TabsTrigger>
            <TabsTrigger value="address"><MapPin className="mr-1 h-3.5 w-3.5" />Address</TabsTrigger>
            <TabsTrigger value="family"><Users className="mr-1 h-3.5 w-3.5" />Family</TabsTrigger>
            <TabsTrigger value="documents"><FileText className="mr-1 h-3.5 w-3.5" />Documents</TabsTrigger>
            <TabsTrigger value="schemes"><FileBadge className="mr-1 h-3.5 w-3.5" />Schemes</TabsTrigger>
            <TabsTrigger value="grievances"><MessageSquareWarning className="mr-1 h-3.5 w-3.5" />Grievances</TabsTrigger>
            <TabsTrigger value="appointments"><CalendarDays className="mr-1 h-3.5 w-3.5" />Appointments</TabsTrigger>
            <TabsTrigger value="projects"><Building2 className="mr-1 h-3.5 w-3.5" />Projects</TabsTrigger>
            <TabsTrigger value="surveys"><ClipboardList className="mr-1 h-3.5 w-3.5" />Surveys</TabsTrigger>
            <TabsTrigger value="volunteer"><Users className="mr-1 h-3.5 w-3.5" />Volunteer</TabsTrigger>
            <TabsTrigger value="interactions"><MessageSquareWarning className="mr-1 h-3.5 w-3.5" />Interactions</TabsTrigger>
            <TabsTrigger value="history"><History className="mr-1 h-3.5 w-3.5" />Timeline</TabsTrigger>
            <TabsTrigger value="audit"><ShieldCheck className="mr-1 h-3.5 w-3.5" />Audit</TabsTrigger>
          </TabsList>

          {/* OVERVIEW */}
          <TabsContent value="overview" className="mt-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="p-5 space-y-3">
                <SectionTitle icon={User} title="Identity" />
                <InfoGrid>
                  <Info label="Full Name" value={name} />
                  <Info label="Aadhaar" value={c.aadhaar_masked ?? "Not recorded"} />
                  <Info label="Voter ID" value={c.voter_id ?? "Not recorded"} />
                  <Info label="Date of Birth" value={c.date_of_birth ? new Date(c.date_of_birth).toLocaleDateString("en-IN") : "Not recorded"} />
                </InfoGrid>
              </Card>
              <Card className="p-5 space-y-3">
                <SectionTitle icon={BarChart3} title="Activity Summary" />
                <InfoGrid>
                  <Info label="Scheme Applications" value={String(c.scheme_applications?.length ?? 0)} />
                  <Info label="Grievances" value={String(c.grievances?.length ?? 0)} />
                  <Info label="Survey Responses" value={String(c.survey_responses?.length ?? 0)} />
                  <Info label="Documents" value={String(c.documents?.length ?? 0)} />
                  <Info label="Appointments" value={String(c.appointments?.length ?? 0)} />
                  <Info label="Families" value={String(c.families?.length ?? 0)} />
                </InfoGrid>
              </Card>
            </div>
          </TabsContent>

          {/* PERSONAL */}
          <TabsContent value="personal" className="mt-4">
            <Card className="p-5 space-y-4">
              <SectionTitle icon={User} title="Personal Details" />
              <InfoGrid cols={3}>
                <Info label="First Name" value={c.first_name} />
                <Info label="Middle Name" value={c.middle_name ?? "—"} />
                <Info label="Last Name" value={c.last_name} />
                <Info label="Date of Birth" value={c.date_of_birth ? new Date(c.date_of_birth).toLocaleDateString("en-IN") : "—"} />
                <Info label="Gender" value={c.gender} />
                <Info label="Blood Group" value={c.blood_group ?? "—"} />
                <Info label="Marital Status" value={c.marital_status ?? "—"} />
                <Info label="Father's Name" value={c.father_name ?? "—"} />
                <Info label="Mother's Name" value={c.mother_name ?? "—"} />
                <Info label="Spouse Name" value={c.spouse_name ?? "—"} />
                <Info label="Mobile" value={c.mobile_number ?? "—"} />
                <Info label="Alt Mobile" value={c.alternate_mobile ?? "—"} />
                <Info label="Email" value={c.email ?? "—"} />
                <Info label="Occupation" value={c.occupation ?? "—"} />
                <Info label="Education" value={c.education ?? "—"} />
                <Info label="Disability" value={c.disability_status === "none" || !c.disability_status ? "None" : c.disability_status} />
                {c.disability_details && <Info label="Disability Details" value={c.disability_details} className="col-span-full" />}
              </InfoGrid>
              {c.is_deceased && (
                <div className="rounded-md border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive">
                  Deceased — Date of death: {c.date_of_death ? new Date(c.date_of_death).toLocaleDateString("en-IN") : "Not recorded"}
                </div>
              )}
            </Card>
          </TabsContent>

          {/* POLITICAL */}
          <TabsContent value="political" className="mt-4">
            <Card className="p-5 space-y-4">
              <SectionTitle icon={Vote} title="Political & Electoral Information" />
              <InfoGrid>
                <Info label="Is Voter" value={c.is_voter ? "Yes" : "No"} />
                <Info label="Voter ID (EPIC)" value={c.voter_id ?? "Not recorded"} />
                <Info label="Voter Status" value={c.voter_status ?? "—"} />
                <Info label="Aadhaar (Masked)" value={c.aadhaar_masked ?? "Not recorded"} />
              </InfoGrid>
              {c.addresses.length > 0 && (
                <div className="pt-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Constituency Assignment</p>
                  {c.addresses.filter(a => a.is_primary).map((addr) => (
                    <div key={addr.id} className="text-sm space-y-1">
                      <Info label="Village" value={addr.village?.name ?? "—"} />
                      <Info label="Mandal" value={addr.village?.mandal?.name ?? "—"} />
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </TabsContent>

          {/* ADDRESS */}
          <TabsContent value="address" className="mt-4">
            <Card className="p-5">
              <div className="flex items-center justify-between gap-3 mb-4">
                <SectionTitle icon={MapPin} title="Addresses" />
                {canUpdate && <CitizenAddressDialog citizenId={c.id} />}
              </div>
              <div className="divide-y">
                {c.addresses.map((addr) => (
                  <div key={addr.id} className="py-4 flex flex-wrap items-start justify-between gap-3">
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center gap-2 font-medium capitalize">
                        {addr.address_type}
                        {addr.is_primary && <Badge>Primary</Badge>}
                      </div>
                      <p className="text-muted-foreground">
                        {[addr.house_number, addr.street, addr.locality, addr.landmark,
                          addr.ward?.name, addr.village?.name, addr.village?.mandal?.name,
                          addr.pincode, addr.district, addr.state
                        ].filter(Boolean).join(", ")}
                      </p>
                    </div>
                    {canUpdate && (
                      <div className="flex gap-2">
                        <CitizenAddressDialog citizenId={c.id} address={addr} />
                        <Button variant="outline" size="sm" disabled={archiveAddress.isPending}
                          onClick={() => { if (window.confirm("Archive this address?")) archiveAddress.mutate(addr.id); }}>
                          Archive
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
                {!c.addresses.length && <Empty text="No address recorded." />}
              </div>
            </Card>
          </TabsContent>

          {/* FAMILY */}
          <TabsContent value="family" className="mt-4">
            <div className="grid gap-4 md:grid-cols-2">
              {c.families.map((fam) => (
                <Card key={fam.id} className="p-4 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="font-semibold">{fam.head_of_family_name}</p>
                      <p className="text-xs text-muted-foreground">{fam.family_id}</p>
                    </div>
                    <Badge variant="outline">{fam.members_count} members</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{fam.village?.name ?? "Village not recorded"}</p>
                  <Button asChild variant="outline" size="sm">
                    <Link to="/citizens/families">View Family</Link>
                  </Button>
                </Card>
              ))}
              {!c.families.length && <Empty text="No family relationship recorded." />}
            </div>
          </TabsContent>

          {/* DOCUMENTS */}
          <TabsContent value="documents" className="mt-4">
            <Card className="divide-y">
              {c.documents.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between gap-3 p-4">
                  <div>
                    <p className="font-medium text-sm">{doc.title}</p>
                    <p className="text-xs text-muted-foreground">{doc.original_name}</p>
                  </div>
                  <Badge variant="secondary">{doc.category?.name ?? doc.mime_type}</Badge>
                </div>
              ))}
              {!c.documents.length && <Empty text="No documents recorded." />}
            </Card>
          </TabsContent>

          {/* SCHEMES */}
          <TabsContent value="schemes" className="mt-4">
            <Card className="divide-y">
              {c.scheme_applications.map((item) => (
                <div key={item.id} className="grid gap-2 p-4 text-sm sm:grid-cols-4">
                  <Link to="/schemes/application-detail" search={{ id: item.id }} className="font-medium text-primary hover:underline">{item.application_number}</Link>
                  <span>{item.scheme?.name ?? "—"}</span>
                  <span>{new Date(item.application_date).toLocaleDateString("en-IN")}</span>
                  <Badge variant="secondary" className="w-fit capitalize">{item.status.replaceAll("_"," ")}</Badge>
                </div>
              ))}
              {!c.scheme_applications.length && <Empty text="No scheme applications recorded." />}
            </Card>
          </TabsContent>

          {/* GRIEVANCES */}
          <TabsContent value="grievances" className="mt-4">
            <Card className="divide-y">
              {c.grievances.map((item) => (
                <div key={item.id} className="grid gap-2 p-4 text-sm sm:grid-cols-4">
                  <span className="font-mono text-xs">{item.grievance_number}</span>
                  <span className="font-medium">{item.title}</span>
                  <span>{item.category?.name ?? "Uncategorized"}</span>
                  <Badge variant="secondary" className="w-fit capitalize">{item.status.replaceAll("_"," ")}</Badge>
                </div>
              ))}
              {!c.grievances.length && <Empty text="No grievances recorded." />}
            </Card>
          </TabsContent>

          {/* APPOINTMENTS */}
          <TabsContent value="appointments" className="mt-4">
            <Card className="divide-y">
              {c.appointments.map((item) => (
                <div key={item.id} className="grid gap-2 p-4 text-sm sm:grid-cols-4">
                  <span className="font-mono text-xs">{item.appointment_number}</span>
                  <span className="font-medium">{item.purpose}</span>
                  <span>{new Date(item.requested_date).toLocaleDateString("en-IN")}</span>
                  <Badge variant="secondary" className="w-fit capitalize">{item.status.replaceAll("_"," ")}</Badge>
                </div>
              ))}
              {!c.appointments.length && <Empty text="No appointments recorded." />}
            </Card>
          </TabsContent>

          {/* PROJECTS */}
          <TabsContent value="projects" className="mt-4">
            <Card className="divide-y">
              {c.related_projects.map((item) => (
                <div key={item.id} className="grid gap-2 p-4 text-sm sm:grid-cols-4">
                  <span className="font-mono text-xs">{item.project_number}</span>
                  <span className="font-medium">{item.name}</span>
                  <span>{item.village?.name ?? "—"}</span>
                  <Badge variant="secondary" className="w-fit capitalize">{item.status.replaceAll("_"," ")}</Badge>
                </div>
              ))}
              {!c.related_projects.length && <Empty text="No related projects in this citizen's address area." />}
            </Card>
          </TabsContent>

          {/* SURVEYS */}
          <TabsContent value="surveys" className="mt-4">
            <Card className="divide-y">
              {c.survey_responses.map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-3 p-4 text-sm">
                  <span className="font-medium">{item.survey?.title ?? "Survey"}</span>
                  <span className="text-muted-foreground">{new Date(item.response_date).toLocaleDateString("en-IN")}</span>
                </div>
              ))}
              {!c.survey_responses.length && <Empty text="No survey responses recorded." />}
            </Card>
          </TabsContent>

          <TabsContent value="volunteer" className="mt-4">
            <Card className="divide-y">
              {c.volunteer_visits.map((visit) => (
                <div key={visit.id} className="grid gap-2 p-4 text-sm sm:grid-cols-4">
                  <span className="font-medium capitalize">{visit.visit_type.replaceAll("_", " ")}</span>
                  <Badge variant="secondary" className="w-fit capitalize">{visit.status.replaceAll("_", " ")}</Badge>
                  <span>{visit.volunteer ? `${visit.volunteer.first_name ?? ""} ${visit.volunteer.last_name ?? ""}`.trim() : "Unassigned"}</span>
                  <span className="text-muted-foreground">{visit.scheduled_at ? new Date(visit.scheduled_at).toLocaleString("en-IN") : "Not scheduled"}</span>
                </div>
              ))}
              {!c.volunteer_visits.length && <Empty text="No volunteer visits recorded." />}
            </Card>
          </TabsContent>

          <TabsContent value="interactions" className="mt-4">
            <Card className="divide-y">
              {c.interactions.map((interaction) => (
                <div key={interaction.id} className="p-4 text-sm">
                  <div className="flex flex-wrap justify-between gap-2"><span className="font-medium">{interaction.subject}</span><span className="text-muted-foreground">{new Date(interaction.interaction_date).toLocaleDateString("en-IN")}</span></div>
                  <p className="mt-1 text-xs capitalize text-muted-foreground">{interaction.interaction_type.replaceAll("_", " ")}</p>
                  {interaction.description && <p className="mt-2 text-muted-foreground">{interaction.description}</p>}
                </div>
              ))}
              {!c.interactions.length && <Empty text="No citizen interactions recorded." />}
            </Card>
          </TabsContent>

          {/* TIMELINE */}
          <TabsContent value="history" className="mt-4">
            <Card className="divide-y">
              {[
                ...c.activity_logs.map((l) => ({ id: l.id, date: l.created_at, title: l.description, actor: l.user?.name ?? "System" })),
                ...c.interactions.map((i) => ({ id: i.id, date: i.interaction_date, title: i.subject, actor: i.interaction_type })),
              ].sort((a,b) => b.date.localeCompare(a.date)).map((item) => (
                <div key={item.id} className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <span className="font-medium text-sm">{item.title}</span>
                    <span className="shrink-0 text-xs text-muted-foreground">{new Date(item.date).toLocaleString("en-IN")}</span>
                  </div>
                  <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground"><User className="h-3 w-3" />{item.actor}</p>
                </div>
              ))}
              {!c.activity_logs.length && !c.interactions.length && <Empty text="No activity recorded." />}
            </Card>
          </TabsContent>

          <TabsContent value="audit" className="mt-4">
            <Card className="divide-y">
              {c.activity_logs.map((entry) => (
                <div key={entry.id} className="p-4 text-sm"><div className="flex flex-wrap justify-between gap-2"><span className="font-medium">{entry.action.replaceAll("_", " ")}</span><span className="text-muted-foreground">{new Date(entry.created_at).toLocaleString("en-IN")}</span></div><p className="mt-1 text-muted-foreground">{entry.description}</p><p className="mt-1 text-xs text-muted-foreground">{entry.user?.name ?? "System"}</p></div>
              ))}
              {!c.activity_logs.length && <Empty text="No audit history recorded." />}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function SectionTitle({ icon: Icon, title }: { icon: typeof User; title: string }) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="h-4 w-4 text-primary shrink-0" />
      <h3 className="font-semibold text-sm">{title}</h3>
    </div>
  );
}
function InfoGrid({ cols = 2, children }: { cols?: number; children: React.ReactNode }) {
  return (
    <dl className={`grid gap-x-8 gap-y-3 sm:grid-cols-${cols}`}>{children}</dl>
  );
}
function Info({ label, value, className }: { label: string; value: string; className?: string }) {
  return (
    <div className={className}>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 text-sm font-medium">{value || "—"}</dd>
    </div>
  );
}
function StatCard({ label, value, icon: Icon }: { label: string; value: string; icon: typeof User }) {
  return (
    <Card className="flex items-center gap-3 p-4">
      <div className="rounded-md bg-primary/10 p-2 shrink-0"><Icon className="h-4 w-4 text-primary" /></div>
      <div className="min-w-0"><p className="text-xs text-muted-foreground">{label}</p><p className="truncate font-semibold text-sm">{value}</p></div>
    </Card>
  );
}
function Empty({ text }: { text: string }) {
  return <div className="p-10 text-center text-sm text-muted-foreground">{text}</div>;
}
function State({ text }: { text: string }) {
  return (
    <div className="grid min-h-[50vh] place-items-center p-8 text-center text-muted-foreground">
      <div><AlertCircle className="mx-auto mb-3 h-8 w-8" />{text}</div>
    </div>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Briefcase,
  Building2,
  ClipboardList,
  Compass,
  FileBadge,
  FileText,
  History,
  MapPin,
  MessageSquareWarning,
  Search,
  User,
  UserCircle2,
  Users,
  Wallet,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CitizenProfileHeader } from "@/components/citizens/CitizenProfileHeader";
import { QuickActionsBar } from "@/components/citizens/QuickActionsBar";
import { InfoCard } from "@/components/citizens/InfoCard";
import { FamilyTree } from "@/components/citizens/FamilyTree";
import { ActivityTimeline } from "@/components/citizens/ActivityTimeline";
import { DocumentCard } from "@/components/citizens/DocumentCard";
import {
  activityByCitizen,
  citizens,
  documentsByCitizen,
  getCitizen,
  getFamilyOf,
  grievancesByCitizen,
  schemesByCitizen,
  surveysByCitizen,
} from "@/lib/citizen-data";

export const Route = createFileRoute("/_app/citizens/profile")({
  validateSearch: (search: Record<string, unknown>) => ({
    id: typeof search.id === "string" ? search.id : undefined,
    tab: typeof search.tab === "string" ? search.tab : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Citizen 360 — MP Constituency Platform" },
      { name: "description", content: "Complete 360° profile: schemes, grievances, surveys and history." },
    ],
  }),
  component: CitizenProfilePage,
});

const schemeTone: Record<string, string> = {
  Approved: "bg-success/10 text-success",
  Pending: "bg-warning/15 text-warning",
  Rejected: "bg-destructive/10 text-destructive",
  "Under Review": "bg-primary/10 text-primary",
};
const grievTone: Record<string, string> = {
  Open: "bg-destructive/10 text-destructive",
  "In Progress": "bg-warning/15 text-warning",
  Resolved: "bg-success/10 text-success",
  Closed: "bg-muted text-muted-foreground",
};

function CitizenProfilePage() {
  const { id } = Route.useSearch();
  const citizen = getCitizen(id);
  const family = getFamilyOf(citizen);
  const docs = documentsByCitizen[citizen.id] ?? documentsByCitizen["CTZ-100245"];
  const schemes = schemesByCitizen[citizen.id] ?? schemesByCitizen["CTZ-100245"];
  const grievances = grievancesByCitizen[citizen.id] ?? grievancesByCitizen["CTZ-100245"];
  const surveys = surveysByCitizen[citizen.id] ?? surveysByCitizen["CTZ-100245"];
  const activity = activityByCitizen[citizen.id] ?? activityByCitizen["CTZ-100245"];

  return (
    <>
      <PageHeader
        title="Citizen 360"
        description="Unified view of every interaction across the constituency."
        actions={
          <div className="flex items-center gap-2">
            <div className="relative hidden md:block">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search Aadhaar, mobile, voter ID, family ID…"
                className="h-9 w-[320px] pl-8 text-sm"
              />
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link to="/citizens/list">Back to Directory</Link>
            </Button>
          </div>
        }
      />
      <div className="space-y-6 p-4 md:p-8">
        <div className="grid gap-6 xl:grid-cols-[1fr_280px]">
          <CitizenProfileHeader citizen={citizen} />
          <Card className="hidden p-4 xl:block">
            <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Jump to another citizen</div>
            <div className="mt-3 space-y-1.5">
              {citizens.slice(0, 6).map((c) => (
                <Link
                  key={c.id}
                  to="/citizens/profile"
                  search={{ id: c.id }}
                  className="flex items-center justify-between rounded-md px-2 py-1.5 text-sm hover:bg-accent"
                >
                  <span className="truncate">{c.name}</span>
                  <span className="text-[10px] text-muted-foreground">{c.id.slice(-4)}</span>
                </Link>
              ))}
            </div>
          </Card>
        </div>

        <QuickActionsBar />

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="flex w-full flex-wrap justify-start gap-1 bg-muted/60 p-1">
            <TabsTrigger value="overview" className="gap-1.5"><UserCircle2 className="h-3.5 w-3.5" />Overview</TabsTrigger>
            <TabsTrigger value="family" className="gap-1.5"><Users className="h-3.5 w-3.5" />Family</TabsTrigger>
            <TabsTrigger value="schemes" className="gap-1.5"><FileBadge className="h-3.5 w-3.5" />Schemes</TabsTrigger>
            <TabsTrigger value="grievances" className="gap-1.5"><MessageSquareWarning className="h-3.5 w-3.5" />Grievances</TabsTrigger>
            <TabsTrigger value="surveys" className="gap-1.5"><ClipboardList className="h-3.5 w-3.5" />Surveys</TabsTrigger>
            <TabsTrigger value="documents" className="gap-1.5"><FileText className="h-3.5 w-3.5" />Documents</TabsTrigger>
            <TabsTrigger value="activity" className="gap-1.5"><History className="h-3.5 w-3.5" />Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-5">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="grid gap-4 lg:grid-cols-2"
            >
              <InfoCard
                title="Personal Information"
                icon={User}
                index={0}
                items={[
                  { label: "Full Name", value: citizen.name },
                  { label: "Gender", value: citizen.gender },
                  { label: "Age", value: `${citizen.age} years` },
                  { label: "Occupation", value: citizen.occupation },
                  { label: "Mobile", value: citizen.mobile },
                  { label: "Registered", value: citizen.registeredOn },
                ]}
              />
              <InfoCard
                title="Demographics"
                icon={Compass}
                index={1}
                items={[
                  { label: "Social Category", value: citizen.category },
                  { label: "Economic Category", value: citizen.economicCategory },
                  { label: "Aadhaar", value: citizen.aadhaar },
                  { label: "Voter ID", value: citizen.voterId },
                ]}
              />
              <InfoCard
                title="Economic Profile"
                icon={Wallet}
                index={2}
                items={[
                  { label: "Income Band", value: citizen.economicCategory === "BPL" ? "Below ₹1L / yr" : "₹3L–₹6L / yr" },
                  { label: "Occupation", value: citizen.occupation },
                  { label: "Ration Card", value: citizen.economicCategory === "BPL" ? "Pink (Priority)" : "White (APL)" },
                  { label: "Skill Level", value: "Intermediate" },
                ]}
              />
              <InfoCard
                title="Location Information"
                icon={MapPin}
                index={3}
                items={[
                  { label: "Village / Ward", value: citizen.village },
                  { label: "Mandal", value: citizen.mandal },
                  { label: "Pincode", value: citizen.pincode },
                  { label: "Address", value: `${citizen.village}, ${citizen.mandal}` },
                ]}
              />
              <InfoCard
                title="Constituency Mapping"
                icon={Building2}
                index={4}
                items={[
                  { label: "Lok Sabha Constituency", value: citizen.constituency },
                  { label: "Assembly", value: "Serilingampally" },
                  { label: "Booth", value: citizen.booth },
                  { label: "Family ID", value: citizen.familyId },
                ]}
              />
              <InfoCard
                title="Engagement Summary"
                icon={Briefcase}
                index={5}
                items={[
                  { label: "Schemes Availed", value: `${schemes.filter((s) => s.status === "Approved").length}` },
                  { label: "Grievances Filed", value: `${grievances.length}` },
                  { label: "Surveys Completed", value: `${surveys.length}` },
                  { label: "Documents on File", value: `${docs.length}` },
                ]}
              />
            </motion.div>
          </TabsContent>

          <TabsContent value="family" className="mt-5">
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              <Card className="p-5">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="font-display text-base font-semibold">{family.headName}'s Household</h3>
                    <p className="text-xs text-muted-foreground">{family.id} · {family.village}, {family.mandal} · {family.totalMembers} members</p>
                  </div>
                  <Badge variant="outline">Total Benefits ₹{family.totalBenefits.toLocaleString("en-IN")}</Badge>
                </div>
                <FamilyTree family={family} />
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="schemes" className="mt-5">
            <Card className="overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Scheme</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Applied</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Benefit (₹)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {schemes.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell className="font-medium">{s.scheme}</TableCell>
                      <TableCell className="text-muted-foreground">{s.department}</TableCell>
                      <TableCell>{s.appliedOn}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={schemeTone[s.status]}>{s.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {s.benefitAmount ? s.benefitAmount.toLocaleString("en-IN") : "—"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          <TabsContent value="grievances" className="mt-5">
            <div className="grid gap-4 lg:grid-cols-[1fr_380px]">
              <Card className="overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {grievances.map((g) => (
                      <TableRow key={g.id}>
                        <TableCell className="font-mono text-xs">{g.id}</TableCell>
                        <TableCell>{g.category}</TableCell>
                        <TableCell className="max-w-[280px] truncate">{g.title}</TableCell>
                        <TableCell>{g.date}</TableCell>
                        <TableCell><Badge variant="secondary" className={grievTone[g.status]}>{g.status}</Badge></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
              <Card className="p-5">
                <h4 className="mb-3 font-display text-sm font-semibold">Resolution Timeline</h4>
                <ActivityTimeline
                  events={grievances.map((g) => ({
                    id: g.id,
                    date: g.date,
                    icon: "grievance" as const,
                    title: `${g.category} — ${g.status}`,
                    description: g.resolution ?? g.title,
                  }))}
                />
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="surveys" className="mt-5">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {surveys.map((s, i) => (
                <motion.div key={s.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: i * 0.05 }}>
                  <Card className="p-4">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <ClipboardList className="h-3.5 w-3.5" />{s.date}
                    </div>
                    <h4 className="mt-2 font-display text-sm font-semibold">{s.survey}</h4>
                    <div className="mt-3 flex items-end justify-between">
                      <div>
                        <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Responses</div>
                        <div className="font-display text-xl font-bold">{s.responses}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Completion</div>
                        <div className="font-display text-xl font-bold text-primary">{s.completion}%</div>
                      </div>
                    </div>
                    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
                      <div className="h-full rounded-full bg-primary" style={{ width: `${s.completion}%` }} />
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="documents" className="mt-5">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {docs.map((d, i) => (
                <DocumentCard key={d.id} doc={d} index={i} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="activity" className="mt-5">
            <Card className="p-6">
              <ActivityTimeline events={activity} />
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
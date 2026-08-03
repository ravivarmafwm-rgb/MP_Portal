import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, Download, FilePlus2, House, Search, Upload, Users } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchCitizenDashboard, downloadCitizenDirectory, getApiErrorMessage } from "@/lib/api";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/citizens/dashboard")({
  head: () => ({ meta: [{ title: "Citizen Dashboard" }] }),
  component: CitizenDashboardPage,
});

const cards = [
  ["total_citizens", "Total Citizens"], ["male", "Male"], ["female", "Female"],
  ["senior_citizens", "Senior Citizens"], ["youth", "Youth"], ["children", "Children"],
  ["families", "Families"], ["volunteers_assigned", "Volunteers Assigned"],
  ["active_beneficiaries", "Active Beneficiaries"], ["disabled_citizens", "Disabled Citizens"],
  ["widows", "Widows"], ["pension_holders", "Pension Holders"],
] as const;

function CitizenDashboardPage() {
  const query = useQuery({ queryKey: ["citizen-dashboard"], queryFn: fetchCitizenDashboard, staleTime: 60_000 });
  const exportData = async () => {
    try {
      await downloadCitizenDirectory();
    } catch (error) { toast.error(getApiErrorMessage(error)); }
  };
  if (query.isLoading) return <div className="grid gap-4 p-4 md:grid-cols-4 md:p-8">{Array.from({ length: 12 }).map((_, i) => <Skeleton key={i} className="h-28" />)}</div>;
  if (query.isError) return <div className="p-8 text-center text-destructive">{getApiErrorMessage(query.error, "Citizen dashboard could not be loaded.")}</div>;
  const data = query.data!; const s = data.summary;
  return <>
    <PageHeader title="Citizen Dashboard" description="Live citizen, household, benefit and data-quality metrics within your authorized geography." actions={<div className="flex flex-wrap gap-2"><Button asChild><Link to="/citizens/create-profile"><FilePlus2 className="mr-1 h-4 w-4" />Create Citizen</Link></Button><Button variant="outline" onClick={exportData}><Download className="mr-1 h-4 w-4" />Export CSV</Button></div>} />
    <div className="space-y-5 p-4 md:p-8">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{cards.map(([key, label]) => <Card key={key} className="p-4"><div className="text-xs text-muted-foreground">{label}</div><div className="mt-2 text-2xl font-bold">{(s[key] ?? 0).toLocaleString("en-IN")}</div><div className="mt-1 text-[11px] text-muted-foreground">Live database count</div></Card>)}</div>
      <div className="flex flex-wrap gap-2"><Button asChild variant="outline"><Link to="/citizens/list"><Search className="mr-1 h-4 w-4" />Search Citizens</Link></Button><Button asChild variant="outline"><Link to="/citizens/families"><House className="mr-1 h-4 w-4" />Family Management</Link></Button><Button asChild variant="outline"><Link to="/citizens/create-profile"><Users className="mr-1 h-4 w-4" />Create Family Member</Link></Button><Button asChild variant="outline"><Link to="/citizens/list"><Upload className="mr-1 h-4 w-4" />Import Citizens</Link></Button></div>
      <div className="grid gap-5 lg:grid-cols-2"><ChartCard title="Age distribution"><ResponsiveContainer width="100%" height={280}><BarChart data={data.age_distribution}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="label" /><YAxis allowDecimals={false} /><Tooltip /><Bar dataKey="count" fill="hsl(var(--primary))" /></BarChart></ResponsiveContainer></ChartCard><ChartCard title="Gender distribution"><ResponsiveContainer width="100%" height={280}><PieChart><Pie data={data.gender_distribution} dataKey="count" nameKey="label" outerRadius={95} label>{data.gender_distribution.map((_, i) => <Cell key={i} fill={["#2563eb", "#db2777", "#64748b"][i % 3]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></ChartCard><ChartCard title="Monthly registrations"><ResponsiveContainer width="100%" height={280}><BarChart data={data.monthly_registrations}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" /><YAxis allowDecimals={false} /><Tooltip /><Bar dataKey="count" fill="#16a34a" /></BarChart></ResponsiveContainer></ChartCard><ChartCard title="Occupation distribution"><ResponsiveContainer width="100%" height={280}><BarChart data={data.occupation_distribution} layout="vertical"><CartesianGrid strokeDasharray="3 3" /><XAxis type="number" allowDecimals={false} /><YAxis dataKey="label" type="category" width={110} /><Tooltip /><Bar dataKey="count" fill="#f59e0b" /></BarChart></ResponsiveContainer></ChartCard><ChartCard title="Family distribution"><ResponsiveContainer width="100%" height={280}><BarChart data={data.family_distribution}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="label" /><YAxis allowDecimals={false} /><Tooltip /><Bar dataKey="count" fill="#7c3aed" /></BarChart></ResponsiveContainer></ChartCard></div>
      <Card className="p-5"><h2 className="mb-4 font-semibold">Data quality alerts</h2><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{Object.entries(data.alerts).map(([key, value]) => <div key={key} className="flex items-center gap-3 rounded border p-3"><AlertTriangle className="h-4 w-4 text-warning" /><div><div className="text-xs capitalize text-muted-foreground">{key.replaceAll("_", " ")}</div><div className="font-semibold">{value.toLocaleString("en-IN")}</div></div></div>)}</div></Card>
      <Card className="p-5"><h2 className="mb-4 font-semibold">Geographic distribution</h2><div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr className="border-b text-xs text-muted-foreground"><th className="p-2">Assembly</th><th className="p-2">Mandal</th><th className="p-2">Village</th><th className="p-2">Ward</th><th className="p-2">Booth</th><th className="p-2 text-right">Citizens</th></tr></thead><tbody>{data.geographic_distribution.map((row, i) => <tr key={i} className="border-b"><td className="p-2">{row.assembly ?? "—"}</td><td className="p-2">{row.mandal ?? "—"}</td><td className="p-2">{row.village ?? "—"}</td><td className="p-2">{row.ward ?? "—"}</td><td className="p-2">{row.booth ?? "—"}</td><td className="p-2 text-right font-semibold">{Number(row.citizens ?? 0).toLocaleString("en-IN")}</td></tr>)}</tbody></table>{!data.geographic_distribution.length && <p className="py-8 text-center text-sm text-muted-foreground">No primary address geography is recorded.</p>}</div></Card>
      <div className="grid gap-5 lg:grid-cols-2"><ActivityCard title="Recent citizens">{data.recent_citizens.map((item) => <div key={item.id} className="flex justify-between border-b py-2 text-sm"><span>{item.name}</span><span className="text-muted-foreground">{item.unique_id}</span></div>)}{!data.recent_citizens.length && <EmptyActivity />}</ActivityCard><ActivityCard title="Recent activity">{data.recent_activity.map((item) => <div key={item.id} className="border-b py-2 text-sm"><div className="font-medium">{item.description || item.action}</div><div className="text-xs text-muted-foreground">{item.module || "citizens"}</div></div>)}{!data.recent_activity.length && <EmptyActivity />}</ActivityCard><ActivityCard title="Recent document uploads">{data.recent_documents.map((item) => <div key={item.id} className="border-b py-2 text-sm">{item.title || "Document"}</div>)}{!data.recent_documents.length && <EmptyActivity />}</ActivityCard><ActivityCard title="Recent scheme enrollment">{data.recent_scheme_enrollments.map((item) => <div key={item.id} className="border-b py-2 text-sm"><div>{item.scheme || "Scheme"}</div><div className="text-xs text-muted-foreground">{item.beneficiary_name || "Citizen beneficiary"}</div></div>)}{!data.recent_scheme_enrollments.length && <EmptyActivity />}</ActivityCard></div>
    </div>
  </>;
}
function ChartCard({ title, children }: { title: string; children: React.ReactNode }) { return <Card className="p-5"><h2 className="mb-3 font-semibold">{title}</h2>{children}</Card>; }
function ActivityCard({ title, children }: { title: string; children: React.ReactNode }) { return <Card className="p-5"><h2 className="mb-3 font-semibold">{title}</h2>{children}</Card>; }
function EmptyActivity() { return <p className="py-5 text-sm text-muted-foreground">No activity recorded.</p>; }

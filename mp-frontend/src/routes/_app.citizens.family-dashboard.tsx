import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Users, UserRound, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchFamilyDashboard, getApiErrorMessage } from "@/lib/api";

export const Route = createFileRoute("/_app/citizens/family-dashboard")({
  validateSearch: (search: Record<string, unknown>) => ({ id: typeof search.id === "string" ? search.id : undefined }),
  component: FamilyDashboardPage,
});

function FamilyDashboardPage() {
  const { id } = Route.useSearch();
  const query = useQuery({ queryKey: ["family-dashboard", id], queryFn: () => fetchFamilyDashboard(id!), enabled: Boolean(id) });
  if (!id) return <div className="p-8 text-sm text-muted-foreground">Select a family to view its dashboard.</div>;
  if (query.isLoading) return <div className="space-y-4 p-8"><Skeleton className="h-24" /><Skeleton className="h-64" /></div>;
  if (query.isError) return <div className="p-8 text-sm text-destructive">{getApiErrorMessage(query.error)}</div>;
  const { family, summary, members, recent_activity } = query.data!.data;
  return <>
    <PageHeader title={family.head_of_family_name} description={`Family dashboard · ${family.family_id}`} actions={<Link className="text-sm text-primary hover:underline" to="/citizens/families">Back to families</Link>} />
    <div className="space-y-5 p-4 md:p-8">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {Object.entries(summary).map(([key, value]) => <Card key={key} className="p-4"><p className="text-xs uppercase tracking-wide text-muted-foreground">{key.replaceAll("_", " ")}</p><p className="mt-1 text-2xl font-bold">{value}</p></Card>)}
      </div>
      <Card className="p-5"><div className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-primary" /><h2 className="font-display text-lg font-bold">Household summary</h2></div><p className="mt-2 text-sm text-muted-foreground">House {family.house_number ?? "Not recorded"} · {family.village?.name ?? "Village not recorded"} · {family.members_count} registered members</p></Card>
      <Card className="p-5"><div className="mb-4 flex items-center gap-2"><Users className="h-5 w-5 text-primary" /><h2 className="font-display text-lg font-bold">Family members</h2></div><div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">{family.family_members.map((member) => <div key={member.id} className="rounded-lg border p-4"><div className="flex items-start justify-between gap-2"><div><p className="font-medium">{member.citizen.first_name} {member.citizen.last_name}</p><p className="text-xs text-muted-foreground">{member.relationship_with_head} · {member.citizen.gender}</p></div>{member.is_head && <Badge>Head</Badge>}</div><Link className="mt-3 inline-block text-xs text-primary hover:underline" to="/citizens/profile" search={{ id: member.citizen.id }}><UserRound className="mr-1 inline h-3.5 w-3.5" />View profile</Link></div>)}</div></Card>
      <Card className="p-5"><h2 className="font-display text-lg font-bold">Family timeline</h2><div className="mt-3 space-y-3">{recent_activity.length ? recent_activity.map((entry) => <div key={entry.id} className="border-l-2 pl-3 text-sm"><p>{entry.description}</p><p className="text-xs text-muted-foreground">{new Date(entry.created_at).toLocaleString("en-IN")}</p></div>) : <p className="text-sm text-muted-foreground">No family activity recorded.</p>}</div></Card>
    </div>
  </>;
}

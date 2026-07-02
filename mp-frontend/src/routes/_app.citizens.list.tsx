import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Users, Plus, Download, UserCheck, UserPlus, Home, Loader2, Search } from "lucide-react";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchCitizens, fetchCitizenStats } from "@/lib/api";
import { StatCard } from "@/components/layout/StatCard";

export const Route = createFileRoute("/_app/citizens/list")({
  head: () => ({ meta: [{ title: "Citizen Directory — MP Constituency Platform" }] }),
  component: CitizenListPage,
});

function CitizenListPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { data: statsData } = useQuery({ queryKey: ["citizen-stats"], queryFn: fetchCitizenStats, staleTime: 60_000 });
  const { data, isLoading } = useQuery({
    queryKey: ["citizens", search, page],
    queryFn: () => fetchCitizens({ search, page, per_page: 20 }),
    staleTime: 30_000,
  });

  const citizens = data?.data ?? [];
  const meta = data?.meta ?? { total: 0, current_page: 1, last_page: 1 };

  const stats = [
    { label: "Total Citizens",      value: (statsData?.total    ?? 0).toLocaleString("en-IN"), icon: Users,    delta: "+2.4%", trend: "up" as const },
    { label: "Male",                 value: (statsData?.male     ?? 0).toLocaleString("en-IN"), icon: UserCheck,delta: "",      trend: "up" as const },
    { label: "Female",               value: (statsData?.female   ?? 0).toLocaleString("en-IN"), icon: Home,     delta: "",      trend: "up" as const },
    { label: "New This Month",       value: (statsData?.this_month ?? 0).toLocaleString("en-IN"), icon: UserPlus, delta: "+12%", trend: "up" as const, hint: "This month" },
  ];

  return (
    <>
      <PageHeader
        title="Citizen Directory"
        description="Single source of truth for every citizen across the constituency."
        actions={
          <>
            <Button variant="outline" size="sm" className="gap-1.5"><Download className="h-4 w-4" /> Export</Button>
            <Button asChild size="sm" className="gap-1.5">
              <Link to="/citizens/create-profile"><Plus className="h-4 w-4" /> Add Citizen</Link>
            </Button>
          </>
        }
      />
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-6 p-4 md:p-8">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((s, i) => <StatCard key={s.label} {...s} index={i} />)}
        </div>

        <Card className="overflow-hidden">
          <div className="flex flex-wrap items-center gap-2 border-b border-border/70 bg-muted/30 p-3">
            <div className="relative min-w-[240px] flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name, mobile, Aadhaar, voter ID…"
                className="h-9 bg-background pl-9"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              />
            </div>
          </div>

          {isLoading ? (
            <div className="space-y-2 p-4">
              {Array.from({ length: 10 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Citizen ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Mobile</TableHead>
                    <TableHead>Gender</TableHead>
                    <TableHead>DOB</TableHead>
                    <TableHead>Voter ID</TableHead>
                    <TableHead>Occupation</TableHead>
                    <TableHead>Voter</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {citizens.map((c: Record<string, unknown>, i: number) => (
                    <motion.tr
                      key={String(c.id)}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.01 }}
                      className="border-b hover:bg-muted/40"
                    >
                      <TableCell className="font-mono text-xs">{String(c.unique_id ?? "")}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-xs">
                              {String(c.first_name ?? "").charAt(0)}{String(c.last_name ?? "").charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="text-sm font-medium">{String(c.first_name ?? "")} {String(c.last_name ?? "")}</div>
                            <div className="text-xs text-muted-foreground">{String(c.email ?? "—")}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="tabular-nums text-sm">{String(c.mobile_number ?? "—")}</TableCell>
                      <TableCell className="text-sm">{String(c.gender ?? "—")}</TableCell>
                      <TableCell className="text-xs tabular-nums">{String(c.date_of_birth ?? "—")}</TableCell>
                      <TableCell className="text-xs">{String(c.voter_id ?? "—")}</TableCell>
                      <TableCell className="text-sm">{String(c.occupation ?? "—")}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={c.is_voter ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}>
                          {c.is_voter ? "Voter" : "Non-voter"}
                        </Badge>
                      </TableCell>
                    </motion.tr>
                  ))}
                  {citizens.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={8} className="py-12 text-center text-sm text-muted-foreground">
                        {search ? "No citizens match your search." : "No citizens found."}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}

          <div className="flex items-center justify-between border-t border-border/70 px-4 py-3 text-xs text-muted-foreground">
            <span>Showing {citizens.length} of {meta.total} citizens</span>
            <div className="flex items-center gap-1">
              <Button variant="outline" size="sm" className="h-7" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Previous</Button>
              <span className="px-2">Page {meta.current_page} / {meta.last_page}</span>
              <Button variant="outline" size="sm" className="h-7" disabled={page >= meta.last_page} onClick={() => setPage(p => p + 1)}>Next</Button>
            </div>
          </div>
        </Card>
      </motion.div>
    </>
  );
}

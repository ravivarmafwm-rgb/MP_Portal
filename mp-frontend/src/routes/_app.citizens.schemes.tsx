import { createFileRoute, Link } from "@tanstack/react-router";
import { FileBadge } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { schemesByCitizen } from "@/lib/citizen-data";

const tone: Record<string, string> = {
  Approved: "bg-success/10 text-success",
  Pending: "bg-warning/15 text-warning",
  Rejected: "bg-destructive/10 text-destructive",
  "Under Review": "bg-primary/10 text-primary",
};

export const Route = createFileRoute("/_app/citizens/schemes")({
  head: () => ({ meta: [{ title: "Citizen Schemes — MP Constituency Platform" }] }),
  component: () => {
    const rows = schemesByCitizen["CTZ-100245"];
    return (
      <>
        <PageHeader title="Citizen Schemes" description="Applied, approved, pending and rejected schemes mapped per citizen." actions={<Button asChild size="sm" variant="outline"><Link to="/citizens/profile">Open Citizen 360</Link></Button>} />
        <div className="space-y-4 p-4 md:p-8">
          <Card className="flex items-center gap-3 p-4 text-sm text-muted-foreground"><FileBadge className="h-4 w-4 text-primary" /> Showing scheme history for Anitha Rao · CTZ-100245</Card>
          <Card className="overflow-hidden">
            <Table>
              <TableHeader><TableRow><TableHead>Scheme</TableHead><TableHead>Department</TableHead><TableHead>Applied</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Benefit (₹)</TableHead></TableRow></TableHeader>
              <TableBody>
                {rows.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="font-medium">{s.scheme}</TableCell>
                    <TableCell className="text-muted-foreground">{s.department}</TableCell>
                    <TableCell>{s.appliedOn}</TableCell>
                    <TableCell><Badge variant="secondary" className={tone[s.status]}>{s.status}</Badge></TableCell>
                    <TableCell className="text-right tabular-nums">{s.benefitAmount ? s.benefitAmount.toLocaleString("en-IN") : "—"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>
      </>
    );
  },
});
import { createFileRoute, Link } from "@tanstack/react-router";
import { MessageSquareWarning } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { grievancesByCitizen } from "@/lib/citizen-data";

const tone: Record<string, string> = {
  Open: "bg-destructive/10 text-destructive",
  "In Progress": "bg-warning/15 text-warning",
  Resolved: "bg-success/10 text-success",
  Closed: "bg-muted text-muted-foreground",
};

export const Route = createFileRoute("/_app/citizens/grievances")({
  head: () => ({ meta: [{ title: "Citizen Grievances — MP Constituency Platform" }] }),
  component: () => {
    const rows = grievancesByCitizen["CTZ-100245"];
    return (
      <>
        <PageHeader title="Citizen Grievances" description="Complaints raised, assignment trail and resolutions." actions={<Button asChild size="sm" variant="outline"><Link to="/citizens/profile">Open Citizen 360</Link></Button>} />
        <div className="space-y-4 p-4 md:p-8">
          <Card className="flex items-center gap-3 p-4 text-sm text-muted-foreground"><MessageSquareWarning className="h-4 w-4 text-primary" /> Showing grievance history for Anitha Rao · CTZ-100245</Card>
          <Card className="overflow-hidden">
            <Table>
              <TableHeader><TableRow><TableHead>ID</TableHead><TableHead>Category</TableHead><TableHead>Title</TableHead><TableHead>Date</TableHead><TableHead>Status</TableHead><TableHead>Resolution</TableHead></TableRow></TableHeader>
              <TableBody>
                {rows.map((g) => (
                  <TableRow key={g.id}>
                    <TableCell className="font-mono text-xs">{g.id}</TableCell>
                    <TableCell>{g.category}</TableCell>
                    <TableCell className="max-w-[280px] truncate">{g.title}</TableCell>
                    <TableCell>{g.date}</TableCell>
                    <TableCell><Badge variant="secondary" className={tone[g.status]}>{g.status}</Badge></TableCell>
                    <TableCell className="text-xs text-muted-foreground">{g.resolution ?? "—"}</TableCell>
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
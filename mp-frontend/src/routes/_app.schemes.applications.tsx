import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  FileBadge,
  Search,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { fetchSchemeApplications, fetchSchemeStats } from "@/lib/api";

export const Route = createFileRoute("/_app/schemes/applications")({
  component: ApplicationsPage,
});
const statuses = [
  "all",
  "pending",
  "submitted",
  "under_review",
  "verification_pending",
  "approved",
  "rejected",
];

function ApplicationsPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const stats = useQuery({
    queryKey: ["scheme-stats"],
    queryFn: fetchSchemeStats,
  });
  const query = useQuery({
    queryKey: ["scheme-applications", search, status, page],
    queryFn: () =>
      fetchSchemeApplications({
        search,
        ...(status === "all" ? {} : { status }),
        page,
        per_page: 20,
      }),
  });
  const metrics = [
    ["Total", stats.data?.total_applications ?? 0, FileBadge],
    ["Approved", stats.data?.approved ?? 0, CheckCircle2],
    ["Pending", stats.data?.pending ?? 0, Clock],
    ["Rejected", stats.data?.rejected ?? 0, XCircle],
  ] as const;
  return (
    <>
      <PageHeader
        title="Scheme Applications"
        description="Search and review recorded welfare applications."
      />
      <div className="space-y-5 p-4 md:p-8">
        {stats.isError && (
          <State text="Application statistics could not be loaded." />
        )}
        {stats.isLoading ? (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-28" />
            ))}
          </div>
        ) : stats.data ? (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {metrics.map(([label, value, Icon]) => (
              <Card key={label} className="p-4">
                <Icon className="h-5 w-5 text-primary" />
                <div className="mt-3 text-xs text-muted-foreground">
                  {label}
                </div>
                <div className="text-2xl font-bold">
                  {value.toLocaleString()}
                </div>
              </Card>
            ))}
          </div>
        ) : null}
        <Card className="space-y-3 p-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-9"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              placeholder="Application number, applicant, mobile or scheme"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {statuses.map((value) => (
              <Button
                key={value}
                size="sm"
                variant={status === value ? "default" : "outline"}
                onClick={() => {
                  setStatus(value);
                  setPage(1);
                }}
                className="capitalize"
              >
                {value.replaceAll("_", " ")}
              </Button>
            ))}
          </div>
        </Card>
        {query.isLoading && (
          <div className="space-y-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-12" />
            ))}
          </div>
        )}
        {query.isError && (
          <State text="Applications could not be loaded. Please retry." />
        )}
        {query.data && (
          <Card className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Application</TableHead>
                  <TableHead>Applicant</TableHead>
                  <TableHead>Scheme</TableHead>
                  <TableHead>Village</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Sanctioned</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {query.data.data.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="font-mono text-xs">
                      <Link
                        to="/schemes/application-detail"
                        search={{ id: row.id }}
                        className="text-primary hover:underline"
                      >
                        {row.application_number}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{row.applicant_name}</div>
                      <div className="text-xs text-muted-foreground">
                        {row.applicant_mobile}
                      </div>
                    </TableCell>
                    <TableCell>
                      {row.scheme?.name ?? "Deleted scheme"}
                    </TableCell>
                    <TableCell>{row.village?.name ?? "—"}</TableCell>
                    <TableCell>
                      {new Date(row.application_date).toLocaleDateString(
                        "en-IN",
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="capitalize">
                        {row.status.replaceAll("_", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {row.sanctioned_amount
                        ? `₹${Number(row.sanctioned_amount).toLocaleString("en-IN")}`
                        : "—"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {query.data.data.length === 0 && (
              <div className="p-10 text-center text-sm text-muted-foreground">
                No applications match the current filters.
              </div>
            )}
          </Card>
        )}
        {query.data && query.data.meta.last_page > 1 && (
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">
              Page {page} of {query.data.meta.last_page}
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                disabled={page === 1}
                onClick={() => setPage((v) => v - 1)}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                disabled={page === query.data.meta.last_page}
                onClick={() => setPage((v) => v + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
function State({ text }: { text: string }) {
  return (
    <div className="py-16 text-center text-muted-foreground">
      <AlertCircle className="mx-auto mb-3 h-8 w-8" />
      {text}
    </div>
  );
}

import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { AlertCircle, IndianRupee, Search, Users } from "lucide-react";
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
import { fetchSchemeBeneficiaries, fetchSchemeStats } from "@/lib/api";

export const Route = createFileRoute("/_app/schemes/beneficiaries")({
  component: BeneficiariesPage,
});

function BeneficiariesPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("active");
  const [page, setPage] = useState(1);
  const stats = useQuery({
    queryKey: ["scheme-stats"],
    queryFn: fetchSchemeStats,
  });
  const query = useQuery({
    queryKey: ["scheme-beneficiaries", search, status, page],
    queryFn: () =>
      fetchSchemeBeneficiaries({ search, status, page, per_page: 20 }),
  });
  return (
    <>
      <PageHeader
        title="Scheme Beneficiaries"
        description="Beneficiary enrollments and recorded benefit distribution."
      />
      <div className="space-y-5 p-4 md:p-8">
        {stats.isError && (
          <div className="py-6 text-center text-destructive">
            Beneficiary statistics could not be loaded.
          </div>
        )}
        {stats.isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <Skeleton className="h-28" />
            <Skeleton className="h-28" />
          </div>
        ) : stats.data ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <Card className="p-5">
              <Users className="h-5 w-5 text-primary" />
              <div className="mt-3 text-xs text-muted-foreground">
                Active beneficiaries
              </div>
              <div className="text-2xl font-bold">
                {(stats.data?.total_beneficiaries ?? 0).toLocaleString()}
              </div>
            </Card>
            <Card className="p-5">
              <IndianRupee className="h-5 w-5 text-primary" />
              <div className="mt-3 text-xs text-muted-foreground">
                Recorded benefits distributed
              </div>
              <div className="text-2xl font-bold">
                ₹
                {(stats.data?.total_benefit_distributed ?? 0).toLocaleString(
                  "en-IN",
                )}
              </div>
            </Card>
          </div>
        ) : null}
        <Card className="flex flex-col gap-3 p-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-9"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              placeholder="Search beneficiary name"
            />
          </div>
          <div className="flex gap-2">
            {["active", "inactive", "completed"].map((value) => (
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
                {value}
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
          <div className="py-16 text-center text-muted-foreground">
            <AlertCircle className="mx-auto mb-3 h-8 w-8" />
            Beneficiaries could not be loaded.
          </div>
        )}
        {query.data && (
          <Card className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Beneficiary</TableHead>
                  <TableHead>Scheme</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Enrolled</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Payments</TableHead>
                  <TableHead className="text-right">Total benefit</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {query.data.data.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="font-medium">
                      {row.beneficiary_name}
                    </TableCell>
                    <TableCell>
                      {row.scheme?.name ?? "Deleted scheme"}
                    </TableCell>
                    <TableCell className="capitalize">
                      {row.beneficiary_type}
                    </TableCell>
                    <TableCell>
                      {new Date(row.enrollment_date).toLocaleDateString(
                        "en-IN",
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="capitalize">
                        {row.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {row.benefit_count}
                    </TableCell>
                    <TableCell className="text-right">
                      ₹
                      {Number(row.total_benefit_received).toLocaleString(
                        "en-IN",
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {query.data.data.length === 0 && (
              <div className="p-10 text-center text-sm text-muted-foreground">
                No beneficiaries match the current filters.
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

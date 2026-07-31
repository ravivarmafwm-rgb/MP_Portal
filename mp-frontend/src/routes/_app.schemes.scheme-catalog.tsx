import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { AlertCircle, Building2, Search, Trash2 } from "lucide-react";
import { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  deleteScheme,
  fetchSchemes,
  getApiErrorMessage,
  updateScheme,
} from "@/lib/api";
import { SchemeCatalogDialog } from "@/components/schemes/SchemeCatalogDialog";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/schemes/scheme-catalog")({
  head: () => ({ meta: [{ title: "Scheme Catalog" }] }),
  component: SchemeCatalog,
});

function SchemeCatalog() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const { user } = useAuth();
  const client = useQueryClient();
  const canManage = [
    "super-admin",
    "mp-staff",
    "constituency-coordinator",
  ].includes(user?.role_slug ?? "");
  const activation = useMutation({
    mutationFn: ({ id, active }: { id: string; active: boolean }) =>
      updateScheme(id, { is_active: active }),
    onSuccess: async (_, variables) => {
      toast.success(
        variables.active ? "Scheme activated." : "Scheme deactivated.",
      );
      await client.invalidateQueries({ queryKey: ["schemes"] });
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
  const removal = useMutation({
    mutationFn: deleteScheme,
    onSuccess: async () => {
      toast.success("Scheme deleted.");
      await client.invalidateQueries({ queryKey: ["schemes"] });
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
  const query = useQuery({
    queryKey: ["schemes", search, page],
    queryFn: () => fetchSchemes({ search, page, per_page: 12 }),
  });
  return (
    <>
      <PageHeader
        title="Scheme Catalog"
        description="Government schemes currently recorded for this constituency."
        actions={canManage ? <SchemeCatalogDialog /> : undefined}
      />
      <div className="space-y-5 p-4 md:p-8">
        <Card className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              className="pl-9"
              placeholder="Search by scheme name or code"
            />
          </div>
        </Card>
        {query.isLoading && (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-64" />
            ))}
          </div>
        )}
        {query.isError && (
          <div className="py-16 text-center text-muted-foreground">
            <AlertCircle className="mx-auto mb-3 h-8 w-8" />
            Schemes could not be loaded. Please retry.
          </div>
        )}
        {query.data && query.data.data.length === 0 && (
          <div className="py-16 text-center text-sm text-muted-foreground">
            No schemes match the current search.
          </div>
        )}
        {query.data && (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {query.data.data.map((scheme) => (
              <Card key={scheme.id} className="flex flex-col p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="font-semibold">{scheme.name}</h2>
                    <p className="mt-1 font-mono text-xs text-muted-foreground">
                      {scheme.code}
                    </p>
                  </div>
                  <Badge variant={scheme.is_active ? "default" : "secondary"}>
                    {scheme.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <p className="mt-4 line-clamp-3 text-sm text-muted-foreground">
                  {scheme.description || "No description has been recorded."}
                </p>
                <dl className="mt-5 space-y-2 text-sm">
                  <div className="flex justify-between gap-4">
                    <dt>Category</dt>
                    <dd className="font-medium">{scheme.category}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="flex items-center gap-1">
                      <Building2 className="h-3.5 w-3.5" /> Department
                    </dt>
                    <dd className="text-right font-medium">
                      {scheme.department?.name ?? "Not assigned"}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt>Applications</dt>
                    <dd className="font-medium">
                      {scheme.applications_count ?? 0}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt>Beneficiaries</dt>
                    <dd className="font-medium">
                      {scheme.beneficiaries_count ?? 0}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt>Application mode</dt>
                    <dd className="capitalize font-medium">
                      {scheme.application_mode}
                    </dd>
                  </div>
                </dl>
                {canManage && (
                  <div className="mt-5 flex gap-2 border-t pt-4">
                    <SchemeCatalogDialog scheme={scheme} />
                    <Button
                      size="sm"
                      variant={scheme.is_active ? "destructive" : "outline"}
                      disabled={activation.isPending}
                      onClick={() =>
                        activation.mutate({
                          id: scheme.id,
                          active: !scheme.is_active,
                        })
                      }
                    >
                      {scheme.is_active ? "Deactivate" : "Activate"}
                    </Button>
                    {(scheme.applications_count ?? 0) === 0 &&
                      (scheme.beneficiaries_count ?? 0) === 0 && (
                        <Button
                          size="sm"
                          variant="destructive"
                          disabled={removal.isPending}
                          onClick={() => {
                            if (
                              window.confirm(
                                `Delete ${scheme.name}? This cannot be undone.`,
                              )
                            ) {
                              removal.mutate(scheme.id);
                            }
                          }}
                          aria-label={`Delete ${scheme.name}`}
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </Button>
                      )}
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
        {query.data && query.data.meta.last_page > 1 && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Page {query.data.meta.current_page} of {query.data.meta.last_page}
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                disabled={page <= 1}
                onClick={() => setPage((value) => value - 1)}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                disabled={page >= query.data.meta.last_page}
                onClick={() => setPage((value) => value + 1)}
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

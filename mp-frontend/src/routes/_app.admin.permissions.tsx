import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ShieldCheck, Info } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { api, getApiErrorMessage } from "@/lib/api";

export const Route = createFileRoute("/_app/admin/permissions")({
  head: () => ({ meta: [{ title: "Permissions — Admin" }] }),
  component: AdminPermissionsPage,
});

interface RoleRecord {
  id: string;
  name: string;
  slug: string;
  is_active: boolean;
  permissions?: { id: string; name: string; slug: string }[];
}

async function fetchRoles(): Promise<RoleRecord[]> {
  const res = await api.get("/admin/roles");
  return res.data as RoleRecord[];
}

function AdminPermissionsPage() {
  const { data: roles, isLoading, error } = useQuery({
    queryKey: ["admin-roles"],
    queryFn: fetchRoles,
  });

  return (
    <>
      <PageHeader
        title="Roles & Permissions"
        description="System roles and their assigned permission sets. Contact the development team to modify permissions."
      />
      <div className="p-4 md:p-8 space-y-4">
        <div className="flex items-center gap-2 rounded-md border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800 dark:border-blue-700 dark:bg-blue-950/30 dark:text-blue-300">
          <Info className="h-4 w-4 shrink-0" />
          Permissions are assigned per role in the backend seeder. To add or modify permissions, update the PermissionSeeder and re-run it.
        </div>

        {isLoading && (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-24" />)}
          </div>
        )}
        {error && <p className="text-sm text-destructive">{getApiErrorMessage(error)}</p>}
        {roles?.map((role) => (
          <Card key={role.id} className="p-5 space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-semibold">{role.name}</p>
                  <p className="text-xs text-muted-foreground font-mono">{role.slug}</p>
                </div>
              </div>
              <Badge variant={role.is_active ? "default" : "secondary"}>
                {role.is_active ? "Active" : "Inactive"}
              </Badge>
            </div>
            {role.permissions && role.permissions.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {role.permissions.map((p) => (
                  <Badge key={p.id} variant="outline" className="text-xs font-mono">
                    {p.slug}
                  </Badge>
                ))}
              </div>
            )}
          </Card>
        ))}
      </div>
    </>
  );
}

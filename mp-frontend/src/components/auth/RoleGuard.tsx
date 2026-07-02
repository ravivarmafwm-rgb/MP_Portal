import { Navigate } from "@tanstack/react-router";
import { ShieldAlert } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { canAccessRoute } from "@/lib/roles";
import { Button } from "@/components/ui/button";
import { getDashboardPath } from "@/lib/roles";

interface RoleGuardProps {
  children: React.ReactNode;
  /** Route prefix to check, e.g. "/mla" */
  route: string;
}

/**
 * Redirects users who lack permission for the current route to their role dashboard.
 */
export function RoleGuard({ children, route }: RoleGuardProps) {
  const { user } = useAuth();
  const roleSlug = user?.role_slug ?? "";

  if (!canAccessRoute(roleSlug, route)) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 p-8 text-center">
        <ShieldAlert className="h-12 w-12 text-muted-foreground" />
        <div>
          <h2 className="text-xl font-bold">Access Denied</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Your role ({user?.role}) does not have permission to view this page.
          </p>
        </div>
        <Button asChild variant="outline">
          <a href={getDashboardPath(roleSlug)}>Go to My Dashboard</a>
        </Button>
      </div>
    );
  }

  return <>{children}</>;
}

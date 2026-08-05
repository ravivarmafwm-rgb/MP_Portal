import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard, Users, ShieldCheck, Settings2, Activity,
} from "lucide-react";
import { RoleGuard } from "@/components/auth/RoleGuard";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/admin")({
  head: () => ({ meta: [{ title: "Admin — MP Platform" }] }),
  component: AdminLayout,
});

const tabs = [
  { label: "Dashboard",   href: "/admin",             icon: LayoutDashboard, exact: true },
  { label: "Users",       href: "/admin/users",        icon: Users },
  { label: "Permissions", href: "/admin/permissions",  icon: ShieldCheck },
  { label: "Activity",    href: "/admin/activity",     icon: Activity },
  { label: "Settings",    href: "/admin/settings",     icon: Settings2 },
];

function AdminLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <RoleGuard route="/admin">
      {/* Top tab nav */}
      <div className="border-b border-border/70 bg-background px-4 md:px-8">
        <nav className="flex gap-1 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = tab.exact
              ? pathname === tab.href
              : pathname === tab.href || pathname.startsWith(tab.href + "/");
            return (
              <Link
                key={tab.href}
                to={tab.href as "/admin"}
                className={cn(
                  "flex shrink-0 items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors",
                  active
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Child route renders here */}
      <Outlet />
    </RoleGuard>
  );
}

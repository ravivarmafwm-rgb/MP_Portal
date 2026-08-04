import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useEffect } from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { AppHeader } from "@/components/layout/AppHeader";
import { CommandPalette } from "@/components/layout/CommandPalette";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { OfflineSyncBar } from "@/components/volunteers/OfflineSyncBar";
import { useAuth } from "@/lib/auth";
import { registerAutoSync } from "@/lib/offline-sync";
import { toast } from "sonner";

const VOLUNTEER_ROLES = [
  "volunteer",
  "village-coordinator",
  "mandal-coordinator",
  "assembly-coordinator",
  "constituency-coordinator",
];

export const Route = createFileRoute("/_app")({
  component: AppLayout,
});

function AppLayout() {
  const { user } = useAuth();
  const isFieldRole = user ? VOLUNTEER_ROLES.includes(user.role_slug) : false;

  useEffect(() => {
    if (!user?.id || !isFieldRole) return;
    const unregister = registerAutoSync(user.id, (result) => {
      if (result.synced > 0) {
        toast.success(`Auto-synced ${result.synced} draft${result.synced > 1 ? "s" : ""}.`);
      }
      if (result.failed > 0) {
        toast.error(`${result.failed} draft${result.failed > 1 ? "s" : ""} failed to auto-sync.`);
      }
    });
    return unregister;
  }, [user?.id, isFieldRole]);

  return (
    <ProtectedRoute>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="bg-muted/30">
          {isFieldRole && <OfflineSyncBar />}
          <AppHeader />
          <CommandPalette />
          <main className={cn("min-h-[calc(100dvh-4rem)]", isFieldRole ? "" : "")}>
            <Outlet />
          </main>
        </SidebarInset>
      </SidebarProvider>
    </ProtectedRoute>
  );
}

function cn(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

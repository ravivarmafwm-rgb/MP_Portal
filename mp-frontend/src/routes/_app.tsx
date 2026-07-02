import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { AppHeader } from "@/components/layout/AppHeader";
import { CommandPalette } from "@/components/layout/CommandPalette";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { isStoredAuthenticated } from "@/lib/auth-storage";

export const Route = createFileRoute("/_app")({
  beforeLoad: () => {
    if (!isStoredAuthenticated()) {
      throw redirect({ to: "/login", replace: true });
    }
  },
  component: AppLayout,
});

function AppLayout() {
  return (
    <ProtectedRoute>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="bg-muted/30">
          <AppHeader />
          <CommandPalette />
          <main className="min-h-[calc(100dvh-4rem)]">
            <Outlet />
          </main>
        </SidebarInset>
      </SidebarProvider>
    </ProtectedRoute>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { RoleGuard } from "@/components/auth/RoleGuard";
import { MpCommandCenter } from "@/components/dashboard/MpCommandCenter";

export const Route = createFileRoute("/_app/admin")({
  head: () => ({ meta: [{ title: "Admin Dashboard — MP Platform" }] }),
  component: AdminDashboardPage,
});

function AdminDashboardPage() {
  return (
    <RoleGuard route="/admin">
      <MpCommandCenter title="Admin Command Center" />
    </RoleGuard>
  );
}

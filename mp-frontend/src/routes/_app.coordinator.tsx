import { createFileRoute } from "@tanstack/react-router";
import { RoleGuard } from "@/components/auth/RoleGuard";
import { MpCommandCenter } from "@/components/dashboard/MpCommandCenter";

export const Route = createFileRoute("/_app/coordinator")({
  head: () => ({ meta: [{ title: "Coordinator Dashboard — MP Platform" }] }),
  component: CoordinatorDashboardPage,
});

function CoordinatorDashboardPage() {
  return (
    <RoleGuard route="/coordinator">
      <MpCommandCenter title="Coordinator Command Center" />
    </RoleGuard>
  );
}

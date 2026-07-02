import { createFileRoute } from "@tanstack/react-router";
import { RoleGuard } from "@/components/auth/RoleGuard";
import { MpCommandCenter } from "@/components/dashboard/MpCommandCenter";

export const Route = createFileRoute("/_app/staff")({
  head: () => ({ meta: [{ title: "Staff Dashboard — MP Platform" }] }),
  component: StaffDashboardPage,
});

function StaffDashboardPage() {
  return (
    <RoleGuard route="/staff">
      <MpCommandCenter title="Staff Operations Center" />
    </RoleGuard>
  );
}

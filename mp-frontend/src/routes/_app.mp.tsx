import { createFileRoute } from "@tanstack/react-router";
import { RoleGuard } from "@/components/auth/RoleGuard";
import { MpCommandCenter } from "@/components/dashboard/MpCommandCenter";

export const Route = createFileRoute("/_app/mp")({
  head: () => ({ meta: [{ title: "MP Command Center — MP Platform" }] }),
  component: MpDashboardPage,
});

function MpDashboardPage() {
  return (
    <RoleGuard route="/mp">
      <MpCommandCenter />
    </RoleGuard>
  );
}

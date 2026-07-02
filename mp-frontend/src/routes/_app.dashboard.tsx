import { createFileRoute } from "@tanstack/react-router";
import { RoleGuard } from "@/components/auth/RoleGuard";
import { MpCommandCenter } from "@/components/dashboard/MpCommandCenter";

export const Route = createFileRoute("/_app/dashboard")({
  head: () => ({
    meta: [
      { title: "Command Center — MP Constituency Platform" },
      { name: "description", content: "Live mission-control view of citizens, grievances, projects, schemes, volunteers and survey insights." },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  return (
    <RoleGuard route="/dashboard">
      <MpCommandCenter />
    </RoleGuard>
  );
}

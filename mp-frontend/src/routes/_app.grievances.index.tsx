import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/grievances/")({
  beforeLoad: () => {
    throw redirect({ to: "/grievances/dashboard" });
  },
});

import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/schemes/")({
  beforeLoad: () => {
    throw redirect({ to: "/schemes/dashboard" });
  },
});

import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/surveys/")({
  beforeLoad: () => {
    throw redirect({ to: "/surveys/dashboard" });
  },
});

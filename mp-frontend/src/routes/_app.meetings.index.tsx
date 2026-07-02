import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/meetings/")({
  component: () => <Navigate to="/meetings/dashboard" replace />,
});

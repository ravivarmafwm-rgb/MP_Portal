import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/citizens/")({
  component: () => <Navigate to="/citizens/dashboard" replace />,
});

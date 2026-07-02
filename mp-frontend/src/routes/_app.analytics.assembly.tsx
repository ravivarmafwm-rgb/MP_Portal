import { createFileRoute } from "@tanstack/react-router";
import { BarChart3 } from "lucide-react";
import { PlaceholderPage } from "@/components/layout/PlaceholderPage";

export const Route = createFileRoute("/_app/analytics/assembly")({
  head: () => ({
    meta: [
      { title: "Assembly Analytics — MP Constituency Platform" },
      { name: "description", content: "Assembly-segment level performance and trends." },
    ],
  }),
  component: () => (
    <PlaceholderPage
      title="Assembly Analytics"
      description="Assembly-segment level performance and trends."
      icon={BarChart3}
      emptyAction="Export"
      
    />
  ),
});

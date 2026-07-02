import { createFileRoute } from "@tanstack/react-router";
import { BarChart3 } from "lucide-react";
import { PlaceholderPage } from "@/components/layout/PlaceholderPage";

export const Route = createFileRoute("/_app/analytics/")({
  head: () => ({
    meta: [
      { title: "Analytics — MP Constituency Platform" },
      { name: "description", content: "Drill down from constituency to village with rich visual analytics." },
    ],
  }),
  component: () => (
    <PlaceholderPage
      title="Analytics · Overview"
      description="Drill down from constituency to village with rich visual analytics."
      icon={BarChart3}
      emptyAction="New Report"
    />
  ),
});

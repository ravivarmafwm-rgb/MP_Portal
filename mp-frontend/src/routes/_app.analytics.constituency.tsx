import { createFileRoute } from "@tanstack/react-router";
import { PieChart } from "lucide-react";
import { PlaceholderPage } from "@/components/layout/PlaceholderPage";

export const Route = createFileRoute("/_app/analytics/constituency")({
  head: () => ({
    meta: [
      { title: "Constituency Analytics — MP Constituency Platform" },
      { name: "description", content: "Top-level KPIs across your entire constituency." },
    ],
  }),
  component: () => (
    <PlaceholderPage
      title="Constituency Analytics"
      description="Top-level KPIs across your entire constituency."
      icon={PieChart}
      emptyAction="Export"
      
    />
  ),
});

import { createFileRoute } from "@tanstack/react-router";
import { Grid3x3 } from "lucide-react";
import { PlaceholderPage } from "@/components/layout/PlaceholderPage";

export const Route = createFileRoute("/_app/analytics/mandal")({
  head: () => ({
    meta: [
      { title: "Mandal Analytics — MP Constituency Platform" },
      { name: "description", content: "Mandal-wise rollups for ground operations and outreach." },
    ],
  }),
  component: () => (
    <PlaceholderPage
      title="Mandal Analytics"
      description="Mandal-wise rollups for ground operations and outreach."
      icon={Grid3x3}
      emptyAction="Export"
      
    />
  ),
});

import { createFileRoute } from "@tanstack/react-router";
import { MapPin } from "lucide-react";
import { PlaceholderPage } from "@/components/layout/PlaceholderPage";

export const Route = createFileRoute("/_app/analytics/village")({
  head: () => ({
    meta: [
      { title: "Village Analytics — MP Constituency Platform" },
      { name: "description", content: "Village-level deep dives with booth-grain insight." },
    ],
  }),
  component: () => (
    <PlaceholderPage
      title="Village Analytics"
      description="Village-level deep dives with booth-grain insight."
      icon={MapPin}
      emptyAction="Export"
      
    />
  ),
});

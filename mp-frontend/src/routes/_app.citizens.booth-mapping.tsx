import { createFileRoute } from "@tanstack/react-router";
import { MapPin } from "lucide-react";
import { PlaceholderPage } from "@/components/layout/PlaceholderPage";

export const Route = createFileRoute("/_app/citizens/booth-mapping")({
  head: () => ({
    meta: [
      { title: "Booth Mapping — MP Constituency Platform" },
      { name: "description", content: "Map every citizen to their polling booth, ward and assembly segment." },
    ],
  }),
  component: () => (
    <PlaceholderPage
      title="Booth Mapping"
      description="Map every citizen to their polling booth, ward and assembly segment."
      icon={MapPin}
      emptyAction="Map Booth"
      
    />
  ),
});

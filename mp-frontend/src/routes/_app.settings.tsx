import { createFileRoute } from "@tanstack/react-router";
import { Settings } from "lucide-react";
import { PlaceholderPage } from "@/components/layout/PlaceholderPage";

export const Route = createFileRoute("/_app/settings")({
  head: () => ({
    meta: [
      { title: "Settings — MP Constituency Platform" },
      { name: "description", content: "Workspace, team, integrations and security configuration." },
    ],
  }),
  component: () => (
    <PlaceholderPage
      title="Settings"
      description="Workspace, team, integrations and security configuration."
      icon={Settings}
      emptyAction="Save Changes"
      
    />
  ),
});

import { createFileRoute } from "@tanstack/react-router";
import { FolderOpen } from "lucide-react";
import { PlaceholderPage } from "@/components/layout/PlaceholderPage";

export const Route = createFileRoute("/_app/documents/")({
  head: () => ({
    meta: [
      { title: "Documents — MP Constituency Platform" },
      { name: "description", content: "Citizen records and project documentation — searchable and secure." },
    ],
  }),
  component: () => (
    <PlaceholderPage
      title="Documents · Overview"
      description="Citizen records and project documentation — searchable and secure."
      icon={FolderOpen}
      emptyAction="Upload"
    />
  ),
});

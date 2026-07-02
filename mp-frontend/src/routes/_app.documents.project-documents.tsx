import { createFileRoute } from "@tanstack/react-router";
import { Folder } from "lucide-react";
import { PlaceholderPage } from "@/components/layout/PlaceholderPage";

export const Route = createFileRoute("/_app/documents/project-documents")({
  head: () => ({
    meta: [
      { title: "Project Documents — MP Constituency Platform" },
      { name: "description", content: "Sanction letters, utilisation certificates, photos and progress reports." },
    ],
  }),
  component: () => (
    <PlaceholderPage
      title="Project Documents"
      description="Sanction letters, utilisation certificates, photos and progress reports."
      icon={Folder}
      emptyAction="Upload"
      
    />
  ),
});

import { createFileRoute } from "@tanstack/react-router";
import { FileText } from "lucide-react";
import { PlaceholderPage } from "@/components/layout/PlaceholderPage";

export const Route = createFileRoute("/_app/documents/citizen-documents")({
  head: () => ({
    meta: [
      { title: "Citizen Documents — MP Constituency Platform" },
      { name: "description", content: "Aadhaar, ration cards, certificates and verifications attached to citizen profiles." },
    ],
  }),
  component: () => (
    <PlaceholderPage
      title="Citizen Documents"
      description="Aadhaar, ration cards, certificates and verifications attached to citizen profiles."
      icon={FileText}
      emptyAction="Upload"
      
    />
  ),
});

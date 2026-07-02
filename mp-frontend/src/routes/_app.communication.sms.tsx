import { createFileRoute } from "@tanstack/react-router";
import { MessageSquare } from "lucide-react";
import { PlaceholderPage } from "@/components/layout/PlaceholderPage";

export const Route = createFileRoute("/_app/communication/sms")({
  head: () => ({
    meta: [
      { title: "SMS — MP Constituency Platform" },
      { name: "description", content: "Bulk SMS campaigns with DLT compliance and delivery tracking." },
    ],
  }),
  component: () => (
    <PlaceholderPage
      title="SMS"
      description="Bulk SMS campaigns with DLT compliance and delivery tracking."
      icon={MessageSquare}
      emptyAction="New SMS"
      
    />
  ),
});

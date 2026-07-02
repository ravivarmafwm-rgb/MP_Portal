import { createFileRoute } from "@tanstack/react-router";
import { MessageCircle } from "lucide-react";
import { PlaceholderPage } from "@/components/layout/PlaceholderPage";

export const Route = createFileRoute("/_app/communication/whatsapp")({
  head: () => ({
    meta: [
      { title: "WhatsApp — MP Constituency Platform" },
      { name: "description", content: "WhatsApp templates, broadcasts and 1:1 conversations." },
    ],
  }),
  component: () => (
    <PlaceholderPage
      title="WhatsApp"
      description="WhatsApp templates, broadcasts and 1:1 conversations."
      icon={MessageCircle}
      emptyAction="New Broadcast"
      
    />
  ),
});

import { createFileRoute } from "@tanstack/react-router";
import { Megaphone } from "lucide-react";
import { PlaceholderPage } from "@/components/layout/PlaceholderPage";

export const Route = createFileRoute("/_app/communication/")({
  head: () => ({
    meta: [
      { title: "Communication Hub — MP Constituency Platform" },
      { name: "description", content: "Broadcast and one-to-one outreach across SMS, WhatsApp and email." },
    ],
  }),
  component: () => (
    <PlaceholderPage
      title="Communication Hub · Overview"
      description="Broadcast and one-to-one outreach across SMS, WhatsApp and email."
      icon={Megaphone}
      emptyAction="New Campaign"
    />
  ),
});

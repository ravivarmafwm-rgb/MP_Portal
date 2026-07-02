import { createFileRoute } from "@tanstack/react-router";
import { Mail } from "lucide-react";
import { PlaceholderPage } from "@/components/layout/PlaceholderPage";

export const Route = createFileRoute("/_app/communication/email")({
  head: () => ({
    meta: [
      { title: "Email — MP Constituency Platform" },
      { name: "description", content: "Email newsletters, updates and constituent communication." },
    ],
  }),
  component: () => (
    <PlaceholderPage
      title="Email"
      description="Email newsletters, updates and constituent communication."
      icon={Mail}
      emptyAction="New Email"
      
    />
  ),
});

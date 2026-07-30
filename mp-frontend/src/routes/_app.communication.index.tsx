import { createFileRoute } from "@tanstack/react-router";
import { CommunicationOverview } from "@/components/communication/CommunicationOverview";
export const Route = createFileRoute("/_app/communication/")({
  component: CommunicationOverview,
});

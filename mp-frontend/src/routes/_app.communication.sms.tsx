import { createFileRoute } from "@tanstack/react-router";
import { CommunicationChannelPage } from "@/components/communication/CommunicationChannelPage";
export const Route = createFileRoute("/_app/communication/sms")({
  component: () => <CommunicationChannelPage channel="sms" />,
});

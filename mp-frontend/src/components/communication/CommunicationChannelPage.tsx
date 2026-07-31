import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CalendarClock, Plus, Search } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  approveCommunicationCampaign,
  createCommunicationCampaign,
  dispatchCommunicationCampaign,
  fetchCommunicationCampaigns,
  fetchCommunicationTemplates,
  getApiErrorMessage,
  retryCommunicationCampaign,
  type CommunicationCampaignRecord,
} from "@/lib/api";
import { useAuth } from "@/lib/auth";

type Channel = "sms" | "whatsapp" | "email" | "voice";
export function CommunicationChannelPage({ channel }: { channel: Channel }) {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const query = useQuery({
    queryKey: ["communication-campaigns", channel, search, page],
    queryFn: () =>
      fetchCommunicationCampaigns({ channel, search, page, per_page: 20 }),
    placeholderData: (previous) => previous,
  });
  const canApprove = ["super-admin", "mp", "mp-staff"].includes(
    user?.role_slug ?? "",
  );
  return (
    <>
      <PageHeader
        title={
          channel === "sms"
            ? "SMS"
            : channel === "whatsapp"
              ? "WhatsApp"
              : channel === "voice"
                ? "Voice & IVR"
                : "Email"
        }
        description="Consent-aware campaigns with delivery status and provider tracking."
        actions={<CampaignDialog channel={channel} />}
      />
      <div className="space-y-4 p-4 md:p-8">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-9"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search campaigns"
          />
        </div>
        {query.isError ? (
          <Card className="p-8 text-center text-destructive">
            {getApiErrorMessage(query.error)}
          </Card>
        ) : query.isLoading ? (
          <Card className="p-8 text-center text-muted-foreground">
            Loading campaigns...
          </Card>
        ) : query.data?.data.length === 0 ? (
          <Card className="p-8 text-center text-muted-foreground">
            No {channel} campaigns found.
          </Card>
        ) : (
          <div className="space-y-3">
            {query.data?.data.map((c) => (
              <Card key={c.id} className="p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="font-semibold">{c.name}</div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {c.campaign_number} · {c.purpose.replaceAll("_", " ")}
                    </div>
                  </div>
                  <Badge variant="secondary" className="capitalize">
                    {c.status}
                  </Badge>
                </div>
                <div className="mt-3 grid grid-cols-4 gap-2 text-xs">
                  <Metric label="Recipients" value={c.recipient_count} />
                  <Metric label="Sent" value={c.sent_count} />
                  <Metric label="Delivered" value={c.delivered_count} />
                  <Metric label="Failed" value={c.failed_count} />
                </div>
                {c.scheduled_at && (
                  <div className="mt-3 flex items-center gap-1 text-xs text-muted-foreground">
                    <CalendarClock className="h-3.5 w-3.5" />
                    {new Date(c.scheduled_at).toLocaleString()}
                  </div>
                )}
                <CampaignActions campaign={c} canApprove={canApprove} />
              </Card>
            ))}
          </div>
        )}
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {query.data?.total ?? 0} campaigns
          </span>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={page <= 1 || query.isFetching}
              onClick={() => setPage((v) => v - 1)}
            >
              Previous
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={
                !query.data || page >= query.data.last_page || query.isFetching
              }
              onClick={() => setPage((v) => v + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

function CampaignActions({
  campaign,
  canApprove,
}: {
  campaign: CommunicationCampaignRecord;
  canApprove: boolean;
}) {
  const client = useQueryClient();
  const action = useMutation({
    mutationFn: async (kind: "approve" | "dispatch" | "retry") =>
      kind === "approve"
        ? approveCommunicationCampaign(campaign.id)
        : kind === "dispatch"
          ? dispatchCommunicationCampaign(campaign.id)
          : retryCommunicationCampaign(campaign.id),
    onSuccess: async (result) => {
      toast.success(
        "message" in result ? result.message : "Campaign approved.",
      );
      await client.invalidateQueries({
        queryKey: ["communication-campaigns", campaign.channel],
      });
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
  return (
    <div className="mt-3 flex gap-2">
      {canApprove && ["draft", "scheduled"].includes(campaign.status) && (
        <Button
          size="sm"
          variant="outline"
          disabled={action.isPending}
          onClick={() => action.mutate("approve")}
        >
          Approve
        </Button>
      )}
      {campaign.status === "approved" && (
        <Button
          size="sm"
          disabled={action.isPending}
          onClick={() => action.mutate("dispatch")}
        >
          Queue delivery
        </Button>
      )}
      {campaign.failed_count > 0 && (
        <Button
          size="sm"
          variant="outline"
          disabled={action.isPending}
          onClick={() => action.mutate("retry")}
        >
          Retry failed
        </Button>
      )}
    </div>
  );
}
function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded border p-2">
      <div className="text-muted-foreground">{label}</div>
      <strong>{value}</strong>
    </div>
  );
}
function CampaignDialog({ channel }: { channel: Channel }) {
  const client = useQueryClient();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [purpose, setPurpose] = useState("general");
  const [audience, setAudience] = useState("citizens");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [templateId, setTemplateId] = useState("");
  const templates = useQuery({
    queryKey: ["communication-templates", channel, "approved"],
    queryFn: () =>
      fetchCommunicationTemplates({
        channel,
        status: "approved",
        per_page: 100,
      }),
    enabled: open,
  });
  const mutation = useMutation({
    mutationFn: () =>
      createCommunicationCampaign({
        name,
        channel,
        purpose,
        audience_type: audience,
        template_id: templateId && templateId !== "none" ? templateId : null,
        subject: channel === "email" ? subject : null,
        body: body || null,
        scheduled_at: scheduledAt ? new Date(scheduledAt).toISOString() : null,
      }),
    onSuccess: async () => {
      toast.success("Campaign saved.");
      setOpen(false);
      await client.invalidateQueries({
        queryKey: ["communication-campaigns", channel],
      });
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New campaign
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New {channel} campaign</DialogTitle>
          <DialogDescription>
            Saving creates a controlled draft or scheduled campaign. Delivery
            requires consent and a configured provider.
          </DialogDescription>
        </DialogHeader>
        <form
          className="space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            mutation.mutate();
          }}
        >
          <Field label="Campaign name">
            <Input
              required
              maxLength={255}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Purpose">
              <Select value={purpose} onValueChange={setPurpose}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[
                    "general",
                    "status_update",
                    "event_invitation",
                    "citizen_notification",
                    "volunteer_communication",
                    "department_follow_up",
                    "ivr_survey",
                  ].map((v) => (
                    <SelectItem key={v} value={v}>
                      {v.replaceAll("_", " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Audience">
              <Select value={audience} onValueChange={setAudience}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="citizens">Citizens</SelectItem>
                  <SelectItem value="volunteers">Volunteers</SelectItem>
                  <SelectItem value="departments">Departments</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </div>
          <Field
            label={
              channel === "email"
                ? "Approved template (optional)"
                : "Approved provider template"
            }
          >
            <Select value={templateId} onValueChange={setTemplateId}>
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    templates.isLoading
                      ? "Loading templates..."
                      : "Select template"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {channel === "email" && (
                  <SelectItem value="none">No template</SelectItem>
                )}
                {templates.data?.data.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          {channel === "email" && (
            <Field label="Subject">
              <Input
                required={!templateId || templateId === "none"}
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </Field>
          )}
          <Field
            label={
              templateId && templateId !== "none"
                ? "Message override (optional)"
                : "Message"
            }
          >
            <Textarea
              required={!templateId || templateId === "none"}
              maxLength={10000}
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
          </Field>
          <Field label="Schedule (optional)">
            <Input
              type="datetime-local"
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
            />
          </Field>
          <Button
            className="w-full"
            disabled={
              mutation.isPending || (channel !== "email" && !templateId)
            }
          >
            {mutation.isPending ? "Saving..." : "Save campaign"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <div className="mt-1">{children}</div>
    </div>
  );
}

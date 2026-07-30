import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Megaphone, Pencil, Plus } from "lucide-react";
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
  fetchCommunicationDashboard,
  fetchCommunicationTemplates,
  getApiErrorMessage,
  saveCommunicationTemplate,
  type CommunicationTemplateRecord,
} from "@/lib/api";
import { ConsentDialog } from "@/components/communication/ConsentDialog";
export function CommunicationOverview() {
  const dashboard = useQuery({
    queryKey: ["communication-dashboard"],
    queryFn: fetchCommunicationDashboard,
  });
  const templates = useQuery({
    queryKey: ["communication-templates"],
    queryFn: () => fetchCommunicationTemplates({ per_page: 50 }),
  });
  if (dashboard.isError || templates.isError)
    return (
      <>
        <PageHeader
          title="Communication Hub"
          description="Consent-aware constituency outreach."
        />
        <div className="p-8">
          <Card className="p-8 text-center text-destructive">
            {getApiErrorMessage(dashboard.error ?? templates.error)}
          </Card>
        </div>
      </>
    );
  return (
    <>
      <PageHeader
        title="Communication Hub"
        description="Templates, approvals, provider delivery and status tracking."
        actions={
          <>
            <ConsentDialog />
            <TemplateDialog />
          </>
        }
      />
      <div className="space-y-5 p-4 md:p-8">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {[
            ["Campaigns", dashboard.data?.total],
            ["Draft", dashboard.data?.draft],
            ["Scheduled", dashboard.data?.scheduled],
            ["Completed", dashboard.data?.completed],
            ["Failed recipients", dashboard.data?.failed_recipients],
          ].map(([label, value]) => (
            <Card key={String(label)} className="p-4">
              <div className="text-xs text-muted-foreground">{label}</div>
              <div className="mt-1 text-2xl font-bold">{value ?? 0}</div>
            </Card>
          ))}
        </div>
        <Card className="p-5">
          <div className="flex items-center gap-2">
            <Megaphone className="h-5 w-5 text-primary" />
            <h2 className="font-semibold">Message templates</h2>
          </div>
          {templates.isLoading ? (
            <p className="mt-4 text-sm text-muted-foreground">
              Loading templates...
            </p>
          ) : templates.data?.data.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">
              No templates have been configured.
            </p>
          ) : (
            <div className="mt-4 space-y-2">
              {templates.data?.data.map((template) => (
                <div
                  key={template.id}
                  className="flex items-center justify-between rounded border p-3"
                >
                  <div>
                    <div className="font-medium">{template.name}</div>
                    <div className="text-xs text-muted-foreground capitalize">
                      {template.channel} ·{" "}
                      {template.purpose.replaceAll("_", " ")}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="capitalize">
                      {template.status}
                    </Badge>
                    <TemplateDialog template={template} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </>
  );
}
function TemplateDialog({
  template,
}: {
  template?: CommunicationTemplateRecord;
}) {
  const client = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: template?.name ?? "",
    channel: template?.channel ?? "sms",
    purpose: template?.purpose ?? "general",
    subject: template?.subject ?? "",
    body: template?.body ?? "",
    provider_template_id: template?.provider_template_id ?? "",
    dlt_entity_id: template?.dlt_entity_id ?? "",
    dlt_template_id: template?.dlt_template_id ?? "",
    status: template?.status ?? "draft",
    is_active: template?.is_active ?? true,
  });
  const set = (key: keyof typeof form, value: string | boolean) =>
    setForm((current) => ({ ...current, [key]: value }));
  const mutation = useMutation({
    mutationFn: () =>
      saveCommunicationTemplate(
        {
          ...form,
          subject: form.subject || null,
          provider_template_id: form.provider_template_id || null,
          dlt_entity_id: form.dlt_entity_id || null,
          dlt_template_id: form.dlt_template_id || null,
        },
        template?.id,
      ),
    onSuccess: async () => {
      toast.success(template ? "Template updated." : "Template created.");
      setOpen(false);
      await client.invalidateQueries({ queryKey: ["communication-templates"] });
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant={template ? "ghost" : "default"}>
          {template ? (
            <Pencil className="h-3.5 w-3.5" />
          ) : (
            <>
              <Plus className="mr-2 h-4 w-4" />
              New template
            </>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {template ? "Edit" : "New"} communication template
          </DialogTitle>
          <DialogDescription>
            SMS and WhatsApp delivery require approved provider identifiers.
          </DialogDescription>
        </DialogHeader>
        <form
          className="space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            mutation.mutate();
          }}
        >
          <Field label="Name">
            <Input
              required
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Channel">
              <Select
                value={form.channel}
                onValueChange={(v) => set("channel", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["sms", "whatsapp", "email", "voice"].map((v) => (
                    <SelectItem key={v} value={v}>
                      {v}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Purpose">
              <Select
                value={form.purpose}
                onValueChange={(v) => set("purpose", v)}
              >
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
          </div>
          {form.channel === "email" && (
            <Field label="Subject">
              <Input
                required
                value={form.subject}
                onChange={(e) => set("subject", e.target.value)}
              />
            </Field>
          )}
          <Field label="Body">
            <Textarea
              required
              value={form.body}
              onChange={(e) => set("body", e.target.value)}
            />
          </Field>
          {form.channel === "sms" && (
            <div className="grid grid-cols-2 gap-3">
              <Field label="DLT entity ID">
                <Input
                  value={form.dlt_entity_id}
                  onChange={(e) => set("dlt_entity_id", e.target.value)}
                />
              </Field>
              <Field label="DLT template ID">
                <Input
                  required={form.status === "approved"}
                  value={form.dlt_template_id}
                  onChange={(e) => set("dlt_template_id", e.target.value)}
                />
              </Field>
            </div>
          )}
          {(form.channel === "whatsapp" || form.channel === "voice") && (
            <Field label="Provider template name">
              <Input
                required={form.status === "approved"}
                value={form.provider_template_id}
                onChange={(e) => set("provider_template_id", e.target.value)}
              />
            </Field>
          )}
          <Field label="Status">
            <Select value={form.status} onValueChange={(v) => set("status", v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["draft", "approved", "archived"].map((v) => (
                  <SelectItem key={v} value={v}>
                    {v}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Button className="w-full" disabled={mutation.isPending}>
            {mutation.isPending ? "Saving..." : "Save template"}
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

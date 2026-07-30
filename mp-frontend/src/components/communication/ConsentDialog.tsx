import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ShieldCheck } from "lucide-react";
import { toast } from "sonner";
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
import {
  getApiErrorMessage,
  recordCommunicationConsent,
  searchCommunicationContacts,
} from "@/lib/api";
export function ConsentDialog() {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState("citizen");
  const [search, setSearch] = useState("");
  const [contactId, setContactId] = useState("");
  const [channel, setChannel] = useState("sms");
  const [purpose, setPurpose] = useState("general");
  const [decision, setDecision] = useState("grant");
  const [source, setSource] = useState("written");
  const [proof, setProof] = useState("");
  const contacts = useQuery({
    queryKey: ["communication-contacts", type, search],
    queryFn: () => searchCommunicationContacts(type, search),
    enabled: open && search.trim().length >= 2,
  });
  const mutation = useMutation({
    mutationFn: () =>
      recordCommunicationConsent({
        contact_type: type,
        contact_id: contactId,
        channel,
        purpose,
        is_granted: decision === "grant",
        source,
        proof_reference: proof,
      }),
    onSuccess: () => {
      toast.success(
        decision === "grant" ? "Consent recorded." : "Consent revoked.",
      );
      setOpen(false);
      setContactId("");
      setSearch("");
      setProof("");
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <ShieldCheck className="mr-2 h-4 w-4" />
          Manage consent
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Communication consent</DialogTitle>
          <DialogDescription>
            Search is geography-scoped. A proof reference is mandatory.
          </DialogDescription>
        </DialogHeader>
        <form
          className="space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            mutation.mutate();
          }}
        >
          <div className="grid grid-cols-2 gap-3">
            <Field label="Contact type">
              <Select
                value={type}
                onValueChange={(v) => {
                  setType(v);
                  setContactId("");
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["citizen", "volunteer", "department"].map((v) => (
                    <SelectItem key={v} value={v}>
                      {v}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Search">
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Name, phone or email"
              />
            </Field>
          </div>
          <Field label="Contact">
            <Select required value={contactId} onValueChange={setContactId}>
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    contacts.isLoading ? "Searching..." : "Select contact"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {contacts.data?.map((contact) => (
                  <SelectItem key={contact.id} value={contact.id}>
                    {contact.name} ·{" "}
                    {contact.mobile ?? contact.email ?? "no destination"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Channel">
              <Select value={channel} onValueChange={setChannel}>
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
            <Field label="Decision">
              <Select value={decision} onValueChange={setDecision}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="grant">Grant</SelectItem>
                  <SelectItem value="revoke">Revoke</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label="Evidence source">
              <Select value={source} onValueChange={setSource}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["written", "digital", "verbal_recorded", "imported"].map(
                    (v) => (
                      <SelectItem key={v} value={v}>
                        {v.replaceAll("_", " ")}
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>
            </Field>
          </div>
          <Field label="Proof reference">
            <Input
              required
              maxLength={500}
              value={proof}
              onChange={(e) => setProof(e.target.value)}
              placeholder="Signed form, recording or import reference"
            />
          </Field>
          <Button
            className="w-full"
            disabled={mutation.isPending || !contactId}
          >
            {mutation.isPending ? "Saving..." : "Record decision"}
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

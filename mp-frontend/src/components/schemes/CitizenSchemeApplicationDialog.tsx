import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Landmark,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  Info,
  ChevronDown,
  ChevronUp,
  UserRound,
  Users,
  Building2,
  Clock,
  Coins,
} from "lucide-react";
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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import {
  fetchCitizenSchemes,
  fetchMyCitizen,
  fetchMyFamily,
  getApiErrorMessage,
  submitCitizenSchemeApplication,
  type SchemeRecord,
  type MyCitizenRecord,
} from "@/lib/api";
import { saveDraft } from "@/lib/offline-store";
import { useAuth } from "@/lib/auth";

export function CitizenSchemeApplicationDialog() {
  const client = useQueryClient();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [schemeId, setSchemeId] = useState("");
  const [targetCitizenId, setTargetCitizenId] = useState<string>("");
  const [remarks, setRemarks] = useState("");
  const [detailsOpen, setDetailsOpen] = useState(false);

  const schemes = useQuery({
    queryKey: ["citizen-schemes"],
    queryFn: fetchCitizenSchemes,
    enabled: open,
  });
  const citizen = useQuery<MyCitizenRecord>({
    queryKey: ["my-citizen"],
    queryFn: fetchMyCitizen,
    enabled: open,
  });
  const family = useQuery({
    queryKey: ["my-family"],
    queryFn: fetchMyFamily,
    enabled: open,
  });

  const selectedScheme: SchemeRecord | undefined = useMemo(
    () => schemes.data?.data.find((s) => s.id === schemeId),
    [schemeId, schemes.data],
  );

  const isFamilyHead = useMemo(() => {
    if (!citizen.data?.family?.head_citizen_id || !citizen.data?.id) return false;
    return citizen.data.family.head_citizen_id === citizen.data.id;
  }, [citizen.data]);

  const familyMemberOptions = useMemo(() => {
    const list: { id: string; name: string; relationship: string }[] = [];
    if (citizen.data) {
      list.push({
        id: citizen.data.id,
        name: `${citizen.data.first_name} ${citizen.data.last_name} (Myself)`,
        relationship: "Self",
      });
    }
    if (isFamilyHead && family.data?.family_members) {
      family.data.family_members.forEach((m) => {
        if (m.citizen.id !== citizen.data?.id) {
          list.push({
            id: m.citizen.id,
            name: `${m.citizen.first_name} ${m.citizen.last_name}`,
            relationship: m.relationship_with_head ?? "Member",
          });
        }
      });
    }
    return list;
  }, [citizen.data, isFamilyHead, family.data]);

  const mutation = useMutation({
    mutationFn: async () => {
      const payload = {
        scheme_id: schemeId,
        remarks,
        application_source: "citizen",
        target_citizen_id:
          targetCitizenId && targetCitizenId !== citizen.data?.id
            ? targetCitizenId
            : undefined,
      };
      if (!navigator.onLine) {
        if (!user?.id) throw new Error("You must be signed in to save an offline application.");
        await saveDraft({ id: `draft_scheme_${crypto.randomUUID()}`, type: "scheme_application", status: "pending", payload: JSON.stringify(payload), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), retries: 0, userId: user.id, label: `Scheme application for ${selectedScheme?.name ?? "scheme"}` });
        return null;
      }
      try { return await submitCitizenSchemeApplication(payload); }
      catch (error) {
        if (!navigator.onLine && user?.id) {
          await saveDraft({ id: `draft_scheme_${crypto.randomUUID()}`, type: "scheme_application", status: "pending", payload: JSON.stringify(payload), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), retries: 0, userId: user.id, label: `Scheme application for ${selectedScheme?.name ?? "scheme"}` });
          return null;
        }
        throw error;
      }
    },
    onSuccess: async (application) => {
      toast.success(application ? `Application ${application.application_number} submitted.` : "Saved offline. It will sync automatically when online.");
      setOpen(false);
      setSchemeId("");
      setTargetCitizenId("");
      setRemarks("");
      setDetailsOpen(false);
      await Promise.all([
        client.invalidateQueries({ queryKey: ["my-scheme-applications"] }),
        client.invalidateQueries({ queryKey: ["my-citizen"] }),
      ]);
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });

  const resetState = () => {
    if (!open) {
      setSchemeId("");
      setTargetCitizenId("");
      setRemarks("");
      setDetailsOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) resetState(); }}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Landmark className="mr-1 h-4 w-4" />
          Apply for scheme
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Landmark className="h-5 w-5 text-primary" />
            Apply for a government scheme
          </DialogTitle>
          <DialogDescription>
            Browse active schemes, check eligibility and required documents, then
            submit for yourself or on behalf of your family members.
          </DialogDescription>
        </DialogHeader>

        {schemes.isError ? (
          <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            {getApiErrorMessage(schemes.error)}
          </div>
        ) : (
          <form
            className="space-y-5"
            onSubmit={(event) => {
              event.preventDefault();
              mutation.mutate();
            }}
          >
            <div className="space-y-2">
              <Label>Scheme catalog</Label>
              <Select
                value={schemeId}
                onValueChange={(v) => {
                  setSchemeId(v);
                  setDetailsOpen(true);
                }}
                disabled={schemes.isLoading}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      schemes.isLoading ? "Loading schemes…" : "Search and select a scheme"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {schemes.data?.data.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name}
                      {s.category ? ` · ${s.category}` : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {isFamilyHead && familyMemberOptions.length > 1 && (
              <div className="space-y-2">
                <Label className="flex items-center gap-1.5">
                  <Users className="h-4 w-4" />
                  Applying on behalf of
                </Label>
                <Select
                  value={targetCitizenId || citizen.data?.id || ""}
                  onValueChange={setTargetCitizenId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select family member" />
                  </SelectTrigger>
                  <SelectContent>
                    {familyMemberOptions.map((m) => (
                      <SelectItem key={m.id} value={m.id}>
                        {m.name}
                        {m.relationship !== "Self" ? ` · ${m.relationship}` : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {selectedScheme && (
              <Collapsible
                open={detailsOpen}
                onOpenChange={setDetailsOpen}
                className="rounded-xl border"
              >
                <CollapsibleTrigger asChild>
                  <div
                    role="button"
                    tabIndex={0}
                    className="flex cursor-pointer items-center justify-between border-b bg-muted/30 px-4 py-3 text-sm font-medium"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") setDetailsOpen((v) => !v);
                    }}
                  >
                    <span>
                      <Info className="mr-1.5 inline h-4 w-4 align-sub text-muted-foreground" />
                      Details for {selectedScheme.name}
                    </span>
                    {detailsOpen ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="space-y-4 p-4">
                    <div className="flex flex-wrap gap-2">
                      {selectedScheme.category && (
                        <Badge variant="secondary">{selectedScheme.category}</Badge>
                      )}
                      <Badge variant="outline" className="gap-1">
                        <Building2 className="h-3 w-3" />
                        {selectedScheme.department?.name ?? "Department TBD"}
                      </Badge>
                      <Badge variant="outline" className="gap-1">
                        <Clock className="h-3 w-3" />
                        SLA {selectedScheme.sla_days}d
                      </Badge>
                      {selectedScheme.max_amount && (
                        <Badge variant="outline" className="gap-1">
                          <Coins className="h-3 w-3" />
                          ₹
                          {Number(selectedScheme.max_amount).toLocaleString(
                            "en-IN",
                          )}{" "}
                          max
                        </Badge>
                      )}
                    </div>

                    {selectedScheme.description && (
                      <p className="text-sm text-muted-foreground">
                        {selectedScheme.description}
                      </p>
                    )}

                    {selectedScheme.benefits && (
                      <Card className="border-success/30 bg-success/5 p-4">
                        <h5 className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-success-foreground">
                          <CheckCircle2 className="h-4 w-4" />
                          Benefits
                        </h5>
                        <p className="whitespace-pre-line text-sm">
                          {selectedScheme.benefits}
                        </p>
                      </Card>
                    )}

                    {selectedScheme.eligibility && (
                      <Card className="p-4">
                        <h5 className="mb-2 flex items-center gap-1.5 text-sm font-semibold">
                          <AlertCircle className="h-4 w-4 text-primary" />
                          Eligibility
                        </h5>
                        <p className="whitespace-pre-line text-sm text-muted-foreground">
                          {selectedScheme.eligibility}
                        </p>
                        {selectedScheme.eligibility_rules &&
                          selectedScheme.eligibility_rules.length > 0 && (
                            <ul className="mt-3 space-y-1.5 text-sm">
                              {selectedScheme.eligibility_rules.map((r) => (
                                <li
                                  key={r.id}
                                  className={cn(
                                    "flex items-start gap-2",
                                    r.is_mandatory ? "" : "text-muted-foreground",
                                  )}
                                >
                                  {r.is_mandatory ? (
                                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                                  ) : (
                                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 opacity-50" />
                                  )}
                                  <span>
                                    <span className="font-medium">
                                      {r.rule_name}
                                    </span>
                                    {r.error_message
                                      ? ` — ${r.error_message}`
                                      : r.condition
                                        ? ` — ${r.condition}`
                                        : ""}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          )}
                      </Card>
                    )}

                    {(selectedScheme.required_documents?.length ?? 0) > 0 ? (
                      <Card className="p-4">
                        <h5 className="mb-2 flex items-center gap-1.5 text-sm font-semibold">
                          <FileCheck className="h-4 w-4 text-amber-600" />
                          Required documents
                        </h5>
                        <ul className="space-y-2 text-sm">
                          {selectedScheme.required_documents!.map((d) => (
                            <li
                              key={d.id}
                              className="flex items-start justify-between gap-3 rounded-md border p-3"
                            >
                              <div className="flex items-start gap-2">
                                {d.is_mandatory ? (
                                  <Badge
                                    variant="destructive"
                                    className="shrink-0"
                                  >
                                    Required
                                  </Badge>
                                ) : (
                                  <Badge
                                    variant="secondary"
                                    className="shrink-0"
                                  >
                                    Optional
                                  </Badge>
                                )}
                                <div>
                                  <div className="font-medium">{d.name}</div>
                                  {d.description && (
                                    <div className="text-xs text-muted-foreground">
                                      {d.description}
                                    </div>
                                  )}
                                  {d.document_category?.name && (
                                    <div className="mt-0.5 text-xs text-muted-foreground">
                                      Category: {d.document_category.name}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </Card>
                    ) : (
                      <p className="text-xs text-muted-foreground">
                        No required-document checklist has been configured for this
                        scheme yet.
                      </p>
                    )}

                    <Separator />

                    <div className="grid gap-3 text-xs text-muted-foreground sm:grid-cols-2">
                      {selectedScheme.helpline_number && (
                        <div>
                          <span className="font-medium">Helpline: </span>
                          {selectedScheme.helpline_number}
                        </div>
                      )}
                      {selectedScheme.website_url && (
                        <div>
                          <span className="font-medium">Website: </span>
                          <a
                            href={selectedScheme.website_url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-primary hover:underline"
                          >
                            Open
                          </a>
                        </div>
                      )}
                      <div>
                        <span className="font-medium">Mode: </span>
                        <span className="capitalize">
                          {selectedScheme.application_mode.replace("_", " / ")}
                        </span>
                      </div>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            )}

            <div className="space-y-2">
              <Label htmlFor="citizen-scheme-remarks">
                Supporting remarks (optional)
              </Label>
              <Textarea
                id="citizen-scheme-remarks"
                maxLength={2000}
                rows={3}
                value={remarks}
                onChange={(event) => setRemarks(event.target.value)}
                placeholder="Any additional context, hardship information, or notes to the reviewer."
              />
            </div>

            <Button
              className="w-full"
              disabled={!schemeId || mutation.isPending}
            >
              {mutation.isPending ? (
                "Submitting application…"
              ) : (
                <>
                  <UserRound className="mr-1.5 h-4 w-4" />
                  Submit application
                </>
              )}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

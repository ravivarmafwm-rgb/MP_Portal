import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  User, FileText, MapPin, Vote, Users, FolderOpen, ClipboardCheck,
  ChevronRight, ChevronLeft, Check, Loader2, ArrowLeft, WifiOff, Info,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  createCitizen, createFamily, uploadDocument, fetchLocMandals, fetchLocVillages,
  fetchLocWards, fetchLocPollingBooths, fetchFamilies, getApiErrorMessage,
} from "@/lib/api";
import { saveDraft, saveDocument, fileToBase64, type OfflineDocument } from "@/lib/offline-store";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import { RoleGuard } from "@/components/auth/RoleGuard";

export const Route = createFileRoute("/_app/citizens/create-profile")({
  head: () => ({ meta: [{ title: "Enroll Citizen — MP Platform" }] }),
  component: CreateCitizenPage,
});

const STEPS = [
  { id: 1, label: "Personal",  icon: User },
  { id: 2, label: "Identity",  icon: FileText },
  { id: 3, label: "Address",   icon: MapPin },
  { id: 4, label: "Political", icon: Vote },
  { id: 5, label: "Family",    icon: Users },
  { id: 6, label: "Documents", icon: FolderOpen },
  { id: 7, label: "Review",    icon: ClipboardCheck },
];

const schema = z.object({
  first_name:    z.string().min(1, "Required"),
  middle_name:   z.string().optional(),
  last_name:     z.string().min(1, "Required"),
  date_of_birth: z.string().min(1, "Required"),
  gender:        z.enum(["Male", "Female", "Other"]),
  mobile_number: z.string().regex(/^[6-9][0-9]{9}$/, "Enter valid 10-digit mobile"),
  alternate_mobile: z.string().optional(),
  email:         z.string().email("Invalid email").optional().or(z.literal("")),
  father_name:   z.string().optional(),
  mother_name:   z.string().optional(),
  spouse_name:   z.string().optional(),
  blood_group:   z.string().optional(),
  marital_status:z.string().optional(),
  occupation:    z.string().optional(),
  education:     z.string().optional(),
  disability_status: z.string().optional(),
  disability_details: z.string().optional(),
  aadhaar_number: z.string().regex(/^[0-9]{12}$/, "Must be 12 digits").optional().or(z.literal("")),
  voter_id:       z.string().optional(),
  is_voter:       z.boolean(),
  voter_status:   z.string().optional(),
  house_number:  z.string().optional(),
  street:        z.string().optional(),
  locality:      z.string().optional(),
  landmark:      z.string().optional(),
  pincode:       z.string().regex(/^[0-9]{6}$/, "6-digit pincode"),
  district:      z.string().min(1, "Required"),
  state:         z.string().min(1, "Required"),
  relationship_with_head: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

function CreateCitizenPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [mandalId, setMandalId] = useState("");
  const [villageId, setVillageId] = useState("");
  const [wardId, setWardId] = useState("");
  const [boothId, setBoothId] = useState("");
  const [familyId, setFamilyId] = useState("");
  const [createNewFamilyAsHead, setCreateNewFamilyAsHead] = useState(false);
  const [newFamilyEconomicStatus, setNewFamilyEconomicStatus] = useState("middle");
  const [newFamilyHouseNumber, setNewFamilyHouseNumber] = useState("");
  const [newFamilyStreet, setNewFamilyStreet] = useState("");
  const [aadhaarFile, setAadhaarFile] = useState<File | null>(null);
  const [voterFile, setVoterFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Track network status
  useEffect(() => {
    const up   = () => setIsOnline(true);
    const down = () => setIsOnline(false);
    window.addEventListener("online",  up);
    window.addEventListener("offline", down);
    return () => { window.removeEventListener("online", up); window.removeEventListener("offline", down); };
  }, []);

  const canEnroll = ["super-admin","mp-staff","constituency-coordinator",
    "assembly-coordinator","mandal-coordinator","village-coordinator","volunteer"].includes(user?.role_slug ?? "");

  const { data: mandals } = useQuery({ queryKey: ["mandals"], queryFn: () => fetchLocMandals() });
  const { data: villages } = useQuery({ queryKey: ["villages", mandalId], queryFn: () => fetchLocVillages(mandalId), enabled: !!mandalId });
  const { data: wards } = useQuery({ queryKey: ["wards", villageId], queryFn: () => fetchLocWards(villageId), enabled: !!villageId });
  const { data: booths } = useQuery({ queryKey: ["booths", villageId], queryFn: () => fetchLocPollingBooths(villageId), enabled: !!villageId });
  const { data: families } = useQuery({ queryKey: ["families-list"], queryFn: () => fetchFamilies({ per_page: 100 }) });

  const { register, handleSubmit, watch, setValue, getValues, trigger, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema) as import("react-hook-form").Resolver<FormData>,
    defaultValues: { gender: "Male", is_voter: false, state: "Andhra Pradesh", district: "Tirupati", disability_status: "none" },
  });

  useEffect(() => {
    const draft = localStorage.getItem("citizen-enrollment-draft");
    if (draft) {
      try {
        const saved = JSON.parse(draft) as { values?: Partial<FormData>; step?: number; mandalId?: string; villageId?: string; wardId?: string; boothId?: string; familyId?: string; createNewFamilyAsHead?: boolean; newFamilyEconomicStatus?: string; newFamilyHouseNumber?: string; newFamilyStreet?: string };
        Object.entries(saved.values ?? {}).forEach(([key, value]) => setValue(key as keyof FormData, value as never));
        if (saved.step) setStep(Math.min(Math.max(saved.step, 1), STEPS.length));
        setMandalId(saved.mandalId ?? ""); setVillageId(saved.villageId ?? ""); setWardId(saved.wardId ?? ""); setBoothId(saved.boothId ?? ""); setFamilyId(saved.familyId ?? "");
        setCreateNewFamilyAsHead(!!saved.createNewFamilyAsHead);
        setNewFamilyEconomicStatus(saved.newFamilyEconomicStatus ?? "middle");
        setNewFamilyHouseNumber(saved.newFamilyHouseNumber ?? "");
        setNewFamilyStreet(saved.newFamilyStreet ?? "");
        toast.info("Your saved citizen draft was restored.");
      } catch { localStorage.removeItem("citizen-enrollment-draft"); }
    }
  }, [setValue]);

  useEffect(() => {
    const subscription = watch((values) => {
      localStorage.setItem("citizen-enrollment-draft", JSON.stringify({ values, step, mandalId, villageId, wardId, boothId, familyId, createNewFamilyAsHead, newFamilyEconomicStatus, newFamilyHouseNumber, newFamilyStreet }));
    });
    return () => subscription.unsubscribe();
  }, [watch, step, mandalId, villageId, wardId, boothId, familyId, createNewFamilyAsHead, newFamilyEconomicStatus, newFamilyHouseNumber, newFamilyStreet]);

  const watchDisability = watch("disability_status");

  const validateStep = async (s: number): Promise<boolean> => {
    const fields: Record<number, (keyof FormData)[]> = {
      1: ["first_name","last_name","date_of_birth","gender","mobile_number"],
      2: ["aadhaar_number","voter_id"],
      3: ["pincode","district","state"],
      4: [],
      5: [],
      6: [],
    };
    return trigger(fields[s] ?? []);
  };

  const nextStep = async () => {
    if (step === 3 && !villageId) { toast.error("Select a village."); return; }
    const ok = await validateStep(step);
    if (ok) setStep((s) => Math.min(s + 1, STEPS.length));
  };
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const onSubmit = async (data: FormData) => {
    if (!villageId) { toast.error("Select a village in step 3."); setStep(3); return; }
    setSubmitting(true);

    const familyMeta = createNewFamilyAsHead ? {
      _create_family_as_head: true,
      _family_economic_status: newFamilyEconomicStatus,
      _family_house_number: newFamilyHouseNumber || undefined,
      _family_street: newFamilyStreet || undefined,
    } : {};

    const payload = {
      ...data,
      ...familyMeta,
      aadhaar_number: data.aadhaar_number || undefined,
      voter_id: data.voter_id || undefined,
      email: data.email || undefined,
      village_id: villageId,
      ward_id: wardId || undefined,
      polling_booth_id: boothId || undefined,
      family_id: createNewFamilyAsHead ? undefined : (familyId || undefined),
      relationship_with_head: (createNewFamilyAsHead || familyId)
        ? (createNewFamilyAsHead ? "Head of Family" : (data.relationship_with_head || "Member"))
        : undefined,
    };

    // ── Offline path ────────────────────────────────────────────────────────
    if (!isOnline) {
      try {
        const draftId = `draft_${Date.now()}_${Math.random().toString(36).slice(2)}`;
        const villageName = (villages as {id:string;name:string}[]|undefined)?.find(v => v.id === villageId)?.name ?? "Unknown Village";
        const documentIds: string[] = [];

        const saveDoc = async (file: File, title: string) => {
          const docId = `doc_${Date.now()}_${Math.random().toString(36).slice(2)}`;
          const base64 = await fileToBase64(file);
          const doc: OfflineDocument = {
            id: docId,
            name: file.name,
            title,
            mimeType: file.type || "application/octet-stream",
            size: file.size,
            dataBase64: base64,
            userId: user!.id,
            draftId,
            documentableType: "citizen",
            uploadStatus: "pending",
            createdAt: new Date().toISOString(),
          };
          await saveDocument(doc);
          documentIds.push(docId);
        };
        if (aadhaarFile) await saveDoc(aadhaarFile, "Aadhaar Card");
        if (voterFile)   await saveDoc(voterFile, "Voter ID Card");

        const headTag = createNewFamilyAsHead ? " (New Family Head)" : "";
        await saveDraft({
          id: draftId, type: "citizen_enrollment", status: "pending",
          payload: JSON.stringify(payload),
          createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
          retries: 0, userId: user!.id,
          label: `${data.first_name} ${data.last_name} — ${villageName}${headTag}`,
          documentIds,
        });
        localStorage.removeItem("citizen-enrollment-draft");
        const docMsg = documentIds.length ? ` Includes ${documentIds.length} document${documentIds.length > 1 ? "s" : ""}.` : "";
        const famMsg = createNewFamilyAsHead ? " New family creation will be linked after sync." : "";
        toast.success(`Saved as offline draft.${docMsg}${famMsg} Will auto-sync when back online.`, { duration: 5000 });
        await navigate({ to: "/volunteer" });
      } catch (err) {
        toast.error("Could not save draft: " + getApiErrorMessage(err));
      } finally { setSubmitting(false); }
      return;
    }

    // ── Online path ─────────────────────────────────────────────────────────
    try {
      // Strip the transient _family_* fields before sending to createCitizen API
      const { _create_family_as_head, _family_economic_status, _family_house_number, _family_street, ...citizenPayload } = payload as Record<string, unknown>;
      const result = await createCitizen(citizenPayload);

      // If volunteer chose to create a new family with this citizen as head, do it now
      let createdFamilyId: string | undefined;
      if (createNewFamilyAsHead) {
        const famPayload: Record<string, unknown> = {
          village_id: villageId,
          ward_id: wardId || undefined,
          head_citizen_id: result.id,
          economic_status: newFamilyEconomicStatus,
          address: [newFamilyHouseNumber, newFamilyStreet].filter(Boolean).join(", ") || undefined,
        };
        const familyResult = await createFamily(famPayload);
        createdFamilyId = familyResult.id;
      }

      const uploads: Promise<unknown>[] = [];
      const mkForm = (file: File, title: string, recordId: string) => {
        const fd = new FormData();
        fd.append("file", file); fd.append("title", title);
        fd.append("documentable_type", "citizen"); fd.append("documentable_id", recordId);
        return fd;
      };
      if (aadhaarFile) uploads.push(uploadDocument(mkForm(aadhaarFile, "Aadhaar Card", result.id)));
      if (voterFile)   uploads.push(uploadDocument(mkForm(voterFile, "Voter ID Card", result.id)));
      if (uploads.length) await Promise.all(uploads);
      toast.success(
        `Citizen ${result.unique_id} enrolled${createdFamilyId ? " + new family created as head" : ""}.`
      );
      localStorage.removeItem("citizen-enrollment-draft");
      await navigate({ to: "/citizens/profile", search: { id: result.id } });
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    } finally { setSubmitting(false); }
  };

  interface FamilyOption { id: string; family_id: string; head_of_family_name?: string }
  const familyList: FamilyOption[] = (families as { data?: FamilyOption[] } | undefined)?.data ?? [];

  return (
    <RoleGuard route="/citizens/create-profile">
      <PageHeader
        title="Enroll New Citizen"
        description="Register a citizen into the constituency database"
        actions={<Button variant="outline" size="sm" asChild><Link to="/citizens/list"><ArrowLeft className="h-4 w-4 mr-1" />Back to List</Link></Button>}
      />
      <div className="p-4 md:p-8 max-w-3xl space-y-6">
        {/* Offline notice */}
        {!isOnline && (
          <div className="flex items-center gap-2 rounded-md border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
            <WifiOff className="h-4 w-4 shrink-0" />
            <span><strong>You are offline.</strong> Complete the form and submit — it will be saved as a draft and automatically synced when you reconnect.</span>
          </div>
        )}
        {/* Step progress */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            const done = step > s.id;
            const active = step === s.id;
            return (
              <div key={s.id} className="flex items-center gap-1 shrink-0">
                <button type="button" onClick={() => done && setStep(s.id)}
                  className={cn("flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                    active ? "bg-primary text-primary-foreground" :
                    done   ? "bg-primary/20 text-primary cursor-pointer hover:bg-primary/30" :
                             "bg-muted text-muted-foreground")}>
                  {done ? <Check className="h-3.5 w-3.5" /> : <Icon className="h-3.5 w-3.5" />}
                  <span className="hidden sm:inline">{s.label}</span>
                </button>
                {i < STEPS.length - 1 && <ChevronRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />}
              </div>
            );
          })}
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* STEP 1 – Personal Information */}
          {step === 1 && (
            <Card className="p-6 space-y-5">
              <StepTitle icon={User} title="Personal Information" subtitle="Basic demographic details" />
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="First Name *" error={errors.first_name?.message}><Input {...register("first_name")} placeholder="Venkata" /></Field>
                <Field label="Last Name *" error={errors.last_name?.message}><Input {...register("last_name")} placeholder="Reddy" /></Field>
                <Field label="Middle Name" error={errors.middle_name?.message}><Input {...register("middle_name")} /></Field>
                <Field label="Date of Birth *" error={errors.date_of_birth?.message}><Input type="date" {...register("date_of_birth")} /></Field>
                <Field label="Gender *" error={errors.gender?.message}>
                  <Select defaultValue="Male" onValueChange={(v) => setValue("gender", v as "Male"|"Female"|"Other")}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="Male">Male</SelectItem><SelectItem value="Female">Female</SelectItem><SelectItem value="Other">Other</SelectItem></SelectContent>
                  </Select>
                </Field>
                <Field label="Mobile Number *" error={errors.mobile_number?.message}><Input {...register("mobile_number")} placeholder="9876543210" /></Field>
                <Field label="Alternate Mobile" error={errors.alternate_mobile?.message}><Input {...register("alternate_mobile")} placeholder="Optional" /></Field>
                <Field label="Email Address" error={errors.email?.message}><Input type="email" {...register("email")} placeholder="name@example.com" /></Field>
                <Field label="Father's Name"><Input {...register("father_name")} /></Field>
                <Field label="Mother's Name"><Input {...register("mother_name")} /></Field>
                <Field label="Spouse Name"><Input {...register("spouse_name")} /></Field>
                <Field label="Marital Status">
                  <Select onValueChange={(v) => setValue("marital_status", v)}>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      {["Single","Married","Widowed","Divorced","Separated"].map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Blood Group">
                  <Select onValueChange={(v) => setValue("blood_group", v)}>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      {["A+","A-","B+","B-","AB+","AB-","O+","O-"].map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Occupation"><Input {...register("occupation")} placeholder="Farmer / Teacher / etc." /></Field>
                <Field label="Education">
                  <Select onValueChange={(v) => setValue("education", v)}>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      {["No Formal Education","Primary (1–5)","Upper Primary (6–8)","Secondary (9–10)","Intermediate (11–12)","Diploma","Graduate","Post Graduate","Doctorate"].map((e) => <SelectItem key={e} value={e}>{e}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Disability Status">
                  <Select defaultValue="none" onValueChange={(v) => setValue("disability_status", v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {["none","visual","hearing","locomotor","intellectual","multiple"].map((d) => <SelectItem key={d} value={d} className="capitalize">{d === "none" ? "None" : d.charAt(0).toUpperCase()+d.slice(1)}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </Field>
                {watchDisability && watchDisability !== "none" && (
                  <Field label="Disability Details" className="sm:col-span-2">
                    <Textarea {...register("disability_details")} rows={2} placeholder="Describe the disability" />
                  </Field>
                )}
              </div>
            </Card>
          )}

          {/* STEP 2 – Identity */}
          {step === 2 && (
            <Card className="p-6 space-y-5">
              <StepTitle icon={FileText} title="Identity Documents" subtitle="Government-issued identity numbers" />
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Aadhaar Number" error={errors.aadhaar_number?.message}>
                  <Input {...register("aadhaar_number")} placeholder="123456789012" maxLength={12} />
                  <p className="mt-1 text-xs text-muted-foreground">12-digit number on your Aadhaar card</p>
                </Field>
                <Field label="Voter ID (EPIC)" error={errors.voter_id?.message}>
                  <Input {...register("voter_id")} placeholder="AP12345678" />
                  <p className="mt-1 text-xs text-muted-foreground">Andhra Pradesh voter ID</p>
                </Field>
              </div>
              <Separator />
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Upload Documents (Optional)</p>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Aadhaar Card (PDF/Image)">
                  <Input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => setAadhaarFile(e.target.files?.[0] ?? null)} />
                </Field>
                <Field label="Voter ID Card (PDF/Image)">
                  <Input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => setVoterFile(e.target.files?.[0] ?? null)} />
                </Field>
              </div>
            </Card>
          )}

          {/* STEP 3 – Address */}
          {step === 3 && (
            <Card className="p-6 space-y-5">
              <StepTitle icon={MapPin} title="Address" subtitle="Permanent residential address in Andhra Pradesh" />
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Mandal *">
                  <Select value={mandalId} onValueChange={(v) => { setMandalId(v); setVillageId(""); setWardId(""); setBoothId(""); }}>
                    <SelectTrigger><SelectValue placeholder="Select mandal" /></SelectTrigger>
                    <SelectContent>{(mandals ?? []).map((m: {id:string;name:string}) => <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>)}</SelectContent>
                  </Select>
                </Field>
                <Field label="Village / Town *">
                  <Select value={villageId} onValueChange={(v) => { setVillageId(v); setWardId(""); setBoothId(""); }} disabled={!mandalId}>
                    <SelectTrigger><SelectValue placeholder="Select village" /></SelectTrigger>
                    <SelectContent>{(villages ?? []).map((v: {id:string;name:string}) => <SelectItem key={v.id} value={v.id}>{v.name}</SelectItem>)}</SelectContent>
                  </Select>
                </Field>
                <Field label="Ward">
                  <Select value={wardId} onValueChange={setWardId} disabled={!villageId}>
                    <SelectTrigger><SelectValue placeholder="Select ward" /></SelectTrigger>
                    <SelectContent>{(wards ?? []).map((w: {id:string;name:string}) => <SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>)}</SelectContent>
                  </Select>
                </Field>
                <Field label="Polling Booth">
                  <Select value={boothId} onValueChange={setBoothId} disabled={!villageId}>
                    <SelectTrigger><SelectValue placeholder="Select booth" /></SelectTrigger>
                    <SelectContent>{(booths ?? []).map((b: {id:string;name:string;booth_number?:number}) => <SelectItem key={b.id} value={b.id}>{b.booth_number ? `Booth ${b.booth_number} — ` : ""}{b.name}</SelectItem>)}</SelectContent>
                  </Select>
                </Field>
                <Field label="House Number / Door No."><Input {...register("house_number")} placeholder="12-34" /></Field>
                <Field label="Street / Colony"><Input {...register("street")} placeholder="MG Road" /></Field>
                <Field label="Locality / Area"><Input {...register("locality")} placeholder="Balaji Nagar" /></Field>
                <Field label="Landmark"><Input {...register("landmark")} placeholder="Near temple" /></Field>
                <Field label="Pincode *" error={errors.pincode?.message}><Input {...register("pincode")} placeholder="517501" maxLength={6} /></Field>
                <Field label="District *" error={errors.district?.message}><Input {...register("district")} /></Field>
                <Field label="State *" error={errors.state?.message}><Input {...register("state")} defaultValue="Andhra Pradesh" /></Field>
              </div>
            </Card>
          )}

          {/* STEP 4 – Political Information */}
          {step === 4 && (
            <Card className="p-6 space-y-5">
              <StepTitle icon={Vote} title="Political Information" subtitle="Voter registration and electoral details" />
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Is Registered Voter?">
                  <Select defaultValue="false" onValueChange={(v) => setValue("is_voter", v === "true")}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="true">Yes</SelectItem><SelectItem value="false">No</SelectItem></SelectContent>
                  </Select>
                </Field>
                <Field label="Voter Status">
                  <Select onValueChange={(v) => setValue("voter_status", v)}>
                    <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
                    <SelectContent>
                      {["Active","Deleted","Shifted","Deceased","Duplicate"].map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </Field>
              </div>
              {villageId && (
                <div className="rounded-md border border-border/60 bg-muted/30 p-4 text-sm">
                  <p className="font-medium text-muted-foreground mb-1">Constituency Assignment</p>
                  <p className="text-xs text-muted-foreground">Based on the village selected in Step 3, the voter will be assigned to the correct Assembly and Parliamentary Constituency automatically.</p>
                </div>
              )}
            </Card>
          )}

          {/* STEP 5 – Family */}
          {step === 5 && (
            <Card className="p-6 space-y-5">
              <StepTitle icon={Users} title="Family Linkage" subtitle="Link to an existing household or create a new family" />
              <div className="space-y-4">
                <label className="flex items-start gap-3 rounded-lg border p-4 hover:bg-accent/40 cursor-pointer">
                  <Checkbox
                    id="create-new-family-head"
                    checked={createNewFamilyAsHead}
                    onCheckedChange={(v) => {
                      setCreateNewFamilyAsHead(Boolean(v));
                      if (v) { setFamilyId(""); setValue("relationship_with_head", "Head of Family"); }
                    }}
                    className="mt-0.5"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-sm">
                      Create new family and set this citizen as the Head of Family
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Creates a family record right after enrollment with this citizen as the canonical head.
                    </p>
                  </div>
                </label>

                {!createNewFamilyAsHead ? (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Link to existing Family">
                      <Select value={familyId} onValueChange={setFamilyId}>
                        <SelectTrigger><SelectValue placeholder="No family (create standalone citizen)" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">No family link</SelectItem>
                          {familyList.map((f) => (
                            <SelectItem key={f.id} value={f.id}>{f.head_of_family_name ?? f.family_id} ({f.family_id})</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>
                    {familyId && (
                      <Field label="Relationship with Head *" error={errors.relationship_with_head?.message}>
                        <Select onValueChange={(v) => setValue("relationship_with_head", v)}>
                          <SelectTrigger><SelectValue placeholder="Select relationship" /></SelectTrigger>
                          <SelectContent>
                            {["Spouse","Son","Daughter","Father","Mother","Brother","Sister","Grandfather","Grandmother","Grandson","Granddaughter","Son-in-law","Daughter-in-law","Other"].map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </Field>
                    )}
                  </div>
                ) : (
                  <Card className="space-y-4 border-primary/40 bg-primary/5 p-5">
                    <h4 className="text-sm font-semibold">New household details</h4>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field label="Economic status">
                        <Select value={newFamilyEconomicStatus} onValueChange={setNewFamilyEconomicStatus}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {[
                              { v: "below_poverty", l: "Below Poverty Line (BPL)" },
                              { v: "low", l: "Low income" },
                              { v: "middle", l: "Middle class" },
                              { v: "upper_middle", l: "Upper middle" },
                              { v: "high", l: "High income" },
                            ].map((o) => (
                              <SelectItem key={o.v} value={o.v}>{o.l}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </Field>
                      <Field label="Caste / BPL card option">
                        <Checkbox
                          id="new-family-is-bpl"
                          checked={false}
                          disabled
                        />
                        <p className="mt-1 text-xs text-muted-foreground">BPL flag can be set in the Families module after creation.</p>
                      </Field>
                      <Field label="House number (optional)">
                        <Input value={newFamilyHouseNumber} onChange={(e) => setNewFamilyHouseNumber(e.target.value)} placeholder="e.g. 1-2-3/45" />
                      </Field>
                      <Field label="Street / locality (optional)">
                        <Input value={newFamilyStreet} onChange={(e) => setNewFamilyStreet(e.target.value)} placeholder="Street name, colony, area" />
                      </Field>
                    </div>
                    <div className="flex items-start gap-2 rounded-md bg-background/70 p-3 text-xs text-muted-foreground">
                      <Info className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                      <span>
                        The family will be created immediately after enrollment and linked to this citizen. You can add additional family members later via the Families module.
                      </span>
                    </div>
                  </Card>
                )}
              </div>
            </Card>
          )}

          {/* STEP 6 – Documents */}
          {step === 6 && (
            <Card className="p-6 space-y-5">
              <StepTitle icon={FolderOpen} title="Supporting Documents" subtitle="Upload any additional documents (optional)" />
              <div className="space-y-3 text-sm text-muted-foreground">
                {aadhaarFile && <div className="flex items-center gap-2 text-green-600"><Check className="h-4 w-4" /> Aadhaar card: {aadhaarFile.name}</div>}
                {voterFile && <div className="flex items-center gap-2 text-green-600"><Check className="h-4 w-4" /> Voter ID card: {voterFile.name}</div>}
                {!aadhaarFile && !voterFile && <p>No documents selected. You can add documents later from the citizen profile.</p>}
              </div>
              <p className="text-xs text-muted-foreground">Additional documents (income certificate, caste certificate, photos, etc.) can be uploaded after enrollment from the citizen profile page.</p>
            </Card>
          )}

          {/* STEP 7 – Review & Submit */}
          {step === 7 && (
            <Card className="p-6 space-y-5">
              <StepTitle icon={ClipboardCheck} title="Review & Submit" subtitle="Verify all information before enrolling" />
              <ReviewSection title="Personal">
                <ReviewRow label="Name" value={[getValues("first_name"), getValues("middle_name"), getValues("last_name")].filter(Boolean).join(" ")} />
                <ReviewRow label="Date of Birth" value={getValues("date_of_birth")} />
                <ReviewRow label="Gender" value={getValues("gender")} />
                <ReviewRow label="Mobile" value={getValues("mobile_number")} />
                <ReviewRow label="Email" value={getValues("email") || "—"} />
                <ReviewRow label="Father" value={getValues("father_name") || "—"} />
                <ReviewRow label="Occupation" value={getValues("occupation") || "—"} />
                <ReviewRow label="Education" value={getValues("education") || "—"} />
              </ReviewSection>
              <ReviewSection title="Identity">
                <ReviewRow label="Aadhaar" value={getValues("aadhaar_number") ? "••••••••" + getValues("aadhaar_number")!.slice(-4) : "Not provided"} />
                <ReviewRow label="Voter ID" value={getValues("voter_id") || "Not provided"} />
              </ReviewSection>
              <ReviewSection title="Address">
                <ReviewRow label="Village" value={(villages as {id:string;name:string}[] | undefined)?.find((v) => v.id === villageId)?.name ?? "—"} />
                <ReviewRow label="District" value={getValues("district")} />
                <ReviewRow label="State" value={getValues("state")} />
                <ReviewRow label="Pincode" value={getValues("pincode")} />
              </ReviewSection>
            </Card>
          )}

          {/* Navigation */}
          <div className="flex justify-between pt-4">
            <Button type="button" variant="outline" onClick={prevStep} disabled={step === 1}>
              <ChevronLeft className="h-4 w-4 mr-1" /> Previous
            </Button>
            {step < STEPS.length ? (
              <Button type="button" onClick={nextStep}>
                Next <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            ) : (
              <Button type="submit" disabled={submitting}>
                {submitting
                  ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />{isOnline ? "Enrolling…" : "Saving draft…"}</>
                  : isOnline
                    ? <>Enroll Citizen <Check className="h-4 w-4 ml-2" /></>
                    : <><WifiOff className="h-4 w-4 mr-2" />Save Draft (Offline)</>
                }
              </Button>
            )}
          </div>
        </form>
      </div>
    </RoleGuard>
  );
}

// ── Shared helper components ──────────────────────────────────────────────────
function StepTitle({ icon: Icon, title, subtitle }: { icon: typeof User; title: string; subtitle: string }) {
  return (
    <div className="flex items-center gap-3 pb-2 border-b">
      <div className="rounded-md bg-primary/10 p-2"><Icon className="h-5 w-5 text-primary" /></div>
      <div><h3 className="font-semibold text-base">{title}</h3><p className="text-xs text-muted-foreground">{subtitle}</p></div>
    </div>
  );
}
function Field({ label, error, children, className }: { label: string; error?: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <Label className="text-sm">{label}</Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
function ReviewSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{title}</p>
      <div className="rounded-md border divide-y">{children}</div>
    </div>
  );
}
function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between px-3 py-2 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value || "—"}</span>
    </div>
  );
}

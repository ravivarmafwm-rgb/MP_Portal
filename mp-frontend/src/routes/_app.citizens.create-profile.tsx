import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  User, FileText, MapPin, Vote, Users, FolderOpen, ClipboardCheck, ChevronRight, ChevronLeft, Check, Loader2, ArrowLeft,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  createCitizen, uploadDocument, fetchLocMandals, fetchLocVillages,
  fetchLocWards, fetchLocPollingBooths, fetchFamilies, getApiErrorMessage,
} from "@/lib/api";
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
  const [aadhaarFile, setAadhaarFile] = useState<File | null>(null);
  const [voterFile, setVoterFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

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
        const saved = JSON.parse(draft) as { values?: Partial<FormData>; step?: number; mandalId?: string; villageId?: string; wardId?: string; boothId?: string; familyId?: string };
        Object.entries(saved.values ?? {}).forEach(([key, value]) => setValue(key as keyof FormData, value as never));
        if (saved.step) setStep(Math.min(Math.max(saved.step, 1), STEPS.length));
        setMandalId(saved.mandalId ?? ""); setVillageId(saved.villageId ?? ""); setWardId(saved.wardId ?? ""); setBoothId(saved.boothId ?? ""); setFamilyId(saved.familyId ?? "");
        toast.info("Your saved citizen draft was restored.");
      } catch { localStorage.removeItem("citizen-enrollment-draft"); }
    }
  }, [setValue]);

  useEffect(() => {
    const subscription = watch((values) => {
      localStorage.setItem("citizen-enrollment-draft", JSON.stringify({ values, step, mandalId, villageId, wardId, boothId, familyId }));
    });
    return () => subscription.unsubscribe();
  }, [watch, step, mandalId, villageId, wardId, boothId, familyId]);

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
    try {
      const result = await createCitizen({
        ...data,
        aadhaar_number: data.aadhaar_number || undefined,
        voter_id: data.voter_id || undefined,
        email: data.email || undefined,
        village_id: villageId,
        ward_id: wardId || undefined,
        polling_booth_id: boothId || undefined,
        family_id: familyId || undefined,
        relationship_with_head: familyId ? (data.relationship_with_head || "Member") : undefined,
      });
      const uploads: Promise<unknown>[] = [];
      const mkForm = (file: File, title: string) => {
        const fd = new FormData();
        fd.append("file", file); fd.append("title", title);
        fd.append("documentable_type", "citizen"); fd.append("documentable_id", result.id);
        return fd;
      };
      if (aadhaarFile) uploads.push(uploadDocument(mkForm(aadhaarFile, "Aadhaar Card")));
      if (voterFile)   uploads.push(uploadDocument(mkForm(voterFile, "Voter ID Card")));
      if (uploads.length) await Promise.all(uploads);
      toast.success(`Citizen ${result.unique_id} enrolled.`);
      localStorage.removeItem("citizen-enrollment-draft");
      await navigate({ to: "/citizens/profile", search: { id: result.id } });
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
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
              <StepTitle icon={Users} title="Family Linkage" subtitle="Link to an existing family household (optional)" />
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Link to Family">
                  <Select value={familyId} onValueChange={setFamilyId}>
                    <SelectTrigger><SelectValue placeholder="No family (create standalone)" /></SelectTrigger>
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
              <div className="rounded-md border border-border/60 bg-muted/30 p-4 text-sm text-muted-foreground">
                If this citizen is the head of a new family, skip this step and create the family separately from the Families module.
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
                {submitting ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Enrolling…</> : <>Enroll Citizen <Check className="h-4 w-4 ml-2" /></>}
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

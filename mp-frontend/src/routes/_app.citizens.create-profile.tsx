import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { ArrowLeft, UserPlus, Loader2, Save, Upload } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  createCitizen,
  uploadDocument,
  fetchLocMandals,
  fetchLocVillages,
  fetchLocWards,
  fetchLocPollingBooths,
  fetchFamilies,
} from "@/lib/api";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import { RoleGuard } from "@/components/auth/RoleGuard";

export const Route = createFileRoute("/_app/citizens/create-profile")({
  head: () => ({ meta: [{ title: "Enroll Citizen — MP Platform" }] }),
  component: CreateCitizenPage,
});

const schema = z.object({
  first_name: z.string().min(1, "First name required"),
  last_name: z.string().min(1, "Last name required"),
  middle_name: z.string().optional(),
  date_of_birth: z.string().min(1, "Date of birth required"),
  gender: z.enum(["Male", "Female", "Other"]),
  mobile_number: z.string().min(10, "Valid mobile required"),
  aadhaar_number: z.string().optional(),
  voter_id: z.string().optional(),
  occupation: z.string().optional(),
  education: z.string().optional(),
  father_name: z.string().optional(),
  blood_group: z.string().optional(),
  house_number: z.string().optional(),
  street: z.string().optional(),
  pincode: z.string().optional(),
  district: z.string().optional(),
  state: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

function CreateCitizenPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [mandalId, setMandalId] = useState("");
  const [villageId, setVillageId] = useState("");
  const [wardId, setWardId] = useState("");
  const [boothId, setBoothId] = useState("");
  const [familyId, setFamilyId] = useState("");
  const [aadhaarFile, setAadhaarFile] = useState<File | null>(null);
  const [voterFile, setVoterFile] = useState<File | null>(null);

  const canEnroll =
    user?.role_slug === "volunteer" || user?.role_slug === "super-admin";

  const { data: mandals } = useQuery({
    queryKey: ["mandals"],
    queryFn: () => fetchLocMandals(),
  });
  const { data: villages } = useQuery({
    queryKey: ["villages", mandalId],
    queryFn: () => fetchLocVillages(mandalId),
    enabled: !!mandalId,
  });
  const { data: wards } = useQuery({
    queryKey: ["wards", villageId],
    queryFn: () => fetchLocWards(villageId),
    enabled: !!villageId,
  });
  const { data: booths } = useQuery({
    queryKey: ["booths", villageId],
    queryFn: () => fetchLocPollingBooths(villageId),
    enabled: !!villageId,
  });
  const { data: families } = useQuery({
    queryKey: ["families"],
    queryFn: () => fetchFamilies({ per_page: 50 }),
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      gender: "Male",
      state: "Telangana",
      district: "Hyderabad",
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      const result = await createCitizen({
        ...data,
        village_id: villageId || undefined,
        ward_id: wardId || undefined,
        polling_booth_id: boothId || undefined,
        family_id: familyId || undefined,
      });

      const uploads: Promise<unknown>[] = [];
      if (aadhaarFile) {
        const fd = new FormData();
        fd.append("file", aadhaarFile);
        fd.append("title", "Aadhaar Card");
        fd.append("documentable_type", "citizen");
        fd.append("documentable_id", result.id);
        uploads.push(uploadDocument(fd));
      }
      if (voterFile) {
        const fd = new FormData();
        fd.append("file", voterFile);
        fd.append("title", "Voter ID");
        fd.append("documentable_type", "citizen");
        fd.append("documentable_id", result.id);
        uploads.push(uploadDocument(fd));
      }
      if (uploads.length) await Promise.all(uploads);

      toast.success(`Citizen ${result.unique_id} enrolled successfully!`);
      navigate({ to: "/citizens/list" });
    } catch (err: unknown) {
      const resp = err as {
        response?: {
          data?: { message?: string; errors?: Record<string, string[]> };
        };
      };
      const msg = resp?.response?.data?.errors
        ? Object.values(resp.response.data.errors).flat().join(", ")
        : (resp?.response?.data?.message ?? "Enrollment failed.");
      toast.error(msg);
    }
  };

  if (!canEnroll) {
    return (
      <RoleGuard route="/citizens/create-profile">
        <div />
      </RoleGuard>
    );
  }

  return (
    <RoleGuard route="/citizens/create-profile">
      <PageHeader
        title="Enroll New Citizen"
        description="Volunteer-only: register a new citizen into the constituency database"
        actions={
          <Button variant="outline" size="sm" asChild>
            <Link to="/citizens/list">
              <ArrowLeft className="h-4 w-4 mr-1.5" /> Back to List
            </Link>
          </Button>
        }
      />
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl p-4 md:p-8 space-y-6"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Card className="p-6">
            <h3 className="text-h3 font-bold mb-4">Personal Details</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="first_name">First Name *</Label>
                <Input
                  id="first_name"
                  {...register("first_name")}
                  placeholder="Ravi"
                />
                {errors.first_name && (
                  <p className="text-xs text-destructive">
                    {errors.first_name.message}
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="last_name">Last Name *</Label>
                <Input
                  id="last_name"
                  {...register("last_name")}
                  placeholder="Reddy"
                />
                {errors.last_name && (
                  <p className="text-xs text-destructive">
                    {errors.last_name.message}
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="middle_name">Middle Name</Label>
                <Input id="middle_name" {...register("middle_name")} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="date_of_birth">Date of Birth *</Label>
                <Input
                  id="date_of_birth"
                  type="date"
                  {...register("date_of_birth")}
                />
                {errors.date_of_birth && (
                  <p className="text-xs text-destructive">
                    {errors.date_of_birth.message}
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label>Gender *</Label>
                <Select
                  defaultValue="Male"
                  onValueChange={(v) =>
                    setValue("gender", v as "Male" | "Female" | "Other")
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="mobile_number">Mobile Number *</Label>
                <Input
                  id="mobile_number"
                  {...register("mobile_number")}
                  placeholder="9876543210"
                />
                {errors.mobile_number && (
                  <p className="text-xs text-destructive">
                    {errors.mobile_number.message}
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="occupation">Occupation</Label>
                <Input id="occupation" {...register("occupation")} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="education">Education</Label>
                <Input id="education" {...register("education")} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="father_name">Father's Name</Label>
                <Input id="father_name" {...register("father_name")} />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-h3 font-bold mb-4">Identity Documents</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="aadhaar_number">Aadhaar Number</Label>
                <Input
                  id="aadhaar_number"
                  {...register("aadhaar_number")}
                  placeholder="XXXX-XXXX-XXXX"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="voter_id">Voter ID</Label>
                <Input
                  id="voter_id"
                  {...register("voter_id")}
                  placeholder="AP1234567"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Aadhaar Upload</Label>
                <Input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => setAadhaarFile(e.target.files?.[0] ?? null)}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Voter ID Upload</Label>
                <Input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => setVoterFile(e.target.files?.[0] ?? null)}
                />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-h3 font-bold mb-4">Location & Address</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Mandal</Label>
                <Select
                  value={mandalId}
                  onValueChange={(v) => {
                    setMandalId(v);
                    setVillageId("");
                    setWardId("");
                    setBoothId("");
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select mandal" />
                  </SelectTrigger>
                  <SelectContent>
                    {(mandals ?? []).map((m: { id: string; name: string }) => (
                      <SelectItem key={m.id} value={m.id}>
                        {m.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Village</Label>
                <Select
                  value={villageId}
                  onValueChange={(v) => {
                    setVillageId(v);
                    setWardId("");
                    setBoothId("");
                  }}
                  disabled={!mandalId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select village" />
                  </SelectTrigger>
                  <SelectContent>
                    {(villages ?? []).map((v: { id: string; name: string }) => (
                      <SelectItem key={v.id} value={v.id}>
                        {v.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Ward</Label>
                <Select
                  value={wardId}
                  onValueChange={setWardId}
                  disabled={!villageId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select ward" />
                  </SelectTrigger>
                  <SelectContent>
                    {(wards ?? []).map((w: { id: string; name: string }) => (
                      <SelectItem key={w.id} value={w.id}>
                        {w.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Polling Booth</Label>
                <Select
                  value={boothId}
                  onValueChange={setBoothId}
                  disabled={!villageId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select booth" />
                  </SelectTrigger>
                  <SelectContent>
                    {(booths ?? []).map(
                      (b: {
                        id: string;
                        name: string;
                        booth_number?: string;
                      }) => (
                        <SelectItem key={b.id} value={b.id}>
                          {b.booth_number ? `Booth ${b.booth_number}` : b.name}
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Link to Family</Label>
                <Select value={familyId} onValueChange={setFamilyId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Optional family" />
                  </SelectTrigger>
                  <SelectContent>
                    {(families?.data ?? []).map(
                      (f: {
                        id: string;
                        family_id: string;
                        head_of_family_name?: string;
                      }) => (
                        <SelectItem key={f.id} value={f.id}>
                          {f.head_of_family_name ?? f.family_id}
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="house_number">House Number</Label>
                <Input id="house_number" {...register("house_number")} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="street">Street</Label>
                <Input id="street" {...register("street")} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="pincode">Pincode</Label>
                <Input
                  id="pincode"
                  {...register("pincode")}
                  placeholder="500084"
                />
              </div>
            </div>
          </Card>

          <Separator />

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" asChild>
              <Link to="/citizens/list">Cancel</Link>
            </Button>
            <Button type="submit" disabled={isSubmitting} className="gap-2">
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Upload className="h-4 w-4" />
              )}
              {isSubmitting ? "Enrolling…" : "Enroll Citizen"}
            </Button>
          </div>
        </form>
      </motion.div>
    </RoleGuard>
  );
}

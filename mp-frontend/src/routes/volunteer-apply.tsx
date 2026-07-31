import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Building2, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  fetchPublicVillages,
  submitVolunteerApplication,
  type PublicVillage,
} from "@/lib/api";

export const Route = createFileRoute("/volunteer-apply")({
  component: VolunteerApplyPage,
});

const schema = z.object({
  first_name: z.string().trim().min(2).max(100),
  last_name: z.string().trim().min(2).max(100),
  email: z.string().email(),
  mobile_number: z
    .string()
    .regex(/^[6-9][0-9]{9}$/, "Enter a valid 10-digit Indian mobile number"),
  date_of_birth: z.string().min(1),
  gender: z.enum(["Male", "Female", "Other"]),
  village_id: z.string().uuid("Select a village"),
  address: z.string().trim().min(10).max(1000),
  motivation: z
    .string()
    .trim()
    .min(30, "Please provide at least 30 characters")
    .max(2000),
});
type FormData = z.infer<typeof schema>;

function VolunteerApplyPage() {
  const [villages, setVillages] = useState<PublicVillage[]>([]);
  const [loadError, setLoadError] = useState(false);
  const [submitted, setSubmitted] = useState<string>();
  const [serverError, setServerError] = useState<string>();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });
  useEffect(() => {
    fetchPublicVillages()
      .then(setVillages)
      .catch(() => setLoadError(true));
  }, []);
  const submit = async (values: FormData) => {
    setServerError(undefined);
    try {
      const result = await submitVolunteerApplication(values);
      setSubmitted(result.id);
    } catch (error) {
      const data = (error as { response?: { data?: { message?: string } } })
        .response?.data;
      setServerError(
        data?.message ?? "The application could not be submitted.",
      );
    }
  };
  if (submitted)
    return (
      <main className="grid min-h-screen place-items-center bg-[#f6f8f5] p-5">
        <div className="max-w-lg rounded-2xl bg-white p-10 text-center shadow-xl">
          <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-700" />
          <h1 className="mt-5 text-3xl font-extrabold">Application received</h1>
          <p className="mt-3 text-slate-600">
            Your reference is <strong>{submitted}</strong>. The MP office will
            review your application. No volunteer account is created until
            approval.
          </p>
          <Link to="/" className="mt-7 inline-block font-bold text-emerald-800">
            Return home
          </Link>
        </div>
      </main>
    );
  return (
    <main className="min-h-screen bg-[#f6f8f5] px-5 py-10">
      <div className="mx-auto max-w-3xl">
        <Link
          to="/"
          className="flex items-center gap-2 font-bold text-emerald-950"
        >
          <Building2 className="h-5 w-5" /> MP Connect
        </Link>
        <div className="mt-8 rounded-2xl border border-emerald-950/10 bg-white p-6 shadow-xl shadow-emerald-950/5 sm:p-10">
          <p className="text-xs font-bold uppercase tracking-[.18em] text-emerald-800">
            Field service
          </p>
          <h1 className="mt-3 text-3xl font-extrabold">
            Volunteer application
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Applications are reviewed by the constituency office. Submission
            does not grant portal access.
          </p>
          {loadError && (
            <p
              role="alert"
              className="mt-6 rounded-lg bg-red-50 p-3 text-sm text-red-700"
            >
              Village information could not be loaded. Please try again later.
            </p>
          )}
          <form
            onSubmit={handleSubmit(submit)}
            className="mt-8 grid gap-5 sm:grid-cols-2"
          >
            <Field label="First name" error={errors.first_name?.message}>
              <Input {...register("first_name")} />
            </Field>
            <Field label="Last name" error={errors.last_name?.message}>
              <Input {...register("last_name")} />
            </Field>
            <Field label="Email" error={errors.email?.message}>
              <Input type="email" {...register("email")} />
            </Field>
            <Field label="Mobile number" error={errors.mobile_number?.message}>
              <Input inputMode="numeric" {...register("mobile_number")} />
            </Field>
            <Field label="Date of birth" error={errors.date_of_birth?.message}>
              <Input type="date" {...register("date_of_birth")} />
            </Field>
            <Field label="Gender" error={errors.gender?.message}>
              <select
                className="h-9 w-full rounded-md border bg-transparent px-3 text-sm"
                {...register("gender")}
              >
                <option value="">Select</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </Field>
            <Field label="Village" error={errors.village_id?.message}>
              <select
                disabled={loadError}
                className="h-9 w-full rounded-md border bg-transparent px-3 text-sm"
                {...register("village_id")}
              >
                <option value="">Select your village</option>
                {villages.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name}
                  </option>
                ))}
              </select>
            </Field>
            <div className="sm:col-span-2">
              <Field label="Address" error={errors.address?.message}>
                <Textarea {...register("address")} />
              </Field>
            </div>
            <div className="sm:col-span-2">
              <Field
                label="Why do you want to volunteer?"
                error={errors.motivation?.message}
              >
                <Textarea rows={5} {...register("motivation")} />
              </Field>
            </div>
            {serverError && (
              <p role="alert" className="sm:col-span-2 text-sm text-red-700">
                {serverError}
              </p>
            )}
            <div className="sm:col-span-2">
              <Button
                className="w-full bg-emerald-950"
                disabled={isSubmitting || loadError}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting
                  </>
                ) : (
                  "Submit for review"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
      {error && <p className="text-xs text-red-700">{error}</p>}
    </div>
  );
}

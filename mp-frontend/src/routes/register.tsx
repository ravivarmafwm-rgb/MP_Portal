import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Building2,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  Phone,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth";
import { getDashboardPath } from "@/lib/roles";
import { toast } from "sonner";

export const Route = createFileRoute("/register")({ component: RegisterPage });

const schema = z
  .object({
    first_name: z.string().trim().min(1, "Enter your first name").max(100),
    last_name: z.string().trim().min(1, "Enter your last name").max(100),
    email: z.string().trim().email("Enter a valid email address").max(255),
    mobile_number: z
      .string()
      .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
    date_of_birth: z.string().min(1, "Enter your date of birth"),
    gender: z.enum(["Male", "Female", "Other"]),
    password: z
      .string()
      .min(12, "Use at least 12 characters")
      .regex(/[a-z]/, "Add a lowercase letter")
      .regex(/[A-Z]/, "Add an uppercase letter")
      .regex(/\d/, "Add a number")
      .regex(/[^A-Za-z0-9]/, "Add a symbol"),
    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords do not match",
    path: ["password_confirmation"],
  });

type FormData = z.infer<typeof schema>;

function RegisterPage() {
  const navigate = useNavigate();
  const {
    register: createAccount,
    isAuthenticated,
    user,
    isLoading,
  } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  if (!isLoading && isAuthenticated && user) {
    void navigate({ to: getDashboardPath(user.role_slug), replace: true });
    return null;
  }

  const onSubmit = async (data: FormData) => {
    try {
      const authUser = await createAccount(data);
      toast.success("Citizen account created successfully");
      await navigate({
        to: getDashboardPath(authUser.role_slug),
        replace: true,
      });
    } catch (error: unknown) {
      const response = (
        error as {
          response?: {
            data?: { message?: string; errors?: Record<string, string[]> };
          };
        }
      ).response?.data;
      toast.error(
        response?.errors?.email?.[0] ??
          response?.errors?.password?.[0] ??
          response?.message ??
          "Registration failed. Please try again.",
      );
    }
  };

  return (
    <main className="grid min-h-screen bg-[#f6f8f5] lg:grid-cols-[.85fr_1.15fr]">
      <section className="hidden bg-emerald-950 p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <Link to="/" className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-amber-300 text-emerald-950">
            <Building2 className="h-5 w-5" />
          </span>
          <span className="font-display text-lg font-bold">MP Connect</span>
        </Link>
        <div className="max-w-md">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-300">
            Citizen registration
          </p>
          <h1 className="mt-5 font-display text-5xl font-extrabold leading-tight">
            Your constituency services, connected.
          </h1>
          <p className="mt-5 leading-7 text-emerald-100/75">
            Create a secure citizen account to access public service workflows.
            Official, staff and volunteer access is issued separately by the MP
            office.
          </p>
          <div className="mt-8 space-y-3 text-sm">
            {[
              "Citizen-only public registration",
              "Protected role-based access",
              "Secure service tracking",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-amber-300" />
                {item}
              </div>
            ))}
          </div>
        </div>
        <p className="text-xs text-emerald-100/50">
          MP Constituency Management System
        </p>
      </section>
      <section className="flex items-center justify-center p-5 sm:p-10">
        <div className="w-full max-w-md rounded-2xl border border-emerald-950/10 bg-white p-6 shadow-xl shadow-emerald-950/5 sm:p-9">
          <Link
            to="/"
            className="mb-8 flex items-center gap-2 font-bold text-emerald-950 lg:hidden"
          >
            <Building2 className="h-5 w-5" /> MP Connect
          </Link>
          <h2 className="font-display text-3xl font-extrabold">
            Create citizen account
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Enter your details to access citizen services.
          </p>
          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="First name" error={errors.first_name?.message}>
                <User className="field-icon" />
                <Input
                  autoComplete="given-name"
                  className="pl-10"
                  {...register("first_name")}
                />
              </Field>
              <Field label="Last name" error={errors.last_name?.message}>
                <User className="field-icon" />
                <Input
                  autoComplete="family-name"
                  className="pl-10"
                  {...register("last_name")}
                />
              </Field>
            </div>
            <Field label="Email address" error={errors.email?.message}>
              <Mail className="field-icon" />
              <Input
                type="email"
                autoComplete="email"
                className="pl-10"
                {...register("email")}
              />
            </Field>
            <Field label="Mobile number" error={errors.mobile_number?.message}>
              <Phone className="field-icon" />
              <Input
                inputMode="numeric"
                autoComplete="tel"
                maxLength={10}
                className="pl-10"
                {...register("mobile_number")}
              />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Date of birth"
                error={errors.date_of_birth?.message}
              >
                <Input
                  type="date"
                  max={new Date().toISOString().slice(0, 10)}
                  {...register("date_of_birth")}
                />
              </Field>
              <Field label="Gender" error={errors.gender?.message}>
                <select
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                  defaultValue=""
                  {...register("gender")}
                >
                  <option value="" disabled>
                    Select
                  </option>
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Other">Other</option>
                </select>
              </Field>
            </div>
            <Field label="Password" error={errors.password?.message}>
              <Lock className="field-icon" />
              <Input
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                className="pl-10 pr-10"
                {...register("password")}
              />
              <button
                type="button"
                className="absolute right-3 top-9 text-slate-400"
                onClick={() => setShowPassword((value) => !value)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </Field>
            <Field
              label="Confirm password"
              error={errors.password_confirmation?.message}
            >
              <Lock className="field-icon" />
              <Input
                type="password"
                autoComplete="new-password"
                className="pl-10"
                {...register("password_confirmation")}
              />
            </Field>
            <p className="text-xs leading-5 text-slate-500">
              Use 12 or more characters with uppercase, lowercase, number and
              symbol.
            </p>
            <Button
              type="submit"
              className="h-11 w-full bg-emerald-950 hover:bg-emerald-900"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account
                </>
              ) : (
                "Create citizen account"
              )}
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-slate-500">
            Already registered?{" "}
            <Link
              to="/login"
              className="font-bold text-emerald-800 hover:underline"
            >
              Login
            </Link>
          </p>
          <p className="mt-3 text-center text-sm text-slate-500">
            Want to serve in the field?{" "}
            <Link
              to="/volunteer-apply"
              className="font-bold text-emerald-800 hover:underline"
            >
              Apply as a volunteer
            </Link>
          </p>
        </div>
      </section>
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
    <div className="relative space-y-1.5">
      <Label>{label}</Label>
      <div className="relative">{children}</div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

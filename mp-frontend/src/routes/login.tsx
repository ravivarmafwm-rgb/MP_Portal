import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Building2, Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth";
import { getDashboardPath } from "@/lib/roles";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(4, "Password required"),
});
type FormData = z.infer<typeof schema>;

function LoginPage() {
  const navigate = useNavigate();
  const { login, isAuthenticated, user, isLoading } = useAuth();
  const [showPass, setShowPass] = useState(false);

  // Already logged in → go to role dashboard
  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      navigate({ to: getDashboardPath(user.role_slug), replace: true });
    }
  }, [isLoading, isAuthenticated, user, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    try {
      const authUser = await login(data.email, data.password);
      toast.success("Welcome back!");
      navigate({ to: getDashboardPath(authUser.role_slug), replace: true });
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "Invalid credentials. Please try again.";
      toast.error(msg);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* ── Left panel ── */}
      <div className="hidden lg:flex lg:w-1/2 bg-sidebar flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-sidebar-primary/20 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-sidebar-primary/10 blur-3xl" />

        <div className="relative flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground shadow-lg">
            <Building2 className="h-6 w-6" />
          </div>
          <div>
            <div className="font-display text-lg font-bold text-sidebar-foreground">MP Connect</div>
            <div className="text-xs text-sidebar-foreground/60">Constituency Platform</div>
          </div>
        </div>

        <div className="relative space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-sidebar-border/40 bg-sidebar-accent/40 px-3 py-1 text-xs text-sidebar-foreground/70">
            <div className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
            Live Constituency Data
          </div>
          <h1 className="font-display text-4xl font-bold leading-tight text-sidebar-foreground">
            Manage your<br />
            <span className="text-sidebar-primary">constituency</span><br />
            with confidence.
          </h1>
          <p className="text-sidebar-foreground/60 text-sm max-w-xs leading-relaxed">
            Real-time citizen data, grievance tracking, scheme coverage, and project monitoring — all in one place.
          </p>

          <div className="grid grid-cols-3 gap-4 pt-4">
            {[
              { label: "Live Data", value: "PostgreSQL" },
              { label: "Modules", value: "12+" },
              { label: "Roles", value: "11" },
            ].map((stat) => (
              <div key={stat.label} className="rounded-xl border border-sidebar-border/40 bg-sidebar-accent/40 p-3 text-center">
                <div className="font-display text-xl font-bold text-sidebar-foreground">{stat.value}</div>
                <div className="text-xs text-sidebar-foreground/50 mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative text-xs text-sidebar-foreground/40">
          MP Constituency Management System · Lok Sabha 2024–2029
        </div>
      </div>

      {/* ── Right panel ── */}
      <div className="flex flex-1 flex-col items-center justify-center bg-background p-6">
        {/* Mobile logo */}
        <div className="mb-8 flex items-center gap-3 lg:hidden">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground">
            <Building2 className="h-5 w-5" />
          </div>
          <div className="font-display text-lg font-bold">MP Connect</div>
        </div>

        <div className="w-full max-w-sm space-y-7">
          <div className="space-y-1">
            <h2 className="font-display text-2xl font-bold">Sign in</h2>
            <p className="text-sm text-muted-foreground">Enter your credentials to access the platform</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email address</Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@mpdashboard.com"
                  className="pl-9"
                  autoComplete="email"
                  {...register("email")}
                />
              </div>
              {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-9 pr-10"
                  autoComplete="current-password"
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  tabIndex={-1}
                >
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in…
                </>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>

          {/* Quick login hints */}
          <div className="rounded-xl border border-border/60 bg-muted/30 p-4 space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Quick access</p>
            <div className="space-y-1.5 text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span>Super Admin</span>
                <code className="rounded bg-muted px-1">admin@mpdashboard.com / Admin@1234</code>
              </div>
              <div className="flex justify-between">
                <span>MP</span>
                <code className="rounded bg-muted px-1">mp@mpdashboard.com / MP@1234</code>
              </div>
              <div className="flex justify-between">
                <span>Volunteer</span>
                <code className="rounded bg-muted px-1">volunteer@mpdashboard.com / Volunteer@1234</code>
              </div>
            </div>
          </div>

          <div className="text-center text-sm">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary hover:underline">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

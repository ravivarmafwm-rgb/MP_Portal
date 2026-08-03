import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  User,
  Mail,
  Phone,
  Shield,
  MapPin,
  Clock,
  KeyRound,
  Camera,
  BadgeCheck,
  Building2,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  changeMyPassword,
  fetchAuthSessions,
  updateMyProfile,
  getApiErrorMessage,
} from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/profile")({
  head: () => ({ meta: [{ title: "My Profile — MP Platform" }] }),
  component: ProfilePage,
});

function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [password, setPassword] = useState({
    current_password: "",
    password: "",
    password_confirmation: "",
  });

  useEffect(() => {
    setName(user?.name ?? "");
    setEmail(user?.email ?? "");
  }, [user]);

  const profileMutation = useMutation({
    mutationFn: () => updateMyProfile({ name, email }),
    onSuccess: async () => {
      await refreshUser();
      toast.success("Profile updated successfully.");
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });

  const passwordMutation = useMutation({
    mutationFn: () => changeMyPassword(password),
    onSuccess: (result) => {
      setPassword({ current_password: "", password: "", password_confirmation: "" });
      toast.success(result.message);
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });

  const sessionsQuery = useQuery({
    queryKey: ["auth-sessions"],
    queryFn: async () => {
      const { fetchAuthSessions } = await import("@/lib/api");
      return fetchAuthSessions();
    },
  });

  const initials = user?.initials ?? "??";
  const displayName = user?.name ?? "—";
  const roleLabel = user?.role ?? "—";

  return (
    <>
      <PageHeader
        title="My Profile"
        description="View and manage your account information, security settings, and active sessions."
      />
      <div className="p-4 md:p-8 max-w-5xl space-y-6">
        {/* Profile Hero */}
        <Card className="p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="relative">
              <Avatar className="h-20 w-20">
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <button
                className="absolute bottom-0 right-0 rounded-full bg-background border p-1.5 shadow-sm hover:bg-muted transition-colors"
                title="Change avatar (coming soon)"
                type="button"
              >
                <Camera className="h-3.5 w-3.5 text-muted-foreground" />
              </button>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-bold truncate">{displayName}</h2>
                <Badge variant="secondary" className="shrink-0">
                  {roleLabel}
                </Badge>
              </div>
              <p className="mt-0.5 text-sm text-muted-foreground">{user?.email ?? "—"}</p>
              <div className="mt-2 flex flex-wrap gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <BadgeCheck className="h-3.5 w-3.5 text-green-500" />
                  Account active
                </span>
                {user?.mfa_enabled && (
                  <span className="flex items-center gap-1">
                    <Shield className="h-3.5 w-3.5 text-blue-500" />
                    2FA enabled
                  </span>
                )}
              </div>
            </div>
          </div>
        </Card>

        <Tabs defaultValue="info">
          <TabsList>
            <TabsTrigger value="info">
              <User className="mr-1.5 h-4 w-4" />
              Information
            </TabsTrigger>
            <TabsTrigger value="security">
              <KeyRound className="mr-1.5 h-4 w-4" />
              Security
            </TabsTrigger>
            <TabsTrigger value="sessions">
              <Clock className="mr-1.5 h-4 w-4" />
              Sessions
            </TabsTrigger>
          </TabsList>

          {/* ── Information Tab ───────────────────────────────────────────── */}
          <TabsContent value="info" className="mt-4 space-y-5">
            {/* Read-only identity */}
            <Card className="p-5">
              <h3 className="flex items-center gap-2 font-semibold mb-4">
                <User className="h-4 w-4 text-primary" />
                Account Details
              </h3>
              <dl className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
                <InfoRow icon={User} label="Full Name" value={displayName} />
                <InfoRow icon={Mail} label="Email Address" value={user?.email ?? "—"} />
                <InfoRow icon={Shield} label="Role" value={roleLabel} />
                <InfoRow
                  icon={BadgeCheck}
                  label="Two-Factor Auth"
                  value={user?.mfa_enabled ? "Enabled" : "Not enabled"}
                />
              </dl>
            </Card>

            {/* Editable name / email */}
            <Card className="p-5">
              <h3 className="flex items-center gap-2 font-semibold mb-4">
                <Mail className="h-4 w-4 text-primary" />
                Edit Profile
              </h3>
              <form
                className="space-y-4 max-w-lg"
                onSubmit={(e) => {
                  e.preventDefault();
                  profileMutation.mutate();
                }}
              >
                <Field label="Display Name">
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    minLength={2}
                    placeholder="Your full name"
                  />
                </Field>
                <Field label="Email Address">
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="your@email.com"
                  />
                </Field>
                <Button type="submit" disabled={profileMutation.isPending}>
                  {profileMutation.isPending ? "Saving…" : "Save Changes"}
                </Button>
              </form>
            </Card>
          </TabsContent>

          {/* ── Security Tab ─────────────────────────────────────────────── */}
          <TabsContent value="security" className="mt-4 space-y-5">
            <Card className="p-5">
              <h3 className="flex items-center gap-2 font-semibold mb-4">
                <KeyRound className="h-4 w-4 text-primary" />
                Change Password
              </h3>
              <form
                className="space-y-4 max-w-lg"
                onSubmit={(e) => {
                  e.preventDefault();
                  passwordMutation.mutate();
                }}
              >
                <Field label="Current Password">
                  <Input
                    type="password"
                    value={password.current_password}
                    onChange={(e) =>
                      setPassword((p) => ({ ...p, current_password: e.target.value }))
                    }
                    required
                    autoComplete="current-password"
                  />
                </Field>
                <Field label="New Password">
                  <Input
                    type="password"
                    value={password.password}
                    onChange={(e) =>
                      setPassword((p) => ({ ...p, password: e.target.value }))
                    }
                    required
                    minLength={12}
                    autoComplete="new-password"
                  />
                  <p className="mt-1 text-xs text-muted-foreground">
                    Minimum 12 characters with uppercase, lowercase, a number and a symbol.
                  </p>
                </Field>
                <Field label="Confirm New Password">
                  <Input
                    type="password"
                    value={password.password_confirmation}
                    onChange={(e) =>
                      setPassword((p) => ({
                        ...p,
                        password_confirmation: e.target.value,
                      }))
                    }
                    required
                    autoComplete="new-password"
                  />
                </Field>
                <Button type="submit" disabled={passwordMutation.isPending}>
                  {passwordMutation.isPending ? "Updating…" : "Update Password"}
                </Button>
              </form>
            </Card>

            <Card className="p-5">
              <h3 className="flex items-center gap-2 font-semibold mb-2">
                <Shield className="h-4 w-4 text-primary" />
                Two-Factor Authentication
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {user?.mfa_enabled
                  ? "Two-factor authentication is currently enabled on your account."
                  : "Two-factor authentication adds an extra layer of security. Available for staff and coordinator roles."}
              </p>
              {user?.mfa_required && !user?.mfa_enabled && (
                <Badge variant="destructive" className="mb-3">
                  Required for your role — please enable 2FA
                </Badge>
              )}
              <Badge variant={user?.mfa_enabled ? "default" : "secondary"}>
                {user?.mfa_enabled ? "Enabled" : "Not enabled"}
              </Badge>
            </Card>
          </TabsContent>

          {/* ── Sessions Tab ─────────────────────────────────────────────── */}
          <TabsContent value="sessions" className="mt-4">
            <Card className="p-5">
              <h3 className="flex items-center gap-2 font-semibold mb-4">
                <Clock className="h-4 w-4 text-primary" />
                Active Sessions
              </h3>
              {sessionsQuery.isLoading ? (
                <p className="text-sm text-muted-foreground">Loading sessions…</p>
              ) : sessionsQuery.isError ? (
                <p className="text-sm text-destructive">
                  {getApiErrorMessage(sessionsQuery.error)}
                </p>
              ) : (
                <div className="divide-y rounded border">
                  {sessionsQuery.data?.data.map((session) => (
                    <div
                      key={session.id}
                      className="flex flex-col justify-between gap-3 p-4 sm:flex-row sm:items-center"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <strong className="text-sm">{session.name}</strong>
                          {session.is_current && <Badge>Current</Badge>}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {session.ip_address ?? "IP unavailable"} ·{" "}
                          {session.last_used_at
                            ? `Last used ${new Date(session.last_used_at).toLocaleString("en-IN")}`
                            : `Created ${new Date(session.created_at).toLocaleString("en-IN")}`}
                        </p>
                        <p className="mt-1 max-w-xl truncate text-xs text-muted-foreground">
                          {session.user_agent ?? "Device information unavailable"}
                        </p>
                      </div>
                    </div>
                  ))}
                  {!sessionsQuery.data?.data.length && (
                    <p className="p-4 text-sm text-muted-foreground">No active sessions found.</p>
                  )}
                </div>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof User;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="mt-0.5 h-4 w-4 text-muted-foreground shrink-0" />
      <div>
        <dt className="text-xs text-muted-foreground">{label}</dt>
        <dd className="font-medium text-sm">{value}</dd>
      </div>
    </div>
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

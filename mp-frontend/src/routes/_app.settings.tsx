import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { KeyRound, MonitorSmartphone, UserRound } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  changeMyPassword,
  fetchAuthSessions,
  revokeAuthSession,
  revokeOtherAuthSessions,
  updateMyProfile,
  getApiErrorMessage,
} from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/settings")({ component: Page });
function Page() {
  const { user, refreshUser } = useAuth();
  const client = useQueryClient();
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
  const profile = useMutation({
    mutationFn: () => updateMyProfile({ name, email }),
    onSuccess: async () => {
      await refreshUser();
      toast.success("Profile updated.");
    },
    onError: (error) => toast.error(message(error)),
  });
  const passwordMutation = useMutation({
    mutationFn: () => changeMyPassword(password),
    onSuccess: (result) => {
      setPassword({
        current_password: "",
        password: "",
        password_confirmation: "",
      });
      toast.success(result.message);
    },
    onError: (error) => toast.error(message(error)),
  });
  const sessions = useQuery({
    queryKey: ["auth-sessions"],
    queryFn: fetchAuthSessions,
  });
  const revoke = useMutation({
    mutationFn: revokeAuthSession,
    onSuccess: async (result) => {
      toast.success(result.message);
      await client.invalidateQueries({ queryKey: ["auth-sessions"] });
    },
    onError: (error) => toast.error(message(error)),
  });
  const revokeOthers = useMutation({
    mutationFn: revokeOtherAuthSessions,
    onSuccess: async (result) => {
      toast.success(result.message);
      await client.invalidateQueries({ queryKey: ["auth-sessions"] });
    },
    onError: (error) => toast.error(message(error)),
  });
  return (
    <>
      <PageHeader
        title="Account & Security"
        description="Manage your profile, password and authenticated sessions."
      />
      <div className="grid gap-6 p-4 md:p-8 lg:grid-cols-2">
        <Card className="p-5">
          <Heading icon={UserRound} title="Profile" />
          <form
            className="mt-4 space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              profile.mutate();
            }}
          >
            <Field label="Name">
              <Input
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
                minLength={2}
              />
            </Field>
            <Field label="Email">
              <Input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </Field>
            <Button disabled={profile.isPending}>
              {profile.isPending ? "Saving…" : "Save profile"}
            </Button>
          </form>
        </Card>
        <Card className="p-5">
          <Heading icon={KeyRound} title="Change password" />
          <form
            className="mt-4 space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              passwordMutation.mutate();
            }}
          >
            <Field label="Current password">
              <Input
                type="password"
                value={password.current_password}
                onChange={(event) =>
                  setPassword((value) => ({
                    ...value,
                    current_password: event.target.value,
                  }))
                }
                required
              />
            </Field>
            <Field label="New password">
              <Input
                type="password"
                value={password.password}
                onChange={(event) =>
                  setPassword((value) => ({
                    ...value,
                    password: event.target.value,
                  }))
                }
                required
                minLength={12}
              />
              <p className="mt-1 text-xs text-muted-foreground">
                At least 12 characters with upper/lowercase letters, a number
                and a symbol.
              </p>
            </Field>
            <Field label="Confirm new password">
              <Input
                type="password"
                value={password.password_confirmation}
                onChange={(event) =>
                  setPassword((value) => ({
                    ...value,
                    password_confirmation: event.target.value,
                  }))
                }
                required
              />
            </Field>
            <Button disabled={passwordMutation.isPending}>
              {passwordMutation.isPending ? "Updating…" : "Update password"}
            </Button>
          </form>
        </Card>
        <Card className="p-5 lg:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Heading icon={MonitorSmartphone} title="Authenticated sessions" />
            <Button
              variant="outline"
              size="sm"
              disabled={revokeOthers.isPending}
              onClick={() => revokeOthers.mutate()}
            >
              Revoke other sessions
            </Button>
          </div>
          {sessions.isError ? (
            <p className="mt-4 text-sm text-destructive">
              {message(sessions.error)}
            </p>
          ) : sessions.isLoading ? (
            <p className="mt-4 text-sm text-muted-foreground">
              Loading sessions…
            </p>
          ) : (
            <div className="mt-4 divide-y rounded border">
              {sessions.data?.data.map((session) => (
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
                        ? `Last used ${new Date(session.last_used_at).toLocaleString()}`
                        : `Created ${new Date(session.created_at).toLocaleString()}`}
                    </p>
                    <p className="mt-1 max-w-3xl truncate text-xs text-muted-foreground">
                      {session.user_agent ?? "Device information unavailable"}
                    </p>
                  </div>
                  {!session.is_current && (
                    <Button
                      variant="destructive"
                      size="sm"
                      disabled={revoke.isPending}
                      onClick={() => revoke.mutate(session.id)}
                    >
                      Revoke
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </>
  );
}
function Heading({
  icon: Icon,
  title,
}: {
  icon: typeof UserRound;
  title: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="h-5 w-5 text-primary" />
      <h2 className="font-semibold">{title}</h2>
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
function message(error: unknown) {
  return getApiErrorMessage(error);
}

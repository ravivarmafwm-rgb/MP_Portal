import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Palette,
  Bell,
  Globe,
  Clock,
  KeyRound,
  Mail,
  Monitor,
  Moon,
  Sun,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useTheme } from "next-themes";
import { fetchUserPreferences, updateUserPreferences, getApiErrorMessage, type UserPreferences } from "@/lib/api";

export const Route = createFileRoute("/_app/preferences")({
  head: () => ({ meta: [{ title: "Preferences — MP Platform" }] }),
  component: PreferencesPage,
});

const PREFS_KEY = "mp_user_preferences";

interface Prefs extends UserPreferences {
  theme: "light" | "dark" | "system";
  language: string;
  timezone: string;
  session_timeout: string;
  notif_email: boolean;
  notif_sms: boolean;
  notif_browser: boolean;
  notif_grievance_updates: boolean;
  notif_scheme_updates: boolean;
  notif_project_updates: boolean;
  email_daily_summary: boolean;
  email_weekly_report: boolean;
  email_critical_alerts: boolean;
  password_expiry_days: string;
  require_2fa_prompt: boolean;
}

const defaults: Prefs = {
  theme: "system",
  language: "en",
  timezone: "Asia/Kolkata",
  session_timeout: "120",
  notif_email: true,
  notif_sms: false,
  notif_browser: true,
  notif_grievance_updates: true,
  notif_scheme_updates: true,
  notif_project_updates: false,
  email_daily_summary: false,
  email_weekly_report: true,
  email_critical_alerts: true,
  password_expiry_days: "90",
  require_2fa_prompt: false,
};

function loadPrefs(): Prefs {
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    return raw ? { ...defaults, ...JSON.parse(raw) } : defaults;
  } catch {
    return defaults;
  }
}

function savePrefs(prefs: Prefs) {
  localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
}

function PreferencesPage() {
  const { setTheme } = useTheme();
  const [prefs, setPrefs] = useState<Prefs>(loadPrefs);
  const [dirty, setDirty] = useState(false);
  const preferencesQuery = useQuery({ queryKey: ["user-preferences"], queryFn: fetchUserPreferences });
  const saveMutation = useMutation({
    mutationFn: (value: Prefs) => updateUserPreferences(value),
    onSuccess: () => { savePrefs(prefs); setDirty(false); toast.success("Preferences saved."); },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });

  useEffect(() => {
    if (preferencesQuery.data?.data) setPrefs({ ...defaults, ...preferencesQuery.data.data });
  }, [preferencesQuery.data]);

  const set = <K extends keyof Prefs>(key: K, value: Prefs[K]) => {
    setPrefs((p) => ({ ...p, [key]: value }));
    setDirty(true);
    if (key === "theme") {
      setTheme(value as "light" | "dark" | "system");
    }
  };

  const handleSave = () => {
    saveMutation.mutate(prefs);
  };

  const handleReset = () => {
    setPrefs(defaults);
    savePrefs(defaults);
    setTheme("system");
    setDirty(false);
    toast.success("Preferences reset to defaults.");
  };

  return (
    <>
      <PageHeader
        title="Preferences"
        description="Customise your experience — theme, notifications, timezone and security settings."
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleReset}>
              Reset Defaults
            </Button>
            <Button size="sm" onClick={handleSave} disabled={!dirty || saveMutation.isPending}>
              {saveMutation.isPending ? "Saving…" : dirty ? "Save Changes" : "Saved"}
            </Button>
          </div>
        }
      />

      <div className="p-4 md:p-8 max-w-3xl space-y-6">
        {/* Theme */}
        <Section icon={Palette} title="Appearance">
          <PrefRow
            label="Theme"
            description="Choose how the interface looks."
          >
            <div className="flex gap-2">
              {(["light", "dark", "system"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => set("theme", t)}
                  className={`flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm font-medium transition-colors ${
                    prefs.theme === t
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:border-foreground/30"
                  }`}
                >
                  {t === "light" && <Sun className="h-3.5 w-3.5" />}
                  {t === "dark" && <Moon className="h-3.5 w-3.5" />}
                  {t === "system" && <Monitor className="h-3.5 w-3.5" />}
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
          </PrefRow>
        </Section>

        <Separator />

        {/* Localisation */}
        <Section icon={Globe} title="Localisation">
          <PrefRow label="Language" description="Display language for the interface.">
            <Select value={prefs.language} onValueChange={(v) => set("language", v)}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="te">Telugu (తెలుగు)</SelectItem>
                <SelectItem value="hi">Hindi (हिन्दी)</SelectItem>
              </SelectContent>
            </Select>
          </PrefRow>
          <PrefRow label="Timezone" description="Used for date/time display.">
            <Select value={prefs.timezone} onValueChange={(v) => set("timezone", v)}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Asia/Kolkata">IST (UTC+5:30)</SelectItem>
                <SelectItem value="UTC">UTC</SelectItem>
              </SelectContent>
            </Select>
          </PrefRow>
        </Section>

        <Separator />

        {/* Session */}
        <Section icon={Clock} title="Session">
          <PrefRow
            label="Session Timeout"
            description="Auto sign-out after inactivity."
          >
            <Select
              value={prefs.session_timeout}
              onValueChange={(v) => set("session_timeout", v)}
            >
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="60">1 hour</SelectItem>
                <SelectItem value="120">2 hours</SelectItem>
                <SelectItem value="240">4 hours</SelectItem>
                <SelectItem value="480">8 hours</SelectItem>
                <SelectItem value="0">Never</SelectItem>
              </SelectContent>
            </Select>
          </PrefRow>
        </Section>

        <Separator />

        {/* Notifications */}
        <Section icon={Bell} title="Notifications">
          <PrefRow
            label="Email notifications"
            description="Receive updates via email."
          >
            <Switch
              checked={prefs.notif_email}
              onCheckedChange={(v) => set("notif_email", v)}
            />
          </PrefRow>
          <PrefRow
            label="SMS notifications"
            description="Receive alerts via SMS."
          >
            <Switch
              checked={prefs.notif_sms}
              onCheckedChange={(v) => set("notif_sms", v)}
            />
          </PrefRow>
          <PrefRow
            label="Browser notifications"
            description="In-app notifications in the notification bell."
          >
            <Switch
              checked={prefs.notif_browser}
              onCheckedChange={(v) => set("notif_browser", v)}
            />
          </PrefRow>
          <Separator className="my-3" />
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
            Notify me about
          </p>
          <PrefRow label="Grievance updates" description="Status changes on grievances.">
            <Switch
              checked={prefs.notif_grievance_updates}
              onCheckedChange={(v) => set("notif_grievance_updates", v)}
            />
          </PrefRow>
          <PrefRow label="Scheme updates" description="Application approvals and disbursements.">
            <Switch
              checked={prefs.notif_scheme_updates}
              onCheckedChange={(v) => set("notif_scheme_updates", v)}
            />
          </PrefRow>
          <PrefRow label="Project updates" description="MPLADS project status changes.">
            <Switch
              checked={prefs.notif_project_updates}
              onCheckedChange={(v) => set("notif_project_updates", v)}
            />
          </PrefRow>
        </Section>

        <Separator />

        {/* Email Preferences */}
        <Section icon={Mail} title="Email Preferences">
          <PrefRow label="Daily summary" description="A digest of key activity each day.">
            <Switch
              checked={prefs.email_daily_summary}
              onCheckedChange={(v) => set("email_daily_summary", v)}
            />
          </PrefRow>
          <PrefRow label="Weekly report" description="Constituency metrics every Monday.">
            <Switch
              checked={prefs.email_weekly_report}
              onCheckedChange={(v) => set("email_weekly_report", v)}
            />
          </PrefRow>
          <PrefRow label="Critical alerts" description="Escalations and SLA breaches.">
            <Switch
              checked={prefs.email_critical_alerts}
              onCheckedChange={(v) => set("email_critical_alerts", v)}
            />
          </PrefRow>
        </Section>

        <Separator />

        {/* Password & Security */}
        <Section icon={KeyRound} title="Password & Security">
          <PrefRow
            label="Password expiry reminder"
            description="Prompt to change password after N days."
          >
            <Select
              value={prefs.password_expiry_days}
              onValueChange={(v) => set("password_expiry_days", v)}
            >
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">30 days</SelectItem>
                <SelectItem value="60">60 days</SelectItem>
                <SelectItem value="90">90 days</SelectItem>
                <SelectItem value="180">180 days</SelectItem>
                <SelectItem value="0">Never</SelectItem>
              </SelectContent>
            </Select>
          </PrefRow>
          <PrefRow
            label="Prompt for 2FA setup"
            description="Show setup reminder on login if 2FA is not enabled."
          >
            <Switch
              checked={prefs.require_2fa_prompt}
              onCheckedChange={(v) => set("require_2fa_prompt", v)}
            />
          </PrefRow>
        </Section>

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={handleReset}>
            Reset to Defaults
          </Button>
          <Button onClick={handleSave} disabled={!dirty || saveMutation.isPending}>
            {saveMutation.isPending ? "Saving…" : dirty ? "Save Changes" : "All Saved"}
          </Button>
        </div>
      </div>
    </>
  );
}

function Section({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof Palette;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-4">
      <h3 className="flex items-center gap-2 text-sm font-semibold">
        <Icon className="h-4 w-4 text-primary" />
        {title}
      </h3>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function PrefRow({
  label,
  description,
  children,
}: {
  label: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-6">
      <div className="min-w-0">
        <Label className="text-sm font-medium">{label}</Label>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

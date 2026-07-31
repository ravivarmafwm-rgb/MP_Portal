import { useCallback, useEffect, useRef, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { MapPin, RefreshCw, WifiOff } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  fetchLocVillages,
  fetchSurvey,
  getApiErrorMessage,
  submitSurveyResponse,
} from "@/lib/api";
import {
  pendingSurveyCount,
  queueSurveySubmission,
  syncSurveySubmissions,
} from "@/lib/offline-surveys";
import { useAuth } from "@/lib/auth";
export const Route = createFileRoute("/_app/surveys/collect")({
  validateSearch: (s: Record<string, unknown>) => ({ id: String(s.id ?? "") }),
  component: CollectSurvey,
});
function CollectSurvey() {
  const { id } = Route.useSearch();
  const navigate = useNavigate();
  const { user } = useAuth();
  const submissionId = useRef(crypto.randomUUID());
  const collectedAt = useRef(new Date().toISOString());
  const [pendingCount, setPendingCount] = useState(0);
  const [syncing, setSyncing] = useState(false);
  const [online, setOnline] = useState(navigator.onLine);
  const survey = useQuery({
    queryKey: ["survey-detail", id],
    queryFn: () => fetchSurvey(id),
    enabled: !!id,
  });
  const villages = useQuery({
    queryKey: ["location-villages"],
    queryFn: () => fetchLocVillages(),
  });
  const [meta, setMeta] = useState({
    citizen_id: "",
    respondent_name: "",
    respondent_mobile: "",
    village_id: "",
    latitude: "",
    longitude: "",
    remarks: "",
  });
  const [answers, setAnswers] = useState<
    Record<string, string | string[] | File>
  >({});
  const buildData = useCallback(() => {
    const data = new FormData();
    data.append("client_submission_id", submissionId.current);
    data.append("collected_at", collectedAt.current);
    Object.entries(meta).forEach(([key, value]) => {
      if (value) data.append(key, value);
    });
    Object.entries(answers).forEach(([questionId, value]) => {
      const question = survey.data?.questions?.find(
        (item) => item.id === questionId,
      );
      if (value instanceof File)
        data.append(`attachments[${questionId}]`, value);
      else if (Array.isArray(value))
        value.forEach((item) => data.append(`answers[${questionId}][]`, item));
      else if (question?.question_type === "gps_location") {
        const location = JSON.parse(value);
        data.append(
          `answers[${questionId}][latitude]`,
          String(location.latitude),
        );
        data.append(
          `answers[${questionId}][longitude]`,
          String(location.longitude),
        );
      } else data.append(`answers[${questionId}]`, value);
    });
    return data;
  }, [answers, meta, survey.data?.questions]);
  const queueCurrent = useCallback(async () => {
    if (!user)
      throw new Error("You must be signed in to save an offline response.");
    await queueSurveySubmission({
      id: submissionId.current,
      surveyId: id,
      userId: user.id,
      meta,
      answers,
      collectedAt: collectedAt.current,
    });
    setPendingCount(await pendingSurveyCount(user.id));
  }, [answers, id, meta, user]);
  const synchronize = useCallback(async () => {
    if (!user || !navigator.onLine) return;
    setSyncing(true);
    try {
      const result = await syncSurveySubmissions(user.id);
      setPendingCount(await pendingSurveyCount(user.id));
      if (result.synced)
        toast.success(
          `${result.synced} offline response${result.synced === 1 ? "" : "s"} synchronized.`,
        );
      if (result.failed)
        toast.error(
          `${result.failed} queued response${result.failed === 1 ? "" : "s"} could not be synchronized. Review connectivity or server validation.`,
        );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Offline responses could not be synchronized.",
      );
    } finally {
      setSyncing(false);
    }
  }, [user]);
  useEffect(() => {
    if (!user) return;
    pendingSurveyCount(user.id)
      .then(setPendingCount)
      .catch((error) =>
        toast.error(
          error instanceof Error
            ? error.message
            : "Offline queue could not be read.",
        ),
      );
    const wentOnline = () => {
      setOnline(true);
      void synchronize();
    };
    const wentOffline = () => setOnline(false);
    window.addEventListener("online", wentOnline);
    window.addEventListener("offline", wentOffline);
    void synchronize();
    return () => {
      window.removeEventListener("online", wentOnline);
      window.removeEventListener("offline", wentOffline);
    };
  }, [synchronize, user]);
  const mutation = useMutation({
    mutationFn: async () => {
      if (!navigator.onLine) {
        await queueCurrent();
        return "queued" as const;
      }
      try {
        await submitSurveyResponse(id, buildData());
        return "submitted" as const;
      } catch (error) {
        if (axios.isAxiosError(error) && !error.response) {
          await queueCurrent();
          return "queued" as const;
        }
        throw error;
      }
    },
    onSuccess: (mode) => {
      toast.success(
        mode === "queued"
          ? "Response encrypted and saved on this device. It will sync when online."
          : "Survey response submitted.",
      );
      navigate({ to: "/surveys/detail", search: { id } });
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
  const setMetaValue = (key: keyof typeof meta, value: string) =>
    setMeta((current) => ({ ...current, [key]: value }));
  const setAnswer = (id: string, value: string | string[] | File) =>
    setAnswers((current) => ({ ...current, [id]: value }));
  const captureLocation = () =>
    navigator.geolocation.getCurrentPosition(
      (position) =>
        setMeta((current) => ({
          ...current,
          latitude: String(position.coords.latitude),
          longitude: String(position.coords.longitude),
        })),
      (error) => toast.error(error.message),
      { enableHighAccuracy: true, timeout: 10000 },
    );
  if (survey.isError)
    return (
      <Card className="m-8 p-8 text-center text-destructive">
        {getApiErrorMessage(survey.error)}
      </Card>
    );
  if (survey.isLoading || !survey.data)
    return (
      <Card className="m-8 p-8 text-center text-muted-foreground">
        Loading survey...
      </Card>
    );
  return (
    <>
      <PageHeader
        title={survey.data.title}
        description="Field response collection with server-side question validation."
      />
      {(!online || pendingCount > 0) && (
        <div className="mx-4 mt-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-warning/30 bg-warning/10 p-3 text-sm md:mx-8">
          <span className="flex items-center gap-2">
            <WifiOff className="h-4 w-4" />
            {online
              ? `${pendingCount} encrypted response${pendingCount === 1 ? "" : "s"} waiting to sync.`
              : "Offline mode: this response will be encrypted on this device."}
          </span>
          {online && pendingCount > 0 && (
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={syncing}
              onClick={() => void synchronize()}
            >
              <RefreshCw
                className={`mr-1 h-4 w-4 ${syncing ? "animate-spin" : ""}`}
              />
              Sync now
            </Button>
          )}
        </div>
      )}
      <form
        className="space-y-4 p-4 md:p-8"
        onSubmit={(e) => {
          e.preventDefault();
          if (!meta.village_id) {
            toast.error("Select a village.");
            return;
          }
          if (
            meta.respondent_mobile &&
            !/^[6-9][0-9]{9}$/.test(meta.respondent_mobile)
          ) {
            toast.error("Enter a valid 10-digit Indian mobile number.");
            return;
          }
          const missing = survey.data.questions?.find((question) => {
            const value = answers[question.id];
            return (
              question.is_required &&
              (value === undefined ||
                value === "" ||
                (Array.isArray(value) && value.length === 0))
            );
          });
          if (missing) {
            toast.error(`Answer required: ${missing.question_text}`);
            return;
          }
          mutation.mutate();
        }}
      >
        <Card className="grid gap-3 p-5 md:grid-cols-2">
          <Field label="Respondent name">
            <Input
              value={meta.respondent_name}
              onChange={(e) => setMetaValue("respondent_name", e.target.value)}
            />
          </Field>
          <Field label="Mobile">
            <Input
              inputMode="numeric"
              maxLength={10}
              value={meta.respondent_mobile}
              onChange={(e) =>
                setMetaValue(
                  "respondent_mobile",
                  e.target.value.replace(/\D/g, ""),
                )
              }
            />
          </Field>
          <Field label="Citizen ID (if linked)">
            <Input
              value={meta.citizen_id}
              onChange={(e) => setMetaValue("citizen_id", e.target.value)}
            />
          </Field>
          <Field label="Village">
            <Select
              required
              value={meta.village_id}
              onValueChange={(v) => setMetaValue("village_id", v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select village" />
              </SelectTrigger>
              <SelectContent>
                {(villages.data ?? []).map((v: Record<string, unknown>) => (
                  <SelectItem key={String(v.id)} value={String(v.id)}>
                    {String(v.name)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <div className="md:col-span-2">
            <Button type="button" variant="outline" onClick={captureLocation}>
              <MapPin className="mr-2 h-4 w-4" />
              Capture GPS
            </Button>
            {meta.latitude && (
              <span className="ml-3 text-xs text-muted-foreground">
                {Number(meta.latitude).toFixed(5)},{" "}
                {Number(meta.longitude).toFixed(5)}
              </span>
            )}
          </div>
        </Card>
        {(survey.data.questions ?? []).map((question, index) => (
          <Card key={question.id} className="p-5">
            <Field
              label={`${index + 1}. ${question.question_text}${question.is_required ? " *" : ""}`}
            >
              <QuestionInput
                question={question}
                value={answers[question.id]}
                onChange={(value) => setAnswer(question.id, value)}
              />
            </Field>
            {question.help_text && (
              <p className="mt-1 text-xs text-muted-foreground">
                {question.help_text}
              </p>
            )}
          </Card>
        ))}
        <Card className="p-5">
          <Field label="Remarks">
            <Textarea
              value={meta.remarks}
              onChange={(e) => setMetaValue("remarks", e.target.value)}
            />
          </Field>
          <Button className="mt-4 w-full" disabled={mutation.isPending}>
            {mutation.isPending ? "Submitting..." : "Submit response"}
          </Button>
        </Card>
      </form>
    </>
  );
}
function QuestionInput({
  question,
  value,
  onChange,
}: {
  question: NonNullable<
    Awaited<ReturnType<typeof fetchSurvey>>["questions"]
  >[number];
  value?: string | string[] | File;
  onChange: (value: string | string[] | File) => void;
}) {
  const required = question.is_required;
  switch (question.question_type) {
    case "long_text":
      return (
        <Textarea
          required={required}
          value={typeof value === "string" ? value : ""}
          onChange={(e) => onChange(e.target.value)}
        />
      );
    case "number":
    case "rating":
      return (
        <Input
          required={required}
          type="number"
          min={question.question_type === "rating" ? 1 : undefined}
          max={question.question_type === "rating" ? 5 : undefined}
          value={typeof value === "string" ? value : ""}
          onChange={(e) => onChange(e.target.value)}
        />
      );
    case "date":
      return (
        <Input
          required={required}
          type="date"
          value={typeof value === "string" ? value : ""}
          onChange={(e) => onChange(e.target.value)}
        />
      );
    case "mobile":
      return (
        <Input
          required={required}
          inputMode="numeric"
          maxLength={10}
          value={typeof value === "string" ? value : ""}
          onChange={(e) => onChange(e.target.value.replace(/\D/g, ""))}
        />
      );
    case "dropdown":
    case "radio":
      return (
        <Select
          required={required}
          value={typeof value === "string" ? value : ""}
          onValueChange={onChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent>
            {question.options?.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    case "checkbox":
      return (
        <div className="space-y-2">
          {question.options?.map((option) => {
            const selected = Array.isArray(value) && value.includes(option);
            return (
              <label key={option} className="flex items-center gap-2">
                <Checkbox
                  checked={selected}
                  onCheckedChange={(checked) =>
                    onChange(
                      checked
                        ? [...(Array.isArray(value) ? value : []), option]
                        : (Array.isArray(value) ? value : []).filter(
                            (item) => item !== option,
                          ),
                    )
                  }
                />
                {option}
              </label>
            );
          })}
        </div>
      );
    case "file_upload":
      return (
        <Input
          required={required}
          type="file"
          accept=".pdf,.jpg,.jpeg,.png,.webp,.doc,.docx"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onChange(file);
          }}
        />
      );
    case "gps_location":
      return (
        <GpsAnswer
          required={required}
          value={typeof value === "string" ? value : ""}
          onChange={onChange}
        />
      );
    default:
      return (
        <Input
          required={required}
          value={typeof value === "string" ? value : ""}
          onChange={(e) => onChange(e.target.value)}
        />
      );
  }
}
function GpsAnswer({
  required,
  value,
  onChange,
}: {
  required: boolean;
  value: string;
  onChange: (value: string) => void;
}) {
  const capture = () =>
    navigator.geolocation.getCurrentPosition(
      (position) =>
        onChange(
          JSON.stringify({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          }),
        ),
      (error) => toast.error(error.message),
      { enableHighAccuracy: true, timeout: 10000 },
    );
  let label = "No location captured";
  if (value)
    try {
      const point = JSON.parse(value);
      label = `${Number(point.latitude).toFixed(5)}, ${Number(point.longitude).toFixed(5)}`;
    } catch {
      label = "Invalid location";
    }
  return (
    <div>
      <Button type="button" variant="outline" onClick={capture}>
        <MapPin className="mr-2 h-4 w-4" />
        Capture location
      </Button>
      <span className="ml-3 text-xs text-muted-foreground">
        {label}
        {required && !value ? " · required" : ""}
      </span>
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

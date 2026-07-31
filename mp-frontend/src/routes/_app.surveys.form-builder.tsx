import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowDown, ArrowUp, Plus, Save, Send, Trash2 } from "lucide-react";
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
  createSurvey,
  fetchLocVillages,
  fetchSurvey,
  getApiErrorMessage,
  publishSurvey,
  updateSurvey,
  type SurveyRecord,
} from "@/lib/api";
export const Route = createFileRoute("/_app/surveys/form-builder")({
  validateSearch: (s: Record<string, unknown>) => ({
    id: s.id ? String(s.id) : undefined,
  }),
  component: FormBuilder,
});
type Question = {
  id?: string;
  question_text: string;
  question_type: string;
  options: string[];
  is_required: boolean;
  validation_rule: string;
  help_text: string;
};
const blankQuestion = (): Question => ({
  question_text: "",
  question_type: "short_text",
  options: [],
  is_required: true,
  validation_rule: "",
  help_text: "",
});
function FormBuilder() {
  const { id } = Route.useSearch();
  const navigate = useNavigate();
  const client = useQueryClient();
  const existing = useQuery({
    queryKey: ["survey-detail", id],
    queryFn: () => fetchSurvey(id!),
    enabled: !!id,
  });
  const villages = useQuery({
    queryKey: ["location-villages"],
    queryFn: () => fetchLocVillages(),
  });
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "general",
    start_date: new Date().toISOString().slice(0, 10),
    end_date: "",
    target_responses: "",
    require_authentication: false,
    instructions: "",
    language: "en",
    village_id: "",
  });
  const [questions, setQuestions] = useState<Question[]>([blankQuestion()]);
  useEffect(() => {
    if (!existing.data) return;
    const s = existing.data;
    setForm({
      title: s.title ?? "",
      description: String(s.description ?? ""),
      category: String(s.category ?? "general"),
      start_date: String(s.start_date ?? "").slice(0, 10),
      end_date: String(s.end_date ?? "").slice(0, 10),
      target_responses: String(s.target_responses ?? ""),
      require_authentication: Boolean(s.require_authentication),
      instructions: String(s.instructions ?? ""),
      language: String(s.language ?? "en"),
      village_id: String(s.village_id ?? ""),
    });
    setQuestions(
      (s.questions ?? []).map((q) => ({
        id: q.id,
        question_text: q.question_text,
        question_type: q.question_type,
        options: q.options ?? [],
        is_required: q.is_required,
        validation_rule: q.validation_rule ?? "",
        help_text: q.help_text ?? "",
      })),
    );
  }, [existing.data]);
  const payload = () => ({
    ...form,
    end_date: form.end_date || null,
    target_responses: form.target_responses
      ? Number(form.target_responses)
      : null,
    village_id: form.village_id || null,
    questions: questions.map((q) => ({
      ...q,
      validation_rule: q.validation_rule || null,
      help_text: q.help_text || null,
      options: choice(q.question_type) ? q.options.filter(Boolean) : null,
    })),
  });
  const save = useMutation({
    mutationFn: () =>
      id ? updateSurvey(id, payload()) : createSurvey(payload()),
    onSuccess: async (survey) => {
      toast.success("Survey draft saved.");
      await client.invalidateQueries({ queryKey: ["surveys"] });
      if (!id)
        navigate({
          to: "/surveys/form-builder",
          search: { id: survey.id },
          replace: true,
        });
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
  const publish = useMutation({
    mutationFn: async () => {
      const saved = await (id
        ? updateSurvey(id, payload())
        : createSurvey(payload()));
      return publishSurvey(saved.id);
    },
    onSuccess: async (survey) => {
      toast.success("Survey published.");
      await client.invalidateQueries({ queryKey: ["surveys"] });
      navigate({ to: "/surveys/detail", search: { id: survey.id } });
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
  const set = (key: keyof typeof form, value: string | boolean) =>
    setForm((current) => ({ ...current, [key]: value }));
  const updateQuestion = (index: number, patch: Partial<Question>) =>
    setQuestions((current) =>
      current.map((q, i) => (i === index ? { ...q, ...patch } : q)),
    );
  const move = (index: number, direction: -1 | 1) =>
    setQuestions((current) => {
      const next = [...current];
      const target = index + direction;
      if (target < 0 || target >= next.length) return current;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  if (existing.isError)
    return (
      <Card className="m-8 p-8 text-center text-destructive">
        {getApiErrorMessage(existing.error)}
      </Card>
    );
  return (
    <>
      <PageHeader
        title={id ? "Edit Survey" : "Create Survey"}
        description="Persisted no-code survey builder with validated question types."
        actions={
          <>
            <Button
              variant="outline"
              disabled={save.isPending || publish.isPending}
              onClick={() => save.mutate()}
            >
              <Save className="mr-2 h-4 w-4" />
              Save draft
            </Button>
            <Button
              disabled={save.isPending || publish.isPending}
              onClick={() => publish.mutate()}
            >
              <Send className="mr-2 h-4 w-4" />
              Publish
            </Button>
          </>
        }
      />
      <div className="space-y-5 p-4 md:p-8">
        <Card className="grid gap-4 p-5 md:grid-cols-2">
          <Field label="Title">
            <Input
              required
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
            />
          </Field>
          <Field label="Category">
            <Select
              value={form.category}
              onValueChange={(v) => set("category", v)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[
                  "employment",
                  "farmer",
                  "housing",
                  "water",
                  "health",
                  "education",
                  "census",
                  "general",
                ].map((v) => (
                  <SelectItem key={v} value={v}>
                    {v}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Start date">
            <Input
              type="date"
              required
              value={form.start_date}
              onChange={(e) => set("start_date", e.target.value)}
            />
          </Field>
          <Field label="End date">
            <Input
              type="date"
              min={form.start_date}
              value={form.end_date}
              onChange={(e) => set("end_date", e.target.value)}
            />
          </Field>
          <Field label="Target responses">
            <Input
              type="number"
              min="1"
              value={form.target_responses}
              onChange={(e) => set("target_responses", e.target.value)}
            />
          </Field>
          <Field label="Village scope (optional)">
            <Select
              value={form.village_id || "all"}
              onValueChange={(v) => set("village_id", v === "all" ? "" : v)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">My full assigned area</SelectItem>
                {(villages.data ?? []).map((v: Record<string, unknown>) => (
                  <SelectItem key={String(v.id)} value={String(v.id)}>
                    {String(v.name)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <div className="md:col-span-2">
            <Field label="Description">
              <Textarea
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
              />
            </Field>
          </div>
          <div className="md:col-span-2">
            <Field label="Instructions">
              <Textarea
                value={form.instructions}
                onChange={(e) => set("instructions", e.target.value)}
              />
            </Field>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <Checkbox
              checked={form.require_authentication}
              onCheckedChange={(v) => set("require_authentication", v === true)}
            />
            Require linked citizen
          </label>
        </Card>
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Questions ({questions.length})</h2>
          <Button
            variant="outline"
            onClick={() =>
              setQuestions((current) => [...current, blankQuestion()])
            }
          >
            <Plus className="mr-2 h-4 w-4" />
            Add question
          </Button>
        </div>
        {questions.map((question, index) => (
          <Card key={question.id ?? index} className="space-y-3 p-4">
            <div className="flex items-center justify-between">
              <strong>Question {index + 1}</strong>
              <div className="flex">
                <Button
                  size="icon"
                  variant="ghost"
                  disabled={index === 0}
                  onClick={() => move(index, -1)}
                >
                  <ArrowUp className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  disabled={index === questions.length - 1}
                  onClick={() => move(index, 1)}
                >
                  <ArrowDown className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  disabled={questions.length === 1}
                  onClick={() =>
                    setQuestions((current) =>
                      current.filter((_, i) => i !== index),
                    )
                  }
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <Field label="Question text">
                <Input
                  required
                  value={question.question_text}
                  onChange={(e) =>
                    updateQuestion(index, { question_text: e.target.value })
                  }
                />
              </Field>
              <Field label="Type">
                <Select
                  value={question.question_type}
                  onValueChange={(v) =>
                    updateQuestion(index, {
                      question_type: v,
                      validation_rule: "",
                      options:
                        choice(v) && question.options.length < 2
                          ? ["Option 1", "Option 2"]
                          : question.options,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[
                      "short_text",
                      "long_text",
                      "number",
                      "dropdown",
                      "radio",
                      "checkbox",
                      "date",
                      "rating",
                      "file_upload",
                      "gps_location",
                      "mobile",
                    ].map((v) => (
                      <SelectItem key={v} value={v}>
                        {v.replaceAll("_", " ")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>
            {choice(question.question_type) && (
              <Field label="Options (one per line)">
                <Textarea
                  value={question.options.join("\n")}
                  onChange={(e) =>
                    updateQuestion(index, {
                      options: e.target.value.split("\n"),
                    })
                  }
                />
              </Field>
            )}
            <Field label="Help text">
              <Input
                value={question.help_text}
                onChange={(e) =>
                  updateQuestion(index, { help_text: e.target.value })
                }
              />
            </Field>
            {validationOptions(question.question_type).length > 0 && (
              <Field label="Answer validation">
                <Select
                  value={question.validation_rule || "none"}
                  onValueChange={(value) =>
                    updateQuestion(index, {
                      validation_rule: value === "none" ? "" : value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">
                      No additional validation
                    </SelectItem>
                    {validationOptions(question.question_type).map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            )}
            <label className="flex items-center gap-2 text-sm">
              <Checkbox
                checked={question.is_required}
                onCheckedChange={(v) =>
                  updateQuestion(index, { is_required: v === true })
                }
              />
              Required
            </label>
          </Card>
        ))}
      </div>
    </>
  );
}
function choice(type: string) {
  return ["dropdown", "radio", "checkbox"].includes(type);
}
function validationOptions(type: string) {
  if (["short_text", "long_text"].includes(type))
    return [
      { value: "min_length:2|max_length:100", label: "2–100 characters" },
      { value: "min_length:10|max_length:500", label: "10–500 characters" },
      { value: "max_length:2000", label: "Maximum 2,000 characters" },
    ];
  if (type === "number")
    return [
      { value: "min:0", label: "Zero or greater" },
      { value: "min:1|max:100", label: "Between 1 and 100" },
      { value: "min:0|max:10000000", label: "Between 0 and 10,000,000" },
    ];
  if (type === "checkbox")
    return [
      { value: "min_selections:1", label: "Select at least one" },
      { value: "min_selections:1|max_selections:3", label: "Select 1–3" },
    ];
  return [];
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

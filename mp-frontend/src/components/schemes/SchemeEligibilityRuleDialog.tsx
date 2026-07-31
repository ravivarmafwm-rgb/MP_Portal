import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  createSchemeEligibilityRule,
  getApiErrorMessage,
  updateSchemeEligibilityRule,
  type SchemeEligibilityRuleInput,
} from "@/lib/api";

type ExistingRule = SchemeEligibilityRuleInput & { id: string };
const initial: SchemeEligibilityRuleInput = {
  rule_name: "",
  field_name: "age",
  operator: "greater_than_or_equal",
  value: "",
  is_mandatory: true,
  sort_order: 0,
  error_message: "",
};

export function SchemeEligibilityRuleDialog({
  schemeId,
  rule,
}: {
  schemeId: string;
  rule?: ExistingRule;
}) {
  const client = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<SchemeEligibilityRuleInput>(rule ?? initial);
  useEffect(() => setForm(rule ?? initial), [rule, open]);
  const mutation = useMutation({
    mutationFn: () =>
      rule
        ? updateSchemeEligibilityRule(schemeId, rule.id, form)
        : createSchemeEligibilityRule(schemeId, form),
    onSuccess: async () => {
      toast.success(
        rule ? "Eligibility rule updated." : "Eligibility rule added.",
      );
      setOpen(false);
      await client.invalidateQueries({
        queryKey: ["scheme-eligibility-rules"],
      });
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
  const set = <K extends keyof SchemeEligibilityRuleInput>(
    key: K,
    value: SchemeEligibilityRuleInput[K],
  ) => setForm((current) => ({ ...current, [key]: value }));
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant={rule ? "ghost" : "outline"}>
          {rule ? (
            <Pencil className="h-4 w-4" />
          ) : (
            <Plus className="mr-1 h-4 w-4" />
          )}
          {!rule && "Add rule"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{rule ? "Edit" : "Add"} eligibility rule</DialogTitle>
          <DialogDescription>
            Only verified citizen-profile fields and deterministic comparisons
            are supported.
          </DialogDescription>
        </DialogHeader>
        <form
          className="space-y-3"
          onSubmit={(event) => {
            event.preventDefault();
            mutation.mutate();
          }}
        >
          <Field label="Rule name">
            <Input
              required
              minLength={3}
              maxLength={150}
              value={form.rule_name}
              onChange={(event) => set("rule_name", event.target.value)}
            />
          </Field>
          <Field label="Profile field">
            <Select
              value={form.field_name}
              onValueChange={(value) =>
                set(
                  "field_name",
                  value as SchemeEligibilityRuleInput["field_name"],
                )
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="age">Age</SelectItem>
                <SelectItem value="gender">Gender</SelectItem>
                <SelectItem value="disability_status">
                  Disability status
                </SelectItem>
                <SelectItem value="occupation">Occupation</SelectItem>
                <SelectItem value="marital_status">Marital status</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="Comparison">
            <Select
              value={form.operator}
              onValueChange={(value) =>
                set("operator", value as SchemeEligibilityRuleInput["operator"])
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="equals">Equals</SelectItem>
                <SelectItem value="not_equals">Does not equal</SelectItem>
                <SelectItem value="greater_than_or_equal">At least</SelectItem>
                <SelectItem value="less_than_or_equal">At most</SelectItem>
                <SelectItem value="in">One of (comma separated)</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="Expected value">
            <Input
              required
              maxLength={500}
              value={form.value}
              onChange={(event) => set("value", event.target.value)}
            />
          </Field>
          <Field label="Citizen-facing failure message">
            <Input
              required
              minLength={10}
              maxLength={500}
              value={form.error_message}
              onChange={(event) => set("error_message", event.target.value)}
            />
          </Field>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.is_mandatory}
              onChange={(event) => set("is_mandatory", event.target.checked)}
            />
            Mandatory for eligibility
          </label>
          <Button className="w-full" disabled={mutation.isPending}>
            {mutation.isPending ? "Saving..." : "Save rule"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
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

import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
import { Textarea } from "@/components/ui/textarea";
import {
  createScheme,
  fetchDepartments,
  getApiErrorMessage,
  updateScheme,
  type SchemeInput,
  type SchemeRecord,
} from "@/lib/api";

const empty: SchemeInput = {
  name: "",
  code: "",
  category: "",
  description: "",
  objectives: "",
  eligibility: "",
  benefits: "",
  funding_source: "",
  start_date: "",
  end_date: "",
  is_active: true,
  application_mode: "online",
  approval_authority: "",
  sla_days: 30,
  website_url: "",
  helpline_number: "",
  remarks: "",
};

export function SchemeCatalogDialog({ scheme }: { scheme?: SchemeRecord }) {
  const client = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<SchemeInput>(empty);
  const departments = useQuery({
    queryKey: ["departments"],
    queryFn: fetchDepartments,
    enabled: open,
  });
  useEffect(() => {
    setForm(
      scheme
        ? {
            name: scheme.name,
            code: scheme.code,
            category: scheme.category,
            department_id: scheme.department_id ?? undefined,
            description: scheme.description ?? "",
            objectives: scheme.objectives ?? "",
            eligibility: scheme.eligibility ?? "",
            benefits: scheme.benefits ?? "",
            max_amount: scheme.max_amount
              ? Number(scheme.max_amount)
              : undefined,
            funding_source: scheme.funding_source ?? "",
            start_date: scheme.start_date,
            end_date: scheme.end_date ?? "",
            is_active: scheme.is_active,
            application_mode: scheme.application_mode,
            approval_authority: scheme.approval_authority ?? "",
            sla_days: scheme.sla_days,
            website_url: scheme.website_url ?? "",
            helpline_number: scheme.helpline_number ?? "",
            remarks: scheme.remarks ?? "",
          }
        : empty,
    );
  }, [scheme, open]);
  const mutation = useMutation({
    mutationFn: () =>
      scheme ? updateScheme(scheme.id, form) : createScheme(form),
    onSuccess: async () => {
      toast.success(scheme ? "Scheme updated." : "Scheme created.");
      setOpen(false);
      await Promise.all([
        client.invalidateQueries({ queryKey: ["schemes"] }),
        client.invalidateQueries({ queryKey: ["scheme-stats"] }),
        client.invalidateQueries({ queryKey: ["scheme-eligibility-rules"] }),
      ]);
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
  const set = <K extends keyof SchemeInput>(key: K, value: SchemeInput[K]) =>
    setForm((current) => ({ ...current, [key]: value }));
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size={scheme ? "sm" : "default"}
          variant={scheme ? "outline" : "default"}
        >
          {scheme ? (
            <Pencil className="mr-1 h-4 w-4" />
          ) : (
            <Plus className="mr-1 h-4 w-4" />
          )}
          {scheme ? "Edit" : "Add scheme"}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{scheme ? "Edit" : "Add"} scheme</DialogTitle>
          <DialogDescription>
            Maintain the authoritative government scheme catalog. Changes are
            audited by the backend.
          </DialogDescription>
        </DialogHeader>
        {departments.isError && (
          <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            {getApiErrorMessage(departments.error)}
          </div>
        )}
        <form
          className="grid gap-3 sm:grid-cols-2"
          onSubmit={(event) => {
            event.preventDefault();
            mutation.mutate();
          }}
        >
          <Field label="Name">
            <Input
              required
              maxLength={255}
              value={form.name}
              onChange={(event) => set("name", event.target.value)}
            />
          </Field>
          <Field label="Code">
            <Input
              required
              maxLength={50}
              value={form.code}
              onChange={(event) =>
                set("code", event.target.value.toUpperCase())
              }
            />
          </Field>
          <Field label="Category">
            <Input
              required
              maxLength={100}
              value={form.category}
              onChange={(event) => set("category", event.target.value)}
            />
          </Field>
          <Field label="Department">
            <Select
              value={form.department_id ?? "none"}
              onValueChange={(value) =>
                set("department_id", value === "none" ? undefined : value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Not assigned</SelectItem>
                {departments.data?.map((department) => (
                  <SelectItem key={department.id} value={department.id}>
                    {department.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Start date">
            <Input
              required
              type="date"
              value={form.start_date}
              onChange={(event) => set("start_date", event.target.value)}
            />
          </Field>
          <Field label="End date">
            <Input
              type="date"
              min={form.start_date}
              value={form.end_date ?? ""}
              onChange={(event) =>
                set("end_date", event.target.value || undefined)
              }
            />
          </Field>
          <Field label="Application mode">
            <Select
              value={form.application_mode}
              onValueChange={(value) =>
                set(
                  "application_mode",
                  value as SchemeInput["application_mode"],
                )
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="online">Online</SelectItem>
                <SelectItem value="offline">Offline</SelectItem>
                <SelectItem value="both">Both</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="SLA days">
            <Input
              required
              type="number"
              min={1}
              max={3650}
              value={form.sla_days}
              onChange={(event) => set("sla_days", Number(event.target.value))}
            />
          </Field>
          <Field label="Maximum benefit amount">
            <Input
              type="number"
              min={0}
              step="0.01"
              value={form.max_amount ?? ""}
              onChange={(event) =>
                set(
                  "max_amount",
                  event.target.value ? Number(event.target.value) : undefined,
                )
              }
            />
          </Field>
          <Field label="Funding source">
            <Input
              maxLength={255}
              value={form.funding_source ?? ""}
              onChange={(event) => set("funding_source", event.target.value)}
            />
          </Field>
          <Field label="Approval authority">
            <Input
              maxLength={255}
              value={form.approval_authority ?? ""}
              onChange={(event) =>
                set("approval_authority", event.target.value)
              }
            />
          </Field>
          <Field label="Helpline">
            <Input
              maxLength={30}
              value={form.helpline_number ?? ""}
              onChange={(event) => set("helpline_number", event.target.value)}
            />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Website">
              <Input
                type="url"
                maxLength={2048}
                value={form.website_url ?? ""}
                onChange={(event) => set("website_url", event.target.value)}
              />
            </Field>
          </div>
          {(
            [
              "description",
              "objectives",
              "eligibility",
              "benefits",
              "remarks",
            ] as const
          ).map((key) => (
            <div key={key} className="sm:col-span-2">
              <Field label={key[0].toUpperCase() + key.slice(1)}>
                <Textarea
                  maxLength={10000}
                  value={form[key] ?? ""}
                  onChange={(event) => set(key, event.target.value)}
                />
              </Field>
            </div>
          ))}
          <label className="flex items-center gap-2 text-sm sm:col-span-2">
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(event) => set("is_active", event.target.checked)}
            />
            Active and available during configured dates
          </label>
          <Button className="sm:col-span-2" disabled={mutation.isPending}>
            {mutation.isPending ? "Saving..." : "Save scheme"}
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

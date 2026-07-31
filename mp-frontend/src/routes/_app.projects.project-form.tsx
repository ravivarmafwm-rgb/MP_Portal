import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  createProject,
  fetchProject,
  fetchLocConstituencies,
  fetchLocAssemblyConstituencies,
  fetchLocMandals,
  fetchLocVillages,
  fetchLocWards,
  getApiErrorMessage,
  updateProject,
  fetchProjectLookup,
} from "@/lib/api";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
export const Route = createFileRoute("/_app/projects/project-form")({
  validateSearch: z.object({ id: z.string().optional() }),
  component: Page,
});
const initial = {
  name: "",
  description: "",
  estimated_cost: "",
  sanctioned_amount: "",
  status: "proposed",
  constituency_id: "",
  assembly_constituency_id: "",
  mandal_id: "",
  village_id: "",
  ward_id: "",
  location: "",
  start_date: "",
  scheduled_completion_date: "",
  project_category_id: "",
  project_type_id: "",
  department_id: "",
  agency_id: "",
  remarks: "",
};
function Page() {
  const { user } = useAuth();
  const { id } = Route.useSearch();
  const navigate = useNavigate();
  const [form, setForm] = useState(initial);
  const change = (key: keyof typeof initial, value: string) =>
    setForm((current) => ({ ...current, [key]: value }));
  const project = useQuery({
    queryKey: ["project-form", id],
    queryFn: () => fetchProject(id!),
    enabled: !!id,
  });
  useEffect(() => {
    if (project.data)
      setForm((value) => ({
        ...value,
        ...Object.fromEntries(
          Object.keys(value).map((key) => [
            key,
            String(project.data?.[key] ?? ""),
          ]),
        ),
      }));
  }, [project.data]);
  const constituencies = useQuery({
    queryKey: ["locations", "constituencies"],
    queryFn: fetchLocConstituencies,
  });
  const assemblies = useQuery({
    queryKey: ["locations", "assemblies", form.constituency_id],
    queryFn: () => fetchLocAssemblyConstituencies(form.constituency_id),
    enabled: !!form.constituency_id,
  });
  const mandals = useQuery({
    queryKey: ["locations", "mandals", form.assembly_constituency_id],
    queryFn: () => fetchLocMandals(form.assembly_constituency_id),
    enabled: !!form.assembly_constituency_id,
  });
  const villages = useQuery({
    queryKey: ["locations", "villages", form.mandal_id],
    queryFn: () => fetchLocVillages(form.mandal_id),
    enabled: !!form.mandal_id,
  });
  const wards = useQuery({
    queryKey: ["locations", "wards", form.village_id],
    queryFn: () => fetchLocWards(form.village_id),
    enabled: !!form.village_id,
  });
  const categories = useQuery({
    queryKey: ["project-lookup", "category"],
    queryFn: () => fetchProjectLookup("category"),
  });
  const types = useQuery({
    queryKey: ["project-lookup", "type"],
    queryFn: () => fetchProjectLookup("type"),
  });
  const departments = useQuery({
    queryKey: ["project-lookup", "department"],
    queryFn: () => fetchProjectLookup("department"),
  });
  const agencies = useQuery({
    queryKey: ["project-lookup", "agency"],
    queryFn: () => fetchProjectLookup("agency"),
  });
  const mutation = useMutation({
    mutationFn: () => {
      const payload = {
        ...form,
        estimated_cost: Number(form.estimated_cost),
        sanctioned_amount: form.sanctioned_amount
          ? Number(form.sanctioned_amount)
          : null,
        ward_id: form.ward_id || null,
        start_date: form.start_date || null,
        scheduled_completion_date: form.scheduled_completion_date || null,
      };
      return id ? updateProject(id, payload) : createProject(payload);
    },
    onSuccess: (result) => {
      toast.success(id ? "Project updated." : "Project created.");
      navigate({ to: "/projects/project-detail", search: { id: result.id } });
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
  if (
    !["super-admin", "mp-staff", "constituency-coordinator"].includes(
      user?.role_slug ?? "",
    )
  )
    return (
      <Card className="m-8 p-8 text-center text-destructive">
        You do not have permission to manage projects.
      </Card>
    );
  if (id && project.isLoading)
    return <div className="p-8 text-muted-foreground">Loading project…</div>;
  return (
    <>
      <PageHeader
        title={id ? "Edit Project" : "New Project"}
        description="Validated constituency development project record."
      />
      <form
        className="p-4 md:p-8"
        onSubmit={(event) => {
          event.preventDefault();
          mutation.mutate();
        }}
      >
        <Card className="grid gap-4 p-5 md:grid-cols-2">
          <Field label="Project name">
            <Input
              required
              minLength={3}
              value={form.name}
              onChange={(e) => change("name", e.target.value)}
            />
          </Field>
          <LookupField
            label="Project type"
            value={form.project_type_id}
            rows={types.data?.data}
            onChange={(v) => change("project_type_id", v)}
          />
          <LookupField
            label="Category"
            value={form.project_category_id}
            rows={categories.data?.data}
            onChange={(v) => change("project_category_id", v)}
          />
          <Field label="Status">
            <Select
              value={form.status}
              onValueChange={(value) => change("status", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[
                  "proposed",
                  "approved",
                  "in_progress",
                  "completed",
                  "delayed",
                  "at_risk",
                  "cancelled",
                ].map((value) => (
                  <SelectItem key={value} value={value}>
                    {value.replaceAll("_", " ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Estimated cost">
            <Input
              required
              type="number"
              min="0"
              step="0.01"
              value={form.estimated_cost}
              onChange={(e) => change("estimated_cost", e.target.value)}
            />
          </Field>
          <Field label="Sanctioned amount">
            <Input
              type="number"
              min="0"
              step="0.01"
              value={form.sanctioned_amount}
              onChange={(e) => change("sanctioned_amount", e.target.value)}
            />
          </Field>
          <LookupField
            label="Department"
            value={form.department_id}
            rows={departments.data?.data}
            onChange={(v) => change("department_id", v)}
          />
          <LookupField
            label="Agency"
            value={form.agency_id}
            rows={agencies.data?.data}
            onChange={(v) => change("agency_id", v)}
          />
          <Location
            label="Constituency"
            value={form.constituency_id}
            rows={constituencies.data}
            onChange={(value) =>
              setForm((v) => ({
                ...v,
                constituency_id: value,
                assembly_constituency_id: "",
                mandal_id: "",
                village_id: "",
                ward_id: "",
              }))
            }
          />
          <Location
            label="Assembly"
            value={form.assembly_constituency_id}
            rows={assemblies.data}
            onChange={(value) =>
              setForm((v) => ({
                ...v,
                assembly_constituency_id: value,
                mandal_id: "",
                village_id: "",
                ward_id: "",
              }))
            }
          />
          <Location
            label="Mandal"
            value={form.mandal_id}
            rows={mandals.data}
            onChange={(value) =>
              setForm((v) => ({
                ...v,
                mandal_id: value,
                village_id: "",
                ward_id: "",
              }))
            }
          />
          <Location
            label="Village"
            value={form.village_id}
            rows={villages.data}
            required
            onChange={(value) =>
              setForm((v) => ({ ...v, village_id: value, ward_id: "" }))
            }
          />
          <Location
            label="Ward (optional)"
            value={form.ward_id}
            rows={wards.data}
            onChange={(value) => change("ward_id", value)}
          />
          <Field label="Location description">
            <Input
              value={form.location}
              onChange={(e) => change("location", e.target.value)}
            />
          </Field>
          <Field label="Start date">
            <Input
              type="date"
              value={form.start_date}
              onChange={(e) => change("start_date", e.target.value)}
            />
          </Field>
          <Field label="Scheduled completion">
            <Input
              type="date"
              value={form.scheduled_completion_date}
              onChange={(e) =>
                change("scheduled_completion_date", e.target.value)
              }
            />
          </Field>
          <div />
          <div />
          <div className="md:col-span-2">
            <Field label="Description">
              <Textarea
                value={form.description}
                onChange={(e) => change("description", e.target.value)}
              />
            </Field>
          </div>
          <div className="md:col-span-2">
            <Field label="Remarks">
              <Textarea
                value={form.remarks}
                onChange={(e) => change("remarks", e.target.value)}
              />
            </Field>
          </div>
          <div className="md:col-span-2 flex justify-end">
            <Button disabled={mutation.isPending}>
              {mutation.isPending ? "Saving…" : "Save project"}
            </Button>
          </div>
        </Card>
      </form>
    </>
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
function Location({
  label,
  value,
  rows,
  onChange,
  required = false,
}: {
  label: string;
  value: string;
  rows?: Array<Record<string, unknown>>;
  onChange: (value: string) => void;
  required?: boolean;
}) {
  return (
    <Field label={label}>
      <Select value={value} onValueChange={onChange} required={required}>
        <SelectTrigger>
          <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
        </SelectTrigger>
        <SelectContent>
          {(rows ?? []).map((row) => (
            <SelectItem key={String(row.id)} value={String(row.id)}>
              {String(row.name)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Field>
  );
}

function LookupField({
  label,
  value,
  rows,
  onChange,
}: {
  label: string;
  value: string;
  rows?: Array<{ id: string; name: string; code: string }>;
  onChange: (value: string) => void;
}) {
  return (
    <Field label={label}>
      <Select value={value} onValueChange={onChange} required>
        <SelectTrigger>
          <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
        </SelectTrigger>
        <SelectContent>
          {(rows ?? []).map((row) => (
            <SelectItem key={row.id} value={row.id}>
              {row.name} ({row.code})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Field>
  );
}

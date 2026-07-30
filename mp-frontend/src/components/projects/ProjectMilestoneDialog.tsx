import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getApiErrorMessage,
  saveProjectMilestone,
  type ProjectMilestoneRecord,
} from "@/lib/api";
import { toast } from "sonner";
export function ProjectMilestoneDialog({
  projectId,
  milestone,
}: {
  projectId: string;
  milestone?: ProjectMilestoneRecord;
}) {
  const client = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: milestone?.name ?? "",
    description: milestone?.description ?? "",
    target_date: date(milestone?.target_date),
    actual_date: date(milestone?.actual_date),
    target_percentage: String(milestone?.target_percentage ?? ""),
    status: milestone?.status ?? "pending",
    budget: String(milestone?.budget ?? ""),
    actual_cost: String(milestone?.actual_cost ?? 0),
    deliverables: milestone?.deliverables ?? "",
  });
  const change = (key: keyof typeof form, value: string) =>
    setForm((current) => ({ ...current, [key]: value }));
  const mutation = useMutation({
    mutationFn: () =>
      saveProjectMilestone(
        projectId,
        {
          ...form,
          target_percentage: form.target_percentage
            ? Number(form.target_percentage)
            : null,
          budget: form.budget ? Number(form.budget) : null,
          actual_cost: Number(form.actual_cost),
          actual_date: form.actual_date || null,
        },
        milestone?.id,
      ),
    onSuccess: async () => {
      toast.success(milestone ? "Milestone updated." : "Milestone created.");
      setOpen(false);
      await client.invalidateQueries({
        queryKey: ["project-detail", projectId],
      });
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant={milestone ? "ghost" : "outline"}>
          {milestone ? (
            <Pencil className="h-3.5 w-3.5" />
          ) : (
            <>
              <Plus className="mr-1 h-4 w-4" />
              Add milestone
            </>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {milestone ? "Edit milestone" : "Add milestone"}
          </DialogTitle>
          <DialogDescription>
            Track a dated, measurable project deliverable.
          </DialogDescription>
        </DialogHeader>
        <form
          className="space-y-3"
          onSubmit={(event) => {
            event.preventDefault();
            mutation.mutate();
          }}
        >
          <Field label="Name">
            <Input
              required
              value={form.name}
              onChange={(e) => change("name", e.target.value)}
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Target date">
              <Input
                required
                type="date"
                value={form.target_date}
                onChange={(e) => change("target_date", e.target.value)}
              />
            </Field>
            <Field label="Actual date">
              <Input
                type="date"
                value={form.actual_date}
                onChange={(e) => change("actual_date", e.target.value)}
              />
            </Field>
            <Field label="Target %">
              <Input
                type="number"
                min="0"
                max="100"
                value={form.target_percentage}
                onChange={(e) => change("target_percentage", e.target.value)}
              />
            </Field>
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
                    "pending",
                    "in_progress",
                    "completed",
                    "delayed",
                    "cancelled",
                  ].map((value) => (
                    <SelectItem key={value} value={value}>
                      {value.replaceAll("_", " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Budget">
              <Input
                type="number"
                min="0"
                step="0.01"
                value={form.budget}
                onChange={(e) => change("budget", e.target.value)}
              />
            </Field>
            <Field label="Actual cost">
              <Input
                type="number"
                min="0"
                step="0.01"
                value={form.actual_cost}
                onChange={(e) => change("actual_cost", e.target.value)}
              />
            </Field>
          </div>
          <Field label="Description">
            <Textarea
              value={form.description}
              onChange={(e) => change("description", e.target.value)}
            />
          </Field>
          <Field label="Deliverables">
            <Textarea
              value={form.deliverables}
              onChange={(e) => change("deliverables", e.target.value)}
            />
          </Field>
          <Button className="w-full" disabled={mutation.isPending}>
            {mutation.isPending ? "Saving…" : "Save milestone"}
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
function date(value?: string | null) {
  return value?.slice(0, 10) ?? "";
}

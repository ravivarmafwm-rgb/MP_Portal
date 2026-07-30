import { useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import {
  getApiErrorMessage,
  saveProjectBudget,
  type ProjectBudgetRecord,
} from "@/lib/api";

export function ProjectBudgetDialog({
  projectId,
  budget,
}: {
  projectId: string;
  budget?: ProjectBudgetRecord;
}) {
  const client = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    budget_head: budget?.budget_head ?? "",
    description: budget?.description ?? "",
    allocated_amount: String(budget?.allocated_amount ?? ""),
    revised_amount: String(budget?.revised_amount ?? ""),
    utilized_amount: String(budget?.utilized_amount ?? 0),
    status: budget?.status ?? "active",
    allocation_date: budget?.allocation_date?.slice(0, 10) ?? "",
  });
  const change = (key: keyof typeof form, value: string) =>
    setForm((current) => ({ ...current, [key]: value }));
  const mutation = useMutation({
    mutationFn: () =>
      saveProjectBudget(
        projectId,
        {
          ...form,
          allocated_amount: Number(form.allocated_amount),
          revised_amount: form.revised_amount
            ? Number(form.revised_amount)
            : null,
          utilized_amount: Number(form.utilized_amount),
          allocation_date: form.allocation_date || null,
        },
        budget?.id,
      ),
    onSuccess: async () => {
      toast.success(budget ? "Budget head updated." : "Budget head created.");
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
        <Button size="sm" variant={budget ? "ghost" : "outline"}>
          {budget ? (
            <Pencil className="h-3.5 w-3.5" />
          ) : (
            <>
              <Plus className="mr-1 h-4 w-4" />
              Add budget head
            </>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {budget ? "Edit budget head" : "Add budget head"}
          </DialogTitle>
          <DialogDescription>
            Amounts are validated against the project sanction.
          </DialogDescription>
        </DialogHeader>
        <form
          className="space-y-3"
          onSubmit={(event) => {
            event.preventDefault();
            mutation.mutate();
          }}
        >
          <Field label="Budget head">
            <Input
              required
              value={form.budget_head}
              onChange={(e) => change("budget_head", e.target.value)}
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Allocated">
              <Input
                required
                type="number"
                min="0"
                step="0.01"
                value={form.allocated_amount}
                onChange={(e) => change("allocated_amount", e.target.value)}
              />
            </Field>
            <Field label="Revised">
              <Input
                type="number"
                min="0"
                step="0.01"
                value={form.revised_amount}
                onChange={(e) => change("revised_amount", e.target.value)}
              />
            </Field>
            <Field label="Utilized">
              <Input
                required
                type="number"
                min="0"
                step="0.01"
                value={form.utilized_amount}
                onChange={(e) => change("utilized_amount", e.target.value)}
              />
            </Field>
            <Field label="Allocation date">
              <Input
                type="date"
                value={form.allocation_date}
                onChange={(e) => change("allocation_date", e.target.value)}
              />
            </Field>
          </div>
          <Field label="Status">
            <Select
              value={form.status}
              onValueChange={(value) => change("status", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["active", "closed", "suspended"].map((value) => (
                  <SelectItem key={value} value={value}>
                    {value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Description">
            <Textarea
              value={form.description}
              onChange={(e) => change("description", e.target.value)}
            />
          </Field>
          <Button className="w-full" disabled={mutation.isPending}>
            {mutation.isPending ? "Saving..." : "Save budget head"}
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

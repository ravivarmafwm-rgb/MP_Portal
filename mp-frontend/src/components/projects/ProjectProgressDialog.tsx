import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TrendingUp } from "lucide-react";
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
  createProjectProgress,
  getApiErrorMessage,
  type ProjectRecord,
} from "@/lib/api";
import { toast } from "sonner";
export function ProjectProgressDialog({ project }: { project: ProjectRecord }) {
  const client = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    progress_percentage: String(project.progress_percentage ?? 0),
    expenditure: String(project.expenditure ?? 0),
    work_done: "",
    challenges: "",
    next_steps: "",
    update_date: new Date().toISOString().slice(0, 10),
  });
  const change = (key: keyof typeof form, value: string) =>
    setForm((current) => ({ ...current, [key]: value }));
  const mutation = useMutation({
    mutationFn: () =>
      createProjectProgress(project.id, {
        ...form,
        progress_percentage: Number(form.progress_percentage),
        expenditure: Number(form.expenditure),
      }),
    onSuccess: async () => {
      toast.success("Project progress recorded.");
      setOpen(false);
      await Promise.all([
        client.invalidateQueries({ queryKey: ["project-detail", project.id] }),
        client.invalidateQueries({ queryKey: ["projects-dev"] }),
        client.invalidateQueries({ queryKey: ["project-stats"] }),
      ]);
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <TrendingUp className="mr-1 h-4 w-4" />
          Record progress
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Record project progress</DialogTitle>
          <DialogDescription>
            Enter cumulative progress and expenditure. Values cannot move
            backwards.
          </DialogDescription>
        </DialogHeader>
        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            mutation.mutate();
          }}
        >
          <div className="grid grid-cols-2 gap-3">
            <Field label="Progress %">
              <Input
                type="number"
                min={Number(project.progress_percentage ?? 0)}
                max="100"
                step="0.01"
                required
                value={form.progress_percentage}
                onChange={(e) => change("progress_percentage", e.target.value)}
              />
            </Field>
            <Field label="Cumulative expenditure">
              <Input
                type="number"
                min={Number(project.expenditure ?? 0)}
                step="0.01"
                required
                value={form.expenditure}
                onChange={(e) => change("expenditure", e.target.value)}
              />
            </Field>
          </div>
          <Field label="Update date">
            <Input
              type="date"
              max={new Date().toISOString().slice(0, 10)}
              required
              value={form.update_date}
              onChange={(e) => change("update_date", e.target.value)}
            />
          </Field>
          <Field label="Work completed">
            <Textarea
              required
              minLength={5}
              value={form.work_done}
              onChange={(e) => change("work_done", e.target.value)}
            />
          </Field>
          <Field label="Challenges">
            <Textarea
              value={form.challenges}
              onChange={(e) => change("challenges", e.target.value)}
            />
          </Field>
          <Field label="Next steps">
            <Textarea
              value={form.next_steps}
              onChange={(e) => change("next_steps", e.target.value)}
            />
          </Field>
          <Button className="w-full" disabled={mutation.isPending}>
            {mutation.isPending ? "Saving…" : "Save progress update"}
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

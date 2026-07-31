import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { saveProjectWorkflow, getApiErrorMessage } from "@/lib/api";
import { toast } from "sonner";
export function ProjectWorkflowDialog({ projectId }: { projectId: string }) {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState("work_order");
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("pending");
  const [reference, setReference] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");
  const client = useQueryClient();
  const mutation = useMutation({
    mutationFn: () =>
      saveProjectWorkflow(projectId, {
        entry_type: type,
        title,
        status,
        reference_number: reference || null,
        amount: amount ? Number(amount) : null,
        entry_date: date || null,
        notes: notes || null,
      }),
    onSuccess: () => {
      toast.success("Workflow record saved.");
      setOpen(false);
      client.invalidateQueries({ queryKey: ["project-workflow", projectId] });
    },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  });
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">Add record</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add project workflow record</DialogTitle>
        </DialogHeader>
        <div className="grid gap-3">
          <div>
            <Label>Type</Label>
            <select
              className="h-10 w-full rounded-md border bg-background px-3 text-sm"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              {[
                "work_order",
                "administrative_sanction",
                "technical_sanction",
                "financial_sanction",
                "tender",
                "fund_release",
                "expenditure",
                "inspection",
                "site_visit",
                "approval",
              ].map((v) => (
                <option key={v} value={v}>
                  {v.replaceAll("_", " ")}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label>Title</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={255}
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label>Reference</Label>
              <Input
                value={reference}
                onChange={(e) => setReference(e.target.value)}
              />
            </div>
            <div>
              <Label>Status</Label>
              <select
                className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                {[
                  "pending",
                  "submitted",
                  "approved",
                  "rejected",
                  "in_progress",
                  "completed",
                  "cancelled",
                ].map((v) => (
                  <option key={v} value={v}>
                    {v.replaceAll("_", " ")}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label>Amount</Label>
              <Input
                type="number"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            <div>
              <Label>Date</Label>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </div>
          <div>
            <Label>Notes</Label>
            <Input
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              maxLength={10000}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            disabled={mutation.isPending || !title.trim()}
            onClick={() => mutation.mutate()}
          >
            {mutation.isPending ? "Saving…" : "Save record"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

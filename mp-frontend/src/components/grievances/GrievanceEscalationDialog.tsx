import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowUpRight } from "lucide-react";
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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { escalateGrievance, getApiErrorMessage } from "@/lib/api";

const reasons = [
  ["non_response", "Officer or department non-response"],
  ["priority_change", "Priority or severity changed"],
  ["citizen_request", "Citizen requested escalation"],
  ["management_review", "Management review"],
  ["other", "Other documented reason"],
] as const;

export function GrievanceEscalationDialog({
  grievanceId,
}: {
  grievanceId: string;
}) {
  const client = useQueryClient();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const escalation = useMutation({
    mutationFn: () => escalateGrievance(grievanceId, { reason, description }),
    onSuccess: async () => {
      toast.success("Grievance escalated and leadership notified.");
      setOpen(false);
      setReason("");
      setDescription("");
      await Promise.all([
        client.invalidateQueries({
          queryKey: ["grievance-detail", grievanceId],
        }),
        client.invalidateQueries({ queryKey: ["grievances-escalated"] }),
        client.invalidateQueries({ queryKey: ["grievance-stats"] }),
      ]);
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="gap-1.5">
          <ArrowUpRight className="h-4 w-4" />
          Escalate
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Escalate grievance</DialogTitle>
          <DialogDescription>
            This creates a persisted escalation, public case update, audit
            record, and leadership notification.
          </DialogDescription>
        </DialogHeader>
        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            escalation.mutate();
          }}
        >
          <div>
            <Label>Reason</Label>
            <Select required value={reason} onValueChange={setReason}>
              <SelectTrigger>
                <SelectValue placeholder="Select escalation reason" />
              </SelectTrigger>
              <SelectContent>
                {reasons.map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="escalation-description">Details</Label>
            <Textarea
              id="escalation-description"
              required
              maxLength={3000}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
          </div>
          <Button
            className="w-full"
            disabled={escalation.isPending || !reason || !description.trim()}
          >
            {escalation.isPending ? "Escalating..." : "Escalate and notify"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
